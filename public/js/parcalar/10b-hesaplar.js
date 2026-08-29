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

