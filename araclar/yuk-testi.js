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
const { kisiKoduUret } = require('../sunucu/ortak');   // veli kodu (027 şemasının biçimi)
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

async function doldur() {
  const vt = baglanti.veritabaniAdi();
  if (!/_test$/.test(vt)) throw new Error('Yük testi yalnızca test veritabanında çalışır (şu an: ' + vt + ')');
  const bos = (await baglanti.tek('SELECT count(*) AS n FROM okullar')).n;
  if (bos) throw new Error('Test veritabanı boş değil: sunucuyu EE_DB_SIFIRLA=1 ile aç');

  const t0 = Date.now();
  const ozet = await hashPw("Test1234!");   // herkes aynı şifre, bir kez hesaplanır
  const simdi = new Date().toISOString();
  const okul = 'o_buyuk';
  await toplu('okullar', ['id', 'meb_kodu', 'ad', 'il', 'ilce', 'tur', 'durum', 'olusturma'],
    [{ id: okul, meb_kodu: '', ad: 'Yük Testi Ortaokulu', il: 'Ankara', ilce: 'Çankaya', tur: '', durum: 'approved', olusturma: simdi }]
      .concat(Array.from({ length: KUCUK_OKUL }, (_, i) => ({
        id: 'o_kucuk' + i, meb_kodu: '', ad: 'Küçük Okul ' + (i + 1), il: 'İzmir', ilce: 'Bornova', tur: '',
        durum: 'approved', olusturma: simdi }))));

  const kisi = [];
  const kullanici = (id, eposta, ad, rol, ek) => Object.assign({
    id, eposta, sifre_ozeti: ozet, ad_soyad: ad, rol, durum: 'approved', okul_id: okul,
    kvkk_onay: true, kvkk_tarih: simdi, kvkk_surum: '1.2', olusturma: simdi
  }, ek || {});
  kisi.push(kullanici('u_mudur', 'mudur@yuk.test', 'Müdür Yük', 'principal', { brans: 'Müdür' }));
  for (let i = 0; i < KUCUK_OKUL; i++) {
    kisi.push(kullanici('u_kmudur' + i, 'mudur' + i + '@kucuk.test', 'Küçük Müdür ' + i, 'principal',
      { okul_id: 'o_kucuk' + i, brans: 'Müdür' }));
  }
  const ogretmenler = [];
  for (let i = 0; i < OGRETMEN; i++) {
    const id = 'u_ogrt' + i;
    ogretmenler.push({ id, brans: DERSLER[i % DERSLER.length] });
    kisi.push(kullanici(id, 'ogretmen' + i + '@yuk.test', 'Öğretmen ' + i, 'teacher', { brans: DERSLER[i % DERSLER.length] }));
  }

  const siniflar = [];
  for (let s = 0; s < SINIF; s++) siniflar.push({ id: 'c_' + s, okul_id: okul, ad: (5 + Math.floor(s / 6)) + '-' + 'ABCDEF'[s % 6], olusturma: simdi });
  await toplu('siniflar', ['id', 'okul_id', 'ad', 'olusturma'], siniflar);

  const ogrenciler = [];
  for (let s = 0; s < SINIF; s++) {
    for (let k = 0; k < SINIF_MEVCUT; k++) {
      const id = 'u_ogr' + s + '_' + k;
      ogrenciler.push({ id, sinif: 'c_' + s });
      kisi.push(kullanici(id, 'ogr' + s + '_' + k + '@yuk.test', 'Öğrenci ' + s + '-' + k, 'student',
        { sinif_id: 'c_' + s, veli_kodu: kisiKoduUret() }));
    }
  }
  const veliler = [];
  for (let i = 0; i < 600; i++) {
    const id = 'u_veli' + i;
    veliler.push(id);
    kisi.push(kullanici(id, 'veli' + i + '@yuk.test', 'Veli ' + i, 'parent', { okul_id: okul }));
  }
  await toplu('kullanicilar', Object.keys(kisi[0]).concat(['brans', 'sinif_id', 'veli_kodu']).filter((v, i, a) => a.indexOf(v) === i),
    kisi.map(k => Object.assign({ brans: '', sinif_id: null, veli_kodu: '' }, k)));
  await toplu('veli_baglari', ['id', 'veli_id', 'ogrenci_id', 'olusturma'],
    veliler.map((v, i) => ({ id: 'pl_' + i, veli_id: v, ogrenci_id: ogrenciler[i].id, olusturma: simdi }))
      .concat(veliler.slice(0, 120).map((v, i) => ({ id: 'pl2_' + i, veli_id: v, ogrenci_id: ogrenciler[600 + i].id, olusturma: simdi }))));

  /* Dersler, öğretmenleri ve haftalık program */
  const dersler = [], program = [];
  const saatler = [['08:30', '09:10'], ['09:20', '10:00'], ['10:10', '10:50'], ['11:00', '11:40'], ['12:30', '13:10'], ['13:20', '14:00'], ['14:10', '14:50']];
  for (let s = 0; s < SINIF; s++) {
    DERSLER.forEach((konu, d) => {
      const brans = ogretmenler.filter(o => o.brans === konu);
      const ogretmen = brans[s % brans.length].id;
      const id = 'd_' + s + '_' + d;
      dersler.push({ id, okul_id: okul, sinif_id: 'c_' + s, konu, ogretmen_id: ogretmen, haftalik_saat: 4, olusturma: simdi });
    });
    for (let gun = 1; gun <= 5; gun++) {
      for (let sa = 0; sa < 7; sa++) {
        const d = (gun * 7 + sa + s) % DERSLER.length;
        program.push({ id: 'p_' + s + '_' + gun + '_' + sa, okul_id: okul, sinif_id: 'c_' + s, ders_id: 'd_' + s + '_' + d,
          gun, baslangic: saatler[sa][0], bitis: saatler[sa][1], olusturma: simdi });
      }
    }
  }
  await toplu('dersler', ['id', 'okul_id', 'sinif_id', 'konu', 'ogretmen_id', 'haftalik_saat', 'olusturma'], dersler);
  await toplu('ders_programi', ['id', 'okul_id', 'sinif_id', 'ders_id', 'gun', 'baslangic', 'bitis', 'olusturma'], program);

  /* Ödevler: ders başına 25, çoğu sonuçlanmış */
  const odevler = [], odevOgr = [], odevSinif = [];
  const sonuclar = ['yapti', 'yapti', 'yapti', 'gec', 'eksik', 'yapmadi', 'izinli', 'gelmedi'];
  for (const d of dersler) {
    const sinifOgr = ogrenciler.filter(o => o.sinif === d.sinif_id);
    for (let n = 0; n < 25; n++) {
      const id = say('a');
      const bitis = gunOnce(200 - n * 8);
      const bitmis = n < 22;
      odevler.push({ id, okul_id: okul, ogretmen_id: d.ogretmen_id, ders: d.konu, baslik: d.konu + ' ödevi ' + (n + 1),
        aciklama: 'Kitaptaki alıştırmalar ve konu tekrarı.', baslangic: gunOnce(207 - n * 8), bitis, bitis_saati: '12:00',
        durum: bitmis ? 'finished' : 'active', olusturma: new Date(Date.now() - (207 - n * 8) * 86400000).toISOString(),
        sonuclanma: bitmis ? simdi : null });
      odevSinif.push({ odev_id: id, sinif_id: d.sinif_id });
      sinifOgr.forEach((o, k) => odevOgr.push({ odev_id: id, ogrenci_id: o.id,
        sonuc: bitmis ? sonuclar[(k + n) % sonuclar.length] : null,
        acilma: (k + n) % 4 ? simdi : null }));
    }
  }
  await toplu('odevler', ['id', 'okul_id', 'ogretmen_id', 'ders', 'baslik', 'aciklama', 'baslangic', 'bitis', 'bitis_saati', 'durum', 'olusturma', 'sonuclanma'], odevler);
  await toplu('odev_siniflari', ['odev_id', 'sinif_id'], odevSinif);
  await toplu('odev_ogrencileri', ['odev_id', 'ogrenci_id', 'sonuc', 'acilma'], odevOgr);

  /* Sınavlar: her derste 2 grup, grupta 3 yazılı (0-100); 8. sınıflarda 8 LGS denemesi */
  const gruplar = [], sinavlar = [], olcumler = [], degerler = [];
  for (const d of dersler) {
    const sinifOgr = ogrenciler.filter(o => o.sinif === d.sinif_id);
    for (let g = 0; g < 2; g++) {
      const gid = say('g');
      gruplar.push({ id: gid, okul_id: okul, ogretmen_id: d.ogretmen_id, ders: d.konu, ad: 'Dönem ' + (g + 1), olusturma: simdi });
      for (let y = 0; y < 3; y++) {
        const eid = say('e'), oid = say('ol');
        sinavlar.push({ id: eid, okul_id: okul, grup_id: gid, ogretmen_id: d.ogretmen_id, ders: d.konu, ad: (y + 1) + '. Yazılı',
          tarih: gunOnce(190 - g * 90 - y * 25), agirlik: y === 2 ? 40 : 30, olusturma: simdi });
        olcumler.push({ id: oid, sinav_id: eid, sira: 1, kod: 'P', ad: 'Puan', alt_sinir: 0, ust_sinir: 100, ana: true });
        sinifOgr.forEach((o, k) => degerler.push({ olcum_id: oid, ogrenci_id: o.id, deger: 45 + ((k * 7 + y * 11 + g * 5) % 55) + 0.5 }));
      }
    }
  }
  for (let s = 18; s < SINIF; s++) {       // 8. sınıflar
    const sinifOgr = ogrenciler.filter(o => o.sinif === 'c_' + s);
    const ogretmen = dersler.find(d => d.sinif_id === 'c_' + s && d.konu === 'Matematik').ogretmen_id;
    for (let n = 0; n < 8; n++) {
      const eid = say('e');
      sinavlar.push({ id: eid, okul_id: okul, grup_id: null, ogretmen_id: ogretmen, ders: 'Matematik', ad: 'LGS Deneme ' + (n + 1),
        tarih: gunOnce(210 - n * 25), agirlik: null, olusturma: simdi });
      ['TR', 'MAT', 'FEN', 'INK', 'DIN', 'ING', 'LGS'].forEach((kod, i) => {
        const oid = say('ol');
        const ust = kod === 'LGS' ? 500 : (i < 3 ? 20 : 10);
        olcumler.push({ id: oid, sinav_id: eid, sira: i + 1, kod, ad: kod + (kod === 'LGS' ? ' Puanı' : ' Net'),
          alt_sinir: kod === 'LGS' ? 100 : -5, ust_sinir: ust, ana: kod === 'LGS' });
        sinifOgr.forEach((o, k) => degerler.push({ olcum_id: oid, ogrenci_id: o.id,
          deger: kod === 'LGS' ? 300 + ((k * 13 + n * 17) % 190) + 0.161 : ((k + n + i) % ust) }));
      });
    }
  }
  await toplu('sinav_gruplari', ['id', 'okul_id', 'ogretmen_id', 'ders', 'ad', 'olusturma'], gruplar);
  await toplu('sinavlar', ['id', 'okul_id', 'grup_id', 'ogretmen_id', 'ders', 'ad', 'tarih', 'agirlik', 'olusturma'], sinavlar);
  await toplu('sinav_olcumleri', ['id', 'sinav_id', 'sira', 'kod', 'ad', 'alt_sinir', 'ust_sinir', 'ana'], olcumler);
  await toplu('sinav_degerleri', ['olcum_id', 'ogrenci_id', 'deger'], degerler);

  /* Devamsızlık: 150 okul günü, her gün her derste öğrencilerin ~%3'ü */
  const devam = [];
  for (let gun = 0; gun < 150; gun++) {
    const tarih = gunOnce(gun + 1);
    for (let s = 0; s < SINIF; s++) {
      for (let k = 0; k < SINIF_MEVCUT; k++) {
        if ((gun * 31 + s * 7 + k * 13) % 33 !== 0) continue;
        devam.push({ id: say('dv'), okul_id: okul, sinif_id: 'c_' + s, ders_id: 'd_' + s + '_' + (gun % DERSLER.length),
          ogrenci_id: 'u_ogr' + s + '_' + k, tarih, durum: ['yok', 'gec', 'izinli'][(gun + k) % 3], aciklama: '',
          alan_id: dersler[s * DERSLER.length].ogretmen_id, olusturma: simdi });
      }
    }
  }
  await toplu('devamsizlik', ['id', 'okul_id', 'sinif_id', 'ders_id', 'ogrenci_id', 'tarih', 'durum', 'aciklama', 'alan_id', 'olusturma'], devam);

  /* Mesajlar: 20 okul duyurusu (herkese), 400 sınıf mesajı (öğrenci + veli) */
  const mesajlar = [], alicilar = [];
  const herkes = kisi.filter(k => k.okul_id === okul && k.id !== 'u_mudur');
  for (let i = 0; i < 20; i++) {
    const id = say('m');
    mesajlar.push({ id, okul_id: okul, gonderen_id: 'u_mudur', tur: 'duyuru', konu: 'Duyuru ' + (i + 1),
      govde: 'Okulumuzda bu hafta yapılacak etkinlikler hakkında bilgilendirme.', hedef_ozet: 'Tüm okul', tarih: gunOnce(150 - i * 7) + 'T09:00:00Z' });
    herkes.forEach(k => alicilar.push({ mesaj_id: id, alici_id: k.id, ogrenci_id: null }));
  }
  const veliOf = new Map();
  veliler.forEach((v, i) => veliOf.set(ogrenciler[i].id, v));
  for (let i = 0; i < 400; i++) {
    const d = dersler[i % dersler.length];
    const id = say('m');
    mesajlar.push({ id, okul_id: okul, gonderen_id: d.ogretmen_id, tur: 'mesaj', konu: d.konu + ' dersi hakkında',
      govde: 'Yarınki derse kitaplarınızı getirin.', hedef_ozet: 'Sınıf', tarih: gunOnce(140 - (i % 140)) + 'T15:00:00Z' });
    ogrenciler.filter(o => o.sinif === d.sinif_id).forEach(o => {
      alicilar.push({ mesaj_id: id, alici_id: o.id, ogrenci_id: null });
      if (veliOf.has(o.id)) alicilar.push({ mesaj_id: id, alici_id: veliOf.get(o.id), ogrenci_id: o.id });
    });
  }
  await toplu('mesajlar', ['id', 'okul_id', 'gonderen_id', 'tur', 'konu', 'govde', 'hedef_ozet', 'tarih'], mesajlar);
  await toplu('mesaj_alicilari', ['mesaj_id', 'alici_id', 'ogrenci_id'], alicilar);

  /* Bildirimler: kişi başı 200 (öğrenciler ve öğretmenler), çoğu okunmuş */
  const bildirim = [];
  for (const k of kisi.filter(x => x.okul_id === okul && x.rol !== 'parent')) {
    for (let n = 0; n < 200; n++) {
      bildirim.push({ id: say('n'), kullanici_id: k.id, metin: 'Yeni ödev: Matematik ödevi ' + n, baglanti: '#/odevler',
        okundu: n > 3, olusturma: new Date(Date.now() - n * 3600 * 1000 * 20).toISOString() });
    }
  }
  await toplu('bildirimler', ['id', 'kullanici_id', 'metin', 'baglanti', 'okundu', 'olusturma'], bildirim);

  await toplu('takvim_etkinlikleri', ['id', 'okul_id', 'tarih', 'bitis', 'baslik', 'tur', 'aciklama', 'olusturma'],
    Array.from({ length: 60 }, (_, i) => ({ id: say('tk'), okul_id: okul, tarih: gunOnce(180 - i * 4), bitis: gunOnce(180 - i * 4),
      baslik: 'Etkinlik ' + i, tur: ['etkinlik', 'sinav', 'toplanti', 'tatil'][i % 4], aciklama: '', olusturma: simdi })));
  await toplu('islem_kaydi', ['id', 'okul_id', 'kullanici_id', 'kullanici_ad', 'kullanici_rol', 'islem', 'detay', 'tarih'],
    Array.from({ length: 3000 }, (_, i) => ({ id: say('ik'), okul_id: okul, kullanici_id: 'u_mudur', kullanici_ad: 'Müdür Yük',
      kullanici_rol: 'principal', islem: 'hesap.acildi', detay: 'Öğrenci ' + i, tarih: simdi })));

  await baglanti.sorgu('ANALYZE');   // sorgu planlayıcı gerçek sayılarla çalışsın
  const say2 = async t => (await baglanti.tek('SELECT count(*) AS n FROM ' + t)).n;
  console.log('Doldurma ' + ((Date.now() - t0) / 1000).toFixed(1) + ' sn: ' +
    (await say2('kullanicilar')) + ' kişi, ' + (await say2('odev_ogrencileri')) + ' öğrenci-ödev, ' +
    (await say2('sinav_degerleri')) + ' sınav değeri, ' + (await say2('devamsizlik')) + ' devamsızlık, ' +
    (await say2('mesaj_alicilari')) + ' mesaj alıcısı, ' + (await say2('bildirimler')) + ' bildirim');
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

const sonuclar = [];
async function olc(rol, ad, yol, anahtar) {
  await iste(yol, anahtar);                 // ısınma
  const sureler = [];
  let son;
  for (let i = 0; i < OLCUM_TEKRAR; i++) {
    await bekle(ISTEK_ARASI_MS);
    son = await iste(yol, anahtar);
    sureler.push(son.ms);
  }
  sureler.sort((a, b) => a - b);
  const r = { rol, ad, yol, durum: son.durum, ortanca: sureler[Math.floor(sureler.length / 2)], enKotu: sureler[sureler.length - 1], kb: son.bayt / 1024 };
  sonuclar.push(r);
  const isaret = r.durum !== 200 ? 'HATA ' + r.durum : (r.ortanca > YAVAS_MS ? 'YAVAŞ' : r.kb > AGIR_KB ? 'AĞIR' : '');
  console.log('  ' + rol.padEnd(9) + ad.padEnd(34) + (r.ortanca.toFixed(0) + ' ms').padStart(8) +
    (r.enKotu.toFixed(0) + ' ms').padStart(9) + (r.kb.toFixed(1) + ' KB').padStart(10) + '  ' + isaret);
  await bekle(ISTEK_ARASI_MS);
  return son;
}

async function olcumler() {
  const ogr = 'u_ogr20_3', ogrt = 'u_ogrt0', veli = 'u_veli560', mudur = 'u_mudur';
  const A = { ogr: await oturum(ogr), ogrt: await oturum(ogrt), veli: await oturum(veli), mudur: await oturum(mudur),
    admin: await oturum((await baglanti.tek("SELECT id FROM kullanicilar WHERE rol = 'admin' LIMIT 1")).id) };
  const lgs = (await baglanti.tek("SELECT s.id FROM sinavlar s WHERE s.ad = 'LGS Deneme 8' AND s.ogretmen_id = (SELECT ogretmen_id FROM dersler WHERE sinif_id = 'c_20' AND konu = 'Matematik') LIMIT 1")) || {};
  const grup = await baglanti.tek('SELECT id FROM sinav_gruplari WHERE ogretmen_id = $1 LIMIT 1', [ogrt]);
  const odev = await baglanti.tek("SELECT id FROM odevler WHERE ogretmen_id = $1 AND durum = 'finished' LIMIT 1", [ogrt]);
  const ders = await baglanti.tek('SELECT id FROM dersler WHERE ogretmen_id = $1 LIMIT 1', [ogrt]);
  const ay = new Date();

  console.log('\n  rol      ekran                              ortanca  en kötü     boyut');
  await olc('öğrenci', 'Oturum (me)', '/api/me', A.ogr);
  await olc('öğrenci', 'İlerleyiş', '/api/progress', A.ogr);
  await olc('öğrenci', 'Sınav grafiği', '/api/exams/grafik', A.ogr);
  await olc('öğrenci', 'Ders programı', '/api/myschedule', A.ogr);
  await olc('öğrenci', 'Mesaj kutusu', '/api/mesajlar', A.ogr);
  const b = await olc('öğrenci', 'Bildirimler (ilk)', '/api/notifications', A.ogr);
  await olc('öğrenci', 'Bildirimler (yoklama, değişmedi)', '/api/notifications?surum=' + encodeURIComponent((b.govde || {}).surum || ''), A.ogr);
  await olc('öğrenci', 'Takvim (ay)', '/api/takvim?yil=' + ay.getFullYear() + '&ay=' + (ay.getMonth() + 1), A.ogr);
  await olc('öğrenci', 'Devamsızlığım', '/api/devamsizlik/benim', A.ogr);

  await olc('öğretmen', 'Ödevlerim', '/api/assignments', A.ogrt);
  await olc('öğretmen', 'Ödev hedefleri', '/api/assignments/hedefler', A.ogrt);
  await olc('öğretmen', 'Ödev kontrolü', '/api/assignments/' + odev.id, A.ogrt);
  await olc('öğretmen', 'Sınavlarım', '/api/exams', A.ogrt);
  await olc('öğretmen', 'Sınav grupları', '/api/examgroups', A.ogrt);
  await olc('öğretmen', 'Grup ortalamaları', '/api/examgroups/' + grup.id, A.ogrt);
  await olc('öğretmen', 'Şablonlar', '/api/exams/sablonlar', A.ogrt);
  await olc('öğretmen', 'Ders programım', '/api/teacher/schedule', A.ogrt);
  await olc('öğretmen', 'Yoklama dersleri', '/api/devamsizlik/derslerim', A.ogrt);
  await olc('öğretmen', 'Yoklama ekranı', '/api/devamsizlik/yoklama?lessonId=' + ders.id, A.ogrt);
  await olc('öğretmen', 'Mesaj alıcıları', '/api/mesajlar/hedefler', A.ogrt);
  await olc('öğretmen', 'Mesaj kutusu', '/api/mesajlar', A.ogrt);

  if (lgs.id) {
    const lgsOgretmen = await baglanti.tek('SELECT ogretmen_id FROM sinavlar WHERE id = $1', [lgs.id]);
    const T2 = await oturum(lgsOgretmen.ogretmen_id);
    await olc('öğretmen', 'Değer tablosu (LGS, 7 alan)', '/api/exams/' + lgs.id, T2);
  }

  await olc('veli', 'Çocuklarım', '/api/parent/children', A.veli);
  await olc('veli', 'Çocuğun ilerleyişi', '/api/progress?studentId=u_ogr18_20', A.veli);
  await olc('veli', 'Çocuğun devamsızlığı', '/api/devamsizlik/ogrenci?studentId=u_ogr18_20', A.veli);
  await olc('veli', 'Mesaj kutusu', '/api/mesajlar', A.veli);

  await olc('müdür', 'Okul öğrencileri (720)', '/api/school/students', A.mudur);
  await olc('müdür', 'Öğretmenler', '/api/school/teachers', A.mudur);
  await olc('müdür', 'Sınıflar', '/api/school/classes', A.mudur);
  await olc('müdür', 'Sınıf programı', '/api/school/schedule?classId=c_5', A.mudur);
  await olc('müdür', 'Çakışmalar', '/api/school/cakismalar', A.mudur);
  await olc('müdür', 'Ana sayfa sayıları', '/api/school/ozet', A.mudur);
  await olc('müdür', 'Ders ödevleri (tüm okul)', '/api/school/assignments', A.mudur);
  await olc('müdür', 'Ders ödevleri (tek sınıf)', '/api/school/assignments?classId=c_5', A.mudur);
  await olc('müdür', 'Ders ödevleri (bir ders açıldı)', '/api/school/assignments?lessonId=d_5_0', A.mudur);
  await olc('müdür', 'Ders ödevleri (sınıf, hepsi açık)', '/api/school/assignments?classId=c_5&detay=1', A.mudur);
  await olc('müdür', 'Devamsızlık özeti', '/api/devamsizlik/ozet?gun=180', A.mudur);
  await olc('müdür', 'Mesaj alıcıları', '/api/mesajlar/hedefler', A.mudur);
  await olc('müdür', 'İşlem kaydı', '/api/islem-kaydi', A.mudur);
  await olc('müdür', 'Takvim', '/api/takvim?yil=' + ay.getFullYear() + '&ay=' + (ay.getMonth() + 1), A.mudur);

  await olc('yönetici', 'Genel bakış (31 okul)', '/api/admin/overview', A.admin);
  await olc('yönetici', 'Müdürler', '/api/admin/principals', A.admin);

  /* ---- yazma işlemleri ---- */
  console.log('\n  yazma işlemleri');
  const yoklama = await iste('/api/devamsizlik/yoklama?lessonId=' + ders.id, A.ogrt);
  const girisler = (yoklama.govde.ogrenciler || []).map((o, i) => ({ ogrenciId: o.id, durum: i % 6 ? 'var' : 'yok' }));
  const yaz = async (ad, yol, anahtar, govde) => {
    await bekle(ISTEK_ARASI_MS);
    const r = await iste(yol, anahtar, 'POST', govde);
    sonuclar.push({ rol: 'yazma', ad, yol, durum: r.durum, ortanca: r.ms, enKotu: r.ms, kb: r.bayt / 1024 });
    console.log('  ' + ad.padEnd(44) + (r.ms.toFixed(0) + ' ms').padStart(8) + '  ' + (r.durum === 200 ? '' : 'HATA ' + r.durum + ' ' + JSON.stringify(r.govde).slice(0, 80)));
    return r;
  };
  await yaz('Yoklama kaydet (30 öğrenci)', '/api/devamsizlik/yoklama', A.ogrt, { lessonId: ders.id, tarih: gunOnce(0), girisler });
  await yaz('Aynı yoklamayı yeniden kaydet', '/api/devamsizlik/yoklama', A.ogrt, { lessonId: ders.id, tarih: gunOnce(0), girisler });
  const hedef = await iste('/api/assignments/hedefler', A.ogrt);
  const idler = [];
  (hedef.govde.classes || []).slice(0, 2).forEach(c => c.students.forEach(s => idler.push(s.id)));
  const yeni = await yaz('Ödev ver (' + idler.length + ' öğrenci)', '/api/assignments', A.ogrt,
    { title: 'Yük testi ödevi', description: 'Deneme', subject: 'Matematik', startAt: gunOnce(0), endAt: gunOnce(-3), studentIds: idler });
  const odevId = yeni.govde && yeni.govde.assignment && yeni.govde.assignment.id;
  if (odevId) {
    const sonuc = {}; idler.forEach((id, i) => { sonuc[id] = ['yapti', 'gec', 'eksik'][i % 3]; });
    await yaz('Ödevi sonuçlandır (' + idler.length + ')', '/api/assignments/' + odevId + '/finish', A.ogrt, { results: sonuc });
    await yaz('Aynı sonuçları yeniden kaydet', '/api/assignments/' + odevId + '/finish', A.ogrt, { results: sonuc });
  }
  const sinav = await yaz('Sınav aç (hazır LGS şablonu)', '/api/exams', A.ogrt, { name: 'Yük LGS', hazir: 'lgs' });
  const sid = sinav.govde && sinav.govde.exam && sinav.govde.exam.id;
  if (sid) {
    const d = {}; idler.forEach((id, i) => { d[id] = { TR: '12,5', MAT: '10', FEN: '14', INK: '7', DIN: '8', ING: '6,67', LGS: String(350 + i) }; });
    await yaz('Sınav değerleri (' + idler.length + ' x 7)', '/api/exams/' + sid + '/grades', A.ogrt, { degerler: d });
  }
  await yaz('Okula duyuru (tüm okul, ~1360 kişi)', '/api/mesajlar', A.mudur,
    { tur: 'duyuru', konu: 'Yük testi duyurusu', govde: 'Deneme', hedef: { tur: 'okul' } });

  /* ---- eşzamanlı kullanıcı ---- */
  const ogrOturum = [];
  for (let i = 0; i < 10; i++) ogrOturum.push(await oturum('u_ogr' + (i + 2) + '_' + i));
  const bas = Date.now();
  const ess = await Promise.all(ogrOturum.map(a => iste('/api/progress', a)));
  const sure = Date.now() - bas;
  const ess2 = ess.map(r => r.ms).sort((a, b) => a - b);
  console.log('\n  10 öğrenci aynı anda ilerleyiş açtı: toplam ' + sure + ' ms, en yavaşı ' + ess2[9].toFixed(0) + ' ms, hepsi ' +
    (ess.every(r => r.durum === 200) ? '200' : 'HATALI'));

  const yavaslar = sonuclar.filter(r => r.durum !== 200 || r.ortanca > YAVAS_MS || r.kb > AGIR_KB);
  console.log('\nÖZET: ' + sonuclar.length + ' ölçüm, ' + yavaslar.length + ' sorunlu' +
    (yavaslar.length ? ': ' + yavaslar.map(r => r.rol + '/' + r.ad).join(', ') : ''));
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
