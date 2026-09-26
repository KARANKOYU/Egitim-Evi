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

