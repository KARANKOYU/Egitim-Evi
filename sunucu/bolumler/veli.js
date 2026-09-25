'use strict';
/* Veli uçları (/api/parent): çocuk bağlama ve çıkarma.
   Çocuk her zaman yetişkin hesabına bağlanır; okul rolündeyken (öğretmen,
   müdür) istek gelirse bağ, rolün bağlı olduğu yetişkin hesabına kurulur. */

const { hataSay, hataSiniriDoldu, hizSinir, istemciIp } = require('../guvenlik');
const { bad, ok } = require('../http');
const { childrenOf } = require('../iliskiler');
const { clean, kodSade, now, uid } = require('../ortak');
const { depo, bildir, islem } = require('../veri');

/* Veli koduyla çocuğu hesaba bağlar. { hata, kod } ya da { hesap } döner. */
async function cocukBagla(hesap, kodHam, req) {
  /* Veli kodu tahmin saldırısına karşı: hesap başına dakikada 5 deneme. */
  if (!hizSinir('kod:' + hesap.id, 5, 60 * 1000)) {
    return { hata: 'Çok fazla kod denemesi. Bir dakika bekleyip tekrar dene.', kod: 429 };
  }
  /* Çok hesap açıp her birinden kod denemek de sınırlı: aynı bağlantıdan
     saatte en fazla 30 yanlış kod. */
  const ipAnahtar = 'veliKodHata:' + istemciIp(req);
  if (hataSiniriDoldu(ipAnahtar, 30)) {
    return { hata: 'Bu bağlantıdan çok fazla yanlış kod denendi. Bir saat sonra tekrar dene.', kod: 429 };
  }
  /* Büyük/küçük harf, boşluk ve tire fark etmez: "abcde fgh23" de olur. */
  const code = kodSade(clean(kodHam, 40));
  const st = code ? await depo.kullanicilar.kodlaOgrenci(code) : null;
  if (!st) {
    hataSay(ipAnahtar, 30, 60 * 60 * 1000);
    return { hata: 'Bu koda sahip bir öğrenci bulunamadı. Kodu öğrencinin Ayarlar sayfasından kontrol et.', kod: 400 };
  }
  if (st.id === hesap.id) return { hata: 'Kendi hesabını veli olarak ekleyemezsin.', kod: 400 };
  if (await depo.kullanicilar.bagliMi(hesap.id, st.id)) return { hata: 'Bu öğrenci zaten ekli', kod: 400 };
  /* Rolsüz yetişkin hesabı burada veli olur. Hepsi tek işlemde. */
  await islem(async () => {
    if (!hesap.role) await depo.kullanicilar.rolsuzuVeliYap(hesap.id);
    await depo.kullanicilar.bagla(uid('pl'), hesap.id, st.id, now());
    /* Veli kayıtta okul seçmiyor; çocuğuna bağlanınca onun okuluna bağlanmış
       oluyor. Takvim, mesaj ve duyurular buna dayanıyor. */
    if (!hesap.schoolId && st.schoolId) await depo.kullanicilar.guncelle(hesap.id, { schoolId: st.schoolId });
  });
  await bildir(st.id, hesap.fullName + ' veli olarak hesabına bağlandı.', '', { veliye: false });
  return { hesap: await depo.kullanicilar.bul(hesap.id), ogrenci: st };
}

