'use strict';
/* Quiz yardımcıları: saf işlevler (veritabanına, isteğe, saate dokunmaz).

     quizMetinTemizle(s, cokSatir)  Word'den ya da PDF'ten gelen görünmez
                                    karakterleri, özel boşlukları atar.
     quizMetniAyristir(metin)       "Metinden ekle" kutusuna yapıştırılan
                                    metin -> { sorular, hatalar }.
     quizDogrula(govde)             öğretmenin gönderdiği quiz -> { quiz } | { hata }
     puanHesapla(sorular, secimler) eşit ağırlık; açık uçlu puansız.
     denemeIlerlet(girdi)           sunucudaki süre: kapanan sorular, denemenin bitişi.

   quizMetinTemizle, quizMetniAyristir ve quizDogrula ES5 ile yazıldı: ön yüz
   aynı biçimi denetlemek isterse birebir kopyalayabilir (ya da sunucudaki
   POST /api/assignments/quiz-metin önizlemesini kullanır).

   Yapıştırma biçimi:
     1) Soru metni (sonraki satırlara taşabilir)
     *A) doğru şık
     B) yanlış şık
     C) *doğru şık            (yıldız şık harfinden sonra da olabilir)
     2) Güneş bir yıldızdır.
     Cevap: Doğru             (Doğru/Yanlış sorusu: Doğru | Yanlış | D | Y)
     3) Açık uçlu soru        (şıksız soru açık uçludur)
   Numara "1)" "1." "1-" (Word'ün uzun tiresiyle "1–" de), şık "A)" "a)" "A."
   biçiminde olabilir. Çoktan seçmelide en az bir doğru ve en az bir yanlış şık
   olmalı. */

var QUIZ_SINIR = {
  soru: 100, soruMetni: 1000, secenek: 300, secenekEnAz: 2, secenekEnCok: 10, cevap: 2000,
  soruSureEnAz: 10, soruSureEnCok: 600, quizDkEnAz: 1, quizDkEnCok: 180
};
var QUIZ_TURLERI = ['dy', 'coktan', 'acik'];
var QUIZ_SURE_TURLERI = ['yok', 'soru', 'quiz'];
var QUIZ_SONUC_GORUNUM = ['teslim', 'hemen'];
var QUIZ_PAY_MS = 3000;   // sunucuya geç ulaşan cevap için gecikme payı

/* Word'den gelen görünmez karakterler (sıfır genişlikli boşluk, yumuşak tire,
   yön işaretleri, BOM), özel boşluklar ve denetim karakterleri temizlenir.
   cokSatir değilse satır sonları boşluğa döner. */
function quizMetinTemizle(s, cokSatir) {
  if (typeof s === 'number' && isFinite(s)) s = String(s);
  if (typeof s !== 'string') return '';
  if (s.normalize) s = s.normalize('NFC');
  s = s.replace(/\r\n?/g, '\n')
    .replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000\t]/g, ' ')
    .replace(/[\u200B-\u200F\u2028\u2029\u202A-\u202E\u2060-\u2069\uFEFF\u00AD]/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  if (!cokSatir) s = s.replace(/\n+/g, ' ');
  var satirlar = s.split('\n');
  for (var i = 0; i < satirlar.length; i++) satirlar[i] = satirlar[i].replace(/ {2,}/g, ' ').replace(/^ +| +$/g, '');
  return satirlar.join('\n').replace(/\n{3,}/g, '\n\n').replace(/^\n+|\n+$/g, '');
}

/* "Doğru" / "Yanlış" / "D" / "Y" (büyük-küçük harf, Türkçe karaktersiz yazım). */
function quizDyDegeri(v) {
  var t = String(v || '').replace(/\u0130/g, 'i').replace(/I/g, '\u0131').toLowerCase().replace(/[\s.!]+$/g, '').replace(/^\s+/, '');
  if (t === 'doğru' || t === 'dogru' || t === 'd') return true;
  if (t === 'yanlış' || t === 'yanlis' || t === 'yanliş' || t === 'yanlıs' || t === 'y') return false;
  return null;
}

