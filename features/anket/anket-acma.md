# Anketler · Anket açma

**Durum:** Kodda var; tasarımda ek olarak bu pencerenin yerini çok sorulu "Anket oluştur" sayfası alır, anket ileri tarihli
gönderilebilir ve anket açma ayrı bir "Anket açar" yetkisine bağlanır (öneri).

Bugünkü sitedeki "Yeni anket" penceresi: okula, bir rol grubuna ya da sınıflara 2–10 seçenekli tek soruluk bir anket açmak.

## Ne işe yarar

Okul bir gruba kısa bir soru sorar ve cevapları sayar: "Veli toplantısı hangi gün olsun? Pazartesi / Salı", "Gezi için hangi gün
uygun?". Kullanıcı 26 Eylül'de önerilerden "okundu/anket"i seçti; anket aynı gün kodlandı. Kimin oy verebileceği açılış anında
listeye yazılır, öğrencilere açılan anket velilerine de gider (KILAVUZ: "Öğrenciye açılan anket velisine de gider."). Kullanıcı 28
Eylül'de anketin çok sorulu bir düzenleyiciyle kurulmasını onayladı; o iş yapılınca bu pencere [Anket oluştur](anket-olustur.md)
sayfasına dönüşür, bugünkü tek soruluk anketler tek soruluk form olarak korunur.

## Nereden açılır

- **Anketler** sayfasının üstündeki kartta: **"Okula, rol grubuna ya da sınıflara soru sor"** / **"Öğrencilere açılan anket velilerine
  de gider."** → **"Yeni anket"**. Kart yalnız anket açma yetkisi olana görünür.
- Pencerenin başlığı **"Yeni anket"**; alt düğmeler **"Vazgeç"** ve **"Anketi aç"**.
- Tasarımda: Anketler → **"Anket oluştur"** (öğretmen) ya da **"Anket aç"** (müdür, Tasarım 1 önizlemesi) → [Anket oluştur](anket-olustur.md).

## Adım adım

### Müdür

**Bugün (kodda):**

1. Anketler → **"Yeni anket"**. Pencere açılırken okulun sınıf listesi ve "Tüm okula" izni okunur; imleç **"Soru"** kutusundadır.
2. **"Soru"** — yer tutucu **"ör. Okul gezisi için hangi gün uygun?"**; en çok 200 harf.
3. **"Açıklama (isteğe bağlı)"** — iki satırlık kutu, en çok 1000 harf; yazdığın satır sonları kartta korunur.
4. **"Seçenekler"** — iki kutu (**"1. seçenek"**, **"2. seçenek"**), her biri en çok 120 harf. **"Seçenek ekle"** yeni bir kutu açar
   ("3. seçenek" …) ve imleci oraya koyar; 10 kutuya ulaşınca düğme kapanır. Boş kutular sayılmaz; aynı yazılmış iki seçenek (büyük-küçük
   harf ve baştaki/sondaki boşluk farkı gözetilmeden, Türkçe kurallarıyla: "Pazartesi" ile " pazartesi ") bir kez sayılır.
5. **"Kime"** listesi:
   - **"Tüm okula"** — yalnız "Okuldaki herkese mesaj atar" yetkisi olana görünür; müdürde vardır ve ilk seçili gelir;
   - **"Rol grubuna"** — altında kutucuklar: **"Öğrenciler (ve velileri)"**, **"Veliler"**, **"Öğretmenler"**;
   - **"Sınıflara"** — altında okulun her sınıfı bir kutucuk: **"7-A (28 öğrenci)"**; okulda sınıf yoksa **"Sınıf yok."**
   Seçime göre altında yalnız ilgili kutucuklar görünür. Kimin dahil olduğu: [Anketin kimlere gittiği](kimlere-gider.md).
6. **"Bitiş günü"** (takvim kutusu; bugünden 7 gün sonrası dolu gelir) ve **"Bitiş saati"** (**23:59** dolu gelir).
7. İstersen **"Gizli anket (kimin neyi seçtiğini ben de görmeyeyim)"** kutusunu işaretle ([Gizli anket](gizli-anket.md)).
8. **"Anketi aç"**a bas. Düğme **"Açılıyor..."** olur ve istek bitene kadar kilitlenir.
9. Başarıda pencere kapanır, Anketler sayfası yeniden açılır ve üstte yeşil ileti: **"Anket açıldı — 40 kişiye ulaştı."** (sayı, hedef
   listesindeki kişi sayısı). Anket "Okulun anketleri" listesinin en üstündedir.
10. Hedefteki herkese bildirim gider: **"Anket: Okul gezisi için hangi gün uygun?"**; basınca Anketler açılır. Telefon bildirimini açmış
    olanın telefonuna da gelir ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).
11. Bir sorun varsa pencere açık kalır, ileti pencerenin altında kırmızı çıkar ("Soruyu yaz" gibi; liste aşağıda), düğme eski hâline
    döner; düzeltip yeniden "Anketi aç".

