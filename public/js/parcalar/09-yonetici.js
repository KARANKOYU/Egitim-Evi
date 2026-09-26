/* Sistem yöneticisi sayfaları: onaylar, müdürler, okullar, yedekler. */

/* ---- ADMIN ---- */
SAYFALAR.onaylar = function () {
  return api('/admin/pending').then(function (d) {
    var h = hero('ONAY BEKLEYEN BAŞVURULAR', 'Müdür başvurularını onayladığında okulları sisteme eklenir.');
    if (!d.principals.length) { yaz(h + bosKutu('kutu', 'Bekleyen başvuru yok.')); return; }
    h += '<div class="kart">';
    for (var i = 0; i < d.principals.length; i++) {
      var p = d.principals[i];
      h += '<div class="satir" data-ara="' + esc(p.fullName + ' ' + p.schoolName + ' ' + p.city) + '">' +
        '<div class="buyu"><div class="ad">' + ik('mudur') + esc(p.fullName) + '</div>' +
        '<div class="alt">' + esc(p.schoolName) + ' · ' + esc(p.city) + ' / ' + esc(p.district) + '</div>' +
        '<div class="alt">' + esc(p.username) + (p.email ? ' · ' + esc(p.email) : '') +
        (p.phone ? ' · ' + esc(telefonGoster(p.phone)) : '') + '</div>' +
        '<div class="alt">' + (p.yas !== null && p.yas !== undefined ? p.yas + ' yaşında · ' : '') +
        'başvuru ' + tarih(p.createdAt) + (p.hesapAcilis ? ' · hesap ' + tarih(p.hesapAcilis) + ' açıldı' : '') + '</div></div>' +
        '<button class="btn kucuk" data-act="admin-onay" data-id="' + esc(p.id) + '" data-ok="1">Onayla</button>' +
        '<button class="btn kucuk tehlike" data-act="admin-onay" data-id="' + esc(p.id) + '" data-ok="0">Reddet</button>' +
        '</div>';
    }
    yaz(h + '</div>');
  });
};

SAYFALAR.yedekler = function () {
  return api('/admin/backups').then(function (d) {
    var h = hero('YEDEKLEME', 'Tüm veri tek dosyada tutuluyor. Günde bir kez otomatik kopya alınır.');

    h += '<div class="kart"><h3>Şimdi yedek al</h3>' +
      '<div class="hint" style="margin-bottom:10px">Son ' + d.saklanan +
      ' kopya saklanır, eskiler kendiliğinden silinir.</div>' +
      '<button class="btn" data-act="yedek-al">Yedek al</button>' +
      '<div id="yedekMesaj" style="margin-top:10px"></div></div>';

    if (!d.yedekler.length) {
      h += bosKutu('kutu', 'Henüz yedek yok. Sunucu açıldıktan kısa süre sonra ilki alınır.');
      yaz(h);
      return;
    }

    h += '<div class="kart"><h3>Yedekler (' + d.yedekler.length + ')</h3>';
    for (var i = 0; i < d.yedekler.length; i++) {
      var y = d.yedekler[i];
      var elle = y.ad.indexOf('yedek-elle-') === 0, geriAlma = y.ad.indexOf('yedek-geri-alma-') === 0;
      h += '<div class="satir" data-ara="' + esc(y.ad) + '">' +
        '<div class="buyu"><div class="ad">' + esc(y.ad) +
        (elle ? ' <span class="etiket">elle</span>' : '') + (geriAlma ? ' <span class="etiket">geri alma</span>' : '') + '</div>' +
        '<div class="alt">' + tarihSaat(y.tarih) + ' · ' + boyutYaz(y.boyut) + '</div></div>' +
        '<button class="btn kucuk ghost" data-act="yedek-indir" data-ad="' + esc(y.ad) + '">İndir</button>' +
        '<button class="btn kucuk gri" data-act="yedek-geri" data-ad="' + esc(y.ad) + '">Geri yükle</button>' +
        '<button class="btn kucuk tehlike" data-act="yedek-sil" data-ad="' + esc(y.ad) + '">Sil</button>' +
        '</div>';
    }
    h += '</div>';

    h += '<div class="msg bilgi">Geri yükleme her şeyi o ana döndürür — o yedekten ' +
      'sonra yapılan bütün değişiklikler kaybolur. Yanlışlıkla yaparsan, geri yükleme ' +
      'öncesi hâl otomatik olarak <b>yedek-geri-alma-…</b> adıyla saklanır.</div>';

    yaz(h);
  });
};

