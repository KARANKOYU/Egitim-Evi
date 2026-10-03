# Servis · Akşam seferi (Geldi / Gelmedi, Başlat, İndi)

**Durum:** Kodda var; tasarımda ek olarak sefer sürerken "Sıradaki" ev kartı ve kalan yol çizgisi, sayılarda "serviste" ve "eve bırakıldı", "Seferi bitir"in yalnız serviste kimse kalmayınca çıkması ve akşam servisine binmeyen öğrenci için veliye ve okul idaresine "Önemli" öncelikli uyarı.

Servisçinin akşam okulda öğrencileri "Geldi" / "Gelmedi" diye işaretlediği, "Başlat" ile yola çıktığı ve her öğrenciyi evine
bırakınca "İndi"ye bastığı akış.

## Ne işe yarar

Kullanıcının sözleri: "akşamda geldi seçer başta sonra başlat der indirdiğinde basar" (26 Eylül) ve "servis yoklamasıda bu çıkmadan
önce için çıkınca indi bindi" (1 Ekim). Veli "Zeynep 16:40'ta okuldan servise bindi." ve "Zeynep 17:10'da eve bırakıldı."
bildirimlerini alır; sefer sürerken aracı haritada izler.

## Nereden açılır

Servisçinin [Yoklama sayfası](yoklama-sayfasi.md); okulun akşam [servis saati](servis-saatleri.md) içinde (varsayılan 16:30–19:00)
üst kartın başlığı **"Akşam yoklaması"** olur.

## Adım adım

### Servisçi

**Okulda: Geldi / Gelmedi**

1. Akşam servis saati gelince Yoklama sayfasını aç: "Akşam yoklaması · Bugün · 16:30–19:00". Liste **bırakma sırasıyla**. Açıklama:
   "Okulda servise gelenleri işaretle; bitince aşağıdaki "Başlat"a bas."
2. Servise binen her öğrencide **"Geldi"**: satırda "Geldi 16:40", velisine "Zeynep 16:40'ta okuldan servise bindi." gider.
3. Gelmeyen öğrencide **"Gelmedi"**: velisine "Zeynep akşam servise gelmedi." (velisi bu akşam için "binmeyecek" dediyse gitmez).
   "Geldi" bildirildikten sonra "Gelmedi"ye çevrilirse bir kez "Düzeltme: Zeynep akşam servise gelmedi." gider.
4. Alt kartta büyük **"Başlat"**. Altındaki not: "3 öğrenci henüz işaretlenmedi. Başlatınca sefer başlar ve konumun velilere görünür;
   "Geldi" olanlar bırakma sırasıyla listelenir." (işaretsiz yoksa ilk cümle yazmaz).

**Başlat**

5. **"Başlat"**a bas. Tarayıcı gerekirse sorar:
   - İşaretlenmemiş öğrenci varsa: "2 öğrenci işaretlenmedi: Elif, Can (velisi: binmeyecek).
     "Geldi" işaretlenmeyen öğrenci bırakma listesine girmez. Yine de başlatılsın mı?"
   - Herkes işaretli ama hiç "Geldi" yoksa: "Servise binen ("Geldi") öğrenci yok. Yine de başlatılsın mı?
     Sefer kendiliğinden bitmez; bitince "Seferi bitir"e basarsın."
6. Sefer başlar ("Başlatılıyor..."), sayfa yeniden açılır ve üstte "Sefer başladı. Konumun servisteki öğrencilere ve velilerine
   görünüyor." yazar. "Geldi" kimse yoksa sonuna: ""Geldi" işaretli öğrenci yok; sefer kendiliğinden bitmez. Bitince "Seferi bitir"e
   bas." Bağlantı https değilse sonuna: "Bu bağlantıda konum gönderilemiyor (https gerekir); yoklama yine de sürer."

**Yolda: İndi**

