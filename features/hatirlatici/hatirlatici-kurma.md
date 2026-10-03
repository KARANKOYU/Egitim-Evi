# Hatırlatıcılar · Hatırlatıcı kurma, düzenleme ve silme

**Durum:** Kodda var; tasarımda ek olarak tek pencere ("Hatırlatıcı ekle" ve satıra basınca açılan "Hatırlatıcı"), açıklamanın ortak
yazı düzenleyiciyle yazılması, "Telefona bildirim" anahtarı, pencerede canlı "Sıradaki hatırlatma" satırı, silmenin pencerenin
içinden onay kutusuyla yapılması ve yeni hatırlatıcıda varsayılanın "Bir kez · bugün · 19:00" olması.

Başlık, isteğe bağlı açıklama, sıklık ve saatle kendine yeni bir hatırlatıcı kurmak; kurduğunu değiştirmek ya da silmek.

## Ne işe yarar

Unutmak istemediğin bir şeyi zamanında önüne getirmek: öğrenci "her pazartesi spor çantası", veli "ayın 1'i servis ücreti",
öğretmen "pazartesi 18:00 8-B yazılı kâğıtlarını oku", müdür "pazartesi 09:00 il millî eğitim raporu", servisçi "15 Ekim araç
muayenesi". Kullanıcının isteği (26 Eylül): öğrenci kendine kurabilsin, öğretmen ve müdür de; "bir başlığı bir açıklaması olcak"
ve sıklığı seçilebilsin.

## Nereden açılır

- **Hatırlatıcılar** sayfası ([Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md)):
  - üstteki kartın sağında **"Yeni hatırlatıcı"** → pencere **"Yeni hatırlatıcı"**;
  - satırdaki **"Düzenle"** → pencere **"Hatırlatıcıyı düzenle"**;
  - satırdaki kırmızı **"Sil"**.
- **Tasarımda** (Tasarım 1 önizlemesi): başlığın altında sağdaki **"Hatırlatıcı ekle"** → pencere **"Hatırlatıcı ekle"**; listede,
  takvimde ya da ajandada bir hatırlatıcı satırına basınca → pencere **"Hatırlatıcı"** (düzenleme ve "Sil" burada)
  ([Takvimde ve ajandada](takvimde-ve-ajandada.md)).

## Adım adım

### Yeni hatırlatıcı kur (herkes, bugünkü site)

1. **"Yeni hatırlatıcı"**ya bas. Ortada **"Yeni hatırlatıcı"** penceresi açılır; imleç "Başlık"ta.
2. **"Başlık"** — zorunlu, en çok 120 harf; kutuda silik "ör. Beden eğitimi kıyafeti".
3. **"Açıklama (isteğe bağlı)"** — iki satırlık kutu, en çok 1000 harf. Düz metin.
4. **"Ne sıklıkla?"** — dört düğme: **"Bir kez"** · **"Her gün"** · **"Her hafta"** · **"Her ay"**. Yeni pencerede "Her hafta"
   seçili gelir. Seçtiğine göre altında yalnız bir alan görünür:
   - "Bir kez" → **"Gün"** (takvim kutusu; bugünden önceki günler seçilemez; bugün gelir);
   - "Her gün" → ek alan yok;
   - "Her hafta" → **"Hangi günler?"**: "Pzt" "Sal" "Çar" "Per" "Cum" "Cmt" "Paz" kutucukları (birden çok seçilir; yeni pencerede
     "Pzt" işaretli);
   - "Her ay" → **"Ayın kaçı?"**: 1–31 listesi (yeni pencerede 1) ve altında küçük yazı "Ay o kadar çekmiyorsa ayın son günü
     hatırlatılır."
   Ayrıntı: [Sıklık](siklik.md).
