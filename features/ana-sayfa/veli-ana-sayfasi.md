# Ana sayfa · Velinin ana sayfası

**Durum:** Kodda var; tasarımda ek olarak her çocuğun ayrı oturumunda yalnız o çocuğun ana sayfası (başlıkta bugünün tarihi, altında "Elif · 7-A · bugünkü durumu"), Servis ve "<çocuğun adı>'in telefonu" kutucukları, "Bugün olanlar" ve "Yaklaşanlar" sütunları; birleşik "çocuklarının durumu bir arada" görünümü, Çocuklarım ve Ayarlar kutucukları kalkar (Tasarım 1 önizlemesi; kullanıcının 3 Ekim kararı).

Velinin girişten sonra ilk gördüğü sayfa: çocuğunun (bugünkü kodda bütün çocuklarının) ödevleri, devamsızlığı ve ilerleyişine giden kutucuklar ve yaklaşan ödevler.

## Ne işe yarar

Veli okulun sitesine her gün uzun uzun bakmaz; ana sayfa ona "bugün çocuğumla ilgili bir şey var mı?" sorusunun cevabını
verir: kaç aktif ödev var, hangisinin son günü yaklaşıyor, çocuk ödevi açmış mı. Kullanıcı 26 Eylül'de "birden fazla çocuk
olabilsin ve karışmasın" dedi; 3 Ekim'de bunu "velide her çocuk ayrı oturum" diye kesinleştirdi: tasarımda her çocuğun kendi
oturumu ve kendi ana sayfası vardır.

## Nereden açılır

- **Girişten sonra kendiliğinden** (veli, yetişkin hesabıyla ana sitenin girişinden girer). Tek oturumu olan doğrudan buraya
  gelir; birden çok oturumu olan önce seçme ekranını görür ([Portal seçme ekranı](../portallar/portal-secme-ekrani.md)).
- **Sol menünün ilk satırı:** **"Ana Sayfa"** (tasarımda **"Ana sayfa"**; [Sol menü](../menu-ve-arama/sol-menu.md)).
- Bugünkü kodda menünün en üstündeki **Portallarım**'da bir çocuğa (*Veli · Elif Yılmaz*) basınca ana sayfa o çocukla yeniden
  açılır ([Portala geçiş](../portallar/portala-gecis.md)). Tasarımda **"Oturum değiştir"** ile başka bir çocuğun oturumuna
  geçince o çocuğun ana sayfası açılır ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

## Adım adım

### Veli

**Bugünkü kodda:**

1. Başlık **"EĞİTİM EVİNE HOŞ GELDİNİZ"**, altında **"Merhaba Zeynep, çocuklarının durumu bir arada."** (adının ilk kelimesi).
   Ana sayfada eğitim yılı seçicisi çıkmaz (velide yalnız Ödevler, İlerleyiş ve Devamsızlık sayfalarında durur).
2. Altı renkli kutucuk ([Kutucuklar](kutucuklar.md)):

   | Kutucuk | Renk | Alt yazı | Sağ üstteki sayı | Bastığında |
   |---|---|---|---|---|
   | **Ödevler** | turuncu | "4 aktif ödev" ya da "Aktif ödev yok" | aktif ödev sayısı | [Ödevler](../odev/liste.md) |
   | **Devamsızlık** | kırmızı | "Derse katılım" | — | [Devamsızlık](../devamsizlik/devamsizligim.md) |
   | **İlerleyiş** | camgöbeği | "Ödev ve sınav durumu" | — | [İlerleyiş](../ilerleyis/velinin-ilerleyis-sayfasi.md) |
   | **Mesajlar** | mavi | "Öğretmenlerle yazışma" | — | [Mesajlar](../mesaj/kutu.md) |
   | **Çocuklarım** | mor | "2 öğrenci bağlı" ya da "Henüz çocuk eklenmedi" | bağlı çocuk sayısı | [Çocuklarım](../portallar/cocuklarim.md) |
   | **Ayarlar** | gri | "Hesap bilgilerin" | — | [Ayarlar](../ayarlar/hesap-ayarlari-sayfasi.md) |

