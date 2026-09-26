'use strict';
/* Kullanıcılar, veli-çocuk bağları ve mesaj engelleri.

   Dönen kullanıcı nesnesine okul adı (_okulAdi), özel rolü (_rol) ve
   öğretmense okulunun hazır Öğretmen rolünün yetkileri (_ogretmenYetkileri)
   iliştirilir; böylece pub() ve yetki kontrolleri ayrıca sorgu atmaz. */

const { sorgu, tek, calistir, islem, tr } = require('../baglanti');
const { kisiKoduUret } = require('../../ortak');
const e = require('../esleme');
const yaz = require('../yazici');
const roller = require('./roller');

const SEC = 'SELECT k.*, o.ad AS okul_adi, o.kisa_ad AS okul_kisa_ad, o.durum AS okul_durum ' +
  'FROM kullanicilar k LEFT JOIN okullar o ON o.id = k.okul_id';
const AD_SIRASI = () => ' ORDER BY k.ad_soyad' + tr();

async function zenginlestir(satirlar) {
  const liste = satirlar.map(e.kullanici);
  const rolIdler = [...new Set(liste.map(u => u.customRoleId).filter(Boolean))];
  if (rolIdler.length) {
    const harita = await roller.haritasi(rolIdler);
    for (const u of liste) if (u.customRoleId) u._rol = harita.get(u.customRoleId) || null;
  }
  const ogretmenOkullari = [...new Set(liste.filter(u => u.role === 'teacher' && u.schoolId).map(u => u.schoolId))];
  if (ogretmenOkullari.length) {
    const harita = await roller.ogretmenYetkileri(ogretmenOkullari);
    for (const u of liste) if (u.role === 'teacher' && harita.has(u.schoolId)) u._ogretmenYetkileri = harita.get(u.schoolId);
  }
  return liste;
}

async function coklu(kosul, parametreler, sira) {
  return zenginlestir(await sorgu(SEC + ' WHERE ' + kosul + (sira || AD_SIRASI()), parametreler));
}

async function bir(kosul, parametreler) {
  const liste = await zenginlestir(await sorgu(SEC + ' WHERE ' + kosul + ' LIMIT 1', parametreler));
  return liste[0] || null;
}

/* ---------------- ad alanları ----------------
   Okul hesapları (müdür, öğretmen, öğrenci, servisçi) okula aittir: kullanıcı
   adı ve T.C. no okul içinde benzersizdir. Veli, yönetici ve rolsüz hesaplar
   okuldan bağımsızdır, kendi aralarında benzersizdir (009 şema dosyası). */
const OKUL_HESABI = "k.rol IN ('principal', 'teacher', 'student', 'servisci')";
const GENEL_HESAP = "(k.rol IS NULL OR k.rol IN ('admin', 'parent'))";
/* Okul rolü satırları (yetişkin hesabına bağlı öğretmen/müdür) girişte aranmaz:
   giriş yetişkin hesabıyla yapılır, rol sonra seçilir (012 şema dosyası). */
const GIRIS = ' AND k.ana_hesap_id IS NULL';

/* ---------------- tek kullanıcı ---------------- */
const bul = id => id ? bir('k.id = $1', [id]) : Promise.resolve(null);
const epostayla = eposta => eposta ? bir('k.eposta = $1', [eposta]) : Promise.resolve(null);
/* okulId verilirse o okulun hesabı, verilmezse okuldan bağımsız hesap. */
const kullaniciAdiyla = (ad, okulId) => !ad ? Promise.resolve(null)
  : okulId ? bir(OKUL_HESABI + ' AND k.okul_id = $2 AND k.kullanici_adi = $1', [ad, okulId])
    : bir(GENEL_HESAP + ' AND k.kullanici_adi = $1', [ad]);
const tcIle = (tc, okulId) => !tc ? Promise.resolve(null)
  : okulId ? bir(OKUL_HESABI + ' AND k.okul_id = $2 AND k.tc_kimlik = $1', [tc, okulId])
    : bir(GENEL_HESAP + ' AND k.tc_kimlik = $1', [tc]);

