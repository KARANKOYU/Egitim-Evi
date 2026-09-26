'use strict';
/* Okulun hesapları (/api/school/...): öğrenci, servisçi, öğretmen.

   Öğrenci ve servisçi kendisi kaydolmaz; hesabını okul açar (tek tek ya da
   Excel/ODS/TXT ile, bkz. kisi-aktarim.js). Öğretmen kendi yetişkin hesabını
   açar ve kişi kodunu okula verir; müdür kodu girince öğretmenin bu okuldaki
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
  SUBJECTS, adDuzelt, clean, dogumSorunu, kisaAdSorunu, kisiKoduSade, kullaniciAdiSorunu, metinYap, normEmail,
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

/* Yeni hesap nesnesi (doğrulanmış alanlardan). */
async function hesapNesnesi(me, rol, s, ozet) {
  const u = Object.assign({
    id: uid('u'), role: rol, status: 'approved', schoolId: me.schoolId,
    city: me.city || '', district: me.district || '', address: '', email: '',
    createdBy: me.id, okulActi: true, createdAt: now(), sifreDegismeli: s.varsayilanSifre
  }, s.d, { pass: ozet });
  /* Öğrencinin veli kodu (kişi kodu) hesapla birlikte üretilir; servisçide kod yok. */
  if (rol === 'student') u.code = await depo.kullanicilar.yeniKisiKodu();
  if (rol === 'teacher' && !u.branch) u.branch = '';
  return u;
}

/* Hesabı düzenleyecek kişinin yetkisi var mı; hesap bu okulun mu?
   Hiçbir rol için yetkisi olmayan kişi hesabı aramadan 403 alır (var olup
   olmadığını da öğrenmesin). rol verilirse yalnızca o roldeki hesap. */
