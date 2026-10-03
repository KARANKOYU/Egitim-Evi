# Hatırlatıcılar · Duyurudan gelen hatırlatıcılar

**Durum:** Tasarlandı — henüz kodda yok (kullanıcının 27 Eylül isteği; tanım "Mesaj/duyurudan ajanda ve hatırlatıcı"; gönderen tarafı
Tasarım 1 önizlemesinde var, alıcının hatırlatıcılar listesindeki görünümü önizlemede yok).

Müdür ya da öğretmen bir duyuruya (ya da mesaja) "Hatırlatıcı kur" eklediğinde senin hatırlatıcılarına kendiliğinden düşen kayıt:
sen kurmazsın, ama zamanı gelince sana da bildirim gelir.

## Ne işe yarar

"Cuma 15:30 veli toplantısı" duyurusu gelince toplantıdan bir gün önce herkese hatırlatma gitsin; herkes kendi hatırlatıcısını tek
tek kurmasın. Kullanıcının 27 Eylül sözü: "müdür mesaja ekle, o ajanda ve hatırlatıcıya koyar o ayarla".

## Nereden açılır

- **Gönderen:** "Yeni mesaj" (ya da "Yanıtla") penceresinde **"Alıcıların ajandasına ekle"** anahtarı ve açılınca **"Hatırlatıcı:"**
  satırı ([Mesajdan ajandaya ve hatırlatıcıya ekleme](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md)).
- **Alıcı:** kendi **Hatırlatıcılar** sayfası ([Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md)), Takvim'in altındaki **Ajanda**
  ("Duyuru" satırı) ve zil.

## Adım adım

### Gönderen — müdür, toplu mesaj yetkilisi; tek kişiye mesajda öğretmen ve müdür (tasarım)

1. Duyuruyu ya da mesajı yaz; altta **"Alıcıların ajandasına ekle"**yi aç ve **"Tarih:"**ten gün ve saat seç.
2. **"Hatırlatıcı:"** çiplerinden en çok ikisini seç: **"1 hafta önce"** · **"1 gün önce"** · **"3 saat önce"** · **"1 saat önce"** ·
   **"Tarih ve saat seç"**. Üçüncüyü seçmeye kalkarsan **"En çok iki hatırlatma zamanı seçebilirsin."**
3. "Gönder"; hatalar ve ileti (ör. **"Hatırlatma ajanda tarihinden önce olmalı."**) mesaj belgesinde
   ([Mesajdan ajandaya ve hatırlatıcıya ekleme](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md)).

### Alıcı — öğrenci, öğretmen, çalışan, müdür, servisçi (tanım)

1. Duyuru gelince ajandana bir **"Duyuru"** satırı, hatırlatıcılarına bir kayıt düşer. Kaydın başlığı mesajın konusudur; zamanını
   gönderen seçmiştir.
2. Zamanı gelince bildirim gelir (telefon bildirimi dahil) ([Hatırlatma bildirimi](hatirlatma-bildirimi.md)).
3. Hatırlatıcını **yalnız kendin için kapatabilirsin**; gönderenin ve öbür alıcıların kaydı etkilenmez. Ajandadaki kopyanı da kendin
   için gizleyebilirsin.
4. Gönderen tarihi sonradan değiştirirse kaydın kendiliğinden güncellenir ve **"tarih değişti"** bildirimi gelir.
5. Duyuru silinirse ajandandaki satır da hatırlatıcın da silinir.

### Veli (tanım)

Öğrenciye giden duyuruda velisinin de ajandasına satır ve hatırlatıcılarına kayıt düşer. Tasarımda velide her çocuk ayrı oturum
olduğu için kaydın hangi çocuğun oturumuna düşeceği tanımlarda yazılı değil; büyük olasılıkla duyurunun gittiği çocuğun oturumu.

### Tanımlarda henüz yazılı olmayanlar

