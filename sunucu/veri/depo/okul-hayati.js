'use strict';
/* Yemek listesi, servisler ve kulüpler. */

const { sorgu, tek, calistir, islem } = require('../baglanti');

/* ---------------- yemek listesi ---------------- */

/* Okulların [bas, bit] aralığındaki menüleri. */
const yemekler = (okulIdler, bas, bit) => sorgu(
  'SELECT okul_id, tarih, menu, kalori FROM yemek_listesi ' +
  'WHERE okul_id = ANY($1::text[]) AND tarih BETWEEN $2 AND $3 ORDER BY tarih', [okulIdler, bas, bit]);

/* Günleri tek işlemde yazar: menüsü boş gün silinir. liste: [{ tarih, menu, kalori }] */
async function yemekYaz(okulId, liste) {
  await islem(async () => {
    for (const g of liste) {
      if (!g.menu) {
        await calistir('DELETE FROM yemek_listesi WHERE okul_id = $1 AND tarih = $2', [okulId, g.tarih]);
        continue;
      }
      await calistir('INSERT INTO yemek_listesi (okul_id, tarih, menu, kalori) VALUES ($1, $2, $3, $4) ' +
        'ON CONFLICT (okul_id, tarih) DO UPDATE SET menu = EXCLUDED.menu, kalori = EXCLUDED.kalori',
        [okulId, g.tarih, g.menu, g.kalori || null]);
    }
  });
}

/* ---------------- servisler ---------------- */

const SERVIS_ALANLARI =
  'SELECT s.id, s.okul_id, s.ad, s.plaka, s.sofor, s.sofor_tel, s.rehber, s.rehber_tel, s.sabah, s.aksam, s.guzergah, ' +
  '       s.sofor_id, (SELECT ad_soyad FROM kullanicilar WHERE id = s.sofor_id) AS sofor_hesap_adi, ' +
  '       (SELECT telefon FROM kullanicilar WHERE id = s.sofor_id) AS sofor_hesap_tel, ' +
  '       (SELECT count(*)::int FROM servis_ogrencileri so WHERE so.servis_id = s.id) AS ogrenci_sayisi ';

const okulunServisleri = okulId => sorgu(
  SERVIS_ALANLARI + 'FROM servisler s WHERE s.okul_id = $1 ORDER BY s.ad', [okulId]);

const servisBul = id => tek(SERVIS_ALANLARI + 'FROM servisler s WHERE s.id = $1', [id]);

/* Servislerdeki öğrenciler (yönetim ekranı): ad, sınıf, durak, sıra. */
const servisOgrencileri = okulId => sorgu(
  'SELECT so.servis_id, so.ogrenci_id, so.durak, so.sira_sabah, so.sira_aksam, k.ad_soyad AS ad, c.ad AS sinif ' +
  'FROM servis_ogrencileri so JOIN servisler s ON s.id = so.servis_id ' +
  'JOIN kullanicilar k ON k.id = so.ogrenci_id LEFT JOIN siniflar c ON c.id = k.sinif_id ' +
  'WHERE s.okul_id = $1', [okulId]);

/* Öğrencilerin kendi servisleri (öğrenci ve veli ekranı). */
const ogrencilerinServisi = ogrenciIdler => sorgu(
  SERVIS_ALANLARI + ', so.ogrenci_id, so.durak, so.sira_sabah, so.sira_aksam ' +
  'FROM servis_ogrencileri so JOIN servisler s ON s.id = so.servis_id WHERE so.ogrenci_id = ANY($1::text[])', [ogrenciIdler]);

async function servisKaydet(s, yeni) {
  const p = [s.id, s.okulId, s.ad, s.plaka, s.sofor, s.soforTel, s.rehber, s.rehberTel, s.sabah, s.aksam, s.guzergah];
  if (yeni) {
    return calistir('INSERT INTO servisler (id, okul_id, ad, plaka, sofor, sofor_tel, rehber, rehber_tel, sabah, aksam, guzergah) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (okul_id, ad) DO NOTHING', p);
  }
  return calistir('UPDATE servisler SET ad = $3, plaka = $4, sofor = $5, sofor_tel = $6, rehber = $7, rehber_tel = $8, ' +
    'sabah = $9, aksam = $10, guzergah = $11 WHERE id = $1 AND okul_id = $2', p);
}

