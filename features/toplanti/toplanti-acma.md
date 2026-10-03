# Toplantılar · Toplantı açma

**Durum:** Tasarlandı — henüz kodda yok

Müdürün ya da "Toplantı açar" yetkisi olan öğretmen ve çalışanın "Toplantı aç" penceresi: başlık, davetliler, tarih, saat,
katılım yolu (yüz yüze, bağlantıyla, ikisi birden), yer, bağlantı, açıklama ve hatırlatma.

## Ne işe yarar

Veli toplantısı, öğretmenler kurulu, zümre toplantısı, seminer gibi toplantıları önceden duyurmak ve zamanı gelince davetlileri
tek düğmeyle (Katıl) toplantıya götürmek için. Toplantı açılınca davetlilerin [Toplantılar listesi](toplantilar.md)ne,
takvimine ve ajandasına girer; hatırlatma bildirimleri kendiliğinden gider. Kullanıcının 3 Ekim kararıyla bağlantılı
toplantılarda varsayılan ve önerilen platform Google Meet; Zoom (ve Teams) isteğe bağlı.

## Nereden açılır

- **Sol menü → "Toplantılar" → başlığın altındaki artı simgeli "Toplantı aç"** (yalnız yetkisi olanlarda görünür).
- Bir toplantının penceresindeki **"Düzenle"** aynı pencereyi açar ([Toplantı penceresi](toplanti-penceresi.md)).

## Adım adım

### Müdür

Pencerenin başlığı **"Toplantı aç"**. Alanlar yukarıdan aşağı:

| Alan | Türü | Ayrıntı |
|---|---|---|
| **"Başlık:"** | yazı kutusu, yer tutucu "ör. 7-A veli toplantısı" | en çok 100 karakter |
| **"Davetliler:"** | alıcı seçici (mesajlardakiyle aynı) | türler: "Öğretmenler", "Sınıflar", "Veliler", "Öğrenciler", "Yönetim"; arama kutusu |
| **"Tarih:"** | tarih seçici | bugünden önce seçilemez |
| **"Saat:"** | iki saat kutusu: "Başlangıç" – "Bitiş" | önizlemede 15:30 – 16:30 dolu gelir |
| **"Katılım:"** | üç seçenekli düğme grubu | **"Yüz yüze"** (varsayılan), **"Bağlantıyla"**, **"İkisi birden"** |
| **"Yer:"** | yazı kutusu, yer tutucu "ör. Konferans salonu" | "Yüz yüze" ve "İkisi birden"de görünür |
| **"Bağlantı:"** | yazı kutusu, yer tutucu "https://meet.google.com/… ya da Zoom bağlantısı" | "Bağlantıyla" ve "İkisi birden"de görünür |
| **"Açıklama:"** | ortak yazı düzenleyici | isteğe bağlı |
| **"1 gün önce ve 15 dakika önce hatırlat"** | onay kutusu | işaretli gelir |

Altta **"Vazgeç"** ve kamera simgeli **"Toplantıyı aç"**.

**Davetliler seçicisi** (müdürde): üstte seçtiklerin kapsül kapsül durur (birden çok kişiyse yanında "`<n>` kişi", sağında ×
ile çıkarılır) ve arama kutusu ("Kişi, sınıf ya da grup ara"; bir şey seçtikten sonra "Bir alıcı daha ara"). Altında tür
düğmeleri ve seçilen türün listesi:

- "Öğretmenler": en başta "Bütün öğretmenler" (ör. 28 kişi), sonra öğretmenler tek tek (ad · branş).
- "Sınıflar": okulun bütün sınıfları, "`<sınıf>` öğrencileri" (öğrenci sayısıyla).
- "Veliler": en başta "Bütün veliler", sonra "`<sınıf>` velileri".
- "Öğrenciler": öğrenciler tek tek (ad · sınıf).
- "Yönetim": müdür ve müdür yardımcıları.

Aradığın bulunamazsa listede ""`<aranan>`" bulunamadı." yazar. Listenin altında özet: hiç seçmediysen "Henüz alıcı seçmedin".
(Önizlemede özet mesajlardaki kalıpla "Mesaj `<n>` kişiye gidecek" diyor; toplantıda "`<n>` kişi davet edilecek" gibi
toplantıya uygun bir metin olmalı.)

