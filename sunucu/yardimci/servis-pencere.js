'use strict';
/* Okulun servis saat aralıkları. Saf hesap (veritabanı yok), sunucusuz testi
   var: testler/test-servis-pencere.js.

   Okulun iki aralığı vardır: sabah (öğrenciyi evden alma) ve akşam (okuldan
   eve bırakma). Saatler Türkiye saatidir (hatirlatici-zaman.js); sunucunun
   yerel saati kullanılmaz. Her gün geçerlidir (hafta sonu ya da tatil ayrımı
   yok). Bitiş dakikası dahildir: 07:00-09:20 aralığı 09:20'nin sonuna kadar açık.

   Aralık bitince yoldaki sefer 60 dakika daha sürebilir (trafik): "uzatma".
   Sefer yalnız aralık içinde başlar; uzatma da bitince kapanır.

   okul: esleme.okul() nesnesi ({ servisSaatleri: {...} }) ya da doğrudan
   { sabahBas, sabahBit, aksamBas, aksamBit }. */

const { an, trGun, gunEkle } = require('./hatirlatici-zaman');

const VARSAYILAN = Object.freeze({ sabahBas: '07:00', sabahBit: '09:20', aksamBas: '16:30', aksamBit: '19:00' });
const ALANLAR = ['sabahBas', 'sabahBit', 'aksamBas', 'aksamBit'];
const DONEMLER = ['sabah', 'aksam'];
const UZATMA_DK = 60;
const EN_KISA_DK = 30;
const SAAT = /^([01]\d|2[0-3]):[0-5]\d$/;
const DK = 60 * 1000;
const TR = 3 * 60 * DK;

const dakika = s => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));

/* Yazılan aralıklar geçerli mi? Geçerliyse null, değilse kısa Türkçe neden. */
function saatlerSorunu(s) {
  if (!s || typeof s !== 'object') return 'Servis saatlerini yaz.';
  for (const a of ALANLAR) if (typeof s[a] !== 'string' || !SAAT.test(s[a])) return 'Saatleri 07:00 biçiminde yaz.';
  const sb = dakika(s.sabahBas), st = dakika(s.sabahBit), ab = dakika(s.aksamBas), at = dakika(s.aksamBit);
  if (st <= sb) return 'Sabah aralığının bitişi başlangıcından sonra olmalı.';
  if (at <= ab) return 'Akşam aralığının bitişi başlangıcından sonra olmalı.';
  if (st - sb < EN_KISA_DK || at - ab < EN_KISA_DK) return 'Her aralık en az ' + EN_KISA_DK + ' dakika olmalı.';
  if (st > ab) return 'Sabah aralığı akşam aralığı başlamadan bitmeli.';
  return null;
}

/* Okulun aralıkları; eksik ya da bozuksa varsayılan. */
function saatleri(okul) {
  const k = okul && (okul.servisSaatleri || okul);
  const s = {};
  for (const a of ALANLAR) s[a] = k && typeof k[a] === 'string' ? k[a] : '';
  return saatlerSorunu(s) ? Object.assign({}, VARSAYILAN) : s;
}

/* "sabah 07:00–09:20 ve akşam 16:30–19:00" */
const aralikMetni = s => 'sabah ' + s.sabahBas + '–' + s.sabahBit + ' ve akşam ' + s.aksamBas + '–' + s.aksamBit;

const donemBas = (s, d) => d === 'sabah' ? s.sabahBas : s.aksamBas;
const donemBit = (s, d) => d === 'sabah' ? s.sabahBit : s.aksamBit;

/* Belli bir günün belli dönemi: gerçek anlar (ms). Bitiş dakikası dahil. */
function donemAnlari(s, tarih, donem) {
  const bas = an(tarih, donemBas(s, donem));
  const bit = an(tarih, donemBit(s, donem)) + DK;          // bu andan itibaren aralık dışı
  return { bas, bit, uzatmaBit: bit + UZATMA_DK * DK };
}

/* Şu an hangi aralıktayız?
     donem   : 'sabah' | 'aksam' | null (aralık dışı)
     tarih   : dönemin Türkiye günü (aralık dışındaysa bugün)
     bas, bit: içinde bulunulan aralığın saatleri ('SS:DD') ya da null
     uzatma  : { donem, tarih, bit } aralığı biteli 60 dakika olmadıysa, yoksa null
     sonraki : { donem, tarih, bas, bit } bundan sonra başlayacak ilk aralık
     saatler : okulun aralıkları */
