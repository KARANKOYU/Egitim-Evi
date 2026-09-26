'use strict';
/* Sistem yöneticisinin okul açması (/api/admin/okul-ac).

   Yönetici başvuru beklemeden okulu kendisi açabilir: okulu MEB listesinden
   seçer (ya da adını yazar), okulun adresini (egitimevi.org/<uzantı>) ve
   müdürün bilgilerini girer. Okul ve müdür onaylı olarak açılır.

   Müdür:
     - e-postası sistemde kayıtlı bir yetişkin hesabıysa o hesaba müdür rolü
       eklenir (şifre sorulmaz, kişi "Hesap değiştir"den okula geçer);
     - değilse yeni yetişkin hesabı açılır. Yöneticinin verdiği şifre güçlü
       kurala uyar (büyük/küçük harf, rakam, özel karakter, en az 8) ve kişi
       ilk girişte kendi şifresini belirler. E-posta adresinin sahibi olduğunu
       her girişte o adrese giden kodla kanıtlar. */

const { bad, ok, sendJSON } = require('../http');
const {
  CITIES, adDuzelt, clean, kisaAdSorunu, kullaniciAdiSorunu, normEmail, normKullaniciAdi, normTelefon, now,
  sifreSorunu, telefonSorunu, uid
} = require('../ortak');
const { okulKimlikBul } = require('../okullar');
const { hashPw } = require('../sifre');
const { epostaAlaniVarMi } = require('../guvenlik');
const { depo, bildir, islem } = require('../veri');
const { islemYaz } = require('./islem-kaydi');

const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function okulAc(req, res, me, body) {
  const alanHata = (alan, mesaj) => sendJSON(res, 400, { error: mesaj, alan });

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
  /* Önce okul zaten kayıtlı mı: müdürü kaldırılmış okul yeniden açılırken
     kendi eski adresini koruyabilmeli. */
  const dup = await depo.okullar.cakisan(mebId, il, ad);
  const sahipsiz = dup && dup.status !== 'approved' && !(await depo.kullanicilar.okulunMuduruVarMi(dup.id));
  if (dup && !sahipsiz) {
    return alanHata('okul', dup.status === 'approved' ? 'Bu okul zaten kayıtlı ve müdürü var.'
      : 'Bu okul için bekleyen bir müdür başvurusu var; Onay Bekleyenler\'den karara bağla.');
  }
  if (await depo.okullar.kisaAdVarMi(kisaAd, sahipsiz ? dup.id : '')) return alanHata('kisaAd', 'Bu adres başka bir okulda. Başka bir ad dene.');

  /* ---- müdür ---- */
  const m = body.mudur && typeof body.mudur === 'object' ? body.mudur : {};
  const eposta = normEmail(m.eposta);
  if (!EPOSTA.test(eposta)) return alanHata('eposta', 'Müdürün e-posta adresini yaz.');
  const var_ = await depo.kullanicilar.epostayla(eposta);
  let ana = null, yeniHesap = null;
  if (var_) {
    if (var_.role === 'admin') return alanHata('eposta', 'Sistem yöneticisi hesabı müdür yapılamaz.');
    if (!depo.kullanicilar.yetiskinMi(var_)) {
      return alanHata('eposta', 'Bu e-posta bir okul hesabında (öğrenci/servisçi) kayıtlı; müdür yapılamaz.');
    }
    /* Kişinin bu okulda zaten bir rolü (ör. öğretmenlik) varsa ikinci rol açılmaz. */
    if (sahipsiz && (await depo.kullanicilar.rolleri(var_.id)).some(r => r.schoolId === dup.id)) {
      return alanHata('eposta', 'Bu kişinin bu okulda zaten bir rolü var (ör. öğretmen). Önce o rolü okuldan çıkar.');
    }
    ana = var_;
  } else {
    const fullName = adDuzelt(clean(m.ad, 60)) + ' ' + adDuzelt(clean(m.soyad, 40));
    if (!clean(m.ad, 60)) return alanHata('ad', 'Müdürün adını yaz.');
    if (!clean(m.soyad, 40)) return alanHata('soyad', 'Müdürün soyadını yaz.');
    const kadi = normKullaniciAdi(m.kullaniciAdi);
    const kaSorun = kullaniciAdiSorunu(kadi);
    if (kaSorun) return alanHata('kullaniciAdi', kaSorun);
    if (await depo.kullanicilar.kullaniciAdiHerhangiYerde(kadi)) return alanHata('kullaniciAdi', 'Bu kullanıcı adı alınmış.');
    if (!await epostaAlaniVarMi(eposta)) return alanHata('eposta', '"' + eposta.split('@')[1] + '" alan adı e-posta almıyor.');
    const telSorun = telefonSorunu(m.telefon);
    if (telSorun) return alanHata('telefon', telSorun);
    const sifreSorun = sifreSorunu(m.sifre, true);
    if (sifreSorun) return alanHata('sifre', sifreSorun);
    yeniHesap = {
      id: uid('u'), username: kadi, email: eposta, pass: await hashPw(String(m.sifre)), fullName,
      role: '', status: 'approved', phone: normTelefon(m.telefon), sifreDegismeli: true, createdAt: now()
    };
  }

  const okul = sahipsiz ? dup : { id: uid('s'), mebId: mebId || '', name: ad, city: il, district: ilce, type: tur,
    status: 'approved', createdAt: now() };
  await islem(async () => {
    if (yeniHesap) { await depo.kullanicilar.ekle(yeniHesap); ana = yeniHesap; }
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
  });
  await islemYaz(me, 'okul.acildi', ad + ' (' + kisaAd + ') — müdür ' + ana.username, req);
  if (!yeniHesap) {
    await bildir(ana.id, ad + ' okulunun müdürü olarak eklendin. "Hesap değiştir"den okuluna geçebilirsin.');
  }
  return ok(res, {
    okul: { id: okul.id, ad, kisaAd },
    mudur: { kullaniciAdi: ana.username, eposta: ana.email, yeni: !!yeniHesap },
    message: ad + ' açıldı. ' + (yeniHesap
      ? 'Müdür "' + ana.username + '" kullanıcı adı ve verdiğin şifreyle girer; ilk girişte kendi şifresini belirler.'
      : 'Müdür rolü ' + ana.username + ' hesabına eklendi.')
  });
}

module.exports = { okulAc };
