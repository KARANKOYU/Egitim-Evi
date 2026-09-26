/* Telefon alanı: solda ülke kodu seçimi, sağda o ülkenin biçimine göre
   yazarken gruplanan numara ("532 123 45 67").

   Değer uluslararası biçimde (E.164) okunur ve saklanır: "+905321234567".
   Sayfadaki her <input type="tel"> kendiliğinden bu alana dönüşür (sonradan
   açılan pencerelerdekiler de). Okumak için telefonOku(kutu), yazmak için
   telefonYaz(kutu, "+90..."), göstermek için telefonGoster("+90..."). */

/* [kısaltma, ülke kodu, numaranın grupları] — Türkiye'den çok aranan ülkeler. */
var ULKE_KODLARI = [
  ['TR', '90', [3, 3, 2, 2]],
  ['DE', '49', [3, 4, 4]],
  ['NL', '31', [1, 4, 4]],
  ['BE', '32', [3, 2, 2, 2]],
  ['FR', '33', [1, 2, 2, 2, 2]],
  ['AT', '43', [3, 3, 4]],
  ['CH', '41', [2, 3, 2, 2]],
  ['SE', '46', [2, 3, 2, 2]],
  ['GB', '44', [4, 6]],
  ['US', '1', [3, 3, 4]],
  ['AZ', '994', [2, 3, 2, 2]],
  ['RU', '7', [3, 3, 2, 2]],
  ['UA', '380', [2, 3, 2, 2]],
  ['GE', '995', [3, 2, 2, 2]],
  ['BG', '359', [2, 3, 4]],
  ['GR', '30', [3, 3, 4]],
  ['IQ', '964', [3, 3, 4]],
  ['SY', '963', [3, 3, 3]],
  ['IR', '98', [3, 3, 4]],
  ['SA', '966', [2, 3, 4]],
  ['AE', '971', [2, 3, 4]],
  ['QA', '974', [4, 4]]
];

function ulkeBilgisi(kod) {
  for (var i = 0; i < ULKE_KODLARI.length; i++) if (ULKE_KODLARI[i][1] === kod) return ULKE_KODLARI[i];
  return ULKE_KODLARI[0];
}

/* Sunucudaki normTelefon'un aynısı: ülke kodu yoksa Türkiye numarası sayılır. */
function telefonNorm(t) {
  var s = String(t || '').replace(/[\s()\-.\/]/g, '');
  if (!s) return '';
  if (s.indexOf('00') === 0) s = '+' + s.slice(2);
  if (s.charAt(0) === '+') return s;
  if (/^0[1-9]\d*$/.test(s)) return '+90' + s.slice(1);   /* hane sayısı yanlışsa "10 haneli olmalı" denir */
  if (/^5\d{9}$/.test(s)) return '+90' + s;
  if (/^90\d{10}$/.test(s)) return '+' + s;
  return s;
}

/* "+905321234567" -> ['90', '5321234567']: en uzun eşleşen ülke kodu. */
function telefonParcala(e164) {
  var s = telefonNorm(e164);
  if (s.charAt(0) !== '+') return ['90', s.replace(/\D/g, '')];
  var rakam = s.slice(1);
  var enIyi = '';
  for (var i = 0; i < ULKE_KODLARI.length; i++) {
    var k = ULKE_KODLARI[i][1];
    if (rakam.indexOf(k) === 0 && k.length > enIyi.length) enIyi = k;
  }
  return enIyi ? [enIyi, rakam.slice(enIyi.length)] : ['', rakam];
}

function telefonGrupla(ulusal, gruplar) {
  var parca = [], i = 0;
  for (var g = 0; g < gruplar.length && i < ulusal.length; g++) {
    parca.push(ulusal.slice(i, i + gruplar[g]));
    i += gruplar[g];
  }
  if (i < ulusal.length) parca.push(ulusal.slice(i));
  return parca.join(' ');
}

/* Gösterim: "+905321234567" -> "+90 532 123 45 67". */
function telefonGoster(e164) {
  if (!e164) return '';
  var p = telefonParcala(e164);
  if (!p[0]) return '+' + p[1];
  return '+' + p[0] + ' ' + telefonGrupla(p[1], ulkeBilgisi(p[0])[2]);
}