- Bu kayıtların Hatırlatıcılar sayfasında nasıl ayırt edileceği (ayrı bir grup mu, satırda "Duyuru" etiketi mi). Kişisel
  hatırlatıcıların kod belgesi bu sayfanın onları ayırt edip göstermesi gerekeceğini not ediyor.
- Alıcının bu kaydı silip silemeyeceği (tanım yalnız "kapatabilir" diyor) ve düzenleyip düzenleyemeyeceği.
- "Kapat" düğmesinin yeri ve metni; "tarih değişti" bildiriminin tam metni.
- Tasarım 1 önizlemesinde alıcının ajandasında duyurular "Duyuru" satırı olarak görünüyor; hatırlatıcılar listesinde ayrı bir kayıt
  gösterilmiyor.

## Kurallar ve sınırlar

- **Ayrı tür, 50'ye sayılmaz:** kişi başına 50 hatırlatıcı sınırı bu kayıtları saymaz.
- **Zamanı gönderen belirler:** bir ya da iki zaman (1 hafta / 1 gün / 3 saat / 1 saat önce ya da tarih-saat). Alıcı zamanı
  değiştirmez; yalnız kendi kopyasını kapatır.
- **Kapatma yalnız seni etkiler.**
- **Duyuruyla yaşar:** tarih değişince güncellenir, duyuru silinince silinir.
- **Veli de alır:** öğrenciye giden duyuruda velisine de kayıt düşer (öğrencinin kendi kurduğu kişisel hatırlatmanın aksine).
- **Kim gönderebilir:** duyuru ya da toplu mesaj yazan müdür ve toplu mesaj yetkilisi; tek kişiye mesajda öğretmen ve müdür.
- **Altyapı:** Türkiye saatiyle aynı dakikalık hatırlatıcı işi kullanılır.

## Kardeşler ve ilgili

**Kardeşler:** [Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md) · [Kurma, düzenleme ve silme](hatirlatici-kurma.md) ·
[Sıklık](siklik.md) · [Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md) · [Hatırlatma bildirimi](hatirlatma-bildirimi.md) ·
[Takvimde ve ajandada](takvimde-ve-ajandada.md) · [Kimler görür ve saklama](kimler-gorur-ve-saklama.md).

**İlgili:** [Mesajdan ajandaya ve hatırlatıcıya ekleme](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md) · [Duyuru](../mesaj/duyuru.md) ·
[Ajanda](../takvim/ajanda.md) · [Toplantı hatırlatması](../toplanti/hatirlatma-ve-silinme.md) (toplantılar kendi hatırlatmasını
gönderir) · [Okumayanlara hatırlat](../mesaj/okumayanlara-hatirlat.md) (okunmayan duyuru için yeniden bildirim; hatırlatıcı değil).

## Kod tarafı

- Bugün kodda yok. Bugün hatırlatıcılar yalnız kişinin kendi kurduğu kayıtlardır:
  [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md), [sunucu/veri/depo/hatirlaticilar.md](../../sunucu/veri/depo/hatirlaticilar.md)
  (kayıtta kaynak mesaj bağlantısı yok), [public/js/parcalar/19h-hatirlaticilar.md](../../public/js/parcalar/19h-hatirlaticilar.md)
  ("Son durum"da bu işin sayfaya getireceği değişiklik yazılı).
- Mesaj gönderimi bugün ajandaya ya da hatırlatıcıya bir şey yazmaz: [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md).
- Kodlanınca bu belgenin Durum satırı ve bu bölüm güncellenir.

## Sık sorulanlar

- **Bu hatırlatıcıyı ben kurmadım, nereden geldi?** Okulun bir duyurusuyla geldi; duyuruyu gönderen hatırlatma eklemiş.
- **İstemiyorum, nasıl kapatırım?** Kendi kopyanı kapatabilirsin; başkalarınınki etkilenmez.
- **50 hatırlatıcı sınırımı doldurur mu?** Hayır; bu kayıtlar ayrı türdür.

## Sırada

- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: duyurudan
  alıcıların ajandasına ve hatırlatıcısına ekleme; kodu Linux'ta yazılacak.
