/* Quiz yardımcıları (sunucusuz): yapıştırma ayrıştırıcısı (biçim, numara ve şık
   çeşitleri, çok satırlı soru, Word'ün görünmez karakterleri, satır hataları,
   100 soru sınırı), quiz doğrulaması (sınırlar sessizce kırpılmaz), puan
   (eşit ağırlık, çok doğrulu soruda birebir küme, açık uçlu puansız),
   sunucudaki süre (soru başına zincir, 3 sn pay, bütün quiz, son teslim + 10 dk) ve
   ön yüzün kural ve uyarı metinleri (son tarihsiz ödev, süresiz quiz, Tekrar aç). */
const Q = require('../sunucu/yardimci/quiz');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x);
const c = n => String.fromCharCode(n);
const mesajlar = r => r.hatalar.map(h => h.mesaj);

console.log('=== 1) YAPIŞTIRMA BİÇİMİ ===');
const ornek = [
  '1) Aşağıdakilerden hangileri asal sayıdır?',
  '(birden çok doğru olabilir)',
  '*A) 2',
  'B) 4',
  'C) *7',
  'D) 9',
  '2) Güneş bir yıldızdır.',
  'Cevap: Doğru',
  '3) Fotosentezi kendi cümlelerinle anlat.'
].join('\n');
const r1 = Q.quizMetniAyristir(ornek);
kontrol('üç soru, hata yok', r1.sorular.length === 3 && r1.hatalar.length === 0, J(r1.hatalar));
kontrol('çoktan seçmeli: yıldız harften önce ve sonra', r1.sorular[0].tur === 'coktan' &&
  J(r1.sorular[0].secenekler) === J([{ metin: '2', dogru: true }, { metin: '4', dogru: false }, { metin: '7', dogru: true }, { metin: '9', dogru: false }]),
  J(r1.sorular[0].secenekler));
kontrol('soru metni sonraki satıra taşıyor', r1.sorular[0].metin === 'Aşağıdakilerden hangileri asal sayıdır?\n(birden çok doğru olabilir)',
  J(r1.sorular[0].metin));
kontrol('Doğru/Yanlış sorusu', r1.sorular[1].tur === 'dy' && r1.sorular[1].dogru === true && r1.sorular[1].metin === 'Güneş bir yıldızdır.',
  J(r1.sorular[1]));
kontrol('şıksız soru açık uçlu', r1.sorular[2].tur === 'acik' && r1.sorular[2].secenekler.length === 0, J(r1.sorular[2]));
const d1 = Q.quizDogrula({ sorular: r1.sorular });
kontrol('ayrıştırılan sorular doğrulamadan geçiyor', !!d1.quiz && d1.quiz.sorular.length === 3 &&
  J(d1.quiz.sorular[1].secenekler) === J([{ metin: 'Doğru', dogru: true }, { metin: 'Yanlış', dogru: false }]), J(d1));

const r2 = Q.quizMetniAyristir('1. Bir\na) x\n*b. y\n2- İki\nCevap: y\n3) Üç\nCEVAP: YANLIŞ\n4) Dört\ncevap - dogru\n5) Beş\nCevap: D.');
kontrol('numara 1) 1. 1- ve şık a) b. kabul', r2.sorular.length === 5 && r2.sorular[0].tur === 'coktan' &&
  r2.sorular[0].secenekler[1].dogru === true && r2.sorular[0].secenekler[0].dogru === false, J(r2));
kontrol('Cevap: y / YANLIŞ / dogru / D. anlaşılıyor', r2.sorular[1].dogru === false && r2.sorular[2].dogru === false &&
  r2.sorular[3].dogru === true && r2.sorular[4].dogru === true && r2.hatalar.length === 0, J(r2.sorular.map(s => s.dogru)) + J(r2.hatalar));

const r3 = Q.quizMetniAyristir('1) Hangileri doğrudur?\nI. Güneş bir yıldızdır.\nII. Ay bir gezegendir.\n*A) Yalnız I\nB) I ve II\n2) 3.5 kg elmanın\n1-2 tanesi çürük mü?\nCevap: Yanlış');
kontrol('I. II. öncülleri şık sayılmıyor', r3.sorular[0].secenekler.length === 2 &&
  r3.sorular[0].metin === 'Hangileri doğrudur?\nI. Güneş bir yıldızdır.\nII. Ay bir gezegendir.', J(r3.sorular[0]));
