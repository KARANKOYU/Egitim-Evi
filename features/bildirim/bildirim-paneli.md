# Bildirimler · Bildirim paneli (zil)

**Durum:** Kodda var; tasarımda ek olarak tür sekmeleri, "Tümünü okundu say", bildirimlerin tek tek okundu sayılması, satırda
ayrıntı ve uzun tarih, arkası kararan büyük panel ve birden çok kurumda kurum adı.

Sağ üstteki zil: okunmamış bildirimlerinin sayısını gösterir; basınca son bildirimlerin listesi açılır, bir satıra basınca o
bildirimin sayfasına gidersin.

## Ne işe yarar

Eğitim Evi'nde sana gelen her kısa haber (yeni ödev, ödev sonucu, sınav sonucu, mesaj, duyuru, devamsızlık, servis, hatırlatma,
okulunun seni eklemesi…) burada toplanır. Telefon bildirimini açmasan da hiçbir bildirim kaybolmaz: hepsi zilde durur
([Telefon bildirimi](telefon-bildirimi.md) yalnız aynı bildirimi telefonuna da düşürür). Hangi olayda hangi metnin geldiği
[Bildirim türleri ve metinleri](bildirim-metinleri.md)'nde.

## Nereden açılır

- Giriş yaptıktan sonra her sayfada üst şeridin sağındaki **zil** düğmesi (düğmenin adı "Bildirimler"). Okunmamış bildirim varsa
  zilin köşesinde sarı (vurgu renginde) küçük bir sayı (rozet) durur; 99'dan çoksa **"99+"** yazar.
- Ayrı bir adresi yoktur; panel bulunduğun sayfanın üstünde açılır.
- Tasarımda zil üst şeridin sağında, sırayla "+ Ekle" (yetişkin hesabında) · "Destek" · dil (TR ▾) · tema · **zil** · profil
  düğmelerinin arasında durur; üst şerit tanımına göre telefonda şeritte yalnız ☰ · ⌂ · zil · profil kalır
  ([Üst şerit](../menu-ve-arama/ust-serit.md)).

## Adım adım

### Herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, sistem yöneticisi) — bugünkü site

1. Zile bas. Elindeki liste hemen açılır; aynı anda sunucuya "yeni bildirim var mı" diye sorulur, yeni geldiyse liste
   kendiliğinden tazelenir.
2. Her satırda bildirimin metni, altında gün ve saati yazar: "03.10.2026 18:40". Henüz okunmamış satırlar vurgulu ("yeni")
   görünür. En yeni bildirim en üsttedir; panelde en çok **son 100** bildirim görünür.
3. Bildirimin gideceği bir sayfa varsa satır tıklanır. Satıra bas: panel kapanır, ilgili sayfa açılır. Örnekler:
   "Yeni ödev: Sayfa 42 (Matematik)" → **Ödevler**; "Duyuru: Veli toplantısı" → **Mesajlar**; "Bugün 09:20 Matematik dersi:
   Gelmedi" → **Devamsızlığım**; "Hatırlatma: Beden eğitimi kıyafeti" → **Hatırlatıcılar**.
4. Gideceği sayfa olmayan bildirim (ör. "Şifren okul yönetimi tarafından değiştirildi.", "7-A sınıfına yerleştirildin.")
   düz satırdır; basınca bir şey olmaz.
5. Panel açıldığı anda bütün okunmamış bildirimlerin okundu sayılır ve rozet kaybolur (ayrıntı:
   [Okundu sayma](okundu-sayma.md)).
6. Kapatmak için zile yeniden bas, gideceği sayfası olan bir bildirim satırına bas ya da panelin dışında boş bir yere bas.
7. Hiç bildirimin yoksa panelde **"Bildirim yok."** yazar.

### Veli

Çocuğuna giden bildirimin kopyası başında çocuğun adıyla gelir: "Elif Yılmaz · Yeni ödev: Sayfa 42 (Matematik)". Satıra
basınca o çocuğun sayfası açılır ve üstteki çocuk şeridinde o çocuk seçili gelir (ayrıntı:
[Öğrencinin bildirimi veliye de](velinin-bildirimleri.md)).

### Yetişkin hesabı (öğretmen, müdür, veli, çalışan) — birden çok portal

- Zil, **bulunduğun portalın** bildirimlerini gösterir: öğretmen ya da müdür portalındayken o okul rolüne gelenleri. Veli portalı
  yetişkin hesabının kendisidir (yalnız seçili çocuk değişir); bu yüzden veli olarak gelenler ve "Test Ortaokulu seni öğretmen
  olarak ekledi. Sol üstteki menüden okuluna geçebilirsin." gibi hesabının kendisine gelen bildirimler aynı zildedir: veli
  portalında ve portal dışındaki görünümde (Başlangıç) görürsün (kod okumasına göre). İki çocuğun varsa bugün ikisinin
  bildirimleri bu zilde birliktedir; her biri çocuğun adıyla başlar.
