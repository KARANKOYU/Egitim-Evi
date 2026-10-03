# Mesajlar · Okulun mesaj ayarları (çark)

**Durum:** Tasarlandı — henüz kodda yok (kullanıcının 27 Eylül isteği, tanım "Okulun mesaj ayarları"; Tasarım 1 önizlemesinde var).

Müdürün okul genelinde kimin kime yazabileceğini, günlük mesaj sınırını, mesaja kimin dosya ekleyebileceğini ve sessiz saatleri ayarladığı pencere.

## Ne işe yarar

Her okul farklı: biri velilerin bütün öğretmenlere yazmasını ister, biri yalnız çocuğun öğretmenlerine; biri öğrencilerin
birbirine yazmasına izin verir, çoğu vermez. Kullanıcı 27 Eylül'de şöyle istedi: "müdür mesajlar kısmında sağ üstte çark, ayarlar
için baya bi tweak: öğrenciler kime mesaj atabilir (öğretmen, müdür, sadece kendisine giren öğretmen, arkadaşları gibi), kaç mesaj,
mesaja kimler dosya koyabilir".

## Nereden açılır

"Mesajlar" → sağ üstte **"Yeni mesaj"**ın yanındaki **çark** (ipucu ve ekran okuyucu adı: **"Okulun mesaj ayarları"**). Yalnız
müdürde ve "Okuldaki herkese mesaj atar" yetkisi olanda görünür (Tasarım 1 önizlemesinde yalnız müdürde çizildi).

## Adım adım

### Müdür (ve "Okuldaki herkese mesaj atar" yetkilisi) — tasarım

1. Çarka bas; **"Okulun mesaj ayarları"** penceresi açılır.
2. **"Öğrenciler kime yazabilir?"** (kutucuklar; parantezde varsayılan):
   - **"Müdür ve yönetim"** (açık)
   - **"Kendi derslerine giren öğretmenler"** (açık)
   - **"Okuldaki bütün öğretmenler"** (kapalı)
   - **"Sınıf arkadaşları"** (kapalı) — altında: **"Açılırsa her mesajda \"Bu mesajı bildir\" görünür; bildirilenleri müdür görür."**
3. **"Veliler kime yazabilir?"**:
   - **"Müdür ve yönetim"** (açık)
   - **"Çocuğunun öğretmenleri"** (açık)
   - **"Okuldaki bütün öğretmenler"** (kapalı)
4. **"Günlük mesaj sınırı"**: **"Öğrenci başına"** (20) ve **"Veli başına"** (20) sayı kutuları; altında **"Öğretmen ve müdür
   için sınır yok."**
5. **"Mesaja kim dosya ekleyebilir?"**:
   - **"Öğretmenler ve müdür — her zaman"** (işaretli ve kilitli),
   - **"Öğrenciler"** (kapalı),
   - **"Veliler"** (açık).
6. **"Sessiz saatler"**: **"Sessiz saatleri uygula"** (açık) — **"Bu saatlerde öğrenci ve veli mesajı gider ama bildirimi sabah
   gelir. Duyurular bundan muaf değildir."**; **"Başlangıç"** (22:00) ve **"Bitiş"** (07:00) saat kutuları.
7. **"Kaydet"** → pencere kapanır, **"Okulun mesaj ayarları kaydedildi."** **"Vazgeç"** değiştirmeden kapatır.
8. Hatalar pencerenin altında:
   - **"Öğrenciler en az bir gruba yazabilmeli."**
   - **"Veliler en az bir gruba yazabilmeli."**
   - **"Günlük sınır 1 ile 200 arasında bir sayı olmalı."**
   - **"Sessiz saatlerin başlangıcı ve bitişi farklı olmalı."**
9. Değişiklik işlem kaydına düşer: **"<müdürün adı> okulun mesaj ayarlarını değiştirdi"** — ayrıntıda **"günlük sınır 20/20 ·
   sessiz 22:00–07:00"**.

### Öğrenci ve veli — etkisi (tasarım)

