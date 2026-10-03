# KVKK ve gizlilik · Onay ve yeniden onay

**Durum:** Kodda var; tasarımda ek olarak kayıt formundaki metinlerin pencerede açılması ve hata iletisinin "…aydınlatma
metnini ve kullanım koşullarını onayla." olması, Hesap ayarlarında onayladığın sürümün ve tarihin görünmesi, T.C.'si olmayan
eski yetişkin hesabından aynı adımda T.C. istenmesi, eğitmen hesabının da onay vermesi (destek için tanımda açık), tahta
hesabına onay sorulmaması ve eklentiler için "okul eki" onayı önerisi.

Aydınlatma metniyle kullanım koşullarının onaylanması: kendisi kaydolan kişi kayıt formundaki tek kutuyla, okulun açtığı hesap ilk
girişte, herkes de metnin sürümü artınca bir sonraki girişte onaylar; onaylamadan uygulama kullanılamaz.

## Ne işe yarar

KVKK'nın 10. maddesi kişinin önceden bilgilendirilmesini ister; açık rızaya dayanan işlemlerde de rızanın ispatı gerekir. Eğitim
Evi her hesap için üç şeyi saklar: onay verildi mi, **hangi sürüm** onaylandı, **ne zaman**. Metin değişince eski onay geçersiz
sayılır ve kişi yeni metni görüp onaylamadan devam edemez. Kullanıcının kuralları: 29 Ağustos'ta kayda "kvkk metnini okudum
anladım" kutusu; 28 Eylül'de "KVKK ve onaylarda eksik metin olmasın" (her onay kutusu metnin tamamını ya da bağlantısını gösterir;
onay kaydı kim, hangi sürüm, ne zaman).

## Nereden açılır

- **Kayıt formu:** `egitimevi.org/signup` (giriş sayfasındaki "Kayıt ol" sekmesi); kutu formun en altında, "Kayıt Ol" düğmesinin
  hemen üstünde ([Kayıt olma](../giris-hesap/kayit-olma.md)).
