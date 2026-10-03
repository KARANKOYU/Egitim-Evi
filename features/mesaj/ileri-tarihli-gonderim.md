# Mesajlar · İleri tarihli gönderim

**Durum:** Tasarlandı — henüz kodda yok (kullanıcının 28 Eylül onayı, öneri 5; Tasarım 1 önizlemesinde var).

Mesajı ya da duyuruyu hemen değil, seçtiğin gün ve saatte göndermek; o zamana kadar "Planlanan" kutusunda bekletmek.

## Ne işe yarar

Pazar akşamı yazılan "Pazartesi servis erken kalkıyor" duyurusunu Pazartesi 07:00'de göndermek, veli toplantısı hatırlatmasını
toplantıdan bir gün önce sabah çıkarmak gibi işler için. Öneri metni: "mesaj/duyuru/anket 'şu gün şu saatte gönder'". Kullanıcı
28 Eylül akşamı "1 2 5 6" diye seçerken bunu (5) onayladı.

## Nereden açılır

- **Planlamak:** "Yeni mesaj" → **"Gönderim:"** satırı ([Yeni mesaj ve alıcı seçimi](yeni-mesaj.md)).
- **Bekleyenleri görmek:** "Mesajlar" → üst çubukta **"Planlanan · N"** ([Gelen kutusu](kutu.md)).

## Adım adım

### Öğretmen, müdür, çalışan (Tasarım 1'de öğrenci dışındaki herkes) — tasarım

1. "Yeni mesaj"ı aç; düzenleyicinin altında **"Gönderim:"** satırı: **"Şimdi"** (seçili gelir) | **"İleri tarihte"**.
2. **"İleri tarihte"**ye bas; tarih ve saat kutusu açılır (önizlemede örnek "5 Ekim 2026 · 09:00"). Altında ipucu:
   **"Mesaj seçtiğin anda gider; o zamana kadar \"Planlanan\"da durur, değiştirip iptal edebilirsin."**
3. Alıcıları, başlığı, metni yaz → **"Gönder"**. Mesaj "Gönderilen"e değil **"Planlanan"**a düşer; çipteki sayı artar.
4. **"Planlanan · 2"** kutusunda her satır: **"Kime: 7-A velileri"**, altında **"planlandı"**; başlık; sağda saat simgesiyle gönderim
   zamanı ("5 Ekim Pazartesi 09:00").
5. Satıra basınca ayrıntı açılır: başlık, **"Alıcı: 7-A velileri · gönderim: 5 Ekim Pazartesi 09:00"**, **"Planlandı"**.
6. Zamanı gelince mesaj gider: alıcılara bildirim ve kutularına mesaj düşer; senin "Gönderilen"ine geçer.

### Alıcı

Mesajı planlanan saatte, normal bir mesaj gibi alır; ileri tarihli olduğunu bilmez.

## Kurallar ve sınırlar

Karara bağlananlar:

- Mesaj, duyuru ve **anket** ileri tarihli gönderilebilir ([Anket açma](../anket/anket-acma.md)).
- Planlanan mesaj "Planlanan"da durur; gönderim zamanına kadar **değiştirilip iptal edilebilir** (önizlemedeki ipucu).
- "Planlanan" kutusu öğrencide yok (Tasarım 1).

Tanımda henüz yazmayanlar (kodlanmadan önce karara bağlanmalı):

- Değiştirme ve iptal düğmelerinin yeri ve metinleri (önizlemede yalnız ipucu var).
- En ileri ne kadar tarih seçilebileceği, geçmiş bir an seçilince çıkacak ileti.
- Planlanan anda alıcı listesinin yeniden mi çözüleceği (o arada sınıfa yeni öğrenci gelirse) yoksa yazıldığı andaki listenin mi kullanılacağı.
- Ekin 7 günlük süresinin yükleme anından mı, gönderim anından mı sayılacağı (bugün ekler yüklendikten 7 gün sonra silinir; 7 günden
  ileri planlanan mesajın eki gönderilmeden silinebilir) ([Mesaj ekleri](ekler.md)).
- Sessiz saatlere denk gelen planlı mesajın bildirimi ([Okulun mesaj ayarları](okulun-mesaj-ayarlari.md)).
- Velinin ve servisçinin bu satırı görüp görmeyeceği (önizlemede görüyor).

## Kardeşler ve ilgili

**Kardeşler:** [Yeni mesaj ve alıcı seçimi](yeni-mesaj.md) · [Gelen kutusu ve gönderilenler](kutu.md) · [Duyuru](duyuru.md) ·
[Hazır şablonlar](hazir-sablonlar.md) · [Ajandaya ve hatırlatıcıya ekle](ajandaya-ve-hatirlaticiya-ekle.md) · [Mesaj ekleri](ekler.md).

**İlgili:** [Anket açma](../anket/anket-acma.md) · [Hatırlatıcılar](../hatirlatici/README.md) (aynı dakikalık iş altyapısı) ·
[Telefon bildirimi](../bildirim/telefon-bildirimi.md).

## Kod tarafı

Bugün kodda yok: `POST /api/mesajlar` mesajı hemen yazar ve bildirimi hemen gönderir ([sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md);
"Son durum"da "Düzenleyiciler" işinin getireceği ileri tarihli gönderim yazılı). Bekleyen mesajların saklanması ve zamanında
gönderilmesi (hatırlatıcıların dakikalık işine benzer: [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md),
[sunucu/hatirlatma.md](../../sunucu/hatirlatma.md)) yapı belgesinde yazılacak. Kodlanınca bu belgenin Durum satırı güncellenir.

## Sık sorulanlar

- **Planladığım mesajı nerede görürüm?** "Mesajlar"da "Planlanan" çipinde.
- **Vazgeçtim, planlanan mesajı silebilir miyim?** Evet; gönderim zamanına kadar değiştirip iptal edebilirsin (düğmeler henüz çizilmedi).

## Sırada

- Düzenleyiciler (iş 15): ileri tarihli gönderim (mesaj, duyuru, anket) — kodu Linux'ta yazılacak.