/* "3.5 kg" ya da "1-2 arası" gibi sayıyla başlayan satır soru sayılmasın diye
   nokta ve tireden sonra rakam gelemez. Word "1-" yazınca tireyi uzun tireye
   (– —) çevirebilir; o da kabul. */
var QUIZ_SORU_SATIRI = /^(\d{1,3})\s*(?:\)|[.\-–—](?!\d))\s*(.*)$/;
var QUIZ_SIK_SATIRI = /^(\*?)\s*([A-Za-z])\s*[).]\s*(\*?)\s*(.*)$/;
var QUIZ_CEVAP_SATIRI = /^cevap\s*[:\-–—]\s*(.*)$/i;
/* Şıkka benzeyen ama tanınmayan satırlar ("A- şık", "A: şık", ilk şıkkı B
   olan soru): önizlemede uyarı çıkar, satır yine soru metnine ya da önceki
   şıkka eklenir. "I." "V." "X." öncülleri ve "A-B arası" gibi yazılar uyarmaz. */
var QUIZ_SIK_BENZER = /^\*?\s*([A-Ja-j])(?:\s*[-–—]\s+|\s+[-–—]\s*|\s*:\s*)\S/;
var QUIZ_SIK_ILK_DEGIL = /^\*?\s*[B-HJb-hj]\s*[).]\s*\S/;
var QUIZ_HATA_EN_COK = 50;   // önizlemede gösterilen en fazla sorun (sonrası "ve N sorun daha")

/* Yapıştırılan metni sorulara ayırır. Hatalar satır numarasıyla döner
   ("3. soruda doğru şık işaretli değil"); hatalı soru da listede kalır,
   düzenleyicide düzeltilir. Dönen soru biçimi quizDogrula'nın beklediği gibi:
   { tur, metin, secenekler: [{ metin, dogru }], dogru (yalnız dy), satir }.
   Sorunun ilk şıkkı A (ya da a) olmalı: soru metnindeki "I. ..." "II. ..."
   öncülleri şık sanılmasın. J'den sonraki harf ancak sıradaki şıksa şık
   sayılır (11. şık "K)" ise "en fazla 10 şık" hatası çıkar). En fazla 50
   sorun listelenir; ilk sorudan önceki satırlar tek sorunda toplanır. */
