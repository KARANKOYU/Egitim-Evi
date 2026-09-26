/* Rol seçimi ("Hesap değiştir") ve rol ekleme.
   Yetişkin hesabı birden çok rolde olabilir: A okulunda öğretmen, B okulunda
   müdür, çocuğunun velisi. Burada hangisiyle devam edileceği seçilir; "Ekle"
   yeni rol açar: çocuk (veli kodu), öğretmenlik (kişisel kodu okula vermek),
   müdürlük (okul başvurusu). Kimin hangi role geçebileceğini sunucu denetler;
   rol değişince yeni oturum açılır, eskisi kapanır. */

var kisilikVeri = null;

var ROL_ETIKET = { teacher: 'Öğretmen', principal: 'Müdür' };

SAYFALAR.kisilikler = function () {
  return api('/kisilikler').then(function (d) {
    kisilikVeri = d;
    var aktif = d.aktif;
    var satirlar = '';
    for (var i = 0; i < d.roller.length; i++) {
      var r = d.roller[i];
      var bekliyor = r.durum === 'pending';
      var buRol = aktif === r.id;
      satirlar += '<div class="kisilik' + (r.girilebilir ? '' : ' kapali') + (buRol ? ' aktif' : '') + '">' +
        cizim(r.rol === 'principal' ? 'mudur' : 'ogretmen', 'kisilik-cizim') +
        '<div class="kisilik-yazi"><div class="kisilik-rol">' + esc(ROL_ETIKET[r.rol] || 'Rol') +
        (buRol ? ' <span class="etiket yesil">şu an bu roldesin</span>' : '') +
        (bekliyor ? ' <span class="etiket turuncu">onay bekliyor</span>' : '') + '</div>' +
        '<div class="kisilik-yer">' + esc(r.okulAdi || 'Okul') + '</div></div>' +
        '<div class="kisilik-islem">' +
        (r.girilebilir && !buRol ? '<button class="btn" data-act="kisilik-gec" data-tur="rol" data-id="' + esc(r.id) + '">Devam et</button>' : '') +
        (r.rol === 'teacher' ? '<button class="btn kucuk gri" data-act="kisilik-ayril" data-id="' + esc(r.id) + '" data-ad="' + esc(r.okulAdi) + '">Okuldan ayrıl</button>' : '') +
        (bekliyor ? '<button class="btn kucuk gri" data-act="kisilik-ayril" data-id="' + esc(r.id) + '" data-bekliyor="1">Başvuruyu geri çek</button>' : '') +
        '</div></div>';
    }
    for (var j = 0; j < d.cocuklar.length; j++) {
      var c = d.cocuklar[j];
      var buCocuk = aktif === 'hesap' && S.veliCocuk === c.id;
      satirlar += '<div class="kisilik' + (buCocuk ? ' aktif' : '') + '">' + cizim('veli', 'kisilik-cizim') +
        '<div class="kisilik-yazi"><div class="kisilik-rol">Veli' +
        (buCocuk ? ' <span class="etiket yesil">şu an bu roldesin</span>' : '') + '</div>' +
        '<div class="kisilik-yer">' + esc(c.ad) + (c.okulAdi ? ' · ' + esc(c.okulAdi) : '') + '</div></div>' +
        '<div class="kisilik-islem">' +
        (buCocuk ? '' : '<button class="btn" data-act="kisilik-gec" data-tur="veli" data-id="' + esc(c.id) + '">Devam et</button>') +
        '<button class="btn kucuk gri" data-act="kisilik-cocuk-kaldir" data-id="' + esc(c.id) + '" data-ad="' + esc(c.ad) + '">Kaldır</button>' +
        '</div></div>';
    }

    var h = '<div class="kisilik-bas"><div><h1>Nasıl devam edeceksin?</h1>' +
      '<p class="alt">' + esc(d.hesap.fullName) + ' · ' + esc(d.hesap.username) + '</p></div>' +
      '<button class="btn" data-act="kisilik-ekle">' + ik('ekle') + 'Ekle</button></div>';
    if (satirlar) h += '<div class="kisilik-liste">' + satirlar + '</div>';
    else {
      h += '<div class="kart kisilik-bos"><p>Henüz bir rolün yok. Aşağıdan başla: çocuğunu ekle, okuluna öğretmen olarak ' +
        'katıl ya da okulunu kaydet. Birden fazlası olabilir; sonra buradan aralarında geçersin.</p>' + ekleSecenekleri() + '</div>';
    }
    yaz(h);

    /* Kayıtta "ne olarak kullanacaksın" seçildiyse ilk açılışta o yol açılır. */
    var ilk = tercihOku('ilk_ekle', '');
    if (ilk) {
      tercihYaz('ilk_ekle', '');
      if (!satirlar && ekleIcerik[ilk]) ekleAc(ilk);
    }
  });
};

