'use strict';
/* Ödevin quizi: quizler, quiz_sorulari, quiz_secenekleri, quiz_denemeleri,
   quiz_cevaplari (029-quiz.sql).

   sorulari() şıkların doğru bilgisini de getirir: puan sunucuda hesaplanır.
   Öğrenciye ve veliye giden görünümü bölüm (bolumler/quiz.js) kurar; doğru
   bilgisi ancak sonuç açılınca oraya girer. Ödev nesnesine (depo/odevler.js
   SEC) quizden hiçbir şey eklenmez. */

const { sorgu, tek, calistir, islem } = require('../baglanti');
const { uid } = require('../../ortak');

const quizNesne = r => r && ({
  odevId: r.odev_id, sureTuru: r.sure_turu, toplamSn: r.toplam_sn, cikincaKapanir: r.cikinca_kapanir,
  sonucGorunum: r.sonuc_gorunum, sonucAcildi: r.sonuc_acildi || null, olusturma: r.olusturma, guncelleme: r.guncelleme
});

const denemeNesne = r => r && ({
  odevId: r.odev_id, ogrenciId: r.ogrenci_id, baslama: r.baslama, bitis: r.bitis || null, bitisNedeni: r.bitis_nedeni || null,
  soruSira: r.soru_sira, soruBaslama: r.soru_baslama, cikisSayisi: r.cikis_sayisi, cikisSn: r.cikis_sn,
  dogru: r.dogru === null ? null : r.dogru, puanli: r.puanli === null ? null : r.puanli, sonucBildirildi: r.sonuc_bildirildi
});

const cevapNesne = r => ({
  soruId: r.soru_id, secilenler: r.secilenler || [], metin: r.metin, kayit: r.kayit || null,
  acilis: r.acilis || null, kapanis: r.kapanis || null, kapandi: r.kapandi || null
});

/* ---------------- quiz ve soruları ---------------- */

async function bul(odevId) {
  if (!odevId) return null;
  return quizNesne(await tek('SELECT * FROM quizler WHERE odev_id = $1', [odevId]));
}

/* Öğretmen quizi değiştirirken satırı kilitler: aynı anda başlayan öğrencinin
   denemesi (quizler satırına yabancı anahtarla bağlı) işlem bitene kadar bekler. */
const kilitle = odevId => tek('SELECT odev_id FROM quizler WHERE odev_id = $1 FOR UPDATE', [odevId]);

/* Sorular sırayla, şıklarıyla (doğru bilgisiyle birlikte). */
async function sorulari(odevId) {
  const sorular = await sorgu('SELECT id, sira, tur, metin, sure_sn FROM quiz_sorulari WHERE odev_id = $1 ORDER BY sira', [odevId]);
  const sikler = await sorgu(
    'SELECT c.id, c.soru_id, c.sira, c.metin, c.dogru FROM quiz_secenekleri c JOIN quiz_sorulari s ON s.id = c.soru_id ' +
    'WHERE s.odev_id = $1 ORDER BY c.soru_id, c.sira', [odevId]);
  const harita = new Map();
  const liste = sorular.map(r => {
    const s = { id: r.id, sira: r.sira, tur: r.tur, metin: r.metin, sureSn: r.sure_sn, secenekler: [] };
    harita.set(r.id, s);
    return s;
  });
  for (const c of sikler) {
    const s = harita.get(c.soru_id);
    if (s) s.secenekler.push({ id: c.id, sira: c.sira, metin: c.metin, dogru: c.dogru });
  }
  return liste;
}

/* Quizi yazar (yoksa açar, varsa soruları baştan yazar). q: quizDogrula()
   çıktısı. Deneme varken çağrılmaz (bölüm kilitle + denemeSayisi ile bakar). */
