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

