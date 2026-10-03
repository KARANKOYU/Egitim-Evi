# KVKK ve gizlilik · Kim neyi görür

**Durum:** Kodda var; tasarımda ek olarak yönetici ve destek ekibinin kişi kodu olmadan kullanıcı araması (T.C. maskeli, "göster"
işlem kaydına), destek yetkilisinin kimliğinin kullanıcıdan gizlenmesi, eğitmenin herkese açık @kullanıcı adı, tahta hesabının
gördükleri, başarıların öğrencinin bütün kurumlarınca görülmesi, "Bu mesajı bildir"de müdürün yalnız bildirilen mesajı görmesi ve
öğrenci ile velinin yalnız aktif ve bir önceki eğitim yılını görmesi.

Her kişisel verinin kime göründüğünün tek yerde haritası: kendin, velin, öğretmenin, okul yönetimi, servisçi, sistem yöneticisi ve
giriş yapmamış herkes.

## Ne işe yarar

"Benim bilgimi kim görüyor?" sorusunun cevabı her özelliğin kendi belgesine dağılmış durumda; bu belge onları bir araya getirir ve
ayrıntı için oraya bağlar. Aydınlatma metninin 5. bölümü ("Verilere kimler erişebilir?") ve 2. bölümdeki "Kimden" sütunu bunun
kullanıcıya dönük kısa hâlidir ([Aydınlatma metni](aydinlatma-metni.md)). Temel kural: herkes yalnız yetkisi olanı görür; bir okul
başka bir okulun öğrencisini göremez; veriler reklam, analiz ya da satış için kimseye verilmez.

## Nereden açılır

Ayrı bir ekranı yok. Aynı kurallar şu yazılarda geçer:

- Aydınlatma metni, 5. bölüm: "Öğrenci: yalnızca kendi verilerine", "Veli: yalnızca hesabına bağlı çocuğunun verilerine…",
  "Öğretmen: yalnızca kendisine atanmış öğrenci ve derslerin verilerine…", "Servisçi: …", "Müdür ve yetkilendirilmiş personel:
  okulunun verilerine"; altında "Yetkiler rol bazlı olarak sınırlandırılmıştır; müdür her personele hangi derste ve hangi sınıfta ne
  yapabileceğini ayrı ayrı belirler."
- SSS "Gizlilik" grubu: "Bilgilerim nerede duruyor, kim görüyor?", "Okul yönetimi yapılan işlemleri görür mü?", "Servisin konumunu
  kim görür?", "Çocuğumun telefonunun konumunu ve ekran süresini görebilir miyim?" ([SSS](../acilis-sayfasi/sss.md)).
- Hakkında sayfası, "Bilgiler nerede?": "Eğitim Evi'nin sunucusunda, PostgreSQL veritabanında; her okulun verisi ayrıdır. Reklam yok;
  bilgiler kimseye satılmaz ya da aktarılmaz."
- Giriş formunun altındaki not: "Bilgilerin Eğitim Evi'nin sunucusunda tutulur ve yalnız okulunun yetkilileri görür. Giriş bilgilerin
  Google'a ya da başka bir servise gönderilmez." ([Giriş](../giris-hesap/giris.md)).
- Uygulamanın alt bilgisinde "Bu sistem hakkında" → "Kaynakça" penceresi: "Bu sistem Eğitim Evi projesi kapsamında geliştirilmiştir."
  ve "Tüm veriler Eğitim Evi'nin sunucusunda saklanır; her okul yalnız kendi verisini görür. Veriler üçüncü taraflarla paylaşılmaz ve
  sistemde reklam bulunmaz." (Kullanıcı 30 Eylül'de bu pencerenin eski "okulunun kendi sunucusunda" yazısının düzeltilmesini istedi;
  düzeltildi.)

## Adım adım

### Tek tabloda

Hücre: o kişi bu veriyi görür mü. "Okul yönetimi" müdür ve ilgili yetkiyi taşıyan çalışandır. "Herkes": giriş yapmamış ziyaretçi.

