'use strict';
/* Kayıt, giriş, şifre, profil ve bildirim uçları.
   Herkese açık uçlar (kayıt, giriş, bot sorusu, şifremi unuttum) ve
   giriş yapmış herkesin kullandığı ortak uçlar (me, şifre, profil). */

const crypto = require('crypto');
const {
  basarisizDeneme, botCevapDogru, botSoruUret, denemeSifirla, epostaMaskele, girisKodlari,
  girisKoduDogrula, girisKoduGonder, hizSinir, istemciIp, kayitSayaci, kilitliMi,
  sifirlamaGonder, sifirlamaKayit, sifirlamaTemizle, soruGerekliMi
} = require('../guvenlik');
const { bad, ok, sendJSON } = require('../http');
const { childrenOf } = require('../iliskiler');
const { okulAra, okulArama, okulKimlikBul, okulVeri, sadelestir } = require('../okullar');
const {
  CITIES, SUBJECTS, clean, makeCode, normEmail, normTelefon,
  now, sifreSorunu, telefonSorunu, uid
} = require('../ortak');
const { hashPw, verifyPw } = require('../sifre');
const { db, notify, notifyAdmins, save, schoolById, userById } = require('../veri');
const { pub } = require('../yetki');
const { islemYaz } = require('./islem-kaydi');

/* Aydınlatma metninin sürümü. Metin değişirse burayı da artır:
   kullanıcıların onayı yeniden istenmelidir. */
const KVKK_SURUM = '1.1';

