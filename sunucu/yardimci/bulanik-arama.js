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

/* kayitlar: [{ ad, yer }] — ad okulun adı, yer il ve ilçe (aranabilir ama
   daha az puanlı). Sözlük ve kelime listeleri bir kez kurulur. */
class AramaDizini {
  constructor(kayitlar) {
    this.adKelime = new Array(kayitlar.length);
    this.yerKelime = new Array(kayitlar.length);
    this.adGosterim = new Array(kayitlar.length);
    this.adSozluk = new Map();     // kelime -> okul sıraları
    this.yerSozluk = new Map();
    this.onbellek = new Map();
    for (let i = 0; i < kayitlar.length; i++) {
      const ad = String(kayitlar[i].ad || '');
      const adK = Array.from(new Set(sade(ad).split(' ').filter(Boolean)));
      const yerK = Array.from(new Set(sade(kayitlar[i].yer || '').split(' ').filter(Boolean)));
      this.adKelime[i] = adK;
      this.yerKelime[i] = yerK;
      /* Ekranda görünen kelimeler (boşlukla ayrılmış) ve her birinin sade parçaları: vurgulama için. */
      this.adGosterim[i] = ad.split(/\s+/).filter(Boolean).map(p => sade(p).split(' ').filter(Boolean));
      for (const w of adK) { if (!this.adSozluk.has(w)) this.adSozluk.set(w, []); this.adSozluk.get(w).push(i); }
      for (const w of yerK) { if (!this.yerSozluk.has(w)) this.yerSozluk.set(w, []); this.yerSozluk.get(w).push(i); }
    }
    this.adSozcukler = Array.from(this.adSozluk.keys());
    this.yerSozcukler = Array.from(this.yerSozluk.keys());
  }

  /* Bir aranan kelimenin sözlükte tuttuğu kelimeler ve puanları. Önce
     hatasız eşleşme aranır; hiç yoksa hatalı (yakın yazılmış) kelimeler. */
  kelimeCoz(k) {
    if (this.onbellek.has(k)) return this.onbellek.get(k);
    const ad = new Map(), yer = new Map();
    for (const w of this.adSozcukler) { const p = hatasizPuan(k, w); if (p) ad.set(w, p); }
    for (const w of this.yerSozcukler) { const p = hatasizPuan(k, w); if (p >= 8) yer.set(w, 3); }
    const acilim = KISALTMALAR[k] || null;
    let duzeltme = null;
    if (!ad.size && !yer.size && !acilim) {
      let enIyi = 0;
      for (const w of this.adSozcukler) {
        const p = hataliPuan(k, w);
        if (!p) continue;
        ad.set(w, p);
        /* Düzeltme önerisi: en yüksek puanlı, eşitse en çok okulda geçen kelime. */
        const n = this.adSozluk.get(w).length;
        if (p > enIyi || (p === enIyi && n > duzeltme.n)) { enIyi = p; duzeltme = { kelime: w, n }; }
      }
      for (const w of this.yerSozcukler) { if (hataliPuan(k, w) >= 4) yer.set(w, 2); }
      /* Düzeltilen kelime hatasız yazılmış gibi sayılır: "rReNk" araması
         "renk" aramasıyla aynı sıralamayı verir; yalnızca birkaç harfi
         benzeyen öbür kelimeler (Örenkaya, Erenköy) arkada kalır. Düzeltme
         sözlükte olan bir kelime olduğu için iç çağrı hatasız yoldan döner. */
      if (duzeltme) {
        const dogru = this.kelimeCoz(duzeltme.kelime);
        for (const [w, p] of dogru.ad) if (p > (ad.get(w) || 0)) ad.set(w, p);
        for (const [w, p] of dogru.yer) if (p > (yer.get(w) || 0)) yer.set(w, p);
      }
    }
    const sonuc = { ad, yer, acilim, duzeltme: duzeltme && duzeltme.kelime };
    if (this.onbellek.size > 2000) this.onbellek.delete(this.onbellek.keys().next().value);
    this.onbellek.set(k, sonuc);
    return sonuc;
  }

  /* Bitişik yazılmış kelimeyi sözlükteki kelimelere böler. Birden çok
     bölünüş olabilir ("vefikpasa" tek kelime de var, "vefik pasa" da):
     parçalarının hepsi aynı okulda geçen bölünüşlerden en çok okulu
     tutan seçilir. Yalnızca kelime olduğu gibi hiçbir yerde tutmuyorsa denenir. */
  bol(k) {
    if (k.length < 6 || k.length > 40) return null;
    const var_ = w => this.adSozluk.has(w) || this.yerSozluk.has(w);
    const adaylar = [];
    const gez = (bas, parcalar) => {
      if (adaylar.length >= 60 || parcalar.length > 5) return;
      if (bas === k.length) { if (parcalar.length > 1) adaylar.push(parcalar); return; }
      for (let son = Math.min(k.length, bas + 20); son >= bas + 2; son--) {
        const parca = k.slice(bas, son);
        if (var_(parca)) gez(son, parcalar.concat(parca));
      }
    };
    gez(0, []);
    let enIyi = null, enIyiSayi = 0;
    for (const parcalar of adaylar) {
      const listeler = parcalar.map(w => new Set((this.adSozluk.get(w) || []).concat(this.yerSozluk.get(w) || [])));
      listeler.sort((a, b) => a.size - b.size);
      let sayi = 0;
      for (const i of listeler[0]) if (listeler.every(l => l.has(i))) sayi++;
      if (sayi > enIyiSayi || (sayi === enIyiSayi && sayi && parcalar.length < enIyi.length)) { enIyi = parcalar; enIyiSayi = sayi; }
    }
    return enIyi;
  }

