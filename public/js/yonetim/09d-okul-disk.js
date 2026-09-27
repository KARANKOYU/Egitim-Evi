/* Yönetim paneli: okulların disk sınırı (sunucu/bolumler/okul-disk.js).

   - Okullar sayfasının üstündeki "Disk" kartı: okullara ayrılan toplam,
     okulların kullandığı, diskteki gerçek boş yer, veritabanının yaklaşık
     boyutu, son dosya mutabakatı. Ayrılan alanın kullanılmayan kısmı diskteki
     boş yerden fazlaysa uyarır (izin verilir).
   - Okul ekranı (okul-ekrani): okulun bilgisi, doluluk çubuğu ve dağılımı,
     disk sınırı (sayı + MB/GB seçici; "Varsayılan sınırı kullan"; öneri:
     öğrenci sayısı × 10 MB, en az 2 GB). Okul açma penceresi aynı sınır
     alanını kullanır (09-yonetici.js).
   - Site Ayarları'ndaki "Varsayılan okul disk sınırı" kartı da aynı alanı
     kullanır (09b-site-ayarlari.js).
   Doluluk çubuğu ve biçim ortak parçada (parcalar/08d-okul-disk.js). */

var OKUL_DISK_MB = 1048576;
var OKUL_DISK_ONERI = { kisiMb: 10, enAzMb: 2048 };   // sunucudaki okul-disk.js ile aynı
var OKUL_DISK_EN_COK_MB = 10485760;                   // 10 TB
/* Son /admin/overview: okullar ve sistem geneli (Okullar sayfası doldurur). */
var ADMIN_OKULLAR = { liste: [], disk: null };

/* Öneri (MB): öğrenci × 10 MB, en az 2 GB; öğrenci yoksa null (varsayılan). */
function diskOneriMb(ogrenci) {
  var n = Number(ogrenci) || 0;
  return n > 0 ? Math.min(OKUL_DISK_EN_COK_MB, Math.max(OKUL_DISK_ONERI.enAzMb, n * OKUL_DISK_ONERI.kisiMb)) : null;
}

function diskVarsayilanMb() {
  return ADMIN_OKULLAR.disk ? ADMIN_OKULLAR.disk.varsayilanMb : 5120;
}

/* MB -> kutudaki değer ve birim. GB'a (en çok iki ondalıkla) tam çevrilebiliyorsa
   GB, değilse MB: kaydedilen değer yuvarlanıp değişmesin. */
function diskKutuDegeri(mb) {
  var gb = Math.round(mb / 1024 * 100) / 100;
  if (mb >= 1024 && Math.round(gb * 1024) === mb) return { deger: sayiGirdi(gb), birim: 'GB' };
  return { deger: String(mb), birim: 'MB' };
}

/* Öneri satırı: "Öneri: 3200 MB (320 öğrenci × 10 MB, en az 2 GB)". */
function diskOneriYazisi(ogrenci) {
  var mb = diskOneriMb(ogrenci);
  if (mb === null) return 'Öneri: varsayılan ' + diskYaz(diskVarsayilanMb() * OKUL_DISK_MB) +
    ' (öğrenci sayısı yok; öğrenci sayısı × 10 MB, en az 2 GB).';
  return 'Öneri: ' + diskYaz(mb * OKUL_DISK_MB) + ' (' + sayiTR(Number(ogrenci)) + ' öğrenci × 10 MB, en az 2 GB).';
}

/* Sınır alanı: onek + 'Deger' (sayı), onek + 'Birim' (MB/GB), onek + 'Oneri' (öneri satırı).
   mb: kutudaki değer; ogrenci: öneri için (null: öneri varsayılan); oneriYok:
   öneri satırı ve "Öneriyi kullan" yok (Site Ayarları'ndaki varsayılan). */
function diskSiniriAlani(onek, mb, ogrenci, etiket, oneriYok) {
  var k = diskKutuDegeri(mb);
  return '<div class="field disk-siniri"><label for="' + onek + 'Deger">' + esc(etiket || 'Disk sınırı') + '</label>' +
    '<div class="sayi-satir"><input type="text" id="' + onek + 'Deger" inputmode="decimal" maxlength="12" autocomplete="off" ' +
    'value="' + esc(k.deger) + '">' +
    '<select id="' + onek + 'Birim" aria-label="Birim"><option value="GB"' + (k.birim === 'GB' ? ' selected' : '') + '>GB</option>' +
    '<option value="MB"' + (k.birim === 'MB' ? ' selected' : '') + '>MB</option></select>' +
    (oneriYok ? '' : '<button type="button" class="btn kucuk ghost" data-act="disk-oneri-kullan" data-onek="' + onek + '" data-ogrenci="' +
      esc(ogrenci === null || ogrenci === undefined ? '' : ogrenci) + '">Öneriyi kullan</button>') + '</div>' +
    (oneriYok ? '' : '<div class="hint" id="' + onek + 'Oneri">' + esc(diskOneriYazisi(ogrenci)) + '</div>') + '</div>';
}

