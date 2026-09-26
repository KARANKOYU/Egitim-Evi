'use strict';
/* Ödev teslim dosyaları (/api/odev-dosya).

   Öğrenci ödevine dosya yükler; ödevi veren öğretmen ve okulun müdürü
   dosyaları tek tek ya da hepsini bir zip olarak indirir; veli çocuğunun
   dosyalarını görür ve indirir.

   Güvenlik:
     - Dosya public klasörünün dışında, 32 haneli rastgele adla durur. Adres
       tahmin edilemez; her indirmede yetki yeniden denetlenir.
     - İndirme her zaman "ek" olarak (attachment, octet-stream, nosniff,
       sandbox) gider: yüklenen HTML ya da SVG tarayıcıda çalıştırılamaz.
     - Yükleme gövdesi JSON okuyucusundan geçmez, diske akarak yazılır;
       bildirilen boyut, dosya ve öğrenci başına sınır, okul kotası ve
       diskteki boş yer yüklemeye başlamadan denetlenir. Sayı ve toplam
       boyut son olarak veritabanında kilitli satırla bir kez daha denetlenir.
     - Teslim süresi dolunca ya da ödev sonuçlandırılınca yükleme kapanır.
     - Yarıda kalan ya da kaydı silinmiş dosyalar periyodik temizlikte silinir. */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { once } = require('events');
const { hizSinir } = require('../guvenlik');
const { bad, baslikEkle, ok } = require('../http');
const { clean } = require('../ortak');
const { depo } = require('../veri');
const { DATA } = require('../yollar');
const { odevBitisAni } = require('./odev');

const KLASOR = path.join(DATA, 'dosyalar');
const MB = 1024 * 1024;
const DOSYA_SINIR = 150 * MB;
const OGRENCI_SINIR = { adet: 10, toplam: 150 * MB };        // bir öğrencinin bir ödevde (toplam 150 MB)
const SAKLAMA_GUN = 7;                                         // teslim dosyası 7 gün sonra silinir
const OKUL_SINIR = (Number(process.env.EE_OKUL_DOSYA_GB) || 20) * 1024 * MB;
const BOS_YER_PAYI = 2 * 1024 * MB;                           // diskte her zaman kalacak boş yer
const ZIP_SINIR = 3500 * MB;                                   // zip32 sınırının altında
const BOSTA_MS = 60 * 1000;                                    // bu kadar veri gelmezse yükleme kesilir
const EN_UZUN_MS = 60 * 60 * 1000;
const EN_AZ_HIZ = 8 * 1024;                                    // bayt/sn; ilk dakikadan sonra ortalama bunun altındaysa kesilir
const TESLIM_PAYI_MS = 10 * 60 * 1000;                         // süre dolmadan başlayan yükleme bu kadar geç bitebilir
const AYNI_ANDA_KISI = 3, AYNI_ANDA_OKUL = 20, AYNI_ANDA_TOPLAM = 60;

/* Okulda kullanılan dosya türleri. Listede olmayan (ör. .exe, .bat) yüklenmez. */
const UZANTILAR = new Set(('pdf doc docx odt rtf txt xls xlsx ods csv ppt pptx odp key pages numbers ' +
  'jpg jpeg png gif webp heic heif bmp tif tiff svg psd ai ' +
  'mp3 m4a wav ogg aac flac mp4 mov m4v webm avi mkv 3gp ' +
  'zip rar 7z sb3 ggb py ipynb html css js java c cpp').split(' '));

/* Süren yüklemeler: kişi ve okul başına sayı, ayrılmış bayt. Boş yer ve okul
   kotası denetimi süren yüklemeleri de sayar; aynı anda başlayan yüklemeler
   birlikte sınırı aşamaz. */
const suren = { kisi: new Map(), okul: new Map(), okulBayt: new Map(), toplam: 0, bayt: 0 };
const artir = (harita, anahtar, n) => {
  const v = (harita.get(anahtar) || 0) + n;
  if (v > 0) harita.set(anahtar, v); else harita.delete(anahtar);
};
function ayir(kisiId, okulId, boyut) {
  artir(suren.kisi, kisiId, 1); artir(suren.okul, okulId, 1); artir(suren.okulBayt, okulId, boyut);
  suren.toplam++; suren.bayt += boyut;
}
function birak(kisiId, okulId, boyut) {
  artir(suren.kisi, kisiId, -1); artir(suren.okul, okulId, -1); artir(suren.okulBayt, okulId, -boyut);
  suren.toplam--; suren.bayt -= boyut;
}

