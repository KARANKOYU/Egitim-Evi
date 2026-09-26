/* Sol menü: role göre bölümler. */

/* ================= okulun kapattığı bölümler =================
   Müdür Özellikler sayfasından kapatır; sunucu da reddeder. Sayfa -> özellik. */
var SAYFA_OZELLIK = {
  'ogr-odevler': 'odev', odevler: 'odev', 'ders-odevleri': 'odev', 'veli-odevler': 'odev',
  'ogr-sinavlar': 'sinav', sinavlarim: 'sinav',
  yoklama: 'devamsizlik', devamsizlik: 'devamsizlik', devamsizligim: 'devamsizlik', 'veli-devamsizlik': 'devamsizlik',
  etutler: 'etut', etutlerim: 'etut', 'etut-yoklama': 'etut',
  servis: 'servis', seferim: 'servis',
  yemek: 'yemek', kulupler: 'kulup', anketler: 'anket'
};
function ozellikAcik(k) { return !S.kapali || S.kapali.indexOf(k) < 0; }
function sayfaAcik(sayfa) { var o = SAYFA_OZELLIK[sayfa]; return !o || ozellikAcik(o); }

/* Kapalı bölümleri atar; altında hiçbir bağlantı kalmayan başlık ve ayraç da gider. */
function menuSuz(liste) {
  var l = liste.filter(function (n) { return !n.k || sayfaAcik(n.k); });
  l = l.filter(function (n, i) {
    if (!n.baslik) return true;
    for (var j = i + 1; j < l.length; j++) { if (l[j].k) return true; if (l[j].ayrac || l[j].baslik) return false; }
    return false;
  });
  return l.filter(function (n, i) {
    if (!n.ayrac) return true;
    for (var j = i + 1; j < l.length; j++) { if (l[j].k || l[j].baslik) return true; if (l[j].ayrac) return false; }
    return false;
  });
}

/* ================= menü ================= */
/* Öğretmen ya da müdür aynı zamanda veliyse (çocuğu bağlıysa) menüsüne veli bölümü eklenir. */
function veliBolumu() {
  if (!S.children || !S.children.length) return [];
  return [
    { ayrac: 1 },
    { baslik: 'Velisi olduğum' },
    { k: 'cocuklarim', g: 'veli', ad: 'Çocuklarım' },
    { k: 'veli-odevler', g: 'odev', ad: 'Ödevleri' },
    { k: 'veli-devamsizlik', g: 'izinli', ad: 'Devamsızlığı' },
    { k: 'veli-ilerleyis', g: 'grafik', ad: 'İlerleyişi' }
  ].concat(S.user.role === 'teacher' && !yetkim('servis.yonet') ? [{ k: 'servis', g: 'servis', ad: 'Servisi' }] : []);
}

