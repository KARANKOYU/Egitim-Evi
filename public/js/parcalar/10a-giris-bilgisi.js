/* Toplu giriş bilgisi dağıtımı (öğrenci-veli mektubu).
   Şifreleri sunucu üretir ve yalnızca özetini saklar; liste bu pencerede bir
   kez gösterilir. Tarayıcıda da kalıcı bir yere yazılmaz: pencere kapanınca
   bellekten silinir. */

var girisListesi = null;   // { adet, kapsam, okul, satirlar, xlsx, indirildi }

function girisBilgisiAc() {
  var siniflar = S._sinifListe || [];
  var ogrenciler = S._ogrListe || [];
  var h = '<div class="field"><label for="gbSinif">Kimler için</label><select id="gbSinif">' +
    '<option value="">Bütün okul</option>';
  for (var i = 0; i < siniflar.length; i++) {
    h += '<option value="' + esc(siniflar[i].id) + '">' + esc(siniflar[i].name) + '</option>';
  }
  h += '</select></div>' +
    '<label class="onay" style="margin:4px 0 12px"><input type="checkbox" id="gbGirmeyen" checked>' +
    '<span>Yalnızca henüz giriş yapmamış öğrenciler</span></label>' +
    '<div class="okul-bilgi" id="gbSayi"></div>' +
    '<div class="msg uyari" style="margin-top:10px">Seçilen öğrencilerin şifreleri yenilenir, açık oturumları kapanır. ' +
    'Liste yalnızca bir kez gösterilir: Excel olarak indir ya da yazdır, sonra pencereyi kapat.</div>' +
    '<div id="gbMesaj" style="margin-top:9px"></div>';

  modalAc('Giriş bilgisi dağıt', h,
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
    '<button class="btn" data-act="giris-bilgisi-uret">Şifreleri yenile ve listeyi hazırla</button>');

  /* Seçime göre kaç kişinin şifresi değişecek, önceden görünsün. */
  var say = function () {
    var sinif = $('gbSinif').value, girmeyen = $('gbGirmeyen').checked;
    var n = 0;
    for (var k = 0; k < ogrenciler.length; k++) {
      var o = ogrenciler[k];
      if ((!sinif || o.classId === sinif) && (!girmeyen || !o.girisYapti)) n++;
    }
    $('gbSayi').innerHTML = n
      ? '<b>' + n + '</b> öğrencinin şifresi yenilenecek.'
      : (girmeyen ? 'Bu seçimde henüz giriş yapmamış öğrenci yok.' : 'Bu seçimde öğrenci yok.');
  };
  $('gbSinif').onchange = say;
  $('gbGirmeyen').onchange = say;
  say();
}

EYLEMLER['giris-bilgisi-ac'] = function () { girisBilgisiAc(); };

EYLEMLER['giris-bilgisi-uret'] = function (el) {
  var girmeyen = $('gbGirmeyen').checked;
  if (!girmeyen && !confirm('Giriş yapmış öğrencilerin de şifresi değişecek; kendi belirledikleri şifre çalışmaz olur. Devam edilsin mi?')) return;
  dugmeBekle(el, 'Hazırlanıyor...');
  return api('/school/giris-bilgisi', 'POST', { classId: $('gbSinif').value, sadeceGirmeyen: girmeyen, onay: true })
    .then(function (d) {
      girisListesi = d;
      girisListesi.indirildi = false;
      girisSonucGoster();
      /* Liste sayfası "giriş yaptı" bilgisini tazelesin; pencere açık kalır. */
      if (S._ogrListe) {
        var yeni = {};
        for (var i = 0; i < d.satirlar.length; i++) yeni[d.satirlar[i].kullaniciAdi] = 1;
        for (var k = 0; k < S._ogrListe.length; k++) {
          if (yeni[S._ogrListe[k].username]) S._ogrListe[k].girisYapti = false;
        }
      }
    })
    ['catch'](function (e) { dugmeBitir(el); mesajGoster('gbMesaj', 'hata', e.message); });
};

