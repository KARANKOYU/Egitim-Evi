/* Hatırlatıcı zaman hesabı (sunucusuz): Türkiye saati, bir kez / her gün /
   haftanın günleri / ayda bir, ay sonu, gönderilmişi yeniden göndermeme,
   kurulmadan önceki anı göndermeme, 6 saatten eski gecikmeyi atma. */
const z = require('../sunucu/yardimci/hatirlatici-zaman');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const iso = ms => ms ? new Date(ms).toISOString() : String(ms);
const TR = s => Date.parse(s + '+03:00');   // "2026-09-28T08:30:00" Türkiye saatiyle

console.log('=== TÜRKİYE SAATİ ===');
kontrol('08:30 Türkiye = 05:30 UTC', iso(z.an('2026-09-28', '08:30')) === '2026-09-28T05:30:00.000Z', iso(z.an('2026-09-28', '08:30')));
kontrol('gece 01:00 TR hâlâ o gün', z.trGun(TR('2026-09-28T01:00:00')) === '2026-09-28', z.trGun(TR('2026-09-28T01:00:00')));
kontrol('28 Eylül 2026 Pazartesi', z.haftaGunu('2026-09-28') === 1);
kontrol('4 Ekim 2026 Pazar = 7', z.haftaGunu('2026-10-04') === 7);
kontrol('şubat 2027 son günü 28', z.ayinSonGunu('2027-02-10') === 28);

console.log('=== SONRAKİ ===');
const kur = TR('2026-09-26T10:00:00');
const gunluk = { siklik: 'her-gun', saat: '08:30', aktif: true, olusturma: iso(kur) };
kontrol('her gün 08:30, saat 10:00ken kurulunca ilki yarın', iso(z.sonraki(gunluk, kur)) === iso(TR('2026-09-27T08:30:00')), iso(z.sonraki(gunluk, kur)));
const haftalik = { siklik: 'her-hafta', saat: '07:45', gunler: [1, 3], aktif: true, olusturma: iso(kur) };
kontrol('Pzt ve Çar: cumartesiden sonra ilki pazartesi', iso(z.sonraki(haftalik, kur)) === iso(TR('2026-09-28T07:45:00')), iso(z.sonraki(haftalik, kur)));
kontrol('pazartesi 08:00 geçmişken sıradaki çarşamba', iso(z.sonraki(haftalik, TR('2026-09-28T08:00:00'))) === iso(TR('2026-09-30T07:45:00')));
const aylik = { siklik: 'her-ay', saat: '09:00', ayGunu: 31, aktif: true, olusturma: iso(kur) };
kontrol('ayın 31i: eylülde 30 unda (ay kısa)', iso(z.sonraki(aylik, kur)) === iso(TR('2026-09-30T09:00:00')), iso(z.sonraki(aylik, kur)));
kontrol('ayın 31i: şubatta son günü', iso(z.sonraki(aylik, TR('2027-02-01T00:00:00'))) === iso(TR('2027-02-28T09:00:00')));
const birKez = { siklik: 'bir-kez', tarih: '2026-10-05', saat: '14:00', aktif: true, olusturma: iso(kur) };
kontrol('bir kez: o gün', iso(z.sonraki(birKez, kur)) === iso(TR('2026-10-05T14:00:00')));
kontrol('bir kez: geçtiyse sonraki yok', z.sonraki(birKez, TR('2026-10-05T14:01:00')) === null);
kontrol('durdurulmuşun sonrakisi yok', z.sonraki(Object.assign({}, gunluk, { aktif: false }), kur) === null);

console.log('=== ZAMANI GELDİ Mİ ===');
kontrol('kurulduğu gün, saat geçmişse o gün gönderilmez', z.zamaniGeldi(gunluk, TR('2026-09-26T10:05:00')) === 0);
kontrol('ertesi gün 08:30 da gelir', z.zamaniGeldi(gunluk, TR('2026-09-27T08:30:20')) === TR('2026-09-27T08:30:00'));
kontrol('08:29 da daha gelmedi', z.zamaniGeldi(gunluk, TR('2026-09-27T08:29:00')) === 0);
const gonderilmis = Object.assign({}, gunluk, { sonGonderim: iso(TR('2026-09-27T08:30:00')) });
kontrol('gönderilmiş an yeniden gönderilmez', z.zamaniGeldi(gonderilmis, TR('2026-09-27T09:00:00')) === 0);
kontrol('sunucu kapalıydı: 5 saat gecikmeli yine gider', z.zamaniGeldi(gunluk, TR('2026-09-27T13:29:00')) === TR('2026-09-27T08:30:00'));
kontrol('6 saatten eski gecikme gitmez', z.zamaniGeldi(gunluk, TR('2026-09-27T15:00:00')) === 0);
kontrol('gece yarısını geçen: 23:50 hatırlatması 00:05 te yine gider', z.zamaniGeldi(
  { siklik: 'her-gun', saat: '23:50', aktif: true, olusturma: iso(kur) }, TR('2026-09-27T00:05:00')) === TR('2026-09-26T23:50:00'));
kontrol('haftalık: salı gelmez', z.zamaniGeldi(haftalik, TR('2026-09-29T07:50:00')) === 0);
kontrol('haftalık: çarşamba gelir', z.zamaniGeldi(haftalik, TR('2026-09-30T07:50:00')) === TR('2026-09-30T07:45:00'));

console.log();
console.log('  GECTI: ' + gecti + '   KALDI: ' + kaldi);
process.exit(kaldi ? 1 : 0);
