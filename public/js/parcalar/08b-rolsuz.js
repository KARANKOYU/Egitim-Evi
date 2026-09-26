/* Okul başvurusu formu (müdür adayı): "Hesap değiştir > Ekle > Okulumu kaydet".
   Okul MEB listesinden aranır; listede olmayan (yeni açılmış) okulun adı
   elle yazılır. Başvuruyu sistem yöneticisi onaylar. Okul seçme bölümü
   (okulSecimAlani) yöneticinin "Okul aç" penceresinde de kullanılır. */

var ilceHaritasi = {};        // { "Ankara": ["Çankaya", ...] }
var seciliOkul = null;        // müdürün MEB listesinden seçtiği okul
var okulAramaSayaci = null;   // yazarken bekletme (debounce)

/* dogum: yetişkin hesabındaki doğum tarihi (varsa doldurulmuş gelir). */
function okulBasvuruFormu(dogum) {
  return '<div class="field"><label for="bDogumGun">Doğum tarihin</label>' +
    tarihSecici('bDogum', dogum || '', { enKucukYas: 18 }) +
    '<div class="hint">Okul müdürü başvurusu 18 yaşından büyükler içindir.</div></div>' +
    okulSecimAlani() +
    '<div class="field kvkk-alan"><label class="onay-satiri"><input type="checkbox" id="bBeyan"> ' +
    '<span>Bu okulun müdürü ya da yöneticisiyim; yazdığım bilgilerin doğru olduğunu beyan ederim.</span></label></div>';
}

/* İl, ilçe, MEB listesinde arama ve "listede yok" bölümü. okulBasvurusuKur() bağlar. */
function okulSecimAlani() {
  return '<div class="row2">' +
    '<div class="field"><label for="bIl">İl</label><select id="bIl"><option value="">Yükleniyor...</option></select></div>' +
    '<div class="field"><label for="bIlce">İlçe</label><select id="bIlce"><option value="">Önce il seç...</option></select></div>' +
    '</div>' +
    '<div class="field"><label for="bOkulAra">Okulunu bul</label>' +
    '<div class="okul-ust"><input type="search" id="bOkulAra" placeholder="Okulunun adını yaz" ' +
    'autocomplete="off" spellcheck="false" enterkeyhint="search" aria-controls="bOkulSonuc" aria-describedby="bOkulIpucu">' +
    '<select id="bOkulTip" aria-label="Okul türü"><option value="">Tüm türler</option></select></div>' +
    '<div class="hint" id="bOkulIpucu">Kelimelerin sırası önemli değil. İl seçersen yalnızca o ilde, seçmezsen Türkiye genelinde arar.</div>' +
    '<div id="bOkulSonuc" class="okul-sonuc" aria-live="polite"></div>' +
    '<div id="bOkulSecili" class="okul-secili" style="display:none"></div></div>' +
    '<details class="okul-elle"><summary>Okulum listede yok</summary>' +
    '<div class="field"><label for="bOkulAd">Okulun tam adı</label>' +
    '<input type="text" id="bOkulAd" autocomplete="off" maxlength="140">' +
    '<div class="hint">Yeni açılmış ya da adı değişmiş okullar listede olmayabilir. Yukarıdan il ve ' +
    'ilçeyi seç, okulun tam adını yaz; sistem yöneticisi kontrol edip onaylar.</div></div></details>';
}

EYLEMLER['rolsuz-mudur'] = function (el) {
  var kart = $('rMudurKart');
  formHatalariniSil(kart);
  var govde = { city: $('bIl').value, district: $('bIlce').value.trim(), dogum: $('bDogum').value, beyan: $('bBeyan').checked };
  if (tarihSeciciDurum('bDogum') !== 'tam') alanHatasi('bDogumGun', 'Doğum tarihini gün, ay ve yıl olarak seç.');
  if (!govde.beyan) alanHatasi('bBeyan', 'Beyanı onaylaman gerekiyor.');
  if (seciliOkul) govde.mebSchoolId = seciliOkul.id;
  else {
    govde.schoolName = $('bOkulAd').value.trim();
    if (!govde.schoolName) alanHatasi('bOkulAra', 'Listeden okulunu seç ya da "Okulum listede yok" bölümüne adını yaz.');
    else {
      if (!govde.city) alanHatasi('bIl', 'Okulunun ilini seç.');
      if (!govde.district) alanHatasi('bIlce', 'Okulunun ilçesini seç.');
    }
  }
  if (kart.querySelector('.hatali')) { ilkHatayaGit(kart); return; }
  dugmeBekle(el, 'Gönderiliyor...');
  return api('/okul-basvurusu', 'POST', govde).then(function (d) {
    /* Başvuru, hesaba "onay bekliyor" müdür rolü ekler; hesap öteki
       rolleriyle kullanılmaya devam eder. */
    modalKapat();
    return git('kisilikler').then(function () { sayfaMesaji('iyi', d.message); });
  })['catch'](function (e) {
    dugmeBitir(el);
    var v = e.veri || {};
    var hedef = { okul: seciliOkul || !$('bOkulAd').value.trim() ? 'bOkulAra' : 'bOkulAd', il: 'bIl', ilce: 'bIlce',
      dogum: 'bDogumGun', beyan: 'bBeyan' }[v.alan];
    if (hedef) { alanHatasi(hedef, e.message); ilkHatayaGit(kart); }
    else hataGoster(e);
  });
};

