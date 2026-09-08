'use strict';
/* Roller, yetkiler ve kapsam.
   Müdürün tanımladığı özel roller, öğretmenin varsayılan yetkileri,
   ders/sınıf kapsamı ve dışarıya verilen kullanıcı görünümü (pub). */

const { bad } = require('./http');
const { SUBJECTS } = require('./ortak');
const { byId, db, save, schoolById, userById } = require('./veri');

function pub(u) {
  if (!u) return null;
  const s = u.schoolId ? schoolById(u.schoolId) : null;
  return {
    id: u.id, email: u.email, fullName: u.fullName, role: u.role, status: u.status,
    city: u.city || '', district: u.district || '', address: u.address || '',
    phone: u.phone || '',
    schoolId: u.schoolId || '', schoolName: s ? s.name : '',
    branch: u.branch || '', code: u.code || '', grade: u.grade || '', createdAt: u.createdAt,
    customRoleId: u.customRoleId || '',
    customRoleName: u.customRoleId && roleById(u.customRoleId) ? roleById(u.customRoleId).name : '',
    yetkiler: kullaniciYetkileri(u)
  };
}

/* ============ yetkiler ve özel roller ============
   Müdür kendi rol adını koyar (ör. "Müdür Yardımcısı", "Rehber Öğretmen") ve
   yetkilerini tek tek seçer. Rol, temel rolü "teacher" olan kişilere verilir;
   temel rol değişmez, üstüne yetki eklenir.

   Müdürün kendisi bütün yetkilere sahiptir ve bu değiştirilemez — okulda
   her şeyi yapabilen en az bir kişi kalmalı. */

const YETKILER = [
  { grup: 'Ders ve program', liste: [
    { k: 'derse-atanabilir', ad: 'Derse öğretmen olarak atanabilir',
      kapsam: ['ders'], aciklama: 'Hangi derslere atanabileceğini seç.' },
    { k: 'program.duzenle', ad: 'Ders programını düzenler', kapsam: ['sinif'] },
    { k: 'ders.yonet', ad: 'Sınıfa ders ekler ve çıkarır', kapsam: ['sinif'] },
    { k: 'ders.ogretmen-ata', ad: 'Derse öğretmen atar', kapsam: ['ders', 'sinif'] }
  ]},
  { grup: 'Sınıf ve öğrenci', liste: [
    { k: 'sinif.yonet', ad: 'Sınıf açar ve siler' },
    { k: 'ogrenci.yerlestir', ad: 'Öğrenciyi sınıfa yerleştirir', kapsam: ['sinif'] },
    { k: 'ogrenci.hesap-ac', ad: 'Öğrenci hesabı açar' },
    { k: 'ogrenci.duzenle', ad: 'Öğrenci bilgilerini düzenler' },
    { k: 'ogrenci.sifre', ad: 'Öğrenci şifresi sıfırlar',
      aciklama: 'Hassas yetki — dikkatli ver.' },
    { k: 'ogrenci.portal', ad: 'Öğrenci portalına girer',
      aciklama: 'Öğrencinin gördüğü ekranı birebir açar.' }
  ]},
  { grup: 'Öğretmenler', liste: [
    { k: 'ogretmen.onayla', ad: 'Öğretmen başvurusu onaylar' },
    { k: 'ogretmen.duzenle', ad: 'Öğretmen bilgisi ve branşını düzenler' },
    { k: 'ogretmen.cikar', ad: 'Öğretmeni okuldan çıkarır' }
  ]},
  { grup: 'Ödev ve sınav', liste: [
    { k: 'odev.ver', ad: 'Ödev verir', kapsam: ['ders', 'sinif'] },
    { k: 'odev.sonuclandir', ad: 'Ödev sonuçlandırır', kapsam: ['ders'] },
    { k: 'sinav.olustur', ad: 'Sınav oluşturur', kapsam: ['ders', 'sinif'] },
    { k: 'sinav.not-gir', ad: 'Sınav notu girer', kapsam: ['ders', 'sinif'] }
  ]},
  { grup: 'Devamsızlık', liste: [
    { k: 'devamsizlik.al', ad: 'Yoklama alır', kapsam: ['ders', 'sinif'] },
    { k: 'devamsizlik.gor', ad: 'Okulun tüm devamsızlığını görür' }
  ]},
  { grup: 'Mesajlaşma', liste: [
    { k: 'mesaj.toplu', ad: 'Sınıfa veya gruba toplu mesaj atar' },
    { k: 'mesaj.herkese', ad: 'Okuldaki herkese mesaj atar' }
  ]},
  { grup: 'Yönetim', liste: [
    { k: 'rol.yonet', ad: 'Rol oluşturur ve düzenler',
      aciklama: 'Bu yetkiyi verdiğin kişi başkalarına yetki dağıtabilir.' },
    { k: 'islem-kaydi.gor', ad: 'İşlem kaydını görür' },
    { k: 'takvim.yonet', ad: 'Okul takvimine etkinlik ve tatil ekler' },
    { k: 'yil.yonet', ad: 'Eğitim yılı açar ve değiştirir',
      aciklama: 'Yeni yıl açınca eski yılın kayıtları arşive düşer.' },
    { k: 'yedek.al', ad: 'Yedek alır ve geri yükler' },
    { k: 'aktarim.yap', ad: 'Excel ile içe ve dışa aktarım yapar',
      aciklama: 'Öğrenci listesi ve ders programını Excel dosyasıyla toplu işler.' }
  ]}
];

