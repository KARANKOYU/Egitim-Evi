/* Turkce yazim denetimi: kullaniciya gorunen metinlerde sik yapilan
   hatalari ve Turkce karakter eksikliklerini arar. */
const fs = require('fs');
const path = require('path');

const KOK = path.join(__dirname, '..');
function sunucuDosyalari() {
  const cikti = [];
  (function gez(k) {
    for (const ad of fs.readdirSync(path.join(KOK, k))) {
      const p = path.join(k, ad);
      if (fs.statSync(path.join(KOK, p)).isDirectory()) gez(p);
      else if (/\.js$/.test(ad)) cikti.push(p);
    }
  })('sunucu');
  return cikti;
}
const DOSYALAR = [
  ...sunucuDosyalari(),
  ...fs.readdirSync(path.join(KOK, 'public', 'js', 'parcalar')).filter(a => a.endsWith('.js')).sort()
    .map(a => path.join('public', 'js', 'parcalar', a)),
  path.join('public', 'index.html'),
  path.join('public', 'kvkk.html')
];

/* Yaygin yazim hatalari: [yanlis, dogru] */
const HATALAR = [
  ['yapabilirsin?z', 'yapabilirsiniz'],
  ['seçin?iz', 'seçiniz'],
  ['herbir', 'her bir'],
  ['hiçbirşey', 'hiçbir şey'],
  ['birşey', 'bir şey'],
  ['herşey', 'her şey'],
  ['bir kaç', 'birkaç'],
  ['yalnış', 'yanlış'],
  ['yanlız', 'yalnız'],
  ['heryer', 'her yer'],
  ['hiçbiri̇', 'hiçbiri'],
  ['dahil?i etmek', '-'],
  ['aksesuar', '-'],
  ['orjinal', 'orijinal'],
  ['döküman', 'doküman'],
  ['klavuz', 'kılavuz'],
  ['kordinat', 'koordinat'],
  ['makina', 'makine'],
  ['adress', 'adres'],
  ['e mail', 'e-posta'],
  ['email', 'e-posta'],
  ['mail adresi', 'e-posta adresi'],
  ['şifreni?z? yanlıs', 'şifren yanlış'],
  ['giris yap', 'giriş yap'],
  ['ogrenci', 'öğrenci'],
  ['ogretmen', 'öğretmen'],
  ['mudur', 'müdür'],
  ['sinif', 'sınıf'],
  ['odev', 'ödev'],
  ['sinav', 'sınav'],
  ['basari', 'başarı'],
  ['devamsizlik', 'devamsızlık']
];

/* Bu kelimeler kod tanimlayicisi olarak mesru; yalnizca kullaniciya
   gorunen metinlerde (tirnak icinde ve Turkce cumle icinde) ararız. */
const KOD_KELIMELERI = new Set(['ogrenci', 'ogretmen', 'mudur', 'sinif',
  'odev', 'sinav', 'basari', 'devamsizlik', 'email']);

let bulgu = 0;
const rapor = [];

/* Kullaniciya gorunen metin: tek/cift tirnak icindeki, en az bir Turkce
   ozel karakter ya da bosluk iceren, 10+ karakterlik diziler. */
function metinleriTopla(icerik) {
  const cikti = [];
  const re = /'((?:[^'\\\n]|\\.){10,})'|"((?:[^"\\\n]|\\.){10,})"/g;
  let m;
  while ((m = re.exec(icerik))) {
    const t = m[1] || m[2];
    /* Kod gibi gorunenleri ele: yol, secici, sinif adi, HTML etiketi */
    if (/^[a-z-]+$/.test(t)) continue;
    if (t.indexOf('/api/') === 0 || t.indexOf('./') === 0) continue;
    if (/^[<>#.\[\]]/.test(t)) continue;
    /* Turkce cumle mi? bosluk ve harf icermeli */
    if (!/\s/.test(t)) continue;
    if (!/[a-zA-ZçğıöşüÇĞİÖŞÜ]{3}/.test(t)) continue;
    cikti.push({ metin: t, konum: m.index });
  }
  return cikti;
}

/* SQL metni (veri katmanındaki sorgular) kullanıcıya görünmez; İngilizce
   anahtar kelimeleri Türkçe karaktersiz metin sayılmasın. */
const SQL_KELIME = /\b(SELECT|INSERT INTO|UPDATE|DELETE FROM|FROM|WHERE|JOIN|VALUES|ON CONFLICT|ORDER BY|GROUP BY|EXISTS|RETURNING|COALESCE|DISTINCT|LIMIT|TRUNCATE|CREATE|ALTER|DROP|NOT NULL|DEFAULT|PRIMARY KEY)\b/;
function sqlMi(metin) { return SQL_KELIME.test(metin); }

function satirNo(icerik, konum) {
  return icerik.slice(0, konum).split('\n').length;
}

console.log('=== TURKCE YAZIM DENETIMI ===');

for (const dosya of DOSYALAR) {
  const tam = path.join(KOK, dosya);
  if (!fs.existsSync(tam)) continue;
  const icerik = fs.readFileSync(tam, 'utf8');
  const metinler = metinleriTopla(icerik);

  for (const { metin, konum } of metinler) {
    if (sqlMi(metin)) continue;
    for (const [yanlis, dogru] of HATALAR) {
      /* Kod kelimeleri yalnizca Turkce cumle icinde hata sayilir */
      const sadeceKod = KOD_KELIMELERI.has(yanlis);
      if (sadeceKod && !/[çğıöşüÇĞİÖŞÜ]/.test(metin)) continue;

      const re = new RegExp('(^|[\\s>(])' + yanlis + '([\\s<).,!?:]|$)', 'i');
      if (re.test(metin)) {
        bulgu++;
        rapor.push({
          dosya, satir: satirNo(icerik, konum),
          yanlis, dogru, metin: metin.slice(0, 80)
        });
        break;
      }
    }
  }
}

if (!rapor.length) {
  console.log('  yaygin yazim hatasi bulunamadi');
} else {
  for (const r of rapor) {
    console.log('  ' + r.dosya + ':' + r.satir);
    console.log('     "' + r.yanlis + '" -> "' + r.dogru + '"');
    console.log('     ' + r.metin);
  }
}

/* --- Turkce karakter kullanilmayan uzun metinler --- */
console.log();
console.log('=== TURKCE KARAKTERSIZ SUPHELI METINLER ===');
let supheli = 0;
for (const dosya of DOSYALAR) {
  const tam = path.join(KOK, dosya);
  if (!fs.existsSync(tam)) continue;
  const icerik = fs.readFileSync(tam, 'utf8');
  for (const { metin, konum } of metinleriTopla(icerik)) {
    /* Turkce cumle gorunumlu ama hic ozel karakter yok -> supheli */
    const kelimeler = metin.split(/\s+/).filter(w => /^[a-zA-Z]{4,}$/.test(w));
    if (kelimeler.length < 4) continue;
    if (/[çğıöşüÇĞİÖŞÜ]/.test(metin)) continue;
    if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(metin)) continue;   /* ozel isim */
    if (/[<>{}=;]/.test(metin)) continue;                        /* kod */
    if (sqlMi(metin)) continue;                                  /* SQL */
    supheli++;
    if (supheli <= 12) {
      console.log('  ' + dosya + ':' + satirNo(icerik, konum) + '  ' + metin.slice(0, 78));
    }
  }
}
if (!supheli) console.log('  yok');
else if (supheli > 12) console.log('  ... ve ' + (supheli - 12) + ' tane daha');

