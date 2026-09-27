/* Giriş, kayıt, iki adımlı kod, şifremi unuttum ekranları.
   Kayıt olan kişi yetişkin hesabı açar; rolü yoktur. Girişten sonra sağ
   üstteki "+ Ekle" ile portal ekler (08c-kisilikler.js): çocuğunu (veli kodu),
   öğretmenliğini (kişi kodunu müdüre verir) ya da okulunu (kişi kodunu sistem
   yöneticisine verir). Öğrenci ve servisçi hesabını okul açar. */

/* Kaydırmalı sekme (Giriş/Hesap Aç, Kullanıcı adı/E-posta): işaret seçili düğmenin altına kayar. */
function kayanGuncelle(kap) {
  if (!kap) return;
  var d = kap.querySelectorAll('button');
  for (var i = 0; i < d.length; i++) {
    var secili = d[i].classList.contains('on');
    d[i].setAttribute('aria-selected', secili ? 'true' : 'false');
    if (secili) kap.style.setProperty('--sira', i);
  }
}

/* Girişte kimlik türü: kullanıcı adı ya da e-posta. Seçim bu tarayıcıda hatırlanır. */
var girisKimlik = 'kadi';
function girisKimlikAyarla(tur, odakla) {
  girisKimlik = tur === 'eposta' ? 'eposta' : 'kadi';
  tercihYaz('giris_turu', girisKimlik);
  var eposta = girisKimlik === 'eposta';
  $('gKimlikKadi').classList.toggle('on', !eposta);
  $('gKimlikEposta').classList.toggle('on', eposta);
  kayanGuncelle($('gKimlikKadi').parentNode);
  var kutu = $('gEmail');
  $('gEmailEtiket').textContent = eposta ? 'E-posta' : 'Kullanıcı adı';
  kutu.type = eposta ? 'email' : 'text';
  kutu.setAttribute('autocomplete', eposta ? 'email' : 'username');
  kutu.setAttribute('inputmode', eposta ? 'email' : 'text');
  kutu.placeholder = eposta ? 'e-posta adresin' : 'kullanıcı adın';
  $('gKimlikIpucu').textContent = eposta ? ''
    : (S.okulAdresi ? 'Okulun verdiği kullanıcı adı; çoğu zaman T.C. kimlik numaran.' : '');
  alanTemizle(kutu.closest('.field'));
  if (odakla) kutu.focus();
}

/* ================= giriş ekranı ================= */

/* Oturum anahtarı nerede tutulacak?
     "Beni hatırla" işaretliyse localStorage (tarayıcı kapansa da kalır),
     değilse sessionStorage (sekme kapanınca silinir).
     "Hiçbir şey kaydetme" seçiliyse hiçbir yere yazılmaz, sadece bellekte kalır.
   Hatırlanan oturum bu sekmenin sessionStorage'ına da yazılır: aynı
   tarayıcıda başka sekmede başka hesapla girilse bile bu sekme yenilenince
   kendi hesabında kalır. */
function tokenSakla(token) {
  var kip = 'oturum';
  var kutu = $('gHatirla');
  var hicbiri = $('gKaydetme');
  if (hicbiri && hicbiri.checked) kip = 'yok';
  else if (kutu && kutu.checked) kip = 'kalici';

  try {
    localStorage.removeItem('ee_token');
    sessionStorage.removeItem('ee_token');
    if (kip === 'kalici') localStorage.setItem('ee_token', token);
    if (kip !== 'yok') sessionStorage.setItem('ee_token', token);
    sessionStorage.setItem('ee_kip', kip);   // bu sekmenin seçimi (rol değişince de o kullanılır)
    localStorage.setItem('ee_hatirla', kip);
  } catch (e) { /* gizli sekmede yazılamaz, sorun değil */ }
}

/* Portal değişince (sol menüdeki Portallarım) yeni anahtar eskisinin yerine yazılır.
   Saklama biçimi bu sekmede girişte seçilendir (ee_kip, sekmeye özel):
   başka sekmedeki girişin "beni hatırla" seçimi bu sekmeyi etkilemez.
   "Hiçbir şey kaydetme" seçildiyse anahtar yine yalnızca bellekte kalır.
   Hatırlanan (localStorage) anahtara yalnızca bu sekmenin eski anahtarıysa dokunulur. */
function tokenYenile(yeni, eski) {
  try {
    var hatirlanan = localStorage.getItem('ee_token');
    var kip = sessionStorage.getItem('ee_kip') ||
      (eski && hatirlanan === eski ? 'kalici' : sessionStorage.getItem('ee_token') ? 'oturum' : 'yok');
    if (kip === 'yok') { sessionStorage.removeItem('ee_token'); return; }
    sessionStorage.setItem('ee_token', yeni);
    if (kip === 'kalici' && (!hatirlanan || hatirlanan === eski)) localStorage.setItem('ee_token', yeni);
    else if (eski && hatirlanan === eski) localStorage.removeItem('ee_token');
  } catch (e) { /* gizli sekme */ }
}

/* Sekmenin kendi oturumu (sessionStorage) tarayıcı genelinde hatırlanan
   oturumdan önce gelir: aynı tarayıcıda farklı sekmelerde farklı hesaplar
   (müdür, öğretmen, veli, öğrenci) açık kalabilsin. */
function tokenOku() {
  try {
    return sessionStorage.getItem('ee_token') || localStorage.getItem('ee_token');
  } catch (e) { return null; }
}

/* Çıkışta bu sekmenin oturumu silinir. Hatırlanan oturum yalnızca bu
   hesabınsa silinir; başka sekmede hatırlanan hesap yerinde kalır. */
function tokenSil(eski) {
  try {
    sessionStorage.removeItem('ee_token');
    sessionStorage.removeItem('ee_kip');
    if (eski && localStorage.getItem('ee_token') === eski) localStorage.removeItem('ee_token');
  } catch (e) { }
}

/* E-posta onayı hesabı açamadıysa (kullanıcı adı ya da T.C. no bu arada
   başkasına geçti): kayıt kartı açılır, ileti ilgili kutunun altında
   (26-baslat.js). authKur doldurur. */
var kayitAlanHatasi = function () { };

var botSoru = { id: '', yukleniyor: false };      // kayıt formu
var girisSoru = { id: '', yukleniyor: false };    // giriş formu

