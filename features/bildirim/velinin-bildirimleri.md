# Bildirimler · Öğrencinin bildirimi veliye de

**Durum:** Kodda var; tasarımda ek olarak her çocuk ayrı oturum (bildirim yalnız o çocuğun oturumunun zilinde), kısa ad öneki
("Elif · …"), metnin veliye göre çevrilmesi ("Sınav sonucun" → "Sınav sonucu") ve yoklama düzeltme bildirimleri.

Öğrenciye giden her bildirimin bir kopyası, başında hangi çocuk olduğu yazarak onaylı velilerine de gider; basınca o çocuğun sayfası
açılır.

## Ne işe yarar

Veli, çocuğunun ödevini, sonucunu, sınavını, devamsızlığını ve servisini çocuğuna sormadan öğrenir. Kullanıcının isteği (26 Eylül):
"biden fazla çocuk olabilsin ve karışmasın ve öğrencinin aldığı bildirim veliyede eksiksiz gitsin ama velide başında hangi çocuğu
olduğu yazsın". Bunun için ayrı bir ayar yok; çocuğuna bağlandığın anda başlar ([Çocuklarım](../portallar/cocuklarim.md)).

## Nereden açılır

- Veli hesabında sağ üstteki zil ([Bildirim paneli](bildirim-paneli.md)) ve telefon bildirimini açtıysan telefonun
  ([Telefon bildirimi](telefon-bildirimi.md)).
- Bildirime basınca o çocuğun sayfası açılır; üstteki çocuk şeridinde o çocuk seçili gelir.

## Adım adım

### Veli — bugünkü site

1. Çocuğuna bir bildirim gidince sana da gelir; başında çocuğun **adı soyadı** ve ortada nokta: **"Elif Yılmaz · Yeni ödev:
   Sayfa 42 (Matematik)"**.
2. Aynı bildirim iki çocuğuna birden gittiyse (kardeşler aynı sınıfta) **tek** bildirim gelir: **"Elif Yılmaz, Can Yılmaz · Yeni
   ödev: Sayfa 42 (Matematik)"**.
3. Bildirime bas. Çocuğun ilgili sayfası açılır ve çocuk şeridinde o çocuk seçili gelir:

| Öğrencinin bildirimi neyi açıyorsa | Veliye açılan sayfa |
|---|---|
| Ödevler (yeni ödev, ödev güncellendi, ödev sonucu, quiz sonucu, "yarın ödevin var") | Ödevler (o çocuk) |
| Sınavlarım (sınav sonucu) | İlerleyiş (o çocuk) |
| Başka bir sayfa ya da sayfası yok (sınıfa yerleştirilme, şifre değişikliği, giriş bilgileri…) | Çocuklarım |

   Kod Devamsızlığım, İlerleyişim, Etütlerim, Servisim, Takvim ve Yemek Listesi bağlantılarını da velinin o çocuğa ait sayfasına
   çevirir; bugün bu sayfalara giden öğrenci bildirimleri (yoklama, etüt, servis) veliye zaten kendi metniyle gittiği için kopyada
   kullanılmaz.

4. Bazı olaylarda sana kopya değil, **kendi metninle** bildirim gelir (öğrencininkinin kopyası ayrıca gelmez):
   - ders yoklaması: "Çocuğunuz Elif Yılmaz bugün saat 09:20 Matematik dersine gelmedi (izinsiz)." / "… gelmedi (izinli)." /
     "… geç geldi." → Çocuklarım (["Gelmedi" bildirimi](../devamsizlik/devamsizlik-bildirimi.md));
   - etüt yoklaması: "Elif Yılmaz — Etüt: Matematik etüdü (12.10.2026) — gelmedi (izinsiz)" → Etütler;
   - servis yaklaşma: "Elif Yılmaz: servis evine yaklaşıyor (yaklaşık 500 m)." → Servis;
   - nakil: "Elif Yılmaz `<yeni okul>` okuluna taşındı. Önceki okulunun kayıtları yıl seçicisinde." → Çocuklarım.
