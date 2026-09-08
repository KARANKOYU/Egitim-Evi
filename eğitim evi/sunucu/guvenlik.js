'use strict';
/* Giriş güvenliği.
   Hız sınırı, kaba kuvvet kilidi, bot sorusu, iki adımlı giriş kodları,
   şifre sıfırlama bağlantıları ve oturumdan kullanıcıyı bulma. */

const crypto = require('crypto');
const eposta = require('./yardimci/eposta');
const { ayarlar, epostaKurulu } = require('./ayarlar');
const { db, save, userById } = require('./veri');

/* ============ iki adimli giris (2FA) ============
   Kodlar diske YAZILMAZ, sadece bellekte tutulur ve ozetlenerek saklanir. */

const girisKodlari = new Map();     // kimlik -> { userId, ozet, bitis, deneme, eposta }
const KOD_OMRU_MS = 5 * 60 * 1000;
const KOD_EN_FAZLA_DENEME = 5;

function kodOzeti(kod) { return crypto.createHash('sha256').update(String(kod)).digest('hex'); }

function epostaMaskele(adres) {
  const s = String(adres || '');
  const at = s.indexOf('@');
  if (at < 1) return s;
  const ad = s.slice(0, at);
  const alan = s.slice(at);
  if (ad.length <= 2) return ad[0] + '*' + alan;
  return ad[0] + '*'.repeat(Math.max(1, ad.length - 2)) + ad[ad.length - 1] + alan;
}

async function girisKoduGonder(kullanici) {
  const kod = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  const kimlik = crypto.randomBytes(18).toString('hex');

  girisKodlari.set(kimlik, {
    userId: kullanici.id,
    ozet: kodOzeti(kod),
    bitis: Date.now() + KOD_OMRU_MS,
    deneme: 0,
    eposta: kullanici.email,
    sonGonderim: Date.now()
  });

  const konu = 'Eğitim Evi giriş kodun: ' + kod;
  const govde = [
    'Merhaba ' + kullanici.fullName + ',',
    '',
    'Eğitim Evi giriş kodun: ' + kod,
    '',
    'Bu kod 5 dakika geçerlidir ve yalnızca bir kez kullanılabilir.',
    'Giriş denemesi sana ait değilse şifreni değiştir.',
    '',
    'Eğitim Evi'
  ].join('\n');

  if (epostaKurulu()) {
    try {
      await eposta.gonder(ayarlar.eposta, kullanici.email, konu, govde);
      return { kimlik: kimlik, yontem: 'eposta' };
    } catch (e) {
      console.error('E-posta gönderilemedi (' + kullanici.email + '):', e.message);
      /* Posta gidemezse kullanici disarida kalmasin: kod sunucu penceresine yazilir. */
      kodKonsolaYaz(kullanici, kod, 'e-posta gonderilemedi');
      return { kimlik: kimlik, yontem: 'konsol', hata: e.message };
    }
  }

  kodKonsolaYaz(kullanici, kod, 'e-posta ayarlanmamis');
  return { kimlik: kimlik, yontem: 'konsol' };
}

function kodKonsolaYaz(kullanici, kod, neden) {
  console.log('');
  console.log('  ============================================');
  console.log('   GIRIS KODU (' + neden + ')');
  console.log('   Kullanici : ' + kullanici.fullName + ' <' + kullanici.email + '>');
  console.log('   KOD       : ' + kod);
  console.log('   Sure      : 5 dakika');
  console.log('  ============================================');
  console.log('');
}

/* ============ şifre sıfırlama ============
   Kullanıcı e-postasını yazar, tek kullanımlık bir bağlantı gönderilir.
   Anahtarlar bellekte tutuluyor: sunucu yeniden başlarsa bekleyen tüm
   bağlantılar geçersiz olur, bu istenen davranış. */

const sifirlamaKayit = new Map();
const SIFIRLAMA_OMRU_MS = 60 * 60 * 1000;   // 1 saat

/* Süresi geçmişleri ara sıra temizle; sınırsız büyümesin. */
function sifirlamaTemizle() {
  const t = Date.now();
  for (const [k, v] of sifirlamaKayit) if (t > v.bitis) sifirlamaKayit.delete(k);
}

