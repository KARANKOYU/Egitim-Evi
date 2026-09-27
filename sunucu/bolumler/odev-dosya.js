'use strict';
/* Ödev teslim dosyaları (/api/odev-dosya).

   Öğrenci ödevine dosya yükler (öğretmen ödevde "Öğrenciler bu ödeve dosya
   yükleyebilsin" dediyse); ödevi veren öğretmen ve okulun müdürü dosyaları
   tek tek ya da hepsini bir zip olarak indirir; veli çocuğunun dosyalarını
   görür ve indirir.

   Sınırlar: tek dosya ve bir öğrencinin bir ödevdeki dosyalarının toplamı
   50 MB, en fazla 10 dosya. Dosya son teslimden 7 gün sonra silinir (son
   teslimi yoksa sonuçlandırılınca + 7 gün, hiç sonuçlandırılmazsa yüklemeden
   60 gün sonra; depo/odev-dosyalari.js SILINME). Okulun dosya alanı
   (EE_OKUL_DOSYA_GB) %80'i geçince ve dolunca müdüre ve sistem yöneticisine
   birer kez bildirim gider.

   Güvenlik:
     - Dosya public klasörünün dışında, 32 haneli rastgele adla durur. Adres
       tahmin edilemez; her indirmede yetki yeniden denetlenir.
     - İndirme her zaman "ek" olarak (attachment, octet-stream, nosniff,
       sandbox) gider: yüklenen HTML ya da SVG tarayıcıda çalıştırılamaz.
     - Yükleme gövdesi JSON okuyucusundan geçmez, diske akarak yazılır;
       bildirilen boyut, dosya ve öğrenci başına sınır, okul kotası ve
       diskteki boş yer yüklemeye başlamadan denetlenir. Sayı ve toplam
       boyut son olarak veritabanında kilitli satırla bir kez daha denetlenir.
     - Teslim süresi dolunca, ödev sonuçlandırılınca ya da öğretmen dosya
       yüklemeyi kapatınca yükleme kapanır (403, dosyaKapali).
     - Yarıda kalan ya da kaydı silinmiş dosyalar periyodik temizlikte silinir. */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { once } = require('events');
const { hizSinir } = require('../guvenlik');
const { bad, baslikEkle, ok, sendJSON } = require('../http');
const { clean } = require('../ortak');
const { depo } = require('../veri');
const { DATA } = require('../yollar');
const { odevBitisAni } = require('./odev');

const KLASOR = path.join(DATA, 'dosyalar');
const MB = 1024 * 1024;
const DOSYA_SINIR = 50 * MB;
const OGRENCI_SINIR = { adet: 10, toplam: 50 * MB };         // bir öğrencinin bir ödevde (toplam 50 MB)
const OKUL_SINIR = Math.round((Number(process.env.EE_OKUL_DOSYA_GB) || 20) * 1024 * MB);
const OKUL_UYARI = 0.8, OKUL_UYARI_SIFIRLA = 0.7;              // %80'de bir kez uyarı; %70'in altına inince yeniden kurulur
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

/* "32,5 MB" (bir ondalık, Türkçe virgül). */
const mbYaz = n => (Math.round(n / MB * 10) / 10).toLocaleString('tr-TR') + ' MB';
/* "16,1 / 20 GB" ya da küçük sınırda "0,8 / 1 MB": birim sınıra göre seçilir. */
function alanYaz(kullanilan, sinir) {
  const gb = sinir >= 1024 * MB, bol = gb ? 1024 * MB : MB;
  const yaz = n => (Math.round(n / bol * 10) / 10).toLocaleString('tr-TR');
  return yaz(kullanilan) + ' / ' + yaz(sinir) + (gb ? ' GB' : ' MB');
}
/* "20 GB" ya da küçük sınırda "1 MB". */
const sinirYaz = n => n >= 1024 * MB ? (Math.round(n / (1024 * MB) * 10) / 10).toLocaleString('tr-TR') + ' GB' : mbYaz(n);

const DOSYA_KAPALI = 'Bu ödev için dosya yüklenmiyor.';
const ALAN_DOLDU = 'Bu ödev için dosya alanın doldu (' + mbYaz(OGRENCI_SINIR.toplam) + '). Yer açmak için bir dosyanı sil.';
const SAYI_DOLDU = 'Bir ödeve en fazla ' + OGRENCI_SINIR.adet + ' dosya yükleyebilirsin. Yer açmak için bir dosyanı sil.';
/* Öğrencinin bu ödevdeki alanına sığmayan dosya. */
function sigmiyor(kullanilan) {
  const kalan = OGRENCI_SINIR.toplam - kullanilan;
  return kalan <= 0 ? ALAN_DOLDU
    : 'Bu dosya sığmıyor: bu ödev için ' + mbYaz(kalan) + ' boş yerin kaldı (en fazla ' + mbYaz(OGRENCI_SINIR.toplam) + ').';
}