/* Dosya boyutu: 812 B, 34 KB, 2,4 MB (yedekler ve ödev dosyaları). */
function boyutYaz(n) {
  if (n >= 1024 * 1024) return sayiTR(Math.round(n / 1024 / 1024 * 10) / 10) + ' MB';
  if (n >= 1024) return Math.round(n / 1024) + ' KB';
  return n + ' B';
}

SAYFALAR.mudurler = function () {
  return api('/admin/principals').then(function (d) {
    var h = hero('MÜDÜRLER', d.principals.length + ' müdür hesabı kayıtlı.');
    if (!d.principals.length) { yaz(h + bosKutu('mudur', 'Henüz müdür hesabı yok.')); return; }

    h += '<div class="kart">';
    for (var i = 0; i < d.principals.length; i++) {
      var m = d.principals[i];
      var durum = m.status === 'approved'
        ? '<span class="etiket yesil">Onaylı</span>'
        : (m.status === 'pending' ? '<span class="etiket turuncu">Beklemede</span>'
          : '<span class="etiket kirmizi">Reddedildi</span>');
      h += '<div class="satir" data-ara="' + esc(m.fullName + ' ' + m.schoolName + ' ' + m.city) + '">' +
        '<div class="buyu"><div class="ad">' + ik('mudur') + esc(m.fullName) + '</div>' +
        '<div class="alt">' + esc(m.username) + (m.email ? ' · ' + esc(m.email) : '') + '</div>' +
        '<div class="alt">' + esc(m.schoolName) + ' · ' + esc(m.city) +
        (m.district ? ' / ' + esc(m.district) : '') + '</div>' +
        '<div class="alt">' + m.teachers + ' öğretmen · ' + m.students + ' öğrenci</div></div>' +
        durum +
        '<button class="btn kucuk tehlike" data-act="mudur-sil" data-id="' + esc(m.id) + '" ' +
        'data-ad="' + esc(m.fullName) + '" data-okul="' + esc(m.schoolName) + '">Hesabı sil</button>' +
        '</div>';
    }
    yaz(h + '</div>');
  });
};

SAYFALAR.okullar = function () {
  return api('/admin/overview').then(function (d) {
    var h = hero('KAYITLI OKULLAR', d.schools.length + ' okul kayıtlı.');
    h += '<div class="kart"><div class="satir" style="border:0;padding:0"><div class="buyu"><div class="ad">Okul aç</div>' +
      '<div class="alt">Başvuru beklemeden okulu kendin aç: okulu seç, adresini ve müdürünü yaz.</div></div>' +
      '<button class="btn" data-act="admin-okul-ac">Okul aç</button></div></div>';
    if (!d.schools.length) { yaz(h + bosKutu('okul', 'Henüz okul yok.')); return; }
    h += '<div class="kart"><div class="tablo-sar"><table class="t"><thead><tr>' +
      '<th>Okul</th><th>İl / İlçe</th><th>Müdür</th><th>Öğretmen</th><th>Öğrenci</th><th>Durum</th>' +
      '</tr></thead><tbody>';
    for (var i = 0; i < d.schools.length; i++) {
      var s = d.schools[i];
      var dur = s.status === 'approved' ? '<span class="etiket yesil">Onaylı</span>'
        : s.status === 'pending' ? '<span class="etiket turuncu">Bekliyor</span>'
          : '<span class="etiket kirmizi">Red</span>';
      h += '<tr data-ara="' + esc(s.name + ' ' + s.city + ' ' + s.principal) + '"><td><b>' + esc(s.name) + '</b></td><td>' +
        esc(s.city) + ' / ' + esc(s.district) + '</td><td>' + esc(s.principal) + '</td><td>' +
        s.teachers + '</td><td>' + s.students + '</td><td>' + dur + '</td></tr>';
    }
    yaz(h + '</tbody></table></div></div>');
  });
};

/* ---- yöneticinin okul açması ----
   Okul MEB listesinden seçilir (ya da adı yazılır), adresi (uzantı) ve müdürü
   girilir. Müdürün e-postası kayıtlı bir yetişkin hesabıysa rol o hesaba
   eklenir; değilse yeni hesap açılır ve yöneticinin verdiği güçlü şifreyle
   girer, ilk girişte kendi şifresini belirler. */
