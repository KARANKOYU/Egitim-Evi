'use strict';
/* Roller: roller + rol_yetkileri + rol_yetki_kapsamlari.

   İki tür rol vardır (013 şema dosyası):
     'ogretmen'  okulun hazır Öğretmen rolü; okuldaki her öğretmen bu rolün
                 yetkilerine sahiptir. Okul başına bir tane, silinmez.
     'ozel'      müdürün tanımladığı rol (Müdür Yardımcısı, Etüt Sorumlusu...);
                 öğretmene tek tek verilir.

   Bir rol nesnesi uygulamada şöyle görünür:
     { id, schoolId, name, tur, permissions: ['odev.ver', ...],
       kapsam: { 'odev.ver': { dersler: ['Matematik'], siniflar: ['*'] } } } */

const { sorgu, islem, tr } = require('../baglanti');
const e = require('../esleme');

/* Verilen rol kimliklerini yetki ve kapsamlarıyla birlikte yükler: Map(id -> rol). */
async function haritasi(idler, kisiSayisiyla) {
  const harita = new Map();
  if (!idler.length) return harita;
  const satirlar = await sorgu(
    'SELECT r.*' +
    (kisiSayisiyla ? ', (SELECT count(*) FROM kullanicilar k WHERE k.ozel_rol_id = r.id) AS kisi_sayisi' : '') +
    ' FROM roller r WHERE r.id = ANY($1::text[])', [idler]);
  const yetkiler = await sorgu('SELECT rol_id, yetki FROM rol_yetkileri WHERE rol_id = ANY($1::text[]) ORDER BY yetki', [idler]);
  const kapsamlar = await sorgu(
    'SELECT rol_id, yetki, tur, deger FROM rol_yetki_kapsamlari WHERE rol_id = ANY($1::text[]) ORDER BY deger', [idler]);
  for (const r of satirlar) {
    harita.set(r.id, e.rol(r,
      yetkiler.filter(y => y.rol_id === r.id).map(y => y.yetki),
      kapsamlar.filter(k => k.rol_id === r.id)));
  }
  return harita;
}

async function bul(id) {
  if (!id) return null;
  return (await haritasi([id], true)).get(id) || null;
}

/* Okulun rolleri: önce hazır Öğretmen rolü, sonra özel roller ada göre. */
async function okulun(okulId) {
  const idler = (await sorgu("SELECT id FROM roller WHERE okul_id = $1 ORDER BY (tur = 'ogretmen') DESC, ad" + tr(),
    [okulId])).map(r => r.id);
  const harita = await haritasi(idler, true);
  return idler.map(id => harita.get(id));
}

