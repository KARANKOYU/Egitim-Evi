# Öğretmenler ve çalışanlar · Kodla ekleme

**Durum:** Kodda var; tasarımda ek olarak kişinin öğretmen değil "çalışan" olarak (rolsüz) eklenmesi, "+ Ekle → Çalışan",
"Kişi koduyla ekle" penceresinde yazarken canlı denetim ("Bul" düğmesi yerine) ve yeni bildirim metni.

Okula yeni bir öğretmeni (tasarımda çalışanı) onun 16 karakterlik kişi koduyla eklemek: kişi kodunu müdüre verir, müdür kodu
girer, kısaltılmış adı görüp ekler.

## Ne işe yarar

Eğitim Evi'nde öğretmen okula kendisi başvurmaz, müdür de onun adına hesap açmaz: herkes kendi hesabını açar (kayıtta rol, sınıf
ya da branş seçilmez), sonra okuluna **kişi kodunu** verir. Müdür kodu girince kişinin okuldaki rol satırı açılır ve okul kişinin
menüsünde **Portallarım** altında belirir. Onay bekleme yoktur (kullanıcı 29 Eylül: "onay bekleme değil müdür atayarak").

Kod tek kullanımlıktır: kullanıldığı anda yenilenir; başkası eline geçirse de ikinci kez kullanamaz. Müdür eklemeden önce kişinin
tam adını değil yalnız kısaltılmış hâlini ("Ay** Ka**") görür: böylece kod, ad öğrenme aracına dönmez; müdür adı kişiyle yüz yüze
ya da telefonda doğrular.

Tasarımda (kullanıcı 27 Eylül: "orada öğretmen olarak değil çalışan olarak ekle; müdür kodu girer, ona rol — öğretmen, custom,
coder — atamadığı sürece rolsüz gözükür"): kodla eklenen kişi **öğretmen değil, rolsüz çalışan** olur; görevini müdür sonra verir
([Rol atama](rol-atama.md)). Müdür atamanın da tek yolu budur: kişi önce kodla çalışan olarak eklenir, sonra satırından "Müdür
yap" denir ([Müdür yapma](mudur-yapma.md)).

## Nereden açılır

- **Kodu veren (öğretmen):** sağ üstteki **"+ Ekle"** → **"Öğretmen"** ("Kişi kodunu okulunun müdürüne ver; seni okula
  ekler.") → pencere **"Öğretmen olarak katıl"** ([+ Ekle penceresi](../portallar/ekle-penceresi.md),
  [Kişi kodu](../portallar/kisi-kodu.md)).
- **Kodu giren (müdür):** **"Öğretmenler"** sayfasındaki **"Öğretmen ekle"** kartında **"Kodla ekle"** → pencere
  **"Öğretmen ekle"** ([Öğretmenler ve çalışanlar listesi](liste.md)).

Tasarımda:

- Kodu veren: **"+ Ekle"** → pencere **"Yeni oturum ekle"** → **"Çalışan"** ("Kişi kodunu okulunun müdürüne ver; seni okula
  çalışan olarak ekler.") → **"Okuluna çalışan olarak katıl"**. Kod ayrıca Hesap ayarlarındaki **"Kişi kodun"** bölümünde durur
  ("Bir okul seni çalışan olarak eklerken ya da yönetici okulunu açarken bu kodu ister.").
- Kodu giren: **"Çalışanlar"** sayfasının sağ üstündeki **"Kişi koduyla ekle"** → pencere **"Kişi koduyla ekle"**.

## Adım adım

### Öğretmen (kodu veren)

1. Kendi Eğitim Evi hesabınla gir (hesabın yoksa önce kaydol: [Kayıt olma](../giris-hesap/kayit-olma.md)).
2. Sağ üstteki **"+ Ekle"** → **"Öğretmen"**.
3. Pencere **"Öğretmen olarak katıl"**: "Bu kişi kodunu okulunun müdürüne ver. Müdür Öğretmenler > Kodla ekle ekranında kodu
   girince okulun sol üstteki menüde görünür." Altında büyük yazıyla kodun (`Ab3#-kQx9-+mPt-7?zR` biçiminde, dörder dörder
   tireli), **"Kopyala"** ve **"Yeni kod üret"**. Not: "Kod bir kez kullanılır; müdür seni ekleyince yenilenir. Kodu yanlış kişiye
   verdiysen "Yeni kod üret" ile eskisini geçersiz kıl."
4. Kodu müdürüne ilet (yazarak, söyleyerek, mesajla). Büyük/küçük harf fark eder.
5. Müdür seni ekleyince bildirim gelir: **"Test Ortaokulu seni öğretmen olarak ekledi. Sol üstteki menüden okuluna
   geçebilirsin."** Portallarım'da **"Öğretmen · Test Ortaokulu"** belirir ([Portallarım](../portallar/portallarim.md),
   [Portala geçiş](../portallar/portala-gecis.md)). Kodun aynı anda yenilenmiştir.