async function yaz(odevId, q) {
  await islem(async () => {
    await calistir(
      'INSERT INTO quizler (odev_id, sure_turu, toplam_sn, cikinca_kapanir, sonuc_gorunum) VALUES ($1, $2, $3, $4, $5) ' +
      'ON CONFLICT (odev_id) DO UPDATE SET sure_turu = EXCLUDED.sure_turu, toplam_sn = EXCLUDED.toplam_sn, ' +
      'cikinca_kapanir = EXCLUDED.cikinca_kapanir, sonuc_gorunum = EXCLUDED.sonuc_gorunum, guncelleme = now()',
      [odevId, q.sureTuru, q.toplamSn, !!q.cikincaKapanir, q.sonucGorunum]);
    await calistir('DELETE FROM quiz_sorulari WHERE odev_id = $1', [odevId]);
    const soruIdler = q.sorular.map(() => uid('qs'));
    await calistir(
      'INSERT INTO quiz_sorulari (id, odev_id, sira, tur, metin, sure_sn) ' +
      'SELECT x.id, $1, x.sira, x.tur, x.metin, x.sure FROM unnest($2::text[], $3::int[], $4::text[], $5::text[], $6::int[]) AS x(id, sira, tur, metin, sure)',
      [odevId, soruIdler, q.sorular.map(s => s.sira), q.sorular.map(s => s.tur), q.sorular.map(s => s.metin), q.sorular.map(s => s.sureSn)]);
    const c = { id: [], soru: [], sira: [], metin: [], dogru: [] };
    q.sorular.forEach((s, i) => s.secenekler.forEach((x, j) => {
      c.id.push(uid('qo')); c.soru.push(soruIdler[i]); c.sira.push(j + 1); c.metin.push(x.metin); c.dogru.push(!!x.dogru);
    }));
    if (c.id.length) {
      await calistir(
        'INSERT INTO quiz_secenekleri (id, soru_id, sira, metin, dogru) ' +
        'SELECT x.id, x.soru, x.sira, x.metin, x.dogru FROM unnest($1::text[], $2::text[], $3::int[], $4::text[], $5::boolean[]) AS x(id, soru, sira, metin, dogru)',
        [c.id, c.soru, c.sira, c.metin, c.dogru]);
    }
  });
}

const sil = odevId => calistir('DELETE FROM quizler WHERE odev_id = $1', [odevId]);

/* Sonuçlar kalıcı açıldı: öğretmen "Sonuçları şimdi aç" dedi ya da son
   teslimle açılan sonucu bir öğrenci görebildi (ilk açılış anı korunur). */
const sonucAc = odevId => calistir('UPDATE quizler SET sonuc_acildi = COALESCE(sonuc_acildi, now()) WHERE odev_id = $1', [odevId]);

/* Birçok ödevin quiz özeti tek sorguda: ödev id -> özet (quizi olmayan ödev yok). */
async function ozetler(odevIdler) {
  const harita = new Map();
  if (!odevIdler || !odevIdler.length) return harita;
  const satirlar = await sorgu(
    'SELECT q.odev_id, q.sure_turu, q.toplam_sn, q.cikinca_kapanir, q.sonuc_gorunum, q.sonuc_acildi, ' +
    '  (SELECT count(*) FROM quiz_sorulari s WHERE s.odev_id = q.odev_id) AS soru_sayisi, ' +
    "  (SELECT count(*) FROM quiz_sorulari s WHERE s.odev_id = q.odev_id AND s.tur = 'acik') AS acik_sayisi, " +
    '  (SELECT COALESCE(sum(s.sure_sn), 0) FROM quiz_sorulari s WHERE s.odev_id = q.odev_id) AS soru_sure_toplami, ' +
    '  (SELECT count(*) FROM quiz_denemeleri d WHERE d.odev_id = q.odev_id) AS baslayan, ' +
    '  (SELECT count(*) FROM quiz_denemeleri d WHERE d.odev_id = q.odev_id AND d.bitis IS NOT NULL) AS biten ' +
    'FROM quizler q WHERE q.odev_id = ANY($1::text[])', [odevIdler]);
  for (const r of satirlar) {
    harita.set(r.odev_id, Object.assign(quizNesne(r), {
      soruSayisi: r.soru_sayisi, acikUcluSayisi: r.acik_sayisi, puanliSayisi: r.soru_sayisi - r.acik_sayisi,
      soruSureToplami: r.soru_sure_toplami, baslayan: r.baslayan, biten: r.biten
    }));
  }
  return harita;
}