kontrol('"3.5 kg" ve "1-2 tanesi" satırları yeni soru sayılmıyor', r3.sorular.length === 2 &&
  r3.sorular[1].metin === '3.5 kg elmanın\n1-2 tanesi çürük mü?' && r3.sorular[1].tur === 'dy', J(r3.sorular[1]));

console.log('=== 2) WORD\'DEN GELEN KARAKTERLER ===');
const word = c(0xFEFF) + '1)' + c(0xA0) + 'Ba' + c(0x200B) + 'şkent' + c(0xAD) + ' neresidir?\r\n*A)' + c(0x2003) + 'Ankara' + c(0x200E) +
  '\r\nB) İstanbul\t\r\n\r\n\r\n\r\n2) Son soru' + c(0x2028);
const r4 = Q.quizMetniAyristir(word);
kontrol('görünmez karakterler ve özel boşluklar temizlendi', r4.sorular.length === 2 && r4.sorular[0].metin === 'Başkent neresidir?' &&
  r4.sorular[0].secenekler[0].metin === 'Ankara' && r4.sorular[0].secenekler[1].metin === 'İstanbul' && r4.sorular[1].metin === 'Son soru',
  J(r4.sorular));
kontrol('metin temizleyici: denetim karakteri ve NUL gider, satırlar korunur', Q.quizMetinTemizle('a' + c(0) + c(7) + 'b\n\n\n\nc', true) === 'ab\n\nc' &&
  Q.quizMetinTemizle('a\nb', false) === 'a b' && Q.quizMetinTemizle({ x: 1 }, true) === '' && Q.quizMetinTemizle(12, false) === '12');

console.log('=== 3) SATIR HATALARI ===');
const r5 = Q.quizMetniAyristir('Başlık satırı\n1) Bir\n*A) x\nB) y\n2) İki\nA) x\nB) y\n3) Üç\nA) tek\n4)\n5) Beş\nCevap: belki\n6) Altı\n*A) x\nB) y\nCevap: Doğru\n7) Yedi\nA) \n*B) z');
const m5 = mesajlar(r5);
kontrol('sorudan önceki satır bildirildi', m5.indexOf('1. satır bir sorunun parçası değil; alınmadı.') >= 0, J(m5));
kontrol('"2. soruda doğru şık işaretli değil"', m5.indexOf('2. soruda doğru şık işaretli değil.') >= 0, J(m5));
kontrol('tek şıklı soru: en az 2 şık', m5.indexOf('3. soruda en az 2 şık olmalı.') >= 0, J(m5));
kontrol('boş soru metni', m5.indexOf('4. sorunun metni boş.') >= 0, J(m5));
kontrol('anlaşılmayan Doğru/Yanlış cevabı', m5.some(x => /^5\. sorunun cevabı anlaşılamadı/.test(x)), J(m5));
kontrol('şıklı soruda Cevap satırı uyarısı', m5.some(x => /^6\. soruda "Cevap:" satırı/.test(x)), J(m5));
kontrol('boş şık', m5.indexOf('7. sorunun 1. şıkkı boş.') >= 0, J(m5));
kontrol('hatalı sorular listede kalıyor (düzenleyicide düzeltilir)', r5.sorular.length === 7 && r5.hatalar.every(h => typeof h.satir === 'number'),
  r5.sorular.length);
kontrol('hatalar satır sırasıyla', r5.hatalar.every((h, i) => !i || r5.hatalar[i - 1].satir <= h.satir), J(r5.hatalar.map(h => h.satir)));
kontrol('boş metin: soru bulunamadı', Q.quizMetniAyristir('   \n  ').hatalar.length === 1 && Q.quizMetniAyristir('').sorular.length === 0 &&
  Q.quizMetniAyristir(null).sorular.length === 0);
let yuzBir = '';
for (let i = 1; i <= 105; i++) yuzBir += i + ') Soru ' + i + '\nCevap: D\n';
const r6 = Q.quizMetniAyristir(yuzBir);
kontrol('100 sorudan sonrası alınmadı ve bildirildi', r6.sorular.length === 100 && mesajlar(r6).some(x => /En fazla 100 soru/.test(x)),
  r6.sorular.length + ' ' + J(mesajlar(r6)));
