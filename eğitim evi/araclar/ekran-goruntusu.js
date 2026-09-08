/*
  Her rol için her sayfanın gerçek ekran görüntüsünü alır.

  Nasıl çalışıyor:
    1. API'den giriş yapıp oturum anahtarı alınır (2FA kodu sunucu günlüğünden okunur)
    2. Geçici bir sayfa (_oturum.html) anahtarı localStorage'a yazar
    3. Chrome başsız kipte önce o sayfayı açar (anahtar profile kaydolur),
       sonra #/sayfa adreslerini tek tek açıp resmini alır

  Çalıştırma:
    node ekran-goruntusu.js
*/

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { iste, girisYap } = require('./giris');

const BASE = process.env.EE_BASE || 'http://localhost:3200';
const PROJE = 'C:\\Users\\faruk\\Desktop\\eğitim evi';
const CIKTI = path.join(PROJE, 'ekran-goruntuleri');
const PROFIL_KOK = path.join(__dirname, 'chrome-profil');

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(p => fs.existsSync(p));

const GENISLIK = 1440;
const YUKSEKLIK = 1000;

/* Hangi rol hangi sayfaları görür */
const ROLLER = [
  {
    ad: 'mudur', baslik: 'Müdür',
    eposta: 'mudur@test.com', sifre: 'Test1234',
    sayfalar: [
      ['ana', 'Ana sayfa'],
      ['takvim', 'Takvim'],
      ['mesajlar', 'Mesajlar'],
      ['siniflar', 'Sınıflar'],
      ['program', 'Ders programı'],
      ['roller', 'Roller ve yetkiler'],
      ['okul-ogrenciler', 'Okul öğrencileri'],
      ['ogretmenler', 'Öğretmenler'],
      ['ders-odevleri', 'Ders ödevleri'],
      ['ogr-sinavlar', 'Sınavlar'],
      ['yoklama', 'Yoklama'],
      ['devamsizlik', 'Devamsızlık'],
      ['aktarim', 'Excel aktarım'],
      ['islem-kaydi', 'İşlem kaydı'],
      ['profil', 'Ayarlar']
    ]
  },
  {
    ad: 'ogretmen', baslik: 'Öğretmen',
    eposta: 'mat@test.com', sifre: 'Test1234',
    sayfalar: [
      ['ana', 'Ana sayfa'],
      ['takvim', 'Takvim'],
      ['mesajlar', 'Mesajlar'],
      ['programim', 'Ders programım'],
      ['ogr-odevler', 'Ödevler'],
      ['ogr-sinavlar', 'Sınavlar'],
      ['yoklama', 'Yoklama'],
      ['profil', 'Ayarlar']
    ]
  },
  {
    ad: 'ogrenci', baslik: 'Öğrenci',
    eposta: 'ogrenci1@test.com', sifre: 'Test1234',
    sayfalar: [
      ['ana', 'Ana sayfa'],
      ['takvim', 'Takvim'],
      ['mesajlar', 'Mesajlar'],
      ['programim', 'Ders programı'],
      ['odevler', 'Ödevler'],
      ['devamsizligim', 'Devamsızlığım'],
      ['sinavlarim', 'Sınavlarım'],
      ['ilerleyisim', 'İlerleyişim'],
      ['profil', 'Ayarlar']
    ]
  },
  {
    ad: 'veli', baslik: 'Veli',
    eposta: null,               // aşağıda oluşturulur
    sifre: 'Veli12345',
    sayfalar: [
      ['ana', 'Ana sayfa'],
      ['takvim', 'Takvim'],
      ['mesajlar', 'Mesajlar'],
      ['cocuklarim', 'Çocuklarım'],
      ['profil', 'Ayarlar']
    ]
  },
  {
    ad: 'admin', baslik: 'Yönetici',
    eposta: 'admin@egitimevi.com', sifre: 'admin123',
    sayfalar: [
      ['ana', 'Ana sayfa'],
      ['onaylar', 'Onay bekleyenler'],
      ['mudurler', 'Müdürler'],
      ['okullar', 'Okullar'],
      ['yedekler', 'Yedekleme'],
      ['islem-kaydi', 'İşlem kaydı'],
      ['profil', 'Ayarlar']
    ]
  }
];

/* Oturumun ayakta olup olmadığını sunucuya sorar; düşmüşse yeniden girer.
   Hız sınırına takıldıysak biraz bekleyip tekrar dener. */
