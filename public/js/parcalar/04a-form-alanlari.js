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

/* ================= gün / ay / yıl seçici ================= */
/* Tarayıcının tarih kutusu dile göre "mm/dd/yyyy" gösterebiliyor ve doğum
   yılına gitmek için ay ay geri sarmak gerekiyor. Üç açılır liste hem her
   tarayıcıda aynı görünür hem hızlı seçilir. Değer gizli kutuda YYYY-AA-GG
   olarak durur; okuyan kod yine $('kimlik').value ile alır. */
function tarihSecici(kimlik, iso, secenek) {
  secenek = secenek || {};
  var buYil = new Date().getFullYear();
  var enYeni = buYil - (secenek.enKucukYas || 0);
  var enEski = secenek.enEski || 1920;
  var p = String(iso || '').split('-');
  var y = p.length === 3 ? Number(p[0]) : 0;
  var a = p.length === 3 ? Number(p[1]) : 0;
  var g = p.length === 3 ? Number(p[2]) : 0;

  var h = '<div class="tarih-secici" data-tarih="' + esc(kimlik) + '">' +
    '<select id="' + esc(kimlik) + 'Gun" aria-label="Gün" autocomplete="bday-day"><option value="">Gün</option>';
  for (var i = 1; i <= 31; i++) h += '<option value="' + i + '"' + (i === g ? ' selected' : '') + '>' + i + '</option>';
  h += '</select><select id="' + esc(kimlik) + 'Ay" aria-label="Ay" autocomplete="bday-month"><option value="">Ay</option>';
  for (var j = 1; j <= 12; j++) h += '<option value="' + j + '"' + (j === a ? ' selected' : '') + '>' + AY_ADI[j - 1] + '</option>';
  h += '</select><select id="' + esc(kimlik) + 'Yil" aria-label="Yıl" autocomplete="bday-year"><option value="">Yıl</option>';
  for (var k = enYeni; k >= enEski; k--) h += '<option value="' + k + '"' + (k === y ? ' selected' : '') + '>' + k + '</option>';
  h += '</select><input type="hidden" id="' + esc(kimlik) + '" value="' + esc(y && a && g ? iso : '') + '"></div>';
  return h;
}

/* Seçimler değişince gizli değeri yaz; ayın gün sayısına göre fazlalığı kapat
   (31 Şubat seçilemesin). Üçü de seçilmeden değer boş kalır. */
function tarihSeciciGuncelle(kap) {
  var kimlik = kap.getAttribute('data-tarih');
  var gun = $(kimlik + 'Gun'), ay = $(kimlik + 'Ay'), yil = $(kimlik + 'Yil'), gizli = $(kimlik);
  if (!gun || !ay || !yil || !gizli) return;
  var a = Number(ay.value), y = Number(yil.value) || 2000;   // yıl yokken artık yıl varsay (29 Şubat açık kalsın)
  var sinir = a ? new Date(y, a, 0).getDate() : 31;
  for (var i = 0; i < gun.options.length; i++) {
    var o = gun.options[i];
    if (o.value) o.disabled = Number(o.value) > sinir;
  }
  if (Number(gun.value) > sinir) gun.value = String(sinir);
  var iki = function (n) { return n < 10 ? '0' + n : '' + n; };
  gizli.value = (gun.value && ay.value && yil.value)
    ? yil.value + '-' + iki(Number(ay.value)) + '-' + iki(Number(gun.value)) : '';
  kap.classList.toggle('eksik', !gizli.value && !!(gun.value || ay.value || yil.value));
}

/* Hiç seçilmediyse ''; yarım seçildiyse 'eksik'; tamamsa YYYY-AA-GG. */
function tarihSeciciDurum(kimlik) {
  var gizli = $(kimlik);
  if (!gizli) return '';
  if (gizli.value) return gizli.value;
  var kap = gizli.closest('.tarih-secici');
  return kap && kap.classList.contains('eksik') ? 'eksik' : '';
}

/* ================= kurulum ================= */
function formAlanlariKur() {
  sifreKutulariniTara(document);
  if (window.MutationObserver) {
    new MutationObserver(function () { sifreKutulariniTara(document); })
      .observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener('mousedown', function (e) {
    /* Göz düğmesine basınca imleç şifre kutusundan çıkmasın (telefonda
       klavye kapanmasın). */
    if (e.target.closest && e.target.closest('.sifre-goz')) e.preventDefault();
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.sifre-goz') : null;
    if (!b) return;
    var input = b.parentNode.querySelector('input');
    if (!input) return;
    sifreGoster(input, input.type === 'password');
    input.focus();
    try { var n = input.value.length; input.setSelectionRange(n, n); } catch (x) { /* bazı türlerde yok */ }
  });
  /* Form sıfırlanınca görünen şifre yeniden gizlensin. */
  document.addEventListener('reset', function (e) {
    var liste = e.target.querySelectorAll('input[data-goz]');
    for (var i = 0; i < liste.length; i++) sifreGoster(liste[i], false);
  }, true);

  var capsBak = function (e) {
    var t = e.target;
    if (!t || !t.getAttribute || !t.getAttribute('data-goz') || !e.getModifierState) return;
    capsUyarisi(t, e.getModifierState('CapsLock'));
  };
  document.addEventListener('keydown', capsBak);
  document.addEventListener('keyup', capsBak);
  document.addEventListener('focusout', function (e) {
    if (e.target && e.target.getAttribute && e.target.getAttribute('data-goz')) capsUyarisi(e.target, false);
  });

  /* Kullanıcı düzeltmeye başlayınca kırmızı hata kalksın. */
  var duzeltiyor = function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var kap = t.closest('.tarih-secici');
    if (kap && e.type === 'change') tarihSeciciGuncelle(kap);
    var alan = t.closest('.hatali');
    if (alan) alanTemizle(alan);
  };
  document.addEventListener('input', duzeltiyor);
  document.addEventListener('change', duzeltiyor);
}
