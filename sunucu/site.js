'use strict';
/* Herkese açık site bilgisi: açılış ve Hakkında sayfasındaki rakamlar,
   sayfanın altındaki iletişim bilgileri ve site ayarları.

     /api/site      GET   { sayilar: { okul, kisi, cevrimici }, iletisim: { eposta, telefon },
                            yapimcilar: [{ ad, github, katki }], bildirimAralikDk, cevrimiciDk }
     /api/uygulama  GET   { playStore, sayfa, alindi, surumler: [{ surum, ad, tarih, notlar,
                            apk: { ad, adres, boyut, sha256 } }] }   (egitimevi.org/indir/indir.html)

   Site ayarları (ayar(anahtar)): sistem yöneticisi yönetim panelinin "Site
   ayarları" bölümünden değiştirir (sunucu/bolumler/site-ayarlari.js, tablo
   site_ayarlari). Öncelik:
     1. veritabanındaki değer (yöneticinin kaydettiği),
     2. sunucudaki data/config.yml (örnek: belge/config.ornek.yml; web'den yazılmaz),
     3. kodun varsayılanı.
   Yapımcılar için 2. adım depodaki yapimcilar.json dosyasıdır.

     iletisim          { eposta, telefon }     sayfaların altı ve "+ Ekle > Müdür" penceresi
     yapimcilar        [{ ad, github, katki }] "Yapımcılar" düğmesi
     playStore         'https://play.google.com/...' ya da ''
     bildirimAralikDk  sitenin bildirimleri yoklama aralığı (1-30, varsayılan 5)
     cevrimiciDk       "şu an açık" sayma süresi (1-60, varsayılan 5); yoklama
                       aralığından kısa olamaz: en az yoklama aralığı + 1 dk kullanılır
     adminsAralikDk    data/admins.json dosyasına bakma aralığı (1-60, varsayılan 1)

   Ayar değişince sunucu yeniden başlamadan geçerli olur (bellekteki önbellek
   güncellenir; tek süreçli sunucu varsayılır).

   İletişim bilgileri depoya yazılmaz: depo herkese açık olduğu için kişisel
   e-posta ve telefon koda girmez; sunucuyu kuran kişi data/config.yml'e ya da
   yönetim panelinden veritabanına yazar. Alan boşsa o satır sayfada görünmez.
   data/config.yml değişince yeniden okunur (en geç 30 saniyede).

   "Şu an açık": son "çevrimiçi sayma süresi" içinde uygulamaya istek gönderen
   farklı kişi sayısı (açık uygulama bildirimleri yoklama aralığıyla yoklar).
   Yalnızca bellekte tutulur; kimin açık olduğu değil, yalnızca kaç kişi olduğu
   dışarı verilir. */

const fs = require('fs');
const path = require('path');
const { DATA } = require('./yollar');
const { ok } = require('./http');
const { depo } = require('./veri');
const uygulamaSurum = require('./uygulama-surum');

const CONFIG_DOSYASI = path.join(DATA, 'config.yml');
const YAPIMCI_DOSYASI = path.join(__dirname, '..', 'yapimcilar.json');
const SAYI_ONBELLEK_SURESI = 60 * 1000;

/* Aralık ayarları (dakika): sınırlar, varsayılan ve config.yml'deki adı
   (araliklar: bölümü). */
const ARALIKLAR = {
  bildirimAralikDk: { en: 1, cok: 30, varsayilan: 5, config: 'bildirim_dk' },
  cevrimiciDk: { en: 1, cok: 60, varsayilan: 5, config: 'cevrimici_dk' },
  adminsAralikDk: { en: 1, cok: 60, varsayilan: 1, config: 'admins_dk' }
};
const YAPIMCI_EN_COK = 50;
const YAPIMCI_AD_EN_COK = 60;
const YAPIMCI_KATKI_EN_COK = 80;

/* ---------------- data/config.yml ----------------
   YAML'ın yalnızca şu kadarı okunur (paket kullanmamak için elle):
     anahtar: değer          (tırnaklı ya da tırnaksız)
     bolum:                  (altındaki girintili satırlar bu bölüme girer)
       anahtar: değer
     # yorum                 (satır başında ya da değerden sonra boşlukla)  */
