# Giriş ve hesap · E-posta onayı

**Durum:** Kodda var; tasarımda ek olarak kayıttan sonra "E-postanı onayla" ekranı, "Bağlantıyı yeniden gönder" düğmesi ve onaylanmamış hesapla girmeye çalışınca "Hesabın henüz açılmadı" ekranı.

Kayıtta ya da e-posta değiştirirken adrese giden tek kullanımlık bağlantı: hesap (ya da yeni adres) ancak bu bağlantıya tıklanınca açılır.

## Ne işe yarar

Bir adresle hesap açan kişinin o adresin gerçek sahibi olduğunu kanıtlar. Kayıt formu bilgileri hemen hesaba yazmaz; bilgiler
24 saat bekler, adrese "hesabını aç" postası gider. Bağlantıya tıklanınca hesap açılır, kişi kodu üretilir, kişi giriş
yapabilir. Tıklanmazsa hesap hiç açılmaz. Aynı düzenek yetişkin hesabının e-postasını değiştirirken de çalışır: yeni adres,
bağlantıya tıklanana kadar geçerli olmaz; o zamana kadar giriş kodları ve şifre sıfırlama eski adrese gider.

## Nereden açılır

- [Kayıt olma](kayit-olma.md) formunu gönderince posta kendiliğinden gider.
- Ayarlar → Giriş bilgileri'nde e-postanı değiştirince yeni adrese posta gider ([Giriş bilgileri](../ayarlar/giris-bilgileri.md)).
- Posta: konusu **"Eğitim Evi hesabını aç"** (kayıt) ya da **"Eğitim Evi e-posta adresini onayla"** (değişiklik). Bağlantı
  `egitimevi.org/login#/eposta-onay?t=<64 haneli anahtar>` biçimindedir; anahtar adresin `#` kısmındadır, sunucu günlüklerine
  düşmez.

## Adım adım

### Ziyaretçi: kayıttan sonra hesabını açmak

1. Kayıt formunu gönder. Kartın üstünde yeşil kutu çıkar: "**E-postanı kontrol et.** d***z@ornek.com adresine bir bağlantı
   gönderdik. Hesabını açmak için 24 saat içinde ona tıkla. Posta gelmediyse gereksiz klasörüne bak." (adres maskeli yazılır).
2. E-postanı aç. Posta şöyledir:
   - "Merhaba <Ad Soyad>,"
   - "Bu adresle Eğitim Evi'nde hesap açma isteği aldık. Hesabını açmak istiyorsan aşağıdaki bağlantıya tıkla:"
   - bağlantı
   - "Bağlantı 24 saat geçerlidir ve bir kez kullanılabilir."
   - "Bu isteği sen yapmadıysan bu postayı yok say; hesap açılmaz."
   - "Eğitim Evi"
3. Bağlantıya tıkla. Site açılır, anahtar adres çubuğundan hemen silinir.
4. Giriş kartı açılır: "Kullanıcı adı" seçilidir, kutuda kullanıcı adın yazılıdır, üstte yeşil ileti: "Hesabın açıldı.
   Kullanıcı adın: <ad>. Şimdi giriş yapabilirsin."
5. Şifreni yaz, gir ([Giriş](giris.md)). Hesabın rolsüzdür; "+ Ekle" ile başlarsın
   ([Portalı olmayan hesap](../portallar/portalsiz-hesap.md)).

Bağlantı açılamazsa:

- Süresi geçtiyse, daha önce kullanıldıysa ya da anahtar bozuksa kartın üstünde kırmızı: "Bağlantı geçersiz ya da süresi
  dolmuş. Yeniden kayıt ol ya da adresi yeniden değiştir."
- Kayıt beklerken seçtiğin kullanıcı adını başkası aldıysa kayıt kartı açılır, kullanıcı adı kutusunun altında: '"<ad>"
  kullanıcı adı bu arada alınmış. Başka bir adla yeniden kayıt ol.'
- Yazdığın T.C. numarası bu arada başka bir hesaba yazıldıysa kayıt kartında T.C. kutusunun altında: "Bu T.C. kimlik numarası
  kullanılamıyor. Yeniden kayıt ol; T.C. alanını boş bırakabilirsin."
- Adres bu arada başka bir hesaba kaydedildiyse: "Bu e-posta bu arada başka bir hesaba kaydedilmiş."
- Aynı bağlantıdan 15 dakikada 30 hatalı denemede: "Çok fazla hatalı deneme. Biraz bekle."

Bu tarayıcıda zaten başka bir hesapla girmişsen (kayıtlı oturum varsa) onay yine yapılır; sonuç iletisi uygulamanın açılan
sayfasında gösterilir.

### Veli, öğretmen, çalışan, müdür ve eğitmen: e-posta değiştirmek

