# Yorumlar · Yorum yazma

**Durum:** Kodda var; tasarımda ek olarak Ayarlar'a profil menüsünden girilir ve yorum (Tasarım 1 önizlemesinde) bir pencerede yazılır

Eğitim Evi'ni kullanan bir yetişkinin, açılış sayfasındaki "Kullananlar ne diyor?" bölümüne 0–5 yıldız ve en çok 500 karakterlik
kısa bir yorum bırakması.

## Ne işe yarar

Siteye ilk kez gelen biri (bir veli, bir okul müdürü) "bunu kullananlar memnun mu?" diye bakar. Açılışın en altındaki yorumlar bunu
gösterir. Yorumu yalnız Eğitim Evi'ni gerçekten kullanan yetişkinler yazar: bir okulda onaylı öğretmen ya da müdür olan ya da
hesabına çocuğunu eklemiş olan kişi. Kullanıcının 26 Eylül kararına göre açılışın altında bir yorum yeri olur ve yalnız kayıtlı
kişiler yazar; soru penceresindeki cevabı da "yalnızca yetişkinler". Her hesabın tek yorumu olur; yeniden yazmak eskisini değiştirir
([Yorumu değiştirme ve silme](yorumu-duzeltme-ve-silme.md)).

Yorum hemen yayına girer: ön onay yok, kimseye bildirim gitmez. Uygunsuz kelime ve internet adresi taşıyan yorum hiç kaydedilmeden
geri çevrilir ([süzgeç](uygunsuz-kelime-suzgeci.md)); yine de geçen bir yorumu sistem yöneticisi gizler ([Yorumu gizleme](yorum-gizleme.md)).

## Nereden açılır

- **Bugünkü site:** giriş yaptıktan sonra **"Ayarlar"** sayfası — sol menünün altında, **"Çıkış Yap"**'ın hemen üstündeki
  **"Ayarlar"** satırı ya da üst şeritteki **"Ayarlar"** düğmesi (adres `#/profil`, sayfa başlığı "AYARLAR"). Kart **"Eğitim Evi hakkında yorumun"** adını taşır; "Şifre
  değiştir" kartının altında, "Hesabımı sil" kartının üstünde durur. Önce "Yükleniyor..." yazar, sonra form ya da yazamama nedeni
  gelir.
- **Açılış sayfasından yönlendirme:** bölümün altındaki not: "Veli, öğretmen ya da müdür hesabınla **giriş yap**, **Ayarlar**
  sayfasından sen de yorumunu yaz." ("giriş yap" `/login`'e gider; [Açılış sayfasındaki yorumlar bölümü](yorumlar-bolumu.md)).
- **Tasarımda** (30 Eylül üst şerit önerisi: Ayarlar profil menüsüne taşınır; Tasarım 1 önizlemesi): sağ üstteki baş harfli
  yuvarlağa (profil menüsü) dokun → **"Gizlilik ve verilerim"** (alt yazısı "aydınlatma metni") → "Hesap ayarları" sayfası o bölümde
  açılır → **"Eğitim Evi hakkında yorumun"** satırı. Yorumun yoksa satırda soluk "henüz yazmadın" ve sağda **"Yorum yaz"**; varsa
  yıldız işaretleri, yorumunun ilk 60 karakteri ("…" ile) ve **"Düzenle"**. Aynı sayfaya sol menünün altındaki **"Hesap
  ayarları"** satırıyla da gidilir (profil menüsünde bu adla bir satır yok; menü doğrudan bölümleri sıralar). Bkz.
  [Profil menüsü](../menu-ve-arama/profil-menusu.md).

## Adım adım

### Veli

1. Giriş yap, **"Ayarlar"**'ı aç, aşağı kaydır: **"Eğitim Evi hakkında yorumun"** kartı.
2. Kartın üstündeki not, yorumunun açılışta nasıl görüneceğini söyler: "Açılış sayfasında **De. Ka. · Veli** olarak görünür; adın
   tam yazılmaz. Küfür, hakaret ve internet adresi kabul edilmez." (ad örnek; kural için [Adın kısaltılması ve rol etiketi](ad-kisaltma-ve-etiket.md)).
3. **"Yıldız"** satırında altı düğme var: **0**, sonra 1'den 5'e yıldızlar. Henüz yorumun yoksa 5 seçili başlar. Birine bas: o
   sayıya kadar olan yıldızlar dolar, seçtiğin düğmenin çevresi belirginleşir. 0 da geçerli bir puandır.
