'use strict';
/* Küçük tablolar: takvim etkinlikleri, bildirimler, işlem kaydı, hatırlatmalar. */

const net = require('net');
const { EventEmitter } = require('events');
const { sorgu, tek, calistir } = require('../baglanti');

/* Bildirim yazılınca haber verilir: telefon bildirimi (push.js) bunu dinler.
   Veri katmanı dışarıya istek atmaz; yalnızca olay yayar. */
const olaylar = new EventEmitter();
const yay = liste => { if (liste.length) setImmediate(() => olaylar.emit('bildirim', liste)); };
const { uid, now, clean } = require('../../ortak');
const e = require('../esleme');

/* ================= takvim ================= */
async function takvimBul(id) {
  if (!id) return null;
  return e.takvim(await tek('SELECT * FROM takvim_etkinlikleri WHERE id = $1', [id]));
}

/* Verilen aralıkla kesişen okul etkinlikleri. */
async function takvimAraligi(okulId, bas, bit) {
  return (await sorgu(
    'SELECT * FROM takvim_etkinlikleri WHERE okul_id = $1 AND tarih <= $3 AND COALESCE(bitis, tarih) >= $2 ' +
    'ORDER BY tarih, olusturma', [okulId, bas, bit])).map(e.takvim);
}

async function takvimEkle(k) {
  await sorgu(
    'INSERT INTO takvim_etkinlikleri (id, okul_id, tarih, bitis, baslik, tur, aciklama, ekleyen_id, yil_id, olusturma) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    [k.id, k.schoolId, k.tarih, e.yokIse(k.bitis), k.baslik, k.tur, k.aciklama || '',
      e.yokIse(k.ekleyenId), e.yokIse(k.yilId), k.createdAt]);
}

async function takvimSil(id) {
  await calistir('DELETE FROM takvim_etkinlikleri WHERE id = $1', [id]);
}

/* ================= bildirimler =================
   Öğrenciye giden her bildirimin bir kopyası onaylı velilerine de gider;
   başında hangi çocuk olduğu yazar ("Zeynep Şahin · ..."), dokununca velinin
   o çocuğa ait sayfası açılır (#/veli-odevler?c=<öğrenci>). Birden çok
   çocuklu velide her bildirim kendi çocuğunun adını taşır, karışmaz.
   Aynı bildirimi zaten kendisi alan veliye (ör. öğrencilere ve velilere
   giden mesaj) kopya gitmez. Veliye kendi metniyle ayrıca haber veren yerler
   (devamsızlık, etüt yoklaması, servis, nakil) ve öğrencinin kendi
   hatırlatıcıları { veliye: false } ile çağırır. */
const VELI_SAYFASI = {
  odevler: 'veli-odevler', devamsizligim: 'veli-devamsizlik', ilerleyisim: 'veli-ilerleyis',
  sinavlarim: 'veli-ilerleyis', etutlerim: 'etutlerim', servis: 'servis', takvim: 'takvim',
  kulupler: 'kulupler', yemek: 'yemek'
};

function veliBaglantisi(baglanti, ogrenciId) {
  const sayfa = String(baglanti || '').replace(/^#\/?/, '');
  return '#/' + (VELI_SAYFASI[sayfa] || 'cocuklarim') + '?c=' + ogrenciId;
}

/* liste = [{ kime, metin, baglanti }] -> velilere gidecek kopyalar */
async function veliKopyalari(liste) {
  const kimler = [...new Set(liste.map(b => b.kime))];
  if (!kimler.length) return [];
  const satirlar = await sorgu(
    'SELECT o.id AS ogrenci_id, o.ad_soyad, b.veli_id FROM kullanicilar o ' +
    'JOIN veli_baglari b ON b.ogrenci_id = o.id JOIN kullanicilar v ON v.id = b.veli_id ' +
    "WHERE o.id = ANY($1::text[]) AND o.rol = 'student' AND v.durum = 'approved'", [kimler]);
  if (!satirlar.length) return [];
  const veliler = new Map();
  for (const r of satirlar) {
    if (!veliler.has(r.ogrenci_id)) veliler.set(r.ogrenci_id, { ad: r.ad_soyad, idler: [] });
    veliler.get(r.ogrenci_id).idler.push(r.veli_id);
  }
  const zatenAlan = new Set(kimler);
  const kopya = [];
  for (const b of liste) {
    const v = veliler.get(b.kime);
    if (!v) continue;
    for (const vid of v.idler) {
      if (zatenAlan.has(vid)) continue;
      kopya.push({ kime: vid, metin: v.ad + ' · ' + b.metin, baglanti: veliBaglantisi(b.baglanti, b.kime) });
    }
  }
  return kopya;
}

/* Kişiye göre değişen metinler tek sorguda (kopya eklemeden). */
async function bildirimYaz(liste) {
  const temiz = liste.filter(b => b && b.kime);
  if (!temiz.length) return;
  await sorgu(
    'INSERT INTO bildirimler (id, kullanici_id, metin, baglanti) ' +
    'SELECT $1 || md5(random()::text || k || m), k, m, b ' +
    'FROM unnest($2::text[], $3::text[], $4::text[]) AS x(k, m, b)',
    ['n_', temiz.map(b => b.kime), temiz.map(b => clean(b.metin, 300)), temiz.map(b => b.baglanti || '')]);
  yay(temiz.map(b => ({ kime: b.kime, metin: clean(b.metin, 300), baglanti: b.baglanti || '' })));
}

const veliyeGitsinMi = secenek => !secenek || secenek.veliye !== false;

async function bildir(kullaniciId, metin, baglanti, secenek) {
  if (!kullaniciId) return;
  await cokluBildir([{ kime: kullaniciId, metin, baglanti: baglanti || '' }], secenek);
}

async function yoneticilereBildir(metin, baglanti) {
  const idler = (await sorgu("SELECT id FROM kullanicilar WHERE rol = 'admin'")).map(r => r.id);
  await topluBildir(idler, metin, baglanti);
}

async function bildirimleri(kullaniciId, sinir) {
  return (await sorgu('SELECT * FROM bildirimler WHERE kullanici_id = $1 ORDER BY olusturma DESC LIMIT $2',
    [kullaniciId, sinir || 100])).map(e.bildirim);
}

/* Bildirim kutusunun kısa özeti. Yeni bildirim gelince, okununca ya da
   silinince değişir; istemci her yoklamada bunu gönderir, değişmemişse
   liste yeniden indirilmez. */
async function bildirimSurumu(kullaniciId) {
  const r = await tek(
    'SELECT count(*) AS toplam, count(*) FILTER (WHERE NOT okundu) AS okunmamis, max(olusturma) AS son ' +
    'FROM bildirimler WHERE kullanici_id = $1', [kullaniciId]);
  return {
    surum: r.toplam + '.' + r.okunmamis + '.' + (r.son ? Date.parse(r.son) : 0),
    okunmamis: r.okunmamis
  };
}

async function bildirimleriOkundu(kullaniciId) {
  await calistir('UPDATE bildirimler SET okundu = true WHERE kullanici_id = $1 AND NOT okundu', [kullaniciId]);
}

/* ================= işlem kaydı ================= */
const ISLEM_SINIR = 5000;

async function islemYaz(kisi, islem, detay, ip) {
  await sorgu(
    'INSERT INTO islem_kaydi (id, okul_id, kullanici_id, kullanici_ad, kullanici_rol, islem, detay, ip, tarih) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    [uid('ik'), kisi && kisi.schoolId ? kisi.schoolId : null, kisi ? kisi.id : null,
      kisi ? kisi.fullName : '(bilinmiyor)', kisi ? kisi.role : '', islem, clean(detay, 300),
      net.isIP(String(ip || '')) ? ip : null, now()]);
  /* Sınırı aşınca en eskiler atılır. */
  await calistir('DELETE FROM islem_kaydi WHERE id IN (SELECT id FROM islem_kaydi ORDER BY tarih DESC OFFSET $1)',
    [ISLEM_SINIR]);
}

