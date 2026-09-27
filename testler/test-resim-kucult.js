'use strict';
/* Tarayıcıda resim küçültme (public/js/parcalar/04f-resim-kucult.js) — başsız
   Edge'de (yoksa Chrome) gerçek tuvalle, sunucusuz:
   - kurallar: uzun kenar 2048 / kısa kenar 1024 sınırı, ad değişimi, aday seçimi;
   - fotoğraf / ekran görüntüsü / çizim / taranmış sayfa / saydam ayrımı (eşikler);
   - dosya başı: JPEG boyutu ve EXIF yönü (büyük ve küçük sonlu), PNG saydamlık
     olasılığı (renk türü, tRNS), hareketli PNG / WebP, WebP boyutu, HEIC imzası;
   - büyük JPEG: küçülür, yön uygulanır (tarayıcının kendisi ve elle: 3, 6, 8),
     EXIF / GPS / cihaz bilgisi gider, arayüz donmaz (en uzun takılma ölçülür);
   - 500 KB altı ve küçülmeyen dosyaya dokunulmaz; PNG fotoğraf JPEG (.jpg) olur;
     saydam PNG PNG kalır; ekran görüntüsü PNG kalır; hareketli PNG'ye dokunulmaz;
     WebP fotoğraf JPEG olur;
     açılamayan HEIC olduğu gibi gider; aynı anda tek resim işlenir;
   - arayüz: ekler, ödev teslimi ve okul sayfası "Küçültülüyor…" ve "8,4 MB → 620 KB"
     gösterir, küçülmüş dosyayı yeni adıyla gönderir, yer denetimini küçülmüş
     boyutla yapar, kaldırılan / iptal edilen dosyayı göndermez.
   Tarayıcı --remote-debugging-pipe ile sürülür (TCP portu açılmaz); test
   verisi sayfada üretilir (en büyüğü ~3,5 MB). Edge ya da Chrome yoksa atlanır.
   Kullanım: node testler/test-resim-kucult.js */

const fs = require('fs');
const path = require('path');
const os = require('os');
const zlib = require('zlib');
const { spawn } = require('child_process');

const KOK = path.join(__dirname, '..');
const PARCA = path.join(KOK, 'public', 'js', 'parcalar');
/* Sayfaya yüklenen parçalar (gerçek pakette hepsi tek IIFE; burada ayrı ayrı genel alanda). */
const PARCALAR = ['00-durum.js', '01-yardimcilar.js', '02-ikonlar.js', '03-mesaj-modal.js', '04d-ekler.js',
  '04f-resim-kucult.js', '14b-odev-teslim.js', '19g-okul-sayfasi.js'];
const TARAYICILAR = [process.env.EE_TARAYICI,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/microsoft-edge', '/usr/bin/google-chrome',
  '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter(Boolean);

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay !== undefined ? '  -> ' + (typeof detay === 'string' ? detay : JSON.stringify(detay)) : '')); }
}

/* ---------------- tarayıcı (CDP, boru üzerinden) ---------------- */
async function tarayiciAc(exe) {
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'ee-kucult-'));
  const p = spawn(exe, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--remote-debugging-pipe', '--user-data-dir=' + profil, 'about:blank'],
  { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'], windowsHide: true });
  const yaz = p.stdio[3], oku = p.stdio[4];
  let sira = 0, tampon = '';
  const bekleyen = new Map();
  oku.on('data', c => {
    tampon += c.toString('utf8');
    let i;
    while ((i = tampon.indexOf('\0')) >= 0) {
      const m = JSON.parse(tampon.slice(0, i));
      tampon = tampon.slice(i + 1);
      if (m.id && bekleyen.has(m.id)) { bekleyen.get(m.id)(m); bekleyen.delete(m.id); }
    }
  });
  p.on('error', () => { for (const f of bekleyen.values()) f({ error: { message: 'tarayıcı açılamadı' } }); });
  const gonder = (method, params, sessionId) => new Promise(r => {
    const m = { id: ++sira, method, params: params || {} };
    if (sessionId) m.sessionId = sessionId;
    bekleyen.set(m.id, r);
    yaz.write(JSON.stringify(m) + '\0');
  });
  const kapat = async () => {
    try { await Promise.race([gonder('Browser.close'), new Promise(r => setTimeout(r, 3000))]); } catch (e) { /* kapanmış */ }
    try { p.kill(); } catch (e) { /* kapanmış */ }
    await new Promise(r => setTimeout(r, 800));
    try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) { /* kilitli kalabilir, önemsiz */ }
  };
  const hedefler = await gonder('Target.getTargets');
  if (hedefler.error) { await kapat(); throw new Error(hedefler.error.message); }
  const sayfa = hedefler.result.targetInfos.find(x => x.type === 'page');
  const bag = await gonder('Target.attachToTarget', { targetId: sayfa.targetId, flatten: true });
  const oturum = bag.result.sessionId;
  const calistir = async (ifade) => {
    const r = await gonder('Runtime.evaluate', { expression: ifade, awaitPromise: true, returnByValue: true }, oturum);
    if (r.error) throw new Error(JSON.stringify(r.error));
    if (r.result.exceptionDetails) {
      const e = r.result.exceptionDetails;
      throw new Error((e.exception && e.exception.description) || e.text);
    }
    return r.result.result.value;
  };
  return { calistir, kapat };
}

/* ---------------- elle yapılmış PNG'ler (dosya başı denemesi) ---------------- */
function pngYap(renkTuru, trns, metin, actl) {
  const en = 64, boy = 48, kanal = renkTuru === 2 ? 3 : renkTuru === 6 ? 4 : 1;
  const ham = Buffer.alloc((1 + en * kanal) * boy);
  const parca = (tur, veri) => {
    const b = Buffer.alloc(12 + veri.length);
    b.writeUInt32BE(veri.length, 0);
    b.write(tur, 4, 'ascii');
    veri.copy(b, 8);
    b.writeUInt32BE(zlib.crc32(Buffer.concat([Buffer.from(tur, 'ascii'), veri])) >>> 0, 8 + veri.length);
    return b;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(en, 0);
  ihdr.writeUInt32BE(boy, 4);
  ihdr[8] = 8;
  ihdr[9] = renkTuru;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), parca('IHDR', ihdr),
    actl ? parca('acTL', Buffer.from([0, 0, 0, 2, 0, 0, 0, 0])) : Buffer.alloc(0),
    metin ? parca('tEXt', Buffer.from('Comment\0' + 'x'.repeat(300), 'latin1')) : Buffer.alloc(0),
    trns ? parca('tRNS', Buffer.from([0, 0, 0, 0, 0, 0])) : Buffer.alloc(0),
    parca('IDAT', zlib.deflateSync(ham)), parca('IEND', Buffer.alloc(0))]).toString('base64');
}

/* ================= sayfada çalışan kısımlar (toString ile gönderilir) ================= */

