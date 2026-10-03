# Anketler · Çok sorulu anketi doldurma

**Durum:** Tasarlandı — henüz kodda yok

Katılımcının çok sorulu anketi yanıtlaması: zorunlu soru denetimi, "Kaydet, sonra devam et" ile yarıda bırakma, "Gönder", bitişe
kadar "Yanıtını değiştir".

## Ne işe yarar

Kullanıcının 28 Eylül isteğindeki iki parça: zorunlu ve zorunlu olmayan soru ("google anket gibi"; "Google Forms gibi") ve "kaydedip
devam etme". Tanımdaki biçim: "Doldurma: 'Kaydet, sonra devam et' (taslak, sayılmaz) → 'Gönder'de boş zorunlu soruya götürür; bitişe
kadar değiştirilebilir." Uzun bir anketi (ör. gezi izni ve alerji bilgisi) tek oturuşta bitiremeyen öğrenci ya da veli kaldığı yerden
devam eder; zorunlu soruyu atlayan, gönderirken o soruya götürülür. Bugünkü tek soruluk ankette bunun karşılığı tek tıkla oy vermedir
([Oy verme ve oyu geri alma](oy-verme.md)). Tasarım 1 önizlemesine 3 Ekim'de eklendi (zorunlu soru ve kaydırma, taslağın gerçekten
saklanması, "Kaydet, sonra devam et").

## Nereden açılır

- **Anketler** listesinde anketin satırı; sağdaki rozet duruma göre **"Yanıtla"**, **"Taslak"**, **"Yanıtladın"** ya da **"Sonuçlar"**
  ([Anketler sayfası](anketler-sayfasi.md)).
- Öğretmende "Sana sorulan anketler" kutusunda **"Oy ver"** rozetli satır.
- Anket bir ödeve eklendiyse ödevin içinden: tanımdaki örnek kart metni **"Anketi doldur (3/10)"**; bir mesaja eklendiyse mesajın içinden
  ([Anketi ödeve ya da mesaja ekleme](odeve-mesaja-ekleme.md)). Bu ikisi önizlemede çizilmedi.

## Adım adım

### Öğrenci

**Doldurmak (Tasarım 1 önizlemesi)**

1. Anketler'de **"Yanıtla"** rozetli satıra bas. Pencere açılır: başlık anketin adı; altında soluk satır **"7. sınıf öğrencileri ve
   velileri · 12 Ekim'e kadar · * zorunlu"** (zorunlu işareti kırmızı).
2. Her soru bir kart: soru metni, zorunluysa yanında kırmızı **"*"**; altında türüne göre:
   - **Tek seçim** — yuvarlak düğmeli seçenekler, biri seçilir;
   - **Birden çok seçim** — kutucuklu seçenekler, istediğin kadarı;
   - **Açılır liste** — **"Seç"** ile başlayan liste;
   - **Kısa yanıt** — tek satırlık **"Yanıtın"** kutusu;
   - **Uzun yanıt** — çok satırlı **"Yanıtın"** kutusu.
3. Pencerenin altında iki düğme: **"Kaydet, sonra devam et"** ve **"Gönder"**.

**Yarıda bırakmak**

4. **"Kaydet, sonra devam et"**: o ana kadarki yanıtların taslak olarak saklanır, pencere kapanır, kısa ileti **"Taslak kaydedildi;
   yeniden açınca kaldığın yerden devam edersin."** Listede rozet **"Taslak"** olur.
5. Satırı yeniden açınca yanıtların yerindedir; üst satırın sonunda **" · taslağın yüklendi"** yazar.
6. Taslak sayılmaz: sonuçlara girmez, anketi açan onu görmez (tanım: "taslak, sayılmaz").

**Göndermek**

7. **"Gönder"**: zorunlu bir soru boşsa o kartlar kırmızı çerçeveyle işaretlenir ve altlarında **"Bu soru zorunlu."** yazar; pencere ilk
   eksik soruya kayar, imleç oraya gelir, kısa ileti **"Zorunlu soruyu cevaplamadın."** Yanıtlar gönderilmez.
8. Eksik yoksa yanıtlar gönderilir: pencere kapanır, kısa ileti **"Yanıtların gönderildi."**; taslak silinir, rozet **"Yanıtladın"** olur.

