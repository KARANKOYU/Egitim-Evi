'use strict';
/* PostgreSQL bağlantısı.

   - Tek bir bağlantı havuzu (pg.Pool) tüm istekler arasında paylaşılır.
   - sorgu(sql, parametreler): parametreler HER ZAMAN $1, $2 ... ile verilir,
     metne yapıştırılmaz. SQL enjeksiyonuna karşı asıl koruma budur;
     testler/sql-denetimi.js bunu bütün kodda denetler.
   - islem(fn): fn içindeki bütün sorgular tek bir işlemde (transaction)
     çalışır; biri hata verirse hepsi geri alınır. Örnek: bir ödev 30
     öğrenciye verilirken ya hepsine gider ya hiçbirine.
     İşlem içindeyken sorgu() kendiliğinden o işlemin bağlantısını kullanır
     (AsyncLocalStorage); depolara bağlantı taşımak gerekmez.

   Bağlantı bilgisi data/ayarlar.json > veritabani (araclar/veritabani-kur.js
   yazar) ya da DATABASE_URL ortam değişkeninden gelir. */

const pg = require('pg');
const { AsyncLocalStorage } = require('async_hooks');
const { ayarlar } = require('../ayarlar');

/* ---------- tür dönüşümleri ----------
   Uygulama tarih ve saatleri metin olarak kullanır ("2026-09-25",
   "12:00", ISO zaman damgası); PostgreSQL'in türlerinden bu biçimlere. */
const zamanDamgasi = pg.types.getTypeParser(pg.types.builtins.TIMESTAMPTZ);
pg.types.setTypeParser(pg.types.builtins.DATE, s => s);                                   // 'YYYY-AA-GG'
pg.types.setTypeParser(pg.types.builtins.TIME, s => s.slice(0, 5));                       // 'SS:DD'
pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, s => zamanDamgasi(s).toISOString()); // ISO
pg.types.setTypeParser(pg.types.builtins.NUMERIC, s => parseFloat(s));                    // not, ağırlık
pg.types.setTypeParser(pg.types.builtins.INT8, s => Number(s));                           // count(*)

let havuz = null;
const islemBaglami = new AsyncLocalStorage();

function baglantiAyari() {
  if (process.env.DATABASE_URL) return { connectionString: process.env.DATABASE_URL };
  const v = ayarlar.veritabani;
  if (!v || !v.kullanici) {
    throw new Error('Veritabanı ayarı yok. Önce kurulum yapılmalı: npm run veritabani-kur');
  }
  return {
    host: v.sunucu || 'localhost',
    port: Number(v.port) || 5432,
    user: v.kullanici,
    password: v.sifre,
    database: v.ad
  };
}

function havuzuAc() {
  if (havuz) return havuz;
  havuz = new pg.Pool(Object.assign(baglantiAyari(), {
    max: 10,                        // aynı anda en fazla 10 bağlantı
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    options: '-c timezone=UTC -c statement_timeout=15000'   // saatler UTC; takılan sorgu 15 sn'de kesilir
  }));
  /* Boştaki bağlantı koparsa (veritabanı yeniden başladı vb.) süreç çökmesin. */
  havuz.on('error', e => console.error('Veritabanı bağlantı hatası:', e.message));
  return havuz;
}

function aktifIstemci() {
  return islemBaglami.getStore() || havuzuAc();
}

/* Sorgu çalıştırır, satırları döndürür. */
async function sorgu(sql, parametreler) {
  const r = await aktifIstemci().query(sql, parametreler || []);
  return r.rows;
}

/* Tek satır (ya da null). */
async function tek(sql, parametreler) {
  const satirlar = await sorgu(sql, parametreler);
  return satirlar.length ? satirlar[0] : null;
}

/* Etkilenen satır sayısı (UPDATE / DELETE için). */
async function calistir(sql, parametreler) {
  const r = await aktifIstemci().query(sql, parametreler || []);
  return r.rowCount;
}

/* fn'yi tek bir işlem içinde çalıştırır. İç içe çağrılırsa dıştaki işleme katılır. */
async function islem(fn) {
  if (islemBaglami.getStore()) return fn();
  const istemci = await havuzuAc().connect();
  try {
    await istemci.query('BEGIN');
    const sonuc = await islemBaglami.run(istemci, fn);
    await istemci.query('COMMIT');
    return sonuc;
  } catch (e) {
    try { await istemci.query('ROLLBACK'); } catch (x) { /* bağlantı zaten kopmuş */ }
    throw e;
  } finally {
    istemci.release();
  }
}

/* Parametresiz, çok komutlu SQL metni (şema dosyaları için). */
async function metinCalistir(sqlMetni) {
  await aktifIstemci().query(sqlMetni);
}

/* Türkçe alfabe sırası (Cem < Çağ < Işık < İpek). Veritabanında ICU yoksa
   boş döner; o zaman sıralama bayt sırasına düşer, uygulama yine çalışır.
   Açılışta bir kez kontrol edilir (turkceSiralamaKontrol). */
let trSiralamaVar = true;
function tr() { return trSiralamaVar ? ' COLLATE "tr-x-icu"' : ''; }
async function turkceSiralamaKontrol() {
  const r = await aktifIstemci().query("SELECT 1 FROM pg_collation WHERE collname = 'tr-x-icu'");
  trSiralamaVar = r.rowCount > 0;
  return trSiralamaVar;
}

function veritabaniAdi() {
  const a = baglantiAyari();
  if (a.database) return a.database;
  try { return new URL(a.connectionString).pathname.replace(/^\//, ''); } catch (e) { return ''; }
}

async function kapat() {
  if (havuz) { const h = havuz; havuz = null; await h.end(); }
}

/* PostgreSQL hatasını kullanıcıya gösterilecek cevaba çevirir.
   Tablo ve kısıt adları dışarı verilmez; ayrıntı yalnızca sunucu günlüğüne.
   Kodlar: https://www.postgresql.org/docs/current/errcodes-appendix.html */
const HATA_KODLARI = {
  '23505': [400, 'Bu kayıt zaten var'],
  '23503': [400, 'Bağlı olduğu kayıt bulunamadı ya da silinmiş'],
  '23514': [400, 'Geçersiz değer'],
  '23502': [400, 'Eksik bilgi'],
  '22001': [400, 'Metin çok uzun'],
  '22003': [400, 'Sayı izin verilen aralığın dışında'],
  '22007': [400, 'Geçersiz tarih'],
  '22008': [400, 'Geçersiz tarih'],
  '22P02': [400, 'Geçersiz değer'],
  '40001': [503, 'Aynı anda başka bir işlem yapıldı, tekrar dene'],
  '40P01': [503, 'Aynı anda başka bir işlem yapıldı, tekrar dene'],
  '57014': [503, 'İşlem çok uzun sürdü, tekrar dene']
};
const BAGLANTI_HATALARI = ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', '57P01', '57P03', '08001', '08006'];

module.exports = {
  sorgu, tek, calistir, islem, metinCalistir, veritabaniAdi, kapat, havuzuAc,
  tr, turkceSiralamaKontrol, hataCevir
};
