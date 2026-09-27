/* Yönetim paneli: yöneticinin menüsü ve ana sayfası. Uygulamanın ortak
   parçaları (menü, ana sayfa, giriş) YONETIM kancasına bakar (00-durum.js);
   kanca yalnız bu dosyada dolar. Bu dosya yalnız yönetim adresinde, yönetici
   çereziyle yüklenir: başka hiçbir sayfada bu ekranlar ve uç adları yoktur. */

YONETIM = {
  menu: function () {
    return [
      { k: 'ana', g: 'ev', ad: 'Ana Sayfa' },
      { k: 'mudurler', g: 'mudur', ad: 'Müdürler' },
      { k: 'okullar', g: 'okul', ad: 'Okullar' },
      { k: 'yorumlar', g: 'posta', ad: 'Yorumlar' },
      { k: 'hatirlaticilar', g: 'bildirim', ad: 'Hatırlatıcılar' },
      { ayrac: 1 },
      { baslik: 'Site' },
      { k: 'site-ayarlari', g: 'ayar', ad: 'Site Ayarları' },
      { k: 'yonetici-dosyasi', g: 'kilit', ad: 'Yönetici Dosyası' },
      { k: 'yedekler', g: 'kutu', ad: 'Yedekleme' },
      { k: 'islem-kaydi', g: 'belge', ad: 'İşlem Kaydı' }
    ];
  },

  anaSayfa: function (ad) {
    return api('/admin/overview').then(function (d) {
      var s = d.stats;
      yaz(hero('EĞİTİM EVİNE HOŞ GELDİNİZ', 'Merhaba ' + ad + ', sistem yöneticisi panelindesin.') +
        kutucuklar([
          { k: 'okullar', ad: 'Okullar', renk: 'lacivert', ikon: 'okul', alt: s.okul + ' okul kayıtlı · Okul aç' },
          { k: 'mudurler', ad: 'Müdürler', renk: 'yesil', ikon: 'mudur', alt: s.mudur + ' müdür' },
          { k: 'site-ayarlari', ad: 'Site Ayarları', renk: 'mor', ikon: 'ayar', alt: 'İletişim, yapımcılar, okul adresleri' },
          { k: 'yonetici-dosyasi', ad: 'Yönetici Dosyası', renk: 'turuncu', ikon: 'kilit', alt: 'admins.json' },
          { k: 'yedekler', ad: 'Yedekleme', renk: 'camgobegi', ikon: 'kutu', alt: 'Veri kopyaları' },
          { k: 'profil', ad: 'Ayarlar', renk: 'gri', ikon: 'ayar', alt: 'Yönetici hesabın' }
        ]) +
        '<div class="grid k4">' +
        stat(s.okul, 'Okul') + stat(s.mudur, 'Müdür') + stat(s.ogretmen, 'Öğretmen') +
        stat(s.ogrenci, 'Öğrenci') + stat(s.veli, 'Veli') +
        '</div>');
    });
  },

  /* Bu adreste yalnız yönetici çalışır. Tarayıcıda başka bir hesabın anahtarı
     açıldıysa (başka sekmeden kalan) sitenin kendi adresine dönülür. */
  disariMi: function () {
    if (!S.user || S.user.role === 'admin') return false;
    location.replace('/');
    return true;
  }
};

/* Yönetim adresinde oturum yoksa (anahtar başka sekmede ya da yalnız
   bellekte kaldı) açılış sayfası değil doğrudan giriş kartı gösterilir. */
S.genelGiris = true;
