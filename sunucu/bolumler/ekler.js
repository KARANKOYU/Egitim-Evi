'use strict';
/* Ekler (/api/ek): mesaja ve öğretmenin verdiği ödeve eklenen dosyalar.

     POST /api/ek/yukle?tur=mesaj|odev   gövde: dosyanın kendisi (başlık: X-Dosya-Adi)
                                         -> taslak ek; yalnızca yükleyen görür
     POST /api/ek/sil       { id }       taslağı (ya da gönderenin kendi ekini) siler
     GET  /api/ek/bilet?id               indirme bileti (yetki burada denetlenir)
     GET  /api/ek/indir?bilet            dosyanın kendisi, "ek" olarak iner

   Bağlama: mesaj gönderilirken (POST /api/mesajlar { ekIdler }) ve ödev
   verilirken ya da düzeltilirken (POST /api/assignments { ekIdler },
   .../update { ekIdler, ekSilIdler }) — ekleriDogrula / ekleriBagla.

   Kurallar: bir mesajın ya da ödevin ekleri toplam 150 MB; dosya 7 gün sonra
   diskten silinir (mesaj ve ödev kalır, "süresi doldu" yazar). Güvenlik
   ödev teslim dosyalarıyla aynı (odev-dosya.js): izinli uzantılar, rastgele
   dosya adı, akışla diske yazma, "ek" olarak indirme (tarayıcı açmaz),
   boş yer ve aynı anda yükleme sınırı. */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { hizSinir } = require('../guvenlik');
const { bad, ok } = require('../http');
const { clean } = require('../ortak');
const { depo } = require('../veri');
const { DATA } = require('../yollar');
const { yetkiVarMi } = require('../yetki');
const { akisiYaz, reddet, ekBasliklari, dosyaAdi, uzanti, UZANTILAR, biletVer, biletKullan } = require('./odev-dosya');

const KLASOR = path.join(DATA, 'ekler');
const MB = 1024 * 1024;
const EK_SINIR = 150 * MB;                 // bir mesajın ya da ödevin eklerinin toplamı
const EN_FAZLA_EK = 20;                    // bir mesaja/ödeve en fazla dosya
const BOS_YER_PAYI = 2 * 1024 * MB;
const AYNI_ANDA_KISI = 3, AYNI_ANDA_TOPLAM = 60;

/* Süren yüklemeler: kişi başına sayı ve bayt (taslak toplamına süren de sayılır). */
const suren = { adet: new Map(), kisiBayt: new Map(), toplam: 0, bayt: 0 };
const artir = (harita, anahtar, n) => {
  const v = (harita.get(anahtar) || 0) + n;
  if (v > 0) harita.set(anahtar, v); else harita.delete(anahtar);
};

async function bosYer() {
  try {
    const s = await fs.promises.statfs(KLASOR);
    return s.bavail * s.bsize;
  } catch (e) { return null; }
}

/* Kim ne türde ek yükleyebilir: mesaja herkes (okulda mesaj yazabilen),
   ödeve ödev verebilen öğretmen ya da müdür. */
function yukleyebilir(me, tur) {
  if (!me || me.status !== 'approved') return false;
  if (tur === 'odev') return (me.role === 'teacher' || me.role === 'principal') && yetkiVarMi(me, 'odev.ver');
  return ['student', 'parent', 'teacher', 'principal', 'servisci'].indexOf(me.role) >= 0;
}

