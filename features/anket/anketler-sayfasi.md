# Anketler · Anketler sayfası

**Durum:** Kodda var; tasarımda ek olarak sayfa "Açtığım anketler", "Taslaklarım" ve "Sana sorulan anketler" diye bölünür, her satırda
durum rozeti ("Yanıtla", "Taslak", "Yanıtladın", "Sonuçlar") durur ve velide her çocuğun anketleri kendi oturumunda görünür (Tasarım 1
önizlemesi).

Menüdeki "Anketler"in açtığı sayfa: sana sorulan anketler, yetkin varsa açtığın (müdürde okulun bütün) anketleri ve tasarımda
taslakların.

## Ne işe yarar

Okul bazen bir gruba kısa bir soru sorar: "Veli toplantısı hangi gün olsun?", "Gezi için hangi gün uygun?". Kullanıcı 26 Eylül'de
sunulan önerilerden "okundu/anket"i seçti (istek denetimindeki "3 4 5 10 9 11" seçimi); anketler o gün kodlandı. Bu sayfa iki işi
bir arada taşır: hedefteki kişi için oy kartları, anketi açan için yönetim listesi. 28 Eylül'de kullanıcı anketin Google Forms gibi
çok sorulu bir düzenleyiciyle kurulmasını istedi; tasarımda sayfa buna göre "Açtığım anketler", "Taslaklarım" ve "Sana sorulan
anketler" bölümlerine ayrılır ([Anket oluştur](anket-olustur.md)).

## Nereden açılır

- **Sol menü:** **"Anketler"** — öğrenci, veli, öğretmen ve müdür menüsünde "Mesajlar"ın hemen altında (Ana Sayfa, Mesajlar,
  Anketler, Takvim, Hatırlatıcılar …). Adres `#/anketler`.
- **Bildirim:** anket açılınca hedefteki herkese gelen **"Anket: <soru>"** bildirimi (zil ve telefon) bu sayfayı açar
  ([Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md)).
- Okul "Anketler" bölümünü kapattıysa menüde görünmez; adres çubuğuna yazılırsa sayfada **"Bu bölüm okulunda kapalı. Okul müdürü
  Özellikler sayfasından açabilir."** yazar ([Kapalı bölüm ne olur](../ozellikler/kapali-bolum.md)).
- Tasarımda menüdeki yeri aynı (Ana sayfa, Mesajlar, Anketler, Takvim, Toplantılar, Hatırlatıcılar …).

## Adım adım

### Öğrenci

**Bugün (kodda):**

1. Menüden **"Anketler"**i aç. Üstte **"ANKETLER"** başlığı ve **"Okulun sana sorduğu sorular. Anket bitene kadar oyunu
   değiştirebilirsin."** yazısı.
2. Sana sorulan her anket bir karttır:
   - kalın harflerle soru;
   - altında **"<açan kişinin adı> · bitiş 12.10.2026 23:59"** (bitmişse **"bitti 12.10.2026 23:59"**); gizli ankette sonuna
     **" · kimin neyi seçtiği görünmez"** eklenir ([Gizli anket](gizli-anket.md));
   - sağda yeşil **"Açık"** ya da gri **"Bitti"** etiketi;
   - anketi açan açıklama yazdıysa sorunun altında açıklama (satır sonları korunur).
