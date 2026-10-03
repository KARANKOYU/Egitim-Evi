# Anketler · Anket oluştur

**Durum:** Tasarlandı — henüz kodda yok

Google Forms gibi çok sorulu anket düzenleyicisi: tam sayfa, sırayla soru kartları, beş soru türü, "Zorunlu" anahtarı, "Taslağı
kaydet", "Katılımcı gözüyle önizle" ve "Yayınla".

## Ne işe yarar

Kullanıcı 28 Eylül akşamı önce anketi Excel'le kurmayı sordu, hemen ardından kararını verdi: anket "seçmeli, doldurmalı veya dropdown ve
checkbox", "tek seçmeli, birden fazla seçmeli gibi editörlü"; "bi yer anket oluştur diye, excel ile değil, orada sırayla yaparsın,
sonra taslağı kaydet ile isim vb verebilir"; zorunlu ve zorunlu olmayan soru "google forms gibi"; "sınavları excel le olur". Tanıma
"KULLANICININ KARARI" olarak işlendi (anket Excel'le değil düzenleyiciyle kurulur; Excel quiz ve sınav tarafına kalır). Kullanıcı 28
Eylül gecesi "anket editör — unutma" dedi, 1 Ekim'de yapılacaklar listesine yine "Anket düzenleyici"yi yazdı.

Bugünkü tek soruluk anket ([Anket açma](anket-acma.md)) bu düzenleyiciye dönüşür; eski anketler tek soruluk form olarak korunur (veri
taşınır, kaybolmaz).

## Nereden açılır

- **Yeni anket:** Anketler → sağ üstte **"Anket oluştur"**. Tam sayfa açılır (pencere değil); sayfanın başlığı **"Anket oluştur"**.
- **Taslağı açmak:** Anketler → **"Taslaklarım"** → taslağın satırı. Başlık **"Anketi düzenle"**.
- **Yanıtsız yayındaki anketi düzenlemek:** Anketler → **"Açtığım anketler"** → satır → sonuç penceresindeki **"Düzenle"**. Başlık
  **"Anketi düzenle"**.
- **Ödevden:** ödevin kontrol ekranındaki anket satırı → (taslaksa) **"Düzenle"** ([Anketi ödeve ya da mesaja ekleme](odeve-mesaja-ekleme.md)).

(Tasarım 1 önizlemesi, öğretmen.)

## Adım adım

### Öğretmen

**Anketi kurmak**

1. Anketler → **"Anket oluştur"**. Üst satırda solda **"Anketlere dön"**; açtığın şey bir taslaksa yanında **"Taslak · kaydedildi: 3 Ekim
   19:40"**; sağda **"Katılımcı gözüyle önizle"** ve **"Taslağı kaydet"**.
2. İlk kart anketin kendisi: **"Anketin adı"** kutusu (en çok 120 harf) ve **"Açıklama:"** — ortak yazı düzenleyicisi (kalın, italik,
   liste, bağlantı …; [Yazı düzenleyici](../yazi-yazma/README.md)).
3. Sayfa bir soru kartıyla açılır: tür **"Tek seçim"**, seçenekler **"Seçenek 1"**, **"Seçenek 2"**, "Zorunlu" kapalı.
4. Her soru kartında:
   - sıra numarası ve **"Soru"** kutusu (en çok 300 harf);
   - tür listesi: **"Tek seçim"** (yuvarlak düğmeler), **"Birden çok seçim (kutucuk)"**, **"Açılır liste"**, **"Kısa yanıt"**,
     **"Uzun yanıt (paragraf)"**;
   - seçimli türlerde (tek seçim, birden çok seçim, açılır liste) seçenek satırları: solda türün işareti (yuvarlak ya da kutucuk),
     seçenek kutusu (en çok 200 harf) ve **"×"** (seçeneği sil; tek seçenek kalınca kapalı); altında **"+ Seçenek ekle"** (yeni satır
     "Seçenek 3", "Seçenek 4" … diye gelir);
   - yazı türlerinde seçenek yok; yerinde soluk örnek: **"Kısa yanıt metni"** ya da **"Uzun yanıt metni"**.
5. Türü değiştirince: seçimli bir türe geçerken iki seçenekten azı varsa **"Seçenek 1"**, **"Seçenek 2"** gelir; yazı türüne geçince
   seçenekler görünmez.
6. Kartın altında:
   - **"Zorunlu"** anahtarı (Google Forms gibi; kapalı gelir) — açıkken katılımcı bu soruyu boş bırakıp gönderemez;
   - **"Soruyu yukarı taşı"** / **"Soruyu aşağı taşı"** okları (ilk kartta yukarı, son kartta aşağı kapalı; telefonda sürükleme yerine
     ok — tanım);
   - **"Soruyu kopyala"** — kopyası hemen altına eklenir, kısa ileti **"Soru kopyalandı."**;
   - **"Soruyu sil"** (çöp kutusu; tek soru kalınca kapalı).
7. Kartların altında **"Soru ekle"**: sona boş bir kart (Tek seçim, iki seçenek) eklenir, sayfa ona kayar, imleç soru kutusuna gelir.

Tanımda ayrıca (önizlemede çizilmedi): seçimli sorularda isteğe bağlı **"Diğer: ___"** seçeneği (katılımcı kendi yanıtını yazar); soru
altına açıklama — kullanıcının 30 Eylül'deki "yazı yazarken, ödev vb. her feature ve detayları olacak" isteğiyle tanıma "anket
açıklaması ve anket soru açıklaması" da yazı düzenleyicinin kullanıldığı yerler arasına yazıldı
([Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md)).

**Taslağı kaydetmek**

8. Üstteki **"Taslağı kaydet"**e bas. Anketin adı boşsa sayfanın altındaki kırmızı ileti **"Taslağı adıyla kaydetmek için anketin adını
   yaz."** ve imleç ad kutusuna gider. Ad yazılıysa kısa ileti **"Taslak kaydedildi: <anketin adı>."**; üst satırda **"Taslak · kaydedildi:
   <gün ay saat>"** belirir.
9. Taslak yalnız sana görünür: Anketler → **"Taslaklarım"** kutusunda adıyla durur ("3 soru · kaydedildi: 3 Ekim 19:40"). Aynı taslağı
   yeniden kaydedince güncellenir (yeni taslak açılmaz).
10. Taslağı sonra açmak için "Taslaklarım"daki satıra bas; düzenleyici kaldığın yerden açılır.
11. Taslağı silmek için satırdaki çöp kutusu: **"“<ad>” taslağı silinsin mi?"** / **"Taslak geri getirilemez."** / **"Sil"** → kısa ileti
    **"Taslak silindi."**

**Katılımcı gözüyle önizlemek**

12. Üstteki **"Katılımcı gözüyle önizle"**: sayfa katılımcının göreceği biçime döner. Üstte **"Düzenlemeye dön"** ve **"Önizleme · yanıtlar
    kaydedilmez"**; anketin adı (boşsa **"Adsız anket"**), açıklaması, **"* zorunlu"** notu; her soru (zorunluysa kırmızı yıldızla;
    soru yazılmadıysa **"(soru yazılmadı)"**), tek seçimde yuvarlak düğmeler, birden çok seçimde kutucuklar, açılır listede **"Seç"**, yazı
    türlerinde **"Yanıtın"** kutusu. Önizlemede verdiğin yanıtlar hiçbir yere kaydedilmez.
