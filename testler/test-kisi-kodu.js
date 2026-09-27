/* Kişi kodu (öğrencide veli kodu), müdür başvurusunun kalkması, portallar:
   - biçim: 16 karakter, ilk karakter harf; büyük, küçük, rakam ve ! ? # * + =
     her birinden en az biri; karışan karakterler (I L O l o 0 1), tire ve Türkçe
     harf yok; ekranda 4'erli dört grup, arada tire;
   - büyük/küçük harf duyarlı; boşluklar ve tireler silinir (tireli, tiresiz,
     boşluklu yapıştırma olur); eski 10 ve 15 haneli kod geçmez;
   - yetişkinin kişi kodu tek kullanımlık ve yenilenebilir; öğrencinin veli
     kodu kullanınca yenilenmez (iki veli aynı kodla ekler);
   - GET /api/kisilikler yan etkisiz (kod yazmaz);
   - yönetici kişi koduyla kişi bulur (tam ad, maskeli e-posta), yalnız
     yönetici; hız sınırı; okul açarken kod yenilenir; yöneticiye ve okul
     hesabına müdürlük verilemez;
   - okul-basvurusu, admin/pending, admin/decide uçları yok;
   - portallar yalnız yetişkin hesabında ve rol satırında.
   - kod kutusu (05-giris.js): yazarken tire kendiliğinden gelir, silerken
     gider, imleç yerinde kalır; tireli/tiresiz/boşluklu yapıştırma; Kopyala tireli.
   Veritabanı biçim kısıtı ve açılıştaki kod doldurma, test veritabanına
   (adı _test ile biten) depo üzerinden bağlanılarak denenir. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { iste, girisYap, hesapAc, kisiKodu, okulHesabi, tcUret } = require('./giris');
const { kisiKoduUret, kisiKoduSade, kisiKoduBicim, KISI_KODU_DESENI } = require('../sunucu/ortak');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const J = x => JSON.stringify(x).slice(0, 240);
const BUYUK = 'ABCDEFGHJKMNPQRSTUVWXYZ', KUCUK = 'abcdefghijkmnpqrstuvwxyz', RAKAM = '23456789', OZEL = '!?#*+=';
const ALFABE = BUYUK + KUCUK + RAKAM + OZEL;
/* Kullanıcının yapıştırabileceği biçimler: 4'erli boşluklu, ekrandaki tireli,
   tireyle boşluk karışık. */
const bosluklu = k => ' ' + k.slice(0, 4) + '  ' + k.slice(4, 8) + ' ' + k.slice(8, 12) + '\t' + k.slice(12) + ' ';
const tireli = k => k.slice(0, 4) + '-' + k.slice(4, 8) + '-' + k.slice(8, 12) + '-' + k.slice(12);
const karisik = k => ' ' + k.slice(0, 4) + ' - ' + k.slice(4, 8) + '-' + k.slice(8, 12) + ' ' + k.slice(12) + '\n';
const tersHarf = k => k.replace(/[A-Za-z]/g, c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase());
/* Başka yerden kopyalanınca araya girebilen görünmez karakterler (sıfır
   genişlikli boşluk, birleştirici, yumuşak tire, BOM), tire benzerleri (küçük
   ve tam genişlikli tire) ve bölünmez boşluklar: hepsi ayırıcıdır. */
const Z = c => String.fromCharCode(c);
const GORUNMEZLI = 'Ab3#' + Z(0x200B) + Z(0x2060) + 'kQx9' + Z(0xFE63) + '+mPt' + Z(0xFF0D) + '7' + Z(0x00AD) + '?' + Z(0x200C) +
  'z' + Z(0x200D) + 'R' + Z(0xFEFF) + Z(0x00A0) + Z(0x202F) + Z(0x3000);

/* Test veritabanına depo üzerinden bağlantı (yalnızca adı _test ile biterse). */
function testDeposu() {
  process.env.EE_DATA = path.join(__dirname, 'testdata');
  require('../sunucu/ayarlar').ayarlariYukle();
  const baglanti = require('../sunucu/veri/baglanti');
  if (!/_test$/.test(baglanti.veritabaniAdi() || '')) return null;
  return { baglanti, kullanicilar: require('../sunucu/veri/depo/kullanicilar') };
}

/* 05-giris.js'teki kişi kodu bölümü (yardımcılar ve kutunun olay dinleyicileri)
   küçük bir taklit belgeyle vm'de çalışır. Kutuya tarayıcının yaptığı gibi tuş
   tuş yazılır, geri tuşu ve Delete'e basılır, yapıştırılır (kutu en çok 19
   karakter: tarayıcı daha uzununu yazdırmaz). */
