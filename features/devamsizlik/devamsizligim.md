# Devamsızlık ve yoklama · Devamsızlığım (öğrenci ve veli)

**Durum:** Kodda var; tasarımda ek olarak tarih aralığı, "Gün gün / Ders ders" görünümü, sayılı süzgeç çipleri ve gün sayısıyla özet ("1,5 gün özürsüz devamsızlık"); öğrencinin ana sayfasında "Devamsızlık" kutucuğu; velide her çocuk ayrı oturum (birleşik "Hepsi" listesi kalkar); okulun devamsızlık sınırına yaklaşınca uyarı (velide bildirim ve sayfanın üstünde şerit; öğrenciye yaşına uygun dille bildirim).

Öğrencinin kendi derse katılım kaydını, velinin de çocuğununkini gördüğü sayfa.

## Ne işe yarar

Öğrenci kaç kez gelmediğini, geç kaldığını ve izinli olduğunu; veli de çocuğunun hangi gün hangi derse gelmediğini okula sormadan görür.
Kullanıcı 29 Ağustos'ta velinin çocuklarının devamsızlığını görmesini istedi; 2 Ekim'de belli tarih aralığına bakma, "geldi, geç geldi
vb." diye süzme ve gün gün / ders ders görmeyi ekledi; aynı akşam önizlemede öğrencinin sayfasında "gün ders diye seçme" ve "aralık"
seçimini sordu ("devamsızlığım gün ders diye seçem aralık şeyi nerde"). 3 Ekim'de velide her çocuğun ayrı oturum olmasına karar verdi.

## Nereden açılır

- **Öğrenci:** sol menü **"Devamsızlığım"** (adres `#/devamsizligim`). Bugün öğrencinin ana sayfasında devamsızlık kutucuğu yok.
- **Veli:** sol menü **"Devamsızlık"** (`#/veli-devamsizlik`); ana sayfada **"Devamsızlık — Derse katılım"** kutucuğu. Çocuğun
  portalından da: **"Çocuklarım"** → çocuğun kartı → menüde çocuğun adının altında **"Devamsızlığı"**.
- **Öğretmen ya da müdür olan veli:** menünün altındaki **"Velisi olduğum"** bölümünde **"Devamsızlığı"**.
- **Öğrencinin portalını açan personel** (müdür, "Öğrenci portalına girer" yetkili öğretmen): menüde öğrencinin adının altında
  **"Devamsızlığı"** ([Öğrenci portalını açma](../hesaplar/ogrenci-portalini-acma.md)).
- Okulda "Devamsızlık" bölümü kapalıysa bu satırlar menüden kalkar.

Tasarımda: öğrencinin menüsünde **"Devamsızlığım"**, ana sayfasında **"Devamsızlık — bu dönem 1 gün"** kutucuğu; velinin her
çocuk oturumunda (kullanıcının 3 Ekim 19:10 kararıyla ekranda tek kelime "oturum"; ör. **"Veli · Elif (7-A)"**) menüde **"Devamsızlık"**, ana sayfada **"Devamsızlık — bu dönem 1 gün"** ya da **"bugün 1.
derse geç"** kutucuğu ve **"Bugün olanlar"** kutusunda **"Derse geç kaldı · 1. ders · 5 dakika · Geç"** satırı.

## Adım adım

### Öğrenci (bugünkü site)

1. **"Devamsızlığım"**ı aç. Başlık **"DEVAMSIZLIĞIM"**, altında **"Derslere katılım kaydın."**
2. Üstte dört sayı kutusu: **"Gelmedi"**, **"Geç geldi"**, **"İzinli"**, **"Toplam kayıt"**. Sayılar üstteki eğitim yılı seçicisinde
   bakılan yılın bütün kayıtlarından gelir; her kayıt **bir ders saatidir** (gün değil).
3. Altta kayıtlar, en yeniden en eskiye: üst satırda ders adı ve renkli etiket (**"Gelmedi"** kırmızı, **"Geç geldi"** turuncu,
   **"İzinli"** mavi), alt satırda tarih (`2026-09-25` biçiminde), yoklamayı alan öğretmenin adı ve varsa not.
4. Hiç kaydın yoksa: **"Hiç devamsızlık kaydın yok. Böyle devam."**
5. Eski bir yılı görmek için üstteki eğitim yılı seçicisinden yılı seç ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).

