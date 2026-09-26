'use strict';
/* Müdürün okul yönetimi (/api/school).
   Sınıflar, dersler, ders programı, öğrenci ve öğretmen hesapları,
   özel roller, Excel içe/dışa aktarım. */

const crypto = require('crypto');
const { tabloOku } = require('../yardimci/tablo-oku');
const aktarim = require('../yardimci/aktarim');
const { bad, baslikEkle, ok } = require('../http');
const {
  GUN_ADLARI, GUN_SAYISI, aralikCakismasi, branchOf, cakismalariBul, dersEtiketi,
  dersOzeti, isTeacherLike, saatDakika, saatDuzelt, sinifOzeti
} = require('../iliskiler');
const {
  SUBJECTS, adDuzelt, clean, dogumSorunu, gunTarih, kisiKoduBicim, kullaniciAdiSorunu, normEmail,
  normKullaniciAdi, now, sifreSorunu, tcSorunu, uid
} = require('../ortak');
const { hizSinir } = require('../guvenlik');
const { hashPw, hashPwToplu } = require('../sifre');
const { depo, bildir, islem } = require('../veri');
const {
  OGRETMEN_VARSAYILAN, ROL_SABLONLARI, TUM_YETKILER, YETKILER, kapsamTemizle, ogrenciKapsamindaMi, pub, rolOzeti,
  roleById, yetkiVarMi
} = require('../yetki');
const { yilDamgasi, yilSuz } = require('./egitim-yili');
const hesaplar = require('./hesaplar');
const kisiAktarim = require('./kisi-aktarim');
const { islemYaz } = require('./islem-kaydi');
const { odevGecikti, odevSaati } = require('./odev');

/* ============ Excel aktarımı ============ */

/* Tek dosyada işlenecek en fazla satır. Toplu hesap açma şifre karması
   üretiyor; sınırsız bırakırsak tek istek sunucuyu uzun süre meşgul eder. */
const AKTARIM_SINIR = 300;

/* Gövde sınırı 2 MB ham JSON; base64 dosyayı üçte bir büyütüyor. */
const AKTARIM_DOSYA_SINIR = 1300000;

/* Çakışma uyarısının okunur hâli (Excel önizleme raporu için). */
function uyariMetni(u) {
  if (!u) return '';
  return (u.tur === 'sinif' ? 'sınıfın ' : 'öğretmenin ') + u.className + ' ' + u.subject +
    ' dersiyle çakışıyor (' + u.start + '-' + u.end + ')';
}

/* Okunması kolay, tahmini zor şifre: 8 harf + 2 rakam; karışan harfler
   (I/l/1, O/0) yok. crypto.randomInt ile (Math.random değil). */
const SIFRE_HARF = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
const SIFRE_RAKAM = '23456789';
function rastgeleSifre() {
  let s = '';
  for (let i = 0; i < 8; i++) s += SIFRE_HARF[crypto.randomInt(SIFRE_HARF.length)];
  for (let i = 0; i < 2; i++) s += SIFRE_RAKAM[crypto.randomInt(SIFRE_RAKAM.length)];
  return s;
}

/* Sınıf adı: seviye + şube harfi yazılmışsa tek biçime gelir ("7a",
   "7 - a", "7/A" -> "7-A"). Başka türlü yazılmış adlara ("Anasınıfı
   Papatya") dokunulmaz. */
function sinifAdiDuzelt(ad) {
  const m = /^(\d{1,2})\s*[-/.]?\s*([a-zçğıöşü])$/i.exec(String(ad || '').trim());
  return m ? m[1] + '-' + m[2].toLocaleUpperCase('tr') : String(ad || '').trim();
}

/* Okulun öğrencisi mi? */
async function okulOgrencisi(me, id) {
  const st = await depo.kullanicilar.bul(clean(id, 60));
  return st && st.role === 'student' && st.schoolId === me.schoolId ? st : null;
}

function xlsxGonder(res, veri, ad) {
  res.writeHead(200, baslikEkle({
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Length': veri.length,
    'Content-Disposition': 'attachment; filename="' + ad + '"',
    'Cache-Control': 'no-store'
  }));
  res.end(veri);
}