/* Bu T.C. no'lu öğrenci (hangi okulda olursa olsun): öğrenci hesabı kişiye
   ait, T.C. bütün sistemde tek öğrencide (021). */
const ogrenciTcIle = tc => !tc ? Promise.resolve(null)
  : bir("k.rol = 'student' AND k.tc_kimlik = $1", [tc]);

/* Girişte yazılan kimlik: @ varsa e-posta (her yerde tek). Yoksa kullanıcı adı:
   okul adresinden girilmişse önce o okulun hesabı (bulunamazsa 11 haneli
   T.C. no ile de denenir), sonra okuldan bağımsız hesap (veli). Okul
   seçilmeden yazılan ad yalnızca tek bir okulda varsa kabul edilir; birden
   çok okulda varsa { belirsiz: true } döner, kişiden okulunu seçmesi istenir. */
async function girisKimligiyle(kimlik, okulId) {
  kimlik = String(kimlik || '');
  if (!kimlik) return { u: null };
  if (kimlik.indexOf('@') >= 0) return { u: await bir('k.eposta = $1' + GIRIS, [kimlik]) };
  const genel = await bir(GENEL_HESAP + GIRIS + ' AND k.kullanici_adi = $1', [kimlik]);
  if (okulId) {
    let u = await bir(OKUL_HESABI + GIRIS + ' AND k.okul_id = $2 AND k.kullanici_adi = $1', [kimlik, okulId]);
    if (!u && /^[1-9][0-9]{10}$/.test(kimlik)) {
      u = await bir(OKUL_HESABI + GIRIS + ' AND k.okul_id = $2 AND k.tc_kimlik = $1', [kimlik, okulId]);
    }
    /* Okulda aynı adla bir öğrenci varken yetişkin hesabıyla girilirse şifre
       ikisinde de denenir (yedek). */
    return u ? { u, yedek: genel } : { u: genel };
  }
  const okuldakiler = await coklu(OKUL_HESABI + GIRIS + ' AND k.kullanici_adi = $1', [kimlik], ' LIMIT 2');
  /* Okul seçilmeden: önce yetişkin hesabı; şifre tutmazsa ad tek bir okulda
     varsa o okulun hesabı denenir (yedek). */
  if (genel) return { u: genel, yedek: okuldakiler.length === 1 ? okuldakiler[0] : null };
  if (okuldakiler.length > 1) return { u: null, belirsiz: true };
  return { u: okuldakiler[0] || null };
}

/* ---------------- yetişkin hesabı ve okul rolleri ---------------- */

/* Kendisi kaydolmuş yetişkin hesabı mı (portallar, kişi kodu ve "+ Ekle" bunlarda var)?
   Okulun açtığı hesaplar (öğrenci, servisçi), okul rolü satırları ve sistem
   yöneticisi değildir. */
const yetiskinMi = u => !!u && !u.anaHesapId && (!u.role || u.role === 'parent');

/* Yetişkin hesabının okul rolleri (öğretmen/müdür satırları), okul adıyla. */
const rolleri = anaId => coklu('k.ana_hesap_id = $1', [anaId], ' ORDER BY k.olusturma');

/* Yetişkinin kişi kodu (sütun eslesme_kodu). Kod kişiye aittir: okul süzülmez. */
const eslesmeKoduyla = kod => !kod ? Promise.resolve(null)
  : bir("k.eslesme_kodu = $1 AND k.ana_hesap_id IS NULL AND (k.rol IS NULL OR k.rol = 'parent')", [kod]);
/* Bu kişi kodu kimde (rolüne bakılmaz; yönetici "kendine/yöneticiye olmaz" diyebilsin). */
const eslesmeKoduSahibi = kod => !kod ? Promise.resolve(null) : bir('k.eslesme_kodu = $1', [kod]);
const eslesmeKoduYaz = (id, kod) => calistir('UPDATE kullanicilar SET eslesme_kodu = $2 WHERE id = $1', [id, kod]);
/* Tek kullanımlık kodu harcar: kod hâlâ eskisiyse yenisini yazar. Aynı anda iki
   okul aynı kodu kullanmaya kalkarsa yalnızca biri geçer (öteki 0 satır görür). */
