'use strict';
/* JSON <-> veritabanı.

   iceAktar(veri): eski data/db.json dosyasını ya da bir yedek dosyasını
   veritabanına yazar. Önce bütün tablolar boşaltılır; hepsi tek işlemdedir,
   yarıda hata olursa hiçbir şey değişmez.
   disaAktar(): bütün veriyi aynı biçimde (users, schools, assignments...)
   tek bir nesneye döker. Yedekler bu biçimde saklanır; elle okunabilir ve
   eski sürümün yedekleri de geri yüklenebilir.

   Eski veride kopuk bağlantılar olabilir (silinmiş bir öğretmenin ödevi,
   silinmiş bir sınıfın dersi). Yabancı anahtar kuralları bunları kabul
   etmeyeceği için aktarım sırasında temizlenir: kopuk yazar bağı boşa
   düşer, kopuk "sahip" bağı olan kayıt atlanır. Kaç kaydın atlandığı
   rapor edilir. */

const crypto = require('crypto');
const { sorgu, islem, metinCalistir } = require('./baglanti');
const { ESKI_SAATLER, kisaAdSorunu, kullaniciAdiSorunu, makeCode, normTelefon, okulHesabiMi, tcSorunu, uid } = require('../ortak');
const e = require('./esleme');
const yaz = require('./yazici');

const TABLOLAR = [
  'okullar', 'egitim_yillari', 'siniflar', 'roller', 'rol_yetkileri', 'rol_yetki_kapsamlari',
  'kullanicilar', 'mesaj_engelleri', 'veli_baglari', 'dersler', 'ders_programi',
  'odevler', 'odev_siniflari', 'odev_ogrencileri',
  'sinav_sablonlari', 'sablon_olcumleri', 'sinav_gruplari', 'sinavlar', 'sinav_olcumleri', 'sinav_degerleri',
  'devamsizlik', 'mesajlar', 'mesaj_alicilari', 'mesaj_okumalari', 'takvim_etkinlikleri',
  'bildirimler', 'oturumlar', 'hatirlatmalar', 'islem_kaydi',
  'anketler', 'anket_secenekleri', 'anket_hedefleri', 'anket_oylari',
  'yemek_listesi', 'servisler', 'servis_ogrencileri', 'kulupler', 'kulup_uyeleri', 'odev_dosyalari',
  'ogrenci_konumlari', 'etutler', 'etut_ogrencileri', 'etut_yoklamalari', 'okul_sayfalari', 'okul_fotolari', 'yorumlar',
  'ogrenci_gecmisi', 'okul_kapali_ozellikler', 'hatirlaticilar', 'hatirlatici_gunleri',
  /* Eğitim Evi Aile: 7 günlük geçici veri; yedeğe ve dışarı aktarıma girmez, içeri
     aktarımda boşaltılır. */
  'aile_cihazlari', 'aile_konumlari', 'aile_kullanim', 'aile_ayarlari', 'aile_sinirlari', 'aile_uyarilari'
];

/* ---------- küçük doğrulayıcılar ---------- */
const dizi = v => Array.isArray(v) ? v : [];
const metin = (v, max) => String(v === null || v === undefined ? '' : v).slice(0, max || 10000);
const gun = v => {
  const s = String(v || '').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s + 'T00:00:00Z')) ? s : null;
};
const saat = v => {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(v || ''));
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return null;
  return (m[1].length === 1 ? '0' : '') + m[1] + ':' + m[2];
};
const dakika = s => { const p = s.split(':'); return Number(p[0]) * 60 + Number(p[1]); };
const zaman = v => {
  const t = Date.parse(v);
  return isNaN(t) ? new Date().toISOString() : new Date(t).toISOString();
};
const secim = (v, liste, varsayilan) => liste.indexOf(v) >= 0 ? v : varsayilan;
const sayi = v => (typeof v === 'number' && isFinite(v)) ? v : (isFinite(Number(v)) && v !== '' && v !== null ? Number(v) : null);

/* Tablo ve sütun adları koddan gelir; yazici adları yine de doğrular. */
const ekle = (tablo, satir) => yaz.ekle(tablo, satir);

/* Geri yüklemeden sonra aboneliklerin sahibi hâlâ varsa geri yazılır. */
async function abonelikleriGeriYaz(liste) {
  for (const a of liste) {
    await sorgu(
      'INSERT INTO push_abonelikleri (id, kullanici_id, endpoint, p256dh, auth, olusturma, son_basari) ' +
      'SELECT $1, $2, $3, $4, $5, $6, $7 WHERE EXISTS (SELECT 1 FROM kullanicilar WHERE id = $2) ON CONFLICT DO NOTHING',
      [a.id, a.kullanici_id, a.endpoint, a.p256dh, a.auth, a.olusturma, a.son_basari]);
  }
}

module.exports = { TABLOLAR, iceAktar, disaAktar };
