'use strict';
/* Okulun dosya alanı: okul başına disk sınırı ("bölüm gibi").

   Okulun dosyaları (ödev teslim dosyaları, ödev ve mesaj ekleri, okul sayfası
   fotoğrafları) okulun sınırına sayılır. Sınır okulda durur (okullar.
   disk_siniri_mb, şema 035); boşsa site ayarındaki "Varsayılan okul disk
   sınırı" geçerlidir (site.js okulDiskMb: panelden kaydedilen > EE_OKUL_DOSYA_GB
   > 5 GB). Yönetici sınırı okulu açarken verir (öneri: öğrenci sayısı × 10 MB,
   en az 2 GB; öğrenci sayısı yoksa varsayılan) ve Okullar ekranında değiştirir.
   Sınır küçültülürse var olan dosya silinmez, yalnız yeni yükleme durur.

   Kullanım dosya kayıtlarından toplanır (depo/okul-disk.js; dizin gezilmez).
   Kayıttaki boyut dosyanın son boyutudur (küçültülünce kayıt güncellenir).
   Veritabanı sınıra sayılmaz; yönetim panelinde ayrıca yaklaşık gösterilir.

   Yükleme (odev-dosya.js, ekler.js, okul-sayfasi.js):
     const d = await okulDisk.durum(okulId);        // await burada
     if (okulDisk.sigmaz(d, boyut)) { okulDisk.doldu(d); return 507 OKUL_DOLU; }
     okulDisk.ayir(okulId, boyut);                    // aradan await geçmeden
     ... yaz, kaydet ...  okulDisk.yuklendi(d, boyut)  // %80 bildirimi
     finally okulDisk.birak(okulId, boyut)
   Süren yüklemelerin baytı okul başına ayrılır (üç tür birlikte): aynı anda
   başlayan yüklemeler birlikte sınırı aşamaz.

   Bildirim: kullanım sınırın %80'ini geçince ve dolunca müdüre ve sistem
   yöneticisine birer kez (okul_dosya_uyarilari, şema 033). Kullanım sınırın
   %70'inin altına inince (saatlik mutabakatta ya da sınır değişince) sıfırlanır.

   Saatlik mutabakat (mutabakat): kayıtlar diskteki dosyalarla karşılaştırılır;
   sahipsiz dosyalar (kaydı olmayan), dosyası olmayan kayıtlar ve boyutu
   tutmayanlar sayılır, sunucu günlüğüne yazılır ve yönetim panelinde görünür.
   Sahipsiz dosyaları her türün kendi temizliği siler (odev-dosya.js dosyaSupur,
   ekler.js ekSupur, okul-sayfasi.js fotoSupur; 1-2 saatten eskiyse).

   Uç (yalnız yönetici; yonetici.js yönlendirir):
     POST /api/admin/okul-disk-siniri { okulId, mb }   mb: MB (tam sayı) ya da null (varsayılan)
   Okulların doluluğu ve sistem geneli GET /api/admin/overview'da (disk); müdür
   kendi okulununkini GET /api/school/ozet'te (disk) görür. */

const fs = require('fs');
const path = require('path');
const { ok, sendJSON } = require('../http');
const { clean } = require('../ortak');
const site = require('../site');
const { depo, topluBildir } = require('../veri');
const { DATA } = require('../yollar');
const { islemYaz } = require('./islem-kaydi');

const MB = 1024 * 1024, GB = 1024 * MB;
const UYARI = 0.8, UYARI_SIFIRLA = 0.7;           // %80'de bir kez uyarı; %70'in altına inince yeniden kurulur
const ONERI_KISI_MB = 10, ONERI_EN_AZ_MB = 2048;  // öneri: öğrenci × 10 MB, en az 2 GB
const OKUL_DOLU = 'Okulunun dosya alanı doldu. Okul yönetimi eski dosyaları sildirebilir ya da yöneticiden alan isteyebilir.';

