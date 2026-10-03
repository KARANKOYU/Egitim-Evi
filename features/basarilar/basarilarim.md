# Başarılar · Başarılarım ve Başarıları

**Durum:** Tasarlandı — henüz kodda yok

Öğrencinin aldığı belgeleri (teşekkür, takdir, yarışma derecesi…) başlığı ve belgenin resmiyle kart kart gösteren sayfa:
öğrencide "Başarılarım", velide "Başarıları".

## Ne işe yarar

Kullanıcı 28 Eylül'de istedi: öğrencinin daha önce aldığı başarılar "bir başlık + bir png, bir belge" olarak öğrencinin
hesabında dursun; müdür başlığa "Teşekkür belgesi" yazar, sınıfı seçer, PNG'yi (JPEG de olur) koyar. 2 Ekim'de görünümü
belirledi: sayfa açılınca belgenin resmi doğrudan görünsün, üstte başlık, altında resim; tıklayınca ayrıntı ("ne zaman
verildi" vb.). Bu sayfa o kartları gösterir; ayrıntı [Başarı penceresi](basari-penceresi.md)'nde.

Belgeler öğrencinin kendisine (hesabına) bağlıdır, okula değil: okul değişse de, yıllar geçse de burada kalır
([Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md)). Öğrenci ve veli bu sayfada yalnız bakar ve indirir; belgeyi okul
ekler ([Başarı ekle](basari-ekleme.md)).

## Nereden açılır

- **Öğrenci:** sol menüde yıldız simgeli **"Başarılarım"** satırı; "Sınavlarım"ın altında, "Etütlerim"in üstünde. Telefonda
  menü ☰ ile soldan açılır, satır aynıdır ([Telefonda menü](../menu-ve-arama/telefonda-menu.md)).
- **Veli:** çocuğunun oturumunda sol menüde **"Başarıları"** satırı; "İlerleyiş"in altında, "Etütler"in üstünde. Velide her
  çocuk ayrı oturumdur; satır o oturumun çocuğunun belgelerini açar. Öbür çocuğa "Portallarım"dan ya da "Çocuklarım"daki
  **"Oturumuna geç"** ile geçilir ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).
- **Öğrencinin portalını açan müdür ya da yetkili:** "Öğrenciler" → öğrenci → **"Portalını aç"**; portalın menüsünde aynı
  "Başarılarım" sayfası ([Öğrencinin portalını açma](../hesaplar/ogrenci-portalini-acma.md)).
- Sayfanın başlığı öğrencide "Başarılarım", velide "Başarıları"; altındaki satır "<öğrencinin adı> · belgeleriyle"
  (ör. "Deniz Aydın · belgeleriyle").

Bugünkü sitede bu sayfa ve menü satırı yok.

## Adım adım

### Öğrenci

1. Menüden **"Başarılarım"**ı aç.
2. Belgeler kart kart, ızgara hâlinde dizilir: geniş ekranda yan yana (kart en az 250 px), telefonda alt alta. Her kartta
   yukarıdan aşağı:
   - **başlık** (kalın; ör. "Okul satranç turnuvası — 1.lik"),
   - **belgenin resmi**: köşeleri yuvarlak, A4 yatay oranında (1,414) bir kutu; resim kutuyu doldurur,
   - belge **PDF** ise resmin sağ üst köşesinde koyu zeminli **"PDF"** etiketi,
   - en altta soluk yazıyla **"<veren kurum> · <verildiği tarih>"** (ör. "Test Ortaokulu · 3 Mart 2026").

   Görüntüsü olmayan belgede kutunun ortasında belge simgesi durur.
3. Fareyle kartın üzerine gelince kart hafifçe büyür ve gölgelenir (hareketi azaltma ayarı açıksa büyümez). Karta tıkla →
   [Başarı penceresi](basari-penceresi.md) açılır: büyük resim, verildiği tarih, veren kurum, o zamanki sınıfın, açıklama,
   ekleyen, **"İndir"**.
4. Kartların altında bilgi notu: "Başarıların hesabına bağlıdır; okul değiştirsen de seninle gelir. Okulun ve öğretmenlerin
   görebilir. Belgeyi ekleyen kurum düzeltir ya da siler."
5. Sayfada ekleme, düzeltme ya da silme düğmesi yok. Belgede bir yanlış görürsen okuluna yaz
   ([Yeni mesaj](../mesaj/yeni-mesaj.md)).

Tasarım 1 önizlemesinde kartlar verildiği tarihe göre yeniden eskiye dizili; yeni eklenen belge en başa gelir. Sıralama
kuralı tanımda ayrıca yazılı değil.

### Veli

1. Çocuğunun oturumunda menüden **"Başarıları"**nı aç (menü satırının adı velide "Başarılarım" değil "Başarıları"dır).
2. Öğrencinin gördüğü kartların ve pencerenin aynısını görürsün; yalnız o oturumun çocuğunun belgeleri.
3. Öbür çocuğunun belgeleri için onun oturumuna geç; iki çocuğun belgeleri tek listede karışmaz.
4. Ekleyemez, düzeltemez, silemezsin. Okul yeni bir belge eklediğinde bildirimi sana da gelir
   ([Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md)).

Not: önizlemede kartların altındaki bilgi notu velide de öğrenciye seslenen cümleyle ("Başarıların hesabına bağlıdır…")
çıkıyor. Kodlanırken velide çocuğa göre söylenmesi önerilir (öneri; kullanıcı ayrıca bir şey demedi).

### Müdür

Müdürün kendi tarafı [Başarılar sayfası](basarilar-sayfasi.md)'dır (okulun bütün öğrencilerinin belgeleri, sınıf sınıf).
Bir öğrencinin sayfasını onun gözünden görmek istersen "Öğrenciler" → öğrenci → "Portalını aç" → "Başarılarım".

