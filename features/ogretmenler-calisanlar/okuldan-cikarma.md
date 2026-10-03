# Öğretmenler ve çalışanlar · Okuldan çıkarma

**Durum:** Kodda var; tasarımda ek olarak rolsüz ya da görevli her çalışan için aynı iş ve görevi almakla okuldan çıkarmanın ayrı
olması.

Müdürün bir öğretmeni okuldan çıkarması: öğretmenin bu okuldaki rolü silinir, kendi Eğitim Evi hesabı ve öbür okulları durur.

## Ne işe yarar

Okuldan ayrılan, tayini çıkan ya da yanlışlıkla eklenen kişiyi okulun listesinden çıkarmak için. Öğretmenin hesabı kendisinindir:
okul onu silmez, yalnız **okuldaki satırını** kaldırır. Öğretmenin verdiği ödevler, girdiği notlar ve yoklamalar okulun kaydıdır,
silinmez; dersleri öğretmensiz kalır ve müdür yeni öğretmen atar.

Öğretmen kendisi de ayrılabilir ([Bu okuldan ayrıl](../portallar/okuldan-ayrilma.md)); bu belge **okulun** çıkarmasını anlatır.

Tasarımda (çalışan tanımı): bir çalışanın görevini (rolünü) almak onu okuldan çıkarmaz — kişi rolsüz çalışan olarak kalır
([Rol atama](rol-atama.md)). Okuldan çıkarmak **ayrı bir iştir** ve rolsüz ya da görevli her çalışan için aynıdır.

## Nereden açılır

- **"Öğretmenler"** → öğretmenin satırındaki **"Hesap"** → pencerenin altındaki **"Okuldan çıkar"** bölümü
  ([Hesap penceresi](hesap-penceresi.md)). Bölüm "Öğretmeni okuldan çıkarır" yetkisi olana görünür (müdürde var).
- Eski düzenden kalan (okulun ya da kişinin ayrı açtığı) öğretmen hesabında aynı yerde **"Hesabı sil"** bölümü vardır.

Tasarımda: **"Çalışanlar"** listesinde kişinin penceresi. Tasarım 1 önizlemesinin kişi penceresinde "Okuldan çıkar" düğmesi
**yoktur** (yalnız Roller, Kullanıcı adı, Müdürlük); düğmenin yeri tasarımda gösterilmemiştir (açık nokta).

## Adım adım

### Müdür

Kendi hesabıyla eklenmiş öğretmen (bugün hepsi böyle eklenir):

1. **"Öğretmenler"**de öğretmenin **"Hesap"**ına bas.
2. Pencerenin altındaki **"Okuldan çıkar"** bölümü: "Öğretmenin bu okuldaki rolü kalkar; hesabı kendisinde kalır. Dersleri öğretmensiz
   kalır; verdiği ödev ve sınavlar silinmez."
3. Kırmızı **"Okuldan çıkar"**a bas. Onay: **"Ayşe Kaya okuldan çıkarılsın mı?"** — Tamam / İptal.
4. Düğme "Siliniyor..." olur. Pencere kapanır, liste yenilenir; yeşil ileti: **"Ayşe Kaya okulun öğretmen listesinden çıkarıldı."**
5. İşlem kaydına **"Öğretmen okuldan çıkarıldı"** — "Ayşe Kaya" yazılır ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
6. Sonra: öğretmensiz kalan derslere yeni öğretmen ata ([Ders atama](../siniflar-dersler/ders-atama.md)); öğretmenin açık ödevlerini
   Ödevler sayfasından sonuçlandır ([Müdürün ödev görünümü](../odev/mudurun-odev-gorunumu.md)); öğretmeni olan etütlere bak
   ([Etüdü düzenleme ve silme](../etut/etudu-duzenleme-ve-silme.md)).

Eski düzenden kalan öğretmen hesabı:

