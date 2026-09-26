/* Okulun açtığı hesaplar: öğrenci ve servisçi (eski düzende açılmış öğretmen
   hesabı da burada düzenlenir). Ad, soyad ve T.C. no zorunlu; kullanıcı adı
   ve şifre boş bırakılırsa T.C. no olur, kişi ilk girişte kendi şifresini
   belirler. Öğretmen ise kendi hesabını açar; okul onu koduyla ekler
   (ogretmen-kodla) ve yalnızca branşını düzenler.
   Bütün kurallar sunucuda; burada yalnızca yazarken yol gösterilir. */

var HESAP_ROL = {
  student: { ad: 'öğrenci', yeni: 'Yeni öğrenci hesabı', sayfa: 'okul-ogrenciler' },
  teacher: { ad: 'öğretmen', yeni: 'Yeni öğretmen hesabı', sayfa: 'ogretmenler' },
  servisci: { ad: 'servisçi', yeni: 'Yeni servisçi hesabı', sayfa: 'servis' }
};

/* "Ayşe Nur Yılmaz" -> ad "Ayşe Nur", soyad "Yılmaz" */
function adBol(tam) {
  var p = String(tam || '').trim().split(/\s+/);
  if (p.length < 2) return { ad: p[0] || '', soyad: '' };
  return { ad: p.slice(0, -1).join(' '), soyad: p[p.length - 1] };
}

