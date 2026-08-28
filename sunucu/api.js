'use strict';
/* /api yönlendiricisi.
   İsteği çözer (kullanıcı, gövde, sorgu), ortak bağlamı kurar ve yolun
   ilk parçasına göre ilgili bölüme (bolumler/) devreder. */

const { currentUser } = require('./guvenlik');
const { bad, readBody, sendJSON } = require('./http');
const site = require('./site');

/* Aydınlatma onayı beklenirken yine de kullanılabilen uçlar. */
const KVKK_SERBEST = ['me', 'kvkk-onay', 'logout', 'meta', 'challenge', 'okullar', 'schools',
  'login', 'register', 'sifre-unuttum', 'sifre-yenile', 'okul-adres', 'okul-foto', 'site', 'eposta-onay', 'yorumlar'];

/* Şifresini okul ya da sistem yöneticisi belirlemiş (T.C. no ya da
   dağıtılan şifre) kişi, kendi şifresini koyana kadar yalnızca bunları
   kullanabilir. */
const SIFRE_SERBEST = KVKK_SERBEST.concat(['password']);

/* Rolü olmayan (henüz veli olmamış, okul başvurusu yapmamış) hesabın
   girebildiği yollar: kendi hesabı, bildirimleri, müdür başvurusu ve veli
   kodu. Geri kalan her yol burada kapanır; bölümlerin rol denetimine
   bırakılmaz. */
const ROLSUZ_SERBEST = KVKK_SERBEST.concat(['profile', 'password', 'notifications',
  'okul-basvurusu', 'parent', 'push', 'kisilikler', 'kisilik', 'hesap', 'yorumlar', 'hatirlaticilar']);

/* Yolun ilk parçası -> bölüm. Bir yol yalnızca bir bölüme gider. */
const BOLUM = {
  'admin': yonetici,
  'aile': aile,
  'anketler': anket,
  'assignments': odev,
  'challenge': kayit,
  'devamsizlik': devamsizlik,
  'egitim-yili': egitim_yili,
  'ek': ekler,
  'eposta-onay': kayit,
  'etut': etut,
  'examgroups': sinav,
  'exams': sinav,
  'hatirlaticilar': hatirlatici,
  'hesap': kisilik,
  'islem-kaydi': islem_kaydi,
  'kisilik': kisilik,
  'kisilikler': kisilik,
  'kulupler': okul_hayati,
  'kvkk-onay': kayit,
  'login': kayit,
  'logout': kayit,
  'me': kayit,
  'mesajlar': mesaj,
  'meta': kayit,
  'myschedule': ilerleyis,
  'odev-dosya': odev_dosya,
  'okul-foto': okul_sayfasi,
  'ozellikler': ozellikler,
  'okul-sayfa': okul_sayfasi,
  'notifications': kayit,
  'okul-adres': kayit,
  'okul-basvurusu': kayit,
  'okullar': kayit,
  'parent': veli,
  'password': kayit,
  'profile': kayit,
  'progress': ilerleyis,
  'push': push,
  'register': kayit,
  'school': okul,
  'schools': kayit,
  'servis': okul_hayati,
  'site': site,
  'sifre-unuttum': kayit,
  'sifre-yenile': kayit,
  'takvim': takvim,
  'teacher': ogretmen,
  'yemek': okul_hayati,
  'yorumlar': yorum,
};

