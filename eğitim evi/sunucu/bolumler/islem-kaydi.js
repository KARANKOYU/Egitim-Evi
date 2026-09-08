'use strict';
/* İşlem kaydı (/api/islem-kaydi): kim ne zaman ne yaptı. */

const { istemciIp } = require('../guvenlik');
const { bad, ok } = require('../http');
const { clean, now, uid } = require('../ortak');
const { db } = require('../veri');
const { yetkiVarMi } = require('../yetki');

/* ============ işlem kaydı ============
   Hesap açma, yetki değiştirme, toplu aktarım, yedekten dönme gibi
   geri alması zor işlemler kaydediliyor. "Kim sildi?" sorusunun
   cevabı olmadan bir okul sistemi güvenilir sayılmaz.

   Sıradan okuma istekleri kaydedilmiyor; tablo bir günde şişerdi. */

const ISLEM_SINIR = 5000;   // en fazla kaç kayıt saklansın

const ISLEM_AD = {
  'hesap.acildi': 'Hesap açıldı',
  'hesap.silindi': 'Hesap silindi',
  'hesap.toplu-acildi': 'Excel ile toplu hesap açıldı',
  'sifre.sifirlandi': 'Şifre sıfırlandı (kullanıcı)',
  'sifre.mudur-degistirdi': 'Şifre yönetici tarafından değiştirildi',
  'rol.olusturuldu': 'Rol oluşturuldu',
  'rol.degistirildi': 'Rol yetkileri değiştirildi',
  'rol.silindi': 'Rol silindi',
  'rol.atandi': 'Kullanıcıya rol atandı',
  'ogretmen.onaylandi': 'Öğretmen onaylandı',
  'ogretmen.cikarildi': 'Öğretmen okuldan çıkarıldı',
  'program.toplu-eklendi': 'Excel ile ders programı eklendi',
  'yedek.geri-yuklendi': 'Yedekten geri yüklendi',
  'yedek.silindi': 'Yedek silindi',
  'giris.basarisiz': 'Başarısız giriş denemesi',
  'yil.acildi': 'Eğitim yılı açıldı',
  'yil.aktif-degisti': 'Aktif eğitim yılı değişti'
};

function islemYaz(kisi, islem, detay, req) {
  try {
    db.islemKaydi.push({
      id: uid('ik'),
      schoolId: kisi && kisi.schoolId ? kisi.schoolId : '',
      userId: kisi ? kisi.id : '',
      userAd: kisi ? kisi.fullName : '(bilinmiyor)',
      userRol: kisi ? kisi.role : '',
      islem: islem,
      detay: clean(detay, 300),
      ip: req ? istemciIp(req) : '',
      tarih: now()
    });
    /* Sınırı aşınca en eskileri at. */
    if (db.islemKaydi.length > ISLEM_SINIR) {
      db.islemKaydi = db.islemKaydi.slice(-ISLEM_SINIR);
    }
  } catch (e) {
    console.error('Islem kaydi yazilamadi:', e.message);
  }
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'islem-kaydi' && method === 'GET') {
    if (!need()) return;
    const hepsi = me.role === 'admin';
    if (!hepsi && !yetkiVarMi(me, 'islem-kaydi.gor')) {
      return bad(res, 'İşlem kaydını görme yetkin yok', 403);
    }

    const suz = clean(q.get('islem'), 40);
    let liste = db.islemKaydi.filter(k => hepsi || k.schoolId === me.schoolId);
    if (suz) liste = liste.filter(k => k.islem === suz);
    liste = liste.sort((a, b) => String(b.tarih).localeCompare(String(a.tarih)));

    /* Hangi işlem türleri gerçekten kayıtta var — filtre kutusunu doldurmak için. */
    const turler = [];
    for (const k of liste) if (turler.indexOf(k.islem) < 0) turler.push(k.islem);

    return ok(res, {
      toplam: liste.length,
      turler: turler.map(t => ({ k: t, ad: ISLEM_AD[t] || t })),
      kayitlar: liste.slice(0, 300).map(k => ({
        id: k.id, tarih: k.tarih,
        kisi: k.userAd, rol: k.userRol,
        islem: k.islem, islemAd: ISLEM_AD[k.islem] || k.islem,
        detay: k.detay, ip: k.ip
      }))
    });
  }

  /* ---------- devamsızlık ---------- */

  return false;
}

module.exports = {
  ISLEM_SINIR,
  ISLEM_AD,
  islemYaz,
  uclar
};
