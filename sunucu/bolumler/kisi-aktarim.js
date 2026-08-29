'use strict';
/* Öğrenci ve servisçi listelerinin toplu aktarımı (/api/school/...).

   Tek çalışma kitabında iki sayfa: Öğrenciler, Servisçiler (müdürün yapi/
   tablolarındaki sütunlar). Öğretmen dosyayla eklenmez: kendi hesabını açar,
   eşleme kodunu okula verir. .xlsx, .xls, .ods, .csv ve alt alta isim
   yazılmış .txt okunur. Sütunların sırası önemli değildir; başlıklar
   adıyla eşlenir ("İsim", "Ahmet sami(İsim)", "doğum tarihi gg.mm.yyyy"...).

   Kural (hesaplar.js ile aynı): ad, soyad ve T.C. no zorunlu; kullanıcı adı
   ve şifre boşsa T.C. no olur, kişi ilk girişte şifresini değiştirir.
   Öğrencinin sınıfı "Sınıf (1-12)" ve "Şube" sütunlarından kurulur
   (7 + Çiçek -> 7-Çiçek); o sınıf yoksa açılır. Okulda aynı T.C. no'lu
   hesap varsa yenisi açılmaz, sınıfı/okul no'su/adresi güncellenir.

   İki adım: önce ne olacağını gösteren rapor, onaylanınca aynı dosya baştan
   çözümlenip işlenir (arada veri değişmiş olabilir). */

const aktarim = require('../yardimci/aktarim');
const xlsx = require('../yardimci/xlsx');
const { tabloOku } = require('../yardimci/tablo-oku');
const { bad, ok } = require('../http');
const { hizSinir } = require('../guvenlik');
const { adDuzelt, clean, metinYap, normEmail, normKullaniciAdi, normTc, now, uid } = require('../ortak');
const { hashPwToplu } = require('../sifre');
const { depo, islem } = require('../veri');
const { yetkiVarMi } = require('../yetki');
const { islemYaz } = require('./islem-kaydi');
const { hesapDogrula, hesapNesnesi, ROL_AD, YETKI } = require('./hesaplar');

