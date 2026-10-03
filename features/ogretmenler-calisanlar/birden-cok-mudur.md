# Öğretmenler ve çalışanlar · Birden çok müdür ve müdürlükten ayrılma

**Durum:** Tasarlandı — henüz kodda yok

Bir okulun aynı anda birden çok, eşit ve tam yetkili müdürü olması; müdürlerin nasıl eklendiği, nasıl ayrıldığı ve okulun hiçbir
zaman müdürsüz kalmaması kuralı.

## Ne işe yarar

Gerçek okullarda müdürlük el değiştirir, bazen iki kişi birlikte yürütür. Kullanıcı 27 Eylül'de birden çok müdürü onayladı; 29 Eylül
kararlarıyla kurallar netleşti:

- Okulda birden çok müdür olabilir; **hepsi eşit ve tam yetkilidir**. Okulun müdürüne giden her bildirim hepsine gider.
- Müdür, bir çalışanı onaysız **"Müdür yap"** ile müdür yapar ([Müdür yapma](mudur-yapma.md)); yönetici ve destek de kişi koduyla
  müdür ekler.
- Bir müdürü çıkarmak ya **yöneticinin/desteğin** işidir ya da **müdürlerin ortak kararı** ([Ortak karar](ortak-karar.md)).
- Müdür, **son müdür değilse** kendi isteğiyle ayrılabilir (29 Eylül 19:00, mantık denetimi 16).
- **Son müdür** hiçbir yolla çıkarılamaz, ayrılamaz.
- Kişi hesabını **her zaman** silebilir (KVKK silme hakkı); son müdür silerse okul **"Müdürü yok"** olur, yeni müdürü yönetici ya da
  destek atar (29 Eylül 20:35, mantık denetimi 28).

**Bugün kodda:** her okulun tek müdürü vardır. Okulu ve müdürünü yönetici açar ([Okul açma](../yonetim/okul-acma.md)); okul zaten
kayıtlıysa ikinci müdür eklenemez ("Bu okul zaten kayıtlı ve müdürü var."). Müdür müdürlüğü bırakamaz, müdürken hesabını da silemez;
müdürü yalnız yönetici kaldırır ve okul kapanır (aşağıda).

## Nereden açılır

Tasarımda:

- **"Çalışanlar"** sayfasının en üstündeki **"Müdürler"** bölümü ve altındaki **"Bekleyen ortak kararlar"**
  ([Öğretmenler ve çalışanlar listesi](liste.md)).
- Yönetici ve destek: **/duzenle/okul/<okulun-adresi>** sayfasındaki **"Müdürler"** alanı; okul gezgininde müdürsüz okulun
  **"Müdürü yok"** rozeti ve yanındaki **"Müdür ata"** ([Okul ekle / düzenle](../yonetim/okul-ekle-duzenle.md),
  [Okul gezgini](../yonetim/okul-gezgini.md)).

Bugün: yönetim panelinin **"Müdürler"** sayfası (yalnız yönetici; [Müdürler](../yonetim/mudurler.md)).

## Adım adım

### Müdür

Tasarımda (Tasarım 1 önizlemesi):

1. **"Çalışanlar"**ı aç. En üstte **"Müdürler · 3"** ve yanında "bütün yetkiler".
2. Her müdür bir satır: adı (kendi satırında **"sen"** etiketi), altında "Müdür · göreve başlama: 1 Eylül 2020" ya da "Müdür yap" ile
   atanmışsa **"Müdür yap" ile eklendi**.
3. Öbür müdürlerin satırında **"Müdürlükten çıkar"** (kendi satırında ve okulda tek müdür varken yok); o müdür için bekleyen karar
   varsa düğme yerine **"Ortak karar bekliyor"** etiketi ([Ortak karar](ortak-karar.md)).
4. Bölümün altındaki not: "Bir müdürü çıkarmak ortak karardır: isteyen müdür ve bir başka müdür onaylar. Son müdür çıkarılamaz."
5. Yeni müdür eklemek: Çalışanlar listesinde kişinin penceresinden **"Müdür yap"** ([Müdür yapma](mudur-yapma.md)).

Kendi isteğinle ayrılmak (tanım; Tasarım 1 önizlemesinde ekranı yok):

1. Son müdür değilsen müdürlükten ayrılırsın; o an doğrulama kodu istenir ([Önemli işlerde çift doğrulama](../egitim-yili/cift-dogrulama.md)).
2. Seçersin: **okulda çalışan olarak kal** ya da **okuldan tamamen çık**.
3. Öbür müdürlere bildirim gider, işlem kaydına yazılır.
4. Bekleyen bir ortak karar varken senin ayrılmanla kararın hedefi okulun son müdürü kalırsa karar düşer.

Ayrılma düğmesinin yeri ve metinleri tanımda yazılı değil (açık nokta). Öğretmenin "Bu okuldan ayrıl" yolu için:
[Bu okuldan ayrıl](../portallar/okuldan-ayrilma.md).

