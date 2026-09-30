/* Ekrana mesaj basma ve açılır pencere (modal). */

/* ================= mesaj / modal ================= */
function mesajGoster(hedef, tur, metin) {
  var el = $(hedef);
  if (!el) return;
  el.innerHTML = '<div class="msg ' + tur + '">' + esc(metin) + '</div>';
  /* Yalnız kendi yazdığı iletiyi siler: o arada aynı yere yazılan yeni ileti
     (hata, yeni şifre) kalır. */
  var yazilan = el.firstChild;
  if (tur === 'iyi') setTimeout(function () { if (yazilan.parentNode === el) el.removeChild(yazilan); }, 6000);
}

/* İşlem sonrası sayfanın en üstüne kısa mesaj. mesajGoster('sayfa') bütün
   sayfanın yerine yazıyordu; bu, çizilmiş sayfanın üstüne ekler. */
function sayfaMesaji(tur, metin) {
  var s = $('sayfa');
  if (!s) return;
  var eski = s.querySelector('.sayfa-mesaj');
  if (eski) eski.parentNode.removeChild(eski);
  s.insertAdjacentHTML('afterbegin', '<div class="msg ' + tur + ' sayfa-mesaj" role="status">' + esc(metin) + '</div>');
  var yazilan = s.firstChild;   // yalnız bu ileti silinir, sonradan yazılan kalır
  if (tur === 'iyi') {
    setTimeout(function () {
      if (yazilan.parentNode) yazilan.parentNode.removeChild(yazilan);
    }, 6000);
  }
}

/* Oturum anahtarini adres satirina koyamayiz: tarayici gecmisine ve sunucu
   gunlugune duser. Dosyayi baslikla alip yerel baglantiya cevirip indiriyoruz. */
function dosyaIndir(yol, ad) {
  return fetch(yol, { headers: { 'Authorization': 'Bearer ' + S.token } })
    .then(function (r) {
      if (r.ok) return r.blob();
      return r.text().then(function (t) {
        var m = 'İndirilemedi (' + r.status + ')';
        try { m = JSON.parse(t).error || m; } catch (e) { /* düz metin geldi */ }
        throw new Error(m);
      });
    })
    .then(function (blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = ad;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    });
}

/* Bir kez gösterilen bilgiler (şifre listesi, yeni hesabın şifresi) kaybolmasın.
   Ekran, bilgi açıkken buraya bir kayıt bırakır: { sor: işlev, sayfada: doğru/yanlış,
   temizle: işlev }. sor() boş metin dönerse bilgi artık güvende (indirildi, iletildi).
   sayfada: sayfa değişince bilgi kaybolur mu (geri tuşu, menü); değilse yalnız çıkış,
   yenileme ve sekmeyi kapatma sorar. temizle(): ayrılınca bellekten silme. */
var TEK_SEFER = {};

function tekSeferSor(tur) {
  for (var k in TEK_SEFER) {
    if (!TEK_SEFER.hasOwnProperty(k)) continue;
    var t = TEK_SEFER[k];
    if (tur === 'sayfa' && !t.sayfada) continue;
    var soru = t.sor();
    if (soru) return soru;
  }
  return '';
}

/* Ayrılmak serbestse ya da kişi onaylarsa true; ayrılınca kayıtlar temizlenir. */
function tekSeferAyrilabilir(tur) {
  var soru = tekSeferSor(tur);
  if (soru && !confirm(soru)) return false;
  for (var k in TEK_SEFER) {
    if (!TEK_SEFER.hasOwnProperty(k)) continue;
    if (tur === 'sayfa' && !TEK_SEFER[k].sayfada) continue;
    if (TEK_SEFER[k].temizle) TEK_SEFER[k].temizle();
    delete TEK_SEFER[k];
  }
  return true;
}

function modalKapat() { $('modalKok').innerHTML = ''; }

function modalAc(baslik, govde, altHtml) {
  $('modalKok').innerHTML =
    '<div class="perde" data-perde="1"><div class="modal">' +
    '<h3>' + esc(baslik) + '</h3>' +
    '<div id="modalGovde">' + govde + '</div>' +
    '<div class="modal-alt">' + (altHtml || '<button class="btn gri" data-act="modal-kapat">Kapat</button>') + '</div>' +
    '</div></div>';
}
