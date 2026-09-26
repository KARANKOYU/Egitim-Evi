'use strict';
/* Anketler (/api/anketler).
   Toplu mesaj yetkisi olan kişi (müdür ya da yetki verilmiş öğretmen) okula,
   rol grubuna ya da sınıflara tek soruluk anket açar. Hedefteki herkes
   bitişe kadar bir oy verir, fikrini değiştirebilir.

   Kurallar sunucuda ve veritabanında: hedef listesi açılışta çözülür, oy
   yalnızca açık ankette, listedeki kişi için ve o anketin seçeneğine yazılır.
   Sonuçları anketi açan ve okulun müdürü her an görür; oy verenler anket
   bitince görür. Gizli ankette kimin neyi seçtiği hiç kimseye gönderilmez. */

const { hizSinir } = require('../guvenlik');
const { bad, ok } = require('../http');
const { saatDuzelt } = require('../iliskiler');
const { clean, uid } = require('../ortak');
const { depo, topluBildir } = require('../veri');
const { okulGerek, yetkiVarMi } = require('../yetki');
const { mesajAlicilariCoz } = require('./mesaj');

const SECENEK_EN_AZ = 2;
const SECENEK_EN_FAZLA = 10;
const EN_UZUN_GUN = 90;

/* Anketi yönetebilir mi (sonuç, kapatma, silme): açan kişi ya da okulun müdürü. */
function yonetebilir(me, a) {
  if (!a || a.okul_id !== me.schoolId) return false;
  return a.olusturan_id === me.id || me.role === 'principal';
}

/* Listelerde dönen ortak görünüm. */
function gorunum(a) {
  return {
    id: a.id, soru: a.soru, aciklama: a.aciklama, hedefOzet: a.hedef_ozet, gizli: a.gizli,
    bitis: a.bitis, acik: a.acik, kapandi: a.kapandi, olusturma: a.olusturma,
    olusturan: a.olusturan_adi || 'Silinmiş kullanıcı',
    hedefSayisi: a.hedef_sayisi, oySayisi: a.oy_sayisi,
    secenekler: a.secenekler || []
  };
}

async function uclar(k) {
  if (k.p === 'anketler') return anketUclari(k);
  return false;
}