const eslesmeKoduTuket = async (id, eski, yeni) =>
  (await calistir('UPDATE kullanicilar SET eslesme_kodu = $3 WHERE id = $1 AND eslesme_kodu = $2', [id, eski, yeni])) === 1;

/* Ad, soyad ve telefon değişince okul rolü satırları da güncellenir
   (okuldaki listelerde yetişkinin güncel adı görünsün). */
const rolSatirlariniGuncelle = (anaId, ad, telefon) => calistir(
  'UPDATE kullanicilar SET ad_soyad = $2, telefon = $3 WHERE ana_hesap_id = $1', [anaId, ad, telefon]);

/* Aydınlatma metni onayı rol satırlarına da yazılır. */
const rolSatirlarinaKvkk = (anaId, kvkk) => calistir(
  'UPDATE kullanicilar SET kvkk_onay = true, kvkk_tarih = $2, kvkk_surum = $3 WHERE ana_hesap_id = $1',
  [anaId, kvkk.tarih, kvkk.surum]);

/* Okul rolünü bırakma / kaldırma: yalnızca bu yetişkinin bu satırı. */
const rolSatiriniSil = (id, anaId) => calistir('DELETE FROM kullanicilar WHERE id = $1 AND ana_hesap_id = $2', [id, anaId]);
/* kod: kisiKoduSade'den geçmiş hâli (boşluksuz; büyük/küçük harf duyarlı). */
const kodlaOgrenci = kod => bir("k.rol = 'student' AND k.veli_kodu = $1", [kod]);
const okulunMuduru = okulId =>
  bir("k.rol = 'principal' AND k.okul_id = $1 AND k.durum = 'approved'", [okulId]);

/* Okulun müdürü var mı? Müdürü kaldırılmış (sahipsiz) okula yönetici yeni
   müdür atayabilsin diye bakılır. */
const okulunMuduruVarMi = async okulId =>
  !!(await tek("SELECT 1 FROM kullanicilar WHERE rol = 'principal' AND okul_id = $1", [okulId]));

/* Okulda müdür dışında kimse var mı (öğretmen, öğrenci, servisçi)? */
const okuldaKimseVarMi = async okulId =>
  !!(await tek("SELECT 1 FROM kullanicilar WHERE okul_id = $1 AND rol <> 'principal' LIMIT 1", [okulId]));

async function epostaVarMi(eposta, haricId) {
  if (!eposta) return false;
  return !!(await tek('SELECT 1 FROM kullanicilar WHERE eposta = $1 AND id <> $2', [eposta, haricId || '']));
}

/* Kullanıcı adı alınmış mı? okulId verilirse o okulun ad alanında, verilmezse
   okuldan bağımsız hesaplarda bakılır. */
async function kullaniciAdiVarMi(ad, haricId, okulId) {
  if (okulId) {
    return !!(await tek('SELECT 1 FROM kullanicilar k WHERE ' + OKUL_HESABI +
      ' AND k.okul_id = $3 AND k.kullanici_adi = $1 AND k.id <> $2', [ad, haricId || '', okulId]));
  }
  return !!(await tek('SELECT 1 FROM kullanicilar k WHERE ' + GENEL_HESAP +
    ' AND k.kullanici_adi = $1 AND k.id <> $2', [ad, haricId || '']));
}

/* Ad herhangi bir hesapta (okul ya da okuldan bağımsız) kullanılıyor mu?
   Kaydolan (okuldan bağımsız) hesap, bir okuldaki adı alamaz: ana sayfadan
   girişte kimin kastedildiği karışmasın. */
async function kullaniciAdiHerhangiYerde(ad) {
  return !!(await tek('SELECT 1 FROM kullanicilar WHERE kullanici_adi = $1 LIMIT 1', [ad]));
}

async function okulNoVarMi(okulId, no, haricId) {
  if (!no) return false;
  return !!(await tek("SELECT 1 FROM kullanicilar WHERE okul_id = $1 AND rol = 'student' AND okul_no = $2 AND id <> $3",
    [okulId, no, haricId || '']));
}

