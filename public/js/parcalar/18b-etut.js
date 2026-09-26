/* Etütler: ders dışı, belli gün ve saatte yapılan çalışma.

     etutler        okul personeli: liste; etüt sorumlusu açar, düzenler,
                    öğrencileri seçer; öğretmen ve yetkili yoklama alır
     etut-yoklama   bir etüdün bir günkü yoklaması: geldi / izinli / izinsiz
     etutlerim      öğrenci kendi etütlerini, veli çocuğununkileri görür

   Kim neyi yapabilir sunucuda denetlenir (sunucu/bolumler/etut.js); burada
   yalnızca izin verilen düğmeler gösterilir. */

var ETUT = { liste: [], yonetebilir: false, bugun: '', adaylar: null, secili: null };

var GUN_ADLARI_TAM = ['', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
var ETUT_DURUMLAR = [['var', 'Geldi'], ['izinli', 'İzinli'], ['yok', 'İzinsiz']];
var ETUT_DURUM_AD = { var: 'Geldi', izinli: 'Gelmedi (izinli)', yok: 'Gelmedi (izinsiz)' };

function tarihYazisi(t) { return t ? t.slice(8, 10) + '.' + t.slice(5, 7) + '.' + t.slice(0, 4) : ''; }

/* Bugünden geriye, etüdün gününe denk gelen ilk tarih (bugün de olabilir). */
function etutSonTarihi(gun, bugun) {
  var p = bugun.split('-');
  var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  var fark = ((d.getDay() + 6) % 7) + 1 - gun;
  if (fark < 0) fark += 7;
  d.setDate(d.getDate() - fark);
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}
function tarihEkle(t, gun) {
  var p = t.split('-');
  var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]) + gun);
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}

function etutSaati(e) { return e.gunAdi + ' ' + e.baslangic + '–' + e.bitis + (e.yer ? ' · ' + e.yer : ''); }

/* ---------------- personel: liste ---------------- */
SAYFALAR.etutler = function () {
  return api('/etut').then(function (d) {
    ETUT.liste = d.etutler;
    ETUT.yonetebilir = d.yonetebilir;
    ETUT.bugun = d.bugun;
    var h = hero('ETÜTLER', d.yonetebilir ? 'Etüt aç, öğretmenini ve öğrencilerini seç; yoklamaları buradan alınır.'
      : 'Sana verilen etütler. Yoklamayı etüt günü alırsın.');
    if (d.yonetebilir) {
      h += '<div class="kart"><div class="satir" style="border:0;padding:0"><div class="buyu"><div class="ad">Yeni etüt</div>' +
        '<div class="alt">Gün, saat ve yer; sonra öğretmenini ve öğrencilerini seç.</div></div>' +
        '<button class="btn" data-act="etut-yeni">Etüt aç</button></div></div>';
    }
    if (!d.etutler.length) {
      yaz(h + bosKutu('saat', d.yonetebilir ? 'Henüz etüt yok.' : 'Sana verilmiş bir etüt yok.'));
      return;
    }
    h += '<div class="kart">';
    for (var i = 0; i < d.etutler.length; i++) {
      var e = d.etutler[i];
      h += '<div class="satir" data-ara="' + esc(e.ad + ' ' + e.ogretmenAdi + ' ' + e.gunAdi) + '">' +
        '<div class="buyu"><div class="ad">' + esc(e.ad) + '</div>' +
        '<div class="alt">' + esc(etutSaati(e)) + '</div>' +
        '<div class="alt">' + (e.ogretmenAdi ? esc(e.ogretmenAdi) : 'Öğretmen seçilmedi') + ' · ' +
        e.ogrenciSayisi + ' öğrenci</div></div>' +
        (e.yoklamaAlabilir ? '<button class="btn kucuk" data-act="etut-yoklama-ac" data-id="' + esc(e.id) + '">Yoklama</button>' : '') +
        (d.yonetebilir
          ? '<button class="btn kucuk ghost" data-act="etut-ogrenciler" data-id="' + esc(e.id) + '">Öğrenciler</button>' +
            '<button class="btn kucuk gri" data-act="etut-duzenle" data-id="' + esc(e.id) + '">Düzenle</button>' +
            '<button class="btn kucuk tehlike" data-act="etut-sil" data-id="' + esc(e.id) + '" data-ad="' + esc(e.ad) + '">Sil</button>'
          : '') +
        '</div>';
    }
    yaz(h + '</div>');
  });
};

function etutBul(id) {
  for (var i = 0; i < ETUT.liste.length; i++) if (ETUT.liste[i].id === id) return ETUT.liste[i];
  return null;
}

