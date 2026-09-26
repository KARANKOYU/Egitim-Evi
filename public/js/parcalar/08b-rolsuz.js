/* Okul seçimi: yöneticinin "Okul aç" penceresi (09-yonetici.js). Okul Millî
   Eğitim Bakanlığı listesinden aranır; listede olmayan (yeni açılmış) okulun
   adı elle yazılır. Müdür başvurusu yoktur: okulunu açtırmak isteyen kişi
   kişi kodunu sistem yöneticisine verir, okulu yönetici açar. */

var ilceHaritasi = {};        // { "Ankara": ["Çankaya", ...] }
var seciliOkul = null;        // MEB listesinden seçilen okul
var okulAramaSayaci = null;   // yazarken bekletme (debounce)

/* İl, ilçe, MEB listesinde arama ve "listede yok" bölümü. okulSecimiKur() bağlar. */
function okulSecimAlani() {
  return '<div class="row2">' +
    '<div class="field"><label for="bIl">İl</label><select id="bIl"><option value="">Yükleniyor...</option></select></div>' +
    '<div class="field"><label for="bIlce">İlçe</label><select id="bIlce"><option value="">Önce il seç...</option></select></div>' +
    '</div>' +
    '<div class="field"><label for="bOkulAra">Okulu bul</label>' +
    '<div class="okul-ust"><input type="search" id="bOkulAra" placeholder="Okulun adını yaz" ' +
    'autocomplete="off" spellcheck="false" enterkeyhint="search" aria-controls="bOkulSonuc" aria-describedby="bOkulIpucu">' +
    '<select id="bOkulTip" aria-label="Okul türü"><option value="">Tüm türler</option></select></div>' +
    '<div class="hint" id="bOkulIpucu">Kelimelerin sırası önemli değil. İl seçersen yalnızca o ilde, seçmezsen Türkiye genelinde arar.</div>' +
    '<div id="bOkulSonuc" class="okul-sonuc" aria-live="polite"></div>' +
    '<div id="bOkulSecili" class="okul-secili" style="display:none"></div></div>' +
    '<details class="okul-elle"><summary>Okul listede yok</summary>' +
    '<div class="field"><label for="bOkulAd">Okulun tam adı</label>' +
    '<input type="text" id="bOkulAd" autocomplete="off" maxlength="140">' +
    '<div class="hint">Yeni açılmış ya da adı değişmiş okullar listede olmayabilir. Yukarıdan il ve ' +
    'ilçeyi seç, okulun tam adını yaz.</div></div></details>';
}

/* ---- MEB listesinde okul arama ----
   Yazarken kısa bir duraksamadan sonra aranır. Geç gelen eski cevap yeni
   sonucun üstüne yazmasın diye her aramaya sıra numarası verilir; aynı
   arama tekrarlanırsa sunucuya gidilmez. Arama sürerken eski sonuçlar
   silinmez, soluklaşır (liste yanıp sönmesin). */
var okulAramaDurum = { sira: 0, onbellek: {}, anahtarlar: [] };