const servisAdVarMi = async (okulId, ad, haricId) => !!(await tek(
  'SELECT 1 AS var FROM servisler WHERE okul_id = $1 AND lower(ad) = lower($2) AND id <> $3', [okulId, ad, haricId || '']));

const servisSil = (id, okulId) => calistir('DELETE FROM servisler WHERE id = $1 AND okul_id = $2', [id, okulId]);

/* Öğrenciyi servise yazar (başka servisteyse oradan taşınır). Servis ve
   öğrenci aynı okulda değilse hiçbir şey yazılmaz. Yeni gelen öğrenci
   sabah ve akşam sırasının sonuna eklenir; aynı serviste kalıyorsa (yalnız
   durağı değişiyorsa) sırası korunur. */
const servisOgrenciYaz = (servisId, ogrenciId, durak) => calistir(
  'INSERT INTO servis_ogrencileri (ogrenci_id, servis_id, durak, sira_sabah, sira_aksam) ' +
  'SELECT k.id, s.id, $3, ' +
  '  (SELECT coalesce(max(x.sira_sabah), 0) + 1 FROM servis_ogrencileri x WHERE x.servis_id = s.id), ' +
  '  (SELECT coalesce(max(x.sira_aksam), 0) + 1 FROM servis_ogrencileri x WHERE x.servis_id = s.id) ' +
  'FROM servisler s JOIN kullanicilar k ON k.okul_id = s.okul_id ' +
  "WHERE s.id = $1 AND k.id = $2 AND k.rol = 'student' " +
  'ON CONFLICT (ogrenci_id) DO UPDATE SET ' +
  '  sira_sabah = CASE WHEN servis_ogrencileri.servis_id = EXCLUDED.servis_id THEN servis_ogrencileri.sira_sabah ELSE EXCLUDED.sira_sabah END, ' +
  '  sira_aksam = CASE WHEN servis_ogrencileri.servis_id = EXCLUDED.servis_id THEN servis_ogrencileri.sira_aksam ELSE EXCLUDED.sira_aksam END, ' +
  '  servis_id = EXCLUDED.servis_id, durak = EXCLUDED.durak',
  [servisId, ogrenciId, durak]);

/* Servisçinin düzenlediği sıra: idler baştan sona (servisin bütün öğrencileri). */
const SIRA_SABAH_YAZ = 'UPDATE servis_ogrencileri so SET sira_sabah = v.n FROM unnest($2::text[]) WITH ORDINALITY AS v(id, n) ' +
  'WHERE so.ogrenci_id = v.id AND so.servis_id = $1';
const SIRA_AKSAM_YAZ = 'UPDATE servis_ogrencileri so SET sira_aksam = v.n FROM unnest($2::text[]) WITH ORDINALITY AS v(id, n) ' +
  'WHERE so.ogrenci_id = v.id AND so.servis_id = $1';
const siraYaz = (servisId, donem, idler) => donem === 'sabah'
  ? calistir(SIRA_SABAH_YAZ, [servisId, idler]) : calistir(SIRA_AKSAM_YAZ, [servisId, idler]);

const servisOgrenciCikar = (ogrenciId, okulId) => calistir(
  'DELETE FROM servis_ogrencileri so USING servisler s WHERE so.servis_id = s.id AND so.ogrenci_id = $1 AND s.okul_id = $2',
  [ogrenciId, okulId]);

/* Servise servisçi (şoför hesabı) atanır; hesap bu okulun servisçisi olmalı.
   soforId boşsa servisçi kaldırılır. */
/* Servisçi değişince eski servisçinin açık seferi kapanır: konumu artık
   bu servisin öğrencilerine gitmez. */
const servisSoforYaz = (servisId, okulId, soforId) => islem(async () => {
  const n = await calistir(
    'UPDATE servisler s SET sofor_id = $3 WHERE s.id = $1 AND s.okul_id = $2 AND ($3::text IS NULL OR EXISTS ' +
    "(SELECT 1 FROM kullanicilar k WHERE k.id = $3 AND k.okul_id = $2 AND k.rol = 'servisci'))",
    [servisId, okulId, soforId || null]);
  if (n) {
    await calistir('UPDATE servis_seferleri SET bitis = now() WHERE servis_id = $1 AND bitis IS NULL AND ' +
      'sofor_id IS DISTINCT FROM $2', [servisId, soforId || null]);
  }
  return n;
});

