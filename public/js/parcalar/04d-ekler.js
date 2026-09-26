/* Dosya ekleme alanı: mesaj yazarken ve öğretmen ödev verirken.

   Dosya sürüklenip bırakılır ya da alana basınca cihazdan seçilir; birden
   çok dosya olur. Her dosya seçilir seçilmez yüklenir (taslak); mesaj
   gönderilince ya da ödev kaydedilince ona bağlanır. Eklerin toplamı en
   fazla 150 MB; dosyalar 7 gün sonra silinir. Sunucu: sunucu/bolumler/ekler.js

   Kullanım:
     ekAlani('mesaj', 'mesaj')            HTML
     ekAlaniKur('mesaj')                  pencere açıldıktan sonra olayları bağlar
     ekIdleri('mesaj')                    kaydederken gönderilecek yeni ekler
     ekSilinecekler('odevDuzelt')         düzeltmede kaldırılan eski ekler
     ekYukleniyor('mesaj')                yükleme sürüyorsa kaydetme bekler
     ekListesiGoster(ekler)               okuma tarafı: indirme düğmeli liste */

var EK_SINIR = 150 * 1024 * 1024;
var EK_UZANTILAR = ('pdf doc docx odt rtf txt xls xlsx ods csv ppt pptx odp key pages numbers ' +
  'jpg jpeg png gif webp heic heif bmp tif tiff svg psd ai mp3 m4a wav ogg aac flac mp4 mov m4v webm avi mkv 3gp ' +
  'zip rar 7z sb3 ggb py ipynb html css js java c cpp').split(' ');
var EKLER = {};   // alan kimliği -> { tur, dosyalar: [...], silinecek: [] }

function boyutYazi(n) {
  if (n >= 1024 * 1024) return sayiTR(Math.round(n / 1024 / 1024 * 10) / 10) + ' MB';
  return sayiTR(Math.max(1, Math.round(n / 1024))) + ' KB';
}

/* mevcut: düzeltilen ödevin var olan ekleri ({ id, ad, boyut, suresiDoldu }). */
function ekAlani(kimlik, tur, mevcut) {
  EKLER[kimlik] = {
    tur: tur, silinecek: [],
    dosyalar: (mevcut || []).filter(function (e) { return !e.suresiDoldu; }).map(function (e) {
      return { id: e.id, ad: e.ad, boyut: e.boyut, durum: 'tamam', mevcut: true };
    })
  };
  return '<div class="ek-alan" id="ekAlan-' + kimlik + '">' +
    '<label class="ek-birak" for="ekDosya-' + kimlik + '">' + ik('ek') +
    '<span><b>Dosya ekle</b>: buraya sürükle ya da basıp seç</span>' +
    '<small>Birden çok dosya olur. Toplam en fazla 150 MB; dosyalar 7 gün sonra silinir.</small></label>' +
    '<input type="file" id="ekDosya-' + kimlik + '" multiple hidden>' +
    '<ul class="ek-liste" id="ekListe-' + kimlik + '"></ul></div>';
}

function ekAlaniKur(kimlik) {
  var alan = $('ekAlan-' + kimlik), girdi = $('ekDosya-' + kimlik);
  if (!alan) return;
  var birak = alan.querySelector('.ek-birak');
  ['dragenter', 'dragover'].forEach(function (olay) {
    birak.addEventListener(olay, function (e) { e.preventDefault(); birak.classList.add('uzerinde'); });
  });
  ['dragleave', 'drop'].forEach(function (olay) {
    birak.addEventListener(olay, function (e) { e.preventDefault(); birak.classList.remove('uzerinde'); });
  });
  birak.addEventListener('drop', function (e) { ekDosyalariEkle(kimlik, e.dataTransfer && e.dataTransfer.files); });
  girdi.addEventListener('change', function () { ekDosyalariEkle(kimlik, this.files); this.value = ''; });
  ekListesiCiz(kimlik);
}

function ekToplam(kimlik) {
  return EKLER[kimlik].dosyalar.reduce(function (t, d) { return t + (d.durum === 'hata' ? 0 : d.boyut); }, 0);
}

function ekDosyalariEkle(kimlik, liste) {
  var s = EKLER[kimlik];
  for (var i = 0; liste && i < liste.length; i++) {
    var f = liste[i];
    var n = f.name.lastIndexOf('.'), u = n > 0 ? f.name.slice(n + 1).toLowerCase() : '';
    var sorun = !f.size ? 'Boş dosya.' : EK_UZANTILAR.indexOf(u) < 0 ? 'Bu dosya türü eklenemez.'
      : ekToplam(kimlik) + f.size > EK_SINIR ? 'Eklerin toplamı 150 MB\'ı geçiyor.' : '';
    var d = { ad: f.name, boyut: f.size, durum: sorun ? 'hata' : 'yukleniyor', hata: sorun, yuzde: 0 };
    s.dosyalar.push(d);
    if (!sorun) ekYukle(kimlik, d, f);
  }
  ekListesiCiz(kimlik);
}

