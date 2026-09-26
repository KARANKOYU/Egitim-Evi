/* Açılış ve çıkış: oturumu doğrula, uygulamayı başlat. */

/* ================= başlat / çıkış ================= */

/* Kişiye bağlı ekran durumu: çıkışta ve rol değişince silinir. Sonraki kişi
   (ya da başka okuldaki rol) öncekinin açtığı hesapların şifre listesini,
   seçtiği dosyayı, bildirim panelini, yoklama dersini görmesin. */
function oturumDurumunuSifirla() {
  S.viewStudentId = null;
  S.bildirimSurum = null; S._bildirimler = [];
  S.yilBilgi = null;
  S.aktarim = null; S.metinDosya = null;
  S.yoklamaDers = null; S.yoklamaTarih = ''; S.yoklamaDurum = {};
  S.programSinif = ''; S.programVeri = null;
  S.odevF = { ders: '', yildiz: '', durum: '', bas: '', bit: '', mod: 'ogrenci' }; S.odevHam = [];
  S._sinifListe = null; S._ogrListe = null; S._duzenlenen = null; S._sonuclar = null;
  S._acikMesaj = null; S._acikOdev = null;
  ETUT = { liste: [], yonetebilir: false, bugun: '', adaylar: null, secili: null };
  ROL.liste = [];
  kisilikVeri = null;
  var panel = $('bildirimPanel');
  if (panel) panel.innerHTML = '';
  var rozet = $('bildirimRozet');
  if (rozet) rozet.style.display = 'none';
}
/* Aydınlatma metni yenilenmişse (ya da hesabı müdür açtıysa) kullanıcı
   onaylamadan uygulamaya giremez; sunucu da onaysız isteği reddeder. */
function kvkkOnayIste(d) {
  $('dis').style.display = 'none';
  $('app').classList.remove('on');
  var surum = d.kvkkSurum ? ' (sürüm ' + esc(d.kvkkSurum) + ')' : '';
  /* Hesabı okul açtıysa kişi metni ilk kez görüyor: "güncellendi" denmez. */
  var ilk = !(d.user && d.user.kvkkSurum);
  modalAc(ilk ? 'Aydınlatma metni' : 'Aydınlatma metni güncellendi',
    (ilk ? '<p>Hoş geldin. Devam etmeden önce kişisel verilerinin nasıl işlendiğini anlatan metni okuyup onaylaman gerekiyor.</p>'
      : '<p>Kişisel verilerin korunması aydınlatma metni yenilendi' + surum + '. ' +
        'Devam etmek için metni okuyup onaylaman gerekiyor.</p>') +
    '<p><a href="/kvkk.html" target="_blank" rel="noopener">Aydınlatma metnini yeni sekmede aç</a></p>' +
    '<label class="onay-satiri"><input type="checkbox" id="kvkkYeniKutu"> ' +
    '<span>Aydınlatma metnini okudum, anladım ve kişisel verilerimin bu kapsamda işlenmesini kabul ediyorum. ' +
    '<a href="/kosullar.html" target="_blank" rel="noopener">Kullanım koşullarını</a> kabul ediyorum.</span></label>' +
    '<div id="kvkkYeniMesaj" style="margin-top:10px"></div>',
    '<button class="btn gri" data-act="cikis">Çıkış yap</button>' +
    '<button class="btn" data-act="kvkk-onayla">Onaylıyorum</button>');
  var perde = document.querySelector('.perde');
  if (perde) perde.setAttribute('data-zorunlu', '1');
}

function uygulamayiBaslat() {
  $('dis').style.display = 'none';
  $('app').classList.add('on');
  okulYolunuAyarla();
  $('profilEtiket').textContent = S.user.fullName.split(' ')[0];
  $('profilAvatar').innerHTML = avatar(S.user.fullName, S.user.anaHesapId || S.user.id);
  /* Hesapta kayıtlı tema bu tarayıcıdakinden farklıysa hesaptaki kazanır. */
  if (window.temaAyarla && S.user.tema && S.user.tema !== 'sistem' && window.temaOku() !== S.user.tema) {
    window.temaAyarla(S.user.tema);
  }
  S.viewStudentId = null;
  if (!S.meta.cities.length) {
    api('/meta').then(function (m) { S.meta = m; })['catch'](function () { });
  }
  /* Girişten ya da rol değişiminden gelen hedef (seçim ekranı, ana sayfa) adresi geçer. */
  adrestekiCocuguAl();
  var acilis = S.acilis || adrestenSayfa();
  S.acilis = null;
  /* Rolsüz hesap okul sayfalarına giremez; adres ne olursa olsun başlangıç.
     Servisçinin de yalnızca kendi sayfaları var. */
  if (!S.user.role && acilis !== 'profil' && acilis !== 'kisilikler') acilis = 'ana';
  if (S.user.role === 'servisci' && ['ana', 'mesajlar', 'takvim', 'profil'].indexOf(acilis) < 0) acilis = 'ana';
  /* Yıl bilgisi sayfa çizilmeden gelsin ki şerit ilk açılışta da görünsün. */
  yilBilgisiYukle().then(function () {
    return git(acilis && SAYFALAR[acilis] ? acilis : 'ana');
  }).then(function () {
    if (S._acilisMesaji) { sayfaMesaji(S._acilisMesaji.tur, S._acilisMesaji.d.message); S._acilisMesaji = null; }
    epostaOnerisi();
  });
  bildirimleriYenile();
  bildirimEsitle();
  siteBilgisiYukle();   // alt bilgideki iletişim bilgileri
  if (!S._bildirimSayac) {
    S._bildirimSayac = setInterval(bildirimleriYenile, 30000);
  }
}

