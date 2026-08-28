/* Küçük yardımcılar: HTML kaçırma, tarih/gün adları, API çağrısı. */

/* ================= yardımcılar ================= */
var $ = function (id) { return document.getElementById(id); };

function esc(s) {
  return String(s === null || s === undefined ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function api(path, method, body) {
  var opt = { method: method || 'GET', headers: {} };
  if (S.token) opt.headers['Authorization'] = 'Bearer ' + S.token;
  if (body) { opt.headers['Content-Type'] = 'application/json'; opt.body = JSON.stringify(body); }
  return fetch('/api' + path, opt).then(function (r) {
    return r.text().then(function (t) {
      var j = {};
      try { j = t ? JSON.parse(t) : {}; } catch (e) { j = {}; }
      if (!r.ok) {
        if (r.status === 401 && S.token) { cikisYap(true); }
        /* Oturum açıkken sunucu önce şifre belirlemeyi isterse (ör. yönetim
           şifreyi bu arada T.C. no'ya çevirdi) pencere açılır. */
        if (r.status === 403 && j.sifreDegismeli && S.user && path !== '/password') {
          S.user.sifreDegismeli = true;
          sifreBelirleIste();
        }
        var hata = new Error(j.error || ('Bir hata oluştu (' + r.status + ')'));
        /* Çağıran taraf ek alanlara bakabilsin (ör. "bu hesap zaten var"). */
        hata.durum = r.status;
        hata.veri = j;
        throw hata;
      }
      return j;
    });
  });
}

/* Parça dosyaların kendi düğme eylemleri: EYLEMLER[eylemAdi] = function (el, id) {}.
   islem() (25-tiklama.js) önce buraya bakar; böylece bir ekranın düğmeleri
   o ekranın dosyasında durur. */
var EYLEMLER = {};

/* Türkçe sayı: 490.161 -> "490,161", 1234.5 -> "1.234,5" */
function sayiTR(n, basamak) {
  if (n === null || n === undefined || n === '' || isNaN(Number(n))) return '';
  return Number(n).toLocaleString('tr-TR', { maximumFractionDigits: basamak === undefined ? 3 : basamak });
}

/* Giriş kutusuna yazılacak hâli: binlik ayracı yok, ondalık virgül. */
function sayiGirdi(n) {
  if (n === null || n === undefined || n === '') return '';
  return String(n).replace('.', ',');
}

/* Kutudan okunan sayı: "490,161" ya da "490.161" -> 490.161; boşsa null,
   sayı değilse NaN. */
function sayiOku(metin) {
  var s = String(metin === null || metin === undefined ? '' : metin).replace(/\s/g, '');
  if (!s) return null;
  s = s.replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN;
}

/* Tarayıcıda kişiye özel küçük tercihler (grafik gizli mi gibi).
   Gizli pencerede ya da kapalı depolamada sessizce varsayılana döner. */
function tercihOku(ad, varsayilan) {
  try { var v = localStorage.getItem('ee_' + ad); return v === null ? varsayilan : v; }
  catch (e) { return varsayilan; }
}
function tercihYaz(ad, deger) {
  try { localStorage.setItem('ee_' + ad, deger); } catch (e) { /* yoksay */ }
}
