# Mesajlar · Hazır mesaj şablonları ({öğrenci}, {sınıf}, {veli})

**Durum:** Tasarlandı — henüz kodda yok (kullanıcının 28 Eylül onayı; Tasarım 1 önizlemesinde var).

Sık yazılan mesajları hazır şablondan seçmek; şablondaki {öğrenci}, {sınıf}, {veli} alanları her alıcıya kendi bilgisiyle dolar.

## Ne işe yarar

Veli toplantısı daveti, ödev hatırlatması, devamsızlık bilgisi gibi her hafta yazılan mesajları tekrar tekrar yazmamak ve toplu
mesajı kişiselleştirmek için. Kullanıcıya sunulan öneri: "Sık yazılan mesajlar saklanır. {öğrenci}, {sınıf} gibi alanlar olur; toplu
mesaj her veliye kendi çocuğunun adıyla gider." Kullanıcı 28 Eylül akşamı "bunu unuttum" diyerek onayladı.

## Nereden açılır

"Mesajlar" → "Yeni mesaj" → **"Şablon:"** satırı ([Yeni mesaj ve alıcı seçimi](yeni-mesaj.md)).

## Adım adım

### Öğretmen, müdür, çalışan — tasarım (Tasarım 1 önizlemesi)

1. "Yeni mesaj"ı aç; "Etiket:" satırının altında **"Şablon:"** satırında şablon çipleri:
   - **"Veli toplantısı daveti"** — "Sayın {veli}, {öğrenci} öğrencimizin sınıfı {sınıf} için 9 Ekim Cuma 15:30'da veli toplantısı
     yapılacaktır. Katılımınızı rica ederiz."
   - **"Ödev hatırlatma"** — "Sevgili {öğrenci}, yarın son günü olan ödevini unutma. Kolay gelsin!"
   - **"Devamsızlık bilgisi"** — "Sayın {veli}, {öğrenci} bugün okula gelmedi. Bilginize sunarız."
2. Altında ipucu: **"Alanlar her alıcıya kendi bilgisiyle dolar: {öğrenci} {sınıf} {veli}"** (alanlar çip olarak).
3. Bir şablona bas: metni "Açıklama:" düzenleyicisine yazılır (alanlar renkli çip olarak durur); "Başlık:" boşsa şablonun adı
   başlık olur. Seçili şablon çipi koyu görünür.
4. Metni istediğin gibi değiştir, alıcıları seç ("7-A velileri" gibi), **"Gönder"**.
5. Toplu mesajda her alıcı kendi bilgisiyle dolmuş metni alır: Ada'nın velisine "Sayın Ece Yıldırım, Ada Yıldırım öğrencimizin…".

### Öğrenci

Şablon satırı öğrencide yok.

## Kurallar ve sınırlar

Karara bağlananlar:

- Alanlar: **{öğrenci}**, **{sınıf}**, **{veli}**; toplu mesaj her veliye kendi çocuğunun adıyla gider.
- Şablon metni de ortak yazı düzenleyicisiyle yazılır (düzenleyicinin geçtiği alanlar listesinde "hazır mesaj şablonu" var;
  [Nerelerde var](../yazi-yazma/nerelerde-var.md)).
- Önerilen yeni yetki: **"mesaj.sablon"** — okulun hazır mesaj şablonlarını düzenler (özel roller önerisi; onay bekliyor)
  ([Özel roller](../roller-yetkiler/ozel-roller.md)).
- Tasarım 1'de şablon satırı öğrenci dışındaki herkeste (veli ve servisçi dahil) çiziliyor; tanımda şablonlar toplu mesaj için anlatılır.

Tanımda henüz yazmayanlar (kodlanmadan önce karara bağlanmalı):

- Şablonları kimin oluşturduğu, düzenlediği ve sildiği (okulun ortak şablonları mı, kişinin kendi şablonları mı, ikisi mi); düzenleme
  ekranının yeri.
- Hazır gelen şablonların listesi (önizlemedeki üçü örnektir).
- Alan doldurulamazsa (ör. öğretmene giden mesajda {veli}) ne olacağı.
- Velinin ve servisçinin şablon kullanıp kullanmayacağı.
- {öğrenci} alanının veli kopyasında ve öğrencinin kendisine giden mesajda nasıl dolacağı (iki çocuklu veli).

## Kardeşler ve ilgili

**Kardeşler:** [Yeni mesaj ve alıcı seçimi](yeni-mesaj.md) · [İleri tarihli gönderim](ileri-tarihli-gonderim.md) ·
[Duyuru](duyuru.md) · [Velinin kopyası](velinin-kopyasi.md).

**İlgili:** [Yazı düzenleyici](../yazi-yazma/README.md) · [Nerelerde var](../yazi-yazma/nerelerde-var.md) ·
[Özel roller](../roller-yetkiler/ozel-roller.md) · [Devamsızlık bildirimi](../devamsizlik/devamsizlik-bildirimi.md) (otomatik
devamsızlık bildirimi ayrıca gider).

## Kod tarafı

Bugün kodda yok: mesaj metni bugün düz yazıdır ve her alıcıya aynı metin gider ([sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md)
`POST /api/mesajlar`; "Son durum"da "Düzenleyiciler" işinin getireceği şablonlar yazılı). Alanların sunucuda alıcı başına doldurulması
(bugün `depo.genel.cokluBildir` gibi kişiye göre değişen metin yazma yolu bildirimlerde var:
[sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md)), şablon tablosu ve ekranı yapı belgesinde yazılacak. Kodlanınca bu
belgenin Durum satırı güncellenir.

## Sık sorulanlar

- **Her veliye çocuğunun adıyla mesaj nasıl gönderirim?** Şablondaki {öğrenci} ve {veli} alanlarını kullan; toplu mesajda her veliye kendi bilgisiyle gider.
- **Kendi şablonumu kaydedebilir miyim?** Tanımda "sık yazılan mesajlar saklanır" deniyor; kimin nasıl kaydedeceği henüz yazılmadı.

## Sırada

- Düzenleyiciler (iş 15): hazır mesaj şablonları ve kişiye özel alanlar — kodu Linux'ta yazılacak.
- Özel roller önerisi: "mesaj.sablon" yetkisi (onay bekliyor).
