'use strict';
/* Ödevin quizi (/api/assignments/:id/quiz...). Yönlendirme odev.js'de:
   öğrenci uçları rol kapısından ÖNCE, öğretmen uçları ödevin sahibi
   denetiminden SONRA (sahipsiz ödevde müdür). Özellik ("ödevler kapalı")
   ve arşiv kapıları 'assignments' yolundan gelir.

   Öğrenci:  GET  /:id/quiz              durum (başlamadıysa yalnız özet)
             POST /:id/quiz/basla        başlat ya da kaldığı yerden devam et (tek deneme)
             POST /:id/quiz/cevap        { soruId, secilenler: [şık], metin }
             POST /:id/quiz/sonraki      { soruId }  soru başına sürede sonraki soru
             POST /:id/quiz/bitir
             POST /:id/quiz/odak         { sure (sn), soruId }  sekmeden/uygulamadan ya da quiz sayfasından çıkıp döndü
   Öğretmen: GET  /:id/quiz              quizin tamamı (doğrularıyla), kilit bilgisi
             POST /:id/quiz              { quiz } yaz, { quiz: null } kaldır (öğrenci başladıysa kilitli)
             GET  /:id/quiz/ayrinti?ogrenci=  bir öğrencinin cevapları
             POST /:id/quiz/sonuc-ac     sonuçları öğrencilere şimdi aç (süren denemeler biter)
             POST /quiz-metin            { metin } yapıştırılan metnin önizlemesi (öğretmen başına 10 dk'da 300)

   Güvenlik:
     - Soru metinleri yalnız deneme başladıktan sonra gönderilir; soru başına
       sürede yalnız o anki soru.
     - Doğru şık bilgisi öğrenciye ancak kendi denemesi bitip sonuç açılınca
       gider; /progress'e, ödev nesnesine ve veliye hiç gitmez (veli yalnız
       durum ve sonuç açılınca puan görür).
     - Süre sunucuda işler (yardimci/quiz.js denemeIlerlet); bağlantı kopsa da
       durmaz. Süresi dolan deneme okunurken ve dakikalık temizlikte kapanır.
     - Sonuçlar herkese açılınca (öğretmen açtı ya da son teslimle açıldı ve
       bitiren gördü) açılış kalıcıdır (quizler.sonuc_acildi): yeni başlatma
       olmaz, süren denemeler biter; son teslim ileri alınsa da değişmez.
     - Sekme değiştirme istemcide algılanır (visibilitychange; quiz sayfasından
       uygulama içinde ayrılmak da çıkış sayılır); sunucu yalnız sayar ve
       "çıkınca o soru kapanır" seçeneğini uygular. Kayıt caydırıcıdır, kesin
       değildir: değiştirilmiş istemci hiç bildirmeyebilir. */

const { bad, ok, sendJSON } = require('../http');
const { hizSinir } = require('../guvenlik');
const { clean } = require('../ortak');
const { depo, islem } = require('../veri');
const { yetkiVarMi } = require('../yetki');
const Q = require('../yardimci/quiz');
const odevModulu = () => require('./odev');   // odev.js bu dosyayı geç yükler; döngü olmasın

const TESLIM_PAYI_MS = 10 * 60 * 1000;   // son teslimden sonra başlamış deneme bu kadar daha sürebilir