/* Hesabı sil (okulun açtığı öğretmen / servisçi). Bağlı kayıtlar şema
   kurallarıyla ya silinir ya da sahipsiz kalır (ders, ödev: SET NULL). */
const hesabiSil = (id, okulId) => calistir(
  "DELETE FROM kullanicilar WHERE id = $1 AND okul_id = $2 AND rol IN ('teacher', 'servisci')", [id, okulId]);

/* Kişi kendi şifresini koyunca "şifre değişmeli" işareti kalkar. */
const sifreDegisti = id => calistir('UPDATE kullanicilar SET sifre_degismeli = false WHERE id = $1', [id]);

/* Başarılı girişte son giriş zamanı yazılır (toplu giriş bilgisi dağıtımı
   "hiç girmemiş" öğrencileri buna bakarak seçer). */
const girisYazildi = id => calistir('UPDATE kullanicilar SET son_giris = now() WHERE id = $1', [id]);

/* Toplu şifre yenileme: [{ id, ozet }] tek sorguda yazılır, bu kişilerin
   bütün oturumları kapanır. Yalnızca verilen okulun öğrencilerine yazar.
   Son giriş silinir: yeni şifreyle girene kadar "henüz girmemiş" sayılır
   (kâğıdı kaybolan öğrenciye yeniden dağıtılabilsin). */
async function topluSifreYaz(okulId, liste) {
  if (!liste.length) return 0;
  const idler = liste.map(x => x.id), ozetler = liste.map(x => x.ozet);
  const n = await calistir(
    'UPDATE kullanicilar k SET sifre_ozeti = v.ozet, son_giris = NULL, sifre_degismeli = true ' +
    'FROM unnest($2::text[], $3::text[]) AS v(id, ozet) ' +
    "WHERE k.id = v.id AND k.okul_id = $1 AND k.rol = 'student'", [okulId, idler, ozetler]);
  await calistir('DELETE FROM oturumlar WHERE kullanici_id = ANY($1::text[])', [idler]);
  return n;
}

/* Kullanıcı adı başka birinde mi? Yetişkin hesabı kendi adını ve okul rolü
   satırlarındaki kopyalarını saymaz (hesap bilgisi değiştirirken). */
async function kullaniciAdiBaskasinda(ad, anaId) {
  return !!(await tek('SELECT 1 FROM kullanicilar WHERE kullanici_adi = $1 AND id <> $2 ' +
    'AND (ana_hesap_id IS NULL OR ana_hesap_id <> $2) LIMIT 1', [ad, anaId]));
}

/* Okulun ad alanında boş bir kullanıcı adı: önce yetişkinin kendi adı, alınmışsa
   ad2, ad3 ... (öğretmen rolü satırı açılırken). */
async function okuldaBosAd(ad, okulId) {
  if (!await kullaniciAdiVarMi(ad, '', okulId)) return ad;
  const kok = ad.slice(0, 27);
  for (let n = 2; ; n++) if (!await kullaniciAdiVarMi(kok + n, '', okulId)) return kok + n;
}

/* Rolsüz kişi veli kodu girince veli olur (yalnızca hâlâ rolsüzse). */
async function rolsuzuVeliYap(id) {
  return calistir("UPDATE kullanicilar SET rol = 'parent' WHERE id = $1 AND rol IS NULL", [id]);
}

/* T.C. no kullanılıyor mu? Ad alanı kuralı kullanıcı adındaki gibi. */
async function tcVarMi(tc, haricId, okulId) {
  if (!tc) return false;
  if (okulId) {
    return !!(await tek('SELECT 1 FROM kullanicilar k WHERE ' + OKUL_HESABI +
      ' AND k.okul_id = $3 AND k.tc_kimlik = $1 AND k.id <> $2', [tc, haricId || '', okulId]));
  }
  return !!(await tek('SELECT 1 FROM kullanicilar k WHERE ' + GENEL_HESAP +
    ' AND k.tc_kimlik = $1 AND k.id <> $2', [tc, haricId || '']));
}