const uzun = Q.quizMetniAyristir('1) ' + 'x'.repeat(1001) + '\n*A) ' + 'y'.repeat(301) + '\nB) z');
kontrol('uzun soru ve şık bildirildi (kırpılmadı)', mesajlar(uzun).indexOf('1. sorunun metni 1000 karakterden uzun.') >= 0 &&
  mesajlar(uzun).indexOf('1. sorunun 1. şıkkı 300 karakterden uzun.') >= 0 && uzun.sorular[0].metin.length === 1001, J(mesajlar(uzun)));
const onceki = Q.quizMetniAyristir('Matematik quizi\nAşağıdakileri cevapla\n\n1) Bir\nCevap: D');
kontrol('ilk sorudan önceki satırlar tek sorunda toplanır', J(mesajlar(onceki)) ===
  J(['İlk sorudan önceki 2 satır (1–2. satırlar) bir sorunun parçası değil; alınmadı.']), J(mesajlar(onceki)));
const yigin = Q.quizMetniAyristir('x\n'.repeat(150000) + '1) Soru\nCevap: D\n' + 'y\n'.repeat(500));
kontrol('sorun listesi en çok 50 (+ "ve N sorun daha"); 150 bin satırlık metin tek sorun', yigin.hatalar.length === Q.QUIZ_HATA_EN_COK + 1 &&
  /önceki 150000 satır/.test(yigin.hatalar[0].mesaj) && yigin.hatalar[50].mesaj === 'Ve 451 sorun daha. Önce yukarıdakileri düzelt.',
  yigin.hatalar.length + ' ' + J(yigin.hatalar[50]));

console.log('=== 3b) WORD TİRESİ, 11. ŞIK, TANINMAYAN ŞIK, BÜTÜN ŞIKLAR DOĞRU ===');
const tire = Q.quizMetniAyristir('1– Birinci soru\n*A) x\nB) y\n2— İkinci soru\nCevap: Yanlış\n3 – Üçüncü');
kontrol('Word\'ün uzun tiresi (1– 1—) soru numarası sayılır', tire.sorular.length === 3 && tire.hatalar.length === 0 &&
  tire.sorular[0].metin === 'Birinci soru' && tire.sorular[1].tur === 'dy' && tire.sorular[2].tur === 'acik', J(tire));
const onBirSik = Q.quizMetniAyristir('1) On bir şık\n' + 'ABCDEFGHIJK'.split('').map((h, i) => (i ? '' : '*') + h + ') ' + (i + 1)).join('\n'));
kontrol('11. şık (K) şık sayılır ve "en fazla 10 şık" hatası çıkar (10. şıkka eklenmez)', onBirSik.sorular[0].secenekler.length === 11 &&
  onBirSik.sorular[0].secenekler[9].metin === '10' && mesajlar(onBirSik).indexOf('1. soruda en fazla 10 şık olabilir.') >= 0, J(mesajlar(onBirSik)));
const yildiz = Q.quizMetniAyristir('1) Soru\n' + c(0x2217) + 'A) bir\nB) ' + c(0xFF0A) + 'iki\nC) üç');
kontrol('yıldız benzerleri (∗ ＊) doğru işareti sayılır', J(yildiz.sorular[0].secenekler.map(x => x.dogru)) === J([true, true, false]) &&
  yildiz.sorular[0].secenekler[1].metin === 'iki', J(yildiz.sorular[0].secenekler));
const tanimsiz = Q.quizMetniAyristir('1) Tireli şıklar\nA- bir\nB- iki\n2) Başka\n*A) x\nB) y\nC- z\n3) B şıkkıyla başlayan\nB) x\nC) y');
const mt = mesajlar(tanimsiz);
kontrol('şıkka benzeyen ama tanınmayan satırlar uyarılır (soru metnine ya da önceki şıkka eklenir)', tanimsiz.sorular[0].tur === 'acik' &&
  mt.some(x => /^2\. satır şıkka benziyor.*soru metnine eklendi/.test(x)) && mt.some(x => /^7\. satır şıkka benziyor.*önceki şıkka eklendi/.test(x)) &&
  mt.some(x => /^9\. satır şıkka benziyor/.test(x)), J(mt));
