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

/* Ödevi yönetir mi: ödevi veren öğretmen ya da okulun müdürü. */
const yonetir = (me, a) => a.teacherId === me.id || (me.role === 'principal' && a.schoolId === me.schoolId);

/* Kişi bu öğrencinin bu ödevdeki dosyalarını görebilir mi? */
async function gorebilir(me, a, ogrenciId) {
  if (a.studentIds.indexOf(ogrenciId) < 0) return false;
  if (me.id === ogrenciId) return true;
  if (yonetir(me, a)) return true;
  return me.role !== 'student' && depo.kullanicilar.bagliMi(me.id, ogrenciId);
}

const gorunum = d => ({ id: d.id, ad: d.ad, boyut: Number(d.boyut), yuklenme: d.yuklenme,
  bitis: new Date(new Date(d.yuklenme).getTime() + SAKLAMA_GUN * 24 * 60 * 60 * 1000).toISOString(),
  ogrenciId: d.ogrenci_id, ogrenci: d.ogrenci_adi || '' });

async function bosYer() {
  try {
    const s = await fs.promises.statfs(KLASOR);
    return s.bavail * s.bsize;
  } catch (e) { return null; }
}

/* Reddedilen yüklemede gövdenin geri kalanı okunmaz: cevap yazılır, bağlantı
   kısa süre sonra kapatılır (istemci cevabı görebilsin). */
function reddet(req, res, mesaj, kod) {
  if (res.headersSent || res.destroyed) return;
  res.setHeader('Connection', 'close');
  bad(res, mesaj, kod || 400);
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
  const kapali = teslimKapali(a);
  if (kapali) return reddet(req, res, kapali);

  const boyut = Number(req.headers['content-length']);
  if (!Number.isSafeInteger(boyut) || boyut <= 0) return reddet(req, res, 'Dosya boş ya da boyutu bildirilmedi', 411);
  if (boyut > DOSYA_SINIR) return reddet(req, res, 'Bir dosya en fazla 150 MB olabilir', 413);
  const ad = dosyaAdi(req.headers['x-dosya-adi']);
  if (!ad) return reddet(req, res, 'Dosya adı geçersiz');
  if (!UZANTILAR.has(uzanti(ad))) {
    return reddet(req, res, 'Bu dosya türü yüklenemez. PDF, Word, Excel, sunum, resim, ses, video ya da zip yükleyebilirsin.', 415);
  }

  const onceki = await depo.odevDosyalari.odevin(a.id, me.id);
  if (onceki.length >= OGRENCI_SINIR.adet) return reddet(req, res, 'Bir ödeve en fazla ' + OGRENCI_SINIR.adet + ' dosya yükleyebilirsin');
  if (onceki.reduce((t, d) => t + Number(d.boyut), 0) + boyut > OGRENCI_SINIR.toplam) {
    return reddet(req, res, 'Bir ödeve yüklediğin dosyaların toplamı en fazla 150 MB olabilir', 413);
  }
  const okulToplam = Number(await depo.odevDosyalari.okulToplami(a.schoolId));
  await fs.promises.mkdir(KLASOR, { recursive: true });
  const bos = await bosYer();

  /* Buradan ayırmaya kadar await yok: iki yükleme aynı boş yeri paylaşamaz. */
  if (okulToplam + (suren.okulBayt.get(a.schoolId) || 0) + boyut > OKUL_SINIR) {
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
    await fs.promises.rename(gecici, kalici);
    const durum = await depo.odevDosyalari.ekle({ id, odevId: a.id, ogrenciId: me.id, ad,
      boyut: sonuc.boyut, crc32: sonuc.crc32, sha256: sonuc.sha256 }, OGRENCI_SINIR);
    if (durum !== 'tamam') {
      await fs.promises.unlink(kalici).catch(() => {});
      return bad(res, { yok: 'Ödev bulunamadı', sayi: 'Bir ödeve en fazla ' + OGRENCI_SINIR.adet + ' dosya yükleyebilirsin',
        boyut: 'Bir ödeve yüklediğin dosyaların toplamı en fazla 150 MB olabilir' }[durum], durum === 'yok' ? 404 : 400);
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

