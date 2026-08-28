'use strict';
/* Devamsızlık (/api/devamsizlik): yoklama alma ve özetler. */

const { bad, ok } = require('../http');
const { GUN_ADLARI, saatDuzelt, sinifOgrencileri, teachersOfStudent } = require('../iliskiler');
const { clean, now, uid } = require('../ortak');
const { depo } = require('../veri');
const { kapsamUyar, okulGerek, yetkiKapsami, yetkiVarMi } = require('../yetki');
const { yilDamgasi, yilSuz, bakisKisisi } = require('./egitim-yili');

/* ============ devamsızlık ============
   Yoklama ders saati bazında alınır: aynı gün farklı derslerde ayrı kayıt.
   "var" durumundakiler saklanmaz — yalnızca devamsızlıklar tutulur,
   böylece tablo gereksiz büyümez. */

const DEVAM_DURUMLAR = ['var', 'yok', 'gec', 'izinli'];
const DEVAM_AD = {
  var: 'Geldi', yok: 'Gelmedi', gec: 'Geç geldi', izinli: 'İzinli'
};

function gunBicimi(metin) {
  const s2 = clean(metin, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s2) ? s2 : '';
}

function bugun() {
  const d = new Date();
  const i = n => (n < 10 ? '0' : '') + n;
  return d.getFullYear() + '-' + i(d.getMonth() + 1) + '-' + i(d.getDate());
}

/* Bir derse yoklama alabilir mi?

   Öğretmenlerde 'devamsizlik.al' varsayılan olarak açık ve kapsamsız gelir;
   tek başına bırakılırsa herhangi bir öğretmen, hiç girmediği bir derste
   öğrenciyi devamsız yazabilirdi. Bu yüzden öğretmen için ek şart:
   ya ders kendisinin, ya da müdür ona bu ders/sınıf için açıkça kapsam vermiş. */
function yoklamaYetkisi(u, l) {
  if (!l) return false;
  if (!yetkiVarMi(u, 'devamsizlik.al', { ders: l.subject, sinif: l.classId })) return false;
  if (u.role !== 'teacher') return true;
  if (l.teacherId === u.id) return true;
  /* Başkasının dersi: ancak ek rolde bu ders ve sınıf için açık kapsam varsa. */
  const k = yetkiKapsami(u, 'devamsizlik.al');
  return !!k && kapsamUyar(k, { ders: l.subject, sinif: l.classId });
}

/* Ek rolde devamsızlık için bu sınıfa açıkça kapsam verilmiş mi? */
function acikSinifKapsami(u, sinifId) {
  const k = yetkiKapsami(u, 'devamsizlik.al');
  return !!k && kapsamUyar(k, { sinif: sinifId });
}

/* Yoklama bildirimi: öğrenciye kısa, veliye "Çocuğunuz ... gelmedi" diye. */
const VELI_DURUM = { yok: 'gelmedi (izinsiz)', izinli: 'gelmedi (izinli)', gec: 'geç geldi' };
function yoklamaMetni(ogrenci, l, tarih, saat, durum) {
  const gun = tarih === bugun() ? 'bugün' : tarih.slice(8, 10) + '.' + tarih.slice(5, 7) + '.' + tarih.slice(0, 4);
  const ders = (saat ? saat + ' ' : '') + l.subject + ' dersi';
  return {
    ogrenci,
    metin: (gun === 'bugün' ? 'Bugün' : gun) + ' ' + ders + ': ' + (DEVAM_AD[durum] || durum),
    veliMetni: VELI_DURUM[durum]
      ? 'Çocuğunuz ' + ogrenci.fullName + ' ' + gun + ' ' + (saat ? 'saat ' + saat + ' ' : '') + l.subject + ' dersine ' + VELI_DURUM[durum] + '.'
      : ogrenci.fullName + ' — ' + gun + ' ' + ders + ': ' + (DEVAM_AD[durum] || durum)
  };
}