/* Teslim dosyalarının ne zaman silineceği (depo/odev-dosyalari.js SILINME ile aynı kural). */
function saklamaYazisi(a) {
  return a.endAt ? 'Dosyalar son teslimden 7 gün sonra silinir.'
    : 'Dosyalar ödev sonuçlandırıldıktan 7 gün sonra silinir; sonuçlandırılmazsa yüklendikten 60 gün sonra.';
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

/* Ödevi yönetir mi: ödevi veren öğretmen ya da okulun müdürü. */
const yonetir = (me, a) => a.teacherId === me.id || (me.role === 'principal' && a.schoolId === me.schoolId);

/* Kişi bu öğrencinin bu ödevdeki dosyalarını görebilir mi? */
async function gorebilir(me, a, ogrenciId) {
  if (a.studentIds.indexOf(ogrenciId) < 0) return false;
  if (me.id === ogrenciId) return true;
  if (yonetir(me, a)) return true;
  return me.role !== 'student' && depo.kullanicilar.bagliMi(me.id, ogrenciId);
}

/* bitis: dosyanın silineceği an (ödevden hesaplanır; depo SILINME). */
const gorunum = d => ({ id: d.id, ad: d.ad, boyut: Number(d.boyut), yuklenme: d.yuklenme, bitis: d.silinme,
  ogrenciId: d.ogrenci_id, ogrenci: d.ogrenci_adi || '' });

/* Okulun dosya alanı: %80'i geçince (seviye 80) ve dolunca (100) müdüre ve
   sistem yöneticilerine bildirim. Her seviye bir kez gider (okul_dosya_uyarilari);
   kullanım %70'in altına inince temizlikte sıfırlanır. */
async function okulUyar(okulId, seviye, kullanilan) {
  if (!okulId || !await depo.odevDosyalari.uyariYaz(okulId, seviye)) return;
  const [okul, mudur] = await Promise.all([depo.okullar.bul(okulId), depo.kullanicilar.okulunMuduru(okulId)]);
  const alan = alanYaz(kullanilan, OKUL_SINIR), sinir = sinirYaz(OKUL_SINIR);
  const metin = seviye >= 100
    ? 'Okulun dosya alanı doldu (' + sinir + '). Öğrenciler ödeve dosya yükleyemiyor; eski teslim dosyaları silindikçe yer açılır.'
    : "Okulun dosya alanının %80'i doldu (" + alan + '). Teslim dosyaları son teslimden 7 gün sonra kendiliğinden silinir.';
  if (mudur) await depo.genel.bildir(mudur.id, metin, '');
  await depo.genel.yoneticilereBildir((okul ? okul.name : 'Bir okul') + ': ' + (seviye >= 100
    ? 'dosya alanı doldu (' + sinir + '), öğrenciler ödeve dosya yükleyemiyor. Sınır EE_OKUL_DOSYA_GB ile büyütülür.'
    : "dosya alanının %80'i doldu (" + alan + ').'), '');
}

async function bosYer() {
  try {
    const s = await fs.promises.statfs(KLASOR);
    return s.bavail * s.bsize;
  } catch (e) { return null; }
}

/* Reddedilen yüklemede gövdenin geri kalanı okunmaz: cevap yazılır, bağlantı
   kısa süre sonra kapatılır (istemci cevabı görebilsin). */
function reddet(req, res, mesaj, kod, ek) {
  if (res.headersSent || res.destroyed) return;
  res.setHeader('Connection', 'close');
  sendJSON(res, kod || 400, Object.assign({ error: mesaj }, ek));
  if (!req.complete) {
    try { req.pause(); } catch (e) { /* yoksay */ }
    setTimeout(() => { try { req.destroy(); } catch (e) { /* yoksay */ } }, 1500);
  }
}

/* İstek gövdesini diske yazar; boyut, CRC32 ve SHA-256 akarken hesaplanır. */
function akisiYaz(req, hedef, beklenen) {
  return new Promise((resolve, reject) => {
    const ozet = crypto.createHash('sha256');
    const yazici = fs.createWriteStream(hedef, { flags: 'wx', mode: 0o600 });
    let crc = 0, n = 0, bitti = false, bosta = null;
    const bas = Date.now();
    const toplamSure = setTimeout(() => bitir(hataYap('Yükleme çok uzun sürdü', 408)), EN_UZUN_MS);
    const bostaKur = () => {
      clearTimeout(bosta);
      bosta = setTimeout(() => bitir(hataYap('Bağlantı koptu, yükleme yarıda kaldı', 408)), BOSTA_MS);
    };
    function hataYap(m, kod) { const e = new Error(m); e.kod = kod; return e; }
    function bitir(hata, sonuc) {
      if (bitti) return;
      bitti = true;
      clearTimeout(bosta);
      clearTimeout(toplamSure);
      if (hata) {
        yazici.destroy();
        fs.unlink(hedef, () => {});
        return reject(hata);
      }
      resolve(sonuc);
    }
    bostaKur();
    req.on('data', parca => {
      if (bitti) return;
      n += parca.length;
      if (n > beklenen) return bitir(hataYap('Dosya bildirilen boyuttan büyük', 400));
      const gecen = (Date.now() - bas) / 1000;
      if (gecen > 60 && n / gecen < EN_AZ_HIZ) {
        return bitir(hataYap('Bağlantı çok yavaş, yükleme kesildi. Daha iyi bir bağlantıyla yeniden dene.', 408));
      }
      ozet.update(parca);
      crc = zlib.crc32(parca, crc);
      bostaKur();
      if (!yazici.write(parca)) {
        req.pause();
        yazici.once('drain', () => { if (!bitti) req.resume(); });
      }
    });
    req.on('end', () => {
      if (bitti) return;
      if (n !== beklenen) return bitir(hataYap('Yükleme yarıda kaldı', 400));
      yazici.end(() => bitir(null, { boyut: n, crc32: crc >>> 0, sha256: ozet.digest('hex') }));
    });
    req.on('close', () => { if (!req.complete) bitir(hataYap('Yükleme yarıda kesildi', 400)); });
    req.on('error', () => bitir(hataYap('Yükleme yarıda kesildi', 400)));
    yazici.on('error', () => bitir(hataYap('Dosya kaydedilemedi', 500)));
  });
}

/* POST /api/odev-dosya/yukle?odev=ID  gövde: dosyanın kendisi
   Başlıklar: Content-Length (zorunlu), X-Dosya-Adi (encodeURIComponent). */
async function yukle(k) {
  const { req, res, me, q } = k;
  if (!me) return reddet(req, res, 'Giriş yapmalısın', 401);
  if (!k.kvkkGuncel) return reddet(req, res, 'Aydınlatma metni güncellendi. Devam etmek için okuyup onaylaman gerekiyor.', 403);
  if (!k.sifreTamam) return reddet(req, res, 'Önce kendi şifreni belirle.', 403);
  if (me.status !== 'approved' || me.role !== 'student') return reddet(req, res, 'Ödeve yalnızca öğrenci dosya yükler', 403);
  if (!hizSinir('dosyaYukle:' + me.id, 60, 60 * 60 * 1000)) return reddet(req, res, 'Bu saat içinde çok fazla dosya yükledin.', 429);

  const a = await depo.odevler.bul(clean(q.get('odev'), 60));
  if (!a || a.studentIds.indexOf(me.id) < 0) return reddet(req, res, 'Ödev bulunamadı', 404);
  if (!a.dosyaYukleme) return reddet(req, res, DOSYA_KAPALI, 403, { dosyaKapali: true });
  const kapali = teslimKapali(a);
  if (kapali) return reddet(req, res, kapali);

  const boyut = Number(req.headers['content-length']);
  if (!Number.isSafeInteger(boyut) || boyut <= 0) return reddet(req, res, 'Dosya boş ya da boyutu bildirilmedi', 411);
  if (boyut > DOSYA_SINIR) return reddet(req, res, 'Bir dosya en fazla ' + mbYaz(DOSYA_SINIR) + ' olabilir.', 413);
  const ad = dosyaAdi(req.headers['x-dosya-adi']);
  if (!ad) return reddet(req, res, 'Dosya adı geçersiz');
  if (!UZANTILAR.has(uzanti(ad))) {
    return reddet(req, res, 'Bu dosya türü yüklenemez. PDF, Word, Excel, sunum, resim, ses, video ya da zip yükleyebilirsin.', 415);
  }

  const onceki = await depo.odevDosyalari.odevin(a.id, me.id);
  const kullanilan = onceki.reduce((t, d) => t + Number(d.boyut), 0);
  if (onceki.length >= OGRENCI_SINIR.adet) return reddet(req, res, SAYI_DOLDU);
  if (kullanilan + boyut > OGRENCI_SINIR.toplam) return reddet(req, res, sigmiyor(kullanilan), 413);
  const okulToplam = Number(await depo.odevDosyalari.okulToplami(a.schoolId));
  await fs.promises.mkdir(KLASOR, { recursive: true });
  const bos = await bosYer();

  /* Buradan ayırmaya kadar await yok: iki yükleme aynı boş yeri paylaşamaz.
     Okulun alanı dolduysa müdüre ve yöneticiye bir kez haber gider (beklenmez). */
  if (okulToplam + (suren.okulBayt.get(a.schoolId) || 0) + boyut > OKUL_SINIR) {
    okulUyar(a.schoolId, 100, okulToplam).catch(() => { /* bildirim gitmezse yükleme yine reddedilir */ });
    return reddet(req, res, 'Okulun dosya alanı doldu. Öğretmenine haber ver.', 507);
  }
  if (bos !== null && bos - suren.bayt - boyut < BOS_YER_PAYI) return reddet(req, res, 'Sunucuda yer kalmadı. Biraz sonra dene.', 507);
  if ((suren.kisi.get(me.id) || 0) >= AYNI_ANDA_KISI || (suren.okul.get(a.schoolId) || 0) >= AYNI_ANDA_OKUL ||
      suren.toplam >= AYNI_ANDA_TOPLAM) {
    return reddet(req, res, 'Aynı anda çok fazla yükleme var. Biri bitince dene.', 429);
  }
  ayir(me.id, a.schoolId, boyut);

  const id = crypto.randomBytes(16).toString('hex');
  const gecici = path.join(KLASOR, id + '.yukleniyor');
  const kalici = path.join(KLASOR, id);
  try {
    let sonuc;
    try {
      sonuc = await akisiYaz(req, gecici, boyut);
    } catch (e) {
      return reddet(req, res, e.message, e.kod || 400);
    }
    /* Yükleme sürerken ödev sonuçlandırılmış, silinmiş ya da süre çoktan
       dolmuş olabilir: son durum yeniden okunur. */
    const simdiki = await depo.odevler.bul(a.id);
    const bitis = simdiki && odevBitisAni(simdiki);
    if (!simdiki || simdiki.status !== 'active' || (bitis && Date.now() > bitis.getTime() + TESLIM_PAYI_MS)) {
      await fs.promises.unlink(gecici).catch(() => {});
      return bad(res, 'Teslim kapandı; dosya kaydedilmedi.');
    }
    if (!simdiki.dosyaYukleme) {
      await fs.promises.unlink(gecici).catch(() => {});
      return sendJSON(res, 403, { error: 'Öğretmen bu ödevde dosya yüklemeyi kapattı; dosya kaydedilmedi.', dosyaKapali: true });
    }
    await fs.promises.rename(gecici, kalici);
    const durum = await depo.odevDosyalari.ekle({ id, odevId: a.id, ogrenciId: me.id, ad,
      boyut: sonuc.boyut, crc32: sonuc.crc32, sha256: sonuc.sha256 }, OGRENCI_SINIR);
    if (durum !== 'tamam') {
      await fs.promises.unlink(kalici).catch(() => {});
      return bad(res, { yok: 'Ödev bulunamadı', sayi: SAYI_DOLDU,
        boyut: 'Bu dosya sığmıyor: bu ödev için dosya alanın en fazla ' + mbYaz(OGRENCI_SINIR.toplam) + '.' }[durum],
        durum === 'yok' ? 404 : durum === 'boyut' ? 413 : 400);
    }
    /* Okulun alanı %80'i geçtiyse müdüre ve yöneticiye bir kez haber gider. */
    if (okulToplam + sonuc.boyut >= OKUL_UYARI * OKUL_SINIR) {
      await okulUyar(a.schoolId, 80, okulToplam + sonuc.boyut).catch(() => { /* bildirim gitmezse yükleme yine tamam */ });
    }
    return ok(res, { dosya: { id, ad, boyut: sonuc.boyut, yuklenme: new Date().toISOString() }, message: ad + ' yüklendi.' });
  } finally {
    birak(me.id, a.schoolId, boyut);
  }
}

/* Dosyayı "ek" olarak gönderir: tarayıcı açmaz, indirir. */
function ekBasliklari(ad, boyut) {
  const ascii = ad.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
  const b = baslikEkle({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename="' + ascii + '"; filename*=UTF-8\'\'' + encodeURIComponent(ad),
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  b['Content-Security-Policy'] = "default-src 'none'; sandbox";
  if (boyut !== undefined) b['Content-Length'] = boyut;
  return b;
}

/* ---------------- zip (sıkıştırmasız, akışla) ----------------
   Dosyaların boyutu ve CRC32'si yüklemede hesaplandığı için başlıklar önceden
   yazılabilir; dosyalar belleğe alınmadan sırayla diskten akar. */
function dosDamga(iso) {
  const d = new Date(iso);
  const saat = (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2);
  const gun = ((Math.max(1980, d.getFullYear()) - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { saat, gun };
}

function yerelBaslik(g) {
  const b = Buffer.alloc(30);
  b.writeUInt32LE(0x04034b50, 0); b.writeUInt16LE(20, 4); b.writeUInt16LE(0x0800, 6); b.writeUInt16LE(0, 8);
  b.writeUInt16LE(g.damga.saat, 10); b.writeUInt16LE(g.damga.gun, 12); b.writeUInt32LE(g.crc, 14);
  b.writeUInt32LE(g.boyut, 18); b.writeUInt32LE(g.boyut, 22); b.writeUInt16LE(g.ad.length, 26); b.writeUInt16LE(0, 28);
  return Buffer.concat([b, g.ad]);
}

function merkezBaslik(g) {
  const b = Buffer.alloc(46);
  b.writeUInt32LE(0x02014b50, 0); b.writeUInt16LE(20, 4); b.writeUInt16LE(20, 6); b.writeUInt16LE(0x0800, 8);
  b.writeUInt16LE(0, 10); b.writeUInt16LE(g.damga.saat, 12); b.writeUInt16LE(g.damga.gun, 14); b.writeUInt32LE(g.crc, 16);
  b.writeUInt32LE(g.boyut, 20); b.writeUInt32LE(g.boyut, 24); b.writeUInt16LE(g.ad.length, 28);
  b.writeUInt32LE(g.konum, 42);
  return Buffer.concat([b, g.ad]);
}

function zipAdi(metin) {
  return String(metin || '').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').trim() || 'adsiz';
}

async function zipGonder(res, a, dosyalar) {
  const girdiler = [];
  const kullanilan = new Set();
  let konum = 0;
  for (const d of dosyalar) {
    const yol = path.join(KLASOR, d.id);
    let st;
    try { st = await fs.promises.stat(yol); } catch (e) { continue; }
    if (st.size !== Number(d.boyut)) continue;        // bozuk ya da yarım dosya zipe girmez
    let ad = zipAdi(d.ogrenci_adi) + '/' + zipAdi(d.ad);
    for (let i = 2; kullanilan.has(ad.toLocaleLowerCase('tr')); i++) {
      const u = uzanti(d.ad);
      ad = zipAdi(d.ogrenci_adi) + '/' + zipAdi(u ? d.ad.slice(0, -(u.length + 1)) : d.ad) + ' (' + i + ')' + (u ? '.' + u : '');
    }
    kullanilan.add(ad.toLocaleLowerCase('tr'));
    const g = { yol, ad: Buffer.from(ad, 'utf8'), boyut: st.size, crc: Number(d.crc32) >>> 0, damga: dosDamga(d.yuklenme), konum };
    konum += 30 + g.ad.length + g.boyut;
    girdiler.push(g);
  }
  if (!girdiler.length) return bad(res, 'İndirilecek dosya yok', 404);
  const merkez = Buffer.concat(girdiler.map(merkezBaslik));
  if (konum + merkez.length + 22 > ZIP_SINIR || girdiler.length > 65000) {
    return bad(res, 'Dosyalar tek zip için çok büyük; öğrenci öğrenci indir.', 413);
  }
  const son = Buffer.alloc(22);
  son.writeUInt32LE(0x06054b50, 0); son.writeUInt16LE(girdiler.length, 8); son.writeUInt16LE(girdiler.length, 10);
  son.writeUInt32LE(merkez.length, 12); son.writeUInt32LE(konum, 16);

  res.writeHead(200, ekBasliklari(zipAdi(a.title) + ' - teslimler.zip', konum + merkez.length + 22));
  let koptu = false;
  res.on('close', () => { koptu = true; });
  /* Geri basınç: yazma tamponu dolunca "drain" ya da "close" beklenir. Kaybeden
     bekleyici iptal edilir; yoksa her beklemede bir dinleyici birikirdi. */
  const yaz = async parca => {
    if (res.write(parca)) return;
    const iptal = new AbortController();
    const bekle = ad => once(res, ad, { signal: iptal.signal }).catch(() => {});
    try { await Promise.race([bekle('drain'), bekle('close')]); } finally { iptal.abort(); }
  };
  try {
    for (const g of girdiler) {
      if (koptu) return;
      await yaz(yerelBaslik(g));
      for await (const parca of fs.createReadStream(g.yol)) {
        if (koptu) return;
        await yaz(parca);
      }
    }
    res.end(Buffer.concat([merkez, son]));
  } catch (e) {
    /* Başlık gitti; yarım zip bırakmak yerine bağlantı kesilir. */
    res.destroy();
  }
}

/* Tek dosyayı gönderir (yetki çağıran tarafından denetlenmiş olmalı). */
/* Fotoğraf, video ya da sesi tarayıcıda açar. Range destekli (video ileri
   sarılabilsin); yine de içerik sezdirilmez ve betik çalışamaz. */
async function medyaGonder(req, res, d) {
  const m = medya(d.ad);
  if (!m) return dosyaGonder(res, d);
  const yol = path.join(KLASOR, d.id);
  let st;
  try { st = await fs.promises.stat(yol); } catch (e) { return bad(res, 'Dosya sunucuda bulunamadı', 404); }
  const ascii = d.ad.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
  const b = baslikEkle({
    'Content-Type': m[1],
    'Content-Disposition': 'inline; filename="' + ascii + '"; filename*=UTF-8\'\'' + encodeURIComponent(d.ad),
    'Cache-Control': 'private, max-age=300',
    'Accept-Ranges': 'bytes',
    'X-Content-Type-Options': 'nosniff'
  });
  b['Content-Security-Policy'] = "default-src 'none'; img-src 'self'; media-src 'self'; sandbox";
  const aralik = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range || ''));
  if (aralik && (aralik[1] || aralik[2])) {
    let bas = aralik[1] ? Number(aralik[1]) : st.size - Number(aralik[2]);
    let bit = aralik[1] && aralik[2] ? Number(aralik[2]) : st.size - 1;
    bas = Math.max(0, bas); bit = Math.min(bit, st.size - 1);
    if (!(bas <= bit)) {
      res.writeHead(416, baslikEkle({ 'Content-Range': 'bytes */' + st.size }));
      return res.end();
    }
    b['Content-Range'] = 'bytes ' + bas + '-' + bit + '/' + st.size;
    b['Content-Length'] = bit - bas + 1;
    res.writeHead(206, b);
    return fs.createReadStream(yol, { start: bas, end: bit }).on('error', () => res.destroy()).pipe(res);
  }
  b['Content-Length'] = st.size;
  res.writeHead(200, b);
  fs.createReadStream(yol).on('error', () => res.destroy()).pipe(res);
}

async function dosyaGonder(res, d) {
  const yol = path.join(KLASOR, d.id);   // id veritabanında 32 haneli onaltılık olarak denetlenir
  let st;
  try { st = await fs.promises.stat(yol); } catch (e) { return bad(res, 'Dosya sunucuda bulunamadı', 404); }
  res.writeHead(200, ekBasliklari(d.ad, st.size));
  fs.createReadStream(yol).on('error', () => res.destroy()).pipe(res);
}

/* Dosya ve ödev için erişim denetimi; indirmede ve bilet verirken aynı kural. */
async function dosyaErisimi(kisi, id) {
  const d = await depo.odevDosyalari.bul(clean(id, 40));
  if (!d) return { hata: 'Dosya bulunamadı', kod: 404 };
  const a = await depo.odevler.bul(d.odev_id);
  if (!a || !await gorebilir(kisi, a, d.ogrenci_id)) return { hata: 'Bu dosyayı görme yetkin yok', kod: 403 };
  return { d };
}
async function zipErisimi(kisi, odevId) {
  const a = await depo.odevler.bul(clean(odevId, 60));
  if (!a) return { hata: 'Ödev bulunamadı', kod: 404 };
  if (!yonetir(kisi, a)) return { hata: 'Toplu indirmeyi yalnızca ödevi veren öğretmen yapabilir', kod: 403 };
  return { a };
}

/* Biletle indirme: oturum başlığı yok, bilet sahibinin yetkisi yeniden denetlenir. */
async function biletleIndir(req, res, bilet, tur) {
  const b = biletKullan(bilet);
  if (!b || b.tur !== tur) return bad(res, 'İndirme bağlantısının süresi doldu. Yeniden dene.', 410);
  const kisi = await depo.kullanicilar.bul(b.kullaniciId);
  if (!kisi || kisi.status !== 'approved') return bad(res, 'Yetkin yok', 403);
  if (tur === 'dosya' || tur === 'goster') {
    const e = await dosyaErisimi(kisi, b.hedef);
    if (e.hata) return bad(res, e.hata, e.kod);
    return tur === 'goster' ? medyaGonder(req, res, e.d) : dosyaGonder(res, e.d);
  }
  const e = await zipErisimi(kisi, b.hedef);
  if (e.hata) return bad(res, e.hata, e.kod);
  return zipGonder(res, e.a, await depo.odevDosyalari.odevin(e.a.id));
}

/* ---------------- uçlar ---------------- */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;
  if (p !== 'odev-dosya') return false;
  const alt = segs[2] || '';
  if (alt === 'yukle' && method === 'POST') return yukle(k);
  if ((alt === 'indir' || alt === 'zip' || alt === 'goster') && method === 'GET' && q.get('bilet')) {
    return biletleIndir(req, res, clean(q.get('bilet'), 60), alt === 'zip' ? 'zip' : alt === 'goster' ? 'goster' : 'dosya');
  }
  if (!need(['student', 'parent', 'teacher', 'principal'])) return;

  /* İndirme bileti ister: dosya (id) ya da zip (odev). */
  if (alt === 'bilet' && method === 'GET') {
    const tur = clean(q.get('tur'), 10) === 'zip' ? 'zip' : 'dosya';   // "goster" aşağıda dosya kuralıyla
    if (tur === 'zip') {
      if (!hizSinir('dosyaZip:' + me.id, 20, 60 * 60 * 1000)) return bad(res, 'Çok fazla toplu indirme yaptın. Biraz bekle.', 429);
      const e = await zipErisimi(me, q.get('odev'));
      if (e.hata) return bad(res, e.hata, e.kod);
      const bilet = biletVer(me.id, 'zip', e.a.id);
      if (!bilet) return bad(res, 'Sunucu şu an çok yoğun. Biraz sonra dene.', 503);
      return ok(res, { yol: '/api/odev-dosya/zip?bilet=' + bilet });
    }
    if (!hizSinir('dosyaIndir:' + me.id, 300, 60 * 60 * 1000)) return bad(res, 'Çok fazla indirme yaptın. Biraz bekle.', 429);
    const e = await dosyaErisimi(me, q.get('id'));
    if (e.hata) return bad(res, e.hata, e.kod);
    /* Fotoğraf, video, ses: tarayıcıda açılır (tur=goster). */
    if (clean(q.get('tur'), 10) === 'goster') {
      const m = medya(e.d.ad);
      if (!m) return bad(res, 'Bu dosya tarayıcıda açılamaz; indir.');
      const bilet = biletVer(me.id, 'goster', e.d.id);
      if (!bilet) return bad(res, 'Sunucu şu an çok yoğun. Biraz sonra dene.', 503);
      return ok(res, { yol: '/api/odev-dosya/goster?bilet=' + bilet, tur: m[0] });
    }
    const bilet = biletVer(me.id, 'dosya', e.d.id);
    if (!bilet) return bad(res, 'Sunucu şu an çok yoğun. Biraz sonra dene.', 503);
    return ok(res, { yol: '/api/odev-dosya/indir?bilet=' + bilet });
  }

  /* Liste: öğrenci kendi dosyalarını; veli ?ogrenci= ile çocuğununkileri;
     öğretmen/müdür ödevin bütün dosyalarını görür. */
  if (!alt && method === 'GET') {
    const a = await depo.odevler.bul(clean(q.get('odev'), 60));
    if (!a) return bad(res, 'Ödev bulunamadı', 404);
    if (yonetir(me, a) && !q.get('ogrenci')) {
      const dosyalar = (await depo.odevDosyalari.odevin(a.id)).map(gorunum);
      return ok(res, { dosyalar, yonetir: true, toplam: dosyalar.reduce((t, d) => t + d.boyut, 0),
        dosyaYukleme: a.dosyaYukleme, saklama: saklamaYazisi(a) });
    }
    const ogrenciId = me.role === 'student' ? me.id : clean(q.get('ogrenci'), 60);
    if (!await gorebilir(me, a, ogrenciId)) return bad(res, 'Bu dosyaları görme yetkin yok', 403);
    /* Dosya yükleme kapalıysa önceden yüklenenler kalır ve teslim donar:
       öğrenci ne yeni dosya yükleyebilir ne yüklediğini silebilir. */
    const teslim = teslimKapali(a);
    const kapali = a.dosyaYukleme ? teslim : DOSYA_KAPALI;
    const dosyalar = (await depo.odevDosyalari.odevin(a.id, ogrenciId)).map(gorunum);
    return ok(res, {
      dosyalar, dosyaYukleme: a.dosyaYukleme,
      yukleyebilir: me.id === ogrenciId && !kapali, silebilir: me.id === ogrenciId && !teslim && a.dosyaYukleme, kapali,
      kullanilan: dosyalar.reduce((t, d) => t + d.boyut, 0), saklama: saklamaYazisi(a),
      sinir: { dosya: DOSYA_SINIR, adet: OGRENCI_SINIR.adet, toplam: OGRENCI_SINIR.toplam, uzantilar: [...UZANTILAR] }
    });
  }

  if (alt === 'indir' && method === 'GET') {
    if (!hizSinir('dosyaIndir:' + me.id, 300, 60 * 60 * 1000)) return bad(res, 'Çok fazla indirme yaptın. Biraz bekle.', 429);
    const e = await dosyaErisimi(me, q.get('id'));
    if (e.hata) return bad(res, e.hata, e.kod);
    return dosyaGonder(res, e.d);
  }

  if (alt === 'zip' && method === 'GET') {
    const e = await zipErisimi(me, q.get('odev'));
    if (e.hata) return bad(res, e.hata, e.kod);
    if (!hizSinir('dosyaZip:' + me.id, 20, 60 * 60 * 1000)) return bad(res, 'Çok fazla toplu indirme yaptın. Biraz bekle.', 429);
    return zipGonder(res, e.a, await depo.odevDosyalari.odevin(e.a.id));
  }

  /* Silme: öğrenci kendi dosyasını teslim açıkken; öğretmen/müdür her zaman. */
  if (alt === 'sil' && method === 'POST') {
    const d = await depo.odevDosyalari.bul(clean(body.id, 40));
    if (!d) return bad(res, 'Dosya bulunamadı', 404);
    const a = await depo.odevler.bul(d.odev_id);
    if (!a) return bad(res, 'Dosya bulunamadı', 404);
    if (!yonetir(me, a)) {
      if (me.id !== d.ogrenci_id) return bad(res, 'Bu dosyayı silme yetkin yok', 403);
      const kapali = teslimKapali(a);
      if (kapali) return bad(res, kapali + ' Dosya silinemez.');
      /* Öğretmen dosya yüklemeyi kapattıysa teslim donar: öğretmen değerlendirirken
         dosya kaybolmasın (yalnız öğretmen silebilir). */
      if (!a.dosyaYukleme) return sendJSON(res, 403, { error: 'Öğretmen bu ödevde dosya yüklemeyi kapattı; dosyan artık silinemez.', dosyaKapali: true });
    }
    await depo.odevDosyalari.sil(d.id);
    await fs.promises.unlink(path.join(KLASOR, d.id)).catch(() => {});
    return ok(res, { message: d.ad + ' silindi.' });
  }

  return false;
}

/* Artık temizliği: silinme anı gelen teslim dosyaları (son teslim + 7 gün;
   depo SILINME), yarıda kalmış yüklemeler (2 saatten eski) ve kaydı silinmiş
   dosyalar (1 saatten eski) diskten silinir. Okulun alanı %70'in altına indiyse
   dosya alanı uyarısı sıfırlanır. */
async function dosyaSupur() {
  for (const id of await depo.odevDosyalari.eskileriSil()) {
    await fs.promises.unlink(path.join(KLASOR, id)).catch(() => {});
  }
  await depo.odevDosyalari.uyarilariSifirla(Math.floor(OKUL_UYARI_SIFIRLA * OKUL_SINIR));
  let adlar;
  try { adlar = await fs.promises.readdir(KLASOR); } catch (e) { return 0; }
  const simdi = Date.now();
  const kalicilar = adlar.filter(a => /^[0-9a-f]{32}$/.test(a));
  const kayitli = await depo.odevDosyalari.kayitlilar(kalicilar);
  let silinen = 0;
  for (const ad of adlar) {
    const yarim = /^[0-9a-f]{32}\.yukleniyor$/.test(ad);
    if (!yarim && (!/^[0-9a-f]{32}$/.test(ad) || kayitli.has(ad))) continue;
    try {
      const st = await fs.promises.stat(path.join(KLASOR, ad));
      if (simdi - st.mtimeMs < (yarim ? 2 : 1) * 60 * 60 * 1000) continue;
      await fs.promises.unlink(path.join(KLASOR, ad));
      silinen++;
    } catch (e) { /* bu arada silinmiş olabilir */ }
  }
  return silinen;
}

module.exports = { uclar, dosyaSupur, dosyaAdi, teslimKapali, KLASOR,
  /* ekler.js de aynı güvenli yükleme ve indirme yardımcılarını kullanır */
  akisiYaz, reddet, ekBasliklari, uzanti, UZANTILAR, biletVer, biletKullan };
