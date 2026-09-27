'use strict';
/* Yönetim paneli > "Site ayarları" (yalnız sistem yöneticisi; api.js yönetici
   olmayana bu uçları bilinmeyen adres gibi 404 verir).

     GET  /api/admin/site-ayarlari   -> { ayarlar: { <anahtar>: { deger, kaynak, guncelleyen, zaman, ... } },
                                          sinirlar }
     POST /api/admin/site-ayarlari   { anahtar, deger } ya da { anahtar, sifirla: true }
                                     -> aynı görünüm + message
     GET  /api/admin/okul-adresleri  -> { okullar: [{ id, ad, il, ilce, durum, kisaAd, adres }], siteAdresi }
     POST /api/admin/okul-adres      { okulId, kisaAd } -> { okul, eskiKisaAd, message }

   Ayarların anlamı ve öncelik (veritabanı > data/config.yml > varsayılan):
   sunucu/site.js. Değişiklik hemen geçerli olur (bellekteki önbellek
   güncellenir) ve işlem kaydına okulsuz yazılır (yalnız yönetici görür).
   data/config.yml web'den yazılmaz: "sifirla" veritabanındaki değeri siler,
   ayar config.yml'deki (yoksa varsayılan) değere döner. */

const { ok, sendJSON, okulOnbellekBosalt } = require('../http');
const { ayarlar: sunucuAyarlari } = require('../ayarlar');
const { clean, epostaSorunu, kisaAdSorunu, telefonSorunu } = require('../ortak');
const site = require('../site');
const { depo, topluBildir } = require('../veri');
const { islemYaz } = require('./islem-kaydi');

const AD = {
  iletisim: 'İletişim bilgileri',
  yapimcilar: 'Yapımcılar',
  playStore: 'Play Store bağlantısı',
  bildirimAralikDk: 'Bildirim yoklama aralığı',
  cevrimiciDk: 'Çevrimiçi sayma süresi',
  adminsAralikDk: 'admins.json okuma aralığı'
};
const ISLEM = {
  iletisim: 'site.iletisim', yapimcilar: 'site.yapimcilar', playStore: 'site.playstore',
  bildirimAralikDk: 'site.aralik', cevrimiciDk: 'site.aralik', adminsAralikDk: 'site.aralik'
};

/* Ekrandaki görünüm: her ayarın değeri, nereden geldiği, son değiştiren. */
function gorunum() {
  const liste = {};
  for (const k of site.AYAR_ANAHTARLARI) {
    const a = site.ayarKaynakli(k);
    liste[k] = { deger: a.deger, kaynak: a.kaynak, guncelleyen: a.guncelleyen || '', zaman: a.zaman || null };
    const t = site.ARALIKLAR[k];
    if (t) Object.assign(liste[k], { en: t.en, cok: t.cok, varsayilan: t.varsayilan });
  }
  /* Çevrimiçi sayma süresi yoklama aralığından kısa olamaz: kullanılan değer (etkin)
     ve ekranda kutunun altındaki not. Uyarı kutusu (uyari) yalnız yöneticinin
     kaydettiği (ya da config.yml'deki) süre kullanılamadığında çıkar; varsayılanlarla
     (5 ve 5 -> 6) bu kuralın kendisidir, not yeter. */
  const c = liste.cevrimiciDk;
  const etkin = site.cevrimiciEtkinDk();
  const neden = 'bildirim yoklama aralığı ' + liste.bildirimAralikDk.deger + ' dakika; çevrimiçi sayma süresi ondan en az 1 dakika uzun olmalı';
  c.etkin = etkin;
  c.not = etkin !== c.deger ? 'Kullanılan: ' + etkin + ' dakika (' + neden + ').' : '';
  c.uyari = etkin !== c.deger && c.kaynak !== 'varsayilan'
    ? (c.kaynak === 'veritabani' ? 'Kaydettiğin ' : 'data/config.yml\'deki ') + c.deger + ' dakika kullanılamıyor: ' +
      'bildirim yoklama aralığı ' + liste.bildirimAralikDk.deger + ' dakika olduğu için ' + etkin + ' dakika kullanılıyor.'
    : '';
  return {
    ayarlar: liste,
    sinirlar: { yapimciEnCok: site.YAPIMCI_EN_COK, adEnCok: site.YAPIMCI_AD_EN_COK, katkiEnCok: site.YAPIMCI_KATKI_EN_COK }
  };
}