/* ---- uçlar ---- */
/* k: istek bağlamı (api.js kurar). Cevap yazılmadıysa yönlendirici 404 döner. */
async function uclar(k) {
  const { req, res, me, body, q, p, segs, method, need } = k;

  if (p === 'school') {
    /* Bu bölüme müdür ve özel rolü olan öğretmenler girer; her uç kendi
       yetkisini ayrıca kontrol eder. */
    if (!need(null)) return;
    if (me.role !== 'principal' && me.role !== 'teacher') return bad(res, 'Yetkin yok', 403);
    const sub = segs[2] || '';

    /* Bu uç için gereken yetki yoksa durdur. */
    const yetkiGerek = (izin, baglam) => {
      if (yetkiVarMi(me, izin, baglam)) return true;
      bad(res, baglam
        ? 'Bu ders ya da sınıf için yetkin yok'
        : 'Bu işlem için yetkin yok', 403);
      return false;
    };

    /* Okulun açtığı hesaplar, veli bağlama ve okul adresi (hesaplar.js). */
    if (await hesaplar.uclar(k, sub) !== false) return;
    if (await kisiAktarim.uclar(k, sub) !== false) return;

    /* ---------- Excel içe ve dışa aktarım ---------- */

    if (sub === 'aktarim-sablon' && method === 'GET') {
      if (!yetkiGerek('aktarim.yap')) return;
      const tur = clean(q.get('tur'), 20);
      if (tur !== 'program') return bad(res, 'Bilinmeyen şablon');
      let veri;
      try { veri = aktarim.sablon(tur); }
      catch (e) { return bad(res, 'Şablon üretilemedi: ' + e.message, 500); }
      return xlsxGonder(res, veri,
        'ders-programi-sablon.xlsx');
    }

    if (sub === 'aktarim-disa' && method === 'GET') {
      if (!yetkiGerek('aktarim.yap')) return;
      const tur = clean(q.get('tur'), 20);
      const okulSinif = new Map((await depo.siniflar.okulun(me.schoolId)).map(c => [c.id, c.name]));
      const sinifAdi = id => okulSinif.get(id) || '';

      if (tur === 'ogrenci') {
        /* Depo ada göre Türkçe sıralı döndürür. */
        const satirlar = (await depo.kullanicilar.okulun(me.schoolId, { rol: 'student' }))
          .map(u => [u.fullName, u.username, u.email, sinifAdi(u.classId), kisiKoduBicim(u.code),
            u.note || '', gunTarih(u.createdAt)]);
        return xlsxGonder(res, aktarim.disa('Öğrenciler',
          ['Ad Soyad', 'Kullanıcı adı', 'E-posta', 'Sınıf', 'Veli kodu',
            'Müdür notu', 'Kayıt tarihi'],
          satirlar, [26, 22, 28, 10, 20, 30, 14]), 'ogrenciler.xlsx');
      }

      if (tur === 'ogretmen') {
        const tumDersler = await depo.siniflar.okulunDersleri(me.schoolId);
        const satirlar = (await depo.kullanicilar.okulun(me.schoolId, { rol: 'teacher', durum: 'approved' }))
          .map(u => {
            const dersleri = tumDersler.filter(l => l.teacherId === u.id);
            const dersAd = [];
            const sinifAd = [];
            for (const l of dersleri) {
              if (dersAd.indexOf(l.subject) < 0) dersAd.push(l.subject);
              const sn = sinifAdi(l.classId);
              if (sn && sinifAd.indexOf(sn) < 0) sinifAd.push(sn);
            }
            return [u.fullName, u.username, u.email, branchOf(u), dersAd.join(', '),
              sinifAd.join(', '), gunTarih(u.createdAt)];
          });
        return xlsxGonder(res, aktarim.disa('Öğretmenler',
          ['Ad Soyad', 'Kullanıcı adı', 'E-posta', 'Branş', 'Verdiği dersler', 'Sınıflar',
            'Kayıt tarihi'],
          satirlar, [26, 22, 28, 18, 30, 20, 14]), 'ogretmenler.xlsx');
      }

      if (tur === 'program') {
        /* Depo sınıf adı, gün ve saate göre sıralı döndürür. */
        const satirlar = (await depo.siniflar.okulunProgrami(me.schoolId))
          .map(sp => [sp._sinifAdi || '', aktarim.GUNLER[sp.day] || '',
            sp.start, sp.end, sp._ders || '', sp._ogretmenAdi || '']);
        return xlsxGonder(res, aktarim.disa('Ders programı',
          ['Sınıf', 'Gün', 'Başlangıç', 'Bitiş', 'Ders', 'Öğretmen'],
          satirlar, [12, 12, 12, 12, 22, 24]), 'ders-programi.xlsx');
      }

      return bad(res, 'Bilinmeyen aktarım türü');
    }

    /* İçe aktarım iki adımlı: uygula=false ise ne olacağını anlatan bir
       rapor döner, uygula=true ise aynı dosya baştan çözümlenip işlenir.
       Önizlemeye güvenmiyoruz — her iki adımda da tüm denetimler tekrar
       çalışıyor, arada veri değişmiş olabilir. */
    if (sub === 'aktarim-ice' && method === 'POST') {
      if (!yetkiGerek('aktarim.yap')) return;
      const tur = clean(body.tur, 20);
      /* Öğrenci ve servisçi listeleri kişi aktarımından (kisi-aktarim.js). */
      if (tur === 'ogrenci') return bad(res, 'Öğrenci listesini "Kişi listesi" bölümünden yükle.');
      if (tur !== 'program') return bad(res, 'Bilinmeyen aktarım türü');

      const b64 = String(body.dosya || '');
      if (!b64) return bad(res, 'Dosya seçilmedi');
      if (b64.length > AKTARIM_DOSYA_SINIR) {
        return bad(res, 'Dosya çok büyük. Listeyi bölüp iki dosya hâlinde yükle.');
      }

      const ham = Buffer.from(b64, 'base64');
      if (ham.length < 2) return bad(res, 'Dosya boş');

      let sayfalar;
      /* .xlsx, eski .xls, .ods ya da .csv: tablo-oku türünü anlar. */
      try { sayfalar = tabloOku(ham, clean(body.dosyaAdi, 120) || 'program.xlsx'); }
      catch (e) { return bad(res, e.message); }

      let cozum;
      try { cozum = aktarim.coz(tur, sayfalar); }
      catch (e) { return bad(res, e.message); }

      const rapor = cozum.hatalar.map(h => ({
        satir: h.satir, ad: '', durum: 'hata', mesaj: h.mesaj
      }));
      const hazir = [];
      const okulSinif = await depo.siniflar.okulun(me.schoolId);
      const sinifBul = ad => okulSinif.find(x =>
        aktarim.anahtarla(x.name) === aktarim.anahtarla(ad));

      /* ----- ders programı ----- */
      const eklenecek = [];
      const gorulenSaat = {};
      const okulDersleri = await depo.siniflar.okulunDersleri(me.schoolId);
      for (const k of cozum.kayitlar) {
        const c = sinifBul(k.sinif);
        if (!c) {
          rapor.push({ satir: k.satir, ad: k.sinif, durum: 'hata',
            mesaj: '"' + k.sinif + '" adında bir sınıf yok' });
          continue;
        }
        if (!yetkiVarMi(me, 'program.duzenle', { sinif: c.id })) {
          rapor.push({ satir: k.satir, ad: c.name, durum: 'hata',
            mesaj: c.name + ' sınıfının programını düzenleme yetkin yok' });
          continue;
        }

        const dersler = okulDersleri.filter(l => l.classId === c.id);
        const l = dersler.find(x =>
          aktarim.anahtarla(x.subject) === aktarim.anahtarla(k.ders));
        if (!l) {
          rapor.push({ satir: k.satir, ad: c.name, durum: 'hata',
            mesaj: c.name + ' sınıfında "' + k.ders + '" dersi tanımlı değil' });
          continue;
        }

        const bd = saatDakika(k.baslangic), td = saatDakika(k.bitis);
        if (td <= bd) {
          rapor.push({ satir: k.satir, ad: c.name, durum: 'hata',
            mesaj: 'Bitiş saati başlangıçtan sonra olmalı' });
          continue;
        }
        if (td - bd > 8 * 60) {
          rapor.push({ satir: k.satir, ad: c.name, durum: 'hata',
            mesaj: 'Bir ders 8 saatten uzun olamaz' });
          continue;
        }

        const varOlan = await depo.siniflar.programVarMi(c.id, l.id, k.gunNo, k.baslangic);
        if (varOlan) {
          rapor.push({ satir: k.satir, ad: c.name, durum: 'atlandi',
            mesaj: 'Bu ders saati zaten programda var' });
          continue;
        }

        const imza = c.id + '|' + k.gunNo + '|' + k.baslangic + '|' + l.id;
        if (gorulenSaat[imza]) {
          rapor.push({ satir: k.satir, ad: c.name, durum: 'atlandi',
            mesaj: 'Dosyada ' + gorulenSaat[imza] + '. satırda aynısı var' });
          continue;
        }
        gorulenSaat[imza] = k.satir;

        const uyari = uyariMetni(await aralikCakismasi(me.schoolId, c.id, l.teacherId,
          k.gunNo, bd, td, null));

        eklenecek.push({ satir: k.satir, c, l, gun: k.gunNo,
          bas: k.baslangic, bit: k.bitis });
        rapor.push({
          satir: k.satir, ad: c.name,
          durum: uyari ? 'uyari' : 'hazir',
          mesaj: aktarim.GUNLER[k.gunNo] + ' ' + k.baslangic + '-' + k.bitis +
            ' ' + l.subject + (uyari ? ' — dikkat: ' + uyari : '')
        });
      }

      if (!body.uygula) {
        return ok(res, {
          onizleme: true, tur, hazir: eklenecek.length,
          hatali: rapor.filter(r => r.durum === 'hata').length,
          uyarili: rapor.filter(r => r.durum === 'uyari').length,
          sinir: AKTARIM_SINIR, rapor: rapor.sort((a, b) => a.satir - b.satir)
        });
      }

      if (!eklenecek.length) return bad(res, 'Eklenecek ders saati yok.');
      if (eklenecek.length > AKTARIM_SINIR) {
        return bad(res, 'Tek seferde en fazla ' + AKTARIM_SINIR + ' ders saati eklenebilir.');
      }

      const yilId = await yilDamgasi(me);
      await islem(async () => {
        for (const e of eklenecek) {
          await depo.siniflar.programEkle({
            id: uid('p'), schoolId: me.schoolId, classId: e.c.id, lessonId: e.l.id,
            day: e.gun, start: e.bas, end: e.bit, yilId, createdAt: now()
          });
        }
      });
      console.log('  Excel ile ' + eklenecek.length + ' ders saati eklendi (' +
        me.email + ')');
      await islemYaz(me, 'program.toplu-eklendi', eklenecek.length + ' ders saati', req);
      return ok(res, {
        uygulandi: true, eklenen: eklenecek.length,
        cakismalar: await cakismalariBul(me.schoolId),
        message: eklenecek.length + ' ders saati programa eklendi.'
      });
    }

    /* ---------- roller ---------- */

    if (sub === 'permissions' && method === 'GET') {
      return ok(res, { gruplar: YETKILER, ogretmenVarsayilan: OGRETMEN_VARSAYILAN, sablonlar: ROL_SABLONLARI });
    }

    /* Roller: önce hazır Öğretmen rolü (yoksa şimdi kurulur), sonra özel roller.
       Hazır rolün "kişi sayısı" okuldaki öğretmen sayısıdır. */
    if (sub === 'roles' && method === 'GET') {
      if (!yetkiGerek('rol.yonet')) return;
      await depo.roller.ogretmenRolu(me.schoolId, OGRETMEN_VARSAYILAN, uid('r'), now());
      const [roller, ogretmenler] = await Promise.all([
        depo.roller.okulun(me.schoolId), depo.kullanicilar.okulun(me.schoolId, { rol: 'teacher' })]);
      return ok(res, { roles: roller.map(r => Object.assign(rolOzeti(r),
        r.tur === 'ogretmen' ? { kisiSayisi: ogretmenler.length } : {})) });
    }

    if (sub === 'role' && method === 'POST') {
      if (!yetkiGerek('rol.yonet')) return;
      const ad = clean(body.name, 40);
      if (!ad) return bad(res, 'Rol adı gerekli');
      if ((await depo.roller.okulun(me.schoolId)).some(r =>
        r.name.toLocaleLowerCase('tr') === ad.toLocaleLowerCase('tr'))) {
        return bad(res, 'Bu adda bir rol zaten var');
      }
      const izinler = [...new Set((Array.isArray(body.permissions) ? body.permissions : [])
        .map(x => String(x)).filter(x => TUM_YETKILER.indexOf(x) >= 0))];
      const r = await depo.roller.ekle({
        id: uid('r'), schoolId: me.schoolId, name: ad,
        permissions: izinler, kapsam: await kapsamTemizle(body.kapsam, izinler, me.schoolId),
        createdAt: now()
      });
      await islemYaz(me, 'rol.olusturuldu', ad, req);
      return ok(res, { role: rolOzeti(r) });
    }

    if (sub === 'role-update' && method === 'POST') {
      if (!yetkiGerek('rol.yonet')) return;
      const r = await roleById(clean(body.roleId, 60));
      if (!r || r.schoolId !== me.schoolId) return bad(res, 'Rol bulunamadı');
      /* Kimse kendi yetkisini genişletemez: öğretmen kendi taşıdığı rolü ve
         kendisine de uygulanan hazır Öğretmen rolünü değiştiremez. */
      if (me.role !== 'principal' && (r.id === me.customRoleId || r.tur === 'ogretmen')) {
        return bad(res, 'Kendi taşıdığın rolü değiştiremezsin; müdürden iste.', 403);
      }
      const d = {};
      /* Hazır Öğretmen rolünün adı sabittir ve ders/sınıf daraltması olmaz:
         okuldaki her öğretmene aynı yetkiler. */
      const hazir = r.tur === 'ogretmen';
      if (hazir) { delete body.name; body.kapsam = {}; }
      if (body.name !== undefined) {
        const ad = clean(body.name, 40);
        if (!ad) return bad(res, 'Rol adı gerekli');
        if ((await depo.roller.okulun(me.schoolId)).some(x => x.id !== r.id &&
          x.name.toLocaleLowerCase('tr') === ad.toLocaleLowerCase('tr'))) {
          return bad(res, 'Bu adda bir rol zaten var');
        }
        d.name = ad;
      }
      if (Array.isArray(body.permissions)) {
        d.permissions = [...new Set(body.permissions.map(x => String(x))
          .filter(x => TUM_YETKILER.indexOf(x) >= 0))];
      }
      /* Yetkiler değişince kapsamı da yeni listeye göre yeniden süz. */
      if (body.kapsam !== undefined || d.permissions) {
        d.kapsam = await kapsamTemizle(body.kapsam !== undefined ? body.kapsam : r.kapsam,
          d.permissions || r.permissions, me.schoolId);
      }
      const yeni = await depo.roller.guncelle(Object.assign({}, r, d));
      await islemYaz(me, 'rol.degistirildi', yeni.name, req);
      return ok(res, { role: rolOzeti(yeni) });
    }

    if (sub === 'role-delete' && method === 'POST') {
      if (!yetkiGerek('rol.yonet')) return;
      const r = await roleById(clean(body.roleId, 60));
      if (!r || r.schoolId !== me.schoolId) return bad(res, 'Rol bulunamadı');
      if (r.tur === 'ogretmen') return bad(res, 'Hazır Öğretmen rolü silinemez; istemediğin yetkileri kapatabilirsin.');
      /* Rolü taşıyanların rolü yabancı anahtar kuralıyla boşalır (ON DELETE SET NULL). */
      await depo.roller.sil(r.id);
      await islemYaz(me, 'rol.silindi', r.name, req);
      return ok(res);
    }

    if (sub === 'role-assign' && method === 'POST') {
      if (!yetkiGerek('rol.yonet')) return;
      const t = await depo.kullanicilar.bul(clean(body.userId, 60));
      if (!t || t.role !== 'teacher' || t.schoolId !== me.schoolId) {
        return bad(res, 'Öğretmen bulunamadı');
      }
      if (t.id === me.id) return bad(res, 'Kendine rol veremezsin', 403);
      const rid = clean(body.roleId, 60);
      if (!rid) {
        await depo.kullanicilar.guncelle(t.id, { customRoleId: '' });
      } else {
        const r = await roleById(rid);
        if (!r || r.schoolId !== me.schoolId) return bad(res, 'Rol bulunamadı');
        if (r.tur === 'ogretmen') return bad(res, 'Öğretmen rolü her öğretmende zaten var; ayrıca verilmez.');
        await depo.kullanicilar.guncelle(t.id, { customRoleId: r.id });
        await bildir(t.id, 'Sana "' + r.name + '" rolü verildi. Menünde yeni bölümler görebilirsin.');
        await islemYaz(me, 'rol.atandi', t.fullName + ' → ' + r.name, req);
      }
      return ok(res, { user: pub(await depo.kullanicilar.bul(t.id)) });
    }

    if (sub === 'teachers' && method === 'GET') {
      if (!yetkiGerek('ogretmen.duzenle')) return;
      /* Kendi hesabıyla eklenen öğretmen "bagli"dır: okul yalnızca branşını düzenler. */
      const ogretmenler = await depo.kullanicilar.okulun(me.schoolId, { rol: 'teacher' });
      return ok(res, { teachers: ogretmenler.map(u => Object.assign(pub(u), { bagli: !!u.anaHesapId })) });
    }
    if (sub === 'teacher-decide' && method === 'POST') {
      if (!yetkiGerek('ogretmen.onayla')) return;
      const t = await depo.kullanicilar.bul(clean(body.userId, 60));
      if (!t || t.role !== 'teacher' || t.schoolId !== me.schoolId) return bad(res, 'Öğretmen bulunamadı');
      /* Yalnızca bekleyen başvuru karara bağlanır; onaylı öğretmen buradan
         okuldan çıkarılamaz (dersleri, ödevleri sahipsiz kalırdı). */
      if (t.status !== 'pending') return bad(res, 'Bu başvuru zaten karara bağlanmış.');
      if (t.id === me.id) return bad(res, 'Kendi başvurunu karara bağlayamazsın.');
      /* Reddedilen başvuru hesabı kilitlemez; kişi rolsüz yetişkin hesabına
         döner. Yetişkin hesabının kişi kodu olur: aynı güncellemede yazılır
         ("+ Ekle" penceresi boş kod göstermesin). */
      await depo.kullanicilar.guncelle(t.id, body.approve
        ? { status: 'approved' }
        : { status: 'approved', role: '', schoolId: '', branch: '', customRoleId: '',
            eslesmeKodu: t.eslesmeKodu || await depo.kullanicilar.yeniKisiKodu() });
      await bildir(t.id, body.approve
        ? 'Öğretmenlik başvurun müdür tarafından onaylandı.'
        : 'Öğretmenlik başvurun reddedildi.');
      if (body.approve) await islemYaz(me, 'ogretmen.onaylandi', t.fullName, req);
      return ok(res, { user: pub(await depo.kullanicilar.bul(t.id)) });
    }
    if (sub === 'students' && method === 'GET') {
      /* Yalnızca portal yetkisi olan (rehber öğretmen) dar listeyi görür:
         ad, sınıf, okul no — veli kodu, e-posta, doğum tarihi gitmez. */
      const salt = !yetkiVarMi(me, 'ogrenci.duzenle') && yetkiVarMi(me, 'ogrenci.portal');
      if (!salt && !yetkiGerek('ogrenci.duzenle')) return;
      /* Öğrenciler ve sınıf adları iki sorguda. Eskiden her öğrencinin
         yanında sınıfının öğretmen listesi de gidiyordu; ekranda
         kullanılmıyordu ve 720 öğrencide cevabı 525 KB yapıyordu. */
      const [ogrenciler, siniflar] = await Promise.all([
        depo.kullanicilar.okulun(me.schoolId, { rol: 'student' }),
        depo.siniflar.okulun(me.schoolId)
      ]);
      const sinifAdi = new Map(siniflar.map(c => [c.id, c.name]));
      const list = ogrenciler.map(u => ({
        id: u.id, fullName: u.fullName, username: u.username, email: u.email, code: u.code, grade: u.grade || '',
        classId: u.classId || '', className: sinifAdi.get(u.classId) || '', note: u.note || '',
        dogum: u.dogum || '', olusturan: u.okulActi ? 'okul' : 'kendisi', girisYapti: !!u.sonGiris,
        okulNo: u.okulNo || '', sifreDegismeli: !!u.sifreDegismeli
      }));
      if (salt) {
        return ok(res, { students: list.map(s => ({ id: s.id, fullName: s.fullName, classId: s.classId, className: s.className,
          okulNo: s.okulNo, username: '', email: '', code: '' })) });
      }
      return ok(res, { students: list });
    }

    /* Müdürün ana sayfası: sayılar tek sorguda. Tam öğrenci listesini
       yalnızca saymak için indirmek gerekmez. */
    if (sub === 'ozet' && method === 'GET') {
      /* Sayılar okul yönetiminin ekranı için: öğrenci ya da öğretmen listesini
         görebilen kişi görür. */
      if (me.role !== 'principal' && !yetkiVarMi(me, 'ogrenci.duzenle') && !yetkiVarMi(me, 'ogretmen.duzenle')) {
        return bad(res, 'Bu işlem için yetkin yok', 403);
      }
      const s = await depo.kullanicilar.okulSayimlari(me.schoolId);
      return ok(res, s);
    }
    if (sub === 'teacher-list' && method === 'GET') {
      if (!yetkiGerek('ders.ogretmen-ata')) return;
      const list = (await depo.kullanicilar.okulun(me.schoolId, { roller: ['teacher', 'principal'], durum: 'approved' }))
        .map(u => ({ id: u.id, fullName: u.fullName, branch: branchOf(u), role: u.role }))
        .sort((a, b) => a.branch.localeCompare(b.branch, 'tr'));
      return ok(res, { teachers: list });
    }
    /* Müdür ödevlere ders bazlı bakar: hangi ders, hangi öğretmen, ne vermiş.
       İki kademe: liste yalnızca ders başına aktif/geçmiş SAYISINI verir
       (bir yıllık okulda bütün ödevler 1 MB'ı geçiyordu); bir ders açılınca
       ?lessonId= ile yalnızca o dersin ödevleri gelir. Sınıf seçiliyse
       ?detay=1 o sınıfın bütün derslerini ödevleriyle verir ("Hepsini aç").
       Ödevi dersin kendi öğretmeni vermemiş olabilir (vekil, zümre); müdür
       hepsini görür, veren kişi yanında yazar. */
    if (sub === 'assignments' && method === 'GET') {
      if (!yetkiGerek('ders.yonet')) return;
      const dersOdevleri = async l => (await yilSuz(me,
        await depo.odevler.dersinOdevleri(me.schoolId, l.classId, l.subject)))
        .map(a => Object.assign(a, { endTime: odevSaati(a), gecikti: odevGecikti(a) }));

      const lid = clean(q.get('lessonId'), 60);
      if (lid) {
        const l = await depo.siniflar.dersBul(lid);
        if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı', 404);
        return ok(res, { lessonId: l.id, assignments: await dersOdevleri(l) });
      }

      const cid = clean(q.get('classId'), 60);
      const [okulDersleri, siniflar, baglar] = await Promise.all([
        depo.siniflar.okulunDersleri(me.schoolId),
        depo.siniflar.okulun(me.schoolId),
        depo.odevler.dersBaglari(me.schoolId, cid)
      ]);
      const sayim = new Map();
      for (const a of await yilSuz(me, baglar)) {
        if (!sayim.has(a.dersId)) sayim.set(a.dersId, { aktif: 0, gecmis: 0 });
        sayim.get(a.dersId)[a.status === 'finished' || odevGecikti(a) ? 'gecmis' : 'aktif']++;
      }
      /* Depo sınıf adı ve derse göre sıralı döndürür. */
      const liste = okulDersleri.filter(l => !cid || l.classId === cid).map(l => ({
        lessonId: l.id, subject: l.subject,
        classId: l.classId, className: l._sinifAdi || '',
        teacherName: l._ogretmenAdi || '',
        weeklyHours: l.weeklyHours || 0,
        aktif: (sayim.get(l.id) || {}).aktif || 0,
        gecmis: (sayim.get(l.id) || {}).gecmis || 0
      }));
      if (cid && q.get('detay') === '1') {
        for (const l of liste) l.assignments = await dersOdevleri({ classId: l.classId, subject: l.subject });
      }
      return ok(res, {
        lessons: liste,
        classes: siniflar.map(c => ({ id: c.id, name: c.name }))
      });
    }

    /* ---------- toplu giriş bilgisi (K12'deki öğrenci-veli mektubu) ----------
       Seçilen öğrencilere yeni şifre üretilir; kullanıcı adı, şifre ve veli
       kodu tek seferlik bir listede (Excel + yazdırılabilir mektup) döner.
       Şifreler sunucuda güçlü rastgele üretilir, yalnızca özetleri saklanır:
       liste bir daha üretilemez. Varsayılan: yalnızca henüz giriş yapmamışlar. */
    if (sub === 'giris-bilgisi' && method === 'POST') {
      if (!yetkiGerek('ogrenci.sifre')) return;
      if (body.onay !== true) return bad(res, 'Şifreler yenilenecek; onaylaman gerekiyor.');
      /* Yüzlerce şifre karması sunucuyu meşgul eder: okul başına saatte 30. */
      if (!hizSinir('topluSifre:' + me.schoolId, 30, 60 * 60 * 1000)) {
        return bad(res, 'Bu saat içinde çok fazla toplu dağıtım yapıldı. Biraz sonra dene.', 429);
      }
      const classId = clean(body.classId, 60);
      let sinifAdi = 'Bütün okul';
      if (classId) {
        const c = await depo.siniflar.bul(classId);
        if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
        sinifAdi = c.name;
      }
      const sadeceGirmeyen = body.sadeceGirmeyen !== false;
      const [ogrenciler, siniflar] = await Promise.all([
        depo.kullanicilar.okulun(me.schoolId, { rol: 'student' }), depo.siniflar.okulun(me.schoolId)]);
      const adi = new Map(siniflar.map(c => [c.id, c.name]));
      const secilen = ogrenciler.filter(u => (!classId || u.classId === classId) && (!sadeceGirmeyen || !u.sonGiris) &&
        ogrenciKapsamindaMi(me, 'ogrenci.sifre', u.classId));
      if (!secilen.length) {
        return bad(res, sadeceGirmeyen ? 'Seçilen kapsamda henüz giriş yapmamış öğrenci yok.' : 'Seçilen kapsamda öğrenci yok.');
      }
      if (secilen.length > 600) return bad(res, 'Tek seferde en fazla 600 öğrenci. Sınıf sınıf dağıt.');

      /* Veli kodu yalnızca öğrenci bilgilerini düzenleme yetkisi olana gider. */
      const kodGorur = yetkiVarMi(me, 'ogrenci.duzenle');
      const satirlar = secilen.map(u => ({ id: u.id, ad: u.fullName, sinif: adi.get(u.classId) || '',
        kullaniciAdi: u.username, sifre: rastgeleSifre(), veliKodu: kodGorur ? u.code : '' }));
      const ozetler = await hashPwToplu(satirlar.map(s => s.sifre));
      await islem(() => depo.kullanicilar.topluSifreYaz(me.schoolId, satirlar.map((s, i) => ({ id: s.id, ozet: ozetler[i] }))));
      await depo.genel.cokluBildir(satirlar.map(s => ({ kime: s.id,
        metin: 'Giriş bilgilerin okul yönetimi tarafından yenilendi. Şifreni Ayarlar sayfasından değiştirebilirsin.',
        baglanti: '#/profil' })));
      await islemYaz(me, 'sifre.toplu-dagitildi', sinifAdi + ': ' + satirlar.length + ' öğrenci', req);

      satirlar.sort((a, b) => a.sinif.localeCompare(b.sinif, 'tr') || a.ad.localeCompare(b.ad, 'tr'));
      /* Veli kodu kâğıtta ve Excel'de 5'erli gruplar hâlinde ("Ab3#k Qx9+m Pt7?z"). */
      const kod = k => kisiKoduBicim(k || '');
      const xlsxVeri = aktarim.disa('Giriş bilgileri',
        ['Ad Soyad', 'Sınıf', 'Kullanıcı adı', 'Şifre'].concat(kodGorur ? ['Veli kodu'] : []),
        satirlar.map(s => [s.ad, s.sinif, s.kullaniciAdi, s.sifre].concat(kodGorur ? [kod(s.veliKodu)] : [])),
        [26, 10, 22, 16, 20]);
      res.setHeader('Cache-Control', 'no-store');
      return ok(res, {
        adet: satirlar.length, kapsam: sinifAdi, okul: me._okulAdi || '',
        satirlar: satirlar.map(s => ({ ad: s.ad, sinif: s.sinif, kullaniciAdi: s.kullaniciAdi, sifre: s.sifre,
          veliKodu: kod(s.veliKodu) })),
        xlsx: xlsxVeri.toString('base64')
      });
    }

    if (sub === 'student-code-reset' && method === 'POST') {
      if (!yetkiGerek('ogrenci.duzenle')) return;
      const st = await okulOgrencisi(me, body.studentId);
      if (!st) return bad(res, 'Öğrenci bulunamadı');
      const code = await depo.kullanicilar.yeniKisiKodu();
      await depo.kullanicilar.guncelle(st.id, { code });
      return ok(res, { code: code });
    }

    /* ---------- sınıflar ---------- */

    if (sub === 'classes' && method === 'GET') {
      if (!yetkiGerek('sinif.yonet')) return;
      /* Sınıf özetleri (öğrenci, ders, öğretmensiz ders sayısı) tek sorguda. */
      const [liste, sinifsiz] = await Promise.all([
        depo.siniflar.ozetleri(me.schoolId),
        depo.kullanicilar.okulun(me.schoolId, { rol: 'student', sinifsiz: true })
      ]);
      return ok(res, {
        classes: liste,
        gunSayisi: GUN_SAYISI,
        gunAdlari: GUN_ADLARI,
        /* Sınıfı olmayan öğrenciler müdürün dikkatini çeksin */
        sinifsiz: sinifsiz.length
      });
    }

    if (sub === 'class' && method === 'POST') {
      if (!yetkiGerek('sinif.yonet')) return;
      const ad = sinifAdiDuzelt(clean(body.name, 30));
      if (!ad) return bad(res, 'Sınıf adı gerekli (ör. 7-A)');
      const mevcut = await depo.siniflar.okulun(me.schoolId);
      if (mevcut.some(c => c.name.toLocaleLowerCase('tr') === ad.toLocaleLowerCase('tr'))) {
        return bad(res, 'Bu adda bir sınıf zaten var');
      }
      if (mevcut.length >= 200) return bad(res, 'Sınıf sayısı sınırına ulaşıldı');
      const c = { id: uid('c'), schoolId: me.schoolId, name: ad, createdAt: now() };
      await depo.siniflar.ekle(c);
      return ok(res, { class: await sinifOzeti(c) });
    }

    if (sub === 'class-delete' && method === 'POST') {
      if (!yetkiGerek('sinif.yonet')) return;
      const c = await depo.siniflar.bul(clean(body.classId, 60));
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      /* Sınıf silinince öğrenciler sınıfsız kalır, dersleri ve programı
         temizlenir: ikisi de yabancı anahtar kuralıyla (SET NULL / CASCADE). */
      await depo.siniflar.sil(c.id);
      return ok(res);
    }

    if (sub === 'class-assign' && method === 'POST') {
      const hedefSinif = clean(body.classId, 60);
      if (!yetkiGerek('ogrenci.yerlestir', hedefSinif ? { sinif: hedefSinif } : null)) return;
      const st = await okulOgrencisi(me, body.studentId);
      if (!st) return bad(res, 'Öğrenci bulunamadı');
      /* Rolde sınıf kapsamı varsa öğrencinin şimdiki sınıfı da kapsamda olmalı:
         kapsam dışındaki öğrenci sınıfsız bırakılamaz, başka sınıfa alınamaz. */
      if (st.classId && !yetkiVarMi(me, 'ogrenci.yerlestir', { sinif: st.classId })) {
        return bad(res, 'Bu öğrencinin sınıfı için yetkin yok', 403);
      }
      if (!hedefSinif) {
        await depo.kullanicilar.guncelle(st.id, { classId: '' });
      } else {
        const c = await depo.siniflar.bul(hedefSinif);
        if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
        await depo.kullanicilar.guncelle(st.id, { classId: c.id });
        await bildir(st.id, c.name + ' sınıfına yerleştirildin.');
      }
      return ok(res);
    }

    /* ---------- dersler ---------- */

    if (sub === 'lessons' && method === 'GET') {
      const cid = clean(q.get('classId'), 60);
      const c = await depo.siniflar.bul(cid);
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      if (!yetkiGerek('ders.yonet', { sinif: c.id })) return;
      const dersler = (await depo.siniflar.sinifinDersleri(c.id)).map(dersOzeti);
      const ogretmenler = (await depo.kullanicilar.okulun(me.schoolId, { roller: ['teacher', 'principal'], durum: 'approved' }))
        .map(u => ({ id: u.id, fullName: u.fullName, branch: branchOf(u) }));
      return ok(res, {
        class: { id: c.id, name: c.name },
        lessons: dersler,
        teachers: ogretmenler,
        subjects: SUBJECTS
      });
    }

    if (sub === 'lesson' && method === 'POST') {
      const c = await depo.siniflar.bul(clean(body.classId, 60));
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      if (!yetkiGerek('ders.yonet', { sinif: c.id })) return;
      const subject = clean(body.subject, 60);
      if (SUBJECTS.indexOf(subject) < 0) return bad(res, 'Geçerli bir ders seç');
      if (await depo.siniflar.dersVarMi(c.id, subject)) {
        return bad(res, 'Bu ders bu sınıfa zaten eklenmiş');
      }
      const saat = Math.max(0, Math.min(20, parseInt(body.weeklyHours, 10) || 0));
      const l = {
        id: uid('d'), schoolId: me.schoolId, classId: c.id,
        subject: subject, teacherId: '', weeklyHours: saat, createdAt: now()
      };
      await depo.siniflar.dersEkle(l);
      return ok(res, { lesson: dersOzeti(await depo.siniflar.dersBul(l.id)) });
    }

    if (sub === 'lesson-update' && method === 'POST') {
      const l = await depo.siniflar.dersBul(clean(body.lessonId, 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yetkiGerek('ders.ogretmen-ata', { ders: l.subject, sinif: l.classId })) return;

      const d = {};
      let atanan = null;
      if (body.teacherId !== undefined) {
        const tid = clean(body.teacherId, 60);
        if (!tid) {
          d.teacherId = '';
        } else {
          const t = await depo.kullanicilar.bul(tid);
          if (!t || !isTeacherLike(t) || t.schoolId !== me.schoolId || t.status !== 'approved') {
            return bad(res, 'Öğretmen bulunamadı');
          }
          /* Öğretmenin rolü onu bu derse atanabilir kılıyor mu? */
          if (!yetkiVarMi(t, 'derse-atanabilir', { ders: l.subject, sinif: l.classId })) {
            return bad(res, t.fullName + ' bu derse atanamaz — rolündeki ders kapsamı izin vermiyor');
          }
          d.teacherId = t.id;
          if (l.teacherId !== t.id) atanan = t;
        }
      }
      if (body.weeklyHours !== undefined) {
        d.weeklyHours = Math.max(0, Math.min(20, parseInt(body.weeklyHours, 10) || 0));
      }
      await depo.siniflar.dersGuncelle(l.id, d);
      if (atanan) await bildir(atanan.id, dersEtiketi(l) + ' dersi sana atandı.');
      return ok(res, {
        lesson: dersOzeti(await depo.siniflar.dersBul(l.id)),
        cakismalar: await cakismalariBul(me.schoolId)
      });
    }

    if (sub === 'lesson-delete' && method === 'POST') {
      const l = await depo.siniflar.dersBul(clean(body.lessonId, 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yetkiGerek('ders.yonet', { sinif: l.classId })) return;
      await depo.siniflar.dersSil(l.id);   // programdaki saatleri de gider
      return ok(res);
    }

    /* ---------- haftalık ders programı ---------- */

    if (sub === 'schedule' && method === 'GET') {
      if (!yetkiGerek('program.duzenle')) return;
      const cid = clean(q.get('classId'), 60);
      const c = await depo.siniflar.bul(cid);
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      /* Okumak da kapsama tabi: rolü 7-A ile sınırlıysa 7-B'yi göremesin. */
      if (!yetkiGerek('program.duzenle', { sinif: c.id })) return;

      const [program, dersler, cakismalar] = await Promise.all([
        depo.siniflar.sinifinProgrami(c.id),
        depo.siniflar.sinifinDersleri(c.id),
        cakismalariBul(me.schoolId)
      ]);

      return ok(res, {
        class: { id: c.id, name: c.name },
        gunSayisi: GUN_SAYISI,
        gunAdlari: GUN_ADLARI,
        cells: program.map(sp => ({
          id: sp.id, day: sp.day, start: sp.start, end: sp.end,
          lessonId: sp.lessonId,
          subject: sp._ders || '(silinmiş ders)',
          teacherName: sp._ogretmenAdi || ''
        })),
        lessons: dersler.map(dersOzeti),
        cakismalar: cakismalar
      });
    }

    /* Programa yeni bir ders saati ekler. Saatleri müdür kendisi belirler. */
    if (sub === 'schedule-add' && method === 'POST') {
      const c = await depo.siniflar.bul(clean(body.classId, 60));
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      if (!yetkiGerek('program.duzenle', { sinif: c.id })) return;

      const gun = parseInt(body.day, 10);
      if (!(gun >= 1 && gun <= GUN_SAYISI)) return bad(res, 'Geçersiz gün');

      const bas = saatDuzelt(body.start);
      const bit = saatDuzelt(body.end);
      if (!bas) return bad(res, 'Başlangıç saatini SS:DD biçiminde gir (ör. 09:20)');
      if (!bit) return bad(res, 'Bitiş saatini SS:DD biçiminde gir (ör. 10:00)');
      const bd = saatDakika(bas), td = saatDakika(bit);
      if (td <= bd) return bad(res, 'Bitiş saati başlangıçtan sonra olmalı');
      if (td - bd > 8 * 60) return bad(res, 'Bir ders 8 saatten uzun olamaz');

      const l = await depo.siniflar.dersBul(clean(body.lessonId, 60));
      if (!l || l.classId !== c.id) return bad(res, 'Bu sınıfa ait bir ders seç');

      /* Kaydetmeden önce uyar: müdür yine de ekleyebilir, engellemiyoruz. */
      const uyari = await aralikCakismasi(me.schoolId, c.id, l.teacherId, gun, bd, td, null);

      const kayit = {
        id: uid('p'), schoolId: me.schoolId, classId: c.id, lessonId: l.id,
        day: gun, start: bas, end: bit, yilId: await yilDamgasi(me), createdAt: now()
      };
      await depo.siniflar.programEkle(kayit);

      /* Müdür programı kurarken öğretmene her ders saati için ayrı bildirim
         gitmesin (30 saat = 30 bildirim olurdu): öğretmen başına günde bir. */
      if (l.teacherId) {
        const gunAnahtari = new Date().toISOString().slice(0, 10);
        const ilk = await depo.genel.ilkKezOlanlar(['program:' + l.teacherId + ':' + gunAnahtari]);
        if (ilk.size) {
          await bildir(l.teacherId, 'Ders programına yeni ders saatlerin eklendi. Programından bakabilirsin.', '#/programim');
        }
      }
      return ok(res, { kayit: kayit, uyari: uyari, cakismalar: await cakismalariBul(me.schoolId) });
    }

    /* Var olan bir ders saatini günceller (saat/gün/ders değiştirme). */
    if (sub === 'schedule-update' && method === 'POST') {
      const sp = await depo.siniflar.programBul(clean(body.scheduleId, 60));
      if (!sp || sp.schoolId !== me.schoolId) return bad(res, 'Ders saati bulunamadı');
      if (!yetkiGerek('program.duzenle', { sinif: sp.classId })) return;

      const gun = body.day === undefined ? sp.day : parseInt(body.day, 10);
      if (!(gun >= 1 && gun <= GUN_SAYISI)) return bad(res, 'Geçersiz gün');

      const bas = body.start === undefined ? sp.start : saatDuzelt(body.start);
      const bit = body.end === undefined ? sp.end : saatDuzelt(body.end);
      if (!bas || !bit) return bad(res, 'Saatleri SS:DD biçiminde gir');
      const bd = saatDakika(bas), td = saatDakika(bit);
      if (td <= bd) return bad(res, 'Bitiş saati başlangıçtan sonra olmalı');

      if (td - bd > 8 * 60) return bad(res, 'Bir ders 8 saatten uzun olamaz');

      let ders = await depo.siniflar.dersBul(sp.lessonId);
      if (body.lessonId !== undefined) {
        const yeni = await depo.siniflar.dersBul(clean(body.lessonId, 60));
        if (!yeni || yeni.classId !== sp.classId) return bad(res, 'Bu sınıfa ait bir ders seç');
        ders = yeni;
      }

      const uyari = await aralikCakismasi(me.schoolId, sp.classId,
        ders ? ders.teacherId : '', gun, bd, td, sp.id);

      const yeniKayit = { lessonId: ders ? ders.id : sp.lessonId, day: gun, start: bas, end: bit };
      await depo.siniflar.programGuncelle(sp.id, yeniKayit);
      return ok(res, {
        kayit: {
          id: sp.id, schoolId: sp.schoolId, classId: sp.classId, lessonId: yeniKayit.lessonId,
          day: gun, start: bas, end: bit, yilId: sp.yilId, createdAt: sp.createdAt
        },
        uyari: uyari,
        cakismalar: await cakismalariBul(me.schoolId)
      });
    }

    if (sub === 'schedule-delete' && method === 'POST') {
      const sp = await depo.siniflar.programBul(clean(body.scheduleId, 60));
      if (!sp || sp.schoolId !== me.schoolId) return bad(res, 'Ders saati bulunamadı');
      if (!yetkiGerek('program.duzenle', { sinif: sp.classId })) return;
      await depo.siniflar.programSil(sp.id);
      return ok(res, { cakismalar: await cakismalariBul(me.schoolId) });
    }

    if (sub === 'cakismalar' && method === 'GET') {
      if (!yetkiGerek('program.duzenle')) return;
      return ok(res, { cakismalar: await cakismalariBul(me.schoolId) });
    }

    /* Öğretmen-öğrenci ilişkisi yalnızca sınıf ve ders üzerinden kurulur;
       öğrenciyi tek tek öğretmene atayan bir uç yoktur. */
  }

  return false;
}

module.exports = {
  AKTARIM_SINIR,
  AKTARIM_DOSYA_SINIR,
  xlsxGonder,
  uclar
};
