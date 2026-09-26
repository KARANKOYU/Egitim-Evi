'use strict';
/* Okul sayfası: okulun giriş adresinde (egitimevi.org/school/<okulun-adi>) giriş
   kartının üstünde duran tanıtım.

     GET  /api/okul-sayfa                   düzenleme ekranı: ayarlar, tanıtım, CSS, fotoğraflar
     POST /api/okul-sayfa                   kaydet { ayarlar, tanitim, css } -> temizlenmiş CSS ve uyarılar
     POST /api/okul-sayfa/onizle            yalnızca CSS'i temizler (kaydetmeden önizleme)
     POST /api/okul-sayfa/foto?yer=...      gövde: fotoğrafın kendisi (kapak, logo ya da galeri)
     POST /api/okul-sayfa/foto-sil          { id }
     POST /api/okul-sayfa/foto-aciklama     { id, aciklama }
     GET  /api/okul-foto/<id>               fotoğraf (herkese açık, okul sayfası gibi)

   Düzenleyen: müdür ya da "okul.sayfa" yetkisi verilen kişi (hazır şablon:
   "Kodlayıcı"). Serbest HTML ve betik yok: sayfanın yapısı sabit, yazı düz
   metin, görünüm ayarlarla ve kısıtlı CSS ile değişir (css-temizle.js).
   Fotoğrafın türü baytlarından denetlenir, konum bilgisi silinir (resim.js). */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { hizSinir, istemciIp } = require('../guvenlik');
const { bad, baslikEkle, ok, sendJSON } = require('../http');
const { clean } = require('../ortak');
const { depo } = require('../veri');
const { DATA } = require('../yollar');
const { yetkiVarMi } = require('../yetki');
const { cssTemizle } = require('../yardimci/css-temizle');
const { resmiTemizle } = require('../yardimci/resim');
const { islemYaz } = require('./islem-kaydi');

const KLASOR = path.join(DATA, 'okul-fotolari');
const FOTO_SINIR = 3 * 1024 * 1024;
const GALERI_SINIR = 8;
const TANITIM_SINIR = 1500;
const FOTO_ID = /^[0-9a-f]{32}$/;
const YERLER = ['kapak', 'logo', 'galeri'];

/* ---------------- görünüm ayarları ----------------
   Her ayarın izin verilen değerleri; bilinmeyen ya da bozuk değer
   varsayılana döner. Renkler yalnızca #rrggbb. */
const RENK = /^#[0-9a-f]{6}$/;
const SECENEKLER = {
  baslikBoyu: ['orta', 'kucuk', 'buyuk'],
  kapakBoyu: ['orta', 'kisa', 'uzun'],
  hiza: ['sol', 'orta'],
  genislik: ['genis', 'dar'],
  galeriSutun: ['3', '2', '4']
};

function ayarlariTemizle(a) {
  a = a && typeof a === 'object' ? a : {};
  const t = {};
  for (const k of ['renk', 'zemin', 'yazi']) {
    const v = String(a[k] || '').toLowerCase();
    t[k] = RENK.test(v) ? v : '';
  }
  for (const k in SECENEKLER) {
    const v = String(a[k] === undefined ? '' : a[k]);
    t[k] = SECENEKLER[k].indexOf(v) >= 0 ? v : SECENEKLER[k][0];
  }
  return t;
}

