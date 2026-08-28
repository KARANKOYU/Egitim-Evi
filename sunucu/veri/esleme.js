'use strict';
/* Veritabanı satırı <-> uygulama nesnesi.

   Veritabanında sütun adları Türkçe ve alt çizgili (ad_soyad, okul_id);
   uygulama ve API ise baştan beri şu adları kullanıyor (fullName, schoolId).
   Bu dosya ikisini birbirine çevirir; böylece ön yüz ve API hiç değişmeden
   veri katmanı PostgreSQL'e taşınabildi.

   Boş değer kuralı: veritabanında "yok" NULL'dur; uygulamada ise boş metin
   ('') kullanılıyor (ör. teacherId: ''). Çeviri iki yönde de bunu gözetir. */

const bos = v => (v === null || v === undefined) ? '' : v;
const yokIse = v => (v === '' || v === undefined) ? null : v;

/* ---------------- okul ---------------- */
function okul(r) {
  if (!r) return null;
  return {
    id: r.id, mebId: r.meb_kodu, name: r.ad, city: r.il, district: r.ilce,
    type: r.tur, status: r.durum, kisaAd: bos(r.kisa_ad),
    enlem: r.enlem === undefined || r.enlem === null ? null : Number(r.enlem),
    boylam: r.boylam === undefined || r.boylam === null ? null : Number(r.boylam),
    createdAt: r.olusturma
  };
}

/* ---------------- eğitim yılı ---------------- */
function yil(r) {
  if (!r) return null;
  return {
    id: r.id, schoolId: r.okul_id, ad: r.ad, bas: r.baslangic, bit: r.bitis,
    aktif: r.aktif, createdAt: r.olusturma
  };
}

/* ---------------- sınıf ---------------- */
function sinif(r) {
  if (!r) return null;
  return { id: r.id, schoolId: r.okul_id, name: r.ad, createdAt: r.olusturma };
}

/* ---------------- kullanıcı ----------------
   okul_adi (JOIN'den) ve _rol (roller deposundan) varsa nesneye iliştirilir;
   pub() ve yetki kontrolleri bunları kullanır, ayrıca sorgu atmaz. */
function kullanici(r) {
  if (!r) return null;
  const u = {
    id: r.id,
    username: r.kullanici_adi,
    email: bos(r.eposta),
    pass: r.sifre_ozeti,
    fullName: r.ad_soyad,
    role: bos(r.rol),                 // '' = rolsüz (okul henüz eklemedi)
    tc: bos(r.tc_kimlik),
    status: r.durum,
    schoolId: bos(r.okul_id),
    classId: bos(r.sinif_id),
    customRoleId: bos(r.ozel_rol_id),
    seciliYil: bos(r.secili_yil_id),
    seciliGecmis: bos(r.secili_gecmis),   // baktığı geçmiş okul dönemi (nakil; 021)
    createdBy: bos(r.olusturan_id),
    okulActi: !!r.okul_acti,            // hesabı okul açtı (T.C. ve e-postayı okul düzenler)
    phone: r.telefon,
    city: r.il,
    district: r.ilce,
    address: r.adres,
    dogum: bos(r.dogum_tarihi),
    branch: r.brans,
    grade: r.sinif_etiketi,
    code: r.veli_kodu,
    note: r.okul_notu,
    tema: r.tema,
    mesajAyar: { kimden: r.mesaj_kimden },
    kvkk: r.kvkk_onay ? { onay: true, tarih: r.kvkk_tarih, surum: r.kvkk_surum } : null,
    sonGiris: r.son_giris || null,
    okulNo: bos(r.okul_no),
    sifreDegismeli: !!r.sifre_degismeli,
    anaHesapId: bos(r.ana_hesap_id),    // okul rolü satırıysa bağlı olduğu yetişkin hesabı
    eslesmeKodu: bos(r.eslesme_kodu),   // yetişkin hesabının öğretmen eşleme kodu
    createdAt: r.olusturma
  };
  if (r.okul_adi !== undefined) u._okulAdi = bos(r.okul_adi);
  if (r.okul_kisa_ad !== undefined) u._okulKisaAd = bos(r.okul_kisa_ad);
  if (r.okul_durum !== undefined) u._okulDurum = bos(r.okul_durum);
  return u;
}

