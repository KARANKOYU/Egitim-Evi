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

function alanTemizle(alan) {
  if (!alan) return;
  alan.classList.remove('hatali');
  var kutu = alan.querySelector('.alan-hata');
  if (kutu) kutu.remove();
  var isaretli = alan.querySelectorAll('[aria-invalid]');
  for (var i = 0; i < isaretli.length; i++) {
    isaretli[i].removeAttribute('aria-invalid');
    isaretli[i].removeAttribute('aria-describedby');
  }
}

function formHatalariniSil(form) {
  if (!form) return;
  var hatali = form.querySelectorAll('.hatali');
  for (var i = 0; i < hatali.length; i++) alanTemizle(hatali[i]);
}

/* İlk hatalı kutuya götür: ekranın ortasına kaydır, imleci içine koy. */
function ilkHatayaGit(form) {
  var el = form && form.querySelector('[aria-invalid="true"]');
  if (!el) return;
  var azalt = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ block: 'center', behavior: azalt ? 'auto' : 'smooth' });
  try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
}

/* ================= şifre kutusu ================= */
/* Her şifre kutusunun sağına göz düğmesi eklenir. Sayfalar innerHTML ile
   yeniden çizildiği için tek tek çağırmak yerine DOM izlenir. */
function sifreGozuEkle(input) {
  if (input.getAttribute('data-goz')) return;
  input.setAttribute('data-goz', '1');
  var kap = document.createElement('div');
  kap.className = 'sifre-kap';
  input.parentNode.insertBefore(kap, input);
  kap.appendChild(input);
  var b = document.createElement('button');
  b.type = 'button';
  b.className = 'sifre-goz';
  b.title = 'Şifreyi göster';
  b.setAttribute('aria-label', 'Şifreyi göster');
  b.setAttribute('aria-pressed', 'false');
  b.innerHTML = ik('goz');
  kap.appendChild(b);
}

function sifreGoster(input, goster) {
  var b = input.parentNode.querySelector('.sifre-goz');
  input.type = goster ? 'text' : 'password';
  if (!b) return;
  var yazi = goster ? 'Şifreyi gizle' : 'Şifreyi göster';
  b.title = yazi;
  b.setAttribute('aria-label', yazi);
  b.setAttribute('aria-pressed', goster ? 'true' : 'false');
  b.innerHTML = ik(goster ? 'gozKapali' : 'goz');
}

function sifreKutulariniTara(kok) {
  var liste = (kok || document).querySelectorAll('input[type="password"]:not([data-goz])');
  for (var i = 0; i < liste.length; i++) sifreGozuEkle(liste[i]);
}

/* Caps Lock açıkken şifre yanlış yazılır ve kişi nedenini anlamaz. */
function capsUyarisi(input, acik) {
  var alan = input.closest('.field') || input.parentNode;
  var uyari = alan.querySelector('.caps-uyari');
  if (acik && !uyari) {
    uyari = document.createElement('div');
    uyari.className = 'caps-uyari';
    uyari.innerHTML = ik('uyari') + '<span>Büyük harf kilidi (Caps Lock) açık.</span>';
    var kap = input.closest('.sifre-kap') || input;
    kap.parentNode.insertBefore(uyari, kap.nextSibling);
  } else if (!acik && uyari) {
    uyari.remove();
  }
}

