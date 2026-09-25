/* Öğrenci ve veli görünümleri: ilerleyiş (ödev ve sınav grafikleri). */

/* ---- ÖĞRENCİ / VELİ görünümleri ---- */
function hedefOgrenci() {
  return S.viewStudentId ? '?studentId=' + encodeURIComponent(S.viewStudentId) : '';
}
function kimIcin() { return S.viewStudentId ? S.viewStudentName : 'Senin'; }

SAYFALAR.ilerleyisim = function () {
  return api('/progress' + hedefOgrenci()).then(function (d) {
    var h = hero('İLERLEYİŞ', S.viewStudentId ? S.viewStudentName + ' adına görüntülüyorsun.' : 'Ödev ve sınav durumun.');
    h += ilerleyisKartlari(d);
    yaz(h);
    ilerleyisGrafikleriniYukle([d.student.id]);
  });
};

/* İlerleyiş kartları: ödev grafiği, sınav grafiği, sınavlar ve grup
   ortalamaları. Öğrenci sayfası ve veli paneli aynı çizimi kullanır.
   Sınav grafiği ayrı istekle gelir: çizimden sonra ilerleyisGrafikleriniYukle(). */
function ilerleyisKartlari(d) {
  document.body.classList.toggle('odev-grafik-kapali', tercihOku('odev_grafik_kapali', '0') === '1');
  var gorunum = tercihOku('odev_grafik_gorunum', 'sonuc') === 'ders' ? 'ders' : 'sonuc';

  var h = '<div class="kart odev-grafik" data-gorunum="' + gorunum + '">' +
    '<div class="grafik-bas"><h3>Ödevler</h3>' +
    '<div class="sekme-satir">' +
    '<button class="sekme kucuk' + (gorunum === 'sonuc' ? ' secili' : '') + '" data-act="odev-grafik-sekme" data-val="sonuc">Sonuçlara göre</button>' +
    '<button class="sekme kucuk' + (gorunum === 'ders' ? ' secili' : '') + '" data-act="odev-grafik-sekme" data-val="ders">Derslere göre</button>' +
    '<button class="sekme kucuk gizle-dugme" data-act="odev-grafik-gizle">' +
    '<span class="gizle-yazi">Grafiği gizle</span><span class="goster-yazi">Grafiği göster</span></button>' +
    '</div></div><div class="g-govde">';

  /* Sonuçlara göre: Yaptı, Geç yaptı, Eksik ... Belirsiz sütunları */
  h += '<div class="g-sonuc">' + (d.assignments.length
    ? odevSonucGrafigi(d.assignments)
    : '<div style="color:var(--soluk)">Henüz ödev yok.</div>') + '</div>';

  /* Derslere göre: her ders bir yığılmış sütun, üstünde başarı oranı */
  h += '<div class="g-ders">';
  if (!d.subjects.length) h += '<div style="color:var(--soluk)">Henüz sonuçlanmış ödev yok.</div>';
  else {
    var enBuyuk = 1;
    for (var i = 0; i < d.subjects.length; i++) if (d.subjects[i].toplam > enBuyuk) enBuyuk = d.subjects[i].toplam;
    h += '<div class="grafik">';
    for (var j = 0; j < d.subjects.length; j++) {
      var s = d.subjects[j];
      var yuk = 145 * (s.toplam / enBuyuk);
      h += '<div class="sutun-sar" title="' + esc(s.subject) + '">' +
        '<div class="sutun-us">' + (s.oran === null ? '-' : '%' + s.oran) + '</div>' +
        '<div class="sutun-yigin" style="height:' + yuk + 'px">' +
        cubuk('yapti', s.yapti, s.toplam) + cubuk('gec', s.gec, s.toplam) + cubuk('eksik', s.eksik, s.toplam) +
        cubuk('yapmadi', s.yapmadi, s.toplam) + cubuk('izinli', s.izinli, s.toplam) +
        cubuk('gelmedi', s.gelmedi, s.toplam) +
        '</div><div class="sutun-ad">' + esc(kisalt(s.subject)) + '</div></div>';
    }
    h += '</div><div class="gosterge">' +
      '<span><i style="background:var(--yesil)"></i>Yaptı</span>' +
      '<span><i style="background:var(--mavi)"></i>Geç yaptı</span>' +
      '<span><i style="background:var(--turuncu)"></i>Eksik</span>' +
      '<span><i style="background:var(--kirmizi)"></i>Yapmadı</span>' +
      '<span><i style="background:var(--soluk)"></i>Gelmedi (izinli)</span>' +
      '<span><i style="background:var(--bordo)"></i>Gelmedi (izinsiz)</span></div>' +
      '<div class="hint" style="margin-top:6px">Oran: yaptı tam, geç ve eksik yarım sayılır; izinli gelmemek oranı düşürmez.</div>';
  }
  h += '</div></div></div>';

  h += sinavGrafigiKutusu(d.student.id);
  h += sinavSonuclari(d);
  return h;
}

