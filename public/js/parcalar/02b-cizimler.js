/* Küçük çizimler (64x64): portallar, "+ Ekle" penceresi, açılış sayfası.
   El yapımı SVG; renkler CSS'ten gelir (28-yetiskin-hesap.css, .cizim):
     c-cizgi       ana çizgi (yazı rengi)
     c-dolgu       yumuşak zemin (marka rengi açık tonu)
     c-vurgu       vurgu çizgisi (marka rengi)
     c-vurgu-dolgu vurgu dolgusu
     c-sari-dolgu  güneş sarısı dolgu
     c-tahta       yazı tahtası (turkuazın koyu tonu)
     c-tebesir     tahtadaki yazı
     c-yaprak      bitki (turkuaz) */

var CIZIMLER = {
  ogretmen:
    '<rect class="c-dolgu" x="26" y="9" width="32" height="24" rx="3"/>' +
    '<rect class="c-cizgi" x="26" y="9" width="32" height="24" rx="3"/>' +
    '<path class="c-vurgu" d="M32 17h13M32 23h20"/>' +
    '<path class="c-cizgi" d="M42 33v5"/>' +
    '<circle class="c-cizgi" cx="15" cy="27" r="5.5"/>' +
    '<path class="c-cizgi" d="M5 56v-8a10 10 0 0 1 10-10h1.5"/>' +
    '<path class="c-cizgi" d="M25 56v-8a10 10 0 0 0-2-6"/>' +
    '<path class="c-vurgu" d="M17 40l11-8 6-6"/>',
  mudur:
    '<path class="c-dolgu" d="M10 30 32 16l22 14v25H10z"/>' +
    '<path class="c-cizgi" d="M6 32 32 14l26 18"/>' +
    '<path class="c-cizgi" d="M10 29v26h44V29"/>' +
    '<path class="c-cizgi" d="M27 55V43h10v12"/>' +
    '<circle class="c-cizgi" cx="32" cy="31" r="4"/>' +
    '<path class="c-cizgi" d="M17 38h4M43 38h4"/>' +
    '<path class="c-vurgu" d="M32 14V4"/>' +
    '<path class="c-vurgu-dolgu" d="M32 4h10l-3 3.2 3 3.2H32z"/>' +
    '<path class="c-cizgi" d="M4 55h56"/>',
  veli:
    '<path class="c-dolgu" d="M12 57V43a11 11 0 0 1 22 0v14z"/>' +
    '<circle class="c-cizgi" cx="23" cy="19" r="6.5"/>' +
    '<path class="c-cizgi" d="M12 57V43a11 11 0 0 1 22 0v14"/>' +
    '<circle class="c-cizgi" cx="45" cy="31" r="4.8"/>' +
    '<path class="c-cizgi" d="M38 57v-9a7 7 0 0 1 14 0v9"/>' +
    '<path class="c-vurgu" d="M34 45c2 2.5 4.5 2.5 6 0"/>',
  ogrenci:
    '<path class="c-vurgu-dolgu" d="M19 16 32 10l13 6-13 6z"/>' +
    '<path class="c-vurgu" d="M45 16v8"/>' +
    '<circle class="c-cizgi" cx="32" cy="27" r="7"/>' +
    '<path class="c-dolgu" d="M18 57v-8a14 14 0 0 1 28 0v8z"/>' +
    '<path class="c-cizgi" d="M18 57v-8a14 14 0 0 1 28 0v8"/>' +
    '<path class="c-cizgi" d="M26 40l6 6 6-6"/>',
  'cocuk-ekle':
    '<circle class="c-cizgi" cx="24" cy="25" r="7"/>' +
    '<path class="c-dolgu" d="M12 57v-9a12 12 0 0 1 24 0v9z"/>' +
    '<path class="c-cizgi" d="M12 57v-9a12 12 0 0 1 24 0v9"/>' +
    '<circle class="c-dolgu" cx="46" cy="20" r="10"/>' +
    '<circle class="c-cizgi" cx="46" cy="20" r="10"/>' +
    '<path class="c-vurgu" d="M46 15v10M41 20h10"/>',
  /* Kişi kodu: kart üstünde üç grup (5'erli gösterim). */
  'kisi-kodu':
    '<rect class="c-dolgu" x="7" y="15" width="50" height="34" rx="5"/>' +
    '<rect class="c-cizgi" x="7" y="15" width="50" height="34" rx="5"/>' +
    '<rect class="c-vurgu" x="11" y="24" width="3.2" height="8" rx="1"/>' +
    '<rect class="c-vurgu" x="15.5" y="24" width="3.2" height="8" rx="1"/>' +
    '<rect class="c-vurgu" x="20" y="24" width="3.2" height="8" rx="1"/>' +
    '<rect class="c-vurgu" x="27.4" y="24" width="3.2" height="8" rx="1"/>' +
    '<rect class="c-vurgu" x="31.9" y="24" width="3.2" height="8" rx="1"/>' +
    '<rect class="c-vurgu" x="36.4" y="24" width="3.2" height="8" rx="1"/>' +
    '<rect class="c-vurgu" x="43.8" y="24" width="3.2" height="8" rx="1"/>' +
    '<rect class="c-vurgu" x="48.3" y="24" width="3.2" height="8" rx="1"/>' +
    '<path class="c-cizgi" d="M13 40h18"/>',
  /* Okul ve artı: okulunu açtır (Müdür). */
  'okul-ac':
    '<path class="c-dolgu" d="M8 32 26 20l18 12v22H8z"/>' +
    '<path class="c-cizgi" d="M5 34 26 19l21 15"/>' +
    '<path class="c-cizgi" d="M8 31v23h36V31"/>' +
    '<path class="c-cizgi" d="M22 54V45h8v9"/>' +
    '<circle class="c-cizgi" cx="26" cy="33" r="3.2"/>' +
    '<circle class="c-dolgu" cx="48" cy="18" r="10"/>' +
    '<circle class="c-cizgi" cx="48" cy="18" r="10"/>' +
    '<path class="c-vurgu" d="M48 13v10M43 18h10"/>' +
    '<path class="c-cizgi" d="M3 54h46"/>'
};

