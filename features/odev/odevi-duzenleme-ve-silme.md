# Ödevler · Ödevi düzenleme ve silme

**Durum:** Kodda var; tasarımda ek olarak "Ödevi düzenle" penceresi "Yeni ödev"le aynı düzende olur (açıklama yazı düzenleyiciyle, anket, "Verilecekler" satırı) (Tasarım 1 önizlemesi).

Verilmiş bir ödevin adını, açıklamasını, tarihlerini, eklerini, dosya iznini ve quizini sonradan değiştirmek; ödevi tamamen silmek.

## Ne işe yarar

Kullanıcı 26 Eylül'de "daha önceden sonuçlanan bir ödev … sonradan editlenebilecek" dedi. Son tarihi uzatmak, yazım hatasını
düzeltmek, unutulan çalışma kâğıdını eklemek ya da yanlış verilen ödevi kaldırmak için. Ödevin öğrencileri ve sonuçları bu
pencereden değişmez (sonuçlar için: [Sonuçları düzeltme ve tekrar açma](sonuclari-duzeltme.md)).

## Nereden açılır

- **Düzenle:** "Ödevler" → ödevin **"Sonuçlandır"** / **"Sonuçları düzenle"** düğmesi → kontrol ekranının altında **"Ödevi
  düzenle"**. Quiz satırındaki **"Quizi düzenle"** de aynı pencereyi açıp quiz bölümüne kaydırır.
- **Sil:** "Ödevler" listesinde ödevin satırındaki kırmızı **"Sil"**.

## Adım adım

### Öğretmen — düzenlemek (bugünkü site)

1. Kontrol ekranında **"Ödevi düzenle"**ye bas. Pencere **"Ödevi düzenle"**:
   - **"Ödev adı"** (en çok 120 karakter), **"Açıklama"** (en çok 1000 karakter);
   - **"Başlama tarihi"** + saat (kayıtlı yoksa 08:00), **"Son tarih"** + saat (kayıtlı yoksa 12:00) ([Başlama ve son teslim](tarih-ve-saat.md));
   - ekler: var olanlar listede ("Kaldır" ile çıkarılır), yenileri "Dosya ekle" ile ([Ödeve dosya ekleme](dosya-ekleme.md));
   - **"Öğrenciler bu ödeve dosya yükleyebilsin"** — ödevin durumuyla gelir; ipucunun sonunda "Kapatırsan yüklenmiş dosyalar
     silinmez; yalnız yeni yükleme durur. Son teslimi değiştirirsen yüklenmiş dosyalar en az 7 gün daha kalır."
     ([Dosya yükleme izni](dosya-yukleme-izni.md));
   - quiz bölümü ([Quiz ekleme](../quiz/quiz-ekleme.md));
   - altta **"Vazgeç"** ve **"Kaydet"**.
2. Değiştir, **"Kaydet"**e bas. Düğme **"Kaydediliyor..."** olur.
3. Pencere kapanır, kontrol ekranı yenilenir ve üstte **"Ödev güncellendi."** yazar.
4. Ödevin adı ya da son teslimi (gün veya saat) değiştiyse öğrencilere ve velilerine bildirim gider: **"Ödev güncellendi: Oran
   orantı (son gün 05.10 12:00)"** (son gün parçası yalnız tarih değiştiyse). Süren ödevde dosya iznini açtıysan sonuna
   **". Artık ödeve dosya yükleyebilirsin."** eklenir.
5. Quizi değiştirdiysen ve pencere açıkken bir öğrenci quizi başlattıysa: ödevin öbür değişiklikleri yine kaydedilir, pencere
   açık kalır, quiz bölümü kilitli görünür ve turuncu uyarı çıkar: **"Ödevin öbür değişiklikleri kaydedildi; quiz
   kaydedilemedi: N öğrenci başladı; quiz artık değiştirilemez."**
