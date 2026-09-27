/* Resim küçültme: dosya yüklenmeden önce, tarayıcıda (telefonda).

   Ödev teslim dosyaları (14b-odev-teslim.js), ödev ve mesaj ekleri
   (04d-ekler.js) ve okul sayfası fotoğrafları (19g-okul-sayfasi.js)
   yüklenmeden önce buradan geçer. Kurallar (KILAVUZ "Dosya küçültme ve disk
   sınırı"):
   - JPEG, PNG, WebP ve tarayıcı açabiliyorsa HEIC/HEIF. 500 KB'tan küçük
     dosyaya ve hareketli PNG / WebP'ye dokunulmaz.
   - Uzun kenar en çok 2048 px; kısa kenar 1024 px'in altına inmez (uzun ekran
     görüntüsündeki yazı okunur kalsın). JPEG kalitesi 0,82.
   - Yön (EXIF) uygulanır. Resim yeniden çizildiği için içindeki konum, tarih
     ve cihaz bilgisi gider.
   - PNG: saydamsa PNG kalır; fotoğraf gibiyse JPEG olur (adı .jpg); ekran
     görüntüsü, yazılı sayfa ya da çizim gibiyse PNG kalır. WebP saydamsa ya da
     ekran görüntüsü gibiyse olduğu gibi gider. HEIC JPEG olur.
   - Sonuç asıl dosyadan en az %20 küçük değilse asıl dosya olduğu gibi gider
     (meta veriyi sunucu siler).
   Aynı anda tek resim işlenir (telefonun belleği şişmesin). Çözme
   createImageBitmap ile arka planda yapılır; adımlar arasında sayfaya sıra
   verilir, arayüz donmaz. Eşikler testlerle belirlendi:
   testler/test-resim-kucult.js (başsız Edge'de gerçek tuval).

   Kullanım:
     resimKucultulebilir(dosya)   küçültmeye aday mı (tür ve boyut; anında)
     resimKucult(dosya)           Promise -> { dosya, ad, tur, once, sonra, kuculdu, cevrildi, sebep }
                                  hiç hata vermez: olmazsa asıl dosya döner (kuculdu: false)
     kucultmeYazisi(sonuc)        "8,4 MB → 620 KB" (küçülmediyse boş) */

var KUCULT = {
  altSinir: 500 * 1024,      // bundan küçük dosyaya dokunulmaz
  uzunKenar: 2048,
  kisaKenar: 1024,
  kalite: 0.82,
  kazanc: 0.8,               // yeni hâl asılın en çok %80'i olmalı (sunucudaki kuralla aynı)
  enCokPiksel: 60000000,     // bundan büyük resim tarayıcıda açılmaz (bellek)
  tuvalSiniri: 16000000,     // iOS'ta tuvalin en büyük alanı (4096 x 4096) altında kalınır
  ornek: 256,                // renk ve saydamlık örneğinin uzun kenarı
  /* Fotoğraf mı (kucultFotoMu): örnekteki farklı renklerin nokta sayısına oranı
     en az fotoRenk ve yan yana iki noktanın aynı renk olma oranı fotoEsit'ten az;
     ya da bu oran gurultuEsit'ten az (siyah-beyaz fotoğraf, taranmış sayfa: az
     renk ama her nokta komşusundan farklı). Başsız Edge'de ölçülen (2026-09):
     fotoğraf ve 3B çizim duvar kâğıtları renk 0,063-0,51 / eşit 0,14-0,51;
     ekran görüntüsü, belge, tablo, kod, harita, çizim, grafik renk <= 0,015 /
     eşit >= 0,86; fotoğraflı ekran görüntüsü (%30-90 fotoğraf) renk 0,07-0,18 /
     eşit 0,70-0,88 (PNG kalır); gürültülü taranmış sayfa eşit 0,003-0,05. */
  fotoRenk: 0.03,
  fotoEsit: 0.6,
  gurultuEsit: 0.2
};

