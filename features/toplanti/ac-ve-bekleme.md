# Toplantılar · Aç düğmesi ve bekleme ekranı

**Durum:** Tasarlandı — henüz kodda yok

Toplantıyı açan kişide "Katıl" yerine "Aç" düğmesi; açan gelmeden "Katıl"a basan davetli bizim bekleme ekranımızda bekler, açan
"Aç"a basınca kendiliğinden toplantıya gider; sayfayı kapatmış davetliye "Toplantı başladı · Katıl" bildirimi düşer.

## Ne işe yarar

Kullanıcının 3 Ekim kararı: "katıl kalsın, 10 dakika kuralı da kalsın … müdürün aç olsun." Toplantıyı düzenleyen kişi
toplantının sahibidir; Meet'te davetlileri o içeri alır. Davetliler sahip gelmeden Meet'e girip boş odada ya da Google'ın
"Katılma isteği" ekranında beklemesin diye Eğitim Evi kendi bekleme ekranını gösterir ve sahip gelince herkesi aynı anda
götürür. Bekleme ekranı aynı gün kullanıcının onayıyla eklendi.

## Nereden açılır

- **Açan:** [Toplantılar listesi](toplantilar.md)nde kendi toplantının satırındaki **"Aç"** rozeti ya da
  [Toplantı penceresi](toplanti-penceresi.md)nin sağ üstündeki kamera simgeli **"Aç"**.
- **Davetli:** açan henüz gelmemişken **"Katıl"**a basınca bekleme ekranı kendiliğinden açılır ([Katıl düğmesi](katil.md)).

## Adım adım

### Öğretmen, müdür ve çalışan — toplantıyı açan olarak

Toplantıyı sen açtıysan (düzenleyen sensen) satırının alt yazısının sonunda "· sen açıyorsun", pencerede "Düzenleyen:"
satırında adının yanında "(sen)" yazar.

1. Toplantıya 10 dakikadan az kalınca satırda ve pencerede **"Aç"** çıkar. Pencerede not: "Toplantıyı sen açarsın. Seni
   bekleyenler sen "Aç"a basınca kendiliğinden gelir; Google Meet'te "Katılma isteğinde bulun" diyenleri sen "Kabul et"le
   alırsın."
2. **"Aç"**a bas. Bağlantı yeni sekmede açılır; pencere **"Toplantıyı açıyorsun"** olur: kamera simgesi, toplantının adı,
   "`<platform>` yeni sekmede açıldı." ve "Telefonda `<platform>` uygulaması açılır. Seni bekleyen davetliler şimdi
   kendiliğinden geliyor; katılma isteği gönderenleri sen kabul edersin."; altında **"`<platform>`'i yeniden aç"**.
3. Bu anda toplantı "açıldı" sayılır:
   - bekleme ekranında duran davetliler kendiliğinden toplantıya gider;
   - bekleme ekranını kapatmış davetliye (önizlemede senin dışındaki bütün davetlilere) bildirim gider: başlık **"Toplantı
     başladı · `<toplantı adı>`"**, alt satır **"`<açan>` açtı · Katıl"**; bildirime basan toplantının penceresine gelir.
4. Meet'te "Katılma isteğinde bulun" diyenleri **"Kabul et"** ile içeri al. Okul Google Workspace for Education kullanıyorsa
   okulun alanındaki hesaplar istek göndermeden girer.

