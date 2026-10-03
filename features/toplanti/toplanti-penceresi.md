# Toplantılar · Toplantı penceresi

**Durum:** Tasarlandı — henüz kodda yok

Bir toplantıya basınca açılan ayrıntı penceresi: başlık, tarih, saat, katılım yolu, davetliler, düzenleyen, hatırlatma ve
açıklama; zamanı gelince sağ üstte "Katıl" ya da "Aç", toplantıyı açanda ve müdürde "Düzenle" ve "İptal et".

## Ne işe yarar

Listedeki tek satır yalnız ad, gün ve saati gösterir. Pencere toplantının bütün bilgisini verir: nerede (salon mu, bağlantı mı),
kim çağrıldı, kim düzenliyor, ne konuşulacak. Toplantıyı açan kişi buradan düzeltir ya da iptal eder.

## Nereden açılır

- [Toplantılar listesi](toplantilar.md)nde bir satıra bas.
- Takvimde bir güne bas → gün ayrıntısındaki **"Toplantı"** türündeki satır ([Gün ayrıntısı](../takvim/gun-ayrintisi.md)).
- Ana sayfadaki "Yaklaşanlar" kutusunda toplantı satırı; bildirim panelinde toplantı bildirimi (ör. "7-A veli toplantısı" ya da
  "Toplantı başladı · Öğretmenler kurulu").

## Adım adım

### Öğrenci ve veli

Pencerenin başlığı **"Toplantı"**. İçinde etiket–değer satırları, yukarıdan aşağı:

| Etiket | Değer (örnek) |
|---|---|
| **"Başlık:"** | kalın, "7-A veli toplantısı" |
| **"Tarih:"** | "2 Ekim 2026 Cuma" |
| **"Saat:"** | "15:30–16:30" |
| **"Katılım:"** | yüz yüzede "Yüz yüze · Konferans salonu"; bağlantılıda "Bağlantıyla · Google Meet"; ikisi birdende "Yüz yüze (Konferans salonu) ya da bağlantıyla (Zoom)" |
| **"Davetliler:"** | hedefin adı, ör. "7-A velileri", "7. ve 8. sınıf öğrencileri ve velileri" |
| **"Düzenleyen:"** | toplantıyı açanın adı, ör. "Ayşe Kaya" ya da "Mert Can (Rehberlik)" |
| **"Hatırlatma:"** | "1 gün önce ve 15 dakika önce bildirim" |

Altında **"Açıklama:"** ve toplantının açıklaması (yazı düzenleyiciyle yazılmış biçimli metin).

En altta zamana göre bir not:

- Toplantı bittiyse: "Toplantı bitti; kayıt 1 hafta sonra kendiliğinden silinecek."
- Bağlantılı ve henüz 10 dakikadan fazla varsa: ""Katıl" düğmesi toplantıdan 10 dakika önce burada çıkar. Bağlantı yalnız
  davetlilere, toplantı saatinde açılır."
- Zamanı geldi ama açan henüz gelmediyse: "Toplantıyı açan henüz gelmedi. "Katıl"a basarsan bekleme ekranı açılır; açan
  gelince seni otomatik götürürüz."
- Yalnız yüz yüze toplantıda, toplantı bitmediyse not çıkmaz (bitince yukarıdaki "Toplantı bitti" notu onda da çıkar).

1. Pencereyi aç; bilgileri oku.
2. Zamanı geldiyse (başlamasına 10 dakikadan az kaldı ya da sürüyor) ve toplantı bağlantılıysa sağ üstte kamera simgeli
   **"Katıl"** çıkar; bas ([Katıl düğmesi](katil.md)).
3. Kapatmak için sağ üstteki ×.

### Öğretmen

Öğrencideki pencere. Davetli olduğun bir toplantıda düğmen "Katıl"dır. **Senin açtığın** toplantıda:

- "Düzenleyen:" satırında adının yanında "(sen)" yazar, ör. "Ayşe Kaya (sen)".
- Sağ üstteki düğme **"Aç"** olur (10 dakika kuralı aynı).
- Zamanı gelince alttaki not: "Toplantıyı sen açarsın. Seni bekleyenler sen "Aç"a basınca kendiliğinden gelir; Google
  Meet'te "Katılma isteğinde bulun" diyenleri sen "Kabul et"le alırsın." ([Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md))
- Henüz erkense not: ""Aç" düğmesi toplantıdan 10 dakika önce burada çıkar. Bağlantı yalnız davetlilere, toplantı saatinde
  açılır."
- Açıklamanın altında iki düğme: **"Düzenle"** ve **"İptal et"**.

