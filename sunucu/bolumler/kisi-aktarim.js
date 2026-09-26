'use strict';
/* Öğrenci ve servisçi listelerinin toplu aktarımı (/api/school/...).

   Tek çalışma kitabında iki sayfa: Öğrenciler, Servisçiler (müdürün yapi/
   tablolarındaki sütunlar). Öğretmen dosyayla eklenmez: kendi hesabını açar,
   kişi kodunu okula verir. .xlsx, .xls, .ods, .csv ve alt alta isim
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

const DOSYA_SINIR = 1300000;   // base64 (≈ 1 MB dosya)
const SATIR_SINIR = 600;

/* Dosyayla yalnızca öğrenci ve servisçi hesabı açılır. Öğretmen kendi
   hesabını açar ve kişi koduyla okula eklenir (hesaplar.js ogretmen-ekle). */
const TURLER = {
  ogrenci: { rol: 'student', sayfa: 'Öğrenciler' },
  servisci: { rol: 'servisci', sayfa: 'Servisçiler' }
};
const OGRETMEN_SAYFASI = 'Öğretmenler dosyayla eklenmez: her öğretmen kendi hesabını açar, kişi kodunu verir; ' +
  'Öğretmenler sayfasında "Kodla ekle" ile kodu girersin.';

/* Sütunlar. esler: başlığın anahtarlanmış hâli (Türkçe harf, boşluk,
   büyük/küçük farkı yok); onek: bununla başlayan başlık da olur. */
const AD = { anahtar: 'ad', baslik: 'Ad', esler: ['ad', 'adi', 'isim', 'isimler', 'ogrenciadi', 'ogrenciad',
  'ogretmenad', 'ogretmenadi', 'serviscad', 'servisciad', 'serviscadi', 'serviscisoforad', 'soforad'] };
const SOYAD = { anahtar: 'soyad', baslik: 'Soyad', esler: ['soyad', 'soyadi', 'soyisim', 'soyisimi'] };
const ADSOYAD = { anahtar: 'adSoyad', baslik: 'Ad Soyad', esler: ['adsoyad', 'adisoyadi', 'isimsoyisim', 'adsoyadi'], gizli: true };
const TC = { anahtar: 'tc', baslik: 'T.C. Kimlik No', esler: ['tc', 'tcno', 'tckimlik', 'tckimlikno', 'kimlikno', 'tcnumarasi'],
  onek: ['tckimlik'] };
const KADI = { anahtar: 'kullaniciAdi', baslik: 'Kullanıcı adı', esler: ['kullaniciadi', 'kullaniciad', 'kullanici', 'kadi'],
  onek: ['kullanici'] };
const EPOSTA = { anahtar: 'eposta', baslik: 'E-posta', esler: ['eposta', 'email', 'mail', 'epostaadresi'], onek: ['eposta', 'email'] };
const SIFRE = { anahtar: 'sifre', baslik: 'Şifre', esler: ['sifre', 'parola'], onek: ['sifre'] };
const DOGUM = { anahtar: 'dogum', baslik: 'Doğum tarihi (gg.aa.yyyy)', esler: ['dogum', 'dogumtarihi', 'ggmmyyyy', 'ggaayyyy'],
  onek: ['dogum'] };
const ADRES = { anahtar: 'adres', baslik: 'Adres', esler: ['adres', 'evadresi'], onek: ['adres'] };
const TELEFON = { anahtar: 'telefon', baslik: 'Telefon', esler: ['telefon', 'tel', 'cep', 'ceptelefonu', 'gsm'], onek: ['telefon'] };

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

/* Bir satırın sorunları tek metinde: her biri noktayla biter ("...olmalı. Böyle bir gün yok..."). */
const cumleler = liste => liste.map(s => /[.!?]$/.test(s) ? s : s + '.').join(' ');

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

/* Bir satırın alanları. */
function satirAlanlari(b, satir) {
  const g = {};
  for (const k of Object.keys(b.harita)) g[k] = metinYap(satir[b.harita[k]]).trim();
  /* Ad ve soyad tek sütundaysa (ya da soyad sütunu yoksa) son kelime soyaddır. */
  const tekSutun = !g.ad && !g.soyad && g.adSoyad ? g.adSoyad : (b.harita.soyad === undefined && g.ad ? g.ad : '');
  if (tekSutun) {
    const k = tekSutun.split(/\s+/).filter(Boolean);
    g.soyad = k.length > 1 ? k.pop() : '';
    g.ad = k.join(' ');
  }
  delete g.adSoyad;
  /* Sayı hücresinde gelen T.C. no ("12345678901.0") düzelir. */
  if (g.tc) g.tc = normTc(g.tc).replace(/\.0+$/, '');
  if (g.okulNo) g.okulNo = g.okulNo.replace(/\.0+$/, '');
  return g;
}