/* Pencerenin alanları. h: düzenlenen hesap (yoksa yeni). */
function hesapAlanlari(rol, h) {
  var yeni = !h;
  h = h || {};
  var ad = adBol(h.fullName);
  var f = '<div class="row2">' +
    '<div class="field"><label for="hfAd">Ad</label>' +
    '<input type="text" id="hfAd" maxlength="60" autocomplete="off" value="' + esc(ad.ad) + '"></div>' +
    '<div class="field"><label for="hfSoyad">Soyad</label>' +
    '<input type="text" id="hfSoyad" maxlength="40" autocomplete="off" value="' + esc(ad.soyad) + '"></div></div>' +
    '<div class="field"><label for="hfTc">T.C. kimlik no</label>' +
    '<input type="text" id="hfTc" inputmode="numeric" maxlength="11" autocomplete="off" spellcheck="false" ' +
    'value="' + esc(h.tc || '') + '" placeholder="11 haneli">' +
    '<div class="hint">Yalnızca okul yönetimi görür; öğretmenler ve öğrenciler görmez.</div></div>' +
    '<div class="field"><label for="hfKadi">Kullanıcı adı</label>' +
    '<input type="text" id="hfKadi" maxlength="30" autocomplete="off" autocapitalize="off" spellcheck="false" ' +
    'value="' + esc(h.username || '') + '" placeholder="' + (yeni ? 'Boş bırakırsan T.C. no olur' : '') + '">' +
    '<div class="hint">Harfle başlar; harf, rakam, nokta ve alt çizgi. Okulun içinde tek olmalı.</div></div>';
  if (yeni) {
    f += '<div class="field"><label for="hfSifre">Şifre</label>' +
      '<input type="text" id="hfSifre" autocomplete="off" spellcheck="false" placeholder="Boş bırakırsan T.C. no olur">' +
      '<div class="hint">Boşsa şifre T.C. kimlik no olur ve kişi ilk girişte kendi şifresini belirlemeden devam edemez.</div></div>';
  }
  f += '<div class="field"><label for="hfEposta">E-posta (isteğe bağlı)</label>' +
    '<input type="email" id="hfEposta" autocomplete="off" autocapitalize="off" spellcheck="false" ' +
    'value="' + esc(h.email || '') + '"' + (h.olusturan === 'kendisi' ? ' disabled' : '') + '>' +
    (h.olusturan === 'kendisi' ? '<div class="hint">Bu hesabı kişi kendisi açtı; e-postasını yalnızca kendisi değiştirebilir.</div>'
      : '<div class="hint">Yazılırsa giriş kodu ve şifre sıfırlama bağlantısı oraya gider.</div>') + '</div>' +
    '<div class="field"><label for="hfDogumGun">Doğum tarihi (isteğe bağlı)</label>' +
    tarihSecici('hfDogum', h.dogum || '', { enKucukYas: rol === 'student' ? 3 : 17 }) +
    (rol === 'student' && yeni ? '<div class="hint">Başka okuldan gelen öğrencide gerekli: T.C. no ile doğum tarihi ' +
      'önceki kaydıyla eşleşirse yeni hesap açılmaz, öğrencinin hesabı okuluna taşınır.</div>' : '') + '</div>';

  if (rol === 'student') {
    var siniflar = S._sinifListe || [];
    f += '<div class="row2"><div class="field"><label for="hfSinif">Sınıf</label><select id="hfSinif">' +
      '<option value="">— sınıfsız —</option>';
    for (var i = 0; i < siniflar.length; i++) {
      f += '<option value="' + esc(siniflar[i].id) + '"' + (h.classId === siniflar[i].id ? ' selected' : '') + '>' +
        esc(siniflar[i].name) + '</option>';
    }
    f += '</select></div>' +
      '<div class="field"><label for="hfOkulNo">Okul no (isteğe bağlı)</label>' +
      '<input type="text" id="hfOkulNo" maxlength="20" autocomplete="off" value="' + esc(h.okulNo || '') + '"></div></div>';
  } else {
    f += '<div class="field"><label for="hfTelefon">Telefon (isteğe bağlı)</label>' +
      '<input type="tel" id="hfTelefon" inputmode="tel" maxlength="20" autocomplete="off" ' +
      'value="' + esc(h.telefon || '') + '">' +
      (rol === 'servisci' ? '<div class="hint">Servisteki öğrencilerin velileri bu numarayı görür.</div>' : '') + '</div>';
  }
  if (rol === 'teacher') {
    var dersler = (S.meta && S.meta.subjects) || [];
    f += '<div class="field"><label for="hfBrans">Branş (isteğe bağlı)</label><select id="hfBrans">' +
      '<option value="">— belirtme —</option>';
    for (var j = 0; j < dersler.length; j++) {
      f += '<option value="' + esc(dersler[j]) + '"' + (h.brans === dersler[j] ? ' selected' : '') + '>' + esc(dersler[j]) + '</option>';
    }
    f += '</select></div>';
  }
  f += '<div class="field"><label for="hfAdres">Adres (isteğe bağlı)</label>' +
    '<textarea id="hfAdres" rows="2" maxlength="200">' + esc(h.adres || '') + '</textarea></div>';
  if (rol === 'student') {
    f += '<div class="field"><label for="hfNot">Yönetim notu (isteğe bağlı)</label>' +
      '<textarea id="hfNot" rows="2" maxlength="300">' + esc(h.not || '') + '</textarea>' +
      '<div class="hint">Yalnızca okul yönetimi görür.</div></div>';
  }
  return f;
}

/* Penceredeki alanlardan gövde. */
function hesapGovdesi(rol) {
  var v = function (id) { return $(id) ? $(id).value : undefined; };
  var g = {
    ad: v('hfAd'), soyad: v('hfSoyad'), tc: (v('hfTc') || '').replace(/\s/g, ''),
    kullaniciAdi: (v('hfKadi') || '').trim().toLowerCase(), eposta: $('hfEposta') && !$('hfEposta').disabled ? v('hfEposta').trim() : undefined,
    dogum: v('hfDogum'), adres: v('hfAdres')
  };
  if ($('hfSifre')) g.sifre = v('hfSifre');
  if (rol === 'student') { g.classId = v('hfSinif'); g.okulNo = v('hfOkulNo'); g.not = v('hfNot'); }
  else g.telefon = telefonOku($('hfTelefon'));
  if (rol === 'teacher') g.brans = v('hfBrans');
  return g;
}

/* Sunucuya gitmeden önce: zorunlu alanlar ve biçim. mevcut: düzenlenen hesap
   (kullanıcı adı eski T.C. no olarak kalmışsa ve değiştirilmiyorsa engellenmez). */