/* ---------------- ders ve program ---------------- */
function ders(r) {
  if (!r) return null;
  const l = {
    id: r.id, schoolId: r.okul_id, classId: r.sinif_id, subject: r.konu,
    teacherId: bos(r.ogretmen_id), weeklyHours: r.haftalik_saat, createdAt: r.olusturma
  };
  if (r.sinif_adi !== undefined) l._sinifAdi = bos(r.sinif_adi);
  if (r.ogretmen_adi !== undefined) l._ogretmenAdi = bos(r.ogretmen_adi);
  if (r.yerlesen !== undefined) l._yerlesen = r.yerlesen;
  return l;
}

function program(r) {
  if (!r) return null;
  const p = {
    id: r.id, schoolId: r.okul_id, classId: r.sinif_id, lessonId: r.ders_id,
    day: r.gun, start: r.baslangic, end: r.bitis, yilId: bos(r.yil_id), createdAt: r.olusturma
  };
  if (r.ders_konu !== undefined) p._ders = r.ders_konu;
  if (r.ogretmen_id !== undefined) p._ogretmenId = bos(r.ogretmen_id);
  if (r.sinif_adi !== undefined) p._sinifAdi = bos(r.sinif_adi);
  return p;
}

/* ---------------- sınav ---------------- */
function sinavGrubu(r) {
  if (!r) return null;
  return {
    id: r.id, teacherId: bos(r.ogretmen_id), schoolId: r.okul_id, subject: r.ders,
    name: r.ad, yilId: bos(r.yil_id), createdAt: r.olusturma
  };
}

/* grades: ana ölçümün değerleri { ogrenciId: deger } (eski API ile uyum).
   olcumler: [{ id, kod, ad, alt, ust, ana, sira }] */
function sinav(r) {
  if (!r) return null;
  return {
    id: r.id, groupId: bos(r.grup_id), schoolId: r.okul_id, templateId: bos(r.sablon_id),
    templateName: bos(r.sablon_adi), teacherId: bos(r.ogretmen_id), subject: r.ders,
    name: r.ad, tarih: r.tarih, weight: r.agirlik, yilId: bos(r.yil_id),
    olcumler: r.olcumler || [], grades: r.notlar || {}, createdAt: r.olusturma
  };
}

/* ---------------- mesaj ---------------- */
function mesaj(r) {
  if (!r) return null;
  return {
    id: r.id, schoolId: r.okul_id, gonderenId: bos(r.gonderen_id), tur: r.tur,
    konu: r.konu, govde: r.govde, hedefOzet: r.hedef_ozet,
    alicilar: (r.alicilar || []).map(a => ({ id: a.id, ogrenciId: bos(a.ogrenciId) })),
    okuyanlar: r.okuyanlar || [],
    tarih: r.tarih,
    duzenlenme: r.duzenlenme || null
  };
}

/* ---------------- devamsızlık ---------------- */
function devamsizlik(r) {
  if (!r) return null;
  return {
    id: r.id, schoolId: r.okul_id, classId: bos(r.sinif_id), lessonId: bos(r.ders_id),
    ogrenciId: r.ogrenci_id, tarih: r.tarih, durum: r.durum, not: r.aciklama,
    alanId: bos(r.alan_id), yilId: bos(r.yil_id), createdAt: r.olusturma
  };
}

/* ---------------- takvim ---------------- */
function takvim(r) {
  if (!r) return null;
  return {
    id: r.id, schoolId: r.okul_id, tarih: r.tarih, bitis: bos(r.bitis),
    baslik: r.baslik, tur: r.tur, aciklama: r.aciklama,
    ekleyenId: bos(r.ekleyen_id), yilId: bos(r.yil_id), createdAt: r.olusturma
  };
}

/* ---------------- bildirim ve işlem kaydı ---------------- */
function bildirim(r) {
  if (!r) return null;
  return {
    id: r.id, userId: r.kullanici_id, text: r.metin, link: r.baglanti,
    read: r.okundu, createdAt: r.olusturma
  };
}

function islemKaydi(r) {
  if (!r) return null;
  return {
    id: r.id, schoolId: bos(r.okul_id), userId: bos(r.kullanici_id),
    userAd: r.kullanici_ad, userRol: r.kullanici_rol, islem: r.islem,
    detay: r.detay, ip: bos(r.ip), tarih: r.tarih
  };
}

module.exports = {
  bos, yokIse,
  okul, yil, sinif, kullanici, kullaniciSutunlari, KULLANICI_ALANLARI,
  rol, ders, program, odev, sinavGrubu, sinav, mesaj, devamsizlik, takvim,
  bildirim, islemKaydi
};
