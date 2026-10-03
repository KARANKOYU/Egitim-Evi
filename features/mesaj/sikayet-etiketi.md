# Mesajlar · Şikâyet etiketi (Gönderildi → Bakıldı → Çözüldü)

**Durum:** Tasarlandı — henüz kodda yok (kullanıcının 29 Eylül 21:05 ve 30 Eylül 18:35 kararları; Tasarım 1 önizlemesinde var).

"Şikâyet" etiketli mesajın okul yönetimine gitmesi, durumunun Gönderildi → Bakıldı → Çözüldü diye izlenmesi ve kendiliğinden silinmesi.

## Ne işe yarar

Okulun her üyesi (öğrenci, veli, öğretmen, çalışan, servisçi) bir sorunu okul yönetimine iletebilsin ve sorunun ele alınıp
alınmadığını görebilsin; MEB okullarındaki dilek-şikâyet kutusunun yerine. Fikir bir grup arkadaşının (katkısı [CONTRIBUTING.md](../../CONTRIBUTING.md)'de yazılı). Kullanıcı
29 Eylül'de "adımı gizle olmasın; sıkıntı ve bir şeyler çözüldü olarak işaretlenir; 1 hafta bakılmazsa silinsin, bildirimde yazsın
'bir daha gönderin' densin; çözüldü işaretlenince o 1 gün sonra gitsin" dedi; 30 Eylül'de ayrı kutu yerine mesaj etiketi olmasına karar verdi.

## Nereden açılır

- **Göndermek:** "Mesajlar" → "Yeni mesaj" → alıcı olarak okul yönetimi (müdür) → **"Etiket:"** satırında **"Şikâyet"**.
- **İzlemek (gönderen):** "Gönderilen" kutusunda şikâyetin satırındaki durum rozeti; mesajı açınca durum şeridi.
- **Ele almak (yönetim):** gelen kutusunda **"Şikâyet · N"** süzgeci; mesajın penceresinde durum şeridi ve **"Çözüldü olarak işaretle"**.

## Adım adım

### Gönderen (öğrenci, veli, öğretmen, servisçi) — tasarım

1. "Yeni mesaj"da alıcı olarak müdürü (yönetimi) seç, başlığı ve açıklamayı yaz.
2. **"Etiket:"** → **"Şikâyet"**. Adın okul yönetimine görünür (adsız şikâyet yok; tanımdaki form notu: "Adın okul yönetimine görünür").
3. **"Gönder"**. Mesaj "Gönderilen"de **"Şikâyet"** etiketi ve **"Gönderildi"** rozetiyle durur.
4. Mesajı açınca bilgilerin altında üç adımlı şerit: **"Gönderildi"** (tarih) · **"Bakıldı"** · **"Çözüldü"**; altında:
   **"Okul yönetimi henüz bakmadı. 1 hafta içinde bakılmazsa (8 Ekim) silinir ve gönderene \"yeniden gönderebilirsin\" bildirimi gider."**
5. Yönetim açınca rozet **"Bakıldı"** olur; şeritte: **"Okul yönetimi şikâyetine baktı; çözülünce bildirim alırsın."**
6. Çözülünce bildirim: **"Şikâyetin çözüldü olarak işaretlendi"** — **"\"<konu>\" · <müdürün adı>: <kısa yanıt>"**. Şeritte
   **"Çözüldü olarak işaretlendi; yarın listeden kalkar. Yanıt: \"…\""**; rozet **"Çözüldü · yarın kalkar"**. Ertesi gün mesaj silinir.
7. Bir hafta içinde hiç bakılmazsa şikâyet silinir ve bildirim gelir: **"Şikâyetine bir hafta içinde bakılmadı ve silindi"** —
   **"\"<konu>\" · İstersen yeniden gönderebilirsin."**

### Müdür (ve şikâyetlere bakma yetkisi olan) — tasarım

1. Gelen kutusunda **"Şikâyet · 2"** çipine bas; şikâyetler satırda **"Şikâyet"** ve durum rozetiyle ("Gönderildi" / "Bakıldı").
2. Şikâyeti aç: durum kendiliğinden **"Bakıldı"** olur (gönderen bunu görür). İşlem kaydına **"<adın> şikâyete baktı"** — ayrıntı
   "<konu> · <gönderen>" düşer.
3. Şeritte: **"Bakıldı. Sorun çözülünce işaretle; gönderene bildirim gider ve şikâyet 1 gün sonra listeden kalkar."**
4. Altında **"Kısa yanıt (isteğe bağlı)"** kutusu (en çok 300 karakter; yer tutucu "ör. Servis şirketiyle konuşuldu; saatler
   düzeltildi.") ve **"Çözüldü olarak işaretle"** düğmesi.
5. Bas: **"Çözüldü olarak işaretlendi; gönderene (<gönderenin adı>) bildirim gitti. Şikâyet yarın listeden kalkar."** İşlem kaydına
   **"<adın> şikâyeti çözüldü olarak işaretledi"**.
6. İstersen "Yanıtla" ile gönderene ayrıca yazarsın.

## Kurallar ve sınırlar

Karara bağlananlar (29 Eylül 21:05, 30 Eylül 18:35):

- **Ayrı şikâyet kutusu YOK:** şikâyet bir mesaj etiketidir; mesajlaşmanın üstüne kurulur.
- **Kime gider:** okul yönetimine (müdür + yetkili). Tanımdaki öneri: "Şikâyet kutusu" yetkisi verilen kişi de bakar (Rehber
  Öğretmen şablonuna da önerildi).
- **Adsızlık yok:** "Adımı gizle" kaldırıldı; okul yazanın adını ve rolünü görür.
- **Durumlar:** **Gönderildi** → **Bakıldı** (yetkili açınca kendiliğinden) → **Çözüldü** (yetkili işaretler, isteğe bağlı kısa yanıtla).
- **Silinme:** "Çözüldü" işaretlenince **1 gün** sonra silinir (gönderen bu bir gün içinde yanıtı görür); gönderildikten sonra
  **1 hafta** içinde hiç bakılmazsa silinir ve gönderene "yeniden gönderebilirsin" bildirimi gider.
- **Duyuru şikâyet olamaz** (Tasarım 1: duyuruda "Şikâyet" etiketi gizlenir).
- Önceki öneri maddeleri ("kapandıktan 1 yıl sonra silinir", "adsız") geçersizdir. Eski öneri listesindeki türler (Şikâyet · Öneri ·
  Teşekkür · Zorbalık · Güvenlik), günde 3 sınırı ve küfür süzgeci etiket kararında ayrıca yazılmadı.

Kullanıcıya soruldu, cevap bekleniyor:

- Bakılmış ama çözülmemiş şikâyet çözülene kadar durur; öneri: en çok 60 gün, sonra silinir.
- Zorbalık/güvenlik niteliğindeki şikâyette 3. gün müdüre hatırlatma bildirimi (öneri).

Tanımda henüz yazmayanlar:

- Alıcı seçiminin sabit olup olmadığı (etiket seçilince alıcı kendiliğinden "okul yönetimi" mi olur, yoksa gönderen mi seçer;
  önizlemede gönderen müdürü seçiyor).
- "Bakıldı"nın yalnız açınca mı yoksa bir düğmeyle mi işaretleneceği (önizlemede açınca).
- Şikâyetlerin saklanması ve görünürlüğü için KVKK metni (kodlanırken aynı işte yazılacak).

## Kardeşler ve ilgili

**Kardeşler:** [Etiketler](etiketler.md) · [Önemli etiketi](onemli-etiketi.md) · [Bu mesajı bildir](bu-mesaji-bildir.md) (tek bir
mesajı bildirmek ayrıdır) · [Yeni mesaj ve alıcı seçimi](yeni-mesaj.md) · [Mesajı okuma](mesaj-okuma.md) ·
[Düzeltme ve silme](duzeltme-ve-silme.md).

**İlgili:** [Destek talepleri](../destek/README.md) (Eğitim Evi ekibine giden talepler; şikâyet ise okulun yönetimine gider) ·
[İşlem kaydı](../islem-kaydi/README.md) · [Bildirim metinleri](../bildirim/bildirim-metinleri.md) ·
[Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md) · [Rehber Öğretmen ve öbür hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md).

## Kod tarafı

Bugün kodda yok ("şikâyet" sitenin kodunda geçmiyor). Mesajlaşma ([sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md),
[public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md)) üzerine etiket sütunu, durum ve zamanları, 1 gün / 1 hafta
silme işi (dakikalık iş altyapısı) ve işlem kaydı eklenecek; yapı belgesinde yazılacak. Kodlanınca bu belgenin Durum satırı güncellenir.

## Sık sorulanlar

- **Şikâyetimi adsız gönderebilir miyim?** Hayır; kullanıcının kararıyla adın okul yönetimine görünür.
- **Şikâyetim kayboldu.** Bir hafta içinde bakılmadıysa silinir ve sana "yeniden gönderebilirsin" bildirimi gelir; çözüldüyse
  bir gün sonra listeden kalkar.
- **Şikâyetime bakıldığını nasıl anlarım?** "Gönderilen"de satırın rozeti "Bakıldı" olur.

## Sırada

- Mesaj etiketleri (iş 28): Şikâyet etiketi, durumlar ve silinme kuralları — kodu Linux'ta yazılacak.
- KVKK ve onay metinleri: şikâyetin kimlerce görüldüğü ve silinme süreleri aydınlatma metnine eklenecek (KVKK_SURUM artar).
