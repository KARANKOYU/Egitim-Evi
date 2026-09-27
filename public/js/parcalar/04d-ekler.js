/* Dosya ekleme alanı: mesaj yazarken ve öğretmen ödev verirken.

   Dosya sürüklenip bırakılır ya da alana basınca cihazdan seçilir; birden
   çok dosya olur. Her dosya seçilir seçilmez yüklenir (taslak); mesaj
   gönderilince ya da ödev kaydedilince ona bağlanır. Eklerin toplamı en
   fazla 50 MB (alanın altında "32 / 50 MB" doluluk çubuğu); dosyalar 7 gün
   sonra silinir. Büyük fotoğraf yüklenmeden önce küçültülür (04f-resim-kucult.js):
   satırda önce "Küçültülüyor…", sonra "8,4 MB → 620 KB"; yer denetimi küçülmüş
   boyutla yapılır. Sunucu: sunucu/bolumler/ekler.js

   Kullanım:
     ekAlani('mesaj', 'mesaj')            HTML
     ekAlaniKur('mesaj')                  pencere açıldıktan sonra olayları bağlar
     ekIdleri('mesaj')                    kaydederken gönderilecek yeni ekler
     ekSilinecekler('odevDuzelt')         düzeltmede kaldırılan eski ekler
     ekYukleniyor('mesaj')                yükleme sürüyorsa kaydetme bekler
     ekListesiGoster(ekler)               okuma tarafı: indirme düğmeli liste */

var EK_SINIR = 50 * 1024 * 1024;
var EK_UZANTILAR = ('pdf doc docx odt rtf txt xls xlsx ods csv ppt pptx odp key pages numbers ' +
  'jpg jpeg png gif webp heic heif bmp tif tiff svg psd ai mp3 m4a wav ogg aac flac mp4 mov m4v webm avi mkv 3gp ' +
  'zip rar 7z sb3 ggb py ipynb html css js java c cpp').split(' ');
var EKLER = {};   // alan kimliği -> { tur, dosyalar: [...], silinecek: [] }

function boyutYazi(n) {
  if (n >= 1024 * 1024) return sayiTR(Math.round(n / 1024 / 1024 * 10) / 10) + ' MB';
  return sayiTR(Math.max(1, Math.round(n / 1024))) + ' KB';
}

/* Doluluk çubuğundaki sayı: "32" ya da "0,4" (MB, bir ondalık; 0'dan büyükse en az 0,1). */
function mbSayi(n) {
  var mb = n / 1048576;
  return n <= 0 ? '0' : sayiTR(mb >= 10 ? Math.round(mb) : Math.max(0.1, Math.round(mb * 10) / 10));
}

/* Dosya alanının doluluk çubuğu: "Dosya alanın · 32 / 50 MB". Dolunca çubuğun
   altında yer açma uyarısı yazar (ödev teslimi ve ekler aynı görünüm). */
function dolulukCubugu(kullanilan, sinir, doluMetni) {
  var oran = Math.max(0, Math.min(100, Math.round(kullanilan / sinir * 100)));
  var dolu = kullanilan >= sinir;
  return '<div class="doluluk' + (dolu ? ' dolu' : oran >= 90 ? ' az-kaldi' : '') + '">' +
    '<div class="doluluk-ust"><span>Dosya alanın</span><b>' + mbSayi(kullanilan) + ' / ' + mbSayi(sinir) + ' MB</b></div>' +
    '<div class="doluluk-cubuk" role="progressbar" aria-label="Dosya alanın" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + oran + '">' +
    '<i style="width:' + oran + '%"></i></div>' +
    (dolu ? '<div class="doluluk-uyari" role="status">' + esc(doluMetni) + '</div>' : '') + '</div>';
}

/* Silinme anına göre "bugün / yarın / 5 gün sonra silinir" (takvim günüyle). */
function silinmeYazisi(bitis) {
  var t = new Date(bitis), simdi = new Date();
  if (isNaN(t.getTime())) return '';
  var gun = Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()) -
    new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate())) / 86400000);
  return gun <= 0 ? 'bugün silinir' : gun === 1 ? 'yarın silinir' : gun + ' gün sonra silinir';
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
    '<small>Birden çok dosya olur. Toplam en fazla 50 MB; dosyalar 7 gün sonra silinir. Büyük fotoğraflar küçültülerek yüklenir.</small></label>' +
    '<input type="file" id="ekDosya-' + kimlik + '" multiple hidden>' +
    '<div id="ekDoluluk-' + kimlik + '"></div>' +
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

/* Yüklenen ve yüklenmekte olanlar sayılır; hatalılar ve küçültülmekte olanlar
   (boyutları henüz belli değil) sayılmaz. */
function ekToplam(kimlik) {
  return EKLER[kimlik].dosyalar.reduce(function (t, d) {
    return t + (d.durum === 'hata' || d.durum === 'kucultuluyor' ? 0 : d.boyut);
  }, 0);
}

function ekSigmiyor(kimlik, boyut) {
  var kalan = EK_SINIR - ekToplam(kimlik);
  return boyut > kalan ? (kalan > 0 ? 'Sığmıyor: ' + boyutYazi(kalan) + ' boş yer kaldı.' : 'Dosya alanın doldu.') : '';
}

