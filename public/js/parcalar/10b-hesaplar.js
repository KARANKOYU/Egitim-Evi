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