var KUCULT_TURLER = { jpg: 'jpeg', jpeg: 'jpeg', png: 'png', webp: 'webp', heic: 'heic', heif: 'heic' };
var KUCULT_ADLAR = { jpeg: 'JPEG', png: 'PNG', webp: 'WebP', heic: 'HEIC' };
var KUCULT_YON = {};         // çözme yolu -> tarayıcı yönü (EXIF) kendisi uyguluyor mu
var kucultZinciri = null;    // sıradaki iş (aynı anda tek resim)

function kucultUzanti(ad) {
  var i = String(ad || '').lastIndexOf('.');
  return i > 0 ? String(ad).slice(i + 1).toLowerCase() : '';
}

function resimKucultulebilir(dosya) {
  if (!dosya || !dosya.size || dosya.size < KUCULT.altSinir || !window.FileReader || !window.Blob) return false;
  return !!KUCULT_TURLER[kucultUzanti(dosya.name)] || /^image\/(jpeg|png|webp|heic|heif)$/i.test(dosya.type || '');
}

function kucultmeYazisi(k) {
  return k && k.kuculdu ? boyutYazi(k.once) + ' → ' + boyutYazi(k.sonra) : '';
}

function resimKucult(dosya) {
  var is = function () { return kucultIsle(dosya); };
  var p = kucultZinciri ? kucultZinciri.then(is, is) : is();
  kucultZinciri = p.then(function () { return null; });
  return p;
}

/* Olduğu gibi giden dosya. */
function kucultAsil(dosya, sebep) {
  return { dosya: dosya, ad: dosya.name, tur: dosya.type, once: dosya.size, sonra: dosya.size,
    kuculdu: false, cevrildi: '', sebep: sebep || '' };
}

/* Sayfaya sıra ver: "Küçültülüyor…" görünsün, dokunuşlar beklemesin. */
function kucultBekle() {
  return new Promise(function (tamam) { setTimeout(tamam, 0); });
}

function kucultIsle(dosya) {
  var d = {};
  var kapat = function () { if (d.coz) { d.coz.kapat(); d.coz = null; } };
  if (!resimKucultulebilir(dosya)) return Promise.resolve(kucultAsil(dosya, 'aday değil'));
  return kucultBaslik(dosya).then(function (b) {
    d.bas = b;
    if (!b.tur) throw new Error('tanınmayan tür');
    if (b.hareketli) throw new Error('hareketli resim');   // tuvale yalnız ilk kare çizilir
    if (b.en * b.boy > KUCULT.enCokPiksel) throw new Error('çok büyük resim');
    return kucultBekle();
  }).then(function () {
    return kucultCoz(dosya);
  }).then(function (c) {
    d.coz = c;
    if (c.en * c.boy > KUCULT.enCokPiksel) throw new Error('çok büyük resim');
    return kucultYonUygulaniyor(c.yol);
  }).then(function (uygulaniyor) {
    /* Tarayıcı yönü kendisi uygulamıyorsa elle çevrilir. */
    d.yon = uygulaniyor ? 1 : d.bas.yon;
    d.olcu = d.bas.tur === 'jpeg' ? null : kucultOlc(d.coz.kaynak, d.coz.en, d.coz.boy, d.bas.alfa !== false);
    d.hedef = kucultHedef(d.bas.tur, d.olcu);
    if (!d.hedef) throw new Error(d.olcu && d.olcu.saydam ? 'saydam' : 'ekran görüntüsü');
    return kucultCiz(d.coz, d.yon, d.hedef === 'image/jpeg');
  }).then(function (tuval) {
    kapat();
    return kucultBekle().then(function () { return kucultKodla(tuval, d.hedef, KUCULT.kalite); }).then(function (blob) {
      tuval.width = tuval.height = 0;   // bellek hemen geri verilsin (iOS)
      return blob;
    });
  }).then(function (blob) {
    if (!blob || blob.type !== d.hedef || blob.size < 64) throw new Error('kodlanamadı');
    if (blob.size > dosya.size * KUCULT.kazanc) throw new Error('küçülmedi');
    var yeniTur = d.hedef === 'image/png' ? 'png' : 'jpeg';
    return { dosya: blob, ad: kucultAd(dosya.name, yeniTur), tur: d.hedef, once: dosya.size, sonra: blob.size, kuculdu: true,
      cevrildi: yeniTur === d.bas.tur ? '' : KUCULT_ADLAR[d.bas.tur] + ' → ' + KUCULT_ADLAR[yeniTur], sebep: '' };
  })['catch'](function (e) {
    kapat();
    return kucultAsil(dosya, (e && e.message) || 'hata');
  });
}

