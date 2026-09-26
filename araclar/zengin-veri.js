/* Ekran görüntüleri gerçekçi görünsün diye dolu bir okul kurar. */
const { iste, girisYap, botCevabi, hesapAc, tcUret } = require('./giris');

(async () => {
  const m = await girisYap('mudur@test.com', 'Test1234!');
  const T = m.token;

  /* Sınıflar */
  const sinifAdlari = ['7-A', '7-B', '8-A'];
  const siniflar = {};
  for (const ad of sinifAdlari) {
    const r = await iste('/api/school/class', 'POST', { name: ad }, T);
    if (r.body.class) siniflar[ad] = r.body.class.id;
  }

  /* Öğrencileri sınıflara dağıt */
  const ogr = await iste('/api/school/students', 'GET', null, T);
  const dizi = Object.values(siniflar);
  for (let i = 0; i < ogr.body.students.length; i++) {
    await iste('/api/school/class-assign', 'POST',
      { studentId: ogr.body.students[i].id, classId: dizi[i % dizi.length] }, T);
  }

  /* Birkaç öğrenci hesabı daha aç ki liste dolu görünsün */
  const yeniler = [
    ['Deniz Kara', 'deniz.kara', '7-A'],
    ['Elif Şahin', 'elif.sahin', '7-A'],
    ['Mert Aydın', 'mert.aydin', '7-B'],
    ['Sıla Yıldırım', 'sila.yildirim', '8-A']
  ];
  for (const [ad, kul, sinif] of yeniler) {
    /* Okulun açtığı hesap: kullanıcı adı var, e-posta yok (küçük öğrenci). */
    await iste('/api/school/hesap-ac', 'POST', {
      rol: 'student', fullName: ad, username: kul, password: 'Ogrenci2026', tc: tcUret(),
      classId: siniflar[sinif], note: 'Kardeşi de okulumuzda.'
    }, T);
  }

  /* Dersler ve öğretmen atamaları */
  const bilgi = await iste('/api/school/lessons?classId=' + siniflar['7-A'], 'GET', null, T);
  const ogretmenler = bilgi.body.teachers.filter(t => t.role !== 'principal');
  const dersPlani = {
    '7-A': [['Matematik', 5], ['Türkçe', 6], ['Fen Bilimleri', 4], ['İngilizce', 4], ['Sosyal Bilgiler', 3]],
    '7-B': [['Matematik', 5], ['Türkçe', 6], ['Fen Bilimleri', 4]],
    '8-A': [['Matematik', 5], ['İngilizce', 4], ['Müzik', 2]]
  };
  const dersId = {};
  for (const sinif of sinifAdlari) {
    dersId[sinif] = [];
    const liste = dersPlani[sinif];
    for (let i = 0; i < liste.length; i++) {
      const d = await iste('/api/school/lesson', 'POST',
        { classId: siniflar[sinif], subject: liste[i][0], weeklyHours: liste[i][1] }, T);
      if (!d.body.lesson) continue;
      const t = ogretmenler[i % ogretmenler.length];
      await iste('/api/school/lesson-update', 'POST',
        { lessonId: d.body.lesson.id, teacherId: t.id }, T);
      dersId[sinif].push(d.body.lesson.id);
    }
  }

  /* Haftalık program */
  /* Her sınıf farklı saat diliminden başlar; gerçek okulda aynı öğretmen
     aynı saatte iki sınıfta olamaz. Sonda tek bir kasıtlı çakışma bırakılıyor
     ki uyarı özelliği ekranda görünsün. */
  const saatDilimi = {
    '7-A': [['09:20', '10:00'], ['10:10', '10:50'], ['11:00', '11:40'], ['13:20', '14:00'], ['14:10', '14:50']],
    '7-B': [['10:10', '10:50'], ['11:00', '11:40'], ['13:20', '14:00'], ['14:10', '14:50'], ['15:00', '15:40']],
    '8-A': [['11:00', '11:40'], ['13:20', '14:00'], ['14:10', '14:50'], ['15:00', '15:40'], ['09:20', '10:00']]
  };
  const plan = {
    '7-A': { 1: [0, 1, 2, 3], 2: [1, 0, 4, 2], 3: [2, 3, 0, 1, 4], 4: [0, 1, 2], 5: [3, 4, 0, 1] },
    '7-B': { 1: [0, 1, 2], 2: [1, 2, 0], 3: [2, 0, 1], 4: [0, 1], 5: [1, 2, 0] },
    '8-A': { 1: [0, 1], 2: [2, 0, 1], 3: [1, 0], 4: [0, 2, 1], 5: [1, 0] }
  };
  let sayac = 0;
  for (const sinif of sinifAdlari) {
    for (const gun of Object.keys(plan[sinif])) {
      const dizi = plan[sinif][gun];
      for (let i = 0; i < dizi.length; i++) {
        const lid = dersId[sinif][dizi[i]];
        if (!lid) continue;
        const dilim = saatDilimi[sinif][i % saatDilimi[sinif].length];
        const r = await iste('/api/school/schedule-add', 'POST', {
          classId: siniflar[sinif], day: Number(gun), lessonId: lid,
          start: dilim[0], end: dilim[1]
        }, T);
        if (r.status === 200) sayac++;
      }
    }
  }

  /* Bir rol tanımla ve öğretmene ver */
  const rol = await iste('/api/school/role', 'POST', {
    name: 'Müdür Yardımcısı',
    permissions: ['sinif.yonet', 'program.duzenle', 'ogrenci.yerlestir', 'ders.yonet', 'devamsizlik.gor']
  }, T);
  await iste('/api/school/role', 'POST', {
    name: 'Rehber Öğretmen',
    permissions: ['ogrenci.portal', 'devamsizlik.gor', 'mesaj.toplu']
  }, T);
  const ogrtListe = await iste('/api/school/teachers', 'GET', null, T);
  /* Müdür öğretmenlerin e-postasını görmez (KVKK): adından bulunur (seed.js). */
  const fen = ogrtListe.body.teachers.find(t => t.fullName === 'Ali Yıldız');
  if (fen && rol.body.role) {
    await iste('/api/school/role-assign', 'POST', { userId: fen.id, roleId: rol.body.role.id }, T);
  }

  /* Ödevler: bir kısmı sonuçlanmış olsun */
  const mat = await girisYap('mat@test.com', 'Test1234!');
  const gun = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const odevler = [
    ['Kesirler alıştırması', 'Sayfa 42-45 arası tüm sorular', gun(-10), gun(-3)],
    ['Üslü sayılar testi', 'Testi çözüp getir', gun(-2), gun(1)],
    ['Geometri problemleri', 'Üçgenler konusu, defterinize', gun(0), gun(6)],
    ['Denklem çalışması', 'Çalışma kitabı 60-64', gun(1), gun(9)]
  ];
  const acilan = [];
  const hedefler = await iste('/api/assignments/hedefler', 'GET', null, mat.token);
  const tumIdler = [];
  for (const c of hedefler.body.classes) for (const st of c.students) tumIdler.push(st.id);
  for (const [b, a, bas, bit] of odevler) {
    const r = await iste('/api/assignments', 'POST',
      { title: b, description: a, startAt: bas, endAt: bit, studentIds: tumIdler }, mat.token);
    if (r.body.assignment) acilan.push(r.body.assignment.id);
  }
  if (acilan.length) {
    const detay = await iste('/api/assignments/' + acilan[0], 'GET', null, mat.token);
    const sonuclar = {};
    const secenek = ['yapti', 'yapti', 'eksik', 'yapmadi', 'yapti', 'izinli'];
    detay.body.students.forEach((s, i) => { sonuclar[s.id] = secenek[i % secenek.length]; });
    await iste('/api/assignments/' + acilan[0] + '/finish', 'POST', { results: sonuclar }, mat.token);
  }

  /* Sınav grubu ve notlar */
  const grup = await iste('/api/examgroups', 'POST', { name: 'Dönem 1 - Yazılılar' }, mat.token);
  if (grup.body.group) {
    const gid = grup.body.group.id;
    const s1 = await iste('/api/exams', 'POST', { groupId: gid, name: '1. Yazılı', weight: 50 }, mat.token);
    await iste('/api/exams', 'POST', { groupId: gid, name: '2. Yazılı', weight: 50 }, mat.token);
    if (s1.body.exam) {
      const d = await iste('/api/exams/' + s1.body.exam.id, 'GET', null, mat.token);
      const notlar = {};
      const puanlar = [85, 72, 91, 64, 78, 88];
      (d.body.students || []).forEach((s, i) => { notlar[s.id] = puanlar[i % puanlar.length]; });
      await iste('/api/exams/' + s1.body.exam.id + '/grades', 'POST', { grades: notlar }, mat.token);
    }
  }

  /* Kasıtlı tek çakışma: 7-A Matematik öğretmenini Cuma 09:20'de 8-A'ya da yaz. */
  const cuma = await iste('/api/school/schedule?classId=' + siniflar['8-A'], 'GET', null, T);
  const matDers = (cuma.body.lessons || []).find(l => l.subject === 'Matematik');
  if (matDers) {
    await iste('/api/school/schedule-add', 'POST', {
      classId: siniflar['8-A'], day: 5, lessonId: matDers.id, start: '09:20', end: '10:00'
    }, T);
  }

  /* ================= sınav şablonları ve LGS deneme serisi =================
     Grafikte çizgi ve en düşük/en yüksek bandı görünsün diye beş deneme,
     her öğrencide farklı gidişat. Değerler virgüllü yazılır (490,161). */
  const virgul = n => String(Math.round(n * 1000) / 1000).replace('.', ',');
  const lgs = (await iste('/api/exams/sablonlar', 'POST', { hazir: 'lgs' }, mat.token)).body.sablon;
  await iste('/api/exams/sablonlar', 'POST', { hazir: 'yazili' }, mat.token);
  const testSablon = (await iste('/api/exams/sablonlar', 'POST', { hazir: 'test' }, mat.token)).body.sablon;
  await iste('/api/exams/sablonlar', 'POST', {
    name: 'Kazanım Testi (20 soru)',
    olcumler: [{ ad: 'Doğru', alt: 0, ust: 20 }, { ad: 'Yanlış', alt: 0, ust: 20 }, { ad: 'Boş', alt: 0, ust: 20 },
      { ad: 'Puan', alt: 0, ust: 100, ana: true }]
  }, mat.token);
  const tarihler = [gun(-100), gun(-72), gun(-44), gun(-16), gun(-2)];
  let lgsSayi = 0;
  for (let i = 0; lgs && i < tarihler.length; i++) {
    const e = (await iste('/api/exams', 'POST',
      { name: 'LGS Deneme ' + (i + 1), templateId: lgs.id, tarih: tarihler[i] }, mat.token)).body.exam;
    if (!e) continue;
    const d = await iste('/api/exams/' + e.id, 'GET', null, mat.token);
    const degerler = {};
    (d.body.students || []).forEach((s, k) => {
      const egilim = (k % 3 === 0 ? 14 : k % 3 === 1 ? 6 : -3) * i;     // kimi yükselir, kimi düşer
      const taban = 330 + ((k * 47) % 120) + egilim + (i % 2 ? 7.25 : -3.5);
      const net = (u, fark) => Math.max(-3, Math.min(u, (u * 0.45) + ((k * 3 + i * fark) % (u * 0.5))));
      degerler[s.id] = {
        TR: virgul(net(20, 2)), MAT: virgul(net(20, 3)), FEN: virgul(net(20, 1)),
        INK: virgul(net(10, 1)), DIN: virgul(net(10, 2)), ING: virgul(net(10, 1)),
        LGS: virgul(Math.min(500, Math.max(100, taban + 0.161)))
      };
      if (k === 4 && i === 3) delete degerler[s.id];    // bir öğrenci o denemeye girmedi
    });
    await iste('/api/exams/' + e.id + '/grades', 'POST', { degerler }, mat.token);
    lgsSayi++;
  }
  /* Grupsuz bir test sınavı (Doğru / Yanlış / Net) */
  if (testSablon) {
    const t = (await iste('/api/exams', 'POST',
      { name: 'Üslü Sayılar Testi', templateId: testSablon.id, tarih: gun(-6) }, mat.token)).body.exam;
    if (t) {
      const d = await iste('/api/exams/' + t.id, 'GET', null, mat.token);
      const degerler = {};
      (d.body.students || []).forEach((s, k) => {
        const dogru = 12 + (k * 5) % 9, yanlis = (k * 3) % 6;
        degerler[s.id] = { D: String(dogru), Y: String(yanlis), N: virgul(dogru - yanlis / 3) };
      });
      await iste('/api/exams/' + t.id + '/grades', 'POST', { degerler }, mat.token);
    }
  }
  /* Dönem grubunun ikinci yazılısı da girilsin, ortalama tam çıksın */
  const gruplarim = await iste('/api/examgroups', 'GET', null, mat.token);
  const donem = (gruplarim.body.groups || [])[0];
  if (donem) {
    const gd = await iste('/api/examgroups/' + donem.id, 'GET', null, mat.token);
    const ikinci = (gd.body.exams || []).find(e => e.name === '2. Yazılı');
    if (ikinci) {
      const d = await iste('/api/exams/' + ikinci.id, 'GET', null, mat.token);
      const notlar = {};
      (d.body.students || []).forEach((s, i) => { notlar[s.id] = virgul(58 + (i * 13) % 41 + 0.5); });
      await iste('/api/exams/' + ikinci.id + '/grades', 'POST', { grades: notlar }, mat.token);
    }
  }

  /* ================= ödev: altı sonuç türü ve açılma zamanları ================= */
  const odevListe = await iste('/api/assignments', 'GET', null, mat.token);
  const bitmis = (odevListe.body.assignments || []).find(a => a.title === 'Kesirler alıştırması');
  if (bitmis) {
    const det = await iste('/api/assignments/' + bitmis.id, 'GET', null, mat.token);
    const turler = ['yapti', 'gec', 'eksik', 'yapmadi', 'izinli', 'gelmedi', 'yapti', 'yapti'];
    const sonuclar = {};
    det.body.students.forEach((s, i) => { sonuclar[s.id] = turler[i % turler.length]; });
    await iste('/api/assignments/' + bitmis.id + '/finish', 'POST', { results: sonuclar }, mat.token);
  }
  /* Öğrencilerin bir kısmı aktif ödevleri açmış olsun (öğretmen "açıldı" zamanını görür;
     açılmamışlar öğrencinin listesinde turuncu). ogrenci1 iki ödevi açmaz. */
  const ogrenciGirisleri = [['ogrenci1@test.com', 'Test1234!'], ['ogrenci2@test.com', 'Test1234!'],
    ['deniz.kara@okul.com', 'Ogrenci2026'], ['elif.sahin@okul.com', 'Ogrenci2026']];
  for (let i = 0; i < ogrenciGirisleri.length; i++) {
    let o;
    try { o = await girisYap(ogrenciGirisleri[i][0], ogrenciGirisleri[i][1]); } catch (e) { continue; }
    /* Okulun açtığı hesap ilk girişte aydınlatma metnini onaylamalı; onaysız
       her istek 403 döner (kvkkGerek). */
    await iste('/api/kvkk-onay', 'POST', { onay: true }, o.token);
    const p = await iste('/api/progress', 'GET', null, o.token);
    const aktifler = (p.body.assignments || []).filter(a => a.status === 'active');
    for (let j = 0; j < aktifler.length; j++) {
      if (i === 0 && (aktifler[j].title === 'Denklem çalışması' || aktifler[j].title === 'Geometri problemleri')) continue;
      if ((i + j) % 3 === 2) continue;
      await iste('/api/assignments/' + aktifler[j].id + '/acildi', 'POST', {}, o.token);
    }
    /* Öğrenciden öğretmene bir mesaj */
    if (i === 0) {
      const hed = await iste('/api/mesajlar/hedefler', 'GET', null, o.token);
      const ogretmen = (hed.body.kisiler || []).find(k => k.rol === 'teacher');
      if (ogretmen) {
        await iste('/api/mesajlar', 'POST', { tur: 'mesaj', konu: 'Geometri ödevi hakkında',
          govde: 'Hocam, 3. sorudaki üçgenin açısını bulamadım. Yarın derste sorabilir miyim?',
          hedef: { tur: 'kisi', kisiler: [ogretmen.id] } }, o.token);
      }
    }
  }

  /* ================= mesaj ve duyurular ================= */
  await iste('/api/mesajlar', 'POST', { tur: 'duyuru', konu: 'Veli toplantısı 3 Ekim Cuma',
    govde: 'Değerli velilerimiz, 1. dönem veli toplantısı 3 Ekim Cuma 17:00\'de okul konferans salonunda yapılacaktır.',
    hedef: { tur: 'okul' } }, T);
  await iste('/api/mesajlar', 'POST', { tur: 'duyuru', konu: 'LGS deneme sınavı takvimi',
    govde: 'Bu dönem her ayın son cuması LGS deneme sınavı yapılacaktır. Sonuçlar grafikte görünecek.',
    hedef: { tur: 'sinif', siniflar: [siniflar['8-A'], siniflar['7-A']] } }, T);
  const matHedef = await iste('/api/mesajlar/hedefler', 'GET', null, mat.token);
  const sinifHedef = (matHedef.body.siniflar || []).map(c => c.id).slice(0, 1);
  if (sinifHedef.length) {
    await iste('/api/mesajlar', 'POST', { tur: 'mesaj', konu: 'Kesirler ödevi sonuçlandı',
      govde: 'Ödevleri kontrol ettim. Eksik yapanlar pazartesiye kadar tamamlasın.',
      hedef: { tur: 'sinif', siniflar: sinifHedef } }, mat.token);
  }

  /* ================= yoklama: bugün ve geçmiş günler ================= */
  const derslerim = await iste('/api/devamsizlik/derslerim', 'GET', null, mat.token);
  const durumlar = ['yok', 'gec', 'izinli'];
  let yoklamaSayi = 0;
  for (const ders of (derslerim.body.dersler || []).slice(0, 2)) {
    for (const geri of [0, 1, 2, 5, 8]) {
      const tarih = gun(-geri);
      const ekran = await iste('/api/devamsizlik/yoklama?lessonId=' + ders.id + '&tarih=' + tarih, 'GET', null, mat.token);
      const girisler = (ekran.body.ogrenciler || []).map((o, k) => {
        const durum = (k + geri) % 4 === 0 ? durumlar[(k + geri) % 3] : 'var';
        return { ogrenciId: o.id, durum, not: durum === 'izinli' ? 'Doktor raporu' : '' };
      });
      if (!girisler.length) continue;
      const r = await iste('/api/devamsizlik/yoklama', 'POST', { lessonId: ders.id, tarih, girisler }, mat.token);
      if (r.status === 200) yoklamaSayi++;
    }
  }

  /* ================= okul takvimi ================= */
  const takvimKayitlari = [
    [gun(3), gun(3), 'Veli toplantısı', 'toplanti', 'Konferans salonu, 17:00'],
    [gun(10), gun(12), 'Ara tatil', 'tatil', ''],
    [gun(6), gun(6), 'LGS deneme sınavı', 'sinav', '8. sınıflar, 1. ders'],
    [gun(-4), gun(-4), 'Bilim fuarı', 'etkinlik', 'Okul bahçesi']
  ];
  for (const [bas, bit, baslik, tur, aciklama] of takvimKayitlari) {
    await iste('/api/takvim/etkinlik', 'POST', { tarih: bas, bitis: bit, baslik, tur, aciklama }, T);
  }

  /* ================= portalı olmayan yetişkin hesapları =================
     Kemal Arslan kaydolmuş ama henüz hiçbir okula eklenmemiş (müdür "Kodla
     ekle" ile onun kişi kodunu girsin); Hülya Demirtaş okulunu açtırmak
     istiyor: kişi kodunu yöneticiye verir, yönetici "Okul aç" ile Karşıyaka
     Deneme Ortaokulu'nu açıp onu müdür yapar (müdür başvurusu yok). */
  await hesapAc({ fullName: 'Kemal Arslan', username: 'kemal.arslan', email: 'kemal.arslan@test.com',
    password: 'Ogretmen2026!', phone: '05331112233' });
  await hesapAc({ fullName: 'Hülya Demirtaş', username: 'hulya.demirtas', email: 'hulya.demirtas@test.com',
    password: 'Mudur2026!', phone: '05441234567' });

  console.log('zengin veri hazir: ' + sinifAdlari.length + ' sinif, ' + sayac + ' ders saati, ' +
    acilan.length + ' ödev, ' + lgsSayi + ' LGS denemesi, ' + yoklamaSayi + ' yoklama');
})().catch(e => { console.error('HATA:', e.message); process.exit(1); });
