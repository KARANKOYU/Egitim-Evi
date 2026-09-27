/* Yönetim paneli > Site Ayarları: herkese görünen iletişim bilgileri,
   yapımcılar, Play Store bağlantısı, zamanlamalar (bildirim yoklama aralığı,
   çevrimiçi sayma süresi, admins.json okuma aralığı), varsayılan okul disk
   sınırı ve okulların giriş adresleri.

   Bir ayarın değeri üç yerden birinden gelir: panelden kaydedilen
   (veritabanı), sunucudaki data/config.yml ya da varsayılan (yapımcılarda
   depodaki yapimcilar.json). Her kart değerin nereden geldiğini yazar;
   panelden kaydedilen değer "Varsayılana dön" ile bırakılır. Kaydedilen değer
   hemen geçerli olur. Doğrulama sunucudakinin aynısı; sunucunun hatası da
   ilgili kutunun altına yazılır. */

var SA = { veri: null, yapimcilar: [], okullar: [], siteAdresi: '' };

var SA_KAYNAK = { veritabani: 'Panelden kaydedildi', config: 'data/config.yml', dosya: 'yapimcilar.json',
  ortam: 'EE_OKUL_DOSYA_GB ortam değişkeni', varsayilan: 'Varsayılan' };

var SA_ARALIK = [
  { k: 'bildirimAralikDk', id: 'saBildirim', ad: 'Bildirim yoklama aralığı',
    aciklama: 'Açık sayfalar yeni bildirim var mı diye bu aralıkla sorar. Sekmeye dönülünce ve bildirim paneli açılınca beklemeden sorulur.' },
  { k: 'cevrimiciDk', id: 'saCevrimici', ad: 'Çevrimiçi sayma süresi',
    aciklama: 'Son bu kadar dakikada sayfası açık olan kişi açılış sayfasında "şu an açık" sayılır. Yoklama aralığından kısa olamaz: ' +
      'sunucu en az yoklama aralığı + 1 dakika kullanır.' },
  { k: 'adminsAralikDk', id: 'saAdmins', ad: 'admins.json okuma aralığı',
    aciklama: 'Sunucu data/admins.json dosyası değişti mi diye bu aralıkla bakar; değiştiyse okur.' }
];

/* Sunucunun hata cevabındaki alan -> kutu (yapımcı satırları ayrıca). */
var SA_ALAN = { eposta: 'saEposta', telefon: 'saTelefon', playStore: 'saPlay',
  bildirimAralikDk: 'saBildirim', cevrimiciDk: 'saCevrimici', adminsAralikDk: 'saAdmins', okulDiskMb: 'saDiskDeger' };

