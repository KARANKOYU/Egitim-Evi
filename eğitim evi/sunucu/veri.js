'use strict';
/* Veritabanı: bellekteki model ve diske kalıcı yazım, yedekleme.
   Tüm veri `db` nesnesinde durur (users, classes, assignments...). save()
   değişiklikleri birleştirip gecikmeli yazar; saveNow() hemen yazar.
   `db` nesnesi hiç değiştirilmez, yalnızca içi güncellenir — böylece diğer
   modüllerin tuttuğu referans hep geçerli kalır. */

const fs = require('fs');
const path = require('path');
const { ESKI_SAATLER, clean, now, uid } = require('./ortak');
const { hashPwSync } = require('./sifre');
const { DATA, DBF } = require('./yollar');

/* ============ veritabanı (data/db.json) ============ */
/* Tek ve değişmez nesne: modüller `const { db } = require('./veri')` ile alır,
   biz de yalnızca içini güncelleriz. */
const db = {};
function dbIcineYaz(yeni) {
  for (const k of Object.keys(db)) delete db[k];
  Object.assign(db, yeni || {});
}
function loadDB() {
  if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });
  let okunan = null;
  if (fs.existsSync(DBF)) {
    try {
      okunan = JSON.parse(fs.readFileSync(DBF, 'utf8'));
    } catch (e) {
      console.error('db.json okunamadı, yedeklenip sıfırlanıyor:', e.message);
      fs.renameSync(DBF, DBF + '.bozuk-' + Date.now());
      okunan = null;
    }
  }
  dbIcineYaz(okunan || {});
  for (const k of ['users', 'schools', 'assignments', 'examGroups', 'exams',
    'parentLinks', 'teacherStudents', 'notifications',
    'classes', 'lessons', 'schedule', 'roles', 'mesajlar', 'devamsizlik', 'islemKaydi', 'takvim', 'egitimYillari']) {
    if (!Array.isArray(db[k])) db[k] = [];
  }
  if (!db.sessions || typeof db.sessions !== 'object') db.sessions = {};
  /* Gönderilmiş hatırlatmalar: aynı bildirim iki kez gitmesin. */
  if (!db.hatirlatmalar || typeof db.hatirlatmalar !== 'object') db.hatirlatmalar = {};

  /* Eski sürümde ders programı sabit "ders saati" numarasıyla tutuluyordu.
     Kayıtları varsayılan zil saatlerine göre saat aralığına taşı. */
  let tasindi = 0;
  for (const sp of db.schedule) {
    if (sp.start && sp.end) continue;
    const varsayilan = ESKI_SAATLER[sp.slot] || ESKI_SAATLER[1];
    sp.start = varsayilan[0];
    sp.end = varsayilan[1];
    delete sp.slot;
    tasindi++;
  }
  if (tasindi) console.log('  Ders programı yeni saat düzenine taşındı (' + tasindi + ' kayıt).');

  if (!db.users.some(u => u.role === 'admin')) {
    db.users.push({
      id: uid('u'), email: 'admin@egitimevi.com', pass: hashPwSync('admin123'),
      fullName: 'Sistem Yöneticisi', role: 'admin', status: 'approved',
      city: '', district: '', address: '', createdAt: now()
    });
    console.log('\n  ! İlk admin hesabı oluşturuldu -> admin@egitimevi.com / admin123');
    console.log('    Giriş yaptıktan sonra Ayarlar bölümünden şifreyi mutlaka değiştir.\n');
  }
  saveNow();
}

let dirty = false, timer = null;
/* Veri tek dosyada; okul büyüdükçe bu dosya da büyüyor. Yazmayı iki
   şekilde ucuzlattık:
     1. Biçimsiz (girintisiz) yazıyoruz — dosya küçülüyor, stringify hızlanıyor.
        Bu bir veri dosyası, elle okunması için değil.
     2. Asenkron yazıyoruz — 50 MB'lık senkron yazma, sürerken gelen bütün
        istekleri bekletir. Yedek alırken senkron sürüm kullanılıyor, çünkü
        orada dosyanın diskte hazır olması gerekiyor. */

let yaziyor = false;
let tekrarYaz = false;