5. **"Saat"** — saat kutusu; yeni pencerede 08:00. Saat Türkiye saatidir.
6. **"Kaydet"**e bas. Düğme **"Kaydediliyor..."** olur.
   - Bir şey eksik ya da yanlışsa pencerenin altında kırmızı ileti çıkar, pencere açık kalır (iletiler aşağıda "Kurallar ve
     sınırlar"da).
   - **"Vazgeç"** pencereyi kapatır, hiçbir şey kaydedilmez.
7. Olunca pencere kapanır, liste yeniden çizilir ve sayfanın üstünde yeşil ileti: **"Hatırlatıcı kuruldu. İlk hatırlatma:
   06.10.2026 08:00."** Yeni hatırlatıcı listenin en altındadır.

### Düzenle (herkes, bugünkü site)

1. Satırdaki **"Düzenle"**ye bas. **"Hatırlatıcıyı düzenle"** penceresi bütün alanları dolu açılır.
2. İstediğini değiştir, **"Kaydet"**. İleti: **"Kaydedildi. İlk hatırlatma: 07.10.2026 07:30."**
3. Bil ki kaydetmek hatırlatıcıyı **baştan başlatır**:
   - **durdurduğun** bir hatırlatıcı yeniden açılır (pencere bunu söylemez; açılmasın istiyorsan kaydettikten sonra yeniden
     "Durdur"a bas — [Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md));
   - **"Hatırlatıldı"** olmuş bir kezlik hatırlatıcıya ileri bir gün verirsen yeniden kurulmuş olur;
   - sayım şimdiden başlar: yeni saat bugün geçmişse ilk hatırlatma bir sonraki uygun günde gelir, geçmiş bir an için hemen
     bildirim gelmez;
   - hatırlatıcı listenin en altına geçer.
4. Sıklığı değiştirince eski sıklığın alanları gizlenir ama değerleri pencerede kalır (ör. "Her hafta"dan "Her ay"a geçince gün
   kutucukları işaretli kalır); yalnız seçili sıklığın alanı kullanılır, öbürleri yok sayılır.
5. Günü geçmiş bir kezlik hatırlatıcıyı açtığında "Gün" kutusunda eski tarih durur; ileri bir gün seçmeden kaydedersen "Bu gün ve
   saat geçti; ileri bir zaman seç." çıkar.

### Sil (herkes, bugünkü site)

1. Satırdaki kırmızı **"Sil"**e bas. Tarayıcının kendi onay kutusu: **"Hatırlatıcı silinsin mi?"**
2. Onaylarsan satır kalkar, liste yeniden çizilir; ayrı bir ileti çıkmaz. Silme kalıcıdır, geri alınamaz.
3. Olmazsa (ör. saatte 120'den fazla değişiklik yaptın) ileti tarayıcının uyarı kutusunda çıkar ve düğme yeniden açılır.

### Öğrenci

Yukarıdaki adımların aynısı. Kurduğun hatırlatma yalnız sana gelir, velisine kopyası gitmez
([Hatırlatma bildirimi](hatirlatma-bildirimi.md)). Ödevler için ayrıca kendiliğinden gelen "yarın ödevin var" bildirimi vardır;
onun için hatırlatıcı kurmana gerek yok ([Ödev hatırlatmaları](../odev/hatirlatmalar.md)).

### Veli

Aynı adımlar. Kurduğun hatırlatıcı veli portalının (yetişkin hesabının) listesine girer; çocuğunun hesabına bir şey yazılmaz.
Tasarımda her çocuk ayrı oturumdur ve hatırlatıcıyı o an açık olan çocuğun oturumunda kurarsın
([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Öğretmen ve çalışan

Aynı adımlar; hatırlatıcı bulunduğun okul portalının listesine girer. Örnek: "8-B yazılı kâğıtlarını oku", "Zümre toplantısı"
(Tasarım 1 önizlemesindeki örnekler). Toplantının kendi hatırlatması ayrıca gelir ([Toplantı hatırlatması](../toplanti/hatirlatma-ve-silinme.md)).

### Müdür

Aynı adımlar; müdür portalının listesine girer. Bütün okula hatırlatma göndermek istiyorsan bu sayfa değil, duyurudaki
"Hatırlatıcı kur" kullanılır (tasarım: [Mesajdan ajandaya ve hatırlatıcıya ekleme](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md)).

### Servisçi

Aynı adımlar. Örnek: "Araç muayenesi", açıklama "Ruhsat ve sigorta belgelerini yanına al." (Tasarım 1 önizlemesindeki örnek).

### Yönetici

Yönetim panelinde (`/admin`) aynı pencere ve aynı kurallar.

### Tasarımda (Tasarım 1 önizlemesi)

1. **"Hatırlatıcı ekle"**ye bas → pencere **"Hatırlatıcı ekle"**:
   - **"Başlık:"** — en çok 120 harf; silik "ör. Kütüphane kitabını geri ver";
   - **"Açıklama:"** — ortak yazı düzenleyici (kalın, italik, liste, bağlantı…) ([Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md));
   - **"Sıklık:"** çipleri **"Bir kez"** · **"Her gün"** · **"Haftanın günleri"** · **"Ayda bir"** ve seçime göre altında alanlar
     ([Sıklık](siklik.md)); yeni hatırlatıcıda "Bir kez", bugünün tarihi ve 19:00 gelir;
   - **"Telefona bildirim"** anahtarı, açık gelir ([Hatırlatma bildirimi](hatirlatma-bildirimi.md));
   - canlı satır: **"Sıradaki hatırlatma: 1 Ekim 2026 Perşembe 19:00"** (önizlemenin "şimdi"si 1 Ekim 2026 10:34; varsayılan
     ayarla); ayar eksikse **"Bu ayarla gelecek bir hatırlatma yok."**;
   - altta **"Vazgeç"** · **"Ekle"**.
2. Hatalar pencerenin altında kırmızı; ilk dördünde imleç ilgili alana gider:
   - **"Başlığı yaz: neyi hatırlatalım?"**
   - **"Saati seç."**
   - **"Takvimden bir gün seç."** (Bir kez)
   - **"Geçmiş bir zaman seçtin; bugün 10:12'ten sonrasını ya da ileri bir günü seç."** (saat yerine o anki saat yazar)
   - **"Haftanın en az bir gününü seç."**
   - **"En çok 50 hatırlatıcın olabilir; yenisi için birini sil."** (yalnız yeni eklerken)
3. Olunca pencere kapanır, kısa ileti: **"Hatırlatıcı eklendi: 1 Ekim Perşembe 19:00."** (her gün: "her gün 19:00"; haftalık: "her
   Pazartesi, Çarşamba 07:30"; aylık: "her ayın 5'i · 09:00").
4. **Düzenleme:** listede, takvimde ya da ajandada satıra bas → pencere **"Hatırlatıcı"**: aynı alanlar, ayrıca **"Hatırlatıcı
   açık"** anahtarı ([Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md)); altta solda **"Sil"**, sağda **"Vazgeç"** ·
   **"Kaydet"**. İleti: **"Hatırlatıcı kaydedildi: her Salı 07:30."**
5. **Silme:** pencerede **"Sil"** → küçük onay kutusu: **"“Kütüphane kitabını iade et” silinsin mi?"** — **"Hatırlatıcı takvimden ve
   ajandadan da kalkar."** — **"Vazgeç"** / **"Sil"**. Sonra kısa ileti **"Hatırlatıcı silindi."**
6. Öğrenci ve velinin ödev hatırlatma kuralları bu pencereyle değil, ödevin **"Hatırlat"** penceresiyle ve Hesap ayarlarıyla kurulur
   ([Ödev hatırlatmaları](../odev/hatirlatmalar.md)); duyurudan gelen hatırlatıcıları da sen kurmazsın
   ([Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md)).

## Kurallar ve sınırlar

- **Kim:** giriş yapmış ve hesabı onaylı herkes: öğrenci, veli, öğretmen, çalışan, müdür, servisçi, henüz okula bağlı olmayan
  yetişkin ve sistem yöneticisi. Rol ya da yetki gerekmez; okul kapatamaz.
- **Yalnız sahibi** düzenler, durdurur, siler. Başkasının (öğretmenin bile) hatırlatıcısına dokunulamaz: sunucu **"Hatırlatıcı
  bulunamadı"** der ve hatırlatıcının var olup olmadığı bile belli olmaz ([Kimler görür ve saklama](kimler-gorur-ve-saklama.md)).
- **Sınırlar:**

  | Ne | Sınır |
  |---|---|
  | Başlık | zorunlu, en çok 120 harf (kutu fazlasını yazdırmaz) |
  | Açıklama | isteğe bağlı, en çok 1000 harf |
  | Kişi başına hatırlatıcı | en çok 50 (durdurulmuşlar ve "Hatırlatıldı" olanlar dahil) |
  | Değişiklik hızı | saatte en çok 120 istek (kurma, düzenleme, durdurma/başlatma, silme; başarısızlar da sayılır; listeyi açmak sayılmaz) |

- **Hata iletileri** (aynen; hepsi pencerenin altında, silmedekiler uyarı kutusunda):

  | Durum | İleti |
  |---|---|
  | Başlık boş | "Başlık yaz." (tarayıcı da sunucuya sormadan söyler) |
  | Haftalıkta hiç gün seçilmedi | "Haftanın en az bir gününü seç." (tarayıcı da söyler) |
  | Sıklık seçilmedi ya da tanınmıyor | "Ne sıklıkla hatırlatılacağını seç." |
  | Saat boş ya da bozuk | "Saati seç (ör. 08:30)." |
  | Bir kezde gün yok ya da bozuk | "Günü seç." |
  | Bir kezde gün ve saat geçmiş | "Bu gün ve saat geçti; ileri bir zaman seç." |
  | Ayda birde gün 1–31 dışında | "Ayın kaçında hatırlatılacağını seç (1-31)." |
  | 50'yi doldurdun (yalnız yeni kurarken) | "En fazla 50 hatırlatıcı kurabilirsin; kullanmadığını sil." |
  | Saatte 120'den fazla değişiklik | "Çok sık değiştirdin. Biraz sonra dene." |
  | Hatırlatıcı yok, silinmiş ya da başkasının | "Hatırlatıcı bulunamadı" |

- **Denetim sunucuda:** tarayıcı yalnız başlığa ve haftalık güne bakar; geçmiş gün, saat biçimi ve ay günü sınırını sunucu söyler.
  "Bugün" ve "geçti" Türkiye saatine göredir; takvim kutusundaki en erken gün ise cihazının tarihine göre hesaplanır.
- **Düzenleme baştan başlatır:** düzenlenen hatırlatıcı açılır, "son gönderim" silinir, sayım o an başlar (yukarıda "Düzenle" 3).
- **Silme kalıcıdır**; çöp kutusu yok.
- **Tasarımda:** duyurudan gelen hatırlatıcılar 50 sınırına sayılmaz (ayrı tür)
  ([Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md) · [Sıklık](siklik.md) ·
[Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md) · [Hatırlatma bildirimi](hatirlatma-bildirimi.md) ·
[Takvimde ve ajandada](takvimde-ve-ajandada.md) · [Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md) ·
[Kimler görür ve saklama](kimler-gorur-ve-saklama.md).

**İlgili:** [Ödev hatırlatmaları](../odev/hatirlatmalar.md) · [Mesajdan ajandaya ve hatırlatıcıya ekleme](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md) ·
[Toplantı hatırlatması](../toplanti/hatirlatma-ve-silinme.md) · [Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md) ·
[Ajanda](../takvim/ajanda.md) · [Bildirim paneli](../bildirim/bildirim-paneli.md) · [Telefon bildirimi](../bildirim/telefon-bildirimi.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19h-hatirlaticilar.md](../../public/js/parcalar/19h-hatirlaticilar.md) — `hatirlaticiPenceresi`
  (alanlar, varsayılanlar "her hafta · Pzt · 08:00 · ayın 1'i", sıklığa göre gösterilen alan), eylemler `hatirlatici-yeni`,
  `hatirlatici-duzenle`, `hatirlatici-kaydet` (iki tarayıcı denetimi, "İlk hatırlatma: …"), `hatirlatici-sil` (`confirm`);
  pencere ve iletiler [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md); uyarı kutusu `hataGoster`
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md).
- Sunucu: [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md) — `dogrula` (bütün iletiler), `POST
  /api/hatirlaticilar` (50 sınırı, "Hatırlatıcı kuruldu."), `POST /api/hatirlaticilar/<id>` ("Kaydedildi."), `POST
  /api/hatirlaticilar/<id>/sil` ("Silindi."), saatte 120 hız sınırı, sahiplik (404); saat ve tarih çözümü
  [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`saatDuzelt`) ve [sunucu/ortak.md](../../sunucu/ortak.md) (`tarihCoz`, `clean`).
- Veri: [sunucu/veri/depo/hatirlaticilar.md](../../sunucu/veri/depo/hatirlaticilar.md) — `ekle`, `guncelle` (açar, son gönderimi
  siler, kuruluş anını yeniler), `sil`; tablolar `hatirlaticilar` ve `hatirlatici_gunleri`
  ([sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md), şema 024).
- Testler: [testler/test-hatirlatici.md](../../testler/test-hatirlatici.md) (kurma, denetimler, sahiplik, düzenle, sil, 50 sınırı),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Tasarımdaki pencere bugün yalnız Tasarım 1 önizlemesinde; kodlanınca Durum satırı ve bu bölüm güncellenir.

## Sık sorulanlar

- **Hatırlatıcı nasıl kurulur?** (açılış sayfasındaki SSS) Hatırlatıcılar sayfasında "Yeni hatırlatıcı": başlık, açıklama, sıklık
  ve saat; zamanı gelince bildirim gelir; hatırlatıcını yalnız sen görürsün ([Sık sorulan sorular](../acilis-sayfasi/sss.md)).
- **Durdurduğum hatırlatıcının başlığını düzelttim, yeniden çalmaya başladı.** Düzenleyip kaydetmek hatırlatıcıyı açar; kaydettikten
  sonra yeniden "Durdur"a bas.
- **Geçmiş bir tarihe hatırlatıcı kurabilir miyim?** Hayır: "Bu gün ve saat geçti; ileri bir zaman seç."
- **Sildiğim hatırlatıcıyı geri getirebilir miyim?** Hayır; yeniden kurman gerekir.
- **Açıklamaya kalın yazı ya da bağlantı koyabilir miyim?** Bugün açıklama düz metindir; tasarımda yazı düzenleyiciyle yazılır.
- **Kaç hatırlatıcı kurabilirim?** En çok 50; durdurulmuşlar da sayılır.

## Sırada

- Arayüz önizlemesi (Tasarım 1): tek "Hatırlatıcı" penceresi, yazı düzenleyicili açıklama, "Telefona bildirim" anahtarı, canlı
  "Sıradaki hatırlatma" satırı, pencereden silme.
- Düzenleyiciler (ortak yazı editörü): hatırlatıcının açıklaması düzenleyiciye geçer.
- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: duyurudan
  gelen hatırlatıcılar (50'ye sayılmaz).
- Android yerel uygulama (bütün roller): uygulamada hatırlatıcı ekleme ve düzenleme.
- Kullanıcı arama … Verilerimi indir: hatırlatıcılar indirilen veriye girer.
