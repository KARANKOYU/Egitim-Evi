'use strict';
/* Mesajlar ve duyurular (/api/mesajlar).
   Öğrenciye giden mesaj velisine de gider; öğrenci öğrenciye yazamaz. */

const { hizSinir } = require('../guvenlik');
const { bad, ok } = require('../http');
const { branchOf, sinifOgrencileri, teachersOfStudent } = require('../iliskiler');
const { clean, now, uid } = require('../ortak');
const { depo, topluBildir, islem } = require('../veri');
const { ekleriDogrula, ekleriBagla, hedefinEkleri } = require('./ekler');
const { okulGerek, yetkiVarMi } = require('../yetki');

/* ============ mesajlaşma ve duyurular ============

   Tek tablo iki iş görüyor:
     duyuru — müdür/öğretmen yazar, hedef gruba düşer, cevaplanmaz
     mesaj  — kişiye yazılır, alıcının izin ayarına takılabilir

   Öğrenciye giden her şeyin bir kopyası velisine de düşer; veli
   çocuğuna ne söylendiğini görebilmeli. */

const MESAJ_KONU_SINIR = 120;
const MESAJ_GOVDE_SINIR = 4000;
const MESAJ_SAATLIK_SINIR = 30;
const KIMDEN = ['herkes', 'personel', 'kapali'];

/* Öğrencinin onaylı velileri. */
const velileriBul = ogrenciId => depo.kullanicilar.velileri(ogrenciId);

function mesajKimden(u) {
  const k = u.mesajAyar && u.mesajAyar.kimden;
  return KIMDEN.indexOf(k) >= 0 ? k : 'herkes';
}

/* Gönderen bu kişiye yazabilir mi? engelli: alıcının engel listesi.
   Duyurular ayarları aşar: kar tatili duyurusu herkese ulaşmalı. */
function mesajGidebilirMi(gonderen, alici, tur, engelli) {
  if (!alici || alici.status !== 'approved') return false;
  if (alici.id === gonderen.id) return false;
  if (tur === 'duyuru') return true;

  if ((engelli || []).indexOf(gonderen.id) >= 0) return false;
  const kimden = mesajKimden(alici);
  if (kimden === 'kapali') return false;
  if (kimden === 'personel' &&
      gonderen.role !== 'teacher' && gonderen.role !== 'principal') return false;
  return true;
}

/* Kişi mesaj kutusunda kimleri görebilir / kime yazabilir.
   Öğrenci ve veli yalnızca ilgili öğretmenlere ve müdüre yazabilir;
   böylece okul içi rehber listesi herkese açılmıyor. */
async function mesajYazilabilirler(me) {
  const okul = (await depo.kullanicilar.okulun(me.schoolId, { durum: 'approved' }))
    .filter(u => u.id !== me.id);

  if (me.role === 'principal' || me.role === 'teacher') return okul;

  let cocuklar = [];
  if (me.role === 'student') cocuklar = [me.id];
  else if (me.role === 'parent') cocuklar = await depo.kullanicilar.cocukIdleri(me.id);
  else return [];

  const ogretmenler = new Set();
  for (const c of cocuklar) {
    for (const t of await teachersOfStudent(c)) ogretmenler.add(t.id);
  }
  return okul.filter(u => u.role === 'principal' || ogretmenler.has(u.id));
}

const ROL_AD = { student: 'Öğrenciler', parent: 'Veliler', teacher: 'Öğretmenler', principal: 'Yöneticiler' };

