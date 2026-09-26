'use strict';
/* Okul hayatı: yemek listesi (/api/yemek), servisler (/api/servis),
   kulüpler (/api/kulupler).

   Görme kuralları:
     yemek   — okuldaki herkes; veli (ve çocuğu olan öğretmen) çocuğunun okulunu
     servis  — yönetim bütün servisleri; öğrenci kendi servisini; veli
               yalnızca çocuğunun servisini (şoför telefonu dahil) görür
     kulüp   — okuldaki herkes kulüp listesini; üye listesini yalnızca yönetim
               ve kulübün danışman öğretmeni; veli çocuğunun kulüplerini
   Düzenleme müdüre ve ilgili yetkisi verilmiş öğretmene açık. */

const { hizSinir } = require('../guvenlik');
const { bad, ok } = require('../http');
const { saatDuzelt } = require('../iliskiler');
const { clean, normTelefon, telefonSorunu, uid } = require('../ortak');
const { depo, cokluBildirim } = require('../veri');
const { yetkiVarMi } = require('../yetki');
const { islemYaz } = require('./islem-kaydi');

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

/* Seferdeki öğrencilerin listesi kısa süre bellekte tutulur: her konum
   güncellemesinde (birkaç saniyede bir) veritabanına gidilmesin. */
const seferOgrencileri = new Map();   // seferId -> { bitis, liste }
async function seferinOgrencileri(sefer) {
  const k = seferOgrencileri.get(sefer.id);
  if (k && k.bitis > Date.now()) return k.liste;
  const liste = await depo.okulHayati.servisinOgrencileri(sefer.servis_id);
  seferOgrencileri.set(sefer.id, { bitis: Date.now() + 60 * 1000, liste });
  if (seferOgrencileri.size > 500) for (const [id, v] of seferOgrencileri) if (v.bitis < Date.now()) seferOgrencileri.delete(id);
  return liste;
}

