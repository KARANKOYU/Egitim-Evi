'use strict';
/* Roller, yetkiler ve kapsam.
   Müdürün tanımladığı özel roller, öğretmenin varsayılan yetkileri,
   ders/sınıf kapsamı ve dışarıya verilen kullanıcı görünümü (pub). */

const { bad } = require('./http');
const { SUBJECTS } = require('./ortak');
const { depo } = require('./veri');

/* Dışarı verilen kullanıcı görünümü — şifre özeti ASLA gönderilmez.
   Okul adı ve özel rol, kullanıcı depodan gelirken iliştirilmiş olur. */
function pub(u) {
  if (!u) return null;
  return {
    id: u.id, username: u.username || '', email: u.email || '', fullName: u.fullName,
    role: u.role || '', status: u.status,
    city: u.city || '', district: u.district || '', address: u.address || '',
    phone: u.phone || '',
    dogum: u.dogum || '',
    kvkkSurum: (u.kvkk && u.kvkk.surum) || '',
    schoolId: u.schoolId || '', schoolName: u._okulAdi || '', schoolSlug: u._okulKisaAd || '',
    branch: u.branch || '', code: u.code || '', grade: u.grade || '', createdAt: u.createdAt,
    customRoleId: u.customRoleId || '',
    tema: u.tema || 'sistem',
    customRoleName: u._rol ? u._rol.name : '',
    yetkiler: kullaniciYetkileri(u)
  };
}

/* ============ yetkiler ve roller ============
   Her öğretmen okulun hazır "Öğretmen" rolünün yetkilerine sahiptir; müdür
   bu rolün yetkilerini açıp kapatabilir (rol yoksa OGRETMEN_VARSAYILAN).
   Müdür ayrıca kendi rollerini tanımlar (ör. "Müdür Yardımcısı", "Etüt
   Sorumlusu"), yetkilerini tek tek seçer ve bir öğretmene verir; o
   öğretmenin yetkileri iki rolün birleşimidir.

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
    { k: 'ogrenci.hesap-ac', ad: 'Öğrenci hesabı açar ve okula öğrenci ekler' },
    { k: 'ogrenci.duzenle', ad: 'Öğrenci bilgilerini düzenler' },
    { k: 'ogrenci.sifre', ad: 'Öğrenci şifresi sıfırlar',
      aciklama: 'Hassas yetki — dikkatli ver.' },
    { k: 'ogrenci.portal', ad: 'Öğrenci portalına girer',
      aciklama: 'Öğrencinin gördüğü ekranı birebir açar.' }
  ]},
  { grup: 'Öğretmenler', liste: [
    { k: 'ogretmen.onayla', ad: 'Okula öğretmen ekler, başvuru onaylar' },
    { k: 'ogretmen.duzenle', ad: 'Öğretmen bilgisi ve branşını düzenler' },
    { k: 'ogretmen.cikar', ad: 'Öğretmeni okuldan çıkarır' }
  ]},
  { grup: 'Ödev ve sınav', liste: [
    { k: 'odev.ver', ad: 'Ödev verir', kapsam: ['ders', 'sinif'] },
    { k: 'odev.sonuclandir', ad: 'Ödev sonuçlandırır', kapsam: ['ders'] },
    { k: 'sinav.olustur', ad: 'Sınav oluşturur', kapsam: ['ders', 'sinif'] },
    { k: 'sinav.not-gir', ad: 'Sınav notu girer', kapsam: ['ders', 'sinif'] },
    { k: 'ogretmen.sonuclar', ad: 'Girdiği sınıfların öğrenci sonuçlarını görür',
      aciklama: 'Sınıflarım bölümü: sınıf, öğrenci, verdiği ödevler ve öğrencinin sınav sonuçları.' }
  ]},
  { grup: 'Devamsızlık', liste: [
    { k: 'devamsizlik.al', ad: 'Yoklama alır', kapsam: ['ders', 'sinif'] },
    { k: 'devamsizlik.gor', ad: 'Okulun tüm devamsızlığını görür' }
  ]},
  { grup: 'Etüt', liste: [
    { k: 'etut.yonet', ad: 'Etüt açar; gününü, saatini, öğretmenini ve öğrencilerini düzenler' },
    { k: 'etut.yoklama', ad: 'Bütün etütlerde yoklama alır',
      aciklama: 'Etüdün öğretmeni kendi etüdünde bu yetki olmadan da yoklama alır.' }
  ]},
  { grup: 'Mesajlaşma', liste: [
    { k: 'mesaj.toplu', ad: 'Sınıfa veya gruba toplu mesaj atar' },
    { k: 'mesaj.herkese', ad: 'Okuldaki herkese mesaj atar' }
  ]},
  { grup: 'Okul hayatı', liste: [
    { k: 'yemek.yonet', ad: 'Yemek listesini düzenler' },
    { k: 'servis.yonet', ad: 'Servisleri ve servis öğrencilerini düzenler',
      aciklama: 'Şoför telefonlarını ve öğrencilerin durağını görür.' },
    { k: 'kulup.yonet', ad: 'Kulüp açar, danışman ve üyeleri düzenler' }
  ]},
  { grup: 'Yönetim', liste: [
    { k: 'rol.yonet', ad: 'Rol oluşturur ve düzenler',
      aciklama: 'Bu yetkiyi verdiğin kişi başkalarına yetki dağıtabilir.' },
    { k: 'islem-kaydi.gor', ad: 'İşlem kaydını görür' },
    { k: 'takvim.yonet', ad: 'Okul takvimine etkinlik ve tatil ekler' },
    { k: 'yil.yonet', ad: 'Eğitim yılı açar ve değiştirir',
      aciklama: 'Yeni yıl açınca eski yılın kayıtları arşive düşer.' },
    { k: 'aktarim.yap', ad: 'Excel ile içe ve dışa aktarım yapar',
      aciklama: 'Öğrenci listesi ve ders programını Excel dosyasıyla toplu işler.' },
    { k: 'okul.sayfa', ad: 'Okulun giriş sayfasını düzenler',
      aciklama: 'Kapak ve logo fotoğrafı, tanıtım yazısı, renkler ve kısıtlı CSS. Sayfa herkese açıktır.' }
  ]}
];

/* Düz liste: doğrulama için */
const TUM_YETKILER = YETKILER.reduce((a, g) => a.concat(g.liste.map(x => x.k)), []);