const oncul = Q.quizMetniAyristir('1) Hangileri doğru?\nI. Bir\nV. Beş\nX. On\nA-B arası 5 km\n*A) Yalnız I\nB) I ve V');
kontrol('öncüller (I. V. X.) ve "A-B arası" uyarı vermez', oncul.hatalar.length === 0 && oncul.sorular[0].secenekler.length === 2, J(mesajlar(oncul)));
const hepsi = Q.quizMetniAyristir('1) Hangileri çifttir?\n*A) 2\n*B) 4');
kontrol('bütün şıkları doğru soru: önizlemede sorun', mesajlar(hepsi).indexOf('1. soruda bütün şıklar doğru işaretli; en az bir şık yanlış olmalı.') >= 0,
  J(mesajlar(hepsi)));

console.log('=== 4) DOĞRULAMA VE SINIRLAR ===');
const soru = (tur, ek) => Object.assign({ tur, metin: 'Soru' }, ek);
const dy = soru('dy', { dogru: false });
const cs = soru('coktan', { secenekler: [{ metin: 'a', dogru: true }, { metin: 'b' }] });
const iyi = Q.quizDogrula({ sorular: [dy, cs, soru('acik')] });
kontrol('varsayılanlar: süresiz, sonuç son teslimden sonra, çıkınca kapanmaz', !!iyi.quiz && iyi.quiz.sureTuru === 'yok' &&
  iyi.quiz.sonucGorunum === 'teslim' && iyi.quiz.cikincaKapanir === false && iyi.quiz.toplamSn === null, J(iyi));
kontrol('Doğru/Yanlış: "Yanlış" şıkkı doğru', J(iyi.quiz.sorular[0].secenekler) === J([{ metin: 'Doğru', dogru: false }, { metin: 'Yanlış', dogru: true }]));
const hata = q => (Q.quizDogrula(q).hata || '');
kontrol('soru yoksa hata', /en az bir soru/.test(hata({ sorular: [] })) && /en az bir soru/.test(hata({})));
kontrol('101 soru reddedildi', /en fazla 100 soru/.test(hata({ sorular: Array(101).fill(dy) })));
kontrol('100 soru kabul', !!Q.quizDogrula({ sorular: Array(100).fill(dy) }).quiz);
kontrol('1001 karakterlik soru reddedildi (kırpılmadı)', hata({ sorular: [soru('acik', { metin: 'x'.repeat(1001) })] }) ===
  '1. sorunun metni en fazla 1000 karakter olabilir.');
kontrol('1000 karakterlik soru kabul', !!Q.quizDogrula({ sorular: [soru('acik', { metin: 'x'.repeat(1000) })] }).quiz);
kontrol('301 karakterlik şık reddedildi', /2\. sorunun 1\. şıkkı en fazla 300/.test(hata({ sorular: [dy,
  soru('coktan', { secenekler: [{ metin: 'y'.repeat(301), dogru: true }, { metin: 'b' }] })] })));
const onBir = [];
for (let i = 0; i < 11; i++) onBir.push({ metin: 'ş' + i, dogru: i === 0 });
kontrol('11 şık reddedildi, 10 kabul', /en fazla 10 şık/.test(hata({ sorular: [soru('coktan', { secenekler: onBir })] })) &&
  !!Q.quizDogrula({ sorular: [soru('coktan', { secenekler: onBir.slice(0, 10) })] }).quiz);
kontrol('tek şık reddedildi', /en az 2 şık/.test(hata({ sorular: [soru('coktan', { secenekler: [{ metin: 'a', dogru: true }] })] })));
kontrol('bütün şıkları doğru soru reddedildi (iki şıklı iki doğrulu soruda cevap belli olurdu)',
  hata({ sorular: [dy, soru('coktan', { secenekler: [{ metin: 'a', dogru: true }, { metin: 'b', dogru: true }] })] }) ===
  '2. soruda bütün şıklar doğru işaretli; en az bir şık yanlış olmalı.' &&
  !!Q.quizDogrula({ sorular: [soru('coktan', { secenekler: [{ metin: 'a', dogru: true }, { metin: 'b', dogru: true }, { metin: 'c' }] })] }).quiz);