/* Servisçinin servisleri. */
const soforunServisleri = soforId => sorgu(SERVIS_ALANLARI + 'FROM servisler s WHERE s.sofor_id = $1 ORDER BY s.ad', [soforId]);

/* Bir servisin öğrencileri, ev konumları ve sıralarıyla (servisçi ekranı, yoklama ve yaklaşma hesabı). */
const servisinOgrencileri = servisId => sorgu(
  'SELECT so.ogrenci_id, so.servis_id, so.durak, so.sira_sabah, so.sira_aksam, k.ad_soyad AS ad, c.ad AS sinif, ek.enlem, ek.boylam ' +
  'FROM servis_ogrencileri so JOIN kullanicilar k ON k.id = so.ogrenci_id ' +
  'LEFT JOIN siniflar c ON c.id = k.sinif_id LEFT JOIN ogrenci_konumlari ek ON ek.ogrenci_id = so.ogrenci_id ' +
  'WHERE so.servis_id = $1', [servisId]);

/* ---------------- ev konumu ---------------- */
const evKonumu = ogrenciId => tek('SELECT ogrenci_id, enlem, boylam, guncelleme FROM ogrenci_konumlari WHERE ogrenci_id = $1', [ogrenciId]);
const evKonumuYaz = (ogrenciId, enlem, boylam, girenId) => calistir(
  'INSERT INTO ogrenci_konumlari (ogrenci_id, enlem, boylam, giren_id) VALUES ($1, $2, $3, $4) ' +
  'ON CONFLICT (ogrenci_id) DO UPDATE SET enlem = EXCLUDED.enlem, boylam = EXCLUDED.boylam, ' +
  'giren_id = EXCLUDED.giren_id, guncelleme = now()', [ogrenciId, enlem, boylam, girenId]);
const evKonumuSil = ogrenciId => calistir('DELETE FROM ogrenci_konumlari WHERE ogrenci_id = $1', [ogrenciId]);

/* ---------------- seferler ----------------
   Aracın yalnızca son konumu tutulur; geçmiş iz saklanmaz. */
const SEFER_ALANLARI = 'SELECT id, servis_id, sofor_id, yon, baslangic, bitis, son_enlem, son_boylam, son_dogruluk, son_konum ';
const acikSefer = servisId => tek(SEFER_ALANLARI + 'FROM servis_seferleri WHERE servis_id = $1 AND bitis IS NULL', [servisId]);
const seferBul = id => tek(SEFER_ALANLARI + 'FROM servis_seferleri WHERE id = $1', [id]);

/* Servisin süren seferi döner ya da yenisi açılır; tek işlemde ve servis
   satırı kilitliyken: aynı anda gelen istekler (iki ilk "Bindi", "Başlat"a
   iki kez basmak) tek sefer açar, biri "zaten var" hatası almaz.
   surerMi(sefer): açık sefer kullanılabilir mi (saat aralığı, yön, servisçi;
   bölüm karar verir). Kullanılamıyorsa kapanır, yenisi açılır.
   s: { id, servisId, soforId, yon }. Dönen: { sefer, yeni } */
async function seferAcYaDaBul(s, surerMi) {
  return islem(async () => {
    await tek('SELECT id FROM servisler WHERE id = $1 FOR UPDATE', [s.servisId]);
    const acik = await tek(SEFER_ALANLARI + 'FROM servis_seferleri WHERE servis_id = $1 AND bitis IS NULL', [s.servisId]);
    if (acik && surerMi(acik)) return { sefer: acik, yeni: false };
    await calistir('UPDATE servis_seferleri SET bitis = now() WHERE servis_id = $1 AND bitis IS NULL', [s.servisId]);
    const yeni = await tek('INSERT INTO servis_seferleri (id, servis_id, sofor_id, yon) VALUES ($1, $2, $3, $4) ' +
      'RETURNING id, servis_id, sofor_id, yon, baslangic, bitis, son_enlem, son_boylam, son_dogruluk, son_konum',
    [s.id, s.servisId, s.soforId, s.yon]);
    return { sefer: yeni, yeni: true };
  });
}

const seferBitir = (id, soforId) => calistir(
  'UPDATE servis_seferleri SET bitis = now() WHERE id = $1 AND sofor_id = $2 AND bitis IS NULL', [id, soforId]);

