'use strict';
/* E-posta onayları (016): kayıt ve e-posta değişikliği için bekleyen bağlantılar.
   Anahtarın kendisi değil SHA-256 özeti saklanır. */

const { tek, calistir } = require('../baglanti');

const suresiGecenleriSil = () => calistir('DELETE FROM eposta_onaylari WHERE bitis < now()');

async function ekle(o) {
  await suresiGecenleriSil();
  await calistir(
    'INSERT INTO eposta_onaylari (anahtar_ozeti, tur, eposta, kullanici_id, kullanici_adi, ad_soyad, sifre_ozeti, ' +
    '  telefon, tc_kimlik, adres, kvkk_surum, bitis) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
    [o.ozet, o.tur, o.eposta, o.kullaniciId || null, o.kullaniciAdi || null, o.adSoyad || null, o.sifreOzeti || null,
      o.telefon || '', o.tc || null, o.adres || '', o.kvkkSurum || null, o.bitis]);
}

/* Süresi geçmemiş onay satırı. */
const bul = ozet => tek('SELECT * FROM eposta_onaylari WHERE anahtar_ozeti = $1 AND bitis > now()', [ozet]);

const sil = ozet => calistir('DELETE FROM eposta_onaylari WHERE anahtar_ozeti = $1', [ozet]);

/* Aynı adres için bekleyen eski bağlantılar düşer: son gönderilen geçerli. */
const adresinkileriSil = (eposta, tur) => calistir('DELETE FROM eposta_onaylari WHERE eposta = $1 AND tur = $2', [eposta, tur]);

/* Hesabın bekleyen e-posta değişikliği bağlantıları. */
const hesabinkileriSil = kullaniciId => calistir("DELETE FROM eposta_onaylari WHERE kullanici_id = $1 AND tur = 'eposta'", [kullaniciId]);

module.exports = { ekle, bul, sil, adresinkileriSil, hesabinkileriSil, suresiGecenleriSil };
