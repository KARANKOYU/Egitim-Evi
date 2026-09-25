/* Veli paneli: çocukların portalına tek tek girmeden hepsinin ödevi,
   devamsızlığı ve ilerleyişi bir arada. Her satırın başında hangi çocuğun
   olduğu yazar; üstteki şeritten tek çocuğa daraltılabilir.

   Sunucuda yeni uç yok: her çocuk için zaten var olan ?studentId=... uçları
   çağrılıp sonuçlar burada birleştirilir. 1-3 çocuk için bu ucuzdur ve veli
   yetkisi sunucuda zaten denetlenir. */

/* ---- VELİ: ortak yardımcılar ---- */
function veliCocuklar() { return S.children || []; }

