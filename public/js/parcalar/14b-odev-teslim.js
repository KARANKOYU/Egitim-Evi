/* Ödev teslim dosyaları.
   Öğrenci ödev penceresinden dosya yükler (ilerleme çubuğuyla); veli
   çocuğunun dosyalarını, ödevi veren öğretmen bütün teslimleri görür ve
   indirir. Sınırlar ve yetki sunucuda denetlenir; buradaki ön kontroller
   yalnızca boşuna yükleme yapılmasın diye. */

var teslimDurum = { odevId: '', ogrenciId: '', veri: null, yukleniyor: 0, hatalar: [] };

/* Ödev penceresinin altına teslim bölümü (öğrenci ve öğrenci portalına bakan veli). */
var odevOkuIlk = EYLEMLER['odev-oku'];
EYLEMLER['odev-oku'] = function (el, id) {
  odevOkuIlk(el, id);
  var govde = $('modalGovde');
  if (!govde) return;
  govde.insertAdjacentHTML('beforeend', '<div class="teslim-bolum" id="teslimKap"><div class="hint">Teslim dosyaları yükleniyor...</div></div>');
  teslimDurum.hatalar = [];
  teslimCiz(id, S.viewStudentId || '');
};

function teslimCiz(odevId, ogrenciId) {
  teslimDurum.odevId = odevId;
  teslimDurum.ogrenciId = ogrenciId;
  return api('/odev-dosya?odev=' + encodeURIComponent(odevId) + (ogrenciId ? '&ogrenci=' + encodeURIComponent(ogrenciId) : ''))
    .then(function (d) {
      teslimDurum.veri = d;
      var kap = $('teslimKap');
      if (!kap) return;
      var h = '<h4>' + ik('ek') + 'Teslim dosyaları</h4>';
      if (!d.dosyalar.length) h += '<div class="hint">' + (d.yukleyebilir ? 'Henüz dosya yüklemedin.' : 'Yüklenmiş dosya yok.') + '</div>';
      for (var i = 0; i < d.dosyalar.length; i++) h += teslimSatiri(d.dosyalar[i], d.yukleyebilir);
      /* Reddedilen ya da yarıda kalan dosyaların uyarısı liste yenilenince kaybolmasın. */
      h += '<div id="teslimYuklemeler">' + teslimDurum.hatalar.join('') + '</div>';
      teslimDurum.hatalar = [];
      if (d.yukleyebilir) {
        /* Sürükle-bırak ya da basıp seç; birden çok dosya olur. */
        h += '<input type="file" id="teslimDosya" multiple hidden>' +
          '<label class="ek-birak" id="teslimBirak" for="teslimDosya">' + ik('yukle') +
          '<span><b>Dosya yükle</b>: buraya sürükle ya da basıp seç</span>' +
          '<small>Bu ödeve yüklediklerinin toplamı en fazla 150 MB. Dosyalar ' + (d.sinir.gun || 7) +
          ' gün sonra silinir; teslim süresi dolana kadar silip yeniden yükleyebilirsin.</small></label>';
      } else if (d.kapali && !ogrenciId && S.user.role === 'student') {
        h += '<div class="hint">' + esc(d.kapali) + '</div>';
      }
      kap.innerHTML = h;
      var giris = $('teslimDosya');
      if (giris) giris.onchange = function () { teslimKuyruk(Array.prototype.slice.call(giris.files)); giris.value = ''; };
      var birak = $('teslimBirak');
      if (birak) {
        ['dragenter', 'dragover'].forEach(function (o) { birak.addEventListener(o, function (e) { e.preventDefault(); birak.classList.add('uzerinde'); }); });
        ['dragleave', 'drop'].forEach(function (o) { birak.addEventListener(o, function (e) { e.preventDefault(); birak.classList.remove('uzerinde'); }); });
        birak.addEventListener('drop', function (e) {
          if (e.dataTransfer && e.dataTransfer.files) teslimKuyruk(Array.prototype.slice.call(e.dataTransfer.files));
        });
      }
    })['catch'](function (e) {
      var kap = $('teslimKap');
      if (kap) kap.innerHTML = '<div class="hint">' + esc(e.message) + '</div>';
    });
}

function teslimSatiri(f, silinebilir) {
  return '<div class="teslim-dosya"><div class="buyu"><div class="ad">' + esc(f.ad) + '</div>' +
    '<div class="alt">' + boyutYaz(f.boyut) + ' · ' + tarihSaat(f.yuklenme) +
    (f.bitis ? ' · ' + teslimKalanGun(f.bitis) : '') + '</div></div>' +
    '<button class="btn kucuk ghost" data-act="teslim-indir" data-id="' + esc(f.id) + '" data-ad="' + esc(f.ad) + '">İndir</button>' +
    (silinebilir ? '<button class="btn kucuk gri" data-act="teslim-sil" data-id="' + esc(f.id) + '">Sil</button>' : '') + '</div>';
}

