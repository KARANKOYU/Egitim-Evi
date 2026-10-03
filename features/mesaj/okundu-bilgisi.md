# Mesajlar · Okundu bilgisi

**Durum:** Kodda var; tasarımda ek olarak duyurunun okundu listesinde "Okumayanlara hatırlat" düğmesi ve "Önemli" etiketli mesajda okundunun zorunlu izlenmesi (kullanıcının 3 Ekim kararı).

Gönderdiğin mesajı ya da duyuruyu kimin okuduğu, ne zaman okuduğu ve kimin henüz okumadığı.

## Ne işe yarar

Öğretmen veli toplantısı duyurusunu velilerin görüp görmediğini, müdür önemli bir duyurunun okula ulaşıp ulaşmadığını bilmek
ister. Okundu bilgisi yalnız gönderene (duyuruda müdüre de) görünür; alıcılar birbirinin okuyup okumadığını göremez.

## Nereden açılır

- "Mesajlar" → **"Gönderilenler"**: her satırda **"12 / 28 okudu"** rozeti.
- Satıra basınca açılan pencerede metnin altında ayrıntılı liste ([Mesajı okuma](mesaj-okuma.md)).

## Adım adım

### Gönderen (öğretmen, müdür, toplu mesaj yetkilisi; öğrenci ve veli de kendi mesajında; servisçi bugün mesaj gönderemez) — bugünkü site

1. "Gönderilenler"de satırda **"12 / 28 okudu"**; herkes okuduysa rozet yeşil.
2. Satıra bas. Metnin ve eklerin altında **"12 / 28 kişi okudu"** ve doluluk çubuğu; liste yüklenirken **"Yükleniyor..."**.
3. Rol düğmeleri (o mesajın alıcısı olan roller, bu sırayla): **"Öğrenciler 12/28"**, **"Veliler 20/30"**, **"Öğretmenler 3/4"**,
   **"Yöneticiler 1/1"**. Birine basınca liste o role süzülür; aynı düğmeye yeniden basınca süzgeç kalkar. Servisçilerin
   düğmesi yoktur ("Tüm okul" duyurusunda listede "Servisçi" diye görünürler ama rol düğmesiyle süzülemezler; kod okumasına göre).
4. Sekmeler: **"Hepsi"** · **"Okuyanlar"** · **"Okumayanlar"**; yanında **"İsim ara"** kutusu (ad, sınıf ve çocuk adında arar;
   şapkasız yazılanı da bulur).
5. Liste: önce okumayanlar, sonra ada göre. Her satırda ad; yanında öğrencide sınıfı ("7-A"), velide **"Ada, Can velisi"**,
   öbürlerinde rolü; sağda okuma zamanı ("12.10.2026 09:30", yeşil) ya da **"okumadı"** (soluk).
6. Seçime uyan kimse yoksa **"Bu seçimde kimse yok."**

### Müdür — duyuruda

Okulda yayımlanan bir duyuruyu açabiliyorsan (alıcıları arasındaysan) aynı listeyi gönderen gibi görürsün.

### Alıcı

Okundu sayıları ve liste alıcıya gösterilmez. Mesajı açtığın anda okundu sayılırsın; geri alınmaz.

### Tasarımda (kullanıcının 3 Ekim kararı)

- Duyurunun okundu listesinde **"Okumayanlara hatırlat"**: yalnız okumayanlara yeniden bildirim gider
  ([Okumayanlara hatırlat](okumayanlara-hatirlat.md)).
- **"Önemli"** etiketli mesaj ya da duyuruda okundu bilgisi zorunlu izlenir ve "Okumayanlara hatırlat" hemen açılır
  ([Önemli etiketi](onemli-etiketi.md)).
- Tasarım 1 önizlemesinin mesaj penceresinde okundu listesi çizilmemiş; kaldırılması için bir karar yok, bugünkü liste kalır.

## Kurallar ve sınırlar

- **Kim görür:** mesajın göndereni; duyuruda ayrıca aynı okulun müdürü. Başkası **"Bu bilgiyi görme yetkin yok"** alır.
  Gelen kutusu satırlarında okundu sayıları hiç gönderilmez (kodun yorumu: alıcı, velilerin ya da başkalarının okuyup okumadığını
  bu sayılardan çıkaramasın).
