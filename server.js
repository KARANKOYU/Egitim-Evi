'use strict';
/* Eğitim Evi - Okul Yönetim Sistemi
 * Sıfır bağımlılık: sadece Node.js'in kendi modülleri kullanılır.
 * Çalıştırmak için: baslat.bat  (veya  node server.js)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const eposta = require('./eposta');

const xlsx = require('./xlsx');
const aktarim = require('./aktarim');
const ROOT = __dirname;
const PUB = path.join(ROOT, 'public');
/* Veri klasoru: EE_DATA ile degistirilebilir. Boylece gercek veriye
   dokunmadan ayri bir test ornegi calistirilabilir. */
const DATA = process.env.EE_DATA ? path.resolve(process.env.EE_DATA) : path.join(ROOT, 'data');
const DBF = path.join(DATA, 'db.json');
const PORT = Number(process.env.PORT) || 3000;
/* Ters vekil (Caddy/nginx) arkasindayken sunucunun disariya acik olmasina
   gerek yok: HOST=127.0.0.1 verilirse yalnizca yerelden dinler. */
const HOST = process.env.HOST || '0.0.0.0';

const SUBJECTS = ['Matematik', 'Türkçe', 'İngilizce', 'Din Kültürü ve Ahlak Bilgisi',
  'Sosyal Bilgiler', 'Fen Bilimleri', 'Müzik', 'Resim', 'Beden Eğitimi'];

const CITIES = ['Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis',
  'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne',
  'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay',
  'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu',
  'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya',
  'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya',
  'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli',
  'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'];

const RESULT_TYPES = ['yapti', 'yapmadi', 'eksik', 'izinli', 'gelmedi'];

/* ============ ayarlar (data/ayarlar.json) ============
   E-posta bilgileri burada durur. data/ klasoru web'den servis EDILMEZ,
   bu yuzden sifre tarayiciya sizmaz. */

const AYAR_DOSYA = path.join(DATA, 'ayarlar.json');

const VARSAYILAN_AYAR = {
  _aciklama: 'E-posta ayarlari. Gmail icin: Google Hesabim > Guvenlik > 2 Adimli Dogrulama acik olmali, sonra Uygulama Sifreleri bolumunden 16 haneli sifre uret ve asagiya yaz.',

  /* Site internete acildiginda kullanilir (baglantilar, e-posta metinleri). */
  site: {
    adres: ''
  },

  /* Ters vekil (Cloudflare Tunnel, nginx) arkasindaysan burayi ac.
     KAPALIYKEN acma: guven=true iken herkes X-Forwarded-For basligini
     uydurup hiz sinirini asabilir. Sadece gercekten vekil arkasindaysan. */
  vekil: {
    guven: false,
    baslik: 'cf-connecting-ip'
  },

  eposta: {
    etkin: false,
    sunucu: 'smtp.gmail.com',
    port: 465,
    guvenli: true,
    kullanici: '',
    sifre: '',
    gonderen: '',
    gorunenAd: 'Egitim Evi'
  }
};

let ayarlar = null;

function ayarlariYukle() {
  if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });
  if (!fs.existsSync(AYAR_DOSYA)) {
    fs.writeFileSync(AYAR_DOSYA, JSON.stringify(VARSAYILAN_AYAR, null, 2), 'utf8');
    ayarlar = JSON.parse(JSON.stringify(VARSAYILAN_AYAR));
    return;
  }
  try {
    const okunan = JSON.parse(fs.readFileSync(AYAR_DOSYA, 'utf8'));
    ayarlar = Object.assign({}, VARSAYILAN_AYAR, okunan);
    ayarlar.eposta = Object.assign({}, VARSAYILAN_AYAR.eposta, okunan.eposta || {});
    ayarlar.vekil = Object.assign({}, VARSAYILAN_AYAR.vekil, okunan.vekil || {});
    ayarlar.site = Object.assign({}, VARSAYILAN_AYAR.site, okunan.site || {});
  } catch (e) {
    console.error('ayarlar.json okunamadi, varsayilan kullaniliyor:', e.message);
    ayarlar = JSON.parse(JSON.stringify(VARSAYILAN_AYAR));
  }
}

function epostaKurulu() {
  const e = ayarlar && ayarlar.eposta;
  return !!(e && e.etkin && e.sunucu && e.kullanici && e.sifre);
}

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

/* ============ MEB okul listesi ============
   data/okullar.json, araclar/okullari-hazirla.js ile CSV'den uretilir.
   53 bin kayit bellekte tutulur; aramayi hizlandirmak icin adlar bir kez
   sadelestirilip (Turkce harfler duzlenerek) yaninda saklanir. */

const OKUL_DOSYA = path.join(DATA, 'okullar.json');
let okulVeri = null;          // { iller, ilceler, tipler, okullar }
let okulAra = [];             // { id, ad, sade, il, ilce, tip }

/* "Ögretmen" / "ogretmen" / "ÖĞRETMEN" hepsi ayni sonuca gitsin diye
   Turkce harfleri duzler. Sunucu ve tarayici ayni kurali kullanir. */
const TR_SADE_HARF = {
  'ı': 'i', 'İ': 'i', 'I': 'i', 'ş': 's', 'Ş': 's', 'ğ': 'g', 'Ğ': 'g',
  'ü': 'u', 'Ü': 'u', 'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c',
  'â': 'a', 'Â': 'a', 'î': 'i', 'Î': 'i', 'û': 'u', 'Û': 'u'
};

function sadelestir(metin) {
  const s = String(metin == null ? '' : metin);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    out += (TR_SADE_HARF[c] !== undefined) ? TR_SADE_HARF[c] : c;
  }
  return out.toLowerCase().trim();
}

/* il|ilce|ad uclusunden sabit bir kimlik uretir. Liste yeniden olusturulsa
   bile ayni okul ayni kimligi alir, kayitli hesaplar kopmaz. */
function okulKimligi(il, ilce, ad) {
  return 'meb_' + crypto.createHash('sha1')
    .update(sadelestir(il) + '|' + sadelestir(ilce) + '|' + sadelestir(ad))
    .digest('hex').slice(0, 12);
}

function okullariYukle() {
  if (!fs.existsSync(OKUL_DOSYA)) {
    console.log('');
    console.log('  ! data/okullar.json yok - okul listesi devre disi.');
    console.log('    Olusturmak icin:  node araclar/okullari-hazirla.js');
    console.log('');
    return;
  }
  try {
    okulVeri = JSON.parse(fs.readFileSync(OKUL_DOSYA, 'utf8'));
    const { iller, ilceler, tipler, okullar } = okulVeri;
    /* Eski listelerde bu alanlar yok; olmayınca sorun çıkarmasın. */
    const resmiTurler = okulVeri.resmiTurler || [];
    okulAra = new Array(okullar.length);
    let ozelSayaci = 0;
    for (let i = 0; i < okullar.length; i++) {
      const o = okullar[i];
      const il = iller[o[0]] || '';
      const ilce = ilceler[o[1]] || '';
      const tip = tipler[o[2]] || '';
      const ad = o[3];
      const ozel = o[4] === 1;
      if (ozel) ozelSayaci++;
      okulAra[i] = {
        id: okulKimligi(il, ilce, ad),
        ad: ad, sade: sadelestir(ad), il: il, ilce: ilce,
        sadeIlce: sadelestir(ilce), tip: tip,
        ozel: ozel,
        kod: o[5] || '',
        resmiTur: (o[6] !== undefined && resmiTurler[o[6]]) ? resmiTurler[o[6]] : tip
      };
    }
    console.log('  Okul listesi: ' + okulAra.length + ' okul yuklendi (' +
      iller.length + ' il, ' + ozelSayaci + ' ozel)');
  } catch (e) {
    console.error('okullar.json okunamadi:', e.message);
    okulVeri = null;
    okulAra = [];
  }
}

/* Arama: il / ilce / tip ile daraltilabilir, ad icinde gecen metne gore suzer.
   Once adin basindan eslesenler gelir, sonra icinde gecenler. */
function okulArama(sorgu, il, ilce, tip, limit) {
  const q = sadelestir(sorgu);
  const qIlce = sadelestir(ilce);
  const bastan = [];
  const icinde = [];
  const enFazla = Math.min(Math.max(limit || 30, 1), 100);
  let toplam = 0;

  for (let i = 0; i < okulAra.length; i++) {
    const o = okulAra[i];
    if (il && o.il !== il) continue;
    if (qIlce && o.sadeIlce !== qIlce) continue;
    if (tip && o.tip !== tip) continue;

    if (q) {
      const yer = o.sade.indexOf(q);
      if (yer < 0) continue;
      toplam++;
      if (bastan.length + icinde.length < enFazla * 3) {
        (yer === 0 ? bastan : icinde).push(o);
      }
    } else {
      toplam++;
      if (bastan.length < enFazla * 3) bastan.push(o);
    }
  }

  const sonuc = bastan.concat(icinde).slice(0, enFazla);
  return {
    toplam: toplam,
    okullar: sonuc.map(o => ({
      id: o.id, ad: o.ad, il: o.il, ilce: o.ilce, tip: o.tip,
      ozel: o.ozel ? 1 : 0, resmiTur: o.resmiTur, kod: o.kod
    }))
  };
}

function okulKimlikBul(id) {
  const hedef = String(id || '');
  for (let i = 0; i < okulAra.length; i++) if (okulAra[i].id === hedef) return okulAra[i];
  return null;
}

/* ============ yardımcılar ============ */
function uid(p) { return p + '_' + crypto.randomBytes(9).toString('hex'); }
function now() { return new Date().toISOString(); }

/* Şifreler scrypt ile saklanır (tuz + 64 baytlık türetilmiş anahtar).
   scryptSync olay döngüsünü bloklar: 100 eşzamanlı giriş denemesi sunucuyu
   saniyelerce kilitler. Bu yüzden çalışma anında hep asenkron sürüm kullanılır;
   senkron sürüm yalnızca açılışta bir kez, ilk admin hesabı için çalışır. */
const SCRYPT_AYAR = { N: 16384, r: 8, p: 1, maxmem: 72 * 1024 * 1024 };

function scryptAsync(pw, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(pw, salt, 64, SCRYPT_AYAR, (e, key) => e ? reject(e) : resolve(key));
  });
}

function hashPwSync(pw, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  return salt + ':' + crypto.scryptSync(pw, salt, 64, SCRYPT_AYAR).toString('hex');
}

async function hashPw(pw, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const key = await scryptAsync(pw, salt);
  return salt + ':' + key.toString('hex');
}

async function verifyPw(pw, stored) {
  if (!stored || stored.indexOf(':') < 0) return false;
  const parts = stored.split(':');
  let a;
  try { a = Buffer.from(parts[1], 'hex'); } catch (e) { return false; }
  if (!a.length) return false;
  const b = await scryptAsync(pw, parts[0]);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
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
function govdeTemizle(v, derinlik) {
  derinlik = derinlik || 0;
  if (derinlik > 6 || v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.slice(0, 500).map(x => govdeTemizle(x, derinlik + 1));
  const temiz = Object.create(null);
  for (const k of Object.keys(v)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
    temiz[k] = govdeTemizle(v[k], derinlik + 1);
  }
  return temiz;
}
/* Öğrenci kodu: 14 karakter. Büyük harf + küçük harf + rakam + özel işaret
   içermesi garanti. Karışabilen karakterler (0/O, 1/l/I) bilerek çıkarıldı.
   Alfabe 74 karakter -> 74^14 ≈ 2.3e26 olasılık, tahmin edilemez. */
const KOD_BUYUK = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const KOD_KUCUK = 'abcdefghijkmnopqrstuvwxyz';
const KOD_RAKAM = '23456789';
const KOD_OZEL = '!@#$%*?+-';
const KOD_HEPSI = KOD_BUYUK + KOD_KUCUK + KOD_RAKAM + KOD_OZEL;
const KOD_UZUNLUK = 14;

function kodSec(kume) { return kume[crypto.randomInt(kume.length)]; }

function makeCode() {
  const ch = [kodSec(KOD_BUYUK), kodSec(KOD_KUCUK), kodSec(KOD_RAKAM), kodSec(KOD_OZEL)];
  while (ch.length < KOD_UZUNLUK) ch.push(kodSec(KOD_HEPSI));
  for (let i = ch.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    const t = ch[i]; ch[i] = ch[j]; ch[j] = t;
  }
  return ch.join('');
}
/* Telefonu tek biçime indirir: "0532 123 45 67" -> "05321234567".
   Kullanıcı boşluklu, tireli ya da +90 ile yazabilir. */
function normTelefon(t) {
  let s2 = String(t == null ? '' : t).replace(/[\s()\-.]/g, '');
  if (s2.indexOf('+90') === 0) s2 = '0' + s2.slice(3);
  else if (s2.indexOf('90') === 0 && s2.length === 12) s2 = '0' + s2.slice(2);
  else if (s2.length === 10 && s2[0] === '5') s2 = '0' + s2;
  return s2;
}

function telefonSorunu(t) {
  const s2 = normTelefon(t);
  if (!s2) return 'Telefon numarası gerekli';
  if (!/^0\d{10}$/.test(s2)) {
    return 'Telefonu 0532 123 45 67 biçiminde yaz';
  }
  return '';
}

function normEmail(e) { return String(e == null ? '' : e).trim().toLowerCase(); }

/* Şifre kuralı tek yerde: kayıt, şifre değiştirme ve müdürün açtığı
   hesaplar aynı kuralı kullansın. Sorun varsa metin döner, yoksa null. */
function sifreSorunu(pw) {
  const s = String(pw || '');
  if (s.length < 8) return 'Şifre en az 8 karakter olmalı';
  if (s.length > 200) return 'Şifre çok uzun';
  if (!/[0-9]/.test(s) || !/[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(s)) {
    return 'Şifre en az bir harf ve bir rakam içermeli';
  }
  return null;
}
/* Metin alanı bekliyoruz. İstemci nesne ya da dizi gönderirse bunu metne
   çevirmeye çalışmak yanlış: govdeTemizle prototipsiz nesne ürettiği için
   String() "Cannot convert object to primitive value" diye patlıyordu ve
   herkes istediği uca 500 aldırabiliyordu. Nesne geldiyse boş sayıyoruz. */
function clean(s, max) {
  if (s == null) return '';
  if (typeof s === 'object') return '';
  return String(s).trim().slice(0, max || 200);
}

/* ============ veritabanı (data/db.json) ============ */
let db = null;
function loadDB() {
  if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });
  if (fs.existsSync(DBF)) {
    try {
      db = JSON.parse(fs.readFileSync(DBF, 'utf8'));
    } catch (e) {
      console.error('db.json okunamadı, yedeklenip sıfırlanıyor:', e.message);
      fs.renameSync(DBF, DBF + '.bozuk-' + Date.now());
      db = null;
    }
  }
  if (!db) db = {};
  for (const k of ['users', 'schools', 'assignments', 'examGroups', 'exams',
    'parentLinks', 'teacherStudents', 'notifications',
    'classes', 'lessons', 'schedule', 'roles', 'mesajlar', 'devamsizlik', 'islemKaydi', 'takvim', 'egitimYillari']) {
    if (!Array.isArray(db[k])) db[k] = [];
  }
  if (!db.sessions || typeof db.sessions !== 'object') db.sessions = {};
  /* Gönderilmiş hatırlatmalar: aynı bildirim iki kez gitmesin. */
  if (!db.hatirlatmalar || typeof db.hatirlatmalar !== 'object') db.hatirlatmalar = {};

  /* Eski sürümde ders programı sabit "ders saati" numarasıyla tutuluyordu.
     Kayıtları varsayılan zil saatlerine göre saat aralığına taşı. */
  let tasindi = 0;
  for (const sp of db.schedule) {
    if (sp.start && sp.end) continue;
    const varsayilan = ESKI_SAATLER[sp.slot] || ESKI_SAATLER[1];
    sp.start = varsayilan[0];
    sp.end = varsayilan[1];
    delete sp.slot;
    tasindi++;
  }
  if (tasindi) console.log('  Ders programı yeni saat düzenine taşındı (' + tasindi + ' kayıt).');

  if (!db.users.some(u => u.role === 'admin')) {
    db.users.push({
      id: uid('u'), email: 'admin@egitimevi.com', pass: hashPwSync('admin123'),
      fullName: 'Sistem Yöneticisi', role: 'admin', status: 'approved',
      city: '', district: '', address: '', createdAt: now()
    });
    console.log('\n  ! İlk admin hesabı oluşturuldu -> admin@egitimevi.com / admin123');
    console.log('    Giriş yaptıktan sonra Ayarlar bölümünden şifreyi mutlaka değiştir.\n');
  }
  saveNow();
}

let dirty = false, timer = null;
/* Veri tek dosyada; okul büyüdükçe bu dosya da büyüyor. Yazmayı iki
   şekilde ucuzlattık:
     1. Biçimsiz (girintisiz) yazıyoruz — dosya küçülüyor, stringify hızlanıyor.
        Bu bir veri dosyası, elle okunması için değil.
     2. Asenkron yazıyoruz — 50 MB'lık senkron yazma, sürerken gelen bütün
        istekleri bekletir. Yedek alırken senkron sürüm kullanılıyor, çünkü
        orada dosyanın diskte hazır olması gerekiyor. */

let yaziyor = false;
let tekrarYaz = false;

function writeDisk() {
  if (yaziyor) { tekrarYaz = true; return; }
  let metin;
  try {
    metin = JSON.stringify(db);
  } catch (e) {
    console.error('Kayıt hatası (JSON):', e.message);
    return;
  }
  yaziyor = true;
  fs.writeFile(DBF + '.tmp', metin, 'utf8', (e1) => {
    if (e1) {
      console.error('Kayıt hatası:', e1.message);
      yaziyor = false;
      return;
    }
    fs.rename(DBF + '.tmp', DBF, (e2) => {
      if (e2) console.error('Kayıt hatası (yeniden adlandırma):', e2.message);
      yaziyor = false;
      /* Yazma sürerken yeni değişiklik geldiyse bir tur daha at. */
      if (tekrarYaz) { tekrarYaz = false; writeDisk(); }
    });
  });
}

function writeDiskSync() {
  try {
    fs.writeFileSync(DBF + '.tmp', JSON.stringify(db), 'utf8');
    fs.renameSync(DBF + '.tmp', DBF);
  } catch (e) { console.error('Kayıt hatası:', e.message); }
}

function save() {
  dirty = true;
  if (timer) return;
  /* 400 ms: art arda gelen değişiklikler tek yazmada birleşsin. */
  timer = setTimeout(() => { timer = null; if (dirty) { dirty = false; writeDisk(); } }, 400);
}

/* Yedek alma ve kapanış gibi "şimdi diskte olsun" durumları. */
function saveNow() {
  if (timer) { clearTimeout(timer); timer = null; }
  dirty = false;
  writeDiskSync();
}

const byId = (arr, id) => arr.find(x => x.id === id) || null;
const userById = id => byId(db.users, id);
const schoolById = id => byId(db.schools, id);

function notify(userId, text, link) {
  if (!userId) return;
  db.notifications.push({
    id: uid('n'), userId, text: clean(text, 300),
    link: link || '', read: false, createdAt: now()
  });
}
function notifyAdmins(text, link) {
  db.users.filter(u => u.role === 'admin').forEach(a => notify(a.id, text, link));
}

/* dışarı verilen kullanıcı nesnesi - şifre asla gönderilmez */
function pub(u) {
  if (!u) return null;
  const s = u.schoolId ? schoolById(u.schoolId) : null;
  return {
    id: u.id, email: u.email, fullName: u.fullName, role: u.role, status: u.status,
    city: u.city || '', district: u.district || '', address: u.address || '',
    phone: u.phone || '',
    schoolId: u.schoolId || '', schoolName: s ? s.name : '',
    branch: u.branch || '', code: u.code || '', grade: u.grade || '', createdAt: u.createdAt,
    customRoleId: u.customRoleId || '',
    customRoleName: u.customRoleId && roleById(u.customRoleId) ? roleById(u.customRoleId).name : '',
    yetkiler: kullaniciYetkileri(u)
  };
}

/* ============ yedekleme ============
   Bütün veri tek dosyada (db.json). O dosya bozulursa ya da yanlışlıkla
   silinirse her şey gider; bu yüzden günlük kopya alınıyor.
   Kopyalar data/yedek/ altında, en yeni N tanesi saklanıyor. */

const YEDEK_KLASOR = path.join(DATA, 'yedek');
const YEDEK_SAKLA = 14;                       // kaç kopya tutulsun
const YEDEK_ARALIK_MS = 6 * 60 * 60 * 1000;   // 6 saatte bir kontrol

function yedekAdi(d) {
  const p2 = n => (n < 10 ? '0' : '') + n;
  return 'yedek-' + d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) +
    '_' + p2(d.getHours()) + p2(d.getMinutes()) + '.json';
}

function yedekListesi() {
  if (!fs.existsSync(YEDEK_KLASOR)) return [];
  return fs.readdirSync(YEDEK_KLASOR)
    .filter(f => /^yedek-.*\.json$/.test(f))
    .map(f => {
      const st = fs.statSync(path.join(YEDEK_KLASOR, f));
      return { ad: f, boyut: st.size, tarih: st.mtime.toISOString() };
    })
    .sort((a, b) => b.ad.localeCompare(a.ad));
}

/* Eskiyenleri at. */
function yedekTemizle() {
  const liste = yedekListesi();
  for (let i = YEDEK_SAKLA; i < liste.length; i++) {
    try { fs.unlinkSync(path.join(YEDEK_KLASOR, liste[i].ad)); } catch (e) { /* yoksay */ }
  }
}

function yedekAl(elle) {
  try {
    if (!fs.existsSync(DBF)) return { hata: 'Veri dosyası yok' };
    fs.mkdirSync(YEDEK_KLASOR, { recursive: true });

    /* Bellekteki hâli diske yaz, sonra kopyala — yarım kalmış yazma olmasın. */
    saveNow();

    const ad = (elle ? 'yedek-elle-' : '') + yedekAdi(new Date());
    const hedef = path.join(YEDEK_KLASOR, elle ? ad : yedekAdi(new Date()));
    fs.copyFileSync(DBF, hedef);
    yedekTemizle();
    return { ad: path.basename(hedef), boyut: fs.statSync(hedef).size };
  } catch (e) {
    console.error('Yedek alınamadı:', e.message);
    return { hata: e.message };
  }
}

