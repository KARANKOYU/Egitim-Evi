# Ödevler · Açıldı / açılmadı bilgisi

**Durum:** Kodda var; tasarımda ek olarak listede ayrı bir "Açılma" süzgeci (Açıldı / Açılmadı) olur (kullanıcı 2 Ekim; Tasarım 1 önizlemesi).

Öğrencinin bir ödevi ilk kez ne zaman açtığının kaydedilmesi: öğretmen her öğrencinin altında "Ödev 20.05.2026 16:20 tarihinde açıldı" ya da "Ödev açılmadı" görür, öğrencinin ve velinin listesinde açılmamış ödev turuncu durur.

## Ne işe yarar

Kullanıcı 25 Eylül'de istedi: "ödevlerde açılmamışsa turuncumsu böyle olacak ve öğretmen ödevi kontrol ederken altta ödev
… (örnek: 20.05.2026 16.20) tarihinde açıldı veya ödev açılmadı yazacak". 26 Eylül'de quiz için de "ödevde öğrenci açmış mı
bakabilir" dedi. Öğretmen "ödevi görmedim" itirazını tarihle cevaplar; öğrenci ve veli de gözden kaçan ödevi turuncu satırdan
fark eder.

## Nereden açılır

- **Öğrenci:** "Ödevler" listesi ve ana sayfadaki "Yaklaşan ödevler"; ödevin satırına basmak ödevi "açılmış" yapar.
- **Öğretmen:** ödev listesinde "24 öğrenciden 9 kişi açtı"; kontrol ekranının bilgi satırında "9 kişi açtı" ve her
  öğrencinin altında tarih ([Sonuçlandırma](sonuclandirma.md)).
- **Veli:** "Ödevler" listesinde turuncu satır.

## Adım adım

### Öğrenci

1. Sana yeni gelen ödev listende **turuncu zeminli**, adının önünde turuncu nokta ile durur; üzerine gelince **"Henüz
   açılmadı"** yazar.
2. Satıra bastığında ödevin penceresi açılır ve o an sunucuya "açıldı" bildirilir; satır normal rengine döner.
3. İlk açılış anı kaydedilir ve **bir daha değişmez** (ödevi on kez açsan da öğretmen ilk açtığın anı görür).
4. Ödevin quizini başlatmak da ödevi "açılmış" sayar.
5. Süzgeçte **"Durum" → "Açılmamış"** henüz açmadığın aktif ödevleri gösterir ([Süzgeçler](suzgecler.md)).

### Veli

- Çocuğunun açmadığı aktif ödev senin listende de turuncu; üzerine gelince **"Çocuğun bu ödevi henüz açmadı"**.
- Sen ödevi açınca (kendi listende ya da çocuğun portalında) "açıldı" **sayılmaz**; yalnız çocuğun kendisi açınca sayılır.

### Öğretmen

1. "Ödevler" listesinde aktif ödevin altında **"24 öğrenciden 9 kişi açtı"**; herkes açmadıysa yazı turuncu.
2. Ödevin kontrol ekranında üst bilgi satırında **"… · 24 öğrenci · 9 kişi açtı · …"**.
3. Her öğrencinin adının altında:
   - **"Ödev 20.05.2026 16:20 tarihinde açıldı"** (gri), ya da
   - **"Ödev açılmadı"** (turuncu).
4. Ekran açıldığı anın bilgisini gösterir; bu arada açan öğrenciyi görmek için ekranı yeniden aç.

### Müdür

Öğrencinin portalından ödevi açmak "açıldı" saymaz. Öğretmeni okuldan ayrılmış (sahipsiz) bir ödevin kontrol ekranını
açtığında açılma bilgilerini öğretmen gibi görür ([Müdürün ödev görünümü](mudurun-odev-gorunumu.md)).

### Tasarımda (Tasarım 1 önizlemesi)

- Kontrol ekranında tarih kullanıcının örneğindeki gibi saat noktayla yazılır: **"Ödev 20.05.2026 16.20 tarihinde açıldı"**;
  açılmamışta **"Ödev açılmadı"**.