### Öğretmen ve çalışan

Tanıma göre öğrencinin öğretmenleri bütün başarılarını görür ([Kimler görür](kimler-gorur.md)). Tasarım 1 önizlemesinde
öğretmenin bu belgelere bakacağı ayrı bir yer çizilmedi. Rolünde "Portalına bakar" yetkisi olan öğretmen ya da çalışan
(ör. "Rehber öğretmen", "Sınıf öğretmeni" şablonları) öğrencinin portalını açıp "Başarılarım" sayfasını öğrencinin gördüğü
gibi görür.

## Kurallar ve sınırlar

- **Liste kişiye bağlı.** Belge öğrencinin hesabına bağlanır, kurumun portalına değil. Öğrencinin birden çok kurumu varsa
  (ör. okul ve dershane) hangi portaldan bakarsa baksın aynı belgeleri görür; başka kurumun eklediği belge de listededir ve
  kartta o kurumun adı yazar ([Öğrencide birden çok kurum](../portallar/ogrencide-portallar.md)).
- **"Son 1 geçmiş yıl" kuralı uygulanmaz.** Öğrenci ve veli eski yılların ödev, not ve devamsızlığını yalnız son bir yıl
  görür; başarılar bu kuralın istisnasıdır, hepsi görünür ([Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).
- **Mezun olunca da durur.** Öğrencinin hiç aktif portalı kalmasa da ana ekranında kişiye bağlı bölümler kalır:
  "Başarılarım", eğitim içerikleri, hatırlatıcılar, ayarlar ([Mezunlar](../egitim-yili/mezunlar.md)).
- **Öğrenci ve veli yalnız görür ve indirir.** Belgeyi ekleyen kurum düzeltir ya da siler.
- **Boş sayfa:** hiç belgesi olmayan öğrencide ne yazacağı (boş durum metni) tasarımda belirlenmedi.
- **Dil:** Tasarım 1'in dil örneğinde "Başarılarım" → "My achievements", "Başarılar" → "Achievements"
  ([Neler çevrilir](../dil/ceviri-kapsami.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Başarılar](README.md)):

- [Başarı penceresi](basari-penceresi.md) — karta tıklayınca açılan ayrıntı.
- [Başarı ekle](basari-ekleme.md) — kartların nereden geldiği.
- [Başarılar sayfası](basarilar-sayfasi.md) — okul tarafındaki liste.
- [Kimler görür](kimler-gorur.md), [Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md),
  ["Başarı ekler" yetkisi](basari-ekleme-yetkisi.md).

**İlgili:**

- [Sol menü](../menu-ve-arama/sol-menu.md) — "Başarılarım" / "Başarıları" satırının yeri.
- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md), [Öğrencide birden çok kurum](../portallar/ogrencide-portallar.md).
- [Mezunlar](../egitim-yili/mezunlar.md), [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md).
- [İlerleyiş](../ilerleyis/README.md) — öğrencinin öbür "kendi sayfası"; başarılar ilerleyiş grafiklerine girmez.

## Kod tarafı

Bugün kodda yok: sunucuda başarı tablosu, `/api` ucu ve ön yüzde sayfa ya da menü satırı bulunmuyor. Kodlanınca dokunacağı
yerler (bugünkü kod belgelerinde bu iş "Başarılarım" diye anılıyor):

- Menü: [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) — yeni sayfa getiren işler menüye satır ekler.
- Öğrenci ve veli sayfaları: [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md) — bu
  belge KILAVUZ'un velinin portalında "başarılar" vaadini de not ediyor.
- Şema: [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) — "başarılarım" yeni tablolar getirecek işler arasında.
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Veli tarafı" bölümü).

## Sık sorulanlar

- **Menümde "Başarılarım" yok.** Bugünkü sitede bu bölüm henüz yok; tasarlandı, kodlanacak.
- **KILAVUZ'da çocuğun portalında "başarılar" yazıyor ama göremiyorum.** KILAVUZ'un "Veli tarafı" bölümü bunu şimdiden
  söylüyor; bugünkü portalda böyle bir sayfa yok. Bölüm kodlanınca doğru olacak.
- **Okul değiştirdim, belgelerim gitti mi?** Hayır. Belgeler senin hesabına bağlı; yeni okulunda da görünür, kartta veren
  kurumun adı yazar.
- **Belgeyi kendim ekleyebilir miyim?** Şimdilik hayır; belgeyi okul ekler. Öğrencinin ya da velinin okul dışı belgelerini
  kendisinin eklemesi kullanıcıya soruldu, karar bekliyor.
- **Belgede yanlış var (ad, tarih).** Ekleyen okula yaz; düzeltme ve silme yalnız onda.
- **Kullanıcı bir ara "başarılar olmasın" demişti?** Ağustos sonunda öyle demişti; 28 Eylül'de bölümü kendisi istedi. Son
  söz geçerli.

## Sırada

- Başarılarım işi (Linux'ta kodlanacak): sayfa, menü satırı, kartlar ve pencere bu belgeye ve Tasarım 1 önizlemesine göre.
- Açık soru: öğrenci ya da veli okul dışı belgesini kendisi ekleyebilsin mi (kartta "veli ekledi" etiketiyle)?
- Boş durum metni ve velide bilgi notunun cümlesi belirlenecek.
- Çok dil: "Başarılarım", "Başarıları", "belgeleriyle" çeviri kataloğuna girecek.
- KVKK: bölüm kodlandığı işte aydınlatma metnine başarı belgeleri satırı eklenecek.
