'use strict';
/* Kayıt, giriş, şifre, profil ve bildirim uçları.
   Herkese açık uçlar (kayıt, giriş, bot sorusu, şifremi unuttum) ve
   giriş yapmış herkesin kullandığı ortak uçlar (me, şifre, profil). */

const crypto = require('crypto');
const {
  ONAY_OMRU_MS, basarisizDeneme, botCevapDogru, botSoruTuket, botSoruUret, denemeSifirla, epostaAlaniVarMi, epostaMaskele,
  girisKodlari, kodOzeti, onayBaglantisiGonder,
  girisKoduDogrula, girisKoduGonder, hataSay, hataSiniriDoldu, hizSinir, istekAnahtari, istemciIp, kalanDeneme, kayitSayaci,
  kilitliMi, sifirlamaGonder, sifirlamaKayit, sifirlamaTemizle, soruGerekliMi
} = require('../guvenlik');
const { bad, ok, sendJSON } = require('../http');
const { childrenOf } = require('../iliskiler');
const { okulAra, okulArama, okulVeri } = require('../okullar');
const {
  CITIES, SUBJECTS, adDuzelt, clean, dogumSorunu, kullaniciAdiSorunu, normEmail, normKullaniciAdi,
  gucluSifreli, normTc, normTelefon, now, okulHesabiMi, sifreSorunu, tcSorunu, telefonSorunu, uid
} = require('../ortak');
const { hashPw, verifyPw } = require('../sifre');
const { depo, islem } = require('../veri');
const { pub } = require('../yetki');
const { islemYaz } = require('./islem-kaydi');
const { kullanicininKapalilari } = require('./ozellikler');
const { okulSayfasiGorunumu } = require('./okul-sayfasi');
const { AramaDizini, sade: sadeArama } = require('../yardimci/bulanik-arama');

/* Aydınlatma metninin sürümü. Metin değişirse burayı da artır:
   kullanıcıların onayı yeniden istenmelidir. */
const KVKK_SURUM = '1.10';  // 1.2: doğum tarihi; 1.3: kullanıcı adı ve T.C. kimlik no;
                            // 1.4: ödev dosyaları, anket, servis, kulüp, son giriş;
                            // 1.5: okulun açtığı hesapta T.C., ev ve servis konumu, telefon bildirimi;
                            // 1.6: e-posta onayı, müdür başvurusunda yaş, okul sayfası, ödev yıldızı;
                            // 1.7: mesaj/ödev ekleri (7 gün), açılış yorumları, öğrenci nakli, kişisel hatırlatıcılar
                            // 1.8: kullanım sırasında yaşanan sorunlar (sorumluluk), kullanım koşulları, Sınıflarım
                            // 1.9: Eğitim Evi Aile (çocuğun telefonu: konum ve uygulama süreleri, 7 gün)
                            // 1.10: kişi kodu (15 karakter; öğrencide veli kodu), yöneticinin kodla müdür
                            //       atadığında gördükleri; müdür başvurusu ve yetişkinden doğum tarihi kalktı

/* ============ kayıt ============ */
/* Kendisi kaydolan tek tür hesap yetişkin hesabıdır: veli, öğretmen ve müdür
   aynı hesabı açar. Kayıt olan kişinin rolü yoktur; portalları sonra eklenir
   ("+ Ekle", kisilik.js): çocuğunun veli kodunu giren veli olur, kişi kodunu
   okulunun müdürüne veren öğretmen olarak eklenir, kişi kodunu sistem
   yöneticisine veren okulu açılınca müdür olur (yonetici-okul.js). Öğrenci ve
   servisçi kaydolmaz; hesaplarını okul açar (hesaplar.js). */

/* Kullanıcının onayı yürürlükteki metne mi? Müdürün açtığı hesaplarda hiç
   onay yoktur; metin yenilenince de eski onay geçersizdir. */
function kvkkGuncelMi(u) {
  if (!u) return false;
  /* Sistem yöneticisi kayıt formundan geçmez, sistemi kuran kişidir; onay
     kapısı ona uygulanmaz (ilk açılışta kendini kilitlemesin). */
  if (u.role === 'admin') return true;
  return !!(u.kvkk && u.kvkk.onay && u.kvkk.surum === KVKK_SURUM);
}

/* Kişinin kendisine giden görünüm: pub() + yalnızca ona gösterilen alanlar.
   T.C. kimlik no başka kimseye gitmez (öğretmen listesi, ilerleyiş vb.). */
function benimGorunum(u) {
  const v = pub(u);
  if (v) {
    v.tc = u.tc || '';
    v.sifreDegismeli = !!u.sifreDegismeli;
    v.okulActi = !!u.okulActi;   // okulun açtığı hesapta T.C. no'yu okul yönetir
    /* Yetişkin hesabı ya da ona bağlı okul rolü: menüde "Portallarım" ve
       üstte "+ Ekle" görünür. */
    v.yetiskin = depo.kullanicilar.yetiskinMi(u);
    v.rolSatiri = !!u.anaHesapId;
  }
  return v;
}

/* Yetişkin hesabının seçilebilir rolleri: okul rolleri ve velisi olduğu
   çocuklar. Okulu kapalı olan (müdürü kaldırılmış) rol listede görünür ama girilemez. */
