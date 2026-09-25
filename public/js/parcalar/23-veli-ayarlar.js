/* Veli sayfaları ve hesap ayarları.
   Yetişkin hesabında (ve ona bağlı öğretmen/müdür rolünde) kişisel bilgiler,
   giriş bilgileri ve şifre yetişkin hesabınındır; bütün rollerde aynıdır. */

/* ---- VELİ ---- */
SAYFALAR.cocuklarim = function () {
  /* Okul rolündeyken (öğretmen, müdür) çocukların sayfaları açılmaz: veli
     kişiliğine geçmek gerekir. */
  if (S.user && S.user.rolSatiri) {
    yaz(hero('ÇOCUKLARIM', '') + '<div class="kart"><div class="msg bilgi">Şu an ' + esc(ROL_AD[S.user.role] || 'okul') +
      ' olarak girdin. Çocuğunun ödevlerini, devamsızlığını ve notlarını görmek için veli olarak geç.</div>' +
      '<button class="btn" data-nav="kisilikler">Hesap değiştir</button></div>');
    return Promise.resolve();
  }
  return api('/parent/children').then(function (d) {
    S.children = d.children;
    var h = hero('ÇOCUKLARIM', 'Çocuğunun kartına tıklayarak portalını aç.');
    h += '<div class="kart"><h3>Çocuk ekle</h3>' +
      '<div class="hint" style="margin-bottom:9px">Çocuğunun hesabındaki <b>veli kodunu</b> gir. ' +
      'Büyük/küçük harf ve tire fark etmez.</div>' +
      '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
      '<input type="text" id="veliKod" placeholder="ör. ABCDE-FGH23" maxlength="20" ' +
      'autocapitalize="characters" autocorrect="off" autocomplete="off" spellcheck="false" ' +
      'style="flex:1;min-width:180px;padding:11px 12px;border:1.5px solid var(--cizgi);border-radius:10px;font-family:ui-monospace,Consolas,monospace">' +
      '<button class="btn" data-act="cocuk-ekle">Ekle</button></div><div id="veliMesaj" style="margin-top:9px"></div></div>';
    h += cocukKartlari(d.children);
    yaz(h);
  });
};

function cocukKartlari(list) {
  if (!list.length) return bosKutu('veli', 'Henüz çocuk eklemedin. Veli kodunu kullanarak ekleyebilirsin.');
  var h = '<div class="grid k2">';
  for (var i = 0; i < list.length; i++) {
    var c = list[i];
    h += '<div class="kart tikla" data-act="cocuk-ac" data-id="' + esc(c.id) + '" data-ad="' + esc(c.fullName) + '" ' +
      'data-ara="' + esc(c.fullName) + '">' +
      '<h3>' + esc(c.fullName) + '</h3>' +
      '<div style="color:var(--soluk);font-size:13px">' + esc(c.schoolName) + '</div>' +
      '<div style="margin-top:11px"><span class="etiket">Portalını aç</span> ' +
      '<button class="btn kucuk gri" data-act="cocuk-sil" data-id="' + esc(c.id) + '">Kaldır</button></div></div>';
  }
  return h + '</div>';
}

/* ---- ayarlar ---- */
/* "2011-03-12" -> "12 Mart 2011 (15 yaşında)" */
function dogumMetni(iso) {
  var p = String(iso || '').split('-');
  if (p.length !== 3) return iso || '';
  var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  var bugun = new Date();
  var yas = bugun.getFullYear() - d.getFullYear();
  if (bugun.getMonth() < d.getMonth() || (bugun.getMonth() === d.getMonth() && bugun.getDate() < d.getDate())) yas--;
  return Number(p[2]) + ' ' + AY_ADLARI[Number(p[1]) - 1] + ' ' + p[0] + (yas >= 0 ? ' (' + yas + ' yaşında)' : '');
}

function satirBilgi(etiket, deger) {
  return '<div class="satir"><div class="buyu"><div class="alt">' + etiket + '</div><div class="ad">' + deger + '</div></div></div>';
}

