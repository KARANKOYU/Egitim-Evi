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

const ADIM_METNI = {
  /* ================= dış sayfalar ================= */
  'giris|Açılış': A(`Sitenin açılışı: Eğitim Evi'nin ne olduğu, rakamlar (kaç okul, kaç kişi, şu an kaç kişi açık),
    neler olduğu, okulun nasıl başladığı ve kimin ne yaptığı.`),
  'giris|Açılış — kullanıcı yorumları ve alt bilgi': A(`Kullananların 0–5 yıldızlı yorumları. Yalnızca yetişkinler yazar,
    adı kısaltılarak gösterilir, uygunsuz kelime süzgecinden geçer. Hiç yorum yoksa "İlk yorumu sen yaz" yazar.`),
  'giris|Yapımcılar listesi': A(`Üstteki <b>Yapımcılar</b> düğmesi önce listeyi açar; bir kişiye tıklayınca onun GitHub
    sayfasına gidilir. Liste depodaki yapimcilar.json dosyasından gelir.`),
  'giris|Üstteki ay düğmesi — açılış koyu görünümde': A(`Ay düğmesiyle koyu görünüme geçilir. Seçim bu tarayıcıda hatırlanır.`),
  'giris|Güneş düğmesi — açık görünüme döndü': A(`Koyu görünümde aynı yerde güneş durur; basınca açık görünüme dönülür.`),
  'giris|Hakkında': A(`Projenin ne olduğu, bilgilerin nerede durduğu, nasıl yapıldığı ve yapımcılar.`),
  'giris|Sık sorulan sorular': A(`Başlarken, hesap ve giriş, okul hayatı, gizlilik ve telefon başlıklarında sık sorulan sorular.`),
  'giris|Sık sorulan sorular — bir soru açık': A(`Soruya dokununca cevabı açılır: burada okul değiştiren öğrencinin kayıtlarının ne olduğu.`),
  'giris|Android uygulaması — sürümler ve indirme': A(`Üstteki "Android uygulaması" düğmesi bu sayfayı açar
    (egitimevi.org/indir). Son sürüm üstte büyük düğmeyle; altta bütün sürümler tarih, değişiklik notu, boyut ve
    SHA-256 özetiyle bir tabloda. Liste uygulamanın GitHub deposundaki sürümlerden kendiliğinden gelir.`),
  'giris|Kullanım koşulları (sorumluluğun sınırları)': A(`Hizmetin niteliği, kullanıcının yükümlülükleri ve sorumluluğun
    sınırlandırılması. Kayıtta ve koşullar güncellenince onay istenir.`),
  'giris|Aydınlatma metni (KVKK)': A(`Hangi kişisel verinin neden işlendiği, kimin gördüğü, ne kadar saklandığı ve kişinin
    hakları. Metin değişince kullanıcılardan yeniden onay istenir.`),
  'giris|Aydınlatma metninde Yapımcılar — önce liste açılır': A(`Belge sayfalarında da üst şerit aynıdır: Yapımcılar düğmesi
    sayfadan çıkmadan listeyi açar.`),
  'giris|Giriş ve okul arama': A(`Genel giriş kartı. Öğrenci ve servisçi önce okulunu seçer; son girilen okul bu tarayıcıda hatırlanır.`),
  'giris|Okul arama — büyük/küçük harf ve yazım hatası': A(`Okul araması MEB'in bütün okulları içinde yapılır; büyük/küçük harf,
    Türkçe harf ve yazım hatası fark etmez.`),
  'giris|Okul arama — harfleri yer değiştirmiş kelime': A(`Harfleri yer değiştirmiş kelimeler de bulunur; hangi kelimeyle arandığı yazılır.`),
  'giris|Kayıt ol (şifre kuralları, telefon ülke kodu)': A(`Yetişkin hesabı açma. Şifre kuralları yazdıkça işaretlenir,
    telefon ülke koduyla girilir. Öğrenci hesabını okul açar, öğrenci kendisi kaydolmaz.`),
  'giris|Kayıt — hatalar alanların altında': A(`Eksik ya da hatalı her alanın altında kırmızı yazıyla ne yapılması gerektiği yazar.`),
  'giris|Okulun sayfası ve girişi (/test-ortaokulu)': A(`Her okulun kendi adresi vardır. Okul bu sayfayı kapak fotoğrafı,
    tanıtım yazısı, galeri ve renkleriyle kendisi düzenler; giriş o okulun içinde aranır.`),
  'giris|Okul girişi — şifre yanlış': A(`Yanlış şifrede kaç deneme hakkı kaldığı yazar; çok denemede hesap bir süre kilitlenir.`),
  'giris|Giriş — böyle bir hesap yok': A(`Kullanıcı adı bulunamazsa bu açıkça söylenir ve kayıt olma bağlantısı çıkar.`),
  'giris|E-posta onay bağlantısı geçersiz': A(`E-posta onay bağlantısı yanlış ya da süresi dolmuşsa hesap açılmaz; yenisi istenir.`),
  'giris|"Bilgilerimi kaydetme" seçilince "Beni hatırla" kalkar': A(`Ortak bilgisayarda "Bilgilerimi bu cihaza kaydetme"
    seçilir; o zaman "Beni hatırla" kendiliğinden kalkar, iki kutu birlikte işaretli olamaz.`),
  'giris|Açılış (koyu)': A(`Açılış sayfası koyu görünümde.`),
  'giris|Okulun sayfası (koyu)': A(`Okulun sayfası koyu görünümde; okulun seçtiği renkler korunur.`),
  'giris|Açılış (telefon)': A(`Açılış telefonda: kartlar alt alta dizilir, düğmeler parmakla basılacak büyüklüktedir.`),
  'giris|Hakkında (telefon)': A(`Hakkında sayfası telefonda.`),
  'giris|Sık sorulan sorular (telefon)': A(`Sık sorulan sorular telefonda.`),
  'giris|Android uygulaması (telefon)': A(`İndirme sayfası telefonda: tablo satırları alt alta kartlara dönüşür.`),
  'giris|Okulun sayfası (telefon)': A(`Okulun sayfası telefonda; giriş kartı sayfanın altında.`),
  'giris|Kayıt ol (telefon)': A(`Kayıt kartı telefonda.`),

  /* ================= müdür ================= */
  'mudur|Ana sayfa': A(`Müdürün ana sayfası: okulun özeti ve sık kullanılan bölümlere kısayollar. Menüde yalnızca okulun
    açık bıraktığı bölümler görünür.`, 'Başlangıç'),
  'mudur|Hesap değiştir (müdür ve veli, tek hesap)': A(`Aynı hesabın rolleri: bu okulun müdürü ve bir öğrencinin velisi.
    Müdür rolleri arasında buradan geçer; <b>Ekle</b> ile yeni rol açar.`),
  'mudur|Takvim (okul etkinlikleri)': A(`Okul takvimi: tatiller, sınav haftaları ve okul etkinlikleri. Öğretmen, öğrenci ve veli de görür.`),
  'mudur|Takvime etkinlik ekleme': A(`Müdür takvime etkinlik ekler: ad, gün ya da tarih aralığı ve açıklama.`),
  'mudur|Mesajlar': A(`Okul içi mesajlar ve duyurular. Müdür tek kişiye, sınıflara, bir rol grubuna ya da bütün okula yazabilir.`,
    'Mesajlar ve duyurular'),
  'mudur|Gönderilenler — okundu sayıları': A(`Gönderilen her mesajın yanında kaç kişinin okuduğu yazar.`),
  'mudur|Duyuru okundu bilgisi': A(`Duyuruya dokununca kimin okuduğu, kimin henüz okumadığı tek tek görünür; okumayanlara
    yeniden hatırlatılabilir.`),
  'mudur|Yeni duyuru penceresi': A(`Yeni duyuru: kime gideceği (okul, rol, sınıf ya da kişiler), konu, metin ve ekler.
    Duyuru cevaplanmaz; gelen herkese bildirim gider.`),
  'mudur|Öğretmenler': A(`Okulun öğretmenleri, branşları ve rolleri. Öğretmen okuldan çıkarılınca verdiği ödevler ve notlar okulda kalır.`,
    'Öğretmenler ve öğrenciler'),
  'mudur|Öğretmeni kodla ekleme penceresi': A(`Öğretmen kendi hesabını açar ve hesabındaki öğretmen kodunu müdüre verir;
    müdür kodu buraya yazıp öğretmeni okula ekler.`),
  'mudur|Öğrenciler': A(`Okulun öğrencileri sınıf sınıf. Öğrenci hesaplarını okul açar; her öğrencinin veli kodu vardır,
    veli bu kodla çocuğunu kendi hesabına ekler.`),
  'mudur|Yeni öğrenci hesabı penceresi': A(`Tek öğrenci hesabı açma: ad, soyad, T.C. kimlik no, sınıf ve doğum tarihi.
    Kullanıcı adı ve ilk şifre önerilir; öğrenci ilk girişte kendi şifresini belirler.`),
  'mudur|Öğrenci ekle — başka okulda kayıtlı T.C.: doğum tarihi isteniyor (nakil)': A(`T.C. no başka bir okulda kayıtlıysa
    öğrenci nakil gelmiştir: doğum tarihi de istenir. İkisi eşleşince var olan hesap bu okula taşınır; eski okulun
    kayıtları eski okulda kalır. Yanlış denemeler saatte 10 ile sınırlıdır.`),
  'mudur|Öğrenci hesabını düzenleme penceresi': A(`Öğrenci bilgilerini düzenleme: sınıfı, okul numarası, iletişim bilgileri,
    şifre yenileme.`),
  'mudur|Bildirim paneli': A(`Üstteki zil: müdüre gelen bildirimler. Bildirime dokununca ilgili sayfa açılır.`),
  'mudur|Giriş bilgisi dağıt penceresi': A(`Bir sınıfın bütün öğrencilerine yeni şifre üretilir ve her öğrenci için
    yazdırılacak bir giriş mektubu hazırlanır (kullanıcı adı, şifre, veli kodu).`),
  'mudur|Sınıflar': A(`Okulun sınıfları ve her sınıfın öğrenci sayısı.`, 'Sınıflar ve ders programı'),
  'mudur|Sınıfın dersleri': A(`Sınıfın dersleri, haftalık saatleri ve dersi veren öğretmen. Öğretmen ancak bir derse atanınca
    o sınıfta ödev verir, yoklama alır.`),
  'mudur|Ders programı (çakışma uyarısıyla)': A(`Sınıfın günlük ders programı. Aynı öğretmen aynı saatte iki derse yazılmışsa
    ders kırmızı uyarıyla işaretlenir.`),
  'mudur|Ders programı — haftalık': A(`Programın haftalık görünümü: Pazartesiden Pazara bütün ders saatleri bir arada.`),
  'mudur|Ders programı — çakışma listesi': A(`Bütün okuldaki çakışmalar tek listede: hangi öğretmen, hangi gün, hangi saat.`),
  'mudur|Ders saati ekleme penceresi': A(`Programa ders saati ekleme: gün, başlangıç ve bitiş saati, ders.`),
  'mudur|Ders saatini düzenleme penceresi': A(`Var olan ders saatinin günü, saati ya da dersi değiştirilir veya silinir.`),
  'mudur|Roller ve yetkiler (hazır Öğretmen rolü)': A(`Kimin neyi yapabileceği rollerle belirlenir. Hazır <b>Öğretmen</b>
    rolü her öğretmende vardır (ödev verir, sonuçlandırır, sınav açar, not girer, yoklama alır, girdiği sınıfların
    sonuçlarını görür); müdür bu yetkileri açıp kapatabilir.`, 'Roller ve özel rol'),
  'mudur|Yeni rol — hazır şablon: Kodlayıcı': A(`Yeni ek rol hazır bir şablondan başlar (Müdür Yardımcısı, Rehber Öğretmen,
    Zümre Başkanı, Kodlayıcı...); şablon seçilince yetkiler kendiliğinden işaretlenir.`),
  'mudur|Rolü düzenleme penceresi (yetkiler, ders/sınıf daraltması)': A(`Rolün yetkileri gruplar hâlinde. Bazı yetkiler
    derslerle ya da sınıflarla daraltılır. Öğretmen rolünde zaten açık olan yetkiler kilitli görünür.`),
  'mudur|Özel rol: Nöbetçi Öğretmen — yetkiler tek tek, yoklama yalnızca 7-A ve 7-B': A(`Şablonsuz, özel bir rol: müdür rolü
    adlandırır, yetkileri tek tek işaretler. Burada <b>Yoklama alır</b> yetkisi yalnızca 7-A ve 7-B sınıflarıyla
    daraltılıyor; rolü alan öğretmen başka sınıfta yoklama alamaz.`),
  'mudur|Özel rol kaydedildi (rol listesinde yetkileri ve daraltmasıyla)': A(`Kaydedilen rol listede yetkileri ve
    daraltmasıyla (hangi sınıflar) görünür. Müdür rolü öğretmenlerden birine buradan verir; öğretmene bildirim gider.`),
  'mudur|Eğitim yılı': A(`Eğitim yılları. Yeni yıl açılınca o yıl aktif olur; geçmiş yıllar salt okunurdur, eski ödev ve
    notlar yıl seçicisinden görülür ama değiştirilemez.`, 'Eğitim yılı ve özellikler'),
  'mudur|Özellikler (okulda kullanılmayan bölümü kapat)': A(`Okulda kullanılmayan bölümler kapatılır: ödev, sınav,
    devamsızlık, etüt, servis, yemek, kulüp, anket. Kapalı bölüm kimsenin menüsünde görünmez; kayıtlar silinmez,
    yeniden açılınca geri gelir.`),
  'mudur|Özellikler — etüt kapatılıyor (kaydetmeden önce)': A(`Anahtar kapatılınca bölümün ne olacağı yazar;
    <b>Kaydet</b> denene kadar hiçbir şey değişmez.`),
  'mudur|Devamsızlık özeti': A(`Okulun devamsızlık özeti: sınıf sınıf, öğrenci öğrenci gelmediği, izinli ve geç kaldığı ders saatleri.`,
    'Devamsızlık ve etüt'),
  'mudur|Etütler': A(`Okulun etütleri: gün, saat, yer, öğretmen ve öğrenci sayısı.`),
  'mudur|Etüt düzenleme penceresi': A(`Etüdün günü, saati, yeri ve öğretmeni değiştirilir.`),
  'mudur|Yeni etüt penceresi': A(`Yeni etüt açma. Etüdün öğretmeni yoklamayı yalnızca etüt günü, başlangıçtan 15 dakika
    önceden itibaren alır.`),
  'mudur|Etüdün öğrencileri': A(`Etüde öğrenciler sınıf sınıf ya da tek tek eklenir.`),
  'mudur|Ders ödevleri': A(`Müdür okulda verilen bütün ödevleri ders ders görür: kaç ödev verildi, kaçı sonuçlandı.`,
    'Ödev ve sınav'),
  'mudur|Ders ödevleri — bir ders açık (ödevler, kim verdi)': A(`Bir dersin ödevleri: adı, veren öğretmen, son teslim ve
    durum. Müdür ödevi açıp sonuçlarına bakabilir.`),
  'mudur|Sınavlar — şablonlar': A(`Okulun sınav şablonları: Yazılı (0–100), Test (doğru, yanlış, net), LGS denemesi ve
    öğretmenlerin kendi şablonları.`),
  'mudur|Yemek listesi': A(`Haftalık yemek listesi; bugün vurgulu. Okuldaki herkes, veli de çocuğunun okulununkini görür.`,
    'Okul hayatı: yemek, servis, kulüp, anket'),
  'mudur|Yemek listesi — düzenleme': A(`<b>Bu haftayı düzenle</b>: her güne satır satır yemek ve isteğe bağlı kalori yazılır.`),
  'mudur|Servisler': A(`Okulun servisleri: plaka, servisçi, şoför ve rehber personel, saatler ve öğrenciler.`),
  'mudur|Servis düzenleme penceresi': A(`Servisin adı, plakası, servisçi hesabı, şoför ve rehber personelin adı ve telefonu,
    sabah ve akşam saati, güzergâh.`),
  'mudur|Servise öğrenci ekleme': A(`Öğrenciler durağıyla servise yazılır. Bir öğrenci tek serviste olur.`),
  'mudur|Kulüpler': A(`Okulun kulüpleri: danışman öğretmen, kontenjan, gün ve saat, başvurunun açık olup olmadığı.`),
  'mudur|Yeni kulüp penceresi': A(`Yeni kulüp açma. Başvuru açıksa öğrenci kendisi katılır; kontenjan dolunca katılım durur.`),
  'mudur|Anketler (sonuçlar)': A(`Okulun anketleri ve sonuçları; her seçeneğin oy sayısı çubukla gösterilir.`),
  'mudur|Yeni anket penceresi': A(`Yeni anket: soru, seçenekler, kime gideceği ve bitiş zamanı. <b>Gizli anket</b> seçilirse
    kimin neyi seçtiğini anketi açan da göremez.`),
  'mudur|Anketin ayrıntısı (kim ne oyladı, gizliyse gizli)': A(`Anketin ayrıntısı: gizli değilse kimin neyi seçtiği görünür.`),
  'mudur|Excel aktarım': A(`Listeler dosyayla toplu alınır ya da verilir: Excel (.xlsx, .xls), LibreOffice (.ods), CSV ve düz metin.
    Önce boş şablon indirilir; kendi dosyanda sütun başlıkları benzer olsun yeter.`, 'Excel ile içeri ve dışarı aktarma'),
  'mudur|İçeri aktarma — öğrenci listesi (.csv) seçildi': A(`Müdür yeni öğrencilerin listesini seçti (dosya en fazla 950 KB).
    Dosya henüz kaydedilmedi; önce <b>Kontrol et</b> ile ne olacağı gösterilir.`),
  'mudur|İçeri aktarma — kontrol: açılacak hesaplar ve hatalı satır (henüz kaydedilmedi)': A(`Kontrol sonucu satır satır:
    açılacak hesaplar, güncellenecekler ve hatalı satırlar (burada geçersiz T.C. no ve 31 Şubat). Hatalı satır
    atlanır; hiçbir şey onaylanmadan kaydedilmez.`),
  'mudur|İçeri aktarma — uygulandı: açılan hesaplar, kullanıcı adları ve giriş mektupları': A(`Onaylanınca hesaplar açılır:
    kullanıcı adları ve ilk şifreler listelenir, her öğrenci için yazdırılacak giriş mektubu hazırlanır. Şifreler bir
    daha gösterilmez; öğrenci ilk girişte kendi şifresini belirler.`),
  'mudur|Dışarı aktarma (Excel listeleri)': A(`Okulun listeleri Excel olarak indirilir: kişi listesi, öğrenciler ve veli kodları,
    öğretmenler, ders programı.`),
  'mudur|İşlem kaydı': A(`Okulda kim, ne zaman, ne yaptı: hesap açma, rol verme, nakil, özellik açıp kapatma, şifre dağıtma.
    Kayıtlar süzülerek aranır.`, 'Kayıtlar, okul adresi ve okul sayfası'),
  'mudur|Okul adresi ve konumu': A(`Okulun adresi (egitimevi.org/okulun-adi) ve haritadaki yeri. Adres değişince eski adres çalışmaz.`),
  'mudur|Okul sayfası (düzenleme ve önizleme)': A(`Okulun kendi sayfası: kapak, logo, tanıtım yazısı, fotoğraf galerisi ve
    renkler. Değişiklik kaydetmeden önce yan tarafta önizlenir.`),
  'mudur|Okul sayfası — kısıtlı CSS, atılan kısımlar': A(`İsteyen okul kısıtlı CSS ile görünümü ince ayarlar. Tehlikeli
    kısımlar (dış adres, içe aktarma, uygulamanın kendi düğmeleri) atılır ve neyin atıldığı yazılır.`),
  'mudur|Ayarlar': A(`Kişisel ayarlar: hesap bilgileri, şifre, görünüm (açık, koyu, sistem), bildirimler, açılış sayfası yorumu.`),
  'mudur|Ana sayfa (koyu)': A(`Ana sayfa koyu görünümde.`, 'Koyu görünüm'),
  'mudur|Ders programı (koyu)': A(`Ders programı koyu görünümde; çakışma uyarısı koyu zeminde de okunur.`),
  'mudur|Okul sayfası (koyu)': A(`Okul sayfası düzenleme ekranı koyu görünümde.`),
  'mudur|Etütler (koyu)': A(`Etütler koyu görünümde.`),
  'mudur|Ana sayfa (telefon)': A(`Ana sayfa telefonda; menü soldaki düğmeyle açılır.`),
  'mudur|Ders programı (telefon)': A(`Ders programı telefonda: gün gün, ders saatleri alt alta.`),
  'mudur|Hesap değiştir (telefon)': A(`Rol seçimi telefonda.`),
  'mudur|Okul sayfası (telefon)': A(`Okul sayfası düzenleme telefonda.`),
  'mudur|Etütler (telefon)': A(`Etütler telefonda.`),
  'mudur|Öğrencinin portalı — şablonlu sınav grafiği (müdür gözünden)': A(`Müdür bir öğrencinin portalına onun gözünden
    bakar: sınav grafiği, ödev sonuçları, devamsızlık.`, 'Öğrencinin portalına bakış'),

  /* ================= müdürün veli tarafı ================= */
  'mudur-veli|Hesap değiştir: veli olarak açık': A(`Aynı hesap şimdi veli olarak açık: rol listesinde "şu an bu roldesin" yazar.`),
  'mudur-veli|Ana sayfa (veli)': A(`Velinin ana sayfası: çocuğun yaklaşan ödevleri, son sonuçlar ve devamsızlık.`),
  'mudur-veli|Ödevler (çocuğun)': A(`Çocuğun ödevleri ve sonuçları; açmadığı ödev turuncu görünür.`),
  'mudur-veli|Devamsızlık': A(`Çocuğun devamsızlığı: hangi gün, hangi ders, gelmedi, izinli ya da geç.`),
  'mudur-veli|İlerleyiş': A(`Çocuğun ödev ve sınav grafikleri.`),
  'mudur-veli|Etütler': A(`Çocuğun etütleri ve etüt yoklaması.`),
  'mudur-veli|Servis': A(`Çocuğun servisi: harita, durak ve sefer sürerken servisin yeri.`),
  'mudur-veli|Hesap değiştir (telefon)': A(`Rol seçimi telefonda.`),
  'mudur-veli|Ödevler (telefon)': A(`Çocuğun ödevleri telefonda.`),

  /* ================= öğretmen ================= */
  'ogretmen|Ana sayfa': A(`Öğretmenin ana sayfası: bugünkü dersleri, sonuçlandırılmayı bekleyen ödevler ve kısayollar.`, 'Başlangıç'),
  'ogretmen|Hesap değiştir (iki okulda öğretmen)': A(`Öğretmen iki okulda ders veriyor; iki okul aynı hesapta, aralarında buradan geçer.`),
  'ogretmen|Öğretmen kodum (Ekle penceresi)': A(`Öğretmenin kişisel kodu. Bir okula katılmak için bu kodu o okulun müdürüne verir.`),
  'ogretmen|Takvim': A(`Takvim: okul etkinlikleri, tatiller ve öğretmenin kendi ödevlerinin son günleri.`),
  'ogretmen|Takvim — gün ayrıntısı': A(`Güne dokununca o günün etkinlikleri ve ödevleri listelenir.`),
  'ogretmen|Mesajlar': A(`Öğretmenin mesaj kutusu: gelenler ve gönderilenler.`, 'Mesajlar'),
  'ogretmen|Gönderilen mesaj (düzenlendi)': A(`Gönderilen mesaj sonradan düzeltilebilir; alıcılar "düzenlendi" yazısını görür.`),
  'ogretmen|Mesajı düzeltme penceresi': A(`Mesajın konusu ve metni düzeltilir.`),
  'ogretmen|Yeni mesaj': A(`Yeni mesaj: kişiye, sınıfa ya da (yetkisi varsa) bir gruba.`),
  'ogretmen|Ders programım (bugünün dersinde "Şu an — yoklama al")': A(`Öğretmenin haftalık programı. Şu an süren dersin
    düğmesi <b>Şu an — yoklama al</b> diye öne çıkar; bugün başlamış öteki derslerde <b>Yoklama</b> düğmesi durur.`,
    'Ders programından yoklama'),
  'ogretmen|Ders programından yoklama: Geldi · Gelmedi izinli · Gelmedi izinsiz': A(`Yoklama penceresi: o dersin öğrencileri
    alt alta, her birinde <b>Geldi · Gelmedi (izinli) · Gelmedi (izinsiz)</b>. Telefonda tam ekran açılır, düğmeler
    parmakla basılacak büyüklüktedir.`),
  'ogretmen|Yoklama kaydedildi (gelmeyenin velisine bildirim)': A(`<b>Kaydet</b> denince gelmeyen öğrencinin velisine
    "Çocuğunuz ... bugün saat ... Matematik dersine gelmedi" diye bildirim gider.`),
  'ogretmen|Sınıflarım (ders verdiğim sınıflar ve öğrenciler)': A(`Sınıflarım: öğretmenin ders verdiği sınıflar ve
    öğrencileri. Müdür bu bölümü rollerden açıp kapatır; öğretmen ders vermediği sınıfı açamaz.`, 'Sınıflarım'),
  'ogretmen|Sınıflarım — öğrencinin ödevleri (yaptı mı) ve sınav sonuçları': A(`Öğrenciye dokununca öğretmenin ona verdiği
    ödevler sonuçlarıyla (yaptı, geç yaptı...) ve öğrencinin sınav sonuçları açılır.`),
  'ogretmen|Ödevler': A(`Öğretmenin verdiği ödevler: süren, sonuçlandırılmayı bekleyen ve sonuçlanmış.`, 'Ödev'),
  'ogretmen|Ödevler — süzgeç: sonuçlananlar': A(`Süzgeçle ders, durum ve tarih aralığına göre daraltılır.`),
  'ogretmen|Yeni ödev penceresi (ekler: sürükle-bırak)': A(`Yeni ödev: ders, ad, açıklama, başlangıç ve son teslim
    (gün ve saat), kimlere gideceği (sınıflar ve öğrenciler tek tek). Dosyalar sürükleyip bırakılarak eklenir.`),
  'ogretmen|Yeni ödev — son tarih takvimi (hafta numarası, Bugün · Temizle · Tamam)': A(`Tarih K12net'teki gibi
    "02.10.2026" yazar, yanındaki takvim düğmesi ayı açar: solda hafta numarası, <b>Bugün · Temizle · Tamam</b>. Günlerin
    altındaki noktalar o güne düşen tatili, okul etkinliğini ve öğretmenin öteki ödevlerini gösterir; üzerine gelinen
    günün ajandası altta yazar. Başlangıçtan önceki günler seçilemez. Saat ayrı listeden seçilir.`),
  'ogretmen|Yeni ödev — takvim (telefon)': A(`Telefonda takvim ekranın altından açılır; günler parmakla basılacak büyüklüktedir.`),
  'ogretmen|Yeni mesaj — ekler kutusu': A(`Mesaja da dosya eklenir: sürükle-bırak ya da tıklayıp seç, birden çok dosya.`),
  'ogretmen|Yeni mesaj — iki dosya sürükleyip bırakıldı': A(`Eklenen dosyalar boyutlarıyla listelenir. Bir mesajın ekleri
    toplam 150 MB olabilir ve 7 gün sonra silinir.`),
  'ogretmen|Yeni ödev — ek dosyayla': A(`Örnek ödev: "Oran orantı çalışma kâğıdı", ekinde PDF çalışma kâğıdı. Öğrencilere
    "Yeni ödev" bildirimi, velilerine de çocuğun adıyla aynı bildirim gider.`),
  'ogretmen|Ödev kontrolü (sonuçlanmış, 6 sonuç türü)': A(`Ödev kontrol ekranı: her öğrencinin yanında sonuç seçilir:
    <b>Yaptı · Geç yaptı · Eksik · Yapmadı · Gelmedi (izinli) · Gelmedi (izinsiz)</b>. Öğrenciye "Matematik dersinden
    "..." ödevi açıklandı: Yaptı" diye bildirim gider.`),
  'ogretmen|Sonuçlanmış ödevi düzenleme penceresi': A(`Ödev sonuçlandıktan sonra da adı, tarihi ve ekleri düzeltilebilir.`),
  'ogretmen|Ödev kontrolü (aktif, açıldı / açılmadı)': A(`Süren ödevde her öğrencinin altında ödevi ne zaman açtığı ya da
    henüz açmadığı yazar.`),
  'ogretmen|Ödev kontrolü — öğrencinin altında "3 ek"': A(`Öğrenci ödevine dosya yüklediyse adının altında kaç ek olduğu yazar.`),
  'ogretmen|Öğrencinin ekleri: simge ve MB (hiçbiri kendiliğinden inmez)': A(`Eklere dokununca türüne göre simge ve boyutu
    (MB) görünür. Hiçbiri kendiliğinden inmez; fotoğraf, video ve ses burada açılır, öteki dosyalar "indirilsin mi?" diye sorar.`),
  'ogretmen|Fotoğrafa tıklayınca burada açılır': A(`Fotoğraf sayfadan çıkmadan açılır.`),
  'ogretmen|Videoya tıklayınca oynatıcı açılır': A(`Video indirilmeden oynatılır.`),
  'ogretmen|Ödev kontrolü — seçilmemişlerin hepsi: Yaptı': A(`Kalabalık sınıfta "Seçilmemişlerin hepsi: Yaptı" işi kısaltır;
    altta canlı sayım durur.`),
  'ogretmen|Sınavlar': A(`Öğretmenin sınavları: şablonu, tarihi ve not girilen öğrenci sayısı.`, 'Sınav'),
  'ogretmen|Şablondan sınav: LGS (7 alan, virgüllü)': A(`LGS denemesi şablonu: her ders için doğru, yanlış ve net; puan
    virgüllü girilir.`),
  'ogretmen|Şablondan sınav: Test (doğru / yanlış / net)': A(`Test şablonu: doğru ve yanlıştan net hesaplanır.`),
  'ogretmen|Şablondan sınav: Yazılı (0-100)': A(`Yazılı şablonu: 0–100 arası tek puan; ondalıklı not virgülle yazılır.`),
  'ogretmen|Değer tablosu — hatalı değer kırmızı, değişen mavi': A(`Not tablosu: sınır dışı ya da hatalı değer kırmızı,
    kaydedilmemiş değişiklik mavi görünür.`),
  'ogretmen|Değer alanları — + Yeni değer ekle': A(`Sınava yeni bir ölçüm alanı eklenebilir (ör. sözlü).`),
  'ogretmen|Yeni sınav penceresi (şablon seçimi)': A(`Yeni sınav: ad, tarih ve şablon.`),
  'ogretmen|Sınav grupları': A(`Sınav grupları: aynı dersin sınavları ağırlıklarıyla bir ortalamada toplanır.`),
  'ogretmen|Yeni sınav grubu penceresi': A(`Yeni grup: hangi sınavların hangi ağırlıkla sayılacağı.`),
  'ogretmen|Grup ortalamaları (100 üzerinden)': A(`Her öğrencinin grup ortalaması 100 üzerinden.`),
  'ogretmen|Şablonlar (Yazılı, Test, LGS, kendi şablonu)': A(`Hazır şablonlar ve öğretmenin kendi şablonları.`),
  'ogretmen|Yeni şablon penceresi': A(`Kendi şablonu: alanların adı, alt ve üst sınırı, ana değer.`),
  'ogretmen|Şablonu düzenleme penceresi': A(`Şablon düzenleme; kullanılan şablon silinemez.`),
  'ogretmen|Yoklama — ders seçimi': A(`Yoklama sayfası: öğretmen dersini ve tarihi seçer (ders programından da alınabilir).`,
    'Yoklama ve etüt'),
  'ogretmen|Yoklama ekranı': A(`Sınıf listesi; her öğrencide geldi, gelmedi, izinli ya da geç.`),
  'ogretmen|Etütler': A(`Öğretmenin etütleri.`),
  'ogretmen|Etüt yoklaması (geldi / izinli / izinsiz)': A(`Etüt yoklaması etüt günü, başlangıçtan 15 dakika önceden itibaren alınır.`),
  'ogretmen|Anketler': A(`Öğretmenin göreceği ve oy vereceği anketler.`, 'Okul hayatı ve ayarlar'),
  'ogretmen|Yemek listesi': A(`Haftalık yemek listesi.`),
  'ogretmen|Kulüpler (danışmanı olduğu)': A(`Danışmanı olduğu kulüpler ve üyeleri.`),
  'ogretmen|Hatırlatıcılar (öğretmen)': A(`Kişisel hatırlatıcılar: bir kez, her gün, haftanın seçilen günleri ya da ayda bir.
    Zamanı gelince bildirim gelir; en fazla 50 hatırlatıcı.`),
  'ogretmen|Ayarlar': A(`Kişisel ayarlar ve görünüm.`),
  'ogretmen|Ödev kontrolü (koyu)': A(`Ödev kontrolü koyu görünümde.`, 'Koyu görünüm'),
  'ogretmen|Değer tablosu (koyu)': A(`Not tablosu koyu görünümde.`),
  'ogretmen|Ana sayfa (koyu)': A(`Ana sayfa koyu görünümde.`),
  'ogretmen|Ödev kontrolü (telefon)': A(`Ödev kontrolü telefonda: her öğrencinin sonucu alt alta.`),
  'ogretmen|Değer tablosu (telefon)': A(`Not tablosu telefonda yatay kaydırılır.`),
  'ogretmen|Yoklama (telefon)': A(`Yoklama telefonda.`),
  'ogretmen|Etüt yoklaması (telefon)': A(`Etüt yoklaması telefonda.`),

  /* ================= öğretmenin ikinci okulu ================= */
  'ogretmen-ikinci-okul|Ana sayfa (Deneme Anadolu Lisesi)': A(`İkinci okulun ana sayfası: yalnızca bu okulun dersleri ve ödevleri.`),
  'ogretmen-ikinci-okul|Hesap değiştir: ikinci okulda': A(`Rol listesinde hangi okulda olduğu yazar.`),
  'ogretmen-ikinci-okul|Ödevler (bu okulun)': A(`Bu okulda verilen ödevler; öteki okulun ödevleri burada görünmez.`),

  /* ================= okul bölümü kapatınca ================= */
  'ozellik-kapali|Ana sayfa (Ödevler kutucuğu yok)': A(`Okul ödevi kapatınca öğretmenin ana sayfasında Ödevler kutucuğu,
    menüde Ödevler ve Etütler yoktur.`),
  'ozellik-kapali|Kapalı bölümün adresi açılınca': A(`Kapalı bölümün adresi elle açılsa bile içerik gelmez: "Bu bölüm
    okulunda kapalı" yazar. Sunucu da o bölümün isteklerini geri çevirir.`),
  'ozellik-kapali|Menü (telefon)': A(`Telefondaki menüde de kapalı bölümler yok.`),

  /* ================= nakil öğrenci ================= */
  'nakil-ogrenci|Ana sayfa (yeni okul)': A(`Nakil gelen öğrenci yeni okulunda. Hesabı ve şifresi aynı kaldı.`),
  'nakil-ogrenci|Ödevler (yeni okulda, eski okulun ödevi yok)': A(`Yeni okulun ödevleri; eski okulun ödevleri burada karışmaz.`),
  'nakil-ogrenci|Yıl seçici — önceki okullar': A(`Yıl seçicisinde önceki okul da durur: "yıl · okul · sınıf".`),
  'nakil-ogrenci|Önceki okulun ödevleri (salt okunur)': A(`Eski okulun ödevleri ve sonuçları; salt okunur. Yeni okul bunları görmez.`),
  'nakil-ogrenci|Önceki okulun sınav notu': A(`Eski okulun sınav notları.`),
  'nakil-ogrenci|Şimdiki okula dönüş': A(`Yıl seçicisinden şimdiki okula dönülür.`),
  'nakil-ogrenci|Ödevler — yıl seçici (telefon)': A(`Yıl seçicisi telefonda.`),

  /* ================= öğrenci ================= */
  'ogrenci|Ana sayfa': A(`Öğrencinin ana sayfası: ödev serisi, yaklaşan ödevler, bugünkü dersler, son sonuçlar.`, 'Başlangıç'),
  'ogrenci|Takvim': A(`Takvim: okul etkinlikleri, tatiller ve ödevlerin son günleri.`),
  'ogrenci|Mesajlar': A(`Öğrencinin mesaj kutusu.`, 'Mesajlar'),
  'ogrenci|Duyuru okuma': A(`Duyuru açılınca okundu sayılır; müdür kimin okuduğunu görür.`),
  'ogrenci|Düzeltilmiş mesaj (düzenlendi yazar)': A(`Öğretmen mesajı düzeltmişse "düzenlendi" yazar.`),
  'ogrenci|Ekli mesaj (belge ve resim, silinme günü)': A(`Mesajın ekleri adı, boyutu ve silineceği günle; ekler 7 gün saklanır.`),
  'ogrenci|Ders programı': A(`Öğrencinin haftalık ders programı.`),
  'ogrenci|Ödevler (üstte ödev serisi; açılmamışlar turuncu, yıldızlı ödev)': A(`Üstte <b>ödev serisi</b>: arka arkaya "Yaptı"
    aldığı ödevler. "Yaptı" dışı bir sonuç uyarı verir, arka arkaya iki kez olursa seri bozulur. Açılmamış ödev
    turuncu; önemli ödev yıldızlanır.`, 'Ödev'),
  'ogrenci|Ödevler — süzgeç: yıldızlı': A(`Yalnızca yıldızlı ödevler.`),
  'ogrenci|Ödevler — süzgeç: açılmamış': A(`Henüz açılmamış ödevler.`),
  'ogrenci|Ödevler — süzgeç: geç yaptı': A(`Sonucu "Geç yaptı" olan ödevler.`),
  'ogrenci|Sınavlarım (grafik + şablonlu sınavlar)': A(`Sınav grafiği: seçilen şablonun sınavları tarih sırasıyla; en düşük–en
    yüksek bandı ve ortalama.`, 'Sınav ve ilerleyiş'),
  'ogrenci|Sınav grafiği — başka değer (Matematik Net)': A(`Grafikte gösterilecek değer seçilir (LGS puanı, Matematik neti...).`),
  'ogrenci|Sınav grafiği — liste görünümü': A(`Aynı veri tablo olarak.`),
  'ogrenci|İlerleyişim (ödev sonuç grafiği)': A(`Ödev sonuçları grafiği ve başarı oranı.`),
  'ogrenci|İlerleyişim — derslere göre': A(`Ders ders ödev sonuçları.`),
  'ogrenci|Devamsızlığım': A(`Öğrencinin devamsızlığı.`, 'Okul hayatı'),
  'ogrenci|Etütlerim (yoklama sonuçları)': A(`Etütler ve yoklama sonuçları.`),
  'ogrenci|Anketler (oy verildi)': A(`Anket ve verilen oy.`),
  'ogrenci|Hatırlatıcılar (haftalık, her gün, bir kez, ayda bir)': A(`Öğrencinin kendine kurduğu hatırlatıcılar: başlık,
    açıklama ve sıklık; sıradaki zamanı yazar. Kişinin kendi hatırlatıcısı yalnızca ona gider.`, 'Hatırlatıcılar'),
  'ogrenci|Yeni hatırlatıcı — haftanın günleri ve saat': A(`Haftanın günleri seçilir (ör. Pazartesi ve Çarşamba) ve saat yazılır.`),
  'ogrenci|Yeni hatırlatıcı — ayda bir': A(`Ayda bir: ayın günü ve saat; ay kısaysa ayın son gününe kayar.`),
  'ogrenci|Yemek listesi': A(`Haftalık yemek listesi.`, 'Yemek, servis, kulüp, ayarlar'),
  'ogrenci|Servisim (harita, durak)': A(`Öğrencinin servisi: harita, durak, sefer sürerken servisin yeri.`),
  'ogrenci|Kulüpler (üye)': A(`Üye olduğu kulüpler; başvurusu açık kulübe kendisi katılır.`),
  'ogrenci|Ayarlar (veli kodu)': A(`Ayarlar: şifre, görünüm ve <b>veli kodu</b>. Velisi bu kodla öğrenciyi kendi hesabına ekler.`),
  'ogrenci|İlerleyişim (koyu)': A(`İlerleyiş koyu görünümde.`, 'Koyu görünüm'),
  'ogrenci|Ödevler (koyu)': A(`Ödevler koyu görünümde.`),
  'ogrenci|Sınavlarım (koyu)': A(`Sınav grafiği koyu görünümde.`),
  'ogrenci|Ana sayfa (telefon)': A(`Ana sayfa telefonda.`),
  'ogrenci|Ödevler (telefon, yıldızlar)': A(`Ödevler telefonda; yıldız dokunarak konur.`),
  'ogrenci|İlerleyişim (telefon)': A(`İlerleyiş telefonda.`),
  'ogrenci|Sınavlarım (telefon)': A(`Sınav grafiği telefonda.`),
  'ogrenci|Etütlerim (telefon)': A(`Etütler telefonda.`),
  'ogrenci|Ödev ayrıntısı (açılınca turuncu kalkar)': A(`Ödev açılınca açılma zamanı kaydedilir, turuncu kalkar; öğretmen
    ödevin ne zaman açıldığını görür. Süre bitmeden dosya yüklenir, süre geçince yüklenmez.`, 'Ödev ayrıntısı'),
  'ogrenci|Ödevler — açtıktan sonra': A(`Açılan ödev artık turuncu değil.`),
  'ogrenci|Ödevin ekleri (silinme günüyle)': A(`Öğretmenin eklediği dosyalar; her birinin silineceği gün yazar.`),

  /* ================= veli ================= */
  'veli|Hesap seçimi (iki çocuk)': A(`İki çocuk, iki satır: veli hangi çocukla devam edeceğini seçer.`),
  'veli|Bildirimler (her bildirimin başında hangi çocuk olduğu yazar)': A(`Öğrencinin aldığı her bildirim veliye de gider;
    başında hangi çocuk olduğu yazar (ör. "Zeynep Şahin · Matematik dersinden ... açıklandı: Yaptı"). Dokununca o
    çocuğun sayfası açılır.`),
  'veli|Çocuğumun telefonu: konum, ekran süresi, sınırlar (Eğitim Evi Aile)': A(`Zeynep'in telefonundaki <b>Eğitim Evi Aile</b>
    uygulamasından gelenler: son konum haritada (ne zaman, Wi-Fi ya da mobil, pil), bugünün ekran süresi uygulama uygulama ve
    son 8 günün toplamı. Veli Wi-Fi'de ve mobil veride ne sıklıkla konum geleceğini, günlük toplam sınırı ve uygulama başına
    sınırı seçer; sınır geçilince bildirim gelir, uygulama kapatılmaz. Okul görmez; veriler 7 gün sonra silinir.`),
  'veli|Ana sayfa': A(`Velinin ana sayfası: iki çocuğun yaklaşan ödevleri ve son sonuçları, her satırda çocuğun adı.`),
  'veli|Çocuklarım': A(`Çocuklar ve okulları; çocuk veli koduyla eklenir.`),
  'veli|Ödevler (iki çocuk, kimin olduğu yazar)': A(`İki çocuğun ödevleri bir arada; her satırın başında kimin olduğu yazar.`),
  'veli|Ödevler — tek çocuk': A(`Üstteki şeritten tek çocuğa daraltılır.`),
  'veli|Devamsızlık': A(`Çocukların devamsızlığı.`),
  'veli|İlerleyiş (çocuk çocuk grafikler)': A(`Her çocuğun grafikleri ayrı ayrı.`),
  'veli|Etütler': A(`Çocukların etütleri ve yoklamaları.`),
  'veli|Mesajlar': A(`Velinin mesajları: okulun ve öğretmenin velilere yazdıkları.`),
  'veli|Takvim': A(`Çocukların okul takvimi.`),
  'veli|Anketler': A(`Velilere açılan anketler.`),
  'veli|Yemek listesi': A(`Çocuğun okulunun yemek listesi.`),
  'veli|Servis': A(`Çocuğun servisi haritada; servis eve 500 m ve 100 m kala bildirim gelir.`),
  'veli|Kulüpler': A(`Çocukların kulüpleri.`),
  'veli|Ayarlar (hesap bilgisi, telefon ülke kodu)': A(`Velinin hesap bilgileri ve telefonu (ülke koduyla).`),
  'veli|İlerleyiş (koyu)': A(`İlerleyiş koyu görünümde.`),
  'veli|Hesap seçimi (telefon)': A(`Hesap seçimi telefonda.`),
  'veli|Ödevler (telefon)': A(`Ödevler telefonda.`),
  'veli|İlerleyiş (telefon)': A(`İlerleyiş telefonda.`),
  'veli|Çocuğun kartına tıklayınca portalı (ödevleri, notları)': A(`Çocuğun kartına dokununca onun portalı açılır: ödevler,
    notlar, devamsızlık.`),

  /* ================= servisçi ================= */
  'servisci|Ana sayfa': A(`Servisçinin ana sayfası: servisi ve seferleri.`),
  'servisci|Servisim (öğrenciler, duraklar)': A(`Servisteki öğrenciler, durakları ve evlerinin haritadaki yeri. Sefer başlayınca
    telefonun konumu gönderilir; <b>Seferi bitir</b> deyince kesilir.`),
  'servisci|Mesajlar': A(`Servisçinin mesajları.`),
  'servisci|Ana sayfa (telefon)': A(`Servisçi uygulamayı telefonda kullanır.`),
  'servisci|Servisim (telefon)': A(`Servis ve öğrenciler telefonda.`),

  /* ================= yeni yetişkin ================= */
  'rolsuz|Başlangıç: nasıl devam edeceksin?': A(`Yeni hesap henüz bir role bağlı değil; nasıl devam edeceği sorulur.`),
  'rolsuz|Ekle penceresi': A(`Üç yol: çocuğumu ekle (veli kodu), öğretmen olarak katıl (kendi kodu), okulumu kaydet (müdür).`),
  'rolsuz|Ekle — çocuğumu ekle (veli kodu)': A(`Çocuğun veli kodu yazılır; çocuk hesaba eklenir.`),
  'rolsuz|Ekle — okulumu kaydet: yazım hatalı arama': A(`Müdür okulunu MEB listesinde arar; yazım hatası fark etmez.
    Başvuru site yöneticisinin onayına gider.`),
  'rolsuz|Ayarlar': A(`Hesap ayarları.`),
  'rolsuz|Başlangıç (koyu)': A(`Başlangıç koyu görünümde.`),
  'rolsuz|Başlangıç (telefon)': A(`Başlangıç telefonda.`),

  /* ================= yöneticinin açtığı okulun müdürü ================= */
  'yeni-mudur|İlk giriş — önce aydınlatma metni onayı': A(`İlk girişte önce aydınlatma metni onaylanır.`),
  'yeni-mudur|Onaydan sonra — kendi şifreni belirle': A(`Sonra verilen geçici şifre yerine kendi şifresini belirlemeden içeri giremez.`),
  'yeni-mudur|Şifre kuralları işaretleniyor': A(`Şifre yazıldıkça kurallar işaretlenir: büyük ve küçük harf, rakam, özel karakter, uzunluk.`),

  /* ================= site yöneticisi ================= */
  'admin|Ana sayfa': A(`Site yöneticisinin ana sayfası.`),
  'admin|Onay bekleyenler (yaş, hesap tarihi, telefon)': A(`Okul başvuruları: başvuranın yaşı, hesabının ne zaman açıldığı ve
    telefonu; yönetici onaylar ya da reddeder.`),
  'admin|Müdürler': A(`Okulların müdürleri.`),
  'admin|Okullar': A(`Eğitim Evi'ni kullanan okullar.`),
  'admin|Okul aç penceresi': A(`Yönetici okulu kendisi de açabilir: okul MEB listesinden seçilir.`),
  'admin|Okul aç — okul seçildi, adres önerildi, rastgele şifre': A(`Okulun adresi adından önerilir, müdüre rastgele geçici şifre verilir.`),
  'admin|Yedekler (elle yedek alındı)': A(`Veritabanı her gün yedeklenir; yönetici elle de yedek alır ve geri yükler.`),
  'admin|Açılış sayfası yorumları (gizle / göster)': A(`Açılış sayfasındaki yorumlar; uygunsuz olan gizlenir.`),
  'admin|İşlem kaydı': A(`Site genelindeki işlem kaydı.`),
  'admin|Ayarlar': A(`Yöneticinin ayarları.`),
  'admin|Ana sayfa (koyu)': A(`Ana sayfa koyu görünümde.`),
  'admin|Okullar (koyu)': A(`Okullar koyu görünümde.`),
  'admin|Onay bekleyenler (telefon)': A(`Onay bekleyenler telefonda.`),
  'admin|Üstteki ay düğmesi — koyu görünüme geçti': A(`Uygulamanın içinde de üstteki ay düğmesi koyu görünüme geçirir.`),
  'admin|Güneş düğmesi — açık görünüme döndü': A(`Güneş düğmesi açık görünüme döndürür.`)
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

ROL_METNI['aile-uygulamasi'] = { baslik: 'Eğitim Evi Aile uygulaması (çocuğun telefonu)',
  giris: `Ayrı depodaki Android uygulaması (KARANKOYU/Egitim-Evi-App), öykünücüde deneme sunucusuna bağlanırken.` };
Object.assign(ADIM_METNI, {
  'aile-uygulamasi|Uygulama: ne paylaşıldığı ve giriş': A(`Uygulama açılınca neyin kimle paylaşılacağını yazar: konum ve
    ekran süresi yalnızca veliye; okul görmez, 7 gün sonra silinir, hiçbir uygulama kapatılmaz.`),
  'aile-uygulamasi|Uygulama: öğrenci hesabıyla giriş ve açık onay': A(`Okulun adresi ve çocuğun öğrenci hesabıyla giriş;
    doğrulama sorusu ve çocuğun kendi onay kutusu. Şifre gizli yazılır; çocuğun oturumu telefonda kalmaz.`),
  'aile-uygulamasi|Uygulama: konum izni isteniyor': A(`Bağlanınca Android önce konum iznini sorar.`),
  'aile-uygulamasi|Uygulama: bağlandı, izinler sırayla': A(`Bağlı hesap ve eksik izinler: <b>Her zaman</b> konum, kullanım
    erişimi, bildirimler ve arka planda çalışma; her birinin düğmesi ilgili ayar ekranını açar.`),
  'aile-uygulamasi|Uygulama: bütün izinler verildi, son gönderim': A(`İzinler tamam; son konumun ve son gönderimin zamanı
    yazar. Bağlantı buradan da kaldırılabilir.`),
  'aile-uygulamasi|Uygulama: bildirim çubuğunda her zaman görünür': A(`Android, arka planda konum alan uygulamanın bildirim
    çubuğunda görünmesini şart koşar: "Konumun ve ekran süren velinle paylaşılıyor".`)
});

module.exports = { ROL_METNI, ADIM_METNI, UYGULAMA_EKRANLARI };