4. **"Yorumun"** kutusuna yaz (3 satırlık kutu; en çok 500 karakter yazılabilir). Altındaki sayaç yazdıkça "123 / 500" diye sayar.
5. **"Yorumu gönder"**'e bas. Düğme "Gönderiliyor..." olur.
6. Olursa kartın altında yeşil ileti: "Yorumun açılış sayfasında görünüyor. Teşekkürler!". Yorumun açılıştaki listenin en başına
   gelir.
7. Olmazsa aynı yerde kırmızı ileti (aşağıdaki tablo). Düzelt, yeniden gönder.

Dikkat (bugünkü kodda bilinen bir eksik): ilk gönderimden sonra kart kendini tazelemez. Düğme "Yorumu gönder" diye kalır, "Yorumu
sil" düğmesi çıkmaz. Yeniden basarsan yorumun yine değişir (ikinci bir yorum açılmaz); "Yorumu güncelle" ve "Yorumu sil"i görmek için
Ayarlar'a yeniden gir.

Velide birden çok çocuk olması yorumu çoğaltmaz: yorum senin yetişkin hesabınındır. Tasarımda velide her çocuk ayrı oturum olsa da
([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)) hangi çocuğun oturumundan yazarsan yaz tek yorumun olur
(Tasarım 1 önizlemesi de yorumu hesabın kendisine bağlar).

### Öğretmen

Veliyle aynı adımlar. Okulun öğretmen portalındayken de (okul rolüyle girmişken) Ayarlar'da kart görünür; yorum yine senin yetişkin
hesabına yazılır. Birden çok okulda öğretmensen ya da hem öğretmen hem veliysen tek yorumun olur, etiketi "Öğretmen, veli" gibi
birleşir. Öğretmenlik rolün onaylı olmalı.

Eski düzende okulun açtığı (yetişkin hesabına bağlı olmayan) öğretmen hesabında bu kart hiç görünmez; o hesap yorum yazamaz.

### Müdür

Öğretmenle aynı. Etiketin "Müdür" ile başlar: "Müdür", "Müdür, öğretmen", "Müdür, veli" gibi.

### Çalışan

- **Bugünkü kodda** ek görevli kişi (Müdür Yardımcısı, Rehber Öğretmen …) okulda öğretmen hesabı ve ek bir rolle çalışır: öğretmen
  gibi yazar, etiketi "Öğretmen" olur. Özel rolün adı etikete girmez.
- **Tasarımda** (çalışan tanımı) kişi okula "çalışan" olarak eklenir; müdür ona Öğretmen görevi verince etiketi "Öğretmen" olur.
  Rolsüz çalışanın ya da yalnız özel rolü olan çalışanın (ör. yalnız Kodlayıcı) yorum yazıp yazamayacağı tanımlarda konuşulmadı.
  Kural bugünkü gibi kalırsa bu kişi ancak velisi olduğu bir çocuk varsa yazar; yoksa kartta neden iletisi çıkar. Bkz.
  [Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md).

### Eğitmen

Eğitmen rolü (tasarım; [Eğitmen rolü](../egitim-icerikleri/egitmen-rolu.md)) yorum hakkı vermez ve etikete girmez (tanımlarda ayrıca
konuşulmadı; Tasarım 1 önizlemesi de bugünkü kuralı uygular). Eğitmenin hesabı yetişkin hesabıdır: aynı hesapta onaylı bir öğretmen ya da müdür portalı ya da bağlı bir çocuğu varsa veliyle aynı adımlarla yazar;
yoksa "Yorum yazmak için bir okulda öğretmen ya da müdür olman ya da çocuğunu eklemiş olman gerekiyor." iletisini görür.

### Henüz portalı olmayan yetişkin

Kayıt olmuş ama hiçbir okula katılmamış, çocuğunu da eklememiş kişi ([Henüz portalı olmayan yetişkin](../portallar/portalsiz-hesap.md))
kartı görür, ama içinde form yerine yalnız şu yazar: "Yorum yazmak için bir okulda öğretmen ya da müdür olman ya da çocuğunu eklemiş
olman gerekiyor." Çocuğunu eklediğin ya da bir okula katıldığın anda form açılır.

### Öğrenci ve servisçi