1. Ayarlar → Giriş bilgileri'nde yeni e-postanı ve şu anki şifreni yaz, kaydet ([Giriş bilgileri](../ayarlar/giris-bilgileri.md)).
2. E-postan hemen değişmez. Yeni adrese posta gider: "Merhaba <Ad Soyad>," / "Eğitim Evi hesabının e-posta adresini bu adres
   yapma isteği aldık. Onaylamak için aşağıdaki bağlantıya tıkla:" / bağlantı / "Bağlantı 24 saat geçerlidir ve bir kez
   kullanılabilir." / "Bu isteği sen yapmadıysan bu postayı yok say; adres değişmez." / "Eğitim Evi".
3. Bağlantıya tıklayınca: "E-posta adresin değişti. Bundan sonra giriş kodları bu adrese gelir." İşlem kaydına "Hesabın
   e-postası değişti" yazılır; yetişkin hesabının kendi işlemi olduğu için kayıt okulsuz düşer, okul yönetimi görmez, yalnız
   sistem yöneticisi görür ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
4. Tıklamazsan eski adres geçerli kalır.

### Öğrenci ve servisçi

Okulun açtığı hesaba okul yönetiminin yazdığı e-posta için onay bağlantısı gitmez; adres okulun Hesap penceresinde doğrudan
yazılır ([Hesap penceresi](../hesaplar/hesap-penceresi.md)). Öğrenci ve servisçi kendi e-postasını Ayarlar'dan değiştiremez.

Tasarımda (Tasarım 1 önizlemesi):

1. Kayıt formunu gönderince kart yana kayar ve **"E-postanı onayla"** ekranı açılır: posta simgesi, "<adres> adresine bir onay
   bağlantısı gönderdik. Hesabın, bağlantıya 24 saat içinde tıklayınca açılır; bağlantı bir kez kullanılır." ve mavi kutuda
   "Gelmediyse istenmeyen (spam) klasörüne bak."
2. Altta **"Bağlantıyı yeniden gönder"**: basınca "Gönderildi · yeniden göndermek için 60 sn" yazar, saniye saniye azalır; 0'da
   yeniden basılır olur. Yanında **"← Girişe dön"**.
3. Bağlantıya tıklamadan, doğru kullanıcı adı ve şifreyle girmeye çalışırsan **"Hesabın henüz açılmadı"** ekranı gelir:
   "Hesabını açmak için <adres> adresine gönderdiğimiz onay bağlantısına tıkla. Hesabın, bağlantıya 24 saat içinde tıklayınca
   açılır; bağlantı bir kez kullanılır." (bugün aynı durumda hesap henüz olmadığı için "Bu kullanıcı adıyla kayıtlı bir hesap
   yok." denir).
4. Bağlantı açılınca giriş sekmesine dönülür, "Kullanıcı adı" seçilir, kutuya kullanıcı adın yazılır, yeşil ileti: "Hesabın
   açıldı. Şimdi kullanıcı adın ve şifrenle giriş yap." İmleç şifre kutusuna gider.
5. Önizlemedeki "Önizleme: e-postadaki bağlantıyı aç" düğmesi yalnız önizlemeye aittir (gerçekte posta açılır).
6. E-posta değiştirmede (Ayarlar): "Yeni adrese doğrulama bağlantısı gider; bağlantıya tıklayınca e-postan değişir. Şifreni
   unutursan sıfırlama bağlantısı bu adrese gelir." Düğme "Doğrulama bağlantısı gönder"; başarıda "<adres> adresine doğrulama
   bağlantısı gitti."

"Bağlantıyı yeniden gönder" bugün kodda yok: kişi aynı adresle yeniden kayıt olur (her yeni kayıt eskisini geçersiz kılar).
Yeniden gönderirken de "aynı adrese saatte en çok 3 posta" kuralı geçerli olmalı (tanımdaki kural; önizlemede yalnız 60 sn
bekleme var).

## Kurallar ve sınırlar

- **Bağlantı 24 saat geçerli, tek kullanımlık.** İki kez tıklanırsa ya da iki sekmede aynı anda açılırsa yalnız biri geçer,
  öbürü "Bağlantı geçersiz ya da süresi dolmuş…" alır.
- **Anahtar** 64 haneli rastgele bir değerdir; veritabanında yalnız özeti tutulur. Bekleyen kayıtlar veritabanındadır, sunucu
  yeniden başlasa da kaybolmaz; 24 saati geçenler temizlikte silinir.
- **Kayıtta aynı adrese saatte en çok 3 posta**. Aşılırsa: "Bu adrese az önce bağlantı gönderdik. Gelen kutunu ve gereksiz
  klasörünü kontrol et."