3. Açık ankette seçenekler büyük düğmelerdir; oy vermek için [Oy verme ve oyu geri alma](oy-verme.md). Bitmiş ankette düğmelerin yerine
   sonuç çubukları durur ([Sonuçlar](sonuclar.md#öğrenci)).
4. Sıra: önce açık anketler, sonra bitmişler; her grubun içinde bitişi en geç olan en üstte. Listede en çok 80 anket görünür.
5. Hiç anket yoksa ortada kutu: **"Şu an sana açılmış bir anket yok."**

**Tasarımda (Tasarım 1 önizlemesi):**

1. Başlık **"Anketler"**, alt yazı **"Okulun sana sorduğu anketler"**.
2. Kartlar yerine tek bir **"Anketler"** kutusunda satırlar. Her satır: anketin adı; altında **"<kimlere> · <son gün>'e kadar · <N> soru"**
   (bitmişse "<kimlere> · bitti · <N> soru"); sağda durum rozeti:
   - **"Yanıtla"** — henüz başlamadın;
   - **"Taslak"** — "Kaydet, sonra devam et" ile bırakmışsın;
   - **"Yanıtladın"** — gönderdin (bitişe kadar değiştirebilirsin);
   - **"Sonuçlar"** — anket bitti.
3. Örnek satırlar: **"Müze gezisi anketi — 7. sınıf öğrencileri ve velileri · 12 Ekim'e kadar · 4 soru — Yanıtla"**, **"Bilim şenliği
   konusu — 7-A öğrencileri · 20 Ekim'e kadar · 2 soru — Yanıtladın"**, **"Yemek listesi memnuniyeti — bütün okul · bitti · 2 soru —
   Sonuçlar"**.
4. Satıra basınca anket penceresi açılır ([Çok sorulu anketi doldurma](anket-doldurma.md)).

### Veli

**Bugün (kodda):** sayfa öğrencininkiyle aynıdır (başlık, alt yazı, kartlar). Listede bütün çocuklarının okullarından sana açılmış
anketler tek listededir: çocuğunun sınıfına ya da "Öğrenciler"e açılan anket, öğrencilerin velilerine de gittiği için sana doğrudan
gelir. Kartta hangi çocuğun ya da hangi okulun anketi olduğu yazmaz; yalnız açanın adı yazar. Aynı anket iki çocuğun için de sana
geldiyse tek kart ve tek oy vardır. Menüdeki "Anketler", bölüm çocuklarından en az birinin okulunda açıksa görünür.

**Tasarımda (kullanıcının 3 Ekim kararı: velide her çocuk ayrı oturum; Tasarım 1 önizlemesi):** her çocuğun oturumunda yalnız o çocuk
için açılan anketler görünür ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)):

- Elif'in oturumunda alt yazı **"Elif'in velilerine açılan anketler"**; satırlar "Müze gezisi anketi — 7. sınıf öğrencileri ve velileri ·
  12 Ekim'e kadar · 4 soru — Yanıtla" ve "Yemek listesi memnuniyeti — bütün okul · bitti · 2 soru — Sonuçlar".
- Can'ın oturumunda **"Can'ın velilerine açılan anketler"**; satırlar "Sınıf pikniği izni — 5-B velileri · 9 Ekim'e kadar · 4 soru —
  Yanıtla" ve aynı okul anketi.
- Taslak ve gönderilen yanıt oturuma göre ayrı tutulur (Elif'in oturumunda bıraktığın taslak Can'ınkinde görünmez).

### Öğretmen

**Bugün (kodda):**

1. Hedefinde olduğun anketler (ör. müdürün "Öğretmenler"e ya da bütün okula açtığı) öğrencideki gibi kart olarak görünür.
2. Okulun Öğretmen rolünde ya da sana verilen ek rolde **"Sınıfa veya gruba toplu mesaj atar"** yetkisi varsa kartların üstünde ayrı bir
   kart: **"Okula, rol grubuna ya da sınıflara soru sor"** / **"Öğrencilere açılan anket velilerine de gider."** ve sağında **"Yeni anket"**
   ([Anket açma](anket-acma.md)).