- **Bugünkü site:** Ayarlar'da yorum kartı yoktur; yazamazsın. Sunucuya yine de denenirse cevap "Yorumları yalnızca veli, öğretmen ve
  müdür hesapları yazabilir." olur.
- **Tasarımda** (Tasarım 1 önizlemesi): "Gizlilik ve verilerim" bölümünde "Eğitim Evi hakkında yorumun" satırı öğrencide ve
  servisçide de görünür.
  Öğrenci ya da servisçi "Yorum yaz"'a dokununca açılan pencere yalnız "Yorumları yalnızca veli, öğretmen ve müdür hesapları
  yazabilir." der, **"Tamam"** ile kapanır.

### Yönetici ve destek

Sistem yöneticisi hesabı yorum yazmaz; Ayarlar'ında kart yoktur. Yöneticinin bu klasördeki işi [Yorumu gizleme](yorum-gizleme.md).
Destek ekibi (tasarım; [Destek ekibi](../destek/destek-ekibi.md)) için yorum hakkı tanımlarda konuşulmadı; destek rolü etikete
girmediği için kural bugünkü gibi kalırsa destek hesabı da yazamaz.

### Ziyaretçi

Giriş yapmadan yorum yazılmaz. Açılışın altındaki not seni girişe yönlendirir. Sunucu girişsiz yazma isteğine "Giriş yapmalısın"
der.

### Tasarımda (Tasarım 1 önizlemesi)

Kullanıcı bu formun görünüşü için ayrıca karar vermedi (2 Ekim kararı: üzerine yorum yapılmamış ekranlar bugünkü site gibi kalır);
önizlemedeki pencere örnektir:

1. "Hesap ayarları" → "Gizlilik ve verilerim" → "Eğitim Evi hakkında yorumun" satırında **"Yorum yaz"** (ya da **"Düzenle"**).
2. Ortada **"Eğitim Evi hakkında yorumun"** başlıklı pencere açılır. Üstte aynı not ("Açılış sayfasında **… · …** olarak görünür;
   adın tam yazılmaz. Küfür, hakaret ve internet adresi kabul edilmez.").
3. **"Yıldız"** yazısının yanında seçili sayı küçük yazıyla görünür ("5 yıldız"); altında 0–5 düğmeleri.
4. **"Yorumun"** kutusu (4 satır, yer tutucu "Neyi sevdin, neyi geliştirelim?", en çok 500), altında "0 / 500" sayacı.
5. Altta düğmeler: yorumun varsa **"Yorumu sil"**, sonra **"Vazgeç"** ve **"Yorumu gönder"** (yorumun varsa **"Yorumu güncelle"**).
6. Hata olursa ileti pencerenin içinde, uyarı simgeli kırmızı kutuda çıkar; yazmaya başlayınca kaybolur.
7. Olursa pencere kapanır, kısa bir bildirim çıkar: "Yorumun açılış sayfasında görünüyor. Teşekkürler!" (değiştirmede "Yorumun
   güncellendi; açılış sayfasında görünüyor."). Satır hemen yeni yıldızları ve metni gösterir; bugünkü sitedeki "kart tazelenmiyor"
   eksiği burada yok.

## Kurallar ve sınırlar

- **Kim yazar:** yetişkin hesabının sahibi; şartı (1) herhangi bir okulda ONAYLI müdür rolü, (2) onaylı öğretmen rolü ya da (3) en az
  bir bağlı çocuk. Hiçbiri yoksa yazamaz. Öğrenci, servisçi ve sistem yöneticisi hiçbir durumda yazmaz.
- **Hesap başına tek yorum.** Yorum yetişkin (ana) hesaba bağlıdır; okul portalından, veli portalından ya da başka bir okulun
  portalından yazmak aynı yorumu değiştirir.
- **Yıldız:** 0, 1, 2, 3, 4 ya da 5 (tam sayı). Başka bir değer "Yıldız 0 ile 5 arasında olmalı." ile reddedilir.
- **Metin:** sunucu boşlukları teke indirir; satır başları da tek boşluğa döner, yorum tek paragraf olarak saklanır. Sonuç en az 3,
  en çok 500 karakter olmalı. Metin düz yazıdır: HTML ya da biçim işlenmez, ekranda olduğu gibi görünür.
- **İnternet adresi ve uygunsuz kelime:** ikisi de yorumu kaydetmeden geri çevirir; ayrıntı [süzgeç belgesinde](uygunsuz-kelime-suzgeci.md).
- **Hız sınırı:** bir hesap bir saatte en çok 10 kez gönderebilir. Sayaç ilk denemeyle başlar ve geri çevrilen denemeleri de sayar
  (kısa metin, adres, uygunsuz kelime). 11. denemede "Yorumunu çok sık değiştirdin. Biraz sonra dene." çıkar; saat dolunca açılır.
  Silme bu sayaca girmez.
- **Kaydedilenler:** yıldız, metin, kısaltılmış ad, rol etiketi, ilk yazılış ve son değişiklik zamanı, gizli mi. Açılışta görünen
  tarih son değişikliğin tarihidir.
- **Yayın:** ön onay yok; yorum kaydedildiği an açılışta görünür (sunucu açılış listesinin 1 dakikalık önbelleğini hemen boşaltır).
- **Bildirim:** yorum yazılınca, değişince ya da silinince kimseye bildirim gitmez.
- **Aydınlatma metni:** yorum isteğe bağlıdır; yorum, yıldız, kısaltılmış ad ve etiket herkese açık görünür, tam ad gösterilmez
  ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)). Kullanım koşulları yazdığın yorumdan senin sorumlu olduğunu söyler
  ([Kullanım koşulları](../kvkk-ve-gizlilik/kullanim-kosullari.md)).

