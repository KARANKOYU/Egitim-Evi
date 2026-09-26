'use strict';
/* Android uygulamasının sürümleri (egitimevi.org/indir sayfasındaki tablo).

   Sürümler uygulamanın GitHub deposundaki "Releases" bölümünden okunur:
   her sürümün adı, tarihi, notu ve APK dosyası (boyut, SHA-256 özeti, indirme
   adresi). Liste 15 dakika bellekte tutulur; GitHub'a ulaşılamazsa son alınan
   liste gösterilmeye devam eder.

   Sunucu yalnızca bu sabit adrese istek atar. Gelen her alan süzülür: indirme
   adresi yalnızca bu deponun sürüm dosyası olabilir, not düz metne çevrilir,
   özet 64 onaltılık hane olmalıdır. Taslak ve ön sürümler gösterilmez.

   Testlerde EE_DIS_ISTEK=0 ile dışarıya hiç istek atılmaz (liste boş gelir). */

const DEPO = 'KARANKOYU/Egitim-Evi-App';
const API_ADRESI = 'https://api.github.com/repos/' + DEPO + '/releases?per_page=30';
const SAYFA_ADRESI = 'https://github.com/' + DEPO + '/releases';
const ONBELLEK_SURESI = 15 * 60 * 1000;
const HATA_BEKLEME = 2 * 60 * 1000;          // GitHub'a ulaşılamadıysa bu kadar bekle
const EN_COK_BAYT = 2 * 1024 * 1024;

const SURUM_DESENI = /^v?(\d{1,3}(?:\.\d{1,4}){1,3})$/;
const DOSYA_ADRESI = /^https:\/\/github\.com\/KARANKOYU\/Egitim-Evi-App\/releases\/download\/[A-Za-z0-9._-]{1,60}\/[A-Za-z0-9._-]{1,100}\.apk$/;
const OZET_DESENI = /^sha256:([0-9a-f]{64})$/;

/* GitHub notu Markdown'dur; tabloda düz metin gösterilir. */
function duzMetin(s, sinir) {
  const t = String(s || '')
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F‪-‮⁦-⁩]/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')                // resimler
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')             // bağlantı -> yazısı
    .replace(/`{1,3}/g, '')
    .replace(/^\s{0,3}(#{1,6}|[-*+]|>)\s+/gm, '')
    .replace(/(\*\*|__|\*|_|~~)(\S[^\n]*?\S|\S)\1/g, '$2')
    .replace(/\s+/g, ' ')
    .trim();
  return t.length > sinir ? t.slice(0, sinir - 1).trimEnd() + '…' : t;
}

/* GitHub cevabından gösterilecek sürümler. Saf işlev: testte doğrudan denenir. */
function surumleriAyikla(ham) {
  if (!Array.isArray(ham)) return [];
  const liste = [];
  for (const r of ham.slice(0, 60)) {
    if (!r || typeof r !== 'object' || r.draft || r.prerelease) continue;
    const m = SURUM_DESENI.exec(String(r.tag_name || ''));
    if (!m) continue;
    const tarih = new Date(String(r.published_at || ''));
    if (isNaN(tarih.getTime())) continue;
    const apk = (Array.isArray(r.assets) ? r.assets : []).map(a => ({
      ad: String((a && a.name) || ''),
      adres: String((a && a.browser_download_url) || ''),
      boyut: Number(a && a.size),
      ozet: OZET_DESENI.exec(String((a && a.digest) || ''))
    })).find(a => DOSYA_ADRESI.test(a.adres) && Number.isFinite(a.boyut) && a.boyut > 0 && a.boyut < 500 * 1024 * 1024);
    if (!apk) continue;
    liste.push({
      surum: m[1],
      ad: duzMetin(r.name || ('Sürüm ' + m[1]), 90),
      tarih: tarih.toISOString(),
      notlar: duzMetin(r.body, 400),
      apk: { ad: apk.ad, adres: apk.adres, boyut: Math.round(apk.boyut), sha256: apk.ozet ? apk.ozet[1] : '' }
    });
  }
  /* En yeni en üstte: sürüm numarasına göre. */
  const sayi = s => s.split('.').map(Number);
  liste.sort((a, b) => {
    const x = sayi(a.surum), y = sayi(b.surum);
    for (let i = 0; i < Math.max(x.length, y.length); i++) {
      if ((x[i] || 0) !== (y[i] || 0)) return (y[i] || 0) - (x[i] || 0);
    }
    return 0;
  });
  return liste.slice(0, 30);
}

let onbellek = { surumler: [], zaman: 0, alindi: false };
let sonDeneme = 0;
let suAnki = null;

async function githubtanAl() {
  const cevap = await fetch(API_ADRESI, {
    headers: { 'User-Agent': 'egitimevi-sunucu', Accept: 'application/vnd.github+json' },
    redirect: 'error',
    signal: AbortSignal.timeout(6000)
  });
  if (!cevap.ok) throw new Error('GitHub ' + cevap.status);
  const metin = await cevap.text();
  if (metin.length > EN_COK_BAYT) throw new Error('cevap çok büyük');
  return surumleriAyikla(JSON.parse(metin));
}

/* Sürüm listesi: önbellek tazeyse ondan; değilse GitHub'dan (aynı anda tek istek). */
async function surumler() {
  const simdi = Date.now();
  if (process.env.EE_DIS_ISTEK === '0') return { surumler: [], alindi: false };
  const taze = onbellek.alindi && simdi - onbellek.zaman < ONBELLEK_SURESI;
  if (taze || simdi - sonDeneme < HATA_BEKLEME) return onbellek;
  if (!suAnki) {
    sonDeneme = simdi;
    suAnki = githubtanAl()
      .then(l => { onbellek = { surumler: l, zaman: Date.now(), alindi: true }; })
      .catch(() => { /* ulaşılamadı: eski liste kalır */ })
      .finally(() => { suAnki = null; });
  }
  await suAnki;
  return onbellek;
}

module.exports = { surumler, surumleriAyikla, duzMetin, SAYFA_ADRESI };
