/* Çizgi ikonlar (SVG yolları). Emoji kullanılmaz. */

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
  belge: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  goz: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  gozKapali: '<path d="m3 3 18 18"/><path d="M10.6 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-2.8 3.6"/>' +
    '<path d="M6.5 6.9C4 8.6 2.5 12 2.5 12s3.5 6.5 9.5 6.5a9 9 0 0 0 4.6-1.3"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  anket: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h2M7 14h2"/><path d="M12 9h5M12 14h3"/>',
  yemek: '<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M12 3v3M8.5 4v2M15.5 4v2"/><path d="M8 21h8"/>',
  servis: '<rect x="4" y="3" width="16" height="15" rx="2.5"/><path d="M4 11h16"/><path d="M7 21v-3M17 21v-3"/><path d="M8 14.5h.01M16 14.5h.01"/>',
  kulup: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
  yukle: '<path d="M12 16V4"/><path d="m7.5 8.5 4.5-4.5 4.5 4.5"/><path d="M4 20h16"/>',
  ek: '<path d="m20 11.5-8.3 8.3a5 5 0 0 1-7.1-7.1l8.6-8.6a3.4 3.4 0 0 1 4.8 4.8l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9"/>',
  konum: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  harita: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>',
  hedef: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  yildiz: '<path d="M12 3.5 14.6 8.8l5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  oynat: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l5.5-3.5z"/>',
  resim: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-8.5 8.5"/>',
  muzik: '<path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  alev: '<path d="M12 21a7 7 0 0 0 7-7c0-4.5-3.5-6.5-4.5-10-2 1.5-3.5 4-3 6.5-1.3-.6-2.3-2-2.5-3.5C6.5 9 5 11.3 5 14a7 7 0 0 0 7 7z"/><path d="M12 21a2.8 2.8 0 0 1-2.8-2.8c0-1.9 2.8-3.7 2.8-5.2 0 1.5 2.8 3.3 2.8 5.2A2.8 2.8 0 0 1 12 21z"/>'
};

/* ad: ikon adı, ek: ek CSS sınıfı */
/* Profil fotoğrafı yerine baş harfler: "Ayşe Kaya" -> "AK", renkli bir
   yuvarlakta. Renk kişinin kimliğinden (yoksa adından) türetilir; aynı kişi
   her yerde aynı renkte görünür. Fotoğraf yüklenmez (KVKK: çocuk fotoğrafı). */
var AVATAR_RENKLERI = ['#d62839', '#0a8f9c', '#d9820b', '#0a6f79', '#7b4ecf', '#2f855a', '#c2410c', '#3563c9'];

function basHarfler(ad) {
  var p = String(ad || '').trim().split(/\s+/).filter(Boolean);
  if (!p.length) return '?';
  var ilk = p[0].charAt(0), son = p.length > 1 ? p[p.length - 1].charAt(0) : '';
  return (ilk + son).toLocaleUpperCase('tr');
}

function avatar(ad, anahtar, ek) {
  var s = String(anahtar || ad || ''), h = 0;
  for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return '<span class="avatar' + (ek ? ' ' + ek : '') + '" style="--av:' + AVATAR_RENKLERI[h % AVATAR_RENKLERI.length] +
    '" aria-hidden="true">' + esc(basHarfler(ad)) + '</span>';
}

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

/* Son güne kaç takvim günü var (bugün 0, yarın 1, dün -1). Yerel gece
   yarısına göre sayılır; saat ayrıca teslimGecti ile denetlenir. */
function gunFarki(iso) {
  if (!iso) return null;
  var d = new Date(String(iso).slice(0, 10) + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  var bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  return Math.round((d - bugun) / 86400000);
}

/* Aktif ödevin kalan süre etiketi: saat geçtiyse "Süresi doldu", son günse
   "Bugün HH:MM'e kadar", yoksa "N gün kaldı". */
function kalanEtiketi(a) {
  if (teslimGecti(a.endAt, a.endTime)) return '<span class="etiket kirmizi">Süresi doldu</span>';
  var kalan = gunFarki(a.endAt);
  if (kalan === null) return '<span class="etiket mavi">Aktif</span>';
  if (kalan <= 0) return '<span class="etiket turuncu">Bugün ' + esc(a.endTime || '12:00') + '\'e kadar</span>';
  return '<span class="etiket ' + (kalan <= 1 ? 'turuncu' : 'mavi') + '">' + kalan + ' gün kaldı</span>';
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
  gec: { ad: 'Geç yaptı', renk: 'mavi' },
  yapmadi: { ad: 'Yapmadı', renk: 'kirmizi' },
  eksik: { ad: 'Eksik', renk: 'turuncu' },
  izinli: { ad: 'Gelmedi (izinli)', renk: 'gri' },
  gelmedi: { ad: 'Gelmedi (izinsiz)', renk: 'bordo' }
};

var ROL_AD = { student: 'Öğrenci', parent: 'Veli', teacher: 'Öğretmen', principal: 'Müdür', admin: 'Yönetici', servisci: 'Servisçi' };