async function oturumTazele(oturum, eposta, rol) {
  for (let deneme = 1; deneme <= 3; deneme++) {
    const kontrol = await iste('/api/me', 'GET', null, oturum.token);
    if (kontrol.status === 200) return oturum;

    if (kontrol.status === 429) {
      console.log('    hiz siniri, 40 sn bekleniyor...');
      await bekle(40000);
      continue;
    }

    console.log('    oturum dustu (' + kontrol.status + '), yeniden giriliyor');
    await bekle(3000);
    try {
      oturum = await girisYap(eposta, rol.sifre);
      return oturum;
    } catch (e) {
      console.log('    giris basarisiz: ' + e.message);
      await bekle(10000);
    }
  }
  return null;
}

function chromeCalistir(args) {
  return new Promise((resolve, reject) => {
    execFile(CHROME, args, { timeout: 60000, windowsHide: true }, (err) => {
      /* Başsız Chrome resim aldıktan sonra sıfır olmayan kod dönebiliyor;
         dosya oluştuysa başarılı sayıyoruz. */
      resolve();
    });
  });
}

const bekle = ms => new Promise(r => setTimeout(r, ms));

/* Sunucunun hız sınırı var: 26 sayfa yüklemesi dakikada 300 isteği aşabiliyor.
   429 alırsak bekleyip tekrar deniyoruz — sınırı gevşetmek yerine sabırlı oluyoruz. */
async function sabirla(fn, ad) {
  for (let deneme = 1; deneme <= 6; deneme++) {
    try {
      return await fn();
    } catch (e) {
      const son = deneme === 6;
      if (son) throw e;
      const sn = deneme * 15;
      console.log('    ' + ad + ' bekliyor (' + sn + ' sn): ' + e.message.slice(0, 60));
      await bekle(sn * 1000);
    }
  }
}

async function botCevabi() {
  const s = await iste('/api/challenge');
  if (!s.body || !s.body.soru) {
    throw new Error('soru alinamadi (' + s.status + ') ' + JSON.stringify(s.body).slice(0, 60));
  }
  const m = s.body.soru.match(/(\d+)\s*\+\s*(\d+)/);
  return { challengeId: s.body.id, challengeAnswer: Number(m[1]) + Number(m[2]) };
}

async function veliHazirla() {
  /* Veli hesabı aç (varsa dokunma) ve bir öğrenciye bağla */
  const eposta = 'veli.gorsel@test.com';
  const bot = await sabirla(botCevabi, 'soru');
  const kayit = await iste('/api/register', 'POST', { kvkkOnay: true, phone: '05321234567',
    role: 'parent', fullName: 'Fatma Yılmaz', email: eposta, password: 'Veli12345',
    city: 'Ankara', challengeId: bot.challengeId, challengeAnswer: bot.challengeAnswer
  });
  if (kayit.status !== 200 && !/zaten kayıtlı/i.test(kayit.body.error || '')) {
    console.log('    veli kaydı: ' + (kayit.body.error || kayit.status));
  }

  const mudur = await sabirla(() => girisYap('mudur@test.com', 'Test1234'), 'mudur girisi');
  const ogr = await iste('/api/school/students', 'GET', null, mudur.token);
  const kod = ogr.body.students[0] && ogr.body.students[0].code;

  const veli = await sabirla(() => girisYap(eposta, 'Veli12345'), 'veli girisi');
  if (kod) {
    const bagla = await iste('/api/parent/link', 'POST', { code: kod }, veli.token);
    if (bagla.status !== 200) console.log('    çocuk bağlama: ' + (bagla.body.error || bagla.status));
  }
  return eposta;
}

