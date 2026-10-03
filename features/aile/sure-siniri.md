# Çocuğumun telefonu · Süre sınırı ve aşım bildirimi

**Durum:** Kodda var; tasarımda ek olarak sınır türü seçimi ("Sınır yok" / "Ortak (günlük toplam)" / "Uygulama başına" —
ikisinden biri), dakika kutuları, "Kayıtlı: …" özeti ve kendi "Kaydet"i olan "Süre sınırı" bölümü.

Velinin, çocuğunun günlük toplam ekran süresine ya da tek tek uygulamalara sınır koyması; sınır geçilince veliye günde bir
kez bildirim gitmesi. Hiçbir uygulama kapatılmaz.

## Ne işe yarar

Kullanıcının 26 Eylül sözleri: önce "uygulama başına süre sınırı veya ortak sınır, geçince şu uygulamalar kapansın" dedi,
ardından "uygulama kapatma zaten ağır olur" diyerek kapatmayı bıraktı ve son olarak "veli uygulama başına veya ortak seçsin,
geçince bildirim gelsin" dedi. Sınır bu yüzden yalnız bir uyarıdır: çocuk sınırı geçince sen haberdar olursun, telefon
hiçbir şeyi kilitlemez.

## Nereden açılır

[Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md)'nın en altındaki **"Ayarlar"** kartında, paylaşım ayarlarının
altında:

- **"Günlük toplam sınır (ortak)"** seçim kutusu,
- **"Uygulama başına sınır"** listesi, **"Uygulama seç..."** ve **"Sınır ekle"**,
- kartın en altındaki **"Kaydet"** (paylaşım ayarlarıyla birlikte kaydeder).

Tasarımda (Tasarım 1 önizlemesi): sayfanın üçüncü bölümü **"Süre sınırı"**, kendi "Kaydet"iyle.

## Adım adım

### Veli

**Günlük toplam (ortak) sınır koymak:**

1. "Ayarlar" kartında **"Günlük toplam sınır (ortak)"** kutusunu aç. Seçenekler: "Sınır yok", "30 dk", "1 sa", "1 sa 30 dk",
   "2 sa", "3 sa", "4 sa", "5 sa".
2. Birini seç, **"Kaydet"**e bas. Düğme "Kaydediliyor..." olur; sayfa yenilenir ve yeşil "Kaydedildi. Telefon yeni ayarı en
   geç yarım saat içinde alır." çıkar.
3. "Ekran süresi" kartında bugünün toplamının yanında "bugün · sınır 2 sa" görünür; toplam geçince "Bugünkü toplam sınır
   geçildi." uyarısı ve sınırı geçen günün çubuğu kırmızı olur ([Ekran süresi](ekran-suresi.md)).
4. Sınırı kaldırmak için "Sınır yok"u seçip kaydet.

**Bir uygulamaya sınır koymak:**

1. **"Uygulama seç..."** listesini aç. Listede son 8 günde telefonda en çok kullanılan 30 uygulamadan henüz sınırı
   olmayanlar, bu haftaki süreleriyle durur: "YouTube (bu hafta 4 sa 10 dk)". Telefondan henüz süre gelmediyse liste yerine "Telefondan süre
   geldikçe uygulamalar burada seçilebilir." yazar.
2. Uygulamayı seç, **"Sınır ekle"**ye bas. Listeye o uygulamanın satırı **1 sa** sınırla eklenir, uygulama "Uygulama seç..."
   listesinden çıkar.
3. Satırdaki kutudan süreyi seç: "15 dk", "30 dk", "45 dk", "1 sa", "1 sa 30 dk", "2 sa", "3 sa", "4 sa".
4. Satırı silmek için **"Kaldır"**.
5. **"Kaydet"**. Ekle ve Kaldır yalnız sayfadaki listeyi değiştirir; kaydetmeden çıkarsan gider.
6. "Ekran süresi" kartında o uygulamanın süresinin yanında "/ 1 sa" görünür, sınırı geçince çubuğu kırmızı olur.

Altta hatırlatma: "Sınır geçilince sana bildirim gelir (günde bir kez). Uygulama kapatılmaz."

**Aşım bildirimi:** sınır geçilince bildirim gelir ([Aile bildirimleri](bildirimler.md)):

- toplam sınır: "Elif Yılmaz bugün telefonda toplam 2 sa 40 dk geçirdi (sınır 2 sa)."
- uygulama sınırı: "Elif Yılmaz bugün YouTube uygulamasında 1 sa 20 dk geçirdi (sınır 1 sa)."

