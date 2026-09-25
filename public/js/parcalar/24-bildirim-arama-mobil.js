/* Bildirimler, sayfa içi arama, mobil menü. */

/* ================= bildirimler ================= */
/* 30 saniyede bir yoklanır. Sunucuya son bilinen sürüm gönderilir; kutu
   değişmediyse liste gelmez, cevap birkaç bayttır. Arka plandaki sekme hiç
   yoklamaz, sekmeye dönülünce hemen tazelenir. */
function bildirimleriYenile() {
  if (!S.token || document.hidden) return;
  api('/notifications' + (S.bildirimSurum ? '?surum=' + encodeURIComponent(S.bildirimSurum) : '')).then(function (d) {
    S.bildirimSurum = d.surum;
    S.unread = d.unread;
    var r = $('bildirimRozet');
    if (d.unread > 0) { r.textContent = d.unread > 99 ? '99+' : d.unread; r.style.display = ''; }
    else r.style.display = 'none';
    if (!d.ayni) S._bildirimler = d.notifications;
  })['catch'](function () { });
}
document.addEventListener('visibilitychange', function () { if (!document.hidden) bildirimleriYenile(); });

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

