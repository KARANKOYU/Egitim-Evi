# Mesajlar · Çocuğa giden mesajın velideki kopyası

**Durum:** Kodda var; tasarımda ek olarak velide her çocuk ayrı oturum (kopya yalnız o çocuğun oturumunda), satırda "Kopya · Ada" çipi ve pencerede "Bu mesaj Ada'ya gönderildi; sana kopyası geldi." notu (Tasarım 1 önizlemesi; kullanıcının 3 Ekim sözü).

Öğrenciye yazılan her mesajın ve duyurunun bir kopyasının onaylı velisinin kutusuna da düşmesi.

## Ne işe yarar

Veli çocuğuna okulda ne söylendiğini görebilmeli. Kullanıcı 29 Ağustos'ta "bi öğrenciye gelen mesaj veliye de gelecek hani
demiştim ya" dedi. Böylece öğretmen öğrenciye "Yarın kesirler quizi var" yazınca velisi de bilir.

## Nereden açılır

Velinin **"Mesajlar"** sayfası → **"Gelen kutusu"**: çocuğa giden mesajların satırında **"Ada için"** notu ([Gelen kutusu](kutu.md)).

## Adım adım

### Veli — bugünkü site

1. Öğretmen çocuğuna (ya da çocuğunun sınıfına, "Öğrenciler" grubuna, bütün okula) yazınca sana bildirim gelir:
   **"<gönderenin adı>: <konu>"** (duyuruda **"Duyuru: <konu>"**).
2. "Mesajlar" → gelen kutusunda satırın üst satırında gönderenin adının yanında **"Ada için"**; iki çocuğuna birden geldiyse
   **"Ada, Can için"** (tek satır).
3. Satıra bas; pencerede mavi bilgi kutusu: **"Bu mesaj çocuğun Ada için gönderildi."**
4. Mesaj sana da "okundu" sayılır; gönderen okundu listesinde seni ayrı satırda **"Ada velisi"** diye görür.
5. İstersen **"Kutumdan kaldır"**: yalnız senin kopyan kalkar (çocuğunki durur).

### Öğrenci

Kendi kutusunda mesajı normal görür; velisine kopya gittiğine dair bir şey yazmaz.

### Gönderen (öğretmen, müdür)

- Mesaj ya da duyuru gönderince iletideki **"N kişiye ulaştı"** sayısı velileri de sayar.
- Okundu listesinde veliler **"Veliler 20/30"** düğmesinde, her biri **"Ada velisi"** diye ayrı satırdır.

### Tasarımda (Tasarım 1 önizlemesi)

- Velide **her çocuk ayrı oturum** (kullanıcı 3 Ekim): çocuğuna giden mesajların kopyası yalnız o çocuğun oturumunda görünür;
  başka çocuğa geçince onunkiler gelir ([Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md)).
- Kopyanın satırında **"Kopya · Ada"** çipi; gönderenin altında **"Ada'ya giden mesajın kopyası"**; **"Kime:"** alanında çocuğun
  adı ve sınıfı ("Ada Yıldırım (7-A)").
- Pencerede bilgilerin altında not: **"Bu mesaj Ada'ya gönderildi; sana kopyası geldi."**
- Bildirimde çocuğun adı başta: **"Ada · Yeni mesaj — <gönderen> · <konu>"** biçiminde (önizlemedeki velinin bildirim listesi).

## Kurallar ve sınırlar

- **Kim alır:** öğrenciye bağlı ve hesabı **onaylı** velileri (anne ve baba ayrı hesapsa ikisi de). Veli bağının ayrıca bir onayı
  yoktur; hesabı onaylı olmayan veli kopya almaz.
- **Hangi mesajlar:** alıcıları arasında öğrenci olan her kişisel mesaj ve duyuru (kişi, sınıf, rol grubu ya da bütün okul hedefi).
  Öğrencinin kendi gönderdiği mesajın kopyası veliye gitmez (kopya yalnız öğrenciye gelenler için).