/* hs: yetişkin hesabının bilgileri (GET /api/hesap); okulun açtığı hesapta null. */
function profilCiz(hs) {
  var u = S.user;
  var k = hs || u;
  var alt = u.rolSatiri ? ROL_AD[u.role] + ' · ' + (u.schoolName || '')
    : u.role && u.role !== 'parent' ? ROL_AD[u.role] + ' hesabı' : hs ? 'Yetişkin hesabı' : 'Hesabın';
  var h = hero('AYARLAR', alt);
  h += '<div class="kart"><h3>Hesap bilgilerin</h3>' +
    satirBilgi('Ad Soyad', esc(k.fullName)) +
    satirBilgi('Kullanıcı adı', esc(k.username)) +
    (k.email ? satirBilgi('E-posta', esc(k.email)) : '') +
    (u.schoolName && (!hs || u.rolSatiri) ? satirBilgi(u.rolSatiri ? 'Şu anki okulun' : 'Okul', esc(u.schoolName)) : '') +
    (k.dogum ? satirBilgi('Doğum tarihi', esc(dogumMetni(k.dogum))) : '') +
    (u.branch ? '<div class="satir"><div class="buyu"><div class="alt">Branş</div><div class="ad">' + esc(u.branch) + '</div></div></div>' : '') +
    (u.code ? '<div class="satir"><div class="buyu"><div class="alt">Veli kodun (velinle paylaş)</div>' +
      '<div class="ad kod-goster">' + esc(kodBicimle(u.code)) + '</div>' +
      '<div class="hint">Velin bu kodu Eğitim Evi\'nde girince hesabına bağlanır.</div></div>' +
      '<button class="btn ghost kucuk" data-act="kod-kopyala" data-kod="' + esc(kodBicimle(u.code)) + '">Kopyala</button></div>' : '') +
    (hs ? '<div class="dugme-satir"><button class="btn kucuk ghost" data-nav="kisilikler">Rollerin ve çocukların</button></div>' +
      '<div class="hint">Bu bilgiler yetişkin hesabınındır; öğretmen, müdür ya da veli olarak girdiğinde de aynıdır.</div>' : '') +
    '</div>';

  if (hs) h += girisBilgileriKarti(hs);

  h += '<div class="kart"><h3>Bilgileri güncelle</h3>' +
    '<div class="field"><label for="pAd">Ad Soyad</label><input type="text" id="pAd" value="' + esc(k.fullName) + '" autocomplete="name" maxlength="80"></div>' +
    '<div class="row2"><div class="field"><label for="pIl">İl</label><select id="pIl"><option value="">Seç...</option></select></div>' +
    '<div class="field"><label for="pIlce">İlçe</label><input type="text" id="pIlce" value="' + esc(k.district || '') + '" maxlength="60"></div></div>' +
    '<div class="field"><label for="pAdres">Adres</label><input type="text" id="pAdres" value="' + esc(k.address || '') + '" autocomplete="street-address" maxlength="200"></div>' +
    /* Okulun açtığı hesapta T.C. no'yu okul yönetimi düzenler. */
    (u.okulActi && !hs
      ? '<div class="field"><label>T.C. kimlik no</label><div class="salt-okunur">' + esc(u.tc || '—') + '</div>' +
        '<div class="hint">Yalnızca sen ve okul yönetimi görür. Yanlışsa okul yönetimine söyle.</div></div>'
      : '<div class="field"><label for="pTc">T.C. kimlik no (isteğe bağlı)</label>' +
        '<input type="text" id="pTc" inputmode="numeric" maxlength="11" autocomplete="off" spellcheck="false" ' +
        'value="' + esc(k.tc || '') + '" placeholder="11 haneli">' +
        '<div class="hint">Yalnızca sen görürsün. Boş bırakabilirsin.</div></div>') +
    /* Doğum tarihi öğrenciden istenir; başkasında yalnızca daha önce
       girilmişse gösterilir (silebilsin diye). */
    (u.role === 'student' || k.dogum
      ? '<div class="field"><label for="pDogumGun">Doğum tarihi' + (u.role === 'student' ? '' : ' (isteğe bağlı)') + '</label>' +
        tarihSecici('pDogum', k.dogum || '', { enKucukYas: u.role === 'student' ? 3 : 16 }) + '</div>'
      : '') +
    '<button class="btn" data-act="profil-kaydet">Kaydet</button><div id="pMesaj" style="margin-top:10px"></div></div>';

  /* Eski düzende okulun açtığı öğretmen/müdür hesabı: çocuğunu veli koduyla
     bağlar. Yetişkin hesabında bu iş "Hesap değiştir > Ekle"dedir. */
  if ((u.role === 'teacher' || u.role === 'principal') && !hs) {
    h += '<div class="kart"><h3>Veli olarak çocuğunu ekle</h3>' +
      '<div class="hint" style="margin-bottom:9px">Çocuğun (bu okulda ya da başka bir okulda) okuyorsa ' +
      '<b>veli kodunu</b> gir. Menüne "Velisi olduğum" bölümü eklenir; okul yönetimi de seni veli olarak bağlayabilir.</div>' +
      '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
      '<input type="text" id="veliKod" placeholder="ör. ABCDE-FGH23" maxlength="20" autocapitalize="characters" ' +
      'autocomplete="off" spellcheck="false" style="flex:1;min-width:180px;padding:11px 12px;border:1.5px solid var(--cizgi);border-radius:10px">' +
      '<button class="btn" data-act="cocuk-ekle">Ekle</button></div><div id="veliMesaj" style="margin-top:9px"></div>' +
      (S.children && S.children.length ? '<div class="hint" style="margin-top:9px">Bağlı çocuğun: ' +
        S.children.map(function (c) { return esc(c.fullName); }).join(', ') + '</div>' : '') +
      '</div>';
  }

  h += '<div class="kart"><h3>Telefon bildirimleri</h3><div id="bildirimAyar"><div class="hint">Yükleniyor...</div></div>' +
    '<div id="bildirimAyarMesaj" style="margin-top:9px"></div></div>';

  if (u.role === 'principal') {
    h += '<div class="kart"><h3>Okulun adresi ve konumu</h3>' +
      '<div class="satir" style="border:0;padding:0"><div class="buyu"><div class="ad">' +
      esc(u.schoolSlug ? location.host + '/' + u.schoolSlug : 'Henüz seçilmedi') + '</div>' +
      '<div class="alt">Öğrenci ve öğretmenler okulun bu adresinden girer.</div></div>' +
      '<button class="btn kucuk ghost" data-nav="okul-ayarlari">Değiştir</button></div></div>';
  }

  /* Görünüm: seçim hem bu tarayıcıda hem hesapta saklanır. */
  var suanki = window.temaOku ? window.temaOku() : 'sistem';
  var temalar = [['sistem', 'Sistem'], ['acik', 'Açık'], ['koyu', 'Koyu']];
  h += '<div class="kart"><h3>Görünüm</h3>' +
    '<div class="hint" style="margin-bottom:10px">Koyu tema akşam gözü yormaz. ' +
    '"Sistem" seçilirse bilgisayarın ya da telefonun kendi ayarına uyar.</div>' +
    '<div class="tema-secim">';
  for (var ti = 0; ti < temalar.length; ti++) {
    h += '<button class="btn kucuk' + (temalar[ti][0] === suanki ? '' : ' gri') + '" ' +
      'data-act="tema-sec" data-deger="' + temalar[ti][0] + '">' + temalar[ti][1] + '</button> ';
  }
  h += '</div></div>';

  h += '<div class="kart"><h3>Şifre değiştir</h3>' +
    '<div class="field"><label for="sEski">Mevcut şifren</label>' +
    '<input type="password" id="sEski" autocomplete="current-password"></div>' +
    '<div class="field"><label for="sYeni">Yeni şifren</label>' +
    '<input type="password" id="sYeni" autocomplete="new-password" aria-describedby="sKural">' +
    sifreKuralListesi('sKural', gucluSifreli(u)) + '</div>' +
    '<div class="field"><label for="sYeni2">Yeni şifren (tekrar)</label>' +
    '<input type="password" id="sYeni2" autocomplete="new-password"></div>' +
    '<button class="btn" data-act="sifre-kaydet">Şifreyi değiştir</button>' +
    '<div id="sMesaj" style="margin-top:10px"></div></div>';

  /* Yetişkinler açılış sayfasına yorum bırakabilir (sunucu kimin yazabileceğine bakar). */
  if (u.yetiskin || u.rolSatiri) {
    h += '<div class="kart" id="yorumKart"><h3>Eğitim Evi hakkında yorumun</h3>' +
      '<div id="yorumIcerik" class="hint">Yükleniyor...</div></div>';
  }

  if (hs) {
    h += '<div class="kart"><h3>Hesabımı sil</h3>' +
      '<p class="hint">Hesabın, çocuklarınla bağın, öğretmeni olduğun okullardaki yerin ve bildirimlerin silinir; ' +
      'geri alınamaz. Verdiğin ödevler ve notlar okulda kalır. Bir okulun müdürüysen önce müdürlüğü devretmelisin.</p>' +
      '<div class="field"><label for="silSifre">Mevcut şifren</label>' +
      '<input type="password" id="silSifre" autocomplete="current-password"></div>' +
      '<button class="btn tehlike" data-act="benim-hesap-sil">Hesabımı sil</button>' +
      '<div id="silMesaj" style="margin-top:10px"></div></div>';
  }

  h += '<button class="btn tehlike" data-act="cikis">Çıkış yap</button>';
  yaz(h);

  var il = $('pIl');
  for (var i = 0; i < S.meta.cities.length; i++) {
    il.insertAdjacentHTML('beforeend', '<option value="' + esc(S.meta.cities[i]) + '"' +
      (S.meta.cities[i] === k.city ? ' selected' : '') + '>' + esc(S.meta.cities[i]) + '</option>');
  }
  bildirimKartiCiz();
  if ($('sYeni')) $('sYeni').addEventListener('input', function () { sifreKurallariniIsaretle('sYeni', 'sKural'); });
  if ($('yorumKart')) yorumKartiniDoldur();
}

