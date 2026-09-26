/* Roller ve yetkiler (müdür ya da "rol yönetir" yetkisi olan).

   Okuldaki her öğretmen hazır "Öğretmen" rolünün yetkilerine sahiptir; müdür
   bu rolün yetkilerini açıp kapatır. Ek görev verilecek öğretmene ayrıca bir
   rol verilir (Müdür Yardımcısı, Etüt Sorumlusu...); o öğretmenin yetkileri
   iki rolün birleşimidir. Yeni rol hazır bir şablondan başlatılabilir.
   Bütün denetim sunucuda (sunucu/yetki.js); burada yalnızca seçim yapılır. */

var ROL = { liste: [], gruplar: [], sablonlar: [], siniflar: [], dersler: [] };

function ogretmenRolu() {
  for (var i = 0; i < ROL.liste.length; i++) if (ROL.liste[i].tur === 'ogretmen') return ROL.liste[i];
  return null;
}

SAYFALAR.roller = function () {
  return Promise.all([api('/school/roles'), api('/school/permissions'),
                      api('/school/teachers'), api('/school/classes'), api('/meta')])
    .then(function (r) {
      ROL.liste = r[0].roles;
      ROL.gruplar = r[1].gruplar;
      ROL.sablonlar = r[1].sablonlar || [];
      ROL.siniflar = r[3].classes;
      ROL.dersler = r[4].subjects;
      var hazir = ogretmenRolu();
      var ozeller = ROL.liste.filter(function (x) { return x.tur !== 'ogretmen'; });

      var h = hero('ROLLER VE YETKİLER',
        'Her öğretmen "Öğretmen" rolünün yetkilerine sahiptir. Ek görev verdiğin öğretmene ayrıca bir rol ver.');

      if (hazir) {
        h += '<div class="kart"><h3>Öğretmen <span class="etiket">hazır rol</span></h3>' +
          '<div class="satir" style="border:0;padding:0"><div class="buyu">' +
          '<div class="alt">Okuldaki ' + hazir.kisiSayisi + ' öğretmenin hepsinde. Silinmez; istemediğin yetkiyi kapatabilirsin.</div>' +
          '<div style="margin-top:6px">' + yetkiEtiketleri(hazir.permissions) + '</div></div>' +
          '<button class="btn kucuk ghost" data-act="rol-duzenle" data-id="' + esc(hazir.id) + '">Düzenle</button></div></div>';
      }

      h += '<div class="kart"><h3>Ek roller (' + ozeller.length + ')</h3>';
      if (!ozeller.length) {
        h += '<div class="hint" style="margin-bottom:10px">Henüz ek rol yok. Müdür yardımcısı, etüt sorumlusu gibi ' +
          'görevler için bir rol oluştur; hazır şablonlardan başlayabilirsin.</div>';
      }
      for (var i = 0; i < ozeller.length; i++) {
        var rol = ozeller[i];
        h += '<div class="satir" data-ara="' + esc(rol.name) + '">' +
          '<div class="buyu"><div class="ad">' + esc(rol.name) + '</div>' +
          '<div class="alt">' + rol.permissions.length + ' yetki · ' +
          (rol.kisiSayisi ? rol.kisiSayisi + ' kişide' : 'kimseye verilmemiş') + '</div>' +
          '<div style="margin-top:5px">' + yetkiEtiketleri(rol.permissions, rol.kapsam) + '</div></div>' +
          '<button class="btn kucuk ghost" data-act="rol-duzenle" data-id="' + esc(rol.id) + '">Düzenle</button>' +
          '<button class="btn kucuk tehlike" data-act="rol-sil" data-id="' + esc(rol.id) + '" ' +
          'data-ad="' + esc(rol.name) + '">Sil</button></div>';
      }
      h += '<div class="dugme-satir"><button class="btn" data-act="rol-yeni">Rol oluştur</button></div></div>';

      /* Öğretmenlere ek rol verme */
      var onayli = r[2].teachers.filter(function (t) { return t.status === 'approved'; });
      h += '<div class="kart"><h3>Öğretmenlerin ek rolleri</h3>';
      if (!onayli.length) {
        h += '<div class="hint">Okulda öğretmen yok.</div>';
      } else {
        for (var j = 0; j < onayli.length; j++) {
          var t = onayli[j];
          h += '<div class="satir" data-ara="' + esc(t.fullName) + '">' +
            '<div class="buyu"><div class="ad">' + esc(t.fullName) + '</div>' +
            '<div class="alt">' + esc(t.branch || '') + '</div></div>' +
            '<select class="rol-sec" data-id="' + esc(t.id) + '" aria-label="' + esc(t.fullName) + ' için ek rol">' +
            '<option value="">— yalnızca Öğretmen —</option>';
          for (var k = 0; k < ozeller.length; k++) {
            h += '<option value="' + esc(ozeller[k].id) + '"' +
              (t.customRoleId === ozeller[k].id ? ' selected' : '') + '>' + esc(ozeller[k].name) + '</option>';
          }
          h += '</select></div>';
        }
      }
      h += '</div>';

      yaz(h);
      rolSecBagla();
    });
};

