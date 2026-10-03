# Toplantılar · Toplantılar listesi

**Durum:** Tasarlandı — henüz kodda yok

Menüdeki "Toplantılar" sayfası: davetli olduğun toplantılar alt alta, yaklaşanlar üstte, bitenler soluk ve "1 hafta sonra
silinir" başlığı altında; zamanı gelince satırın sağında "Katıl" (açansan "Aç") çıkar.

## Ne işe yarar

Kullanıcının 29 Eylül isteği: veli toplantısı gibi toplantılar "uygulama içinden görüşme ya da toplantı sekmesinde" önceden
dursun; "toplantılarda alt alta isim + tarih olur, saati ile tarihi gelince yanında 'Katıl' olur, geçince siyahımsı/koyumsu
olur, 1 hafta sonra kaydı silinir; ajandaya da eklenir." 3 Ekim'de: "katıl kalsın, 10 dakika kuralı da kalsın … müdürün aç
olsun" (toplantıyı açan kişide düğme "Aç") ve toplantılar Google Meet tabanlı, Zoom isteğe bağlı.

Sayfa üç şeyi bir arada tutar: senin toplantıların (yüz yüze, bağlantıyla ya da ikisi birden), öğrencide o anki uzaktan ders
ve öğretmen ile müdürde toplantılar için kaydedilen görüşme bağlantıları.

**Bugün kodda olan tek yakın parça:** müdür (ya da "Okul takvimine etkinlik ve tatil ekler" — `takvim.yonet` — yetkilisi)
Takvim'de **"Etkinlik ekle"** düğmesiyle açılan "Takvime ekle" penceresinde türü **"Toplantı"** olan bir kayıt ekleyebilir
(başlık, tarih, isteğe bağlı bitiş, açıklama). Bu yalnız takvimde mor bir işarettir: saati, davetlisi, bağlantısı, "Katıl"ı yoktur
([Takvime ekle](../takvim/etkinlik-ekleme.md)). Aşağıdaki sayfa bundan ayrı, yeni bir bölümdür.

## Nereden açılır

- **Sol menü → "Toplantılar"** (kamera simgesi). Tasarım 1 önizlemesinde menüde Takvim'in hemen altında, "Hatırlatıcılar"ın
  üstündedir; öğrenci, veli, öğretmen ve müdür menüsünde var, yanında sayı rozeti durur (önizlemede 1; neyi saydığı tanımda
  yazmıyor). Servisçinin, eğitmenin ve tahtanın menüsünde yok.
- **Takvim → bir güne bas → gün ayrıntısındaki "Toplantı" satırı** → [Toplantı penceresi](toplanti-penceresi.md) açılır.
  Tasarımda toplantılar takvime ve ajandaya kendiliğinden girer ([Ajanda](../takvim/ajanda.md),
  [Gün ayrıntısı](../takvim/gun-ayrintisi.md)).
