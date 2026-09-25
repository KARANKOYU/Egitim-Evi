/* Müdür sayfaları: öğrenciler, öğretmenler, veli bağlama. */

/* ---- MÜDÜR ---- */
/* Öğrenci ve servisçi hesaplarını okul açar (10b-hesaplar.js). Öğretmen kendi
   yetişkin hesabını açar, kişisel kodunu okula verir; okul kodu girip onu ekler. */
SAYFALAR.ogretmenler = function () {
  /* Yalnızca "öğretmen hesabı açar" yetkisi verilmiş kişi listeyi göremeyebilir;
     o zaman sayfa düşmez, yalnızca açma kısmı görünür. */
  return api('/school/teachers')['catch'](function () { return { teachers: [] }; }).then(function (d) {
    var bek = d.teachers.filter(function (t) { return t.status === 'pending'; });
    var onay = d.teachers.filter(function (t) { return t.status === 'approved'; });
    var h = hero('ÖĞRETMENLER', S.user.schoolName);

    if (yetkim('ogretmen.onayla')) {
      h += '<div class="kart"><div class="satir" style="border:0;padding:0">' +
        '<div class="buyu"><div class="ad">Öğretmen ekle</div>' +
        '<div class="alt">Öğretmen Eğitim Evi\'nde kendi hesabını açar ve sana kişisel kodunu verir. ' +
        'Kodu girersin, adını görüp eklersin. Başka okulda da çalışıyorsa aynı hesapla girer.</div></div>' +
        '<button class="btn" data-act="ogretmen-kodla">Kodla ekle</button></div></div>';
    }

    /* Eski usul başvurular (öğretmenin okulu kendisi seçtiği dönemden) varsa listelenir. */
    if (bek.length) {
      h += '<h3 class="sb">Onay bekleyenler (' + bek.length + ')</h3>';
      h += '<div class="kart">';
      for (var i = 0; i < bek.length; i++) {
        var t = bek[i];
        h += '<div class="satir" data-ara="' + esc(t.fullName + ' ' + t.branch) + '">' +
          '<div class="buyu"><div class="ad">' + ik('ogretmen') + esc(t.fullName) + '</div>' +
          '<div class="alt">' + esc(t.branch) + ' · ' + esc(t.username) + '</div></div>' +
          '<button class="btn kucuk" data-act="ogretmen-onay" data-id="' + esc(t.id) + '" data-ok="1">Onayla</button>' +
          '<button class="btn kucuk tehlike" data-act="ogretmen-onay" data-id="' + esc(t.id) + '" data-ok="0">Reddet</button></div>';
      }
      h += '</div>';
    }

    h += '<h3 class="sb">Okulun öğretmenleri (' + onay.length + ')</h3>';
    if (!onay.length) h += bosKutu('ogretmen', 'Henüz öğretmen hesabı yok.');
    else {
      h += '<div class="kart">';
      for (var j = 0; j < onay.length; j++) {
        var o = onay[j];
        h += '<div class="satir" data-ara="' + esc(o.fullName + ' ' + o.branch + ' ' + o.username) + '">' +
          avatar(o.fullName, o.id) +
          '<div class="buyu"><div class="ad">' + esc(o.fullName) + '</div>' +
          '<div class="alt">' + esc(o.username) + (o.email ? ' · ' + esc(o.email) : '') + '</div></div>' +
          (o.branch ? '<span class="etiket">' + esc(o.branch) + '</span>' : '') +
          (yetkim('ogretmen.duzenle') ? '<button class="btn kucuk ghost" data-act="hesap-duzenle" data-id="' + esc(o.id) + '">Hesap</button>' : '') +
          '</div>';
      }
      h += '</div>';
    }
    yaz(h);
  });
};

