/* Her rolün ana sayfası: kutucuklar, sayaçlar, özetler. */

/* ================= sayfalar ================= */
var SAYFALAR = {};

function stat(n, l) {
  return '<div class="stat"><div class="n">' + esc(n) + '</div><div class="l">' + esc(l) + '</div></div>';
}

function genelOrtalama(d) {
  var t = 0, n = 0;
  for (var i = 0; i < d.examGroups.length; i++) {
    if (d.examGroups[i].average !== null) { t += d.examGroups[i].average; n++; }
  }
  return n ? Math.round(t / n * 10) / 10 : null;
}