/* Yetki anahtarını okunur ada çevirir ("odev.ver" -> "Ödev verir"). */
function yetkiAdi(anahtar) {
  for (var i = 0; i < ROL.gruplar.length; i++) {
    var g = ROL.gruplar[i];
    for (var j = 0; j < g.liste.length; j++) if (g.liste[j].k === anahtar) return g.liste[j].ad;
  }
  return anahtar;
}

function yetkiEtiketleri(liste, kapsam) {
  if (!liste || !liste.length) return '<span class="etiket gri">yetki yok</span>';
  var h = '';
  for (var i = 0; i < liste.length; i++) {
    var k = kapsam && kapsam[liste[i]];
    var ek = '';
    if (k) {
      var parca = [];
      if (k.dersler && k.dersler.indexOf('*') < 0) parca.push(k.dersler.join(', '));
      if (k.siniflar && k.siniflar.indexOf('*') < 0) {
        parca.push(k.siniflar.map(function (sid) {
          for (var m = 0; m < ROL.siniflar.length; m++) if (ROL.siniflar[m].id === sid) return ROL.siniflar[m].name;
          return '?';
        }).join(', '));
      }
      if (parca.length) ek = ' — ' + parca.join(' / ');
    }
    h += '<span class="etiket">' + esc(yetkiAdi(liste[i]) + ek) + '</span> ';
  }
  return h;
}

function rolSecBagla() {
  var kutular = document.querySelectorAll('.rol-sec');
  for (var i = 0; i < kutular.length; i++) {
    (function (sel) {
      sel.onchange = function () {
        sel.disabled = true;
        api('/school/role-assign', 'POST', { userId: sel.getAttribute('data-id'), roleId: sel.value })
          .then(function () { git('roller'); })
          ['catch'](function (e) { sel.disabled = false; hataGoster(e); });
      };
    })(kutular[i]);
  }
}

/* Bir yetkinin ders ya da sınıf daraltması için kutu listesi.
   Hiçbiri seçili değilse "hepsi" demektir. */
function kapsamSecici(tur, izin, baslik, liste, deger, etiket, secili) {
  var hepsi = !secili || !secili.length || secili.indexOf('*') >= 0;
  var h = '<div class="kapsam-kutu">' +
    '<div class="kapsam-basi">' + esc(baslik) +
    '<label class="onay kapsam-hepsi"><input type="checkbox" class="kapsam-tumu" ' +
    'data-izin="' + esc(izin) + '" data-tur="' + tur + '"' + (hepsi ? ' checked' : '') + '>' +
    '<span>Tümü</span></label></div>' +
    '<div class="kapsam-secenekler"' + (hepsi ? ' hidden' : '') + '>';
  for (var i = 0; i < (liste || []).length; i++) {
    var d = deger(liste[i]);
    h += '<label class="onay kapsam-secenek">' +
      '<input type="checkbox" class="kapsam-oge" data-izin="' + esc(izin) + '" ' +
      'data-tur="' + tur + '" value="' + esc(d) + '"' +
      (!hepsi && secili.indexOf(d) >= 0 ? ' checked' : '') + '>' +
      '<span>' + esc(etiket(liste[i])) + '</span></label>';
  }
  return h + '</div></div>';
}

/* Rol penceresi. Hazır Öğretmen rolünde ad ve ders/sınıf daraltması yoktur.
   Ek rolde, Öğretmen rolünde zaten açık olan yetkiler işaretli ve kilitli
   görünür: onlar zaten her öğretmende var, ek role yazılmaz. */