function navTanim() {
  var u = S.user;
  if (!u) return [];
  /* Öğrenci portalını veli, müdür ve öğretmen açabilir; geri dönüş
     hedefi rolüne göre değişir. */
  if (S.viewStudentId && u.role !== 'student') {
    var geriAd = u.role === 'parent' ? 'Çocuk Listesi' : 'Öğrenci Listesi';
    return [
      { k: 'ana', g: 'ev', ad: 'Ana Sayfa' },
      { k: 'geri-veli', g: 'geri', ad: geriAd },
      { ayrac: 1 },
      { baslik: S.viewStudentName },
      { k: 'programim', g: 'takvim', ad: 'Ders Programı' },
      { k: 'takvim', g: 'takvim', ad: 'Takvimi' },
      { k: 'ilerleyisim', g: 'grafik', ad: 'İlerleyişi' },
      { k: 'odevler', g: 'odev', ad: 'Ödevleri' },
      { k: 'sinavlarim', g: 'sinav', ad: 'Sınavları' },
      { k: 'devamsizligim', g: 'izinli', ad: 'Devamsızlığı' }
    ];
  }
  /* Yetişkin hesabının kendisi, portal dışında (rolsüz ya da henüz portal
     seçmemiş): yalnızca başlangıç (Ayarlar menünün altında zaten var). Portallar
     menünün başında (portalMenusu, 08c-kisilikler.js). */
  if (portalDisindaMi() || !u.role) return [{ k: 'ana', g: 'ev', ad: 'Başlangıç' }, { k: 'hatirlaticilar', g: 'bildirim', ad: 'Hatırlatıcılar' }];
  if (u.role === 'servisci') {
    return [
      { k: 'ana', g: 'servis', ad: 'Seferlerim' },
      { k: 'mesajlar', g: 'posta', ad: 'Mesajlar' },
      { k: 'takvim', g: 'takvim', ad: 'Takvim' },
      { k: 'hatirlaticilar', g: 'bildirim', ad: 'Hatırlatıcılar' }
    ];
  }
  if (u.role === 'student') {
    return [
      { k: 'ana', g: 'ev', ad: 'Ana Sayfa' },
      { k: 'mesajlar', g: 'posta', ad: 'Mesajlar' },
      { k: 'anketler', g: 'anket', ad: 'Anketler' },
      { k: 'takvim', g: 'takvim', ad: 'Takvim' },
      { k: 'hatirlaticilar', g: 'bildirim', ad: 'Hatırlatıcılar' },
      { k: 'devamsizligim', g: 'izinli', ad: 'Devamsızlığım' },
      { k: 'programim', g: 'takvim', ad: 'Ders Programı' },
      { k: 'ilerleyisim', g: 'grafik', ad: 'İlerleyişim' },
      { k: 'odevler', g: 'odev', ad: 'Ödevler' },
      { k: 'sinavlarim', g: 'sinav', ad: 'Sınavlarım' },
      { k: 'etutlerim', g: 'saat', ad: 'Etütlerim' },
      { ayrac: 1 },
      { k: 'yemek', g: 'yemek', ad: 'Yemek Listesi' },
      { k: 'servis', g: 'servis', ad: 'Servisim' },
      { k: 'kulupler', g: 'kulup', ad: 'Kulüpler' }
    ];
  }
  if (u.role === 'parent') {
    return [
      { k: 'ana', g: 'ev', ad: 'Ana Sayfa' },
      { k: 'mesajlar', g: 'posta', ad: 'Mesajlar' },
      { k: 'anketler', g: 'anket', ad: 'Anketler' },
      { k: 'takvim', g: 'takvim', ad: 'Takvim' },
      { k: 'hatirlaticilar', g: 'bildirim', ad: 'Hatırlatıcılar' },
      { k: 'veli-odevler', g: 'odev', ad: 'Ödevler' },
      { k: 'veli-devamsizlik', g: 'izinli', ad: 'Devamsızlık' },
      { k: 'veli-ilerleyis', g: 'grafik', ad: 'İlerleyiş' },
      { k: 'etutlerim', g: 'saat', ad: 'Etütler' },
      { k: 'yemek', g: 'yemek', ad: 'Yemek Listesi' },
      { k: 'servis', g: 'servis', ad: 'Servis' },
      { k: 'aile', g: 'telefon', ad: 'Çocuğumun telefonu' },
      { k: 'kulupler', g: 'kulup', ad: 'Kulüpler' },
      { ayrac: 1 },
      { k: 'cocuklarim', g: 'veli', ad: 'Çocuklarım' }
    ];
  }
  if (u.role === 'teacher') {
    /* Ödev, sınav ve yoklama bölümleri okulun Öğretmen rolündeki yetkilere
       bağlı: müdür bir yetkiyi kapatırsa o bölüm menüden de kalkar. */
    var m = [
      { k: 'ana', g: 'ev', ad: 'Ana Sayfa' },
      { k: 'mesajlar', g: 'posta', ad: 'Mesajlar' },
      { k: 'anketler', g: 'anket', ad: 'Anketler' },
      { k: 'takvim', g: 'takvim', ad: 'Takvim' },
      { k: 'hatirlaticilar', g: 'bildirim', ad: 'Hatırlatıcılar' },
      { k: 'programim', g: 'takvim', ad: 'Ders Programım' }
    ];
    if (yetkim('odev.ver') || yetkim('odev.sonuclandir')) m.push({ k: 'ogr-odevler', g: 'odev', ad: 'Ödevler' });
    if (yetkim('sinav.olustur') || yetkim('sinav.not-gir')) m.push({ k: 'ogr-sinavlar', g: 'sinav', ad: 'Sınavlar' });
    if (yetkim('devamsizlik.al')) m.push({ k: 'yoklama', g: 'onay', ad: 'Yoklama' });
    if (yetkim('ogretmen.sonuclar')) m.push({ k: 'siniflarim', g: 'sinif', ad: 'Sınıflarım' });
    m.push({ k: 'etutler', g: 'saat', ad: 'Etütler' },
      { k: 'yemek', g: 'yemek', ad: 'Yemek Listesi' },
      { k: 'kulupler', g: 'kulup', ad: 'Kulüpler' });
    /* Müdürün verdiği role göre ek bölümler açılır. */
    var ek = [];
    if (yetkim('sinif.yonet') || yetkim('ders.yonet')) ek.push({ k: 'siniflar', g: 'sinif', ad: 'Sınıflar' });
    if (yetkim('program.duzenle')) ek.push({ k: 'program', g: 'takvim', ad: 'Ders Programı' });
    if (yetkim('ogrenci.duzenle') || yetkim('ogrenci.hesap-ac') || yetkim('ogrenci.portal')) {
      ek.push({ k: 'okul-ogrenciler', g: 'ogrenci', ad: 'Okul Öğrencileri' });
    }
    if (yetkim('yil.yonet')) ek.push({ k: 'egitim-yili', g: 'takvim', ad: 'Eğitim Yılı' });
    if (yetkim('ogretmen.onayla') || yetkim('ogretmen.duzenle')) {
      ek.push({ k: 'ogretmenler', g: 'ogretmen', ad: 'Öğretmenler' });
    }
    if (yetkim('rol.yonet')) ek.push({ k: 'roller', g: 'kilit', ad: 'Roller ve Yetkiler' });
    if (yetkim('aktarim.yap')) ek.push({ k: 'aktarim', g: 'indir', ad: 'Excel Aktarım' });
    if (yetkim('devamsizlik.gor')) ek.push({ k: 'devamsizlik', g: 'izinli', ad: 'Devamsızlık' });
    if (yetkim('islem-kaydi.gor')) ek.push({ k: 'islem-kaydi', g: 'belge', ad: 'İşlem Kaydı' });
    if (yetkim('servis.yonet')) ek.push({ k: 'servis', g: 'servis', ad: 'Servisler' });
    if (yetkim('okul.sayfa')) ek.push({ k: 'okul-sayfasi', g: 'okul', ad: 'Okul Sayfası' });
    if (yetkim('okul.konum')) ek.push({ k: 'okul-ayarlari', g: 'harita', ad: 'Okulun Konumu' });

    if (ek.length) {
      m.push({ ayrac: 1 });
      m.push({ baslik: u.customRoleName || 'Ek Yetkiler' });
      m = m.concat(ek);
    }
    return m.concat(veliBolumu());
  }
  if (u.role === 'principal') {
    return [
      { k: 'ana', g: 'ev', ad: 'Ana Sayfa' },
      { k: 'mesajlar', g: 'posta', ad: 'Mesajlar' },
      { k: 'anketler', g: 'anket', ad: 'Anketler' },
      { k: 'takvim', g: 'takvim', ad: 'Takvim' },
      { k: 'hatirlaticilar', g: 'bildirim', ad: 'Hatırlatıcılar' },
      { k: 'ogretmenler', g: 'ogretmen', ad: 'Öğretmenler' },
      { k: 'okul-ogrenciler', g: 'ogrenci', ad: 'Öğrenciler' },
      { ayrac: 1 },
      { baslik: 'Okul Düzeni' },
      { k: 'siniflar', g: 'sinif', ad: 'Sınıflar' },
      { k: 'program', g: 'takvim', ad: 'Ders Programı' },
      { k: 'roller', g: 'kilit', ad: 'Roller ve Yetkiler' },
      { k: 'egitim-yili', g: 'takvim', ad: 'Eğitim Yılı' },
      { k: 'ozellikler', g: 'ayar', ad: 'Özellikler' },
      { k: 'devamsizlik', g: 'izinli', ad: 'Devamsızlık' },
      { k: 'etutler', g: 'saat', ad: 'Etütler' },
      { k: 'ders-odevleri', g: 'odev', ad: 'Ödevler' },
      { k: 'yemek', g: 'yemek', ad: 'Yemek Listesi' },
      { k: 'servis', g: 'servis', ad: 'Servisler' },
      { k: 'kulupler', g: 'kulup', ad: 'Kulüpler' },
      { k: 'aktarim', g: 'indir', ad: 'Excel Aktarım' },
      { k: 'islem-kaydi', g: 'belge', ad: 'İşlem Kaydı' },
      { k: 'okul-ayarlari', g: 'okul', ad: 'Okul Adresi ve Konumu' },
      { k: 'okul-sayfasi', g: 'okul', ad: 'Okul Sayfası' },
      { ayrac: 1 },
      { baslik: 'Kendi Derslerim' },
      { k: 'ogr-sinavlar', g: 'sinav', ad: 'Sınavlar' },
      { k: 'yoklama', g: 'onay', ad: 'Yoklama' }
    ].concat(veliBolumu());
  }
  if (u.role === 'admin') {
    return [
      { k: 'ana', g: 'ev', ad: 'Ana Sayfa' },
      { k: 'mudurler', g: 'mudur', ad: 'Müdürler' },
      { k: 'okullar', g: 'okul', ad: 'Okullar' },
      { k: 'yorumlar', g: 'posta', ad: 'Yorumlar' },
      { k: 'hatirlaticilar', g: 'bildirim', ad: 'Hatırlatıcılar' },
      { ayrac: 1 },
      { k: 'yedekler', g: 'kutu', ad: 'Yedekleme' },
      { k: 'islem-kaydi', g: 'belge', ad: 'İşlem Kaydı' }
    ];
  }
  return [];
}

