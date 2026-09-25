/* Veli bağları:
   - öğretmen/müdür aynı zamanda veli olabilir (çocuğunun verisini görür, rolü değişmez);
   - okul veliyi T.C. kimlik no ya da kullanıcı adıyla öğrenciye bağlar, kaldırır;
   - rolsüz hesap bağlanınca veli olur; öğrenci hesabı veli yapılamaz;
   - arama sonucunda velinin tam adı değil baş harfleri görünür;
   - başka okulun müdürü bizim öğrencimize veli bağlayamaz. */
const { iste, girisYap, hesapAc, mudurYap, okulHesabi } = require('./giris');
const { kisilikGec } = require('./giris');

