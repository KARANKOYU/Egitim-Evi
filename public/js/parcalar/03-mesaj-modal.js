/* Ekrana mesaj basma ve açılır pencere (modal). */

/* ================= mesaj / modal ================= */
function mesajGoster(hedef, tur, metin) {
  var el = $(hedef);
  if (!el) return;
  el.innerHTML = '<div class="msg ' + tur + '">' + esc(metin) + '</div>';
  if (tur === 'iyi') setTimeout(function () { if (el) el.innerHTML = ''; }, 6000);
}

/* İşlem sonrası sayfanın en üstüne kısa mesaj. mesajGoster('sayfa') bütün
   sayfanın yerine yazıyordu; bu, çizilmiş sayfanın üstüne ekler. */
function sayfaMesaji(tur, metin) {
  var s = $('sayfa');
  if (!s) return;
  var eski = s.querySelector('.sayfa-mesaj');
  if (eski) eski.parentNode.removeChild(eski);
  s.insertAdjacentHTML('afterbegin', '<div class="msg ' + tur + ' sayfa-mesaj" role="status">' + esc(metin) + '</div>');
  if (tur === 'iyi') {
    setTimeout(function () {
      var m = s.querySelector('.sayfa-mesaj');
      if (m) m.parentNode.removeChild(m);
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

function modalKapat() { $('modalKok').innerHTML = ''; }

function modalAc(baslik, govde, altHtml) {
  $('modalKok').innerHTML =
    '<div class="perde" data-perde="1"><div class="modal">' +
    '<h3>' + esc(baslik) + '</h3>' +
    '<div id="modalGovde">' + govde + '</div>' +
    '<div class="modal-alt">' + (altHtml || '<button class="btn gri" data-act="modal-kapat">Kapat</button>') + '</div>' +
    '</div></div>';
}
