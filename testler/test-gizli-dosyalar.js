/* Depo herkese açık: gizli ve kişisel dosyalar git'e giremez (sunucusuz).
   .gitignore'un her kuralı gerçek bir yol örneğiyle denenir; kural
   yanlışlıkla silinir ya da daraltılırsa bu test kalır. */
const { execFileSync } = require('child_process');
const path = require('path');

let gecti = 0, kaldi = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecti++; console.log('  GECTI  ' + ad); }
  else { kaldi++; console.log('  KALDI  ' + ad + (detay ? '  -> ' + detay : '')); }
}

const KOK = path.join(__dirname, '..');
function disaridaMi(yol) {
  try {
    execFileSync('git', ['check-ignore', '-q', '--no-index', yol], { cwd: KOK, stdio: 'ignore' });
    return true;
  } catch (e) {
    if (e.status === 1) return false;
    throw e;
  }
}

let gitVar = true;
try { execFileSync('git', ['--version'], { stdio: 'ignore' }); } catch (e) { gitVar = false; }
if (!gitVar) {
  console.log('  ATLANDI  git yok');
  console.log('\n  GECTI: 0   KALDI: 0');
  process.exit(0);
}

const DISARIDA = [
  'data/ayarlar.json', 'data/admins.json', 'data/config.yml', 'data/push-anahtar.json', 'data/okullar.json',
  'data/db.json', 'data/yedek/yedek-2026-09-27_0300.json', 'data/dosyalar/odev/a.pdf', 'data/ekler/ek.pdf',
  'data/okul-fotolari/kapak.jpg', 'data/sonradan-eklenen-dosya.json', 'veri/ayarlar.json',
  'admins.json', 'sunucu/admins.json', 'belge/admins.json',
  '.env', '.env.local', 'sunucu.pem', 'ozel.key', 'imza.jks', 'yayin.keystore', 'imza.properties', 'id_rsa', '.npmrc',
  'yedek-elle-2026.json', 'dokum.sql.gz', 'sunucu.log', 'testler/testdata/ayarlar.json',
  'baslat.bat', 'araclar/okullari-cek.js', 'public/_deneme.html', 'yapi/liste.xlsx', '.claude/ayarlar.json'
];
const IZLENIR = [
  'belge/admins.ornek.json', 'belge/config.ornek.yml', 'sunucu/yonetici-dosyasi.js', 'public/index.html',
  'sunucu/veri/sema/001-ilk.sql', 'testler/test-gizli-dosyalar.js', 'package.json'
];

for (const y of DISARIDA) kontrol('depoya giremez: ' + y, disaridaMi(y));
for (const y of IZLENIR) kontrol('depoya girer: ' + y, !disaridaMi(y));

/* İzlenen dosyalardan hiçbiri gizli kurallara takılmamalı (takılıyorsa ya kural yanlış ya dosya sızmış). */
const takilan = execFileSync('git', ['ls-files', '-ci', '--exclude-standard'], { cwd: KOK, encoding: 'utf8' }).trim();
kontrol('depoda izlenen hiçbir dosya gizli kurallara takılmıyor', takilan === '', takilan.split('\n').slice(0, 5).join(', '));

console.log('\n  GECTI: ' + gecti + '   KALDI: ' + kaldi);
process.exit(kaldi ? 1 : 0);