/* Konum yalnızca açık seferde ve seferin servisçisi yazabilir. */
const seferKonumYaz = (id, soforId, enlem, boylam, dogruluk) => calistir(
  'UPDATE servis_seferleri SET son_enlem = $3, son_boylam = $4, son_dogruluk = $5, son_konum = now() ' +
  'WHERE id = $1 AND sofor_id = $2 AND bitis IS NULL', [id, soforId, enlem, boylam, dogruluk]);

/* Yaklaşma bildirimi daha önce gitti mi? Gitmediyse işaretler: 1 = yeni. */
const seferBildirimiIsaretle = (seferId, ogrenciId, esik) => calistir(
  'INSERT INTO sefer_bildirimleri (sefer_id, ogrenci_id, esik) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
  [seferId, ogrenciId, esik]);

/* Uzun süre konum gelmeyen açık seferler kapanır, eski seferler silinir.
   Saat aralığı ve 60 dakikalık uzatması biten seferleri bölüm kapatır
   (okul-hayati.js servisTemizle: aralık hesabı Türkiye saatiyle, JS'te). */
async function seferTemizle() {
  await calistir("UPDATE servis_seferleri SET bitis = now() WHERE bitis IS NULL AND " +
    "(sofor_id IS NULL OR coalesce(son_konum, baslangic) < now() - interval '45 minutes')");
  await calistir("DELETE FROM servis_seferleri WHERE bitis < now() - interval '30 days'");
}

/* Açık seferler, okullarının servis saatleriyle (aralık dışı kalanları bulmak için). */
const acikSeferler = () => sorgu(
  'SELECT f.id, f.servis_id, f.yon, f.baslangic, o.servis_sabah_bas, o.servis_sabah_bit, o.servis_aksam_bas, o.servis_aksam_bit ' +
  'FROM servis_seferleri f JOIN servisler s ON s.id = f.servis_id JOIN okullar o ON o.id = s.okul_id WHERE f.bitis IS NULL');

const seferleriKapat = idler => idler.length ? calistir(
  'UPDATE servis_seferleri SET bitis = now() WHERE id = ANY($1::text[]) AND bitis IS NULL', [idler]) : Promise.resolve(0);

/* Servisin açık seferi (varsa) kapanır: "Okula vardık", akşam son öğrenci indi. */
const servisSeferiniBitir = servisId => calistir(
  'UPDATE servis_seferleri SET bitis = now() WHERE servis_id = $1 AND bitis IS NULL', [servisId]);

/* Bakım ve testler için: seferin başlangıcını dakika kadar geriye çeker
   (aralığın uzatması denenir). */
const seferiGeriTarihle = (id, dakika) => calistir(
  'UPDATE servis_seferleri SET baslangic = baslangic - make_interval(mins => $2::int) WHERE id = $1', [id, dakika]);

/* ---------------- kulüpler ---------------- */

const KULUP_ALANLARI =
  'SELECT u.id, u.okul_id, u.ad, u.aciklama, u.danisman_id, d.ad_soyad AS danisman_adi, u.kontenjan, u.basvuru_acik, ' +
  '       u.gun_saat, (SELECT count(*)::int FROM kulup_uyeleri m WHERE m.kulup_id = u.id) AS uye_sayisi ' +
  'FROM kulupler u LEFT JOIN kullanicilar d ON d.id = u.danisman_id ';

const okulunKulupleri = okulId => sorgu(KULUP_ALANLARI + 'WHERE u.okul_id = $1 ORDER BY u.ad', [okulId]);
const kulupBul = id => tek(KULUP_ALANLARI + 'WHERE u.id = $1', [id]);

/* Öğrencilerin üye olduğu kulüpler: [{ ogrenci_id, kulup_id, ad, ... }] */
const ogrencilerinKulupleri = ogrenciIdler => sorgu(
  'SELECT m.ogrenci_id, u.id AS kulup_id, u.ad, u.gun_saat, d.ad_soyad AS danisman_adi ' +
  'FROM kulup_uyeleri m JOIN kulupler u ON u.id = m.kulup_id LEFT JOIN kullanicilar d ON d.id = u.danisman_id ' +
  'WHERE m.ogrenci_id = ANY($1::text[]) ORDER BY u.ad', [ogrenciIdler]);