function etutAdaylari() {
  if (ETUT.adaylar) return Promise.resolve(ETUT.adaylar);
  return api('/etut/adaylar').then(function (d) { ETUT.adaylar = d; return d; });
}

/* ---------------- etüt aç / düzenle ---------------- */
function etutModal(e) {
  return etutAdaylari().then(function (a) {
    var gunler = '';
    for (var g = 1; g <= 7; g++) {
      gunler += '<option value="' + g + '"' + (e && e.gun === g ? ' selected' : '') + '>' + GUN_ADLARI_TAM[g] + '</option>';
    }
    var ogretmenler = '<option value="">— sonra seçerim —</option>';
    for (var i = 0; i < a.ogretmenler.length; i++) {
      ogretmenler += '<option value="' + esc(a.ogretmenler[i].id) + '"' +
        (e && e.ogretmenId === a.ogretmenler[i].id ? ' selected' : '') + '>' + esc(a.ogretmenler[i].ad) + '</option>';
    }
    modalAc(e ? 'Etüdü düzenle' : 'Yeni etüt',
      '<div class="field"><label for="etAd">Adı</label>' +
      '<input type="text" id="etAd" maxlength="80" placeholder="ör. 8. sınıf Matematik etüdü" value="' + esc(e ? e.ad : '') + '"></div>' +
      '<div class="row2"><div class="field"><label for="etGun">Gün</label><select id="etGun">' + gunler + '</select></div>' +
      '<div class="field"><label for="etYer">Yer (isteğe bağlı)</label>' +
      '<input type="text" id="etYer" maxlength="60" placeholder="ör. Kütüphane" value="' + esc(e ? e.yer : '') + '"></div></div>' +
      '<div class="row2"><div class="field"><label for="etBas">Başlangıç</label>' +
      '<input type="time" id="etBas" value="' + esc(e ? e.baslangic : '15:40') + '"></div>' +
      '<div class="field"><label for="etBit">Bitiş</label>' +
      '<input type="time" id="etBit" value="' + esc(e ? e.bitis : '16:20') + '"></div></div>' +
      '<div class="field"><label for="etOgretmen">Öğretmeni</label><select id="etOgretmen">' + ogretmenler + '</select>' +
      '<div class="hint">Etüdün öğretmeni kendi etüdünde, etüt günü yoklama alır.</div></div>' +
      '<div id="etMesaj"></div>',
      '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
      '<button class="btn" data-act="etut-kaydet" data-id="' + esc(e ? e.id : '') + '">Kaydet</button>');
    $('etAd').focus();
  });
}

EYLEMLER['etut-yeni'] = function () { return etutModal(null)['catch'](hataGoster); };
EYLEMLER['etut-duzenle'] = function (el, id) { return etutModal(etutBul(id))['catch'](hataGoster); };

EYLEMLER['etut-kaydet'] = function (el, id) {
  var kok = $('modalGovde');
  formHatalariniSil(kok);
  var g = { id: id || undefined, ad: $('etAd').value.trim(), gun: Number($('etGun').value),
    baslangic: $('etBas').value, bitis: $('etBit').value, yer: $('etYer').value.trim(), ogretmenId: $('etOgretmen').value };
  if (!g.ad) alanHatasi('etAd', 'Etüdün adını yaz.');
  if (!g.baslangic) alanHatasi('etBas', 'Başlangıç saatini seç.');
  if (!g.bitis) alanHatasi('etBit', 'Bitiş saatini seç.');
  else if (g.baslangic && g.bitis <= g.baslangic) alanHatasi('etBit', 'Bitiş başlangıçtan sonra olmalı.');
  if (kok.querySelector('.hatali')) { ilkHatayaGit(kok); return; }
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/etut/kaydet', 'POST', g).then(function (d) {
    modalKapat();
    return git('etutler').then(function () { sayfaMesaji('iyi', d.message); });
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('etMesaj', 'hata', e.message); });
};

