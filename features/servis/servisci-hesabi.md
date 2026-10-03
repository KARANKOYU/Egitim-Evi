# Servis · Servisçi hesabı açma

**Durum:** Kodda var; tasarımda ek olarak "Servis ekle" penceresinde servisle birlikte yeni servisçi hesabı açma, servisçinin velilere görünen telefonunu Ayarlar'dan kendisinin düzenlemesi ve "servisçi de portal" (aynı servisçi iki okulda tek hesapla, iki portalla çalışır).

Servisçi kendisi kaydolmaz; hesabını okul yönetimi tek tek ya da Excel'le açar, servise atar, şifresini yeniler ve gerekirse siler.

## Ne işe yarar

Yoklamayı işaretleyen ve sefer sürerken aracın konumunu gönderen kişi servisçidir; bunun için bir hesabı olmalı. Kullanıcının
kararı: "servisci kayıt olmicak onu müdür ayarlicak" (26 Eylül) ve yeni hesap modeli sorulduğunda "Okul açsın, şimdiki gibi"
(26 Eylül). Hesap okula aittir (öğrenci hesabı gibi): kullanıcı adını ve ilk şifresini okul verir, servisçi okulun adresinden girer
ve ilk girişte kendi şifresini belirler.

Servisçi hesabı açılınca servise atanır ([Servisler sayfası](servisler-sayfasi.md) → "Düzenle" → "Servisçi hesabı"); atandığı
servislerin öğrencileri onun [Yoklama sayfası](yoklama-sayfasi.md)'nda listelenir.

## Nereden açılır

- **Tek tek:** [Servisler sayfası](servisler-sayfasi.md)'nın en altında **"Servisçiler (N)"** bölümü → **"Servisçi ekle"**.
- **Toplu:** **Excel Aktarım** → İçeri aktar → Kişi listesi; şablonun **"Servisçiler"** sayfası
  ([İçe aktarım](../excel-aktarim/ice-aktarim.md), [Boş şablon](../excel-aktarim/bos-sablon.md)).
- **Var olan hesabı düzenlemek:** "Servisçiler" bölümünde servisçinin satırındaki **"Hesap"**.

Tasarımda: ayrıca müdürün "Servis ekle" penceresinde "Servisçi" seçimi **"Yeni servisçi hesabı aç"** / **"Okuldaki bir servisçi"**
([Servisler sayfası](servisler-sayfasi.md)).

## Adım adım

### Müdür

**"Servisçiler" bölümü**

Başlık "Servisçiler (N)"; altında açıklama: "Servisçi hesabını okul açar. Servisçi telefonundan girip Yoklama sayfasında öğrencileri
işaretler; sefer sürerken aracın yeri o servisteki öğrencilere ve velilerine görünür." Sağda **"Servisçi ekle"**. Her servisçi bir
satır: adı; altında "kullanıcı adı · atandığı servisler (ya da "servise atanmadı") · henüz giriş yapmadı" (giriş yaptıysa son
parça yazmaz); sağda **"Hesap"**.

**Yeni servisçi hesabı aç**

1. **"Servisçi ekle"**ye bas. "Yeni servisçi hesabı" penceresi:
   - **"Ad"** ve **"Soyad"** (zorunlu)
   - **"T.C. kimlik no"** (zorunlu, 11 hane, yalnız rakam alır; örnek yazı "11 haneli"). Altında: "Yalnızca okul yönetimi görür;
     öğretmenler ve öğrenciler görmez."
   - **"Kullanıcı adı"** (örnek yazı "Boş bırakırsan T.C. no olur"). Altında: "Harfle başlar; harf, rakam, nokta ve alt çizgi. Okulun
     içinde tek olmalı." Yazarken küçük harfe döner, boşluk noktaya.
   - **"Şifre"** (örnek yazı "Boş bırakırsan T.C. no olur"). Altında: "Boşsa şifre T.C. kimlik no olur ve kişi ilk girişte kendi
     şifresini belirlemeden devam edemez."
   - **"E-posta (isteğe bağlı)"** — "Yazılırsa giriş kodu ve şifre sıfırlama bağlantısı oraya gider."
   - **"Doğum tarihi (isteğe bağlı)"** — gün, ay, yıl seçici.
   - **"Telefon (isteğe bağlı)"** — "Servisteki öğrencilerin velileri bu numarayı görür."
   - **"Adres (isteğe bağlı)"**