function rolModal(rolId) {
  var mevcut = null;
  for (var i = 0; i < ROL.liste.length; i++) if (ROL.liste[i].id === rolId) mevcut = ROL.liste[i];
  var hazirMi = !!(mevcut && mevcut.tur === 'ogretmen');
  var secili = mevcut ? mevcut.permissions.slice() : [];
  var ogretmende = hazirMi ? [] : ((ogretmenRolu() || {}).permissions || []);

  var h = '';
  if (hazirMi) {
    h += '<p class="hint" style="margin-top:0">Buradaki yetkiler okuldaki her öğretmende açıktır. Kapattığın yetki, ' +
      'ek rolü olmayan öğretmenlerden kalkar.</p>';
  } else {
    if (!mevcut && ROL.sablonlar.length) {
      h += '<div class="field"><label for="rSablon">Şablondan başla (isteğe bağlı)</label><select id="rSablon">' +
        '<option value="">— boş başla —</option>';
      for (var s = 0; s < ROL.sablonlar.length; s++) {
        h += '<option value="' + s + '">' + esc(ROL.sablonlar[s].ad) + '</option>';
      }
      h += '</select><div class="hint">Şablon yalnızca yetkileri işaretler; sonra istediğin gibi değiştirirsin.</div></div>';
    }
    h += '<div class="field"><label for="rAd">Rol adı</label>' +
      '<input type="text" id="rAd" maxlength="40" placeholder="ör. Etüt Sorumlusu" ' +
      'value="' + esc(mevcut ? mevcut.name : '') + '"></div>';
  }

  h += '<div class="yetki-liste">';
  for (var g = 0; g < ROL.gruplar.length; g++) {
    var grup = ROL.gruplar[g];
    h += '<div class="yetki-grup"><div class="yetki-grup-ad">' + esc(grup.grup) + '</div>';
    for (var j = 0; j < grup.liste.length; j++) {
      var y = grup.liste[j];
      var kilitli = ogretmende.indexOf(y.k) >= 0;
      var acik = secili.indexOf(y.k) >= 0 || kilitli;
      var kap = (mevcut && mevcut.kapsam && mevcut.kapsam[y.k]) || null;

      h += '<div class="yetki-blok">' +
        '<label class="onay yetki-satir">' +
        '<input type="checkbox" class="yetki-kutu" value="' + esc(y.k) + '"' +
        (acik ? ' checked' : '') + (kilitli ? ' disabled' : '') + '>' +
        '<span><b>' + esc(y.ad) + '</b>' +
        (kilitli ? ' <span class="etiket gri">Öğretmen rolünde var</span>' : '') +
        (y.aciklama ? '<br><span class="yetki-aciklama">' + esc(y.aciklama) + '</span>' : '') +
        '</span></label>';

      if (!hazirMi && !kilitli && y.kapsam && y.kapsam.length) {
        h += '<div class="kapsam-alan" data-izin="' + esc(y.k) + '"' + (acik ? '' : ' hidden') + '>';
        if (y.kapsam.indexOf('ders') >= 0) {
          h += kapsamSecici('ders', y.k, 'Dersler', ROL.dersler,
            function (x) { return x; }, function (x) { return x; }, kap ? kap.dersler : null);
        }
        if (y.kapsam.indexOf('sinif') >= 0) {
          h += kapsamSecici('sinif', y.k, 'Sınıflar', ROL.siniflar,
            function (x) { return x.id; }, function (x) { return x.name; }, kap ? kap.siniflar : null);
        }
        h += '</div>';
      }
      h += '</div>';
    }
    h += '</div>';
  }
  h += '</div><div id="rolMesaj" style="margin-top:10px"></div>';

  modalAc(hazirMi ? 'Öğretmen rolü' : mevcut ? 'Rolü düzenle' : 'Yeni rol', h,
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
    '<button class="btn" data-act="rol-kaydet" data-id="' + esc(rolId || '') + '"' +
    (hazirMi ? ' data-hazir="1"' : '') + '>Kaydet</button>');

  rolKapsamBagla();
  if ($('rSablon')) $('rSablon').onchange = function () { rolSablonuUygula(this.value); };
}

/* Şablon seçilince: şablondaki yetkiler işaretlenir, ötekiler kalkar
   (Öğretmen rolünden gelen kilitli kutulara dokunulmaz). Ad boşsa şablonun adı. */
