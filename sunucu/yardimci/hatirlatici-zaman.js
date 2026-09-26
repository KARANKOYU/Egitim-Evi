'use strict';
/* Hatırlatıcı zamanları. Saf hesap (veritabanı yok), birim testleri var.

   Saatler Türkiye saatidir (UTC+3; 2016'dan beri yaz saati yok). Sunucu
   başka saat diliminde çalışsa da (VPS'ler çoğu zaman UTC) "08:30"
   Türkiye'de 08:30'dur.

   h: { siklik: 'bir-kez'|'her-gun'|'her-hafta'|'her-ay', tarih: 'YYYY-AA-GG',
        saat: 'SS:DD', gunler: [1..7] (1 Pazartesi), ayGunu: 1..31,
        aktif, sonGonderim (ISO ya da boş), olusturma (ISO) } */

const TR = 3 * 60 * 60 * 1000;
const GUN = 24 * 60 * 60 * 1000;

/* Türkiye'de o gün o saatin gerçek anı (ms). */
const an = (tarih, saat) => Date.parse(tarih + 'T' + saat + ':00+03:00');

/* Bir anın Türkiye'deki günü: 'YYYY-AA-GG'. */
const trGun = ms => new Date(ms + TR).toISOString().slice(0, 10);

const gunEkle = (tarih, n) => new Date(Date.parse(tarih + 'T00:00:00Z') + n * GUN).toISOString().slice(0, 10);

/* 1 Pazartesi ... 7 Pazar */
function haftaGunu(tarih) {
  const g = new Date(tarih + 'T12:00:00Z').getUTCDay();
  return g === 0 ? 7 : g;
}

function ayinSonGunu(tarih) {
  const [y, a] = tarih.split('-').map(Number);
  return new Date(Date.UTC(y, a, 0)).getUTCDate();
}

/* O gün hatırlatılır mı? Ayın 31'i seçiliyse 30 çeken ayda 30'unda,
   şubatta son gününde hatırlatılır. */
function gunUyar(h, tarih) {
  if (h.siklik === 'bir-kez') return tarih === h.tarih;
  if (h.siklik === 'her-gun') return true;
  if (h.siklik === 'her-hafta') return (h.gunler || []).indexOf(haftaGunu(tarih)) >= 0;
  if (h.siklik === 'her-ay') return Number(tarih.slice(8, 10)) === Math.min(h.ayGunu, ayinSonGunu(tarih));
  return false;
}

/* Şimdiden sonraki ilk hatırlatma anı (ms), yoksa null. */
function sonraki(h, simdi) {
  if (!h.aktif) return null;
  const bugun = trGun(simdi);
  for (let i = 0; i < 400; i++) {
    const t = gunEkle(bugun, i);
    if (!gunUyar(h, t)) continue;
    const a = an(t, h.saat);
    if (a > simdi) return a;
  }
  return null;
}

/* Şimdi gönderilmesi gereken an (ms) ya da 0: anı gelmiş, bu an için daha
   gönderilmemiş, hatırlatıcı o andan önce kurulmuş. Sunucu bir süre kapalı
   kaldıysa 6 saate kadar geciken hatırlatma yine gider, daha eskisi gitmez. */
const GECIKME = 6 * 60 * 60 * 1000;
function zamaniGeldi(h, simdi) {
  if (!h.aktif) return 0;
  const son = h.sonGonderim ? Date.parse(h.sonGonderim) : 0;
  const kurulus = h.olusturma ? Date.parse(h.olusturma) : 0;
  const bugun = trGun(simdi);
  for (const t of [bugun, gunEkle(bugun, -1)]) {
    if (!gunUyar(h, t)) continue;
    const a = an(t, h.saat);
    if (a <= simdi && simdi - a <= GECIKME && a > son && a > kurulus) return a;
  }
  return 0;
}

module.exports = { an, trGun, gunEkle, haftaGunu, ayinSonGunu, gunUyar, sonraki, zamaniGeldi };
