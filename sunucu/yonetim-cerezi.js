'use strict';
/* Gizli yönetim paneli (/admin) çerezi.

   Sistem yöneticisi giriş yapınca (iki adımlı giriş tamamlanınca) oturum
   anahtarının yanında bir de /admin çerezi alır. Tarayıcı bu çerezi yalnız
   /admin ve altına gönderir (Path=/admin): /api isteklerine gitmez, API
   yalnız Authorization başlığıyla çalışmaya devam eder (çerezle gelen bir
   istek hiçbir şey yapamaz; CSRF yüzeyi açılmaz).

     - Değer oturum anahtarından bağımsız, rastgele 32 bayttır; veritabanında
       SHA-256 özeti durur (yonetim_cerezleri, 030). Oturuma bağlıdır: çıkışta,
       oturumun süresi dolunca, şifre değişince geçersiz olur.
     - HttpOnly (sayfadaki betik okuyamaz), SameSite=Strict (başka siteden
       gelen gezinmede gönderilmez), site https ise Secure.
     - Çerezi olmayan (ya da geçersiz çerezli) herkes /admin'de bilinmeyen bir
       adresle BAYT BAYT aynı 404 cevabını alır (http.js). Çerez yoksa
       veritabanına hiç gidilmez. Biçimli (uydurma olabilir) çerezle gelen
       istekte bilinmeyen adres de çerezi arar (http.js bulunamadiCerezli);
       /admin de bilinmeyen adres gibi diske bakar: yanıt süresi /admin'i ele vermez.
     - Çerez yalnız yönetici hesabına verilir. Silme başlığı da yalnız
       yöneticinin çıkışında gönderilir: yönetici olmayan hiçbir cevapta
       /admin adresi geçmez. */

const crypto = require('crypto');
const { ayarlar } = require('./ayarlar');
const { depo } = require('./veri');

const CEREZ_ADI = 'ee_yonetim';
const YONETIM_ADRESI = '/admin';
const CEREZ_DESENI = /^[a-f0-9]{64}$/;

/* Çerez verilecek hesap: onaylı yönetici, kendi şifresini koymuş. Şifresini
   başkası vermiş (admins.json'dan açılan) yönetici önce şifresini değiştirir;
   çerezi şifre değiştirme cevabıyla alır. (Açılışta kurulan varsayılan ilk
   yöneticiye şifre değiştirme zorlanmaz; o çerezi girişte alır.) */
function yoneticiMi(u) {
  return !!u && u.role === 'admin' && u.status === 'approved' && !u.sifreDegismeli;
}

/* İstekteki çerez değeri; biçimsizse ''. */
function cerezDegeri(req) {
  const ham = String((req && req.headers && req.headers.cookie) || '');
  if (!ham || ham.indexOf(CEREZ_ADI + '=') < 0) return '';
  for (const parca of ham.split(';')) {
    const esit = parca.indexOf('=');
    if (esit < 0) continue;
    if (parca.slice(0, esit).trim() !== CEREZ_ADI) continue;
    const deger = parca.slice(esit + 1).trim();
    return CEREZ_DESENI.test(deger) ? deger : '';
  }
  return '';
}

/* Site https mi? Ayarlardaki site adresi ya da (güvenilen vekil arkasında)
   vekilin söylediği şema. */
function httpsMi(req) {
  if (/^https:\/\//i.test(String((ayarlar.site && ayarlar.site.adres) || ''))) return true;
  if (req && req.socket && req.socket.encrypted) return true;
  if (ayarlar.vekil && ayarlar.vekil.guven && req && req.headers) {
    const sema = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim().toLowerCase();
    if (sema === 'https') return true;
  }
  return false;
}

function baslik(req, deger, saniye) {
  return CEREZ_ADI + '=' + deger + '; Path=' + YONETIM_ADRESI + '; Max-Age=' + saniye +
    '; HttpOnly; SameSite=Strict' + (httpsMi(req) ? '; Secure' : '');
}

/* Oturuma yeni bir /admin çerezi bağlar ve cevaba Set-Cookie ekler (cevap
   sonra ok()/sendJSON ile yazılır). anahtar: oturum anahtarı. Döner: true/false. */
async function cerezVer(res, anahtar, u) {
  if (!yoneticiMi(u) || !anahtar) return false;
  const deger = crypto.randomBytes(32).toString('hex');
  if (!await depo.oturumlar.yonetimCereziEkle(anahtar, deger)) return false;
  const bilgi = await depo.oturumlar.oturumBilgisi(anahtar);
  const gun = bilgi && bilgi.uygulama ? depo.oturumlar.UYGULAMA_OMRU_GUN : depo.oturumlar.OTURUM_OMRU_GUN;
  res.setHeader('Set-Cookie', baslik(res.req, deger, gun * 24 * 60 * 60));
  return true;
}

/* Tarayıcıdaki çerezi siler (yöneticinin çıkışında). */
function cerezSil(res) {
  res.setHeader('Set-Cookie', baslik(res.req, '', 0));
}

/* İstekteki çerez geçerli bir yönetici oturumuna mı ait? Çerez yoksa ya da
   biçimsizse veritabanına gidilmez. */
async function gecerliMi(req) {
  const deger = cerezDegeri(req);
  if (!deger) return false;
  return !!(await depo.oturumlar.yonetimCereziSahibi(deger));
}

module.exports = { CEREZ_ADI, YONETIM_ADRESI, yoneticiMi, cerezDegeri, httpsMi, cerezVer, cerezSil, gecerliMi };
