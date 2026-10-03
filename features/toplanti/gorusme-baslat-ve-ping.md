# Toplantılar · Görüşme başlat, ping ve Katıl izni

**Durum:** Tasarlandı — henüz kodda yok

Derste öğretmen ya da sınıftaki tahta "Görüşme başlat" ile sınıfın uzaktan ders odasını açar, gelemeyen öğrencilere "Dersin uzaktan
bağlantısı açık — Katıl" bildirimini gönderir (ping); yalnız bu ders için seçilen öğrenci "Katıl" ile odaya girebilir.

## Ne işe yarar

Kullanıcının 29 Eylül isteği: "hoca 'Görüşme başlat'a basar, bu tahtaya yüklenir, uygulama ya da tarayıcıda açılır ve o çocuğu da
'ping'leyebilir." Aynı gün tahta için: "sonra sınıfta kimin ping'leneceğini ve 'Katıl'ı kullanabileceğini seçer." Akşam son kararı
("veli şeyi KVKK olsun, zaten tahta şeyinde veli iletişime geçer 'bağlanmak istiyoruz' diye"): sistemde öğrenci başına ayrı veli izni
denetimi yok; "Katıl" için **tek kural** var, öğretmen ekranında da tahtada da aynı — öğrenci **o ders için seçilmiş** olmalı. Asıl kapı
Meet'in ya da Zoom'un bekleme odasıdır; öğretmen içeri alır.

Okula gelemeyen öğrenci, bildirime basıp dersi evden izler. Seçim yalnız o ders için geçerli olduğundan bağlantı kalıcı olsa da başka
bir derste kimse habersiz giremez.

Odanın sınıfa nasıl verildiği: [Sınıfın uzaktan ders bağlantısı](uzaktan-ders-baglantisi.md).

## Nereden açılır

- **Öğretmen:** Tasarım 1 önizlemesinde **"Yoklama"** sayfası: bugünün ders çiplerinin sağında kamera simgeli **"Görüşme başlat"**
  ve zil simgeli **"Gelmeyenlere Katıl bildirimi"** ([Ders yoklaması](../devamsizlik/ders-yoklamasi.md)). Ders programından ya da
  ana sayfadan açılan **"Yoklama · `<sınıf>` · `<ders>`"** penceresinde (programdaki hücrede "şimdi · yoklama al") bu iki düğme yok
  ([Ders programından yoklama](../devamsizlik/programdan-yoklama.md)). Derse giren müdürün menüsünde de aynı "Yoklama" sayfası var.
  Önizlemede bir ders satırına basınca açılan genel ders penceresinde de öğretmen ve müdür için **"Yoklama al"** ve **"Görüşme
  başlat"** yan yana durur.
- **Tahta:** tahta hesabının tek sayfası **"Sınıflar"** → sınıf seç → üstte **"Görüşme başlat"**, altta öğrenci kutucukları ve
  **"Seçilenlere bildir (`<n>`)"** ([Tahta hesabı](../tahta/README.md)).
- **Öğrenci:** zil ya da telefondaki **"Dersin uzaktan bağlantısı açık — Katıl"** bildirimi; sol menü → **"Toplantılar"** → en üstteki
  **"Uzaktan ders"** grubu ([Toplantılar listesi](toplantilar.md)).

## Adım adım

### Öğretmen

**Görüşme başlat**

1. Ders başlayınca **"Yoklama"** sayfasını aç; süren dersin çipi "şu an" yazar (ör. "3. ders · 8-B · şu an").
2. **"Görüşme başlat"**a bas. Sınıfın uzaktan ders bağlantısı bu cihazda yeni sekmede açılır: tahta bilgisayarında, telefon
   uygulamasında (Meet ya da Zoom uygulaması) ya da tarayıcıda.
3. Önizlemedeki pencere: başlık **"Katılıyorsun"**, kamera simgesi, kalın "`<sınıf>` · uzaktan ders", altında "Google Meet yeni
   sekmede açılıyor…" ve "Telefonda Google Meet uygulaması açılır. Açılmazsa aşağıdaki düğmeye bas."; en altta **"Bağlantıyı aç"**
   (basınca kısa ileti "Google Meet açıldı."). Önizleme davetlinin penceresini kullanıyor; dersi açan öğretmene uygun başlık
   (toplantılardaki "Toplantıyı açıyorsun" gibi) kodlanırken verilmeli.
