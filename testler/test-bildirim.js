/* Fazladan bildirim gitmiyor mu? Öğrencinin bildirimi velisine de gidiyor mu?
   Aynı olay ikinci kez kaydedilince (ödev sonucu, sınav notu, yoklama,
   ders programı) bildirim tekrar gitmemeli; yalnızca değişen kişiye gitmeli.
   Bildirim yoklaması değişiklik yoksa listeyi göndermemeli.
   Veli: öğrencinin her bildiriminin kopyası, başında çocuğun adıyla; iki
   çocukta karışmaz; devamsızlık gibi veliye zaten kendi metniyle gidenler
   ikinci kez gitmez. */
const { iste, girisYap, hesapAc } = require('./giris');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}
const gun = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

