# Mesajlar · Okumayanlara hatırlat

**Durum:** Tasarlandı — henüz kodda yok (kullanıcının 3 Ekim kararı; Tasarım 1 önizlemesine belgeler bitince eklenecek).

Duyurunun okundu listesinden tek tıkla, duyuruyu henüz açmamış kişilere yeniden bildirim göndermek.

## Ne işe yarar

Bugün gönderen duyurusunu kimin okumadığını ad ad görür ama onlara ulaşmak için yeniden duyuru yazmak zorundadır; o zaman
okuyanlar da ikinci kez rahatsız olur. Kullanıcı 3 Ekim'de önerilen yedi fikirden bunu (altıncı fikir) seçti: "2 3 5 6, eğer
önemli tag'ı seçilirse 7 gibi işlesin". Böylece yalnız okumayanlar hatırlatılır. (Aynı kararla seçilen öbürleri: 2 devamsızlık
sınırı uyarısı, 3 "bugün servise binmedi" uyarısı, 5 toplantıya kimin katıldığı; 7 "acil duyuru" ise ayrı özellik olmadı,
"Önemli" etiketi onun gibi işleyecek — [Önemli etiketi](onemli-etiketi.md).)

## Nereden açılır

"Mesajlar" → "Gönderilenler" → duyurunun satırı → pencerede okundu listesinin yanında **"Okumayanlara hatırlat"** düğmesi
([Okundu bilgisi](okundu-bilgisi.md)).

## Adım adım

### Duyuruyu gönderen (müdür ya da toplu mesaj yetkilisi) — tasarım

1. Duyurunu aç; okundu listesinde **"12 / 28 kişi okudu"** ve okumayanlar görünür.
2. **"Okumayanlara hatırlat"**a bas.
3. Yalnız duyuruyu henüz açmamış alıcılara yeni bir bildirim gider: **"Okumadığın duyuru: <konu>"** (telefona da).
4. Ekranda kaç kişiye gittiği yazar (tam metin tanımda yok; ör. "16 kişiye hatırlatıldı" gibi).
5. Okundu listesinde hatırlatma zamanı görünür: **"hatırlatıldı · 14:20"**.
6. Aynı duyuru için 24 saat dolmadan düğme yeniden kullanılamaz (öneri).

### "Önemli" etiketli duyuruda

Düğme hemen açılır ([Önemli etiketi](onemli-etiketi.md)): duyuruyu gönderdikten sonra beklemeden okumayanları hatırlatabilirsin.

### Alıcı (öğrenci, veli, öğretmen, servisçi)

Duyuruyu açmadıysan **"Okumadığın duyuru: <konu>"** bildirimi gelir; basınca Mesajlar açılır. Açtıysan bildirim gelmez.

## Kurallar ve sınırlar

Karara bağlananlar (3 Ekim):

- Yalnız okumayanlara gider; okumuş olanlara gitmez.
- Aynı duyuru için 24 saatte en çok bir hatırlatma (öneri).
- Kaç kişiye gittiği yazar; listede "hatırlatıldı · saat" görünür.
- "Önemli" etiketli duyuruda düğme hemen açılır.

Tanımda henüz yazmayanlar (kodlanmadan önce karara bağlanmalı):

- Düğmenin kişisel mesajda (duyuru dışında) da olup olmayacağı; karar metni "duyurunun okundu listesi" der.
- Etiketsiz duyuruda düğmenin ne zaman açılacağı ("Önemli"de "hemen" dendiğine göre öbüründe bir bekleme süresi olabilir; süre
  yazmıyor).
- Velinin kopyası: öğrenci okumuş ama veli okumamışsa yalnız veliye mi gideceği (bugün okundu listesinde ikisi ayrı satırdır; bu
  yüzden ayrı ayrı sayılması beklenir).
- Hatırlatmanın sessiz saatlere uyup uymayacağı ([Okulun mesaj ayarları](okulun-mesaj-ayarlari.md)).
- Düğmeye kimin basabileceği: gönderen mi, okundu listesini gören müdür de mi.

## Kardeşler ve ilgili

**Kardeşler:** [Okundu bilgisi](okundu-bilgisi.md) · [Duyuru](duyuru.md) · [Önemli etiketi](onemli-etiketi.md) ·
[Okulun mesaj ayarları](okulun-mesaj-ayarlari.md) (sessiz saatler).

**İlgili:** [Bildirim metinleri](../bildirim/bildirim-metinleri.md) · [Telefon bildirimi](../bildirim/telefon-bildirimi.md) ·
[Toplantılar](../toplanti/toplantilar.md) (aynı kararla gelen "Katılmayanlara mesaj gönder") ·
[Devamsızlık bildirimi](../devamsizlik/devamsizlik-bildirimi.md) ve [Servis](../servis/README.md) (aynı kararla gelen uyarılar).

## Kod tarafı

Bugün kodda yok. Üzerine kurulacağı yer: okundu listesi [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md)
(`okumaCiz`, `okumaListeCiz`) ve [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) (`GET /api/mesajlar/okuma`,
`okumaGorebilir`); okumayanlar [sunucu/veri/depo/mesajlar.md](../../sunucu/veri/depo/mesajlar.md) `okumaDurumu`'ndan (okuma
zamanı boş olanlar) çıkar; bildirim [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) `topluBildir` ile gider.
Hatırlatma zamanının saklanacağı yer (yeni sütun ya da tablo) yapı belgesinde yazılacak. Kodlanınca bu belgenin Durum satırı
güncellenir.

## Sık sorulanlar

- **Hatırlatma okuyanlara da gider mi?** Hayır, yalnız duyuruyu açmamış olanlara.
- **Kaç kez hatırlatabilirim?** Aynı duyuru için 24 saatte bir (öneri).
- **Alıcı mesajı okudu ama bildirim yine geldi.** Bildirim yalnız hatırlatma anında okumamış olanlara gider; o an açmamış
  olabilir.

## Sırada

- Duyuruyu okumayanlara hatırlatma ve "Önemli" etiketi (3 Ekim kararı): kodu Linux'ta yazılacak; Tasarım 1 önizlemesine
  belgeler bitince eklenecek.
