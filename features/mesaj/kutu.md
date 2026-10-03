# Mesajlar · Gelen kutusu ve gönderilenler

**Durum:** Kodda var; tasarımda ek olarak Gmail gibi sık satırlı liste, "Planlanan" kutusu, etiket süzgeçleri, listenin kendi arama kutusu, 50'şerli sayfalama ve WhatsApp gibi toplu seçim (Tasarım 1 önizlemesi ve 1 Ekim kararı).

"Mesajlar" sayfasının listesi: sana gelenler ("Gelen kutusu"), senin gönderdiklerin ("Gönderilenler"), duyuru ya da kişisel mesaja göre süzme ve okunmamış sayısı.

## Ne işe yarar

Okulda herkesin bir mesaj kutusu var: öğretmen veliye yazar, müdür bütün okula duyuru yapar, veli çocuğunun öğretmenine
sorar. Kutu bunların hepsini tek yerde, en yeni üstte toplar. Kullanıcı 1 Ekim'de başka bir okul sisteminin mesaj ekranlarını
gösterip şöyle dedi: "çok mesaj gelecek yılda, ona göre tasarlanacak; Gmail mantığı biraz". Tasarım bu yüzden sık satırlı,
sayfalı ve aranabilir.

## Nereden açılır

- Sol menüde **"Mesajlar"** (öğrenci, veli, öğretmen, müdür ve servisçi menüsünde var). Adres `#/mesajlar`.
- Mesaj ya da duyuru bildirimine basınca da bu sayfa açılır (bildirimin bağlantısı `#/mesajlar`; mesajın kendisi değil, kutu açılır).
- Velinin ana sayfasında **"Mesajlar — Öğretmenlerle yazışma"** kutucuğu ([Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md)).

## Adım adım

### Herkes — bugünkü site

1. Sayfanın başlığı **"MESAJLAR"**, altında **"Okul içi mesajlar ve duyurular."**
2. Üst kartta iki sekme: **"Gelen kutusu"** (okunmamış mesajın varsa yanında sayı rozeti) ve **"Gönderilenler"**; sağda
   **"Yeni mesaj"** düğmesi ([Yeni mesaj ve alıcı seçimi](yeni-mesaj.md)).
3. Altında tür süzgeci: **"Hepsi"** · **"Duyurular"** · **"Kişisel"**. Seçtiğin sekme ve süzgeç koyu görünür; basınca liste
   sunucudan yeniden gelir.
4. Her mesaj bir satır:
   - Gelen kutusunda solda gönderenin baş harfli yuvarlağı, üstte **gönderenin adı**; Gönderilenler'de yuvarlak yok, ad yerine
     **"Alıcı: 7-A, 7-B"** gibi alıcı özeti (en çok 3 kişide adlar, fazlasında "12 kişi"; sınıfta sınıf adları; rol grubunda
     "Öğrenciler, Veliler"; bütün okulda "Tüm okul").
   - Duyuruysa **"Duyuru"** rozeti ([Duyuru](duyuru.md)).
   - Velide çocuğu için geldiyse **"Ada için"** notu (iki çocuğuna birden geldiyse "Ada, Can için") ([Velinin kopyası](velinin-kopyasi.md)).
   - Gönderilenler'de **"12 / 28 okudu"** rozeti; herkes okuduysa yeşil ([Okundu bilgisi](okundu-bilgisi.md)).
   - Sağda tarih ve saat **"12.10.2026 09:14"**; düzeltildiyse yanında **" · düzenlendi"**.
   - Altında **konu** ve metnin ilk 140 harfi.
   - Okunmamış mesajın satırı vurgulu (yalnız gelen kutusunda).
5. Satıra basınca mesaj açılır ([Mesajı okuma](mesaj-okuma.md)).
6. Liste boşsa gelen kutusunda **"Kutun boş. Sana bir mesaj geldiğinde burada görünür."**, Gönderilenler'de **"Henüz mesaj
   göndermedin."**
7. Öğrenci dışındaki herkeste listenin altında **"Bana kim yazabilir?"** kartı durur ([Bana kim yazabilir](bana-kim-yazabilir.md)).

### Veli

Kutunda hem sana yazılanlar hem çocuğuna giden mesajların kopyası durur; kopyanın satırında "Ada için" yazar. Bugün bütün
çocukların kopyası tek kutuda gelir.

### Servisçi

Kutun öbür rollerle aynıdır: okulun bütün okula yaptığı duyurular ve sana yazılanlar gelir. "Yeni mesaj" görünür ama bugün
yazabileceğin kimse listede çıkmaz (bkz. [Yeni mesaj](yeni-mesaj.md) "Bilinen açıklar").

### Tasarımda (Tasarım 1 önizlemesi, kullanıcının 1 Ekim kararı)

