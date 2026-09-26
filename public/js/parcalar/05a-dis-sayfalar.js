/* Giriş yapmamış ziyaretçinin gördüğü sayfalar ve aralarındaki geçiş.

     /                 açılış: Eğitim Evi nedir, neler var, rakamlar
     /hakkinda         proje, gizlilik, yapımcılar, iletişim
     /sss              sık sorulan sorular
     /login            giriş kartı (+ "okulunu seç": öğrenci ve servisçi için)
     /signup           kayıt kartı (yetişkin hesabı)
     /<okulun-adi>     okulun giriş sayfası: kartın üstünde okulun adı,
                       giriş o okulun içinde aranır (aynı kullanıcı adı
                       başka okulda da olabilir)

   Hepsi aynı index.html'dir; sunucu bilinmeyen yolda da onu döndürür.
   Üst şerit ve alt bilgi bütün dış sayfalarda aynıdır. Sayfalar arası
   geçiş sayfayı yeniden yüklemeden olur (history.pushState).
   Son girilen okul bu tarayıcıda hatırlanır (yalnızca adı ve adresi). */

var OKUL_ADRESI_DESENI = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

/* Sitenin kendi sayfaları; bunlar okul adresi sayılmaz. */
var SITE_SAYFALARI = { '': 'ana', 'hakkinda': 'hakkinda', 'sss': 'sss', 'login': 'giris', 'signup': 'kayit' };