- **Velinin ayarına bakılmaz:** veli kopyası, velinin "Bana kim yazabilir?" ayarına ve engel listesine takılmaz.
- **İki çocuk:** aynı mesaj iki çocuğa gidiyorsa veli tek satır görür ("Ada, Can için"), tek bildirim alır.
- **Kendi alıcı satırıyla:** veli zaten alıcıysa (ör. "Tüm okul" duyurusu ya da "Veliler" grubu) hem kendisi için hem çocuğu için
  satır açılır ama kutuda tek mesaj görünür; bildirimi de bir kez gelir.
- **Bildirim:** veli doğrudan alıcı olduğu için bildirimi gönderenin metniyle gelir, başına çocuk adı eklenmez (öbür bildirimlerin
  veli kopyalarında başta çocuk adı olur — [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md)).
- **Ekler:** veli kopyasındaki ekleri de indirebilir ([Mesaj ekleri](ekler.md)).
- **Bilinen açık** (kod okumasına göre): çocuğu okulda olan öğretmen ya da müdür, alıcıları arasında kendi çocuğu bulunan bir
  mesaj gönderirse kopyayı kendisi de alır (kendi gelen kutusuna "<çocuk> için" notuyla düşer, zile bildirimi gelir) ve oradan
  silmeye kalkınca onay metni yanıltır ([Düzeltme ve silme](duzeltme-ve-silme.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Gelen kutusu ve gönderilenler](kutu.md) · [Mesajı okuma](mesaj-okuma.md) · [Yeni mesaj ve alıcı seçimi](yeni-mesaj.md) ·
[Duyuru](duyuru.md) · [Okundu bilgisi](okundu-bilgisi.md) · [Bana kim yazabilir](bana-kim-yazabilir.md).

**İlgili:** [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md) · [Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md) ·
[Çocuklarım](../portallar/cocuklarim.md) · [Veli bağlama](../hesaplar/veli-baglama.md) · [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) — `mesajAlicilariCoz` (öğrencilerin onaylı velileri
  `{ id: veliId, ogrenciId }` olarak eklenir; veli kopyası ayar/engel süzgecinden geçmez), `mesajOzeti` / `kutuSatiri` (`cocukIcin`).
- Depo: [sunucu/veri/depo/mesajlar.md](../../sunucu/veri/depo/mesajlar.md) — `mesaj_alicilari (mesaj_id, alici_id, ogrenci_id)`,
  `kutuOzeti` (`cocuk_icin`), `okumaDurumu` (`cocuklar`); [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md)
  (`veliHaritasi`); [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`topluBildir`: kendisi de alan veliye ikinci kopya gitmez).
- Ön yüz: [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) — `mesajSatiri` (`span.cocuk-not`),
  `mesajAc` ("Bu mesaj çocuğun … için gönderildi."), `okumaListeCiz` ("… velisi").
- Testler: [testler/test-mesaj.md](../../testler/test-mesaj.md) (veli kopyası), [testler/test-bildirim.md](../../testler/test-bildirim.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Veli paneli", "Öğrencinin bildirimi veliye de gider").

## Sık sorulanlar

- **Çocuğuma gelen her mesajı görür müyüm?** Evet; çocuğuna gelen her mesajın ve duyurunun kopyası sana da gelir.
- **Çocuğumun öğretmenine yazdığını da görür müyüm?** Hayır; yalnız çocuğuna gelenler kopyalanır.
- **Mesaj almayı kapattım, kopyalar yine geliyor.** Çocuğuna giden mesajların kopyası bu ayardan etkilenmez.

## Sırada

- Velide her çocuk ayrı oturum (3 Ekim): kopyalar yalnız o çocuğun oturumunda; "Kopya · Ada" çipi.
- Optimizasyon ve saklama süreleri: mesajlar ve kopyaları 1 yıl sonra silinecek.