| Veri | Kendisi | Veli | Öğretmen | Okul yönetimi | Servisçi | Sistem yöneticisi | Herkes |
|---|---|---|---|---|---|---|---|
| Ad, soyad, kullanıcı adı | Evet | Çocuğununki | Derslerindeki öğrencilerinki | Okulundaki herkesinki | Servisindeki öğrencilerin adı ve sınıfı | Müdür listesi; kişi koduyla verilen kişininki | Yalnız yorumda adın kısaltması ("Ay. Ka.") |
| T.C. kimlik no | Evet (Ayarlar) | Hayır | Hayır | Okulun açtığı hesaplarda (öğrenci, servisçi) evet; yetişkininkini görmez | Hayır | Hayır (tasarımda maskeli, "göster" kayda geçer) | Hayır |
| E-posta | Evet | Hayır | Ekranda hayır (bkz. "Dikkat") | Okulun açtığı hesaplarda girilmişse; öğretmenin e-postasını görmez | Hayır | Müdürlerinki; kişi koduyla kısaltılmış hâli | Hayır |
| Telefon | Evet | Servis şoförü ve rehber personelinki | Hayır | Öğretmenin ve okulun açtığı hesapların telefonu; servis telefonları | Hayır | Hayır | Hayır |
| Kişi kodu / veli kodu | Evet | Bağlı çocuğun veli kodu | Hayır | Öğrencinin veli kodu; yetişkinin kodunu yalnız kişi verirse | Hayır | Kişi kendisi verirse | Hayır |
| Ödevler, sonuçları, yıldızlar | Evet (yıldızlar yalnız kendisi) | Çocuğunun ödevleri ve sonuçları | Kendi verdiği ödevler; yetkiyle girdiği sınıflardaki sonuçlar | Okulun bütün ödevleri | Hayır | Hayır | Hayır |
| Teslim dosyaları | Evet | Evet | Ödevi veren öğretmen | Müdür | Hayır | Hayır | Hayır |
| Quiz cevapları ve sekme kaydı | Kaç kez çıktığını; cevaplarını, sonuç açılınca puanı ve doğruları | Yalnız durum ve sonuç açılınca puan | Kendi ödevinde hepsi; başka öğretmenin ödevinde durum ve puan | Müdür durum ve puan (öğretmeni ayrılmışsa hepsi) | Hayır | Hayır | Hayır |
| Sınav notları, devamsızlık, etüt yoklaması | Evet | Evet | Dersindeki; yetkiyle girdiği sınıflardaki sonuçlar | Evet ("Okulun tüm devamsızlığını görür" yetkisiyle çalışan da) | Hayır | Hayır | Hayır |
| Mesajlar | Gönderdiği ve aldığı | Çocuğuna gelenlerin kopyası | Kendi yazışmaları | Kendi yazışmaları; duyuruların okunma zamanı | Kendi yazışmaları | Hayır | Hayır |
| Duyuruların okunma zamanı | Hayır | Hayır | Kendi gönderdiği duyurunun | Müdür bütün duyuruların | Hayır | Hayır | Hayır |
| Anket cevapları | Kendi oyu; sonuç anket bitince | Kendi oyu; sonuç anket bitince | Açtığı anketin sonuçları ve kimin oy verdiği | Müdür her anketin sonuçları ve katılımı | — | Hayır | Hayır |
| Servis, durak, sıra, yoklama, notlar, "binmeyecek" | Evet (sıra ve günün durumu yalnız servis saatlerinde) | Evet (aynı sınırla) | Hayır | Her servisin listesi ve günün yoklaması | Kendi servisininki | Hayır | Hayır |
| Evin haritadaki yeri | Evet | Evet | Hayır | Evet | Kendi servisindekiler | Hayır | Hayır |
| Servis aracının konumu | Sefer sürerken | Sefer sürerken | Hayır | Sefer sürerken | Kendi konumu | Hayır | Hayır |
| Eğitim Evi Aile (konum, ekran süresi) | Telefonda yalnız durum | Bağlı veliler | **Hayır** | **Hayır** | Hayır | Ekranı yok | Hayır |
| Kişisel hatırlatıcılar | Yalnız kendisi | Hayır | Hayır | Hayır | Hayır | Hayır | Hayır |
| İşlem kaydı (IP dahil) | Hayır | Hayır | Yetkiyle | Okulunun satırları (yetişkinin kişisel işlemleri hariç) | Hayır | Hepsi | Hayır |
| Açılış sayfası yorumu | Evet | — | — | — | — | Gizleyebilir | Yorum, yıldız, adın kısaltması, rol |
| Okul sayfası fotoğrafları ve tanıtım yazısı | — | — | — | Düzenler | — | — | Evet |