3. **Hiç çocuğun bağlı değilse** kutucukların altında: **"Çocuğunu eklemek için Çocuklarım sayfasına git ve veli kodunu gir."**
4. **Çocuğun varsa** **"Yaklaşan ödevler"** başlığı ve çocuklarının durumu "aktif" olan ödevlerinden **ilk 6'sı**, son teslim
   gününe göre en yakından uzağa. Hiç yoksa **"Şu an açık ödev yok."** Her satırda:
   - solda çocuğun ilk adı (rozet, ör. "Elif") — hangi çocuğun ödevi olduğu;
   - ödevin adı, quizli ödevde **"Quiz"** etiketi;
   - "Matematik · Ayşe Kaya · son teslim …";
   - ödevin açıklamasının tamamı;
   - quizli ödevde **"Quiz: başlamadı"**, **"Quiz: devam ediyor"**, **"Quiz: bitirdi · sonuç henüz açılmadı"** (sonuç açılınca
     puan);
   - sağda kalan süre: **"Süresi doldu"**, **"Bugün 12:00'e kadar"**, **"1 gün kaldı"**, **"3 gün kaldı"**, **"Aktif"**.
   Çocuğun henüz açmadığı ödevin satırı turuncuya çalar, üstüne gelince **"Çocuğun bu ödevi henüz açmadı"**.
5. Satıra basınca ödevin adıyla bir pencere açılır: önce "Yükleniyor...", sonra çocuğunun bu ödeve yüklediği teslim dosyaları
   (görür, indirir; [Teslim](../odev/teslim.md)).
6. Birden çok çocuğun varsa girişte önce portal kartlarını görürsün; Portallarım'dan (ya da kartlardan) tek bir çocuğa
   geçtiysen liste yalnız o çocuğun ödevleriyle çizilir, "Çocuklarım" kutucuğu yine bütün çocuklarını sayar. Ödevler,
   Devamsızlık ya da İlerleyiş sayfasının üstündeki çocuk şeridinden **"Hepsi"**ni seçersen ana sayfa yeniden bütün
   çocuklarınla çizilir.

**Tasarımda (Tasarım 1 önizlemesi; her çocuk ayrı oturum):**

1. Hangi çocuğun oturumundaysan ana sayfa yalnız onundur; "Hepsi" seçimi ve çocuk çipleri yoktur.
2. Başlık bugünün tarihi (**"Perşembe, 1 Ekim"**), altında **"Elif · 7-A · bugünkü durumu"** (çocuğun adı, sınıfı).
3. Altı kutucuk, hepsi aynı boyda:

   | Kutucuk | Renk | Alt yazı (örnek) | Sayı | Bastığında |
   |---|---|---|---|---|
   | **Ödevler** | kırmızı | "1 getirmedi" / "yarın 1 ödev" | dikkat isteyen ödev sayısı | [Ödevler](../odev/liste.md) |
   | **Devamsızlık** | mor | "bu dönem 1 gün" / "bugün 1. derse geç" | — | [Devamsızlık](../devamsizlik/devamsizligim.md) |
   | **İlerleyiş** | mavi | "yeni not: 82" / "Türkçe: 88" | — | [İlerleyiş](../ilerleyis/velinin-ilerleyis-sayfasi.md) |
   | **Servis** | sarı | "sabah bindi · 07:41" / "sabah bindi · 07:44" | — | [Servis](../servis/servisim.md) |
   | **Mesajlar** | yeşil | "3 okunmamış" | okunmamış sayısı | [Mesajlar](../mesaj/kutu.md) |
   | **Elif'in telefonu** | camgöbeği | "son konum 1 saat önce" / "okulda" | — | [Çocuğumun telefonu](../aile/cocugumun-telefonu-sayfasi.md) |

   Kutucuğun adı çocuğun adıyla değişir ("Can'ın telefonu"). Çocuklarım ve Ayarlar kutucukları yoktur: Çocuklarım menünün
   sonundadır, Hesap ayarları profil menüsündedir.