kontrol('"1. soruda doğru şık işaretli değil"', hata({ sorular: [soru('coktan', { secenekler: [{ metin: 'a' }, { metin: 'b' }] })] }) ===
  '1. soruda doğru şık işaretli değil.');
kontrol('Doğru/Yanlış cevabı seçilmemiş', /doğru cevap/.test(hata({ sorular: [soru('dy')] })));
kontrol('bilinmeyen tür ve boş metin', /türü seçilmeli/.test(hata({ sorular: [soru('resim')] })) &&
  hata({ sorular: [soru('acik', { metin: '  ' + c(0x200B) + ' ' })] }) === '1. sorunun metni boş.');
kontrol('soru başına: süre şart, 10 sn - 10 dk', /süresi 10 saniye/.test(hata({ sureTuru: 'soru', sorular: [dy] })) &&
  /süresi 10 saniye/.test(hata({ sureTuru: 'soru', sorular: [soru('dy', { dogru: true, sureSn: 9 })] })) &&
  /süresi 10 saniye/.test(hata({ sureTuru: 'soru', sorular: [soru('dy', { dogru: true, sureSn: 601 })] })) &&
  !!Q.quizDogrula({ sureTuru: 'soru', sorular: [soru('dy', { dogru: true, sureSn: 10 }), soru('dy', { dogru: true, sureSn: '600' })] }).quiz);
kontrol('soru başına olmayan quizde soru süresi yok sayılır', Q.quizDogrula({ sorular: [soru('dy', { dogru: true, sureSn: 30 })] }).quiz.sorular[0].sureSn === null);
kontrol('bütün quiz: 1-180 dk', /1 ile 180 dakika/.test(hata({ sureTuru: 'quiz', sorular: [dy] })) &&
  /1 ile 180 dakika/.test(hata({ sureTuru: 'quiz', toplamDk: 181, sorular: [dy] })) &&
  /1 ile 180 dakika/.test(hata({ sureTuru: 'quiz', toplamDk: 1.5, sorular: [dy] })) &&
  Q.quizDogrula({ sureTuru: 'quiz', toplamDk: 1, sorular: [dy] }).quiz.toplamSn === 60 &&
  Q.quizDogrula({ sureTuru: 'quiz', toplamDk: 180, sorular: [dy] }).quiz.toplamSn === 10800);
kontrol('bilinmeyen süre türü ve sonuç görünümü reddedildi', /Süre türü/.test(hata({ sureTuru: 'x', sorular: [dy] })) &&
  /ne zaman görüneceği/.test(hata({ sonucGorunum: 'yarin', sorular: [dy] })) &&
  Q.quizDogrula({ sonucGorunum: 'hemen', cikincaKapanir: true, sorular: [dy] }).quiz.sonucGorunum === 'hemen');
let atmadi = true;
for (const kotu of [null, undefined, 'x', 5, [], [1], { sorular: 'x' }, { sorular: [null, 1, 'a'] }, { sorular: [{ tur: 'coktan', metin: 'x', secenekler: [null, 'a'] }] },
  { sorular: [{ tur: {}, metin: {} }] }, { sureTuru: {}, sorular: [dy] }, { sorular: [{ tur: 'coktan', metin: 'x', secenekler: 'ab' }] }]) {
  try { if (!Q.quizDogrula(kotu).hata) atmadi = false; } catch (e) { atmadi = false; }
}
kontrol('bozuk girdiler hata döndürüyor, istisna atmıyor', atmadi);

console.log('=== 5) PUAN ===');
const sorular = [
  { id: 's1', tur: 'dy', secenekler: [{ id: 'd', dogru: true }, { id: 'y', dogru: false }] },
  { id: 's2', tur: 'coktan', secenekler: [{ id: 'a', dogru: false }, { id: 'b', dogru: true }, { id: 'c', dogru: false }] },
  { id: 's3', tur: 'coktan', secenekler: [{ id: 'p', dogru: true }, { id: 'r', dogru: false }, { id: 't', dogru: true }] },
  { id: 's4', tur: 'acik', secenekler: [] }
];
const tam = Q.puanHesapla(sorular, { s1: ['d'], s2: ['b'], s3: ['t', 'p'], s4: [] });
kontrol('hepsi doğru: 3/3, açık uçlu puansız', tam.dogru === 3 && tam.puanli === 3 && tam.acikUclu === 1 && tam.yuzde === 100 &&
  tam.sorular.s4 === null, J(tam));