1. Penceredeki **"Hesabı sil"** bölümü: "Öğretmenin dersleri öğretmensiz kalır; verdiği ödev ve sınavlar silinmez."
2. **"Hesabı sil"** → onay: **"Ayşe Kaya hesabı silinsin mi? — Bu işlem geri alınamaz."**
3. Hesap tamamen silinir: **"Ayşe Kaya hesabı silindi."** İşlem kaydı yine "Öğretmen okuldan çıkarıldı".

Tasarımda:

1. Görevini almak istiyorsan çipindeki × ile rolü al; kişi okulda rolsüz kalır ([Rol atama](rol-atama.md)).
2. Okuldan tamamen çıkarmak istiyorsan "Okuldan çıkar" (rolsüz ya da görevli fark etmez). Kişi müdürse önce müdürlüğü gitmelidir
   (ortak karar ya da yönetici/destek; [Ortak karar](ortak-karar.md)). Bu son cümle tanımda açıkça yazılı değil; müdürü tek başına
   çıkaramama kuralından çıkan sonuçtur (açık nokta).

### Çalışan

Bugün: rolünde **"Öğretmeni okuldan çıkarır"** olan öğretmen müdür gibi çıkarır. Bölüm "Hesap" penceresinde durduğu için ayrıca
**"Öğretmen bilgisi ve branşını düzenler"** de gerekir: yalnız "çıkarır" yetkisi olan, "Hesap" düğmesini görmediği için çıkarma
bölümüne ulaşamaz (kod okumasına göre). Hazır şablonlarda (Müdür Yardımcısı dahil) "çıkarır" açık gelmez. Kimse kendini bu yolla
çıkaramaz: "Kendi hesabını silemezsin." (kendisi için [Bu okuldan ayrıl](../portallar/okuldan-ayrilma.md)).

### Öğretmen (çıkarılan)

1. Bildirim gelir: **"Test Ortaokulu seni öğretmen listesinden çıkardı."**
2. O okul Portallarım'dan kalkar; o okulda açık oturumun kapanır. Yetişkin hesabın, kişi kodun, öbür okulların ve veli portalların
   olduğu gibi durur.
3. O okuldaki portalının hatırlatıcıları silinir ([Kimler görür, saklama](../hatirlatici/kimler-gorur-ve-saklama.md)).
4. Yeniden dönmek için müdüre yeni kişi kodunu verirsin ([Kodla ekleme](kodla-ekleme.md)).

### Öğrenci ve veli

Çıkarılan öğretmenin dersleri programda öğretmensiz görünür; verdiği ödevler, sınavlar, notlar ve yoklamalar yerinde kalır.

## Kurallar ve sınırlar

- **Yetki:** "Öğretmeni okuldan çıkarır" (müdürde var); pencereyi açmak için "Öğretmen bilgisi ve branşını düzenler". Yetkisiz:
  "Bu işlem için yetkin yok" (403); başka okulun ya da olmayan kişi: "Hesap bulunamadı" (404).
- **Onay şart:** onaysız gelen istek "Silmeyi onaylaman gerekiyor."; silinecek satır kalmamışsa "Hesap silinemedi" (404).
- **Kendini çıkaramazsın:** "Kendi hesabını silemezsin."
- **Müdür bu yolla çıkarılmaz:** müdür satırı bu uçla silinemez ("Hesap bulunamadı"); müdürlük için [Birden çok müdür](birden-cok-mudur.md)
  ve [Ortak karar](ortak-karar.md).
- **Ne kalır:** öğretmenin verdiği ödevler, sınavlar, notlar, yoklamalar okulda kalır; dersleri öğretmensiz olur (veritabanında ders,
  ödev, sınav ve etüdün öğretmen alanı boşalır). Gönderdiği mesajlar okulda kalır, gönderen alanı boşalır. Kendi hesabıyla eklenmiş
  öğretmenin yetişkin hesabı durur.
- **Ne gider (okuldaki satırına bağlı olanlar):** o okuldaki oturumları, bildirimleri, gelen kutusundaki mesaj kopyaları,
  hatırlatıcıları ve ödevlere ya da mesajlara **eklediği dosyalar** (ekler yükleyene bağlı silinir; öğrencilerin teslim dosyaları
  ayrı tablodadır, durur). Kod okumasına göre (şemadaki silme kuralları); denenmedi.
