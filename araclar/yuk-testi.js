'use strict';
/*
  Yük testi: bir yıllık, kalabalık bir okulun verisini test veritabanına
  doldurur ve her rolün ekranlarını gerçek HTTP istekleriyle ölçer.

  Doldurulan (varsayılan): 1 büyük okul — 24 sınıf x 30 öğrenci = 720 öğrenci,
  40 öğretmen, 600 veli; yılda ders başına 25 ödev (~144 bin öğrenci-ödev
  satırı), yazılılar ve LGS denemeleri (~50 bin değer), ~23 bin devamsızlık,
  duyuru ve sınıf mesajları, kişi başı ~200 bildirim (~280 bin); yanına 30
  küçük okul (yönetici ekranları için).

  Ölçülen: her uç için 1 ısınma + 5 ölçüm; ortanca ve en kötü süre, cevap
  boyutu. 150 ms üstü ya da 150 KB üstü "yavaş/ağır" işaretlenir. Yazma
  işlemleri (yoklama, ödev verme, not girme, okula duyuru) ve 10 eşzamanlı
  kullanıcı da ölçülür.

  Sunucunun hız sınırına (dakikada 300 istek) takılmamak için istekler
  aralıklı atılır.

  YALNIZCA test veritabanında çalışır (adı _test ile bitmeli). Çalıştırma:
    1. Test sunucusunu boş veritabanıyla aç:
       EE_DATA=testler/testdata EE_DB_SIFIRLA=1 PORT=3200 node server.js
    2. EE_DATA=testler/testdata EE_BASE=http://localhost:3200 node araclar/yuk-testi.js
*/

const crypto = require('crypto');
const { ayarlariYukle } = require('../sunucu/ayarlar');
ayarlariYukle();
const baglanti = require('../sunucu/veri/baglanti');
const { depo } = require('../sunucu/veri');
const { hashPw } = require('../sunucu/sifre');

const BASE = process.env.EE_BASE || 'http://localhost:3200';
const SINIF = 24, SINIF_MEVCUT = 30, OGRETMEN = 40, KUCUK_OKUL = 30;
const DERSLER = ['Matematik', 'Türkçe', 'Fen Bilimleri', 'İngilizce', 'Sosyal Bilgiler',
  'Din Kültürü ve Ahlak Bilgisi', 'Müzik', 'Beden Eğitimi'];
const YAVAS_MS = 150, AGIR_KB = 150;
const OLCUM_TEKRAR = 5, ISTEK_ARASI_MS = 230;

const bekle = ms => new Promise(r => setTimeout(r, ms));
const say = (() => { let n = 0; return p => p + '_y' + (++n).toString(36); })();
const gunOnce = n => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

/* Toplu ekleme: satırlar JSON olarak gider, json_populate_recordset tablonun
   kendi sütun tiplerine çevirir. Sütun adları koddan gelir. */
async function toplu(tablo, sutunlar, satirlar) {
  const ad = /^[a-z_]+$/;
  if (!ad.test(tablo) || !sutunlar.every(s => ad.test(s))) throw new Error('geçersiz ad');
  for (let i = 0; i < satirlar.length; i += 4000) {
    const parca = satirlar.slice(i, i + 4000);
    await baglanti.sorgu(
      'INSERT INTO ' + tablo + ' (' + sutunlar.join(', ') + ') SELECT ' + sutunlar.join(', ') +
      ' FROM json_populate_recordset(NULL::' + tablo + ', $1::json)', [JSON.stringify(parca)]);
  }
  return satirlar.length;
}

/* Ölçüm için oturum: 2 adımlı giriş yerine doğrudan oturum açılır. */
async function oturum(kullaniciId) {
  const anahtar = crypto.randomBytes(24).toString('hex');
  await depo.oturumlar.ac(anahtar, kullaniciId);
  return anahtar;
}

async function iste(yol, anahtar, method, govde) {
  const bas = process.hrtime.bigint();
  const r = await fetch(BASE + yol, {
    method: method || 'GET',
    headers: Object.assign({ Authorization: 'Bearer ' + anahtar, 'Accept-Encoding': 'br, gzip' },
      govde ? { 'Content-Type': 'application/json' } : {}),
    body: govde ? JSON.stringify(govde) : undefined
  });
  const metin = await r.text();
  const ms = Number(process.hrtime.bigint() - bas) / 1e6;
  let j = null;
  try { j = JSON.parse(metin); } catch (e) { /* yoksay */ }
  return { durum: r.status, ms, bayt: Buffer.byteLength(metin), govde: j };
}

(async () => {
  try {
    await doldur();
    await olcumler();
  } catch (e) {
    console.error('HATA:', e.stack || e.message);
    process.exitCode = 1;
  } finally {
    await baglanti.kapat();
  }
})();
