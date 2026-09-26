'use strict';
/* Ekranlarla kılavuzun metinleri: araclar/gezinti.js'in ürettiği albümde
   (ekran-goruntuleri/index.html) her fotoğrafın altında ne gösterdiği yazar.
   Anahtar "klasör|adımın adı"dır (gezinti.js'teki ad ile birebir). "bolum"
   verilen adımdan önce alt başlık açılır (yalnız bilgisayar kısmında).
   Metinlerde yalnızca <b> ve <i> kullanılır. Fotoğraflardaki bütün kişiler,
   okullar ve notlar test verisidir. */

const A = (metin, bolum) => (bolum ? { bolum, metin } : { metin });

const ROL_METNI = {
  _giris: `Bu sayfa Eğitim Evi'nin bütün ekranlarını gerçek bir tarayıcıda çekilmiş fotoğraflarla anlatır.
    Önce <b>müdürün gözünden</b> bir okulun Eğitim Evi'ne nasıl kurulduğu ve her gün nasıl yönetildiği gelir:
    öğrencileri Excel ile içeri almak, özel rol vermek, okulda kullanılmayan bölümleri kapatmak, ödev ve
    sınavları izlemek. Ardından dış sayfalar ve sırasıyla öğretmen, öğrenci, veli, servisçi ve site
    yöneticisi gelir. Birinci kısım bilgisayar görünümü, ikinci kısım aynı ekranların telefon görünümüdür.`,
  _bilgisayar: `Bütün ekranlar önce bilgisayarda: 1440 piksel genişlikte, açık görünümde; bazıları koyu görünümle de.`,
  _telefon: `Aynı ekranlar telefonda (390 piksel genişlik). Görüntüleyicide telefon ekranı boyunda açılır; uzun sayfa fare tekerleğiyle aşağı kaydırılarak okunur.`,

  mudur: { baslik: 'Müdürün gözünden: okulu kurmak ve yönetmek',
    giris: `Müdür okulun her şeyini buradan yönetir: öğretmenleri ve öğrencileri ekler, sınıfları ve ders
      programını kurar, kimin neyi yapabileceğini rollerle belirler, okulda kullanılmayan bölümleri kapatır.
      Bu okulun müdürü aynı hesapla bir öğrencinin velisidir; aşağıda hesabın veli tarafı ayrıca gösterilir.` },
  giris: { baslik: 'Dış sayfalar: açılış, giriş, kayıt, okul sayfası',
    giris: `Giriş yapmamış birinin gördüğü sayfalar: sitenin tanıtımı, sık sorulan sorular, kullanım koşulları,
      aydınlatma metni, giriş ve kayıt kartları ile her okulun kendi adresindeki sayfası.` },
  'mudur-veli': { baslik: 'Aynı hesabın veli tarafı',
    giris: `Tek hesapla birden çok rol olur. Müdür "Hesap değiştir"den çocuğunun velisi olarak devam edince menü
      velininkine döner; çocuğunun ödevlerini, devamsızlığını ve servisini görür.` },
  ogretmen: { baslik: 'Öğretmen',
    giris: `Öğretmen ödev verir ve sonuçlandırır, sınav açıp not girer, ders programından yoklama alır, ders
      verdiği sınıfların sonuçlarına bakar. Bu öğretmen iki okulda ders veriyor; iki okul aynı hesaptadır.` },
  'ogretmen-ikinci-okul': { baslik: 'Öğretmenin ikinci okulu',
    giris: `Aynı öğretmen hesabı ikinci okula geçince yalnızca o okulun sınıfları, ödevleri ve öğrencileri görünür.` },
  'ozellik-kapali': { baslik: 'Okul bir bölümü kapatınca',
    giris: `Müdür Özellikler sayfasından ödevi ve etüdü kapatınca öğretmenin ekranı nasıl değişir: bölüm menüden ve
      ana sayfadan kalkar, adresi açılsa bile içerik gelmez. Kayıtlar silinmez.` },
  'nakil-ogrenci': { baslik: 'Okul değiştiren (nakil) öğrenci',
    giris: `Öğrenci hesabı kişiye aittir. Yeni okul öğrenciyi T.C. no ve doğum tarihiyle kendine aldı; eski okulun
      kayıtları eski okulda kaldı. Öğrenci onları yıl seçicisinden salt okunur olarak görür.` },
  ogrenci: { baslik: 'Öğrenci',
    giris: `Öğrenci ödevlerini, sınav notlarını ve grafiğini, devamsızlığını, ders programını, etütlerini ve servisini
      takip eder; ödevine dosya yükler, kendine hatırlatıcı kurar.` },
  veli: { baslik: 'Veli (iki çocuk)',
    giris: `Bu veli iki çocuğunu aynı hesaptan izler. Her satırda ve her bildirimde hangi çocuğun olduğu yazar;
      üstteki şeritten tek çocuğa daraltılır.` },
  servisci: { baslik: 'Servisçi',
    giris: `Servisçi hesabını okul açar. Servisçi seferi başlatır; telefonunun konumu öğrenciye ve veliye haritada
      görünür, servis eve yaklaşınca bildirim gider.` },
  rolsuz: { baslik: 'Yeni açılmış yetişkin hesabı',
    giris: `Kendi kaydolan yetişkin henüz bir role bağlı değildir. "Ekle" ile çocuğunu ekler, öğretmen olarak bir
      okula katılır ya da müdürse okulunu kaydeder.` },
  'yeni-mudur': { baslik: 'Site yöneticisinin açtığı okulun müdürü',
    giris: `Okulu site yöneticisi açtığında müdüre geçici bir şifre verilir. Müdür ilk girişte önce aydınlatma
      metnini onaylar, sonra kendi şifresini belirlemeden içeri giremez.` },
  admin: { baslik: 'Site yöneticisi',
    giris: `Site yöneticisi okul başvurularını onaylar ya da okulu kendisi açar, müdürleri görür, yedek alır,
      açılış sayfasındaki yorumları denetler.` }
};

/* Eğitim Evi Aile (ayrı depo) öykünücüde çekilen ekranlar: dosya -> adım adı. */
const UYGULAMA_EKRANLARI = {
  '01-giris.png': 'Uygulama: ne paylaşıldığı ve giriş',
  '02-giris-dolu.png': 'Uygulama: öğrenci hesabıyla giriş ve açık onay',
  '03-konum-izni-soruluyor.png': 'Uygulama: konum izni isteniyor',
  '04-bagli-izinler.png': 'Uygulama: bağlandı, izinler sırayla',
  '05-durum.png': 'Uygulama: bütün izinler verildi, son gönderim',
  '06-bildirim-cubugu.png': 'Uygulama: bildirim çubuğunda her zaman görünür'
};

module.exports = { ROL_METNI, ADIM_METNI, UYGULAMA_EKRANLARI };
