# Servis · Bugünkü yoklama (yönetimin salt okunur görünümü)

**Durum:** Kodda var; tasarımda ek olarak servis penceresinin "Bugünkü yoklama" sekmesinde sabahı ve akşamı yan yana gösteren tablo.

Okul yönetiminin her servisin bugünkü yoklamasını (kim bindi, kim indi, velilerin işaretleri, servisçinin notları) değiştiremeden gördüğü
pencere.

## Ne işe yarar

Servisçi yoklamayı kendi telefonundan işaretler; müdür ya da servis sorumlusu "Bugün 3. Servis'e kim binmedi, okula kaçta vardılar?"
sorusunu buradan cevaplar (ör. veli okulu aradığında). Tanımdaki karar: "Okul yönetimi (servis.yonet) Servisler sayfasında her servisin
bugünkü yoklamasını salt okunur görür."

## Nereden açılır

[Servisler sayfası](servisler-sayfasi.md) → servisin kartında **"Bugünkü yoklama"**. Pencerenin başlığı "1. Servis — bugünkü yoklama";
önce "Yükleniyor..." yazar.

Tasarımda: servisin satırına dokununca açılan penceredeki **"Bugünkü yoklama"** sekmesi.

## Adım adım

### Müdür

1. "Servisler" sayfasında servisin kartında **"Bugünkü yoklama"**ya bas.
2. Pencerenin üstünde **"Sabah yoklaması"** ya da **"Akşam yoklaması"** ve gri rozet "Bugün · 07:00–09:20".
3. Altında mavi bilgi kutusu:
   - Servis saatindeyse: "Salt okunur: işaretleri servisçi koyar." ve varsa "Sefer başladı: 07:36 · Okula varış: 08:12." (akşam "Yoklama
     bitti: 17:40").
   - Saat dışındaysa: "Şu an servis saati değil (sabah 07:00–09:20, akşam 16:30–19:00). Aşağıda sıradaki aralığın listesi ve velilerin
     işaretleri var."
4. Sayılar: "6 öğrenci · 3 bindi · 1 binmedi · 1 bekliyor · 1 binmeyecek" (akşam "geldi", "gelmedi", "indi"; yoklama kapandıysa
   "işaretlenmedi"; sıfır olanlar yazılmaz).
5. Öğrenciler o dönemin **sırasıyla**, sıra numarasıyla: ad, "7-A · durak", saat ("Bindi 07:42", "Geldi 16:40 · İndi 17:10"), velinin
   işareti ("Velisi: bugün binmeyecek · not"), o gün için öğrenciye yazılmış not ("Servisçinin notu: …") ve sağda durum rozeti: "Bindi"
   / "İndi" (yeşil), "Geldi" (mavi), "Binmedi" / "Gelmedi" (kırmızı), "Binmeyecek" / "İşaretlenmedi" (gri).
6. En altta bütün servise yazılmış notlar: "Servisçinin notu (yarın): Pazartesi 10 dakika erken geleceğim."
7. Serviste öğrenci yoksa: "Bu serviste öğrenci yok." Pencereyi kapatmak için perdeye dokun ya da kapat düğmesine bas.

Pencere açıldığı anın görüntüsüdür; kendiliğinden yenilenmez, yeniden açarak tazelersin.

### Öğretmen ve çalışan

"Servisleri ve servis öğrencilerini düzenler" yetkisi olan öğretmen (bugün "Servis Sorumlusu" ek rolü; tasarımda çalışan) müdür gibi
görür. Yetkisi olmayan bu uca giremez: "Servis yoklamasını servisçi alır; okul yönetimi görür."

### Servisçi

Kendi servisinin aynı verisini işaretleyebildiği hâliyle [Yoklama sayfası](yoklama-sayfasi.md)'nda görür.

### Tasarımda (Tasarım 1 önizlemesi)

Servis penceresinin **"Bugünkü yoklama"** sekmesi: not "Salt okunur: servisçi yoklamayı kendi telefonundan işaretler. Saatler Türkiye
saatiyle." ve tablo — sütunlar **"Öğrenci"**, **"Sabah · 07:00–09:20"**, **"Akşam · 16:30–19:00"**. Hücrelerde rozet: "Bindi 07:41",
"Binmedi", "Geldi 16:40", "Gelmedi", "İndi 17:10", "Binmeyecek (veli bildirdi)", sabah bittiyse işaretsiz için "İşaretlenmedi", akşam
başlamadıysa "Başlamadı", başladıysa "Bekliyor"; o gün servise eklenen öğrencide "Bugün eklendi · yarın listede". Telefonda tablo
satırları alt alta "Sabah" / "Akşam" etiketleriyle dizilir. Sabah ve akşamın birlikte görünmesi önizlemenin düzenidir; kullanıcı bu
ekran için ayrıca bir şey söylemedi.

## Kurallar ve sınırlar

- **Kim görür:** müdür ve `servis.yonet` yetkilisi (okulun bütün servisleri); servisçi yalnız kendi servislerini, işaretleyebilir hâliyle.
  Veli ve öğrenci bu pencereyi görmez.
- **Salt okunur:** yönetim işaret koyamaz, değiştiremez; işareti yalnız servisçi koyar.
- **Yalnız bugün:** geçmiş günlerin yoklaması ekranda gösterilmez; yoklama kayıtları 30 gün sonra silinir. Saat dışında sıradaki aralığın
  listesi görünür.
- **Başka okulun servisi:** "Servis bulunamadı" (404).
- **Notlar:** satırlarda yalnız listenin gününe ait öğrenci notları; bütün servise yazılmış notların hepsi (tarihleriyle) en altta.
  Öğrenciye yazılmış ileri tarihli notlar bu pencerede görünmez (kod bugün böyle).
- Bölüm kapalıysa düğme ve pencere de yoktur.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Servisler sayfası](servisler-sayfasi.md) — düğmenin yeri.
- [Yoklama sayfası](yoklama-sayfasi.md), [Sabah seferi](sabah-seferi.md), [Akşam seferi](aksam-seferi.md) — işaretlerin kaynağı.
- [Binmeyecek](binmeyecek.md), [Velilere not](gunluk-not.md), [Sırayı düzenle](sira-duzenleme.md).
- [Servise binmedi uyarısı](servise-binmedi-uyarisi.md) — tasarımda akşam okul idaresine giden bilgi.