/* Büyük sahneler: açılış sayfası. Çizim alanı 320x200. */
CIZIMLER.sinif =
  /* pencere ve güneş */
  '<rect class="c-dolgu" x="16" y="20" width="64" height="54" rx="3"/>' +
  '<circle class="c-sari-dolgu" cx="64" cy="34" r="7"/>' +
  '<rect class="c-cizgi" x="16" y="20" width="64" height="54" rx="3"/>' +
  '<path class="c-cizgi" d="M48 20v54M16 47h64"/>' +
  /* yazı tahtası, tebeşirle yazılmış satırlar ve üçgen */
  '<rect class="c-tahta" x="122" y="18" width="176" height="88" rx="4"/>' +
  '<rect class="c-cizgi" x="122" y="18" width="176" height="88" rx="4"/>' +
  '<path class="c-tebesir" d="M138 38h44M138 52h62M138 66h36M138 80h50"/>' +
  '<path class="c-tebesir" d="M236 88l22-38 22 38z"/>' +
  '<path class="c-tebesir" d="M247 69h22"/>' +
  '<path class="c-cizgi" d="M128 110h164"/>' +
  /* öğretmen: tahtayı gösteriyor */
  '<path class="c-dolgu" d="M80 132v-36a16 16 0 0 1 32 0v36z"/>' +
  '<circle class="c-cizgi" cx="96" cy="64" r="10"/>' +
  '<path class="c-cizgi" d="M86 60c2-8 18-10 21 1"/>' +
  '<path class="c-cizgi" d="M80 132v-36a16 16 0 0 1 32 0v36"/>' +
  '<path class="c-cizgi" d="M88 132v22M104 132v22"/>' +
  '<path class="c-cizgi" d="M110 92l20-14"/>' +
  '<path class="c-vurgu" d="M128 79l24-20"/>' +
  '<path class="c-cizgi" d="M82 98l-6 26"/>' +
  /* sıralar */
  '<path class="c-cizgi" d="M24 162h68M28 162v28M88 162v28"/>' +
  '<path class="c-cizgi" d="M126 162h68M130 162v28M190 162v28"/>' +
  '<path class="c-cizgi" d="M228 162h68M232 162v28M292 162v28"/>' +
  /* öğrenciler (arkadan): biri parmak kaldırmış */
  '<path class="c-dolgu" d="M40 190v-14a18 18 0 0 1 36 0v14z"/>' +
  '<circle class="c-cizgi" cx="58" cy="144" r="11"/>' +
  '<path class="c-cizgi" d="M48 138c4-9 17-9 21 1M69 141c6 2 8 8 5 13"/>' +
  '<path class="c-cizgi" d="M40 190v-14a18 18 0 0 1 36 0v14"/>' +
  '<path class="c-dolgu" d="M142 190v-14a18 18 0 0 1 36 0v14z"/>' +
  '<circle class="c-cizgi" cx="160" cy="144" r="11"/>' +
  '<path class="c-cizgi" d="M150 140c2-8 18-9 20 0"/>' +
  '<path class="c-cizgi" d="M142 190v-14a18 18 0 0 1 36 0v14"/>' +
  '<path class="c-cizgi" d="M174 166l10-34"/>' +
  '<circle class="c-vurgu" cx="185" cy="128" r="3.5"/>' +
  '<path class="c-dolgu" d="M244 190v-14a18 18 0 0 1 36 0v14z"/>' +
  '<circle class="c-cizgi" cx="262" cy="144" r="11"/>' +
  '<path class="c-cizgi" d="M251 146c-2-12 20-16 22-2"/>' +
  '<path class="c-cizgi" d="M244 190v-14a18 18 0 0 1 36 0v14"/>' +
  /* saksıda çiçek ve zemin */
  '<path class="c-cizgi" d="M302 190l-2-14h12l-2 14"/>' +
  '<path class="c-yaprak" d="M306 176v-14M306 166c-6-2-9-8-8-13M306 168c6-2 9-8 8-14"/>' +
  '<path class="c-cizgi" d="M6 190h308"/>';

/* Çizimlerin alanı: sahneler geniş, simgeler kare. */
var CIZIM_ALANI = { sinif: '0 0 320 200' };

function cizim(ad, ek) {
  var yol = CIZIMLER[ad];
  if (!yol) return '';
  return '<svg class="cizim' + (ek ? ' ' + ek : '') + '" viewBox="' + (CIZIM_ALANI[ad] || '0 0 64 64') + '" ' +
    'aria-hidden="true" focusable="false">' + yol + '</svg>';
}