/* ---- müdür başvurusu: MEB listesinde okul arama ----
   Yazarken kısa bir duraksamadan sonra aranır. Geç gelen eski cevap yeni
   sonucun üstüne yazmasın diye her aramaya sıra numarası verilir; aynı
   arama tekrarlanırsa sunucuya gidilmez. Arama sürerken eski sonuçlar
   silinmez, soluklaşır (liste yanıp sönmesin). */
var okulAramaDurum = { sira: 0, onbellek: {}, anahtarlar: [] };

function okulBasvurusuKur() {
  seciliOkul = null;
  if (!$('bIl')) return;

  api('/okullar/iller').then(function (d) {
    ilceHaritasi = {};
    var h = '<option value="">Seç...</option>';
    for (var i = 0; i < d.iller.length; i++) {
      h += '<option value="' + esc(d.iller[i].ad) + '">' + esc(d.iller[i].ad) + '</option>';
      ilceHaritasi[d.iller[i].ad] = d.iller[i].ilceler;
    }
    if ($('bIl')) $('bIl').innerHTML = h;
    var t = '<option value="">Tüm türler</option>';
    for (var k = 0; k < d.tipler.length; k++) {
      t += '<option value="' + esc(d.tipler[k]) + '">' + esc(d.tipler[k]) + '</option>';
    }
    if ($('bOkulTip')) $('bOkulTip').innerHTML = t;
    if ($('bOkulIpucu')) {
      $('bOkulIpucu').textContent = d.toplam.toLocaleString('tr-TR') +
        ' okul aranabilir. Kelimelerin sırası önemli değil. İl seçersen yalnızca o ilde, seçmezsen Türkiye genelinde arar.';
    }
  })['catch'](function () {
    /* Okul listesi yoksa en azından il seçimi çalışsın (elle ad yazılır). */
    var sehirler = (S.meta && S.meta.cities) || [];
    var h = '<option value="">Seç...</option>';
    for (var i = 0; i < sehirler.length; i++) h += '<option value="' + esc(sehirler[i]) + '">' + esc(sehirler[i]) + '</option>';
    if ($('bIl')) $('bIl').innerHTML = h;
  });

  $('bIl').onchange = function () { ilceleriDoldur(this.value); okulAramaBaslat(0); };
  $('bIlce').onchange = function () { okulAramaBaslat(0); };
  $('bOkulTip').onchange = function () { okulAramaBaslat(0); };
  $('bOkulAra').oninput = function () { okulAramaBaslat(); };
  $('bOkulAra').onkeydown = function (e) {
    if (e.key === 'Enter') { e.preventDefault(); okulAramaBaslat(0); }
    if (e.key === 'ArrowDown') {
      var ilk = $('bOkulSonuc').querySelector('.okul-satir');
      if (ilk) { e.preventDefault(); ilk.focus(); }
    }
    if (e.key === 'Escape') { $('bOkulSonuc').innerHTML = ''; }
  };
  $('bOkulSonuc').onclick = function (e) {
    var btn = e.target.closest ? e.target.closest('.okul-satir') : null;
    if (btn) okulSec(btn);
  };
  /* Sonuçlar arasında ok tuşlarıyla gezinme; en üstten yukarı kutuya döner. */
  $('bOkulSonuc').onkeydown = function (e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Escape') return;
    var satirlar = Array.prototype.slice.call(this.querySelectorAll('.okul-satir'));
    var i = satirlar.indexOf(document.activeElement);
    e.preventDefault();
    if (e.key === 'Escape' || (e.key === 'ArrowUp' && i <= 0)) { $('bOkulAra').focus(); return; }
    var hedef = satirlar[Math.min(satirlar.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))];
    if (hedef) hedef.focus();
  };
}

