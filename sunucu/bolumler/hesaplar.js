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

/* Bir hesabın alanlarını doğrular (açarken ya da düzenlerken).
   g: gelen alanlar (metin). mevcut: düzenlenen hesap (yoksa yeni).
   dosya: aynı dosyadaki öbür satırlarla çakışmayı yakalamak için haritalar.
   Dönen: { sorunlar: [], d: { yazılacak alanlar }, sifre, varsayilanSifre } */
async function hesapDogrula(me, rol, g, mevcut, dosya) {
  const sorunlar = [];
  const d = {};
  const yeni = !mevcut;
  const okulId = me.schoolId;
  const haric = mevcut ? mevcut.id : '';

  if (yeni || g.ad !== undefined || g.soyad !== undefined || g.fullName !== undefined) {
    const ad = adSoyad(g);
    if (ad.split(/\s+/).filter(Boolean).length < 2) sorunlar.push('Ad ve soyad gerekli');
    else d.fullName = ad;
  }

  /* T.C. no: yeni hesapta zorunlu; düzenlemede gelmişse doğrulanır. */
  let tc = mevcut ? (mevcut.tc || '') : '';
  if (yeni || g.tc !== undefined) {
    tc = normTc(g.tc);
    if (!tc) {
      if (yeni) sorunlar.push('T.C. kimlik no gerekli');
    } else if (tcSorunu(tc)) sorunlar.push(tcSorunu(tc));
    else if (await depo.kullanicilar.tcVarMi(tc, haric, okulId)) sorunlar.push('Bu T.C. kimlik no okulda başka bir hesapta kayıtlı');
    else if (rol === 'student' && await nakil.baskaOkulOgrencisi(tc, okulId, haric)) {
      sorunlar.push('Bu T.C. kimlik no başka bir okulda kayıtlı bir öğrencinin. Öğrenciyi okuluna almak için ' +
        '"Öğrenci ekle"den doğum tarihiyle birlikte tek tek ekle');
    }
    else if (dosya && dosya.tc.has(tc)) sorunlar.push('Bu T.C. kimlik no dosyada ' + dosya.tc.get(tc) + '. satırda da var');
    if (tc || !yeni) d.tc = tc;
  }

  /* Kullanıcı adı: boşsa T.C. no. 11 haneli ad yalnızca kişinin kendi T.C. no'su olabilir. */
  if (yeni || g.kullaniciAdi !== undefined) {
    let kadi = normKullaniciAdi(g.kullaniciAdi);
    if (!kadi) kadi = tc;
    if (!kadi) {
      if (!yeni) sorunlar.push('Kullanıcı adı boş olamaz');
    } else if (/^[0-9]+$/.test(kadi)) {
      if (kadi !== tc) sorunlar.push('Rakamlardan oluşan kullanıcı adı yalnızca kişinin T.C. kimlik no\'su olabilir');
    } else if (kullaniciAdiSorunu(kadi)) sorunlar.push(kullaniciAdiSorunu(kadi));
    if (kadi && !sorunlar.length) {
      if (await depo.kullanicilar.kullaniciAdiVarMi(kadi, haric, okulId)) sorunlar.push('Bu kullanıcı adı okulda alınmış');
      else if (dosya && dosya.kadi.has(kadi)) sorunlar.push('Bu kullanıcı adı dosyada ' + dosya.kadi.get(kadi) + '. satırda da var');
      else d.username = kadi;
    }
  } else if (g.tc !== undefined && mevcut && /^[0-9]{11}$/.test(mevcut.username) && mevcut.username !== tc) {
    /* T.C. no değişti, kullanıcı adı eski T.C. no ise o da değişir. */
    if (tc) {
      if (await depo.kullanicilar.kullaniciAdiVarMi(tc, haric, okulId)) sorunlar.push('Bu kullanıcı adı okulda alınmış');
      else d.username = tc;
    } else sorunlar.push('Kullanıcı adı T.C. no; T.C. no silinecekse önce kullanıcı adını değiştir');
  }

  if (yeni || g.eposta !== undefined) {
    const eposta = normEmail(g.eposta);
    if (eposta && !EPOSTA.test(eposta)) sorunlar.push('E-posta geçersiz');
    else if (eposta && await depo.kullanicilar.epostaVarMi(eposta, haric)) sorunlar.push('Bu e-posta başka bir hesapta kayıtlı');
    else if (eposta && dosya && dosya.eposta.has(eposta)) sorunlar.push('Bu e-posta dosyada ' + dosya.eposta.get(eposta) + '. satırda da var');
    else if (mevcut && !mevcut.okulActi && eposta !== (mevcut.email || '')) {
      /* Kendi kaydolduğu hesabın e-postası onun kurtarma yoludur. */
      sorunlar.push('Bu hesabı kişi kendisi açtı; e-postasını yalnızca kendisi değiştirebilir');
    } else d.email = eposta;
  }

  if (g.dogum !== undefined && metinYap(g.dogum).trim()) {
    const dogum = tarihCoz(g.dogum);
    if (!dogum) {
      sorunlar.push(/^\d{1,2}[./-]\d{1,2}[./-]\d{4}$/.test(metinYap(g.dogum).trim())
        ? 'Böyle bir gün yok: doğum tarihini kontrol et' : 'Doğum tarihi anlaşılmadı (gg.aa.yyyy yaz)');
    }
    else if (dogumSorunu(dogum, false)) sorunlar.push(dogumSorunu(dogum, false));
    else d.dogum = dogum;
  } else if (g.dogum !== undefined && !yeni) d.dogum = '';

  if (g.telefon !== undefined) {
    const tel = clean(g.telefon, 30);
    if (tel && telefonSorunu(tel)) sorunlar.push(telefonSorunu(tel));
    else d.phone = tel ? normTelefon(tel) : '';
  }
  if (g.adres !== undefined) d.address = clean(g.adres, 200);

  if (rol === 'student') {
    if (g.okulNo !== undefined) {
      const no = clean(g.okulNo, 20).replace(/\s+/g, '');
      if (no && await depo.kullanicilar.okulNoVarMi(okulId, no, haric)) sorunlar.push('Bu okul numarası başka bir öğrencide');
      else if (no && dosya && dosya.no.has(no)) sorunlar.push('Bu okul numarası dosyada ' + dosya.no.get(no) + '. satırda da var');
      else d.okulNo = no;
    }
    if (g.sinifId !== undefined) {
      const cid = clean(g.sinifId, 60);
      const eski = mevcut ? (mevcut.classId || '') : '';
      /* Sınıf değişikliği yerleştirme yetkisi ister; rolde kapsam varsa eski
         ve yeni sınıfın ikisi de kapsamda olmalı. */
      if (cid !== eski && (!yetkiVarMi(me, 'ogrenci.yerlestir', cid ? { sinif: cid } : null) ||
          (eski && !yetkiVarMi(me, 'ogrenci.yerlestir', { sinif: eski })))) {
        sorunlar.push('Öğrenciyi bu sınıfa yerleştirme yetkin yok');
      } else if (cid) {
        const c = await depo.siniflar.bul(cid);
        if (!c || c.schoolId !== okulId) sorunlar.push('Sınıf bulunamadı');
        else d.classId = c.id;
      } else d.classId = '';
    }
    if (g.not !== undefined) d.note = clean(g.not, 300);
  }

  if (rol === 'teacher') {
    if (g.brans !== undefined) {
      const b = clean(g.brans, 60);
      const esit = SUBJECTS.find(x => x.toLocaleLowerCase('tr') === b.toLocaleLowerCase('tr'));
      if (b && !esit) sorunlar.push('"' + b + '" branş listesinde yok');
      else d.branch = esit || '';
    }
    /* Ek rol vermek yetki dağıtmaktır: "rol yönetir" yetkisi ister (Roller
       sayfasındaki kuralın aynısı). Kişi kendine rol veremez; hazır Öğretmen
       rolü ayrıca verilmez. */
    if (g.rolId !== undefined && clean(g.rolId, 60) !== ((mevcut && mevcut.customRoleId) || '')) {
      const rid = clean(g.rolId, 60);
      if (!yetkiVarMi(me, 'rol.yonet')) sorunlar.push('Rol vermek için "rol yönetir" yetkisi gerekir');
      else if (mevcut && mevcut.id === me.id) sorunlar.push('Kendine rol veremezsin');
      else if (rid) {
        const r = await depo.roller.bul(rid);
        if (!r || r.schoolId !== okulId || r.tur === 'ogretmen') sorunlar.push('Rol bulunamadı');
        else d.customRoleId = r.id;
      } else d.customRoleId = '';
    }
  }

  /* Şifre: yalnızca yeni hesapta (değiştirmek ayrı uçtan). Boşsa T.C. no. */
  let sifre = '', varsayilanSifre = false;
  if (yeni) {
    sifre = metinYap(g.sifre);
    if (!sifre) { sifre = tc; varsayilanSifre = true; }
    else if (sifre === tc) varsayilanSifre = true;
    else if (sifreSorunu(sifre, gucluSifreli({ role: rol }))) sorunlar.push(sifreSorunu(sifre, gucluSifreli({ role: rol })));
  }
  return { sorunlar, d, sifre, varsayilanSifre };
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