/* ---------------- denemeler ---------------- */

const denemeSayisi = async odevId =>
  (await tek('SELECT count(*)::int AS n FROM quiz_denemeleri WHERE odev_id = $1', [odevId])).n;

/* Başlayan ve bitiren öğrenci sayısı. */
async function denemeSayilari(odevId) {
  const r = await tek('SELECT count(*)::int AS baslayan, count(bitis)::int AS biten FROM quiz_denemeleri WHERE odev_id = $1', [odevId]);
  return { baslayan: r.baslayan, biten: r.biten };
}

/* kilitle: işlem içinde satırı kilitler (cevap, sonraki, bitir aynı anda gelirse sırayla işlenir). */
async function denemeBul(odevId, ogrenciId, kilitleMi) {
  return denemeNesne(await tek('SELECT * FROM quiz_denemeleri WHERE odev_id = $1 AND ogrenci_id = $2' +
    (kilitleMi ? ' FOR UPDATE' : ''), [odevId, ogrenciId]));
}

const odevinDenemeleri = async odevId =>
  (await sorgu('SELECT * FROM quiz_denemeleri WHERE odev_id = $1', [odevId])).map(denemeNesne);

/* Öğrencinin verilen ödevlerdeki denemeleri: ödev id -> deneme. */
async function ogrencininDenemeleri(ogrenciId, odevIdler) {
  const harita = new Map();
  if (!odevIdler || !odevIdler.length) return harita;
  for (const r of await sorgu('SELECT * FROM quiz_denemeleri WHERE ogrenci_id = $1 AND odev_id = ANY($2::text[])', [ogrenciId, odevIdler])) {
    harita.set(r.odev_id, denemeNesne(r));
  }
  return harita;
}

const acikDenemeler = async odevId =>
  (await sorgu('SELECT ogrenci_id FROM quiz_denemeleri WHERE odev_id = $1 AND bitis IS NULL', [odevId])).map(r => r.ogrenci_id);

/* Tek deneme: satır zaten varsa (aynı anda iki "Başlat") yeni satır açılmaz.
   Açıldıysa true. */
async function denemeBaslat(odevId, ogrenciId) {
  return (await sorgu('INSERT INTO quiz_denemeleri (odev_id, ogrenci_id) VALUES ($1, $2) ' +
    'ON CONFLICT (odev_id, ogrenci_id) DO NOTHING RETURNING odev_id', [odevId, ogrenciId])).length > 0;
}

/* Denemenin değişen alanları. */
function denemeYaz(d) {
  return calistir(
    'UPDATE quiz_denemeleri SET bitis = $3, bitis_nedeni = $4, soru_sira = $5, soru_baslama = $6, cikis_sayisi = $7, ' +
    'cikis_sn = $8, dogru = $9, puanli = $10 WHERE odev_id = $1 AND ogrenci_id = $2',
    [d.odevId, d.ogrenciId, d.bitis, d.bitisNedeni, d.soruSira, d.soruBaslama, d.cikisSayisi, d.cikisSn,
      d.dogru === undefined ? null : d.dogru, d.puanli === undefined ? null : d.puanli]);
}

/* Süresi dolmuş olabilecek açık denemeler (dakikalık temizlik ve okurken).
   Süresiz quizde son tarihi olmayan aktif ödevin denemesi süreyle kapanmaz
   (sonuçları açılmadıysa); ötekilerin kesin hesabı bölümde yapılır.
   odevIdler null ise hepsi. */