/* Hazır Öğretmen rolünün ilk kurulduğu andaki yetkileri (müdür sonra değiştirebilir). */
const OGRETMEN_VARSAYILAN = [
  'derse-atanabilir', 'odev.ver', 'odev.sonuclandir', 'sinav.olustur', 'sinav.not-gir', 'devamsizlik.al', 'ogretmen.sonuclar'
];

/* Yeni rol açarken başlanabilecek hazır şablonlar. Müdür seçtikten sonra
   yetkileri istediği gibi değiştirir; şablon yalnızca başlangıçtır. */
const ROL_SABLONLARI = [
  { ad: 'Müdür Yardımcısı', yetkiler: ['program.duzenle', 'ders.yonet', 'ders.ogretmen-ata', 'sinif.yonet',
    'ogrenci.yerlestir', 'ogrenci.hesap-ac', 'ogrenci.duzenle', 'ogretmen.duzenle', 'devamsizlik.gor',
    'etut.yonet', 'etut.yoklama', 'mesaj.toplu', 'mesaj.herkese', 'takvim.yonet', 'islem-kaydi.gor'] },
  { ad: 'Rehber Öğretmen', yetkiler: ['devamsizlik.gor', 'ogrenci.portal', 'mesaj.toplu'] },
  { ad: 'Etüt Sorumlusu', yetkiler: ['etut.yonet', 'etut.yoklama'] },
  { ad: 'Nöbetçi Öğretmen', yetkiler: ['etut.yoklama', 'devamsizlik.gor'] },
  { ad: 'Servis Sorumlusu', yetkiler: ['servis.yonet'] },
  { ad: 'Kulüp Danışmanı', yetkiler: ['kulup.yonet'] },
  { ad: 'Zümre Başkanı', yetkiler: ['sinav.olustur', 'mesaj.toplu'] },
  { ad: 'Kodlayıcı', yetkiler: ['okul.sayfa'] }
];

const roleById = id => depo.roller.bul(id);

/* Gelen kapsam nesnesini doğrular: sadece açık olan yetkiler, gerçek dersler
   ve okulun kendi sınıfları kalır. "*" hepsi demektir. */
