'use strict';
/* Sınavlar (/api/exams, /api/examgroups).

   Bir sınavın bir ya da birden çok ölçümü olur: "Puan", ya da "Doğru",
   "Yanlış", "Net", "LGS Puanı" gibi. Her ölçümün kendi aralığı vardır
   (-10000 ile 10000 arasında; 0-100, 0-500, 100-500...). Değerler
   ondalıklı olabilir ve virgülle de yazılabilir: 490,161.

   Şablon: okulun hazır ölçüm listesi ("Yazılı (0-100)", "LGS Denemesi").
   Sınav şablondan açılınca ölçümleri kopyalanır; şablon sonradan değişse
   eski sınav bozulmaz. Grafik, aynı şablonla yapılmış sınavları yan yana
   koyar.

   Grup isteğe bağlıdır. Gruptaki sınavların etki oranı (ağırlık) olur ve
   grup ortalaması 100 üzerinden hesaplanır. */

const { bad, ok } = require('../http');
const {
  branchOf, canSeeStudent, isTeacherLike, ogretmeninOgrencileri, ogretmeninSiniflari
} = require('../iliskiler');
const { clean, now, ondalik, uid } = require('../ortak');
const { depo, topluBildir } = require('../veri');
const { yetkiVarMi } = require('../yetki');
const { yilDamgasi, yilSuz } = require('./egitim-yili');

const DEGER_SINIR = 10000;
const EN_FAZLA_OLCUM = 30;

/* Okulda henüz şablon yokken önerilen hazır şablonlar. Kullanılınca
   okulun şablonu olarak kaydedilir ve düzenlenebilir. */
const HAZIR_SABLONLAR = {
  yazili: { name: 'Yazılı (0-100)', olcumler: [
    { kod: 'P', ad: 'Puan', alt: 0, ust: 100, ana: true }
  ]},
  test: { name: 'Test (Doğru / Yanlış / Net)', olcumler: [
    { kod: 'D', ad: 'Doğru', alt: 0, ust: 100 },
    { kod: 'Y', ad: 'Yanlış', alt: 0, ust: 100 },
    { kod: 'N', ad: 'Net', alt: -100, ust: 100, ana: true }
  ]},
  lgs: { name: 'LGS Denemesi', olcumler: [
    { kod: 'TR', ad: 'Türkçe Net', alt: -10, ust: 20 },
    { kod: 'MAT', ad: 'Matematik Net', alt: -10, ust: 20 },
    { kod: 'FEN', ad: 'Fen Bilimleri Net', alt: -10, ust: 20 },
    { kod: 'INK', ad: 'İnkılap Tarihi Net', alt: -5, ust: 10 },
    { kod: 'DIN', ad: 'Din Kültürü Net', alt: -5, ust: 10 },
    { kod: 'ING', ad: 'İngilizce Net', alt: -5, ust: 10 },
    { kod: 'LGS', ad: 'LGS Puanı', alt: 100, ust: 500, ana: true }
  ]}
};

/* "Doğru Sayısı" -> "DS"; çakışırsa sonuna sayı eklenir. */
function kodUret(ad, kullanilan) {
  const temel = String(ad).toLocaleUpperCase('tr').split(/\s+/)
    .map(w => w.replace(/[^A-ZÇĞİÖŞÜ0-9]/g, '').charAt(0)).join('').slice(0, 6) || 'O';
  let kod = temel, i = 2;
  while (kullanilan.has(kod)) kod = temel.slice(0, 5) + (i++);
  return kod;
}

/* Gelen ölçüm listesini doğrular ve temizler.
   Dönen: { olcumler } ya da { hata }. id'ler korunur (düzenleme için). */