function okulSecimiKur() {
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

function ilceleriDoldur(il) {
  var sec = $('bIlce');
  if (!sec) return;
  /* Okul listesi yüklenemediyse ilçe listesi de yok: ilçe elle yazılır
     (yoksa listede olmayan okul hiç açılamazdı). */
  if (!Object.keys(ilceHaritasi).length) {
    if (sec.tagName !== 'INPUT') {
      sec.outerHTML = '<input type="text" id="bIlce" placeholder="İlçe adını yaz" maxlength="60" autocomplete="off">';
    }
    return;
  }
  var liste = ilceHaritasi[il] || [];
  if (!il) { sec.innerHTML = '<option value="">Önce il seç...</option>'; return; }
  if (!liste.length) { sec.innerHTML = '<option value="Merkez">Merkez</option>'; return; }
  var h = '<option value="">Tümü / seç...</option>';
  for (var i = 0; i < liste.length; i++) {
    h += '<option value="' + esc(liste[i]) + '">' + esc(liste[i]) + '</option>';
  }
  sec.innerHTML = h;
}

function okulAramaBaslat(gecikme) {
  if (okulAramaSayaci) clearTimeout(okulAramaSayaci);
  okulAramaSayaci = setTimeout(okulAramaYap, gecikme === undefined ? 250 : gecikme);
}

function okulAramaYap() {
  var kutu = $('bOkulAra');
  var sonucKap = $('bOkulSonuc');
  if (!kutu || !sonucKap || seciliOkul) return;

  var sorgu = kutu.value.trim();
  var il = $('bIl').value;
  var ilce = $('bIlce').value;
  var tip = $('bOkulTip') ? $('bOkulTip').value : '';
  var kelimeler = aramaSadeTR(sorgu).split(' ').filter(Boolean);
  var benim = ++okulAramaDurum.sira;

  sonucKap.classList.remove('yukleniyor');
  if (!kelimeler.length && !il) { sonucKap.innerHTML = ''; return; }
  if (!il && kelimeler.join('').length < 2) {
    sonucKap.innerHTML = '<div class="okul-bilgi">En az iki harf yaz ya da önce ilini seç.</div>';
    return;
  }

  var adres = '/okullar/ara?limit=25' +
    '&q=' + encodeURIComponent(kelimeler.join(' ')) +
    '&il=' + encodeURIComponent(il) +
    '&ilce=' + encodeURIComponent(ilce) +
    '&tip=' + encodeURIComponent(tip);
  var ciz = function (d) {
    if (benim !== okulAramaDurum.sira) return;
    sonucKap.classList.remove('yukleniyor');
    sonucKap.innerHTML = okulSonuclari(d, sorgu, kelimeler, [il, ilce, tip].filter(Boolean));
  };
  if (okulAramaDurum.onbellek[adres]) return ciz(okulAramaDurum.onbellek[adres]);

  if (sonucKap.innerHTML) sonucKap.classList.add('yukleniyor');
  else sonucKap.innerHTML = '<div class="okul-bilgi">Aranıyor...</div>';
  api(adres).then(function (d) {
    okulAramaDurum.onbellek[adres] = d;
    okulAramaDurum.anahtarlar.push(adres);
    if (okulAramaDurum.anahtarlar.length > 60) delete okulAramaDurum.onbellek[okulAramaDurum.anahtarlar.shift()];
    ciz(d);
  })['catch'](function (err) {
    if (benim !== okulAramaDurum.sira) return;
    sonucKap.classList.remove('yukleniyor');
    sonucKap.innerHTML = '<div class="okul-bilgi hata">Arama yapılamadı: ' + esc(err.message) +
      ' <button type="button" class="baglanti" data-act="okul-ara-tekrar">Tekrar dene</button></div>';
  });
}

function okulSonuclari(d, sorgu, kelimeler, filtreler) {
  var h = '';
  if (!d.okullar.length) {
    h = '<div class="okul-bilgi">' +
      (sorgu ? '"' + esc(sorgu) + '" için ' : '') +
      (filtreler.length ? esc(filtreler.join(' / ')) + ' içinde ' : '') + 'okul bulunamadı.';
    if (filtreler.length) {
      h += ' <button type="button" class="baglanti" data-act="okul-ara-genislet">Tüm Türkiye\'de ara</button>';
    }
    h += '<br>Okulun adından tek bir kelime yazmayı dene (ör. yalnızca "Cumhuriyet"). ' +
      'Yine çıkmazsa aşağıdaki <b>Okul listede yok</b> bölümüne adını yaz.</div>';
    return h;
  }
  /* Yanlış yazılmış ya da bitişik kelime düzeltildiyse söylenir. */
  if (d.duzeltme) {
    h += '<div class="okul-bilgi okul-duzeltme">"' + esc(sorgu) + '" yerine <b>"' + esc(d.duzeltme) + '"</b> diye aradık.</div>';
  }
  if (d.yakin) {
    h += '<div class="okul-bilgi">Yazdığın kelimelerin hepsini içeren okul ' +
      (filtreler.length ? esc(filtreler.join(' / ')) + ' içinde ' : '') + 'yok.' +
      (filtreler.length ? ' <button type="button" class="baglanti" data-act="okul-ara-genislet">Tüm Türkiye\'de ara</button>' : '') +
      ' En yakın sonuçlar:</div>';
  } else if (d.toplam > d.okullar.length) {
    h += '<div class="okul-bilgi">' + d.toplam.toLocaleString('tr-TR') + ' sonuçtan ilk ' +
      d.okullar.length + ' tanesi gösteriliyor. Bir kelime daha yazarak ya da il seçerek daraltabilirsin.</div>';
  }
  for (var i = 0; i < d.okullar.length; i++) {
    var o = d.okullar[i];
    h += '<button type="button" class="okul-satir" data-okul-id="' + esc(o.id) + '"' +
      ' data-okul-ad="' + esc(o.ad) + '" data-okul-il="' + esc(o.il) + '"' +
      ' data-okul-ilce="' + esc(o.ilce) + '" data-okul-tip="' + esc(o.tip) + '">' +
      '<span class="ad">' + aramaVurgula(o.ad, kelimeler, o.vurgu) +
      (o.ozel ? '<span class="ozel-rozet">Özel</span>' : '') + '</span>' +
      '<span class="yer">' + esc(o.il) + ' / ' + esc(o.ilce) + ' · ' +
      esc(o.resmiTur || o.tip) + '</span>' +
      '</button>';
  }
  return h;
}

EYLEMLER['okul-ara-tekrar'] = function () { okulAramaBaslat(0); };
EYLEMLER['okul-ara-genislet'] = function () {
  $('bIl').value = '';
  ilceleriDoldur('');
  if ($('bOkulTip')) $('bOkulTip').value = '';
  okulAramaBaslat(0);
  $('bOkulAra').focus();
};

function okulSec(btn) {
  seciliOkul = {
    id: btn.getAttribute('data-okul-id'),
    ad: btn.getAttribute('data-okul-ad'),
    il: btn.getAttribute('data-okul-il'),
    ilce: btn.getAttribute('data-okul-ilce'),
    tip: btn.getAttribute('data-okul-tip')
  };
  okulAramaDurum.sira++;   // yoldaki arama sonucu seçimi silmesin
  if (okulAramaSayaci) clearTimeout(okulAramaSayaci);
  $('bOkulSonuc').innerHTML = '';
  $('bOkulAra').value = '';
  var kap = $('bOkulSecili');
  kap.style.display = '';
  kap.innerHTML = '<div class="secili-ic">' + ik('onay', 'secili-ikon') + '<div class="buyu">' +
    '<div class="ad">' + esc(seciliOkul.ad) + '</div>' +
    '<div class="yer">' + esc(seciliOkul.il) + ' / ' + esc(seciliOkul.ilce) + ' · ' + esc(seciliOkul.tip) + '</div>' +
    '</div><button type="button" class="btn gri kucuk" id="bOkulKaldir">Değiştir</button></div>';
  $('bOkulKaldir').onclick = okulSecimiTemizle;
  alanTemizle($('bOkulAra').closest('.field'));
  /* Seçilen okulun ili/ilçesi forma da yansısın. */
  if ($('bIl').value !== seciliOkul.il) {
    $('bIl').value = seciliOkul.il;
    ilceleriDoldur(seciliOkul.il);
  }
  $('bIlce').value = seciliOkul.ilce;
  if ($('bOkulAd')) $('bOkulAd').value = '';
  $('bOkulAra').closest('.okul-ust').style.display = 'none';
  $('bOkulKaldir').focus();
}

function okulSecimiTemizle() {
  seciliOkul = null;
  var kap = $('bOkulSecili');
  kap.style.display = 'none';
  kap.innerHTML = '';
  $('bOkulAra').closest('.okul-ust').style.display = '';
  $('bOkulAra').focus();
}