4. Kutucukların altında iki sütun (telefonda alt alta):
   - **Solda "Bugün olanlar"**: her satırda solda çocuğun baş harfleri, ne olduğu ve sağda durumu. Elif'in oturumunda
     **"Fen ödevi getirilmedi · Konu özeti — 2. bölüme kadar · Yapmadı"**, **"Matematik 1. yazılı · sonuç açıklandı · 82"**,
     **"İngilizce ödevi teslim · Yaptı"**; Can'ın oturumunda **"Derse geç kaldı · 1. ders · 5 dakika · Geç"**, **"Okuma kartı ·
     Türkçe · sonuç açıklandı · Yaptı"**, **"Servis · sabah bindi 07:44 · okula vardı 08:12 · Vardı"**. Satıra basınca ilgili
     pencere ya da sayfa açılır (ödev, sınav sonucu, devamsızlık, servis). Bu kutunun "hepsi →" bağlantısı yoktur.
   - **Sağda "Yaklaşanlar"**, sağında **"hepsi →"** (Takvim'e): Elif'te **"Bugün · Kesirler quizi · Matematik · 23:00'e kadar"**,
     **"Cum · 7-A veli toplantısı · 15:30 · konferans salonu"**, **"15 Eki · Fen 1. yazılı · 1. dönem"**; Can'da **"Yarın · Bölme
     alıştırması · Matematik · 15:00'e kadar"** (ödevler, toplantılar, sınavlar; [Takvim sayfası](../takvim/takvim-sayfasi.md),
     [Toplantılar](../toplanti/toplantilar.md)).
5. Uygulamayı kurmamışsan **"Eğitim Evi'ni telefonuna kur"** kartı, bildirim izni verilmemişse **"Bildirimlere izin ver"**
   şeridi, başlığın önünde **"Yenile"** ([Telefonuna kur kartı](../uygulama/telefonuna-kur-karti.md),
   [Telefon bildirimi](../bildirim/telefon-bildirimi.md), [Yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md)).
6. **Hiç çocuğun bağlı değilse** (ya da hepsini kaldırdıysan) menüde yalnız **"Çocuklarım"** kalır ve o sayfa açılır:
   **"Hesabına bağlı çocuk yok"** · "çocuğunun veli koduyla ekleyebilirsin" ([Çocuklarım](../portallar/cocuklarim.md)).
7. **Öğretmen ya da müdür olan veli** (tasarımdaki örnek: bir öğretmen, iki çocuk babası; tek hesap, üç oturum): çocuğun veli
   oturumuna geçince aynı veli ana sayfasını görür; öğretmen oturumunda [Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md).
8. **Tanımda olup önizlemede çizilmeyen:** ana sayfada eğitim içerikleri öneri şeridi; velide önerinin neye göre seçileceği
   karar bekliyor ([Ana sayfadaki öneri şeridi](../egitim-icerikleri/ana-sayfa-seridi.md)).
9. **3 Ekim kararları (tanımda; önizlemeye md'ler bitince eklenecek):** "Elif bugün sabah servise binmedi (Servis 3, 07:52)"
   bildirimi ([Servise binmedi uyarısı](../servis/servise-binmedi-uyarisi.md)), özürsüz devamsızlık sınırına yaklaşınca uyarı
   ([Devamsızlık sınırı uyarısı](../devamsizlik/devamsizlik-siniri-uyarisi.md); şeridi Devamsızlık sayfasının üstündedir) ve
   "Önemli" etiketli duyurunun sayfanın üstünde kapatılana kadar duran şeridi ([Önemli etiketi](../mesaj/onemli-etiketi.md)).
   Bu olayların ana sayfadaki "Bugün olanlar"a da düşüp düşmeyeceği tanımda yazılı değil.

## Kurallar ve sınırlar

- **Veri:** önce `GET /api/parent/children` (bağlı çocuklar; menü ve çocuk listesi bununla yenilenir), sonra her çocuk için
  (bir çocuk seçiliyse yalnız onun için) `GET /api/progress?studentId=…`. Veli yalnız kendine bağlı çocuğun verisini alır;
  başka bir öğrencinin kimliğini yazmak işe yaramaz.
- **Liste en çok 6 ödev** gösterir; hepsi için "Ödevler" kutucuğu. Sıra son teslim gününe göredir; son teslimi olmayan ödev en
  başa düşer.
- **"Aktif"** = öğretmenin henüz sonuçlandırmadığı ödev; son teslim saati geçmiş ama sonuçlanmamış ödev ana sayfada "Süresi
  doldu" etiketiyle kalır (Ödevler sayfası onu "Geçmiş ödevler"e koyar).
- **Okulun kuralı:** çocuğun okulu "Ödevler"i ya da "Devamsızlık"ı kapattıysa o kutucuk düşer ([Kapalı bölüm](../ozellikler/kapali-bolum.md)).
  Okul ödevi kapattıysa liste boş gelir ama "Yaklaşan ödevler" başlığı kalır ve "Şu an açık ödev yok." yazar (bilinen açık).
- **Ödev serisi velide görünmez** (yalnız öğrencinin kendisine; [Ödev serisi](../odev/seri.md)).
- **E-posta önerisi:** e-postası olmayan yetişkin hesabına girişten sonra bir kez "E-posta eklemek ister misin?" penceresi
  açılır ([E-posta ekleme önerisi](../ayarlar/eposta-ekleme-onerisi.md)).
- **Bilinen açık (kod okumasına göre):** satıra basınca açılan pencerede quizin durumu, ancak bu oturumda "Ödevler" sayfası daha
  önce açıldıysa görünür (pencere quiz bilgisini o sayfanın listesinden okur); teslim dosyaları her durumda gelir.

## Kardeşler ve ilgili

**Kardeşler:** [Öğrencinin ana sayfası](ogrenci-ana-sayfasi.md) · [Kutucuklar](kutucuklar.md) ·
[Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md) · [Müdürün ana sayfası](mudur-ana-sayfasi.md) ·
[Servisçinin ana sayfası](servisci-ana-sayfasi.md) · [Rolsüz çalışanın ana sayfası](calisan-ana-sayfasi.md) ·
[Yöneticinin ana sayfası](yonetici-ana-sayfasi.md). Klasör: [Ana sayfa](README.md).

**İlgili:**

- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md), [Çocuklarım](../portallar/cocuklarim.md),
  [Portallarım](../portallar/portallarim.md).
