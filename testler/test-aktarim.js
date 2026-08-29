/* Toplu aktarım testleri:
   - öğrenci / öğretmen / servisçi listesi tek çalışma kitabında üç sayfa;
   - .xlsx, .ods (müdürün kendi başlıklarıyla), .csv (Windows-1254) ve .txt okunur; öğretmen dosyayla eklenmez;
   - ad, soyad, T.C. zorunlu; boş kullanıcı adı ve şifre T.C. olur;
   - "7" + "çiçek" -> 7-Çiçek sınıfı açılır; aynı T.C. yeniden gelirse güncellenir;
   - TXT isim listesi doldurulacak Excel şablonuna çevrilir;
   - ders programı aktarımı; dışa aktarım; bozuk dosya, sıkıştırma bombası, yetki. */
const zlib = require('zlib');
const { iste, girisYap, tcUret } = require('./giris');
const xlsx = require(require('path').join(__dirname, '..', 'sunucu', 'yardimci', 'xlsx.js'));

