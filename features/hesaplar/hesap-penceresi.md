# Öğrenci hesapları · Hesap penceresi

**Durum:** Kodda var; tasarımda ek olarak satıra basınca açılan kişi penceresi (kullanıcı adını ayrı pencerede değiştirme, okulun
verdiği şifreyi görme ve "Şifre ver", "Portalını aç", "Başarı ekle"), T.C. kimlik no'nun boşaltılamaması, öğrencinin kendi Hesap
ayarlarında adının, T.C.'sinin, okul-sınıfının ve okul numarasının "okulun değiştirir" olması.

Okulun bir öğrencinin hesabını düzelttiği pencere: kişisel bilgiler ve "Bilgileri kaydet", altında şifre, veli kodu ve veliler.

## Ne işe yarar

Hesabı okul açtığı için öğrencinin adını, T.C.'sini, sınıfını, okul numarasını, kullanıcı adını okul düzeltir (kullanıcı 29 Ağustos:
"öğrencilerin sistem için kullandığı kullanıcı adını ve şifresini görüntüleyip değiştirebilsin"). Öğrencinin bütün hesap işleri tek
pencerede toplanır: bilgiler, yeni şifre ([Şifre işlemleri](sifre-islemleri.md)), veli kodu ([Veli kodu](veli-kodu.md)) ve bağlı
veliler ([Veli bağlama](veli-baglama.md)).

## Nereden açılır

- **Öğrenciler** sayfasında öğrencinin satırındaki **"Hesap"** düğmesi ([Öğrenciler listesi](ogrenci-listesi.md)). Düğme yalnız
  "Öğrenci bilgilerini düzenler" yetkisi olana (müdürde hep) görünür.
- Aynı pencere servisçi için Servisler sayfasındaki "Hesap"tan açılır ([Servisçi hesabı](../servis/servisci-hesabi.md)); eski düzende
  okulun açtığı öğretmen hesabı için Öğretmenler sayfasından ([Öğretmenler ve çalışanlar listesi](../ogretmenler-calisanlar/liste.md)).
- Tasarımda (Tasarım 1 önizlemesi): Öğrenciler listesinde ya da sınıf sayfasında **öğrencinin satırına basınca**.

## Adım adım

### Müdür

1. Öğrencinin satırında **"Hesap"**a bas. Pencerenin adı **"Elif Yılmaz — Öğrenci"**.
2. Üstte "Öğrenci ekle"deki alanlar dolu gelir (şifre kutusu hariç):
   - **"Ad"** ve **"Soyad"** — kayıtlı tam ad son kelimesi soyad olacak biçimde bölünür;
   - **"T.C. kimlik no"** (**"Yalnızca okul yönetimi görür; öğretmenler ve öğrenciler görmez."**);
   - **"Kullanıcı adı"** (**"Harfle başlar; harf, rakam, nokta ve alt çizgi. Okulun içinde tek olmalı."**);
   - **"E-posta (isteğe bağlı)"** — hesabı kişi kendisi açtıysa kutu kilitlidir ve altında **"Bu hesabı kişi kendisi açtı;
     e-postasını yalnızca kendisi değiştirebilir."** yazar (öğrenci hesaplarını okul açtığı için bu çoğu zaman görünmez);
   - **"Doğum tarihi (isteğe bağlı)"**, **"Sınıf"** ("— sınıfsız —" ve okulun sınıfları), **"Okul no (isteğe bağlı)"**,
     **"Adres (isteğe bağlı)"**, **"Yönetim notu (isteğe bağlı)"** ("Yalnızca okul yönetimi görür.").
3. Değiştir ve **"Bilgileri kaydet"**e bas ("Kaydediliyor..."):
   - hiçbir şey değişmediyse **"Değişiklik yok."**;
   - kaydedilince yeşil **"Bilgiler kaydedildi."** (birkaç saniye sonra kaybolur); pencere açık kalır, arkadaki liste yenilenir.
   Yalnız değiştirdiğin alanlar gönderilir; dokunmadığın alan değişmez.
4. Pencerenin altındaki bölümler:
   - **"Şifre"** — yeni şifre yazma, **"Rastgele üret"**, **"Şifreyi değiştir"**, **"İlk girişte kendi şifresini belirlesin"**,
     **"Şifreyi T.C. no yap"** ([Şifre işlemleri](sifre-islemleri.md));
   - **"Veli kodu"** — kod, **"Kopyala"**, **"Yeni kod üret"** ([Veli kodu](veli-kodu.md));
   - **"Veliler"** — bağlı veliler, **"Kaldır"**, **"Veli bağla"** kutusu ve **"Bul"** ([Veli bağlama](veli-baglama.md)).
