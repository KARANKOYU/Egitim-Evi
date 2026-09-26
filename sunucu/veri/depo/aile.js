'use strict';
/* Eğitim Evi Aile verisi: cihazlar, konumlar, uygulama kullanımı, velinin
   ayarları ve sınırları (şema 026). 7 günden eski konum ve kullanım silinir. */

const { sorgu, tek, calistir, islem } = require('../baglanti');

const SAKLAMA_GUN = 7;

const cihaz = r => r && ({
  id: r.id, ogrenciId: r.ogrenci_id, ad: r.ad, platform: r.platform, surum: r.surum,
  sonGorulme: r.son_gorulme, olusturma: r.olusturma
});

async function cihazEkle(d) {
  await calistir('INSERT INTO aile_cihazlari (id, ogrenci_id, anahtar_ozeti, ad, platform, surum) VALUES ($1, $2, $3, $4, $5, $6)',
    [d.id, d.ogrenciId, d.ozet, d.ad, d.platform, d.surum]);
  /* Öğrenci başına en fazla 3 cihaz: en eskiler düşer. */
  await calistir('DELETE FROM aile_cihazlari WHERE ogrenci_id = $1 AND id NOT IN ' +
    '(SELECT id FROM aile_cihazlari WHERE ogrenci_id = $1 ORDER BY olusturma DESC LIMIT 3)', [d.ogrenciId]);
}

async function cihazOzetle(ozet) {
  return cihaz(await tek('SELECT * FROM aile_cihazlari WHERE anahtar_ozeti = $1', [ozet]));
}

async function cihazGoruldu(id) {
  await calistir('UPDATE aile_cihazlari SET son_gorulme = now() WHERE id = $1', [id]);
}

async function cihazSil(id) {
  await calistir('DELETE FROM aile_cihazlari WHERE id = $1', [id]);
}

async function cihazlari(ogrenciId) {
  return (await sorgu('SELECT * FROM aile_cihazlari WHERE ogrenci_id = $1 ORDER BY olusturma DESC', [ogrenciId])).map(cihaz);
}

/* ---------------- ayarlar ---------------- */
async function ayar(ogrenciId) {
  const r = await tek('SELECT * FROM aile_ayarlari WHERE ogrenci_id = $1', [ogrenciId]);
  return {
    wifiDk: r ? r.wifi_dk : 5, mobilDk: r ? r.mobil_dk : 15,
    konumAcik: r ? r.konum_acik : true, kullanimAcik: r ? r.kullanim_acik : true,
    toplamSinir: r && r.toplam_sinir !== null ? r.toplam_sinir : null
  };
}

async function sinirlari(ogrenciId) {
  return (await sorgu('SELECT paket, ad, dakika FROM aile_sinirlari WHERE ogrenci_id = $1 ORDER BY ad', [ogrenciId]))
    .map(r => ({ paket: r.paket, ad: r.ad, dakika: r.dakika }));
}

/* Ayar ve sınırlar birlikte, tek işlemde (sınırların hepsi yenilenir). */
async function ayarYaz(ogrenciId, a, sinirlar, veliId) {
  await islem(async () => {
    await sorgu('INSERT INTO aile_ayarlari (ogrenci_id, wifi_dk, mobil_dk, konum_acik, kullanim_acik, toplam_sinir, guncelleyen, guncelleme) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, now()) ON CONFLICT (ogrenci_id) DO UPDATE SET wifi_dk = EXCLUDED.wifi_dk, ' +
      'mobil_dk = EXCLUDED.mobil_dk, konum_acik = EXCLUDED.konum_acik, kullanim_acik = EXCLUDED.kullanim_acik, ' +
      'toplam_sinir = EXCLUDED.toplam_sinir, guncelleyen = EXCLUDED.guncelleyen, guncelleme = now()',
      [ogrenciId, a.wifiDk, a.mobilDk, a.konumAcik, a.kullanimAcik, a.toplamSinir, veliId]);
    await sorgu('DELETE FROM aile_sinirlari WHERE ogrenci_id = $1', [ogrenciId]);
    if (sinirlar.length) {
      await sorgu('INSERT INTO aile_sinirlari (ogrenci_id, paket, ad, dakika) SELECT $1, p, a, d ' +
        'FROM unnest($2::text[], $3::text[], $4::int[]) AS x(p, a, d)',
        [ogrenciId, sinirlar.map(s => s.paket), sinirlar.map(s => s.ad), sinirlar.map(s => s.dakika)]);
    }
  });
}

