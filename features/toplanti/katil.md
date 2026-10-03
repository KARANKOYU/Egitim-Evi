# Toplantılar · Katıl düğmesi

**Durum:** Tasarlandı — henüz kodda yok

Davetlinin toplantıya girdiği düğme: başlangıçtan 10 dakika önce çıkar, bitene kadar durur; basınca sunucumuz davetli
olduğuna ve zamanına bakar, sonra seni Google Meet'e (ya da Zoom'a, Teams'e) götürür.

## Ne işe yarar

Kullanıcının 29 Eylül isteği: "'toplantıya katıl' butonuna basınca seni ona verilmiş Zoom veya Google Meet linkine atar …
saati ile tarihi gelince yanında 'Katıl' olur." 3 Ekim: "katıl kalsın, 10 dakika kuralı da kalsın." Davetli bağlantıyı
aramaz, mesajlarda kaybetmez; zamanı gelince tek düğmeye basar. Bağlantı davetliye hiç gösterilmediği için davetsiz birinin
eline geçmez.

## Nereden açılır

- [Toplantılar listesi](toplantilar.md)nde toplantının satırında sağda yeşil **"Katıl"** rozeti (satıra basınca pencere açılır).
- [Toplantı penceresi](toplanti-penceresi.md)nin sağ üstünde kamera simgeli **"Katıl"** düğmesi.
- Toplantı başlayınca gelen **"Toplantı başladı · `<toplantı adı>`"** bildirimi (altında "`<açan>` açtı · Katıl") toplantının
  penceresini açar ([Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md)).
- Tanımdaki sunucu adresi: `/toplanti/<kimlik>/katil` — düğme bu adrese gider, Meet adresine doğrudan değil.

## Adım adım

### Öğrenci, veli, öğretmen, müdür ve çalışan (davetli olarak)

Toplantıyı açan kişi değilsen düğmen "Katıl"dır (açansan "Aç" — [Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md)).

1. Toplantıya 10 dakikadan az kaldığında satırdaki rozet **"Katıl"** olur, pencerede **"Katıl"** düğmesi çıkar. Daha erkense
   pencerede şu not yazar: ""Katıl" düğmesi toplantıdan 10 dakika önce burada çıkar. Bağlantı yalnız davetlilere, toplantı
   saatinde açılır."
2. **"Katıl"**a bas.
3. Sunucu bakar: davetli misin, toplantının zaman aralığında mısın (10 dakika öncesinden bitişe kadar). İkisi de tamamsa:
   - **Açan henüz "Aç"a basmadıysa** "Toplantıyı bekliyorsun" ekranı açılır; açan gelince seni kendiliğinden götürürüz
     ([Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md)). Satırda ve pencerede bu durum "açan henüz gelmedi" diye önceden yazar.
   - **Açan açtıysa** platform yeni sekmede açılır ve pencere **"Katılıyorsun"** olur: kamera simgesi, toplantının adı,
     "`<platform>` yeni sekmede açıldı." ve "Telefonda `<platform>` uygulaması açılır."; altında **"`<platform>`'i yeniden
     aç"** düğmesi (ör. "Google Meet'i yeniden aç") — tarayıcı yeni sekmeyi engellediyse ya da sekmeyi kapattıysan buna bas.
4. Meet "Katılma isteğinde bulun" derse bu adım Google'ındır: toplantıyı açan "Kabul et"e basınca içeri alınırsın.

**Telefon uygulamasında:** tanıma göre "Katıl" Google Meet ya da Zoom uygulamasını açar.

### Yalnız yüz yüze toplantıda