- **E-posta değişikliği**: sınır adrese değil hesaba bakar: hesap başına saatte 3 onay postası ("Çok sık denedin. Biraz sonra
  tekrar dene."), Giriş bilgileri'nde saatte 10 değişiklik; hesabın bekleyen eski onayları silinir (yalnız son istek geçerli).
  Değişiklik mevcut şifre ister; yeni adres başka hesapta olamaz ("Bu e-posta başka bir hesapta kayıtlı."), alan adı posta
  almalıdır ('"<alan adı>" alan adı e-posta almıyor.').
- **Çakışma denetimi bağlantıda yeniden yapılır**: e-posta, kullanıcı adı ve T.C. bekleme sırasında başkasına geçtiyse hesap
  açılmaz, hangi alan olduğu söylenir; kullanıcı adı ya da T.C. ise kayıt kartında ilgili kutunun altında.
- **Hesap açılınca**: rolsüz, onaylı hesap; yeni kişi kodu; aydınlatma onayının tarihi ve kayıt anındaki metin sürümü yazılır.
  Aynı adresle bekleyen öbür kayıtlar silinir.
- **E-posta ayarlı değilse** (deneme ortamı ya da `.test` gibi teslim edilmeyen alan) posta gönderilmez; bağlantı sunucu
  penceresine yazılır. Canlı sitede e-posta ayarlı olmalıdır ([E-posta sağlığı](../yonetim/eposta-sagligi.md)).
- **Bot sınırı**: 15 dakikada 30 hatalı onay denemesi (doğrular sayılmaz; okul ağından çok kişi aynı anda onaylayabilir).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Giriş ve hesap](README.md)):

- [Kayıt olma](kayit-olma.md) — postayı gönderen form.
- [Giriş](giris.md) — bağlantıdan sonra.
- [İki adımlı giriş](iki-adimli-giris.md) — kodların gittiği adres.
- [Şifremi unuttum](sifremi-unuttum.md) — e-postaya giden öbür bağlantı.
- [Doğrulama ekranlarından vazgeçme](dogrulama-ekranindan-vazgecme.md) — tasarımdaki bekleme ekranından girişe dönmek.

**İlgili:**

- [Giriş bilgileri](../ayarlar/giris-bilgileri.md) — e-posta değiştirme.
- [Hesaba müdahale](../yonetim/hesaba-mudahale.md) — yönetici ya da destekçinin bir kişinin e-postasını değiştirmesi (tasarım).
- [E-posta sağlığı](../yonetim/eposta-sagligi.md) — posta gitmezse.
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) — "Hesabın e-postası değişti".

## Kod tarafı

- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `POST /api/register` (bekleyen kayıt),
  `POST /api/eposta-onay` (`epostaOnayi`: `tur: 'kayit'` ve `tur: 'eposta'`); [sunucu/bolumler/kisilik.md](../../sunucu/bolumler/kisilik.md)
  — `POST /api/hesap/bilgi` (e-posta değişikliği); [sunucu/guvenlik.md](../../sunucu/guvenlik.md) — `onayBaglantisiGonder`,
  `ONAY_OMRU_MS`, `epostaMaskele`, `epostaAlaniVarMi`; [sunucu/veri/depo/onaylar.md](../../sunucu/veri/depo/onaylar.md) —
  `eposta_onaylari` tablosu.
- Ön yüz: [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) — açılışta `#/eposta-onay?t=` anahtarını
  okuyup sunucuya gönderme, sonucu gösterme; [public/js/parcalar/05-giris.md](../../public/js/parcalar/05-giris.md) —
  `kayitBasarili` ("E-postanı kontrol et."), `kayitAlanHatasi` köprüsü.
- Testler: [testler/test-giris-kayit.md](../../testler/test-giris-kayit.md) (onay beklemesi, uydurma ve ikinci kez kullanılan
  anahtar, e-posta değişikliği), [testler/test-cakisma.md](../../testler/test-cakisma.md) (aynı anda iki onay).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Kayıt kuralları").

## Sık sorulanlar

- **Kayıttan sonra e-postama gelen bağlantı ne?** Hesabının sana ait bir adrese açıldığını doğrular; 24 saat içinde tıklayınca
  hesap açılır, bağlantı bir kez kullanılır.
- **Bağlantıya tıkladım, "geçersiz" diyor.** Ya 24 saat geçti ya da bağlantı daha önce kullanıldı (hesabın zaten açılmış
  olabilir: kullanıcı adınla girmeyi dene). Açılmadıysa yeniden kayıt ol.
- **Posta gelmiyor.** Gereksiz (spam) klasörüne bak. Saatte en çok 3 posta gider; biraz bekleyip yeniden dene.
- **E-postamı değiştirdim ama giriş kodu hâlâ eski adrese geliyor.** Yeni adrese giden bağlantıya tıklamadıkça değişiklik
  geçerli olmaz.

## Sırada

- Sistem (e-posta sağlığı): posta gönderilemiyorsa açık ileti ve yöneticiye bildirim; günlük gönderim sayacı.
- Kullanıcı arama ve hesap penceresi: yönetici ve destekçinin bir kişinin e-postasını değiştirmesinde de yeni adrese onay
  bağlantısı; eski adrese "E-postan değiştirildi" bildirimi ve 7 gün "Bu ben değilim, geri al" bağlantısı.
- Çok dil: posta metinleri ve iletiler çeviri kataloğuna.
