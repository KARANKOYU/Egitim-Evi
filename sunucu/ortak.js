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