/* Grupsuz sınavlar ve grup ortalamaları. */
function sinavSonuclari(d) {
  return tekSinavKarti(d) + grupOrtalamaKarti(d);
}

/* Gruba bağlı olmayan sınavlar: ana değer sağda, öteki değerler çip olarak. */
function tekSinavKarti(d) {
  var h = '';
  var tek = d.exams || [];
  if (tek.length) {
    h += '<div class="kart"><h3>Sınavlar</h3>';
    for (var i = 0; i < tek.length; i++) {
      var e = tek[i];
      var ana = e.olcumler.filter(function (o) { return o.ana; })[0] || e.olcumler[0];
      var digerleri = e.olcumler.filter(function (o) { return o !== ana && o.deger !== null && o.deger !== undefined; });
      h += '<div class="satir" data-ara="' + esc(e.name + ' ' + e.subject) + '">' +
        '<div class="buyu"><div class="ad">' + esc(e.name) + '</div>' +
        '<div class="alt">' + tarih(e.tarih) + ' · ' + esc(e.subject) + (e.teacherName ? ' · ' + esc(e.teacherName) : '') + '</div>' +
        (digerleri.length ? '<div class="olcum-cipleri" style="margin-top:6px">' + digerleri.map(function (o) {
          return '<span class="olcum-cip"><b>' + esc(o.ad) + '</b> ' + sayiTR(o.deger) + '</span>';
        }).join('') + '</div>' : '') +
        '</div>' +
        '<span class="etiket ' + (ana.deger === null || ana.deger === undefined ? 'gri' : 'mavi') + '" title="' + esc(ana.ad) + '">' +
        (ana.deger === null || ana.deger === undefined ? 'Değer yok' : esc(ana.ad) + ' ' + sayiTR(ana.deger)) + '</span></div>';
    }
    h += '</div>';
  }
  return h;
}

function grupOrtalamaKarti(d) {
  var h = '<div class="kart"><h3>Sınav grubu ortalamaları</h3>';
  if (!d.examGroups.length) h += '<div style="color:var(--soluk)">Henüz gruplu sınav yok.</div>';
  else {
    for (var k = 0; k < d.examGroups.length; k++) {
      var g = d.examGroups[k];
      h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(g.name) + '</div>' +
        '<div class="alt">' + esc(g.subject) + ' · ' + esc(g.teacherName) + ' · 100 üzerinden</div>' +
        '<div class="cubuk"><i style="width:' + (g.average === null ? 0 : Math.max(0, Math.min(100, g.average))) + '%"></i></div></div>' +
        '<span class="etiket ' + (g.average === null ? 'gri' : g.average >= 50 ? 'yesil' : 'kirmizi') + '">' +
        (g.average === null ? 'Değer yok' : sayiTR(g.average, 2)) + '</span></div>';
    }
  }
  return h + '</div>';
}

/* Sayfa çizildikten sonra her öğrencinin sınav grafiğini getirir. */
function ilerleyisGrafikleriniYukle(ogrenciIdler) {
  odevGrafikleriniCiz();
  for (var i = 0; i < ogrenciIdler.length; i++) sinavGrafigiYukle(ogrenciIdler[i]);
}

function cubuk(sinif, deger, toplam) {
  if (!deger) return '';
  return '<i class="' + sinif + '" style="height:' + (deger / toplam * 100) + '%"></i>';
}
function kisalt(s) {
  if (s.length <= 13) return s;
  return s.split(' ')[0];
}