/* ---------------- biçim ---------------- */
const ondalik = x => (Math.round(x * 10) / 10).toLocaleString('tr-TR');
/* "3,2 GB", "820 MB", "0,4 MB" (GB ve küçük MB bir ondalık). */
function boyutYaz(n) {
  if (n >= GB) return ondalik(n / GB) + ' GB';
  const mb = n / MB;
  return (mb >= 10 ? Math.round(mb).toLocaleString('tr-TR') : n > 0 ? ondalik(Math.max(0.1, mb)) : '0') + ' MB';
}
/* "3,2 GB / 5 GB" */
const alanYaz = (kullanilan, sinir) => boyutYaz(kullanilan) + ' / ' + boyutYaz(sinir);

/* ---------------- sınır ---------------- */
const varsayilanMb = () => site.ayar('okulDiskMb');
const sinirBayt = siniriMb => (siniriMb || varsayilanMb()) * MB;
/* İşlem kaydında sınırın adı: "3 GB" ya da "varsayılan (5 GB)". */
const sinirAdi = mb => mb === null ? 'varsayılan (' + boyutYaz(varsayilanMb() * MB) + ')' : boyutYaz(mb * MB);

/* Öneri (MB): öğrenci sayısı × 10 MB, en az 2 GB; öğrenci yoksa null (varsayılan). */
function oneriMb(ogrenci) {
  const n = Number(ogrenci) || 0;
  return n > 0 ? Math.max(ONERI_EN_AZ_MB, Math.min(site.OKUL_DISK.cok, n * ONERI_KISI_MB)) : null;
}

/* Kullanıcıdan gelen sınır (MB, tam sayı). bosVarsayilan: boş değer (yok, null,
   '') varsayılan demektir (okul açma); değilse yalnız null varsayılandır.
   Dönen: { mb } (null: varsayılan) ya da { hata }. */
function mbOku(v, bosVarsayilan) {
  if (v === null || (bosVarsayilan && (v === undefined || v === ''))) return { mb: null };
  if (v === undefined || v === '') return { hata: 'Disk sınırını yaz.' };
  const mb = site.okulDiskTemizle(v);
  if (mb === null) return { hata: 'Disk sınırı 1 MB ile 10 TB arasında olmalı (MB olarak tam sayı).' };
  return { mb };
}

/* ---------------- süren yüklemeler ---------------- */
const suren = new Map();   // okul -> ayrılmış bayt
function ayir(okulId, boyut) {
  if (!okulId) return;
  suren.set(okulId, (suren.get(okulId) || 0) + boyut);
}
function birak(okulId, boyut) {
  if (!okulId) return;
  const v = (suren.get(okulId) || 0) - boyut;
  if (v > 0) suren.set(okulId, v); else suren.delete(okulId);
}

/* ---------------- okulun durumu ---------------- */
/* { okulId, kullanilan, sinir, siniriMb (null: varsayılan), ozel, dagilim } ya da null (okul yok). */
async function durum(okulId) {
  const d = await depo.okulDisk.okulun(okulId);
  if (!d) return null;
  return Object.assign(d, { sinir: sinirBayt(d.siniriMb), ozel: d.siniriMb !== null });
}

/* Ekrana giden görünüm (bayt). */
function gorunum(d) {
  if (!d) return null;
  const sinir = d.sinir || sinirBayt(d.siniriMb);
  return { kullanilan: d.kullanilan, sinir, siniriMb: d.siniriMb, ozel: d.siniriMb !== null, dagilim: d.dagilim,
    oran: sinir ? Math.round(d.kullanilan / sinir * 1000) / 10 : 0 };
}

/* Bu kadar bayt daha sığmaz mı? (Süren yüklemeler dahil; okulsuz yüklemede
   sınır yok.) Çağıran, sonuca göre aradan await geçirmeden ayir()'ı çağırır. */
function sigmaz(d, boyut) {
  return !!d && d.kullanilan + (suren.get(d.okulId) || 0) + boyut > d.sinir;
}