async function acikAdaylar(odevIdler) {
  return (await sorgu(
    'SELECT d.odev_id, d.ogrenci_id, d.baslama, d.soru_sira, d.soru_baslama, q.sure_turu, q.toplam_sn, q.sonuc_acildi, ' +
    '       o.bitis AS odev_bitis, o.bitis_saati, o.durum, ' +
    '       (SELECT COALESCE(sum(s.sure_sn), 0) FROM quiz_sorulari s WHERE s.odev_id = d.odev_id AND s.sira >= d.soru_sira) AS kalan_sn ' +
    'FROM quiz_denemeleri d JOIN quizler q ON q.odev_id = d.odev_id JOIN odevler o ON o.id = d.odev_id ' +
    'WHERE d.bitis IS NULL AND ($1::text[] IS NULL OR d.odev_id = ANY($1::text[])) ' +
    "  AND (q.sure_turu <> 'yok' OR o.durum <> 'active' OR q.sonuc_acildi IS NOT NULL OR " +
    '       (o.bitis IS NOT NULL AND o.bitis <= current_date + 1))',
    [odevIdler || null])).map(r => ({
    odevId: r.odev_id, ogrenciId: r.ogrenci_id, baslama: r.baslama, soruSira: r.soru_sira, soruBaslama: r.soru_baslama,
    sureTuru: r.sure_turu, toplamSn: r.toplam_sn, sonucAcildi: r.sonuc_acildi || null,
    odevBitis: r.odev_bitis, bitisSaati: r.bitis_saati, durum: r.durum, kalanSn: r.kalan_sn
  }));
}

/* "Son teslimden sonra" seçili, sonucu henüz kalıcı açılmamış ve bitmiş
   denemesi olan quizler: son teslim + 10 dk geçmiş olabilecekler (kesin
   hesap bölümde, sunucunun saatiyle). odevIdler null ise hepsi. */
async function teslimAdaylari(odevIdler) {
  return (await sorgu(
    'SELECT q.odev_id, o.bitis AS odev_bitis, o.bitis_saati FROM quizler q JOIN odevler o ON o.id = q.odev_id ' +
    "WHERE q.sonuc_gorunum = 'teslim' AND q.sonuc_acildi IS NULL AND o.bitis IS NOT NULL AND o.bitis <= current_date + 1 " +
    '  AND ($1::text[] IS NULL OR q.odev_id = ANY($1::text[])) ' +
    '  AND EXISTS (SELECT 1 FROM quiz_denemeleri d WHERE d.odev_id = q.odev_id AND d.bitis IS NOT NULL)',
    [odevIdler || null])).map(r => ({ odevId: r.odev_id, odevBitis: r.odev_bitis, bitisSaati: r.bitis_saati }));
}

/* Biten ama sonucu bildirilmemiş denemeler: sonucu açılmış olabilecekler. */
async function bildirimAdaylari(odevIdler) {
  return (await sorgu(
    'SELECT d.odev_id, d.ogrenci_id, d.bitis, q.sonuc_gorunum, q.sonuc_acildi, o.bitis AS odev_bitis, o.bitis_saati, ' +
    '       o.durum, o.ders, o.baslik ' +
    'FROM quiz_denemeleri d JOIN quizler q ON q.odev_id = d.odev_id JOIN odevler o ON o.id = d.odev_id ' +
    'WHERE d.bitis IS NOT NULL AND NOT d.sonuc_bildirildi AND ($1::text[] IS NULL OR d.odev_id = ANY($1::text[])) ' +
    "  AND (q.sonuc_acildi IS NOT NULL OR q.sonuc_gorunum = 'hemen' OR o.durum = 'finished' OR " +
    '       (o.bitis IS NOT NULL AND o.bitis <= current_date + 1))',
    [odevIdler || null])).map(r => ({
    odevId: r.odev_id, ogrenciId: r.ogrenci_id, bitis: r.bitis, sonucGorunum: r.sonuc_gorunum, sonucAcildi: r.sonuc_acildi || null,
    odevBitis: r.odev_bitis, bitisSaati: r.bitis_saati, durum: r.durum, ders: r.ders, baslik: r.baslik
  }));
}

/* Sonuç bildirimi gitti. Yalnız bu çağrıda işaretlenenler döner (aynı anda
   iki temizlik aynı bildirimi iki kez göndermesin). liste: [[odevId, ogrenciId]] */