async function handleApi(req, res, segs, method) {
  const me = await currentUser(req);
  /* Açılış sayfasındaki "şu an açık" sayısı için (yalnızca sayı tutulur). */
  if (me) site.goruldu(me.anaHesapId || me.id);
  const q = new URL(req.url, 'http://x').searchParams;
  const p = segs[1] || '';

  /* Dosya yükleme: gövde JSON değil, dosyanın kendisi. JSON okuyucusuna
     (2 MB sınır) girmez, diske akarak yazılır; bütün denetimleri kendisi yapar. */
  if (method === 'POST' && p === 'odev-dosya' && segs[2] === 'yukle') {
    if (me && depo.ozellikler.kapaliMi(me.schoolId, 'odev')) {
      return sendJSON(res, 403, { error: 'Ödevler bu okulda kapalı.', ozellikKapali: 'odev' });
    }
    return odev_dosya.uclar({ req, res, me, body: {}, q, p, segs, method,
      kvkkGuncel: !!me && kayit.kvkkGuncelMi(me), sifreTamam: !!me && !me.sifreDegismeli, need: () => false });
  }

  /* Mesaj ve ödev ekleri de dosyanın kendisi olarak gelir. */
  if (method === 'POST' && p === 'ek' && segs[2] === 'yukle') {
    if (me && q.get('tur') === 'odev' && depo.ozellikler.kapaliMi(me.schoolId, 'odev')) {
      return sendJSON(res, 403, { error: 'Ödevler bu okulda kapalı.', ozellikKapali: 'odev' });
    }
    return ekler.yukle({ req, res, me, q,
      kvkkGuncel: !!me && kayit.kvkkGuncelMi(me), sifreTamam: !!me && !me.sifreDegismeli });
  }

  /* Okul sayfası fotoğrafı da dosyanın kendisi olarak gelir. */
  if (method === 'POST' && p === 'okul-sayfa' && segs[2] === 'foto') {
    return okul_sayfasi.fotoYukle({ req, res, me, q,
      kvkkGuncel: !!me && kayit.kvkkGuncelMi(me), sifreTamam: !!me && !me.sifreDegismeli });
  }

  const body = (method === 'POST') ? await readBody(req) : {};

  /* Eğitim Evi Aile uygulamasının cihaz uçları: oturumla değil, yalnızca bu uçlara
     yarayan cihaz anahtarıyla (X-Aile-Cihaz). Oturum kapılarından geçmez. */
  if (p === 'aile' && segs[2] === 'cihaz' && segs[3]) return aile.cihazUclari({ req, res, body, segs, method });

  /* Giriş ve rol şartı. Bölümler içinde `if (!need(['admin'])) return;` diye kullanılır. */
  const need = roles => {
    if (!me) { bad(res, 'Giriş yapmalısın', 401); return false; }
    if (me.status !== 'approved') { bad(res, 'Hesabın henüz onaylanmadı', 403); return false; }
    if (roles && roles.indexOf(me.role) < 0) { bad(res, 'Bu işlem için yetkin yok', 403); return false; }
    return true;
  };

  /* Onayı güncel olmayan kullanıcı yalnızca onay verebilir ya da çıkabilir.
     Herkese açık uçlar (giriş, kayıt, okul arama) ve /me serbest kalır. */
  if (me && !kayit.kvkkGuncelMi(me) && KVKK_SERBEST.indexOf(p) < 0) {
    return sendJSON(res, 403, {
      error: 'Aydınlatma metni güncellendi. Devam etmek için okuyup onaylaman gerekiyor.',
      kvkkGerek: true
    });
  }

  if (me && me.sifreDegismeli && SIFRE_SERBEST.indexOf(p) < 0) {
    return sendJSON(res, 403, {
      error: 'Sana verilen şifreyle girdin. Devam etmeden önce kendi şifreni belirle.',
      sifreDegismeli: true
    });
  }

  if (me && !me.role && ROLSUZ_SERBEST.indexOf(p) < 0) {
    return sendJSON(res, 403, {
      error: 'Hesabın henüz bir okula bağlı değil. Okul yönetimi seni ekleyince bu bölüm açılır.',
      rolsuz: true
    });
  }

  /* Müdürün okulda kapattığı bölüm (ödev, sınav, devamsızlık...): hiçbir
     rolden istek o bölüme girmez. */
  if (me && await ozellikler.kapaliysaReddet(res, me, p, q, body)) return;

  /* Geçmiş eğitim yılına bakan okul personeli o yılın kayıtlarını
     değiştiremez: arşiv salt okunur (yeni kayıt da eski yıla damgalanıp
     aktif yılda kaybolurdu). */
  if (me && method === 'POST' && (me.role === 'teacher' || me.role === 'principal') &&
      arsivYazmasiMi(p, segs, body) && await egitim_yili.arsivdeMi(me)) {
    return sendJSON(res, 409, { arsiv: true, error: 'Geçmiş bir eğitim yılına bakıyorsun; kayıtlar salt okunur. ' +
      'Değişiklik için üstteki yıl seçiciden aktif yıla dön.' });
  }

  const bolum = BOLUM[p];
  if (bolum) {
    await bolum.uclar({ req, res, me, body, q, p, segs, method, need });
    if (res.writableEnded || res.headersSent) return;
  }
  return bad(res, 'Böyle bir adres yok', 404);
}

module.exports = {
  handleApi
};