function quizMetniAyristir(metin) {
  var satirlar = quizMetinTemizle(metin, true).split('\n');
  var sorular = [], hatalar = [], s = null, sonSik = null, fazla = false, once = null;
  function hata(satir, soru, mesaj) { hatalar.push({ satir: satir, soru: soru, mesaj: mesaj }); }

  for (var i = 0; i < satirlar.length; i++) {
    /* Word'ün ya da PDF'in yıldız benzerleri (∗ ＊ ✱) şık işaretinde düz yıldız sayılır. */
    var t = satirlar[i].replace(/^[∗＊✱]/, '*').replace(/^(\*?\s*[A-Za-z]\s*[).]\s*)[∗＊✱]/, '$1*');
    var no = i + 1, m;
    if (!t) continue;
    m = QUIZ_SORU_SATIRI.exec(t);
    if (m) {
      if (sorular.length >= QUIZ_SINIR.soru) {
        if (!fazla) hata(no, sorular.length + 1, 'En fazla ' + QUIZ_SINIR.soru + ' soru eklenebilir; sonrası alınmadı.');
        fazla = true; s = null; continue;
      }
      s = { tur: 'acik', metin: m[2], secenekler: [], dogru: null, satir: no, cevap: null };
      sorular.push(s); sonSik = null; continue;
    }
    if (fazla) continue;
    if (!s) {
      if (!once) once = { ilk: no, son: no, adet: 0 };
      once.son = no; once.adet++;
      continue;
    }
    m = QUIZ_SIK_SATIRI.exec(t);
    var harf = m ? m[2].toUpperCase() : '';
    var sikMi = !!m && s.cevap === null && (s.secenekler.length
      ? (harf <= 'J' || harf === String.fromCharCode(65 + s.secenekler.length)) : harf === 'A');
    if (sikMi) {
      sonSik = { metin: m[4], dogru: !!(m[1] || m[3]) };
      s.secenekler.push(sonSik); continue;
    }
    m = QUIZ_CEVAP_SATIRI.exec(t);
    if (m && s.cevap === null) { s.cevap = { deger: m[1], satir: no }; sonSik = null; continue; }
    var benzer = QUIZ_SIK_BENZER.exec(t);
    var sikBenzeri = benzer ? (s.secenekler.length > 0 || benzer[1] === 'A' || benzer[1] === 'a')
      : !s.secenekler.length && QUIZ_SIK_ILK_DEGIL.test(t);
    if (sonSik) {
      sonSik.metin += ' ' + t;
      if (sikBenzeri) hata(no, sorular.length, no + '. satır şıkka benziyor ama tanınmadı; önceki şıkka eklendi. Şıklar A) ya da A. biçiminde yazılır.');
    } else if (s.cevap !== null) hata(no, sorular.length, no + '. satır anlaşılamadı.');
    else {
      s.metin += (s.metin ? '\n' : '') + t;
      if (sikBenzeri) hata(no, sorular.length, no + '. satır şıkka benziyor ama tanınmadı; soru metnine eklendi. Şıklar A) ya da A. biçiminde yazılır ve A ile başlar.');
    }
  }
  if (once) {
    hata(once.ilk, 0, once.adet === 1 ? once.ilk + '. satır bir sorunun parçası değil; alınmadı.'
      : 'İlk sorudan önceki ' + once.adet + ' satır (' + once.ilk + '–' + once.son + '. satırlar) bir sorunun parçası değil; alınmadı.');
  }

  var cikti = [];
  for (var k = 0; k < sorular.length; k++) {
    var q = sorular[k], n = k + 1;
    var soru = { tur: 'acik', metin: q.metin.replace(/^\s+|\s+$/g, ''), secenekler: [], satir: q.satir };
    if (q.secenekler.length) {
      soru.tur = 'coktan';
      var dogruVar = false;
      for (var j = 0; j < q.secenekler.length; j++) {
        var c = q.secenekler[j], cm = c.metin.replace(/^\s+|\s+$/g, '');
        if (c.dogru) dogruVar = true;
        if (!cm) hata(q.satir, n, n + '. sorunun ' + (j + 1) + '. şıkkı boş.');
        else if (cm.length > QUIZ_SINIR.secenek) hata(q.satir, n, n + '. sorunun ' + (j + 1) + '. şıkkı ' + QUIZ_SINIR.secenek + ' karakterden uzun.');
        soru.secenekler.push({ metin: cm, dogru: !!c.dogru });
      }
      if (q.cevap) hata(q.cevap.satir, n, n + '. soruda "Cevap:" satırı yalnız Doğru/Yanlış sorusunda kullanılır; doğru şıkkı yıldızla (*) işaretle.');
      if (q.secenekler.length < QUIZ_SINIR.secenekEnAz) hata(q.satir, n, n + '. soruda en az ' + QUIZ_SINIR.secenekEnAz + ' şık olmalı.');
      if (q.secenekler.length > QUIZ_SINIR.secenekEnCok) hata(q.satir, n, n + '. soruda en fazla ' + QUIZ_SINIR.secenekEnCok + ' şık olabilir.');
      if (!dogruVar) hata(q.satir, n, n + '. soruda doğru şık işaretli değil.');
      else if (q.secenekler.length >= QUIZ_SINIR.secenekEnAz && quizHepsiDogru(q.secenekler)) hata(q.satir, n, n + '. ' + QUIZ_HEPSI_DOGRU_HATASI);
    } else if (q.cevap) {
      soru.tur = 'dy';
      soru.dogru = quizDyDegeri(q.cevap.deger);
      if (soru.dogru === null) hata(q.cevap.satir, n, n + '. sorunun cevabı anlaşılamadı; "Cevap: Doğru" ya da "Cevap: Yanlış" yaz.');
    }
    if (!soru.metin) hata(q.satir, n, n + '. sorunun metni boş.');
    else if (soru.metin.length > QUIZ_SINIR.soruMetni) hata(q.satir, n, n + '. sorunun metni ' + QUIZ_SINIR.soruMetni + ' karakterden uzun.');
    cikti.push(soru);
  }
  if (!cikti.length) hata(0, 0, 'Metinde soru bulunamadı. Her soru "1)" ya da "1." gibi bir numarayla başlamalı.');
  hatalar.sort(function (a, b) { return a.satir - b.satir; });
  if (hatalar.length > QUIZ_HATA_EN_COK) {
    var gizli = hatalar.length - QUIZ_HATA_EN_COK;
    hatalar = hatalar.slice(0, QUIZ_HATA_EN_COK);
    hatalar.push({ satir: 0, soru: 0, mesaj: 'Ve ' + gizli + ' sorun daha. Önce yukarıdakileri düzelt.' });
  }
  return { sorular: cikti, hatalar: hatalar };
}