const fazla = Q.puanHesapla(sorular, { s1: ['y'], s2: ['b'], s3: ['p', 'r', 't'] });
kontrol('fazladan yanlış şık puanı sıfırlar', fazla.dogru === 1 && fazla.sorular.s3 === false && fazla.sorular.s1 === false && fazla.yuzde === 33, J(fazla));
const eksik = Q.puanHesapla(sorular, { s3: ['p'], s2: ['b', 'b'] });
kontrol('eksik küme puan almaz; tekrar eden seçim tek sayılır', eksik.sorular.s3 === false && eksik.sorular.s2 === true && eksik.dogru === 1, J(eksik));
const bos = Q.puanHesapla(sorular, {});
kontrol('cevapsız soru yanlış', bos.dogru === 0 && bos.puanli === 3 && bos.yuzde === 0, J(bos));
kontrol('yalnız açık uçlu quizde yüzde yok', Q.puanHesapla([sorular[3]], {}).yuzde === null);

console.log('=== 6) SUNUCUDAKİ SÜRE ===');
const uc = [{ id: 'q1', sureSn: 10 }, { id: 'q2', sureSn: 10 }, { id: 'q3', sureSn: 10 }];
const ilerle = (ek) => Q.denemeIlerlet(Object.assign({ sureTuru: 'soru', toplamSn: null, sorular: uc,
  deneme: { baslama: 0, soruSira: 1, soruBaslama: 0 }, teslimSon: null, kapali: false }, ek));
const a1 = ilerle({ simdi: 12900 });
kontrol('3 sn pay içinde soru açık', a1.kapananlar.length === 0 && a1.soruSira === 1 && a1.bitis === null, J(a1));
const a2 = ilerle({ simdi: 13001 });
kontrol('pay geçince soru kapanır, sonraki öncekinin bittiği anda başlar', J(a2.kapananlar) === J([{ soruId: 'q1', acilis: 0, kapanis: 10000 }]) &&
  a2.soruSira === 2 && a2.soruBaslama === 10000 && a2.bitis === null, J(a2));
const a3 = ilerle({ simdi: 40000 });
kontrol('bağlantı kopukken süre işler: bütün sorular kapanır, deneme biter', a3.kapananlar.length === 3 && a3.soruSira === 4 &&
  a3.bitis === 30000 && a3.neden === 'sure', J(a3));
const a4 = ilerle({ simdi: 30000, deneme: { baslama: 0, soruSira: 2, soruBaslama: 20000 } });
kontrol('kaldığı sorudan devam eder', a4.kapananlar.length === 0 && a4.soruSira === 2, J(a4));
const a5 = ilerle({ simdi: 20000, teslimSon: 15000 });
kontrol('soru başında son teslim + 10 dk dolunca deneme biter', J(a5.kapananlar.map(k => k.soruId)) === J(['q1']) &&
  a5.bitis === 15000 && a5.neden === 'teslim', J(a5));
const b1 = Q.denemeIlerlet({ sureTuru: 'quiz', toplamSn: 60, sorular: uc, deneme: { baslama: 0, soruSira: 1, soruBaslama: 0 },
  teslimSon: null, kapali: false, simdi: 62999 });
const b2 = Q.denemeIlerlet({ sureTuru: 'quiz', toplamSn: 60, sorular: uc, deneme: { baslama: 0, soruSira: 1, soruBaslama: 0 },
  teslimSon: null, kapali: false, simdi: 63001 });
kontrol('bütün quiz: süre + 3 sn sonra biter, bitiş süre sonu', b1.bitis === null && b2.bitis === 60000 && b2.neden === 'sure', J([b1, b2]));
const b3 = Q.denemeIlerlet({ sureTuru: 'quiz', toplamSn: 600, sorular: uc, deneme: { baslama: 0, soruSira: 1, soruBaslama: 0 },
  teslimSon: 100000, kapali: false, simdi: 104000 });
kontrol('bütün quizde son teslim + 10 dk önce gelirse o', b3.bitis === 100000 && b3.neden === 'teslim', J(b3));
const b4 = Q.denemeIlerlet({ sureTuru: 'yok', toplamSn: null, sorular: uc, deneme: { baslama: 0, soruSira: 1, soruBaslama: 0 },
  teslimSon: null, kapali: false, simdi: 9e12 });