async function yukle(k) {
  const { req, res, me, q } = k;
  if (!me) return reddet(req, res, 'Giriş yapmalısın', 401);
  if (!k.kvkkGuncel) return reddet(req, res, 'Aydınlatma metni güncellendi. Devam etmek için okuyup onaylaman gerekiyor.', 403);
  if (!k.sifreTamam) return reddet(req, res, 'Önce kendi şifreni belirle.', 403);
  const tur = clean(q.get('tur'), 10);
  if (tur !== 'mesaj' && tur !== 'odev') return reddet(req, res, 'Ekin türü belli değil (mesaj ya da ödev).');
  if (!yukleyebilir(me, tur)) return reddet(req, res, 'Bu türde dosya ekleme yetkin yok', 403);
  if (!hizSinir('ekYukle:' + me.id, 100, 60 * 60 * 1000)) return reddet(req, res, 'Bu saat içinde çok fazla dosya yükledin.', 429);

  const boyut = Number(req.headers['content-length']);
  if (!Number.isSafeInteger(boyut) || boyut <= 0) return reddet(req, res, 'Dosya boş ya da boyutu bildirilmedi', 411);
  if (boyut > EK_SINIR) return reddet(req, res, 'Bir dosya en fazla 150 MB olabilir.', 413);
  const ad = dosyaAdi(req.headers['x-dosya-adi']);
  if (!ad) return reddet(req, res, 'Dosya adı geçersiz');
  if (!UZANTILAR.has(uzanti(ad))) {
    return reddet(req, res, 'Bu dosya türü eklenemez. PDF, Word, Excel, sunum, resim, ses, video ya da zip ekleyebilirsin.', 415);
  }
  /* Taslakların toplamı da 150 MB'ı geçmez: gönderilmemiş bir mesajın ekleri. */
  if (await depo.ekler.taslakToplami(me.id) + (suren.kisiBayt.get(me.id) || 0) + boyut > EK_SINIR) {
    return reddet(req, res, 'Eklerin toplamı en fazla 150 MB olabilir. Bir dosyayı kaldır ya da önce gönder.', 413);
  }
  await fs.promises.mkdir(KLASOR, { recursive: true });
  const bos = await bosYer();
  if (bos !== null && bos - suren.bayt - boyut < BOS_YER_PAYI) return reddet(req, res, 'Sunucuda yer kalmadı. Biraz sonra dene.', 507);
  if ((suren.adet.get(me.id) || 0) >= AYNI_ANDA_KISI || suren.toplam >= AYNI_ANDA_TOPLAM) {
    return reddet(req, res, 'Aynı anda çok fazla yükleme var. Biri bitince dene.', 429);
  }
  artir(suren.adet, me.id, 1); artir(suren.kisiBayt, me.id, boyut); suren.toplam++; suren.bayt += boyut;

  const id = crypto.randomBytes(16).toString('hex');
  const gecici = path.join(KLASOR, id + '.yukleniyor');
  const kalici = path.join(KLASOR, id);
  try {
    let sonuc;
    try { sonuc = await akisiYaz(req, gecici, boyut); } catch (e) { return reddet(req, res, e.message, e.kod || 400); }
    await fs.promises.rename(gecici, kalici);
    await depo.ekler.ekle({ id, yukleyenId: me.id, okulId: me.schoolId || '', tur, ad, boyut: sonuc.boyut, sha256: sonuc.sha256 });
    return ok(res, { ek: { id, ad, boyut: sonuc.boyut }, message: ad + ' eklendi.' });
  } finally {
    artir(suren.adet, me.id, -1); artir(suren.kisiBayt, me.id, -boyut); suren.toplam--; suren.bayt -= boyut;
  }
}

/* Mesajı ya da ödevi kaydetmeden önce: ekIdler kişinin taslakları mı, toplam
   150 MB'ı geçiyor mu? Dönen: { idler } ya da { hata }. mevcut: hedefin
   kalan eklerinin toplam boyutu (ödev düzeltilirken). */
async function ekleriDogrula(me, tur, ham, mevcut) {
  const idler = [...new Set((Array.isArray(ham) ? ham : []).map(x => clean(x, 40)).filter(x => /^[0-9a-f]{32}$/.test(x)))];
  if (!idler.length) return { idler: [] };
  if (idler.length > EN_FAZLA_EK) return { hata: 'En fazla ' + EN_FAZLA_EK + ' dosya eklenebilir.' };
  const taslaklar = await depo.ekler.taslaklari(me.id, tur, idler);
  if (taslaklar.length !== idler.length) return { hata: 'Eklerden biri bulunamadı ya da süresi doldu. Yeniden ekle.' };
  const toplam = taslaklar.reduce((t, e) => t + e.boyut, 0) + (mevcut || 0);
  if (toplam > EK_SINIR) return { hata: 'Eklerin toplamı en fazla 150 MB olabilir.' };
  return { idler };
}

const ekleriBagla = (tur, hedefId, idler) => depo.ekler.bagla(tur, hedefId, idler);

/* Dışarı giden görünüm. */
function ekGorunumu(e) {
  const bitti = e.silindi || new Date(e.bitis).getTime() <= Date.now();
  return { id: e.id, ad: e.ad, boyut: e.boyut, bitis: e.bitis, suresiDoldu: bitti };
}
async function hedefinEkleri(tur, hedefId) {
  return (await depo.ekler.hedefin(tur, hedefId)).map(ekGorunumu);
}

/* Bu kişi bu eki görebilir mi? Mesajda: gönderen ya da alıcı (veli dahil).
   Ödevde: ödevi veren, okulun müdürü, ödevin öğrencisi ya da velisi.
   Taslağı yalnızca yükleyen görür. */
