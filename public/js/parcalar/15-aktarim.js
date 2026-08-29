/* Excel aktarım ekranı: kişi listesi (öğrenci, servisçi), ders
   programı, dışarı aktarım ve düz metinden Excel'e çevirme.
   Dosya tarayıcıda yalnızca okunur ve sunucuya gönderilir; bütün denetim ve
   kayıt sunucuda. Önce ne olacağı gösterilir, onaylanınca uygulanır. */

var AKTARIM_ADLARI = {
  kisi: { isim: 'Kişi listesi', alt: 'Öğrenci ve servisçi hesaplarını toplu aç' },
  program: { isim: 'Ders programı', alt: 'Ders saatlerini programa toplu ekle' }
};

var DISA_LISTE = [
  { k: 'kisi', ad: 'Kişi listesi (iki sayfa)', alt: 'Öğrenciler ve servisçiler — içeri aktarımla aynı sütunlar', dosya: 'kisiler.xlsx' },
  { k: 'ogrenci', ad: 'Öğrenci listesi ve veli kodları', alt: 'Ad, kullanıcı adı, sınıf, veli kodu', dosya: 'ogrenciler.xlsx' },
  { k: 'ogretmen', ad: 'Öğretmen listesi', alt: 'Branş, verdiği dersler, sınıflar', dosya: 'ogretmenler.xlsx' },
  { k: 'program', ad: 'Ders programı', alt: 'Sınıf, gün, saat, ders, öğretmen', dosya: 'ders-programi.xlsx' }
];

var KISI_TURLERI = [['', 'Sayfa adlarından anlaşılsın'], ['ogrenci', 'Öğrenciler'], ['servisci', 'Servisçiler']];

var DURUM_AD = { hazir: 'Açılacak', guncel: 'Güncellenecek', hata: 'Hata', uyari: 'Dikkat', atlandi: 'Atlandı' };

