# İlerleyiş · Velinin İlerleyiş sayfası

**Durum:** Kodda var; tasarımda ek olarak her çocuk ayrı oturum: "Hepsi" şeridi ve çocukların alt alta gösterilmesi kalkar, sayfa yalnız o oturumdaki çocuğu gösterir.

Velinin kendi menüsündeki "İlerleyiş": çocuklarının ödev grafiklerini, sınav grafiğini ve sınav ortalamalarını çocuk çocuk
gösteren sayfa.

## Ne işe yarar

Veli çocuğunun portalına tek tek girmeden ilerleyişine bakmak ister. Bu sayfa her çocuk için öğrencinin kendi
[İlerleyişim sayfası](ilerleyisim.md)ndaki kartların aynısını çizer: "Ödevler" grafiği ("Sonuçlara göre" / "Derslere
göre"), "Sınav grafiği", "Sınavlar" ve "Sınav grubu ortalamaları". Bugün iki ya da daha çok çocuğu olan veli "Hepsi"
seçiliyken bütün çocuklarını aynı sayfada alt alta görür.

Kullanıcı 3 Ekim'de bunu değiştirdi: "VELİDE HER ÇOCUK AYRI OTURUM — iki çocuk tek oturumda birlikte gösterilmez ("Hepsi"
yok)". Tasarımda sayfa yalnız bulunduğun çocuğun oturumunu gösterir.

## Nereden açılır

| Kim | Yol |
|---|---|
| Veli | Sol menüde **"İlerleyiş"** (grafik simgeli; "Devamsızlık" ile "Etütler" arasında). Ana sayfada camgöbeği **"İlerleyiş"** kutucuğu, altında "Ödev ve sınav durumu" ([Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md)). |
| Öğretmen ya da müdür aynı zamanda veliyse | Portallarım'da çocuğun **"Veli"** satırına geçip menüde **"İlerleyiş"**. Eski usul hesapta menünün altında **"Velisi olduğum"** başlığı → **"İlerleyişi"**. |

Adres: sitenin adresinin sonuna `#/veli-ilerleyis`.