### Öğrenci

- Yalnız kendi verilerini görürsün: ödevlerin, sonuçların, yıldızların (yalnız sen), teslim dosyaların, quiz kaydın, notların,
  devamsızlığın, ders programın, servis bilgin. Ayarlar'da kendi T.C. kimlik numaranı ve veli kodunu görürsün.
- Başka bir öğrencinin notunu, devamsızlığını ya da T.C.'sini göremezsin; öğretmenlerin T.C.'sini ve e-postasını da.
- Seni kimler görür: velilerin (bağlı oldukları sürece), dersine giren öğretmenlerin, okulunun yönetimi; servis kullanıyorsan
  servisçin (adın, sınıfın, durağın, evinin yeri, sıran, o günün yoklaması).
- Okul değiştirirsen eski okulun kayıtları eski okulda kalır; yeni okul onları görmez, sen ve velin eski dönemleri seçip görürsünüz
  ([Öğrenci nakli](../hesaplar/ogrenci-nakli.md)).
- Telefonunu Eğitim Evi Aile ile paylaştıysan konumunu ve ekran süreni yalnız velilerin görür; okul görmez
  ([Kim görür, ne kadar saklanır](../aile/mahremiyet.md)).
- **Tasarımda:** eğitim yıllarından yalnız aktif olanı ve bir öncekini görürsün; başarıların ise kalıcıdır ve öğrencisi olduğun
  bütün kurumların öğretmenleri ve müdürü onları (öbür kurumun eklediği belge ve kurum adı dahil) görür
  ([Kimler görür](../basarilar/kimler-gorur.md)).

### Veli

- Yalnız hesabına bağlı çocuğunun verilerini görürsün; çocuğa giden bildirimlerin (ödev, quiz sonucu, sınav, mesaj, duyuru) ve
  mesajların bir kopyası çocuğun adıyla sana da gelir ([Velinin kopyası](../mesaj/velinin-kopyasi.md)).
- Quizde yalnız durumu (başlamadı, devam ediyor, bitirdi) ve sonuçlar açılınca puanı görürsün; soruları, cevapları ve sekme kaydını
  görmezsin.
- Servis kullanan çocuğun için şoför ve rehber personelin adını ve telefonunu, durağı, sırayı ("5. sırada, önünde 2 öğrenci") ve günün
  durumunu yalnız okulun servis saatlerinde ve sefer sürerken görürsün.
- Çocuğunun telefonu bağlıysa konumunu ve ekran süresini sen (ve öbür bağlı veli) görürsün; okul görmez.
- Senin bilgilerini kim görür: çocuğunun okulu, öğrencinin velileri arasında adını ve kullanıcı adını görür. Okul seni çocuğuna T.C.
  kimlik numaran ya da kullanıcı adınla bağlayabilir; yazdığında sistem yalnız adının maskeli hâlini ve kullanıcı adını gösterir,
  numaranı göstermez; bağlanınca sana "… seni … adlı öğrencinin velisi olarak ekledi." bildirimi gelir
  ([Veli bağlama](../hesaplar/veli-baglama.md)). Okulun velileri gösteren listesinde telefonun, e-postan ve T.C.'n yok. İşlem
  kaydında senin kişisel işlemlerin (şifre, e-posta…) ve IP adresin okula gösterilmez.
