'use strict';
/* Herkese açık site bilgisi: açılış ve Hakkında sayfasındaki rakamlar ve
   sayfanın altındaki iletişim bilgileri.

     /api/site      GET   { sayilar: { okul, kisi, cevrimici }, iletisim: { eposta, telefon },
                            yapimcilar: [{ ad, github, katki }] }
     /api/uygulama  GET   { playStore, sayfa, alindi, surumler: [{ surum, ad, tarih, notlar,
                            apk: { ad, adres, boyut, sha256 } }] }   (egitimevi.org/indir)

   İletişim bilgileri depoda değil, sunucudaki data/config.yml dosyasındadır.
   Depo herkese açık olduğu için kişisel e-posta ve telefon koda yazılmaz;
   sunucuyu kuran kişi dosyaya yazar, sayfa oradan okur. Dosya yoksa ya da
   alan boşsa o satır sayfada görünmez. Dosya değişince yeniden okunur.
   Örnek: belge/config.ornek.yml

   Yapımcılar listesi depodaki yapimcilar.json dosyasındadır (herkese açık
   bilgi: ad, GitHub kullanıcı adı, katkı). Projeye katılan kendini oraya ekler.

   "Şu an açık": son 5 dakikada uygulamaya istek gönderen farklı kişi sayısı
   (açık uygulama her 30 saniyede bir bildirimleri yoklar). Yalnızca bellekte
   tutulur; kimin açık olduğu değil, yalnızca kaç kişi olduğu dışarı verilir. */

const fs = require('fs');
const path = require('path');
const { DATA } = require('./yollar');
const { ok } = require('./http');
const { depo } = require('./veri');
const uygulamaSurum = require('./uygulama-surum');

const CONFIG_DOSYASI = path.join(DATA, 'config.yml');
const YAPIMCI_DOSYASI = path.join(__dirname, '..', 'yapimcilar.json');
const ACIK_SAYILMA_SURESI = 5 * 60 * 1000;
const SAYI_ONBELLEK_SURESI = 60 * 1000;

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

const EPOSTA = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[a-z]{2,}$/i;

let config = { iletisim: { eposta: '', telefon: '' }, playStore: '' };
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
  const iletisim = ham.iletisim || {};
  const eposta = String(iletisim.eposta || '').trim().slice(0, 254);
  const telefon = String(iletisim.telefon || '').replace(/[^0-9+() -]/g, '').trim().slice(0, 24);
  /* Uygulama Play Store'a çıkınca oranın adresi (indirme sayfasında düğme olur). */
  const playStore = String((ham.uygulama || {}).playstore || '').trim();
  config = {
    iletisim: {
      eposta: EPOSTA.test(eposta) ? eposta : '',
      telefon: telefon.replace(/[^0-9]/g, '').length >= 7 ? telefon : ''
    },
    playStore: /^https:\/\/play\.google\.com\/[^\s"'<>]{4,300}$/.test(playStore) ? playStore : ''
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
  yapimcilar = (Array.isArray(ham) ? ham : []).slice(0, 50).map(y => ({
    ad: String((y && y.ad) || '').trim().slice(0, 60),
    github: GITHUB_ADI.test(String((y && y.github) || '')) ? String(y.github) : '',
    katki: String((y && y.katki) || '').trim().slice(0, 80)
  })).filter(y => y.ad);
  return yapimcilar;
}

/* ---------------- şu an açık olanlar ---------------- */
const sonGorulme = new Map();   // kişi (yetişkin hesabı ya da okul hesabı) -> zaman

function goruldu(kisiId) {
  if (kisiId) sonGorulme.set(kisiId, Date.now());
}

function acikSayisi() {
  const sinir = Date.now() - ACIK_SAYILMA_SURESI;
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

async function uclar(k) {
  const { res, p, method } = k;
  if (p === 'uygulama' && method === 'GET') {
    const s = await uygulamaSurum.surumler();
    res.setHeader('Cache-Control', 'public, max-age=300');
    return ok(res, { playStore: configGuncel().playStore, sayfa: uygulamaSurum.SAYFA_ADRESI,
      alindi: s.alindi, surumler: s.surumler });
  }
  if (p !== 'site' || method !== 'GET') return false;
  const s = await veritabaniSayilari();
  res.setHeader('Cache-Control', 'public, max-age=60');
  return ok(res, {
    /* Kayıtlı kişi sayısı bir dakika önbellekte; açık olan ondan büyük görünmesin. */
    sayilar: { okul: s.okul, kisi: s.kisi, cevrimici: Math.min(acikSayisi(), s.kisi) },
    iletisim: configGuncel().iletisim,
    yapimcilar: yapimcilariGuncel()
  });
}

/* Bellek temizliği: uzun süre kimse sayfayı açmasa da tablo büyümesin. */
const temizlik = setInterval(acikSayisi, 10 * 60 * 1000);
if (temizlik.unref) temizlik.unref();

module.exports = { uclar, goruldu, acikSayisi, yamlOku };
