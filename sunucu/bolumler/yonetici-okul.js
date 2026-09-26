'use strict';
/* Sistem yöneticisinin okul açması (/api/admin/okul-ac) ve kişi koduyla
   kişi bulması (/api/admin/kisi-bul).

   Müdür başvurusu yoktur. Okulunu açtırmak isteyen kişi kendi hesabını açar
   ve "+ Ekle > Müdür"deki kişi kodunu yöneticiye verir. Yönetici kişiyi
   dışarıdan (telefon, e-posta) doğrular; okulu MEB listesinden seçer (ya da
   adını yazar), okulun adresini (egitimevi.org/school/<uzantı>) ve müdürün kişi
   kodunu girer. "Bul" ile kodun kime ait olduğunu görür (tam ad, maskeli
   e-posta). Okul ve müdür rolü onaylı açılır; kişinin kodu aynı işlemde
   yenilenir (tek kullanımlık). Kişi okuluna sol üstteki menüden geçer.
   E-postayla ya da yeni hesap açarak müdür yapma yolu yoktur. */

const { ok, sendJSON } = require('../http');
const { CITIES, clean, kisaAdSorunu, kisiKoduSade, now, uid } = require('../ortak');
const { okulKimlikBul } = require('../okullar');
const { hataSay, hataSiniriDoldu, hizSinir, istemciIp } = require('../guvenlik');
const { depo, bildir, islem } = require('../veri');
const { islemYaz } = require('./islem-kaydi');

/* Kişi kodunun sahibi. Kod tahmin aracına dönmesin: aynı bağlantıdan saatte
   en fazla 30 yanlış kod (bul ve aç birlikte sayılır); "Bul" ayrıca yönetici
   başına dakikada 30. Sistem yöneticisi ve okulun açtığı hesaplar müdür
   yapılamaz (onlarda kişi kodu da yoktur). { kisi, kod } ya da { hata, durum }. */
async function kodunSahibi(req, me, kodHam, bulma) {
  if (bulma && !hizSinir('adminKisiBul:' + me.id, 30, 60 * 1000)) return { hata: 'Çok fazla deneme. Biraz bekle.', durum: 429 };
  const ipAnahtar = 'adminKodHata:' + istemciIp(req);
  if (hataSiniriDoldu(ipAnahtar, 30)) return { hata: 'Çok fazla yanlış kod denendi. Bir saat sonra tekrar dene.', durum: 429 };
  const kod = kisiKoduSade(clean(kodHam, 40));
  const kisi = kod ? await depo.kullanicilar.eslesmeKoduSahibi(kod) : null;
  if (!kisi) {
    hataSay(ipAnahtar, 30, 60 * 60 * 1000);
    return { hata: 'Bu kodla bir hesap yok.', durum: 404 };
  }
  if (kisi.role === 'admin' || kisi.id === me.id) return { hata: 'Sistem yöneticisi hesabı müdür yapılamaz.', durum: 400 };
  if (!depo.kullanicilar.yetiskinMi(kisi)) {
    return { hata: 'Bu kod bir okul hesabına ait; müdür, kendi hesabını açmış bir kişi olabilir.', durum: 400 };
  }
  return { kisi, kod };
}

/* Yöneticiye gösterilen e-posta: ilk iki harf ve hep dört yıldız, alan adı
   açık ("fa****@gmail.com"). Yıldız sayısı sabit: adresin uzunluğu belli olmaz.
   @ işaretinden önceki kısım iki harf ya da daha kısaysa yalnız ilk harf görünür. */
function epostaKisalt(adres) {
  const s = String(adres || '');
  const at = s.indexOf('@');
  if (at < 1) return '';
  return s.slice(0, at > 2 ? 2 : 1) + '****' + s.slice(at);
}

/* POST /api/admin/kisi-bul { kod } -> { ad, eposta (maskeli), kullaniciAdi, rolSayisi } */
async function kisiBul(req, res, me, body) {
  const s = await kodunSahibi(req, me, body.kod, true);
  if (s.hata) return sendJSON(res, s.durum, { error: s.hata, alan: 'kod' });
  const roller = await depo.kullanicilar.rolleri(s.kisi.id);
  return ok(res, { ad: s.kisi.fullName, eposta: epostaKisalt(s.kisi.email), kullaniciAdi: s.kisi.username,
    rolSayisi: roller.length });
}