- **Tasarımda:** velide her çocuk ayrı oturumdur; kopyalar yalnız o çocuğun oturumunda görünür
  ([Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md)).

### Öğretmen

- Ders verdiğin sınıfların öğrencilerini görürsün; kendi verdiğin ödevlerin teslimlerini, dosyalarını ve quizinde öğrencinin
  cevaplarını, sürelerini, sekme kaydını görürsün ([Öğrencinin cevapları](../quiz/ogrencinin-cevaplari.md)).
- "Girdiği sınıfların öğrenci sonuçlarını görür" yetkisiyle (Sınıflarım) girdiğin sınıflardaki öğrencilerin sonuçlarını görürsün;
  müdür bu yetkiyi kapatabilir ([Sınıflarım](../siniflar-dersler/siniflarim.md)).
- Öğrencilerin T.C.'sini görmezsin. Kendi gönderdiğin mesajın ve duyurunun kimler tarafından okunduğunu görürsün.
- Seni kim görür: okul adını, telefonunu, okuldaki kullanıcı adını ve branşını görür; e-postanı, şifreni ve T.C.'ni görmez. Müdür
  kişi kodunu girerken adının yalnız bir kısmını ("Ay** Yı****") görür ([Kodla ekleme](../ogretmenler-calisanlar/kodla-ekleme.md)).
- Kendi çocuğunun velisiysen onun verilerine yalnız veli portalına geçince bakarsın ([Portala geçiş](../portallar/portala-gecis.md)).

### Çalışan

Ek görevli çalışan (Müdür Yardımcısı, Rehber Öğretmen, Etüt Sorumlusu, Servis Sorumlusu…) öğretmenin gördüklerine ek olarak
yalnız verilen yetkinin açtığını görür ([Yetki listesi](../roller-yetkiler/yetki-listesi.md)):

- "Öğrenci portalına girer" — "Öğrencinin gördüğü ekranı birebir açar." ve okulun **bütün** öğrencilerini görme kapısını açar
  (hazır "Rehber Öğretmen" şablonunda var).
- "Okulun tüm devamsızlığını görür".
- "Servisleri ve servis öğrencilerini düzenler" — "Şoför telefonlarını ve öğrencilerin durağını görür."
- "İşlem kaydını görür" ([Görme yetkisi](../islem-kaydi/gorme-yetkisi.md)).
- "Öğrenci bilgilerini düzenler", "Öğrenci şifresi sıfırlar" ("Hassas yetki — dikkatli ver.").
- Yetkiler ders ve sınıfla daraltılabilir ([Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md)).

**Tasarımda:** öğretmen olmayan (rolsüz) çalışan da okula eklenir; görebildiği yalnız verilen yetkidir.

### Müdür

- Okulunun bütün verisini görürsün: öğrenci listesi, okulun açtığı hesapların T.C.'si ve (girildiyse) e-postası, veli kodları,
  öğretmenlerin adı, telefonu, kullanıcı adı ve branşı, bütün ödevler, notlar, devamsızlık, servisler, duyuruların okunma zamanı,
  işlem kaydı (kimin, ne zaman, IP adresi dahil) ([İşlem kaydı sayfası](../islem-kaydi/islem-kaydi-sayfasi.md)).
- "Portalını aç" ile öğrencinin gördüğü ekranı birebir açarsın ([Öğrenci portalını açma](../hesaplar/ogrenci-portalini-acma.md)).
- **Göremediklerin:** öğretmenlerin e-postası ve T.C.'si; yetişkinlerin yetişkin hesabıyla yaptığı kişisel işlemler (şifre, e-posta
  değişikliği) ve bu işlemlerin IP'si (işlem kaydında okulsuz yazılır, yalnız yönetici görür; öğretmenin okul rolündeyken yaptığı
  işlemler ise IP'siyle birlikte okulun kaydına düşer); öğrencinin Eğitim Evi Aile verisi (sunucu: "Bu öğrencinin velisi
  değilsin"); gizli ankette kimin neyi seçtiği; başkalarının mesajları (yalnız kendi yazışmaların ve duyuruların okunma bilgisi);
  başka okulların verisi.