function servisPenceresi(okul, simdi) {
  const s = saatleri(okul);
  const t = simdi === undefined ? Date.now() : simdi;
  const bugun = trGun(t);
  let donem = null, tarih = bugun, uzatma = null, sonraki = null;
  for (const g of [gunEkle(bugun, -1), bugun, gunEkle(bugun, 1)]) {
    for (const d of DONEMLER) {
      const a = donemAnlari(s, g, d);
      if (!donem && t >= a.bas && t < a.bit) { donem = d; tarih = g; }
      if (t >= a.bit && t < a.uzatmaBit) uzatma = { donem: d, tarih: g, bit: donemBit(s, d) };
      if (!sonraki && a.bas > t) sonraki = { donem: d, tarih: g, bas: donemBas(s, d), bit: donemBit(s, d) };
    }
  }
  return {
    donem, tarih,
    bas: donem ? donemBas(s, donem) : null,
    bit: donem ? donemBit(s, donem) : null,
    uzatma, sonraki, saatler: s
  };
}

/* Veritabanının saati (seferin başlangıcı, günün "başladı" anı) ile sunucunun
   saati arasındaki küçük fark için aralığın iki ucunda pay. */
const PAY_MS = 2 * DK;

/* An (ms), o günün o dönem aralığının içinde mi? (bitiş dakikası dahil) */
function aralikIcindeMi(okul, tarih, donem, anMs) {
  if (!isFinite(anMs)) return false;
  const a = donemAnlari(saatleri(okul), tarih, donem);
  return anMs >= a.bas - PAY_MS && anMs < a.bit + PAY_MS;
}

/* Sefer hâlâ açık kalabilir mi? Sefer, başladığı günün kendi dönem aralığında
   (sabah seferi = gidis sabah aralığında, akşam seferi = donus akşam
   aralığında) başladıysa o aralığın 60 dakikalık uzatmasına kadar sürer.
   Aralığın dışında başlamış sefer (aralık sonradan değişti ya da eski
   koddan kaldı) sürmez: kapanır. */
function seferSuruyorMu(okul, sefer, simdi) {
  if (!sefer || !sefer.baslangic) return false;
  const s = saatleri(okul);
  const t = simdi === undefined ? Date.now() : simdi;
  const bas = Date.parse(sefer.baslangic);
  if (!isFinite(bas)) return false;
  const tarih = trGun(bas), donem = seferDonemi(sefer.yon);
  if (!aralikIcindeMi(s, tarih, donem, bas)) return false;
  return t < donemAnlari(s, tarih, donem).uzatmaBit;
}

const seferDonemi = yon => yon === 'gidis' ? 'sabah' : 'aksam';
const donemYonu = donem => donem === 'sabah' ? 'gidis' : 'donus';

/* Birden çok okulun aralıklarını kapsayan en geniş aralıklar (telefonun
   bildirim sıklığı için: çocukları farklı okullarda olan veli). */
function saatZarfi(liste) {
  const gecerli = (liste || []).map(saatleri);
  if (!gecerli.length) return null;
  const enKucuk = a => gecerli.map(s => s[a]).sort()[0];
  const enBuyuk = a => gecerli.map(s => s[a]).sort().pop();
  return { sabahBas: enKucuk('sabahBas'), sabahBit: enBuyuk('sabahBit'), aksamBas: enKucuk('aksamBas'), aksamBit: enBuyuk('aksamBit') };
}

/* Anın Türkiye saati: 'SS:DD'. */
const trSaat = ms => new Date(ms + TR).toISOString().slice(11, 16);

/* Saatten sonra gelen bulunma eki: "07:42'de", "08:05'te", "16:40'ta",
   "17:10'da". Saat okunduğu gibi çekimlenir: dakika sıfırsa saat, değilse
   dakikanın son sözcüğü (kırk iki -> iki, on -> on). */
const BIRLER = ['', "'de", "'de", "'te", "'te", "'te", "'da", "'de", "'de", "'da"];   // bir iki üç dört beş altı yedi sekiz dokuz
const ONLAR = ['', "'da", "'de", "'da", "'ta", "'de"];                               // on yirmi otuz kırk elli
function saatEki(hhmm) {
  const m = /^(\d{2}):(\d{2})$/.exec(String(hhmm || ''));
  if (!m) return "'de";
  const sayi = Number(m[2]) || Number(m[1]);
  if (!sayi) return "'da";                                                             // sıfır
  return sayi % 10 ? BIRLER[sayi % 10] : ONLAR[Math.floor(sayi / 10)];
}

/* Bildirimdeki ad: soyadı atılır ("Zeynep Şahin" -> "Zeynep", "Ali Rıza Kaya" -> "Ali Rıza"). */
function ilkAd(adSoyad) {
  const p = String(adSoyad || '').trim().split(/\s+/).filter(Boolean);
  return p.length > 1 ? p.slice(0, -1).join(' ') : (p[0] || '');
}

module.exports = {
  VARSAYILAN, UZATMA_DK, EN_KISA_DK, saatlerSorunu, saatleri, aralikMetni, servisPenceresi, aralikIcindeMi, seferSuruyorMu,
  seferDonemi, donemYonu, saatZarfi, trSaat, saatEki, ilkAd
};