/* Kullanıcı adı önerisi: "Deniz Yıldırım" -> deniz.yildirim, alınmışsa
   deniz.yildirim2, 3 ... okulId verilirse o okulun ad alanında. */
async function bosKullaniciAdi(kok, okulId) {
  let temiz = String(kok || '').toLocaleLowerCase('tr')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ö/g, 'o').replace(/ç/g, 'c').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '.').replace(/[^a-z0-9._]/g, '').replace(/^[^a-z]+/, '');
  if (temiz.length < 3) temiz = 'ogrenci' + temiz;
  temiz = temiz.slice(0, 24);
  let aday = temiz;
  for (let n = 2; await kullaniciAdiVarMi(aday, '', okulId); n++) aday = temiz + n;
  return aday;
}

/* Kişi kodu (öğrencinin veli kodu ya da yetişkinin kişi kodu) kullanılıyor mu?
   İki sütun aynı biçimde üretilir; biri ötekiyle karışmasın diye ikisine de bakılır. */
async function kodVarMi(kod) {
  return !!(await tek('SELECT 1 FROM kullanicilar WHERE veli_kodu = $1 OR eslesme_kodu = $1', [kod]));
}

/* Kimsede olmayan yeni bir kişi kodu. */
async function yeniKisiKodu() {
  let kod = kisiKoduUret();
  while (await kodVarMi(kod)) kod = kisiKoduUret();
  return kod;
}

/* Açılışta bir kez: kodu boş olan her öğrenciye veli kodu, her yetişkin hesabına
   (okul rolü satırı değil; rolsüz ya da veli) kişi kodu yazılır. Toplu yazılır;
   bu arada biri aynı kodu almışsa (tekil indeks) yeniden üretilip denenir.
   Servisçi, sistem yöneticisi ve okul rolü satırlarında kod yoktur. */
async function eksikKodlariDoldur() {
  for (let deneme = 0; deneme < 5; deneme++) {
    const ogrenciler = (await sorgu("SELECT id FROM kullanicilar WHERE rol = 'student' AND veli_kodu = ''")).map(r => r.id);
    const yetiskinler = (await sorgu("SELECT id FROM kullanicilar WHERE ana_hesap_id IS NULL AND (rol IS NULL OR rol = 'parent') " +
      "AND eslesme_kodu = ''")).map(r => r.id);
    if (!ogrenciler.length && !yetiskinler.length) return 0;
    const kullanilan = new Set((await sorgu("SELECT veli_kodu AS k FROM kullanicilar WHERE veli_kodu <> '' " +
      "UNION ALL SELECT eslesme_kodu FROM kullanicilar WHERE eslesme_kodu <> ''")).map(r => r.k));
    const uret = () => { let k = kisiKoduUret(); while (kullanilan.has(k)) k = kisiKoduUret(); kullanilan.add(k); return k; };
    const oKod = ogrenciler.map(uret), yKod = yetiskinler.map(uret);
    try {
      await islem(async () => {
        if (ogrenciler.length) {
          await calistir('UPDATE kullanicilar k SET veli_kodu = v.kod FROM unnest($1::text[], $2::text[]) AS v(id, kod) ' +
            "WHERE k.id = v.id AND k.veli_kodu = ''", [ogrenciler, oKod]);
        }
        if (yetiskinler.length) {
          await calistir('UPDATE kullanicilar k SET eslesme_kodu = v.kod FROM unnest($1::text[], $2::text[]) AS v(id, kod) ' +
            "WHERE k.id = v.id AND k.eslesme_kodu = ''", [yetiskinler, yKod]);
        }
      });
      return ogrenciler.length + yetiskinler.length;
    } catch (hata) {
      if (!hata || hata.code !== '23505') throw hata;   // tekillik çakışması: yeniden üret
    }
  }
  throw new Error('Kişi kodları doldurulamadı (tekillik çakışması sürüyor).');
}

/* ---------------- listeler ---------------- */

