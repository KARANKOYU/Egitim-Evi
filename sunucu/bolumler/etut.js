'use strict';
/* Etütler (/api/etut): ders dışı, belli gün ve saatte yapılan çalışma.

     GET  /api/etut                 okul personelinin göreceği etütler
     GET  /api/etut/adaylar         etüt düzenlerken seçilecek öğretmen, sınıf ve öğrenciler
     GET  /api/etut/detay?id        etüt ve öğrencileri
     POST /api/etut/kaydet          etüt aç ya da değiştir
     POST /api/etut/sil             etüdü sil
     POST /api/etut/ogrenciler      etüdün öğrenci listesini yaz
     GET  /api/etut/yoklama?id&tarih   o günün yoklaması
     POST /api/etut/yoklama         yoklamayı yaz: geldi (var), gelmedi (yok), izinli
     GET  /api/etut/ogrenci?studentId  öğrencinin etütleri ve yoklamaları (öğrenci, veli, okul)

   Kim ne yapar:
     - "etut.yonet" yetkisi (müdür, ya da rolüyle verilen kişi): etüt açar,
       gününü/saatini/öğretmenini/öğrencilerini değiştirir, her yoklamayı düzeltir.
     - "etut.yoklama" yetkisi: bütün etütlerde yoklama alır (geçmiş günler dahil).
     - Etüdün öğretmeni: kendi etüdünde, yalnızca etüt gününde ve başlangıçtan
       15 dakika önceden itibaren yoklama alır. */

const { bad, ok } = require('../http');
const { GUN_ADLARI, canSeeStudent } = require('../iliskiler');
const { clean, now, uid } = require('../ortak');
const { depo } = require('../veri');
const { okulGerek, yetkiVarMi } = require('../yetki');
const { islemYaz } = require('./islem-kaydi');

const DURUMLAR = ['var', 'yok', 'izinli'];
const DURUM_AD = { var: 'geldi', yok: 'gelmedi (izinsiz)', izinli: 'gelmedi (izinli)' };
const EN_FAZLA_OGRENCI = 300;

const iki = n => (n < 10 ? '0' : '') + n;
function bugun() {
  const d = new Date();
  return d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate());
}
function simdiSaat() {
  const d = new Date();
  return iki(d.getHours()) + ':' + iki(d.getMinutes());
}
/* "2026-09-28" -> 1 (pazartesi) ... 7 (pazar); geçersizse 0. */
function tarihGunu(tarih) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(tarih || ''));
  if (!m) return 0;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (d.getMonth() !== Number(m[2]) - 1) return 0;
  return ((d.getDay() + 6) % 7) + 1;
}
const saatGecerli = s => /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
const dakika = s => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));

const yonetebilir = me => yetkiVarMi(me, 'etut.yonet');
const herYoklama = me => yonetebilir(me) || yetkiVarMi(me, 'etut.yoklama');

/* Bu kişi bu etütte, bu tarihte yoklama alabilir mi? Alamıyorsa nedeni. */
function yoklamaEngeli(me, e, tarih) {
  if (!e) return 'Etüt bulunamadı';
  const gun = tarihGunu(tarih);
  if (!gun) return 'Tarih geçersiz';
  if (tarih > bugun()) return 'İleri bir tarihe yoklama alınmaz';
  if (gun !== e.gun) return 'Bu etüt ' + GUN_ADLARI[e.gun] + ' günleri yapılıyor; seçilen gün ' + GUN_ADLARI[gun] + '.';
  if (herYoklama(me)) return '';
  if (me.role !== 'teacher' || e.ogretmenId !== me.id) return 'Bu etütte yoklama alma yetkin yok';
  if (tarih !== bugun()) return 'Etüdün yoklamasını yalnızca etüt günü alabilirsin; geçmiş günü düzeltmek için etüt sorumlusuna söyle.';
  if (dakika(simdiSaat()) < dakika(e.baslangic) - 15) return 'Yoklama etüt başlamadan en erken 15 dakika önce açılır (' + e.baslangic + ').';
  return '';
}

function etutGorunumu(me, e) {
  return Object.assign({}, e, {
    gunAdi: GUN_ADLARI[e.gun],
    yoklamaAlabilir: herYoklama(me) || (me.role === 'teacher' && e.ogretmenId === me.id)
  });
}