function kodKutusu() {
  const kaynak = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'parcalar', '05-giris.js'), 'utf8');
  const bas = kaynak.indexOf('/* Kişi kodu (öğrencininki veli kodudur)');
  const son = kaynak.indexOf('/* Sunucudaki okul aramasıyla aynı sadeleştirme');
  if (bas < 0 || son < bas) throw new Error('05-giris.js içinde kişi kodu bölümü bulunamadı');
  const dinleyici = {};
  const belge = {
    activeElement: null,
    addEventListener: (tur, fn) => { (dinleyici[tur] = dinleyici[tur] || []).push(fn); },
    createEvent: () => ({ initEvent(tur) { this.type = tur; } })
  };
  const kutu = {
    tagName: 'INPUT', classList: { contains: c => c === 'kisi-kodu-girdi' }, value: '', selectionStart: 0, selectionEnd: 0,
    setSelectionRange(a, b) { this.selectionStart = a; this.selectionEnd = b; },
    dispatchEvent(ev) { ev.target = this; (dinleyici[ev.type] || []).forEach(fn => fn(ev)); return true; }
  };
  belge.activeElement = kutu;
  const baglam = { document: belge, window: {}, esc: s => String(s), $: () => null };
  vm.createContext(baglam);
  vm.runInContext(kaynak.slice(bas, son), baglam);
  let duyulan = 0;
  belge.addEventListener('input', () => { duyulan++; });   // kutuyu dinleyen öteki kodlar
  const EN_COK = Number((/maxlength="(\d+)"/.exec(baglam.kisiKoduGirdisi('x')) || [])[1]) || 0;
  const olay = ek => kutu.dispatchEvent(Object.assign({ type: 'input' }, ek));
  const k = {
    baglam, EN_COK,
    get deger() { return kutu.value; },
    get imlec() { return kutu.selectionStart === kutu.selectionEnd ? kutu.selectionStart : [kutu.selectionStart, kutu.selectionEnd]; },
    get duyulan() { return duyulan; },
    bosalt() { kutu.value = ''; kutu.selectionStart = kutu.selectionEnd = 0; kutu.dispatchEvent({ type: 'focusin' }); return k; },
    imlecKoy(a, b) { kutu.selectionStart = a; kutu.selectionEnd = b === undefined ? a : b; return k; },
    yaz(metin) {
      for (const ch of metin) {
        const v = kutu.value, a = kutu.selectionStart, b = kutu.selectionEnd;
        if (v.length - (b - a) >= EN_COK) continue;   // maxlength: tarayıcı yazdırmaz
        kutu.value = v.slice(0, a) + ch + v.slice(b);
        kutu.selectionStart = kutu.selectionEnd = a + 1;
        olay({ inputType: 'insertText' });
      }
      return k;
    },
    geri(kez) {
      for (let i = 0; i < (kez || 1); i++) {
        const v = kutu.value, a = kutu.selectionStart, b = kutu.selectionEnd;
        if (a === b && a === 0) continue;
        const s = a === b ? a - 1 : a;
        kutu.value = v.slice(0, s) + v.slice(b);
        kutu.selectionStart = kutu.selectionEnd = s;
        olay({ inputType: 'deleteContentBackward' });
      }
      return k;
    },
    sil() {
      const v = kutu.value, a = kutu.selectionStart, b = kutu.selectionEnd;
      if (a === b && a === v.length) return k;
      kutu.value = v.slice(0, a) + v.slice(a === b ? a + 1 : b);
      kutu.selectionStart = kutu.selectionEnd = a;
      olay({ inputType: 'deleteContentForward' });
      return k;
    },
    yapistir(metin) {
      const ev = { type: 'paste', clipboardData: { getData: () => metin }, preventDefault() { this.onlendi = true; } };
      kutu.dispatchEvent(ev);
      if (!ev.onlendi) {   // tarayıcının kendi yapıştırması: maxlength'e sığanı
        const v = kutu.value, a = kutu.selectionStart, b = kutu.selectionEnd;
        const sigan = metin.slice(0, Math.max(0, EN_COK - (v.length - (b - a))));
        kutu.value = v.slice(0, a) + sigan + v.slice(b);
        kutu.selectionStart = kutu.selectionEnd = a + sigan.length;
        olay({ inputType: 'insertFromPaste' });
      }
      return k;
    },
    /* Telefon klavyesi gibi birleştirerek yazar (IME composition): sözcük
       harf harf büyür, her adımda "input" (isComposing) gelir; sonunda sözcük
       işlenir. Tarayıcı birleştirilen yeri (başlangıç + uzunluk) kendisi tutar:
       değer arada dışarıdan değişirse bir sonraki adım yanlış yeri değiştirir
       (gerçek tarayıcıda harflerin çoğalması böyle olur). sira: 'chrome' son
       "input"u compositionend'den önce, 'firefox' sonra gönderir. Harf ve
       rakam dizileri birleştirilir, işaretler tek tek yazılır (GBoard gibi). */
    birlestirerekYaz(parcalar, sira) {
      for (const p of parcalar) {
        if (!/^[A-Za-z0-9]+$/.test(p)) { k.yaz(p); continue; }
        let v = kutu.value;
        const bas = kutu.selectionStart;
        kutu.value = v.slice(0, bas) + v.slice(kutu.selectionEnd);
        let uz = 0;
        kutu.dispatchEvent({ type: 'compositionstart' });
        const guncelle = (metin, birlesiyor) => {
          v = kutu.value;
          kutu.value = v.slice(0, bas) + metin + v.slice(bas + uz);
          uz = metin.length;
          kutu.selectionStart = kutu.selectionEnd = bas + uz;
          olay({ inputType: 'insertCompositionText', isComposing: birlesiyor });
        };
        for (let i = 1; i < p.length; i++) guncelle(p.slice(0, i), true);
        /* İşlenirken maxlength'e sığmayanı tarayıcı keser. */
        const tasan = Math.max(0, kutu.value.length - uz + p.length - EN_COK);
        const son = p.slice(0, p.length - tasan);
        if (sira === 'firefox') {
          v = kutu.value;
          kutu.value = v.slice(0, bas) + son + v.slice(bas + uz);
          uz = son.length;
          kutu.selectionStart = kutu.selectionEnd = bas + uz;
          kutu.dispatchEvent({ type: 'compositionend' });
          olay({ inputType: 'insertCompositionText', isComposing: false });
        } else {
          guncelle(son, true);
          kutu.dispatchEvent({ type: 'compositionend' });
        }
      }
      return k;
    }
  };
  return k.bosalt();
}

