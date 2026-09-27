'use strict';
/* Yönetici hesapları dosyası: data/admins.json (depoya girmez, .gitignore).

   Sistem yöneticisi hesapları elle bu dosyaya yazılır; sunucu açılışta
   dosyayı okur ve dosyada olup veritabanında olmayan yöneticiyi açar. Sunucu
   çalışırken de dosya düzenlenebilir: "admins.json okuma aralığı"nda (site
   ayarı, varsayılan 1 dakika) dosyanın değişme zamanı ve boyutu yoklanır
   (yalnız fs.stat; fs.watch kullanılmaz), değiştiyse dosya yeniden uygulanır.
   Yönetim panelindeki "Yönetici dosyası" kartı son okumanın sonucunu gösterir
   (şifresiz) ve "Şimdi oku" ile hemen okutur. Örnek: belge/admins.ornek.json.

     { "yoneticiler": [
         { "ad": "Ayşe Yılmaz", "eposta": "ayse@ornek.com",
           "kullaniciAdi": "ayse", "sifre": "Ilk-Sifre-2026!" } ] }

   Kurallar:
     - Dosya yalnızca hesap AÇAR. Var olan yöneticinin şifresine ve adına
       dokunmaz; dosyadan silinen yönetici veritabanından silinmez (panelden
       ya da elle kaldırılır). Dosya bir şifre sıfırlama yolu değildir.
     - E-posta ya da kullanıcı adı başka bir hesaptaysa o hesap yönetici
       YAPILMAZ: dosyaya yazılan bir satırla sessizce yetki yükseltilmesin.
     - "sifre" isteğe bağlıdır. Yazılırsa yetişkin şifre kuralına uymalı
       (en az 8; büyük, küçük harf, rakam, özel karakter); yazılmazsa rastgele
       üretilir ve YALNIZ sunucu penceresine bir kez yazılır (panelde asla
       görünmez). Sunucu çalışırken eklenen satırda pencereye bakılmayabilir:
       şifreyi dosyaya yazmak önerilir. İki durumda da ilk girişte şifre
       değiştirilir: dosyadaki şifre ondan sonra geçersizdir.
     - Bozuk dosya sunucuyu durdurmaz: sorun yazılır, dosya atlanır.
     - Yönetici e-postasına gelen kodla iki adımlı girer: e-posta gerçek olmalı. */

const fs = require('fs');
const path = require('path');
const { DATA } = require('./yollar');
const { uid, now, epostaSorunu, normEmail, normKullaniciAdi, kullaniciAdiSorunu, sifreSorunu, metinYap, adDuzelt } = require('./ortak');
const { hashPw } = require('./sifre');

const DOSYA = path.join(DATA, 'admins.json');
const EN_COK = 50;

/* Kullanıcı adı verilmediyse e-postanın @ öncesinden türetilir; alınmışsa sayı eklenir. */
async function kullaniciAdiBul(depo, eposta) {
  let kok = normKullaniciAdi(eposta.split('@')[0]).replace(/[^a-z0-9._]/g, '');
  if (!/^[a-z]/.test(kok)) kok = 'yonetici' + kok;
  kok = kok.slice(0, 24);
  if (kok.length < 3) kok = 'yonetici';
  for (let i = 0; i < 100; i++) {
    const aday = i ? kok + (i + 1) : kok;
    if (!await depo.kullanicilar.kullaniciAdiHerhangiYerde(aday)) return aday;
  }
  return '';
}

/* JSON.parse hatasının Türkçe açıklaması (ayrıştırıcının İngilizce iletisi panele
   ve pencereye gitmez). Hatanın yeri biliniyorsa dosyanın kaçıncı satırı olduğu da yazılır. */
function jsonHatasi(metin, e) {
  const ileti = String((e && e.message) || '');
  if (!metin.trim()) return 'dosya boş';
  if (/end of JSON input/i.test(ileti)) {
    return 'JSON biçimi bozuk: dosya yarıda bitiyor (kapanmamış parantez ya da tırnak olabilir)';
  }
  let satir = 0;
  const sutunlu = /line (\d+) column \d+/i.exec(ileti);
  const konumlu = /position (\d+)/i.exec(ileti);
  if (sutunlu) satir = Number(sutunlu[1]);
  else if (konumlu) satir = metin.slice(0, Number(konumlu[1])).split('\n').length;
  return 'JSON biçimi bozuk' + (satir ? ' (dosyanın ' + satir + '. satırı)' : '') +
    ': virgül, tırnak ya da parantez eksik ya da fazla olabilir';
}

