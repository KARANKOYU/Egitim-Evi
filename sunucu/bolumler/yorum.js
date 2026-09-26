'use strict';
/* Açılış sayfasındaki yorumlar (/api/yorumlar).

     GET  /api/yorumlar            herkese açık: son yorumlar, ortalama yıldız, sayı
     GET  /api/yorumlar/benim      giriş yapmış kişinin yorumu ve yazıp yazamayacağı
     POST /api/yorumlar            { yildiz: 0-5, metin } yaz ya da değiştir (hesap başına tek)
     POST /api/yorumlar/sil        kendi yorumunu sil
     GET  /api/yorumlar/hepsi      sistem yöneticisi: gizliler dahil hepsi
     POST /api/yorumlar/gizle      sistem yöneticisi: { id, gizli }

   Kim yazar: yalnızca Eğitim Evi'ni kullanan yetişkinler (okulda öğretmen ya
   da müdür rolü ya da bağlı bir çocuğu olan). Öğrenci, servisçi ve sistem
   yöneticisi yazmaz. Ad tam gösterilmez: "Faruk Yıldız" -> "Fa. Yı.",
   iki isimliyse "Mehmet Ali Yıldız" -> "M. A. Yı.". Uygunsuz kelime
   süzgeci: badwordsfilter.json; bağlantı (reklam) kabul edilmez. */

const { bad, ok } = require('../http');
const { hizSinir } = require('../guvenlik');
const { clean, uid } = require('../ortak');
const { depo } = require('../veri');
const { uygunsuzKelime } = require('../yardimci/kufur-suzgeci');
const { islemYaz } = require('./islem-kaydi');

const GORUNEN_SINIR = 12;
const BAGLANTI = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|tr|io|info|xyz|biz)\b)/i;

const buyukBas = s => s.charAt(0).toLocaleUpperCase('tr') + s.slice(1).toLocaleLowerCase('tr');

/* "Faruk Yıldız" -> "Fa. Yı."; "Mehmet Ali Yıldız" -> "M. A. Yı."; tek kelime -> "Fa." */
function adKisalt(tamAd) {
  const p = String(tamAd || '').trim().split(/\s+/).filter(Boolean);
  if (!p.length) return '';
  if (p.length === 1) return buyukBas(p[0].slice(0, 2)) + '.';
  const soyad = buyukBas(p[p.length - 1].slice(0, 2)) + '.';
  const adlar = p.slice(0, -1);
  const ad = adlar.length > 1 ? adlar.map(a => a.charAt(0).toLocaleUpperCase('tr') + '.').join(' ')
    : buyukBas(adlar[0].slice(0, 2)) + '.';
  return ad + ' ' + soyad;
}

/* Kişinin yetişkin (ana) hesabı ve yorum yazabilmesi. */
async function yazarBilgisi(me) {
  if (!me) return { neden: 'Yorum yazmak için giriş yap.' };
  const ana = me.anaHesapId ? await depo.kullanicilar.bul(me.anaHesapId) : me;
  if (!ana || !depo.kullanicilar.yetiskinMi(ana)) {
    return { neden: 'Yorumları yalnızca veli, öğretmen ve müdür hesapları yazabilir.' };
  }
  const [roller, cocuklar] = await Promise.all([depo.kullanicilar.rolleri(ana.id), depo.kullanicilar.cocuklari(ana.id)]);
  const onayli = roller.filter(r => r.status === 'approved');
  const etiket = [];
  if (onayli.some(r => r.role === 'principal')) etiket.push('Müdür');
  if (onayli.some(r => r.role === 'teacher')) etiket.push('Öğretmen');
  if (cocuklar.length) etiket.push('Veli');
  if (!etiket.length) {
    return { ana, neden: 'Yorum yazmak için bir okulda öğretmen ya da müdür olman ya da çocuğunu eklemiş olman gerekiyor.' };
  }
  return { ana, rol: etiket.map((e, i) => (i ? e.toLocaleLowerCase('tr') : e)).join(', ') };
}

/* Herkese açık liste bir dakika önbellekte tutulur. */
let onbellek = null, onbellekZamani = 0;
const onbellegiBosalt = () => { onbellek = null; };

