'use strict';
/* Okul hayatı: yemek listesi (/api/yemek), servisler (/api/servis),
   kulüpler (/api/kulupler).

   Görme kuralları:
     yemek   — okuldaki herkes; veli (ve çocuğu olan öğretmen) çocuğunun okulunu
     servis  — yönetim bütün servisleri; öğrenci kendi servisini; veli
               yalnızca çocuğunun servisini (şoför telefonu dahil) görür
     kulüp   — okuldaki herkes kulüp listesini; üye listesini yalnızca yönetim
               ve kulübün danışman öğretmeni; veli çocuğunun kulüplerini
   Düzenleme müdüre ve ilgili yetkisi verilmiş öğretmene açık. Servis
   saatleri, yoklama, sıra ve notlar için servis bölümündeki açıklamaya bak. */

const { hizSinir } = require('../guvenlik');
const { bad, ok, sendJSON } = require('../http');
const { saatDuzelt } = require('../iliskiler');
const { clean, normTelefon, telefonSorunu, uid } = require('../ortak');
const { depo, cokluBildirim } = require('../veri');
const { yetkiVarMi } = require('../yetki');
const { islemYaz } = require('./islem-kaydi');
const pencere = require('../yardimci/servis-pencere');
const { trGun, gunEkle: trGunEkle } = require('../yardimci/hatirlatici-zaman');

/* ---------------- konum ----------------
   Servis haritası: okul, öğrencinin evi ve (sefer sürerken) servis aracı.
   Aracın konumunu yalnızca o servisteki öğrenci, velisi ve okul yönetimi
   görür; yalnızca açık seferde ve son 3 dakikada geldiyse. Geçmiş iz
   saklanmaz. Ev konumunu öğrencinin kendisi, velisi, o servisin servisçisi
   ve okul yönetimi görür. */
const KONUM_TAZE_MS = 3 * 60 * 1000;
const YAKLASMA_ESIKLERI = [500, 100];   // metre; her seferde öğrenci başına birer kez
const EN_KOTU_DOGRULUK = 150;           // metre; bundan kötü GPS ölçümüyle bildirim gitmez