Görüşme bağlantıları bölümündeki not: "Toplantıyı açan cihazda bağlantının hesabı açık olmalı." — bağlantıyı hangi Google
hesabıyla aldıysan (ör. okulun toplantı Gmail'i) "Aç"a bastığın cihazda o hesap açık olmalı ki Meet seni toplantının sahibi
olarak tanısın ([Görüşme bağlantıları](gorusme-baglantilari.md)).

### Öğrenci, veli, öğretmen, müdür ve çalışan — davetli olarak, açan gelmeden

1. Toplantının satırında "· açan henüz gelmedi" yazar; pencerede not: "Toplantıyı açan henüz gelmedi. "Katıl"a basarsan bekleme
   ekranı açılır; açan gelince seni otomatik götürürüz."
2. **"Katıl"**a bas. **"Toplantıyı bekliyorsun"** penceresi açılır: yavaşça atan saat simgesi, toplantının adı ve
   "Toplantıyı açan (`<açanın adı>`) henüz gelmedi; gelince seni `<platform>`'e otomatik götüreceğiz."; altında not:
   "Bu sayfa açık kalsın. Kapatırsan toplantı başlayınca "Toplantı başladı · Katıl" bildirimi gelir." En altta **"Vazgeç"**.
3. Açan "Aç"a basınca pencere **"Toplantı başladı"** olur, platform yeni sekmede açılır: "`<platform>` yeni sekmede açıldı.",
   "Telefonda `<platform>` uygulaması açılır. `<açan>` toplantıyı açtı. "Katılma isteğinde bulun" çıkarsa açan kabul eder.";
   altında "`<platform>`'i yeniden aç".
4. Beklerken **"Vazgeç"**e basarsan pencere kapanır, bekleme biter. Açan gelince bildirim yine gelir; o zaman "Katıl"a
   basarsın.

Tasarım 1 önizlemesinde tek kişi olduğu için bekleme ekranında bir de "Önizleme: toplantıyı açan şimdi gelsin" düğmesi var; bu
yalnız önizlemenin deneme düğmesidir, sitede olmayacak.

### Öğrenci, veli ve öbür davetliler — açan açtıktan sonra

"Katıl" doğrudan toplantıya götürür ("Katılıyorsun" penceresi — [Katıl düğmesi](katil.md)).

## Kurallar ve sınırlar

- **Kim "Aç" görür:** yalnız toplantıyı açan (düzenleyen). Müdür başkasının toplantısında davetlidir, düğmesi "Katıl"dır.
- **10 dakika kuralı:** "Aç" da "Katıl" gibi başlangıçtan 10 dakika önce çıkar.
- **Bekleme:** bekleyen davetlinin sayfası açık kaldıkça açan "Aç"a basınca kendiliğinden yönlendirilir; sayfa kapalıysa
  bildirim gider. Bekleme ekranının açan geldiğini nasıl öğreneceği (yoklama aralığı) tanımda yazılı değil.
- **"Toplantı başladı" bildirimi:** kullanıcının kararında "sayfayı kapatana" gider (bekleme ekranı açık olan zaten kendiliğinden
  yönlendirilir). Tasarım 1 önizlemesinde açan dışındaki bütün davetlilere bir kez düşüyor; yalnız bekleme ekranını kapatana mı,
  "Katıl"a hiç basmamış davetliye de mi gideceği kodlanırken netleşecek. Telefon bildirimi açıksa telefona da düşer
  ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).
- **Google'ın adımı kalır:** Meet'in "Katılma isteği" ekranı Eğitim Evi'nin dışındadır; bizim bekleme ekranımız onun yerine
  geçmez, ondan önce gelir.
- **Açan hiç gelmezse:** davetliler bekleme ekranında kalır; toplantının bitiş saatinde ne olacağı (ör. "Toplantı başlamadı"
  iletisi) tanımda yazılı değil.
- **Yalnız yüz yüze toplantıda** "Aç" ve bekleme yoktur.
- **Basışlar kaydedilir:** "Aç" ve "Katıl"a kimin ne zaman bastığı [Kimler katıldı](katilanlar.md) listesine girer.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Toplantılar ve uzaktan ders](README.md)):

- [Katıl düğmesi](katil.md) — davetlinin düğmesi ve sunucu kapısı.
- [Toplantı penceresi](toplanti-penceresi.md), [Toplantılar listesi](toplantilar.md).
- [Görüşme bağlantıları](gorusme-baglantilari.md) — bağlantının hesabı.
- [Kimler katıldı](katilanlar.md).
- [Hatırlatma ve 1 hafta sonra silinme](hatirlatma-ve-silinme.md) — öbür toplantı bildirimleri.

**İlgili:**

- [Bildirim paneli](../bildirim/bildirim-paneli.md), [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md),
  [Otomatik bildirimler](../bildirim/otomatik-bildirimler.md).
- [Android uygulaması](../uygulama/android-uygulamasi.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Bildirim yazma ve veliye kopya: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md); telefon bildirimi
  [sunucu/push.md](../../sunucu/push.md), [sunucu/bolumler/push.md](../../sunucu/bolumler/push.md).
- Zilin belli aralıkla yoklanması (bekleyen sayfanın "açıldı mı" sorusu için de benzer yoklama gerekir):
  [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md).

## Sık sorulanlar

- **Toplantıyı ben açtım ama Meet beni de bekletiyor.** Bağlantıyı hangi Google hesabıyla aldıysan o cihazda o hesap açık olmalı.
- **Bekleme ekranını kapattım.** Sorun değil; açan gelince "Toplantı başladı · Katıl" bildirimi gelir.
- **Müdür olarak öğretmenin toplantısına "Aç" diyebilir miyim?** Hayır; "Aç" yalnız toplantıyı açandadır, sende "Katıl" var.

## Sırada

- Toplantılar işi (iş 21): "Aç", bekleme ekranı, otomatik yönlendirme ve "Toplantı başladı" bildirimi kodlanacak; açan hiç
  gelmezse ne olacağı kararlaştırılacak.
