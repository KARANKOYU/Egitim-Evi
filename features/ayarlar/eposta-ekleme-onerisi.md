# Hesap ayarları · "E-posta eklemek ister misin?"

**Durum:** Kodda var; tasarımda ek olarak Hesap ayarlarının "Giriş bilgileri" bölümünde e-postasız hesapta soluk "eklenmedi" yazısı ve **"Ekle"** düğmesiyle açılan ayrı **"E-posta ekle"** penceresi.

E-postası olmayan eski yetişkin hesabına girişten sonra bir kez açılan, e-posta eklemeyi öneren küçük pencere.

## Ne işe yarar

Bugün yetişkin hesabı e-postasız açılamaz (kayıtta e-posta zorunlu ve onay bağlantısıyla açılır). Ama eski düzenden kalan bazı yetişkin
hesaplarında e-posta yok: bu hesaplar iki adımlı giriş kodu alamaz (yalnız kullanıcı adı ve şifreyle girer) ve şifresini unutunca
e-postayla sıfırlayamaz. Pencere bu kişileri e-posta eklemeye davet eder. KILAVUZ'daki karşılığı: "eski düzenden kalıp e-postası olmayan
yetişkine girişte bir kez "E-posta eklemek ister misin?" sorulur (Ayarlar → Giriş bilgileri)."

## Nereden açılır

Kendiliğinden: girişten sonra (ya da sayfa yenilenip uygulama yeniden açıldığında) ilk sayfa çizilince. Bir menüden açılmaz.
Ayarlar'da aynı durum "Giriş bilgileri" kartının üstündeki sarı kutuda da yazar ([Giriş bilgileri](giris-bilgileri.md)).

## Adım adım

### Veli, öğretmen, çalışan, müdür, rolsüz yetişkin (e-postası olmayan eski hesap)

1. Giriş yaparsın; ilk sayfa açılır.
2. Pencere: başlık **"E-posta eklemek ister misin?"**, metin "Hesabında e-posta adresi yok. Eklersen girişte sana bir kod gelir (iki adımlı
   giriş) ve şifreni unutursan e-postanla sıfırlarsın."
3. Üç düğme:
   - **"E-posta ekle"** — pencere kapanır, Ayarlar açılır, sayfa "Giriş bilgileri"ndeki **E-posta** kutusuna kayar ve imleç oraya gelir.
     Adresini ve mevcut şifreni yaz, "Kaydet"; yeni adrese onay bağlantısı gider, tıklayınca e-postan eklenir
     ([Giriş bilgileri](giris-bilgileri.md), [E-posta onayı](../giris-hesap/eposta-onayi.md)).
   - **"Sonra"** — pencere kapanır; bir sonraki açılışta yeniden sorulur.
   - **"Bir daha sorma"** — pencere kapanır; bu tarayıcıda bu kişiye bir daha sorulmaz.
4. E-posta eklendikten sonra pencere bir daha çıkmaz; bir sonraki girişten itibaren iki adımlı giriş kodu bu adrese gelir.

Okul rolündeyken (öğretmen ya da müdür portalında) girsen de pencere çıkar: e-posta yetişkin hesabınındır.

### Öğrenci, servisçi, yönetici

Pencere çıkmaz (yetişkin hesabı değil). Öğrencinin ve servisçinin e-postasını okul yönetimi yazar
([Hesap penceresi](../hesaplar/hesap-penceresi.md)).

### Tasarımda (Tasarım 1 önizlemesi)

Hesap ayarları → Giriş bilgileri → **"E-posta"** satırında soluk **"eklenmedi"** ve **"Ekle"**. Pencere **"E-posta ekle"**: **"Yeni adres"**
(yazdıkça "Geçerli adres" ya da hata), **"Şifren"**, not "Yeni adrese doğrulama bağlantısı gider; bağlantıya tıklayınca e-postan değişir.
Şifreni unutursan sıfırlama bağlantısı bu adrese gelir.", düğme **"Doğrulama bağlantısı gönder"** → "<adres> adresine doğrulama bağlantısı
gitti." Tek kişi tek hesapla öğrenci de buradan e-posta ekler (isteğe bağlı iki adımlı giriş için gerekir; [Şifre ve güvenlik](guvenlik.md)).

## Kurallar ve sınırlar

- **Kime:** yalnız yetişkin hesabı (ya da ona bağlı okul rolü) ve yalnız e-postası yoksa; sunucudan hesap bilgisi alınır, oturum bu arada
  başka kişiye geçtiyse pencere açılmaz.
- **Ne zaman:** her uygulama açılışında (girişte ya da sayfa yenilenince) en çok bir kez; çıkış yapıp başka biri girerse onun için de
  yeniden bakılır.
- **"Bir daha sorma"** bu tarayıcıda saklanır ve yalnız **son basan kişiyi** hatırlar; başka tarayıcıda yine sorulur.
- **Bilinen açık** (kod değiştirilmedi): okul rolündeyken "Bir daha sorma"ya basılırsa rol satırının kimliği saklanır; aynı kişi yetişkin
  hesabıyla girince öneri yeniden çıkar.
- **Hata olursa** (ağ, sunucu) pencere sessizce açılmaz.
- E-posta eklemek de mevcut şifreyi ister ve hemen geçerli olmaz; yeni adrese giden bağlantıya tıklanmalı (24 saat).

## Kardeşler ve ilgili

**Kardeşler:** [Giriş bilgileri](giris-bilgileri.md) · [Şifre ve güvenlik](guvenlik.md) · [Ayarlar sayfası](hesap-ayarlari-sayfasi.md).

**İlgili:** [İki adımlı giriş](../giris-hesap/iki-adimli-giris.md), [E-posta onayı](../giris-hesap/eposta-onayi.md),
[Şifremi unuttum](../giris-hesap/sifremi-unuttum.md), [Kayıt olma](../giris-hesap/kayit-olma.md),
[Henüz portalı olmayan yetişkin](../portallar/portalsiz-hesap.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — `epostaOnerisi`, `EYLEMLER['eposta-sorma']`,
  `EYLEMLER['eposta-ekle-git']` (tarayıcıda `ee_eposta_sorma`); [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) —
  ilk sayfa çizilince çağırır, çıkışta yeniden sorulabilir yapar; [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md)
  — pencere.
- Sunucu: [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md) — `GET /api/hesap` (`yetiskin`, `email`).
- Testler: [testler/buton-denetimi.md](../../testler/buton-denetimi.md) (`eposta-*` düğmeleri).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("İki adımlı giriş (2FA)").

## Sık sorulanlar

- **E-posta eklemek zorunlu mu?** Eski hesapta değil; ama eklemezsen iki adımlı giriş kodu ve şifre sıfırlama bağlantısı alamazsın.
- **"Bir daha sorma" dedim, fikrimi değiştirdim.** Ayarlar → Giriş bilgileri → E-posta kutusundan istediğin zaman eklersin.

## Sırada

- Arayüz önizlemesi / Tasarım 1 → kod: e-posta satırında "eklenmedi" / "Ekle" ve ayrı "E-posta ekle" penceresi.
- Tek kişi tek hesap + portallar öğrencide de: öğrencinin kendi e-postasını eklemesi.