/* Çoktan seçmeli soruda bütün şıklar doğru mu? Öyleyse öğrenci "birden çok
   şık seçebilirsin" notundan cevabı çıkarabilir (iki şıklı, iki doğrulu soru). */
var QUIZ_HEPSI_DOGRU_HATASI = 'soruda bütün şıklar doğru işaretli; en az bir şık yanlış olmalı.';
function quizHepsiDogru(secenekler) {
  for (var i = 0; i < secenekler.length; i++) if (!secenekler[i].dogru) return false;
  return secenekler.length > 0;
}

/* Tam sayı: 90 ya da "90". Değilse null. */
function quizTamSayi(v) {
  if (typeof v === 'number') return isFinite(v) && Math.floor(v) === v ? v : null;
  if (typeof v === 'string' && /^\s*\d{1,6}\s*$/.test(v)) return parseInt(v, 10);
  return null;
}

/* Öğretmenin gönderdiği quiz:
     { sureTuru: 'yok'|'soru'|'quiz', toplamDk (bütün quiz), cikincaKapanir,
       sonucGorunum: 'teslim'|'hemen',
       sorular: [{ tur, metin, sureSn (soru başına), dogru (dy), secenekler: [{ metin, dogru }] (coktan) }] }
   Doğruysa { quiz: { sureTuru, toplamSn, cikincaKapanir, sonucGorunum, sorular:
   [{ sira, tur, metin, sureSn, secenekler: [{ metin, dogru }] }] } } döner (Doğru/Yanlış
   sorusu "Doğru" ve "Yanlış" şıklarıyla); değilse { hata }. Metinler sessizce
   kırpılmaz: sınırı aşan metin hata verir. */