/* Örnek resim üreticileri ve yardımcılar: window.T */
function sayfaHazirla(pngler) {
  let rs = 12345;
  const rnd = () => { rs = (rs * 16807) % 2147483647; return rs / 2147483647; };
  const tuval = (en, boy, ciz) => {
    const t = document.createElement('canvas');
    t.width = en; t.height = boy;
    ciz(t.getContext('2d'), en, boy);
    return t;
  };
  const kodla = (t, tur, q) => new Promise(ok => t.toBlob(ok, tur, q));
  const bayt = async b => new Uint8Array(await b.arrayBuffer());
  const b64 = s => { const i = atob(s), a = new Uint8Array(i.length); for (let k = 0; k < i.length; k++) a[k] = i.charCodeAt(k); return new Blob([a], { type: 'image/png' }); };
  /* Fotoğraf gibi: eğim, yarı saydam daireler, sensör gürültüsü; sol üstte kırmızı işaret (yön denemesi). */
  const foto = (en, boy, gurultu) => tuval(en, boy, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#3a6ea5'); g.addColorStop(0.5, '#e8c07d'); g.addColorStop(1, '#2d5016');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) {
      c.fillStyle = 'hsla(' + (rnd() * 360 | 0) + ',60%,50%,0.35)';
      c.beginPath(); c.arc(rnd() * w, rnd() * h, 50 + rnd() * w / 5, 0, 7); c.fill();
    }
    const d = c.getImageData(0, 0, w, h), v = d.data;
    for (let k = 0; k < v.length; k += 4) { const n = (rnd() - 0.5) * gurultu; v[k] += n; v[k + 1] += n * 0.8; v[k + 2] += n * 1.1; }
    c.putImageData(d, 0, 0);
    c.fillStyle = '#ff0000'; c.fillRect(0, 0, w / 8, h / 8);
  });
  /* Ekran görüntüsü gibi: düz zemin, başlık çubuğu, düğmeler, yazı. */
  const ekran = (en, boy) => tuval(en, boy, (c, w, h) => {
    c.fillStyle = '#f7f7f9'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#1f6feb'; c.fillRect(0, 0, w, 90);
    c.fillStyle = '#fff'; c.font = '36px sans-serif'; c.fillText('Eğitim Evi — Ödevler', 30, 58);
    for (let y = 140, i = 0; y < h - 40; y += 34, i++) {
      if (i % 9 === 0) { c.fillStyle = '#e7f0ff'; c.fillRect(30, y - 26, 260, 32); }
      c.fillStyle = i % 5 ? '#24292f' : '#cf222e';
      c.font = (i % 7 ? 22 : 30) + 'px sans-serif';
      c.fillText('Satır ' + i + ': öğrencinin ödev açıklaması, son teslim ' + (i % 28 + 1) + ' Ekim, puan ' + (i * 7 % 100) +
        ' — ' + 'lorem ipsum dolor sit amet '.repeat(3), 40 + (i % 3) * 20, y);
    }
  });
  const cizim = (en, boy) => tuval(en, boy, (c, w, h) => {
    c.fillStyle = '#fff'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 30; i++) {
      c.fillStyle = ['#e63946', '#457b9d', '#2a9d8f', '#f4a261'][i % 4];
      c.beginPath(); c.arc(rnd() * w, rnd() * h, 20 + rnd() * 80, 0, 7); c.fill();
      c.strokeStyle = '#222'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(rnd() * w, rnd() * h); c.lineTo(rnd() * w, rnd() * h); c.stroke();
      c.fillStyle = '#111'; c.font = '28px sans-serif'; c.fillText('Kutu ' + i, rnd() * w, rnd() * h);
    }
  });
  /* Siyah-beyaz taranmış sayfa: az renk (gri tonları) ama her nokta komşusundan farklı. */
  const griTarama = (en, boy) => tuval(en, boy, (c, w, h) => {
    const d = c.createImageData(w, h), v = d.data;
    for (let i = 0; i < v.length; i += 4) { v[i] = v[i + 1] = v[i + 2] = 235 + Math.floor(rnd() * 20); v[i + 3] = 255; }
    c.putImageData(d, 0, 0);
    c.fillStyle = '#222'; c.font = '30px serif';
    for (let y = 80; y < h - 40; y += 50) c.fillText('Taranmış sayfa satırı ' + y + ' — öğrencinin yazısı.', 60, y);
  });
  /* Saydam zeminde logo: renkli halka, içinde hafif gürültü. */
  const saydam = (en, boy) => tuval(en, boy, (c, w, h) => {
    const g = c.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.min(w, h) / 2);
    g.addColorStop(0, '#ffcc00'); g.addColorStop(0.7, '#c81e1e'); g.addColorStop(1, 'rgba(200,30,30,0)');
    c.fillStyle = g;
    c.beginPath(); c.ellipse(w / 2, h / 2, w / 2 - 10, h / 2 - 10, 0, 0, 7); c.fill();
    const d = c.getImageData(0, 0, w, h), v = d.data;
    for (let k = 0; k < v.length; k += 4) if (v[k + 3] && rnd() < 0.5) { const n = (rnd() - 0.5) * 12; v[k] += n; v[k + 1] += n; }
    c.putImageData(d, 0, 0);
  });
  /* Fotoğraflı telefon ekran görüntüsü (gönderi): başlık, ekranın dörtte biri fotoğraf, altında yazı. */
  const karisik = (en, boy) => tuval(en, boy, (c, w, h) => {
    c.fillStyle = '#fff'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#f2f2f2'; c.fillRect(0, 0, w, 150);
    c.fillStyle = '#111'; c.font = 'bold 42px sans-serif'; c.fillText('okul_hesabi', 40, 95);
    c.drawImage(foto(w, Math.round(h / 4), 24), 0, 190);
    c.font = '40px sans-serif';
    for (let y = 190 + Math.round(h / 4) + 80, i = 0; y < h - 60; y += 66, i++) {
      c.fillStyle = i % 6 ? '#222' : '#0b5ed7';
      c.fillText('Bilim fuarımızdan kareler, tebrikler 7-A'.slice(0, 22 + (i * 7) % 18), 40, y);
    }
  });
  /* Eğimli zeminli slayt: az renk, yan yana noktalar farklı. */
  const egim = (en, boy) => tuval(en, boy, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#1e3c72'); g.addColorStop(0.5, '#2a5298'); g.addColorStop(1, '#6dd5ed');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#fff'; c.font = '64px sans-serif'; c.fillText('Fen Bilimleri Sunumu', w / 5, h / 2);
  });
  /* APP1 EXIF: üretici "TestTelefon", yön, GPS enlemi (41 derece). */
  const exifYap = (yon, kucukSonlu) => {
    const t = new Uint8Array(116), le = !!kucukSonlu;
    const u16 = (o, v) => { if (le) { t[o] = v & 255; t[o + 1] = v >> 8; } else { t[o] = v >> 8; t[o + 1] = v & 255; } };
    const u32 = (o, v) => { if (le) { t[o] = v & 255; t[o + 1] = (v >> 8) & 255; t[o + 2] = (v >> 16) & 255; t[o + 3] = v >>> 24; } else { t[o] = v >>> 24; t[o + 1] = (v >> 16) & 255; t[o + 2] = (v >> 8) & 255; t[o + 3] = v & 255; } };
    const giris = (o, etiket, tur, sayi, deger) => { u16(o, etiket); u16(o + 2, tur); u32(o + 4, sayi); if (tur === 3) u16(o + 8, deger); else u32(o + 8, deger); };
    t[0] = t[1] = le ? 0x49 : 0x4D; u16(2, 42); u32(4, 8);
    u16(8, 3);
    giris(10, 0x010F, 2, 12, 50);            // üretici -> "TestTelefon"
    giris(22, 0x0112, 3, 1, yon);            // yön
    giris(34, 0x8825, 4, 1, 62);             // GPS IFD
    u32(46, 0);
    'TestTelefon'.split('').forEach((ch, i) => { t[50 + i] = ch.charCodeAt(0); });
    u16(62, 2);
    giris(64, 0x0001, 2, 2, 0); t[72] = 0x4E; // enlem yönü "N"
    giris(76, 0x0002, 5, 3, 92);              // enlem 41/1 0/1 0/1
    u32(88, 0);
    for (let k = 0; k < 3; k++) { u32(92 + k * 8, [41, 0, 0][k]); u32(96 + k * 8, 1); }
    const app1 = new Uint8Array(10 + t.length);
    app1[0] = 0xFF; app1[1] = 0xE1; app1[2] = (app1.length - 2) >> 8; app1[3] = (app1.length - 2) & 255;
    [0x45, 0x78, 0x69, 0x66, 0, 0].forEach((v, i) => { app1[4 + i] = v; });
    app1.set(t, 10);
    return app1;
  };
  const exifEkle = async (blob, app1) => {
    const b = await bayt(blob), y = new Uint8Array(b.length + app1.length);
    y.set(b.subarray(0, 2)); y.set(app1, 2); y.set(b.subarray(2), 2 + app1.length);
    return new Blob([y], { type: 'image/jpeg' });
  };
  const coz = async blob => { const b = await createImageBitmap(blob); const t = tuval(b.width, b.height, c => c.drawImage(b, 0, 0)); b.close(); return t; };
  const nokta = (t, x, y) => Array.from(t.getContext('2d').getImageData(x, y, 1, 1).data);
  const kirmizi = p => p[0] > 180 && p[1] < 90 && p[2] < 90;
  const icerir = (u8, s) => {
    dis: for (let i = 0; i + s.length <= u8.length; i++) {
      for (let k = 0; k < s.length; k++) if (u8[i + k] !== s.charCodeAt(k)) continue dis;
      return true;
    }
    return false;
  };
  const bekleKi = (kosul, ms) => new Promise((ok, red) => {
    const t0 = Date.now();
    (function dene() {
      if (kosul()) return ok();
      if (Date.now() - t0 > (ms || 20000)) return red(new Error('zaman aşımı'));
      setTimeout(dene, 20);
    })();
  });
  /* Kuyruktaki işler bitsin: sıraya aday olmayan bir dosya koyup beklenir. */
  const sirayiBekle = async () => { await resimKucult(new File([new Uint8Array(10)], 'bos.txt')); await new Promise(ok => setTimeout(ok, 50)); };
  const png = {};
  for (const ad in pngler) png[ad] = b64(pngler[ad]);
  window.T = { rnd, tuval, kodla, bayt, foto, ekran, cizim, griTarama, saydam, karisik, egim, exifYap, exifEkle, coz, nokta,
    kirmizi, icerir, bekleKi, sirayiBekle, png, SAKLA: {} };
  return 1;
}

