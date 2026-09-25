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

