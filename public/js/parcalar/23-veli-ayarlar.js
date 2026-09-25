/* Veli sayfaları ve hesap ayarları.
   Yetişkin hesabında (ve ona bağlı öğretmen/müdür rolünde) kişisel bilgiler,
   giriş bilgileri ve şifre yetişkin hesabınındır; bütün rollerde aynıdır. */

/* ---- VELİ ---- */
SAYFALAR.cocuklarim = function () {
  /* Okul rolündeyken (öğretmen, müdür) çocukların sayfaları açılmaz: veli
     kişiliğine geçmek gerekir. */
  if (S.user && S.user.rolSatiri) {
    yaz(hero('ÇOCUKLARIM', '') + '<div class="kart"><div class="msg bilgi">Şu an ' + esc(ROL_AD[S.user.role] || 'okul') +
      ' olarak girdin. Çocuğunun ödevlerini, devamsızlığını ve notlarını görmek için veli olarak geç.</div>' +
      '<button class="btn" data-nav="kisilikler">Hesap değiştir</button></div>');
    return Promise.resolve();
  }
  return api('/parent/children').then(function (d) {
    S.children = d.children;
    var h = hero('ÇOCUKLARIM', 'Çocuğunun kartına tıklayarak portalını aç.');
    h += '<div class="kart"><h3>Çocuk ekle</h3>' +
      '<div class="hint" style="margin-bottom:9px">Çocuğunun hesabındaki <b>veli kodunu</b> gir. ' +
      'Büyük/küçük harf ve tire fark etmez.</div>' +
      '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
      '<input type="text" id="veliKod" placeholder="ör. ABCDE-FGH23" maxlength="20" ' +
      'autocapitalize="characters" autocorrect="off" autocomplete="off" spellcheck="false" ' +
      'style="flex:1;min-width:180px;padding:11px 12px;border:1.5px solid var(--cizgi);border-radius:10px;font-family:ui-monospace,Consolas,monospace">' +
      '<button class="btn" data-act="cocuk-ekle">Ekle</button></div><div id="veliMesaj" style="margin-top:9px"></div></div>';
    h += cocukKartlari(d.children);
    yaz(h);
  });
};

function cocukKartlari(list) {
  if (!list.length) return bosKutu('veli', 'Henüz çocuk eklemedin. Veli kodunu kullanarak ekleyebilirsin.');
  var h = '<div class="grid k2">';
  for (var i = 0; i < list.length; i++) {
    var c = list[i];
    h += '<div class="kart tikla" data-act="cocuk-ac" data-id="' + esc(c.id) + '" data-ad="' + esc(c.fullName) + '" ' +
      'data-ara="' + esc(c.fullName) + '">' +
      '<h3>' + esc(c.fullName) + '</h3>' +
      '<div style="color:var(--soluk);font-size:13px">' + esc(c.schoolName) + '</div>' +
      '<div style="margin-top:11px"><span class="etiket">Portalını aç</span> ' +
      '<button class="btn kucuk gri" data-act="cocuk-sil" data-id="' + esc(c.id) + '">Kaldır</button></div></div>';
  }
  return h + '</div>';
}

/* ---- ayarlar ---- */
/* "2011-03-12" -> "12 Mart 2011 (15 yaşında)" */
function dogumMetni(iso) {
  var p = String(iso || '').split('-');
  if (p.length !== 3) return iso || '';
  var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  var bugun = new Date();
  var yas = bugun.getFullYear() - d.getFullYear();
  if (bugun.getMonth() < d.getMonth() || (bugun.getMonth() === d.getMonth() && bugun.getDate() < d.getDate())) yas--;
  return Number(p[2]) + ' ' + AY_ADLARI[Number(p[1]) - 1] + ' ' + p[0] + (yas >= 0 ? ' (' + yas + ' yaşında)' : '');
}