/* Sunucudaki telefonSorunu'nun aynısı. */
function telefonSorunuTR(t) {
  var s = telefonNorm(t);
  if (!s) return 'Telefon numaranı yaz.';
  if (!/^\+[1-9]\d{6,14}$/.test(s)) return 'Telefon numarasını ülke koduyla yaz.';
  if (s.indexOf('+90') === 0 && s.length !== 13) return 'Türkiye numarası 10 haneli olmalı (5xx xxx xx xx).';
  return '';
}

/* ---------------- alan ---------------- */
function telefonAlaniKur(kutu) {
  if (!kutu || kutu.getAttribute('data-tel') === '1') return;
  kutu.setAttribute('data-tel', '1');
  var sec = document.createElement('select');
  sec.className = 'tel-ulke';
  sec.setAttribute('aria-label', 'Ülke kodu');
  sec.innerHTML = ULKE_KODLARI.map(function (u) {
    return '<option value="' + u[1] + '">' + u[0] + ' +' + u[1] + '</option>';
  }).join('');
  var kap = document.createElement('div');
  kap.className = 'tel-kutu';
  kutu.parentNode.insertBefore(kap, kutu);
  kap.appendChild(sec);
  kap.appendChild(kutu);
  kutu.setAttribute('inputmode', 'tel');
  kutu.removeAttribute('maxlength');

  var bicimle = function () {
    /* Başa "+49..." yapıştırıldıysa ülke kodu oradan seçilir. */
    if (/^\s*(\+|00)/.test(kutu.value)) { telefonYaz(kutu, kutu.value); return; }
    var rakam = kutu.value.replace(/\D/g, '');
    if (sec.value === '90' && rakam.charAt(0) === '0') rakam = rakam.slice(1);   // "0532" alışkanlığı
    kutu.value = telefonGrupla(rakam.slice(0, 15), ulkeBilgisi(sec.value)[2]);
  };
  kutu.addEventListener('input', bicimle);
  sec.addEventListener('change', function () { bicimle(); yerTutucu(); });
  var yerTutucu = function () {
    var g = ulkeBilgisi(sec.value)[2];
    kutu.placeholder = sec.value === '90' ? '532 123 45 67' : telefonGrupla('0000000000000'.slice(0, g.reduce(function (a, b) { return a + b; }, 0)), g);
  };
  telefonYaz(kutu, kutu.value);
  yerTutucu();
}

function telefonYaz(kutu, deger) {
  var sec = kutu.parentNode && kutu.parentNode.querySelector('.tel-ulke');
  if (!sec) { kutu.value = deger || ''; return; }
  var p = telefonParcala(deger || '');
  if (p[0]) sec.value = p[0];
  kutu.value = telefonGrupla(p[1], ulkeBilgisi(sec.value)[2]);
}

/* Kutudaki numara uluslararası biçimde; boşsa ''. */
function telefonOku(kutu) {
  if (!kutu) return '';
  var sec = kutu.parentNode && kutu.parentNode.querySelector('.tel-ulke');
  var rakam = kutu.value.replace(/\D/g, '');
  if (!rakam) return '';
  if (!sec) return telefonNorm(kutu.value);
  if (sec.value === '90' && rakam.charAt(0) === '0') rakam = rakam.slice(1);
  return '+' + sec.value + rakam;
}

/* Sayfadaki ve sonradan eklenen bütün telefon kutuları. */
function telefonAlanlariniKur(kok) {
  var kutular = (kok || document).querySelectorAll('input[type="tel"]:not([data-tel])');
  for (var i = 0; i < kutular.length; i++) telefonAlaniKur(kutular[i]);
}
telefonAlanlariniKur(document);
if (window.MutationObserver) {
  new MutationObserver(function (degisenler) {
    for (var i = 0; i < degisenler.length; i++) {
      if (degisenler[i].addedNodes.length) { telefonAlanlariniKur(document); return; }
    }
  }).observe(document.body, { childList: true, subtree: true });
}