### Veli (bugünkü site)

1. **"Devamsızlık"**ı aç. Başlık **"DEVAMSIZLIK"**, altında **"Çocuklarının derse katılım kayıtları."**
2. Birden çok çocuğun varsa üstte şerit: **"Hepsi"** ve her çocuğun adı (ör. **"Hepsi · Elif Yılmaz · Can Yılmaz"**); bir çocuğa basınca
   sayfa yalnız onunkini gösterir. (Devamsızlık bildirimine basmak bu sayfayı değil **"Çocuklarım"**ı açar.)
3. Her çocuk için bir kart: adı ve **"2 gelmedi"**, **"1 geç geldi"**, **"0 izinli"**.
4. Altta bütün çocukların kayıtları tek listede, en yeniden eskiye; satırın başında çocuğun adı (ilk adı), sonra ders ve renkli etiket,
   alt satırda tarih, yoklamayı alan ve not.
5. Kayıt yoksa: **"Hiç devamsızlık kaydı yok. Böyle devam."** Hiç çocuk bağlı değilse: **"Henüz çocuk eklenmedi. Çocuklarım
   sayfasından veli koduyla ekleyebilirsin."**
6. Çocuğun portalından açılan **"Devamsızlığı"**: başlık **"DEVAMSIZLIK"**, altında **"Elif Yılmaz adına görüntülüyorsun."**; görünüm
   öğrencininkiyle aynı (dört kutu ve liste).

### Personel (bugünkü site)

Öğrencinin portalını açan müdür ya da öğretmen, **"Devamsızlığı"**nda öğrencinin sayfasını veli gibi görür (başlık **"DEVAMSIZLIK"**,
**"<ad> adına görüntülüyorsun."**). Öğrencinin dökümünü görme hakkı yoksa (ör. yalnız "Öğrenci portalına girer" verilmiş, o öğrencinin
dersine girmeyen öğretmen) sayfada **"Bu öğrencinin devamsızlığını görme yetkin yok"** yazar.

### Tasarımda (Tasarım 1 önizlemesi ve kullanıcının 2–3 Ekim kararları)

**Öğrenci**

1. **"Devamsızlığım"** — alt yazı **"Tarih aralığı, gün gün ya da ders ders"**.
2. Üstte **"Başlangıç – Bitiş"** tarihleri ve hazır çipler **"Bugün"**, **"Bu hafta"**, **"Bu ay"**, **"Bu dönem"**; sağda **"Gün gün |
   Ders ders"** seçimi; altında **"Süzgeç"** çipleri sayılarıyla ([Tarih aralığı, gün gün / ders ders, süzgeç](tarih-araligi-ve-gorunum.md)).
3. Özet satırı: **"Bu aralıkta 1,5 gün özürsüz devamsızlık, 1 gün izinli · yarım gün 0,5 sayılır."**
4. **Gün gün** tabloda: **Tarih** ("15 Eylül Pazartesi"), **Günün durumu** ("Geldi", "Geç geldi", "Yarım gün", "Gelmedi", "İzinli"),
   **Ayrıntı** ("1. derse 10 dakika geç", "bütün gün · özürsüz", "4. dersten sonra gitti, 5.–6. derslerde yok"…). Süzgeç seçmeden
   aralığın BÜTÜN günleri, "Geldi" günleri de görünür. Satıra basınca o günün ders ders dökümü açılır ([Günün durumu](gun-durumu.md)).
5. **Ders ders** tabloda: **Tarih**, **Ders** ("3. ders · Matematik"), **Saat** ("10:10–10:50"), **Durum** ("Geldi", "Geç · 10 dk",
   "Gelmedi", "İzinli").
6. Okulun özürsüz devamsızlık sınırına yaklaşınca öğrenciye yaşına uygun dille bir uyarı bildirimi gider; tanım şeridi yalnız velinin
   sayfası için söyler, öğrencinin sayfasında şerit olup olmayacağı kararlaştırılmadı
   ([Devamsızlık sınırı uyarısı](devamsizlik-siniri-uyarisi.md)).

**Veli**

1. Velide her çocuk **ayrı oturum**dur (kullanıcı 3 Ekim 19:10: "hesap = kişi, oturum = rol"): **"Veli · Elif (7-A)"** oturumunda yalnız
   Elif'in kaydı vardır; **"Hepsi"** şeridi ve birleşik liste kalkar. Öbür çocuğa **"Oturum değiştir"** ile geçersin
   ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).