1. **"Başlık"**a toplantının adını yaz (ör. "Öğretmenler kurulu").
2. **"Davetliler"**den türe basıp seç ya da ara (ör. "Bütün öğretmenler"; veli toplantısında "7-A velileri").
3. **"Tarih"** ve **"Saat"**i seç (başlangıç ve bitiş).
4. **"Katılım"**:
   - **"Yüz yüze"** → **"Yer"**e salonu ya da sınıfı yaz. Veli toplantısı çoğunlukla böyledir.
   - **"Bağlantıyla"** → **"Bağlantı"**ya toplantının adresini yapıştır.
   - **"İkisi birden"** → hem yer hem bağlantı (ör. salona gelemeyen Zoom'dan katılır).
5. İstersen **"Açıklama"** yaz ([Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md)).
6. Hatırlatma istemiyorsan kutunun işaretini kaldır.
7. **"Toplantıyı aç"**a bas. Eksik ya da yanlış varsa formun altında kırmızı ileti çıkar, ilgili kutuya gidilir; denetim
   sırası ve iletiler:
   1. başlık boşsa: "Toplantının başlığını yaz."
   2. davetli seçilmediyse: "Davetlileri seç: yukarıdaki türlere bas ya da ara."
   3. tarih geçmişteyse: "Tarih bugünden önce olamaz."
   4. bitiş başlangıçtan önce ya da aynıysa: "Bitiş saati başlangıçtan sonra olmalı."
   5. yüz yüze ya da ikisi birden seçili ve yer boşsa: "Toplantının yapılacağı yeri yaz."
   6. bağlantıyla ya da ikisi birden seçili ve bağlantı `https://` ile başlayan tam adres değilse: "Bağlantıyı https:// ile
      başlayan tam adres olarak yapıştır."
8. Her şey tamamsa pencere kapanır, ekranın altında kısa ileti: "Toplantı açıldı; `<n>` davetlinin takvimine eklendi."
   Toplantı listede ve takvimde görünür; işlem kaydına "`<ad>` toplantı açtı" başlığıyla
   "`<başlık>` · `<tarih>` `<saat>` · `<n>` davetli" yazılır.

Bağlantının platformu adresten anlaşılır ve listede, pencerede adıyla yazar: adreste "zoom." varsa "Zoom", "meet.google" varsa
"Google Meet", "teams." varsa "Microsoft Teams", "jit.si" varsa "Jitsi"; hiçbiri değilse yalnız "Bağlantı".

**Tasarımda (3 Ekim kararları, önizlemede henüz yok):**

- "Bağlantıyla" seçilince **platform seçimi**: Google Meet (önerilen ve varsayılan) / Zoom / Teams.
- **"Kayıtlı bağlantılarımdan seç"**: elle yapıştırmak yerine [Görüşme bağlantıları](gorusme-baglantilari.md)ndan süzgeçli
  seçiciyle seçersin; seçicide "Toplantı" etiketi önceden seçili gelir. "Kullanımda" olan bir bağlantıyı seçersen onay
  sorulur ([Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md)).
- **"Meet'te yeni bağlantı al"**: Google Meet'i yeni sekmede açar; orada "Yeni → Sonraki bir toplantı için toplantı oluştur" ile
  alınan bağlantı yapıştırılır.
- Eski tanımda (29 Eylül) bağlantının alan adına göre simge, tanınmayan adreste uyarı yazıyordu; Görüşme bağlantıları
  yalnız Google Meet, Zoom ve Teams adresi kabul ediyor (Jitsi'nin kalıp kalmayacağı açık nokta).

### Öğretmen

Müdürle aynı pencere ve adımlar. Farkı davetliler seçicisinde:

- "Öğretmenler"de "Bütün öğretmenler" yok; öğretmenler tek tek.
- "Sınıflar" ve "Veliler"de yalnız **derse girdiğin sınıflar** (ör. "7-A öğrencileri", "8-B velileri"); "Bütün veliler" yok.
- "Öğrenciler" ve "Yönetim" var.

Tanım: öğretmen kendi sınıflarının velileri için toplantı açar; müdür okul geneli ve öğretmenler kurulu için. Tasarım 1'de
hazır "Öğretmen" rolünde "Toplantı açar" yetkisi vardır; müdür bu yetkiyi rolden kaldırırsa "Toplantı aç" düğmesi öğretmende
görünmez.

### Çalışan

Rolünde **"Toplantı açar"** yetkisi olan çalışan öğretmendeki gibi açar. Tasarım 1'deki hazır şablonlardan bu yetkiyi içerenler:
"Müdür yardımcısı", "Rehber öğretmen", "Zümre başkanı", "Sınıf öğretmeni" ([Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md)).
Davetliler seçicisindeki sınıflar rolün sınıf kapsamına göre daralır ("Kendi sınıfları" ya da seçili sınıflar —
[Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md)). Yetkisi yoksa düğme sende yok.

## Kurallar ve sınırlar

- **Kim açar:** müdür her zaman; "Toplantı açar" yetkisi olan rol sahibi (yetki listesinde "İletişim" grubunda,
  [Yetki listesi](../roller-yetkiler/yetki-listesi.md)). Öğrenci, veli, servisçi açamaz.
- **Zorunlu:** başlık, en az bir davetli, tarih, başlangıç ve bitiş saati; katılım yoluna göre yer ve/veya bağlantı.
- **Başlık:** en çok 100 karakter.
- **Tarih:** bugün ya da ileri bir gün. **Bitiş** başlangıçtan sonra olmalı.
- **Bağlantı:** `https://` ile başlayan tam adres; varsayılan ve önerilen Google Meet.
- **Hatırlatma:** kutu işaretliyse davetlilere 1 gün önce ve 15 dakika önce bildirim ([Hatırlatma ve silinme](hatirlatma-ve-silinme.md)).
- **Kendi görüntülü görüşmemiz yok:** tanıma göre Eğitim Evi kendi görüntülü görüşme sunucusunu kurmaz (sunucu, bant
  genişliği, bakım); Meet ve Zoom kullanılır.
- **Ücretsiz sınırlar (tanımdaki not):** Google Meet'in ücretsiz grup görüşmesi 60 dakika, Zoom'unki 40 dakika.
- **Açılınca:** davetlilerin takvimine ve ajandasına girer; açılış anında ayrıca "yeni toplantı" bildirimi gidip gitmeyeceği
  tanımda yazılı değil.
- **İşlem kaydı:** her açma kaydedilir (kim, başlık, tarih, saat, davetli sayısı).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Toplantılar ve uzaktan ders](README.md)):

