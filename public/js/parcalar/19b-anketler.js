/* Anketler: okulun açtığı tek soruluk anketler.
   Oy, sonuç ve kimin oy verebileceği sunucuda denetlenir; burada yalnızca
   gösterilir. */

SAYFALAR.anketler = function () {
  return api('/anketler').then(function (d) {
    var h = hero('ANKETLER', 'Okulun sana sorduğu sorular. Anket bitene kadar oyunu değiştirebilirsin.');

    if (d.olusturabilir) {
      h += '<div class="kart"><div class="satir" style="border:0;padding:0"><div class="buyu">' +
        '<div class="ad">Okula, rol grubuna ya da sınıflara soru sor</div>' +
        '<div class="alt">Öğrencilere açılan anket velilerine de gider.</div></div>' +
        '<button class="btn" data-act="anket-yeni">Yeni anket</button></div></div>';
    }

    if (!d.gelen.length && !d.yonetilen.length) {
      yaz(h + bosKutu('anket', 'Şu an sana açılmış bir anket yok.'));
      return;
    }

    for (var i = 0; i < d.gelen.length; i++) h += anketKarti(d.gelen[i]);

    if (d.yonetilen.length) {
      h += '<h3 class="sb">' + (S.user.role === 'principal' ? 'Okulun anketleri' : 'Açtığın anketler') + '</h3>' +
        '<div class="kart" style="padding:0">';
      for (var j = 0; j < d.yonetilen.length; j++) {
        var a = d.yonetilen[j];
        h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(a.soru) + ' ' + anketDurumEtiketi(a) + '</div>' +
          '<div class="alt">' + esc(a.hedefOzet) + ' · ' + a.oySayisi + ' / ' + a.hedefSayisi + ' kişi oy verdi · ' +
          (a.acik ? 'bitiş ' : 'bitti ') + tarihSaat(a.kapandi || a.bitis) +
          (S.user.role === 'principal' ? ' · ' + esc(a.olusturan) : '') + '</div></div>' +
          '<button class="btn kucuk ghost" data-act="anket-sonuc" data-id="' + esc(a.id) + '">Sonuç</button>' +
          (a.acik ? '<button class="btn kucuk gri" data-act="anket-kapat" data-id="' + esc(a.id) + '">Bitir</button>' : '') +
          '<button class="btn kucuk gri" data-act="anket-sil" data-id="' + esc(a.id) + '">Sil</button></div>';
      }
      h += '</div>';
    }
    yaz(h);
  });
};