function navCiz() {
  var liste = menuSuz(navTanim());
  /* Yetişkin hesabı ve okul rolleri: en üstte "Portallarım" (öğretmen@okul,
     müdür@okul, her çocuk için veli), sonra bulunulan portalın menüsü. */
  var h = portalMenusu();
  for (var i = 0; i < liste.length; i++) {
    var n = liste[i];
    if (n.ayrac) { h += '<div class="nav-ayrac"></div>'; continue; }
    if (n.baslik) { h += '<div class="nav-baslik">' + esc(n.baslik) + '</div>'; continue; }
    h += '<button class="navlink' + (S.page === n.k ? ' on' : '') + '" data-nav="' + esc(n.k) + '">' +
      ik(n.g) + '<span>' + esc(n.ad) + '</span></button>';
  }
  h += '<div class="nav-ayrac"></div>' +
    '<button class="navlink' + (S.page === 'profil' ? ' on' : '') + '" data-nav="profil">' + ik('ayar') + '<span>Ayarlar</span></button>' +
    '<button class="navlink" data-act="cikis">' + ik('cikis') + '<span>Çıkış Yap</span></button>';
  $('navListe').innerHTML = h;
  ekleDugmesiniAyarla();
}

/* Üstteki "+ Ekle": yetişkin hesabında ve okul rolünde görünür; öğrenci,
   servisçi ve yöneticide gizli. */
function ekleDugmesiniAyarla() {
  var b = $('btnEkle');
  if (b) b.hidden = !(S.user && (S.user.yetiskin || S.user.rolSatiri));
}