function yamlOku(metin) {
  const kok = {};
  let bolum = null;
  for (const hamSatir of String(metin).split(/\r?\n/)) {
    const satir = hamSatir.replace(/^\s*#.*$/, '').replace(/\s+#.*$/, '');
    const m = /^(\s*)([A-Za-z0-9_-]+):\s*(.*)$/.exec(satir);
    if (!m) continue;
    const girintili = m[1].length > 0;
    const deger = m[3].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    if (!girintili) {
      if (deger === '') bolum = kok[m[2]] = {};
      else { kok[m[2]] = deger; bolum = null; }
    } else if (bolum) {
      bolum[m[2]] = deger;
    }
  }
  return kok;
}

/* İletişim e-postası: hesap e-postalarıyla aynı, yalnız ASCII (ortak.js epostaSorunu;
   Türkçe ya da başka alfabeden harf yok); sayfadaki bağlantıya girdiği için boşluk,
   < > " ' de olmaz. İzinli karakterler: ! # $ % & ( ) * + , - . / 0-9 : ; = ? A-Z [ \ ] ^ _ ` a-z { | } ~ */
const EPOSTA = /^[!#-&(-;=?A-~]{1,64}@[!#-&(-;=?A-~]{1,190}\.[a-z]{2,}$/i;
const PLAY_STORE = /^https:\/\/play\.google\.com\/[^\s"'<>]{4,300}$/;

/* Sayfada gösterilecek iletişim bilgisi: biçimi bozuk olan alan boş sayılır. */
function iletisimTemizle(il) {
  il = il && typeof il === 'object' ? il : {};
  const eposta = String(il.eposta || '').trim().slice(0, 254);
  const telefon = String(il.telefon || '').replace(/[^0-9+() -]/g, '').trim().slice(0, 24);
  return {
    eposta: EPOSTA.test(eposta) ? eposta : '',
    telefon: telefon.replace(/[^0-9]/g, '').length >= 7 ? telefon : ''
  };
}

function playStoreTemizle(v) {
  const s = String(v || '').trim();
  return PLAY_STORE.test(s) ? s : '';
}

/* Tam sayı ve sınır içindeyse sayı, değilse null. */
function aralikTemizle(anahtar, v) {
  const t = ARALIKLAR[anahtar];
  const n = typeof v === 'number' ? v : (/^\s*\d{1,4}\s*$/.test(String(v == null ? '' : v)) ? Number(v) : NaN);
  return Number.isInteger(n) && n >= t.en && n <= t.cok ? n : null;
}

let config = { iletisim: { eposta: '', telefon: '' }, playStore: '', araliklar: {}, iletisimVar: false, playStoreVar: false };
let configZamani = -1;

/* Dosya en fazla 30 saniyede bir yoklanır; değiştiyse yeniden okunur. */
let sonYoklama = 0;
function configGuncel() {
  const simdi = Date.now();
  if (simdi - sonYoklama < 30 * 1000) return config;
  sonYoklama = simdi;
  let zaman = 0;
  try { zaman = fs.statSync(CONFIG_DOSYASI).mtimeMs; } catch (e) { zaman = 0; }
  if (zaman === configZamani) return config;
  configZamani = zaman;
  let ham = {};
  try { ham = zaman ? yamlOku(fs.readFileSync(CONFIG_DOSYASI, 'utf8')) : {}; } catch (e) { ham = {}; }
  const iletisim = iletisimTemizle(ham.iletisim);
  /* Uygulama Play Store'a çıkınca oranın adresi (indirme sayfasında düğme olur). */
  const playStore = playStoreTemizle((ham.uygulama || {}).playstore);
  /* Aralıklar (dakika): araliklar: bildirim_dk, cevrimici_dk, admins_dk. Bozuk değer yok sayılır. */
  const hamAralik = ham.araliklar && typeof ham.araliklar === 'object' ? ham.araliklar : {};
  const araliklar = {};
  for (const k of Object.keys(ARALIKLAR)) {
    const n = aralikTemizle(k, hamAralik[ARALIKLAR[k].config]);
    if (n !== null) araliklar[k] = n;
  }
  config = {
    iletisim, playStore, araliklar,
    iletisimVar: !!(iletisim.eposta || iletisim.telefon),
    playStoreVar: !!playStore
  };
  return config;
}

/* ---------------- yapimcilar.json ----------------
   Dosya bozuksa ya da yoksa liste boş gelir, sayfa depo bağlantısını gösterir.
   GitHub kullanıcı adı GitHub'ın kuralına uymalı (harf, rakam, tire). */
const GITHUB_ADI = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
let yapimcilar = [];
let yapimciZamani = -1;
let yapimciYoklama = 0;

/* Liste sayfada gösterilecek biçime getirilir (dosyadan ya da veritabanından). */
function yapimcilariTemizle(ham) {
  return (Array.isArray(ham) ? ham : []).slice(0, YAPIMCI_EN_COK).map(y => ({
    ad: String((y && y.ad) || '').trim().slice(0, YAPIMCI_AD_EN_COK),
    github: GITHUB_ADI.test(String((y && y.github) || '')) ? String(y.github) : '',
    katki: String((y && y.katki) || '').trim().slice(0, YAPIMCI_KATKI_EN_COK)
  })).filter(y => y.ad);
}

function yapimcilariGuncel() {
  const simdi = Date.now();
  if (simdi - yapimciYoklama < 30 * 1000) return yapimcilar;
  yapimciYoklama = simdi;
  let zaman = 0;
  try { zaman = fs.statSync(YAPIMCI_DOSYASI).mtimeMs; } catch (e) { zaman = 0; }
  if (zaman === yapimciZamani) return yapimcilar;
  yapimciZamani = zaman;
  let ham = [];
  try { ham = zaman ? JSON.parse(fs.readFileSync(YAPIMCI_DOSYASI, 'utf8')) : []; } catch (e) { ham = []; }
  yapimcilar = yapimcilariTemizle(ham);
  return yapimcilar;
}

/* ---------------- site ayarları: veritabanı > config.yml > varsayılan ----------------
   ayarKaynakli(anahtar) -> { deger, kaynak, guncelleyen, zaman }
     kaynak: 'veritabani' (yöneticinin kaydettiği), 'config' (data/config.yml),
             'dosya' (yapimcilar.json), 'varsayilan'
   ayar(anahtar)         -> yalnız değer */
const AYAR_ANAHTARLARI = ['iletisim', 'yapimcilar', 'playStore'].concat(Object.keys(ARALIKLAR));

function ayarKaynakli(anahtar) {
  const db = depo.siteAyarlari.oku(anahtar);
  const dbden = deger => ({ deger, kaynak: 'veritabani', guncelleyen: db.guncelleyenAd, zaman: db.zaman });
  const c = configGuncel();
  if (anahtar === 'iletisim') {
    if (db) return dbden(iletisimTemizle(db.deger));
    return { deger: c.iletisim, kaynak: c.iletisimVar ? 'config' : 'varsayilan', guncelleyen: '', zaman: null };
  }
  if (anahtar === 'playStore') {
    if (db) return dbden(playStoreTemizle(db.deger));
    return { deger: c.playStore, kaynak: c.playStoreVar ? 'config' : 'varsayilan', guncelleyen: '', zaman: null };
  }
  if (anahtar === 'yapimcilar') {
    if (db && Array.isArray(db.deger)) return dbden(yapimcilariTemizle(db.deger));
    return { deger: yapimcilariGuncel(), kaynak: 'dosya', guncelleyen: '', zaman: null };
  }
  if (ARALIKLAR[anahtar]) {
    const n = db ? aralikTemizle(anahtar, db.deger) : null;
    if (n !== null) return dbden(n);
    if (c.araliklar[anahtar] !== undefined) return { deger: c.araliklar[anahtar], kaynak: 'config', guncelleyen: '', zaman: null };
    return { deger: ARALIKLAR[anahtar].varsayilan, kaynak: 'varsayilan', guncelleyen: '', zaman: null };
  }
  return null;
}

function ayar(anahtar) {
  const a = ayarKaynakli(anahtar);
  return a ? a.deger : null;
}

/* Çevrimiçi sayma süresi (dakika). Açık sayfa ancak yoklama aralığıyla istek
   gönderir; süre ondan kısa olursa açık olan kişi iki yoklama arasında
   "kapalı" görünürdü: en az yoklama aralığı + 1 dk kullanılır. */
function cevrimiciEtkinDk() {
  return Math.max(ayar('cevrimiciDk'), ayar('bildirimAralikDk') + 1);
}

/* Giriş yapmış uygulamanın bilmesi gereken ayarlar (/api/me ve giriş cevabı). */
function istemciAyarlari() {
  return { bildirimAralikDk: ayar('bildirimAralikDk') };
}

/* ---------------- şu an açık olanlar ---------------- */
const sonGorulme = new Map();   // kişi (yetişkin hesabı ya da okul hesabı) -> zaman

function goruldu(kisiId) {
  if (kisiId) sonGorulme.set(kisiId, Date.now());
}

function acikSayisi() {
  const sinir = Date.now() - cevrimiciEtkinDk() * 60 * 1000;
  let sayi = 0;
  for (const [id, zaman] of sonGorulme) {
    if (zaman < sinir) sonGorulme.delete(id);
    else sayi++;
  }
  return sayi;
}

/* ---------------- rakamlar ---------------- */
let sayilar = null;
let sayilarZamani = 0;

async function veritabaniSayilari() {
  if (sayilar && Date.now() - sayilarZamani < SAYI_ONBELLEK_SURESI) return sayilar;
  sayilar = await depo.genel.siteSayilari();
  sayilarZamani = Date.now();
  return sayilar;
}

/* İki cevap da tarayıcıda saklanmaz (http.js sendJSON her JSON cevabına
   Cache-Control: no-store yazar): site ayarı değişince sayfa yenilenince hemen görünür. */
async function uclar(k) {
  const { res, p, method } = k;
  if (p === 'uygulama' && method === 'GET') {
    const s = await uygulamaSurum.surumler();
    return ok(res, { playStore: ayar('playStore'), sayfa: uygulamaSurum.SAYFA_ADRESI,
      alindi: s.alindi, surumler: s.surumler });
  }
  if (p !== 'site' || method !== 'GET') return false;
  const s = await veritabaniSayilari();
  return ok(res, {
    /* Kayıtlı kişi sayısı bir dakika önbellekte; açık olan ondan büyük görünmesin. */
    sayilar: { okul: s.okul, kisi: s.kisi, cevrimici: Math.min(acikSayisi(), s.kisi) },
    iletisim: ayar('iletisim'),
    yapimcilar: ayar('yapimcilar'),
    /* Sitenin bildirim yoklama aralığı ve "şu an açık" sayma süresi (dakika). */
    bildirimAralikDk: ayar('bildirimAralikDk'),
    cevrimiciDk: cevrimiciEtkinDk()
  });
}

/* Bellek temizliği: uzun süre kimse sayfayı açmasa da tablo büyümesin. */
const temizlik = setInterval(acikSayisi, 10 * 60 * 1000);
if (temizlik.unref) temizlik.unref();

/* Yöneticiye ulaşma yolu var mı (e-posta ya da telefon)? İkisi de boşsa
   okulunu açtırmak isteyen kişi kodunu kime vereceğini göremez; sunucu
   açılışta uyarır (sunucu/index.js). */
function iletisimVarMi() {
  const il = ayar('iletisim');
  return !!(il.eposta || il.telefon);
}

module.exports = {
  uclar, goruldu, acikSayisi, yamlOku, iletisimVarMi,
  ARALIKLAR, AYAR_ANAHTARLARI, EPOSTA, PLAY_STORE, GITHUB_ADI, YAPIMCI_EN_COK, YAPIMCI_AD_EN_COK, YAPIMCI_KATKI_EN_COK,
  ayar, ayarKaynakli, cevrimiciEtkinDk, istemciAyarlari, configGuncel
};