/* Okulun kullanıcıları. secim: { rol, roller, durum, sinifsiz } */
async function okulun(okulId, secim) {
  secim = secim || {};
  const kosul = ['k.okul_id = $1'];
  const p = [okulId];
  if (secim.rol) { p.push(secim.rol); kosul.push('k.rol = $' + p.length); }
  if (secim.roller) { p.push(secim.roller); kosul.push('k.rol = ANY($' + p.length + '::text[])'); }
  if (secim.durum) { p.push(secim.durum); kosul.push('k.durum = $' + p.length); }
  if (secim.sinifsiz) kosul.push('k.sinif_id IS NULL');
  return coklu(kosul.join(' AND '), p);
}

const sinifOgrencileri = sinifId =>
  coklu("k.rol = 'student' AND k.sinif_id = $1", [sinifId]);

/* Bir öğretmenin öğrencileri: ders verdiği sınıflardaki bütün öğrenciler.
   Öğretmen-öğrenci ilişkisi YALNIZCA derslerden türer. Aynı okul şartı ayrıca
   aranır: okuldan ayrılmış birinin derste kalmış eski bağı başka okuldan
   o öğrencilere kapı açmasın. */
const ogretmeninOgrencileri = ogretmenId =>
  coklu("k.rol = 'student' AND k.sinif_id IN (SELECT sinif_id FROM dersler WHERE ogretmen_id = $1) " +
    'AND k.okul_id = (SELECT okul_id FROM kullanicilar WHERE id = $1)', [ogretmenId]);

/* Bir öğrencinin öğretmenleri: sınıfındaki derslere atanmış, aynı okuldaki onaylı öğretmenler. */
const ogrencininOgretmenleri = ogrenciId =>
  coklu("k.durum = 'approved' AND k.id IN (" +
    'SELECT d.ogretmen_id FROM dersler d JOIN kullanicilar s ON s.sinif_id = d.sinif_id ' +
    'WHERE s.id = $1 AND d.ogretmen_id IS NOT NULL) ' +
    'AND k.okul_id = (SELECT okul_id FROM kullanicilar WHERE id = $1)', [ogrenciId]);

const adminler = () => coklu("k.rol = 'admin'", []);

/* Yönetici paneli: bütün müdürler ve okullarındaki öğretmen/öğrenci sayısı. */
async function mudurlerSayimli() {
  return sorgu(
    'SELECT k.id, k.ad_soyad, k.kullanici_adi, coalesce(k.eposta, a.eposta) AS eposta, k.durum, k.il, k.ilce, k.olusturma, ' +
    '       o.ad AS okul_adi, o.durum AS okul_durum, ' +
    "       (SELECT count(*) FROM kullanicilar t WHERE t.okul_id = k.okul_id AND t.rol = 'teacher') AS ogretmen, " +
    "       (SELECT count(*) FROM kullanicilar s WHERE s.okul_id = k.okul_id AND s.rol = 'student') AS ogrenci " +
    'FROM kullanicilar k LEFT JOIN okullar o ON o.id = k.okul_id LEFT JOIN kullanicilar a ON a.id = k.ana_hesap_id ' +
    "WHERE k.rol = 'principal' ORDER BY k.ad_soyad" + tr());
}

/* Müdürün ana sayfası: okulun sayıları tek sorguda. */
async function okulSayimlari(okulId) {
  return tek(
    "SELECT count(*) FILTER (WHERE rol = 'student') AS ogrenci, " +
    "count(*) FILTER (WHERE rol = 'student' AND sinif_id IS NULL) AS sinifsiz, " +
    "count(*) FILTER (WHERE rol = 'teacher' AND durum = 'approved') AS ogretmen, " +
    "count(*) FILTER (WHERE rol = 'teacher' AND durum = 'pending') AS bekleyen, " +
    '(SELECT count(*) FROM siniflar WHERE okul_id = $1) AS sinif ' +
    'FROM kullanicilar WHERE okul_id = $1', [okulId]);
}

