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