/* ---------------- boş şablon ---------------- */
const ANLATIM = [
  ['Öğrenci ve servisçi listesi nasıl doldurulur'],
  [''],
  ['Her sayfaya o gruptaki kişileri satır satır yaz, sonra sisteme yükle. Kullanmadığın sayfayı boş bırak.'],
  [''],
  ['Zorunlu: Ad, Soyad ve T.C. Kimlik No. Geri kalanı isteğe bağlı.'],
  ['Kullanıcı adı ve şifre boş bırakılırsa ikisi de T.C. kimlik no olur; kişi ilk girişte kendi şifresini belirler.'],
  ['Kullanıcı adı yazılacaksa harfle başlar; yalnızca a-z (Türkçe harf yok), rakam, nokta ve alt çizgi.'],
  ['Şifre yazılacaksa en az 8 karakter, harf ve rakam içermeli.'],
  ['Doğum tarihi gg.aa.yyyy biçiminde: 12.05.2012'],
  [''],
  ['Öğrenciler'],
  ['  Sınıf (1-12) ve Şube: 7 ve A yazarsan öğrenci 7-A sınıfına, 7 ve Çiçek yazarsan 7-Çiçek sınıfına girer.'],
  ['  O sınıf okulda yoksa açılır.'],
  ['  Okul no: okulun verdiği öğrenci numarası (okul içinde tek).'],
  ['  Okulda aynı T.C. no ile öğrenci zaten varsa yenisi açılmaz; sınıfı, okul no\'su, adresi güncellenir'],
  ['  (yıl sonunda sınıf atlatmak için listeyi yeniden yüklemen yeterli).'],
  [''],
  ['Servisçiler'],
  ['  Telefon: velilerin ve öğrencilerin göreceği numara.'],
  ['  Servis: sistemde açılmış servisin adı ya da plakası yazılırsa servisçi o servise atanır.'],
  [''],
  ['Başka bir tablodan da yükleyebilirsin: sütunların sırası önemli değil, başlık adları önemli.'],
  ['Öğretmenler dosyayla eklenmez: her öğretmen kendi hesabını açar, kişi kodunu sana verir.'],
  ['.xlsx, .xls, .ods (LibreOffice) ve .csv okunur. Yalnızca alt alta isim yazılmış bir .txt dosyası da yüklenebilir.'],
  ['Yükleme iki adımlı: önce ne olacağını gösteren bir liste görürsün, onaylayınca hesaplar açılır.']
];

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

/* ---------------- dışa aktarım ---------------- */
async function disa(me) {
  const [kisiler, siniflar, servisler] = await Promise.all([
    depo.kullanicilar.okulun(me.schoolId, { roller: ['student', 'servisci'] }),
    depo.siniflar.okulun(me.schoolId), depo.okulHayati.okulunServisleri(me.schoolId)]);
  const sinifAd = new Map(siniflar.map(c => [c.id, c.name]));
  const bol = ad => { const k = String(ad || '').split(/\s+/).filter(Boolean); const s = k.length > 1 ? k.pop() : ''; return [k.join(' '), s]; };
  const tarih = iso => iso ? iso.slice(8, 10) + '.' + iso.slice(5, 7) + '.' + iso.slice(0, 4) : '';
  const sinifBol = ad => { const m = /^(\d{1,2})-(.+)$/.exec(ad || ''); return m ? [m[1], m[2]] : ['', ad || '']; };
  const servisAdi = new Map();
  for (const s of servisler) if (s.sofor_id) servisAdi.set(s.sofor_id, s.ad);
  const satir = (tur, u) => {
    const [ad, soyad] = bol(u.fullName);
    const alan = { ad, soyad, tc: u.tc || '', kullaniciAdi: u.username, eposta: u.email || '', sifre: '',
      dogum: tarih(u.dogum), adres: u.address || '', telefon: u.phone || '', okulNo: u.okulNo || '',
      servis: servisAdi.get(u.id) || '' };
    const [sv, sb] = sinifBol(sinifAd.get(u.classId));
    alan.seviye = sv; alan.sube = sb;
    return SUTUNLAR[tur].filter(s => !s.gizli).map(s => alan[s.anahtar] || '');
  };
  const sayfa = (tur, rol) => {
    const sutunlar = SUTUNLAR[tur].filter(s => !s.gizli);
    return { ad: TURLER[tur].sayfa, basliklar: sutunlar.map(s => s.baslik),
      satirlar: kisiler.filter(u => u.role === rol).map(u => satir(tur, u)),
      genislikler: sutunlar.map(s => Math.max(12, s.baslik.length + 4)) };
  };
  return xlsx.yaz([sayfa('ogrenci', 'student'), sayfa('servisci', 'servisci')]);
}

