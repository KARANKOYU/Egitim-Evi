/* Tarih seçici (ajanda): tarayıcının kendi tarih kutusu dilini ve görünümünü
   değiştirmez (bazı tarayıcılarda "mm/dd/yyyy" çıkar). Bunun yerine Türkçe,
   Pazartesiyle başlayan bir ay takvimi açılır. Her günün üstünde o güne
   düşenler işaretlidir: tatil, okul etkinliği, öğretmenin o gün biten öteki
   ödevleri; altta seçilen günün ajandası (kaç ders var, hangi ödev bitiyor)
   yazar. Veri takvim ucundan gelir (/api/takvim?yil&ay), ay ay önbelleğe alınır.

   Tarih K12net'teki gibi "08.09.2025" yazar, yanında takvim düğmesi durur;
   saat ayrı bir açılır listedir (saatAlani).

   Kullanım: tarihAlani('mBit', '2026-10-02', { min: 'mBas' }) HTML döndürür;
   değer her zaman gizli <input id="mBit">'te yyyy-aa-gg olarak durur, seçilince
   o kutuda "change" olayı çıkar. Klavye: oklar gün/hafta, PageUp/PageDown ay,
   Enter seçer, Esc kapatır. */

var TS = { hedef: null, ay: '', odak: '', veri: {}, yukleniyor: {} };
var TS_GUN_KISA = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

function tsIki(n) { return (n < 10 ? '0' : '') + n; }
function tsIso(d) { return d.getFullYear() + '-' + tsIki(d.getMonth() + 1) + '-' + tsIki(d.getDate()); }
function tsTarih(iso) { var p = String(iso).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function tsGunEkle(iso, n) { var d = tsTarih(iso); d.setDate(d.getDate() + n); return tsIso(d); }
function tsBugun() { return tsIso(new Date()); }

/* "2025-09-08" -> "08.09.2025" (yanında gün adı ayrıca, soluk) */
function tsKisa(iso) { var p = String(iso).split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
function tsDugmeYazi(iso) {
  return iso ? '<span class="tarih-yazi">' + tsKisa(iso) + '</span><span class="tarih-gun">' + gunAdi(iso) + '</span>'
    : '<span class="tarih-yazi bos">gg.aa.yyyy</span>';
}

function tarihAlani(id, deger, sec) {
  sec = sec || {};
  return '<div class="tarih-alan" data-tarih-alan="' + esc(id) + '"' + (sec.min ? ' data-min="' + esc(sec.min) + '"' : '') + '>' +
    '<input type="hidden" id="' + esc(id) + '" value="' + esc(deger || '') + '">' +
    '<button type="button" class="tarih-dugme" id="' + esc(id) + 'Dugme" data-act="tarih-ac" data-id="' + esc(id) + '" ' +
    'aria-haspopup="dialog" aria-expanded="false">' + tsDugmeYazi(deger) +
    '<span class="tarih-simge" aria-hidden="true">' + ik('takvim') + '</span></button></div>';
}

/* Saat: yarım saatlik açılır liste (00:00 ... 23:30). Listede olmayan eski
   bir değer (ör. 12:10) de seçenek olarak korunur. */
function saatAlani(id, deger) {
  var h = '<select id="' + esc(id) + '" class="saat-sec">', var_ = false;
  for (var dk = 0; dk < 24 * 60; dk += 30) {
    var s = tsIki(Math.floor(dk / 60)) + ':' + tsIki(dk % 60);
    if (s === deger) var_ = true;
    h += '<option value="' + s + '"' + (s === deger ? ' selected' : '') + '>' + s + '</option>';
  }
  if (deger && !var_) h = h.replace('<select id="' + esc(id) + '" class="saat-sec">',
    '<select id="' + esc(id) + '" class="saat-sec"><option value="' + esc(deger) + '" selected>' + esc(deger) + '</option>');
  return h + '</select>';
}

/* Şimdiki saatin bir sonraki yarım saati: 18:54 -> 19:00 */
function tsSonrakiYarim() {
  var d = new Date(), dk = d.getHours() * 60 + d.getMinutes();
  dk = Math.min(23 * 60 + 30, Math.ceil(dk / 30) * 30);
  return tsIki(Math.floor(dk / 60)) + ':' + tsIki(dk % 60);
}

/* Alanın en erken seçilebilecek günü: data-min başka bir tarih alanının id'si
   ("son teslim, başlangıçtan önce olamaz") ya da yyyy-aa-gg. */
function tsEnErken(kap) {
  var m = kap && kap.getAttribute('data-min');
  if (!m) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(m)) return m;
  return ($(m) && $(m).value) || '';
}

function tsAyVerisi(ay) {
  if (TS.veri[ay] || TS.yukleniyor[ay]) return;
  TS.yukleniyor[ay] = true;
  var p = ay.split('-');
  api('/takvim?yil=' + (+p[0]) + '&ay=' + (+p[1])).then(function (d) {
    var gunler = {};
    (d.gunler || []).forEach(function (g) { gunler[g.tarih] = g; });
    TS.veri[ay] = gunler;
    if (TS.hedef && TS.ay === ay) tsCiz();
  })['catch'](function () { TS.veri[ay] = {}; })
    .then(function () { TS.yukleniyor[ay] = false; });
}