/* Düz liste: doğrulama için */
const TUM_YETKILER = YETKILER.reduce((a, g) => a.concat(g.liste.map(x => x.k)), []);

/* Öğretmenin rolsüz de sahip olduğu yetkiler. */
const OGRETMEN_VARSAYILAN = [
  'derse-atanabilir', 'odev.ver', 'odev.sonuclandir', 'sinav.not-gir', 'devamsizlik.al'
];

const roleById = id => byId(db.roles, id);

/* Gelen kapsam nesnesini doğrular: sadece açık olan yetkiler, gerçek dersler
   ve okulun kendi sınıfları kalır. "*" hepsi demektir. */
function kapsamTemizle(gelen, izinler, schoolId) {
  const temiz = {};
  if (!gelen || typeof gelen !== 'object') return temiz;

  const sinifIdler = db.classes.filter(c => c.schoolId === schoolId).map(c => c.id);

  for (const izin of izinler) {
    const k = gelen[izin];
    if (!k || typeof k !== 'object') continue;

    const dersler = Array.isArray(k.dersler)
      ? k.dersler.map(String).filter(x => x === '*' || SUBJECTS.indexOf(x) >= 0)
      : [];
    const siniflar = Array.isArray(k.siniflar)
      ? k.siniflar.map(String).filter(x => x === '*' || sinifIdler.indexOf(x) >= 0)
      : [];

    /* Hepsi seçiliyse kapsam yazmaya gerek yok. */
    const dersHepsi = !dersler.length || dersler.indexOf('*') >= 0;
    const sinifHepsi = !siniflar.length || siniflar.indexOf('*') >= 0;
    if (dersHepsi && sinifHepsi) continue;

    temiz[izin] = {
      dersler: dersHepsi ? ['*'] : dersler,
      siniflar: sinifHepsi ? ['*'] : siniflar
    };
  }
  return temiz;
}

function kullaniciYetkileri(u) {
  if (!u) return [];
  if (u.role === 'admin' || u.role === 'principal') return TUM_YETKILER.slice();
  if (u.role !== 'teacher') return [];
  const temel = OGRETMEN_VARSAYILAN.slice();
  const r = u.customRoleId ? roleById(u.customRoleId) : null;
  if (r && r.schoolId === u.schoolId) {
    for (const y of r.permissions || []) if (temel.indexOf(y) < 0) temel.push(y);
  }
  return temel;
}

/* Bir yetkinin ders/sınıf kapsamı. Rolde tanım yoksa "hepsi" demektir. */
function yetkiKapsami(u, izin) {
  if (!u || u.role !== 'teacher' || !u.customRoleId) return null;
  const r = roleById(u.customRoleId);
  if (!r || r.schoolId !== u.schoolId || !r.kapsam) return null;
  return r.kapsam[izin] || null;
}

/* baglam: { ders: 'Matematik', sinif: 'c_...' } — verilmezse sadece
   yetkinin açık olup olmadığına bakılır. */
function yetkiVarMi(u, izin, baglam) {
  if (!u || u.status !== 'approved') return false;
  if (u.role === 'admin' || u.role === 'principal') return true;
  if (kullaniciYetkileri(u).indexOf(izin) < 0) return false;

  if (!baglam) return true;
  const k = yetkiKapsami(u, izin);
  if (!k) return true;   /* kapsam yoksa sınırsız */

  if (baglam.ders && Array.isArray(k.dersler) && k.dersler.length &&
      k.dersler.indexOf('*') < 0 && k.dersler.indexOf(baglam.ders) < 0) {
    return false;
  }
  if (baglam.sinif && Array.isArray(k.siniflar) && k.siniflar.length &&
      k.siniflar.indexOf('*') < 0 && k.siniflar.indexOf(baglam.sinif) < 0) {
    return false;
  }
  return true;
}

function rolOzeti(r) {
  return {
    id: r.id, name: r.name,
    permissions: r.permissions || [],
    kapsam: r.kapsam || {},
    kisiSayisi: db.users.filter(u => u.customRoleId === r.id).length,
    createdAt: r.createdAt
  };
}

function okulGerek(res, me) {
  if (me && me.schoolId) return true;

  /* Veli kayıtta okul seçmiyor. Çocuğuna bağlıysa onun okuluna aittir;
     eskiden bağlanmış hesaplar için burada tamamlıyoruz. */
  if (me && me.role === 'parent') {
    const bag = db.parentLinks.find(l => l.parentId === me.id);
    const cocuk = bag ? userById(bag.studentId) : null;
    if (cocuk && cocuk.schoolId) {
      me.schoolId = cocuk.schoolId;
      save();
      return true;
    }
    bad(res, 'Önce çocuğunu hesabına bağlaman gerekiyor.', 403);
    return false;
  }

  bad(res, 'Bu işlem bir okula bağlı olmayı gerektirir. ' +
    'Yönetici hesabı bir okula ait değildir.', 403);
  return false;
}


module.exports = {
  pub,
  YETKILER,
  TUM_YETKILER,
  OGRETMEN_VARSAYILAN,
  roleById,
  kapsamTemizle,
  kullaniciYetkileri,
  yetkiKapsami,
  yetkiVarMi,
  rolOzeti,
  okulGerek
};
