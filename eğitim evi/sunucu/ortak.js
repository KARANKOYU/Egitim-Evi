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

const RESULT_TYPES = ['yapti', 'yapmadi', 'eksik', 'izinli', 'gelmedi'];

/* ============ yardımcılar ============ */
function uid(p) { return p + '_' + crypto.randomBytes(9).toString('hex'); }
function now() { return new Date().toISOString(); }

/* Şifreler scrypt ile saklanır (tuz + 64 baytlık türetilmiş anahtar).
   scryptSync olay döngüsünü bloklar: 100 eşzamanlı giriş denemesi sunucuyu
   saniyelerce kilitler. Bu yüzden çalışma anında hep asenkron sürüm kullanılır;
   senkron sürüm yalnızca açılışta bir kez, ilk admin hesabı için çalışır. */

function govdeTemizle(v, derinlik) {
  derinlik = derinlik || 0;
  if (derinlik > 6 || v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.slice(0, 500).map(x => govdeTemizle(x, derinlik + 1));
  const temiz = Object.create(null);
  for (const k of Object.keys(v)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
    temiz[k] = govdeTemizle(v[k], derinlik + 1);
  }
  return temiz;
}
/* Öğrenci kodu: 14 karakter. Büyük harf + küçük harf + rakam + özel işaret
   içermesi garanti. Karışabilen karakterler (0/O, 1/l/I) bilerek çıkarıldı.
   Alfabe 74 karakter -> 74^14 ≈ 2.3e26 olasılık, tahmin edilemez. */
const KOD_BUYUK = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const KOD_KUCUK = 'abcdefghijkmnopqrstuvwxyz';
const KOD_RAKAM = '23456789';
const KOD_OZEL = '!@#$%*?+-';
const KOD_HEPSI = KOD_BUYUK + KOD_KUCUK + KOD_RAKAM + KOD_OZEL;
const KOD_UZUNLUK = 14;

function kodSec(kume) { return kume[crypto.randomInt(kume.length)]; }

function makeCode() {
  const ch = [kodSec(KOD_BUYUK), kodSec(KOD_KUCUK), kodSec(KOD_RAKAM), kodSec(KOD_OZEL)];
  while (ch.length < KOD_UZUNLUK) ch.push(kodSec(KOD_HEPSI));
  for (let i = ch.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    const t = ch[i]; ch[i] = ch[j]; ch[j] = t;
  }
  return ch.join('');
}
/* Telefonu tek biçime indirir: "0532 123 45 67" -> "05321234567".
   Kullanıcı boşluklu, tireli ya da +90 ile yazabilir. */
function normTelefon(t) {
  let s2 = String(t == null ? '' : t).replace(/[\s()\-.]/g, '');
  if (s2.indexOf('+90') === 0) s2 = '0' + s2.slice(3);
  else if (s2.indexOf('90') === 0 && s2.length === 12) s2 = '0' + s2.slice(2);
  else if (s2.length === 10 && s2[0] === '5') s2 = '0' + s2;
  return s2;
}

function telefonSorunu(t) {
  const s2 = normTelefon(t);
  if (!s2) return 'Telefon numarası gerekli';
  if (!/^0\d{10}$/.test(s2)) {
    return 'Telefonu 0532 123 45 67 biçiminde yaz';
  }
  return '';
}

function normEmail(e) { return String(e == null ? '' : e).trim().toLowerCase(); }

/* Şifre kuralı tek yerde: kayıt, şifre değiştirme ve müdürün açtığı
   hesaplar aynı kuralı kullansın. Sorun varsa metin döner, yoksa null. */
function sifreSorunu(pw) {
  const s = String(pw || '');
  if (s.length < 8) return 'Şifre en az 8 karakter olmalı';
  if (s.length > 200) return 'Şifre çok uzun';
  if (!/[0-9]/.test(s) || !/[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(s)) {
    return 'Şifre en az bir harf ve bir rakam içermeli';
  }
  return null;
}
/* Metin alanı bekliyoruz. İstemci nesne ya da dizi gönderirse bunu metne
   çevirmeye çalışmak yanlış: govdeTemizle prototipsiz nesne ürettiği için
   String() "Cannot convert object to primitive value" diye patlıyordu ve
   herkes istediği uca 500 aldırabiliyordu. Nesne geldiyse boş sayıyoruz. */
function clean(s, max) {
  if (s == null) return '';
  if (typeof s === 'object') return '';
  return String(s).trim().slice(0, max || 200);
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
  SUBJECTS,
  CITIES,
  RESULT_TYPES,
  uid,
  now,
  govdeTemizle,
  KOD_BUYUK,
  KOD_KUCUK,
  KOD_RAKAM,
  KOD_OZEL,
  KOD_HEPSI,
  KOD_UZUNLUK,
  kodSec,
  makeCode,
  normTelefon,
  telefonSorunu,
  normEmail,
  sifreSorunu,
  clean,
  ESKI_SAATLER,
  gunTarih
};