- Yeni bir bildirim geldiğinde sol menüdeki **Portallarım** listesi de tazelenir: okul seni o an eklediyse yeni portal hemen
  görünür ([Portallarım](../portallar/portallarim.md)).
- Telefon bildirimi ise bütün portallarına gelenleri aynı telefona getirir; telefondaki bildirime dokununca bildirimin geldiği
  portala geçilir ([Telefon bildirimi](telefon-bildirimi.md)).

### Sistem yöneticisi

Yönetici ekranı da aynı üst şeridi kullanır. Yöneticiye gelen bildirimler bugün okulların dosya alanı uyarılarıdır
("Test Ortaokulu: dosya alanının %80'i doldu (4 GB / 5 GB).") ([Bildirim türleri ve metinleri](bildirim-metinleri.md)).

### Tasarımda (Tasarım 1 önizlemesi)

- Panel büyük açılır, arkası hafif kararır (kullanıcı 1 Ekim: "gerçekten büyük açılsın arkayı hafif karartmalı"). Telefonda
  (640 piksel ve altı) neredeyse bütün ekranı kaplar. Sağ üstteki **"×"** (Kapat) ya da arkadaki karartı paneli kapatır.
- Panelin üst kısmı aşağı kaydırınca yerinde durur: solda başlık **"Bildirimler"**, sağda **"Tümünü okundu say"** düğmesi
  (gösterilen sekmede okunmamış yoksa soluk ve basılmaz) ve "×".
- Başlığın altında tür sekmeleri: **Tümü · Ödev · Sınav · Devamsızlık · Mesaj · Duyuru · Servis**, her birinin yanında okunmamış
  sayısı ([Bildirim sekmeleri](sekmeler.md)).
- Her satır:
  - okunmamışsa solda bir nokta;
  - birden çok kurumdaysan başta kalın, renkli kurum adı ("Örnek Dershanesi · ") ([Kurum adı](kurum-adi.md));
  - başlık ("Matematik dersinden yeni ödev: Kesirlerle toplama — alıştırma 3");
  - altında ayrıntı satırı ("Ayşe Kaya · son gün 1 Ekim Perşembe 23:00");
  - en altta tür ve uzun tarih: **"Ödev · 1 Ekim 2026 Perşembe 10:12"**.
- Satıra basınca yalnız o bildirim okundu olur, panel kapanır ve ilgili şey açılır: ödevin penceresi, sınavın ayrıntısı,
  Mesajlar, Servis, Ders programım… Bildirim başka bir portalına aitse önce o portala geçilir, sonra açılır.
- Satırlar klavyeyle de açılır: satıra gelip **Enter** ya da **Boşluk**.
- Hiç bildirim yoksa **"Henüz bildirimin yok."**; bir sekmede yoksa **"Ödev bildirimin yok."** gibi sekmenin adıyla.
- Zil düğmesi ekran okuyucuya okunmamış sayısıyla okunur: "Bildirimler · 3 okunmamış".
- Telefonda sayfa başlığının üstündeki **"Yenile"** düğmesi de yeni bildirimleri getirir; yeni bir ödev geldiyse
  "Sayfa yenilendi · 1 yeni ödev geldi: Unit 3 kelime kartları", gelmediyse "Sayfa yenilendi; yeni bir şey yok." yazar
  ([Telefonda yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md)).
- Velide her çocuk ayrı oturumdur: zil yalnız o anki çocuğun bildirimlerini gösterir ([Velide her çocuk ayrı
  oturum](../portallar/velide-cocuk-oturumlari.md)).
- Tahta hesabının listesi boştur; tahtaya bildirim gelmez.

## Kurallar ve sınırlar

- **Kim görür:** giriş yapmış herkes yalnız kendi bildirimlerini görür. Giriş yapmamış ziyaretçide zil yoktur.
- **Liste:** en yeni 100 bildirim. Daha eskiler panelde görünmez ama silinmez ([Saklama ve silinme](saklama-ve-silinme.md)).
- **Metin:** sunucunun yazdığı düz metin, en çok 300 harf; içinde HTML çalışmaz.
- **Hangi satır tıklanır:** yalnız Eğitim Evi'nin içindeki bir sayfaya giden bildirim ("#/sayfa" ya da veli için
  "#/sayfa?c=<çocuk>"). Dışarıya giden bir bağlantı taşıyan bildirim düz metin kalır; bildirim seni başka bir siteye götüremez.
- **Tazelenme:** sayfa sunucuya sitenin yoklama aralığıyla sorar (varsayılan 5 dakika); sekmeye dönünce ve zil açılınca beklemeden
  sorar. Panel açıkken yeni bildirim gelirse liste kendiliğinden yenilenir ([Zilin tazelenmesi](yoklama-araligi.md)).