/* Yönetici paneli sayaçları: tek sorguda. */
async function sayimlar() {
  return tek(
    "SELECT (SELECT count(*) FROM okullar WHERE durum = 'approved') AS okul, " +
    "count(*) FILTER (WHERE rol = 'principal' AND durum = 'approved') AS mudur, " +
    "count(*) FILTER (WHERE rol = 'teacher' AND durum = 'approved') AS ogretmen, " +
    "count(*) FILTER (WHERE rol = 'student') AS ogrenci, " +
    "count(*) FILTER (WHERE rol = 'parent') AS veli " +
    'FROM kullanicilar');
}

/* ---------------- yazma ---------------- */
async function ekle(u) {
  const s = e.kullaniciSutunlari(u);
  s.id = u.id;
  await yaz.ekle('kullanicilar', s);
  return bul(u.id);
}

/* degisiklik: uygulama alan adlarıyla ({ fullName, classId, pass, ... }) */
async function guncelle(id, degisiklik) {
  await yaz.guncelle('kullanicilar', id, e.kullaniciSutunlari(degisiklik));
}

async function sil(id) {
  await yaz.sil('kullanicilar', id);
}

/* ---------------- veli-çocuk bağı ---------------- */
async function cocuklari(veliId) {
  const satirlar = await sorgu(
    'SELECT c.id, c.ad_soyad, c.veli_kodu, c.okul_id, o.ad AS okul_adi FROM veli_baglari b ' +
    'JOIN kullanicilar c ON c.id = b.ogrenci_id LEFT JOIN okullar o ON o.id = c.okul_id ' +
    'WHERE b.veli_id = $1 ORDER BY b.olusturma', [veliId]);
  return satirlar.map(r => ({ id: r.id, fullName: r.ad_soyad, schoolId: e.bos(r.okul_id), schoolName: e.bos(r.okul_adi),
    code: r.veli_kodu }));
}

async function bagliMi(veliId, ogrenciId) {
  return !!(await tek('SELECT 1 FROM veli_baglari WHERE veli_id = $1 AND ogrenci_id = $2', [veliId, ogrenciId]));
}

async function bagla(id, veliId, ogrenciId, zaman) {
  await sorgu('INSERT INTO veli_baglari (id, veli_id, ogrenci_id, olusturma) VALUES ($1, $2, $3, $4) ' +
    'ON CONFLICT (veli_id, ogrenci_id) DO NOTHING', [id, veliId, ogrenciId, zaman]);
}

/* Bağ çözülür. Veli yetişkin hesabıysa okulu kalan çocuklarından yeniden
   hesaplanır (çocuk kalmadıysa boşalır): yoksa eski okulun "Veliler"
   mesajlarını almaya, takvimini görmeye devam ederdi. Okulun öğretmeni ya da
   müdürü olan eski usul hesabın okuluna dokunulmaz. */
async function bagiCoz(veliId, ogrenciId) {
  await islem(async () => {
    await calistir('DELETE FROM veli_baglari WHERE veli_id = $1 AND ogrenci_id = $2', [veliId, ogrenciId]);
    await calistir(
      'UPDATE kullanicilar k SET okul_id = (SELECT o.okul_id FROM veli_baglari b JOIN kullanicilar o ON o.id = b.ogrenci_id ' +
      '  WHERE b.veli_id = k.id ORDER BY b.olusturma LIMIT 1) ' +
      "WHERE k.id = $1 AND k.ana_hesap_id IS NULL AND (k.rol IS NULL OR k.rol = 'parent')", [veliId]);
    /* Son çocuğu da kaldırılan veli rolsüz yetişkin hesabına döner
       (başlangıç ekranı açılır; boş veli menüsü hata vermez). */
    await calistir(
      "UPDATE kullanicilar k SET rol = NULL WHERE k.id = $1 AND k.ana_hesap_id IS NULL AND k.rol = 'parent' " +
      'AND NOT EXISTS (SELECT 1 FROM veli_baglari b WHERE b.veli_id = k.id)', [veliId]);
  });
}

/* Öğrencinin onaylı velileri */
const velileri = ogrenciId =>
  coklu("k.durum = 'approved' AND k.id IN (SELECT veli_id FROM veli_baglari WHERE ogrenci_id = $1)", [ogrenciId]);

