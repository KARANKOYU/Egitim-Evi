'use strict';
/* Her yerde kullanılan küçük yardımcılar ve sabitler.
   Ders listesi, il listesi, ödev sonuç türleri; kimlik üretme, tarih,
   metin temizleme, telefon/e-posta/şifre doğrulama, veli kodu üretme.
   Hiçbir başka modüle bağımlı değildir. */

const crypto = require('crypto');

const SUBJECTS = ['Matematik', 'Türkçe', 'İngilizce', 'Din Kültürü ve Ahlak Bilgisi',
  'Sosyal Bilgiler', 'Fen Bilimleri', 'Müzik', 'Resim', 'Beden Eğitimi'];

const CITIES = ['Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis',
  'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne',
  'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay',
  'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu',
  'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya',
  'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya',
  'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli',
  'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'];

const RESULT_TYPES = ['yapti', 'yapmadi', 'eksik', 'gec', 'izinli', 'gelmedi'];

/* ============ yardımcılar ============ */
function uid(p) { return p + '_' + crypto.randomBytes(9).toString('hex'); }
function now() { return new Date().toISOString(); }

/* Şifreler scrypt ile saklanır (tuz + 64 baytlık türetilmiş anahtar).
   scryptSync olay döngüsünü bloklar: 100 eşzamanlı giriş denemesi sunucuyu
   saniyelerce kilitler. Bu yüzden çalışma anında hep asenkron sürüm kullanılır;
   senkron sürüm yalnızca açılışta bir kez, ilk admin hesabı için çalışır. */

/* Gövdedeki nesnelerin ilkörneği: Object.prototype yok (__proto__ kirlenmesi
   olmaz) ama String(nesne) boş metin verir. Bir alana metin yerine nesne
   gönderilirse uç 500 "Sunucu hatası" değil, alan boşmuş gibi 400 döner. */
const GOVDE_ILKORNEK = Object.freeze(Object.create(null, {
  toString: { value: () => '' },
  valueOf: { value: () => '' },
  [Symbol.toPrimitive]: { value: () => '' }
}));

