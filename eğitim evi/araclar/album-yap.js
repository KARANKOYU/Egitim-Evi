/* Ekran görüntüsü klasöründen gezilebilir bir albüm sayfası üretir.
   Çalıştırma: node albüm-yap.js  */
const fs = require('fs');
const path = require('path');

const KOK = 'C:\\Users\\faruk\\Desktop\\eğitim evi\\ekran-goruntuleri';

const ROL_ADI = {
  mudur: 'Müdür', ogretmen: 'Öğretmen', ogrenci: 'Öğrenci',
  veli: 'Veli', admin: 'Yönetici'
};

const SAYFA_ADI = {
  ana: 'Ana sayfa', siniflar: 'Sınıflar', program: 'Ders programı',
  roller: 'Roller ve yetkiler', 'okul-ogrenciler': 'Okul öğrencileri',
  ogretmenler: 'Öğretmenler', 'ogr-odevler': 'Ödevler', 'ogr-sinavlar': 'Sınavlar',
  profil: 'Ayarlar', programim: 'Ders programı', ogrencilerim: 'Öğrencilerim',
  odevler: 'Ödevler', sinavlarim: 'Sınavlarım', ilerleyisim: 'İlerleyişim',
  basarilar: 'Başarılar', cocuklarim: 'Çocuklarım', onaylar: 'Onay bekleyenler',
  mudurler: 'Müdürler', okullar: 'Okullar',
  takvim: 'Takvim', mesajlar: 'Mesajlar', yoklama: 'Yoklama',
  devamsizlik: 'Devamsızlık', devamsizligim: 'Devamsızlığım',
  aktarim: 'Excel aktarım', 'islem-kaydi': 'İşlem kaydı',
  yedekler: 'Yedekleme', 'ders-odevleri': 'Ders ödevleri'
};

