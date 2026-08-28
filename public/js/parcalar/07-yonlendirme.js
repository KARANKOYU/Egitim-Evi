/* Sayfa yönlendirme: adres çubuğundaki # ile sayfa açma, yaz() ile çizme. */

/* ================= sayfa yönlendirme ================= */
/* Adres çubuğundaki sayfa anahtarı (#/program -> "program"). Velinin
   bildiriminden gelen adres hangi çocuğu gösterdiğini de taşır
   (#/veli-odevler?c=<öğrenci>); çocuk veli sayfalarında seçilir. */
function adrestenSayfa() {
  var m = adrestenParca(location.hash);
  return m ? m.sayfa : '';
}

function adrestenParca(adres) {
  var m = /^#?\/?([a-z0-9-]+)(?:\?c=([A-Za-z0-9_-]{1,60}))?$/i.exec(String(adres || '').trim());
  return m ? { sayfa: m[1], cocuk: m[2] || '' } : null;
}

var adresGuncelleniyor = false;

function git(sayfa) {
  /* Adresi de güncelle ki geri tuşu ve yenileme çalışsın. */
  if (adrestenSayfa() !== sayfa) {
    adresGuncelleniyor = true;
    try { location.hash = '#/' + sayfa; } catch (e) { }
    adresGuncelleniyor = false;
  }
  S.page = sayfa;
  S.araHook = null;
  S._sayfaDegisti = false;
  S.odevF = { ders: '', yildiz: '', durum: '', bas: '', bit: '', mod: 'ogrenci' };
  if ($('araKutu')) $('araKutu').value = '';
  navCiz();
  sidebarKapat();
  $('sayfa').innerHTML = '<div class="yukleniyor">Yükleniyor...</div>';
  window.scrollTo(0, 0);
  aileHaritaKapat();   // Çocuğumun telefonu sayfasının haritası (27b-aile.js)

  var f = SAYFALAR[sayfa];
  if (!f) { $('sayfa').innerHTML = bosKutu('soru', 'Bu sayfa bulunamadı.'); return Promise.resolve(); }
  if (!sayfaAcik(sayfa)) {
    $('sayfa').innerHTML = bosKutu('kilit', 'Bu bölüm okulunda kapalı. Okul müdürü Özellikler sayfasından açabilir.');
    return Promise.resolve();
  }
  /* Sayfa çizilince biten söz döner: çağıran ardından mesaj ekleyebilir. */
  return Promise.resolve()
    .then(function () { return f(); })
    ['catch'](function (err) {
      $('sayfa').innerHTML = '<div class="msg hata">' + esc(err.message) + '</div>';
    });
}

/* Açık sayfayı sunucudan yeniden çizer: sen içerideyken öğretmen yeni ödev
   girdiyse, mesaj geldiyse ya da not açıklandıysa görünsün. git()'ten farkı:
   seçili filtreler, arama kutusu ve kaydırma yeri olduğu gibi kalır. */
function sayfayiYenile() {
  var f = SAYFALAR[S.page];
  if (!S.token || !f || S._yenileniyor) return Promise.resolve();
  if (teslimDurum.yukleniyor > 0) {
    sayfaMesaji('uyari', 'Dosya yükleniyor. Yükleme bitince yenileyebilirsin.');
    return Promise.resolve();
  }
  /* Sayfada yazılmış ama kaydedilmemiş bir şey varsa (ödev metni, not,
     sınav cevabı) sormadan silinmesin. */
  if (S._sayfaDegisti && !confirm('Sayfada yazdıkların kaydedilmedi; yenilersen silinecek. Yine de yenilensin mi?')) {
    return Promise.resolve();
  }
  var dugme = $('btnYenile');
  var kaydirma = window.scrollY;
  S._yenileniyor = true;
  if (dugme) dugme.classList.add('donuyor');
  bildirimleriYenile();
  return Promise.resolve()
    .then(function () { return f(); })
    .then(function () { window.scrollTo(0, kaydirma); })
    ['catch'](function (err) { sayfaMesaji('hata', err.message); })
    .then(function () {
      S._yenileniyor = false;
      S._sayfaDegisti = false;
      if (dugme) dugme.classList.remove('donuyor');
    });
}

function yaz(html) {
  $('sayfa').innerHTML = yilSeridi() + html + altBilgi();
  araUygula();
  yilSeciciBagla();
  iletisimleriDoldur();
}

function yilSeciciBagla() {
  var sec = $('yilSec');
  if (!sec) return;
  sec.onchange = function () {
    api('/egitim-yili/bak', 'POST', { id: this.value, ogrenci: yilOgrencisi() })
      .then(function () { return yilBilgisiYukle(); })
      .then(function () { git(S.page); })['catch'](hataGoster);
  };
}

function bosKutu(g, metin) {
  return '<div class="bos">' + ik(g, 'buyuk') + '<span>' + esc(metin) + '</span></div>';
}

/* Her sayfanın altı: aydınlatma metni, sistem hakkında ve sitenin iletişim
   bilgileri (data/config.yml doluysa; iletisimleriDoldur koyar). */
function altBilgi() {
  return '<div class="footer">' +
    '<p><b>Eğitim Evi</b> — okul yönetim sistemi</p>' +
    '<p style="margin-top:8px">' +
    '<a href="/kvkk.html" target="_blank" rel="noopener">Aydınlatma metni</a>' +
    ' · <a href="#" data-act="kaynakca">Bu sistem hakkında</a></p>' +
    '<p class="footer-iletisim" data-iletisim hidden></p>' +
    '</div>';
}

function hero(baslik, altYazi) {
  return '<div class="hero"><h1>' + esc(baslik) + '</h1>' +
    (altYazi ? '<p class="alt">' + esc(altYazi) + '</p>' : '') +
    '<hr></div>';
}

/* Ana sayfadaki renkli bolum kutucuklari.
   liste: [{ k: sayfaAnahtari, ad, renk, ikon, alt, rozet }] */
function kutucuklar(liste) {
  var h = '<div class="kutucuklar">';
  for (var i = 0; i < liste.length; i++) {
    var t = liste[i];
    if (!t || !sayfaAcik(t.k)) continue;
    h += '<button type="button" class="kutucuk ' + t.renk + '" data-nav="' + esc(t.k) + '">' +
      '<span class="kutucuk-ikon">' + ik(t.ikon) + '</span>' +
      (t.rozet ? '<span class="kutucuk-rozet">' + esc(t.rozet) + '</span>' : '') +
      '<span class="kutucuk-ad">' + esc(t.ad) + '</span>' +
      (t.alt ? '<span class="kutucuk-alt">' + esc(t.alt) + '</span>' : '') +
      '</button>';
  }
  return h + '</div>';
}