Bildirime basınca bu sayfa o çocukla açılır.

Tasarımda (Tasarım 1 önizlemesi):

1. **"Süre sınırı"** bölümünde **"Sınır"** satırı ve tek seçimli üç çip: **"Sınır yok"**, **"Ortak (günlük toplam)"**,
   **"Uygulama başına"**. Kullanıcının sözü "uygulama başına **veya** ortak" olduğu için ikisinden biri seçilir (bugünkü kodda
   ikisi aynı anda konabiliyor).
2. "Ortak (günlük toplam)" seçilince **"Günlük toplam"** kutusu: dakika yazılır (15–720, 15'er adım), yanında "dakika".
3. "Uygulama başına" seçilince son günlerde kullanılan her uygulama için bir kutu (0–720, 15'er adım); boş kutuda soluk
   "sınırsız" yazar, boş ya da 0 sınırsız demektir.
4. Altında bildirim simgesiyle: "Sınır geçilince sana bildirim gelir; uygulama kapatılmaz."
5. Solda kayıtlı olanın özeti: "Kayıtlı: günlük toplam 2 sa", "Kayıtlı: YouTube 1 sa, WhatsApp 30 dk" ya da "Kayıtlı: sınır
   yok"; sağda **"Kaydet"**. Ortak sınır 15 dakikadan azsa kaydetmez, kırmızı "Günlük toplam en az 15 dakika olmalı." der.
   Kaydedince alttan kısa ileti: "Süre sınırı kaydedildi; sınır geçilince bildirim gelir."
6. Bildirim tasarımda çocuğun adıyla başlar: "Can · YouTube günlük sınırı (1 sa) geçti", alt satırı "dün 1 sa 20 dk kullandı ·
   uygulama kapatılmaz".
7. Konum sıklığı bu bölümde değil, telefon bölümündeki çiplerde ve dokununca kaydedilir
   ([Paylaşım ayarları](paylasim-ayarlari.md)).

### Öğrenci

Sınırlardan telefonda bir şey değişmez: hiçbir uygulama kapatılmaz, kilitlenmez, sana uyarı gelmez; aşım bildirimi yalnız
velilerine gider. Telefonun yalnız süreleri gönderir, sınırı sunucu denetler.

## Kurallar ve sınırlar

- **Sunucunun sınırları:** günlük toplam sınır boş (sınır yok) ya da 5–1440 dakika (24 saat) arası tam sayı; değilse "Günlük
  toplam sınır 5 dakika ile 24 saat arasında olmalı". Uygulama sınırı 5–1440 dakika; değilse "Uygulama sınırı 5 dakika ile 24
  saat arasında olmalı". En çok 50 uygulamaya sınır: "En fazla 50 uygulamaya sınır konur". Paket adı bozuksa "Uygulama
  geçersiz". Aynı uygulama iki kez gelirse biri sayılır.
- **Kaydet hepsini birlikte yazar:** paylaşım ayarları, toplam sınır ve uygulama sınırları tek işlemde kaydedilir; uygulama
  sınırları her kayıtta baştan yazılır (listede olmayan silinir).
- **Ne zaman denetlenir:** telefon süreleri gönderdikçe (15 dakikada bir) sunucu bugünün sürelerini sınırlarla karşılaştırır.
  Sınırı yeni koyduysan ya da düşürdüysen bir sonraki gönderimde denetlenir; telefonun yeni ayarı alması beklenmez (yarım
  saat sözü konum sıklığı ve aç/kapa için geçerlidir).
- **Geçmek:** süre sınırdan büyükse (eşitse değil). Toplam sınırın ve her uygulamanın bildirimi ayrı ayrı, her biri **günde
  bir kez** gider (gün Türkiye saatine göre).
- **Kime gider:** çocuğa bağlı, hesabı onaylı bütün velilere; okul görmez.
- **"Ekran süresini paylaş" kapalıyken** süre gelmez, sınır da işlemez.
- **İki veli aynı sınırı paylaşır:** ayar çocuğa bağlıdır; birinin kaydettiği öbürünün ekranını da değiştirir, son kaydeden
  kazanır (kimin kaydettiği sunucuda tutulur, sayfada gösterilmez).
- **Uygulama kapatılmaz:** kullanıcının 26 Eylül kararı; sayfada, kurulum kartında, indir sayfasında ve aydınlatma metninde
  aynı söz geçer.
- **Bilinen sorunlar:**
  - Toplam sınır kutusu yalnız listedeki değerleri sunar; sunucuya başka bir yoldan (ör. doğrudan istekle) 45 dakika
    konmuşsa kutu "Sınır yok" gösterir ve "Kaydet" sınırı kaldırır. Bugün siteden başka bu ayarı yazan yok.
  - "Sınır ekle" ya da "Kaldır"dan sonra "Kaydet"e basmadan başka sayfaya geçersen değişiklik uyarısız kaybolur. Kaldırılan
    uygulama sayfa yeniden açılana kadar "Uygulama seç..." listesine dönmez.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Çocuğumun telefonu](README.md)):

