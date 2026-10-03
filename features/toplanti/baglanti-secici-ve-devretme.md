# Toplantılar · Bağlantı seçici, Kullanımda/Boşta ve devretme

**Durum:** Tasarlandı — henüz kodda yok

Toplantı açarken ve tahtaya bağlantı verirken Görüşme bağlantıları süzgeçli bir seçiciyle seçilir; her bağlantının "Kullanımda"
ya da "Boşta" olduğu yazar; kullanımdaki bir bağlantı başka yere verilirse onay sorulur, önceki yer bağlantısız kalır ve sahibine
uyarı gider; zamanı gelince bağlantısı olmayan yerde "Bağlantı bulunamadı" çıkar.

## Ne işe yarar

Bir okulun elinde sınırlı sayıda kalıcı Meet odası olur (ör. "Konferans odası", "7-A tahtası"). Aynı oda aynı anda iki toplantıya
ya da bir toplantıyla bir sınıfın uzaktan dersine verilirse insanlar birbirinin toplantısına düşer. Kullanıcı 3 Ekim'de istedi:
bağlantının nerede kullanıldığı görünsün; başka yere verilirken "emin misin" sorulsun; önceki yer boşta kalsın ve sahibine sürekli
uyarı gitsin; zamanı gelince bağlantı yoksa "Bağlantı bulunamadı" desin. Kullanıcının sözüyle bu bölüm önizlemeye yapılmadı:
"bunu yazma, md'le; Linux'u bekliyorum, md'ler bitsin" — tanım burada, kodu Linux'ta yazılacak, önizlemeye md'ler bittikten
sonra eklenecek.

## Nereden açılır

- **Toplantı açarken:** "Toplantı aç" penceresinde "Bağlantıyla" ya da "İkisi birden" seçilince **"Kayıtlı bağlantılarımdan
  seç"** ([Toplantı açma](toplanti-acma.md)).
- **Tahtaya / sınıfa bağlarken:** sınıfın uzaktan ders bağlantısını seçerken ([Sınıfın uzaktan ders bağlantısı](uzaktan-ders-baglantisi.md)).
- **Durumlar:** Toplantılar sayfasındaki [Görüşme bağlantıları](gorusme-baglantilari.md) listesinde her satırda.

## Adım adım

### Öğretmen, müdür ve çalışan — seçicide bağlantı seçmek

Seçici Görüşme bağlantıları listesinin süzgeçlerini taşır: **arama**, **Hesap** ve **etiket**. Toplantı açarken **"Toplantı"**,
tahtaya bağlarken **"Tahta"** etiketi önceden seçili gelir (istersen kaldırırsın).

1. Seçiciyi aç; görebildiğin bağlantılar listelenir: kendi eklediklerin ve okula açık olanlar. Başkasının "Yalnız ben"
   bağlantısı seçicide **hiç görünmez**.
2. Her bağlantının yanında durumu yazar:
   - **"Boşta"** — hiçbir yerde kullanılmıyor;
   - **"Kullanımda"** — bir tahtaya (sınıfa) ya da yaklaşan bir toplantıya bağlı; **nerede** olduğu da yazar (yazılış biçimi
     tanımda yok; ör. toplantının adı ve günü ya da sınıfın adı).
3. **"Boşta"** bir bağlantıya bas: seçilir, hemen yeni yere geçer.
4. **"Kullanımda"** bir bağlantıya basarsan onay sorulur:

   > Bu bağlantı şu an `<yer>`'de kullanılıyor. Buraya verirsen `<yer>` bağlantısız (boşta) kalır. Emin misin?

   - **Evet** → bağlantı yeni yere geçer; önceki yer **bağlantısız** kalır.
   - Vazgeçersen hiçbir şey değişmez; başka bir bağlantı seç.

Onay penceresindeki düğmelerin adları tanımda yazılı değil ("Evet" ve "Vazgeç" beklenir).

### Toplantıyı açan ve müdür — bağlantısız kalan yerin sahibi

Bağlantısı başka yere verilen toplantının ya da tahtanın sahibi (toplantıyı açan; tahtada müdür) zamanı gelene kadar
**düzenli uyarı** alır:

- bildirim: **"`<toplantı>` toplantısının bağlantısı yok — yeni bağlantı seç"**;
- Toplantılar sayfasında o toplantının satırı **kırmızı** görünür.