/* Sunucudaki kuralların aynısı (sunucu/site.js). */
var SA_EPOSTA = /^[!#-&(-;=?A-~]{1,64}@[!#-&(-;=?A-~]{1,190}\.[a-z]{2,}$/i;
var SA_PLAY = /^https:\/\/play\.google\.com\/[^\s"'<>]{4,300}$/;
var SA_GITHUB = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;

/* Okul adreslerinde gösterilen site adı: ayarlardaki site adresi, yoksa bu sayfanınki. */
function saHost() {
  return String(SA.siteAdresi || '').replace(/^https?:\/\//i, '').replace(/\/+$/, '') || location.host;
}

function saKopya(liste) {
  return (liste || []).map(function (y) { return { ad: y.ad || '', github: y.github || '', katki: y.katki || '' }; });
}

function saAralik(anahtar) {
  for (var i = 0; i < SA_ARALIK.length; i++) if (SA_ARALIK[i].k === anahtar) return SA_ARALIK[i];
  return null;
}

function saMesajYeri(anahtar) {
  var t = saAralik(anahtar);
  if (t) return t.id + 'Mesaj';
  return { iletisim: 'saIletisimMesaj', yapimcilar: 'saYapimciMesaj', playStore: 'saPlayMesaj', okulDiskMb: 'saDiskMesaj' }[anahtar] ||
    'saIletisimMesaj';
}

SAYFALAR['site-ayarlari'] = function () {
  return Promise.all([api('/admin/site-ayarlari'), api('/admin/okul-adresleri')]).then(function (r) {
    SA.veri = r[0];
    SA.yapimcilar = saKopya(r[0].ayarlar.yapimcilar.deger);
    SA.okullar = r[1].okullar || [];
    SA.siteAdresi = r[1].siteAdresi || '';
    yaz(hero('SİTE AYARLARI', 'Sitenin herkese görünen bilgileri ve zamanlamaları. Kaydettiğin değer hemen geçerli olur; ' +
      'sunucuyu yeniden başlatmak gerekmez.') +
      '<div class="msg bilgi">Panelden kaydedilmemiş bir ayar sunucudaki <b>data/config.yml</b> dosyasından, orada da yoksa ' +
      'varsayılandan gelir. Her kartta değerin nereden geldiği yazar.</div>' +
      saIletisimKarti() + saYapimciKarti() + saPlayKarti() + saAralikKarti() + saDiskKarti() + saOkulKarti());
  });
};

/* ---------------- kartların ortak parçaları ---------------- */
function saKaynak(a) {
  var h = '<div class="kaynak-satir"><span>Şu anki değer:</span><span class="etiket ' + (a.kaynak === 'veritabani' ? 'mavi' : 'gri') + '">' +
    esc(SA_KAYNAK[a.kaynak] || a.kaynak) + '</span>';
  if (a.kaynak === 'veritabani') {
    var kim = [a.guncelleyen, a.zaman ? tarihSaat(a.zaman) : ''].filter(Boolean).join(' · ');
    if (kim) h += '<span>' + esc(kim) + '</span>';
  }
  return h + '</div>';
}

function saDugmeler(anahtar, a, kaydetAd, donusAd) {
  return '<div class="dugme-satir">' +
    '<button class="btn" data-act="sa-kaydet" data-anahtar="' + anahtar + '">' + esc(kaydetAd || 'Kaydet') + '</button>' +
    (a.kaynak === 'veritabani' ? '<button class="btn gri" data-act="sa-sifirla" data-anahtar="' + anahtar + '">' +
      esc(donusAd || 'Varsayılana dön') + '</button>' : '') +
    '</div>';
}

/* Kaydedilince yalnız o kart yeniden çizilir; öbür kartlarda yazılanlar kalır. */
function saKartDegistir(id, html) {
  var eski = $(id);
  if (!eski) return;
  var kap = document.createElement('div');
  kap.innerHTML = html;
  eski.parentNode.replaceChild(kap.firstChild, eski);
}

/* ---------------- iletişim ---------------- */
function saIletisimKarti() {
  var a = SA.veri.ayarlar.iletisim, d = a.deger || {};
  return '<div class="kart ayar-kart" id="saKartIletisim"><h3>' + ik('posta') + 'İletişim bilgileri</h3>' +
    '<p class="hint kart-aciklama">Sayfaların altında ve Hakkında sayfasında görünür. Okulunu açtırmak isteyen kişi de ' +
    '<b>+ Ekle &gt; Müdür</b> penceresinde sana bu bilgilerle ulaşır. İkisi de boş bırakılabilir.</p>' +
    saKaynak(a) +
    '<div class="row2"><div class="field"><label for="saEposta">E-posta</label>' +
    '<input type="email" id="saEposta" maxlength="254" autocomplete="off" autocapitalize="off" spellcheck="false" ' +
    'placeholder="iletisim@ornek.org" value="' + esc(d.eposta || '') + '"></div>' +
    '<div class="field"><label for="saTelefon">Telefon</label>' +
    '<input type="text" id="saTelefon" inputmode="tel" maxlength="24" autocomplete="off" ' +
    'placeholder="+90 212 555 44 33" value="' + esc(d.telefon || '') + '">' +
    '<div class="hint">Ülke koduyla ya da başında 0 ile yaz; sayfada yazdığın gibi görünür.</div></div></div>' +
    saDugmeler('iletisim', a) + '<div id="saIletisimMesaj"></div></div>';
}

/* ---------------- yapımcılar ---------------- */
function saYapimciKarti() {
  var a = SA.veri.ayarlar.yapimcilar, s = SA.veri.sinirlar;
  return '<div class="kart ayar-kart" id="saKartYapimci"><h3>' + ik('grup') + 'Yapımcılar</h3>' +
    '<p class="hint kart-aciklama">Sitenin üst şeridindeki <b>Yapımcılar</b> listesi ve Hakkında sayfası. GitHub kullanıcı adı ' +
    'yazılırsa ad o kişinin GitHub sayfasına bağlanır. En fazla ' + s.yapimciEnCok + ' kişi; sırayı oklarla değiştir.</p>' +
    saKaynak(a) +
    '<div class="sirali-liste" id="saYapimciListe">' + saYapimciSatirlari() + '</div>' +
    '<div class="dugme-satir"><button class="btn ghost" data-act="sa-yapimci-ekle">' + ik('ekle') + 'Yapımcı ekle</button></div>' +
    '<hr class="ayrac-cizgi">' +
    saDugmeler('yapimcilar', a, 'Listeyi kaydet', 'yapimcilar.json listesine dön') +
    '<div id="saYapimciMesaj"></div></div>';
}

function saYapimciSatirlari() {
  var n = SA.yapimcilar.length, s = SA.veri.sinirlar;
  if (!n) return '<div class="okul-bilgi">Listede kimse yok. Boş liste kaydedilirse sayfalarda yalnız projenin sahibi görünür.</div>';
  var h = '';
  for (var i = 0; i < n; i++) {
    var y = SA.yapimcilar[i], no = i + 1;
    h += '<div class="sirali-satir">' +
      '<span class="sirali-no" aria-hidden="true">' + no + '</span>' +
      '<div class="field"><label for="saYAd' + i + '">Ad</label>' +
      '<input type="text" id="saYAd' + i + '" maxlength="' + s.adEnCok + '" autocomplete="off" value="' + esc(y.ad) + '"></div>' +
      '<div class="field"><label for="saYGh' + i + '">GitHub kullanıcı adı</label>' +
      '<input type="text" id="saYGh' + i + '" maxlength="60" autocomplete="off" autocapitalize="off" spellcheck="false" ' +
      'placeholder="İsteğe bağlı" value="' + esc(y.github) + '"></div>' +
      '<div class="field"><label for="saYKatki' + i + '">Katkısı</label>' +
      '<input type="text" id="saYKatki' + i + '" maxlength="' + s.katkiEnCok + '" autocomplete="off" ' +
      'placeholder="İsteğe bağlı" value="' + esc(y.katki) + '"></div>' +
      '<div class="sirali-dugmeler">' +
      '<button type="button" class="qz-ikon-btn" data-act="sa-yapimci-tasi" data-sira="' + i + '" data-yon="-1"' + (i ? '' : ' disabled') +
      ' aria-label="' + no + '. yapımcıyı yukarı taşı" title="Yukarı taşı">' + ik('yukari') + '</button>' +
      '<button type="button" class="qz-ikon-btn" data-act="sa-yapimci-tasi" data-sira="' + i + '" data-yon="1"' + (i < n - 1 ? '' : ' disabled') +
      ' aria-label="' + no + '. yapımcıyı aşağı taşı" title="Aşağı taşı">' + ik('asagi') + '</button>' +
      '<button type="button" class="qz-ikon-btn sil" data-act="sa-yapimci-sil" data-sira="' + i + '"' +
      ' aria-label="' + no + '. yapımcıyı listeden çıkar" title="Listeden çıkar">' + ik('hayir') + '</button>' +
      '</div></div>';
  }
  return h;
}

/* Kutulardaki yazılanlar listeye (sıralama ve silme yeniden çizmeden önce). */
function saYapimcilariOku() {
  for (var i = 0; i < SA.yapimcilar.length; i++) {
    if (!$('saYAd' + i)) continue;
    SA.yapimcilar[i] = { ad: $('saYAd' + i).value, github: $('saYGh' + i).value, katki: $('saYKatki' + i).value };
  }
}

function saYapimcilariCiz(odak) {
  $('saYapimciListe').innerHTML = saYapimciSatirlari();
  var el = odak ? document.querySelector(odak) : null;
  if (el) el.focus();
}

EYLEMLER['sa-yapimci-ekle'] = function () {
  saYapimcilariOku();
  var enCok = SA.veri.sinirlar.yapimciEnCok;
  if (SA.yapimcilar.length >= enCok) { mesajGoster('saYapimciMesaj', 'hata', 'En fazla ' + enCok + ' yapımcı eklenebilir.'); return; }
  SA.yapimcilar.push({ ad: '', github: '', katki: '' });
  saYapimcilariCiz('#saYAd' + (SA.yapimcilar.length - 1));
  S._sayfaDegisti = true;
};

EYLEMLER['sa-yapimci-sil'] = function (el) {
  saYapimcilariOku();
  var i = Number(el.getAttribute('data-sira'));
  if (!(i >= 0 && i < SA.yapimcilar.length)) return;
  SA.yapimcilar.splice(i, 1);
  var n = SA.yapimcilar.length;
  saYapimcilariCiz(n ? '[data-act="sa-yapimci-sil"][data-sira="' + Math.min(i, n - 1) + '"]' : '[data-act="sa-yapimci-ekle"]');
  S._sayfaDegisti = true;
};

EYLEMLER['sa-yapimci-tasi'] = function (el) {
  saYapimcilariOku();
  var i = Number(el.getAttribute('data-sira')), yon = Number(el.getAttribute('data-yon')), j = i + yon;
  if (!(j >= 0 && j < SA.yapimcilar.length)) return;
  var t = SA.yapimcilar[i];
  SA.yapimcilar[i] = SA.yapimcilar[j];
  SA.yapimcilar[j] = t;
  /* Odak taşınan satırla gider; en uca vardıysa öbür yöndeki düğmeye. */
  var ayni = '[data-act="sa-yapimci-tasi"][data-sira="' + j + '"][data-yon="' + yon + '"]';
  var ters = '[data-act="sa-yapimci-tasi"][data-sira="' + j + '"][data-yon="' + (-yon) + '"]';
  saYapimcilariCiz((j === 0 && yon < 0) || (j === SA.yapimcilar.length - 1 && yon > 0) ? ters : ayni);
  S._sayfaDegisti = true;
};

/* ---------------- Play Store ---------------- */
function saPlayKarti() {
  var a = SA.veri.ayarlar.playStore;
  return '<div class="kart ayar-kart" id="saKartPlay"><h3>' + ik('indir') + 'Play Store bağlantısı</h3>' +
    '<p class="hint kart-aciklama">İndir sayfasındaki <b>Google Play\'den yükle</b> düğmesi bu adrese gider; boşsa düğme görünmez. ' +
    'Değişiklik indir sayfası yeniden açılınca hemen görünür.</p>' +
    saKaynak(a) +
    '<div class="field"><label for="saPlay">Bağlantı</label>' +
    '<input type="url" id="saPlay" maxlength="330" autocomplete="off" autocapitalize="off" spellcheck="false" ' +
    'placeholder="https://play.google.com/store/apps/details?id=..." value="' + esc(a.deger || '') + '">' +
    '<div class="hint">Yalnız https://play.google.com/ ile başlayan adres.</div></div>' +
    saDugmeler('playStore', a) + '<div id="saPlayMesaj"></div></div>';
}

/* ---------------- zamanlamalar ---------------- */
function saAralikKarti() {
  var h = '<div class="kart ayar-kart" id="saKartAralik"><h3>' + ik('saat') + 'Zamanlamalar</h3>';
  for (var i = 0; i < SA_ARALIK.length; i++) {
    var t = SA_ARALIK[i], a = SA.veri.ayarlar[t.k];
    h += '<div class="ayar-blok"><div class="field"><label for="' + t.id + '">' + esc(t.ad) + '</label>' +
      '<div class="sayi-satir"><input type="number" id="' + t.id + '" inputmode="numeric" min="' + a.en + '" max="' + a.cok + '" ' +
      'step="1" value="' + esc(a.deger) + '"><span class="birim">dakika</span>' +
      '<button class="btn kucuk" data-act="sa-kaydet" data-anahtar="' + t.k + '">Kaydet</button>' +
      (a.kaynak === 'veritabani' ? '<button class="btn kucuk gri" data-act="sa-sifirla" data-anahtar="' + t.k + '">Varsayılana dön</button>' : '') +
      '</div><div class="hint">' + esc(t.aciklama) + ' ' + a.en + '–' + a.cok + ' dakika; varsayılan ' + a.varsayilan + '.</div></div>' +
      saKaynak(a) +
      /* Kaydedilen süre kullanılamıyorsa uyarı kutusu; varsayılanlarla yalnız kullanılan süre (not). */
      (t.k === 'cevrimiciDk' && a.uyari ? '<div class="msg uyari">' + esc(a.uyari) + '</div>' : '') +
      (t.k === 'cevrimiciDk' && a.not && !a.uyari ? '<p class="hint">' + esc(a.not) + '</p>' : '') +
      (t.k === 'adminsAralikDk' ? '<div class="dugme-satir"><span class="hint">Son okuma, açılan ve atlanan satırlar:</span>' +
        '<button type="button" class="btn kucuk ghost" data-nav="yonetici-dosyasi">Yönetici Dosyası</button></div>' : '') +
      '<div id="' + t.id + 'Mesaj"></div></div>';
  }
  return h + '</div>';
}

/* ---------------- varsayılan okul disk sınırı ---------------- */
function saDiskKarti() {
  var a = SA.veri.ayarlar.okulDiskMb;
  return '<div class="kart ayar-kart" id="saKartDisk"><h3>' + ik('kutu') + 'Varsayılan okul disk sınırı</h3>' +
    '<p class="hint kart-aciklama">Okulun dosyaları (ödev teslim dosyaları, ekler, okul sayfası fotoğrafları) okulun disk sınırına ' +
    'sayılır. Okul açılırken ve <b>Okullar</b> listesinde her okula ayrı sınır verilebilir; ayrı sınırı olmayan okullar bu değeri ' +
    'kullanır. Sınır küçülürse var olan dosyalar silinmez, yalnız yeni yükleme durur.</p>' +
    saKaynak(a) +
    diskSiniriAlani('saDisk', a.deger, null, 'Sınır', true) +
    '<div class="hint">1 MB ile 10 TB arası; kodun varsayılanı ' + esc(diskYaz(a.varsayilan * OKUL_DISK_MB)) + '. Panelden kaydedilmediyse ' +
    'sunucudaki EE_OKUL_DOSYA_GB ortam değişkeni (verilmişse) geçerlidir.</div>' +
    saDugmeler('okulDiskMb', a) +
    '<div class="dugme-satir"><span class="hint">Her okulun sınırı, doluluğu ve diskteki boş yer:</span>' +
    '<button type="button" class="btn kucuk ghost" data-nav="okullar">Okullar</button></div>' +
    '<div id="saDiskMesaj"></div></div>';
}

/* ---------------- kaydet / varsayılana dön ---------------- */
/* Kartın kutularından ayarın değeri. Sorun varsa kutunun altına yazılır
   (kart .hatali taşır). Yapımcılarda { liste, sira }: sira[k] gönderilen
   k. satırın ekrandaki sırası (boş satırlar gönderilmez). */
function saDegerOku(anahtar) {
  if (anahtar === 'iletisim') {
    var ep = $('saEposta').value.trim(), tel = $('saTelefon').value.trim().replace(/\s+/g, ' ');
    /* Hesap e-postalarıyla aynı kural: yalnız İngilizce harf, rakam ve işaretler. */
    if (ep && /[^\x21-\x7e]/.test(ep) && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(ep)) {
      alanHatasi('saEposta', 'E-posta adresinde Türkçe ya da başka alfabeden harf olamaz (ı, ş, ğ, ü, ö, ç gibi); İngilizce harflerle yaz.');
    } else if (ep && (ep.length > 254 || !SA_EPOSTA.test(ep))) alanHatasi('saEposta', 'E-posta adresi geçerli değil (ör. iletisim@egitimevi.org).');
    if (tel) {
      if (tel.length > 24 || /[^0-9+() -]/.test(tel)) {
        alanHatasi('saTelefon', 'Telefonda yalnız rakam, boşluk, +, tire ve parantez olabilir (en fazla 24 karakter).');
      } else if (telefonSorunuTR(tel)) alanHatasi('saTelefon', telefonSorunuTR(tel));
    }
    return { eposta: ep, telefon: tel };
  }
  if (anahtar === 'playStore') {
    var p = $('saPlay').value.trim();
    if (p && !SA_PLAY.test(p)) alanHatasi('saPlay', 'Bağlantı https://play.google.com/ ile başlamalı (ör. https://play.google.com/store/apps/details?id=...).');
    return p;
  }
  if (anahtar === 'yapimcilar') {
    saYapimcilariOku();
    var s = SA.veri.sinirlar, liste = [], sira = [];
    for (var i = 0; i < SA.yapimcilar.length; i++) {
      var y = SA.yapimcilar[i];
      var ad = y.ad.trim().replace(/\s+/g, ' '), katki = y.katki.trim().replace(/\s+/g, ' ');
      /* "@ad" ya da GitHub sayfasının adresi yapıştırıldıysa yalnız ad alınır. */
      var gh = y.github.trim().replace(/^@/, '').replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/\/+$/, '');
      if (!ad && !gh && !katki) continue;
      if (!ad) alanHatasi('saYAd' + i, 'Adını yaz.');
      else if (ad.length > s.adEnCok) alanHatasi('saYAd' + i, 'Ad en fazla ' + s.adEnCok + ' karakter olabilir.');
      if (gh && !SA_GITHUB.test(gh)) {
        alanHatasi('saYGh' + i, 'Yalnız harf, rakam ve tire olabilir; tireyle başlayıp bitemez (en fazla 39 karakter).');
      }
      if (katki.length > s.katkiEnCok) alanHatasi('saYKatki' + i, 'Katkı en fazla ' + s.katkiEnCok + ' karakter olabilir.');
      liste.push({ ad: ad, github: gh, katki: katki });
      sira.push(i);
    }
    return { liste: liste, sira: sira };
  }
  if (anahtar === 'okulDiskMb') {
    var mb = diskSiniriOku('saDisk');
    return mb === null ? 0 : mb;
  }
  var t = saAralik(anahtar), a = SA.veri.ayarlar[anahtar];
  var v = $(t.id).value.trim();
  if (!/^\d{1,4}$/.test(v) || Number(v) < a.en || Number(v) > a.cok) {
    alanHatasi(t.id, t.ad + ' ' + a.en + ' ile ' + a.cok + ' dakika arasında bir tam sayı olmalı.');
  }
  return Number(v);
}

EYLEMLER['sa-kaydet'] = function (el) {
  var anahtar = el.getAttribute('data-anahtar');
  var kart = el.closest('.kart');
  formHatalariniSil(kart);
  if ($(saMesajYeri(anahtar))) $(saMesajYeri(anahtar)).innerHTML = '';
  var deger = saDegerOku(anahtar);
  if (kart.querySelector('.hatali')) { ilkHatayaGit(kart); return; }
  var sira = null;
  if (anahtar === 'yapimcilar') { sira = deger.sira; deger = deger.liste; }
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/admin/site-ayarlari', 'POST', { anahtar: anahtar, deger: deger }).then(function (d) {
    saSonuc(anahtar, d);
  })['catch'](function (e) { dugmeBitir(el); saHata(e, anahtar, sira); });
};

