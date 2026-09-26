'use strict';
/* İşlem kaydı (/api/islem-kaydi): kim ne zaman ne yaptı. */

const { istemciIp } = require('../guvenlik');
const { bad, ok } = require('../http');
const { clean } = require('../ortak');
const { depo } = require('../veri');
const { yetkiVarMi } = require('../yetki');

/* ============ işlem kaydı ============
   Hesap açma, yetki değiştirme, toplu aktarım, yedekten dönme gibi
   geri alması zor işlemler kaydediliyor. "Kim sildi?" sorusunun
   cevabı olmadan bir okul sistemi güvenilir sayılmaz.

   Sıradan okuma istekleri kaydedilmiyor; tablo bir günde şişerdi.
   Üst sınır (en fazla 5000 kayıt) depo tarafında: depo/genel.js */

const ISLEM_AD = {
  'hesap.acildi': 'Hesap açıldı',
  'hesap.silindi': 'Hesap silindi',
  'hesap.toplu-acildi': 'Excel ile toplu hesap açıldı',
  'sifre.sifirlandi': 'Şifre sıfırlandı (kullanıcı)',
  'sifre.mudur-degistirdi': 'Şifre yönetici tarafından değiştirildi',
  'sifre.toplu-dagitildi': 'Toplu giriş bilgisi dağıtıldı (şifreler yenilendi)',
  'yemek.kaydedildi': 'Yemek listesi kaydedildi',
  'rol.olusturuldu': 'Rol oluşturuldu',
  'rol.degistirildi': 'Rol yetkileri değiştirildi',
  'rol.silindi': 'Rol silindi',
  'rol.atandi': 'Kullanıcıya rol atandı',
  'ogretmen.onaylandi': 'Öğretmen onaylandı',
  'kisi.okula-eklendi': 'Kişi okula eklendi',
  'veli.baglandi': 'Veli öğrenciye bağlandı',
  'veli.cozuldu': 'Veli bağı kaldırıldı',
  'mudur.basvurdu': 'Müdürlük başvurusu yapıldı',
  'ogretmen.cikarildi': 'Öğretmen okuldan çıkarıldı',
  'program.toplu-eklendi': 'Excel ile ders programı eklendi',
  'yedek.geri-yuklendi': 'Yedekten geri yüklendi',
  'yedek.silindi': 'Yedek silindi',
  'giris.basarisiz': 'Başarısız giriş denemesi',
  'yil.acildi': 'Eğitim yılı açıldı',
  'yil.aktif-degisti': 'Aktif eğitim yılı değişti',
  'okul.acildi': 'Okul yönetici tarafından açıldı',
  'okul-sayfa.duzenlendi': 'Okul sayfası düzenlendi',
  'okul-sayfa.foto': 'Okul sayfasına fotoğraf yüklendi',
  'okul-sayfa.foto-silindi': 'Okul sayfasından fotoğraf silindi',
  'yorum.reddedildi': 'Uygunsuz kelimeli yorum reddedildi',
  'yorum.gizlendi': 'Yorum gizlendi',
  'yorum.acildi': 'Yorum yeniden gösterildi',
  'etut.acildi': 'Etüt açıldı',
  'etut.degistirildi': 'Etüt değiştirildi',
  'etut.silindi': 'Etüt silindi',
  'etut.ogrenciler': 'Etüdün öğrencileri değişti',
  'etut.yoklama': 'Etüt yoklaması alındı',
  'ogretmen.eklendi': 'Öğretmen kodla okula eklendi',
  'ogretmen.ayrildi': 'Öğretmen okuldan ayrıldı',
  'okul.adres': 'Okulun adresi değişti',
  'okul.konum': 'Okulun haritadaki yeri değişti',
  'hesap.eposta': 'Hesabın e-postası değişti',
  'hesap.bilgi': 'Hesap bilgileri değişti',
  'ogrenci.nakil': 'Öğrenci başka okuldan nakil geldi',
  'okul.ozellik': 'Okulun özellikleri değişti (bölüm açıldı ya da kapandı)'
};

/* Kayıt yazılamazsa asıl işlem bozulmasın: hata yalnızca günlüğe düşer. */
async function islemYaz(kisi, islem, detay, req) {
  /* Yetişkin hesabının kendi işlemleri (şifre, e-posta...) bir okulun
     kaydına düşmez: hesabın okulu çocuğunun okuludur, o okul yönetimi
     velinin kişisel işlemlerini ve IP adresini görmemeli. Okulsuz yazılır,
     yalnızca sistem yöneticisi görür. */
  if (kisi && depo.kullanicilar.yetiskinMi(kisi)) kisi = Object.assign({}, kisi, { schoolId: '' });
  try {
    await depo.genel.islemYaz(kisi, islem, detay, req ? istemciIp(req) : '');
  } catch (e) {
    console.error('İşlem kaydı yazılamadı:', e.message);
  }
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { res, me, q, p, method, need } = k;

  if (p === 'islem-kaydi' && method === 'GET') {
    if (!need()) return;
    const hepsi = me.role === 'admin';
    if (!hepsi && !yetkiVarMi(me, 'islem-kaydi.gor')) {
      return bad(res, 'İşlem kaydını görme yetkin yok', 403);
    }

    const suz = clean(q.get('islem'), 40);
    const r = await depo.genel.islemKayitlari(hepsi ? null : me.schoolId, suz, 300);

    return ok(res, {
      toplam: r.toplam,
      /* Hangi işlem türleri gerçekten kayıtta var — filtre kutusunu doldurmak için. */
      turler: r.turler.map(t => ({ k: t, ad: ISLEM_AD[t] || t })),
      kayitlar: r.kayitlar.map(k => ({
        id: k.id, tarih: k.tarih,
        kisi: k.userAd, rol: k.userRol,
        islem: k.islem, islemAd: ISLEM_AD[k.islem] || k.islem,
        detay: k.detay, ip: k.ip
      }))
    });
  }

  return false;
}

module.exports = {
  ISLEM_AD,
  islemYaz,
  uclar
};
