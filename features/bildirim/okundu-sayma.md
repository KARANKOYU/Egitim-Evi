# Bildirimler · Okundu sayma

**Durum:** Kodda var; tasarımda ek olarak bildirimlerin tek tek okundu sayılması ve sekmeye göre çalışan "Tümünü okundu say"
düğmesi (zili açmak artık hepsini okundu saymaz).

Bir bildirimin "okunmamış" (vurgulu, rozete sayılan) hâlinden "okundu" hâline ne zaman geçtiği.

## Ne işe yarar

Zilin üstündeki sayı yalnız okunmamış bildirimleri sayar; okunmuş bildirim listede soluk durur. Sayının doğru olması, yeni bir şey
gelip gelmediğini bir bakışta anlaman içindir.

## Nereden açılır

Sağ üstteki zil ([Bildirim paneli](bildirim-paneli.md)). Tasarımda panelin üst kısmındaki **"Tümünü okundu say"** düğmesi.

## Adım adım

### Herkes — bugünkü site

1. Zilin rozetinde okunmamış sayısı durur (ör. "3").
2. Zile bas. Panel açılır; o anda okunmamış satırlar vurgulu görünür.
3. Panel açıldığı anda sunucuya "hepsini okundu say" isteği gider: **bütün** okunmamış bildirimlerin okundu olur — panelde görünen
   son 100'ün dışındakiler de. Rozet hemen kaybolur.
4. Panel açık kalırken vurgu bazen durur, bazen hemen kaybolur: zil açılınca aynı anda giden yoklama "okundu"dan sonra
   cevaplanırsa liste okunmuş hâliyle yeniden çizilir (kod okumasına göre). Bu durumda son yoklamadan beri gelmiş, panelde henüz
   hiç görmediğin yeni bildirimler de okundu sayılır ve listeye "yeni" vurgusu olmadan düşer.
5. Panel açıkken yeni bir bildirim gelirse liste tazelenir ve o da hemen okundu sayılır; rozet bir an görünüp kaybolur.

Satırları tek tek okundu saymanın ya da "okunmadı" diye işaretlemenin bir yolu yok.

### Tasarımda (Tasarım 1 önizlemesi)

1. Zile basmak hiçbir şeyi okundu saymaz; rozet okunmamış sayısını göstermeye devam eder.
2. Bir satıra bas: **yalnız o bildirim** okundu olur (soluklaşır, soldaki nokta kalkar), panel kapanır, bildirimin açtığı yer
   açılır.
3. **"Tümünü okundu say"**: gösterdiğin sekmedeki bütün okunmamışları okundu sayar. "Tümü" sekmesindeyken kısa ileti
   **"Bütün bildirimler okundu sayıldı."**; bir sekmedeyken **"Ödev bildirimleri okundu sayıldı."** (sekmenin adıyla). Gösterilen
   sekmede okunmamış yoksa düğme soluk durur ve basılmaz ([Bildirim sekmeleri](sekmeler.md)).
4. Rozet ve sekmelerdeki sayılar hemen azalır.
5. Tanımda tarih biçimi ve "Tümünü okundu say" birlikte gelir; "okunmadı olarak işaretle" yok (kullanıcı mesajlarda da
   "Okunmadı olarak işaretle gereksiz" dedi, 1 Ekim).

### Veli

Bildirimin kopyası velinin kendi bildirimidir: veli okuyunca çocuğun bildirimi okunmuş olmaz, çocuk okuyunca velininki okunmuş
olmaz ([Öğrencinin bildirimi veliye de](velinin-bildirimleri.md)). Tasarımda her çocuğun oturumunun zili ayrıdır; bir çocuğun
oturumunda "Tümünü okundu say" öbür çocuğunkine dokunmaz.

## Kurallar ve sınırlar

- **Bildirimi okundu saymak asıl şeyi okundu yapmaz.** "Ayşe Kaya: Gezi izin formu" bildirimini okundu saymak mesajı okundu yapmaz;
  mesaj, penceresini açınca okundu olur ve gönderen okundu listesinde ancak o zaman görür
  ([Okundu bilgisi](../mesaj/okundu-bilgisi.md)). Ödevin "açıldı" bilgisi de ödevin penceresini açınca yazılır
  ([Açıldı / açılmadı bilgisi](../odev/acilma-bilgisi.md)).
- **Telefon uygulaması okunmamışları getirir.** Android uygulaması sunucuya yalnız okunmamış yeni bildirimleri sorar. Zili sitede
  açıp hepsini okundu saydıysan, uygulamanın henüz almadığı bildirimler telefonuna düşmez (kod okumasına göre). Tarayıcıdan açılan
  telefon bildirimi (Web Push) bundan etkilenmez: bildirim yazıldığı anda gider ([Telefon bildirimi](telefon-bildirimi.md)).
- **Okundu sayısı sürümü değiştirir.** Okunmamış sayısı bildirim kutusunun "sürümünün" parçasıdır; zili açtıktan sonraki ilk yoklama
  bu yüzden listeyi baştan alır ([Zilin tazelenmesi](yoklama-araligi.md)).
- **Okunmuş bildirim silinmez**; listede soluk durur ([Saklama ve silinme](saklama-ve-silinme.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Bildirim paneli](bildirim-paneli.md) · [Bildirim sekmeleri](sekmeler.md) ·
[Zilin tazelenmesi](yoklama-araligi.md) · [Telefon bildirimi](telefon-bildirimi.md) ·
[Öğrencinin bildirimi veliye de](velinin-bildirimleri.md).

**İlgili:** [Mesajlar · Okundu bilgisi](../mesaj/okundu-bilgisi.md) · [Ödevler · Açıldı / açılmadı](../odev/acilma-bilgisi.md) ·
[Android uygulaması](../uygulama/android-uygulamasi.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md) —
  `bildirimPaneliCiz` (okunmamış varsa `POST /api/notifications/read`, rozeti gizler, bellekteki listeyi okundu yapar);
  "Dikkat!" bölümünde zili açmanın her şeyi okundu sayması ve okundu/yoklama yarışı.
- Sunucu: [sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md) — `POST /api/notifications/read`.
- Depo: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) — `bildirimleriOkundu` (kişinin bütün okunmamışları),
  `bildirimSurumu` (toplam · okunmamış · son bildirimin anı); [sunucu/veri/depo/cihazlar.md](../../sunucu/veri/depo/cihazlar.md)
  — telefon uygulamasına yalnız okunmamışların gitmesi.
- Testler: [testler/test-bildirim.md](../../testler/test-bildirim.md) — okundu isteğinden sonra sürümün değişmesi, `unread` 0.
- Tasarım: Tasarım 1 önizlemesi, herkes-a paketi ("okundu say sekmeye göre çalışsın").

## Sık sorulanlar

- **Bir bildirimi okunmadı yapabilir miyim?** Hayır; ne bugün ne tasarımda.
- **Zili açtım, telefonuma bildirim gelmedi.** Android uygulaması okunmamışları getirir; zili açınca okundu olanlar uygulamaya
  düşmez. Tarayıcının telefon bildirimini açtıysan o etkilenmez.
- **Rozet kayboldu ama bildirimi okumadım.** Bugünkü sitede zili açmak hepsini okundu sayar.

## Sırada

- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu (iş 8):
  sekmeler ve "Tümünü okundu say" ile tek tek okundu sayma gelir; "panel açılınca hepsi okundu" kuralı kalkar.
