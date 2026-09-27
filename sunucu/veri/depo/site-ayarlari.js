'use strict';
/* Site ayarları (030): /admin > "Site ayarları".

   Tablo küçüktür (birkaç satır). Açılışta belleğe okunur; yönetici bir ayarı
   değiştirince bellek de hemen güncellenir: ayar sunucu yeniden başlamadan
   geçerli olur. Tek süreçli sunucu varsayılır (birden çok süreç aynı
   veritabanını kullansaydı öbür süreçler ancak yeniden açılınca görürdü).
   Anlamları, öncelik (veritabanı > data/config.yml > varsayılan) ve
   doğrulama: sunucu/site.js ve sunucu/bolumler/site-ayarlari.js. */

const { sorgu, tek, calistir } = require('../baglanti');

/* anahtar -> { deger, guncelleyenId, guncelleyenAd, zaman } */
let bellek = new Map();

const satirdan = r => ({
  deger: r.deger, guncelleyenId: r.guncelleyen_id || '', guncelleyenAd: r.guncelleyen_ad || '',
  zaman: r.guncelleme ? new Date(r.guncelleme).toISOString() : null
});

async function yukle() {
  const yeni = new Map();
  for (const r of await sorgu('SELECT anahtar, deger, guncelleyen_id, guncelleyen_ad, guncelleme FROM site_ayarlari')) {
    yeni.set(r.anahtar, satirdan(r));
  }
  bellek = yeni;
}

/* Veritabanındaki kayıt ya da null (bellekten; veritabanına gidilmez). */
const oku = anahtar => bellek.get(anahtar) || null;

/* Değeri yazar (yoksa ekler). kisi: { id, fullName } */
async function yaz(anahtar, deger, kisi) {
  const r = await tek(
    'INSERT INTO site_ayarlari (anahtar, deger, guncelleyen_id, guncelleyen_ad, guncelleme) VALUES ($1, $2::jsonb, $3, $4, now()) ' +
    'ON CONFLICT (anahtar) DO UPDATE SET deger = EXCLUDED.deger, guncelleyen_id = EXCLUDED.guncelleyen_id, ' +
    '  guncelleyen_ad = EXCLUDED.guncelleyen_ad, guncelleme = EXCLUDED.guncelleme ' +
    'RETURNING anahtar, deger, guncelleyen_id, guncelleyen_ad, guncelleme',
    [anahtar, JSON.stringify(deger), (kisi && kisi.id) || null, (kisi && kisi.fullName) || '']);
  bellek.set(anahtar, satirdan(r));
  return bellek.get(anahtar);
}

/* Veritabanındaki değeri siler: ayar data/config.yml'deki (yoksa varsayılan) değere döner. */
async function sil(anahtar) {
  await calistir('DELETE FROM site_ayarlari WHERE anahtar = $1', [anahtar]);
  bellek.delete(anahtar);
}

module.exports = { yukle, oku, yaz, sil };