/* Hangi türe yazılır ('' = dokunma). */
function kucultHedef(tur, olcu) {
  if (tur === 'jpeg') return 'image/jpeg';
  if (olcu.saydam) return tur === 'png' ? 'image/png' : '';
  if (kucultFotoMu(olcu)) return 'image/jpeg';
  return tur === 'png' ? 'image/png' : '';
}

function kucultFotoMu(o) {
  return o.esit < KUCULT.gurultuEsit || (o.renk >= KUCULT.fotoRenk && o.esit < KUCULT.fotoEsit);
}

/* "odev.PNG" -> "odev.jpg"; tür değişmediyse ad aynı kalır. */
function kucultAd(ad, tur) {
  var eski = KUCULT_TURLER[kucultUzanti(ad)];
  if (eski === tur) return ad;
  var i = String(ad || '').lastIndexOf('.');
  return (i > 0 ? String(ad).slice(0, i) : String(ad || 'resim')) + (tur === 'png' ? '.png' : '.jpg');
}

/* ---- dosyanın başı: tür, boyutlar, yön, saydamlık olabilir mi ---- */
function kucultOkuBayt(blob) {
  return new Promise(function (tamam, hata) {
    var o = new FileReader();
    o.onload = function () { tamam(new Uint8Array(o.result)); };
    o.onerror = function () { hata(new Error('okunamadı')); };
    o.readAsArrayBuffer(blob);
  });
}

function kucultMetin(b, i, n) {
  var s = '';
  for (var k = 0; k < n && i + k < b.length; k++) s += String.fromCharCode(b[i + k]);
  return s;
}

function kucultU32(b, i) {
  return ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
}

/* alfa: false = kesin saydam değil; null = noktalara bakılmalı.
   hareketli: hareketli PNG (APNG) ya da WebP; dokunulmaz. HEIC'te yalnız tek
   resim markaları (heic, heix, heim, heis, mif1) alınır, resim dizileri değil. */
function kucultBaslik(dosya) {
  return kucultOkuBayt(dosya.slice(0, 262144)).then(function (b) {
    var s = { tur: '', en: 0, boy: 0, yon: 1, alfa: null, hareketli: false };
    if (b[0] === 0xFF && b[1] === 0xD8) { s.tur = 'jpeg'; s.alfa = false; kucultJpegBaslik(b, s); }
    else if (kucultMetin(b, 0, 8) === '\x89PNG\r\n\x1a\n') { s.tur = 'png'; kucultPngBaslik(b, s); }
    else if (kucultMetin(b, 0, 4) === 'RIFF' && kucultMetin(b, 8, 4) === 'WEBP') { s.tur = 'webp'; kucultWebpBaslik(b, s); }
    else if (kucultMetin(b, 4, 4) === 'ftyp' && /^(hei[cmsx]|mif1)$/.test(kucultMetin(b, 8, 4))) s.tur = 'heic';
    return s;
  });
}

function kucultJpegBaslik(b, s) {
  var i = 2;
  while (i + 4 <= b.length) {
    if (b[i] !== 0xFF) return;
    var m = b[i + 1];
    if (m === 0xFF) { i++; continue; }
    if (m === 0x01 || (m >= 0xD0 && m <= 0xD8)) { i += 2; continue; }
    if (m === 0xD9 || m === 0xDA) return;
    var uz = (b[i + 2] << 8) | b[i + 3];
    if (m === 0xE1 && s.yon === 1) s.yon = kucultExifYon(b, i + 4, Math.min(uz - 2, b.length - i - 4));
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) {
      if (i + 9 <= b.length) { s.boy = (b[i + 5] << 8) | b[i + 6]; s.en = (b[i + 7] << 8) | b[i + 8]; }
      return;
    }
    i += 2 + uz;
  }
}