5. Öğrenci penceresinde **"Hesabı sil"** bölümü yoktur: öğrenci hesabı kişiye aittir, okul silemez
   ([Öğrenciyi okuldan çıkarma](ogrenciyi-okuldan-cikarma.md)). (Servisçinin penceresinde vardır.)
6. Pencerenin altındaki **"Kapat"** ya da pencerenin dışına tıklamak onu kapatır (yeni şifre ekrandayken dışına tıklamak kapatmaz —
   [Şifre işlemleri](sifre-islemleri.md)).

Tasarımda (Tasarım 1 önizlemesi) pencere bir **kişi penceresi**dir:

- Başlık öğrencinin adı; üstte baş harfli yuvarlak, ad ve **"Öğrenci · 7-A · okul no 214"**.
- **"Kullanıcı adı"** satırı: kullanıcı adı ve **"Değiştir"**. "Değiştir" ayrı bir pencere açar: **"Kullanıcı adı · Elif Yılmaz"**,
  **"Şu anki"**, **"Yeni ad"** kutusu (yazdıkça **"Şu anki kullanıcı adı"**, **"Kullanılabilir"** ya da sorun), not **"Öğrenci bir
  sonraki girişte yeni kullanıcı adını yazar; şifresi değişmez."**, düğmeler **"Geri"**, **"Kaydet"**. Hatalar: kullanıcı adı kuralı
  (**"3–20 karakter; küçük harf (Türkçe harf olmadan), rakam ve nokta."**, **"Nokta başta, sonda ya da yan yana olamaz."**, **"Bu
  kullanıcı adı alınmış."**) ve **"Yeni kullanıcı adı şu ankiyle aynı."** Kaydedince ekranın altında "Elif Yılmaz için yeni kullanıcı
  adı: …", işlem kaydına "… kullanıcı adını değiştirdi" (eski → yeni).
- **"Şifre"** satırı: okulun verdiği şifreyi **"Göster"**/**"Gizle"** ya da "Öğrenci kendi şifresini belirledi", sağda **"Şifre ver"**
  ([Şifre işlemleri](sifre-islemleri.md)).
- **"Portal"** satırı: "Öğrencinin gördüğü ekranı aç" ve **"Portalını aç"** ([Öğrencinin portalını açma](ogrenci-portalini-acma.md)).
- **"Başarılar"** satırı: "Belgeli başarı ekle" ve **"Başarı ekle"** ([Başarı ekleme](../basarilar/basari-ekleme.md)).
- Altta **"Kapat"**.
- Eşlenen öğrencide (Eğitim Evi'ndeki hesabıyla T.C. ve doğum tarihi tutup eşlenen) önizleme kullanıcı adının altında **"Eğitim
  Evi'ndeki hesabıyla eşlendi (T.C. ve doğum tarihi). Hesabı okul açmadığı için kullanıcı adını ve şifresini öğrenci kendisi
  değiştirir."** yazar ve "Değiştir" ile "Şifre" satırını göstermez. Bu, kullanıcının 29 Eylül 20:40 kararıyla çelişir: "kurumlar
  öğrencinin şifresini bugünkü gibi değiştirebilir, iki kurumlu hesapta ek kısıt konmaz" (bkz. "Kurallar").
- Önizleme bu pencerede ad, T.C., sınıf, okul no, e-posta, adres, yönetim notu, veli kodu ve veliler bölümlerini göstermiyor; bunları
  kaldıran bir karar yok, bugünkü bölümler sürer.

### Çalışan (ek rolü olan öğretmen)

- Rolünde **"Öğrenci bilgilerini düzenler"** varsa "Hesap" düğmesini görür, pencereyi açar ve bilgileri kaydedersin (hazır **Müdür
  Yardımcısı** şablonunda var). Şifre bölümünü kullanmak ayrıca **"Öğrenci şifresi sıfırlar"** ister (Müdür Yardımcısı şablonunda
  yok; müdür ekleyebilir).
- Öğrencinin **sınıfını değiştirmek** **"Öğrenciyi sınıfa yerleştirir"** ister; rolün belirli sınıflarla daraltıldıysa eski ve yeni
  sınıfın ikisi de kapsamında olmalı: **"Öğrenciyi bu sınıfa yerleştirme yetkin yok"**.
- **Bilinen sorun (kod okumasına göre):** sınıf listesi "Sınıf açar ve siler" yetkisiyle gelir. Bu yetki yoksa açılır listede
  öğrencinin sınıfı yoktur, "— sınıfsız —" seçili görünür; başka bir alanı düzeltip "Bilgileri kaydet"e basınca pencere sınıfı da
  "boş" diye gönderir. Yerleştirme yetkin varsa öğrenci **sessizce sınıfından çıkar**, yoksa her kayıt "Öğrenciyi bu sınıfa
  yerleştirme yetkin yok" der. Müdürde ve Müdür Yardımcısı şablonunda bu sorun çıkmaz.

### Öğrenci

- Pencereyi görmezsin. Kendi bilgilerini **Ayarlar**'da görürsün: "Ad Soyad", "Kullanıcı adı", e-posta, "Okul", doğum tarihi ve
  "Veli kodun (velinle paylaş)". T.C. kimlik no'n salt okunurdur: **"Yalnızca sen ve okul yönetimi görür. Yanlışsa okul yönetimine
  söyle."** ([Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md)).
- Bugün Ayarlar'ın **"Bilgileri güncelle"** kartında adını soyadını, il, ilçe, adres ve doğum tarihini kendin de değiştirebilirsin
  (öğrencide doğum tarihi boş bırakılamaz); okulun açtığı hesapta yalnız T.C. no'yu değiştiremezsin: **"T.C. kimlik numaranı okul
  yönetimi düzenler."**
- Okul bilgini değiştirince sana bildirim gitmez; kullanıcı adın değiştiyse bir sonraki girişte yenisini yazarsın.
- Tasarımda Hesap ayarlarında **"Ad soyad"**, **"T.C. kimlik no"** (yıldızlı), **"Okul ve sınıf"**, **"Okul numarası"** satırları gri
  **"okulun değiştirir"** der; doğum tarihinin yanında düğme yoktur; yalnız **"İl / ilçe"** ve **"Adres"** **"Düzenle"**ye açıktır.
  Yani tasarımda öğrenci adını kendisi değiştiremez (bugün değiştirebiliyor).

### Veli

Pencereyi görmez; çocuğunun bilgisi yanlışsa okula söyler.

## Kurallar ve sınırlar

- **Yetki:** pencereyi açmak ve bilgileri kaydetmek "Öğrenci bilgilerini düzenler" ister; yetkisi olmayan hesabı aramadan
  **"Bu işlem için yetkin yok"** alır (hesabın var olup olmadığını da öğrenmez). Başka okulun öğrencisi: **"Hesap bulunamadı"**.
- **T.C. kimlik no:** kural ve okulda teklik "Öğrenci ekle"deki gibidir ([Öğrenci hesabı açma](ogrenci-hesabi-acma.md)). T.C.'yi
  değiştirirsen ve kullanıcı adı eski T.C. ise kullanıcı adı da yeni T.C. olur. Bugün düzenlemede T.C. silinebilir; kullanıcı adı T.C.
  ise önce kullanıcı adını değiştirmen gerekir: **"Kullanıcı adı T.C. no; T.C. no silinecekse önce kullanıcı adını değiştir"**.
  Başka okulda kayıtlı bir öğrencinin T.C.'si yazılamaz: **"Bu T.C. kimlik no başka bir okulda kayıtlı bir öğrencinin. Öğrenciyi
  okuluna almak için "Öğrenci ekle"den doğum tarihiyle birlikte tek tek ekle"**.
- **Kullanıcı adı:** kutuyu boşaltırsan kullanıcı adı T.C. no olur (T.C. de yoksa **"Kullanıcı adı boş olamaz"**). Kurallar ve
  **"Bu kullanıcı adı okulda alınmış"** açma ile aynı. Kişinin şimdiki kullanıcı adı eski T.C.'si olarak kaldıysa ön yüz onu
  engellemez.
- **E-posta:** kişinin kendi açtığı hesabın e-postasını okul değiştiremez (o e-posta onun şifre kurtarma yoludur): **"Bu hesabı kişi
  kendisi açtı; e-postasını yalnızca kendisi değiştirebilir"**. Bütün sistemde tektir.
- **Doğum tarihi** boşaltılabilir; **okul no** okulda tektir (**"Bu okul numarası başka bir öğrencide"**).
- **Ad ve soyad birlikte gider:** ikisinden biri değişince sunucu ikisini birleştirip kaydeder; iki kelimelik soyadı olanda ilk kelime
  ad kutusunda görünür, değiştirmeden kaydedersen ad aynen kalır.
- **İz:** "Bilgileri kaydet" bugün işlem kaydına yazılmaz ve kimseye bildirim göndermez (şifre, veli bağlama, veli kodu ayrı;
  kendi belgelerinde).
- **Liste yenilenir:** kaydedince arkadaki Öğrenciler listesi yeniden çizilir; sayfanın başına kayar ve arama kutusu boşalır.
- **Kullanıcının kararları (tasarım):** T.C. kimlik no bütün hesaplarda zorunlu olacak (2 Ekim) — düzenlemede boşaltılamayacak;
  kullanıcı adı site genelinde tek olacak (29 Eylül); kurumlar (iki kurumlu öğrencide de) öğrencinin şifresini bugünkü gibi
  değiştirebilecek, değişiklik işlem kaydına ve kişiye bildirim olarak düşecek (29 Eylül 20:40). Önizlemedeki "eşlenen öğrencinin
  kullanıcı adını ve şifresini okul değiştiremez" satırı bu son kararla çelişir.
- **Yönetici ve destek** tasarımda kullanıcı sayfasından aynı işleri (ad, kullanıcı adı, e-posta, şifre) yapar
  ([Hesaba müdahale](../yonetim/hesaba-mudahale.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Öğrenciler listesi](ogrenci-listesi.md) · [Öğrenci hesabı açma](ogrenci-hesabi-acma.md) ·
[Şifre işlemleri](sifre-islemleri.md) · [Veli kodu](veli-kodu.md) · [Veli bağlama](veli-baglama.md) ·
[Öğrencinin portalını açma](ogrenci-portalini-acma.md) · [Öğrenciyi okuldan çıkarma](ogrenciyi-okuldan-cikarma.md).

**İlgili:** [Başarı ekleme](../basarilar/basari-ekleme.md), [Servisçi hesabı](../servis/servisci-hesabi.md),
[Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md), [Giriş bilgileri](../ayarlar/giris-bilgileri.md),
[Sınıf sayfası](../siniflar-dersler/sinif-sayfasi.md) (sınıfa yerleştirme), [Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md),
[Hesaba müdahale](../yonetim/hesaba-mudahale.md), [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) — `hesapDuzenleModal`, `hesapAlanlari`,
  `hesap-bilgi-kaydet` (yalnız değişen alanlar), `hesapHatasi`, `HESAP_HATA_ALANI`, `adBol`;
  [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md) — "Hesap" düğmesi, `velileriYukle`;
  [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — öğrencinin Ayarlar'ı (salt okunur T.C.).
- Sunucu: [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — `GET /api/school/hesap?id=` (T.C. dahil görünüm),
  `POST /api/school/hesap-guncelle`, `yonetilenHesap`, `hesapDogrula`, `hesapGorunumu`; [sunucu/yetki.md](../../sunucu/yetki.md) —
  `ogrenci.duzenle`, `ogrenci.yerlestir` ve sınıf kapsamı.
- Testler: [testler/test-yonetim.md](../../testler/test-yonetim.md) (`hesap?id=` görünümü, başka okulun hesabı),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).

## Sık sorulanlar

- **Öğrencinin adını yanlış yazmışım.** "Hesap" → Ad/Soyad → "Bilgileri kaydet". (Bugün öğrenci de adını kendi Ayarlar'ından
  düzeltebilir; tasarımda ad yalnız okulca değişir.)
- **Kullanıcı adını değiştirdim, öğrenci giremiyor.** Bir sonraki girişte yeni kullanıcı adını yazmalı; şifresi değişmez.
- **Öğrencinin sınıfını buradan değiştirebilir miyim?** Evet ("Sınıf"); sınıf sayfasından da yerleştirilir.
- **Yönetim notunu öğrenci görür mü?** Hayır; yalnız okul yönetimi görür (Excel dışarı aktarımına da girer).
- **Öğrenciyi silmek istiyorum.** Öğrenci hesabı okulca silinmez ([Öğrenciyi okuldan çıkarma](ogrenciyi-okuldan-cikarma.md)).

## Sırada

- Tasarım 1'deki kişi penceresi (kullanıcı adını ayrı pencerede değiştirme, "Şifre ver", "Portalını aç", "Başarı ekle").
- T.C. kimlik no'nun her yerde zorunlu olması (kodu Linux'ta); kullanıcı adının site genelinde tek olması (tek kişi tek hesap işi).
- Sınıf listesini göremeyen kişinin kaydında sınıfın boşalması sorunu (güvenlik denetimi / tam debug).
- Yönetici ve desteğin hesap penceresi (kullanıcı arama işi), Başarılarım.