function hesapDenetle(g, yeni, mevcut) {
  var kok = $('modalGovde');
  formHatalariniSil(kok);
  if (!String(g.ad || '').trim()) alanHatasi('hfAd', 'Adı yaz.');
  if (!String(g.soyad || '').trim()) alanHatasi('hfSoyad', 'Soyadı yaz.');
  if (!g.tc) { if (yeni) alanHatasi('hfTc', 'T.C. kimlik no gerekli.'); }
  else if (tcSorunuTR(g.tc)) alanHatasi('hfTc', tcSorunuTR(g.tc));
  if (g.kullaniciAdi && !/^[0-9]+$/.test(g.kullaniciAdi) && kullaniciAdiSorunuTR(g.kullaniciAdi)) {
    alanHatasi('hfKadi', kullaniciAdiSorunuTR(g.kullaniciAdi));
  }
  if (g.kullaniciAdi && /^[0-9]+$/.test(g.kullaniciAdi) && g.kullaniciAdi !== g.tc &&
      !(mevcut && g.kullaniciAdi === mevcut.username)) {
    alanHatasi('hfKadi', 'Rakamlardan oluşan kullanıcı adı yalnızca kişinin T.C. no\'su olabilir.');
  }
  if (g.sifre && sifreSorunuTR(g.sifre, gucluSifreli({ role: g.rol }))) alanHatasi('hfSifre', sifreSorunuTR(g.sifre, gucluSifreli({ role: g.rol })));
  if (g.eposta && !EPOSTA_DESENI.test(g.eposta)) alanHatasi('hfEposta', 'E-posta adresi eksik ya da hatalı görünüyor.');
  if (g.telefon && telefonSorunuTR(g.telefon)) alanHatasi('hfTelefon', telefonSorunuTR(g.telefon));
  if (tarihSeciciDurum('hfDogum') === 'eksik') alanHatasi('hfDogumGun', 'Gün, ay ve yılın üçünü de seç ya da hepsini boş bırak.');
  if (kok.querySelector('.hatali')) { ilkHatayaGit(kok); return false; }
  return true;
}

/* ---------------- yeni hesap ---------------- */
function hesapYeniModal(rol) {
  var r = HESAP_ROL[rol];
  if (!r || rol === 'teacher') return Promise.resolve();
  var yukle = rol === 'student' && !S._sinifListe
    ? api('/school/classes').then(function (d) { S._sinifListe = d.classes; })['catch'](function () { S._sinifListe = []; })
    : Promise.resolve();
  return yukle.then(function () {
    modalAc(r.yeni, hesapAlanlari(rol, null) + '<div id="hesapMesaj" style="margin-top:9px"></div>',
      '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
      '<button class="btn" data-act="hesap-ac-kaydet" data-rol="' + rol + '">Hesabı aç</button>');
    hesapTcBagla();
    $('hfAd').focus();
  });
}

/* T.C. kutusu yalnızca rakam alır; kullanıcı adı yazılırken küçük harfe döner. */
function hesapTcBagla() {
  if ($('hfTc')) $('hfTc').addEventListener('input', function () {
    var t = this.value.replace(/[^0-9]/g, '').slice(0, 11);
    if (t !== this.value) this.value = t;
  });
  if ($('hfKadi')) $('hfKadi').addEventListener('input', function () {
    var y = this.value.replace(/İ/g, 'i').toLowerCase().replace(/\s/g, '.');
    if (y !== this.value) this.value = y;
  });
}

EYLEMLER['hesap-yeni'] = function (el) {
  return hesapYeniModal(el.getAttribute('data-rol'))['catch'](hataGoster);
};