const kulupUyeleri = kulupId => sorgu(
  'SELECT k.id, k.ad_soyad AS ad, c.ad AS sinif, m.tarih FROM kulup_uyeleri m ' +
  'JOIN kullanicilar k ON k.id = m.ogrenci_id LEFT JOIN siniflar c ON c.id = k.sinif_id WHERE m.kulup_id = $1', [kulupId]);

async function kulupKaydet(u, yeni) {
  const p = [u.id, u.okulId, u.ad, u.aciklama, u.danismanId || null, u.kontenjan || null, u.basvuruAcik, u.gunSaat];
  if (yeni) {
    return calistir('INSERT INTO kulupler (id, okul_id, ad, aciklama, danisman_id, kontenjan, basvuru_acik, gun_saat) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (okul_id, ad) DO NOTHING', p);
  }
  return calistir('UPDATE kulupler SET ad = $3, aciklama = $4, danisman_id = $5, kontenjan = $6, basvuru_acik = $7, gun_saat = $8 ' +
    'WHERE id = $1 AND okul_id = $2', p);
}

const kulupAdVarMi = async (okulId, ad, haricId) => !!(await tek(
  'SELECT 1 AS var FROM kulupler WHERE okul_id = $1 AND lower(ad) = lower($2) AND id <> $3', [okulId, ad, haricId || '']));

const kulupSil = (id, okulId) => calistir('DELETE FROM kulupler WHERE id = $1 AND okul_id = $2', [id, okulId]);

/* Üye ekler. Kulüp satırı kilitlenir; kontenjan, okul ve rol aynı işlemde
   denetlenir. sadeceAcikken: öğrenci kendisi katılıyorsa başvuru açık olmalı.
   Dönen: 'tamam' | 'zaten' | 'dolu' | 'kapali' | 'yok' */
async function uyeEkle(kulupId, ogrenciId, sadeceAcikken) {
  return islem(async () => {
    const u = await tek('SELECT id, okul_id, kontenjan, basvuru_acik FROM kulupler WHERE id = $1 FOR UPDATE', [kulupId]);
    if (!u) return 'yok';
    const ogr = await tek("SELECT id FROM kullanicilar WHERE id = $1 AND okul_id = $2 AND rol = 'student'", [ogrenciId, u.okul_id]);
    if (!ogr) return 'yok';
    if (await tek('SELECT 1 AS var FROM kulup_uyeleri WHERE kulup_id = $1 AND ogrenci_id = $2', [kulupId, ogrenciId])) return 'zaten';
    if (sadeceAcikken && !u.basvuru_acik) return 'kapali';
    if (u.kontenjan) {
      const n = (await tek('SELECT count(*)::int AS n FROM kulup_uyeleri WHERE kulup_id = $1', [kulupId])).n;
      if (n >= u.kontenjan) return 'dolu';
    }
    await calistir('INSERT INTO kulup_uyeleri (kulup_id, ogrenci_id) VALUES ($1, $2)', [kulupId, ogrenciId]);
    return 'tamam';
  });
}

/* Üyelikten çıkarır. sadeceAcikken: öğrenci kendisi ayrılıyorsa başvuru açık olmalı. */
const uyeCikar = (kulupId, ogrenciId, sadeceAcikken) => calistir(
  'DELETE FROM kulup_uyeleri m USING kulupler u WHERE m.kulup_id = u.id AND m.kulup_id = $1 AND m.ogrenci_id = $2 ' +
  'AND (NOT $3 OR u.basvuru_acik)', [kulupId, ogrenciId, !!sadeceAcikken]);

module.exports = {
  yemekler, yemekYaz,
  okulunServisleri, servisBul, servisOgrencileri, ogrencilerinServisi, servisKaydet, servisAdVarMi, servisSil,
  servisOgrenciYaz, servisOgrenciCikar, servisSoforYaz, soforunServisleri, servisinOgrencileri, siraYaz,
  evKonumu, evKonumuYaz, evKonumuSil, acikSefer, seferBul, seferAcYaDaBul, seferBitir, seferKonumYaz,
  seferBildirimiIsaretle, seferTemizle, acikSeferler, seferleriKapat, servisSeferiniBitir, seferiGeriTarihle,
  okulunKulupleri, kulupBul, ogrencilerinKulupleri, kulupUyeleri, kulupKaydet, kulupAdVarMi, kulupSil, uyeEkle, uyeCikar
};