1. Uyarıya ya da kırmızı satıra bas, toplantının penceresini aç.
2. "Düzenle" ile yeni bir bağlantı seç (seçicide yine Boşta/Kullanımda yazar).
3. Seçince toplantı yeniden bağlantılı olur; uyarıların durması ve satırın normale dönmesi beklenir (tanım uyarının "zamanı
   gelene kadar" süreceğini söyler, bağlantı seçilince durur).

### Davetliler ve öğrenciler — zamanı gelip kimse bağlantı seçmediyse

"Katıl"a (ya da sahip "Aç"a) basan **"Bağlantı bulunamadı"** iletisini görür. Sahibin ekranında iletinin yanında **"Bağlantı
seç"** düğmesi çıkar; basınca seçici açılır ve seçtiği bağlantı hemen kullanılır.

Uzaktan derste de aynı: sınıfın bağlantısı başka yere verildiyse ve yenisi seçilmediyse tahtadaki ya da öğretmenin
"Görüşme başlat"ında ve öğrencinin "Katıl"ında "Bağlantı bulunamadı" çıkar. Tahtanın sahibi tanımda müdürdür; tahta hesabının
kendisinin bağlantı seçip seçemeyeceği yazılı değil — tahta en az yetkiyle çalışır, yönetim işleri yapmaz
([Tahtanın gördükleri ve sınırları](../tahta/tahtanin-sinirlari.md)), bu yüzden "Bağlantı seç"in müdürde olması beklenir.

## Kurallar ve sınırlar

- **Kim devredebilir:** yalnız **senin eklediğin** ya da **okula açık** bağlantı devredilebilir. Başkasının "Yalnız ben"
  bağlantısı seçicide görünmez, devredilemez.
- **Bir bağlantı tek yerde:** devredilen bağlantı önceki yerden kalkar; aynı anda iki yerde kullanılmaz.
- **"Kullanımda"nın anlamı:** bir tahtaya (sınıfın uzaktan dersine) ya da **yaklaşan** bir toplantıya bağlı olmak. Bitmiş
  toplantıdaki bağlantı kullanımda sayılmaz.
- **Uyarı sıklığı:** "zamanı gelene kadar düzenli" — kaç saatte bir gideceği tanımda yazılı değil.
- **Zamanı gelince:** yeni bağlantı seçilmediyse "Bağlantı bulunamadı"; toplantı kendiliğinden iptal olmaz.
- **Silme ile farkı:** bir bağlantıyı listeden silmek onu kullanan toplantıları bağlantısız bırakmaz (önizlemedeki silme uyarısı:
  "o toplantılar bağlantısız kalmaz, ama listeden yeniden seçilemez"); bağlantısız kalma yalnız **devretmede** olur.
- **İşlem kaydı:** devretme (kim, hangi bağlantı, nereden nereye) kaydedilmeli; tanımda ayrıca yazılmadı.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Toplantılar ve uzaktan ders](README.md)):

- [Görüşme bağlantıları](gorusme-baglantilari.md) — seçicinin kaynağı, süzgeçler, Kullanımda/Boşta satırları.
- [Toplantı açma](toplanti-acma.md) — "Kayıtlı bağlantılarımdan seç".
- [Sınıfın uzaktan ders bağlantısı](uzaktan-ders-baglantisi.md) — tahtaya/sınıfa bağlama.
- [Katıl düğmesi](katil.md), [Aç düğmesi ve bekleme ekranı](ac-ve-bekleme.md) — "Bağlantı bulunamadı"nın çıktığı yer.
- [Hatırlatma ve 1 hafta sonra silinme](hatirlatma-ve-silinme.md) — bağlantısız toplantı uyarısı da bir bildirimdir.

**İlgili:**

- [Tahta hesabı](../tahta/README.md), [Tahta hesabı açma](../tahta/tahta-hesabi-acma.md).
- [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md).
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Bildirim: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md), [sunucu/push.md](../../sunucu/push.md); zamanlı
  yinelenen uyarı için [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md).
- İşlem kaydı: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md).
- Yeni tablolar (bağlantının bağlı olduğu yer): [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md).

## Sık sorulanlar

- **Bağlantımı başka toplantıya verdim, eski toplantım ne oldu?** Bağlantısız kaldı; sana uyarı gelir, Toplantılar'da satırı
  kırmızıdır. "Düzenle" ile yeni bağlantı seç.
- **Seçicide arkadaşımın bağlantısını göremiyorum.** "Yalnız ben" olarak eklemiş; yalnız kendisi görür. Ondan "Okuldaki herkes"e
  çevirmesini iste.
- **Zamanı geldi, "Bağlantı bulunamadı" diyor.** Toplantının sahibi yeni bağlantı seçmedi. Sahipsen yanındaki "Bağlantı seç"e
  bas.

## Sırada

- Toplantılar işi (iş 21, Linux'ta): seçici, Kullanımda/Boşta, devretme onayı, bağlantısız uyarısı ve "Bağlantı bulunamadı"
  kodlanacak; sonra Tasarım 1 önizlemesine eklenecek.
- Uyarı sıklığı ve onay düğmelerinin adları kararlaştırılacak.