/* POST /api/admin/okul-ac { mebSchoolId | schoolName, city, district, kisaAd, mudurKodu } */
async function okulAc(req, res, me, body) {
  const alanHata = (alan, mesaj, durum) => sendJSON(res, durum || 400, { error: mesaj, alan });

  /* ---- okul ---- */
  const mebId = clean(body.mebSchoolId, 40);
  let ad, il, ilce, tur = '';
  if (mebId) {
    const meb = okulKimlikBul(mebId);
    if (!meb) return alanHata('okul', 'Seçilen okul listede bulunamadı.');
    ad = meb.ad; il = meb.il; ilce = meb.ilce; tur = meb.tip;
  } else {
    ad = clean(body.schoolName, 140); il = clean(body.city, 60); ilce = clean(body.district, 60);
    if (!ad) return alanHata('okul', 'Okulu listeden seç ya da adını yaz.');
    if (CITIES.indexOf(il) < 0) return alanHata('il', 'Okulun ilini seç.');
    if (!ilce) return alanHata('ilce', 'Okulun ilçesini seç.');
  }
  const kisaAd = clean(body.kisaAd, 60).toLowerCase();
  const kisaSorun = kisaAdSorunu(kisaAd);
  if (kisaSorun) return alanHata('kisaAd', kisaSorun);
  /* Önce okul zaten kayıtlı mı: müdürü kaldırılmış (sahipsiz) okul yeniden
     açılırken kendi eski adresini koruyabilmeli. */
  const dup = await depo.okullar.cakisan(mebId, il, ad);
  const sahipsiz = dup && dup.status !== 'approved' && !(await depo.kullanicilar.okulunMuduruVarMi(dup.id));
  if (dup && !sahipsiz) {
    return alanHata('okul', dup.status === 'approved' ? 'Bu okul zaten kayıtlı ve müdürü var.'
      : 'Bu okul zaten kayıtlı; müdürünü "Müdürler" listesinde bul.');
  }
  if (await depo.okullar.kisaAdVarMi(kisaAd, sahipsiz ? dup.id : '')) return alanHata('kisaAd', 'Bu adres başka bir okulda. Başka bir ad dene.');

  /* ---- müdür: kişi koduyla ---- */
  if (!clean(body.mudurKodu, 40)) return alanHata('mudurKodu', 'Müdürün kişi kodunu yaz.');
  const s = await kodunSahibi(req, me, body.mudurKodu, false);
  if (s.hata) return alanHata('mudurKodu', s.hata, s.durum);
  const ana = s.kisi;
  const roller = await depo.kullanicilar.rolleri(ana.id);
  /* Kişinin bu okulda zaten bir rolü (ör. öğretmenlik) varsa ikinci rol açılmaz. */
  if (sahipsiz && roller.some(r => r.schoolId === dup.id)) {
    return alanHata('mudurKodu', 'Bu kişinin bu okulda zaten bir rolü var (ör. öğretmen). Önce o rolü okuldan çıkar.');
  }
  if (roller.length >= 10) return alanHata('mudurKodu', 'Bu kişi en fazla sayıda okulda (10) rol almış.');

  const okul = sahipsiz ? dup : { id: uid('s'), mebId: mebId || '', name: ad, city: il, district: ilce, type: tur,
    status: 'approved', createdAt: now() };
  const yeniKod = await depo.kullanicilar.yeniKisiKodu();
  let tuketildi;
  try {
    /* Kod harcanır, okul ve müdür rol satırı yazılır: hepsi birlikte. Kod bu
       arada başka yerde kullanıldıysa hiçbir şey yazılmaz. */
    tuketildi = await islem(async () => {
      if (!await depo.kullanicilar.eslesmeKoduTuket(ana.id, s.kod, yeniKod)) return false;
      if (!sahipsiz) await depo.okullar.ekle(Object.assign({ kisaAd }, okul));
      else {
        await depo.okullar.kisaAdYaz(okul.id, kisaAd);
        await depo.okullar.durumYaz(okul.id, 'approved');
      }
      await depo.kullanicilar.ekle({
        id: uid('u'), anaHesapId: ana.id, email: '', pass: 'kullanilmaz', fullName: ana.fullName, phone: ana.phone || '',
        username: await depo.kullanicilar.okuldaBosAd(ana.username, okul.id),
        role: 'principal', status: 'approved', schoolId: okul.id, city: il, district: ilce, branch: 'Müdür',
        kvkk: ana.kvkk || null, createdAt: now()
      });
      return true;
    });
  } catch (e) {
    /* Aynı okul ya da adres aynı anda iki kez açılmaya çalışıldı (tekil indeks). */
    if (e && e.code === '23505') return alanHata('okul', 'Bu okul ya da adres az önce kaydedildi. Listeyi yenileyip yeniden dene.');
    throw e;
  }
  if (!tuketildi) return alanHata('mudurKodu', 'Bu kod az önce kullanıldı. Kişiden yeni kodunu iste.', 404);
  await islemYaz(me, 'okul.acildi', ad + ' (' + kisaAd + ') — müdür ' + ana.username, req);
  await bildir(ana.id, ad + ' okulunun müdürü olarak eklendin. Sol üstteki menüden okuluna geçebilirsin.');
  return ok(res, {
    okul: { id: okul.id, ad, kisaAd },
    mudur: { ad: ana.fullName, kullaniciAdi: ana.username },
    message: ad + ' açıldı. ' + ana.fullName + ' okulun müdürü oldu.'
  });
}

module.exports = { okulAc, kisiBul };