- **Geri alma yok:** yanlışlıkla çıkarılan öğretmen yeni kişi koduyla yeniden eklenir; okuldaki kullanıcı adı yeniden verilir.
- **Öğrenci için başka iş:** öğrenci hesabı bu yolla silinmez ([Öğrenciyi okuldan çıkarma](../hesaplar/ogrenciyi-okuldan-cikarma.md));
  servisçi hesabının silinmesi Servisler'dedir ([Servisçi hesabı](../servis/servisci-hesabi.md)).
- **Tasarımda:** görevi almak (rolü kaldırmak) çıkarmak değildir; okuldan çıkarma her çalışan için ayrı iştir. Kişi kendi isteğiyle de
  ayrılabilir.

## Kardeşler ve ilgili

**Kardeşler:** [Hesap penceresi](hesap-penceresi.md) · [Öğretmenler ve çalışanlar listesi](liste.md) · [Rol atama](rol-atama.md) ·
[Kodla ekleme](kodla-ekleme.md) · [Birden çok müdür](birden-cok-mudur.md) · [Ortak karar](ortak-karar.md).

**İlgili:**

- [Bu okuldan ayrıl](../portallar/okuldan-ayrilma.md) — öğretmenin kendisi ayrılması; [Portallarım](../portallar/portallarim.md).
- [Ders atama](../siniflar-dersler/ders-atama.md), [Program kurma](../ders-programi/program-kurma.md).
- [Müdürün ödev görünümü](../odev/mudurun-odev-gorunumu.md), [Etüdü düzenleme ve silme](../etut/etudu-duzenleme-ve-silme.md).
- [Öğrenciyi okuldan çıkarma](../hesaplar/ogrenciyi-okuldan-cikarma.md), [Hesabımı sil](../ayarlar/hesabimi-sil.md).
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md), [Bildirim metinleri](../bildirim/bildirim-metinleri.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/10b-hesaplar.md](../../public/js/parcalar/10b-hesaplar.md) — `bagliOgretmenModal` ("Okuldan çıkar"
  bölümü, `data-bagli="1"`), `hesapDuzenleModal` (eski düzen hesapta "Hesabı sil"), `EYLEMLER['hesap-sil']` (onay metinleri,
  `POST /api/school/hesap-sil { id, onay: true }`, liste yenileme).
- Sunucu: [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — `hesap-sil` (`ogretmen.cikar`, kendini silememe, `onay`
  şartı, eşlenmiş öğretmende yalnız rol satırı, bildirim, işlem kaydı `ogretmen.cikarildi`);
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `hesabiSil` (yalnız bu okulun öğretmen ya da servisçi
  satırı); [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) — silinince ders ve ödevin öğretmen alanının boşalması.
- Testler: [testler/test-yonetim.md](../../testler/test-yonetim.md) (kodla eklenen öğretmen çıkarılınca yetişkin hesabı durur),
  [testler/test-kisi-kodu.md](../../testler/test-kisi-kodu.md), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).

## Sık sorulanlar

- **Öğretmeni çıkarınca verdiği ödevler ne olur?** Silinmez; açık olanları müdür Ödevler sayfasından sonuçlandırır.
- **Yanlışlıkla çıkardım.** Geri alma yok; öğretmenden yeni kişi kodunu iste ve "Kodla ekle" ile yeniden ekle.
- **Öğretmenin hesabı da silinir mi?** Kendi hesabıyla eklendiyse hayır, yalnız okuldaki rolü gider. Eski düzenden kalan ayrı hesap ise
  tamamen silinir.

## Sırada

- Çalışan olarak ekleme (iş 2): rolsüz ya da görevli her çalışan için okuldan çıkarma; görevi almanın çıkarma olmaması.
- HTML (Tasarım 1): çalışan penceresinde "Okuldan çıkar"ın yeri.