/* ---------------- rol değiştirme ----------------
   hedefSayfa: geçişten sonra açılacak sayfa (telefon bildiriminden gelindiyse
   bildirimin götürdüğü yer); verilmezse ana sayfa. */
function oturumuDegistir(d, hedefSayfa) {
  var eski = S.token;
  S.token = d.token;
  tokenYenile(d.token, eski);
  oturumDurumunuSifirla();
  S.user = d.user;
  S.children = d.children || [];
  S.kapali = d.kapaliOzellikler || [];
  S.veliCocuk = d.cocuk || null;
  S.acilis = hedefSayfa && SAYFALAR[hedefSayfa] ? hedefSayfa : 'ana';
  modalKapat();
  girisSonrasi(d);
}

/* Çocuk eklenip çıkarılınca menüdeki veli bölümü ve veli sayfaları güncel
   listeyle çalışsın (kaldırılan çocuğu istemeye devam edip düşmesin). */
function cocuklariTazele() {
  return api('/me').then(function (m) {
    S.children = m.children || [];
    S.kapali = m.kapaliOzellikler || [];
    if (S.veliCocuk && !S.children.some(function (c) { return c.id === S.veliCocuk; })) S.veliCocuk = null;
    navCiz();
  })['catch'](function () { });
}

EYLEMLER['kisilik-gec'] = function (el, id) {
  dugmeBekle(el, 'Geçiliyor...');
  return api('/kisilik/gec', 'POST', { tur: el.getAttribute('data-tur'), id: id })
    .then(oturumuDegistir)['catch'](function (e) { dugmeBitir(el); hataGoster(e); });
};

EYLEMLER['kisilik-ayril'] = function (el, id) {
  var bekliyor = el.getAttribute('data-bekliyor') === '1';
  if (!confirm(bekliyor ? 'Okul başvurun geri çekilsin mi?'
    : (el.getAttribute('data-ad') || 'Bu okul') + ' okulundan ayrılmak istiyor musun?\n\nOkulun öğretmen listesinden çıkarsın; ' +
      'verdiğin ödevler ve notlar okulda kalır. Geri dönmek için okula yeni kodunu vermen gerekir.')) return;
  dugmeBekle(el, 'Bekle...');
  return api('/kisilik/ayril', 'POST', { id: id, onay: true }).then(function (d) {
    if (d.token) { oturumuDegistir(d); return; }
    return git('kisilikler').then(function () { sayfaMesaji('iyi', d.message); });
  })['catch'](function (e) { dugmeBitir(el); hataGoster(e); });
};