/* Öğretmen olarak seçilebilecekler: okulun onaylı öğretmenleri ve müdürü. */
async function ogretmenAdaylari(okulId) {
  const [ogretmenler, mudurler] = await Promise.all([
    depo.kullanicilar.okulun(okulId, { rol: 'teacher' }), depo.kullanicilar.okulun(okulId, { rol: 'principal' })]);
  return ogretmenler.concat(mudurler).filter(u => u.status === 'approved');
}

/* Etüt gövdesini doğrular: { d } ya da { hata }. */
async function etutGovdesi(me, body) {
  const ad = clean(body.ad, 80);
  if (!ad) return { hata: 'Etüdün adını yaz (ör. Matematik etüdü).' };
  const gun = Number(body.gun);
  if (!Number.isInteger(gun) || gun < 1 || gun > 7) return { hata: 'Günü seç.' };
  const baslangic = clean(body.baslangic, 5), bitis = clean(body.bitis, 5);
  if (!saatGecerli(baslangic) || !saatGecerli(bitis)) return { hata: 'Saatleri SS:DD biçiminde yaz (ör. 15:40).' };
  if (dakika(bitis) <= dakika(baslangic)) return { hata: 'Bitiş saati başlangıçtan sonra olmalı.' };
  if (dakika(bitis) - dakika(baslangic) > 6 * 60) return { hata: 'Bir etüt 6 saatten uzun olamaz.' };
  const yer = clean(body.yer, 60);
  const ogretmenId = clean(body.ogretmenId, 60);
  if (ogretmenId && !(await ogretmenAdaylari(me.schoolId)).some(u => u.id === ogretmenId)) {
    return { hata: 'Seçilen öğretmen bu okulda değil.' };
  }
  return { d: { ad, gun, baslangic, bitis, yer, ogretmenId } };
}

/* Yoklamada gelmeyen ya da izinli sayılan öğrenciye ve velilerine haber. */
async function yoklamaBildir(e, tarih, degisenler) {
  const bildirilecek = degisenler.filter(k => k.durum !== 'var');
  if (!bildirilecek.length) return;
  const veliler = await depo.kullanicilar.veliHaritasi(bildirilecek.map(k => k.ogrenciId));
  const adlar = new Map((await depo.etutler.ogrencileri(e.id)).map(o => [o.id, o.ad]));
  const tarihYazi = tarih.slice(8, 10) + '.' + tarih.slice(5, 7) + '.' + tarih.slice(0, 4);
  const giden = [];
  for (const k of bildirilecek) {
    const metin = 'Etüt: ' + e.ad + ' (' + tarihYazi + ') — ' + DURUM_AD[k.durum];
    giden.push({ kime: k.ogrenciId, metin, baglanti: '#/etutlerim' });
    for (const vid of veliler.get(k.ogrenciId) || []) {
      giden.push({ kime: vid, metin: (adlar.get(k.ogrenciId) || 'Çocuğun') + ' — ' + metin, baglanti: '#/etutlerim' });
    }
  }
  await depo.genel.cokluBildir(giden, { veliye: false });   // veliye kendi metni yukarıda
}