function olcumleriDogrula(gelen) {
  if (!Array.isArray(gelen) || !gelen.length) return { hata: 'En az bir değer alanı gerekli' };
  if (gelen.length > EN_FAZLA_OLCUM) return { hata: 'En fazla ' + EN_FAZLA_OLCUM + ' değer alanı olabilir' };
  const kullanilan = new Set();
  const liste = [];
  for (const o of gelen) {
    if (!o || typeof o !== 'object') return { hata: 'Değer alanı okunamadı' };
    const ad = clean(o.ad, 60);
    if (!ad) return { hata: 'Her değer alanının bir adı olmalı' };
    const alt = ondalik(o.alt === undefined || o.alt === '' ? 0 : o.alt);
    const ust = ondalik(o.ust === undefined || o.ust === '' ? 100 : o.ust);
    if (alt === null || ust === null) return { hata: '"' + ad + '" için alt ve üst sınır sayı olmalı' };
    if (alt < -DEGER_SINIR || ust > DEGER_SINIR) {
      return { hata: 'Sınırlar -' + DEGER_SINIR + ' ile ' + DEGER_SINIR + ' arasında olmalı' };
    }
    if (alt >= ust) return { hata: '"' + ad + '" için alt sınır üst sınırdan küçük olmalı' };
    let kod = clean(o.kod, 12).toLocaleUpperCase('tr').replace(/\s+/g, '');
    if (!kod || kullanilan.has(kod)) kod = kodUret(ad, kullanilan);
    kullanilan.add(kod);
    liste.push({ id: clean(o.id, 60), kod, ad, alt, ust, ana: o.ana === true });
  }
  /* Tek ana ölçüm: hiç işaretlenmediyse ilki, birden çoksa ilk işaretli. */
  const ana = liste.findIndex(o => o.ana);
  liste.forEach((o, i) => { o.ana = i === (ana < 0 ? 0 : ana); });
  return { olcumler: liste };
}

/* Hazır şablonu okulda bul, yoksa oluştur. */
async function hazirSablon(me, anahtar) {
  const h = HAZIR_SABLONLAR[anahtar];
  if (!h) return null;
  const mevcut = (await depo.sinavlar.sablonlar(me.schoolId)).find(s => s.name === h.name);
  if (mevcut) return mevcut;
  /* Hazır şablon okulun ortak şablonudur: ilk kullanan öğretmenin olmaz,
     yalnızca müdür değiştirir ya da siler. */
  return depo.sinavlar.sablonEkle({
    id: uid('sb'), schoolId: me.schoolId, createdBy: '', name: h.name,
    olcumler: h.olcumler, createdAt: now()
  });
}

const sablonDuzenleyebilir = (me, s) => me.role === 'principal' || (!!s.createdBy && s.createdBy === me.id);

function sablonCevabi(me, s) {
  return {
    id: s.id, name: s.name, olcumler: s.olcumler, createdAt: s.createdAt,
    duzenleyebilir: sablonDuzenleyebilir(me, s)
  };
}

/* Sınavın ana ölçümü (ortalama ve eski "grades" alanı bunu kullanır). */
const anaOlcum = e => e.olcumler.find(o => o.ana) || e.olcumler[0] || null;

/* 100 üzerinden: 0-500 aralığında 400, 80 sayılır. */
function yuzluk(deger, o) {
  if (deger === null || deger === undefined || !o) return null;
  return (Number(deger) - Number(o.alt)) / (Number(o.ust) - Number(o.alt)) * 100;
}

const yuvarla = (n, basamak) => {
  const k = Math.pow(10, basamak === undefined ? 2 : basamak);
  return Math.round(n * k) / k;
};

