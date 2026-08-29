'use strict';
/* Otomatik hatırlatmalar. Her 5 dakikada bir çalışır, ama her kişiye günde
   en fazla BİR hatırlatma gider (gönderilenler hatirlatmalar tablosunda
   işaretlenir, tekrar gitmez):

     - Öğretmene sabah (07:00-12:00 arası ilk çalışmada) günün dersleri:
       "Bugün 4 dersin var: 09:20 7-A Matematik, 10:10 7-B Matematik, ..."
       Eskiden her dersten 15 dakika önce ayrı bildirim gidiyordu; günde
       5-6 bildirim fazlaydı.
     - Öğrenciye (08:00'den sonra) yarın teslimi olan ödevleri tek bildirimde:
       "Yarın Matematik dersinden "Kesirler" ödevin var (son saat 12:00)."
       Birden çok ödev varsa hepsi aynı bildirimde. */

const { depo } = require('./veri');

const HATIRLATMA_ARALIK_MS = 5 * 60 * 1000;
const SABAH_BAS = 7, SABAH_BIT = 12;     // öğretmen özeti bu saatler arasında
const ODEV_BAS = 8;                      // ödev hatırlatması bu saatten sonra
const OZETTE_EN_FAZLA = 4;               // özette adı yazılan ders/ödev sayısı

function yerelTarihAnahtari(d) {
  const p = n => (n < 10 ? '0' : '') + n;
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

/* "a, b, c ve 2 tane daha" */
function listeYaz(parcalar, birim) {
  if (parcalar.length <= OZETTE_EN_FAZLA) return parcalar.join(', ');
  return parcalar.slice(0, OZETTE_EN_FAZLA).join(', ') + ' ve ' + (parcalar.length - OZETTE_EN_FAZLA) + ' ' + birim + ' daha';
}

async function dersOzetleri(simdi) {
  const saat = simdi.getHours();
  if (saat < SABAH_BAS || saat >= SABAH_BIT) return 0;
  /* JS'te 0 Pazar; bizde 1 Pazartesi .. 7 Pazar */
  const gun = simdi.getDay() === 0 ? 7 : simdi.getDay();
  const bugun = yerelTarihAnahtari(simdi);

  const ogretmenin = new Map();
  for (const sp of await depo.siniflar.baslamakUzereOlanlar(gun, '00:00', '23:59')) {
    if (!ogretmenin.has(sp._ogretmenId)) ogretmenin.set(sp._ogretmenId, []);
    ogretmenin.get(sp._ogretmenId).push(sp);
  }
  if (!ogretmenin.size) return 0;

  const anahtar = id => 'gunluk-ders:' + id + ':' + bugun;
  const ilk = await depo.genel.ilkKezOlanlar(Array.from(ogretmenin.keys()).map(anahtar));
  const giden = [];
  for (const [id, dersler] of ogretmenin) {
    if (!ilk.has(anahtar(id))) continue;
    dersler.sort((a, b) => a.start.localeCompare(b.start));
    giden.push({
      kime: id,
      metin: 'Bugün ' + dersler.length + ' dersin var: ' +
        listeYaz(dersler.map(d => d.start + ' ' + (d._sinifAdi || '') + ' ' + d._ders), 'ders') + '.',
      baglanti: '#/programim'
    });
  }
  await depo.genel.cokluBildir(giden);
  return giden.length;
}

