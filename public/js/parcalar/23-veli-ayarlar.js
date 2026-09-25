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

