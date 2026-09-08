/* Form alanlarının ortak davranışları: şifreyi göster/gizle düğmesi,
   Caps Lock uyarısı, alanın altında kırmızı hata yazısı, gün/ay/yıl seçici.
   Giriş ve kayıt ekranı, ayarlar ve müdür pencereleri aynı parçaları kullanır. */

/* ================= alan hatası ================= */
/* Hatalı kutu kırmızı çerçeve alır, mesaj hemen altına yazılır. Kullanıcı
   kutuya yazmaya başlayınca hata kendiliğinden kalkar (formAlanlariKur). */
function alanHatasi(el, mesaj, ekHtml) {
  if (typeof el === 'string') el = $(el);
  if (!el) return;
  var alan = el.closest('.field, .kvkk-alan') || el.parentNode;
  alan.classList.add('hatali');
  el.setAttribute('aria-invalid', 'true');
  var kutu = alan.querySelector('.alan-hata');
  if (!kutu) {
    kutu = document.createElement('div');
    kutu.className = 'alan-hata';
    kutu.id = (el.id || 'alan') + 'Hata';
    kutu.setAttribute('role', 'alert');
    alan.appendChild(kutu);
  }
  kutu.innerHTML = ik('uyari') + '<span>' + esc(mesaj) + (ekHtml ? ' ' + ekHtml : '') + '</span>';
  el.setAttribute('aria-describedby', kutu.id);
}