EYLEMLER['hesap-ac-kaydet'] = function (el) {
  var rol = el.getAttribute('data-rol');
  var g = hesapGovdesi(rol);
  g.rol = rol;
  if (!hesapDenetle(g, true)) return;
  dugmeBekle(el, 'Açılıyor...');
  return api('/school/hesap-ac', 'POST', g).then(function (d) {
    var k = d.hesap;
    if (k.nakil) return nakilSonucu(d, rol);
    /* Şifre yalnızca burada, bir kez gösterilir. */
    var sifreSatiri = k.varsayilanSifre
      ? '<div class="satir"><div class="buyu"><div class="alt">Şifre</div>' +
        '<div class="ad">T.C. kimlik numarası</div>' +
        '<div class="alt">İlk girişte kendi şifresini belirleyecek.</div></div></div>'
      : '<div class="satir"><div class="buyu"><div class="alt">Şifre</div>' +
        '<div class="kod-goster">' + esc(g.sifre) + '</div></div>' +
        '<button class="btn ghost kucuk" data-act="kod-kopyala" data-kod="' + esc(g.sifre) + '">Kopyala</button></div>';
    modalAc('Hesap açıldı',
      '<div class="msg iyi">' + esc(d.message) + '</div>' +
      '<div class="satir"><div class="buyu"><div class="alt">Kullanıcı adı</div>' +
      '<div class="ad">' + esc(k.username) + '</div></div>' +
      '<button class="btn ghost kucuk" data-act="kod-kopyala" data-kod="' + esc(k.username) + '">Kopyala</button></div>' +
      sifreSatiri +
      (S.user.schoolSlug ? '<div class="satir"><div class="buyu"><div class="alt">Giriş adresi</div>' +
        '<div class="ad">' + esc(location.host + '/' + S.user.schoolSlug) + '</div></div></div>' : '') +
      (k.code ? '<div class="satir"><div class="buyu"><div class="alt">Veli kodu</div>' +
        '<div class="kod-goster">' + esc(kodBicimle(k.code)) + '</div></div>' +
        '<button class="btn ghost kucuk" data-act="kod-kopyala" data-kod="' + esc(kodBicimle(k.code)) + '">Kopyala</button></div>' : '') +
      (k.varsayilanSifre ? '' : '<div class="hint">Bu şifre bir daha gösterilemez; şimdi kişiye ilet.</div>'),
      '<button class="btn ghost" data-act="hesap-yeni" data-rol="' + esc(rol) + '">Bir tane daha aç</button>' +
      '<button class="btn" data-act="hesap-bitti" data-rol="' + esc(rol) + '">Tamam</button>');
  })['catch'](function (e) {
    dugmeBitir(el);
    /* T.C. başka okuldaki bir öğrencinin: doğum tarihiyle doğrulanınca taşınır. */
    if (e.veri && e.veri.nakil === 'dogum' && $('hfDogumGun')) alanHatasi('hfDogumGun', 'Doğum tarihini seç.');
    mesajGoster('hesapMesaj', 'hata', e.message);
  });
};

/* Başka okuldan gelen öğrenci: yeni hesap açılmadı, var olanı bu okula taşındı.
   Şifresi kendisinde; burada gösterilecek şifre yok. */
function nakilSonucu(d, rol) {
  var k = d.hesap;
  modalAc('Öğrenci okuluna taşındı',
    '<div class="msg iyi">' + esc(d.message) + '</div>' +
    '<div class="satir"><div class="buyu"><div class="alt">Kullanıcı adı</div>' +
    '<div class="ad">' + esc(k.username) + '</div></div>' +
    '<button class="btn ghost kucuk" data-act="kod-kopyala" data-kod="' + esc(k.username) + '">Kopyala</button></div>' +
    '<div class="hint">Önceki okulundaki ödev, not ve devamsızlık kayıtları o okulda kalır; sen görmezsin. ' +
    'Öğrenci ve velisi eğitim yılı seçicisinden bakabilir.</div>',
    '<button class="btn ghost" data-act="hesap-yeni" data-rol="' + esc(rol) + '">Bir tane daha ekle</button>' +
    '<button class="btn" data-act="hesap-bitti" data-rol="' + esc(rol) + '">Tamam</button>');
}

EYLEMLER['hesap-bitti'] = function () {
  modalKapat();
  return git(S.page);
};