**Tasarımda:** anketi [Anket oluştur](anket-olustur.md) sayfasında soru kartlarıyla kurarsın; adı, açıklaması (ortak yazı düzenleyicisiyle),
birden çok soru, "Zorunlu" anahtarı, "Taslağı kaydet" ve "Yayınla" adımında hedef, son gün ve gizlilik. Onaylı "ileri tarihli gönderim"
önerisi anketleri de kapsar ("mesaj/duyuru/anket 'şu gün şu saatte gönder'"); Tasarım 1 önizlemesinde anket sayfası için bu satır
çizilmedi ([İleri tarihli gönderim](../mesaj/ileri-tarihli-gonderim.md)).

### Öğretmen

**Bugün (kodda):** hazır Öğretmen rolünde "Sınıfa veya gruba toplu mesaj atar" yetkisi ilk kurulumda yoktur. Müdür bu yetkiyi okulun
Öğretmen rolüne eklerse ya da sana bu yetkiyi taşıyan bir ek rol verirse (Rehber Öğretmen, Zümre Başkanı, Müdür Yardımcısı
şablonları) Anketler'de "Yeni anket" görünür; adımlar müdürünkiyle aynıdır. Farklar:

- **"Tüm okula"** yalnız "Okuldaki herkese mesaj atar" yetkin de varsa listededir; yoksa "Kime" **"Rol grubuna"** ile açılır ve rol
  kutucukları hemen görünür.
- **"Sınıflara"**da yalnız ders verdiğin sınıflar değil, okulun bütün sınıfları listelenir.
- Başarıda liste başlığı **"Açtığın anketler"**dir.

**Tasarımda (Tasarım 1 önizlemesi):** Anketler → **"Anket oluştur"**; "Yayınla" adımındaki **"Kimler:"** çiplerinde yalnız kendi sınıfların
("7-A öğrencileri", "7-A velileri" …) ([Anketin kimlere gittiği](kimlere-gider.md#öğretmen)).

### Çalışan

**Bugün (kodda):** ek görevli kişi öğretmen hesabıyla ek bir rol taşır; rolünde "Sınıfa veya gruba toplu mesaj atar" varsa öğretmen gibi
anket açar. Rolün ders ve sınıf daraltması anket açmayı daraltmaz: bu yetki ders ya da sınıfa bakılmadan denetlenir, rolü "6-A" ile
sınırlı kişi de bütün sınıfları seçebilir ([Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md)). Müdür Yardımcısı
şablonunda "Okuldaki herkese mesaj atar" da vardır; bu rolü taşıyan "Tüm okula" da açar.

**Tasarımda:** anket açma ayrı bir **"Anket açar"** yetkisine geçer (spec-roller Öneri A, onay bekliyor; Tasarım 1'in rol düzenleyicisinde
"İletişim" grubunda "Anket açar", "Müdür yardımcısı" şablonunda işaretli). Rolsüz çalışan anket açamaz.

### Öğrenci ve veli

Anket açamaz; Anketler sayfasında "Yeni anket" kartı çıkmaz, istek elle gönderilse sunucu da reddeder (**"Anket açma yetkin yok"**).

## Kurallar ve sınırlar

- **Yetki:** "Sınıfa veya gruba toplu mesaj atar" (`mesaj.toplu`). Rol ekranında anketin ayrı bir satırı yoktur; bu yetki toplu mesajla
  birlikte anket açmayı da verir. Bütün okula açmak ayrıca "Okuldaki herkese mesaj atar" (`mesaj.herkese`) ister. Okulu olmayan hesap
  anket açamaz.
- **Hız:** kişi başına saatte en çok 20 anket; fazlasında **"Bu saat içinde çok fazla anket açtın."**
- **Soru:** zorunlu, en çok 200 harf — boşsa **"Soruyu yaz"**. **Açıklama:** isteğe bağlı, en çok 1000 harf.
- **Seçenekler:** en az 2, en çok 10 farklı seçenek, her biri en çok 120 harf — **"En az iki farklı seçenek yaz"**, **"En fazla 10 seçenek
  olabilir"** (pencere zaten 10'dan fazla kutu açmaz).
- **Bitiş:** gün zorunlu — **"Bitiş tarihini seç"**; saat boş ya da bozuksa 23:59 sayılır; okunamayan tarih **"Bitiş tarihi geçersiz"**;
  en az birkaç dakika sonrası olmalı (5 dakika) — **"Bitiş en az birkaç dakika sonrası olmalı"**; en çok 90 gün sonrası — **"Anket en
  fazla 90 gün açık kalabilir"**. Gün ve saat sunucunun saatine göre yorumlanır (sunucu Türkiye saatinde değilse bitiş kayar).
- **Hedef:** kişi seçimiyle anket açılmaz — **"Anketin kime gideceğini seç"**; **"Tüm okula gönderme yetkin yok"**, **"Toplu gönderme
  yetkin yok"**, **"En az bir rol seç"**, **"En az bir sınıf seç"**, **"Sınıf bulunamadı"**, **"Seçtiğin grupta kimse yok"**
  ([Anketin kimlere gittiği](kimlere-gider.md)).
- **Pencerede ön denetim yok:** boş soru, tek seçenek, geçmiş tarih gibi bütün denetimler sunucuda; ileti sunucudan Türkçe gelir.
- **Açıldıktan sonra değişmez:** soru, açıklama, seçenekler, hedef, bitiş ve gizlilik düzeltilemez; yalnız erken bitirme ve silme vardır
  ([Sonuçlar, kim oy verdi, bitirme ve silme](sonuclar.md)).
- **Bildirim:** açılınca hedefteki herkese bir kez "Anket: <soru>". Bitince ya da bitişe az kalınca ayrıca bildirim gitmez.
- **Duyuru gibi:** alıcıların "Bana kim yazabilir?" ayarı ve engel listesi anketi durdurmaz
  ([Bana kim yazabilir](../mesaj/bana-kim-yazabilir.md)).
- **Kapalı bölüm:** okul "Anketler"i kapattıysa **"Anketler bu okulda kapalı. Okul müdürü Özellikler sayfasından açabilir."**
- **İşlem kaydı:** anket açmak, bitirmek ve silmek işlem kaydına yazılmaz ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Anketler](README.md)):

