/* Okulun dosya alanı (okul başına disk sınırı): doluluk çubuğu "3,2 GB / 5 GB",
   %80'de turuncu, %95'te kırmızı. Müdürün ana sayfasındaki kart ve yönetim
   panelinin Okullar ekranı kullanır (sunucu/bolumler/okul-disk.js). Sınıra
   okulun dosyaları sayılır: ödev teslim dosyaları, ödev ve mesaj ekleri, okul
   sayfası fotoğrafları. Veritabanı sayılmaz. */

var OKUL_DISK_DOLU = 'Okulunun dosya alanı doldu. Okul yönetimi eski dosyaları sildirebilir ya da yöneticiden alan isteyebilir.';

/* "3,2 GB", "820 MB", "0,4 MB" (sunucudaki boyutYaz ile aynı). */
function diskYaz(n) {
  var GB = 1073741824, MB = 1048576;
  n = Number(n) || 0;
  if (n >= GB) return sayiTR(Math.round(n / GB * 10) / 10) + ' GB';
  var mb = n / MB;
  return (mb >= 10 ? sayiTR(Math.round(mb)) : n > 0 ? sayiTR(Math.max(0.1, Math.round(mb * 10) / 10)) : '0') + ' MB';
}

/* Doluluk oranı (yüzde, ondalıklı) ve renk sınıfı: %80 turuncu, %95 kırmızı. */
function okulDiskOrani(d) {
  return d && d.sinir ? d.kullanilan / d.sinir * 100 : 0;
}
function okulDiskSinifi(d) {
  var oran = okulDiskOrani(d);
  return oran >= 95 ? ' dolu' : oran >= 80 ? ' az-kaldi' : '';
}

/* d: { kullanilan, sinir } (bayt). kucuk: tablo hücresi için sıkı görünüm. */
function okulDiskCubugu(d, etiket, kucuk) {
  var yuzde = Math.max(0, Math.min(100, Math.round(okulDiskOrani(d))));
  return '<div class="doluluk okul-disk' + okulDiskSinifi(d) + (kucuk ? ' sikisik' : '') + '">' +
    '<div class="doluluk-ust"><span>' + esc(etiket) + '</span><b>' + diskYaz(d.kullanilan) + ' / ' + diskYaz(d.sinir) + '</b></div>' +
    '<div class="doluluk-cubuk" role="progressbar" aria-label="' + esc(etiket) + '" aria-valuemin="0" aria-valuemax="100" ' +
    'aria-valuenow="' + yuzde + '"><i style="width:' + yuzde + '%"></i></div></div>';
}

/* "Ödev teslim dosyaları 2,1 GB · Ekler 1 GB · Okul sayfası fotoğrafları 4 MB" */
function okulDiskDagilimi(dag) {
  dag = dag || {};
  return 'Ödev teslim dosyaları ' + diskYaz(dag.teslim) + ' · Ekler ' + diskYaz(dag.ek) +
    ' · Okul sayfası fotoğrafları ' + diskYaz(dag.foto);
}

/* Müdürün ana sayfasındaki kart. */
function okulDiskKarti(d) {
  var oran = okulDiskOrani(d);
  return '<div class="kart okul-disk-kart"><h3>' + ik('kutu') + 'Okulun dosya alanı</h3>' +
    okulDiskCubugu(d, 'Kullanılan') +
    '<p class="hint">' + esc(okulDiskDagilimi(d.dagilim)) + '. Yazılar, notlar ve öbür kayıtlar bu alana sayılmaz.</p>' +
    (d.kullanilan >= d.sinir ? '<div class="msg hata" role="status">' + esc(OKUL_DISK_DOLU) + '</div>'
      : oran >= 80 ? '<div class="msg uyari">Alanın %' + Math.floor(oran) + '\'i doldu. Teslim dosyaları son teslimden 7 gün sonra, ' +
        'ekler 7 gün sonra kendiliğinden silinir; gerekirse sistem yöneticisinden alan isteyebilirsin.</div>' : '') +
    '</div>';
}