/* ---------------- düzenleme ---------------- */
function hesapDuzenleModal(id) {
  var ilk = S._sinifListe ? Promise.resolve() : api('/school/classes').then(function (d) { S._sinifListe = d.classes; })['catch'](function () { S._sinifListe = []; });
  return ilk.then(function () { return api('/school/hesap?id=' + encodeURIComponent(id)); }).then(function (d) {
    var h = d.hesap;
    S._duzenlenen = h;
    if (h.bagli) return bagliOgretmenModal(h);
    var sil = (h.rol === 'teacher' && yetkim('ogretmen.cikar')) || (h.rol === 'servisci' && yetkim('servis.yonet'));
    var govde = hesapAlanlari(h.rol, h) +
      '<button class="btn kucuk" data-act="hesap-bilgi-kaydet" data-id="' + esc(h.id) + '">Bilgileri kaydet</button>' +
      '<div id="hesapMesaj" style="margin-top:9px"></div>' +
      '<hr class="ayrac-cizgi">' +
      '<h4 class="alt-baslik">Şifre</h4>' +
      '<div class="hint" style="margin-bottom:9px">Şifreler geri döndürülemez biçimde saklanır, görüntülenemez. ' +
      (h.sifreDegismeli ? 'Bu kişi henüz kendi şifresini belirlemedi. ' : '') +
      (h.girisYapti ? '' : 'Hesaba hiç giriş yapılmadı. ') + 'Unuttuysa yenisini belirle.</div>' +
      '<div class="sifre-satir">' +
      '<input type="text" id="hfYeniSifre" placeholder="Yeni şifre" autocomplete="off" spellcheck="false">' +
      '<button class="btn kucuk gri" data-act="hesap-sifre-uret">Rastgele üret</button>' +
      '<button class="btn kucuk tehlike" data-act="hesap-sifre-kaydet" data-id="' + esc(h.id) + '">Şifreyi değiştir</button></div>' +
      '<label class="onay-satiri"><input type="checkbox" id="hfDegistirsin" checked> ' +
      '<span>İlk girişte kendi şifresini belirlesin</span></label>' +
      (h.tc ? '<button class="btn kucuk ghost" data-act="hesap-sifre-tc" data-id="' + esc(h.id) + '">Şifreyi T.C. no yap</button>' : '') +
      '<div id="hesapSifreMesaj" style="margin-top:9px"></div>';

    if (h.rol === 'student') {
      govde += '<hr class="ayrac-cizgi"><h4 class="alt-baslik">Veli kodu</h4>' +
        '<div class="kod-goster">' + esc(kodBicimle(h.code)) + '</div>' +
        '<div class="dugme-satir">' +
        '<button class="btn ghost kucuk" data-act="kod-kopyala" data-kod="' + esc(kodBicimle(h.code)) + '">Kopyala</button>' +
        '<button class="btn gri kucuk" data-act="kod-yenile" data-id="' + esc(h.id) + '">Yeni kod üret</button></div>' +
        '<hr class="ayrac-cizgi"><h4 class="alt-baslik">Veliler</h4>' +
        '<div id="hVeliler" data-ogrenci="' + esc(h.id) + '"><div class="okul-bilgi">Yükleniyor...</div></div>' +
        '<div class="field" style="margin-top:9px"><label for="hVeliAra">Veli bağla</label>' +
        '<div class="rolsuz-satir"><input type="text" id="hVeliAra" placeholder="Velinin T.C. kimlik no\'su ya da kullanıcı adı" ' +
        'autocomplete="off" spellcheck="false" maxlength="40">' +
        '<button class="btn kucuk" data-act="veli-bul" data-id="' + esc(h.id) + '">Bul</button></div>' +
        '<div class="hint">Veli önce Eğitim Evi\'ne kaydolmuş olmalı. Veli kodu ile kendisi de bağlanabilir.</div></div>' +
        '<div id="hVeliSonuc"></div>';
    }
    if (sil) {
      govde += '<hr class="ayrac-cizgi"><h4 class="alt-baslik">Hesabı sil</h4>' +
        '<div class="hint" style="margin-bottom:9px">' + (h.rol === 'teacher'
          ? 'Öğretmenin dersleri öğretmensiz kalır; verdiği ödev ve sınavlar silinmez.'
          : 'Servisçinin servis ataması kalkar; açık seferi varsa kapanır.') + '</div>' +
        '<button class="btn kucuk tehlike" data-act="hesap-sil" data-id="' + esc(h.id) + '" data-ad="' + esc(h.fullName) + '">Hesabı sil</button>';
    }
    modalAc(h.fullName + ' — ' + (ROL_AD[h.rol] || 'Hesap'), govde);
    hesapTcBagla();
    if (h.rol === 'student') velileriYukle(h.id);
  });
}

