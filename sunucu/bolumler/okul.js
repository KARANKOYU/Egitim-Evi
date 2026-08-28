'use strict';
/* Müdürün okul yönetimi (/api/school).
   Sınıflar, dersler, ders programı, öğrenci ve öğretmen hesapları,
   özel roller, Excel içe/dışa aktarım. */

const crypto = require('crypto');
const { tabloOku } = require('../yardimci/tablo-oku');
const aktarim = require('../yardimci/aktarim');
const { bad, baslikEkle, ok } = require('../http');
const {
  GUN_ADLARI, GUN_SAYISI, aralikCakismasi, branchOf, cakismalariBul, dersEtiketi,
  dersOzeti, isTeacherLike, saatDakika, saatDuzelt, sinifOzeti
} = require('../iliskiler');
const {
  SUBJECTS, adDuzelt, clean, dogumSorunu, gunTarih, kullaniciAdiSorunu, makeCode, normEmail,
  normKullaniciAdi, now, sifreSorunu, tcSorunu, uid
} = require('../ortak');
const { hizSinir } = require('../guvenlik');
const { hashPw, hashPwToplu } = require('../sifre');
const { depo, bildir, islem } = require('../veri');
const {
  OGRETMEN_VARSAYILAN, ROL_SABLONLARI, TUM_YETKILER, YETKILER, kapsamTemizle, ogrenciKapsamindaMi, pub, rolOzeti,
  roleById, yetkiVarMi
} = require('../yetki');
const { yilDamgasi, yilSuz } = require('./egitim-yili');
const hesaplar = require('./hesaplar');
const kisiAktarim = require('./kisi-aktarim');
const { islemYaz } = require('./islem-kaydi');
const { odevGecikti, odevSaati } = require('./odev');

/* ============ Excel aktarımı ============ */

/* Tek dosyada işlenecek en fazla satır. Toplu hesap açma şifre karması
   üretiyor; sınırsız bırakırsak tek istek sunucuyu uzun süre meşgul eder. */
const AKTARIM_SINIR = 300;

/* Gövde sınırı 2 MB ham JSON; base64 dosyayı üçte bir büyütüyor. */
const AKTARIM_DOSYA_SINIR = 1300000;

/* Çakışma uyarısının okunur hâli (Excel önizleme raporu için). */
function uyariMetni(u) {
  if (!u) return '';
  return (u.tur === 'sinif' ? 'sınıfın ' : 'öğretmenin ') + u.className + ' ' + u.subject +
    ' dersiyle çakışıyor (' + u.start + '-' + u.end + ')';
}

