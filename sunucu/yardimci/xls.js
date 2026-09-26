'use strict';
/* Eski Excel (.xls, Excel 97-2003) okuyucu. Paket kullanılmaz.

   .xls iki katmandır:
     1. Birleşik belge (Compound File Binary, MS-CFB): dosyanın içinde küçük
        bir dosya sistemi. Sektörler, sektör zinciri tablosu (FAT) ve bir
        dizin. İçinden "Workbook" akışı çıkarılır.
     2. BIFF8 kayıtları (MS-XLS): [tür 2 bayt][uzunluk 2 bayt][veri]. Sayfa
        listesi (BOUNDSHEET), ortak metin tablosu (SST) ve hücre kayıtları
        (LABELSST, NUMBER, RK, MULRK, FORMULA, BOOLERR) okunur; biçim, grafik,
        formül metni atlanır.

   Çıktı xlsx.oku ile aynı biçimdir: [{ ad, satirlar: [[metin, ...], ...] }].
   Sayı hücresi sayının kendisi (tarih hücresi Excel gün sayısı; tarihCoz çözer).

   Bozuk ya da kötü niyetli dosyaya karşı: zincirlerde döngü ve taşma
   denetlenir, akış en fazla 60 MB, 20 bin satır, 200 sütun, 500 bin metin. */

const IMZA = Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]);
const SON = 0xFFFFFFFE;           // zincir sonu
const BOS = 0xFFFFFFFF;
const EN_BUYUK_AKIS = 60 * 1024 * 1024;
const EN_FAZLA_SATIR = 20000;
const EN_FAZLA_SUTUN = 200;
const EN_FAZLA_METIN = 500000;
const EN_FAZLA_SAYFA = 20;
const HUCRE_BUTCESI = 1000000;     // bütün sayfalarda dolu hücre toplamı

function hata(m) { return new Error(m); }

/* ---------------- birleşik belge (CFB) ---------------- */
function cfbAkislari(buf) {
  if (buf.length < 512 || !buf.subarray(0, 8).equals(IMZA)) throw hata('Bu bir .xls dosyası değil.');
  const sektorUs = buf.readUInt16LE(0x1E);
  const miniUs = buf.readUInt16LE(0x20);
  if ((sektorUs !== 9 && sektorUs !== 12) || miniUs !== 6) throw hata('.xls dosyası bozuk (başlık).');
  const S = 1 << sektorUs, MS = 1 << miniUs;
  const fatSayisi = buf.readUInt32LE(0x2C);
  const dizinIlk = buf.readUInt32LE(0x30);
  const miniSinir = buf.readUInt32LE(0x38);
  const miniFatIlk = buf.readUInt32LE(0x3C);
  const miniFatSayisi = buf.readUInt32LE(0x40);
  let difatSektor = buf.readUInt32LE(0x44);
  const difatSayisi = buf.readUInt32LE(0x48);
  const sektorAdedi = Math.ceil((buf.length - S) / S);
  if (fatSayisi > sektorAdedi || difatSayisi > sektorAdedi || miniFatSayisi > sektorAdedi) throw hata('.xls dosyası bozuk (tablo).');

  const sektor = n => {
    if (n >= sektorAdedi) throw hata('.xls dosyası bozuk (sektör dışı).');
    const bas = (n + 1) * S;
    return buf.subarray(bas, Math.min(bas + S, buf.length));
  };

  /* FAT sektörlerinin listesi: başlıkta 109, kalanı DIFAT zincirinde. */
  const fatSektorleri = [];
  for (let i = 0; i < 109 && fatSektorleri.length < fatSayisi; i++) {
    const n = buf.readUInt32LE(0x4C + i * 4);
    if (n !== BOS) fatSektorleri.push(n);
  }
  for (let d = 0; d < difatSayisi && difatSektor !== SON && difatSektor !== BOS; d++) {
    const s = sektor(difatSektor);
    const adet = S / 4 - 1;
    for (let i = 0; i < adet && fatSektorleri.length < fatSayisi; i++) {
      const n = s.readUInt32LE(i * 4);
      if (n !== BOS) fatSektorleri.push(n);
    }
    difatSektor = s.readUInt32LE(adet * 4);
  }
  const fat = new Uint32Array(fatSektorleri.length * (S / 4));
  fatSektorleri.forEach((n, i) => {
    const s = sektor(n);
    for (let j = 0; j < S / 4 && j * 4 + 4 <= s.length; j++) fat[i * (S / 4) + j] = s.readUInt32LE(j * 4);
  });

  /* Zincir: döngü ya da sınır dışı sektör hata sayılır. */
  const zincir = (ilk, tablo, sinir) => {
    const liste = [];
    const gorulen = new Set();
    for (let n = ilk; n !== SON && n !== BOS; n = tablo[n]) {
      if (n >= tablo.length || gorulen.has(n) || liste.length > sinir) throw hata('.xls dosyası bozuk (zincir).');
      gorulen.add(n);
      liste.push(n);
    }
    return liste;
  };

  const akisOku = (ilk, boyut) => {
    if (boyut > EN_BUYUK_AKIS) throw hata('.xls dosyası çok büyük.');
    const parcalar = zincir(ilk, fat, sektorAdedi).map(sektor);
    return Buffer.concat(parcalar).subarray(0, boyut);
  };

  /* Dizin: 128 baytlık girişler. */
  const dizinVeri = Buffer.concat(zincir(dizinIlk, fat, sektorAdedi).map(sektor));
  const girisler = [];
  for (let i = 0; i + 128 <= dizinVeri.length; i += 128) {
    const adUzunluk = dizinVeri.readUInt16LE(i + 64);
    const tur = dizinVeri[i + 66];
    if (!tur || adUzunluk < 2 || adUzunluk > 64) { girisler.push(null); continue; }
    girisler.push({
      ad: dizinVeri.subarray(i, i + adUzunluk - 2).toString('utf16le'),
      tur, ilk: dizinVeri.readUInt32LE(i + 116), boyut: dizinVeri.readUInt32LE(i + 120)
    });
  }
  const kok = girisler[0];
  if (!kok || kok.tur !== 5) throw hata('.xls dosyası bozuk (dizin).');

  /* Küçük akışlar (4096 bayttan kısa) kökün mini akışının içindedir. */
  let miniAkis = null, miniFat = null;
  const miniOku = (ilk, boyut) => {
    if (!miniAkis) {
      miniAkis = akisOku(kok.ilk, kok.boyut);
      const mf = Buffer.concat(zincir(miniFatIlk, fat, sektorAdedi).map(sektor));
      miniFat = new Uint32Array(mf.length / 4);
      for (let i = 0; i < miniFat.length; i++) miniFat[i] = mf.readUInt32LE(i * 4);
    }
    const parcalar = zincir(ilk, miniFat, miniFat.length).map(n => miniAkis.subarray(n * MS, n * MS + MS));
    return Buffer.concat(parcalar).subarray(0, boyut);
  };

  return function akis(ad) {
    const g = girisler.find(x => x && x.tur === 2 && x.ad.toLowerCase() === ad.toLowerCase());
    if (!g) return null;
    return g.boyut < miniSinir ? miniOku(g.ilk, g.boyut) : akisOku(g.ilk, g.boyut);
  };
}