function ekDosyalariEkle(kimlik, liste) {
  var s = EKLER[kimlik];
  for (var i = 0; liste && i < liste.length; i++) {
    var f = liste[i];
    var n = f.name.lastIndexOf('.'), u = n > 0 ? f.name.slice(n + 1).toLowerCase() : '';
    /* Büyük fotoğrafın yer denetimi küçültüldükten sonra yapılır. */
    var kucult = EK_UZANTILAR.indexOf(u) >= 0 && resimKucultulebilir(f);
    var sorun = !f.size ? 'Boş dosya.' : EK_UZANTILAR.indexOf(u) < 0 ? 'Bu dosya türü eklenemez.'
      : kucult ? '' : ekSigmiyor(kimlik, f.size);
    var d = { ad: f.name, boyut: f.size, durum: sorun ? 'hata' : kucult ? 'kucultuluyor' : 'yukleniyor', hata: sorun, yuzde: 0 };
    s.dosyalar.push(d);
    if (kucult) ekKucultYukle(kimlik, d, f);
    else if (!sorun) ekYukle(kimlik, d, f, f.name);
  }
  ekListesiCiz(kimlik);
}

function ekKucultYukle(kimlik, d, f) {
  resimKucult(f).then(function (k) {
    /* Bu arada kaldırıldıysa ya da pencere kapanıp yeniden açıldıysa yüklenmez. */
    if (d.kaldirildi || !EKLER[kimlik] || EKLER[kimlik].dosyalar.indexOf(d) < 0) return;
    var sorun = ekSigmiyor(kimlik, k.sonra);   // d henüz toplamda sayılmıyor
    d.ad = k.ad;
    d.boyut = k.sonra;
    d.kucultme = kucultmeYazisi(k);
    d.durum = sorun ? 'hata' : 'yukleniyor';
    d.hata = sorun;
    if (!sorun) ekYukle(kimlik, d, k.dosya, k.ad);
    ekListesiCiz(kimlik);
  });
}

function ekYukle(kimlik, d, dosya, ad) {
  var xhr = new XMLHttpRequest();
  d.xhr = xhr;
  xhr.open('POST', '/api/ek/yukle?tur=' + encodeURIComponent(EKLER[kimlik].tur));
  if (S.token) xhr.setRequestHeader('Authorization', 'Bearer ' + S.token);
  xhr.setRequestHeader('X-Dosya-Adi', encodeURIComponent(ad));
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
  /* Doluluk: yüklenen ve yüklenmekte olanlar sayılır (hatalılar sayılmaz). */
  var doluluk = $('ekDoluluk-' + kimlik), toplam = ekToplam(kimlik), alan = $('ekAlan-' + kimlik);
  /* Alan dolunca bırakma kutusu gizlenir; yerine uyarı yazar. */
  if (alan) alan.classList.toggle('dolu', toplam >= EK_SINIR);
  if (doluluk) {
    doluluk.innerHTML = s.dosyalar.length ? dolulukCubugu(toplam, EK_SINIR, 'Bu ' + (s.tur === 'odev' ? 'ödev' : 'mesaj') +
      ' için dosya alanın doldu (50 MB). Yer açmak için bir dosyanı kaldır.') : '';
  }
  kap.innerHTML = s.dosyalar.map(function (d, i) {
    return '<li class="ek-satir' + (d.durum === 'hata' ? ' hatali' : '') + '">' + ik('belge') +
      '<span class="ek-ad"><b>' + esc(d.ad) + '</b><small>' +
      (d.durum === 'kucultuluyor' ? 'Küçültülüyor…' : (d.kucultme || boyutYazi(d.boyut)) +
        (d.durum === 'yukleniyor' ? ' · yükleniyor' : d.durum === 'hata' ? ' · ' + esc(d.hata) : d.mevcut ? '' : ' · yüklendi')) + '</small>' +
      (d.durum === 'yukleniyor' ? '<span class="ek-cubuk"><i data-ek-yuzde="' + kimlik + '-' + i + '" style="width:' + (d.yuzde || 0) + '%"></i></span>' : '') +
      '</span><button type="button" class="btn kucuk gri" data-act="ek-kaldir" data-alan="' + kimlik + '" data-id="' + i + '" ' +
      'aria-label="' + esc(d.ad) + ' dosyasını kaldır">Kaldır</button></li>';
  }).join('');
}

EYLEMLER['ek-kaldir'] = function (el, sira) {
  var kimlik = el.getAttribute('data-alan'), s = EKLER[kimlik];
  var d = s && s.dosyalar[Number(sira)];
  if (!d) return;
  d.kaldirildi = true;   // küçültülüyorsa bitince yüklenmesin
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
  return !!EKLER[kimlik] && EKLER[kimlik].dosyalar.some(function (d) { return d.durum === 'yukleniyor' || d.durum === 'kucultuluyor'; });
}

/* Okuma tarafı: mesajın ya da ödevin ekleri, indirme düğmesiyle.
   ilkSatir: listenin başına konan hazır satır (ödevin quizi, 14c-quiz.js). */
function ekListesiGoster(ekler, ilkSatir) {
  if ((!ekler || !ekler.length) && !ilkSatir) return '';
  return '<div class="ekler-kutu"><h4>Ekler</h4><ul class="ek-liste">' + (ilkSatir || '') + (ekler || []).map(function (e) {
    return '<li class="ek-satir' + (e.suresiDoldu ? ' soluk-satir' : '') + '">' + ik('belge') +
      '<span class="ek-ad"><b>' + esc(e.ad) + '</b><small>' + boyutYazi(e.boyut) + ' · ' +
      (e.suresiDoldu ? 'süresi doldu, silindi' : silinmeYazisi(e.bitis)) + '</small></span>' +
      (e.suresiDoldu ? '' : '<button type="button" class="btn kucuk" data-act="ek-indir" data-id="' + esc(e.id) + '">İndir</button>') +
      '</li>';
  }).join('') + '</ul></div>';
}

/* İndirme: önce tek kullanımlık bilet, dosya doğrudan diske iner. */
EYLEMLER['ek-indir'] = function (el, id) {
  return api('/ek/bilet?id=' + encodeURIComponent(id)).then(function (d) { location.href = d.yol; })['catch'](hataGoster);
};