/* Kurallar, sınıflandırma, dosya başı. */
async function grupBirim() {
  const r = {};
  const o = (en, boy) => { const s = kucultOlcek(en, boy); return Math.round(en * s) + 'x' + Math.round(boy * s); };
  r.olcek = { telefon: o(4032, 3024), dikey: o(3024, 4032), ekran: o(1170, 2532), kaydirma: o(1080, 8000), kucuk: o(800, 600), panorama: o(20000, 1000) };
  r.ad = [kucultAd('odev.PNG', 'jpeg'), kucultAd('IMG_1.HEIC', 'jpeg'), kucultAd('foto.jpeg', 'jpeg'), kucultAd('resim', 'jpeg'), kucultAd('a.b.png', 'png'), kucultAd('x.webp', 'jpeg')];
  const f = (boyut, ad, tur) => new File([new Uint8Array(boyut)], ad, { type: tur || '' });
  r.aday = [resimKucultulebilir(f(400 * 1024, 'a.jpg', 'image/jpeg')), resimKucultulebilir(f(600 * 1024, 'a.pdf', 'application/pdf')),
    resimKucultulebilir(f(600 * 1024, 'a.heic')), resimKucultulebilir(f(600 * 1024, 'x', 'image/png')), resimKucultulebilir(f(600 * 1024, 'a.JPG'))];
  r.esikler = { altSinir: KUCULT.altSinir, uzunKenar: KUCULT.uzunKenar, kisaKenar: KUCULT.kisaKenar, kalite: KUCULT.kalite, kazanc: KUCULT.kazanc,
    fotoRenk: KUCULT.fotoRenk, fotoEsit: KUCULT.fotoEsit, gurultuEsit: KUCULT.gurultuEsit };

  const olc = t => kucultOlc(t, t.width, t.height, true);
  const sinif = t => { const m = olc(t); return { foto: kucultFotoMu(m), saydam: m.saydam, renk: +m.renk.toFixed(4), esit: +m.esit.toFixed(4) }; };
  r.sinif = { foto: sinif(T.foto(800, 600, 24)), fotoAzGurultu: sinif(T.foto(1200, 900, 4)), ekran: sinif(T.ekran(1400, 1000)), cizim: sinif(T.cizim(1200, 900)),
    griTarama: sinif(T.griTarama(800, 1100)), saydam: sinif(T.saydam(600, 600)), karisik: sinif(T.karisik(1170, 2532)), egim: sinif(T.egim(1920, 1080)) };
  const fotoO = olc(T.foto(800, 600, 24)), ekranO = olc(T.ekran(1400, 1000)), saydamO = olc(T.saydam(600, 600));
  r.hedef = { jpeg: kucultHedef('jpeg', null), pngFoto: kucultHedef('png', fotoO), pngEkran: kucultHedef('png', ekranO), pngSaydam: kucultHedef('png', saydamO),
    webpFoto: kucultHedef('webp', fotoO), webpEkran: kucultHedef('webp', ekranO), webpSaydam: kucultHedef('webp', saydamO),
    heicFoto: kucultHedef('heic', fotoO), heicSaydam: kucultHedef('heic', saydamO) };

  const kucukJpeg = await T.kodla(T.foto(640, 480, 10), 'image/jpeg', 0.9);
  r.baslik = { jpegYon6: await kucultBaslik(await T.exifEkle(kucukJpeg, T.exifYap(6, false))),
    jpegYon3LE: await kucultBaslik(await T.exifEkle(kucukJpeg, T.exifYap(3, true))), jpegExifsiz: await kucultBaslik(kucukJpeg),
    pngRgb: await kucultBaslik(T.png.rgb), pngRgbMetinli: await kucultBaslik(T.png.rgbMetin), pngRgbTrns: await kucultBaslik(T.png.rgbTrns),
    pngRgba: await kucultBaslik(T.png.rgba), pngGri: await kucultBaslik(T.png.gri), pngHareketli: await kucultBaslik(T.png.apng) };
  /* Hareketli WebP başı: VP8X, bayraklar alfa + hareket, 100x50. */
  const aw = new Uint8Array(30);
  'RIFF'.split('').forEach((ch, i) => { aw[i] = ch.charCodeAt(0); });
  'WEBPVP8X'.split('').forEach((ch, i) => { aw[8 + i] = ch.charCodeAt(0); });
  aw[16] = 10; aw[20] = 0x12; aw[24] = 99; aw[27] = 49;
  r.webpHareketli = await kucultBaslik(new Blob([aw]));
  const parcaAdi = async b => String.fromCharCode.apply(null, Array.from((await T.bayt(b)).slice(12, 16)));
  const webpOpak = await T.kodla(T.foto(300, 200, 10), 'image/webp', 0.8);
  const webpSaydam = await T.kodla(T.saydam(320, 240), 'image/webp', 0.8);
  const webpKayipsiz = await T.kodla(T.cizim(330, 210), 'image/webp', 1);
  r.webp = { tur: webpOpak.type, opak: await kucultBaslik(webpOpak), opakParca: await parcaAdi(webpOpak), saydam: await kucultBaslik(webpSaydam),
    saydamParca: await parcaAdi(webpSaydam), kayipsiz: await kucultBaslik(webpKayipsiz), kayipsizParca: await parcaAdi(webpKayipsiz) };
  r.heic = await kucultBaslik(new Blob([new Uint8Array([0, 0, 0, 24, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63, 0, 0, 0, 0, 0x6D, 0x69, 0x66, 0x31])]));
  r.yonUygulaniyor = await kucultYonUygulaniyor('bit');
  return r;
}

