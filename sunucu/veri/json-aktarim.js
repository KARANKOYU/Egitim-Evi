'use strict';
/* JSON <-> veritabanı.

   iceAktar(veri): eski data/db.json dosyasını ya da bir yedek dosyasını
   veritabanına yazar. Önce bütün tablolar boşaltılır; hepsi tek işlemdedir,
   yarıda hata olursa hiçbir şey değişmez.
   disaAktar(): bütün veriyi aynı biçimde (users, schools, assignments...)
   tek bir nesneye döker. Yedekler bu biçimde saklanır; elle okunabilir ve
   eski sürümün yedekleri de geri yüklenebilir.

   Eski veride kopuk bağlantılar olabilir (silinmiş bir öğretmenin ödevi,
   silinmiş bir sınıfın dersi). Yabancı anahtar kuralları bunları kabul
   etmeyeceği için aktarım sırasında temizlenir: kopuk yazar bağı boşa
   düşer, kopuk "sahip" bağı olan kayıt atlanır. Kaç kaydın atlandığı
   rapor edilir. */

const crypto = require('crypto');
const { sorgu, islem, metinCalistir } = require('./baglanti');
const { ESKI_SAATLER, kisaAdSorunu, kullaniciAdiSorunu, makeCode, normTelefon, okulHesabiMi, tcSorunu, uid } = require('../ortak');
const e = require('./esleme');
const yaz = require('./yazici');

const TABLOLAR = [
  'okullar', 'egitim_yillari', 'siniflar', 'roller', 'rol_yetkileri', 'rol_yetki_kapsamlari',
  'kullanicilar', 'mesaj_engelleri', 'veli_baglari', 'dersler', 'ders_programi',
  'odevler', 'odev_siniflari', 'odev_ogrencileri',
  'sinav_sablonlari', 'sablon_olcumleri', 'sinav_gruplari', 'sinavlar', 'sinav_olcumleri', 'sinav_degerleri',
  'devamsizlik', 'mesajlar', 'mesaj_alicilari', 'mesaj_okumalari', 'takvim_etkinlikleri',
  'bildirimler', 'oturumlar', 'hatirlatmalar', 'islem_kaydi',
  'anketler', 'anket_secenekleri', 'anket_hedefleri', 'anket_oylari',
  'yemek_listesi', 'servisler', 'servis_ogrencileri', 'kulupler', 'kulup_uyeleri', 'odev_dosyalari',
  'ogrenci_konumlari', 'etutler', 'etut_ogrencileri', 'etut_yoklamalari', 'okul_sayfalari', 'okul_fotolari', 'yorumlar',
  'ogrenci_gecmisi', 'okul_kapali_ozellikler', 'hatirlaticilar', 'hatirlatici_gunleri',
  /* Eğitim Evi Aile: 7 günlük geçici veri; yedeğe ve dışarı aktarıma girmez, içeri
     aktarımda boşaltılır. */
  'aile_cihazlari', 'aile_konumlari', 'aile_kullanim', 'aile_ayarlari', 'aile_sinirlari', 'aile_uyarilari'
];

/* ---------- küçük doğrulayıcılar ---------- */
const dizi = v => Array.isArray(v) ? v : [];
const metin = (v, max) => String(v === null || v === undefined ? '' : v).slice(0, max || 10000);
const gun = v => {
  const s = String(v || '').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s + 'T00:00:00Z')) ? s : null;
};
const saat = v => {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(v || ''));
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return null;
  return (m[1].length === 1 ? '0' : '') + m[1] + ':' + m[2];
};
const dakika = s => { const p = s.split(':'); return Number(p[0]) * 60 + Number(p[1]); };
const zaman = v => {
  const t = Date.parse(v);
  return isNaN(t) ? new Date().toISOString() : new Date(t).toISOString();
};
const secim = (v, liste, varsayilan) => liste.indexOf(v) >= 0 ? v : varsayilan;
const sayi = v => (typeof v === 'number' && isFinite(v)) ? v : (isFinite(Number(v)) && v !== '' && v !== null ? Number(v) : null);

/* Tablo ve sütun adları koddan gelir; yazici adları yine de doğrular. */
const ekle = (tablo, satir) => yaz.ekle(tablo, satir);