function sifirlamaBaglantisi(anahtar) {
  const kok = (ayarlar.site && ayarlar.site.adres)
    ? String(ayarlar.site.adres).replace(/\/+$/, '')
    : '';
  return kok ? kok + '/#/yeni-sifre?t=' + anahtar : '';
}

async function sifirlamaGonder(kullanici) {
  sifirlamaTemizle();

  /* Aynı kullanıcı için bekleyen eski bağlantıları düşür: tek bağlantı geçerli olsun. */
  for (const [k, v] of sifirlamaKayit) if (v.userId === kullanici.id) sifirlamaKayit.delete(k);

  const anahtar = crypto.randomBytes(32).toString('hex');
  sifirlamaKayit.set(anahtar, {
    userId: kullanici.id,
    eposta: kullanici.email,
    bitis: Date.now() + SIFIRLAMA_OMRU_MS
  });

  const baglanti = sifirlamaBaglantisi(anahtar);
  const konu = 'Eğitim Evi şifre sıfırlama';
  const govde = [
    'Merhaba ' + kullanici.fullName + ',',
    '',
    'Eğitim Evi hesabının şifresini sıfırlamak için aşağıdaki bağlantıya tıkla:',
    '',
    baglanti || ('(Site adresi ayarlanmamış. Anahtar: ' + anahtar + ')'),
    '',
    'Bu bağlantı 1 saat geçerlidir ve yalnızca bir kez kullanılabilir.',
    'Şifre sıfırlama isteğini sen yapmadıysan bu postayı yok sayabilirsin;',
    'şifren değişmeden kalır.',
    '',
    'Eğitim Evi'
  ].join('\n');

  if (epostaKurulu()) {
    try {
      await eposta.gonder(ayarlar.eposta, kullanici.email, konu, govde);
      return { yontem: 'eposta' };
    } catch (e) {
      console.error('Sıfırlama postası gönderilemedi (' + kullanici.email + '):', e.message);
      sifirlamaKonsolaYaz(kullanici, baglanti, anahtar, 'e-posta gonderilemedi');
      return { yontem: 'konsol', hata: e.message };
    }
  }
  sifirlamaKonsolaYaz(kullanici, baglanti, anahtar, 'e-posta ayarlanmamis');
  return { yontem: 'konsol' };
}

function sifirlamaKonsolaYaz(kullanici, baglanti, anahtar, neden) {
  console.log('');
  console.log('  ============================================');
  console.log('   SIFRE SIFIRLAMA (' + neden + ')');
  console.log('   Kullanici : ' + kullanici.fullName + ' <' + kullanici.email + '>');
  console.log('   Baglanti  : ' + (baglanti || '(site adresi yok)'));
  console.log('   Anahtar   : ' + anahtar);
  console.log('   Sure      : 1 saat');
  console.log('  ============================================');
  console.log('');
}

function girisKoduDogrula(kimlik, kod) {
  const kayit = girisKodlari.get(String(kimlik || ''));
  if (!kayit) return { hata: 'Giriş oturumu bulunamadı, tekrar giriş yap' };
  if (Date.now() > kayit.bitis) {
    girisKodlari.delete(String(kimlik));
    return { hata: 'Kodun süresi doldu, tekrar giriş yap' };
  }
  kayit.deneme++;
  if (kayit.deneme > KOD_EN_FAZLA_DENEME) {
    girisKodlari.delete(String(kimlik));
    return { hata: 'Çok fazla hatalı kod denemesi. Baştan giriş yap' };
  }
  const girilen = String(kod || '').trim();
  if (!/^\d{6}$/.test(girilen)) return { hata: 'Kod 6 haneli olmalı' };

  const a = Buffer.from(kodOzeti(girilen), 'hex');
  const b = Buffer.from(kayit.ozet, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { hata: 'Kod hatalı. Kalan hakkın: ' + (KOD_EN_FAZLA_DENEME - kayit.deneme) };
  }

  girisKodlari.delete(String(kimlik));
  const u = userById(kayit.userId);
  if (!u) return { hata: 'Hesap bulunamadi' };
  return { kullanici: u };
}

/* ============ güvenlik: hız sınırlama ve kaba kuvvet ============
   Bellekte tutulur, sunucu yeniden başlayınca sıfırlanır. Tek okul ölçeğinde
   yeterli; her kayıt için süre dolunca temizlenir, sınırsız büyümez. */