/* Bütün yol: resimKucult. */
async function grupAkis() {
  const r = {};
  const ham = await T.kodla(T.foto(3000, 2250, 24), 'image/jpeg', 0.92);
  const dosya = new File([await T.exifEkle(ham, T.exifYap(6, false))], 'IMG_0001.jpg', { type: 'image/jpeg' });
  const girdi = await T.bayt(dosya);
  r.girdi = { boyut: dosya.size, make: T.icerir(girdi, 'TestTelefon'), exif: T.icerir(girdi, 'Exif') };
  /* Arayüz donmasın: 4 ms'de bir tıklayan sayaç, iki tık arasındaki en uzun süre. */
  let son = performance.now(), bosluk = 0;
  const t0 = son;
  const tik = setInterval(() => { const n = performance.now(); bosluk = Math.max(bosluk, n - son); son = n; }, 4);
  const k = await resimKucult(dosya);
  clearInterval(tik);
  r.sure = Math.round(performance.now() - t0);
  r.bosluk = Math.round(Math.max(bosluk, performance.now() - son));
  const c = await T.coz(k.dosya), b = await T.bayt(k.dosya);
  r.foto = { kuculdu: k.kuculdu, tur: k.tur, ad: k.ad, once: k.once, sonra: k.sonra, cevrildi: k.cevrildi, en: c.width, boy: c.height,
    sagUst: T.kirmizi(T.nokta(c, c.width - 20, 20)), solUst: T.kirmizi(T.nokta(c, 20, 20)),
    exif: T.icerir(b, 'Exif'), make: T.icerir(b, 'TestTelefon'), jpeg: b[0] === 0xFF && b[1] === 0xD8, yazi: kucultmeYazisi(k) };

  /* Elle döndürme: tarayıcı yönü uygulamıyormuş gibi (EXIF'siz ham noktalar çözülür). */
  const asilCoz = kucultCoz, eskiYon = KUCULT_YON;
  kucultCoz = () => kucultBitmapCoz(ham);
  KUCULT_YON = { bit: false, img: false };
  r.elle = {};
  try {
    for (const yon of [3, 6, 8]) {
      const d = new File([await T.exifEkle(ham, T.exifYap(yon, yon === 8))], 'y' + yon + '.jpg', { type: 'image/jpeg' });
      const kk = await resimKucult(d), cc = await T.coz(kk.dosya);
      const kose = (x, y) => T.kirmizi(T.nokta(cc, x, y));
      r.elle[yon] = { kuculdu: kk.kuculdu, en: cc.width, boy: cc.height, solUst: kose(20, 20), sagUst: kose(cc.width - 20, 20),
        solAlt: kose(20, cc.height - 20), sagAlt: kose(cc.width - 20, cc.height - 20) };
    }
  } finally { kucultCoz = asilCoz; KUCULT_YON = eskiYon; }

  const kucuk = new File([await T.kodla(T.foto(900, 675, 10), 'image/jpeg', 0.85)], 'kucuk.jpg', { type: 'image/jpeg' });
  const kk = await resimKucult(kucuk);
  r.kucuk = { boyut: kucuk.size, ayni: kk.dosya === kucuk, kuculdu: kk.kuculdu, sebep: kk.sebep, yazi: kucultmeYazisi(kk) };

  const km = new File([await T.kodla(T.foto(1600, 1200, 60), 'image/jpeg', 0.8)], 'kuculmeyen.jpg', { type: 'image/jpeg' });
  const kmk = await resimKucult(km);
  r.kuculmeyen = { boyut: km.size, ayni: kmk.dosya === km, kuculdu: kmk.kuculdu, sebep: kmk.sebep, ad: kmk.ad };

  const pf = new File([await T.kodla(T.foto(1600, 1200, 16), 'image/png')], 'odev.png', { type: 'image/png' });
  T.SAKLA.pngFoto = pf;
  const pfk = await resimKucult(pf), pfb = await T.bayt(pfk.dosya);
  r.pngFoto = { boyut: pf.size, kuculdu: pfk.kuculdu, tur: pfk.tur, ad: pfk.ad, cevrildi: pfk.cevrildi, sonra: pfk.sonra, jpeg: pfb[0] === 0xFF && pfb[1] === 0xD8 };

  /* Aynı PNG'ye IHDR'den sonra acTL (hareket) parçası: hareketli PNG'ye dokunulmaz. */
  const pb = await T.bayt(pf), actl = new Uint8Array([0, 0, 0, 8, 0x61, 0x63, 0x54, 0x4C, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0]);
  const ap = new Uint8Array(pb.length + actl.length);
  ap.set(pb.subarray(0, 33)); ap.set(actl, 33); ap.set(pb.subarray(33), 33 + actl.length);
  const apf = new File([ap], 'hareketli.png', { type: 'image/png' });
  const apk = await resimKucult(apf);
  r.apng = { boyut: apf.size, ayni: apk.dosya === apf, kuculdu: apk.kuculdu, sebep: apk.sebep };

  const sp = new File([await T.kodla(T.saydam(3200, 1600), 'image/png')], 'logo.png', { type: 'image/png' });
  const spk = await resimKucult(sp), spc = await T.coz(spk.dosya);
  r.saydam = { boyut: sp.size, kuculdu: spk.kuculdu, tur: spk.tur, ad: spk.ad, sebep: spk.sebep, sonra: spk.sonra, en: spc.width, boy: spc.height,
    koseAlfa: T.nokta(spc, 3, 3)[3], ortaAlfa: T.nokta(spc, spc.width >> 1, spc.height >> 1)[3] };

  const ep = new File([await T.kodla(T.ekran(2800, 2000), 'image/png')], 'ekran.png', { type: 'image/png' });
  const epk = await resimKucult(ep);
  r.ekran = { boyut: ep.size, kuculdu: epk.kuculdu, tur: epk.tur, ad: epk.ad, sebep: epk.sebep, sonra: epk.sonra };
  if (epk.kuculdu) { const epc = await T.coz(epk.dosya); r.ekran.en = epc.width; r.ekran.boy = epc.height; }

  const wf = new File([await T.kodla(T.foto(2400, 1800, 24), 'image/webp', 0.95)], 'foto.webp', { type: 'image/webp' });
  const wfk = await resimKucult(wf);
  r.webp = { boyut: wf.size, kuculdu: wfk.kuculdu, tur: wfk.tur, ad: wfk.ad, cevrildi: wfk.cevrildi, sebep: wfk.sebep };

  const hb = new Uint8Array(600 * 1024);
  hb.set([0, 0, 0, 24, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63], 0);
  const hf = new File([hb], 'IMG_2.HEIC', { type: 'image/heic' });
  const hk = await resimKucult(hf);
  r.heic = { ayni: hk.dosya === hf, kuculdu: hk.kuculdu, sebep: hk.sebep };

  /* Aynı anda tek resim: üç dosya birlikte verilir, aynı anda açık çözülmüş resim sayılır. */
  const asil2 = kucultCoz;
  let aktif = 0, enCok = 0;
  kucultCoz = b => {
    aktif++; enCok = Math.max(enCok, aktif);
    return asil2(b).then(cz => { const kap = cz.kapat; cz.kapat = () => { aktif--; kap(); }; return cz; }, e => { aktif--; throw e; });
  };
  try {
    const l = await Promise.all([resimKucult(pf), resimKucult(dosya), resimKucult(pf)]);
    r.sira = { enCok, hepsi: l.every(x => x.kuculdu), acikKalan: aktif };
  } finally { kucultCoz = asil2; }
  return r;
}

