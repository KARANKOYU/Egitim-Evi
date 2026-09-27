/* Bildirimler, sayfa içi arama, mobil menü. */

/* ================= bildirimler ================= */
/* Sitenin yoklama aralığıyla (yönetim panelindeki ayar, varsayılan 5 dakika;
   giriş, /me ve /site cevabındaki bildirimAralikDk) yoklanır. Sunucuya son
   bilinen sürüm gönderilir; kutu değişmediyse liste gelmez, cevap birkaç
   bayttır. Arka plandaki sekme hiç yoklamaz; sekmeye dönülünce ve bildirim
   paneli açılınca beklemeden yoklanır. */
function bildirimleriYenile() {
  if (!S.token || document.hidden || S._bildirimYoklaniyor) return;
  var onceki = S.bildirimSurum;
  S._bildirimYoklaniyor = true;
  api('/notifications' + (onceki ? '?surum=' + encodeURIComponent(onceki) : '')).then(function (d) {
    S._bildirimYoklaniyor = false;
    if (!S.token) return;   // bu arada çıkış yapıldı
    S.bildirimSurum = d.surum;
    S.unread = d.unread;
    var r = $('bildirimRozet');
    if (d.unread > 0) { r.textContent = d.unread > 99 ? '99+' : d.unread; r.style.display = ''; }
    else r.style.display = 'none';
    if (!d.ayni) {
      /* Yetişkin hesabında yeni bildirim bir okulun kişiyi eklediğini
         söylüyor olabilir: menüdeki portallar da tazelensin. */
      if (onceki && S.portallar) portallariTazele();
      S._bildirimler = d.notifications;
      /* Panel açıkken yeni bildirim geldiyse panel de tazelensin. */
      if ($('bildirimPanel').innerHTML) bildirimPaneliCiz();
    }
  })['catch'](function () { S._bildirimYoklaniyor = false; });
}
document.addEventListener('visibilitychange', function () { if (!document.hidden) bildirimleriYenile(); });

/* Yoklama aralığı (dakika, 1-30). Değişirse çalışan sayaç yeni aralıkla kurulur. */
function bildirimAraligiAl(dk) {
  var n = Math.round(Number(dk));
  if (!n || n < 1) return;
  n = Math.min(30, n);
  if (S.bildirimAralikDk === n) return;
  S.bildirimAralikDk = n;
  if (S._bildirimSayac) bildirimSayaciKur();
}

function bildirimSayaciKur() {
  if (S._bildirimSayac) clearInterval(S._bildirimSayac);
  S._bildirimSayac = setInterval(bildirimleriYenile, (S.bildirimAralikDk || 5) * 60 * 1000);
}

/* Bildirime tıklayınca ilgili sayfa açılır ("Yeni ödev" -> Ödevler). */
EYLEMLER['bildirim-git'] = function (el) {
  var p = adrestenParca(el.getAttribute('data-link'));
  $('bildirimPanel').innerHTML = '';
  if (!p || !SAYFALAR[p.sayfa]) return;
  if (p.cocuk) S.adresCocuk = p.cocuk;   // velinin bildirimi: o çocuğun sayfası
  git(p.sayfa);
};

function bildirimPaneliAcKapa() {
  var p = $('bildirimPanel');
  if (p.innerHTML) { p.innerHTML = ''; return; }
  bildirimPaneliCiz();
  /* Yoklama aralığı dakikalarca olabilir: panel açılınca hemen sorulur. */
  bildirimleriYenile();
}

function bildirimPaneliCiz() {
  var p = $('bildirimPanel');
  var list = S._bildirimler || [];
  var h = '<div class="panel">';
  if (!list.length) h += '<div style="padding:22px;text-align:center;color:var(--soluk)">Bildirim yok.</div>';
  for (var i = 0; i < list.length; i++) {
    var link = adrestenParca(list[i].link) ? list[i].link : '';
    h += '<div class="bildirim ' + (list[i].read ? '' : 'yeni') + (link ? ' tikla' : '') + '"' +
      (link ? ' data-act="bildirim-git" data-link="' + esc(link) + '" role="button" tabindex="0"' : '') + '>' +
      esc(list[i].text) + '<div class="z">' + tarihSaat(list[i].createdAt) + '</div></div>';
  }
  p.innerHTML = h + '</div>';
  if (S.unread > 0) {
    api('/notifications/read', 'POST').then(function () {
      S.unread = 0;
      $('bildirimRozet').style.display = 'none';
      for (var i = 0; i < (S._bildirimler || []).length; i++) S._bildirimler[i].read = true;
    })['catch'](function () { });
  }
}

/* ================= arama ================= */
function araUygula() {
  /* Sayfa kendi arama mantığını kurduysa (ör. ödevler) onu çalıştır. */
  if (typeof S.araHook === 'function') { S.araHook(); return; }
  var t = nrm($('araKutu') && $('araKutu').value || '');
  var hedefler = document.querySelectorAll('#sayfa [data-ara]');
  var gorunen = 0;
  for (var i = 0; i < hedefler.length; i++) {
    var el = hedefler[i];
    var uyar = !t || nrm(el.getAttribute('data-ara') || '').indexOf(t) >= 0;
    el.style.display = uyar ? '' : 'none';
    if (uyar) gorunen++;
  }
  /* Arama hiçbir şeyi tutmadıysa kullanıcı boş sayfaya bakmasın. */
  var uyari = $('araBos');
  if (uyari) uyari.parentNode.removeChild(uyari);
  if (t && hedefler.length && gorunen === 0) {
    var d = document.createElement('div');
    d.id = 'araBos';
    d.innerHTML = bosKutu('ara', '"' + t + '" için sonuç bulunamadı.');
    $('sayfa').appendChild(d);
  }
}

/* ================= mobil menü ================= */
function sidebarAc() { $('sidebar').classList.add('acik'); $('sidebarPerde').classList.add('acik'); }
function sidebarKapat() { $('sidebar').classList.remove('acik'); $('sidebarPerde').classList.remove('acik'); }

/* 860px üstü masaüstü sayılır: menü kayan panel değil, yerinde daralıp genişler. */
function masaustuMu() { return window.innerWidth > 860; }

function menuDurumYaz(kapali) {
  try { localStorage.setItem('ee_menu', kapali ? '1' : '0'); } catch (e) { /* gizli sekmede yazılamaz */ }
}

function masaustuDaralt(kapali) {
  document.body.classList.toggle('sidebar-kapali', kapali);
  var hb = $('hamburger');
  if (hb) hb.setAttribute('aria-expanded', kapali ? 'false' : 'true');
  menuDurumYaz(kapali);
}

function menuDurumOku() {
  try { return localStorage.getItem('ee_menu') === '1'; } catch (e) { return false; }
}