- Yetişkin bir kişiyi kişi koduyla eklerken adını yalnız maskeli görürsün; ekledikten sonra yukarıdaki dört bilgiyi.
- **Tasarımda:** "Bu mesajı bildir"de yalnız bildirilen mesajı ve aynı konuşmadaki önceki 5 mesajı bağlam olarak görürsün, başka hiçbir
  mesajı değil; bildirenin kimliği gönderene söylenmez ([Bu mesajı bildir](../mesaj/bu-mesaji-bildir.md)). Şikâyet etiketinde
  gönderenin adı gizlenmez (adsızlık yok) ([Şikâyet etiketi](../mesaj/sikayet-etiketi.md)).

### Servisçi

- Yalnız atandığın servisteki öğrencilerin adını, sınıfını, durağını, evinin haritadaki yerini ve servisteki sırasını görürsün; o günün
  yoklamasını ve velilerin "binmeyecek" işaretleriyle notlarını (bugünden 7 gün sonrasına kadar) görürsün
  ([Servisler sayfası](../servis/servisler-sayfasi.md)).
- Öğrencinin notunu, devamsızlığını, T.C.'sini görmezsin.
- Senin telefonun o servisteki öğrencilere, velilere ve okul yönetimine görünür (okul girer); konumun yalnız sefer sürerken
  gösterilir.

### Yönetici

- Okulları ve müdürleri görürsün (müdür listesi: ad, kullanıcı adı, e-posta, okul, il).
- Kişi kodu verilen kişinin adını ve soyadını, kullanıcı adını, e-postasının kısaltılmış hâlini ve kaç okulda rolü olduğunu görürsün;
  **kod olmadan kişi arayamazsın** ([Kişi kodu](../portallar/kisi-kodu.md)).
- İşlem kaydının tamamını (okulsuz satırlar dahil) görürsün.
- Açılış sayfası yorumlarını gizleyip açabilirsin ([Yorum gizleme](../yorumlar/yorum-gizleme.md)).
- Eğitim Evi Aile verisini gösteren bir ekranın yok.
- Sunucunun yedekleri bütün okulların verisini taşır; yedeğe ve sunucuya erişen kişi her şeye erişebilir
  ([Site yedekleri](../yonetim/yedekler.md)).

**Tasarımda** ([Kullanıcı arama](../yonetim/kullanici-arama.md), [Hesaba müdahale](../yonetim/hesaba-mudahale.md)):

- Panellerde "Kullanıcılar": e-posta, kullanıcı adı, T.C., ad soyad ya da kişi kodu ile arama (T.C., e-posta ve kişi kodu yalnız tam
  eşleşme; "1234" ile herkesi listeleme yok).
- Kullanıcı sayfası `/users/<kullanici-adi>`: ad, kullanıcı adı, e-posta, T.C. (**maskeli**; "göster" işlem kaydına), açılış, son giriş,
  kaç açık oturumu olduğu (cihaz türüyle), özet satırı, portallar, velisi olduğu çocuklar, yazdığı yorumlar, o anki destek talepleri.
  **Mesaj, not, ödev içerikleri gösterilmez.** Arama, sayfa açma, T.C. gösterme, şifre işlemi ve silme işlem kaydına yazılır.
- Yetkisi olmayan herkese bu adresler bilinmeyen adresle aynı "bulunamadı"yı verir.

### Destek

**Tasarımda** ([Destek ekibi](../destek/destek-ekibi.md), [Talep yönetimi](../destek/talep-yonetimi.md)):