/* Arayüz: ekler, ödev teslimi, okul sayfası (sunucu yerine sahte istek). */
async function grupArayuz() {
  const r = {};
  const GIDEN = [];
  function SahteXHR() { this.basliklar = {}; this.upload = {}; }
  SahteXHR.prototype.open = function (m, u) { this.url = u; };
  SahteXHR.prototype.setRequestHeader = function (k, v) { this.basliklar[k] = v; };
  SahteXHR.prototype.send = function (g) { this.govde = g; GIDEN.push(this); };
  SahteXHR.prototype.abort = function () { if (this.onabort) this.onabort(); };
  const asilXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = SahteXHR;
  S.token = 'deneme';
  const pf = T.SAKLA.pngFoto;   // 1600x1200 fotoğraf gibi PNG, 3 MB'tan büyük
  try {
    /* ---- ekler ---- */
    document.body.innerHTML = ekAlani('t', 'mesaj');
    ekAlaniKur('t');
    ekDosyalariEkle('t', [pf]);
    const satirMetni = () => document.querySelector('#ekListe-t .ek-satir small').textContent;
    r.ek = { ipucu: document.querySelector('.ek-birak small').textContent, ilk: satirMetni(), yukleniyor: ekYukleniyor('t'), gidenIlk: GIDEN.length };
    await T.bekleKi(() => GIDEN.length === 1);
    const x = GIDEN[0];
    Object.assign(r.ek, { ad: decodeURIComponent(x.basliklar['X-Dosya-Adi']), govdeBoyut: x.govde.size, govdeTur: x.govde.type, url: x.url,
      yuklenirken: satirMetni(), satirAd: document.querySelector('#ekListe-t .ek-satir b').textContent });
    x.status = 200; x.responseText = '{"ek":{"id":"e1"}}'; x.onload();
    Object.assign(r.ek, { sonra: satirMetni(), idler: ekIdleri('t'), yukleniyorSonra: ekYukleniyor('t') });
    ekDosyalariEkle('t', [pf]);
    const el = document.createElement('button');
    el.setAttribute('data-alan', 't');
    EYLEMLER['ek-kaldir'](el, '1');
    await T.sirayiBekle();
    Object.assign(r.ek, { kaldirGiden: GIDEN.length, kaldirSatir: document.querySelectorAll('#ekListe-t .ek-satir').length });
    ekDosyalariEkle('t', [new File([new Uint8Array(2048)], 'not.pdf', { type: 'application/pdf' })]);
    r.ek.pdfHemen = GIDEN.length === 2 && decodeURIComponent(GIDEN[1].basliklar['X-Dosya-Adi']) === 'not.pdf' && GIDEN[1].govde.size === 2048;

    /* ---- ödev teslimi ---- */
    document.body.innerHTML = '<div id="teslimKap"><div id="teslimYuklemeler"></div></div>';
    let cizildi = 0;
    const asilCiz = teslimCiz;
    teslimCiz = () => { cizildi++; return Promise.resolve(); };
    try {
      teslimDurum.odevId = 'o1';
      teslimDurum.hatalar = [];
      teslimDurum.veri = { yukleyebilir: true, dosyalar: [], sinir: { adet: 10, toplam: 1024 * 1024, dosya: 50 * 1048576, uzantilar: ['jpg', 'jpeg', 'png', 'pdf'] } };
      const g0 = GIDEN.length;
      teslimKuyruk([pf]);    // 3 MB'tan büyük: 1 MB'lık alana ancak küçülünce sığar
      const satir = document.querySelector('#teslimYuklemeler .yukleme-satir');
      r.teslim = { ilk: satir.querySelector('.yuzde').textContent, yukleniyor: teslimDurum.yukleniyor, onHata: teslimDurum.hatalar.length };
      await T.bekleKi(() => GIDEN.length === g0 + 1);
      const tx = GIDEN[g0];
      Object.assign(r.teslim, { ad: decodeURIComponent(tx.basliklar['X-Dosya-Adi']), govdeBoyut: tx.govde.size, url: tx.url,
        satirAd: satir.querySelector('b').textContent, not: satir.querySelector('.kucultme').textContent, yuzde: satir.querySelector('.yuzde').textContent });
      tx.status = 200; tx.responseText = '{}'; tx.onload();
      Object.assign(r.teslim, { cizildi, notlar: teslimDurum.hatalar.join(''), yukleniyorSonra: teslimDurum.yukleniyor });

      teslimDurum.hatalar = [];
      teslimDurum.veri.sinir.toplam = 100 * 1024;     // küçülünce de sığmaz
      teslimKuyruk([pf]);
      await T.sirayiBekle();
      Object.assign(r.teslim, { sigmayanGiden: GIDEN.length - g0 - 1, sigmayanHata: teslimDurum.hatalar.join('') });

      teslimDurum.hatalar = [];
      teslimDurum.veri.sinir.toplam = 50 * 1048576;
      $('teslimYuklemeler').innerHTML = '';
      teslimKuyruk([pf]);
      const s2 = document.querySelector('#teslimYuklemeler .yukleme-satir');
      EYLEMLER['teslim-iptal'](null, s2.id);
      await T.sirayiBekle();
      Object.assign(r.teslim, { iptalGiden: GIDEN.length - g0 - 1, iptalMetin: s2.querySelector('.yuzde').textContent, iptalSayac: teslimDurum.yukleniyor });
    } finally { teslimCiz = asilCiz; }

    /* ---- okul sayfası fotoğrafı ---- */
    document.body.innerHTML = '<div id="osFotoMesaj"></div>';
    const asilFetch = window.fetch, asilFC = osFotolariCiz, asilOC = osOnizlemeCiz;
    const istekler = [];
    window.fetch = (url, o) => {
      istekler.push({ url, tur: o.headers['Content-Type'], boyut: o.body.size, govdeTur: o.body.type });
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ foto: { id: 'f1', yer: 'galeri', aciklama: '' } }) });
    };
    osFotolariCiz = () => {};
    osOnizlemeCiz = () => {};
    try {
      OS.veri = { fotolar: [] };
      OS.yuklenecekYer = 'galeri';
      osDosyaSecildi.call({ files: [pf] });
      r.okul = { boyut: pf.size, ilk: $('osFotoMesaj').textContent };
      await T.bekleKi(() => OS.veri.fotolar.length === 1);
      Object.assign(r.okul, { istek: istekler[0], son: $('osFotoMesaj').textContent });
    } finally { window.fetch = asilFetch; osFotolariCiz = asilFC; osOnizlemeCiz = asilOC; }
  } finally { window.XMLHttpRequest = asilXHR; }
  return r;
}

