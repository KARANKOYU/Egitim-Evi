'use strict';
/* Öğrenci nakli: öğrenci hesabı okula değil kişiye aittir (021).

   Okul "Öğrenci ekle"de başka bir okulda kayıtlı T.C. no yazarsa yeni hesap
   açılmaz. Doğum tarihi de eşleşirse var olan hesap bu okula taşınır;
   eşleşmezse eklenemez. Öğrencinin kullanıcı adı (okulda boşsa), şifresi,
   velileri ve veli kodu aynı kalır.

   Eski okulun ödev, not ve devamsızlık kayıtları o okulun kaydı olarak kalır:
   yeni okul görmez. Öğrenci ve velisi eğitim yılı seçicisinde
   "2025-2026 · Eski Okul · 6-A" diye seçip salt okunur görür. Öğrenci eski
   okulun etüt, kulüp ve servis listelerinden çıkar. */

const { hataSay, hataSiniriDoldu } = require('../guvenlik');
const { bad, ok, sendJSON } = require('../http');
const { clean, tarihCoz, uid } = require('../ortak');
const { depo, bildir, islem } = require('../veri');
const { islemYaz } = require('./islem-kaydi');

/* Yanlış doğum tarihi denemesi: kişi başına saatte 10. T.C. no'yu bilen biri
   doğum tarihini tahmin ederek başkasının çocuğunu okuluna alamasın. */
const DENEME = 10;
const PENCERE = 60 * 60 * 1000;

/* Bu T.C. ile başka okulda (ya da okulsuz kalmış) öğrenci var mı? */
async function baskaOkulOgrencisi(tc, okulId, haricId) {
  if (!tc) return null;
  const st = await depo.kullanicilar.ogrenciTcIle(tc);
  return st && st.id !== haricId && st.schoolId !== okulId ? st : null;
}

/* Eski okulun hangi yılları öğrencinin geçmişine yazılır: hesabın açıldığı
   yıldan bugüne başlamış olanlar. Okulda yıl yoksa tek satır (yılsız). */
async function gecmisSatirlari(st, eskiOkul) {
  const yillar = await depo.okullar.yillari(eskiOkul.id);
  const bugun = new Date().toISOString().slice(0, 10);
  const acilis = String(st.createdAt || '').slice(0, 10);
  const aktif = yillar.find(y => y.aktif) || yillar[0] || null;
  let secilen = yillar.filter(y => (!y.bas || y.bas <= bugun) && (!y.bit || !acilis || y.bit >= acilis));
  if (!secilen.length && aktif) secilen = [aktif];
  const sinif = st.classId ? await depo.siniflar.bul(st.classId) : null;
  const sinifAdi = sinif ? sinif.name : '';
  if (!secilen.length) return [{ yilId: null, yilAdi: '', sinifAdi }];
  /* Sınıf yalnızca son yılında biliniyor (eski yılların sınıfı tutulmuyor). */
  return secilen.map((y, i) => ({ yilId: y.id, yilAdi: y.ad, sinifAdi: i === 0 ? sinifAdi : '' }));
}