function govdeTemizle(v, derinlik) {
  derinlik = derinlik || 0;
  /* NUL karakteri (\u0000) PostgreSQL metninde yasak: kalırsa sorgu hata
     verir. Gelen her metinden baştan ayıklanır. */
  if (typeof v === 'string') return v.indexOf('\u0000') >= 0 ? v.replace(/\u0000/g, '') : v;
  if (derinlik > 6 || v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.slice(0, 500).map(x => govdeTemizle(x, derinlik + 1));
  const temiz = Object.create(GOVDE_ILKORNEK);
  for (const k of Object.keys(v)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype' || k === 'toString' || k === 'valueOf') continue;
    temiz[k] = govdeTemizle(v[k], derinlik + 1);
  }
  return temiz;
}
/* Veli kodu: 10 karakter, yalnızca büyük harf ve rakam; ekranda
   "ABCDE-FGH23" diye iki parça gösterilir. Eskiden büyük/küçük harf ve
   !@#$ gibi işaretler karışıktı, veli yazarken yanılıyordu. Büyük/küçük
   harf, boşluk ve tire fark etmez (kodSade). Karışabilen karakterler
   (0/O, 1/I) alfabede yok. 32^10 ≈ 1,1e15 olasılık; veli başına dakikada
   5 deneme sınırıyla tahmin edilemez. */
const KOD_ALFABE = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const KOD_UZUNLUK = 10;

/* Kullanıcının yazdığı kodu karşılaştırılacak hâle getirir. */
function kodSade(kod) {
  return String(kod == null ? '' : kod).toLocaleUpperCase('tr').replace(/İ/g, 'I').replace(/[^A-Z0-9]/g, '');
}

function makeCode() {
  let kod = '';
  for (let i = 0; i < KOD_UZUNLUK; i++) kod += KOD_ALFABE[crypto.randomInt(KOD_ALFABE.length)];
  return kod;
}

/* ============ kullanıcı adı, T.C. kimlik no, ad soyad ============ */

/* Kullanıcı adı: 3-30 karakter, harfle başlar; yalnızca a-z, rakam, nokta
   ve alt çizgi. Türkçe harf yok (ı/i, İ/I karışıklığı olmasın). Büyük/küçük
   harf fark etmez: hep küçük saklanır. */
/* Metin bekleyen yerlerde nesne/dizi gelirse boş sayılır (prototipsiz nesnede
   String() hata atıyordu; bkz. clean). */
const metinYap = v => (v == null || typeof v === 'object') ? '' : String(v);

function normKullaniciAdi(ad) { return metinYap(ad).trim().toLowerCase(); }

function kullaniciAdiSorunu(ad) {
  const s = normKullaniciAdi(ad);
  if (!s) return 'Bir kullanıcı adı belirle.';
  if (s.length < 3) return 'Kullanıcı adı en az 3 karakter olmalı.';
  if (s.length > 30) return 'Kullanıcı adı en fazla 30 karakter olabilir.';
  if (/[çğıöşü]/.test(s)) return 'Kullanıcı adında Türkçe harf kullanma (ç yerine c, ş yerine s gibi).';
  if (!/^[a-z]/.test(s)) return 'Kullanıcı adı bir harfle başlamalı.';
  if (!/^[a-z][a-z0-9._]*$/.test(s)) return 'Kullanıcı adında yalnızca harf, rakam, nokta ve alt çizgi olabilir.';
  return '';
}

/* T.C. kimlik numarası: 11 hane, ilki 0 olamaz; 10. ve 11. haneler
   resmî algoritmayla öbür hanelerden hesaplanır. Yazım hatasını yakalar
   (numaranın gerçekten var olduğunu değil). */
function tcSorunu(tc) {
  const s = metinYap(tc).replace(/\s/g, '');
  if (!s) return '';
  if (!/^[1-9][0-9]{10}$/.test(s)) return 'T.C. kimlik numarası 11 haneli olmalı ve 0 ile başlamamalı.';
  const d = s.split('').map(Number);
  const tek = d[0] + d[2] + d[4] + d[6] + d[8];
  const cift = d[1] + d[3] + d[5] + d[7];
  const onuncu = ((tek * 7 - cift) % 10 + 10) % 10;
  const onbirinci = d.slice(0, 10).reduce((a, b) => a + b, 0) % 10;
  if (d[9] !== onuncu || d[10] !== onbirinci) return 'T.C. kimlik numarası geçersiz, rakamları kontrol et.';
  return '';
}
function normTc(tc) { return metinYap(tc).replace(/\s/g, ''); }

/* ---------------- okul hesapları ve okul adresi ---------------- */

/* Okula ait hesap rolleri: kullanıcı adı ve T.C. no okul içinde benzersiz. */
const OKUL_ROLLERI = ['principal', 'teacher', 'student', 'servisci'];
const okulHesabiMi = rol => OKUL_ROLLERI.indexOf(rol) >= 0;

/* Türkçe harfleri ASCII karşılığına çevirir (adres ve kullanıcı adı için). */
function asciiYap(s) {
  return metinYap(s).replace(/İ/g, 'i').replace(/I/g, 'ı').toLocaleLowerCase('tr')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ö/g, 'o').replace(/ç/g, 'c').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/* Okulun kısa adı: egitimevi.org/<kisa-ad>. Sitenin kendi yollarıyla
   karışmasın diye bazı adlar ayrılmıştır. */
const KISA_AD_YASAK = new Set(('api css js yazitipi kvkk sw manifest simge index admin yonetici giris kayit cikis ' +
  'okul okullar veli ogretmen ogrenci mudur servis servisci destek yardim hakkinda iletisim www static assets ' +
  'favicon robots sitemap egitimevi public sunucu data dosya dosyalar indir sifre hesap ayarlar login signup ' +
  'logout register about gorsel sss kosullar kullanim-kosullari gizlilik cerez indir download uygulama').split(' '));

function kisaAdSorunu(s) {
  s = metinYap(s);
  if (!s) return 'Okulun adres adını yaz.';
  if (s.length < 3) return 'Adres adı en az 3 karakter olmalı.';
  if (s.length > 40) return 'Adres adı en fazla 40 karakter olabilir.';
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(s)) {
    return 'Adres adında yalnızca küçük harf (Türkçe harf olmadan), rakam ve tire olabilir; tireyle başlayıp bitemez.';
  }
  if (/--/.test(s)) return 'Adres adında iki tire yan yana olamaz.';
  if (KISA_AD_YASAK.has(s)) return 'Bu ad sitenin kendi sayfalarından biri; başka bir ad seç.';
  return '';
}

/* Okul adından kısa ad önerisi: "Özel Doruk Koleji" -> "ozel-doruk-koleji". */
function kisaAdUret(ad) {
  let s = asciiYap(ad).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (s.length > 40) {
    s = s.slice(0, 40);
    const i = s.lastIndexOf('-');
    if (i >= 15) s = s.slice(0, i);
    s = s.replace(/-+$/, '');
  }
  if (s.length < 3) s = 'okul-' + (s || 'x');
  if (KISA_AD_YASAK.has(s)) s += '-okulu';
  return s;
}

