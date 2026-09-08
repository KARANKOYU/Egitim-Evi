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
    { anahtar: 'eposta', baslik: 'Kullanıcı adı (e-posta)', genislik: 30, zorunlu: true,
      esler: ['kullaniciadieposta', 'kullaniciadi', 'eposta', 'email', 'mail', 'kullanici'] },
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
  }
  return s;   /* çözemedik; hatayı çağıran taraf bildirsin */
}

function iki(n) { return (n < 10 ? '0' : '') + n; }

/* Gün hücresi: "Pazartesi", "pazartesi", "1" ya da "Pzt" */
function gune(v) {
  const s = metin(v);
  if (!s) return 0;
  const n = Number(s);
  if (n >= 1 && n <= 7 && String(n) === s) return n;
  const a = anahtarla(s);
  for (let i = 1; i <= 7; i++) {
    const g = anahtarla(GUNLER[i]);
    if (g === a || g.indexOf(a) === 0 && a.length >= 3) return i;
  }
  return 0;
}

/* ============ başlık eşleme ============ */

function basliklariEsle(satir, sutunlar) {
  const harita = {};
  const bulunan = {};
  for (let i = 0; i < satir.length; i++) {
    const a = anahtarla(satir[i]);
    if (!a) continue;
    for (const s of sutunlar) {
      if (harita[s.anahtar] !== undefined) continue;
      if (s.esler.indexOf(a) >= 0) { harita[s.anahtar] = i; bulunan[a] = 1; break; }
    }
  }
  return harita;
}

/* ============ çözümleme ============ */

/* Dosyadaki ilk sayfayı okur, satırları anahtarlı nesnelere çevirir.
   Dönen hatalar biçimle ilgilidir; iş kuralları çağırana ait. */
function coz(tur, sayfalar) {
  const sutunlar = SUTUNLAR[tur];
  if (!sutunlar) throw new Error('Bilinmeyen aktarım türü.');

  /* Açıklama sayfasını atla: veriyi başlıkları eşleşen ilk sayfada ara. */
  let satirlar = null;
  let harita = null;
  for (const sayfa of sayfalar) {
    const s = sayfa.satirlar || [];
    if (!s.length) continue;
    const h = basliklariEsle(s[0], sutunlar);
    const zorunluVar = sutunlar.filter(c => c.zorunlu)
      .every(c => h[c.anahtar] !== undefined);
    if (zorunluVar) { satirlar = s; harita = h; break; }
  }

  if (!satirlar) {
    const eksikler = sutunlar.filter(c => c.zorunlu).map(c => c.baslik);
    throw new Error('Başlık satırı bulunamadı. İlk satırda şu sütunlar olmalı: ' +
      eksikler.join(', ') + '. Boş şablonu indirip onun üzerine yazman en kolayı.');
  }

  const kayitlar = [];
  const hatalar = [];

  for (let i = 1; i < satirlar.length; i++) {
    const satir = satirlar[i] || [];
    const noSatir = i + 1;   /* Excel'deki gerçek satır numarası */

    const kayit = { satir: noSatir };
    let doluMu = false;
    for (const s of sutunlar) {
      const idx = harita[s.anahtar];
      const ham = idx === undefined ? '' : metin(satir[idx]);
      kayit[s.anahtar] = ham;
      if (ham) doluMu = true;
    }
    if (!doluMu) continue;   /* tamamen boş satırları sessizce atla */

    const eksik = sutunlar.filter(s => s.zorunlu && !kayit[s.anahtar]);
    if (eksik.length) {
      hatalar.push({
        satir: noSatir,
        mesaj: eksik.map(s => s.baslik).join(' ve ') + ' boş'
      });
      continue;
    }

    if (tur === 'program') {
      const g = gune(kayit.gun);
      if (!g) {
        hatalar.push({ satir: noSatir, mesaj: '"' + kayit.gun + '" bir gün adı değil' });
        continue;
      }
      kayit.gunNo = g;

      const bas = saate(kayit.baslangic);
      const bit = saate(kayit.bitis);
      if (!/^\d{2}:\d{2}$/.test(bas)) {
        hatalar.push({ satir: noSatir, mesaj: 'Başlangıç saati anlaşılmadı: "' + kayit.baslangic + '"' });
        continue;
      }
      if (!/^\d{2}:\d{2}$/.test(bit)) {
        hatalar.push({ satir: noSatir, mesaj: 'Bitiş saati anlaşılmadı: "' + kayit.bitis + '"' });
        continue;
      }
      kayit.baslangic = bas;
      kayit.bitis = bit;
    }

    kayitlar.push(kayit);
  }

  return { kayitlar, hatalar, sutunlar };
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
    ['Ad Soyad                 Zorunlu. En az iki kelime olmalı.'],
    ['Kullanıcı adı (e-posta)  Zorunlu. Öğrencinin giriş yaparken yazacağı adres.'],
    ['                         Aynı adres iki kez kullanılamaz.'],
    ['Şifre                    Zorunlu. En az 8 karakter, harf ve rakam içermeli.'],
    ['                         Öğrenci ilk girişte kendisi değiştirebilir.'],
    ['Sınıf                    İsteğe bağlı. Okulda tanımlı sınıf adıyla birebir'],
    ['                         aynı yazmalı, örnek: 9-A'],
    ['Müdür notu               İsteğe bağlı. Öğrenci hesap açmaya çalışırsa bu not'],
    ['                         ona gösterilir.'],
    [''],
    ['Örnek'],
    [''],
    ['Ad Soyad        Kullanıcı adı (e-posta)   Şifre        Sınıf   Müdür notu'],
    ['Ayşe Yılmaz     ayse.yilmaz@okul.com      Okul2026x    9-A     Kaydı tamamlandı'],
    ['Mehmet Öztürk   mehmet.ozturk@okul.com    Okul2026y    9-A'],
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
    ['9-A     Pazartesi   09:20       10:00   Matematik    Ali Kaya'],
    ['9-A     Pazartesi   10:10       10:50   Türkçe       Ayşe Demir'],
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