function writeDisk() {
  if (yaziyor) { tekrarYaz = true; return; }
  let metin;
  try {
    metin = JSON.stringify(db);
  } catch (e) {
    console.error('Kayıt hatası (JSON):', e.message);
    return;
  }
  yaziyor = true;
  fs.writeFile(DBF + '.tmp', metin, 'utf8', (e1) => {
    if (e1) {
      console.error('Kayıt hatası:', e1.message);
      yaziyor = false;
      return;
    }
    fs.rename(DBF + '.tmp', DBF, (e2) => {
      if (e2) console.error('Kayıt hatası (yeniden adlandırma):', e2.message);
      yaziyor = false;
      /* Yazma sürerken yeni değişiklik geldiyse bir tur daha at. */
      if (tekrarYaz) { tekrarYaz = false; writeDisk(); }
    });
  });
}

function writeDiskSync() {
  try {
    fs.writeFileSync(DBF + '.tmp', JSON.stringify(db), 'utf8');
    fs.renameSync(DBF + '.tmp', DBF);
  } catch (e) { console.error('Kayıt hatası:', e.message); }
}

function save() {
  dirty = true;
  if (timer) return;
  /* 400 ms: art arda gelen değişiklikler tek yazmada birleşsin. */
  timer = setTimeout(() => { timer = null; if (dirty) { dirty = false; writeDisk(); } }, 400);
}

/* Yedek alma ve kapanış gibi "şimdi diskte olsun" durumları. */
function saveNow() {
  if (timer) { clearTimeout(timer); timer = null; }
  dirty = false;
  writeDiskSync();
}

const byId = (arr, id) => arr.find(x => x.id === id) || null;
const userById = id => byId(db.users, id);
const schoolById = id => byId(db.schools, id);

function notify(userId, text, link) {
  if (!userId) return;
  db.notifications.push({
    id: uid('n'), userId, text: clean(text, 300),
    link: link || '', read: false, createdAt: now()
  });
}
function notifyAdmins(text, link) {
  db.users.filter(u => u.role === 'admin').forEach(a => notify(a.id, text, link));
}

/* dışarı verilen kullanıcı nesnesi - şifre asla gönderilmez */

/* ============ yedekleme ============
   Bütün veri tek dosyada (db.json). O dosya bozulursa ya da yanlışlıkla
   silinirse her şey gider; bu yüzden günlük kopya alınıyor.
   Kopyalar data/yedek/ altında, en yeni N tanesi saklanıyor. */

const YEDEK_KLASOR = path.join(DATA, 'yedek');
const YEDEK_SAKLA = 14;                       // kaç kopya tutulsun
const YEDEK_ARALIK_MS = 6 * 60 * 60 * 1000;   // 6 saatte bir kontrol

function yedekAdi(d) {
  const p2 = n => (n < 10 ? '0' : '') + n;
  return 'yedek-' + d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) +
    '_' + p2(d.getHours()) + p2(d.getMinutes()) + '.json';
}

function yedekListesi() {
  if (!fs.existsSync(YEDEK_KLASOR)) return [];
  return fs.readdirSync(YEDEK_KLASOR)
    .filter(f => /^yedek-.*\.json$/.test(f))
    .map(f => {
      const st = fs.statSync(path.join(YEDEK_KLASOR, f));
      return { ad: f, boyut: st.size, tarih: st.mtime.toISOString() };
    })
    .sort((a, b) => b.ad.localeCompare(a.ad));
}

/* Eskiyenleri at. */
function yedekTemizle() {
  const liste = yedekListesi();
  for (let i = YEDEK_SAKLA; i < liste.length; i++) {
    try { fs.unlinkSync(path.join(YEDEK_KLASOR, liste[i].ad)); } catch (e) { /* yoksay */ }
  }
}

function yedekAl(elle) {
  try {
    if (!fs.existsSync(DBF)) return { hata: 'Veri dosyası yok' };
    fs.mkdirSync(YEDEK_KLASOR, { recursive: true });

    /* Bellekteki hâli diske yaz, sonra kopyala — yarım kalmış yazma olmasın. */
    saveNow();

    const ad = (elle ? 'yedek-elle-' : '') + yedekAdi(new Date());
    const hedef = path.join(YEDEK_KLASOR, elle ? ad : yedekAdi(new Date()));
    fs.copyFileSync(DBF, hedef);
    yedekTemizle();
    return { ad: path.basename(hedef), boyut: fs.statSync(hedef).size };
  } catch (e) {
    console.error('Yedek alınamadı:', e.message);
    return { hata: e.message };
  }
}