- **Girişten hemen sonra:** onay gerekiyorsa uygulama açılmadan kendiliğinden çıkan pencere ("Aydınlatma metni" ya da "Aydınlatma
  metni güncellendi"). Menüde ya da ayarlarda ayrı bir yeri yok.
- **Android uygulaması:** kayıt sayfasındaki kutu; girişten sonra, onay gerekiyorsa tam ekran "Aydınlatma metni güncellendi" sayfası.
- **Tasarımda:** Hesap ayarları → "Gizlilik ve verilerim" → "Aydınlatma metni" satırı onayladığın sürümü ve tarihi gösterir.

## Adım adım

### Ziyaretçi

Kendisi kaydolan veli, öğretmen ya da müdür adayı:

1. Kayıt formunu doldur ([Kayıt olma](../giris-hesap/kayit-olma.md)).
2. En alttaki kutunun yazısı: "Aydınlatma metnini okudum, anladım ve kişisel verilerimin bu kapsamda işlenmesini kabul ediyorum.
   Kullanım koşullarını kabul ediyorum." İçindeki "Aydınlatma metnini" ve "Kullanım koşullarını" bağlantıları **yeni sekmede** açılır;
   form yerinde kalır.
3. Kutuyu işaretle, "Kayıt Ol"a bas.
4. Kutu işaretsizse kutunun altında: "Devam etmek için aydınlatma metnini onaylaman gerekiyor." (öbür alanların hatalarıyla birlikte,
   sunucuya gitmeden). Bir yolla sunucuya işaretsiz giderse sunucu da reddeder: "Devam etmek için aydınlatma metnini okuyup
   onaylaman gerekiyor." (aynı kutunun altında).
5. Hesap hemen açılmaz: bilgiler o anki metin sürümüyle bekler, e-postana onay bağlantısı gider ([E-posta onayı](../giris-hesap/eposta-onayi.md)).
6. Bağlantıya 24 saat içinde tıklayınca hesap açılır; onayın **formu gönderdiğin anla** ve o anki sürümle kaydedilir.
7. Bu arada metnin sürümü arttıysa hesabın eski sürümle açılır; ilk girişte "Aydınlatma metni güncellendi" penceresi gelir
   (aşağıda "Herkes").

**Tasarımda (Tasarım 1 önizlemesi):** kutunun yazısı aynı; bağlantılar yeni sekme yerine pencerede açılır ("Kapat" düğmesiyle);
kutu işaretsizken hata "Devam etmek için aydınlatma metnini ve kullanım koşullarını onayla."

**Android'de kayıt:** kutunun yazısı "Aydınlatma metnini okudum; kişisel verilerimin bu metne göre işlenmesini kabul ediyorum.",
altında "Aydınlatma metnini oku" (tarayıcıda açar); işaretsiz kayıtta "Devam etmek için aydınlatma metnini onayla." Kullanım
koşulları bu kutuda geçmez (aşağıda "Kurallar ve sınırlar").

### Öğrenci ve servisçi

Hesabını okul açtı; bu yüzden hesabında hiç onay yoktur:

1. Okulun verdiği kullanıcı adı ve şifreyle (çoğu zaman T.C. kimlik numaran) okulunun sayfasından ya da giriş sayfasından gir.
2. Uygulama açılmadan pencere çıkar. Başlık: **"Aydınlatma metni"** ("güncellendi" denmez). Yazı: "Hoş geldin. Devam etmeden önce
   kişisel verilerinin nasıl işlendiğini anlatan metni okuyup onaylaman gerekiyor."
3. Altında "Aydınlatma metnini yeni sekmede aç" bağlantısı.
4. Kutu: "Aydınlatma metnini okudum, anladım ve kişisel verilerimin bu kapsamda işlenmesini kabul ediyorum. Kullanım koşullarını kabul
   ediyorum." ("Kullanım koşullarını" bağlantısı yeni sekmede).
5. Alttaki düğmeler: gri "Çıkış yap" ve "Onaylıyorum".
6. Kutuyu işaretlemeden "Onaylıyorum"a basarsan pencerede: "Önce kutucuğu işaretle." Pencerenin dışına basmak pencereyi kapatmaz.
7. Onaylayınca okulun verdiği şifreyle girdiysen sıradaki pencere "Kendi şifreni belirle" ([Zorunlu şifre belirleme](../giris-hesap/zorunlu-sifre-belirleme.md));
   ondan sonra uygulama açılır. Sıra hep budur: önce onay, sonra şifre.

Android'de aynı durum tam ekran sayfayla gelir; başlığı bu durumda da "Aydınlatma metni güncellendi" der (aşağıda "Kurallar ve
sınırlar").

### Herkes: metin güncellenince

Veli, öğretmen, çalışan, müdür, öğrenci ve servisçi için aynı:

1. Geliştirici metni değiştirip sürümü artırınca senin onayın eski sürümde kalır.
2. Bir sonraki girişinde (ya da sayfayı yenileyince) uygulama açılmadan pencere çıkar. Başlık: **"Aydınlatma metni güncellendi"**.
   Yazı: "Kişisel verilerin korunması aydınlatma metni yenilendi (sürüm 1.16). Devam etmek için metni okuyup onaylaman gerekiyor."
   (parantezdeki sürüm o günkü sürümdür).
3. Bağlantı, kutu, "Çıkış yap" ve "Onaylıyorum" yukarıdakiyle aynı; "Önce kutucuğu işaretle." uyarısı da.
4. "Onaylıyorum" → onay o anın tarihi ve yeni sürümle kaydedilir; uygulama açılır.
5. **Bir kez onaylarsın:** onay kişinindir; yetişkin hesabına ve ona bağlı bütün okul rollerine (öğretmen, müdür) birlikte yazılır
   (veli portalı yetişkin hesabının kendisidir). Portal değiştirince yeniden sorulmaz ([Portallarım](../portallar/portallarim.md)).
6. "Çıkış yap"a basarsan pencere kapanır ve giriş ekranına dönersin; bir sonraki girişte pencere yine gelir.
7. **Oturumun açıkken sürüm artarsa:** pencere kendiliğinden açılmaz; o ana kadar açık sayfada yaptığın her işlem "Aydınlatma metni
   güncellendi. Devam etmek için okuyup onaylaman gerekiyor." hatasıyla düşer. Sayfayı yenile; pencere gelir.
8. **Telefon bildirimleri (Android uygulaması):** uygulamanın cihaz anahtarı, onayın eskiyse ilk kullanıldığında silinir; uygulama
   "Aydınlatma metni güncellendi. Uygulamada onayladıktan sonra bildirimler yeniden gelir." cevabını alır. Uygulamayı açıp
   onaylayana kadar telefonuna bildirim gelmez ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).