Bugün (kodda):

1. Müdür Ayarlar → "Portallarım"da müdür satırında "Okuldan ayrıl" görmez; satırın altında "Müdürlüğü bırakmak için sistem
   yöneticisiyle iletişime geç." yazar.
2. Sunucu da reddeder: "Okulun müdürlüğünü bırakmak için sistem yöneticisiyle iletişime geç: okul yeni müdürü atanmadan sahipsiz
   kalmasın."
3. Müdürken hesabını silemezsin: "Bir okulun müdürüsün. Hesabını silmeden önce müdürlüğü devretmek için sistem yöneticisiyle
   iletişime geç." ([Hesabımı sil](../ayarlar/hesabimi-sil.md)). Tasarımda bu engel kalkar.

### Yönetici

Bugün (kodda):

1. Yönetim panelinde **"Müdürler"**: başlık "MÜDÜRLER — N müdür hesabı kayıtlı."; her satırda ad, kullanıcı adı · e-posta, okul · il /
   ilçe, "12 öğretmen · 240 öğrenci", durum etiketi (**"Etkin"**, **"Giremiyor"**, **"Kapalı"**) ve **"Hesabı sil"**.
2. **"Hesabı sil"** onayı: "Ayşe Kaya hesabı silinsin mi? (Test Ortaokulu) — Okul kapanır, kimse giremez. Öğretmen ve öğrenci
   hesapları silinmez; Okullar > Okul aç ile okula yeni müdür atayabilirsin."
3. Kişinin yetişkin hesabı durur, yalnız müdürlüğü gider (müdürlük oturumları ve o roldeki bildirimleri de silinir). Bu silme
   için kişiye bildirim gitmez, işlem kaydına da yazılmaz (kod okumasına göre). Okul **"Okullar"** listesinde **"Müdür
   bekliyor"** olur ve kimse giremez (okulun öğretmenleri "Bu okul şu an kapalı; sistem yöneticisi yeni müdürünü atayınca açılır." görür;
   [Kapalı okulun portalı](../portallar/kapali-okul.md)).
4. Yeni müdür: **"Okullar → Okul aç"** ile aynı okul seçilir; sahipsiz okul yeni açılmaz, devralınır (kişinin o okulda başka rolü
   varsa önce o rol çıkarılmalıdır).

Tasarımda:

1. /duzenle/okul/yeni: **müdürler** alanında kişi kodu → **"Bul"** → ad ve kısaltılmış e-posta → listeye; **birden çok müdür**
   eklenebilir, **×** ile çıkarılır; en az bir müdür şarttır. Her müdüre bildirim, kodları yenilenir.
2. /duzenle/okul/<okul>: müdür ekle (kişi koduyla) ya da çıkar — **son müdür çıkarılamaz**. Yönetici ve destek müdürü ortak karar
   beklemeden doğrudan çıkarır.
3. Müdürsüz okul gezginde ve listede **"Müdürü yok"** rozetiyle, yanında **"Müdür ata"** (→ /duzenle, kişi koduyla). "Müdür bekliyor",
   "Giremiyor", "onay" sözleri müdür ve okul için hiçbir ekranda ve iletide kalmaz; eski bekleyen satırlar göçle "müdürü yok"
   durumuna çevrilir (öneri).
4. "Müdür yap" ile atanan müdürü ilk 7 günde tek tıkla geri alabilir ([Müdür yapma](mudur-yapma.md)).
5. Son müdür hesabını silince yöneticiye ve desteğe bildirim gelir.

### Destek

Tasarımda: yöneticiyle aynı okul işlerini yapar (okul gezgini, okul aç, müdür ekle / çıkar, adres) ama yönetici hesaplarına
dokunamaz ([Destek ekibi](../destek/destek-ekibi.md), [Paneller](../yonetim/paneller.md)). Çıkarılan müdürün itirazı destek
talebiyle gelir ([Destek sayfası](../destek/destek-sayfasi.md)).

### Çalışan

Tasarımda: müdürler arasında yetki farkı olmadığı için her müdür öbürüyle aynı ekranı görür. "Müdür yap", "Müdürlükten çıkar" ve
ortak kararı onaylamak yalnız müdürlerindir; role verilemez. Çalışanlar sayfasını "Okula çalışan ekler" yetkisiyle açan (müdür
olmayan) bir çalışanın "Müdürler" ve "Bekleyen ortak kararlar" bölümlerini görüp görmeyeceği tanımda yazılı değil; Tasarım 1 yalnız
müdürün görünümünü gösterir (açık nokta).

## Kurallar ve sınırlar

- **Eşitlik:** bütün müdürler tam yetkilidir; "okulun müdürü" diyen her yer (bildirim hedefleri, nakil bildirimleri, rol verme
  kuralları, yönetim panelindeki listeler, işlem kaydı) birden çok müdüre göre çalışır.