function quizDogrula(q) {
  var S = QUIZ_SINIR;
  if (!q || typeof q !== 'object' || Array.isArray(q)) return { hata: 'Quiz bilgisi okunamadı.' };
  var sureTuru = (q.sureTuru === undefined || q.sureTuru === null || q.sureTuru === '') ? 'yok' : q.sureTuru;
  if (QUIZ_SURE_TURLERI.indexOf(sureTuru) < 0) return { hata: 'Süre türü Süresiz, Soru başına ya da Bütün quiz olmalı.' };
  var toplamSn = null;
  if (sureTuru === 'quiz') {
    var dk = quizTamSayi(q.toplamDk);
    if (dk === null || dk < S.quizDkEnAz || dk > S.quizDkEnCok) {
      return { hata: 'Bütün quiz süresi ' + S.quizDkEnAz + ' ile ' + S.quizDkEnCok + ' dakika arasında olmalı.' };
    }
    toplamSn = dk * 60;
  }
  var sonucGorunum = (q.sonucGorunum === undefined || q.sonucGorunum === null || q.sonucGorunum === '') ? 'teslim' : q.sonucGorunum;
  if (QUIZ_SONUC_GORUNUM.indexOf(sonucGorunum) < 0) return { hata: 'Sonuçların ne zaman görüneceği seçilmeli.' };
  var ham = q.sorular;
  if (!Array.isArray(ham) || !ham.length) return { hata: 'Quizde en az bir soru olmalı.' };
  if (ham.length > S.soru) return { hata: 'Quizde en fazla ' + S.soru + ' soru olabilir.' };

  var sorular = [];
  for (var i = 0; i < ham.length; i++) {
    var n = i + 1, s = ham[i];
    if (!s || typeof s !== 'object' || Array.isArray(s)) return { hata: n + '. soru okunamadı.' };
    if (QUIZ_TURLERI.indexOf(s.tur) < 0) return { hata: n + '. sorunun türü seçilmeli (Doğru/Yanlış, çoktan seçmeli ya da açık uçlu).' };
    var metin = quizMetinTemizle(s.metin, true);
    if (!metin) return { hata: n + '. sorunun metni boş.' };
    if (metin.length > S.soruMetni) return { hata: n + '. sorunun metni en fazla ' + S.soruMetni + ' karakter olabilir.' };
    var sureSn = null;
    if (sureTuru === 'soru') {
      sureSn = quizTamSayi(s.sureSn);
      if (sureSn === null || sureSn < S.soruSureEnAz || sureSn > S.soruSureEnCok) {
        return { hata: n + '. sorunun süresi 10 saniye ile 10 dakika arasında olmalı.' };
      }
    }
    var secenekler = [];
    if (s.tur === 'dy') {
      if (typeof s.dogru !== 'boolean') return { hata: n + '. soruda doğru cevap (Doğru ya da Yanlış) seçilmeli.' };
      secenekler = [{ metin: 'Doğru', dogru: s.dogru }, { metin: 'Yanlış', dogru: !s.dogru }];
    } else if (s.tur === 'coktan') {
      var hs = s.secenekler;
      if (!Array.isArray(hs) || hs.length < S.secenekEnAz) return { hata: n + '. soruda en az ' + S.secenekEnAz + ' şık olmalı.' };
      if (hs.length > S.secenekEnCok) return { hata: n + '. soruda en fazla ' + S.secenekEnCok + ' şık olabilir.' };
      var dogruVar = false;
      for (var j = 0; j < hs.length; j++) {
        var c = hs[j];
        if (!c || typeof c !== 'object' || Array.isArray(c)) return { hata: n + '. sorunun ' + (j + 1) + '. şıkkı okunamadı.' };
        var cm = quizMetinTemizle(c.metin, false);
        if (!cm) return { hata: n + '. sorunun ' + (j + 1) + '. şıkkı boş.' };
        if (cm.length > S.secenek) return { hata: n + '. sorunun ' + (j + 1) + '. şıkkı en fazla ' + S.secenek + ' karakter olabilir.' };
        if (c.dogru === true) dogruVar = true;
        secenekler.push({ metin: cm, dogru: c.dogru === true });
      }
      if (!dogruVar) return { hata: n + '. soruda doğru şık işaretli değil.' };
      if (quizHepsiDogru(secenekler)) return { hata: n + '. ' + QUIZ_HEPSI_DOGRU_HATASI };
    }
    sorular.push({ sira: n, tur: s.tur, metin: metin, sureSn: sureSn, secenekler: secenekler });
  }
  return { quiz: { sureTuru: sureTuru, toplamSn: toplamSn, cikincaKapanir: q.cikincaKapanir === true,
    sonucGorunum: sonucGorunum, sorular: sorular } };
}

/* Puan: eşit ağırlık; yalnız Doğru/Yanlış ve çoktan seçmeli. Seçilen şıklar
   doğru şıklarla birebir aynıysa puan (kısmi puan yok; fazladan bir yanlış
   şık puanı sıfırlar). Açık uçlu puanlanmaz.
     sorular: [{ id, tur, secenekler: [{ id, dogru }] }]
     secimler: { soruId: [secenekId, ...] }
   Dönen: { dogru, puanli, acikUclu, yuzde, sorular: { soruId: true|false|null } } */