EYLEMLER['kisilik-cocuk-kaldir'] = function (el, id) {
  if (!confirm((el.getAttribute('data-ad') || 'Bu öğrenci') + ' hesabından kaldırılsın mı? Bilgilerini artık göremezsin.')) return;
  el.disabled = true;
  return api('/kisilik/cocuk-kaldir', 'POST', { id: id }).then(function () {
    if (S.veliCocuk === id) S.veliCocuk = null;
    return cocuklariTazele().then(function () { return git('kisilikler'); });
  })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

/* ---------------- Ekle ---------------- */
function ekleSecenekleri() {
  return '<div class="ekle-secenek">' +
    '<button type="button" class="ekle-kutu" data-act="ekle-sec" data-tur="cocuk">' + cizim('cocuk-ekle') +
    '<span class="ekle-ad">Çocuğumu ekle</span><span class="ekle-alt">Veli kodunu gir, çocuğunun ödevini, notunu, servisini gör.</span></button>' +
    '<button type="button" class="ekle-kutu" data-act="ekle-sec" data-tur="ogretmen">' + cizim('ogretmen-kodu') +
    '<span class="ekle-ad">Öğretmen olarak katıl</span><span class="ekle-alt">Kodunu okulunun müdürüne ver; seni okula ekler.</span></button>' +
    '<button type="button" class="ekle-kutu" data-act="ekle-sec" data-tur="okul">' + cizim('okul-kaydet') +
    '<span class="ekle-ad">Okulumu kaydet</span><span class="ekle-alt">Müdürsen okulunu ekle; onaylanınca yönetirsin.</span></button>' +
    '</div>';
}

var ekleIcerik = {
  cocuk: function () {
    return '<div class="ekle-panel">' + cizim('cocuk-ekle', 'ekle-panel-cizim') +
      '<p>Çocuğunun <b>veli kodunu</b> yaz. Kodu çocuğunun Ayarlar sayfasında ya da okul yönetiminde bulursun; ' +
      'büyük/küçük harf ve tire fark etmez.</p>' +
      '<div class="field"><label for="ekVeliKod">Veli kodu</label>' +
      '<div class="rolsuz-satir"><input type="text" id="ekVeliKod" autocomplete="off" autocapitalize="characters" ' +
      'spellcheck="false" maxlength="20" placeholder="XXXXX-XXXXX">' +
      '<button class="btn" data-act="ekle-cocuk-kaydet">Ekle</button></div></div></div>';
  },
  ogretmen: function () {
    var kod = (kisilikVeri && kisilikVeri.ogretmenKodu) || '';
    return '<div class="ekle-panel">' + cizim('ogretmen-kodu', 'ekle-panel-cizim') +
      '<p>Bu kodu okulunun müdürüne ver. Müdür <b>Öğretmenler &gt; Kodla ekle</b> ekranında kodu girince ' +
      'o okulun öğretmeni olursun ve "Hesap değiştir"de okulun görünür.</p>' +
      '<div class="ogretmen-kod" id="ekOgretmenKod">' + esc(kod) + '</div>' +
      '<div class="dugme-satir">' +
      '<button class="btn ghost kucuk" data-act="kod-kopyala" data-kod="' + esc(kod) + '">Kopyala</button>' +
      '<button class="btn gri kucuk" data-act="ekle-kod-yenile">Yeni kod üret</button></div>' +
      '<div class="hint">Kod bir kez kullanılır: bir okul seni eklediğinde kendiliğinden yenilenir. Kodu yanlış kişiye ' +
      'verdiysen "Yeni kod üret" ile eskisini geçersiz kıl.</div></div>';
  },
  okul: function (hesap) {
    return '<div class="ekle-panel" id="rMudurKart">' + cizim('okul-kaydet', 'ekle-panel-cizim') +
      '<p>Okulunu Millî Eğitim Bakanlığı listesinden bul. Başvurun sistem yöneticisi onaylayınca "Hesap değiştir"de ' +
      '"Müdür" satırı açılır; öğrenci ve servisçi hesaplarını sen açarsın, öğretmenleri kodlarıyla eklersin.</p>' +
      okulBasvuruFormu(hesap && hesap.dogum) + '</div>';
  }
};

function ekleAc(tur) {
  /* Okul başvurusu doğum tarihini ister: hesapta kayıtlıysa doldurulmuş gelir. */
  if (tur === 'okul' && !ekleAc.hesap) {
    return api('/hesap').then(function (d) { ekleAc.hesap = d.hesap; ekleAc(tur); ekleAc.hesap = null; })
      ['catch'](function () { ekleAc.hesap = {}; ekleAc(tur); ekleAc.hesap = null; });
  }
  modalAc(tur === 'cocuk' ? 'Çocuğumu ekle' : tur === 'ogretmen' ? 'Öğretmen olarak katıl' : 'Okulumu kaydet',
    ekleIcerik[tur](ekleAc.hesap) + '<div id="ekleMesaj" style="margin-top:10px"></div>',
    '<button class="btn gri" data-act="kisilik-ekle">Geri</button>' +
    (tur === 'okul' ? '<button class="btn" data-act="rolsuz-mudur">Başvuruyu gönder</button>' : '') +
    '<button class="btn gri" data-act="modal-kapat">Kapat</button>');
  if (tur === 'okul') okulBasvurusuKur();
  if (tur === 'cocuk') $('ekVeliKod').focus();
}

EYLEMLER['kisilik-ekle'] = function () {
  modalAc('Ekle', '<p class="hint" style="margin-top:0">Ne eklemek istiyorsun?</p>' + ekleSecenekleri());
};
EYLEMLER['ekle-sec'] = function (el) { ekleAc(el.getAttribute('data-tur')); };

EYLEMLER['ekle-cocuk-kaydet'] = function (el) {
  var kutu = $('ekVeliKod');
  alanTemizle(kutu.closest('.field'));
  if (!kutu.value.trim()) { alanHatasi(kutu, 'Veli kodunu yaz.'); kutu.focus(); return; }
  dugmeBekle(el, 'Ekleniyor...');
  return api('/kisilik/cocuk', 'POST', { code: kutu.value }).then(function (d) {
    modalKapat();
    return cocuklariTazele().then(function () { return git('kisilikler'); })
      .then(function () { sayfaMesaji('iyi', d.message); });
  })['catch'](function (e) { dugmeBitir(el); alanHatasi(kutu, e.message); kutu.focus(); });
};

EYLEMLER['ekle-kod-yenile'] = function (el) {
  if (!confirm('Yeni kod üretilsin mi? Eski kod artık çalışmaz.')) return;
  dugmeBekle(el, 'Üretiliyor...');
  return api('/kisilik/kod', 'POST', {}).then(function (d) {
    dugmeBitir(el);
    if (kisilikVeri) kisilikVeri.ogretmenKodu = d.ogretmenKodu;
    $('ekOgretmenKod').textContent = d.ogretmenKodu;
    var kopya = document.querySelector('#modalGovde [data-act="kod-kopyala"]');
    if (kopya) kopya.setAttribute('data-kod', d.ogretmenKodu);
    mesajGoster('ekleMesaj', 'iyi', d.message);
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('ekleMesaj', 'hata', e.message); });
};
