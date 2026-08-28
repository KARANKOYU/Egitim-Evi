'use strict';
/* PostgreSQL kurulum aracı — bir kez çalıştırılır:  npm run veritabani-kur

   Ne yapar:
   1. PostgreSQL'in ana kullanıcısı "postgres"in şifresini SORAR. Şifre ekrana
      yazılmaz, hiçbir dosyaya kaydedilmez; yalnızca bu kurulum için kullanılır.
   2. Uygulamanın kendi kısıtlı kullanıcısını açar: "egitimevi". Şifresini araç
      rastgele üretir (32 karakter); kimse seçmez, kimse ezberlemez.
      Bu kullanıcı süper kullanıcı değildir, veritabanı ya da kullanıcı açamaz;
      yalnızca kendi veritabanlarının sahibidir.
   3. İki veritabanı açar: "egitimevi" (gerçek veri) ve "egitimevi_test"
      (testler; her test paketinde silinip baştan kurulur).
   4. Bağlantı bilgisini data/ayarlar.json'a yazar. Bu dosya git'e girmez.

   Tekrar çalıştırılırsa: egitimevi kullanıcısının şifresini yeniler, var olan
   veritabanlarına ve içindeki veriye DOKUNMAZ.

   Linux sunucuda: sudo -u postgres ile şifresiz bağlanılabildiği için
     node araclar/veritabani-kur.js --yerel-soket
   şeklinde çalıştırılır (bkz. belge/SUNUCUYA-KURULUM.md). */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Client } = require('pg');

const KOK = path.join(__dirname, '..');
const DATA = process.env.EE_DATA ? path.resolve(process.env.EE_DATA) : path.join(KOK, 'data');
const AYAR_DOSYA = path.join(DATA, 'ayarlar.json');

const SUNUCU = process.env.PGHOST || 'localhost';
const PORT = Number(process.env.PGPORT) || 5432;
const UYGULAMA_KULLANICI = 'egitimevi';
const VERITABANLARI = ['egitimevi', 'egitimevi_test'];

/* Sık kullanılan zayıf şifreler: yalnızca uyarı verilir, kurulum durmaz. */
const ZAYIF = ['123456', '12345678', '123456789', 'password', 'postgres', 'admin',
  'qwerty', '111111', '000000', 'sifre', 'şifre', 'root', '1234', 'abc123'];

function rastgeleSifre(uzunluk) {
  const harfler = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const b = crypto.randomBytes(uzunluk);
  let s = '';
  for (let i = 0; i < uzunluk; i++) s += harfler[b[i] % harfler.length];
  return s;
}

/* Şifreyi ekrana basmadan okur (her karakter yerine *). */
function gizliSor(soru) {
  return new Promise((resolve) => {
    const girdi = process.stdin;
    process.stdout.write(soru);
    if (!girdi.isTTY) {
      /* Borudan geliyorsa (otomasyon) tek satır oku. */
      let veri = '';
      girdi.setEncoding('utf8');
      girdi.on('data', d => { veri += d; });
      girdi.on('end', () => { process.stdout.write('\n'); resolve(veri.split(/\r?\n/)[0]); });
      return;
    }
    let s = '';
    girdi.setRawMode(true);
    girdi.resume();
    girdi.setEncoding('utf8');
    const dinle = (parca) => {
      for (const c of parca) {
        if (c === '\r' || c === '\n') {
          girdi.setRawMode(false);
          girdi.pause();
          girdi.removeListener('data', dinle);
          process.stdout.write('\n');
          return resolve(s);
        }
        if (c === '\u0003') { process.stdout.write('\n'); process.exit(1); }       // Ctrl+C
        if (c === '\u0008' || c === '\u007f') {                                    // geri sil
          if (s.length) { s = s.slice(0, -1); process.stdout.write('\b \b'); }
          continue;
        }
        s += c;
        process.stdout.write('*');
      }
    };
    girdi.on('data', dinle);
  });
}

function ayarlariOku() {
  try { return JSON.parse(fs.readFileSync(AYAR_DOSYA, 'utf8')); } catch (e) { return {}; }
}

function ayarlariYaz(ayar) {
  fs.mkdirSync(DATA, { recursive: true });
  fs.writeFileSync(AYAR_DOSYA + '.tmp', JSON.stringify(ayar, null, 2), 'utf8');
  fs.renameSync(AYAR_DOSYA + '.tmp', AYAR_DOSYA);
  /* Linux'ta dosyayı yalnızca sahibi okuyabilsin. Windows'ta etkisizdir. */
  try { fs.chmodSync(AYAR_DOSYA, 0o600); } catch (e) { /* yoksay */ }
}