- Öğrencinin ve velinin listesinde açılmamış satır turuncumsu zeminli, adı kalın ve önünde turuncu nokta.
- Ayrı bir **"Açılma"** süzgeci: "Hepsi", "Açıldı", "Açılmadı" ([Süzgeçler](suzgecler.md)).
- Kontrol ekranının bilgi satırında **"28 öğrenci · 25 kişi açtı"**.

## Kurallar ve sınırlar

- **Yalnız öğrencinin kendisi** "açıldı" yazdırır; sunucu öğrenci olmayanın isteğini bu kural için kabul etmez. Ödev o
  öğrenciye verilmemişse **"Ödev bulunamadı"**.
- **İlk açılış kalıcıdır;** sonradan değişmez, silinmez (ödev silinince ödevle birlikte gider).
- **Turuncu yalnız aktif ödevde.** Sonuçlanmış ödev açılmamış olsa da turuncu görünmez; "Açılmamış" süzgeci de yalnız aktif
  ödevleri sayar.
- **Bildirim yok.** Açılma kimseye bildirim göndermez; öğretmen ekrandan görür.
- **Saat** sunucunun kaydettiği andır; ekranda senin cihazının saat dilimine göre yazılır.
- **Bilinen açık:** öğrencinin ana sayfasındaki "Yaklaşan ödevler" satırları, o oturumda "Ödevler" sayfası hiç açılmadıysa
  basınca pencere açmaz; bu yüzden ana sayfadan açmaya çalışmak "açıldı" yazdırmayabilir ([Ödev listesi](liste.md)).
- **İşaretlenemezse** (bağlantı koptu) hata gösterilmez; bir sonraki açılışta yeniden denenir.

## Kardeşler ve ilgili

**Kardeşler:** [Ödev listesi](liste.md) · [Ödevin penceresi](odev-penceresi.md) · [Süzgeçler](suzgecler.md) ·
[Sonuçlandırma](sonuclandirma.md) · [Teslimleri inceleme](teslimleri-inceleme.md).

**İlgili:** [Quiz çözme](../quiz/quiz-cozme.md) (quizi başlatmak da açılma sayar),
[Öğrencinin cevapları](../quiz/ogrencinin-cevaplari.md), [Velinin ana sayfası](../ana-sayfa/veli-ana-sayfasi.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) — `odevListesiOgrenci`
  (turuncu satır, "Henüz açılmadı"), `EYLEMLER['odev-oku']` (`POST /api/assignments/<id>/acildi`, yalnız öğrencinin kendisi);
  [27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) ("Çocuğun bu ödevi henüz açmadı");
  [11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) (`odevListesiOgretmen`: "N öğrenciden M kişi açtı";
  `odevAc`: "Ödev … tarihinde açıldı" / "Ödev açılmadı", `tarihSaat`).
- Sunucu: [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) — `POST /api/assignments/<id>/acildi`; öğretmen listesinde
  `acilan`, ayrıntıda `students[].acilma`; [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (`acildi`);
  [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (quiz başlayınca `acildi`).
- Depo: [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) — `acildi` (`odev_ogrencileri.acilma`, yalnız boşsa
  yazılır).
- Görünüm: `public/css/parcalar/25-grafik-sinav.css` (`.satir.acilmadi`, `.acilma-yazi.acilmadi`).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md) (6. bölüm: öğrencinin açması, öğretmenin görmesi, ilk açılışın
  değişmemesi).

## Sık sorulanlar

- **Ödevi açtım ama öğretmen "açılmadı" görüyor.** Ödevi listedeki satırından açtığından emin ol; öğretmen ekranı yenilemeden
  yeni bilgiyi görmez.
- **Velim ödevi açınca benim yerime "açıldı" olur mu?** Hayır.
- **Açılma tarihi sonradan değişir mi?** Hayır; ilk açılış kalır.

## Sırada

- Ödev listesi düzeni: "Açılma" ayrı bir süzgeç olacak.