/* Veli çocuğuna bakabilir mi? */
const veliBakabilir = (me, st) => me.role !== 'student' && depo.kullanicilar.bagliMi(me.id, st.id);

/* Bir öğrencinin devamsızlık dökümü. Depo yeniden eskiye sıralı döndürür. */
async function devamsizlikOzeti(ogrenciId, gunSayisi, bakan, ogrenci) {
  const hepsi = await depo.devamsizlik.ogrencinin(ogrenciId);
  /* Veli çocuğunun gözünden (okulu ve geçmiş okulları), personel kendi okulundan bakar. */
  const bakis = bakan ? bakisKisisi(bakan, ogrenci || (bakan.id === ogrenciId ? bakan : await depo.kullanicilar.bul(ogrenciId))) : null;
  const kayitlar = bakis ? await yilSuz(bakis, hepsi) : hepsi;

  const sinir = gunSayisi ? new Date(Date.now() - gunSayisi * 86400000)
    .toISOString().slice(0, 10) : '';
  const suzulmus = sinir ? kayitlar.filter(k => k.tarih >= sinir) : kayitlar;

  const sayim = { yok: 0, gec: 0, izinli: 0 };
  for (const k of suzulmus) if (sayim[k.durum] !== undefined) sayim[k.durum]++;

  return {
    sayim: sayim,
    toplam: suzulmus.length,
    kayitlar: suzulmus.slice(0, 200).map(k => ({
      id: k.id, tarih: k.tarih, durum: k.durum,
      durumAd: DEVAM_AD[k.durum] || k.durum,
      ders: k._ders, not: k.not || '',
      alan: k._alanAdi
    }))
  };
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { res, me, body, q, p, segs, method, need } = k;

  if (p === 'devamsizlik') {
    if (!need()) return;
    if (!await okulGerek(res, me)) return;
    const alt = segs[2] || '';

    /* Öğretmenin yoklama alabileceği dersler */
    if (alt === 'derslerim' && method === 'GET') {
      /* Boş liste dönmek yerine açıkça reddet: öğrenci ve velinin bu uçta
         işi yok, 200 dönmesi denetimde yanlış izlenim veriyordu. */
      if (!yetkiVarMi(me, 'devamsizlik.al')) {
        return bad(res, 'Yoklama yetkin yok', 403);
      }
      const [okulDersleri, ozetler] = await Promise.all([
        depo.siniflar.okulunDersleri(me.schoolId), depo.siniflar.ozetleri(me.schoolId)
      ]);
      const ogrenciSayisi = new Map(ozetler.map(c => [c.id, c.studentCount]));
      /* Depo sınıf adı ve derse göre Türkçe sıralı döndürür. */
      return ok(res, {
        dersler: okulDersleri.filter(l => yoklamaYetkisi(me, l)).map(l => ({
          id: l.id, ders: l.subject,
          sinif: l._sinifAdi || '', classId: l.classId,
          ogrenciSayisi: ogrenciSayisi.get(l.classId) || 0
        }))
      });
    }

    /* Yoklama ekranı: sınıfın öğrencileri + o güne girilmiş kayıtlar */
    if (alt === 'yoklama' && method === 'GET') {
      const l = await depo.siniflar.dersBul(clean(q.get('lessonId'), 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yoklamaYetkisi(me, l)) {
        return bad(res, 'Bu ders için yoklama yetkin yok', 403);
      }
      const tarih = gunBicimi(q.get('tarih')) || bugun();
      const varolan = {};
      for (const k of await depo.devamsizlik.dersGunu(l.id, tarih)) varolan[k.ogrenciId] = k;
      return ok(res, {
        ders: { id: l.id, ad: l.subject, sinif: l._sinifAdi || '' },
        tarih: tarih,
        durumlar: DEVAM_DURUMLAR.map(d => ({ k: d, ad: DEVAM_AD[d] })),
        ogrenciler: (await sinifOgrencileri(l.classId))
          .map(o => ({
            id: o.id, ad: o.fullName,
            durum: varolan[o.id] ? varolan[o.id].durum : 'var',
            not: varolan[o.id] ? (varolan[o.id].not || '') : ''
          }))
      });
    }

    /* Yoklamayı kaydet — aynı gün tekrar alınırsa üzerine yazar. */
    if (alt === 'yoklama' && method === 'POST') {
      const l = await depo.siniflar.dersBul(clean(body.lessonId, 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yoklamaYetkisi(me, l)) {
        return bad(res, 'Bu ders için yoklama yetkin yok', 403);
      }
      const tarih = gunBicimi(body.tarih) || bugun();
      if (tarih > bugun()) return bad(res, 'İleri tarihe yoklama alınamaz');

      const girisler = Array.isArray(body.girisler) ? body.girisler : [];
      if (!girisler.length) return bad(res, 'Yoklama boş');

      const sinifOgr = new Map((await sinifOgrencileri(l.classId)).map(o => [o.id, o]));
      const yilId = await yilDamgasi(me);
      const saat = saatDuzelt(body.saat) || '';   // ders programından alınınca dersin saati
      /* Bu dersin o günkü eski kaydı: yoklama yeniden kaydedilince yalnızca
         durumu DEĞİŞEN öğrenciye ve velisine bildirim gider. */
      const onceki = new Map((await depo.devamsizlik.dersGunu(l.id, tarih)).map(k => [k.ogrenciId, k.durum]));

      const kayitlar = [];
      const bildirilecek = [];
      const gorulen = new Set();
      for (const g of girisler) {
        if (!g || typeof g !== 'object') continue;
        const oid = clean(g.ogrenciId, 60);
        if (!sinifOgr.has(oid) || gorulen.has(oid)) continue;
        const durum = clean(g.durum, 10);
        if (DEVAM_DURUMLAR.indexOf(durum) < 0) continue;
        gorulen.add(oid);
        /* "Geldi" kaydı tutulmuyor; yokluk anlamlı olan bilgi. */
        if (durum === 'var') continue;
        kayitlar.push({
          id: uid('dv'), schoolId: me.schoolId, classId: l.classId,
          lessonId: l.id, ogrenciId: oid, tarih: tarih, durum: durum,
          not: clean(g.not, 200), alanId: me.id,
          yilId, createdAt: now()
        });
        if (onceki.get(oid) === durum) continue;
        bildirilecek.push(yoklamaMetni(sinifOgr.get(oid), l, tarih, saat, durum));
      }

      /* O derse ait o günün eski kayıtları silinip yenisi yazılır (tek işlem). */
      await depo.devamsizlik.dersGunuYaz(l.id, tarih, kayitlar);
      /* Öğrenciye ve velisine haber ver. */
      await devamsizlikBildir(bildirilecek);
      const yazilan = kayitlar.length;

      return ok(res, {
        yazilan: yazilan,
        message: yazilan
          ? yazilan + ' devamsızlık kaydedildi.'
          : 'Yoklama kaydedildi — herkes derste.'
      });
    }

    /* Öğrencinin kendi dökümü */
    if (alt === 'benim' && method === 'GET') {
      if (me.role !== 'student') return bad(res, 'Bu ekran öğrenciler için', 403);
      return ok(res, await devamsizlikOzeti(me.id, Number(q.get('gun')) || 0, me));
    }

    /* Velinin çocuğu / öğretmen ve müdürün öğrenci dökümü */
    if (alt === 'ogrenci' && method === 'GET') {
      const st = await depo.kullanicilar.bul(clean(q.get('studentId'), 60));
      if (!st || st.role !== 'student') return bad(res, 'Öğrenci bulunamadı');

      let izin = await veliBakabilir(me, st);
      if (!izin && me.role !== 'parent' && me.schoolId === st.schoolId) {
        /* devamsizlik.al öğretmende kapsamsız açık gelir; tek başına izin
           sayılmaz, ancak müdür o sınıf için açıkça kapsam verdiyse. */
        izin = yetkiVarMi(me, 'devamsizlik.gor') ||
          (yetkiVarMi(me, 'devamsizlik.al') && acikSinifKapsami(me, st.classId)) ||
          (await teachersOfStudent(st.id)).some(t => t.id === me.id);
      }
      if (!izin) return bad(res, 'Bu öğrencinin devamsızlığını görme yetkin yok', 403);

      const ozet = await devamsizlikOzeti(st.id, Number(q.get('gun')) || 0, me, st);
      ozet.ogrenci = { id: st.id, ad: st.fullName };
      return ok(res, ozet);
    }

    /* Bir öğrencinin belirli bir günü: o gün programda hangi dersler var,
       her birinde durumu ne. Yoklama listesini tek tek gezmek yerine
       "şu öğrenci, şu gün" diye bakmak için. */
    if (alt === 'gun' && method === 'GET') {
      const st = await depo.kullanicilar.bul(clean(q.get('studentId'), 60));
      if (!st || st.role !== 'student') return bad(res, 'Öğrenci bulunamadı');

      let izin = me.id === st.id || await veliBakabilir(me, st);
      if (!izin && me.role !== 'parent' && me.schoolId === st.schoolId) {
        izin = yetkiVarMi(me, 'devamsizlik.gor') ||
          (await teachersOfStudent(st.id)).some(t => t.id === me.id);
      }
      if (!izin) return bad(res, 'Bu öğrencinin kaydını görme yetkin yok', 403);

      const tarih = gunBicimi(q.get('tarih')) || bugun();
      const d = new Date(tarih + 'T00:00:00');
      const haftaGun = ((d.getDay() + 6) % 7) + 1;

      /* O gün sınıfın programındaki ders saatleri (saate göre sıralı) */
      const [saatler, kayitlar] = await Promise.all([
        st.classId ? depo.siniflar.sinifinProgrami(st.classId, haftaGun) : [],
        depo.devamsizlik.ogrenciGunu(st.id, tarih)
      ]);

      const dersler = saatler.map((sp, i) => {
        /* yoklamaYetkisi için ders nesnesi: konu, sınıf, öğretmen */
        const l = { subject: sp._ders, classId: sp.classId, teacherId: sp._ogretmenId };
        const kayit = kayitlar.find(k => k.lessonId === sp.lessonId);
        /* Kaydı yoksa derse gelmiş sayılır — yoklamada yalnızca
           devamsızlıklar saklanıyor. */
        return {
          sira: i + 1,
          lessonId: sp.lessonId,
          ders: sp._ders || '',
          ogretmen: sp._ogretmenAdi || '',
          bas: sp.start, bit: sp.end,
          durum: kayit ? kayit.durum : 'var',
          not: kayit ? (kayit.not || '') : '',
          duzenlenebilir: yoklamaYetkisi(me, l)
        };
      });

      return ok(res, {
        ogrenci: { id: st.id, ad: st.fullName, classId: st.classId },
        tarih: tarih,
        gunAdi: GUN_ADLARI[haftaGun] || '',
        durumlar: DEVAM_DURUMLAR.map(x => ({ k: x, ad: DEVAM_AD[x] })),
        dersler: dersler
      });
    }

    /* Tek bir ders saatinin durumunu değiştir. */
    if (alt === 'isaretle' && method === 'POST') {
      const st = await depo.kullanicilar.bul(clean(body.studentId, 60));
      if (!st || st.role !== 'student') return bad(res, 'Öğrenci bulunamadı');
      const l = await depo.siniflar.dersBul(clean(body.lessonId, 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yoklamaYetkisi(me, l)) return bad(res, 'Bu ders için yetkin yok', 403);

      const tarih = gunBicimi(body.tarih);
      if (!tarih) return bad(res, 'Tarih gerekli');
      if (tarih > bugun()) return bad(res, 'İleri tarihe yoklama alınamaz');

      const durum = clean(body.durum, 10);
      if (DEVAM_DURUMLAR.indexOf(durum) < 0) return bad(res, 'Geçersiz durum');

      const eski = (await depo.devamsizlik.ogrenciGunu(st.id, tarih)).find(k => k.lessonId === l.id);
      const oncekiDurum = eski ? eski.durum : 'var';
      /* Öğrenci bu okulda ve dersin sınıfında olmalı (sınıf değiştirmiş
         öğrencinin o derste var olan eski kaydı yine düzeltilebilir). */
      if (st.schoolId !== me.schoolId || (st.classId !== l.classId && !eski)) {
        return bad(res, 'Öğrenci bu dersin sınıfında değil', 404);
      }

      /* Eski kayıt silinir, "geldi" değilse yenisi yazılır (tek işlem). */
      const kayit = durum === 'var' ? null : {
        id: uid('dv'), schoolId: me.schoolId, classId: l.classId,
        lessonId: l.id, ogrenciId: st.id, tarih: tarih, durum: durum,
        not: clean(body.not, 200), alanId: me.id,
        yilId: await yilDamgasi(me), createdAt: now()
      };
      await depo.devamsizlik.ogrenciDersGunuYaz(st.id, l.id, tarih, kayit);
      /* Durum değişmediyse (aynı işaret yeniden kaydedildi) bildirim gitmez. */
      if (kayit && oncekiDurum !== durum) {
        await devamsizlikBildir([yoklamaMetni(st, l, tarih, saatDuzelt(body.saat) || '', durum)]);
      }
      return ok(res, { durum: durum, message: 'Kaydedildi.' });
    }

    /* Okul geneli özet */
    if (alt === 'ozet' && method === 'GET') {
      if (!yetkiVarMi(me, 'devamsizlik.gor')) {
        return bad(res, 'Okul geneli devamsızlığı görme yetkin yok', 403);
      }
      const gun = Number(q.get('gun')) || 30;
      const sinir = new Date(Date.now() - gun * 86400000).toISOString().slice(0, 10);
      const kayitlar = await yilSuz(me, await depo.devamsizlik.okulunSonKayitlari(me.schoolId, sinir));

      const ogrHarita = new Map();
      for (const k of kayitlar) {
        if (!ogrHarita.has(k.ogrenciId)) {
          ogrHarita.set(k.ogrenciId, { yok: 0, gec: 0, izinli: 0 });
        }
        const h = ogrHarita.get(k.ogrenciId);
        if (h[k.durum] !== undefined) h[k.durum]++;
      }

      /* Öğrenci ve sınıf adları iki sorguda, döngüde tek tek değil. */
      const [ogrenciler, siniflar] = await Promise.all([
        depo.kullanicilar.okulun(me.schoolId, { rol: 'student' }), depo.siniflar.okulun(me.schoolId)
      ]);
      const ogrenci = new Map(ogrenciler.map(o => [o.id, o]));
      const sinifAdi = new Map(siniflar.map(c => [c.id, c.name]));
      const satirlar = [];
      for (const [oid, h] of ogrHarita) {
        const o = ogrenci.get(oid);
        if (!o) continue;
        satirlar.push({
          id: oid, ad: o.fullName, sinif: sinifAdi.get(o.classId) || '',
          yok: h.yok, gec: h.gec, izinli: h.izinli,
          toplam: h.yok + h.gec + h.izinli
        });
      }
      satirlar.sort((a, b) => b.yok - a.yok || b.toplam - a.toplam);

      return ok(res, {
        gun: gun,
        toplamKayit: kayitlar.length,
        ogrenciSayisi: satirlar.length,
        satirlar: satirlar.slice(0, 300)
      });
    }
  }

  return false;
}