3. Kartların altında **"Açtığın anketler"** başlığı ve listesi. Her satır: soru ve **"Açık"**/**"Bitti"** etiketi; altında **"<hedef özeti> ·
   12 / 40 kişi oy verdi · bitiş 12.10.2026 23:59"** (bitmişse "bitti …"); sağda **"Sonuç"**, açıksa **"Bitir"** ve **"Sil"**
   ([Sonuçlar, kim oy verdi, bitirme ve silme](sonuclar.md)). En yeni açılan en üstte, en çok 100 satır.
4. Hazır Öğretmen rolünde bu yetki ilk kurulumda yoktur; müdür eklemedikçe öğretmen yalnız kendisine sorulan anketleri görür.

**Tasarımda (Tasarım 1 önizlemesi):** başlık **"Anketler"**, alt yazı **"Senin açtığın ve sana sorulan anketler"**, sağ üstte
**"Anket oluştur"** ([Anket oluştur](anket-olustur.md)). Sayfa üç kutudur:

- **"Açtığım anketler"** (yanında sayı): satır **"7-A · proje konusu seçimi"**, altında **"7-A öğrencileri · 11 / 28 yanıt · son gün
  9 Ekim"** (gizliyse sonuna " · gizli"), sağda **"Sonuç"** ya da (yanıt yoksa) **"Yanıt yok"**; satıra basınca sonuç penceresi. Boşsa
  **"Henüz yayınladığın anket yok."**
- **"Taslaklarım"** (yanında sayı): satır taslağın adı (adsızsa **"Adsız anket"**), altında **"3 soru · kaydedildi: 3 Ekim 19:40"**, sağda
  çöp kutusu (taslağı sil). Satıra basınca taslak düzenleyicide açılır. Boşsa **"Taslak yok. Anket oluştururken Taslağı kaydet dersen
  burada adıyla durur."**
- **"Sana sorulan anketler"**: ör. **"Öğretmenler · seminer günü"** — **"okul geneli · son gün 12 Ekim"** — **"Oy ver"**; basınca doldurma
  penceresi ([Çok sorulu anketi doldurma](anket-doldurma.md#öğretmen)).

### Çalışan

**Bugün (kodda):** ek görevli kişi öğretmen hesabıyla bir ek rol taşır. Hazır rol şablonlarından **Müdür Yardımcısı**, **Rehber
Öğretmen** ve **Zümre Başkanı**nda "Sınıfa veya gruba toplu mesaj atar" vardır: bu rolü taşıyan kişi "Yeni anket" kartını ve "Açtığın
anketler" listesini görür. Müdür Yardımcısı'nda ayrıca "Okuldaki herkese mesaj atar" olduğu için "Tüm okula" da açabilir
([Özel roller](../roller-yetkiler/ozel-roller.md)). Yetkisi olmayan çalışan yalnız kendisine sorulan anketleri görür.

**Tasarımda:** rolü olan çalışan rolündeki yetkilere göre öğretmen gibi; anket açma ayrı bir **"Anket açar"** yetkisine geçer (öneri;
Tasarım 1'in rol düzenleyicisinde "İletişim" grubunda, "Müdür yardımcısı" şablonunda işaretli). **Rolsüz çalışanın** portalında Anketler
yoktur (tanım: okulun duyuruları, Mesajlar, Takvim, Hatırlatıcılar, Ayarlar dışında bölüm açılmaz;
[Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).

### Müdür

**Bugün (kodda):**

1. "Yeni anket" kartı her zaman görünür (müdürün bütün yetkileri vardır).
2. Kartların altındaki başlık **"Okulun anketleri"**dir: okulda kim açtıysa hepsi (en yeni 100), her satırın sonunda açanın adı
   ("… · bitiş 12.10.2026 23:59 · Ayşe Kaya"). Başkasının açtığı anketi de "Sonuç", "Bitir", "Sil" ile yönetirsin.
3. Bir öğretmen bütün okula anket açtıysa sen de hedeftesin; o anket yukarıda kart olarak görünür ve oy verebilirsin.

**Tasarımda (Tasarım 1 önizlemesi):** alt yazı **"Okulda açılan anketler"**, sağ üstte **"Anket aç"**; satırlar ör. **"Müze gezisi nereye
olsun? — öğrenciler · 268 / 412 oy — Sonuç"**, **"Veli memnuniyeti — veliler · 12 Ekim'e kadar — Açık"**. Önizlemede bu satırlara ve
"Anket aç"a basınca daha eski bir düzenleyici penceresi açılıyor; kullanıcının kararıyla müdür de öğretmenle aynı "Anket oluştur"
sayfasını kullanır ([Anket oluştur](anket-olustur.md#müdür)).

### Servisçi ve yönetici

Menülerinde Anketler yoktur. Adresi elle açsalar da sunucu reddeder ("Bu işlem için yetkin yok"). Servisçi "Tüm okula" açılan bir
ankette hedef listesine yazılır ve bildirimini alır ama sayfayı açamaz ([Anketin kimlere gittiği](kimlere-gider.md#servisçi)).

## Kurallar ve sınırlar

- **Kimler girer:** öğrenci, veli, öğretmen (çalışan) ve müdür. Servisçi ve site yöneticisi giremez. Hesabı onaylanmamış kişi giremez.
- **Liste sınırları:** sana sorulanlardan en çok 80 (açıklar önce); yönetilenlerden en çok 100 (en yeni önce). Eski anketler bu
  sınırların dışında kalınca listeden düşer, silinmez.
- **Hangi okuldan:** sana sorulan anketler hedef listesinden gelir; hangi okulun anketi olduğuna bakılmaz. Sonradan okuldan ayrılsan da
  daha önce hedefinde olduğun anketler listende kalır.
- **Kapalı bölüm:** müdür "Anketler" bölümünü kapatınca menüden kalkar, sunucu bütün anket isteklerine **"Anketler bu okulda kapalı.
  Okul müdürü Özellikler sayfasından açabilir."** der; kayıtlar silinmez, bölüm açılınca geri gelir
  ([Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md)).
- **Yeniden çizim:** oy verince, bitirince ya da silince sayfa sunucudan yeniden okunur; ekranda başka birinin az önce verdiği oy da
  görünür hâle gelir.
- **Yönetilenler listesi:** yalnız anket açma yetkisi olana ya da müdüre dolu gelir. Yetkisi sonradan alınan öğretmen kendi açtığı
  anketin "Sonuç", "Bitir", "Sil" düğmelerini artık göremez (sunucu ona yine izin verir; müdür yönetebilir) — bilinen açık.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Anketler](README.md)):

- [Anket açma](anket-acma.md) — "Yeni anket" penceresi.
- [Oy verme ve oyu geri alma](oy-verme.md) — kartlardaki seçenek düğmeleri.
- [Sonuçlar, kim oy verdi, bitirme ve silme](sonuclar.md) — "Sonuç", "Bitir", "Sil".
- [Anket oluştur](anket-olustur.md), [Çok sorulu anketi doldurma](anket-doldurma.md) — tasarımdaki yeni sayfa düzeninin iki yüzü.

**İlgili:**

- [Sol menü](../menu-ve-arama/sol-menu.md) — Anketler'in menüdeki yeri.
- [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md) — "Anket: <soru>".
- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md).
- [Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md), [Özel roller](../roller-yetkiler/ozel-roller.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19b-anketler.md](../../public/js/parcalar/19b-anketler.md) (`SAYFALAR.anketler`, `anketKarti`,
  `anketDurumEtiketi`), [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (menüdeki "Anketler", `SAYFA_OZELLIK`:
  `anketler → anket`), [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) (`hero`, `bosKutu`, kapalı bölüm
  kutusu), [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`26-anket-okul-hayati.css`).
- Sunucu: [sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md) (`GET /api/anketler` → `{ gelen, yonetilen, olusturabilir }`),
  [sunucu/veri/depo/anketler.md](../../sunucu/veri/depo/anketler.md) (`kisiyeGelenler`, `yonetilenler`),
  [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md) (bölüm kapısı).
- Testler: [testler/test-anket.md](../../testler/test-anket.md), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md) (listeyi
  müdür, öğretmen, öğrenci, veli alır), [testler/test-servis-konum.md](../../testler/test-servis-konum.md) (servisçi giremez).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Anketler ve duyuru okundu bilgisi".

## Sık sorulanlar

- **Menümde "Anketler" yok.** Okulun bölümü kapatmış olabilir ya da servisçi hesabındasın; servisçinin anket sayfası yoktur.
- **"Yeni anket" düğmesini göremiyorum.** Anket açmak için "Sınıfa veya gruba toplu mesaj atar" yetkisi gerekir; müdürüne sor.
- **Veliyim; bu anket hangi çocuğum için?** Bugünkü sitede kart bunu yazmaz; açanın adına ve soruya bak. Tasarımda her çocuğun
  oturumunda yalnız onun anketleri görünür.
- **Eski bir anket listemden kayboldu.** Anketi açan ya da müdür silmiş olabilir; çok eski anketler de 80 anketlik sınırın dışında
  kalır.

## Sırada

- Anket düzenleyici: sayfa "Açtığım anketler", "Taslaklarım", "Sana sorulan anketler" düzenine geçecek; satırlar durum rozetiyle.
- Velide her çocuk ayrı oturum: velinin birleşik anket listesi çocuk oturumlarına bölünecek.
- Özel roller: anket açma ayrı "Anket açar" yetkisine bağlanacak (öneri).
- Optimizasyon + saklama süreleri: anketler bitişinden 1 yıl sonra silinecek.
- Android yerel uygulama: "Anketler (oy ver, sonuç)" bütün rollerde.
- Çok dil: sayfa metinleri çeviri kataloğuna girecek (anketin kendi metni çevrilmez).