const OTURUM_OMRU_MS = 7 * 24 * 60 * 60 * 1000;   // 7 gün
const EN_FAZLA_OTURUM = 20000;

const hizKayit = new Map();      // anahtar -> { sayac, bitis }
const kilitKayit = new Map();    // anahtar -> { sayac, kilitBitis }

/* Kabaca IP biçiminde mi? Uydurma başlıkların sayaçları kirletmesini engeller. */
function ipGibiMi(x) {
  const t = String(x || '').trim();
  if (!t || t.length > 45) return false;
  return /^[0-9.]+$/.test(t) || /^[0-9a-fA-F:.]+$/.test(t);
}

function istemciIp(req) {
  const s = req.socket;
  let ip = (s && (s.remoteAddress || '')) || 'bilinmiyor';

  /* Ters vekil arkasındayken soket adresi hep 127.0.0.1 olur; o hâlde
     bütün ziyaretçiler tek sayaç paylaşır ve hız sınırı işe yaramaz.
     Gerçek adresi vekilin başlığından okuyoruz — AMA sadece ayarlarda
     açıkça güvendiğimizi söylediysek. Aksi hâlde herkes başlığı uydurup
     sınırı aşardı. */
  const v = ayarlar && ayarlar.vekil;
  if (v && v.guven) {
    const baslik = String(v.baslik || 'cf-connecting-ip').toLowerCase();
    let deger = req.headers[baslik];
    if (Array.isArray(deger)) deger = deger[0];
    if (typeof deger === 'string' && deger) {
      /* X-Forwarded-For zinciri: ilk sıradaki gerçek istemcidir. */
      const ilk = deger.split(',')[0].trim();
      if (ipGibiMi(ilk)) ip = ilk;
    }
  }

  /* IPv6 sarmalı IPv4 adreslerini sadeleştir: ::ffff:192.168.1.5 -> 192.168.1.5 */
  if (ip.indexOf('::ffff:') === 0) ip = ip.slice(7);
  return ip;
}

/* Pencere içinde izin verilen istek sayısını aşarsa false döner. */
function hizSinir(anahtar, adet, pencereMs) {
  const t = Date.now();
  let k = hizKayit.get(anahtar);
  if (!k || t > k.bitis) { k = { sayac: 0, bitis: t + pencereMs }; hizKayit.set(anahtar, k); }
  k.sayac++;
  return k.sayac <= adet;
}

function kilitliMi(anahtar) {
  const k = kilitKayit.get(anahtar);
  if (!k) return 0;
  if (Date.now() > k.kilitBitis) { kilitKayit.delete(anahtar); return 0; }
  return k.sayac >= 5 ? Math.ceil((k.kilitBitis - Date.now()) / 1000) : 0;
}

function basarisizDeneme(anahtar, kilitMs) {
  const t = Date.now();
  let k = kilitKayit.get(anahtar);
  if (!k || t > k.kilitBitis) k = { sayac: 0, kilitBitis: t + kilitMs };
  k.sayac++;
  k.kilitBitis = t + kilitMs;
  kilitKayit.set(anahtar, k);
}

function denemeSifirla(anahtar) { kilitKayit.delete(anahtar); }

/* Bu IP+e-posta için daha önce hatalı deneme oldu mu? Olduysa girişte
   doğrulama sorusu istenir. Temiz kullanıcı soruyu hiç görmez. */
function soruGerekliMi(anahtar) {
  const k = kilitKayit.get(anahtar);
  if (!k) return false;
  if (Date.now() > k.kilitBitis) { kilitKayit.delete(anahtar); return false; }
  return k.sayac > 0;
}

/* Kayit sayaci: sadece gercekten hesap acildiginda artar.
   Formu yanlis dolduran kullanici bu sinira takilmaz; asil amac ayni
   cihazdan seri sahte hesap acilmasini engellemek. */
const KAYIT_PENCERE_MS = 60 * 60 * 1000;
function kayitSayaci(ip, artir) {
  const anahtar = 'kayitOk:' + ip;
  const t = Date.now();
  let k = hizKayit.get(anahtar);
  if (!k || t > k.bitis) { k = { sayac: 0, bitis: t + KAYIT_PENCERE_MS }; hizKayit.set(anahtar, k); }
  if (artir) k.sayac++;
  return k.sayac;
}