/* ---------------- içe aktarım ---------------- */
async function iceAktar(k) {
  const { req, res, me, body } = k;
  const b64 = typeof body.dosya === 'string' ? body.dosya : '';
  if (!b64) return bad(res, 'Dosya seçilmedi');
  if (b64.length > DOSYA_SINIR) return bad(res, 'Dosya çok büyük. Listeyi bölüp iki dosya hâlinde yükle.');
  const ham = Buffer.from(b64, 'base64');
  if (ham.length < 2) return bad(res, 'Dosya boş');
  /* Tür seçilmediyse ve sayfa adı "Sayfa1" gibi genelse dosya adından
     anlaşılır (öğrenci.ods, ogretmenler.xlsx...). */
  const turIpucu = TURLER[clean(body.tur, 20)] ? clean(body.tur, 20)
    : sayfaTuru(clean(body.dosyaAdi, 120).replace(/\.[a-z0-9]{1,5}$/i, ''));

  let bolumler;
  try { bolumler = cozumle(tabloOku(ham, clean(body.dosyaAdi, 120)), turIpucu); }
  catch (e) { return bad(res, e.message); }
  if (!bolumler.length) {
    return bad(res, 'Dosyada okunacak liste bulunamadı. Sayfa adı "Öğrenciler" ya da "Servisçiler" olmalı; ' +
      'değilse yüklerken listenin kimlere ait olduğunu seç.');
  }

  const rapor = [];
  const hazir = [];      // açılacak hesaplar
  const guncel = [];     // güncellenecek mevcut hesaplar
  const acilacakSinif = new Map();   // anahtar -> ad
  const [siniflar, servisler] = await Promise.all([
    depo.siniflar.okulun(me.schoolId), depo.okulHayati.okulunServisleri(me.schoolId)]);
  const sinifBul = ad => siniflar.find(c => aktarim.anahtarla(c.name) === aktarim.anahtarla(ad));
  const dosya = { tc: new Map(), kadi: new Map(), eposta: new Map(), no: new Map() };

  for (const b of bolumler) {
    if (!TURLER[b.tur]) {
      rapor.push({ sayfa: b.sayfa, tur: b.tur, satir: b.bas + 1, ad: '', durum: 'hata', mesaj: OGRETMEN_SAYFASI });
      continue;
    }
    const rol = TURLER[b.tur].rol;
    const ek = (satir, ad, durum, mesaj) => rapor.push({ sayfa: b.sayfa, tur: b.tur, satir, ad, durum, mesaj });
    const eksikBaslik = [];
    if (b.harita.ad === undefined && b.harita.adSoyad === undefined) eksikBaslik.push('Ad', 'Soyad');
    if (b.harita.tc === undefined) eksikBaslik.push('T.C. Kimlik No');
    if (eksikBaslik.length) {
      ek(b.bas + 1, '', 'hata', 'Başlık satırında şu sütunlar bulunamadı: ' + eksikBaslik.join(', ') +
        '. Boş şablonu indirip onun üzerine yazman en kolayı.');
      continue;
    }
    if (!yetkiVarMi(me, YETKI[rol].ac)) { ek(b.bas + 1, '', 'hata', ROL_AD[rol] + ' hesabı açma yetkin yok'); continue; }

    for (let i = b.bas + 1; i < b.satirlar.length; i++) {
      const satir = b.satirlar[i] || [];
      if (!satir.some(x => metinYap(x).trim())) continue;
      const no = i + 1;
      const g = satirAlanlari(b, satir);
      const adGoster = ((g.ad || '') + ' ' + (g.soyad || '')).trim();
      const sorunlar = [];

      /* Sınıf (öğrenci) */
      if (rol === 'student' && (g.seviye || g.sube)) {
        const ad = sinifAdi(g.seviye, g.sube);
        const c = sinifBul(ad);
        if (c) g.sinifId = c.id;
        else if (!yetkiVarMi(me, 'sinif.yonet')) sorunlar.push('"' + ad + '" sınıfı yok ve sınıf açma yetkin yok');
        /* Yeni açılan sınıf hiçbir rol kapsamında olamaz: kapsamlı yerleştirme
           yetkisiyle yeni sınıfa öğrenci konmaz. */
        else if (!yetkiVarMi(me, 'ogrenci.yerlestir', { sinif: '(yeni)' })) sorunlar.push('Yeni sınıfa öğrenci yerleştirme yetkin yok');
        else { acilacakSinif.set(aktarim.anahtarla(ad), ad); g._yeniSinif = ad; }
      }
      /* Servis (servisçi) */
      if (rol === 'servisci' && g.servis) {
        const a = aktarim.anahtarla(g.servis);
        const s = servisler.find(x => aktarim.anahtarla(x.ad) === a || (x.plaka && aktarim.anahtarla(x.plaka) === a));
        if (!s) sorunlar.push('"' + g.servis + '" adında ya da plakasında bir servis yok');
        else g._servisId = s.id;
      }
      delete g.servis;

      /* Okulda aynı T.C. no ile hesap var mı: varsa güncellenir. */
      const tc = normTc(g.tc);
      const mevcut = tc ? await depo.kullanicilar.tcIle(tc, me.schoolId) : null;
      if (mevcut && mevcut.role !== rol) sorunlar.push('Bu T.C. no okulda ' + (ROL_AD[mevcut.role] || 'başka bir') + ' hesabında kayıtlı');

      if (mevcut && mevcut.role === rol && !sorunlar.length) {
        if (!yetkiVarMi(me, YETKI[rol].duzenle)) { ek(no, adGoster, 'hata', 'Bu kişi zaten kayıtlı; düzenleme yetkin yok'); continue; }
        /* Güncellemede yalnızca dolu gelen yer bilgileri yazılır; ad, kullanıcı
           adı, şifre ve e-postaya dokunulmaz. */
        const gu = {};
        for (const k2 of ['dogum', 'adres', 'telefon', 'okulNo', 'brans', 'rolId']) if (g[k2]) gu[k2] = g[k2];
        if (g.sinifId) gu.sinifId = g.sinifId;
        const s = await hesapDogrula(me, rol, gu, mevcut, dosya);
        if (s.sorunlar.length) { ek(no, adGoster, 'hata', cumleler(s.sorunlar)); continue; }
        if (dosya.tc.has(tc)) { ek(no, adGoster, 'hata', 'Bu T.C. no dosyada ' + dosya.tc.get(tc) + '. satırda da var'); continue; }
        dosya.tc.set(tc, no);
        if (s.d.okulNo) dosya.no.set(s.d.okulNo, no);
        guncel.push({ u: mevcut, d: s.d, yeniSinif: g._yeniSinif, servisId: g._servisId });
        /* Yalnızca gerçekten değişecek olanlar yazılır. */
        const neler = [g._yeniSinif || (s.d.classId && s.d.classId !== (mevcut.classId || '')
          ? siniflar.find(c => c.id === s.d.classId).name : ''),
        s.d.okulNo && s.d.okulNo !== (mevcut.okulNo || '') ? 'okul no' : '',
        s.d.address && s.d.address !== (mevcut.address || '') ? 'adres' : '',
        s.d.phone && s.d.phone !== (mevcut.phone || '') ? 'telefon' : '',
        s.d.dogum && s.d.dogum !== (mevcut.dogum || '') ? 'doğum tarihi' : ''].filter(Boolean);
        ek(no, mevcut.fullName, 'guncel', 'Zaten kayıtlı' + (neler.length ? ' — güncellenecek: ' + neler.join(', ') : ' — değişiklik yok'));
        continue;
      }

      const yeniSinif = g._yeniSinif, servisId = g._servisId;
      delete g._yeniSinif; delete g._servisId;
      const s = await hesapDogrula(me, rol, g, null, dosya);
      const hepsi = sorunlar.concat(s.sorunlar);
      if (hepsi.length) { ek(no, adGoster, 'hata', cumleler(hepsi)); continue; }
      dosya.tc.set(s.d.tc, no);
      dosya.kadi.set(s.d.username, no);
      if (s.d.email) dosya.eposta.set(s.d.email, no);
      if (s.d.okulNo) dosya.no.set(s.d.okulNo, no);
      hazir.push({ rol, s, yeniSinif, servisId, satir: no, sayfa: b.sayfa });
      ek(no, s.d.fullName, 'hazir', ROL_AD[rol] + ' hesabı açılacak' +
        (rol === 'student' ? (yeniSinif ? ' — ' + yeniSinif + ' (yeni sınıf)' : g.sinifId ? ' — ' + siniflar.find(c => c.id === g.sinifId).name : ' — sınıfsız') : '') +
        (s.varsayilanSifre ? ' · giriş T.C. no ile' : ''));
    }
  }

  const ozet = {
    hazir: hazir.length, guncel: guncel.length, hatali: rapor.filter(r => r.durum === 'hata').length,
    yeniSiniflar: [...acilacakSinif.values()], sinir: SATIR_SINIR,
    rapor: rapor.sort((a, b) => (a.sayfa > b.sayfa ? 1 : a.sayfa < b.sayfa ? -1 : a.satir - b.satir))
  };
  if (!body.uygula) return ok(res, Object.assign({ onizleme: true }, ozet));

  if (!hazir.length && !guncel.length) return bad(res, 'Açılacak ya da güncellenecek hesap yok — satırların hepsi hatalı.');
  if (hazir.length + guncel.length > SATIR_SINIR) {
    return bad(res, 'Tek seferde en fazla ' + SATIR_SINIR + ' kişi işlenebilir. Dosyada ' + (hazir.length + guncel.length) + ' geçerli satır var.');
  }
  if (!hizSinir('kisiAktarim:' + me.schoolId, 20, 60 * 60 * 1000)) return bad(res, 'Bu saat içinde çok fazla aktarım yapıldı.', 429);

  const ozetler = await hashPwToplu(hazir.map(h => h.s.sifre));
  const acilan = await islem(async () => {
    /* Yeni sınıflar */
    const sinifId = new Map();
    for (const [anahtar, ad] of acilacakSinif) {
      const c = { id: uid('c'), schoolId: me.schoolId, name: ad, createdAt: now() };
      await depo.siniflar.ekle(c);
      sinifId.set(anahtar, c.id);
    }
    const liste = [];
    for (let i = 0; i < hazir.length; i++) {
      const h = hazir[i];
      if (h.yeniSinif) h.s.d.classId = sinifId.get(aktarim.anahtarla(h.yeniSinif));
      const u = await hesapNesnesi(me, h.rol, h.s, ozetler[i]);
      await depo.kullanicilar.ekle(u);
      if (h.servisId) await depo.okulHayati.servisSoforYaz(h.servisId, me.schoolId, u.id);
      const sinifAdiBul = id => ((siniflar.find(c => c.id === id) || {}).name || '');
      liste.push({ ad: u.fullName, rol: h.rol, sinif: h.yeniSinif || (u.classId ? sinifAdiBul(u.classId) : ''), kullaniciAdi: u.username,
        sifre: h.s.varsayilanSifre ? '' : h.s.sifre, tcIle: h.s.varsayilanSifre, veliKodu: u.code || '' });
    }
    for (const gu of guncel) {
      if (gu.yeniSinif) gu.d.classId = sinifId.get(aktarim.anahtarla(gu.yeniSinif));
      if (Object.keys(gu.d).length) await depo.kullanicilar.guncelle(gu.u.id, gu.d);
      if (gu.servisId) await depo.okulHayati.servisSoforYaz(gu.servisId, me.schoolId, gu.u.id);
    }
    return liste;
  });
  await islemYaz(me, 'hesap.toplu-acildi', acilan.length + ' hesap açıldı, ' + guncel.length + ' güncellendi', req);
  res.setHeader('Cache-Control', 'no-store');
  return ok(res, {
    uygulandi: true, acilan: acilan.length, guncellenen: guncel.length, hesaplar: acilan,
    message: acilan.length + ' hesap açıldı' + (guncel.length ? ', ' + guncel.length + ' hesap güncellendi' : '') + '.'
  });
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