async function calistir() {
  if (!CHROME) {
    console.error('Chrome ya da Edge bulunamadı.');
    process.exit(1);
  }
  console.log('Tarayıcı:', CHROME);

  fs.mkdirSync(CIKTI, { recursive: true });

  /* Oturum anahtarını yazan geçici sayfa */
  /* CSP satır içi betiği engelliyor; yardımcı betik ayrı dosya olmalı. */
  const yardimciHtml = path.join(PROJE, 'public', '_oturum.html');
  const yardimciJs = path.join(PROJE, 'public', '_oturum.js');
  fs.writeFileSync(yardimciHtml,
    '<!DOCTYPE html><meta charset="utf-8"><title>oturum</title>' +
    '<body>hazirlaniyor<script src="/_oturum.js"></script>', 'utf8');
  fs.writeFileSync(yardimciJs,
    '(function(){var p=new URLSearchParams(location.search);' +
    'var t=p.get("t");if(t){try{localStorage.setItem("ee_token",t);}catch(e){}}' +
    'var g=p.get("git")||"ana";' +
    'location.replace("/#/"+g);})();', 'utf8');

  let toplam = 0;
  const indeks = [];

  for (const rol of ROLLER) {
    const eposta = rol.eposta || await veliHazirla();
    let oturum;
    try {
      oturum = await sabirla(() => girisYap(eposta, rol.sifre), rol.baslik + ' girisi');
    } catch (e) {
      console.log('  ATLANDI ' + rol.baslik + ': ' + e.message);
      continue;
    }

    const klasor = path.join(CIKTI, rol.ad);
    fs.mkdirSync(klasor, { recursive: true });
    const profil = path.join(PROFIL_KOK, rol.ad);
    fs.rmSync(profil, { recursive: true, force: true });
    fs.mkdirSync(profil, { recursive: true });

    console.log('\n' + rol.baslik + ' (' + rol.sayfalar.length + ' sayfa)');
    const sayfalar = [];

    for (let i = 0; i < rol.sayfalar.length; i++) {
      const [anahtar, ad] = rol.sayfalar[i];
      const dosyaAd = String(i + 1).padStart(2, '0') + '-' + anahtar + '.png';
      const hedef = path.join(klasor, dosyaAd);

      /* Oturum hâlâ geçerli mi? Hız sınırına takılıp oturum düşerse
         uygulama giriş ekranını gösteriyor ve o ekranın resmi kaydediliyordu.
         Her kareden önce kontrol edip gerekirse yeniden giriyoruz. */
      oturum = await oturumTazele(oturum, eposta, rol);
      if (!oturum) {
        console.log('  ATLANDI ' + ad + ': oturum kurulamadi');
        continue;
      }

      await chromeCalistir([
        '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
        '--user-data-dir=' + profil,
        '--hide-scrollbars',
        '--virtual-time-budget=9000',
        '--window-size=' + GENISLIK + ',' + YUKSEKLIK,
        '--screenshot=' + hedef,
        BASE + '/_oturum.html?t=' + encodeURIComponent(oturum.token) +
          '&git=' + encodeURIComponent(anahtar)
      ]);

      await bekle(3500);   /* sunucuyu hız sınırına sokmayalım */

      /* 25 KB altı görüntü genelde hata sayfasıdır (hız sınırı vb.) — bir daha dene. */
      if (fs.existsSync(hedef) && fs.statSync(hedef).size < 25 * 1024) {
        console.log('    ' + ad + ' kucuk cikti, 30 sn sonra tekrar');
        await bekle(30000);
        await chromeCalistir([
          '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
          '--user-data-dir=' + profil, '--hide-scrollbars',
          '--virtual-time-budget=9000',
          '--window-size=' + GENISLIK + ',' + YUKSEKLIK,
          '--screenshot=' + hedef,
          BASE + '/_oturum.html?t=' + encodeURIComponent(oturum.token) +
            '&git=' + encodeURIComponent(anahtar)
        ]);
      }

      if (fs.existsSync(hedef)) {
        const kb = (fs.statSync(hedef).size / 1024).toFixed(0);
        console.log('  ' + dosyaAd + '  ' + ad + '  (' + kb + ' KB)');
        sayfalar.push({ dosya: rol.ad + '/' + dosyaAd, ad: ad });
        toplam++;
      } else {
        console.log('  ALINAMADI: ' + ad);
      }
    }
    indeks.push({ rol: rol.baslik, klasor: rol.ad, sayfalar: sayfalar });
    await bekle(10000);
  }

  /* Giriş ekranı (oturumsuz) */
  const girisProfil = path.join(PROFIL_KOK, 'giris');
  fs.rmSync(girisProfil, { recursive: true, force: true });
  fs.mkdirSync(girisProfil, { recursive: true });
  const girisDosya = path.join(CIKTI, '00-giris.png');
  await chromeCalistir([
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--user-data-dir=' + girisProfil, '--hide-scrollbars',
    '--virtual-time-budget=5000',
    '--window-size=' + GENISLIK + ',' + YUKSEKLIK,
    '--screenshot=' + girisDosya, BASE + '/'
  ]);
  if (fs.existsSync(girisDosya)) { console.log('\n00-giris.png  Giriş ekranı'); toplam++; }

  fs.unlinkSync(yardimciHtml);
  fs.unlinkSync(yardimciJs);
  fs.rmSync(PROFIL_KOK, { recursive: true, force: true });

  fs.writeFileSync(path.join(CIKTI, 'liste.json'),
    JSON.stringify({ olusturma: new Date().toISOString().slice(0, 10), roller: indeks }, null, 2), 'utf8');

  console.log('\n' + toplam + ' ekran görüntüsü -> ' + CIKTI);
}

calistir().catch(e => { console.error('HATA:', e.message, e.stack); process.exit(1); });
