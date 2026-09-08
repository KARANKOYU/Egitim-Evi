'use strict';
/* Müdürün okul yönetimi (/api/school).
   Sınıflar, dersler, ders programı, öğrenci ve öğretmen hesapları,
   özel roller, Excel içe/dışa aktarım. */

const eposta = require('../yardimci/eposta');
const xlsx = require('../yardimci/xlsx');
const aktarim = require('../yardimci/aktarim');
const { bad, baslikEkle, ok } = require('../http');
const {
  GUN_ADLARI, GUN_SAYISI, aralikCakismasi, branchOf, cakismalariBul, dersEtiketi,
  dersOzeti, isTeacherLike, programSirali, saatDakika, saatDuzelt, sinifOgrencileri,
  sinifOzeti, studentsOfTeacher, teachersOfStudent
} = require('../iliskiler');
const {
  SUBJECTS, clean, gunTarih, makeCode, normEmail, now,
  sifreSorunu, uid
} = require('../ortak');
const { hashPw } = require('../sifre');
const { byId, classById, db, lessonById, notify, save, userById } = require('../veri');
const {
  OGRETMEN_VARSAYILAN, TUM_YETKILER, YETKILER, kapsamTemizle, pub, rolOzeti,
  roleById, yetkiVarMi
} = require('../yetki');
const { yilDamgasi, yilSuz } = require('./egitim-yili');
const { islemYaz } = require('./islem-kaydi');
const { odevSaati } = require('./odev');

/* ============ Excel aktarımı ============ */

/* Tek dosyada işlenecek en fazla satır. Toplu hesap açma şifre karması
   üretiyor; sınırsız bırakırsak tek istek sunucuyu uzun süre meşgul eder. */
const AKTARIM_SINIR = 300;