- [Toplantılar listesi](toplantilar.md) — "Toplantı aç" düğmesinin yeri.
- [Toplantı penceresi](toplanti-penceresi.md) — "Düzenle" ve "İptal et".
- [Görüşme bağlantıları](gorusme-baglantilari.md), [Bağlantı seçici, Kullanımda/Boşta ve devretme](baglanti-secici-ve-devretme.md).
- [Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md), [Hatırlatma ve 1 hafta sonra silinme](hatirlatma-ve-silinme.md).

**İlgili:**

- [Yeni mesaj ve alıcı seçimi](../mesaj/yeni-mesaj.md) — davetliler seçicisi aynı seçicidir.
- [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md),
  [Özel roller](../roller-yetkiler/ozel-roller.md).
- [Ajanda](../takvim/ajanda.md), [Takvime ekle](../takvim/etkinlik-ekleme.md).
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).
- [Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Alıcı (hedef) çözme ve kime yazılabileceği: [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md),
  [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md).
- Yeni yetki `toplanti.ac` ("Toplantı açar"): [sunucu/yetki.md](../../sunucu/yetki.md),
  [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md).
- Takvime yazma: [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md); tarih seçici
  [public/js/parcalar/04e-tarih-secici.md](../../public/js/parcalar/04e-tarih-secici.md) (belge "Toplantılar"ı planlı işler
  arasında anıyor).
- İşlem kaydı: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md).
- Yeni tablolar: [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md).

## Sık sorulanlar

- **Bağlantıyı nereden alırım?** Google Meet'te "Yeni → Sonraki bir toplantı için toplantı oluştur"; çıkan adresi yapıştır. Bir
  kez alıp [Görüşme bağlantıları](gorusme-baglantilari.md)na kaydedersen her toplantıda oradan seçersin.
- **Zoom kullanabilir miyim?** Evet; Meet önerilir ama Zoom (ve Teams) bağlantısı da olur.
- **Veli toplantısını yüz yüze yapıyorum, salona gelemeyenler ne yapacak?** "İkisi birden"i seç: yer de bağlantı da yazılır,
  gelemeyen "Katıl" ile bağlantıdan girer.
- **Bütün velileri davet edebilir miyim?** Müdürsen "Veliler → Bütün veliler". Öğretmensen yalnız derse girdiğin sınıfların
  velileri.

## Sırada

- Toplantılar işi (iş 21): pencere bu belgeye göre kodlanacak; platform seçimi, "Kayıtlı bağlantılarımdan seç" ve "Meet'te yeni
  bağlantı al" önizlemeye md'ler bittikten sonra eklenecek.
- Özel roller işi (iş 24): "Toplantı açar" yetkisi ve hazır şablonlara eklenmesi (öneri, onay bekliyor).
- KVKK: kodlandığı işte aydınlatma metnine toplantı bağlantıları ve üçüncü taraf (Google, Zoom) yazılacak, sürüm artacak.
