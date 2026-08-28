/* Toplu giriş bilgisi dağıtımı (öğrenci-veli mektubu).
   Şifreleri sunucu üretir ve yalnızca özetini saklar; liste bu pencerede bir
   kez gösterilir. Tarayıcıda da kalıcı bir yere yazılmaz: pencere kapanınca
   bellekten silinir. */

var girisListesi = null;   // { adet, kapsam, okul, satirlar, xlsx, indirildi }

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
      '<td class="kod-hucre">' + esc(s.sifre) + '</td><td class="kod-hucre">' + esc(s.veliKodu) + '</td></tr>';
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

/* Her kişiye kesilip verilecek bir kâğıt: okulun giriş adresi, kullanıcı adı,
   şifre (ya da "T.C. kimlik numaran") ve öğrenciyse veliye veli kodu.
   Tarayıcının "PDF olarak kaydet" seçeneği de aynı çıktıyı verir.
   satirlar: [{ ad, sinif, kullaniciAdi, sifre, tcIle, veliKodu }] */
function girisMektuplariYazdir(okulAdi, satirlar) {
  var adres = location.origin + (S.user && S.user.schoolSlug ? '/' + S.user.schoolSlug : '');
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
      (s.veliKodu ? '<div class="m-veli"><b>Veli için:</b> ' + esc(location.origin) + ' adresinden "Veli girişi" ile ' +
        'kendi hesabınızı açın, giriş yaptıktan sonra <b>veli kodu</b> alanına şunu yazın: <span class="m-kod">' +
        esc(kodBicimle(s.veliKodu)) + '</span></div>' : '') +
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