async function gorunenler() {
  if (onbellek && Date.now() - onbellekZamani < 60 * 1000) return onbellek;
  const g = await depo.yorumlar.gorunenler(GORUNEN_SINIR);
  onbellek = {
    sayi: g.sayi,
    ortalama: Math.round(g.ortalama * 10) / 10,
    yorumlar: g.yorumlar.map(y => ({ adKisa: y.adKisa, rol: y.rol, yildiz: y.yildiz, metin: y.metin, tarih: y.guncelleme }))
  };
  onbellekZamani = Date.now();
  return onbellek;
}

async function uclar(k) {
  const { req, res, me, body, p, segs, method } = k;
  if (p !== 'yorumlar') return false;
  const alt = segs[2] || '';

  if (!alt && method === 'GET') return ok(res, await gorunenler());

  if (alt === 'benim' && method === 'GET') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    const b = await yazarBilgisi(me);
    const y = b.ana ? await depo.yorumlar.hesabin(b.ana.id) : null;
    return ok(res, {
      yazabilir: !b.neden, neden: b.neden || '', adKisa: b.ana ? adKisalt(b.ana.fullName) : '', rol: b.rol || '',
      yorum: y ? { yildiz: y.yildiz, metin: y.metin, gizli: y.gizli, tarih: y.guncelleme } : null
    });
  }

  if (!alt && method === 'POST') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    const b = await yazarBilgisi(me);
    if (b.neden) return bad(res, b.neden, 403);
    if (!hizSinir('yorum:' + b.ana.id, 10, 60 * 60 * 1000)) return bad(res, 'Yorumunu çok sık değiştirdin. Biraz sonra dene.', 429);
    const yildiz = Number(body.yildiz);
    if (!Number.isInteger(yildiz) || yildiz < 0 || yildiz > 5) return bad(res, 'Yıldız 0 ile 5 arasında olmalı.');
    const metin = clean(body.metin, 600).replace(/\s+/g, ' ').trim();
    if (metin.length < 3) return bad(res, 'Yorumunu yaz (en az 3 harf).');
    if (metin.length > 500) return bad(res, 'Yorum en fazla 500 karakter olabilir.');
    if (BAGLANTI.test(metin)) return bad(res, 'Yoruma internet adresi eklenemez.');
    const kotu = uygunsuzKelime(metin);
    if (kotu) {
      await islemYaz(me, 'yorum.reddedildi', 'uygunsuz kelime: ' + kotu, req);
      return bad(res, 'Yorumunda uygun olmayan bir kelime var. Düzeltip yeniden gönder.');
    }
    const eski = await depo.yorumlar.hesabin(b.ana.id);
    await depo.yorumlar.yaz({ id: eski ? eski.id : uid('yr'), hesapId: b.ana.id, yildiz, metin,
      adKisa: adKisalt(b.ana.fullName), rol: b.rol });
    onbellegiBosalt();
    return ok(res, { message: eski && eski.gizli ? 'Yorumun güncellendi. Sistem yöneticisi gizlediği için açılışta görünmüyor.'
      : 'Yorumun açılış sayfasında görünüyor. Teşekkürler!' });
  }

  if (alt === 'sil' && method === 'POST') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    const ana = me.anaHesapId ? await depo.kullanicilar.bul(me.anaHesapId) : me;
    if (ana) await depo.yorumlar.hesabinkiniSil(ana.id);
    onbellegiBosalt();
    return ok(res, { message: 'Yorumun silindi.' });
  }

  if (alt === 'hepsi' && method === 'GET') {
    if (!me || me.role !== 'admin') return bad(res, 'Bu işlem için yetkin yok', 403);
    const liste = await depo.yorumlar.hepsi(300);
    return ok(res, { yorumlar: liste.map(y => ({ id: y.id, adKisa: y.adKisa, rol: y.rol, yildiz: y.yildiz, metin: y.metin,
      gizli: y.gizli, tarih: y.guncelleme })) });
  }

  if (alt === 'gizle' && method === 'POST') {
    if (!me || me.role !== 'admin') return bad(res, 'Bu işlem için yetkin yok', 403);
    const y = await depo.yorumlar.bul(clean(body.id, 60));
    if (!y) return bad(res, 'Yorum bulunamadı', 404);
    await depo.yorumlar.gizle(y.id, body.gizli === true);
    await islemYaz(me, body.gizli === true ? 'yorum.gizlendi' : 'yorum.acildi', y.adKisa + ': ' + y.metin.slice(0, 60), req);
    onbellegiBosalt();
    return ok(res);
  }

  return false;
}

module.exports = { uclar, adKisalt };