EYLEMLER['yorum-sil'] = function () {
  if (!confirm('Yorumun silinsin mi?')) return;
  return api('/yorumlar/sil', 'POST', {}).then(function () { yorumKartiniDoldur(); })['catch'](hataGoster);
};

/* Kullanıcı adı, e-posta, telefon. Değişiklik mevcut şifreyle onaylanır;
   yalnızca değişen alan gönderilir. */
function girisBilgileriKarti(hs) {
  return '<div class="kart" id="girisBilgiKart"><h3>Giriş bilgileri</h3>' +
    (hs.email ? '' : '<div class="msg uyari">Hesabında e-posta yok. Ekle: giriş kodu ve şifre sıfırlama bağlantısı oraya gelir.</div>') +
    '<div class="field"><label for="hKadi">Kullanıcı adı</label>' +
    '<input type="text" id="hKadi" value="' + esc(hs.username) + '" data-ilk="' + esc(hs.username) + '" autocomplete="username" ' +
    'autocapitalize="off" spellcheck="false" maxlength="30"></div>' +
    '<div class="field"><label for="hEposta">E-posta</label>' +
    '<input type="email" id="hEposta" value="' + esc(hs.email) + '" data-ilk="' + esc(hs.email) + '" autocomplete="email" ' +
    'autocapitalize="off" spellcheck="false" maxlength="120" placeholder="e-posta adresin">' +
    '<div class="hint">İki adımlı giriş: her girişte bu adrese bir kod gelir. Yetişkin hesaplarında hep açıktır.</div></div>' +
    '<div class="field"><label for="hTelefon">Telefon</label>' +
    '<input type="tel" id="hTelefon" value="' + esc(hs.phone) + '" data-ilk="' + esc(hs.phone) + '" autocomplete="tel" ' +
    'inputmode="tel"></div>' +
    '<div class="field"><label for="hSifre">Mevcut şifren</label>' +
    '<input type="password" id="hSifre" autocomplete="current-password">' +
    '<div class="hint">Değişikliği onaylamak için.</div></div>' +
    '<button class="btn" data-act="benim-bilgi-kaydet">Kaydet</button><div id="hMesaj" style="margin-top:10px"></div></div>';
}

EYLEMLER['benim-hesap-sil'] = function (el) {
  var kutu = $('silSifre');
  alanTemizle(kutu.closest('.field'));
  if (!kutu.value) { alanHatasi(kutu, 'Mevcut şifreni yaz.'); kutu.focus(); return; }
  if (!confirm('Hesabın ve bütün bilgilerin kalıcı olarak silinsin mi? Bu geri alınamaz.')) return;
  dugmeBekle(el, 'Siliniyor...');
  return api('/hesap/sil', 'POST', { sifre: kutu.value, onay: true }).then(function (d) {
    return bildirimAboneligiBirak().then(function () {
      cikisYap(true);
      $('authMesaj').innerHTML = '<div class="msg iyi">' + esc(d.message) + '</div>';
    });
  })['catch'](function (e) {
    dugmeBitir(el);
    if (e.veri && e.veri.alan === 'sifre') { alanHatasi(kutu, e.message); kutu.focus(); }
    else mesajGoster('silMesaj', 'hata', e.message);
  });
};