/* APP1 "Exif": ilk IFD'deki yön (0x0112), yoksa 1. */
function kucultExifYon(b, bas, uz) {
  if (uz < 16 || kucultMetin(b, bas, 4) !== 'Exif' || b[bas + 4] || b[bas + 5]) return 1;
  var t = bas + 6, son = bas + uz, kucukSonlu = b[t] === 0x49;
  var u16 = function (o) { return kucukSonlu ? b[o] | (b[o + 1] << 8) : (b[o] << 8) | b[o + 1]; };
  var u32 = function (o) { return kucukSonlu ? ((b[o + 3] << 24) | (b[o + 2] << 16) | (b[o + 1] << 8) | b[o]) >>> 0 : kucultU32(b, o); };
  var ifd = t + u32(t + 4);
  if (ifd + 2 > son) return 1;
  var n = u16(ifd);
  for (var k = 0; k < n; k++) {
    var e = ifd + 2 + k * 12;
    if (e + 12 > son) return 1;
    if (u16(e) === 0x0112) {
      var y = u16(e + 8);
      return y >= 1 && y <= 8 ? y : 1;
    }
  }
  return 1;
}

function kucultPngBaslik(b, s) {
  if (b.length < 33) return;
  s.en = kucultU32(b, 16);
  s.boy = kucultU32(b, 20);
  /* Parçalar görüntüye (IDAT) kadar gezilir: hareket (acTL) ve saydam renk (tRNS)
     orada durur. Alfa kanalı (renk türü 4, 6) ya da tRNS yoksa kesin saydam değil. */
  var alfaKanali = b[25] === 4 || b[25] === 6, trns = false, i = 8;
  while (i + 8 <= b.length) {
    var ad = kucultMetin(b, i + 4, 4);
    if (ad === 'acTL') s.hareketli = true;
    if (ad === 'tRNS') trns = true;
    if (ad === 'IDAT' || ad === 'IEND') { if (!alfaKanali && !trns) s.alfa = false; return; }
    i += 12 + kucultU32(b, i);
  }
}

function kucultWebpBaslik(b, s) {
  var ad = kucultMetin(b, 12, 4);
  if (ad === 'VP8X' && b.length >= 30) {
    if (!(b[20] & 0x10)) s.alfa = false;
    if (b[20] & 0x02) s.hareketli = true;
    s.en = 1 + (b[24] | (b[25] << 8) | (b[26] << 16));
    s.boy = 1 + (b[27] | (b[28] << 8) | (b[29] << 16));
  } else if (ad === 'VP8L' && b.length >= 25) {
    s.en = 1 + (b[21] | ((b[22] & 0x3F) << 8));
    s.boy = 1 + ((b[22] >> 6) | (b[23] << 2) | ((b[24] & 0x0F) << 10));
    if (!(b[24] & 0x10)) s.alfa = false;
  } else if (ad === 'VP8 ' && b.length >= 30) {
    s.en = (b[26] | (b[27] << 8)) & 0x3FFF;
    s.boy = (b[28] | (b[29] << 8)) & 0x3FFF;
    s.alfa = false;
  }
}

/* ---- çözme ---- */
function kucultCoz(blob) {
  if (window.createImageBitmap) return kucultBitmapCoz(blob)['catch'](function () { return kucultResimCoz(blob); });
  return kucultResimCoz(blob);
}

/* createImageBitmap: çözme ana iş parçacığının dışında yapılır. */
function kucultBitmapCoz(blob) {
  return createImageBitmap(blob).then(function (bit) {
    return { kaynak: bit, en: bit.width, boy: bit.height, yol: 'bit', kapat: function () { if (bit.close) bit.close(); } };
  });
}