async function kisilikListesi(ana) {
  const [roller, cocuklar] = await Promise.all([depo.kullanicilar.rolleri(ana.id), depo.kullanicilar.cocuklari(ana.id)]);
  return {
    roller: roller.map(r => ({
      id: r.id, rol: r.role, okulAdi: r._okulAdi || '', okulKisaAd: r._okulKisaAd || '', durum: r.status,
      girilebilir: r.status === 'approved' && r._okulDurum === 'approved'
    })),
    cocuklar: cocuklar.map(c => ({ id: c.id, ad: c.fullName, okulAdi: c.schoolName || '' }))
  };
}

/* Menüdeki "Portallarım": her okul rolü ve velisi olunan her çocuk ayrı satır
   ("Öğretmen · Test Ortaokulu", "Veli · Zeynep Şahin"). Yalnız yetişkin hesabında
   ya da ona bağlı rol satırında; öteki hesaplarda (öğrenci, servisçi, yönetici)
   null. Yan etkisizdir: yalnız okur.
     portallar: [{ tur: 'rol'|'veli', id, rol, ad, alt, okulAdi, girilebilir, aktif }]
       rol satırında id rol satırının, veli satırında çocuğun kimliğidir;
       aktif: oturum o portalda mı. Veli portalında sunucu yalnız oturum o
       çocuğa açılırken (cocuk) bilir; sonrasında hangi çocuğun seçili olduğu
       tarayıcıdadır (S.veliCocuk).
     hesapAktif: oturum yetişkin hesabının kendisinde mi (rol satırında değil). */
const PORTAL_AD = { teacher: 'Öğretmen', principal: 'Müdür' };
async function portalBilgisi(u, cocuk) {
  if (!u) return null;
  const ana = u.anaHesapId ? await depo.kullanicilar.bul(u.anaHesapId) : u;
  if (!depo.kullanicilar.yetiskinMi(ana)) return null;
  const k = await kisilikListesi(ana);
  const hesapAktif = !u.anaHesapId;
  const portallar = k.roller.map(r => ({
    tur: 'rol', id: r.id, rol: r.rol, ad: PORTAL_AD[r.rol] || 'Okul', alt: r.okulAdi, okulAdi: r.okulAdi,
    girilebilir: r.girilebilir, aktif: r.id === u.id
  })).concat(k.cocuklar.map(c => ({
    tur: 'veli', id: c.id, rol: 'parent', ad: 'Veli', alt: c.ad, okulAdi: c.okulAdi,
    girilebilir: true, aktif: hesapAktif && !!cocuk && c.id === cocuk
  })));
  return { portallar, hesapAktif };
}

/* Oturum açar ve giriş cevabını yazar (giriş, kod doğrulama, portal değiştirme). */
async function oturumCevabi(res, u, ek) {
  const token = crypto.randomBytes(24).toString('hex');
  await depo.oturumlar.ac(token, u.id);
  await depo.kullanicilar.girisYazildi(u.id);
  const cocuklar = await childrenOf(u);
  const portal = await portalBilgisi(u, ek && ek.cocuk);
  return ok(res, Object.assign({ token, user: benimGorunum(u), children: cocuklar,
    kapaliOzellikler: kullanicininKapalilari(u, cocuklar),
    kvkkGuncel: kvkkGuncelMi(u), kvkkSurum: KVKK_SURUM }, portal || {}, ek || {}));
}

/* Yetişkin hesabıyla giriş: tek portalı olan doğrudan o portala girer (tek
   okul rolü ya da tek çocuk). Birden çok portalı olan yetişkin hesabının ana
   sayfasını görür (kisilikSec: soldaki menüden portal seçer). Öteki hesaplar
   (öğrenci, servisçi, yönetici) kendileridir. */
async function girisOturumu(res, u) {
  if (!depo.kullanicilar.yetiskinMi(u)) return oturumCevabi(res, u);
  const k = await kisilikListesi(u);
  const girilebilir = k.roller.filter(r => r.girilebilir);
  /* Şifresini başkası vermişse (eski düzende yöneticinin açtığı müdür hesabı)
     oturum yetişkin hesabında açılır: kendi şifresini koymadan hiçbir portala
     geçemez. Şifreden sonra yetişkin hesabının ana sayfası açılır. */
  if (u.sifreDegismeli) return oturumCevabi(res, u, { kisilikSec: girilebilir.length + k.cocuklar.length > 0 });
  if (girilebilir.length === 1 && !k.cocuklar.length) {
    const hedef = await depo.kullanicilar.bul(girilebilir[0].id);
    if (hedef) {
      await depo.kullanicilar.girisYazildi(u.id);
      return oturumCevabi(res, hedef);
    }
  }
  if (!girilebilir.length && k.cocuklar.length === 1) return oturumCevabi(res, u, { cocuk: k.cocuklar[0].id });
  return oturumCevabi(res, u, { kisilikSec: girilebilir.length + k.cocuklar.length > 1 });
}