2. **"Hesabı aç"** ("Açılıyor..."). Yanlış ya da eksik alan kutusunun altında kırmızı yazar ve ilk hataya gidilir.
3. "Hesap açıldı" penceresi:
   - Yeşil ileti: "Hakan Demir hesabı açıldı." (şifre boş bırakıldıysa sonuna "Kullanıcı adı ve şifre T.C. kimlik no; ilk girişte
     kendi şifresini belirleyecek.").
   - **"Kullanıcı adı"** ve **"Kopyala"**.
   - **"Şifre"**: boş bırakıldıysa "T.C. kimlik numarası" ve "İlk girişte kendi şifresini belirleyecek."; yazdıysan şifrenin kendisi
     ve **"Kopyala"**, altında "Bu şifre bir daha gösterilemez; şimdi kişiye ilet."
   - **"Giriş adresi"**: okulun adresi (ör. egitimevi.org/school/okulun-adi).
   - Düğmeler: **"Bir tane daha aç"**, **"Tamam"**.
   Şifre ekrandayken pencerenin dışına tıklamak onu kapatmaz; geri tuşu, başka sayfa, çıkış ya da sekmeyi kapatma önce sorar: "Yeni
   şifre ekranda ve bir daha gösterilmeyecek. Kişiye ilettiysen ayrılabilirsin. Ayrılınsın mı?"
4. Hesabı servise ata: servisin kartında **"Düzenle"** → **"Servisçi hesabı"** listesinden seç → **"Kaydet"**. Atanınca "Servisçiler"
   satırında servisin adı görünür.

Servisçide kişi kodu (veli kodu) yoktur; "Hesap açıldı" penceresinde kod satırı çıkmaz.

**Hesabı düzenle, şifre ver, sil**

1. Servisçinin satırında **"Hesap"**. Pencere başlığı "Hakan Demir — Servisçi".
2. Üstte aynı alanlar (şifre hariç) ve **"Bilgileri kaydet"**: yalnız değişen alanlar gider; değişiklik yoksa "Değişiklik yok.",
   kaydedilince "Bilgiler kaydedildi.". Arkadaki liste de güncellenir, pencere açık kalır.
3. **"Şifre"** bölümü: "Şifreler geri döndürülemez biçimde saklanır, görüntülenemez." (kişi kendi şifresini henüz belirlemediyse
   "Bu kişi henüz kendi şifresini belirlemedi.", hiç girmediyse "Hesaba hiç giriş yapılmadı.") "Unuttuysa yenisini belirle."
   - **"Yeni şifre"** kutusu, **"Rastgele üret"** (karışan harfler olmadan 8 harf + 2 rakam), **"Şifreyi değiştir"** (onay: "Şifre
     değiştirilsin mi? Kişinin açık oturumları kapanacak.").
   - **"İlk girişte kendi şifresini belirlesin"** kutusu (işaretli gelir).
   - **"Şifreyi T.C. no yap"** (onay: "Şifre T.C. kimlik numarası olsun mu? Kişi ilk girişte kendi şifresini belirleyecek; açık
     oturumları kapanacak.").
   - Başarıda "Hakan Demir için yeni şifre kaydedildi. Yeni şifre: …" (bir kez gösterilir, kendiliğinden silinmez); servisçiye
     "Şifren okul yönetimi tarafından değiştirildi." bildirimi gider. Yeni şifre yazılmadan basılırsa "Yeni şifreyi yaz ya da üret."
4. **"Hesabı sil"** bölümü: "Servisçinin servis ataması kalkar; açık seferi varsa kapanır." → **"Hesabı sil"** (onay: "Hakan Demir
   hesabı silinsin mi? Bu işlem geri alınamaz.") → sayfanın üstünde "Hakan Demir hesabı silindi."

**Excel ile toplu açma**

1. Excel Aktarım → İçeri aktar → Kişi listesi. Boş şablonda iki sayfa var: "Öğrenciler" ve "Servisçiler" (üçüncü sayfada nasıl
   doldurulacağı yazar).
2. "Servisçiler" sayfasının sütunları: "Ad", "Soyad", "Doğum tarihi (gg.aa.yyyy)", "T.C. Kimlik No", "E-posta", "Kullanıcı adı",
   "Şifre", "Telefon", **"Servis (adı ya da plakası)"**, "Adres" (tek "Ad Soyad" sütunlu kendi dosyan da okunur; sütun sırası önemli
   değil, başlıklar benzer olsun yeter). Şablondaki açıklama: "Telefon: velilerin ve öğrencilerin göreceği numara." ve "Servis:
   sistemde açılmış servisin adı ya da plakası yazılırsa servisçi o servise atanır."
3. Yükleme iki adımlı: önce ne olacağını gösteren liste, onaylayınca hesaplar açılır ve servisçiler servislerine atanır. Yazılan
   servis bulunamazsa satırda '"07 XYZ 99" adında ya da plakasında bir servis yok' sorunu çıkar. Ayrıntı:
   [Önizleme ve hatalar](../excel-aktarim/onizleme-ve-hatalar.md), [Toplu giriş bilgisi](../hesaplar/toplu-giris-bilgisi.md).

### Öğretmen ve çalışan

"Servisleri ve servis öğrencilerini düzenler" yetkisi olan öğretmen (bugün "Servis Sorumlusu" ek rolüyle) yukarıdakilerin hepsini
yapar: hesap açar, düzenler, şifre verir, siler. Yetkisi olmayan "Bu işlem için yetkin yok" alır. Tasarımda aynı rol öğretmen
olmayan "çalışan"a da verilebilir.

### Servisçi

1. Okul yönetiminden kullanıcı adını ve ilk şifreni al.
2. Okulunun adresinden gir (egitimevi.org/school/okulun-adi): aynı kullanıcı adı başka okulda da olabileceği için giriş okulun
   içinde aranır. Giriş sayfasında okulunu adıyla arayıp da seçebilirsin
   ([Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md)).
3. Şifren T.C. no'n ya da dağıtılan şifreyse önce kendi şifreni belirlersin
   ([Zorunlu şifre belirleme](../giris-hesap/zorunlu-sifre-belirleme.md)).
4. Hesabında e-posta yoksa iki adımlı giriş kodu istenmez; okul hesabına e-posta yazdıysa her girişte o adrese 6 haneli kod gelir
   ([İki adımlı giriş](../giris-hesap/iki-adimli-giris.md)).
5. Girince ana sayfan **Yoklama**dır; menünde **Yoklama**, **Mesajlar**, **Takvim**, **Hatırlatıcılar** var
   ([Yoklama sayfası](yoklama-sayfasi.md)). Ayarlar'da (profil) "Hesap bilgilerin" (ad soyad, kullanıcı adı, okul), "Bilgileri
   güncelle" (ad soyad, il, ilçe, adres; T.C. no salt okunur: "Yalnızca sen ve okul yönetimi görür. Yanlışsa okul yönetimine söyle."),
   "Telefon bildirimleri", "Görünüm" ve "Şifre değiştir" kartları var ([Kişisel bilgiler](../ayarlar/kisisel-bilgiler.md)). Kullanıcı adını, e-postanı ve
   velilerin gördüğü telefonunu bugün okul yönetimi "Hesap" penceresinden değiştirir.
6. Şifreni unutursan: e-postan varsa "Şifremi unuttum"; yoksa okul yönetimi yeniler.

Tasarımda: servisçinin menüsü **"Ana sayfa"**, **"Yoklama"**, **"Mesajlar"**, **"Takvim"**, **"Hatırlatıcılar"** (kullanıcı 1 Ekim:
"servisci e ana sayfa olabilir bence"; [Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md)). Ayarlar'da "Ad soyad" ve
"Servis" okulun değiştirdiği alanlar, **"Telefon (velilere görünür)"** servisçinin kendisinin düzenlediği alan ("Bu numara servisine
binen öğrencilerin velilerine görünür."); kişi kodu yok. "+ Ekle" düğmesi servisçide yok (hesap okula aittir).

## Kurallar ve sınırlar

- **Kim açar:** müdür ve `servis.yonet` yetkilisi (açma, düzenleme, şifre ve silme için aynı yetki). Servisçi kendisi kaydolamaz.
  Saatte en çok 120 hesap: "Bu saat içinde çok fazla hesap açtın. Excel ile toplu açabilirsin."
- **Zorunlu alanlar:** ad, soyad, T.C. kimlik no. İletiler: "Adı yaz.", "Soyadı yaz.", "T.C. kimlik no gerekli." ve T.C. kuralı
  ([T.C. kimlik no](../giris-hesap/tc-kimlik-no.md)).
- **Kullanıcı adı** okul içinde tek; boşsa T.C. no olur. Rakamlardan oluşan kullanıcı adı yalnız kişinin T.C. no'su olabilir:
  "Rakamlardan oluşan kullanıcı adı yalnızca kişinin T.C. no'su olabilir."
- **Şifre kuralı** (servisçi, öğrenci gibi): en az 8 karakter, en az bir harf ve bir rakam
  ([Şifre kuralları](../giris-hesap/sifre-kurallari.md)). Okulun verdiği şifreyle giren kişi ilk girişte kendi şifresini belirler.
- **E-posta** her yerde tektir; yazıldıysa giriş kodu ve şifre sıfırlama oraya gider. Bozuksa "E-posta adresi eksik ya da hatalı
  görünüyor."
- **Doğum tarihi** üçü birden seçilmeli ya da hepsi boş: "Gün, ay ve yılın üçünü de seç ya da hepsini boş bırak."
- **Telefon** isteğe bağlı; o servisteki öğrencilerin velileri görür (servisin kendi "Şoför telefonu" boşsa kartta bu numara çıkar).
- **T.C. no'yu** yalnız okul yönetimi görür; servisçi kendi Ayarlar'ında salt okunur görür ("Yanlışsa okul yönetimine söyle.").
- **Kişi kodu yok:** servisçi ve sistem yöneticisinde kod üretilmez (sitenin SSS'si: "Servisçi hesabında kod yoktur.").
- **Silinince** servis ataması kalkar, açık seferi kapanır. İşlem kaydına "Hesap açıldı" / "Hesap silindi" yazılır
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Servisçi neyi görür:** yalnız atandığı servisin öğrencilerinin adı, sınıfı, durağı, evinin yeri ve sırası; o günün yoklaması;
  velilerin "binmeyecek" işaretleri ve notları (aydınlatma metni). Servis atanmadıysa Yoklama'da "Sana henüz bir servis atanmadı.
  Okul yönetimi servise atayınca öğrenciler burada görünür."
- **Telefon uygulamasında** servisçi oturumu 30 gün açık kalır (tarayıcıda 7 gün).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Servisler sayfası](servisler-sayfasi.md) — servisçiyi servise atama.
- [Yoklama sayfası](yoklama-sayfasi.md) — servisçinin ana ekranı.
- [Sabah seferi](sabah-seferi.md), [Akşam seferi](aksam-seferi.md), [Sırayı düzenle](sira-duzenleme.md),
  [Velilere not](gunluk-not.md), [Canlı konum ve servis haritası](canli-konum-ve-harita.md).

**İlgili:**

- [Hesap penceresi](../hesaplar/hesap-penceresi.md), [Şifre işlemleri](../hesaplar/sifre-islemleri.md),
  [Toplu giriş bilgisi](../hesaplar/toplu-giris-bilgisi.md) — aynı pencere öğrenci hesabında da kullanılır.
- [İçe aktarım](../excel-aktarim/ice-aktarim.md), [Boş şablon](../excel-aktarim/bos-sablon.md).
- [Okulun sayfasından giriş](../giris-hesap/okulun-sayfasindan-giris.md), [Zorunlu şifre belirleme](../giris-hesap/zorunlu-sifre-belirleme.md),
  [Şifre kuralları](../giris-hesap/sifre-kurallari.md), [T.C. kimlik no](../giris-hesap/tc-kimlik-no.md).
- [Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md) (tasarım), [Portallarım](../portallar/portallarim.md)
  (servisçi de portal, tasarım).
- [Android uygulaması](../uygulama/android-uygulamasi.md) — servisçi girişi ve 30 günlük oturum.

## Kod tarafı

- Sunucu: [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — `POST /api/school/hesap-ac` (`rol: 'servisci'`),
  `GET /api/school/hesap`, `/hesap-guncelle`, `/hesap-sifre`, `/hesap-sil`, `GET /api/school/servisciler`; yetki tablosu
  `YETKI.servisci` (hepsi `servis.yonet`).
- Toplu: [sunucu/bolumler/kisi-aktarim.md](../../sunucu/bolumler/kisi-aktarim.md) — "Servisçiler" sayfası, "Servis (adı ya da
  plakası)" sütunu, `servisSoforYaz`.
- Kurallar: [sunucu/ortak.md](../../sunucu/ortak.md) (`gucluSifreli`: öğrenci ve servisçide kısa kural).
- Ön yüz: [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) — `HESAP_ROL.servisci` ("Yeni servisçi
  hesabı"), `hesapAlanlari`, `hesap-ac-kaydet`, `hesapDuzenleModal`, `hesap-sil`; liste
  [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) (`servisSayfasi`'nın "Servisçiler" bölümü).
- Servisçinin menüsü ve ana sayfası: [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md),
  [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md).
- Testler: [testler/test-servis-konum.md](../../testler/test-servis-konum.md) (servisçi listesi ve atama),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Hesap açma (öğrenci, servisçi)", "Toplu hesap açma").

## Sık sorulanlar

- **Servisçi kendisi kaydolabilir mi?** Hayır; hesabını okul açar (sitenin SSS'si: "Öğrenci ve servisçi hesabını kim açar?" —
  "Okul.").
- **Servisçi nereden giriş yapar?** Okulunun adresinden (egitimevi.org/school/okulun-adi), kullanıcı adıyla.
- **Servisçi şifresini unuttu.** E-postası yoksa okul yönetimi "Hesap" penceresinden yeni şifre verir ya da şifreyi T.C. no yapar.
- **Bir servisçi iki servise bakabilir mi?** Evet; iki servisin "Servisçi hesabı"na aynı kişiyi seç. Yoklama sayfasının üstünde
  servis seçici çıkar.
- **Servisçinin telefonunu kim görür?** O servisteki öğrenciler, velileri ve okul yönetimi.

## Sırada

- Tek kişi tek hesap + portallar öğrencide de: servisçi de portal — T.C. kişi başına sistem genelinde tek, aynı servisçi iki okulda
  tek hesap ve iki portal ("Servisçi · okul").
- T.C. kimlik no bütün hesaplarda zorunlu: her yerde geçerlilik kuralı ve yazarken canlı denetim (kod Linux'ta).
- Linux kodlaması (Tasarım 1): "Servis ekle" penceresinde yeni servisçi hesabı açma; servisçinin ayrı ana sayfası.
- Android yerel uygulama: servisçinin Yoklama ve Harita sekmeleri.
- Çalışan olarak ekleme: "Servis Sorumlusu" rolünün çalışana verilmesi.
