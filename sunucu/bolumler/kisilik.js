'use strict';
/* Yetişkin hesabı: portallar (okul rolleri ve çocuklar), "Ekle", hesap
   bilgileri ve hesabı silme.
     /api/kisilikler            GET   portallar: okul rolleri, çocuklar, kişi kodu (yalnız okur)
     /api/kisilik/gec           POST  seçilen portala (role ya da çocuğun velisi olarak) geç
     /api/kisilik/kod           POST  kişi kodunu yenile
     /api/kisilik/cocuk         POST  veli koduyla çocuk ekle
     /api/kisilik/cocuk-kaldir  POST  çocuğu hesaptan çıkar
     /api/kisilik/ayril         POST  okul rolünü bırak (öğretmen)
     /api/hesap                 GET   kişisel bilgiler (okul rolündeyken yetişkin hesabınınkiler)
     /api/hesap/bilgi           POST  kullanıcı adı, e-posta, telefon (mevcut şifreyle)
     /api/hesap/sil             POST  hesabı sil (KVKK: silme hakkı)

   Kural: bir oturum her zaman tek bir kişiliğe açılır (öğretmen@A, müdür@B ya
   da yetişkin hesabının kendisi). Portal değiştirmek yeni oturum demektir; eski
   anahtar hemen kapanır. Kişi yalnızca kendi yetişkin hesabına bağlı rollere
   geçebilir; her şey sunucuda denetlenir.

   Kişi kodu (sütun eslesme_kodu, biçimi ortak.js): kişi onu okulunun müdürüne
   verir (öğretmen olarak eklenir) ya da sistem yöneticisine verir (okulu açılır,
   müdürü olur). Kod tek kullanımlıktır: kullanılınca yenilenir. Hesap açılırken
   üretilir (kayit.js epostaOnayi); GET /api/kisilikler kod yazmaz. */

const { ONAY_OMRU_MS, epostaAlaniVarMi, epostaMaskele, hizSinir, istekAnahtari, kodOzeti, onayBaglantisiGonder } = require('../guvenlik');
const { bad, ok, sendJSON } = require('../http');
const {
  clean, kullaniciAdiSorunu, normEmail, normKullaniciAdi, normTelefon, telefonSorunu
} = require('../ortak');
const { verifyPw } = require('../sifre');
const { depo, bildir, islem } = require('../veri');
const { kisilikListesi, oturumCevabi } = require('./kayit');
const { islemYaz } = require('./islem-kaydi');
const { cocukBagla } = require('./veli');

const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Oturumdaki kişinin yetişkin hesabı (okul rolündeyse bağlı olduğu hesap).
   Okulun açtığı hesaplarda (öğrenci, servisçi) ve yöneticide null. */
async function anaHesap(me) {
  if (!me) return null;
  const ana = me.anaHesapId ? await depo.kullanicilar.bul(me.anaHesapId) : me;
  return depo.kullanicilar.yetiskinMi(ana) ? ana : null;
}

function hesapGorunumu(h, yetiskin) {
  return {
    fullName: h.fullName, username: h.username, email: h.email || '', phone: h.phone || '',
    address: h.address || '', city: h.city || '', district: h.district || '', tc: h.tc || '',
    dogum: h.dogum || '', yetiskin: !!yetiskin
  };
}