/* İndirme bileti: büyük dosya ve zip tarayıcı belleğine alınmadan doğrudan
   diske insin diye. 60 sn geçerli, tek kullanımlık, kişiye ve dosyaya bağlı;
   kullanılırken yetki yeniden denetlenir. */
const biletler = new Map();   // bilet -> { kullaniciId, tur, hedef, bitis }
/* "goster" bileti (fotoğraf, video, ses izlemek için) 5 dakika boyunca
   birden çok kez kullanılır: tarayıcı videoyu ileri sararken aynı adresi
   parça parça (Range) ister. Öbürleri tek kullanımlık, 60 sn. */
function biletVer(kullaniciId, tur, hedef) {
  const simdi = Date.now();
  for (const [b, v] of biletler) if (v.bitis < simdi) biletler.delete(b);
  if (biletler.size > 5000) return '';
  const bilet = crypto.randomBytes(24).toString('hex');
  biletler.set(bilet, { kullaniciId, tur, hedef, bitis: simdi + (tur === 'goster' ? 5 * 60 * 1000 : 60 * 1000) });
  return bilet;
}
function biletKullan(bilet) {
  const anahtar = String(bilet || '');
  const v = biletler.get(anahtar);
  if (!v) return null;
  if (v.tur !== 'goster') biletler.delete(anahtar);
  return v.bitis >= Date.now() ? v : null;
}

/* Tarayıcıda açılabilen türler (öbür her şey yalnızca iner). SVG ve HTML
   burada YOK: içlerinde betik olabilir. Tür uzantıdan belirlenir, dosyanın
   kendisinden sezdirilmez (nosniff): uzantısı .mp4 olan bir HTML dosyası
   tarayıcıda yalnızca bozuk bir video olarak görünür, sayfa olarak açılmaz. */
const MEDYA = {
  jpg: ['resim', 'image/jpeg'], jpeg: ['resim', 'image/jpeg'], png: ['resim', 'image/png'], gif: ['resim', 'image/gif'],
  webp: ['resim', 'image/webp'], bmp: ['resim', 'image/bmp'],
  mp4: ['video', 'video/mp4'], m4v: ['video', 'video/mp4'], webm: ['video', 'video/webm'], mov: ['video', 'video/quicktime'],
  mp3: ['ses', 'audio/mpeg'], m4a: ['ses', 'audio/mp4'], wav: ['ses', 'audio/wav'], ogg: ['ses', 'audio/ogg'], aac: ['ses', 'audio/aac']
};
const medya = ad => MEDYA[uzanti(ad)] || null;

const uzanti = ad => { const i = ad.lastIndexOf('.'); return i > 0 ? ad.slice(i + 1).toLowerCase() : ''; };

/* Kullanıcının gönderdiği dosya adı: yol parçaları, denetim karakterleri ve
   Windows'ta yasak işaretler atılır; en fazla 150 karakter (uzantı korunur). */
function dosyaAdi(ham) {
  let ad;
  try { ad = decodeURIComponent(String(ham || '')); } catch (e) { return ''; }
  ad = ad.split(/[\\/]/).pop().normalize('NFC')
    .replace(/[\u0000-\u001f\u007f<>:"|?*\u202a-\u202e\u2066-\u2069]/g, '').replace(/\s+/g, ' ').trim()
    .replace(/^\.+/, '');
  if (ad.length > 150) {
    const u = uzanti(ad);
    ad = ad.slice(0, 149 - u.length).trim() + '.' + u;
  }
  return ad;
}

/* Ödev teslime açık mı? Kapalıysa nedenini döner. */
function teslimKapali(a) {
  if (a.status !== 'active') return 'Ödev sonuçlandırıldı; dosya yüklenemez.';
  const bugun = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  if (a.startAt && a.startAt > bugun) return 'Ödev henüz başlamadı.';
  const bitis = odevBitisAni(a);
  if (bitis && Date.now() > bitis.getTime()) return 'Teslim süresi doldu.';
  return '';
}