/* Doğrulama: { deger } ya da { hata, alan, sira?, altAlan? }. */
function dogrula(anahtar, deger) {
  if (anahtar === 'iletisim') {
    if (!deger || typeof deger !== 'object' || Array.isArray(deger)) return { hata: 'İletişim bilgisi eksik.', alan: 'eposta' };
    if (typeof deger.eposta === 'object' || typeof deger.telefon === 'object') return { hata: 'İletişim bilgisi geçersiz.', alan: 'eposta' };
    const eposta = String(deger.eposta == null ? '' : deger.eposta).trim();
    const telefon = String(deger.telefon == null ? '' : deger.telefon).trim().replace(/\s+/g, ' ');
    /* Hesap e-postalarıyla aynı kural (ortak.js epostaSorunu: yalnız ASCII); ayrıca
       sayfadaki bağlantıya girdiği için < > " ' olmaz (site.js EPOSTA). */
    if (eposta) {
      const sorun = epostaSorunu(eposta);
      if (sorun && /Türkçe/.test(sorun)) return { hata: sorun, alan: 'eposta' };
      if (sorun || !site.EPOSTA.test(eposta)) return { hata: 'E-posta adresi geçerli değil (ör. iletisim@egitimevi.org).', alan: 'eposta' };
    }
    if (telefon) {
      if (telefon.length > 24 || /[^0-9+() -]/.test(telefon)) {
        return { hata: 'Telefonda yalnız rakam, boşluk, +, tire ve parantez olabilir (en fazla 24 karakter).', alan: 'telefon' };
      }
      const sorun = telefonSorunu(telefon);
      if (sorun) return { hata: sorun + '.', alan: 'telefon' };
    }
    return { deger: { eposta, telefon } };
  }

  if (anahtar === 'yapimcilar') {
    if (!Array.isArray(deger)) return { hata: 'Yapımcı listesi geçersiz.', alan: 'yapimcilar' };
    if (deger.length > site.YAPIMCI_EN_COK) {
      return { hata: 'En fazla ' + site.YAPIMCI_EN_COK + ' yapımcı eklenebilir.', alan: 'yapimcilar' };
    }
    const liste = [];
    for (let i = 0; i < deger.length; i++) {
      const y = deger[i];
      const satirHata = (altAlan, hata) => ({ hata: (i + 1) + '. yapımcı: ' + hata, alan: 'yapimcilar', sira: i, altAlan });
      if (!y || typeof y !== 'object' || Array.isArray(y)) return satirHata('ad', 'bilgisi eksik.');
      const ad = clean(y.ad, 1000).replace(/\s+/g, ' ');
      const github = clean(y.github, 1000);
      const katki = clean(y.katki, 1000).replace(/\s+/g, ' ');
      if (!ad) return satirHata('ad', 'adını yaz.');
      if (ad.length > site.YAPIMCI_AD_EN_COK) return satirHata('ad', 'ad en fazla ' + site.YAPIMCI_AD_EN_COK + ' karakter olabilir.');
      if (github && !site.GITHUB_ADI.test(github)) {
        return satirHata('github', 'GitHub kullanıcı adında yalnız harf, rakam ve tire olabilir; tireyle başlayıp bitemez (en fazla 39 karakter).');
      }
      if (katki.length > site.YAPIMCI_KATKI_EN_COK) return satirHata('katki', 'katkı en fazla ' + site.YAPIMCI_KATKI_EN_COK + ' karakter olabilir.');
      liste.push({ ad, github, katki });
    }
    return { deger: liste };
  }

  if (anahtar === 'playStore') {
    if (deger != null && typeof deger !== 'string') return { hata: 'Bağlantı geçersiz.', alan: 'playStore' };
    const s = String(deger || '').trim();
    if (s && !site.PLAY_STORE.test(s)) {
      return { hata: 'Bağlantı https://play.google.com/ ile başlamalı (ör. https://play.google.com/store/apps/details?id=...).', alan: 'playStore' };
    }
    return { deger: s };
  }

  const t = site.ARALIKLAR[anahtar];
  if (t) {
    const n = typeof deger === 'number' ? deger : (typeof deger === 'string' && /^\s*\d{1,4}\s*$/.test(deger) ? Number(deger) : NaN);
    if (!Number.isInteger(n) || n < t.en || n > t.cok) {
      return { hata: AD[anahtar] + ' ' + t.en + ' ile ' + t.cok + ' dakika arasında bir tam sayı olmalı.', alan: anahtar };
    }
    return { deger: n };
  }
  return { hata: 'Böyle bir ayar yok.', alan: 'anahtar' };
}

