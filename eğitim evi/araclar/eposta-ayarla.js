/*
  E-posta (SMTP) kurulum aracı.

  Çalıştırma:  node araclar/eposta-ayarla.js
  ya da        eposta-ayarla.bat dosyasına çift tıkla

  Sorulara sırayla cevap verirsin, şifre yazarken ekranda görünmez.
  Sonuç data/ayarlar.json dosyasına yazılır; istersen deneme e-postası gönderir.
*/

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const eposta = require('../eposta');

const KOK = path.join(__dirname, '..');
const DATA = path.join(KOK, 'data');
const AYAR_DOSYA = path.join(DATA, 'ayarlar.json');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function sor(soru, varsayilan) {
  const ek = varsayilan ? ' [' + varsayilan + ']' : '';
  return new Promise(resolve => {
    rl.question(soru + ek + ': ', cevap => {
      const c = String(cevap).trim();
      resolve(c || varsayilan || '');
    });
  });
}

/* Şifre yazılırken ekrana yansımasın. */
function sifreSor(soru) {
  return new Promise(resolve => {
    const cikti = process.stdout;
    let gizli = true;
    const eskiYaz = rl._writeToOutput;

    rl._writeToOutput = function (metin) {
      if (!gizli) return eskiYaz.call(rl, metin);
      /* Soruyu göster, yazılan karakterleri gösterme. */
      if (metin.indexOf(soru) >= 0) return eskiYaz.call(rl, metin);
      if (metin === '\r\n' || metin === '\n') return eskiYaz.call(rl, metin);
      cikti.write('*');
    };

    rl.question(soru + ': ', cevap => {
      gizli = false;
      rl._writeToOutput = eskiYaz;
      cikti.write('\n');
      resolve(String(cevap).trim());
    });
  });
}

function baslik(metin) {
  console.log('');
  console.log('  ' + metin);
  console.log('  ' + '-'.repeat(metin.length));
}

async function calistir() {
  console.log('');
  console.log('  ============================================');
  console.log('     EGITIM EVI - E-POSTA KURULUMU');
  console.log('  ============================================');
  console.log('');
  console.log('  Giris kodlari bu adresten gonderilecek.');
  console.log('  Sifren SADECE bu bilgisayardaki data/ayarlar.json');
  console.log('  dosyasina yazilir, baska hicbir yere gitmez.');

  baslik('1) Saglayicini sec');
  const anahtarlar = Object.keys(eposta.SAGLAYICILAR);
  anahtarlar.forEach((k, i) => {
    const s = eposta.SAGLAYICILAR[k];
    console.log('   ' + (i + 1) + ') ' + s.ad.padEnd(9) + s.sunucu + ':' + s.port);
  });
  console.log('   ' + (anahtarlar.length + 1) + ') Elle gir');
  console.log('');

  const secim = await sor('  Numara', '1');
  const indeks = parseInt(secim, 10) - 1;

  let sunucu, port, guvenli, not = '';
  if (indeks >= 0 && indeks < anahtarlar.length) {
    const s = eposta.SAGLAYICILAR[anahtarlar[indeks]];
    sunucu = s.sunucu; port = s.port; guvenli = s.guvenli; not = s.not;
    console.log('  -> ' + s.ad + ' secildi.');
    if (not) console.log('     Not: ' + not);
  } else {
    sunucu = await sor('  SMTP sunucusu', 'mail.gmx.com');
    port = parseInt(await sor('  Port (465 veya 587)', '587'), 10) || 587;
    guvenli = (port === 465);
  }

  baslik('2) Hesap bilgileri');
  const kullanici = await sor('  Kullanici adi (tam e-posta adresin)');
  if (!kullanici) { console.log('\n  Kullanici adi bos olamaz. Iptal edildi.'); rl.close(); return; }

  const sifre = await sifreSor('  Sifre (ekranda gorunmez)');
  if (!sifre) { console.log('\n  Sifre bos olamaz. Iptal edildi.'); rl.close(); return; }

  const gonderen = await sor('  Gonderen adres', kullanici);
  const gorunenAd = await sor('  Gorunen ad', 'Egitim Evi');

  const ayar = {
    etkin: true,
    sunucu: sunucu,
    port: port,
    guvenli: guvenli,
    kullanici: kullanici,
    sifre: sifre,
    gonderen: gonderen,
    gorunenAd: gorunenAd
  };

  baslik('3) Deneme e-postasi');
  const deneme = await sor('  Deneme maili gonderilsin mi? (E/h)', 'E');
  if (/^e/i.test(deneme)) {
    const alici = await sor('  Hangi adrese', kullanici);
    console.log('  Gonderiliyor...');
    try {
      await eposta.gonder(ayar, alici, 'Egitim Evi deneme e-postasi',
        'Bu bir deneme mesajidir.\n\nBunu okuyabiliyorsan e-posta ayarlarin dogru calisiyor.\n\nEgitim Evi');
      console.log('  BASARILI: mail gonderildi -> ' + alici);
      console.log('  Gelen kutunu (ve spam klasorunu) kontrol et.');
    } catch (e) {
      console.log('');
      console.log('  HATA: ' + e.message);
      console.log('');
      console.log('  Sik nedenler:');
      console.log('   - Gmail/Yandex/Zoho icin normal sifre calismaz, UYGULAMA SIFRESI gerekir.');
      console.log('   - GMX icin ayarlardan POP3/IMAP erisimini acman gerekir.');
      console.log('   - Port 465 ise guvenli=true, 587 ise guvenli=false olmali.');
      console.log('');
      const yine = await sor('  Yine de kaydedeyim mi? (e/H)', 'H');
      if (!/^e/i.test(yine)) { console.log('  Kaydedilmedi.'); rl.close(); return; }
    }
  }

  /* Dosyadaki diger ayarlar korunsun, sadece eposta bolumu guncellensin. */
  let mevcut = {};
  if (fs.existsSync(AYAR_DOSYA)) {
    try { mevcut = JSON.parse(fs.readFileSync(AYAR_DOSYA, 'utf8')); } catch (e) { mevcut = {}; }
  }
  mevcut.eposta = ayar;
  if (!mevcut._aciklama) {
    mevcut._aciklama = 'E-posta ayarlari. Degistirmek icin: node araclar/eposta-ayarla.js';
  }

  fs.mkdirSync(DATA, { recursive: true });
  fs.writeFileSync(AYAR_DOSYA, JSON.stringify(mevcut, null, 2), 'utf8');

  console.log('');
  console.log('  Kaydedildi -> data/ayarlar.json');
  console.log('  Sunucu calisiyorsa KAPATIP yeniden baslat (baslat.bat).');
  console.log('');
  rl.close();
}

calistir().catch(e => {
  console.error('\n  Beklenmeyen hata:', e.message);
  rl.close();
  process.exit(1);
});