function puanHesapla(sorular, secimler) {
  let dogru = 0, puanli = 0, acikUclu = 0;
  const tek = {};
  for (const s of sorular) {
    if (s.tur === 'acik') { acikUclu++; tek[s.id] = null; continue; }
    puanli++;
    const d = s.secenekler.filter(c => c.dogru).map(c => c.id).sort();
    const sec = [...new Set((secimler && secimler[s.id]) || [])].sort();
    const tamam = d.length > 0 && sec.length === d.length && sec.every((x, i) => x === d[i]);
    if (tamam) dogru++;
    tek[s.id] = tamam;
  }
  return { dogru, puanli, acikUclu, yuzde: puanli ? Math.round(dogru / puanli * 100) : null, sorular: tek };
}

/* Denemenin süresi sunucuda işler; bağlantı kopsa da durmaz. Bu işlev bir
   denemenin şu anki hâlini hesaplar (okurken ve dakikalık temizlikte).
     g: { sureTuru, toplamSn, sorular: [{ id, sureSn }] (sırayla),
          deneme: { baslama, soruSira, soruBaslama } (ms),
          teslimSon: ms | null  (ödevin son teslim anı + 10 dk),
          kapali: ödev sonuçlandırıldı mı, simdi: ms }
   Soru başına sürede süresi (3 sn payla) geçen sorular sırayla kapanır; bir
   sonraki soru öncekinin süresinin bittiği anda başlamış sayılır. Bütün quiz
   süresi ya da son teslim + 10 dk dolunca deneme biter. Öğretmen quizi
   kapattıysa (kapali: ödev sonuçlandırıldı ya da sonuçlar açıldı) süresi
   dolmamış deneme şimdi biter; süresi daha önce dolduysa o anda ve o nedenle.
   Dönen: { kapananlar: [{ soruId, acilis, kapanis }], soruSira, soruBaslama,
            bitis: ms | null, neden: 'sure'|'teslim'|'sonuclandi'|null } */
function denemeIlerlet(g) {
  const sonuc = { kapananlar: [], soruSira: g.deneme.soruSira, soruBaslama: g.deneme.soruBaslama, bitis: null, neden: null };
  let son = Infinity, neden = null;
  if (g.sureTuru === 'quiz' && g.toplamSn) { son = g.deneme.baslama + g.toplamSn * 1000; neden = 'sure'; }
  if (g.teslimSon !== null && g.teslimSon !== undefined && g.teslimSon < son) { son = g.teslimSon; neden = 'teslim'; }
  if (g.sureTuru === 'soru') {
    let sira = g.deneme.soruSira, bas = g.deneme.soruBaslama;
    while (sira <= g.sorular.length) {
      const e = bas + (g.sorular[sira - 1].sureSn || 0) * 1000;
      if (e > son || g.simdi <= e + QUIZ_PAY_MS) break;
      sonuc.kapananlar.push({ soruId: g.sorular[sira - 1].id, acilis: bas, kapanis: e });
      bas = e; sira++;
    }
    sonuc.soruSira = sira; sonuc.soruBaslama = bas;
    if (sira > g.sorular.length) { sonuc.bitis = bas; sonuc.neden = 'sure'; return sonuc; }
  }
  if (g.simdi > son + QUIZ_PAY_MS) { sonuc.bitis = son; sonuc.neden = neden; return sonuc; }
  if (g.kapali) { sonuc.bitis = g.simdi; sonuc.neden = 'sonuclandi'; }
  return sonuc;
}

module.exports = {
  QUIZ_SINIR, QUIZ_TURLERI, QUIZ_SURE_TURLERI, QUIZ_SONUC_GORUNUM, QUIZ_PAY_MS, QUIZ_HATA_EN_COK,
  quizMetinTemizle, quizDyDegeri, quizMetniAyristir, quizTamSayi, quizDogrula, quizHepsiDogru, puanHesapla, denemeIlerlet
};