/* Günde bir kez yeterli: son yedek 20 saatten eskiyse yenisini al. */
function yedekGerekliMi() {
  const liste = yedekListesi().filter(y => y.ad.indexOf('yedek-elle-') !== 0);
  if (!liste.length) return true;
  const sonZaman = Date.parse(liste[0].tarih);
  return !sonZaman || (Date.now() - sonZaman) > 20 * 60 * 60 * 1000;
}

function yedekKontrol() {
  try {
    if (yedekGerekliMi()) {
      const r = yedekAl(false);
      if (r.ad) console.log('  Günlük yedek alındı: ' + r.ad);
    }
  } catch (e) {
    console.error('Yedek kontrolü hatası:', e.message);
  }
}

/* Geri yükleme: önce mevcut hâli "geri-alma" kopyası olarak saklar,
   sonra seçilen yedeği db.json'a yazar ve belleğe okur. */
function yedekGeriYukle(ad) {
  const guvenli = String(ad || '').replace(/[^a-zA-Z0-9._-]/g, '');
  if (!/^yedek-.*\.json$/.test(guvenli)) return { hata: 'Geçersiz yedek adı' };

  const kaynak = path.join(YEDEK_KLASOR, guvenli);
  if (!fs.existsSync(kaynak)) return { hata: 'Yedek bulunamadı' };

  let icerik;
  try {
    icerik = JSON.parse(fs.readFileSync(kaynak, 'utf8'));
  } catch (e) {
    return { hata: 'Yedek dosyası okunamadı: ' + e.message };
  }
  if (!icerik || !Array.isArray(icerik.users)) {
    return { hata: 'Yedek geçerli görünmüyor (kullanıcı listesi yok)' };
  }

  /* Yanlış yedeği yüklersen geri dönebilesin diye önce şimdiki hâli sakla. */
  try {
    fs.mkdirSync(YEDEK_KLASOR, { recursive: true });
    saveNow();
    fs.copyFileSync(DBF, path.join(YEDEK_KLASOR, 'yedek-elle-geri-alma-' + yedekAdi(new Date())));
  } catch (e) { /* kritik değil */ }

  try {
    fs.copyFileSync(kaynak, DBF);
  } catch (e) {
    return { hata: 'Yazılamadı: ' + e.message };
  }

  /* Belleği yeni veriyle tazele; açık oturumlar da yedekten gelir. */
  db = icerik;
  for (const k of ['users', 'schools', 'assignments', 'examGroups', 'exams',
    'parentLinks', 'teacherStudents', 'notifications', 'classes', 'lessons',
    'schedule', 'roles', 'mesajlar', 'devamsizlik', 'islemKaydi', 'takvim', 'egitimYillari']) {
    if (!Array.isArray(db[k])) db[k] = [];
  }
  if (!db.sessions || typeof db.sessions !== 'object') db.sessions = {};
  if (!db.hatirlatmalar || typeof db.hatirlatmalar !== 'object') db.hatirlatmalar = {};

  return { ad: guvenli, kullanici: db.users.length };
}

/* ============ otomatik hatırlatmalar ============
   Belirli aralıklarla çalışır:
     - dersten kısa süre önce öğretmene haber
     - ödevin son gününe bir gün kala öğrenciye haber
   Aynı hatırlatma iki kez gitmesin diye gönderilenler db.hatirlatmalar'da
   anahtarla işaretlenir, eskiyenler temizlenir. */

const DERS_ONCESI_DK = 15;        // ders başlamadan kaç dakika önce
const HATIRLATMA_ARALIK_MS = 5 * 60 * 1000;

function yerelTarihAnahtari(d) {
  const p = n => (n < 10 ? '0' : '') + n;
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

function hatirlatildiMi(anahtar) { return !!db.hatirlatmalar[anahtar]; }
function hatirlatildi(anahtar) { db.hatirlatmalar[anahtar] = Date.now(); }

function dersHatirlatmalari(simdi) {
  /* JS'te 0 Pazar; bizde 1 Pazartesi .. 7 Pazar */
  const gun = simdi.getDay() === 0 ? 7 : simdi.getDay();
  const suAn = simdi.getHours() * 60 + simdi.getMinutes();
  const bugun = yerelTarihAnahtari(simdi);
  let sayi = 0;

  for (const sp of db.schedule) {
    if (sp.day !== gun) continue;
    const bas = saatDakika(sp.start);
    if (bas === null) continue;

    const kalan = bas - suAn;
    if (kalan < 0 || kalan > DERS_ONCESI_DK) continue;

    const l = lessonById(sp.lessonId);
    if (!l || !l.teacherId) continue;

    const anahtar = 'ders:' + sp.id + ':' + bugun;
    if (hatirlatildiMi(anahtar)) continue;

    const c = classById(sp.classId);
    notify(l.teacherId,
      '' + (c ? c.name : '') + ' ' + l.subject + ' dersin ' + sp.start + '\'te başlıyor.');
    hatirlatildi(anahtar);
    sayi++;
  }
  return sayi;
}

function odevHatirlatmalari(simdi) {
  const yarin = new Date(simdi.getTime() + 24 * 60 * 60 * 1000);
  const yarinAnahtar = yerelTarihAnahtari(yarin);
  let sayi = 0;

  for (const a of db.assignments) {
    if (a.status !== 'active' || !a.endAt) continue;
    /* endAt "YYYY-MM-DD" ya da tam tarih olabilir; ilk 10 karakter yeterli. */
    if (String(a.endAt).slice(0, 10) !== yarinAnahtar) continue;

    for (const sid of a.studentIds) {
      /* Ödevi zaten sonuçlanmış öğrenciye hatırlatma gitmesin. */
      if (a.results && a.results[sid]) continue;
      const anahtar = 'odev:' + a.id + ':' + sid;
      if (hatirlatildiMi(anahtar)) continue;
      notify(sid, '"' + a.title + '" ödevinin son günü yarın.');
      hatirlatildi(anahtar);
      sayi++;
    }
  }
  return sayi;
}

function hatirlatmalariCalistir() {
  try {
    const simdi = new Date();
    const a = dersHatirlatmalari(simdi);
    const b = odevHatirlatmalari(simdi);

    /* 30 günden eski işaretleri at, sözlük şişmesin. */
    const sinir = Date.now() - 30 * 24 * 60 * 60 * 1000;
    let temizlenen = 0;
    for (const k of Object.keys(db.hatirlatmalar)) {
      if (db.hatirlatmalar[k] < sinir) { delete db.hatirlatmalar[k]; temizlenen++; }
    }
    if (a || b || temizlenen) save();
  } catch (e) {
    console.error('Hatırlatma hatası:', e.message);
  }
}

/* ============ http yardımcıları ============ */
/* Her yanitta gonderilen guvenlik basliklari.
   CSP: sayfa yalnizca kendi sunucusundan betik/stil yukler, disari veri gonderemez.
   Satir ici style="" nitelikleri kullanildigi icin style-src'de unsafe-inline var;
   script-src'de YOK, yani enjekte edilen bir <script> calismaz. */
const GUVENLIK_BASLIKLARI = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "connect-src 'self'"
  ].join('; ')
};

function baslikEkle(hedef) {
  for (const k in GUVENLIK_BASLIKLARI) hedef[k] = GUVENLIK_BASLIKLARI[k];
  return hedef;
}

/* ============ sıkıştırma ve önbellek ============

   Arayüz dosyaları toplam ~300 KB; gzip ile ~70 KB'a iniyor. Telefon
   bağlantısında bu, açılışın saniyelerce beklemesiyle anında açılması
   arasındaki fark. Statik dosyalar çalışma sırasında değişmediği için
   bir kez sıkıştırılıp bellekte tutuluyor. */

const SIKISTIRMA_ESIGI = 1024;   // bu boyutun altını sıkıştırmaya değmez
const SIKISTIRILABILIR = /^(text\/|application\/(javascript|json|manifest))/;

/* Tarayıcı hangi sıkıştırmayı kabul ediyor? */
function kodlamaSec(req) {
  const kabul = String((req && req.headers && req.headers['accept-encoding']) || '')
    .toLowerCase();
  if (kabul.indexOf('br') >= 0) return 'br';
  if (kabul.indexOf('gzip') >= 0) return 'gzip';
  return '';
}

/* Statik dosya önbelleği: dosya yolu -> { veri, gzip, br, etag, tur } */
const statikOnbellek = new Map();

function statikOku(tamYol, geri) {
  fs.stat(tamYol, (hata, st) => {
    if (hata) return geri(hata);
    const imza = st.mtimeMs + ':' + st.size;
    const eski = statikOnbellek.get(tamYol);
    if (eski && eski.imza === imza) return geri(null, eski);

    fs.readFile(tamYol, (hata2, veri) => {
      if (hata2) return geri(hata2);
      const tur = MIME[path.extname(tamYol).toLowerCase()] || 'application/octet-stream';
      const kayit = {
        imza: imza, veri: veri, tur: tur,
        etag: '"' + crypto.createHash('sha1').update(veri).digest('hex').slice(0, 20) + '"',
        gzip: null, br: null
      };
      if (SIKISTIRILABILIR.test(tur) && veri.length > SIKISTIRMA_ESIGI) {
        try {
          kayit.gzip = zlib.gzipSync(veri, { level: 6 });
          kayit.br = zlib.brotliCompressSync(veri, {
            params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 }
          });
        } catch (e) {
          /* Sıkıştırma başarısız olursa ham hâli gönderilir, sorun değil. */
        }
      }
      statikOnbellek.set(tamYol, kayit);
      geri(null, kayit);
    });
  });
}

function sendJSON(res, code, obj) {
  let body = Buffer.from(JSON.stringify(obj), 'utf8');
  const baslik = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  };

  /* Küçük yanıtlarda sıkıştırma kazançtan çok işlemci harcar. */
  if (body.length > SIKISTIRMA_ESIGI) {
    const kod = kodlamaSec(res.req);
    try {
      if (kod === 'br') {
        body = zlib.brotliCompressSync(body, {
          params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 }
        });
        baslik['Content-Encoding'] = 'br';
      } else if (kod === 'gzip') {
        body = zlib.gzipSync(body, { level: 6 });
        baslik['Content-Encoding'] = 'gzip';
      }
      if (baslik['Content-Encoding']) baslik['Vary'] = 'Accept-Encoding';
    } catch (e) {
      /* Sıkıştırılamadıysa ham gönder. */
    }
  }

  baslik['Content-Length'] = body.length;
  res.writeHead(code, baslikEkle(baslik));
  res.end(body);
}
const ok = (res, obj) => sendJSON(res, 200, obj === undefined ? { ok: true } : obj);
const bad = (res, msg, code) => sendJSON(res, code || 400, { error: msg });

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > 2e6) {
        /* Bağlantıyı hemen koparırsak istemci "413" yanıtını göremeden
           ağ hatası alıyor. Akışı durdurup yanıtın yazılmasına fırsat
           veriyoruz, sonra kapatıyoruz. */
        const e = new Error('İstek çok büyük');
        e.kod = 413;
        reject(e);
        try { req.pause(); } catch (x) { /* yoksay */ }
        setTimeout(() => { try { req.destroy(); } catch (x) { /* yoksay */ } }, 1500);
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try { resolve(govdeTemizle(JSON.parse(raw))); } catch (e) { reject(new Error('Geçersiz veri gönderildi')); }
    });
    req.on('error', reject);
  });
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json'
};

function serveStatic(req, res, urlPath) {
  let rel;
  try { rel = decodeURIComponent(urlPath.split('?')[0]); } catch (e) { rel = '/'; }
  if (rel === '/' || rel === '') rel = '/index.html';
  const full = path.join(PUB, path.normalize(rel).replace(/^(\.\.[\\/])+/, ''));
  /* Sadece startsWith(PUB) yetmez: "public" ile "publicgizli" de eslesirdi. */
  if (full !== PUB && !full.startsWith(PUB + path.sep)) return bad(res, 'Yasak', 403);
  statikOku(full, (err, kayit) => {
    /* Dosya yoksa tek sayfalık uygulamanın kabuğunu döndür — adres
       çubuğuna doğrudan #/sayfa yazılınca da açılsın. */
    if (err) {
      return statikOku(path.join(PUB, 'index.html'), (e2, kabuk) => {
        if (e2) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('Bulunamadı');
        }
        statikGonder(req, res, kabuk);
      });
    }
    statikGonder(req, res, kayit);
  });
}

function statikGonder(req, res, kayit) {
  /* Tarayıcıda aynı sürüm varsa gövdeyi hiç göndermiyoruz. */
  if (req.headers['if-none-match'] === kayit.etag) {
    res.writeHead(304, baslikEkle({
      'ETag': kayit.etag,
      'Cache-Control': 'no-cache'
    }));
    return res.end();
  }

  const baslik = {
    'Content-Type': kayit.tur,
    'Cache-Control': 'no-cache',
    'ETag': kayit.etag
  };

  let govde = kayit.veri;
  const kod = kodlamaSec(req);
  if (kod === 'br' && kayit.br) { govde = kayit.br; baslik['Content-Encoding'] = 'br'; }
  else if (kod === 'gzip' && kayit.gzip) { govde = kayit.gzip; baslik['Content-Encoding'] = 'gzip'; }
  if (baslik['Content-Encoding']) baslik['Vary'] = 'Accept-Encoding';

  baslik['Content-Length'] = govde.length;
  res.writeHead(200, baslikEkle(baslik));
  res.end(govde);
}

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

const isTeacherLike = u => !!u && (u.role === 'teacher' || u.role === 'principal');

/* Öğretmenin ödev verebileceği öğrenciler:
   doğrudan atanmışlar + ders verdiği sınıflardaki herkes.
   Sınıf düzeni geldiğinden beri ikincisi asıl yol. */
function ogretmeninOgrencileri(u) {
  if (!u) return [];
  if (u.role === 'principal') {
    return db.users.filter(x => x.role === 'student' && x.schoolId === u.schoolId);
  }
  const bulunan = new Map();
  for (const s of studentsOfTeacher(u.id)) bulunan.set(s.id, s);
  for (const l of db.lessons) {
    if (l.teacherId !== u.id) continue;
    for (const s of sinifOgrencileri(l.classId)) bulunan.set(s.id, s);
  }
  return Array.from(bulunan.values());
}

/* Öğretmenin ders verdiği sınıflar (müdürde okulun tamamı). */
function ogretmeninSiniflari(u) {
  if (!u) return [];
  if (u.role === 'principal') {
    return db.classes.filter(c => c.schoolId === u.schoolId);
  }
  const idler = new Set(db.lessons.filter(l => l.teacherId === u.id).map(l => l.classId));
  /* Doğrudan atanmış öğrencilerin sınıfları da girsin. */
  for (const s of studentsOfTeacher(u.id)) if (s.classId) idler.add(s.classId);
  return db.classes.filter(c => idler.has(c.id));
}

/* Öğretmenin öğrencileri ders verdiği sınıflardan geliyor. Müdür derse
   öğretmen atayınca ilişki kendiliğinden kuruluyor; ayrıca öğrenci-öğretmen
   eşleştirmesi diye bir iş yok. Eski elle atamalar da sayılır ki geçmiş
   kayıtları olan okullarda sınav notları kaybolmasın. */
function studentsOfTeacher(teacherId) {
  const bulunan = new Map();
  for (const l of db.lessons) {
    if (l.teacherId !== teacherId) continue;
    for (const s of sinifOgrencileri(l.classId)) bulunan.set(s.id, s);
  }
  for (const l of db.teacherStudents) {
    if (l.teacherId !== teacherId) continue;
    const s = userById(l.studentId);
    if (s && s.role === 'student') bulunan.set(s.id, s);
  }
  return Array.from(bulunan.values())
    .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'));
}
/* Öğrencinin öğretmenleri sınıfındaki derslerden türetiliyor: müdür derse
   öğretmen atayınca ilişki kendiliğinden kuruluyor, ayrıca öğrenci-öğretmen
   eşleştirmesi yapmak gerekmiyor. Eski elle atamalar varsa onlar da sayılır. */
function teachersOfStudent(studentId) {
  const st = userById(studentId);
  const idler = [];

  if (st && st.classId) {
    for (const l of db.lessons) {
      if (l.classId === st.classId && l.teacherId && idler.indexOf(l.teacherId) < 0) {
        idler.push(l.teacherId);
      }
    }
  }
  for (const l of db.teacherStudents) {
    if (l.studentId === studentId && idler.indexOf(l.teacherId) < 0) {
      idler.push(l.teacherId);
    }
  }
  return idler.map(id => userById(id)).filter(u => u && u.status === 'approved');
}
function branchOf(u) { return u.role === 'principal' ? (u.branch || 'Müdür') : (u.branch || ''); }

function canSeeStudent(viewer, studentId) {
  if (!viewer) return false;
  if (viewer.role === 'admin') return true;
  if (viewer.id === studentId) return true;
  if (viewer.role === 'parent') return db.parentLinks.some(l => l.parentId === viewer.id && l.studentId === studentId);
  const st = userById(studentId);
  if (!st) return false;
  if (viewer.role === 'principal') return st.schoolId === viewer.schoolId;
  if (viewer.role === 'teacher') return teachersOfStudent(studentId).some(t => t.id === viewer.id);
  return false;
}

/* ============ ilerleyiş hesabı ============ */
function progressOf(studentId, bakan) {
  const st = userById(studentId);
  if (!st) return null;

  /* --- ödevler ---
     Bakan kişi belliyse onun seçtiği eğitim yılına göre süzülür;
     geçmiş yıla bakan veli o yılın ödevlerini görür. */
  const mine = yilSuz(bakan || st, db.assignments
    .filter(a => a.studentIds.indexOf(studentId) >= 0))
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  const bySubject = {};
  const assignmentList = [];
  for (const a of mine) {
    const t = userById(a.teacherId);
    const r = a.results ? a.results[studentId] : null;
    assignmentList.push({
      id: a.id, title: a.title, description: a.description, subject: a.subject,
      startAt: a.startAt, endAt: a.endAt, endTime: odevSaati(a), status: a.status,
      teacherName: t ? t.fullName : 'Bilinmiyor',
      result: a.status === 'finished' ? (r || null) : null
    });
    if (a.status !== 'finished') continue;
    if (!bySubject[a.subject]) {
      bySubject[a.subject] = { subject: a.subject, yapti: 0, yapmadi: 0,
        eksik: 0, izinli: 0, gelmedi: 0, toplam: 0 };
    }
    const row = bySubject[a.subject];
    if (r && RESULT_TYPES.indexOf(r) >= 0) { row[r]++; row.toplam++; }
  }
  for (const k in bySubject) {
    const r = bySubject[k];
    /* İzinli gelmemek oranı düşürmez; izinsiz gelmemek düşürür. */
    const sayilan = r.yapti + r.yapmadi + r.eksik + r.gelmedi;
    r.oran = sayilan > 0 ? Math.round((r.yapti + r.eksik * 0.5) / sayilan * 100) : null;
  }

  /* --- sınavlar --- */
  const groups = [];
  for (const g of db.examGroups) {
    const exams = db.exams.filter(e => e.groupId === g.id);
    if (!exams.length) continue;
    const linked = db.teacherStudents.some(l => l.teacherId === g.teacherId && l.studentId === studentId);
    const rows = [];
    let wsum = 0, wtot = 0, hasAny = false;
    for (const e of exams) {
      const has = e.grades && Object.prototype.hasOwnProperty.call(e.grades, studentId);
      const grade = has ? e.grades[studentId] : null;
      rows.push({ id: e.id, name: e.name, weight: e.weight, grade });
      if (has && grade !== null && !isNaN(grade)) {
        hasAny = true;
        wsum += Number(grade) * Number(e.weight);
        wtot += Number(e.weight);
      }
    }
    if (!linked && !hasAny) continue;
    const t = userById(g.teacherId);
    groups.push({
      id: g.id, name: g.name, subject: g.subject,
      teacherName: t ? t.fullName : 'Bilinmiyor',
      exams: rows,
      average: wtot > 0 ? Math.round(wsum / wtot * 100) / 100 : null
    });
  }

  return {
    student: pub(st),
    assignments: assignmentList,
    subjects: Object.keys(bySubject).map(k => bySubject[k]).sort((a, b) => a.subject.localeCompare(b.subject, 'tr')),
    examGroups: groups
  };
}

/* ============ yetkiler ve özel roller ============
   Müdür kendi rol adını koyar (ör. "Müdür Yardımcısı", "Rehber Öğretmen") ve
   yetkilerini tek tek seçer. Rol, temel rolü "teacher" olan kişilere verilir;
   temel rol değişmez, üstüne yetki eklenir.

   Müdürün kendisi bütün yetkilere sahiptir ve bu değiştirilemez — okulda
   her şeyi yapabilen en az bir kişi kalmalı. */

const YETKILER = [
  { grup: 'Ders ve program', liste: [
    { k: 'derse-atanabilir', ad: 'Derse öğretmen olarak atanabilir',
      kapsam: ['ders'], aciklama: 'Hangi derslere atanabileceğini seç.' },
    { k: 'program.duzenle', ad: 'Ders programını düzenler', kapsam: ['sinif'] },
    { k: 'ders.yonet', ad: 'Sınıfa ders ekler ve çıkarır', kapsam: ['sinif'] },
    { k: 'ders.ogretmen-ata', ad: 'Derse öğretmen atar', kapsam: ['ders', 'sinif'] }
  ]},
  { grup: 'Sınıf ve öğrenci', liste: [
    { k: 'sinif.yonet', ad: 'Sınıf açar ve siler' },
    { k: 'ogrenci.yerlestir', ad: 'Öğrenciyi sınıfa yerleştirir', kapsam: ['sinif'] },
    { k: 'ogrenci.hesap-ac', ad: 'Öğrenci hesabı açar' },
    { k: 'ogrenci.duzenle', ad: 'Öğrenci bilgilerini düzenler' },
    { k: 'ogrenci.sifre', ad: 'Öğrenci şifresi sıfırlar',
      aciklama: 'Hassas yetki — dikkatli ver.' },
    { k: 'ogrenci.portal', ad: 'Öğrenci portalına girer',
      aciklama: 'Öğrencinin gördüğü ekranı birebir açar.' }
  ]},
  { grup: 'Öğretmenler', liste: [
    { k: 'ogretmen.onayla', ad: 'Öğretmen başvurusu onaylar' },
    { k: 'ogretmen.duzenle', ad: 'Öğretmen bilgisi ve branşını düzenler' },
    { k: 'ogretmen.cikar', ad: 'Öğretmeni okuldan çıkarır' }
  ]},
  { grup: 'Ödev ve sınav', liste: [
    { k: 'odev.ver', ad: 'Ödev verir', kapsam: ['ders', 'sinif'] },
    { k: 'odev.sonuclandir', ad: 'Ödev sonuçlandırır', kapsam: ['ders'] },
    { k: 'sinav.olustur', ad: 'Sınav oluşturur', kapsam: ['ders', 'sinif'] },
    { k: 'sinav.not-gir', ad: 'Sınav notu girer', kapsam: ['ders', 'sinif'] }
  ]},
  { grup: 'Devamsızlık', liste: [
    { k: 'devamsizlik.al', ad: 'Yoklama alır', kapsam: ['ders', 'sinif'] },
    { k: 'devamsizlik.gor', ad: 'Okulun tüm devamsızlığını görür' }
  ]},
  { grup: 'Mesajlaşma', liste: [
    { k: 'mesaj.toplu', ad: 'Sınıfa veya gruba toplu mesaj atar' },
    { k: 'mesaj.herkese', ad: 'Okuldaki herkese mesaj atar' }
  ]},
  { grup: 'Yönetim', liste: [
    { k: 'rol.yonet', ad: 'Rol oluşturur ve düzenler',
      aciklama: 'Bu yetkiyi verdiğin kişi başkalarına yetki dağıtabilir.' },
    { k: 'islem-kaydi.gor', ad: 'İşlem kaydını görür' },
    { k: 'takvim.yonet', ad: 'Okul takvimine etkinlik ve tatil ekler' },
    { k: 'yil.yonet', ad: 'Eğitim yılı açar ve değiştirir',
      aciklama: 'Yeni yıl açınca eski yılın kayıtları arşive düşer.' },
    { k: 'yedek.al', ad: 'Yedek alır ve geri yükler' },
    { k: 'aktarim.yap', ad: 'Excel ile içe ve dışa aktarım yapar',
      aciklama: 'Öğrenci listesi ve ders programını Excel dosyasıyla toplu işler.' }
  ]}
];