/* Eski tarayıcı: <img>. Güvenlik kuralı blob: adresine izin vermediği için data: adresiyle. */
function kucultResimCoz(blob) {
  return new Promise(function (tamam, hata) {
    var o = new FileReader();
    o.onload = function () {
      var img = new Image();
      var bitti = function () {
        tamam({ kaynak: img, en: img.naturalWidth, boy: img.naturalHeight, yol: 'img', kapat: function () { img.src = ''; } });
      };
      img.onload = function () { if (img.decode) img.decode().then(bitti, bitti); else bitti(); };
      img.onerror = function () { hata(new Error('açılamadı')); };
      img.src = o.result;
    };
    o.onerror = function () { hata(new Error('okunamadı')); };
    o.readAsDataURL(blob);
  });
}

/* Tarayıcı EXIF yönünü kendisi uyguluyor mu: 2x1'lik, yönü 6 (90 derece)
   yazılmış bir JPEG çözülür; 1x2 çıkarsa uyguluyor. Bir kez denenir. */
function kucultYonUygulaniyor(yol) {
  if (KUCULT_YON[yol] !== undefined) return Promise.resolve(KUCULT_YON[yol]);
  var t = document.createElement('canvas');
  t.width = 2;
  t.height = 1;
  return kucultKodla(t, 'image/jpeg', 0.9).then(function (b) {
    if (!b) throw new Error('kodlanamadı');
    return kucultOkuBayt(b);
  }).then(function (b) {
    var exif = [0xFF, 0xE1, 0, 34, 0x45, 0x78, 0x69, 0x66, 0, 0, 0x4D, 0x4D, 0, 0x2A, 0, 0, 0, 8,
      0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0, 6, 0, 0, 0, 0, 0, 0];
    var yeni = new Uint8Array(b.length + exif.length);
    yeni.set(b.subarray(0, 2));
    yeni.set(exif, 2);
    yeni.set(b.subarray(2), 2 + exif.length);
    var blob = new Blob([yeni], { type: 'image/jpeg' });
    return yol === 'bit' ? kucultBitmapCoz(blob) : kucultResimCoz(blob);
  }).then(function (c) {
    var sonuc = c.en === 1 && c.boy === 2;
    c.kapat();
    KUCULT_YON[yol] = sonuc;
    return sonuc;
  }, function () {
    KUCULT_YON[yol] = true;   // denenemedi: bugünkü tarayıcıların hepsi uyguluyor
    return true;
  });
}

/* ---- ölçme: saydamlık ve "fotoğraf mı" ----
   Resim en yakın nokta yöntemiyle en çok 256 px'e indirilir (yumuşatma yok:
   ekran görüntüsünün az sayıdaki gerçek rengi karışıp çoğalmasın). Sayılanlar:
   farklı renk sayısının nokta sayısına oranı ve yan yana iki noktanın aynı
   renk olma oranı (ekran görüntüsünde düz zemin çok, fotoğrafta hemen hiç). */
function kucultOlc(kaynak, en, boy, alfaBak) {
  var s = Math.min(1, KUCULT.ornek / Math.max(en, boy));
  var oe = Math.max(1, Math.round(en * s)), ob = Math.max(1, Math.round(boy * s));
  var t = document.createElement('canvas');
  t.width = oe;
  t.height = ob;
  var ctx = t.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(kaynak, 0, 0, oe, ob);
  var v = ctx.getImageData(0, 0, oe, ob).data;
  t.width = t.height = 0;
  var gorulen = new Uint8Array(2097152), renk = 0, esit = 0, cift = 0, saydam = false;
  for (var y = 0; y < ob; y++) {
    for (var x = 0; x < oe; x++) {
      var i = (y * oe + x) * 4;
      var r = (v[i] << 16) | (v[i + 1] << 8) | v[i + 2];
      if (v[i + 3] < 255) saydam = true;
      if (!(gorulen[r >> 3] & (1 << (r & 7)))) { gorulen[r >> 3] |= 1 << (r & 7); renk++; }
      if (x > 0) {
        cift++;
        if (v[i] === v[i - 4] && v[i + 1] === v[i - 3] && v[i + 2] === v[i - 2]) esit++;
      }
    }
  }
  return { saydam: alfaBak && saydam, renk: renk / (oe * ob), renkSayisi: renk, esit: cift ? esit / cift : 1 };
}