/* ================= koşu ================= */
(async () => {
  const exe = TARAYICILAR.find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });
  if (!exe) {
    console.log('  ATLANDI  Edge ya da Chrome bulunamadı (EE_TARAYICI ile yol verilebilir)');
    console.log('\n  GECTI: 0   KALDI: 0');
    return;
  }
  const zaman = setTimeout(() => { console.log('  KALDI  test 180 saniyede bitmedi'); console.log('\n  GECTI: ' + gecti + '   KALDI: ' + (kaldi + 1)); process.exit(1); }, 180000);
  const t = await tarayiciAc(exe);
  let birim, akis, arayuz;
  try {
    await t.calistir('var SAYFALAR = {}; 1');   // 08-ana-sayfa.js'te tanımlanır; 19g ona yazar
    for (const p of PARCALAR) await t.calistir(fs.readFileSync(path.join(PARCA, p), 'utf8') + '\n;1');
    await t.calistir('(' + sayfaHazirla.toString() + ')(' + JSON.stringify({ rgb: pngYap(2, false), rgbMetin: pngYap(2, false, true),
      rgbTrns: pngYap(2, true, true), rgba: pngYap(6, false), gri: pngYap(0, false), apng: pngYap(6, false, false, true) }) + ')');
    birim = await t.calistir('(' + grupBirim.toString() + ')()');
    akis = await t.calistir('(' + grupAkis.toString() + ')()');
    arayuz = await t.calistir('(' + grupArayuz.toString() + ')()');
  } catch (e) {
    kontrol('sayfadaki test çalıştı', false, e.message);
  } finally {
    await t.kapat();
    clearTimeout(zaman);
  }
  const MB = 1048576;
  if (birim) {
    console.log('=== 1) KURALLAR VE SINIFLANDIRMA ===');
    const o = birim.olcek;
    kontrol('4032x3024 -> 2048x1536 (uzun kenar 2048)', o.telefon === '2048x1536', o.telefon);
    kontrol('3024x4032 -> 1536x2048', o.dikey === '1536x2048', o.dikey);
    kontrol('telefon ekran görüntüsü 1170x2532: kısa kenar 1024 altına inmez', o.ekran === '1024x2216', o.ekran);
    kontrol('kaydırmalı ekran görüntüsü 1080x8000: kısa kenar 1024', o.kaydirma === '1024x7585', o.kaydirma);
    kontrol('800x600 büyütülmez', o.kucuk === '800x600', o.kucuk);
    kontrol('çok uzun panorama tuval sınırına (16 MP) iner', o.panorama === '17889x894', o.panorama);
    kontrol('ad: odev.PNG -> odev.jpg, IMG_1.HEIC -> IMG_1.jpg, foto.jpeg aynı, uzantısız -> .jpg, a.b.png aynı, x.webp -> x.jpg',
      JSON.stringify(birim.ad) === JSON.stringify(['odev.jpg', 'IMG_1.jpg', 'foto.jpeg', 'resim.jpg', 'a.b.png', 'x.jpg']), birim.ad);
    kontrol('aday: 400 KB jpg hayır, pdf hayır, 600 KB heic evet, türü image/png evet, .JPG evet',
      JSON.stringify(birim.aday) === JSON.stringify([false, false, true, true, true]), birim.aday);
    const e = birim.esikler;
    kontrol('eşikler: 500 KB, 2048 / 1024 px, JPEG 0,82, en az %20 kazanç',
      e.altSinir === 500 * 1024 && e.uzunKenar === 2048 && e.kisaKenar === 1024 && e.kalite === 0.82 && e.kazanc === 0.8, e);
    const s = birim.sinif;
    console.log('    ölçüler (renk oranı / yan yana eşit): ' + Object.keys(s).map(k => k + ' ' + s[k].renk + '/' + s[k].esit).join(', '));
    kontrol('fotoğraf fotoğraf sayılır', s.foto.foto && !s.foto.saydam, s.foto);
    kontrol('az gürültülü fotoğraf da fotoğraf sayılır', s.fotoAzGurultu.foto, s.fotoAzGurultu);
    kontrol('ekran görüntüsü fotoğraf sayılmaz', !s.ekran.foto && !s.ekran.saydam, s.ekran);
    kontrol('çizim fotoğraf sayılmaz', !s.cizim.foto, s.cizim);
    kontrol('siyah-beyaz taranmış sayfa (gürültülü) fotoğraf gibi sayılır', s.griTarama.foto, s.griTarama);
    kontrol('saydam resim saydam sayılır', s.saydam.saydam, s.saydam);
    kontrol('dörtte biri fotoğraf olan ekran görüntüsü fotoğraf sayılmaz (PNG kalır)', !s.karisik.foto, s.karisik);
    kontrol('eğimli zeminli slayt fotoğraf sayılmaz', !s.egim.foto, s.egim);
    const h = birim.hedef;
    kontrol('hedef: JPEG -> JPEG; PNG fotoğraf -> JPEG; PNG ekran -> PNG; PNG saydam -> PNG',
      h.jpeg === 'image/jpeg' && h.pngFoto === 'image/jpeg' && h.pngEkran === 'image/png' && h.pngSaydam === 'image/png', h);
    kontrol('hedef: WebP fotoğraf -> JPEG; WebP ekran ve saydam -> dokunma; HEIC -> JPEG, saydamsa dokunma',
      h.webpFoto === 'image/jpeg' && h.webpEkran === '' && h.webpSaydam === '' && h.heicFoto === 'image/jpeg' && h.heicSaydam === '', h);
    const b = birim.baslik;
    kontrol('JPEG başı: boyut ve EXIF yönü 6 (büyük sonlu, üretici ve GPS girişleri arasında)',
      b.jpegYon6.tur === 'jpeg' && b.jpegYon6.en === 640 && b.jpegYon6.boy === 480 && b.jpegYon6.yon === 6 && b.jpegYon6.alfa === false, b.jpegYon6);
    kontrol('JPEG başı: küçük sonlu EXIF yönü 3', b.jpegYon3LE.yon === 3 && b.jpegYon3LE.en === 640, b.jpegYon3LE);
    kontrol('JPEG başı: EXIF yoksa yön 1', b.jpegExifsiz.yon === 1 && b.jpegExifsiz.boy === 480, b.jpegExifsiz);
    kontrol('PNG başı: RGB, tRNS yok -> kesin saydam değil (tEXt parçası atlanır)',
      b.pngRgb.tur === 'png' && b.pngRgb.en === 64 && b.pngRgb.boy === 48 && b.pngRgb.alfa === false && b.pngRgbMetinli.alfa === false, [b.pngRgb, b.pngRgbMetinli]);
    kontrol('PNG başı: tRNS var ya da alfa kanalı var -> noktalara bakılır', b.pngRgbTrns.alfa === null && b.pngRgba.alfa === null, [b.pngRgbTrns, b.pngRgba]);
    kontrol('PNG başı: gri, tRNS yok -> saydam değil', b.pngGri.alfa === false, b.pngGri);
    kontrol('PNG başı: acTL var -> hareketli (APNG); yoksa değil', b.pngHareketli.hareketli === true && b.pngRgb.hareketli === false && b.pngRgba.hareketli === false, b.pngHareketli);
    kontrol('WebP başı: VP8X hareket bayrağı -> hareketli, 100x50', birim.webpHareketli.tur === 'webp' && birim.webpHareketli.hareketli === true &&
      birim.webpHareketli.en === 100 && birim.webpHareketli.boy === 50, birim.webpHareketli);
    const w = birim.webp;
    kontrol('WebP başı (' + w.opakParca + '): 300x200, saydam değil', w.opak.tur === 'webp' && w.opak.en === 300 && w.opak.boy === 200 && w.opak.alfa === false, w.opak);
    kontrol('WebP başı (' + w.saydamParca + '): 320x240, saydamlık olabilir', w.saydam.en === 320 && w.saydam.boy === 240 && w.saydam.alfa === null, w.saydam);
    kontrol('WebP başı (' + w.kayipsizParca + '): 330x210', w.kayipsiz.en === 330 && w.kayipsiz.boy === 210, w.kayipsiz);
    kontrol('HEIC imzası tanınır', birim.heic.tur === 'heic', birim.heic);
    console.log('    bu tarayıcı EXIF yönünü kendisi uyguluyor: ' + (birim.yonUygulaniyor ? 'evet' : 'hayır'));
  }
  if (akis) {
    console.log('=== 2) KÜÇÜLTME ===');
    const f = akis.foto;
    kontrol('girdi: 3000x2250 JPEG, EXIF (yön 6, GPS, üretici) içinde, ' + Math.round(akis.girdi.boyut / 1024) + ' KB',
      akis.girdi.make && akis.girdi.exif && akis.girdi.boyut > 1.5 * MB, akis.girdi);
    kontrol('büyük JPEG küçüldü (' + f.yazi + ', ' + akis.sure + ' ms)', f.kuculdu && f.sonra <= f.once * 0.8 && f.tur === 'image/jpeg' && f.jpeg, f);
    kontrol('ad değişmedi, tür dönüşümü yok', f.ad === 'IMG_0001.jpg' && f.cevrildi === '', f);
    kontrol('yön uygulandı: 1536x2048, kırmızı işaret sağ üstte', f.en === 1536 && f.boy === 2048 && f.sagUst && !f.solUst, f);
    kontrol('EXIF, GPS ve cihaz bilgisi gitti', !f.exif && !f.make, f);
    kontrol('"8,4 MB → 620 KB" biçimi', /^\d+(,\d)? MB → \d+ KB$/.test(f.yazi), f.yazi);
    kontrol('arayüz donmadı: en uzun takılma ' + akis.bosluk + ' ms (sınır 300)', akis.bosluk < 300, akis.bosluk);
    const e = akis.elle;
    kontrol('elle döndürme, yön 3 (180°): 2048x1536, işaret sağ altta', e[3].kuculdu && e[3].en === 2048 && e[3].boy === 1536 && e[3].sagAlt && !e[3].solUst, e[3]);
    kontrol('elle döndürme, yön 6 (90° saat yönü): 1536x2048, işaret sağ üstte', e[6].en === 1536 && e[6].boy === 2048 && e[6].sagUst && !e[6].solUst, e[6]);
    kontrol('elle döndürme, yön 8 (küçük sonlu EXIF, 90° ters): 1536x2048, işaret sol altta', e[8].en === 1536 && e[8].boy === 2048 && e[8].solAlt && !e[8].solUst, e[8]);
    const k = akis.kucuk;
    kontrol('500 KB altı JPEG (' + Math.round(k.boyut / 1024) + ' KB) olduğu gibi gider', k.boyut < 500 * 1024 && k.ayni && !k.kuculdu && k.yazi === '', k);
    const m = akis.kuculmeyen;
    kontrol('küçülmeyen JPEG (' + Math.round(m.boyut / 1024) + ' KB, 1600x1200) olduğu gibi gider', m.boyut >= 500 * 1024 && m.ayni && m.sebep === 'küçülmedi' && m.ad === 'kuculmeyen.jpg', m);
    const p = akis.pngFoto;
    kontrol('fotoğraf gibi PNG (' + Math.round(p.boyut / 1024) + ' KB) JPEG oldu: odev.jpg, ' + Math.round(p.sonra / 1024) + ' KB',
      p.kuculdu && p.tur === 'image/jpeg' && p.ad === 'odev.jpg' && p.cevrildi === 'PNG → JPEG' && p.jpeg, p);
    kontrol('hareketli PNG (' + Math.round(akis.apng.boyut / 1024) + ' KB) olduğu gibi gider', akis.apng.ayni && !akis.apng.kuculdu && akis.apng.sebep === 'hareketli resim', akis.apng);
    const sy = akis.saydam;
    kontrol('saydam PNG (' + Math.round(sy.boyut / 1024) + ' KB) PNG kaldı', sy.tur === 'image/png' && sy.ad === 'logo.png', sy);
    kontrol('saydam PNG küçüldü: 2048x1024, köşe saydam, orta dolu', sy.kuculdu && sy.en === 2048 && sy.boy === 1024 && sy.koseAlfa === 0 && sy.ortaAlfa === 255, sy);
    const ek = akis.ekran;
    kontrol('ekran görüntüsü PNG (' + Math.round(ek.boyut / 1024) + ' KB) PNG kaldı' + (ek.kuculdu ? ' (2048 px, ' + Math.round(ek.sonra / 1024) + ' KB)' : ' (dokunulmadı: ' + ek.sebep + ')'),
      ek.tur === 'image/png' && ek.ad === 'ekran.png' && (!ek.kuculdu || (ek.en === 2048 && ek.boy === 1463)), ek);
    const w = akis.webp;
    kontrol('fotoğraf gibi WebP (' + Math.round(w.boyut / 1024) + ' KB) JPEG oldu: foto.jpg', w.kuculdu && w.tur === 'image/jpeg' && w.ad === 'foto.jpg' && w.cevrildi === 'WebP → JPEG', w);
    kontrol('açılamayan HEIC olduğu gibi gider, hata vermez', akis.heic.ayni && !akis.heic.kuculdu && !!akis.heic.sebep, akis.heic);
    kontrol('aynı anda tek resim çözülür, hepsi biter', akis.sira.enCok === 1 && akis.sira.hepsi && akis.sira.acikKalan === 0, akis.sira);
  }
  if (arayuz) {
    console.log('=== 3) ARAYÜZ ===');
    const e = arayuz.ek;
    kontrol('ek: satırda önce "Küçültülüyor…", henüz gönderilmedi, kaydetme bekler', e.ilk === 'Küçültülüyor…' && e.gidenIlk === 0 && e.yukleniyor, e);
    kontrol('ek: kutuda "Büyük fotoğraflar küçültülerek yüklenir."', /Büyük fotoğraflar küçültülerek yüklenir\./.test(e.ipucu), e.ipucu);
    kontrol('ek: küçülmüş JPEG yeni adıyla gönderildi (odev.jpg)', e.ad === 'odev.jpg' && e.satirAd === 'odev.jpg' && e.govdeTur === 'image/jpeg' &&
      e.govdeBoyut < arayuz.okul.boyut * 0.8 && /\/api\/ek\/yukle\?tur=mesaj$/.test(e.url), e);
    kontrol('ek: yüklenirken "3,3 MB → … KB · yükleniyor"', /^\d+(,\d)? MB → \d+ KB · yükleniyor$/.test(e.yuklenirken), e.yuklenirken);
    kontrol('ek: bitince "… → … · yüklendi", kimlik alındı', /^\d+(,\d)? MB → \d+ KB · yüklendi$/.test(e.sonra) && e.idler.join() === 'e1' && !e.yukleniyorSonra, e);
    kontrol('ek: küçültülürken kaldırılan dosya gönderilmedi', e.kaldirGiden === 1 && e.kaldirSatir === 1, e);
    kontrol('ek: küçük PDF beklemeden gönderildi', e.pdfHemen, e);
    const t = arayuz.teslim;
    kontrol('teslim: satırda "Küçültülüyor…"; 3 MB\'lık fotoğraf 1 MB\'lık alan yüzünden reddedilmedi', t.ilk === 'Küçültülüyor…' && t.yukleniyor === 1 && t.onHata === 0, t);
    kontrol('teslim: küçülmüş dosya odev.jpg adıyla gönderildi', t.ad === 'odev.jpg' && t.satirAd === 'odev.jpg' && t.govdeBoyut < 1024 * 1024 &&
      /\/api\/odev-dosya\/yukle\?odev=o1$/.test(t.url), t);
    kontrol('teslim: satırda "3,3 MB → … KB" ve yüzde', /^\d+(,\d)? MB → \d+ KB$/.test(t.not) && t.yuzde === '%0', t);
    kontrol('teslim: bitince liste yenilendi, "küçültülerek yüklendi" notu kaldı', t.cizildi === 1 && /odev\.jpg<\/b> — küçültülerek yüklendi, \d+(,\d)? MB → \d+ KB/.test(t.notlar) && t.yukleniyorSonra === 0, t);
    kontrol('teslim: küçülünce de sığmayan dosya gönderilmedi, nedeni yazdı', t.sigmayanGiden === 0 && /sığmıyor: bu ödev için 100 KB boş yerin kaldı/.test(t.sigmayanHata), t);
    kontrol('teslim: küçültülürken iptal edilen dosya gönderilmedi', t.iptalGiden === 0 && t.iptalMetin === 'İptal edildi' && t.iptalSayac === 0, t);
    const o = arayuz.okul;
    kontrol('okul sayfası: 3 MB\'tan büyük fotoğraf reddedilmedi, "Küçültülüyor…"', o.boyut > 3 * MB && o.ilk === 'Küçültülüyor…', o);
    kontrol('okul sayfası: küçülmüş JPEG gönderildi (image/jpeg, 3 MB altı)', o.istek && o.istek.tur === 'image/jpeg' && o.istek.boyut < 3 * MB &&
      /\/api\/okul-sayfa\/foto\?yer=galeri$/.test(o.istek.url), o.istek);
    kontrol('okul sayfası: "Fotoğraf küçültülerek yüklendi (3,3 MB → … KB)."', /^Fotoğraf küçültülerek yüklendi \(\d+(,\d)? MB → \d+ KB\)\.$/.test(o.son), o.son);
  }
  console.log('\n  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.log('  KALDI  test çöktü -> ' + e.message); console.log('\n  GECTI: ' + gecti + '   KALDI: ' + (kaldi + 1)); process.exit(1); });
