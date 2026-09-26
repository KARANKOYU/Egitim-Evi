'use strict';
/* Okulun özellikleri (/api/ozellikler).

   Müdür okulunda kullanmadığı bölümleri kapatır (ödevler, sınavlar,
   devamsızlık, etüt, servis, yemek listesi, kulüpler, anketler). Kapalı
   bölüm menülerden kalkar; sunucu da o bölümün isteklerini reddeder
   (api.js, her bölüme girmeden önce). Kayıtlar silinmez. */

const { bad, ok, sendJSON } = require('../http');
const { clean } = require('../ortak');
const { depo } = require('../veri');
const { islemYaz } = require('./islem-kaydi');

/* Yolun ilk parçası -> özellik. Burada olmayan yollar (ilerleyiş, takvim,
   ana sayfa) karışıktır: kendi içinde kapalı bölümü atlar. */
const YOL = {
  assignments: 'odev', 'odev-dosya': 'odev',
  exams: 'sinav', examgroups: 'sinav',
  devamsizlik: 'devamsizlik',
  etut: 'etut',
  servis: 'servis',
  yemek: 'yemek',
  kulupler: 'kulup',
  anketler: 'anket'
};

/* İsteğin baktığı okul: veli çocuğunun okulunun kuralına tabidir (çocuk
   parametresi varsa), öteki herkes kendi okulunun. */
async function bakilanOkul(me, q, body) {
  const hedef = clean((q && (q.get('studentId') || q.get('ogrenci'))) || (body && (body.studentId || body.ogrenciId)), 60);
  if (hedef && me.role !== 'student') {
    const st = await depo.kullanicilar.bul(hedef);
    if (st && st.role === 'student') return st.schoolId || '';
  }
  return me.schoolId || '';
}

/* Kapalıysa 403 yazar ve true döner. */
async function kapaliysaReddet(res, me, p, q, body) {
  const oz = YOL[p];
  if (!oz || !me || me.role === 'admin') return false;
  const okulId = await bakilanOkul(me, q, body);
  if (!depo.ozellikler.kapaliMi(okulId, oz)) return false;
  const ad = (depo.ozellikler.OZELLIKLER.find(o => o.k === oz) || {}).ad || 'Bu bölüm';
  sendJSON(res, 403, { error: ad + ' bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir.', ozellikKapali: oz });
  return true;
}

/* Menü için: kişinin görmeyeceği özellikler. Veli için çocuklarının
   okullarının HEPSİNDE kapalı olanlar (bir çocuğun okulunda açıksa görünür). */
function kullanicininKapalilari(u, cocuklar) {
  if (!u) return [];
  const veliMi = u.role === 'parent' || (!u.role && cocuklar && cocuklar.length);
  if (veliMi && cocuklar && cocuklar.length) {
    const okullar = [...new Set(cocuklar.map(c => c.schoolId).filter(Boolean))];
    if (!okullar.length) return [];
    return depo.ozellikler.ANAHTARLAR.filter(k => okullar.every(o => depo.ozellikler.kapaliMi(o, k)));
  }
  return depo.ozellikler.kapalilar(u.schoolId);
}

async function uclar(k) {
  const { req, res, me, body, p, method, need } = k;
  if (p !== 'ozellikler') return false;
  if (!need(['principal'])) return;
  if (!me.schoolId) return bad(res, 'Okul bulunamadı', 404);

  if (method === 'GET') {
    const kapali = depo.ozellikler.kapalilar(me.schoolId);
    return ok(res, { ozellikler: depo.ozellikler.OZELLIKLER.map(o => Object.assign({ acik: kapali.indexOf(o.k) < 0 }, o)) });
  }

  if (method === 'POST') {
    const gelen = Array.isArray(body.kapali) ? body.kapali.map(x => clean(x, 20)) : null;
    if (!gelen) return bad(res, 'Kapalı özellik listesi gerekli');
    const bilinmeyen = gelen.filter(x => depo.ozellikler.ANAHTARLAR.indexOf(x) < 0);
    if (bilinmeyen.length) return bad(res, 'Bilinmeyen özellik: ' + bilinmeyen.join(', '));
    const once = depo.ozellikler.kapalilar(me.schoolId);
    const kapali = await depo.ozellikler.yaz(me.schoolId, gelen, me.id);
    const ad = x => depo.ozellikler.OZELLIKLER.find(o => o.k === x).ad;
    const kapanan = kapali.filter(x => once.indexOf(x) < 0).map(ad);
    const acilan = once.filter(x => kapali.indexOf(x) < 0).map(ad);
    if (kapanan.length || acilan.length) {
      await islemYaz(me, 'okul.ozellik', [kapanan.length ? 'kapandı: ' + kapanan.join(', ') : '',
        acilan.length ? 'açıldı: ' + acilan.join(', ') : ''].filter(Boolean).join('; '), req);
    }
    return ok(res, { kapali, message: 'Kaydedildi.' + (kapanan.length ? ' Kapanan bölümler okulda kimseye görünmez; kayıtları silinmedi.' : '') });
  }
  return bad(res, 'Böyle bir adres yok', 404);
}

module.exports = { YOL, bakilanOkul, kapaliysaReddet, kullanicininKapalilari, uclar };