/* ---- çizme ---- */
function kucultOlcek(en, boy) {
  var s = Math.min(1, Math.max(KUCULT.uzunKenar / Math.max(en, boy), KUCULT.kisaKenar / Math.min(en, boy)));
  if (en * boy * s * s > KUCULT.tuvalSiniri) s = Math.sqrt(KUCULT.tuvalSiniri / (en * boy));
  return s;
}

function kucultTuval(en, boy) {
  var t = document.createElement('canvas');
  t.width = en;
  t.height = boy;
  var ctx = t.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  return { t: t, ctx: ctx };
}

/* Yüksek kaliteli yumuşatmayı (imageSmoothingQuality) bilen tarayıcı tek adımda
   iyi küçültür; bilmeyende çok küçültmede yarıya yarıya inilir (tek adımda ince
   çizgiler tırtıklanır). Tek adım ana iş parçacığını daha az tutar (aynı
   koşuda 25 MP resimde en uzun takılma 145 ms yerine 56 ms). Yön son adımda
   uygulanır. */
function kucultCiz(c, yon, beyazZemin) {
  var s = kucultOlcek(c.en, c.boy);
  var en = Math.max(1, Math.round(c.en * s)), boy = Math.max(1, Math.round(c.boy * s));
  var kaynak = c.kaynak, ke = c.en, kb = c.boy, ara = null;
  var yarila = !('imageSmoothingQuality' in kucultTuval(1, 1).ctx);
  var adim = function () {
    if (yarila && ke / 2 > en && kb / 2 > boy) {
      var y = kucultTuval(Math.round(ke / 2), Math.round(kb / 2));
      y.ctx.drawImage(kaynak, 0, 0, y.t.width, y.t.height);
      if (ara) ara.width = ara.height = 0;
      ara = kaynak = y.t;
      ke = y.t.width;
      kb = y.t.height;
      return kucultBekle().then(adim);
    }
    var yan = yon >= 5;
    var son = kucultTuval(yan ? boy : en, yan ? en : boy);
    if (beyazZemin) {
      son.ctx.fillStyle = '#fff';   // saydam nokta JPEG'de siyah çıkmasın
      son.ctx.fillRect(0, 0, son.t.width, son.t.height);
    }
    var d = [[1, 0, 0, 1, 0, 0], [-1, 0, 0, 1, en, 0], [-1, 0, 0, -1, en, boy], [1, 0, 0, -1, 0, boy],
      [0, 1, 1, 0, 0, 0], [0, 1, -1, 0, boy, 0], [0, -1, -1, 0, boy, en], [0, -1, 1, 0, 0, en]][(yon || 1) - 1];
    son.ctx.setTransform(d[0], d[1], d[2], d[3], d[4], d[5]);
    son.ctx.drawImage(kaynak, 0, 0, en, boy);
    if (ara) ara.width = ara.height = 0;
    return son.t;
  };
  return kucultBekle().then(adim);
}

function kucultKodla(tuval, tur, kalite) {
  return new Promise(function (tamam) {
    if (tuval.toBlob) {
      try { tuval.toBlob(function (b) { tamam(b); }, tur, kalite); return; } catch (e) { /* aşağıdaki yol */ }
    }
    try {
      var url = tuval.toDataURL(tur, kalite), virgul = url.indexOf(',');
      var ikili = atob(url.slice(virgul + 1)), b = new Uint8Array(ikili.length);
      for (var i = 0; i < ikili.length; i++) b[i] = ikili.charCodeAt(i);
      tamam(new Blob([b], { type: url.slice(5, url.indexOf(';')) }));
    } catch (e2) {
      tamam(null);
    }
  });
}