- **Ana sayfa → "Yaklaşanlar"** kutusundaki toplantı satırı (ör. velide "Cum · 7-A veli toplantısı · 15:30 · konferans
  salonu") ve **bildirim paneli**ndeki toplantı bildirimleri de aynı pencereyi açar.
- Sayfanın adresi tanımda yazılı değil; önizlemede sayfanın kısa adı `toplantilar`.

## Adım adım

### Öğrenci

Sayfanın başlığı **"Toplantılar"**, altındaki satır sayıları söyler; kalıbı:
"`<n>` yaklaşan toplantı · `<m>` geçmiş · "Katıl" toplantıdan 10 dakika önce çıkar" (geçmiş yoksa ortadaki parça yazmaz).

Sayfada yukarıdan aşağı gruplar:

1. **"Uzaktan ders"** (yalnız öğrencide): o anki dersin uzaktan bağlantısı. Satır: "7-A · Matematik · 3. ders", altında
   "Ayşe Kaya · Google Meet · 10:10–10:50 · öğretmen sana katılma izni verdi"; sağda yeşil **"Katıl"** ya da izin yoksa gri
   **"İzin yok"**. Ayrıntısı: [Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md#öğrenci).
2. **"Yaklaşan"**: bitmemiş toplantıların, tarih sırasıyla.
3. **"Geçmiş · 1 hafta sonra silinir"**: biten toplantılar (yalnız varsa çıkar).

Her toplantı satırı:

| Parça | Ne yazar |
|---|---|
| Soldaki simge | yüz yüze toplantıda kişiler (grup) simgesi, bağlantılı ya da ikisi birden olanda kamera simgesi |
| Başlık | toplantının adı, ör. "Sınav kaygısı semineri" |
| Alt satır | "`<gün ay gün adı>` · `<başlangıç>`–`<bitiş>` · `<katılım>`", ör. "7 Ekim Çarşamba · 19:00–20:00 · Konferans salonu + Zoom" |
| Sağdaki rozet | zamana göre (aşağıdaki tablo) |

Katılım parçası: bağlantıyla olanda platformun adı ("Google Meet", "Zoom", "Microsoft Teams"), yüz yüzede "Yüz yüze ·
`<yer>`", ikisi birdende "`<yer>` + `<platform>`".

Sağdaki rozet:

| Toplantının zamanı | Rozet | Rengi |
|---|---|---|
| Başlamasına 10 dakikadan az kaldı ya da sürüyor, bağlantılı | **"Katıl"** (açansan **"Aç"**) | yeşil |
| Başlamasına 10 dakikadan az kaldı ya da sürüyor, yalnız yüz yüze | **"Şimdi"** | yeşil |
| Yarın | **"Yarın `<saat>`"**, ör. "Yarın 15:30" | sarı |
| Daha ileride | gün ve ay, ör. "7 Ekim" | mavi |
| Bitti | **"Bitti"**; satırın tamamı soluk (koyulaşmış) | gri |

Toplantı sürerken ve açan henüz "Aç"a basmadıysa alt satırın sonuna "· açan henüz gelmedi" eklenir
([Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md)).

1. Menüden **"Toplantılar"**ı aç.
2. Bir satıra bas: [Toplantı penceresi](toplanti-penceresi.md) açılır (başlık, tarih, saat, katılım, davetliler, düzenleyen,
   hatırlatma, açıklama).
3. Zamanı geldiyse satırdaki ya da penceredeki **"Katıl"**a bas ([Katıl düğmesi](katil.md)).

Öğrenci, toplantılara davetli olduğu kadarını görür (ör. "7. ve 8. sınıf öğrencileri ve velileri" davetli olan seminer).
"Toplantı aç" düğmesi ve "Görüşme bağlantıları" bölümü öğrencide yoktur.

### Veli

Öğrencideki liste; "Uzaktan ders" grubu velide yoktur. Veli, **oturumunu açtığı çocuğun** toplantılarını görür: sınıfa özel bir
veli toplantısı yalnız o çocuğun oturumunda çıkar (ör. "7-A veli toplantısı" 7-A'daki çocuğun, "5-B veli toplantısı" 5-B'deki
çocuğun oturumunda). Okul geneli toplantılar (ör. okul aile birliği) her çocuğun oturumunda aynıdır. Bkz.
[Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md).

Yüz yüze veli toplantısında sağda saat yaklaşınca "Şimdi" yazar, "Katıl" çıkmaz; yeri satırda yazar ("Yüz yüze · Konferans
salonu").

### Öğretmen

Öğrencideki liste (Yaklaşan, Geçmiş) ve ayrıca:

- Başlığın altında **"Toplantı aç"** düğmesi (artı simgeli) — [Toplantı açma](toplanti-acma.md). Öğretmende bu düğme,
  rolünde "Toplantı açar" yetkisi olduğu için çıkar; Tasarım 1'de hazır "Öğretmen" rolünde bu yetki vardır.
- Senin açtığın toplantıların alt satırında "· sen açıyorsun" yazar, zamanı gelince rozet **"Aç"** olur.
- Listenin altında **"Görüşme bağlantıları"** bölümü: toplantılar ve tahtalar için kaydettiğin Meet, Zoom, Teams bağlantıları
  ([Görüşme bağlantıları](gorusme-baglantilari.md)).

Öğretmen, davetli olduğu toplantıları görür (ör. "Öğretmenler kurulu", "Matematik zümre toplantısı") ve kendi açtığı
toplantıları; derse girmediği sınıfın veli toplantısı listesinde çıkmaz.

### Müdür

Öğretmendekiyle aynı ekran: "Toplantı aç", "Görüşme bağlantıları". Tasarım 1 önizlemesinde müdür okulun açılan bütün
toplantılarını listesinde görür (açılan her toplantının görenlerine müdür eklenir); bunu tanım ayrıca yazmıyor.

### Çalışan

Rolsüz çalışan toplantı açamaz; bir toplantıya davet edilirse (ör. müdür onu kişi olarak seçerse) listesinde görür ve "Katıl"a
basar. Özel rolüyle (ör. "Müdür yardımcısı", "Rehber öğretmen", "Zümre başkanı",
"Sınıf öğretmeni") "Toplantı açar" yetkisi olan çalışan, öğretmendeki gibi "Toplantı aç" düğmesini görür ve davetli olduğu ya
da açtığı toplantıları listeler ([Özel roller](../roller-yetkiler/ozel-roller.md)). Tasarım 1'de ayrı bir çalışan hesabı
çizilmedi.

## Kurallar ve sınırlar

- **Kim görür:** yalnız davetliler, toplantıyı açan ve (önizlemeye göre) müdür. Davetli olmayan bir toplantı listede çıkmaz;
  takvimde de çıkmaz.
- **10 dakika kuralı:** "Katıl" / "Aç" toplantının başlangıcından 10 dakika önce çıkar, bitene kadar durur.
- **Bitince:** satır soluklaşır, "Bitti" yazar ve "Geçmiş · 1 hafta sonra silinir" grubuna iner; bitişten **1 hafta sonra kayıt
  kendiliğinden silinir**, takvimden ve ajandadan da kalkar ([Hatırlatma ve silinme](hatirlatma-ve-silinme.md)).
- **Bağlantı gizli:** öğrenci ve veli toplantının Meet/Zoom adresini hiçbir yerde görmez; "Katıl" sunucumuzdan geçer
  ([Katıl düğmesi](katil.md)).
- **Bölüm aç/kapat:** tanıma göre "Toplantılar" okulun açıp kapatabileceği bir bölümdür; kapalıyken menüde çıkmaz
  ([Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md), [Kapalı bölüm](../ozellikler/kapali-bolum.md)).
- **Ajanda:** her toplantı ajandaya kendiliğinden girer; ajandanın "Toplantı" süzgeci bunları gösterir.
- **Boş liste:** hiç toplantı yokken ne yazacağı tanımda ve önizlemede belirlenmedi.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Toplantılar ve uzaktan ders](README.md)):

- [Toplantı penceresi](toplanti-penceresi.md) — satıra basınca açılan ayrıntı; Düzenle, İptal et.
- [Toplantı açma](toplanti-acma.md) — "Toplantı aç" penceresi.
- [Katıl düğmesi](katil.md), [Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md).
- [Hatırlatma ve 1 hafta sonra silinme](hatirlatma-ve-silinme.md).
- [Kimler katıldı](katilanlar.md).
- [Görüşme bağlantıları](gorusme-baglantilari.md), [Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md).
- [Sınıfın uzaktan ders bağlantısı](uzaktan-ders-baglantisi.md), [Görüşme başlat, ping ve Katıl izni](gorusme-baslat-ve-ping.md).

**İlgili:**

- [Ay görünümü](../takvim/ay-gorunumu.md), [Gün ayrıntısı](../takvim/gun-ayrintisi.md), [Ajanda](../takvim/ajanda.md),
  [Takvime ekle](../takvim/etkinlik-ekleme.md) (bugünkü "Toplantı" türü).
- [Sol menü](../menu-ve-arama/sol-menu.md), [Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md).
- [Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md).
- [Bildirim paneli](../bildirim/bildirim-paneli.md).
- [Duyuru](../mesaj/duyuru.md) — "Cuma veli toplantısı" gibi haberler için; toplantının kendisi bu sayfada durur.
- [Dil ve çeviri](../dil/README.md) — "Toplantılar" İngilizcede "Meetings".

## Kod tarafı

Bugün kodda yok. Bugünkü takvimin "Toplantı" türü şu dosyalarda:

- Sunucu: [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md) (`POST /api/takvim/etkinlik`, tür `toplanti`; yalnız
  `takvim.yonet` yetkilisi), [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (okul takvimi tablosu).
- Ön yüz: [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) ("Takvime ekle" penceresi, ızgaradaki mor
  işaret; belge, lejantta "Toplantı"nın yazmadığını not ediyor).

Kodlanınca dokunacağı bugünkü belgeler: menüye yeni satır ([public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md)
bu işi "Toplantılar" diye anıyor), yeni tablolar ([sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) "toplantılar
(iş 21)"), bölüm kapısı ([sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md),
[public/js/parcalar/16c-ozellikler.md](../../public/js/parcalar/16c-ozellikler.md)), yetki
([sunucu/yetki.md](../../sunucu/yetki.md)). Kullanıcıya dönük anlatım [belge/KILAVUZ.md](../../belge/KILAVUZ.md)'de henüz
yok (bölüm kodlanınca eklenecek).

## Sık sorulanlar

- **"Katıl" neden yok?** Toplantıya 10 dakikadan fazla var ya da toplantı yalnız yüz yüze (o zaman "Şimdi" yazar).
- **Geçen haftaki toplantı nerede?** Biten toplantı 1 hafta "Geçmiş" grubunda durur, sonra silinir.
- **Velisi olduğum iki çocuğun toplantılarını birlikte görebilir miyim?** Hayır; her çocuğun oturumu ayrı. Öbür çocuğun
  toplantıları için üstten onun oturumuna geç.
- **Takvimdeki "Toplantı" işareti ile bu sayfa aynı mı?** Bugünkü sitede takvimdeki "Toplantı" yalnız bir işarettir. Bu sayfa
  kodlanınca açılan her toplantı takvime ve ajandaya kendiliğinden girecek.

## Sırada

- Toplantılar işi (iş 21): sayfa, liste, rozetler ve Görüşme bağlantıları bu belgeye ve Tasarım 1 önizlemesine göre kodlanacak.
- Ajanda işi (iş 8): toplantıların ajandaya girmesi ve "Toplantı" süzgeci.
- Toplantılar sayfasına süzgeçli bağlantı seçici, Kullanımda/Boşta ve "Bağlantı bulunamadı" (tanımlandı, önizlemeye md'ler bittikten
  sonra eklenecek).
- Öneri (onaylanmadı): randevulu veli görüşmesi — öğretmen boş saatler açar (ör. 10'ar dakika), veli birini seçer; aynı listede
  görünür.
