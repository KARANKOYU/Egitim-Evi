'use strict';
/* Okulun hesapları (/api/school/...): öğrenci, servisçi, öğretmen.

   Öğrenci ve servisçi kendisi kaydolmaz; hesabını okul açar (tek tek ya da
   Excel/ODS/TXT ile, bkz. kisi-aktarim.js). Öğretmen kendi yetişkin hesabını
   açar ve eşleme kodunu okula verir; müdür kodu girince öğretmenin bu okuldaki
   rol satırı açılır (ogretmen-bul, ogretmen-ekle). Okulun açtığı hesapta kural
   müdürün tablosundaki gibidir:
     - ad, soyad ve T.C. kimlik no zorunlu;
     - kullanıcı adı boşsa T.C. no, şifre boşsa T.C. no olur ve kişi ilk
       girişte kendi şifresini belirlemeden devam edemez;
     - kullanıcı adı ve T.C. no okul içinde benzersizdir (başka okulda aynısı
       olabilir), e-posta her yerde tektir;
     - öğrencinin T.C. no'su bütün sistemde tektir: hesap kişiye aittir.
       Başka okulda kayıtlı T.C. yazılırsa doğum tarihi de eşleşince hesap
       bu okula taşınır (nakil.js).
   Okul yönetimi hesabın T.C. numarasını görür (kendisi girdi); öğretmen ve
   öğrenciler görmez.

   Veli bağlama da burada: okul, velinin T.C. no'su ya da kullanıcı adıyla
   öğrenciye veli bağlar (veli kodu yolu ayrıca açık). */

const { hataSay, hataSiniriDoldu, hizSinir, istemciIp } = require('../guvenlik');
const { bad, ok } = require('../http');
const {
  SUBJECTS, adDuzelt, clean, dogumSorunu, kisaAdSorunu, kodSade, kullaniciAdiSorunu, makeCode, metinYap, normEmail,
  gucluSifreli, normKullaniciAdi, normTc, normTelefon, now, sifreSorunu, tarihCoz, tcSorunu, telefonSorunu, uid
} = require('../ortak');
const { hashPw } = require('../sifre');
const { depo, bildir, islem } = require('../veri');
const { ogrenciKapsamindaMi, pub, yetkiVarMi } = require('../yetki');
const { islemYaz } = require('./islem-kaydi');
const nakil = require('./nakil');

const ROL_AD = { student: 'öğrenci', teacher: 'öğretmen', servisci: 'servisçi' };
const YETKI = {
  student: { ac: 'ogrenci.hesap-ac', duzenle: 'ogrenci.duzenle', sifre: 'ogrenci.sifre' },
  teacher: { ac: 'ogretmen.onayla', duzenle: 'ogretmen.duzenle', sifre: 'ogretmen.duzenle', sil: 'ogretmen.cikar' },
  servisci: { ac: 'servis.yonet', duzenle: 'servis.yonet', sifre: 'servis.yonet', sil: 'servis.yonet' }
};
const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function yeniKod() {
  let kod = makeCode();
  while (await depo.kullanicilar.kodVarMi(kod)) kod = makeCode();
  return kod;
}

/* "Ayşe Yılmaz" -> "Ay** Yı****": veli aranırken tam ad verilmez. */
function adMaskele(ad) {
  return String(ad || '').split(/\s+/).filter(Boolean)
    .map(k => k.slice(0, 2) + '*'.repeat(Math.max(1, k.length - 2))).join(' ');
}

/* Ad ve soyad ayrı sütunlardan ya da tek alandan. */
function adSoyad(g) {
  const ad = adDuzelt(clean(g.ad, 60)), soyad = adDuzelt(clean(g.soyad, 40));
  if (ad || soyad) return (ad + ' ' + soyad).trim();
  return adDuzelt(clean(g.fullName, 80));
}

/* Düzenleme penceresine giden görünüm: T.C. no dahil (okul yönetimi). */
function hesapGorunumu(u, sinifAdi) {
  return {
    id: u.id, rol: u.role, fullName: u.fullName, username: u.username, email: u.email || '', tc: u.tc || '',
    dogum: u.dogum || '', telefon: u.phone || '', adres: u.address || '', okulNo: u.okulNo || '',
    classId: u.classId || '', className: sinifAdi || '', brans: u.branch || '', rolId: u.customRoleId || '',
    not: u.note || '', code: u.role === 'student' ? u.code : '', olusturan: u.okulActi ? 'okul' : 'kendisi',
    girisYapti: !!u.sonGiris, sifreDegismeli: !!u.sifreDegismeli,
    /* Kendi yetişkin hesabından eşlenmiş öğretmen: şifresi, e-postası, T.C. no'su
       kendisinde; okul yalnızca branşını ve rolünü düzenler. */
    bagli: !!u.anaHesapId
  };
}

async function okulOgrencisi(me, id) {
  const st = await depo.kullanicilar.bul(clean(id, 60));
  return st && st.role === 'student' && st.schoolId === me.schoolId ? st : null;
}

/* Veli olarak bağlanabilecek hesap: onaylı; okuldan bağımsız veli ya da
   rolsüz (yetişkin) hesap, veya bu okulun kendi hesabıyla açılmış öğretmeni/
   müdürü. Eşlenmiş öğretmen satırı bulunursa bağ yetişkin hesabına kurulur
   (bkz. veliHesabi). */
function veliOlabilir(me, u) {
  if (!u || u.status !== 'approved' || u.anaHesapId) return false;
  if (!u.role || u.role === 'parent') return true;
  return (u.role === 'teacher' || u.role === 'principal') && u.schoolId === me.schoolId;
}

/* Aramada okul rolü satırı çıktıysa (okulun öğretmeni) velilik onun
   yetişkin hesabınındır. */
async function veliHesabi(u) {
  return u && u.anaHesapId ? depo.kullanicilar.bul(u.anaHesapId) : u;
}

module.exports = { uclar, hesapDogrula, hesapNesnesi, adMaskele, ROL_AD, YETKI };