kontrol('süresiz ve son tarihsiz deneme kendiliğinden bitmez', b4.bitis === null, J(b4));
const b5 = Q.denemeIlerlet({ sureTuru: 'yok', toplamSn: null, sorular: uc, deneme: { baslama: 0, soruSira: 1, soruBaslama: 0 },
  teslimSon: null, kapali: true, simdi: 5000 });
kontrol('ödev sonuçlandıysa deneme hemen biter', b5.bitis === 5000 && b5.neden === 'sonuclandi', J(b5));
const b6 = Q.denemeIlerlet({ sureTuru: 'quiz', toplamSn: 60, sorular: uc, deneme: { baslama: 0, soruSira: 1, soruBaslama: 0 },
  teslimSon: null, kapali: true, simdi: 500000 });
kontrol('quiz kapatıldığında süresi zaten dolmuş deneme süre sonunda ve "süre doldu" nedeniyle biter', b6.bitis === 60000 && b6.neden === 'sure', J(b6));
const b7 = ilerle({ simdi: 15000, kapali: true });
kontrol('soru başına sürede kapatılınca süresi geçen soru "süre" ile kapanır, deneme şimdi biter', J(b7.kapananlar.map(k => k.soruId)) === J(['q1']) &&
  b7.soruSira === 2 && b7.bitis === 15000 && b7.neden === 'sonuclandi', J(b7));

/* Ön yüzün (14c-quiz.js) öğrenciye ve öğretmene yazdığı kurallar tarayıcısız
   denenir: dosya küçük taklitlerle (esc, ik, tarih, S) bir vm bağlamında çalışır. */
console.log('=== 7) ÖN YÜZ METİNLERİ (14c-quiz.js) ===');
const vm = require('vm');
const fs = require('fs');
const hicbir = () => {};
const onyuz = {
  IKONLAR: {}, EYLEMLER: {}, SAYFALAR: {}, S: { user: { role: 'student', id: 'u1' } },
  esc: s => String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]),
  ik: () => '', tarihGun: () => 'GÜN', tarihSaat: () => 'AN', teslimGecti: () => false, yetkim: () => true,
  document: { addEventListener: hicbir, querySelector: () => null }, window: { addEventListener: hicbir },
  setTimeout, clearTimeout, setInterval, clearInterval
};
vm.createContext(onyuz);
vm.runInContext(fs.readFileSync(require('path').join(__dirname, '..', 'public', 'js', 'parcalar', '14c-quiz.js'), 'utf8'), onyuz);
const metinOf = h => h.replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/\s+/g, ' ');
const qOzet = (ek) => Object.assign({ soruSayisi: 4, acikUcluSayisi: 1, sureTuru: 'yok', toplamSn: null, cikincaKapanir: false, sonucGorunum: 'teslim' }, ek || {});
const odevBilgi = { id: 'a1', title: 'Deneme', subject: 'Matematik' };

const gSuresiz = metinOf(onyuz.quizGirisHtml({ quiz: qOzet(), sonTeslim: null, sonucAcilis: null, baslatabilir: true }, odevBilgi));
kontrol('son tarihsiz ödevin kuralları: sonuç öğretmen açınca, son teslimden söz yok',
  gSuresiz.indexOf('öğretmenin sonuçları açınca görünür') >= 0 && !/son teslim/i.test(gSuresiz), gSuresiz);
const gTarihli = metinOf(onyuz.quizGirisHtml({ quiz: qOzet(), sonTeslim: '2026-09-30T14:00:00.000Z', sonucAcilis: '2026-09-30T14:10:00.000Z',
  baslatabilir: true }, odevBilgi));
kontrol('son tarihli ödevin kuralları: sonuç son teslimden 10 dakika sonra (açılış anıyla), deneme en geç son teslim + 10 dk',
  gTarihli.indexOf('son teslimden 10 dakika sonra açılır (GÜN') >= 0 && gTarihli.indexOf('en geç son teslimden 10 dakika sonra') >= 0, gTarihli);