/* Kendi hesabıyla eklenmiş öğretmen: adı, e-postası, şifresi kendisinin.
   Okul yalnızca branşını değiştirir ya da onu okuldan çıkarır. */
function bransSecici(secili) {
  var dersler = (S.meta && S.meta.subjects) || [];
  var f = '<select id="hfBrans"><option value="">— belirtme —</option>';
  for (var j = 0; j < dersler.length; j++) {
    f += '<option value="' + esc(dersler[j]) + '"' + (secili === dersler[j] ? ' selected' : '') + '>' + esc(dersler[j]) + '</option>';
  }
  return f + '</select>';
}

function bagliOgretmenModal(h) {
  var govde = '<p class="hint">Bu öğretmen kendi Eğitim Evi hesabıyla bağlı. Adını, e-postasını ve şifresini ' +
    'kendisi yönetir; T.C. kimlik numarası okulla paylaşılmaz.</p>' +
    '<div class="satir"><div class="buyu"><div class="alt">Okuldaki kullanıcı adı</div><div class="ad">' + esc(h.username) + '</div></div></div>' +
    '<div class="field" style="margin-top:10px"><label for="hfBrans">Branş</label>' + bransSecici(h.brans) + '</div>' +
    '<button class="btn kucuk" data-act="bagli-brans-kaydet" data-id="' + esc(h.id) + '">Branşı kaydet</button>' +
    '<div id="hesapMesaj" style="margin-top:9px"></div>';
  if (yetkim('ogretmen.cikar')) {
    govde += '<hr class="ayrac-cizgi"><h4 class="alt-baslik">Okuldan çıkar</h4>' +
      '<div class="hint" style="margin-bottom:9px">Öğretmenin bu okuldaki rolü kalkar; hesabı kendisinde kalır. ' +
      'Dersleri öğretmensiz kalır; verdiği ödev ve sınavlar silinmez.</div>' +
      '<button class="btn kucuk tehlike" data-act="hesap-sil" data-id="' + esc(h.id) + '" data-ad="' + esc(h.fullName) + '" ' +
      'data-bagli="1">Okuldan çıkar</button>';
  }
  modalAc(h.fullName + ' — Öğretmen', govde);
}

EYLEMLER['bagli-brans-kaydet'] = function (el, id) {
  var h = S._duzenlenen;
  if (!h || h.id !== id) return;
  var brans = $('hfBrans').value;
  if (brans === (h.brans || '')) { mesajGoster('hesapMesaj', 'bilgi', 'Değişiklik yok.'); return; }
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/school/hesap-guncelle', 'POST', { id: id, brans: brans }).then(function (d) {
    dugmeBitir(el);
    S._duzenlenen = d.hesap;
    mesajGoster('hesapMesaj', 'iyi', 'Branş kaydedildi.');
    if (S.page === 'ogretmenler') git(S.page);
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('hesapMesaj', 'hata', e.message); });
};

