/* Sistem yöneticisi sayfaları: müdürler, okullar (okul açma), yedekler, yorumlar.
   Bu klasördeki parçalar herkese giden uygulama dosyasına girmez; yalnız
   yönetici çereziyle, yönetim adresinden ayrı bir dosya olarak gelir
   (sunucu/http.js). Uygulamanın bütün işlevlerini ve SAYFALAR, EYLEMLER
   tablolarını görürler. */

/* ---- ADMIN ---- */
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

EYLEMLER['yedek-al'] = function (el) {
  el.disabled = true;
  return api('/admin/backup-now', 'POST')
    .then(function (r) {
      mesajGoster('yedekMesaj', 'iyi', r.yedek.ad + ' alındı (' + boyutYaz(r.yedek.boyut) + ')');
      setTimeout(function () { git('yedekler'); }, 900);
    })['catch'](function (e) {
      el.disabled = false;
      mesajGoster('yedekMesaj', 'hata', e.message);
    });
};

EYLEMLER['yedek-indir'] = function (el) {
  var ad = el.getAttribute('data-ad');
  el.disabled = true;
  return dosyaIndir('/api/admin/backup-download?ad=' + encodeURIComponent(ad), ad)
    .then(function () { el.disabled = false; })
    ['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

EYLEMLER['yedek-geri'] = function (el) {
  var ad = el.getAttribute('data-ad');
  if (!confirm(ad + ' geri yüklensin mi?\n\nBu yedekten sonraki bütün değişiklikler ' +
    'kaybolur. Şimdiki hâl geri-alma kopyası olarak saklanacak.')) return;
  el.disabled = true;
  return api('/admin/backup-restore', 'POST', { ad: ad })
    .then(function (r) {
      /* Oturum yedekte de varsa yönetim çerezi korunur, sayfa yenilenir. Yoksa
         oturum kapanmıştır: sitenin kendi adresi giriş kartını açar. */
      alert(r.message + '\n\n' + (r.oturumKaldi ? 'Sayfa yenilenecek.' : 'Giriş sayfası açılacak.'));
      if (r.oturumKaldi) location.reload();
      else location.replace('/');
    })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

EYLEMLER['yedek-sil'] = function (el) {
  var ad = el.getAttribute('data-ad');
  if (!confirm(ad + ' silinsin mi?')) return;
  return api('/admin/backup-delete', 'POST', { ad: ad })
    .then(function () { git('yedekler'); })['catch'](hataGoster);
};

SAYFALAR.mudurler = function () {
  return api('/admin/principals').then(function (d) {
    var h = hero('MÜDÜRLER', d.principals.length + ' müdür hesabı kayıtlı.');
    if (!d.principals.length) { yaz(h + bosKutu('mudur', 'Henüz müdür hesabı yok.')); return; }

    h += '<div class="kart">';
    for (var i = 0; i < d.principals.length; i++) {
      var m = d.principals[i];
      var durum = m.status === 'approved'
        ? '<span class="etiket yesil">Etkin</span>'
        : (m.status === 'pending' ? '<span class="etiket turuncu">Giremiyor</span>'
          : '<span class="etiket kirmizi">Kapalı</span>');
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

EYLEMLER['mudur-sil'] = function (el, id) {
  var ad = el.getAttribute('data-ad') || 'Bu müdür';
  var okul = el.getAttribute('data-okul') || '';
  if (!confirm(ad + ' hesabı silinsin mi? (' + okul + ')\n\n' +
    'Okul kapanır, kimse giremez. Öğretmen ve öğrenci hesapları silinmez; ' +
    'Okullar > Okul aç ile okula yeni müdür atayabilirsin.')) return;
  return api('/admin/principal-delete', 'POST', { userId: id })
    .then(function () { git('mudurler'); })['catch'](hataGoster);
};

SAYFALAR.okullar = function () {
  return api('/admin/overview').then(function (d) {
    ADMIN_OKULLAR.liste = d.schools;
    ADMIN_OKULLAR.disk = d.disk;
    var h = hero('KAYITLI OKULLAR', d.schools.length + ' okul kayıtlı.');
    h += '<div class="kart"><div class="satir" style="border:0;padding:0"><div class="buyu"><div class="ad">Okul aç</div>' +
      '<div class="alt">Okulunu açtırmak isteyen kişi kişi kodunu sana verir. Okulu seç, adresini yaz, müdürü koduyla bul, ' +
      'dosya alanını (disk sınırı) ver.</div></div>' +
      '<button class="btn" data-act="admin-okul-ac">Okul aç</button></div></div>';
    /* Sistem geneli: okullara ayrılan, diskteki boş yer (09d-okul-disk.js). */
    if (d.disk) h += okulDiskSistemKarti(d.disk);
    if (!d.schools.length) { yaz(h + bosKutu('okul', 'Henüz okul yok.')); return; }
    h += '<div class="kart"><div class="tablo-sar"><table class="t okul-tablo"><thead><tr>' +
      '<th>Okul</th><th>İl / İlçe</th><th>Müdür</th><th>Öğretmen</th><th>Öğrenci</th><th>Dosya alanı</th><th>Durum</th>' +
      '<th><span class="gizli-etiket">Düzenle</span></th></tr></thead><tbody>';
    for (var i = 0; i < d.schools.length; i++) {
      var s = d.schools[i];
      var dur = s.status === 'approved' ? '<span class="etiket yesil">Açık</span>'
        : s.status === 'pending' ? '<span class="etiket turuncu">Müdür bekliyor</span>'
          : '<span class="etiket kirmizi">Kapalı</span>';
      h += '<tr data-ara="' + esc(s.name + ' ' + s.city + ' ' + s.principal) + '"><td><b>' + esc(s.name) + '</b></td><td>' +
        esc(s.city) + ' / ' + esc(s.district) + '</td><td>' + esc(s.principal) + '</td><td>' +
        esc(s.teachers) + '</td><td>' + esc(s.students) + '</td><td class="disk-hucre">' + okulDiskHucresi(s) + '</td><td>' + dur + '</td>' +
        '<td><button class="btn kucuk ghost" data-act="okul-ekrani" data-id="' + esc(s.id) + '" ' +
        'aria-label="' + esc(s.name) + ' okulunu düzenle">Düzenle</button></td></tr>';
    }
    yaz(h + '</tbody></table></div></div>' +
      '<div class="dugme-satir yonetim-gecis"><span class="hint">Okulların giriş adreslerini Site Ayarları sayfasında değiştirebilirsin.</span>' +
      '<button type="button" class="btn kucuk ghost" data-nav="site-ayarlari">Site Ayarları</button></div>');
  });
};

/* ---- yöneticinin okul açması ----
   Okulunu açtırmak isteyen kişi kendi hesabını açar ve "+ Ekle > Müdür"deki
   kişi kodunu yöneticiye verir. Yönetici kişiyi dışarıdan (telefon, e-posta)
   doğrular; okulu MEB listesinden seçer (ya da adını yazar), okulun adresini
   yazar, müdürün kişi kodunu girip "Bul" ile kime ait olduğuna bakar (tam ad,
   maskeli e-posta) ve okulun dosya alanını (disk sınırı) verir: öneri öğrenci
   sayısı × 10 MB, en az 2 GB; öğrenci sayısı yazılmazsa varsayılan
   (09d-okul-disk.js). Okul açılınca kişi müdür olur; kodu yenilenir. */

/* "Bul" ile bulunan kişinin kodu: okul yalnız bu kodla açılır. */
var adminKisi = { kod: '' };

EYLEMLER['admin-okul-ac'] = function () {
  adminKisi.kod = '';
  modalAc('Okul aç', '<div id="aoKart">' + okulSecimAlani() +
    '<div class="field"><label for="aoKisa">Okulun adresi</label>' +
    '<div class="adres-girdi"><span>' + esc(location.host) + '/school/</span>' +
    '<input type="text" id="aoKisa" maxlength="40" autocomplete="off" spellcheck="false" placeholder="okulun-adi"></div>' +
    '<div class="hint">Küçük harf, rakam ve tire; 3–40 karakter. Okulu seçince adından önerilir.</div></div>' +
    '<hr class="ayrac-cizgi"><h4 class="alt-baslik">Müdür</h4>' +
    '<div class="hint" style="margin-bottom:10px">Kişi, hesabındaki <b>+ Ekle &gt; Müdür</b> ekranında gördüğü kişi ' +
    'kodunu sana verir. Kodun sahibini bul, adını ve e-postasını kişiyle karşılaştır.</div>' +
    '<div class="field"><label for="aoKod">Müdürün kişi kodu</label>' +
    '<div class="rolsuz-satir">' + kisiKoduGirdisi('aoKod') +
    '<button class="btn" data-act="admin-kisi-bul">Bul</button></div></div>' +
    '<div id="aoKisi"></div>' +
    '<hr class="ayrac-cizgi"><h4 class="alt-baslik">Dosya alanı</h4>' +
    '<div class="hint" style="margin-bottom:10px">Okulun dosyaları (ödev teslim dosyaları, ekler, okul sayfası fotoğrafları) ' +
    'bu sınıra sayılır; dolunca okulda yeni yükleme durur. Sonradan Okullar listesinde değiştirilir.</div>' +
    '<div class="field"><label for="aoOgrenci">Öğrenci sayısı (yaklaşık)</label>' +
    '<input type="number" id="aoOgrenci" min="0" max="100000" step="1" inputmode="numeric" autocomplete="off" ' +
    'placeholder="Bilmiyorsan boş bırak"></div>' +
    diskSiniriAlani('aoDisk', diskVarsayilanMb(), null) +
    '<div id="aoMesaj"></div></div>',
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
    '<button class="btn" data-act="admin-okul-ac-kaydet">Okulu aç</button>');
  okulSecimiKur();
  /* Öğrenci sayısı yazıldıkça öneri güncellenir; sınır kutusu elle değiştirilmediyse öneriyi alır. */
  var diskElle = false;
  $('aoDiskDeger').addEventListener('input', function () { diskElle = true; });
  $('aoDiskBirim').addEventListener('change', function () { diskElle = true; });
  $('aoOgrenci').addEventListener('input', function () {
    var n = /^\d{1,6}$/.test(this.value.trim()) ? Number(this.value.trim()) : 0;
    $('aoDiskOneri').textContent = diskOneriYazisi(n || null);
    var dugme = document.querySelector('[data-act="disk-oneri-kullan"][data-onek="aoDisk"]');
    if (dugme) dugme.setAttribute('data-ogrenci', n ? String(n) : '');
    if (!diskElle) diskSiniriYaz('aoDisk', diskOneriMb(n) || diskVarsayilanMb());
  });
  $('aoKisa').addEventListener('focus', function () {
    if (this.value) return;
    var ad = seciliOkul ? seciliOkul.ad : $('bOkulAd').value;
    if (ad) this.value = aramaSadeTR(ad).replace(/ /g, '-').slice(0, 40).replace(/-+$/, '');
  });
  /* Kod değişince önce bulunan kişi geçersiz olur: yeniden "Bul". */
  $('aoKod').addEventListener('input', function () {
    if (adminKisi.kod && adminKisi.kod !== kisiKoduSade(this.value)) { adminKisi.kod = ''; $('aoKisi').innerHTML = ''; }
  });
  $('aoKod').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); EYLEMLER['admin-kisi-bul'](document.querySelector('[data-act="admin-kisi-bul"]')); }
  });
};

EYLEMLER['admin-kisi-bul'] = function (el) {
  var kutu = $('aoKod');
  alanTemizle(kutu.closest('.field'));
  $('aoKisi').innerHTML = '';
  adminKisi.kod = '';
  var sorun = kisiKoduDenetle(kutu.value);
  if (sorun) { alanHatasi(kutu, sorun); kutu.focus(); return; }
  var kod = kisiKoduSade(kutu.value);
  dugmeBekle(el, 'Aranıyor...');
  return api('/admin/kisi-bul', 'POST', { kod: kod }).then(function (d) {
    dugmeBitir(el);
    adminKisi.kod = kod;
    $('aoKisi').innerHTML = '<div class="satir ao-kisi">' + ik('mudur') + '<div class="buyu">' +
      '<div class="alt">Bu kodun sahibi</div>' +
      '<div class="ad">' + esc(d.ad) + '</div>' +
      '<div class="alt">' + esc(d.eposta) + ' · ' + esc(d.kullaniciAdi) +
      (d.rolSayisi ? ' · ' + d.rolSayisi + ' okulda rolü var' : '') + '</div></div></div>' +
      '<div class="hint">Adı ve e-postası okulunu açtırmak isteyen kişiyle uyuşuyorsa "Okulu aç"a bas.</div>';
  })['catch'](function (e) { dugmeBitir(el); alanHatasi(kutu, e.message); kutu.focus(); });
};

EYLEMLER['admin-okul-ac-kaydet'] = function (el) {
  var kart = $('aoKart');
  formHatalariniSil(kart);
  var g = { city: $('bIl').value, district: $('bIlce').value.trim(), kisaAd: $('aoKisa').value.trim().toLowerCase(),
    mudurKodu: kisiKoduSade($('aoKod').value) };
  if (seciliOkul) g.mebSchoolId = seciliOkul.id;
  else g.schoolName = $('bOkulAd').value.trim();
  if (!g.mebSchoolId && !g.schoolName) alanHatasi('bOkulAra', 'Okulu listeden seç ya da "Okul listede yok" bölümüne adını yaz.');
  if (!g.kisaAd) alanHatasi('aoKisa', 'Okulun adresini yaz.');
  var sorun = kisiKoduDenetle(g.mudurKodu, 'Müdürün kişi kodu');
  if (sorun) alanHatasi('aoKod', sorun);
  else if (adminKisi.kod !== g.mudurKodu) alanHatasi('aoKod', 'Önce "Bul" ile kodun kime ait olduğuna bak.');
  var disk = diskSiniriOku('aoDisk');
  if (disk !== null) g.diskMb = disk;
  if (kart.querySelector('.hatali')) { ilkHatayaGit(kart); return; }
  dugmeBekle(el, 'Açılıyor...');
  return api('/admin/okul-ac', 'POST', g).then(function (d) {
    var satir = function (etiket, deger, kopya) {
      return '<div class="satir"><div class="buyu"><div class="alt">' + etiket + '</div><div class="ad">' + esc(deger) + '</div></div>' +
        (kopya ? '<button class="btn kucuk gri" data-act="kod-kopyala" data-kod="' + esc(deger) + '">Kopyala</button>' : '') + '</div>';
    };
    modalAc('Okul açıldı', '<div class="msg iyi">' + esc(d.message) + '</div>' +
      satir('Okulun adresi', location.host + okulYolu(d.okul.kisaAd), true) +
      satir('Müdür', d.mudur.ad + ' (' + d.mudur.kullaniciAdi + ')') +
      satir('Disk sınırı', diskYaz((d.okul.diskSiniriMb || diskVarsayilanMb()) * OKUL_DISK_MB) +
        (d.okul.diskSiniriMb ? '' : ' (varsayılan)')) +
      '<div class="hint">Müdüre bildirim gitti; okuluna sol üstteki menüden geçer.</div>',
      '<button class="btn" data-act="admin-okul-bitti">Tamam</button>');
  })['catch'](function (e) {
    dugmeBitir(el);
    var v = e.veri || {};
    /* Sunucunun söylediği alan (aynı adres, aynı okul, kişinin okulda zaten rolü var). */
    var hedef = { okul: 'bOkulAra', il: 'bIl', ilce: 'bIlce', kisaAd: 'aoKisa', mudurKodu: 'aoKod', kod: 'aoKod',
      diskMb: 'aoDiskDeger' }[v.alan];
    if (v.alan === 'mudurKodu' || v.alan === 'kod') { adminKisi.kod = ''; $('aoKisi').innerHTML = ''; }
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