Hata iletileri (gönderimde kartın altında kırmızı; tasarımda pencerenin içinde). Yazma hakkı yoksa ilk satırdaki ileti gönderimi
beklemeden, formun yerine kartın içinde soluk düz yazıyla durur:

| Durum | İleti |
|---|---|
| Rolü ve çocuğu olmayan yetişkin | "Yorum yazmak için bir okulda öğretmen ya da müdür olman ya da çocuğunu eklemiş olman gerekiyor." |
| Öğrenci, servisçi, yönetici (sunucuya denenirse) | "Yorumları yalnızca veli, öğretmen ve müdür hesapları yazabilir." |
| Giriş yok (sunucuya denenirse) | "Giriş yapmalısın" |
| Bir saatte 10'dan çok deneme | "Yorumunu çok sık değiştirdin. Biraz sonra dene." |
| Yıldız 0–5 dışında | "Yıldız 0 ile 5 arasında olmalı." |
| 3 karakterden kısa | "Yorumunu yaz (en az 3 harf)." |
| 500 karakterden uzun | "Yorum en fazla 500 karakter olabilir." |
| İnternet adresi | "Yoruma internet adresi eklenemez." |
| Uygunsuz kelime | "Yorumunda uygun olmayan bir kelime var. Düzeltip yeniden gönder." |

Başarı iletileri: "Yorumun açılış sayfasında görünüyor. Teşekkürler!"; yönetici yorumunu daha önce gizlemişse "Yorumun güncellendi.
Sistem yöneticisi gizlediği için açılışta görünmüyor."

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Yorumlar](README.md)):

- [Yorumu değiştirme ve silme](yorumu-duzeltme-ve-silme.md) — "Yorumu güncelle", "Yorumu sil", gizlenmiş yorumun sahibi.
- [Adın kısaltılması ve rol etiketi](ad-kisaltma-ve-etiket.md) — "De. Ka. · Veli" nasıl oluşur.
- [Uygunsuz kelime ve internet adresi süzgeci](uygunsuz-kelime-suzgeci.md) — neler reddedilir, nasıl yakalanır.
- [Açılış sayfasındaki yorumlar bölümü](yorumlar-bolumu.md) — yorumunun göründüğü yer.
- [Yorumu gizleme (yönetici)](yorum-gizleme.md) — geçen uygunsuz yorumun gizlenmesi.

**İlgili:**

- [Hesap ayarları](../ayarlar/README.md) — kartın bulunduğu sayfa; tasarımda "Gizlilik ve verilerim" bölümü.
- [Profil menüsü](../menu-ve-arama/profil-menusu.md) ve [Sol menü](../menu-ve-arama/sol-menu.md) — Ayarlar'a giden yollar.
- [Çocuklarım](../portallar/cocuklarim.md) — çocuğunu eklemek "Veli" etiketini ve yazma hakkını getirir.
- [Portala geçiş](../portallar/portala-gecis.md) — hangi portaldan yazarsan yaz yorum aynı hesabındır.
- [İşlem kaydı: neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) — geri çevrilen uygunsuz yorum kaydı.
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md) — "Açılış sayfası yorumu" satırı.