SAYFALAR['okul-ogrenciler'] = function () {
  /* Her istek kendi başına düşebilir: yalnızca "öğrenci ekler" yetkisi olan
     kişi öğrenci listesini ya da sınıfları göremeyebilir, sayfa yine açılır. */
  var bos = function (alan) { return function () { var o = {}; o[alan] = []; return o; }; };
  return Promise.all([api('/school/students')['catch'](bos('students')), api('/school/classes')['catch'](bos('classes'))])
    .then(function (r) {
      var st = r[0].students, siniflar = r[1].classes;
      S._sinifListe = siniflar;
      S._ogrListe = st;

      var h = hero('ÖĞRENCİLER', st.length + ' öğrenci kayıtlı.');

      h += '<div class="kart"><div class="satir" style="border:0;padding:0">' +
        '<div class="buyu"><input type="text" id="ogrAra" class="ara-kutu" ' +
        'placeholder="Öğrenci ara — ad, sınıf, okul no ya da kullanıcı adı" autocomplete="off"></div>' +
        (yetkim('ogrenci.hesap-ac')
          ? (yetkim('aktarim.yap') ? '<button class="btn ghost" data-nav="aktarim">Excel ile toplu</button>' : '') +
            '<button class="btn" data-act="hesap-yeni" data-rol="student">Öğrenci ekle</button>' : '') +
        (yetkim('ogrenci.sifre') && st.length
          ? '<button class="btn ghost" data-act="giris-bilgisi-ac">Giriş bilgisi dağıt</button>' : '') +
        '</div><div class="hint" style="margin-top:8px">Öğrenci hesabını okul açar. Ad, soyad ve T.C. no yeter; ' +
        'kullanıcı adı ve şifre boşsa T.C. no olur, öğrenci ilk girişte kendi şifresini belirler.</div></div>';

      if (!st.length) { yaz(h + bosKutu('ogrenci', 'Henüz öğrenci kaydı yok.')); return; }

      /* Sınıfa göre, sonra okul numarasına ve ada göre sırala — liste öngörülebilir olsun. */
      st.sort(function (a, b) {
        return String(a.className || 'ZZZ').localeCompare(String(b.className || 'ZZZ'), 'tr') ||
          (Number(a.okulNo) || 1e9) - (Number(b.okulNo) || 1e9) ||
          a.fullName.localeCompare(b.fullName, 'tr');
      });

      h += '<div class="kart" style="padding:0" id="ogrListe">';
      for (var i = 0; i < st.length; i++) {
        var s = st[i];
        h += '<div class="satir" data-ara="' + esc(s.fullName + ' ' + s.username + ' ' + s.email + ' ' + s.className + ' ' + s.okulNo) + '">' +
          avatar(s.fullName, s.id) +
          '<div class="buyu"><div class="ad">' + esc(s.fullName) +
          (s.className ? ' <span class="etiket mavi">' + esc(s.className) + '</span>' : '') +
          (s.okulNo ? ' <span class="etiket gri">No ' + esc(s.okulNo) + '</span>' : '') + '</div>' +
          (s.username ? '<div class="alt">' + esc(s.username) + ' · veli kodu <b>' + esc(kodBicimle(s.code)) + '</b>' +
            (s.sifreDegismeli ? ' · <span class="soluk">kendi şifresini belirlemedi</span>' : '') + '</div>' : '') + '</div>' +
          (yetkim('ogrenci.duzenle') ? '<button class="btn kucuk ghost" data-act="hesap-duzenle" data-id="' + esc(s.id) + '">Hesap</button>' : '') +
          (yetkim('ogrenci.portal') ? '<button class="btn kucuk gri" data-act="ogrenci-portal" data-id="' + esc(s.id) + '" ' +
            'data-ad="' + esc(s.fullName) + '">Portalını aç</button>' : '') +
          '</div>';
      }
      yaz(h + '</div>');

      /* Sayfanın kendi arama kutusu: üstteki genel aramayı beklemeden süzer. */
      var kutu = $('ogrAra');
      if (kutu) {
        kutu.oninput = function () {
          var t = nrm(kutu.value);
          var satirlar = document.querySelectorAll('#ogrListe .satir');
          for (var k = 0; k < satirlar.length; k++) {
            var uyar = !t || nrm(satirlar[k].getAttribute('data-ara') || '').indexOf(t) >= 0;
            satirlar[k].style.display = uyar ? '' : 'none';
          }
        };
        /* Üstte açık pencere varsa odağı çalma. */
        if (!$('modalKok').innerHTML) kutu.focus();
      }
    });
};