/* ---------------- konum ---------------- */
async function konumEkle(ogrenciId, cihazId, liste) {
  if (!liste.length) return 0;
  const r = await sorgu(
    'INSERT INTO aile_konumlari (ogrenci_id, cihaz_id, enlem, boylam, dogruluk, ag, pil, zaman) ' +
    'SELECT $1, $2, e, b, d, a, p, z FROM unnest($3::float8[], $4::float8[], $5::int[], $6::text[], $7::int[], $8::timestamptz[]) ' +
    'AS x(e, b, d, a, p, z) ON CONFLICT (ogrenci_id, zaman) DO NOTHING RETURNING id',
    [ogrenciId, cihazId, liste.map(k => k.enlem), liste.map(k => k.boylam), liste.map(k => k.dogruluk),
      liste.map(k => k.ag), liste.map(k => k.pil), liste.map(k => k.zaman)]);
  return r.length;
}

async function sonKonumlar(ogrenciId, adet) {
  return (await sorgu('SELECT enlem, boylam, dogruluk, ag, pil, zaman FROM aile_konumlari WHERE ogrenci_id = $1 ' +
    'ORDER BY zaman DESC LIMIT $2', [ogrenciId, adet])).map(r => ({
    enlem: Number(r.enlem), boylam: Number(r.boylam), dogruluk: r.dogruluk, ag: r.ag, pil: r.pil, zaman: r.zaman
  }));
}

/* ---------------- kullanım ---------------- */
async function kullanimYaz(ogrenciId, satirlar) {
  if (!satirlar.length) return;
  await sorgu('INSERT INTO aile_kullanim (ogrenci_id, gun, paket, ad, dakika) ' +
    'SELECT $1, g, p, a, d FROM unnest($2::date[], $3::text[], $4::text[], $5::int[]) AS x(g, p, a, d) ' +
    'ON CONFLICT (ogrenci_id, gun, paket) DO UPDATE SET ad = EXCLUDED.ad, dakika = EXCLUDED.dakika',
    [ogrenciId, satirlar.map(s => s.gun), satirlar.map(s => s.paket), satirlar.map(s => s.ad), satirlar.map(s => s.dakika)]);
}

/* Son 8 günün (bugün dahil) satırları: [{ gun, paket, ad, dakika }] */
async function kullanimlari(ogrenciId, enEskiGun) {
  return (await sorgu("SELECT to_char(gun, 'YYYY-MM-DD') AS gun, paket, ad, dakika FROM aile_kullanim " +
    'WHERE ogrenci_id = $1 AND gun >= $2::date ORDER BY gun, dakika DESC', [ogrenciId, enEskiGun]))
    .map(r => ({ gun: r.gun, paket: r.paket, ad: r.ad, dakika: r.dakika }));
}

/* Sınır bildirimi bugün bu anahtar için gitti mi? İlk kez ise true döner ve işaretler. */
async function uyariIlkMi(ogrenciId, gun, anahtar) {
  const r = await sorgu('INSERT INTO aile_uyarilari (ogrenci_id, gun, anahtar) VALUES ($1, $2::date, $3) ' +
    'ON CONFLICT DO NOTHING RETURNING anahtar', [ogrenciId, gun, anahtar]);
  return r.length > 0;
}

/* 7 günden eski konum, kullanım ve uyarı kayıtları silinir. */
async function temizle() {
  await calistir("DELETE FROM aile_konumlari WHERE zaman < now() - interval '7 days'");
  await calistir("DELETE FROM aile_kullanim WHERE gun < current_date - 7");
  await calistir("DELETE FROM aile_uyarilari WHERE gun < current_date - 7");
}

module.exports = {
  SAKLAMA_GUN, cihazEkle, cihazOzetle, cihazGoruldu, cihazSil, cihazlari, ayar, sinirlari, ayarYaz,
  konumEkle, sonKonumlar, kullanimYaz, kullanimlari, uyariIlkMi, temizle
};