/* Müdüre ve sistem yöneticisine bildirim; her seviye (80, 100) bir kez. */
async function uyar(d, seviye, kullanilan) {
  if (!d || !await depo.okulDisk.uyariYaz(d.okulId, seviye)) return;
  const [okul, mudurler] = await Promise.all([depo.okullar.bul(d.okulId), depo.okullar.mudurKimlikleri(d.okulId)]);
  const alan = alanYaz(kullanilan, d.sinir), sinir = boyutYaz(d.sinir);
  const metin = seviye >= 100
    ? 'Okulun dosya alanı doldu (' + sinir + '). Yeni dosya yüklenemiyor; eski dosyalar silindikçe yer açılır. ' +
      'Gerekirse sistem yöneticisinden alan isteyebilirsin.'
    : "Okulun dosya alanının %80'i doldu (" + alan + '). Teslim dosyaları son teslimden 7 gün sonra, ekler 7 gün sonra ' +
      'kendiliğinden silinir.';
  if (mudurler.length) await topluBildir(mudurler, metin, '');
  await depo.genel.yoneticilereBildir((okul ? okul.name : 'Bir okul') + ': ' + (seviye >= 100
    ? 'dosya alanı doldu (' + sinir + '), yeni dosya yüklenemiyor. Sınırı Okullar sayfasından büyütebilirsin.'
    : "dosya alanının %80'i doldu (" + alan + ').'), '');
}

/* Yükleme sınırı aştığı için reddedildi: bir kez "doldu" bildirimi (beklenmez). */
function doldu(d) {
  if (d) uyar(d, 100, d.kullanilan).catch(() => { /* bildirim gitmezse yükleme yine reddedilir */ });
}

/* Dosya kaydedildi: kullanım %80'i geçtiyse bir kez bildirim. */
async function yuklendi(d, boyut) {
  if (d && d.kullanilan + boyut >= UYARI * d.sinir) {
    await uyar(d, 80, d.kullanilan + boyut).catch(() => { /* bildirim gitmezse yükleme yine tamam */ });
  }
}

/* ---------------- sistem geneli ---------------- */
async function diskBilgisi() {
  try {
    const s = await fs.promises.statfs(DATA);
    return { bos: s.bavail * s.bsize, toplam: s.blocks * s.bsize };
  } catch (e) { return { bos: null, toplam: null }; }
}

/* Okullara ayrılan toplam, okulların kullandığı, diskteki gerçek boş yer,
   veritabanının yaklaşık boyutu ve son mutabakat. Ayrılan alanın henüz
   kullanılmayan kısmı diskteki boş yerden fazlaysa uyarı (izin verilir,
   yalnız uyarır). harita: depo.okulDisk.hepsi() (verilmezse okunur). */
async function sistem(harita) {
  const [okullar, disk, veritabani] = await Promise.all([
    harita ? Promise.resolve(harita) : depo.okulDisk.hepsi(), diskBilgisi(),
    depo.okulDisk.veritabaniBoyutu().catch(() => null)]);
  let ayrilan = 0, kullanilan = 0, bekleyen = 0, okul = 0;
  for (const d of okullar.values()) {
    kullanilan += d.kullanilan;
    if (d.durum === 'rejected') continue;
    const sinir = sinirBayt(d.siniriMb);
    okul++;
    ayrilan += sinir;
    bekleyen += Math.max(0, sinir - d.kullanilan);
  }
  const asim = disk.bos !== null && bekleyen > disk.bos;
  return {
    okul, ayrilan, kullanilan, bos: disk.bos, diskToplam: disk.toplam, veritabani, varsayilanMb: varsayilanMb(),
    asim, uyari: asim ? 'Okullara ayrılan alanın henüz kullanılmayan kısmı (' + boyutYaz(bekleyen) + ') diskteki boş yerden (' +
      boyutYaz(disk.bos) + ') fazla: okullar sınırlarına ulaşmadan disk dolabilir. Sınırları küçültebilir ya da diske yer ' +
      'açabilirsin.' : '',
    mutabakat: sonMutabakat
  };
}

/* ---------------- saatlik mutabakat ---------------- */
const KLASORLER = [
  { tur: 'teslim', klasor: () => path.join(DATA, 'dosyalar') },
  { tur: 'ek', klasor: () => path.join(DATA, 'ekler') },
  { tur: 'foto', klasor: () => path.join(DATA, 'okul-fotolari') }
];
let sonMutabakat = null;