- Üstte çipler: **"Gelen · 2"** (okunmamış sayısıyla), **"Gönderilen"**, **"Planlanan · 2"** (öğrencide yok;
  [İleri tarihli gönderim](ileri-tarihli-gonderim.md)); bir ayraç; etiket süzgeçleri **"Hepsi"** · **"Şikâyet · N"** ·
  **"Önemli · N"** · **"Durum · N"** (her etiketin yanında o kutudaki sayısı; [Etiketler](etiketler.md)); sağda **"Yeni mesaj"**.
  Müdürde "Yeni mesaj"ın yanında çark ([Okulun mesaj ayarları](okulun-mesaj-ayarlari.md)).
- Araç satırı: solda **"Hepsini seç"** kutusu, ortada arama kutusu **"Mesajlarda ara (kişi, başlık, yazı)"** (gönderende,
  alıcıda, başlıkta ve metinde; şapkasız da bulur), sağda sayfalama **"1–50 / 2.847 ‹ ›"** (50'şerli; ilk sayfada "‹",
  son sayfada "›" soluk).
- Satır Gmail gibi sık: seçim kutusu · gönderen (altında küçük yazıyla rolü ya da sınıfı, ör. "Öğretmen · Matematik",
  "Veli · Ada Yıldırım (7-A)", "Servisçi · Servis 3") · etiket rozeti + **konu** — açıklamanın başı · ek varsa ataç simgesi +
  zaman ("10:12", "Dün", "30 Eyl"). Gönderilen'de soldaki alan **"Kime: …"**, altında **"gönderdiğin"**. Okunmamış satır kalın.
- Duyurular satırda **"Duyuru"** rozetiyle (önizlemede bu rozet müdürün gönderdiği duyuruda çizildi; örnek gelen duyurular,
  eski "Duyuru" etiketi kalktığı için, "Durum" etiketiyle duruyor); şikâyet satırlarında durum rozeti ("Gönderildi", "Bakıldı", "Çözüldü · yarın
  kalkar") ([Şikâyet etiketi](sikayet-etiketi.md)); velide çocuğa giden kopyanın satırında **"Kopya · Ada"** çipi.
- **Toplu seçim (WhatsApp gibi):** satırdaki kutucukla ya da telefonda satıra **basılı tutarak** (yarım saniye; telefon kısaca
  titrer) seçim başlar. Seçim başlayınca üstte şerit: **"N mesaj seçili"** · **"Sil"** · **"Vazgeç"**; seçimdeyken satıra
  dokunmak mesajı açmaz, seçer ya da seçimi kaldırır. "Hepsini seç" görünen bütün satırları seçer, ikinci basış seçimi
  kaldırır. Silme: [Düzeltme ve silme](duzeltme-ve-silme.md).
- **"Okunmadı olarak işaretle" YOK** (kullanıcı 1 Ekim: "Okunmadı olarak işaretle gereksiz").
- Boş görünüm: **"Bu görünümde mesaj yok."**; etiket süzgecinde **"\"Önemli\" etiketli mesaj yok."** gibi.
- Velide her çocuk ayrı oturum: kopyalar yalnız o çocuğun oturumunda görünür ([Velinin kopyası](velinin-kopyasi.md)).
- Önizlemede "Bana kim yazabilir?" kartı çizilmemiş; kaldırılması için bir karar yok (bugünkü ayar kalır).

## Kurallar ve sınırlar

- **Kim görür:** kutu herkesin kendisinindir; gelen kutusunda alıcısı olduğun, Gönderilenler'de gönderdiğin mesajlar. Müdür
  başkalarının kutusunu göremez.
- **Sayı:** bugün kutuda en yeni **200** kayıt gelir; sayfalama yok. Önizlemedeki metin her satırda ilk 140 harftir.
- **Okunmamış sayısı:** gelen kutusunda henüz açmadığın mesajların sayısı; tür süzgecinden bağımsızdır. Bir mesajı açınca sunucu
  okundu yazar ve zildeki sayı yenilenir.
- **Okundu sayıları yalnız gönderene:** gelen kutusunda "N / M okudu" yoktur; alıcı, velilerin ya da başkalarının okuyup
  okumadığını göremez.
- **Mesajlar kapatılamaz:** bugün Mesajlar, müdürün [Özellikler](../ozellikler/bolum-ac-kapat.md)'den kapatabildiği bölümler
  arasında değil. Tasarım 1 önizlemesinin Özellikler listesinde "Mesajlar" da var (kapatılınca bütün rollerin menüsünden
  kalkar); bunun için tanımda yazılı bir karar yok.
- **Giriş ve okul şartı:** giriş yapmadan **"Giriş yapmalısın"**; onaylanmamış hesapta **"Hesabın henüz onaylanmadı"**;
  okula bağlı olmayan veli **"Önce çocuğunu hesabına bağlaman gerekiyor."**; yönetici hesabı **"Bu işlem bir okula bağlı olmayı
  gerektirir. Yönetici hesabı bir okula ait değildir."**; rolsüz yetişkin **"Hesabın henüz bir okula bağlı değil. Okul yönetimi
  seni ekleyince bu bölüm açılır."**
- **Bilinen açıklar** (kod okumasına göre):
  - Açtığın mesaj pencere kapanınca listede "yeni" (vurgulu) kalır, "Gelen kutusu" rozeti eski sayıda durur; sekme değiştirince
    ya da sayfayı yenileyince düzelir.
  - Üst şeritteki arama kutusu mesajları süzmez ([Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md)).
  - Seçtiğin sekme ve süzgeç çıkışta unutulmaz: aynı sekmede giren sonraki kişi sayfayı "Gönderilenler" ya da "Duyurular" ile
    açabilir (veriler yine kendi hesabınındır).
  - Yeni mesaj gönderince sayfa aynı kutuyla açılır; gelen kutusundaysan gönderdiğin mesajı ancak "Gönderilenler"de görürsün.

## Kardeşler ve ilgili

**Kardeşler:** [Mesajı okuma](mesaj-okuma.md) · [Yeni mesaj ve alıcı seçimi](yeni-mesaj.md) · [Duyuru](duyuru.md) ·
[Okundu bilgisi](okundu-bilgisi.md) · [Düzeltme ve silme](duzeltme-ve-silme.md) · [Velinin kopyası](velinin-kopyasi.md) ·
[Bana kim yazabilir](bana-kim-yazabilir.md) · [Etiketler](etiketler.md) · [İleri tarihli gönderim](ileri-tarihli-gonderim.md).

**İlgili:** [Bildirim paneli](../bildirim/bildirim-paneli.md) (mesaj bildirimleri kutuya götürür),
[Sol menü](../menu-ve-arama/sol-menu.md), [Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md),
[Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md), [Kapalı bölüm](../ozellikler/kapali-bolum.md),
[Android uygulaması](../uygulama/android-uygulamasi.md) (uygulamaya gelecek Mesajlar).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) — `SAYFALAR.mesajlar` (kutu,
  `GET /api/mesajlar?kutu=&tur=` ve `GET /api/mesajlar/ayar` birlikte), `kutuDugme`, `turDugme2`, `mesajSatiri`;
  düğmeler [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`mesaj-kutu`, `mesaj-tur`, `mesaj-ac`);
  menü [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md); velinin kutucuğu
  [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md).
