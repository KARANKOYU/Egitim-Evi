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