async function kapsamTemizle(gelen, izinler, schoolId) {
  const temiz = {};
  if (!gelen || typeof gelen !== 'object') return temiz;

  const sinifIdler = (await depo.siniflar.okulun(schoolId)).map(c => c.id);

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
  /* Okulun hazır Öğretmen rolü (depodan iliştirilir); kurulmamışsa varsayılan. */
  const temel = (u._ogretmenYetkileri || OGRETMEN_VARSAYILAN).slice();
  const r = u._rol || null;
  if (r && r.schoolId === u.schoolId && r.tur !== 'ogretmen') {
    for (const y of r.permissions || []) if (temel.indexOf(y) < 0) temel.push(y);
  }
  return temel;
}

/* Ek rolün bir yetki için tanımladığı ders/sınıf kapsamı. Rolde tanım
   yoksa null ("hepsi"). */
function yetkiKapsami(u, izin) {
  if (!u || u.role !== 'teacher' || !u.customRoleId) return null;
  const r = u._rol || null;
  if (!r || r.schoolId !== u.schoolId || !r.kapsam) return null;
  return r.kapsam[izin] || null;
}

/* Kapsam bağlama uyuyor mu? Kapsam yoksa (null) her şeye uyar. */
function kapsamUyar(k, baglam) {
  if (!k || !baglam) return true;
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

/* Öğretmenin yetkileri iki rolün birleşimi: izin hazır Öğretmen rolünde
   açıksa ek rolün kapsamı onu daraltmaz. */
const temelRoldeMi = (u, izin) => u.role === 'teacher' && (u._ogretmenYetkileri || OGRETMEN_VARSAYILAN).indexOf(izin) >= 0;

/* baglam: { ders: 'Matematik', sinif: 'c_...' } — verilmezse sadece
   yetkinin açık olup olmadığına bakılır. */
function yetkiVarMi(u, izin, baglam) {
  if (!u || u.status !== 'approved') return false;
  if (u.role === 'admin' || u.role === 'principal') return true;
  if (kullaniciYetkileri(u).indexOf(izin) < 0) return false;
  if (!baglam || temelRoldeMi(u, izin)) return true;
  return kapsamUyar(yetkiKapsami(u, izin), baglam);
}

/* Öğrenciye dokunan yetkinin sınıf kapsamı: rolü belirli sınıflarla
   sınırlıysa sınıfsız öğrenci kapsam DIŞINDA sayılır (yetkiVarMi boş sınıfı
   denetlemeden geçiriyordu). */
function ogrenciKapsamindaMi(u, izin, sinifId) {
  if (!yetkiVarMi(u, izin)) return false;
  if (u.role === 'admin' || u.role === 'principal' || temelRoldeMi(u, izin)) return true;
  const k = yetkiKapsami(u, izin);
  if (!k || !Array.isArray(k.siniflar) || !k.siniflar.length || k.siniflar.indexOf('*') >= 0) return true;
  return !!sinifId && k.siniflar.indexOf(sinifId) >= 0;
}

function rolOzeti(r) {
  return {
    id: r.id, name: r.name, tur: r.tur || 'ozel',
    permissions: r.permissions || [],
    kapsam: r.kapsam || {},
    kisiSayisi: r._kisiSayisi || 0,
    createdAt: r.createdAt
  };
}

async function okulGerek(res, me) {
  if (me && me.schoolId) return true;

  /* Veli kayıtta okul seçmiyor. Çocuğuna bağlıysa onun okuluna aittir;
     eskiden bağlanmış hesaplar için burada tamamlıyoruz. */
  if (me && me.role === 'parent') {
    const okulId = await depo.kullanicilar.ilkCocugununOkulu(me.id);
    if (okulId) {
      me.schoolId = okulId;
      await depo.kullanicilar.guncelle(me.id, { schoolId: okulId });
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
  kapsamUyar,
  ogrenciKapsamindaMi,
  pub,
  YETKILER,
  TUM_YETKILER,
  OGRETMEN_VARSAYILAN,
  ROL_SABLONLARI,
  roleById,
  kapsamTemizle,
  kullaniciYetkileri,
  yetkiKapsami,
  yetkiVarMi,
  rolOzeti,
  okulGerek
};