function ekYukle(kimlik, d, dosya) {
  var xhr = new XMLHttpRequest();
  d.xhr = xhr;
  xhr.open('POST', '/api/ek/yukle?tur=' + encodeURIComponent(EKLER[kimlik].tur));
  if (S.token) xhr.setRequestHeader('Authorization', 'Bearer ' + S.token);
  xhr.setRequestHeader('X-Dosya-Adi', encodeURIComponent(dosya.name));
  xhr.upload.onprogress = function (e) {
    if (!e.lengthComputable) return;
    d.yuzde = Math.round(e.loaded / e.total * 100);
    var cubuk = document.querySelector('[data-ek-yuzde="' + kimlik + '-' + EKLER[kimlik].dosyalar.indexOf(d) + '"]');
    if (cubuk) cubuk.style.width = d.yuzde + '%';
  };
  xhr.onload = function () {
    var j = {};
    try { j = JSON.parse(xhr.responseText); } catch (e) { j = {}; }
    if (xhr.status === 200 && j.ek) { d.id = j.ek.id; d.durum = 'tamam'; }
    else { d.durum = 'hata'; d.hata = j.error || ('Yüklenemedi (' + xhr.status + ')'); }
    d.xhr = null;
    ekListesiCiz(kimlik);
  };
  xhr.onerror = function () { d.durum = 'hata'; d.hata = 'Bağlantı koptu.'; d.xhr = null; ekListesiCiz(kimlik); };
  xhr.onabort = function () { d.xhr = null; };
  xhr.send(dosya);
}

function ekListesiCiz(kimlik) {
  var s = EKLER[kimlik], kap = $('ekListe-' + kimlik);
  if (!s || !kap) return;
  kap.innerHTML = s.dosyalar.map(function (d, i) {
    return '<li class="ek-satir' + (d.durum === 'hata' ? ' hatali' : '') + '">' + ik('belge') +
      '<span class="ek-ad"><b>' + esc(d.ad) + '</b><small>' + boyutYazi(d.boyut) +
      (d.durum === 'yukleniyor' ? ' · yükleniyor' : d.durum === 'hata' ? ' · ' + esc(d.hata) : d.mevcut ? '' : ' · yüklendi') + '</small>' +
      (d.durum === 'yukleniyor' ? '<span class="ek-cubuk"><i data-ek-yuzde="' + kimlik + '-' + i + '" style="width:' + (d.yuzde || 0) + '%"></i></span>' : '') +
      '</span><button type="button" class="btn kucuk gri" data-act="ek-kaldir" data-alan="' + kimlik + '" data-id="' + i + '" ' +
      'aria-label="' + esc(d.ad) + ' dosyasını kaldır">Kaldır</button></li>';
  }).join('');
}

EYLEMLER['ek-kaldir'] = function (el, sira) {
  var kimlik = el.getAttribute('data-alan'), s = EKLER[kimlik];
  var d = s && s.dosyalar[Number(sira)];
  if (!d) return;
  if (d.xhr) d.xhr.abort();
  if (d.mevcut) s.silinecek.push(d.id);
  else if (d.id) api('/ek/sil', 'POST', { id: d.id })['catch'](function () { /* taslak zaten 6 saatte silinir */ });
  s.dosyalar.splice(Number(sira), 1);
  ekListesiCiz(kimlik);
};

function ekIdleri(kimlik) {
  var s = EKLER[kimlik];
  return s ? s.dosyalar.filter(function (d) { return d.durum === 'tamam' && !d.mevcut; }).map(function (d) { return d.id; }) : [];
}
function ekSilinecekler(kimlik) { return EKLER[kimlik] ? EKLER[kimlik].silinecek.slice() : []; }
function ekYukleniyor(kimlik) {
  return !!EKLER[kimlik] && EKLER[kimlik].dosyalar.some(function (d) { return d.durum === 'yukleniyor'; });
}

/* Okuma tarafı: mesajın ya da ödevin ekleri, indirme düğmesiyle. */
function ekListesiGoster(ekler) {
  if (!ekler || !ekler.length) return '';
  return '<div class="ekler-kutu"><h4>Ekler</h4><ul class="ek-liste">' + ekler.map(function (e) {
    var kalan = Math.ceil((new Date(e.bitis).getTime() - Date.now()) / 86400000);
    return '<li class="ek-satir' + (e.suresiDoldu ? ' soluk-satir' : '') + '">' + ik('belge') +
      '<span class="ek-ad"><b>' + esc(e.ad) + '</b><small>' + boyutYazi(e.boyut) + ' · ' +
      (e.suresiDoldu ? 'süresi doldu, silindi' : kalan <= 1 ? 'yarın silinir' : kalan + ' gün sonra silinir') + '</small></span>' +
      (e.suresiDoldu ? '' : '<button type="button" class="btn kucuk" data-act="ek-indir" data-id="' + esc(e.id) + '">İndir</button>') +
      '</li>';
  }).join('') + '</ul></div>';
}

/* İndirme: önce tek kullanımlık bilet, dosya doğrudan diske iner. */
EYLEMLER['ek-indir'] = function (el, id) {
  return api('/ek/bilet?id=' + encodeURIComponent(id)).then(function (d) { location.href = d.yol; })['catch'](hataGoster);
};
