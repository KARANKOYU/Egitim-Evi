/* Fazladan bildirim gitmiyor mu? Öğrencinin bildirimi velisine de gidiyor mu?
   Aynı olay ikinci kez kaydedilince (ödev sonucu, sınav notu, yoklama,
   ders programı) bildirim tekrar gitmemeli; yalnızca değişen kişiye gitmeli.
   Bildirim yoklaması değişiklik yoksa listeyi göndermemeli.
   Veli: öğrencinin her bildiriminin kopyası, başında çocuğun adıyla; iki
   çocukta karışmaz; devamsızlık gibi veliye zaten kendi metniyle gidenler
   ikinci kez gitmez. */
const { iste, girisYap, hesapAc } = require('./giris');

