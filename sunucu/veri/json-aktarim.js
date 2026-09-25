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