- Yöneticiyle aynı kullanıcı aramasını ve kullanıcı sayfasını görür; hesap silemez; işlem kaydının tamamını göremez.
- Destek talebinde ekibin her mesajı kullanıcıya yalnız "Eğitim Evi · Yetkili" diye görünür: yetkilinin adı, e-postası, kullanıcı adı
  hiçbir yerde (sayfa, sunucu cevabı, bildirim, e-posta, veri indirme dosyası) kullanıcıya gitmez; ekip kendi arasında kimin yazdığını
  görür. İşlem kaydına talep içeriği yazılmaz.

### Eğitmen

**Tasarımda** ([Eğitmen rolü](../egitim-icerikleri/egitmen-rolu.md), [İstatistikler](../egitim-icerikleri/istatistikler.md)):

- Eğitmenin @kullanıcı adı ve (varsa) kanal bağlantısı videolarında herkese görünür; ad tıklanmaz, kanal tıklanır.
- Eğitmen videolarının toplamlarını (izlenme, beğeni) görür; kimin izlediğini görmez. Kaldığın yer ve izleme geçmişin yalnız
  sende durur.

### Tahta

**Tasarımda:** okulun tahta hesabı seçilen sınıfın öğrenci adlarını görür (sınıf zaten birbirini tanır); notları, devamsızlığı, mesajları
görmez; tahta kullanıcı aramasında ve `/users` sayfalarında çıkmaz ([Tahtanın sınırları](../tahta/tahtanin-sinirlari.md)).

### Ziyaretçi

Giriş yapmadan görebildiklerin: açılış sayfasındaki yorumlar (yorum, yıldız, adın kısaltması "Ay. Ka." ve rol; tam ad yok), okul arama
sonuçları (okulun adı, il ve ilçesi), okulların giriş sayfaları (fotoğraflar, tanıtım yazısı, renkler), Yapımcılar listesi.
Öğrencilerin ya da öğretmenlerin hiçbir kişisel bilgisi girişsiz görünmez. **Tasarımda:** eğitim içerikleri girişsiz izlenir (girişsiz
izlemede kişisel veri tutulmaz) ([Girişsiz izleme](../egitim-icerikleri/girissiz-izleme.md)).

## Kurallar ve sınırlar

- **Denetim sunucudadır:** ekranda gizlemek yetmez; her istek sunucuda rol ve yetkiyle denetlenir. Örnek iletiler: "Bu işlem için
  yetkin yok", "Giriş yapmalısın", Eğitim Evi Aile'de "Bu öğrencinin velisi değilsin". Her uç her rol için otomatik olarak denenir
  (yetkisiz geçen istek var mı).
- **Öğrenciyi kim görebilir (sunucunun ortak kuralı):** öğrencinin kendisi; ona bağlı veli (rolü ne olursa olsun: öğretmen ya da
  müdür de kendi çocuğunun velisidir); aynı okulun müdürü; "Öğrenci portalına girer" yetkisi olan öğretmen (okulun bütün
  öğrencileri); öğrencinin dersine giren öğretmen. Öğrenci rolündeki biri başka öğrenciyi göremez; veli rolünde bağlı olmayan
  çocuğu göremez.
- **T.C. kimlik no:** kişinin kendisinden başka kimseye gitmez; okul yalnız kendi açtığı hesaplarınkini görür ve yönetir. Öğretmenler
  ve öğrenciler kimsenin numarasını görmez.
- **Veri azaltma:** profil fotoğrafı yüklenmez (KVKK: çocuk fotoğrafı); avatarlar adın baş harfleriyle çizilir. Yüklenen fotoğraflarda
  konum, tarih ve cihaz bilgisi kaydedilmeden silinir. Kişi kodu girilirken ad maskeli gösterilir. Yorumlarda tam ad gösterilmez.
- **Okullar arası:** her okulun verisi ayrıdır; nakilde eski okulun kayıtları yeni okula geçmez; tasarımda başarılar istisnadır
  (öğrencinin bütün kurumları görür).
