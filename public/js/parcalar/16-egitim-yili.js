/* Eğitim yılı seçimi ve yönetimi. */

/* ================= eğitim yılı ================= */

/* Veli çocuğunun yıllarına bakar: şeritten seçili ya da tek çocuğu. */
var VELI_YIL_SAYFALARI = ['veli-odevler', 'veli-ilerleyis', 'veli-devamsizlik'];
function yilOgrencisi() {
  if (!S.user || S.user.role !== 'parent') return '';
  var c = veliSeciliCocuk();
  var liste = S.children || [];
  if (!c && liste.length === 1) c = liste[0];
  return c ? c.id : '';
}

/* Sayfanın en üstünde, geçmiş yıla bakılıyorsa uyarı şeridi. Nakil gelen
   öğrencide (ve velisinde) önceki okulların dönemleri ayrı grupta. */
function yilSeridi() {
  var y = S.yilBilgi;
  if (!y || !y.yillar || y.yillar.length < 2) return '';
  if (S.user && S.user.role === 'parent' && VELI_YIL_SAYFALARI.indexOf(S.page) < 0) return '';
  var bakilan = null;
  for (var i = 0; i < y.yillar.length; i++) {
    if (y.yillar[i].bakilan) bakilan = y.yillar[i];
  }
  if (!bakilan) return '';

  var h = '<div class="yil-seridi' + (y.arsiv ? ' arsiv' : '') + '">' +
    '<span class="yil-etiket">Eğitim yılı</span>' +
    '<select id="yilSec">';
  var grupAcik = false;
  for (var j = 0; j < y.yillar.length; j++) {
    var x = y.yillar[j];
    if (x.gecmis && !grupAcik) { h += '<optgroup label="Önceki okullar">'; grupAcik = true; }
    h += '<option value="' + esc(x.id) + '"' + (x.bakilan ? ' selected' : '') + '>' +
      esc(x.ad) + (x.aktif ? ' (aktif)' : '') + '</option>';
  }
  h += (grupAcik ? '</optgroup>' : '') + '</select>';
  if (y.arsiv) {
    h += '<span class="yil-not">' + (bakilan.gecmis ? 'Önceki okulunun kaydına bakıyorsun' : 'Geçmiş yıla bakıyorsun') +
      ' — kayıtlar salt okunur.</span>';
  }
  return h + '</div>';
}

/* Yıl bilgisini bir kez çekip saklıyoruz; her sayfada tekrar sormaya gerek yok. */
function yilBilgisiYukle() {
  var ogr = yilOgrencisi();
  if (!S.user || (!S.user.schoolId && !ogr)) { S.yilBilgi = null; return Promise.resolve(); }
  return api('/egitim-yili' + (ogr ? '?ogrenci=' + encodeURIComponent(ogr) : '')).then(function (d) {
    S.yilBilgi = d;
  })['catch'](function () { S.yilBilgi = null; });
}

SAYFALAR['egitim-yili'] = function () {
  return api('/egitim-yili').then(function (d) {
    S.yilBilgi = d;
    var h = hero('EĞİTİM YILI', '');

    h += '<div class="kart"><div class="hint" style="margin-bottom:12px">' +
      'Her eğitim yılı kendi programını, ödevlerini ve devamsızlık kaydını ' +
      'tutar. Yeni yıl açtığında eskisi silinmez — istediğin zaman geri ' +
      'dönüp bakabilirsin.</div>';

    if (!d.yillar.length) {
      h += '<div class="msg bilgi">Henüz eğitim yılı tanımlamadın. ' +
        'Şimdiye kadarki tüm kayıtlar açacağın ilk yıla ait sayılacak.</div>';
    } else {
      for (var i = 0; i < d.yillar.length; i++) {
        var y = d.yillar[i];
        h += '<div class="satir">' +
          '<div class="buyu"><div class="ad">' + esc(y.ad) +
          (y.aktif ? ' <span class="etiket yesil">Aktif</span>' : '') +
          (y.bakilan && !y.aktif ? ' <span class="etiket mavi">Bakılan</span>' : '') +
          '</div><div class="alt">' + tarihGun(y.bas) + ' — ' + tarihGun(y.bit) +
          '</div></div>' +
          (y.bakilan ? '' :
            '<button class="btn kucuk ghost" data-act="yil-bak" data-id="' +
            esc(y.id) + '">Bu yıla bak</button>') +
          (d.yonetebilir && !y.aktif ?
            '<button class="btn kucuk gri" data-act="yil-aktif" data-id="' +
            esc(y.id) + '">Aktif yap</button>' : '') +
          '</div>';
      }
    }
    h += '</div>';

    if (d.yonetebilir) {
      var simdi = new Date();
      var basYil = simdi.getMonth() >= 7 ? simdi.getFullYear() : simdi.getFullYear() - 1;
      h += '<div class="kart"><h3>Yeni eğitim yılı aç</h3>' +
        '<div class="satir" style="border:0;padding:0">' +
        '<div class="field" style="margin:0;max-width:190px">' +
        '<input type="text" id="yilAd" placeholder="' + basYil + '-' + (basYil + 1) +
        '" maxlength="9"></div>' +
        '<button class="btn" data-act="yil-ekle">Aç ve aktif yap</button></div>' +
        '<div class="hint" style="margin-top:10px">' +
        'Yeni yıl aktif olur; bundan sonra açılan ödev, program ve yoklama ' +
        'kayıtları bu yıla yazılır. Sınıflar ve öğrenciler ortak kalır.</div>' +
        '<div id="yilMesaj" style="margin-top:10px"></div></div>';
    }

    yaz(h);
  });
};
