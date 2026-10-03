# Yorumlar · Yorumu gizleme (yönetici)

**Durum:** Kodda var; tasarımda ek olarak ekran `/panel/admin` içine taşınır ve kişi sayfasında (`/users/<kullanıcı adı>`) "Yazdığı yorumlar" kartı gelir

Sistem yöneticisinin süzgeçten geçmiş uygunsuz bir yorumu açılış sayfasından kaldırması (silmeden gizlemesi) ve isterse yeniden
göstermesi.

## Ne işe yarar

Uygunsuz kelime süzgeci her şeyi yakalayamaz: kelime listede yoktur, hakaret kibar kelimelerle yapılmıştır ya da yorum konu dışıdır.
Yorumlar ön onaysız yayına girdiği için son söz sistem yöneticisindedir. Gizlenen yorum silinmez: yazarı onu görmeye, değiştirmeye
ve silmeye devam eder; yalnız açılışta görünmez, sayıya ve ortalamaya girmez. Yanlışlıkla gizlenen yorum tek tıkla geri gelir.
Aydınlatma metni de bunu söyler: sistem yöneticisi uygunsuz yorumu gizler.

## Nereden açılır

- **Bugünkü site:** yönetici `/login`'den iki adımlı girer, sayfa kendiliğinden gizli yönetim adresine (`/admin`) geçer
  ([Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md)). Sol menüde **"Yorumlar"** (sıra: Ana Sayfa, Müdürler, Okullar,
  **Yorumlar**, Hatırlatıcılar; "Site" başlığının üstünde). Adres `/admin#/yorumlar`. Yönetim ana sayfasının kutucuklarında Yorumlar
  yoktur; menüden girilir.
- **Tasarımda** (paneller tanımı, kullanıcı onaylı): `/admin` kalkar, yerine `/panel/admin` gelir; **"Yorumlar"** o panelin
  bölümlerinden biridir ([Paneller](../yonetim/paneller.md)). Ayrıca panelin **"Kullanıcılar"** bölümünden açılan kişi sayfasında
  (`/users/<kullanıcı adı>`) o kişinin yorumu görünür ([Kullanıcı arama ve kişi sayfası](../yonetim/kullanici-arama.md)).

## Adım adım

### Yönetici

1. Menüden **"Yorumlar"**'ı aç. Başlık **"YORUMLAR"**, altında: "Açılış sayfasında görünen yorumlar. Uygunsuz kelimeler
   badwordsfilter.json ile zaten engellenir; geçeni buradan gizleyebilirsin."
2. Liste tek kartta, her yorum bir satır (gizliler de dahil), en son yazılan ya da değiştirilen en üstte. Her satırda:
   - baş harfli yuvarlak,
   - "De. Ka. · Veli" ve yanında yorumun yıldızları,
   - yorumun metni,
   - tarih ve saat ("24.09.2026 14:05"); gizliyse yanında "· gizli",
   - sağda küçük gri düğme: **"Gizle"** (görünen yorumda) ya da **"Göster"** (gizli yorumda).
   Gizli yorumun satırı soluk görünür. Hiç yorum yoksa: "Henüz yorum yok."
3. Uygunsuz yorumun satırında **"Gizle"**'ye bas. Onay sorulmaz. Sayfa baştan çizilir (en üste döner); satır soluklaşır, "· gizli"
   eklenir, düğme **"Göster"** olur.