/* Konum geldi: yaklaşan evler için (500 m, 100 m) öğrenciye ve velilerine bildirim. */
async function yaklasmaBildir(sefer, konum) {
  const liste = await seferinOgrencileri(sefer);
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
      if (me.role === 'student') {
        const s = (await depo.okulHayati.ogrencilerinServisi([me.id]))[0];
        cevap.benim = s ? servisGorunumu(s) : null;
      }
      const cc = await cocuklar(me);
      if (cc.length) {
        const servisleri = new Map((await depo.okulHayati.ogrencilerinServisi(cc.map(c => c.id))).map(s => [s.ogrenci_id, s]));
        cevap.cocuklar = cc.map(c => ({ id: c.id, ad: c.fullName, servis: servisleri.has(c.id) ? servisGorunumu(servisleri.get(c.id)) : null }));
      }
      if (yonetir) {
        const [servisler, ogrenciler] = await Promise.all([
          depo.okulHayati.okulunServisleri(me.schoolId), depo.okulHayati.servisOgrencileri(me.schoolId)]);
        cevap.servisler = servisler.map(s => Object.assign({ id: s.id, ogrenciSayisi: s.ogrenci_sayisi,
          soforId: s.sofor_id || '', soforAdi: s.sofor_hesap_adi || '' }, servisGorunumu(s), {
          ogrenciler: ogrenciler.filter(o => o.servis_id === s.id)
            .map(o => ({ id: o.ogrenci_id, ad: o.ad, sinif: o.sinif || '', durak: o.durak }))
            .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'))
        }));
        cevap.okulOgrencileri = await okulOgrencileri(me.schoolId);
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
      let sefer = null;
      if (servis) {
        const s = await depo.okulHayati.acikSefer(servis.id);
        if (s) {
          const taze = !!s.sofor_id && s.son_konum && Date.now() - Date.parse(s.son_konum) < KONUM_TAZE_MS;
          sefer = { yon: s.yon, baslangic: s.baslangic, sonKonum: s.son_konum,
            konum: taze ? { enlem: s.son_enlem, boylam: s.son_boylam, dogruluk: s.son_dogruluk } : null };
        }
      }
      return ok(res, {
        ogrenci: y.st.fullName,
        okul: okul ? { ad: okul.name, enlem: okul.enlem, boylam: okul.boylam } : null,
        ev: ev ? { enlem: ev.enlem, boylam: ev.boylam } : null,
        servis: servis ? servisGorunumu(servis) : null,
        sefer, evDuzenleyebilir: y.evDuzenle
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

    /* ---------- servisçi: sefer ve konum ---------- */
    if (alt === 'seferim' && method === 'GET') {
      if (me.role !== 'servisci') return bad(res, 'Bu sayfa servisçiler içindir', 403);
      const servisler = await depo.okulHayati.soforunServisleri(me.id);
      const okul = await depo.okullar.bul(me.schoolId);
      const liste = [];
      for (const s of servisler) {
        const sf = await depo.okulHayati.acikSefer(s.id);
        const ogrenciler = (await depo.okulHayati.servisinOgrencileri(s.id))
          .map(o => ({ ad: o.ad, sinif: o.sinif || '', durak: o.durak, ev: o.enlem !== null && o.enlem !== undefined
            ? { enlem: Number(o.enlem), boylam: Number(o.boylam) } : null }))
          .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));
        liste.push({ id: s.id, ad: s.ad, plaka: s.plaka, sabah: s.sabah, aksam: s.aksam, ogrenciler,
          sefer: sf ? { id: sf.id, yon: sf.yon, baslangic: sf.baslangic } : null });
      }
      return ok(res, { servisler: liste, okul: okul ? { ad: okul.name, enlem: okul.enlem, boylam: okul.boylam } : null });
    }

    if (alt === 'sefer-basla' && method === 'POST') {
      if (me.role !== 'servisci') return bad(res, 'Seferi servisçi başlatır', 403);
      const s = await depo.okulHayati.servisBul(clean(body.servisId, 60));
      if (!s || s.sofor_id !== me.id) return bad(res, 'Bu servis sana atanmamış', 403);
      const yon = clean(body.yon, 10) === 'donus' ? 'donus' : 'gidis';
      const id = uid('sf');
      await depo.okulHayati.seferBaslat({ id, servisId: s.id, soforId: me.id, yon });
      return ok(res, { sefer: { id, yon }, message: 'Sefer başladı. Konumun servisteki öğrencilere ve velilerine görünüyor.' });
    }

    if (alt === 'konum' && method === 'POST') {
      if (me.role !== 'servisci') return bad(res, 'Konumu servisçi gönderir', 403);
      if (!hizSinir('servisKonum:' + me.id, 60, 60 * 1000)) return bad(res, 'Konum çok sık gönderiliyor.', 429);
      const k = koordinatAl(body);
      if (!k) return bad(res, 'Konum anlaşılmadı');
      const dogruluk = sayiAl(body.dogruluk);
      const d = isFinite(dogruluk) && dogruluk >= 0 ? Math.min(dogruluk, 100000) : null;
      const sefer = await depo.okulHayati.seferBul(clean(body.seferId, 60));
      if (!sefer || sefer.sofor_id !== me.id || sefer.bitis) return bad(res, 'Sefer bitmiş ya da sana ait değil', 409);
      await depo.okulHayati.seferKonumYaz(sefer.id, me.id, k.enlem, k.boylam, d);
      if (d !== null && d <= EN_KOTU_DOGRULUK) await yaklasmaBildir(sefer, k);
      return ok(res);
    }

    if (alt === 'sefer-bitir' && method === 'POST') {
      if (me.role !== 'servisci') return bad(res, 'Seferi servisçi bitirir', 403);
      const n = await depo.okulHayati.seferBitir(clean(body.seferId, 60), me.id);
      seferOgrencileri.delete(clean(body.seferId, 60));
      return ok(res, { message: n ? 'Sefer bitti; konumun artık paylaşılmıyor.' : 'Sefer zaten bitmiş.' });
    }

    if (method === 'POST' && !yonetir) return bad(res, 'Servisleri düzenleme yetkin yok', 403);

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
      return ok(res, { message: 'Öğrenci ' + servis.ad + ' servisine yazıldı.' });
    }

    if (alt === 'ogrenci-cikar' && method === 'POST') {
      const n = await depo.okulHayati.servisOgrenciCikar(clean(body.ogrenciId, 60), me.schoolId);
      if (!n) return bad(res, 'Öğrenci bu okulun bir servisinde değil', 404);
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

module.exports = { uclar, haftaBasi };
