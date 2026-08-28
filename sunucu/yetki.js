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

/* baglam: { ders: 'Matematik', sinif: 'c_...' } — verilmezse sadece
   yetkinin açık olup olmadığına bakılır. */
function yetkiVarMi(u, izin, baglam) {
  if (!u || u.status !== 'approved') return false;
  if (u.role === 'admin' || u.role === 'principal') return true;
  if (kullaniciYetkileri(u).indexOf(izin) < 0) return false;
  if (!baglam || temelRoldeMi(u, izin)) return true;
  return kapsamUyar(yetkiKapsami(u, izin), baglam);
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
