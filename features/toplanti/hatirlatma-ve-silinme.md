# Toplantılar · Hatırlatma ve 1 hafta sonra silinme

**Durum:** Tasarlandı — henüz kodda yok

Toplantıdan 1 gün önce ve 15 dakika önce davetlilere bildirim gider; toplantı bitince satır soluklaşır ve "Bitti" yazar,
bitişten 1 hafta sonra kayıt takvimden ve ajandadan da kalkarak kendiliğinden silinir.

## Ne işe yarar

Kullanıcının 29 Eylül isteği: "geçince siyahımsı/koyumsu olur, 1 hafta sonra kaydı silinir; ajandaya da eklenir." Davetli
toplantıyı unutmasın diye iki hatırlatma; liste eski toplantılarla dolmasın ve gereksiz kayıt (kimin davetli olduğu, kimin
"Katıl"a bastığı) uzun süre saklanmasın diye kısa ömür.

## Nereden açılır

- Hatırlatma toplantı açılırken seçilir: "Toplantı aç" penceresinin altındaki **"1 gün önce ve 15 dakika önce hatırlat"**
  kutusu ([Toplantı açma](toplanti-acma.md)).
- Bildirimler zildeki [Bildirim paneli](../bildirim/bildirim-paneli.md)nde ve telefon bildirimi açıksa telefonda görünür.
- Biten toplantılar [Toplantılar listesi](toplantilar.md)nin **"Geçmiş · 1 hafta sonra silinir"** grubunda durur.

## Adım adım

### Müdür, öğretmen ve çalışan — toplantıyı açarken

1. "Toplantı aç" penceresinde **"1 gün önce ve 15 dakika önce hatırlat"** kutusu işaretli gelir.
2. Hatırlatma istemiyorsan işaretini kaldır. Kutu tektir: ikisinden yalnız birini seçmek tasarımda yok.
3. Toplantının penceresinde **"Hatırlatma:"** satırında "1 gün önce ve 15 dakika önce bildirim" yazar.

### Öğrenci, veli, öğretmen, müdür ve çalışan — davetli olarak

1. **1 gün önce** ve **15 dakika önce** zile bildirim düşer. Bildirimde toplantının adı ve gün/saat/yer yazar; Tasarım 1'deki veli
   örneği: başlık "7-A veli toplantısı", alt satır "Cuma 15:30 · konferans salonu". Velinin çocuk oturumunda bildirimin başında
   çocuğun adı durur (ör. "Elif · 7-A veli toplantısı"). Kesin metin kalıbı tanımda yazılı değil.
2. Bildirime basınca toplantının penceresi açılır ([Toplantı penceresi](toplanti-penceresi.md)).
3. Toplantı açan "Aç"a bastığında ayrıca **"Toplantı başladı · `<toplantı adı>`"** / "`<açan>` açtı · Katıl" bildirimi gelir
   ([Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md)).
