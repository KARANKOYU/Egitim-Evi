# Ödevler · Ödev hatırlatmaları

**Durum:** Kodda var ("Yarın … ödevin var" bildirimi); tasarımda ek olarak Hesap ayarlarında varsayılan hatırlatma kuralı, ödevin penceresinde ödeve özel "Hatırlat" ve velinin kendi kuralı olur (kullanıcı 27 Eylül, tanım ve Tasarım 1 önizlemesi).

Son günü yaklaşan ödevi öğrenciye (ve velisine) bildirimle hatırlatmak: bugün son günden bir gün önce tek bir bildirim; tasarımda öğrencinin ve velinin kendi seçtiği kurallarla.

## Ne işe yarar

Kullanıcı 29 Ağustos'ta "ödev son gününe bir gün kala da öğrencilere" bildirim istedi; 25 Eylül'de metnini verdi: "yarın …
dersinden ödev_adı ödevi var". 27 Eylül'de bunu otomasyona çevirdi: "ödevler içinde öğrenci orada bir ödev için ondan önceki
günü, ödev gelecekteyse her gün şu şekilde diye otomasyon".

## Nereden açılır

- **Bugün:** ayar yok; bildirim kendiliğinden gelir (üst şeritteki zil, telefon bildirimi açıksa telefona).
- **Tasarımda:**
  - **Hesap ayarları → "Ödev hatırlatmaları"** bölümü (varsayılan kural);
  - ödevin penceresinde sağ üstteki **"Hatırlat"** düğmesi (yalnız süren ödevde) ve bilgi tablosundaki **"Hatırlatma:"** satırı;
  - **"Hatırlatıcılar"** sayfasında **"Ödev hatırlatmaları"** grubu (kuralı ve ödeve özel kurallar).

## Adım adım

### Öğrenci (bugünkü site)