async function yonetilenHesap(me, id, islemAdi, rol) {
  const roller = rol ? [rol] : Object.keys(YETKI);
  if (!roller.some(r => YETKI[r][islemAdi] && yetkiVarMi(me, YETKI[r][islemAdi]))) return { hata: 'Bu işlem için yetkin yok', kod: 403 };
  const u = await depo.kullanicilar.bul(clean(id, 60));
  if (u && rol && u.role !== rol) return { hata: 'Hesap bulunamadı', kod: 404 };
  if (!u || u.schoolId !== me.schoolId || !YETKI[u.role]) return { hata: 'Hesap bulunamadı', kod: 404 };
  const izin = YETKI[u.role][islemAdi];
  if (!izin || !yetkiVarMi(me, izin)) return { hata: 'Bu işlem için yetkin yok', kod: 403 };
  if (u.role === 'student' && !ogrenciKapsamindaMi(me, izin, u.classId)) return { hata: 'Bu sınıfın öğrencisi için yetkin yok', kod: 403 };
  return { u };
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

/* Gelen gövdeden hesap alanları (tek tek açma ve düzenleme). Yalnızca
   gövdede olan alanlar alınır: düzenlemede dokunulmayan alan değişmez. */
function govdedenAlanlar(body) {
  const g = {};
  const esle = { ad: 'ad', soyad: 'soyad', fullName: 'fullName', tc: 'tc', username: 'kullaniciAdi',
    kullaniciAdi: 'kullaniciAdi', password: 'sifre', sifre: 'sifre', email: 'eposta', eposta: 'eposta',
    dogum: 'dogum', telefon: 'telefon', phone: 'telefon', adres: 'adres', address: 'adres', okulNo: 'okulNo',
    classId: 'sinifId', note: 'not', not: 'not', brans: 'brans', branch: 'brans', rolId: 'rolId' };
  for (const k of Object.keys(esle)) if (body[k] !== undefined && g[esle[k]] === undefined) g[esle[k]] = body[k];
  return g;
}

/* ---- uçlar ---- (okul.js'ten, yetkiGerek ve me hazır olarak çağrılır) */
async function uclar(k, sub) {
  const { req, res, me, body, q, method } = k;

  /* ---------- hesap açma ---------- */
  if ((sub === 'hesap-ac' || sub === 'student-create') && method === 'POST') {
    const rol = sub === 'student-create' ? 'student' : clean(body.rol, 20);
    if (rol === 'teacher') {
      return bad(res, 'Öğretmen hesabını öğretmen kendisi açar ve sana kişi kodunu verir. ' +
        'Öğretmenler sayfasında "Kodla ekle" ile kodu gir.');
    }
    if (!YETKI[rol]) return bad(res, 'Öğrenci ya da servisçi seç');
    if (!yetkiVarMi(me, YETKI[rol].ac)) return bad(res, 'Bu işlem için yetkin yok', 403);
    if (!hizSinir('hesapAc:' + me.id, 120, 60 * 60 * 1000)) return bad(res, 'Bu saat içinde çok fazla hesap açtın. Excel ile toplu açabilirsin.', 429);
    const g = govdedenAlanlar(body);
    /* Öğrenci başka okulda kayıtlıysa yeni hesap açılmaz, var olanı taşınır. */
    if (rol === 'student' && !tcSorunu(normTc(g.tc))) {
      const baska = await nakil.baskaOkulOgrencisi(normTc(g.tc), me.schoolId, '');
      if (baska) return nakil.nakilEt(k, baska, g);
    }
    const s = await hesapDogrula(me, rol, g, null, null);
    if (s.sorunlar.length) return bad(res, s.sorunlar.join('; '));
    const u = await hesapNesnesi(me, rol, s, await hashPw(s.sifre));
    await depo.kullanicilar.ekle(u);
    await islemYaz(me, 'hesap.acildi', u.fullName + ' (' + ROL_AD[rol] + ')', req);
    const sonuc = {
      hesap: { id: u.id, fullName: u.fullName, username: u.username, email: u.email, code: u.code || '',
        classId: u.classId || '', varsayilanSifre: s.varsayilanSifre },
      message: u.fullName + ' hesabı açıldı.' + (s.varsayilanSifre
        ? ' Kullanıcı adı ve şifre T.C. kimlik no; ilk girişte kendi şifresini belirleyecek.' : '')
    };
    if (rol === 'student') sonuc.student = sonuc.hesap;   // eski istemciler için
    return ok(res, sonuc);
  }

  /* ---------- düzenleme penceresi ---------- */
  if (sub === 'hesap' && method === 'GET') {
    const r = await yonetilenHesap(me, q.get('id'), 'duzenle');
    if (r.hata) return bad(res, r.hata, r.kod);
    const c = r.u.classId ? await depo.siniflar.bul(r.u.classId) : null;
    return ok(res, { hesap: hesapGorunumu(r.u, c ? c.name : '') });
  }

  if ((sub === 'hesap-guncelle' || sub === 'student-update') && method === 'POST') {
    const id = sub === 'student-update' ? body.studentId : body.id;
    const r = await yonetilenHesap(me, id, 'duzenle', sub === 'student-update' ? 'student' : '');
    if (r.hata) return bad(res, sub === 'student-update' && r.kod === 404 ? 'Öğrenci bulunamadı' : r.hata, r.kod);
    if (sub === 'student-update' && r.u.role !== 'student') return bad(res, 'Öğrenci bulunamadı', 404);
    const alanlar = govdedenAlanlar(body);
    /* Eşlenmiş öğretmende okul yalnızca branşı ve rolü düzenler; kişisel
       bilgiler öğretmenin kendi hesabındadır. */
    if (r.u.anaHesapId) {
      for (const a of Object.keys(alanlar)) {
        if (a !== 'brans' && a !== 'rolId') {
          return bad(res, 'Öğretmenin adını, kullanıcı adını ve iletişim bilgilerini kendisi kendi hesabından değiştirir.');
        }
      }
    }
    const s = await hesapDogrula(me, r.u.role, alanlar, r.u, null);
    if (s.sorunlar.length) return bad(res, s.sorunlar.join('; '));
    if (Object.keys(s.d).length) await depo.kullanicilar.guncelle(r.u.id, s.d);
    Object.assign(r.u, s.d);
    const c = r.u.classId ? await depo.siniflar.bul(r.u.classId) : null;
    const gorunum = hesapGorunumu(r.u, c ? c.name : '');
    return ok(res, { hesap: gorunum, student: gorunum, message: 'Kaydedildi.' });
  }

  /* ---------- şifre ----------
     Şifreler geri döndürülemez biçimde saklanır; yönetim yalnızca yenisini
     belirler. "degistirsin" işaretliyse kişi ilk girişte kendi şifresini koyar. */
  if ((sub === 'hesap-sifre' || sub === 'student-password') && method === 'POST') {
    const id = sub === 'student-password' ? body.studentId : body.id;
    const r = await yonetilenHesap(me, id, 'sifre', sub === 'student-password' ? 'student' : '');
    if (r.hata) return bad(res, sub === 'student-password' && r.kod === 404 ? 'Öğrenci bulunamadı' : r.hata, r.kod);
    if (sub === 'student-password' && r.u.role !== 'student') return bad(res, 'Öğrenci bulunamadı', 404);
    if (r.u.anaHesapId) return bad(res, 'Öğretmen şifresini kendi hesabından değiştirir; unuttuysa "Şifremi unuttum" ile yeniler.');
    const sifre = metinYap(body.password !== undefined ? body.password : body.sifre);
    const tcIle = !sifre && !!r.u.tc;
    if (!tcIle) {
      const sorun = sifreSorunu(sifre, gucluSifreli(r.u));
      if (sorun) return bad(res, sorun);
    }
    const ozet = await hashPw(tcIle ? r.u.tc : sifre);
    const degistirsin = !!(tcIle || body.degistirsin === true || (r.u.tc && sifre === r.u.tc));
    await islem(async () => {
      await depo.kullanicilar.guncelle(r.u.id, { pass: ozet, sifreDegismeli: degistirsin });
      await depo.oturumlar.hepsiniKapat(r.u.id);
    });
    await bildir(r.u.id, 'Şifren okul yönetimi tarafından değiştirildi.');
    await islemYaz(me, 'sifre.mudur-degistirdi', r.u.fullName, req);
    return ok(res, { message: r.u.fullName + ' için yeni şifre kaydedildi.' +
      (tcIle ? ' Şifre T.C. kimlik no oldu; ilk girişte kendisi değiştirecek.' : '') });
  }

  /* ---------- hesap silme (öğretmen, servisçi) ---------- */
  if (sub === 'hesap-sil' && method === 'POST') {
    const r = await yonetilenHesap(me, body.id, 'sil');
    if (r.hata) return bad(res, r.hata, r.kod);
    if (r.u.id === me.id) return bad(res, 'Kendi hesabını silemezsin.');
    if (body.onay !== true) return bad(res, 'Silmeyi onaylaman gerekiyor.');
    const n = await depo.kullanicilar.hesabiSil(r.u.id, me.schoolId);
    if (!n) return bad(res, 'Hesap silinemedi', 404);
    await islemYaz(me, r.u.role === 'teacher' ? 'ogretmen.cikarildi' : 'hesap.silindi', r.u.fullName, req);
    /* Eşlenmiş öğretmenin kendi hesabı durur; yalnızca bu okuldaki rolü kalkar. */
    if (r.u.anaHesapId) {
      await bildir(r.u.anaHesapId, (me._okulAdi || 'Okul') + ' seni öğretmen listesinden çıkardı.');
      return ok(res, { message: r.u.fullName + ' okulun öğretmen listesinden çıkarıldı.' });
    }
    return ok(res, { message: r.u.fullName + ' hesabı silindi.' });
  }

  /* ---------- öğretmeni kişi koduyla okula ekleme ----------
     Öğretmen kişi kodunu (+ Ekle > Öğretmen) müdüre verir. Kod tek
     kullanımlıktır: eşleşince aynı işlemde yenilenir. Müdür eklemeden önce
     yalnızca adın maskeli hâlini görür (kodla ad öğrenme aracına dönmesin).
     Kod gövdede gelir (POST): adrese ve erişim günlüklerine düşmesin, içindeki
     # + ? bozulmasın. Büyük/küçük harf duyarlı; yalnız boşluklar silinir. */
  if ((sub === 'ogretmen-bul' || sub === 'ogretmen-ekle') && method === 'POST') {
    if (!yetkiVarMi(me, 'ogretmen.onayla')) return bad(res, 'Bu işlem için yetkin yok', 403);
    if (!hizSinir('ogretmenKod:' + me.id, 30, 60 * 1000)) return bad(res, 'Çok fazla deneme. Biraz bekle.', 429);
    const ipAnahtar = 'ogretmenKodHata:' + istemciIp(req);
    if (hataSiniriDoldu(ipAnahtar, 30)) return bad(res, 'Çok fazla yanlış kod denendi. Bir saat sonra tekrar dene.', 429);
    const kod = kisiKoduSade(clean(body.kod, 40));
    const kisi = kod ? await depo.kullanicilar.eslesmeKoduyla(kod) : null;
    if (!kisi) {
      hataSay(ipAnahtar, 30, 60 * 60 * 1000);
      return bad(res, 'Bu kodla bir hesap bulunamadı. Kodu öğretmenden yeniden iste; kod bir kez kullanılınca yenilenir.', 404);
    }
    const roller = await depo.kullanicilar.rolleri(kisi.id);
    const buradaki = roller.find(r => r.schoolId === me.schoolId);
    if (sub === 'ogretmen-bul') {
      return ok(res, { kisi: { ad: adMaskele(kisi.fullName), zatenOkulda: !!buradaki } });
    }
    if (sub === 'ogretmen-ekle') {
      if (buradaki) return bad(res, 'Bu kişi okulunda zaten ' + (buradaki.role === 'principal' ? 'müdür' : 'öğretmen') + '.');
      if (roller.length >= 10) return bad(res, 'Bu kişi en fazla sayıda okulda rol almış.');
      const g = {};
      if (body.brans !== undefined) g.brans = body.brans;
      if (body.rolId !== undefined) g.rolId = body.rolId;
      const s = await hesapDogrula(me, 'teacher', g, { id: '', role: 'teacher', schoolId: me.schoolId }, null);
      if (s.sorunlar.length) return bad(res, s.sorunlar.join('; '));
      const okul = await depo.okullar.bul(me.schoolId);
      const satir = {
        id: uid('u'), anaHesapId: kisi.id, username: await depo.kullanicilar.okuldaBosAd(kisi.username, me.schoolId),
        email: '', pass: 'kullanilmaz', fullName: kisi.fullName, phone: kisi.phone || '', role: 'teacher',
        status: 'approved', schoolId: me.schoolId, city: okul ? okul.city : '', district: okul ? okul.district : '',
        branch: s.d.branch || '', customRoleId: s.d.customRoleId || '', kvkk: kisi.kvkk, createdAt: now()
      };
      /* Kod harcanır ve rol satırı yazılır: ikisi birlikte. Aynı kod bu arada
         başka yerde kullanıldıysa hiçbir şey yazılmaz. */
      const yeniKod = await depo.kullanicilar.yeniKisiKodu();
      const tuketildi = await islem(async () => {
        if (!await depo.kullanicilar.eslesmeKoduTuket(kisi.id, kod, yeniKod)) return false;
        await depo.kullanicilar.ekle(satir);
        return true;
      });
      if (!tuketildi) return bad(res, 'Bu kod az önce kullanıldı. Öğretmenden yeni kodunu iste.', 404);
      await bildir(kisi.id, (me._okulAdi || 'Bir okul') + ' seni öğretmen olarak ekledi. Sol üstteki menüden okuluna geçebilirsin.');
      await islemYaz(me, 'ogretmen.eklendi', kisi.fullName, req);
      return ok(res, { hesap: { id: satir.id, fullName: satir.fullName, username: satir.username },
        message: kisi.fullName + ' okula öğretmen olarak eklendi.' });
    }
  }

  /* ---------- servisçiler (servis sayfası) ---------- */
  if (sub === 'servisciler' && method === 'GET') {
    if (!yetkiVarMi(me, 'servis.yonet')) return bad(res, 'Bu işlem için yetkin yok', 403);
    const liste = await depo.kullanicilar.okulun(me.schoolId, { rol: 'servisci' });
    return ok(res, { servisciler: liste.map(u => ({ id: u.id, fullName: u.fullName, username: u.username,
      telefon: u.phone || '', girisYapti: !!u.sonGiris })) });
  }

  /* ---------- okul veliyi öğrenciye bağlar ----------
     Veli: okuldan bağımsız veli (ya da henüz rolsüz) hesap, ya da bu okulun
     öğretmeni/müdürü (kendi çocuğu için). Arama sonucunda tam ad değil
     baş harfleri gösterilir: T.C. no'dan ad öğrenme aracına dönmesin. */
  if (sub === 'ogrenci-velileri' && method === 'GET') {
    if (!yetkiVarMi(me, 'ogrenci.duzenle')) return bad(res, 'Bu işlem için yetkin yok', 403);
    const st = await okulOgrencisi(me, q.get('studentId'));
    if (!st) return bad(res, 'Öğrenci bulunamadı', 404);
    const veliler = await depo.kullanicilar.velileri(st.id);
    return ok(res, { veliler: veliler.map(v => ({ id: v.id, fullName: v.fullName, username: v.username, role: v.role })) });
  }
  if (sub === 'veli-bul' && method === 'GET') {
    if (!yetkiVarMi(me, 'ogrenci.duzenle')) return bad(res, 'Bu işlem için yetkin yok', 403);
    if (!hizSinir('kisiBul:' + me.id, 60, 60 * 1000)) return bad(res, 'Çok fazla arama yaptın. Bir dakika bekle.', 429);
    const kimlik = clean(q.get('kimlik'), 40).replace(/\s/g, '');
    let adaylar;
    if (/^[0-9]+$/.test(kimlik)) {
      if (tcSorunu(kimlik)) return bad(res, tcSorunu(kimlik));
      adaylar = [await depo.kullanicilar.tcIle(kimlik), await veliHesabi(await depo.kullanicilar.tcIle(kimlik, me.schoolId))];
    } else {
      const ad = normKullaniciAdi(kimlik);
      if (kullaniciAdiSorunu(ad)) return bad(res, 'Velinin T.C. kimlik numarasını ya da kullanıcı adını yaz.');
      adaylar = [await depo.kullanicilar.kullaniciAdiyla(ad), await veliHesabi(await depo.kullanicilar.kullaniciAdiyla(ad, me.schoolId))];
    }
    const u = adaylar.find(x => x && veliOlabilir(me, x));
    if (!u) {
      if (adaylar.some(Boolean)) return ok(res, { kisi: { durum: 'uygun-degil' } });
      return bad(res, 'Bu bilgiyle kayıtlı bir hesap yok. Veli önce Eğitim Evi\'ne kaydolmalı.', 404);
    }
    return ok(res, { kisi: { id: u.id, fullName: adMaskele(u.fullName), username: u.username, durum: 'uygun' } });
  }
  if (sub === 'veli-bagla' && method === 'POST') {
    if (!yetkiVarMi(me, 'ogrenci.duzenle')) return bad(res, 'Bu işlem için yetkin yok', 403);
    const st = await okulOgrencisi(me, body.studentId);
    if (!st) return bad(res, 'Öğrenci bulunamadı', 404);
    const u = await depo.kullanicilar.bul(clean(body.veliId, 60));
    if (!u || !veliOlabilir(me, u)) return bad(res, 'Bu hesap veli olarak bağlanamaz.');
    if (await depo.kullanicilar.bagliMi(u.id, st.id)) return bad(res, 'Bu kişi zaten bu öğrencinin velisi.');
    /* Rolsüz hesap veli olur (yalnızca hâlâ rolsüzse); öğretmen/müdür rolünü korur. */
    const olmadi = await islem(async () => {
      if (!u.role && !await depo.kullanicilar.rolsuzuVeliYap(u.id)) return true;
      await depo.kullanicilar.bagla(uid('pl'), u.id, st.id, now());
      if ((!u.role || u.role === 'parent') && !u.schoolId) await depo.kullanicilar.guncelle(u.id, { schoolId: st.schoolId });
      return false;
    });
    if (olmadi) return bad(res, 'Bu hesap bu arada başka bir role bağlandı. Yeniden dene.');
    await bildir(u.id, (me._okulAdi || 'Okul') + ' seni ' + st.fullName + ' adlı öğrencinin velisi olarak ekledi.',
      '#/cocuklarim');
    await islemYaz(me, 'veli.baglandi', u.fullName + ' → ' + st.fullName, req);
    return ok(res, { message: 'Veli, ' + st.fullName + ' adlı öğrenciye bağlandı.' });
  }
  if (sub === 'veli-coz' && method === 'POST') {
    if (!yetkiVarMi(me, 'ogrenci.duzenle')) return bad(res, 'Bu işlem için yetkin yok', 403);
    const st = await okulOgrencisi(me, body.studentId);
    if (!st) return bad(res, 'Öğrenci bulunamadı', 404);
    const veliId = clean(body.veliId, 60);
    if (!await depo.kullanicilar.bagliMi(veliId, st.id)) return bad(res, 'Bu kişi bu öğrencinin velisi değil.');
    await depo.kullanicilar.bagiCoz(veliId, st.id);
    await islemYaz(me, 'veli.cozuldu', st.fullName, req);
    return ok(res);
  }

  /* ---------- okul adresi (egitimevi.org/school/<kısa ad>) ---------- */
  if (sub === 'adres' && method === 'GET') {
    if (me.role !== 'principal' && !yetkiVarMi(me, 'okul.konum')) return bad(res, 'Okul adresini müdür belirler', 403);
    const o = await depo.okullar.bul(me.schoolId);
    return ok(res, { kisaAd: o ? o.kisaAd : '', ad: o ? o.name : '', enlem: o ? o.enlem : null, boylam: o ? o.boylam : null });
  }
  if (sub === 'adres' && method === 'POST') {
    if (me.role !== 'principal') return bad(res, 'Okul adresini müdür belirler', 403);
    /* Günde 10 değişiklik: yalnızca gerçekten değişen adres sayılır;
       reddedilen denemeler ve aynı adresi yeniden kaydetmek sayılmaz. */
    const anahtar = 'okulAdresDegis:' + me.schoolId;
    if (hataSiniriDoldu(anahtar, 10)) return bad(res, 'Adres bugün çok kez değişti. Yarın yeniden dene.', 429);
    const kisa = clean(body.kisaAd, 60).toLowerCase();
    const sorun = kisaAdSorunu(kisa);
    if (sorun) return bad(res, sorun);
    if (await depo.okullar.kisaAdVarMi(kisa, me.schoolId)) return bad(res, 'Bu adres başka bir okulda. Başka bir ad dene.');
    const simdiki = await depo.okullar.bul(me.schoolId);
    if (simdiki && simdiki.kisaAd === kisa) return ok(res, { kisaAd: kisa, message: 'Okulun adresi zaten bu.' });
    hataSay(anahtar, 10, 24 * 60 * 60 * 1000);
    await depo.okullar.kisaAdYaz(me.schoolId, kisa);
    await islemYaz(me, 'okul.adres', kisa, req);
    return ok(res, { kisaAd: kisa, message: 'Okulun adresi kaydedildi.' });
  }

  /* Okulun konumu (servis haritasındaki okul işareti): müdür haritadan seçer. */
  if (sub === 'konum' && method === 'POST') {
    if (!yetkiVarMi(me, 'okul.konum')) return bad(res, 'Okulun konumunu müdür ya da yetki verdiği kişi belirler', 403);
    if (body.sil === true) {
      await depo.okullar.konumYaz(me.schoolId, null, null);
      return ok(res, { message: 'Okulun konumu silindi.' });
    }
    const en = typeof body.enlem === 'number' ? body.enlem : NaN, boy = typeof body.boylam === 'number' ? body.boylam : NaN;
    if (!isFinite(en) || !isFinite(boy) || Math.abs(en) > 90 || Math.abs(boy) > 180 || (en === 0 && boy === 0)) {
      return bad(res, 'Konum anlaşılmadı. Haritada okulun olduğu yere dokun.');
    }
    await depo.okullar.konumYaz(me.schoolId, Math.round(en * 1e6) / 1e6, Math.round(boy * 1e6) / 1e6);
    await islemYaz(me, 'okul.konum', Math.round(en * 1e4) / 1e4 + ', ' + Math.round(boy * 1e4) / 1e4, req);
    return ok(res, { message: 'Okulun konumu kaydedildi.' });
  }

  return false;
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
