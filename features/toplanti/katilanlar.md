# Toplantılar · Kimler katıldı

**Durum:** Tasarlandı — henüz kodda yok

Toplantı bitince düzenleyenin ve müdürün gördüğü liste: kaç kişi davetliydi, kimler "Katıl"a bastı (saatiyle), kimler basmadı;
veli toplantısında hangi öğrencinin velisi olduğu ve "Katılmayanlara mesaj gönder" düğmesi.

## Ne işe yarar

Kullanıcının 3 Ekim kararı (önerilen 7 fikirden seçtiği "2 3 5 6"nın 5. maddesi, "toplantıya kimin katıldığı"): "Katıl" ve "Aç" bizim sunucumuzdan
geçtiği için kimin ne zaman bastığı bilinir. Öğretmen veli toplantısından sonra hangi velilere ulaşamadığını görür ve onlara
tek düğmeyle yazar; müdür kurula kimin katıldığını görür. Tanımı yazıldı; kodu Linux'ta yapılacak, Tasarım 1
önizlemesine md'ler bittikten sonra eklenecek.

## Nereden açılır

Tanımda yalnız "toplantı bitince düzenleyen ve müdür 'Katılanlar'ı görür" yazar; ekrandaki yeri çizilmedi. Akla yatkın yer
[Toplantı penceresi](toplanti-penceresi.md)dir (bitmiş toplantının penceresinde "Katılanlar" bölümü ya da düğmesi). Kodlanırken
belirlenecek.

## Adım adım

### Öğretmen ve çalışan — toplantıyı açan olarak

1. Toplantı bittikten sonra toplantının penceresini aç ([Toplantılar listesi](toplantilar.md) → "Geçmiş · 1 hafta sonra
   silinir" → toplantı).
2. **"Katılanlar"**ı aç. Görürsün:
   - **davetli sayısı** (ör. 28 veli);
   - **"Katıl"a basanlar**, her birinin bastığı saatle;
   - **basmayanlar**;
   - veli toplantısında her velinin yanında **hangi öğrencinin velisi** olduğu (ör. "Zeynep Yılmaz · Elif Yılmaz'ın velisi").
3. Listenin üstünde açık bir not: liste kişinin Meet'e girdiğini değil, Eğitim Evi'nden **"Katıl"a bastığını** gösterir (kesin
   ekran metni belirlenecek).
4. Ulaşamadıklarına yazmak için **"Katılmayanlara mesaj gönder"**e bas. Tanımda düğmenin ne açtığı yazmıyor; beklenen, alıcıları
   basmayanlar olarak dolu bir [Yeni mesaj](../mesaj/yeni-mesaj.md) penceresidir.

### Müdür

Kendi açtığı toplantılarda öğretmendeki gibi; ayrıca okuldaki **öbür toplantıların** da "Katılanlar" listesini görür (tanım:
"düzenleyen ve müdür").

### Öğrenci ve veli

Görmez. Davetli olarak "Katıl"a bastıkları kaydedilir; bunun kaydedildiği, özellik kodlandığı işte aydınlatma metnine yazılacak.

## Kurallar ve sınırlar

- **Kim görür:** yalnız toplantıyı açan (düzenleyen) ve müdür. Öbür davetliler, öğrenciler ve veliler görmez.
- **Ne zaman:** toplantı bitince. Toplantı sürerken görünüp görünmeyeceği tanımda yazılı değil.
- **Neyi gösterir:** "Katıl"a (açan için "Aç"a) basış ve saati. Meet ya da Zoom'a gerçekten girip girmediğini, ne kadar kaldığını
  Eğitim Evi bilemez; ekranda bu açıkça yazar.
- **Yalnız yüz yüze toplantı:** "Katıl" olmadığı için liste boş kalır; bu toplantılarda "Katılanlar"ın gösterilip
  gösterilmeyeceği kararlaştırılmadı.
- **Saklama:** toplantı bitişten 1 hafta sonra silindiğinde liste de onunla gitmeli; ayrı bir süre tanımda yazılı değil
  ([Hatırlatma ve silinme](hatirlatma-ve-silinme.md)).
- **KVKK:** kimin ne zaman "Katıl"a bastığı kişisel veridir; aydınlatma metnine yazılır ve sürüm artar
  ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Toplantılar ve uzaktan ders](README.md)):

- [Katıl düğmesi](katil.md), [Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md) — kaydedilen basışlar.
- [Toplantı penceresi](toplanti-penceresi.md) — listenin bulunacağı yer.
- [Hatırlatma ve 1 hafta sonra silinme](hatirlatma-ve-silinme.md) — saklama.
- [Toplantı açma](toplanti-acma.md) — davetliler.

**İlgili:**

- [Yeni mesaj ve alıcı seçimi](../mesaj/yeni-mesaj.md) — "Katılmayanlara mesaj gönder".
- [Okundu bilgisi](../mesaj/okundu-bilgisi.md), [Okumayanlara hatırlat](../mesaj/okumayanlara-hatirlat.md) — duyurudaki benzer
  "kim gördü / görmeyene hatırlat" düzeni.
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md).
- Aynı 3 Ekim kararıyla (önerilen 7 fikirden "2 3 5 6", 7 yerine "Önemli" etiketi) gelen öbür özellikler:
  [Devamsızlık sınırı uyarısı](../devamsizlik/devamsizlik-siniri-uyarisi.md) (2),
  [Bugün servise binmedi uyarısı](../servis/servise-binmedi-uyarisi.md) (3),
  [Okumayanlara hatırlat](../mesaj/okumayanlara-hatirlat.md) (6), ["Önemli" etiketi](../mesaj/onemli-etiketi.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Mesajın okundu listesi (benzer liste ve alıcı çözme): [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md),
  [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md).
- Velinin hangi öğrenciye bağlı olduğu: [sunucu/bolumler/veli.md](../../sunucu/bolumler/veli.md).
- Yeni tablo (basışlar): [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md).

## Sık sorulanlar

- **Listede "katıldı" görünen veli toplantıda yoktu.** Liste "Katıl"a basanları gösterir; basıp Meet'e girmemiş olabilir.
- **Velilerin kaçı geldi, nasıl anlarım?** Yüz yüze toplantıda Eğitim Evi bunu bilemez; liste yalnız bağlantıdan katılanlar
  içindir.
- **Katılmayanlara toplu yazabilir miyim?** Evet; "Katılmayanlara mesaj gönder".

## Sırada

- Toplantılar işi (iş 21): basış kaydı ve "Katılanlar" listesi kodlanacak (Linux'ta); ekrandaki yeri ve düğmenin açtığı pencere
  belirlenecek; sonra Tasarım 1 önizlemesine eklenecek.
- KVKK: kodlandığı işte aydınlatma metnine eklenecek.