5. Bazı bildirimler **yalnız sana** gelir, çocuğa gitmez: servis yoklaması ("Elif 07:42'de servise bindi.", "Elif 08:05'te okula
   vardı.", "Elif 17:10'da eve bırakıldı.", "Elif bu sabah servise binmedi.", "Düzeltme: …"), servisçinin notu ("Servisçiden not:
   …"), Eğitim Evi Aile bildirimleri ([Aile bildirimleri](../aile/bildirimler.md)).
6. Mesaj, duyuru ve anket çocuğuna gidince sana da **doğrudan** gider (sen de alıcısın): metin aynıdır, başında çocuğun adı yoktur
   ("Ayşe Kaya: Gezi izin formu", "Duyuru: Veli toplantısı") ve Mesajlar'ı / Anketler'i açar; kopya ayrıca gelmez
   ([Velinin kopyası](../mesaj/velinin-kopyasi.md)).

### Öğrenci

Senin bildirimlerin kopyalanır ama sen velinin bildirimlerini görmezsin. Kendi kurduğun hatırlatıcıların ("Hatırlatma: …") ve bir
velinin hesabına bağlandığını söyleyen bildirim ("`<veli>` veli olarak hesabına bağlandı.") yalnız sana gelir; veline gitmez.

### Öğretmen ya da müdür olan veli

Veli portalındayken çocuğunun bildirimlerini, öğretmen portalındayken öğretmenlik bildirimlerini görürsün; telefona hepsi gelir.
Kendi gönderdiğin bir mesajın alıcıları arasında çocuğun varsa bildirim veli olarak sana da düşer (kod okumasına göre).

### Tasarımda (Tasarım 1 önizlemesi ve 3 Ekim kararı)

- **Her çocuk ayrı oturum:** velide "Hepsi" görünümü yok; çocuğun oturumuna geçince zil yalnız **o çocuğun** bildirimlerini
  gösterir ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).
- **Kısa ad:** bildirim çocuğun kısa adıyla başlar: **"Elif · Matematik dersinden yeni ödev: Kesirlerle toplama — alıştırma 3"**.
  Öğrencinin aldığı her bildirim veliye **eksiksiz** gelir (ödev, mesaj, etüt, sınav sonucu…).
- **Veliye göre çevrilen metin:** öğrenciye "sen" diye yazılan metin veliye üçüncü kişiyle gelir: "Sınav sonucun açıklandı" →
  "Elif · Sınav sonucu açıklandı", "Yarın Matematik etüdün var" → "Elif · Yarın Matematik etüdü var".
- **Yoklama:** başlık kısa, ayrıntı tam cümle: "Elif bugün Matematik dersine gelmedi" / "Çocuğunuz Elif Yılmaz bugün saat 10:10
  Matematik dersine gelmedi (izinsiz)."; yanlış yoklama düzeltilince "Elif'in yoklaması düzeltildi" / "Yoklama düzeltildi: çocuğunuz
  Elif Yılmaz bugün saat 10:10 Matematik dersine geldi."; durum değişince "Yoklama güncellendi: çocuğunuz … dersine gelmedi
  (izinli)." Etütte "Elif'in etüt yoklaması düzeltildi" ve "Etüt yoklaması düzeltildi: …".
- **Servis:** "Elif 07:41'de servise bindi." / "Servis 3 · Gül Sokak durağı", "Elif 08:12'de okula vardı." / "Servis 3 · sabah
  seferi", "Elif · Servis eve 100 m kaldı" / "Servis 3 · eve dönüş"; 3 Ekim kararıyla "Elif bugün sabah servise binmedi
  (Servis 3, 07:52)" "Önemli" önceliğinde.
- **Aile:** "Can · YouTube günlük sınırı (1 sa) geçti" / "dün 1 sa 20 dk kullandı · uygulama kapatılmaz".
- **Çocuk birden çok kurumdaysa** (okul ve dershane) veli portalı kurum kurum ayrılır ("Veli · Ali · Okul A" / "Veli · Ali ·
  Dershane B") ve bildirimin başında kurum adı yazar (tanımdaki örnek: "Dershane B · Yeni ödev") ([Kurum adı](kurum-adi.md)).
- **Ödev hatırlatması:** veli de çocuğunun ödevleri için kendi hatırlatma kuralını kurar; bildirim çocuğun adıyla gelir
  ([Ödev hatırlatmaları](../odev/hatirlatmalar.md)).

## Kurallar ve sınırlar

- **Kime:** çocuğa bağlı ve hesabı onaylı bütün velilere (anne ve baba ayrı ayrı). Bağı kaldırılmış ya da hesabı onaylı olmayan
  veliye gitmez.
- **Yalnız öğrenciden:** kopya yalnız öğrenci hesabına giden bildirimlerden üretilir.
- **Tek bildirim:** aynı metin aynı veliye iki çocuk için gidecekse tek bildirimde birleşir; adlar virgülle yazılır.
- **Zaten alana kopya yok:** bildirimi kendisi de alan veliye (ör. öğrencilere ve velilere giden mesaj, duyuru, anket) kopya gitmez.
- **Kendi metniyle bildirilenler kopyalanmaz:** ders ve etüt yoklaması, servis, nakil, Aile; öğrencinin kendi hatırlatıcıları ve
  "veli olarak hesabına bağlandı" bildirimi veliye hiç gitmez.
- **Ders yoklamasında veliye giden bildirim Çocuklarım'ı açar** (Devamsızlık'ı değil); servis yaklaşma bildirimi Servis'i açar ama
  çocuğu seçtirmez (kod okumasına göre). Öbür kopyalar o çocuğu seçerek açar. Tasarım 1 önizlemesinde yoklama bildirimi doğrudan
  çocuğun Devamsızlık sayfasını açar.