function tarihDogrula(v) {
  const s = clean(v, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return '';
  const d = new Date(s + 'T00:00:00Z');
  return isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s ? '' : s;
}

function bugun() {
  const d = new Date();
  const p = n => (n < 10 ? '0' : '') + n;
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { res, me, body, q, p, segs, method, need } = k;

  /* ================= sınav grupları ================= */
  if (p === 'examgroups') {
    if (!need(null)) return;
    if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);

    if (method === 'GET' && !segs[2]) {
      const list = (await yilSuz(me, await depo.sinavlar.ogretmeninGruplari(me.id))).map(g => ({
        id: g.id, name: g.name, subject: g.subject, createdAt: g.createdAt,
        examCount: g._sinavSayisi,
        weightTotal: g._agirlikToplami
      }));
      return ok(res, { groups: list });
    }
    if (method === 'POST' && !segs[2]) {
      const name = clean(body.name, 100);
      if (!name) return bad(res, 'Grup adı gerekli (örn: Dönem 1 - Yarıyıl 1)');
      const g = {
        id: uid('g'), teacherId: me.id, schoolId: me.schoolId,
        subject: me.role === 'teacher' ? me.branch : (clean(body.subject, 60) || branchOf(me)),
        name, yilId: await yilDamgasi(me), createdAt: now()
      };
      if (!yetkiVarMi(me, 'sinav.olustur', { ders: g.subject })) return bad(res, 'Sınav açma yetkin yok', 403);
      await depo.sinavlar.grupEkle(g);
      return ok(res, { group: g });
    }

    const g = await depo.sinavlar.grupBul(clean(segs[2], 60));
    if (!g) return bad(res, 'Sınav grubu bulunamadı', 404);
    if (g.teacherId !== me.id) return bad(res, 'Yetkin yok', 403);

    if (method === 'GET') {
      const students = await ogretmeninOgrencileri(me);
      const gExams = await depo.sinavlar.grubun(g.id);
      const exams = gExams.map(e => ({
        id: e.id, name: e.name, weight: e.weight, tarih: e.tarih, templateName: e.templateName,
        graded: Object.keys(e.grades).length
      }));
      /* Ağırlıklı ortalama, her sınavın ana ölçümü 100 üzerinden alınarak. */
      const averages = students.map(s => {
        let ws = 0, wt = 0;
        gExams.forEach(e => {
          const v = yuzluk(e.grades[s.id], anaOlcum(e));
          if (v !== null) { ws += v * Number(e.weight); wt += Number(e.weight); }
        });
        return { id: s.id, fullName: s.fullName, average: wt > 0 ? yuvarla(ws / wt) : null };
      });
      return ok(res, { group: g, exams, averages });
    }
    if (method === 'POST' && segs[3] === 'delete') {
      await depo.sinavlar.grupSil(g.id);   // sınavları da gider
      return ok(res);
    }
    return;
  }

  if (p === 'exams') return sinavUclari(k);
  return false;
}

