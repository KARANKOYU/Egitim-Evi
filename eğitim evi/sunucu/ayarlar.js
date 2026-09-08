'use strict';
/* data/ayarlar.json — e-posta, site adresi ve ters vekil ayarları.
   Dosya yoksa varsayılanıyla oluşturulur. data/ klasörü web'den servis
   edilmediği için e-posta şifresi tarayıcıya sızmaz. */

const fs = require('fs');
const path = require('path');
const eposta = require('./yardimci/eposta');
const { DATA } = require('./yollar');

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

/* Değişmez nesne; yükleme yalnızca içini doldurur. */
const ayarlar = {};
function ayarlariYaz(yeni) {
  for (const k of Object.keys(ayarlar)) delete ayarlar[k];
  Object.assign(ayarlar, yeni);
}

function ayarlariYukle() {
  if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });
  if (!fs.existsSync(AYAR_DOSYA)) {
    fs.writeFileSync(AYAR_DOSYA, JSON.stringify(VARSAYILAN_AYAR, null, 2), 'utf8');
    ayarlariYaz(JSON.parse(JSON.stringify(VARSAYILAN_AYAR)));
    return;
  }
  try {
    const okunan = JSON.parse(fs.readFileSync(AYAR_DOSYA, 'utf8'));
    const yeni = Object.assign({}, VARSAYILAN_AYAR, okunan);
    yeni.eposta = Object.assign({}, VARSAYILAN_AYAR.eposta, okunan.eposta || {});
    yeni.vekil = Object.assign({}, VARSAYILAN_AYAR.vekil, okunan.vekil || {});
    yeni.site = Object.assign({}, VARSAYILAN_AYAR.site, okunan.site || {});
    ayarlariYaz(yeni);
  } catch (e) {
    console.error('ayarlar.json okunamadi, varsayilan kullaniliyor:', e.message);
    ayarlariYaz(JSON.parse(JSON.stringify(VARSAYILAN_AYAR)));
  }
}

function epostaKurulu() {
  const e = ayarlar && ayarlar.eposta;
  return !!(e && e.etkin && e.sunucu && e.kullanici && e.sifre);
}


module.exports = {
  AYAR_DOSYA,
  VARSAYILAN_AYAR,
  ayarlar,
  ayarlariYaz,
  ayarlariYukle,
  epostaKurulu
};
