/* Müdür: okulun özellikleri. Kullanılmayan bölüm (ödev, sınav, devamsızlık,
   etüt, servis, yemek listesi, kulüp, anket) kapatılır; o okulda kimsenin
   menüsünde görünmez, sunucu da o bölümün isteklerini reddeder. Kayıtlar
   silinmez: yeniden açılınca eskisi gibi görünür. */

SAYFALAR.ozellikler = function () {
  return api('/ozellikler').then(function (d) {
    var h = hero('ÖZELLİKLER', 'Okulunda kullanmadığın bölümleri kapat. Kapalı bölüm öğretmen, öğrenci ve velilerin menüsünde görünmez.');
    h += '<div class="kart ozellik-liste">';
    for (var i = 0; i < d.ozellikler.length; i++) {
      var o = d.ozellikler[i];
      var id = 'oz-' + o.k;
      h += '<label class="satir ozellik-satir" for="' + id + '">' +
        '<div class="buyu"><div class="ad">' + esc(o.ad) + '</div><div class="alt">' + esc(o.aciklama) + '</div></div>' +
        '<span class="anahtar"><input type="checkbox" role="switch" class="oz-kutu" id="' + id + '" data-k="' + esc(o.k) + '"' +
        (o.acik ? ' checked' : '') + '><span class="anahtar-iz" aria-hidden="true"></span></span>' +
        '<span class="oz-durum">' + (o.acik ? 'Açık' : 'Kapalı') + '</span></label>';
    }
    h += '</div>' +
      '<div class="kart"><div class="hint" style="margin-bottom:10px">Kapatınca kayıtlar silinmez; yeniden açtığında ' +
      'ödevler, notlar ve yoklamalar eskisi gibi görünür.</div>' +
      '<button class="btn" data-act="ozellik-kaydet">Kaydet</button><div id="ozMesaj" style="margin-top:10px"></div></div>';
    yaz(h);
    Array.prototype.forEach.call(document.querySelectorAll('.oz-kutu'), function (k) {
      k.addEventListener('change', function () {
        var d2 = k.closest('.ozellik-satir').querySelector('.oz-durum');
        if (d2) d2.textContent = k.checked ? 'Açık' : 'Kapalı';
      });
    });
  });
};

EYLEMLER['ozellik-kaydet'] = function (el) {
  var kapali = [];
  Array.prototype.forEach.call(document.querySelectorAll('.oz-kutu'), function (k) {
    if (!k.checked) kapali.push(k.getAttribute('data-k'));
  });
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/ozellikler', 'POST', { kapali: kapali }).then(function (d) {
    S.kapali = d.kapali || [];
    navCiz();
    dugmeBitir(el);
    mesajGoster('ozMesaj', 'iyi', d.message);
  })['catch'](function (e) {
    dugmeBitir(el);
    mesajGoster('ozMesaj', 'hata', e.message);
  });
};