/* /api/exams: grafik, şablonlar ve sınavlar */
async function sinavUclari(k) {
  const { res, me, body, q, segs, method, need } = k;
  if (!need(null)) return;
  const alt = clean(segs[2], 60);

  /* ================= grafik =================
     Öğrenci kendisininkini, veli çocuğununkini, öğretmen ve müdür
     görebildiği öğrencininkini görür. */
  if (alt === 'grafik' && method === 'GET') {
    const oid = clean(q.get('ogrenci'), 60) || (me.role === 'student' ? me.id : '');
    if (!oid) return bad(res, 'Öğrenci seçmelisin');
    if (!await canSeeStudent(me, oid)) return bad(res, 'Bu öğrenciyi görme yetkin yok', 403);

    /* Okul personeli yalnızca kendi okulunda yapılan sınavları görür; öğrenci
       ve velisi (nakil öncesi okullar dahil) hepsini. */
    const okulSiniri = (me.role === 'student' || me.role === 'parent' || !me.schoolId) ? '' : me.schoolId;
    const sablonlar = await depo.sinavlar.ogrencininSablonlari(oid, okulSiniri);
    const istenen = clean(q.get('sablon'), 60);
    const secili = sablonlar.find(s => s.id === istenen) || sablonlar[0] || null;
    if (!secili) return ok(res, { sablonlar: [], sablonId: '', olcumler: [], sinavlar: [] });

    const seri = await depo.sinavlar.ogrencininSerisi(oid, secili.id, okulSiniri);
    const bant = await depo.sinavlar.bantlar(seri.sinavlar.map(s => s.id));
    return ok(res, {
      sablonlar: sablonlar.map(s => ({ id: s.id, name: s.ad })),
      sablonId: secili.id,
      olcumler: seri.olcumler,
      sinavlar: seri.sinavlar.map(s => Object.assign(s, { bant: bant[s.id] || {} }))
    });
  }

  if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);

  /* ================= şablonlar ================= */
  if (alt === 'sablonlar') {
    const sid = clean(segs[3], 60);

    if (!sid && method === 'GET') {
      const liste = await depo.sinavlar.sablonlar(me.schoolId);
      const adlar = new Set(liste.map(s => s.name));
      return ok(res, {
        sablonlar: liste.map(s => sablonCevabi(me, s)),
        /* Okulda aynı adla yoksa hazır şablonlar da önerilir. */
        hazir: Object.keys(HAZIR_SABLONLAR)
          .filter(k => !adlar.has(HAZIR_SABLONLAR[k].name))
          .map(k => ({ anahtar: k, name: HAZIR_SABLONLAR[k].name, olcumler: HAZIR_SABLONLAR[k].olcumler }))
      });
    }

    if (!sid && method === 'POST') {
      if (body.hazir) {
        const s = await hazirSablon(me, clean(body.hazir, 20));
        if (!s) return bad(res, 'Hazır şablon bulunamadı');
        return ok(res, { sablon: sablonCevabi(me, s) });
      }
      const name = clean(body.name, 60);
      if (!name) return bad(res, 'Şablon adı gerekli (örn: Yazılı (0-100))');
      const d = olcumleriDogrula(body.olcumler);
      if (d.hata) return bad(res, d.hata);
      if ((await depo.sinavlar.sablonlar(me.schoolId)).some(s => s.name === name)) {
        return bad(res, 'Bu adla bir şablon zaten var');
      }
      const s = await depo.sinavlar.sablonEkle({
        id: uid('sb'), schoolId: me.schoolId, createdBy: me.id, name, olcumler: d.olcumler, createdAt: now()
      });
      return ok(res, { sablon: sablonCevabi(me, s) });
    }

    const s = await depo.sinavlar.sablonBul(sid);
    if (!s || s.schoolId !== me.schoolId) return bad(res, 'Şablon bulunamadı', 404);
    if (method === 'GET') return ok(res, { sablon: sablonCevabi(me, s) });
    if (!sablonDuzenleyebilir(me, s)) return bad(res, 'Bu şablonu yalnızca açan kişi ya da müdür değiştirebilir', 403);

    if (method === 'POST' && segs[4] === 'delete') {
      /* Grafik aynı şablonla yapılmış sınavları yan yana koyar: kullanılmış
         şablon silinirse öğrencilerin grafiği boşalır. */
      const adet = await depo.sinavlar.sablonunSinavSayisi(s.id);
      if (adet) return bad(res, 'Bu şablonla yapılmış ' + adet + ' sınav var; öğrenci grafikleri bozulmasın diye silinemez. Adını ya da değer alanlarını değiştirebilirsin.');
      await depo.sinavlar.sablonSil(s.id);
      return ok(res);
    }
    if (method === 'POST' && !segs[4]) {
      const name = clean(body.name, 60) || s.name;
      const d = olcumleriDogrula(body.olcumler);
      if (d.hata) return bad(res, d.hata);
      if (name !== s.name && (await depo.sinavlar.sablonlar(me.schoolId)).some(x => x.name === name)) {
        return bad(res, 'Bu adla bir şablon zaten var');
      }
      return ok(res, { sablon: sablonCevabi(me, await depo.sinavlar.sablonGuncelle(s.id, name, d.olcumler)) });
    }
    return;
  }

  /* ================= sınavlar ================= */
  if (!alt && method === 'GET') {
    const liste = await yilSuz(me, await depo.sinavlar.ogretmenin(me.id));
    const grupAdlari = new Map((await depo.sinavlar.ogretmeninGruplari(me.id)).map(g => [g.id, g.name]));
    return ok(res, {
      exams: liste.map(e => ({
        id: e.id, name: e.name, tarih: e.tarih, subject: e.subject,
        groupId: e.groupId, groupName: grupAdlari.get(e.groupId) || '',
        templateId: e.templateId, templateName: e.templateName,
        olcumSayisi: e.olcumler.length, graded: Object.keys(e.grades).length
      }))
    });
  }

  if (!alt && method === 'POST') {
    const name = clean(body.name, 100);
    if (!name) return bad(res, 'Sınav adı gerekli');
    if (!yetkiVarMi(me, 'sinav.olustur')) return bad(res, 'Sınav açma yetkin yok', 403);

    /* Grup isteğe bağlı; gruptaysa etki oranı şart. */
    let g = null, weight = null;
    const grupId = clean(body.groupId, 60);
    if (grupId) {
      g = await depo.sinavlar.grupBul(grupId);
      if (!g || g.teacherId !== me.id) return bad(res, 'Sınav grubu bulunamadı');
      weight = ondalik(body.weight);
      if (weight === null || weight <= 0 || weight > 100) return bad(res, 'Etki oranı 0\'dan büyük, en fazla 100 olmalı');
    }

    /* Ölçümler: şablondan, elle girilen listeden ya da hazır "Yazılı (0-100)". */
    let sablon = null, olcumler;
    const sablonId = clean(body.templateId, 60);
    if (sablonId) {
      sablon = await depo.sinavlar.sablonBul(sablonId);
      if (!sablon || sablon.schoolId !== me.schoolId) return bad(res, 'Şablon bulunamadı');
      olcumler = sablon.olcumler;
    } else if (Array.isArray(body.olcumler)) {
      const d = olcumleriDogrula(body.olcumler);
      if (d.hata) return bad(res, d.hata);
      olcumler = d.olcumler;
    } else {
      sablon = await hazirSablon(me, clean(body.hazir, 20) || 'yazili');
      if (!sablon) return bad(res, 'Hazır şablon bulunamadı');
      olcumler = sablon.olcumler;
    }

    const tarih = body.tarih ? tarihDogrula(body.tarih) : bugun();
    if (!tarih) return bad(res, 'Tarih geçersiz');

    const ders = g ? g.subject : (me.role === 'teacher' ? me.branch : (clean(body.subject, 60) || branchOf(me)));
    if (!yetkiVarMi(me, 'sinav.olustur', { ders })) return bad(res, ders + ' dersinde sınav açma yetkin yok', 403);
    const e = await depo.sinavlar.ekle({
      id: uid('e'), schoolId: me.schoolId, groupId: g ? g.id : '', templateId: sablon ? sablon.id : '',
      teacherId: me.id, subject: ders,
      name, tarih, weight, yilId: await yilDamgasi(me), createdAt: now()
    }, olcumler);
    return ok(res, { exam: e });
  }

  const e = await depo.sinavlar.bul(alt);
  if (!e) return bad(res, 'Sınav bulunamadı', 404);
  if (e.teacherId !== me.id) return bad(res, 'Yetkin yok', 403);

  if (method === 'GET') {
    const [ogrenciler, siniflar, degerler] = await Promise.all([
      ogretmeninOgrencileri(me), ogretmeninSiniflari(me), depo.sinavlar.degerleri(e.id)
    ]);
    const sinifAdi = new Map(siniflar.map(c => [c.id, c.name]));
    const ana = anaOlcum(e);
    const g = e.groupId ? await depo.sinavlar.grupBul(e.groupId) : null;
    return ok(res, {
      exam: Object.assign({}, e, { groupName: g ? g.name : '' }),
      students: ogrenciler.map(s => {
        const d = {};
        for (const o of e.olcumler) {
          const v = degerler[o.id] ? degerler[o.id][s.id] : undefined;
          d[o.kod] = v === undefined ? null : v;
        }
        return {
          id: s.id, fullName: s.fullName, classId: s.classId, className: sinifAdi.get(s.classId) || '',
          grade: ana ? d[ana.kod] : null,
          degerler: d
        };
      })
    });
  }

  /* Değer girişi. İki biçim:
       { grades: { ogrenciId: 85 } }                       ana ölçüm (eski biçim)
       { degerler: { ogrenciId: { D: 18, Y: 2 } } }        ölçüm koduyla
     Boş değer kaydı siler. Aralık dışı ya da sayı olmayan değer yazılmaz,
     cevapta "atlanan" olarak döner. */
  if (method === 'POST' && segs[3] === 'grades') {
    if (!yetkiVarMi(me, 'sinav.not-gir', { ders: e.subject })) return bad(res, 'Not girme yetkin yok', 403);
    /* Rolde sınıf kapsamı varsa yalnızca o sınıfların öğrencileri. */
    const izinli = new Set((await ogretmeninOgrencileri(me))
      .filter(s => yetkiVarMi(me, 'sinav.not-gir', { ders: e.subject, sinif: s.classId })).map(s => s.id));
    const olcumKod = new Map(e.olcumler.map(o => [o.kod, o]));
    const ana = anaOlcum(e);
    const yazilacak = [];
    const hatalar = [];
    const degisen = new Set();

    const isle = (ogrenciId, o, v) => {
      if (!izinli.has(ogrenciId) || !o) return;
      if (v === null || v === '' || v === undefined) {
        yazilacak.push({ olcumId: o.id, ogrenciId, deger: null });
        return;
      }
      const n = ondalik(v);
      if (n === null || n < Number(o.alt) || n > Number(o.ust)) {
        hatalar.push(o.ad + ': ' + String(v).slice(0, 20) + ' (' + o.alt + ' ile ' + o.ust + ' arası olmalı)');
        return;
      }
      yazilacak.push({ olcumId: o.id, ogrenciId, deger: yuvarla(n, 3) });
      degisen.add(ogrenciId);
    };

    const grades = body.grades && typeof body.grades === 'object' ? body.grades : {};
    for (const sid in grades) isle(sid, ana, grades[sid]);
    const gelen = body.degerler && typeof body.degerler === 'object' ? body.degerler : {};
    for (const sid in gelen) {
      const satir = gelen[sid];
      if (!satir || typeof satir !== 'object') continue;
      for (const kod in satir) isle(sid, olcumKod.get(kod), satir[kod]);
    }

    await depo.sinavlar.degerleriYaz(yazilacak);
    /* Sonuç öğrenciye yalnızca ilk girildiğinde bildirilir; öğretmen bir
       değeri düzeltince ya da yeni alan ekleyince yeniden bildirim gitmez. */
    const ilk = await depo.genel.ilkKezOlanlar(Array.from(degisen).map(sid => 'sinav:' + e.id + ':' + sid));
    await topluBildir(Array.from(degisen).filter(sid => ilk.has('sinav:' + e.id + ':' + sid)),
      (e.subject ? e.subject + ' dersinden ' : '') + '"' + e.name + '" sınavının sonucu açıklandı.', '#/sinavlarim');
    return ok(res, { exam: await depo.sinavlar.bul(e.id), atlanan: hatalar.length, hatalar: hatalar.slice(0, 5) });
  }

  /* Ölçümleri düzenle: "+ Yeni değer ekle", ad ve aralık değiştirme, silme. */
  if (method === 'POST' && segs[3] === 'olcumler') {
    if (!yetkiVarMi(me, 'sinav.olustur', { ders: e.subject })) return bad(res, 'Sınav düzenleme yetkin yok', 403);
    const d = olcumleriDogrula(body.olcumler);
    if (d.hata) return bad(res, d.hata);
    const mevcut = new Set(e.olcumler.map(o => o.id));
    for (const o of d.olcumler) {
      if (o.id && !mevcut.has(o.id)) o.id = '';
      if (o.id) {
        const disarida = await depo.sinavlar.aralikDisi(o.id, o.alt, o.ust);
        if (disarida) {
          return bad(res, '"' + o.ad + '" için girilmiş ' + disarida + ' değer yeni aralığın dışında kalıyor');
        }
      }
    }
    return ok(res, { exam: await depo.sinavlar.olcumleriYaz(e.id, d.olcumler) });
  }

  if (method === 'POST' && segs[3] === 'delete') {
    if (!yetkiVarMi(me, 'sinav.olustur', { ders: e.subject })) return bad(res, 'Sınav silme yetkin yok', 403);
    await depo.sinavlar.sil(e.id);
    return ok(res);
  }
}