/* İki nokta arası metre (haversine). */
function mesafe(a, b) {
  const r = 6371000, rad = x => x * Math.PI / 180;
  const dEn = rad(b.enlem - a.enlem), dBoy = rad(b.boylam - a.boylam);
  const h = Math.sin(dEn / 2) ** 2 + Math.cos(rad(a.enlem)) * Math.cos(rad(b.enlem)) * Math.sin(dBoy / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

/* Gelen koordinat: sayı (ya da sayı yazılmış metin) ve aralıkta olmalı;
   boş, nesne, dizi kabul edilmez. */
const sayiAl = v => typeof v === 'number' ? v
  : (typeof v === 'string' && /^\s*-?\d{1,3}(\.\d{1,12})?\s*$/.test(v) ? Number(v) : NaN);
function koordinatAl(body) {
  const en = sayiAl(body.enlem), boy = sayiAl(body.boylam);
  if (!isFinite(en) || !isFinite(boy) || Math.abs(en) > 90 || Math.abs(boy) > 180) return null;
  if (en === 0 && boy === 0) return null;
  return { enlem: Math.round(en * 1e6) / 1e6, boylam: Math.round(boy * 1e6) / 1e6 };
}

/* Yaklaşma bildirimi alacak öğrenciler kısa süre bellekte tutulur: her konum
   güncellemesinde (birkaç saniyede bir) veritabanına gidilmesin. Yoklama,
   sıra ya da "binmeyecek" değişince silinir. Sabah seferinde henüz
   işaretlenmemiş ("Bindi" / "Binmedi") ve "binmeyecek" denmemiş öğrenciler,
   akşam seferinde okulda "Geldi" işaretlenip henüz inmemiş öğrenciler
   bildirim alır. */
const yaklasmaOnbellek = new Map();   // servisId -> { seferId, bitis, liste }
function onbellekSil(servisId) {
  if (servisId) yaklasmaOnbellek.delete(servisId);
  else yaklasmaOnbellek.clear();
}
async function yaklasmaAdaylari(sefer) {
  const k = yaklasmaOnbellek.get(sefer.servis_id);
  if (k && k.seferId === sefer.id && k.bitis > Date.now()) return k.liste;
  const donem = pencere.seferDonemi(sefer.yon), tarih = trGun(Date.parse(sefer.baslangic));
  const ogrenciler = await depo.okulHayati.servisinOgrencileri(sefer.servis_id);
  const idler = ogrenciler.map(o => o.ogrenci_id);
  const [yok, binmez] = await Promise.all([depo.servisYoklama.yoklamalar(idler, tarih, donem), binmeyecekKumesi(idler, tarih, donem)]);
  const liste = ogrenciler.filter(o => {
    const y = yok.get(o.ogrenci_id);
    return donem === 'sabah' ? !y && !binmez.has(o.ogrenci_id) : !!y && y.durum === 'geldi';
  });
  yaklasmaOnbellek.set(sefer.servis_id, { seferId: sefer.id, bitis: Date.now() + 60 * 1000, liste });
  if (yaklasmaOnbellek.size > 500) for (const [id, v] of yaklasmaOnbellek) if (v.bitis < Date.now()) yaklasmaOnbellek.delete(id);
  return liste;
}

/* Konum geldi: yaklaşan evler için (500 m, 100 m) öğrenciye ve velilerine bildirim. */
async function yaklasmaBildir(sefer, konum) {
  const liste = await yaklasmaAdaylari(sefer);
  const giden = [];
  for (const o of liste) {
    if (o.enlem === null || o.boylam === null || o.enlem === undefined) continue;
    const d = mesafe(konum, { enlem: Number(o.enlem), boylam: Number(o.boylam) });
    for (const esik of YAKLASMA_ESIKLERI) {
      if (d > esik) continue;
      if (!await depo.okulHayati.seferBildirimiIsaretle(sefer.id, o.ogrenci_id, esik)) continue;
      const metin = esik <= 100 ? 'Servis evine 100 metreden yakın, hazırlan.' : 'Servis evine yaklaşıyor (yaklaşık ' + esik + ' m).';
      giden.push({ ogrenciId: o.ogrenci_id, ad: o.ad, metin });
    }
  }
  if (!giden.length) return;
  const veliler = await depo.kullanicilar.veliHaritasi(giden.map(g => g.ogrenciId));
  const liste2 = [];
  for (const g of giden) {
    liste2.push({ kime: g.ogrenciId, metin: g.metin, baglanti: '#/servis' });
    for (const v of veliler.get(g.ogrenciId) || []) {
      liste2.push({ kime: v, metin: g.ad + ': ' + g.metin.charAt(0).toLocaleLowerCase('tr') + g.metin.slice(1), baglanti: '#/servis' });
    }
  }
  await cokluBildirim(liste2, { veliye: false });   // veliye kendi metni yukarıda
}

/* Kişi bu öğrencinin servis haritasını görebilir mi? Evini düzenleyebilir mi? */
async function haritaYetkisi(me, ogrenciId) {
  const st = await depo.kullanicilar.bul(ogrenciId);
  if (!st || st.role !== 'student') return null;
  const yonetim = st.schoolId === me.schoolId && (me.role === 'teacher' || me.role === 'principal') && yetkiVarMi(me, 'servis.yonet');
  if (me.id === st.id || yonetim) return { st, evDuzenle: true };
  if (me.role !== 'student' && await depo.kullanicilar.bagliMi(me.id, st.id)) return { st, evDuzenle: true };
  if (me.role === 'servisci') {
    const s = (await depo.okulHayati.ogrencilerinServisi([st.id]))[0];
    if (s && s.sofor_id === me.id) return { st, evDuzenle: false };
  }
  return null;
}

const GUN_MS = 86400000;
const TARIH = /^\d{4}-\d{2}-\d{2}$/;

/* Verilen günün haftasının pazartesisi ('YYYY-AA-GG'). */
function haftaBasi(gun) {
  const d = new Date((TARIH.test(gun || '') ? gun : new Date().toISOString().slice(0, 10)) + 'T12:00:00Z');
  if (isNaN(d.getTime())) return haftaBasi('');
  const fark = (d.getUTCDay() + 6) % 7;
  return new Date(d.getTime() - fark * GUN_MS).toISOString().slice(0, 10);
}
const gunEkle = (gun, n) => new Date(new Date(gun + 'T12:00:00Z').getTime() + n * GUN_MS).toISOString().slice(0, 10);

/* Kişinin çocukları (okullarıyla). Öğrenci ve yöneticide boş. */
async function cocuklar(me) {
  if (!me.role || me.role === 'student' || me.role === 'admin') return [];
  return depo.kullanicilar.cocuklari(me.id);
}

/* Telefonu isteğe bağlı alan: boşsa '', yazılmışsa doğru biçimde olmalı. */
function telefonAl(deger, ad) {
  const t = clean(deger, 30);
  if (!t) return { deger: '' };
  if (telefonSorunu(t)) return { hata: ad + ' telefonu: ' + telefonSorunu(t).charAt(0).toLocaleLowerCase('tr') + telefonSorunu(t).slice(1) };
  return { deger: normTelefon(t) };
}

/* Öğrenci ve velinin gördüğü servis bilgisi. */
/* Şoför adı ve telefonu: serviste yazılı olan; yoksa servisçi hesabınınki. */
const servisGorunumu = s => ({
  ad: s.ad, plaka: s.plaka, sofor: s.sofor || s.sofor_hesap_adi || '', soforTel: s.sofor_tel || s.sofor_hesap_tel || '',
  rehber: s.rehber, rehberTel: s.rehber_tel,
  sabah: s.sabah, aksam: s.aksam, guzergah: s.guzergah, durak: s.durak || ''
});

/* Seçim listeleri için okulun öğrencileri: yalnızca ad ve sınıf. */
async function okulOgrencileri(okulId) {
  const [ogrenciler, siniflar] = await Promise.all([
    depo.kullanicilar.okulun(okulId, { rol: 'student', durum: 'approved' }), depo.siniflar.okulun(okulId)]);
  const sinifAdi = new Map(siniflar.map(c => [c.id, c.name]));
  return ogrenciler.map(u => ({ id: u.id, ad: u.fullName, sinif: sinifAdi.get(u.classId) || '' }))
    .sort((a, b) => a.sinif.localeCompare(b.sinif, 'tr') || a.ad.localeCompare(b.ad, 'tr'));
}

const kulupGorunumu = u => ({
  id: u.id, ad: u.ad, aciklama: u.aciklama, danismanId: u.danisman_id || '', danisman: u.danisman_adi || '',
  kontenjan: u.kontenjan || 0, uyeSayisi: u.uye_sayisi, basvuruAcik: u.basvuru_acik, gunSaat: u.gun_saat
});

/* ======================= servis: saatler, yoklama, sıra, notlar =======================
   Okulun servis saatleri (sabah ve akşam aralığı, Türkiye saati) müdür ya da
   servis.yonet yetkilisince seçilir (yardimci/servis-pencere.js). Veli ve
   öğrenci servis bilgi kartını her zaman görür; canlı bilgi (aracın yeri,
   bugünkü durum, sıra, "önünde N öğrenci") yalnız aralık içinde ya da açık
   sefer sürerken döner. Sefer yalnız aralık içinde başlar; aralık bitince
   60 dakika daha sürebilir, sonra kapanır (servisTemizle).

   Servisçinin yoklaması (tekli işaret, anında): sabah bindi / binmedi (ilk
   "bindi" seferi başlatır) ve "Okula vardık" (sefer biter); akşam geldi /
   gelmedi, sonra "Başlat" (sefer başlar), sonra her öğrencide "indi" (hepsi
   inince sefer biter). Velilere giden bildirimler bir kez gider (şema 028
   servis_olaylari); veli o dönem için "binmeyecek" dediyse binmedi /
   gelmedi bildirimi gitmez. Bildirim öğrenciye gitmez.

   Yoklama, notlar ve işaretler 30 gün saklanır. Okul yönetimi bugünkü
   yoklamayı salt okunur görür. */
const DURUMLAR = { sabah: ['bindi', 'binmedi'], aksam: ['geldi', 'gelmedi', 'indi'] };
const ILERI_GUN = 7;       // not ve "binmeyecek" en çok 7 gün sonrası için
const SAKLAMA_GUN = 30;
const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

const bugunTr = () => trGun(Date.now());
const saatYaz = zaman => zaman ? pencere.trSaat(Date.parse(zaman)) : null;
const saatlerGorunumu = s => ({ sabahBas: s.sabahBas, sabahBit: s.sabahBit, aksamBas: s.aksamBas, aksamBit: s.aksamBit });

/* "bugün", "yarın" ya da "28 Eylül". */
function tarihYazisi(tarih) {
  const b = bugunTr();
  if (tarih === b) return 'bugün';
  if (tarih === trGunEkle(b, 1)) return 'yarın';
  return Number(tarih.slice(8, 10)) + ' ' + AYLAR[Number(tarih.slice(5, 7)) - 1];
}

/* Bugün ile 7 gün sonrası arasındaki tarih ('YYYY-AA-GG'); boşsa bugün, geçersizse null. */
function ileriTarih(v) {
  const t = clean(v, 10) || bugunTr();
  if (!TARIH.test(t) || isNaN(Date.parse(t + 'T12:00:00Z')) || new Date(t + 'T12:00:00Z').toISOString().slice(0, 10) !== t) return null;
  const b = bugunTr();
  return t >= b && t <= trGunEkle(b, ILERI_GUN) ? t : null;
}

async function binmeyecekKumesi(idler, tarih, donem) {
  return new Set((await depo.servisYoklama.binmeyecekler(idler, tarih, tarih)).filter(b => b[donem]).map(b => b.ogrenci_id));
}

/* Servisin öğrencileri o dönemin sırasıyla (sırası olmayanlar sonda, ada göre). */
function siraliListe(liste, donem) {
  const alan = donem === 'aksam' ? 'sira_aksam' : 'sira_sabah';
  return liste.slice().sort((a, b) => (a[alan] || 1e9) - (b[alan] || 1e9) || String(a.ad).localeCompare(String(b.ad), 'tr'));
}

/* "Önünde N öğrenci": sabah, sırada önde olup henüz işaretlenmemiş ve
   "binmeyecek" denmemiş öğrenciler; akşam, sırada önde olup okulda "Geldi"
   işaretlenmiş ve henüz inmemiş öğrenciler. Öğrencinin kendisi sabah
   işaretlenmişse ya da akşam serviste değilse null. */
function onundeKac(sirali, ogrenciId, yok, binmez, donem) {
  const i = sirali.findIndex(o => o.ogrenci_id === ogrenciId);
  if (i < 0) return null;
  const kendi = yok.get(ogrenciId);
  if (donem === 'sabah') {
    if (kendi || binmez.has(ogrenciId)) return null;
    return sirali.slice(0, i).filter(o => !yok.get(o.ogrenci_id) && !binmez.has(o.ogrenci_id)).length;
  }
  if (!kendi || kendi.durum !== 'geldi') return null;
  return sirali.slice(0, i).filter(o => { const y = yok.get(o.ogrenci_id); return !!y && y.durum === 'geldi'; }).length;
}

/* İşaret atılabilecek dönem: aralık içindeysek o dönem; aralık biteli 60
   dakika olmadıysa uzatmadaki dönem (orada yalnız başlamış ve bitmemiş
   seferde işaret alınır). */
function isaretDonemi(p) {
  if (p.donem) return { donem: p.donem, tarih: p.tarih, aralikta: true };
  if (p.uzatma) return { donem: p.uzatma.donem, tarih: p.uzatma.tarih, aralikta: false };
  return null;
}
const donemAraligi = (s, donem) => ({ bas: s[donem + 'Bas'], bit: s[donem + 'Bit'] });
const araliktaDegil = p => 'Yoklama ' + pencere.aralikMetni(p.saatler) + ' arasında açılır.';
const bittiMetni = donem => donem === 'sabah' ? 'Okula varıldı; sabah yoklaması kapandı.' : 'Akşam seferi bitti; yoklama kapandı.';

/* O dönemin seferi, dönemin kendi aralığında başladı mı? Uzatmada işaret
   yalnız böyle bir seferde alınır (aralık sonradan değiştiyse uzatma yok). */
const araliktaBasladi = (p, is, g) => !!(g && g.basladi) && pencere.aralikIcindeMi(p.saatler, is.tarih, is.donem, Date.parse(g.basladi));

/* İşaret atılamıyorsa nedeni (Türkçe), atılabiliyorsa ''. */
function yoklamaEngeli(p, is, gunSatiri) {
  if (!is) return araliktaDegil(p);
  if (gunSatiri && gunSatiri.bitti) return bittiMetni(is.donem);
  if (!is.aralikta && !araliktaBasladi(p, is, gunSatiri)) return araliktaDegil(p);
  return '';
}

/* Servisin açık ve saat aralığı bakımından hâlâ süren seferi (yoksa null). */
async function surenSefer(servisId, okul) {
  const s = await depo.okulHayati.acikSefer(servisId);
  return s && pencere.seferSuruyorMu(okul, s) ? s : null;
}

/* Servisin bu dönemdeki seferi: sürüyorsa o döner, yoksa yenisi açılır
   (sürmeyen açık sefer kapanır). Aynı anda gelen istekler (iki ilk "Bindi",
   "Başlat"a iki kez basmak) tek sefer açar: depo servis satırını işlem
   boyunca kilitler. Dönen: { sefer, yeni } */
function seferAc(servis, okul, soforId, donem) {
  const yon = pencere.donemYonu(donem);
  return depo.okulHayati.seferAcYaDaBul({ id: uid('sf'), servisId: servis.id, soforId, yon },
    s => s.yon === yon && s.sofor_id === soforId && pencere.seferSuruyorMu(okul, s));
}

const seferGorunumu = s => s ? { id: s.id, yon: s.yon, donem: pencere.seferDonemi(s.yon), baslangic: s.baslangic, sonKonum: s.son_konum } : null;
const gunGorunumu = g => ({ basladi: g && g.basladi || null, basladiSaat: g ? saatYaz(g.basladi) : null,
  bitti: g && g.bitti || null, bittiSaat: g ? saatYaz(g.bitti) : null });
const notGorunumu = n => ({ id: n.id, ogrenciId: n.ogrenci_id || null, ogrenciAd: n.ogrenci_adi || '', genel: !n.ogrenci_id,
  tarih: n.tarih, metin: n.metin, saat: saatYaz(n.olusturma) });
const isaretGorunumu = b => ({ tarih: b.tarih, sabah: b.sabah, aksam: b.aksam, not: b.aciklama || '' });

/* Servisçinin (ve salt okunur yönetimin) yoklama ekranı: ekrandan bağımsız,
   eksiksiz. Aralık dışındaysa liste bir sonraki aralığın sırası ve
   işaretleriyle gelir (servisçi yarının "binmeyecek"lerini görür). */
async function yoklamaCevabi(servis, servisler, duzenleyebilir) {
  const okul = await depo.okullar.bul(servis.okul_id);
  const p = pencere.servisPenceresi(okul);
  const is = isaretDonemi(p);
  const liste = is || (p.sonraki ? { donem: p.sonraki.donem, tarih: p.sonraki.tarih } : { donem: 'sabah', tarih: p.tarih });
  const bugun = bugunTr();
  const ogrenciler = siraliListe(await depo.okulHayati.servisinOgrencileri(servis.id), liste.donem);
  const idler = ogrenciler.map(o => o.ogrenci_id);
  const [sefer, gunSatiri, yok, isaretler, notlar] = await Promise.all([
    surenSefer(servis.id, okul),
    depo.servisYoklama.gun(servis.id, liste.tarih, liste.donem),
    depo.servisYoklama.yoklamalar(idler, liste.tarih, liste.donem),
    depo.servisYoklama.binmeyecekler(idler, bugun, trGunEkle(bugun, ILERI_GUN)),
    depo.servisYoklama.servisinNotlari(servis.id, bugun)
  ]);
  const gununIsareti = new Map(isaretler.filter(b => b.tarih === liste.tarih).map(b => [b.ogrenci_id, b]));
  const adlar = new Map(ogrenciler.map(o => [o.ogrenci_id, o.ad]));
  const sayilar = { toplam: ogrenciler.length, bekleyen: 0, binmeyecek: 0 };
  for (const d of DURUMLAR[liste.donem]) sayilar[d] = 0;
  const satirlar = ogrenciler.map((o, i) => {
    const y = yok.get(o.ogrenci_id), b = gununIsareti.get(o.ogrenci_id);
    const binmez = !!(b && b[liste.donem]);
    if (y) sayilar[y.durum]++;
    else if (binmez) sayilar.binmeyecek++;
    else sayilar.bekleyen++;
    return {
      id: o.ogrenci_id, ad: o.ad, sinif: o.sinif || '', durak: o.durak, sira: i + 1,
      siraSabah: o.sira_sabah, siraAksam: o.sira_aksam,
      ev: o.enlem !== null && o.enlem !== undefined ? { enlem: Number(o.enlem), boylam: Number(o.boylam) } : null,
      durum: y ? y.durum : null, bindiSaat: y ? saatYaz(y.bindi_zaman) : null, indiSaat: y ? saatYaz(y.indi_zaman) : null,
      binmeyecek: binmez, veliIsareti: b ? isaretGorunumu(b) : null
    };
  });
  const engel = yoklamaEngeli(p, is, is ? gunSatiri : null);
  return {
    tarih: liste.tarih, donem: is ? is.donem : null, listeDonemi: liste.donem,
    aralikta: !!(is && is.aralikta), uzatma: !!(is && !is.aralikta),
    acik: duzenleyebilir && !engel, engel, duzenleyebilir,
    saatler: saatlerGorunumu(p.saatler), aralik: is ? donemAraligi(p.saatler, is.donem) : null, sonraki: p.sonraki,
    servisler: servisler.map(s => ({ id: s.id, ad: s.ad, plaka: s.plaka })),
    servis: { id: servis.id, ad: servis.ad, plaka: servis.plaka, sabah: servis.sabah, aksam: servis.aksam },
    okul: okul ? { ad: okul.name, enlem: okul.enlem, boylam: okul.boylam } : null,
    sefer: seferGorunumu(sefer), gun: gunGorunumu(gunSatiri), sayilar, ogrenciler: satirlar,
    notlar: notlar.map(notGorunumu),
    binmeyecekler: isaretler.map(b => Object.assign({ ogrenciId: b.ogrenci_id, ad: adlar.get(b.ogrenci_id) || '' }, isaretGorunumu(b)))
  };
}

/* Servisi olmayan servisçinin ekranı (aynı biçim, boş liste). */
async function bosYoklama(okulId, servisler) {
  const okul = await depo.okullar.bul(okulId);
  const p = pencere.servisPenceresi(okul);
  const is = isaretDonemi(p);
  return {
    tarih: is ? is.tarih : p.tarih, donem: is ? is.donem : null, listeDonemi: is ? is.donem : (p.sonraki ? p.sonraki.donem : 'sabah'),
    aralikta: !!(is && is.aralikta), uzatma: !!(is && !is.aralikta), acik: false,
    engel: 'Sana henüz bir servis atanmadı. Okul yönetimi servise atayınca öğrenciler burada görünür.', duzenleyebilir: false,
    saatler: saatlerGorunumu(p.saatler), aralik: is ? donemAraligi(p.saatler, is.donem) : null, sonraki: p.sonraki,
    servisler: servisler.map(s => ({ id: s.id, ad: s.ad, plaka: s.plaka })), servis: null,
    okul: okul ? { ad: okul.name, enlem: okul.enlem, boylam: okul.boylam } : null,
    sefer: null, gun: gunGorunumu(null), sayilar: { toplam: 0, bekleyen: 0, binmeyecek: 0 }, ogrenciler: [], notlar: [], binmeyecekler: []
  };
}

/* Öğrencinin (ve velisinin) gördüğü bugünkü servis durumu. Notlar ve
   "binmeyecek" işaretleri her zaman; durum, sıra ve "önünde N" yalnız
   canlıyken (aralık içinde ya da sefer sürerken). */
async function ogrenciBugunu(ogrenciId, servis) {
  const okul = await depo.okullar.bul(servis.okul_id);
  const p = pencere.servisPenceresi(okul);
  const sefer = await surenSefer(servis.id, okul);
  let donem = p.donem, tarih = p.tarih;
  if (!donem && sefer) { donem = pencere.seferDonemi(sefer.yon); tarih = trGun(Date.parse(sefer.baslangic)); }
  const bugun = bugunTr();
  const [notlar, isaretler] = await Promise.all([
    depo.servisYoklama.ogrencilerinNotlari([ogrenciId], bugun),
    depo.servisYoklama.binmeyecekler([ogrenciId], bugun, trGunEkle(bugun, ILERI_GUN))]);
  const c = {
    canli: !!donem, donem: donem || null, tarih, saatler: saatlerGorunumu(p.saatler),
    aralik: donem ? donemAraligi(p.saatler, donem) : null, sonraki: p.sonraki, seferVar: !!sefer,
    durum: null, bindiSaat: null, indiSaat: null, vardiSaat: null, seferBasladi: false, seferBitti: false,
    sira: null, toplam: null, onunde: null, binmeyecekBugun: false,
    notlar: notlar.filter(n => n.hedef_id === ogrenciId).map(notGorunumu),
    binmeyecek: isaretler.map(isaretGorunumu)
  };
  if (!donem) return c;
  const sirali = siraliListe(await depo.okulHayati.servisinOgrencileri(servis.id), donem);
  const idler = sirali.map(o => o.ogrenci_id);
  const [yok, gunSatiri, binmez] = await Promise.all([depo.servisYoklama.yoklamalar(idler, tarih, donem),
    depo.servisYoklama.gun(servis.id, tarih, donem), binmeyecekKumesi(idler, tarih, donem)]);
  const y = yok.get(ogrenciId);
  c.durum = y ? y.durum : null;
  c.bindiSaat = y ? saatYaz(y.bindi_zaman) : null;
  c.indiSaat = y ? saatYaz(y.indi_zaman) : null;
  if (donem === 'sabah' && y && y.durum === 'bindi' && gunSatiri && gunSatiri.bitti) c.vardiSaat = saatYaz(gunSatiri.bitti);
  c.seferBasladi = !!(gunSatiri && gunSatiri.basladi);
  c.seferBitti = !!(gunSatiri && gunSatiri.bitti);
  c.sira = idler.indexOf(ogrenciId) + 1 || null;
  c.toplam = idler.length;
  c.onunde = onundeKac(sirali, ogrenciId, yok, binmez, donem);
  c.binmeyecekBugun = binmez.has(ogrenciId);
  return c;
}

/* Velilere (yalnız onlara; öğrenciye gitmez) servis bildirimi. */
async function servisVelilerineBildir(ogrenciId, metin) {
  const veliler = (await depo.kullanicilar.veliHaritasi([ogrenciId])).get(ogrenciId) || [];
  if (!veliler.length) return 0;
  await cokluBildirim(veliler.map(v => ({ kime: v, metin, baglanti: '#/servis?c=' + ogrenciId })), { veliye: false });
  return veliler.length;
}

/* İşaret değişti: veliye bir kez bildirim ("Zeynep 07:42'de servise bindi.").
   Bindi -> Binmedi olur ve "bindi" bildirildiyse bir kez düzeltme gider.
   Veli o dönem için "binmeyecek" dediyse binmedi / gelmedi bildirilmez. */
async function yoklamaBildir(o, is, durum) {
  const ad = pencere.ilkAd(o.ad), saat = pencere.trSaat(Date.now()), ek = pencere.saatEki(saat);
  const ilk = olay => depo.servisYoklama.olayIlkMi(is.tarih, is.donem, o.ogrenci_id, olay);
  const oldu = olay => depo.servisYoklama.olayVarMi(is.tarih, is.donem, o.ogrenci_id, olay);
  const binmez = async () => { const b = await depo.servisYoklama.binmeyecekBul(o.ogrenci_id, is.tarih); return !!(b && b[is.donem]); };
  let metin = '';
  if (durum === 'bindi' && await ilk('bindi')) metin = ad + ' ' + saat + ek + ' servise bindi.';
  else if (durum === 'geldi' && await ilk('geldi')) metin = ad + ' ' + saat + ek + ' okuldan servise bindi.';
  else if (durum === 'indi' && await ilk('indi')) metin = ad + ' ' + saat + ek + ' eve bırakıldı.';
  else if (durum === 'binmedi' || durum === 'gelmedi') {
    const onceki = durum === 'binmedi' ? 'bindi' : 'geldi';
    const yazi = durum === 'binmedi' ? ad + ' bu sabah servise binmedi.' : ad + ' akşam servise gelmedi.';
    if (await oldu(onceki)) { if (await ilk('duzeltme')) metin = 'Düzeltme: ' + yazi; }
    else if (!await binmez() && await ilk(durum)) metin = yazi;
  }
  if (metin) await servisVelilerineBildir(o.ogrenci_id, metin);
}

/* Servisçinin sefer konumu (/api/servis/konum ve telefonun /api/cihaz/servis-konum).
   Dönen: { durum: 200 } ya da { durum, hata }. Sefer yoksa 404, bitmişse ya da
   başkasınınsa 409; servis saati (ve 60 dakikalık uzatma) bittiyse sefer kapanır, 409. */
async function seferKonumuYaz(sofor, body) {
  const k = koordinatAl(body);
  if (!k) return { durum: 400, hata: 'Konum anlaşılmadı' };
  const dogruluk = sayiAl(body.dogruluk);
  const d = isFinite(dogruluk) && dogruluk >= 0 ? Math.min(dogruluk, 100000) : null;
  const sefer = await depo.okulHayati.seferBul(clean(body.seferId, 60));
  if (!sefer) return { durum: 404, hata: 'Sefer bulunamadı' };
  if (sefer.sofor_id !== sofor.id || sefer.bitis) return { durum: 409, hata: 'Sefer bitmiş ya da sana ait değil' };
  const servis = await depo.okulHayati.servisBul(sefer.servis_id);
  const okul = servis ? await depo.okullar.bul(servis.okul_id) : null;
  if (!okul || !pencere.seferSuruyorMu(okul, sefer)) {
    await depo.okulHayati.seferleriKapat([sefer.id]);
    return { durum: 409, hata: 'Servis saati bitti; sefer kapandı.' };
  }
  await depo.okulHayati.seferKonumYaz(sefer.id, sofor.id, k.enlem, k.boylam, d);
  if (d !== null && d <= EN_KOTU_DOGRULUK) await yaklasmaBildir(sefer, k);
  return { durum: 200 };
}

/* Arka iş (10 dakikada bir, index.js): konum gelmeyen ve saat aralığıyla
   60 dakikalık uzatması biten seferler kapanır; 30 günü geçen yoklama,
   bildirim işaretleri, notlar ve "binmeyecek" işaretleri silinir. */
async function servisTemizle() {
  await depo.okulHayati.seferTemizle();
  const simdi = Date.now();
  const kapanacak = (await depo.okulHayati.acikSeferler()).filter(f => !pencere.seferSuruyorMu({
    sabahBas: f.servis_sabah_bas, sabahBit: f.servis_sabah_bit, aksamBas: f.servis_aksam_bas, aksamBit: f.servis_aksam_bit
  }, f, simdi)).map(f => f.id);
  await depo.okulHayati.seferleriKapat(kapanacak);
  await depo.servisYoklama.temizle(trGunEkle(trGun(simdi), -SAKLAMA_GUN));
  onbellekSil();
  return kapanacak.length;
}

async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;
  if (p !== 'yemek' && p !== 'servis' && p !== 'kulupler') return false;
  if (!need(p === 'servis' ? ['student', 'parent', 'teacher', 'principal', 'servisci'] : ['student', 'parent', 'teacher', 'principal'])) return;
  const alt = segs[2] || '';

  /* ======================= yemek listesi ======================= */
  if (p === 'yemek') {
    if (!alt && method === 'GET') {
      const bas = haftaBasi(clean(q.get('bas'), 10));
      const bit = gunEkle(bas, 6);
      /* Kendi okulu + çocuklarının okulları (aynı okul bir kez). */
      const okullar = new Map();
      if (me.schoolId && me.role !== 'parent') okullar.set(me.schoolId, me._okulAdi || 'Okulum');
      for (const c of await cocuklar(me)) if (c.schoolId && !okullar.has(c.schoolId)) okullar.set(c.schoolId, c.schoolName);
      const satirlar = okullar.size ? await depo.okulHayati.yemekler([...okullar.keys()], bas, bit) : [];
      return ok(res, {
        bas, bit,
        okullar: [...okullar.entries()].map(([id, ad]) => ({
          id, ad, gunler: satirlar.filter(r => r.okul_id === id).map(r => ({ tarih: r.tarih, menu: r.menu, kalori: r.kalori || 0 }))
        })),
        duzenleyebilir: !!me.schoolId && me.role !== 'parent' && yetkiVarMi(me, 'yemek.yonet')
      });
    }

    /* Hafta ya da ay tek seferde: [{ tarih, menu, kalori }]; boş menü o günü siler. */
    if (!alt && method === 'POST') {
      if (!me.schoolId || me.role === 'parent' || !yetkiVarMi(me, 'yemek.yonet')) return bad(res, 'Yemek listesini düzenleme yetkin yok', 403);
      const gelen = Array.isArray(body.gunler) ? body.gunler : [];
      if (!gelen.length || gelen.length > 31) return bad(res, 'Bir seferde 1-31 gün kaydedilebilir');
      const bugun = new Date().toISOString().slice(0, 10);
      const liste = [];
      const gorulen = new Set();
      for (const g of gelen) {
        const tarih = clean(g && g.tarih, 10);
        if (!TARIH.test(tarih) || isNaN(Date.parse(tarih + 'T12:00:00Z'))) return bad(res, 'Geçersiz tarih');
        if (tarih < gunEkle(bugun, -60) || tarih > gunEkle(bugun, 400)) return bad(res, 'Tarih bu yılın dışında');
        if (gorulen.has(tarih)) continue;
        gorulen.add(tarih);
        /* Satırlar korunur, boş satırlar atılır. */
        const menu = (g && typeof g.menu === 'string' ? g.menu : '').split(/\r?\n/)
          .map(s => clean(s, 120)).filter(Boolean).slice(0, 8).join('\n');
        if (menu.length > 500) return bad(res, 'Bir günün menüsü çok uzun');
        let kalori = parseInt(clean(g && g.kalori, 10), 10);
        if (!(kalori >= 1 && kalori <= 5000)) kalori = null;
        liste.push({ tarih, menu, kalori });
      }
      await depo.okulHayati.yemekYaz(me.schoolId, liste);
      await islemYaz(me, 'yemek.kaydedildi', liste.length + ' gün', req);
      return ok(res, { message: 'Yemek listesi kaydedildi.' });
    }
  }

  /* ======================= servisler ======================= */
  if (p === 'servis') {
    const yonetir = !!me.schoolId && me.role !== 'parent' && me.role !== 'student' && yetkiVarMi(me, 'servis.yonet');

    if (!alt && method === 'GET') {
      const cevap = { yonetir, benim: null, cocuklar: [] };
      /* Okulun servis saatleri (öğrenci, servisçi, okul personeli). */
      if (me.schoolId && me.role !== 'parent') {
        const okul = await depo.okullar.bul(me.schoolId);
        if (okul) cevap.saatler = saatlerGorunumu(pencere.saatleri(okul));
      }
      if (me.role === 'student') {
        const s = (await depo.okulHayati.ogrencilerinServisi([me.id]))[0];
        cevap.benim = s ? Object.assign(servisGorunumu(s), { bugun: await ogrenciBugunu(me.id, s) }) : null;
      }
      const cc = await cocuklar(me);
      if (cc.length) {
        const servisleri = new Map((await depo.okulHayati.ogrencilerinServisi(cc.map(c => c.id))).map(s => [s.ogrenci_id, s]));
        for (const c of cc) {
          /* Servisi kapalı okuldaki çocuğun servis bilgisi gelmez (öteki çocuk için sayfa açık olabilir). */
          const s = depo.ozellikler.kapaliMi(c.schoolId, 'servis') ? null : servisleri.get(c.id);
          cevap.cocuklar.push({ id: c.id, ad: c.fullName, servis: s ? servisGorunumu(s) : null,
            bugun: s ? Object.assign(await ogrenciBugunu(c.id, s), { binmeyecekDuzenleyebilir: true }) : null });
        }
      }
      if (yonetir) {
        const [servisler, ogrenciler] = await Promise.all([
          depo.okulHayati.okulunServisleri(me.schoolId), depo.okulHayati.servisOgrencileri(me.schoolId)]);
        cevap.servisler = servisler.map(s => Object.assign({ id: s.id, ogrenciSayisi: s.ogrenci_sayisi,
          soforId: s.sofor_id || '', soforAdi: s.sofor_hesap_adi || '' }, servisGorunumu(s), {
          ogrenciler: ogrenciler.filter(o => o.servis_id === s.id)
            .map(o => ({ id: o.ogrenci_id, ad: o.ad, sinif: o.sinif || '', durak: o.durak, siraSabah: o.sira_sabah, siraAksam: o.sira_aksam }))
            .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'))
        }));
        cevap.okulOgrencileri = await okulOgrencileri(me.schoolId);
        cevap.saatDuzenleyebilir = true;
      }
      return ok(res, cevap);
    }

    /* ---------- harita: okul, ev, servis aracı ---------- */
    if (alt === 'harita' && method === 'GET') {
      const ogrenciId = me.role === 'student' ? me.id : clean(q.get('ogrenci'), 60);
      const y = await haritaYetkisi(me, ogrenciId);
      if (!y) return bad(res, 'Bu haritayı görme yetkin yok', 403);
      const [okul, ev, servis] = await Promise.all([depo.okullar.bul(y.st.schoolId), depo.okulHayati.evKonumu(y.st.id),
        depo.okulHayati.ogrencilerinServisi([y.st.id]).then(l => l[0] || null)]);
      /* Araç yalnız sefer sürerken (servis saatinde ya da 60 dakikalık uzatmada) görünür. */
      let sefer = null, bugun = null;
      if (servis) {
        const servisOkulu = servis.okul_id === (okul && okul.id) ? okul : await depo.okullar.bul(servis.okul_id);
        const s = await surenSefer(servis.id, servisOkulu);
        if (s) {
          const taze = !!s.sofor_id && s.son_konum && Date.now() - Date.parse(s.son_konum) < KONUM_TAZE_MS;
          sefer = { yon: s.yon, donem: pencere.seferDonemi(s.yon), baslangic: s.baslangic, sonKonum: s.son_konum,
            konum: taze ? { enlem: s.son_enlem, boylam: s.son_boylam, dogruluk: s.son_dogruluk } : null };
        }
        bugun = await ogrenciBugunu(y.st.id, servis);
      }
      return ok(res, {
        ogrenci: y.st.fullName,
        okul: okul ? { ad: okul.name, enlem: okul.enlem, boylam: okul.boylam } : null,
        ev: ev ? { enlem: ev.enlem, boylam: ev.boylam } : null,
        servis: servis ? servisGorunumu(servis) : null,
        sefer, bugun, evDuzenleyebilir: y.evDuzenle
      });
    }

    /* Ev konumu: öğrencinin kendisi, velisi ya da okul yönetimi işaretler. */
    if (alt === 'ev' && method === 'POST') {
      if (!hizSinir('evKonum:' + me.id, 30, 60 * 60 * 1000)) return bad(res, 'Çok sık değiştirdin. Biraz sonra dene.', 429);
      const ogrenciId = me.role === 'student' ? me.id : clean(body.ogrenciId, 60);
      const y = await haritaYetkisi(me, ogrenciId);
      if (!y || !y.evDuzenle) return bad(res, 'Bu öğrencinin ev konumunu değiştiremezsin', 403);
      if (body.sil === true) {
        await depo.okulHayati.evKonumuSil(y.st.id);
        return ok(res, { message: 'Ev konumu silindi.' });
      }
      const k = koordinatAl(body);
      if (!k) return bad(res, 'Konum anlaşılmadı. Haritada evin olduğu yere dokun.');
      await depo.okulHayati.evKonumuYaz(y.st.id, k.enlem, k.boylam, me.id);
      return ok(res, { ev: k, message: 'Ev konumu kaydedildi.' });
    }

    /* ---------- servisçi: günün yoklaması (yönetim salt okunur görür) ---------- */
    if (alt === 'yoklama' && method === 'GET') {
      let servisler;
      if (me.role === 'servisci') servisler = await depo.okulHayati.soforunServisleri(me.id);
      else if (yonetir) servisler = await depo.okulHayati.okulunServisleri(me.schoolId);
      else return bad(res, 'Servis yoklamasını servisçi alır; okul yönetimi görür.', 403);
      const istenen = clean(q.get('servisId'), 60);
      const servis = istenen ? servisler.find(s => s.id === istenen) : servisler[0];
      if (istenen && !servis) return bad(res, 'Servis bulunamadı', 404);
      if (!servis) return ok(res, await bosYoklama(me.schoolId, servisler));
      return ok(res, await yoklamaCevabi(servis, servisler, me.role === 'servisci'));
    }

    /* Servisçinin kendi servisi (değilse hata). */
    const servisimAl = async id => {
      if (me.role !== 'servisci') return { hata: 'Bu işi servisin servisçisi yapar', kod: 403 };
      const s = await depo.okulHayati.servisBul(clean(id, 60));
      if (!s || s.sofor_id !== me.id) return { hata: 'Bu servis sana atanmamış', kod: 403 };
      return { s };
    };

    /* Tekli işaret: sabah bindi / binmedi; akşam geldi / gelmedi / indi. Dönem
       sunucunun saatiyle belirlenir (istemcinin saatine güvenilmez). */
    if (alt === 'yoklama' && method === 'POST') {
      const r = await servisimAl(body.servisId);
      if (r.hata) return bad(res, r.hata, r.kod);
      const servis = r.s;
      const ogrenciler = await depo.okulHayati.servisinOgrencileri(servis.id);
      const o = ogrenciler.find(x => x.ogrenci_id === clean(body.ogrenciId, 60));
      if (!o) return bad(res, 'Öğrenci bu serviste değil', 404);
      const okul = await depo.okullar.bul(servis.okul_id);
      const p = pencere.servisPenceresi(okul);
      const is = isaretDonemi(p);
      const gunSatiri = is ? await depo.servisYoklama.gun(servis.id, is.tarih, is.donem) : null;
      const engel = yoklamaEngeli(p, is, gunSatiri);
      if (engel) return sendJSON(res, 409, { error: engel, aralikDisi: !is || !(gunSatiri && gunSatiri.bitti), kapandi: !!(gunSatiri && gunSatiri.bitti) });
      const istenenDonem = clean(body.donem, 10);
      if (istenenDonem && istenenDonem !== is.donem) {
        return sendJSON(res, 409, { error: 'Yoklamanın dönemi değişti; sayfayı yenile.', donemDegisti: true, donem: is.donem });
      }
      const durum = clean(body.durum, 10);
      if (DURUMLAR[is.donem].indexOf(durum) < 0) {
        return bad(res, is.donem === 'sabah' ? 'Sabah yoklamasında "Bindi" ya da "Binmedi" seçilir.'
          : 'Akşam yoklamasında "Geldi", "Gelmedi" ya da "İndi" seçilir.');
      }
      const eski = await depo.servisYoklama.yoklamaBul(is.tarih, is.donem, o.ogrenci_id);
      if (durum === 'indi') {
        if (!gunSatiri || !gunSatiri.basladi) return sendJSON(res, 409, { error: 'Önce "Başlat"a bas: sefer başlamadan "İndi" işaretlenmez.', baslamadi: true });
        if (!eski || (eski.durum !== 'geldi' && eski.durum !== 'indi')) return bad(res, '"İndi" yalnız okulda servise binen ("Geldi") öğrenciye işaretlenir.', 409);
      } else if (eski && eski.durum === 'indi') {
        return bad(res, 'Öğrenci eve bırakıldı; bu işaret artık değiştirilemez.', 409);
      }
      let seferBasladi = null, bitti = false, hata = null;
      if (!eski || eski.durum !== durum) {
        const simdi = new Date().toISOString();
        await depo.servisYoklama.yoklamaYaz({ tarih: is.tarih, donem: is.donem, ogrenciId: o.ogrenci_id, servisId: servis.id, durum,
          bindiZaman: durum === 'bindi' || durum === 'geldi' ? simdi : durum === 'indi' ? eski.bindi_zaman : null,
          indiZaman: durum === 'indi' ? simdi : null, alanId: me.id });
        onbellekSil(servis.id);
      }
      /* Sabahın ilk "Bindi"si seferi başlatır (servisçi "Seferi başlat"a
         basmadıysa; kayıtlı "başladı" anı saatler değiştiği için aralığın
         dışında kaldıysa da). Aynı işaret yeniden gönderilince de denenir:
         önceki deneme yarıda kaldıysa sefer yine açılır. */
      try {
        if (durum === 'bindi' && is.aralikta && !araliktaBasladi(p, is, gunSatiri)) {
          const r2 = await seferAc(servis, okul, me.id, is.donem);
          if (r2.yeni) seferBasladi = { id: r2.sefer.id, yon: r2.sefer.yon };
          await depo.servisYoklama.gunBasladi(servis.id, is.tarih, is.donem, !!(gunSatiri && gunSatiri.basladi));
        }
      } catch (e) { hata = e; }
      /* Veliye bildirim her durumda denenir; aynısı ikinci kez gitmez (olay
         tablosu). Önceki deneme yarıda kaldıysa "Yeniden dene" bildirimi gönderir. */
      await yoklamaBildir(o, is, durum);
      if (hata) throw hata;
      /* Akşam, sefer başladıktan sonra: serviste ("Geldi") kimse kalmadıysa ve
         en az biri eve bırakıldıysa sefer kendiliğinden biter (son öğrenci
         "İndi" ya da "Gelmedi" işaretlendi). */
      if (is.donem === 'aksam' && (durum === 'indi' || durum === 'gelmedi') && gunSatiri && gunSatiri.basladi) {
        const hepsi = [...(await depo.servisYoklama.yoklamalar(ogrenciler.map(x => x.ogrenci_id), is.tarih, is.donem)).values()];
        if (!hepsi.some(x => x.durum === 'geldi') && hepsi.some(x => x.durum === 'indi') &&
          await depo.servisYoklama.gunBitti(servis.id, is.tarih, is.donem)) {
          await depo.okulHayati.servisSeferiniBitir(servis.id);
          onbellekSil(servis.id);
          bitti = true;
        }
      }
      return ok(res, { message: !bitti ? 'Kaydedildi.' : durum === 'indi' ? 'Herkes eve bırakıldı; sefer bitti.' : 'Serviste öğrenci kalmadı; sefer bitti.',
        bitti, sefer: seferBasladi, yoklama: await yoklamaCevabi(servis, await depo.okulHayati.soforunServisleri(me.id), true) });
    }

    /* Sabah: "Okula vardık". Sefer biter; servise binmiş öğrencilerin velilerine
       "okula vardı" gider (bir kez). */
    if (alt === 'okula-vardik' && method === 'POST') {
      const r = await servisimAl(body.servisId);
      if (r.hata) return bad(res, r.hata, r.kod);
      const servis = r.s;
      const okul = await depo.okullar.bul(servis.okul_id);
      const p = pencere.servisPenceresi(okul);
      const is = isaretDonemi(p);
      if (!is || is.donem !== 'sabah') {
        return sendJSON(res, 409, { error: '"Okula vardık" sabah yoklamasında, sabah servis saatinde işaretlenir.', aralikDisi: true });
      }
      const gunSatiri = await depo.servisYoklama.gun(servis.id, is.tarih, is.donem);
      if (!is.aralikta && !araliktaBasladi(p, is, gunSatiri) && !(gunSatiri && gunSatiri.bitti)) {
        return sendJSON(res, 409, { error: araliktaDegil(p), aralikDisi: true });
      }
      const ilk = await depo.servisYoklama.gunBitti(servis.id, is.tarih, is.donem);
      await depo.okulHayati.servisSeferiniBitir(servis.id);
      onbellekSil(servis.id);
      let bildirilen = 0;
      if (ilk) {
        const ogrenciler = await depo.okulHayati.servisinOgrencileri(servis.id);
        const yok = await depo.servisYoklama.yoklamalar(ogrenciler.map(x => x.ogrenci_id), is.tarih, is.donem);
        const saat = pencere.trSaat(Date.now());
        for (const o of ogrenciler) {
          const y = yok.get(o.ogrenci_id);
          if (!y || y.durum !== 'bindi' || !await depo.servisYoklama.olayIlkMi(is.tarih, is.donem, o.ogrenci_id, 'vardi')) continue;
          if (await servisVelilerineBildir(o.ogrenci_id, pencere.ilkAd(o.ad) + ' ' + saat + pencere.saatEki(saat) + ' okula vardı.')) bildirilen++;
        }
      }
      return ok(res, { message: ilk ? 'Okula varıldı; sefer bitti.' + (bildirilen ? ' ' + bildirilen + ' öğrencinin velisine haber gitti.' : '')
        : 'Okula varış zaten kaydedildi.', bildirilen,
      yoklama: await yoklamaCevabi(servis, await depo.okulHayati.soforunServisleri(me.id), true) });
    }

    /* Sabah ve akşam alma / bırakma sırası (servisçi "Sırayı düzenle"). */
    if (alt === 'sira' && method === 'POST') {
      const r = await servisimAl(body.servisId);
      if (r.hata) return bad(res, r.hata, r.kod);
      const donem = clean(body.donem, 10);
      if (donem !== 'sabah' && donem !== 'aksam') return bad(res, 'Sıranın dönemini seç: sabah ya da akşam.');
      const gelen = Array.isArray(body.sira) ? body.sira.map(x => clean(x, 60)) : null;
      const liste = (await depo.okulHayati.servisinOgrencileri(r.s.id)).map(o => o.ogrenci_id);
      if (!gelen || gelen.length !== liste.length || new Set(gelen).size !== gelen.length || !gelen.every(id => liste.indexOf(id) >= 0)) {
        return bad(res, 'Sıra listesi servisin öğrencileriyle birebir aynı olmalı. Sayfayı yenileyip yeniden dene.');
      }
      await depo.okulHayati.siraYaz(r.s.id, donem, gelen);
      onbellekSil(r.s.id);
      return ok(res, { message: (donem === 'sabah' ? 'Sabah' : 'Akşam') + ' sırası kaydedildi.', donem, sira: gelen });
    }

    /* Servisçinin notu: öğrenciye (velisine gider) ya da bütün servise. */
    if (alt === 'not' && method === 'POST') {
      const r = await servisimAl(body.servisId);
      if (r.hata) return bad(res, r.hata, r.kod);
      if (!hizSinir('servisNot:' + me.id, 60, 60 * 60 * 1000)) return bad(res, 'Çok sık not yazdın. Biraz sonra dene.', 429);
      const ogrenciler = await depo.okulHayati.servisinOgrencileri(r.s.id);
      const ogrenciId = clean(body.ogrenciId, 60);
      const o = ogrenciId ? ogrenciler.find(x => x.ogrenci_id === ogrenciId) : null;
      if (ogrenciId && !o) return bad(res, 'Öğrenci bu serviste değil', 404);
      const tarih = ileriTarih(body.tarih);
      if (!tarih) return bad(res, 'Notun tarihi bugün ile ' + ILERI_GUN + ' gün sonrası arasında olmalı.');
      const metin = clean(typeof body.metin === 'string' ? body.metin.replace(/\s+/g, ' ') : '', 200);
      if (!metin) return bad(res, 'Notu yaz (en çok 200 harf).');
      const n = { id: uid('sn'), servisId: r.s.id, ogrenciId: o ? o.ogrenci_id : null, tarih, metin, yazanId: me.id };
      await depo.servisYoklama.notEkle(n);
      /* Velilere haber: bir veli (kardeşler) tek bildirim alır. */
      const hedefler = o ? [o.ogrenci_id] : ogrenciler.map(x => x.ogrenci_id);
      const veliler = await depo.kullanicilar.veliHaritasi(hedefler);
      const giden = new Map();
      for (const id of hedefler) for (const v of veliler.get(id) || []) if (!giden.has(v)) giden.set(v, id);
      if (giden.size) {
        await cokluBildirim([...giden].map(([v, id]) => ({ kime: v, metin: 'Servisçiden not: ' + metin, baglanti: '#/servis?c=' + id })),
          { veliye: false });
      }
      return ok(res, { not: notGorunumu(Object.assign({ ogrenci_id: n.ogrenciId, ogrenci_adi: o ? o.ad : '', olusturma: new Date().toISOString() }, n)),
        message: 'Not kaydedildi.' + (giden.size ? ' Velilere haber gitti.' : '') });
    }

    if (alt === 'not-sil' && method === 'POST') {
      if (me.role !== 'servisci') return bad(res, 'Notu yazan servisçi siler', 403);
      const n = await depo.servisYoklama.notBul(clean(body.id, 60));
      const s = n ? await depo.okulHayati.servisBul(n.servis_id) : null;
      if (!n || !s || s.sofor_id !== me.id) return bad(res, 'Not bulunamadı', 404);
      await depo.servisYoklama.notSil(n.id);
      return ok(res, { message: 'Not silindi.' });
    }

    /* Veli: "binmeyecek" (sabah, akşam ya da ikisi; bugün ve 7 gün sonrasına
       kadar). O dönemin yoklaması alınınca değiştirilemez. Servisçiye haber gider. */
    if (alt === 'binmeyecek' && method === 'POST') {
      if (me.role === 'student') return bad(res, '"Binmeyecek" işaretini velin koyar.', 403);
      const ogrenciId = clean(body.ogrenciId, 60);
      if (!ogrenciId || !await depo.kullanicilar.bagliMi(me.id, ogrenciId)) return bad(res, 'Bu öğrencinin velisi değilsin', 403);
      if (!hizSinir('binmeyecek:' + me.id, 60, 60 * 60 * 1000)) return bad(res, 'Çok sık değiştirdin. Biraz sonra dene.', 429);
      const servis = (await depo.okulHayati.ogrencilerinServisi([ogrenciId]))[0];
      if (!servis) return bad(res, 'Öğrencinin servis kaydı yok.', 404);
      const tarih = ileriTarih(body.tarih);
      if (!tarih) return bad(res, 'Tarih bugün ile ' + ILERI_GUN + ' gün sonrası arasında olmalı.');
      const yeni = { ogrenciId, tarih, sabah: body.sabah === true, aksam: body.aksam === true,
        aciklama: clean(typeof body.not === 'string' ? body.not.replace(/\s+/g, ' ') : '', 200), yazanId: me.id };
      if (!yeni.sabah && !yeni.aksam) yeni.aciklama = '';
      const eski = await depo.servisYoklama.binmeyecekBul(ogrenciId, tarih);
      for (const d of ['sabah', 'aksam']) {
        if (!!(eski && eski[d]) === yeni[d]) continue;
        if (await depo.servisYoklama.yoklamaBul(tarih, d, ogrenciId)) {
          return bad(res, 'Bu ' + (d === 'sabah' ? 'sabahın' : 'akşamın') + ' servis yoklaması alındı; artık değiştirilemez.', 409);
        }
      }
      await depo.servisYoklama.binmeyecekYaz(yeni);
      onbellekSil(servis.id);
      const degisti = !!(eski && eski.sabah) !== yeni.sabah || !!(eski && eski.aksam) !== yeni.aksam ||
        (eski ? eski.aciklama : '') !== yeni.aciklama;
      const ogr = await depo.kullanicilar.bul(ogrenciId);
      if (degisti && servis.sofor_id && ogr) {
        const hangi = yeni.sabah && yeni.aksam ? 'sabah ve akşam' : yeni.sabah ? 'sabah' : 'akşam';
        const metin = yeni.sabah || yeni.aksam
          ? ogr.fullName + ' ' + tarihYazisi(tarih) + ' ' + hangi + ' servise binmeyecek.' +
            (yeni.aciklama ? ' Velinin notu: ' + yeni.aciklama + (/[.!?…]$/.test(yeni.aciklama) ? '' : '.') : '')
          : ogr.fullName + ' için ' + tarihYazisi(tarih) + ' "binmeyecek" işareti kaldırıldı.';
        await cokluBildirim([{ kime: servis.sofor_id, metin, baglanti: '#/ana' }], { veliye: false });
      }
      return ok(res, { binmeyecek: yeni.sabah || yeni.aksam ? { tarih, sabah: yeni.sabah, aksam: yeni.aksam, not: yeni.aciklama } : null,
        message: yeni.sabah || yeni.aksam ? 'Kaydedildi; servisçiye haber gitti.' : 'İşaret kaldırıldı.' });
    }

    /* ---------- servisçi: sefer ve konum ---------- */
    if (alt === 'seferim' && method === 'GET') {
      if (me.role !== 'servisci') return bad(res, 'Bu sayfa servisçiler içindir', 403);
      const servisler = await depo.okulHayati.soforunServisleri(me.id);
      const okul = await depo.okullar.bul(me.schoolId);
      const liste = [];
      for (const s of servisler) {
        const sf = await surenSefer(s.id, okul);
        const ogrenciler = (await depo.okulHayati.servisinOgrencileri(s.id))
          .map(o => ({ ad: o.ad, sinif: o.sinif || '', durak: o.durak, ev: o.enlem !== null && o.enlem !== undefined
            ? { enlem: Number(o.enlem), boylam: Number(o.boylam) } : null }))
          .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));
        liste.push({ id: s.id, ad: s.ad, plaka: s.plaka, sabah: s.sabah, aksam: s.aksam, ogrenciler,
          sefer: sf ? { id: sf.id, yon: sf.yon, baslangic: sf.baslangic } : null });
      }
      return ok(res, { servisler: liste, okul: okul ? { ad: okul.name, enlem: okul.enlem, boylam: okul.boylam } : null });
    }

    /* Sefer yalnız servis saatinde başlar; yönü dönemden gelir (sabah okula
       gidiş, akşam eve dönüş). Sürmekte olan sefer varsa o döner. */
    if (alt === 'sefer-basla' && method === 'POST') {
      if (me.role !== 'servisci') return bad(res, 'Seferi servisçi başlatır', 403);
      const s = await depo.okulHayati.servisBul(clean(body.servisId, 60));
      if (!s || s.sofor_id !== me.id) return bad(res, 'Bu servis sana atanmamış', 403);
      const okul = await depo.okullar.bul(s.okul_id);
      const p = pencere.servisPenceresi(okul);
      if (!p.donem) {
        return sendJSON(res, 409, { error: 'Sefer yalnız servis saatlerinde başlar: ' + pencere.aralikMetni(p.saatler) + '.', aralikDisi: true,
          sonraki: p.sonraki });
      }
      const gunSatiri = await depo.servisYoklama.gun(s.id, p.tarih, p.donem);
      if (gunSatiri && gunSatiri.bitti) return sendJSON(res, 409, { error: bittiMetni(p.donem), kapandi: true });
      const { sefer, yeni } = await seferAc(s, okul, me.id, p.donem);
      const bayat = !!(gunSatiri && gunSatiri.basladi) && !araliktaBasladi(p, { tarih: p.tarih, donem: p.donem }, gunSatiri);
      await depo.servisYoklama.gunBasladi(s.id, p.tarih, p.donem, bayat);
      onbellekSil(s.id);
      const cevap = { sefer: { id: sefer.id, yon: sefer.yon }, donem: p.donem, bekleyen: 0,
        message: yeni ? 'Sefer başladı. Konumun servisteki öğrencilere ve velilerine görünüyor.' : 'Sefer zaten sürüyor.' };
      /* Akşam: serviste ("Geldi") kaç öğrenci var? Hiç yoksa sefer kendiliğinden
         bitmez (bitiş son öğrencinin "İndi"siyle); servisçi uyarılır. */
      if (p.donem === 'aksam') {
        const ogrenciler = await depo.okulHayati.servisinOgrencileri(s.id);
        const yok = await depo.servisYoklama.yoklamalar(ogrenciler.map(o => o.ogrenci_id), p.tarih, p.donem);
        cevap.bekleyen = ogrenciler.filter(o => !yok.get(o.ogrenci_id)).length;
        cevap.serviste = ogrenciler.filter(o => { const y = yok.get(o.ogrenci_id); return !!y && y.durum === 'geldi'; }).length;
        if (!cevap.serviste) cevap.message += ' "Geldi" işaretli öğrenci yok; sefer kendiliğinden bitmez. Bitince "Seferi bitir"e bas.';
      }
      return ok(res, cevap);
    }

    if (alt === 'konum' && method === 'POST') {
      if (me.role !== 'servisci') return bad(res, 'Konumu servisçi gönderir', 403);
      if (!hizSinir('servisKonum:' + me.id, 60, 60 * 1000)) return bad(res, 'Konum çok sık gönderiliyor.', 429);
      const r = await seferKonumuYaz(me, body);
      /* Bu uç (tarayıcı) bilinmeyen seferde de 409 döner (sayfa gönderimi durdurur). */
      if (r.durum !== 200) return bad(res, r.hata, r.durum === 404 ? 409 : r.durum);
      return ok(res);
    }

    if (alt === 'sefer-bitir' && method === 'POST') {
      if (me.role !== 'servisci') return bad(res, 'Seferi servisçi bitirir', 403);
      const sefer = await depo.okulHayati.seferBul(clean(body.seferId, 60));
      const n = await depo.okulHayati.seferBitir(clean(body.seferId, 60), me.id);
      if (sefer) onbellekSil(sefer.servis_id);
      return ok(res, { message: n ? 'Sefer bitti; konumun artık paylaşılmıyor.' : 'Sefer zaten bitmiş.' });
    }

    if (method === 'POST' && !yonetir) return bad(res, 'Servisleri düzenleme yetkin yok', 403);

    /* Okulun servis saatleri (müdür ve servis.yonet yetkilisi). */
    if (alt === 'saatler' && method === 'POST') {
      const s = {};
      for (const a of ['sabahBas', 'sabahBit', 'aksamBas', 'aksamBit']) s[a] = saatDuzelt(clean(body[a], 10)) || '';
      const sorun = pencere.saatlerSorunu(s);
      if (sorun) return bad(res, sorun);
      await depo.okullar.servisSaatleriYaz(me.schoolId, s);
      await islemYaz(me, 'servis.saatler', pencere.aralikMetni(s), req);
      await servisTemizle();
      return ok(res, { saatler: s, message: 'Servis saatleri kaydedildi.' });
    }

    if (alt === 'kaydet' && method === 'POST') {
      const id = clean(body.id, 60);
      if (id) {
        const eski = await depo.okulHayati.servisBul(id);
        if (!eski || eski.okul_id !== me.schoolId) return bad(res, 'Servis bulunamadı', 404);
      }
      const ad = clean(body.ad, 60);
      if (!ad) return bad(res, 'Servisin adını yaz (ör. 1. Servis, Konyaaltı hattı)');
      if (await depo.okulHayati.servisAdVarMi(me.schoolId, ad, id)) return bad(res, 'Bu adda bir servis zaten var');
      const plaka = clean(body.plaka, 15).toLocaleUpperCase('tr').replace(/\s+/g, ' ');
      if (plaka && !/^[0-9A-ZÇĞİÖŞÜ ]{4,15}$/.test(plaka)) return bad(res, 'Plakayı 07 ABC 123 biçiminde yaz');
      const st = telefonAl(body.soforTel, 'Şoför');
      if (st.hata) return bad(res, st.hata);
      const rt = telefonAl(body.rehberTel, 'Rehber');
      if (rt.hata) return bad(res, rt.hata);
      const sabah = clean(body.sabah, 10) ? saatDuzelt(clean(body.sabah, 10)) : '';
      const aksam = clean(body.aksam, 10) ? saatDuzelt(clean(body.aksam, 10)) : '';
      if (sabah === null || aksam === null) return bad(res, 'Saati 07:30 biçiminde yaz');
      const s = { id: id || uid('sv'), okulId: me.schoolId, ad, plaka, sofor: clean(body.sofor, 80), soforTel: st.deger,
        rehber: clean(body.rehber, 80), rehberTel: rt.deger, sabah: sabah || '', aksam: aksam || '', guzergah: clean(body.guzergah, 500) };
      /* Servisçi (şoför hesabı): boş ya da bu okulun servisçisi. */
      let soforId;
      if (body.soforId !== undefined) {
        soforId = clean(body.soforId, 60);
        if (soforId) {
          const sf = await depo.kullanicilar.bul(soforId);
          if (!sf || sf.role !== 'servisci' || sf.schoolId !== me.schoolId) return bad(res, 'Servisçi bulunamadı');
        }
      }
      const n = await depo.okulHayati.servisKaydet(s, !id);
      if (!n) return bad(res, 'Bu adda bir servis zaten var');
      if (soforId !== undefined) await depo.okulHayati.servisSoforYaz(s.id, me.schoolId, soforId || null);
      return ok(res, { id: s.id, message: id ? 'Servis güncellendi.' : 'Servis eklendi.' });
    }

    if (alt === 'sil' && method === 'POST') {
      const n = await depo.okulHayati.servisSil(clean(body.id, 60), me.schoolId);
      if (!n) return bad(res, 'Servis bulunamadı', 404);
      return ok(res, { message: 'Servis silindi; öğrencilerinin servis kaydı kalktı.' });
    }

    if (alt === 'ogrenci' && method === 'POST') {
      const servis = await depo.okulHayati.servisBul(clean(body.servisId, 60));
      if (!servis || servis.okul_id !== me.schoolId) return bad(res, 'Servis bulunamadı', 404);
      const n = await depo.okulHayati.servisOgrenciYaz(servis.id, clean(body.ogrenciId, 60), clean(body.durak, 120));
      if (!n) return bad(res, 'Öğrenci bulunamadı', 404);
      onbellekSil();   // öğrenci başka servisten taşınmış olabilir
      return ok(res, { message: 'Öğrenci ' + servis.ad + ' servisine yazıldı.' });
    }

    if (alt === 'ogrenci-cikar' && method === 'POST') {
      const n = await depo.okulHayati.servisOgrenciCikar(clean(body.ogrenciId, 60), me.schoolId);
      if (!n) return bad(res, 'Öğrenci bu okulun bir servisinde değil', 404);
      onbellekSil();
      return ok(res, { message: 'Öğrenci servisten çıkarıldı.' });
    }
  }

  /* ======================= kulüpler ======================= */
  if (p === 'kulupler') {
    const yonetir = !!me.schoolId && (me.role === 'teacher' || me.role === 'principal') && yetkiVarMi(me, 'kulup.yonet');
    const kulupAl = async id => {
      const u = await depo.okulHayati.kulupBul(clean(id, 60));
      return u && u.okul_id === me.schoolId && me.role !== 'parent' ? u : null;
    };
    const uyeleriGorur = u => yonetir || u.danisman_id === me.id;

    if (!alt && method === 'GET') {
      const cevap = { yonetir, kulupler: [], cocuklar: [] };
      if (me.schoolId && me.role !== 'parent') {
        const liste = await depo.okulHayati.okulunKulupleri(me.schoolId);
        const benim = me.role === 'student'
          ? new Set((await depo.okulHayati.ogrencilerinKulupleri([me.id])).map(r => r.kulup_id)) : new Set();
        cevap.kulupler = liste.map(u => Object.assign(kulupGorunumu(u), {
          uyesin: benim.has(u.id), uyeleriGorur: uyeleriGorur(u)
        }));
      }
      const cc = await cocuklar(me);
      if (cc.length) {
        const uyelik = await depo.okulHayati.ogrencilerinKulupleri(cc.map(c => c.id));
        cevap.cocuklar = cc.map(c => ({ ad: c.fullName, kulupler: uyelik.filter(r => r.ogrenci_id === c.id)
          .map(r => ({ ad: r.ad, gunSaat: r.gun_saat, danisman: r.danisman_adi || '' })) }));
      }
      if (yonetir) {
        cevap.ogretmenler = (await depo.kullanicilar.okulun(me.schoolId, { roller: ['teacher', 'principal'], durum: 'approved' }))
          .map(t => ({ id: t.id, ad: t.fullName })).sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));
      }
      return ok(res, cevap);
    }

    if (alt === 'uyeler' && method === 'GET') {
      const u = await kulupAl(q.get('id'));
      if (!u) return bad(res, 'Kulüp bulunamadı', 404);
      if (!uyeleriGorur(u)) return bad(res, 'Üye listesini yalnızca yönetim ve danışman öğretmen görür', 403);
      const uyeler = (await depo.okulHayati.kulupUyeleri(u.id))
        .map(r => ({ id: r.id, ad: r.ad, sinif: r.sinif || '', tarih: r.tarih }))
        .sort((a, b) => a.sinif.localeCompare(b.sinif, 'tr') || a.ad.localeCompare(b.ad, 'tr'));
      const uye = new Set(uyeler.map(x => x.id));
      const adaylar = (await okulOgrencileri(me.schoolId)).filter(o => !uye.has(o.id));
      return ok(res, { kulup: kulupGorunumu(u), uyeler, adaylar });
    }

    if ((alt === 'katil' || alt === 'ayril') && method === 'POST') {
      if (me.role !== 'student') return bad(res, 'Kulübe öğrenci kendisi katılır', 403);
      const u = await kulupAl(body.id);
      if (!u) return bad(res, 'Kulüp bulunamadı', 404);
      if (alt === 'ayril') {
        const n = await depo.okulHayati.uyeCikar(u.id, me.id, true);
        if (!n) return bad(res, u.basvuru_acik ? 'Bu kulübün üyesi değilsin' : 'Kulüp değişikliği kapalı; danışman öğretmenine başvur.');
        return ok(res, { message: u.ad + ' kulübünden ayrıldın.' });
      }
      const sonuc = await depo.okulHayati.uyeEkle(u.id, me.id, true);
      if (sonuc === 'tamam') return ok(res, { message: u.ad + ' kulübüne katıldın.' });
      return bad(res, { zaten: 'Zaten bu kulübün üyesisin', dolu: 'Kulübün kontenjanı dolu', kapali: 'Bu kulübe başvuru kapalı' }[sonuc] ||
        'Kulüp bulunamadı');
    }

    if ((alt === 'uye-ekle' || alt === 'uye-cikar') && method === 'POST') {
      const u = await kulupAl(body.id);
      if (!u) return bad(res, 'Kulüp bulunamadı', 404);
      if (!uyeleriGorur(u)) return bad(res, 'Bu kulübün üyelerini düzenleme yetkin yok', 403);
      const ogrenciId = clean(body.ogrenciId, 60);
      if (alt === 'uye-cikar') {
        const n = await depo.okulHayati.uyeCikar(u.id, ogrenciId, false);
        if (!n) return bad(res, 'Öğrenci bu kulübün üyesi değil', 404);
        return ok(res, { message: 'Öğrenci kulüpten çıkarıldı.' });
      }
      const sonuc = await depo.okulHayati.uyeEkle(u.id, ogrenciId, false);
      if (sonuc === 'tamam') return ok(res, { message: 'Öğrenci kulübe eklendi.' });
      if (sonuc === 'yok') return bad(res, 'Öğrenci bulunamadı', 404);
      return bad(res, sonuc === 'dolu' ? 'Kulübün kontenjanı dolu' : 'Öğrenci zaten bu kulübün üyesi');
    }

    if (method === 'POST' && !yonetir) return bad(res, 'Kulüpleri düzenleme yetkin yok', 403);

    if (alt === 'kaydet' && method === 'POST') {
      const id = clean(body.id, 60);
      if (id && !await kulupAl(id)) return bad(res, 'Kulüp bulunamadı', 404);
      const ad = clean(body.ad, 80);
      if (!ad) return bad(res, 'Kulübün adını yaz');
      if (await depo.okulHayati.kulupAdVarMi(me.schoolId, ad, id)) return bad(res, 'Bu adda bir kulüp zaten var');
      let danismanId = clean(body.danismanId, 60);
      if (danismanId) {
        const d = await depo.kullanicilar.bul(danismanId);
        if (!d || d.schoolId !== me.schoolId || (d.role !== 'teacher' && d.role !== 'principal') || d.status !== 'approved') {
          return bad(res, 'Danışman bu okulun öğretmeni olmalı');
        }
      } else danismanId = '';
      let kontenjan = parseInt(clean(body.kontenjan, 10), 10);
      if (!kontenjan) kontenjan = 0;
      if (kontenjan < 0 || kontenjan > 1000) return bad(res, 'Kontenjan 1-1000 arası olmalı (boş: sınırsız)');
      const u = { id: id || uid('kl'), okulId: me.schoolId, ad, aciklama: clean(body.aciklama, 1000), danismanId,
        kontenjan, basvuruAcik: body.basvuruAcik !== false, gunSaat: clean(body.gunSaat, 60) };
      const n = await depo.okulHayati.kulupKaydet(u, !id);
      if (!n) return bad(res, 'Bu adda bir kulüp zaten var');
      return ok(res, { id: u.id, message: id ? 'Kulüp güncellendi.' : 'Kulüp açıldı.' });
    }

    if (alt === 'sil' && method === 'POST') {
      const n = await depo.okulHayati.kulupSil(clean(body.id, 60), me.schoolId);
      if (!n) return bad(res, 'Kulüp bulunamadı', 404);
      return ok(res, { message: 'Kulüp silindi.' });
    }
  }

  return false;
}

module.exports = { uclar, haftaBasi, seferKonumuYaz, servisTemizle, surenSefer, onbellekSil };