/* Dosyayı okur: { liste } ya da { hata }. Dosya yoksa { liste: null }. */
function dosyayiOku(dosya) {
  let metin;
  try {
    metin = fs.readFileSync(dosya, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return { liste: null };
    return { hata: 'okunamadı (' + e.code + ')' };
  }
  let veri;
  const temiz = metin.replace(/^﻿/, '');
  try {
    veri = JSON.parse(temiz);
  } catch (e) {
    return { hata: jsonHatasi(temiz, e) };
  }
  const liste = Array.isArray(veri) ? veri : (veri && Array.isArray(veri.yoneticiler) ? veri.yoneticiler : null);
  if (!liste) return { hata: '"yoneticiler" listesi bulunamadı (örnek: belge/admins.ornek.json)' };
  if (liste.length > EN_COK) return { hata: 'en fazla ' + EN_COK + ' yönetici yazılabilir' };
  return { liste };
}

/* Başkalarının okuyabildiği dosya uyarısı (Linux/macOS; Windows'ta izin bitleri anlamsız). */
function izinUyarisi(dosya) {
  if (process.platform === 'win32') return '';
  try {
    const kip = fs.statSync(dosya).mode & 0o777;
    if (kip & 0o077) return 'dosyayı yalnız sunucu kullanıcısı okuyabilmeli: chmod 600 ' + dosya;
  } catch (e) { /* okunamadıysa zaten yukarıda söylendi */ }
  return '';
}

/* Ortak kuralın iletisi ("Şifre en az 8 karakter olmalı", "Kullanıcı adında Türkçe
   harf kullanma (...).") atlanan satırın nedeni olur: küçük harfle başlar, sonda nokta
   yok ("şifre en az 8 karakter olmalı"). Panel ilk harfi büyütür. */
function nedenYap(ileti) {
  const s = String(ileti || '').trim().replace(/\.$/, '');
  return s.charAt(0).toLocaleLowerCase('tr') + s.slice(1);
}

/* Dosyadaki yöneticileri açar. Dönen: { dosyaVar, hata, uyari, eklenen: [{ eposta, kullaniciAdi, uretilenSifre }],
   atlanan: [{ sira, eposta, neden }] }. Şifreler yalnızca üretilenler için döner (dosyadaki şifre asla). */
async function uygula(depo, secenek) {
  const dosya = (secenek && secenek.dosya) || DOSYA;
  const sifreUret = secenek && secenek.sifreUret;
  const sonuc = { dosyaVar: false, hata: '', uyari: '', eklenen: [], atlanan: [] };
  const okunan = dosyayiOku(dosya);
  if (okunan.liste === null) return sonuc;
  sonuc.dosyaVar = true;
  if (okunan.hata) { sonuc.hata = okunan.hata; return sonuc; }
  sonuc.uyari = izinUyarisi(dosya);

  const gorulen = new Set();
  for (let i = 0; i < okunan.liste.length; i++) {
    const g = okunan.liste[i];
    const sira = i + 1;
    const atla = (eposta, neden) => sonuc.atlanan.push({ sira, eposta: eposta || '', neden });
    if (!g || typeof g !== 'object' || Array.isArray(g)) { atla('', 'satır bir nesne değil'); continue; }

    const eposta = normEmail(g.eposta || g.email);
    const ad = adDuzelt(metinYap(g.ad || g.fullName).trim()).slice(0, 80);
    /* E-posta ve kullanıcı adı öteki yollardaki gibi karşılaştırılır (ortak.js
       kimlikSade): "Ayse@X.com " ile "ayse@x.com" aynı hesaptır. */
    if (epostaSorunu(eposta) || eposta.length > 120) {
      atla(eposta, eposta && /[^!-~]/.test(eposta) ? 'e-postada Türkçe ya da başka alfabeden harf var'
        : 'geçerli bir e-posta yok');
      continue;
    }
    if (gorulen.has(eposta)) { atla(eposta, 'aynı e-posta dosyada iki kez yazılmış'); continue; }
    gorulen.add(eposta);
    if (!ad) { atla(eposta, 'ad yazılmamış'); continue; }
    if (ad.length < 2) { atla(eposta, 'ad en az 2 harf olmalı'); continue; }

    const var_ = await depo.kullanicilar.epostayla(eposta);
    if (var_) {
      atla(eposta, var_.role === 'admin' ? 'zaten yönetici (değiştirilmedi)'
        : 'bu e-posta yönetici olmayan bir hesapta; o hesap yönetici yapılmadı');
      continue;
    }

    let kullaniciAdi = normKullaniciAdi(g.kullaniciAdi || g.username || '');
    if (kullaniciAdi) {
      const sorun = kullaniciAdiSorunu(kullaniciAdi);
      if (sorun) { atla(eposta, nedenYap(sorun)); continue; }
      if (await depo.kullanicilar.kullaniciAdiHerhangiYerde(kullaniciAdi)) { atla(eposta, 'kullanıcı adı başka bir hesapta'); continue; }
    } else {
      kullaniciAdi = await kullaniciAdiBul(depo, eposta);
      if (!kullaniciAdi) { atla(eposta, 'kullanıcı adı üretilemedi; dosyaya "kullaniciAdi" yaz'); continue; }
    }

    const yazilan = g.sifre == null || g.sifre === '' ? '' : metinYap(g.sifre);
    if (yazilan) {
      const sorun = sifreSorunu(yazilan, true);
      if (sorun) { atla(eposta, nedenYap(sorun)); continue; }
    }
    const sifre = yazilan || (sifreUret ? sifreUret() : '');
    if (!sifre) { atla(eposta, 'şifre üretilemedi'); continue; }

    /* Denetimden sonra aynı anda biri aynı e-postayı ya da kullanıcı adını
       almışsa (kayıt onayı, okulun açtığı hesap) veritabanı durdurur: satır
       atlanır, öteki satırlar sürer. */
    try {
      await depo.kullanicilar.ekle({
        id: uid('u'), username: kullaniciAdi, email: eposta, pass: await hashPw(sifre),
        fullName: ad, role: 'admin', status: 'approved', sifreDegismeli: true,
        city: '', district: '', address: '', createdAt: now()
      });
    } catch (e) {
      if (!e || e.code !== '23505') throw e;
      atla(eposta, e.constraint === 'kullanicilar_eposta_key' ? 'bu e-posta bu arada başka bir hesaba kaydedildi'
        : 'kullanıcı adı bu arada başka bir hesaba verildi');
      continue;
    }
    await depo.genel.islemYaz(null, 'yonetici.eklendi', ad + ' (' + eposta + ')', '');
    sonuc.eklenen.push({ eposta, kullaniciAdi, uretilenSifre: yazilan ? '' : sifre });
  }
  return sonuc;
}

/* Açılışta: sonucu sunucu penceresine yazar. Dosyadaki şifreler hiçbir yere yazılmaz. */
function yaz(sonuc) {
  if (!sonuc.dosyaVar) return;
  if (sonuc.hata) { console.error('  ! data/admins.json atlandı: ' + sonuc.hata); return; }
  if (sonuc.uyari) console.warn('  ! data/admins.json: ' + sonuc.uyari);
  for (const e of sonuc.eklenen) {
    console.log('\n  ! Yönetici hesabı açıldı (data/admins.json)');
    console.log('    E-posta         : ' + e.eposta);
    console.log('    Kullanıcı adı   : ' + e.kullaniciAdi);
    if (e.uretilenSifre) {
      console.log('    Şifre           : ' + e.uretilenSifre);
      console.log('    Bu şifre bir daha gösterilmez.');
    } else {
      console.log('    Şifre           : dosyada yazılan (ilk girişte değiştirilecek; dosyadan silebilirsin)');
    }
  }
  for (const a of sonuc.atlanan) {
    if (/^zaten yönetici/.test(a.neden)) continue;   // her açılışta tekrarlamasın
    console.warn('  ! data/admins.json ' + a.sira + '. satır (' + (a.eposta || '?') + ') atlandı: ' + a.neden);
  }
}

/* ---------------- canlı okuma ----------------
   Her dosya için son okuma: { imza, sonOkuma, sonuc (şifresiz), sira }.
   imza: değişme zamanı + boyut ('yok': dosya yok). Okumalar sıraya girer
   (aralık yoklaması ile "Şimdi oku" aynı anda aynı yöneticiyi iki kez açmaya
   çalışmasın). */
const durumlar = new Map();

function durumu(dosya) {
  if (!durumlar.has(dosya)) durumlar.set(dosya, { imza: null, sonOkuma: null, sonuc: null, sira: Promise.resolve() });
  return durumlar.get(dosya);
}

function imzaAl(dosya) {
  try {
    const st = fs.statSync(dosya);
    return st.mtimeMs + ':' + st.size;
  } catch (e) {
    return e.code === 'ENOENT' ? 'yok' : 'okunamadi:' + e.code;
  }
}

/* Sonucun dışarı verilebilir hâli: şifre (üretilen de) hiç girmez. */
function sifresiz(sonuc) {
  return {
    dosyaVar: !!sonuc.dosyaVar, hata: sonuc.hata || '', uyari: sonuc.uyari || '',
    eklenen: sonuc.eklenen.map(e => ({ eposta: e.eposta, kullaniciAdi: e.kullaniciAdi, sifreUretildi: !!e.uretilenSifre })),
    atlanan: sonuc.atlanan.map(a => ({ sira: a.sira, eposta: a.eposta, neden: a.neden }))
  };
}

/* Dosyayı (değişmemiş olsa da) okur ve uygular; sonucu pencereye yazar.
   secenek: { dosya, sifreUret, sessiz }. Dönen: uygula() sonucu (üretilen şifreyle;
   yalnız sunucu içinde kullanılır, dışarı sifresiz() gider). */
function oku(depo, secenek) {
  const dosya = (secenek && secenek.dosya) || DOSYA;
  const d = durumu(dosya);
  const is = d.sira.then(async () => {
    const imza = imzaAl(dosya);   // uygulamadan ÖNCE: okurken değişirse sonraki yoklama yakalar
    const sonuc = await uygula(depo, Object.assign({}, secenek, { dosya }));
    if (!(secenek && secenek.sessiz)) yaz(sonuc);
    d.imza = imza;
    d.sonOkuma = new Date().toISOString();
    d.sonuc = sifresiz(sonuc);
    return sonuc;
  });
  d.sira = is.catch(() => {});
  return is;
}

/* Dosya son okumadan beri değiştiyse (ya da hiç okunmadıysa) okur; değişmediyse null. */
async function denetle(depo, secenek) {
  const dosya = (secenek && secenek.dosya) || DOSYA;
  const d = durumu(dosya);
  await d.sira;
  if (d.sonOkuma && imzaAl(dosya) === d.imza) return null;
  return oku(depo, secenek);
}

/* Aralıkla yoklama. secenek.aralikMs(): her turda yeniden sorulur; aralık ayarı
   değişince aralikDegisti() bekleyen turu yeni aralıkla yeniden kurar (sunucu
   yeniden başlamadan geçerli olur). */
let izleyici = null;   // { zamanlayici, kur }

function zamanla(depo, secenek) {
  if (izleyici) clearTimeout(izleyici.zamanlayici);
  izleyici = { zamanlayici: null, kur: null };
  const kur = () => {
    const ms = Math.max(1000, Number(secenek.aralikMs()) || 60 * 1000);
    clearTimeout(izleyici.zamanlayici);
    izleyici.zamanlayici = setTimeout(() => {
      denetle(depo, secenek)
        .catch(e => console.error('  ! data/admins.json denetlenemedi: ' + e.message))
        .then(kur);
    }, ms);
    if (izleyici.zamanlayici.unref) izleyici.zamanlayici.unref();
  };
  izleyici.kur = kur;
  kur();
}

function aralikDegisti() {
  if (izleyici && izleyici.kur) izleyici.kur();
}

/* Yönetim panelindeki "Yönetici dosyası" kartı: son okumanın şifresiz özeti.
   dosyaVar, hata, eklenen, atlanan son okumaya aittir; simdiVar ve dosyaDegisme
   dosyanın şu anki hâli. Dosya son okumadan sonra değiştiyse (yazıldı, silindi)
   okunmadanDegisti true olur: kart "dosya yok" ile "son değişiklik: şu an" gibi
   çelişkili iki bilgiyi yan yana göstermez, bir sonraki okumayı bekler. */
function gorunum(dosya) {
  const yol = dosya || DOSYA;
  const d = durumu(yol);
  const s = d.sonuc || { dosyaVar: false, hata: '', uyari: '', eklenen: [], atlanan: [] };
  let degisme = null, simdiVar = false;
  try {
    degisme = new Date(fs.statSync(yol).mtimeMs).toISOString();
    simdiVar = true;
  } catch (e) { degisme = null; }
  const okunmadanDegisti = !!d.sonOkuma && imzaAl(yol) !== d.imza;
  return Object.assign({ dosya: 'data/admins.json', sonOkuma: d.sonOkuma, dosyaDegisme: degisme, simdiVar, okunmadanDegisti }, s);
}

module.exports = { DOSYA, uygula, yaz, dosyayiOku, oku, denetle, zamanla, aralikDegisti, gorunum, sifresiz, imzaAl };
