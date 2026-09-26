/* Her rolün ana sayfası: kutucuklar, sayaçlar, özetler. */

/* ================= sayfalar ================= */
var SAYFALAR = {};

/* ---- ana sayfa ---- */
SAYFALAR.ana = function () {
  var u = S.user;
  var ad = u.fullName.split(' ')[0];

  /* Yetişkin hesabının kendisi, portal dışında: portalı yoksa "+ Ekle"ye
     çağıran kart, varsa portal kartları (08c-kisilikler.js). */
  if (portalDisindaMi() || !u.role) return portalAnaSayfasi();
  /* Servisçinin ana sayfası seferleridir (19e-servis-konum.js). */
  if (u.role === 'servisci') return SAYFALAR.seferim();

  if (u.role === 'admin') {
    return api('/admin/overview').then(function (d) {
      var s = d.stats;
      yaz(hero('EĞİTİM EVİNE HOŞ GELDİNİZ', 'Merhaba ' + ad + ', sistem yöneticisi panelindesin.') +
        kutucuklar([
          { k: 'okullar', ad: 'Okullar', renk: 'lacivert', ikon: 'okul', alt: s.okul + ' okul kayıtlı · Okul aç' },
          { k: 'mudurler', ad: 'Müdürler', renk: 'yesil', ikon: 'mudur', alt: s.mudur + ' müdür' },
          { k: 'yedekler', ad: 'Yedekleme', renk: 'camgobegi', ikon: 'kutu', alt: 'Veri kopyaları' },
          { k: 'profil', ad: 'Ayarlar', renk: 'gri', ikon: 'ayar', alt: 'Yönetici hesabın' }
        ]) +
        '<div class="grid k4">' +
        stat(s.okul, 'Okul') + stat(s.mudur, 'Müdür') + stat(s.ogretmen, 'Öğretmen') +
        stat(s.ogrenci, 'Öğrenci') + stat(s.veli, 'Veli') +
        '</div>');
    });
  }

  if (u.role === 'parent') {
    return api('/parent/children').then(function (d) {
      S.children = d.children;
      /* Çocukların ödevlerini de çek ki kutucuklarda sayı ve yaklaşan liste olsun. */
      return cocuklarIcin('/progress').then(function (r) {
        var aktif = [];
        for (var i = 0; i < r.length; i++) {
          var liste = (r[i].veri.assignments || []).filter(function (a) { return a.status === 'active'; });
          for (var j = 0; j < liste.length; j++) { liste[j].cocuk = r[i].cocuk; aktif.push(liste[j]); }
        }
        aktif.sort(function (a, b) { return String(a.endAt || '').localeCompare(String(b.endAt || '')); });

        var h = hero('EĞİTİM EVİNE HOŞ GELDİNİZ', 'Merhaba ' + ad + ', çocuklarının durumu bir arada.');
        h += kutucuklar([
          { k: 'veli-odevler', ad: 'Ödevler', renk: 'turuncu', ikon: 'odev',
            alt: aktif.length ? aktif.length + ' aktif ödev' : 'Aktif ödev yok', rozet: aktif.length || '' },
          { k: 'veli-devamsizlik', ad: 'Devamsızlık', renk: 'kirmizi', ikon: 'izinli', alt: 'Derse katılım' },
          { k: 'veli-ilerleyis', ad: 'İlerleyiş', renk: 'camgobegi', ikon: 'grafik', alt: 'Ödev ve sınav durumu' },
          { k: 'mesajlar', ad: 'Mesajlar', renk: 'mavi', ikon: 'posta', alt: 'Öğretmenlerle yazışma' },
          { k: 'cocuklarim', ad: 'Çocuklarım', renk: 'mor', ikon: 'veli',
            alt: d.children.length ? d.children.length + ' öğrenci bağlı' : 'Henüz çocuk eklenmedi',
            rozet: d.children.length || '' },
          { k: 'profil', ad: 'Ayarlar', renk: 'gri', ikon: 'ayar', alt: 'Hesap bilgilerin' }
        ]);
        if (!d.children.length) {
          h += bosKutu('veli', 'Çocuğunu eklemek için Çocuklarım sayfasına git ve veli kodunu gir.');
        } else {
          h += '<h3 class="sb">Yaklaşan ödevler</h3>';
          h += aktif.length ? veliOdevListesi(aktif.slice(0, 6)) : bosKutu('onay', 'Şu an açık ödev yok.');
        }
        yaz(h);
      });
    });
  }

  if (u.role === 'student') {
    return api('/progress').then(function (d) {
      var aktif = d.assignments.filter(function (a) { return a.status === 'active'; });
      var ort = genelOrtalama(d);
      var h = hero('EĞİTİM EVİNE HOŞ GELDİNİZ', 'Merhaba ' + ad + ', bugün ne öğreneceksin?');
      if (ozellikAcik('odev')) h += seriSeridi(d.seri);
      h += kutucuklar([
        { k: 'odevler', ad: 'Ödevler', renk: 'turuncu', ikon: 'odev',
          alt: aktif.length ? aktif.length + ' aktif ödev' : 'Aktif ödev yok',
          rozet: aktif.length || '' },
        { k: 'sinavlarim', ad: 'Sınavlarım', renk: 'mavi', ikon: 'sinav',
          alt: d.examGroups.length + ' sınav grubu' },
        { k: 'ilerleyisim', ad: 'İlerleyişim', renk: 'camgobegi', ikon: 'grafik',
          alt: ort === null ? 'Not girilmedi' : 'Ortalama ' + ort },
        { k: 'profil', ad: 'Ayarlar', renk: 'gri', ikon: 'ayar', alt: 'Hesabın ve veli kodun' }
      ]);
      h += '<h3 class="sb">Yaklaşan ödevler</h3>';
      h += aktif.length ? odevListesiOgrenci(aktif) : bosKutu('onay', 'Aktif ödevin yok. Harika!');
      yaz(h);
    });
  }

  /* Müdürün ana sayfası okulun tamamına bakar. Ödev vermek, sınav açmak
     ve "kendi öğrencilerim" öğretmen işidir; müdür bunları yapabilse de
     ana ekranı onlarla dolmamalı. */
  if (u.role === 'principal') {
    /* Yalnızca sayılar gerekiyor: tek küçük istek (okulun bütün öğrenci
       listesini saymak için indirmek gerekmez). */
    return api('/school/ozet').then(function (o) {
      var bekleyen = o.bekleyen;

      var h = hero('EĞİTİM EVİNE HOŞ GELDİNİZ',
        'Merhaba ' + ad + ' — ' + u.schoolName + ' müdürü');

      h += kutucuklar([
        { k: 'ogretmenler', ad: 'Öğretmenler', renk: 'yesil', ikon: 'ogretmen',
          alt: bekleyen ? bekleyen + ' başvuru bekliyor' : o.ogretmen + ' öğretmen',
          rozet: bekleyen || '' },
        { k: 'okul-ogrenciler', ad: 'Öğrenciler', renk: 'lacivert', ikon: 'ogrenci',
          alt: o.ogrenci + ' öğrenci' },
        { k: 'siniflar', ad: 'Sınıflar', renk: 'camgobegi', ikon: 'sinif',
          alt: o.sinif + ' sınıf' },
        { k: 'program', ad: 'Ders Programı', renk: 'mavi', ikon: 'takvim',
          alt: 'Haftalık program ve ders atamaları' },
        { k: 'devamsizlik', ad: 'Devamsızlık', renk: 'turuncu', ikon: 'izinli',
          alt: 'Okul geneli yoklama özeti' },
        yetkim('aktarim.yap')
          ? { k: 'aktarim', ad: 'Excel Aktarım', renk: 'mor', ikon: 'indir',
              alt: 'Toplu öğrenci ve program' } : null,
        { k: 'profil', ad: 'Ayarlar', renk: 'gri', ikon: 'ayar',
          alt: 'Hesap bilgilerin' }
      ].filter(Boolean));

      h += '<div class="grid k4" style="margin-bottom:18px">' +
        stat(o.ogrenci, 'Öğrenci') +
        stat(o.ogretmen, 'Öğretmen') +
        stat(o.sinif, 'Sınıf') + '</div>';

      /* Okul yeni kurulduysa nereden başlayacağını söyle. */
      if (!o.sinif) {
        h += '<div class="msg bilgi">Henüz sınıf açmadın. ' +
          '<b>Sınıflar</b> sayfasından başlayıp derslerini tanımla, ' +
          'sonra öğretmen ata.</div>';
      } else if (!o.ogrenci) {
        h += '<div class="msg bilgi">Okulda kayıtlı öğrenci yok. ' +
          'Tek tek ekleyebilir ya da <b>Excel Aktarım</b> ile listeyi ' +
          'toplu yükleyebilirsin.</div>';
      }

      yaz(h);
    });
  }

  /* öğretmen */
  var odevAcik = ozellikAcik('odev');
  return Promise.all(odevAcik ? [api('/assignments/hedefler'), api('/assignments')]
    : [{ classes: [] }, { assignments: [] }]).then(function (r) {
    var siniflar = r[0].classes || [], ass = r[1].assignments;
    var aktif = ass.filter(function (a) { return a.status === 'active'; });
    var h = hero('EĞİTİM EVİNE HOŞ GELDİNİZ',
      'Merhaba ' + ad + ' — ' + (u.branch ? u.branch + ' ' : '') + ROL_AD[u.role] + ' · ' + u.schoolName);
    h += kutucuklar([
      { k: 'ogr-odevler', ad: 'Ödevler', renk: 'turuncu', ikon: 'odev',
        alt: aktif.length ? aktif.length + ' aktif ödev' : 'Aktif ödev yok',
        rozet: aktif.length || '' },
      { k: 'ogr-sinavlar', ad: 'Sınavlar', renk: 'mavi', ikon: 'sinav',
        alt: 'Sınav grupları ve notlar' },
      { k: 'yoklama', ad: 'Yoklama', renk: 'yesil', ikon: 'onay',
        alt: 'Derse katılım al' },
      { k: 'profil', ad: 'Ayarlar', renk: 'gri', ikon: 'ayar', alt: 'Hesap bilgilerin' }
    ].filter(Boolean));
    /* Sınıfsız öğrenciler kutusu sayıma girmesin. */
    var gercekSiniflar = siniflar.filter(function (c) { return !!c.id; });
    h += '<div class="grid k4" style="margin-bottom:18px">' +
      stat(gercekSiniflar.length, 'Sınıfım') + stat(aktif.length, 'Aktif ödev') +
      stat(ass.length - aktif.length, 'Sonuçlanan ödev') + '</div>';
    if (!siniflar.length) {
      h += '<div class="msg bilgi">Henüz bir dersin yok. ' +
        'Okul müdürünün seni bir derse ataması gerekiyor.</div>';
    }
    if (odevAcik) {
      h += '<h3 class="sb">Aktif ödevler</h3>';
      h += aktif.length ? odevListesiOgretmen(aktif) : bosKutu('odev', 'Aktif ödev yok. Ödevler sayfasından yeni ödev verebilirsin.');
    }
    yaz(h);
  });
};

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