/* Düz liste: doğrulama için */
const TUM_YETKILER = YETKILER.reduce((a, g) => a.concat(g.liste.map(x => x.k)), []);

/* Öğretmenin rolsüz de sahip olduğu yetkiler. */
const OGRETMEN_VARSAYILAN = [
  'derse-atanabilir', 'odev.ver', 'odev.sonuclandir', 'sinav.not-gir', 'devamsizlik.al'
];

const roleById = id => byId(db.roles, id);

/* Gelen kapsam nesnesini doğrular: sadece açık olan yetkiler, gerçek dersler
   ve okulun kendi sınıfları kalır. "*" hepsi demektir. */
function kapsamTemizle(gelen, izinler, schoolId) {
  const temiz = {};
  if (!gelen || typeof gelen !== 'object') return temiz;

  const sinifIdler = db.classes.filter(c => c.schoolId === schoolId).map(c => c.id);

  for (const izin of izinler) {
    const k = gelen[izin];
    if (!k || typeof k !== 'object') continue;

    const dersler = Array.isArray(k.dersler)
      ? k.dersler.map(String).filter(x => x === '*' || SUBJECTS.indexOf(x) >= 0)
      : [];
    const siniflar = Array.isArray(k.siniflar)
      ? k.siniflar.map(String).filter(x => x === '*' || sinifIdler.indexOf(x) >= 0)
      : [];

    /* Hepsi seçiliyse kapsam yazmaya gerek yok. */
    const dersHepsi = !dersler.length || dersler.indexOf('*') >= 0;
    const sinifHepsi = !siniflar.length || siniflar.indexOf('*') >= 0;
    if (dersHepsi && sinifHepsi) continue;

    temiz[izin] = {
      dersler: dersHepsi ? ['*'] : dersler,
      siniflar: sinifHepsi ? ['*'] : siniflar
    };
  }
  return temiz;
}

function kullaniciYetkileri(u) {
  if (!u) return [];
  if (u.role === 'admin' || u.role === 'principal') return TUM_YETKILER.slice();
  if (u.role !== 'teacher') return [];
  const temel = OGRETMEN_VARSAYILAN.slice();
  const r = u.customRoleId ? roleById(u.customRoleId) : null;
  if (r && r.schoolId === u.schoolId) {
    for (const y of r.permissions || []) if (temel.indexOf(y) < 0) temel.push(y);
  }
  return temel;
}

/* Bir yetkinin ders/sınıf kapsamı. Rolde tanım yoksa "hepsi" demektir. */
function yetkiKapsami(u, izin) {
  if (!u || u.role !== 'teacher' || !u.customRoleId) return null;
  const r = roleById(u.customRoleId);
  if (!r || r.schoolId !== u.schoolId || !r.kapsam) return null;
  return r.kapsam[izin] || null;
}

/* baglam: { ders: 'Matematik', sinif: 'c_...' } — verilmezse sadece
   yetkinin açık olup olmadığına bakılır. */
function yetkiVarMi(u, izin, baglam) {
  if (!u || u.status !== 'approved') return false;
  if (u.role === 'admin' || u.role === 'principal') return true;
  if (kullaniciYetkileri(u).indexOf(izin) < 0) return false;

  if (!baglam) return true;
  const k = yetkiKapsami(u, izin);
  if (!k) return true;   /* kapsam yoksa sınırsız */

  if (baglam.ders && Array.isArray(k.dersler) && k.dersler.length &&
      k.dersler.indexOf('*') < 0 && k.dersler.indexOf(baglam.ders) < 0) {
    return false;
  }
  if (baglam.sinif && Array.isArray(k.siniflar) && k.siniflar.length &&
      k.siniflar.indexOf('*') < 0 && k.siniflar.indexOf(baglam.sinif) < 0) {
    return false;
  }
  return true;
}

function rolOzeti(r) {
  return {
    id: r.id, name: r.name,
    permissions: r.permissions || [],
    kapsam: r.kapsam || {},
    kisiSayisi: db.users.filter(u => u.customRoleId === r.id).length,
    createdAt: r.createdAt
  };
}

/* ============ sınıf / ders / program ============ */

