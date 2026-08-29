/* Ekran goruntusu icin ortam hazirlar: sinif, ders, ornek Excel dosyasi.
   Mudur oturum anahtarini ve ornek dosyanin base64'unu basar. */
const fs = require('fs');
const path = require('path');
const { iste, girisYap } = require('./giris');
const xlsx = require(require('path').join(__dirname, '..', 'sunucu', 'yardimci', 'xlsx.js'));

(async () => {
  const mudur = await girisYap('mudur@test.com', 'Test1234!');
  const T = mudur.token;

  /* Siniflar */
  for (const ad of ['9-A', '9-B', '10-A']) {
    await iste('/api/school/class', 'POST', { name: ad }, T);
  }
  const siniflar = await iste('/api/school/classes', 'GET', null, T);
  const dersler = ['Matematik', 'Türkçe', 'Fen Bilimleri'];
  for (const c of siniflar.body.classes) {
    for (const d of dersler) {
      await iste('/api/school/lesson', 'POST',
        { classId: c.id, subject: d, weeklyHours: 4 }, T);
    }
  }

  /* Ekranda hem gecerli hem hatali satirlar gorunsun diye karisik bir liste */
  const basliklar = ['Ad Soyad', 'Kullanıcı adı (e-posta)', 'Şifre', 'Sınıf', 'Müdür notu'];
  const satirlar = [
    ['Elif Kara', 'elif.kara@okul.com', 'Okul2026x', '9-A', 'Kaydı tamamlandı'],
    ['Can Aydın', 'can.aydin@okul.com', 'Okul2026y', '9-A', ''],
    ['Deniz Yalçın', 'deniz.yalcin@okul.com', 'Okul2026z', '9-B', ''],
    ['Selin Arda', 'selin.arda@okul.com', 'Okul2026q', '10-A', 'Nakil geldi'],
    ['Burak', 'burak@okul.com', 'Okul2026w', '9-A', ''],
    ['Mert Aksoy', 'mert-aksoy-okul', 'Okul2026e', '9-A', ''],
    ['Ece Yalın', 'ece.yalin@okul.com', '1234', '9-B', ''],
    ['Ali Vural', 'ali.vural@okul.com', 'Okul2026r', '11-C', ''],
    ['Elif Kara', 'elif.kara@okul.com', 'Okul2026x', '9-A', '']
  ];
  const buf = xlsx.yaz([{
    ad: 'Öğrenciler', basliklar: basliklar, satirlar: satirlar,
    genislikler: [26, 30, 16, 12, 34]
  }]);
  const dosyaYolu = path.join(__dirname, 'ornek-ogrenci-listesi.xlsx');
  fs.writeFileSync(dosyaYolu, buf);

  console.log('TOKEN=' + T);
  console.log('B64=' + buf.toString('base64'));
  console.log('DOSYA=' + dosyaYolu);
})().catch(e => { console.error('HATA:', e.message); process.exit(1); });