/* Hedef tanımını gerçek alıcı listesine çevirir. */
async function mesajAlicilariCoz(me, hedef, tur) {
  const secilen = new Map();   // id -> kullanıcı (aynı kişi iki kez eklenmesin)
  let ozet = '';

  const t = clean(hedef && hedef.tur, 20);

  if (t === 'okul') {
    if (!yetkiVarMi(me, 'mesaj.herkese')) return { hata: 'Tüm okula gönderme yetkin yok' };
    for (const u of await depo.kullanicilar.okulun(me.schoolId, { durum: 'approved' })) secilen.set(u.id, u);
    ozet = 'Tüm okul';

  } else if (t === 'rol') {
    if (!yetkiVarMi(me, 'mesaj.toplu')) return { hata: 'Toplu gönderme yetkin yok' };
    const roller = (Array.isArray(hedef.roller) ? hedef.roller : [])
      .map(r => clean(r, 20))
      .filter(r => ROL_AD[r]);
    if (!roller.length) return { hata: 'En az bir rol seç' };
    for (const u of await depo.kullanicilar.okulun(me.schoolId, { durum: 'approved', roller })) secilen.set(u.id, u);
    ozet = roller.map(r => ROL_AD[r]).join(', ');

  } else if (t === 'sinif') {
    if (!yetkiVarMi(me, 'mesaj.toplu')) return { hata: 'Toplu gönderme yetkin yok' };
    const idler = (Array.isArray(hedef.siniflar) ? hedef.siniflar : [])
      .map(x => clean(x, 60)).slice(0, 100);
    if (!idler.length) return { hata: 'En az bir sınıf seç' };
    const adlar = [];
    for (const cid of idler) {
      const c = await depo.siniflar.bul(cid);
      if (!c || c.schoolId !== me.schoolId) continue;
      adlar.push(c.name);
      for (const o of await sinifOgrencileri(cid)) secilen.set(o.id, o);
    }
    if (!adlar.length) return { hata: 'Sınıf bulunamadı' };
    ozet = adlar.join(', ');

  } else if (t === 'kisi') {
    const izinli = new Map((await mesajYazilabilirler(me)).map(u => [u.id, u]));
    const idler = (Array.isArray(hedef.kisiler) ? hedef.kisiler : [])
      .map(x => clean(x, 60));
    if (!idler.length) return { hata: 'En az bir kişi seç' };
    for (const id of idler) if (izinli.has(id)) secilen.set(id, izinli.get(id));
    if (!secilen.size) return { hata: 'Seçtiğin kişilere yazma yetkin yok' };
    const liste = Array.from(secilen.values());
    ozet = liste.length <= 3 ? liste.map(u => u.fullName).join(', ') : liste.length + ' kişi';

  } else {
    return { hata: 'Geçersiz hedef' };
  }

  /* İzin ayarına takılanları ele (engel listeleri tek sorguda). */
  const hepsi = Array.from(secilen.values());
  const engeller = tur === 'duyuru' ? new Map() : await depo.kullanicilar.engelHaritasi(hepsi.map(u => u.id));
  const gecenler = hepsi.filter(u => mesajGidebilirMi(me, u, tur, engeller.get(u.id)));
  const elenen = hepsi.length - gecenler.length;

  /* Öğrenciye giden her şey velisine de gitsin. */
  const alicilar = gecenler.map(u => ({ id: u.id, ogrenciId: '' }));
  const ogrenciler = gecenler.filter(u => u.role === 'student');
  const veliler = await depo.kullanicilar.veliHaritasi(ogrenciler.map(u => u.id));
  for (const u of ogrenciler) {
    for (const vid of veliler.get(u.id) || []) alicilar.push({ id: vid, ogrenciId: u.id });
  }

  return { alicilar, ozet, elenen };
}

/* Okundu bilgisini kim görür: gönderen; duyuruysa okulun müdürü de. */
function okumaGorebilir(me, m) {
  if (m.gonderenId === me.id) return true;
  return m.tur === 'duyuru' && me.role === 'principal' && m.schoolId === me.schoolId;
}

/* Tam mesaj nesnesinden (depo.mesajlar.bul) özet. */
function mesajOzeti(m, benimId) {
  const benim = m._alicilar.filter(a => a.id === benimId);
  return {
    id: m.id,
    tur: m.tur,
    konu: m.konu,
    onizleme: String(m.govde || '').slice(0, 140),
    gonderenId: m.gonderenId,
    gonderen: m._gonderenAdi || 'Silinmiş kullanıcı',
    gonderenRol: m._gonderenRol,
    tarih: m.tarih,
    duzenlenme: m.duzenlenme,
    hedefOzet: m.hedefOzet,
    aliciSayisi: m._alicilar.length,
    okundu: m.okuyanlar.indexOf(benimId) >= 0,
    cocukIcin: benim.map(a => a.ogrenciAdi).filter(Boolean)
  };
}

