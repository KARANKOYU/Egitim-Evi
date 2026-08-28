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