/* ---------------- öğretmeni koduyla ekle ---------------- */
EYLEMLER['ogretmen-kodla'] = function () {
  modalAc('Öğretmen ekle',
    '<div class="ekle-panel">' + cizim('ogretmen-kodu', 'ekle-panel-cizim') +
    '<p>Öğretmenden kişisel kodunu iste. Kodu Eğitim Evi\'nde <b>Ekle &gt; Öğretmen olarak katıl</b> ekranında görür. ' +
    'Kod bir kez kullanılır.</p>' +
    '<div class="field"><label for="okKod">Öğretmenin kodu</label>' +
    '<div class="rolsuz-satir"><input type="text" id="okKod" autocomplete="off" autocapitalize="characters" ' +
    'spellcheck="false" maxlength="20" placeholder="XXXXX-XXXXX">' +
    '<button class="btn" data-act="ogretmen-kod-bul">Bul</button></div></div>' +
    '<div id="okSonuc"></div></div>',
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>');
  $('okKod').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); EYLEMLER['ogretmen-kod-bul'](document.querySelector('[data-act="ogretmen-kod-bul"]')); }
  });
  $('okKod').focus();
};

EYLEMLER['ogretmen-kod-bul'] = function (el) {
  var kutu = $('okKod');
  alanTemizle(kutu.closest('.field'));
  $('okSonuc').innerHTML = '';
  var kod = kutu.value.replace(/[^0-9a-z]/gi, '').toUpperCase();
  if (kod.length !== 10) { alanHatasi(kutu, 'Kod 10 harf ve rakamdan oluşur (XXXXX-XXXXX).'); kutu.focus(); return; }
  dugmeBekle(el, 'Aranıyor...');
  return api('/school/ogretmen-bul?kod=' + encodeURIComponent(kod)).then(function (d) {
    dugmeBitir(el);
    if (d.kisi.zatenOkulda) {
      $('okSonuc').innerHTML = '<div class="msg bilgi">' + esc(d.kisi.ad) + ' okulunda zaten var.</div>';
      return;
    }
    $('okSonuc').innerHTML = '<div class="satir"><div class="buyu"><div class="alt">Bu kodun sahibi</div>' +
      '<div class="ad">' + esc(d.kisi.ad) + '</div>' +
      '<div class="alt">Adın bir kısmı gizli. Öğretmenin adıyla uyuşuyorsa ekle.</div></div></div>' +
      '<div class="field" style="margin-top:10px"><label for="hfBrans">Branş (isteğe bağlı)</label>' + bransSecici('') + '</div>' +
      '<button class="btn" data-act="ogretmen-kod-ekle" data-kod="' + esc(kod) + '">Okula ekle</button>' +
      '<div id="okMesaj" style="margin-top:9px"></div>';
  })['catch'](function (e) { dugmeBitir(el); alanHatasi(kutu, e.message); kutu.focus(); });
};

EYLEMLER['ogretmen-kod-ekle'] = function (el) {
  dugmeBekle(el, 'Ekleniyor...');
  return api('/school/ogretmen-ekle', 'POST', { kod: el.getAttribute('data-kod'), brans: $('hfBrans').value })
    .then(function (d) {
      modalKapat();
      return git('ogretmenler').then(function () { sayfaMesaji('iyi', d.message); });
    })['catch'](function (e) { dugmeBitir(el); mesajGoster('okMesaj', 'hata', e.message); });
};

EYLEMLER['hesap-duzenle'] = function (el, id) {
  return hesapDuzenleModal(id)['catch'](hataGoster);
};

EYLEMLER['hesap-bilgi-kaydet'] = function (el, id) {
  var h = S._duzenlenen;
  if (!h || h.id !== id) return;
  var g = hesapGovdesi(h.rol);
  if (!hesapDenetle(g, false, h)) return;
  /* Yalnızca değişen alanlar gider. */
  var eski = adBol(h.fullName);
  var once = { ad: eski.ad, soyad: eski.soyad, tc: h.tc, kullaniciAdi: h.username, eposta: h.email, dogum: h.dogum,
    adres: h.adres, classId: h.classId, okulNo: h.okulNo, not: h.not, telefon: h.telefon, brans: h.brans };
  var govde = { id: id };
  var degisen = 0;
  for (var k in g) {
    if (g[k] === undefined) continue;
    if (String(g[k]) === String(once[k] === undefined || once[k] === null ? '' : once[k])) continue;
    govde[k] = g[k];
    degisen++;
  }
  if (govde.ad !== undefined || govde.soyad !== undefined) { govde.ad = g.ad; govde.soyad = g.soyad; }
  if (!degisen) { mesajGoster('hesapMesaj', 'bilgi', 'Değişiklik yok.'); return; }
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/school/hesap-guncelle', 'POST', govde).then(function (d) {
    dugmeBitir(el);
    S._duzenlenen = d.hesap;
    mesajGoster('hesapMesaj', 'iyi', 'Bilgiler kaydedildi.');
    /* Arkadaki liste de güncellensin; pencere açık kalır. */
    var r = HESAP_ROL[h.rol];
    if (r && S.page === r.sayfa) git(S.page);
  })['catch'](function (e) {
    dugmeBitir(el);
    mesajGoster('hesapMesaj', 'hata', e.message);
  });
};