- **Kopyada "sen" kalabilir:** öğrenciye yazılmış hesap bildirimleri veliye aynen gider: "Elif Yılmaz · Şifren okul yönetimi
  tarafından değiştirildi.", "Elif Yılmaz · 7-A sınıfına yerleştirildin.", "Elif Yılmaz · Giriş bilgilerin okul yönetimi tarafından
  yenilendi. …" (kod okumasına göre; tasarımda metin veliye göre çevrilir).
- **Okundu ayrı:** senin kopyanı okuman çocuğun bildirimini okundu yapmaz, tersi de ([Okundu sayma](okundu-sayma.md)).
- **Uzunluk:** ad öneki de 300 harflik sınıra dahildir; uzun metnin sonu kesilebilir.
- **Kişisel veri:** aydınlatma metni "çocuğa giden bildirimlerin (ödev, quiz sonucu, sınav, mesaj, duyuru) bir kopyası çocuğun adıyla
  veliye de gider" der; mesaj ve duyuruda veli doğrudan alıcı olduğu için başta çocuğun adı yazmaz (metin bu ayrıntıyı söylemiyor;
  rapor edildi) ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Bildirim türleri ve metinleri](bildirim-metinleri.md) · [Bildirim paneli](bildirim-paneli.md) ·
[Okundu sayma](okundu-sayma.md) · [Kurum adı](kurum-adi.md) · [Telefon bildirimi](telefon-bildirimi.md) ·
[Otomatik bildirimler](otomatik-bildirimler.md).

**İlgili:** [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md) · [Çocuklarım](../portallar/cocuklarim.md) ·
[Velinin kopyası (mesaj)](../mesaj/velinin-kopyasi.md) · ["Gelmedi" bildirimi](../devamsizlik/devamsizlik-bildirimi.md) ·
[Servis yaklaşıyor](../servis/yaklasma-bildirimi.md) · [Aile bildirimleri](../aile/bildirimler.md) ·
[Ödev hatırlatmaları](../odev/hatirlatmalar.md) · [Veli bağlama](../hesaplar/veli-baglama.md).

## Kod tarafı

- Depo: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) — `veliKopyalari` (onaylı veliler, ad öneki, birleşik ad,
  zaten alana kopya yok), `VELI_SAYFASI` ve `veliBaglantisi` (`#/veli-odevler?c=<öğrenci>` gibi), `{ veliye: false }` seçeneği.
- Kendi metniyle bildirenler: [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md) (`yoklamaMetni`),
  [sunucu/bolumler/etut.md](../../sunucu/bolumler/etut.md) (`yoklamaBildir`), [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md)
  (`yaklasmaBildir`, `servisVelilerineBildir`), [sunucu/bolumler/nakil.md](../../sunucu/bolumler/nakil.md),
  [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md), [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) (veli alıcı
  olarak).
- Ön yüz: [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md) (`bildirim-git`:
  `?c=` ile `S.adresCocuk`), [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) (veli sayfalarının o
  çocuğu seçmesi).
- Testler: [testler/test-bildirim.md](../../testler/test-bildirim.md) (velinin kopyası, iki çocuğa tek bildirim, kendi metniyle
  gidenlerin kopyalanmaması, `#/veli-odevler?c=` bağlantısı).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Öğrencinin bildirimi veliye de gider").
- Tasarım: Tasarım 1 önizlemesi, öğrenci-veli paketi (veli bildirimleri öğrencininkilerden üretilir, "Elif ·" / "Can ·" öneki).

## Sık sorulanlar

- **İki çocuğum var, bildirimler karışır mı?** Hayır; her bildirim çocuğun adıyla başlar ve basınca o çocuğun sayfasını açar.
- **Eşim de aynı bildirimi alıyor mu?** Evet, çocuğa bağlı her veli ayrı ayrı alır.
- **Mesaj bildiriminde çocuğumun adı yok.** Mesaj ve duyurular sana doğrudan gider; ad öneki yalnız kopyalarda olur.
- **Çocuğumun "derse gelmedi" bildirimi neden Çocuklarım'ı açtı?** Ders yoklaması bildirimi bugün Çocuklarım'a götürür; oradan
  çocuğun Devamsızlık sayfasına geçersin.

## Sırada

- Velide her çocuk ayrı oturum (3 Ekim kararı): bildirim çocuğun oturumuna düşer, başında kısa adı.
- Tek kişi tek hesap + portallar öğrencide de (iş 19): çocuk birden çok kurumdaysa bildirimde kurum adı.
- Mesaj ayarları … ödev hatırlatma otomasyonu (iş 8): velinin kendi ödev hatırlatma kuralı.
- KVKK ve onay metinleri tam denetimi (iş 18): veli kopyası cümlesinin mesaj ve duyuru ayrıntısı.