EYLEMLER['admin-okul-ac'] = function () {
  modalAc('Okul aç', '<div id="aoKart">' + okulSecimAlani() +
    '<div class="field"><label for="aoKisa">Okulun adresi</label>' +
    '<div class="adres-girdi"><span>' + esc(location.host) + '/</span>' +
    '<input type="text" id="aoKisa" maxlength="40" autocomplete="off" spellcheck="false" placeholder="okulun-adi"></div>' +
    '<div class="hint">Küçük harf, rakam ve tire; 3–40 karakter. Okulu seçince adından önerilir.</div></div>' +
    '<hr class="ayrac-cizgi"><h4 class="alt-baslik">Müdür</h4>' +
    '<div class="hint" style="margin-bottom:10px">E-postası sistemde kayıtlı bir yetişkin hesabıysa müdürlük o hesaba eklenir; ' +
    'o zaman öteki alanları boş bırakabilirsin.</div>' +
    '<div class="field"><label for="aoEposta">E-posta</label><input type="email" id="aoEposta" autocomplete="off" spellcheck="false"></div>' +
    '<div class="row2"><div class="field"><label for="aoAd">Ad</label><input type="text" id="aoAd" maxlength="60" autocomplete="off"></div>' +
    '<div class="field"><label for="aoSoyad">Soyad</label><input type="text" id="aoSoyad" maxlength="40" autocomplete="off"></div></div>' +
    '<div class="row2"><div class="field"><label for="aoKadi">Kullanıcı adı</label>' +
    '<input type="text" id="aoKadi" maxlength="30" autocomplete="off" autocapitalize="off" spellcheck="false"></div>' +
    '<div class="field"><label for="aoTelefon">Telefon</label><input type="tel" id="aoTelefon"></div></div>' +
    '<div class="field"><label for="aoSifre">Şifre</label>' +
    '<div class="sifre-satir"><input type="text" id="aoSifre" autocomplete="off" spellcheck="false">' +
    '<button class="btn kucuk gri" data-act="admin-sifre-uret">Rastgele üret</button></div>' +
    sifreKuralListesi('aoKural', true) +
    '<div class="hint">Müdür ilk girişte kendi şifresini belirler.</div></div>' +
    '<div id="aoMesaj"></div></div>',
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
    '<button class="btn" data-act="admin-okul-ac-kaydet">Okulu aç</button>');
  okulBasvurusuKur();
  $('aoSifre').addEventListener('input', function () { sifreKurallariniIsaretle('aoSifre', 'aoKural'); });
  $('aoKisa').addEventListener('focus', function () {
    if (this.value) return;
    var ad = seciliOkul ? seciliOkul.ad : $('bOkulAd').value;
    if (ad) this.value = aramaSadeTR(ad).replace(/ /g, '-').slice(0, 40).replace(/-+$/, '');
  });
};

EYLEMLER['admin-sifre-uret'] = function () {
  /* Okunması kolay (karışan I, l, O, 0 yok) ama güçlü: büyük, küçük, rakam, özel. */
  var gruplar = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghijkmnopqrstuvwxyz', '23456789', '!?*.#'];
  var dizi = new Uint32Array(12);
  (window.crypto || window.msCrypto).getRandomValues(dizi);
  var s = '';
  for (var i = 0; i < 12; i++) { var g = gruplar[i < 4 ? i : dizi[i] % 3]; s += g[dizi[i] % g.length]; }
  $('aoSifre').value = s;
  sifreKurallariniIsaretle('aoSifre', 'aoKural');
};