7. Liste ikiye ayrılır:
   - **"Serviste olanlar (N)"**: "Geldi" olanlar (ve eve bırakılanlar) bırakma sırasıyla. Açıklama: "Bırakma sırasıyla. Öğrenciyi
     evine bırakınca "İndi"ye bas." Her "Geldi" öğrencide tek büyük **"İndi"** düğmesi.
   - **"Serviste olmayanlar (N)"**: işaretsiz ya da "Gelmedi" olanlar; açıklama "Unutulan öğrenci varsa "Geldi" işaretle; bırakma
     listesine girer." Bunlarda yine **"Geldi"** / **"Gelmedi"** düğmeleri var.
8. Öğrenciyi evine bırakınca **"İndi"**: satırda "Geldi 16:40 · İndi 17:10" ve "Eve bırakıldı" rozeti; velisine "Zeynep 17:10'da
   eve bırakıldı." gider. Bu işaret artık değişmez.
9. Alt kartta "2 öğrenci serviste. Hepsi inince sefer kendiliğinden biter." (kimse kalmadıysa "Serviste öğrenci kalmadı.") ve sefer
   açık olduğu sürece altında küçük gri **"Seferi bitir"**.
10. Son öğrenci "İndi" işaretlenince sefer kendiliğinden biter: "Herkes eve bırakıldı; sefer bitti." Konum gönderimi durur, üst kartta
    "Akşam seferi bitti; yoklama kapandı."