4. Meet'te odayı sen yönetirsin: "Katılma isteğinde bulun" diyen öğrenciyi **"Kabul et"** ile al. Bağlantıyı hangi hesapla aldıysan o
   cihazda o hesap açık olmalı ki Meet seni odanın sahibi saysın.

**Gelmeyenlere Katıl bildirimi (ping)**

1. Yoklamada gelmeyenleri işaretle: **"Gelmedi (izinli)"** ya da **"Gelmedi (izinsiz)"**.
2. **"Gelmeyenlere Katıl bildirimi"**ne bas. "Gelmedi" işaretli (izinli ya da izinsiz) bütün öğrencilere **"Dersin uzaktan bağlantısı
   açık — Katıl"** bildirimi gider. Kısa ileti: **"`<n>` gelmeyen öğrenciye "Dersin uzaktan bağlantısı açık — Katıl" bildirimi
   gitti."** Gelmedi işaretli öğrenci yoksa: **"Gelmeyen öğrenci yok."**
3. Bildirim giden öğrenciler bu ders boyunca **Katıl izni** alır (tek kural; aşağıda). Önizlemede sayım o anki işaretlere bakar;
   yoklamayı kaydetmeden de çalışır.

**Tasarımda:** tanım öğretmenin "tek tek ya da 'Gelmeyenlerin hepsine'" ping atabileceğini söyler; önizlemenin öğretmen ekranında yalnız
toplu düğme var, tek tek seçim tahtada var. Tanımdaki öneri: yoklamaya **"Uzaktan katıldı"** durumu eklenmesi (onaylanmadı; önizlemenin
eski yoklama ekranında "Uzaktan" düğmesi vardı, son hâlinde üç seçenek kaldı).

### Tahta

