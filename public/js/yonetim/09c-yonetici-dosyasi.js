/* Yönetim paneli > Yönetici Dosyası: sistem yöneticisi hesapları sunucudaki
   data/admins.json dosyasından açılır (sunucu/yonetici-dosyasi.js). Dosya
   sunucu çalışırken de düzenlenebilir; sunucu "admins.json okuma aralığı"nda
   (Site Ayarları) dosya değişmiş mi diye bakar. Bu sayfa son okumanın
   sonucunu gösterir: açılan hesaplar, atlanan satırlar ve nedenleri.
   Şifre burada hiçbir zaman görünmez; üretilen şifre yalnız sunucu
   penceresine bir kez yazılır. "Şimdi oku" dosyayı beklemeden okutur
   (işlem kaydına yazılır). */

SAYFALAR['yonetici-dosyasi'] = function () {
  return api('/admin/yonetici-dosyasi').then(yoneticiDosyasiCiz);
};

function yoneticiDosyasiCiz(d) {
  /* "zaten yönetici" satırları her okumada tekrarlanır; sorun değildir, ayrı gösterilir. */
  var zaten = (d.atlanan || []).filter(function (a) { return /^zaten yönetici/.test(a.neden); });
  var atlanan = (d.atlanan || []).filter(function (a) { return !/^zaten yönetici/.test(a.neden); });
  var bilgi = function (etiket, deger) {
    return '<div class="satir"><div class="buyu"><div class="alt">' + esc(etiket) + '</div><div class="ad">' + deger + '</div></div></div>';
  };

  var h = hero('YÖNETİCİ DOSYASI', 'Sistem yöneticisi hesapları sunucudaki ' + d.dosya + ' dosyasından açılır. ' +
    'Dosya sunucu çalışırken de düzenlenebilir.');

  /* Var/Yok ve son değişiklik dosyanın şu anki hâli; açılan ve atlanan satırlar son okumanın. */
  h += '<div class="kart ayar-kart"><h3>' + ik('belge') + 'Son okuma</h3>' +
    bilgi('Dosya', esc(d.dosya) + ' ' + (d.simdiVar ? '<span class="etiket yesil">Var</span>' : '<span class="etiket gri">Yok</span>')) +
    bilgi('Son okuma', d.sonOkuma ? esc(tarihSaat(d.sonOkuma)) : 'Henüz okunmadı') +
    bilgi('Dosyanın son değişikliği', d.dosyaDegisme ? esc(tarihSaat(d.dosyaDegisme)) : '—') +
    '<div class="satir"><div class="buyu"><div class="alt">Okuma aralığı</div><div class="ad">' + esc(d.aralikDk) + ' dakika</div>' +
    '<div class="alt">Sunucu bu aralıkla dosyanın değişip değişmediğine bakar; değiştiyse okur.</div></div>' +
    '<button class="btn kucuk ghost" data-nav="site-ayarlari">Aralığı değiştir</button></div>';
  if (d.okunmadanDegisti) {
    h += '<div class="msg uyari">Dosya son okumadan sonra ' + (d.simdiVar ? 'değişti' : 'silindi') + '. Sunucu en geç ' +
      esc(d.aralikDk) + ' dakika içinde okuyacak; beklemeden okutmak için <b>Şimdi oku</b>\'ya bas. ' +
      'Aşağıdaki sonuçlar son okumaya ait.</div>';
  }
  if (d.hata) h += '<div class="msg hata">Dosya okunamadı: ' + esc(d.hata) + '. Dosyadaki hiçbir satır uygulanmadı.</div>';
  if (d.uyari) h += '<div class="msg uyari">' + esc(d.uyari.charAt(0).toLocaleUpperCase('tr') + d.uyari.slice(1)) + '.</div>';
  if (!d.simdiVar && !d.okunmadanDegisti) {
    h += '<div class="msg bilgi">Dosya yok. Yönetici eklemek için depodaki belge/admins.ornek.json dosyasını sunucuda ' +
      esc(d.dosya) + ' olarak kopyala ve doldur.</div>';
  }
  h += '<div class="dugme-satir"><button class="btn" data-act="yd-oku">Şimdi oku</button></div>' +
    '<div id="ydMesaj" style="margin-top:10px"></div></div>';

  h += '<div class="kart ayar-kart"><h3>' + ik('onay') + 'Son okumada açılan hesaplar (' + (d.eklenen || []).length + ')</h3>';
  if (!(d.eklenen || []).length) h += '<div class="okul-bilgi">Son okumada yeni hesap açılmadı.</div>';
  else {
    h += d.eklenen.map(function (e) {
      return '<div class="satir"><div class="buyu"><div class="ad">' + esc(e.eposta) + '</div>' +
        '<div class="alt">Kullanıcı adı: ' + esc(e.kullaniciAdi) + '</div></div>' +
        (e.sifreUretildi ? '<span class="etiket turuncu">Şifre üretildi, yalnız sunucu penceresinde</span>'
          : '<span class="etiket gri">Şifre dosyadan</span>') + '</div>';
    }).join('') + '<p class="hint">Açılan yönetici ilk girişte kendi şifresini belirler; ondan sonra dosyadaki şifre geçersizdir.</p>';
  }
  h += '</div>';

  h += '<div class="kart ayar-kart"><h3>' + ik('uyari') + 'Atlanan satırlar (' + atlanan.length + ')</h3>';
  if (!atlanan.length) h += '<div class="okul-bilgi">Atlanan satır yok.</div>';
  else {
    h += atlanan.map(function (a) {
      return '<div class="satir"><div class="buyu"><div class="ad">Dosyadaki ' + esc(a.sira) + '. yönetici' +
        (a.eposta ? ' · ' + esc(a.eposta) : '') + '</div>' +
        '<div class="alt">' + esc(a.neden.charAt(0).toLocaleUpperCase('tr') + a.neden.slice(1)) + '</div></div>' +
        '<span class="etiket kirmizi">Açılmadı</span></div>';
    }).join('');
  }
  if (zaten.length) {
    h += '<p class="hint">Zaten yönetici olan ' + zaten.length + ' satır değiştirilmedi: ' +
      esc(zaten.map(function (a) { return a.eposta; }).join(', ')) + '.</p>';
  }
  h += '</div>';

  h += '<div class="msg bilgi"><b>Dosyanın kuralları.</b> Dosya yalnız hesap açar: var olan hesabı değiştirmez, dosyadan silinen ' +
    'yöneticiyi silmez. Başka bir hesabın e-postası ya da kullanıcı adıyla yazılan satır yönetici yapılmaz. Şifreyi dosyaya ' +
    'yazmak önerilir; boş bırakılırsa rastgele üretilir ve yalnız sunucu penceresine bir kez yazılır. Dosyayı yalnız sunucu ' +
    'kullanıcısı okuyabilmeli (chmod 600). Örnek: belge/admins.ornek.json.</div>';
  yaz(h);
}

EYLEMLER['yd-oku'] = function (el) {
  dugmeBekle(el, 'Okunuyor...');
  return api('/admin/yonetici-dosyasi/oku', 'POST').then(function (d) {
    yoneticiDosyasiCiz(d);
    sayfaMesaji(!d.dosyaVar ? 'uyari' : d.hata ? 'hata' : 'iyi', d.message);
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('ydMesaj', 'hata', e.message); });
};