13. **"Düzenlemeye dön"** ile düzenleyiciye dönersin; yazdıkların yerindedir.

**Yayınlamak**

14. Sayfanın sonundaki **"Yayınla"** kutusu:
    - **"Kimler:"** — ders verdiğin her sınıf için iki çip: **"7-A öğrencileri"**, **"7-A velileri"** …; dokununca seçilir, yeniden
      dokununca kalkar ([Anketin kimlere gittiği](kimlere-gider.md#öğretmen));
    - **"Son gün:"** — takvim düğmesi (seçilmeden **"gg.aa.yyyy"** / **"takvimden seç"**; seçilince tarih ve gün adı). Takvimde bugünden
      önceki günler seçilemez; altında **"Bugün"** ve **"Kapat"**;
    - **"Gizli anket (sonuçlarda kimin ne dediği görünmez)"** ([Gizli anket](gizli-anket.md));
    - düğmeler: **"Ödeve ekle"**, **"Mesaja ekle"**, **"Yayınla"**.
15. **"Yayınla"** önce denetler; ilk eksikte durur, kırmızı iletiyle söyler ve sayfayı hatalı yere kaydırır:
    - **"Anketin adını yaz."**
    - soru kartında **"Soruyu yaz."** ya da seçimli soruda dolu seçenek ikiden azsa **"En az iki seçenek yaz."** (kart kırmızı çerçeveli);
      kutunun iletisi **"2. soruda eksik var."**
    - **"Kimlerin yanıtlayacağını seç."**
    - **"Son günü takvimden seç."**
16. Eksik yoksa anket yayınlanır; Anketler sayfasına dönülür ve kısa ileti: **"Anket yayınlandı: <ad> · <kimler>."** (ör. "Anket
    yayınlandı: Müze gezisi anketi · 7-A öğrencileri, 7-A velileri."). Taslaktan yayınladıysan taslak "Taslaklarım"dan düşer; anket
    "Açtığım anketler"in en üstündedir, rozeti **"Yanıt yok"**.
17. **"Ödeve ekle"** ya da **"Mesaja ekle"**: anket önce sessizce taslak olarak kaydedilir (ad gerekir; boşsa yukarıdaki "Taslağı adıyla
    kaydetmek için …" iletisi) ve "Yeni ödev" ya da "Yeni mesaj" penceresi anket ekli açılır
    ([Anketi ödeve ya da mesaja ekleme](odeve-mesaja-ekleme.md)).

**Yayından sonra düzenlemek**

18. Henüz yanıt gelmediyse: "Açtığım anketler" → satır → sonuç penceresinde **"Henüz yanıt gelmedi; ilk yanıt gelene kadar soruları
    değiştirebilirsin."** ve **"Düzenle"** → düzenleyici **"Anketi düzenle"** başlığıyla açılır; **"Yayınla"** anketi günceller.
19. İlk yanıt geldikten sonra sorular ve seçenekler değişmez (sonuçlar bozulmasın); pencerede **"İlk yanıt geldiği için sorular artık
    değişmez."** ve "Düzenle" yoktur. Tanıma göre bu aşamada yalnız **bitişi uzatma** ve **kapatma** yapılabilir
    ([Sonuçlar](sonuclar.md)).

### Müdür

Tanıma göre müdür de anketi aynı "Anket oluştur" sayfasında kurar; "Yayınla" adımında hedefi bugünkü gibi okul / rol / sınıf seçer.

Tasarım 1 önizlemesinde müdürün Anketler sayfasındaki **"Anket aç"** düğmesi (ve satırları) bu sayfanın değil daha eski bir **pencere**
sürümünü açıyor: başlık **"Anket aç"**, sağ üstte **"Excel'den aktar"**, **"Başlık:"** ("Müze gezisi anketi"), **"Açıklama:"** (yazı
düzenleyici), **"Kimler:"** ("7. sınıf öğrencileri" çipi ve "+ ekle"), **"Son gün:"** ("12 Ekim 2026 · 23:59"), soru kartları (türler
"Tek seçim", "Çoklu seçim (kutucuk)", "Açılır liste", "Kısa yanıt", "Uzun yanıt"; "Zorunlu" kutucuğu; soruyu ve seçeneği sil;
"+ Seçenek ekle"), **"Soru ekle"**, **"Taslağı kaydet"** ("Taslak kaydedildi; sonra devam edebilirsin.") ve **"Yayınla"** ("Anket
yayınlandı; ödeve ya da mesaja ek olarak da koyabilirsin."). Kullanıcının kararı bunun yerine geçer: anket **Excel'le kurulmaz**
("Excel'den aktar" yapılmaz) ve düzenleyici **tam sayfadır**; müdür de öğretmenin sayfasını kullanır. Müdürün hedef seçimi (okul / rol /
sınıf) "Kimler:" çiplerinde nasıl gösterileceği önizlemede çizilmedi.

### Çalışan

Rolünde anket açma yetkisi olan çalışan öğretmen gibi kullanır. Tasarımda bu ayrı bir **"Anket açar"** yetkisidir (spec-roller Öneri A,
onay bekliyor; Tasarım 1'in rol düzenleyicisinde "İletişim" grubunda). Rolsüz çalışan anket oluşturamaz.

### Öğrenci ve veli

Anket oluşturamaz; Anketler'de "Anket oluştur" düğmesi yoktur.

## Kurallar ve sınırlar

- **Excel yok:** anket Excel'den kurulmaz (kullanıcının 28 Eylül kararı). Excel'den aktarma quiz soruları ve sınav tarafındadır
  ([Soruları Excel'den aktarma](../quiz/excelden-soru-aktarma.md), [Notları Excel'den yükleme](../sinav/excelden-not.md)).
- **Tam sayfa:** düzenleyici pencere değil, kendi sayfasıdır (tanım).
- **Uzunluklar (Tasarım 1 önizlemesi):** anketin adı 120, soru 300, seçenek 200 harf. Soru ve seçenek sayısı üst sınırı tanımda yazılı
  değil; kodlamadan önce belirlenmeli (Excel önerisinde "en çok 50 soru, soru başına en çok 20 seçenek" önerilmişti; bugünkü tek soruluk
  ankette 2–10 seçenek ve en çok 90 gün).
- **Seçimli soru:** en az iki dolu seçenek. **Zorunlu:** varsayılan kapalı.
- **Taslak:** yalnız oluşturana görünür, adla kaydedilir; bir taslak yayınlanınca "Taslaklarım"dan düşer.
- **Kilit:** ilk yanıt gelince sorular ve seçenekler değişmez; yalnız bitiş uzatma ve kapatma (tanım).
- **Yetki:** bugün anket açma "Sınıfa veya gruba toplu mesaj atar"a bağlı; tasarımda "Anket açar" (öneri). Öğretmen anketi kendi
  ödevine toplu mesaj yetkisi olmadan ekleyebilir (tanım); mesaja eklemede yetkinin ne olacağı tanımda yazılmadı.
- **Son gün:** önizlemede yalnız gün seçilir; saat çizilmedi (bugünkü sitede gün + saat, varsayılan 23:59). Bugünkü 90 günlük üst sınırın
  kalıp kalmayacağı tanımda yazmıyor.
- **İleri tarihli gönderim:** onaylı öneri anketleri de kapsar ("mesaj/duyuru/anket 'şu gün şu saatte gönder'"); "Yayınla" adımında
  nasıl görüneceği önizlemede çizilmedi ([İleri tarihli gönderim](../mesaj/ileri-tarihli-gonderim.md)).
- **Bildirim:** tanımda yayınlama bildirimi ayrıca yazılmadı; bugünkü sitede açılınca hedefe "Anket: <soru>" gider.
- **Eski anketler:** bugünkü tek soruluk anketler tek soruluk form olarak korunur (veri taşınır).
- **KVKK:** yazılı yanıtlar ve doldururken kaydedilen taslak yanıtlar yeni kişisel veri türleridir; aynı işte aydınlatma metni ve onay
  sürümü güncellenir (kalıcı kural).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Anketler](README.md)):

- [Çok sorulu anketi doldurma](anket-doldurma.md) — katılımcının gördüğü.
- [Anketi ödeve ya da mesaja ekleme](odeve-mesaja-ekleme.md) — "Ödeve ekle", "Mesaja ekle".
- [Sonuçlar, kim oy verdi, bitirme ve silme](sonuclar.md) — yayından sonra.
- [Gizli anket](gizli-anket.md), [Anketin kimlere gittiği](kimlere-gider.md).
- [Anket açma](anket-acma.md) — bugünkü tek soruluk pencere.
- [Anketler sayfası](anketler-sayfasi.md) — "Açtığım anketler", "Taslaklarım".

**İlgili:**

- [Yazı düzenleyici](../yazi-yazma/README.md) — açıklama alanı.
- [Ödeve quiz ekleme](../quiz/quiz-ekleme.md), [Önizle](../quiz/onizle.md), [Soru türleri](../quiz/soru-turleri.md) — quiz düzenleyicisiyle
  benzer düşünce, ayrı ekran.
- [İleri tarihli gönderim](../mesaj/ileri-tarihli-gonderim.md).
- [Özel roller](../roller-yetkiler/ozel-roller.md), [Yetki listesi](../roller-yetkiler/yetki-listesi.md) — "Anket açar".
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı bugünkü parçalar:

- Ön yüz: [public/js/parcalar/19b-anketler.md](../../public/js/parcalar/19b-anketler.md) (Son durum: "Bu dosyanın büyük kısmı yeniden
  yazılacak"; "Yeni anket" penceresinin yerine yeni sayfa), [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md),
  [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) (yeni sayfa adresi).
- Sunucu: [sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md) (bugün tek soru; yeni uçlar: taslak, soru listesi, düzenleme kilidi,
  bitiş uzatma), [sunucu/veri/depo/anketler.md](../../sunucu/veri/depo/anketler.md),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (yeni şema numarası; şema 006'daki tek soruluk anketin taşınması),
  [sunucu/yetki.md](../../sunucu/yetki.md) ("Anket açar" önerisi), [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) (yedeğe
  yeni tablolar).
- Önizlemedeki karşılığı: Tasarım 1 önizlemesinde öğretmenin "Anketler" ve "Anket oluştur" sayfaları.
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Anketler ve duyuru okundu bilgisi" yeniden yazılacak.

## Sık sorulanlar

- **Soruları Excel'den aktarabilir miyim?** Hayır; kullanıcının kararıyla anket düzenleyicide sırayla kurulur. Excel quiz soruları için.
- **Taslağımı başkası görür mü?** Hayır; taslaklar yalnız oluşturana görünür.
- **Yayınladım, bir soruyu düzeltmem gerek.** Henüz yanıt gelmediyse "Düzenle"; ilk yanıt geldiyse sorular değişmez (sonuçlar
  bozulmasın). Bitişi uzatabilir ya da anketi kapatabilirsin.
- **"Zorunlu" ne işe yarar?** Katılımcı o soruyu boş bırakıp "Gönder"e basamaz; ilk eksik soruya götürülür.
- **Benzer bir soruyu yeniden yazmadan çoğaltabilir miyim?** Evet, "Soruyu kopyala".
- **Bütün bir anketi kopyalayıp yeniden kullanabilir miyim?** Bu ("Anketi kopyala / şablon") ve "koşullu soru" (cevaba göre sonraki
  soru) kullanıcıya öneri olarak sunuldu, onay bekliyor.

## Sırada

- Anket düzenleyici (iş 13; kullanıcı 28 Eylül'de onayladı): bu sayfanın kodlanması, eski anketlerin taşınması.
- Düzenleyiciler: açıklama ve soru açıklaması için ortak yazı düzenleyici; ileri tarihli gönderim.
- Özel roller: "Anket açar" yetkisi (öneri).
- KVKK tam denetimi: yazılı ve taslak yanıtlar için aydınlatma metni.
- Android yerel uygulama, Çok dil.