function esc(t) {
  return String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function sayfaAdi(dosya) {
  const anahtar = dosya.replace(/^\d+-/, '').replace(/\.png$/, '');
  return SAYFA_ADI[anahtar] || anahtar;
}

const roller = fs.readdirSync(KOK)
  .filter(d => fs.statSync(path.join(KOK, d)).isDirectory())
  .sort((a, b) => {
    const s = ['mudur', 'ogretmen', 'ogrenci', 'veli', 'admin'];
    return s.indexOf(a) - s.indexOf(b);
  });

let toplam = 0;
let govde = '';

/* Giriş ekranı ayrı dursun */
if (fs.existsSync(path.join(KOK, '00-giris.png'))) {
  govde += '<section class="bolum"><h2>Giriş ekranı</h2><div class="izgara">' +
    '<figure><button type="button" class="ac" data-src="00-giris.png" data-ad="Giriş ekranı">' +
    '<img src="00-giris.png" alt="Giriş ekranı" loading="lazy"></button>' +
    '<figcaption>Giriş ekranı</figcaption></figure></div></section>';
  toplam++;
}

for (const rol of roller) {
  const dosyalar = fs.readdirSync(path.join(KOK, rol)).filter(f => f.endsWith('.png')).sort();
  if (!dosyalar.length) continue;
  govde += '<section class="bolum"><h2>' + esc(ROL_ADI[rol] || rol) +
    ' <span class="adet">' + dosyalar.length + ' ekran</span></h2><div class="izgara">';
  for (const d of dosyalar) {
    const yol = rol + '/' + d;
    govde += '<figure><button type="button" class="ac" data-src="' + esc(yol) +
      '" data-ad="' + esc(sayfaAdi(d)) + '">' +
      '<img src="' + esc(yol) + '" alt="' + esc(sayfaAdi(d)) + '" loading="lazy"></button>' +
      '<figcaption>' + esc(sayfaAdi(d)) + '</figcaption></figure>';
    toplam++;
  }
  govde += '</div></section>';
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Eğitim Evi — Ekran Görüntüleri</title>
<style>
  :root {
    --ana: #c02b30; --zemin: #faf7f6; --kart: #fff;
    --yazi: #241a1b; --soluk: #7b6a6b; --cizgi: #eee3e2;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 30px 22px 60px;
    background: var(--zemin); color: var(--yazi);
    font: 15px/1.55 "Segoe UI", system-ui, -apple-system, Arial, sans-serif;
  }
  .sar { max-width: 1240px; margin: 0 auto; }
  header { margin-bottom: 34px; }
  h1 { margin: 0 0 6px; font-size: 27px; letter-spacing: -.02em; }
  header p { margin: 0; color: var(--soluk); }
  .bolum { margin-bottom: 40px; }
  .bolum h2 {
    margin: 0 0 14px; font-size: 19px;
    padding-bottom: 9px; border-bottom: 2px solid var(--ana);
    display: flex; align-items: baseline; gap: 10px;
  }
  .adet { font-size: 12.5px; font-weight: 400; color: var(--soluk); }
  .izgara {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 18px;
  }
  figure { margin: 0; background: var(--kart); border: 1.5px solid var(--cizgi);
           border-radius: 12px; overflow: hidden; }
  figure img {
    display: block; width: 100%; height: auto;
    border-bottom: 1px solid var(--cizgi); background: var(--zemin);
  }
  figure .ac {
    display: block; width: 100%; padding: 0; border: 0; background: none;
    cursor: zoom-in; font: inherit;
  }
  figure .ac:focus-visible { outline: 3px solid var(--ana); outline-offset: -3px; }
  figcaption { padding: 10px 13px; font-size: 13.5px; font-weight: 600; }
  footer { margin-top: 40px; color: var(--soluk); font-size: 13px; }

  /* Buyutec: goruntu yeni sekmede degil, sayfanin uzerinde acilir */
  .perde {
    position: fixed; inset: 0; background: rgba(20, 14, 15, .88);
    display: none; align-items: center; justify-content: center;
    padding: 26px; z-index: 50;
  }
  .perde.acik { display: flex; }
  .perde img {
    max-width: 100%; max-height: calc(100vh - 108px);
    object-fit: contain; border-radius: 10px;
    box-shadow: 0 18px 50px rgba(0, 0, 0, .5);
  }
  .perde-ic { position: relative; display: flex; flex-direction: column; gap: 12px; }
  .perde-ust {
    display: flex; align-items: center; gap: 14px;
    color: #fff; font-size: 14px; font-weight: 600;
  }
  .perde-ust .buyu { flex: 1; }
  .perde-dugme {
    background: rgba(255, 255, 255, .14); color: #fff; border: 0;
    border-radius: 8px; padding: 7px 14px; cursor: pointer;
    font: inherit; font-size: 14px;
  }
  .perde-dugme:hover { background: rgba(255, 255, 255, .26); }
  .perde-sayac { color: rgba(255, 255, 255, .6); font-weight: 400; }
</style>
</head>
<body>
<div class="sar">
  <header>
    <h1>Eğitim Evi — Ekran Görüntüleri</h1>
    <p>${toplam} ekran · her rolün gördüğü sayfalar · gerçek uygulamadan alındı</p>
  </header>
  ${govde}
  <footer>Bir görüntüye tıklayınca sayfanın üzerinde büyür. Kapatmak için Esc,
  gezinmek için ok tuşları.</footer>
</div>

<div class="perde" id="perde">
  <div class="perde-ic">
    <div class="perde-ust">
      <span id="perdeAd"></span>
      <span class="perde-sayac" id="perdeSayac"></span>
      <span class="buyu"></span>
      <button type="button" class="perde-dugme" id="perdeOnceki">‹ Önceki</button>
      <button type="button" class="perde-dugme" id="perdeSonraki">Sonraki ›</button>
      <button type="button" class="perde-dugme" id="perdeKapat">Kapat ✕</button>
    </div>
    <img id="perdeResim" alt="">
  </div>
</div>

<script>
(function () {
  var dugmeler = [].slice.call(document.querySelectorAll('.ac'));
  var perde = document.getElementById('perde');
  var resim = document.getElementById('perdeResim');
  var ad = document.getElementById('perdeAd');
  var sayac = document.getElementById('perdeSayac');
  var sira = -1;

  function goster(i) {
    if (i < 0) i = dugmeler.length - 1;
    if (i >= dugmeler.length) i = 0;
    sira = i;
    var b = dugmeler[i];
    resim.src = b.getAttribute('data-src');
    resim.alt = b.getAttribute('data-ad');
    ad.textContent = b.getAttribute('data-ad');
    sayac.textContent = (i + 1) + ' / ' + dugmeler.length;
    perde.classList.add('acik');
  }

  function kapat() {
    perde.classList.remove('acik');
    resim.src = '';
    if (sira >= 0 && dugmeler[sira]) dugmeler[sira].focus();
  }

  dugmeler.forEach(function (b, i) {
    b.addEventListener('click', function () { goster(i); });
  });

  document.getElementById('perdeKapat').addEventListener('click', kapat);
  document.getElementById('perdeOnceki').addEventListener('click', function () { goster(sira - 1); });
  document.getElementById('perdeSonraki').addEventListener('click', function () { goster(sira + 1); });

  /* Perdenin bos yerine tiklayinca kapansin, resme tiklayinca kapanmasin. */
  perde.addEventListener('click', function (e) { if (e.target === perde) kapat(); });

  document.addEventListener('keydown', function (e) {
    if (!perde.classList.contains('acik')) return;
    if (e.key === 'Escape') kapat();
    else if (e.key === 'ArrowLeft') goster(sira - 1);
    else if (e.key === 'ArrowRight') goster(sira + 1);
  });
})();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(KOK, 'index.html'), html, 'utf8');
console.log('albüm hazır: ' + toplam + ' görüntü -> ' + path.join(KOK, 'index.html'));