9. **Android'deki onay sayfası:** üstte küçük "Kişisel verilerin korunması", başlık "Aydınlatma metni güncellendi", altında "Devam
   etmeden önce yeni metni okuyup onaylaman gerekiyor."; beş maddelik özet kartı ("Veri sorumlusu", "Ne işlenir", "Kim görür",
   "Paylaşım", "Haklarım") ve "Metnin tamamını oku"; kutu "Aydınlatma metnini okudum; kişisel verilerimin bu metne göre işlenmesini
   kabul ediyorum."; düğmeler "Onayla ve devam et" ve "Çıkış yap". İşaretsizken "Devam etmek için onay kutusunu işaretle."

**Onaylamadan neler açık kalır:** kendi hesap bilgin, onay, çıkış; giriş, kayıt, robot doğrulama sorusu, şifremi unuttum, şifre
yenileme, e-posta onayı; okul arama ve okul sayfası, sitenin genel bilgileri, uygulama sürümleri ve açılış sayfasının yorumları. Geri kalan her istek
sunucuda 403 ile durur.

### Yönetici

- Onay kapısı **sistem yöneticisine uygulanmaz**: sunucu yönetici hesabını her zaman "onayı güncel" sayar (kayıt formundan geçmez,
  sistemi kuran kişidir; ilk açılışta kendini kilitlemesin diye).
- Kişilerin onay tarihini ya da sürümünü gösteren bir yönetim ekranı yok; bilgi veritabanında hesabın satırında durur.
- Okulu açtığında müdürün okul rolüne, kişinin yetişkin hesabındaki onay kopyalanır; müdür ayrıca onay vermez.

### Destek, eğitmen ve tahta

**Tasarımda:**

- **Eğitmen:** eğitmenlik, var olan bir yetişkin hesabına verilen site rolüdür; bugünkü kural gereği onay kapısı ona da uygulanır.
- **Destek:** hesabı yönetici gibi sunucudaki dosyadan açılır (kayıt formundan geçmez). Onay kapısından muaf olup olmayacağı tanımda
  yazılı değil (tanım yalnız onay kapısının "yeni rolü tanıyacağını" söyler); paneller işinde (iş 5) karara bağlanacak. T.C. adımından
  ise yönetici gibi muaftır (aşağıda).
- **Tahta** hesabına yeniden onay sorulmaz (kullanıcı 29 Eylül: tahta kişisel veri sahibi değil; "tahta. istisnalı")
  ([Tahta girişi](../tahta/tahta-girisi.md)).
- **T.C.'si olmayan eski yetişkin hesapları** (T.C. zorunluluğu kodlanınca): girişten sonra yeniden onayla **aynı adımda** "T.C.
  kimlik numaranı gir" istenir, atlanamaz; yönetici ve destek hesabı hariç ([T.C. kimlik no](../giris-hesap/tc-kimlik-no.md)).
- **Eklentiler** (kodlanmayacak, yalnız belgeleniyor): her okulun kurulu eklentileri, işledikleri ve dışarı gönderdikleri veriler
  kendiliğinden bir "okul eki"ne yazılır; dışarı veri gönderen ya da saklamayı uzatan değişiklikte o okulun kişileri bir sonraki
  girişte eki görüp onaylar (öneri) ([Eklentilerin sınırları](../eklentiler/sinirlar.md)).