Tahta, sınıftaki akıllı tahta için okulun açtığı kısıtlı hesaptır ("tahta." önekli kullanıcı adı, okulun sayfasındaki normal "Giriş
yap"tan girer — [Tahta girişi](../tahta/tahta-girisi.md)). Kişiye bağlı değildir; o saatte derste kim varsa kullanır.

1. Giriş yapınca **"Sınıflar"** açılır. Üstte: "Okulun sınıfları · müdürün açtığı `<n>` sınıf. Önce dersin yapılacağı sınıfı seç; uzaktan
   ders bağlantısı sınıfa aittir." Sınıflar kademe kademe ("5. sınıflar", "6. sınıflar"…); her kartta sınıf adı, "`<n>` öğrenci",
   "şimdi: `<ders>`" ya da "şimdi ders yok" ve izin verildiyse "`<n>` öğrenciye Katıl izni". Okulda sınıf yoksa "Okulda henüz sınıf
   yok." ve "Sınıfları müdür açar." ([Sınıf seçme](../tahta/sinif-secme.md))
2. Sınıfa bas. Üstte **"Sınıf değiştir"**, çip "`<sınıf>` · 3. ders · Matematik · 10:10–10:50" (ders yoksa "`<sınıf>` · şu an ders
   yok"), sağda **"Görüşme başlat"**. Altında not: ""Görüşme başlat", `<sınıf>` sınıfının uzaktan ders bağlantısını bu tahtada
   açar."
3. **"Bugünkü dersler"** (sağda gün, ör. "Perşembe 1 Ekim"): sıra, ders, saat; süren ders vurgulu ve "· şu an". Sınıfın o gün dersi
   yoksa "Bugün bu sınıfın dersi yok."
4. **"Görüşme başlat"**a bas: sınıfın bağlantısı tahtada açılır (önizlemede "Katılıyorsun" penceresi, "`<sınıf>` · uzaktan ders").
5. **"Öğrenciler · `<n>`"** listesi: her öğrencide kutucuk, ad ve sağda **"Geldi"** (yeşil) ya da **"Gelmedi"** (kırmızı). İzin nedeni ve
   açıklama gösterilmez: izinli öğrenci "Gelmedi", geç gelen "Geldi" görünür. Başlığın sağında **"Gelmeyenlerin hepsi"** (gelmeyen
   yoksa soluk) ve **"Hepsini kaldır"** ([Öğrenci seçme](../tahta/ogrenci-secme.md)).
6. Kutucuklarla öğrenci seç ya da **"Gelmeyenlerin hepsi"**ne bas. Altta not: "Seçilenlere "Dersin uzaktan bağlantısı açık — Katıl"
   bildirimi gider ve bu ders boyunca Katıl izni alırlar. Önceki sınıfların izinleri ders sonuna kadar sürer." ve düğme
   **"Seçilenlere bildir (`<n>`)"** (hiç seçim yoksa soluk; seçimsiz basılırsa "Önce öğrenci seç.").
7. **"Seçilenlere bildir"**e bas. Kısa ileti: **"`<n>` öğrenciye "Katıl" bildirimi gitti; bu ders boyunca katılabilirler."** Seçim
   temizlenir; izin verilen öğrencinin satırında "Katıl izni var · bildirim gitti" yazar.
8. Başka sınıfa geçmek için **"Sınıf değiştir"** → liste. Önceki sınıfın izinleri ders sonuna kadar sürer.

Tahta yoklama almaz (tanımın önerisi; yoklama öğretmenin kendi hesabından alınır). Tahtanın göremedikleri:
[Tahtanın gördükleri ve sınırları](../tahta/tahtanin-sinirlari.md).

### Öğrenci

1. Öğretmen ya da tahta seni seçince bildirim gelir: **"Dersin uzaktan bağlantısı açık — Katıl"** (zilde; telefon bildirimi açıksa
   telefonda da).
2. Sol menü → **"Toplantılar"**. En üstte **"Uzaktan ders"** grubu, tek satır: başlık "7-A · Matematik · 3. ders", alt satır
   "Ayşe Kaya · Google Meet · 10:10–10:50 · öğretmen sana katılma izni verdi"; sağda yeşil **"Katıl"**. Bu ders için seçilmediysen
   sağda gri **"İzin yok"** yazar.
3. **"Katıl"**a bas. Sunucu bakar: bu sınıfın öğrencisi misin, şu an ders saati mi, bu ders için seçildin mi. Hepsi tamamsa sınıfın odası
   yeni sekmede açılır. Önizlemedeki pencere: **"Katılıyorsun"**, "7-A · Matematik uzaktan ders", "Google Meet yeni sekmede açılıyor…",
   "Telefonda Google Meet uygulaması açılır. Açılmazsa aşağıdaki düğmeye bas.", **"Bağlantıyı aç"**.
4. Meet "Katılma isteğinde bulun" derse bekle; öğretmen seni **"Kabul et"** ile alır.

İzin yokken satıra basınca önizlemede kısa ileti "Öğretmenin izin vermedi." çıkıyor (dil hatası; "Öğretmen izin vermedi." olmalı).
Önizlemede satırın alt yazısı izin yokken de "öğretmen sana katılma izni verdi" diyor; izin yokken bu parça yazmamalı. İkisi kodlanırken
düzeltilecek.

"Uzaktan ders" grubu yalnız öğrencide çıkar; velide, öğretmende ve müdürde yoktur.

### Veli

Velinin bu işte ekranı yok; Toplantılar sayfasında "Uzaktan ders" grubu çıkmaz.

- Çocuğun okula gelemeyecekse ve dersi evden izlemesini istiyorsan okula ya da öğretmene haber ver ("bağlanmak istiyoruz";
  [Yeni mesaj](../mesaj/yeni-mesaj.md)). Öğretmen ya da tahta o derste çocuğunu seçer.
- Tanımın ilk hâlinde ping'in "istenirse velisine" de gideceği yazıyordu; önizlemede böyle bir seçenek yok, karar verilmedi.
  Öğrencinin aldığı bildirimin veliye de kopyalanması bugünkü genel kuraldır ([Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md));
  bu bildirimde de geçerli olup olmayacağı tanımda yazılı değil.

### Müdür

Müdür sınıflara bağlantı verir ([Sınıfın uzaktan ders bağlantısı](uzaktan-ders-baglantisi.md)) ve tahta hesaplarını açar
([Tahta hesabı açma](../tahta/tahta-hesabi-acma.md)). Derse giren müdür için Tasarım 1 önizlemesinde menünün sonunda öğretmendekiyle
aynı **"Yoklama"** sayfası vardır: orada öğretmen gibi **"Görüşme başlat"** ve **"Gelmeyenlere Katıl bildirimi"**ni kullanır (adımlar
yukarıda, [Öğretmen](#öğretmen)). Önizlemedeki genel ders penceresinde de müdüre "Yoklama al" ve "Görüşme başlat" çıkar. Tahtanın
yaptığı seçimler işlem kaydında görünür.

## Kurallar ve sınırlar

- **"Katıl" için tek kural (öğretmen ekranı ve tahta aynı):** öğrenci o ders için **seçilmiş** olmalı. Sunucu her basışta bakar: o
  sınıfın öğrencisi mi, şu an ders saati mi, bu ders için seçilmiş mi. Öğretmenin "Gelmeyenlere Katıl bildirimi" ile tahtanın
  "Seçilenlere bildir"i aynı izni verir.
- **İzin ders bitince düşer;** "Katıl" kalkar. Başka sınıfa geçen tahtada önceki sınıfın izinleri ders sonuna kadar sürer.
- **Ayrı veli izni denetimi yok:** uzaktan derse görüntülü katılım aydınlatma metninde yazılır; veli okula başvurur, öğretmen ya da tahta
  öğrenciyi seçer (kullanıcı 29 Eylül).
- **Asıl kapı Meet'in bekleme odası:** bağlantı kalıcıdır; içeri almayı öğretmen yapar. Bu, ekranda ve kılavuzda yazılacak.
- **Bağlantı gizli:** öğrenci adresi listede, bildirimde ya da sayfada görmez; "Katıl" sunucumuzdan geçer.
- **Bağlantı yoksa:** sınıfın bağlantısı başka yere devredildiyse ve yenisi seçilmediyse "Görüşme başlat"ta ve "Katıl"da **"Bağlantı
  bulunamadı"** çıkar; sınıfın bağlantısının sahibi tanımda müdürdür ([Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md)).
- **Tahta en az yetkiyle çalışır:** sınıf listesinde yalnız ad soyad ve bugünkü "Geldi/Gelmedi" görünür; not, ödev sonucu, mesaj,
  telefon, adres, T.C. kimlik numarası, başka sınıfın verisi ve yönetim ekranları görünmez.
- **İşlem kaydı:** tahtadaki seçim kaydedilir (tahta, sınıf, ders, kaç öğrenci); kayıtta o saatte programdaki öğretmen de yazar, ör.
  "Tahta 1 · 7-A · 3. ders (programdaki öğretmen: Ayşe Kaya)".
- **Kamera ve kayıt:** sınıftaki kamera öbür öğrencileri de gösterir; tahtaya dönük durmalı. Ders kaydedilmez.
- **Ücretsiz sınırlar:** Zoom'un ücretsiz görüşmesi 40 dakika (bir ders kadar), Meet grup görüşmesi 60 dakika.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Toplantılar ve uzaktan ders](README.md)):

- [Sınıfın uzaktan ders bağlantısı](uzaktan-ders-baglantisi.md) — "Görüşme başlat"ın açtığı oda.
- [Toplantılar listesi](toplantilar.md) — öğrencideki "Uzaktan ders" grubu.
- [Katıl düğmesi](katil.md) — toplantılardaki "Katıl" (kuralı farklı: davetli olmak ve 10 dakika kuralı).
- [Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md) — "Bağlantı bulunamadı".
- [Görüşme bağlantıları](gorusme-baglantilari.md) — "Tahta" etiketli bağlantılar.

**İlgili:**

- [Ders yoklaması](../devamsizlik/ders-yoklamasi.md), [Ders programından yoklama](../devamsizlik/programdan-yoklama.md),
  ["Gelmedi" bildirimi](../devamsizlik/devamsizlik-bildirimi.md).
- [Tahta hesabı](../tahta/README.md), [Tahta girişi](../tahta/tahta-girisi.md), [Sınıf seçme](../tahta/sinif-secme.md),
  [Öğrenci seçme](../tahta/ogrenci-secme.md), [Tahtanın gördükleri ve sınırları](../tahta/tahtanin-sinirlari.md).
- [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md), [Telefon bildirimi](../bildirim/telefon-bildirimi.md),
  [Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md).
- [Android uygulaması](../uygulama/android-uygulamasi.md) — Meet ya da Zoom uygulamasının açılması.
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md), [Dışarı giden veriler](../kvkk-ve-gizlilik/disari-giden-veriler.md).
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).

## Kod tarafı

Bugün kodda yok. Bugünkü yoklama (Geldi · Gelmedi · Geç geldi · İzinli; ders programında "Şu an — yoklama al") şu dosyalarda; düğmeler
buraya eklenecek:

- Sunucu: [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md) (`/api/devamsizlik/yoklama`), öğretmenin günü ve
  "şu an" dersi [sunucu/bolumler/ogretmen.md](../../sunucu/bolumler/ogretmen.md).
- Ön yüz: [public/js/parcalar/18-devamsizlik.md](../../public/js/parcalar/18-devamsizlik.md) ("Yoklama" sayfası),
  [public/js/parcalar/22-programim.md](../../public/js/parcalar/22-programim.md) (programdan yoklama penceresi).
- Bildirim: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md), telefon bildirimi [sunucu/push.md](../../sunucu/push.md);
  bildirime basınca açılan sayfa [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md).
- Yetki ve yeni "tahta" rolü: [sunucu/yetki.md](../../sunucu/yetki.md); işlem kaydı
  [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md); yeni tablolar (ders başına Katıl izni)
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md).