async function uclar(k) {
  const { req, res, me, body, p, segs, method, need } = k;
  if (p !== 'kisilikler' && p !== 'kisilik' && p !== 'hesap') return false;
  if (!need()) return;
  const ana = await anaHesap(me);
  const alt = segs[2] || '';

  /* ---------- kişisel bilgiler ---------- */
  if (p === 'hesap' && !alt && method === 'GET') {
    return ok(res, { hesap: hesapGorunumu(ana || me, !!ana) });
  }

  if (!ana) {
    return bad(res, me.role === 'admin' ? 'Yönetici hesabında portal seçimi yok.'
      : 'Bu işlem yetişkin hesabıyla yapılır. Hesabını okul yönetimi düzenler.', 403);
  }

  /* ---------- portallar ve kişi kodu (yan etkisiz: yalnız okur) ---------- */
  if (p === 'kisilikler' && method === 'GET') {
    const liste = await kisilikListesi(ana);
    return ok(res, Object.assign(liste, {
      hesap: { fullName: ana.fullName, username: ana.username },
      aktif: me.anaHesapId ? me.id : 'hesap',
      /* Ham kod (boşluksuz); ekran 5'erli gösterir, Kopyala bunu verir. */
      kisiKodu: ana.eslesmeKodu || ''
    }));
  }

  if (p !== 'kisilik' && p !== 'hesap') return false;

  /* ---------- role geç ---------- */
  if (p === 'kisilik' && alt === 'gec' && method === 'POST') {
    if (!hizSinir('kisilikGec:' + ana.id, 60, 60 * 1000)) return bad(res, 'Çok hızlı. Biraz bekle.', 429);
    let tur = clean(body.tur, 10);
    const id = clean(body.id, 60);
    /* Telefon bildirimi (?k=) yetişkin hesabının kendisine gelmişse "rol"
       olarak istenir; o durumda hesabın kendisine geçilir. */
    if (tur === 'rol' && id === ana.id) tur = 'hesap';
    let hedef = null, ek = {};
    if (tur === 'rol') {
      const r = await depo.kullanicilar.bul(id);
      if (!r || r.anaHesapId !== ana.id) return bad(res, 'Bu rol hesabında yok.', 404);
      if (r.status !== 'approved' || r._okulDurum !== 'approved') {
        return bad(res, r._okulDurum !== 'approved'
          ? 'Bu okul şu an kapalı; sistem yöneticisi yeni müdürünü atayınca açılır.' : 'Bu role şu an girilemez.', 403);
      }
      hedef = r;
    } else if (tur === 'veli') {
      if (!await depo.kullanicilar.bagliMi(ana.id, id)) return bad(res, 'Bu öğrenci hesabına bağlı değil.', 404);
      hedef = ana;
      ek = { cocuk: id };
    } else if (tur === 'hesap') {
      hedef = ana;
    } else {
      return bad(res, 'Geçersiz seçim');
    }
    /* Eski anahtar kapanır: bir tarayıcıda aynı anda tek kişilik. */
    const eski = istekAnahtari(req);
    if (eski) await depo.oturumlar.kapat(eski);
    return oturumCevabi(res, hedef, ek);
  }

  /* ---------- kişi kodunu yenile ---------- */
  if (p === 'kisilik' && alt === 'kod' && method === 'POST') {
    if (!hizSinir('eslesmeKodu:' + ana.id, 10, 60 * 60 * 1000)) return bad(res, 'Kodu çok sık yeniledin. Biraz sonra dene.', 429);
    const kod = await depo.kullanicilar.yeniKisiKodu();
    await depo.kullanicilar.eslesmeKoduYaz(ana.id, kod);
    return ok(res, { kisiKodu: kod, message: 'Yeni kod üretildi; eskisi artık çalışmaz.' });
  }

  /* ---------- çocuk ekle / çıkar ---------- */
  if (p === 'kisilik' && alt === 'cocuk' && method === 'POST') {
    const r = await cocukBagla(ana, body.code, req);
    if (r.hata) return bad(res, r.hata, r.kod);
    return ok(res, Object.assign(await kisilikListesi(r.hesap), {
      message: r.ogrenci.fullName + ' hesabına eklendi.'
    }));
  }
  if (p === 'kisilik' && alt === 'cocuk-kaldir' && method === 'POST') {
    const sid = clean(body.id, 60);
    if (!await depo.kullanicilar.bagliMi(ana.id, sid)) return bad(res, 'Bu öğrenci hesabına bağlı değil.', 404);
    await depo.kullanicilar.bagiCoz(ana.id, sid);
    return ok(res, await kisilikListesi(ana));
  }

  /* ---------- okul rolünü bırak (öğretmen) ----------
     Müdür bırakamaz: okul yeni müdürü atanmadan sahipsiz kalmasın. */
  if (p === 'kisilik' && alt === 'ayril' && method === 'POST') {
    const r = await depo.kullanicilar.bul(clean(body.id, 60));
    if (!r || r.anaHesapId !== ana.id) return bad(res, 'Bu rol hesabında yok.', 404);
    if (r.role === 'principal') {
      return bad(res, 'Okulun müdürlüğünü bırakmak için sistem yöneticisiyle iletişime geç: okul yeni müdürü ' +
        'atanmadan sahipsiz kalmasın.');
    }
    if (body.onay !== true) return bad(res, 'Onaylaman gerekiyor.');
    const okulAdi = r._okulAdi || '';
    await islemYaz(r, 'ogretmen.ayrildi', r.fullName, req);
    const mudur = await depo.kullanicilar.okulunMuduru(r.schoolId);
    await depo.kullanicilar.rolSatiriniSil(r.id, ana.id);
    if (mudur) await bildir(mudur.id, r.fullName + ' okulun öğretmen listesinden ayrıldı.', '#/ogretmenler');
    const mesaj = okulAdi + ' okulundan ayrıldın.';
    /* Bıraktığı roldeyse oturumu o satırla birlikte kapandı: yetişkin hesabına döner. */
    if (me.id === r.id) return oturumCevabi(res, ana, { message: mesaj });
    return ok(res, Object.assign(await kisilikListesi(ana), { message: mesaj }));
  }

  /* ---------- giriş bilgileri: kullanıcı adı, e-posta, telefon ---------- */
  if (p === 'hesap' && alt === 'bilgi' && method === 'POST') {
    if (!hizSinir('hesapBilgi:' + ana.id, 10, 60 * 60 * 1000)) return bad(res, 'Çok sık değiştirdin. Biraz sonra dene.', 429);
    if (!await verifyPw(String(body.sifre || ''), ana.pass)) {
      return sendJSON(res, 400, { error: 'Mevcut şifre yanlış.', alan: 'sifre' });
    }
    const d = {};
    let yeniEposta = '';
    if (body.kullaniciAdi !== undefined) {
      const kadi = normKullaniciAdi(body.kullaniciAdi);
      const sorun = kullaniciAdiSorunu(kadi);
      if (sorun) return sendJSON(res, 400, { error: sorun, alan: 'kullaniciAdi' });
      if (kadi !== ana.username) {
        if (await depo.kullanicilar.kullaniciAdiBaskasinda(kadi, ana.id)) {
          return sendJSON(res, 400, { error: 'Bu kullanıcı adı alınmış. Başka bir ad dene.', alan: 'kullaniciAdi' });
        }
        d.username = kadi;
      }
    }
    if (body.eposta !== undefined) {
      const eposta = normEmail(body.eposta);
      /* Yetişkin hesabında e-posta zorunlu: giriş kodu ve şifre sıfırlama oraya gider. */
      if (!EPOSTA.test(eposta)) return sendJSON(res, 400, { error: 'Geçerli bir e-posta adresi gir.', alan: 'eposta' });
      if (eposta !== ana.email) {
        if (await depo.kullanicilar.epostaVarMi(eposta, ana.id)) {
          return sendJSON(res, 400, { error: 'Bu e-posta başka bir hesapta kayıtlı.', alan: 'eposta' });
        }
        if (!await epostaAlaniVarMi(eposta)) {
          return sendJSON(res, 400, { error: '"' + eposta.split('@')[1] + '" alan adı e-posta almıyor.', alan: 'eposta' });
        }
        yeniEposta = eposta;   // hemen değişmez: yeni adrese onay bağlantısı gider
      }
    }
    if (body.telefon !== undefined) {
      const sorun = telefonSorunu(body.telefon);
      if (sorun) return sendJSON(res, 400, { error: sorun, alan: 'telefon' });
      const tel = normTelefon(body.telefon);
      if (tel !== ana.phone) d.phone = tel;
    }
    /* Yeni e-posta: kişi o adresin sahibi olduğunu bağlantıyla kanıtlayınca değişir. */
    let epostaMesaji = '';
    if (yeniEposta) {
      if (!hizSinir('epostaDegis:' + ana.id, 3, 60 * 60 * 1000)) return bad(res, 'Çok sık denedin. Biraz sonra tekrar dene.', 429);
      await depo.onaylar.hesabinkileriSil(ana.id);
      const gonderim = await onayBaglantisiGonder(yeniEposta, ana.fullName, 'eposta');
      await depo.onaylar.ekle({ ozet: kodOzeti(gonderim.anahtar), tur: 'eposta', eposta: yeniEposta, kullaniciId: ana.id,
        bitis: new Date(Date.now() + ONAY_OMRU_MS).toISOString() });
      epostaMesaji = epostaMaskele(yeniEposta) + ' adresine bir bağlantı gönderdik; tıklayınca e-postan değişir.';
    }
    if (!Object.keys(d).length) {
      return ok(res, { hesap: hesapGorunumu(ana, true), message: epostaMesaji || 'Değişiklik yok.', onayBekliyor: !!yeniEposta });
    }
    await islem(async () => {
      await depo.kullanicilar.guncelle(ana.id, d);
      if (d.phone !== undefined) await depo.kullanicilar.rolSatirlariniGuncelle(ana.id, ana.fullName, d.phone);
      /* Okullardaki rol satırları da yeni adı alır (okulda alınmışsa sonuna
         sayı eklenir); eski ad böylece boşa çıkar. */
      if (d.username) {
        for (const r of await depo.kullanicilar.rolleri(ana.id)) {
          await depo.kullanicilar.guncelle(r.id, { username: await depo.kullanicilar.okuldaBosAd(d.username, r.schoolId) });
        }
      }
    });
    await islemYaz(ana, 'hesap.bilgi', Object.keys(d).join(', '), req);
    const yeni = await depo.kullanicilar.bul(ana.id);
    return ok(res, { hesap: hesapGorunumu(yeni, true), onayBekliyor: !!yeniEposta,
      message: 'Bilgilerin kaydedildi.' + (epostaMesaji ? ' ' + epostaMesaji : '') });
  }

  /* ---------- hesabı sil ---------- */
  if (p === 'hesap' && alt === 'sil' && method === 'POST') {
    if (!hizSinir('hesapSil:' + ana.id, 5, 60 * 60 * 1000)) return bad(res, 'Çok fazla deneme. Biraz sonra dene.', 429);
    if (!await verifyPw(String(body.sifre || ''), ana.pass)) {
      return sendJSON(res, 400, { error: 'Mevcut şifre yanlış.', alan: 'sifre' });
    }
    if (body.onay !== true) return bad(res, 'Silmeyi onaylaman gerekiyor.');
    const roller = await depo.kullanicilar.rolleri(ana.id);
    if (roller.some(r => r.role === 'principal')) {
      return bad(res, 'Bir okulun müdürüsün. Hesabını silmeden önce müdürlüğü devretmek için sistem yöneticisiyle iletişime geç.');
    }
    /* Öğretmen rolleri okuldan çıkar, hesap silinir (çocuk bağları,
       bildirimler, oturumlar şema kurallarıyla gider). */
    await islem(async () => {
      for (const r of roller) await depo.kullanicilar.rolSatiriniSil(r.id, ana.id);
      await depo.kullanicilar.sil(ana.id);
    });
    console.log('  Hesap silindi (kişinin isteğiyle): ' + ana.id);
    return ok(res, { message: 'Hesabın ve bütün bilgilerin silindi.' });
  }

  return false;
}

module.exports = { uclar, anaHesap };
