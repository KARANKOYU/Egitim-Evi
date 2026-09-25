/* Veli paneli: çocukların portalına tek tek girmeden hepsinin ödevi,
   devamsızlığı ve ilerleyişi bir arada. Her satırın başında hangi çocuğun
   olduğu yazar; üstteki şeritten tek çocuğa daraltılabilir.

   Sunucuda yeni uç yok: her çocuk için zaten var olan ?studentId=... uçları
   çağrılıp sonuçlar burada birleştirilir. 1-3 çocuk için bu ucuzdur ve veli
   yetkisi sunucuda zaten denetlenir. */

/* ---- VELİ: ortak yardımcılar ---- */
function veliCocuklar() { return S.children || []; }

/* Şu an seçili çocuk (şeritten). Hepsi seçiliyse null. */
function veliSeciliCocuk() {
  var c = veliCocuklar();
  /* Bildirimden gelindiyse o çocuk seçilir (07-yonlendirme.js). */
  if (S.adresCocuk) {
    for (var j = 0; j < c.length; j++) if (c[j].id === S.adresCocuk) S.veliCocuk = S.adresCocuk;
    S.adresCocuk = null;
  }
  if (!S.veliCocuk) return null;
  for (var i = 0; i < c.length; i++) if (c[i].id === S.veliCocuk) return c[i];
  S.veliCocuk = null;
  return null;
}

function cocukRozet(c) {
  return '<span class="cocuk-rozet">' + esc(c.fullName.split(' ')[0]) + '</span>';
}

/* Üst şerit: Hepsi · Zeynep · Burak */
function veliCocukSeridi() {
  var c = veliCocuklar();
  if (c.length < 2) return '';
  var h = '<div class="cocuk-seridi">' +
    '<button class="sekme kucuk' + (S.veliCocuk ? '' : ' secili') + '" data-act="veli-cocuk" data-id="">Hepsi</button>';
  for (var i = 0; i < c.length; i++) {
    h += '<button class="sekme kucuk' + (S.veliCocuk === c[i].id ? ' secili' : '') +
      '" data-act="veli-cocuk" data-id="' + esc(c[i].id) + '">' + esc(c[i].fullName) + '</button>';
  }
  return h + '</div>';
}

/* Her çocuk için aynı ucu çağırır: [{ cocuk, veri }] */
function cocuklarIcin(yol) {
  var secili = veliSeciliCocuk();
  var liste = secili ? [secili] : veliCocuklar();
  return Promise.all(liste.map(function (c) {
    return api(yol + (yol.indexOf('?') >= 0 ? '&' : '?') + 'studentId=' + encodeURIComponent(c.id))
      .then(function (d) { return { cocuk: c, veri: d }; });
  }));
}

function veliCocukYok(baslik) {
  yaz(hero(baslik, '') + bosKutu('veli',
    'Henüz çocuk eklenmedi. Çocuklarım sayfasından veli koduyla ekleyebilirsin.'));
  return Promise.resolve();
}

