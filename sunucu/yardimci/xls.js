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

function sstOku(parcalar) {
  const o = parcaliOkuyucu(parcalar);
  o.u32();                     // toplam kullanım
  const tekil = o.u32();
  if (tekil > EN_FAZLA_METIN) throw hata('.xls dosyasında çok fazla metin var.');
  const liste = [];
  for (let k = 0; k < tekil && o.kalan(); k++) {
    const adet = o.u16();
    const bayrak = o.u8();
    const zengin = bayrak & 0x08 ? o.u16() : 0;
    const ek = bayrak & 0x04 ? o.u32() : 0;
    liste.push(o.karakterler(adet, !!(bayrak & 0x01)));
    if (zengin) o.atla(zengin * 4);
    if (ek) o.atla(ek);
  }
  return liste;
}

/* Kayıt içindeki kısa metin (BOUNDSHEET adı: 1 bayt uzunluk) ya da uzun metin (2 bayt). */
function kayitMetni(veri, ofs, uzunBayt) {
  const adet = uzunBayt ? veri.readUInt16LE(ofs) : veri[ofs];
  const bas = ofs + (uzunBayt ? 2 : 1);
  const genis = veri[bas] & 1;
  const b = veri.subarray(bas + 1, bas + 1 + adet * (genis ? 2 : 1));
  return genis ? b.toString('utf16le') : b.toString('latin1');
}

/* Kayıtları sırayla okur. eofDur: sayfanın EOF kaydında dur (her sayfa için
   akışın sonuna kadar okumak, çok sayfalı dosyada işi sayfa sayısıyla katlardı). */
function kayitlar(akis, bas, eofDur) {
  const liste = [];
  for (let i = bas; i + 4 <= akis.length;) {
    const tur = akis.readUInt16LE(i), boy = akis.readUInt16LE(i + 2);
    if (i + 4 + boy > akis.length) break;
    liste.push({ tur, veri: akis.subarray(i + 4, i + 4 + boy), ofs: i });
    i += 4 + boy;
    if (eofDur && tur === 0x000A) break;
  }
  return liste;
}