/* Gövde sınırı 2 MB ham JSON; base64 dosyayı üçte bir büyütüyor. */
const AKTARIM_DOSYA_SINIR = 1300000;

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

    /* ---------- Excel içe ve dışa aktarım ---------- */

    if (sub === 'aktarim-sablon' && method === 'GET') {
      if (!yetkiGerek('aktarim.yap')) return;
      const tur = clean(q.get('tur'), 20);
      if (tur !== 'ogrenci' && tur !== 'program') return bad(res, 'Bilinmeyen şablon');
      let veri;
      try { veri = aktarim.sablon(tur); }
      catch (e) { return bad(res, 'Şablon üretilemedi: ' + e.message, 500); }
      return xlsxGonder(res, veri,
        (tur === 'ogrenci' ? 'ogrenci-listesi' : 'ders-programi') + '-sablon.xlsx');
    }

    if (sub === 'aktarim-disa' && method === 'GET') {
      if (!yetkiGerek('aktarim.yap')) return;
      const tur = clean(q.get('tur'), 20);
      const okulSinif = db.classes.filter(c => c.schoolId === me.schoolId);
      const sinifAdi = id => {
        const c = okulSinif.find(x => x.id === id);
        return c ? c.name : '';
      };

      if (tur === 'ogrenci') {
        const satirlar = db.users
          .filter(u => u.role === 'student' && u.schoolId === me.schoolId)
          .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'))
          .map(u => [u.fullName, u.email, sinifAdi(u.classId), u.code,
            u.note || '', gunTarih(u.createdAt)]);
        return xlsxGonder(res, aktarim.disa('Öğrenciler',
          ['Ad Soyad', 'Kullanıcı adı (e-posta)', 'Sınıf', 'Giriş kodu',
            'Müdür notu', 'Kayıt tarihi'],
          satirlar, [26, 30, 10, 14, 30, 14]), 'ogrenciler.xlsx');
      }

      if (tur === 'ogretmen') {
        const satirlar = db.users
          .filter(u => u.role === 'teacher' && u.schoolId === me.schoolId &&
            u.status === 'approved')
          .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'))
          .map(u => {
            const dersleri = db.lessons.filter(l => l.teacherId === u.id);
            const dersAd = [];
            const sinifAd = [];
            for (const l of dersleri) {
              if (dersAd.indexOf(l.subject) < 0) dersAd.push(l.subject);
              const sn = sinifAdi(l.classId);
              if (sn && sinifAd.indexOf(sn) < 0) sinifAd.push(sn);
            }
            return [u.fullName, u.email, branchOf(u), dersAd.join(', '),
              sinifAd.join(', '), gunTarih(u.createdAt)];
          });
        return xlsxGonder(res, aktarim.disa('Öğretmenler',
          ['Ad Soyad', 'E-posta', 'Branş', 'Verdiği dersler', 'Sınıflar',
            'Kayıt tarihi'],
          satirlar, [26, 30, 18, 30, 20, 14]), 'ogretmenler.xlsx');
      }

      if (tur === 'program') {
        const satirlar = db.schedule
          .filter(sp => sp.schoolId === me.schoolId)
          .map(sp => {
            const l = byId(db.lessons, sp.lessonId);
            const t = l && l.teacherId ? userById(l.teacherId) : null;
            return {
              sinif: sinifAdi(sp.classId), gun: sp.day, bas: sp.start,
              satir: [sinifAdi(sp.classId), aktarim.GUNLER[sp.day] || '',
                sp.start, sp.end, l ? l.subject : '', t ? t.fullName : '']
            };
          })
          .sort((a, b) => a.sinif.localeCompare(b.sinif, 'tr') ||
            a.gun - b.gun || a.bas.localeCompare(b.bas))
          .map(x => x.satir);
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
      if (tur !== 'ogrenci' && tur !== 'program') return bad(res, 'Bilinmeyen aktarım türü');
      if (tur === 'ogrenci' && !yetkiGerek('ogrenci.hesap-ac')) return;

      const b64 = String(body.dosya || '');
      if (!b64) return bad(res, 'Dosya seçilmedi');
      if (b64.length > AKTARIM_DOSYA_SINIR) {
        return bad(res, 'Dosya çok büyük. Listeyi bölüp iki dosya hâlinde yükle.');
      }

      const ham = Buffer.from(b64, 'base64');
      if (ham.length < 100) return bad(res, 'Dosya boş ya da bozuk görünüyor');

      let sayfalar;
      try { sayfalar = xlsx.oku(ham); }
      catch (e) { return bad(res, e.message); }

      let cozum;
      try { cozum = aktarim.coz(tur, sayfalar); }
      catch (e) { return bad(res, e.message); }

      const rapor = cozum.hatalar.map(h => ({
        satir: h.satir, ad: '', durum: 'hata', mesaj: h.mesaj
      }));
      const hazir = [];
      const okulSinif = db.classes.filter(c => c.schoolId === me.schoolId);
      const sinifBul = ad => okulSinif.find(x =>
        aktarim.anahtarla(x.name) === aktarim.anahtarla(ad));

      /* ----- öğrenci listesi ----- */
      if (tur === 'ogrenci') {
        const gorulen = {};
        for (const k of cozum.kayitlar) {
          const sorun = [];
          const ad = clean(k.ad, 80);
          if (ad.split(/\s+/).filter(Boolean).length < 2) sorun.push('Ad ve soyad gerekli');

          const eposta = normEmail(k.eposta);
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(eposta)) {
            sorun.push('Kullanıcı adı e-posta biçiminde değil');
          } else if (db.users.some(u => u.email === eposta)) {
            sorun.push('Bu kullanıcı adı zaten kayıtlı');
          } else if (gorulen[eposta]) {
            sorun.push('Bu kullanıcı adı dosyada ' + gorulen[eposta] + '. satırda da var');
          }

          const ps = sifreSorunu(k.sifre);
          if (ps) sorun.push(ps);

          let classId = '';
          if (k.sinif) {
            const c = sinifBul(k.sinif);
            if (!c) sorun.push('"' + k.sinif + '" adında bir sınıf yok');
            else classId = c.id;
          }

          if (sorun.length) {
            rapor.push({ satir: k.satir, ad: k.ad, durum: 'hata', mesaj: sorun.join('; ') });
            continue;
          }
          gorulen[eposta] = k.satir;
          hazir.push({ satir: k.satir, ad, eposta, sifre: k.sifre, classId });
          rapor.push({
            satir: k.satir, ad: ad, durum: 'hazir',
            mesaj: 'Hesap açılacak' + (k.sinif ? ' — ' + k.sinif : ' — sınıfsız')
          });
        }

        if (!body.uygula) {
          return ok(res, {
            onizleme: true, tur, hazir: hazir.length,
            hatali: rapor.filter(r => r.durum === 'hata').length,
            sinir: AKTARIM_SINIR, rapor: rapor.sort((a, b) => a.satir - b.satir)
          });
        }

        if (!hazir.length) return bad(res, 'Açılacak hesap yok — dosyadaki satırların hepsi hatalı.');
        if (hazir.length > AKTARIM_SINIR) {
          return bad(res, 'Tek seferde en fazla ' + AKTARIM_SINIR +
            ' hesap açılabilir. Dosyada ' + hazir.length + ' geçerli satır var.');
        }

        /* Şifre karmaları paralel üretiliyor; tek tek beklersek 300 satır
           dakikalar sürer. */
        const karmalar = await Promise.all(hazir.map(h => hashPw(String(h.sifre))));

        const acilan = [];
        for (let i = 0; i < hazir.length; i++) {
          const h = hazir[i];
          if (db.users.some(u => u.email === h.eposta)) continue;   /* yarış koruması */
          let code = makeCode();
          while (db.users.some(x => x.code === code)) code = makeCode();
          const u = {
            id: uid('u'), email: h.eposta, pass: karmalar[i], fullName: h.ad,
            role: 'student', status: 'approved', schoolId: me.schoolId,
            city: me.city, district: me.district, address: '',
            grade: '', classId: h.classId, code: code, note: '',
            createdBy: me.id, createdAt: now()
          };
          db.users.push(u);
          acilan.push({ ad: u.fullName, eposta: u.email, kod: u.code });
        }
        save();
        console.log('  Excel ile ' + acilan.length + ' öğrenci hesabı açıldı (' +
          me.email + ')');
        islemYaz(me, 'hesap.toplu-acildi', acilan.length + ' hesap', req);
        return ok(res, {
          uygulandi: true, acilan: acilan.length, ogrenciler: acilan,
          message: acilan.length + ' öğrenci hesabı açıldı.'
        });
      }

      /* ----- ders programı ----- */
      const eklenecek = [];
      const gorulenSaat = {};
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

        const dersler = db.lessons.filter(l => l.classId === c.id);
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

        const varOlan = db.schedule.some(sp => sp.schoolId === me.schoolId &&
          sp.classId === c.id && sp.lessonId === l.id && sp.day === k.gunNo &&
          sp.start === k.baslangic);
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

        const uyari = aralikCakismasi(me.schoolId, c.id, l.teacherId,
          k.gunNo, bd, td, null);

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

      for (const e of eklenecek) {
        db.schedule.push({
          id: uid('p'), schoolId: me.schoolId, classId: e.c.id, lessonId: e.l.id,
          day: e.gun, start: e.bas, end: e.bit, yilId: yilDamgasi(me), createdAt: now()
        });
      }
      save();
      console.log('  Excel ile ' + eklenecek.length + ' ders saati eklendi (' +
        me.email + ')');
      islemYaz(me, 'program.toplu-eklendi', eklenecek.length + ' ders saati', req);
      return ok(res, {
        uygulandi: true, eklenen: eklenecek.length,
        cakismalar: cakismalariBul(me.schoolId),
        message: eklenecek.length + ' ders saati programa eklendi.'
      });
    }

    /* ---------- roller ---------- */

    if (sub === 'permissions' && method === 'GET') {
      return ok(res, { gruplar: YETKILER, ogretmenVarsayilan: OGRETMEN_VARSAYILAN });
    }

    if (sub === 'roles' && method === 'GET') {
      if (!yetkiGerek('rol.yonet')) return;
      return ok(res, {
        roles: db.roles.filter(r => r.schoolId === me.schoolId)
          .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
          .map(rolOzeti)
      });
    }

    if (sub === 'role' && method === 'POST') {
      if (!yetkiGerek('rol.yonet')) return;
      const ad = clean(body.name, 40);
      if (!ad) return bad(res, 'Rol adı gerekli');
      if (db.roles.some(r => r.schoolId === me.schoolId &&
        r.name.toLocaleLowerCase('tr') === ad.toLocaleLowerCase('tr'))) {
        return bad(res, 'Bu adda bir rol zaten var');
      }
      const izinler = (Array.isArray(body.permissions) ? body.permissions : [])
        .map(x => String(x)).filter(x => TUM_YETKILER.indexOf(x) >= 0);
      const r = {
        id: uid('r'), schoolId: me.schoolId, name: ad,
        permissions: izinler, kapsam: kapsamTemizle(body.kapsam, izinler, me.schoolId),
        createdAt: now()
      };
      db.roles.push(r);
      save();
      return ok(res, { role: rolOzeti(r) });
    }

    if (sub === 'role-update' && method === 'POST') {
      if (!yetkiGerek('rol.yonet')) return;
      const r = roleById(clean(body.roleId, 60));
      if (!r || r.schoolId !== me.schoolId) return bad(res, 'Rol bulunamadı');
      if (body.name !== undefined) {
        const ad = clean(body.name, 40);
        if (!ad) return bad(res, 'Rol adı gerekli');
        if (db.roles.some(x => x.schoolId === me.schoolId && x.id !== r.id &&
          x.name.toLocaleLowerCase('tr') === ad.toLocaleLowerCase('tr'))) {
          return bad(res, 'Bu adda bir rol zaten var');
        }
        r.name = ad;
      }
      if (Array.isArray(body.permissions)) {
        r.permissions = body.permissions.map(x => String(x))
          .filter(x => TUM_YETKILER.indexOf(x) >= 0);
      }
      if (body.kapsam !== undefined) {
        r.kapsam = kapsamTemizle(body.kapsam, r.permissions, me.schoolId);
      }
      save();
      return ok(res, { role: rolOzeti(r) });
    }

    if (sub === 'role-delete' && method === 'POST') {
      if (!yetkiGerek('rol.yonet')) return;
      const r = roleById(clean(body.roleId, 60));
      if (!r || r.schoolId !== me.schoolId) return bad(res, 'Rol bulunamadı');
      db.users.forEach(u => { if (u.customRoleId === r.id) u.customRoleId = ''; });
      db.roles = db.roles.filter(x => x.id !== r.id);
      save();
      return ok(res);
    }

    if (sub === 'role-assign' && method === 'POST') {
      if (!yetkiGerek('rol.yonet')) return;
      const t = userById(clean(body.userId, 60));
      if (!t || t.role !== 'teacher' || t.schoolId !== me.schoolId) {
        return bad(res, 'Öğretmen bulunamadı');
      }
      const rid = clean(body.roleId, 60);
      if (!rid) {
        t.customRoleId = '';
      } else {
        const r = roleById(rid);
        if (!r || r.schoolId !== me.schoolId) return bad(res, 'Rol bulunamadı');
        t.customRoleId = r.id;
        notify(t.id, 'Sana "' + r.name + '" rolü verildi. Menünde yeni bölümler görebilirsin.');
      }
      save();
      return ok(res, { user: pub(t) });
    }

    if (sub === 'teachers' && method === 'GET') {
      if (!yetkiGerek('ogretmen.duzenle')) return;
      const list = db.users.filter(u => u.role === 'teacher' && u.schoolId === me.schoolId)
        .map(u => Object.assign(pub(u), { studentCount: studentsOfTeacher(u.id).length }));
      return ok(res, { teachers: list });
    }
    if (sub === 'teacher-decide' && method === 'POST') {
      if (!yetkiGerek('ogretmen.onayla')) return;
      const t = userById(clean(body.userId, 60));
      if (!t || t.role !== 'teacher' || t.schoolId !== me.schoolId) return bad(res, 'Öğretmen bulunamadı');
      t.status = body.approve ? 'approved' : 'rejected';
      notify(t.id, body.approve
        ? 'Öğretmenlik başvurun müdür tarafından onaylandı.'
        : 'Öğretmenlik başvurun reddedildi.');
      save();
      return ok(res, { user: pub(t) });
    }
    if (sub === 'students' && method === 'GET') {
      if (!yetkiGerek('ogrenci.duzenle')) return;
      const list = db.users.filter(u => u.role === 'student' && u.schoolId === me.schoolId)
        .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'))
        .map(u => {
          const c = u.classId ? classById(u.classId) : null;
          return {
            id: u.id, fullName: u.fullName, email: u.email, code: u.code, grade: u.grade || '',
            classId: u.classId || '', className: c ? c.name : '', note: u.note || '',
            olusturan: u.createdBy ? 'okul' : 'kendisi',
            teachers: teachersOfStudent(u.id).map(t => ({ id: t.id, fullName: t.fullName, branch: branchOf(t) }))
          };
        });
      return ok(res, { students: list });
    }
    if (sub === 'teacher-list' && method === 'GET') {
      if (!yetkiGerek('ders.ogretmen-ata')) return;
      const list = db.users.filter(u => isTeacherLike(u) && u.schoolId === me.schoolId && u.status === 'approved')
        .map(u => ({ id: u.id, fullName: u.fullName, branch: branchOf(u), role: u.role }))
        .sort((a, b) => a.branch.localeCompare(b.branch, 'tr'));
      return ok(res, { teachers: list });
    }
    /* Müdür ödevlere ders bazlı bakar: hangi ders, hangi öğretmen, ne vermiş. */
    if (sub === 'assignments' && method === 'GET') {
      if (!yetkiGerek('ders.yonet')) return;

      const cid = clean(q.get('classId'), 60);
      let dersler = db.lessons.filter(l => l.schoolId === me.schoolId);
      if (cid) dersler = dersler.filter(l => l.classId === cid);

      const liste = dersler
        .sort((a, b) => {
          const ca = classById(a.classId), cb = classById(b.classId);
          return ((ca ? ca.name : '').localeCompare(cb ? cb.name : '', 'tr')) ||
                 a.subject.localeCompare(b.subject, 'tr');
        })
        .map(l => {
          const c = classById(l.classId);
          const t = l.teacherId ? userById(l.teacherId) : null;
          const sinifOgr = sinifOgrencileri(l.classId).map(s => s.id);

          /* Bu sınıfın öğrencilerine bu dersten verilmiş bütün ödevler.
             Ödevi dersin kendi öğretmeni vermemiş olabilir (vekil, zümre);
             müdür hepsini görmeli, veren kişi zaten yanında yazıyor. */
          const odevler = yilSuz(me, db.assignments)
            .filter(a => a.subject === l.subject &&
              a.studentIds.some(id => sinifOgr.indexOf(id) >= 0))
            .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
            .map(a => {
              const ver = userById(a.teacherId);
              return {
                id: a.id, title: a.title, description: a.description,
                startAt: a.startAt, endAt: a.endAt, endTime: odevSaati(a), status: a.status,
                teacherName: ver ? ver.fullName : '(silinmiş)',
                studentCount: a.studentIds.filter(id => sinifOgr.indexOf(id) >= 0).length
              };
            });

          return {
            lessonId: l.id, subject: l.subject,
            classId: l.classId, className: c ? c.name : '',
            teacherName: t ? t.fullName : '',
            weeklyHours: l.weeklyHours || 0,
            assignments: odevler
          };
        });

      return ok(res, {
        lessons: liste,
        classes: db.classes.filter(c => c.schoolId === me.schoolId)
          .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
          .map(c => ({ id: c.id, name: c.name }))
      });
    }

    /* ---------- öğrenci hesapları (müdür açar) ---------- */

    if (sub === 'student-create' && method === 'POST') {
      if (!yetkiGerek('ogrenci.hesap-ac')) return;
      const fullName = clean(body.fullName, 80);
      if (fullName.split(/\s+/).filter(Boolean).length < 2) return bad(res, 'Ad ve soyad yaz');

      const email = normEmail(body.email);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return bad(res, 'Geçerli bir kullanıcı adı (e-posta) gir');
      if (db.users.some(u => u.email === email)) return bad(res, 'Bu kullanıcı adı zaten kayıtlı');

      const sorun = sifreSorunu(body.password);
      if (sorun) return bad(res, sorun);

      let classId = '';
      if (body.classId) {
        const c = classById(clean(body.classId, 60));
        if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
        classId = c.id;
      }

      let code = makeCode();
      while (db.users.some(x => x.code === code)) code = makeCode();

      const u = {
        id: uid('u'), email, pass: await hashPw(String(body.password)), fullName,
        role: 'student', status: 'approved', schoolId: me.schoolId,
        city: me.city, district: me.district, address: '',
        grade: clean(body.grade, 20), classId: classId, code: code,
        note: clean(body.note, 300),
        createdBy: me.id, createdAt: now()
      };
      db.users.push(u);
      save();
      return ok(res, {
        student: { id: u.id, fullName: u.fullName, email: u.email, code: u.code, classId: u.classId },
        message: fullName + ' hesabı açıldı.'
      });
    }

    if (sub === 'student-update' && method === 'POST') {
      if (!yetkiGerek('ogrenci.duzenle')) return;
      const st = userById(clean(body.studentId, 60));
      if (!st || st.role !== 'student' || st.schoolId !== me.schoolId) return bad(res, 'Öğrenci bulunamadı');

      if (body.fullName !== undefined) {
        const ad = clean(body.fullName, 80);
        if (ad.split(/\s+/).filter(Boolean).length < 2) return bad(res, 'Ad ve soyad yaz');
        st.fullName = ad;
      }
      if (body.email !== undefined) {
        const email = normEmail(body.email);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return bad(res, 'Geçerli bir kullanıcı adı gir');
        if (db.users.some(u => u.email === email && u.id !== st.id)) return bad(res, 'Bu kullanıcı adı başkasında kayıtlı');
        st.email = email;
      }
      if (body.grade !== undefined) st.grade = clean(body.grade, 20);
      if (body.note !== undefined) st.note = clean(body.note, 300);
      save();
      return ok(res, {
        student: { id: st.id, fullName: st.fullName, email: st.email, grade: st.grade, note: st.note || '' }
      });
    }

    /* Şifreler geri döndürülemez biçimde saklandığı için görüntülenemez;
       müdür yalnızca yeni bir şifre belirleyebilir. */
    if (sub === 'student-password' && method === 'POST') {
      if (!yetkiGerek('ogrenci.sifre')) return;
      const st = userById(clean(body.studentId, 60));
      if (!st || st.role !== 'student' || st.schoolId !== me.schoolId) return bad(res, 'Öğrenci bulunamadı');
      const sorun = sifreSorunu(body.password);
      if (sorun) return bad(res, sorun);
      st.pass = await hashPw(String(body.password));

      /* Şifre değişince o hesabın açık oturumları düşsün. */
      for (const tok of Object.keys(db.sessions)) {
        if (db.sessions[tok].userId === st.id) delete db.sessions[tok];
      }
      notify(st.id, 'Şifren okul yönetimi tarafından değiştirildi.');
      save();
      return ok(res, { message: st.fullName + ' için yeni şifre kaydedildi.' });
    }

    if (sub === 'student-code-reset' && method === 'POST') {
      if (!yetkiGerek('ogrenci.duzenle')) return;
      const st = userById(clean(body.studentId, 60));
      if (!st || st.role !== 'student' || st.schoolId !== me.schoolId) return bad(res, 'Öğrenci bulunamadı');
      let code = makeCode();
      while (db.users.some(x => x.code === code)) code = makeCode();
      st.code = code;
      save();
      return ok(res, { code: code });
    }

    /* ---------- sınıflar ---------- */

    if (sub === 'classes' && method === 'GET') {
      if (!yetkiGerek('sinif.yonet')) return;
      const liste = db.classes
        .filter(c => c.schoolId === me.schoolId)
        .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
        .map(sinifOzeti);
      return ok(res, {
        classes: liste,
        gunSayisi: GUN_SAYISI,
        gunAdlari: GUN_ADLARI,
        /* Sınıfı olmayan öğrenciler müdürün dikkatini çeksin */
        sinifsiz: db.users.filter(u => u.role === 'student' && u.schoolId === me.schoolId && !u.classId).length
      });
    }

    if (sub === 'class' && method === 'POST') {
      if (!yetkiGerek('sinif.yonet')) return;
      const ad = clean(body.name, 30);
      if (!ad) return bad(res, 'Sınıf adı gerekli (ör. 7-A)');
      const ayni = db.classes.find(c => c.schoolId === me.schoolId &&
        c.name.toLocaleLowerCase('tr') === ad.toLocaleLowerCase('tr'));
      if (ayni) return bad(res, 'Bu adda bir sınıf zaten var');
      if (db.classes.filter(c => c.schoolId === me.schoolId).length >= 200) {
        return bad(res, 'Sınıf sayısı sınırına ulaşıldı');
      }
      const c = { id: uid('c'), schoolId: me.schoolId, name: ad, createdAt: now() };
      db.classes.push(c);
      save();
      return ok(res, { class: sinifOzeti(c) });
    }

    if (sub === 'class-delete' && method === 'POST') {
      if (!yetkiGerek('sinif.yonet')) return;
      const c = classById(clean(body.classId, 60));
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      /* Sınıf silinince öğrenciler sınıfsız kalır, dersleri ve programı temizlenir. */
      db.users.forEach(u => { if (u.classId === c.id) u.classId = ''; });
      const dersler = db.lessons.filter(l => l.classId === c.id).map(l => l.id);
      db.lessons = db.lessons.filter(l => l.classId !== c.id);
      db.schedule = db.schedule.filter(sp => dersler.indexOf(sp.lessonId) < 0 && sp.classId !== c.id);
      db.classes = db.classes.filter(x => x.id !== c.id);
      save();
      return ok(res);
    }

    if (sub === 'class-assign' && method === 'POST') {
      const hedefSinif = clean(body.classId, 60);
      if (!yetkiGerek('ogrenci.yerlestir', hedefSinif ? { sinif: hedefSinif } : null)) return;
      const st = userById(clean(body.studentId, 60));
      if (!st || st.role !== 'student' || st.schoolId !== me.schoolId) return bad(res, 'Öğrenci bulunamadı');
      const hedef = clean(body.classId, 60);
      if (!hedef) {
        st.classId = '';
      } else {
        const c = classById(hedef);
        if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
        st.classId = c.id;
        notify(st.id, c.name + ' sınıfına yerleştirildin.');
      }
      save();
      return ok(res);
    }

    /* ---------- dersler ---------- */

    if (sub === 'lessons' && method === 'GET') {
      const cid = clean(q.get('classId'), 60);
      const c = classById(cid);
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      if (!yetkiGerek('ders.yonet', { sinif: c.id })) return;
      const dersler = db.lessons.filter(l => l.classId === c.id)
        .sort((a, b) => a.subject.localeCompare(b.subject, 'tr'))
        .map(dersOzeti);
      const ogretmenler = db.users
        .filter(u => isTeacherLike(u) && u.schoolId === me.schoolId && u.status === 'approved')
        .map(u => ({ id: u.id, fullName: u.fullName, branch: branchOf(u) }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName, 'tr'));
      return ok(res, {
        class: { id: c.id, name: c.name },
        lessons: dersler,
        teachers: ogretmenler,
        subjects: SUBJECTS
      });
    }

    if (sub === 'lesson' && method === 'POST') {
      const c = classById(clean(body.classId, 60));
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      if (!yetkiGerek('ders.yonet', { sinif: c.id })) return;
      const subject = clean(body.subject, 60);
      if (SUBJECTS.indexOf(subject) < 0) return bad(res, 'Geçerli bir ders seç');
      if (db.lessons.some(l => l.classId === c.id && l.subject === subject)) {
        return bad(res, 'Bu ders bu sınıfa zaten eklenmiş');
      }
      const saat = Math.max(0, Math.min(20, parseInt(body.weeklyHours, 10) || 0));
      const l = {
        id: uid('d'), schoolId: me.schoolId, classId: c.id,
        subject: subject, teacherId: '', weeklyHours: saat, createdAt: now()
      };
      db.lessons.push(l);
      save();
      return ok(res, { lesson: dersOzeti(l) });
    }

    if (sub === 'lesson-update' && method === 'POST') {
      const l = lessonById(clean(body.lessonId, 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yetkiGerek('ders.ogretmen-ata', { ders: l.subject, sinif: l.classId })) return;

      if (body.teacherId !== undefined) {
        const tid = clean(body.teacherId, 60);
        if (!tid) {
          l.teacherId = '';
        } else {
          const t = userById(tid);
          if (!t || !isTeacherLike(t) || t.schoolId !== me.schoolId || t.status !== 'approved') {
            return bad(res, 'Öğretmen bulunamadı');
          }
          /* Öğretmenin rolü onu bu derse atanabilir kılıyor mu? */
          if (!yetkiVarMi(t, 'derse-atanabilir', { ders: l.subject, sinif: l.classId })) {
            return bad(res, t.fullName + ' bu derse atanamaz — rolündeki ders kapsamı izin vermiyor');
          }
          const eskiId = l.teacherId;
          l.teacherId = t.id;
          if (eskiId !== t.id) notify(t.id, dersEtiketi(l) + ' dersi sana atandı.');
        }
      }
      if (body.weeklyHours !== undefined) {
        l.weeklyHours = Math.max(0, Math.min(20, parseInt(body.weeklyHours, 10) || 0));
      }
      save();
      return ok(res, { lesson: dersOzeti(l), cakismalar: cakismalariBul(me.schoolId) });
    }

    if (sub === 'lesson-delete' && method === 'POST') {
      const l = lessonById(clean(body.lessonId, 60));
      if (!l || l.schoolId !== me.schoolId) return bad(res, 'Ders bulunamadı');
      if (!yetkiGerek('ders.yonet', { sinif: l.classId })) return;
      db.schedule = db.schedule.filter(sp => sp.lessonId !== l.id);
      db.lessons = db.lessons.filter(x => x.id !== l.id);
      save();
      return ok(res);
    }

    /* ---------- haftalık ders programı ---------- */

    if (sub === 'schedule' && method === 'GET') {
      if (!yetkiGerek('program.duzenle')) return;
      const cid = clean(q.get('classId'), 60);
      const c = classById(cid);
      if (!c || c.schoolId !== me.schoolId) return bad(res, 'Sınıf bulunamadı');
      /* Okumak da kapsama tabi: rolü 7-A ile sınırlıysa 7-B'yi göremesin. */
      if (!yetkiGerek('program.duzenle', { sinif: c.id })) return;

      const dersler = programSirali(db.schedule.filter(sp => sp.classId === c.id))
        .map(sp => {
          const l = lessonById(sp.lessonId);
          const t = l && l.teacherId ? userById(l.teacherId) : null;
          return {
            id: sp.id, day: sp.day, start: sp.start, end: sp.end,
            lessonId: sp.lessonId,
            subject: l ? l.subject : '(silinmiş ders)',
            teacherName: t ? t.fullName : ''
          };
        });

      return ok(res, {
        class: { id: c.id, name: c.name },
        gunSayisi: GUN_SAYISI,
        gunAdlari: GUN_ADLARI,
        cells: dersler,
        lessons: db.lessons.filter(l => l.classId === c.id)
          .sort((a, b) => a.subject.localeCompare(b.subject, 'tr'))
          .map(dersOzeti),
        cakismalar: cakismalariBul(me.schoolId)
      });
    }

    /* Programa yeni bir ders saati ekler. Saatleri müdür kendisi belirler. */
    if (sub === 'schedule-add' && method === 'POST') {
      const c = classById(clean(body.classId, 60));
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

      const l = lessonById(clean(body.lessonId, 60));
      if (!l || l.classId !== c.id) return bad(res, 'Bu sınıfa ait bir ders seç');

      /* Kaydetmeden önce uyar: müdür yine de ekleyebilir, engellemiyoruz. */
      const uyari = aralikCakismasi(me.schoolId, c.id, l.teacherId, gun, bd, td, null);

      const kayit = {
        id: uid('p'), schoolId: me.schoolId, classId: c.id, lessonId: l.id,
        day: gun, start: bas, end: bit, yilId: yilDamgasi(me), createdAt: now()
      };
      db.schedule.push(kayit);

      if (l.teacherId) {
        notify(l.teacherId, dersEtiketi(l) + ' dersin ' + (GUN_ADLARI[gun] || '') +
          ' ' + bas + '-' + bit + ' saatine programlandı.');
      }
      save();
      return ok(res, { kayit: kayit, uyari: uyari, cakismalar: cakismalariBul(me.schoolId) });
    }

    /* Var olan bir ders saatini günceller (saat/gün/ders değiştirme). */
    if (sub === 'schedule-update' && method === 'POST') {
      const sp = byId(db.schedule, clean(body.scheduleId, 60));
      if (!sp || sp.schoolId !== me.schoolId) return bad(res, 'Ders saati bulunamadı');
      if (!yetkiGerek('program.duzenle', { sinif: sp.classId })) return;

      const gun = body.day === undefined ? sp.day : parseInt(body.day, 10);
      if (!(gun >= 1 && gun <= GUN_SAYISI)) return bad(res, 'Geçersiz gün');

      const bas = body.start === undefined ? sp.start : saatDuzelt(body.start);
      const bit = body.end === undefined ? sp.end : saatDuzelt(body.end);
      if (!bas || !bit) return bad(res, 'Saatleri SS:DD biçiminde gir');
      const bd = saatDakika(bas), td = saatDakika(bit);
      if (td <= bd) return bad(res, 'Bitiş saati başlangıçtan sonra olmalı');

      let ders = lessonById(sp.lessonId);
      if (body.lessonId !== undefined) {
        const yeni = lessonById(clean(body.lessonId, 60));
        if (!yeni || yeni.classId !== sp.classId) return bad(res, 'Bu sınıfa ait bir ders seç');
        ders = yeni;
        sp.lessonId = yeni.id;
      }

      const uyari = aralikCakismasi(me.schoolId, sp.classId,
        ders ? ders.teacherId : '', gun, bd, td, sp.id);

      sp.day = gun; sp.start = bas; sp.end = bit;
      save();
      return ok(res, { kayit: sp, uyari: uyari, cakismalar: cakismalariBul(me.schoolId) });
    }

    if (sub === 'schedule-delete' && method === 'POST') {
      const sp = byId(db.schedule, clean(body.scheduleId, 60));
      if (!sp || sp.schoolId !== me.schoolId) return bad(res, 'Ders saati bulunamadı');
      if (!yetkiGerek('program.duzenle', { sinif: sp.classId })) return;
      db.schedule = db.schedule.filter(x => x.id !== sp.id);
      save();
      return ok(res, { cakismalar: cakismalariBul(me.schoolId) });
    }

    if (sub === 'cakismalar' && method === 'GET') {
      if (!yetkiGerek('program.duzenle')) return;
      return ok(res, { cakismalar: cakismalariBul(me.schoolId) });
    }

    /* Öğrenciyi tek tek öğretmene atama ucu kaldırıldı: öğretmen-öğrenci
       ilişkisi artık yalnızca sınıf ve ders üzerinden kuruluyor. */
  }

  /* ---- ödevler (öğretmen + müdür) ---- */

  return false;
}

module.exports = {
  AKTARIM_SINIR,
  AKTARIM_DOSYA_SINIR,
  xlsxGonder,
  uclar
};