(async () => {
  console.log('=== 1) BİÇİM (sunucusuz) ===');
  const kodlar = Array.from({ length: 3000 }, kisiKoduUret);
  kontrol('3000 kod: hepsi 16 karakter, ilk karakter harf', kodlar.every(k => k.length === 16 && /^[A-Za-z]/.test(k)));
  kontrol('yalnız alfabe: I L O l o 0 1, tire ve Türkçe harf yok', kodlar.every(k => [...k].every(c => ALFABE.indexOf(c) >= 0)) &&
    !kodlar.some(k => /[ILOlo01çğıöşüÇĞİÖŞÜ\s-]/.test(k)));
  kontrol('her kodda büyük, küçük, rakam ve özel karakter var', kodlar.every(k =>
    [BUYUK, KUCUK, RAKAM, OZEL].every(s => [...k].some(c => s.indexOf(c) >= 0))));
  kontrol('kodlar birbirinden farklı', new Set(kodlar).size === kodlar.length);
  kontrol('alfabenin her karakteri üretiliyor', [...ALFABE].every(c => kodlar.some(k => k.indexOf(c) >= 0)));
  const ornek = 'Ab3#kQx9+mPt7?zR';
  kontrol('ekranda 4\'erli dört grup, arada tire', kisiKoduBicim(ornek) === 'Ab3#-kQx9-+mPt-7?zR', kisiKoduBicim(ornek));
  kontrol('sadeleştirme boşlukları ve tireleri siler, harf durumunu korur', kisiKoduSade(tireli(ornek)) === ornek &&
    kisiKoduSade(bosluklu(ornek)) === ornek && kisiKoduSade(karisik(ornek)) === ornek && kisiKoduSade(ornek) === ornek &&
    kisiKoduSade('Ab3#\u2010kQx9\u2013+mPt\u22127?zR') === ornek && kisiKoduSade(tersHarf(ornek)) === tersHarf(ornek),
    [tireli(ornek), bosluklu(ornek), karisik(ornek)].map(kisiKoduSade).join(' | '));
  kontrol('g\u00f6r\u00fcnmez karakterler (U+200B..U+200D, U+2060, U+FEFF, U+00AD), k\u00fc\u00e7\u00fck ve tam geni\u015flikli tire de ay\u0131r\u0131c\u0131',
    kisiKoduSade(GORUNMEZLI) === ornek, J(kisiKoduSade(GORUNMEZLI)));
  kontrol('eski 10 ve 15 haneli kod, eksik/fazla karakter ve alfabe dışı karakter geçersiz', kisiKoduSade('ABCDEFGH23') === '' &&
    kisiKoduSade('ABCDE-FGH23') === '' && kisiKoduSade('Ab3#kQx9+mPt7?z') === '' && kisiKoduSade('Ab3#k Qx9+m Pt7?z') === '' &&
    kisiKoduSade('Ab3#kQx9-mPt7?zR') === '' && kisiKoduSade('Ab3#kQx9+mPt7?zRR') === '' &&
    kisiKoduSade('Ab3#kQx9+mPt7?z0') === '' && kisiKoduSade('Ab3#kQx9+mPt7?zş') === '' &&
    kisiKoduSade('+b3#kQx9+mPt7?zR') === '' && kisiKoduSade('=b3#kQx9+mPt7?zR') === '' && kisiKoduSade({}) === '');
  kontrol('sınıf koşulu: özel karakteri olmayan kod geçersiz; = özel karakter sayılır',
    !KISI_KODU_DESENI.test('Ab3kkQx9mmPt7zzR') && KISI_KODU_DESENI.test('Ab3=kQx9mmPt7zzR'));

  console.log('=== 1b) KOD KUTUSU: TİRE KENDİLİĞİNDEN GELİR (05-giris.js, tarayıcısız) ===');
  const kk = kodKutusu();
  const b = kk.baglam;
  kontrol('ön yüz de 4\'erli tireli biçimliyor; sadeleştirmesi sunucununkiyle aynı', kodlar.slice(0, 300).every(k =>
    b.kisiKoduBicim(k) === kisiKoduBicim(k) && b.kisiKoduSade(kisiKoduBicim(k)) === k && b.kisiKoduSade(karisik(k)) === k &&
    b.kisiKoduSade(bosluklu(k)) === k));
  kontrol('Kopyala tireli biçimi veriyor; kutu en çok 19 karakter', b.kisiKoduKutusu(ornek).indexOf('data-kod="Ab3#-kQx9-+mPt-7?zR"') >= 0 &&
    b.kisiKoduKutusu(ornek).indexOf('>Ab3#-kQx9-+mPt-7?zR</code>') >= 0 && kk.EN_COK === 19, b.kisiKoduKutusu(ornek));
  kontrol('eksik kodda "16 karakterdir" uyarısı, tam kodda uyarı yok', /16 karakterdir/.test(b.kisiKoduDenetle('Ab3#-kQx9-+mPt-7?z', 'Veli kodu')) &&
    b.kisiKoduDenetle(tireli(ornek)) === '' && b.kisiKoduDenetle(bosluklu(ornek)) === '');
  const adimlar = [];
  for (const ch of ornek) { kk.yaz(ch); adimlar.push(kk.deger); }
  kontrol('yazarken her 4 karakterden sonra tire kendiliğinden geliyor (sonda tire kalmıyor)',
    adimlar[3] === 'Ab3#' && adimlar[4] === 'Ab3#-k' && adimlar[8] === 'Ab3#-kQx9-+' && kk.deger === 'Ab3#-kQx9-+mPt-7?zR' &&
    kk.imlec === 19, adimlar.join(' | '));
  kk.yaz('X');
  kontrol('kutu doluyken 17. karakter yazılmıyor', kk.deger === 'Ab3#-kQx9-+mPt-7?zR', kk.deger);
  kk.geri();
  const g1 = kk.deger;
  kk.geri(3);
  kontrol('sondan silerken grup boşalınca tire de gidiyor', g1 === 'Ab3#-kQx9-+mPt-7?z' && kk.deger === 'Ab3#-kQx9-+mPt' &&
    kk.imlec === 14, g1 + ' / ' + kk.deger + ' @' + kk.imlec);
  kk.bosalt().yaz(ornek).imlecKoy(5).geri();
  kontrol('tirenin hemen ardında geri tuşu: tireden önceki karakter siliniyor, imleç yerinde', kk.deger === 'Ab3k-Qx9+-mPt7-?zR' &&
    kk.imlec === 3, kk.deger + ' @' + kk.imlec);
  kk.bosalt().yaz(ornek).imlecKoy(4).sil();
  kontrol('tirenin hemen önünde Delete: tireden sonraki karakter siliniyor', kk.deger === 'Ab3#-Qx9+-mPt7-?zR' && kk.imlec === 4,
    kk.deger + ' @' + kk.imlec);
  kk.bosalt().yaz(ornek).imlecKoy(7).geri();
  kontrol('grup ortasında geri tuşu: tek karakter siliniyor, gruplar kayıyor, imleç yerinde', kk.deger === 'Ab3#-kx9+-mPt7-?zR' &&
    kk.imlec === 6, kk.deger + ' @' + kk.imlec);
  kk.bosalt().yaz(ornek.slice(0, 15)).imlecKoy(2).yaz('W');
  kontrol('araya yazınca gruplar kayıyor, imleç yazılan karakterin ardında', kk.deger === 'AbW3-#kQx-9+mP-t7?z' && kk.imlec === 3,
    kk.deger + ' @' + kk.imlec);
  const yapistirilan = [tireli(ornek), ornek, bosluklu(ornek), karisik(ornek), '  ' + tireli(ornek) + '   \n', ornek + 'XYZ'].map(m => {
    const once = kk.bosalt().duyulan;
    kk.yapistir(m);
    return { m, deger: kk.deger, imlec: kk.imlec, duyuldu: kk.duyulan > once };
  });
  kontrol('yapıştırma: tireli, tiresiz, boşluklu, karışık, başı sonu boşluklu ve fazla uzun kod tireli biçime giriyor; ' +
    'kutuyu dinleyen öteki kodlar duyuyor', yapistirilan.every(y => y.deger === 'Ab3#-kQx9-+mPt-7?zR' && y.imlec === 19 && y.duyuldu),
    J(yapistirilan));
  kk.bosalt().yaz('Ab').yapistir('3#kQx9').yaz('+m');
  kontrol('yazıp araya yapıştırıp yazmayı sürdürünce de biçim doğru', kk.deger === 'Ab3#-kQx9-+m' && kk.imlec === 12,
    kk.deger + ' @' + kk.imlec);
  kk.bosalt().yaz(ornek).imlecKoy(0, 19).yapistir('Zz9#-zZz9-#zZz-9#zZ');
  kontrol('seçili kodun üstüne yapıştırınca yenisi geçiyor', kk.deger === 'Zz9#-zZz9-#zZz-9#zZ' && kk.imlec === 19, kk.deger);
  kk.bosalt().yaz('Zz').yapistir(tireli(ornek));
  kontrol('içinde yazı varken tam kod yapıştırınca kutuda yalnız o kalıyor', kk.deger === 'Ab3#-kQx9-+mPt-7?zR' && kk.imlec === 19,
    kk.deger + ' @' + kk.imlec);
  const metinli = ['Veli kodu: ' + tireli(ornek), 'Kodun ' + tireli(ornek) + ' olarak görünür.', 'Kod Abcd ' + tireli(ornek),
    'Veli kodu:\n' + bosluklu(ornek) + '\nİyi günler', '"' + ornek + '"', GORUNMEZLI].map(m => {
    kk.bosalt().yapistir(m);
    return { m, deger: kk.deger };
  });
  kontrol('yapıştırılan metnin içindeki kod ayıklanıyor ("Veli kodu: ..."); görünmez karakterler ve tam genişlikli tire atılıyor',
    metinli.every(y => y.deger === 'Ab3#-kQx9-+mPt-7?zR'), J(metinli));
  kontrol('ön yüzde de görünmez karakterler ve tire benzerleri ayırıcı', b.kisiKoduSade(GORUNMEZLI) === ornek &&
    b.kisiKoduAyikla('Ab3#') === '' && b.kisiKoduAyikla('Ab3kkQx9mmPt7zzR') === '' && b.kisiKoduAyikla(ornek + 'XYZ') === '',
    J(b.kisiKoduSade(GORUNMEZLI)));
  /* Ayırıcı kümesi iki dosyada ayrı yazılı (05-giris.js, ortak.js): her UTF-16 biriminde aynı karar. */
  const kumeFarki = [];
  for (let c = 0; c < 0x10000; c++) {
    const m = ornek.slice(0, 8) + String.fromCharCode(c) + ornek.slice(8);
    if ((b.kisiKoduSade(m) === ornek) !== (kisiKoduSade(m) === ornek)) kumeFarki.push(c.toString(16));
  }
  kontrol('ön yüz ve sunucu 65536 karakterin her birinde aynı ayırıcı kararını veriyor', kumeFarki.length === 0, kumeFarki.slice(0, 20).join(','));

  console.log('=== 1c) KOD KUTUSU: TELEFON KLAVYESİ BİRLEŞTİREREK YAZINCA (IME) ===');
  for (const sira of ['chrome', 'firefox']) {
    const sonuc = [
      [['Ab3', '#', 'kQx9', '+', 'mPt7', '?', 'zR'], 'Ab3#-kQx9-+mPt-7?zR'],
      [['Abcdefgh23'], 'Abcd-efgh-23'],
      [['Abcd', '2', '#', 'efgh'], 'Abcd-2#ef-gh'],
      [['Abcdefghjk', '#', 'mnpqrstu'], 'Abcd-efgh-jk#m-npqr']
    ].map(([parcalar, beklenen]) => {
      kk.bosalt().birlestirerekYaz(parcalar, sira);
      return { parcalar: parcalar.join(' '), deger: kk.deger, imlec: kk.imlec, beklenen };
    });
    kontrol(sira + ' sırası: harfler çoğalmıyor, tireler birleştirme bitince geliyor, imleç sonda',
      sonuc.every(s => s.deger === s.beklenen && s.imlec === s.beklenen.length), J(sonuc));
    kk.bosalt().yaz('Ab3#kQx9').imlecKoy(5).birlestirerekYaz(['ZZ'], sira);
    kontrol(sira + ' sırası: araya birleştirerek yazınca gruplar kayıyor, imleç yazılanın ardında',
      kk.deger === 'Ab3#-ZZkQ-x9' && kk.imlec === 7, kk.deger + ' @' + kk.imlec);
  }
  kk.bosalt().birlestirerekYaz(['Ab3', '#', 'kQx9'], 'chrome').geri();
  kontrol('birleştirmeden sonra geri tuşu olağan çalışıyor', kk.deger === 'Ab3#-kQx' && kk.imlec === 8, kk.deger + ' @' + kk.imlec);

  const A = (await girisYap('admin@egitimevi.com', 'admin123')).token;
  const Mg = await girisYap('mudur@test.com', 'Test1234!');
  const M = Mg.token;
  const z = Date.now().toString(36);

  console.log('=== 2) VELİ KODU: İKİ VELİ AYNI KODLA, HARF DUYARLI ===');
  const ogrenciler = (await iste('/api/school/students', 'GET', null, M)).body.students || [];
  const o1 = ogrenciler.find(s => s.username === 'ogrenci1');
  kontrol('öğrencinin veli kodu geçerli biçimde', KISI_KODU_DESENI.test(o1.code || ''), o1.code);
  const ogrG = await girisYap('ogrenci1@test.com', 'Test1234!');
  kontrol('öğrenci kendi veli kodunu görüyor (/me), portalı yok', ogrG.user.code === o1.code && ogrG.portallar === undefined &&
    (await iste('/api/me', 'GET', null, ogrG.token)).body.user.code === o1.code, J(ogrG.user));
  const anne = 'anne' + z, baba = 'baba' + z;
  await hesapAc({ fullName: 'Anne Deneme', username: anne, email: anne + '@test.com' });
  await hesapAc({ fullName: 'Baba Deneme', username: baba, email: baba + '@test.com' });
  const AN = (await girisYap(anne, 'Test1234!')).token, BA = (await girisYap(baba, 'Test1234!')).token;
  const eski = await iste('/api/kisilik/cocuk', 'POST', { code: 'ABCDE-FGH23' }, AN);
  const eski15 = await iste('/api/kisilik/cocuk', 'POST', { code: o1.code.slice(0, 15) }, AN);
  const ters = await iste('/api/kisilik/cocuk', 'POST', { code: tersHarf(o1.code) }, AN);
  kontrol('eski 10 haneli, 15 karakterlik ve harf durumu değişmiş kod reddedildi', eski.status === 400 && eski15.status === 400 &&
    ters.status === 400, J(eski.body) + J(eski15.body) + J(ters.body));
  const anneBag = await iste('/api/kisilik/cocuk', 'POST', { code: tireli(o1.code) }, AN);
  const babaBag = await iste('/api/kisilik/cocuk', 'POST', { code: bosluklu(o1.code) }, BA);
  kontrol('anne (ekrandaki tireli biçimi yapıştırarak) ve baba (boşluklu) aynı veli koduyla ekledi', anneBag.status === 200 &&
    babaBag.status === 200 && anneBag.body.cocuklar.length === 1 && babaBag.body.cocuklar.length === 1, J(anneBag.body) + J(babaBag.body));
  const sonra = (await iste('/api/school/students', 'GET', null, M)).body.students.find(s => s.id === o1.id);
  kontrol('veli kodu kullanınca yenilenmedi', sonra.code === o1.code, sonra.code);
  const anneMe = await iste('/api/me', 'GET', null, AN);
  kontrol('velinin /me cevabında veli portalı (çocuğun adıyla)', anneMe.body.hesapAktif === true &&
    (anneMe.body.portallar || []).length === 1 && anneMe.body.portallar[0].tur === 'veli' &&
    anneMe.body.portallar[0].id === o1.id && anneMe.body.portallar[0].alt === o1.fullName, J(anneMe.body.portallar));
  /* Okul yeniler: eski kod artık çalışmaz, bağlı veliler kalır. */
  const yenile = await iste('/api/school/student-code-reset', 'POST', { studentId: o1.id }, M);
  const eskiKodla = await iste('/api/parent/link', 'POST', { code: o1.code }, (await girisYap('fen@test.com', 'Test1234!')).token);
  kontrol('okul kodu yeniledi; eski kod artık çalışmıyor', yenile.status === 200 && KISI_KODU_DESENI.test(yenile.body.code) &&
    yenile.body.code !== o1.code && eskiKodla.status === 400, J(yenile.body) + ' ' + eskiKodla.status);

  console.log('=== 3) YETİŞKİNİN KİŞİ KODU ===');
  const ogt = 'kodogt' + z;
  await hesapAc({ fullName: 'Kodlu Öğretmen', username: ogt, email: ogt + '@test.com' });
  const OG = (await girisYap(ogt, 'Test1234!')).token;
  const k1 = await iste('/api/kisilikler', 'GET', null, OG);
  const k2 = await iste('/api/kisilikler', 'GET', null, OG);
  kontrol('hesap açılınca kişi kodu hazır; GET /api/kisilikler yan etkisiz (aynı kod)', KISI_KODU_DESENI.test(k1.body.kisiKodu || '') &&
    k1.body.kisiKodu === k2.body.kisiKodu && k1.body.ogretmenKodu === undefined, J(k1.body));
  const eskiGet = await iste('/api/school/ogretmen-bul?kod=' + encodeURIComponent(k1.body.kisiKodu), 'GET', null, M);
  kontrol('öğretmen arama artık GET ile değil (kod adrese yazılmaz)', eskiGet.status === 404, String(eskiGet.status));
  const tersBul = await iste('/api/school/ogretmen-bul', 'POST', { kod: tersHarf(k1.body.kisiKodu) }, M);
  const onHane = await iste('/api/school/ogretmen-bul', 'POST', { kod: 'ABCDE-FGH23' }, M);
  kontrol('harf durumu değişmiş ve eski biçim kod bulunmuyor', tersBul.status === 404 && onHane.status === 404,
    tersBul.status + ' ' + onHane.status);
  const bul = await iste('/api/school/ogretmen-bul', 'POST', { kod: bosluklu(k1.body.kisiKodu) }, M);
  const bulTireli = await iste('/api/school/ogretmen-bul', 'POST', { kod: karisik(k1.body.kisiKodu) }, M);
  kontrol('boşluklu ve tireli yazılan kod bulunuyor, ad maskeli', bul.status === 200 && /^Ko\*+ Öğ\*+$/.test(bul.body.kisi.ad) &&
    bulTireli.status === 200 && bulTireli.body.kisi.ad === bul.body.kisi.ad, J(bul.body) + J(bulTireli.body));
  const yeni = await iste('/api/kisilik/kod', 'POST', {}, OG);
  const eskiyle = await iste('/api/school/ogretmen-bul', 'POST', { kod: k1.body.kisiKodu }, M);
  kontrol('"Yeni kod üret": yeni kod geldi, eskisi çalışmıyor', yeni.status === 200 && KISI_KODU_DESENI.test(yeni.body.kisiKodu || '') &&
    yeni.body.kisiKodu !== k1.body.kisiKodu && eskiyle.status === 404, J(yeni.body) + ' ' + eskiyle.status);
  const ekle = await iste('/api/school/ogretmen-ekle', 'POST', { kod: tireli(yeni.body.kisiKodu), brans: 'Türkçe' }, M);
  const k3 = await iste('/api/kisilikler', 'GET', null, OG);
  const ekle2 = await iste('/api/school/ogretmen-ekle', 'POST', { kod: yeni.body.kisiKodu, brans: 'Türkçe' }, M);
  kontrol('müdür ekleyince kod aynı işlemde yenilendi; aynı kod ikinci kez çalışmıyor', ekle.status === 200 &&
    k3.body.kisiKodu !== yeni.body.kisiKodu && KISI_KODU_DESENI.test(k3.body.kisiKodu) && ekle2.status === 404,
    J(ekle.body) + ' ' + ekle2.status);
  const srv = await okulHesabi(M, 'servisci', { fullName: 'Kodsuz Servisçi', username: 'kodsuz' + z, password: 'Servis2026' });
  const srvG = await girisYap('kodsuz' + z, 'Servis2026');
  const srvKis = await iste('/api/kisilikler', 'GET', null, srvG.token);
  kontrol('servisçinin kodu ve portalı yok', !srvG.user.code && srvG.portallar === undefined && srvKis.status === 403 && !!srv.id,
    J(srvG.user) + ' ' + srvKis.status);
  kontrol('yöneticinin portalı yok', (await iste('/api/me', 'GET', null, A)).body.portallar === undefined);

  console.log('=== 4) ESKİ UÇLAR YOK ===');
  const uclar = [await iste('/api/okul-basvurusu', 'POST', { schoolName: 'X', city: 'Ankara', district: 'Mamak' }, M),
    await iste('/api/admin/pending', 'GET', null, A), await iste('/api/admin/decide', 'POST', { userId: 'x', approve: true }, A)];
  kontrol('okul-basvurusu, admin/pending, admin/decide 404', uclar.every(r => r.status === 404), uclar.map(r => r.status).join(','));

  console.log('=== 5) YÖNETİCİ KİŞİ KODUYLA KİŞİ BULUR ===');
  const md = 'kodmudur' + z;
  await hesapAc({ fullName: 'Kodlu Müdür', username: md, email: md + '@test.com' });
  const MD = (await girisYap(md, 'Test1234!')).token;
  const mdKod = await kisiKodu(MD);
  const kb = await iste('/api/admin/kisi-bul', 'POST', { kod: tireli(mdKod) }, A);
  kontrol('yönetici tam adı, maskeli e-postayı, kullanıcı adını ve rol sayısını görüyor', kb.status === 200 &&
    kb.body.ad === 'Kodlu Müdür' && kb.body.kullaniciAdi === md && kb.body.rolSayisi === 0 &&
    kb.body.eposta === md.slice(0, 2) + '****@test.com', J(kb.body));
  const kbMudur = await iste('/api/admin/kisi-bul', 'POST', { kod: mdKod }, M);
  const kbYetiskin = await iste('/api/admin/kisi-bul', 'POST', { kod: mdKod }, MD);
  kontrol('kişi bulmayı yalnız yönetici yapar (öbürlerine uç yok: 404)', kbMudur.status === 404 && kbYetiskin.status === 404,
    kbMudur.status + ' ' + kbYetiskin.status);
  const kbYok = await iste('/api/admin/kisi-bul', 'POST', { kod: 'Zz9#-zZz9-#zZz-9#zZ' }, A);
  const kbOgr = await iste('/api/admin/kisi-bul', 'POST', { kod: yenile.body.code }, A);
  const kbTers = await iste('/api/admin/kisi-bul', 'POST', { kod: tersHarf(mdKod) }, A);
  kontrol('kimsede olmayan kod, öğrencinin veli kodu ve harfi değişmiş kod: 404 "Bu kodla bir hesap yok"', kbYok.status === 404 &&
    /Bu kodla bir hesap yok/.test(kbYok.body.error || '') && kbOgr.status === 404 && kbTers.status === 404,
    J(kbYok.body) + ' ' + kbOgr.status + ' ' + kbTers.status);
  const kbKisilik = await iste('/api/kisilikler', 'GET', null, MD);
  kontrol('kişi bulmak kodu harcamıyor', kbKisilik.body.kisiKodu === mdKod);

  console.log('=== 6) OKUL AÇ: KİŞİ KODUYLA MÜDÜR ===');
  const govde = { schoolName: 'Kod Okulu ' + z, city: 'Ankara', district: 'Mamak', kisaAd: 'kod-okulu-' + z };
  const acOgr = await iste('/api/admin/okul-ac', 'POST', Object.assign({ mudurKodu: yenile.body.code }, govde), A);
  kontrol('öğrencinin veli koduyla müdür yapılamıyor (404)', acOgr.status === 404 && acOgr.body.alan === 'mudurKodu', J(acOgr.body));
  const depo = testDeposu();
  if (depo) {
    /* Yönetici ve servisçide kod yoktur; olsaydı bile müdür yapılamamalı. */
    const adminId = (await iste('/api/me', 'GET', null, A)).body.user.id;
    const adminKod = kisiKoduUret(), srvKod = kisiKoduUret();
    await depo.kullanicilar.eslesmeKoduYaz(adminId, adminKod);
    await depo.kullanicilar.eslesmeKoduYaz(srv.id, srvKod);
    const acAdmin = await iste('/api/admin/okul-ac', 'POST', Object.assign({ mudurKodu: adminKod }, govde), A);
    const kbAdmin = await iste('/api/admin/kisi-bul', 'POST', { kod: adminKod }, A);
    const acSrv = await iste('/api/admin/okul-ac', 'POST', Object.assign({ mudurKodu: srvKod }, govde), A);
    kontrol('yönetici kendini ve okul hesabını müdür yapamıyor (400)', acAdmin.status === 400 && kbAdmin.status === 400 &&
      acSrv.status === 400 && acAdmin.body.alan === 'mudurKodu', J(acAdmin.body) + J(kbAdmin.body) + J(acSrv.body));
    await depo.kullanicilar.eslesmeKoduYaz(adminId, '');
    await depo.kullanicilar.eslesmeKoduYaz(srv.id, '');
  } else {
    console.log('  ATLANDI  yönetici/servisçi kodu denemesi (test veritabanına bağlanılamadı)');
  }
  const ac = await iste('/api/admin/okul-ac', 'POST', Object.assign({ mudurKodu: bosluklu(mdKod) }, govde), A);
  const mdSonra = await kisiKodu(MD);
  kontrol('okul açıldı; sonuçta okulun adresi ve müdürün adı var; kişinin kodu yenilendi', ac.status === 200 &&
    ac.body.okul.kisaAd === 'kod-okulu-' + z && ac.body.mudur.ad === 'Kodlu Müdür' && mdSonra !== mdKod &&
    KISI_KODU_DESENI.test(mdSonra), J(ac.body));
  const mdBil = await iste('/api/notifications', 'GET', null, MD);
  kontrol('müdüre bildirim: sol üstteki menüden okuluna geçebilir', (mdBil.body.notifications || []).some(n =>
    /Kod Okulu .* okulunun müdürü olarak eklendin\. Sol üstteki menüden okuluna geçebilirsin\./.test(n.text)), J(mdBil.body.notifications));
  const mdG = await girisYap(md, 'Test1234!');
  kontrol('tek portalı olan müdür doğrudan okuluna giriyor; portal listesinde "Müdür · Kod Okulu"', mdG.user.role === 'principal' &&
    mdG.hesapAktif === false && mdG.portallar.length === 1 && mdG.portallar[0].ad === 'Müdür' &&
    mdG.portallar[0].alt === 'Kod Okulu ' + z && mdG.portallar[0].aktif === true, J(mdG.portallar));

  console.log('=== 7) VERİTABANI: BİÇİM KISITI VE AÇILIŞTA KOD DOLDURMA ===');
  if (depo) {
    let kisit = '';
    try { await depo.kullanicilar.guncelle(o1.id, { code: 'ABCDE12345' }); } catch (e) { kisit = e.code || 'hata'; }
    let kisit2 = '';
    try { await depo.kullanicilar.eslesmeKoduYaz(anneMe.body.user.id, '1bcdefghijk#2Aab'); } catch (e) { kisit2 = e.code || 'hata'; }
    let kisit3 = '', kisit4 = '';
    try { await depo.kullanicilar.guncelle(o1.id, { code: 'Ab3#kQx9+mPt7?z' }); } catch (e) { kisit3 = e.code || 'hata'; }
    try { await depo.kullanicilar.eslesmeKoduYaz(anneMe.body.user.id, 'Ab3#kQx9-mPt7?zR'); } catch (e) { kisit4 = e.code || 'hata'; }
    kontrol('eski biçim (10 ve 15 haneli), rakamla başlayan ve tire içeren kod veritabanına yazılamıyor', kisit === '23514' &&
      kisit2 === '23514' && kisit3 === '23514' && kisit4 === '23514', [kisit, kisit2, kisit3, kisit4].join(' '));
    const anneId = anneMe.body.user.id;
    await depo.kullanicilar.guncelle(o1.id, { code: '' });
    await depo.kullanicilar.eslesmeKoduYaz(anneId, '');
    await depo.kullanicilar.eslesmeKoduYaz(srv.id, '');
    const n = await depo.kullanicilar.eksikKodlariDoldur();
    const o1Sonra = await depo.kullanicilar.bul(o1.id), anneSonra = await depo.kullanicilar.bul(anneId);
    const srvSonra = await depo.kullanicilar.bul(srv.id), rolSatiri = await depo.kullanicilar.bul(mdG.user.id);
    kontrol('kodu boş öğrenciye ve yetişkine kod üretildi; servisçi ve rol satırı kodsuz kaldı', n === 2 &&
      KISI_KODU_DESENI.test(o1Sonra.code) && KISI_KODU_DESENI.test(anneSonra.eslesmeKodu) && !srvSonra.eslesmeKodu &&
      !srvSonra.code && !rolSatiri.eslesmeKodu, n + ' ' + o1Sonra.code + ' ' + anneSonra.eslesmeKodu);
    kontrol('ikinci çalıştırmada doldurulacak kod yok', await depo.kullanicilar.eksikKodlariDoldur() === 0);
    /* Eski usul bekleyen öğretmen başvurusu reddedilince kişi rolsüz yetişkin
       hesabına döner; kişi kodu aynı anda yazılır (açılışı beklemez). */
    const red = 'redogt' + z;
    await hesapAc({ fullName: 'Red Öğretmen', username: red, email: red + '@test.com' });
    const RD = await girisYap(red, 'Test1234!');
    await depo.kullanicilar.guncelle(RD.user.id, { role: 'teacher', schoolId: Mg.user.schoolId, status: 'pending', eslesmeKodu: '' });
    const redKarar = await iste('/api/school/teacher-decide', 'POST', { userId: RD.user.id, approve: false }, M);
    const redSonra = await depo.kullanicilar.bul(RD.user.id);
    const redKis = await iste('/api/kisilikler', 'GET', null, RD.token);
    kontrol('reddedilen eski usul öğretmen rolsüz kaldı ve kişi kodu hemen üretildi', redKarar.status === 200 && !redSonra.role &&
      KISI_KODU_DESENI.test(redSonra.eslesmeKodu) && redKis.status === 200 && redKis.body.kisiKodu === redSonra.eslesmeKodu,
      redKarar.status + ' ' + J(redKarar.body) + ' ' + redSonra.eslesmeKodu + ' ' + J(redKis.body));
    await depo.baglanti.kapat();
  } else {
    console.log('  ATLANDI  veritabanı denemeleri (test veritabanına bağlanılamadı)');
  }

  console.log('=== 8) HIZ SINIRLARI (en sonda: sayaçlar dolar) ===');
  /* Kişi bul: yönetici başına dakikada 30. */
  let ilk429 = 0;
  for (let i = 1; i <= 35 && !ilk429; i++) {
    const r = await iste('/api/admin/kisi-bul', 'POST', { kod: mdSonra }, A);
    if (r.status === 429) ilk429 = i;
  }
  kontrol('kişi bulma dakikada 30 ile sınırlı', ilk429 > 20 && ilk429 <= 31, 'ilk429 ' + ilk429);
  /* Yanlış kod: aynı bağlantıdan saatte 30 (bul ve aç birlikte sayılır). */
  let yanlis429 = 0;
  for (let i = 1; i <= 35 && !yanlis429; i++) {
    const r = await iste('/api/admin/okul-ac', 'POST', Object.assign({}, govde, { schoolName: 'Deneme ' + z + ' ' + i,
      kisaAd: 'deneme-' + z + '-' + i, mudurKodu: kisiKoduUret() }), A);
    if (r.status === 429 && /yanlış kod/.test(r.body.error || '')) yanlis429 = i;
  }
  kontrol('yanlış kişi kodu aynı bağlantıdan saatte 30 ile sınırlı', yanlis429 > 0 && yanlis429 <= 31, 'yanlis429 ' + yanlis429);

  console.log();
  console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
  process.exit(kaldi ? 1 : 0);
})().catch(e => { console.log('  TEST HATASI: ' + e.stack); process.exit(1); });