- [Ekran süresi](ekran-suresi.md) — sınırın görüldüğü kart.
- [Aile bildirimleri](bildirimler.md) — aşım bildiriminin metni ve nereye götürdüğü.
- [Paylaşım ayarları](paylasim-ayarlari.md) — aynı "Kaydet"i paylaşan ayarlar.
- [Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md), [Kim görür, ne kadar saklanır](mahremiyet.md).

**İlgili:**

- [Bildirim paneli](../bildirim/bildirim-paneli.md), [Telefon bildirimi](../bildirim/telefon-bildirimi.md).
- [Hatırlatıcılar](../hatirlatici/README.md) — sitenin öbür zamanlı uyarıları.

## Kod tarafı

- Ön yüz: [public/js/parcalar/27b-aile.md](../../public/js/parcalar/27b-aile.md) — `AILE_SINIR` (`[0, 30, 60, 90, 120, 180,
  240, 300]`), `aileAyarKarti(d)` (`#aileToplam`, `#aileSinirlar`, `#aileYeniUyg`), `aileSinirSatiri(s)` (15–240 dakika
  seçenekleri), eylemler `aile-sinir-ekle` (60 dakikalık satır), `aile-sinir-sil`, `aile-kaydet`.
- Sunucu: [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md) — `POST /api/aile/ayar` (`toplamSinir`, `sinirlar`,
  `EN_FAZLA_SINIR` 50, `PAKET` biçimi), `sinirlariDenetle(ogrenci, ayar)`, `sureYaz`, `velilerineBildir`;
  [sunucu/veri/depo/aile.md](../../sunucu/veri/depo/aile.md) — `ayarYaz` (tek işlem, sınırlar baştan), `sinirlari`,
  `uyariIlkMi` (günde bir kez).
- Tablolar: `aile_ayarlari.toplam_sinir`, `aile_sinirlari`, `aile_uyarilari` (anahtar `'toplam'` ya da paket adı; şema 026,
  [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Test: [testler/test-aile.md](../../testler/test-aile.md) — 5 dakikadan kısa sınır ve bozuk paket adı reddi, toplam ve
  uygulama sınırı bildirimi, günde bir kez, bildirimin Aile sayfasına götürmesi.
- Tasarım: Tasarım 1 önizlemesi, öğrenci-veli paketi ("Süre sınırı" bölümü, sınır türü çipleri, özet ve hata iletisi).

## Sık sorulanlar

- **Sınır geçince çocuğumun telefonundaki uygulama kapanır mı?** Hayır. Yalnız sana bildirim gelir.
- **Hem toplam hem uygulama sınırı koyabilir miyim?** Bugünkü sitede evet, ikisi birlikte çalışır. Tasarımda ikisinden biri
  seçilir.
- **Her 15 dakikada bir bildirim mi gelir?** Hayır; her sınır için günde bir kez.
- **Sınırı 45 dakika yapmak istiyorum.** Toplam sınırda bugün 30 dk ve 1 sa var, 45 dk yok; uygulama sınırında 45 dk var.
  Tasarımda dakikayı kendin yazarsın (15'er adım).
- **Öbür velisi sınırı değiştirdi, ben görüyor muyum?** Evet; sayfayı açınca son kaydedilen sınır görünür.

## Sırada

- Velide her çocuk ayrı oturum (kullanıcının 3 Ekim kararı) ve Tasarım 1 düzeni: "Süre sınırı" bölümü, "Sınır yok / Ortak
  (günlük toplam) / Uygulama başına" seçimi, bildirimin başında çocuğun adı.
- Android yerel uygulama (iş 10): uygulamanın veli ekranından sınır koyma.
- Çok dil (iş 22): sınır ve bildirim metinleri.