function rolSablonuUygula(sira) {
  var sablon = ROL.sablonlar[Number(sira)];
  var kutular = document.querySelectorAll('.yetki-kutu');
  for (var i = 0; i < kutular.length; i++) {
    if (kutular[i].disabled) continue;
    kutular[i].checked = !!sablon && sablon.yetkiler.indexOf(kutular[i].value) >= 0;
    kutular[i].onchange();
  }
  if (sablon && !$('rAd').value.trim()) $('rAd').value = sablon.ad;
}

/* Yetki kutusu kapanınca kapsam alanı gizlenir; "Tümü" seçilince tek tek
   seçenekler saklanır. */
function rolKapsamBagla() {
  var yetkiKutulari = document.querySelectorAll('.yetki-kutu');
  for (var i = 0; i < yetkiKutulari.length; i++) {
    (function (kutu) {
      kutu.onchange = function () {
        var alan = document.querySelector('.kapsam-alan[data-izin="' + kutu.value + '"]');
        if (alan) alan.hidden = !kutu.checked;
      };
    })(yetkiKutulari[i]);
  }
  var tumKutulari = document.querySelectorAll('.kapsam-tumu');
  for (var j = 0; j < tumKutulari.length; j++) {
    (function (kutu) {
      kutu.onchange = function () {
        var kap = kutu.closest('.kapsam-kutu');
        kap.querySelector('.kapsam-secenekler').hidden = kutu.checked;
        if (kutu.checked) {
          var ogeler = kap.querySelectorAll('.kapsam-oge');
          for (var k = 0; k < ogeler.length; k++) ogeler[k].checked = false;
        }
      };
    })(tumKutulari[j]);
  }
}

/* Penceredeki ders/sınıf daraltmalarını toplar: { 'odev.ver': { dersler: [...], siniflar: [...] } } */
function rolKapsamiTopla(izinler) {
  var kapsam = {};
  for (var i = 0; i < izinler.length; i++) {
    var alan = document.querySelector('.kapsam-alan[data-izin="' + izinler[i] + '"]');
    if (!alan) continue;
    var kayit = {};
    ['ders', 'sinif'].forEach(function (tur) {
      var tumu = alan.querySelector('.kapsam-tumu[data-tur="' + tur + '"]');
      if (!tumu) return;
      var anahtar = tur === 'ders' ? 'dersler' : 'siniflar';
      if (tumu.checked) { kayit[anahtar] = ['*']; return; }
      var secilenler = alan.querySelectorAll('.kapsam-oge[data-tur="' + tur + '"]:checked');
      var dizi = [];
      for (var m = 0; m < secilenler.length; m++) dizi.push(secilenler[m].value);
      kayit[anahtar] = dizi.length ? dizi : ['*'];
    });
    if (Object.keys(kayit).length) kapsam[izinler[i]] = kayit;
  }
  return kapsam;
}

EYLEMLER['rol-yeni'] = function () { rolModal(''); };
EYLEMLER['rol-duzenle'] = function (el, id) { rolModal(id); };

EYLEMLER['rol-sil'] = function (el, id) {
  if (!confirm((el.getAttribute('data-ad') || 'Bu rol') + ' silinsin mi? Bu roldeki öğretmenler yalnızca Öğretmen rolüyle kalır.')) return;
  return api('/school/role-delete', 'POST', { roleId: id })
    .then(function () { git('roller'); })['catch'](hataGoster);
};

EYLEMLER['rol-kaydet'] = function (el, id) {
  var hazirMi = el.getAttribute('data-hazir') === '1';
  var ad = hazirMi ? '' : $('rAd').value.trim();
  if (!hazirMi && !ad) { mesajGoster('rolMesaj', 'hata', 'Rol adı yaz.'); $('rAd').focus(); return; }
  /* Kilitli kutular (Öğretmen rolünden gelen) ek role yazılmaz. */
  var izinler = [];
  var kutular = document.querySelectorAll('.yetki-kutu');
  for (var i = 0; i < kutular.length; i++) {
    if (kutular[i].checked && !kutular[i].disabled) izinler.push(kutular[i].value);
  }
  var govde = { permissions: izinler };
  if (!hazirMi) { govde.name = ad; govde.kapsam = rolKapsamiTopla(izinler); }
  dugmeBekle(el, 'Kaydediliyor...');
  var istek = id
    ? api('/school/role-update', 'POST', Object.assign({ roleId: id }, govde))
    : api('/school/role', 'POST', govde);
  return istek.then(function () { modalKapat(); git('roller'); })
    ['catch'](function (e) { dugmeBitir(el); mesajGoster('rolMesaj', 'hata', e.message); });
};