function adrestekiYol() {
  return String(location.pathname || '/').replace(/\/+$/, '').replace(/^\//, '').toLowerCase();
}

/* Adres çubuğundaki okul: "/doruk" ya da "/doruk/" -> "doruk". */
function adrestenOkul() {
  var yol = adrestekiYol();
  if (!yol || yol.indexOf('/') >= 0 || yol === 'index.html' || SITE_SAYFALARI.hasOwnProperty(yol)) return '';
  try { yol = decodeURIComponent(yol); } catch (e) { return ''; }
  return OKUL_ADRESI_DESENI.test(yol) ? yol : '';
}

/* Şu an hangi dış sayfadayız: 'ana' | 'hakkinda' | 'sss' | 'giris' | 'kayit' | 'okul'. */
function disSayfa() {
  var yol = adrestekiYol();
  if (SITE_SAYFALARI.hasOwnProperty(yol)) return SITE_SAYFALARI[yol];
  return adrestenOkul() ? 'okul' : 'ana';
}

function sonOkulOku() {
  try {
    var o = JSON.parse(localStorage.getItem('ee_son_okul') || 'null');
    return o && typeof o.kisaAd === 'string' && OKUL_ADRESI_DESENI.test(o.kisaAd) && typeof o.ad === 'string' ? o : null;
  } catch (e) { return null; }
}
function sonOkulYaz(o) {
  try {
    localStorage.setItem('ee_son_okul', JSON.stringify({ kisaAd: o.kisaAd, ad: String(o.ad).slice(0, 140),
      il: String(o.il || '').slice(0, 60), ilce: String(o.ilce || '').slice(0, 60) }));
  } catch (e) { /* gizli sekme */ }
}

/* ---------------- sayfa gösterme ---------------- */

/* Dış sayfalardan birini açar. S.genelGiris: adres ne olursa olsun giriş
   kartını göster (şifre sıfırlama bağlantısıyla gelindiğinde). */
function girisEkraniGoster() {
  var sayfa = S.genelGiris ? 'giris' : disSayfa();
  var kartMi = sayfa === 'giris' || sayfa === 'kayit' || sayfa === 'okul';
  $('app').classList.remove('on');
  $('dis').style.display = '';
  $('vitrin').style.display = kartMi ? 'none' : '';
  $('authWrap').style.display = kartMi ? '' : 'none';
  $('vAna').hidden = sayfa !== 'ana';
  $('vHakkinda').hidden = sayfa !== 'hakkinda';
  $('vSss').hidden = sayfa !== 'sss';
  siteMenusuIsaretle(sayfa);
  siteBilgisiYukle();
  if (sayfa === 'ana') yorumlariYukle();

  if (!kartMi) {
    document.title = { hakkinda: 'Hakkında — Eğitim Evi', sss: 'Sık sorulan sorular — Eğitim Evi' }[sayfa] || 'Eğitim Evi';
    return;
  }
  okulBasligiCiz();
  /* "Okulunu seç" yalnızca okulsuz girişte: okul sayfasında zaten okul belli. */
  $('okulSecAlan').hidden = sayfa !== 'giris';
  if (sayfa === 'giris') sonOkulCiz();
  var sekme = sayfa === 'kayit' ? $('tabKayit') : $('tabGiris');
  if (!sekme.classList.contains('on')) sekme.click();
}

/* Üst şeritte bulunulan sayfanın bağlantısı işaretlenir. */
function siteMenusuIsaretle(sayfa) {
  var hedef = { ana: '/', hakkinda: '/hakkinda', sss: '/sss', giris: '/login', kayit: '/signup' }[sayfa] || '';
  var baglantilar = document.querySelectorAll('.site-ust [data-site]');
  for (var i = 0; i < baglantilar.length; i++) {
    var b = baglantilar[i];
    if (b.getAttribute('data-site') === hedef && hedef !== '/') b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  }
}

/* Dış sayfalar arası geçiş: sayfa yeniden yüklenmez, geri tuşu çalışır. */
function siteGit(yol) {
  if (location.pathname !== yol) {
    try { history.pushState(null, '', yol); } catch (e) { location.assign(yol); return; }
  }
  S.genelGiris = false;
  window.scrollTo(0, 0);
  return okulAdresiniYenile().then(girisEkraniGoster);
}

/* Giriş/kayıt sekmesi değişince adres de değişsin (/login <-> /signup).
   Okul sayfasında adres okulun adresi olarak kalır. */
function sekmeAdresiYaz(tur) {
  if (S.user || adrestenOkul()) return;
  var yol = tur === 'kayit' ? '/signup' : '/login';
  if (location.pathname === yol) return;
  try { history.replaceState(null, '', yol + location.hash); } catch (e) { }
}

function okulBasligiCiz() {
  var kap = $('authOkul');
  var o = S.okulAdresi;
  okulSayfasiniCiz();
  if (!o) {
    kap.style.display = 'none';
    kap.innerHTML = '';
    girisKimlikAyarla(girisKimlik, false);
    $('btnOkulDegis').hidden = true;
    return;
  }
  /* Okulun kendi sayfası varsa adı orada büyük yazıyor; kartta tekrarlanmaz. */
  kap.style.display = o.sayfa ? 'none' : '';
  kap.innerHTML = '<div class="auth-okul-ad">' + ik('okul') + '<span>' + esc(o.ad) + '</span></div>' +
    '<div class="auth-okul-yer">' + esc([o.ilce, o.il].filter(Boolean).join(', ')) + '</div>';
  girisKimlikAyarla(girisKimlik, false);
  $('btnOkulDegis').hidden = false;
  document.title = o.ad + ' — Eğitim Evi';
}

function sonOkulCiz() {
  var o = sonOkulOku();
  $('vSonOkul').innerHTML = o
    ? '<a class="vitrin-son-okul" href="/' + esc(o.kisaAd) + '">' + ik('okul') +
      '<span><span class="alt">Son girdiğin okul</span><b>' + esc(o.ad) + '</b></span>' +
      '<span class="vitrin-son-git">Seç</span></a>'
    : '';
}

/* ---------------- rakamlar ve iletişim (/api/site) ---------------- */
var siteBilgisi = { yuklendi: false, yukleniyor: false };

function siteBilgisiYukle() {
  if (siteBilgisi.yuklendi || siteBilgisi.yukleniyor) return;
  siteBilgisi.yukleniyor = true;
  api('/site').then(function (d) {
    siteBilgisi.yuklendi = true;
    siteBilgisi.yukleniyor = false;
    sayilariCiz(d.sayilar);
    iletisimCiz(d.iletisim);
    yapimcilariCiz(d.yapimcilar || []);
  })['catch'](function () {
    siteBilgisi.yukleniyor = false;
    var bantlar = document.querySelectorAll('.v-sayilar');
    for (var i = 0; i < bantlar.length; i++) bantlar[i].hidden = true;
  });
}

function sayiYaz(n) { return Number(n || 0).toLocaleString('tr-TR'); }

function sayilariCiz(s) {
  var alanlar = document.querySelectorAll('[data-sayi]');
  for (var i = 0; i < alanlar.length; i++) {
    alanlar[i].textContent = sayiYaz(s[alanlar[i].getAttribute('data-sayi')]);
  }
}

/* E-posta sayfanın kaynağında düz yazı olarak durmaz: toplayıcı botlar
   HTML'den adres süpürür. Adres burada, sunucudan gelen veriyle kurulur. */
/* İletişim bilgileri (data/config.yml): dış sayfaların alt bilgisi, Hakkında
   ve uygulamanın içindeki her sayfanın alt bilgisi ([data-iletisim]).
   E-posta adresi HTML'e yazılmaz, yazı olarak sonradan konur (adres
   toplayan botlar kaynakta bulamasın). */
function iletisimCiz(il) {
  siteBilgisi.iletisim = il;
  siteBilgisi.eposta = il.eposta;
  iletisimleriDoldur();
  $('hIletisimBolum').hidden = !(il.eposta || il.telefon);
}

/* Yapımcılar: üst şeritteki açılır liste ve Hakkında'daki liste. Liste
   gelmezse sayfadaki hazır satır (proje sahibi) kalır. */
function yapimcilariCiz(liste) {
  if (!liste.length) return;
  var gh = document.querySelector('#btnYapimcilar .gh').outerHTML;
  var html = liste.map(function (y) {
    var ad = '<span>' + esc(y.ad) + '</span>' + (y.katki ? '<small>' + esc(y.katki) + '</small>' : '');
    return '<li>' + (y.github
      ? '<a href="https://github.com/' + esc(y.github) + '" target="_blank" rel="noopener">' + gh + '<span class="yapimci-ad">' + ad + '</span></a>'
      : '<div class="yapimci-satir"><span class="yapimci-ad">' + ad + '</span></div>') + '</li>';
  }).join('');
  var yerler = document.querySelectorAll('[data-yapimcilar]');
  for (var i = 0; i < yerler.length; i++) yerler[i].innerHTML = html;
}

function yapimcilarAcKapa(ac) {
  var dugme = $('btnYapimcilar'), liste = $('yapimciListe');
  liste.hidden = !ac;
  dugme.setAttribute('aria-expanded', ac ? 'true' : 'false');
}

EYLEMLER['yapimcilar'] = function () {
  yapimcilarAcKapa($('yapimciListe').hidden);
};

/* ---------------- yorumlar (açılışın altı) ---------------- */
var yorumBilgisi = { yuklendi: false };

/* 0-5 yıldız: dolu ve boş yıldızlar (ik('yildiz')). */
function yildizCiz(n) {
  var h = '<span class="yildizlar" role="img" aria-label="5 üzerinden ' + n + ' yıldız">';
  for (var i = 1; i <= 5; i++) h += '<span class="yildiz' + (i <= n ? ' dolu' : '') + '">' + ik('yildiz') + '</span>';
  return h + '</span>';
}

EYLEMLER['site-eposta'] = function () {
  if (siteBilgisi.eposta) location.href = 'mailto:' + siteBilgisi.eposta;
};

/* ---------------- okul arama (/login sayfası) ---------------- */
var vitrinArama = { sayac: null, sira: 0 };

function vitrinAra() {
  var q = $('vOkulAra').value.trim();
  var sonuc = $('vOkulSonuc');
  if (q.length < 2) { sonuc.innerHTML = ''; return; }
  var sira = ++vitrinArama.sira;
  sonuc.innerHTML = '<div class="vitrin-sonuc-bilgi">Aranıyor...</div>';
  api('/okul-adres/ara?q=' + encodeURIComponent(q)).then(function (d) {
    if (sira !== vitrinArama.sira) return;
    var kelimeler = aramaSadeTR(q).split(' ').filter(Boolean);
    if (!d.okullar.length) {
      sonuc.innerHTML = '<div class="vitrin-sonuc-bilgi">Bu adla Eğitim Evi\'nde bir okul yok. ' +
        'Okulun henüz eklenmemiş olabilir; okul yönetimine sor.</div>';
      return;
    }
    var h = d.duzeltme ? '<div class="vitrin-sonuc-bilgi">"' + esc(q) + '" yerine <b>"' + esc(d.duzeltme) + '"</b> diye aradık.</div>' : '';
    if (d.yakin) h += '<div class="vitrin-sonuc-bilgi">Yazdığın kelimelerin hepsini içeren okul yok. En yakın sonuçlar:</div>';
    h += '<ul class="vitrin-liste">';
    for (var i = 0; i < d.okullar.length; i++) {
      var o = d.okullar[i];
      h += '<li><a href="/' + esc(o.kisaAd) + '" class="vitrin-okul">' +
        '<span class="vitrin-okul-ad">' + aramaVurgula(o.ad, kelimeler, o.vurgu) + '</span>' +
        '<span class="vitrin-okul-yer">' + esc([o.ilce, o.il].filter(Boolean).join(', ')) + '</span></a></li>';
    }
    sonuc.innerHTML = h + '</ul>';
  })['catch'](function (e) {
    if (sira !== vitrinArama.sira) return;
    sonuc.innerHTML = '<div class="vitrin-sonuc-bilgi hata">' + esc(e.message) + '</div>';
  });
}