2. **"Devamsızlık"** — alt yazı **"Elif · 7-A · tarih aralığı, gün gün ya da ders ders"**; ekran öğrencininkiyle aynı.
3. Çocuk derse gelmeyince ya da geç kalınca gelen bildirim (ör. **"Can derse geç kaldı"** / **"1. ders · 5 dakika"**) bu sayfayı açar
   (["Gelmedi" bildirimi](devamsizlik-bildirimi.md)).
4. Sınır uyarısı veliye bildirim olarak da gelir, sayfanın üstünde de durur.

## Kurallar ve sınırlar

- **Kim görür:** öğrenci yalnız kendisininkini (başkasınınkini istese **"Bu öğrencinin devamsızlığını görme yetkin yok"**); veli yalnız
  bağlı çocuğununkini; personel kurallara göre ([Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md)). Öğrenci olmayan biri
  öğrencinin kendi ucunu isterse: **"Bu ekran öğrenciler için"**.
- **Bakılan yıl:** liste ve sayılar üstteki yıl seçicisinde bakılan eğitim yılınındır; veli çocuğunun gözünden bakar (çocuğun okulu ve
  nakilse önceki okulları). Tasarımda öğrenci ve veli yalnız **aktif yılı ve bir önceki yılı** görür; daha eskisi için **"Eski yıllar yalnız
  okul yönetimine açık"** ([Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).
- **En çok 200 satır:** liste en yeni 200 kaydı gösterir; sayılar hepsinden. Velinin birleşik listesinde sınır çocuk başınadır (her
  çocuktan en yeni 200, sonra hepsi tarihe göre sıralanır).
- **Sayılar ders saatidir:** "2 gelmedi" iki ders saati demektir, iki gün değil. Gün sayımı tasarımda gelir ([Günün durumu](gun-durumu.md)).
- **Tarih ham yazılır:** öğrencinin ve velinin listesinde tarih `2026-09-25` biçimindedir (müdürün ekranında "25 Eylül 2026, Cuma").
- **Yoklaması alınmamış ders** "Geldi" sayılır, listede görünmez.
- **Nakil:** öğrenci okul değiştirince eski okulun kayıtları eski okulda kalır; öğrenci ve velisi yıl seçicisindeki **"Önceki okullar"**
  döneminden salt okunur görür ([Öğrenci nakli](../hesaplar/ogrenci-nakli.md)).