EYLEMLER['admin-okul-ac-kaydet'] = function (el) {
  var kart = $('aoKart');
  formHatalariniSil(kart);
  var g = { city: $('bIl').value, district: $('bIlce').value.trim(), kisaAd: $('aoKisa').value.trim().toLowerCase(),
    mudur: { eposta: $('aoEposta').value.trim(), ad: $('aoAd').value.trim(), soyad: $('aoSoyad').value.trim(),
      kullaniciAdi: $('aoKadi').value.trim().toLowerCase(), telefon: telefonOku($('aoTelefon')), sifre: $('aoSifre').value } };
  if (seciliOkul) g.mebSchoolId = seciliOkul.id;
  else g.schoolName = $('bOkulAd').value.trim();
  if (!g.mebSchoolId && !g.schoolName) alanHatasi('bOkulAra', 'Okulu listeden seç ya da "Okulum listede yok" bölümüne adını yaz.');
  if (!g.kisaAd) alanHatasi('aoKisa', 'Okulun adresini yaz.');
  if (!EPOSTA_DESENI.test(g.mudur.eposta)) alanHatasi('aoEposta', 'Müdürün e-posta adresini yaz.');
  if (kart.querySelector('.hatali')) { ilkHatayaGit(kart); return; }
  dugmeBekle(el, 'Açılıyor...');
  return api('/admin/okul-ac', 'POST', g).then(function (d) {
    /* Yeni hesapta şifreyi yönetici verdi; müdüre iletebilsin diye bir kez
       daha gösterilir (sunucu şifreyi geri göndermez, formdaki kullanılır). */
    var sifre = d.mudur.yeni ? g.mudur.sifre : '';
    var satir = function (etiket, deger, kopya) {
      return '<div class="satir"><div class="buyu"><div class="alt">' + etiket + '</div><div class="ad">' + esc(deger) + '</div></div>' +
        (kopya ? '<button class="btn kucuk gri" data-act="kod-kopyala" data-kod="' + esc(deger) + '">Kopyala</button>' : '') + '</div>';
    };
    modalAc('Okul açıldı', '<div class="msg iyi">' + esc(d.message) + '</div>' +
      satir('Okulun adresi', location.host + '/' + d.okul.kisaAd, true) +
      satir('Müdürün kullanıcı adı', d.mudur.kullaniciAdi, true) +
      (sifre ? satir('İlk şifresi (ilk girişte değiştirecek)', sifre, true) : ''),
      '<button class="btn" data-act="admin-okul-bitti">Tamam</button>');
  })['catch'](function (e) {
    dugmeBitir(el);
    var v = e.veri || {};
    var hedef = { okul: 'bOkulAra', il: 'bIl', ilce: 'bIlce', kisaAd: 'aoKisa', eposta: 'aoEposta', ad: 'aoAd', soyad: 'aoSoyad',
      kullaniciAdi: 'aoKadi', telefon: 'aoTelefon', sifre: 'aoSifre' }[v.alan];
    if (hedef) { alanHatasi(hedef, e.message); ilkHatayaGit(kart); }
    else mesajGoster('aoMesaj', 'hata', e.message);
  });
};

EYLEMLER['admin-okul-bitti'] = function () { modalKapat(); return git('okullar'); };

/* ---- açılış sayfasındaki yorumlar: gizle / yeniden göster ---- */
SAYFALAR.yorumlar = function () {
  return api('/yorumlar/hepsi').then(function (d) {
    var h = hero('YORUMLAR', 'Açılış sayfasında görünen yorumlar. Uygunsuz kelimeler badwordsfilter.json ile zaten engellenir; ' +
      'geçeni buradan gizleyebilirsin.');
    if (!d.yorumlar.length) { yaz(h + bosKutu('posta', 'Henüz yorum yok.')); return; }
    h += '<div class="kart">' + d.yorumlar.map(function (y) {
      return '<div class="satir' + (y.gizli ? ' soluk-satir' : '') + '">' + avatar(y.adKisa, y.adKisa + y.rol) +
        '<div class="buyu"><div class="ad">' + esc(y.adKisa) + ' · ' + esc(y.rol) + ' ' + yildizCiz(y.yildiz) + '</div>' +
        '<div class="alt" style="white-space:pre-wrap">' + esc(y.metin) + '</div>' +
        '<div class="alt">' + tarihSaat(y.tarih) + (y.gizli ? ' · gizli' : '') + '</div></div>' +
        '<button class="btn kucuk gri" data-act="yorum-gizle" data-id="' + esc(y.id) + '" data-gizli="' + (y.gizli ? '0' : '1') + '">' +
        (y.gizli ? 'Göster' : 'Gizle') + '</button></div>';
    }).join('') + '</div>';
    yaz(h);
  });
};

EYLEMLER['yorum-gizle'] = function (el, id) {
  return api('/yorumlar/gizle', 'POST', { id: id, gizli: el.getAttribute('data-gizli') === '1' })
    .then(function () { return git('yorumlar'); })['catch'](hataGoster);
};