EYLEMLER['sa-sifirla'] = function (el) {
  var anahtar = el.getAttribute('data-anahtar');
  if (!confirm(anahtar === 'yapimcilar'
    ? 'Panelden kaydedilen yapımcı listesi silinsin mi?\n\nListe depodaki yapimcilar.json dosyasından gelir.'
    : anahtar === 'okulDiskMb'
      ? 'Panelden kaydedilen varsayılan okul disk sınırı silinsin mi?\n\nSunucuda EE_OKUL_DOSYA_GB verilmişse o, verilmemişse 5 GB geçerli olur.'
      : 'Panelden kaydedilen değer silinsin mi?\n\nAyar sunucudaki data/config.yml dosyasındaki değere, orada da yoksa varsayılana döner.')) return;
  dugmeBekle(el, 'Siliniyor...');
  return api('/admin/site-ayarlari', 'POST', { anahtar: anahtar, sifirla: true }).then(function (d) {
    saSonuc(anahtar, d);
  })['catch'](function (e) { dugmeBitir(el); mesajGoster(saMesajYeri(anahtar), 'hata', e.message); });
};

/* Kayıttan sonra: yalnız o kart yeniden çizilir; sayfanın altındaki
   iletişim bilgileri, yapımcı listesi ve bu sekmenin yoklama aralığı da
   hemen güncellenir. */