(async () => {
  console.log('');
  console.log('  ==========================================');
  console.log('     EĞİTİM EVİ — veritabanı kurulumu');
  console.log('  ==========================================');
  console.log('');

  const yerelSoket = process.argv.indexOf('--yerel-soket') >= 0;
  let yonetici;
  if (yerelSoket) {
    /* Linux: sistemdeki postgres kullanıcısıyla şifresiz (peer) bağlantı. */
    yonetici = new Client({ host: '/var/run/postgresql', user: 'postgres', database: 'postgres' });
  } else {
    console.log('  PostgreSQL kurulurken "postgres" kullanıcısı için belirlediğin şifreyi gir.');
    console.log('  Şifre ekranda görünmez ve hiçbir yere kaydedilmez.');
    console.log('');
    const sifre = await gizliSor('  postgres şifresi: ');
    if (ZAYIF.indexOf(String(sifre).toLowerCase()) >= 0 || String(sifre).length < 8) {
      console.log('');
      console.log('  ! Uyarı: bu şifre zayıf. Kendi bilgisayarında sorun değil, ama sunucuda');
      console.log('    ASLA aynısını kullanma. Uygulamanın şifresi zaten ayrı ve rastgele.');
    }
    yonetici = new Client({ host: SUNUCU, port: PORT, user: 'postgres', password: sifre, database: 'postgres' });
  }

  try {
    await yonetici.connect();
  } catch (e) {
    console.log('');
    if (/password authentication failed/i.test(e.message)) {
      console.log('  HATA: şifre yanlış. Tekrar çalıştırıp dene.');
      console.log('  Unuttuysan: belge/SUNUCUYA-KURULUM.md içindeki "Şifreyi unuttum" bölümü.');
    } else if (/ECONNREFUSED/i.test(e.message)) {
      console.log('  HATA: PostgreSQL çalışmıyor ya da ' + SUNUCU + ':' + PORT + ' adresinde değil.');
      console.log('  Windows\'ta: Hizmetler (services.msc) > postgresql-x64-17 > Başlat.');
    } else {
      console.log('  HATA: bağlanılamadı: ' + e.message);
    }
    process.exit(1);
  }

  const surum = (await yonetici.query('SHOW server_version')).rows[0].server_version;
  console.log('  PostgreSQL ' + surum + ' bağlandı.');

  /* 1) Uygulama kullanıcısı: şifre DDL'e parametre olarak verilemez; format(%L)
        ile PostgreSQL'in kendisine güvenli biçimde tırnaklatıyoruz. */
  const uygulamaSifre = rastgeleSifre(32);
  const varMi = (await yonetici.query('SELECT 1 FROM pg_roles WHERE rolname = $1', [UYGULAMA_KULLANICI])).rowCount > 0;
  const ddl = (await yonetici.query(
    varMi
      ? "SELECT format('ALTER ROLE %I WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD %L', $1::text, $2::text) AS komut"
      : "SELECT format('CREATE ROLE %I WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD %L', $1::text, $2::text) AS komut",
    [UYGULAMA_KULLANICI, uygulamaSifre])).rows[0].komut;
  await yonetici.query(ddl);
  console.log('  Kullanıcı "' + UYGULAMA_KULLANICI + '" ' + (varMi ? 'güncellendi (yeni şifre).' : 'oluşturuldu.'));

  /* 2) Veritabanları: kümeden bağımsız, her yerde aynı ayarlarla.
        ICU "und" (kök) kuralları: büyük/küçük harf dönüşümü Unicode'a göre,
        Türkçe I sorunu yok. Türkçe alfabe sırası sorguda açıkça istenir. */
  for (const ad of VERITABANLARI) {
    const dbVar = (await yonetici.query('SELECT 1 FROM pg_database WHERE datname = $1', [ad])).rowCount > 0;
    if (dbVar) {
      console.log('  Veritabanı "' + ad + '" zaten var, dokunulmadı.');
    } else {
      const olustur = (await yonetici.query(
        "SELECT format('CREATE DATABASE %I OWNER %I TEMPLATE template0 ENCODING %L', $1::text, $2::text, 'UTF8') AS komut",
        [ad, UYGULAMA_KULLANICI])).rows[0].komut;
      try {
        await yonetici.query(olustur + " LOCALE_PROVIDER icu ICU_LOCALE 'und' LOCALE 'C'");
      } catch (e) {
        /* ICU yoksa düz C ile aç; Türkçe sıralama o zaman Node tarafında yapılır. */
        await yonetici.query(olustur + " LC_COLLATE 'C' LC_CTYPE 'C'");
      }
      console.log('  Veritabanı "' + ad + '" oluşturuldu.');
    }
    /* Herkese açık bağlanma hakkını kaldır; yalnızca sahibi bağlanır. */
    await yonetici.query((await yonetici.query(
      "SELECT format('REVOKE CONNECT ON DATABASE %I FROM PUBLIC', $1::text) AS komut", [ad])).rows[0].komut);
  }

  /* 3) Türkçe sıralama kuralı var mı? (sorgularda COLLATE "tr-x-icu") */
  const trVar = (await yonetici.query("SELECT 1 FROM pg_collation WHERE collname = 'tr-x-icu'")).rowCount > 0;
  console.log('  Türkçe sıralama (tr-x-icu): ' + (trVar ? 'var' : 'YOK — isim sıralaması Node tarafında yapılacak'));

  await yonetici.end();

  /* 4) Bağlantı bilgisini yaz. Diğer ayarlar (e-posta vb.) korunur. */
  const ayar = ayarlariOku();
  ayar.veritabani = {
    _aciklama: 'araclar/veritabani-kur.js tarafından yazıldı. Şifre rastgele; elle değiştirme, aracı yeniden çalıştır.',
    /* Uygulama her zaman TCP ile, kendi şifresiyle bağlanır. Sunucuda da
       PostgreSQL yalnızca 127.0.0.1'i dinler; dışarıdan ulaşılamaz. */
    sunucu: SUNUCU,
    port: PORT,
    ad: VERITABANLARI[0],
    testAd: VERITABANLARI[1],
    kullanici: UYGULAMA_KULLANICI,
    sifre: uygulamaSifre
  };
  ayarlariYaz(ayar);
  console.log('  Bağlantı bilgisi yazıldı: ' + AYAR_DOSYA);
  console.log('');
  console.log('  Kurulum bitti. Uygulama açılışta tabloları kendisi kurar.');
  console.log('');
})().catch(e => {
  console.error('\n  BEKLENMEYEN HATA: ' + e.message);
  process.exit(1);
});