/* İşlem kaydındaki kısa açıklama. */
function ozet(anahtar, deger) {
  if (anahtar === 'iletisim') return 'e-posta: ' + (deger.eposta || '(boş)') + ', telefon: ' + (deger.telefon || '(boş)');
  if (anahtar === 'yapimcilar') return deger.length + ' yapımcı' + (deger.length ? ': ' + deger.map(y => y.ad).join(', ') : '');
  if (anahtar === 'playStore') return deger || '(boş)';
  return deger + ' dk';
}

/* İşlem kaydında değerin geldiği yer. */
function kaynakAdi(kaynak) {
  return kaynak === 'config' ? 'config.yml' : kaynak === 'dosya' ? 'yapimcilar.json' : 'varsayılan';
}

async function ayarKaydet(req, res, me, body) {
  const anahtar = clean(body.anahtar, 40);
  if (site.AYAR_ANAHTARLARI.indexOf(anahtar) < 0) return sendJSON(res, 400, { error: 'Böyle bir ayar yok.', alan: 'anahtar' });
  const onceki = site.ayarKaynakli(anahtar);

  if (body.sifirla === true) {
    if (onceki.kaynak === 'veritabani') {
      await depo.siteAyarlari.sil(anahtar);
      const sonra = site.ayarKaynakli(anahtar);
      await islemYaz(me, ISLEM[anahtar], AD[anahtar] + ': ' + kaynakAdi(sonra.kaynak) + ' değerine döndü (' +
        ozet(anahtar, sonra.deger) + ')', req);
    }
    if (anahtar === 'adminsAralikDk') require('../yonetici-dosyasi').aralikDegisti();
    return ok(res, Object.assign(gorunum(), { message: AD[anahtar] + ' ' + (onceki.kaynak === 'veritabani'
      ? 'panelden kaydedilen değeri bıraktı.' : 'zaten panelden kaydedilmemiş.') }));
  }

  if (body.deger === undefined) return sendJSON(res, 400, { error: 'Değer yok.', alan: anahtar === 'iletisim' ? 'eposta' : anahtar });
  const d = dogrula(anahtar, body.deger);
  if (d.hata) {
    const cevap = { error: d.hata, alan: d.alan };
    if (d.sira !== undefined) { cevap.sira = d.sira; cevap.altAlan = d.altAlan; }
    return sendJSON(res, 400, cevap);
  }
  const degerAyni = JSON.stringify(onceki.deger) === JSON.stringify(d.deger);
  const ayni = onceki.kaynak === 'veritabani' && degerAyni;
  /* Değer aynı ama config.yml'den ya da varsayılandan geliyordu: panelden
     sabitlenir (config.yml ya da varsayılan sonra değişse de bu değer kalır).
     İşlem kaydına "1 → 1 dk" gibi anlamsız bir değişiklik değil, bu yazılır. */
  const sabitlendi = !ayni && degerAyni;
  if (!ayni) {
    await depo.siteAyarlari.yaz(anahtar, d.deger, me);
    const eski = site.ARALIKLAR[anahtar] && !sabitlendi ? onceki.deger + ' → ' : '';
    await islemYaz(me, ISLEM[anahtar], AD[anahtar] + ': ' + eski + ozet(anahtar, d.deger) +
      (sabitlendi ? ' (' + kaynakAdi(onceki.kaynak) + ' değeri panelden sabitlendi)' : ''), req);
    if (anahtar === 'adminsAralikDk') require('../yonetici-dosyasi').aralikDegisti();
  }
  return ok(res, Object.assign(gorunum(), {
    message: ayni ? AD[anahtar] + ' zaten böyle.'
      : sabitlendi ? AD[anahtar] + ' panelden kaydedildi; değer aynı kaldı.'
        : AD[anahtar] + ' kaydedildi.'
  }));
}