/* Öğrencinin bağlı velileri (hesap penceresinde) */
function velileriYukle(ogrenciId) {
  return api('/school/ogrenci-velileri?studentId=' + encodeURIComponent(ogrenciId)).then(function (d) {
    var kap = $('hVeliler');
    if (!kap) return;
    if (!d.veliler.length) { kap.innerHTML = '<div class="hint">Bağlı veli yok.</div>'; return; }
    var h = '';
    for (var i = 0; i < d.veliler.length; i++) {
      var v = d.veliler[i];
      h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(v.fullName) + '</div>' +
        '<div class="alt">' + esc(v.username) + (v.role && v.role !== 'parent' ? ' · ' + esc(ROL_AD[v.role] || '') : '') + '</div></div>' +
        '<button class="btn kucuk gri" data-act="veli-coz" data-id="' + esc(ogrenciId) + '" data-veli="' + esc(v.id) + '">Kaldır</button></div>';
    }
    kap.innerHTML = h;
  })['catch'](function (e) { if ($('hVeliler')) $('hVeliler').innerHTML = '<div class="hint">' + esc(e.message) + '</div>'; });
}

EYLEMLER['veli-bul'] = function (el, ogrenciId) {
  var kutu = $('hVeliAra');
  alanTemizle(kutu.closest('.field'));
  var kimlik = kutu.value.trim();
  if (!kimlik) { alanHatasi(kutu, 'Velinin T.C. kimlik numarasını ya da kullanıcı adını yaz.'); return; }
  $('hVeliSonuc').innerHTML = '<div class="okul-bilgi">Aranıyor...</div>';
  return api('/school/veli-bul?kimlik=' + encodeURIComponent(kimlik)).then(function (d) {
    var k = d.kisi;
    if (k.durum !== 'uygun') {
      $('hVeliSonuc').innerHTML = '<div class="msg hata">Bu hesap veli olarak bağlanamaz (öğrenci ya da yönetici hesabı).</div>';
      return;
    }
    $('hVeliSonuc').innerHTML = '<div class="kart" style="margin:6px 0 0"><div class="satir" style="border:0;padding:0">' +
      '<div class="buyu"><div class="ad">' + esc(k.fullName) + '</div><div class="alt">' + esc(k.username) + '</div></div>' +
      '<button class="btn kucuk" data-act="veli-bagla" data-id="' + esc(ogrenciId) + '" data-veli="' + esc(k.id) + '">Veli olarak bağla</button>' +
      '</div></div>';
  })['catch'](function (e) { $('hVeliSonuc').innerHTML = ''; alanHatasi(kutu, e.message); });
};

EYLEMLER['veli-bagla'] = function (el, ogrenciId) {
  dugmeBekle(el, 'Bağlanıyor...');
  return api('/school/veli-bagla', 'POST', { studentId: ogrenciId, veliId: el.getAttribute('data-veli') }).then(function (d) {
    $('hVeliSonuc').innerHTML = '<div class="msg iyi">' + esc(d.message) + '</div>';
    $('hVeliAra').value = '';
    velileriYukle(ogrenciId);
  })['catch'](function (e) { dugmeBitir(el); $('hVeliSonuc').innerHTML = '<div class="msg hata">' + esc(e.message) + '</div>'; });
};

EYLEMLER['veli-coz'] = function (el, ogrenciId) {
  if (!confirm('Bu kişinin veli bağı kaldırılsın mı? Öğrencinin bilgilerini artık göremez.')) return;
  el.disabled = true;
  return api('/school/veli-coz', 'POST', { studentId: ogrenciId, veliId: el.getAttribute('data-veli') })
    .then(function () { velileriYukle(ogrenciId); })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

/* Müdür bir öğrencinin portalını açar (veli görünümüyle aynı mantık) */
function ogrenciPortalAc(studentId, ad) {
  S.viewStudentId = studentId;
  S.viewStudentName = ad;
  git('ilerleyisim');
}