const bitti = metinOf(onyuz.quizBittiHtml({ quiz: qOzet(), deneme: { bitis: '2026-09-29T10:00:00Z', bitisNedeni: 'ogrenci' }, sonucAcik: false,
  sonucAcilis: null, sorular: [] }, odevBilgi));
kontrol('son tarihsiz ödevde bitti sayfası: sonuç öğretmen açınca', bitti.indexOf('öğretmenin sonuçları açınca görünür') >= 0 && !/son teslim/i.test(bitti), bitti);

const satir = (sureTuru) => metinOf(onyuz.quizOdevSatiri({ id: 'a1', status: 'active', quiz: Object.assign(qOzet({ sureTuru: sureTuru, toplamSn: sureTuru === 'quiz' ? 600 : null }), { durum: 'baslamadi' }) },
  { durum: 'baslamadi', baslatabilir: true, quiz: qOzet({ sureTuru: sureTuru, toplamSn: sureTuru === 'quiz' ? 600 : null }) }));
kontrol('süresiz quizin ödev satırı "süre işler" demez', satir('yok').indexOf('Tek hakkın var; ikinci kez çözülemez.') >= 0 && satir('yok').indexOf('süre işler') < 0, satir('yok'));
kontrol('süreli quizin ödev satırı "süre işler" der', satir('quiz').indexOf('başlayınca süre işler') >= 0, satir('quiz'));

onyuz.S.user = { role: 'teacher', id: 't1' };
kontrol('öğretmen satırı: son tarihliyse "son teslimden 10 dakika sonra", değilse "sen açınca"',
  metinOf(onyuz.quizOgretmenSatiri(Object.assign(qOzet(), { baslayan: 0 }), { id: 'a1', endAt: '2026-09-30' })).indexOf('son teslimden 10 dakika sonra açılır') >= 0 &&
  metinOf(onyuz.quizOgretmenSatiri(Object.assign(qOzet(), { baslayan: 0 }), { id: 'a1', endAt: '' })).indexOf('sonuçları sen açınca görünür') >= 0);
const dz = metinOf(onyuz.quizAlani('deneme', { sureTuru: 'yok', sonucGorunum: 'teslim', sorular: [{ tur: 'acik', metin: 'x' }] }));
kontrol('düzenleyici: son tarihsiz ödevde sonuçların ne zaman görüneceği yazılı',
  dz.indexOf('Son tarihi olmayan ödevde sonuçlar sen açınca ya da ödevi sonuçlandırınca görünür') >= 0, dz);

const tekrar = (q) => {
  onyuz.S._acikOdev = { id: 'a1', studentIds: ['o1', 'o2', 'o3'], endAt: '', endTime: '' };
  onyuz.S._acikOdevQuiz = Object.assign({ baslayan: 1, biten: 1, sonucAcildi: null, sonucGorunum: 'teslim' }, q);
  return onyuz.quizTekrarAcUyarisi('a1');
};
/* Bitiren varken sonuçlandırma doğru cevapları kalıcı açar (sonucAcildi dolu): quiz bir daha başlatılamaz.
   sonucAcildi boşsa (kimse bitirmedi) uyarı yok: başlamamış öğrenci quizi çözebilir. */
kontrol('Tekrar aç uyarısı sonuç kalıcı açıksa: 2 öğrenci quizi başlatamaz, yalnız ödev açılır',
  /2 öğrenci quizi başlatamaz/.test(tekrar({ sonucAcildi: '2026-09-27T08:00:00Z' })) &&
  /yalnızca ödev yeniden açılır/.test(tekrar({ sonucAcildi: '2026-09-27T08:00:00Z' })), tekrar({ sonucAcildi: 'x' }));
kontrol('Tekrar aç uyarısı "Hemen" seçiliyken de aynı (tek hak, kopyaya karşı)',
  /başlatamaz/.test(tekrar({ sonucAcildi: 'x', sonucGorunum: 'hemen' })), tekrar({ sonucAcildi: 'x', sonucGorunum: 'hemen' }));
kontrol('sonuçlar kalıcı açılmadıysa Tekrar aç uyarısı yok', tekrar() === '', tekrar());
kontrol('herkes başladıysa Tekrar aç uyarısı yok', tekrar({ baslayan: 3, biten: 3 }) === '', tekrar({ baslayan: 3, biten: 3 }));

console.log();
console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
process.exit(kaldi ? 1 : 0);