const GUN_ADLARI = ['', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const GUN_SAYISI = 7;   // program Pazartesi'den Pazar'a kadar

/* Eski sabit "ders saati" düzeninden saat aralığına geçerken kullanılan
   varsayılan zil saatleri. Sadece eski kayıtları taşımak için. */
const ESKI_SAATLER = [
  null,
  ['09:00', '09:40'], ['09:50', '10:30'], ['10:40', '11:20'], ['11:30', '12:10'],
  ['13:00', '13:40'], ['13:50', '14:30'], ['14:40', '15:20'], ['15:30', '16:10'],
  ['16:20', '17:00'], ['17:10', '17:50'], ['18:00', '18:40'], ['18:50', '19:30'],
  ['19:40', '20:20'], ['20:30', '21:10']
];

const classById = id => byId(db.classes, id);
const lessonById = id => byId(db.lessons, id);

/* "09:20" -> 560 (gün başından beri geçen dakika). Geçersizse null. */
function saatDakika(metin) {
  const m = /^([0-9]{1,2}):([0-9]{2})$/.exec(String(metin || '').trim());
  if (!m) return null;
  const sa = parseInt(m[1], 10), dk = parseInt(m[2], 10);
  if (sa < 0 || sa > 23 || dk < 0 || dk > 59) return null;
  return sa * 60 + dk;
}

function saatDuzelt(metin) {
  const d = saatDakika(metin);
  if (d === null) return null;
  const sa = Math.floor(d / 60), dk = d % 60;
  return (sa < 10 ? '0' : '') + sa + ':' + (dk < 10 ? '0' : '') + dk;
}

/* İki aralık kesişiyor mu? Bitiş anı temas ediyorsa çakışma sayılmaz
   (10:00 biten ders ile 10:00 başlayan ders çakışmaz). */
function araliklarKesisiyor(bas1, bit1, bas2, bit2) {
  return bas1 < bit2 && bas2 < bit1;
}

function sinifOgrencileri(classId) {
  return db.users.filter(u => u.role === 'student' && u.classId === classId);
}

/* Bir dersin okunabilir adı: "7-A · Matematik" */
function dersEtiketi(l) {
  const c = classById(l.classId);
  return (c ? c.name : '?') + ' · ' + l.subject;
}

/* Programı gün ve başlangıç saatine göre sıralı döner. */
function programSirali(kayitlar) {
  return kayitlar.slice().sort((a, b) =>
    (a.day - b.day) || (saatDakika(a.start) - saatDakika(b.start)));
}

/* Çakışmalar:
   - aynı öğretmen aynı gün içinde kesişen saatlerde iki derste
   - aynı sınıf aynı gün içinde kesişen saatlerde iki derste           */
function cakismalariBul(schoolId) {
  const kayitlar = db.schedule.filter(sp => sp.schoolId === schoolId);
  const cakismalar = [];

  function ekle(tur, ad, a, b) {
    const la = lessonById(a.lessonId), lb = lessonById(b.lessonId);
    cakismalar.push({
      tur: tur,
      ad: ad,
      day: a.day,
      dayName: GUN_ADLARI[a.day] || ('Gün ' + a.day),
      saat: a.start + '-' + a.end + ' ↔ ' + b.start + '-' + b.end,
      lessons: [a, b].map((x, i) => {
        const l = i === 0 ? la : lb;
        const c = classById(x.classId);
        return {
          scheduleId: x.id,
          classId: x.classId,
          className: c ? c.name : '?',
          subject: l ? l.subject : '?',
          start: x.start, end: x.end
        };
      })
    });
  }

  for (let i = 0; i < kayitlar.length; i++) {
    for (let j = i + 1; j < kayitlar.length; j++) {
      const a = kayitlar[i], b = kayitlar[j];
      if (a.day !== b.day) continue;
      const ab = saatDakika(a.start), ae = saatDakika(a.end);
      const bb = saatDakika(b.start), be = saatDakika(b.end);
      if (ab === null || ae === null || bb === null || be === null) continue;
      if (!araliklarKesisiyor(ab, ae, bb, be)) continue;

      const la = lessonById(a.lessonId), lb = lessonById(b.lessonId);
      if (la && lb && la.teacherId && la.teacherId === lb.teacherId) {
        const t = userById(la.teacherId);
        ekle('ogretmen', t ? t.fullName : '(silinmiş öğretmen)', a, b);
      } else if (a.classId === b.classId) {
        const c = classById(a.classId);
        ekle('sinif', c ? c.name : '?', a, b);
      }
    }
  }

  cakismalar.sort((a, b) => (a.day - b.day) || a.saat.localeCompare(b.saat));
  return cakismalar;
}

/* Yeni bir aralık eklenmeden önce çakışma var mı diye bakar. */
function aralikCakismasi(schoolId, classId, teacherId, day, bas, bit, hariçId) {
  for (const sp of db.schedule) {
    if (sp.schoolId !== schoolId || sp.day !== day) continue;
    if (hariçId && sp.id === hariçId) continue;
    const sb = saatDakika(sp.start), se = saatDakika(sp.end);
    if (sb === null || se === null) continue;
    if (!araliklarKesisiyor(bas, bit, sb, se)) continue;

    const l = lessonById(sp.lessonId);
    if (sp.classId === classId) {
      return { tur: 'sinif', className: (classById(sp.classId) || {}).name || '?',
               subject: l ? l.subject : '?', start: sp.start, end: sp.end };
    }
    if (teacherId && l && l.teacherId === teacherId) {
      return { tur: 'ogretmen', className: (classById(sp.classId) || {}).name || '?',
               subject: l ? l.subject : '?', start: sp.start, end: sp.end };
    }
  }
  return null;
}

function dersOzeti(l) {
  const t = l.teacherId ? userById(l.teacherId) : null;
  const yerlesen = db.schedule.filter(sp => sp.lessonId === l.id).length;
  return {
    id: l.id, classId: l.classId, subject: l.subject,
    teacherId: l.teacherId || '',
    teacherName: t ? t.fullName : '',
    weeklyHours: l.weeklyHours || 0,
    placed: yerlesen
  };
}

function sinifOzeti(c) {
  const dersler = db.lessons.filter(l => l.classId === c.id);
  return {
    id: c.id, name: c.name,
    studentCount: sinifOgrencileri(c.id).length,
    lessonCount: dersler.length,
    /* Atanmamış ders sayısı: müdürün gözünden eksik iş */
    unassigned: dersler.filter(l => !l.teacherId).length
  };
}

function summarize(a) {
  if (a.status !== 'finished') return null;
  const s = { yapti: 0, yapmadi: 0, eksik: 0, izinli: 0, gelmedi: 0 };
  for (const id of a.studentIds) {
    const r = a.results[id];
    if (r && s[r] !== undefined) s[r]++;
  }
  return s;
}

function childrenOf(u) {
  if (!u || u.role !== 'parent') return [];
  return db.parentLinks.filter(l => l.parentId === u.id).map(l => {
    const s = userById(l.studentId);
    if (!s) return null;
    const sc = schoolById(s.schoolId);
    return { id: s.id, fullName: s.fullName, schoolName: sc ? sc.name : '', code: s.code };
  }).filter(Boolean);
}

/* ============ Excel aktarımı ============ */

/* Tek dosyada işlenecek en fazla satır. Toplu hesap açma şifre karması
   üretiyor; sınırsız bırakırsak tek istek sunucuyu uzun süre meşgul eder. */
const AKTARIM_SINIR = 300;

/* Gövde sınırı 2 MB ham JSON; base64 dosyayı üçte bir büyütüyor. */
const AKTARIM_DOSYA_SINIR = 1300000;

function xlsxGonder(res, veri, ad) {
  res.writeHead(200, baslikEkle({
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Length': veri.length,
    'Content-Disposition': 'attachment; filename="' + ad + '"',
    'Cache-Control': 'no-store'
  }));
  res.end(veri);
}

function gunTarih(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const i = n => (n < 10 ? '0' : '') + n;
  return i(d.getDate()) + '.' + i(d.getMonth() + 1) + '.' + d.getFullYear();
}

/* ============ API ============ */
async function handleApi(req, res, segs, method) {
  const me = currentUser(req);
  const body = (method === 'POST') ? await readBody(req) : {};
  const q = new URL(req.url, 'http://x').searchParams;
  const p = segs[1] || '';

  const need = roles => {
    if (!me) { bad(res, 'Giriş yapmalısın', 401); return false; }
    if (me.status !== 'approved') { bad(res, 'Hesabın henüz onaylanmadı', 403); return false; }
    if (roles && roles.indexOf(me.role) < 0) { bad(res, 'Bu işlem için yetkin yok', 403); return false; }
    return true;
  };

  /* ---- açık uçlar ---- */
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
  if (p === 'admin') {
    if (!need(['admin'])) return;
    const sub = segs[2] || '';
    if (sub === 'pending' && method === 'GET') {
      const list = db.users.filter(u => u.role === 'principal' && u.status === 'pending').map(u => {
        const s = schoolById(u.schoolId);
        return Object.assign(pub(u), { schoolName: s ? s.name : '' });
      });
      return ok(res, { principals: list });
    }
    if (sub === 'decide' && method === 'POST') {
      const u = userById(clean(body.userId, 60));
      if (!u || u.role !== 'principal') return bad(res, 'Müdür bulunamadı');
      const approve = !!body.approve;
      u.status = approve ? 'approved' : 'rejected';
      const s = schoolById(u.schoolId);
      if (s) s.status = approve ? 'approved' : 'rejected';
      notify(u.id, approve
        ? 'Müdürlük başvurun onaylandı. Artık okulunu yönetebilirsin.'
        : 'Müdürlük başvurun reddedildi.');
      save();
      return ok(res, { user: pub(u) });
    }
    /* ---------- yedekleme ---------- */

    if (sub === 'backups' && method === 'GET') {
      return ok(res, {
        yedekler: yedekListesi(),
        saklanan: YEDEK_SAKLA,
        klasor: YEDEK_KLASOR
      });
    }

    if (sub === 'backup-now' && method === 'POST') {
      const r = yedekAl(true);
      if (r.hata) return bad(res, r.hata, 500);
      return ok(res, { yedek: r, yedekler: yedekListesi() });
    }

    if (sub === 'backup-download' && method === 'GET') {
      const ad = String(q.get('ad') || '').replace(/[^a-zA-Z0-9._-]/g, '');
      if (!/^yedek-.*\.json$/.test(ad)) return bad(res, 'Geçersiz yedek adı');
      const dosya = path.join(YEDEK_KLASOR, ad);
      if (!fs.existsSync(dosya)) return bad(res, 'Yedek bulunamadı', 404);
      const veri = fs.readFileSync(dosya);
      res.writeHead(200, baslikEkle({
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': veri.length,
        'Content-Disposition': 'attachment; filename="' + ad + '"',
        'Cache-Control': 'no-store'
      }));
      return res.end(veri);
    }

    if (sub === 'backup-restore' && method === 'POST') {
      const r = yedekGeriYukle(body.ad);
      if (r.hata) return bad(res, r.hata);
      console.log('  ! Yedekten geri yüklendi: ' + r.ad);
      islemYaz(me, 'yedek.geri-yuklendi', r.ad, req);
      return ok(res, {
        message: r.ad + ' geri yüklendi. ' + r.kullanici + ' kullanıcı okundu.',
        yedekler: yedekListesi()
      });
    }

    if (sub === 'backup-delete' && method === 'POST') {
      const ad = String(body.ad || '').replace(/[^a-zA-Z0-9._-]/g, '');
      if (!/^yedek-.*\.json$/.test(ad)) return bad(res, 'Geçersiz yedek adı');
      const dosya = path.join(YEDEK_KLASOR, ad);
      if (!fs.existsSync(dosya)) return bad(res, 'Yedek bulunamadı', 404);
      fs.unlinkSync(dosya);
      return ok(res, { yedekler: yedekListesi() });
    }

    /* Tüm müdürler: görüntüleme ve gerekirse hesabı kaldırma. */
    if (sub === 'principals' && method === 'GET') {
      const liste = db.users
        .filter(u => u.role === 'principal')
        .map(u => {
          const sc = schoolById(u.schoolId);
          return {
            id: u.id, fullName: u.fullName, email: u.email, status: u.status,
            city: u.city, district: u.district,
            schoolName: sc ? sc.name : '(okul yok)',
            schoolStatus: sc ? sc.status : '',
            teachers: db.users.filter(x => x.role === 'teacher' && x.schoolId === u.schoolId).length,
            students: db.users.filter(x => x.role === 'student' && x.schoolId === u.schoolId).length,
            createdAt: u.createdAt
          };
        })
        .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'));
      return ok(res, { principals: liste });
    }

    if (sub === 'principal-delete' && method === 'POST') {
      const u = userById(clean(body.userId, 60));
      if (!u || u.role !== 'principal') return bad(res, 'Müdür bulunamadı');

      /* Okulu silmiyoruz: öğretmen ve öğrenciler duruyor. Okul "beklemede"ye
         çekiliyor ki yeni kayıt alınmasın, sonra yeni müdür başvurabilsin. */
      const sc = schoolById(u.schoolId);
      if (sc) sc.status = 'pending';

      for (const tok of Object.keys(db.sessions)) {
        if (db.sessions[tok].userId === u.id) delete db.sessions[tok];
      }
      db.users = db.users.filter(x => x.id !== u.id);
      db.notifications = db.notifications.filter(n => n.userId !== u.id);
      save();
      return ok(res, { silinen: u.fullName, okul: sc ? sc.name : '' });
    }

    if (sub === 'overview' && method === 'GET') {
      return ok(res, {
        stats: {
          okul: db.schools.filter(s => s.status === 'approved').length,
          mudur: db.users.filter(u => u.role === 'principal' && u.status === 'approved').length,
          ogretmen: db.users.filter(u => u.role === 'teacher' && u.status === 'approved').length,
          ogrenci: db.users.filter(u => u.role === 'student').length,
          veli: db.users.filter(u => u.role === 'parent').length,
          bekleyen: db.users.filter(u => u.role === 'principal' && u.status === 'pending').length
        },
        schools: db.schools.map(s => {
          const pr = db.users.find(u => u.role === 'principal' && u.schoolId === s.id);
          return {
            id: s.id, name: s.name, city: s.city, district: s.district, status: s.status,
            principal: pr ? pr.fullName : '-',
            students: db.users.filter(u => u.role === 'student' && u.schoolId === s.id).length,
            teachers: db.users.filter(u => u.role === 'teacher' && u.schoolId === s.id && u.status === 'approved').length
          };
        })
      });
    }
  }

  /* ---- müdür ---- */
  if (p === 'school') {
    /* Bu bölüme müdür ve özel rolü olan öğretmenler girer; her uç kendi
       yetkisini ayrıca kontrol eder. */
    if (!need(null)) return;
    if (me.role !== 'principal' && me.role !== 'teacher') return bad(res, 'Yetkin yok', 403);
    const sub = segs[2] || '';

    /* Bu uç için gereken yetki yoksa durdur. */
    const yetkiGerek = (izin, baglam) => {
      if (yetkiVarMi(me, izin, baglam)) return true;
      bad(res, baglam
        ? 'Bu ders ya da sınıf için yetkin yok'
        : 'Bu işlem için yetkin yok', 403);
      return false;
    };

    /* ---------- Excel içe ve dışa aktarım ---------- */

    if (sub === 'aktarim-sablon' && method === 'GET') {
      if (!yetkiGerek('aktarim.yap')) return;
      const tur = clean(q.get('tur'), 20);
      if (tur !== 'ogrenci' && tur !== 'program') return bad(res, 'Bilinmeyen şablon');
      let veri;
      try { veri = aktarim.sablon(tur); }
      catch (e) { return bad(res, 'Şablon üretilemedi: ' + e.message, 500); }
      return xlsxGonder(res, veri,
        (tur === 'ogrenci' ? 'ogrenci-listesi' : 'ders-programi') + '-sablon.xlsx');
    }

    if (sub === 'aktarim-disa' && method === 'GET') {
      if (!yetkiGerek('aktarim.yap')) return;
      const tur = clean(q.get('tur'), 20);
      const okulSinif = db.classes.filter(c => c.schoolId === me.schoolId);
      const sinifAdi = id => {
        const c = okulSinif.find(x => x.id === id);
        return c ? c.name : '';
      };

      if (tur === 'ogrenci') {
        const satirlar = db.users
          .filter(u => u.role === 'student' && u.schoolId === me.schoolId)
          .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'))
          .map(u => [u.fullName, u.email, sinifAdi(u.classId), u.code,
            u.note || '', gunTarih(u.createdAt)]);
        return xlsxGonder(res, aktarim.disa('Öğrenciler',
          ['Ad Soyad', 'Kullanıcı adı (e-posta)', 'Sınıf', 'Giriş kodu',
            'Müdür notu', 'Kayıt tarihi'],
          satirlar, [26, 30, 10, 14, 30, 14]), 'ogrenciler.xlsx');
      }

      if (tur === 'ogretmen') {
        const satirlar = db.users
          .filter(u => u.role === 'teacher' && u.schoolId === me.schoolId &&
            u.status === 'approved')
          .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'))
          .map(u => {
            const dersleri = db.lessons.filter(l => l.teacherId === u.id);
            const dersAd = [];
            const sinifAd = [];
            for (const l of dersleri) {
              if (dersAd.indexOf(l.subject) < 0) dersAd.push(l.subject);
              const sn = sinifAdi(l.classId);
              if (sn && sinifAd.indexOf(sn) < 0) sinifAd.push(sn);
            }
            return [u.fullName, u.email, branchOf(u), dersAd.join(', '),
              sinifAd.join(', '), gunTarih(u.createdAt)];
          });
        return xlsxGonder(res, aktarim.disa('Öğretmenler',
          ['Ad Soyad', 'E-posta', 'Branş', 'Verdiği dersler', 'Sınıflar',
            'Kayıt tarihi'],
          satirlar, [26, 30, 18, 30, 20, 14]), 'ogretmenler.xlsx');
      }

      if (tur === 'program') {
        const satirlar = db.schedule
          .filter(sp => sp.schoolId === me.schoolId)
          .map(sp => {
            const l = byId(db.lessons, sp.lessonId);
            const t = l && l.teacherId ? userById(l.teacherId) : null;
            return {
              sinif: sinifAdi(sp.classId), gun: sp.day, bas: sp.start,
              satir: [sinifAdi(sp.classId), aktarim.GUNLER[sp.day] || '',
                sp.start, sp.end, l ? l.subject : '', t ? t.fullName : '']
            };
          })
          .sort((a, b) => a.sinif.localeCompare(b.sinif, 'tr') ||
            a.gun - b.gun || a.bas.localeCompare(b.bas))
          .map(x => x.satir);
        return xlsxGonder(res, aktarim.disa('Ders programı',
          ['Sınıf', 'Gün', 'Başlangıç', 'Bitiş', 'Ders', 'Öğretmen'],
          satirlar, [12, 12, 12, 12, 22, 24]), 'ders-programi.xlsx');
      }

      return bad(res, 'Bilinmeyen aktarım türü');
    }

    /* İçe aktarım iki adımlı: uygula=false ise ne olacağını anlatan bir
       rapor döner, uygula=true ise aynı dosya baştan çözümlenip işlenir.
       Önizlemeye güvenmiyoruz — her iki adımda da tüm denetimler tekrar
       çalışıyor, arada veri değişmiş olabilir. */
    if (sub === 'aktarim-ice' && method === 'POST') {
      if (!yetkiGerek('aktarim.yap')) return;
      const tur = clean(body.tur, 20);
      if (tur !== 'ogrenci' && tur !== 'program') return bad(res, 'Bilinmeyen aktarım türü');
      if (tur === 'ogrenci' && !yetkiGerek('ogrenci.hesap-ac')) return;

      const b64 = String(body.dosya || '');
      if (!b64) return bad(res, 'Dosya seçilmedi');
      if (b64.length > AKTARIM_DOSYA_SINIR) {
        return bad(res, 'Dosya çok büyük. Listeyi bölüp iki dosya hâlinde yükle.');
      }

      const ham = Buffer.from(b64, 'base64');
      if (ham.length < 100) return bad(res, 'Dosya boş ya da bozuk görünüyor');

      let sayfalar;
      try { sayfalar = xlsx.oku(ham); }
      catch (e) { return bad(res, e.message); }

      let cozum;
      try { cozum = aktarim.coz(tur, sayfalar); }
      catch (e) { return bad(res, e.message); }

      const rapor = cozum.hatalar.map(h => ({
        satir: h.satir, ad: '', durum: 'hata', mesaj: h.mesaj
      }));
      const hazir = [];
      const okulSinif = db.classes.filter(c => c.schoolId === me.schoolId);
      const sinifBul = ad => okulSinif.find(x =>
        aktarim.anahtarla(x.name) === aktarim.anahtarla(ad));

      /* ----- öğrenci listesi ----- */
      if (tur === 'ogrenci') {
        const gorulen = {};
        for (const k of cozum.kayitlar) {
          const sorun = [];
          const ad = clean(k.ad, 80);
          if (ad.split(/\s+/).filter(Boolean).length < 2) sorun.push('Ad ve soyad gerekli');

          const eposta = normEmail(k.eposta);
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(eposta)) {
            sorun.push('Kullanıcı adı e-posta biçiminde değil');
          } else if (db.users.some(u => u.email === eposta)) {
            sorun.push('Bu kullanıcı adı zaten kayıtlı');
          } else if (gorulen[eposta]) {
            sorun.push('Bu kullanıcı adı dosyada ' + gorulen[eposta] + '. satırda da var');
          }

          const ps = sifreSorunu(k.sifre);
          if (ps) sorun.push(ps);

          let classId = '';
          if (k.sinif) {
            const c = sinifBul(k.sinif);
            if (!c) sorun.push('"' + k.sinif + '" adında bir sınıf yok');
            else classId = c.id;
          }

          if (sorun.length) {
            rapor.push({ satir: k.satir, ad: k.ad, durum: 'hata', mesaj: sorun.join('; ') });
            continue;
          }
          gorulen[eposta] = k.satir;
          hazir.push({ satir: k.satir, ad, eposta, sifre: k.sifre, classId });
          rapor.push({
            satir: k.satir, ad: ad, durum: 'hazir',
            mesaj: 'Hesap açılacak' + (k.sinif ? ' — ' + k.sinif : ' — sınıfsız')
          });
        }

        if (!body.uygula) {
          return ok(res, {
            onizleme: true, tur, hazir: hazir.length,
            hatali: rapor.filter(r => r.durum === 'hata').length,
            sinir: AKTARIM_SINIR, rapor: rapor.sort((a, b) => a.satir - b.satir)
          });
        }

        if (!hazir.length) return bad(res, 'Açılacak hesap yok — dosyadaki satırların hepsi hatalı.');
        if (hazir.length > AKTARIM_SINIR) {
          return bad(res, 'Tek seferde en fazla ' + AKTARIM_SINIR +
            ' hesap açılabilir. Dosyada ' + hazir.length + ' geçerli satır var.');
        }

        /* Şifre karmaları paralel üretiliyor; tek tek beklersek 300 satır
           dakikalar sürer. */
        const karmalar = await Promise.all(hazir.map(h => hashPw(String(h.sifre))));

        const acilan = [];
        for (let i = 0; i < hazir.length; i++) {
          const h = hazir[i];
          if (db.users.some(u => u.email === h.eposta)) continue;   /* yarış koruması */
          let code = makeCode();
          while (db.users.some(x => x.code === code)) code = makeCode();
          const u = {
            id: uid('u'), email: h.eposta, pass: karmalar[i], fullName: h.ad,
            role: 'student', status: 'approved', schoolId: me.schoolId,
            city: me.city, district: me.district, address: '',
            grade: '', classId: h.classId, code: code, note: '',
            createdBy: me.id, createdAt: now()
          };
          db.users.push(u);
          acilan.push({ ad: u.fullName, eposta: u.email, kod: u.code });
        }
        save();
        console.log('  Excel ile ' + acilan.length + ' öğrenci hesabı açıldı (' +
          me.email + ')');
        islemYaz(me, 'hesap.toplu-acildi', acilan.length + ' hesap', req);
        return ok(res, {
          uygulandi: true, acilan: acilan.length, ogrenciler: acilan,
          message: acilan.length + ' öğrenci hesabı açıldı.'
        });
      }

      /* ----- ders programı ----- */
      const eklenecek = [];
      const gorulenSaat = {};
      for (const k of cozum.kayitlar) {
        const c = sinifBul(k.sinif);
        if (!c) {
          rapor.push({ satir: k.satir, ad: k.sinif, durum: 'hata',
            mesaj: '"' + k.sinif + '" adında bir sınıf yok' });
          continue;
        }
        if (!yetkiVarMi(me, 'program.duzenle', { sinif: c.id })) {
          rapor.push({ satir: k.satir, ad: c.name, durum: 'hata',
            mesaj: c.name + ' sınıfının programını düzenleme yetkin yok' });
          continue;
        }

        const dersler = db.lessons.filter(l => l.classId === c.id);
        const l = dersler.find(x =>
          aktarim.anahtarla(x.subject) === aktarim.anahtarla(k.ders));
        if (!l) {
          rapor.push({ satir: k.satir, ad: c.name, durum: 'hata',
            mesaj: c.name + ' sınıfında "' + k.ders + '" dersi tanımlı değil' });
          continue;
        }

        const bd = saatDakika(k.baslangic), td = saatDakika(k.bitis);
        if (td <= bd) {
          rapor.push({ satir: k.satir, ad: c.name, durum: 'hata',
            mesaj: 'Bitiş saati başlangıçtan sonra olmalı' });
          continue;
        }
        if (td - bd > 8 * 60) {
          rapor.push({ satir: k.satir, ad: c.name, durum: 'hata',
            mesaj: 'Bir ders 8 saatten uzun olamaz' });
          continue;
        }

        const varOlan = db.schedule.some(sp => sp.schoolId === me.schoolId &&
          sp.classId === c.id && sp.lessonId === l.id && sp.day === k.gunNo &&
          sp.start === k.baslangic);
        if (varOlan) {
          rapor.push({ satir: k.satir, ad: c.name, durum: 'atlandi',
            mesaj: 'Bu ders saati zaten programda var' });
          continue;
        }

        const imza = c.id + '|' + k.gunNo + '|' + k.baslangic + '|' + l.id;
        if (gorulenSaat[imza]) {
          rapor.push({ satir: k.satir, ad: c.name, durum: 'atlandi',
            mesaj: 'Dosyada ' + gorulenSaat[imza] + '. satırda aynısı var' });
          continue;
        }
        gorulenSaat[imza] = k.satir;

        const uyari = aralikCakismasi(me.schoolId, c.id, l.teacherId,
          k.gunNo, bd, td, null);

        eklenecek.push({ satir: k.satir, c, l, gun: k.gunNo,
          bas: k.baslangic, bit: k.bitis });
        rapor.push({
          satir: k.satir, ad: c.name,
          durum: uyari ? 'uyari' : 'hazir',
          mesaj: aktarim.GUNLER[k.gunNo] + ' ' + k.baslangic + '-' + k.bitis +
            ' ' + l.subject + (uyari ? ' — dikkat: ' + uyari : '')
        });
      }

      if (!body.uygula) {
        return ok(res, {
          onizleme: true, tur, hazir: eklenecek.length,
          hatali: rapor.filter(r => r.durum === 'hata').length,
          uyarili: rapor.filter(r => r.durum === 'uyari').length,
          sinir: AKTARIM_SINIR, rapor: rapor.sort((a, b) => a.satir - b.satir)
        });
      }

      if (!eklenecek.length) return bad(res, 'Eklenecek ders saati yok.');
      if (eklenecek.length > AKTARIM_SINIR) {
        return bad(res, 'Tek seferde en fazla ' + AKTARIM_SINIR + ' ders saati eklenebilir.');
      }

      for (const e of eklenecek) {
        db.schedule.push({
          id: uid('p'), schoolId: me.schoolId, classId: e.c.id, lessonId: e.l.id,
          day: e.gun, start: e.bas, end: e.bit, yilId: yilDamgasi(me), createdAt: now()
        });
      }
      save();
      console.log('  Excel ile ' + eklenecek.length + ' ders saati eklendi (' +
        me.email + ')');
      islemYaz(me, 'program.toplu-eklendi', eklenecek.length + ' ders saati', req);
      return ok(res, {
        uygulandi: true, eklenen: eklenecek.length,
        cakismalar: cakismalariBul(me.schoolId),
        message: eklenecek.length + ' ders saati programa eklendi.'
      });
    }

    /* ---------- roller ---------- */

    if (sub === 'permissions' && method === 'GET') {
      return ok(res, { gruplar: YETKILER, ogretmenVarsayilan: OGRETMEN_VARSAYILAN });
    }

    if (sub === 'roles' && method === 'GET') {
      if (!yetkiGerek('rol.yonet')) return;
      return ok(res, {
        roles: db.roles.filter(r => r.schoolId === me.schoolId)
          .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
          .map(rolOzeti)
      });
    }

    if (sub === 'role' && method === 'POST') {
      if (!yetkiGerek('rol.yonet')) return;
      const ad = clean(body.name, 40);
      if (!ad) return bad(res, 'Rol adı gerekli');
      if (db.roles.some(r => r.schoolId === me.schoolId &&
        r.name.toLocaleLowerCase('tr') === ad.toLocaleLowerCase('tr'))) {
        return bad(res, 'Bu adda bir rol zaten var');
      }
      const izinler = (Array.isArray(body.permissions) ? body.permissions : [])
        .map(x => String(x)).filter(x => TUM_YETKILER.indexOf(x) >= 0);
      const r = {
        id: uid('r'), schoolId: me.schoolId, name: ad,
        permissions: izinler, kapsam: kapsamTemizle(body.kapsam, izinler, me.schoolId),
        createdAt: now()
      };
      db.roles.push(r);
      save();
      return ok(res, { role: rolOzeti(r) });
    }

    if (sub === 'role-update' && method === 'POST') {
      if (!yetkiGerek('rol.yonet')) return;
      const r = roleById(clean(body.roleId, 60));
      if (!r || r.schoolId !== me.schoolId) return bad(res, 'Rol bulunamadı');
      if (body.name !== undefined) {
        const ad = clean(body.name, 40);
        if (!ad) return bad(res, 'Rol adı gerekli');
        if (db.roles.some(x => x.schoolId === me.schoolId && x.id !== r.id &&
          x.name.toLocaleLowerCase('tr') === ad.toLocaleLowerCase('tr'))) {
          return bad(res, 'Bu adda bir rol zaten var');
        }
        r.name = ad;
      }
      if (Array.isArray(body.permissions)) {
        r.permissions = body.permissions.map(x => String(x))
          .filter(x => TUM_YETKILER.indexOf(x) >= 0);
      }
      if (body.kapsam !== undefined) {
        r.kapsam = kapsamTemizle(body.kapsam, r.permissions, me.schoolId);
      }
      save();
      return ok(res, { role: rolOzeti(r) });
    }

    if (sub === 'role-delete' && method === 'POST') {
      if (!yetkiGerek('rol.yonet')) return;
      const r = roleById(clean(body.roleId, 60));
      if (!r || r.schoolId !== me.schoolId) return bad(res, 'Rol bulunamadı');
      db.users.forEach(u => { if (u.customRoleId === r.id) u.customRoleId = ''; });
      db.roles = db.roles.filter(x => x.id !== r.id);
      save();
      return ok(res);
    }

    if (sub === 'role-assign' && method === 'POST') {
      if (!yetkiGerek('rol.yonet')) return;
      const t = userById(clean(body.userId, 60));
      if (!t || t.role !== 'teacher' || t.schoolId !== me.schoolId) {
        return bad(res, 'Öğretmen bulunamadı');
      }
      const rid = clean(body.roleId, 60);
      if (!rid) {
        t.customRoleId = '';
      } else {
        const r = roleById(rid);
        if (!r || r.schoolId !== me.schoolId) return bad(res, 'Rol bulunamadı');
        t.customRoleId = r.id;
        notify(t.id, 'Sana "' + r.name + '" rolü verildi. Menünde yeni bölümler görebilirsin.');
      }
      save();
      return ok(res, { user: pub(t) });
    }

    if (sub === 'teachers' && method === 'GET') {
      if (!yetkiGerek('ogretmen.duzenle')) return;
      const list = db.users.filter(u => u.role === 'teacher' && u.schoolId === me.schoolId)
        .map(u => Object.assign(pub(u), { studentCount: studentsOfTeacher(u.id).length }));
      return ok(res, { teachers: list });
    }
    if (sub === 'teacher-decide' && method === 'POST') {
      if (!yetkiGerek('ogretmen.onayla')) return;
      const t = userById(clean(body.userId, 60));
      if (!t || t.role !== 'teacher' || t.schoolId !== me.schoolId) return bad(res, 'Öğretmen bulunamadı');
      t.status = body.approve ? 'approved' : 'rejected';
      notify(t.id, body.approve
        ? 'Öğretmenlik başvurun müdür tarafından onaylandı.'
        : 'Öğretmenlik başvurun reddedildi.');
      save();
      return ok(res, { user: pub(t) });
    }
    if (sub === 'students' && method === 'GET') {
      if (!yetkiGerek('ogrenci.duzenle')) return;
      const list = db.users.filter(u => u.role === 'student' && u.schoolId === me.schoolId)
        .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'))
        .map(u => {
          const c = u.classId ? classById(u.classId) : null;
          return {
            id: u.id, fullName: u.fullName, email: u.email, code: u.code, grade: u.grade || '',
            classId: u.classId || '', className: c ? c.name : '', note: u.note || '',
            olusturan: u.createdBy ? 'okul' : 'kendisi',
            teachers: teachersOfStudent(u.id).map(t => ({ id: t.id, fullName: t.fullName, branch: branchOf(t) }))
          };
        });
      return ok(res, { students: list });
    }
    if (sub === 'teacher-list' && method === 'GET') {
      if (!yetkiGerek('ders.ogretmen-ata')) return;
      const list = db.users.filter(u => isTeacherLike(u) && u.schoolId === me.schoolId && u.status === 'approved')
        .map(u => ({ id: u.id, fullName: u.fullName, branch: branchOf(u), role: u.role }))
        .sort((a, b) => a.branch.localeCompare(b.branch, 'tr'));
      return ok(res, { teachers: list });
    }
    /* Müdür ödevlere ders bazlı bakar: hangi ders, hangi öğretmen, ne vermiş. */
    if (sub === 'assignments' && method === 'GET') {
      if (!yetkiGerek('ders.yonet')) return;

      const cid = clean(q.get('classId'), 60);
      let dersler = db.lessons.filter(l => l.schoolId === me.schoolId);
      if (cid) dersler = dersler.filter(l => l.classId === cid);

      const liste = dersler
        .sort((a, b) => {
          const ca = classById(a.classId), cb = classById(b.classId);
          return ((ca ? ca.name : '').localeCompare(cb ? cb.name : '', 'tr')) ||
                 a.subject.localeCompare(b.subject, 'tr');
        })
        .map(l => {
          const c = classById(l.classId);
          const t = l.teacherId ? userById(l.teacherId) : null;
          const sinifOgr = sinifOgrencileri(l.classId).map(s => s.id);

          /* Bu sınıfın öğrencilerine bu dersten verilmiş bütün ödevler.
             Ödevi dersin kendi öğretmeni vermemiş olabilir (vekil, zümre);
             müdür hepsini görmeli, veren kişi zaten yanında yazıyor. */
          const odevler = yilSuz(me, db.assignments)
            .filter(a => a.subject === l.subject &&
              a.studentIds.some(id => sinifOgr.indexOf(id) >= 0))
            .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
            .map(a => {
              const ver = userById(a.teacherId);
              return {
                id: a.id, title: a.title, description: a.description,
                startAt: a.startAt, endAt: a.endAt, endTime: odevSaati(a), status: a.status,
                teacherName: ver ? ver.fullName : '(silinmiş)',
                studentCount: a.studentIds.filter(id => sinifOgr.indexOf(id) >= 0).length
              };
            });

          return {
            lessonId: l.id, subject: l.subject,
            classId: l.classId, className: c ? c.name : '',
            teacherName: t ? t.fullName : '',
            weeklyHours: l.weeklyHours || 0,
            assignments: odevler
          };
        });

      return ok(res, {
        lessons: liste,
        classes: db.classes.filter(c => c.schoolId === me.schoolId)
          .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
          .map(c => ({ id: c.id, name: c.name }))
      });
    }

    /* ---------- öğrenci hesapları (müdür açar) ---------- */

    if (sub === 'student-create' && method === 'POST') {
      if (!yetkiGerek('ogrenci.hesap-ac')) return;
      const fullName = clean(body.fullName, 80);
      if (fullName.split(/\s+/).filter(Boolean).length < 2) return bad(res, 'Ad ve soyad yaz');

      const email = normEmail(body.email);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return bad(res, 'Geçerli bir kullanıcı adı (e-posta) gir');
      if (db.users.some(u => u.email === email)) return bad(res, 'Bu kullanıcı adı zaten kayıtlı');

      const sorun = sifreSorunu(body.password);
      if (sorun) return bad(res, sorun);

      let classId = '';
      if (body.classId) {
        const c = classById(clean(body.classId, 60));
        if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
        classId = c.id;
      }

      let code = makeCode();
      while (db.users.some(x => x.code === code)) code = makeCode();

      const u = {
        id: uid('u'), email, pass: await hashPw(String(body.password)), fullName,
        role: 'student', status: 'approved', schoolId: me.schoolId,
        city: me.city, district: me.district, address: '',
        grade: clean(body.grade, 20), classId: classId, code: code,
        note: clean(body.note, 300),
        createdBy: me.id, createdAt: now()
      };
      db.users.push(u);
      save();
      return ok(res, {
        student: { id: u.id, fullName: u.fullName, email: u.email, code: u.code, classId: u.classId },
        message: fullName + ' hesabı açıldı.'
      });
    }

    if (sub === 'student-update' && method === 'POST') {
      if (!yetkiGerek('ogrenci.duzenle')) return;
      const st = userById(clean(body.studentId, 60));
      if (!st || st.role !== 'student' || st.schoolId !== me.schoolId) return bad(res, 'Öğrenci bulunamadı');

      if (body.fullName !== undefined) {
        const ad = clean(body.fullName, 80);
        if (ad.split(/\s+/).filter(Boolean).length < 2) return bad(res, 'Ad ve soyad yaz');
        st.fullName = ad;
      }
      if (body.email !== undefined) {
        const email = normEmail(body.email);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return bad(res, 'Geçerli bir kullanıcı adı gir');
        if (db.users.some(u => u.email === email && u.id !== st.id)) return bad(res, 'Bu kullanıcı adı başkasında kayıtlı');
        st.email = email;
      }
      if (body.grade !== undefined) st.grade = clean(body.grade, 20);
      if (body.note !== undefined) st.note = clean(body.note, 300);
      save();
      return ok(res, {
        student: { id: st.id, fullName: st.fullName, email: st.email, grade: st.grade, note: st.note || '' }
      });
    }

    /* Şifreler geri döndürülemez biçimde saklandığı için görüntülenemez;
       müdür yalnızca yeni bir şifre belirleyebilir. */
    if (sub === 'student-password' && method === 'POST') {
      if (!yetkiGerek('ogrenci.sifre')) return;
      const st = userById(clean(body.studentId, 60));
      if (!st || st.role !== 'student' || st.schoolId !== me.schoolId) return bad(res, 'Öğrenci bulunamadı');
      const sorun = sifreSorunu(body.password);
      if (sorun) return bad(res, sorun);
      st.pass = await hashPw(String(body.password));

      /* Şifre değişince o hesabın açık oturumları düşsün. */
      for (const tok of Object.keys(db.sessions)) {
        if (db.sessions[tok].userId === st.id) delete db.sessions[tok];
      }
      notify(st.id, 'Şifren okul yönetimi tarafından değiştirildi.');
      save();
      return ok(res, { message: st.fullName + ' için yeni şifre kaydedildi.' });
    }

    if (sub === 'student-code-reset' && method === 'POST') {
      if (!yetkiGerek('ogrenci.duzenle')) return;
      const st = userById(clean(body.studentId, 60));
      if (!st || st.role !== 'student' || st.schoolId !== me.schoolId) return bad(res, 'Öğrenci bulunamadı');
      let code = makeCode();
      while (db.users.some(x => x.code === code)) code = makeCode();
      st.code = code;
      save();
      return ok(res, { code: code });
    }

    /* ---------- sınıflar ---------- */

    if (sub === 'classes' && method === 'GET') {
      if (!yetkiGerek('sinif.yonet')) return;
      const liste = db.classes
        .filter(c => c.schoolId === me.schoolId)
        .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
        .map(sinifOzeti);
      return ok(res, {
        classes: liste,
        gunSayisi: GUN_SAYISI,
        gunAdlari: GUN_ADLARI,
        /* Sınıfı olmayan öğrenciler müdürün dikkatini çeksin */
        sinifsiz: db.users.filter(u => u.role === 'student' && u.schoolId === me.schoolId && !u.classId).length
      });
    }

    if (sub === 'class' && method === 'POST') {
      if (!yetkiGerek('sinif.yonet')) return;
      const ad = clean(body.name, 30);
      if (!ad) return bad(res, 'Sınıf adı gerekli (ör. 7-A)');
      const ayni = db.classes.find(c => c.schoolId === me.schoolId &&
        c.name.toLocaleLowerCase('tr') === ad.toLocaleLowerCase('tr'));
      if (ayni) return bad(res, 'Bu adda bir sınıf zaten var');
      if (db.classes.filter(c => c.schoolId === me.schoolId).length >= 200) {
        return bad(res, 'Sınıf sayısı sınırına ulaşıldı');
      }
      const c = { id: uid('c'), schoolId: me.schoolId, name: ad, createdAt: now() };
      db.classes.push(c);
      save();
      return ok(res, { class: sinifOzeti(c) });
    }

    if (sub === 'class-delete' && method === 'POST') {
      if (!yetkiGerek('sinif.yonet')) return;
      const c = classById(clean(body.classId, 60));
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      /* Sınıf silinince öğrenciler sınıfsız kalır, dersleri ve programı temizlenir. */
      db.users.forEach(u => { if (u.classId === c.id) u.classId = ''; });
      const dersler = db.lessons.filter(l => l.classId === c.id).map(l => l.id);
      db.lessons = db.lessons.filter(l => l.classId !== c.id);
      db.schedule = db.schedule.filter(sp => dersler.indexOf(sp.lessonId) < 0 && sp.classId !== c.id);
      db.classes = db.classes.filter(x => x.id !== c.id);
      save();
      return ok(res);
    }

    if (sub === 'class-assign' && method === 'POST') {
      const hedefSinif = clean(body.classId, 60);
      if (!yetkiGerek('ogrenci.yerlestir', hedefSinif ? { sinif: hedefSinif } : null)) return;
      const st = userById(clean(body.studentId, 60));
      if (!st || st.role !== 'student' || st.schoolId !== me.schoolId) return bad(res, 'Öğrenci bulunamadı');
      const hedef = clean(body.classId, 60);
      if (!hedef) {
        st.classId = '';
      } else {
        const c = classById(hedef);
        if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
        st.classId = c.id;
        notify(st.id, c.name + ' sınıfına yerleştirildin.');
      }
      save();
      return ok(res);
    }

    /* ---------- dersler ---------- */

    if (sub === 'lessons' && method === 'GET') {
      const cid = clean(q.get('classId'), 60);
      const c = classById(cid);
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      if (!yetkiGerek('ders.yonet', { sinif: c.id })) return;
      const dersler = db.lessons.filter(l => l.classId === c.id)
        .sort((a, b) => a.subject.localeCompare(b.subject, 'tr'))
        .map(dersOzeti);
      const ogretmenler = db.users
        .filter(u => isTeacherLike(u) && u.schoolId === me.schoolId && u.status === 'approved')
        .map(u => ({ id: u.id, fullName: u.fullName, branch: branchOf(u) }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'));
      return ok(res, {
        class: { id: c.id, name: c.name },
        lessons: dersler,
        teachers: ogretmenler,
        subjects: SUBJECTS
      });
    }

    if (sub === 'lesson' && method === 'POST') {
      const c = classById(clean(body.classId, 60));
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      if (!yetkiGerek('ders.yonet', { sinif: c.id })) return;
      const subject = clean(body.subject, 60);
      if (SUBJECTS.indexOf(subject) < 0) return bad(res, 'Geçerli bir ders seç');
      if (db.lessons.some(l => l.classId === c.id && l.subject === subject)) {
        return bad(res, 'Bu ders bu sınıfa zaten eklenmiş');
      }
      const saat = Math.max(0, Math.min(20, parseInt(body.weeklyHours, 10) || 0));
      const l = {
        id: uid('d'), schoolId: me.schoolId, classId: c.id,
        subject: subject, teacherId: '', weeklyHours: saat, createdAt: now()
      };
      db.lessons.push(l);
      save();
      return ok(res, { lesson: dersOzeti(l) });
    }

    if (sub === 'lesson-update' && method === 'POST') {
      const l = lessonById(clean(body.lessonId, 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yetkiGerek('ders.ogretmen-ata', { ders: l.subject, sinif: l.classId })) return;

      if (body.teacherId !== undefined) {
        const tid = clean(body.teacherId, 60);
        if (!tid) {
          l.teacherId = '';
        } else {
          const t = userById(tid);
          if (!t || !isTeacherLike(t) || t.schoolId !== me.schoolId || t.status !== 'approved') {
            return bad(res, 'Öğretmen bulunamadı');
          }
          /* Öğretmenin rolü onu bu derse atanabilir kılıyor mu? */
          if (!yetkiVarMi(t, 'derse-atanabilir', { ders: l.subject, sinif: l.classId })) {
            return bad(res, t.fullName + ' bu derse atanamaz — rolündeki ders kapsamı izin vermiyor');
          }
          const eskiId = l.teacherId;
          l.teacherId = t.id;
          if (eskiId !== t.id) notify(t.id, dersEtiketi(l) + ' dersi sana atandı.');
        }
      }
      if (body.weeklyHours !== undefined) {
        l.weeklyHours = Math.max(0, Math.min(20, parseInt(body.weeklyHours, 10) || 0));
      }
      save();
      return ok(res, { lesson: dersOzeti(l), cakismalar: cakismalariBul(me.schoolId) });
    }

    if (sub === 'lesson-delete' && method === 'POST') {
      const l = lessonById(clean(body.lessonId, 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yetkiGerek('ders.yonet', { sinif: l.classId })) return;
      db.schedule = db.schedule.filter(sp => sp.lessonId !== l.id);
      db.lessons = db.lessons.filter(x => x.id !== l.id);
      save();
      return ok(res);
    }

    /* ---------- haftalık ders programı ---------- */

    if (sub === 'schedule' && method === 'GET') {
      if (!yetkiGerek('program.duzenle')) return;
      const cid = clean(q.get('classId'), 60);
      const c = classById(cid);
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      /* Okumak da kapsama tabi: rolü 7-A ile sınırlıysa 7-B'yi göremesin. */
      if (!yetkiGerek('program.duzenle', { sinif: c.id })) return;

      const dersler = programSirali(db.schedule.filter(sp => sp.classId === c.id))
        .map(sp => {
          const l = lessonById(sp.lessonId);
          const t = l && l.teacherId ? userById(l.teacherId) : null;
          return {
            id: sp.id, day: sp.day, start: sp.start, end: sp.end,
            lessonId: sp.lessonId,
            subject: l ? l.subject : '(silinmiş ders)',
            teacherName: t ? t.fullName : ''
          };
        });

      return ok(res, {
        class: { id: c.id, name: c.name },
        gunSayisi: GUN_SAYISI,
        gunAdlari: GUN_ADLARI,
        cells: dersler,
        lessons: db.lessons.filter(l => l.classId === c.id)
          .sort((a, b) => a.subject.localeCompare(b.subject, 'tr'))
          .map(dersOzeti),
        cakismalar: cakismalariBul(me.schoolId)
      });
    }

    /* Programa yeni bir ders saati ekler. Saatleri müdür kendisi belirler. */
    if (sub === 'schedule-add' && method === 'POST') {
      const c = classById(clean(body.classId, 60));
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      if (!yetkiGerek('program.duzenle', { sinif: c.id })) return;

      const gun = parseInt(body.day, 10);
      if (!(gun >= 1 && gun <= GUN_SAYISI)) return bad(res, 'Geçersiz gün');

      const bas = saatDuzelt(body.start);
      const bit = saatDuzelt(body.end);
      if (!bas) return bad(res, 'Başlangıç saatini SS:DD biçiminde gir (ör. 09:20)');
      if (!bit) return bad(res, 'Bitiş saatini SS:DD biçiminde gir (ör. 10:00)');
      const bd = saatDakika(bas), td = saatDakika(bit);
      if (td <= bd) return bad(res, 'Bitiş saati başlangıçtan sonra olmalı');
      if (td - bd > 8 * 60) return bad(res, 'Bir ders 8 saatten uzun olamaz');

      const l = lessonById(clean(body.lessonId, 60));
      if (!l || l.classId !== c.id) return bad(res, 'Bu sınıfa ait bir ders seç');

      /* Kaydetmeden önce uyar: müdür yine de ekleyebilir, engellemiyoruz. */
      const uyari = aralikCakismasi(me.schoolId, c.id, l.teacherId, gun, bd, td, null);

      const kayit = {
        id: uid('p'), schoolId: me.schoolId, classId: c.id, lessonId: l.id,
        day: gun, start: bas, end: bit, yilId: yilDamgasi(me), createdAt: now()
      };
      db.schedule.push(kayit);

      if (l.teacherId) {
        notify(l.teacherId, dersEtiketi(l) + ' dersin ' + (GUN_ADLARI[gun] || '') +
          ' ' + bas + '-' + bit + ' saatine programlandı.');
      }
      save();
      return ok(res, { kayit: kayit, uyari: uyari, cakismalar: cakismalariBul(me.schoolId) });
    }

    /* Var olan bir ders saatini günceller (saat/gün/ders değiştirme). */
    if (sub === 'schedule-update' && method === 'POST') {
      const sp = byId(db.schedule, clean(body.scheduleId, 60));
      if (!sp || sp.schoolId !== me.schoolId) return bad(res, 'Ders saati bulunamadı');
      if (!yetkiGerek('program.duzenle', { sinif: sp.classId })) return;

      const gun = body.day === undefined ? sp.day : parseInt(body.day, 10);
      if (!(gun >= 1 && gun <= GUN_SAYISI)) return bad(res, 'Geçersiz gün');

      const bas = body.start === undefined ? sp.start : saatDuzelt(body.start);
      const bit = body.end === undefined ? sp.end : saatDuzelt(body.end);
      if (!bas || !bit) return bad(res, 'Saatleri SS:DD biçiminde gir');
      const bd = saatDakika(bas), td = saatDakika(bit);
      if (td <= bd) return bad(res, 'Bitiş saati başlangıçtan sonra olmalı');

      let ders = lessonById(sp.lessonId);
      if (body.lessonId !== undefined) {
        const yeni = lessonById(clean(body.lessonId, 60));
        if (!yeni || yeni.classId !== sp.classId) return bad(res, 'Bu sınıfa ait bir ders seç');
        ders = yeni;
        sp.lessonId = yeni.id;
      }

      const uyari = aralikCakismasi(me.schoolId, sp.classId,
        ders ? ders.teacherId : '', gun, bd, td, sp.id);

      sp.day = gun; sp.start = bas; sp.end = bit;
      save();
      return ok(res, { kayit: sp, uyari: uyari, cakismalar: cakismalariBul(me.schoolId) });
    }

    if (sub === 'schedule-delete' && method === 'POST') {
      const sp = byId(db.schedule, clean(body.scheduleId, 60));
      if (!sp || sp.schoolId !== me.schoolId) return bad(res, 'Ders saati bulunamadı');
      if (!yetkiGerek('program.duzenle', { sinif: sp.classId })) return;
      db.schedule = db.schedule.filter(x => x.id !== sp.id);
      save();
      return ok(res, { cakismalar: cakismalariBul(me.schoolId) });
    }

    if (sub === 'cakismalar' && method === 'GET') {
      if (!yetkiGerek('program.duzenle')) return;
      return ok(res, { cakismalar: cakismalariBul(me.schoolId) });
    }

    /* Öğrenciyi tek tek öğretmene atama ucu kaldırıldı: öğretmen-öğrenci
       ilişkisi artık yalnızca sınıf ve ders üzerinden kuruluyor. */
  }

  /* ---- ödevler (öğretmen + müdür) ---- */
  if (p === 'assignments') {
    if (!need(null)) return;
    if (!isTeacherLike(me) && method !== 'GET') return bad(res, 'Yetkin yok', 403);

    /* Ödev verirken kime gideceğini seçmek için: sınıflar ve öğrencileri. */
    if (method === 'GET' && segs[2] === 'hedefler') {
      if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);
      const siniflar = ogretmeninSiniflari(me)
        .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
        .map(c => ({
          id: c.id, name: c.name,
          students: sinifOgrencileri(c.id)
            .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'))
            .map(s => ({ id: s.id, fullName: s.fullName }))
        }));

      /* Sınıfsız öğrenciler de kaybolmasın */
      const ulasilan = ogretmeninOgrencileri(me);
      const sinifsiz = ulasilan.filter(s => !s.classId)
        .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'))
        .map(s => ({ id: s.id, fullName: s.fullName }));
      if (sinifsiz.length) siniflar.push({ id: '', name: 'Sınıfsız öğrenciler', students: sinifsiz });

      /* Ödev hangi ders için veriliyor? */
      const dersler = db.lessons
        .filter(l => me.role === 'principal' ? l.schoolId === me.schoolId : l.teacherId === me.id)
        .map(l => {
          const c = classById(l.classId);
          return { id: l.id, subject: l.subject, classId: l.classId, className: c ? c.name : '' };
        })
        .sort((a, b) => (a.subject.localeCompare(b.subject, 'tr')) ||
                        (a.className.localeCompare(b.className, 'tr')));

      /* Aynı dersin farklı sınıflardaki kopyalarını tek başlıkta topla */
      const dersAdlari = [];
      for (const d of dersler) if (dersAdlari.indexOf(d.subject) < 0) dersAdlari.push(d.subject);

      return ok(res, {
        classes: siniflar,
        lessons: dersler,
        subjects: dersAdlari.length ? dersAdlari : SUBJECTS,
        varsayilanDers: me.role === 'teacher' ? (me.branch || '') : ''
      });
    }

    if (method === 'GET' && !segs[2]) {
      if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);
      const list = yilSuz(me, db.assignments.filter(a => a.teacherId === me.id))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(a => ({
          id: a.id, title: a.title, description: a.description, subject: a.subject,
          startAt: a.startAt, endAt: a.endAt, endTime: odevSaati(a),
          gecikti: odevGecikti(a),
          status: a.status, createdAt: a.createdAt,
          studentCount: a.studentIds.length, summary: summarize(a)
        }));
      return ok(res, { assignments: list });
    }

    if (method === 'POST' && !segs[2]) {
      const title = clean(body.title, 120);
      if (!title) return bad(res, 'Ödev adı gerekli');

      const subject = clean(body.subject, 60) ||
        (me.role === 'teacher' ? me.branch : branchOf(me));
      if (!subject) return bad(res, 'Ders seç');

      /* Kime gideceği artık açıkça seçiliyor. Sadece ulaşabildiğin
         öğrencilere ödev verilebilir. */
      const ulasilan = ogretmeninOgrencileri(me);
      const izinli = new Set(ulasilan.map(s => s.id));
      const istenen = Array.isArray(body.studentIds) ? body.studentIds.map(x => String(x)) : [];
      const secilen = istenen.filter(id => izinli.has(id));

      if (!istenen.length) return bad(res, 'En az bir öğrenci seç');
      if (!secilen.length) return bad(res, 'Seçtiğin öğrencilere ödev veremezsin');

      /* Hangi sınıflara gittiğini de sakla: müdür ders bazlı bakabilsin. */
      const sinifIdler = [];
      for (const id of secilen) {
        const st = userById(id);
        if (st && st.classId && sinifIdler.indexOf(st.classId) < 0) sinifIdler.push(st.classId);
      }

      /* Rolünde ders/sınıf kapsamı varsa ona uymalı. */
      if (!yetkiVarMi(me, 'odev.ver', { ders: subject })) {
        return bad(res, subject + ' dersine ödev verme yetkin yok');
      }
      for (const cid of sinifIdler) {
        if (!yetkiVarMi(me, 'odev.ver', { sinif: cid })) {
          const c = classById(cid);
          return bad(res, (c ? c.name : 'Bu sınıf') + ' için ödev verme yetkin yok');
        }
      }

      const a = {
        id: uid('a'), teacherId: me.id, schoolId: me.schoolId, subject,
        title, description: clean(body.description, 1000),
        startAt: clean(body.startAt, 30), endAt: clean(body.endAt, 30),
        endTime: saatDuzelt(body.endTime) || ODEV_VARSAYILAN_SAAT,
        studentIds: secilen, classIds: sinifIdler,
        status: 'active', results: {}, yilId: yilDamgasi(me), createdAt: now()
      };
      db.assignments.push(a);
      secilen.forEach(id => notify(id, 'Yeni ödev: ' + title + ' (' + subject + ')'));
      save();
      return ok(res, { assignment: a, gonderilen: secilen.length });
    }

    const a = byId(db.assignments, segs[2] || '');
    if (!a) return bad(res, 'Ödev bulunamadı', 404);
    if (a.teacherId !== me.id) return bad(res, 'Yetkin yok', 403);

    if (method === 'GET') {
      return ok(res, {
        assignment: a,
        students: a.studentIds.map(id => {
          const s = userById(id);
          return { id, fullName: s ? s.fullName : '(silinmiş öğrenci)', result: a.results[id] || null };
        })
      });
    }
    if (method === 'POST' && segs[3] === 'finish') {
      const results = body.results || {};
      for (const id of a.studentIds) {
        const r = results[id];
        if (r && RESULT_TYPES.indexOf(r) >= 0) a.results[id] = r;
      }
      a.status = 'finished';
      a.finishedAt = now();
      a.studentIds.forEach(id => notify(id, '"' + a.title + '" ödevi sonuçlandı.'));
      save();
      return ok(res, { assignment: a });
    }
    if (method === 'POST' && segs[3] === 'reopen') {
      a.status = 'active';
      save();
      return ok(res, { assignment: a });
    }
    if (method === 'POST' && segs[3] === 'delete') {
      db.assignments = db.assignments.filter(x => x.id !== a.id);
      save();
      return ok(res);
    }
  }

  /* ---- sınav grupları ---- */
  if (p === 'examgroups') {
    if (!need(null)) return;
    if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);

    if (method === 'GET' && !segs[2]) {
      const list = yilSuz(me, db.examGroups.filter(g => g.teacherId === me.id))
        .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
        .map(g => {
          const exams = db.exams.filter(e => e.groupId === g.id);
          return {
            id: g.id, name: g.name, subject: g.subject, createdAt: g.createdAt,
            examCount: exams.length,
            weightTotal: exams.reduce((s, e) => s + Number(e.weight), 0)
          };
        });
      return ok(res, { groups: list });
    }
    if (method === 'POST' && !segs[2]) {
      const name = clean(body.name, 100);
      if (!name) return bad(res, 'Grup adı gerekli (örn: Dönem 1 - Yarıyıl 1)');
      const g = {
        id: uid('g'), teacherId: me.id, schoolId: me.schoolId,
        subject: me.role === 'teacher' ? me.branch : (clean(body.subject, 60) || branchOf(me)),
        name, yilId: yilDamgasi(me), createdAt: now()
      };
      db.examGroups.push(g);
      save();
      return ok(res, { group: g });
    }

    const g = byId(db.examGroups, segs[2] || '');
    if (!g) return bad(res, 'Sınav grubu bulunamadı', 404);
    if (g.teacherId !== me.id) return bad(res, 'Yetkin yok', 403);

    if (method === 'GET') {
      const students = studentsOfTeacher(me.id);
      const gExams = db.exams.filter(e => e.groupId === g.id);
      const exams = gExams.map(e => ({
        id: e.id, name: e.name, weight: e.weight, graded: Object.keys(e.grades || {}).length
      }));
      const averages = students.map(s => {
        let ws = 0, wt = 0;
        gExams.forEach(e => {
          const v = e.grades ? e.grades[s.id] : undefined;
          if (v !== null && v !== undefined) { ws += Number(v) * Number(e.weight); wt += Number(e.weight); }
        });
        return { id: s.id, fullName: s.fullName, average: wt > 0 ? Math.round(ws / wt * 100) / 100 : null };
      });
      return ok(res, { group: g, exams, averages });
    }
    if (method === 'POST' && segs[3] === 'delete') {
      db.exams = db.exams.filter(e => e.groupId !== g.id);
      db.examGroups = db.examGroups.filter(x => x.id !== g.id);
      save();
      return ok(res);
    }
  }

  /* ---- sınavlar ---- */
  if (p === 'exams') {
    if (!need(null)) return;
    if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);

    if (method === 'POST' && !segs[2]) {
      const g = byId(db.examGroups, clean(body.groupId, 60));
      if (!g || g.teacherId !== me.id) return bad(res, 'Sınav grubu bulunamadı');
      const name = clean(body.name, 100);
      if (!name) return bad(res, 'Sınav adı gerekli');
      const w = Number(body.weight);
      if (!isFinite(w) || w <= 0 || w > 100) return bad(res, 'Etki oranı 1 ile 100 arasında olmalı');
      const e = { id: uid('e'), groupId: g.id, teacherId: me.id, name, weight: w, grades: {}, createdAt: now() };
      db.exams.push(e);
      save();
      return ok(res, { exam: e });
    }

    const e = byId(db.exams, segs[2] || '');
    if (!e) return bad(res, 'Sınav bulunamadı', 404);
    if (e.teacherId !== me.id) return bad(res, 'Yetkin yok', 403);

    if (method === 'GET') {
      return ok(res, {
        exam: e,
        students: studentsOfTeacher(me.id).map(s => ({
          id: s.id, fullName: s.fullName,
          grade: e.grades && e.grades[s.id] !== undefined ? e.grades[s.id] : null
        }))
      });
    }
    if (method === 'POST' && segs[3] === 'grades') {
      const grades = body.grades || {};
      const allowed = studentsOfTeacher(me.id).map(s => s.id);
      const changed = [];
      for (const id in grades) {
        if (allowed.indexOf(id) < 0) continue;
        const v = grades[id];
        if (v === null || v === '' || v === undefined) { delete e.grades[id]; continue; }
        const n = Number(v);
        if (!isFinite(n) || n < 0 || n > 100) continue;
        e.grades[id] = Math.round(n * 100) / 100;
        changed.push(id);
      }
      changed.forEach(id => notify(id, '"' + e.name + '" sınavının notu girildi.'));
      save();
      return ok(res, { exam: e });
    }
    if (method === 'POST' && segs[3] === 'delete') {
      db.exams = db.exams.filter(x => x.id !== e.id);
      save();
      return ok(res);
    }
  }

  /* ---- ilerleyiş (öğrenci / veli / öğretmen / müdür) ---- */
  /* Öğrenci (ve velisi) kendi sınıfının ders programını görür. */
  if (p === 'myschedule' && method === 'GET') {
    if (!need(null)) return;
    let hedef = me;
    const sid = clean(q.get('studentId'), 60);
    if (sid) {
      if (!canSeeStudent(me, sid)) return bad(res, 'Bu öğrenciyi görüntüleyemezsin', 403);
      hedef = userById(sid);
    } else if (me.role !== 'student') {
      return bad(res, 'Öğrenci seçmelisin', 400);
    }
    if (!hedef || hedef.role !== 'student') return bad(res, 'Öğrenci bulunamadı', 404);

    const c = hedef.classId ? classById(hedef.classId) : null;
    const dersler = !c ? [] : programSirali(db.schedule.filter(sp => sp.classId === c.id))
      .map(sp => {
        const l = lessonById(sp.lessonId);
        const t = l && l.teacherId ? userById(l.teacherId) : null;
        return {
          id: sp.id, day: sp.day, start: sp.start, end: sp.end,
          subject: l ? l.subject : '?',
          teacherName: t ? t.fullName : ''
        };
      });

    return ok(res, {
      className: c ? c.name : '',
      gunSayisi: GUN_SAYISI,
      gunAdlari: GUN_ADLARI,
      cells: dersler
    });
  }

  if (p === 'progress' && method === 'GET') {
    if (!me) return bad(res, 'Giriş yapmalısın', 401);
    const sid = clean(q.get('studentId'), 60) || me.id;
    if (!canSeeStudent(me, sid)) return bad(res, 'Bu öğrenciyi görme yetkin yok', 403);
    const data = progressOf(sid, me);
    if (!data) return bad(res, 'Öğrenci bulunamadı', 404);
    return ok(res, data);
  }

  /* ---- veli ---- */
  if (p === 'parent') {
    if (!need(['parent'])) return;
    if (segs[2] === 'children' && method === 'GET') return ok(res, { children: childrenOf(me) });
    if (segs[2] === 'link' && method === 'POST') {
      /* Veli kodu tahmin saldırısına karşı: hesap başına dakikada 5 deneme. */
      const kodAnahtar = 'kod:' + me.id;
      if (!hizSinir(kodAnahtar, 5, 60 * 1000)) {
        return bad(res, 'Çok fazla kod denemesi. Bir dakika bekleyip tekrar dene.', 429);
      }
      const code = clean(body.code, 40);
      const st = db.users.find(u => u.role === 'student' && u.code === code);
      if (!st) return bad(res, 'Bu koda sahip bir öğrenci bulunamadı');
      if (db.parentLinks.some(l => l.parentId === me.id && l.studentId === st.id)) return bad(res, 'Bu öğrenci zaten ekli');
      db.parentLinks.push({ id: uid('pl'), parentId: me.id, studentId: st.id, createdAt: now() });
      /* Veli kayıtta okul seçmiyor; çocuğuna bağlanınca onun okuluna
         bağlanmış oluyor. Takvim, mesaj ve duyurular buna dayanıyor. */
      if (!me.schoolId && st.schoolId) me.schoolId = st.schoolId;
      notify(st.id, me.fullName + ' veli olarak hesabına bağlandı.');
      save();
      return ok(res, { children: childrenOf(me) });
    }
    if (segs[2] === 'unlink' && method === 'POST') {
      const sid = clean(body.studentId, 60);
      db.parentLinks = db.parentLinks.filter(l => !(l.parentId === me.id && l.studentId === sid));
      save();
      return ok(res, { children: childrenOf(me) });
    }
  }

  /* ---- öğretmenin öğrencileri ---- */
  if (p === 'teacher') {
    if (!need(null)) return;
    if (!isTeacherLike(me)) return bad(res, 'Yetkin yok', 403);
    if (segs[2] === 'students' && method === 'GET') {
      return ok(res, {
        students: studentsOfTeacher(me.id).map(s => ({ id: s.id, fullName: s.fullName, email: s.email }))
      });
    }

    /* Öğretmenin kendi haftalık programı ve dersleri. */
    if (segs[2] === 'schedule' && method === 'GET') {
      const derslerim = db.lessons.filter(l => l.teacherId === me.id);
      const dersIdler = derslerim.map(l => l.id);

      const dersSaatleri = programSirali(db.schedule.filter(sp => dersIdler.indexOf(sp.lessonId) >= 0))
        .map(sp => {
          const l = lessonById(sp.lessonId);
          const c = classById(sp.classId);
          return {
            id: sp.id, day: sp.day, start: sp.start, end: sp.end,
            subject: l ? l.subject : '?',
            className: c ? c.name : '?',
            classId: sp.classId
          };
        });

      /* Kendi programında kesişen saatler çakışmadır. */
      dersSaatleri.forEach(h => {
        const hb = saatDakika(h.start), he = saatDakika(h.end);
        h.cakisma = dersSaatleri.some(d =>
          d !== h && d.day === h.day &&
          araliklarKesisiyor(hb, he, saatDakika(d.start), saatDakika(d.end)));
      });

      return ok(res, {
        gunSayisi: GUN_SAYISI,
        gunAdlari: GUN_ADLARI,
        cells: dersSaatleri,
        lessons: derslerim
          .map(l => {
            const c = classById(l.classId);
            return {
              id: l.id, subject: l.subject,
              className: c ? c.name : '?',
              classId: l.classId,
              weeklyHours: l.weeklyHours || 0,
              placed: db.schedule.filter(sp => sp.lessonId === l.id).length,
              studentCount: sinifOgrencileri(l.classId).length
            };
          })
          .sort((a, b) => (a.className.localeCompare(b.className, 'tr')) ||
                          (a.subject.localeCompare(b.subject, 'tr')))
      });
    }
  }

  /* ---------- eğitim yılı ---------- */
  if (p === 'egitim-yili') {
    if (!need()) return;
    if (!okulGerek(res, me)) return;
    const alt = segs[2] || '';

    if (!alt && method === 'GET') {
      const liste = okulYillari(me.schoolId);
      const aktif = aktifYil(me.schoolId);
      const bakilan = bakilanYil(me);
      return ok(res, {
        yillar: liste.map(y => ({
          id: y.id, ad: y.ad, bas: y.bas, bit: y.bit,
          aktif: !!(aktif && y.id === aktif.id),
          bakilan: !!(bakilan && y.id === bakilan.id)
        })),
        yonetebilir: yetkiVarMi(me, 'yil.yonet'),
        arsiv: arsivdeMi(me)
      });
    }

    if (alt === 'ekle' && method === 'POST') {
      if (!yetkiVarMi(me, 'yil.yonet')) return bad(res, 'Eğitim yılı açma yetkin yok', 403);
      const ad = clean(body.ad, 20);
      if (!/^\d{4}-\d{4}$/.test(ad)) {
        return bad(res, 'Yıl adını 2026-2027 biçiminde yaz');
      }
      const [b, t] = ad.split('-').map(Number);
      if (t !== b + 1) return bad(res, 'İkinci yıl birincinin bir fazlası olmalı');
      if (okulYillari(me.schoolId).some(y => y.ad === ad)) {
        return bad(res, 'Bu eğitim yılı zaten var');
      }

      const yeni = {
        id: uid('y'), schoolId: me.schoolId, ad: ad,
        bas: b + '-09-01', bit: t + '-06-30',
        aktif: body.aktifYap !== false, createdAt: now()
      };
      /* Tek yıl aktif olabilir. */
      if (yeni.aktif) {
        for (const y of db.egitimYillari) {
          if (y.schoolId === me.schoolId) y.aktif = false;
        }
      }
      db.egitimYillari.push(yeni);
      me.seciliYil = yeni.id;
      islemYaz(me, 'yil.acildi', ad, req);
      save();
      return ok(res, { yil: yeni, message: ad + ' eğitim yılı açıldı.' });
    }

    /* Hangi yıla bakılacağını seç — kişiye özel, veriyi değiştirmez. */
    if (alt === 'bak' && method === 'POST') {
      const y = byId(db.egitimYillari, clean(body.id, 60));
      if (!y || y.schoolId !== me.schoolId) return bad(res, 'Yıl bulunamadı', 404);
      me.seciliYil = y.id;
      save();
      return ok(res, { yil: y, arsiv: arsivdeMi(me), message: y.ad + ' yılına bakıyorsun.' });
    }

    /* Aktif yılı değiştir — yeni kayıtlar bu yıla yazılır. */
    if (alt === 'aktif-yap' && method === 'POST') {
      if (!yetkiVarMi(me, 'yil.yonet')) return bad(res, 'Yetkin yok', 403);
      const y = byId(db.egitimYillari, clean(body.id, 60));
      if (!y || y.schoolId !== me.schoolId) return bad(res, 'Yıl bulunamadı', 404);
      for (const x of db.egitimYillari) {
        if (x.schoolId === me.schoolId) x.aktif = false;
      }
      y.aktif = true;
      me.seciliYil = y.id;
      islemYaz(me, 'yil.aktif-degisti', y.ad, req);
      save();
      return ok(res, { message: y.ad + ' artık aktif eğitim yılı.' });
    }
  }

  /* ---------- takvim ---------- */
  if (p === 'takvim') {
    if (!need()) return;
    if (!okulGerek(res, me)) return;
    const alt = segs[2] || '';

    /* Okul etkinliği ekle */
    if (alt === 'etkinlik' && method === 'POST') {
      if (!yetkiVarMi(me, 'takvim.yonet')) {
        return bad(res, 'Takvime ekleme yetkin yok', 403);
      }
      const tarih = gunBicimi(body.tarih);
      if (!tarih) return bad(res, 'Tarihi GG.AA.YYYY biçiminde seç');
      const baslik = clean(body.baslik, 100);
      if (!baslik) return bad(res, 'Başlık yaz');
      const tur = ['tatil', 'etkinlik', 'sinav', 'toplanti'].indexOf(clean(body.tur, 20)) >= 0
        ? clean(body.tur, 20) : 'etkinlik';
      const bitis = gunBicimi(body.bitis) || tarih;
      if (bitis < tarih) return bad(res, 'Bitiş tarihi başlangıçtan önce olamaz');

      const kayit = {
        id: uid('tk'), schoolId: me.schoolId, tarih: tarih, bitis: bitis,
        baslik: baslik, tur: tur, aciklama: clean(body.aciklama, 300),
        ekleyenId: me.id, yilId: yilDamgasi(me), createdAt: now()
      };
      db.takvim.push(kayit);
      save();
      return ok(res, { etkinlik: kayit, message: baslik + ' takvime eklendi.' });
    }

    /* Silme de POST: projenin geri kalanı GET/POST kullanıyor,
       DELETE için ayrı gövde okuma yolu açmaya değmez. */
    if (alt === 'etkinlik-sil' && method === 'POST') {
      if (!yetkiVarMi(me, 'takvim.yonet')) return bad(res, 'Yetkin yok', 403);
      const k = byId(db.takvim, clean(body.id, 60));
      if (!k || k.schoolId !== me.schoolId) return bad(res, 'Kayıt bulunamadı', 404);
      db.takvim = db.takvim.filter(x => x.id !== k.id);
      save();
      return ok(res, { message: 'Silindi.' });
    }

    /* Ay görünümü */
    if (!alt && method === 'GET') {
      const yil = Math.min(2100, Math.max(2000, parseInt(q.get('yil'), 10) || 0));
      const ay = Math.min(12, Math.max(1, parseInt(q.get('ay'), 10) || 0));
      if (!yil || !ay) return bad(res, 'Yıl ve ay gerekli');

      const iki = n => (n < 10 ? '0' : '') + n;
      const gunSayisi = new Date(yil, ay, 0).getDate();
      const ilkGun = new Date(yil, ay - 1, 1).getDay();      /* 0 = Pazar */
      const basSutun = (ilkGun + 6) % 7;                      /* Pazartesi = 0 */

      const harita = ozelGunler(yil, ay);
      const ayBas = yil + '-' + iki(ay) + '-01';
      const ayBit = yil + '-' + iki(ay) + '-' + iki(gunSayisi);

      /* --- okulun kendi kayıtları --- */
      for (const k of db.takvim) {
        if (k.schoolId !== me.schoolId) continue;
        const bas = k.tarih, bit = k.bitis || k.tarih;
        if (bit < ayBas || bas > ayBit) continue;
        for (let g = 1; g <= gunSayisi; g++) {
          const t = yil + '-' + iki(ay) + '-' + iki(g);
          if (t >= bas && t <= bit) {
            tarihEkle(harita, t, {
              tur: k.tur, baslik: k.baslik, aciklama: k.aciklama, id: k.id, silinebilir: true
            });
          }
        }
      }

      /* --- ödev teslim tarihleri --- */
      const hedef = takvimHedefi(me, q.get('studentId'));
      let odevler;
      if (hedef) {
        odevler = yilSuz(me, db.assignments.filter(a => a.studentIds.indexOf(hedef.id) >= 0));
      } else if (me.role === 'teacher' || me.role === 'principal') {
        odevler = yilSuz(me, db.assignments.filter(a => a.schoolId === me.schoolId &&
          (me.role === 'principal' || a.teacherId === me.id)));
      } else {
        odevler = [];
      }
      for (const a of odevler) {
        const t = clean(a.endAt, 10);
        if (t < ayBas || t > ayBit) continue;
        tarihEkle(harita, t, {
          tur: 'odev', baslik: a.title, aciklama: a.subject,
          saat: odevSaati(a), durum: a.status, id: a.id
        });
      }

      /* --- haftalık ders programı --- */
      let programKayit = [];
      if (hedef && hedef.classId) {
        programKayit = db.schedule.filter(sp => sp.classId === hedef.classId);
      } else if (me.role === 'teacher') {
        const benimDersler = db.lessons.filter(l => l.teacherId === me.id).map(l => l.id);
        programKayit = db.schedule.filter(sp => benimDersler.indexOf(sp.lessonId) >= 0);
      }
      const dersSayisi = {};
      for (const sp of programKayit) {
        for (let g = 1; g <= gunSayisi; g++) {
          const d = new Date(yil, ay - 1, g);
          const haftaGun = ((d.getDay() + 6) % 7) + 1;   /* Pazartesi = 1 */
          if (haftaGun !== sp.day) continue;
          const t = yil + '-' + iki(ay) + '-' + iki(g);
          dersSayisi[t] = (dersSayisi[t] || 0) + 1;
        }
      }

      /* --- günleri derle --- */
      const bugunT = bugun();
      const gunler = [];
      for (let g = 1; g <= gunSayisi; g++) {
        const t = yil + '-' + iki(ay) + '-' + iki(g);
        const d = new Date(yil, ay - 1, g);
        const haftaGun = ((d.getDay() + 6) % 7) + 1;
        const olaylar = harita[t] || [];
        gunler.push({
          tarih: t, gun: g, haftaGun: haftaGun,
          haftaSonu: haftaGun >= 6,
          bugun: t === bugunT,
          tatil: olaylar.some(o => o.tur === 'tatil'),
          dersSayisi: dersSayisi[t] || 0,
          olaylar: olaylar
        });
      }

      return ok(res, {
        yil: yil, ay: ay, basSutun: basSutun,
        bugun: bugunT,
        yonetebilir: yetkiVarMi(me, 'takvim.yonet'),
        ogrenci: hedef ? { id: hedef.id, ad: hedef.fullName } : null,
        gunler: gunler
      });
    }

    /* Tek günün ayrıntısı: o gün hangi dersler var, hangi ödev teslim */
    if (alt === 'gun' && method === 'GET') {
      const tarih = gunBicimi(q.get('tarih'));
      if (!tarih) return bad(res, 'Tarih gerekli');
      const d = new Date(tarih + 'T00:00:00');
      const haftaGun = ((d.getDay() + 6) % 7) + 1;

      const hedef = takvimHedefi(me, q.get('studentId'));
      let programKayit = [];
      if (hedef && hedef.classId) {
        programKayit = db.schedule.filter(sp =>
          sp.classId === hedef.classId && sp.day === haftaGun);
      } else if (me.role === 'teacher') {
        const benim = db.lessons.filter(l => l.teacherId === me.id).map(l => l.id);
        programKayit = db.schedule.filter(sp =>
          benim.indexOf(sp.lessonId) >= 0 && sp.day === haftaGun);
      }

      const dersler = programKayit
        .sort((a, b) => String(a.start).localeCompare(String(b.start)))
        .map(sp => {
          const l = byId(db.lessons, sp.lessonId);
          const c = classById(sp.classId);
          const t = l && l.teacherId ? userById(l.teacherId) : null;
          return {
            ders: l ? l.subject : '', sinif: c ? c.name : '',
            bas: sp.start, bit: sp.end, ogretmen: t ? t.fullName : ''
          };
        });

      /* Bu gün teslim edilecekler ve yaklaşanlar */
      let odevler;
      if (hedef) {
        odevler = yilSuz(me, db.assignments.filter(a => a.studentIds.indexOf(hedef.id) >= 0));
      } else if (me.role === 'teacher' || me.role === 'principal') {
        odevler = yilSuz(me, db.assignments.filter(a => a.schoolId === me.schoolId &&
          (me.role === 'principal' || a.teacherId === me.id)));
      } else {
        odevler = [];
      }

      const sonrakiSinir = new Date(d.getTime() + 7 * 86400000)
        .toISOString().slice(0, 10);

      const bugunkuler = [];
      const yaklasan = [];
      for (const a of odevler) {
        const t = clean(a.endAt, 10);
        const kayit = {
          id: a.id, baslik: a.title, ders: a.subject,
          tarih: t, saat: odevSaati(a), durum: a.status, aciklama: a.description
        };
        if (t === tarih) bugunkuler.push(kayit);
        else if (t > tarih && t <= sonrakiSinir) yaklasan.push(kayit);
      }
      yaklasan.sort((a, b) => a.tarih.localeCompare(b.tarih));

      const harita = ozelGunler(d.getFullYear(), d.getMonth() + 1);
      const olaylar = (harita[tarih] || []).slice();
      for (const k of db.takvim) {
        if (k.schoolId !== me.schoolId) continue;
        if (tarih >= k.tarih && tarih <= (k.bitis || k.tarih)) {
          olaylar.push({ tur: k.tur, baslik: k.baslik, aciklama: k.aciklama,
            id: k.id, silinebilir: true });
        }
      }

      return ok(res, {
        tarih: tarih,
        haftaGun: haftaGun,
        gunAdi: GUN_ADLARI[haftaGun] || '',
        olaylar: olaylar,
        dersler: dersler,
        teslim: bugunkuler,
        yaklasan: yaklasan.slice(0, 10),
        yonetebilir: yetkiVarMi(me, 'takvim.yonet')
      });
    }
  }

  /* ---------- işlem kaydı ---------- */
  if (p === 'islem-kaydi' && method === 'GET') {
    if (!need()) return;
    const hepsi = me.role === 'admin';
    if (!hepsi && !yetkiVarMi(me, 'islem-kaydi.gor')) {
      return bad(res, 'İşlem kaydını görme yetkin yok', 403);
    }

    const suz = clean(q.get('islem'), 40);
    let liste = db.islemKaydi.filter(k => hepsi || k.schoolId === me.schoolId);
    if (suz) liste = liste.filter(k => k.islem === suz);
    liste = liste.sort((a, b) => String(b.tarih).localeCompare(String(a.tarih)));

    /* Hangi işlem türleri gerçekten kayıtta var — filtre kutusunu doldurmak için. */
    const turler = [];
    for (const k of liste) if (turler.indexOf(k.islem) < 0) turler.push(k.islem);

    return ok(res, {
      toplam: liste.length,
      turler: turler.map(t => ({ k: t, ad: ISLEM_AD[t] || t })),
      kayitlar: liste.slice(0, 300).map(k => ({
        id: k.id, tarih: k.tarih,
        kisi: k.userAd, rol: k.userRol,
        islem: k.islem, islemAd: ISLEM_AD[k.islem] || k.islem,
        detay: k.detay, ip: k.ip
      }))
    });
  }

  /* ---------- devamsızlık ---------- */
  if (p === 'devamsizlik') {
    if (!need()) return;
    if (!okulGerek(res, me)) return;
    const alt = segs[2] || '';

    /* Öğretmenin yoklama alabileceği dersler */
    if (alt === 'derslerim' && method === 'GET') {
      /* Boş liste dönmek yerine açıkça reddet: öğrenci ve velinin bu uçta
         işi yok, 200 dönmesi denetimde yanlış izlenim veriyordu. */
      if (!yetkiVarMi(me, 'devamsizlik.al')) {
        return bad(res, 'Yoklama yetkin yok', 403);
      }
      const dersler = db.lessons.filter(l =>
        l.schoolId === me.schoolId && yoklamaYetkisi(me, l));
      return ok(res, {
        dersler: dersler.map(l => {
          const c = classById(l.classId);
          return {
            id: l.id, ders: l.subject,
            sinif: c ? c.name : '', classId: l.classId,
            ogrenciSayisi: sinifOgrencileri(l.classId).length
          };
        }).sort((a, b) => a.sinif.localeCompare(b.sinif, 'tr') ||
                          a.ders.localeCompare(b.ders, 'tr'))
      });
    }

    /* Yoklama ekranı: sınıfın öğrencileri + o güne girilmiş kayıtlar */
    if (alt === 'yoklama' && method === 'GET') {
      const l = byId(db.lessons, clean(q.get('lessonId'), 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yoklamaYetkisi(me, l)) {
        return bad(res, 'Bu ders için yoklama yetkin yok', 403);
      }
      const tarih = gunBicimi(q.get('tarih')) || bugun();
      const varolan = {};
      for (const k of db.devamsizlik) {
        if (k.lessonId === l.id && k.tarih === tarih) varolan[k.ogrenciId] = k;
      }
      const c = classById(l.classId);
      return ok(res, {
        ders: { id: l.id, ad: l.subject, sinif: c ? c.name : '' },
        tarih: tarih,
        durumlar: DEVAM_DURUMLAR.map(d => ({ k: d, ad: DEVAM_AD[d] })),
        ogrenciler: sinifOgrencileri(l.classId)
          .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'))
          .map(o => ({
            id: o.id, ad: o.fullName,
            durum: varolan[o.id] ? varolan[o.id].durum : 'var',
            not: varolan[o.id] ? (varolan[o.id].not || '') : ''
          }))
      });
    }

    /* Yoklamayı kaydet — aynı gün tekrar alınırsa üzerine yazar. */
    if (alt === 'yoklama' && method === 'POST') {
      const l = byId(db.lessons, clean(body.lessonId, 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yoklamaYetkisi(me, l)) {
        return bad(res, 'Bu ders için yoklama yetkin yok', 403);
      }
      const tarih = gunBicimi(body.tarih) || bugun();
      if (tarih > bugun()) return bad(res, 'İleri tarihe yoklama alınamaz');

      const girisler = Array.isArray(body.girisler) ? body.girisler : [];
      if (!girisler.length) return bad(res, 'Yoklama boş');

      const sinifOgr = sinifOgrencileri(l.classId).map(o => o.id);

      /* O derse ait o günün eski kayıtlarını temizleyip yeniden yazıyoruz. */
      db.devamsizlik = db.devamsizlik.filter(k =>
        !(k.lessonId === l.id && k.tarih === tarih));

      let yazilan = 0;
      const bildirilecek = [];
      for (const g of girisler) {
        const oid = clean(g.ogrenciId, 60);
        if (sinifOgr.indexOf(oid) < 0) continue;
        const durum = clean(g.durum, 10);
        if (DEVAM_DURUMLAR.indexOf(durum) < 0) continue;
        /* "Geldi" kaydı tutulmuyor; yokluk anlamlı olan bilgi. */
        if (durum === 'var') continue;
        db.devamsizlik.push({
          id: uid('dv'), schoolId: me.schoolId, classId: l.classId,
          lessonId: l.id, ogrenciId: oid, tarih: tarih, durum: durum,
          not: clean(g.not, 200), alanId: me.id,
          yilId: yilDamgasi(me), createdAt: now()
        });
        yazilan++;
        bildirilecek.push({ oid, durum });
      }

      /* Öğrenciye ve velisine haber ver. */
      for (const b of bildirilecek) {
        if (b.durum === 'var') continue;
        const metin = tarih + ' ' + l.subject + ' dersi: ' + (DEVAM_AD[b.durum] || b.durum);
        notify(b.oid, metin, '#/devamsizligim');
        for (const v of velileriBul(b.oid)) {
          const o = userById(b.oid);
          notify(v.id, (o ? o.fullName + ' — ' : '') + metin, '#/cocuklarim');
        }
      }

      save();
      return ok(res, {
        yazilan: yazilan,
        message: yazilan
          ? yazilan + ' devamsızlık kaydedildi.'
          : 'Yoklama kaydedildi — herkes derste.'
      });
    }

    /* Öğrencinin kendi dökümü */
    if (alt === 'benim' && method === 'GET') {
      if (me.role !== 'student') return bad(res, 'Bu ekran öğrenciler için', 403);
      return ok(res, devamsizlikOzeti(me.id, Number(q.get('gun')) || 0, me));
    }

    /* Velinin çocuğu / öğretmen ve müdürün öğrenci dökümü */
    if (alt === 'ogrenci' && method === 'GET') {
      const st = userById(clean(q.get('studentId'), 60));
      if (!st || st.role !== 'student') return bad(res, 'Öğrenci bulunamadı');

      let izin = false;
      if (me.role === 'parent') {
        izin = db.parentLinks.some(x => x.parentId === me.id && x.studentId === st.id);
      } else if (me.schoolId === st.schoolId) {
        izin = yetkiVarMi(me, 'devamsizlik.gor') ||
          yetkiVarMi(me, 'devamsizlik.al', { sinif: st.classId }) ||
          teachersOfStudent(st.id).some(t => t.id === me.id);
      }
      if (!izin) return bad(res, 'Bu öğrencinin devamsızlığını görme yetkin yok', 403);

      const ozet = devamsizlikOzeti(st.id, Number(q.get('gun')) || 0, me);
      ozet.ogrenci = { id: st.id, ad: st.fullName };
      return ok(res, ozet);
    }

    /* Bir öğrencinin belirli bir günü: o gün programda hangi dersler var,
       her birinde durumu ne. Yoklama listesini tek tek gezmek yerine
       "şu öğrenci, şu gün" diye bakmak için. */
    if (alt === 'gun' && method === 'GET') {
      const st = userById(clean(q.get('studentId'), 60));
      if (!st || st.role !== 'student') return bad(res, 'Öğrenci bulunamadı');

      let izin = false;
      if (me.role === 'parent') {
        izin = db.parentLinks.some(x => x.parentId === me.id && x.studentId === st.id);
      } else if (me.id === st.id) {
        izin = true;
      } else if (me.schoolId === st.schoolId) {
        izin = yetkiVarMi(me, 'devamsizlik.gor') ||
          teachersOfStudent(st.id).some(t => t.id === me.id);
      }
      if (!izin) return bad(res, 'Bu öğrencinin kaydını görme yetkin yok', 403);

      const tarih = gunBicimi(q.get('tarih')) || bugun();
      const d = new Date(tarih + 'T00:00:00');
      const haftaGun = ((d.getDay() + 6) % 7) + 1;

      /* O gün sınıfın programındaki ders saatleri */
      const saatler = db.schedule
        .filter(sp => sp.classId === st.classId && sp.day === haftaGun)
        .sort((a, b) => String(a.start).localeCompare(String(b.start)));

      const kayitlar = db.devamsizlik.filter(k =>
        k.ogrenciId === st.id && k.tarih === tarih);

      const dersler = saatler.map((sp, i) => {
        const l = byId(db.lessons, sp.lessonId);
        const t = l && l.teacherId ? userById(l.teacherId) : null;
        const kayit = kayitlar.find(k => k.lessonId === sp.lessonId);
        /* Kaydı yoksa derse gelmiş sayılır — yoklamada yalnızca
           devamsızlıklar saklanıyor. */
        return {
          sira: i + 1,
          lessonId: sp.lessonId,
          ders: l ? l.subject : '',
          ogretmen: t ? t.fullName : '',
          bas: sp.start, bit: sp.end,
          durum: kayit ? kayit.durum : 'var',
          not: kayit ? (kayit.not || '') : '',
          duzenlenebilir: !!(l && yoklamaYetkisi(me, l))
        };
      });

      return ok(res, {
        ogrenci: { id: st.id, ad: st.fullName, classId: st.classId },
        tarih: tarih,
        gunAdi: GUN_ADLARI[haftaGun] || '',
        durumlar: DEVAM_DURUMLAR.map(x => ({ k: x, ad: DEVAM_AD[x] })),
        dersler: dersler
      });
    }

    /* Tek bir ders saatinin durumunu değiştir. */
    if (alt === 'isaretle' && method === 'POST') {
      const st = userById(clean(body.studentId, 60));
      if (!st || st.role !== 'student') return bad(res, 'Öğrenci bulunamadı');
      const l = byId(db.lessons, clean(body.lessonId, 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yoklamaYetkisi(me, l)) return bad(res, 'Bu ders için yetkin yok', 403);

      const tarih = gunBicimi(body.tarih);
      if (!tarih) return bad(res, 'Tarih gerekli');
      if (tarih > bugun()) return bad(res, 'İleri tarihe yoklama alınamaz');

      const durum = clean(body.durum, 10);
      if (DEVAM_DURUMLAR.indexOf(durum) < 0) return bad(res, 'Geçersiz durum');

      /* Eski kaydı sil, gerekirse yenisini yaz. */
      db.devamsizlik = db.devamsizlik.filter(k =>
        !(k.ogrenciId === st.id && k.lessonId === l.id && k.tarih === tarih));

      if (durum !== 'var') {
        db.devamsizlik.push({
          id: uid('dv'), schoolId: me.schoolId, classId: l.classId,
          lessonId: l.id, ogrenciId: st.id, tarih: tarih, durum: durum,
          not: clean(body.not, 200), alanId: me.id,
          yilId: yilDamgasi(me), createdAt: now()
        });
        const metin = tarih + ' ' + l.subject + ' dersi: ' + (DEVAM_AD[durum] || durum);
        notify(st.id, metin, '#/devamsizligim');
        for (const v of velileriBul(st.id)) {
          notify(v.id, st.fullName + ' — ' + metin, '#/cocuklarim');
        }
      }
      save();
      return ok(res, { durum: durum, message: 'Kaydedildi.' });
    }

    /* Okul geneli özet */
    if (alt === 'ozet' && method === 'GET') {
      if (!yetkiVarMi(me, 'devamsizlik.gor')) {
        return bad(res, 'Okul geneli devamsızlığı görme yetkin yok', 403);
      }
      const gun = Number(q.get('gun')) || 30;
      const sinir = new Date(Date.now() - gun * 86400000).toISOString().slice(0, 10);
      const kayitlar = yilSuz(me, db.devamsizlik.filter(k =>
        k.schoolId === me.schoolId && k.tarih >= sinir));

      const ogrHarita = new Map();
      for (const k of kayitlar) {
        if (!ogrHarita.has(k.ogrenciId)) {
          ogrHarita.set(k.ogrenciId, { yok: 0, gec: 0, izinli: 0 });
        }
        const h = ogrHarita.get(k.ogrenciId);
        if (h[k.durum] !== undefined) h[k.durum]++;
      }

      const satirlar = [];
      for (const [oid, h] of ogrHarita) {
        const o = userById(oid);
        if (!o) continue;
        const c = classById(o.classId);
        satirlar.push({
          id: oid, ad: o.fullName, sinif: c ? c.name : '',
          yok: h.yok, gec: h.gec, izinli: h.izinli,
          toplam: h.yok + h.gec + h.izinli
        });
      }
      satirlar.sort((a, b) => b.yok - a.yok || b.toplam - a.toplam);

      return ok(res, {
        gun: gun,
        toplamKayit: kayitlar.length,
        ogrenciSayisi: satirlar.length,
        satirlar: satirlar.slice(0, 300)
      });
    }
  }

  /* ---------- mesajlar ve duyurular ---------- */
  if (p === 'mesajlar') {
    if (!need()) return;
    if (!okulGerek(res, me)) return;
    const alt = segs[2] || '';

    /* Kime yazabilirim + hangi toplu seçenekler açık */
    if (alt === 'hedefler' && method === 'GET') {
      const kisiler = mesajYazilabilirler(me)
        .map(u => ({
          id: u.id, ad: u.fullName, rol: u.role,
          brans: u.role === 'teacher' ? branchOf(u) : '',
          kapali: !mesajGidebilirMi(me, u, 'mesaj')
        }))
        .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));

      return ok(res, {
        kisiler: kisiler,
        topluIzin: yetkiVarMi(me, 'mesaj.toplu'),
        okulIzin: yetkiVarMi(me, 'mesaj.herkese'),
        duyuruIzin: yetkiVarMi(me, 'mesaj.toplu'),
        siniflar: yetkiVarMi(me, 'mesaj.toplu')
          ? db.classes.filter(c => c.schoolId === me.schoolId)
              .map(c => ({ id: c.id, ad: c.name, sayi: sinifOgrencileri(c.id).length }))
              .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'))
          : []
      });
    }

    /* Mesaj izin ayarları */
    if (alt === 'ayar' && method === 'GET') {
      const a = mesajAyari(me);
      return ok(res, {
        kimden: a.kimden,
        engelli: a.engelli.map(id => {
          const u = userById(id);
          return u ? { id: u.id, ad: u.fullName, rol: u.role } : null;
        }).filter(Boolean)
      });
    }

    if (alt === 'ayar' && method === 'POST') {
      const kimden = clean(body.kimden, 20);
      if (['herkes', 'personel', 'kapali'].indexOf(kimden) < 0) {
        return bad(res, 'Geçersiz seçim');
      }
      const engelli = (Array.isArray(body.engelli) ? body.engelli : [])
        .map(x => clean(x, 60))
        .filter(id => {
          const u = userById(id);
          return u && u.schoolId === me.schoolId && u.id !== me.id;
        })
        .slice(0, 200);
      me.mesajAyar = { kimden, engelli };
      save();
      return ok(res, { kimden, engelli: engelli.length });
    }

    /* Gelen kutusu ve gönderilenler */
    if (!alt && method === 'GET') {
      const kutu = clean(q.get('kutu'), 20) || 'gelen';
      const tur = clean(q.get('tur'), 20);   /* '' | 'duyuru' | 'mesaj' */

      let liste;
      if (kutu === 'giden') {
        liste = db.mesajlar.filter(m => m.gonderenId === me.id);
      } else {
        liste = db.mesajlar.filter(m => m.alicilar.some(a => a.id === me.id));
      }
      if (tur) liste = liste.filter(m => m.tur === tur);

      liste.sort((a, b) => String(b.tarih).localeCompare(String(a.tarih)));
      const okunmamis = db.mesajlar.filter(m =>
        m.alicilar.some(a => a.id === me.id) &&
        (m.okuyanlar || []).indexOf(me.id) < 0).length;

      return ok(res, {
        kutu: kutu,
        okunmamis: okunmamis,
        mesajlar: liste.slice(0, 200).map(m => mesajOzeti(m, me.id))
      });
    }

    /* Ana sayfada gösterilecek son duyurular */
    if (alt === 'duyurular' && method === 'GET') {
      const liste = db.mesajlar
        .filter(m => m.tur === 'duyuru' && m.alicilar.some(a => a.id === me.id))
        .sort((a, b) => String(b.tarih).localeCompare(String(a.tarih)))
        .slice(0, 5);
      return ok(res, { duyurular: liste.map(m => mesajOzeti(m, me.id)) });
    }

    /* Yeni mesaj / duyuru */
    if (!alt && method === 'POST') {
      if (!hizSinir('mesaj:' + me.id, MESAJ_SAATLIK_SINIR, 60 * 60 * 1000)) {
        return bad(res, 'Saatlik mesaj sınırına ulaştın. Biraz bekle.', 429);
      }

      const tur = clean(body.tur, 20) === 'duyuru' ? 'duyuru' : 'mesaj';
      if (tur === 'duyuru' && !yetkiVarMi(me, 'mesaj.toplu')) {
        return bad(res, 'Duyuru yayımlama yetkin yok', 403);
      }

      const konu = clean(body.konu, MESAJ_KONU_SINIR);
      if (!konu) return bad(res, 'Konu yaz');
      const govde = clean(body.govde, MESAJ_GOVDE_SINIR);
      if (!govde) return bad(res, 'Mesaj metni boş olamaz');

      const cozum = mesajAlicilariCoz(me, body.hedef || {}, tur);
      if (cozum.hata) return bad(res, cozum.hata);
      if (!cozum.alicilar.length) {
        return bad(res, 'Alıcı kalmadı. Seçtiğin kişiler mesaj almayı kapatmış olabilir.');
      }

      const m = {
        id: uid('m'), schoolId: me.schoolId, gonderenId: me.id,
        tur: tur, konu: konu, govde: govde,
        hedefOzet: cozum.ozet, alicilar: cozum.alicilar,
        okuyanlar: [], tarih: now()
      };
      db.mesajlar.push(m);

      /* Bildirim: aynı kişiye birden çok kopya gitmesin. */
      const bildirildi = {};
      for (const a of cozum.alicilar) {
        if (bildirildi[a.id]) continue;
        bildirildi[a.id] = 1;
        notify(a.id, (tur === 'duyuru' ? 'Duyuru: ' : me.fullName + ': ') + konu,
          '#/mesajlar');
      }
      save();

      return ok(res, {
        mesaj: mesajOzeti(m, me.id),
        gonderilen: cozum.alicilar.length,
        elenen: cozum.elenen || 0,
        message: (tur === 'duyuru' ? 'Duyuru yayımlandı' : 'Mesaj gönderildi') +
          ' — ' + cozum.alicilar.length + ' kişiye ulaştı.' +
          (cozum.elenen ? ' ' + cozum.elenen + ' kişi mesaj almayı kapatmış.' : '')
      });
    }

    /* Tek mesaj: okundu işaretler */
    if (alt && method === 'GET') {
      const m = byId(db.mesajlar, clean(alt, 60));
      if (!m) return bad(res, 'Mesaj bulunamadı', 404);
      const alici = m.alicilar.some(a => a.id === me.id);
      if (!alici && m.gonderenId !== me.id) return bad(res, 'Bu mesajı görme yetkin yok', 403);

      if (alici && (m.okuyanlar || []).indexOf(me.id) < 0) {
        m.okuyanlar = m.okuyanlar || [];
        m.okuyanlar.push(me.id);
        save();
      }

      const detay = mesajOzeti(m, me.id);
      detay.govde = m.govde;
      /* Gönderen kimlerin okuduğunu görebilsin. */
      if (m.gonderenId === me.id) {
        detay.okuyanSayisi = (m.okuyanlar || []).length;
        detay.alicilar = m.alicilar.slice(0, 100).map(a => {
          const u = userById(a.id);
          return {
            ad: u ? u.fullName : 'Silinmiş',
            rol: u ? u.role : '',
            okudu: (m.okuyanlar || []).indexOf(a.id) >= 0,
            ogrenciAdi: a.ogrenciId && userById(a.ogrenciId)
              ? userById(a.ogrenciId).fullName : ''
          };
        });
      }
      return ok(res, { mesaj: detay });
    }

    /* Silme: gönderen tamamen siler, alıcı yalnızca kendinden kaldırır. */
    if (alt === 'sil' && method === 'POST') {
      const m = byId(db.mesajlar, clean(body.id, 60));
      if (!m) return bad(res, 'Mesaj bulunamadı', 404);

      if (m.gonderenId === me.id) {
        db.mesajlar = db.mesajlar.filter(x => x.id !== m.id);
        save();
        return ok(res, { message: 'Mesaj silindi.' });
      }
      if (m.alicilar.some(a => a.id === me.id)) {
        m.alicilar = m.alicilar.filter(a => a.id !== me.id);
        if (!m.alicilar.length) db.mesajlar = db.mesajlar.filter(x => x.id !== m.id);
        save();
        return ok(res, { message: 'Mesaj kutundan kaldırıldı.' });
      }
      return bad(res, 'Yetkin yok', 403);
    }
  }

  return bad(res, 'Böyle bir adres yok', 404);
}

/* Aydınlatma metninin sürümü. Metin değişirse burayı da artır:
   kullanıcıların onayı yeniden istenmelidir. */
const KVKK_SURUM = '1.1';

/* ============ ödev teslim saati ============
   Eski kayıtlarda yalnızca tarih vardı; saat alanı boşsa 12:00 sayılıyor.
   Çoğu öğretmen saati değiştirmiyor ama ders saatine göre ayarlayabilmeli. */

const ODEV_VARSAYILAN_SAAT = '12:00';

function odevSaati(a) {
  return saatDuzelt(a && a.endTime) || ODEV_VARSAYILAN_SAAT;
}

/* Ödevin son teslim anı — tarih + saat birleşmiş hâli. */
function odevBitisAni(a) {
  const t = clean(a && a.endAt, 10);
  if (!t) return null;
  const d = new Date(t + 'T' + odevSaati(a) + ':00');
  return isNaN(d.getTime()) ? null : d;
}

function odevGecikti(a) {
  const an = odevBitisAni(a);
  return an ? Date.now() > an.getTime() : false;
}

/* Sistem yöneticisinin okulu yok: schoolId'si boş. yetkiVarMi() admini
   her yetkiden geçirdiği için okul işlemleri de ona açık kalıyordu ve
   boş okula ait çöp kayıtlar oluşabiliyordu. Okula bağlı uçlar bunu
   açıkça reddetmeli. */
function okulGerek(res, me) {
  if (me && me.schoolId) return true;

  /* Veli kayıtta okul seçmiyor. Çocuğuna bağlıysa onun okuluna aittir;
     eskiden bağlanmış hesaplar için burada tamamlıyoruz. */
  if (me && me.role === 'parent') {
    const bag = db.parentLinks.find(l => l.parentId === me.id);
    const cocuk = bag ? userById(bag.studentId) : null;
    if (cocuk && cocuk.schoolId) {
      me.schoolId = cocuk.schoolId;
      save();
      return true;
    }
    bad(res, 'Önce çocuğunu hesabına bağlaman gerekiyor.', 403);
    return false;
  }

  bad(res, 'Bu işlem bir okula bağlı olmayı gerektirir. ' +
    'Yönetici hesabı bir okula ait değildir.', 403);
  return false;
}

/* ============ eğitim yılı ============

   Okul her yıl sıfırdan başlıyor: yeni sınıflar, yeni program, yeni ödevler.
   Ama eski yılın kaydı kaybolmamalı — veli geçen yılın devamsızlığına,
   müdür geçen yılın programına bakabilmeli.

   Çözüm: kayıtlar açıldıkları yıla damgalanıyor. Yılı olmayan eski
   kayıtlar okulun ilk yılına aitmiş gibi davranıyor. */

function okulYillari(schoolId) {
  return db.egitimYillari
    .filter(y => y.schoolId === schoolId)
    .sort((a, b) => String(b.ad).localeCompare(String(a.ad)));
}

function aktifYil(schoolId) {
  const liste = okulYillari(schoolId);
  return liste.find(y => y.aktif) || liste[0] || null;
}

/* Kullanıcının şu an baktığı yıl. Seçim yapmadıysa aktif yıl. */
function bakilanYil(me) {
  if (!me || !me.schoolId) return null;
  const liste = okulYillari(me.schoolId);
  if (!liste.length) return null;
  if (me.seciliYil) {
    const secili = liste.find(y => y.id === me.seciliYil);
    if (secili) return secili;
  }
  return aktifYil(me.schoolId);
}

/* Kayıt bu yıla ait mi? Damgasız kayıtlar en eski yıla sayılır. */
function yilaAitMi(kayit, yil, enEskiId) {
  if (!yil) return true;                       /* okulda yıl tanımlı değilse hepsi */
  const k = kayit && kayit.yilId;
  if (!k) return yil.id === enEskiId;
  return k === yil.id;
}

/* Bir listeyi bakılan yıla göre süzer. */
function yilSuz(me, liste) {
  const yil = bakilanYil(me);
  if (!yil) return liste;
  const hepsi = okulYillari(me.schoolId);
  const enEski = hepsi.length ? hepsi[hepsi.length - 1].id : null;
  return liste.filter(k => yilaAitMi(k, yil, enEski));
}

/* Yeni kayda basılacak yıl damgası. */
function yilDamgasi(me) {
  const y = bakilanYil(me);
  return y ? y.id : '';
}

/* Geçmiş yıla bakılırken yazma işlemleri kapalı — arşiv değiştirilmemeli. */
function arsivdeMi(me) {
  const bakilan = bakilanYil(me);
  const aktif = aktifYil(me.schoolId);
  return !!(bakilan && aktif && bakilan.id !== aktif.id);
}

/* ============ takvim ============

   Takvim üç kaynaktan besleniyor:
     1. Sabit özel günler  — her yıl aynı tarihte (23 Nisan, 29 Ekim...)
     2. Dinî bayramlar     — ay takvimine göre kaydığı için tablodan
     3. Okulun kendi kaydı — müdürün eklediği tatil, toplantı, etkinlik
   Üstüne ödev teslim tarihleri ve haftalık ders programı bindiriliyor. */

const SABIT_GUNLER = [
  { ay: 1, gun: 1, ad: 'Yılbaşı', tatil: true },
  { ay: 3, gun: 18, ad: 'Çanakkale Zaferi', tatil: false },
  { ay: 4, gun: 23, ad: 'Ulusal Egemenlik ve Çocuk Bayramı', tatil: true },
  { ay: 5, gun: 1, ad: 'Emek ve Dayanışma Günü', tatil: true },
  { ay: 5, gun: 19, ad: 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı', tatil: true },
  { ay: 7, gun: 15, ad: 'Demokrasi ve Millî Birlik Günü', tatil: true },
  { ay: 8, gun: 30, ad: 'Zafer Bayramı', tatil: true },
  { ay: 10, gun: 29, ad: 'Cumhuriyet Bayramı', tatil: true },
  { ay: 11, gun: 10, ad: 'Atatürk\'ü Anma Günü', tatil: false },
  { ay: 11, gun: 24, ad: 'Öğretmenler Günü', tatil: false }
];

/* Dinî bayramlar her yıl 10-11 gün kayıyor; hesaplanmıyor, tablodan okunuyor.
   Yeni yıl eklerken Diyanet takvimine bakıp buraya yaz. */
const DINI_BAYRAMLAR = {
  2026: [
    { bas: '2026-03-19', bit: '2026-03-22', ad: 'Ramazan Bayramı' },
    { bas: '2026-05-26', bit: '2026-05-30', ad: 'Kurban Bayramı' }
  ]
};

function tarihEkle(harita, tarih, kayit) {
  if (!harita[tarih]) harita[tarih] = [];
  harita[tarih].push(kayit);
}

/* Verilen ay için özel günleri tarih->liste haritası olarak döndürür. */
function ozelGunler(yil, ay) {
  const harita = {};
  const iki = n => (n < 10 ? '0' : '') + n;

  for (const g of SABIT_GUNLER) {
    if (g.ay !== ay) continue;
    tarihEkle(harita, yil + '-' + iki(g.ay) + '-' + iki(g.gun), {
      tur: g.tatil ? 'tatil' : 'ozel', baslik: g.ad
    });
  }

  for (const b of (DINI_BAYRAMLAR[yil] || [])) {
    const bas = new Date(b.bas + 'T00:00:00');
    const bit = new Date(b.bit + 'T00:00:00');
    for (let d = new Date(bas); d <= bit; d.setDate(d.getDate() + 1)) {
      if (d.getMonth() + 1 !== ay) continue;
      const t = d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate());
      tarihEkle(harita, t, {
        tur: 'tatil',
        baslik: b.ad + (t === b.bas ? ' (arife)' : '')
      });
    }
  }
  return harita;
}

/* Takvimde hangi öğrencinin gözünden bakılıyor? */
function takvimHedefi(me, istenenId) {
  if (me.role === 'student') return me;
  if (!istenenId) return null;
  const st = userById(clean(istenenId, 60));
  if (!st || st.role !== 'student') return null;
  if (me.role === 'parent') {
    return db.parentLinks.some(l => l.parentId === me.id && l.studentId === st.id)
      ? st : null;
  }
  if (me.schoolId !== st.schoolId) return null;
  return st;
}

/* ============ işlem kaydı ============
   Hesap açma, yetki değiştirme, toplu aktarım, yedekten dönme gibi
   geri alması zor işlemler kaydediliyor. "Kim sildi?" sorusunun
   cevabı olmadan bir okul sistemi güvenilir sayılmaz.

   Sıradan okuma istekleri kaydedilmiyor; tablo bir günde şişerdi. */

const ISLEM_SINIR = 5000;   // en fazla kaç kayıt saklansın

const ISLEM_AD = {
  'hesap.acildi': 'Hesap açıldı',
  'hesap.silindi': 'Hesap silindi',
  'hesap.toplu-acildi': 'Excel ile toplu hesap açıldı',
  'sifre.sifirlandi': 'Şifre sıfırlandı (kullanıcı)',
  'sifre.mudur-degistirdi': 'Şifre yönetici tarafından değiştirildi',
  'rol.olusturuldu': 'Rol oluşturuldu',
  'rol.degistirildi': 'Rol yetkileri değiştirildi',
  'rol.silindi': 'Rol silindi',
  'rol.atandi': 'Kullanıcıya rol atandı',
  'ogretmen.onaylandi': 'Öğretmen onaylandı',
  'ogretmen.cikarildi': 'Öğretmen okuldan çıkarıldı',
  'program.toplu-eklendi': 'Excel ile ders programı eklendi',
  'yedek.geri-yuklendi': 'Yedekten geri yüklendi',
  'yedek.silindi': 'Yedek silindi',
  'giris.basarisiz': 'Başarısız giriş denemesi',
  'yil.acildi': 'Eğitim yılı açıldı',
  'yil.aktif-degisti': 'Aktif eğitim yılı değişti'
};

function islemYaz(kisi, islem, detay, req) {
  try {
    db.islemKaydi.push({
      id: uid('ik'),
      schoolId: kisi && kisi.schoolId ? kisi.schoolId : '',
      userId: kisi ? kisi.id : '',
      userAd: kisi ? kisi.fullName : '(bilinmiyor)',
      userRol: kisi ? kisi.role : '',
      islem: islem,
      detay: clean(detay, 300),
      ip: req ? istemciIp(req) : '',
      tarih: now()
    });
    /* Sınırı aşınca en eskileri at. */
    if (db.islemKaydi.length > ISLEM_SINIR) {
      db.islemKaydi = db.islemKaydi.slice(-ISLEM_SINIR);
    }
  } catch (e) {
    console.error('Islem kaydi yazilamadi:', e.message);
  }
}

/* ============ devamsızlık ============
   Yoklama ders saati bazında alınır: aynı gün farklı derslerde ayrı kayıt.
   "var" durumundakiler saklanmaz — yalnızca devamsızlıklar tutulur,
   böylece tablo gereksiz büyümez. */

const DEVAM_DURUMLAR = ['var', 'yok', 'gec', 'izinli'];
const DEVAM_AD = {
  var: 'Geldi', yok: 'Gelmedi', gec: 'Geç geldi', izinli: 'İzinli'
};

function gunBicimi(metin) {
  const s2 = clean(metin, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s2) ? s2 : '';
}

function bugun() {
  const d = new Date();
  const i = n => (n < 10 ? '0' : '') + n;
  return d.getFullYear() + '-' + i(d.getMonth() + 1) + '-' + i(d.getDate());
}

/* Bir derse yoklama alabilir mi?

   Öğretmenlerde 'devamsizlik.al' varsayılan olarak açık ve kapsamsız gelir;
   tek başına bırakılırsa herhangi bir öğretmen, hiç girmediği bir derste
   öğrenciyi devamsız yazabilirdi. Bu yüzden öğretmen için ek şart:
   ya ders kendisinin, ya da müdür ona bu ders/sınıf için açıkça kapsam vermiş. */
function yoklamaYetkisi(u, l) {
  if (!l) return false;
  if (!yetkiVarMi(u, 'devamsizlik.al', { ders: l.subject, sinif: l.classId })) return false;
  if (u.role !== 'teacher') return true;
  if (l.teacherId === u.id) return true;
  return !!yetkiKapsami(u, 'devamsizlik.al');
}

/* Bir öğrencinin devamsızlık dökümü. */
function devamsizlikOzeti(ogrenciId, gunSayisi, bakan) {
  const kayitlar = (bakan ? yilSuz(bakan, db.devamsizlik) : db.devamsizlik)
    .filter(k => k.ogrenciId === ogrenciId)
    .sort((a, b) => String(b.tarih).localeCompare(String(a.tarih)));

  const sinir = gunSayisi ? new Date(Date.now() - gunSayisi * 86400000)
    .toISOString().slice(0, 10) : '';
  const suzulmus = sinir ? kayitlar.filter(k => k.tarih >= sinir) : kayitlar;

  const sayim = { yok: 0, gec: 0, izinli: 0 };
  for (const k of suzulmus) if (sayim[k.durum] !== undefined) sayim[k.durum]++;

  return {
    sayim: sayim,
    toplam: suzulmus.length,
    kayitlar: suzulmus.slice(0, 200).map(k => {
      const l = byId(db.lessons, k.lessonId);
      const alan = userById(k.alanId);
      return {
        id: k.id, tarih: k.tarih, durum: k.durum,
        durumAd: DEVAM_AD[k.durum] || k.durum,
        ders: l ? l.subject : '', not: k.not || '',
        alan: alan ? alan.fullName : ''
      };
    })
  };
}

/* ============ mesajlaşma ve duyurular ============

   Tek tablo iki iş görüyor:
     duyuru — müdür/öğretmen yazar, hedef gruba düşer, cevaplanmaz
     mesaj  — kişiye yazılır, alıcının izin ayarına takılabilir

   Öğrenciye giden her şeyin bir kopyası velisine de düşer; veli
   çocuğuna ne söylendiğini görebilmeli. */

const MESAJ_KONU_SINIR = 120;
const MESAJ_GOVDE_SINIR = 4000;
const MESAJ_SAATLIK_SINIR = 30;

/* Alıcı bir öğrenciyse velilerini de listeye ekler. */
function velileriBul(ogrenciId) {
  return db.parentLinks
    .filter(l => l.studentId === ogrenciId)
    .map(l => userById(l.parentId))
    .filter(v => v && v.status === 'approved');
}

function mesajAyari(u) {
  const a = u.mesajAyar || {};
  return {
    kimden: ['herkes', 'personel', 'kapali'].indexOf(a.kimden) >= 0 ? a.kimden : 'herkes',
    engelli: Array.isArray(a.engelli) ? a.engelli : []
  };
}

/* Gönderen bu kişiye yazabilir mi?
   Duyurular ayarları aşar: kar tatili duyurusu herkese ulaşmalı. */
function mesajGidebilirMi(gonderen, alici, tur) {
  if (!alici || alici.status !== 'approved') return false;
  if (alici.id === gonderen.id) return false;
  if (tur === 'duyuru') return true;

  const ayar = mesajAyari(alici);
  if (ayar.engelli.indexOf(gonderen.id) >= 0) return false;
  if (ayar.kimden === 'kapali') return false;
  if (ayar.kimden === 'personel' &&
      gonderen.role !== 'teacher' && gonderen.role !== 'principal') return false;
  return true;
}

/* Kişi mesaj kutusunda kimleri görebilir / kime yazabilir.
   Öğrenci ve veli yalnızca ilgili öğretmenlere ve müdüre yazabilir;
   böylece okul içi rehber listesi herkese açılmıyor. */
function mesajYazilabilirler(me) {
  const okul = db.users.filter(u =>
    u.schoolId === me.schoolId && u.status === 'approved' && u.id !== me.id);

  if (me.role === 'principal' || me.role === 'teacher') return okul;

  if (me.role === 'student') {
    const ogretmenler = teachersOfStudent(me.id).map(t => t.id);
    return okul.filter(u => u.role === 'principal' || ogretmenler.indexOf(u.id) >= 0);
  }

  if (me.role === 'parent') {
    const cocuklar = db.parentLinks.filter(l => l.parentId === me.id).map(l => l.studentId);
    const ogretmenler = [];
    for (const c of cocuklar) {
      for (const t of teachersOfStudent(c)) {
        if (ogretmenler.indexOf(t.id) < 0) ogretmenler.push(t.id);
      }
    }
    return okul.filter(u => u.role === 'principal' || ogretmenler.indexOf(u.id) >= 0);
  }
  return [];
}

/* Hedef tanımını gerçek kullanıcı listesine çevirir. */
function mesajAlicilariCoz(me, hedef, tur) {
  const okul = db.users.filter(u =>
    u.schoolId === me.schoolId && u.status === 'approved');
  let secilen = [];
  let ozet = '';

  const t = clean(hedef && hedef.tur, 20);

  if (t === 'okul') {
    if (!yetkiVarMi(me, 'mesaj.herkese')) return { hata: 'Tüm okula gönderme yetkin yok' };
    secilen = okul.slice();
    ozet = 'Tüm okul';

  } else if (t === 'rol') {
    if (!yetkiVarMi(me, 'mesaj.toplu')) return { hata: 'Toplu gönderme yetkin yok' };
    const roller = (Array.isArray(hedef.roller) ? hedef.roller : [])
      .map(r => clean(r, 20))
      .filter(r => ['student', 'parent', 'teacher', 'principal'].indexOf(r) >= 0);
    if (!roller.length) return { hata: 'En az bir rol seç' };
    secilen = okul.filter(u => roller.indexOf(u.role) >= 0);
    const ROL_AD = { student: 'Öğrenciler', parent: 'Veliler',
      teacher: 'Öğretmenler', principal: 'Yöneticiler' };
    ozet = roller.map(r => ROL_AD[r]).join(', ');

  } else if (t === 'sinif') {
    if (!yetkiVarMi(me, 'mesaj.toplu')) return { hata: 'Toplu gönderme yetkin yok' };
    const idler = (Array.isArray(hedef.siniflar) ? hedef.siniflar : [])
      .map(x => clean(x, 60));
    if (!idler.length) return { hata: 'En az bir sınıf seç' };
    const adlar = [];
    for (const cid of idler) {
      const c = classById(cid);
      if (!c || c.schoolId !== me.schoolId) continue;
      adlar.push(c.name);
      for (const o of sinifOgrencileri(cid)) {
        if (secilen.indexOf(o) < 0) secilen.push(o);
      }
    }
    if (!adlar.length) return { hata: 'Sınıf bulunamadı' };
    ozet = adlar.join(', ');

  } else if (t === 'kisi') {
    const izinli = mesajYazilabilirler(me);
    const idler = (Array.isArray(hedef.kisiler) ? hedef.kisiler : [])
      .map(x => clean(x, 60));
    if (!idler.length) return { hata: 'En az bir kişi seç' };
    for (const id of idler) {
      const u = izinli.find(x => x.id === id);
      if (u && secilen.indexOf(u) < 0) secilen.push(u);
    }
    if (!secilen.length) return { hata: 'Seçtiğin kişilere yazma yetkin yok' };
    ozet = secilen.length <= 3
      ? secilen.map(u => u.fullName).join(', ')
      : secilen.length + ' kişi';

  } else {
    return { hata: 'Geçersiz hedef' };
  }

  /* İzin ayarına takılanları ele. */
  const gecenler = secilen.filter(u => mesajGidebilirMi(me, u, tur));
  const elenen = secilen.length - gecenler.length;

  /* Öğrenciye giden her şey velisine de gitsin. */
  const alicilar = gecenler.map(u => ({ id: u.id, ogrenciId: '' }));
  const eklendi = {};
  for (const u of gecenler) {
    if (u.role !== 'student') continue;
    for (const veli of velileriBul(u.id)) {
      const anahtar = veli.id + '|' + u.id;
      if (eklendi[anahtar]) continue;
      if (alicilar.some(a => a.id === veli.id && a.ogrenciId === u.id)) continue;
      eklendi[anahtar] = 1;
      alicilar.push({ id: veli.id, ogrenciId: u.id });
    }
  }

  return { alicilar, ozet, elenen };
}

function mesajOzeti(m, benimId) {
  const gonderen = userById(m.gonderenId);
  const benim = m.alicilar.filter(a => a.id === benimId);
  const cocukIcin = benim.filter(a => a.ogrenciId).map(a => {
    const o = userById(a.ogrenciId);
    return o ? o.fullName : '';
  }).filter(Boolean);

  return {
    id: m.id,
    tur: m.tur,
    konu: m.konu,
    onizleme: String(m.govde || '').slice(0, 140),
    gonderenId: m.gonderenId,
    gonderen: gonderen ? gonderen.fullName : 'Silinmiş kullanıcı',
    gonderenRol: gonderen ? gonderen.role : '',
    tarih: m.tarih,
    hedefOzet: m.hedefOzet,
    aliciSayisi: m.alicilar.length,
    okundu: (m.okuyanlar || []).indexOf(benimId) >= 0,
    cocukIcin: cocukIcin
  };
}

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

/* ============ sunucu ============ */
loadDB();
ayarlariYukle();
okullariYukle();

const server = http.createServer((req, res) => {
  const method = req.method || 'GET';
  const urlPath = (req.url || '/').split('?')[0];
  const ip = istemciIp(req);

  /* Genel hiz siniri: tek bir IP sunucuyu istek yagmuruna tutamasin.
     Normal kullanimda bir sayfa ~10 istek atar, 300/dk fazlasiyla yeterli. */
  if (!hizSinir('genel:' + ip, 300, 60 * 1000)) {
    res.writeHead(429, baslikEkle({
      'Content-Type': 'application/json; charset=utf-8',
      'Retry-After': '60'
    }));
    return res.end(JSON.stringify({ error: 'Çok fazla istek gönderdin. Bir dakika bekle.' }));
  }

  if (urlPath.indexOf('/api/') === 0) {
    const segs = urlPath.split('/').filter(Boolean);
    Promise.resolve()
      .then(() => handleApi(req, res, segs, method))
      .catch(err => {
        const mesaj = (err && err.message) ? err.message : 'Sunucu hatası';
        /* Beklenen istemci hataları (çok büyük gövde, bozuk JSON) 500 değil:
           500 sunucunun kendi hatası demektir, günlüğü kirletmesin. */
        const kod = (err && err.kod) ? err.kod
          : (/çok büyük|Geçersiz veri/i.test(mesaj) ? 400 : 500);
        if (kod === 500) console.error('API hatası:', mesaj);
        if (!res.headersSent) bad(res, mesaj, kod);
      });
    return;
  }
  if (method !== 'GET' && method !== 'HEAD') { res.writeHead(405); return res.end(); }
  serveStatic(req, res, urlPath);
});

/* Slowloris: yavas istemci baglantilari acik tutup kaynak tuketemesin. */
server.headersTimeout = 20 * 1000;
server.requestTimeout = 30 * 1000;
server.keepAliveTimeout = 10 * 1000;
server.maxHeadersCount = 60;
server.maxConnections = 512;

/* Suresi gecmis oturumlari, hiz kayitlarini ve bot sorularini temizle. */
const temizlikSayaci = setInterval(guvenlikTemizle, 10 * 60 * 1000);
if (temizlikSayaci.unref) temizlikSayaci.unref();

/* Ders ve ödev hatırlatmaları */
const hatirlatmaSayaci = setInterval(hatirlatmalariCalistir, HATIRLATMA_ARALIK_MS);
if (hatirlatmaSayaci.unref) hatirlatmaSayaci.unref();

/* Günlük yedek */
const yedekSayaci = setInterval(yedekKontrol, YEDEK_ARALIK_MS);
if (yedekSayaci.unref) yedekSayaci.unref();
setTimeout(yedekKontrol, 20 * 1000);
setTimeout(hatirlatmalariCalistir, 10 * 1000);   // açılıştan kısa süre sonra bir kez

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error('\n  HATA: ' + PORT + ' portu kullanımda. Zaten açık olan pencereyi kapat veya');
    console.error('  farklı port ile başlat:  set PORT=3001 && node server.js\n');
  } else {
    console.error('Sunucu hatası:', err.message);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const nets = require('os').networkInterfaces();
  console.log('');
  console.log('  ==========================================');
  console.log('     EGITIM EVI calisiyor');
  console.log('     Bilgisayardan : http://localhost:' + PORT);
  for (const name in nets) {
    for (const n of nets[name]) {
      if (n.family === 'IPv4' && !n.internal) console.log('     Telefondan    : http://' + n.address + ':' + PORT);
    }
  }
  if (ayarlar.site && ayarlar.site.adres) {
    console.log('     Internetten   : ' + ayarlar.site.adres);
  }
  if (ayarlar.vekil && ayarlar.vekil.guven) {
    console.log('     Vekil guveni acik (' + ayarlar.vekil.baslik + ') - ters vekil arkasinda');
  }
  if (epostaKurulu()) {
    console.log('     Giris kodlari e-posta ile gonderilecek (' + ayarlar.eposta.sunucu + ')');
  } else {
    console.log('     ! E-posta ayarlanmamis: giris kodlari BU PENCEREYE yazilacak.');
    console.log('       Ayarlamak icin: data/ayarlar.json');
  }
  console.log('     Kapatmak icin bu pencereyi kapatin.');
  console.log('  ==========================================');
  console.log('');
});

process.on('SIGINT', () => { saveNow(); process.exit(0); });
process.on('SIGTERM', () => { saveNow(); process.exit(0); });