async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;
  if (p !== 'etut') return false;
  if (!need()) return;
  const alt = segs[2] || '';

  /* ---------- öğrencinin etütleri (öğrenci, veli, okul) ---------- */
  if (alt === 'ogrenci' && method === 'GET') {
    const sid = me.role === 'student' ? me.id : clean(q.get('studentId'), 60);
    if (!sid || !await canSeeStudent(me, sid)) return bad(res, 'Bu öğrenciyi görme yetkin yok', 403);
    /* Yalnızca öğrencinin şimdiki okulunun etütleri: nakil gelen öğrencinin
       eski okulundaki yoklamaları yeni okula görünmez. */
    const st = await depo.kullanicilar.bul(sid);
    const okulId = st ? st.schoolId : '';
    const [etutler, yoklamalar] = await Promise.all([
      depo.etutler.ogrencininki(sid), depo.etutler.ogrenciYoklamalari(sid, 60, okulId)]);
    return ok(res, {
      etutler: etutler.map(e => ({ id: e.id, ad: e.ad, gun: e.gun, gunAdi: GUN_ADLARI[e.gun], baslangic: e.baslangic,
        bitis: e.bitis, yer: e.yer, ogretmenAdi: e.ogretmenAdi })),
      yoklamalar: yoklamalar.map(y => ({ etutId: y.etut_id, etutAdi: y.etut_adi, tarih: y.tarih, durum: y.durum }))
    });
  }

  /* Buradan sonrası okul personeli: öğretmen ve müdür. */
  if (me.role !== 'teacher' && me.role !== 'principal') return bad(res, 'Bu bölüm okul personeli içindir', 403);
  if (!await okulGerek(res, me)) return;

  if (!alt && method === 'GET') {
    const liste = herYoklama(me) ? await depo.etutler.okulun(me.schoolId) : await depo.etutler.ogretmeninki(me.id);
    return ok(res, { etutler: liste.map(e => etutGorunumu(me, e)), yonetebilir: yonetebilir(me), herYoklama: herYoklama(me),
      bugun: bugun() });
  }

  if (alt === 'adaylar' && method === 'GET') {
    if (!yonetebilir(me)) return bad(res, 'Etüt düzenleme yetkin yok', 403);
    const [ogretmenler, siniflar, ogrenciler] = await Promise.all([
      ogretmenAdaylari(me.schoolId), depo.siniflar.okulun(me.schoolId),
      depo.kullanicilar.okulun(me.schoolId, { rol: 'student' })]);
    return ok(res, {
      ogretmenler: ogretmenler.map(u => ({ id: u.id, ad: u.fullName })),
      siniflar: siniflar.map(c => ({ id: c.id, ad: c.name })),
      ogrenciler: ogrenciler.filter(u => u.status === 'approved').map(u => ({ id: u.id, ad: u.fullName, sinifId: u.classId || '' }))
    });
  }

  const etutAl = async id => {
    const e = await depo.etutler.bul(clean(id, 60));
    return e && e.schoolId === me.schoolId ? e : null;
  };

  if (alt === 'detay' && method === 'GET') {
    const e = await etutAl(q.get('id'));
    if (!e) return bad(res, 'Etüt bulunamadı', 404);
    if (!yonetebilir(me) && !etutGorunumu(me, e).yoklamaAlabilir) return bad(res, 'Bu etüdü görme yetkin yok', 403);
    return ok(res, { etut: etutGorunumu(me, e), ogrenciler: await depo.etutler.ogrencileri(e.id) });
  }

  if (alt === 'kaydet' && method === 'POST') {
    if (!yonetebilir(me)) return bad(res, 'Etüt düzenleme yetkin yok', 403);
    const g = await etutGovdesi(me, body);
    if (g.hata) return bad(res, g.hata);
    let e;
    if (body.id) {
      const eski = await etutAl(body.id);
      if (!eski) return bad(res, 'Etüt bulunamadı', 404);
      e = await depo.etutler.guncelle(Object.assign({ id: eski.id }, g.d));
      await islemYaz(me, 'etut.degistirildi', e.ad, req);
      if (g.d.ogretmenId && g.d.ogretmenId !== eski.ogretmenId) {
        await depo.genel.bildir(g.d.ogretmenId, '"' + e.ad + '" etüdü sana verildi (' + GUN_ADLARI[e.gun] + ' ' +
          e.baslangic + '–' + e.bitis + ').', '#/etutler');
      }
    } else {
      e = await depo.etutler.ekle(Object.assign({ id: uid('et'), schoolId: me.schoolId, createdAt: now() }, g.d));
      await islemYaz(me, 'etut.acildi', e.ad, req);
      if (g.d.ogretmenId) {
        await depo.genel.bildir(g.d.ogretmenId, '"' + e.ad + '" etüdü sana verildi (' + GUN_ADLARI[e.gun] + ' ' +
          e.baslangic + '–' + e.bitis + ').', '#/etutler');
      }
    }
    return ok(res, { etut: etutGorunumu(me, e), message: 'Etüt kaydedildi.' });
  }

  if (alt === 'sil' && method === 'POST') {
    if (!yonetebilir(me)) return bad(res, 'Etüt düzenleme yetkin yok', 403);
    const e = await etutAl(body.id);
    if (!e) return bad(res, 'Etüt bulunamadı', 404);
    if (body.onay !== true) return bad(res, 'Silmeyi onaylaman gerekiyor.');
    await depo.etutler.sil(e.id);
    await islemYaz(me, 'etut.silindi', e.ad, req);
    return ok(res, { message: '"' + e.ad + '" etüdü silindi; yoklamaları da silindi.' });
  }

  if (alt === 'ogrenciler' && method === 'POST') {
    if (!yonetebilir(me)) return bad(res, 'Etüt düzenleme yetkin yok', 403);
    const e = await etutAl(body.id);
    if (!e) return bad(res, 'Etüt bulunamadı', 404);
    const gelen = [...new Set((Array.isArray(body.ogrenciIdler) ? body.ogrenciIdler : []).map(x => clean(x, 60)).filter(Boolean))];
    if (gelen.length > EN_FAZLA_OGRENCI) return bad(res, 'Bir etüde en fazla ' + EN_FAZLA_OGRENCI + ' öğrenci eklenebilir.');
    const okulOgrencileri = new Set((await depo.kullanicilar.okulun(me.schoolId, { rol: 'student' })).map(u => u.id));
    const yabanci = gelen.filter(id => !okulOgrencileri.has(id));
    if (yabanci.length) return bad(res, 'Listede bu okulda olmayan öğrenci var.');
    await depo.etutler.ogrencileriYaz(e.id, gelen);
    await islemYaz(me, 'etut.ogrenciler', e.ad + ': ' + gelen.length + ' öğrenci', req);
    return ok(res, { ogrenciler: await depo.etutler.ogrencileri(e.id), message: gelen.length + ' öğrenci kaydedildi.' });
  }

  if (alt === 'yoklama' && method === 'GET') {
    const e = await etutAl(q.get('id'));
    if (!e) return bad(res, 'Etüt bulunamadı', 404);
    if (!etutGorunumu(me, e).yoklamaAlabilir) return bad(res, 'Bu etütte yoklama alma yetkin yok', 403);
    const tarih = clean(q.get('tarih'), 10) || bugun();
    if (!tarihGunu(tarih)) return bad(res, 'Tarih geçersiz');
    const [ogrenciler, durumlar] = await Promise.all([depo.etutler.ogrencileri(e.id), depo.etutler.yoklamasi(e.id, tarih)]);
    return ok(res, {
      etut: etutGorunumu(me, e), tarih, engel: yoklamaEngeli(me, e, tarih),
      ogrenciler: ogrenciler.map(o => Object.assign(o, { durum: durumlar.get(o.id) || '' }))
    });
  }

  if (alt === 'yoklama' && method === 'POST') {
    const e = await etutAl(body.id);
    const tarih = clean(body.tarih, 10);
    const engel = yoklamaEngeli(me, e, tarih);
    if (engel) return bad(res, engel, e ? 400 : 404);
    const liste = new Set((await depo.etutler.ogrencileri(e.id)).map(o => o.id));
    const kayitlar = [];
    for (const x of Array.isArray(body.kayitlar) ? body.kayitlar.slice(0, EN_FAZLA_OGRENCI) : []) {
      const ogrenciId = clean(x && x.ogrenciId, 60), durum = clean(x && x.durum, 10);
      if (!liste.has(ogrenciId)) return bad(res, 'Listede bu etüdün öğrencisi olmayan biri var.');
      if (DURUMLAR.indexOf(durum) < 0) return bad(res, 'Geçersiz yoklama durumu');
      kayitlar.push({ ogrenciId, durum });
    }
    if (!kayitlar.length) return bad(res, 'Yoklamada kimse işaretlenmedi.');
    const degisen = await depo.etutler.yoklamaYaz(e.id, tarih, kayitlar, me.id);
    await yoklamaBildir(e, tarih, degisen);
    if (degisen.length) await islemYaz(me, 'etut.yoklama', e.ad + ' ' + tarih + ': ' + degisen.length + ' değişiklik', req);
    return ok(res, { degisen: degisen.length, message: degisen.length ? 'Yoklama kaydedildi.' : 'Değişiklik yok.' });
  }

  return false;
}

module.exports = { uclar, tarihGunu };
