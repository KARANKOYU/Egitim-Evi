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

/* Yeni veli kodu: başkasında olmayan. */
async function yeniKod() {
  let code = makeCode();
  while (await depo.kullanicilar.kodVarMi(code)) code = makeCode();
  return code;
}

/* Okunması kolay, tahmini zor şifre: 8 harf + 2 rakam; karışan harfler
   (I/l/1, O/0) yok. crypto.randomInt ile (Math.random değil). */
const SIFRE_HARF = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
const SIFRE_RAKAM = '23456789';
function rastgeleSifre() {
  let s = '';
  for (let i = 0; i < 8; i++) s += SIFRE_HARF[crypto.randomInt(SIFRE_HARF.length)];
  for (let i = 0; i < 2; i++) s += SIFRE_RAKAM[crypto.randomInt(SIFRE_RAKAM.length)];
  return s;
}

/* Sınıf adı: seviye + şube harfi yazılmışsa tek biçime gelir ("7a",
   "7 - a", "7/A" -> "7-A"). Başka türlü yazılmış adlara ("Anasınıfı
   Papatya") dokunulmaz. */
function sinifAdiDuzelt(ad) {
  const m = /^(\d{1,2})\s*[-/.]?\s*([a-zçğıöşü])$/i.exec(String(ad || '').trim());
  return m ? m[1] + '-' + m[2].toLocaleUpperCase('tr') : String(ad || '').trim();
}

/* Okulun öğrencisi mi? */
async function okulOgrencisi(me, id) {
  const st = await depo.kullanicilar.bul(clean(id, 60));
  return st && st.role === 'student' && st.schoolId === me.schoolId ? st : null;
}

function xlsxGonder(res, veri, ad) {
  res.writeHead(200, baslikEkle({
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Length': veri.length,
    'Content-Disposition': 'attachment; filename="' + ad + '"',
    'Cache-Control': 'no-store'
  }));
  res.end(veri);
}

module.exports = {
  AKTARIM_SINIR,
  AKTARIM_DOSYA_SINIR,
  xlsxGonder,
  uclar
};