var EPOSTA_DESENI = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Sunucudaki şifre kuralının aynısı (sunucu/ortak.js sifreSorunu). */
/* Sunucudaki sifreSorunu'nun aynısı. guclu: yetişkin hesabı (veli, öğretmen,
   müdür, yönetici) büyük harf, küçük harf, rakam ve özel karakter ister;
   öğrenci ve servisçi harf ve rakam yeter. */
function sifreKurallari(s) {
  return {
    uzun: s.length >= 8,
    harf: /[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(s),
    buyuk: /[A-ZÇĞİÖŞÜ]/.test(s),
    kucuk: /[a-zçğıöşü]/.test(s),
    rakam: /[0-9]/.test(s),
    ozel: /[^A-Za-z0-9çğıöşüÇĞİÖŞÜ\s]/.test(s)
  };
}
function sifreSorunuTR(s, guclu) {
  var k = sifreKurallari(s || '');
  if (!s) return 'Bir şifre belirle.';
  if (!k.uzun) return 'Şifre en az 8 karakter olmalı.';
  if (!guclu) return (!k.harf || !k.rakam) ? 'Şifre en az bir harf ve bir rakam içermeli.' : '';
  var eksik = [];
  if (!k.buyuk) eksik.push('bir büyük harf');
  if (!k.kucuk) eksik.push('bir küçük harf');
  if (!k.rakam) eksik.push('bir rakam');
  if (!k.ozel) eksik.push('bir özel karakter (! ? . * gibi)');
  return eksik.length ? 'Şifrede ' + eksik.join(', ') + ' olmalı.' : '';
}
/* Bu kişinin şifresi güçlü kurala mı tabi? Öğrenci ve servisçi dışında herkes;
   okul rolündeyken şifre yetişkin hesabınındır. */
function gucluSifreli(u) { return !u || (u.role !== 'student' && u.role !== 'servisci'); }

/* Şifre kutusunun altındaki kural listesi (canlı işaretlenir). */
function sifreKuralListesi(id, guclu) {
  var h = '<ul class="sifre-kurallar" id="' + id + '" aria-live="polite"><li data-kural="uzun">En az 8 karakter</li>';
  if (guclu) {
    h += '<li data-kural="buyuk">Büyük harf</li><li data-kural="kucuk">Küçük harf</li>' +
      '<li data-kural="rakam">Rakam</li><li data-kural="ozel">Özel karakter (! ? . *)</li>';
  } else {
    h += '<li data-kural="harf">En az bir harf</li><li data-kural="rakam">En az bir rakam</li>';
  }
  return h + '</ul>';
}
function sifreKurallariniIsaretle(kutuId, listeId) {
  var k = sifreKurallari($(kutuId).value);
  var satirlar = $(listeId).querySelectorAll('li');
  for (var i = 0; i < satirlar.length; i++) satirlar[i].classList.toggle('tamam', !!k[satirlar[i].getAttribute('data-kural')]);
}

/* Sunucudaki kullaniciAdiSorunu'nun aynısı. Büyük/küçük harf fark etmez. */
function kullaniciAdiSorunuTR(ad) {
  var s = String(ad || '').trim().toLowerCase();
  if (!s) return 'Bir kullanıcı adı belirle.';
  if (s.length < 3) return 'Kullanıcı adı en az 3 karakter olmalı.';
  if (s.length > 30) return 'Kullanıcı adı en fazla 30 karakter olabilir.';
  if (/[çğıöşü]/.test(s)) return 'Kullanıcı adında Türkçe harf kullanma (ç yerine c, ş yerine s gibi).';
  if (!/^[a-z]/.test(s)) return 'Kullanıcı adı bir harfle başlamalı.';
  if (!/^[a-z][a-z0-9._]*$/.test(s)) return 'Kullanıcı adında yalnızca harf, rakam, nokta ve alt çizgi olabilir.';
  return '';
}

/* Sunucudaki tcSorunu'nun aynısı: boşsa sorun yok (isteğe bağlı). */
function tcSorunuTR(tc) {
  var s = String(tc || '').replace(/\s/g, '');
  if (!s) return '';
  if (!/^[1-9][0-9]{10}$/.test(s)) return 'T.C. kimlik numarası 11 haneli olmalı ve 0 ile başlamamalı.';
  var d = s.split('').map(Number);
  var onuncu = (((d[0] + d[2] + d[4] + d[6] + d[8]) * 7 - (d[1] + d[3] + d[5] + d[7])) % 10 + 10) % 10;
  var toplam = 0;
  for (var i = 0; i < 10; i++) toplam += d[i];
  if (d[9] !== onuncu || d[10] !== toplam % 10) return 'T.C. kimlik numarası geçersiz, rakamları kontrol et.';
  return '';
}

/* Kişi kodu (öğrencininki veli kodudur): 16 karakter; büyük ve küçük harf,
   rakam ve ! ? # * + = işaretleri. Harf duyarlıdır. Ekranda 4'erli dört grup
   hâlinde, arada tireyle görünür ("Ab3#-kQx9-+mPt-7?zR"); Kopyala da bu
   biçimi verir. Tire kodun karakteri değildir, ayırıcıdır: girişte boşluklar
   ve tireler silinir (tireli, tiresiz, boşluklu yapıştırma olur). Asıl denetim
   sunucudadır (ortak.js). */
var KISI_KODU_UZUNLUK = 16;
/* Ayırıcılar (sunucudaki ortak.js ve Android'deki KisiKodu.java ile aynı küme):
   boşluklar (bölünmez ve dar boşluk da); tire ve kopyalanınca tire kılığına
   giren benzerleri (U+2010..U+2015, U+2212 eksi, U+FE63 küçük tire, U+FF0D tam
   genişlikli tire); görünmez karakterler (U+00AD yumuşak tire, U+200B..U+200D
   sıfır genişlikli karakterler, U+2060, U+FEFF). */
var KISI_KODU_AYIRICI = /[\s\-\u2010-\u2015\u2212\uFE63\uFF0D\u00AD\u200B-\u200D\u2060\uFEFF]+/g;
function kisiKoduSade(kod) { return String(kod || '').replace(KISI_KODU_AYIRICI, ''); }
function kisiKoduBicim(kod) { return kisiKoduSade(kod).replace(/(.{4})(?=.)/g, '$1-'); }
/* Kodun karakterleri ve geçerli bir kod (sunucudaki KISI_KODU_DESENI): ilk
   karakter harf; büyük harf, küçük harf, rakam ve işaretin her birinden en az biri. */
var KISI_KODU_KARAKTER = 'A-HJKMNP-Za-km-np-z2-9!?#*+=';
var KISI_KODU_GECERLI = /^(?=.*[A-HJKMNP-Z])(?=.*[a-km-np-z])(?=.*[2-9])(?=.*[!?#*+=])[A-HJKMNP-Za-km-np-z][A-HJKMNP-Za-km-np-z2-9!?#*+=]{15}$/;
/* Yapıştırılan metindeki tam kod ("Veli kodu: Ab3#-kQx9-+mPt-7?zR" içinden
   yalnız kod). Sırayla aranır: ekrandaki tireli biçim, başka ayırıcılarla
   4'erli gruplar, 16 bitişik karakter. Adayın iki yanında kod karakteri
   olmamalı ve aday geçerli bir kod olmalı. Tam kod yoksa '' döner. */
function kisiKoduAyikla(metin) {
  var sade = kisiKoduSade(metin);
  if (sade.length < KISI_KODU_UZUNLUK) return '';
  if (sade.length === KISI_KODU_UZUNLUK) return KISI_KODU_GECERLI.test(sade) ? sade : '';
  /* Görünmez karakterler atılır, tire benzerleri '-', boşluklar ' ' olur. */
  var m = String(metin).replace(/[\u00AD\u200B-\u200D\u2060\uFEFF]/g, '')
    .replace(/[\-\u2010-\u2015\u2212\uFE63\uFF0D]/g, '-').replace(/\s/g, ' ');
  var g = '([' + KISI_KODU_KARAKTER + ']{4})', bas = '(?:^|[^' + KISI_KODU_KARAKTER + '])', son = '(?![' + KISI_KODU_KARAKTER + '])';
  var desenler = [bas + g + '-' + g + '-' + g + '-' + g + son, bas + g + '[ -]+' + g + '[ -]+' + g + '[ -]+' + g + son,
    bas + '([' + KISI_KODU_KARAKTER + ']{16})' + son];
  for (var i = 0; i < desenler.length; i++) {
    var re = new RegExp(desenler[i], 'g'), b;
    while ((b = re.exec(m))) {
      var aday = b.slice(1).join('');
      if (KISI_KODU_GECERLI.test(aday)) return aday;
      re.lastIndex = b.index + 1;
    }
  }
  return '';
}
/* Kod ve Kopyala düğmesi (her yerde aynı; Kopyala tireli biçimi verir). id
   verilirse kod sonradan kisiKoduYenile ile değiştirilebilir; buyuk: Ekle
   penceresindeki iri gösterim; ekDugme: Kopyala'nın yanına konacak düğme
   (ör. "Yeni kod üret"). */
function kisiKoduKutusu(kod, id, buyuk, ekDugme) {
  var bicimli = kisiKoduBicim(kod);
  return '<div class="kisi-kodu-satir' + (buyuk ? ' buyuk' : '') + '">' +
    '<code class="kisi-kodu"' + (id ? ' id="' + esc(id) + '"' : '') + '>' + esc(bicimli) + '</code>' +
    '<span class="kisi-kodu-dugmeler"><button type="button" class="btn ghost kucuk" data-act="kod-kopyala" data-kod="' + esc(bicimli) + '">' +
    'Kopyala</button>' + (ekDugme || '') + '</span></div>';
}
function kisiKoduYenile(id, kod) {
  var el = $(id);
  if (!el) return;
  el.textContent = kisiKoduBicim(kod);
  var kopya = el.parentNode.querySelector('[data-act="kod-kopyala"]');
  if (kopya) kopya.setAttribute('data-kod', kisiKoduBicim(kod));
}
/* Kod yazılan kutu: telefon klavyesi harfi büyütmesin, düzeltmesin. Tireler
   yazarken kendiliğinden gelir (aşağıda); 16 karakter ve 3 tire: en çok 19. */
function kisiKoduGirdisi(id, etiket) {
  return '<input type="text" id="' + esc(id) + '" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" ' +
    'maxlength="19" placeholder="Ab3#-kQx9-+mPt-7?zR" class="kisi-kodu-girdi"' + (etiket ? ' aria-label="' + esc(etiket) + '"' : '') + '>';
}
/* Kutudaki kod: boşluksuz, tiresiz; 16 karakter değilse hata metni döner. */
function kisiKoduDenetle(deger, ad) {
  var k = kisiKoduSade(deger);
  if (!k) return (ad || 'Kişi kodu') + 'nu yaz.';
  if (k.length !== KISI_KODU_UZUNLUK) return (ad || 'Kişi kodu') + ' 16 karakterdir.';
  return '';
}

/* Kod kutusunda tire kendiliğinden gelir: 4 karakterden sonra, bir sonraki
   karakter yazılınca (sonda tire kalmaz; silerken tire de gider). İmleç
   yazılan ya da silinen yerde kalır: imleçten önceki kod karakterleri
   sayılır, yeni biçimde aynı sayının ardına konur. Yalnız bir tire silindiyse
   (geri tuşu tirenin hemen ardında, Delete hemen önünde) tirenin yanındaki
   karakter de silinir; yoksa tire hemen geri gelir, silme işe yaramazdı.
   Yapıştırmada boşluklar ve tireler atılır; yapıştırma burada yapılır ki
   kutunun 19 karakter sınırı yapıştırılan metnin sonunu kesmesin. Yapıştırılan
   metinde tam bir kod varsa kutuda yalnız o kalır.
   Telefon klavyesi harfleri çoğu zaman birleştirerek yazar (IME composition:
   sözcük altı çizili durur). Birleştirme sürerken kutuya dokunulmaz: değer
   değişirse klavye birleştirdiği yeri şaşırır, harfler çoğalır. Tireler
   birleştirme bitince (compositionend) bir kez gelir. */
function kisiKoduKutusuMu(el) {
  return !!(el && el.tagName === 'INPUT' && el.classList && el.classList.contains('kisi-kodu-girdi'));
}
/* adet kod karakterinin ardı, biçimli metinde kaçıncı yer? */
function kisiKoduImlecYeri(adet) { return adet > 0 ? adet + Math.floor((adet - 1) / 4) : 0; }
function kisiKoduKutuYaz(kutu, sade, once) {
  sade = sade.slice(0, KISI_KODU_UZUNLUK);
  if (once > sade.length) once = sade.length;
  var yeni = kisiKoduBicim(sade);
  if (kutu.value !== yeni) kutu.value = yeni;
  kutu._kisiKoduOnceki = yeni;
  if (document.activeElement === kutu) {
    var yer = kisiKoduImlecYeri(once);
    try { kutu.setSelectionRange(yer, yer); } catch (x) { /* imleç ayarlanamadı */ }
  }
}
/* Kutudaki değeri biçime sokar; tur: "input" olayının inputType'ı. */
function kisiKoduKutuDuzenle(kutu, tur) {
  var deger = kutu.value;
  var imlec = typeof kutu.selectionEnd === 'number' ? kutu.selectionEnd : deger.length;
  var sade = kisiKoduSade(deger);
  var once = kisiKoduSade(deger.slice(0, imlec)).length;
  var onceki = kutu._kisiKoduOnceki;
  var tekSilme = tur === 'deleteContentBackward' || tur === 'deleteContentForward' || !tur;
  if (tekSilme && typeof onceki === 'string' && onceki.length - deger.length === 1 && sade === kisiKoduSade(onceki)) {
    if (tur === 'deleteContentForward') sade = sade.slice(0, once) + sade.slice(once + 1);
    else if (once > 0) { sade = sade.slice(0, once - 1) + sade.slice(once); once--; }
  }
  kisiKoduKutuYaz(kutu, sade, once);
}
/* Kutuyu dinleyen öteki kodlar (hata temizleme, "Bul" sonucunu silme) duysun. */
function kisiKoduDuyur(kutu) {
  var olay = document.createEvent('Event');
  olay.initEvent('input', true, false);
  kutu.dispatchEvent(olay);
}
document.addEventListener('focusin', function (e) {
  if (!kisiKoduKutusuMu(e.target)) return;
  e.target._kisiKoduOnceki = e.target.value;
  e.target._kisiKoduBirlesim = false;
});
/* Yakalama evresinde: kutuyu dinleyen öteki kodlar biçimlenmiş değeri görür.
   Birleştirme sürerken dokunulmaz (yukarıda). */
document.addEventListener('input', function (e) {
  var kutu = e.target;
  if (!kisiKoduKutusuMu(kutu) || e.isComposing || kutu._kisiKoduBirlesim) return;
  kisiKoduKutuDuzenle(kutu, e.inputType || '');
}, true);
document.addEventListener('compositionstart', function (e) {
  if (kisiKoduKutusuMu(e.target)) e.target._kisiKoduBirlesim = true;
}, true);
/* Birleştirme bitti: bir kez biçimlenir. Chrome son "input" olayını bundan
   önce gönderir; Firefox ve Safari sonra gönderir, o zaman değer zaten biçimlidir. */
document.addEventListener('compositionend', function (e) {
  var kutu = e.target;
  if (!kisiKoduKutusuMu(kutu)) return;
  kutu._kisiKoduBirlesim = false;
  var deger = kutu.value;
  kisiKoduKutuDuzenle(kutu, 'insertCompositionText');
  if (kutu.value !== deger) kisiKoduDuyur(kutu);
}, true);
document.addEventListener('paste', function (e) {
  var kutu = e.target;
  if (!kisiKoduKutusuMu(kutu) || typeof kutu.selectionStart !== 'number') return;
  var pano = e.clipboardData || window.clipboardData;
  var metin = pano && pano.getData ? pano.getData('text') : null;
  if (typeof metin !== 'string') return;   // pano okunamadı: tarayıcı yapıştırır, "input" biçimler
  e.preventDefault();
  var kod = kisiKoduAyikla(metin);
  if (kod) kisiKoduKutuYaz(kutu, kod, kod.length);   // tam kod: kutuda yalnız o kalır
  else {
    var deger = kutu.value;
    var basi = kisiKoduSade(deger.slice(0, kutu.selectionStart)), eklenen = kisiKoduSade(metin);
    kisiKoduKutuYaz(kutu, basi + eklenen + kisiKoduSade(deger.slice(kutu.selectionEnd)), basi.length + eklenen.length);
  }
  kisiKoduDuyur(kutu);
}, true);

/* Sunucudaki okul aramasıyla aynı sadeleştirme (sunucu/okullar.js aramaSade):
   Türkçe harfler düzlenir, noktalama boşluğa döner. */
function aramaSadeTR(m) {
  return String(m == null ? '' : m)
    .replace(/[ıİI]/g, 'i')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/* Aranan kelimelerin okul adında geçtiği yeri koyulaştırır. Sunucu hangi
   kelimelerin tuttuğunu söylediyse (vurgu: adın boşlukla ayrılmış
   kelimelerinin sırası) o kelimeler bütünüyle koyulaşır; yanlış yazılıp
   düzeltilen kelime de böylece görünür. */
function aramaVurgula(ad, kelimeler, vurgu) {
  if (Array.isArray(vurgu)) {
    var sira = -1;
    return String(ad).split(/(\s+)/).map(function (parca) {
      if (!parca || /^\s+$/.test(parca)) return esc(parca);
      sira++;
      return vurgu.indexOf(sira) >= 0 ? '<mark>' + esc(parca) + '</mark>' : esc(parca);
    }).join('');
  }
  if (!kelimeler.length) return esc(ad);
  return String(ad).split(/(\s+)/).map(function (parca) {
    if (!parca || /^\s+$/.test(parca)) return esc(parca);
    var sade = aramaSadeTR(parca);
    for (var i = 0; i < kelimeler.length; i++) {
      if (!kelimeler[i] || sade.indexOf(kelimeler[i]) !== 0) continue;
      var bas = (/^[^0-9A-Za-zÀ-ɏ]*/.exec(parca) || [''])[0].length;
      var son = Math.min(parca.length, bas + kelimeler[i].length);
      return esc(parca.slice(0, bas)) + '<mark>' + esc(parca.slice(bas, son)) + '</mark>' + esc(parca.slice(son));
    }
    return esc(parca);
  }).join('');
}

/* Düğme bir iş yaparken: basılamaz, üzerinde ne olduğu yazar. */
function dugmeBekle(b, metin) {
  if (!b) return;
  if (!b.getAttribute('data-yazi')) b.setAttribute('data-yazi', b.textContent);
  b.disabled = true;
  b.classList.add('bekliyor');
  b.textContent = metin;
}
function dugmeBitir(b) {
  if (!b) return;
  b.disabled = false;
  b.classList.remove('bekliyor');
  if (b.getAttribute('data-yazi')) b.textContent = b.getAttribute('data-yazi');
}

function botSoruYukle() {
  if (botSoru.yukleniyor) return Promise.resolve();
  botSoru.yukleniyor = true;
  var etiket = $('kBotSoru');
  if (etiket) etiket.textContent = 'yükleniyor...';
  return api('/challenge').then(function (d) {
    botSoru.id = d.id;
    if (etiket) etiket.textContent = d.soru;
    if ($('kBot')) $('kBot').value = '';
    botSoru.yukleniyor = false;
  })['catch'](function () {
    botSoru.id = '';
    if (etiket) etiket.textContent = 'soru alınamadı';
    botSoru.yukleniyor = false;
  });
}

/* Doğrulama sorusu yalnızca gerektiğinde görünür. */
function girisSoruGoster(goster) {
  var alan = $('gBot') ? $('gBot').closest('.bot-alan') : null;
  if (!alan) return;
  alan.hidden = !goster;
  if (goster && !girisSoru.id) girisSoruYukle();
}

function girisSoruYukle() {
  if (girisSoru.yukleniyor) return Promise.resolve();
  girisSoru.yukleniyor = true;
  var etiket = $('gBotSoru');
  if (etiket) etiket.textContent = 'yükleniyor...';
  return api('/challenge').then(function (d) {
    girisSoru.id = d.id;
    if (etiket) etiket.textContent = d.soru;
    if ($('gBot')) $('gBot').value = '';
    girisSoru.yukleniyor = false;
  })['catch'](function () {
    girisSoru.id = '';
    if (etiket) etiket.textContent = 'soru alınamadı';
    girisSoru.yukleniyor = false;
  });
}

function authKur() {
  var giris = $('formGiris'), kayit = $('formKayit');

  /* Sekme geçişi: eski formu kısaca soldurup yenisini kaydırarak getirir.
     Hareketi azalt ayarı açıksa animasyon atlanır. */
  var gecisSuruyor = false;
  function sekmeGec(gosterilecek, gizlenecek, sekmeAc, sekmeKapa, sonra) {
    if (gecisSuruyor) return;
    var azalt = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sekmeAc.classList.add('on');
    sekmeKapa.classList.remove('on');
    kayanGuncelle(sekmeAc.parentNode);
    sekmeAdresiYaz(sekmeAc.id === 'tabKayit' ? 'kayit' : 'giris');
    $('okulSecAlan').hidden = sekmeAc.id === 'tabKayit' || !!S.okulAdresi;
    $('authMesaj').innerHTML = '';

    if (azalt) {
      gizlenecek.style.display = 'none';
      gosterilecek.style.display = '';
      if (sonra) sonra();
      return;
    }

    gecisSuruyor = true;
    gizlenecek.classList.add('form-cikis');
    setTimeout(function () {
      gizlenecek.classList.remove('form-cikis');
      gizlenecek.style.display = 'none';
      gosterilecek.style.display = '';
      gosterilecek.classList.add('form-giris');
      setTimeout(function () {
        gosterilecek.classList.remove('form-giris');
        gecisSuruyor = false;
      }, 240);
      if (sonra) sonra();
    }, 140);
  }

  function girisSekmesi(sonra) { sekmeGec(giris, kayit, $('tabGiris'), $('tabKayit'), sonra); }
  function kayitSekmesi(sonra) {
    sekmeGec(kayit, giris, $('tabKayit'), $('tabGiris'), function () {
      if (!botSoru.id) botSoruYukle();
      if (sonra) sonra();
    });
  }
  $('tabGiris').onclick = function () { girisSekmesi(); };
  $('tabKayit').onclick = function () { kayitSekmesi(); };
  $('gKimlikKadi').onclick = function () { girisKimlikAyarla('kadi', true); };
  $('gKimlikEposta').onclick = function () { girisKimlikAyarla('eposta', true); };
  girisKimlikAyarla(tercihOku('giris_turu', 'kadi'), false);
  kayanGuncelle($('tabGiris').parentNode);
  /* Kullanıcı adı sekmesinde @ yazılırsa e-posta sekmesine geçilir. */
  $('gEmail').addEventListener('input', function () {
    if (girisKimlik === 'kadi' && this.value.indexOf('@') >= 0) {
      var deger = this.value;
      girisKimlikAyarla('eposta', true);
      this.value = deger;
    }
  });
  if ($('kBotYenile')) $('kBotYenile').onclick = function () { botSoruYukle(); };
  if ($('gBotYenile')) $('gBotYenile').onclick = function () { girisSoruYukle(); };
  /* Soru alanı başta gizli; sunucu "gerekli" derse açılır. */
  girisSoruGoster(false);

  /* Hata yazısının içindeki kısa yollar */
  EYLEMLER['giristen-kayda'] = function () {
    var yazilan = $('gEmail').value.trim();
    kayitSekmesi(function () {
      if (yazilan.indexOf('@') >= 0) { if (!$('kEmail').value) $('kEmail').value = yazilan; }
      else if (yazilan && !$('kKullaniciAdi').value) $('kKullaniciAdi').value = yazilan.toLowerCase();
      $('kAd').focus();
    });
  };
  EYLEMLER['kayittan-girise'] = function () {
    var eposta = $('kEmail').value.trim();
    girisSekmesi(function () {
      girisKimlikAyarla('eposta', false);
      $('gEmail').value = eposta;
      $('gSifre').focus();
    });
  };
  EYLEMLER['hata-sifremi-unuttum'] = function () { sifreEkraniAc(); };
  EYLEMLER['giristen-okul-sec'] = function () {
    siteGit('/login').then(function () { $('vOkulAra').focus(); });
  };

  api('/meta').then(function (m) { S.meta = m; })['catch'](function () { });

  /* Şifre yazılırken kurallar tek tek yeşile döner. */
  function sifreKurallariniGoster() {
    var k = sifreKurallari($('kSifre').value);
    var satirlar = $('kSifreKural').querySelectorAll('li');
    for (var i = 0; i < satirlar.length; i++) {
      satirlar[i].classList.toggle('tamam', !!k[satirlar[i].getAttribute('data-kural')]);
    }
  }
  $('kSifre').addEventListener('input', sifreKurallariniGoster);

  /* Kullanıcı adı yazılırken büyük harf küçüğe, boşluk noktaya döner
     (giriş zaten büyük/küçük harf ayırmıyor; kişi ne göreceğini bilsin). */
  $('kKullaniciAdi').addEventListener('input', function () {
    var once = this.value;
    var yeni = once.replace(/İ/g, 'i').toLowerCase().replace(/\s/g, '.');
    if (yeni !== once) {
      var yer = this.selectionStart;
      this.value = yeni;
      try { this.setSelectionRange(yer, yer); } catch (e) { }
    }
  });
  /* T.C. kimlik no: yalnızca rakam, en fazla 11. */
  $('kTc').addEventListener('input', function () {
    var temiz = this.value.replace(/[^0-9]/g, '').slice(0, 11);
    if (temiz !== this.value) this.value = temiz;
  });

  /* "Beni hatırla" ile "Bilgilerimi bu cihaza kaydetme" birbirini dışlar:
     ikisi birden işaretliyken "kaydetme" sessizce kazanıyordu. */
  if ($('gHatirla') && $('gKaydetme')) {
    $('gHatirla').addEventListener('change', function () { if (this.checked) $('gKaydetme').checked = false; });
    $('gKaydetme').addEventListener('change', function () { if (this.checked) $('gHatirla').checked = false; });
  }

  /* ---- şifremi unuttum ---- */
  var sifreSoru = { id: '' };

  function sifreSoruYukle() {
    var etiket = $('sBotSoru');
    if (etiket) etiket.textContent = 'yükleniyor...';
    return api('/challenge').then(function (d) {
      sifreSoru.id = d.id;
      if (etiket) etiket.textContent = d.soru;
      if ($('sBot')) $('sBot').value = '';
    })['catch'](function () {
      sifreSoru.id = '';
      if (etiket) etiket.textContent = 'soru alınamadı';
    });
  }

  /* Giriş ekranındaki panelleri tek yerden yönetiyoruz; ikisi aynı anda
     açık kalmasın diye hepsini kapatıp isteneni açıyoruz. */
  function authPanel(hangi) {
    var paneller = ['formGiris', 'formKayit', 'kodEkran', 'sifreEkran', 'yeniSifreEkran'];
    for (var i = 0; i < paneller.length; i++) {
      var el = $(paneller[i]);
      if (el) el.style.display = (paneller[i] === hangi) ? '' : 'none';
    }
    var sekme = document.querySelector('.tabs');
    if (sekme) sekme.style.display = (hangi === 'formGiris' || hangi === 'formKayit') ? '' : 'none';
  }

  function sifreEkraniAc() {
    authPanel('sifreEkran');
    $('authMesaj').innerHTML = '';
    formHatalariniSil($('formSifreUnuttum'));
    var yazilan = $('gEmail').value.trim();
    $('sEmail').value = yazilan.indexOf('@') >= 0 ? yazilan : '';
    sifreSoruYukle();
    $('sEmail').focus();
  }

  function yeniSifreEkraniAc(anahtar) {
    yeniSifreAnahtar = anahtar;
    authPanel('yeniSifreEkran');
    $('authMesaj').innerHTML = '';
    formHatalariniSil($('formYeniSifre'));
    $('ySifre1').value = '';
    $('ySifre2').value = '';
    $('ySifre1').focus();
  }

  function girisEkraninaDon() {
    yeniSifreAnahtar = '';
    /* Sıfırlama anahtarı adres çubuğunda kalmasın. */
    if (/yeni-sifre/.test(location.hash)) {
      history.replaceState(null, '', location.pathname + location.search);
    }
    authPanel('formGiris');
    $('tabGiris').classList.add('on');
    $('tabKayit').classList.remove('on');
    $('gSifre').value = '';
  }

  $('btnSifremiUnuttum').onclick = sifreEkraniAc;
  /* Açılış kodu authKur'un dışında; ekranı oradan da açabilmek için köprü. */
  yeniSifreEkraniAcDisaridan = yeniSifreEkraniAc;
  $('sVazgec').onclick = function () { $('authMesaj').innerHTML = ''; girisEkraninaDon(); };
  $('yVazgec').onclick = function () { $('authMesaj').innerHTML = ''; girisEkraninaDon(); };
  $('sBotYenile').onclick = function () { sifreSoruYukle(); };

  /* Şifremi unuttum: yalnızca e-posta. Bağlantı, o adrese kayıtlı bir hesap
     varsa gider; cevap her durumda aynıdır (hesap var mı sızmasın). */
  $('formSifreUnuttum').onsubmit = function (e) {
    e.preventDefault();
    var form = this;
    formHatalariniSil(form);
    var eposta = $('sEmail').value.trim();
    if (!eposta) alanHatasi('sEmail', 'Hesabının e-posta adresini yaz.');
    else if (eposta.indexOf('@') < 0) {
      alanHatasi('sEmail', 'Buraya kullanıcı adı değil e-posta adresi yazılır. E-postası olmayan hesaplarda şifreyi okul yönetimi yeniler.');
    } else if (!EPOSTA_DESENI.test(eposta)) alanHatasi('sEmail', 'E-posta adresi eksik ya da hatalı görünüyor.');
    if (!$('sBot').value.trim()) alanHatasi('sBot', 'Sorunun cevabını yaz.');
    if (form.querySelector('.hatali')) { ilkHatayaGit(form); return; }

    var b = form.querySelector('button[type=submit]');
    dugmeBekle(b, 'Gönderiliyor...');
    api('/sifre-unuttum', 'POST', {
      email: eposta,
      challengeId: sifreSoru.id,
      challengeAnswer: $('sBot').value
    })
      .then(function (d) {
        dugmeBitir(b);
        girisEkraninaDon();
        mesajGoster('authMesaj', 'iyi', d.message);
      })['catch'](function (err) {
        dugmeBitir(b);
        var v = err.veri || {};
        if (v.alan === 'email') alanHatasi('sEmail', err.message);
        else if (/doğrulama/i.test(err.message)) alanHatasi('sBot', err.message);
        else mesajGoster('authMesaj', 'hata', err.message);
        sifreSoruYukle();
      });
  };

  $('formYeniSifre').onsubmit = function (e) {
    e.preventDefault();
    var form = this;
    formHatalariniSil(form);
    var s1 = $('ySifre1').value, s2 = $('ySifre2').value;
    var sorun = sifreSorunuTR(s1);
    if (sorun) alanHatasi('ySifre1', sorun);
    else if (s1 !== s2) alanHatasi('ySifre2', 'İki şifre birbirini tutmuyor.');
    if (form.querySelector('.hatali')) { ilkHatayaGit(form); return; }

    var b = form.querySelector('button[type=submit]');
    dugmeBekle(b, 'Kaydediliyor...');
    api('/sifre-yenile', 'POST', {
      token: yeniSifreAnahtar,
      password: s1
    })
      .then(function (d) {
        dugmeBitir(b);
        girisEkraninaDon();
        mesajGoster('authMesaj', 'iyi', d.message);
      })['catch'](function (err) {
        dugmeBitir(b);
        mesajGoster('authMesaj', 'hata', err.message);
      });
  };

  /* ---- iki adımlı giriş ---- */
  var kodDurum = { id: '', sayac: null };

  function kodEkraniAc(d) {
    authPanel('kodEkran');
    $('authMesaj').innerHTML = '';
    formHatalariniSil($('formKod'));
    kodDurum.id = d.challengeId;
    $('kodAciklama').textContent = d.mesaj || 'Giriş kodunu gir.';
    $('kodGiris').value = '';
    $('kodGiris').focus();
    tekrarSayaciBaslat(60);
  }

  function kodEkraniKapat() {
    if (kodDurum.sayac) { clearInterval(kodDurum.sayac); kodDurum.sayac = null; }
    kodDurum.id = '';
    authPanel('formGiris');
    $('gSifre').value = '';
  }

  /* "Tekrar gönder" 60 saniye kilitli kalır; sunucu da aynı süreyi uygular. */
  function tekrarSayaciBaslat(saniye) {
    var btn = $('kodTekrar');
    var kalan = saniye;
    if (kodDurum.sayac) clearInterval(kodDurum.sayac);
    btn.disabled = true;
    btn.textContent = 'Tekrar gönder (' + kalan + ')';
    kodDurum.sayac = setInterval(function () {
      kalan--;
      if (kalan <= 0) {
        clearInterval(kodDurum.sayac);
        kodDurum.sayac = null;
        btn.disabled = false;
        btn.textContent = 'Kodu tekrar gönder';
        return;
      }
      btn.textContent = 'Tekrar gönder (' + kalan + ')';
    }, 1000);
  }

  function oturumuAc(d) {
    S.token = d.token;
    tokenSakla(d.token);
    S.user = d.user; S.children = d.children || []; S.kapali = d.kapaliOzellikler || [];
    portalDurumuAl(d);
    if (d.user.status === 'pending') {
      /* Sunucu bekleyen hesabı ilk adımda durduruyor; bu yalnızca yedek. */
      S.token = null;
      tokenSil(d.token);
      kodEkraniKapat();
      mesajGoster('authMesaj', 'bilgi', 'Hesabın henüz onaylanmadı. Onaylanınca giriş yapabilirsin.');
      return;
    }
    kodEkraniKapat();
    girisSonrasi(d);
  }

  giris.onsubmit = function (e) {
    e.preventDefault();
    formHatalariniSil(giris);
    $('authMesaj').innerHTML = '';
    var kimlik = $('gEmail').value.trim();
    var sifre = $('gSifre').value;
    var soruAcik = $('gBot') && !$('gBot').closest('.bot-alan').hidden;

    if (!kimlik) alanHatasi('gEmail', girisKimlik === 'eposta' ? 'E-posta adresini yaz.' : 'Kullanıcı adını yaz.');
    else if (girisKimlik === 'eposta' && !EPOSTA_DESENI.test(kimlik)) {
      alanHatasi('gEmail', 'E-posta adresi eksik ya da hatalı görünüyor.');
    }
    if (!sifre) alanHatasi('gSifre', 'Şifreni yaz.');
    if (soruAcik && !$('gBot').value.trim()) alanHatasi('gBot', 'Sorunun cevabını yaz.');
    if (giris.querySelector('.hatali')) { ilkHatayaGit(giris); return; }

    var b = giris.querySelector('button[type=submit]');
    dugmeBekle(b, 'Giriş yapılıyor...');
    api('/login', 'POST', {
      kimlik: kimlik,
      password: sifre,
      okul: S.okulAdresi ? S.okulAdresi.kisaAd : undefined,
      challengeId: girisSoru.id,
      challengeAnswer: $('gBot') ? $('gBot').value : ''
    })
      .then(function (d) {
        dugmeBitir(b);
        girisSoru.id = '';
        girisSoruGoster(false);
        if (d.twoFactor) { kodEkraniAc(d); return; }
        oturumuAc(d);   /* e-postası olmayan hesap: kod adımı yok */
      })['catch'](function (err) {
        dugmeBitir(b);
        var v = err.veri || {};
        if (v.okulSec) {
          /* Aynı kullanıcı adı birden çok okulda: önce okul seçilir. */
          alanHatasi('gEmail', err.message, '<button type="button" class="baglanti" data-act="giristen-okul-sec">Okulunu bul</button>');
        } else if (v.alan === 'kimlik' || v.alan === 'email') {
          /* Okul sayfasında "kayıt ol" önerilmez: öğrenci hesabını okul açar. */
          alanHatasi('gEmail', err.message, v.hesapYok && !S.okulAdresi
            ? '<button type="button" class="baglanti" data-act="giristen-kayda">Kayıt ol</button>' : '');
        } else if (v.alan === 'sifre') {
          alanHatasi('gSifre', err.message,
            '<button type="button" class="baglanti" data-act="hata-sifremi-unuttum">Şifremi unuttum</button>');
        } else if (v.alan === 'bot') {
          alanHatasi('gBot', err.message);
        } else {
          mesajGoster('authMesaj', v.bekliyor ? 'bilgi' : 'hata', err.message);
        }
        /* Sunucu soru istediyse alanı aç ve taze soru getir. */
        if (v.soruGerekli) {
          girisSoruGoster(true);
          girisSoru.id = '';
          girisSoruYukle();
        }
        if (v.alan === 'sifre') { $('gSifre').focus(); $('gSifre').select(); }
        else ilkHatayaGit(giris);
      });
  };

  $('formKod').onsubmit = function (e) {
    e.preventDefault();
    var b = $('formKod').querySelector('button[type=submit]');
    var kod = $('kodGiris').value.trim();
    formHatalariniSil($('formKod'));
    if (!/^[0-9]{6}$/.test(kod)) {
      alanHatasi('kodGiris', 'Kod 6 rakamdan oluşmalı.');
      return;
    }
    dugmeBekle(b, 'Doğrulanıyor...');
    api('/login/dogrula', 'POST', { challengeId: kodDurum.id, code: kod })
      .then(function (d) { dugmeBitir(b); oturumuAc(d); })
      ['catch'](function (err) {
        dugmeBitir(b);
        $('kodGiris').value = '';
        /* Oturum düştüyse baştan giriş gerekiyor. */
        if (/bulunamadı|baştan|süresi doldu/i.test(err.message)) {
          kodEkraniKapat();
          mesajGoster('authMesaj', 'hata', err.message);
          return;
        }
        alanHatasi('kodGiris', err.message);
        $('kodGiris').focus();
      });
  };

  $('kodTekrar').onclick = function () {
    var btn = this;
    btn.disabled = true;
    api('/login/tekrar', 'POST', { challengeId: kodDurum.id })
      .then(function (d) {
        kodDurum.id = d.challengeId;
        $('kodAciklama').textContent = d.mesaj || 'Yeni kod gönderildi.';
        mesajGoster('authMesaj', 'iyi', 'Yeni kod gönderildi.');
        tekrarSayaciBaslat(60);
      })['catch'](function (err) {
        mesajGoster('authMesaj', 'hata', err.message);
        btn.disabled = false;
      });
  };

  $('kodVazgec').onclick = function () {
    kodEkraniKapat();
    $('authMesaj').innerHTML = '';
  };

  /* Sadece rakam kabul et, 6 hane dolunca kendiliğinden doğrula. */
  $('kodGiris').oninput = function () {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
    if (this.value.length === 6) $('formKod').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  };

  /* ---- kayıt ---- */
  /* Sunucu hatası hangi alanı söylüyorsa o kutu. */
  var KAYIT_ALANLARI = {
    bot: 'kBot', ad: 'kAd', kullaniciAdi: 'kKullaniciAdi', email: 'kEmail', sifre: 'kSifre',
    kvkk: 'kKvkk', telefon: 'kTelefon', tc: 'kTc'
  };

  kayitAlanHatasi = function (alan, mesaj) {
    kayitSekmesi(function () {
      var hedef = KAYIT_ALANLARI[alan];
      if (hedef && $(hedef)) { alanHatasi(hedef, mesaj); $(hedef).focus(); }
      else mesajGoster('authMesaj', 'hata', mesaj);
    });
  };

  function kayitGovdesi() {
    return {
      fullName: ($('kAd').value.trim() + ' ' + $('kSoyad').value.trim()).trim(),
      username: $('kKullaniciAdi').value.trim().toLowerCase(),
      email: $('kEmail').value.trim(),
      password: $('kSifre').value,
      phone: telefonOku($('kTelefon')),
      tc: $('kTc').value.trim(),
      address: $('kAdres').value,
      kvkkOnay: $('kKvkk').checked,
      challengeId: botSoru.id,
      challengeAnswer: $('kBot').value
    };
  }

  /* Sunucuya gitmeden önce aynı kurallarla denetle: hatalar hemen, hepsi
     birden ve ilgili kutunun altında görünür. */
  function kayitDenetle(body) {
    if (!$('kAd').value.trim()) alanHatasi('kAd', 'Adını yaz.');
    if (!$('kSoyad').value.trim()) alanHatasi('kSoyad', 'Soyadını yaz.');
    var kaSorun = kullaniciAdiSorunuTR(body.username);
    if (kaSorun) alanHatasi('kKullaniciAdi', kaSorun);
    if (!body.email) alanHatasi('kEmail', 'E-posta adresini yaz.');
    else if (!EPOSTA_DESENI.test(body.email)) alanHatasi('kEmail', 'E-posta adresi eksik ya da hatalı görünüyor.');
    var sifreSorun = sifreSorunuTR(body.password, true);
    if (sifreSorun) alanHatasi('kSifre', sifreSorun);
    var telSorun = telefonSorunuTR(body.phone);
    if (telSorun) alanHatasi('kTelefon', telSorun);
    var tcSorun = tcSorunuTR(body.tc);
    if (tcSorun) alanHatasi('kTc', tcSorun);
    if (!String(body.challengeAnswer).trim()) alanHatasi('kBot', 'Sorunun cevabını yaz.');
    if (!body.kvkkOnay) alanHatasi('kKvkk', 'Devam etmek için aydınlatma metnini onaylaman gerekiyor.');
  }

  function kayitBasarili(d, kullaniciAdi) {
    $('authMesaj').innerHTML = '';
    kayit.reset();
    sifreKurallariniGoster();
    botSoru.id = ''; botSoruYukle();
    /* Hesap e-postadaki bağlantıya tıklanınca açılır: kişi burada bekler. */
    if (d.onayGerekli) {
      $('authMesaj').innerHTML = '<div class="msg iyi onay-bekliyor"><b>E-postanı kontrol et.</b> ' + esc(d.message) + '</div>';
      $('authMesaj').scrollIntoView({ block: 'center' });
      return;
    }
    girisSekmesi(function () {
      $('authMesaj').innerHTML = '<div class="msg iyi">' + esc(d.message) + '</div>';
      girisKimlikAyarla('kadi', false);
      $('gEmail').value = kullaniciAdi;
      $('gSifre').focus();
    });
  }

  kayit.onsubmit = function (e) {
    e.preventDefault();
    formHatalariniSil(kayit);
    $('authMesaj').innerHTML = '';
    var body = kayitGovdesi();
    kayitDenetle(body);
    if (kayit.querySelector('.hatali')) { ilkHatayaGit(kayit); return; }

    var b = kayit.querySelector('button[type=submit]');
    dugmeBekle(b, 'Kaydediliyor...');
    api('/register', 'POST', body).then(function (d) {
      dugmeBitir(b);
      kayitBasarili(d, body.username);
    })['catch'](function (err) {
      dugmeBitir(b);
      var v = err.veri || {};
      var hedef = KAYIT_ALANLARI[v.alan];
      if (hedef && $(hedef)) {
        alanHatasi(hedef, err.message, v.alan === 'email' && /kayıtlı/.test(err.message)
          ? '<button type="button" class="baglanti" data-act="kayittan-girise">Giriş yap</button>' : '');
        ilkHatayaGit(kayit);
      } else {
        mesajGoster('authMesaj', 'hata', err.message);
      }
      /* Soru yalnızca yanlış cevaplandıysa, süresi dolduysa ya da sunucu
         harcadıysa (T.C. çakışması) yenilenir; başka alan hatalıysa aynı soru geçerli kalır. */
      if (v.alan === 'bot' || v.yeniSoru) botSoruYukle();
    });
  };
}