async function bildirildi(liste) {
  if (!liste.length) return [];
  return (await sorgu(
    'UPDATE quiz_denemeleri d SET sonuc_bildirildi = true FROM unnest($1::text[], $2::text[]) AS x(odev_id, ogrenci_id) ' +
    'WHERE d.odev_id = x.odev_id AND d.ogrenci_id = x.ogrenci_id AND NOT d.sonuc_bildirildi RETURNING d.odev_id, d.ogrenci_id',
    [liste.map(x => x[0]), liste.map(x => x[1])])).map(r => [r.odev_id, r.ogrenci_id]);
}

/* Test için: denemenin başlangıcını ve şu anki sorunun başlangıcını geri alır
   (süre dolmuş gibi). Yalnız testler kullanır. */
const geriTarihle = (odevId, ogrenciId, saniye) => calistir(
  'UPDATE quiz_denemeleri SET baslama = baslama - make_interval(secs => $3::int), ' +
  'soru_baslama = soru_baslama - make_interval(secs => $3::int) WHERE odev_id = $1 AND ogrenci_id = $2',
  [odevId, ogrenciId, saniye]);

/* ---------------- cevaplar ---------------- */

const cevaplari = async (odevId, ogrenciId) =>
  (await sorgu('SELECT * FROM quiz_cevaplari WHERE odev_id = $1 AND ogrenci_id = $2', [odevId, ogrenciId])).map(cevapNesne);

async function cevapBul(odevId, ogrenciId, soruId) {
  const r = await tek('SELECT * FROM quiz_cevaplari WHERE odev_id = $1 AND ogrenci_id = $2 AND soru_id = $3', [odevId, ogrenciId, soruId]);
  return r ? cevapNesne(r) : null;
}

/* Cevabı yazar; kapanmış soruya yazmaz (null döner). Dönen: kayıt anı. */
async function cevapYaz(odevId, ogrenciId, soruId, secilenler, metin) {
  const r = await tek(
    'INSERT INTO quiz_cevaplari (odev_id, ogrenci_id, soru_id, secilenler, metin, kayit) VALUES ($1, $2, $3, $4::text[], $5, now()) ' +
    'ON CONFLICT (odev_id, ogrenci_id, soru_id) DO UPDATE SET secilenler = EXCLUDED.secilenler, metin = EXCLUDED.metin, ' +
    'kayit = EXCLUDED.kayit WHERE quiz_cevaplari.kapanis IS NULL RETURNING kayit',
    [odevId, ogrenciId, soruId, secilenler, metin]);
  return r ? r.kayit : null;
}

/* Soru kapandı (süre doldu, çıkınca kapandı, sonrakine geçildi). Zaten
   kapalıysa dokunmaz; kapattıysa true. */
async function soruKapat(odevId, ogrenciId, soruId, acilis, kapanis, neden) {
  return (await calistir(
    'INSERT INTO quiz_cevaplari (odev_id, ogrenci_id, soru_id, acilis, kapanis, kapandi) VALUES ($1, $2, $3, $4, $5, $6) ' +
    'ON CONFLICT (odev_id, ogrenci_id, soru_id) DO UPDATE SET acilis = COALESCE(quiz_cevaplari.acilis, EXCLUDED.acilis), ' +
    'kapanis = EXCLUDED.kapanis, kapandi = EXCLUDED.kapandi WHERE quiz_cevaplari.kapanis IS NULL',
    [odevId, ogrenciId, soruId, acilis || null, kapanis, neden || null])) > 0;
}

const kapaliSoruSayisi = async (odevId, ogrenciId) => (await tek(
  'SELECT count(*)::int AS n FROM quiz_cevaplari WHERE odev_id = $1 AND ogrenci_id = $2 AND kapanis IS NOT NULL',
  [odevId, ogrenciId])).n;

module.exports = {
  bul, kilitle, sorulari, yaz, sil, sonucAc, ozetler,
  denemeSayisi, denemeSayilari, denemeBul, odevinDenemeleri, ogrencininDenemeleri, acikDenemeler, denemeBaslat, denemeYaz,
  acikAdaylar, teslimAdaylari, bildirimAdaylari, bildirildi, geriTarihle,
  cevaplari, cevapBul, cevapYaz, soruKapat, kapaliSoruSayisi
};
