'use strict';
/* Excel ile içe ve dışa aktarım.

   Burada yalnızca tablo biçimi işleniyor: hangi sütun neye karşılık geliyor,
   hücredeki değer ne anlama geliyor, biçim hatası var mı. Sınıf gerçekten
   var mı, e-posta zaten kayıtlı mı gibi veritabanına bakan denetimler
   server.js tarafında yapılıyor.
*/

const xlsx = require('./xlsx');

/* ============ sütun tanımları ============
   esler: kullanıcının yazabileceği başlık karşılıkları. Sütun sırası
   değiştirilse ya da fazladan sütun eklense de dosya okunabilsin diye
   başlıkları ada göre eşliyoruz. */

const SUTUNLAR = {
  ogrenci: [
    { anahtar: 'ad', baslik: 'Ad Soyad', genislik: 26, zorunlu: true,
      esler: ['adsoyad', 'ad', 'isim', 'isimsoyisim', 'ogrenci', 'ogrenciadi'] },
    { anahtar: 'kullaniciAdi', baslik: 'Kullanıcı adı', genislik: 22, zorunlu: true,
      esler: ['kullaniciadi', 'kullaniciadieposta', 'kullanici', 'kadi'] },
    { anahtar: 'eposta', baslik: 'E-posta', genislik: 28,
      esler: ['eposta', 'email', 'mail', 'epostaadresi'] },
    { anahtar: 'sifre', baslik: 'Şifre', genislik: 16, zorunlu: true,
      esler: ['sifre', 'parola', 'password'] },
    { anahtar: 'sinif', baslik: 'Sınıf', genislik: 12,
      esler: ['sinif', 'sube', 'sinifsube'] },
    { anahtar: 'aciklama', baslik: 'Müdür notu', genislik: 34,
      esler: ['mudurnotu', 'not', 'aciklama', 'notu'] }
  ],
  program: [
    { anahtar: 'sinif', baslik: 'Sınıf', genislik: 12, zorunlu: true,
      esler: ['sinif', 'sube', 'sinifsube'] },
    { anahtar: 'gun', baslik: 'Gün', genislik: 12, zorunlu: true,
      esler: ['gun', 'gunu', 'hangigun'] },
    { anahtar: 'baslangic', baslik: 'Başlangıç', genislik: 12, zorunlu: true,
      esler: ['baslangic', 'baslangicsaati', 'baslama', 'baslar', 'saat'] },
    { anahtar: 'bitis', baslik: 'Bitiş', genislik: 12, zorunlu: true,
      esler: ['bitis', 'bitissaati', 'biter'] },
    { anahtar: 'ders', baslik: 'Ders', genislik: 22, zorunlu: true,
      esler: ['ders', 'dersadi', 'dersin', 'brans'] },
    { anahtar: 'ogretmen', baslik: 'Öğretmen', genislik: 24,
      esler: ['ogretmen', 'ogretmeni', 'ogretmenadi', 'dersogretmeni'] }
  ]
};