function girisSonucGoster() {
  var d = girisListesi;
  var h = '<div class="msg iyi">' + d.adet + ' öğrenci için yeni giriş bilgisi hazır (' + esc(d.kapsam) + ').</div>' +
    '<div class="hint" style="margin:8px 0">Bu liste bir daha gösterilmez. Öğrenciye kendi satırını ver; ' +
    'veli kodu velinin çocuğunu hesabına eklemesi içindir.</div>' +
    '<div class="tablo-sar" style="max-height:300px;overflow:auto"><table class="t"><thead><tr>' +
    '<th>Öğrenci</th><th>Sınıf</th><th>Kullanıcı adı</th><th>Şifre</th><th>Veli kodu</th></tr></thead><tbody>';
  for (var i = 0; i < d.satirlar.length; i++) {
    var s = d.satirlar[i];
    h += '<tr><td>' + esc(s.ad) + '</td><td>' + esc(s.sinif) + '</td><td>' + esc(s.kullaniciAdi) + '</td>' +
      '<td class="kod-hucre">' + esc(s.sifre) + '</td><td class="kod-hucre">' + esc(kisiKoduBicim(s.veliKodu)) + '</td></tr>';
  }
  h += '</tbody></table></div>';

  modalAc('Giriş bilgileri', h,
    '<button class="btn gri" data-act="giris-bilgisi-kapat">Kapat</button>' +
    '<button class="btn ghost" data-act="giris-bilgisi-excel">Excel indir</button>' +
    '<button class="btn" data-act="giris-bilgisi-yazdir">Yazdır / PDF</button>');
  /* Yanlışlıkla perdeye tıklayıp listeyi kaybetmesin. */
  var perde = document.querySelector('.perde');
  if (perde) perde.setAttribute('data-zorunlu', '1');
}

EYLEMLER['giris-bilgisi-excel'] = function () {
  var d = girisListesi;
  if (!d) return;
  var ham = atob(d.xlsx), bayt = new Uint8Array(ham.length);
  for (var i = 0; i < ham.length; i++) bayt[i] = ham.charCodeAt(i);
  var blob = new Blob([bayt], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'giris-bilgileri-' + d.kapsam.replace(/[^0-9A-Za-zÇĞİÖŞÜçğıöşü-]+/g, '-') + '.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  d.indirildi = true;
};

/* Her kişiye kesilip verilecek bir kâğıt: okulun giriş adresi, kullanıcı adı,
   şifre (ya da "T.C. kimlik numaran") ve öğrenciyse veliye veli kodu.
   Tarayıcının "PDF olarak kaydet" seçeneği de aynı çıktıyı verir.
   satirlar: [{ ad, sinif, kullaniciAdi, sifre, tcIle, veliKodu }] */
function girisMektuplariYazdir(okulAdi, satirlar) {
  var adres = location.origin + (S.user && S.user.schoolSlug ? okulYolu(S.user.schoolSlug) : '');
  var h = '';
  for (var i = 0; i < satirlar.length; i++) {
    var s = satirlar[i];
    h += '<div class="mektup">' +
      '<div class="m-ust"><b>Eğitim Evi</b><span>' + esc(okulAdi || '') + '</span></div>' +
      '<div class="m-ad">' + esc(s.ad) + (s.sinif ? ' <span>' + esc(s.sinif) + '</span>' : '') + '</div>' +
      '<table><tr><td>Giriş adresi</td><td>' + esc(adres) + '</td></tr>' +
      '<tr><td>Kullanıcı adı</td><td class="m-kod">' + esc(s.kullaniciAdi) + '</td></tr>' +
      '<tr><td>Şifre</td><td class="m-kod">' + (s.tcIle ? 'T.C. kimlik numaran' : esc(s.sifre)) + '</td></tr></table>' +
      '<div class="m-not">İlk girişte kendi şifreni belirleyeceksin. Şifreni kimseyle paylaşma.</div>' +
      (s.veliKodu ? '<div class="m-veli"><b>Veli için:</b> ' + esc(location.origin) + ' adresinden kendi hesabınızı ' +
        'açın (Kayıt ol). Girişten sonra sağ üstteki <b>+ Ekle &gt; Veli</b> ekranına bu <b>veli kodunu</b> yazın: ' +
        '<span class="m-kod">' + esc(kisiKoduBicim(s.veliKodu)) + '</span> (büyük/küçük harf fark eder)</div>' : '') +
      '</div>';
  }
  var kap = $('yazdirKap');
  if (!kap) {
    kap = document.createElement('div');
    kap.id = 'yazdirKap';
    document.body.appendChild(kap);
  }
  kap.innerHTML = h;
  document.body.classList.add('yazdiriliyor');
  var temizle = function () {
    document.body.classList.remove('yazdiriliyor');
    kap.innerHTML = '';
    window.removeEventListener('afterprint', temizle);
  };
  window.addEventListener('afterprint', temizle);
  window.print();
}

EYLEMLER['giris-bilgisi-yazdir'] = function () {
  var d = girisListesi;
  if (!d) return;
  girisMektuplariYazdir(d.okul, d.satirlar);
  d.indirildi = true;
};

EYLEMLER['giris-bilgisi-kapat'] = function () {
  if (girisListesi && !girisListesi.indirildi &&
    !confirm('Listeyi indirmedin ya da yazdırmadın. Kapatırsan bu şifreler bir daha gösterilmez. Kapatılsın mı?')) return;
  girisListesi = null;
  modalKapat();
  git('okul-ogrenciler');
};