- [Ödev listesi](../odev/liste.md), [Teslim](../odev/teslim.md), [Açıldı / açılmadı](../odev/acilma-bilgisi.md).
- [Velinin ilerleyiş sayfası](../ilerleyis/velinin-ilerleyis-sayfasi.md), [Devamsızlık](../devamsizlik/devamsizligim.md),
  [Servisim](../servis/servisim.md), [Çocuğumun telefonu](../aile/cocugumun-telefonu-sayfasi.md).
- [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md) — "Bugün olanlar"daki olaylar bildirim olarak da gelir.
- Rol kapısı: [Veli](../roller/veli.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) — `SAYFALAR.ana`'nın veli kolu;
  [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) — `cocuklarIcin`, `veliOdevListesi`,
  `cocukRozet`, seçili çocuk; [public/js/parcalar/14b-odev-teslim.md](../../public/js/parcalar/14b-odev-teslim.md) —
  `veli-teslim` penceresi; [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) — Portallarım'dan
  çocuğa geçiş; [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — e-posta önerisi.
- Sunucu: [sunucu/bolumler/veli.md](../../sunucu/bolumler/veli.md) (`GET /api/parent/children`),
  [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (`GET /api/progress?studentId=`).
- Görünüm: `public/css/parcalar/10-ana-sayfa-kutucuklari.css`, `24-veli.css` (çocuk rozeti) —
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).

## Sık sorulanlar

- **İki çocuğumun ödevleri karışıyor mu?** Bugünkü kodda her satırın başında çocuğun adı yazar. Tasarımda her çocuğun ayrı
  oturumu olur; ana sayfa yalnız o çocuğun bilgisini gösterir.
- **Neden yalnız 6 ödev görünüyor?** Ana sayfa son teslimi en yakın 6 ödevi gösterir; hepsi "Ödevler" kutucuğundadır.
- **Ana sayfada "Çocuğunu eklemek için…" yazıyor.** Hesabına bağlı çocuk yok; çocuğunun veli kodunu okuldan al, Çocuklarım
  sayfasından ekle.
- **Çocuğumun ödev serisini görebilir miyim?** Hayır; seri yalnız öğrencinin kendisine görünür.

## Sırada

- Velide her çocuk ayrı oturum (Tasarım 1, 3 Ekim kararı): çocuk başına ana sayfa, "Bugün olanlar" ve "Yaklaşanlar" —
  Linux kodlaması.
- "Eğitim içerikleri" (iş 17): ana sayfadaki öneri şeridi (velide ölçütü kullanıcıya sorulacak).
- Tam debug: ödev kapalıyken başlık, penceredeki quiz durumu.
- Android uygulaması: velinin ana sayfası (çocuğun özeti: bugünkü dersler, son ödev sonuçları, devamsızlık).