Çocuğun portalındaki "İlerleyişi" (Çocuklarım → çocuğun kartı) ayrı bir sayfadır: o öğrencinin kendi İlerleyişim sayfasını
onun adına açar ([İlerleyişim sayfası](ilerleyisim.md#veli)).

Tasarımda (Tasarım 1 önizlemesi): her çocuğun oturumunda menüde **"İlerleyiş"** ("Devamsızlık" ile "Başarıları" arasında).
Ana sayfa kutucuğu mavi **"İlerleyiş"**, altında o çocuğun son notu ("yeni not: 82"; öbür çocuğun oturumunda "Türkçe: 88").
Öbür çocuğa geçmek için sol menünün başındaki Portallarım ya da Çocuklarım (çocuğun satırında "Oturumuna geç" yazar;
satıra dokununca açılan pencerede **"Portalını aç"**) ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

## Adım adım

### Ekranın düzeni (bugünkü site)

1. Büyük başlık **"İLERLEYİŞ"**, altında "Çocuk çocuk ödev başarısı ve sınav ortalamaları."
2. Hesabına bağlı çocuk yoksa başlığın altında yalnız bir kutu: "Henüz çocuk eklenmedi. Çocuklarım sayfasından veli koduyla
   ekleyebilirsin."
3. İki ya da daha çok çocuğun varsa başlığın altında çocuk şeridi: **"Hepsi"** ve her çocuğun adı soyadı (ör. "Hepsi ·
   Elif Yılmaz · Can Yılmaz"). Seçili olan vurgulu. Tek çocukta şerit çıkmaz.
4. Her çocuk için çocuğun adı soyadı küçük bir başlık olarak, altında o çocuğun kartları:
   [Ödev sonuçları grafiği](odev-grafigi.md) ve [Derslere göre başarı oranı](ders-oranlari.md) ("Ödevler" kartı),
   [Sınav grafiği](sinav-grafigi.md), [Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md).
5. Bakılabilecek en az iki eğitim dönemi varsa en üstte eğitim yılı şeridi (bu sayfa, velinin şeridi gördüğü üç sayfadan
   biri: Ödevler, Devamsızlık, İlerleyiş).

Tasarımda (Tasarım 1 önizlemesi): başlık **"İlerleyiş"**, altında çocuğun adı ve sınıfı ("Elif · 7-A", öbür oturumda
"Can · 5-B"). Şerit ve "Hepsi" yok; çocuğun adı başlık olarak tekrar yazılmaz. İçerik öğrencinin tasarımdaki İlerleyişim'i
gibi: **"Derslere göre ortalama"** (sağında "1. dönem"; Can'ın oturumunda "Can · 5-B · 1. dönem"), yan yana **"Sınav
sonuçları"** ve **"Ödev sonuçları"** grafikleri, altında **"Son sınavlar"** listesi. Velide "Ödev sonuçları" listesi yok
(o liste yalnız öğrencide).

### Veli

1. Menüden **"İlerleyiş"**e ya da ana sayfadaki **"İlerleyiş"** kutucuğuna dokun.
2. Tek çocuğun varsa sayfa doğrudan onun kartlarını gösterir.
3. Birden çok çocuğun varsa:
   - **"Hepsi"** seçiliyken her çocuk adının başlığı altında alt alta gelir;
   - şeritte bir çocuğun adına basınca sayfa yalnız onun kartlarına daralır (adres değişmez). Bu seçim Ödevler ve
     Devamsızlık sayfalarında da geçerli kalır; eğitim yılı şeridi de seçtiğin çocuğun okuluna (ve önceki okullarına) göre
     yenilenir.
   - Sol menünün başındaki Portallarım'da çocuğun satırına (üstte "Veli", altında çocuğun adı; KILAVUZ'da "Veli · çocuğun
     adı") basmak da aynı çocuğu seçer (veli portalındayken yeni oturum açılmaz).
   - Çocukla ilgili bir bildirimden geldiysen o çocuk seçili açılır.
4. Her çocuğun "Ödevler" kartında **"Sonuçlara göre" / "Derslere göre"** ve **"Grafiği gizle"** çalışır. "Grafiği gizle"
   bütün çocukların ödev grafiklerini birlikte gizler (tercih tek). "Sonuçlara göre" / "Derslere göre" ise yalnız bastığın
   kartı hemen değiştirir; öbür çocukların kartları sayfa yeniden açılınca son seçtiğin görünümle gelir.
5. Her çocuğun "Sınav grafiği" kutusu ayrı: şablonu, ölçümü, Grafik/Liste ve bant düğmesi kutu kutu değişir. Göstergede
   "Öğrencinin değeri" yazar.
6. Geçmiş bir yıla bakmak için en üstteki eğitim yılı şeridinden seç (bir çocuk seçiliyken ya da tek çocukta o çocuğun
   yılları listelenir).

Tasarımda: sayfa yalnız bulunduğun oturumdaki çocuğu gösterir. Öbür çocuğun ilerleyişi için:

1. Sol menünün başındaki Portallarım'dan öbür çocuğun veli portalına geç ya da
2. **"Çocuklarım"**da çocuğa dokun; açılan pencerenin "Portal" satırında **"Portalını aç"** (bulunduğun çocukta "Şu an
   Elif'in oturumundasın" yazar, düğme çıkmaz; altında "Her çocuğun ayrı oturumu var.").
3. Yeni oturumun "İlerleyiş" sayfası yalnız o çocuğun kartlarını gösterir.

### Öğretmen ve müdür

Bugünkü düzende öğretmenlik ve müdürlük yetişkin hesabına bağlı ayrı portallardır; veli bağı ise yetişkin hesabındadır.
Öğretmen ya da müdür portalındayken çocuğunun ilerleyişi bu bağla açılmaz:

1. Çocuğunu veli koduyla ("+ Ekle → Veli" ya da Çocuklarım) eklediysen sol menünün başındaki **Portallarım**'da çocuğun
   **"Veli"** satırı çıkar (altında çocuğun adı).
2. Ona dokun: veli portalına geçersin (öğretmen ya da müdür oturumu kapanır, yenisi açılır) ve o çocuk seçili gelir.
3. Menüdeki **"İlerleyiş"** bu sayfayı açar; görünüm yukarıdaki velininkiyle aynı (iki ya da daha çok çocukta şerit dahil).

Eski usul hesapta (öğretmenlik ya da müdürlük yetişkin hesabının kendisinde duruyorsa) çocuk bu hesaba bağlıdır: menünün
altında **"Velisi olduğum"** bölümü çıkar ("Çocuklarım", "Ödevleri", "Devamsızlığı", **"İlerleyişi"**); "İlerleyişi" bu
sayfayı açar. Bu durumda eğitim yılı şeridi veli sayfası kuralıyla değil öğretmen/müdür hesabının kendi okul şeridi
kuralıyla çıkar (şerit yalnız rolü "veli" olan hesapta veli sayfalarına göre süzülür); sınav grafiğinde de okul personeli
kuralı işler, yalnız öğretmenin ya da müdürün kendi okulunda yapılmış sınavlar görünür.

Tasarımda da çocuğun ilerleyişine Portallarım'dan o çocuğun veli oturumuna geçilerek bakılır; önizlemede "Velisi olduğum"
bölümü yok.

## Kurallar ve sınırlar

- **Yalnız bağlı çocuklar:** sunucu her çocuk için ayrı istek alır ve veli bağını denetler; bağ kalkınca (veli "Kaldır"
  derse ya da okul bağı çözerse) o çocuğun verisi "Bu öğrenciyi görme yetkin yok" ile reddedilir
  ([Veli bağlama](../hesaplar/veli-baglama.md)).
- **Çocuğun gözünden bakış:** ödev ve sınav kartları velinin seçtiği yıla göre, çocuğun okulu ve önceki okulları üzerinden
  süzülür; veli çocuğun eski okulundaki kayıtları "Önceki okullar" grubundan görür.
- **Okul kapatamaz:** bu sayfa Özellikler'de kapatılan bir bölüm değil. Bir çocuğun okulunda "Ödevler" kapalıysa o çocuğun
  "Ödevler" kartı "Henüz ödev yok.", "Sınavlar" kapalıysa sınav grafiği kutusunda kırmızı ileti çıkar; öbür çocuğun kartları
  etkilenmez.
- **Bir çocuğun isteği düşerse** (ör. bağlantı) sayfanın tamamı o hatanın iletisini gösterir; çocuklar birlikte beklenir.
- **Tercihler tarayıcıda:** "Sonuçlara göre / Derslere göre" ve "Grafiği gizle" bütün çocuklar için tek tercihtir ve aynı
  tarayıcıdaki başka hesaplarla paylaşılır.
- **"Hepsi" seçiliyken eğitim yılı:** iki ya da daha çok çocukta çocuk seçilmemişse yıl listesi velinin hesabının bağlı
  olduğu okula (ilk eklenen çocuğun okulu) göredir; bir çocuğu seçince onun yıllarına geçer.
- **Servisçi, öğrenci ve yönetici** bu sayfayı görmez (menülerinde yok).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [İlerleyiş](README.md)):

- [İlerleyişim sayfası](ilerleyisim.md) — öğrencinin kendi sayfası; velinin çocuk portalındaki "İlerleyişi".
- [Ödev sonuçları grafiği](odev-grafigi.md), [Derslere göre başarı oranı](ders-oranlari.md).
- [Sınav grafiği](sinav-grafigi.md), [Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md).
- [Sınav sonuçları sütun grafiği](sinav-sonuclari-grafigi.md), [Derslere göre ortalama](derslere-gore-ortalama.md) — tasarım.

**İlgili:**

- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md), [Portallarım](../portallar/portallarim.md),
  [Çocuklarım](../portallar/cocuklarim.md).
- [Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md) — "İlerleyiş" kutucuğu.
- [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md).
- [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md) — bildirimden gelince çocuğun seçilmesi.
- [Veli bağlama](../hesaplar/veli-baglama.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) — `SAYFALAR['veli-ilerleyis']`,
  `cocuklarIcin`, `veliCocukSeridi`, `veliSeciliCocuk`, `veliCocukYok`; kartlar
  [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md) (`ilerleyisKartlari`,
  `ilerleyisGrafikleriniYukle`); grafikler [public/js/parcalar/28-grafik.md](../../public/js/parcalar/28-grafik.md); menü
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (`veliBolumu`); yıl şeridi
  [public/js/parcalar/16-egitim-yili.md](../../public/js/parcalar/16-egitim-yili.md) (`VELI_YIL_SAYFALARI`, `yilOgrencisi`);
  şerit düğmesi [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`veli-cocuk`); portal satırı
  [public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md); kutucuk
  [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md). Görünüm `public/css/parcalar/24-veli.css`
  ([CSS.md](../../public/css/parcalar/CSS.md)).
- Sunucu: her çocuk için [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) `GET /api/progress?studentId=`
  ve [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) `GET /api/exams/grafik?ogrenci=`; yetki
  [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`canSeeStudent`: veli bağı).
- Testler: [testler/test-veli-coklu.md](../../testler/test-veli-coklu.md) (veli çocuğun ilerleyişini görür, bağ kalkınca
  göremez), [testler/test-nakil.md](../../testler/test-nakil.md) (veli yıl seçicide önceki okulu seçince eski ödevi görür).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Veli tarafı").

## Sık sorulanlar

- **İki çocuğum var, ikisini birlikte görebilir miyim?** Bugün evet ("Hepsi"). Kullanıcının 3 Ekim kararıyla tasarımda her
  çocuk ayrı oturumdur; birlikte görünüm kalkacak.
- **Bir çocuğun grafiğini gizleyince öbürününki de gizlendi.** "Grafiği gizle" tektir; bütün ödev grafiklerine birlikte
  uygulanır.
- **Çocuğumun ödev serisini görebilir miyim?** Hayır; seri yalnız öğrencinin kendisine gösterilir (teşvik içindir,
  kimseyle karşılaştırılmaz).
- **Çocuğumun eski okulundaki notları?** Eğitim yılı şeridinde "Önceki okullar" grubundan o dönemi seç.

## Sırada

- Velide her çocuk ayrı oturum (kullanıcının 3 Ekim kararı): "Hepsi" şeridi ve birleşik görünüm kalkacak; sayfa yalnız
  oturumdaki çocuğu gösterecek, alt yazıda çocuğun adı ve sınıfı. Önizlemelerde ve gerçek kodda denetlenecek.
- Arayüz önizlemesi (Tasarım 1) koda geçerken: "Derslere göre ortalama", "Sınav sonuçları" sütun grafiği, "Son sınavlar".
- Optimizasyon + saklama süreleri: veli yalnız aktif yılı ve bir önceki yılı görecek.
- Android yerel uygulama: velinin "Diğer" sekmesinde İlerleyiş.