EYLEMLER['etut-sil'] = function (el, id) {
  if (!confirm((el.getAttribute('data-ad') || 'Bu etüt') + ' silinsin mi? Yoklamaları da silinir.')) return;
  el.disabled = true;
  return api('/etut/sil', 'POST', { id: id, onay: true }).then(function (d) {
    return git('etutler').then(function () { sayfaMesaji('iyi', d.message); });
  })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

/* ---------------- öğrenci seçimi ---------------- */
EYLEMLER['etut-ogrenciler'] = function (el, id) {
  return Promise.all([etutAdaylari(), api('/etut/detay?id=' + encodeURIComponent(id))]).then(function (r) {
    var a = r[0], d = r[1];
    var secili = {};
    for (var i = 0; i < d.ogrenciler.length; i++) secili[d.ogrenciler[i].id] = true;
    var sinifAd = {};
    for (var s = 0; s < a.siniflar.length; s++) sinifAd[a.siniflar[s].id] = a.siniflar[s].ad;
    var siniflar = '<option value="">Bütün sınıflar</option>';
    for (var c = 0; c < a.siniflar.length; c++) {
      siniflar += '<option value="' + esc(a.siniflar[c].id) + '">' + esc(a.siniflar[c].ad) + '</option>';
    }
    var liste = '';
    for (var k = 0; k < a.ogrenciler.length; k++) {
      var o = a.ogrenciler[k];
      liste += '<label class="onay etut-ogrenci" data-sinif="' + esc(o.sinifId) + '" data-ara="' + esc(o.ad) + '">' +
        '<input type="checkbox" class="etut-ogr-kutu" value="' + esc(o.id) + '"' + (secili[o.id] ? ' checked' : '') + '>' +
        '<span>' + esc(o.ad) + (o.sinifId ? ' <span class="soluk">' + esc(sinifAd[o.sinifId] || '') + '</span>' : '') +
        '</span></label>';
    }
    modalAc(d.etut.ad + ' — öğrenciler',
      '<div class="row2"><div class="field"><label for="etoSinif">Sınıf</label><select id="etoSinif">' + siniflar + '</select></div>' +
      '<div class="field"><label for="etoAra">Ara</label><input type="search" id="etoAra" placeholder="Öğrenci adı" autocomplete="off"></div></div>' +
      '<div class="dugme-satir" style="margin:0 0 8px"><button class="btn kucuk gri" data-act="etut-gorunenleri-sec" data-deger="1">Görünenleri seç</button>' +
      '<button class="btn kucuk gri" data-act="etut-gorunenleri-sec" data-deger="0">Görünenleri kaldır</button>' +
      '<span class="soluk" id="etoSayi"></span></div>' +
      '<div class="etut-ogrenci-liste">' + (liste || '<div class="hint">Okulda öğrenci yok.</div>') + '</div>' +
      '<div id="etoMesaj" style="margin-top:10px"></div>',
      '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
      '<button class="btn" data-act="etut-ogrenci-kaydet" data-id="' + esc(id) + '">Kaydet</button>');
    var suz = function () {
      var sinif = $('etoSinif').value, ara = aramaSadeTR($('etoAra').value);
      var satirlar = document.querySelectorAll('.etut-ogrenci');
      for (var i = 0; i < satirlar.length; i++) {
        var gorunur = (!sinif || satirlar[i].getAttribute('data-sinif') === sinif) &&
          (!ara || aramaSadeTR(satirlar[i].getAttribute('data-ara')).indexOf(ara) >= 0);
        satirlar[i].hidden = !gorunur;
      }
      etutSeciliSay();
    };
    $('etoSinif').onchange = suz;
    $('etoAra').oninput = suz;
    document.querySelector('.etut-ogrenci-liste').addEventListener('change', etutSeciliSay);
    etutSeciliSay();
  })['catch'](hataGoster);
};

function etutSeciliSay() {
  var n = document.querySelectorAll('.etut-ogr-kutu:checked').length;
  if ($('etoSayi')) $('etoSayi').textContent = n + ' öğrenci seçili';
}

EYLEMLER['etut-gorunenleri-sec'] = function (el) {
  var deger = el.getAttribute('data-deger') === '1';
  var satirlar = document.querySelectorAll('.etut-ogrenci');
  for (var i = 0; i < satirlar.length; i++) if (!satirlar[i].hidden) satirlar[i].querySelector('input').checked = deger;
  etutSeciliSay();
};

EYLEMLER['etut-ogrenci-kaydet'] = function (el, id) {
  var idler = [];
  var kutular = document.querySelectorAll('.etut-ogr-kutu:checked');
  for (var i = 0; i < kutular.length; i++) idler.push(kutular[i].value);
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/etut/ogrenciler', 'POST', { id: id, ogrenciIdler: idler }).then(function (d) {
    modalKapat();
    return git('etutler').then(function () { sayfaMesaji('iyi', d.message); });
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('etoMesaj', 'hata', e.message); });
};