EYLEMLER['hesap-sifre-uret'] = function () {
  /* Okunması kolay ama tahmin edilmesi zor: karışan harfler (I, l, O, 0) yok. */
  var harfler = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  var rakam = '23456789';
  var dizi = new Uint32Array(10);
  (window.crypto || window.msCrypto).getRandomValues(dizi);
  var s = '';
  for (var u = 0; u < 8; u++) s += harfler[dizi[u] % harfler.length];
  s += rakam[dizi[8] % rakam.length] + rakam[dizi[9] % rakam.length];
  $('hfYeniSifre').value = s;
};

function hesapSifreGonder(el, id, sifre) {
  var degistirsin = $('hfDegistirsin') ? $('hfDegistirsin').checked : true;
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/school/hesap-sifre', 'POST', { id: id, password: sifre, degistirsin: degistirsin }).then(function (d) {
    dugmeBitir(el);
    mesajGoster('hesapSifreMesaj', 'iyi', d.message + (sifre ? ' Yeni şifre: ' + sifre : ''));
    if ($('hfYeniSifre')) $('hfYeniSifre').value = '';
  })['catch'](function (e) {
    dugmeBitir(el);
    mesajGoster('hesapSifreMesaj', 'hata', e.message);
  });
}

EYLEMLER['hesap-sifre-kaydet'] = function (el, id) {
  var s = $('hfYeniSifre').value;
  if (!s) { mesajGoster('hesapSifreMesaj', 'hata', 'Yeni şifreyi yaz ya da üret.'); return; }
  var sorun = sifreSorunuTR(s, gucluSifreli({ role: S._duzenlenen ? S._duzenlenen.rol : 'student' }));
  if (sorun) { mesajGoster('hesapSifreMesaj', 'hata', sorun); return; }
  if (!confirm('Şifre değiştirilsin mi? Kişinin açık oturumları kapanacak.')) return;
  return hesapSifreGonder(el, id, s);
};

EYLEMLER['hesap-sifre-tc'] = function (el, id) {
  if (!confirm('Şifre T.C. kimlik numarası olsun mu? Kişi ilk girişte kendi şifresini belirleyecek; açık oturumları kapanacak.')) return;
  return hesapSifreGonder(el, id, '');
};

EYLEMLER['hesap-sil'] = function (el, id) {
  var ad = el.getAttribute('data-ad') || 'Bu kişi';
  if (!confirm(el.getAttribute('data-bagli') === '1' ? ad + ' okuldan çıkarılsın mı?'
    : ad + ' hesabı silinsin mi?\n\nBu işlem geri alınamaz.')) return;
  dugmeBekle(el, 'Siliniyor...');
  return api('/school/hesap-sil', 'POST', { id: id, onay: true }).then(function (d) {
    modalKapat();
    return git(S.page).then(function () { sayfaMesaji('iyi', d.message); });
  })['catch'](function (e) { dugmeBitir(el); hataGoster(e); });
};

EYLEMLER['kod-yenile'] = function (el, id) {
  if (!confirm('Yeni veli kodu üretilsin mi? Eski kod çalışmaz olur.')) return;
  return api('/school/student-code-reset', 'POST', { studentId: id }).then(function (r) {
    mesajGoster('hesapSifreMesaj', 'iyi', 'Yeni veli kodu: ' + kodBicimle(r.code));
  })['catch'](hataGoster);
};
