/* Tıklama yönetimi: data-act düğmelerinin hepsi burada ele alınır. */

/* ================= tıklama yönetimi ================= */
function tiklamaKur() {
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    /* en yakın data taşıyan elemanı bul */
    var el = t;
    while (el && el !== document.body && !el.getAttribute) el = el.parentNode;
    var nav = null, act = null, node = t;
    while (node && node !== document.body) {
      if (node.getAttribute) {
        if (!act && node.getAttribute('data-act')) { act = node; }
        if (!nav && node.getAttribute('data-nav')) { nav = node; }
        if (act || nav) break;
      }
      node = node.parentNode;
    }

    if (nav) {
      ev.preventDefault();
      var k = nav.getAttribute('data-nav');
      if (k === 'geri-veli') {
        var rol = S.user ? S.user.role : '';
        S.viewStudentId = null; S.viewStudentName = '';
        git(rol === 'parent' ? 'cocuklarim' : 'okul-ogrenciler');
        return;
      }
      git(k);
      return;
    }
    if (!act) {
      /* Zorunlu pencere (KVKK onayı) perdeye tıklayınca kapanmaz. */
      if (t.getAttribute && t.getAttribute('data-perde') && !t.getAttribute('data-zorunlu')) modalKapat();
      if ($('bildirimPanel').innerHTML && !$('btnBildirim').contains(t) && !$('bildirimPanel').contains(t)) {
        $('bildirimPanel').innerHTML = '';
      }
      return;
    }
    ev.preventDefault();
    islem(act.getAttribute('data-act'), act);
  });

  $('hamburger').onclick = function () {
    if (masaustuMu()) {
      masaustuDaralt(!document.body.classList.contains('sidebar-kapali'));
      return;
    }
    if ($('sidebar').classList.contains('acik')) sidebarKapat(); else sidebarAc();
  };
  /* Kaydedilen daraltma tercihi yalnizca masaustunde gecerli;
     mobilde menu zaten kayan panel olarak calisiyor. */
  if (masaustuMu() && menuDurumOku()) masaustuDaralt(true);
  try {
    var kg = localStorage.getItem('ee_program_gorunum');
    if (kg === 'hafta' || kg === 'gun') S.programGorunum = kg;
  } catch (e) { }
  /* Mobilden masaüstüne geçişte açık kalan kayan menüyü kapat. */
  window.addEventListener('resize', function () { if (masaustuMu()) sidebarKapat(); });
  $('sidebarPerde').onclick = sidebarKapat;
  $('btnYenile').onclick = sayfayiYenile;
  /* Sayfadaki bir yazı kutusuna yazılınca "kaydedilmemiş" sayılır; yenile
     düğmesi silmeden önce sorar. Filtre seçmek sayılmaz. */
  $('sayfa').addEventListener('input', function (ev) {
    var t = ev.target;
    if (t.matches && t.matches('textarea, [contenteditable], input:not([type]), input[type="text"], input[type="number"]')) {
      S._sayfaDegisti = true;
    }
  });
  $('btnBildirim').onclick = bildirimPaneliAcKapa;
  $('btnAyarlar').onclick = function () { git('profil'); };
  $('btnProfil').onclick = function () { git('profil'); };
  $('araKutu').oninput = araUygula;

  /* Geri/ileri tuşları: adres değişince o sayfaya git. */
  window.addEventListener('hashchange', function () {
    if (adresGuncelleniyor) return;
    var hedef = adrestenSayfa();
    adrestekiCocuguAl();
    /* Geri tuşu sayfayı değiştirirken açık pencere önceki sayfada kalır. */
    if (hedef && hedef !== S.page && SAYFALAR[hedef]) { modalKapat(); git(hedef); }
  });
}

/* Panoya kopyala. http:// üzerinden (güvensiz origin) navigator.clipboard
   tanımsızdır, o yüzden eski execCommand yöntemine düşen bir yedek var. */
function eskiYontemKopyala(metin) {
  try {
    var ta = document.createElement('textarea');
    ta.value = metin;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, metin.length);
    var oldu = document.execCommand('copy');
    document.body.removeChild(ta);
    return oldu;
  } catch (e) { return false; }
}

function panoyaKopyala(metin, btn) {
  function geriBildir(oldu) {
    if (!btn) return;
    if (!btn.getAttribute('data-eski')) btn.setAttribute('data-eski', btn.textContent);
    var eski = btn.getAttribute('data-eski');
    btn.textContent = oldu ? 'Kopyalandı' : 'Kopyalanamadı';
    setTimeout(function () { btn.textContent = eski; }, 1600);
  }
  if (window.navigator && navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(metin).then(
      function () { geriBildir(true); },
      function () { geriBildir(eskiYontemKopyala(metin)); }
    );
    return;
  }
  geriBildir(eskiYontemKopyala(metin));
}

function hataGoster(e) { alert(e.message); }

/* Şifre sıfırlama bağlantısındaki tek kullanımlık anahtar. */
var yeniSifreAnahtar = '';
var yeniSifreEkraniAcDisaridan = function () { };