**Düzenle:**

1. **"Düzenle"**ye bas; "Toplantı aç" penceresi açılır ([Toplantı açma](toplanti-acma.md)).
2. Değiştir, **"Toplantıyı aç"** ile kaydet.

Tasarım 1 önizlemesinde "Düzenle" boş "Toplantı aç" penceresini açıyor; kodlanınca pencere toplantının bilgileriyle dolu
gelmeli ve kaydetme düğmesinin adı ("Kaydet" gibi) belirlenmeli.

**İptal et:**

1. **"İptal et"**e bas.
2. Pencere kapanır, ekranın altında kısa ileti: "Toplantı iptal edildi; davetlilere bildirim gitti."

Önizlemede iptal onay sormuyor; tanımda iptalin onay isteyip istemeyeceği ve davetliye giden bildirimin metni yazılı değil.

### Müdür

Öğretmendeki pencere. Müdür kendi açmadığı toplantılarda da **"Düzenle"** ve **"İptal et"**i görür (önizlemede müdür bütün
toplantılarda görüyor). Müdürün kendi açtığı toplantıda (ör. "Öğretmenler kurulu") düğme "Aç"tır; başkasının açtığında müdür
davetlidir ve düğmesi "Katıl"dır.

### Çalışan

"Toplantı açar" yetkisiyle toplantı açan çalışan, kendi açtığı toplantıda öğretmendeki gibi "Aç", "Düzenle" ve "İptal et"i
görür; davetli olduğu toplantıda öğrencideki pencereyi görür.

## Kurallar ve sınırlar

- **"Katıl" / "Aç"**: yalnız bağlantılı ve ikisi birden olan toplantılarda, başlangıçtan 10 dakika önce çıkar; bitene kadar
  durur. Yalnız yüz yüze toplantıda düğme yoktur.
- **Bağlantının adresi pencerede yazmaz**; davetli yalnız platformun adını görür ("Bağlantıyla · Google Meet").
- **Düzenle / İptal et:** toplantıyı açan (düzenleyen) ve müdür. Öğrenci ve veli görmez.
- **Hatırlatma satırı:** toplantı açılırken "1 gün önce ve 15 dakika önce hatırlat" kutusu işaretliyse yazar
  ([Hatırlatma ve silinme](hatirlatma-ve-silinme.md)); kutu kaldırılınca bu satırın ne göstereceği önizlemede yok.
- **İptal:** davetlilere bildirim gider (önizlemedeki ileti böyle der). İptal edilen toplantının listeden, takvimden ve ajandadan
  hemen mi kalkacağı, yoksa "İptal edildi" diye bir süre mi duracağı tanımda yazılı değil; kodlanırken kararlaştırılacak.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Toplantılar ve uzaktan ders](README.md)):

- [Toplantılar listesi](toplantilar.md) — pencerenin açıldığı yer.
- [Toplantı açma](toplanti-acma.md) — "Düzenle"nin açtığı pencere.
- [Katıl düğmesi](katil.md), [Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md).
- [Hatırlatma ve 1 hafta sonra silinme](hatirlatma-ve-silinme.md), [Kimler katıldı](katilanlar.md).

**İlgili:**

- [Gün ayrıntısı](../takvim/gun-ayrintisi.md), [Ajanda](../takvim/ajanda.md).
- [Bildirim paneli](../bildirim/bildirim-paneli.md), [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md).
- [Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md) — "Açıklama".

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Açılır pencere: [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md) (`modalAc`).
- İptal bildirimi: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (bildirim yazma), telefon bildirimi
  [sunucu/push.md](../../sunucu/push.md).
- Düzeltme ve iptal işlem kaydı: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md).

## Sık sorulanlar

- **Toplantının bağlantısını kopyalayıp başkasına verebilir miyim?** Davetli olarak bağlantıyı görmezsin; "Katıl" seni
  doğrudan götürür. Bağlantıyı yalnız onu kaydeden öğretmen ya da müdür görür ([Görüşme bağlantıları](gorusme-baglantilari.md)).
- **Saati değişti, davetlilere haber gider mi?** İptalde bildirim gider; düzenlemede bildirim gidip gitmeyeceği tanımda yazılı
  değil (kodlanırken belirlenecek).
- **"Düzenleyen" kim?** Toplantıyı açan kişi. Zamanı gelince "Aç" düğmesi onda olur.

## Sırada

- Toplantılar işi (iş 21): pencere, "Düzenle" (dolu form) ve "İptal et" kodlanacak; iptal onayı ve düzenleme bildirimi
  kararlaştırılacak.