/* Süresi geçmiş kayıtları ve oturumları düzenli olarak temizle. */
function guvenlikTemizle() {
  const t = Date.now();
  for (const [k, v] of hizKayit) if (t > v.bitis) hizKayit.delete(k);
  for (const [k, v] of kilitKayit) if (t > v.kilitBitis) kilitKayit.delete(k);
  for (const [k, v] of botSorular) if (t > v.bitis) botSorular.delete(k);
  for (const [k, v] of girisKodlari) if (t > v.bitis) girisKodlari.delete(k);

  let degisti = false;
  const anahtarlar = Object.keys(db.sessions || {});
  for (const tok of anahtarlar) {
    const o = db.sessions[tok];
    const bas = o && o.createdAt ? Date.parse(o.createdAt) : 0;
    if (!bas || (t - bas) > OTURUM_OMRU_MS) { delete db.sessions[tok]; degisti = true; }
  }
  /* Beklenmedik bir birikmeye karşı üst sınır: en eskiler atılır. */
  const kalan = Object.keys(db.sessions || {});
  if (kalan.length > EN_FAZLA_OTURUM) {
    kalan.sort((a, b) => String(db.sessions[a].createdAt).localeCompare(String(db.sessions[b].createdAt)));
    for (let i = 0; i < kalan.length - EN_FAZLA_OTURUM; i++) { delete db.sessions[kalan[i]]; degisti = true; }
  }
  if (degisti) save();
}

/* ============ bot doğrulaması ============
   Kayıt formunda sunucunun ürettiği basit bir toplama sorusu sorulur.
   Cevap istemciye hiç gönderilmez, sunucuda 5 dakika tutulur. */
const botSorular = new Map();
const BOT_OMRU_MS = 5 * 60 * 1000;
const EN_FAZLA_BOT_SORU = 5000;

function botSoruUret() {
  if (botSorular.size > EN_FAZLA_BOT_SORU) botSorular.clear();
  const a = crypto.randomInt(3, 10);
  const b = crypto.randomInt(2, 10);
  const id = crypto.randomBytes(12).toString('hex');
  botSorular.set(id, { cevap: a + b, bitis: Date.now() + BOT_OMRU_MS });
  return { id, soru: a + ' + ' + b + ' = ?' };
}

function botCevapDogru(id, cevap) {
  const anahtar = String(id || '');
  const k = botSorular.get(anahtar);
  if (!k) return false;
  if (Date.now() > k.bitis) { botSorular.delete(anahtar); return false; }
  const sayi = parseInt(String(cevap).trim(), 10);
  if (!Number.isInteger(sayi) || sayi !== k.cevap) return false;
  botSorular.delete(anahtar);   // doğru cevap tek kullanımlık
  return true;
}

/* JSON gövdesindeki tehlikeli anahtarları temizler (prototype pollution). */

/* ============ oturum ve yetki ============ */
function currentUser(req) {
  const h = req.headers['authorization'] || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return null;
  const s = db.sessions[token];
  if (!s) return null;
  const u = userById(s.userId);
  if (!u) { delete db.sessions[token]; return null; }
  return u;
}


module.exports = {
  girisKodlari,
  KOD_OMRU_MS,
  KOD_EN_FAZLA_DENEME,
  kodOzeti,
  epostaMaskele,
  girisKoduGonder,
  kodKonsolaYaz,
  sifirlamaKayit,
  SIFIRLAMA_OMRU_MS,
  sifirlamaTemizle,
  sifirlamaBaglantisi,
  sifirlamaGonder,
  sifirlamaKonsolaYaz,
  girisKoduDogrula,
  OTURUM_OMRU_MS,
  EN_FAZLA_OTURUM,
  hizKayit,
  kilitKayit,
  ipGibiMi,
  istemciIp,
  hizSinir,
  kilitliMi,
  basarisizDeneme,
  denemeSifirla,
  soruGerekliMi,
  KAYIT_PENCERE_MS,
  kayitSayaci,
  guvenlikTemizle,
  botSorular,
  BOT_OMRU_MS,
  EN_FAZLA_BOT_SORU,
  botSoruUret,
  botCevapDogru,
  currentUser
};