/* Birden çok öğrencinin onaylı velileri tek sorguda: Map(ogrenciId -> [veliId]) */
async function veliHaritasi(ogrenciIdler) {
  const harita = new Map();
  if (!ogrenciIdler.length) return harita;
  const satirlar = await sorgu(
    'SELECT b.ogrenci_id, b.veli_id FROM veli_baglari b JOIN kullanicilar v ON v.id = b.veli_id ' +
    "WHERE v.durum = 'approved' AND b.ogrenci_id = ANY($1::text[])", [ogrenciIdler]);
  for (const r of satirlar) {
    if (!harita.has(r.ogrenci_id)) harita.set(r.ogrenci_id, []);
    harita.get(r.ogrenci_id).push(r.veli_id);
  }
  return harita;
}

/* Velinin ilk bağlandığı çocuğun okulu (okulu boş veliler için) */
async function ilkCocugununOkulu(veliId) {
  const r = await tek(
    'SELECT c.okul_id FROM veli_baglari b JOIN kullanicilar c ON c.id = b.ogrenci_id ' +
    'WHERE b.veli_id = $1 AND c.okul_id IS NOT NULL ORDER BY b.olusturma LIMIT 1', [veliId]);
  return r ? r.okul_id : '';
}

/* Velinin çocuklarının kimlikleri */
async function cocukIdleri(veliId) {
  return (await sorgu('SELECT ogrenci_id FROM veli_baglari WHERE veli_id = $1', [veliId])).map(r => r.ogrenci_id);
}

/* ---------------- mesaj engelleri ---------------- */
async function engelliler(id) {
  return (await sorgu('SELECT engellenen_id FROM mesaj_engelleri WHERE kullanici_id = $1', [id]))
    .map(r => r.engellenen_id);
}

async function engelleriYaz(id, liste) {
  await islem(async () => {
    await calistir('DELETE FROM mesaj_engelleri WHERE kullanici_id = $1', [id]);
    for (const eid of liste) {
      await sorgu('INSERT INTO mesaj_engelleri (kullanici_id, engellenen_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [id, eid]);
    }
  });
}

/* Birden çok kullanıcının engel listeleri: Map(id -> [engellenen]) */
async function engelHaritasi(idler) {
  const harita = new Map();
  if (!idler.length) return harita;
  const satirlar = await sorgu(
    'SELECT kullanici_id, engellenen_id FROM mesaj_engelleri WHERE kullanici_id = ANY($1::text[])', [idler]);
  for (const r of satirlar) {
    if (!harita.has(r.kullanici_id)) harita.set(r.kullanici_id, []);
    harita.get(r.kullanici_id).push(r.engellenen_id);
  }
  return harita;
}

module.exports = {
  zenginlestir, bul, epostayla, kullaniciAdiyla, tcIle, ogrenciTcIle, girisKimligiyle, girisYazildi, topluSifreYaz, kodlaOgrenci, okulunMuduru,
  yetiskinMi, rolleri, eslesmeKoduyla, eslesmeKoduSahibi, eslesmeKoduYaz, eslesmeKoduTuket,
  rolSatirlariniGuncelle, rolSatirlarinaKvkk, rolSatiriniSil,
  okulunMuduruVarMi, okuldaKimseVarMi,
  epostaVarMi, kullaniciAdiVarMi, kullaniciAdiHerhangiYerde, kullaniciAdiBaskasinda, okuldaBosAd, tcVarMi, okulNoVarMi,
  bosKullaniciAdi, rolsuzuVeliYap,
  hesabiSil, sifreDegisti, kodVarMi, yeniKisiKodu, eksikKodlariDoldur,
  okulun, sinifOgrencileri, ogretmeninOgrencileri, ogrencininOgretmenleri,
  adminler, mudurlerSayimli, sayimlar, okulSayimlari,
  ekle, guncelle, sil,
  cocuklari, bagliMi, bagla, bagiCoz, velileri, veliHaritasi, ilkCocugununOkulu, cocukIdleri,
  engelliler, engelleriYaz, engelHaritasi
};