/* Kutudaki değer MB olarak (tam sayı); geçersizse kutunun altına hata yazar, null döner. */
function diskSiniriOku(onek) {
  var kutu = $(onek + 'Deger'), birim = $(onek + 'Birim').value;
  var yazi = kutu.value.trim().replace(/\s+/g, '').replace(',', '.');
  var n = /^\d+(\.\d+)?$/.test(yazi) ? Number(yazi) : NaN;
  var mb = birim === 'GB' ? Math.round(n * 1024) : n;
  if (!yazi) { alanHatasi(kutu, 'Disk sınırını yaz.'); return null; }
  if (birim === 'MB' && !/^\d+$/.test(yazi)) { alanHatasi(kutu, 'MB olarak tam sayı yaz (ör. 500) ya da birimi GB seç.'); return null; }
  if (!(mb >= 1 && mb <= OKUL_DISK_EN_COK_MB)) { alanHatasi(kutu, 'Disk sınırı 1 MB ile 10 TB arasında olmalı.'); return null; }
  return mb;
}

function diskSiniriYaz(onek, mb) {
  var k = diskKutuDegeri(mb);
  $(onek + 'Deger').value = k.deger;
  $(onek + 'Birim').value = k.birim;
}

EYLEMLER['disk-oneri-kullan'] = function (el) {
  var onek = el.getAttribute('data-onek');
  var mb = diskOneriMb(el.getAttribute('data-ogrenci'));
  if (!$(onek + 'Deger')) return;
  alanTemizle($(onek + 'Deger').closest('.field'));
  if ($(onek + 'Deger').disabled) return;
  diskSiniriYaz(onek, mb === null ? diskVarsayilanMb() : mb);
  $(onek + 'Deger').focus();
};

/* ---------------- sistem geneli (Okullar sayfasının üstü) ---------------- */
function okulDiskMutabakatYazisi(m) {
  if (!m) return 'Dosya mutabakatı henüz yapılmadı (sunucu açıldıktan bir dakika sonra, sonra saatte bir yapılır).';
  var sorun = [];
  if (m.sahipsiz.adet) sorun.push(m.sahipsiz.adet + ' sahipsiz dosya (' + diskYaz(m.sahipsiz.bayt) + '; temizlikte silinir)');
  if (m.kayip) sorun.push(m.kayip + ' kaydın dosyası diskte yok');
  if (m.boyutFarki) sorun.push(m.boyutFarki + ' dosyanın boyutu kayıtla tutmuyor');
  return 'Son dosya mutabakatı ' + tarihSaat(m.zaman) + ': diskte ' + sayiTR(m.diskte.adet) + ' dosya (' + diskYaz(m.diskte.bayt) + ')' +
    (sorun.length ? '; ' + sorun.join(', ') + '.' : ', kayıtlarla tutarlı.');
}

function okulDiskSistemKarti(s) {
  var satir = function (ad, deger) { return '<div><dt>' + esc(ad) + '</dt><dd>' + esc(deger) + '</dd></div>'; };
  return '<div class="kart ayar-kart" id="okulDiskSistem"><h3>' + ik('kutu') + 'Disk</h3>' +
    '<p class="hint kart-aciklama">Her okulun dosyaları (ödev teslim dosyaları, ekler, okul sayfası fotoğrafları) kendi sınırına ' +
    'sayılır; dolunca o okulda yeni yükleme durur. Okullara ayrılan toplam diskten büyük olabilir; o zaman burada uyarı çıkar.</p>' +
    '<dl class="disk-ozet">' +
    satir('Okullara ayrılan', diskYaz(s.ayrilan) + ' (' + s.okul + ' okul)') +
    satir('Okulların kullandığı', diskYaz(s.kullanilan)) +
    satir('Diskteki boş yer', s.bos === null ? 'okunamadı' : diskYaz(s.bos) + (s.diskToplam ? ' (disk ' + diskYaz(s.diskToplam) + ')' : '')) +
    satir('Veritabanı', s.veritabani === null ? 'okunamadı' : 'yaklaşık ' + diskYaz(s.veritabani) + ' (sınırlara sayılmaz)') +
    '</dl>' +
    (s.uyari ? '<div class="msg uyari" role="status">' + esc(s.uyari) + '</div>' : '') +
    '<p class="hint">' + esc(okulDiskMutabakatYazisi(s.mutabakat)) + '</p>' +
    '<div class="dugme-satir"><span class="hint">Varsayılan okul disk sınırı ' + esc(diskYaz(s.varsayilanMb * OKUL_DISK_MB)) +
    '; özel sınırı olmayan okullar bunu kullanır.</span>' +
    '<button type="button" class="btn kucuk ghost" data-nav="site-ayarlari">Site Ayarları</button></div></div>';
}