/* Günde bir kez yeterli: son yedek 20 saatten eskiyse yenisini al. */
function yedekGerekliMi() {
  const liste = yedekListesi().filter(y => y.ad.indexOf('yedek-elle-') !== 0);
  if (!liste.length) return true;
  const sonZaman = Date.parse(liste[0].tarih);
  return !sonZaman || (Date.now() - sonZaman) > 20 * 60 * 60 * 1000;
}

function yedekKontrol() {
  try {
    if (yedekGerekliMi()) {
      const r = yedekAl(false);
      if (r.ad) console.log('  Günlük yedek alındı: ' + r.ad);
    }
  } catch (e) {
    console.error('Yedek kontrolü hatası:', e.message);
  }
}

/* Geri yükleme: önce mevcut hâli "geri-alma" kopyası olarak saklar,
   sonra seçilen yedeği db.json'a yazar ve belleğe okur. */
function yedekGeriYukle(ad) {
  const guvenli = String(ad || '').replace(/[^a-zA-Z0-9._-]/g, '');
  if (!/^yedek-.*\.json$/.test(guvenli)) return { hata: 'Geçersiz yedek adı' };

  const kaynak = path.join(YEDEK_KLASOR, guvenli);
  if (!fs.existsSync(kaynak)) return { hata: 'Yedek bulunamadı' };

  let icerik;
  try {
    icerik = JSON.parse(fs.readFileSync(kaynak, 'utf8'));
  } catch (e) {
    return { hata: 'Yedek dosyası okunamadı: ' + e.message };
  }
  if (!icerik || !Array.isArray(icerik.users)) {
    return { hata: 'Yedek geçerli görünmüyor (kullanıcı listesi yok)' };
  }

  /* Yanlış yedeği yüklersen geri dönebilesin diye önce şimdiki hâli sakla. */
  try {
    fs.mkdirSync(YEDEK_KLASOR, { recursive: true });
    saveNow();
    fs.copyFileSync(DBF, path.join(YEDEK_KLASOR, 'yedek-elle-geri-alma-' + yedekAdi(new Date())));
  } catch (e) { /* kritik değil */ }

  try {
    fs.copyFileSync(kaynak, DBF);
  } catch (e) {
    return { hata: 'Yazılamadı: ' + e.message };
  }

  /* Belleği yeni veriyle tazele; açık oturumlar da yedekten gelir. */
  dbIcineYaz(icerik);
  for (const k of ['users', 'schools', 'assignments', 'examGroups', 'exams',
    'parentLinks', 'teacherStudents', 'notifications', 'classes', 'lessons',
    'schedule', 'roles', 'mesajlar', 'devamsizlik', 'islemKaydi', 'takvim', 'egitimYillari']) {
    if (!Array.isArray(db[k])) db[k] = [];
  }
  if (!db.sessions || typeof db.sessions !== 'object') db.sessions = {};
  if (!db.hatirlatmalar || typeof db.hatirlatmalar !== 'object') db.hatirlatmalar = {};

  return { ad: guvenli, kullanici: db.users.length };
}

const classById = id => byId(db.classes, id);
const lessonById = id => byId(db.lessons, id);

/* "09:20" -> 560 (gün başından beri geçen dakika). Geçersizse null. */

module.exports = {
  db,
  dbIcineYaz,
  loadDB,
  dirty,
  yaziyor,
  tekrarYaz,
  writeDisk,
  writeDiskSync,
  save,
  saveNow,
  byId,
  userById,
  schoolById,
  notify,
  notifyAdmins,
  YEDEK_KLASOR,
  YEDEK_SAKLA,
  YEDEK_ARALIK_MS,
  yedekAdi,
  yedekListesi,
  yedekTemizle,
  yedekAl,
  yedekGerekliMi,
  yedekKontrol,
  yedekGeriYukle,
  classById,
  lessonById
};