function saSonuc(anahtar, d) {
  var eski = SA.veri;
  SA.veri = { ayarlar: d.ayarlar, sinirlar: d.sinirlar };
  var yeni = d.ayarlar[anahtar];
  if (anahtar === 'iletisim') {
    saKartDegistir('saKartIletisim', saIletisimKarti());
    iletisimCiz(yeni.deger);
  } else if (anahtar === 'yapimcilar') {
    SA.yapimcilar = saKopya(yeni.deger);
    saKartDegistir('saKartYapimci', saYapimciKarti());
    yapimcilariCiz(yeni.deger || []);
  } else if (anahtar === 'playStore') {
    saKartDegistir('saKartPlay', saPlayKarti());
  } else if (anahtar === 'okulDiskMb') {
    saKartDegistir('saKartDisk', saDiskKarti());
  } else {
    /* Aralık kartı bütünüyle çizilir (çevrimiçi uyarısı yoklama aralığına
       bağlı); öbür kutulara yazılıp kaydedilmemiş sayılar kalır. */
    var yazilan = {};
    SA_ARALIK.forEach(function (t) {
      if (t.k !== anahtar && $(t.id) && $(t.id).value !== String(eski.ayarlar[t.k].deger)) yazilan[t.id] = $(t.id).value;
    });
    saKartDegistir('saKartAralik', saAralikKarti());
    for (var id in yazilan) if ($(id)) $(id).value = yazilan[id];
    if (anahtar === 'bildirimAralikDk') bildirimAraligiAl(yeni.deger);
  }
  mesajGoster(saMesajYeri(anahtar), 'iyi', d.message);
}