/* ---------------- yoklama ---------------- */
EYLEMLER['etut-yoklama-ac'] = function (el, id) {
  var e = etutBul(id);
  ETUT.secili = { id: id, tarih: e ? etutSonTarihi(e.gun, ETUT.bugun) : '' };
  return git('etut-yoklama');
};

SAYFALAR['etut-yoklama'] = function () {
  var s = ETUT.secili;
  if (!s) return git('etutler');
  return api('/etut/yoklama?id=' + encodeURIComponent(s.id) + (s.tarih ? '&tarih=' + s.tarih : '')).then(function (d) {
    s.tarih = d.tarih;
    s.durumlar = {};
    for (var i = 0; i < d.ogrenciler.length; i++) s.durumlar[d.ogrenciler[i].id] = d.ogrenciler[i].durum || '';
    var h = hero(d.etut.ad.toLocaleUpperCase('tr'), etutSaati(d.etut));
    h += '<div class="kart"><div class="etut-tarih">' +
      '<button class="btn kucuk gri" data-act="etut-hafta" data-yon="-7" aria-label="Önceki hafta">' + ik('geri') + '</button>' +
      '<div class="etut-tarih-yazi"><b>' + esc(tarihYazisi(d.tarih)) + '</b><span class="soluk">' + esc(d.etut.gunAdi) + '</span></div>' +
      '<button class="btn kucuk gri" data-act="etut-hafta" data-yon="7" aria-label="Sonraki hafta">' +
      '<span class="ters">' + ik('geri') + '</span></button>' +
      '<button class="btn kucuk ghost" data-act="etutler-don">Etütlere dön</button></div>' +
      (d.engel ? '<div class="msg bilgi" style="margin-top:12px">' + esc(d.engel) + '</div>' : '') + '</div>';
    if (!d.ogrenciler.length) {
      yaz(h + bosKutu('ogrenci', 'Bu etüde henüz öğrenci eklenmedi.'));
      return;
    }
    var kilitli = !!d.engel;
    h += '<div class="kart">';
    if (!kilitli) {
      h += '<div class="dugme-satir" style="margin:0 0 10px"><button class="btn kucuk gri" data-act="etut-hepsi-geldi">Hepsi geldi</button></div>';
    }
    for (var j = 0; j < d.ogrenciler.length; j++) {
      var o = d.ogrenciler[j];
      h += '<div class="satir etut-yoklama-satir"><div class="buyu"><div class="ad">' + esc(o.ad) + '</div>' +
        '<div class="alt">' + esc(o.sinif || 'sınıfsız') + '</div></div><div class="durum-grup">';
      for (var k = 0; k < ETUT_DURUMLAR.length; k++) {
        var dr = ETUT_DURUMLAR[k];
        h += '<button class="durum-dugme ' + dr[0] + (o.durum === dr[0] ? ' secili' : '') + '" data-act="etut-durum" ' +
          'data-id="' + esc(o.id) + '" data-durum="' + dr[0] + '"' + (kilitli ? ' disabled' : '') + '>' + dr[1] + '</button>';
      }
      h += '</div></div>';
    }
    h += (kilitli ? '' : '<div class="dugme-satir"><button class="btn" data-act="etut-yoklama-kaydet">Yoklamayı kaydet</button></div>') +
      '<div id="etyMesaj" style="margin-top:10px"></div></div>';
    yaz(h);
  });
};

EYLEMLER['etutler-don'] = function () { return git('etutler'); };

EYLEMLER['etut-hafta'] = function (el) {
  if (!ETUT.secili || !ETUT.secili.tarih) return;
  var yeni = tarihEkle(ETUT.secili.tarih, Number(el.getAttribute('data-yon')));
  if (ETUT.bugun && yeni > ETUT.bugun) { sayfaMesaji('bilgi', 'İleri bir tarihe yoklama alınmaz.'); return; }
  ETUT.secili.tarih = yeni;
  return SAYFALAR['etut-yoklama']();
};

function etutDurumYaz(ogrenciId, durum) {
  ETUT.secili.durumlar[ogrenciId] = durum;
  var dugmeler = document.querySelectorAll('.durum-dugme[data-id="' + ogrenciId + '"]');
  for (var i = 0; i < dugmeler.length; i++) {
    dugmeler[i].classList.toggle('secili', dugmeler[i].getAttribute('data-durum') === durum);
  }
}

EYLEMLER['etut-durum'] = function (el, id) { etutDurumYaz(id, el.getAttribute('data-durum')); };

EYLEMLER['etut-hepsi-geldi'] = function () {
  for (var id in ETUT.secili.durumlar) if (!ETUT.secili.durumlar[id]) etutDurumYaz(id, 'var');
};

