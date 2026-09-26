'use strict';
/* İşlem kaydı (/api/islem-kaydi): kim ne zaman ne yaptı. */

const { istemciIp } = require('../guvenlik');
const { bad, ok } = require('../http');
const { clean } = require('../ortak');
const { depo } = require('../veri');
const { yetkiVarMi } = require('../yetki');

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
