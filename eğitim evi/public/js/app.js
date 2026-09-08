/* Eğitim Evi - arayüz mantığı
   Eski tarayıcılarda da çalışsın diye ?. ve ?? kullanılmadı. */
(function () {
  'use strict';

  var S = {
    token: null, user: null, children: [],
    meta: { cities: [], subjects: [] },
    page: 'ana',
    viewStudentId: null, viewStudentName: '',
    unread: 0,
    /* ödev filtreleri + sayfaya özel arama kancası */
    odevF: { ders: '', durum: '', bas: '', bit: '', mod: 'ogrenci' },
    odevHam: [],
    araHook: null,
    /* ders programı ekranı */
    programSinif: '', programSiniflar: [], programVeri: null, programUyari: '',
    programGun: 0, programGorunum: 'gun', cakismaAcik: false,
    sinifBilgi: null, dersBilgi: null,
    bekleyenKayit: null,
    rolListe: [], yetkiGruplari: [], ogretmenVarsayilan: [],
    odevHedef: null, odevSinif: '',
    rolSiniflar: [], rolDersler: []
  };

  /* ================= yardımcılar ================= */
  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function api(path, method, body) {
    var opt = { method: method || 'GET', headers: {} };
    if (S.token) opt.headers['Authorization'] = 'Bearer ' + S.token;
    if (body) { opt.headers['Content-Type'] = 'application/json'; opt.body = JSON.stringify(body); }
    return fetch('/api' + path, opt).then(function (r) {
      return r.text().then(function (t) {
        var j = {};
        try { j = t ? JSON.parse(t) : {}; } catch (e) { j = {}; }
        if (!r.ok) {
          if (r.status === 401 && S.token) { cikisYap(true); }
          var hata = new Error(j.error || ('Bir hata oluştu (' + r.status + ')'));
          /* Çağıran taraf ek alanlara bakabilsin (ör. "bu hesap zaten var"). */
          hata.durum = r.status;
          hata.veri = j;
          throw hata;
        }
        return j;
      });
    });
  }

  /* ================= ikonlar =================
     Emoji yerine çizgi ikonlar. Hepsi 24x24, currentColor kullanır;
     böylece bulunduğu yerin rengini ve boyutunu alır. */

  var IKONLAR = {
    ev: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M9.5 20v-6h5v6"/>',
    takvim: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    grafik: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="m7.5 15 3.5-4 3 2.5 4.5-6"/>',
    odev: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    sinav: '<path d="M9 3h6v4l4 10a2 2 0 0 1-1.9 2.7H6.9A2 2 0 0 1 5 17L9 7z"/><path d="M9 7h6"/>',
    ayar: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
    cikis: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    ogrenci: '<path d="M22 9 12 4 2 9l10 5z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/>',
    ogretmen: '<path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    veli: '<circle cx="8" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.6"/><path d="M2.5 20v-1.5A4.5 4.5 0 0 1 7 14h2a4.5 4.5 0 0 1 4.5 4.5V20"/><path d="M15 20v-1a3.6 3.6 0 0 1 3.6-3.6h.4a2.5 2.5 0 0 1 2.5 2.5V20"/>',
    okul: '<path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M10 21v-5h4v5"/><path d="M9.5 11h5"/>',
    sinif: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
    onay: '<path d="m4.5 12.5 5 5 10-11"/>',
    hayir: '<path d="M6 6 18 18M18 6 6 18"/>',
    uyari: '<path d="M10.3 4.3 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4.5M12 17.5h.01"/>',
    izinli: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12h7"/>',
    ara: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    ekle: '<path d="M12 5v14M5 12h14"/>',
    geri: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
    mudur: '<path d="M3 21h18"/><path d="M5 21v-7h14v7"/><path d="M8 14V9h8v5"/><circle cx="12" cy="5" r="2.2"/>',
    ders: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
    bildirim: '<path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9z"/><path d="M13.7 20a2 2 0 0 1-3.4 0"/>',
    profil: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21v-1.5A5.5 5.5 0 0 1 10 14h4a5.5 5.5 0 0 1 5.5 5.5V21"/>',
    indir: '<path d="M12 3v12"/><path d="m7.5 11 4.5 4.5 4.5-4.5"/><path d="M4 20h16"/>',
    anahtar: '<circle cx="7.5" cy="15.5" r="4"/><path d="m10.5 12.5 8-8"/><path d="m15 8 2.5 2.5M18 5l2.5 2.5"/>',
    kilit: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    saat: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/>',
    igne: '<path d="M12 21v-7"/><path d="M8 3h8l-1 6 3 3H6l3-3z"/>',
    telefon: '<path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 5.2 2 2 0 0 1 5.5 3z"/>',
    posta: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    soru: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.6 2.6 0 1 1 3.4 2.5c-.6.3-.9.8-.9 1.5v.5"/><path d="M12 17.5h.01"/>',
    grup: '<circle cx="12" cy="7" r="3.2"/><path d="M6 21v-1.5A4.5 4.5 0 0 1 10.5 15h3a4.5 4.5 0 0 1 4.5 4.5V21"/><path d="M3.5 13.5A3 3 0 0 1 6 12M20.5 13.5A3 3 0 0 0 18 12"/>',
    kutu: '<path d="M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 8 5 3h14l2 5"/><path d="M10 12h4"/>',
    belge: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>'
  };

  /* ad: ikon adı, ek: ek CSS sınıfı */
  function ik(ad, ek) {
    var yol = IKONLAR[ad];
    if (!yol) return '';
    return '<svg class="ikon' + (ek ? ' ' + ek : '') + '" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + yol + '</svg>';
  }

  function tarih(iso) {
    if (!iso) return '-';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return esc(iso);
    var p = function (n) { return n < 10 ? '0' + n : '' + n; };
    return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear();
  }
  function tarihSaat(iso) {
    if (!iso) return '-';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return esc(iso);
    var p = function (n) { return n < 10 ? '0' + n : '' + n; };
    return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  var HAFTA_GUNLERI = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba',
    'Perşembe', 'Cuma', 'Cumartesi'];
  var AY_ADI = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  /* "4 Eylül 2026, Cuma" — hangi güne denk geldiği bir bakışta görünsün. */
  function tarihGun(iso) {
    if (!iso) return '-';
    var d = new Date(String(iso).length === 10 ? iso + 'T00:00:00' : iso);
    if (isNaN(d.getTime())) return esc(iso);
    return d.getDate() + ' ' + AY_ADI[d.getMonth()] + ' ' + d.getFullYear() +
      ', ' + HAFTA_GUNLERI[d.getDay()];
  }

  /* Ödev satırlarında: "4 Eylül 2026, Cuma · 12:00" */
  function tarihGunSaat(iso, saat) {
    var t = tarihGun(iso);
    return saat ? t + ' · ' + esc(saat) : t;
  }

  /* Yalnızca gün adı: "Cuma" */
  function gunAdi(iso) {
    if (!iso) return '';
    var d = new Date(String(iso).length === 10 ? iso + 'T00:00:00' : iso);
    return isNaN(d.getTime()) ? '' : HAFTA_GUNLERI[d.getDay()];
  }

  /* Teslim anı geçti mi? Saat de hesaba katılır. */
  function teslimGecti(iso, saat) {
    if (!iso) return false;
    var d = new Date(iso + 'T' + (saat || '12:00') + ':00');
    return !isNaN(d.getTime()) && d.getTime() < Date.now();
  }

  function gunFarki(iso) {
    if (!iso) return null;
    var d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return Math.ceil((d - new Date()) / 86400000);
  }

  /* Aramayı şapkasız/noktasız yazana da çalıştırmak için harfleri sadeleştirir:
     "ögretmen", "OGRETMEN", "öğretmen" hepsi aynı sonucu verir. */
  var TR_SADE = {
    'ı': 'i', 'İ': 'i', 'I': 'i', 'ş': 's', 'Ş': 's', 'ğ': 'g', 'Ğ': 'g',
    'ü': 'u', 'Ü': 'u', 'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c',
    'â': 'a', 'Â': 'a', 'î': 'i', 'Î': 'i', 'û': 'u', 'Û': 'u'
  };
  function nrm(s) {
    s = String(s === null || s === undefined ? '' : s);
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      out += (TR_SADE[c] !== undefined) ? TR_SADE[c] : c;
    }
    return out.toLowerCase().trim();
  }

  var SONUC = {
    yapti: { ad: 'Yaptı', renk: 'yesil' },
    yapmadi: { ad: 'Yapmadı', renk: 'kirmizi' },
    eksik: { ad: 'Eksik', renk: 'turuncu' },
    izinli: { ad: 'Gelmedi (izinli)', renk: 'gri' },
    gelmedi: { ad: 'Gelmedi (izinsiz)', renk: 'bordo' }
  };

  var ROL_AD = { student: 'Öğrenci', parent: 'Veli', teacher: 'Öğretmen', principal: 'Müdür', admin: 'Yönetici' };

  /* ================= mesaj / modal ================= */
  function mesajGoster(hedef, tur, metin) {
    var el = $(hedef);
    if (!el) return;
    el.innerHTML = '<div class="msg ' + tur + '">' + esc(metin) + '</div>';
    if (tur === 'iyi') setTimeout(function () { if (el) el.innerHTML = ''; }, 6000);
  }

  /* Oturum anahtarini adres satirina koyamayiz: tarayici gecmisine ve sunucu
     gunlugune duser. Dosyayi baslikla alip yerel baglantiya cevirip indiriyoruz. */
  function dosyaIndir(yol, ad) {
    return fetch(yol, { headers: { 'Authorization': 'Bearer ' + S.token } })
      .then(function (r) {
        if (r.ok) return r.blob();
        return r.text().then(function (t) {
          var m = 'İndirilemedi (' + r.status + ')';
          try { m = JSON.parse(t).error || m; } catch (e) { /* düz metin geldi */ }
          throw new Error(m);
        });
      })
      .then(function (blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = ad;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      });
  }

  function modalKapat() { $('modalKok').innerHTML = ''; }

  function modalAc(baslik, govde, altHtml) {
    $('modalKok').innerHTML =
      '<div class="perde" data-perde="1"><div class="modal">' +
      '<h3>' + esc(baslik) + '</h3>' +
      '<div id="modalGovde">' + govde + '</div>' +
      '<div class="modal-alt">' + (altHtml || '<button class="btn gri" data-act="modal-kapat">Kapat</button>') + '</div>' +
      '</div></div>';
  }

  /* ================= uygulama olarak kurma (PWA) =================
     Tarayıcı "kurulabilir" dediğinde beforeinstallprompt olayı gelir,
     onu saklayıp kendi butonumuza bağlıyoruz. Servis işçisi yalnızca
     güvenli bağlamda (https:// ya da localhost) çalışır; LAN üzerinden
     http:// ile girildiğinde tarayıcı kurulum önermez, kullanıcı yine de
     menüden "Ana ekrana ekle" diyebilir. */

  var kurulumOlayi = null;

  function kurButonu(goster) {
    var b = $('btnKur');
    if (b) b.style.display = goster ? '' : 'none';
  }

  function pwaKur() {
    if ('serviceWorker' in navigator && window.isSecureContext) {
      var kaydet = function () {
        navigator.serviceWorker.register('/sw.js')['catch'](function (e) {
          /* Kayıt başarısızsa uygulama normal çalışmaya devam eder. */
          console.warn('Servis işçisi kaydedilemedi:', e && e.message);
        });
      };
      /* load olayı çoktan geçmiş olabilir; o durumda beklemeden kaydet. */
      if (document.readyState === 'complete') kaydet();
      else window.addEventListener('load', kaydet);
    }

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      kurulumOlayi = e;
      kurButonu(true);
    });

    window.addEventListener('appinstalled', function () {
      kurulumOlayi = null;
      kurButonu(false);
      try { localStorage.setItem('ee_kuruldu', '1'); } catch (x) {}
    });

    var b = $('btnKur');
    if (!b) return;
    b.onclick = function () {
      if (kurulumOlayi) {
        kurulumOlayi.prompt();
        kurulumOlayi.userChoice.then(function () {
          kurulumOlayi = null;
          kurButonu(false);
        });
        return;
      }
      kurulumYardimi();
    };
  }

  /* Tarayıcı kendiliğinden kurulum önermiyorsa elle nasıl yapılacağını anlat. */
  function kurulumYardimi() {
    var ua = navigator.userAgent || '';
    var iosMu = /iPhone|iPad|iPod/i.test(ua);
    var guvenli = window.isSecureContext;

    var h = '';
    if (!guvenli) {
      h += '<div class="msg bilgi">Site <b>http://</b> üzerinden açıldığı için tarayıcı ' +
        'otomatik kurulum önermiyor. Yine de ana ekrana ekleyebilirsin.</div>';
    }
    if (iosMu) {
      h += '<p><b>iPhone / iPad (Safari):</b></p><ol style="margin:0 0 12px 18px">' +
        '<li>Alttaki <b>Paylaş</b> düğmesine bas</li>' +
        '<li><b>Ana Ekrana Ekle</b>yi seç</li>' +
        '<li><b>Ekle</b>ye bas</li></ol>';
    } else {
      h += '<p><b>Android (Chrome):</b></p><ol style="margin:0 0 12px 18px">' +
        '<li>Sağ üstteki <b>⋮</b> menüsüne bas</li>' +
        '<li><b>Uygulamayı yükle</b> ya da <b>Ana ekrana ekle</b>yi seç</li></ol>' +
        '<p><b>Bilgisayar (Chrome / Edge):</b></p><ol style="margin:0 0 12px 18px">' +
        '<li>Adres çubuğunun sağındaki <b>kurulum simgesine</b> bas</li>' +
        '<li>Ya da menüden <b>Uygulamayı yükle</b>yi seç</li></ol>';
    }
    h += '<div class="hint">Kurunca uygulama ayrı bir simgeyle açılır, tarayıcı ' +
      'çubuğu görünmez.</div>';
    modalAc('Uygulamayı yükle', h);
  }

  /* ================= giriş ekranı ================= */

  /* Kayıt formundaki bot doğrulama sorusu. Cevap sunucuda tutulur,
     istemciye hiç gönderilmez. */
  /* Oturum anahtarı nerede tutulacak?
       "Beni hatırla" işaretliyse localStorage (tarayıcı kapansa da kalır),
       değilse sessionStorage (sekme kapanınca silinir).
       "Hiçbir şey kaydetme" seçiliyse hiçbir yere yazılmaz, sadece bellekte kalır. */
  function tokenSakla(token) {
    var kip = 'oturum';
    var kutu = $('gHatirla');
    var hicbiri = $('gKaydetme');
    if (hicbiri && hicbiri.checked) kip = 'yok';
    else if (kutu && kutu.checked) kip = 'kalici';

    try {
      localStorage.removeItem('ee_token');
      sessionStorage.removeItem('ee_token');
      if (kip === 'kalici') localStorage.setItem('ee_token', token);
      else if (kip === 'oturum') sessionStorage.setItem('ee_token', token);
      localStorage.setItem('ee_hatirla', kip);
    } catch (e) { /* gizli sekmede yazılamaz, sorun değil */ }
  }

  function tokenOku() {
    try {
      return localStorage.getItem('ee_token') || sessionStorage.getItem('ee_token');
    } catch (e) { return null; }
  }

  function tokenSil() {
    try {
      localStorage.removeItem('ee_token');
      sessionStorage.removeItem('ee_token');
    } catch (e) { }
  }

  var botSoru = { id: '', yukleniyor: false };      // kayıt formu
  var girisSoru = { id: '', yukleniyor: false };    // giriş formu
  var ilceHaritasi = {};        // { "Ankara": ["Çankaya", ...] }
  var seciliOkul = null;        // müdürün MEB listesinden seçtiği okul
  var okulAramaSayaci = null;   // yazarken bekletme (debounce)

  function botSoruYukle() {
    if (botSoru.yukleniyor) return Promise.resolve();
    botSoru.yukleniyor = true;
    var etiket = $('kBotSoru');
    if (etiket) etiket.textContent = 'yükleniyor...';
    return api('/challenge').then(function (d) {
      botSoru.id = d.id;
      if (etiket) etiket.textContent = d.soru;
      if ($('kBot')) $('kBot').value = '';
      botSoru.yukleniyor = false;
    })['catch'](function () {
      botSoru.id = '';
      if (etiket) etiket.textContent = 'soru alınamadı';
      botSoru.yukleniyor = false;
    });
  }

  /* Doğrulama sorusu yalnızca gerektiğinde görünür. */
  function girisSoruGoster(goster) {
    var alan = $('gBot') ? $('gBot').closest('.bot-alan') : null;
    if (!alan) return;
    alan.hidden = !goster;
    if (goster && !girisSoru.id) girisSoruYukle();
  }

  function girisSoruYukle() {
    if (girisSoru.yukleniyor) return Promise.resolve();
    girisSoru.yukleniyor = true;
    var etiket = $('gBotSoru');
    if (etiket) etiket.textContent = 'yükleniyor...';
    return api('/challenge').then(function (d) {
      girisSoru.id = d.id;
      if (etiket) etiket.textContent = d.soru;
      if ($('gBot')) $('gBot').value = '';
      girisSoru.yukleniyor = false;
    })['catch'](function () {
      girisSoru.id = '';
      if (etiket) etiket.textContent = 'soru alınamadı';
      girisSoru.yukleniyor = false;
    });
  }

  /* Okul hesabı önceden açılmışsa öğrenciyi bilgilendirir. */
  function mevcutHesapUyarisi(veri, govde) {
    var h = '<div class="msg bilgi"><b>' + esc(govde.fullName) + '</b> adına bu okulda ' +
      'zaten bir hesap görünüyor.</div>';

    if (veri.okulActi) {
      h += '<p>Bu hesabı <b>okul yönetimi</b> açmış. Şifren sana verilmiş olmalı — ' +
        'yeni hesap açmana gerek yok.</p>';
    } else {
      h += '<p>Daha önce kendin kaydolmuş olabilirsin.</p>';
    }

    if (veri.kullaniciAdi) {
      h += '<div class="satir"><div class="buyu"><div class="alt">Var olan kullanıcı adı</div>' +
        '<div class="ad">' + esc(veri.kullaniciAdi) + '</div></div></div>';
    }

    if (veri.not) {
      h += '<div class="mudur-notu"><div class="baslik">Okul yönetiminin notu</div>' +
        '<div class="metin">' + esc(veri.not) + '</div></div>';
    }

    h += '<p class="hint">Adaşın olabilir; gerçekten yeni hesap gerekiyorsa ' +
      '"Yine de aç" ile devam et.</p>';

    S.bekleyenKayit = govde;
    modalAc('Bu hesap zaten var', h,
      '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
      '<button class="btn" data-act="kayit-yinede">Yine de aç</button>');
  }

  function authKur() {
    var giris = $('formGiris'), kayit = $('formKayit');

    /* Sekme geçişi: eski formu kısaca soldurup yenisini kaydırarak getirir.
       Hareketi azalt ayarı açıksa animasyon atlanır. */
    var gecisSuruyor = false;
    function sekmeGec(gosterilecek, gizlenecek, sekmeAc, sekmeKapa, sonra) {
      if (gecisSuruyor) return;
      var azalt = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      sekmeAc.classList.add('on');
      sekmeKapa.classList.remove('on');
      $('authMesaj').innerHTML = '';

      if (azalt) {
        gizlenecek.style.display = 'none';
        gosterilecek.style.display = '';
        if (sonra) sonra();
        return;
      }

      gecisSuruyor = true;
      gizlenecek.classList.add('form-cikis');
      setTimeout(function () {
        gizlenecek.classList.remove('form-cikis');
        gizlenecek.style.display = 'none';
        gosterilecek.style.display = '';
        gosterilecek.classList.add('form-giris');
        setTimeout(function () {
          gosterilecek.classList.remove('form-giris');
          gecisSuruyor = false;
        }, 240);
        if (sonra) sonra();
      }, 140);
    }

    $('tabGiris').onclick = function () {
      sekmeGec(giris, kayit, this, $('tabKayit'));
    };
    $('tabKayit').onclick = function () {
      var self = this;
      sekmeGec(kayit, giris, self, $('tabGiris'), function () {
        if (!botSoru.id) botSoruYukle();
      });
    };
    if ($('kBotYenile')) $('kBotYenile').onclick = function () { botSoruYukle(); };
    if ($('gBotYenile')) $('gBotYenile').onclick = function () { girisSoruYukle(); };
    /* Soru alanı başta gizli; sunucu "gerekli" derse açılır. */
    girisSoruGoster(false);

    api('/meta').then(function (m) {
      S.meta = m;
      var br = $('kBrans');
      for (var j = 0; j < m.subjects.length; j++) {
        br.insertAdjacentHTML('beforeend', '<option value="' + esc(m.subjects[j]) + '">' + esc(m.subjects[j]) + '</option>');
      }
    })['catch'](function () { });

    /* İl / ilçe listesi resmi MEB okul verisinden gelir; okul listesi
       yüklenmemişse /api/meta'daki il listesine düşülür. */
    api('/okullar/iller').then(function (d) {
      ilceHaritasi = {};
      var il = $('kIl');
      var h = '<option value="">Seç...</option>';
      for (var i = 0; i < d.iller.length; i++) {
        h += '<option value="' + esc(d.iller[i].ad) + '">' + esc(d.iller[i].ad) + '</option>';
        ilceHaritasi[d.iller[i].ad] = d.iller[i].ilceler;
      }
      il.innerHTML = h;

      var tipSec = $('kOkulTip');
      if (tipSec) {
        var t = '<option value="">Tüm türler</option>';
        for (var k = 0; k < d.tipler.length; k++) {
          t += '<option value="' + esc(d.tipler[k]) + '">' + esc(d.tipler[k]) + '</option>';
        }
        tipSec.innerHTML = t;
      }
      var ipucu = $('kOkulIpucu');
      if (ipucu) {
        ipucu.textContent = d.toplam.toLocaleString('tr-TR') +
          ' okul aranabilir. İl seçersen sadece o ilde, seçmezsen Türkiye genelinde arar.';
      }
    })['catch'](function () {
      /* Okul listesi yoksa en azından il seçimi çalışsın. */
      api('/meta').then(function (m) {
        var il = $('kIl');
        var h = '<option value="">Seç...</option>';
        for (var i = 0; i < m.cities.length; i++) {
          h += '<option value="' + esc(m.cities[i]) + '">' + esc(m.cities[i]) + '</option>';
        }
        il.innerHTML = h;
      })['catch'](function () { });
    });

    function rolDegisti() {
      var r = $('kRol').value;
      $('kMudurAlan').style.display = r === 'principal' ? '' : 'none';
      $('kOkulSecAlan').style.display = (r === 'teacher' || r === 'student') ? '' : 'none';
      $('kBransAlan').style.display = r === 'teacher' ? '' : 'none';
      $('kSinifAlan').style.display = r === 'student' ? '' : 'none';
      $('kYerAlan').style.display = r === 'parent' ? 'none' : '';
    }
    $('kRol').onchange = rolDegisti;
    rolDegisti();

    /* İl değişince: ilçe listesini doldur, kayıtlı okulları tazele,
       müdür arıyorsa aramayı yeni ile göre tekrarla. */
    $('kIl').onchange = function () {
      ilceleriDoldur(this.value);
      kayitliOkullariYukle(this.value);
      if ($('kRol').value === 'principal') okulAramaBaslat(0);
    };
    $('kIlce').onchange = function () {
      if ($('kRol').value === 'principal') okulAramaBaslat(0);
    };

    function ilceleriDoldur(il) {
      var sec = $('kIlce');
      if (!sec) return;
      var liste = ilceHaritasi[il] || [];
      if (!il) { sec.innerHTML = '<option value="">Önce il seç...</option>'; return; }
      if (!liste.length) { sec.innerHTML = '<option value="">Merkez</option>'; return; }
      var h = '<option value="">Tümü / seç...</option>';
      for (var i = 0; i < liste.length; i++) {
        h += '<option value="' + esc(liste[i]) + '">' + esc(liste[i]) + '</option>';
      }
      sec.innerHTML = h;
    }

    /* Öğretmen ve öğrenci, müdürü onaylanmış okullar arasından seçer. */
    function kayitliOkullariYukle(il) {
      var sec = $('kOkulId');
      if (!sec) return;
      if (!il) { sec.innerHTML = '<option value="">Önce il seç...</option>'; return; }
      sec.innerHTML = '<option value="">Yükleniyor...</option>';
      api('/schools?city=' + encodeURIComponent(il)).then(function (d) {
        if (!d.schools.length) {
          sec.innerHTML = '<option value="">Bu ilde kayıtlı okul yok</option>';
          return;
        }
        var h = '<option value="">Seç...</option>';
        for (var i = 0; i < d.schools.length; i++) {
          var o = d.schools[i];
          h += '<option value="' + esc(o.id) + '">' + esc(o.name) + ' — ' + esc(o.district) + '</option>';
        }
        sec.innerHTML = h;
      })['catch'](function () { sec.innerHTML = '<option value="">Okullar yüklenemedi</option>'; });
    }

    /* ---- müdür: MEB listesinde okul arama ---- */

    function okulAramaBaslat(gecikme) {
      if (okulAramaSayaci) clearTimeout(okulAramaSayaci);
      okulAramaSayaci = setTimeout(okulAramaYap, gecikme === undefined ? 280 : gecikme);
    }

    function okulAramaYap() {
      var kutu = $('kOkulAra');
      var sonucKap = $('kOkulSonuc');
      if (!kutu || !sonucKap) return;

      var sorgu = kutu.value.trim();
      var il = $('kIl').value;
      var ilce = $('kIlce').value;
      var tip = $('kOkulTip') ? $('kOkulTip').value : '';

      if (!sorgu && !il) { sonucKap.innerHTML = ''; return; }

      var adres = '/okullar/ara?limit=25' +
        '&q=' + encodeURIComponent(sorgu) +
        '&il=' + encodeURIComponent(il) +
        '&ilce=' + encodeURIComponent(ilce) +
        '&tip=' + encodeURIComponent(tip);

      sonucKap.innerHTML = '<div class="okul-bilgi">Aranıyor...</div>';
      api(adres).then(function (d) {
        if (!d.okullar.length) {
          sonucKap.innerHTML = '<div class="okul-bilgi">Sonuç yok. Okulun adının bir ' +
            'kelimesini yazmayı dene (örnek: sadece "Renk"). Yine çıkmazsa aşağıdaki ' +
            '<b>Okulum listede yok</b> bölümünden adını kendin yazabilirsin.</div>';
          return;
        }
        var h = '';
        if (d.toplam > d.okullar.length) {
          h += '<div class="okul-bilgi">' + d.toplam.toLocaleString('tr-TR') +
            ' sonuçtan ilk ' + d.okullar.length + ' tanesi gösteriliyor. Aramayı daraltabilirsin.</div>';
        }
        for (var i = 0; i < d.okullar.length; i++) {
          var o = d.okullar[i];
          h += '<button type="button" class="okul-satir" data-okul-id="' + esc(o.id) + '"' +
            ' data-okul-ad="' + esc(o.ad) + '" data-okul-il="' + esc(o.il) + '"' +
            ' data-okul-ilce="' + esc(o.ilce) + '" data-okul-tip="' + esc(o.tip) + '">' +
            '<span class="ad">' + esc(o.ad) +
            (o.ozel ? '<span class="ozel-rozet">Özel</span>' : '') + '</span>' +
            '<span class="yer">' + esc(o.il) + ' / ' + esc(o.ilce) + ' · ' +
            esc(o.resmiTur || o.tip) + '</span>' +
            '</button>';
        }
        sonucKap.innerHTML = h;
      })['catch'](function (err) {
        sonucKap.innerHTML = '<div class="okul-bilgi">Arama yapılamadı: ' + esc(err.message) + '</div>';
      });
    }

    function okulSec(btn) {
      seciliOkul = {
        id: btn.getAttribute('data-okul-id'),
        ad: btn.getAttribute('data-okul-ad'),
        il: btn.getAttribute('data-okul-il'),
        ilce: btn.getAttribute('data-okul-ilce'),
        tip: btn.getAttribute('data-okul-tip')
      };
      $('kOkulSonuc').innerHTML = '';
      $('kOkulAra').value = '';
      var kap = $('kOkulSecili');
      kap.style.display = '';
      kap.innerHTML = '<div class="secili-ic"><div class="buyu">' +
        '<div class="ad">' + esc(seciliOkul.ad) + '</div>' +
        '<div class="yer">' + esc(seciliOkul.il) + ' / ' + esc(seciliOkul.ilce) + ' · ' + esc(seciliOkul.tip) + '</div>' +
        '</div><button type="button" class="btn gri kucuk" id="kOkulKaldir">Değiştir</button></div>';
      $('kOkulKaldir').onclick = okulSecimiTemizle;
      /* Seçilen okulun ili/ilçesi forma da yansısın. */
      if ($('kIl').value !== seciliOkul.il) {
        $('kIl').value = seciliOkul.il;
        ilceleriDoldur(seciliOkul.il);
      }
      $('kIlce').value = seciliOkul.ilce;
      if ($('kOkulAd')) $('kOkulAd').value = '';
    }

    function okulSecimiTemizle() {
      seciliOkul = null;
      var kap = $('kOkulSecili');
      kap.style.display = 'none';
      kap.innerHTML = '';
      $('kOkulAra').focus();
    }

    if ($('kOkulAra')) {
      $('kOkulAra').oninput = function () { okulAramaBaslat(); };
      $('kOkulAra').onkeydown = function (e) {
        if (e.key === 'Enter') { e.preventDefault(); okulAramaBaslat(0); }
      };
    }
    if ($('kOkulTip')) $('kOkulTip').onchange = function () { okulAramaBaslat(0); };

    /* Öğrenci seçilince "onayı veli verir" notunu göster. */
    function kvkkNotGuncelle() {
      var not = $('kvkkVeliNot');
      if (not) not.style.display = ($('kRol').value === 'student') ? '' : 'none';
    }
    $('kRol').addEventListener('change', kvkkNotGuncelle);
    kvkkNotGuncelle();
    if ($('kOkulSonuc')) {
      $('kOkulSonuc').onclick = function (e) {
        var btn = e.target.closest ? e.target.closest('.okul-satir') : null;
        if (btn) okulSec(btn);
      };
    }

    /* ---- şifremi unuttum ---- */
    var sifreSoru = { id: '' };

    function sifreSoruYukle() {
      var etiket = $('sBotSoru');
      if (etiket) etiket.textContent = 'yükleniyor...';
      return api('/challenge').then(function (d) {
        sifreSoru.id = d.id;
        if (etiket) etiket.textContent = d.soru;
        if ($('sBot')) $('sBot').value = '';
      })['catch'](function () {
        sifreSoru.id = '';
        if (etiket) etiket.textContent = 'soru alınamadı';
      });
    }

    /* Giriş ekranındaki panelleri tek yerden yönetiyoruz; ikisi aynı anda
       açık kalmasın diye hepsini kapatıp isteneni açıyoruz. */
    function authPanel(hangi) {
      var paneller = ['formGiris', 'formKayit', 'kodEkran', 'sifreEkran', 'yeniSifreEkran'];
      for (var i = 0; i < paneller.length; i++) {
        var el = $(paneller[i]);
        if (el) el.style.display = (paneller[i] === hangi) ? '' : 'none';
      }
      var sekme = document.querySelector('.tabs');
      if (sekme) sekme.style.display = (hangi === 'formGiris' || hangi === 'formKayit') ? '' : 'none';
    }

    function sifreEkraniAc() {
      authPanel('sifreEkran');
      $('authMesaj').innerHTML = '';
      $('sEmail').value = $('gEmail').value || '';
      sifreSoruYukle();
      $('sEmail').focus();
    }

    function yeniSifreEkraniAc(anahtar) {
      yeniSifreAnahtar = anahtar;
      authPanel('yeniSifreEkran');
      $('authMesaj').innerHTML = '';
      $('ySifre1').value = '';
      $('ySifre2').value = '';
      $('ySifre1').focus();
    }

    function girisEkraninaDon() {
      yeniSifreAnahtar = '';
      /* Sıfırlama anahtarı adres çubuğunda kalmasın. */
      if (/yeni-sifre/.test(location.hash)) {
        history.replaceState(null, '', location.pathname + location.search);
      }
      authPanel('formGiris');
      $('gSifre').value = '';
    }

    $('btnSifremiUnuttum').onclick = sifreEkraniAc;
    /* Açılış kodu authKur'un dışında; ekranı oradan da açabilmek için köprü. */
    yeniSifreEkraniAcDisaridan = yeniSifreEkraniAc;
    $('sVazgec').onclick = function () { $('authMesaj').innerHTML = ''; girisEkraninaDon(); };
    $('yVazgec').onclick = function () { $('authMesaj').innerHTML = ''; girisEkraninaDon(); };
    $('sBotYenile').onclick = function () { sifreSoruYukle(); };

    $('formSifreUnuttum').onsubmit = function (e) {
      e.preventDefault();
      var b = this.querySelector('button[type=submit]');
      b.disabled = true;
      api('/sifre-unuttum', 'POST', {
        email: $('sEmail').value,
        challengeId: sifreSoru.id,
        challengeAnswer: $('sBot').value
      })
        .then(function (d) {
          b.disabled = false;
          girisEkraninaDon();
          mesajGoster('authMesaj', 'iyi', d.message);
        })['catch'](function (err) {
          b.disabled = false;
          mesajGoster('authMesaj', 'hata', err.message);
          sifreSoruYukle();
        });
    };

    $('formYeniSifre').onsubmit = function (e) {
      e.preventDefault();
      if ($('ySifre1').value !== $('ySifre2').value) {
        mesajGoster('authMesaj', 'hata', 'İki şifre birbirini tutmuyor.');
        return;
      }
      var b = this.querySelector('button[type=submit]');
      b.disabled = true;
      api('/sifre-yenile', 'POST', {
        token: yeniSifreAnahtar,
        password: $('ySifre1').value
      })
        .then(function (d) {
          b.disabled = false;
          girisEkraninaDon();
          mesajGoster('authMesaj', 'iyi', d.message);
        })['catch'](function (err) {
          b.disabled = false;
          mesajGoster('authMesaj', 'hata', err.message);
        });
    };

    /* ---- iki adımlı giriş ---- */
    var kodDurum = { id: '', sayac: null };

    function kodEkraniAc(d) {
      authPanel('kodEkran');
      $('authMesaj').innerHTML = '';
      kodDurum.id = d.challengeId;
      $('kodAciklama').textContent = d.mesaj || 'Giriş kodunu gir.';
      $('kodGiris').value = '';
      $('kodGiris').focus();
      tekrarSayaciBaslat(60);
    }

    function kodEkraniKapat() {
      if (kodDurum.sayac) { clearInterval(kodDurum.sayac); kodDurum.sayac = null; }
      kodDurum.id = '';
      authPanel('formGiris');
      $('gSifre').value = '';
    }

    /* "Tekrar gönder" 60 saniye kilitli kalır; sunucu da aynı süreyi uygular. */
    function tekrarSayaciBaslat(saniye) {
      var btn = $('kodTekrar');
      var kalan = saniye;
      if (kodDurum.sayac) clearInterval(kodDurum.sayac);
      btn.disabled = true;
      btn.textContent = 'Tekrar gönder (' + kalan + ')';
      kodDurum.sayac = setInterval(function () {
        kalan--;
        if (kalan <= 0) {
          clearInterval(kodDurum.sayac);
          kodDurum.sayac = null;
          btn.disabled = false;
          btn.textContent = 'Kodu tekrar gönder';
          return;
        }
        btn.textContent = 'Tekrar gönder (' + kalan + ')';
      }, 1000);
    }

      function oturumuAc(d) {
      S.token = d.token;
      tokenSakla(d.token);
      S.user = d.user; S.children = d.children || [];
      if (d.user.status === 'pending') {
        S.token = null;
        tokenSil();
        kodEkraniKapat();
        mesajGoster('authMesaj', 'bilgi', 'Hesabın henüz onaylanmadı. Onaylanınca giriş yapabilirsin.');
        return;
      }
      kodEkraniKapat();
      uygulamayiBaslat();
    }

    giris.onsubmit = function (e) {
      e.preventDefault();
      var b = giris.querySelector('button');
      b.disabled = true;
      api('/login', 'POST', {
        email: $('gEmail').value,
        password: $('gSifre').value,
        challengeId: girisSoru.id,
        challengeAnswer: $('gBot') ? $('gBot').value : ''
      })
        .then(function (d) {
          b.disabled = false;
          girisSoru.id = '';
          girisSoruGoster(false);
          if (d.twoFactor) { kodEkraniAc(d); return; }
          oturumuAc(d);   /* 2FA kapatılırsa doğrudan giriş yolu açık kalsın */
        })['catch'](function (err) {
          mesajGoster('authMesaj', 'hata', err.message);
          /* Sunucu soru istediyse alanı aç ve taze soru getir. */
          if (err.veri && err.veri.soruGerekli) {
            girisSoruGoster(true);
            girisSoru.id = '';
            girisSoruYukle();
          }
          b.disabled = false;
        });
    };

    $('formKod').onsubmit = function (e) {
      e.preventDefault();
      var b = $('formKod').querySelector('button[type=submit]');
      var kod = $('kodGiris').value.trim();
      if (!/^[0-9]{6}$/.test(kod)) {
        mesajGoster('authMesaj', 'hata', 'Kod 6 rakamdan oluşmalı.');
        return;
      }
      b.disabled = true;
      api('/login/dogrula', 'POST', { challengeId: kodDurum.id, code: kod })
        .then(function (d) { b.disabled = false; oturumuAc(d); })
        ['catch'](function (err) {
          mesajGoster('authMesaj', 'hata', err.message);
          $('kodGiris').value = '';
          $('kodGiris').focus();
          b.disabled = false;
          /* Oturum düştüyse baştan giriş gerekiyor. */
          if (/bulunamadı|baştan|süresi doldu/i.test(err.message)) kodEkraniKapat();
        });
    };

    $('kodTekrar').onclick = function () {
      var btn = this;
      btn.disabled = true;
      api('/login/tekrar', 'POST', { challengeId: kodDurum.id })
        .then(function (d) {
          kodDurum.id = d.challengeId;
          $('kodAciklama').textContent = d.mesaj || 'Yeni kod gönderildi.';
          mesajGoster('authMesaj', 'iyi', 'Yeni kod gönderildi.');
          tekrarSayaciBaslat(60);
        })['catch'](function (err) {
          mesajGoster('authMesaj', 'hata', err.message);
          btn.disabled = false;
        });
    };

    $('kodVazgec').onclick = function () {
      kodEkraniKapat();
      $('authMesaj').innerHTML = '';
    };

    /* Sadece rakam kabul et, 6 hane dolunca kendiliğinden doğrula. */
    $('kodGiris').oninput = function () {
      this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
      if (this.value.length === 6) $('formKod').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    };

    kayit.onsubmit = function (e) {
      e.preventDefault();
      var r = $('kRol').value;
      var body = {
        role: r,
        fullName: $('kAd').value,
        email: $('kEmail').value,
        password: $('kSifre').value,
        city: $('kIl').value,
        district: $('kIlce').value,
        address: $('kAdres').value,
        challengeId: botSoru.id,
        challengeAnswer: $('kBot') ? $('kBot').value : ''
      };
      if (r === 'principal') {
        if (seciliOkul) body.mebSchoolId = seciliOkul.id;
        else body.schoolName = $('kOkulAd') ? $('kOkulAd').value : '';
      }
      if (r === 'teacher') { body.schoolId = $('kOkulId').value; body.branch = $('kBrans').value; }
      if (r === 'student') { body.schoolId = $('kOkulId').value; body.grade = $('kSinif').value; }

      var b = kayit.querySelector('button[type=submit]');
      b.disabled = true;
      body.kvkkOnay = $('kKvkk') ? $('kKvkk').checked : false;
      body.phone = $('kTelefon') ? $('kTelefon').value : '';
      body.address = $('kAdres') ? $('kAdres').value : '';
      api('/register', 'POST', body).then(function (d) {
        mesajGoster('authMesaj', 'iyi', d.message);
        $('tabGiris').click();
        $('authMesaj').innerHTML = '<div class="msg iyi">' + esc(d.message) + '</div>';
        $('gEmail').value = body.email;
        kayit.reset(); rolDegisti();
        botSoru.id = ''; botSoruYukle();
        b.disabled = false;
      })['catch'](function (err) {
        b.disabled = false;
        /* Sunucu "bu isimde hesap var" derse öğrenciye müdürün notunu göster. */
        if (err.veri && err.veri.mevcutHesap) {
          mevcutHesapUyarisi(err.veri, body);
          return;
        }
        mesajGoster('authMesaj', 'hata', err.message);
        /* Soru tek kullanımlık olabilir; her hatadan sonra yenisini getir. */
        botSoruYukle();
      });
    };
  }

  /* ================= menü ================= */
  function navTanim() {
    var u = S.user;
    if (!u) return [];
    /* Öğrenci portalını veli, müdür ve öğretmen açabilir; geri dönüş
       hedefi rolüne göre değişir. */
    if (S.viewStudentId && u.role !== 'student') {
      var geriAd = u.role === 'parent' ? 'Çocuk Listesi' : 'Öğrenci Listesi';
      return [
        { k: 'ana', g: 'ev', ad: 'Ana Sayfa' },
        { k: 'geri-veli', g: 'geri', ad: geriAd },
        { ayrac: 1 },
        { baslik: S.viewStudentName },
        { k: 'programim', g: 'takvim', ad: 'Ders Programı' },
        { k: 'takvim', g: 'takvim', ad: 'Takvimi' },
        { k: 'ilerleyisim', g: 'grafik', ad: 'İlerleyişi' },
        { k: 'odevler', g: 'odev', ad: 'Ödevleri' },
        { k: 'sinavlarim', g: 'sinav', ad: 'Sınavları' },
        { k: 'devamsizligim', g: 'izinli', ad: 'Devamsızlığı' }
      ];
    }
    if (u.role === 'student') {
      return [
        { k: 'ana', g: 'ev', ad: 'Ana Sayfa' },
        { k: 'mesajlar', g: 'posta', ad: 'Mesajlar' },
        { k: 'takvim', g: 'takvim', ad: 'Takvim' },
        { k: 'devamsizligim', g: 'izinli', ad: 'Devamsızlığım' },
        { k: 'programim', g: 'takvim', ad: 'Ders Programı' },
        { k: 'ilerleyisim', g: 'grafik', ad: 'İlerleyişim' },
        { k: 'odevler', g: 'odev', ad: 'Ödevler' },
        { k: 'sinavlarim', g: 'sinav', ad: 'Sınavlarım' }
      ];
    }
    if (u.role === 'parent') {
      return [
        { k: 'ana', g: 'ev', ad: 'Ana Sayfa' },
        { k: 'mesajlar', g: 'posta', ad: 'Mesajlar' },
        { k: 'takvim', g: 'takvim', ad: 'Takvim' },
        { k: 'cocuklarim', g: 'veli', ad: 'Çocuklarım' }
      ];
    }
    if (u.role === 'teacher') {
      var m = [
        { k: 'ana', g: 'ev', ad: 'Ana Sayfa' },
        { k: 'mesajlar', g: 'posta', ad: 'Mesajlar' },
        { k: 'takvim', g: 'takvim', ad: 'Takvim' },
        { k: 'programim', g: 'takvim', ad: 'Ders Programım' },
        { k: 'ogr-odevler', g: 'odev', ad: 'Ödevler' },
        { k: 'ogr-sinavlar', g: 'sinav', ad: 'Sınavlar' },
        { k: 'yoklama', g: 'onay', ad: 'Yoklama' }
      ];
      /* Müdürün verdiği role göre ek bölümler açılır. */
      var ek = [];
      if (yetkim('sinif.yonet') || yetkim('ders.yonet')) ek.push({ k: 'siniflar', g: 'sinif', ad: 'Sınıflar' });
      if (yetkim('program.duzenle')) ek.push({ k: 'program', g: 'takvim', ad: 'Ders Programı' });
      if (yetkim('ogrenci.duzenle') || yetkim('ogrenci.hesap-ac')) {
        ek.push({ k: 'okul-ogrenciler', g: 'ogrenci', ad: 'Okul Öğrencileri' });
      }
      if (yetkim('ogretmen.onayla') || yetkim('ogretmen.duzenle')) {
        ek.push({ k: 'ogretmenler', g: 'ogretmen', ad: 'Öğretmenler' });
      }
      if (yetkim('rol.yonet')) ek.push({ k: 'roller', g: 'kilit', ad: 'Roller ve Yetkiler' });
      if (yetkim('aktarim.yap')) ek.push({ k: 'aktarim', g: 'indir', ad: 'Excel Aktarım' });
      if (yetkim('devamsizlik.gor')) ek.push({ k: 'devamsizlik', g: 'izinli', ad: 'Devamsızlık' });
      if (yetkim('islem-kaydi.gor')) ek.push({ k: 'islem-kaydi', g: 'belge', ad: 'İşlem Kaydı' });

      if (ek.length) {
        m.push({ ayrac: 1 });
        m.push({ baslik: u.customRoleName || 'Ek Yetkiler' });
        m = m.concat(ek);
      }
      return m;
    }
    if (u.role === 'principal') {
      return [
        { k: 'ana', g: 'ev', ad: 'Ana Sayfa' },
        { k: 'mesajlar', g: 'posta', ad: 'Mesajlar' },
        { k: 'takvim', g: 'takvim', ad: 'Takvim' },
        { k: 'ogretmenler', g: 'ogretmen', ad: 'Öğretmenler' },
        { k: 'okul-ogrenciler', g: 'ogrenci', ad: 'Öğrenciler' },
        { ayrac: 1 },
        { baslik: 'Okul Düzeni' },
        { k: 'siniflar', g: 'sinif', ad: 'Sınıflar' },
        { k: 'program', g: 'takvim', ad: 'Ders Programı' },
        { k: 'roller', g: 'kilit', ad: 'Roller ve Yetkiler' },
        { k: 'egitim-yili', g: 'takvim', ad: 'Eğitim Yılı' },
        { k: 'devamsizlik', g: 'izinli', ad: 'Devamsızlık' },
        { k: 'ders-odevleri', g: 'odev', ad: 'Ödevler' },
        { k: 'aktarim', g: 'indir', ad: 'Excel Aktarım' },
        { k: 'islem-kaydi', g: 'belge', ad: 'İşlem Kaydı' },
        { ayrac: 1 },
        { baslik: 'Kendi Derslerim' },
        { k: 'ogr-sinavlar', g: 'sinav', ad: 'Sınavlar' },
        { k: 'yoklama', g: 'onay', ad: 'Yoklama' }
      ];
    }
    if (u.role === 'admin') {
      return [
        { k: 'ana', g: 'ev', ad: 'Ana Sayfa' },
        { k: 'onaylar', g: 'onay', ad: 'Onay Bekleyenler' },
        { k: 'mudurler', g: 'mudur', ad: 'Müdürler' },
        { k: 'okullar', g: 'okul', ad: 'Okullar' },
        { ayrac: 1 },
        { k: 'yedekler', g: 'kutu', ad: 'Yedekleme' },
        { k: 'islem-kaydi', g: 'belge', ad: 'İşlem Kaydı' }
      ];
    }
    return [];
  }

  function navCiz() {
    var liste = navTanim(), h = '';
    for (var i = 0; i < liste.length; i++) {
      var n = liste[i];
      if (n.ayrac) { h += '<div class="nav-ayrac"></div>'; continue; }
      if (n.baslik) { h += '<div class="nav-baslik">' + esc(n.baslik) + '</div>'; continue; }
      h += '<button class="navlink' + (S.page === n.k ? ' on' : '') + '" data-nav="' + esc(n.k) + '">' +
        ik(n.g) + '<span>' + esc(n.ad) + '</span></button>';
    }
    h += '<div class="nav-ayrac"></div>' +
      '<button class="navlink" data-nav="profil">' + ik('ayar') + '<span>Ayarlar</span></button>' +
      '<button class="navlink" data-act="cikis">' + ik('cikis') + '<span>Çıkış Yap</span></button>';
    $('navListe').innerHTML = h;
  }

  /* ================= sayfa yönlendirme ================= */
  /* Adres çubuğundaki sayfa anahtarı (#/program -> "program") */
  function adrestenSayfa() {
    var h = String(location.hash || '').replace(/^#\/?/, '').trim();
    return /^[a-z0-9-]+$/i.test(h) ? h : '';
  }

  var adresGuncelleniyor = false;

  function git(sayfa) {
    /* Adresi de güncelle ki geri tuşu ve yenileme çalışsın. */
    if (adrestenSayfa() !== sayfa) {
      adresGuncelleniyor = true;
      try { location.hash = '#/' + sayfa; } catch (e) { }
      adresGuncelleniyor = false;
    }
    S.page = sayfa;
    S.araHook = null;
    S.odevF = { ders: '', durum: '', bas: '', bit: '', mod: 'ogrenci' };
    if ($('araKutu')) $('araKutu').value = '';
    navCiz();
    sidebarKapat();
    $('sayfa').innerHTML = '<div class="yukleniyor">Yükleniyor...</div>';
    window.scrollTo(0, 0);

    var f = SAYFALAR[sayfa];
    if (!f) { $('sayfa').innerHTML = bosKutu('soru', 'Bu sayfa bulunamadı.'); return; }
    Promise.resolve()
      .then(function () { return f(); })
      ['catch'](function (err) {
        $('sayfa').innerHTML = '<div class="msg hata">' + esc(err.message) + '</div>';
      });
  }

  function yaz(html) {
    $('sayfa').innerHTML = yilSeridi() + html + altBilgi();
    araUygula();
    yilSeciciBagla();
  }

  function yilSeciciBagla() {
    var sec = $('yilSec');
    if (!sec) return;
    sec.onchange = function () {
      api('/egitim-yili/bak', 'POST', { id: this.value })
        .then(function () { return yilBilgisiYukle(); })
        .then(function () { git(S.page); })['catch'](hataGoster);
    };
  }

  function bosKutu(g, metin) {
    return '<div class="bos">' + ik(g, 'buyuk') + '<span>' + esc(metin) + '</span></div>';
  }

  function altBilgi() {
    /* Buraya uydurma telefon/e-posta koymak yerine gerçekten işe yarayan
       iki bağlantı var: aydınlatma metni ve sistemin ne olduğu. */
    return '<div class="footer">' +
      '<p><b>Eğitim Evi</b> — okul yönetim sistemi</p>' +
      '<p style="margin-top:8px">' +
      '<a href="/kvkk.html" target="_blank" rel="noopener">Aydınlatma metni</a>' +
      ' · <a href="#" data-act="kaynakca">Bu sistem hakkında</a></p>' +
      '</div>';
  }

  function hero(baslik, altYazi) {
    return '<div class="hero"><h1>' + esc(baslik) + '</h1>' +
      (altYazi ? '<p class="alt">' + esc(altYazi) + '</p>' : '') +
      '<hr></div>';
  }

  /* Ana sayfadaki renkli bolum kutucuklari.
     liste: [{ k: sayfaAnahtari, ad, renk, ikon, alt, rozet }] */
  function kutucuklar(liste) {
    var h = '<div class="kutucuklar">';
    for (var i = 0; i < liste.length; i++) {
      var t = liste[i];
      if (!t) continue;
      h += '<button type="button" class="kutucuk ' + t.renk + '" data-nav="' + esc(t.k) + '">' +
        '<span class="kutucuk-ikon">' + ik(t.ikon) + '</span>' +
        (t.rozet ? '<span class="kutucuk-rozet">' + esc(t.rozet) + '</span>' : '') +
        '<span class="kutucuk-ad">' + esc(t.ad) + '</span>' +
        (t.alt ? '<span class="kutucuk-alt">' + esc(t.alt) + '</span>' : '') +
        '</button>';
    }
    return h + '</div>';
  }

  /* ================= sayfalar ================= */
  var SAYFALAR = {};

  /* ---- ana sayfa ---- */
  SAYFALAR.ana = function () {
    var u = S.user;
    var ad = u.fullName.split(' ')[0];

    if (u.role === 'admin') {
      return api('/admin/overview').then(function (d) {
        var s = d.stats;
        yaz(hero('EĞİTİM EVİNE HOŞGELDİNİZ', 'Merhaba ' + ad + ', sistem yöneticisi panelindesin.') +
          kutucuklar([
            { k: 'onaylar', ad: 'Onay Bekleyenler', renk: s.bekleyen > 0 ? 'kirmizi' : 'yesil', ikon: 'onay',
              alt: s.bekleyen > 0 ? s.bekleyen + ' başvuru bekliyor' : 'Bekleyen yok',
              rozet: s.bekleyen || '' },
            { k: 'okullar', ad: 'Okullar', renk: 'lacivert', ikon: 'okul', alt: s.okul + ' okul kayıtlı' },
            { k: 'yedekler', ad: 'Yedekleme', renk: 'camgobegi', ikon: 'kutu', alt: 'Veri kopyaları' },
            { k: 'profil', ad: 'Ayarlar', renk: 'gri', ikon: 'ayar', alt: 'Yönetici hesabın' }
          ]) +
          '<div class="grid k4">' +
          stat(s.okul, 'Okul') + stat(s.mudur, 'Müdür') + stat(s.ogretmen, 'Öğretmen') +
          stat(s.ogrenci, 'Öğrenci') + stat(s.veli, 'Veli') + stat(s.bekleyen, 'Bekleyen başvuru') +
          '</div>');
      });
    }

    if (u.role === 'parent') {
      return api('/parent/children').then(function (d) {
        S.children = d.children;
        var h = hero('EĞİTİM EVİNE HOŞGELDİNİZ', 'Merhaba ' + ad + ', çocuklarının durumunu buradan takip edebilirsin.');
        h += kutucuklar([
          { k: 'cocuklarim', ad: 'Çocuklarım', renk: 'mor', ikon: 'veli',
            alt: d.children.length ? d.children.length + ' öğrenci bağlı' : 'Henüz çocuk eklenmedi',
            rozet: d.children.length || '' },
          { k: 'profil', ad: 'Ayarlar', renk: 'gri', ikon: 'ayar', alt: 'Hesap bilgilerin' }
        ]);
        h += cocukKartlari(d.children);
        yaz(h);
      });
    }

    if (u.role === 'student') {
      return api('/progress').then(function (d) {
        var aktif = d.assignments.filter(function (a) { return a.status === 'active'; });
        var ort = genelOrtalama(d);
        var h = hero('EĞİTİM EVİNE HOŞGELDİNİZ', 'Merhaba ' + ad + ', bugün ne öğreneceksin?');
        h += kutucuklar([
          { k: 'odevler', ad: 'Ödevler', renk: 'turuncu', ikon: 'odev',
            alt: aktif.length ? aktif.length + ' aktif ödev' : 'Aktif ödev yok',
            rozet: aktif.length || '' },
          { k: 'sinavlarim', ad: 'Sınavlarım', renk: 'mavi', ikon: 'sinav',
            alt: d.examGroups.length + ' sınav grubu' },
          { k: 'ilerleyisim', ad: 'İlerleyişim', renk: 'camgobegi', ikon: 'grafik',
            alt: ort === null ? 'Not girilmedi' : 'Ortalama ' + ort },
          { k: 'profil', ad: 'Ayarlar', renk: 'gri', ikon: 'ayar', alt: 'Hesabın ve veli kodun' }
        ]);
        h += '<h3 class="sb">Yaklaşan ödevler</h3>';
        h += aktif.length ? odevListesiOgrenci(aktif) : bosKutu('onay', 'Aktif ödevin yok. Harika!');
        yaz(h);
      });
    }

    /* Müdürün ana sayfası okulun tamamına bakar. Ödev vermek, sınav açmak
       ve "kendi öğrencilerim" öğretmen işidir; müdür bunları yapabilse de
       ana ekranı onlarla dolmamalı. */
    if (u.role === 'principal') {
      return Promise.all([
        api('/school/students'),
        api('/school/teacher-list'),
        api('/school/classes')
      ]).then(function (r) {
        var ogrenciler = r[0].students || [];
        var ogretmenler = (r[1].teachers || []).filter(function (t) {
          return t.role !== 'principal';
        });
        var siniflar = r[2].classes || [];
        var bekleyen = ogretmenler.filter(function (t) {
          return t.status && t.status !== 'approved';
        }).length;

        var h = hero('EĞİTİM EVİNE HOŞGELDİNİZ',
          'Merhaba ' + ad + ' — ' + u.schoolName + ' müdürü');

        h += kutucuklar([
          { k: 'ogretmenler', ad: 'Öğretmenler', renk: 'yesil', ikon: 'ogretmen',
            alt: bekleyen ? bekleyen + ' başvuru bekliyor' : ogretmenler.length + ' öğretmen',
            rozet: bekleyen || '' },
          { k: 'okul-ogrenciler', ad: 'Öğrenciler', renk: 'lacivert', ikon: 'ogrenci',
            alt: ogrenciler.length + ' öğrenci' },
          { k: 'siniflar', ad: 'Sınıflar', renk: 'camgobegi', ikon: 'sinif',
            alt: siniflar.length + ' sınıf' },
          { k: 'program', ad: 'Ders Programı', renk: 'mavi', ikon: 'takvim',
            alt: 'Haftalık program ve ders atamaları' },
          { k: 'devamsizlik', ad: 'Devamsızlık', renk: 'turuncu', ikon: 'izinli',
            alt: 'Okul geneli yoklama özeti' },
          yetkim('aktarim.yap')
            ? { k: 'aktarim', ad: 'Excel Aktarım', renk: 'mor', ikon: 'indir',
                alt: 'Toplu öğrenci ve program' } : null,
          { k: 'profil', ad: 'Ayarlar', renk: 'gri', ikon: 'ayar',
            alt: 'Hesap bilgilerin' }
        ].filter(Boolean));

        h += '<div class="grid k4" style="margin-bottom:18px">' +
          stat(ogrenciler.length, 'Öğrenci') +
          stat(ogretmenler.length, 'Öğretmen') +
          stat(siniflar.length, 'Sınıf') + '</div>';

        /* Okul yeni kurulduysa nereden başlayacağını söyle. */
        if (!siniflar.length) {
          h += '<div class="msg bilgi">Henüz sınıf açmadın. ' +
            '<b>Sınıflar</b> sayfasından başlayıp derslerini tanımla, ' +
            'sonra öğretmen ata.</div>';
        } else if (!ogrenciler.length) {
          h += '<div class="msg bilgi">Okulda kayıtlı öğrenci yok. ' +
            'Tek tek ekleyebilir ya da <b>Excel Aktarım</b> ile listeyi ' +
            'toplu yükleyebilirsin.</div>';
        }

        yaz(h);
      });
    }

    /* öğretmen */
    return Promise.all([api('/assignments/hedefler'), api('/assignments')]).then(function (r) {
      var siniflar = r[0].classes || [], ass = r[1].assignments;
      var aktif = ass.filter(function (a) { return a.status === 'active'; });
      var h = hero('EĞİTİM EVİNE HOŞGELDİNİZ',
        'Merhaba ' + ad + ' — ' + (u.branch ? u.branch + ' ' : '') + ROL_AD[u.role] + ' · ' + u.schoolName);
      h += kutucuklar([
        { k: 'ogr-odevler', ad: 'Ödevler', renk: 'turuncu', ikon: 'odev',
          alt: aktif.length ? aktif.length + ' aktif ödev' : 'Aktif ödev yok',
          rozet: aktif.length || '' },
        { k: 'ogr-sinavlar', ad: 'Sınavlar', renk: 'mavi', ikon: 'sinav',
          alt: 'Sınav grupları ve notlar' },
        { k: 'yoklama', ad: 'Yoklama', renk: 'yesil', ikon: 'onay',
          alt: 'Derse katılım al' },
        { k: 'profil', ad: 'Ayarlar', renk: 'gri', ikon: 'ayar', alt: 'Hesap bilgilerin' }
      ].filter(Boolean));
      /* Sınıfsız öğrenciler kutusu sayıma girmesin. */
      var gercekSiniflar = siniflar.filter(function (c) { return !!c.id; });
      h += '<div class="grid k4" style="margin-bottom:18px">' +
        stat(gercekSiniflar.length, 'Sınıfım') + stat(aktif.length, 'Aktif ödev') +
        stat(ass.length - aktif.length, 'Sonuçlanan ödev') + '</div>';
      if (!siniflar.length) {
        h += '<div class="msg bilgi">Henüz bir dersin yok. ' +
          'Okul müdürünün seni bir derse ataması gerekiyor.</div>';
      }
      h += '<h3 class="sb">Aktif ödevler</h3>';
      h += aktif.length ? odevListesiOgretmen(aktif) : bosKutu('odev', 'Aktif ödev yok. Ödevler sayfasından yeni ödev verebilirsin.');
      yaz(h);
    });
  };

  function stat(n, l) {
    return '<div class="stat"><div class="n">' + esc(n) + '</div><div class="l">' + esc(l) + '</div></div>';
  }

  function genelOrtalama(d) {
    var t = 0, n = 0;
    for (var i = 0; i < d.examGroups.length; i++) {
      if (d.examGroups[i].average !== null) { t += d.examGroups[i].average; n++; }
    }
    return n ? Math.round(t / n * 10) / 10 : null;
  }

  /* ---- ADMIN ---- */
  SAYFALAR.onaylar = function () {
    return api('/admin/pending').then(function (d) {
      var h = hero('ONAY BEKLEYEN BAŞVURULAR', 'Müdür başvurularını onayladığında okulları sisteme eklenir.');
      if (!d.principals.length) { yaz(h + bosKutu('kutu', 'Bekleyen başvuru yok.')); return; }
      h += '<div class="kart">';
      for (var i = 0; i < d.principals.length; i++) {
        var p = d.principals[i];
        h += '<div class="satir" data-ara="' + esc(p.fullName + ' ' + p.schoolName + ' ' + p.city) + '">' +
          '<div class="buyu"><div class="ad">' + ik('mudur') + esc(p.fullName) + '</div>' +
          '<div class="alt">' + esc(p.schoolName) + ' · ' + esc(p.city) + ' / ' + esc(p.district) + '</div>' +
          '<div class="alt">' + esc(p.email) + ' · ' + tarih(p.createdAt) + '</div></div>' +
          '<button class="btn kucuk" data-act="admin-onay" data-id="' + esc(p.id) + '" data-ok="1">Onayla</button>' +
          '<button class="btn kucuk tehlike" data-act="admin-onay" data-id="' + esc(p.id) + '" data-ok="0">Reddet</button>' +
          '</div>';
      }
      yaz(h + '</div>');
    });
  };

  SAYFALAR.yedekler = function () {
    return api('/admin/backups').then(function (d) {
      var h = hero('YEDEKLEME', 'Tüm veri tek dosyada tutuluyor. Günde bir kez otomatik kopya alınır.');

      h += '<div class="kart"><h3>Şimdi yedek al</h3>' +
        '<div class="hint" style="margin-bottom:10px">Son ' + d.saklanan +
        ' kopya saklanır, eskiler kendiliğinden silinir.</div>' +
        '<button class="btn" data-act="yedek-al">Yedek al</button>' +
        '<div id="yedekMesaj" style="margin-top:10px"></div></div>';

      if (!d.yedekler.length) {
        h += bosKutu('kutu', 'Henüz yedek yok. Sunucu açıldıktan kısa süre sonra ilki alınır.');
        yaz(h);
        return;
      }

      h += '<div class="kart"><h3>Yedekler (' + d.yedekler.length + ')</h3>';
      for (var i = 0; i < d.yedekler.length; i++) {
        var y = d.yedekler[i];
        var elle = y.ad.indexOf('yedek-elle-') === 0;
        h += '<div class="satir" data-ara="' + esc(y.ad) + '">' +
          '<div class="buyu"><div class="ad">' + esc(y.ad) +
          (elle ? ' <span class="etiket">elle</span>' : '') + '</div>' +
          '<div class="alt">' + tarihSaat(y.tarih) + ' · ' + boyutYaz(y.boyut) + '</div></div>' +
          '<button class="btn kucuk ghost" data-act="yedek-indir" data-ad="' + esc(y.ad) + '">İndir</button>' +
          '<button class="btn kucuk gri" data-act="yedek-geri" data-ad="' + esc(y.ad) + '">Geri yükle</button>' +
          '<button class="btn kucuk tehlike" data-act="yedek-sil" data-ad="' + esc(y.ad) + '">Sil</button>' +
          '</div>';
      }
      h += '</div>';

      h += '<div class="msg bilgi">Geri yükleme her şeyi o ana döndürür — o yedekten ' +
        'sonra yapılan bütün değişiklikler kaybolur. Yanlışlıkla yaparsan, geri yükleme ' +
        'öncesi hâl otomatik olarak <b>yedek-elle-geri-alma-…</b> adıyla saklanır.</div>';

      yaz(h);
    });
  };

  function boyutYaz(b) {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1024 / 1024).toFixed(1) + ' MB';
  }

  SAYFALAR.mudurler = function () {
    return api('/admin/principals').then(function (d) {
      var h = hero('MÜDÜRLER', d.principals.length + ' müdür hesabı kayıtlı.');
      if (!d.principals.length) { yaz(h + bosKutu('mudur', 'Henüz müdür hesabı yok.')); return; }

      h += '<div class="kart">';
      for (var i = 0; i < d.principals.length; i++) {
        var m = d.principals[i];
        var durum = m.status === 'approved'
          ? '<span class="etiket yesil">Onaylı</span>'
          : (m.status === 'pending' ? '<span class="etiket turuncu">Beklemede</span>'
            : '<span class="etiket kirmizi">Reddedildi</span>');
        h += '<div class="satir" data-ara="' + esc(m.fullName + ' ' + m.schoolName + ' ' + m.city) + '">' +
          '<div class="buyu"><div class="ad">' + ik('mudur') + esc(m.fullName) + '</div>' +
          '<div class="alt">' + esc(m.email) + '</div>' +
          '<div class="alt">' + esc(m.schoolName) + ' · ' + esc(m.city) +
          (m.district ? ' / ' + esc(m.district) : '') + '</div>' +
          '<div class="alt">' + m.teachers + ' öğretmen · ' + m.students + ' öğrenci</div></div>' +
          durum +
          '<button class="btn kucuk tehlike" data-act="mudur-sil" data-id="' + esc(m.id) + '" ' +
          'data-ad="' + esc(m.fullName) + '" data-okul="' + esc(m.schoolName) + '">Hesabı sil</button>' +
          '</div>';
      }
      yaz(h + '</div>');
    });
  };

  SAYFALAR.okullar = function () {
    return api('/admin/overview').then(function (d) {
      var h = hero('KAYITLI OKULLAR', d.schools.length + ' okul kayıtlı.');
      if (!d.schools.length) { yaz(h + bosKutu('okul', 'Henüz okul yok.')); return; }
      h += '<div class="kart"><div class="tablo-sar"><table class="t"><thead><tr>' +
        '<th>Okul</th><th>İl / İlçe</th><th>Müdür</th><th>Öğretmen</th><th>Öğrenci</th><th>Durum</th>' +
        '</tr></thead><tbody>';
      for (var i = 0; i < d.schools.length; i++) {
        var s = d.schools[i];
        var dur = s.status === 'approved' ? '<span class="etiket yesil">Onaylı</span>'
          : s.status === 'pending' ? '<span class="etiket turuncu">Bekliyor</span>'
            : '<span class="etiket kirmizi">Red</span>';
        h += '<tr data-ara="' + esc(s.name + ' ' + s.city + ' ' + s.principal) + '"><td><b>' + esc(s.name) + '</b></td><td>' +
          esc(s.city) + ' / ' + esc(s.district) + '</td><td>' + esc(s.principal) + '</td><td>' +
          s.teachers + '</td><td>' + s.students + '</td><td>' + dur + '</td></tr>';
      }
      yaz(h + '</tbody></table></div></div>');
    });
  };

  /* ---- MÜDÜR ---- */
  SAYFALAR.ogretmenler = function () {
    return api('/school/teachers').then(function (d) {
      var bek = d.teachers.filter(function (t) { return t.status === 'pending'; });
      var onay = d.teachers.filter(function (t) { return t.status === 'approved'; });
      var h = hero('ÖĞRETMENLER', S.user.schoolName);

      h += '<h3 class="sb">Onay bekleyenler (' + bek.length + ')</h3>';
      if (!bek.length) h += bosKutu('kutu', 'Bekleyen öğretmen başvurusu yok.');
      else {
        h += '<div class="kart">';
        for (var i = 0; i < bek.length; i++) {
          var t = bek[i];
          h += '<div class="satir" data-ara="' + esc(t.fullName + ' ' + t.branch) + '">' +
            '<div class="buyu"><div class="ad">' + ik('ogretmen') + esc(t.fullName) + '</div>' +
            '<div class="alt">' + esc(t.branch) + ' · ' + esc(t.email) + '</div></div>' +
            '<button class="btn kucuk" data-act="ogretmen-onay" data-id="' + esc(t.id) + '" data-ok="1">Onayla</button>' +
            '<button class="btn kucuk tehlike" data-act="ogretmen-onay" data-id="' + esc(t.id) + '" data-ok="0">Reddet</button></div>';
        }
        h += '</div>';
      }

      h += '<h3 class="sb">Okulun öğretmenleri (' + onay.length + ')</h3>';
      if (!onay.length) h += bosKutu('ogretmen', 'Henüz onaylı öğretmen yok.');
      else {
        h += '<div class="kart">';
        for (var j = 0; j < onay.length; j++) {
          var o = onay[j];
          h += '<div class="satir" data-ara="' + esc(o.fullName + ' ' + o.branch) + '">' +
            '<div class="buyu"><div class="ad">' + esc(o.fullName) + '</div>' +
            '<div class="alt">' + esc(o.email) + '</div></div>' +
            '<span class="etiket">' + esc(o.branch) + '</span>' +
            '<span class="etiket gri">' + o.studentCount + ' öğrenci</span></div>';
        }
        h += '</div>';
      }
      yaz(h);
    });
  };

  SAYFALAR['okul-ogrenciler'] = function () {
    return Promise.all([api('/school/students'), api('/school/teacher-list'), api('/school/classes')])
      .then(function (r) {
        var st = r[0].students, tl = r[1].teachers, siniflar = r[2].classes;
        window.__ogretmenListe = tl;
        window.__sinifListe = siniflar;

        var h = hero('ÖĞRENCİLER', st.length + ' öğrenci kayıtlı.');

        h += '<div class="kart"><div class="satir" style="border:0;padding:0">' +
          '<div class="buyu"><input type="text" id="ogrAra" class="ara-kutu" ' +
          'placeholder="Öğrenci ara — ad, sınıf ya da kullanıcı adı" autocomplete="off"></div>' +
          '<button class="btn" data-act="ogrenci-olustur">Yeni öğrenci</button>' +
          '</div></div>';

        if (!st.length) { yaz(h + bosKutu('ogrenci', 'Henüz öğrenci kaydı yok.')); return; }

        /* Sınıfa göre, sonra ada göre sırala — liste öngörülebilir olsun. */
        st.sort(function (a, b) {
          return String(a.className || 'ZZZ').localeCompare(String(b.className || 'ZZZ'), 'tr') ||
            a.fullName.localeCompare(b.fullName, 'tr');
        });

        h += '<div class="kart" style="padding:0" id="ogrListe">';
        for (var i = 0; i < st.length; i++) {
          var s = st[i];
          h += '<div class="satir" data-ara="' + esc(s.fullName + ' ' + s.grade + ' ' + s.email + ' ' + s.className) + '">' +
            '<div class="buyu"><div class="ad">' + esc(s.fullName) +
            (s.className ? ' <span class="etiket mavi">' + esc(s.className) + '</span>' : '') + '</div>' +
            '<div class="alt">' + esc(s.email) + ' · veli kodu <b>' + esc(s.code) + '</b></div></div>' +
            '<button class="btn kucuk ghost" data-act="ogrenci-duzenle" data-id="' + esc(s.id) + '" ' +
            'data-ad="' + esc(s.fullName) + '">Hesap</button>' +
            '<button class="btn kucuk gri" data-act="ogrenci-portal" data-id="' + esc(s.id) + '" ' +
            'data-ad="' + esc(s.fullName) + '">Portalını aç</button>' +
            '</div>';
        }
        yaz(h + '</div>');

        /* Sayfanın kendi arama kutusu: üstteki genel aramayı beklemeden süzer. */
        var kutu = $('ogrAra');
        if (kutu) {
          kutu.oninput = function () {
            var t = nrm(kutu.value);
            var satirlar = document.querySelectorAll('#ogrListe .satir');
            var gorunen = 0;
            for (var k = 0; k < satirlar.length; k++) {
              var uyar = !t || nrm(satirlar[k].getAttribute('data-ara') || '').indexOf(t) >= 0;
              satirlar[k].style.display = uyar ? '' : 'none';
              if (uyar) gorunen++;
            }
          };
          kutu.focus();
        }
      });
  };

  /* Müdürün öğrenci hesabı açma penceresi */
  function ogrenciOlusturModal() {
    var siniflar = window.__sinifListe || [];
    var h = '<div class="field"><label for="oAd">Ad Soyad</label>' +
      '<input type="text" id="oAd" placeholder="Ahmet Yılmaz" autocomplete="off"></div>' +
      '<div class="field"><label for="oEposta">Kullanıcı adı (e-posta)</label>' +
      '<input type="text" id="oEposta" placeholder="ahmet.yilmaz@okul.com" autocomplete="off" ' +
      'autocapitalize="off" spellcheck="false"></div>' +
      '<div class="field"><label for="oSifre">Şifre (en az 8 karakter, harf ve rakam)</label>' +
      '<input type="text" id="oSifre" placeholder="Ogrenci2026" autocomplete="off"></div>' +
      '<div class="row2">' +
      '<div class="field"><label for="oSinif">Sınıf</label><select id="oSinif">' +
      '<option value="">— sınıfsız —</option>';
    for (var i = 0; i < siniflar.length; i++) {
      h += '<option value="' + esc(siniflar[i].id) + '">' + esc(siniflar[i].name) + '</option>';
    }
    h += '</select></div>' +
      '<div class="field"><label for="oKademe">Sınıf yazısı (isteğe bağlı)</label>' +
      '<input type="text" id="oKademe" placeholder="7-A"></div></div>' +
      '<div class="field"><label for="oNot">Öğrenciye not (isteğe bağlı)</label>' +
      '<textarea id="oNot" rows="2" maxlength="300" ' +
      'placeholder="Hesabın açıldı, şifreni sınıf öğretmeninden al."></textarea>' +
      '<div class="hint">Bu öğrenci aynı adla kendi hesabını açmaya çalışırsa bu not gösterilir.</div></div>' +
      '<div class="hint">Şifreyi sen belirliyorsun; kaydedince ekranda gösterilecek, öğrenciye ilet.</div>' +
      '<div id="ogrenciMesaj" style="margin-top:9px"></div>';

    modalAc('Yeni öğrenci hesabı', h,
      '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
      '<button class="btn" data-act="ogrenci-kaydet">Hesabı aç</button>');
  }

  /* Öğrencinin kullanıcı adı / şifre / sınıf yönetimi */
  function ogrenciHesapModal(studentId, ad) {
    return Promise.all([api('/school/students'), api('/school/classes')]).then(function (r) {
      var s = null;
      for (var i = 0; i < r[0].students.length; i++) {
        if (r[0].students[i].id === studentId) s = r[0].students[i];
      }
      if (!s) { hataGoster(new Error('Öğrenci bulunamadı')); return; }
      var siniflar = r[1].classes;

      var h = '<div class="field"><label for="hAd">Ad Soyad</label>' +
        '<input type="text" id="hAd" value="' + esc(s.fullName) + '"></div>' +
        '<div class="field"><label for="hEposta">Kullanıcı adı (e-posta)</label>' +
        '<input type="text" id="hEposta" value="' + esc(s.email) + '" ' +
        'autocapitalize="off" spellcheck="false"></div>' +
        '<div class="field"><label for="hSinif">Sınıf</label><select id="hSinif">' +
        '<option value="">— sınıfsız —</option>';
      for (var j = 0; j < siniflar.length; j++) {
        h += '<option value="' + esc(siniflar[j].id) + '"' +
          (s.classId === siniflar[j].id ? ' selected' : '') + '>' + esc(siniflar[j].name) + '</option>';
      }
      h += '</select></div>' +
        '<div class="field"><label for="hNot">Öğrenciye not</label>' +
        '<textarea id="hNot" rows="2" maxlength="300">' + esc(s.note || '') + '</textarea>' +
        '<div class="hint">Aynı adla kayıt denemesinde gösterilir.</div></div>' +
        '<button class="btn kucuk" data-act="hesap-kaydet" data-id="' + esc(s.id) + '">Bilgileri kaydet</button>' +

        '<hr style="margin:16px 0;border:0;border-top:1px solid var(--cizgi)">' +

        '<h4 style="margin:0 0 6px">Şifre</h4>' +
        '<div class="hint" style="margin-bottom:9px">Mevcut şifre <b>görüntülenemez</b> — geri döndürülemez ' +
        'şekilde şifrelenmiş saklanıyor. Öğrenci şifresini unuttuysa yenisini belirle.</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<input type="text" id="hSifre" placeholder="Yeni şifre" autocomplete="off" ' +
        'style="flex:1;min-width:150px;padding:10px 11px;border:1.5px solid var(--cizgi);border-radius:9px">' +
        '<button class="btn kucuk" data-act="sifre-uret">Rastgele üret</button>' +
        '<button class="btn kucuk tehlike" data-act="ogr-sifre-kaydet" data-id="' + esc(s.id) + '">Şifreyi değiştir</button>' +
        '</div>' +

        '<hr style="margin:16px 0;border:0;border-top:1px solid var(--cizgi)">' +
        '<h4 style="margin:0 0 6px">Veli kodu</h4>' +
        '<div class="kod-goster">' + esc(s.code) + '</div>' +
        '<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="btn ghost kucuk" data-act="kod-kopyala" data-kod="' + esc(s.code) + '">Kopyala</button>' +
        '<button class="btn gri kucuk" data-act="kod-yenile" data-id="' + esc(s.id) + '">Yeni kod üret</button>' +
        '</div>' +
        '<div id="hesapMesaj" style="margin-top:12px"></div>';

      modalAc(ad + ' — Hesap bilgileri', h);
    });
  }

  /* Müdür bir öğrencinin portalını açar (veli görünümüyle aynı mantık) */
  function ogrenciPortalAc(studentId, ad) {
    S.viewStudentId = studentId;
    S.viewStudentName = ad;
    git('ilerleyisim');
  }


  /* ---- ÖĞRETMEN: ödevler ---- */
  /* Müdür ödev vermez, ders bazlı bakar: hangi derse hangi öğretmen ne vermiş. */
  SAYFALAR['ders-odevleri'] = function () {
    var adres = '/school/assignments' + (S.odevSinif ? '?classId=' + encodeURIComponent(S.odevSinif) : '');
    return api(adres).then(function (d) {
      if (!S.acikDersler) S.acikDersler = {};
      var h = hero('DERS ÖDEVLERİ', '');

      h += '<div class="kart"><div class="satir" style="border:0;padding:0">' +
        '<div class="field" style="margin:0;min-width:220px">' +
        '<select id="oSinifSec"><option value="">Tüm sınıflar</option>';
      for (var i = 0; i < d.classes.length; i++) {
        h += '<option value="' + esc(d.classes[i].id) + '"' +
          (S.odevSinif === d.classes[i].id ? ' selected' : '') + '>' +
          esc(d.classes[i].name) + '</option>';
      }
      h += '</select></div><div class="buyu"></div>' +
        '<button class="btn kucuk ghost" data-act="ders-hepsini-ac">Hepsini aç</button>' +
        '<button class="btn kucuk ghost" data-act="ders-hepsini-kapat">Hepsini kapat</button>' +
        '</div></div>';

      if (!d.lessons.length) {
        h += bosKutu('ders', 'Bu sınıfa ders eklenmemiş.');
        yaz(h);
        sinifSeciciBagla();
        return;
      }

      h += '<div class="kart" style="padding:8px 10px">';

      for (var j = 0; j < d.lessons.length; j++) {
        var l = d.lessons[j];
        var acik = !!S.acikDersler[l.lessonId];

        /* Ödevleri ikiye ayır: hâlâ süren ve süresi dolmuş olanlar. */
        var aktif = [], gecmis = [];
        for (var k = 0; k < l.assignments.length; k++) {
          var a = l.assignments[k];
          var bitti = a.status === 'finished' ||
            (a.gecikti !== undefined ? a.gecikti : teslimGecti(a.endAt, a.endTime));
          (bitti ? gecmis : aktif).push(a);
        }

        h += '<div class="ders-dal" data-ara="' +
          esc(l.className + ' ' + l.subject + ' ' + l.teacherName) + '">';

        h += '<button type="button" class="dal-basi' + (acik ? ' acik' : '') +
          '" data-act="ders-dal" data-id="' + esc(l.lessonId) + '">' +
          '<span class="dal-ok">' + (acik ? '▾' : '▸') + '</span>' +
          '<span class="dal-ad">' + esc(l.className) + ' · ' + esc(l.subject) + '</span>' +
          '<span class="dal-alt">' +
          (l.teacherName ? esc(l.teacherName)
            : '<span style="color:var(--kirmizi)">öğretmen atanmadı</span>') + '</span>' +
          '<span class="dal-sayi">' +
          (aktif.length ? '<span class="etiket mavi">' + aktif.length + ' aktif</span> ' : '') +
          (gecmis.length ? '<span class="etiket gri">' + gecmis.length + ' geçmiş</span>' : '') +
          (l.assignments.length ? '' : '<span class="etiket gri">ödev yok</span>') +
          '</span></button>';

        if (acik) {
          h += '<div class="dal-icerik">';
          if (!l.assignments.length) {
            h += '<div class="dal-bos">Bu derse henüz ödev verilmemiş.</div>';
          } else {
            h += odevGrubu('Aktif ödevler', aktif);
            h += odevGrubu('Süresi geçmiş', gecmis);
          }
          h += '</div>';
        }
        h += '</div>';
      }

      h += '</div>';
      yaz(h);
      sinifSeciciBagla();
    });
  };

  /* Bir ders dalının içindeki ödev grubu (aktif / geçmiş). */
  function odevGrubu(baslik, liste) {
    if (!liste.length) return '';
    var h = '<div class="dal-grup"><div class="dal-grup-baslik">' + baslik + '</div>';
    for (var i = 0; i < liste.length; i++) {
      var a = liste[i];
      var durum = a.status === 'finished'
        ? '<span class="etiket yesil">Sonuçlandı</span>'
        : ((a.gecikti !== undefined ? a.gecikti : teslimGecti(a.endAt, a.endTime))
          ? '<span class="etiket kirmizi">Süresi doldu</span>'
          : '<span class="etiket mavi">Aktif</span>');

      h += '<div class="satir">' +
        '<div class="buyu"><div class="ad">' + esc(a.title) + '</div>' +
        '<div class="alt">' + esc(a.teacherName) + ' · ' + a.studentCount + ' öğrenci · ' +
        (a.endAt ? tarihGunSaat(a.endAt, a.endTime) : 'süresiz') + '</div>' +
        (a.description ? '<div class="alt" style="margin-top:3px">' +
          esc(a.description) + '</div>' : '') +
        '</div>' + durum + '</div>';
    }
    return h + '</div>';
  }

  function sinifSeciciBagla() {
    var sec = $('oSinifSec');
    if (!sec) return;
    sec.onchange = function () {
      S.odevSinif = this.value;
      git('ders-odevleri');
    };
  }

  SAYFALAR['ogr-odevler'] = function () {
    return api('/assignments').then(function (d) {
      S.odevHam = d.assignments || [];
      S.odevF.mod = 'ogretmen';
      S.araHook = odevSonucCiz;
      var h = hero('ÖDEVLER', 'Aynı anda birden fazla ödev verebilirsin.');
      /* Müdür ödev vermez; ödev öğretmenin işi. Müdür ders bazlı bakar. */
      if (S.user.role !== 'principal') {
        h += '<button class="btn" data-act="odev-yeni">Yeni ödev ver</button>';
      }
      h += odevFiltreCubugu(S.odevHam);
      h += '<div id="odevSonuc"></div>';
      yaz(h);
      odevFiltreBagla();
      odevSonucCiz();
    });
  };

  function odevListesiOgretmen(list) {
    var h = '<div class="kart">';
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      var kalan = gunFarki(a.endAt);
      var gecti = a.gecikti !== undefined ? a.gecikti : teslimGecti(a.endAt, a.endTime);
      var durum = a.status === 'finished'
        ? '<span class="etiket yesil">Sonuçlandı</span>'
        : (gecti ? '<span class="etiket kirmizi">Süresi doldu</span>'
          : '<span class="etiket mavi">Aktif' + (kalan !== null ? ' · ' + kalan + ' gün' : '') + '</span>');
      var ozet = '';
      if (a.summary) {
        ozet = '<div style="margin-top:5px">' +
          '<span class="etiket yesil">' + a.summary.yapti + '</span> ' +
          '<span class="etiket turuncu">' + a.summary.eksik + '</span> ' +
          '<span class="etiket kirmizi">' + a.summary.yapmadi + '</span> ' +
          '<span class="etiket gri">' + a.summary.izinli + '</span> ' +
          '<span class="etiket bordo">' + a.summary.gelmedi + '</span></div>';
      }
      h += '<div class="satir" data-ara="' + esc(a.title + ' ' + a.subject) + '">' +
        '<div class="buyu"><div class="ad">' + esc(a.title) + '</div>' +
        '<div class="alt">' + esc(a.subject) + ' · ' + a.studentCount + ' öğrenci · ' +
        (a.endAt ? 'Son teslim: ' + tarihGunSaat(a.endAt, a.endTime) : 'süresiz') +
        '</div>' + ozet + '</div>' +
        durum +
        '<button class="btn kucuk ' + (a.status === 'finished' ? 'gri' : '') + '" data-act="odev-ac" data-id="' + esc(a.id) + '">' +
        (a.status === 'finished' ? 'Sonuçları düzenle' : 'Sonuçlandır') + '</button>' +
        '<button class="btn kucuk tehlike" data-act="odev-sil" data-id="' + esc(a.id) + '">Sil</button>' +
        '</div>';
    }
    return h + '</div>';
  }

  function odevYeniModal() {
    return api('/assignments/hedefler').then(function (d) {
      S.odevHedef = d;

      if (!d.classes.length) {
        modalAc('Yeni ödev', bosKutu('ogrenci',
          'Ödev verebileceğin öğrenci yok. Müdürünün seni bir sınıfın dersine ataması gerekiyor.'));
        return;
      }

      var bugun = new Date().toISOString().slice(0, 10);

      var h = '<div class="field"><label for="mDers">Ders</label><select id="mDers">';
      for (var i = 0; i < d.subjects.length; i++) {
        h += '<option value="' + esc(d.subjects[i]) + '"' +
          (d.subjects[i] === d.varsayilanDers ? ' selected' : '') + '>' +
          esc(d.subjects[i]) + '</option>';
      }
      h += '</select></div>';

      h += '<div class="field"><label for="mBaslik">Ödev adı</label>' +
        '<input type="text" id="mBaslik" placeholder="Sayfa 42 alıştırmalar"></div>' +
        '<div class="field"><label for="mAciklama">Açıklama</label>' +
        '<textarea id="mAciklama" rows="2" placeholder="Ödevin detayları..."></textarea></div>' +
        '<div class="row2">' +
        '<div class="field"><label for="mBas">Başlangıç</label>' +
        '<input type="date" id="mBas" value="' + bugun + '"></div>' +
        '<div class="field"><label for="mBit">Son teslim tarihi</label>' +
        '<input type="date" id="mBit"><div class="hint" id="mBitGun"></div></div>' +
        '<div class="field"><label for="mBitSaat">Son teslim saati</label>' +
        '<input type="time" id="mBitSaat" value="12:00">' +
        '<div class="hint">Çoğu ödev için 12:00 uygundur; ders saatine göre değiştirebilirsin.</div>' +
        '</div></div>';

      /* Kime gidecek */
      h += '<div class="field" style="margin-bottom:6px">' +
        '<label>Ödev verilecekler</label>' +
        '<div class="secim-ust">' +
        '<button type="button" class="btn gri kucuk" data-act="odev-tumu">Tümünü seç</button>' +
        '<button type="button" class="btn gri kucuk" data-act="odev-hicbiri">Tümünü kaldır</button>' +
        '<span class="secim-sayac" id="odevSayac">0 öğrenci seçili</span>' +
        '</div></div>';

      h += '<div class="hedef-liste">';
      for (var c = 0; c < d.classes.length; c++) {
        var sinif = d.classes[c];
        h += '<div class="hedef-sinif">' +
          '<label class="onay hedef-baslik">' +
          '<input type="checkbox" class="sinif-kutu" data-sinif="' + esc(sinif.id || ('yok' + c)) + '">' +
          '<span><b>' + esc(sinif.name) + '</b> ' +
          '<span class="hedef-adet">' + sinif.students.length + ' öğrenci</span></span></label>' +
          '<div class="hedef-ogrenciler">';
        for (var j = 0; j < sinif.students.length; j++) {
          var o = sinif.students[j];
          h += '<label class="onay hedef-ogrenci">' +
            '<input type="checkbox" class="ogrenci-kutu" value="' + esc(o.id) + '" ' +
            'data-sinif="' + esc(sinif.id || ('yok' + c)) + '">' +
            '<span>' + esc(o.fullName) + '</span></label>';
        }
        h += '</div></div>';
      }
      h += '</div><div id="mHata" style="margin-top:9px"></div>';

      modalAc('Yeni ödev', h,
        '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
        '<button class="btn" data-act="odev-kaydet">Ödevi ver</button>');

      odevSecimBagla();
      teslimGunuBagla();
    });
  }

  /* Sınıf kutusu tüm öğrencilerini seçer; öğrenciler değişince sınıf kutusu güncellenir. */
  /* Tarih kutusuna bir gun secilince altinda hangi gune denk geldigini yazar. */
  function teslimGunuBagla() {
    var kutu = $('mBit');
    var not = $('mBitGun');
    if (!kutu || !not) return;
    var guncelle = function () {
      not.textContent = kutu.value ? gunAdi(kutu.value) + ' gününe denk geliyor' : '';
    };
    kutu.onchange = guncelle;
    kutu.oninput = guncelle;
    guncelle();
  }

  function odevSecimBagla() {
    var sinifKutulari = document.querySelectorAll('.sinif-kutu');
    var ogrenciKutulari = document.querySelectorAll('.ogrenci-kutu');

    function sayaciYenile() {
      var n = document.querySelectorAll('.ogrenci-kutu:checked').length;
      var e = $('odevSayac');
      if (e) e.textContent = n + ' öğrenci seçili';

      /* Sınıf kutusu: hepsi seçiliyse dolu, bir kısmı seçiliyse belirsiz */
      for (var i = 0; i < sinifKutulari.length; i++) {
        var sid = sinifKutulari[i].getAttribute('data-sinif');
        var hepsi = document.querySelectorAll('.ogrenci-kutu[data-sinif="' + sid + '"]');
        var secili = document.querySelectorAll('.ogrenci-kutu[data-sinif="' + sid + '"]:checked');
        sinifKutulari[i].checked = hepsi.length > 0 && secili.length === hepsi.length;
        sinifKutulari[i].indeterminate = secili.length > 0 && secili.length < hepsi.length;
      }
    }

    for (var i = 0; i < sinifKutulari.length; i++) {
      (function (kutu) {
        kutu.onchange = function () {
          var sid = kutu.getAttribute('data-sinif');
          var liste = document.querySelectorAll('.ogrenci-kutu[data-sinif="' + sid + '"]');
          for (var j = 0; j < liste.length; j++) liste[j].checked = kutu.checked;
          sayaciYenile();
        };
      })(sinifKutulari[i]);
    }
    for (var k = 0; k < ogrenciKutulari.length; k++) {
      ogrenciKutulari[k].onchange = sayaciYenile;
    }
    sayaciYenile();
  }

  function odevAc(id) {
    return api('/assignments/' + id).then(function (d) {
      var a = d.assignment;
      var h = hero(a.title.toLocaleUpperCase('tr'), a.subject + ' · ' +
        (a.endAt ? 'Son teslim ' + tarihGunSaat(a.endAt, a.endTime) : 'Süresiz'));

      /* Teslim tarihi geçmiş ya da sonuçlanmış olsa da sonuçlar değiştirilebilir;
         öğretmen bunu bilmezse ekranı salt okunur sanıyor. */
      if (a.status === 'finished' || teslimGecti(a.endAt, a.endTime)) {
        h += '<div class="msg bilgi">Bu ödevin süresi doldu' +
          (a.status === 'finished' ? ' ve sonuçlandırıldı' : '') +
          '. Sonuçları yine de değiştirip yeniden kaydedebilirsin.</div>';
      }
      if (a.description) h += '<div class="kart"><h3>Açıklama</h3><div>' + esc(a.description) + '</div></div>';

      h += '<div class="kart"><h3>Öğrenci sonuçları</h3>' +
        '<div class="hint" style="margin-bottom:10px">Her öğrenci için bir durum seç, sonra en alttaki butona bas.</div>';
      for (var i = 0; i < d.students.length; i++) {
        var s = d.students[i];
        h += '<div class="satir" data-ara="' + esc(s.fullName) + '">' +
          '<div class="buyu"><div class="ad">' + esc(s.fullName) + '</div></div>' +
          '<div style="display:flex;gap:5px;flex-wrap:wrap">';
        var anahtarlar = ['yapti', 'eksik', 'yapmadi', 'izinli', 'gelmedi'];
        for (var j = 0; j < anahtarlar.length; j++) {
          var k = anahtarlar[j];
          var secili = s.result === k;
          h += '<button class="btn kucuk ' + (secili ? '' : 'gri') + '" data-act="sonuc-sec" ' +
            'data-sid="' + esc(s.id) + '" data-val="' + k + '" ' +
            'style="' + (secili ? 'background:var(--ana)' : '') + '">' + SONUC[k].ad + '</button>';
        }
        h += '</div></div>';
      }
      h += '</div>';
      h += '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
        '<button class="btn" data-act="odev-bitir" data-id="' + esc(a.id) + '">' +
        (a.status === 'finished' ? 'Değişiklikleri kaydet' : 'Sonuçlandır ve kaydet') +
        '</button>' +
        (a.status === 'finished' ? '<button class="btn gri" data-act="odev-tekrar" data-id="' + esc(a.id) + '">Tekrar aç</button>' : '') +
        '<button class="btn gri" data-nav="ogr-odevler">Geri dön</button></div>';

      window.__sonuclar = {};
      for (var m = 0; m < d.students.length; m++) {
        if (d.students[m].result) window.__sonuclar[d.students[m].id] = d.students[m].result;
      }
      yaz(h);
    });
  }

  /* ---- ÖĞRETMEN: sınavlar ---- */
  SAYFALAR['ogr-sinavlar'] = function () {
    return api('/examgroups').then(function (d) {
      var h = hero('SINAVLAR', 'Önce bir sınav grubu (ör. Dönem 1 - Yarıyıl 1) oluştur, içine sınavları ekle.');
      h += '<button class="btn" data-act="grup-yeni">Yeni sınav grubu</button>';
      h += '<h3 class="sb">Sınav grupları (' + d.groups.length + ')</h3>';
      if (!d.groups.length) { yaz(h + bosKutu('sinav', 'Henüz sınav grubu yok.')); return; }
      h += '<div class="grid k2">';
      for (var i = 0; i < d.groups.length; i++) {
        var g = d.groups[i];
        h += '<div class="kart tikla" data-act="grup-ac" data-id="' + esc(g.id) + '" data-ara="' + esc(g.name) + '">' +
          '<h3>' + esc(g.name) + '</h3>' +
          '<div class="alt" style="color:var(--soluk);font-size:13px">' + esc(g.subject) + '</div>' +
          '<div style="margin-top:9px">' +
          '<span class="etiket">' + g.examCount + ' sınav</span> ' +
          '<span class="etiket ' + (g.weightTotal === 100 ? 'yesil' : 'turuncu') + '">Toplam etki %' + g.weightTotal + '</span>' +
          '</div></div>';
      }
      yaz(h + '</div>');
    });
  };

  function grupAc(id) {
    return api('/examgroups/' + id).then(function (d) {
      var g = d.group;
      var h = hero(g.name.toLocaleUpperCase('tr'), g.subject + ' · sınav grubu');
      h += '<button class="btn" data-act="sinav-yeni" data-id="' + esc(g.id) + '">Sınav ekle</button> ' +
        '<button class="btn gri" data-nav="ogr-sinavlar">Geri</button>' +
        '<button class="btn tehlike" style="float:right" data-act="grup-sil" data-id="' + esc(g.id) + '">Grubu sil</button>';

      h += '<h3 class="sb">Sınavlar</h3>';
      if (!d.exams.length) h += bosKutu('kutu', 'Bu grupta henüz sınav yok.');
      else {
        h += '<div class="kart">';
        for (var i = 0; i < d.exams.length; i++) {
          var e = d.exams[i];
          h += '<div class="satir" data-ara="' + esc(e.name) + '">' +
            '<div class="buyu"><div class="ad">' + esc(e.name) + '</div>' +
            '<div class="alt">' + e.graded + ' öğrencinin notu girildi</div></div>' +
            '<span class="etiket">Etki %' + e.weight + '</span>' +
            '<button class="btn kucuk" data-act="sinav-ac" data-id="' + esc(e.id) + '">Not gir</button>' +
            '<button class="btn kucuk tehlike" data-act="sinav-sil" data-id="' + esc(e.id) + '" data-gid="' + esc(g.id) + '">Sil</button>' +
            '</div>';
        }
        h += '</div>';
      }

      h += '<h3 class="sb">Grup ortalamaları (ağırlıklı)</h3>';
      if (!d.averages.length) h += bosKutu('kutu', 'Sana atanmış öğrenci yok.');
      else {
        h += '<div class="kart">';
        for (var j = 0; j < d.averages.length; j++) {
          var a = d.averages[j];
          h += '<div class="satir" data-ara="' + esc(a.fullName) + '">' +
            '<div class="buyu"><div class="ad">' + esc(a.fullName) + '</div>' +
            '<div class="cubuk"><i style="width:' + (a.average === null ? 0 : a.average) + '%"></i></div></div>' +
            '<span class="etiket ' + (a.average === null ? 'gri' : a.average >= 50 ? 'yesil' : 'kirmizi') + '">' +
            (a.average === null ? 'Not yok' : a.average) + '</span></div>';
        }
        h += '</div>';
      }
      yaz(h);
    });
  }

  function sinavAc(id) {
    return api('/exams/' + id).then(function (d) {
      var e = d.exam;
      var h = hero(e.name.toLocaleUpperCase('tr'), 'Etki oranı %' + e.weight + ' · 0-100 arası not gir');
      h += '<div class="kart"><div class="tablo-sar"><table class="t"><thead><tr><th>Öğrenci</th><th>Not</th></tr></thead><tbody>';
      for (var i = 0; i < d.students.length; i++) {
        var s = d.students[i];
        h += '<tr data-ara="' + esc(s.fullName) + '"><td>' + esc(s.fullName) + '</td>' +
          '<td><input type="number" min="0" max="100" step="0.5" data-not="' + esc(s.id) + '" ' +
          'value="' + (s.grade === null ? '' : esc(s.grade)) + '" placeholder="-"></td></tr>';
      }
      h += '</tbody></table></div></div>';
      h += '<button class="btn" data-act="not-kaydet" data-id="' + esc(e.id) + '" data-gid="' + esc(e.groupId) + '">Notları kaydet</button> ' +
        '<button class="btn gri" data-act="grup-ac" data-id="' + esc(e.groupId) + '">Geri</button>';
      yaz(h);
    });
  }

  /* ---- ÖĞRENCİ / VELİ görünümleri ---- */
  function hedefOgrenci() {
    return S.viewStudentId ? '?studentId=' + encodeURIComponent(S.viewStudentId) : '';
  }
  function kimIcin() { return S.viewStudentId ? S.viewStudentName : 'Senin'; }

  SAYFALAR.ilerleyisim = function () {
    return api('/progress' + hedefOgrenci()).then(function (d) {
      var h = hero('İLERLEYİŞ', S.viewStudentId ? S.viewStudentName + ' adına görüntülüyorsun.' : 'Ödev ve sınav durumun.');

      h += '<div class="kart"><h3>Derslere göre ödev durumu</h3>';
      if (!d.subjects.length) h += '<div style="color:var(--soluk)">Henüz sonuçlanmış ödev yok.</div>';
      else {
        var enBuyuk = 1;
        for (var i = 0; i < d.subjects.length; i++) if (d.subjects[i].toplam > enBuyuk) enBuyuk = d.subjects[i].toplam;
        h += '<div class="grafik">';
        for (var j = 0; j < d.subjects.length; j++) {
          var s = d.subjects[j];
          var yuk = 145 * (s.toplam / enBuyuk);
          h += '<div class="sutun-sar" title="' + esc(s.subject) + '">' +
            '<div class="sutun-us">' + (s.oran === null ? '-' : '%' + s.oran) + '</div>' +
            '<div class="sutun-yigin" style="height:' + yuk + 'px">' +
            cubuk('yapti', s.yapti, s.toplam) + cubuk('eksik', s.eksik, s.toplam) +
            cubuk('yapmadi', s.yapmadi, s.toplam) + cubuk('izinli', s.izinli, s.toplam) +
            cubuk('gelmedi', s.gelmedi, s.toplam) +
            '</div><div class="sutun-ad">' + esc(kisalt(s.subject)) + '</div></div>';
        }
        h += '</div><div class="gosterge">' +
          '<span><i style="background:var(--yesil)"></i>Yaptı</span>' +
          '<span><i style="background:var(--turuncu)"></i>Eksik</span>' +
          '<span><i style="background:var(--kirmizi)"></i>Yapmadı</span>' +
          '<span><i style="background:#9ca3af"></i>Gelmedi (izinli)</span>' +
          '<span><i style="background:#7f1d1d"></i>Gelmedi (izinsiz)</span></div>';
      }
      h += '</div>';

      h += '<div class="kart"><h3>Sınav grubu ortalamaları</h3>';
      if (!d.examGroups.length) h += '<div style="color:var(--soluk)">Henüz sınav notu yok.</div>';
      else {
        for (var k = 0; k < d.examGroups.length; k++) {
          var g = d.examGroups[k];
          h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(g.name) + '</div>' +
            '<div class="alt">' + esc(g.subject) + ' · ' + esc(g.teacherName) + '</div>' +
            '<div class="cubuk"><i style="width:' + (g.average === null ? 0 : g.average) + '%"></i></div></div>' +
            '<span class="etiket ' + (g.average === null ? 'gri' : g.average >= 50 ? 'yesil' : 'kirmizi') + '">' +
            (g.average === null ? 'Not yok' : g.average) + '</span></div>';
        }
      }
      h += '</div>';
      yaz(h);
    });
  };

  function cubuk(sinif, deger, toplam) {
    if (!deger) return '';
    return '<i class="' + sinif + '" style="height:' + (deger / toplam * 100) + '%"></i>';
  }
  function kisalt(s) {
    if (s.length <= 13) return s;
    return s.split(' ')[0];
  }

  /* ---- ödev filtreleri ---- */

  var ODEV_DURUMLAR = {
    ogrenci: [
      ['', 'Tüm durumlar'],
      ['aktif', 'Aktif olanlar'],
      ['gecmis', 'Geçmiş olanlar'],
      ['yapti', 'Yaptı'],
      ['yapmadi', 'Yapmadı'],
      ['eksik', 'Eksik'],
      ['izinli', 'Gelmedi (izinli)'],
      ['gelmedi', 'Gelmedi (izinsiz)'],
      ['notlanmadi', 'Değerlendirilmedi']
    ],
    ogretmen: [
      ['', 'Tüm durumlar'],
      ['aktif', 'Aktif olanlar'],
      ['sonuclandi', 'Sonuçlananlar'],
      ['gecikti', 'Süresi dolmuş, sonuçlanmamış']
    ]
  };

  function odevFiltreCubugu(list) {
    var f = S.odevF, dersler = [], i;
    for (i = 0; i < list.length; i++) {
      if (list[i].subject && dersler.indexOf(list[i].subject) < 0) dersler.push(list[i].subject);
    }
    dersler.sort(function (a, b) { return a.localeCompare(b, 'tr'); });

    var dersSec = '<option value="">Tüm dersler</option>';
    for (i = 0; i < dersler.length; i++) {
      dersSec += '<option value="' + esc(dersler[i]) + '"' +
        (f.ders === dersler[i] ? ' selected' : '') + '>' + esc(dersler[i]) + '</option>';
    }
    var durumlar = ODEV_DURUMLAR[f.mod] || ODEV_DURUMLAR.ogrenci;
    var durumSec = '';
    for (i = 0; i < durumlar.length; i++) {
      durumSec += '<option value="' + durumlar[i][0] + '"' +
        (f.durum === durumlar[i][0] ? ' selected' : '') + '>' + durumlar[i][1] + '</option>';
    }

    var dersAlani = dersler.length > 1
      ? '<div class="field"><label for="fDers">Ders</label><select id="fDers">' + dersSec + '</select></div>'
      : '';

    return '<div class="kart filtre">' +
      '<div class="filtre-satir">' + dersAlani +
      '<div class="field"><label for="fDurum">Durum</label><select id="fDurum">' + durumSec + '</select></div>' +
      '<div class="field"><label for="fBas">Son teslim başlangıç</label>' +
      '<input type="date" id="fBas" value="' + esc(f.bas) + '"></div>' +
      '<div class="field"><label for="fBit">Son teslim bitiş</label>' +
      '<input type="date" id="fBit" value="' + esc(f.bit) + '"></div>' +
      '<button type="button" class="btn gri kucuk" data-act="odev-filtre-temizle">Temizle</button>' +
      '</div><div class="filtre-ozet" id="fOzet"></div></div>';
  }

  function odevFiltrele(list) {
    var f = S.odevF;
    var t = nrm($('araKutu') && $('araKutu').value || '');
    /* Tarih kutuları yerel gün sınırlarına genişletilir, saat farkı sonucu kaydırmasın. */
    var bas = f.bas ? new Date(f.bas + 'T00:00:00') : null;
    var bit = f.bit ? new Date(f.bit + 'T23:59:59') : null;
    if (bas && isNaN(bas.getTime())) bas = null;
    if (bit && isNaN(bit.getTime())) bit = null;

    return list.filter(function (a) {
      if (f.ders && a.subject !== f.ders) return false;

      if (f.durum === 'aktif') { if (a.status !== 'active') return false; }
      else if (f.durum === 'gecmis') { if (a.status === 'active') return false; }
      else if (f.durum === 'sonuclandi') { if (a.status !== 'finished') return false; }
      else if (f.durum === 'gecikti') {
        var kalanGun = gunFarki(a.endAt);
        if (a.status !== 'active' || kalanGun === null || kalanGun >= 0) return false;
      }
      else if (f.durum === 'notlanmadi') { if (a.result) return false; }
      else if (f.durum) { if (a.result !== f.durum) return false; }

      if (bas || bit) {
        var d = a.endAt ? new Date(a.endAt) : null;
        if (!d || isNaN(d.getTime())) return false;
        if (bas && d < bas) return false;
        if (bit && d > bit) return false;
      }

      if (t) {
        var metin = nrm([a.title, a.subject, a.teacherName || '', a.description || ''].join(' '));
        if (metin.indexOf(t) < 0) return false;
      }
      return true;
    });
  }

  function odevSonucCiz() {
    var kap = $('odevSonuc');
    if (!kap) return;
    var ham = S.odevHam || [];
    var liste = odevFiltrele(ham);

    var ozet = $('fOzet');
    if (ozet) {
      ozet.textContent = liste.length === ham.length
        ? ham.length + ' ödev'
        : ham.length + ' ödevden ' + liste.length + ' tanesi gösteriliyor';
    }

    if (!liste.length) {
      kap.innerHTML = bosKutu('ara', ham.length
        ? 'Bu filtrelere uyan ödev yok. "Temizle" ile filtreleri sıfırlayabilirsin.'
        : 'Henüz ödev yok.');
      return;
    }

    var ogretmenMi = S.odevF.mod === 'ogretmen';
    var ciz = ogretmenMi ? odevListesiOgretmen : odevListesiOgrenci;
    var aktif = liste.filter(function (a) { return a.status === 'active'; });
    var gecmis = liste.filter(function (a) { return a.status !== 'active'; });
    var h = '';
    if (aktif.length) {
      h += '<h3 class="sb">Aktif ödevler (' + aktif.length + ')</h3>' + ciz(aktif);
    }
    if (gecmis.length) {
      h += '<h3 class="sb">Geçmiş ödevler (' + gecmis.length + ')</h3>' + ciz(gecmis);
    }
    kap.innerHTML = h;
  }

  function odevFiltreBagla() {
    var alanlar = [['fDers', 'ders'], ['fDurum', 'durum'], ['fBas', 'bas'], ['fBit', 'bit']];
    for (var i = 0; i < alanlar.length; i++) {
      (function (id, anahtar) {
        var el = $(id);
        if (!el) return;
        el.onchange = function () { S.odevF[anahtar] = el.value; odevSonucCiz(); };
      })(alanlar[i][0], alanlar[i][1]);
    }
  }

  SAYFALAR.odevler = function () {
    return api('/progress' + hedefOgrenci()).then(function (d) {
      S.odevHam = d.assignments || [];
      S.araHook = odevSonucCiz;
      var h = hero('ÖDEVLER', S.viewStudentId ? S.viewStudentName + ' adına görüntülüyorsun.' : '');
      h += odevFiltreCubugu(S.odevHam);
      h += '<div id="odevSonuc"></div>';
      yaz(h);
      odevFiltreBagla();
      odevSonucCiz();
    });
  };

  function odevListesiOgrenci(list) {
    var h = '<div class="kart">';
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      var kalan = gunFarki(a.endAt);
      var sag;
      if (a.result) {
        var r = SONUC[a.result];
        sag = '<span class="etiket ' + r.renk + '">' + r.ad + '</span>';
      } else if (a.status === 'finished') {
        sag = '<span class="etiket gri">Değerlendirilmedi</span>';
      } else if (kalan !== null && kalan < 0) {
        sag = '<span class="etiket kirmizi">Süresi doldu</span>';
      } else if (kalan !== null) {
        sag = '<span class="etiket ' + (kalan <= 1 ? 'turuncu' : 'mavi') + '">' + kalan + ' gün kaldı</span>';
      } else sag = '<span class="etiket mavi">Aktif</span>';

      h += '<div class="satir" data-ara="' + esc(a.title + ' ' + a.subject) + '">' +
        '<div class="buyu"><div class="ad">' + esc(a.title) + '</div>' +
        '<div class="alt">' + esc(a.subject) + ' · ' + esc(a.teacherName) +
        (a.endAt ? ' · son teslim ' + tarihGunSaat(a.endAt, a.endTime) : '') + '</div>' +
        (a.description ? '<div class="alt" style="margin-top:4px">' + esc(a.description) + '</div>' : '') +
        '</div>' + sag + '</div>';
    }
    return h + '</div>';
  }

  SAYFALAR.sinavlarim = function () {
    return api('/progress' + hedefOgrenci()).then(function (d) {
      var h = hero('SINAVLAR', S.viewStudentId ? S.viewStudentName + ' adına görüntülüyorsun.' : 'Notların ve ağırlıklı ortalamaların.');
      if (!d.examGroups.length) { yaz(h + bosKutu('sinav', 'Henüz sınav notun yok.')); return; }
      for (var i = 0; i < d.examGroups.length; i++) {
        var g = d.examGroups[i];
        h += '<div class="kart" data-ara="' + esc(g.name + ' ' + g.subject) + '"><h3>' + esc(g.name) + '</h3>' +
          '<div style="color:var(--soluk);font-size:13px;margin-bottom:10px">' + esc(g.subject) + ' · ' + esc(g.teacherName) + '</div>' +
          '<div class="tablo-sar"><table class="t"><thead><tr><th>Sınav</th><th>Etki</th><th>Not</th></tr></thead><tbody>';
        for (var j = 0; j < g.exams.length; j++) {
          var e = g.exams[j];
          h += '<tr><td>' + esc(e.name) + '</td><td>%' + e.weight + '</td><td><b>' +
            (e.grade === null || e.grade === undefined ? '<span style="color:var(--soluk)">-</span>' : esc(e.grade)) + '</b></td></tr>';
        }
        h += '</tbody></table></div>' +
          '<div class="satir" style="border-top:2px solid var(--cizgi);margin-top:6px">' +
          '<div class="buyu"><b>Grup ortalaması</b><div class="cubuk"><i style="width:' + (g.average === null ? 0 : g.average) + '%"></i></div></div>' +
          '<span class="etiket ' + (g.average === null ? 'gri' : g.average >= 50 ? 'yesil' : 'kirmizi') + '">' +
          (g.average === null ? 'Not yok' : g.average) + '</span></div></div>';
      }
      yaz(h);
    });
  };

  /* ================= ROLLER VE YETKİLER ================= */

  /* ================= Excel aktarım ================= */

  var AKTARIM_ADLARI = {
    ogrenci: { isim: 'Öğrenci listesi', dosya: 'ogrenci-listesi-sablon.xlsx' },
    program: { isim: 'Ders programı', dosya: 'ders-programi-sablon.xlsx' }
  };

  var DISA_LISTE = [
    { k: 'ogrenci', ad: 'Öğrenci listesi', alt: 'Ad, kullanıcı adı, sınıf, giriş kodu', dosya: 'ogrenciler.xlsx' },
    { k: 'ogretmen', ad: 'Öğretmen listesi', alt: 'Branş, verdiği dersler, sınıflar', dosya: 'ogretmenler.xlsx' },
    { k: 'program', ad: 'Ders programı', alt: 'Sınıf, gün, saat, ders, öğretmen', dosya: 'ders-programi.xlsx' }
  ];

  function turSecici(tur, secili) {
    var t = AKTARIM_ADLARI[tur];
    var alt = tur === 'ogrenci'
      ? 'Listeyi yükle, hesaplar toplu açılsın'
      : 'Ders saatlerini programa toplu ekle';
    return '<button class="tur-sec' + (secili === tur ? ' secili' : '') +
      '" data-act="aktarim-tur" data-tur="' + tur + '">' +
      '<div class="ad">' + t.isim + '</div>' +
      '<div class="alt">' + alt + '</div></button>';
  }

  SAYFALAR.aktarim = function () {
    if (!S.aktarim) S.aktarim = { yon: 'ice', tur: 'ogrenci', dosyaAd: '', dosya: '', rapor: null };
    if (!S.aktarim.yon) S.aktarim.yon = 'ice';
    var A = S.aktarim;
    var isim = AKTARIM_ADLARI[A.tur].isim;

    var h = hero('EXCEL AKTARIM',
      'Listeleri Excel dosyasıyla topluca al ya da ver.');

    /* Sayfa iki ayrı iş yapıyor; ikisini aynı anda göstermek kafa karıştırıyordu. */
    h += '<div class="kart"><div class="sekme-satir">' +
      '<button class="sekme' + (A.yon === 'ice' ? ' secili' : '') +
      '" data-act="aktarim-yon" data-yon="ice">Excel\'den içeri aktar</button>' +
      '<button class="sekme' + (A.yon === 'disa' ? ' secili' : '') +
      '" data-act="aktarim-yon" data-yon="disa">Excel olarak dışarı aktar</button>' +
      '</div></div>';

    /* ================= DIŞARI AKTAR ================= */
    if (A.yon === 'disa') {
      h += '<div class="kart"><h3>Neyi indirmek istiyorsun?</h3>' +
        '<div class="hint" style="margin-bottom:14px">' +
        'Şu anki kayıtlar Excel dosyası olarak iner. İstediğin gibi ' +
        'düzenleyip saklayabilir, yazdırabilirsin.</div>';
      for (var d = 0; d < DISA_LISTE.length; d++) {
        var x = DISA_LISTE[d];
        h += '<div class="satir">' +
          '<div class="buyu"><div class="ad">' + x.ad + '</div>' +
          '<div class="alt">' + x.alt + '</div></div>' +
          '<button class="btn kucuk ghost" data-act="aktarim-disa" data-tur="' + x.k +
          '">İndir</button></div>';
      }
      h += '</div>';
      yaz(h);
      return;
    }

    /* ================= İÇERİ AKTAR ================= */

    /* Son işlemin sonucu en üstte dursun. */
    if (A.sonuc) {
      h += '<div class="kart"><h3>İşlem tamamlandı</h3>' +
        '<div class="msg iyi">' + esc(A.sonuc.message) + '</div>';
      if (A.sonuc.ogrenciler && A.sonuc.ogrenciler.length) {
        h += '<div class="hint" style="margin:12px 0 8px">' +
          'Giriş kodlarını velilere ver — çocuklarını hesaplarına bu kodla bağlarlar. ' +
          'Kodlar öğrenci listesinde de duruyor, sonra da indirebilirsin.</div>' +
          '<div class="rapor-kaydir"><table class="rapor-tablo"><thead><tr>' +
          '<th>Öğrenci</th><th>Kullanıcı adı</th><th>Giriş kodu</th>' +
          '</tr></thead><tbody>';
        for (var si = 0; si < A.sonuc.ogrenciler.length; si++) {
          var o = A.sonuc.ogrenciler[si];
          h += '<tr><td>' + esc(o.ad) + '</td><td>' + esc(o.eposta) +
            '</td><td><code>' + esc(o.kod) + '</code></td></tr>';
        }
        h += '</tbody></table></div>';
      }
      h += '<div style="margin-top:14px">' +
        '<button class="btn gri" data-act="aktarim-temizle">Tamam</button></div></div>';
    }

    h += '<div class="kart"><h3>Ne yükleyeceksin?</h3>' +
      '<div class="grid k2">' + turSecici('ogrenci', A.tur) +
      turSecici('program', A.tur) + '</div></div>';

    /* Adımlar tek kartta, sırayla. */
    h += '<div class="kart"><h3>' + esc(isim) + ' yükleme</h3>';

    h += '<div class="adim">' +
      '<div class="adim-no">1</div>' +
      '<div class="buyu"><div class="ad">Boş şablonu indir</div>' +
      '<div class="alt">Sütun başlıkları hazır gelir. İçinde nasıl doldurulacağını ' +
      'anlatan ikinci bir sayfa vardır.</div>' +
      '<button class="btn ghost kucuk" data-act="aktarim-sablon" ' +
      'style="margin-top:10px">Şablonu indir</button></div></div>';

    h += '<div class="adim">' +
      '<div class="adim-no">2</div>' +
      '<div class="buyu"><div class="ad">Excel\'de doldur</div>' +
      '<div class="alt">' +
      (A.tur === 'ogrenci'
        ? 'Her satır bir öğrenci. Ad soyad, kullanıcı adı ve şifre zorunlu.'
        : 'Her satır bir ders saati. Sınıf, gün, saat ve ders zorunlu.') +
      '</div></div></div>';

    h += '<div class="adim">' +
      '<div class="adim-no">3</div>' +
      '<div class="buyu"><div class="ad">Dosyayı buraya yükle</div>' +
      '<input type="file" id="aktarimDosya" accept=".xlsx" style="display:none">' +
      '<div class="satir" style="border:0;padding:10px 0 0">' +
      '<button class="btn ghost" data-act="aktarim-sec">Dosya seç</button>' +
      '<div class="buyu" style="padding:0 14px">' +
      (A.dosyaAd ? '<b>' + esc(A.dosyaAd) + '</b>'
        : '<span class="soluk">Henüz dosya seçilmedi</span>') + '</div>' +
      (A.dosya ? '<button class="btn" data-act="aktarim-yukle">Kontrol et</button>' : '') +
      '</div>' +
      '<div class="alt" style="margin-top:8px">Önce ne olacağını gösteririz, ' +
      'sen onaylayınca uygulanır. Hiçbir şey habersiz değişmez.</div>' +
      '<div id="aktarimMesaj" style="margin-top:10px"></div></div></div>';

    h += '</div>';

    /* --- kontrol raporu --- */
    if (A.rapor) {
      var oz = A.ozet;
      h += '<div class="kart"><h3>Kontrol sonucu</h3>';
      h += '<div class="grid k4" style="margin-bottom:16px">' +
        stat(oz.hazir, A.tur === 'ogrenci' ? 'Hesap açılacak' : 'Ders eklenecek') +
        stat(oz.hatali, 'Hatalı satır') +
        (oz.uyarili ? stat(oz.uyarili, 'Uyarılı') : '') + '</div>';

      if (!A.rapor.length) {
        h += bosKutu('belge', 'Dosyada işlenecek satır bulunamadı.');
      } else {
        h += '<div class="rapor-kaydir"><table class="rapor-tablo"><thead><tr>' +
          '<th class="rapor-no">Satır</th><th>Kayıt</th><th>Durum</th>' +
          '<th>Açıklama</th></tr></thead><tbody>';
        for (var i = 0; i < A.rapor.length; i++) {
          var r = A.rapor[i];
          h += '<tr><td class="rapor-no">' + r.satir + '</td>' +
            '<td>' + esc(r.ad || '') + '</td>' +
            '<td><span class="durum ' + esc(r.durum) + '">' +
            esc(DURUM_AD[r.durum] || r.durum) + '</span></td>' +
            '<td>' + esc(r.mesaj) + '</td></tr>';
        }
        h += '</tbody></table></div>';
      }

      if (oz.hazir) {
        h += '<div class="satir" style="margin-top:16px;justify-content:flex-end">' +
          '<button class="btn gri" data-act="aktarim-vazgec">Vazgeç</button>' +
          '<button class="btn" data-act="aktarim-uygula">' +
          (A.tur === 'ogrenci'
            ? oz.hazir + ' hesabı aç'
            : oz.hazir + ' ders saatini ekle') + '</button></div>';
      } else {
        h += '<div class="msg hata">İşlenecek geçerli satır yok. ' +
          'Yukarıdaki hataları düzeltip dosyayı yeniden yükle.</div>';
      }
      h += '</div>';
    }

    yaz(h);
    aktarimDosyaBagla();
  };

  var DURUM_AD = {
    hazir: 'Hazır', hata: 'Hata', uyari: 'Dikkat', atlandi: 'Atlandı'
  };

  /* Dosya girişini her çizimden sonra yeniden bağlamak gerekiyor:
     sayfa innerHTML ile baştan yazılıyor, eski dinleyici gidiyor. */
  function aktarimDosyaBagla() {
    var giris = $('aktarimDosya');
    if (!giris) return;
    giris.onchange = function () {
      var d = giris.files && giris.files[0];
      if (!d) return;
      if (d.size > 1200000) {
        mesajGoster('aktarimMesaj', 'hata',
          'Dosya çok büyük (en fazla 1 MB). Listeyi ikiye bölüp iki kez yükle.');
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
      okuyucu.onerror = function () {
        mesajGoster('aktarimMesaj', 'hata', 'Dosya okunamadı.');
      };
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

  /* ================= eğitim yılı ================= */

  /* Sayfanın en üstünde, geçmiş yıla bakılıyorsa uyarı şeridi. */
  function yilSeridi() {
    var y = S.yilBilgi;
    if (!y || !y.yillar || y.yillar.length < 2) return '';
    var bakilan = null;
    for (var i = 0; i < y.yillar.length; i++) {
      if (y.yillar[i].bakilan) bakilan = y.yillar[i];
    }
    if (!bakilan) return '';

    var h = '<div class="yil-seridi' + (y.arsiv ? ' arsiv' : '') + '">' +
      '<span class="yil-etiket">Eğitim yılı</span>' +
      '<select id="yilSec">';
    for (var j = 0; j < y.yillar.length; j++) {
      var x = y.yillar[j];
      h += '<option value="' + esc(x.id) + '"' + (x.bakilan ? ' selected' : '') + '>' +
        esc(x.ad) + (x.aktif ? ' (aktif)' : '') + '</option>';
    }
    h += '</select>';
    if (y.arsiv) {
      h += '<span class="yil-not">Geçmiş yıla bakıyorsun — kayıtlar salt okunur.</span>';
    }
    return h + '</div>';
  }

  /* Yıl bilgisini bir kez çekip saklıyoruz; her sayfada tekrar sormaya gerek yok. */
  function yilBilgisiYukle() {
    if (!S.user || !S.user.schoolId) return Promise.resolve();
    return api('/egitim-yili').then(function (d) {
      S.yilBilgi = d;
    })['catch'](function () { S.yilBilgi = null; });
  }

  SAYFALAR['egitim-yili'] = function () {
    return api('/egitim-yili').then(function (d) {
      S.yilBilgi = d;
      var h = hero('EĞİTİM YILI', '');

      h += '<div class="kart"><div class="hint" style="margin-bottom:12px">' +
        'Her eğitim yılı kendi programını, ödevlerini ve devamsızlık kaydını ' +
        'tutar. Yeni yıl açtığında eskisi silinmez — istediğin zaman geri ' +
        'dönüp bakabilirsin.</div>';

      if (!d.yillar.length) {
        h += '<div class="msg bilgi">Henüz eğitim yılı tanımlamadın. ' +
          'Şimdiye kadarki tüm kayıtlar açacağın ilk yıla ait sayılacak.</div>';
      } else {
        for (var i = 0; i < d.yillar.length; i++) {
          var y = d.yillar[i];
          h += '<div class="satir">' +
            '<div class="buyu"><div class="ad">' + esc(y.ad) +
            (y.aktif ? ' <span class="etiket yesil">Aktif</span>' : '') +
            (y.bakilan && !y.aktif ? ' <span class="etiket mavi">Bakılan</span>' : '') +
            '</div><div class="alt">' + tarihGun(y.bas) + ' — ' + tarihGun(y.bit) +
            '</div></div>' +
            (y.bakilan ? '' :
              '<button class="btn kucuk ghost" data-act="yil-bak" data-id="' +
              esc(y.id) + '">Bu yıla bak</button>') +
            (d.yonetebilir && !y.aktif ?
              '<button class="btn kucuk gri" data-act="yil-aktif" data-id="' +
              esc(y.id) + '">Aktif yap</button>' : '') +
            '</div>';
        }
      }
      h += '</div>';

      if (d.yonetebilir) {
        var simdi = new Date();
        var basYil = simdi.getMonth() >= 7 ? simdi.getFullYear() : simdi.getFullYear() - 1;
        h += '<div class="kart"><h3>Yeni eğitim yılı aç</h3>' +
          '<div class="satir" style="border:0;padding:0">' +
          '<div class="field" style="margin:0;max-width:190px">' +
          '<input type="text" id="yilAd" placeholder="' + basYil + '-' + (basYil + 1) +
          '" maxlength="9"></div>' +
          '<button class="btn" data-act="yil-ekle">Aç ve aktif yap</button></div>' +
          '<div class="hint" style="margin-top:10px">' +
          'Yeni yıl aktif olur; bundan sonra açılan ödev, program ve yoklama ' +
          'kayıtları bu yıla yazılır. Sınıflar ve öğrenciler ortak kalır.</div>' +
          '<div id="yilMesaj" style="margin-top:10px"></div></div>';
      }

      yaz(h);
    });
  };

  /* ================= takvim ================= */

  var AY_ADLARI = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var GUN_BASLIK = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  var OLAY_AD = {
    tatil: 'Tatil', ozel: 'Özel gün', odev: 'Ödev',
    etkinlik: 'Etkinlik', sinav: 'Sınav', toplanti: 'Toplantı'
  };

  SAYFALAR.takvim = function () {
    var bugun = new Date();
    if (!S.takvimYil) S.takvimYil = bugun.getFullYear();
    if (!S.takvimAy) S.takvimAy = bugun.getMonth() + 1;

    var yol = '/takvim?yil=' + S.takvimYil + '&ay=' + S.takvimAy +
      (S.viewStudentId && S.user.role !== 'student'
        ? '&studentId=' + encodeURIComponent(S.viewStudentId) : '');

    return api(yol).then(function (d) {
      var h = hero('TAKVIM', d.ogrenci && S.viewStudentId && S.user.role !== 'student'
        ? d.ogrenci.ad + ' adına görüntülüyorsun.'
        : 'Ödev teslim tarihleri, dersler, tatiller ve okul etkinlikleri.');

      /* --- ay gezinme --- */
      h += '<div class="kart"><div class="takvim-ust">' +
        '<button class="btn kucuk ghost" data-act="takvim-ay" data-yon="-1">‹</button>' +
        '<div class="takvim-baslik">' + AY_ADLARI[d.ay - 1] + ' ' + d.yil + '</div>' +
        '<button class="btn kucuk ghost" data-act="takvim-ay" data-yon="1">›</button>' +
        '<button class="btn kucuk gri" data-act="takvim-bugun">Bugün</button>' +
        '<div class="buyu"></div>' +
        '<select id="takvimYilSec" class="tarih-kutu">';
      for (var y = d.yil - 3; y <= d.yil + 3; y++) {
        h += '<option value="' + y + '"' + (y === d.yil ? ' selected' : '') + '>' + y + '</option>';
      }
      h += '</select>';
      if (d.yonetebilir) {
        h += '<button class="btn kucuk" data-act="takvim-etkinlik-ekle">Etkinlik ekle</button>';
      }
      h += '</div>';

      /* --- ızgara --- */
      h += '<div class="takvim-izgara">';
      for (var g = 0; g < 7; g++) {
        h += '<div class="takvim-gun-basligi' + (g >= 5 ? ' haftasonu' : '') + '">' +
          GUN_BASLIK[g] + '</div>';
      }
      for (var b = 0; b < d.basSutun; b++) h += '<div class="takvim-hucre bos"></div>';

      for (var i = 0; i < d.gunler.length; i++) {
        var gn = d.gunler[i];
        var sinif = 'takvim-hucre';
        if (gn.haftaSonu) sinif += ' haftasonu';
        if (gn.tatil) sinif += ' tatil';
        if (gn.bugun) sinif += ' bugun';
        if (S.takvimSecili === gn.tarih) sinif += ' secili';

        h += '<button class="' + sinif + '" data-act="takvim-gun" data-tarih="' +
          gn.tarih + '">' +
          '<span class="gun-no">' + gn.gun + '</span>';

        if (gn.dersSayisi) {
          h += '<span class="gun-ders">' + gn.dersSayisi + ' ders</span>';
        }
        h += '<span class="gun-isaretler">';
        for (var j = 0; j < gn.olaylar.length && j < 4; j++) {
          var o = gn.olaylar[j];
          h += '<span class="isaret ' + esc(o.tur) + '" title="' + esc(o.baslik) + '"></span>';
        }
        h += '</span>';

        /* Tatil ve özel gün adı hücrede görünsün */
        var adli = null;
        for (var k = 0; k < gn.olaylar.length; k++) {
          if (gn.olaylar[k].tur === 'tatil' || gn.olaylar[k].tur === 'ozel') {
            adli = gn.olaylar[k]; break;
          }
        }
        if (adli) h += '<span class="gun-etiket">' + esc(adli.baslik) + '</span>';

        h += '</button>';
      }
      h += '</div>';

      /* --- açıklama --- */
      h += '<div class="takvim-lejant">' +
        '<span><i class="isaret odev"></i> Ödev teslimi</span>' +
        '<span><i class="isaret tatil"></i> Tatil</span>' +
        '<span><i class="isaret ozel"></i> Özel gün</span>' +
        '<span><i class="isaret etkinlik"></i> Etkinlik</span>' +
        '<span><i class="isaret sinav"></i> Sınav</span>' +
        '</div></div>';

      h += '<div id="takvimGun"></div>';
      yaz(h);

      var sec = $('takvimYilSec');
      if (sec) sec.onchange = function () {
        S.takvimYil = Number(this.value);
        git('takvim');
      };

      if (S.takvimSecili) takvimGunCiz(S.takvimSecili);
    });
  };

  function takvimGunCiz(tarih) {
    var alan = $('takvimGun');
    if (!alan) return;
    alan.innerHTML = '<div class="kart"><div class="hint">Yükleniyor...</div></div>';

    var yol = '/takvim/gun?tarih=' + encodeURIComponent(tarih) +
      (S.viewStudentId && S.user.role !== 'student'
        ? '&studentId=' + encodeURIComponent(S.viewStudentId) : '');

    return api(yol).then(function (d) {
      var p = tarih.split('-');
      var baslik = Number(p[2]) + ' ' + AY_ADLARI[Number(p[1]) - 1] + ' ' + p[0] +
        ' · ' + d.gunAdi;

      var h = '<div class="kart"><h3>' + baslik + '</h3>';

      if (d.olaylar.length) {
        h += '<div class="gun-olaylar">';
        for (var i = 0; i < d.olaylar.length; i++) {
          var o = d.olaylar[i];
          h += '<div class="olay-satir ' + esc(o.tur) + '">' +
            '<span class="olay-tur">' + (OLAY_AD[o.tur] || o.tur) + '</span>' +
            '<span class="buyu">' + esc(o.baslik) +
            (o.aciklama ? ' <span class="alt">' + esc(o.aciklama) + '</span>' : '') + '</span>' +
            (o.silinebilir && d.yonetebilir
              ? '<button class="btn kucuk ghost" data-act="takvim-etkinlik-sil" data-id="' +
                esc(o.id) + '">Kaldır</button>' : '') +
            '</div>';
        }
        h += '</div>';
      }

      /* teslim edilecek ödevler */
      h += '<h4 class="alt-baslik">Bugün teslim edilecek</h4>';
      if (!d.teslim.length) {
        h += '<div class="hint">Bu gün teslim edilecek ödev yok.</div>';
      } else {
        for (var t = 0; t < d.teslim.length; t++) {
          var od = d.teslim[t];
          h += '<div class="satir tiklanir" data-nav="odevler">' +
            '<div class="buyu"><div class="ad">' + esc(od.baslik) + '</div>' +
            '<div class="alt">' + esc(od.ders) +
            (od.saat ? ' · saat ' + esc(od.saat) : '') +
            (od.durum === 'active' ? '' : ' · sonuçlandı') + '</div></div></div>';
        }
      }

      if (d.yaklasan.length) {
        h += '<h4 class="alt-baslik">Önümüzdeki 7 gün</h4>';
        for (var y = 0; y < d.yaklasan.length; y++) {
          var ya = d.yaklasan[y];
          var yp = ya.tarih.split('-');
          h += '<div class="satir"><div class="buyu">' +
            '<div class="ad">' + esc(ya.baslik) + '</div>' +
            '<div class="alt">' + esc(ya.ders) + ' · ' +
            Number(yp[2]) + ' ' + AY_ADLARI[Number(yp[1]) - 1] + ' ' +
            gunAdi(ya.tarih) + (ya.saat ? ' · ' + esc(ya.saat) : '') + '</div></div></div>';
        }
      }

      if (d.dersler.length) {
        h += '<h4 class="alt-baslik">O günün dersleri</h4>' +
          '<div class="rapor-kaydir"><table class="rapor-tablo"><thead><tr>' +
          '<th>Saat</th><th>Ders</th><th>Sınıf</th><th>Öğretmen</th>' +
          '</tr></thead><tbody>';
        for (var dd = 0; dd < d.dersler.length; dd++) {
          var ders = d.dersler[dd];
          h += '<tr><td>' + esc(ders.bas) + ' - ' + esc(ders.bit) + '</td>' +
            '<td>' + esc(ders.ders) + '</td><td>' + esc(ders.sinif) + '</td>' +
            '<td>' + esc(ders.ogretmen) + '</td></tr>';
        }
        h += '</tbody></table></div>';
      }

      h += '</div>';
      alan.innerHTML = h;
    })['catch'](function (e) {
      alan.innerHTML = '<div class="kart"><div class="msg hata">' + esc(e.message) + '</div></div>';
    });
  }

  function takvimEtkinlikModal() {
    var bugunT = S.takvimSecili || new Date().toISOString().slice(0, 10);
    var govde = '<div class="field"><label for="tkBaslik">Başlık</label>' +
      '<input type="text" id="tkBaslik" maxlength="100" placeholder="Veli toplantısı"></div>' +
      '<div class="field"><label for="tkTur">Tür</label><select id="tkTur">' +
      '<option value="etkinlik">Etkinlik</option>' +
      '<option value="tatil">Tatil</option>' +
      '<option value="sinav">Sınav</option>' +
      '<option value="toplanti">Toplantı</option></select></div>' +
      '<div class="grid k2">' +
      '<div class="field"><label for="tkTarih">Başlangıç</label>' +
      '<input type="date" id="tkTarih" value="' + esc(bugunT) + '"></div>' +
      '<div class="field"><label for="tkBitis">Bitiş (isteğe bağlı)</label>' +
      '<input type="date" id="tkBitis"></div></div>' +
      '<div class="field"><label for="tkAciklama">Açıklama</label>' +
      '<textarea id="tkAciklama" rows="3" maxlength="300"></textarea></div>' +
      '<div id="tkMesaj"></div>';

    modalAc('Takvime ekle', govde,
      '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
      '<button class="btn" data-act="takvim-etkinlik-kaydet">Ekle</button>');
  }

  /* ================= devamsızlık ================= */

  var DURUM_RENK = { var: 'var', yok: 'yok', gec: 'gec', izinli: 'izinli' };

  /* --- öğretmen: yoklama --- */
  SAYFALAR.yoklama = function () {
    return api('/devamsizlik/derslerim').then(function (d) {
      var h = hero('YOKLAMA', 'Ders seç, günü işaretle, kaydet.');

      if (!d.dersler.length) {
        h += bosKutu('onay', 'Yoklama alabileceğin ders yok. ' +
          'Müdürün seni bir derse ataması gerekiyor.');
        yaz(h);
        return;
      }

      h += '<div class="kart"><h3>Ders seç</h3><div class="grid k3">';
      for (var i = 0; i < d.dersler.length; i++) {
        var l = d.dersler[i];
        h += '<button class="tur-sec' + (S.yoklamaDers === l.id ? ' secili' : '') +
          '" data-act="yoklama-ders" data-id="' + esc(l.id) + '">' +
          '<div class="ad">' + esc(l.sinif) + ' · ' + esc(l.ders) + '</div>' +
          '<div class="alt">' + l.ogrenciSayisi + ' öğrenci</div></button>';
      }
      h += '</div></div><div id="yoklamaAlan"></div>';
      yaz(h);

      if (S.yoklamaDers) yoklamaCiz();
    });
  };

  function yoklamaCiz() {
    var alan = $('yoklamaAlan');
    if (!alan) return;
    alan.innerHTML = '<div class="kart"><div class="hint">Yükleniyor...</div></div>';

    var yol = '/devamsizlik/yoklama?lessonId=' + encodeURIComponent(S.yoklamaDers) +
      (S.yoklamaTarih ? '&tarih=' + S.yoklamaTarih : '');

    return api(yol).then(function (d) {
      S.yoklamaTarih = d.tarih;
      S.yoklamaDurum = {};
      for (var i = 0; i < d.ogrenciler.length; i++) {
        S.yoklamaDurum[d.ogrenciler[i].id] = d.ogrenciler[i].durum;
      }

      var h = '<div class="kart"><div class="satir" style="border:0;padding:0 0 14px">' +
        '<div class="buyu"><h3 style="margin:0">' + esc(d.ders.sinif) + ' · ' +
        esc(d.ders.ad) + '</h3></div>' +
        '<input type="date" id="yoklamaTarih" value="' + esc(d.tarih) + '" class="tarih-kutu">' +
        '</div>';

      h += '<div class="satir" style="padding:0 0 12px">' +
        '<div class="buyu hint">Gelmeyenleri işaretle. İşaretlemediklerin derste sayılır.</div>' +
        '<button class="btn kucuk ghost" data-act="yoklama-hepsi-var">Hepsi geldi</button>' +
        '</div>';

      for (var j = 0; j < d.ogrenciler.length; j++) {
        var o = d.ogrenciler[j];
        h += '<div class="yoklama-satir">' +
          '<div class="buyu"><div class="ad">' + esc(o.ad) + '</div></div>' +
          '<div class="durum-secim" data-ogrenci="' + esc(o.id) + '">';
        for (var k = 0; k < d.durumlar.length; k++) {
          var du = d.durumlar[k];
          h += '<button class="durum-dugme ' + du.k + (o.durum === du.k ? ' secili' : '') +
            '" data-act="yoklama-durum" data-ogrenci="' + esc(o.id) +
            '" data-durum="' + du.k + '">' + du.ad + '</button>';
        }
        h += '</div></div>';
      }

      h += '<div id="yoklamaMesaj" style="margin:14px 0"></div>' +
        '<button class="btn" data-act="yoklama-kaydet">Yoklamayı kaydet</button></div>';

      alan.innerHTML = h;
      var tar = $('yoklamaTarih');
      if (tar) tar.onchange = function () {
        S.yoklamaTarih = this.value;
        yoklamaCiz();
      };
    })['catch'](function (e) {
      alan.innerHTML = '<div class="kart"><div class="msg hata">' + esc(e.message) + '</div></div>';
    });
  }

  /* --- öğrenci: kendi devamsızlığı --- */
  SAYFALAR.devamsizligim = function () {
    /* Veli ya da müdür bir öğrencinin portalını açtıysa onun kaydını göster. */
    var baskasi = S.viewStudentId && S.user.role !== 'student';
    var yol = baskasi
      ? '/devamsizlik/ogrenci?studentId=' + encodeURIComponent(S.viewStudentId)
      : '/devamsizlik/benim';
    return api(yol).then(function (d) {
      yaz(devamsizlikGovdesi(
        baskasi ? 'DEVAMSIZLIK' : 'DEVAMSIZLIĞIM',
        baskasi ? S.viewStudentName + ' adına görüntülüyorsun.' : 'Derslere katılım kaydın.',
        d, baskasi));
    });
  };

  function devamsizlikGovdesi(baslik, alt, d, adGoster) {
    var h = hero(baslik, alt);
    h += '<div class="grid k4" style="margin-bottom:18px">' +
      stat(d.sayim.yok, 'Gelmedi') +
      stat(d.sayim.gec, 'Geç geldi') +
      stat(d.sayim.izinli, 'İzinli') +
      stat(d.toplam, 'Toplam kayıt') + '</div>';

    if (!d.kayitlar.length) {
      h += bosKutu('onay', 'Hiç devamsızlık kaydın yok. Böyle devam.');
      return h;
    }

    h += '<div class="kart" style="padding:0">';
    for (var i = 0; i < d.kayitlar.length; i++) {
      var k = d.kayitlar[i];
      h += '<div class="satir">' +
        '<div class="buyu"><div class="ad">' + esc(k.ders || 'Ders') +
        ' <span class="durum-etiket ' + esc(k.durum) + '">' + esc(k.durumAd) + '</span></div>' +
        '<div class="alt">' + esc(k.tarih) +
        (k.alan ? ' · ' + esc(k.alan) : '') +
        (k.not ? ' · ' + esc(k.not) : '') + '</div></div></div>';
    }
    h += '</div>';
    return h;
  }

  /* --- müdür: sınıf > öğrenci > gün --- */
  SAYFALAR.devamsizlik = function () {
    return api('/school/classes').then(function (r) {
      var siniflar = r.classes || [];
      if (!S.dvSinif && siniflar.length) S.dvSinif = siniflar[0].id;
      if (!S.dvTarih) S.dvTarih = new Date().toISOString().slice(0, 10);

      var h = hero('DEVAMSIZLIK', '');

      h += '<div class="kart"><div class="filtre-satir">' +
        '<div class="field"><label for="dvSinif">Sınıf</label><select id="dvSinif">';
      for (var i = 0; i < siniflar.length; i++) {
        h += '<option value="' + esc(siniflar[i].id) + '"' +
          (S.dvSinif === siniflar[i].id ? ' selected' : '') + '>' +
          esc(siniflar[i].name) + '</option>';
      }
      h += '</select></div>' +
        '<div class="field"><label for="dvOgrenci">Öğrenci</label>' +
        '<select id="dvOgrenci"><option value="">Yükleniyor...</option></select></div>' +
        '<div class="field"><label for="dvTarih">Gün</label>' +
        '<input type="date" id="dvTarih" value="' + esc(S.dvTarih) + '"></div>' +
        '<button type="button" class="btn kucuk gri" data-act="dv-bugun">Bugün</button>' +
        '</div><div class="hint" id="dvGunAdi"></div></div>';

      h += '<div id="dvAlan"></div>';
      h += '<div class="kart"><h3>Dönem özeti</h3><div id="dvOzet">' +
        '<div class="hint">Öğrenci seçince burada birikimi görürsün.</div></div></div>';

      yaz(h);
      devamsizlikBagla(siniflar);
    });
  };

  function devamsizlikBagla(siniflar) {
    var sinifSec = $('dvSinif');
    var ogrSec = $('dvOgrenci');
    var tarihKutu = $('dvTarih');
    if (!sinifSec || !ogrSec || !tarihKutu) return;

    function ogrencileriYukle() {
      S.dvSinif = sinifSec.value;
      ogrSec.innerHTML = '<option value="">Yükleniyor...</option>';
      return api('/school/students').then(function (d) {
        var liste = (d.students || []).filter(function (x) {
          return x.classId === S.dvSinif;
        }).sort(function (a, b) { return a.fullName.localeCompare(b.fullName, 'tr'); });

        if (!liste.length) {
          ogrSec.innerHTML = '<option value="">Bu sınıfta öğrenci yok</option>';
          $('dvAlan').innerHTML = bosKutu('ogrenci', 'Bu sınıfa öğrenci yerleştirilmemiş.');
          return;
        }
        var h = '';
        for (var i = 0; i < liste.length; i++) {
          h += '<option value="' + esc(liste[i].id) + '"' +
            (S.dvOgrenci === liste[i].id ? ' selected' : '') + '>' +
            esc(liste[i].fullName) + '</option>';
        }
        ogrSec.innerHTML = h;
        if (!S.dvOgrenci || !liste.some(function (x) { return x.id === S.dvOgrenci; })) {
          S.dvOgrenci = liste[0].id;
          ogrSec.value = S.dvOgrenci;
        }
        gunuCiz();
        ozetiCiz();
      });
    }

    function gunuCiz() {
      var alan = $('dvAlan');
      if (!alan || !S.dvOgrenci) return;
      alan.innerHTML = '<div class="kart"><div class="hint">Yükleniyor...</div></div>';

      return api('/devamsizlik/gun?studentId=' + encodeURIComponent(S.dvOgrenci) +
        '&tarih=' + encodeURIComponent(S.dvTarih)).then(function (d) {
        var not = $('dvGunAdi');
        if (not) not.textContent = tarihGun(d.tarih);

        if (!d.dersler.length) {
          alan.innerHTML = '<div class="kart">' +
            bosKutu('takvim', d.gunAdi + ' günü bu sınıfın programında ders yok.') +
            '</div>';
          return;
        }

        var h = '<div class="kart"><h3>' + esc(d.ogrenci.ad) + ' · ' +
          tarihGun(d.tarih) + '</h3>' +
          '<div class="hint" style="margin-bottom:12px">' +
          'O gün programdaki dersler. Sağdaki kutudan durumu değiştirebilirsin.</div>';

        for (var i = 0; i < d.dersler.length; i++) {
          var l = d.dersler[i];
          h += '<div class="ders-satir">' +
            '<div class="ders-sira">Ders ' + l.sira + '</div>' +
            '<div class="buyu"><div class="ad">' + esc(l.ders) + '</div>' +
            '<div class="alt">' + esc(l.bas) + ' – ' + esc(l.bit) +
            (l.ogretmen ? ' · ' + esc(l.ogretmen) : '') + '</div></div>';

          if (l.duzenlenebilir) {
            /* data-act koymuyoruz: tıklama dağıtıcısı preventDefault çağırıp
               açılır kutuyu bozuyor. Kutu aşağıda kendi olayına bağlanıyor. */
            h += '<select class="durum-kutu" data-ders="' + esc(l.lessonId) + '">';
            for (var j = 0; j < d.durumlar.length; j++) {
              h += '<option value="' + d.durumlar[j].k + '"' +
                (l.durum === d.durumlar[j].k ? ' selected' : '') + '>' +
                d.durumlar[j].ad + '</option>';
            }
            h += '</select>';
          } else {
            h += '<span class="durum-etiket ' + esc(l.durum) + '">' +
              esc(DEVAM_ADLARI[l.durum] || l.durum) + '</span>';
          }
          h += '</div>';
        }
        h += '<div id="dvMesaj" style="margin-top:12px"></div></div>';
        alan.innerHTML = h;

        /* Açılır kutular tıklama dağıtıcısına değil kendi olayına bağlı. */
        var kutular = alan.querySelectorAll('.durum-kutu');
        for (var k = 0; k < kutular.length; k++) {
          kutular[k].onchange = function () {
            var kutu = this;
            kutu.disabled = true;
            api('/devamsizlik/isaretle', 'POST', {
              studentId: S.dvOgrenci,
              lessonId: kutu.getAttribute('data-ders'),
              tarih: S.dvTarih,
              durum: kutu.value
            }).then(function () {
              kutu.disabled = false;
              mesajGoster('dvMesaj', 'iyi', 'Kaydedildi.');
              ozetiCiz();
            })['catch'](function (e) {
              kutu.disabled = false;
              mesajGoster('dvMesaj', 'hata', e.message);
              gunuCiz();
            });
          };
        }
      })['catch'](function (e) {
        alan.innerHTML = '<div class="kart"><div class="msg hata">' +
          esc(e.message) + '</div></div>';
      });
    }

    function ozetiCiz() {
      var kap = $('dvOzet');
      if (!kap || !S.dvOgrenci) return;
      return api('/devamsizlik/ogrenci?studentId=' + encodeURIComponent(S.dvOgrenci))
        .then(function (d) {
          var h = '<div class="grid k4" style="margin-bottom:14px">' +
            stat(d.sayim.yok, 'Gelmedi') + stat(d.sayim.gec, 'Geç geldi') +
            stat(d.sayim.izinli, 'İzinli') + stat(d.toplam, 'Toplam') + '</div>';
          if (!d.kayitlar.length) {
            h += '<div class="hint">Hiç devamsızlık kaydı yok.</div>';
          } else {
            h += '<div class="rapor-kaydir"><table class="rapor-tablo"><thead><tr>' +
              '<th>Tarih</th><th>Ders</th><th>Durum</th><th>Not</th>' +
              '</tr></thead><tbody>';
            for (var i = 0; i < d.kayitlar.length; i++) {
              var k = d.kayitlar[i];
              h += '<tr><td>' + tarihGun(k.tarih) + '</td><td>' + esc(k.ders) + '</td>' +
                '<td><span class="durum-etiket ' + esc(k.durum) + '">' +
                esc(k.durumAd) + '</span></td><td>' + esc(k.not || '') + '</td></tr>';
            }
            h += '</tbody></table></div>';
          }
          kap.innerHTML = h;
        })['catch'](function () { kap.innerHTML = ''; });
    }

    sinifSec.onchange = ogrencileriYukle;
    ogrSec.onchange = function () {
      S.dvOgrenci = this.value;
      gunuCiz();
      ozetiCiz();
    };
    tarihKutu.onchange = function () {
      S.dvTarih = this.value;
      gunuCiz();
    };

    S.dvBugunGit = function () {
      S.dvTarih = new Date().toISOString().slice(0, 10);
      tarihKutu.value = S.dvTarih;
      gunuCiz();
    };

    ogrencileriYukle();
  }

  var DEVAM_ADLARI = {
    var: 'Geldi', yok: 'Gelmedi', gec: 'Geç geldi', izinli: 'İzinli'
  };

  /* ================= mesajlar ve duyurular ================= */

  var MESAJ_KUTU_AD = { gelen: 'Gelen kutusu', giden: 'Gönderilenler' };
  var IZIN_AD = {
    herkes: 'Okuldaki herkes yazabilir',
    personel: 'Yalnızca öğretmen ve yöneticiler yazabilir',
    kapali: 'Kimse yazamasın'
  };

  SAYFALAR.mesajlar = function () {
    if (!S.mesajKutu) S.mesajKutu = 'gelen';
    if (!S.mesajTur) S.mesajTur = '';

    var yol = '/mesajlar?kutu=' + S.mesajKutu + (S.mesajTur ? '&tur=' + S.mesajTur : '');
    return Promise.all([api(yol), api('/mesajlar/ayar')]).then(function (r) {
      var d = r[0], ayar = r[1];
      var h = hero('MESAJLAR', 'Okul içi mesajlar ve duyurular.');

      h += '<div class="kart"><div class="satir" style="border:0;padding:0">' +
        '<div class="buyu"><div class="sekme-satir">' +
        kutuDugme('gelen', 'Gelen kutusu', d.okunmamis) +
        kutuDugme('giden', 'Gönderilenler', 0) +
        '</div></div>' +
        '<button class="btn" data-act="mesaj-yeni">Yeni mesaj</button>' +
        '</div>';

      h += '<div class="sekme-satir alt" style="margin-top:12px">' +
        turDugme2('', 'Hepsi') + turDugme2('duyuru', 'Duyurular') +
        turDugme2('mesaj', 'Kişisel') + '</div></div>';

      if (!d.mesajlar.length) {
        h += bosKutu('posta', S.mesajKutu === 'gelen'
          ? 'Kutun boş. Sana bir mesaj geldiğinde burada görünür.'
          : 'Henüz mesaj göndermedin.');
      } else {
        h += '<div class="kart" style="padding:0">';
        for (var i = 0; i < d.mesajlar.length; i++) {
          h += mesajSatiri(d.mesajlar[i]);
        }
        h += '</div>';
      }

      /* --- izin ayarları ---
         Öğrencilerde bu ayar yok: okulda herkes öğrenciye yazabilmeli.
         Öğrencinin başka öğrenciye yazamaması zaten sunucuda sabit kural. */
      if (S.user.role === 'student') {
        yaz(h);
        S.mesajAyarGecici = ayar;
        return;
      }

      h += '<div class="kart"><h3>Bana kim yazabilir?</h3>' +
        '<div class="hint" style="margin-bottom:12px">' +
        'Duyurular bu ayardan etkilenmez — okul duyuruları her hâlükârda ulaşır.</div>' +
        '<div class="secenekler">';
      var secenekler = ['herkes', 'personel', 'kapali'];
      for (var j = 0; j < secenekler.length; j++) {
        var k = secenekler[j];
        h += '<label class="onay"><input type="radio" name="mesajIzin" value="' + k + '"' +
          (ayar.kimden === k ? ' checked' : '') + '>' +
          '<span>' + IZIN_AD[k] + '</span></label>';
      }
      h += '</div>';

      if (ayar.engelli.length) {
        h += '<div style="margin-top:14px"><div class="alt" style="margin-bottom:8px">' +
          'Engellediklerin</div>';
        for (var e = 0; e < ayar.engelli.length; e++) {
          var kisi = ayar.engelli[e];
          h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(kisi.ad) +
            '</div><div class="alt">' + (ROL_AD[kisi.rol] || '') + '</div></div>' +
            '<button class="btn kucuk ghost" data-act="mesaj-engel-kaldir" data-id="' +
            esc(kisi.id) + '">Engeli kaldır</button></div>';
        }
        h += '</div>';
      }
      h += '<div id="mesajAyarMesaj" style="margin-top:10px"></div>' +
        '<button class="btn gri" data-act="mesaj-ayar-kaydet" style="margin-top:12px">' +
        'Ayarı kaydet</button></div>';

      yaz(h);
      S.mesajAyarGecici = ayar;
    });
  };

  function kutuDugme(k, ad, rozet) {
    return '<button class="sekme' + (S.mesajKutu === k ? ' secili' : '') +
      '" data-act="mesaj-kutu" data-kutu="' + k + '">' + ad +
      (rozet ? '<span class="sekme-rozet">' + rozet + '</span>' : '') + '</button>';
  }

  function turDugme2(t, ad) {
    return '<button class="sekme kucuk' + (S.mesajTur === t ? ' secili' : '') +
      '" data-act="mesaj-tur" data-tur="' + t + '">' + ad + '</button>';
  }

  function mesajSatiri(m) {
    var duyuru = m.tur === 'duyuru';
    var cocuk = (m.cocukIcin && m.cocukIcin.length)
      ? '<span class="cocuk-not">' + esc(m.cocukIcin.join(', ')) + ' için</span>' : '';
    return '<div class="mesaj-satir' + (m.okundu || S.mesajKutu === 'giden' ? '' : ' yeni') +
      '" data-act="mesaj-ac" data-id="' + esc(m.id) + '">' +
      '<div class="mesaj-ust">' +
      '<span class="mesaj-kim">' +
      (S.mesajKutu === 'giden' ? 'Alıcı: ' + esc(m.hedefOzet) : esc(m.gonderen)) +
      '</span>' +
      (duyuru ? '<span class="duyuru-rozet">Duyuru</span>' : '') + cocuk +
      '<span class="mesaj-tarih">' + tarihSaat(m.tarih) + '</span></div>' +
      '<div class="mesaj-konu">' + esc(m.konu) + '</div>' +
      '<div class="mesaj-onizleme">' + esc(m.onizleme) + '</div>' +
      '</div>';
  }

  function mesajAc(id) {
    return api('/mesajlar/' + id).then(function (d) {
      var m = d.mesaj;
      var govde = '<div class="mesaj-detay">' +
        '<div class="mesaj-detay-ust">' +
        '<div><b>' + esc(m.gonderen) + '</b>' +
        '<span class="alt"> · ' + (ROL_AD[m.gonderenRol] || '') + '</span></div>' +
        '<div class="alt">' + tarihSaat(m.tarih) + '</div></div>';

      if (m.cocukIcin && m.cocukIcin.length) {
        govde += '<div class="msg bilgi">Bu mesaj çocuğun <b>' +
          esc(m.cocukIcin.join(', ')) + '</b> için gönderildi.</div>';
      }
      govde += '<div class="mesaj-govde">' + esc(m.govde).replace(/\n/g, '<br>') + '</div>';

      if (m.alicilar) {
        govde += '<div class="mesaj-alicilar"><div class="alt" style="margin-bottom:8px">' +
          'Alıcılar — ' + m.okuyanSayisi + ' / ' + m.aliciSayisi + ' okudu</div>';
        for (var i = 0; i < m.alicilar.length; i++) {
          var a = m.alicilar[i];
          govde += '<div class="alici-satir">' +
            '<span class="' + (a.okudu ? 'okudu' : 'okumadi') + '">' +
            (a.okudu ? 'okudu' : 'okumadı') + '</span> ' + esc(a.ad) +
            (a.ogrenciAdi ? ' <span class="alt">(' + esc(a.ogrenciAdi) + ' velisi)</span>' : '') +
            '</div>';
        }
        if (m.aliciSayisi > m.alicilar.length) {
          govde += '<div class="alt">… ve ' + (m.aliciSayisi - m.alicilar.length) +
            ' kişi daha</div>';
        }
        govde += '</div>';
      }
      govde += '</div>';

      modalAc(m.konu, govde,
        '<button class="btn tehlike" data-act="mesaj-sil" data-id="' + esc(m.id) + '">' +
        (S.mesajKutu === 'giden' ? 'Mesajı sil' : 'Kutumdan kaldır') + '</button>' +
        '<button class="btn gri" data-act="modal-kapat">Kapat</button>');
      bildirimleriYenile();
    })['catch'](hataGoster);
  }

  /* ---- yeni mesaj ---- */
  function mesajYeniModal() {
    return api('/mesajlar/hedefler').then(function (d) {
      S.mesajHedef = d;
      var duyuruSecim = d.duyuruIzin
        ? '<div class="secenekler" style="margin-bottom:14px">' +
          '<label class="onay"><input type="radio" name="mTur" value="mesaj" checked>' +
          '<span>Kişisel mesaj</span></label>' +
          '<label class="onay"><input type="radio" name="mTur" value="duyuru">' +
          '<span>Duyuru (cevaplanmaz, herkese ulaşır)</span></label></div>'
        : '';

      var hedefSecim = '<div class="field"><label>Kime</label>' +
        '<select id="mHedefTur">' +
        '<option value="kisi">Seçtiğim kişilere</option>' +
        (d.topluIzin ? '<option value="sinif">Sınıflara</option>' : '') +
        (d.topluIzin ? '<option value="rol">Rol grubuna</option>' : '') +
        (d.okulIzin ? '<option value="okul">Tüm okula</option>' : '') +
        '</select></div>';

      var kisiListe = '<div id="mHedefKisi"><div class="field">' +
        '<label for="mKisiAra">Kişi ara</label>' +
        '<input type="text" id="mKisiAra" placeholder="Ad yaz" autocomplete="off">' +
        '</div><div class="secim-kutu" id="mKisiKutu"></div></div>';

      var sinifListe = '<div id="mHedefSinif" style="display:none"><div class="secim-kutu">';
      for (var i = 0; i < d.siniflar.length; i++) {
        sinifListe += '<label class="onay"><input type="checkbox" class="mSinif" value="' +
          esc(d.siniflar[i].id) + '"><span>' + esc(d.siniflar[i].ad) +
          ' <span class="alt">(' + d.siniflar[i].sayi + ' öğrenci)</span></span></label>';
      }
      sinifListe += '</div></div>';

      var rolListe = '<div id="mHedefRol" style="display:none"><div class="secim-kutu">' +
        '<label class="onay"><input type="checkbox" class="mRol" value="student">' +
        '<span>Öğrenciler</span></label>' +
        '<label class="onay"><input type="checkbox" class="mRol" value="parent">' +
        '<span>Veliler</span></label>' +
        '<label class="onay"><input type="checkbox" class="mRol" value="teacher">' +
        '<span>Öğretmenler</span></label>' +
        '</div></div>';

      var okulNot = '<div id="mHedefOkul" style="display:none">' +
        '<div class="msg bilgi">Mesaj okuldaki herkese gidecek.</div></div>';

      var govde = duyuruSecim + hedefSecim + kisiListe + sinifListe + rolListe + okulNot +
        '<div class="field"><label for="mKonu">Konu</label>' +
        '<input type="text" id="mKonu" maxlength="120" placeholder="Kısa bir başlık"></div>' +
        '<div class="field"><label for="mGovde">Mesaj</label>' +
        '<textarea id="mGovde" rows="7" maxlength="4000" placeholder="Yazmak istediklerin"></textarea>' +
        '<div class="hint"><span id="mSayac">0</span> / 4000</div></div>' +
        '<div id="mMesaj"></div>';

      modalAc('Yeni mesaj', govde,
        '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
        '<button class="btn" data-act="mesaj-gonder">Gönder</button>');

      mesajModalBagla();
    })['catch'](hataGoster);
  }

  function mesajModalBagla() {
    var d = S.mesajHedef;
    var secili = {};

    function kisileriCiz() {
      var q = ($('mKisiAra').value || '').toLocaleLowerCase('tr');
      var h = '';
      var n = 0;
      for (var i = 0; i < d.kisiler.length; i++) {
        var k = d.kisiler[i];
        if (q && k.ad.toLocaleLowerCase('tr').indexOf(q) < 0) continue;
        if (++n > 60) break;
        h += '<label class="onay' + (k.kapali ? ' pasif' : '') + '">' +
          '<input type="checkbox" class="mKisi" value="' + esc(k.id) + '"' +
          (secili[k.id] ? ' checked' : '') + (k.kapali ? ' disabled' : '') + '>' +
          '<span>' + esc(k.ad) + ' <span class="alt">' + (ROL_AD[k.rol] || '') +
          (k.brans ? ' · ' + esc(k.brans) : '') +
          (k.kapali ? ' · mesaj almıyor' : '') + '</span></span></label>';
      }
      $('mKisiKutu').innerHTML = h || '<div class="hint">Eşleşen kişi yok.</div>';
      var kutular = $('mKisiKutu').querySelectorAll('.mKisi');
      for (var j = 0; j < kutular.length; j++) {
        kutular[j].onchange = function () { secili[this.value] = this.checked; };
      }
    }

    $('mKisiAra').oninput = kisileriCiz;
    kisileriCiz();
    S.mesajSecili = secili;

    $('mHedefTur').onchange = function () {
      var t = this.value;
      $('mHedefKisi').style.display = t === 'kisi' ? '' : 'none';
      $('mHedefSinif').style.display = t === 'sinif' ? '' : 'none';
      $('mHedefRol').style.display = t === 'rol' ? '' : 'none';
      $('mHedefOkul').style.display = t === 'okul' ? '' : 'none';
    };

    $('mGovde').oninput = function () {
      $('mSayac').textContent = this.value.length;
    };
  }

  function mesajGonderIslemi(btn) {
    var t = $('mHedefTur').value;
    var hedef = { tur: t };
    if (t === 'kisi') {
      hedef.kisiler = Object.keys(S.mesajSecili || {}).filter(function (k) {
        return S.mesajSecili[k];
      });
    } else if (t === 'sinif') {
      hedef.siniflar = secililer('.mSinif');
    } else if (t === 'rol') {
      hedef.roller = secililer('.mRol');
    }

    var turSecim = document.querySelector('input[name=mTur]:checked');
    btn.disabled = true;
    api('/mesajlar', 'POST', {
      tur: turSecim ? turSecim.value : 'mesaj',
      konu: $('mKonu').value,
      govde: $('mGovde').value,
      hedef: hedef
    }).then(function (r) {
      modalKapat();
      git('mesajlar');
      setTimeout(function () { mesajGoster('sayfa', 'iyi', r.message); }, 200);
      bildirimleriYenile();
    })['catch'](function (e) {
      btn.disabled = false;
      mesajGoster('mMesaj', 'hata', e.message);
    });
  }

  function secililer(secici) {
    var out = [];
    var el = document.querySelectorAll(secici);
    for (var i = 0; i < el.length; i++) if (el[i].checked) out.push(el[i].value);
    return out;
  }

  SAYFALAR.roller = function () {
    return Promise.all([api('/school/roles'), api('/school/permissions'),
                        api('/school/teachers'), api('/school/classes'), api('/meta')])
      .then(function (r) {
        S.rolListe = r[0].roles;
        S.yetkiGruplari = r[1].gruplar;
        S.ogretmenVarsayilan = r[1].ogretmenVarsayilan;
        S.rolSiniflar = r[3].classes;
        S.rolDersler = r[4].subjects;

        var h = hero('ROLLER VE YETKİLER',
          'Yetkileri seç, öğretmene ver. Müdürün yetkileri her zaman tamdır.');

        h += '<div class="kart"><h3>Yeni rol</h3>' +
          '<button class="btn" data-act="rol-yeni">Rol oluştur</button></div>';

        if (!S.rolListe.length) {
          h += bosKutu('kilit', 'Henüz rol tanımlanmadı. Öğretmenler yalnızca ' +
            'varsayılan yetkileriyle çalışıyor.');
        } else {
          h += '<div class="kart"><h3>Tanımlı roller (' + S.rolListe.length + ')</h3>';
          for (var i = 0; i < S.rolListe.length; i++) {
            var rol = S.rolListe[i];
            h += '<div class="satir" data-ara="' + esc(rol.name) + '">' +
              '<div class="buyu"><div class="ad">' + esc(rol.name) + '</div>' +
              '<div class="alt">' + rol.permissions.length + ' yetki · ' +
              (rol.kisiSayisi ? rol.kisiSayisi + ' kişide' : 'kimseye verilmemiş') + '</div>' +
              '<div style="margin-top:5px">' + yetkiEtiketleri(rol.permissions, rol.kapsam) + '</div></div>' +
              '<button class="btn kucuk ghost" data-act="rol-duzenle" data-id="' + esc(rol.id) + '">Düzenle</button>' +
              '<button class="btn kucuk tehlike" data-act="rol-sil" data-id="' + esc(rol.id) + '" ' +
              'data-ad="' + esc(rol.name) + '">Sil</button>' +
              '</div>';
          }
          h += '</div>';
        }

        /* Öğretmenlere rol atama */
        var onayli = r[2].teachers.filter(function (t) { return t.status === 'approved'; });
        h += '<div class="kart"><h3>Öğretmenlerin rolleri</h3>';
        if (!onayli.length) {
          h += '<div class="hint">Onaylanmış öğretmen yok.</div>';
        } else {
          for (var j = 0; j < onayli.length; j++) {
            var t = onayli[j];
            h += '<div class="satir" data-ara="' + esc(t.fullName) + '">' +
              '<div class="buyu"><div class="ad">' + esc(t.fullName) + '</div>' +
              '<div class="alt">' + esc(t.branch || '') + '</div></div>' +
              '<select class="rol-sec" data-id="' + esc(t.id) + '" ' +
              'style="padding:7px 9px;border:1.5px solid var(--cizgi);border-radius:8px;max-width:200px">' +
              '<option value="">— rol yok —</option>';
            for (var k = 0; k < S.rolListe.length; k++) {
              h += '<option value="' + esc(S.rolListe[k].id) + '"' +
                (t.customRoleId === S.rolListe[k].id ? ' selected' : '') + '>' +
                esc(S.rolListe[k].name) + '</option>';
            }
            h += '</select></div>';
          }
        }
        h += '</div>';

        /* Varsayılan yetkiler bilgisi */
        h += '<div class="kart"><h3>Her öğretmende varsayılan olan yetkiler</h3>' +
          '<div class="hint" style="margin-bottom:9px">Bunlar rol verilmese de açıktır, ' +
          'kapatılamaz.</div>' + yetkiEtiketleri(S.ogretmenVarsayilan) + '</div>';

        yaz(h);
        rolSecBagla();
      });
  };

  /* Yetki anahtarlarını okunur etikete çevirir. */
  function yetkiAdi(anahtar) {
    for (var i = 0; i < (S.yetkiGruplari || []).length; i++) {
      var g = S.yetkiGruplari[i];
      for (var j = 0; j < g.liste.length; j++) {
        if (g.liste[j].k === anahtar) return g.liste[j].ad;
      }
    }
    return anahtar;
  }

  function yetkiEtiketleri(liste, kapsam) {
    if (!liste || !liste.length) return '<span class="etiket gri">yetki yok</span>';
    var h = '';
    for (var i = 0; i < liste.length; i++) {
      var k = kapsam && kapsam[liste[i]];
      var ek = '';
      if (k) {
        var parca = [];
        if (k.dersler && k.dersler.indexOf('*') < 0) parca.push(k.dersler.join(', '));
        if (k.siniflar && k.siniflar.indexOf('*') < 0) {
          var adlar = k.siniflar.map(function (sid) {
            for (var m = 0; m < (S.rolSiniflar || []).length; m++) {
              if (S.rolSiniflar[m].id === sid) return S.rolSiniflar[m].name;
            }
            return '?';
          });
          parca.push(adlar.join(', '));
        }
        if (parca.length) ek = ' — ' + parca.join(' / ');
      }
      h += '<span class="etiket">' + esc(yetkiAdi(liste[i]) + ek) + '</span> ';
    }
    return h;
  }

  function rolSecBagla() {
    var kutular = document.querySelectorAll('.rol-sec');
    for (var i = 0; i < kutular.length; i++) {
      (function (sel) {
        sel.onchange = function () {
          sel.disabled = true;
          api('/school/role-assign', 'POST', {
            userId: sel.getAttribute('data-id'), roleId: sel.value
          }).then(function () { git('roller'); })
            ['catch'](function (e) { sel.disabled = false; hataGoster(e); });
        };
      })(kutular[i]);
    }
  }

  /* Bir yetkinin ders ya da sınıf daraltması için kutu listesi.
     Hiçbiri seçili değilse "hepsi" demektir. */
  function kapsamSecici(tur, izin, baslik, liste, deger, etiket, secili) {
    var hepsi = !secili || !secili.length || secili.indexOf('*') >= 0;
    var h = '<div class="kapsam-kutu">' +
      '<div class="kapsam-basi">' + esc(baslik) +
      '<label class="onay kapsam-hepsi"><input type="checkbox" class="kapsam-tumu" ' +
      'data-izin="' + esc(izin) + '" data-tur="' + tur + '"' + (hepsi ? ' checked' : '') + '>' +
      '<span>Tümü</span></label></div>' +
      '<div class="kapsam-secenekler"' + (hepsi ? ' hidden' : '') + '>';

    for (var i = 0; i < (liste || []).length; i++) {
      var d = deger(liste[i]);
      h += '<label class="onay kapsam-secenek">' +
        '<input type="checkbox" class="kapsam-oge" data-izin="' + esc(izin) + '" ' +
        'data-tur="' + tur + '" value="' + esc(d) + '"' +
        (!hepsi && secili.indexOf(d) >= 0 ? ' checked' : '') + '>' +
        '<span>' + esc(etiket(liste[i])) + '</span></label>';
    }
    return h + '</div></div>';
  }

  /* Rol oluşturma / düzenleme penceresi */
  function rolModal(rolId) {
    var mevcut = null;
    for (var i = 0; i < (S.rolListe || []).length; i++) {
      if (S.rolListe[i].id === rolId) mevcut = S.rolListe[i];
    }
    var secili = mevcut ? mevcut.permissions.slice() : [];

    var h = '<div class="field"><label for="rAd">Rol adı</label>' +
      '<input type="text" id="rAd" maxlength="40" placeholder="Müdür Yardımcısı" ' +
      'value="' + esc(mevcut ? mevcut.name : '') + '"></div>';

    h += '<div class="yetki-liste">';
    for (var g = 0; g < S.yetkiGruplari.length; g++) {
      var grup = S.yetkiGruplari[g];
      h += '<div class="yetki-grup"><div class="yetki-grup-ad">' + esc(grup.grup) + '</div>';
      for (var j = 0; j < grup.liste.length; j++) {
        var y = grup.liste[j];
        var varsayilan = (S.ogretmenVarsayilan || []).indexOf(y.k) >= 0;
        var acik = secili.indexOf(y.k) >= 0 || varsayilan;
        var kap = (mevcut && mevcut.kapsam && mevcut.kapsam[y.k]) || null;

        h += '<div class="yetki-blok">' +
          '<label class="onay yetki-satir">' +
          '<input type="checkbox" class="yetki-kutu" value="' + esc(y.k) + '"' +
          (acik ? ' checked' : '') + (varsayilan ? ' disabled' : '') + '>' +
          '<span><b>' + esc(y.ad) + '</b>' +
          (varsayilan ? ' <span class="etiket gri">varsayılan</span>' : '') +
          (y.aciklama ? '<br><span class="yetki-aciklama">' + esc(y.aciklama) + '</span>' : '') +
          '</span></label>';

        /* Ders / sınıf daraltması */
        if (y.kapsam && y.kapsam.length) {
          h += '<div class="kapsam-alan" data-izin="' + esc(y.k) + '"' +
            (acik ? '' : ' hidden') + '>';
          if (y.kapsam.indexOf('ders') >= 0) {
            h += kapsamSecici('ders', y.k, 'Dersler', S.rolDersler,
              function (x) { return x; }, function (x) { return x; },
              kap ? kap.dersler : null);
          }
          if (y.kapsam.indexOf('sinif') >= 0) {
            h += kapsamSecici('sinif', y.k, 'Sınıflar', S.rolSiniflar,
              function (x) { return x.id; }, function (x) { return x.name; },
              kap ? kap.siniflar : null);
          }
          h += '</div>';
        }
        h += '</div>';
      }
      h += '</div>';
    }
    h += '</div><div id="rolMesaj" style="margin-top:10px"></div>';

    modalAc(mevcut ? 'Rolü düzenle' : 'Yeni rol', h,
      '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
      '<button class="btn" data-act="rol-kaydet" data-id="' + esc(rolId || '') + '">Kaydet</button>');

    rolKapsamBagla();
  }

  /* Yetki kutusu kapanınca kapsam alanı gizlenir; "Tümü" seçilince
     tek tek seçenekler saklanır. */
  function rolKapsamBagla() {
    var yetkiKutulari = document.querySelectorAll('.yetki-kutu');
    for (var i = 0; i < yetkiKutulari.length; i++) {
      (function (kutu) {
        kutu.onchange = function () {
          var alan = document.querySelector('.kapsam-alan[data-izin="' + kutu.value + '"]');
          if (alan) alan.hidden = !kutu.checked;
        };
      })(yetkiKutulari[i]);
    }

    var tumKutulari = document.querySelectorAll('.kapsam-tumu');
    for (var j = 0; j < tumKutulari.length; j++) {
      (function (kutu) {
        kutu.onchange = function () {
          var kap = kutu.closest('.kapsam-kutu');
          var secenekler = kap.querySelector('.kapsam-secenekler');
          secenekler.hidden = kutu.checked;
          if (kutu.checked) {
            var ogeler = kap.querySelectorAll('.kapsam-oge');
            for (var k = 0; k < ogeler.length; k++) ogeler[k].checked = false;
          }
        };
      })(tumKutulari[j]);
    }
  }

  /* ================= SINIFLAR (müdür) ================= */

  SAYFALAR.siniflar = function () {
    return api('/school/classes').then(function (d) {
      S.sinifBilgi = d;
      var h = hero('SINIFLAR', 'Sınıfları burada açar, öğrencileri yerleştirir ve derslerini tanımlarsın.');

      h += '<div class="kart"><h3>Yeni sınıf</h3>' +
        '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
        '<input type="text" id="yeniSinif" placeholder="ör. 7-A" maxlength="30" ' +
        'autocomplete="off" style="flex:1;min-width:150px;padding:11px 12px;' +
        'border:1.5px solid var(--cizgi);border-radius:10px">' +
        '<button class="btn" data-act="sinif-ekle">Sınıf aç</button></div>' +
        '<div id="sinifMesaj" style="margin-top:9px"></div></div>';

      if (d.sinifsiz > 0) {
        h += '<div class="msg bilgi">' + ik('uyari') + '<b>' + d.sinifsiz + '</b> öğrenci henüz bir sınıfa yerleştirilmedi. ' +
          '<a href="#" data-act="sinif-yerlestir">Şimdi yerleştir</a></div>';
      }

      if (!d.classes.length) {
        h += bosKutu('sinif', 'Henüz sınıf yok. Yukarıdan ilk sınıfını aç.');
        yaz(h);
        return;
      }

      h += '<div class="kart"><h3>Sınıf listesi (' + d.classes.length + ')</h3>';
      for (var i = 0; i < d.classes.length; i++) {
        var c = d.classes[i];
        h += '<div class="satir" data-ara="' + esc(c.name) + '">' +
          '<div class="buyu"><div class="ad">' + esc(c.name) + '</div>' +
          '<div class="alt">' + c.studentCount + ' öğrenci · ' + c.lessonCount + ' ders' +
          (c.unassigned ? ' · <span style="color:var(--kirmizi)">' + c.unassigned +
            ' derste öğretmen yok</span>' : '') + '</div></div>' +
          '<button class="btn kucuk ghost" data-act="sinif-dersler" data-id="' + esc(c.id) + '" ' +
          'data-ad="' + esc(c.name) + '">Dersler</button>' +
          '<button class="btn kucuk ghost" data-act="sinif-program" data-id="' + esc(c.id) + '">Ders programı</button>' +
          '<button class="btn kucuk gri" data-act="sinif-ogrenciler" data-id="' + esc(c.id) + '" ' +
          'data-ad="' + esc(c.name) + '">Öğrenciler</button>' +
          '<button class="btn kucuk tehlike" data-act="sinif-sil" data-id="' + esc(c.id) + '" ' +
          'data-ad="' + esc(c.name) + '">Sil</button>' +
          '</div>';
      }
      h += '</div>';
      yaz(h);
    });
  };

  /* Sınıfın derslerini yöneten pencere */
  function sinifDersleriModal(classId, ad) {
    return api('/school/lessons?classId=' + encodeURIComponent(classId)).then(function (d) {
      S.dersBilgi = d;
      var h = '';

      var kullanilan = d.lessons.map(function (l) { return l.subject; });
      var eklenebilir = d.subjects.filter(function (x) { return kullanilan.indexOf(x) < 0; });

      if (eklenebilir.length) {
        h += '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;margin-bottom:14px">' +
          '<div class="field" style="flex:1;min-width:150px;margin:0"><label>Ders ekle</label>' +
          '<select id="yeniDers">';
        for (var i = 0; i < eklenebilir.length; i++) {
          h += '<option value="' + esc(eklenebilir[i]) + '">' + esc(eklenebilir[i]) + '</option>';
        }
        h += '</select></div>' +
          '<div class="field" style="flex:0 0 110px;margin:0"><label>Haftalık saat</label>' +
          '<input type="number" id="yeniDersSaat" min="0" max="20" value="4"></div>' +
          '<button class="btn" data-act="ders-ekle" data-id="' + esc(classId) + '">Ekle</button></div>';
      } else {
        h += '<div class="msg bilgi">Tüm dersler eklenmiş.</div>';
      }

      if (!d.lessons.length) {
        h += bosKutu('ders', 'Bu sınıfa henüz ders eklenmedi.');
      } else {
        for (var j = 0; j < d.lessons.length; j++) {
          var l = d.lessons[j];
          h += '<div class="satir">' +
            '<div class="buyu"><div class="ad">' + esc(l.subject) + '</div>' +
            '<div class="alt">Haftada ' + l.weeklyHours + ' saat · programa ' + l.placed + ' saat yerleşti' +
            (l.placed > l.weeklyHours && l.weeklyHours ? ' <span style="color:var(--kirmizi)">(fazla)</span>' :
              (l.placed < l.weeklyHours ? ' <span style="color:var(--soluk)">(' +
                (l.weeklyHours - l.placed) + ' saat eksik)</span>' : '')) +
            '</div></div>' +
            '<select class="ders-ogretmen" data-id="' + esc(l.id) + '" ' +
            'style="padding:7px 9px;border:1.5px solid var(--cizgi);border-radius:8px;max-width:190px">' +
            '<option value="">— öğretmen seç —</option>';
          for (var k = 0; k < d.teachers.length; k++) {
            var t = d.teachers[k];
            h += '<option value="' + esc(t.id) + '"' + (l.teacherId === t.id ? ' selected' : '') + '>' +
              esc(t.fullName) + (t.branch ? ' (' + esc(t.branch) + ')' : '') + '</option>';
          }
          h += '</select>' +
            '<button class="btn kucuk tehlike" data-act="ders-sil" data-id="' + esc(l.id) + '" ' +
            'data-cid="' + esc(classId) + '">Sil</button>' +
            '</div>';
        }
      }

      modalAc(ad + ' — Dersler', h);
      dersOgretmenBagla(classId);
    });
  }

  function dersOgretmenBagla(classId) {
    var kutular = document.querySelectorAll('.ders-ogretmen');
    for (var i = 0; i < kutular.length; i++) {
      (function (sel) {
        sel.onchange = function () {
          api('/school/lesson-update', 'POST', {
            lessonId: sel.getAttribute('data-id'),
            teacherId: sel.value
          }).then(function () {
            sinifDersleriModal(classId, (S.dersBilgi.class || {}).name || '')['catch'](hataGoster);
          })['catch'](hataGoster);
        };
      })(kutular[i]);
    }
  }

  /* Öğrencileri sınıflara yerleştirme penceresi */
  function sinifOgrencileriModal(classId, ad) {
    return Promise.all([api('/school/students'), api('/school/classes')]).then(function (r) {
      var ogrenciler = r[0].students, siniflar = r[1].classes;
      var h = '<div class="hint" style="margin-bottom:10px">Her öğrencinin sınıfını buradan değiştirebilirsin.</div>';

      if (!ogrenciler.length) {
        h += bosKutu('ogrenci', 'Okulda kayıtlı öğrenci yok.');
      } else {
        for (var i = 0; i < ogrenciler.length; i++) {
          var o = ogrenciler[i];
          h += '<div class="satir">' +
            '<div class="buyu"><div class="ad">' + esc(o.fullName) + '</div>' +
            '<div class="alt">' + esc(o.email) + '</div></div>' +
            '<select class="ogrenci-sinif" data-id="' + esc(o.id) + '" ' +
            'style="padding:7px 9px;border:1.5px solid var(--cizgi);border-radius:8px">' +
            '<option value="">— sınıfsız —</option>';
          for (var j = 0; j < siniflar.length; j++) {
            h += '<option value="' + esc(siniflar[j].id) + '"' +
              (o.classId === siniflar[j].id ? ' selected' : '') + '>' + esc(siniflar[j].name) + '</option>';
          }
          h += '</select></div>';
        }
      }

      modalAc(ad ? ad + ' — Öğrenci yerleştirme' : 'Öğrenci yerleştirme', h);

      var kutular = document.querySelectorAll('.ogrenci-sinif');
      for (var k = 0; k < kutular.length; k++) {
        (function (sel) {
          sel.onchange = function () {
            sel.disabled = true;
            api('/school/class-assign', 'POST', {
              studentId: sel.getAttribute('data-id'),
              classId: sel.value
            }).then(function () { sel.disabled = false; })
              ['catch'](function (e) { sel.disabled = false; hataGoster(e); });
          };
        })(kutular[k]);
      }
    });
  }

  /* ================= DERS PROGRAMI (müdür) =================
     Program artık sabit ders saati kutuları değil: her gün için istenen
     saat aralıklarıyla ders eklenir. Pazartesi'den Pazar'a 7 gün. */

  SAYFALAR.program = function () {
    return api('/school/classes').then(function (d) {
      if (!d.classes.length) {
        yaz(hero('DERS PROGRAMI', 'Önce sınıf açman gerekiyor.') +
          bosKutu('takvim', 'Program yapabilmek için en az bir sınıf gerekli.') +
          '<div class="kart"><button class="btn" data-nav="siniflar">Sınıflar sayfasına git</button></div>');
        return;
      }
      if (!S.programSinif || !d.classes.some(function (c) { return c.id === S.programSinif; })) {
        S.programSinif = d.classes[0].id;
      }
      S.programSiniflar = d.classes;
      S.gunAdlari = d.gunAdlari;
      S.gunSayisi = d.gunSayisi;
      return programCiz();
    });
  };

  function programCiz() {
    return api('/school/schedule?classId=' + encodeURIComponent(S.programSinif)).then(function (d) {
      S.programVeri = d;
      var h = hero('DERS PROGRAMI',
        'Gün gün ya da haftalık bak. Ders ekle ile saatini kendin belirle, çakışma olursa uyarırım.');

      h += '<div class="kart"><div class="filtre-satir">' +
        '<div class="field"><label for="pSinif">Sınıf</label><select id="pSinif">';
      for (var i = 0; i < S.programSiniflar.length; i++) {
        var c = S.programSiniflar[i];
        h += '<option value="' + esc(c.id) + '"' + (c.id === S.programSinif ? ' selected' : '') + '>' +
          esc(c.name) + '</option>';
      }
      h += '</select></div></div></div>';

      if (S.programUyari) {
        h += '<div class="msg hata">' + ik('uyari') + esc(S.programUyari) + '</div>';
        S.programUyari = '';
      }

      if (d.cakismalar.length) {
        /* Uzun liste sayfayı boğuyor: ilk beşi göster, gerisini katla. */
        var GOSTER = 5;
        var acik = S.cakismaAcik;
        var gosterilecek = acik ? d.cakismalar.length : Math.min(GOSTER, d.cakismalar.length);

        h += '<div class="msg hata"><b>' + ik('uyari') + d.cakismalar.length +
          ' çakışma var</b><ul class="cakisma-liste">';
        for (var j = 0; j < gosterilecek; j++) {
          var ck = d.cakismalar[j];
          h += '<li>' + (ck.tur === 'ogretmen' ? 'Öğretmen ' : 'Sınıf ') + esc(ck.ad) +
            ' — ' + esc(ck.dayName) + ': ' +
            esc(ck.lessons.map(function (x) {
              return x.className + ' ' + x.subject + ' (' + x.start + '-' + x.end + ')';
            }).join(' ↔ ')) + '</li>';
        }
        h += '</ul>';
        if (d.cakismalar.length > GOSTER) {
          h += '<button type="button" class="baglanti" data-act="cakisma-ac">' +
            (acik ? 'Daha azını göster' : (d.cakismalar.length - GOSTER) + ' tanesini daha göster') +
            '</button>';
        }
        h += '</div>';
      }

      h += gorunumSecici();
      h += programGovdesi(d, true, function (sp) {
        return sp.teacherName || 'öğretmen atanmadı';
      });

      if (d.lessons.length) {
        h += '<div class="kart"><h3>Bu sınıfın dersleri</h3>';
        for (var k = 0; k < d.lessons.length; k++) {
          var l = d.lessons[k];
          var eksik = l.weeklyHours - l.placed;
          h += '<div class="satir"><div class="buyu"><div class="ad">' + esc(l.subject) + '</div>' +
            '<div class="alt">' + (l.teacherName ? esc(l.teacherName) :
              '<span style="color:var(--kirmizi)">öğretmen atanmadı</span>') + '</div></div>' +
            '<span class="etiket ' + (eksik === 0 ? 'yesil' : eksik > 0 ? 'turuncu' : 'kirmizi') + '">' +
            l.placed + ' / ' + l.weeklyHours + ' saat</span></div>';
        }
        h += '</div>';
      } else {
        h += '<div class="msg bilgi">Bu sınıfa ders eklenmemiş. ' +
          '<a href="#" data-nav="siniflar">Sınıflar sayfasından</a> ders ekleyebilirsin.</div>';
      }

      yaz(h);
      var sinifSec = $('pSinif');
      if (sinifSec) {
        sinifSec.onchange = function () {
          S.programSinif = this.value;
          programCiz()['catch'](hataGoster);
        };
      }
    });
  }

  /* ================= program çizimi =================
     İki görünüm var:
       gün   — tek gün, dersler yan yana sütunlar (varsayılan)
       hafta — günler satır, ders sıraları sütun
     İkisi de aynı detayı gösterir: saat, ders adı, öğretmen ya da sınıf. */

  /* Kullanıcının bir yetkisi var mı? Müdür ve yönetici her zaman yetkilidir. */
  function yetkim(izin) {
    var u = S.user;
    if (!u) return false;
    if (u.role === 'admin' || u.role === 'principal') return true;
    return (u.yetkiler || []).indexOf(izin) >= 0;
  }

  var GUN_KISA = ['', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  function bugunNo() {
    var g = new Date().getDay();      /* 0 Pazar */
    return g === 0 ? 7 : g;
  }

  /* Kayıtları güne göre grupla ve saate göre sırala. */
  function gunlereBol(hucreler) {
    var gunler = {};
    for (var i = 0; i < hucreler.length; i++) {
      var g = hucreler[i].day;
      if (!gunler[g]) gunler[g] = [];
      gunler[g].push(hucreler[i]);
    }
    for (var k in gunler) {
      gunler[k].sort(function (a, b) { return String(a.start).localeCompare(String(b.start)); });
    }
    return gunler;
  }

  /* Çakışan kayıtların kimlik listesi */
  function cakisanKimlikler(d) {
    var carp = {};
    /* Öğretmen ucunda çakışma bayrağı hücrenin kendisinde geliyor. */
    for (var i = 0; i < (d.cells || []).length; i++) {
      if (d.cells[i].cakisma) carp[d.cells[i].id] = true;
    }
    if (d.cakismalar) {
      for (var c = 0; c < d.cakismalar.length; c++) {
        var l = d.cakismalar[c].lessons || [];
        for (var m = 0; m < l.length; m++) if (l[m].scheduleId) carp[l[m].scheduleId] = true;
      }
    }
    return carp;
  }

  /* Gün seçici şerit: hangi günde kaç ders var, tek bakışta. */
  function gunSeridi(d, gunler, seciliGun) {
    var h = '<div class="gun-seridi">';
    for (var g = 1; g <= (d.gunSayisi || 7); g++) {
      var adet = (gunler[g] || []).length;
      h += '<button type="button" class="gun-nokta' +
        (g === seciliGun ? ' secili' : '') + (adet ? ' dolu' : ' bos') +
        (g === bugunNo() ? ' bugun' : '') + '" data-act="program-gun" data-gun="' + g + '">' +
        '<span class="nokta-ad">' + esc(GUN_KISA[g] || g) + '</span>' +
        '<span class="nokta-adet">' + (adet ? adet : '–') + '</span>' +
        '</button>';
    }
    return h + '</div>';
  }

  /* Bir dersin kartı. altSatir: öğretmen adı ya da sınıf adı. */
  function dersSutunu(sp, sira, duzenlenebilir, carpisiyor, altSatir, ekIslem) {
    var simdi = false;
    if (sp.day === bugunNo()) {
      var d = new Date();
      var su = d.getHours() * 60 + d.getMinutes();
      var b = String(sp.start).split(':'), t = String(sp.end).split(':');
      var bd = (+b[0]) * 60 + (+b[1]), td = (+t[0]) * 60 + (+t[1]);
      simdi = su >= bd && su < td;
    }

    return '<div class="ders-sutun' + (carpisiyor ? ' cakisma' : '') + (simdi ? ' simdi' : '') + '">' +
      '<div class="sutun-basi">Ders ' + sira +
      (simdi ? ' <span class="simdi-etiket">şimdi</span>' : '') + '</div>' +
      '<div class="sutun-saat">' + esc(sp.start) + ' – ' + esc(sp.end) + '</div>' +
      '<div class="sutun-ders">' + esc(sp.subject) + '</div>' +
      '<div class="sutun-kisi">' + esc(altSatir || '') + '</div>' +
      (carpisiyor ? '<div class="sutun-uyari">Aynı saatte başka bir derse de yazılmış</div>' : '') +
      (duzenlenebilir
        ? '<div class="sutun-islem">' +
          '<button class="btn kucuk gri" data-act="saat-duzenle" data-id="' + esc(sp.id) + '">Düzenle</button>' +
          '<button class="btn kucuk tehlike" data-act="saat-sil" data-id="' + esc(sp.id) + '">Sil</button>' +
          '</div>'
        : (ekIslem || '')) +
      '</div>';
  }

  /* --- GÜNLÜK GÖRÜNÜM --- */
  function gunlukGorunum(d, duzenlenebilir, altAlan) {
    var gunler = gunlereBol(d.cells);
    var carp = cakisanKimlikler(d);
    /* Kullanıcı gün seçmediyse bugünü aç; bugün boşsa ders olan ilk güne düş,
       yoksa kimse boş bir ekranla karşılaşmasın. */
    var gun = S.programGun;
    if (!gun) {
      gun = bugunNo();
      if (!(gunler[gun] || []).length) {
        for (var ara = 1; ara <= (d.gunSayisi || 7); ara++) {
          if ((gunler[ara] || []).length) { gun = ara; break; }
        }
      }
    }
    if (gun < 1 || gun > (d.gunSayisi || 7)) gun = 1;
    var liste = gunler[gun] || [];

    var h = gunSeridi(d, gunler, gun);

    h += '<div class="gun-gezgin">' +
      '<button type="button" class="gun-ok" data-act="program-gun" data-gun="' +
      (gun === 1 ? (d.gunSayisi || 7) : gun - 1) + '">‹ önceki gün</button>' +
      '<div class="gun-orta">' +
      '<div class="gun-buyuk">' + esc(d.gunAdlari[gun] || ('Gün ' + gun)) + '</div>' +
      '<div class="gun-kucuk">' +
      (liste.length ? liste.length + ' ders · ' + esc(liste[0].start) + ' – ' + esc(liste[liste.length - 1].end)
        : 'ders yok') +
      (gun === bugunNo() ? ' · bugün' : '') + '</div>' +
      '</div>' +
      '<button type="button" class="gun-ok" data-act="program-gun" data-gun="' +
      (gun === (d.gunSayisi || 7) ? 1 : gun + 1) + '">sonraki gün ›</button>' +
      '</div>';

    h += '<div class="ders-sutunlar">';
    for (var i = 0; i < liste.length; i++) {
      h += dersSutunu(liste[i], i + 1, duzenlenebilir, carp[liste[i].id],
        altAlan(liste[i]), altAlan.ekIslem ? altAlan.ekIslem(liste[i]) : '');
    }
    if (duzenlenebilir) {
      h += '<button type="button" class="ders-sutun ekle" data-act="saat-ekle" data-gun="' + gun + '">' +
        '<span class="ekle-arti">+</span><span class="ekle-yazi">Ders ekle</span></button>';
    } else if (!liste.length) {
      h += '<div class="ders-sutun bos-saat"><div class="bos-yazi">Bu gün ders yok</div></div>';
    }
    h += '</div>';
    return h;
  }

  /* --- HAFTALIK GÖRÜNÜM ---
     Günler satır, ders sıraları sütun. Her hücrede tam detay var. */
  function haftalikGorunum(d, duzenlenebilir, altAlan) {
    var gunler = gunlereBol(d.cells);
    var carp = cakisanKimlikler(d);

    var enFazla = 1;
    for (var g = 1; g <= (d.gunSayisi || 7); g++) {
      enFazla = Math.max(enFazla, (gunler[g] || []).length);
    }

    var h = '<div class="hafta-sar"><table class="hafta"><thead><tr><th class="gun-sutun">Gün</th>';
    for (var i = 1; i <= enFazla; i++) h += '<th>Ders ' + i + '</th>';
    if (duzenlenebilir) h += '<th class="ekle-sutun"></th>';
    h += '</tr></thead><tbody>';

    for (var gu = 1; gu <= (d.gunSayisi || 7); gu++) {
      var liste = gunler[gu] || [];
      h += '<tr' + (gu === bugunNo() ? ' class="bugun"' : '') + '>' +
        '<th class="gun-sutun">' + esc(d.gunAdlari[gu] || ('Gün ' + gu)) +
        (gu === bugunNo() ? '<span class="bugun-etiket">bugün</span>' : '') + '</th>';

      for (var j = 0; j < enFazla; j++) {
        var sp = liste[j];
        if (!sp) { h += '<td class="bos-hucre"></td>'; continue; }
        h += '<td' + (carp[sp.id] ? ' class="cakisma"' : '') + '>' +
          '<div class="hafta-saat">' + esc(sp.start) + ' – ' + esc(sp.end) + '</div>' +
          '<div class="hafta-ders">' + esc(sp.subject) + '</div>' +
          '<div class="hafta-kisi">' + esc(altAlan(sp) || '') + '</div>' +
          (duzenlenebilir
            ? '<div class="hafta-islem">' +
              '<button class="btn kucuk gri" data-act="saat-duzenle" data-id="' + esc(sp.id) + '">Düzenle</button>' +
              '<button class="btn kucuk tehlike" data-act="saat-sil" data-id="' + esc(sp.id) + '">Sil</button>' +
              '</div>'
            : '') +
          '</td>';
      }
      if (duzenlenebilir) {
        h += '<td class="ekle-sutun">' +
          '<button type="button" class="hafta-ekle" data-act="saat-ekle" data-gun="' + gu + '" ' +
          'title="' + esc(d.gunAdlari[gu]) + ' gününe ders ekle">+</button></td>';
      }
      h += '</tr>';
    }
    return h + '</tbody></table></div>';
  }

  /* Gün / Hafta düğmesi */
  function gorunumSecici() {
    var hafta = S.programGorunum === 'hafta';
    return '<div class="gorunum-secici">' +
      '<button type="button" class="gorunum-dugme' + (hafta ? '' : ' secili') + '" ' +
      'data-act="program-gorunum" data-tur="gun">Gün</button>' +
      '<button type="button" class="gorunum-dugme' + (hafta ? ' secili' : '') + '" ' +
      'data-act="program-gorunum" data-tur="hafta">Hafta</button>' +
      '</div>';
  }

  /* Seçili görünüme göre çizer. */
  function programGovdesi(d, duzenlenebilir, altAlan) {
    return S.programGorunum === 'hafta'
      ? haftalikGorunum(d, duzenlenebilir, altAlan)
      : gunlukGorunum(d, duzenlenebilir, altAlan);
  }

  /* Program hangi sayfada açıksa onu yeniden çizer. */
  function programYenidenCiz() {
    if (S.page === 'program') return programCiz()['catch'](hataGoster);
    return git(S.page);
  }

  /* Ders saati ekleme / düzenleme penceresi */
  function saatModal(gun, mevcutId) {
    var d = S.programVeri;
    var mevcut = null;
    if (mevcutId) {
      for (var i = 0; i < d.cells.length; i++) if (d.cells[i].id === mevcutId) mevcut = d.cells[i];
      if (mevcut) gun = mevcut.day;
    }

    if (!d.lessons.length) {
      modalAc('Ders ekle', bosKutu('ders', 'Bu sınıfa önce ders eklemelisin. Sınıflar sayfasından ekleyebilirsin.'));
      return;
    }

    var h = '<div class="field"><label for="mGun">Gün</label><select id="mGun">';
    for (var g = 1; g <= (d.gunSayisi || 7); g++) {
      h += '<option value="' + g + '"' + (g === gun ? ' selected' : '') + '>' +
        esc(d.gunAdlari[g]) + '</option>';
    }
    h += '</select></div>';

    h += '<div class="field"><label for="mDers">Ders</label><select id="mDers">';
    for (var j = 0; j < d.lessons.length; j++) {
      var l = d.lessons[j];
      h += '<option value="' + esc(l.id) + '"' +
        (mevcut && mevcut.lessonId === l.id ? ' selected' : '') + '>' +
        esc(l.subject) + (l.teacherName ? ' — ' + esc(l.teacherName) : ' — öğretmen yok') + '</option>';
    }
    h += '</select></div>';

    h += '<div class="row2">' +
      '<div class="field"><label for="mBas">Başlangıç</label>' +
      '<input type="time" id="mBas" value="' + esc(mevcut ? mevcut.start : '09:00') + '"></div>' +
      '<div class="field"><label for="mBit">Bitiş</label>' +
      '<input type="time" id="mBit" value="' + esc(mevcut ? mevcut.end : '09:40') + '"></div>' +
      '</div>' +
      '<div class="hint">Saatleri okulunun zil düzenine göre serbestçe yazabilirsin.</div>' +
      '<div id="saatMesaj" style="margin-top:9px"></div>';

    modalAc(mevcut ? 'Ders saatini düzenle' : 'Ders ekle', h,
      '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
      '<button class="btn" data-act="saat-kaydet" data-id="' + esc(mevcutId || '') + '">Kaydet</button>');
  }

  /* ================= KENDİ PROGRAMIM (öğretmen / öğrenci / veli) ================= */

  SAYFALAR.programim = function () {
    var u = S.user;
    if (u.role === 'teacher' || u.role === 'principal') return ogretmenProgrami();
    return ogrenciProgrami();
  };

  function ogretmenProgrami() {
    return api('/teacher/schedule').then(function (d) {
      var h = hero('DERS PROGRAMIM', 'Müdürün sana atadığı dersler ve haftalık programın.');

      var cakismaVar = d.cells.some(function (c) { return c.cakisma; });
      if (cakismaVar) {
        h += '<div class="msg hata">Programında çakışma var — aynı saatte birden fazla sınıf görünüyor. ' +
          'Müdürüne bildir.</div>';
      }

      if (!d.lessons.length) {
        h += bosKutu('takvim', 'Sana henüz ders atanmadı. Müdürün sınıflara ders atadığında burada görünecek.');
        yaz(h);
        return;
      }

      h += gorunumSecici();
      /* Öğretmende alt satırda sınıf adı ve mevcut yazar. */
      h += programGovdesi(d, false, function (sp) {
        return sp.className || '';
      });
      for (var i = 0; i < d.lessons.length; i++) {
        var l = d.lessons[i];
        var eksik = l.weeklyHours - l.placed;
        h += '<div class="satir" data-ara="' + esc(l.className + ' ' + l.subject) + '">' +
          '<div class="buyu"><div class="ad">' + esc(l.className) + ' · ' + esc(l.subject) + '</div>' +
          '<div class="alt">' + l.studentCount + ' öğrenci</div></div>' +
          '<span class="etiket ' + (eksik === 0 ? 'yesil' : 'turuncu') + '">' +
          l.placed + ' / ' + l.weeklyHours + ' saat</span></div>';
      }
      h += '</div>';
      yaz(h);
    });
  }

  function ogrenciProgrami() {
    return api('/myschedule' + hedefOgrenci()).then(function (d) {
      var kimin = S.viewStudentId ? S.viewStudentName + ' adına görüntülüyorsun.' : '';
      var h = hero('DERS PROGRAMI', kimin);

      if (!d.className) {
        h += bosKutu('sinif', 'Henüz bir sınıfa yerleştirilmedin. Müdürün seni sınıfa eklediğinde programın burada görünecek.');
        yaz(h);
        return;
      }
      h += '<div class="msg bilgi">Sınıf: <b>' + esc(d.className) + '</b></div>';
      if (!d.cells.length) {
        h += bosKutu('takvim', 'Sınıfının ders programı henüz oluşturulmadı.');
        yaz(h);
        return;
      }
      h += gorunumSecici();
      h += programGovdesi(d, false, function (sp) {
        return sp.teacherName || '';
      });
      yaz(h);
    });
  }

  /* ---- VELİ ---- */
  SAYFALAR.cocuklarim = function () {
    return api('/parent/children').then(function (d) {
      S.children = d.children;
      var h = hero('ÇOCUKLARIM', 'Çocuğunun kartına tıklayarak portalını aç.');
      h += '<div class="kart"><h3>Çocuk ekle</h3>' +
        '<div class="hint" style="margin-bottom:9px">Çocuğunun hesabındaki <b>veli kodunu</b> gir. ' +
        'Büyük/küçük harf duyarlıdır, birebir yaz.</div>' +
        '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
        '<input type="text" id="veliKod" placeholder="örn. K7m@2xPqR4nZt" maxlength="40" ' +
        'autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" ' +
        'style="flex:1;min-width:180px;padding:11px 12px;border:1.5px solid var(--cizgi);border-radius:10px;font-family:ui-monospace,Consolas,monospace">' +
        '<button class="btn" data-act="cocuk-ekle">Ekle</button></div><div id="veliMesaj" style="margin-top:9px"></div></div>';
      h += cocukKartlari(d.children);
      yaz(h);
    });
  };

  function cocukKartlari(list) {
    if (!list.length) return bosKutu('veli', 'Henüz çocuk eklemedin. Veli kodunu kullanarak ekleyebilirsin.');
    var h = '<div class="grid k2">';
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      h += '<div class="kart tikla" data-act="cocuk-ac" data-id="' + esc(c.id) + '" data-ad="' + esc(c.fullName) + '" ' +
        'data-ara="' + esc(c.fullName) + '">' +
        '<h3>' + esc(c.fullName) + '</h3>' +
        '<div style="color:var(--soluk);font-size:13px">' + esc(c.schoolName) + '</div>' +
        '<div style="margin-top:11px"><span class="etiket">Portalını aç</span> ' +
        '<button class="btn kucuk gri" data-act="cocuk-sil" data-id="' + esc(c.id) + '">Kaldır</button></div></div>';
    }
    return h + '</div>';
  }

  /* ---- ayarlar ---- */
  SAYFALAR.profil = function () {
    var u = S.user;
    var h = hero('AYARLAR', ROL_AD[u.role] + ' hesabı');
    h += '<div class="kart"><h3>Hesap bilgilerin</h3>' +
      '<div class="satir"><div class="buyu"><div class="alt">Ad Soyad</div><div class="ad">' + esc(u.fullName) + '</div></div></div>' +
      '<div class="satir"><div class="buyu"><div class="alt">E-posta</div><div class="ad">' + esc(u.email) + '</div></div></div>' +
      (u.schoolName ? '<div class="satir"><div class="buyu"><div class="alt">Okul</div><div class="ad">' + esc(u.schoolName) + '</div></div></div>' : '') +
      (u.branch ? '<div class="satir"><div class="buyu"><div class="alt">Branş</div><div class="ad">' + esc(u.branch) + '</div></div></div>' : '') +
      (u.code ? '<div class="satir"><div class="buyu"><div class="alt">Veli kodun (velinle paylaş)</div>' +
        '<div class="ad kod-goster">' + esc(u.code) + '</div>' +
        '<div class="hint">Büyük/küçük harfler önemli. Veline birebir ilet.</div></div>' +
        '<button class="btn ghost kucuk" data-act="kod-kopyala" data-kod="' + esc(u.code) + '">Kopyala</button></div>' : '') +
      '</div>';

    h += '<div class="kart"><h3>Bilgileri güncelle</h3>' +
      '<div class="field"><label>Ad Soyad</label><input type="text" id="pAd" value="' + esc(u.fullName) + '"></div>' +
      '<div class="row2"><div class="field"><label>İl</label><select id="pIl"><option value="">Seç...</option></select></div>' +
      '<div class="field"><label>İlçe</label><input type="text" id="pIlce" value="' + esc(u.district) + '"></div></div>' +
      '<div class="field"><label>Adres</label><input type="text" id="pAdres" value="' + esc(u.address) + '"></div>' +
      '<button class="btn" data-act="profil-kaydet">Kaydet</button><div id="pMesaj" style="margin-top:10px"></div></div>';

    h += '<div class="kart"><h3>Şifre değiştir</h3>' +
      '<div class="field"><label for="sEski">Mevcut şifren</label>' +
      '<input type="password" id="sEski" autocomplete="current-password"></div>' +
      '<div class="field"><label for="sYeni">Yeni şifren</label>' +
      '<input type="password" id="sYeni" autocomplete="new-password">' +
      '<div class="hint">En az 8 karakter, harf ve rakam içermeli.</div></div>' +
      '<div class="field"><label for="sYeni2">Yeni şifren (tekrar)</label>' +
      '<input type="password" id="sYeni2" autocomplete="new-password"></div>' +
      '<button class="btn" data-act="sifre-kaydet">Şifreyi değiştir</button>' +
      '<div id="sMesaj" style="margin-top:10px"></div></div>';

    h += '<button class="btn tehlike" data-act="cikis">Çıkış yap</button>';
    yaz(h);

    var il = $('pIl');
    for (var i = 0; i < S.meta.cities.length; i++) {
      il.insertAdjacentHTML('beforeend', '<option value="' + esc(S.meta.cities[i]) + '"' +
        (S.meta.cities[i] === u.city ? ' selected' : '') + '>' + esc(S.meta.cities[i]) + '</option>');
    }
    return Promise.resolve();
  };

  /* ================= bildirimler ================= */
  function bildirimleriYenile() {
    if (!S.token) return;
    api('/notifications').then(function (d) {
      S.unread = d.unread;
      var r = $('bildirimRozet');
      if (d.unread > 0) { r.textContent = d.unread > 99 ? '99+' : d.unread; r.style.display = ''; }
      else r.style.display = 'none';
      window.__bildirimler = d.notifications;
    })['catch'](function () { });
  }

  function bildirimPaneliAcKapa() {
    var p = $('bildirimPanel');
    if (p.innerHTML) { p.innerHTML = ''; return; }
    var list = window.__bildirimler || [];
    var h = '<div class="panel">';
    if (!list.length) h += '<div style="padding:22px;text-align:center;color:var(--soluk)">Bildirim yok.</div>';
    for (var i = 0; i < list.length; i++) {
      h += '<div class="bildirim ' + (list[i].read ? '' : 'yeni') + '">' + esc(list[i].text) +
        '<div class="z">' + tarihSaat(list[i].createdAt) + '</div></div>';
    }
    p.innerHTML = h + '</div>';
    if (S.unread > 0) {
      api('/notifications/read', 'POST').then(function () {
        S.unread = 0;
        $('bildirimRozet').style.display = 'none';
        for (var i = 0; i < (window.__bildirimler || []).length; i++) window.__bildirimler[i].read = true;
      })['catch'](function () { });
    }
  }

  /* ================= arama ================= */
  function araUygula() {
    /* Sayfa kendi arama mantığını kurduysa (ör. ödevler) onu çalıştır. */
    if (typeof S.araHook === 'function') { S.araHook(); return; }
    var t = nrm($('araKutu') && $('araKutu').value || '');
    var hedefler = document.querySelectorAll('#sayfa [data-ara]');
    var gorunen = 0;
    for (var i = 0; i < hedefler.length; i++) {
      var el = hedefler[i];
      var uyar = !t || nrm(el.getAttribute('data-ara') || '').indexOf(t) >= 0;
      el.style.display = uyar ? '' : 'none';
      if (uyar) gorunen++;
    }
    /* Arama hiçbir şeyi tutmadıysa kullanıcı boş sayfaya bakmasın. */
    var uyari = $('araBos');
    if (uyari) uyari.parentNode.removeChild(uyari);
    if (t && hedefler.length && gorunen === 0) {
      var d = document.createElement('div');
      d.id = 'araBos';
      d.innerHTML = bosKutu('ara', '"' + t + '" için sonuç bulunamadı.');
      $('sayfa').appendChild(d);
    }
  }

  /* ================= mobil menü ================= */
  function sidebarAc() { $('sidebar').classList.add('acik'); $('sidebarPerde').classList.add('acik'); }
  function sidebarKapat() { $('sidebar').classList.remove('acik'); $('sidebarPerde').classList.remove('acik'); }

  /* 860px üstü masaüstü sayılır: menü kayan panel değil, yerinde daralıp genişler. */
  function masaustuMu() { return window.innerWidth > 860; }

  function menuDurumYaz(kapali) {
    try { localStorage.setItem('ee_menu', kapali ? '1' : '0'); } catch (e) { /* gizli sekmede yazılamaz */ }
  }

  function masaustuDaralt(kapali) {
    document.body.classList.toggle('sidebar-kapali', kapali);
    var hb = $('hamburger');
    if (hb) hb.setAttribute('aria-expanded', kapali ? 'false' : 'true');
    menuDurumYaz(kapali);
  }

  function menuDurumOku() {
    try { return localStorage.getItem('ee_menu') === '1'; } catch (e) { return false; }
  }

  /* ================= tıklama yönetimi ================= */
  function tiklamaKur() {
    document.addEventListener('click', function (ev) {
      var t = ev.target;
      /* en yakın data taşıyan elemanı bul */
      var el = t;
      while (el && el !== document.body && !el.getAttribute) el = el.parentNode;
      var nav = null, act = null, node = t;
      while (node && node !== document.body) {
        if (node.getAttribute) {
          if (!act && node.getAttribute('data-act')) { act = node; }
          if (!nav && node.getAttribute('data-nav')) { nav = node; }
          if (act || nav) break;
        }
        node = node.parentNode;
      }

      if (nav) {
        ev.preventDefault();
        var k = nav.getAttribute('data-nav');
        if (k === 'geri-veli') {
          var rol = S.user ? S.user.role : '';
          S.viewStudentId = null; S.viewStudentName = '';
          git(rol === 'parent' ? 'cocuklarim' : 'okul-ogrenciler');
          return;
        }
        git(k);
        return;
      }
      if (!act) {
        if (t.getAttribute && t.getAttribute('data-perde')) modalKapat();
        if ($('bildirimPanel').innerHTML && !$('btnBildirim').contains(t) && !$('bildirimPanel').contains(t)) {
          $('bildirimPanel').innerHTML = '';
        }
        return;
      }
      ev.preventDefault();
      islem(act.getAttribute('data-act'), act);
    });

    $('hamburger').onclick = function () {
      if (masaustuMu()) {
        masaustuDaralt(!document.body.classList.contains('sidebar-kapali'));
        return;
      }
      if ($('sidebar').classList.contains('acik')) sidebarKapat(); else sidebarAc();
    };
    /* Kaydedilen daraltma tercihi yalnizca masaustunde gecerli;
       mobilde menu zaten kayan panel olarak calisiyor. */
    if (masaustuMu() && menuDurumOku()) masaustuDaralt(true);
    try {
      var kg = localStorage.getItem('ee_program_gorunum');
      if (kg === 'hafta' || kg === 'gun') S.programGorunum = kg;
    } catch (e) { }
    /* Mobilden masaüstüne geçişte açık kalan kayan menüyü kapat. */
    window.addEventListener('resize', function () { if (masaustuMu()) sidebarKapat(); });
    $('sidebarPerde').onclick = sidebarKapat;
    $('btnBildirim').onclick = bildirimPaneliAcKapa;
    $('btnAyarlar').onclick = function () { git('profil'); };
    $('btnProfil').onclick = function () { git('profil'); };
    $('araKutu').oninput = araUygula;

    /* Geri/ileri tuşları: adres değişince o sayfaya git. */
    window.addEventListener('hashchange', function () {
      if (adresGuncelleniyor) return;
      var hedef = adrestenSayfa();
      if (hedef && hedef !== S.page && SAYFALAR[hedef]) git(hedef);
    });
  }

  /* Panoya kopyala. http:// üzerinden (güvensiz origin) navigator.clipboard
     tanımsızdır, o yüzden eski execCommand yöntemine düşen bir yedek var. */
  function eskiYontemKopyala(metin) {
    try {
      var ta = document.createElement('textarea');
      ta.value = metin;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, metin.length);
      var oldu = document.execCommand('copy');
      document.body.removeChild(ta);
      return oldu;
    } catch (e) { return false; }
  }

  function panoyaKopyala(metin, btn) {
    function geriBildir(oldu) {
      if (!btn) return;
      if (!btn.getAttribute('data-eski')) btn.setAttribute('data-eski', btn.textContent);
      var eski = btn.getAttribute('data-eski');
      btn.textContent = oldu ? 'Kopyalandı' : 'Kopyalanamadı';
      setTimeout(function () { btn.textContent = eski; }, 1600);
    }
    if (window.navigator && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(metin).then(
        function () { geriBildir(true); },
        function () { geriBildir(eskiYontemKopyala(metin)); }
      );
      return;
    }
    geriBildir(eskiYontemKopyala(metin));
  }

  function islem(act, el) {
    var id = el.getAttribute('data-id');

    if (act === 'modal-kapat') return modalKapat();
    if (act === 'cikis') return cikisYap();
    if (act === 'kod-kopyala') return panoyaKopyala(el.getAttribute('data-kod') || '', el);

    if (act === 'kayit-yinede') {
      var govde = S.bekleyenKayit;
      if (!govde) { modalKapat(); return; }
      govde.yinede = true;
      el.disabled = true;
      return api('/register', 'POST', govde).then(function (d) {
        modalKapat();
        S.bekleyenKayit = null;
        $('tabGiris').click();
        $('authMesaj').innerHTML = '<div class="msg iyi">' + esc(d.message) + '</div>';
        $('gEmail').value = govde.email;
        $('formKayit').reset();
        botSoru.id = ''; botSoruYukle();
      })['catch'](function (e) {
        el.disabled = false;
        modalKapat();
        mesajGoster('authMesaj', 'hata', e.message);
        botSoruYukle();
      });
    }
    if (act === 'islem-suz') {
      S.islemSuz = el.getAttribute('data-islem');
      git('islem-kaydi');
      return;
    }

    if (act === 'ders-dal') {
      var did = el.getAttribute('data-id');
      if (!S.acikDersler) S.acikDersler = {};
      S.acikDersler[did] = !S.acikDersler[did];
      git('ders-odevleri');
      return;
    }
    if (act === 'ders-hepsini-ac' || act === 'ders-hepsini-kapat') {
      var ac = act === 'ders-hepsini-ac';
      S.acikDersler = {};
      if (ac) {
        var dallar = document.querySelectorAll('[data-act="ders-dal"]');
        for (var dd = 0; dd < dallar.length; dd++) {
          S.acikDersler[dallar[dd].getAttribute('data-id')] = true;
        }
      }
      git('ders-odevleri');
      return;
    }

    if (act === 'dv-bugun') {
      if (S.dvBugunGit) S.dvBugunGit();
      return;
    }

    if (act === 'yil-bak') {
      return api('/egitim-yili/bak', 'POST', { id: el.getAttribute('data-id') })
        .then(function () { return yilBilgisiYukle(); })
        .then(function () { git(S.page); })['catch'](hataGoster);
    }
    if (act === 'yil-aktif') {
      if (!confirm('Bu yıl aktif yapılsın mı?\n\nBundan sonra açılan ödev, ' +
        'program ve yoklama kayıtları bu yıla yazılır.')) return;
      return api('/egitim-yili/aktif-yap', 'POST', { id: el.getAttribute('data-id') })
        .then(function () { return yilBilgisiYukle(); })
        .then(function () { git('egitim-yili'); })['catch'](hataGoster);
    }
    if (act === 'yil-ekle') {
      el.disabled = true;
      return api('/egitim-yili/ekle', 'POST', { ad: $('yilAd').value })
        .then(function (r) {
          el.disabled = false;
          return yilBilgisiYukle().then(function () {
            git('egitim-yili');
            setTimeout(function () { mesajGoster('sayfa', 'iyi', r.message); }, 200);
          });
        })['catch'](function (e) {
          el.disabled = false;
          mesajGoster('yilMesaj', 'hata', e.message);
        });
    }

    /* ---- takvim ---- */
    if (act === 'takvim-ay') {
      var yon = Number(el.getAttribute('data-yon'));
      S.takvimAy += yon;
      if (S.takvimAy < 1) { S.takvimAy = 12; S.takvimYil--; }
      if (S.takvimAy > 12) { S.takvimAy = 1; S.takvimYil++; }
      S.takvimSecili = '';
      git('takvim');
      return;
    }
    if (act === 'takvim-bugun') {
      var bd = new Date();
      S.takvimYil = bd.getFullYear();
      S.takvimAy = bd.getMonth() + 1;
      S.takvimSecili = bd.toISOString().slice(0, 10);
      git('takvim');
      return;
    }
    if (act === 'takvim-gun') {
      S.takvimSecili = el.getAttribute('data-tarih');
      var eskiSecili = document.querySelector('.takvim-hucre.secili');
      if (eskiSecili) eskiSecili.classList.remove('secili');
      el.classList.add('secili');
      return takvimGunCiz(S.takvimSecili);
    }
    if (act === 'takvim-etkinlik-ekle') return takvimEtkinlikModal();
    if (act === 'takvim-etkinlik-kaydet') {
      el.disabled = true;
      return api('/takvim/etkinlik', 'POST', {
        baslik: $('tkBaslik').value,
        tur: $('tkTur').value,
        tarih: $('tkTarih').value,
        bitis: $('tkBitis').value,
        aciklama: $('tkAciklama').value
      }).then(function (r) {
        modalKapat();
        git('takvim');
        setTimeout(function () { mesajGoster('sayfa', 'iyi', r.message); }, 200);
      })['catch'](function (e) {
        el.disabled = false;
        mesajGoster('tkMesaj', 'hata', e.message);
      });
    }
    if (act === 'takvim-etkinlik-sil') {
      if (!confirm('Bu kayıt takvimden kaldırılsın mı?')) return;
      return api('/takvim/etkinlik-sil', 'POST', { id: el.getAttribute('data-id') })
        .then(function () { git('takvim'); })['catch'](hataGoster);
    }

    /* ---- devamsızlık ---- */
    if (act === 'yoklama-ders') {
      S.yoklamaDers = el.getAttribute('data-id');
      S.yoklamaTarih = '';
      git('yoklama');
      return;
    }
    if (act === 'yoklama-durum') {
      var yoid = el.getAttribute('data-ogrenci');
      var ydurum = el.getAttribute('data-durum');
      S.yoklamaDurum[yoid] = ydurum;
      var kap = el.parentNode;
      var dugmeler = kap.querySelectorAll('.durum-dugme');
      for (var i = 0; i < dugmeler.length; i++) {
        dugmeler[i].classList.toggle('secili',
          dugmeler[i].getAttribute('data-durum') === ydurum);
      }
      return;
    }
    if (act === 'yoklama-hepsi-var') {
      var kutular = document.querySelectorAll('.durum-secim');
      for (var q2 = 0; q2 < kutular.length; q2++) {
        var oid2 = kutular[q2].getAttribute('data-ogrenci');
        S.yoklamaDurum[oid2] = 'var';
        var dg = kutular[q2].querySelectorAll('.durum-dugme');
        for (var w = 0; w < dg.length; w++) {
          dg[w].classList.toggle('secili', dg[w].getAttribute('data-durum') === 'var');
        }
      }
      return;
    }
    if (act === 'yoklama-kaydet') {
      var girisler = [];
      for (var oid3 in S.yoklamaDurum) {
        if (Object.prototype.hasOwnProperty.call(S.yoklamaDurum, oid3)) {
          girisler.push({ ogrenciId: oid3, durum: S.yoklamaDurum[oid3] });
        }
      }
      el.disabled = true;
      return api('/devamsizlik/yoklama', 'POST', {
        lessonId: S.yoklamaDers,
        tarih: S.yoklamaTarih,
        girisler: girisler
      }).then(function (r) {
        el.disabled = false;
        mesajGoster('yoklamaMesaj', 'iyi', r.message);
      })['catch'](function (e) {
        el.disabled = false;
        mesajGoster('yoklamaMesaj', 'hata', e.message);
      });
    }

    /* ---- mesajlar ---- */
    if (act === 'mesaj-kutu') {
      S.mesajKutu = el.getAttribute('data-kutu');
      git('mesajlar');
      return;
    }
    if (act === 'mesaj-tur') {
      S.mesajTur = el.getAttribute('data-tur');
      git('mesajlar');
      return;
    }
    if (act === 'mesaj-ac') return mesajAc(el.getAttribute('data-id'));
    if (act === 'mesaj-yeni') return mesajYeniModal();
    if (act === 'mesaj-gonder') return mesajGonderIslemi(el);
    if (act === 'mesaj-sil') {
      var msid = el.getAttribute('data-id');
      if (!confirm(S.mesajKutu === 'giden'
        ? 'Mesaj tüm alıcılardan silinsin mi?'
        : 'Mesaj kutundan kaldırılsın mı?')) return;
      return api('/mesajlar/sil', 'POST', { id: msid })
        .then(function () { modalKapat(); git('mesajlar'); bildirimleriYenile(); })
        ['catch'](hataGoster);
    }
    if (act === 'mesaj-engel-kaldir') {
      var eid = el.getAttribute('data-id');
      var kalan = (S.mesajAyarGecici.engelli || [])
        .filter(function (x) { return x.id !== eid; })
        .map(function (x) { return x.id; });
      return api('/mesajlar/ayar', 'POST',
        { kimden: S.mesajAyarGecici.kimden, engelli: kalan })
        .then(function () { git('mesajlar'); })['catch'](hataGoster);
    }
    if (act === 'mesaj-ayar-kaydet') {
      var secim = document.querySelector('input[name=mesajIzin]:checked');
      el.disabled = true;
      return api('/mesajlar/ayar', 'POST', {
        kimden: secim ? secim.value : 'herkes',
        engelli: (S.mesajAyarGecici.engelli || []).map(function (x) { return x.id; })
      }).then(function () {
        el.disabled = false;
        mesajGoster('mesajAyarMesaj', 'iyi', 'Ayar kaydedildi.');
      })['catch'](function (e) {
        el.disabled = false;
        mesajGoster('mesajAyarMesaj', 'hata', e.message);
      });
    }

    /* ---- Excel aktarım ---- */
    if (act === 'aktarim-yon') {
      S.aktarim.yon = el.getAttribute('data-yon');
      S.aktarim.rapor = null;
      git('aktarim');
      return;
    }
    if (act === 'aktarim-tur') {
      S.aktarim = { yon: 'ice', tur: el.getAttribute('data-tur'),
        dosyaAd: '', dosya: '', rapor: null };
      git('aktarim');
      return;
    }
    if (act === 'aktarim-sablon') {
      var st = S.aktarim.tur;
      el.disabled = true;
      return dosyaIndir('/api/school/aktarim-sablon?tur=' + st, AKTARIM_ADLARI[st].dosya)
        .then(function () { el.disabled = false; })
        ['catch'](function (e) { el.disabled = false; hataGoster(e); });
    }
    if (act === 'aktarim-sec') {
      var giris = $('aktarimDosya');
      if (giris) giris.click();
      return;
    }
    if (act === 'aktarim-yukle') {
      el.disabled = true;
      return api('/school/aktarim-ice', 'POST',
        { tur: S.aktarim.tur, dosya: S.aktarim.dosya, uygula: false })
        .then(function (r) {
          S.aktarim.rapor = r.rapor || [];
          S.aktarim.ozet = {
            hazir: r.hazir || 0, hatali: r.hatali || 0, uyarili: r.uyarili || 0
          };
          git('aktarim');
        })['catch'](function (e) {
          el.disabled = false;
          mesajGoster('aktarimMesaj', 'hata', e.message);
        });
    }
    if (act === 'aktarim-uygula') {
      var A2 = S.aktarim;
      var soru = A2.tur === 'ogrenci'
        ? A2.ozet.hazir + ' öğrenci hesabı açılacak.\n\nHer birine giriş kodu ' +
          'üretilecek ve öğrenciler yazdığın şifreyle giriş yapabilecek. Onaylıyor musun?'
        : A2.ozet.hazir + ' ders saati programa eklenecek.\n\nVar olan program ' +
          'silinmez, üzerine eklenir. Onaylıyor musun?';
      if (!confirm(soru)) return;
      el.disabled = true;
      return api('/school/aktarim-ice', 'POST',
        { tur: A2.tur, dosya: A2.dosya, uygula: true })
        .then(function (r) {
          S.aktarim = { tur: A2.tur, dosyaAd: '', dosya: '', rapor: null, sonuc: r };
          git('aktarim');
        })['catch'](function (e) {
          el.disabled = false;
          mesajGoster('aktarimMesaj', 'hata', e.message);
        });
    }
    if (act === 'aktarim-vazgec') {
      S.aktarim.rapor = null;
      S.aktarim.dosya = '';
      S.aktarim.dosyaAd = '';
      git('aktarim');
      return;
    }
    if (act === 'aktarim-temizle') {
      S.aktarim.sonuc = null;
      git('aktarim');
      return;
    }
    if (act === 'aktarim-disa') {
      var dt = el.getAttribute('data-tur');
      var kayit = null;
      for (var di = 0; di < DISA_LISTE.length; di++) {
        if (DISA_LISTE[di].k === dt) kayit = DISA_LISTE[di];
      }
      if (!kayit) return;
      el.disabled = true;
      return dosyaIndir('/api/school/aktarim-disa?tur=' + dt, kayit.dosya)
        .then(function () { el.disabled = false; })
        ['catch'](function (e) { el.disabled = false; hataGoster(e); });
    }

    /* ---- yedekleme ---- */
    if (act === 'yedek-al') {
      el.disabled = true;
      return api('/admin/backup-now', 'POST')
        .then(function (r) {
          mesajGoster('yedekMesaj', 'iyi', r.yedek.ad + ' alındı (' + boyutYaz(r.yedek.boyut) + ')');
          setTimeout(function () { git('yedekler'); }, 900);
        })['catch'](function (e) {
          el.disabled = false;
          mesajGoster('yedekMesaj', 'hata', e.message);
        });
    }
    if (act === 'yedek-indir') {
      var iad = el.getAttribute('data-ad');
      el.disabled = true;
      return dosyaIndir('/api/admin/backup-download?ad=' + encodeURIComponent(iad), iad)
        .then(function () { el.disabled = false; })
        ['catch'](function (e) { el.disabled = false; hataGoster(e); });
    }
    if (act === 'yedek-geri') {
      var yad = el.getAttribute('data-ad');
      if (!confirm(yad + ' geri yüklensin mi?\n\nBu yedekten sonraki bütün değişiklikler ' +
        'kaybolur. Şimdiki hâl geri-alma kopyası olarak saklanacak.')) return;
      el.disabled = true;
      return api('/admin/backup-restore', 'POST', { ad: yad })
        .then(function (r) {
          alert(r.message + '\n\nSayfa yenilenecek.');
          location.reload();
        })['catch'](function (e) { el.disabled = false; hataGoster(e); });
    }
    if (act === 'yedek-sil') {
      var sad = el.getAttribute('data-ad');
      if (!confirm(sad + ' silinsin mi?')) return;
      return api('/admin/backup-delete', 'POST', { ad: sad })
        .then(function () { git('yedekler'); })['catch'](hataGoster);
    }

    /* ---- admin: müdür hesapları ---- */
    if (act === 'mudur-sil') {
      var mad = el.getAttribute('data-ad') || 'Bu müdür';
      var mokul = el.getAttribute('data-okul') || '';
      if (!confirm(mad + ' hesabı silinsin mi? (' + mokul + ')\n\n' +
        'Okul "beklemede" durumuna döner, yeni kayıt alamaz. Öğretmen ve öğrenci ' +
        'hesapları silinmez; okula yeni bir müdür başvurabilir.')) return;
      return api('/admin/principal-delete', 'POST', { userId: id })
        .then(function () { git('mudurler'); })['catch'](hataGoster);
    }

    /* ---- müdür: öğrenci hesapları ---- */
    if (act === 'ogrenci-olustur') return ogrenciOlusturModal();

    if (act === 'ogrenci-kaydet') {
      var govde = {
        fullName: $('oAd').value,
        email: $('oEposta').value,
        password: $('oSifre').value,
        classId: $('oSinif').value,
        grade: $('oKademe').value,
        note: $('oNot') ? $('oNot').value : ''
      };
      el.disabled = true;
      return api('/school/student-create', 'POST', govde)
        .then(function (r) {
          /* Şifre yalnızca burada, bir kez gösteriliyor. */
          modalAc('Hesap açıldı',
            '<div class="msg iyi">' + esc(r.message) + '</div>' +
            '<div class="satir"><div class="buyu"><div class="alt">Kullanıcı adı</div>' +
            '<div class="ad">' + esc(r.student.email) + '</div></div></div>' +
            '<div class="satir"><div class="buyu"><div class="alt">Şifre</div>' +
            '<div class="kod-goster">' + esc(govde.password) + '</div></div>' +
            '<button class="btn ghost kucuk" data-act="kod-kopyala" data-kod="' + esc(govde.password) + '">Kopyala</button></div>' +
            '<div class="satir"><div class="buyu"><div class="alt">Veli kodu</div>' +
            '<div class="kod-goster">' + esc(r.student.code) + '</div></div>' +
            '<button class="btn ghost kucuk" data-act="kod-kopyala" data-kod="' + esc(r.student.code) + '">Kopyala</button></div>' +
            '<div class="hint">Bu bilgileri şimdi kaydet — şifre bir daha gösterilemez.</div>',
            '<button class="btn" data-act="ogrenci-bitti">Tamam</button>');
        })['catch'](function (e) {
          el.disabled = false;
          mesajGoster('ogrenciMesaj', 'hata', e.message);
        });
    }
    if (act === 'ogrenci-bitti') { modalKapat(); return git('okul-ogrenciler'); }

    if (act === 'ogrenci-duzenle') {
      return ogrenciHesapModal(id, el.getAttribute('data-ad') || '')['catch'](hataGoster);
    }
    if (act === 'hesap-kaydet') {
      el.disabled = true;
      return api('/school/student-update', 'POST', {
        studentId: id, fullName: $('hAd').value, email: $('hEposta').value,
        note: $('hNot') ? $('hNot').value : ''
      }).then(function () {
        return api('/school/class-assign', 'POST', { studentId: id, classId: $('hSinif').value });
      }).then(function () {
        el.disabled = false;
        mesajGoster('hesapMesaj', 'iyi', 'Bilgiler kaydedildi.');
      })['catch'](function (e) {
        el.disabled = false;
        mesajGoster('hesapMesaj', 'hata', e.message);
      });
    }
    if (act === 'sifre-uret') {
      /* Okunması kolay ama tahmin edilmesi zor bir şifre üret. */
      var harfler = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      var rakam = '23456789';
      var uret = '';
      var dizi = new Uint32Array(10);
      (window.crypto || window.msCrypto).getRandomValues(dizi);
      for (var u = 0; u < 8; u++) uret += harfler[dizi[u] % harfler.length];
      uret += rakam[dizi[8] % rakam.length];
      uret += rakam[dizi[9] % rakam.length];
      $('hSifre').value = uret;
      return;
    }
    if (act === 'ogr-sifre-kaydet') {
      var yeniSifre = $('hSifre').value;
      if (!yeniSifre) { mesajGoster('hesapMesaj', 'hata', 'Yeni şifreyi yaz ya da üret.'); return; }
      if (!confirm('Şifre değiştirilsin mi? Öğrencinin açık oturumları kapanacak.')) return;
      el.disabled = true;
      return api('/school/student-password', 'POST', { studentId: id, password: yeniSifre })
        .then(function (r) {
          el.disabled = false;
          mesajGoster('hesapMesaj', 'iyi', r.message + ' Yeni şifre: ' + yeniSifre);
        })['catch'](function (e) {
          el.disabled = false;
          mesajGoster('hesapMesaj', 'hata', e.message);
        });
    }
    if (act === 'kod-yenile') {
      if (!confirm('Yeni veli kodu üretilsin mi? Eski kod çalışmaz olur.')) return;
      return api('/school/student-code-reset', 'POST', { studentId: id })
        .then(function (r) {
          mesajGoster('hesapMesaj', 'iyi', 'Yeni veli kodu: ' + r.code);
        })['catch'](hataGoster);
    }
    if (act === 'ogrenci-portal') {
      return ogrenciPortalAc(id, el.getAttribute('data-ad') || 'Öğrenci');
    }

    /* ---- roller ---- */
    if (act === 'rol-yeni') return rolModal('');
    if (act === 'rol-duzenle') return rolModal(id);
    if (act === 'rol-sil') {
      var rad = el.getAttribute('data-ad') || 'Bu rol';
      if (!confirm(rad + ' silinsin mi? Bu roldeki kişiler varsayılan yetkilere döner.')) return;
      return api('/school/role-delete', 'POST', { roleId: id })
        .then(function () { git('roller'); })['catch'](hataGoster);
    }
    if (act === 'rol-kaydet') {
      var ad = $('rAd').value.trim();
      if (!ad) { mesajGoster('rolMesaj', 'hata', 'Rol adı yaz.'); return; }
      var izinler = [];
      var kutular = document.querySelectorAll('.yetki-kutu');
      for (var yi = 0; yi < kutular.length; yi++) {
        /* Varsayılan yetkiler zaten açık, role yazmaya gerek yok. */
        if (kutular[yi].checked && !kutular[yi].disabled) izinler.push(kutular[yi].value);
      }

      /* Ders / sınıf daraltmalarını topla */
      var kapsam = {};
      for (var ki = 0; ki < izinler.length; ki++) {
        var izin = izinler[ki];
        var alan = document.querySelector('.kapsam-alan[data-izin="' + izin + '"]');
        if (!alan) continue;
        var kayit = {};
        ['ders', 'sinif'].forEach(function (tur) {
          var tumu = alan.querySelector('.kapsam-tumu[data-tur="' + tur + '"]');
          if (!tumu) return;
          if (tumu.checked) { kayit[tur === 'ders' ? 'dersler' : 'siniflar'] = ['*']; return; }
          var secilenler = alan.querySelectorAll('.kapsam-oge[data-tur="' + tur + '"]:checked');
          var dizi = [];
          for (var m = 0; m < secilenler.length; m++) dizi.push(secilenler[m].value);
          kayit[tur === 'ders' ? 'dersler' : 'siniflar'] = dizi.length ? dizi : ['*'];
        });
        if (Object.keys(kayit).length) kapsam[izin] = kayit;
      }

      el.disabled = true;
      var istek = id
        ? api('/school/role-update', 'POST', { roleId: id, name: ad, permissions: izinler, kapsam: kapsam })
        : api('/school/role', 'POST', { name: ad, permissions: izinler, kapsam: kapsam });
      return istek.then(function () { modalKapat(); git('roller'); })
        ['catch'](function (e) { el.disabled = false; mesajGoster('rolMesaj', 'hata', e.message); });
    }

    /* ---- sınıflar ---- */
    if (act === 'sinif-ekle') {
      var ad = ($('yeniSinif').value || '').trim();
      if (!ad) { mesajGoster('sinifMesaj', 'hata', 'Sınıf adı yaz (ör. 7-A)'); return; }
      el.disabled = true;
      return api('/school/class', 'POST', { name: ad })
        .then(function () { git('siniflar'); })
        ['catch'](function (e) { el.disabled = false; mesajGoster('sinifMesaj', 'hata', e.message); });
    }
    if (act === 'sinif-sil') {
      var sad = el.getAttribute('data-ad') || 'Bu sınıf';
      if (!confirm(sad + ' silinsin mi? Öğrenciler sınıfsız kalır, ' +
        'sınıfın dersleri ve ders programı silinir. Öğrenci hesapları silinmez.')) return;
      return api('/school/class-delete', 'POST', { classId: id })
        .then(function () { git('siniflar'); })['catch'](hataGoster);
    }
    if (act === 'sinif-program') {
      S.programSinif = id;
      S.programGun = 0;
      return git('program');
    }
    if (act === 'sinif-dersler') {
      return sinifDersleriModal(id, el.getAttribute('data-ad') || '')['catch'](hataGoster);
    }
    if (act === 'sinif-ogrenciler') {
      return sinifOgrencileriModal(id, el.getAttribute('data-ad') || '')['catch'](hataGoster);
    }
    if (act === 'sinif-yerlestir') {
      return sinifOgrencileriModal('', '')['catch'](hataGoster);
    }
    if (act === 'ders-ekle') {
      var ders = $('yeniDers') ? $('yeniDers').value : '';
      var saat = $('yeniDersSaat') ? $('yeniDersSaat').value : 0;
      el.disabled = true;
      return api('/school/lesson', 'POST', { classId: id, subject: ders, weeklyHours: saat })
        .then(function () {
          return sinifDersleriModal(id, (S.dersBilgi['class'] || {}).name || '');
        })['catch'](function (e) { el.disabled = false; hataGoster(e); });
    }
    if (act === 'ders-sil') {
      var cid = el.getAttribute('data-cid');
      if (!confirm('Ders silinsin mi? Bu dersin ders programındaki saatleri de silinir.')) return;
      return api('/school/lesson-delete', 'POST', { lessonId: id })
        .then(function () { return sinifDersleriModal(cid, (S.dersBilgi['class'] || {}).name || ''); })
        ['catch'](hataGoster);
    }

    /* ---- ders programı ---- */
    if (act === 'cakisma-ac') {
      S.cakismaAcik = !S.cakismaAcik;
      return programYenidenCiz();
    }
    if (act === 'program-gun') {
      S.programGun = parseInt(el.getAttribute('data-gun'), 10) || 1;
      return programYenidenCiz();
    }
    if (act === 'program-gorunum') {
      S.programGorunum = el.getAttribute('data-tur') === 'hafta' ? 'hafta' : 'gun';
      try { localStorage.setItem('ee_program_gorunum', S.programGorunum); } catch (e) { }
      return programYenidenCiz();
    }
    if (act === 'saat-ekle') {
      return saatModal(parseInt(el.getAttribute('data-gun'), 10), '');
    }
    if (act === 'saat-duzenle') {
      return saatModal(0, id);
    }
    if (act === 'saat-sil') {
      if (!confirm('Bu ders saati programdan silinsin mi?')) return;
      return api('/school/schedule-delete', 'POST', { scheduleId: id })
        .then(function () { return programCiz(); })['catch'](hataGoster);
    }
    if (act === 'saat-kaydet') {
      var duzenlenen = el.getAttribute('data-id') || '';
      var govde = {
        day: $('mGun').value,
        lessonId: $('mDers').value,
        start: $('mBas').value,
        end: $('mBit').value
      };
      if (!govde.start || !govde.end) {
        mesajGoster('saatMesaj', 'hata', 'Başlangıç ve bitiş saatini gir.');
        return;
      }
      el.disabled = true;
      var istek = duzenlenen
        ? api('/school/schedule-update', 'POST',
            { scheduleId: duzenlenen, day: govde.day, lessonId: govde.lessonId,
              start: govde.start, end: govde.end })
        : api('/school/schedule-add', 'POST',
            { classId: S.programSinif, day: govde.day, lessonId: govde.lessonId,
              start: govde.start, end: govde.end });

      return istek.then(function (r) {
        modalKapat();
        /* Uyarıyı sayfanın kendi çizimine bırak; #sayfa'ya doğrudan yazmak
           tüm içeriği siliyordu. */
        S.programUyari = r.uyari
          ? (r.uyari.tur === 'ogretmen'
              ? 'Bu öğretmen aynı saatte ' + r.uyari.className + ' sınıfında ' +
                r.uyari.subject + ' dersinde de görünüyor (' + r.uyari.start + '-' + r.uyari.end + ').'
              : 'Bu sınıfın aynı saatte başka dersi var: ' + r.uyari.subject +
                ' (' + r.uyari.start + '-' + r.uyari.end + ').')
          : '';
        return programCiz();
      })['catch'](function (e) {
        el.disabled = false;
        mesajGoster('saatMesaj', 'hata', e.message);
      });
    }

    if (act === 'odev-filtre-temizle') {
      var mod = S.odevF.mod;
      S.odevF = { ders: '', durum: '', bas: '', bit: '', mod: mod };
      if ($('araKutu')) $('araKutu').value = '';
      return git(S.page);
    }
    if (act === 'kaynakca') {
      return modalAc('Kaynakça', '<p>Bu sistem Eğitim Evi projesi kapsamında geliştirilmiştir.</p>' +
        '<p style="color:var(--soluk);font-size:13.5px">Tüm veriler okulunun kendi sunucusunda saklanır, ' +
        'üçüncü taraflarla paylaşılmaz ve sistemde reklam bulunmaz.</p>');
    }

    /* admin */
    if (act === 'admin-onay') {
      return api('/admin/decide', 'POST', { userId: id, approve: el.getAttribute('data-ok') === '1' })
        .then(function () { git('onaylar'); bildirimleriYenile(); })['catch'](hataGoster);
    }

    /* müdür */
    if (act === 'ogretmen-onay') {
      return api('/school/teacher-decide', 'POST', { userId: id, approve: el.getAttribute('data-ok') === '1' })
        .then(function () { git('ogretmenler'); })['catch'](hataGoster);
    }

    /* ödev */
    if (act === 'odev-yeni') return odevYeniModal()['catch'](hataGoster);
    if (act === 'odev-tumu' || act === 'odev-hicbiri') {
      var isaret = act === 'odev-tumu';
      var hepsi = document.querySelectorAll('.ogrenci-kutu');
      for (var t = 0; t < hepsi.length; t++) hepsi[t].checked = isaret;
      odevSecimBagla();
      teslimGunuBagla();
      return;
    }
    if (act === 'odev-kaydet') {
      var secili = document.querySelectorAll('.ogrenci-kutu:checked');
      if (!secili.length) {
        mesajGoster('mHata', 'hata', 'En az bir öğrenci seç.');
        return;
      }
      var idler = [];
      for (var si = 0; si < secili.length; si++) idler.push(secili[si].value);

      el.disabled = true;
      return api('/assignments', 'POST', {
        subject: $('mDers') ? $('mDers').value : '',
        title: $('mBaslik').value,
        description: $('mAciklama').value,
        startAt: $('mBas').value,
        endAt: $('mBit').value,
        endTime: $('mBitSaat') ? $('mBitSaat').value : '12:00',
        studentIds: idler
      }).then(function () {
        modalKapat(); git('ogr-odevler');
      })['catch'](function (e) {
        el.disabled = false;
        mesajGoster('mHata', 'hata', e.message);
      });
    }
    if (act === 'odev-ac') return odevAc(id)['catch'](hataGoster);
    if (act === 'sonuc-sec') {
      if (!window.__sonuclar) window.__sonuclar = {};
      window.__sonuclar[el.getAttribute('data-sid')] = el.getAttribute('data-val');
      /* aynı satırdaki butonları güncelle */
      var kutu = el.parentNode;
      var btns = kutu.querySelectorAll('button');
      for (var i = 0; i < btns.length; i++) {
        var s = btns[i] === el;
        btns[i].className = 'btn kucuk' + (s ? '' : ' gri');
        btns[i].style.background = s ? 'var(--ana)' : '';
      }
      return;
    }
    if (act === 'odev-bitir') {
      return api('/assignments/' + id + '/finish', 'POST', { results: window.__sonuclar || {} })
        .then(function () { git('ogr-odevler'); })['catch'](hataGoster);
    }
    if (act === 'odev-tekrar') {
      return api('/assignments/' + id + '/reopen', 'POST').then(function () { git('ogr-odevler'); })['catch'](hataGoster);
    }
    if (act === 'odev-sil') {
      if (!confirm('Bu ödev silinsin mi? Geri alınamaz.')) return;
      return api('/assignments/' + id + '/delete', 'POST').then(function () { git('ogr-odevler'); })['catch'](hataGoster);
    }

    /* sınav */
    if (act === 'grup-yeni') {
      var ds = '';
      if (S.user.role === 'principal') {
        ds = '<div class="field"><label>Ders</label><select id="mDers">';
        for (var j = 0; j < S.meta.subjects.length; j++) {
          ds += '<option value="' + esc(S.meta.subjects[j]) + '">' + esc(S.meta.subjects[j]) + '</option>';
        }
        ds += '</select></div>';
      }
      return modalAc('Yeni sınav grubu', ds +
        '<div class="field"><label>Grup adı</label><input type="text" id="mAd" placeholder="Dönem 1 - Yarıyıl 1"></div><div id="mHata"></div>',
        '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
        '<button class="btn" data-act="grup-kaydet">Oluştur</button>');
    }
    if (act === 'grup-kaydet') {
      var gb = { name: $('mAd').value };
      if ($('mDers')) gb.subject = $('mDers').value;
      return api('/examgroups', 'POST', gb).then(function () {
        modalKapat(); git('ogr-sinavlar');
      })['catch'](function (e) { mesajGoster('mHata', 'hata', e.message); });
    }
    if (act === 'grup-ac') return grupAc(id)['catch'](hataGoster);
    if (act === 'grup-sil') {
      if (!confirm('Sınav grubu ve içindeki tüm sınavlar silinsin mi?')) return;
      return api('/examgroups/' + id + '/delete', 'POST').then(function () { git('ogr-sinavlar'); })['catch'](hataGoster);
    }
    if (act === 'sinav-yeni') {
      window.__grupId = id;
      return modalAc('Yeni sınav',
        '<div class="field"><label>Sınav adı</label><input type="text" id="mAd" placeholder="1. Yazılı"></div>' +
        '<div class="field"><label>Etki oranı (%)</label><input type="number" id="mAgirlik" value="50" min="1" max="100">' +
        '<div class="hint">Bu sınavın grup ortalamasındaki ağırlığı.</div></div><div id="mHata"></div>',
        '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
        '<button class="btn" data-act="sinav-kaydet">Ekle</button>');
    }
    if (act === 'sinav-kaydet') {
      return api('/exams', 'POST', {
        groupId: window.__grupId, name: $('mAd').value, weight: $('mAgirlik').value
      }).then(function () {
        modalKapat(); grupAc(window.__grupId);
      })['catch'](function (e) { mesajGoster('mHata', 'hata', e.message); });
    }
    if (act === 'sinav-ac') return sinavAc(id)['catch'](hataGoster);
    if (act === 'sinav-sil') {
      if (!confirm('Bu sınav ve notları silinsin mi?')) return;
      var gid = el.getAttribute('data-gid');
      return api('/exams/' + id + '/delete', 'POST').then(function () { grupAc(gid); })['catch'](hataGoster);
    }
    if (act === 'not-kaydet') {
      var girdiler = document.querySelectorAll('[data-not]');
      var notlar = {};
      for (var k = 0; k < girdiler.length; k++) {
        notlar[girdiler[k].getAttribute('data-not')] = girdiler[k].value === '' ? null : girdiler[k].value;
      }
      var gid2 = el.getAttribute('data-gid');
      return api('/exams/' + id + '/grades', 'POST', { grades: notlar })
        .then(function () { grupAc(gid2); })['catch'](hataGoster);
    }

    /* veli */
    if (act === 'cocuk-ekle') {
      return api('/parent/link', 'POST', { code: $('veliKod').value })
        .then(function () { git('cocuklarim'); })['catch'](function (e) { mesajGoster('veliMesaj', 'hata', e.message); });
    }
    if (act === 'cocuk-ac') {
      S.viewStudentId = id; S.viewStudentName = el.getAttribute('data-ad');
      return git('ilerleyisim');
    }
    if (act === 'cocuk-sil') {
      if (!confirm('Bu çocuk hesabından kaldırılsın mı?')) return;
      return api('/parent/unlink', 'POST', { studentId: id }).then(function () { git('cocuklarim'); })['catch'](hataGoster);
    }

    /* ayarlar */
    if (act === 'profil-kaydet') {
      return api('/profile', 'POST', {
        fullName: $('pAd').value, city: $('pIl').value,
        district: $('pIlce').value, address: $('pAdres').value
      }).then(function (d) {
        S.user = d.user;
        $('profilEtiket').textContent = d.user.fullName.split(' ')[0];
        mesajGoster('pMesaj', 'iyi', 'Bilgilerin kaydedildi.');
      })['catch'](function (e) { mesajGoster('pMesaj', 'hata', e.message); });
    }
    if (act === 'sifre-kaydet') {
      var yeni1 = $('sYeni').value;
      var yeni2 = $('sYeni2').value;
      if (!$('sEski').value) { mesajGoster('sMesaj', 'hata', 'Mevcut şifreni gir.'); return; }
      if (yeni1 !== yeni2) { mesajGoster('sMesaj', 'hata', 'Yeni şifreler birbirini tutmuyor.'); return; }
      if (yeni1 === $('sEski').value) {
        mesajGoster('sMesaj', 'hata', 'Yeni şifre eskisiyle aynı olamaz.');
        return;
      }
      el.disabled = true;
      return api('/password', 'POST', { old: $('sEski').value, 'new': yeni1 })
        .then(function () {
          el.disabled = false;
          mesajGoster('sMesaj', 'iyi', 'Şifren değiştirildi.');
          $('sEski').value = ''; $('sYeni').value = ''; $('sYeni2').value = '';
        })['catch'](function (e) {
          el.disabled = false;
          mesajGoster('sMesaj', 'hata', e.message);
        });
    }
  }

  function hataGoster(e) { alert(e.message); }

  /* Şifre sıfırlama bağlantısındaki tek kullanımlık anahtar. */
  var yeniSifreAnahtar = '';
  var yeniSifreEkraniAcDisaridan = function () { };

  /* ================= başlat / çıkış ================= */
  function uygulamayiBaslat() {
    $('authWrap').style.display = 'none';
    $('app').classList.add('on');
    $('profilEtiket').textContent = S.user.fullName.split(' ')[0];
    S.viewStudentId = null;
    if (!S.meta.cities.length) {
      api('/meta').then(function (m) { S.meta = m; })['catch'](function () { });
    }
    var acilis = adrestenSayfa();
    /* Yıl bilgisi sayfa çizilmeden gelsin ki şerit ilk açılışta da görünsün. */
    yilBilgisiYukle().then(function () {
      git(acilis && SAYFALAR[acilis] ? acilis : 'ana');
    });
    bildirimleriYenile();
    if (!window.__bildirimSayac) {
      window.__bildirimSayac = setInterval(bildirimleriYenile, 30000);
    }
  }

  function cikisYap(sessiz) {
    var bitir = function () {
      S.token = null; S.user = null; S.viewStudentId = null;
      try { localStorage.removeItem('ee_token'); } catch (e) { }
      $('app').classList.remove('on');
      $('authWrap').style.display = '';
      $('sayfa').innerHTML = '';
      if (window.__bildirimSayac) { clearInterval(window.__bildirimSayac); window.__bildirimSayac = null; }
      if (!sessiz) $('authMesaj').innerHTML = '';
    };
    if (sessiz) return bitir();
    api('/logout', 'POST').then(bitir)['catch'](bitir);
  }

  /* ================= açılış ================= */
  authKur();
  tiklamaKur();
  /* Kurulum akışı girişten bağımsız: giriş ekranındayken de yüklenebilsin. */
  pwaKur();

  /* Şifre sıfırlama bağlantısıyla gelindiyse doğrudan o ekranı aç.
     Anahtar adresin # kısmında; sunucuya hiç gitmiyor. */
  var sifirlamaAnahtari = (function () {
    var m = /[#&?]t=([a-f0-9]{64})/i.exec(location.hash || '');
    return (m && /yeni-sifre/.test(location.hash)) ? m[1] : '';
  })();
  if (sifirlamaAnahtari) {
    try { localStorage.removeItem('ee_token'); } catch (e) { }
    yeniSifreEkraniAcDisaridan(sifirlamaAnahtari);
  }

  var kayitli = sifirlamaAnahtari ? null : tokenOku();
  if (kayitli) {
    S.token = kayitli;
    api('/me').then(function (d) {
      if (d.user.status !== 'approved') { cikisYap(true); return; }
      S.user = d.user; S.children = d.children || [];
      uygulamayiBaslat();
    })['catch'](function () { cikisYap(true); });
  }
})();