- Sunucu: [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) — `GET /api/mesajlar` (en yeni 200, `okunmamis`,
  `kutuSatiri`: okundu sayıları yalnız Gönderilenler'de); [sunucu/yetki.md](../../sunucu/yetki.md) (`okulGerek`);
  [sunucu/api.md](../../sunucu/api.md) (rolsüz kapısı).
- Depo: [sunucu/veri/depo/mesajlar.md](../../sunucu/veri/depo/mesajlar.md) — `kutuOzeti` (hafif satır: alıcı sayısı, kişi
  sayısı, okuyan sayısı, okundu, `cocuk_icin`), `okunmamisSayisi`; tablolar `mesajlar`, `mesaj_alicilari`, `mesaj_okumalari`
  ([SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Testler: [testler/test-mesaj.md](../../testler/test-mesaj.md), [testler/test-anket.md](../../testler/test-anket.md)
  (`?kutu=giden`), [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Neler var" → İletişim, "Veli paneli").

## Sık sorulanlar

- **Bir mesajı okunmadı yapabilir miyim?** Hayır; kullanıcı bunu gereksiz buldu, tasarımda da yok.
- **Eski mesajlarım nerede?** Bugün kutuda en yeni 200 kayıt görünür. Tasarımda sayfa sayfa geri gidersin ("‹ ›").
- **Kutu neden "Ada için" yazıyor?** Bu mesaj sana değil çocuğuna yazıldı; velisi olduğun için kopyası sana da geldi.
- **Arama kutusuna yazdım, mesajlar süzülmedi.** Üstteki arama bugün mesajlara bakmaz; tasarımda listenin kendi arama kutusu var.

## Sırada

- Mesaj tasarımı (Tasarım 1): sık satırlı liste, Planlanan kutusu, etiket süzgeçleri, liste araması, 50'şerli sayfalama, toplu
  seçim; velide her çocuk ayrı oturum.
- Mesaj etiketleri (Şikâyet, Önemli, Durum) ve "Önemli" etiketinin kutuda üstte ve vurgulu durması.
- Optimizasyon ve saklama süreleri: mesajlar ve duyurular gönderildikten 1 yıl sonra silinecek.
- Android uygulamasına Mesajlar (gelen/giden, yeni mesaj, ekler, okundu).