  /* i. okulun aranan kelimeye puanı ve adında tuttuğu kelimeler. */
  okulPuani(i, c, tutanlar) {
    let enIyi = 0;
    for (const w of this.adKelime[i]) {
      const p = c.ad.get(w);
      if (p) { tutanlar.add(w); if (p > enIyi) enIyi = p; }
    }
    if (c.acilim && c.acilim.every(w => this.adKelime[i].indexOf(w) >= 0)) {
      for (const w of c.acilim) tutanlar.add(w);
      enIyi = Math.max(enIyi, 9);
    }
    if (!enIyi) {
      for (const w of this.yerKelime[i]) { const p = c.yer.get(w); if (p > enIyi) enIyi = p; }
    }
    return enIyi;
  }

  /* Adaylar: aranan kelimelerden en az okulda geçenin okulları. */
  adaylar(cozumler, uygun) {
    let enAz = null, enAzBoy = Infinity;
    for (const c of cozumler) {
      let boy = 0;
      for (const w of c.ad.keys()) boy += this.adSozluk.get(w).length;
      for (const w of c.yer.keys()) boy += this.yerSozluk.get(w).length;
      if (c.acilim) boy += (this.adSozluk.get(c.acilim[c.acilim.length - 1]) || []).length;
      if (boy < enAzBoy) { enAzBoy = boy; enAz = c; }
    }
    const kume = new Set();
    for (const w of enAz.ad.keys()) for (const i of this.adSozluk.get(w)) kume.add(i);
    for (const w of enAz.yer.keys()) for (const i of this.yerSozluk.get(w)) kume.add(i);
    if (enAz.acilim) for (const i of this.adSozluk.get(enAz.acilim[enAz.acilim.length - 1]) || []) kume.add(i);
    return Array.from(kume).filter(uygun);
  }

  /* sorgu: yazılan metin; uygun(i): il/ilçe/tür süzgeci; sinir: en çok kaç sonuç.
     Dönen: { toplam, yakin, duzeltme, sonuclar: [{ i, puan, vurgu }] } */
  ara(sorgu, uygun, sinir) {
    uygun = uygun || (() => true);
    let kelimeler = Array.from(new Set(sade(sorgu).split(' ').filter(Boolean))).slice(0, 8);
    if (!kelimeler.length) return { toplam: 0, yakin: false, duzeltme: '', sonuclar: [] };
    /* Hiçbir yerde tutmayan uzun kelime bitişik yazılmış olabilir. */
    let bolundu = false;
    kelimeler = kelimeler.reduce((liste, k) => {
      const c = this.kelimeCoz(k);
      const parcalar = !c.acilim && (c.duzeltme || (!c.ad.size && !c.yer.size)) ? this.bol(k) : null;
      if (parcalar) { bolundu = true; return liste.concat(parcalar); }
      return liste.concat(k);
    }, []).slice(0, 10);
    const cozumler = kelimeler.map(k => this.kelimeCoz(k));

    const puanla = (i, enAzTutan) => {
      const tutanlar = new Set();
      let puan = 0, tutan = 0;
      for (const c of cozumler) {
        const p = this.okulPuani(i, c, tutanlar);
        if (p) { puan += p; tutan++; }
      }
      if (tutan < enAzTutan) return null;
      /* Ad aranan ilk kelimeyle başlıyorsa öne: yalnızca kelime aynen ya da
         baş kısmıyla tutuyorsa (içinde geçen ya da yakın yazılmış kelime
         "Örenkaya" gibi adları "Renk"in önüne geçirmesin). */
      const ilk = this.adKelime[i][0];
      if (ilk && (cozumler[0].ad.get(ilk) || 0) >= 8) puan += 3;
      puan -= this.adKelime[i].length * 0.1;                                  // kısa ad biraz önde
      return { i, puan, tutan, tutanlar };
    };

    let bulunan = [];
    const tamDolu = cozumler.every(c => c.ad.size || c.yer.size || c.acilim);
    if (tamDolu) {
      for (const i of this.adaylar(cozumler, uygun)) {
        const s = puanla(i, cozumler.length);
        if (s) bulunan.push(s);
      }
    }

    /* Hiçbir okul bütün kelimeleri tutmuyorsa: en çok kelimesi tutanlar. */
    let yakin = false;
    if (!bulunan.length && cozumler.length > 1) {
      const kume = new Set();
      for (const c of cozumler) {
        for (const w of c.ad.keys()) for (const i of this.adSozluk.get(w)) kume.add(i);
        if (c.acilim) for (const i of this.adSozluk.get(c.acilim[c.acilim.length - 1]) || []) kume.add(i);
      }
      let enCok = 1;
      for (const i of kume) {
        if (!uygun(i)) continue;
        const s = puanla(i, enCok);
        if (!s) continue;
        if (s.tutan > enCok) { enCok = s.tutan; bulunan = []; }
        bulunan.push(s);
      }
      yakin = bulunan.length > 0;
    }

    bulunan.sort((a, b) => b.tutan - a.tutan || b.puan - a.puan || a.i - b.i);
    const duzeltme = bolundu || cozumler.some(c => c.duzeltme)
      ? kelimeler.map((k, j) => cozumler[j].duzeltme || k).join(' ') : '';
    return {
      toplam: bulunan.length, yakin, duzeltme,
      sonuclar: bulunan.slice(0, sinir || 30).map(s => ({
        i: s.i, puan: s.puan,
        /* Ekranda koyu yazılacak kelimelerin sırası (adın boşlukla ayrılmış hâlinde). */
        vurgu: this.adGosterim[s.i].reduce((v, parcalar, j) => (parcalar.some(p => s.tutanlar.has(p)) ? v.concat(j) : v), [])
      }))
    };
  }
}

module.exports = { AramaDizini, sade, uzaklik };