- **Hesap ayarları** → "Gizlilik ve verilerim" → "Aydınlatma metni": onayladığın sürüm ve tarih ("Sürüm 1.16 · 30 Eylül 2026'da
  onayladın" biçiminde) ve "Oku" ([Aydınlatma metni](aydinlatma-metni.md#tasarımda-özet-penceresi-ve-kayıt-formu)).

## Kurallar ve sınırlar

- **Onay kaydı:** `onay` (evet), `tarih`, `surum`. Kayıtta tarih = formu gönderdiğin an; yeniden onayda tarih = "Onaylıyorum"a
  bastığın an. Sürüm sunucudaki `KVKK_SURUM` (bugün 1.16).
- **Güncel sayılmak için** onayın sürümü sunucudakiyle **birebir** aynı olmalı; bir sürüm geride kalan herkes yeniden onaylar.
- **Sunucu kapısı:** onayı güncel olmayan hesabın serbest listedekiler dışındaki her isteğine 403: "Aydınlatma metni güncellendi.
  Devam etmek için okuyup onaylaman gerekiyor." Onay isteğinde değer tam olarak `true` değilse 400: "Devam etmek için aydınlatma
  metnini okuyup onaylaman gerekiyor." ("evet" gibi bir yazı kabul edilmez). Girişsiz onay isteği 401 "Giriş yapmalısın".
- **Kullanım koşullarının kendi sürüm sayısı yok:** kutu iki metni birlikte onaylatır ama pencere yalnız aydınlatma metninin sürümü
  artınca çıkar. Bu yüzden koşullar her değiştiğinde aydınlatma metninin sürümü de aynı işte artırıldı ([Kullanım koşulları](kullanim-kosullari.md)).
- **Sıra:** onay → (okulun ya da yöneticinin verdiği şifreyle girildiyse) kendi şifreni belirleme → uygulama. Şifre penceresi onaydan
  önce açılsaydı her kaydetmede 403 alırdı.
- **Dikkat (kodda):**
  - Android'in kayıt kutusu ve onay sayfası **kullanım koşullarını** anmıyor; sitede ise aynı kutu iki metni birlikte onaylatıyor.
  - Android onay sayfasının başlığı her zaman "Aydınlatma metni güncellendi"; okulun açtığı hesap metni ilk kez görürken de bunu
    okur (sitede bu durumda yalnız "Aydınlatma metni" ve "Hoş geldin…" yazar).
  - Açık oturumda sürüm artınca sitede pencere kendiliğinden açılmaz; ekranlar sunucunun hata iletisini gösterir (yukarıda adım 7).
  - Aydınlatma metninin 4. bölümü reşit olmayan öğrenci için "velisinin bilgisi ve onayı"ndan söz eder; sistemde ayrı bir veli onayı
    kaydı yok, okulun açtığı öğrenci hesabında onayı öğrencinin kendisi verir. Tasarımdaki toplantılar için de öğrenci başına ayrı
    "veli izni" denetimi kurulmaması, uzaktan derse görüntülü katılımın aydınlatma metninde yazılması kararlaştırıldı (kullanıcı 29
    Eylül: "veli şeyi kvkk olsun").
  - Eğitim Evi Aile'nin telefon anahtarı yeni sürümün onayını beklemez: öğrenci henüz onaylamamışken bağlı telefon konum ve süre
    göndermeyi sürdürür ([Kim görür, ne kadar saklanır](../aile/mahremiyet.md)).
- **Hız sınırı:** onay isteğinin kendi sınırı yok; genel istek sınırları geçerli.

## Kardeşler ve ilgili

**Kardeşler** ([KVKK ve gizlilik](README.md)):

- [Aydınlatma metni](aydinlatma-metni.md) — onaylanan metin.
- [Kullanım koşulları](kullanim-kosullari.md) — aynı kutuyla onaylanan ikinci metin.
- [Haklar ve başvuru](haklar-ve-basvuru.md) — onayın geri çekilmesi, silme hakkı.
- [Kim neyi görür](kim-neyi-gorur.md), [Saklama süreleri](saklama-sureleri.md), [Dışarı giden veriler](disari-giden-veriler.md).

**İlgili:**

- [Kayıt olma](../giris-hesap/kayit-olma.md), [E-posta onayı](../giris-hesap/eposta-onayi.md), [Giriş](../giris-hesap/giris.md),
  [Zorunlu şifre belirleme](../giris-hesap/zorunlu-sifre-belirleme.md), [Çıkış yap](../giris-hesap/cikis-yap.md).
- [Portallarım](../portallar/portallarim.md) — onayın bütün portallara birlikte yazılması.
- [Telefon bildirimi](../bildirim/telefon-bildirimi.md), [Android uygulaması](../uygulama/android-uygulamasi.md).
- [Hesap ayarları sayfası](../ayarlar/hesap-ayarlari-sayfasi.md) — tasarımdaki "Gizlilik ve verilerim".

## Kod tarafı

- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `KVKK_SURUM`, `kvkkGuncelMi` (yönetici her zaman güncel),
  kayıtta `kvkkOnay !== true` denetimi ve bekleyen kayda sürüm yazılması, e-posta onayında hesabın açılması, `POST /api/kvkk-onay`
  (onayın yetişkin hesabına ve bütün rol satırlarına yazılması); [sunucu/api.md](../../sunucu/api.md) — `KVKK_SERBEST` listesi ve
  403 `kvkkGerek` kapısı; [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md) — onayı eski hesabın cihaz anahtarının silinmesi.
- Veri: `kullanicilar` tablosunda `kvkk_onay`, `kvkk_tarih`, `kvkk_surum` ([sunucu/veri/esleme.md](../../sunucu/veri/esleme.md),
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `rolSatirlarinaKvkk`).
- Ön yüz: [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) — `kvkkOnayIste` (pencere, "ilk" ile
  "güncellendi" ayrımı, zorunlu perde); [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) — "Onaylıyorum"
  (`kvkk-onayla`) ve perdeye tıklayınca kapanmama; [public/js/parcalar/05b-sifre-zorunlu.md](../../public/js/parcalar/05b-sifre-zorunlu.md)
  — `girisSonrasi` sırası; [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) — kayıt kutusu (`kKvkk`) ve hata
  iletisi; [public/js/parcalar/01-yardimcilar.md](../../public/js/parcalar/01-yardimcilar.md) — `kvkkGerek`'in özel ele alınmaması;
  kutunun HTML'i [public/KLASOR.md](../../public/KLASOR.md) (`index.html`).
- Android (ayrı depo `Egitim-Evi-App`): `KvkkSayfasi.java`, `KayitSayfasi.java`, `AnaEkran.java` (`kvkkGerek` gelince onay
  sayfasına geçiş), `Oturum.java` (`kvkkGuncel`, `kvkkSurum`).
- Testler: [testler/test-yonetim.md](../../testler/test-yonetim.md) — okulun açtığı hesap girer ama `kvkkGuncel: false`, onaysız
  istek 403, `/api/me` açık, `onay: 'evet'` 400, `onay: true` ile açılır; [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md)
  — `kvkkOnay: false` ile kayıt `kvkk` alanında hata; [testler/buton-denetimi.md](../../testler/buton-denetimi.md) — "Onaylıyorum" ve
  "Çıkış yap" düğmelerinin karşılığı.

## Sık sorulanlar

- **Onaylamazsam ne olur?** Hesabına girersin ama uygulamayı kullanamazsın; yalnız onay penceresi ve "Çıkış yap" açıktır.
- **Her portal için ayrı mı onaylıyorum?** Hayır; bir kez onaylarsın, bütün portallarına yazılır.
- **Onayımı geri alabilir miyim?** Onay kutusunu geri alan bir düğme yok. Yetişkin hesabını "Hesabımı sil" ile silebilirsin; öğrenci
  ve servisçi hesabını okul kapatır ([Haklar ve başvuru](haklar-ve-basvuru.md)).
- **Telefonuma bildirim gelmiyor, neden?** Metin güncellendiyse uygulamayı açıp onaylayana kadar telefon bildirimi durur.

## Sırada

- KVKK ve onay metinleri tam denetimi (iş 18): bütün onay kutularının metni (kayıt, Android, yeniden onay, tasarımdaki içerik
  yükleme koşulları) ve onay kaydının kapsamı.
- T.C. kimlik no bütün hesaplarda zorunlu (iş 32, Linux): eski yetişkin hesaplarında yeniden onayla aynı adımda T.C.
- Android uygulaması (iş 10): onay kutusuna kullanım koşulları, ilk onayda "güncellendi" denmemesi.
- Toplantılar ve tahta hesabı (iş 21): tahtanın onay kapısından muaf tutulması.
- Paneller (iş 5): destek hesabının onay kapısına girip girmeyeceği.
- Üst şerit sadeleştirme (iş 29, öneri; onay bekliyor): atlanamayan ekranlarda (yeniden onay, zorunlu şifre) sol üstte "← Çıkış yap".
- Eklentiler (iş 35, yalnız belgeleniyor): okul eki ve onayı.