/* Sunucudan base64 gelen dosyayı indir. */
function b64Indir(b64, ad, tur) {
  var ham = atob(b64), bayt = new Uint8Array(ham.length);
  for (var i = 0; i < ham.length; i++) bayt[i] = ham.charCodeAt(i);
  var url = URL.createObjectURL(new Blob([bayt], { type: tur || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  var a = document.createElement('a');
  a.href = url;
  a.download = ad;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
}

/* Metni (UTF-8) base64'e çevir. */
function metinBase64(metin) {
  var b = new TextEncoder().encode(metin), s = '';
  for (var i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
  return btoa(s);
}

function aktarimDurumu() {
  if (!S.aktarim || !S.aktarim.tur || !AKTARIM_ADLARI[S.aktarim.tur]) {
    S.aktarim = { yon: (S.aktarim && S.aktarim.yon) || 'ice', tur: 'kisi', liste: '', dosyaAd: '', dosya: '', rapor: null, sonuc: null };
  }
  return S.aktarim;
}

SAYFALAR.aktarim = function () {
  var A = aktarimDurumu();
  var h = hero('EXCEL AKTARIM', 'Listeleri dosyayla topluca al ya da ver. Excel, LibreOffice (ODS), CSV ve düz metin olur.');

  h += '<div class="kart"><div class="sekme-satir">' +
    '<button class="sekme' + (A.yon === 'ice' ? ' secili' : '') + '" data-act="aktarim-yon" data-yon="ice">İçeri aktar</button>' +
    '<button class="sekme' + (A.yon === 'disa' ? ' secili' : '') + '" data-act="aktarim-yon" data-yon="disa">Dışarı aktar</button>' +
    '<button class="sekme' + (A.yon === 'metin' ? ' secili' : '') + '" data-act="aktarim-yon" data-yon="metin">Metinden Excel\'e</button>' +
    '</div></div>';

  if (A.yon === 'disa') { yaz(h + disaKarti()); return; }
  if (A.yon === 'metin') { yaz(h + metinKarti()); metinBagla(); return; }

  if (A.sonuc) h += sonucKarti(A);

  h += '<div class="kart"><h3>Ne yükleyeceksin?</h3><div class="grid k2">';
  for (var t in AKTARIM_ADLARI) {
    h += '<button class="tur-sec' + (A.tur === t ? ' secili' : '') + '" data-act="aktarim-tur" data-tur="' + t + '">' +
      '<div class="ad">' + AKTARIM_ADLARI[t].isim + '</div><div class="alt">' + AKTARIM_ADLARI[t].alt + '</div></button>';
  }
  h += '</div></div>';

  h += '<div class="kart"><h3>' + esc(AKTARIM_ADLARI[A.tur].isim) + ' yükleme</h3>';
  h += '<div class="adim"><div class="adim-no">1</div><div class="buyu"><div class="ad">Boş şablonu indir</div>' +
    '<div class="alt">' + (A.tur === 'kisi'
      ? 'İki sayfa gelir: Öğrenciler ve Servisçiler. Üçüncü sayfada nasıl doldurulacağı yazar. ' +
        'Kendi dosyan varsa sütun başlıkları benzer olsun yeter (Ad, Soyad, T.C. Kimlik No...). ' +
        'Öğretmenler dosyayla eklenmez: kendi hesaplarını açıp kodlarını verirler (Öğretmenler > Kodla ekle).'
      : 'Sütun başlıkları hazır gelir; ikinci sayfada nasıl doldurulacağı yazar.') + '</div>' +
    '<button class="btn ghost kucuk" data-act="aktarim-sablon" style="margin-top:10px">Şablonu indir</button></div></div>';

  h += '<div class="adim"><div class="adim-no">2</div><div class="buyu"><div class="ad">Doldur</div><div class="alt">' +
    (A.tur === 'kisi'
      ? 'Her satır bir kişi. Yalnızca <b>ad, soyad ve T.C. kimlik no</b> zorunlu. Kullanıcı adı ve şifre boşsa ' +
        'T.C. no olur; kişi ilk girişte kendi şifresini belirler. Öğrencide sınıf ve şube ayrı yazılır (7 ve Çiçek → ' +
        '"7-Çiçek" sınıfı); okulda olmayan sınıf açılır. Okulda aynı T.C. no ile kayıtlı kişi yeniden açılmaz, sınıfı ve ' +
        'bilgileri güncellenir (yıl sonunda sınıf atlatma).'
      : 'Her satır bir ders saati. Sınıf, gün, saat ve ders zorunlu. Gün Pazartesi\'den Pazar\'a olabilir.') +
    '</div></div></div>';

  h += '<div class="adim"><div class="adim-no">3</div><div class="buyu"><div class="ad">Dosyayı yükle</div>' +
    '<input type="file" id="aktarimDosya" accept="' + (A.tur === 'kisi' ? '.xlsx,.xls,.ods,.csv,.txt' : '.xlsx,.xls,.ods,.csv') + '" style="display:none">' +
    (A.tur === 'kisi' ? '<div class="field" style="margin:10px 0 0"><label for="aktarimListe">Liste kimlerin?</label>' +
      '<select id="aktarimListe">' + KISI_TURLERI.map(function (x) {
        return '<option value="' + x[0] + '"' + (A.liste === x[0] ? ' selected' : '') + '>' + x[1] + '</option>';
      }).join('') + '</select><div class="hint">Şablonu kullandıysan dokunma. Tek sayfalık kendi dosyan ya da metin ' +
      'listesi yüklüyorsan seç.</div></div>' : '') +
    '<div class="satir" style="border:0;padding:10px 0 0">' +
    '<button class="btn ghost" data-act="aktarim-sec">Dosya seç</button>' +
    '<div class="buyu" style="padding:0 14px">' + (A.dosyaAd ? '<b>' + esc(A.dosyaAd) + '</b>' : '<span class="soluk">Henüz dosya seçilmedi</span>') + '</div>' +
    (A.dosya ? '<button class="btn" data-act="aktarim-yukle">Kontrol et</button>' : '') + '</div>' +
    '<div class="alt" style="margin-top:8px">Excel (.xlsx ya da eski .xls), LibreOffice (.ods) ya da düz metin olabilir. ' +
    'Önce ne olacağını gösteririz, sen onaylayınca uygulanır. Hiçbir şey habersiz değişmez.</div>' +
    '<div id="aktarimMesaj" style="margin-top:10px"></div></div></div></div>';

  if (A.rapor) h += raporKarti(A);
  yaz(h);
  aktarimDosyaBagla();
  if ($('aktarimListe')) $('aktarimListe').onchange = function () { A.liste = this.value; A.rapor = null; };
};

function raporKarti(A) {
  var oz = A.ozet, h = '<div class="kart"><h3>Kontrol sonucu</h3><div class="grid k4" style="margin-bottom:16px">';
  if (A.tur === 'kisi') {
    h += stat(oz.hazir, 'Hesap açılacak') + stat(oz.guncel, 'Güncellenecek') + stat(oz.hatali, 'Hatalı satır') + '</div>';
    if (oz.yeniSiniflar && oz.yeniSiniflar.length) {
      h += '<div class="msg bilgi">Açılacak yeni sınıflar: <b>' + esc(oz.yeniSiniflar.join(', ')) + '</b></div>';
    }
  } else {
    h += stat(oz.hazir, 'Ders eklenecek') + stat(oz.hatali, 'Hatalı satır') + (oz.uyarili ? stat(oz.uyarili, 'Uyarılı') : '') + '</div>';
  }
  if (!A.rapor.length) h += bosKutu('belge', 'Dosyada işlenecek satır bulunamadı.');
  else {
    h += '<div class="rapor-kaydir"><table class="rapor-tablo"><thead><tr>' +
      (A.tur === 'kisi' ? '<th>Sayfa</th>' : '') + '<th class="rapor-no">Satır</th><th>Kayıt</th><th>Durum</th><th>Açıklama</th></tr></thead><tbody>';
    for (var i = 0; i < A.rapor.length; i++) {
      var r = A.rapor[i];
      h += '<tr>' + (A.tur === 'kisi' ? '<td>' + esc(r.sayfa || '') + '</td>' : '') +
        '<td class="rapor-no">' + r.satir + '</td><td>' + esc(r.ad || '') + '</td>' +
        '<td><span class="durum ' + esc(r.durum) + '">' + esc(DURUM_AD[r.durum] || r.durum) + '</span></td>' +
        '<td>' + esc(r.mesaj) + '</td></tr>';
    }
    h += '</tbody></table></div>';
  }
  var is = A.tur === 'kisi' ? oz.hazir + oz.guncel : oz.hazir;
  if (is) {
    var yazi = A.tur === 'kisi'
      ? [oz.hazir ? oz.hazir + ' hesabı aç' : '', oz.guncel ? oz.guncel + ' hesabı güncelle' : ''].filter(Boolean).join(', ')
      : oz.hazir + ' ders saatini ekle';
    h += '<div class="satir" style="margin-top:16px;justify-content:flex-end;border:0">' +
      '<button class="btn gri" data-act="aktarim-vazgec">Vazgeç</button>' +
      '<button class="btn" data-act="aktarim-uygula">' + esc(yazi.charAt(0).toLocaleUpperCase('tr') + yazi.slice(1)) + '</button></div>';
  } else {
    h += '<div class="msg hata">İşlenecek geçerli satır yok. Yukarıdaki hataları düzeltip dosyayı yeniden yükle.</div>';
  }
  return h + '</div>';
}

function sonucKarti(A) {
  var h = '<div class="kart"><h3>İşlem tamamlandı</h3><div class="msg iyi">' + esc(A.sonuc.message) + '</div>';
  var l = A.sonuc.hesaplar || [];
  if (l.length) {
    h += '<div class="hint" style="margin:12px 0 8px">Açılan hesapların giriş bilgileri. Bu liste bir daha gösterilmez; ' +
      'yazdır ya da kişilere ilet. Şifresi T.C. no olanlar ilk girişte kendi şifresini belirler.</div>' +
      '<div class="rapor-kaydir"><table class="rapor-tablo"><thead><tr><th>Kişi</th><th>Rol</th><th>Kullanıcı adı</th>' +
      '<th>Şifre</th><th>Veli kodu</th></tr></thead><tbody>';
    for (var i = 0; i < l.length; i++) {
      var o = l[i];
      h += '<tr><td>' + esc(o.ad) + (o.sinif ? ' <span class="alt">' + esc(o.sinif) + '</span>' : '') + '</td>' +
        '<td>' + esc(ROL_AD[o.rol] || '') + '</td><td><code>' + esc(o.kullaniciAdi) + '</code></td>' +
        '<td>' + (o.tcIle ? '<span class="alt">T.C. kimlik no</span>' : '<code>' + esc(o.sifre) + '</code>') + '</td>' +
        '<td>' + (o.veliKodu ? '<code>' + esc(kodBicimle(o.veliKodu)) + '</code>' : '') + '</td></tr>';
    }
    h += '</tbody></table></div>';
  }
  h += '<div class="dugme-satir" style="margin-top:14px">' +
    (l.length ? '<button class="btn ghost" data-act="aktarim-mektup">Giriş kâğıtlarını yazdır</button>' : '') +
    '<button class="btn gri" data-act="aktarim-temizle">Tamam</button></div></div>';
  return h;
}

function disaKarti() {
  var h = '<div class="kart"><h3>Neyi indirmek istiyorsun?</h3>' +
    '<div class="hint" style="margin-bottom:14px">Şu anki kayıtlar Excel dosyası olarak iner. Kişi listesi içeri ' +
    'aktarımla aynı biçimdedir: düzenleyip geri yükleyebilirsin (şifreler dosyada olmaz).</div>';
  for (var d = 0; d < DISA_LISTE.length; d++) {
    var x = DISA_LISTE[d];
    h += '<div class="satir"><div class="buyu"><div class="ad">' + x.ad + '</div><div class="alt">' + x.alt + '</div></div>' +
      '<button class="btn kucuk ghost" data-act="aktarim-disa" data-tur="' + x.k + '">İndir</button></div>';
  }
  return h + '</div>';
}

function metinKarti() {
  return '<div class="kart"><h3>Alt alta yazılmış isimlerden Excel</h3>' +
    '<div class="hint" style="margin-bottom:12px">Her satıra bir kişi yaz ya da .txt dosyası seç: "Ad Soyad" ya da ' +
    '"Ad Soyad 12345678901". T.C. no yazılmışsa o da sütununa geçer, başındaki sıra numaraları atılır. ' +
    'Çıkan Excel\'de eksik T.C. numaralarını doldurup "İçeri aktar"dan yükle.</div>' +
    '<div class="field"><label for="mtTur">Liste kimlerin?</label><select id="mtTur">' +
    '<option value="ogrenci">Öğrenciler</option><option value="servisci">Servisçiler</option></select></div>' +
    '<div class="field"><label for="mtMetin">İsimler</label>' +
    '<textarea id="mtMetin" rows="8" spellcheck="false" placeholder="Ad Soyad&#10;Ad Soyad 12345678901&#10;..."></textarea></div>' +
    '<input type="file" id="mtDosya" accept=".txt,.csv" style="display:none">' +
    '<div class="dugme-satir">' +
    '<button class="btn ghost" data-act="metin-dosya-sec">.txt dosyası seç</button>' +
    '<button class="btn" data-act="metin-excel">Excel\'e çevir</button></div>' +
    '<div id="mtMesaj" style="margin-top:10px"></div></div>';
}

function metinBagla() {
  var g = $('mtDosya');
  if (!g) return;
  g.onchange = function () {
    var d = g.files && g.files[0];
    if (!d) return;
    if (d.size > 900000) { mesajGoster('mtMesaj', 'hata', 'Dosya çok büyük (en fazla 900 KB).'); return; }
    var o = new FileReader();
    o.onload = function () {
      var m = String(o.result);
      S.metinDosya = { ad: d.name, b64: m.slice(m.indexOf(',') + 1) };
      $('mtMetin').value = '';
      $('mtMetin').placeholder = d.name + ' seçildi. "Excel\'e çevir"e bas.';
    };
    o.onerror = function () { mesajGoster('mtMesaj', 'hata', 'Dosya okunamadı.'); };
    o.readAsDataURL(d);
  };
}

EYLEMLER['metin-dosya-sec'] = function () { if ($('mtDosya')) $('mtDosya').click(); };

EYLEMLER['metin-excel'] = function (el) {
  var metin = $('mtMetin').value;
  var govde = { tur: $('mtTur').value };
  if (metin.trim()) { govde.dosya = metinBase64(metin); govde.dosyaAdi = 'liste.txt'; S.metinDosya = null; }
  else if (S.metinDosya) { govde.dosya = S.metinDosya.b64; govde.dosyaAdi = S.metinDosya.ad; }
  else { mesajGoster('mtMesaj', 'hata', 'İsimleri yaz ya da bir .txt dosyası seç.'); return; }
  dugmeBekle(el, 'Çevriliyor...');
  return api('/school/txt-excel', 'POST', govde).then(function (d) {
    dugmeBitir(el);
    b64Indir(d.dosya, d.ad);
    mesajGoster('mtMesaj', 'iyi', d.adet + ' kişi Excel\'e yazıldı: ' + d.ad);
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('mtMesaj', 'hata', e.message); });
};

EYLEMLER['aktarim-yon'] = function (el) {
  var A = aktarimDurumu();
  A.yon = el.getAttribute('data-yon');
  A.rapor = null;
  return git('aktarim');
};
EYLEMLER['aktarim-tur'] = function (el) {
  var A = aktarimDurumu();
  var tur = el.getAttribute('data-tur');
  if (!AKTARIM_ADLARI[tur]) return;
  S.aktarim = { yon: 'ice', tur: tur, liste: A.liste || '', dosyaAd: '', dosya: '', rapor: null, sonuc: null };
  return git('aktarim');
};
EYLEMLER['aktarim-sablon'] = function (el) {
  var A = aktarimDurumu();
  el.disabled = true;
  var is = A.tur === 'kisi'
    ? api('/school/kisi-sablon').then(function (d) { b64Indir(d.dosya, d.ad); })
    : dosyaIndir('/api/school/aktarim-sablon?tur=program', 'ders-programi-sablon.xlsx');
  return is.then(function () { el.disabled = false; })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};
EYLEMLER['aktarim-sec'] = function () { if ($('aktarimDosya')) $('aktarimDosya').click(); };

function aktarimIstegi(uygula) {
  var A = S.aktarim;
  return A.tur === 'kisi'
    ? api('/school/kisi-aktarim', 'POST', { dosya: A.dosya, dosyaAdi: A.dosyaAd, tur: A.liste || undefined, uygula: uygula })
    : api('/school/aktarim-ice', 'POST', { tur: 'program', dosya: A.dosya, dosyaAdi: A.dosyaAd, uygula: uygula });
}

EYLEMLER['aktarim-yukle'] = function (el) {
  var A = aktarimDurumu();
  dugmeBekle(el, 'Kontrol ediliyor...');
  return aktarimIstegi(false).then(function (r) {
    A.rapor = r.rapor || [];
    A.ozet = { hazir: r.hazir || 0, guncel: r.guncel || 0, hatali: r.hatali || 0, uyarili: r.uyarili || 0, yeniSiniflar: r.yeniSiniflar || [] };
    return git('aktarim');
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('aktarimMesaj', 'hata', e.message); });
};

EYLEMLER['aktarim-uygula'] = function (el) {
  var A = aktarimDurumu(), oz = A.ozet;
  var soru = A.tur === 'kisi'
    ? [oz.hazir ? oz.hazir + ' hesap açılacak' : '', oz.guncel ? oz.guncel + ' hesap güncellenecek' : '',
      oz.yeniSiniflar.length ? oz.yeniSiniflar.length + ' yeni sınıf açılacak' : ''].filter(Boolean).join(', ') + '. Onaylıyor musun?'
    : oz.hazir + ' ders saati programa eklenecek.\n\nVar olan program silinmez, üzerine eklenir. Onaylıyor musun?';
  if (!confirm(soru)) return;
  dugmeBekle(el, 'Uygulanıyor...');
  return aktarimIstegi(true).then(function (r) {
    S.aktarim = { yon: 'ice', tur: A.tur, liste: A.liste, dosyaAd: '', dosya: '', rapor: null, sonuc: r };
    return git('aktarim');
  })['catch'](function (e) { dugmeBitir(el); mesajGoster('aktarimMesaj', 'hata', e.message); });
};

EYLEMLER['aktarim-vazgec'] = function () {
  var A = aktarimDurumu();
  A.rapor = null; A.dosya = ''; A.dosyaAd = '';
  return git('aktarim');
};
EYLEMLER['aktarim-temizle'] = function () {
  var A = aktarimDurumu();
  if (A.sonuc && A.sonuc.hesaplar && A.sonuc.hesaplar.length &&
    !confirm('Giriş bilgileri listesi kapanacak ve bir daha gösterilmeyecek. Kapatılsın mı?')) return;
  A.sonuc = null;
  return git('aktarim');
};
EYLEMLER['aktarim-mektup'] = function () {
  var A = aktarimDurumu();
  if (!A.sonuc || !A.sonuc.hesaplar) return;
  girisMektuplariYazdir(S.user.schoolName, A.sonuc.hesaplar.map(function (o) {
    return { ad: o.ad, sinif: o.sinif, kullaniciAdi: o.kullaniciAdi, sifre: o.sifre, tcIle: o.tcIle, veliKodu: o.veliKodu };
  }));
};
EYLEMLER['aktarim-disa'] = function (el) {
  var tur = el.getAttribute('data-tur'), kayit = null;
  for (var i = 0; i < DISA_LISTE.length; i++) if (DISA_LISTE[i].k === tur) kayit = DISA_LISTE[i];
  if (!kayit) return;
  el.disabled = true;
  var is = tur === 'kisi'
    ? api('/school/kisi-disa').then(function (d) { b64Indir(d.dosya, d.ad); })
    : dosyaIndir('/api/school/aktarim-disa?tur=' + tur, kayit.dosya);
  return is.then(function () { el.disabled = false; })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

/* Dosya girişi her çizimden sonra yeniden bağlanır: sayfa baştan yazılıyor. */
function aktarimDosyaBagla() {
  var giris = $('aktarimDosya');
  if (!giris) return;
  giris.onchange = function () {
    var d = giris.files && giris.files[0];
    if (!d) return;
    if (d.size > 950000) {
      mesajGoster('aktarimMesaj', 'hata', 'Dosya çok büyük (en fazla 950 KB). Listeyi ikiye bölüp iki kez yükle.');
      return;
    }
    var okuyucu = new FileReader();
    okuyucu.onload = function () {
      /* Sonuç "data:...;base64,XXXX" biçiminde; yalnız XXXX kısmı lazım. */
      var metin = String(okuyucu.result);
      S.aktarim.dosya = metin.slice(metin.indexOf(',') + 1);
      S.aktarim.dosyaAd = d.name;
      S.aktarim.rapor = null;
      S.aktarim.sonuc = null;
      git('aktarim');
    };
    okuyucu.onerror = function () { mesajGoster('aktarimMesaj', 'hata', 'Dosya okunamadı.'); };
    okuyucu.readAsDataURL(d);
  };
}

SAYFALAR['islem-kaydi'] = function () {
  if (!S.islemSuz) S.islemSuz = '';
  return api('/islem-kaydi' + (S.islemSuz ? '?islem=' + encodeURIComponent(S.islemSuz) : ''))
    .then(function (d) {
      var h = hero('İŞLEM KAYDI', '');

      if (d.turler.length) {
        h += '<div class="kart"><div class="sekme-satir">' +
          '<button class="sekme kucuk' + (S.islemSuz ? '' : ' secili') +
          '" data-act="islem-suz" data-islem="">Hepsi</button>';
        for (var t = 0; t < d.turler.length; t++) {
          h += '<button class="sekme kucuk' +
            (S.islemSuz === d.turler[t].k ? ' secili' : '') +
            '" data-act="islem-suz" data-islem="' + esc(d.turler[t].k) + '">' +
            esc(d.turler[t].ad) + '</button>';
        }
        h += '</div></div>';
      }

      if (!d.kayitlar.length) {
        h += bosKutu('belge', 'Henüz kayıt yok. Önemli işlemler yapıldıkça burada birikir.');
        yaz(h);
        return;
      }

      h += '<div class="kart"><h3>Son ' + d.kayitlar.length + ' kayıt' +
        (d.toplam > d.kayitlar.length ? ' (toplam ' + d.toplam + ')' : '') + '</h3>' +
        '<div class="rapor-kaydir"><table class="rapor-tablo"><thead><tr>' +
        '<th>Tarih</th><th>Kişi</th><th>İşlem</th><th>Ayrıntı</th><th>IP</th>' +
        '</tr></thead><tbody>';
      for (var i = 0; i < d.kayitlar.length; i++) {
        var k = d.kayitlar[i];
        h += '<tr data-ara="' + esc(k.kisi + ' ' + k.islemAd + ' ' + k.detay) + '">' +
          '<td>' + tarihSaat(k.tarih) + '</td>' +
          '<td>' + esc(k.kisi) + '<div class="alt">' + (ROL_AD[k.rol] || '') + '</div></td>' +
          '<td>' + esc(k.islemAd) + '</td>' +
          '<td>' + esc(k.detay) + '</td>' +
          '<td class="alt">' + esc(k.ip) + '</td></tr>';
      }
      h += '</tbody></table></div></div>';
      yaz(h);
    });
};
