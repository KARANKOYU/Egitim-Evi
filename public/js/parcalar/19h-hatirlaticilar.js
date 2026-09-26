/* Kişisel hatırlatıcılar: herkes kendine kurar. Bir kez (gün + saat), her
   gün, haftanın seçilen günleri ya da ayda bir; zamanı gelince bildirim gelir.
   Saatler Türkiye saatidir. */

var HATIRLATICI_SIKLIK = [
  { k: 'bir-kez', ad: 'Bir kez' }, { k: 'her-gun', ad: 'Her gün' },
  { k: 'her-hafta', ad: 'Her hafta' }, { k: 'her-ay', ad: 'Her ay' }
];
var HAFTA_KISA = ['', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

/* "Her hafta Pzt, Çar · 08:30" */
function hatirlaticiOzeti(h) {
  var s;
  if (h.siklik === 'bir-kez') s = tarihGun(h.tarih);
  else if (h.siklik === 'her-gun') s = 'Her gün';
  else if (h.siklik === 'her-hafta') s = 'Her hafta ' + h.gunler.map(function (g) { return HAFTA_KISA[g]; }).join(', ');
  else s = 'Her ayın ' + h.ayGunu + '. günü';
  return s + ' · ' + h.saat;
}

function hatirlaticiDurumu(h) {
  if (!h.aktif) {
    return h.siklik === 'bir-kez' && h.sonGonderim ? '<span class="etiket gri">Hatırlatıldı</span>' : '<span class="etiket gri">Durduruldu</span>';
  }
  if (!h.sonraki) return '<span class="etiket gri">Günü geçti</span>';
  return '<span class="etiket mavi">Sonraki: ' + esc(tarihSaat(h.sonraki)) + '</span>';
}

SAYFALAR.hatirlaticilar = function () {
  return api('/hatirlaticilar').then(function (d) {
    S._hatirlaticilar = d.hatirlaticilar;
    var h = hero('HATIRLATICILAR', 'Kendine hatırlatma kur: bir kez, her gün, haftanın belli günleri ya da ayda bir. Zamanı gelince bildirim gelir.');
    h += '<div class="kart"><div class="satir" style="border:0;padding:0"><div class="buyu hint">' +
      d.hatirlaticilar.length + ' / ' + d.sinir + ' hatırlatıcı. Yalnızca sen görürsün.</div>' +
      '<button class="btn" data-act="hatirlatici-yeni">' + ik('ekle') + 'Yeni hatırlatıcı</button></div></div>';
    if (!d.hatirlaticilar.length) {
      yaz(h + bosKutu('bildirim', 'Henüz hatırlatıcın yok. "Yeni hatırlatıcı" ile kur: ör. her pazartesi 08:00 "Beden eğitimi kıyafeti".'));
      return;
    }
    h += '<div class="kart" style="padding:0">';
    for (var i = 0; i < d.hatirlaticilar.length; i++) {
      var x = d.hatirlaticilar[i];
      h += '<div class="satir' + (x.aktif ? '' : ' soluk-satir') + '" data-ara="' + esc(x.baslik + ' ' + x.aciklama) + '">' +
        '<span class="hatirlatici-ikon">' + ik('bildirim') + '</span>' +
        '<div class="buyu"><div class="ad">' + esc(x.baslik) + '</div>' +
        (x.aciklama ? '<div class="alt">' + esc(x.aciklama) + '</div>' : '') +
        '<div class="alt">' + esc(hatirlaticiOzeti(x)) + '</div></div>' +
        hatirlaticiDurumu(x) +
        '<button class="btn kucuk ghost" data-act="hatirlatici-duzenle" data-id="' + esc(x.id) + '">Düzenle</button>' +
        '<button class="btn kucuk gri" data-act="hatirlatici-durum" data-id="' + esc(x.id) + '" data-aktif="' + (x.aktif ? '0' : '1') + '">' +
        (x.aktif ? 'Durdur' : 'Başlat') + '</button>' +
        '<button class="btn kucuk tehlike" data-act="hatirlatici-sil" data-id="' + esc(x.id) + '">Sil</button></div>';
    }
    yaz(h + '</div>');
  });
};

function hatirlaticiPenceresi(x) {
  x = x || { siklik: 'her-hafta', saat: '08:00', gunler: [1], ayGunu: 1, tarih: '' };
  var bugun = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  var sec = '';
  for (var i = 0; i < HATIRLATICI_SIKLIK.length; i++) {
    var s = HATIRLATICI_SIKLIK[i];
    sec += '<label class="secim-dugme"><input type="radio" name="hSiklik" value="' + s.k + '"' + (x.siklik === s.k ? ' checked' : '') + '>' +
      '<span>' + esc(s.ad) + '</span></label>';
  }
  var gunler = '';
  for (var g = 1; g <= 7; g++) {
    gunler += '<label class="secim-dugme"><input type="checkbox" class="h-gun" value="' + g + '"' +
      ((x.gunler || []).indexOf(g) >= 0 ? ' checked' : '') + '><span>' + HAFTA_KISA[g] + '</span></label>';
  }
  var ay = '';
  for (var a = 1; a <= 31; a++) ay += '<option value="' + a + '"' + (x.ayGunu === a ? ' selected' : '') + '>' + a + '</option>';
  var govde =
    '<div class="field"><label for="hBaslik">Başlık</label><input type="text" id="hBaslik" maxlength="120" value="' + esc(x.baslik || '') + '" placeholder="ör. Beden eğitimi kıyafeti"></div>' +
    '<div class="field"><label for="hAciklama">Açıklama (isteğe bağlı)</label><textarea id="hAciklama" maxlength="1000" rows="2">' + esc(x.aciklama || '') + '</textarea></div>' +
    '<div class="field"><span class="etiket-baslik">Ne sıklıkla?</span><div class="secim-dugmeler" id="hSiklikler">' + sec + '</div></div>' +
    '<div class="field h-alan" data-siklik="bir-kez"><label for="hTarih">Gün</label><input type="date" id="hTarih" min="' + bugun + '" value="' + esc(x.tarih || bugun) + '"></div>' +
    '<div class="field h-alan" data-siklik="her-hafta"><span class="etiket-baslik">Hangi günler?</span><div class="secim-dugmeler">' + gunler + '</div></div>' +
    '<div class="field h-alan" data-siklik="her-ay"><label for="hAyGunu">Ayın kaçı?</label><select id="hAyGunu">' + ay + '</select>' +
    '<div class="hint">Ay o kadar çekmiyorsa ayın son günü hatırlatılır.</div></div>' +
    '<div class="field"><label for="hSaat">Saat</label><input type="time" id="hSaat" value="' + esc(x.saat || '08:00') + '"></div>' +
    '<div id="hMesaj"></div>';
  modalAc(x.id ? 'Hatırlatıcıyı düzenle' : 'Yeni hatırlatıcı', govde,
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
    '<button class="btn" data-act="hatirlatici-kaydet" data-id="' + esc(x.id || '') + '">Kaydet</button>');
  var goster = function () {
    var secili = (document.querySelector('input[name="hSiklik"]:checked') || {}).value;
    Array.prototype.forEach.call(document.querySelectorAll('.h-alan'), function (e) {
      e.style.display = e.getAttribute('data-siklik') === secili ? '' : 'none';
    });
  };
  Array.prototype.forEach.call(document.querySelectorAll('input[name="hSiklik"]'), function (r) { r.addEventListener('change', goster); });
  goster();
  $('hBaslik').focus();
}

EYLEMLER['hatirlatici-yeni'] = function () { hatirlaticiPenceresi(null); };
EYLEMLER['hatirlatici-duzenle'] = function (el, id) {
  var x = (S._hatirlaticilar || []).filter(function (h) { return h.id === id; })[0];
  if (x) hatirlaticiPenceresi(x);
};

EYLEMLER['hatirlatici-kaydet'] = function (el, id) {
  var g = {
    baslik: $('hBaslik').value, aciklama: $('hAciklama').value,
    siklik: (document.querySelector('input[name="hSiklik"]:checked') || {}).value || '',
    tarih: $('hTarih').value, saat: $('hSaat').value, ayGunu: Number($('hAyGunu').value),
    gunler: Array.prototype.map.call(document.querySelectorAll('.h-gun:checked'), function (c) { return Number(c.value); })
  };
  if (!String(g.baslik).trim()) { mesajGoster('hMesaj', 'hata', 'Başlık yaz.'); $('hBaslik').focus(); return; }
  if (g.siklik === 'her-hafta' && !g.gunler.length) { mesajGoster('hMesaj', 'hata', 'Haftanın en az bir gününü seç.'); return; }
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/hatirlaticilar' + (id ? '/' + encodeURIComponent(id) : ''), 'POST', g).then(function (d) {
    modalKapat();
    return git('hatirlaticilar').then(function () { sayfaMesaji('iyi', d.message + (d.hatirlatici.sonraki ? ' İlk hatırlatma: ' + tarihSaat(d.hatirlatici.sonraki) + '.' : '')); });
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('hMesaj', 'hata', e.message); });
};

EYLEMLER['hatirlatici-durum'] = function (el, id) {
  el.disabled = true;
  return api('/hatirlaticilar/' + encodeURIComponent(id) + '/durum', 'POST', { aktif: el.getAttribute('data-aktif') === '1' })
    .then(function (d) { return git('hatirlaticilar').then(function () { sayfaMesaji('iyi', d.message); }); })
    ['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

EYLEMLER['hatirlatici-sil'] = function (el, id) {
  if (!confirm('Hatırlatıcı silinsin mi?')) return;
  el.disabled = true;
  return api('/hatirlaticilar/' + encodeURIComponent(id) + '/sil', 'POST', {})
    .then(function () { return git('hatirlaticilar'); })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};