- "Yeni mesaj"ın alıcı listesinde yalnız okulun izin verdiği gruplar görünür.
- İzin verilmeyen birine yazmaya çalışırsan sunucu açık bir iletiyle reddeder (tanımdaki örnek: **"Okulun ayarı gereği öğrenciler
  yalnız …'e yazabilir."**).
- Günlük sınıra ulaşınca o gün daha fazla mesaj gönderemezsin (iletinin tam metni tanımda yok).
- Okul izin vermediyse "Yeni mesaj" penceresinde ek kutusu görünmez.
- "Sınıf arkadaşları" açıksa arkadaşından gelen her mesajda "Bu mesajı bildir" görünür ([Bu mesajı bildir](bu-mesaji-bildir.md)).

### Öğretmen — etkisi (tasarım)

Sessiz saatlerde öğrenci ve veli mesajı yine gelir ama bildirimi sabah düşer (gece rahatsız edilmezsin).

## Kurallar ve sınırlar

Karara bağlananlar (tanım ve Tasarım 1):

- Varsayılanlar yukarıdaki gibi; öğrenci–öğrenci yazışması **varsayılan kapalı**.
- Günlük sınır yalnız öğrenci ve veli için; öğretmen ve müdür için yalnız genel hız sınırı (bugün saatte 30) kalır.
- Kişinin kendi "Bana kim yazabilir?" ayarı ve engel listesi okul ayarını **daraltır, genişletemez** ([Bana kim yazabilir](bana-kim-yazabilir.md)).
- Kurallar sunucuda denetlenir (403, açık iletiyle); "kime yazabilirim" listesi ayara göre gelir.
- Değişiklik işlem kaydına yazılır ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- Okulun ilgili bölümü [Özellikler](../ozellikler/bolum-ac-kapat.md)'den kapatılmışsa ayar geçerli değildir.
- Sessiz saatler: tanımda "duyurular bundan muaf değil ama gece duyurusunda uyarı" yazıyor.

Tanımda henüz yazmayanlar (kodlanmadan önce karara bağlanmalı):

- Günlük sınıra ulaşınca ve izin dışı kişiye yazınca çıkacak iletilerin tam metni.
- "Müdür ve yönetim"in kimleri kapsadığı (müdürler; özel rolden kimler — ör. Müdür Yardımcısı).
- "Önemli" etiketli mesajın sessiz saatlerde de hemen gidip gitmeyeceği ([Önemli etiketi](onemli-etiketi.md)).
- Servisçinin ve (çalışan tanımındaki) rolsüz çalışanın bu ayarlardaki yeri.

## Kardeşler ve ilgili

**Kardeşler:** [Bana kim yazabilir](bana-kim-yazabilir.md) · [Bu mesajı bildir](bu-mesaji-bildir.md) · [Mesaj ekleri](ekler.md) ·
[Yeni mesaj ve alıcı seçimi](yeni-mesaj.md) · [Duyuru](duyuru.md) · [Önemli etiketi](onemli-etiketi.md).

**İlgili:** [Yetki listesi](../roller-yetkiler/yetki-listesi.md) ("Okuldaki herkese mesaj atar") · [İşlem kaydı](../islem-kaydi/README.md) ·
[Telefon bildirimi](../bildirim/telefon-bildirimi.md) (sessiz saatlerde bildirimin sabaha kalması) ·
[Bölüm aç/kapat](../ozellikler/bolum-ac-kapat.md).

## Kod tarafı

Bugün kodda yok. Bugün kimin kime yazabileceği sunucuda sabittir: öğrenci ve veli yalnız (çocuğunun) öğretmenlerine ve müdüre,
öğrenci öğrenciye yazamaz; günlük sınır yok (yalnız saatte 30); mesaja dosya eklemeyi onaylı her rol yapar
([sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) `mesajYazilabilirler`, `MESAJ_SAATLIK_SINIR`;
[sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md) `yukleyebilir`). Ayarın tablosu, ucu ve ön yüz düğmesi yapı belgesinde
yazılacak ([public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) "Son durum"da planı var). Kodlanınca bu
belgenin Durum satırı güncellenir.

## Sık sorulanlar

- **Velilerin bütün öğretmenlere yazmasını istiyorum.** Çarktan "Veliler kime yazabilir?" altında "Okuldaki bütün öğretmenler"i aç.
- **Öğretmenler gece mesajla rahatsız ediliyor.** "Sessiz saatleri uygula"yı açık tut; öğrenci ve veli mesajlarının bildirimi sabah gider.
- **Öğrenciler birbirine yazabilsin mi?** Varsayılan kapalı; açarsan her mesajda "Bu mesajı bildir" görünür ve bildirilenleri sen görürsün.

## Sırada

- Mesaj ayarları (çark), Bu mesajı bildir, Ajanda işi (iş 8) — kodu Linux'ta yazılacak.
- KVKK: bildirilen mesajlar ve sessiz saatlerle ilgili metinler aynı işte aydınlatma metnine eklenecek.
