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