async function gorebilir(me, e) {
  if (e.yukleyenId === me.id) return true;
  if (e.mesajId) {
    const m = await depo.mesajlar.bul(e.mesajId);
    return !!m && (m.gonderenId === me.id || m.alicilar.some(a => a.id === me.id));
  }
  if (e.odevId) {
    const a = await depo.odevler.bul(e.odevId);
    if (!a) return false;
    if (a.teacherId === me.id || (me.role === 'principal' && a.schoolId === me.schoolId)) return true;
    if (a.studentIds.indexOf(me.id) >= 0) return true;
    if (me.role === 'student') return false;
    for (const sid of a.studentIds) if (await depo.kullanicilar.bagliMi(me.id, sid)) return true;
  }
  return false;
}

async function dosyaGonder(res, e) {
  const yol = path.join(KLASOR, e.id);
  let st;
  try { st = await fs.promises.stat(yol); } catch (x) { return bad(res, 'Dosyanın süresi doldu.', 410); }
  res.writeHead(200, ekBasliklari(e.ad, st.size));
  fs.createReadStream(yol).on('error', () => res.destroy()).pipe(res);
}

async function uclar(k) {
  const { res, me, body, q, p, segs, method } = k;
  if (p !== 'ek') return false;
  const alt = segs[2] || '';

  if (alt === 'indir' && method === 'GET') {
    const b = biletKullan(clean(q.get('bilet'), 60));
    if (!b || b.tur !== 'ek') return bad(res, 'İndirme bağlantısının süresi doldu. Yeniden dene.', 410);
    const kisi = await depo.kullanicilar.bul(b.kullaniciId);
    const e = await depo.ekler.bul(b.hedef);
    if (!kisi || kisi.status !== 'approved' || !e || !await gorebilir(kisi, e)) return bad(res, 'Bu dosyayı görme yetkin yok', 403);
    if (e.silindi || new Date(e.bitis).getTime() <= Date.now()) return bad(res, 'Dosyanın süresi doldu (7 gün).', 410);
    return dosyaGonder(res, e);
  }

  if (!me) return bad(res, 'Giriş yapmalısın', 401);

  if (alt === 'bilet' && method === 'GET') {
    if (!hizSinir('ekIndir:' + me.id, 300, 60 * 60 * 1000)) return bad(res, 'Çok fazla indirme yaptın. Biraz bekle.', 429);
    const e = await depo.ekler.bul(clean(q.get('id'), 40));
    if (!e || !await gorebilir(me, e)) return bad(res, 'Dosya bulunamadı', 404);
    if (e.silindi || new Date(e.bitis).getTime() <= Date.now()) return bad(res, 'Dosyanın süresi doldu (7 gün).', 410);
    const bilet = biletVer(me.id, 'ek', e.id);
    if (!bilet) return bad(res, 'Sunucu şu an çok yoğun. Biraz sonra dene.', 503);
    return ok(res, { yol: '/api/ek/indir?bilet=' + bilet });
  }

  if (alt === 'sil' && method === 'POST') {
    const e = await depo.ekler.bul(clean(body.id, 40));
    if (!e || e.yukleyenId !== me.id) return bad(res, 'Dosya bulunamadı', 404);
    await depo.ekler.sil(e.id);
    await fs.promises.unlink(path.join(KLASOR, e.id)).catch(() => {});
    return ok(res, { message: e.ad + ' kaldırıldı.' });
  }

  return false;
}

/* Temizlik (saatte bir): süresi dolan eklerin ve bağlanmayan taslakların
   dosyaları silinir; kaydı olmayan ya da yarım kalmış dosyalar da. */
async function ekSupur() {
  for (const id of await depo.ekler.suresiDolanlar()) {
    await fs.promises.unlink(path.join(KLASOR, id)).catch(() => {});
  }
  let adlar;
  try { adlar = await fs.promises.readdir(KLASOR); } catch (e) { return; }
  const yasayan = await depo.ekler.yasayanlar(adlar.filter(a => /^[0-9a-f]{32}$/.test(a)));
  for (const ad of adlar) {
    if (/^[0-9a-f]{32}$/.test(ad) && yasayan.has(ad)) continue;
    try {
      const st = await fs.promises.stat(path.join(KLASOR, ad));
      if (Date.now() - st.mtimeMs < 2 * 60 * 60 * 1000) continue;
      await fs.promises.unlink(path.join(KLASOR, ad));
    } catch (e) { /* bu arada silinmiş olabilir */ }
  }
}