function teslimKalanGun(bitis) {
  var kalan = Math.ceil((new Date(bitis).getTime() - Date.now()) / 86400000);
  return kalan <= 1 ? 'yarın silinir' : kalan + ' gün sonra silinir';
}

/* Büyük dosya ve zip tarayıcı belleğine alınmadan doğrudan diske insin diye
   sunucudan tek kullanımlık, 60 saniyelik bir indirme bağlantısı istenir. */
function biletleIndir(yol) {
  return api(yol).then(function (d) {
    var a = document.createElement('a');
    a.href = d.yol;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

EYLEMLER['teslim-indir'] = function (el, id) {
  el.disabled = true;
  return biletleIndir('/odev-dosya/bilet?tur=dosya&id=' + encodeURIComponent(id))
    .then(function () { el.disabled = false; })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

EYLEMLER['teslim-sil'] = function (el, id) {
  if (!confirm('Dosya silinsin mi?')) return;
  el.disabled = true;
  return api('/odev-dosya/sil', 'POST', { id: id }).then(function () {
    if ($('teslimKap')) return teslimCiz(teslimDurum.odevId, teslimDurum.ogrenciId);
    if ($('teslimOgretmen')) return teslimOgrenciAc(null, teslimDurum.odevId, teslimDurum.ogrenciId);
  })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

/* Seçilen dosyalar sırayla yüklenir; her biri kendi ilerleme çubuğuyla. */
function teslimKuyruk(dosyalar) {
  var d = teslimDurum.veri, izinli = {}, kalan = d.sinir.adet - d.dosyalar.length;
  var toplam = d.dosyalar.reduce(function (t, x) { return t + x.boyut; }, 0);
  for (var i = 0; i < d.sinir.uzantilar.length; i++) izinli[d.sinir.uzantilar[i]] = 1;
  var kap = $('teslimYuklemeler');
  var gidecek = [];
  for (var j = 0; j < dosyalar.length; j++) {
    var f = dosyalar[j], u = (f.name.lastIndexOf('.') > 0 ? f.name.slice(f.name.lastIndexOf('.') + 1) : '').toLowerCase();
    var sorun = !f.size ? 'boş dosya' : toplam + f.size > d.sinir.toplam ? 'toplam 150 MB\'ı geçiyor' : !izinli[u] ? 'bu tür yüklenemez' :
      gidecek.length >= kalan ? 'dosya sayısı sınırı' : '';
    if (!sorun) toplam += f.size;
    if (sorun) {
      var satir = '<div class="yukleme-satir hata"><b>' + esc(f.name) + '</b> — ' + sorun + '</div>';
      kap.insertAdjacentHTML('beforeend', satir);
      teslimDurum.hatalar.push(satir);
      continue;
    }
    gidecek.push(f);
  }
  var sira = 0;
  var sonraki = function () {
    if (sira >= gidecek.length) { if (gidecek.length) teslimCiz(teslimDurum.odevId, ''); return; }
    teslimTekYukle(gidecek[sira++], sonraki);
  };
  sonraki();
}

function teslimTekYukle(f, bitince) {
  var kap = $('teslimYuklemeler');
  if (!kap) return;
  var satirId = 'yk' + Date.now() + Math.floor(Math.random() * 1000);
  kap.insertAdjacentHTML('beforeend', '<div class="yukleme-satir" id="' + satirId + '"><div class="yukleme-ust"><b>' + esc(f.name) +
    '</b><span class="yuzde">%0</span><button class="baglanti" data-act="teslim-iptal" data-id="' + satirId + '">İptal</button></div>' +
    '<div class="cubuk"><i style="width:0%"></i></div></div>');
  var satir = $(satirId);
  var xhr = new XMLHttpRequest();
  satir.__xhr = xhr;
  teslimDurum.yukleniyor++;
  xhr.open('POST', '/api/odev-dosya/yukle?odev=' + encodeURIComponent(teslimDurum.odevId));
  xhr.setRequestHeader('Authorization', 'Bearer ' + S.token);
  xhr.setRequestHeader('Content-Type', 'application/octet-stream');
  xhr.setRequestHeader('X-Dosya-Adi', encodeURIComponent(f.name));
  xhr.upload.onprogress = function (e) {
    if (!e.lengthComputable) return;
    var y = Math.floor(100 * e.loaded / e.total);
    satir.querySelector('.cubuk i').style.width = y + '%';
    satir.querySelector('.yuzde').textContent = '%' + y;
  };
  var son = function (hata) {
    teslimDurum.yukleniyor--;
    var iptal = satir.querySelector('[data-act="teslim-iptal"]');
    if (iptal) iptal.remove();
    if (hata) {
      satir.classList.add('hata');
      satir.querySelector('.yuzde').textContent = hata;
      teslimDurum.hatalar.push('<div class="yukleme-satir hata"><b>' + esc(f.name) + '</b> — ' + esc(hata) + '</div>');
    } else {
      satir.parentNode.removeChild(satir);
    }
    bitince();
  };
  xhr.onload = function () {
    var j = {};
    try { j = JSON.parse(xhr.responseText || '{}'); } catch (e) { j = {}; }
    son(xhr.status === 200 ? '' : (j.error || 'Yüklenemedi (' + xhr.status + ')'));
  };
  xhr.onerror = function () { son('Bağlantı koptu'); };
  xhr.onabort = function () { son('İptal edildi'); };
  xhr.send(f);
}

EYLEMLER['teslim-iptal'] = function (el, id) {
  var satir = $(id);
  if (satir && satir.__xhr) satir.__xhr.abort();
};

/* Yükleme sürerken pencere kapanmasın diye uyarı. */
window.addEventListener('beforeunload', function (e) {
  if (teslimDurum.yukleniyor > 0) { e.preventDefault(); e.returnValue = ''; }
});

/* ---- öğretmen: ödev kontrol ekranında teslimler ---- */
function ogretmenTeslimleri(odevId, baslik) {
  return api('/odev-dosya?odev=' + encodeURIComponent(odevId)).then(function (d) {
    teslimDurum.odevId = odevId;
    teslimDurum.ogretmen = { dosyalar: d.dosyalar, baslik: baslik };
    var sayim = {};
    for (var i = 0; i < d.dosyalar.length; i++) sayim[d.dosyalar[i].ogrenciId] = (sayim[d.dosyalar[i].ogrenciId] || 0) + 1;
    var kutular = document.querySelectorAll('.ok-satir .sonuc-kutu');
    for (var k = 0; k < kutular.length; k++) {
      var sid = kutular[k].getAttribute('data-sid'), n = sayim[sid] || 0;
      var buyu = kutular[k].parentNode.querySelector('.buyu');
      if (!buyu || !n) continue;
      buyu.insertAdjacentHTML('beforeend', '<button class="baglanti teslim-rozet" data-act="teslim-ogrenci" data-id="' + esc(odevId) +
        '" data-ogrenci="' + esc(sid) + '">' + ik('ek') + n + ' ek</button>');
    }
    var ust = document.querySelector('.odev-kontrol .ok-ust');
    if (ust && d.dosyalar.length) {
      ust.insertAdjacentHTML('beforeend', '<button class="btn kucuk ghost" data-act="teslim-zip" data-id="' + esc(odevId) + '">' +
        ik('indir') + 'Teslimleri indir (' + boyutYaz(d.toplam) + ')</button>');
    }
  })['catch'](function () { /* teslim bilgisi gelmezse kontrol ekranı yine çalışır */ });
}

EYLEMLER['teslim-ogrenci'] = function (el, odevId) { return teslimOgrenciAc(el, odevId, el.getAttribute('data-ogrenci')); };

/* Öğretmenin ek penceresi: hiçbir dosya kendiliğinden yüklenmez (boşuna
   internet harcanmasın). Her ek bir simge, adı ve MB boyutuyla durur;
   fotoğraf, video ve ses tıklayınca burada açılır, öbürleri sorulup iner. */
var TESLIM_MEDYA = { jpg: 'resim', jpeg: 'resim', png: 'resim', gif: 'resim', webp: 'resim', bmp: 'resim',
  mp4: 'video', m4v: 'video', webm: 'video', mov: 'video', mp3: 'ses', m4a: 'ses', wav: 'ses', ogg: 'ses', aac: 'ses' };
function teslimMedyaTuru(ad) { var i = String(ad).lastIndexOf('.'); return i > 0 ? TESLIM_MEDYA[String(ad).slice(i + 1).toLowerCase()] || '' : ''; }
function mbYaz(b) {
  var mb = b / 1048576;
  return mb < 0.1 ? '0,1 MB\'tan küçük' : (Math.round(mb * 10) / 10).toLocaleString('tr-TR') + ' MB';
}

function teslimOgesi(f) {
  var tur = teslimMedyaTuru(f.ad);
  var simge = tur === 'video' ? 'oynat' : tur === 'ses' ? 'muzik' : tur === 'resim' ? 'resim' : 'belge';
  var ne = tur === 'video' ? 'Video — oynat' : tur === 'ses' ? 'Ses — dinle' : tur === 'resim' ? 'Fotoğraf — aç' : 'Dosya — indir';
  return '<div class="teslim-oge-kap"><button type="button" class="teslim-oge ' + (tur || 'dosya') + '" data-act="teslim-oge" data-id="' + esc(f.id) +
    '" data-ad="' + esc(f.ad) + '" data-tur="' + tur + '" data-boyut="' + esc(f.boyut) + '" title="' + esc(ne) + '">' +
    '<span class="teslim-oge-ikon">' + ik(simge) + '</span>' +
    '<span class="teslim-oge-ad">' + esc(f.ad) + '</span>' +
    '<span class="teslim-oge-boyut">' + esc(mbYaz(f.boyut)) + '</span></button>' +
    '<button type="button" class="baglanti kucuk-baglanti" data-act="teslim-sil" data-id="' + esc(f.id) + '">Sil</button></div>';
}

function teslimOgrenciAc(el, odevId, ogrenciId) {
  return api('/odev-dosya?odev=' + encodeURIComponent(odevId)).then(function (d) {
    teslimDurum.odevId = odevId;
    teslimDurum.ogrenciId = ogrenciId;
    var liste = d.dosyalar.filter(function (f) { return f.ogrenciId === ogrenciId; });
    var h = '<div id="teslimOgretmen">';
    if (!liste.length) h += '<div class="hint">Dosya kalmadı.</div>';
    else h += '<div class="teslim-ogeler">' + liste.map(teslimOgesi).join('') + '</div>';
    h += '<div class="hint" style="margin-top:10px">Fotoğraf, video ve ses tıklayınca burada açılır; öbür dosyalar ' +
      'sorup bilgisayarına iner. Uygunsuz bir dosyayı silebilirsin.</div></div>';
    modalAc(((liste[0] && liste[0].ogrenci) || 'Öğrenci') + ' — ' + liste.length + ' ek', h);
  })['catch'](hataGoster);
}

EYLEMLER['teslim-oge'] = function (el, id) {
  var ad = el.getAttribute('data-ad'), tur = el.getAttribute('data-tur'), boyut = Number(el.getAttribute('data-boyut')) || 0;
  if (!tur) {
    if (!confirm('"' + ad + '" (' + mbYaz(boyut) + ') indirilsin mi?')) return;
    return biletleIndir('/odev-dosya/bilet?tur=dosya&id=' + encodeURIComponent(id))['catch'](hataGoster);
  }
  el.disabled = true;
  return api('/odev-dosya/bilet?tur=goster&id=' + encodeURIComponent(id)).then(function (d) {
    var oge = tur === 'resim' ? '<img class="medya-oge" src="' + esc(d.yol) + '" alt="' + esc(ad) + '">'
      : tur === 'video' ? '<video class="medya-oge" src="' + esc(d.yol) + '" controls autoplay playsinline></video>'
      : '<audio class="medya-oge ses" src="' + esc(d.yol) + '" controls autoplay></audio>';
    /* Fotoğraf ve video sabit yükseklikte bir kutuda açılır: dosya yüklenince pencere büyüyüp kaymaz. */
    modalAc(ad, '<div class="medya-kap' + (tur === 'resim' || tur === 'video' ? '' : ' ses') + '">' + oge + '</div><div class="hint">' + esc(mbYaz(boyut)) + '</div>',
      '<button class="btn gri" data-act="teslim-ogrenci" data-id="' + esc(teslimDurum.odevId) + '" data-ogrenci="' + esc(teslimDurum.ogrenciId) + '">Eklere dön</button>' +
      '<button class="btn ghost" data-act="teslim-indir" data-id="' + esc(id) + '" data-ad="' + esc(ad) + '">' + ik('indir') + 'İndir</button>');
  })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

EYLEMLER['teslim-zip'] = function (el, odevId) {
  el.disabled = true;
  return biletleIndir('/odev-dosya/bilet?tur=zip&odev=' + encodeURIComponent(odevId))
    .then(function () { el.disabled = false; })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

/* ---- veli: ödev listesinden çocuğun teslim dosyaları ---- */
EYLEMLER['veli-teslim'] = function (el, odevId) {
  modalAc(el.getAttribute('data-baslik') || 'Teslim dosyaları',
    '<div class="teslim-bolum" id="teslimKap" style="margin-top:0;border-top:0;padding-top:0"><div class="hint">Yükleniyor...</div></div>');
  return teslimCiz(odevId, el.getAttribute('data-ogrenci'));
};
