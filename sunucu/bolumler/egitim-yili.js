'use strict';
/* Eğitim yılı (/api/egitim-yili).
   Müdür yıl açar; kayıtlar yıl damgası taşır; geçmiş yıla salt okunur bakılır. */

const { bad, ok } = require('../http');
const { clean, now, uid } = require('../ortak');
const { depo } = require('../veri');
const { okulGerek, yetkiVarMi } = require('../yetki');
const { canSeeStudent } = require('../iliskiler');
const { islemYaz } = require('./islem-kaydi');

/* ============ eğitim yılı ============

   Okul her yıl sıfırdan başlıyor: yeni sınıflar, yeni program, yeni ödevler.
   Ama eski yılın kaydı kaybolmamalı — veli geçen yılın devamsızlığına,
   müdür geçen yılın programına bakabilmeli.

   Çözüm: kayıtlar açıldıkları yıla damgalanıyor. Yılı olmayan eski
   kayıtlar okulun ilk yılına aitmiş gibi davranıyor.

   Okul: her kayıt bir okula aittir. Başka okuldan gelen (nakil) öğrencinin
   eski okulundaki kayıtları yeni okulun hiçbir yılında görünmez. Öğrencinin
   (ve velisinin) yıl listesinde eski okulun yılları da vardır:
   "2025-2026 · Eski Okul · 6-A" — onları seçince eski kayıtlar görünür,
   salt okunur. */

/* Okulun yılları, yeniden eskiye. */
const okulYillari = schoolId => depo.okullar.yillari(schoolId);

/* Kullanıcının yıl bilgisi: bir istekte bir kez sorgulanır ve kullanıcı
   nesnesinde saklanır (kullanıcı nesnesi her istekte yeniden okunur). */
async function yilBilgisi(me) {
  if (me._yilBilgisi) return me._yilBilgisi;
  let okulunki = me.schoolId ? await okulYillari(me.schoolId) : [];
  /* Öğrencinin geçmiş okul dönemleri (nakil) okulun yıllarının arkasına. */
  const gecmis = me.role === 'student' ? (await depo.ogrenciGecmisi.listesi(me.id)).map(g => ({
    id: g.id, ad: [g.yilAdi, g.okulAdi, g.sinifAdi].filter(Boolean).join(' · '), okulId: g.okulId,
    yilId: g.yilId, gecmis: true, aktif: false, bas: '', bit: ''
  })) : [];
  /* Yeni okulda yıl tanımlı değilse "şimdiki okul" tek seçenek olur ki
     öğrenci geçmiş okuldan geri dönebilsin. */
  if (!okulunki.length && gecmis.length && me.schoolId) {
    okulunki = [{ id: 'simdiki', ad: 'Şimdiki okul', aktif: true, simdiki: true, bas: '', bit: '' }];
  }
  /* Eski okulun yılsız kayıtları o okulun en eski dönemine sayılır. */
  const enEskiGecmis = {};
  for (const g of gecmis) enEskiGecmis[g.okulId] = g.id;
  const liste = okulunki.concat(gecmis);
  const aktif = okulunki.find(y => y.aktif) || okulunki[0] || null;
  const secili = (me.seciliGecmis && gecmis.find(y => y.id === me.seciliGecmis)) ||
    (me.seciliYil && okulunki.find(y => y.id === me.seciliYil)) || null;
  me._yilBilgisi = {
    liste,
    aktif,
    bakilan: secili || aktif || null,
    enEskiId: okulunki.length ? okulunki[okulunki.length - 1].id : null,
    enEskiGecmis
  };
  return me._yilBilgisi;
}

/* Bir kaydın okulu (kayıtların çoğu schoolId taşır). */
const kayitOkulu = k => (k && (k.schoolId || k.okulId)) || '';

/* Veli çocuğunun kayıtlarına çocuğun gözünden bakar: çocuğun okulu ve geçmiş
   okulları, velinin seçtiği yıl. Öğrenci ve öğrencinin okulundaki personel
   kendileri olarak bakar (başka okuldaki öğretmen ancak velisiyse görebilir). */
function bakisKisisi(bakan, ogrenci) {
  if (!bakan || !ogrenci || bakan.id === ogrenci.id || bakan.role === 'admin') return bakan;
  if ((bakan.role === 'teacher' || bakan.role === 'principal') && bakan.schoolId === ogrenci.schoolId) return bakan;
  return Object.assign({}, ogrenci, { seciliYil: bakan.seciliYil, seciliGecmis: bakan.seciliGecmis, _yilBilgisi: null });
}

async function aktifYil(schoolId) {
  const liste = await okulYillari(schoolId);
  return liste.find(y => y.aktif) || liste[0] || null;
}

/* Kullanıcının şu an baktığı yıl. Seçim yapmadıysa aktif yıl. */
async function bakilanYil(me) {
  if (!me || !me.schoolId) return null;
  return (await yilBilgisi(me)).bakilan;
}

/* Kayıt bu yıla ait mi? Damgasız kayıtlar en eski yıla sayılır. Kaydın
   okulu biliniyorsa bakılan dönemin okulu olmalı (okulId: kişinin okulu). */
function yilaAitMi(kayit, yil, enEskiId, okulId, enEskiGecmis) {
  const kOkul = kayitOkulu(kayit);
  const hedefOkul = yil ? (yil.okulId || okulId) : okulId;
  if (kOkul && hedefOkul && kOkul !== hedefOkul) return false;
  if (!yil || yil.simdiki) return true;        /* okulda yıl tanımlı değilse hepsi */
  const k = kayit && kayit.yilId;
  if (yil.gecmis) {
    if (!k) return !!enEskiGecmis && enEskiGecmis[yil.okulId] === yil.id;
    return !yil.yilId || k === yil.yilId;
  }
  if (!k) return yil.id === enEskiId;
  return k === yil.id;
}