/* Tablodaki tarih: "12.05.2011", "12/05/2011", "2011-05-12" ya da Excel'in
   gün sayısı (40675). Anlaşılamazsa null. */
function tarihCoz(v) {
  const s = metinYap(v).trim();
  if (!s) return '';
  let m = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(s);
  let iso = '';
  if (m) iso = m[3] + '-' + (m[2].length < 2 ? '0' : '') + m[2] + '-' + (m[1].length < 2 ? '0' : '') + m[1];
  else if (/^\d{4}-\d{2}-\d{2}/.test(s)) iso = s.slice(0, 10);
  else if (/^\d{5}(\.0+)?$/.test(s)) {
    const n = Number(s);
    if (n > 7000 && n < 80000) iso = new Date(Date.UTC(1899, 11, 30) + n * 86400000).toISOString().slice(0, 10);
  }
  if (!iso) return null;
  const t = Date.parse(iso + 'T00:00:00Z');
  if (isNaN(t) || new Date(t).toISOString().slice(0, 10) !== iso) return null;
  return iso;
}

/* Ad soyad hep küçük ya da hep büyük yazılmışsa Türkçe kurala göre kelime
   başları büyük yazılır: "ayşe yılmaz" / "AYŞE YILMAZ" -> "Ayşe Yılmaz".
   Karışık yazılmışsa ("Ayşe Nur de Vries") dokunulmaz. */