6. Son tarihi değiştirdiğin quizli ödevde quizin sonuçları açıklanmışsa ileti şöyle olur: **"Ödev güncellendi. Quizin sonuçları
   açıklandığı için quiz yeniden başlatılamaz."**

### Öğretmen — silmek

1. "Ödevler" listesinde ödevin satırında **"Sil"**e bas.
2. Onay: **"Bu ödev silinsin mi? Geri alınamaz."** → Tamam.
3. Liste yenilenir; ödev öğrencilerin, velilerin ve müdürün ekranlarından kalkar. Öğrencilere bildirim gitmez.

### Müdür

Öğretmeni ayrılmış (sahipsiz) ödevin kontrol ekranında "Ödevi düzenle" müdürde de çıkar. Sahipsiz ödevi silmek için ekranda
bir düğme yok (sunucu müdürün silmesine izin verir).

### Tasarımda (Tasarım 1 önizlemesi)

- Kontrol ekranının üstünde **"Ödevi düzenle"** (kalem simgeli) düğmesi.
- Pencere "Yeni ödev"in aynısı, başlığı **"Ödevi düzenle"**: "Başlık:", "Başlama:", "Son tarih:", "Açıklama:" (yazı
  düzenleyici), **"Verilecekler: 7-A · 28 öğrenci · verilmiş ödevin öğrencileri değişmez"**, "Ekler:", dosya izni, "Anket:",
  "Quiz:" (öğrenci başladıysa salt yazı: "10 soru · 20 dakika — 5 öğrenci başladı; quiz artık değiştirilemez."); düğme
  **"Kaydet"**. Düzenlemede başlama günü bugünden önceye de alınabilir.