/* ============ kayıt ============ */
async function register(res, body, req) {
  const role = clean(body.role, 20);
  if (['student', 'parent', 'teacher', 'principal'].indexOf(role) < 0) return bad(res, 'Geçersiz hesap türü');

  /* Otomatik kayıt botlarını eleyen doğrulama sorusu. Yanlış cevap soruyu
     tüketmez, kullanıcı aynı soruyla tekrar deneyebilir. */
  if (!botCevapDogru(body.challengeId, body.challengeAnswer)) {
    return bad(res, 'Doğrulama sorusunun cevabı yanlış.');
  }

  const email = normEmail(body.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return bad(res, 'Geçerli bir e-posta adresi gir');
  if (db.users.some(u => u.email === email)) return bad(res, 'Bu e-posta zaten kayıtlı');

  const pw = String(body.password || '');
  const pwSorun = sifreSorunu(pw);
  if (pwSorun) return bad(res, pwSorun);

  const fullName = clean(body.fullName, 80);
  if (fullName.split(/\s+/).filter(Boolean).length < 2) return bad(res, 'Gerçek ad ve soyadını yaz');

  const telSorun = telefonSorunu(body.phone);
  if (telSorun) return bad(res, telSorun);

  /* KVKK md. 10: aydınlatma yükümlülüğü. Onay olmadan hesap açılmaz;
     onayın tarihi ve metnin sürümü ispat için kaydedilir. */
  if (body.kvkkOnay !== true) {
    return bad(res, 'Devam etmek için aydınlatma metnini okuyup onaylaman gerekiyor.');
  }

  const city = clean(body.city, 60);
  if (role !== 'parent' && CITIES.indexOf(city) < 0) return bad(res, 'İl seçmelisin');

  const u = {
    id: uid('u'), email, pass: await hashPw(pw), fullName, role,
    city, district: clean(body.district, 60), address: clean(body.address, 200),
    phone: normTelefon(body.phone),
    status: 'approved', createdAt: now(),
    /* Aydınlatma metni onayı — ispat için tarih ve sürümle birlikte. */
    kvkk: { onay: true, tarih: now(), surum: KVKK_SURUM }
  };

  if (role === 'principal') {
    /* Okul once resmi MEB listesinden secilir. Listede olmayan (yeni acilmis)
       okullar icin elle ad yazma yolu da acik biraktik. */
    const mebId = clean(body.mebSchoolId, 40);
    let schoolName = '';
    let schoolCity = city;
    let schoolDistrict = u.district;
    let schoolType = '';

    if (mebId) {
      const meb = okulKimlikBul(mebId);
      if (!meb) return bad(res, 'Seçtiğin okul listede bulunamadı, tekrar ara');
      schoolName = meb.ad;
      schoolCity = meb.il;
      schoolDistrict = meb.ilce;
      schoolType = meb.tip;
      /* Okulun ili kullanicinin sectigi ille tutarli olsun. */
      u.city = schoolCity;
      if (!u.district) u.district = schoolDistrict;
    } else {
      schoolName = clean(body.schoolName, 140);
      if (!schoolName) return bad(res, 'Listeden okulunu seç ya da adını yaz');
      if (!u.district) return bad(res, 'İlçe gerekli');
    }

    /* Ayni okula ikinci bir mudur kaydolamaz. */
    const dup = db.schools.find(sc => sc.status !== 'rejected' && (
      (mebId && sc.mebId === mebId) ||
      (sc.city === schoolCity &&
       sc.name.toLocaleLowerCase('tr') === schoolName.toLocaleLowerCase('tr'))
    ));
    if (dup) {
      return bad(res, dup.status === 'approved'
        ? 'Bu okulun zaten kayıtlı bir müdürü var'
        : 'Bu okul için bekleyen bir müdür başvurusu zaten var');
    }

    const school = {
      id: uid('s'), mebId: mebId || '', name: schoolName, city: schoolCity,
      district: schoolDistrict, type: schoolType, status: 'pending', createdAt: now()
    };
    db.schools.push(school);
    u.schoolId = school.id;
    u.branch = 'Müdür';
    u.status = 'pending';
    if (req) kayitSayaci(istemciIp(req), true);
    db.users.push(u);
    notifyAdmins('Yeni müdür başvurusu: ' + fullName + ' - ' + schoolName + ' (' + schoolCity + ' / ' + schoolDistrict + ')');
    save();
    return ok(res, { user: pub(u), message: 'Başvurun alındı. Sistem yöneticisi onayladıktan sonra giriş yapabilirsin.' });
  }

  if (role === 'teacher') {
    const school = schoolById(clean(body.schoolId, 60));
    if (!school || school.status !== 'approved') return bad(res, 'Listeden geçerli bir okul seç');
    const branch = clean(body.branch, 60);
    if (SUBJECTS.indexOf(branch) < 0) return bad(res, 'Branşını seç');
    u.schoolId = school.id;
    u.branch = branch;
    u.status = 'pending';
    if (req) kayitSayaci(istemciIp(req), true);
    db.users.push(u);
    const pr = db.users.find(x => x.role === 'principal' && x.schoolId === school.id && x.status === 'approved');
    if (pr) notify(pr.id, 'Yeni öğretmen başvurusu: ' + fullName + ' (' + branch + ')');
    save();
    return ok(res, { user: pub(u), message: 'Başvurun alındı. Okul müdürün onayladıktan sonra giriş yapabilirsin.' });
  }

  if (role === 'student') {
    const school = schoolById(clean(body.schoolId, 60));
    if (!school || school.status !== 'approved') return bad(res, 'Listeden geçerli bir okul seç');

    /* Müdür öğrenci hesaplarını önceden açmış olabilir. Aynı okulda aynı adla
       hesap varsa öğrenciyi uyar: muhtemelen hesabı zaten hazır. Yine de
       devam etmek isterse (adaş olabilir) engellemiyoruz. */
    const benzer = db.users.find(x => x.role === 'student' && x.schoolId === school.id &&
      sadelestir(x.fullName) === sadelestir(fullName));
    if (benzer && !body.yinede) {
      return sendJSON(res, 409, {
        error: 'Bu isimde bir hesap zaten var',
        mevcutHesap: true,
        okulActi: !!benzer.createdBy,
        not: benzer.note || '',
        kullaniciAdi: benzer.email
      });
    }

    u.schoolId = school.id;
    u.grade = clean(body.grade, 20);
    let code = makeCode();
    while (db.users.some(x => x.code === code)) code = makeCode();
    u.code = code;
    if (req) kayitSayaci(istemciIp(req), true);
    db.users.push(u);
    const pr = db.users.find(x => x.role === 'principal' && x.schoolId === school.id && x.status === 'approved');
    if (pr) notify(pr.id, 'Yeni öğrenci kaydı: ' + fullName);
    save();
    return ok(res, { user: pub(u), message: 'Kaydın tamamlandı! Veli kodun: ' + code + ' - bunu velinle paylaş.' });
  }

  /* veli */
  if (req) kayitSayaci(istemciIp(req), true);
  db.users.push(u);
  save();
  return ok(res, { user: pub(u), message: 'Kaydın tamamlandı. Çocuğunun veli kodunu girerek hesabını bağlayabilirsin.' });
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'meta' && method === 'GET') {
    return ok(res, { cities: CITIES, subjects: SUBJECTS });
  }

  /* ---- MEB okul listesi (kayit ekraninda arama icin) ---- */
  if (p === 'okullar' && method === 'GET') {
    if (!okulAra.length) return bad(res, 'Okul listesi yüklenmemiş', 503);

    if (segs[2] === 'iller') {
      /* Her il icin ilce listesi: kayit formunda ilce kutusunu doldurmak icin. */
      const harita = new Map();
      for (const o of okulAra) {
        if (!harita.has(o.il)) harita.set(o.il, new Set());
        harita.get(o.il).add(o.ilce);
      }
      const iller = Array.from(harita.keys()).sort((a, b) => a.localeCompare(b, 'tr'));
      return ok(res, {
        iller: iller.map(il => ({
          ad: il,
          ilceler: Array.from(harita.get(il)).filter(Boolean).sort((a, b) => a.localeCompare(b, 'tr'))
        })),
        tipler: (okulVeri && okulVeri.tipler ? okulVeri.tipler.slice() : []).sort((a, b) => a.localeCompare(b, 'tr')),
        toplam: okulAra.length
      });
    }

    if (segs[2] === 'ara') {
      if (!hizSinir('okulAra:' + istemciIp(req), 120, 60 * 1000)) {
        return bad(res, 'Çok fazla arama isteği. Biraz bekle.', 429);
      }
      const sorgu = clean(q.get('q'), 80);
      const il = clean(q.get('il'), 60);
      const ilce = clean(q.get('ilce'), 60);
      const tip = clean(q.get('tip'), 40);
      /* En az bir daraltma sart: bos sorguyla 53 bin kaydi taramanin anlami yok. */
      if (!sorgu && !il) return ok(res, { toplam: 0, okullar: [], mesaj: 'İl seç ya da okul adı yaz.' });
      return ok(res, okulArama(sorgu, il, ilce, tip, Number(q.get('limit')) || 30));
    }
  }

  if (p === 'schools' && method === 'GET') {
    const term = clean(q.get('q'), 80).toLocaleLowerCase('tr');
    const city = clean(q.get('city'), 60);
    let list = db.schools.filter(s => s.status === 'approved');
    if (city) list = list.filter(s => s.city === city);
    if (term) list = list.filter(s => s.name.toLocaleLowerCase('tr').indexOf(term) >= 0);
    list.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    return ok(res, {
      schools: list.slice(0, 300).map(s => ({ id: s.id, name: s.name, city: s.city, district: s.district }))
    });
  }

  if (p === 'register' && method === 'POST') {
    const kayitIp = istemciIp(req);
    /* Deneme siniri: form hatalarini da sayar ama bol tutulur (sondaj engeli). */
    if (!hizSinir('kayitDeneme:' + kayitIp, 100, 60 * 60 * 1000)) {
      return bad(res, 'Çok fazla kayıt denemesi yapıldı. Bir saat sonra tekrar dene.', 429);
    }
    /* Hesap acma siniri: saatte en fazla 5 gercek hesap. */
    /* Bir okulun tum sinifi ayni WiFi'dan (tek IP) kayit olabilir,
       bu yuzden sinir seri bot kaydini engelleyecek kadar dar, sinifi
       engellemeyecek kadar genis tutuldu. */
    if (kayitSayaci(kayitIp, false) >= 20) {
      return bad(res, 'Bu bağlantıdan bir saat içinde açılabilecek hesap sınırına ulaşıldı.', 429);
    }
    return register(res, body, req);
  }

  /* Kayıt formundaki bot doğrulama sorusu */
  if (p === 'challenge' && method === 'GET') {
    if (!hizSinir('soru:' + istemciIp(req), 60, 10 * 60 * 1000)) {
      return bad(res, 'Çok fazla istek. Biraz bekle.', 429);
    }
    return ok(res, botSoruUret());
  }

  /* Şifremi unuttum — 1. adım: bağlantı iste.
     Cevap her zaman aynı: e-posta kayıtlı mı bilgisini sızdırmıyoruz,
     yoksa bu uç kullanıcı adı doğrulama aracına dönerdi. */
  if (p === 'sifre-unuttum' && method === 'POST') {
    const ip = istemciIp(req);
    if (!hizSinir('sifirlama:' + ip, 5, 15 * 60 * 1000)) {
      return bad(res, 'Çok fazla istek. 15 dakika sonra tekrar dene.', 429);
    }
    if (!botCevapDogru(body.challengeId, body.challengeAnswer)) {
      return bad(res, 'Doğrulama sorusunun cevabı yanlış.');
    }

    const email = normEmail(body.email);
    const ayniCevap = {
      message: 'Bu adres kayıtlıysa şifre sıfırlama bağlantısı gönderildi. ' +
        'Gelen kutunu ve gereksiz posta klasörünü kontrol et.'
    };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return ok(res, ayniCevap);

    /* Aynı adrese arka arkaya posta yağdırılmasın. */
    if (!hizSinir('sifirlamaEposta:' + email, 3, 60 * 60 * 1000)) return ok(res, ayniCevap);

    const u = db.users.find(x => x.email === email);
    if (u && u.status === 'approved') {
      try { await sifirlamaGonder(u); }
      catch (e) { console.error('Sifirlama hatasi:', e.message); }
    }
    return ok(res, ayniCevap);
  }

  /* Şifremi unuttum — 2. adım: yeni şifreyi yaz. */
  if (p === 'sifre-yenile' && method === 'POST') {
    if (!hizSinir('sifreYenile:' + istemciIp(req), 10, 15 * 60 * 1000)) {
      return bad(res, 'Çok fazla deneme. Biraz bekle.', 429);
    }
    sifirlamaTemizle();

    const anahtar = String(body.token || '');
    const kayit = anahtar ? sifirlamaKayit.get(anahtar) : null;
    if (!kayit || Date.now() > kayit.bitis) {
      return bad(res, 'Bağlantı geçersiz ya da süresi dolmuş. Yeniden bağlantı iste.');
    }

    const sorun = sifreSorunu(body.password);
    if (sorun) return bad(res, sorun);

    const u = userById(kayit.userId);
    if (!u) {
      sifirlamaKayit.delete(anahtar);
      return bad(res, 'Hesap bulunamadı.');
    }

    u.pass = await hashPw(String(body.password));

    /* Tek kullanımlık: anahtarı hemen düşür. */
    sifirlamaKayit.delete(anahtar);

    /* Şifre değiştiyse eski oturumlar da kapansın — hesabı ele geçiren biri
       varsa açık oturumuyla devam edememeli. */
    let kapanan = 0;
    for (const tok of Object.keys(db.sessions)) {
      if (db.sessions[tok] && db.sessions[tok].userId === u.id) {
        delete db.sessions[tok];
        kapanan++;
      }
    }
    save();
    console.log('  Sifre sifirlandi: ' + u.email + ' (' + kapanan + ' oturum kapatildi)');
    islemYaz(u, 'sifre.sifirlandi', kapanan + ' oturum kapatildi', req);
    return ok(res, {
      message: 'Şifren güncellendi. Yeni şifrenle giriş yapabilirsin.'
    });
  }

  /* 1. adım: e-posta + şifre doğrulanır, ardından 6 haneli kod gönderilir.
     Oturum anahtarı bu adımda VERİLMEZ. */
  if (p === 'login' && method === 'POST' && !segs[2]) {
    const email = normEmail(body.email);
    /* Kaba kuvvet koruması: aynı IP+e-posta için 5 hatalı denemeden sonra kilit. */
    const kilitAnahtar = 'giris:' + istemciIp(req) + ':' + email;
    const kalanSn = kilitliMi(kilitAnahtar);
    if (kalanSn) {
      return bad(res, 'Çok fazla hatalı deneme. ' + kalanSn + ' saniye sonra tekrar dene.', 429);
    }
    if (!hizSinir('girisIp:' + istemciIp(req), 30, 5 * 60 * 1000)) {
      return bad(res, 'Çok fazla giriş isteği. Biraz bekleyip tekrar dene.', 429);
    }

    /* Doğrulama sorusu yalnızca daha önce hatalı deneme olduysa istenir.
       Böylece normal kullanıcı her girişte soru çözmez ama otomatik şifre
       deneme aracı ikinci denemeden itibaren duvara toslar. */
    const soruLazim = soruGerekliMi(kilitAnahtar);
    if (soruLazim && !botCevapDogru(body.challengeId, body.challengeAnswer)) {
      return sendJSON(res, 400, {
        error: 'Doğrulama sorusunun cevabı yanlış.',
        soruGerekli: true
      });
    }

    const u = db.users.find(x => x.email === email);
    const sifreDogru = u ? await verifyPw(String(body.password || ''), u.pass) : false;
    if (!u || !sifreDogru) {
      basarisizDeneme(kilitAnahtar, 15 * 60 * 1000);
      return sendJSON(res, 401, {
        error: 'E-posta veya şifre hatalı',
        soruGerekli: true
      });
    }
    denemeSifirla(kilitAnahtar);
    if (u.status === 'rejected') return bad(res, 'Başvurun reddedilmiş. Yöneticiyle iletişime geç.', 403);

    const gonderim = await girisKoduGonder(u);
    return ok(res, {
      twoFactor: true,
      challengeId: gonderim.kimlik,
      maskeliEposta: epostaMaskele(u.email),
      yontem: gonderim.yontem,
      mesaj: gonderim.yontem === 'eposta'
        ? 'Giriş kodu ' + epostaMaskele(u.email) + ' adresine gönderildi.'
        : 'E-posta ayarlı olmadığı için kod sunucu penceresine (siyah ekran) yazıldı.'
    });
  }

  /* 2. adım: kod doğrulanır, oturum açılır. */
  if (p === 'login' && segs[2] === 'dogrula' && method === 'POST') {
    const kilitAnahtar = 'kod:' + istemciIp(req);
    if (!hizSinir(kilitAnahtar, 25, 5 * 60 * 1000)) {
      return bad(res, 'Çok fazla kod denemesi. Biraz bekleyip tekrar dene.', 429);
    }
    const sonuc = girisKoduDogrula(body.challengeId, body.code);
    if (sonuc.hata) return bad(res, sonuc.hata, 401);

    const u = sonuc.kullanici;
    const token = crypto.randomBytes(24).toString('hex');
    db.sessions[token] = { userId: u.id, createdAt: now() };
    save();
    return ok(res, { token, user: pub(u), children: childrenOf(u) });
  }

  /* Kodu yeniden gönder (art arda istenmesin diye 60 sn bekleme). */
  if (p === 'login' && segs[2] === 'tekrar' && method === 'POST') {
    const kimlik = String(body.challengeId || '');
    const kayit = girisKodlari.get(kimlik);
    if (!kayit) return bad(res, 'Giriş oturumu bulunamadı, baştan giriş yap', 400);
    if (Date.now() - kayit.sonGonderim < 60 * 1000) {
      const kalan = Math.ceil((60 * 1000 - (Date.now() - kayit.sonGonderim)) / 1000);
      return bad(res, kalan + ' saniye sonra yeni kod isteyebilirsin.', 429);
    }
    const u = userById(kayit.userId);
    if (!u) return bad(res, 'Hesap bulunamadı', 400);
    girisKodlari.delete(kimlik);
    const gonderim = await girisKoduGonder(u);
    return ok(res, {
      challengeId: gonderim.kimlik,
      yontem: gonderim.yontem,
      mesaj: gonderim.yontem === 'eposta'
        ? 'Yeni kod ' + epostaMaskele(u.email) + ' adresine gönderildi.'
        : 'Yeni kod sunucu penceresine yazıldı.'
    });
  }

  if (p === 'logout' && method === 'POST') {
    const h = req.headers['authorization'] || '';
    if (h.startsWith('Bearer ')) delete db.sessions[h.slice(7)];
    save();
    return ok(res);
  }

  /* ---- giriş gerektirenler ---- */
  if (p === 'me' && method === 'GET') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    return ok(res, { user: pub(me), children: childrenOf(me) });
  }

  if (p === 'password' && method === 'POST') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    if (!await verifyPw(String(body.old || ''), me.pass)) return bad(res, 'Mevcut şifre yanlış');
    const np = String(body.new || '');
    if (np.length < 8) return bad(res, 'Yeni şifre en az 8 karakter olmalı');
    if (np.length > 200) return bad(res, 'Şifre çok uzun');
    if (!/[0-9]/.test(np) || !/[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(np)) {
      return bad(res, 'Yeni şifre en az bir harf ve bir rakam içermeli');
    }
    me.pass = await hashPw(np);
    save();
    return ok(res);
  }

  if (p === 'profile' && method === 'POST') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    if (body.fullName) {
      const fn = clean(body.fullName, 80);
      if (fn.split(/\s+/).filter(Boolean).length < 2) return bad(res, 'Ad ve soyad gerekli');
      me.fullName = fn;
    }
    if (body.address !== undefined) me.address = clean(body.address, 200);
    if (body.district !== undefined) me.district = clean(body.district, 60);
    if (body.city !== undefined && CITIES.indexOf(body.city) >= 0) me.city = body.city;
    save();
    return ok(res, { user: pub(me) });
  }

  if (p === 'notifications') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    if (method === 'GET') {
      const list = db.notifications.filter(n => n.userId === me.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 100);
      return ok(res, { notifications: list, unread: list.filter(n => !n.read).length });
    }
    if (method === 'POST' && segs[2] === 'read') {
      db.notifications.forEach(n => { if (n.userId === me.id) n.read = true; });
      save();
      return ok(res);
    }
  }

  /* ---- admin ---- */

  return false;
}

module.exports = {
  KVKK_SURUM,
  register,
  uclar
};