- **Dikkat (kodda; aydınlatma metninde yazmayanlar):**
  - Öğretmenin "derslerimdeki öğrenciler" ucu (`GET /api/teacher/students`) öğrencilerin e-posta alanını da döndürüyor; ekran bu ucu
    kullanmıyor ama sunucu cevabında e-posta var. Güvenlik denetimine önerildi.
  - Öğretmenin öğrenci ayrıntısında sınav grupları öğrencinin **bütün** gruplarıdır (başka öğretmenlerin derslerindeki notlar da
    görünür); ödevler yalnız kendi verdikleri.
  - Sunucunun "öğrenciyi görebilir mi" kuralı sistem yöneticisine her öğrenci için "evet" der; yönetim panelinde öğrenci verisini
    gösteren bir ekran yok, aydınlatma metninin 5. bölümünde sistem yöneticisi sayılmıyor.
  - İşlem kaydında IP adresi okul yönetimine gösteriliyor; aydınlatma metni giriş kayıtlarının IP'sinden söz ediyor ama okul
    yönetiminin işlem kaydında IP gördüğünü yazmıyor.
  - Aydınlatma metninin 3. bölümü "Acil durumlarda veliye ya da öğretmene telefonla ulaşılması"nı amaç sayıyor; okul öğretmenin
    telefonunu görüyor ama velinin telefonunu gösteren bir ekran ya da uç yok (okulun veli listesinde yalnız ad, kullanıcı adı ve rol).
  - Bu maddeler KVKK tam denetiminde (iş 18) ve güvenlik denetiminde (iş 3) ele alınacak.
- **Dikkat (KILAVUZ):** KILAVUZ'un "Gizlilik ve güvenlik" bölümü "T.C. kimlik numarasını yalnızca kişinin kendisi ve okul yönetimi
  görür" der; bugünkü kural daha dardır: yetişkinin (veli, öğretmen, müdür) T.C.'sini okul da görmez. Aynı belgenin "Veriler"
  tablosundaki "T.C. kimlik no: İsteğe bağlı … yalnızca kişinin kendisine gösterilir" satırı da okulun açtığı hesaplarda okulun
  gördüğünü anmıyor.

## Kardeşler ve ilgili

**Kardeşler** ([KVKK ve gizlilik](README.md)):

- [Aydınlatma metni](aydinlatma-metni.md) — 5. bölüm ve "Kimden" sütunu.
- [Saklama süreleri](saklama-sureleri.md) — bir veri ne kadar süre görünür.
- [Dışarı giden veriler](disari-giden-veriler.md) — Eğitim Evi dışında kim görür.
- [Haklar ve başvuru](haklar-ve-basvuru.md) — kendi verine erişim ve düzeltme.
- [Onay ve yeniden onay](onay-ve-yeniden-onay.md), [Kullanım koşulları](kullanim-kosullari.md).

**İlgili:**

- [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md),
  [Özel roller](../roller-yetkiler/ozel-roller.md).
- [Kişi kodu](../portallar/kisi-kodu.md), [Veli kodu](../hesaplar/veli-kodu.md), [Veli bağlama](../hesaplar/veli-baglama.md),
  [T.C. kimlik no](../giris-hesap/tc-kimlik-no.md).
- [Velinin kopyası](../mesaj/velinin-kopyasi.md), [Okundu bilgisi](../mesaj/okundu-bilgisi.md), [Gizli anket](../anket/gizli-anket.md).
- [Çıkış kaydı](../quiz/cikis-kaydi.md), [Teslimleri inceleme](../odev/teslimleri-inceleme.md).
- [Servisim](../servis/servisim.md), [Yönetimin yoklama görünümü](../servis/yonetimin-yoklama-gorunumu.md), [Evi işaretleme](../servis/evi-isaretleme.md).
- [Kim görür, ne kadar saklanır](../aile/mahremiyet.md), [Kimler görür (başarılar)](../basarilar/kimler-gorur.md).
- [Görme yetkisi (işlem kaydı)](../islem-kaydi/gorme-yetkisi.md), [Ad kısaltma ve etiket (yorumlar)](../yorumlar/ad-kisaltma-ve-etiket.md).