function xlsOku(buf) {
  const akis = cfbAkislari(buf);
  const wb = akis('Workbook');
  if (!wb) {
    if (akis('Book')) throw hata('Bu dosya çok eski bir Excel sürümünün (Excel 95 ya da öncesi). Excel\'de .xlsx olarak kaydedip yükle.');
    throw hata('.xls dosyasında çalışma kitabı bulunamadı.');
  }
  const genel = kayitlar(wb, 0);
  if (!genel.length || genel[0].tur !== 0x0809 || genel[0].veri.readUInt16LE(0) !== 0x0600) {
    throw hata('Bu .xls sürümü okunamıyor. Excel\'de .xlsx olarak kaydedip yükle.');
  }
  const sayfaBilgi = [];
  let sst = [];
  for (let k = 0; k < genel.length; k++) {
    const r = genel[k];
    if (r.tur === 0x002F) throw hata('Dosya parolayla korunuyor. Parolayı kaldırıp yeniden kaydet.');
    if (r.tur === 0x0085 && r.veri.length >= 8) {
      /* Yalnızca çalışma sayfaları (grafik, makro sayfası değil); aynı yeri
         gösteren ikinci kayıt ve sınırın üstündeki sayfalar alınmaz. */
      const ofs = r.veri.readUInt32LE(0);
      if (r.veri[5] === 0 && sayfaBilgi.length < EN_FAZLA_SAYFA && !sayfaBilgi.some(s => s.ofs === ofs)) {
        sayfaBilgi.push({ ofs, ad: kayitMetni(r.veri, 6, false) });
      }
    }
    if (r.tur === 0x00FC) {
      const parcalar = [r.veri];
      while (k + 1 < genel.length && genel[k + 1].tur === 0x003C) parcalar.push(genel[++k].veri);
      sst = sstOku(parcalar);
    }
    if (r.tur === 0x000A) break;
  }

  let butce = HUCRE_BUTCESI;
  return sayfaBilgi.map(sb => {
    const hucreler = new Map();   // satır -> Map(sütun -> metin)
    let enSatir = -1;
    const yaz = (satir, sutun, deger) => {
      if (satir >= EN_FAZLA_SATIR || sutun >= EN_FAZLA_SUTUN || deger === '') return;
      if (--butce < 0) throw hata('Dosya çok büyük. Listeyi bölüp birkaç dosya hâlinde yükle.');
      if (!hucreler.has(satir)) hucreler.set(satir, new Map());
      hucreler.get(satir).set(sutun, deger);
      if (satir > enSatir) enSatir = satir;
    };
    const liste = sb.ofs < wb.length ? kayitlar(wb, sb.ofs, true) : [];
    let bekleyenFormul = null;   // metin sonucu sonraki STRING kaydında
    for (let k = 0; k < liste.length; k++) {
      const { tur, veri } = liste[k];
      if (k === 0 && tur !== 0x0809) break;
      if (tur === 0x000A) break;
      if (veri.length < 6 && tur !== 0x0207) continue;
      if (tur === 0x00FD && veri.length >= 10) {                 // LABELSST
        yaz(veri.readUInt16LE(0), veri.readUInt16LE(2), (sst[veri.readUInt32LE(6)] || '').trim());
      } else if ((tur === 0x0204 || tur === 0x00D6) && veri.length >= 9) {   // LABEL, RSTRING
        yaz(veri.readUInt16LE(0), veri.readUInt16LE(2), kayitMetni(veri, 6, true).trim());
      } else if (tur === 0x0203 && veri.length >= 14) {          // NUMBER
        yaz(veri.readUInt16LE(0), veri.readUInt16LE(2), sayiMetni(veri.readDoubleLE(6)));
      } else if (tur === 0x027E && veri.length >= 10) {          // RK
        yaz(veri.readUInt16LE(0), veri.readUInt16LE(2), sayiMetni(rkSayi(veri.readUInt32LE(6))));
      } else if (tur === 0x00BD && veri.length >= 6) {           // MULRK
        const satir = veri.readUInt16LE(0), ilk = veri.readUInt16LE(2);
        const adet = Math.floor((veri.length - 6) / 6);
        for (let j = 0; j < adet; j++) yaz(satir, ilk + j, sayiMetni(rkSayi(veri.readUInt32LE(4 + j * 6 + 2))));
      } else if (tur === 0x0205 && veri.length >= 8) {           // BOOLERR
        if (veri[7] === 0) yaz(veri.readUInt16LE(0), veri.readUInt16LE(2), veri[6] ? 'DOĞRU' : 'YANLIŞ');
      } else if (tur === 0x0006 && veri.length >= 14) {          // FORMULA: yalnızca sonucu
        const satir = veri.readUInt16LE(0), sutun = veri.readUInt16LE(2);
        if (veri.readUInt16LE(12) === 0xFFFF) {
          if (veri[6] === 0) bekleyenFormul = { satir, sutun };
          else if (veri[6] === 1) yaz(satir, sutun, veri[8] ? 'DOĞRU' : 'YANLIŞ');
        } else yaz(satir, sutun, sayiMetni(veri.readDoubleLE(6)));
      } else if (tur === 0x0207 && bekleyenFormul && veri.length >= 3) {   // STRING (formül sonucu)
        yaz(bekleyenFormul.satir, bekleyenFormul.sutun, kayitMetni(veri, 0, true).trim());
        bekleyenFormul = null;
      }
    }
    const satirlar = [];
    for (let s = 0; s <= enSatir; s++) {
      const m = hucreler.get(s);
      if (!m) { satirlar.push([]); continue; }
      let enSutun = -1;
      for (const c of m.keys()) if (c > enSutun) enSutun = c;
      const satir = [];
      for (let c = 0; c <= enSutun; c++) satir.push(m.get(c) || '');
      satirlar.push(satir);
    }
    return { ad: sb.ad, satirlar };
  });
}

module.exports = { xlsOku, cfbAkislari };