/* okulId null ise bütün okullar (sistem yöneticisi). */
async function islemKayitlari(okulId, islemTuru, sinir) {
  const p = [okulId, islemTuru || '', sinir || 300];
  const kosul = '($1::text IS NULL OR okul_id = $1) AND ($2 = \'\' OR islem = $2)';
  const kayitlar = (await sorgu('SELECT * FROM islem_kaydi WHERE ' + kosul + ' ORDER BY tarih DESC LIMIT $3', p))
    .map(e.islemKaydi);
  const toplam = (await tek('SELECT count(*) AS n FROM islem_kaydi WHERE ' + kosul, p.slice(0, 2))).n;
  const turler = (await sorgu(
    'SELECT islem, max(tarih) AS son FROM islem_kaydi WHERE ($1::text IS NULL OR okul_id = $1) ' +
    'GROUP BY islem ORDER BY son DESC', [okulId])).map(r => r.islem);
  return { kayitlar, toplam, turler };
}

/* ================= hatırlatmalar ================= */
/* Aynı olay için ikinci bildirim gitmesin: anahtarlardan ilk kez görülenleri
   döndürür (hepsi tek sorguda). Anahtar örneği: 'sinav:e_12:u_34'.
   İşaretler 30 gün saklanır (hatirlatmaTemizle). */
async function ilkKezOlanlar(anahtarlar) {
  if (!anahtarlar.length) return new Set();
  const r = await sorgu(
    'INSERT INTO hatirlatmalar (anahtar) SELECT DISTINCT unnest($1::text[]) ON CONFLICT DO NOTHING RETURNING anahtar',
    [anahtarlar]);
  return new Set(r.map(x => x.anahtar));
}

/* Anahtarı ilk kez işaretliyorsa true (hatırlatma gönderilmeli), zaten varsa false. */
async function hatirlatmaIsaretle(anahtar) {
  const r = await sorgu('INSERT INTO hatirlatmalar (anahtar) VALUES ($1) ON CONFLICT DO NOTHING RETURNING anahtar',
    [anahtar]);
  return r.length > 0;
}

async function hatirlatmaTemizle(gun) {
  return calistir('DELETE FROM hatirlatmalar WHERE gonderilme < now() - make_interval(days => $1)', [gun]);
}

/* ================= açılış sayfası rakamları ================= */
/* Onaylı okul sayısı ve kişi sayısı. Kişi: okul rol satırları (aynı
   yetişkinin öğretmenliği, müdürlüğü) ve yönetici sayılmaz. */
async function siteSayilari() {
  const [okul] = await sorgu("SELECT count(*)::int AS n FROM okullar WHERE durum = 'approved'");
  const [kisi] = await sorgu(
    "SELECT count(*)::int AS n FROM kullanicilar WHERE ana_hesap_id IS NULL AND durum = 'approved' " +
    "AND (rol IS NULL OR rol <> 'admin')");
  return { okul: okul.n, kisi: kisi.n };
}

module.exports = {
  siteSayilari,
  takvimBul, takvimAraligi, takvimEkle, takvimSil,
  olaylar, bildir, topluBildir, cokluBildir, yoneticilereBildir, bildirimleri, bildirimSurumu, bildirimleriOkundu,
  ISLEM_SINIR, islemYaz, islemKayitlari,
  ilkKezOlanlar, hatirlatmaIsaretle, hatirlatmaTemizle
};