function cikisYap(sessiz) {
  var eski = S.token;
  var bitir = function () {
    S.token = null; S.user = null; S.children = []; S.veliCocuk = null; S.kapali = [];
    oturumDurumunuSifirla();                             // sonraki kişi öncekinin ekran durumunu görmesin
    S._epostaSoruldu = false;                            // e-posta önerisi sonraki hesaba da sorulsun
    modalKapat();                                        // KVKK onay penceresinden çıkılıyorsa o da kapansın
    tokenSil(eski);   // bu sekmenin oturumu; hatırlanan başka hesap kalır
    seferiDurdur();                                      // servisçinin konum gönderimi kesilsin
    $('app').classList.remove('on');
    $('sayfa').innerHTML = '';
    if (S._bildirimSayac) { clearInterval(S._bildirimSayac); S._bildirimSayac = null; }
    if (!sessiz) $('authMesaj').innerHTML = '';
    /* Sonraki kişi öncekinin açık bıraktığı sayfaya düşmesin. */
    if (!/yeni-sifre/.test(location.hash)) {
      /* Okul adresinden girdiyse o okulun giriş sayfası, değilse /login. */
      try { history.replaceState(null, '', adrestenOkul() ? location.pathname : '/login'); } catch (e) { }
    }
    okulAdresiniYenile().then(girisEkraniGoster);
  };
  if (sessiz) return bitir();
  /* Bu cihazın telefon bildirimi aboneliği çıkışta bırakılır: başka biri
     aynı cihazda girerse önceki kişinin bildirimleri gelmesin. */
  var sf = S._sefer;
  (sf ? api('/servis/sefer-bitir', 'POST', { seferId: sf.id })['catch'](function () { }) : Promise.resolve())
    .then(bildirimAboneligiBirak)
    .then(function () { return api('/logout', 'POST'); }).then(bitir)['catch'](bitir);
}

/* ================= açılış ================= */
formAlanlariKur();
authKur();
tiklamaKur();
konsolUyarisi();
/* Kurulum akışı girişten bağımsız: giriş ekranındayken de yüklenebilsin. */
pwaKur();

var kayitli = sifirlamaAnahtari ? null : tokenOku();
disSayfalariKur().then(function () { return onaySonucu; }).then(function (onay) {
  /* Onay sonucu: giriş ekranındaysa kartın üstünde, uygulamadaysa sayfada. */
  if (onay && kayitli) S._acilisMesaji = onay;
  else if (onay) {
    if (onay.tur === 'iyi' && onay.d.kullaniciAdi) {
      girisKimlikAyarla('kadi', false);
      $('gEmail').value = onay.d.kullaniciAdi;
    }
    mesajGoster('authMesaj', onay.tur, onay.d.message);
  }
  if (sifirlamaAnahtari) {
    try { localStorage.removeItem('ee_token'); } catch (e) { }
    S.genelGiris = true;
    girisEkraniGoster();
    yeniSifreEkraniAcDisaridan(sifirlamaAnahtari);
    return;
  }
  if (!kayitli) { girisEkraniGoster(); return; }
  S.token = kayitli;
  api('/me').then(function (d) {
    if (d.user.status !== 'approved') { cikisYap(true); return; }
    S.user = d.user; S.children = d.children || []; S.kapali = d.kapaliOzellikler || [];
    /* Telefon bildiriminden gelindiyse (?k=) bildirimin geldiği role geçilir. */
    var k = null;
    try { k = new URLSearchParams(location.search).get('k'); } catch (e) { k = null; }
    if (k) {
      try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { }
      if (k !== d.user.id && (d.user.yetiskin || d.user.rolSatiri)) {
        var hedef = adrestenSayfa();
        return api('/kisilik/gec', 'POST', { tur: 'rol', id: k })
          .then(function (y) { oturumuDegistir(y, hedef); })
          ['catch'](function () { girisSonrasi(d); });
      }
    }
    girisSonrasi(d);
  })['catch'](function () { cikisYap(true); });
});

/* "İncele" penceresini açana: oraya yapıştırılan kod hesabını ele geçirebilir. */
function konsolUyarisi() {
  try {
    var c = window.console;
    if (!c || !c.log) return;
    c.log('%cDur!', 'color:#d62839;font-size:40px;font-weight:700');
    c.log('%cBu pencere geliştiriciler içindir. Biri sana buraya bir şey yapıştırmanı söylediyse bu bir ' +
      'dolandırıcılıktır: hesabına ve okulundaki bilgilere erişmeye çalışıyordur. Yapıştırma, pencereyi kapat.',
      'font-size:15px;line-height:1.5');
  } catch (e) { /* konsol yoksa önemli değil */ }
}