- [Anketin kimlere gittiği](kimlere-gider.md) — "Kime" seçeneklerinin ayrıntısı.
- [Gizli anket](gizli-anket.md) — penceredeki "Gizli anket" kutusu.
- [Oy verme ve oyu geri alma](oy-verme.md) — açılan anket hedefte nasıl görünür.
- [Sonuçlar, kim oy verdi, bitirme ve silme](sonuclar.md) — açtıktan sonra.
- [Anket oluştur](anket-olustur.md) — bu pencerenin tasarımdaki yerine geçen düzenleyici.
- [Anketler sayfası](anketler-sayfasi.md).

**İlgili:**

- [Duyuru](../mesaj/duyuru.md) — anketin hedefi duyurunun kuralıyla çözülür.
- [İleri tarihli gönderim](../mesaj/ileri-tarihli-gonderim.md) — tasarımda anketler de.
- [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md) — "Anket: <soru>".
- [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19b-anketler.md](../../public/js/parcalar/19b-anketler.md) (`anket-yeni`, `anketSecenekKutusu`,
  `anket-secenek-ekle`, `anket-ac`), [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) (`secililer`),
  [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md) (pencere ve iletiler).
- Sunucu: [sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md) (`POST /api/anketler`: yetki, hız, seçenek tekilleştirme, bitiş,
  hedef, bildirim), [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) (`GET /api/mesajlar/hedefler` — sınıf listesi ve
  "Tüm okula" izni; `mesajAlicilariCoz`), [sunucu/yetki.md](../../sunucu/yetki.md) (`mesaj.toplu`, `mesaj.herkese`, şablonlar),
  [sunucu/veri/depo/anketler.md](../../sunucu/veri/depo/anketler.md) (`ekle`: anket, seçenekler ve hedefler tek işlemde),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (şema 006).
- Testler: [testler/test-anket.md](../../testler/test-anket.md) (yetkisiz öğretmen ve öğrenci açamaz, aynı seçenek bir kez, geçmiş ve 120
  günlük bitiş reddi, kişi seçimiyle açılmaz, hedef sayısı), [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Anketler ve duyuru okundu bilgisi".

## Sık sorulanlar

- **Anketi açtım, soruda yazım yanlışı var.** Açılmış anket düzeltilemez. Henüz oy gelmediyse silip yeniden aç; silince oylar da gider.
- **Bitişi uzatabilir miyim?** Bugünkü sitede hayır. Tasarımda ilk yanıttan sonra da "bitiş uzatma" yapılabilecek.
- **Saati yazmazsam ne olur?** Anket o gün 23:59'da biter.
- **Neden 10'dan fazla seçenek ekleyemiyorum?** Tek soruluk ankette en çok 10 seçenek var; daha uzun anketler çok sorulu düzenleyiciyle
  gelecek.
- **Öğretmenim, "Yeni anket" düğmem yok.** Rolünde "Sınıfa veya gruba toplu mesaj atar" yok; müdürün Roller ve Yetkiler'den ekleyebilir.
- **Bir velime ya da tek bir öğrenciye anket açabilir miyim?** Hayır; anket yalnız okula, rol grubuna ya da sınıflara açılır. Tasarımda
  anketi bir mesaja ekleyip mesajın alıcılarına sorabileceksin ([Anketi ödeve ya da mesaja ekleme](odeve-mesaja-ekleme.md)).

## Sırada

- Anket düzenleyici: "Yeni anket" penceresi yerini tam sayfa "Anket oluştur"a bırakacak; bugünkü anketler tek soruluk form olarak
  taşınacak.
- Düzenleyiciler: anket açıklaması ortak yazı düzenleyiciyle; anketler ileri tarihli gönderilebilecek.
- Özel roller: anket açma `mesaj.toplu`'dan ayrılıp "Anket açar" yetkisine geçecek (öneri).
- Bilinen açıklar (kod değiştirilmedi): pencere yalnız sınıf listesi için bütün mesaj rehberini indiriyor; rol grubunda "Yöneticiler"
  seçeneği yok (sunucu kabul ediyor); "Tüm okula" anketi servisçilere de gidiyor ama servisçi anket sayfasını açamıyor.