/* Kutu listesinin hafif satırından (depo.mesajlar.kutuOzeti) özet.
   Okundu sayıları yalnızca gönderilenler kutusunda gider: alıcı, velilerin
   ya da başkalarının okuyup okumadığını bu sayılardan çıkaramasın. */
function kutuSatiri(r, giden) {
  return {
    id: r.id,
    tur: r.tur,
    konu: r.konu,
    onizleme: String(r.govde || '').slice(0, 140),
    gonderenId: r.gonderen_id || '',
    gonderen: r.gonderen_adi || 'Silinmiş kullanıcı',
    gonderenRol: r.gonderen_rol || '',
    tarih: r.tarih,
    duzenlenme: r.duzenlenme || null,
    hedefOzet: r.hedef_ozet,
    aliciSayisi: r.alici_sayisi,
    kisiSayisi: giden ? r.kisi_sayisi : undefined,
    okuyanSayisi: giden ? r.okuyan_sayisi : undefined,
    okundu: r.okundu,
    cocukIcin: (r.cocuk_icin || []).filter(Boolean)
  };
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { res, me, body, q, p, segs, method, need } = k;

  if (p === 'mesajlar') {
    if (!need()) return;
    if (!await okulGerek(res, me)) return;
    const alt = segs[2] || '';

    /* Kime yazabilirim + hangi toplu seçenekler açık */
    if (alt === 'hedefler' && method === 'GET') {
      const liste = await mesajYazilabilirler(me);
      const engeller = await depo.kullanicilar.engelHaritasi(liste.map(u => u.id));
      const kisiler = liste
        .map(u => ({
          id: u.id, ad: u.fullName, rol: u.role,
          brans: u.role === 'teacher' ? branchOf(u) : '',
          kapali: !mesajGidebilirMi(me, u, 'mesaj', engeller.get(u.id))
        }))
        .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));

      const toplu = yetkiVarMi(me, 'mesaj.toplu');
      return ok(res, {
        kisiler: kisiler,
        topluIzin: toplu,
        okulIzin: yetkiVarMi(me, 'mesaj.herkese'),
        duyuruIzin: toplu,
        siniflar: toplu
          ? (await depo.siniflar.ozetleri(me.schoolId)).map(c => ({ id: c.id, ad: c.name, sayi: c.studentCount }))
          : []
      });
    }

    /* Mesaj izin ayarları */
    if (alt === 'ayar' && method === 'GET') {
      const engelli = new Set(await depo.kullanicilar.engelliler(me.id));
      const okul = engelli.size ? await depo.kullanicilar.okulun(me.schoolId) : [];
      return ok(res, {
        kimden: mesajKimden(me),
        engelli: okul.filter(u => engelli.has(u.id)).map(u => ({ id: u.id, ad: u.fullName, rol: u.role }))
      });
    }

    if (alt === 'ayar' && method === 'POST') {
      const kimden = clean(body.kimden, 20);
      if (KIMDEN.indexOf(kimden) < 0) return bad(res, 'Geçersiz seçim');
      const istenen = (Array.isArray(body.engelli) ? body.engelli : []).map(x => clean(x, 60));
      const okul = istenen.length ? new Set((await depo.kullanicilar.okulun(me.schoolId)).map(u => u.id)) : new Set();
      const engelli = [...new Set(istenen)].filter(id => okul.has(id) && id !== me.id).slice(0, 200);
      await depo.kullanicilar.guncelle(me.id, { mesajAyar: { kimden } });
      await depo.kullanicilar.engelleriYaz(me.id, engelli);
      return ok(res, { kimden, engelli: engelli.length });
    }

    /* Gelen kutusu ve gönderilenler */
    if (!alt && method === 'GET') {
      const kutu = clean(q.get('kutu'), 20) === 'giden' ? 'giden' : 'gelen';
      const tur = clean(q.get('tur'), 20);   /* '' | 'duyuru' | 'mesaj' */
      const [satirlar, okunmamis] = await Promise.all([
        depo.mesajlar.kutuOzeti(me.id, kutu, tur, 200),
        depo.mesajlar.okunmamisSayisi(me.id)
      ]);
      return ok(res, { kutu: kutu, okunmamis: okunmamis, mesajlar: satirlar.map(r => kutuSatiri(r, kutu === 'giden')) });
    }

    /* Ana sayfada gösterilecek son duyurular */
    if (alt === 'duyurular' && method === 'GET') {
      const satirlar = await depo.mesajlar.kutuOzeti(me.id, 'gelen', 'duyuru', 5);
      return ok(res, { duyurular: satirlar.map(r => kutuSatiri(r, false)) });
    }

    /* Yeni mesaj / duyuru */
    if (!alt && method === 'POST') {
      if (!hizSinir('mesaj:' + me.id, MESAJ_SAATLIK_SINIR, 60 * 60 * 1000)) {
        return bad(res, 'Saatlik mesaj sınırına ulaştın. Biraz bekle.', 429);
      }

      const tur = clean(body.tur, 20) === 'duyuru' ? 'duyuru' : 'mesaj';
      if (tur === 'duyuru' && !yetkiVarMi(me, 'mesaj.toplu')) {
        return bad(res, 'Duyuru yayımlama yetkin yok', 403);
      }

      const konu = clean(body.konu, MESAJ_KONU_SINIR);
      if (!konu) return bad(res, 'Konu yaz');
      const govde = clean(body.govde, MESAJ_GOVDE_SINIR);
      if (!govde) return bad(res, 'Mesaj metni boş olamaz');

      const cozum = await mesajAlicilariCoz(me, body.hedef || {}, tur);
      if (cozum.hata) return bad(res, cozum.hata);
      if (!cozum.alicilar.length) {
        return bad(res, 'Alıcı kalmadı. Seçtiğin kişiler mesaj almayı kapatmış olabilir.');
      }

      /* Ekler: önceden yüklenmiş taslaklar (toplam 150 MB, 7 gün saklanır). */
      const ek = await ekleriDogrula(me, 'mesaj', body.ekIdler);
      if (ek.hata) return bad(res, ek.hata);

      const m = {
        id: uid('m'), schoolId: me.schoolId, gonderenId: me.id,
        tur: tur, konu: konu, govde: govde,
        hedefOzet: cozum.ozet, alicilar: cozum.alicilar,
        tarih: now()
      };
      await islem(async () => {
        await depo.mesajlar.ekle(m);
        await ekleriBagla('mesaj', m.id, ek.idler);
      });

      /* Bildirim: aynı kişiye birden çok kopya gitmesin (topluBildir tekilleştirir). */
      await topluBildir(cozum.alicilar.map(a => a.id),
        (tur === 'duyuru' ? 'Duyuru: ' : me.fullName + ': ') + konu, '#/mesajlar');

      return ok(res, {
        mesaj: {
          id: m.id, tur: m.tur, konu: m.konu, onizleme: govde.slice(0, 140),
          gonderenId: me.id, gonderen: me.fullName, gonderenRol: me.role,
          tarih: m.tarih, hedefOzet: m.hedefOzet, aliciSayisi: m.alicilar.length,
          okundu: false, cocukIcin: []
        },
        gonderilen: cozum.alicilar.length,
        elenen: cozum.elenen || 0,
        message: (tur === 'duyuru' ? 'Duyuru yayımlandı' : 'Mesaj gönderildi') +
          ' — ' + cozum.alicilar.length + ' kişiye ulaştı.' +
          (cozum.elenen ? ' ' + cozum.elenen + ' kişi mesaj almayı kapatmış.' : '')
      });
    }

    /* Düzeltme: yalnızca gönderen, konu ve metni değiştirir. Alıcıya yeniden
       bildirim gitmez; mesajda "düzenlendi" ve zamanı görünür. */
    if (alt === 'duzenle' && method === 'POST') {
      const m = await depo.mesajlar.bul(clean(body.id, 60));
      if (!m) return bad(res, 'Mesaj bulunamadı', 404);
      if (m.gonderenId !== me.id) return bad(res, 'Yalnızca gönderen düzeltebilir', 403);
      if (!hizSinir('mesajDuzelt:' + me.id, 60, 60 * 60 * 1000)) return bad(res, 'Çok sık düzelttin. Biraz bekle.', 429);
      const konu = clean(body.konu, MESAJ_KONU_SINIR);
      if (!konu) return bad(res, 'Konu yaz');
      const govde = clean(body.govde, MESAJ_GOVDE_SINIR);
      if (!govde) return bad(res, 'Mesaj metni boş olamaz');
      if (konu === m.konu && govde === m.govde) return ok(res, { message: 'Değişiklik yok.' });
      await depo.mesajlar.duzelt(m.id, konu, govde);
      return ok(res, { message: 'Mesaj düzeltildi.' });
    }

    /* Silme: gönderen tamamen siler, alıcı yalnızca kendinden kaldırır. */
    if (alt === 'sil' && method === 'POST') {
      const m = await depo.mesajlar.bul(clean(body.id, 60));
      if (!m) return bad(res, 'Mesaj bulunamadı', 404);

      if (m.gonderenId === me.id) {
        await depo.mesajlar.sil(m.id);
        return ok(res, { message: 'Mesaj silindi.' });
      }
      if (m.alicilar.some(a => a.id === me.id)) {
        await depo.mesajlar.alicidanKaldir(m.id, me.id);
        return ok(res, { message: 'Mesaj kutundan kaldırıldı.' });
      }
      return bad(res, 'Yetkin yok', 403);
    }

    /* Okundu bilgisi: bütün alıcılar (sınır yok), okuma zamanıyla. */
    if (alt === 'okuma' && method === 'GET') {
      const m = await depo.mesajlar.bul(clean(q.get('id'), 60));
      if (!m) return bad(res, 'Mesaj bulunamadı', 404);
      if (!okumaGorebilir(me, m)) return bad(res, 'Bu bilgiyi görme yetkin yok', 403);
      const alicilar = (await depo.mesajlar.okumaDurumu(m.id)).map(r => ({
        ad: r.ad || 'Silinmiş', rol: r.rol || '', sinif: r.sinif || '',
        cocuklar: r.cocuklar || [], okuma: r.okuma || null
      }));
      return ok(res, { konu: m.konu, tarih: m.tarih, alicilar });
    }

    /* Tek mesaj: okundu işaretler */
    if (alt && method === 'GET') {
      const m = await depo.mesajlar.bul(clean(alt, 60));
      if (!m) return bad(res, 'Mesaj bulunamadı', 404);
      const alici = m.alicilar.some(a => a.id === me.id);
      if (!alici && m.gonderenId !== me.id) return bad(res, 'Bu mesajı görme yetkin yok', 403);

      if (alici && m.okuyanlar.indexOf(me.id) < 0) {
        await depo.mesajlar.okundu(m.id, me.id);
        m.okuyanlar.push(me.id);
      }

      const detay = mesajOzeti(m, me.id);
      detay.govde = m.govde;
      detay.ekler = await hedefinEkleri('mesaj', m.id);
      /* Gönderen (duyuruda müdür de) kimlerin okuduğunu ayrı uçtan çeker. */
      if (okumaGorebilir(me, m)) {
        detay.okumaGorur = true;
        const kisiler = new Set(m._alicilar.map(a => a.id));
        detay.kisiSayisi = kisiler.size;
        detay.okuyanSayisi = m.okuyanlar.filter(id => kisiler.has(id)).length;
      }
      return ok(res, { mesaj: detay });
    }
  }

  return false;
}

