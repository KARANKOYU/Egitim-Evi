'use strict';
/* Ödevler (/api/assignments) ve teslim saati yardımcıları. */

const { bad, ok } = require('../http');
const {
  branchOf, isTeacherLike, ogretmeninOgrencileri, ogretmeninSiniflari, saatDuzelt, summarize
} = require('../iliskiler');
const { RESULT_TYPES, SUBJECTS, clean, now, uid } = require('../ortak');
const { depo, topluBildir } = require('../veri');
const ekModulu = () => require('./ekler');   // ekler.js odev-dosya.js üzerinden bu dosyayı ister; döngü olmasın diye geç yüklenir
const { yetkiVarMi } = require('../yetki');
const { yilDamgasi, yilSuz } = require('./egitim-yili');

/* ============ ödev teslim saati ============
   Eski kayıtlarda yalnızca tarih vardı; saat alanı boşsa 12:00 sayılıyor.
   Çoğu öğretmen saati değiştirmiyor ama ders saatine göre ayarlayabilmeli. */

const ODEV_VARSAYILAN_SAAT = '12:00';

const SONUC_AD = {
  yapti: 'Yaptı', gec: 'Geç yaptı', eksik: 'Eksik', yapmadi: 'Yapmadı',
  izinli: 'Gelmedi (izinli)', gelmedi: 'Gelmedi (izinsiz)'
};

function odevSaati(a) {
  return saatDuzelt(a && a.endTime) || ODEV_VARSAYILAN_SAAT;
}

/* Ödevin son teslim anı — tarih + saat birleşmiş hâli. */
function odevBitisAni(a) {
  const t = clean(a && a.endAt, 10);
  if (!t) return null;
  const d = new Date(t + 'T' + odevSaati(a) + ':00');
  return isNaN(d.getTime()) ? null : d;
}

function odevGecikti(a) {
  const an = odevBitisAni(a);
  return an ? Date.now() > an.getTime() : false;
}

