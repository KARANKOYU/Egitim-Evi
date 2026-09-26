'use strict';
/* Okulun kapattığı özellikler (022).

   Her API isteğinde "bu bölüm bu okulda açık mı" diye bakılır; bunun için
   veritabanına gidilmez: tablo küçüktür (okul başına en fazla 8 satır),
   açılışta belleğe okunur, müdür değiştirince bellek de güncellenir.
   Tek süreçli sunucu için yeterli; yedekten geri yüklemeden sonra yeniden okunur. */

const { sorgu, calistir, islem } = require('../baglanti');

/* Sıra ekrandaki sırasıdır. */
const OZELLIKLER = [
  { k: 'odev', ad: 'Ödevler', aciklama: 'Ödev verme ve sonuçlandırma, teslim dosyaları, ödev ekleri, ödev hatırlatmaları.' },
  { k: 'sinav', ad: 'Sınavlar', aciklama: 'Sınav ve sınav grupları, not girişi, öğrencinin sınav grafiği.' },
  { k: 'devamsizlik', ad: 'Devamsızlık', aciklama: 'Ders yoklaması, devamsızlık dökümü, veliye devamsızlık bildirimi.' },
  { k: 'etut', ad: 'Etütler', aciklama: 'Etüt programı ve etüt yoklaması.' },
  { k: 'servis', ad: 'Servis', aciklama: 'Servisler, duraklar, servis haritası ve canlı servis konumu.' },
  { k: 'yemek', ad: 'Yemek listesi', aciklama: 'Günlük yemek listesi.' },
  { k: 'kulup', ad: 'Kulüpler', aciklama: 'Kulüpler, danışmanlar ve kulüp üyelikleri.' },
  { k: 'anket', ad: 'Anketler', aciklama: 'Okul anketleri ve oylama.' }
];
const ANAHTARLAR = OZELLIKLER.map(o => o.k);

/* okulId -> Set(kapalı özellik) */
let bellek = new Map();

async function yukle() {
  const yeni = new Map();
  for (const r of await sorgu('SELECT okul_id, ozellik FROM okul_kapali_ozellikler')) {
    if (!yeni.has(r.okul_id)) yeni.set(r.okul_id, new Set());
    yeni.get(r.okul_id).add(r.ozellik);
  }
  bellek = yeni;
}

/* Okulun kapalı özellikleri (sıralı dizi). */
function kapalilar(okulId) {
  const s = okulId && bellek.get(okulId);
  return s ? ANAHTARLAR.filter(k => s.has(k)) : [];
}

const kapaliMi = (okulId, ozellik) => !!okulId && !!bellek.get(okulId) && bellek.get(okulId).has(ozellik);

/* Okulun kapalı listesini baştan yazar. */
async function yaz(okulId, kapali, kapatanId) {
  const liste = ANAHTARLAR.filter(k => kapali.indexOf(k) >= 0);
  await islem(async () => {
    await calistir('DELETE FROM okul_kapali_ozellikler WHERE okul_id = $1', [okulId]);
    for (const k of liste) {
      await calistir('INSERT INTO okul_kapali_ozellikler (okul_id, ozellik, kapatan_id) VALUES ($1, $2, $3)',
        [okulId, k, kapatanId || null]);
    }
  });
  if (liste.length) bellek.set(okulId, new Set(liste)); else bellek.delete(okulId);
  return liste;
}

module.exports = { OZELLIKLER, ANAHTARLAR, yukle, kapalilar, kapaliMi, yaz };