async function register(res, body, req) {
  /* Hata hangi alandaysa "alan" ile söylenir; form o kutuyu kırmızıya
     boyayıp mesajı altına yazar. */
  const alanHata = (alan, mesaj) => sendJSON(res, 400, { error: mesaj, alan });

  /* Otomatik kayıt botlarını eleyen doğrulama sorusu. Soru yalnızca hesap
     açılınca harcanır; başka bir alan hatalıysa aynı soru geçerli kalır. */
  if (!botCevapDogru(body.challengeId, body.challengeAnswer, false)) {
    return alanHata('bot', 'Doğrulama sorusunun cevabı yanlış.');
  }

  const fullName = adDuzelt(clean(body.fullName, 80));
  if (fullName.split(/\s+/).filter(Boolean).length < 2) return alanHata('ad', 'Adını ve soyadını birlikte yaz.');

  const email = normEmail(body.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return alanHata('email', 'Geçerli bir e-posta adresi gir.');
  if (await depo.kullanicilar.epostaVarMi(email)) {
    return alanHata('email', 'Bu e-posta zaten kayıtlı. Giriş yapmayı dene.');
  }
  if (!await epostaAlaniVarMi(email)) {
    return alanHata('email', '"' + email.split('@')[1] + '" alan adı e-posta almıyor. Adresi kontrol et.');
  }

  /* Kayıt formu kullanıcı adını her zaman gönderir. Alan hiç yoksa (eski
     betikler, API istemcileri) e-postanın @ öncesinden boş bir ad türetilir. */
  const username = body.username === undefined
    ? await depo.kullanicilar.bosKullaniciAdi(email.split('@')[0])
    : normKullaniciAdi(body.username);
  const kaSorun = kullaniciAdiSorunu(username);
  if (kaSorun) return alanHata('kullaniciAdi', kaSorun);
  /* Kaydolan hesap okuldan bağımsızdır; adı hiçbir yerde kullanılmamış olmalı. */
  if (await depo.kullanicilar.kullaniciAdiHerhangiYerde(username)) {
    return alanHata('kullaniciAdi', 'Bu kullanıcı adı alınmış. Başka bir ad dene.');
  }

  const pw = String(body.password || '');
  const pwSorun = sifreSorunu(pw, true);   // kaydolan her zaman yetişkin
  if (pwSorun) return alanHata('sifre', pwSorun);

  const telSorun = telefonSorunu(body.phone);
  if (telSorun) return alanHata('telefon', telSorun);

  /* T.C. kimlik no isteğe bağlı; yazıldıysa geçerli ve tek olmalı. "Bu
     numara kayıtlı mı" diye deneme yapılamasın: çakışmada doğrulama sorusu
     harcanır ve aynı bağlantıdan saatte en fazla 10 çakışma kabul edilir. */
  const tc = normTc(body.tc);
  const tcHata = tcSorunu(tc);
  if (tcHata) return alanHata('tc', tcHata);
  if (tc) {
    const tcAnahtar = 'tcCakisma:' + (req ? istemciIp(req) : '');
    if (hataSiniriDoldu(tcAnahtar, 10)) return alanHata('tc', 'T.C. kimlik numarası şu an kaydedilemiyor. Bir saat sonra dene ya da boş bırak.');
    if (await depo.kullanicilar.tcVarMi(tc)) {
      hataSay(tcAnahtar, 10, 60 * 60 * 1000);
      botSoruTuket(body.challengeId);
      return sendJSON(res, 400, { error: 'Bu T.C. kimlik numarası kullanılamıyor. Yanlış yazmadıysan okul yönetimine başvur ya da boş bırak.',
        alan: 'tc', yeniSoru: true });
    }
  }

  /* KVKK md. 10: aydınlatma yükümlülüğü. Onay olmadan hesap açılmaz;
     onayın tarihi ve metnin sürümü ispat için kaydedilir. */
  if (body.kvkkOnay !== true) {
    return alanHata('kvkk', 'Devam etmek için aydınlatma metnini okuyup onaylaman gerekiyor.');
  }

  /* Hesap hemen açılmaz: bilgiler bekler, adrese onay bağlantısı gider.
     Bağlantı tıklanınca (eposta-onay) hesap açılır. Böylece kimse sahibi
     olmadığı bir adresle hesap açamaz. Aynı adrese saatte en fazla 3 posta. */
  if (!hizSinir('kayitOnay:' + email, 3, 60 * 60 * 1000)) {
    return alanHata('email', 'Bu adrese az önce bağlantı gönderdik. Gelen kutunu ve gereksiz klasörünü kontrol et.');
  }
  await depo.onaylar.adresinkileriSil(email, 'kayit');
  const gonderim = await onayBaglantisiGonder(email, fullName, 'kayit');
  await depo.onaylar.ekle({
    ozet: kodOzeti(gonderim.anahtar), tur: 'kayit', eposta: email, kullaniciAdi: username, adSoyad: fullName,
    sifreOzeti: await hashPw(pw), telefon: normTelefon(body.phone), tc: tc || null, adres: clean(body.address, 200),
    kvkkSurum: KVKK_SURUM, bitis: new Date(Date.now() + ONAY_OMRU_MS).toISOString()
  });
  if (req) kayitSayaci(istemciIp(req), true);
  botSoruTuket(body.challengeId);
  return ok(res, {
    onayGerekli: true, eposta: epostaMaskele(email),
    message: epostaMaskele(email) + ' adresine bir bağlantı gönderdik. Hesabını açmak için 24 saat içinde ona tıkla. ' +
      'Posta gelmediyse gereksiz klasörüne bak.'
  });
}

/* Onay bağlantısı tıklandı: kayıtta hesap açılır, e-posta değişikliğinde adres
   değişir. Bu arada adres ya da kullanıcı adı başkası tarafından alındıysa
   söylenir. Anahtar tek kullanımlıktır. */
async function epostaOnayi(res, body, req) {
  /* Anahtar 256 bit rastgele: tahmin edilemez. Yine de yalnızca hatalı
     denemeler sayılır (okul ağında aynı IP'den çok kişi onay verebilir). */
  const hataAnahtari = 'epostaOnayHata:' + (req ? istemciIp(req) : '');
  if (hataSiniriDoldu(hataAnahtari, 30)) return bad(res, 'Çok fazla hatalı deneme. Biraz bekle.', 429);
  const anahtar = String(body.token || '');
  const o = /^[a-f0-9]{64}$/.test(anahtar) ? await depo.onaylar.bul(kodOzeti(anahtar)) : null;
  if (!o) {
    hataSay(hataAnahtari, 30, 15 * 60 * 1000);
    return bad(res, 'Bağlantı geçersiz ya da süresi dolmuş. Yeniden kayıt ol ya da adresi yeniden değiştir.');
  }
  await depo.onaylar.sil(o.anahtar_ozeti);
  if (await depo.kullanicilar.epostaVarMi(o.eposta, o.kullanici_id || '')) {
    return bad(res, 'Bu e-posta bu arada başka bir hesaba kaydedilmiş.');
  }
  if (o.tur === 'eposta') {
    const hesap = await depo.kullanicilar.bul(o.kullanici_id);
    if (!hesap) return bad(res, 'Hesap bulunamadı.');
    await depo.kullanicilar.guncelle(hesap.id, { email: o.eposta });
    await islemYaz(hesap, 'hesap.eposta', o.eposta, req);
    return ok(res, { tur: 'eposta', message: 'E-posta adresin değişti. Bundan sonra giriş kodları bu adrese gelir.' });
  }
  if (await depo.kullanicilar.kullaniciAdiHerhangiYerde(o.kullanici_adi)) {
    return bad(res, '"' + o.kullanici_adi + '" kullanıcı adı bu arada alınmış. Başka bir adla yeniden kayıt ol.');
  }
  /* Kişi kodu hesapla birlikte üretilir (+ Ekle > Öğretmen / Müdür'de görünür). */
  const u = {
    id: uid('u'), username: o.kullanici_adi, email: o.eposta, pass: o.sifre_ozeti, fullName: o.ad_soyad,
    role: '', status: 'approved', tc: o.tc_kimlik || '', address: o.adres || '', phone: o.telefon || '',
    eslesmeKodu: await depo.kullanicilar.yeniKisiKodu(),
    createdAt: now(), kvkk: { onay: true, tarih: o.olusturma, surum: o.kvkk_surum }
  };
  await depo.kullanicilar.ekle(u);
  await depo.onaylar.adresinkileriSil(o.eposta, 'kayit');
  return ok(res, { tur: 'kayit', kullaniciAdi: u.username,
    message: 'Hesabın açıldı. Kullanıcı adın: ' + u.username + '. Şimdi giriş yapabilirsin.' });
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
      /* Yazarken her duraksamada bir arama gider; sınır bol tutuldu. */
      if (!hizSinir('okulAra:' + istemciIp(req), 300, 60 * 1000)) {
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

  /* ---- okul adresi: egitimevi.org/school/<kısa ad> ----
     Adresten okulun adı (giriş ekranında görünsün) ve ana sayfadaki okul
     arama. Yalnızca onaylı, adresi olan okullar; başka bilgi verilmez. */
  if (p === 'okul-adres' && method === 'GET') {
    if (!hizSinir('okulAdres:' + istemciIp(req), 300, 60 * 1000)) return bad(res, 'Çok fazla istek. Biraz bekle.', 429);
    if (segs[2] === 'ara') {
      /* MEB aramasıyla aynı motor: büyük/küçük harf, Türkçe harf ve yazım
         hatası fark etmez. Adres (kısa ad) da aranır. */
      const aranan = clean(q.get('q'), 80);
      if (sadeArama(aranan).replace(/ /g, '').length < 2) return ok(res, { okullar: [] });
      const liste = await depo.okullar.adresliOkullar();
      const dizin = new AramaDizini(liste.map(o => ({ ad: o.ad, yer: o.il + ' ' + o.ilce + ' ' + o.kisa_ad })));
      const r = dizin.ara(aranan, null, 20);
      return ok(res, {
        yakin: r.yakin, duzeltme: r.duzeltme,
        okullar: r.sonuclar.map(s => ({ ad: liste[s.i].ad, il: liste[s.i].il, ilce: liste[s.i].ilce, kisaAd: liste[s.i].kisa_ad, vurgu: s.vurgu }))
      });
    }
    const okul = await depo.okullar.kisaAdla(clean(q.get('kisa'), 40));
    if (!okul) return bad(res, 'Bu adreste bir okul yok.', 404);
    /* Okulun kendi sayfası (kapak, tanıtım, fotoğraflar); düzenlenmemişse null. */
    return ok(res, { okul: { ad: okul.name, il: okul.city, ilce: okul.district, kisaAd: okul.kisaAd },
      sayfa: await okulSayfasiGorunumu(okul.id) });
  }

  if (p === 'schools' && method === 'GET') {
    const term = clean(q.get('q'), 80).toLocaleLowerCase('tr');
    const city = clean(q.get('city'), 60);
    /* Müdürü olmayan okul listede görünmez ki kayıt denemesi boşa gitmesin.
       Depo onaylı ve müdürlü okulları adına göre sıralı döndürür. */
    let list = await depo.okullar.kayitIcin(city);
    if (term) list = list.filter(s => s.name.toLocaleLowerCase('tr').indexOf(term) >= 0);
    return ok(res, {
      schools: list.slice(0, 300).map(s => ({ id: s.id, name: s.name, city: s.city, district: s.district }))
    });
  }

  /* E-postadaki onay bağlantısı: kayıtta hesabı açar, değişiklikte adresi değiştirir. */
  if (p === 'eposta-onay' && method === 'POST') return epostaOnayi(res, body, req);

  if (p === 'register' && method === 'POST') {
    const kayitIp = istemciIp(req);
    /* Deneme siniri: form hatalarini da sayar ama bol tutulur (sondaj engeli). */
    if (!hizSinir('kayitDeneme:' + kayitIp, 100, 60 * 60 * 1000)) {
      return bad(res, 'Çok fazla kayıt denemesi yapıldı. Bir saat sonra tekrar dene.', 429);
    }
    /* Hesap açma sınırı: bir bağlantıdan saatte en fazla 60 hesap. Okulda
       bütün sınıf aynı ağdan (tek IP) kaydolabilir (30-40 kişi); sınır seri
       bot kaydını engelleyecek kadar dar, sınıfı engellemeyecek kadar geniş. */
    if (kayitSayaci(kayitIp, false) >= 60) {
      return bad(res, 'Bu bağlantıdan bir saat içinde açılabilecek hesap sınırına ulaşıldı.', 429);
    }
    return register(res, body, req);
  }

  /* Kayıt formundaki bot doğrulama sorusu */
  if (p === 'challenge' && method === 'GET') {
    /* Okul ağında bütün sınıf tek IP'den kayıt olabilir; sınır bol tutuldu. */
    if (!hizSinir('soru:' + istemciIp(req), 300, 10 * 60 * 1000)) {
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
    if (email && email.indexOf('@') < 0) {
      return sendJSON(res, 400, {
        error: 'Sıfırlama bağlantısı e-postaya gider; hesabının e-posta adresini yaz. ' +
          'E-postası olmayan hesaplarda şifreyi okul yönetimi yeniler.',
        alan: 'email'
      });
    }
    const ayniCevap = {
      message: 'Bu adres kayıtlıysa şifre sıfırlama bağlantısı gönderildi. ' +
        'Gelen kutunu ve gereksiz posta klasörünü kontrol et.'
    };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return ok(res, ayniCevap);

    /* Aynı adrese arka arkaya posta yağdırılmasın. */
    if (!hizSinir('sifirlamaEposta:' + email, 3, 60 * 60 * 1000)) return ok(res, ayniCevap);

    const u = await depo.kullanicilar.epostayla(email);
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

    const u = await depo.kullanicilar.bul(kayit.userId);
    if (!u) {
      sifirlamaKayit.delete(anahtar);
      return bad(res, 'Hesap bulunamadı.');
    }
    const sorun = sifreSorunu(body.password, gucluSifreli(u));
    if (sorun) return bad(res, sorun);

    /* Tek kullanımlık: anahtarı hemen düşür. */
    sifirlamaKayit.delete(anahtar);

    /* Şifre değiştiyse eski oturumlar da kapansın — hesabı ele geçiren biri
       varsa açık oturumuyla devam edememeli. İkisi tek işlemde. */
    const yeniOzet = await hashPw(String(body.password));
    const kapanan = await islem(async () => {
      await depo.kullanicilar.guncelle(u.id, { pass: yeniOzet, sifreDegismeli: false });
      return depo.oturumlar.hesabinOturumlariniKapat(u.id);
    });
    console.log('  Şifre sıfırlandı: ' + u.email + ' (' + kapanan + ' oturum kapatıldı)');
    await islemYaz(u, 'sifre.sifirlandi', kapanan + ' oturum kapatıldı', req);
    return ok(res, {
      message: 'Şifren güncellendi. Yeni şifrenle giriş yapabilirsin.'
    });
  }

  /* 1. adım: e-posta + şifre doğrulanır, ardından 6 haneli kod gönderilir.
     Oturum anahtarı bu adımda VERİLMEZ. */
  if (p === 'login' && method === 'POST' && !segs[2]) {
    /* Girişte e-posta ya da kullanıcı adı yazılır; ikisi de küçük harfle
       saklı olduğu için büyük/küçük harf fark etmez. */
    const kimlik = normEmail(body.kimlik !== undefined ? body.kimlik : body.email);
    /* Boş alan hatalı deneme sayılmaz; yalnızca kutuyu gösterir. */
    if (!kimlik) return sendJSON(res, 400, { error: 'Kullanıcı adını ya da e-posta adresini yaz.', alan: 'kimlik' });
    if (!body.password) return sendJSON(res, 400, { error: 'Şifreni yaz.', alan: 'sifre' });
    /* Okul adresinden (egitimevi.org/school/<kısa ad>) giriliyorsa kullanıcı adı o
       okulun içinde aranır. */
    let okulId = '';
    const kisa = clean(body.okul, 40);
    if (kisa) {
      const okul = await depo.okullar.kisaAdla(kisa);
      if (!okul) return sendJSON(res, 400, { error: 'Bu okul adresi bulunamadı. Ana sayfadan okulunu seç.', alan: 'kimlik' });
      okulId = okul.id;
    }
    /* Bağlantı (IP) başına iki sınır. Okulda bütün sınıf aynı ağdan (tek IP)
       girer; başarılı girişler bol tutulur (5 dakikada 300). Çok hesabı birer
       kez deneyen şifre taramasına karşı asıl sınır HATALI girişlerde:
       15 dakikada 50. Hesap başına kilit (5 hata) ayrıca var. */
    const ipHata = 'girisHataIp:' + istemciIp(req);
    if (hataSiniriDoldu(ipHata, 50) || !hizSinir('girisIp:' + istemciIp(req), 300, 5 * 60 * 1000)) {
      return bad(res, 'Bu bağlantıdan çok fazla giriş denemesi yapıldı. Biraz bekleyip tekrar dene.', 429);
    }

    /* Kaba kuvvet koruması: aynı IP + hesap için 5 hatalı denemeden sonra
       kilit. Anahtar hesabın kendisi: e-posta ile kullanıcı adını sırayla
       deneyerek kilit ikiye katlanmasın. */
    const bulunan = await depo.kullanicilar.girisKimligiyle(kimlik, okulId);
    if (bulunan.belirsiz) {
      return sendJSON(res, 400, {
        error: 'Bu kullanıcı adı birden çok okulda var. Önce okulunu seç, sonra giriş yap.',
        alan: 'kimlik', okulSec: true
      });
    }
    let u = bulunan.u;
    const kilitAnahtar = 'giris:' + istemciIp(req) + ':' + (u ? u.id : (okulId + ':' + kimlik));
    const kalanSn = kilitliMi(kilitAnahtar);
    if (kalanSn) {
      const sure = kalanSn < 90 ? kalanSn + ' saniye' : Math.ceil(kalanSn / 60) + ' dakika';
      return sendJSON(res, 429, {
        error: 'Çok fazla hatalı deneme yapıldı. ' + sure + ' sonra tekrar dene ya da "Şifremi unuttum" ile yeni şifre al.',
        kilitli: true
      });
    }
    /* Doğrulama sorusu yalnızca daha önce hatalı deneme olduysa istenir.
       Böylece normal kullanıcı her girişte soru çözmez ama otomatik şifre
       deneme aracı ikinci denemeden itibaren duvara toslar. */
    const soruLazim = soruGerekliMi(kilitAnahtar);
    if (soruLazim && !botCevapDogru(body.challengeId, body.challengeAnswer)) {
      return sendJSON(res, 400, {
        error: 'Doğrulama sorusunun cevabı yanlış.',
        alan: 'bot',
        soruGerekli: true
      });
    }

    /* Hesap yok mu, şifre mi yanlış: ikisi ayrı söylenir. Kayıt formu
       "bu e-posta zaten kayıtlı" dediği için hesabın varlığı zaten gizli
       değil; tahmin denemesine karşı koruma kilit ve doğrulama sorusudur. */
    let sifreDogru = u ? await verifyPw(String(body.password || ''), u.pass) : false;
    /* Okul sayfasında aynı adla bir öğrenci varken yetişkin hesabıyla
       girilmişse şifre yetişkin hesabında da denenir. */
    if (!sifreDogru && bulunan.yedek && (!u || bulunan.yedek.id !== u.id) &&
        await verifyPw(String(body.password || ''), bulunan.yedek.pass)) {
      u = bulunan.yedek;
      sifreDogru = true;
    }
    if (!u || !sifreDogru) {
      basarisizDeneme(kilitAnahtar, 15 * 60 * 1000);
      hataSay(ipHata, 50, 15 * 60 * 1000);
      const kalan = kalanDeneme(kilitAnahtar);
      if (!u) {
        return sendJSON(res, 401, {
          error: kimlik.indexOf('@') >= 0
            ? 'Bu e-posta adresiyle kayıtlı bir hesap yok.'
            : okulId ? 'Bu okulda bu kullanıcı adıyla bir hesap yok.' : 'Bu kullanıcı adıyla kayıtlı bir hesap yok.',
          alan: 'kimlik', hesapYok: true, soruGerekli: true
        });
      }
      return sendJSON(res, 401, {
        error: 'Şifre yanlış.' + (kalan <= 3
          ? (kalan ? ' ' + kalan + ' deneme hakkın kaldı.' : ' Giriş 15 dakika kilitlendi.')
          : ''),
        alan: 'sifre', kalanHak: kalan, soruGerekli: true
      });
    }
    /* Yedek hesapla girildiyse asıl hesabın hatalı deneme sayacı silinmez:
       yoksa biri yedeği bilerek öteki hesabın 5 deneme kilidini sıfırlayabilirdi. */
    if (u === bulunan.u) denemeSifirla(kilitAnahtar);
    if (u.status === 'rejected') return bad(res, 'Bu hesap kapatılmış. Sistem yöneticisiyle iletişime geç.', 403);
    /* Onay bekleyen hesaba kod göndermenin anlamı yok: girse de içeri
       alınmaz. Şifre doğruysa durumu hemen söyle. */
    if (u.status === 'pending') {
      return sendJSON(res, 403, {
        error: u.role === 'principal'
          ? 'Bu müdür hesabı henüz açılmadı. Sistem yöneticisiyle iletişime geç.'
          : 'Hesabın henüz onaylanmadı. Okul müdürün onaylayınca giriş yapabilirsin.',
        bekliyor: true
      });
    }

    /* İki adımlı giriş öğrenci dışında herkese zorunludur. Öğrencide ve
       e-postası olmayan hesapta (okulun açtığı servisçi, eski hesaplar) kod
       gönderilmez: şifre doğruysa oturum doğrudan açılır. */
    if (!u.email || u.role === 'student') return girisOturumu(res, u);

    const gonderim = await girisKoduGonder(u);
    return ok(res, {
      twoFactor: true,
      challengeId: gonderim.kimlik,
      maskeliEposta: epostaMaskele(u.email),
      yontem: gonderim.yontem,
      mesaj: gonderim.yontem === 'eposta'
        ? 'Giriş kodu ' + epostaMaskele(u.email) + ' adresine gönderildi.'
        : gonderim.hata
          ? 'E-posta gönderilemedi; kod sunucu penceresine (siyah ekran) yazıldı.'
          : 'Kod sunucu penceresine (siyah ekran) yazıldı: e-posta ayarlı değil ya da bu bir deneme adresi.'
    });
  }

  /* 2. adım: kod doğrulanır, oturum açılır. */
  if (p === 'login' && segs[2] === 'dogrula' && method === 'POST') {
    /* Yalnızca YANLIŞ kodlar sayılır: aynı ağdan giren bir sınıfın doğru
       kodları sınıra takılmasın. Her kodun kendi 5 deneme hakkı ayrıca var. */
    const kilitAnahtar = 'kodHata:' + istemciIp(req);
    if (hataSiniriDoldu(kilitAnahtar, 25)) {
      return bad(res, 'Çok fazla yanlış kod denendi. Biraz bekleyip tekrar dene.', 429);
    }
    const sonuc = await girisKoduDogrula(body.challengeId, body.code);
    if (sonuc.hata) {
      hataSay(kilitAnahtar, 25, 5 * 60 * 1000);
      return bad(res, sonuc.hata, 401);
    }

    /* Anahtarın kendisi tarayıcıya, SHA-256 özeti veritabanına. */
    return girisOturumu(res, sonuc.kullanici);
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
    const u = await depo.kullanicilar.bul(kayit.userId);
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
    const anahtar = istekAnahtari(req);
    if (anahtar) await depo.oturumlar.kapat(anahtar);
    return ok(res);
  }

  /* ---- giriş gerektirenler ---- */
  if (p === 'me' && method === 'GET') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    const cocuklar = await childrenOf(me);
    return ok(res, Object.assign({ user: benimGorunum(me), children: cocuklar, kapaliOzellikler: kullanicininKapalilari(me, cocuklar),
      kvkkGuncel: kvkkGuncelMi(me), kvkkSurum: KVKK_SURUM }, await portalBilgisi(me) || {}));
  }

  /* Aydınlatma metnini onaylama: girişte pencere çıkar, buraya gelir. */
  if (p === 'kvkk-onay' && method === 'POST') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    if (body.onay !== true) return bad(res, 'Devam etmek için aydınlatma metnini okuyup onaylaman gerekiyor.');
    me.kvkk = { onay: true, tarih: now(), surum: KVKK_SURUM };
    await depo.kullanicilar.guncelle(me.id, { kvkk: me.kvkk });
    /* Onay kişinindir: yetişkin hesabına ve bütün okul rollerine yazılır. */
    const anaId = me.anaHesapId || (depo.kullanicilar.yetiskinMi(me) ? me.id : '');
    if (anaId) {
      if (me.anaHesapId) await depo.kullanicilar.guncelle(anaId, { kvkk: me.kvkk });
      await depo.kullanicilar.rolSatirlarinaKvkk(anaId, me.kvkk);
    }
    return ok(res, { user: benimGorunum(me), kvkkGuncel: true, kvkkSurum: KVKK_SURUM });
  }

  if (p === 'password' && method === 'POST') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    /* Okul rolündeyken şifre yetişkin hesabınındır. */
    const hesap = me.anaHesapId ? await depo.kullanicilar.bul(me.anaHesapId) : me;
    if (!hesap) return bad(res, 'Hesap bulunamadı', 404);
    /* Mevcut şifre denemesi de kaba kuvvete karşı sınırlı. */
    if (!hizSinir('sifreDegis:' + hesap.id, 10, 15 * 60 * 1000)) return bad(res, 'Çok fazla deneme. Biraz bekle.', 429);
    const eski = String(body.old || '');
    if (!await verifyPw(eski, hesap.pass)) return sendJSON(res, 400, { error: 'Mevcut şifre yanlış', alan: 'eski' });
    const np = String(body.new || '');
    const sorun = sifreSorunu(np, gucluSifreli(hesap));
    if (sorun) return sendJSON(res, 400, { error: 'Yeni şifre: ' + sorun.charAt(0).toLocaleLowerCase('tr') + sorun.slice(1), alan: 'yeni' });
    /* Okulun verdiği şifre (T.C. no ya da dağıtılan şifre) yenisiyle aynı olamaz. */
    if (np === eski) return sendJSON(res, 400, { error: 'Yeni şifre eskisiyle aynı olamaz.', alan: 'yeni' });
    const kadi = String(hesap.username || '').toLowerCase();
    if ((hesap.tc && np.indexOf(hesap.tc) >= 0) || (kadi.length >= 4 && np.toLowerCase().indexOf(kadi) >= 0)) {
      return sendJSON(res, 400, { error: 'Yeni şifre T.C. kimlik numaranı ya da kullanıcı adını içermesin.', alan: 'yeni' });
    }
    /* Şifre değişince bu oturum dışındaki bütün oturumlar (okul rolleri dahil)
       kapanır: şifresini başkası bildiği için değiştiren kişi onu dışarıda bıraksın. */
    const ozet = await hashPw(np);
    await islem(async () => {
      await depo.kullanicilar.guncelle(hesap.id, { pass: ozet, sifreDegismeli: false });
      await depo.oturumlar.hesabinOturumlariniKapat(hesap.id, istekAnahtari(req));
    });
    me.sifreDegismeli = false;
    return ok(res, { user: benimGorunum(me) });
  }

  if (p === 'profile' && method === 'POST') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    /* Okul rolündeyken kişisel bilgiler yetişkin hesabına yazılır; ad okul
       rolü satırlarına da geçer. */
    const hesap = me.anaHesapId ? await depo.kullanicilar.bul(me.anaHesapId) : me;
    if (!hesap) return bad(res, 'Hesap bulunamadı', 404);
    /* Önce hepsi doğrulanır, sonra tek güncellemeyle yazılır. */
    const d = {};
    if (body.fullName) {
      const fn = adDuzelt(clean(body.fullName, 80));
      if (fn.split(/\s+/).filter(Boolean).length < 2) return bad(res, 'Ad ve soyad gerekli');
      d.fullName = fn;
    }
    if (body.tc !== undefined && normTc(body.tc) !== (hesap.tc || '')) {
      /* Okulun açtığı hesapta T.C. no'yu okul yönetir (kullanıcı adı da T.C. olabilir). */
      if (okulHesabiMi(hesap.role) && hesap.okulActi) return bad(res, 'T.C. kimlik numaranı okul yönetimi düzenler.');
      const tc = normTc(body.tc);
      const tcHata = tcSorunu(tc);
      if (tcHata) return bad(res, tcHata);
      /* Numara deneme aracına dönmesin: hesap başına günde en fazla 5 değişiklik. */
      if (!hizSinir('tcDegisim:' + hesap.id, 5, 24 * 60 * 60 * 1000)) {
        return bad(res, 'T.C. kimlik numarasını bugün çok kez değiştirdin. Yarın tekrar dene.', 429);
      }
      if (tc && await depo.kullanicilar.tcVarMi(tc, hesap.id, okulHesabiMi(hesap.role) ? hesap.schoolId : '')) {
        return bad(res, 'Bu T.C. kimlik numarası kullanılamıyor. Yanlış yazmadıysan okul yönetimine başvur.');
      }
      d.tc = tc;
    }
    if (body.address !== undefined) d.address = clean(body.address, 200);
    if (body.district !== undefined) d.district = clean(body.district, 60);
    if (body.city !== undefined && CITIES.indexOf(body.city) >= 0) d.city = body.city;
    if (body.dogum !== undefined) {
      const ds = dogumSorunu(body.dogum, hesap.role === 'student');
      if (ds) return bad(res, ds);
      d.dogum = String(body.dogum || '').trim();
    }
    /* Görünüm tercihi hesapta da saklanır: başka cihazdan girince aynı gelsin. */
    if (body.tema !== undefined) {
      if (['sistem', 'acik', 'koyu'].indexOf(body.tema) < 0) return bad(res, 'Geçersiz tema');
      d.tema = body.tema;
    }
    if (Object.keys(d).length) {
      await islem(async () => {
        await depo.kullanicilar.guncelle(hesap.id, d);
        if (depo.kullanicilar.yetiskinMi(hesap) && d.fullName) {
          await depo.kullanicilar.rolSatirlariniGuncelle(hesap.id, d.fullName, hesap.phone || '');
        }
        if (me.anaHesapId && d.tema) await depo.kullanicilar.guncelle(me.id, { tema: d.tema });
      });
    }
    return ok(res, { user: benimGorunum(await depo.kullanicilar.bul(me.id)) });
  }

  if (p === 'notifications') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    if (method === 'GET') {
      /* 30 saniyede bir yoklanır: kutu değişmediyse liste gönderilmez,
         cevap birkaç bayttır. */
      const s = await depo.genel.bildirimSurumu(me.id);
      if (clean(q.get('surum'), 60) === s.surum) return ok(res, { ayni: true, surum: s.surum, unread: s.okunmamis });
      const list = await depo.genel.bildirimleri(me.id, 100);
      return ok(res, { notifications: list, unread: s.okunmamis, surum: s.surum });
    }
    if (method === 'POST' && segs[2] === 'read') {
      await depo.genel.bildirimleriOkundu(me.id);
      return ok(res);
    }
  }

  return false;
}

module.exports = {
  benimGorunum,
  KVKK_SURUM,
  kvkkGuncelMi,
  kisilikListesi,
  oturumCevabi,
  register,
  uclar
};