- **Son müdür:** panelden çıkarılamaz, ortak kararla çıkarılamaz, kendisi ayrılamaz. Okul yalnız son müdür hesabını silerse "Müdürü
  yok" olur.
- **Hesap silme:** kişi hesabını her zaman siler (bugünkü "müdür silemez" engeli kalkar).
- **Ortak karar:** müdürler birbirini tek başına çıkaramaz ([Ortak karar](ortak-karar.md)).
- **Doğrulama:** müdür yapma, ortak kararı onaylama ve kendi isteğiyle ayrılma o an doğrulama kodu ister.
- **7 gün:** müdürlüğü 7 günden yeni olan ortak karar başlatamaz ve onaylayamaz.
- **10 okul:** bir hesap en çok 10 okulda rol alır (müdürlük dahil).
- **Bugün:** tek müdür; ayrılma ve hesap silme yönetici üzerinden; yöneticinin "Hesabı sil"i okulu "Müdür bekliyor"a çeker
  (bildirimsiz ve işlem kaydı yazılmadan).

## Kardeşler ve ilgili

**Kardeşler:** [Müdür yapma](mudur-yapma.md) · [Ortak karar](ortak-karar.md) · [Öğretmenler ve çalışanlar listesi](liste.md) ·
[Okuldan çıkarma](okuldan-cikarma.md).

**İlgili:**

- [Bu okuldan ayrıl](../portallar/okuldan-ayrilma.md), [Kapalı okulun portalı](../portallar/kapali-okul.md),
  [Hesabımı sil](../ayarlar/hesabimi-sil.md).
- [Okul açma](../yonetim/okul-acma.md), [Müdürler](../yonetim/mudurler.md), [Okul ekle / düzenle](../yonetim/okul-ekle-duzenle.md),
  [Okul gezgini](../yonetim/okul-gezgini.md), [Paneller](../yonetim/paneller.md).
- [Destek ekibi](../destek/destek-ekibi.md).
- [Önemli işlerde çift doğrulama](../egitim-yili/cift-dogrulama.md).
- [E-posta ekleme önerisi](../ayarlar/eposta-ekleme-onerisi.md) — e-postası olmayan müdüre şerit.

## Kod tarafı

Henüz kodda yok. Bugünkü davranışın yerleri:

- [sunucu/bolumler/yonetici-okul.md](../../sunucu/bolumler/yonetici-okul.md) — okul açma, tek müdür, sahipsiz okulu devralma.
- [sunucu/bolumler/yonetici.md](../../sunucu/bolumler/yonetici.md) — `principal-delete` (okul `pending`, müdürün rol satırı silinir),
  `principals`; [public/js/yonetim/09-yonetici.md](../../public/js/yonetim/09-yonetici.md) — "Müdürler" sayfası, "Etkin / Giremiyor /
  Kapalı", "Müdür bekliyor".
- [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) — `kisilik/ayril` (müdür bırakamaz), `hesap/sil` (müdür silemez),
  kapalı okula geçişin reddi.
- [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `okulunMuduru` (tek müdür varsayımı);
  [sunucu/veri/depo/okullar.md](../../sunucu/veri/depo/okullar.md) — okul durumu.
- Testler: [testler/test-yetiskin.md](../../testler/test-yetiskin.md) (müdürlüğün bırakılamaması, müdürken hesabın silinememesi),
  [testler/test-yonetim.md](../../testler/test-yonetim.md) (okul açma).

## Sık sorulanlar

- **Okulumuzda iki müdür olabilir mi?** Tasarımda evet; hepsi eşit. Bugün tek müdür var.
- **Müdür yardımcısı ikinci müdür mü?** Hayır; o bir özel roldür. İkinci müdür için "Müdür yap".
- **Okulun tek müdürüyüm ve hesabımı silmek istiyorum.** Tasarımda silebilirsin; okul "Müdürü yok" olur ve yeni müdürü yönetici ya da
  destek atar. Tasarım 1'in SSS cevabı ("önce bir çalışanı Müdür yap ile müdür yapmalısın") ve "Hesabı sil" ekranındaki "Önce
  müdürlüğü devret" uyarısı bu karara uymuyor; önizleme düzeltilecek.
- **Bir müdürü nasıl çıkarırım?** Ortak kararla ya da yöneticiye/desteğe başvurarak ([Ortak karar](ortak-karar.md)).

## Sırada

- Paneller (iş 5): birden çok müdür, /duzenle sayfalarında müdürler, "Müdürü yok" ve "Müdür ata", "bekliyor/Giremiyor" kalıntılarının
  temizliği, ortak karar, son müdür kuralı, müdürün kendi isteğiyle ayrılması, hesabın her zaman silinebilmesi.
- Çalışan olarak ekleme (iş 2): "Müdür yap".
- Yıl geçişi (iş 9): önemli işlerde çift doğrulama.