- **Kapanma:** zile yeniden basınca, bir bildirim satırına basınca ve panelin dışında düğme olmayan bir yere basınca kapanır.
  Sol menüden başka sayfaya geçmek paneli açık bırakır (kod okumasına göre; bilinen açık).
- **Klavye:** bugünkü sitede satırlar Tab ile odak alır ama Enter ile açılmaz (bilinen açık; tasarımda açılır).
- **Çıkış ve portal değişimi:** çıkışta ve portal değiştirince zil, rozet ve liste sıfırlanır; yeni oturumun bildirimleri
  yüklenir.

## Kardeşler ve ilgili

**Kardeşler:** [Bildirim sekmeleri](sekmeler.md) · [Okundu sayma](okundu-sayma.md) ·
[Bildirim türleri ve metinleri](bildirim-metinleri.md) · [Otomatik bildirimler](otomatik-bildirimler.md) ·
[Telefon bildirimi](telefon-bildirimi.md) · [Öğrencinin bildirimi veliye de](velinin-bildirimleri.md) ·
[Kurum adı](kurum-adi.md) · [Zilin tazelenmesi](yoklama-araligi.md) · [Saklama ve silinme](saklama-ve-silinme.md) ·
[Ders başlamadan öğretmene bildirim](ders-oncesi-bildirim.md).

**İlgili:** [Üst şerit](../menu-ve-arama/ust-serit.md) · [Telefonda yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md) ·
[Portallarım](../portallar/portallarim.md) · [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md) ·
[Mesajlar](../mesaj/README.md) · [Ödevler](../odev/README.md) · [Çıkış yap](../giris-hesap/cikis-yap.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md) —
  `bildirimleriYenile` (yoklama, rozet, "99+"), `bildirimPaneliAcKapa`, `bildirimPaneliCiz` ("Bildirim yok.", okundu isteği),
  `EYLEMLER['bildirim-git']` (satıra basınca sayfa ve velide çocuk seçimi);
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (zil düğmesi, dışarıya basınca kapanma);
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) (açılışta ilk yoklama, çıkışta sıfırlama);
  [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) (`adrestenParca`: hangi bağlantı tıklanır);
  [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) (`portallariTazele`).
  Kabuk: `public/index.html` (`#btnBildirim`, `#bildirimRozet`, `#bildirimPanel`; [public/KLASOR.md](../../public/KLASOR.md)).
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `GET /api/notifications[?surum=]` (en yeni 100, okunmamış
  sayısı, sürüm), `POST /api/notifications/read`.
- Depo: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) — `bildirimleri`, `bildirimSurumu`, `bildirimleriOkundu`;
  tablo `bildirimler` ([sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Testler: [testler/test-bildirim.md](../../testler/test-bildirim.md) (yoklama, sürüm, okundu, velinin bağlantısı).
- Tasarım: Tasarım 1 önizlemesi, herkes-a paketi (bildirim paneli, sekmeler, tam tarih) ve öğrenci-veli paketi (velinin
  bildirimleri).

## Sık sorulanlar

- **Zili açtım, okumadığım bildirimler de okundu oldu.** Bugünkü sitede zili açmak hepsini okundu sayar. Tasarımda yalnız bastığın
  bildirim ya da "Tümünü okundu say" okundu sayar ([Okundu sayma](okundu-sayma.md)).
- **Bildirim geldi ama rozet hemen artmadı.** Açık sayfa sunucuya birkaç dakikada bir sorar (varsayılan 5 dakika). Zile basınca ya
  da sekmeye dönünce beklemeden sorar ([Zilin tazelenmesi](yoklama-araligi.md)). Anında haber için telefon bildirimini aç.
- **Eski bildirimlerim nerede?** Panel son 100 bildirimi gösterir; daha eskileri görünmez.
- **Öğretmen portalımdayken "okul seni ekledi" bildirimini göremiyorum.** O bildirim yetişkin hesabının kendisine gelir; veli
  portalına ya da portal dışına (Başlangıç) geçince ya da telefonunda görürsün.

## Sırada

- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu (iş 8):
  panelin tür sekmelerine ayrılması, "Tümünü okundu say", uzun tarih biçimi ("25 Eylül 2026 Cuma 15:57"), sunucuda bildirim
  türü; "panel açılınca hepsi okundu" kuralı bu işte değişir.
- Arayüz önizlemesi (iş 31): seçilecek tasarım dili paneli büyük, arkası kararan pencere yapar.
- Tek kişi tek hesap + portallar öğrencide de (iş 19): birden çok kurumda bildirimde kurum adı.
- Optimizasyon + saklama süreleri (iş 7): bildirimler 90 gün sonra silinir.
- Android yerel uygulama (iş 10): uygulamanın Bildirimler sayfası aynı sekmeleri kullanır.
- Çok dil (iş 22): bildirim metinleri dil kataloğundan.
