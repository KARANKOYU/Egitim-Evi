'use strict';
/* Okul araması: büyük/küçük harfe, Türkçe harflere, yazım hatasına ve
   kısaltmaya dayanıklı.

   Ne yapar:
     - "rReNk", "RENK", "renk" aynıdır; "ö/ç/ş/ğ/ü/ı" yazılmasa da bulur.
     - Kelimeler sırasız aranır; her kelime okulun adında (ya da il/ilçesinde)
       geçmelidir: "renk ortaokulu" ile "ortaokulu renk" aynı sonucu verir.
     - Yazarken yarım kalan kelime baş kısmından tutar ("orta" -> "Ortaokulu").
     - Yazım hatası: 4-6 harfli kelimede 1, daha uzununda 2 harf farkı
       (eksik, fazla, yanlış ya da yer değiştirmiş harf) hoş görülür:
       "ortaoklu" -> "Ortaokulu", "anadlu" -> "Anadolu". Hata yalnızca kelime
       hiçbir okulda aynen ya da baş kısmıyla geçmiyorsa düzeltilir; düzeltilen
       kelimeler cevapta söylenir ("... diye aradık").
     - Kısaltmalar: AİHL, İHL, İHO, FL, AL, MTAL, SBL, GSL, OO, İO, BİLSEM, HEM, RAM.
     - Bitişik yazılmış kelimeler ayrılır: "ahmetvefikpasa" -> "ahmet vefik pasa".
     - Hiçbir okul bütün kelimeleri tutmuyorsa en çok kelimesi tutanlar
       "yakın sonuç" olarak döner.

   Hız: okul adlarındaki farklı kelimeler bir kez sözlüğe konur; her aranan
   kelime sözlükle (okullarla değil) karşılaştırılır, sonuç önbellekte tutulur.
   67 bin okulda bir arama birkaç milisaniye sürer. */

/* Türkçe harfler düzlenir, noktalama boşluğa döner, harf büyüklüğü düşer. */
function sade(metin) {
  return String(metin == null ? '' : metin)
    .replace(/[ıİI]/g, 'i')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const KISALTMALAR = {
  aihl: ['anadolu', 'imam', 'hatip', 'lisesi'],
  ihl: ['imam', 'hatip', 'lisesi'],
  iho: ['imam', 'hatip', 'ortaokulu'],
  fl: ['fen', 'lisesi'],
  al: ['anadolu', 'lisesi'],
  mtal: ['mesleki', 'teknik', 'anadolu', 'lisesi'],
  sbl: ['sosyal', 'bilimler', 'lisesi'],
  gsl: ['guzel', 'sanatlar', 'lisesi'],
  oo: ['ortaokulu'],
  io: ['ilkokulu'],
  bilsem: ['bilim', 'sanat', 'merkezi'],
  hem: ['halk', 'egitimi', 'merkezi'],
  ram: ['rehberlik', 'arastirma', 'merkezi']
};

/* Kısıtlı Damerau-Levenshtein uzaklığı (yer değiştiren iki harf tek hata).
   Uzaklık sınırı aşınca erken çıkar ve sinir + 1 döner. */
function uzaklik(a, b, sinir) {
  const n = a.length, m = b.length;
  if (Math.abs(n - m) > sinir) return sinir + 1;
  let r0 = new Array(m + 1), r1 = new Array(m + 1), r2 = new Array(m + 1);
  for (let j = 0; j <= m; j++) r1[j] = j;
  for (let i = 1; i <= n; i++) {
    r2[0] = i;
    let satirEnAz = i;
    for (let j = 1; j <= m; j++) {
      const bedel = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(r1[j] + 1, r2[j - 1] + 1, r1[j - 1] + bedel);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, r0[j - 2] + 1);
      r2[j] = v;
      if (v < satirEnAz) satirEnAz = v;
    }
    if (satirEnAz > sinir) return sinir + 1;
    const t = r0; r0 = r1; r1 = r2; r2 = t;
  }
  return r1[m];
}

const hataSiniri = k => (k.length >= 7 ? 2 : k.length >= 4 ? 1 : 0);

/* Aranan kelime ile sözlükteki kelimenin puanı (0: tutmuyor).
   Hatasız: aynı 10, baş kısmı 8 (tek harfse 6), içinde 5.
   Hatalı:  kelimenin tamamıyla 1 fark 5, 2 fark 3; yazılan kadarlık baş
            kısmıyla 1 fark 4, 2 fark 2. */
function hatasizPuan(k, w) {
  if (w === k) return 10;
  if (w.startsWith(k)) return k.length === 1 ? 6 : 8;
  if (k.length >= 3 && w.indexOf(k) >= 0) return 5;
  return 0;
}
function hataliPuan(k, w) {
  const sinir = hataSiniri(k);
  if (!sinir) return 0;
  const tam = uzaklik(k, w, sinir);
  if (tam <= sinir) return tam === 1 ? 5 : 3;
  if (w.length > k.length) {
    const bas = uzaklik(k, w.slice(0, k.length), sinir);
    if (bas <= sinir) return bas === 1 ? 4 : 2;
  }
  return 0;
}