- **Kayıtlar kendiliğinden silinmez** (öğrencinin ders kayıtları; [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).
  Ders okuldan silinirse kayıt kalır, ders adı yerine **"Ders"** yazar; yoklamayı alan öğretmenin hesabı silinirse adı boş kalır;
  öğrencinin hesabı silinirse devamsızlık kayıtları da silinir.
- **İki okullu veli:** çocuklardan birinin okulu "Devamsızlık"ı kapattıysa menüde "Devamsızlık" yine görünür (öbür okulda açık), ama
  "Hepsi" seçiliyken o çocuğun isteği reddedildiği için sayfanın tamamı **"Devamsızlık bu okulda kapalı. Okul müdürü Özellikler
  sayfasından açabilir."** iletisiyle düşer; açık okuldaki çocuğu şeritten seçince görünür (bilinen açık).
- **Portaldaki boş durum "sen" der:** başkası adına bakarken de boş liste **"Hiç devamsızlık kaydın yok. Böyle devam."** yazar.
- **Tasarımda:** gün sayımında yarım gün 0,5; geç gelmek devamsızlık gününe sayılmaz; "İzinli" ayrı (özürlü) sayılır.

## Kardeşler ve ilgili

**Kardeşler** ([Devamsızlık ve yoklama](README.md)): [Tarih aralığı, gün gün / ders ders, süzgeç](tarih-araligi-ve-gorunum.md) ·
[Günün durumu](gun-durumu.md) · ["Gelmedi" bildirimi](devamsizlik-bildirimi.md) · [Devamsızlık sınırı uyarısı](devamsizlik-siniri-uyarisi.md) ·
[Ders yoklaması](ders-yoklamasi.md) (kaydın nereden geldiği) · [Okulun devamsızlığı](okulun-devamsizligi.md) (düzeltme) ·
[Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md).

**İlgili:** [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md) · [Çocuklarım](../portallar/cocuklarim.md) ·
[Öğrencinin ana sayfası](../ana-sayfa/ogrenci-ana-sayfasi.md) · [Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md) ·
[Velinin bildirimleri](../bildirim/velinin-bildirimleri.md) · [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md) ·
[Öğrenci portalını açma](../hesaplar/ogrenci-portalini-acma.md) · [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) ·
[Etütlerim](../etut/etutlerim.md) (etüt yoklaması ayrı yerde) · [Servisim](../servis/servisim.md) (servis yoklaması ayrı yerde).

## Kod tarafı

- Ön yüz: [public/js/parcalar/18-devamsizlik.md](../../public/js/parcalar/18-devamsizlik.md) — `SAYFALAR.devamsizligim` (öğrencinin
  kendisi ya da portaldaki öğrenci), `devamsizlikGovdesi` (dört sayı kutusu, liste, boş durum);
  [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) — `SAYFALAR['veli-devamsizlik']` (çocuk şeridi,
  çocuk başına kart, birleşik liste), `veliCocukSeridi`, `cocuklarIcin`. Menü [06-menu.md](../../public/js/parcalar/06-menu.md)
  ("Devamsızlığım", "Devamsızlık", "Devamsızlığı"), veli kutucuğu [08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md).
- Sunucu: [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md) — `GET /api/devamsizlik/benim` (yalnız öğrenci),
  `GET /api/devamsizlik/ogrenci?studentId=` (veli, personel), `devamsizlikOzeti` (sayım, en çok 200 kayıt, yıl süzgeci);
  yıl süzgeci [sunucu/bolumler/egitim-yili.md](../../sunucu/bolumler/egitim-yili.md).
- Veri: [sunucu/veri/depo/devamsizlik.md](../../sunucu/veri/depo/devamsizlik.md) (`ogrencinin`).
- Testler: [testler/test-devamsizlik.md](../../testler/test-devamsizlik.md), [testler/test-veli-coklu.md](../../testler/test-veli-coklu.md),
  [testler/test-egitim-yili.md](../../testler/test-egitim-yili.md), [testler/test-nakil.md](../../testler/test-nakil.md),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md), [testler/girdi-denetimi.md](../../testler/girdi-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Veli paneli", "Eğitim yılı").
- Tasarım: Tasarım 1 önizlemesinin öğrenci ve veli sayfaları (ortak devamsızlık ekranı; velide çocuk oturumları).

## Sık sorulanlar

- **"Toplam kayıt 4" ama ben iki gün gelmedim.** Her kayıt bir ders saatidir; iki gün, ikişer derse gelmemek 4 kayıttır. Tasarımda gün
  sayısı ayrıca yazar.
- **Bir kaydı yanlış buluyorum.** Öğretmenine ya da okul yönetimine yaz; düzeltmeyi yoklamayı alan öğretmen ya da müdür yapar.
- **Geçen yılın devamsızlığına nasıl bakarım?** Üstteki eğitim yılı seçicisinden yılı seç; eski yıl salt okunurdur (Sık sorulanlar:
  "Geçmiş eğitim yıllarına bakılabilir mi?").
- **Resmî devamsızlık burada mı?** Hayır; devamsızlığın resmî kaydı e-Okul'dadır. Burası okulun günlük takibidir.
- **İki çocuğum var, ayrı ayrı nasıl görürüm?** Bugün üstteki şeritten çocuğu seç; tasarımda her çocuk ayrı oturumdur, **"Oturum
  değiştir"** ile geçersin.

## Sırada

- **Devamsızlık: tarih aralığı + "gün gün / ders ders" + süzgeç** (kullanıcı 2 Ekim; kod Linux'ta) — bu sayfanın yeni düzeni.
- **Velide her çocuk ayrı oturum** (kullanıcı 3 Ekim) — birleşik "Hepsi" listesinin kalkması.
- **Devamsızlık sınırı uyarısı** (kullanıcı 3 Ekim) — velinin sayfasının üstünde uyarı şeridi, öğrenciye ve veliye bildirim.
- **Optimizasyon + saklama süreleri** — öğrenci ve veli yalnız aktif ve bir önceki yılı görür.
- **Android yerel uygulama** — öğrenci ve velide "Diğer" altında Devamsızlık.