const ms = v => (v ? Date.parse(v) : null);
const iso = n => new Date(n).toISOString();
const iki = n => (n < 10 ? '0' : '') + n;
const tarihSaat = d => iki(d.getDate()) + '.' + iki(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + iki(d.getHours()) + ':' + iki(d.getMinutes());

/* Denemenin en geç bitebileceği an: son teslim + 10 dk (son tarih yoksa null). */
function teslimSonu(a) {
  const b = odevModulu().odevBitisAni(a);
  return b ? b.getTime() + TESLIM_PAYI_MS : null;
}

/* "Son teslimden sonra" seçiliyken son teslim + 10 dk geçti mi (o ana kadar
   bütün denemeler biter). */
function teslimleAcik(qz, a, simdi) {
  if (qz.sonucGorunum !== 'teslim') return false;
  const t = teslimSonu(a);
  return t !== null && simdi > t + Q.QUIZ_PAY_MS;
}

/* Sonuçlar herkese (öğretmen ekranı ve bitirmiş her öğrenci) açık mı:
   öğretmen açtı (ya da son teslimle açılış kalıcı oldu), ödev sonuçlandırıldı
   ya da son teslim + 10 dk geçti. */
function sonucGenelAcik(qz, a, simdi) {
  if (qz.sonucAcildi) return true;
  if (a.status === 'finished') return true;
  return teslimleAcik(qz, a, simdi);
}

/* Bu öğrencinin sonucu açık mı: kendi denemesi bitmeden hiç açılmaz;
   "Hemen" seçiliyse bitirince açılır. */
function sonucAcikMi(qz, a, d, simdi) {
  if (!d || !d.bitis) return false;
  return qz.sonucGorunum === 'hemen' || sonucGenelAcik(qz, a, simdi);
}

/* Öğrenci quizi başlatamıyorsa nedeni. */
function baslatmaEngeli(a, qz, simdi) {
  if (a.status !== 'active') return 'Ödev sonuçlandırıldı; quiz kapandı.';
  const bas = odevModulu().odevBaslamaAni(a);
  if (bas && simdi < bas.getTime()) return 'Quiz ' + tarihSaat(bas) + ' tarihinde açılacak.';
  const bit = odevModulu().odevBitisAni(a);
  if (bit && simdi > bit.getTime()) return 'Son teslim geçti; quiz başlatılamaz.';
  if (qz.sonucAcildi) return 'Quizin sonuçları açıklandı; artık başlatılamaz.';
  return '';
}

const cokluMu = s => s.tur === 'coktan' && s.secenekler.filter(c => c.dogru).length > 1;

/* Quizin herkese gidebilen özeti (soru metni ve doğru bilgisi yok). */
function quizOzeti(qz, sorular) {
  const acik = sorular.filter(s => s.tur === 'acik').length;
  return {
    sureTuru: qz.sureTuru, toplamSn: qz.toplamSn || null, toplamDk: qz.toplamSn ? qz.toplamSn / 60 : null,
    cikincaKapanir: !!qz.cikincaKapanir, sonucGorunum: qz.sonucGorunum,
    soruSayisi: sorular.length, acikUcluSayisi: acik, puanliSayisi: sorular.length - acik,
    soruSureToplami: qz.sureTuru === 'soru' ? sorular.reduce((t, s) => t + (s.sureSn || 0), 0) : null
  };
}

const sonucNesnesi = (d, acikUclu) => ({
  dogruSayisi: d.dogru || 0, puanliSayisi: d.puanli || 0, acikUcluSayisi: acikUclu,
  yuzde: d.puanli ? Math.round((d.dogru || 0) / d.puanli * 100) : null
});

/* ---------------- deneme: süre ve bitiş ---------------- */

/* Denemeyi bitirir: soru başına sürede o anki soru kapanır, puan hesaplanır. */
async function denemeyiBitir(a, qz, sorular, d, bitisMs, neden) {
  bitisMs = Math.max(bitisMs, ms(d.baslama));
  if (qz.sureTuru === 'soru' && d.soruSira <= sorular.length) {
    const s = sorular[d.soruSira - 1];
    const kapanma = neden === 'ogrenci' ? 'gecildi' : (neden === 'sure' || neden === 'teslim') ? 'sure' : neden === 'cikis' ? 'cikis' : null;
    await depo.quiz.soruKapat(a.id, d.ogrenciId, s.id, d.soruBaslama, iso(Math.max(bitisMs, ms(d.soruBaslama))), kapanma);
  }
  const secimler = {};
  for (const c of await depo.quiz.cevaplari(a.id, d.ogrenciId)) secimler[c.soruId] = c.secilenler;
  const p = Q.puanHesapla(sorular, secimler);
  d.bitis = iso(bitisMs); d.bitisNedeni = neden; d.dogru = p.dogru; d.puanli = p.puanli;
  await depo.quiz.denemeYaz(d);
}

/* Denemenin saatini ilerletir (işlem içinde, deneme satırı kilitliyken):
   süresi geçen sorular kapanır, süre ya da son teslim dolduysa deneme biter.
   Öğretmen quizi kapattıysa (ödevi sonuçlandırdı ya da sonuçları açtı) süren
   deneme o an biter: bitirenlerin gördüğü doğru cevaplarla cevap düzeltilmesin. */
async function ilerlet(a, qz, sorular, d, simdi) {
  if (d.bitis) return false;
  const r = Q.denemeIlerlet({
    sureTuru: qz.sureTuru, toplamSn: qz.toplamSn, sorular,
    deneme: { baslama: ms(d.baslama), soruSira: d.soruSira, soruBaslama: ms(d.soruBaslama) },
    teslimSon: teslimSonu(a), kapali: a.status !== 'active' || !!qz.sonucAcildi, simdi
  });
  let degisti = false;
  for (const k of r.kapananlar) {
    await depo.quiz.soruKapat(a.id, d.ogrenciId, k.soruId, iso(k.acilis), iso(k.kapanis), 'sure');
    degisti = true;
  }
  if (r.soruSira !== d.soruSira) { d.soruSira = r.soruSira; d.soruBaslama = iso(r.soruBaslama); degisti = true; }
  if (r.bitis !== null) { await denemeyiBitir(a, qz, sorular, d, r.bitis, r.neden); return true; }
  if (degisti) await depo.quiz.denemeYaz(d);
  return degisti;
}

/* Denemeyi kilitleyip saatini ilerletir; fn(d, simdi) aynı işlemde çalışır.
   Dönen: { d (güncel deneme ya da null), r (fn'nin dönüşü) }. Deneme bu
   sırada biterse sonuç bildirimi (açıksa) gider. */
async function denemeIsle(a, qz, sorular, ogrenciId, fn) {
  let bitti = false;
  const sonuc = await islem(async () => {
    const d = await depo.quiz.denemeBul(a.id, ogrenciId, true);
    const simdi = Date.now();
    if (!d) return { d: null, r: fn ? await fn(null, simdi) : null };
    const onceBitmis = !!d.bitis;
    await ilerlet(a, qz, sorular, d, simdi);
    const r = fn ? await fn(d, simdi) : null;
    bitti = !onceBitmis && !!d.bitis;
    return { d, r };
  });
  if (bitti) await sonuclariBildir([a.id]);
  return sonuc;
}

/* Süresi dolmuş açık denemeleri kapatır (dakikalık temizlik, öğretmen ekranı,
   ilerleyiş). odevIdler null ise bütün okullar. Dönen: kapanan sayısı. */
async function acikDenemeleriKapat(odevIdler) {
  if (odevIdler && !odevIdler.length) return 0;
  const simdi = Date.now();
  const kapanacak = (await depo.quiz.acikAdaylar(odevIdler)).filter(r => {
    if (r.durum !== 'active' || r.sonucAcildi) return true;
    let son = Infinity;
    if (r.sureTuru === 'quiz' && r.toplamSn) son = ms(r.baslama) + r.toplamSn * 1000;
    if (r.sureTuru === 'soru') son = Math.min(son, ms(r.soruBaslama) + r.kalanSn * 1000);
    const t = teslimSonu({ endAt: r.odevBitis, endTime: r.bitisSaati });
    if (t !== null) son = Math.min(son, t);
    return simdi > son + Q.QUIZ_PAY_MS;
  });
  const odevler = new Map();
  let kapanan = 0;
  for (const r of kapanacak) {
    let o = odevler.get(r.odevId);
    if (!o) {
      const [a, qz] = await Promise.all([depo.odevler.bul(r.odevId), depo.quiz.bul(r.odevId)]);
      if (!a || !qz) continue;
      o = { a, qz, sorular: await depo.quiz.sorulari(r.odevId) };
      odevler.set(r.odevId, o);
    }
    await islem(async () => {
      const d = await depo.quiz.denemeBul(r.odevId, r.ogrenciId, true);
      if (d && !d.bitis) { await ilerlet(o.a, o.qz, o.sorular, d, Date.now()); if (d.bitis) kapanan++; }
    });
  }
  if (odevler.size) await sonuclariBildir([...odevler.keys()]);
  return kapanan;
}

/* Sonucu açılan (ve henüz bildirilmemiş) her bitmiş deneme için öğrenciye
   bildirim; veliye kopyası gider. Dönen: giden bildirim sayısı. */
async function sonuclariBildir(odevIdler) {
  const simdi = Date.now();
  const adaylar = await depo.quiz.bildirimAdaylari(odevIdler);
  const acik = adaylar.filter(r => sonucAcikMi({ sonucAcildi: r.sonucAcildi, sonucGorunum: r.sonucGorunum },
    { status: r.durum, endAt: r.odevBitis, endTime: r.bitisSaati }, { bitis: r.bitis }, simdi));
  if (!acik.length) return 0;
  const isaretlenen = new Set((await depo.quiz.bildirildi(acik.map(r => [r.odevId, r.ogrenciId]))).map(x => x[0] + '|' + x[1]));
  const giden = acik.filter(r => isaretlenen.has(r.odevId + '|' + r.ogrenciId)).map(r => ({
    kime: r.ogrenciId, baglanti: '#/odevler',
    /* "Matematik dersinden "Oran orantı" quizinin sonucu açıklandı." (velisine de gider) */
    metin: r.ders + ' dersinden "' + r.baslik + '" quizinin sonucu açıklandı.'
  }));
  await depo.genel.cokluBildir(giden);
  return giden.length;
}

/* "Son teslimden sonra" seçili quizde sonuç son teslim + 10 dk geçince açılır.
   Bitirmiş biri doğru cevapları görebildiği an bu açılış kalıcı olur
   (quizler.sonuc_acildi): son teslim sonradan ileri alınsa da sonuçlar
   kapanmaz ve quiz yeniden başlatılamaz (doğru cevaplar dağılmıştır).
   odevIdler null ise bütün okullar. Dönen: kalıcı açılan quiz sayısı. */
async function teslimSonuclariniSabitle(odevIdler) {
  if (odevIdler && !odevIdler.length) return 0;
  const simdi = Date.now();
  let n = 0;
  for (const r of await depo.quiz.teslimAdaylari(odevIdler)) {
    if (teslimleAcik({ sonucGorunum: 'teslim' }, { endAt: r.odevBitis, endTime: r.bitisSaati }, simdi)) {
      await depo.quiz.sonucAc(r.odevId);
      n++;
    }
  }
  return n;
}

/* Dakikalık temizlik (index.js). */
async function quizTemizle() {
  await acikDenemeleriKapat(null);
  await sonuclariBildir(null);
  await teslimSonuclariniSabitle(null);
}

/* Öğretmen quizi kapattı (a sonuçlandırılmış ödev ya da qz sonucu açılmış
   quiz): süren denemeler şimdi biter (süresi zaten dolmuşsa o anda, nedeni
   "süre doldu"). Dönen: biten deneme sayısı. */
async function acikDenemeleriBitir(a, qz) {
  const sorular = await depo.quiz.sorulari(a.id);
  let biten = 0;
  for (const ogrenciId of await depo.quiz.acikDenemeler(a.id)) {
    await islem(async () => {
      const d = await depo.quiz.denemeBul(a.id, ogrenciId, true);
      if (d && !d.bitis) {
        await ilerlet(a, qz, sorular, d, Date.now());
        if (d.bitis) biten++;
      }
    });
  }
  return biten;
}

/* Ödev sonuçlandırıldı: quiz kapanır (yeni başlatma yok), açık denemeler biter,
   sonuçlar açılır. Bitiren varsa doğru cevaplar artık dağılmıştır: açılış
   kalıcı olur, "Tekrar aç" quizi bir daha başlatamaz (kopyaya karşı; tek hak).
   Dönen: giden sonuç bildirimi sayısı. */
async function odevSonuclandi(a) {
  const qz = await depo.quiz.bul(a.id);
  if (!qz) return 0;
  await acikDenemeleriBitir(a, qz);
  if ((await depo.quiz.denemeSayilari(a.id)).biten > 0) await depo.quiz.sonucAc(a.id);
  return sonuclariBildir([a.id]);
}

/* ---------------- görünümler ---------------- */

function denemeGorunumu(qz, sorular, a, d, simdi, cikisla) {
  let sonAn = null;
  if (qz.sureTuru === 'quiz' && qz.toplamSn) sonAn = ms(d.baslama) + qz.toplamSn * 1000;
  const t = teslimSonu(a);
  if (t !== null && (sonAn === null || t < sonAn)) sonAn = t;
  let soruBitis = null;
  if (qz.sureTuru === 'soru' && !d.bitis && d.soruSira <= sorular.length) {
    soruBitis = ms(d.soruBaslama) + (sorular[d.soruSira - 1].sureSn || 0) * 1000;
    if (sonAn !== null && sonAn < soruBitis) soruBitis = sonAn;
  }
  const g = {
    baslama: d.baslama, bitis: d.bitis, bitisNedeni: d.bitisNedeni,
    sonAn: sonAn === null ? null : iso(sonAn),
    soruSira: qz.sureTuru === 'soru' ? d.soruSira : null,
    soruBaslama: qz.sureTuru === 'soru' ? d.soruBaslama : null,
    soruBitis: soruBitis === null ? null : iso(soruBitis)
  };
  /* Sekme kaydı öğrencinin kendisine ve öğretmene; veliye gitmez. */
  if (cikisla) { g.cikisSayisi = d.cikisSayisi; g.cikisSn = d.cikisSn; }
  return g;
}

/* Öğrencinin gördüğü soru. sonuclu değilse doğru bilgisi YOK. */
function ogrenciSorusu(s, c, sonuclu, dogruMu) {
  const o = {
    id: s.id, sira: s.sira, tur: s.tur, metin: s.metin, coklu: cokluMu(s), sureSn: s.sureSn || null,
    secenekler: s.tur === 'acik' ? [] : s.secenekler.map(x => ({ id: x.id, metin: x.metin })),
    cevap: c && c.kayit ? { secilenler: c.secilenler, metin: c.metin, kayit: c.kayit } : null,
    kapandi: c && c.kapanis ? (c.kapandi || 'sure') : null
  };
  if (sonuclu) {
    o.dogruSecenekler = s.secenekler.filter(x => x.dogru).map(x => x.id);
    o.dogruMu = dogruMu === undefined ? null : dogruMu;
  }
  return o;
}

/* Öğrencinin quiz ekranı. sonTeslim: ödevin son teslim anı; sonucAcilis:
   "son teslimden sonra" seçiliyse sonucun açılacağı an (son teslim + 10 dk).
   Son tarihi olmayan ödevde ikisi de null (sonuç öğretmen açınca). */
async function ogrenciDurumu(a, qz, sorular, d, simdi) {
  simdi = simdi || Date.now();
  const bit = odevModulu().odevBitisAni(a), t = teslimSonu(a);
  const cikti = {
    quiz: quizOzeti(qz, sorular), simdi: iso(simdi),
    sonTeslim: bit ? bit.toISOString() : null,
    sonucAcilis: qz.sonucGorunum === 'teslim' && t !== null ? iso(t) : null,
    durum: !d ? 'baslamadi' : d.bitis ? 'bitti' : 'devam',
    baslatabilir: false, engel: '', deneme: null, sorular: [], sonucAcik: false, sonuc: null
  };
  if (!d) {
    cikti.engel = baslatmaEngeli(a, qz, simdi);
    cikti.baslatabilir = !cikti.engel;
    return cikti;
  }
  cikti.deneme = denemeGorunumu(qz, sorular, a, d, simdi, true);
  const cevaplar = new Map((await depo.quiz.cevaplari(a.id, d.ogrenciId)).map(c => [c.soruId, c]));
  if (!d.bitis) {
    const gosterilen = qz.sureTuru === 'soru' ? sorular.filter(s => s.sira === d.soruSira) : sorular;
    cikti.sorular = gosterilen.map(s => ogrenciSorusu(s, cevaplar.get(s.id), false));
    return cikti;
  }
  cikti.sonucAcik = sonucAcikMi(qz, a, d, simdi);
  if (cikti.sonucAcik) {
    /* Doğru cevaplar son teslimle ilk kez görünüyor: açılış kalıcı olur
       (dakikalık temizliği beklemeden; son teslim ileri alınırsa diye). */
    if (!qz.sonucAcildi && teslimleAcik(qz, a, simdi)) await depo.quiz.sonucAc(a.id);
    const secimler = {};
    for (const c of cevaplar.values()) secimler[c.soruId] = c.secilenler;
    const p = Q.puanHesapla(sorular, secimler);
    cikti.sonuc = sonucNesnesi(d, p.acikUclu);
    cikti.sorular = sorular.map(s => ogrenciSorusu(s, cevaplar.get(s.id), true, p.sorular[s.id]));
  }
  return cikti;
}

/* Öğretmenin quizi: düzenleyiciye geri yüklenebilir biçimde, doğrularıyla. */
async function ogretmenQuizi(a) {
  const qz = await depo.quiz.bul(a.id);
  if (!qz) return null;
  const [sorular, sayi] = await Promise.all([depo.quiz.sorulari(a.id), depo.quiz.denemeSayilari(a.id)]);
  const baslayan = sayi.baslayan;
  /* sonucAcildi: sonuçlar kalıcı açık (öğretmen açtı ya da son teslimle açıldı);
     biten: denemesi bitmiş öğrenci sayısı ("Tekrar aç" uyarısı için). */
  return Object.assign(quizOzeti(qz, sorular), {
    sonucAcildi: qz.sonucAcildi, sonucAcik: sonucGenelAcik(qz, a, Date.now()),
    baslayan, biten: sayi.biten, kilitli: baslayan > 0,
    sorular: sorular.map(s => {
      const o = { id: s.id, sira: s.sira, tur: s.tur, metin: s.metin, sureSn: s.sureSn || null, coklu: cokluMu(s),
        secenekler: s.secenekler.map(x => ({ id: x.id, metin: x.metin, dogru: x.dogru })) };
      if (s.tur === 'dy') o.dogru = !!(s.secenekler[0] && s.secenekler[0].dogru);
      return o;
    })
  });
}

/* Öğretmen ekranındaki öğrenci satırları: ödevin quizi yoksa null. Süresi
   dolmuş denemeler önce kapanır. Dönen: ogrenciId -> özet. */
async function ogrenciOzetleri(a) {
  const qz = await depo.quiz.bul(a.id);
  if (!qz) return null;
  await acikDenemeleriKapat([a.id]);
  const [sorular, denemeler] = await Promise.all([depo.quiz.sorulari(a.id), depo.quiz.odevinDenemeleri(a.id)]);
  const acik = sorular.filter(s => s.tur === 'acik').length;
  const harita = new Map();
  for (const d of denemeler) {
    harita.set(d.ogrenciId, {
      durum: d.bitis ? 'bitti' : 'devam', baslama: d.baslama, bitis: d.bitis, bitisNedeni: d.bitisNedeni,
      cikisSayisi: d.cikisSayisi, cikisSn: d.cikisSn,
      sonuc: d.bitis ? sonucNesnesi(d, acik) : null
    });
  }
  return harita;
}

/* Liste rozetleri (öğretmen, müdür): ödev id -> kısa özet. */
async function listeOzetleri(odevIdler) {
  const harita = new Map();
  for (const [id, o] of await depo.quiz.ozetler(odevIdler)) {
    harita.set(id, { soruSayisi: o.soruSayisi, sureTuru: o.sureTuru, toplamSn: o.toplamSn || null,
      soruSureToplami: o.sureTuru === 'soru' ? o.soruSureToplami : null, baslayan: o.baslayan, biten: o.biten });
  }
  return harita;
}

/* İlerleyiş (öğrenci, veli, öğretmen, müdür): ödev id -> özet. Soru, şık,
   doğru bilgisi ve sekme kaydı YOK; puan yalnız sonuç açılınca. */
async function ilerleyisOzetleri(ogrenciId, odevler) {
  const harita = new Map();
  if (!odevler.length) return harita;
  const ozet = await depo.quiz.ozetler(odevler.map(a => a.id));
  if (!ozet.size) return harita;
  const quizli = odevler.filter(a => ozet.has(a.id));
  let denemeler = await depo.quiz.ogrencininDenemeleri(ogrenciId, quizli.map(a => a.id));
  const acikOlan = [...denemeler.values()].filter(d => !d.bitis).map(d => d.odevId);
  if (acikOlan.length && await acikDenemeleriKapat(acikOlan)) {
    denemeler = await depo.quiz.ogrencininDenemeleri(ogrenciId, quizli.map(a => a.id));
  }
  const simdi = Date.now();
  for (const a of quizli) {
    const o = ozet.get(a.id), d = denemeler.get(a.id) || null;
    const acik = sonucAcikMi(o, a, d, simdi);
    harita.set(a.id, {
      soruSayisi: o.soruSayisi, sureTuru: o.sureTuru, toplamSn: o.toplamSn || null,
      soruSureToplami: o.sureTuru === 'soru' ? o.soruSureToplami : null,
      durum: !d ? 'baslamadi' : d.bitis ? 'bitti' : 'devam',
      sonucAcik: acik, sonuc: acik ? sonucNesnesi(d, o.acikUcluSayisi) : null
    });
  }
  return harita;
}

/* ---------------- uçlar ---------------- */

/* 409: deneme bitti ya da soru kapandı; güncel durum da gider (istemci yeniler). */
async function durumHatasi(res, mesaj, a, qz, sorular, d) {
  return sendJSON(res, 409, { error: mesaj, kapandi: true, durum: await ogrenciDurumu(a, qz, sorular, d) });
}

async function ogrenciUcu(k) {
  const { res, me, body, segs, method } = k;
  const alt = segs[4] || '';
  const a = await depo.odevler.bul(clean(segs[2], 60));
  if (!a || a.studentIds.indexOf(me.id) < 0) return bad(res, 'Ödev bulunamadı', 404);
  let qz = await depo.quiz.bul(a.id);
  if (!qz) return sendJSON(res, 404, { error: 'Bu ödevde quiz yok.', quizYok: true });
  let sorular = await depo.quiz.sorulari(a.id);

  if (method === 'GET' && !alt) {
    const { d } = await denemeIsle(a, qz, sorular, me.id);
    return ok(res, await ogrenciDurumu(a, qz, sorular, d));
  }
  if (method !== 'POST') return bad(res, 'Böyle bir adres yok', 404);

  if (alt === 'basla') {
    if (!hizSinir('quizBasla:' + me.id, 30, 10 * 60 * 1000)) return bad(res, 'Çok fazla deneme; biraz bekleyip tekrar dene.', 429);
    if (!await depo.quiz.denemeBul(a.id, me.id)) {
      const engel = baslatmaEngeli(a, qz, Date.now());
      if (engel) return sendJSON(res, 400, { error: engel, baslatilamaz: true });
      /* Tek deneme: aynı anda gelen ikinci "Başlat" yeni satır açmaz, var olanı döndürür. */
      if (await depo.quiz.denemeBaslat(a.id, me.id)) await depo.odevler.acildi(a.id, me.id);
      /* Öğretmen quizi tam bu sırada değiştirdiyse ya da sonuçları açtıysa
         güncel hâli okunur: deneme satırı quiz satırının kilidini bekleyerek
         yazıldığı için buradan sonra okunan quiz güncel (eski sorular gitmez;
         sonuçlar açıldıysa deneme hemen biter). */
      qz = await depo.quiz.bul(a.id);
      if (!qz) return sendJSON(res, 404, { error: 'Bu ödevde quiz yok.', quizYok: true });
      sorular = await depo.quiz.sorulari(a.id);
    }
    const { d } = await denemeIsle(a, qz, sorular, me.id);
    return ok(res, await ogrenciDurumu(a, qz, sorular, d));
  }

  if (alt === 'cevap') {
    if (!hizSinir('quizCevap:' + me.id, 600, 10 * 60 * 1000)) return bad(res, 'Çok fazla istek; biraz bekleyip tekrar dene.', 429);
    const s = sorular.find(x => x.id === clean(body.soruId, 40));
    if (!s) return bad(res, 'Soru bulunamadı', 404);
    let secilenler = [], metin = '';
    if (s.tur === 'acik') {
      if (body.metin !== undefined && body.metin !== null && typeof body.metin !== 'string') return bad(res, 'Cevap okunamadı.');
      metin = Q.quizMetinTemizle(body.metin, true);
      if (metin.length > Q.QUIZ_SINIR.cevap) return bad(res, 'Cevap en fazla ' + Q.QUIZ_SINIR.cevap + ' karakter olabilir.');
    } else {
      if (!Array.isArray(body.secilenler)) return bad(res, 'Seçilen şıklar okunamadı.');
      secilenler = [...new Set(body.secilenler.map(x => (typeof x === 'string' ? x : '')))];
      const idler = new Set(s.secenekler.map(c => c.id));
      if (secilenler.some(x => !idler.has(x))) return bad(res, 'Seçilen şık bu soruya ait değil.');
      if (!cokluMu(s) && secilenler.length > 1) return bad(res, 'Bu soruda yalnız bir şık seçilebilir.');
    }
    const { d, r } = await denemeIsle(a, qz, sorular, me.id, async (d) => {
      if (!d) return { hata: 'Quiz başlamadı.' };
      if (d.bitis) return { kapali: 'Quiz bitti; cevap değiştirilemez.' };
      if (qz.sureTuru === 'soru' && s.sira !== d.soruSira) return { kapali: 'Bu sorunun süresi doldu; cevap değiştirilemez.' };
      const kayit = await depo.quiz.cevapYaz(a.id, me.id, s.id, secilenler, metin);
      if (!kayit) return { kapali: 'Bu soru kapandı; cevap değiştirilemez.' };
      return { kayit };
    });
    if (r.hata) return bad(res, r.hata);
    if (r.kapali) return durumHatasi(res, r.kapali, a, qz, sorular, d);
    return ok(res, { kaydedildi: r.kayit, soruId: s.id });
  }

  if (alt === 'sonraki') {
    if (qz.sureTuru !== 'soru') return bad(res, 'Bu quizde sorular arasında serbestçe geçilir.');
    const soruId = clean(body.soruId, 40);
    const { d, r } = await denemeIsle(a, qz, sorular, me.id, async (d, simdi) => {
      if (!d) return { hata: 'Quiz başlamadı.' };
      const s = sorular[d.soruSira - 1];
      /* Süre dolup sonraki soruya zaten geçildiyse güncel durum döner. */
      if (d.bitis || !s || s.id !== soruId) return {};
      const e = ms(d.soruBaslama) + s.sureSn * 1000;
      const kapanis = Math.min(simdi, e);
      await depo.quiz.soruKapat(a.id, me.id, s.id, d.soruBaslama, iso(kapanis), simdi >= e ? 'sure' : 'gecildi');
      if (d.soruSira >= sorular.length) {
        d.soruSira = sorular.length + 1;
        await denemeyiBitir(a, qz, sorular, d, kapanis, simdi >= e ? 'sure' : 'ogrenci');
      } else {
        d.soruSira++; d.soruBaslama = iso(kapanis);
        await depo.quiz.denemeYaz(d);
      }
      return {};
    });
    if (r.hata) return bad(res, r.hata);
    return ok(res, await ogrenciDurumu(a, qz, sorular, d));
  }

  if (alt === 'bitir') {
    const { d, r } = await denemeIsle(a, qz, sorular, me.id, async (d, simdi) => {
      if (!d) return { hata: 'Quiz başlamadı.' };
      if (d.bitis) return {};
      await denemeyiBitir(a, qz, sorular, d, simdi, 'ogrenci');
      return {};
    });
    if (r.hata) return bad(res, r.hata);
    return ok(res, await ogrenciDurumu(a, qz, sorular, d));
  }

  /* Sekmeden, uygulamadan ya da quiz sayfasından çıkıp döndü: { sure: kaç
     saniye dışarıdaydı, soruId: çıkarken ekrandaki soru }. 2 saniyeden kısası
     sayılmaz. "Çıkınca o soru kapanır" açıksa kapanacak soruyu sunucu seçer:
     soru başına sürede kendi kaydından (istemcinin soruId'si kullanılmaz),
     serbest modda ekrandaki soru; soruId bu quizin sorusu değilse öğrencinin
     en son cevapladığı açık soru. Algılama tarayıcıda yapılır: kayıt
     caydırıcıdır, kesin değildir. */
  if (alt === 'odak') {
    if (!hizSinir('quizOdak:' + me.id, 120, 10 * 60 * 1000)) return bad(res, 'Çok fazla istek; biraz bekleyip tekrar dene.', 429);
    const sure = typeof body.sure === 'number' ? body.sure : Number(body.sure);
    if (!isFinite(sure) || sure < 0 || body.sure === null || body.sure === '' || typeof body.sure === 'object') {
      return bad(res, 'Süre okunamadı.');
    }
    const soruId = clean(body.soruId, 40);
    const { d, r } = await denemeIsle(a, qz, sorular, me.id, async (d, simdi) => {
      if (!d) return { hata: 'Quiz başlamadı.' };
      /* Dışarıda geçen süre denemenin süresini aşamaz (toplamı da). */
      const gecen = Math.max(0, Math.round((simdi - ms(d.baslama)) / 1000));
      const sn = Math.min(Math.round(sure), gecen);
      /* Deneme bittikten sonra başlayan çıkış sayılmaz. */
      if (sn < 2 || (d.bitis && simdi - sn * 1000 > ms(d.bitis))) return { sayildi: false };
      d.cikisSayisi++; d.cikisSn = Math.min(d.cikisSn + sn, gecen);
      let kapanan = null;
      if (!d.bitis && qz.cikincaKapanir) {
        if (qz.sureTuru === 'soru') {
          /* Şu anki soru çıkıştan önce açıldıysa çıkarken ekrandaydı. Çıkarken
             açık olan soru dışarıdayken süresi dolup kapandıysa, sonraki soru
             öğrenci dışarıdayken açılmıştır; o kapanmaz. */
          const s = sorular[d.soruSira - 1];
          if (s && ms(d.soruBaslama) <= simdi - sn * 1000) {
            await depo.quiz.soruKapat(a.id, me.id, s.id, d.soruBaslama, iso(simdi), 'cikis');
            kapanan = s.id;
            if (d.soruSira >= sorular.length) {
              d.soruSira = sorular.length + 1;
              await denemeyiBitir(a, qz, sorular, d, simdi, 'cikis');
            } else { d.soruSira++; d.soruBaslama = iso(simdi); }
          }
        } else {
          let s = soruId ? sorular.find(x => x.id === soruId) : null;
          if (!s) {
            /* soruId yok ya da uydurma: en son cevaplanan açık soru (yoksa ilk açık soru). */
            const cevaplar = await depo.quiz.cevaplari(a.id, me.id);
            const kapali = new Set(cevaplar.filter(c => c.kapanis).map(c => c.soruId));
            const son = cevaplar.filter(c => c.kayit && !c.kapanis).sort((x, y) => ms(y.kayit) - ms(x.kayit))[0];
            s = son ? sorular.find(x => x.id === son.soruId) : sorular.find(x => !kapali.has(x.id));
          }
          if (s && await depo.quiz.soruKapat(a.id, me.id, s.id, null, iso(simdi), 'cikis')) {
            kapanan = s.id;
            /* Bütün sorular kapandıysa yapılacak bir şey kalmadı: deneme biter. */
            if (await depo.quiz.kapaliSoruSayisi(a.id, me.id) >= sorular.length) await denemeyiBitir(a, qz, sorular, d, simdi, 'cikis');
          }
        }
      }
      await depo.quiz.denemeYaz(d);
      return { sayildi: true, kapanan };
    });
    if (r.hata) return bad(res, r.hata);
    return ok(res, Object.assign(await ogrenciDurumu(a, qz, sorular, d), { cikisSayildi: !!r.sayildi, kapananSoru: r.kapanan || null }));
  }

  return bad(res, 'Böyle bir adres yok', 404);
}

/* Yapıştırılan metnin önizlemesi (öğretmen, müdür). */
function metinUcu(k) {
  const { res, me, body } = k;
  /* Önizleme yazmayı bırakınca istenir (0,7 sn); 10 dakikada 300 istek yeter. */
  if (!hizSinir('quizMetin:' + me.id, 300, 10 * 60 * 1000)) return bad(res, 'Çok fazla istek; biraz bekleyip tekrar dene.', 429);
  if (typeof body.metin !== 'string' || !body.metin.trim()) return bad(res, 'Yapıştırılacak metin boş.');
  if (body.metin.length > 300000) return bad(res, 'Metin çok uzun; soruları parça parça ekle.');
  return ok(res, Q.quizMetniAyristir(body.metin));
}

/* Ödevin sahibi (ya da sahipsiz ödevde müdür) için quiz uçları. */
async function ogretmenUcu(k, a) {
  const { res, me, body, q, segs, method } = k;
  const alt = segs[4] || '';

  if (method === 'GET' && !alt) return ok(res, { quiz: await ogretmenQuizi(a) });

  /* Quizi yaz ya da kaldır. Öğrencilerden biri başladıysa quiz kilitlenir. */
  if (method === 'POST' && !alt) {
    if (!yetkiVarMi(me, 'odev.ver', { ders: a.subject })) return bad(res, 'Bu ödevin quizini düzenleme yetkin yok', 403);
    let v = null;
    if (body.quiz !== null) {
      v = Q.quizDogrula(body.quiz);
      if (v.hata) return bad(res, v.hata);
    }
    const baslayan = await islem(async () => {
      await depo.quiz.kilitle(a.id);
      const n = await depo.quiz.denemeSayisi(a.id);
      if (n) return n;
      if (v) await depo.quiz.yaz(a.id, v.quiz);
      else await depo.quiz.sil(a.id);
      return 0;
    });
    if (baslayan) {
      return sendJSON(res, 409, { error: baslayan + ' öğrenci başladı; quiz artık değiştirilemez.', kilitli: true, baslayan });
    }
    return ok(res, { quiz: await ogretmenQuizi(a) });
  }

  const qz = await depo.quiz.bul(a.id);
  if (!qz) return sendJSON(res, 404, { error: 'Bu ödevde quiz yok.', quizYok: true });

  /* Bir öğrencinin cevapları: doğru cevap, yanlışlar, açık uçlu metin,
     soru başına geçen süre ve kapanma nedeni, sekme kaydı. */
  if (method === 'GET' && alt === 'ayrinti') {
    const ogrenciId = clean(q.get('ogrenci'), 60);
    if (!ogrenciId || a.studentIds.indexOf(ogrenciId) < 0) return bad(res, 'Öğrenci bu ödevde değil', 404);
    const sorular = await depo.quiz.sorulari(a.id);
    const [{ d }, ogrenci] = await Promise.all([denemeIsle(a, qz, sorular, ogrenciId), depo.kullanicilar.bul(ogrenciId)]);
    const cevaplar = new Map(d ? (await depo.quiz.cevaplari(a.id, ogrenciId)).map(c => [c.soruId, c]) : []);
    const secimler = {};
    for (const c of cevaplar.values()) secimler[c.soruId] = c.secilenler;
    const p = Q.puanHesapla(sorular, secimler);
    return ok(res, {
      ogrenci: { id: ogrenciId, fullName: ogrenci ? ogrenci.fullName : '(silinmiş öğrenci)' },
      quiz: quizOzeti(qz, sorular),
      durum: !d ? 'baslamadi' : d.bitis ? 'bitti' : 'devam',
      deneme: d ? denemeGorunumu(qz, sorular, a, d, Date.now(), true) : null,
      sonuc: d && d.bitis ? sonucNesnesi(d, p.acikUclu) : null,
      sorular: sorular.map(s => {
        const c = cevaplar.get(s.id);
        return {
          id: s.id, sira: s.sira, tur: s.tur, metin: s.metin, coklu: cokluMu(s), sureSn: s.sureSn || null,
          secenekler: s.secenekler.map(x => ({ id: x.id, metin: x.metin, dogru: x.dogru })),
          dogruSecenekler: s.secenekler.filter(x => x.dogru).map(x => x.id),
          cevap: c && c.kayit ? { secilenler: c.secilenler, metin: c.metin, kayit: c.kayit } : null,
          /* Açık uçlu puanlanmaz: null. Cevapsız puanlı soru yanlış sayılır. */
          dogruMu: d ? p.sorular[s.id] : null,
          gecenSn: c && c.acilis && c.kapanis ? Math.max(0, Math.round((ms(c.kapanis) - ms(c.acilis)) / 1000)) : null,
          kapandi: c && c.kapanis ? (c.kapandi || null) : null
        };
      })
    });
  }

  /* Sonuçları şimdi aç: yeni başlatma kapanır, çözmekte olanların denemesi
     o an biter (bitirenlerin gördüğü doğru cevaplarla cevap düzeltilmesin).
     Dönen: biten (kapanan deneme sayısı), bildirilen. */
  if (method === 'POST' && alt === 'sonuc-ac') {
    if (!yetkiVarMi(me, 'odev.sonuclandir', { ders: a.subject })) return bad(res, 'Bu ödevin sonuçlarını açma yetkin yok', 403);
    await depo.quiz.sonucAc(a.id);
    const biten = await acikDenemeleriBitir(a, await depo.quiz.bul(a.id));
    const bildirilen = await sonuclariBildir([a.id]);
    return ok(res, { quiz: await ogretmenQuizi(a), biten, bildirilen });
  }

  return bad(res, 'Böyle bir adres yok', 404);
}

/* Yeni ödevle gelen quiz: gövdede yoksa { quiz: null }, bozuksa { hata }. */
function yeniOdevQuizi(govde) {
  if (govde === undefined || govde === null) return { quiz: null };
  return Q.quizDogrula(govde);
}

module.exports = {
  TESLIM_PAYI_MS,
  sonucAcikMi, sonucGenelAcik, baslatmaEngeli,
  ogrenciUcu, ogretmenUcu, metinUcu,
  yeniOdevQuizi, ogretmenQuizi, ogrenciOzetleri, listeOzetleri, ilerleyisOzetleri,
  odevSonuclandi, acikDenemeleriKapat, sonuclariBildir, teslimSonuclariniSabitle, quizTemizle
};