"Katıl" yoktur. Zamanı gelince satırda yeşil **"Şimdi"** yazar; yer satırda ve pencerede yazar ("Yüz yüze · Konferans
salonu"). "İkisi birden" olan toplantıda salona gelemeyen "Katıl" ile bağlantıdan girer.

## Kurallar ve sınırlar

- **Zaman penceresi:** başlangıçtan 10 dakika önce açılır, bitiş saatinde kapanır. Toplantı bitince satırda "Bitti" yazar,
  düğme kalkar.
- **Yalnız davetli:** sunucu her basışta davetli listesine bakar; davetli olmayana bağlantı verilmez.
- **Bağlantı hiçbir yerde yazmaz:** listede, pencerede, takvimde yalnız platformun adı ("Google Meet") görünür; adres yalnız
  sunucunun yönlendirmesinde kullanılır.
- **Basış kaydedilir:** "Katıl"a kimin, ne zaman bastığı tutulur; toplantı bitince düzenleyen ve müdür görür
  ([Kimler katıldı](katilanlar.md)). Bu liste Meet'e girdiğini değil, Eğitim Evi'nden "Katıl"a bastığını gösterir.
- **Bağlantısı kalmayan toplantı:** bağlantı başka bir toplantıya ya da tahtaya devredildiyse ve kimse yeni bağlantı seçmediyse,
  zamanı gelince "Katıl"a basan **"Bağlantı bulunamadı"** iletisini görür ([Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md)).
- **Meet'in kapısı Google'ındır:** "Katılma isteğinde bulun" ekranını Eğitim Evi kaldıramaz. Okul Google Workspace for
  Education kullanıyorsa okulun kendi alanındaki hesaplar istek göndermeden girer; Workspace'te "öğretmen gelmeden giremez"
  ayarı da vardır.
- **Zoom'da:** toplantı sahibinin "sahipten önce katılma" ayarı kapalıysa davetliler Zoom'un kendi bekleme ekranında bekler.
- **Ücretsiz sınırlar:** Meet grup görüşmesinde 60 dakika, Zoom'da 40 dakika (tanımdaki not).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Toplantılar ve uzaktan ders](README.md)):

- [Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md) — açanın düğmesi ve açan gelmeden "Katıl"a basanın beklediği ekran.
- [Toplantılar listesi](toplantilar.md), [Toplantı penceresi](toplanti-penceresi.md) — düğmenin yerleri.
- [Kimler katıldı](katilanlar.md) — basışların listesi.
- [Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md) — "Bağlantı bulunamadı".
- [Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md) — uzaktan dersteki "Katıl" (ayrı kural: o derste seçilmiş
  olmak).

**İlgili:**

- [Android uygulaması](../uygulama/android-uygulamasi.md) — Meet/Zoom uygulamasının açılması.
- [Dışarı giden veriler](../kvkk-ve-gizlilik/disari-giden-veriler.md) — "Katıl"a basan Google'ın ya da Zoom'un sitesine gider.
- [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Yönlendirme ve yetki kapısı: [sunucu/api.md](../../sunucu/api.md) (istek bağlamı, yollar), [sunucu/yetki.md](../../sunucu/yetki.md).
- Bildirim ("Toplantı başladı · Katıl"): [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md), [sunucu/push.md](../../sunucu/push.md).
- Bildirime basınca ilgili pencere: [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md).

## Sık sorulanlar

- **"Katıl"a bastım, "Toplantıyı bekliyorsun" çıktı.** Toplantıyı açan henüz gelmedi. Sayfayı açık bırak, açan gelince seni
  götürürüz; kapatırsan "Toplantı başladı · Katıl" bildirimi gelir.
- **Meet "Katılma isteğinde bulun" diyor.** Bu Google'ın adımı; toplantıyı açan seni kabul edince girersin.
- **Bağlantıyı alıp sonra kendim açabilir miyim?** Hayır; bağlantı gösterilmez. Her seferinde "Katıl"a bas.
- **Toplantı bitti, "Katıl" kayboldu.** Doğru; düğme bitiş saatine kadar durur.
- **"Bağlantı bulunamadı" çıktı.** Toplantının bağlantısı başka bir yere verilmiş ve yerine yenisi seçilmemiş; toplantıyı
  açana haber ver.

## Sırada

- Toplantılar işi (iş 21): `/toplanti/<kimlik>/katil` sunucu kapısı, 10 dakika kuralı, basış kaydı ve "Katılıyorsun" penceresi
  kodlanacak.
- Önizlemedeki "`<platform>`'i yeniden aç" kalıbı ada göre ek almalı ("Zoom'u", "Teams'i"); kodlanırken düzeltilecek.