## Kod tarafı

- Sunucu: [sunucu/bolumler/yorum.md](../../sunucu/bolumler/yorum.md) — `GET /api/yorumlar/benim` (`yazabilir`, `neden`, `adKisa`,
  `rol`, `yorum`), `POST /api/yorumlar` (`yazarBilgisi`, hız sınırı `yorum:<hesap>` saatte 10, yıldız, uzunluk, `BAGLANTI`,
  `uygunsuzKelime`), `adKisalt`. `yorumlar` yolu aydınlatma onayı beklenirken ve rolsüz yetişkine de açık yollardandır
  ([sunucu/api.md](../../sunucu/api.md)).
- Depo ve tablo: [sunucu/veri/depo/yorumlar.md](../../sunucu/veri/depo/yorumlar.md) — `hesabin`, `yaz` (hesap başına tek; `ON CONFLICT
  (hesap_id)`); tablo `yorumlar` (şema 019; yıldız 0–5, metin 3–500, kısa ad ≤ 40, etiket ≤ 60 —
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)). Kimin yetişkin sayıldığı: `yetiskinMi`
  ([sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md)); hız sınırı [sunucu/guvenlik.md](../../sunucu/guvenlik.md).
- Ön yüz: [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — kart yalnız `u.yetiskin ||
  u.rolSatiri` iken çizilir; `yorumKartiniDoldur`, `yorumYildizCiz`, `EYLEMLER['yorum-yildiz']`, `EYLEMLER['yorum-kaydet']`.
  Biçim: [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`28-yetiskin-hesap.css`: `.yildiz-sec`, `.yildiz-sec-btn`).
- Testler: [testler/test-yorum-ek.md](../../testler/test-yorum-ek.md) (öğrenci ve rolsüz yetişkin yazamaz, öğretmen ve müdür yazar,
  6 yıldız ve "ok" reddi, hesap başına tek yorum), [testler/buton-denetimi.md](../../testler/buton-denetimi.md) (`yorum-*` düğmeleri),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Yorumlar" paragrafı).

## Sık sorulanlar

- **Ayarlar'da yorum kartını göremiyorum.** Öğrenci, servisçi ya da sistem yöneticisi hesabıyla girmişsindir; bu hesaplar yorum
  yazmaz. Okulun açtığı eski tip öğretmen hesabında da kart yoktur.
- **Kart var ama form yok, bir cümle yazıyor.** Ya hiçbir okulda onaylı rolün ya da bağlı çocuğun yok. Çocuğunu veli koduyla ekle
  ya da okulunun seni eklemesini bekle.
- **Yorumu kim onaylıyor?** Kimse; hemen yayına girer. Süzgeçten geçemeyen yorum hiç kaydedilmez, geçen uygunsuz bir yorumu sistem
  yöneticisi gizler.
- **0 yıldız verebilir miyim?** Evet; 0 da sayılır ve ortalamaya girer.
- **Aynı hesapla iki yorum yazabilir miyim?** Hayır; ikinci gönderim ilkini değiştirir.
- **"Yorumu gönder"e bastım, ileti yeşil çıktı ama "Yorumu sil" düğmesi yok.** Kart ilk gönderimden sonra tazelenmiyor; Ayarlar'a
  yeniden gir.
- **Satır başı koydum, açılışta tek paragraf görünüyor.** Sunucu bütün boşlukları ve satır başlarını tek boşluğa indirir.
- **Videolara da yorum yazabilir miyim?** Hayır. Eğitim içeriklerinde yorum yok, yalnız "Beğen" var
  ([Beğen](../egitim-icerikleri/begeni.md)).

## Sırada

- Üst şerit sadeleştirme (iş 29, öneri): Ayarlar profil menüsüne taşınacak; Tasarım 1 önizlemesinde yorum satırı "Hesap ayarları"nın
  "Gizlilik ve verilerim" bölümünde.
- Çalışan olarak ekleme: rolsüz çalışanın yorum hakkı karara bağlanmalı (bugünkü kurala göre yalnız veliyse yazar).
- Çok dil: karttaki ve penceredeki metinler çeviri kataloğuna girecek; yorumun kendisi kullanıcı içeriği olduğu için çevrilmez.
- Kullanıcı arama ve Verilerimi indir: yorum, kişinin "Verilerimi indir" dosyasına ve kişi sayfasına girecek.