/* Bir listeyi bakılan yıla (ve okula) göre süzer. */
async function yilSuz(me, liste) {
  if (!me || (!me.schoolId && me.role !== 'student')) return liste;
  const b = await yilBilgisi(me);
  return liste.filter(k => yilaAitMi(k, b.bakilan, b.enEskiId, me.schoolId, b.enEskiGecmis));
}

/* Yeni kayda basılacak yıl damgası. */
async function yilDamgasi(me) {
  const y = await bakilanYil(me);
  return y ? y.id : '';
}

/* Geçmiş yıla (ya da geçmiş okula) bakılırken yazma işlemleri kapalı —
   arşiv değiştirilmemeli. */
async function arsivdeMi(me) {
  if (!me || (!me.schoolId && me.role !== 'student')) return false;
  const b = await yilBilgisi(me);
  return !!(b.bakilan && (b.bakilan.gecmis || (b.aktif && b.bakilan.id !== b.aktif.id)));
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, p, segs, method, need } = k;

  if (p === 'egitim-yili') {
    if (!need()) return;
    const alt = segs[2] || '';

    /* Veli çocuğunun yıllarına bakar (?ogrenci= ya da gövdede ogrenci). */
    const ogrenciId = clean(k.q.get('ogrenci') || body.ogrenci, 60);
    let bakis = me;
    if (ogrenciId && me.role !== 'student') {
      if (!await canSeeStudent(me, ogrenciId)) return bad(res, 'Bu öğrenciyi görme yetkin yok', 403);
      bakis = bakisKisisi(me, await depo.kullanicilar.bul(ogrenciId));
    } else if (!await okulGerek(res, me)) return;

    if (!alt && method === 'GET') {
      const b = await yilBilgisi(bakis);
      return ok(res, {
        yillar: b.liste.map(y => ({
          id: y.id, ad: y.ad, bas: y.bas, bit: y.bit, gecmis: !!y.gecmis,
          aktif: !!(b.aktif && y.id === b.aktif.id),
          bakilan: !!(b.bakilan && y.id === b.bakilan.id)
        })),
        yonetebilir: bakis === me && yetkiVarMi(me, 'yil.yonet'),
        arsiv: await arsivdeMi(bakis)
      });
    }

    if (alt === 'ekle' && method === 'POST') {
      if (!yetkiVarMi(me, 'yil.yonet')) return bad(res, 'Eğitim yılı açma yetkin yok', 403);
      const ad = clean(body.ad, 20);
      if (!/^\d{4}-\d{4}$/.test(ad)) {
        return bad(res, 'Yıl adını 2026-2027 biçiminde yaz');
      }
      const [b, t] = ad.split('-').map(Number);
      if (t !== b + 1) return bad(res, 'İkinci yıl birincinin bir fazlası olmalı');
      if ((await okulYillari(me.schoolId)).some(y => y.ad === ad)) {
        return bad(res, 'Bu eğitim yılı zaten var');
      }

      /* Tek yıl aktif olabilir: depo diğerlerini aynı işlemde pasife çeker. */
      const yeni = {
        id: uid('y'), schoolId: me.schoolId, ad: ad,
        bas: b + '-09-01', bit: t + '-06-30',
        aktif: body.aktifYap !== false, createdAt: now()
      };
      await depo.okullar.yilEkle(yeni);
      await depo.kullanicilar.guncelle(me.id, { seciliYil: yeni.id });
      await islemYaz(me, 'yil.acildi', ad, req);
      return ok(res, { yil: yeni, message: ad + ' eğitim yılı açıldı.' });
    }

    /* Hangi yıla bakılacağını seç — kişiye özel, veriyi değiştirmez. */
    if (alt === 'bak' && method === 'POST') {
      /* Seçilebilenler: okulun yılları ve (öğrencide) geçmiş okul dönemleri. */
      const y = (await yilBilgisi(bakis)).liste.find(x => x.id === clean(body.id, 60));
      if (!y) return bad(res, 'Yıl bulunamadı', 404);
      const d = y.gecmis ? { seciliGecmis: y.id } : y.simdiki ? { seciliGecmis: '' } : { seciliYil: y.id, seciliGecmis: '' };
      await depo.kullanicilar.guncelle(me.id, d);
      Object.assign(me, d, { _yilBilgisi: null });
      if (bakis !== me) Object.assign(bakis, d, { _yilBilgisi: null });
      return ok(res, { yil: { id: y.id, ad: y.ad }, arsiv: await arsivdeMi(bakis), message: y.ad + ' dönemine bakıyorsun.' });
    }

    /* Aktif yılı değiştir — yeni kayıtlar bu yıla yazılır. */
    if (alt === 'aktif-yap' && method === 'POST') {
      if (!yetkiVarMi(me, 'yil.yonet')) return bad(res, 'Yetkin yok', 403);
      const y = await depo.okullar.yilBul(clean(body.id, 60));
      if (!y || y.schoolId !== me.schoolId) return bad(res, 'Yıl bulunamadı', 404);
      await depo.okullar.yilAktifYap(me.schoolId, y.id);
      await depo.kullanicilar.guncelle(me.id, { seciliYil: y.id });
      await islemYaz(me, 'yil.aktif-degisti', y.ad, req);
      return ok(res, { message: y.ad + ' artık aktif eğitim yılı.' });
    }
  }

  return false;
}

module.exports = {
  okulYillari,
  aktifYil,
  bakilanYil,
  yilaAitMi,
  yilSuz,
  yilBilgisi,
  bakisKisisi,
  yilDamgasi,
  arsivdeMi,
  uclar
};