Başka okulda da çalışıyorsan aynı hesabı kullanırsın: her okul ayrı bir portal olur (en çok 10 okul).

Tasarımda:

1. **"+ Ekle"** → **"Yeni oturum ekle"** → **"Çalışan"**.
2. Pencere **"Okuluna çalışan olarak katıl"**: "Kişi kodunu okulunun müdürüne ver; seni okula çalışan olarak ekler. Görevini
   (öğretmen, müdür yardımcısı...) müdür verir. Eklenince okuldaki oturumun sol menüde **Oturumlarım** altında görünür." Kod kutusu
   ve **"Kopyala"**; not: "Kod 16 karakterdir: büyük/küçük harf, rakam ve ! ? # * + = olabilir. Bir kez kullanılır; kullanılınca
   yenilenir. Herkese açık yerlerde paylaşma." Düğmeler **"Geri"** ve **"Tamam"**.
3. Eklenince bildirim: **"Test Ortaokulu okuluna çalışan olarak eklendin. Görevini okul yönetimi verecek."** Okulun oturumu
   "Çalışan · Test Ortaokulu" adıyla açılır; müdür görev verene kadar içi boştur ([Rolsüz çalışan](rolsuz-calisan.md)).
   (3 Ekim hesap/oturum kararı: tasarımda "portal" sözü "oturum" olur.)

### Müdür (kodu giren)

1. **"Öğretmenler"** sayfasında **"Öğretmen ekle"** kartındaki **"Kodla ekle"**ye bas.
2. Pencere **"Öğretmen ekle"**: "Öğretmenden kişi kodunu iste. Kodu Eğitim Evi'nde + Ekle > Öğretmen ekranında görür. Kod bir kez
   kullanılır."
3. **"Öğretmenin kişi kodu"** kutusuna kodu yaz ya da yapıştır: tireler kendiliğinden gelir; tireli, tiresiz ya da boşluklu
   yapıştırmak da olur. Kutunun altında: "Büyük/küçük harfe dikkat et; tireler kendiliğinden gelir."
4. **"Bul"**a bas (ya da Enter). Düğme "Aranıyor..." olur.
5. Kod bir kişiye aitse altta **"Bu kodun sahibi"**, kısaltılmış ad (ör. **"Ay** Ka**"**) ve "Adın bir kısmı gizli. Öğretmenin
   adıyla uyuşuyorsa ekle." Kişi okulunda zaten varsa yalnız bir bilgi iletisi: "Ay** Ka** okulunda zaten var."
6. İstersen **"Branş (isteğe bağlı)"**den branş seç ("— belirtme —", Matematik, Türkçe, İngilizce, Din Kültürü ve Ahlak Bilgisi,
   Sosyal Bilgiler, Fen Bilimleri, Müzik, Resim, Beden Eğitimi).