function saHata(e, anahtar, sira) {
  var v = e.veri || {};
  var hedef = '';
  if (v.alan === 'yapimcilar' && typeof v.sira === 'number') {
    var satir = sira && sira[v.sira] !== undefined ? sira[v.sira] : v.sira;
    hedef = ({ github: 'saYGh', katki: 'saYKatki' }[v.altAlan] || 'saYAd') + satir;
  } else hedef = SA_ALAN[v.alan] || '';
  if (hedef && $(hedef)) {
    alanHatasi(hedef, e.message);
    ilkHatayaGit($(hedef).closest('.kart'));
    return;
  }
  mesajGoster(saMesajYeri(anahtar), 'hata', e.message);
}

/* ---------------- okul adresleri ---------------- */
function saOkulKarti() {
  var liste = SA.okullar, host = saHost();
  var h = '<div class="kart ayar-kart" id="saKartOkul"><h3>' + ik('okul') + 'Okul adresleri</h3>' +
    '<p class="hint kart-aciklama">Öğrenci, öğretmen ve servisçiler okullarına bu adresten girer (' + esc(host) + '/school/…). ' +
    'Müdür kendi okulunun adresini de değiştirebilir. Adres değişince eski adres hemen çalışmaz olur. ' +
    'Üstteki arama kutusu listeyi süzer.</p><div id="saOkulSonuc"></div>';
  if (!liste.length) return h + bosKutu('okul', 'Henüz okul yok.') + '</div>';
  for (var i = 0; i < liste.length; i++) {
    var o = liste[i];
    h += '<div class="satir" data-ara="' + esc([o.ad, o.il, o.ilce, o.kisaAd].join(' ')) + '">' +
      '<div class="buyu"><div class="ad">' + esc(o.ad) + '</div>' +
      '<div class="alt">' + esc([o.ilce, o.il].filter(Boolean).join(', ')) + '</div>' +
      '<div class="alt adres-goster">' + (o.kisaAd ? esc(host + '/school/' + o.kisaAd) : 'Adresi yok') + '</div></div>' +
      (o.durum === 'pending' ? '<span class="etiket turuncu">Müdür bekliyor</span>' : '') +
      '<button class="btn kucuk ghost" data-act="sa-okul-adres" data-id="' + esc(o.id) + '">' +
      (o.kisaAd ? 'Adresi değiştir' : 'Adres ver') + '</button></div>';
  }
  return h + '</div>';
}