async function anketUclari(k) {
  const { res, me, body, q, segs, method, need } = k;
  if (!need(['student', 'parent', 'teacher', 'principal'])) return;
  const alt = segs[2] || '';

  /* Bana gelenler ve (yetkim varsa) yönettiklerim. Veli iki okulda çocuğu
     olsa da iki okulun anketini görür: liste hedef tablosundan gelir. */
  if (!alt && method === 'GET') {
    const gelen = (await depo.anketler.kisiyeGelenler(me.id)).map(a => {
      const g = gorunum(a);
      g.benimOyum = a.benim_oyum || '';
      return g;
    });
    /* Bitmiş anketin sonucu oy verenlere de açılır. */
    const biten = gelen.filter(g => !g.acik);
    const sayim = await depo.anketler.sayimlar(biten.map(g => g.id));
    for (const g of biten) g.sayimlar = sayim.get(g.id);

    const olusturabilir = !!me.schoolId && yetkiVarMi(me, 'mesaj.toplu');
    const yonetilen = me.schoolId && (olusturabilir || me.role === 'principal')
      ? (await depo.anketler.yonetilenler(me.id, me.schoolId, me.role === 'principal')).map(gorunum)
      : [];
    return ok(res, { gelen, yonetilen, olusturabilir });
  }

  /* Yeni anket */
  if (!alt && method === 'POST') {
    if (!await okulGerek(res, me)) return;
    if (!yetkiVarMi(me, 'mesaj.toplu')) return bad(res, 'Anket açma yetkin yok', 403);
    if (!hizSinir('anket:' + me.id, 20, 60 * 60 * 1000)) return bad(res, 'Bu saat içinde çok fazla anket açtın.', 429);

    const soru = clean(body.soru, 200);
    if (!soru) return bad(res, 'Soruyu yaz');
    const aciklama = clean(body.aciklama, 1000);

    const gorulen = new Set();
    const secenekler = [];
    for (const s of Array.isArray(body.secenekler) ? body.secenekler.slice(0, 30) : []) {
      const metin = clean(s, 120);
      const anahtar = metin.toLocaleLowerCase('tr');
      if (!metin || gorulen.has(anahtar)) continue;
      gorulen.add(anahtar);
      secenekler.push({ id: uid('as'), metin });
    }
    if (secenekler.length < SECENEK_EN_AZ) return bad(res, 'En az iki farklı seçenek yaz');
    if (secenekler.length > SECENEK_EN_FAZLA) return bad(res, 'En fazla ' + SECENEK_EN_FAZLA + ' seçenek olabilir');

    /* Bitiş: gün + saat (sunucu saatiyle, ödevlerdeki gibi). */
    const gun = clean(body.bitisGun, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(gun)) return bad(res, 'Bitiş tarihini seç');
    const saat = saatDuzelt(clean(body.bitisSaat, 10)) || '23:59';
    const bitis = new Date(gun + 'T' + saat + ':00');
    if (isNaN(bitis.getTime())) return bad(res, 'Bitiş tarihi geçersiz');
    if (bitis.getTime() <= Date.now() + 5 * 60 * 1000) return bad(res, 'Bitiş en az birkaç dakika sonrası olmalı');
    if (bitis.getTime() > Date.now() + EN_UZUN_GUN * 86400000) return bad(res, 'Anket en fazla ' + EN_UZUN_GUN + ' gün açık kalabilir');

    /* Hedef: duyurudaki gibi okul, rol ya da sınıf; kişi seçimi yok. */
    const hedef = body.hedef || {};
    if (['okul', 'rol', 'sinif'].indexOf(clean(hedef.tur, 20)) < 0) return bad(res, 'Anketin kime gideceğini seç');
    const cozum = await mesajAlicilariCoz(me, hedef, 'duyuru');
    if (cozum.hata) return bad(res, cozum.hata);
    const hedefler = [...new Set(cozum.alicilar.map(a => a.id))].filter(id => id !== me.id);
    if (!hedefler.length) return bad(res, 'Seçtiğin grupta kimse yok');

    const a = {
      id: uid('an'), okulId: me.schoolId, olusturanId: me.id, soru, aciklama,
      hedefOzet: cozum.ozet, gizli: body.gizli === true, bitis: bitis.toISOString(), secenekler, hedefler
    };
    await depo.anketler.ekle(a);
    await topluBildir(hedefler, 'Anket: ' + soru, '#/anketler');
    return ok(res, { id: a.id, hedefSayisi: hedefler.length,
      message: 'Anket açıldı — ' + hedefler.length + ' kişiye ulaştı.' });
  }

  /* Oy ver / değiştir. Anket açık değilse, kişi hedefte değilse ya da seçenek
     bu ankete ait değilse veritabanı yazmaz; hangisi olduğu ayrıca söylenir. */
  if (alt === 'oy' && method === 'POST') {
    if (!hizSinir('anketOy:' + me.id, 120, 60 * 1000)) return bad(res, 'Çok hızlı. Biraz bekle.', 429);
    const a = await depo.anketler.bul(clean(body.id, 60));
    if (!a) return bad(res, 'Anket bulunamadı', 404);
    const secenekId = clean(body.secenekId, 60);
    if (!secenekId) {
      if (!a.acik) return bad(res, 'Bu anket kapandı.');
      await depo.anketler.oyGeriAl(a.id, me.id);
      return ok(res, { message: 'Oyun geri alındı.' });
    }
    const n = await depo.anketler.oyVer(a.id, me.id, secenekId);
    if (n) return ok(res, { message: 'Oyun kaydedildi.' });
    if (!a.acik) return bad(res, 'Bu anket kapandı.');
    if (!(a.secenekler || []).some(s => s.id === secenekId)) return bad(res, 'Geçersiz seçenek');
    return bad(res, 'Bu ankete oy veremezsin', 403);
  }

  if ((alt === 'kapat' || alt === 'sil') && method === 'POST') {
    const a = await depo.anketler.bul(clean(body.id, 60));
    if (!a) return bad(res, 'Anket bulunamadı', 404);
    if (!yonetebilir(me, a)) return bad(res, 'Bu anketi yönetme yetkin yok', 403);
    if (alt === 'sil') {
      await depo.anketler.sil(a.id);
      return ok(res, { message: 'Anket silindi.' });
    }
    await depo.anketler.kapat(a.id);
    return ok(res, { message: 'Anket kapatıldı; artık oy verilemez.' });
  }

  /* Sonuç: yöneten her an, hedefteki kişi anket bitince görür. */
  if (alt === 'sonuc' && method === 'GET') {
    const a = await depo.anketler.bul(clean(q.get('id'), 60));
    if (!a) return bad(res, 'Anket bulunamadı', 404);
    const yonetici = yonetebilir(me, a);
    if (!yonetici) {
      if (!await depo.anketler.hedefteMi(a.id, me.id)) return bad(res, 'Bu anketi görme yetkin yok', 403);
      if (a.acik) return bad(res, 'Sonuç anket bitince açılır.', 403);
      return ok(res, { anket: gorunum(a), sayimlar: (await depo.anketler.sayimlar([a.id])).get(a.id) });
    }
    /* Gizli ankette sayılar anket bitince açılır ve oy zamanı hiç gönderilmez:
       açıkken sık sık bakıp yeni oy verenle artan seçeneği eşleştirmek
       kimin neyi seçtiğini ele verirdi. */
    const gizliAcik = a.gizli && a.acik;
    const katilim = (await depo.anketler.katilim(a.id)).map(r => ({
      ad: r.ad || 'Silinmiş', rol: r.rol || '', sinif: r.sinif || '', cocuklar: r.cocuklar || [],
      oyVerdi: !!r.secenek_id, tarih: a.gizli ? null : (r.tarih || null),
      secim: a.gizli ? '' : (r.secenek_id || '')
    }));
    return ok(res, { anket: gorunum(a), sayimlar: gizliAcik ? null : (await depo.anketler.sayimlar([a.id])).get(a.id),
      katilim, yonetici: true });
  }

  return false;
}

module.exports = { uclar };
