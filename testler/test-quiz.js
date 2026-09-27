/* Ödevin quizi:
   - oluşturma ve doğrulama sınırları (sessiz kırpma yok), "Metinden ekle" önizlemesi;
   - doğru şık sızmaz: soru ucu, /progress, GET /assignments/:id (öğrenci, veli), sonuç açılmadan;
   - tek deneme, aynı anda iki "Başlat" tek deneme açar, ikinci hak yok;
   - soru başına süre (sırayla, geri dönülmez), süre dolunca kapanma (okurken ve dakikalık temizlikte),
     bütün quiz süresi, son teslim + 10 dk, başlama anı;
   - puan: eşit ağırlık, çok doğrulu soruda birebir küme, açık uçlu puansız;
   - sekme kaydı (2 sn altı sayılmaz) ve "çıkınca o soru kapanır";
   - kilit (öğrenci başlayınca), sonuç görünürlüğü (son teslim, hemen, öğretmen açar, sonuçlandırınca),
     "sonucu açıklandı" bildirimi (veliye kopya), veli görünümü;
   - yetkiler (başka öğrenci, başka öğretmen, veli, müdür), özellik kapalı 403, arşiv 409, ödev silinince quiz gider. */
const path = require('path');
const { iste, girisYap, hesapAc } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 240);
const iki = n => (n < 10 ? '0' : '') + n;
const yerelGun = d => d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate());
const yerelSaat = d => iki(d.getHours()) + ':' + iki(d.getMinutes());
const gun = n => { const d = new Date(); d.setDate(d.getDate() + n); return yerelGun(d); };
const dakikaSonra = dk => new Date(Date.now() + dk * 60000);

/* Doğru bilgisi (şık işareti, doğru şıklar, doğru mu) hiçbir alanda yok mu? */
const sizmaYok = govde => { const t = JSON.stringify(govde); return !/"dogru"\s*:/.test(t) && t.indexOf('dogruSecenek') < 0 && t.indexOf('dogruMu') < 0; };

/* Test veritabanına depo üzerinden bağlantı (yalnızca adı _test ile biterse):
   süreyi geri almak ve dakikalık temizliği çağırmak için. */
function testDeposu() {
  try {
    process.env.EE_DATA = path.join(__dirname, 'testdata');
    process.env.EE_PUSH_GONDERME = '0';
    require('../sunucu/ayarlar').ayarlariYukle();
    const baglanti = require('../sunucu/veri/baglanti');
    if (!/_test$/.test(baglanti.veritabaniAdi() || '')) return null;
    return { baglanti, quiz: require('../sunucu/veri/depo/quiz'), bolum: require('../sunucu/bolumler/quiz') };
  } catch (e) { console.log('  test deposu açılamadı: ' + e.message); return null; }
}

const DORTLU = () => ({ sorular: [
  { tur: 'dy', metin: 'Güneş bir yıldızdır.', dogru: true },
  { tur: 'coktan', metin: '2 + 2 kaçtır?', secenekler: [{ metin: '3' }, { metin: '4', dogru: true }, { metin: '5' }] },
  { tur: 'coktan', metin: 'Hangileri asaldır?', secenekler: [{ metin: '2', dogru: true }, { metin: '4' }, { metin: '7', dogru: true }] },
  { tur: 'acik', metin: 'Fotosentezi kendi cümlelerinle anlat.' }
] });