## Sık sorulanlar

- **Çocuğum hasta, dersi evden izleyebilir mi?** Okula ya da öğretmene haber ver; öğretmen ya da tahta o derste çocuğunu seçer, çocuğuna
  "Katıl" bildirimi gelir.
- **"İzin yok" yazıyor.** Bu ders için seçilmedin. Öğretmenine haber ver; seçince bildirim gelir ve düğme "Katıl" olur.
- **Ders bitti, "Katıl" kayboldu.** İzin yalnız o ders içindir; ders bitince düşer.
- **"Görüşme başlat"a bastım, Meet beni de bekletiyor.** Bağlantının alındığı hesap bu cihazda açık değil; o hesapla gir ya da Meet'te
  odanın sahibi içeri alsın.
- **Bağlantı kalıcıysa öğrenci adresi saklayıp başka derse girebilir mi?** Adres Eğitim Evi'nde gösterilmez, ama açılan Meet sayfasında
  tarayıcıda görünür. Bu yüzden asıl kapı Meet'in bekleme odasıdır: öğretmen tanımadığı ya da o derste beklemediği kişiyi içeri almaz.
- **Tahtada öğrencinin neden gelmediğini görebilir miyim?** Hayır; tahta yalnız "Geldi" ya da "Gelmedi" gösterir.

## Sırada

- Toplantılar ve tahta işi (iş 21, Linux'ta): "Görüşme başlat", "Gelmeyenlere Katıl bildirimi", tahtada seçim ve "Seçilenlere bildir",
  ders başına Katıl izni ve sunucudaki "Katıl" kapısı kodlanacak.
- Öneri (onaylanmadı): yoklamaya "Uzaktan katıldı" durumu.
- Karar bekleyen: ping'in velisine de gitmesi; öğretmen ekranında tek tek seçim.
- Önizlemedeki "Öğretmenin izin vermedi." iletisi, izin yokken de "öğretmen sana katılma izni verdi" diyen alt yazı ve öğretmenin
  "Görüşme başlat" penceresinin "Katılıyorsun" başlığı düzeltilecek.
- KVKK: kodlandığı işte aydınlatma metnine uzaktan derse görüntülü katılım ve tahta hesabı yazılacak, sürüm artacak.
