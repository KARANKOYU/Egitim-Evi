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

