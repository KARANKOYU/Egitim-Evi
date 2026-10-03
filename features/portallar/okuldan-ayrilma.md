# Portallar · Bu okuldan ayrıl

**Durum:** Kodda var; tasarımda ek olarak Hesap ayarlarındaki "Okulum" bölümünden açılan onay kutulu pencere, şifreyle (ve
doğrulama uygulaması kuruluysa onun koduyla) yeniden doğrulama ve son müdür değilse müdürün müdürlükten ayrılabilmesi.

Öğretmenin bir okuldaki rolünü kendisi bırakması: o okulun öğretmen listesinden çıkar, hesabı ve öbür portalları durur.

## Ne işe yarar

Kullanıcının kuralı: kişi kendi rolünden çıkabilmeli; öğretmen "bu okuldan ayrıl" diyebilmeli, herkes "hesabımı sil" diyebilmeli
(KVKK'daki silme hakkı). Okuldan ayrılmak hesabını silmez: yalnız o okuldaki rol satırın silinir, Portallarım'dan o okul kalkar.
Verdiğin ödevler ve notlar okulda kalır. Geri dönmek istersen okula yeni kişi kodunu verirsin.

## Nereden açılır

- **Ayarlar → "Portallarım"** kartı → öğretmen satırındaki **"Okuldan ayrıl"** (yalnız öğretmen satırlarında; bulunduğun okulda da
  başka okulda da).

Tasarımda: öğretmen portalındayken Hesap ayarları → **"Okulum"** bölümü → **"Bu okuldan ayrıl"** satırı (değeri okulun adı,
altında portalın adı, ör. "Test Ortaokulu" / "Öğretmen · Matematik"), düğmesi **"Ayrıl"**, ipucu "Hesabın silinmez; yalnız bu
okulun portalı kapanır." Bu bölüm yalnız bulunduğun öğretmen portalının okulu içindir.

## Adım adım

### Öğretmen

1. **Ayarlar**'a gir, **"Portallarım"** kartında ayrılacağın okulun satırında **"Okuldan ayrıl"**a bas.
2. Onay: "Test Ortaokulu okulundan ayrılmak istiyor musun? Okulun öğretmen listesinden çıkarsın; verdiğin ödevler ve notlar okulda
   kalır. Geri dönmek için okula yeni kişi kodunu vermen gerekir."
3. Şu an o okulun portalındaysan ve ekranda bir kez gösterilen şifreler açıksa (giriş bilgisi listesi gibi) önce onlar için sorulur;
   "İptal" dersen hiçbir şey olmaz.
4. Düğme "Bekle..." olur. Sunucu rol satırını siler, işlem kaydına "ogretmen.ayrildi" yazar ve okulun müdürüne bildirim gönderir:
   "Ayşe Kaya okulun öğretmen listesinden ayrıldı." (bildirim Öğretmenler sayfasına götürür).
5. Sonra:
   - **o okulun portalındaysan** oturumun o satırla birlikte kapanır; yetişkin hesabında yeni oturum açılır, hesabının ana sayfası
     gelir (öbür portalların kartlarıyla ya da hiç portalın kalmadıysa "Henüz bir portalın yok") ve ileti: "Test Ortaokulu okulundan
     ayrıldın.";
   - **başka bir portaldaysan** Ayarlar yeniden açılır, satır listeden kalkmıştır, yeşil ileti "Test Ortaokulu okulundan ayrıldın."

Tasarımda:

1. Hesap ayarları → **"Okulum"** → **"Bu okuldan ayrıl"** → **"Ayrıl"**.
2. Pencere **"Bu okuldan ayrıl"**: uyarı kutusunda **"Ayrıldığın okul: Test Ortaokulu"** ve "Derslerin ve sınıfların müdüre döner;
   verdiğin ödevler, girdiğin notlar ve yoklamalar okulda kalır. Bu okulun portalı menünden kalkar. Hesabın silinmez; başka
   okullara katılabilirsin."
3. Onay kutusu **"Anladım, bu okuldan ayrılmak istiyorum"**; işaretlemeden kırmızı **"Okuldan ayrıl"** düğmesi basılamaz. Yanında
   **"Vazgeç"**.
4. "Okuldan ayrıl"dan sonra tam sayfa **"Kimliğini doğrula"** ekranı: "Okuldan ayrılmak için önce şifreni yaz." (doğrulama
   uygulaması kuruluysa "… şifreni ve doğrulama uygulamandaki kodu yaz."); **"Şifre:"**, gerekiyorsa **"Doğrulama kodu:"**,
   **"Doğrula ve devam et"**. Uyarılar: "Şifreni yaz.", "Uygulamadaki 6 haneli kodu yaz." Sol üstte **"← Vazgeç"**: "Vazgeçildi;
   hiçbir şey değişmedi." ([Doğrulama ekranlarından vazgeçme](../giris-hesap/dogrulama-ekranindan-vazgecme.md)).
5. Doğrulayınca portal kalkar, kalan ilk portalın açılır (hiç kalmadıysa portalı olmayan hesabın ekranı) ve ileti: "Test Ortaokulu
   portalından ayrıldın; okul yönetimine bildirim gitti."

### Çalışan

Bugün okula eklenen herkes öğretmen satırıdır; ek görevi olan da "Okuldan ayrıl" ile ayrılır. Çalışan tanımı çalışanın kendi
isteğiyle ayrılmasından ayrıca söz etmez. Öneri: kullanıcının genel kuralı ("kişi kendi rolünden çıkabilmeli") gereği, kodlanınca
aynı yol rolsüz ya da görevli çalışana da açık kalır (Tasarım 1 önizlemesinde ayrı bir çalışan hesabı yok; "Okulum" bölümü
öğretmen portalında görünür). Müdürün çalışanın görevini kaldırması ayrılma değildir: kişi okulda rolsüz çalışan olarak kalır
([Rol atama](../ogretmenler-calisanlar/rol-atama.md)).

### Müdür

Bugün:

1. Ayarlar → "Portallarım"da müdür satırında "Okuldan ayrıl" yoktur; satırın altında "Müdürlüğü bırakmak için sistem yöneticisiyle
   iletişime geç." yazar.
2. Sunucu da müdür rolünün bırakılmasını reddeder: "Okulun müdürlüğünü bırakmak için sistem yöneticisiyle iletişime geç: okul yeni
   müdürü atanmadan sahipsiz kalmasın."
3. Müdürken hesabını da silemezsin: "Bir okulun müdürüsün. Hesabını silmeden önce müdürlüğü devretmek için sistem yöneticisiyle
   iletişime geç." ([Hesabımı sil](../ayarlar/hesabimi-sil.md)).

Tasarımda (kullanıcının 29 Eylül kararları):

- Okulda birden çok müdür olabilir. Müdür **son müdür değilse** kendi isteğiyle müdürlükten ayrılır: o an doğrulama kodu ister;
  kişi **çalışan olarak kalmayı ya da okuldan tamamen çıkmayı** seçer; öbür müdürlere bildirim gider, işlem kaydına yazılır. Bekleyen
  bir "ortak karar" varken hedef son müdür kalırsa karar düşer ([Birden çok müdür](../ogretmenler-calisanlar/birden-cok-mudur.md)).
- **Son müdür** hiçbir yolla çıkarılamaz, ayrılamaz.
- Kişi hesabını **her zaman** silebilir (bugünkü "müdür silemez" engeli kalkar). Son müdür hesabını silerse okul "Müdürü yok" olur;
  yöneticiye ve desteğe bildirim gider, yeni müdürü yönetici ya da destek atar ([Kapalı okulun portalı](kapali-okul.md)).
- Tasarım 1 önizlemesinde müdürün kendini çıkarması için ayrı bir ekran yok; müdürü öbür müdürlerin "ortak kararı" ya da yönetici
  çıkarır.
- Tasarım 1 önizlemesi müdürün "Hesabı sil"inde hâlâ eski kuralı gösterir: "Önce müdürlüğü devret" uyarısı ve "Destek'e yaz".
  Geçerli olan kullanıcının kararıdır (29 Eylül: kişi hesabını her zaman silebilir; yukarıdaki madde); önizleme bu noktada
  karara uymuyor ve HTML işinde düzeltilmeli.

### Öğrenci ve servisçi

Okuldan kendileri ayrılmaz; hesaplarını okul açar ve okul çıkarır ya da siler. Tasarımda öğrenciyi okul çıkarınca o portal "geçmiş"
olur ([Öğrencide birden çok kurum](ogrencide-portallar.md)). Servisçi hesabı okulundur; Tasarım 1'de servisçide "Bu okuldan ayrıl"
yoktur.

### Veli

Veli bir okuldan ayrılmaz, çocuğunu hesabından kaldırır ([Çocuklarım](cocuklarim.md)).

### Yönetici

Müdürü yönetici çıkarır (bugün yönetim panelindeki Müdürler listesinden; okul kapanır) ya da yeni müdür atar
([Müdürler](../yonetim/mudurler.md)). Tasarımda destek de atar ve çıkarır.

## Kurallar ve sınırlar

- **Yalnız kendi rolün:** satır senin yetişkin hesabına bağlı değilse "Bu rol hesabında yok." (404).
- **Onaysız gönderilemez:** onay olmadan gelen istek "Onaylaman gerekiyor." (sunucu).
- **Müdür bırakamaz (bugün):** yukarıdaki ileti; ayrılma yalnız öğretmen satırları için.
- **Ne kalır, ne gider:** okuldaki rol satırın silinir; verdiğin ödevler ve girdiğin notlar okulda kalır. Ayrılan öğretmenin açık
  ödevlerini müdür Ödevler sayfasından sonuçlandırır ([Müdürün ödev görünümü](../odev/mudurun-odev-gorunumu.md)). Yetişkin hesabın,
  kişi kodun ve öbür portalların olduğu gibi durur.
- **Geri dönmek:** okula yeni kişi kodunu verirsin, müdür seni yeniden ekler ([Kodla ekleme](../ogretmenler-calisanlar/kodla-ekleme.md)).
- **Oturum:** bulunduğun okuldan ayrılınca o okulun oturumu kapanır; yeni oturum eskisinin türünü ve açılış anını devralır (süre
  uzamaz).
- **Okulun çıkarması ayrı iş:** müdürün seni okuldan çıkarması da rol satırını siler; sana "Test Ortaokulu seni öğretmen listesinden
  çıkardı." bildirimi gelir ([Okuldan çıkarma](../ogretmenler-calisanlar/okuldan-cikarma.md)).
- **Tasarımda:** ayrılmadan önce şifre (ve kuruluysa doğrulama uygulamasının kodu) sorulur; onay kutusu işaretlenmeden düğme
  çalışmaz.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Portallar ve + Ekle](README.md)):