async function mutabakat() {
  const kayit = await depo.okulDisk.kayitlar();
  const r = { zaman: new Date().toISOString(), kayitli: { adet: 0, bayt: 0 }, diskte: { adet: 0, bayt: 0 },
    sahipsiz: { adet: 0, bayt: 0 }, yarim: { adet: 0, bayt: 0 }, kayip: 0, boyutFarki: 0 };
  for (const k of KLASORLER) {
    const beklenen = kayit[k.tur];
    for (const b of beklenen.values()) { r.kayitli.adet++; r.kayitli.bayt += b; }
    let adlar = [];
    try { adlar = await fs.promises.readdir(k.klasor()); } catch (e) { adlar = []; }
    const gorulen = new Set();
    for (const ad of adlar) {
      let st;
      try { st = await fs.promises.stat(path.join(k.klasor(), ad)); } catch (e) { continue; }
      if (!st.isFile()) continue;
      r.diskte.adet++; r.diskte.bayt += st.size;
      const boyut = beklenen.get(ad);
      if (boyut === undefined) {
        const t = /\.yukleniyor$/.test(ad) ? r.yarim : r.sahipsiz;
        t.adet++; t.bayt += st.size;
      } else {
        gorulen.add(ad);
        if (boyut !== st.size) r.boyutFarki++;
      }
    }
    for (const id of beklenen.keys()) if (!gorulen.has(id)) r.kayip++;
  }
  sonMutabakat = r;
  if (r.sahipsiz.adet || r.kayip || r.boyutFarki) {
    console.log('  ! Dosya mutabakatı: ' + [
      r.sahipsiz.adet ? r.sahipsiz.adet + ' sahipsiz dosya (' + boyutYaz(r.sahipsiz.bayt) + ')' : '',
      r.kayip ? r.kayip + ' kaydın dosyası diskte yok' : '',
      r.boyutFarki ? r.boyutFarki + ' dosyanın boyutu kayıtla tutmuyor' : ''].filter(Boolean).join(', ') + '.');
  }
  /* Kullanımı %70'in altına inen okulların uyarısı yeniden kurulur. */
  await depo.okulDisk.uyarilariSifirla(varsayilanMb(), UYARI_SIFIRLA);
  return r;
}

/* ---------------- yönetici: okulun sınırını değiştir ---------------- */
async function siniriDegistir(req, res, me, body) {
  const alanHata = (alan, mesaj, kod) => sendJSON(res, kod || 400, { error: mesaj, alan });
  const okul = await depo.okullar.bul(clean(body.okulId, 60));
  if (!okul) return alanHata('okulId', 'Okul bulunamadı.', 404);
  const m = mbOku(body.mb, false);
  if (m.hata) return alanHata('mb', m.hata);
  const eski = okul.diskSiniriMb;
  if (eski !== m.mb) {
    await depo.okullar.diskSiniriYaz(okul.id, m.mb);
    await islemYaz(me, 'okul.disk-siniri', okul.name + ': ' + sinirAdi(eski) + ' → ' + sinirAdi(m.mb), req);
    /* Sınır büyüdüyse %80 ve "doldu" uyarısı yeniden kurulur (kullanım %70'in altındaysa). */
    await depo.okulDisk.uyarilariSifirla(varsayilanMb(), UYARI_SIFIRLA, okul.id);
  }
  const d = await durum(okul.id);
  const sis = await sistem();
  const asiyor = d.kullanilan >= d.sinir;
  return ok(res, {
    okul: { id: okul.id, ad: okul.name, disk: gorunum(d) },
    sistem: sis,
    message: (eski === m.mb ? 'Okulun disk sınırı zaten böyle: ' : 'Okulun disk sınırı kaydedildi: ') + sinirAdi(m.mb) + '.' +
      (asiyor ? ' Okulun dosyaları (' + boyutYaz(d.kullanilan) + ') bu sınırı aşıyor: var olan dosyalar silinmez, ' +
        'yalnız yeni yükleme durur.' : ''),
    uyari: sis.uyari
  });
}

module.exports = {
  OKUL_DOLU, MB, UYARI, UYARI_SIFIRLA, ONERI_KISI_MB, ONERI_EN_AZ_MB,
  boyutYaz, alanYaz, varsayilanMb, sinirBayt, sinirAdi, oneriMb, mbOku,
  ayir, birak, durum, gorunum, sigmaz, doldu, yuklendi, uyar, sistem, mutabakat, siniriDegistir
};
