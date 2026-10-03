# Mesajlar · Mesajdan ajandaya ve hatırlatıcıya ekleme

**Durum:** Tasarlandı — henüz kodda yok (kullanıcının 27 Eylül isteği, tanım "Mesaj/duyurudan ajanda ve hatırlatıcı"; gönderen tarafı Tasarım 1 önizlemesinde var).

Mesaj ya da duyuru yazarken "Alıcıların ajandasına ekle" deyip bir tarih vermek ve "Hatırlatıcı kur"la alıcılara o tarihten önce hatırlatma bildirimi kurmak.

## Ne işe yarar

Müdür "Cuma 15:30 veli toplantısı" duyurusunu yaptığında bu haber herkesin ajandasında tarihiyle dursun ve toplantıdan önce
hatırlatma gelsin. Kullanıcı 27 Eylül'de şöyle istedi: "ajandaya duyuru başlıklı bir şey eklenip hatırlatıcıya da eklenir …
müdür ve öğretmen mesaj yazarken oraya atılanların ajanda ve hatırlatıcısına ekle açarsa onun tweak'leri, saat kaçta hatırlatılsın".

## Nereden açılır

- **Gönderen:** "Yeni mesaj" (ya da "Yanıtla") penceresinde, "Gönder"in üstündeki **"Alıcıların ajandasına ekle"** anahtarı ve
  açılınca **"Tarih:"** ve **"Hatırlatıcı:"** satırları.
- **Alıcı:** Takvim sayfasında ay görünümünün altındaki **Ajanda** ([Ajanda](../takvim/ajanda.md)) ve **Hatırlatıcılar**.

## Adım adım

### Öğretmen ve müdür — tasarım (Tasarım 1 önizlemesi)

1. "Yeni mesaj"ı aç, alıcıları ve başlığı yaz.
2. Altta **"Alıcıların ajandasına ekle"** anahtarı; yanında küçük yazı **"ajandada mesajın başlığıyla görünür"**. Aç.
3. **"Tarih:"** satırında takvimden gün seç ve saat seç (saat 09:00 gelir).
4. **"Hatırlatıcı:"** çipleri: **"1 hafta önce"** · **"1 gün önce"** · **"3 saat önce"** · **"1 saat önce"** · **"Tarih ve saat seç"**
   (sonuncusu ayrı tarih ve saat kutularını açar). Altında **"en çok iki zaman"**; üçüncüsünü seçmeye kalkarsan **"En çok iki
   hatırlatma zamanı seçebilirsin."**