11. Sefer kendiliğinden bitmeyecekse (ör. kimse "Geldi" değildi) ya da konum paylaşımını erken kesmek istersen **"Seferi bitir"**: onay
    "Sefer bitsin mi? Konumun artık paylaşılmaz." → "Sefer bitti; konumun artık paylaşılmıyor." (zaten bittiyse "Sefer zaten
    bitmiş."). "Seferi bitir" yalnız konum paylaşımını kapatır; akşam yoklaması açık kalır, "İndi" işaretlenebilir.

Sefer başladıktan sonra sefer kapanırsa ("Seferi bitir" ya da ör. 45 dakika konum gelmedi) üst kartta **"Konum paylaşımını yeniden
başlat"** ve "Sefer kapalı; konumun velilere görünmüyor. "İndi" işaretleri yine de gider." yazar; "İndi" işaretlemeyi sürdürürsün.

### Veli

- Bildirimler: "Zeynep 16:40'ta okuldan servise bindi.", "Zeynep akşam servise gelmedi.", gerekirse "Düzeltme: Zeynep akşam servise
  gelmedi.", "Zeynep 17:10'da eve bırakıldı." ([Servis bildirimleri](servis-bildirimleri.md)).
- Servis kartında "Bu akşam" başlığı ve rozet: "Okuldan servise bindi 16:40" (mavi) ve yanında "Servis henüz yola çıkmadı" ya da
  "Servis yolda"; "Eve bırakıldı 17:10" (yeşil); "Akşam servise gelmedi" (kırmızı); "Bu akşam binmeyecek" (gri); işaretsizse "Henüz
  servise binmedi" ya da "Akşam seferi bitti" ([Servisim ve servis kartı](servisim.md)).
- Sıra: "Zeynep 3. sırada, önünde 2 öğrenci kaldı" (akşam önünde sayılanlar: sırada önde olup okulda "Geldi" işaretlenmiş ve henüz
  inmemiş öğrenciler; çocuğun kendisi serviste değilse sıra yazmaz).
- Servis eve 500 m ve 100 m kala bildirim (yalnız "Geldi" işaretli ve henüz inmemiş öğrenciler için;
  [Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md)).

### Öğrenci

"Servisim" sayfasında aynı rozetler ve sıra. Yoklama bildirimleri öğrenciye gitmez; yaklaşma bildirimi gider.

### Müdür, öğretmen ve çalışan (servis yönetimi)

"Bugünkü yoklama" penceresinde salt okunur: sayılar, "Sefer başladı: 16:45 · Yoklama bitti: 17:40.", öğrenci satırları
([Yönetimin yoklama görünümü](yonetimin-yoklama-gorunumu.md)).

### Tasarımda (Tasarım 1 önizlemesi)

- Üst kart: **"Akşam yoklaması · eve dönüş"**, "Bugün · 16:30–19:00"; başlamadan "Sefer başlamadı" ve "Konumun "Başlat"a basınca
  paylaşılır."; yoldayken "Konumun öğrencilere ve velilere görünüyor" ve "başlangıç 16:45"; bitince "Eve dönüş bitti · 17:40" ve
  "İşaretler artık değiştirilemez."
- Sayılar: sefer başlayınca "geldi" yerine **"serviste"**, "indi" yerine **"eve bırakıldı"**.
- Açıklama: "Okulda servise gelenleri "Geldi" ya da "Gelmedi" ile işaretle; bitince aşağıdaki "Başlat"a bas."
- "Başlat" onayı ayrı pencere: başlık "Sefer başlasın mı?", işaretsizlerin adları ve "Yine de başlatılsın mı?", düğmeler **"Vazgeç"** /
  **"Başlat"**.
- Yolda **"Sıradaki"** kartı: bir sonraki "Geldi" öğrencinin durağı, adı, adresi ve **"Yol tarifi"**; serviste kimse yoksa "Serviste
  öğrenci yok" — "Unutulan öğrenci varsa aşağıda "Geldi" işaretle."
- Alt kart: "2 öğrenci serviste. Hepsi inince sefer kendiliğinden biter." ya da "Serviste öğrenci yok. Unutulan öğrenci yoksa seferi
  bitir." ve yalnız bu durumda **"Seferi bitir"** ("Sefer bitti; konum paylaşımı durdu.").
- 3 Ekim kararı: okuldan çıkarken listede olup binmeyen (ve "binmeyecek" bildirilmemiş) öğrencinin velisine "Can akşam servisine
  binmedi" bildirimi ve okul idaresine (servis sorumlusu) bilgi, "Önemli" öncelikli
  ([Servise binmedi uyarısı](servise-binmedi-uyarisi.md)).

## Kurallar ve sınırlar

- **Yalnız akşam servis saatinde** (ya da aralık içinde başlamış seferin 60 dakikalık uzatmasında). Dışında: "Yoklama sabah
  07:00–09:20 ve akşam 16:30–19:00 arasında açılır."
- **Akşamın seçenekleri** "Geldi", "Gelmedi", "İndi": başkası gelirse "Akşam yoklamasında "Geldi", "Gelmedi" ya da "İndi" seçilir."
- **"İndi" yalnız "Başlat"tan sonra:** önce basılırsa "Önce "Başlat"a bas: sefer başlamadan "İndi" işaretlenmez." Yalnız "Geldi"
  öğrenciye: ""İndi" yalnız okulda servise binen ("Geldi") öğrenciye işaretlenir."
- **"İndi" kalıcıdır:** "Öğrenci eve bırakıldı; bu işaret artık değiştirilemez."
- **Sitede sefer başladıktan sonra** "Geldi" öğrencide yalnız "İndi" düğmesi çıkar; "Serviste olmayanlar"daki öğrenci sonradan
  "Geldi" yapılabilir (bırakma listesine girer).
- **Sefer kendiliğinden biter:** serviste "Geldi" kimse kalmadığında ve en az bir öğrenci eve bırakıldığında ("Herkes eve bırakıldı;
  sefer bitti."). Sunucu, serviste kalan son öğrenci "Gelmedi"ye çevrilirse de bitirir ("Serviste öğrenci kalmadı; sefer bitti.");
  ama sitede yoldaki "Geldi" öğrencide yalnız "İndi" düğmesi olduğu için bu yol ekranda yok. Hiç "Geldi" olmadan başlatılan sefer
  kendiliğinden bitmez; "Seferi bitir" gerekir ya da saat bitince (60 dakikalık uzatmayla) kapanır.
- **Sefer yönü** saatten gelir (akşam eve dönüş); aralık dışında başlatılamaz: "Sefer yalnız servis saatlerinde başlar: …".
  Akşam yoklaması bittiyse yeniden başlatılamaz: "Akşam seferi bitti; yoklama kapandı."
- **Bildirimler** yalnız velilere, bir kez, ilk adla ve Türkiye saatiyle ("16:40'ta", "17:10'da"); "binmeyecek" varken "Gelmedi"
  bildirimi gitmez.
- **Konum** yalnız https'te ve sayfa açıkken gider ([Canlı konum ve servis haritası](canli-konum-ve-harita.md)).
- **Saklama:** yoklama ve seferin başlama/bitiş anları 30 gün sonra silinir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Sabah seferi](sabah-seferi.md) — gidiş akışı.
- [Yoklama sayfası](yoklama-sayfasi.md), [Sırayı düzenle](sira-duzenleme.md) (bırakma sırası), [Binmeyecek](binmeyecek.md).
- [Servis bildirimleri](servis-bildirimleri.md), [Servise binmedi uyarısı](servise-binmedi-uyarisi.md) (tasarım).
- [Canlı konum ve servis haritası](canli-konum-ve-harita.md), [Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md).
- [Yönetimin yoklama görünümü](yonetimin-yoklama-gorunumu.md), [Servisim ve servis kartı](servisim.md),
  [Servis saatleri](servis-saatleri.md).

**İlgili:**

- [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md), [Telefon bildirimi](../bildirim/telefon-bildirimi.md).
- [Önemli etiketi](../mesaj/onemli-etiketi.md) — binmedi uyarısının önceliği (tasarım).

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `POST /api/servis/yoklama` (akşam `geldi` /
  `gelmedi` / `indi`; "Başlat"tan önce `indi` 409 `baslamadi`; son "İndi"de sefer biter), `POST /api/servis/sefer-basla`
  (`bekleyen`, `serviste`), `POST /api/servis/sefer-bitir`, `yoklamaBildir`.
- Depo: [sunucu/veri/depo/servis-yoklama.md](../../sunucu/veri/depo/servis-yoklama.md), [sunucu/veri/depo/okul-hayati.md](../../sunucu/veri/depo/okul-hayati.md).
- Ön yüz: [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md) — `syListeHtml` ("Serviste
  olanlar" / "Serviste olmayanlar"), `sySatirHtml`, `syAltHtml`, `sy-sefer-basla`; seferi bitirme ve konum
  [public/js/parcalar/19e-servis-konum.md](../../public/js/parcalar/19e-servis-konum.md) (`sefer-bitir`, `seferIzlemeyiBaslat`).
- Testler: [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md) (geldi/gelmedi/indi, "Eve bırakıldı HH:MM",
  düzeltme, sefer bitişi).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Servis yoklaması" → "Akşam").

## Sık sorulanlar

- **"Başlat"tan sonra birini unuttuğumu fark ettim.** "Serviste olmayanlar" kartında ona "Geldi" de; bırakma listesine girer.
- **Herkesi bıraktım ama sefer bitmedi.** Hiç "İndi" işaretlenmediyse sefer kendiliğinden bitmez; alt karttaki "Seferi bitir"e bas.
- **"İndi"yi yanlış öğrenciye bastım.** Eve bırakma işareti değişmez (okul yönetimi de değiştiremez); veliye bildirim gitmiştir.
  Durumu veliye ve okul yönetimine telefonla bildir (bugün servisçinin mesaj kutusunda yazabileceği kimse yok).
- **Konumum velilere görünmüyor diyorlar.** Sayfayı açık tut, telefonu kilitleme; üst kartta "Konum paylaşımını yeniden başlat"
  çıktıysa ona bas.

## Sırada

- 3 Ekim kararı: akşam servisine binmeyen öğrenci için veliye ve okul idaresine "Önemli" öncelikli uyarı (kodu Linux'ta).
- Linux kodlaması (Tasarım 1): "Sıradaki" ev kartı, kalan yol çizgisi, "serviste" / "eve bırakıldı" sayıları.
- Android yerel uygulama: akşam yoklaması ve arka planda konum.