1. Son günü yarın olan ve henüz sonuçlanmamış her ödevin için, sabah 08:00'den sonra **günde bir kez** bildirim gelir:
   - tek ödevde: **"Yarın Matematik dersinden "Kesirler" ödevin var (son saat 12:00)."**
   - birden çokta: **"Yarın 3 ödevin var: Matematik "Kesirler", Türkçe "Okuma günlüğü", Fen Bilimleri "Hücre çizimi"."**
     (4'ten fazlaysa ilk dördü ve "ve 2 ödev daha").
2. Bildirime dokununca "Ödevler" sayfası açılır.
3. Aynı gün aynı hatırlatma ikinci kez gelmez.

### Veli (bugünkü site)

Çocuğunun hatırlatmasının kopyası sana da gelir, başında çocuğun adı: **"Elif Yılmaz · Yarın Matematik dersinden "Kesirler"
ödevin var (son saat 12:00)."** Dokununca o çocuğun ödevleri açılır. İki çocuğuna aynı metin gidiyorsa tek bildirimde iki ad
yazar.

### Öğretmen

Öğretmen bir şey ayarlamaz; ödevin son gününü doğru girmesi yeter ([Başlama ve son teslim](tarih-ve-saat.md)).

### Tasarımda — öğrenci (spec ve Tasarım 1 önizlemesi)

**Hesap ayarları → "Ödev hatırlatmaları":**

1. **"Bütün ödevlerin için"** başlığı altında onay kutuları (birden çok seçilebilir):
   - **"Son günden 1 gün önce 19:00"** (varsayılan, işaretli gelir),
   - **"Son güne kadar her gün 19:00"**,
   - **"Son gün 08:00"**,
   - **"Kapalı"**.
   Açıklama: **"Birden çok seçebilirsin. Bir ödev için değiştirmek istersen ödevin penceresinde “Hatırlat”a bas."**
2. **"Ödev başına"**: **"2 ödevde kendi kuralın var"** ya da **"Ödev başına kural yok"**, yanında **"Hatırlatıcılarda gör"**.
3. Altta **"Kayıtlı: son günden 1 gün önce 19:00"** ve **"Kaydet"**. Kaydedince **"Ödev hatırlatma kuralın kaydedildi: son
   günden 1 gün önce 19:00."**

**Ödevin penceresinde "Hatırlat":**

1. Süren ödevin penceresinde sağ üstte **"Hatırlat"** (zil simgeli). Bilgi tablosunda **"Hatırlatma:"** satırı:
   **"varsayılan kural (son günden 1 gün önce 19:00) · sıradaki: 30 Eylül Çarşamba 19:00"**, **"bu ödev için kapalı"**,
   **"teslim ettiğin için durdu"** gibi.
2. **"Hatırlat"** penceresi: üstte ödevin adı ve **"Son tarih: 1 Ekim 2026 Perşembe 23:00"**; üç seçenek:
   - **"Varsayılan kuralım"** — altında "Hesap ayarları → Ödev hatırlatmaları: son günden 1 gün önce 19:00";
   - **"Bu ödev için özel"** — seçince kutular açılır: üç hazır seçenek ve **"Şu gün ve saatte"** (gün + saat; en erken bugün,
     en geç son gün);
   - **"Bu ödev için kapalı"**.
3. Seçtikçe altta **"Sıradaki hatırlatma: 30 Eylül Çarşamba 19:00"**, kalmadıysa **"Bu kuralla son tarihe kadar hatırlatma
   kalmadı."**, kapalıda **"Bu ödev için hatırlatma gelmez."**
4. Not: **"Ödevi teslim edince (dosya yükleyince ya da quizi bitirince), ödev sonuçlanınca ya da son gün geçince hatırlatmalar
   durur."**
5. **"Vazgeç"** / **"Kaydet"**. Hatalar: **"En az bir seçenek işaretle ya da bir gün ve saat seç."**, **"Saati de seç."**,
   **"Hatırlatma şimdiden sonra ve son tarihten önce olmalı."** Kaydedince **"Hatırlatma kaydedildi: bu ödeve özel: son gün
   08:00."**

**"Hatırlatıcılar" sayfasında** "Ödev hatırlatmaları" grubu: ilk satır **"Bütün ödevlerin"** — "varsayılan kural: …" —
"Açık"/"Kapalı" (basınca Hesap ayarlarındaki bölüme gider); ödeve özel kural kurduğun her ödev bir satır: **"Ödev: Kesirlerle
toplama — alıştırma 3"** — kural ve "sıradaki: …" ya da "teslim edildi, durdu".

### Tasarımda — veli

Veli kendisi için aynı kuralı kurar (çocuğunun ödevleri için); velide her çocuk ayrı oturum olduğundan kural o çocuğun
oturumunda kurulur. Metinler çocuğa göre: **"Elif'in bütün ödevleri için"**, **"Hatırlatma sana Elif'in adıyla gelir."**,
**"Elif ödevi teslim edince (dosya yükleyince ya da quizi bitirince), ödev sonuçlanınca ya da son gün geçince hatırlatmalar
durur."**, **"Elif teslim ettiği için durdu"**.

## Kurallar ve sınırlar

Bugün:

- Yalnız **son günü yarın** olan, **aktif** (sonuçlanmamış) ödevler; öğrencinin o ödevde sonucu varsa gitmez.
- Gönderim saati: sunucunun yerel saatiyle **08:00'den sonraki** ilk taramada (tarama 5 dakikada bir).
- Öğrenci başına **günde bir** hatırlatma (bütün yarınki ödevleri tek bildirimde); kayıtlar 30 gün tutulup silinir.
- Dosya yükleyen ya da quizi bitiren öğrenciye de gider (teslim denetlenmez).
- Okulda **Ödevler kapalıysa** gitmez.
- Veliye kopyası gider; okulun ayarı yok, kişi kapatamaz (telefon bildirimini kapatmak yalnız telefona gelmesini durdurur:
  [Bildirim ayarları](../ayarlar/bildirim-ayarlari.md)).
- Son tarihi olmayan ödev hiç hatırlatılmaz.

Tasarımda (ödev hatırlatma otomasyonu tanımı):

- Varsayılan kural ve ödeve özel kural; birden çok seçenek birlikte seçilebilir.
- Hatırlatmalar **ödev sonuçlanınca**, **öğrenci teslim edince** (dosya yüklediyse ya da quizi bitirdiyse) ya da **son gün
  geçince** durur.
- Bugünkü "son günü yarın" bildirimi varsayılan kurala katılır; aynı hatırlatma iki kez gitmez.
- Saatler **Türkiye saatiyle**; kişisel hatırlatıcıların dakikalık altyapısı kullanılır.
- Tasarım 1 önizlemesinde varsayılan kural "Son günden 1 gün önce 19:00".

## Kardeşler ve ilgili

**Kardeşler:** [Başlama ve son teslim](tarih-ve-saat.md) · [Ödevin penceresi](odev-penceresi.md) · [Teslim](teslim.md) ·
[Sonuçlandırma](sonuclandirma.md) · [Ödev serisi](seri.md).

**İlgili:** [Otomatik bildirimler](../bildirim/otomatik-bildirimler.md), [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md),
[Telefon bildirimi](../bildirim/telefon-bildirimi.md), [Bildirim metinleri](../bildirim/bildirim-metinleri.md),
[Hatırlatıcılar](../hatirlatici/README.md), [Hatırlatıcı kurma](../hatirlatici/hatirlatici-kurma.md),
[Bildirim ayarları](../ayarlar/bildirim-ayarlari.md), [Ajandaya ve hatırlatıcıya ekle (mesaj)](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md),
[Quiz çözme](../quiz/quiz-cozme.md).

## Kod tarafı

- Bugün: [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md) — `odevHatirlatmalari` (`ODEV_BAS = 8`, yarınki aktif ödevler,
  sonucu olan atlanır, `odev-yarin:<öğrenci>:<gün>` anahtarıyla günde bir, `listeYaz` en çok 4 ad), `hatirlatmalariCalistir`
  (5 dakikada bir; [sunucu/index.md](../../sunucu/index.md)); depo [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md)
  (`bitisiOlanlar`), [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`cokluBildir`, veli kopyası,
  `ilkKezOlanlar`, `hatirlatmaTemizle`).
- Bu dosyayı doğrudan deneyen test yok; dolaylı: [testler/test-bildirim.md](../../testler/test-bildirim.md).
- Tasarım: kodu yok. Tanımı "Mesaj ayarları … ödev hatırlatma otomasyonu" işinin 6. bölümünde (iş 8; tanımlar depoya
  girmez); kullanılacak kişisel hatırlatıcı altyapısı [public/js/parcalar/19h-hatirlaticilar.md](../../public/js/parcalar/19h-hatirlaticilar.md),
  [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md). Kodlanınca bu bölüm ve Durum satırı güncellenir.
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Otomatik bildirimler" tablosu: "Ödevin son günü
  yarın").

## Sık sorulanlar

- **Ödevimi teslim ettim ama yine "Yarın … ödevin var" geldi.** Bugünkü hatırlatma teslime bakmaz, yalnız sonuca bakar.
  Tasarımda teslim edince durur.
- **Hatırlatmayı kapatabilir miyim?** Bugün hayır. Tasarımda Hesap ayarlarında "Kapalı" ya da ödevin penceresinde "Bu ödev
  için kapalı".
- **Hatırlatma saat kaçta gelir?** Bugün son günden bir gün önce sabah 08:00'den sonra. Tasarımda seçtiğin saatte (19:00, 08:00
  ya da kendi seçtiğin).

## Sırada

- Mesaj ayarları … ödev hatırlatma otomasyonu (iş 8): varsayılan kural, ödeve özel "Hatırlat", velinin kuralı, durma
  koşulları, Türkiye saati.
- Bildirim paneli sekmeleri: hatırlatmalar "Ödev" sekmesinde toplanacak ([Bildirim paneli](../bildirim/bildirim-paneli.md)).