7. **"Okula ekle"**ye bas ("Ekleniyor..."). Pencere kapanır, liste yenilenir ve yeşil ileti: **"Ayşe Kaya okula öğretmen olarak
   eklendi."** Kişi okulun hazır **Öğretmen** rolünün yetkileriyle hemen çalışmaya başlar; ek görev vermek ayrı iştir
   ([Rol atama](rol-atama.md)).
8. Vazgeçmek için **"Vazgeç"**.

Tasarımda:

1. **"Çalışanlar"** → **"Kişi koduyla ekle"**.
2. Pencere **"Kişi koduyla ekle"**: **"Kişi kodu"** kutusu (yer tutucu `Ab3#-kQx9-+mPt-7?zR`). "Bul" düğmesi yoktur; yazarken
   kutunun yanında durum çıkar:
   - eksikken "12 / 16 karakter";
   - biçim yanlışsa "Kod 16 karakter: harf (büyük ya da küçük), rakam ve ! ? # * + = olabilir; dörder dörder tireyle
     (ör. Ab3#-kQx9-+mPt-7?zR).";
   - kendi kodunsa "Bu senin kişi kodun.";
   - bir öğrencinin veli koduysa "Bu bir öğrencinin veli kodu; çalışan eklemek için kişi kodu gerekir.";
   - kişi okulunda zaten varsa "Bu kişi zaten okulunda: Ayşe Kaya.";
   - doğruysa **"Kod doğru"** ve altında **"Ay** Ka** — bu kişi mi?"**, küçük not "Kişinin adının yalnız ilk harfleri görünür;
     ekleyince tam adı okul listende çıkar."
3. Pencerenin notu: "Kişi kodunu kişi kendi hesabındaki "Kişi kodun" bölümünden alır ve sana verir. Eklenen kişi, sen rol atayana
   kadar okulda rolsüz görünür." **Branş alanı yoktur** (branş görev verilirken seçilir; [Rol atama](rol-atama.md)).
4. **"Ekle"** düğmesi kod doğru olana kadar soluktur; geçerli kod yokken basılırsa "Önce geçerli bir kişi kodu yaz." Yanında
   **"Vazgeç"**.
5. Ekleyince: "Ayşe Kaya okula eklendi; rol atayana kadar rolsüz görünür." Kişi listenin en üstünde **"Rolsüz"** etiketiyle
   durur; işlem kaydına "kişi koduyla çalışan ekledi — Ayşe Kaya · rolsüz" düşer.

### Çalışan

Bugün: rolünde **"Okula öğretmen ekler, başvuru onaylar"** yetkisi olan öğretmen müdür gibi ekler (hazır şablonlarda bu yetki açık
gelmez; müdür kendi rolüne ekler). Tasarımda yetkinin adı **"Okula çalışan ekler"** olur; öğretmen olmayan bir çalışana da
verilebilir. Rolsüz çalışan kimseyi ekleyemez.

Kendi kodunu vermek için çalışan da öğretmen gibi **"+ Ekle"**yi kullanır (yukarıda).

### Ziyaretçi

Giriş yapmamış biri açılış sayfasının SSS'inde "Öğretmen okula nasıl katılır?" sorusunu okur (tasarımda "Öğretmen ya da başka bir
çalışan okula nasıl katılır?": "Kendi hesabını açar, + Ekle → Çalışan'da gördüğü kişi kodunu okulun müdürüne verir. Müdür
Çalışanlar → Kodla ekle ekranında kodu girer, adın kısaltılmış hâlini görüp ekler…") ([SSS](../acilis-sayfasi/sss.md)).

## Kurallar ve sınırlar

- **Yetki:** "Okula öğretmen ekler, başvuru onaylar" (müdürde var). Yoksa "Bu işlem için yetkin yok" (403).
- **Kod denetimi (tarayıcıda):** boşsa "Kişi kodunu yaz.", 16 karakter değilse "Kişi kodu 16 karakterdir." Kod büyük/küçük harfe
  duyarlıdır; boşluklar ve tireler silinir. Kod adrese ve sunucu günlüklerine düşmesin diye istek gövdede gider.
- **Kod yoksa:** "Bu kodla bir hesap bulunamadı. Kodu öğretmenden yeniden iste; kod bir kez kullanılınca yenilenir." (404).
- **Deneme sınırları:** kişi başına dakikada 30 istek ("Çok fazla deneme. Biraz bekle."); aynı bağlantıdan saatte 30 yanlış kod
  ("Çok fazla yanlış kod denendi. Bir saat sonra tekrar dene."). "Bul" ve "Okula ekle" birlikte sayılır.
- **Kodu yenileme (kodu veren):** "Yeni kod üret" önce sorar: "Yeni kod üretilsin mi? Eski kod artık çalışmaz." Hesap başına saatte
  en çok 10 kez: "Kodu çok sık yeniledin. Biraz sonra dene."
- **Zaten okulda:** "Bu kişi okulunda zaten öğretmen." ya da "Bu kişi okulunda zaten müdür." Bir kişinin bir okulda tek rolü olur.
- **10 okul:** bir hesap en çok 10 okulda rol alabilir; dolunca "Bu kişi en fazla sayıda okulda rol almış."
- **Branş:** yalnız listedeki 9 dersten biri; başka bir şey gelirse ""X" branş listesinde yok".
- **Aynı anda iki ekleme:** kodun harcanması ve rol satırının yazılması tek işlemdir. Kod bu arada kullanıldıysa "Bu kod az önce
  kullanıldı. Öğretmenden yeni kodunu iste."; kişi bu arada okula eklendiyse "Bu kişi okulunda zaten öğretmen."; kullanıcı adı bu
  arada alındıysa "Öğretmenin kullanıcı adı bu arada okulda başka birine verildi. Yeniden dene." Bu durumlarda hiçbir şey yazılmaz.
- **Rol satırı:** kişinin okuldaki kullanıcı adı yetişkin hesabındaki adıdır; okulda alınmışsa sonuna sayı eklenir. Okulun satırında
  e-posta ve şifre yoktur (giriş yetişkin hesabıyla yapılır); aydınlatma metni onayı kişiden kopyalanır.
- **Dosyayla eklenmez:** Excel aktarımında öğretmen sayfası kabul edilmez: "Öğretmenler dosyayla eklenmez: her öğretmen kendi
  hesabını açar, kişi kodunu verir; Öğretmenler sayfasında "Kodla ekle" ile kodu girersin." ([İçe aktarım](../excel-aktarim/ice-aktarim.md)).
  Okul öğretmen hesabı da açamaz: "Öğretmen hesabını öğretmen kendisi açar ve sana kişi kodunu verir. Öğretmenler sayfasında
  "Kodla ekle" ile kodu gir."
- **Sunucu ek rol de alabilir:** ekleme isteği isteğe bağlı bir ek rol taşıyabilir (yalnız "Rol oluşturur ve düzenler" yetkisiyle;
  yoksa "Rol vermek için "rol yönetir" yetkisi gerekir"); bugünkü pencere bunu göndermez.
- **Kayıtlar:** kişiye bildirim gider, işlem kaydına **"Öğretmen kişi koduyla okula eklendi"** (kişinin adıyla) yazılır
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Tasarımda:** eklenen kişi rolsüzdür; okulun duyuruları, Mesajlar, Takvim, Hatırlatıcılar ve Ayarlar dışında hiçbir bölüme
  giremez ([Rolsüz çalışan](rolsuz-calisan.md)); müdür ona görev verene kadar ders programına, ödeve, sınava, yoklamaya atanamaz. Kişi kodunun kuralları değişmez ([Kişi kodu](../portallar/kisi-kodu.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Öğretmenler ve çalışanlar listesi](liste.md) · [Rolsüz çalışan](rolsuz-calisan.md) · [Rol atama](rol-atama.md) ·
[Müdür yapma](mudur-yapma.md) · [Hesap penceresi](hesap-penceresi.md) · [Onay bekleyenler](onay-bekleyenler.md) (eski düzen).

**İlgili:**

- [Kişi kodu](../portallar/kisi-kodu.md), [+ Ekle penceresi](../portallar/ekle-penceresi.md), [Portallarım](../portallar/portallarim.md),
  [Bu okuldan ayrıl](../portallar/okuldan-ayrilma.md) — geri dönmek için yeni kodla yeniden eklenir.
- [Kayıt olma](../giris-hesap/kayit-olma.md) — rol seçilmeyen tek tür hesap.
- [Bildirim metinleri](../bildirim/bildirim-metinleri.md), [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).
- [Okul açma](../yonetim/okul-acma.md) — aynı kişi kodunun müdür yapmak için yöneticiye verilmesi.
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) — kısaltılmış ad.
- [SSS](../acilis-sayfasi/sss.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) — `EYLEMLER['ogretmen-kodla']`
  (pencere), `ogretmen-kod-bul` (`POST /api/school/ogretmen-bul`), `ogretmen-kod-ekle` (`POST /api/school/ogretmen-ekle
  { kod, brans }`); [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md) — "Öğretmen ekle" kartı;
  [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) — "+ Ekle → Öğretmen" paneli, "Yeni kod üret";
  [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — `kisiKoduGirdisi`, `kisiKoduDenetle`, `kisiKoduKutusu`.
- Sunucu: [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — `ogretmen-bul` / `ogretmen-ekle` (maskeli ad, sınırlar,
  tek işlemde kod harcama ve rol satırı, bildirim, işlem kaydı `ogretmen.eklendi`);
  [sunucu/bolumler/kisi-aktarim.md](../../sunucu/bolumler/kisi-aktarim.md) — öğretmenin dosyayla eklenmemesi;
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `eslesmeKoduyla`, `eslesmeKoduTuket`, `okuldaBosAd`,
  `rolleri`; [sunucu/ortak.md](../../sunucu/ortak.md) — `kisiKoduSade`, branş listesi.
- Testler: [testler/test-yetiskin.md](../../testler/test-yetiskin.md), [testler/test-kisi-kodu.md](../../testler/test-kisi-kodu.md)
  (tek kullanımlık kod, maskeli ad, yetkisiz öğretmenin arayamaması), [testler/test-cakisma.md](../../testler/test-cakisma.md) (aynı
  kodla eş zamanlı iki ekleme tek satır açar), [testler/test-yonetim.md](../../testler/test-yonetim.md) (okul öğretmen hesabı açamaz).

## Sık sorulanlar

- **Müdür kodu girdi, "Bu kodla bir hesap bulunamadı" diyor.** Kod büyük/küçük harfe duyarlıdır; ya da kod kullanılıp yenilenmiştir.
  "+ Ekle → Öğretmen"den güncel kodu yeniden ver.
- **Kodumu yanlış kişiye verdim.** "+ Ekle → Öğretmen" → "Yeni kod üret": eski kod hemen geçersiz olur.
- **Müdür neden tam adımı görmüyor?** Kod ad öğrenme aracına dönmesin diye eklemeden önce yalnız ilk harfler görünür; ekleyince
  tam adın okulun listesinde çıkar.
- **İki okulda öğretmenim, iki hesap mı açmalıyım?** Hayır; aynı hesabın kodunu iki müdüre ayrı ayrı verirsin (kod her kullanımda
  yenilenir), iki okul Portallarım'da ayrı durur.

## Sırada

- Çalışan olarak ekleme (iş 2): "+ Ekle → Çalışan", kodla eklenen kişinin rolsüz çalışan olması, "Kişi koduyla ekle" penceresi,
  yeni bildirim metni, "Okula çalışan ekler" yetkisi; aynı metinler Android uygulamasının Ekle sayfasında, SSS'te ve KILAVUZ'da da
  değişir (çalışan tanımı).
- Tek kişi tek hesap ve portallar (iş 19): hesap/oturum dilinde "portal" yerine "oturum".