/* ---------------- BIFF8 ---------------- */

/* RK: sıkıştırılmış sayı. */
function rkSayi(v) {
  let n;
  if (v & 2) n = (v | 0) >> 2;
  else {
    const b = Buffer.alloc(8);
    b.writeUInt32LE((v & 0xFFFFFFFC) >>> 0, 4);
    n = b.readDoubleLE(0);
  }
  return (v & 1) ? n / 100 : n;
}

function sayiMetni(n) {
  if (!isFinite(n)) return '';
  /* 12345678901.0 gibi tam sayılar kesirsiz yazılır; kesirde kayan nokta
     artıkları (0.1 + 0.2) 15 basamağa yuvarlanır. */
  return Number.isInteger(n) ? String(n) : String(Number(n.toPrecision(15)));
}

/* Birden çok kayda (SST + CONTINUE) bölünmüş veriyi sırayla okuyan imleç.
   Metnin karakterleri kayıt sınırını aşarsa yeni kaydın ilk baytı yeniden
   "1 bayt mı 2 bayt mı" bayrağıdır (MS-XLS 2.5.293). */
function parcaliOkuyucu(parcalar) {
  let pi = 0, i = 0;
  const kalan = () => parcalar[pi] ? parcalar[pi].length - i : 0;
  const ilerle = () => { while (pi < parcalar.length && i >= parcalar[pi].length) { pi++; i = 0; } };
  const bayt = n => {
    const cikti = Buffer.alloc(n);
    let k = 0;
    while (k < n) {
      ilerle();
      if (pi >= parcalar.length) throw hata('.xls dosyası bozuk (metin tablosu).');
      const al = Math.min(n - k, parcalar[pi].length - i);
      parcalar[pi].copy(cikti, k, i, i + al);
      k += al; i += al;
    }
    return cikti;
  };
  const u8 = () => bayt(1)[0];
  const u16 = () => bayt(2).readUInt16LE(0);
  const u32 = () => bayt(4).readUInt32LE(0);
  const karakterler = (adet, genis) => {
    let s = '';
    while (adet > 0) {
      ilerle();
      if (pi >= parcalar.length) throw hata('.xls dosyası bozuk (metin).');
      const boy = genis ? 2 : 1;
      const sigan = Math.min(adet, Math.floor(kalan() / boy));
      const b = parcalar[pi].subarray(i, i + sigan * boy);
      s += genis ? b.toString('utf16le') : b.toString('latin1');
      i += sigan * boy;
      adet -= sigan;
      if (adet > 0) {
        /* Kayıt bitti: sonraki kayıt bayrakla başlar. */
        pi++; i = 0;
        if (pi >= parcalar.length) throw hata('.xls dosyası bozuk (metin).');
        genis = !!(parcalar[pi][0] & 1);
        i = 1;
      }
    }
    return s;
  };
  const atla = n => { bayt(n); };
  return { u8, u16, u32, karakterler, atla, kalan: () => { ilerle(); return pi < parcalar.length; } };
}