4. Toplantı iptal edilirse bildirim gelir (iptal edenin ekranında çıkan kısa ileti: "Toplantı iptal edildi; davetlilere bildirim
   gitti."; davetliye giden bildirimin metni tanımda yazılı değil).

Velide: öğrenciye davet edilen bir toplantının hatırlatması, bugünkü kural gereği öğrencinin bildiriminin velideki kopyası
olarak veliye de düşer mi, tanımda yazmıyor; veli davetliyse kendi bildirimini alır
([Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md)).

### Herkes — toplantı bitince

1. Bitiş saati geçince satır soluklaşır (koyulaşır), sağda gri **"Bitti"** yazar, satır **"Geçmiş · 1 hafta sonra silinir"**
   grubuna iner. "Katıl" / "Aç" kalkar.
2. Pencerede not: "Toplantı bitti; kayıt 1 hafta sonra kendiliğinden silinecek."
3. Bitişten **1 hafta sonra** toplantı listeden, takvimden ve ajandadan kalkar; bir daha açılamaz.

### Toplantıyı açan ve müdür — bağlantısız kalan toplantı

Toplantının bağlantısı başka bir toplantıya ya da tahtaya devredildiyse sahibine (açana ya da müdüre) toplantının zamanı gelene
kadar düzenli uyarı gider: "`<toplantı>` toplantısının bağlantısı yok — yeni bağlantı seç" (bildirim + Toplantılar sayfasında
kırmızı satır). Ayrıntı: [Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md).

## Kurallar ve sınırlar

- **Hatırlatma zamanları:** başlangıçtan 1 gün önce ve 15 dakika önce. Tasarımda yalnız aç/kapat kutusu var; zamanları değiştirecek
  bir ayar (okulda ya da kişide) çizilmedi, tanımda da yok.
- **Kime:** davetlilerin hepsine; toplantıyı açana da gidip gitmeyeceği tanımda yazılı değil.
- **Hatırlatma kapatılırsa** iki bildirim de gitmez; "Toplantı başladı" ve iptal bildirimleri yine gider.
- **Bitiş:** toplantının bitiş saati geçince "Bitti" olur.
- **Silinme:** bitişten 1 hafta sonra kendiliğinden; takvim ve ajandadaki kaydıyla birlikte. Kişinin kendi kurduğu
  hatırlatıcılar (Hatırlatıcılar sayfası) bu silmeye girmez; onları kişi kendisi siler.
- **"Kimler katıldı" listesi:** toplantıyla birlikte silinmesi beklenir; tanımda ayrıca süre yazılı değil
  ([Kimler katıldı](katilanlar.md)).
- **Saklama süreleri tablosu:** "Toplantılar · Bittikten 1 hafta sonra kaydı silinir"
  ([Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).
- **İptal edilen toplantı:** listeden hemen kalkar mı, yoksa "İptal edildi" diye 1 hafta durur mu tanımda yazılı değil.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Toplantılar ve uzaktan ders](README.md)):

- [Toplantı açma](toplanti-acma.md) — hatırlatma kutusu.
- [Toplantılar listesi](toplantilar.md) — "Geçmiş · 1 hafta sonra silinir" grubu.
- [Toplantı penceresi](toplanti-penceresi.md) — "Hatırlatma:" satırı ve "Toplantı bitti" notu.
- [Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md) — "Toplantı başladı" bildirimi.
- [Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md) — bağlantısız toplantı uyarısı.
- [Kimler katıldı](katilanlar.md).

**İlgili:**

- [Otomatik bildirimler](../bildirim/otomatik-bildirimler.md), [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md),
  [Telefon bildirimi](../bildirim/telefon-bildirimi.md), [Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md).
- [Hatırlatıcı kurma](../hatirlatici/hatirlatici-kurma.md) — kendi hatırlatıcını da kurabilirsin (ör. "7-A veli toplantısı",
  bir kez, toplantıdan yarım saat önce).
- [Ajanda](../takvim/ajanda.md), [Ajandaya ve hatırlatıcıya ekle](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md).
- [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Zamanlı bildirimler: [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md) (bugün öğretmene sabah dersleri, öğrenciye yarın
  teslimi olan ödevler; kişi başına günde en çok bir bildirim — toplantı hatırlatması bu sınırın dışında tutulmalı) ve
  "bu hatırlatma gitti mi" işaretleri [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md).
- Kişisel hatırlatıcıların zaman hesabı: [sunucu/yardimci/hatirlatici-zaman.md](../../sunucu/yardimci/hatirlatici-zaman.md),
  [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md).
- Telefon bildirimi: [sunucu/push.md](../../sunucu/push.md).
- Süresi dolan kayıtları silme: saklama süreleri işi (iş 7) ile birlikte.

## Sık sorulanlar

- **Hatırlatmayı 1 saat önceye alabilir miyim?** Tasarımda zamanlar sabit (1 gün ve 15 dakika). Kendin için ayrıca
  [hatırlatıcı](../hatirlatici/hatirlatici-kurma.md) kurabilirsin.
- **Geçen ayki toplantının notlarına bakmak istiyorum.** Toplantı 1 hafta sonra silinir; notları açıklamaya değil, mesaj ya da
  duyuru olarak paylaş.
- **Toplantı bitti ama hâlâ listede.** 1 hafta "Geçmiş" grubunda durur, sonra silinir.

## Sırada

- Toplantılar işi (iş 21): iki hatırlatma, "Bitti" görünümü ve 1 hafta sonra silme kodlanacak.
- Optimizasyon ve saklama süreleri işi (iş 7): silme işi süresi dolan öbür kayıtlarla birlikte çalışacak.