const GUNLER = ['', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

/* ============ metin yardımcıları ============ */

/* Başlık eşlemesi için: büyük/küçük harf, Türkçe karakter ve boşluk farkını siler. */
function anahtarla(s) {
  return String(s == null ? '' : s)
    .replace(/İ/g, 'i').replace(/I/g, 'i').replace(/ı/g, 'i')
    .replace(/Ş/g, 's').replace(/ş/g, 's')
    .replace(/Ğ/g, 'g').replace(/ğ/g, 'g')
    .replace(/Ü/g, 'u').replace(/ü/g, 'u')
    .replace(/Ö/g, 'o').replace(/ö/g, 'o')
    .replace(/Ç/g, 'c').replace(/ç/g, 'c')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function metin(v) {
  return String(v == null ? '' : v).trim();
}

/* Saat hücresi: "09:20" gelebilir, "9.20" gelebilir, ama kullanıcı hücreyi
   saat olarak biçimlendirdiyse Excel bunu 0.38888 gibi bir kesir olarak
   saklar. Üçünü de kabul ediyoruz. */
function saate(v) {
  const s = metin(v);
  if (!s) return '';

  if (/^\d*\.\d+$/.test(s)) {
    const kesir = Number(s);
    if (kesir >= 0 && kesir < 1) {
      const toplam = Math.round(kesir * 24 * 60);
      const sa = Math.floor(toplam / 60);
      const dk = toplam % 60;
      return iki(sa) + ':' + iki(dk);
    }
  }

  const m = /^(\d{1,2})[:.,\s]?(\d{2})$/.exec(s);
  if (m) {
    const sa = Number(m[1]), dk = Number(m[2]);
    if (sa >= 0 && sa <= 23 && dk >= 0 && dk <= 59) return iki(sa) + ':' + iki(dk);
    return '';   /* 25:00, 99:99: saat biçiminde ama böyle bir saat yok */
  }
  return s;   /* çözemedik; hatayı çağıran taraf bildirsin */
}

function iki(n) { return (n < 10 ? '0' : '') + n; }

/* Yaygın gün kısaltmaları (anahtarlanmış hâlleriyle). "Paz" Pazar'dır,
   Pazartesi "Pzt". */
const GUN_KISA = { pzt: 1, pts: 1, sal: 2, car: 3, crs: 3, per: 4, prs: 4, cum: 5, cmt: 6, cts: 6, paz: 7, pzr: 7 };

/* Gün hücresi: "Pazartesi", "pazartesi", "1" ya da "Pzt". Önce tam ad
   aranır ("Pazar" "Pazartesi"nin baş kısmı olduğu için), sonra kısaltma,
   en son baş kısmı. */
function gune(v) {
  const s = metin(v);
  if (!s) return 0;
  const n = Number(s);
  if (n >= 1 && n <= 7 && String(n) === s) return n;
  const a = anahtarla(s);
  for (let i = 1; i <= 7; i++) if (anahtarla(GUNLER[i]) === a) return i;
  if (GUN_KISA[a]) return GUN_KISA[a];
  if (a.length >= 3) {
    const tutan = [];
    for (let i = 1; i <= 7; i++) if (anahtarla(GUNLER[i]).indexOf(a) === 0) tutan.push(i);
    if (tutan.length === 1) return tutan[0];
  }
  return 0;
}

/* ============ boş şablon ============ */

const ANLATIM = {
  ogrenci: [
    ['Öğrenci listesi nasıl doldurulur'],
    [''],
    ['Bu dosyadaki "Öğrenciler" sayfasına satır satır öğrencileri yaz, sonra'],
    ['sisteme geri yükle. Her satır bir öğrenci hesabı açar.'],
    [''],
    ['Sütunlar'],
    ['Ad Soyad        Zorunlu. En az iki kelime olmalı.'],
    ['Kullanıcı adı   Zorunlu. Öğrencinin giriş yaparken yazacağı ad. Harfle başlar;'],
    ['                yalnızca a-z, rakam, nokta ve alt çizgi (Türkçe harf yok).'],
    ['                Aynı ad iki kez kullanılamaz. Büyük/küçük harf fark etmez.'],
    ['E-posta         İsteğe bağlı. Yazılırsa giriş kodu ve şifre sıfırlama oraya'],
    ['                gider. Boşsa öğrenci yalnızca kullanıcı adı ve şifreyle girer.'],
    ['Şifre           Zorunlu. En az 8 karakter, harf ve rakam içermeli.'],
    ['                Öğrenci ilk girişte kendisi değiştirebilir.'],
    ['Sınıf           İsteğe bağlı. Okulda tanımlı sınıf adıyla aynı yazmalı,'],
    ['                örnek: 9-A'],
    ['Müdür notu      İsteğe bağlı. Yalnızca okul yönetimi görür.'],
    [''],
    ['Örnek'],
    [''],
    ['Ad Soyad        Kullanıcı adı    E-posta                  Şifre        Sınıf'],
    ['Ad Soyad        kullanici.adi    eposta@ornek.com         Okul2026x    9-A'],
    ['Ad Soyad        kullanici.adi2                            Okul2026y    9-A'],
    [''],
    ['Bilinmesi gerekenler'],
    ['- Sütunların sırasını değiştirebilirsin, başlık adları önemli.'],
    ['- Fazladan sütun eklersen görmezden gelinir.'],
    ['- Boş satırlar atlanır.'],
    ['- Yükleme iki adımlı: önce ne olacağını gösteren bir liste görürsün,'],
    ['  onayladıktan sonra hesaplar açılır.'],
    ['- Bir satırda hata varsa yalnızca o satır atlanır, diğerleri işlenir.'],
    ['- Her öğrenciye giriş kodu otomatik üretilir; velinin çocuğunu kendi'],
    ['  hesabına bağlaması için o kod gerekir.']
  ],
  program: [
    ['Ders programı nasıl doldurulur'],
    [''],
    ['Bu dosyadaki "Ders programı" sayfasına her ders saati için bir satır yaz,'],
    ['sonra sisteme geri yükle.'],
    [''],
    ['Sütunlar'],
    ['Sınıf       Zorunlu. Okulda tanımlı sınıf adıyla birebir aynı, örnek: 9-A'],
    ['Gün         Zorunlu. Pazartesi, Salı, Çarşamba, Perşembe, Cuma,'],
    ['            Cumartesi, Pazar. İstersen 1-7 arası sayı da yazabilirsin.'],
    ['Başlangıç   Zorunlu. SS:DD biçiminde, örnek: 09:20'],
    ['Bitiş       Zorunlu. SS:DD biçiminde, örnek: 10:00'],
    ['Ders        Zorunlu. O sınıfta tanımlı ders adı, örnek: Matematik'],
    ['Öğretmen    İsteğe bağlı. Boş bırakırsan dersin kayıtlı öğretmeni kullanılır.'],
    [''],
    ['Örnek'],
    [''],
    ['Sınıf   Gün         Başlangıç   Bitiş   Ders         Öğretmen'],
    ['9-A     Pazartesi   09:20       10:00   Matematik    Ad Soyad'],
    ['9-A     Pazartesi   10:10       10:50   Türkçe       Ad Soyad'],
    ['9-A     Salı        09:20       10:00   Fizik'],
    [''],
    ['Bilinmesi gerekenler'],
    ['- Saat hücresini Excel\'de saat olarak biçimlendirirsen de çalışır.'],
    ['- Sütunların sırasını değiştirebilirsin, başlık adları önemli.'],
    ['- Yükleme iki adımlı: önce ne olacağını görürsün, sonra onaylarsın.'],
    ['- Aynı öğretmeni ya da sınıfı aynı saate koyan satırlar için uyarı'],
    ['  alırsın, ama istersen yine de kaydedebilirsin.'],
    ['- Var olan programın üzerine ekler; silmek istersen program sayfasından'],
    ['  tek tek kaldırabilirsin.']
  ]
};

const SAYFA_ADI = { ogrenci: 'Öğrenciler', program: 'Ders programı' };

function sablon(tur) {
  const sutunlar = SUTUNLAR[tur];
  if (!sutunlar) throw new Error('Bilinmeyen şablon türü.');
  return xlsx.yaz([
    {
      ad: SAYFA_ADI[tur],
      basliklar: sutunlar.map(s => s.baslik),
      satirlar: [],
      genislikler: sutunlar.map(s => s.genislik)
    },
    {
      ad: 'Nasıl doldurulur',
      duz: true,
      satirlar: ANLATIM[tur],
      genislikler: [95]
    }
  ]);
}

/* ============ dışa aktarım ============ */

function disa(sayfaAdi, basliklar, satirlar, genislikler) {
  return xlsx.yaz([{
    ad: sayfaAdi,
    basliklar: basliklar,
    satirlar: satirlar,
    genislikler: genislikler || basliklar.map(() => 20)
  }]);
}

module.exports = { SUTUNLAR, GUNLER, coz, sablon, disa, anahtarla, saate, gune };