function adDuzelt(ad) {
  const s = String(ad == null ? '' : ad).replace(/\s+/g, ' ').trim();
  if (!/\p{L}/u.test(s)) return s;
  const hepKucuk = s === s.toLocaleLowerCase('tr');
  const hepBuyuk = s === s.toLocaleUpperCase('tr');
  if (!hepKucuk && !hepBuyuk) return s;
  return s.toLocaleLowerCase('tr')
    .replace(/(^|[\s\-'’])(\p{L})/gu, (m, once, harf) => once + harf.toLocaleUpperCase('tr'));
}

/* Telefon uluslararası biçimde (E.164) saklanır: "+905321234567". Ülke kodu
   yazılmamışsa Türkiye numarası sayılır: "0532...", "532...", "90532...". */
function normTelefon(t) {
  let s = metinYap(t).replace(/[\s()\-./]/g, '');
  if (!s) return '';
  if (s.indexOf('00') === 0) s = '+' + s.slice(2);
  if (s[0] === '+') return s;
  /* 0 ile başlayan her yazım Türkiye numarası: hane sayısı yanlışsa
     telefonSorunu "10 haneli olmalı" der, "ülke koduyla yaz" demez. */
  if (/^0[1-9]\d*$/.test(s)) return '+90' + s.slice(1);
  if (/^5\d{9}$/.test(s)) return '+90' + s;
  if (/^90\d{10}$/.test(s)) return '+' + s;
  return s;
}

/* "2008-05-20" doğumlu kişinin bugünkü yaşı. */
function yasHesapla(iso) {
  const p = String(iso || '').split('-').map(Number);
  if (p.length !== 3 || p.some(isNaN)) return 0;
  const bugun = new Date();
  let yas = bugun.getFullYear() - p[0];
  if (bugun.getMonth() + 1 < p[1] || (bugun.getMonth() + 1 === p[1] && bugun.getDate() < p[2])) yas--;
  return yas;
}

/* Doğum tarihi: YYYY-AA-GG. Gelecek olamaz, 1920'den eski olamaz.
   Öğrencide zorunlu; diğer rollerde boş bırakılabilir. */
function dogumSorunu(deger, zorunlu) {
  const d = String(deger || '').trim();
  if (!d) return zorunlu ? 'Doğum tarihi gerekli' : '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return 'Doğum tarihi geçersiz';
  const zaman = Date.parse(d + 'T00:00:00Z');
  if (isNaN(zaman)) return 'Doğum tarihi geçersiz';
  if (new Date(zaman).toISOString().slice(0, 10) !== d) return 'Böyle bir gün yok';
  if (zaman > Date.now()) return 'Doğum tarihi gelecekte olamaz';
  if (Number(d.slice(0, 4)) < 1920) return 'Doğum tarihi çok eski';
  return '';
}

function telefonSorunu(t) {
  const s = normTelefon(t);
  if (!s) return 'Telefon numarası gerekli';
  if (!/^\+[1-9]\d{6,14}$/.test(s)) return 'Telefon numarasını ülke koduyla yaz (ör. +90 532 123 45 67)';
  if (s.indexOf('+90') === 0 && s.length !== 13) return 'Türkiye numarası 10 haneli olmalı (5xx xxx xx xx)';
  return '';
}

function normEmail(e) { return metinYap(e).trim().toLowerCase(); }

/* Şifre kuralı tek yerde: kayıt, şifre değiştirme ve okulun açtığı hesaplar
   aynı kuralı kullansın. Sorun varsa metin döner, yoksa null.
   Şifre kuralı iki düzeylidir:
     - yetişkin hesabı (veli, öğretmen, müdür, yönetici): en az 8 karakter,
       büyük harf, küçük harf, rakam ve özel karakter (! ? . * gibi);
     - okulun açtığı öğrenci ve servisçi hesabı: en az 8 karakter, harf ve
       rakam (küçük çocuklar için).
   Kural yalnızca şifre belirlenirken uygulanır; eski şifreyle giriş sürer. */
function sifreSorunu(pw, guclu) {
  const s = metinYap(pw);
  if (s.length < 8) return 'Şifre en az 8 karakter olmalı';
  if (s.length > 200) return 'Şifre çok uzun';
  if (!guclu) {
    if (!/[0-9]/.test(s) || !/[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(s)) return 'Şifre en az bir harf ve bir rakam içermeli';
    return null;
  }
  const eksik = [];
  if (!/[A-ZÇĞİÖŞÜ]/.test(s)) eksik.push('bir büyük harf');
  if (!/[a-zçğıöşü]/.test(s)) eksik.push('bir küçük harf');
  if (!/[0-9]/.test(s)) eksik.push('bir rakam');
  if (!/[^A-Za-z0-9çğıöşüÇĞİÖŞÜ\s]/.test(s)) eksik.push('bir özel karakter (! ? . * gibi)');
  return eksik.length ? 'Şifrede ' + eksik.join(', ') + ' olmalı' : null;
}

/* Bu hesabın şifresi güçlü kurala mı tabi? Öğrenci ve servisçi dışında herkes. */
const gucluSifreli = u => !u || (u.role !== 'student' && u.role !== 'servisci');
/* Metin alanı bekliyoruz. İstemci nesne ya da dizi gönderirse bunu metne
   çevirmeye çalışmak yanlış: govdeTemizle prototipsiz nesne ürettiği için
   String() "Cannot convert object to primitive value" diye patlıyordu ve
   herkes istediği uca 500 aldırabiliyordu. Nesne geldiyse boş sayıyoruz. */
function clean(s, max) {
  if (s == null) return '';
  if (typeof s === 'object') return '';
  return String(s).replace(/\u0000/g, '').trim().slice(0, max || 200);
}

/* Virgüllü ya da noktalı ondalık sayı: "490,161" -> 490.161.
   Boş, sayı olmayan ya da sonsuz değer için null döner. */
function ondalik(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return isFinite(v) ? v : null;
  const s = String(v).trim().replace(/\s/g, '').replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return isFinite(n) ? n : null;
}

const ESKI_SAATLER = [
  null,
  ['09:00', '09:40'], ['09:50', '10:30'], ['10:40', '11:20'], ['11:30', '12:10'],
  ['13:00', '13:40'], ['13:50', '14:30'], ['14:40', '15:20'], ['15:30', '16:10'],
  ['16:20', '17:00'], ['17:10', '17:50'], ['18:00', '18:40'], ['18:50', '19:30'],
  ['19:40', '20:20'], ['20:30', '21:10']
];

function gunTarih(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const i = n => (n < 10 ? '0' : '') + n;
  return i(d.getDate()) + '.' + i(d.getMonth() + 1) + '.' + d.getFullYear();
}


module.exports = {
  yasHesapla,
  gucluSifreli,
  SUBJECTS,
  CITIES,
  RESULT_TYPES,
  uid,
  now,
  govdeTemizle,
  KOD_ALFABE,
  KOD_UZUNLUK,
  kodSade,
  makeCode,
  normKullaniciAdi,
  kullaniciAdiSorunu,
  tcSorunu,
  normTc,
  adDuzelt,
  normTelefon,
  telefonSorunu,
  dogumSorunu,
  normEmail,
  sifreSorunu,
  clean,
  ondalik,
  ESKI_SAATLER,
  gunTarih,
  metinYap,
  OKUL_ROLLERI,
  okulHesabiMi,
  asciiYap,
  kisaAdSorunu,
  kisaAdUret,
  tarihCoz
};