/* ================================================================== */
async function iceAktar(veri) {
  if (!veri || !Array.isArray(veri.users)) throw new Error('Veri geçerli değil (kullanıcı listesi yok)');
  const atlanan = {};
  const atla = ad => { atlanan[ad] = (atlanan[ad] || 0) + 1; };

  await islem(async () => {
    /* Telefon bildirimi abonelikleri yedekte yok (cihaza özel, kısa ömürlü) ama
       kullanıcılara bağlı oldukları için TRUNCATE ... CASCADE onları da siler.
       Önce okunur, geri yüklemeden sonra hâlâ var olan kişiler için geri yazılır;
       yoksa geri yüklemeden sonra bütün cihazlarda bildirimler sessizce kesilirdi. */
    const abonelikler = await sorgu('SELECT * FROM push_abonelikleri');
    await metinCalistir('TRUNCATE ' + TABLOLAR.join(', ') + ' RESTART IDENTITY CASCADE');

    /* --- okullar --- */
    const okul = new Set();
    const mebGorulen = new Set();
    const kisaAdlar = new Set();
    const koordinat = (v, sinir) => (typeof v === 'number' && isFinite(v) && Math.abs(v) <= sinir) ? v : null;
    for (const s of dizi(veri.schools)) {
      if (!s || !s.id || okul.has(s.id)) { atla('okul'); continue; }
      const durum = secim(s.status, ['pending', 'approved', 'rejected'], 'pending');
      let meb = metin(s.mebId, 40);
      if (meb && durum !== 'rejected') { if (mebGorulen.has(meb)) meb = ''; else mebGorulen.add(meb); }
      /* Okul adresi geçerli ve tekse korunur; değilse açılışta yeniden önerilir. */
      const kisa = metin(s.kisaAd, 40);
      const kisaYaz = kisa && !kisaAdSorunu(kisa) && !kisaAdlar.has(kisa) ? kisa : null;
      if (kisaYaz) kisaAdlar.add(kisaYaz);
      const enlem = koordinat(s.enlem, 90), boylam = koordinat(s.boylam, 180);
      await ekle('okullar', { id: s.id, meb_kodu: meb, ad: metin(s.name, 140) || 'Adsız okul',
        il: metin(s.city, 60), ilce: metin(s.district, 60), tur: metin(s.type, 60), durum,
        kisa_ad: kisaYaz, enlem: enlem !== null && boylam !== null ? enlem : null,
        boylam: enlem !== null && boylam !== null ? boylam : null,
        olusturma: zaman(s.createdAt) });
      okul.add(s.id);
    }

    /* --- eğitim yılları (okul başına tek aktif) --- */
    const yil = new Set();
    const aktifOkul = new Set();
    for (const y of dizi(veri.egitimYillari)) {
      if (!y || !y.id || !okul.has(y.schoolId) || !/^\d{4}-\d{4}$/.test(String(y.ad))) { atla('yil'); continue; }
      const aktif = !!y.aktif && !aktifOkul.has(y.schoolId);
      if (aktif) aktifOkul.add(y.schoolId);
      const [b, t] = String(y.ad).split('-');
      await ekle('egitim_yillari', { id: y.id, okul_id: y.schoolId, ad: y.ad,
        baslangic: gun(y.bas) || b + '-09-01', bitis: gun(y.bit) || t + '-06-30', aktif,
        olusturma: zaman(y.createdAt) });
      yil.add(y.id);
    }
    const yilId = v => yil.has(v) ? v : null;

    /* --- sınıflar --- */
    const sinif = new Set();
    const sinifAd = new Set();
    for (const c of dizi(veri.classes)) {
      const anahtar = c && (c.schoolId + '|' + c.name);
      if (!c || !c.id || !okul.has(c.schoolId) || !c.name || sinifAd.has(anahtar)) { atla('sinif'); continue; }
      await ekle('siniflar', { id: c.id, okul_id: c.schoolId, ad: metin(c.name, 30), olusturma: zaman(c.createdAt) });
      sinif.add(c.id); sinifAd.add(anahtar);
    }

    /* --- roller, yetkileri ve kapsamları --- */
    const rol = new Set(), ogretmenRoluOlan = new Set();
    for (const r of dizi(veri.roles)) {
      if (!r || !r.id || !okul.has(r.schoolId) || !r.name) { atla('rol'); continue; }
      /* Hazır Öğretmen rolü okul başına tek (013). */
      const tur = r.tur === 'ogretmen' && !ogretmenRoluOlan.has(r.schoolId) ? 'ogretmen' : 'ozel';
      if (tur === 'ogretmen') ogretmenRoluOlan.add(r.schoolId);
      await ekle('roller', { id: r.id, okul_id: r.schoolId, ad: metin(r.name, 60), tur, olusturma: zaman(r.createdAt) });
      rol.add(r.id);
      for (const izin of new Set(dizi(r.permissions).map(String))) {
        await ekle('rol_yetkileri', { rol_id: r.id, yetki: izin });
        const k = r.kapsam && r.kapsam[izin];
        if (!k) continue;
        for (const d of new Set(dizi(k.dersler).map(String))) {
          await ekle('rol_yetki_kapsamlari', { rol_id: r.id, yetki: izin, tur: 'ders', deger: d });
        }
        for (const s of new Set(dizi(k.siniflar).map(String))) {
          await ekle('rol_yetki_kapsamlari', { rol_id: r.id, yetki: izin, tur: 'sinif', deger: s });
        }
      }
    }

    /* --- kullanıcılar (olusturan bağı ikinci geçişte) --- */
    const kisi = new Set();
    const eposta = new Set();
    const kod = new Set();
    const kullaniciAdlari = new Set();   // ad alanı + '|' + ad
    const tcler = new Set();             // ad alanı + '|' + T.C.
    const okulNolari = new Set();
    const ogrenciOkulu = new Map();      // öğrenci id -> okul id (servis, kulüp üyeliği denetimi)
    const servisciOkulu = new Map();
    const personelOkulu = new Map();     // öğretmen/müdür id -> okul id (etüt öğretmeni denetimi)
    /* Kullanıcı adı ve T.C. okul hesaplarında okul içinde, ötekilerde kendi
       aralarında tektir (009 şema dosyası). Yedekte ad varsa korunur; eski
       veride yoksa e-postanın @ öncesinden türetilir. */
    const adAlani = (rolAd, okulId) => okulHesabiMi(rolAd) ? (okulId || '') : '';
    /* Öğrencinin T.C. no'su bütün sistemde tek (hesap kişiye ait, 021). */
    const tcAlani = (rolAd, okulId) => rolAd === 'student' ? 'ogrenci' : adAlani(rolAd, okulId);
    const kullaniciAdiUret = (ep, var_, alan, tc) => {
      const hazir = String(var_ || '').trim().toLowerCase();
      const gecerli = hazir && (!kullaniciAdiSorunu(hazir) || (/^[0-9]{11}$/.test(hazir) && hazir === tc));
      if (gecerli && !kullaniciAdlari.has(alan + '|' + hazir)) {
        kullaniciAdlari.add(alan + '|' + hazir);
        return hazir;
      }
      let kok = String(ep || 'kullanici').split('@')[0].replace(/[^a-z0-9._]/g, '').replace(/^[^a-z]+/, '');
      if (kok.length < 3) kok = 'kullanici' + kok;
      kok = kok.slice(0, 24);
      let aday = kok;
      for (let n = 2; kullaniciAdlari.has(alan + '|' + aday); n++) aday = kok + n;
      kullaniciAdlari.add(alan + '|' + aday);
      return aday;
    };
    /* Okul rolü satırları (yetişkin hesabına bağlı öğretmen/müdür) bağlı
       oldukları hesaptan sonra yazılır (yabancı anahtar). */
    const yetiskinler = new Set();
    const rolOkul = new Set();
    const siraliKullanicilar = dizi(veri.users).slice()
      .sort((a, b) => (a && a.anaHesapId ? 1 : 0) - (b && b.anaHesapId ? 1 : 0));
    for (const u of siraliKullanicilar) {
      if (!u || !u.id || kisi.has(u.id)) { atla('kullanici'); continue; }
      /* Rol boşsa hesap rolsüzdür (okul henüz eklememiş); bilinmeyen rol atlanır. */
      const rolAd = u.role ? secim(u.role, ['admin', 'principal', 'teacher', 'student', 'parent', 'servisci'], null) : null;
      if (u.role && !rolAd) { atla('kullanici'); continue; }
      const ep = metin(u.email, 200).trim().toLowerCase();
      const okulId = okul.has(u.schoolId) ? u.schoolId : null;
      /* Okul rolü satırı: bağlı olduğu yetişkin hesabı yüklenmiş olmalı; yalnızca
         öğretmen ya da müdür, okullu, e-postasız, okul başına bir tane. */
      let anaId = null;
      if (u.anaHesapId) {
        if (!yetiskinler.has(u.anaHesapId) || (rolAd !== 'teacher' && rolAd !== 'principal') || !okulId || ep ||
            rolOkul.has(u.anaHesapId + '|' + okulId)) { atla('kullanici'); continue; }
        anaId = u.anaHesapId;
        rolOkul.add(anaId + '|' + okulId);
      }
      /* E-postasız hesap (okulun açtığı küçük öğrenci) kullanıcı adıyla girer. */
      if ((!ep && !u.username) || (ep && eposta.has(ep)) ||
        (rolAd && !okulId && rolAd !== 'admin' && rolAd !== 'parent')) {
        atla('kullanici'); continue;
      }
      const tel = normTelefon(u.phone || '');
      /* Veli kodu yeni biçimdeyse (10 karakter büyük harf + rakam) korunur,
         veliye verilmiş kod geçersiz kalmasın; eski biçimse yeniden üretilir. */
      let veliKodu = '';
      if (rolAd === 'student') {
        veliKodu = /^[A-Z0-9]{10}$/.test(String(u.code || '')) && !kod.has(u.code) ? u.code : '';
        while (!veliKodu || kod.has(veliKodu)) veliKodu = makeCode();
        kod.add(veliKodu);
      }
      const alan = adAlani(rolAd, okulId);
      const tc = String(u.tc || '');
      const tcAlan = tcAlani(rolAd, okulId);
      const tcYaz = tc && !tcSorunu(tc) && !tcler.has(tcAlan + '|' + tc) ? tc : null;
      if (tcYaz) tcler.add(tcAlan + '|' + tcYaz);
      let okulNo = rolAd === 'student' ? metin(u.okulNo, 20) : '';
      if (okulNo && okulNolari.has(okulId + '|' + okulNo)) okulNo = '';
      if (okulNo) okulNolari.add(okulId + '|' + okulNo);
      if (rolAd === 'student') ogrenciOkulu.set(u.id, okulId);
      if (rolAd === 'servisci') servisciOkulu.set(u.id, okulId);
      if (rolAd === 'teacher' || rolAd === 'principal') personelOkulu.set(u.id, okulId);
      let ad = metin(u.fullName, 80).trim();
      if (ad.length < 3) ad = (ad + ' -').padEnd(3, '-');
      const kvkk = u.kvkk && u.kvkk.onay;
      /* Öğretmen eşleme kodu yalnızca yetişkin hesabında; geçerli ve tekse korunur. */
      const yetiskin = !anaId && (!rolAd || rolAd === 'parent');
      const eslesme = yetiskin && /^[A-Z0-9]{10}$/.test(String(u.eslesmeKodu || '')) && !kod.has(u.eslesmeKodu)
        ? u.eslesmeKodu : '';
      if (eslesme) kod.add(eslesme);
      await ekle('kullanicilar', {
        id: u.id, kullanici_adi: kullaniciAdiUret(ep, u.username, alan, tcYaz), eposta: ep || null, tc_kimlik: tcYaz,
        ana_hesap_id: anaId, eslesme_kodu: eslesme, okul_acti: u.okulActi === true || !!u.createdBy,
        okul_no: okulNo, sifre_degismeli: u.sifreDegismeli === true, son_giris: u.sonGiris ? zaman(u.sonGiris) : null,
        sifre_ozeti: metin(u.pass), ad_soyad: ad, rol: rolAd,
        durum: secim(u.status, ['pending', 'approved', 'rejected'], 'approved'),
        okul_id: okulId, sinif_id: sinif.has(u.classId) ? u.classId : null,
        ozel_rol_id: rol.has(u.customRoleId) ? u.customRoleId : null,
        secili_yil_id: yilId(u.seciliYil),
        telefon: /^\+[1-9]\d{6,14}$/.test(tel) ? tel : '',
        il: metin(u.city, 60), ilce: metin(u.district, 60), adres: metin(u.address, 200),
        dogum_tarihi: gun(u.dogum), brans: metin(u.branch, 60), sinif_etiketi: metin(u.grade, 20),
        veli_kodu: veliKodu, okul_notu: metin(u.note, 300),
        tema: secim(u.tema, ['sistem', 'acik', 'koyu'], 'sistem'),
        mesaj_kimden: secim(u.mesajAyar && u.mesajAyar.kimden, ['herkes', 'personel', 'kapali'], 'herkes'),
        kvkk_onay: !!kvkk, kvkk_tarih: kvkk && u.kvkk.tarih ? zaman(u.kvkk.tarih) : null,
        kvkk_surum: kvkk ? metin(u.kvkk.surum, 20) : '',
        olusturma: zaman(u.createdAt)
      });
      kisi.add(u.id); if (ep) eposta.add(ep);
      if (yetiskin) yetiskinler.add(u.id);
    }
    for (const u of dizi(veri.users)) {
      if (u && kisi.has(u.id) && kisi.has(u.createdBy) && u.createdBy !== u.id) {
        await sorgu('UPDATE kullanicilar SET olusturan_id = $1 WHERE id = $2', [u.createdBy, u.id]);
      }
      if (u && kisi.has(u.id) && u.mesajAyar && Array.isArray(u.mesajAyar.engelli)) {
        for (const eid of new Set(u.mesajAyar.engelli)) {
          if (kisi.has(eid) && eid !== u.id) await ekle('mesaj_engelleri', { kullanici_id: u.id, engellenen_id: eid });
        }
      }
    }
    const kisiId = v => kisi.has(v) ? v : null;

    /* --- veli bağları --- */
    const bag = new Set();
    for (const l of dizi(veri.parentLinks)) {
      const anahtar = l && (l.parentId + '|' + l.studentId);
      if (!l || !kisi.has(l.parentId) || !kisi.has(l.studentId) || bag.has(anahtar)) { atla('veliBag'); continue; }
      await ekle('veli_baglari', { id: l.id || uid('pl'), veli_id: l.parentId, ogrenci_id: l.studentId,
        olusturma: zaman(l.createdAt) });
      bag.add(anahtar);
    }

    /* --- dersler --- */
    const ders = new Set();
    const dersKonu = new Set();
    for (const l of dizi(veri.lessons)) {
      const anahtar = l && (l.classId + '|' + l.subject);
      if (!l || !l.id || !sinif.has(l.classId) || !okul.has(l.schoolId) || !l.subject || dersKonu.has(anahtar)) {
        atla('ders'); continue;
      }
      await ekle('dersler', { id: l.id, okul_id: l.schoolId, sinif_id: l.classId, konu: metin(l.subject, 60),
        ogretmen_id: kisiId(l.teacherId), haftalik_saat: Math.max(0, Math.min(20, parseInt(l.weeklyHours, 10) || 0)),
        olusturma: zaman(l.createdAt) });
      ders.add(l.id); dersKonu.add(anahtar);
    }

    /* --- ders programı (eski "ders saati" numaralı kayıtlar saate çevrilir) --- */
    for (const sp of dizi(veri.schedule)) {
      if (!sp || !sp.id || !ders.has(sp.lessonId) || !sinif.has(sp.classId) || !okul.has(sp.schoolId)) {
        atla('program'); continue;
      }
      let bas = saat(sp.start), bit = saat(sp.end);
      if (!bas || !bit) { const v = ESKI_SAATLER[sp.slot] || ESKI_SAATLER[1]; bas = v[0]; bit = v[1]; }
      const gunNo = parseInt(sp.day, 10);
      if (!(gunNo >= 1 && gunNo <= 7) || dakika(bit) <= dakika(bas) || dakika(bit) - dakika(bas) > 480) {
        atla('program'); continue;
      }
      await ekle('ders_programi', { id: sp.id, okul_id: sp.schoolId, sinif_id: sp.classId, ders_id: sp.lessonId,
        gun: gunNo, baslangic: bas, bitis: bit, yil_id: yilId(sp.yilId), olusturma: zaman(sp.createdAt) });
    }

    /* --- ödevler --- */
    const SONUC = ['yapti', 'yapmadi', 'eksik', 'gec', 'izinli', 'gelmedi'];
    const odevOgr = new Set();   // 'odevId|ogrenciId' (teslim dosyaları için)
    for (const a of dizi(veri.assignments)) {
      if (!a || !a.id || !okul.has(a.schoolId) || !a.title) { atla('odev'); continue; }
      let bas = gun(a.startAt), bit = gun(a.endAt);
      if (bas && bit && bit < bas) bas = null;
      await ekle('odevler', { id: a.id, okul_id: a.schoolId, ogretmen_id: kisiId(a.teacherId),
        ders: metin(a.subject, 60), baslik: metin(a.title, 200), aciklama: metin(a.description, 5000),
        baslangic: bas, baslangic_saati: bas ? (saat(a.startTime) || null) : null,
        bitis: bit, bitis_saati: saat(a.endTime) || '12:00',
        durum: secim(a.status, ['active', 'finished'], 'active'), yil_id: yilId(a.yilId),
        olusturma: zaman(a.createdAt), sonuclanma: a.finishedAt ? zaman(a.finishedAt) : null });
      for (const cid of new Set(dizi(a.classIds))) {
        if (sinif.has(cid)) await ekle('odev_siniflari', { odev_id: a.id, sinif_id: cid });
      }
      const sonuclar = a.results || {};
      const acilma = a.acilma || {};
      const yildizlar = new Set(dizi(a.yildizlar));
      for (const sid of new Set(dizi(a.studentIds))) {
        if (!kisi.has(sid)) continue;
        await ekle('odev_ogrencileri', { odev_id: a.id, ogrenci_id: sid,
          sonuc: secim(sonuclar[sid], SONUC, null), acilma: acilma[sid] ? zaman(acilma[sid]) : null,
          yildiz: yildizlar.has(sid) });
        odevOgr.add(a.id + '|' + sid);
      }
    }

    /* --- sınav şablonları --- */
    const sablon = new Set();
    for (const s of dizi(veri.sinavSablonlari)) {
      if (!s || !s.id || !okul.has(s.schoolId) || !s.name) { atla('sablon'); continue; }
      await ekle('sinav_sablonlari', { id: s.id, okul_id: s.schoolId, olusturan_id: kisiId(s.createdBy),
        ad: metin(s.name, 60), olusturma: zaman(s.createdAt) });
      sablon.add(s.id);
      let sira = 0;
      for (const o of dizi(s.olcumler)) {
        await ekle('sablon_olcumleri', { id: o.id || uid('so'), sablon_id: s.id, sira: ++sira,
          kod: metin(o.kod, 12), ad: metin(o.ad, 60), alt_sinir: sayi(o.alt) || 0,
          ust_sinir: sayi(o.ust) === null ? 100 : sayi(o.ust), ana: !!o.ana });
      }
    }

    /* --- sınav grupları ve sınavlar --- */
    const grup = new Map();   // id -> okul
    for (const g of dizi(veri.examGroups)) {
      if (!g || !g.id || !okul.has(g.schoolId) || !g.name) { atla('sinavGrubu'); continue; }
      await ekle('sinav_gruplari', { id: g.id, okul_id: g.schoolId, ogretmen_id: kisiId(g.teacherId),
        ders: metin(g.subject, 60), ad: metin(g.name, 100), yil_id: yilId(g.yilId), olusturma: zaman(g.createdAt) });
      grup.set(g.id, g.schoolId);
    }
    for (const x of dizi(veri.exams)) {
      const grupOkulu = x && grup.get(x.groupId);
      const okulId = (x && okul.has(x.schoolId)) ? x.schoolId : grupOkulu;
      if (!x || !x.id || !okulId || !x.name || (x.groupId && !grupOkulu)) { atla('sinav'); continue; }
      let agirlik = sayi(x.weight);
      if (grupOkulu && !(agirlik > 0 && agirlik <= 100)) agirlik = 100;
      if (!grupOkulu) agirlik = agirlik > 0 && agirlik <= 100 ? agirlik : null;
      await ekle('sinavlar', { id: x.id, okul_id: okulId, grup_id: grupOkulu ? x.groupId : null,
        sablon_id: sablon.has(x.templateId) ? x.templateId : null, ogretmen_id: kisiId(x.teacherId),
        ders: metin(x.subject, 60), ad: metin(x.name, 100),
        tarih: gun(x.tarih) || gun(x.createdAt) || new Date().toISOString().slice(0, 10),
        agirlik, yil_id: yilId(x.yilId), olusturma: zaman(x.createdAt) });

      /* Ölçümler: yeni biçimde olcumler + degerler, eski biçimde tek "Puan" + grades. */
      const olcumler = dizi(x.olcumler).length ? x.olcumler
        : [{ id: uid('ol'), kod: 'P', ad: 'Puan', alt: 0, ust: 100, ana: true }];
      let sira = 0;
      for (const o of olcumler) {
        const oid = o.id || uid('ol');
        await ekle('sinav_olcumleri', { id: oid, sinav_id: x.id, sira: ++sira, kod: metin(o.kod, 12),
          ad: metin(o.ad, 60), alt_sinir: sayi(o.alt) || 0, ust_sinir: sayi(o.ust) === null ? 100 : sayi(o.ust),
          ana: !!o.ana });
        const degerler = dizi(x.olcumler).length ? ((x.degerler || {})[o.id] || {}) : (x.grades || {});
        for (const sid of Object.keys(degerler)) {
          const d = sayi(degerler[sid]);
          if (!kisi.has(sid) || d === null || d < -10000 || d > 10000) continue;
          await ekle('sinav_degerleri', { olcum_id: oid, ogrenci_id: sid, deger: d });
        }
      }
    }

    /* --- devamsızlık --- */
    for (const k of dizi(veri.devamsizlik)) {
      if (!k || !k.id || !kisi.has(k.ogrenciId) || !okul.has(k.schoolId) || !gun(k.tarih)) {
        atla('devamsizlik'); continue;
      }
      await ekle('devamsizlik', { id: k.id, okul_id: k.schoolId, sinif_id: sinif.has(k.classId) ? k.classId : null,
        ders_id: ders.has(k.lessonId) ? k.lessonId : null, ogrenci_id: k.ogrenciId, tarih: gun(k.tarih),
        durum: secim(k.durum, ['var', 'yok', 'gec', 'izinli'], 'yok'), aciklama: metin(k.not, 200),
        alan_id: kisiId(k.alanId), yil_id: yilId(k.yilId), olusturma: zaman(k.createdAt) });
    }

    /* --- mesajlar --- */
    for (const m of dizi(veri.mesajlar)) {
      if (!m || !m.id || !okul.has(m.schoolId) || !m.konu) { atla('mesaj'); continue; }
      await ekle('mesajlar', { id: m.id, okul_id: m.schoolId, gonderen_id: kisiId(m.gonderenId),
        tur: secim(m.tur, ['mesaj', 'duyuru'], 'mesaj'), konu: metin(m.konu, 120), govde: metin(m.govde, 4000),
        hedef_ozet: metin(m.hedefOzet, 200), tarih: zaman(m.tarih), duzenlenme: m.duzenlenme ? zaman(m.duzenlenme) : null });
      const gorulen = new Set();
      for (const a of dizi(m.alicilar)) {
        const ogr = a && kisi.has(a.ogrenciId) ? a.ogrenciId : null;
        const anahtar = a && (a.id + '|' + (ogr || ''));
        if (!a || !kisi.has(a.id) || gorulen.has(anahtar)) continue;
        gorulen.add(anahtar);
        await ekle('mesaj_alicilari', { mesaj_id: m.id, alici_id: a.id, ogrenci_id: ogr });
      }
      for (const oid of new Set(dizi(m.okuyanlar))) {
        if (kisi.has(oid)) await ekle('mesaj_okumalari', { mesaj_id: m.id, kullanici_id: oid });
      }
    }

    /* --- takvim --- */
    for (const k of dizi(veri.takvim)) {
      const t = k && gun(k.tarih);
      if (!k || !k.id || !okul.has(k.schoolId) || !t || !k.baslik) { atla('takvim'); continue; }
      const b = gun(k.bitis);
      await ekle('takvim_etkinlikleri', { id: k.id, okul_id: k.schoolId, tarih: t, bitis: b && b >= t ? b : null,
        baslik: metin(k.baslik, 120), tur: metin(k.tur, 20) || 'etkinlik', aciklama: metin(k.aciklama, 300),
        ekleyen_id: kisiId(k.ekleyenId), yil_id: yilId(k.yilId), olusturma: zaman(k.createdAt) });
    }

    /* --- bildirimler --- */
    for (const n of dizi(veri.notifications)) {
      if (!n || !kisi.has(n.userId) || !n.text) { atla('bildirim'); continue; }
      await ekle('bildirimler', { id: n.id || uid('n'), kullanici_id: n.userId, metin: metin(n.text, 300),
        baglanti: metin(n.link, 200), okundu: !!n.read, olusturma: zaman(n.createdAt) });
    }

    /* --- oturumlar: eski düz anahtarlar özetlenir, yeniler olduğu gibi --- */
    const ozetle = a => crypto.createHash('sha256').update(String(a)).digest('hex');
    for (const [anahtar, o] of Object.entries(veri.sessions || {})) {
      if (o && kisi.has(o.userId)) {
        await ekle('oturumlar', { anahtar_ozeti: ozetle(anahtar), kullanici_id: o.userId, olusturma: zaman(o.createdAt) });
      }
    }
    for (const [ozet, o] of Object.entries(veri.oturumlar || {})) {
      if (o && kisi.has(o.userId) && /^[a-f0-9]{64}$/.test(ozet)) {
        await ekle('oturumlar', { anahtar_ozeti: ozet, kullanici_id: o.userId, olusturma: zaman(o.createdAt) });
      }
    }

    /* --- hatırlatmalar ve işlem kaydı --- */
    for (const [anahtar, ms] of Object.entries(veri.hatirlatmalar || {})) {
      await ekle('hatirlatmalar', { anahtar: metin(anahtar, 200), gonderilme: zaman(Number(ms)) });
    }
    const net = require('net');
    for (const k of dizi(veri.islemKaydi)) {
      if (!k || !k.islem) { atla('islemKaydi'); continue; }
      await ekle('islem_kaydi', { id: k.id || uid('ik'), okul_id: okul.has(k.schoolId) ? k.schoolId : null,
        kullanici_id: kisiId(k.userId), kullanici_ad: metin(k.userAd, 80), kullanici_rol: metin(k.userRol, 20),
        islem: metin(k.islem, 60), detay: metin(k.detay, 300),
        ip: net.isIP(String(k.ip || '')) ? k.ip : null, tarih: zaman(k.tarih) });
    }

    /* --- anketler: seçenekler, hedef listesi ve oylar --- */
    const secenekIdleri = new Set();
    for (const a of dizi(veri.anketler)) {
      const soru = a && metin(a.soru, 200);
      const secenekler = dizi(a && a.secenekler).filter(s => s && s.id && metin(s.metin, 120) && !secenekIdleri.has(s.id)).slice(0, 10);
      if (!a || !a.id || !okul.has(a.okulId) || !soru || !a.bitis || secenekler.length < 2) { atla('anket'); continue; }
      await ekle('anketler', { id: a.id, okul_id: a.okulId, olusturan_id: kisiId(a.olusturanId), soru,
        aciklama: metin(a.aciklama, 1000), hedef_ozet: metin(a.hedefOzet, 200), gizli: !!a.gizli, bitis: zaman(a.bitis),
        kapandi: a.kapandi ? zaman(a.kapandi) : null, olusturma: zaman(a.olusturma) });
      const buAnket = new Set();
      for (const [i, s] of secenekler.entries()) {
        if (buAnket.has(s.id)) continue;
        buAnket.add(s.id);
        secenekIdleri.add(s.id);
        await ekle('anket_secenekleri', { id: s.id, anket_id: a.id, sira: i + 1, metin: metin(s.metin, 120) });
      }
      const hedef = new Set(dizi(a.hedefler).filter(id => kisi.has(id)));
      for (const id of hedef) await ekle('anket_hedefleri', { anket_id: a.id, kullanici_id: id });
      const oyVeren = new Set();
      for (const o of dizi(a.oylar)) {
        if (!o || !hedef.has(o.kullaniciId) || !buAnket.has(o.secenekId) || oyVeren.has(o.kullaniciId)) continue;
        oyVeren.add(o.kullaniciId);
        await ekle('anket_oylari', { anket_id: a.id, kullanici_id: o.kullaniciId, secenek_id: o.secenekId, tarih: zaman(o.tarih) });
      }
    }

    /* --- yemek listesi --- */
    const yemekGorulen = new Set();
    for (const y of dizi(veri.yemekListesi)) {
      const t = y && gun(y.tarih), menu = y && metin(y.menu, 500), kal = y && sayi(y.kalori);
      if (!y || !okul.has(y.okulId) || !t || !menu || yemekGorulen.has(y.okulId + '|' + t)) { atla('yemek'); continue; }
      yemekGorulen.add(y.okulId + '|' + t);
      await ekle('yemek_listesi', { okul_id: y.okulId, tarih: t, menu, kalori: kal >= 1 && kal <= 5000 ? Math.round(kal) : null });
    }

    /* --- servisler ve servisteki öğrenciler (öğrenci tek serviste) --- */
    const servisAd = new Set(), servisteki = new Set();
    for (const s of dizi(veri.servisler)) {
      const ad = s && metin(s.ad, 60);
      if (!s || !s.id || !okul.has(s.okulId) || !ad || servisAd.has(s.okulId + '|' + ad)) { atla('servis'); continue; }
      servisAd.add(s.okulId + '|' + ad);
      await ekle('servisler', { id: s.id, okul_id: s.okulId, ad, plaka: metin(s.plaka, 15), sofor: metin(s.sofor, 80),
        sofor_id: servisciOkulu.get(s.soforId) === s.okulId ? s.soforId : null,
        sofor_tel: metin(s.soforTel, 20), rehber: metin(s.rehber, 80), rehber_tel: metin(s.rehberTel, 20),
        sabah: saat(s.sabah) || '', aksam: saat(s.aksam) || '', guzergah: metin(s.guzergah, 500), olusturma: zaman(s.olusturma) });
      for (const o of dizi(s.ogrenciler)) {
        if (!o || ogrenciOkulu.get(o.id) !== s.okulId || servisteki.has(o.id)) continue;
        servisteki.add(o.id);
        await ekle('servis_ogrencileri', { ogrenci_id: o.id, servis_id: s.id, durak: metin(o.durak, 120) });
      }
    }

    /* --- kulüpler ve üyeleri --- */
    const kulupAd = new Set();
    for (const u of dizi(veri.kulupler)) {
      const ad = u && metin(u.ad, 80), kon = u && sayi(u.kontenjan);
      if (!u || !u.id || !okul.has(u.okulId) || !ad || kulupAd.has(u.okulId + '|' + ad)) { atla('kulup'); continue; }
      kulupAd.add(u.okulId + '|' + ad);
      await ekle('kulupler', { id: u.id, okul_id: u.okulId, ad, aciklama: metin(u.aciklama, 1000), danisman_id: kisiId(u.danismanId),
        kontenjan: kon >= 1 && kon <= 1000 ? Math.round(kon) : null, basvuru_acik: u.basvuruAcik !== false,
        gun_saat: metin(u.gunSaat, 60), olusturma: zaman(u.olusturma) });
      for (const m of new Map(dizi(u.uyeler).filter(x => x && ogrenciOkulu.get(x.id) === u.okulId).map(x => [x.id, x])).values()) {
        await ekle('kulup_uyeleri', { kulup_id: u.id, ogrenci_id: m.id, tarih: zaman(m.tarih) });
      }
    }

    /* --- ödev teslim dosyalarının bilgisi (dosyalar data/dosyalar altında) --- */
    for (const d of dizi(veri.odevDosyalari)) {
      const ad = d && metin(d.ad, 150), boyut = d && sayi(d.boyut), crc = d && sayi(d.crc32);
      if (!d || !/^[0-9a-f]{32}$/.test(String(d.id)) || !odevOgr.has(d.odevId + '|' + d.ogrenciId) || !ad ||
          !Number.isSafeInteger(boyut) || !(boyut > 0) || !(Number.isSafeInteger(crc) && crc >= 0 && crc <= 0xffffffff) ||
          !/^[0-9a-f]{64}$/.test(String(d.sha256))) { atla('odevDosyasi'); continue; }
      await ekle('odev_dosyalari', { id: d.id, odev_id: d.odevId, ogrenci_id: d.ogrenciId, ad, boyut,
        crc32: crc, sha256: d.sha256, yuklenme: zaman(d.yuklenme) });
    }

    /* --- etütler, öğrencileri ve yoklamaları --- */
    const etutOkulu = new Map(), etutteki = new Set();
    for (const x of dizi(veri.etutler)) {
      const ad = x && metin(x.ad, 80).trim(), g = x && sayi(x.gun), bas = x && saat(x.baslangic), bit = x && saat(x.bitis);
      if (!x || !x.id || !okul.has(x.okulId) || !ad || !Number.isInteger(g) || g < 1 || g > 7 || !bas || !bit ||
          dakika(bit) <= dakika(bas)) { atla('etut'); continue; }
      etutOkulu.set(x.id, x.okulId);
      await ekle('etutler', { id: x.id, okul_id: x.okulId, ad, gun: g, baslangic: bas, bitis: bit, yer: metin(x.yer, 60),
        ogretmen_id: personelOkulu.get(x.ogretmenId) === x.okulId ? x.ogretmenId : null, olusturma: zaman(x.olusturma) });
      for (const oid of new Set(dizi(x.ogrenciler).map(String))) {
        if (ogrenciOkulu.get(oid) !== x.okulId) continue;
        etutteki.add(x.id + '|' + oid);
        await ekle('etut_ogrencileri', { etut_id: x.id, ogrenci_id: oid });
      }
    }
    const yoklamaGorulen = new Set();
    for (const y of dizi(veri.etutYoklamalari)) {
      const t = y && gun(y.tarih);
      const anahtar = y && y.etutId + '|' + t + '|' + y.ogrenciId;
      if (!y || !etutOkulu.has(y.etutId) || !t || ogrenciOkulu.get(y.ogrenciId) !== etutOkulu.get(y.etutId) ||
          ['var', 'yok', 'izinli'].indexOf(y.durum) < 0 || yoklamaGorulen.has(anahtar)) { atla('etutYoklama'); continue; }
      yoklamaGorulen.add(anahtar);
      await ekle('etut_yoklamalari', { etut_id: y.etutId, tarih: t, ogrenci_id: y.ogrenciId, durum: y.durum,
        alan_id: kisiId(y.alanId), guncelleme: zaman(y.guncelleme) });
    }

    /* --- öğrencilerin ev konumu --- */
    for (const k of dizi(veri.evKonumlari)) {
      const en = k && koordinat(k.enlem, 90), boy = k && koordinat(k.boylam, 180);
      if (!k || !ogrenciOkulu.has(k.ogrenciId) || en === null || boy === null) { atla('evKonumu'); continue; }
      await ekle('ogrenci_konumlari', { ogrenci_id: k.ogrenciId, enlem: en, boylam: boy, giren_id: kisiId(k.girenId),
        guncelleme: zaman(k.guncelleme) });
    }

    /* --- okul sayfaları ve fotoğraflarının bilgisi (dosyalar data/okul-fotolari altında).
       Ayarlar ve CSS sayfaya giderken her seferinde yeniden temizlenir;
       burada yalnızca biçim ve uzunluk denetlenir. --- */
    const sayfaGorulen = new Set();
    for (const s of dizi(veri.okulSayfalari)) {
      if (!s || !okul.has(s.okulId) || sayfaGorulen.has(s.okulId)) { atla('okulSayfasi'); continue; }
      sayfaGorulen.add(s.okulId);
      const ayar = {};
      const hamAyar = s.ayarlar && typeof s.ayarlar === 'object' ? s.ayarlar : {};
      for (const k of ['renk', 'zemin', 'yazi', 'baslikBoyu', 'kapakBoyu', 'hiza', 'genislik', 'galeriSutun']) {
        if (typeof hamAyar[k] === 'string' && hamAyar[k].length <= 20) ayar[k] = hamAyar[k];
      }
      await ekle('okul_sayfalari', { okul_id: s.okulId, tanitim: metin(s.tanitim, 1500), ayarlar: JSON.stringify(ayar),
        css: metin(s.css, 8000), guncelleyen_id: kisiId(s.guncelleyenId), guncelleme: zaman(s.guncelleme) });
    }
    for (const f of dizi(veri.okulFotolari)) {
      const boyut = f && sayi(f.boyut);
      if (!f || !/^[0-9a-f]{32}$/.test(String(f.id)) || !okul.has(f.okulId) || ['kapak', 'logo', 'galeri'].indexOf(f.yer) < 0 ||
          ['image/png', 'image/jpeg', 'image/webp'].indexOf(f.tur) < 0 || !Number.isSafeInteger(boyut) || !(boyut > 0)) {
        atla('okulFotosu'); continue;
      }
      await ekle('okul_fotolari', { id: f.id, okul_id: f.okulId, yer: f.yer, tur: f.tur, boyut,
        aciklama: metin(f.aciklama, 120), olusturma: zaman(f.olusturma) });
    }

    /* --- açılış sayfasındaki yorumlar --- */
    const yorumYazan = new Set();
    for (const y of dizi(veri.yorumlar)) {
      const yildiz = y && sayi(y.yildiz), yazi = y && metin(y.metin, 500).trim();
      if (!y || !y.id || !kisi.has(y.hesapId) || yorumYazan.has(y.hesapId) || !Number.isInteger(yildiz) || yildiz < 0 ||
          yildiz > 5 || !yazi || yazi.length < 3) { atla('yorum'); continue; }
      yorumYazan.add(y.hesapId);
      await ekle('yorumlar', { id: y.id, hesap_id: y.hesapId, yildiz, metin: yazi, ad_kisa: metin(y.adKisa, 40),
        rol: metin(y.rol, 60), gizli: y.gizli === true, olusturma: zaman(y.olusturma), guncelleme: zaman(y.guncelleme) });
    }

    /* --- öğrencinin geçmiş okulları (nakil) ve baktığı geçmiş dönem --- */
    const gecmisId = new Set();
    for (const g of dizi(veri.ogrenciGecmisi)) {
      if (!g || !g.id || gecmisId.has(g.id) || !ogrenciOkulu.has(g.ogrenciId) || !okul.has(g.okulId)) { atla('ogrenciGecmisi'); continue; }
      gecmisId.add(g.id);
      await ekle('ogrenci_gecmisi', { id: g.id, ogrenci_id: g.ogrenciId, okul_id: g.okulId, yil_id: yilId(g.yilId),
        okul_adi: metin(g.okulAdi, 200) || '-', yil_adi: metin(g.yilAdi, 40), sinif_adi: metin(g.sinifAdi, 60),
        ayrilis: zaman(g.ayrilis) });
    }
    for (const u of dizi(veri.users)) {
      if (u && kisi.has(u.id) && gecmisId.has(u.seciliGecmis)) {
        await sorgu('UPDATE kullanicilar SET secili_gecmis = $1 WHERE id = $2', [u.seciliGecmis, u.id]);
      }
    }

    /* --- okulların kapattığı özellikler --- */
    const ozellikAnahtarlari = require('./depo/ozellikler').ANAHTARLAR;
    const ozellikGoruldu = new Set();
    for (const o of dizi(veri.kapaliOzellikler)) {
      const anahtar = o && (o.okulId + '|' + o.ozellik);
      if (!o || !okul.has(o.okulId) || ozellikAnahtarlari.indexOf(o.ozellik) < 0 || ozellikGoruldu.has(anahtar)) { atla('kapaliOzellik'); continue; }
      ozellikGoruldu.add(anahtar);
      await ekle('okul_kapali_ozellikler', { okul_id: o.okulId, ozellik: o.ozellik, kapatan_id: kisiId(o.kapatanId),
        kapanma: zaman(o.kapanma) });
    }

    /* --- kişisel hatırlatıcılar --- */
    const hatirlaticiId = new Set();
    for (const h of dizi(veri.hatirlaticilar)) {
      const siklik = h && secim(h.siklik, ['bir-kez', 'her-gun', 'her-hafta', 'her-ay'], '');
      const saat = h && /^\d{2}:\d{2}$/.test(String(h.saat)) ? h.saat : '';
      const tarihG = h && gun(h.tarih);
      const ayGunu = h && Number(h.ayGunu);
      if (!h || !h.id || hatirlaticiId.has(h.id) || !kisi.has(h.kullaniciId) || !siklik || !saat || !metin(h.baslik, 120).trim() ||
          (siklik === 'bir-kez' && !tarihG) || (siklik === 'her-ay' && !(ayGunu >= 1 && ayGunu <= 31))) { atla('hatirlatici'); continue; }
      hatirlaticiId.add(h.id);
      await ekle('hatirlaticilar', { id: h.id, kullanici_id: h.kullaniciId, baslik: metin(h.baslik, 120).trim(), aciklama: metin(h.aciklama, 1000),
        siklik, tarih: siklik === 'bir-kez' ? tarihG : null, saat, ay_gunu: siklik === 'her-ay' ? ayGunu : null,
        aktif: h.aktif !== false, son_gonderim: h.sonGonderim ? zaman(h.sonGonderim) : null, olusturma: zaman(h.olusturma) });
      for (const g of new Set(dizi(h.gunler).map(Number).filter(x => x >= 1 && x <= 7))) {
        await ekle('hatirlatici_gunleri', { hatirlatici_id: h.id, gun: g });
      }
    }

    await abonelikleriGeriYaz(abonelikler);
  });
  await require('./depo/ozellikler').yukle();   // bellekteki kopya yedekle aynı olsun

  return { kullanici: (await sorgu('SELECT count(*) AS n FROM kullanicilar'))[0].n, atlanan };
}

/* Geri yüklemeden sonra aboneliklerin sahibi hâlâ varsa geri yazılır. */
async function abonelikleriGeriYaz(liste) {
  for (const a of liste) {
    await sorgu(
      'INSERT INTO push_abonelikleri (id, kullanici_id, endpoint, p256dh, auth, olusturma, son_basari) ' +
      'SELECT $1, $2, $3, $4, $5, $6, $7 WHERE EXISTS (SELECT 1 FROM kullanicilar WHERE id = $2) ON CONFLICT DO NOTHING',
      [a.id, a.kullanici_id, a.endpoint, a.p256dh, a.auth, a.olusturma, a.son_basari]);
  }
}

module.exports = { TABLOLAR, iceAktar, disaAktar };
