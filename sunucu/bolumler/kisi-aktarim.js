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

const SUTUNLAR = {
  ogrenci: [AD, SOYAD, TC, KADI, EPOSTA, SIFRE, DOGUM,
    { anahtar: 'seviye', baslik: 'Sınıf (1-12)', esler: ['sinif', 'sinif112', 'sinifseviyesi', 'seviye', 'sinifduzeyi', 'duzey'] },
    /* İkinci "sınıf" başlıklı sütun şubedir (müdürün tablosundaki gibi). */
    { anahtar: 'sube', baslik: 'Şube', esler: ['sube', 'subesi', 'subeadi', 'sinifsubesi', 'sinif'], onek: ['sube'] },
    { anahtar: 'okulNo', baslik: 'Okul no', esler: ['okulno', 'okulnumarasi', 'numara', 'no', 'ogrencino', 'ogrencinumarasi'],
      onek: ['okulno', 'okulnumara'] },
    ADRES, ADSOYAD],
  servisci: [AD, SOYAD, DOGUM, TC, EPOSTA, KADI, SIFRE, TELEFON,
    { anahtar: 'servis', baslik: 'Servis (adı ya da plakası)', esler: ['servis', 'servisadi', 'arac', 'plaka', 'aracplakasi'],
      onek: ['servis', 'plaka'] },
    ADRES, ADSOYAD]
};

/* Başlıktan aday anahtarlar: bütünü, parantez içi ve parantez öncesi.
   "Ahmet sami(İsim)" -> isim; "rol(öğretmen,custom rol)" -> rol. */
function adaylar(baslik) {
  const s = metinYap(baslik);
  const liste = [aktarim.anahtarla(s)];
  const m = /^([^(]*)\(([^)]*)\)/.exec(s);
  if (m) { liste.push(aktarim.anahtarla(m[2])); liste.push(aktarim.anahtarla(m[1])); }
  return liste.filter(Boolean);
}

function basliklariEsle(satir, sutunlar) {
  const harita = {};
  for (let i = 0; i < satir.length; i++) {
    const a = adaylar(satir[i]);
    if (!a.length) continue;
    const bul = s => harita[s.anahtar] === undefined && (a.some(x => s.esler.indexOf(x) >= 0) ||
      (s.onek || []).some(o => a.some(x => x.indexOf(o) === 0)));
    const s = sutunlar.find(bul);
    if (s) harita[s.anahtar] = i;
  }
  return harita;
}

/* Sayfanın türü: adından (Öğrenciler, Öğretmen listesi, Servisçi...). */
function sayfaTuru(ad) {
  const a = aktarim.anahtarla(ad);
  if (/ogrenci/.test(a)) return 'ogrenci';
  if (/ogretmen/.test(a)) return 'ogretmen';
  if (/servis|sofor/.test(a)) return 'servisci';
  return '';
}

/* Sınıf adı: seviye + şube (7 + a -> 7-A, 7 + çiçek -> 7-Çiçek). */
function sinifAdi(seviye, sube) {
  seviye = clean(seviye, 10).replace(/\.0+$/, '').replace(/\s*\.?\s*sınıf$/i, '').trim();
  sube = clean(sube, 20).trim();
  if (/^[a-zçğıöşü]$/i.test(sube)) sube = sube.toLocaleUpperCase('tr');
  else if (sube) sube = adDuzelt(sube.toLocaleLowerCase('tr'));
  if (seviye && sube) return (seviye + '-' + sube).slice(0, 30);
  return (seviye || sube).slice(0, 30);
}

/* Dosyayı okuyup sayfaları türlerine ayırır: [{ tur, sayfa, satirlar, harita }] */
function cozumle(sayfalar, turIpucu) {
  const bolumler = [];
  for (const s of sayfalar) {
    const satirlar = s.satirlar || [];
    if (!satirlar.some(r => r && r.some(x => metinYap(x).trim()))) continue;
    if (/nas[ıi]l ?doldurulur/i.test(s.ad)) continue;
    const tur = sayfaTuru(s.ad) || turIpucu;
    if (!tur) continue;
    /* Başlık satırı: ilk dolu satır. */
    let bas = satirlar.findIndex(r => r && r.some(x => metinYap(x).trim()));
    const harita = SUTUNLAR[tur] ? basliklariEsle(satirlar[bas], SUTUNLAR[tur]) : {};
    bolumler.push({ tur, sayfa: s.ad, satirlar, bas, harita });
  }
  return bolumler;
}