/* Taşıma. g: formdan gelen alanlar (tc, dogum, classId, okulNo). */
async function nakilEt(k, st, g) {
  const { req, res, me } = k;
  const anahtar = 'nakil:' + me.id;
  if (hataSiniriDoldu(anahtar, DENEME)) {
    return bad(res, 'Çok fazla yanlış deneme oldu. Bir saat sonra yeniden dene.', 429);
  }
  const dogum = tarihCoz(g.dogum);
  if (!dogum) {
    return sendJSON(res, 409, { nakil: 'dogum', error: 'Bu T.C. kimlik no başka bir okulda kayıtlı bir öğrencinin. ' +
      'Öğrenciyi okuluna almak için doğum tarihini de seç: T.C. no ile doğum tarihi eşleşirse hesabı okuluna taşınır.' });
  }
  if (!st.dogum || st.dogum !== dogum) {
    hataSay(anahtar, DENEME, PENCERE);
    return sendJSON(res, 409, { nakil: 'dogum', error: 'T.C. kimlik no ile doğum tarihi eşleşmedi. ' +
      'Bilgileri velisinden ya da önceki okulundan doğrula.' });
  }

  const classId = clean(g.classId, 60);
  const sinif = classId ? await depo.siniflar.bul(classId) : null;
  if (classId && (!sinif || sinif.schoolId !== me.schoolId)) return bad(res, 'Sınıf bulunamadı');
  const okulNo = clean(g.okulNo, 20);
  if (okulNo && await depo.kullanicilar.okulNoVarMi(me.schoolId, okulNo, st.id)) return bad(res, 'Bu okul numarası başka bir öğrencide');

  /* Kullanıcı adı yeni okulda boşsa aynen kalır; alınmışsa T.C. no, o da
     alınmışsa adından türetilir. */
  let kadi = st.username;
  if (!kadi || await depo.kullanicilar.kullaniciAdiVarMi(kadi, st.id, me.schoolId)) {
    kadi = st.tc && !await depo.kullanicilar.kullaniciAdiVarMi(st.tc, st.id, me.schoolId)
      ? st.tc : await depo.kullanicilar.bosKullaniciAdi(st.fullName, me.schoolId);
  }

  const eskiOkul = st.schoolId ? await depo.okullar.bul(st.schoolId) : null;
  const yeniOkul = await depo.okullar.bul(me.schoolId);
  const satirlar = eskiOkul ? await gecmisSatirlari(st, eskiOkul) : [];

  await islem(async () => {
    for (const s of satirlar) {
      await depo.ogrenciGecmisi.ekle(Object.assign({ id: uid(), ogrenciId: st.id, okulId: eskiOkul.id, okulAdi: eskiOkul.name }, s));
    }
    if (eskiOkul) await depo.ogrenciGecmisi.okuldanCikar(st.id, eskiOkul.id);
    await depo.kullanicilar.guncelle(st.id, {
      schoolId: me.schoolId, classId: sinif ? sinif.id : '', username: kadi, okulNo, note: '',
      seciliYil: '', seciliGecmis: ''
    });
  });

  const okulAdi = yeniOkul ? yeniOkul.name : 'yeni okul';
  await islemYaz(me, 'ogrenci.nakil', st.fullName + (eskiOkul ? ' (' + eskiOkul.name + ' okulundan)' : ''), req);
  await bildir(st.id, 'Hesabın ' + okulAdi + ' okuluna taşındı. Önceki okulunun kayıtlarını eğitim yılı seçicisinden görebilirsin.', '#/',
    { veliye: false });   // velilere aşağıda kendi metniyle
  for (const v of await depo.kullanicilar.velileri(st.id)) {
    /* Velinin okulu çocuğunun okulundan gelir (duyuru ve takvim ona bakar):
       eski okulda başka çocuğu kalmadıysa yeni okula geçer. */
    if (eskiOkul && v.schoolId === eskiOkul.id && !v.anaHesapId) {
      const kalan = (await depo.kullanicilar.cocuklari(v.id)).some(c => c.id !== st.id && c.schoolId === eskiOkul.id);
      if (!kalan) await depo.kullanicilar.guncelle(v.id, { schoolId: me.schoolId });
    }
    await bildir(v.id, st.fullName + ' ' + okulAdi + ' okuluna taşındı. Önceki okulunun kayıtları yıl seçicisinde.', '#/cocuklarim');
  }
  if (eskiOkul) {
    const mudur = await depo.kullanicilar.okulunMuduru(eskiOkul.id);
    if (mudur) await bildir(mudur.id, st.fullName + ' başka bir okula nakledildi. Okulunuzdaki kayıtları sizde kalır.', '#/okul-ogrenciler');
  }

  const hesap = { id: st.id, fullName: st.fullName, username: kadi, email: '', code: st.code || '',
    classId: sinif ? sinif.id : '', varsayilanSifre: false, nakil: true };
  return ok(res, { hesap, student: hesap,
    message: st.fullName + ' okuluna taşındı. Öğrenci kendi şifresiyle girer; velileri bağlı kalır.' });
}

module.exports = { baskaOkulOgrencisi, nakilEt };