- [Portallarım](portallarim.md) — "Okuldan ayrıl" düğmesinin durduğu kart.
- [Portal seçme ekranı](portal-secme-ekrani.md) — ayrıldıktan sonra açılan sayfa.
- [Henüz portalı olmayan yetişkin](portalsiz-hesap.md) — son portalından ayrılınca.
- [Kapalı okulun portalı](kapali-okul.md) — müdürsüz kalan okul.

**İlgili:**

- [Hesabımı sil](../ayarlar/hesabimi-sil.md) — bütün rolleri ve hesabı birden silmek.
- [Birden çok müdür](../ogretmenler-calisanlar/birden-cok-mudur.md), [Okuldan çıkarma](../ogretmenler-calisanlar/okuldan-cikarma.md),
  [Rol atama](../ogretmenler-calisanlar/rol-atama.md).
- [Müdürler](../yonetim/mudurler.md) — yöneticinin müdür çıkarması.
- [Önemli işlerde çift doğrulama](../egitim-yili/cift-dogrulama.md), [Doğrulama uygulaması](../giris-hesap/dogrulama-uygulamasi.md).
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) — "ogretmen.ayrildi".

## Kod tarafı

- Ön yüz: [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) — `portalYonetimKarti` ("Okuldan
  ayrıl" yalnız `teacher`), `EYLEMLER['kisilik-ayril']` (onay metni, `tekSeferAyrilabilir`, yeni oturum ya da Ayarlar'a dönüş);
  [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — Ayarlar ve "Hesabımı sil".
- Sunucu: [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) — `POST /api/kisilik/ayril { id, onay: true }` (müdür
  400, işlem kaydı `ogretmen.ayrildi`, müdüre bildirim `#/ogretmenler`, o roldeyse yeni oturum), `POST /api/hesap/sil` (müdür
  silemez); [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `rolSatiriniSil`, `okulunMuduru`.
- Testler: [testler/test-yetiskin.md](../../testler/test-yetiskin.md) — öğretmenin okuldan ayrılıp yetişkin hesabına dönmesi, müdüre
  bildirim, müdürlüğün bırakılamaması, müdürken hesabın silinememesi.

## Sık sorulanlar

- **Ayrılırsam verdiğim ödevler silinir mi?** Hayır, okulda kalır. Açık ödevlerini müdür sonuçlandırır.
- **Yanlışlıkla ayrıldım, geri dönebilir miyim?** Evet: "+ Ekle → Öğretmen"deki kişi kodunu müdüre ver, seni yeniden ekler.
- **Müdürüm, nasıl bırakırım?** Bugün sistem yöneticisiyle iletişime geçersin. Tasarımda okulda başka müdür varsa kendin ayrılırsın.
- **Hesabım da silinir mi?** Hayır. Yalnız o okuldaki rolün gider; hesabını silmek için Ayarlar → "Hesabımı sil".

## Sırada

- Paneller (iş 5) ve çalışan olarak ekleme (iş 2): birden çok müdür, son müdür değilse müdürün ayrılması (çalışan olarak kal ya da
  tamamen çık), ortak karar, "Müdürü yok".
- Paneller (iş 5, kullanıcının 29 Eylül kararı): kişi hesabını her zaman silebilir; son müdür silerse okul "Müdürü yok" olur.
- Yıl geçişi (iş 9): önemli işlerde çift doğrulama (ayrılmadan önce şifre/kod).
- HTML (Tasarım 1) → kod: Hesap ayarlarında "Okulum" bölümü, onay kutulu pencere.