function saOkulBul(id) {
  for (var i = 0; i < SA.okullar.length; i++) if (SA.okullar[i].id === id) return SA.okullar[i];
  return null;
}

EYLEMLER['sa-okul-adres'] = function (el, id) {
  var o = saOkulBul(id);
  if (!o) return;
  var host = saHost();
  modalAc('Okulun adresi',
    '<p class="hint kart-aciklama"><b>' + esc(o.ad) + '</b>' + (o.il ? ' · ' + esc([o.ilce, o.il].filter(Boolean).join(', ')) : '') + '</p>' +
    '<div class="field"><label for="saOkulKisa">Adres adı</label>' +
    '<div class="adres-girdi"><span>' + esc(host) + '/school/</span>' +
    '<input type="text" id="saOkulKisa" maxlength="40" autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc(o.kisaAd) + '"></div>' +
    '<div class="hint">Küçük harf (Türkçe harf olmadan), rakam ve tire; 3–40 karakter.</div></div>' +
    (o.kisaAd ? '<div class="msg uyari">Adres değişince eski adres (' + esc(host + '/school/' + o.kisaAd) + ') hemen çalışmaz olur: ' +
      'onu kaydetmiş öğrenci ve öğretmenler okulu bulamaz. Okulun müdürüne bildirim gider; yeni adresi okula duyurmak gerekir.</div>' : '') +
    '<div id="saOkulMesaj"></div>',
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
    '<button class="btn" data-act="sa-okul-adres-kaydet" data-id="' + esc(o.id) + '">Adresi kaydet</button>');
  var kutu = $('saOkulKisa');
  /* Yazarken adres kuralına çevrilir (Türkçe harf, boşluk -> tire), 16b-okul-ayarlari.js gibi. */
  kutu.addEventListener('input', function () {
    var y = aramaSadeTR(this.value.replace(/-/g, ' ')).replace(/ /g, '-');
    if (/[-\s]$/.test(this.value) && y) y += '-';
    if (y !== this.value) this.value = y;
  });
  kutu.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); EYLEMLER['sa-okul-adres-kaydet'](document.querySelector('[data-act="sa-okul-adres-kaydet"]'), id); }
  });
  kutu.focus();
};