const tanitimTemizle = s => String(s || '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '')
  .replace(/\n{3,}/g, '\n\n').trim().slice(0, TANITIM_SINIR);

/* Herkese giden görünüm: okulun giriş sayfası bunu çizer. Sayfası hiç
   düzenlenmemiş okulda null (giriş sayfası eskisi gibi yalnızca kart). */
async function okulSayfasiGorunumu(okulId) {
  const [s, fotolar] = await Promise.all([depo.okulSayfalari.bul(okulId), depo.okulSayfalari.fotolari(okulId)]);
  if (!s && !fotolar.length) return null;
  return {
    tanitim: s ? s.tanitim : '',
    ayarlar: ayarlariTemizle(s && s.ayarlar),
    css: s && s.css ? cssTemizle(s.css).css : '',
    fotolar: fotolar.map(f => ({ id: f.id, yer: f.yer, aciklama: f.aciklama }))
  };
}

/* ---------------- fotoğraf dosyaları ---------------- */
const dosyaYolu = id => path.join(KLASOR, id);

/* Gövdeyi belleğe okur; sınırı aşarsa null. */
function govdeOku(req, sinir) {
  return new Promise(resolve => {
    const parcalar = [];
    let boyut = 0, bitti = false;
    const son = v => { if (!bitti) { bitti = true; resolve(v); } };
    req.on('data', c => {
      boyut += c.length;
      if (boyut > sinir) {
        /* Hemen koparılırsa istemci 413 cevabını göremiyor: akış durur,
           cevap yazılır, bağlantı biraz sonra kapanır. */
        if (!bitti) setTimeout(() => { try { req.destroy(); } catch (e) { /* yoksay */ } }, 1500);
        son(null);
        try { req.pause(); } catch (e) { /* yoksay */ }
        return;
      }
      parcalar.push(c);
    });
    req.on('end', () => son(Buffer.concat(parcalar)));
    req.on('error', () => son(null));
    req.on('close', () => son(boyut > sinir ? null : Buffer.concat(parcalar)));
  });
}

async function fotoDosyasiniSil(id) {
  await fs.promises.unlink(dosyaYolu(id)).catch(() => {});
}

/* Kaydı silinmiş ya da yarım kalmış dosyalar (1 saatten eski) silinir. */
async function fotoSupur() {
  let adlar;
  try { adlar = await fs.promises.readdir(KLASOR); } catch (e) { return 0; }
  const kayitli = await depo.okulSayfalari.kayitlilar(adlar.filter(a => FOTO_ID.test(a)));
  let silinen = 0;
  for (const ad of adlar) {
    if (FOTO_ID.test(ad) && kayitli.has(ad)) continue;
    try {
      const st = await fs.promises.stat(dosyaYolu(ad));
      if (Date.now() - st.mtimeMs < 60 * 60 * 1000) continue;
      await fs.promises.unlink(dosyaYolu(ad));
      silinen++;
    } catch (e) { /* bu arada silinmiş olabilir */ }
  }
  return silinen;
}

/* ---------------- yetki ---------------- */
function duzenleyemez(res, me) {
  if (!me) return bad(res, 'Giriş yapmalısın', 401);
  if (me.status !== 'approved' || !me.schoolId || (me.role !== 'principal' && me.role !== 'teacher') ||
      !yetkiVarMi(me, 'okul.sayfa')) {
    return bad(res, 'Okul sayfasını düzenleme yetkin yok.', 403);
  }
  return false;
}

/* Fotoğraf yükleme: gövde JSON değil, dosyanın kendisi. api.js JSON
   okuyucusundan önce buraya gönderir. k: { req, res, me, q, kvkkGuncel, sifreTamam } */
async function fotoYukle(k) {
  const { req, res, me, q } = k;
  const red = (kod, mesaj) => { req.resume(); return bad(res, mesaj, kod); };
  if (!me) return red(401, 'Giriş yapmalısın');
  if (!k.kvkkGuncel) return red(403, 'Önce aydınlatma metnini onaylaman gerekiyor.');
  if (!k.sifreTamam) return red(403, 'Önce kendi şifreni belirlemen gerekiyor.');
  if (me.status !== 'approved' || !me.schoolId || (me.role !== 'principal' && me.role !== 'teacher') ||
      !yetkiVarMi(me, 'okul.sayfa')) {
    return red(403, 'Okul sayfasını düzenleme yetkin yok.');
  }
  const yer = clean(q.get('yer'), 10);
  if (YERLER.indexOf(yer) < 0) return red(400, 'Fotoğrafın yeri belli değil (kapak, logo ya da galeri).');
  if (!hizSinir('okulFoto:' + me.schoolId, 40, 60 * 60 * 1000)) return red(429, 'Bir saatte çok fazla fotoğraf yüklendi. Biraz bekle.');
  const bildirilen = Number(req.headers['content-length'] || 0);
  if (bildirilen > FOTO_SINIR) return red(413, 'Fotoğraf en fazla 3 MB olabilir. Küçültüp yeniden dene.');
  const eskiler = await depo.okulSayfalari.fotolari(me.schoolId);
  if (yer === 'galeri' && eskiler.filter(f => f.yer === 'galeri').length >= GALERI_SINIR) {
    return red(400, 'Galeride en fazla ' + GALERI_SINIR + ' fotoğraf olabilir. Önce birini sil.');
  }

  const ham = await govdeOku(req, FOTO_SINIR);
  if (!ham) return bad(res, 'Fotoğraf en fazla 3 MB olabilir. Küçültüp yeniden dene.', 413);
  if (!ham.length) return bad(res, 'Dosya boş.');
  const resim = resmiTemizle(ham);
  if (!resim) return bad(res, 'Bu dosya fotoğraf olarak tanınmadı. PNG, JPEG ya da WebP yükle.');

  const id = crypto.randomBytes(16).toString('hex');
  await fs.promises.mkdir(KLASOR, { recursive: true });
  await fs.promises.writeFile(dosyaYolu(id), resim.veri, { flag: 'wx', mode: 0o600 });
  try {
    await depo.okulSayfalari.fotoEkle({ id, okulId: me.schoolId, yer, tur: resim.tur, boyut: resim.veri.length });
  } catch (e) {
    await fotoDosyasiniSil(id);
    throw e;
  }
  /* Kapak ve logo tektir: yenisi gelince eskisi gider. */
  if (yer !== 'galeri') {
    for (const f of eskiler.filter(x => x.yer === yer)) {
      await depo.okulSayfalari.fotoSil(f.id);
      await fotoDosyasiniSil(f.id);
    }
  }
  await islemYaz(me, 'okul-sayfa.foto', yer + ' fotoğrafı yüklendi', req);
  return ok(res, { foto: { id, yer, aciklama: '' } });
}

/* Herkese açık fotoğraf. Kimliği 32 haneli rastgele sayı, değişmez: tarayıcı
   uzun süre önbellekte tutabilir. */
async function fotoGonder(req, res, id) {
  if (!hizSinir('okulFotoOku:' + istemciIp(req), 600, 60 * 1000)) return bad(res, 'Çok fazla istek. Biraz bekle.', 429);
  if (!FOTO_ID.test(id)) return bad(res, 'Fotoğraf bulunamadı', 404);
  const f = await depo.okulSayfalari.foto(id);
  if (!f) return bad(res, 'Fotoğraf bulunamadı', 404);
  let veri;
  try { veri = await fs.promises.readFile(dosyaYolu(id)); } catch (e) { return bad(res, 'Fotoğraf bulunamadı', 404); }
  res.writeHead(200, baslikEkle({
    'Content-Type': f.tur,
    'Content-Length': veri.length,
    'Content-Disposition': 'inline',
    'Cache-Control': 'public, max-age=604800, immutable'
  }));
  res.end(veri);
}

/* ---------------- uçlar ---------------- */
async function uclar(k) {
  const { req, res, me, body, p, segs, method } = k;

  if (p === 'okul-foto' && method === 'GET') return fotoGonder(req, res, clean(segs[2], 40));
  if (p !== 'okul-sayfa') return false;
  if (duzenleyemez(res, me)) return;
  const alt = segs[2] || '';

  if (!alt && method === 'GET') {
    const [s, fotolar, okul] = await Promise.all([
      depo.okulSayfalari.bul(me.schoolId), depo.okulSayfalari.fotolari(me.schoolId), depo.okullar.bul(me.schoolId)
    ]);
    const temiz = cssTemizle(s ? s.css : '');
    return ok(res, {
      okul: { ad: okul ? okul.name : '', il: okul ? okul.city : '', ilce: okul ? okul.district : '', kisaAd: okul ? okul.kisaAd : '' },
      tanitim: s ? s.tanitim : '',
      ayarlar: ayarlariTemizle(s && s.ayarlar),
      css: s ? s.css : '',
      temizCss: temiz.css,
      uyarilar: temiz.uyarilar,
      fotolar: fotolar.map(f => ({ id: f.id, yer: f.yer, aciklama: f.aciklama, boyut: f.boyut })),
      guncelleme: s ? s.guncelleme : null
    });
  }

  if (alt === 'onizle' && method === 'POST') {
    return ok(res, cssTemizle(typeof body.css === 'string' ? body.css : ''));
  }

  if (!alt && method === 'POST') {
    if (typeof body.css === 'string' && body.css.length > 8000) {
      return sendJSON(res, 400, { error: 'CSS en fazla 8000 karakter olabilir.', alan: 'css' });
    }
    const tanitim = tanitimTemizle(body.tanitim);
    const css = typeof body.css === 'string' ? body.css.replace(/\r\n?/g, '\n') : '';
    const ayarlar = ayarlariTemizle(body.ayarlar);
    await depo.okulSayfalari.yaz(me.schoolId, { tanitim, ayarlar, css }, me.id);
    await islemYaz(me, 'okul-sayfa.duzenlendi', 'okul sayfası kaydedildi', req);
    const sonuc = cssTemizle(css);
    return ok(res, {
      ayarlar, tanitim, css, temizCss: sonuc.css, uyarilar: sonuc.uyarilar,
      message: sonuc.uyarilar.length ? 'Kaydedildi. CSS\'in bazı kısımları kullanılamadığı için atıldı; aşağıda nedenleri var.'
        : 'Okul sayfası kaydedildi.'
    });
  }

  if (alt === 'foto-sil' && method === 'POST') {
    const f = await depo.okulSayfalari.foto(clean(body.id, 40));
    if (!f || f.okulId !== me.schoolId) return bad(res, 'Fotoğraf bulunamadı', 404);
    await depo.okulSayfalari.fotoSil(f.id);
    await fotoDosyasiniSil(f.id);
    await islemYaz(me, 'okul-sayfa.foto-silindi', f.yer + ' fotoğrafı silindi', req);
    return ok(res);
  }

  if (alt === 'foto-aciklama' && method === 'POST') {
    const f = await depo.okulSayfalari.foto(clean(body.id, 40));
    if (!f || f.okulId !== me.schoolId) return bad(res, 'Fotoğraf bulunamadı', 404);
    await depo.okulSayfalari.fotoAciklamasi(f.id, clean(body.aciklama, 120));
    return ok(res);
  }

  return false;
}

module.exports = { uclar, fotoYukle, fotoSupur, okulSayfasiGorunumu, ayarlariTemizle };