/* Okullar tablosundaki hücre. */
function okulDiskHucresi(s) {
  var d = s.disk;
  return okulDiskCubugu(d, d.ozel ? 'Özel sınır' : 'Varsayılan', true);
}

function adminOkulBul(id) {
  for (var i = 0; i < ADMIN_OKULLAR.liste.length; i++) if (ADMIN_OKULLAR.liste[i].id === id) return ADMIN_OKULLAR.liste[i];
  return null;
}

/* ---------------- okul ekranı ----------------
   Okulun dosya alanı bölümü üç parça: okulDiskBolumu(s) (HTML: doluluk çubuğu,
   dağılım, "Varsayılan sınırı kullan", özel sınır kutusu, öneri), okulDiskBolumuKur()
   (kutuyu bağlar) ve okulDiskBolumuOku() (MB, null = varsayılan; geçersizse
   undefined ve hata kutunun altında). Bugün Okullar > Düzenle penceresi kullanır;
   okul düzenleme ekranı da aynı parçaları kullanabilir. s: /admin/overview'daki okul. */
function okulDiskBolumu(s) {
  var d = s.disk, varsayilan = diskVarsayilanMb();
  var ogrenci = Number(s.students) || 0;
  return '<h4 class="alt-baslik">Dosya alanı</h4>' +
    okulDiskCubugu(d, d.ozel ? 'Bu okula özel sınır' : 'Varsayılan sınır') +
    '<p class="hint">' + esc(okulDiskDagilimi(d.dagilim)) + '. Veritabanı sayılmaz.</p>' +
    '<div class="dosya-izin"><label class="onay"><input type="checkbox" id="oeVarsayilan"' + (d.ozel ? '' : ' checked') + '>' +
    '<span>Varsayılan sınırı kullan (' + esc(diskYaz(varsayilan * OKUL_DISK_MB)) + ')</span></label>' +
    '<div class="hint">Varsayılan Site Ayarları\'nda değişince bu okulun sınırı da değişir.</div></div>' +
    diskSiniriAlani('oeDisk', d.siniriMb || diskOneriMb(ogrenci) || varsayilan, ogrenci || null, 'Bu okula özel sınır') +
    '<div class="hint">Sınır küçültülürse var olan dosyalar silinmez; yalnız yeni yükleme durur. Değişiklik işlem kaydına yazılır.</div>';
}

function okulDiskBolumuKur() {
  var kutu = $('oeVarsayilan');
  if (!kutu) return;
  var esitle = function () {
    $('oeDiskDeger').disabled = kutu.checked;
    $('oeDiskBirim').disabled = kutu.checked;
    if (kutu.checked) alanTemizle($('oeDiskDeger').closest('.field'));
  };
  kutu.addEventListener('change', esitle);
  esitle();
}

function okulDiskBolumuOku() {
  alanTemizle($('oeDiskDeger').closest('.field'));
  if ($('oeVarsayilan').checked) return null;
  var mb = diskSiniriOku('oeDisk');
  if (mb === null) { $('oeDiskDeger').focus(); return undefined; }
  return mb;
}

EYLEMLER['okul-ekrani'] = function (el, id) {
  var s = adminOkulBul(id);
  if (!s) return;
  modalAc(s.name,
    '<p class="hint kart-aciklama">' + esc([s.district, s.city].filter(Boolean).join(', ')) + ' · Müdür: ' + esc(s.principal) +
    ' · ' + esc(s.teachers) + ' öğretmen · ' + esc(s.students) + ' öğrenci</p>' +
    okulDiskBolumu(s) + '<div id="oeMesaj"></div>',
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
    '<button class="btn" data-act="okul-disk-kaydet" data-id="' + esc(s.id) + '">Kaydet</button>');
  okulDiskBolumuKur();
};

EYLEMLER['okul-disk-kaydet'] = function (el, id) {
  var s = adminOkulBul(id);
  if (!s || !$('oeVarsayilan')) return;
  $('oeMesaj').innerHTML = '';
  var mb = okulDiskBolumuOku();
  if (mb === undefined) return;
  dugmeBekle(el, 'Kaydediliyor...');
  return api('/admin/okul-disk-siniri', 'POST', { okulId: id, mb: mb }).then(function (d) {
    modalKapat();
    return git('okullar').then(function () {
      sayfaMesaji(d.okul.disk && d.okul.disk.kullanilan >= d.okul.disk.sinir ? 'uyari' : 'iyi', s.name + ': ' + d.message);
    });
  })['catch'](function (e) {
    dugmeBitir(el);
    var v = e.veri || {};
    if (v.alan === 'mb' && !$('oeDiskDeger').disabled) { alanHatasi('oeDiskDeger', e.message); $('oeDiskDeger').focus(); }
    else mesajGoster('oeMesaj', 'hata', e.message);
  });
};