## Kod tarafı

- Ortak kurallar: [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`canSeeStudent`, `studentsOfTeacher`), [sunucu/yetki.md](../../sunucu/yetki.md)
  (`pub`, yetki listesi, hazır şablonlar), [sunucu/api.md](../../sunucu/api.md) (rol kapıları).
- Kişinin kendine giden görünüm (T.C. yalnız kendisine): [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) (`benimGorunum`);
  okulun hesap penceresi (T.C. dahil): [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) (`hesapGorunumu`, kişi koduyla
  ekleme ve maskeli ad).
- Öğretmenin uçları: [sunucu/bolumler/ogretmen.md](../../sunucu/bolumler/ogretmen.md) ("`students` ucu e-posta döndürür").
- Okundu bilgisi: [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) (`okumaGorebilir`: gönderen; duyuruysa müdür).
- İşlem kaydı: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) (yetişkinin kişisel işlemleri okulsuz).
- Aile: [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md) (`bagliMi`).
- Ön yüz: [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) ("Kaynakça" penceresi),
  [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) (fotoğrafsız avatar), [public/KLASOR.md](../../public/KLASOR.md)
  (giriş formundaki gizlilik notu, Hakkında, SSS).
- Testler: [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md) (her uç her rolle), [testler/test-kapsam.md](../../testler/test-kapsam.md),
  [testler/test-rol.md](../../testler/test-rol.md), [testler/test-aile.md](../../testler/test-aile.md), [testler/test-veli-coklu.md](../../testler/test-veli-coklu.md).

## Sık sorulanlar

- **Bilgilerim nerede duruyor, kim görüyor?** (SSS) Eğitim Evi'nin sunucusunda; her okulun verisi ayrıdır ve yalnız o okulun
  yetkilileri erişir. Herkes yalnızca yetkisi olanı görür: öğrenci kendini, veli kendi çocuğunu, öğretmen ders verdiği sınıfları. Bir
  okul başka bir okulun öğrencisini göremez.
- **Okul yönetimi yapılan işlemleri görür mü?** (SSS) Müdür (ya da yetki verdiği kişi) İşlem kaydı sayfasında önemli işlemleri kimin ne
  zaman yaptığıyla görür: hesap açma ve silme, şifre sıfırlama, rol verme, veli bağlama, eğitim yılı ve okul sayfası değişiklikleri
  gibi. Mesajlar bu kayda girmez.
- **Servisin konumunu kim görür?** (SSS) Yalnız o servisteki öğrenci, velisi ve okul yönetimi; yalnız sefer sürerken. Evin yerini
  öğrenci, velisi, o servisin servisçisi ve okul yönetimi görür.
- **Okul çocuğumun telefonunun konumunu görebilir mi?** Hayır; müdür ve öğretmen dahil okulun hiçbir hesabı görmez.
- **Öğretmen T.C.'mi görebilir mi?** Hayır; öğretmenler ve öğrenciler kimsenin numarasını görmez.

## Sırada

- KVKK ve onay metinleri tam denetimi (iş 18): her görünürlük kuralı aydınlatma metniyle karşılaştırılacak (yukarıdaki "Dikkat"
  maddeleri).
- Güvenlik denetimi (iş 3): öğretmenin öğrenci ucundaki e-posta, `rol.yonet` yetkisiyle kendinde olmayan yetkiyi dağıtabilme.
- Kullanıcı arama ve destek (iş 5–6): yönetici ve desteğin gördükleri; aydınlatma metninde "kod olmadan kişi arayamaz" cümlesi değişir.
- Optimizasyon ve saklama süreleri (iş 7): öğrenci ve velinin yalnız son bir geçmiş yılı görmesi.
- Mesaj etiketleri ve "Bu mesajı bildir" (iş 28, iş 8), toplantılar ve tahta (iş 21), başarılar (iş 16), eğitim içerikleri (iş 17),
  çalışan olarak ekleme (iş 2): kendi görünürlük kuralları.