- **Her mesajda:** okundu bilgisi yalnız duyuruda değil, kişisel mesajda da tutulur ve gönderene gösterilir.
- **Ne sayılır:** her alıcı bir kez sayılır. Velinin iki çocuğu için iki kopyası olsa da tek satırdır ("Ada, Can velisi").
  Velinin okuması öğrencinin okuması sayılmaz; ikisi ayrı satırdır.
- **Sınır yok:** bütün okula giden duyuruda bile bütün alıcılar listelenir.
- **Kutudan kaldıran:** alıcı mesajı "Kutumdan kaldır"la kaldırınca alıcı listesinden çıkar; gönderenin "N / M okudu" sayısında
  M bir azalır (kod okumasına göre).
- **Okuma anı:** alıcı mesajın penceresini ilk kez açtığı an; bildirimi görmesi ya da listede satırı görmesi sayılmaz.
- **Kişisel veri:** okunma zamanı KVKK aydınlatma metninde "Duyuruların okunma zamanı — yalnızca duyuruyu gönderen ve okul müdürü
  görür" diye yazar ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)); kişisel mesajların okunma zamanı da tutulup
  gönderene gösterildiği için metin bunu da söylemeli (rapor edildi).

## Kardeşler ve ilgili

**Kardeşler:** [Okumayanlara hatırlat](okumayanlara-hatirlat.md) · [Duyuru](duyuru.md) · [Önemli etiketi](onemli-etiketi.md) ·
[Mesajı okuma](mesaj-okuma.md) · [Gelen kutusu ve gönderilenler](kutu.md) · [Velinin kopyası](velinin-kopyasi.md) ·
[Düzeltme ve silme](duzeltme-ve-silme.md).

**İlgili:** [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) · [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md) ·
[Anket sonuçları](../anket/sonuclar.md) (ankette de kim oy verdi, kim vermedi) · [Toplantılar](../toplanti/toplantilar.md)
(tasarımda toplantıya kimin "Katıl"a bastığı).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) — `mesajSatiri` ("N / M okudu" rozeti),
  `mesajAc` (`#okumaKap`), `okumaYukle` (`GET /api/mesajlar/okuma?id=`), `okumaCiz` (rol düğmeleri, sekmeler, arama),
  `okumaListeCiz` (süzgeç, sıra), `okumaSekme`, `EYLEMLER['okuma-filtre']`, `EYLEMLER['okuma-rol']`, `OKUMA_ROL_AD`.
- Sunucu: [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) — `okumaGorebilir`, `GET /api/mesajlar/okuma`,
  `GET /api/mesajlar/<id>` (okundu yazma, `kisiSayisi`, `okuyanSayisi`), `kutuSatiri` (sayılar yalnız Gönderilenler'de).
- Depo: [sunucu/veri/depo/mesajlar.md](../../sunucu/veri/depo/mesajlar.md) — `okumaDurumu` (her alıcı bir kez, sınıf, çocuk adları,
  okuma zamanı), `okundu`, `kutuOzeti` (`kisi_sayisi`, `okuyan_sayisi`); tablo `mesaj_okumalari`.
- Testler: [testler/test-mesaj.md](../../testler/test-mesaj.md) (okundu işareti), [testler/test-anket.md](../../testler/test-anket.md)
  (`okuma?id=`).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Anketler ve duyuru okundu bilgisi").

## Sık sorulanlar

- **Velinin okuduğunu nasıl anlarım?** Rol düğmesinden "Veliler"e bas; okuyan velinin yanında saati yazar.
- **Öğrenci mesajımı okudu ama listede "okumadı" diyor.** Mesajı açmadan (yalnız bildirimi görerek) okundu sayılmaz.
- **Alıcılar başkalarının okuyup okumadığını görür mü?** Hayır; bu bilgi yalnız gönderene (duyuruda müdüre de) görünür.

## Sırada

- Duyuruyu okumayanlara hatırlatma ve "Önemli" etiketi (3 Ekim kararı).
- KVKK ve onay metinleri tam denetimi: okunma zamanının kişisel mesajlarda da tutulduğu aydınlatma metnine yazılacak.
- Optimizasyon ve saklama süreleri: okunma satırları mesajla birlikte 1 yıl sonra silinecek.
