/* Yetki denetimi: her API ucunu her rolle deneyip yetkisiz gecen var mi bakar.
   Amac "403/401 donmesi gerekirken 200 donen" ucu yakalamak. */
const { iste, epostaOnayla, girisYap, botCevabi, tcUret, okulHesabi } = require('./giris');

let sorun = 0, kontrolSayisi = 0;
const bulgular = [];

function bekleniyor(ad, cevap, izinliMi) {
  kontrolSayisi++;
  const gecti = cevap.status === 200 || cevap.status === 201;
  if (izinliMi && !gecti) {
    /* Izinli olmasi gerekirken engellendi — is akisini bozar ama guvenlik acigi degil */
    bulgular.push({ tur: 'ENGEL', ad, durum: cevap.status,
      mesaj: (cevap.body && cevap.body.error) || '' });
  }
  if (!izinliMi && gecti) {
    sorun++;
    bulgular.push({ tur: 'ACIK', ad, durum: cevap.status,
      mesaj: JSON.stringify(cevap.body).slice(0, 110) });
  }
}