EYLEMLER['sa-okul-adres-kaydet'] = function (el, id) {
  var o = saOkulBul(id), kutu = $('saOkulKisa');
  if (!kutu) return;
  alanTemizle(kutu.closest('.field'));
  var kisa = kutu.value.trim().replace(/-+$/, '');
  var sorun = okulAdresiSorunuTR(kisa);
  if (sorun) { alanHatasi(kutu, sorun); kutu.focus(); return; }
  if (o && kisa === o.kisaAd) { mesajGoster('saOkulMesaj', 'bilgi', 'Okulun adresi zaten bu.'); return; }
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/admin/okul-adres', 'POST', { okulId: id, kisaAd: kisa }).then(function (d) {
    if (o) o.kisaAd = d.okul.kisaAd;
    modalKapat();
    saKartDegistir('saKartOkul', saOkulKarti());
    araUygula();
    mesajGoster('saOkulSonuc', 'uyari', d.message);
    $('saOkulSonuc').scrollIntoView({ block: 'nearest' });
  })['catch'](function (e) {
    dugmeBitir(el);
    var v = e.veri || {};
    if (v.alan === 'kisaAd') { alanHatasi(kutu, e.message); kutu.focus(); }
    else mesajGoster('saOkulMesaj', 'hata', e.message);
  });
};