**Gönderdikten sonra**

9. Satırı yeniden açınca yeşil onay kutusu: **"Yanıtın gönderildi. Anket 20 Ekim'de bitene kadar yanıtını değiştirebilirsin; bitince
   sonuçlar açılır."** Altında soru soru gönderdiğin yanıtlar (birden çok seçimde virgülle; boş bıraktığın soruda **"boş bıraktın"**).
   Düğmeler: **"Kapat"** ve **"Yanıtını değiştir"**.
10. **"Yanıtını değiştir"**: form gönderdiğin yanıtlarla dolu açılır, üst satırın sonunda **" · gönderdiğin yanıtı değiştiriyorsun"**;
    düğmeler **"Vazgeç"** (gönderilmiş görünüme döner, hiçbir şey değişmez) ve **"Gönder"**. Zorunlu soru denetimi yine çalışır; başarıda
    kısa ileti **"Yanıtın güncellendi."** Bu kipte "Kaydet, sonra devam et" yoktur.

**Anket bitince**

11. Rozet **"Sonuçlar"** olur; satıra basınca **"Anket bitti · <kimlere> · 412 kişi yanıtladı"** ve sonuç çubukları
    ([Sonuçlar](sonuclar.md#öğrenci)). Artık yanıt verilmez ve değiştirilmez; gönderilmemiş taslak sayılmaz.

Örnek anketler (Tasarım 1 önizlemesi): **"Müze gezisi anketi"** — "Müze gezisi nereye olsun?" (tek seçim, zorunlu: Arkeoloji Müzesi,
Bilim Merkezi, Oyuncak Müzesi), "Hangi günler uygun?" (birden çok seçim: Salı, Çarşamba, Perşembe), "Kaçıncı sınıftasın?" (açılır liste,
zorunlu: 5, 6, 7, 8), "Önerin varsa yaz" (kısa yanıt). **"Bilim şenliği konusu"** — "Bilim şenliğinde hangi konuyu sunmak istersin?"
(tek seçim, zorunlu), "Grup arkadaşların (varsa)" (kısa yanıt).

### Veli

Öğrenciyle aynı pencere ve düğmeler. Tasarımda her çocuğun oturumu ayrıdır: Elif'in oturumunda Elif için açılan anketler, Can'ın
oturumunda Can'ınkiler; taslak ve gönderilen yanıt oturuma göre ayrı tutulur ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

Önizlemedeki izin formu örneği, **"Sınıf pikniği izni"** (5-B velileri · 9 Ekim'e kadar):

- "Can 16 Ekim'deki sınıf pikniğine katılacak mı?" — tek seçim, zorunlu: "Evet, katılacak" / "Hayır, katılmayacak";
- "Getirebileceğiniz şeyler" — birden çok seçim: Meyve, Su, Örtü, Top;
- "Dönüşte kim alacak?" — açılır liste, zorunlu: Servis, Ben alacağım, Başka bir yakını;
- "Alerjisi ya da dikkat edilecek bir durum varsa yaz" — kısa yanıt.

Bugünkü sitede veli, çocukları için açılan anketlerde tek soruluk oy verir ([Oy verme](oy-verme.md#veli)).

### Öğretmen

Sana sorulan anket "Sana sorulan anketler" kutusunda **"Oy ver"** rozetiyle durur; basınca aynı doldurma penceresi açılır. Önizlemedeki
örnek: **"Öğretmenler · seminer günü"** (okul geneli · son gün 12 Ekim) — "Seminer hangi gün olsun?" (tek seçim, zorunlu: 15 Ekim
Perşembe, 16 Ekim Cuma, 19 Ekim Pazartesi) ve "Seminerde konuşulmasını istediğin konu" (uzun yanıt).

### Çalışan

Rolü olan çalışan kendisine sorulan anketi öğretmen gibi doldurur. Rolsüz çalışanın portalında Anketler yoktur (tanım).

### Müdür

Kendisine sorulan bir anket olursa (ör. bütün okula açılmış) aynı pencereyle doldurur. Önizlemede müdüre sorulan anket örneği yok.

## Kurallar ve sınırlar

- **Zorunlu:** zorunlu soru boş gönderilemez — tek seçimde ve açılır listede bir seçim, birden çok seçimde en az bir kutucuk, yazı
  türlerinde boşluk dışında en az bir harf gerekir. Uyarı **"Bu soru zorunlu."**, kısa ileti **"Zorunlu soruyu cevaplamadın."**
- **Taslak sayılmaz:** "Kaydet, sonra devam et" ile saklanan yanıtlar sonuçlara ve katılıma girmez; anket biterken taslakta kalan yanıt
  gönderilmiş sayılmaz. Taslağın sunucuda mı (her cihazdan devam) yoksa yalnız o cihazda mı saklanacağı tanımda yazılmadı; önizlemede
  hesap ve oturuma göre ayrı tutuluyor.
- **Değiştirme:** gönderilen yanıt bitişe kadar değiştirilebilir; yeni gönderim eskisinin yerine geçer (kişi başına tek yanıt).
  Gönderilen yanıtı geri çekme önizlemede ve tanımda yok (bugünkü tek soruluk ankette "Oyumu geri al" var).
- **Yanıt uzunlukları:** kısa ve uzun yanıt için harf sınırı tanımda yazılı değil; kodlamadan önce belirlenmeli.
- **Gizli anket:** kimin ne yazdığı ve neyi seçtiği anketi açana da görünmez ([Gizli anket](gizli-anket.md)).
- **Saklama:** yazılı yanıtlar dahil anket, bitişinden 1 yıl sonra silinir (tanım; [Saklama ve silinme](saklama-ve-silinme.md)).
- **Velinin iki çocuğu:** aynı anket iki çocuğun oturumunda görünüyorsa bir kez mi, çocuk başına mı yanıtlanacağı kararlaştırılmadı.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Anketler](README.md)):

- [Anket oluştur](anket-olustur.md) — soruların, türlerin ve "Zorunlu"nun kurulduğu yer.
- [Oy verme ve oyu geri alma](oy-verme.md) — bugünkü tek soruluk karşılığı.
- [Sonuçlar, kim oy verdi, bitirme ve silme](sonuclar.md) — anket bitince.
- [Anketi ödeve ya da mesaja ekleme](odeve-mesaja-ekleme.md) — ödevden ve mesajdan doldurma.
- [Anketler sayfası](anketler-sayfasi.md) — "Yanıtla", "Taslak", "Yanıtladın", "Sonuçlar" rozetleri.

**İlgili:**

- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md).
- [Quiz çözme](../quiz/quiz-cozme.md) — quizde ise her cevap anında kaydedilir; anketteki "Kaydet, sonra devam et" ayrı bir düzen.
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı bugünkü parçalar:

- Ön yüz: [public/js/parcalar/19b-anketler.md](../../public/js/parcalar/19b-anketler.md) (bugünkü `anketKarti` ve `anket-oy` yerine
  doldurma penceresi).
- Sunucu: [sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md) (bugün `POST /api/anketler/oy`; yeni uçlar: taslak kaydı, yanıt
  gönderme, zorunlu soru denetimi sunucuda da), [sunucu/veri/depo/anketler.md](../../sunucu/veri/depo/anketler.md),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (yanıt ve taslak tabloları).
- Önizlemedeki karşılığı: Tasarım 1 önizlemesinde öğrenci, veli ve öğretmenin anket penceresi.

## Sık sorulanlar

- **Anketi yarıda bıraktım; yazdıklarım gider mi?** "Kaydet, sonra devam et"e bastıysan gitmez; satırı yeniden açınca kaldığın yerden
  devam edersin.
- **Gönderdim, fikrim değişti.** Anket bitene kadar "Yanıtını değiştir" ile yeniden gönderebilirsin.
- **"Gönder"e basıyorum, gönderilmiyor.** Zorunlu (kırmızı yıldızlı) bir soruyu boş bırakmışsın; pencere seni o soruya götürür.
- **Taslağım sayılır mı?** Hayır; yalnız "Gönder" ile gönderilen yanıt sayılır.

## Sırada

- Anket düzenleyici (iş 13): doldurma penceresinin kodlanması; bugünkü tek soruluk anketler tek soruluk form olarak gösterilecek.
- Velide her çocuk ayrı oturum.
- Android yerel uygulama: "Anketler (oy ver, sonuç)".
- KVKK tam denetimi: yazılı ve taslak yanıtlar aydınlatma metnine girecek.