/* ---------------- okul adresleri (egitimevi.org/school/<kısa ad>) ---------------- */
function siteAdresi() {
  return String((sunucuAyarlari.site && sunucuAyarlari.site.adres) || '').replace(/\/+$/, '');
}

async function okulAdresleri(res) {
  const liste = await depo.okullar.adresListesi();
  return ok(res, {
    okullar: liste.map(o => ({ id: o.id, ad: o.ad, il: o.il, ilce: o.ilce, durum: o.durum, kisaAd: o.kisa_ad || '',
      adres: o.kisa_ad ? '/school/' + o.kisa_ad : '' })),
    siteAdresi: siteAdresi()
  });
}

/* Müdürün kendi değiştirmesi (hesaplar.js) aynen durur; yönetici her okulun
   adresini değiştirebilir. Eski adres hemen çalışmaz olur (okul önbelleği boşalır). */
async function okulAdresiDegistir(req, res, me, body) {
  const alanHata = (alan, mesaj, durum) => sendJSON(res, durum || 400, { error: mesaj, alan });
  const okul = await depo.okullar.bul(clean(body.okulId, 60));
  if (!okul || okul.status === 'rejected') return alanHata('okulId', 'Okul bulunamadı.', 404);
  const kisa = clean(body.kisaAd, 60).toLowerCase();
  const sorun = kisaAdSorunu(kisa);
  if (sorun) return alanHata('kisaAd', sorun);
  const eski = okul.kisaAd || '';
  const okulCevap = { id: okul.id, ad: okul.name, kisaAd: kisa, adres: '/school/' + kisa };
  if (eski === kisa) return ok(res, { okul: okulCevap, eskiKisaAd: eski, message: 'Okulun adresi zaten bu.' });
  if (await depo.okullar.kisaAdVarMi(kisa, okul.id)) return alanHata('kisaAd', 'Bu adres başka bir okulda. Başka bir ad dene.');
  try {
    await depo.okullar.kisaAdYaz(okul.id, kisa);
  } catch (e) {
    /* Aynı anda başka okul aldı (tekil indeks). */
    if (e && e.code === '23505') return alanHata('kisaAd', 'Bu adres başka bir okulda. Başka bir ad dene.');
    throw e;
  }
  okulOnbellekBosalt();
  await islemYaz(me, 'okul.adres-yonetici', okul.name + ': ' + (eski || '(yok)') + ' → ' + kisa, req);
  await topluBildir(await depo.okullar.mudurKimlikleri(okul.id),
    'Okulunun adresi sistem yöneticisi tarafından değiştirildi: /school/' + kisa + '. Eski adres artık açılmıyor.');
  return ok(res, {
    okul: okulCevap, eskiKisaAd: eski,
    message: 'Okulun adresi değişti.' + (eski ? ' Eski adres (/school/' + eski + ') artık açılmıyor.' : '') +
      ' Okulun müdürüne bildirildi.'
  });
}

module.exports = { gorunum, dogrula, ayarKaydet, okulAdresleri, okulAdresiDegistir };