4. Yorum açılıştan HEMEN kalkar; açılıştaki sayı ve ortalama yeniden hesaplanır.
5. Geri almak için aynı satırda **"Göster"**'e bas: yorum açılışa eski yerine (son değişiklik tarihine göre) döner.
6. Her gizleme ve gösterme işlem kaydına yazılır: "Yorum gizlendi" / "Yorum yeniden gösterildi", ayrıntısı yazarın kısa adı ve
   yorumun ilk 60 karakteri, sonuna "…" eklenmeden ("De. Ka.: Ödevleri tek yerden takip ediyorum"). Bu satırlar okulsuzdur; yalnız sen görürsün
   (menüde "İşlem Kaydı" — [İşlem kaydı: neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).

Bu ekranda yapamadıkların:

- Yorumu silemezsin ve değiştiremezsin; yalnız gizler ya da gösterirsin.
- Yorumu kimin yazdığını göremezsin: satırda yalnız kısa ad ve etiket var. (Tasarımda kişi sayfasından bakılır, aşağıda.)
- Arama, süzme ve sayfalama yok; ekran son değiştirilen 300 yorumu gösterir, daha eskileri bu ekranda görünmez (sayfa bunu yazmaz).
- Yazara bildirim gitmez.

Silinmiş bir yorumu gizlemeye çalışırsan (ör. yazarı sen bakarken sildiyse) uyarı penceresinde "Yorum bulunamadı" çıkar.

### Yorumu gizlenen kişi

Yorumu gizlenen veli, öğretmen ya da müdür (yazabiliyorsa çalışan ve eğitmen de):

1. Sana bildirim gelmez. Ayarlar'daki yorum kartında turuncu bir uyarı kutusu çıkar: "Yorumun sistem yöneticisi tarafından gizlendi; açılışta
   görünmüyor."
2. Yorumunu değiştirebilirsin; gizli kalır ve ileti bunu söyler: "Yorumun güncellendi. Sistem yöneticisi gizlediği için açılışta
   görünmüyor."
3. Silebilirsin. Bugünkü kodda silip yeniden yazarsan yeni yorum gizli başlamaz, açılışta görünür
   ([Yorumu değiştirme ve silme](yorumu-duzeltme-ve-silme.md#yorumu-gizlenmiş-kişi)).

### Destek (tasarım)

Destek ekibi panelinin "Kullanıcılar" bölümünden açtığı kişi sayfasında o kişinin yorumunu görür; tanıma göre gizleme ve gösterme
yalnız yöneticinindir, destek gizleyemez. Destek panelinde "Yorumlar" bölümü yoktur ([Destek ekibi](../destek/destek-ekibi.md)).

### Öbür roller

Müdür, öğretmen, çalışan, veli, öğrenci, servisçi, eğitmen ve ziyaretçinin gizleme yetkisi yoktur. Yönetimin yorum adresleri
(`/api/yorumlar/hepsi`, `/api/yorumlar/gizle`) yönetici olmayana bilinmeyen bir adresle aynı cevabı verir: "Böyle bir adres yok"
(404). Okul müdürü kendi okulunun öğretmenlerinin yorumlarını da gizleyemez; yorum
okulun değil kişinin kendisinindir.

### Tasarımda

- **Panel:** `/panel/admin` menüsünde "Yorumlar" bölümü (paneller tanımındaki liste: Okullar, Kullanıcılar, Destek talepleri, Site
  ayarları, Yedekler, Yönetici dosyası, Destek dosyası, İşlem kaydı, Yorumlar). Bölümün görünüşü için ayrıca bir karar yok; bugünkü
  liste ve "Gizle"/"Göster" düğmeleri taşınır.
- **Kişi sayfası** (kullanıcının 27 Eylül isteği: kişinin sayfasında "onun yazmış olduğu yorumları" görmek): Tasarım 1 önizlemesinde
  sağ sütunda **"Yazdığı yorumlar"** kartı. Yorumu varsa yıldızları, metni ve altında "24 Eylül 2026, Perşembe · açılış sayfasında
  görünüyor"; yoksa soluk yazıyla "Açılış sayfasına yorum yazmamış.". Kullanıcı arama tanımına göre kart yorumun gizli olup
  olmadığını da gösterir ve yönetici buradan da gizleyip açabilir.
- **Önizlemedeki eksik:** Tasarım 1 önizlemesinin yönetici panelinde (Okullar, Kullanıcılar, Destek talepleri, Site ayarları, Duyuru
  koy, Çeviri) "Yorumlar" bölümü çizilmedi; kişi sayfasındaki kartta da gizle düğmesi yok. Tanımlar ikisini de istiyor; kodlanırken
  tanım esas alınmalı.

## Kurallar ve sınırlar

- **Kim:** yalnız sistem yöneticisi (`data/admins.json`'daki hesaplar). Tasarımda destek ekibi görür ama gizleyemez.
- **Gizlemek silmek değildir:** yorum, yıldızı, metni, kısa adı ve etiketiyle saklanır; site yedeklerine "gizli" işaretiyle girer,
  yedekten dönüşte de gizli kalır ([Site yedekleri](../yonetim/yedekler.md)).
- **Etkisi:** gizli yorum açılışta görünmez; açılıştaki sayıya ve ortalamaya girmez. Yazarının Ayarlar'ında ve yöneticinin listesinde
  görünmeye devam eder.
- **Gizli kalma:** yazarı yorumu değiştirse de gizli kalır; yalnız yöneticinin "Göster"'i açar. Bilinen açık: yazarı silip yeniden
  yazarsa yeni yorum gizli başlamaz.
- **Liste sınırı:** yönetici ekranında son değiştirilen 300 yorum; açılışta en yeni 12 görünen yorum.
- **Hız:** gizleme için ayrıca bir sınır yok; her tıklama sayfayı baştan çizer (çok yorumu art arda gizlemek yorucu olabilir).
- **Gizlilik:** yönetim ekranının kodu herkese giden uygulama dosyasında yoktur; yönetim çereziyle yalnız `/admin` altında yüklenir.
- **Kayıt:** "Yorum gizlendi" / "Yorum yeniden gösterildi" işlem kaydına düşer; uygunsuz kelimeyle reddedilen yorumlar ayrıca
  "Uygunsuz kelimeli yorum reddedildi" diye kayıtlıdır ([süzgeç](uygunsuz-kelime-suzgeci.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Yorumlar](README.md)):

- [Uygunsuz kelime ve internet adresi süzgeci](uygunsuz-kelime-suzgeci.md) — gizlemeden önceki ilk savunma.
- [Açılış sayfasındaki yorumlar bölümü](yorumlar-bolumu.md) — gizlenen yorumun kalktığı yer.
- [Yorumu değiştirme ve silme](yorumu-duzeltme-ve-silme.md) — gizli yorumun sahibi ne yapabilir.
- [Yorum yazma](yorum-yazma.md), [Adın kısaltılması ve rol etiketi](ad-kisaltma-ve-etiket.md).

**İlgili:**

- [Gizli yönetim adresi](../yonetim/gizli-yonetim-girisi.md) ve [Paneller](../yonetim/paneller.md) — ekranın bugünkü ve tasarımdaki yeri.
- [Kullanıcı arama ve kişi sayfası](../yonetim/kullanici-arama.md) — tasarımda "Yazdığı yorumlar".
- [İşlem kaydı sayfası](../islem-kaydi/islem-kaydi-sayfasi.md) ve [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).
- [Site yedekleri](../yonetim/yedekler.md) — gizli işaretinin yedekte korunması.
- [Destek ekibi](../destek/destek-ekibi.md) — destek rolünün yapabildikleri.

## Kod tarafı

- Ön yüz (yalnız yönetim paketi): [public/js/yonetim/09-yonetici.md](../../public/js/yonetim/09-yonetici.md) — `SAYFALAR.yorumlar`
  (başlık, açıklama, boş kutu, satırlar, `.soluk-satir`), `EYLEMLER['yorum-gizle']` (`POST /api/yorumlar/gizle` → `git('yorumlar')`);
  menü satırı [public/js/yonetim/09a-yonetim-paneli.md](../../public/js/yonetim/09a-yonetim-paneli.md) (`{ k: 'yorumlar', ad: 'Yorumlar' }`).
  Yıldızlar `yildizCiz` ([public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md)), tarih `tarihSaat`
  ([public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md)).
- Sunucu: [sunucu/bolumler/yorum.md](../../sunucu/bolumler/yorum.md) — `GET /api/yorumlar/hepsi` (son değiştirilen 300, `id` ve
  `gizli` ile), `POST /api/yorumlar/gizle` (`{ id, gizli }`; `gizli` yalnız `true` gelirse gizler, başka her değer açar; yorum yoksa
  404 "Yorum bulunamadı"; işlem kaydı; önbelleği boşaltır). Bu iki yol [sunucu/api.md](../../sunucu/api.md)'deki `yoneticiUcuMu`
  listesindedir: yönetici olmayana bilinmeyen adresle aynı 404.
- Depo: [sunucu/veri/depo/yorumlar.md](../../sunucu/veri/depo/yorumlar.md) — `hepsi(300)`, `bul`, `gizle`; `yaz` gizliliğe dokunmaz.
  Yedek: [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md).
- İşlem kaydı adları: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) (`yorum.gizlendi`, `yorum.acildi`).
- Testler: [testler/test-yorum-ek.md](../../testler/test-yorum-ek.md) (yönetici gizler, gizlenen yorum açılışta yok, öğretmen gizleme
  ucunda 404), [testler/test-admin-gizli.md](../../testler/test-admin-gizli.md) (`yorumlar/hepsi` ve `yorumlar/gizle` yönetici
  olmayana bilinmeyen adresle aynı 404; herkese giden uygulama dosyasında bu adlar yok).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Yönetim paneli" ve "Yorumlar").

## Sık sorulanlar

- **Gizlediğim yorumu nasıl geri getiririm?** Aynı satırdaki "Göster" ile.
- **Yorumu tamamen silebilir miyim?** Bugün hayır; yalnız yazarı siler (ya da hesabı silinince gider).
- **Yorumu kimin yazdığını nasıl bulurum?** Bugünkü ekranda bulamazsın. Tasarımda kişi sayfasında "Yazdığı yorumlar" kartı var.
- **Gizlediğim yorum yeniden çıktı.** Yazarı silip yeniden yazmış olabilir; yeni yorum gizli başlamaz. Yeniden gizle.

## Sırada

- Paneller: yönetim `/panel/admin`'e taşınacak, "Yorumlar" orada bir bölüm olacak; `/admin` bilinmeyen adres olacak.
- Kullanıcı arama: kişi sayfasında yazdığı yorumlar (gizli mi, yıldız, metin, tarih) ve yöneticinin oradan gizleyip açması.
- Silinip yeniden yazılan yorumun gizliliği ve yöneticinin silme hakkı: planlı bir işte yok (bilinen açık).