(async () => {
  const z = Date.now().toString(36);
  const vt = testDeposu();
  const M = (await girisYap('mudur@test.com', 'Test1234!')).token;
  const mat = await girisYap('mat', 'Test1234!');
  const fen = await girisYap('fen', 'Test1234!');
  const o1 = await girisYap('ogrenci1', 'Test1234!');
  const o2 = await girisYap('ogrenci2', 'Test1234!');
  const vK = 'quizveli' + z;
  await hesapAc({ fullName: 'Quiz Veli', username: vK, email: vK + '@test.com' });
  let V = (await girisYap(vK, 'Test1234!')).token;
  await iste('/api/parent/link', 'POST', { code: (await iste('/api/me', 'GET', null, o1.token)).body.user.code }, V);
  V = (await girisYap(vK, 'Test1234!')).token;

  const T = mat.token;
  const odevVer = (baslik, quiz, ek) => iste('/api/assignments', 'POST', Object.assign({ title: baslik + ' ' + z, subject: 'Matematik',
    studentIds: [o1.user.id, o2.user.id], startAt: gun(-1), endAt: gun(3), endTime: '23:59', quiz }, ek || {}), T);
  const Y = id => '/api/assignments/' + id + '/quiz';
  const durum = (tok, id) => iste(Y(id), 'GET', null, tok);
  const basla = (tok, id) => iste(Y(id) + '/basla', 'POST', {}, tok);
  const bitir = (tok, id) => iste(Y(id) + '/bitir', 'POST', {}, tok);
  const cevap = (tok, id, soruId, secilenler, metin) => iste(Y(id) + '/cevap', 'POST', { soruId, secilenler, metin }, tok);
  const odak = (tok, id, sure, soruId) => iste(Y(id) + '/odak', 'POST', { sure, soruId }, tok);
  const sikId = (soru, metin) => (soru.secenekler.find(x => x.metin === metin) || {}).id;
  const bildirimVar = async (tok, parca) => ((await iste('/api/notifications', 'GET', null, tok)).body.notifications || [])
    .some(n => n.text.indexOf(parca) >= 0);
  /* Öğrenci dört soruyu cevaplar: dogruMu true ise hepsi doğru, değilse yanlış ve fazladan şık. */
  async function dortluCevapla(tok, id, hepsiDogru) {
    const d = (await basla(tok, id)).body;
    const [s1, s2, s3, s4] = d.sorular;
    const r = [];
    r.push(await cevap(tok, id, s1.id, [sikId(s1, hepsiDogru ? 'Doğru' : 'Yanlış')]));
    r.push(await cevap(tok, id, s2.id, [sikId(s2, '4')]));
    r.push(await cevap(tok, id, s3.id, hepsiDogru ? [sikId(s3, '2'), sikId(s3, '7')] : [sikId(s3, '2'), sikId(s3, '4'), sikId(s3, '7')]));
    r.push(await cevap(tok, id, s4.id, undefined, hepsiDogru ? 'Bitkiler ışıkla besin üretir.' : 'Bilmiyorum'));
    return { d, r };
  }

  console.log('=== 1) OLUŞTURMA VE DOĞRULAMA ===');
  const p = await odevVer('Puan quizi', DORTLU());
  const P = p.body.assignment && p.body.assignment.id;
  kontrol('ödevle birlikte quiz verildi (öğretmen doğruları görür)', p.status === 200 && p.body.quiz && p.body.quiz.soruSayisi === 4 &&
    p.body.quiz.puanliSayisi === 3 && p.body.quiz.acikUcluSayisi === 1 && p.body.quiz.sorular[0].dogru === true &&
    p.body.quiz.sorular[2].coklu === true && p.body.quiz.sonucGorunum === 'teslim' && p.body.quiz.sureTuru === 'yok', J(p.body));
  kontrol('ödev nesnesine quiz girmedi', p.body.assignment && p.body.assignment.quiz === undefined && JSON.stringify(p.body.assignment).indexOf('dogru') < 0);
  const bozuk = DORTLU(); bozuk.sorular[1].secenekler[1].dogru = false;
  const kotu1 = await odevVer('Bozuk quiz', bozuk);
  kontrol('doğru şıkkı olmayan quiz: "2. soruda doğru şık işaretli değil" ve ödev verilmedi', kotu1.status === 400 &&
    kotu1.body.error === '2. soruda doğru şık işaretli değil.', J(kotu1.body));
  const liste = (await iste('/api/assignments', 'GET', null, T)).body.assignments || [];
  kontrol('bozuk quizli ödev listede yok', !liste.some(a => a.title === 'Bozuk quiz ' + z));
  const pListede = liste.find(a => a.id === P);
  kontrol('öğretmen listesinde "Quiz" rozeti', !!pListede && pListede.quiz && pListede.quiz.soruSayisi === 4 && pListede.quiz.baslayan === 0,
    J(pListede && pListede.quiz));
  const tekDy = { tur: 'dy', metin: 'S', dogru: true };
  const sinirlar = [
    ['101 soru', { sorular: Array(101).fill(tekDy) }, /en fazla 100 soru/],
    ['600 soru (500\'e sessiz kırpılmadan reddedilir)', { sorular: Array(600).fill(tekDy) }, /en fazla 100 soru/],
    ['1001 karakter soru', { sorular: [{ tur: 'acik', metin: 'x'.repeat(1001) }] }, /en fazla 1000 karakter/],
    ['301 karakter şık', { sorular: [{ tur: 'coktan', metin: 'S', secenekler: [{ metin: 'y'.repeat(301), dogru: true }, { metin: 'b' }] }] }, /en fazla 300 karakter/],
    ['11 şık', { sorular: [{ tur: 'coktan', metin: 'S', secenekler: Array(11).fill(0).map((_, i) => ({ metin: 'ş' + i, dogru: !i })) }] }, /en fazla 10 şık/],
    ['bütün şıkları doğru soru', { sorular: [{ tur: 'coktan', metin: 'Hangileri çifttir?', secenekler: [{ metin: '2', dogru: true }, { metin: '4', dogru: true }] }] },
      /bütün şıklar doğru/],
    ['soru başına süresiz soru', { sureTuru: 'soru', sorular: [tekDy] }, /10 saniye ile 10 dakika/],
    ['181 dakikalık quiz', { sureTuru: 'quiz', toplamDk: 181, sorular: [tekDy] }, /1 ile 180 dakika/]
  ];
  for (const [ad, quiz, re] of sinirlar) {
    const r = await odevVer('Sınır ' + ad, quiz);
    kontrol('reddedildi: ' + ad, r.status === 400 && re.test(r.body.error || ''), r.status + ' ' + J(r.body));
  }
  const metin = await iste('/api/assignments/quiz-metin', 'POST', { metin: '1) Bir\n*A) x\nB) y\n2) İki\nCevap: Doğru\n3) Üç\nA) x\nB) y\n4) Açık uçlu' }, T);
  kontrol('"Metinden ekle" önizlemesi: sorular ve satır hataları', metin.status === 200 && metin.body.sorular.length === 4 &&
    metin.body.sorular[1].tur === 'dy' && metin.body.sorular[3].tur === 'acik' &&
    metin.body.hatalar.some(h => h.mesaj === '3. soruda doğru şık işaretli değil.' && h.satir === 6), J(metin.body));
  kontrol('önizleme: boş metin 400, öğrenciye kapalı', (await iste('/api/assignments/quiz-metin', 'POST', { metin: ' ' }, T)).status === 400 &&
    (await iste('/api/assignments/quiz-metin', 'POST', { metin: '1) x' }, o1.token)).status === 403);
  const cokHata = await iste('/api/assignments/quiz-metin', 'POST', { metin: 'x\n'.repeat(3000) + '1) Soru\nCevap: D\n' + 'y\n'.repeat(100) }, T);
  kontrol('önizleme: sorun listesi sınırlı (sorudan önceki satırlar tek sorun, en çok 50 + "ve N sorun daha")', cokHata.status === 200 &&
    cokHata.body.hatalar.length === 51 && /önceki 3000 satır/.test(cokHata.body.hatalar[0].mesaj) &&
    /Ve 51 sorun daha/.test(cokHata.body.hatalar[50].mesaj) && JSON.stringify(cokHata.body).length < 20000,
    cokHata.status + ' ' + (cokHata.body.hatalar || []).length + ' ' + J(cokHata.body.hatalar && [cokHata.body.hatalar[0], cokHata.body.hatalar[50]]));

  console.log('=== 2) KİLİT VE DÜZENLEME ===');
  const yeniQuiz = DORTLU(); yeniQuiz.sorular.push({ tur: 'dy', metin: 'Ay bir gezegendir.', dogru: false });
  const duz = await iste(Y(P), 'POST', { quiz: yeniQuiz }, T);
  kontrol('kimse başlamadan quiz değiştirilebiliyor', duz.status === 200 && duz.body.quiz.soruSayisi === 5 && duz.body.quiz.kilitli === false, J(duz.body));
  const geri = await iste(Y(P), 'POST', { quiz: DORTLU() }, T);
  kontrol('quiz eski hâline döndü', geri.status === 200 && geri.body.quiz.soruSayisi === 4);

  console.log('=== 3) DOĞRU ŞIK SIZMAZ (sonuç açılmadan) ===');
  const once = await durum(o1.token, P);
  kontrol('başlamadan: yalnız özet, soru metni yok', once.status === 200 && once.body.durum === 'baslamadi' && once.body.baslatabilir === true &&
    once.body.sorular.length === 0 && once.body.quiz.soruSayisi === 4 && JSON.stringify(once.body).indexOf('Güneş') < 0 && sizmaYok(once.body), J(once.body));
  const ilerOnce = await iste('/api/progress', 'GET', null, o1.token);
  const ilerP = (ilerOnce.body.assignments || []).find(a => a.id === P);
  kontrol('/progress: quiz özeti, soru ve doğru bilgisi yok', !!ilerP && ilerP.quiz && ilerP.quiz.durum === 'baslamadi' && ilerP.quiz.soruSayisi === 4 &&
    sizmaYok(ilerOnce.body) && JSON.stringify(ilerOnce.body).indexOf('Fotosentezi') < 0, J(ilerP));
  kontrol('öğrenci ve veli ödev ayrıntısını (GET /assignments/:id) açamıyor', (await iste('/api/assignments/' + P, 'GET', null, o1.token)).status === 403 &&
    (await iste('/api/assignments/' + P, 'GET', null, V)).status === 403);
  const bas1 = await basla(o1.token, P);
  kontrol('başlattı: dört soru, şıklar var, doğru bilgisi yok', bas1.status === 200 && bas1.body.durum === 'devam' && bas1.body.sorular.length === 4 &&
    bas1.body.sorular[1].secenekler.length === 3 && sizmaYok(bas1.body), J(bas1.body));
  kontrol('çok doğrulu soru "coklu" (birden çok şık seçilebilir), tek doğrulu değil', bas1.body.sorular[2].coklu === true && bas1.body.sorular[1].coklu === false &&
    bas1.body.sorular[0].coklu === false);
  const ilerDevam = await iste('/api/progress', 'GET', null, o1.token);
  kontrol('/progress deneme sürerken de doğru bilgisi yok', sizmaYok(ilerDevam.body) &&
    (ilerDevam.body.assignments.find(a => a.id === P) || {}).quiz.durum === 'devam');
  const veliIler = await iste('/api/progress?studentId=' + o1.user.id, 'GET', null, V);
  kontrol('veli: yalnız durum, soru/doğru/sekme kaydı yok', veliIler.status === 200 && sizmaYok(veliIler.body) &&
    JSON.stringify(veliIler.body).indexOf('cikis') < 0 && (veliIler.body.assignments.find(a => a.id === P) || {}).quiz.durum === 'devam', J(veliIler.body.assignments));

  console.log('=== 4) KİLİT: ÖĞRENCİ BAŞLADI ===');
  const kilit = await iste(Y(P), 'POST', { quiz: yeniQuiz }, T);
  kontrol('"1 öğrenci başladı; quiz artık değiştirilemez."', kilit.status === 409 && kilit.body.kilitli === true && kilit.body.baslayan === 1 &&
    kilit.body.error === '1 öğrenci başladı; quiz artık değiştirilemez.', J(kilit.body));
  kontrol('başlanmış quiz kaldırılamıyor', (await iste(Y(P), 'POST', { quiz: null }, T)).status === 409);
  const ogrQuiz = await iste(Y(P), 'GET', null, T);
  kontrol('öğretmen: kilitli, 1 öğrenci başladı', ogrQuiz.status === 200 && ogrQuiz.body.quiz.kilitli === true && ogrQuiz.body.quiz.baslayan === 1);

  console.log('=== 5) PUAN VE TEK DENEME ===');
  const c1 = await dortluCevapla(o1.token, P, true);
  kontrol('cevaplar kaydedildi (her biri anında)', c1.r.every(x => x.status === 200 && !!x.body.kaydedildi), J(c1.r.map(x => x.status)));
  const tekSec = await cevap(o1.token, P, c1.d.sorular[1].id, [sikId(c1.d.sorular[1], '3'), sikId(c1.d.sorular[1], '4')]);
  kontrol('tek doğrulu soruda iki şık seçilemez', tekSec.status === 400, J(tekSec.body));
  const yabanciSik = await cevap(o1.token, P, c1.d.sorular[1].id, [sikId(c1.d.sorular[2], '2')]);
  kontrol('başka sorunun şıkkı seçilemez', yabanciSik.status === 400, J(yabanciSik.body));
  const uzunCevap = await cevap(o1.token, P, c1.d.sorular[3].id, undefined, 'x'.repeat(2001));
  kontrol('açık uçlu cevap en fazla 2000 karakter', uzunCevap.status === 400, J(uzunCevap.body));
  const devamEt = await basla(o1.token, P);
  kontrol('ikinci "Başlat" aynı denemeye döner, cevaplar yerinde', devamEt.status === 200 && devamEt.body.deneme.baslama === bas1.body.deneme.baslama &&
    devamEt.body.sorular[3].cevap && devamEt.body.sorular[3].cevap.metin === 'Bitkiler ışıkla besin üretir.', J(devamEt.body.deneme));
  const b1 = await bitir(o1.token, P);
  kontrol('bitirdi: sonuç son teslimden sonra, şimdilik doğru bilgisi yok', b1.status === 200 && b1.body.durum === 'bitti' &&
    b1.body.deneme.bitisNedeni === 'ogrenci' && b1.body.sonucAcik === false && b1.body.sorular.length === 0 && sizmaYok(b1.body), J(b1.body));
  const tekrar = await basla(o1.token, P);
  kontrol('tek deneme: bitirdikten sonra yeniden başlatılamaz', tekrar.status === 200 && tekrar.body.durum === 'bitti' &&
    tekrar.body.deneme.baslama === bas1.body.deneme.baslama, J(tekrar.body.deneme));
  const bitmisCevap = await cevap(o1.token, P, c1.d.sorular[0].id, [sikId(c1.d.sorular[0], 'Yanlış')]);
  kontrol('bittikten sonra cevap değişmez (409, güncel durumla)', bitmisCevap.status === 409 && bitmisCevap.body.kapandi === true &&
    bitmisCevap.body.durum && bitmisCevap.body.durum.durum === 'bitti' && sizmaYok(bitmisCevap.body), J(bitmisCevap.body));
  /* İki "Başlat" aynı anda: tek deneme. */
  const [e1, e2] = await Promise.all([basla(o2.token, P), basla(o2.token, P)]);
  kontrol('aynı anda iki "Başlat" tek deneme açtı', e1.status === 200 && e2.status === 200 && e1.body.deneme.baslama === e2.body.deneme.baslama,
    e1.status + ' ' + e2.status + ' ' + J([e1.body.deneme, e2.body.deneme]));
  await dortluCevapla(o2.token, P, false);
  await bitir(o2.token, P);
  const detay = await iste('/api/assignments/' + P, 'GET', null, T);
  const sat = id => ((detay.body.students || []).find(s => s.id === id) || {}).quiz || {};
  kontrol('öğretmen: hepsi doğru 3/3 (%100), açık uçlu puanlanmadı', sat(o1.user.id).durum === 'bitti' && J(sat(o1.user.id).sonuc) ===
    J({ dogruSayisi: 3, puanliSayisi: 3, acikUcluSayisi: 1, yuzde: 100 }), J(sat(o1.user.id)));
  kontrol('fazladan yanlış şık puanı sıfırladı: 1/3 (%33)', J(sat(o2.user.id).sonuc) === J({ dogruSayisi: 1, puanliSayisi: 3, acikUcluSayisi: 1, yuzde: 33 }),
    J(sat(o2.user.id)));
  kontrol('öğretmen ekranında quizin tamamı ve 2 deneme', detay.body.quiz && detay.body.quiz.baslayan === 2 && detay.body.quiz.sorular.length === 4);
  kontrol('ödevin sonucu (Yaptı/Eksik) değişmedi: puan yalnız öneri', (detay.body.students || []).every(s => s.result === null));
  const ay = await iste(Y(P) + '/ayrinti?ogrenci=' + o2.user.id, 'GET', null, T);
  kontrol('öğretmen ayrıntısı: yanlışlar, doğru cevap, açık uçlu metin', ay.status === 200 && J(ay.body.sorular.map(s => s.dogruMu)) === J([false, true, false, null]) &&
    ay.body.sorular[3].cevap.metin === 'Bilmiyorum' && ay.body.sorular[2].dogruSecenekler.length === 2 && ay.body.sorular[2].cevap.secilenler.length === 3 &&
    ay.body.ogrenci.fullName && ay.body.deneme.cikisSayisi === 0, J(ay.body.sorular));
  kontrol('ayrıntı: ödevde olmayan öğrenci 404', (await iste(Y(P) + '/ayrinti?ogrenci=u_yok', 'GET', null, T)).status === 404);

  console.log('=== 6) SONUÇ GÖRÜNÜRLÜĞÜ: ÖĞRETMEN AÇAR ===');
  const ac = await iste(Y(P) + '/sonuc-ac', 'POST', {}, T);
  kontrol('öğretmen "Sonuçları şimdi aç" dedi, 2 bildirim', ac.status === 200 && ac.body.bildirilen === 2 && ac.body.quiz.sonucAcik === true, J(ac.body));
  const sonra = await durum(o1.token, P);
  kontrol('öğrenci: puan, kendi cevapları, doğru cevaplar', sonra.body.sonucAcik === true && J(sonra.body.sonuc) ===
    J({ dogruSayisi: 3, puanliSayisi: 3, acikUcluSayisi: 1, yuzde: 100 }) && sonra.body.sorular.length === 4 &&
    sonra.body.sorular[2].dogruSecenekler.length === 2 && sonra.body.sorular[3].cevap.metin === 'Bitkiler ışıkla besin üretir.' &&
    J(sonra.body.sorular.map(s => s.dogruMu)) === J([true, true, true, null]), J(sonra.body));
  kontrol('"quizinin sonucu açıklandı" bildirimi öğrenciye ve veliye gitti', await bildirimVar(o1.token, '"Puan quizi ' + z + '" quizinin sonucu açıklandı') &&
    await bildirimVar(V, 'quizinin sonucu açıklandı'));
  const ac2 = await iste(Y(P) + '/sonuc-ac', 'POST', {}, T);
  kontrol('ikinci kez açınca bildirim tekrar gitmez', ac2.status === 200 && ac2.body.bildirilen === 0, J(ac2.body));
  const veliSonra = await iste('/api/progress?studentId=' + o1.user.id, 'GET', null, V);
  const vq = (veliSonra.body.assignments.find(a => a.id === P) || {}).quiz || {};
  kontrol('veli: sonuç açılınca yalnız puan (soru, doğru, sekme kaydı yok)', vq.sonucAcik === true && vq.sonuc && vq.sonuc.yuzde === 100 &&
    vq.durum === 'bitti' && sizmaYok(veliSonra.body) && JSON.stringify(veliSonra.body).indexOf('cikis') < 0 &&
    JSON.stringify(veliSonra.body).indexOf('Fotosentezi') < 0, J(vq));

  console.log('=== 7) SONUÇ: "HEMEN" VE SONUÇLANDIRINCA ===');
  const hq = DORTLU(); hq.sonucGorunum = 'hemen';
  const H = (await odevVer('Hemen quizi', hq)).body.assignment.id;
  await dortluCevapla(o1.token, H, true);
  const hb = await bitir(o1.token, H);
  kontrol('"Hemen": bitirince sonuç açık', hb.body.sonucAcik === true && hb.body.sonuc.yuzde === 100 && hb.body.sorular[0].dogruSecenekler.length === 1, J(hb.body));
  const h2 = await basla(o2.token, H);
  kontrol('"Hemen": çözmekte olan öğrenciye doğru bilgisi gitmez', h2.body.durum === 'devam' && sizmaYok(h2.body), J(h2.body));
  /* Süresiz ödev (son tarih yok): sonuç öğretmen açınca ya da sonuçlandırınca. */
  const S = (await odevVer('Süresiz ödev quizi', DORTLU(), { endAt: '', endTime: '' })).body.assignment.id;
  await dortluCevapla(o1.token, S, true);
  const sb = await bitir(o1.token, S);
  kontrol('süresiz ödevde bitirince sonuç kapalı', sb.body.sonucAcik === false && sizmaYok(sb.body), J(sb.body));
  const fin = await iste('/api/assignments/' + S + '/finish', 'POST', { results: { [o1.user.id]: 'yapti' } }, T);
  kontrol('sonuçlandırınca quiz sonucu bildirildi', fin.status === 200 && fin.body.quizBildirilen === 1, J(fin.body));
  kontrol('sonuçlandırınca sonuç açık', (await durum(o1.token, S)).body.sonucAcik === true);
  const kapaliBasla = await basla(o2.token, S);
  kontrol('sonuçlandırılmış ödevde quiz başlatılamaz', kapaliBasla.status === 400 && kapaliBasla.body.baslatilamaz === true &&
    /sonuçlandırıldı/.test(kapaliBasla.body.error), J(kapaliBasla.body));
  const tekrarAc = await iste('/api/assignments/' + S + '/reopen', 'POST', {}, T);
  kontrol('"Tekrar aç" öğretmene quizin yeniden başlatılamayacağını söyler', tekrarAc.status === 200 &&
    /yeniden başlatılamaz/.test(tekrarAc.body.message || ''), J(tekrarAc.body));
  const acikBasla = await basla(o2.token, S);
  kontrol('doğru cevaplar açıldıktan sonra "Tekrar aç" quizi başlamamış öğrenciye AÇMAZ (kopyaya karşı)', acikBasla.status === 400 &&
    acikBasla.body.baslatilamaz === true && /açıklandı/.test(acikBasla.body.error) && sizmaYok(acikBasla.body), J(acikBasla.body));
  kontrol('tekrar açılınca bitirenin sonucu açık kalır', (await durum(o1.token, S)).body.sonucAcik === true);
  const o1Tekrar = await basla(o1.token, S);
  kontrol('bitirmiş öğrenciye ikinci hak yok', o1Tekrar.body.durum === 'bitti', J(o1Tekrar.body.deneme));
  /* Kimse bitirmeden sonuçlandırılan ödevde süren deneme "sonuçlandı" nedeniyle biter. */
  const S2 = (await odevVer('Süresiz ödev quizi 2', DORTLU(), { endAt: '', endTime: '' })).body.assignment.id;
  await basla(o2.token, S2);
  const fin2 = await iste('/api/assignments/' + S2 + '/finish', 'POST', { results: {} }, T);
  const o2Son = await durum(o2.token, S2);
  kontrol('sonuçlandırınca açık deneme biter (neden: sonuçlandı) ve sonucu gider', fin2.status === 200 && fin2.body.quizBildirilen === 1 &&
    o2Son.body.durum === 'bitti' && o2Son.body.deneme.bitisNedeni === 'sonuclandi' && o2Son.body.sonucAcik === true, J(o2Son.body.deneme));
  /* Öğretmen sonucu açtıysa yeni başlatma yok. */
  const A = (await odevVer('Açılmış sonuç', DORTLU())).body.assignment.id;
  await basla(o1.token, A); await bitir(o1.token, A);
  await iste(Y(A) + '/sonuc-ac', 'POST', {}, T);
  const acilmisBasla = await basla(o2.token, A);
  kontrol('sonuçlar açıklandıktan sonra quiz başlatılamaz', acilmisBasla.status === 400 && /açıklandı/.test(acilmisBasla.body.error), J(acilmisBasla.body));
  /* "Sonuçları şimdi aç" çözmekte olanın denemesini bitirir: bitirenin gördüğü doğru cevapla cevap düzeltilemez. */
  const SA = (await odevVer('Çözerken açılan', DORTLU(), { endAt: '', endTime: '' })).body.assignment.id;
  const saO1 = (await basla(o1.token, SA)).body;
  await cevap(o1.token, SA, saO1.sorular[1].id, [sikId(saO1.sorular[1], '3')]);
  await basla(o2.token, SA); await bitir(o2.token, SA);
  const saAc = await iste(Y(SA) + '/sonuc-ac', 'POST', {}, T);
  kontrol('"Sonuçları şimdi aç": çözmekte olan 1 öğrencinin quizi bitti', saAc.status === 200 && saAc.body.biten === 1 && saAc.body.bildirilen === 2,
    J(saAc.body && { biten: saAc.body.biten, bildirilen: saAc.body.bildirilen }));
  const saDuzelt = await cevap(o1.token, SA, saO1.sorular[1].id, [sikId(saO1.sorular[1], '4')]);
  const saO1Son = await durum(o1.token, SA);
  kontrol('sonuç açılınca çözen öğrenci cevabını düzeltemez (409), deneme bitti (neden: sonuclandi)', saDuzelt.status === 409 &&
    saO1Son.body.durum === 'bitti' && saO1Son.body.deneme.bitisNedeni === 'sonuclandi' && saO1Son.body.sonucAcik === true &&
    saO1Son.body.sonuc.dogruSayisi === 0, J(saO1Son.body.deneme) + ' ' + saDuzelt.status);
  /* Öğretmen quizi yazarken aynı anda başlatan öğrenci: ya eski quizle başlar ve öğretmen 409 alır
     ya da öğretmenin yazdığı yeni sorularla başlar (eski, silinmiş sorular dönmez). */
  let yaris = true, yarisDetay = [];
  for (let tur = 0; tur < 4; tur++) {
    const RQ = (await odevVer('Yarış ' + tur, { sorular: [{ tur: 'dy', metin: 'Eski ' + tur, dogru: true }] })).body.assignment.id;
    const [yaz, bas] = await Promise.all([iste(Y(RQ), 'POST', { quiz: { sorular: [{ tur: 'dy', metin: 'Yeni ' + tur, dogru: false }] } }, T),
      basla(o1.token, RQ)]);
    const ilkMetin = bas.body && bas.body.sorular && bas.body.sorular[0] && bas.body.sorular[0].metin;
    yarisDetay.push(yaz.status + '/' + bas.status + '/' + ilkMetin);
    if (bas.status !== 200 || (yaz.status === 200 ? ilkMetin !== 'Yeni ' + tur : !(yaz.status === 409 && ilkMetin === 'Eski ' + tur))) yaris = false;
  }
  kontrol('quiz yazılırken başlatan öğrenciye eski sorular gitmez', yaris, J(yarisDetay));

  console.log('=== 8) SORU BAŞINA SÜRE: SIRAYLA, GERİ DÖNÜLMEZ ===');
  const sq = { sureTuru: 'soru', sorular: [
    { tur: 'dy', metin: 'Birinci soru', dogru: true, sureSn: 10 },
    { tur: 'dy', metin: 'İkinci soru', dogru: false, sureSn: 10 },
    { tur: 'coktan', metin: 'Üçüncü soru', sureSn: 10, secenekler: [{ metin: 'a', dogru: true }, { metin: 'b' }] }
  ] };
  const SB = (await odevVer('Soru başına', sq)).body.assignment.id;
  const sb1 = await basla(o1.token, SB);
  kontrol('yalnız o anki soru gönderildi (sonrakiler görünmez)', sb1.status === 200 && sb1.body.sorular.length === 1 && sb1.body.sorular[0].metin === 'Birinci soru' &&
    sb1.body.deneme.soruSira === 1 && !!sb1.body.deneme.soruBitis && JSON.stringify(sb1.body).indexOf('İkinci soru') < 0 && sizmaYok(sb1.body), J(sb1.body));
  const kalan = Date.parse(sb1.body.deneme.soruBitis) - Date.parse(sb1.body.simdi);
  kontrol('soru süresi sunucuda: yaklaşık 10 sn', kalan > 7000 && kalan <= 10500, kalan);
  const q1 = sb1.body.sorular[0];
  kontrol('o anki soruya cevap', (await cevap(o1.token, SB, q1.id, [sikId(q1, 'Doğru')])).status === 200);
  const son1 = await iste(Y(SB) + '/sonraki', 'POST', { soruId: q1.id }, o1.token);
  kontrol('"Sonraki": ikinci soru', son1.status === 200 && son1.body.deneme.soruSira === 2 && son1.body.sorular[0].metin === 'İkinci soru', J(son1.body));
  const geriDon = await cevap(o1.token, SB, q1.id, [sikId(q1, 'Yanlış')]);
  kontrol('geçilen soruya geri dönülmez (409)', geriDon.status === 409 && geriDon.body.kapandi === true, J(geriDon.body));
  const q2 = son1.body.sorular[0];
  if (vt) {
    await vt.quiz.geriTarihle(SB, o1.user.id, 15);
    const gecti2 = await durum(o1.token, SB);
    kontrol('bağlantı kopukken süre işledi: ikinci soru kapandı, üçüncüden devam', gecti2.body.durum === 'devam' && gecti2.body.deneme.soruSira === 3 &&
      gecti2.body.sorular[0].metin === 'Üçüncü soru', J(gecti2.body.deneme));
    kontrol('süresi dolan soruya cevap yazılamaz', (await cevap(o1.token, SB, q2.id, [sikId(q2, 'Yanlış')])).status === 409);
    await vt.quiz.geriTarihle(SB, o1.user.id, 40);
    const bitti = await durum(o1.token, SB);
    kontrol('son sorunun süresi dolunca deneme bitti (süre doldu)', bitti.body.durum === 'bitti' && bitti.body.deneme.bitisNedeni === 'sure', J(bitti.body.deneme));
    const sbAy = await iste(Y(SB) + '/ayrinti?ogrenci=' + o1.user.id, 'GET', null, T);
    kontrol('öğretmen: soru başına geçen süre ve kapanma nedeni', sbAy.status === 200 && J(sbAy.body.sorular.map(s => s.kapandi)) === J(['gecildi', 'sure', 'sure']) &&
      sbAy.body.sorular[1].gecenSn === 10 && sbAy.body.sorular[2].gecenSn === 10 && sbAy.body.sorular[0].gecenSn !== null &&
      J(sbAy.body.sorular.map(s => s.dogruMu)) === J([true, false, false]), J(sbAy.body.sorular.map(s => [s.kapandi, s.gecenSn, s.dogruMu])));
  } else kontrol('test veritabanına bağlanılamadı (süre testleri)', false);
  const yanlisYer = await iste(Y(P) + '/sonraki', 'POST', { soruId: 'x' }, o1.token);
  kontrol('serbest quizde "Sonraki" yok (400)', yanlisYer.status === 400);

  console.log('=== 9) BÜTÜN QUIZ SÜRESİ VE DAKİKALIK TEMİZLİK ===');
  const BQ = (await odevVer('Bir dakikalık', { sureTuru: 'quiz', toplamDk: 1, sorular: [tekDy, tekDy] })).body.assignment.id;
  const bq = await basla(o2.token, BQ);
  const bqKalan = Date.parse(bq.body.deneme.sonAn) - Date.parse(bq.body.simdi);
  kontrol('bütün quiz: iki soru birden, 1 dk süre', bq.status === 200 && bq.body.sorular.length === 2 && bqKalan > 55000 && bqKalan <= 60500, J(bq.body.deneme));
  if (vt) {
    await vt.quiz.geriTarihle(BQ, o2.user.id, 70);
    await vt.bolum.quizTemizle();
    const d = await vt.quiz.denemeBul(BQ, o2.user.id);
    kontrol('dakikalık temizlik süresi dolan denemeyi kapattı (okunmadan)', !!d && !!d.bitis && d.bitisNedeni === 'sure' && d.puanli === 2, J(d));
    const bqSon = await cevap(o2.token, BQ, bq.body.sorular[0].id, [bq.body.sorular[0].secenekler[0].id]);
    kontrol('süre bitince cevap yazılamaz', bqSon.status === 409 && bqSon.body.durum.durum === 'bitti', J(bqSon.body));
  } else kontrol('test veritabanına bağlanılamadı (temizlik)', false);

  console.log('=== 10) BAŞLAMA ANI VE SON TESLİM + 10 DK ===');
  const ileri = (await odevVer('Yarın başlar', DORTLU(), { startAt: gun(1) })).body.assignment.id;
  const ileriD = await durum(o1.token, ileri);
  const ileriB = await basla(o1.token, ileri);
  kontrol('başlama anı gelmeden başlatılamaz', ileriD.body.baslatabilir === false && /tarihinde açılacak/.test(ileriD.body.engel) &&
    ileriB.status === 400 && ileriB.body.baslatilamaz === true, J(ileriD.body) + J(ileriB.body));
  const yarimSaat = dakikaSonra(30);
  const TS = (await odevVer('Teslim payı', DORTLU(), { startAt: '', endAt: yerelGun(yarimSaat), endTime: yerelSaat(yarimSaat) })).body.assignment.id;
  const ts1 = await basla(o1.token, TS);
  kontrol('teslimden önce başladı; en geç teslim + 10 dk', ts1.status === 200 &&
    Math.abs(Date.parse(ts1.body.deneme.sonAn) - (Date.parse(yerelGun(yarimSaat) + 'T' + yerelSaat(yarimSaat) + ':00') + 600000)) < 1000, J(ts1.body.deneme));
  const tarihDegis = d => iste('/api/assignments/' + TS + '/update', 'POST', { title: 'Teslim payı ' + z, description: '',
    endAt: yerelGun(d), endTime: yerelSaat(d) }, T);
  await tarihDegis(dakikaSonra(-5));
  const ts2 = await durum(o1.token, TS);
  kontrol('son teslim geçti ama 10 dk payı içinde: başlayan devam ediyor', ts2.body.durum === 'devam' &&
    (await cevap(o1.token, TS, ts2.body.sorular[0].id, [sikId(ts2.body.sorular[0], 'Doğru')])).status === 200, J(ts2.body.deneme));
  const tsYeni = await basla(o2.token, TS);
  kontrol('son teslim geçince yeni başlatma yok', tsYeni.status === 400 && /Son teslim geçti/.test(tsYeni.body.error), J(tsYeni.body));
  await tarihDegis(dakikaSonra(-12));
  const ts3 = await durum(o1.token, TS);
  kontrol('teslim + 10 dk geçince deneme bitti (neden: teslim)', ts3.body.durum === 'bitti' && ts3.body.deneme.bitisNedeni === 'teslim', J(ts3.body.deneme));
  kontrol('"son teslimden sonra": teslim + 10 dk geçince sonuç açık (1/3, cevapsızlar yanlış)', ts3.body.sonucAcik === true &&
    ts3.body.sonuc && ts3.body.sonuc.dogruSayisi === 1 && ts3.body.sonuc.puanliSayisi === 3, J(ts3.body.sonuc));
  /* Doğru cevaplar son teslimle açıldıktan sonra son teslim ileri alınırsa: sonuç kapanmaz, quiz yeniden başlatılamaz. */
  const uzat = await tarihDegis(dakikaSonra(120));
  kontrol('son teslim ileri alınınca öğretmene "quiz yeniden başlatılamaz" denir', uzat.status === 200 &&
    /yeniden başlatılamaz/.test(uzat.body.message || ''), J(uzat.body.message));
  const tsSonra = await basla(o2.token, TS);
  kontrol('son teslimle açılan sonuçtan sonra tarih uzatılınca quiz başlatılamaz', tsSonra.status === 400 && /açıklandı/.test(tsSonra.body.error || ''),
    J(tsSonra.body));
  kontrol('tarih uzatılınca açılmış sonuç yeniden kapanmaz', (await durum(o1.token, TS)).body.sonucAcik === true);
  if (vt) {
    /* Öğrenci bakmasa da dakikalık temizlik açılışı kalıcı yapar; bitiren yoksa (doğru cevabı gören yok) yapmaz. */
    const TK = (await odevVer('Teslim kalıcı', DORTLU(), { startAt: '', endAt: yerelGun(yarimSaat), endTime: yerelSaat(yarimSaat) })).body.assignment.id;
    const TB = (await odevVer('Teslim bitiren yok', DORTLU(), { startAt: '', endAt: yerelGun(yarimSaat), endTime: yerelSaat(yarimSaat) })).body.assignment.id;
    await basla(o1.token, TK); await bitir(o1.token, TK);
    const gecmis = dakikaSonra(-12), ileri2 = dakikaSonra(120);
    const tarih = (id, d) => iste('/api/assignments/' + id + '/update', 'POST', { title: 'Tarih ' + id, description: '',
      endAt: yerelGun(d), endTime: yerelSaat(d) }, T);
    await tarih(TK, gecmis); await tarih(TB, gecmis);
    await vt.bolum.quizTemizle();
    kontrol('dakikalık temizlik son teslimle açılan sonucu kalıcı yaptı (bitiren var)', !!(await vt.quiz.bul(TK)).sonucAcildi);
    kontrol('bitiren yoksa açılış kalıcı olmadı', !(await vt.quiz.bul(TB)).sonucAcildi);
    await tarih(TK, ileri2); await tarih(TB, ileri2);
    const tkB = await basla(o2.token, TK), tbB = await basla(o2.token, TB);
    kontrol('tarih uzatılınca: doğru cevabı görülen quiz başlatılamaz, görülmeyen başlatılır', tkB.status === 400 && tbB.status === 200 &&
      tbB.body.durum === 'devam', tkB.status + ' ' + tbB.status + ' ' + J(tkB.body));
  } else kontrol('test veritabanına bağlanılamadı (kalıcı açılış)', false);

  console.log('=== 11) SEKME KAYDI VE "ÇIKINCA KAPANIR" ===');
  const sk = { cikincaKapanir: true, sorular: [tekDy, { tur: 'dy', metin: 'İki', dogru: false }, { tur: 'acik', metin: 'Üç' }] };
  const SK = (await odevVer('Sekme quizi', sk)).body.assignment.id;
  const sk1 = await basla(o1.token, SK);
  /* Çıkış süresi denemenin süresini aşamaz: deneme bir dakika önce başlamış olsun. */
  if (vt) await vt.quiz.geriTarihle(SK, o1.user.id, 60);
  const [k1, k2, k3] = sk1.body.sorular;
  const kisa = await odak(o1.token, SK, 1, k1.id);
  kontrol('2 sn altı çıkış sayılmaz', kisa.status === 200 && kisa.body.cikisSayildi === false && kisa.body.deneme.cikisSayisi === 0 && !kisa.body.kapananSoru, J(kisa.body));
  const uzun = await odak(o1.token, SK, 5, k1.id);
  kontrol('çıkış kaydedildi (1 kez, 5 sn) ve o soru kapandı', uzun.status === 200 && uzun.body.cikisSayildi === true && uzun.body.deneme.cikisSayisi === 1 &&
    uzun.body.deneme.cikisSn === 5 && uzun.body.kapananSoru === k1.id && uzun.body.sorular[0].kapandi === 'cikis', J(uzun.body));
  kontrol('kapanan soruya cevap yazılamaz, öbürleri açık', (await cevap(o1.token, SK, k1.id, [k1.secenekler[0].id])).status === 409 &&
    (await cevap(o1.token, SK, k2.id, [k2.secenekler[1].id])).status === 200);
  const abartili = await odak(o1.token, SK, 100000, k3.id);
  kontrol('çıkış süresi denemenin süresini aşamaz', abartili.status === 200 && abartili.body.deneme.cikisSn > 5 && abartili.body.deneme.cikisSn < 5 + 120, J(abartili.body.deneme));
  kontrol('bozuk süre 400', (await odak(o1.token, SK, 'abc', k2.id)).status === 400);
  const skDetay = await iste('/api/assignments/' + SK, 'GET', null, T);
  const skO1 = ((skDetay.body.students || []).find(s => s.id === o1.user.id) || {}).quiz || {};
  kontrol('öğretmen: "2 kez çıktı" ve toplam süre', skO1.durum === 'devam' && skO1.cikisSayisi === 2 && skO1.cikisSn >= 5, J(skO1));
  const skVeli = await iste('/api/progress?studentId=' + o1.user.id, 'GET', null, V);
  kontrol('veli sekme kaydını görmez', skVeli.status === 200 && JSON.stringify(skVeli.body).indexOf('cikis') < 0);
  const sks = { sureTuru: 'soru', cikincaKapanir: true, sorular: [{ tur: 'dy', metin: 'Bir', dogru: true, sureSn: 60 }, { tur: 'dy', metin: 'İki', dogru: true, sureSn: 60 }] };
  const SKS = (await odevVer('Sekme soru başına', sks)).body.assignment.id;
  const sks1 = await basla(o2.token, SKS);
  if (vt) await vt.quiz.geriTarihle(SKS, o2.user.id, 20);
  const sksO = await odak(o2.token, SKS, 4, sks1.body.sorular[0].id);
  kontrol('soru başına sürede çıkınca o soru kapandı, sonrakine geçildi', sksO.body.kapananSoru === sks1.body.sorular[0].id && sksO.body.deneme.soruSira === 2 &&
    sksO.body.sorular[0].metin === 'İki', J(sksO.body));
  if (vt) await vt.quiz.geriTarihle(SKS, o2.user.id, 10);
  const sksSon = await odak(o2.token, SKS, 3, 'uydurma-soru');
  kontrol('son soru çıkınca kapandı: deneme bitti (soru başına sürede soruyu sunucu seçer, soruId önemsiz)',
    sksSon.body.durum === 'bitti' && sksSon.body.deneme.bitisNedeni === 'cikis', J(sksSon.body.deneme));
  /* Çıkarken açık olan soru dışarıdayken süresi dolup kapandıysa, öğrenci
     dışarıdayken açılan sonraki soru kapanmaz. */
  const skd = { sureTuru: 'soru', cikincaKapanir: true, sorular: [{ tur: 'dy', metin: 'Kısa', dogru: true, sureSn: 10 },
    { tur: 'dy', metin: 'Uzun', dogru: true, sureSn: 60 }] };
  const SKD = (await odevVer('Sekme dışarıda açılan', skd)).body.assignment.id;
  await basla(o1.token, SKD);
  if (vt) {
    await vt.quiz.geriTarihle(SKD, o1.user.id, 20);
    const disari = await odak(o1.token, SKD, 15, '');
    kontrol('dışarıdayken açılan soru çıkınca kapanmaz (çıkış sayılır)', disari.body.cikisSayildi === true && !disari.body.kapananSoru &&
      disari.body.deneme.soruSira === 2 && disari.body.sorular[0].metin === 'Uzun' && disari.body.sorular[0].kapandi === null, J(disari.body));
    const ekranda = await odak(o1.token, SKD, 3, '');
    kontrol('ekrandayken çıkılan soru kapanır (soruId boş olsa da)', ekranda.body.kapananSoru && ekranda.body.durum === 'bitti' &&
      ekranda.body.deneme.bitisNedeni === 'cikis', J(ekranda.body));
  } else kontrol('test veritabanına bağlanılamadı (sekme, soru başına)', false);
  /* Serbest modda soruId uydurma ya da boşsa sunucu en son cevaplanan açık soruyu, o da yoksa ilk açık soruyu kapatır. */
  const SKU = (await odevVer('Sekme uydurma soru', { cikincaKapanir: true, sorular: [tekDy, { tur: 'dy', metin: 'İki', dogru: false },
    { tur: 'dy', metin: 'Üç', dogru: true }] })).body.assignment.id;
  const sku = await basla(o2.token, SKU);
  if (vt) await vt.quiz.geriTarihle(SKU, o2.user.id, 60);
  const [u1, u2] = sku.body.sorular;
  await cevap(o2.token, SKU, u2.id, [u2.secenekler[1].id]);
  const uyd = await odak(o2.token, SKU, 5, 'qs_uydurma');
  kontrol('serbest modda uydurma soruId: en son cevaplanan soru kapandı', uyd.body.cikisSayildi === true && uyd.body.kapananSoru === u2.id, J(uyd.body));
  const bosId = await odak(o2.token, SKU, 5, '');
  kontrol('serbest modda boş soruId: ilk açık soru kapandı', bosId.body.kapananSoru === u1.id, J(bosId.body));
  const kapanmaz = (await odevVer('Çıkınca kapanmaz', { sorular: [tekDy, tekDy] })).body.assignment.id;
  const kp = await basla(o2.token, kapanmaz);
  if (vt) await vt.quiz.geriTarihle(kapanmaz, o2.user.id, 30);
  const kpO = await odak(o2.token, kapanmaz, 6, kp.body.sorular[0].id);
  kontrol('seçenek kapalıyken çıkış sayılır ama soru kapanmaz', kpO.body.cikisSayildi === true && !kpO.body.kapananSoru && kpO.body.sorular[0].kapandi === null &&
    (await cevap(o2.token, kapanmaz, kp.body.sorular[0].id, [kp.body.sorular[0].secenekler[0].id])).status === 200, J(kpO.body));

  console.log('=== 12) YETKİLER ===');
  const yalniz = (await odevVer('Yalnız Zeynep', DORTLU(), { studentIds: [o1.user.id] })).body.assignment.id;
  kontrol('başka öğrenci (ödevde değil) göremez, başlatamaz (404)', (await durum(o2.token, yalniz)).status === 404 &&
    (await basla(o2.token, yalniz)).status === 404);
  const fenler = await Promise.all([iste(Y(yalniz), 'GET', null, fen.token), iste(Y(yalniz), 'POST', { quiz: DORTLU() }, fen.token),
    iste(Y(yalniz) + '/ayrinti?ogrenci=' + o1.user.id, 'GET', null, fen.token), iste(Y(yalniz) + '/sonuc-ac', 'POST', {}, fen.token)]);
  kontrol('başka öğretmen quize erişemez (403)', fenler.every(r => r.status === 403), J(fenler.map(r => r.status)));
  const veliler = await Promise.all([iste(Y(yalniz), 'GET', null, V), basla(V, yalniz), iste(Y(yalniz) + '/ayrinti?ogrenci=' + o1.user.id, 'GET', null, V)]);
  kontrol('veli quiz uçlarına erişemez (403)', veliler.every(r => r.status === 403), J(veliler.map(r => r.status)));
  const mudur = await iste(Y(yalniz), 'GET', null, M);
  kontrol('müdür sahibi olan ödevin quizini açamaz (bugünkü kural)', mudur.status === 403, 'status ' + mudur.status);
  const ogretmenBasla = await basla(T, yalniz);
  kontrol('öğretmen öğrenci yerine başlatamaz', ogretmenBasla.status !== 200 && (!vt || (await vt.quiz.denemeSayisi(yalniz)) === 0), 'status ' + ogretmenBasla.status);

  console.log('=== 13) ÖZELLİK KAPALI VE ÖDEV SİLİNİNCE ===');
  await iste('/api/ozellikler', 'POST', { kapali: ['odev'] }, M);
  const kapali = await Promise.all([durum(o1.token, yalniz), basla(o1.token, yalniz), iste(Y(yalniz), 'POST', { quiz: DORTLU() }, T),
    iste('/api/assignments/quiz-metin', 'POST', { metin: '1) x' }, T)]);
  kontrol('ödevler kapalıyken quiz de kapalı (403, ozellikKapali)', kapali.every(r => r.status === 403 && r.body.ozellikKapali === 'odev'), J(kapali.map(r => r.status)));
  await iste('/api/ozellikler', 'POST', { kapali: [] }, M);
  await basla(o1.token, yalniz);
  const cv = (await durum(o1.token, yalniz)).body.sorular[3];
  await cevap(o1.token, yalniz, cv.id, undefined, 'Silinecek cevap');
  const sil = await iste('/api/assignments/' + yalniz + '/delete', 'POST', {}, T);
  const silSonra = await durum(o1.token, yalniz);
  kontrol('ödev silinince quiz, deneme ve cevaplar gitti', sil.status === 200 && silSonra.status === 404 && (!vt ||
    (!(await vt.quiz.bul(yalniz)) && (await vt.quiz.denemeSayisi(yalniz)) === 0 && (await vt.quiz.cevaplari(yalniz, o1.user.id)).length === 0)),
    silSonra.status);

  console.log('=== 14) ARŞİV YILI 409 ===');
  const y1 = await iste('/api/egitim-yili/ekle', 'POST', { ad: '2025-2026' }, M);
  await iste('/api/egitim-yili/ekle', 'POST', { ad: '2026-2027' }, M);
  const bak = await iste('/api/egitim-yili/bak', 'POST', { id: y1.body.yil && y1.body.yil.id }, T);
  const arsiv = await Promise.all([iste(Y(P), 'POST', { quiz: DORTLU() }, T), iste(Y(P) + '/sonuc-ac', 'POST', {}, T),
    iste('/api/assignments/quiz-metin', 'POST', { metin: '1) x' }, T)]);
  kontrol('geçmiş yıla bakan öğretmen quiz yazamaz (409 arşiv)', bak.body.arsiv === true && arsiv.every(r => r.status === 409 && r.body.arsiv === true),
    J(arsiv.map(r => r.status)));

  if (vt) await vt.baglanti.kapat();
  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.error('TEST HATASI:', e.message, e.stack); process.exit(1); });