5. Öğretmende ayrıca **"Anket:"** satırında **"Anket ekle"** (anketlerinden birini seçersin; yoksa **"Henüz anketin yok; Anketler
   sayfasında Anket oluştur."**; seçileni **"×"** ile kaldırırsın) ([Ödeve ve mesaja anket](../anket/odeve-mesaja-ekleme.md)).
6. **"Gönder"**e basınca denetim; hata anahtarın altında:
   - **"Ajanda için tarih seç."**
   - **"Ajanda tarihi geçmişte kalıyor."**
   - **"Hatırlatma için tarih seç."** (Tarih ve saat seç'te)
   - **"Hatırlatma ajanda tarihinden önce olmalı."**
   - **"1 gün önce geçmişte kalıyor; başka zaman seç."** (seçilen hatırlatmanın adıyla)
7. Gönderilince alttaki iletiye eklenir: **"Mesaj 28 kişiye gönderildi · alıcıların ajandasına eklendi (9 Ekim 15:30) · hatırlatıcı:
   8 Ekim 15:30 · anket: <anketin adı>."**

### Alıcı (öğrenci, veli, öğretmen…) — tasarım

1. Ajandanda **"Duyuru"** türünde bir satır belirir: başlık, gönderen ("<ad> · Müdür"), zaman ve kalan süre ("2 gün kaldı").
   Ajandanın **"Duyuru"** kutucuğu bunları süzer.
2. Satıra basınca **"Duyuru"** penceresi: **"Başlık:"**, **"Gönderen:"**, **"Tarih:"**, **"Kalan:"**, metin ve **"Kapat"**.
3. Takvimin ay görünümünde o günde de görünür.
4. Hatırlatıcılarında bir kayıt; zamanı gelince bildirim (telefon bildirimi dahil).
5. Kendi kopyanı ajandandan **gizleyebilir**, hatırlatıcını **kapatabilirsin** (yalnız kendin için).
6. Öğrenciye giden duyuruda velisinin ajandasına da satır ve hatırlatıcı düşer.

## Kurallar ve sınırlar

Karara bağlananlar (tanım §5):

- **Kim kullanır:** duyuru ya da toplu mesaj yazan müdür ve toplu mesaj yetkilisi; tek kişiye mesajda da öğretmen ve müdür.
- Ajanda kaydının başlığı mesajın konusudur; tarih, saat ve isteğe bağlı **bitiş** girilir (önizlemede bitiş alanı yok).
- Hatırlatıcı: bir ya da iki zaman — 1 hafta / 1 gün / 3 saat / 1 saat önce ya da tarih-saat seçimi.
- Her alıcının (öğrenciye giden duyuruda velisinin de) ajandasına bir "Duyuru" satırı ve hatırlatıcılarına bir kayıt düşer.
- Alıcı kendi kopyasını gizler ve hatırlatıcısını kapatır; bu yalnız onu etkiler.
- Gönderen tarihi sonradan değiştirirse herkesin kaydı güncellenir ve **"tarih değişti"** bildirimi gider; duyuru silinirse ajanda
  satırları ve hatırlatıcılar da silinir.
- Kişi başına 50 hatırlatıcı sınırı bu kayıtları **saymaz** (ayrı tür) ([Hatırlatıcı kurma](../hatirlatici/hatirlatici-kurma.md)).
- Ajanda bir tek uçtan, sayfalı gelir; telefon uygulaması da aynı ucu kullanacak.

Tanımda henüz yazmayanlar:

- Gönderenin tarihi nereden değiştireceği (bugünkü "Düzelt" yalnız konu ve metin içindir).
- Alıcının "gizle" ve "kapat" düğmelerinin yeri ve metni.
- Ajandadaki satırın mesajın kendisini mi açacağı (önizlemede ayrı "Duyuru" penceresi açılıyor).

## Kardeşler ve ilgili

**Kardeşler:** [Duyuru](duyuru.md) · [Yeni mesaj ve alıcı seçimi](yeni-mesaj.md) · [İleri tarihli gönderim](ileri-tarihli-gonderim.md) ·
[Düzeltme ve silme](duzeltme-ve-silme.md) · [Velinin kopyası](velinin-kopyasi.md).

**İlgili:** [Ajanda](../takvim/ajanda.md) · [Ay görünümü](../takvim/ay-gorunumu.md) · [Hatırlatıcı kurma](../hatirlatici/hatirlatici-kurma.md) ·
[Hatırlatma bildirimi](../hatirlatici/hatirlatma-bildirimi.md) · [Ödeve ve mesaja anket](../anket/odeve-mesaja-ekleme.md) ·
[Toplantılar](../toplanti/toplantilar.md) (toplantılar da ajandaya kendiliğinden girer).

## Kod tarafı

Bugün kodda yok. Bugün hatırlatıcılar yalnız kişinin kendi kurduğu kayıtlardır ([sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md),
[public/js/parcalar/19h-hatirlaticilar.md](../../public/js/parcalar/19h-hatirlaticilar.md)); takvimde ajanda yok
([public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md), [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md));
mesaj gönderimi ajandaya bir şey yazmaz ([sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md)). Ajanda ucu (`/api/ajanda`), mesaja
bağlı ajanda ve hatırlatıcı kayıtları yapı belgesinde yazılacak. Kodlanınca bu belgenin Durum satırı güncellenir.

## Sık sorulanlar

- **Ajandama düşen duyuruyu kaldırabilir miyim?** Tasarımda evet: kendi kopyanı gizlersin; başkalarınınki etkilenmez.
- **Hatırlatma gelmesin istiyorum.** Kendi hatırlatıcını kapatabilirsin.
- **Kaç hatırlatma kurabilirim?** Bir mesaj için en çok iki zaman.

## Sırada

- Mesaj ayarları, Bu mesajı bildir, Ajanda işi (iş 8): duyurudan alıcıların ajandasına ve hatırlatıcısına ekleme — kodu Linux'ta yazılacak.