**İlgili:**

- [Okulun devamsızlığı](../devamsizlik/okulun-devamsizligi.md) — derslerin yoklamasının yönetim görünümü (ayrı özellik).
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `GET /api/servis/yoklama?servisId=` (yönetimde
  `duzenleyebilir: false`, `acik: false`), `yoklamaCevabi`.
- Ön yüz: [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) (`servis-yoklama-bak`: pencere),
  [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md) (`syYonetimGorunumu`, `sySatirHtml` salt kipi).
- Testler: [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md) (müdürün salt okunur yoklaması).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Servis yoklaması" → "Okul yönetimi").

## Sık sorulanlar

- **Dünün yoklamasına bakabilir miyim?** Bugün hayır; pencere yalnız bugünü (saat dışında sıradaki aralığı) gösterir.
- **Servisçi yanlış işaretlemiş, düzeltebilir miyim?** Hayır; servisçi "Okula vardık"tan önce (akşam "İndi"den önce) kendisi düzeltir.
- **Velinin "binmeyecek" işaretini görebilir miyim?** Evet; öğrencinin satırında "Velisi: …" diye yazar.

## Sırada

- Linux kodlaması (Tasarım 1): servis penceresinde sabah ve akşamı yan yana gösteren "Bugünkü yoklama" sekmesi.
- 3 Ekim kararı: akşam servisine binmeyen öğrenci için okul idaresine (servis sorumlusu) bilgi.
- Optimizasyon + saklama süreleri: servis yoklama tablolarının 30 günlük temizliği ve ölçümü.
