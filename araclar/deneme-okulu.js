'use strict';
/*
  Deneme okulu: elle denemek için aynı okula bağlı hesaplar kurar.

    Kullanıcı adı   E-posta                    Durum
    mudur           mudur@deneme.test          okulun müdürü (okul onaylı)
    ogretmen        ogretmen@deneme.test       Matematik öğretmeni (kendi hesabını açtı, müdür koduyla ekledi)
    ogrenci         ogrenci@deneme.test        öğrenci, SINIFSIZ (sınıfı müdür ekranından sen aç, yerleştir)
    veli            veli@deneme.test           öğrenciye bağlı veli (kendisi kaydoldu)
    servisci        —                          servisçi, "1. Servis"e atanmış; öğrenci bu serviste
    yeni.veli       yeni.veli@deneme.test      ROLSÜZ: kaydolmuş, henüz çocuğunu bağlamamış
    Şifre (hepsi): Deneme2026!
    (Güçlü şifre kuralından önce açılmış deneme hesaplarında: Deneme2026)

  Okulun adresi: /deneme-ortaokulu (öğretmen, öğrenci ve servisçi oradan girer).

  Hesaplar gerçek uçlardan (API) geçer: müdür, öğretmen ve veli yetişkin
  hesabı açar (aydınlatma onayı, bot sorusu aynen çalışır); müdür okulunu
  kaydeder, öğretmeni koduyla ekler, öğrenci ve servisçi hesabını açar;
  veli veli kodunu girer. Yalnızca müdürlük
  başvurusunun "yönetici onayı" adımı doğrudan veritabanında yapılır;
  yönetici şifresi bu araçta yok.

  Tekrar çalıştırılırsa var olan hesaplara dokunmaz, eksik olanı tamamlar.
  Sonunda her rol için bir oturum anahtarı yazar (tarayıcı sekmelerini
  hazır açmak için); anahtarlar 7 gün geçerlidir.

  Çalıştırma (sunucu açıkken, günlüğü sunucu.log dosyasına yazarak):
    node sunucu/index.js > sunucu.log
    EE_LOG=sunucu.log node araclar/deneme-okulu.js
*/

const { iste, girisYap, hesapAc, okulHesabi } = require('./giris');
const { ayarlariYukle } = require('../sunucu/ayarlar');
ayarlariYukle();
const baglanti = require('../sunucu/veri/baglanti');
const { depo } = require('../sunucu/veri');

/* Yetişkin hesabının şifresinde büyük/küçük harf, rakam ve özel karakter
   zorunlu; eski deneme hesapları kuraldan önce açıldığı için eski şifrede. */
const SIFRE = 'Deneme2026!';
const ESKI_SIFRE = 'Deneme2026';
const OKUL = { ad: 'Deneme Ortaokulu', il: 'Ankara', ilce: 'Çankaya' };
const HESAP = {
  mudur: { username: 'mudur', email: 'mudur@deneme.test', fullName: 'Selin Aksoy', phone: '05321110011' },
  ogretmen: { username: 'ogretmen', email: 'ogretmen@deneme.test', fullName: 'Emre Doğan', phone: '05321110022' },
  ogrenci: { username: 'ogrenci', email: 'ogrenci@deneme.test', fullName: 'Deniz Yıldırım', phone: '05321110033' },
  veli: { username: 'veli', email: 'veli@deneme.test', fullName: 'Ayten Yıldırım', phone: '05321110044' },
  yeni: { username: 'yeni.veli', email: 'yeni.veli@deneme.test', fullName: 'Ali Yıldırım', phone: '05321110055' },
  servisci: { username: 'servisci', fullName: 'Hakan Yolcu', telefon: '05321110066' }
};
const OKUL_KONUM = { enlem: 39.9208, boylam: 32.8541 };     // Kızılay çevresi (deneme)
const EV_KONUM = { enlem: 39.9030, boylam: 32.8600 };

/* Deneme hesabıyla giriş. Aydınlatma metni yenilendiyse (sürüm değişti)
   bu deneme hesapları için onay burada verilir; gerçek kullanıcı girişte
   onay penceresini görür. */
async function gir(eposta) {
  let g;
  try { g = await girisYap(eposta, SIFRE); } catch (e) {
    if (e.status !== 401 && e.status !== 400) throw e;
    g = await girisYap(eposta, ESKI_SIFRE);
  }
  if (g.kvkkGuncel === false) await iste('/api/kvkk-onay', 'POST', { onay: true }, g.token);
  return g;
}

/* Hesap yoksa rolsüz açar; varsa olduğu gibi döndürür. */
async function hesap(h) {
  const var_ = await depo.kullanicilar.epostayla(h.email);
  if (var_) return var_;
  await hesapAc(Object.assign({ password: SIFRE }, h));
  return depo.kullanicilar.epostayla(h.email);
}