- Kaydedince **"Ödev güncellendi · son tarih değişti; öğrencilere bildirim gitti."** (son tarih değişmediyse yalnız "Ödev
  güncellendi.").
- Önizlemede ödev silme yok; kullanıcı bunun için bir şey söylemedi, bugünkü site gibi kalır.

## Kurallar ve sınırlar

- **Yetki:** düzenleme ve silme "Ödev verir" yetkisi ister (ödevin dersi için): **"Bu ödevi düzeltme yetkin yok"**, **"Bu ödevi
  silme yetkin yok"**. Yalnız ödevi veren öğretmen (sahipsiz ödevde okulun müdürü); başkası **"Yetkin yok"**. Bilinen açık:
  listedeki "Sil" düğmesi yetkiye bakmadan herkese çizilir; yetkisiz öğretmen basınca hata tarayıcı uyarısı olarak çıkar.
- **Değişmeyenler:** ödevin dersi, öğrencileri, sınıfları ve sonuçları.
- **Sonuçlanmış ödevde de** düzenleme çalışır.
- **Doğrulama:** **"Ödevin adını yaz."** (pencere) / **"Ödev adı gerekli"** (sunucu); **"Son tarih başlangıçtan önce olamaz."**;
  **"Aynı gün biten ödevde son saat başlama saatinden sonra olmalı"** (yalnız sunucu); ekler yükleniyorsa **"Dosyalar
  yükleniyor; bitince kaydet."**; kalan eklerle yeniler toplam en çok 50 MB ve 20 dosya.
- **Teslim dosyaları korunur:** son teslim (gün ya da saat) değiştirilir ya da kaldırılırsa yüklenmiş teslim dosyaları en az 7
  gün daha kalır; son teslimi yanlışlıkla geçmişe yazmak dosyaları hemen sildirmez ([Saklama ve silinme](saklama-ve-silinme.md)).
- **Quiz:** bir öğrenci başladıktan sonra quiz değiştirilemez; tarih değişmeden önce quizin açıklanmış sonuçları kalıcı yapılır.
- **Bilinen açık (yarım kayıt):** quiz ödevden önce kaydedilir; quiz kaydedildikten sonra ödevin kendisi sunucuda reddedilirse
  (ör. aynı gün saat kuralı) quiz değişikliği kalır, öbürleri kaydedilmez; pencere hatayı gösterir.
- **Silme kalıcıdır:** ödevle birlikte öğrencilere verilişi, sonuçları, açılma ve yıldız kayıtları, quizi (denemeler,
  cevaplar), öğretmenin eklerinin ve teslim dosyalarının kayıtları silinir; dosyaların kendisi saatlik temizlikte diskten kalkar.
  Geri getirmenin tek yolu sistem yedeği. Silme işlem kaydına yazılmaz.
- **Geçmiş yıl:** yıl seçicide geçmiş yıla bakarken düzenleme ve silme yapılamaz (arşiv salt okunur).

## Kardeşler ve ilgili

**Kardeşler:** [Ödev verme](odev-verme.md) · [Başlama ve son teslim](tarih-ve-saat.md) · [Ödeve dosya ekleme](dosya-ekleme.md) ·
[Dosya yükleme izni](dosya-yukleme-izni.md) · [Sonuçları düzeltme ve tekrar açma](sonuclari-duzeltme.md) ·
[Saklama ve silinme](saklama-ve-silinme.md) · [Sonuçlandırma](sonuclandirma.md).

**İlgili:** [Quiz ekleme](../quiz/quiz-ekleme.md), [Quiz: süre ve tek deneme](../quiz/sure-ve-tek-deneme.md),
[Otomatik bildirimler](../bildirim/otomatik-bildirimler.md), [Yedekler](../yonetim/yedekler.md),
[Anketi ödeve ekleme](../anket/odeve-mesaja-ekleme.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) — `EYLEMLER['odev-duzelt']`
  (pencere), `EYLEMLER['odev-duzelt-kaydet']` (denetim, önce quiz `POST …/quiz`, 409 `kilitli`, sonra `POST …/update`);
  silme [25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`odev-sil` → onay → `POST …/delete`);
  [14c-quiz.md](../../public/js/parcalar/14c-quiz.md) ("Quizi düzenle").
- Sunucu: [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) — `POST …/update` (yetki, tarih kuralları, ekler
  `ekIdler`/`ekSilIdler`, `teslimSonuclariniSabitle`, "Ödev güncellendi: …" bildirimi), `POST …/delete`;
  [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (kilit, sonuçların kalıcılığı).
- Depo: [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) — `duzelt` (son teslim değişince `dosya_saklama`),
  `sil` (`ON DELETE CASCADE`); [sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md) (`dosyaSupur`: kaydı
  kalmayan dosyalar).
- Testler: [testler/test-odev-saat.md](../../testler/test-odev-saat.md) (`…/update`, başlama saati),
  [testler/test-odev-dosya.md](../../testler/test-odev-dosya.md) (izin açma/kapama, son teslim değişince dosyaların kalması,
  `…/delete`), [testler/test-yorum-ek.md](../../testler/test-yorum-ek.md) (eklerin değişmesi),
  [testler/test-quiz.md](../../testler/test-quiz.md) (kilit), [testler/test-yedek.md](../../testler/test-yedek.md).

## Sık sorulanlar

- **Son tarihi uzattım, öğrenciler haber aldı mı?** Evet: "Ödev güncellendi: … (son gün …)".
- **Ödevi yanlış sınıfa verdim.** Öğrenciler değiştirilemez; ödevi sil ve doğru sınıfa yeniden ver.
- **Silinen ödevi geri alabilir miyim?** Ekrandan hayır; yalnız sistem yedeğinden.
- **Quizi düzenleyemiyorum.** Bir öğrenci başladıysa quiz kilitlenir; öbür değişiklikler yine kaydedilir.

## Sırada

- Düzenleyiciler: açıklama yazı düzenleyiciyle düzenlenecek.
- Anket düzenleyici: ödeve eklenen anketin düzenleme penceresinden değiştirilmesi.
- Tasarımdaki tek pencere düzeni ("Yeni ödev" ile aynı).