/* Sistem yöneticisinin okulu yok: schoolId'si boş. yetkiVarMi() admini
   her yetkiden geçirdiği için okul işlemleri de ona açık kalıyordu ve
   boş okula ait çöp kayıtlar oluşabiliyordu. Okula bağlı uçlar bunu
   açıkça reddetmeli. */

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { res, me, body, p, segs, method, need } = k;

  if (p === 'assignments') {
    if (!need(null)) return;

    /* Öğrenci ödevi açtı: ilk açılış zamanı yazılır, öğretmen
       "ödev 20.05.2026 16:20 tarihinde açıldı" diye görür. */
    if (method === 'POST' && segs[3] === 'acildi' && me.role === 'student') {
      const a = await depo.odevler.bul(clean(segs[2], 60));
      if (!a || a.studentIds.indexOf(me.id) < 0) return bad(res, 'Ödev bulunamadı', 404);
      await depo.odevler.acildi(a.id, me.id);
      return ok(res);
    }

    /* Öğrenci ödevi yıldızlar ya da yıldızı kaldırır; yalnızca kendisi görür. */
    if (method === 'POST' && segs[3] === 'yildiz') {
      if (me.role !== 'student') return bad(res, 'Ödevi yalnızca öğrenci yıldızlayabilir.', 403);
      if (typeof body.yildiz !== 'boolean') return bad(res, 'Yıldız açık mı kapalı mı belli değil.');
      if (!await depo.odevler.yildizla(clean(segs[2], 60), me.id, body.yildiz)) return bad(res, 'Ödev bulunamadı', 404);
      return ok(res, { yildiz: body.yildiz });
    }

    if (!isTeacherLike(me) && method !== 'GET') return bad(res, 'Yetkin yok', 403);

    /* Ödev verirken kime gideceğini seçmek için: sınıflar ve öğrencileri. */
    if (method === 'GET' && segs[2] === 'hedefler') {
      if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);
      const [sinifListesi, ulasilan, dersListesi] = await Promise.all([
        ogretmeninSiniflari(me),
        ogretmeninOgrencileri(me),
        me.role === 'principal' ? depo.siniflar.okulunDersleri(me.schoolId) : depo.siniflar.ogretmeninDersleri(me.id)
      ]);

      /* Öğrenciler tek sorguda geldi; sınıflarına dağıtılır (depo adlarıyla sıralı). */
      const sinifinda = new Map();
      for (const s of ulasilan) {
        const cid = s.classId || '';
        if (!sinifinda.has(cid)) sinifinda.set(cid, []);
        sinifinda.get(cid).push({ id: s.id, fullName: s.fullName });
      }
      const siniflar = sinifListesi.map(c => ({ id: c.id, name: c.name, students: sinifinda.get(c.id) || [] }));

      /* Sınıfsız öğrenciler de kaybolmasın */
      if (sinifinda.has('')) siniflar.push({ id: '', name: 'Sınıfsız öğrenciler', students: sinifinda.get('') });

      /* Ödev hangi ders için veriliyor? */
      const dersler = dersListesi
        .map(l => ({ id: l.id, subject: l.subject, classId: l.classId, className: l._sinifAdi || '' }))
        .sort((a, b) => (a.subject.localeCompare(b.subject, 'tr')) ||
                        (a.className.localeCompare(b.className, 'tr')));

      /* Aynı dersin farklı sınıflardaki kopyalarını tek başlıkta topla */
      const dersAdlari = [];
      for (const d of dersler) if (dersAdlari.indexOf(d.subject) < 0) dersAdlari.push(d.subject);

      return ok(res, {
        classes: siniflar,
        lessons: dersler,
        subjects: dersAdlari.length ? dersAdlari : SUBJECTS,
        varsayilanDers: me.role === 'teacher' ? (me.branch || '') : ''
      });
    }

    if (method === 'GET' && !segs[2]) {
      if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);
      const list = (await yilSuz(me, await depo.odevler.ogretmenin(me.id)))
        .map(a => ({
          id: a.id, title: a.title, description: a.description, subject: a.subject,
          startAt: a.startAt, startTime: a.startTime, endAt: a.endAt, endTime: odevSaati(a),
          gecikti: odevGecikti(a),
          status: a.status, createdAt: a.createdAt,
          studentCount: a.studentIds.length,
          acilan: Object.keys(a.acilma).length,
          summary: summarize(a)
        }));
      return ok(res, { assignments: list });
    }

    if (method === 'POST' && !segs[2]) {
      const title = clean(body.title, 120);
      if (!title) return bad(res, 'Ödev adı gerekli');

      const subject = clean(body.subject, 60) ||
        (me.role === 'teacher' ? me.branch : branchOf(me));
      if (!subject) return bad(res, 'Ders seç');

      /* Kime gideceği açıkça seçiliyor. Sadece ulaşabildiğin
         öğrencilere ödev verilebilir. */
      const ulasilan = new Map((await ogretmeninOgrencileri(me)).map(s => [s.id, s]));
      const istenen = Array.isArray(body.studentIds) ? body.studentIds.map(x => String(x)) : [];
      const secilen = [...new Set(istenen.filter(id => ulasilan.has(id)))];

      if (!istenen.length) return bad(res, 'En az bir öğrenci seç');
      if (!secilen.length) return bad(res, 'Seçtiğin öğrencilere ödev veremezsin');
      const basT = clean(body.startAt, 30), sonT = clean(body.endAt, 30);
      if (basT && sonT && basT.slice(0, 10) > sonT.slice(0, 10)) return bad(res, 'Son tarih başlangıçtan önce olamaz');
      const basSaat = basT ? (saatDuzelt(body.startTime) || '') : '';
      const sonSaat = saatDuzelt(body.endTime) || ODEV_VARSAYILAN_SAAT;
      if (basSaat && basT && sonT && basT.slice(0, 10) === sonT.slice(0, 10) && basSaat >= sonSaat) {
        return bad(res, 'Aynı gün biten ödevde son saat başlama saatinden sonra olmalı');
      }

      /* Hangi sınıflara gittiğini de sakla: müdür ders bazlı bakabilsin. */
      const sinifIdler = [];
      for (const id of secilen) {
        const cid = ulasilan.get(id).classId;
        if (cid && sinifIdler.indexOf(cid) < 0) sinifIdler.push(cid);
      }

      /* Ders, öğrencilerin sınıfında okutulan bir ders olmalı (vekil öğretmen
         başka dersin ödevini verebilir ama uydurma ders adı olmaz). */
      if (sinifIdler.length) {
        let varMi = false;
        for (const cid of sinifIdler) if (await depo.siniflar.dersVarMi(cid, subject)) { varMi = true; break; }
        if (!varMi) return bad(res, 'Seçtiğin öğrencilerin sınıfında ' + subject + ' dersi yok');
      } else if (SUBJECTS.indexOf(subject) < 0) return bad(res, 'Ders bulunamadı');

      /* Rolünde ders/sınıf kapsamı varsa ona uymalı. */
      if (!yetkiVarMi(me, 'odev.ver', { ders: subject })) {
        return bad(res, subject + ' dersine ödev verme yetkin yok');
      }
      for (const cid of sinifIdler) {
        if (!yetkiVarMi(me, 'odev.ver', { sinif: cid })) {
          const c = await depo.siniflar.bul(cid);
          return bad(res, (c ? c.name : 'Bu sınıf') + ' için ödev verme yetkin yok');
        }
      }

      const ek = await ekModulu().ekleriDogrula(me, 'odev', body.ekIdler);
      if (ek.hata) return bad(res, ek.hata);

      const a = await depo.odevler.ekle({
        id: uid('a'), teacherId: me.id, schoolId: me.schoolId, subject,
        title, description: clean(body.description, 1000),
        startAt: basT, startTime: basSaat, endAt: sonT,
        endTime: sonSaat,
        studentIds: secilen, classIds: sinifIdler,
        status: 'active', yilId: await yilDamgasi(me), createdAt: now()
      });
      await ekModulu().ekleriBagla('odev', a.id, ek.idler);
      await topluBildir(secilen, 'Yeni ödev: ' + title + ' (' + subject + ')', '#/odevler');
      return ok(res, { assignment: a, gonderilen: secilen.length });
    }

    const a = await depo.odevler.bul(clean(segs[2], 60));
    if (!a) return bad(res, 'Ödev bulunamadı', 404);
    /* Ödevi veren öğretmen yönetir. Öğretmen okuldan ayrıldıysa ödev sahipsiz
       kalır; o zaman okulun müdürü sonuçlandırır, düzeltir ya da siler. */
    const sahipsiz = !a.teacherId && me.role === 'principal' && a.schoolId === me.schoolId;
    if (a.teacherId !== me.id && !sahipsiz) return bad(res, 'Yetkin yok', 403);

    if (method === 'GET') {
      /* Öğrenci adları tek sorguda. Artık öğretmenin sınıfında olmayan
         öğrencinin adı ayrıca okunur. */
      const adlar = new Map((await ogretmeninOgrencileri(me)).map(s => [s.id, s.fullName]));
      for (const id of a.studentIds.filter(x => !adlar.has(x))) {
        const s = await depo.kullanicilar.bul(id);
        adlar.set(id, s ? s.fullName : '(silinmiş öğrenci)');
      }
      return ok(res, {
        assignment: a,
        ekler: await ekModulu().hedefinEkleri('odev', a.id),
        students: a.studentIds
          .map(id => ({ id, fullName: adlar.get(id), result: a.results[id] || null, acilma: a.acilma[id] || null }))
          .sort((x, y) => x.fullName.localeCompare(y.fullName, 'tr'))
      });
    }
    if (method === 'POST' && segs[3] === 'finish') {
      if (!yetkiVarMi(me, 'odev.sonuclandir', { ders: a.subject })) return bad(res, 'Bu ödevi sonuçlandırma yetkin yok', 403);
      /* Gelen her öğrenci için sonuç yazılır; boş seçim ("— Seç —") eski
         sonucu kaldırır. Listede hiç gelmeyen öğrenciye dokunulmaz. */
      const results = body.results && typeof body.results === 'object' ? body.results : {};
      const sonuclar = {};
      for (const id of a.studentIds) {
        if (!Object.prototype.hasOwnProperty.call(results, id)) continue;
        const r = results[id];
        if (r === '' || r === null) sonuclar[id] = null;
        else if (RESULT_TYPES.indexOf(r) >= 0) sonuclar[id] = r;
      }
      const son = await depo.odevler.sonuclandir(a.id, sonuclar, now());
      /* Bildirim yalnızca sonucu yeni verilen ya da değişen öğrenciye gider;
         öğretmen aynı ekranı tekrar kaydedince sınıfa yeniden bildirim yağmaz. */
      const giden = [];
      for (const id of Object.keys(sonuclar)) {
        const yeniSonuc = sonuclar[id];
        if (!yeniSonuc || a.results[id] === yeniSonuc) continue;
        /* "Matematik dersinden "Oran orantı" ödevi açıklandı: Yaptı" (velisine de çocuğun adıyla gider). */
        giden.push({ kime: id, baglanti: '#/odevler', metin: a.subject + ' dersinden "' + a.title + '" ödevi ' +
          (a.results[id] ? 'sonucu değişti: ' : 'açıklandı: ') + SONUC_AD[yeniSonuc] });
      }
      await depo.genel.cokluBildir(giden);
      return ok(res, { assignment: son, bildirilen: giden.length });
    }
    /* Ödevin kendisini düzeltme: sonuçlandıktan sonra da olur. Tarih ya da
       ad değişirse öğrencilere haber gider. */
    if (method === 'POST' && segs[3] === 'update') {
      if (!yetkiVarMi(me, 'odev.ver', { ders: a.subject })) return bad(res, 'Bu ödevi düzeltme yetkin yok', 403);
      const title = clean(body.title, 120);
      if (!title) return bad(res, 'Ödev adı gerekli');
      const d = { title, description: clean(body.description, 1000), startAt: clean(body.startAt, 30),
        endAt: clean(body.endAt, 30), endTime: saatDuzelt(body.endTime) || ODEV_VARSAYILAN_SAAT };
      d.startTime = d.startAt ? (saatDuzelt(body.startTime) || '') : '';
      if (d.startAt && d.endAt && d.startAt.slice(0, 10) > d.endAt.slice(0, 10)) {
        return bad(res, 'Son tarih başlangıçtan önce olamaz');
      }
      if (d.startTime && d.startAt && d.endAt && d.startAt.slice(0, 10) === d.endAt.slice(0, 10) && d.startTime >= d.endTime) {
        return bad(res, 'Aynı gün biten ödevde son saat başlama saatinden sonra olmalı');
      }
      /* Ekler: yenileri bağlanır, kaldırılanlar silinir (toplam 150 MB). */
      const mevcutEkler = await depo.ekler.hedefin('odev', a.id);
      const silinecek = new Set((Array.isArray(body.ekSilIdler) ? body.ekSilIdler : []).map(x => String(x)));
      const kalanBoyut = mevcutEkler.filter(e => !silinecek.has(e.id) && !e.silindi).reduce((t, e) => t + e.boyut, 0);
      const ek = await ekModulu().ekleriDogrula(me, 'odev', body.ekIdler, kalanBoyut);
      if (ek.hata) return bad(res, ek.hata);
      const yeni = await depo.odevler.duzelt(a.id, d);
      for (const e of mevcutEkler.filter(x => silinecek.has(x.id))) await depo.ekler.sil(e.id);
      await ekModulu().ekleriBagla('odev', a.id, ek.idler);
      const tarihDegisti = (a.endAt || '').slice(0, 10) !== (yeni.endAt || '').slice(0, 10) || odevSaati(a) !== odevSaati(yeni);
      if (tarihDegisti || a.title !== yeni.title) {
        await topluBildir(a.studentIds, 'Ödev güncellendi: ' + yeni.title + (tarihDegisti && yeni.endAt
          ? ' (son gün ' + yeni.endAt.slice(8, 10) + '.' + yeni.endAt.slice(5, 7) + ' ' + odevSaati(yeni) + ')' : ''), '#/odevler');
      }
      return ok(res, { assignment: yeni, message: 'Ödev güncellendi.' });
    }
    if (method === 'POST' && segs[3] === 'reopen') {
      if (!yetkiVarMi(me, 'odev.sonuclandir', { ders: a.subject })) return bad(res, 'Bu ödevi yeniden açma yetkin yok', 403);
      return ok(res, { assignment: await depo.odevler.yenidenAc(a.id) });
    }
    if (method === 'POST' && segs[3] === 'delete') {
      if (!yetkiVarMi(me, 'odev.ver', { ders: a.subject })) return bad(res, 'Bu ödevi silme yetkin yok', 403);
      await depo.odevler.sil(a.id);
      return ok(res);
    }
  }

  return false;
}