function sablon() {
  const sayfa = tur => ({ ad: TURLER[tur].sayfa, basliklar: SUTUNLAR[tur].filter(s => !s.gizli).map(s => s.baslik),
    satirlar: [], genislikler: SUTUNLAR[tur].filter(s => !s.gizli).map(s => Math.max(12, s.baslik.length + 4)) });
  return xlsx.yaz([sayfa('ogrenci'), sayfa('servisci'),
    { ad: 'Nasıl doldurulur', duz: true, satirlar: ANLATIM, genislikler: [110] }]);
}

/* TXT (ya da başka tablo) -> doldurulmaya hazır şablon: ad, soyad, T.C. dolu. */
function txtdenSablon(sayfalar, tur) {
  const satirlar = [];
  for (const b of cozumle(sayfalar, tur)) {
    if (b.tur !== tur) continue;
    for (let i = b.bas + 1; i < b.satirlar.length; i++) {
      const g = satirAlanlari(b, b.satirlar[i] || []);
      if (!g.ad && !g.soyad && !g.tc) continue;
      satirlar.push(SUTUNLAR[tur].filter(s => !s.gizli).map(s => g[s.anahtar] || ''));
      if (satirlar.length >= 5000) break;
    }
  }
  const sutunlar = SUTUNLAR[tur].filter(s => !s.gizli);
  return { adet: satirlar.length, veri: xlsx.yaz([
    { ad: TURLER[tur].sayfa, basliklar: sutunlar.map(s => s.baslik), satirlar,
      genislikler: sutunlar.map(s => Math.max(12, s.baslik.length + 4)) },
    { ad: 'Nasıl doldurulur', duz: true, satirlar: ANLATIM, genislikler: [110] }]) };
}

/* ---- uçlar ---- */
async function uclar(k, sub) {
  const { res, me, body, q, method } = k;
  if (['kisi-sablon', 'kisi-disa', 'kisi-aktarim', 'txt-excel'].indexOf(sub) < 0) return false;
  if (!yetkiVarMi(me, 'aktarim.yap')) return bad(res, 'Bu işlem için yetkin yok', 403);

  if (sub === 'kisi-sablon' && method === 'GET') return ok(res, { dosya: sablon().toString('base64'), ad: 'kisi-listesi-sablon.xlsx' });
  if (sub === 'kisi-disa' && method === 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return ok(res, { dosya: (await disa(me)).toString('base64'), ad: 'kisiler.xlsx' });
  }
  if (sub === 'kisi-aktarim' && method === 'POST') return iceAktar(k);
  if (sub === 'txt-excel' && method === 'POST') {
    const tur = clean(body.tur, 20);
    if (!TURLER[tur]) return bad(res, 'Listenin kimlere ait olduğunu seç');
    const b64 = typeof body.dosya === 'string' ? body.dosya : '';
    if (!b64 || b64.length > DOSYA_SINIR) return bad(res, b64 ? 'Dosya çok büyük' : 'Dosya seçilmedi');
    let sonuc;
    try { sonuc = txtdenSablon(tabloOku(Buffer.from(b64, 'base64'), clean(body.dosyaAdi, 120) || 'liste.txt'), tur); }
    catch (e) { return bad(res, e.message); }
    if (!sonuc.adet) return bad(res, 'Dosyada isim bulunamadı. Her satıra bir kişinin adını yaz.');
    return ok(res, { adet: sonuc.adet, dosya: sonuc.veri.toString('base64'),
      ad: tur + '-listesi.xlsx' });
  }
  return false;
}

module.exports = { uclar, SUTUNLAR, basliklariEsle, sinifAdi, cozumle };
