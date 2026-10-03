# Hatırlatıcılar · Takvimde ve ajandada hatırlatıcılar

**Durum:** Tasarlandı — henüz kodda yok (kullanıcının 27 Eylül ajanda isteği ve 1 Ekim takvim isteği; tanım "Ajanda" bölümü; Tasarım 1
önizlemesinde çalışır hâlde).

Açık hatırlatıcılarının Takvim sayfasında, ayın ilgili günlerinde, seçtiğin günün listesinde ve takvimin altındaki Ajanda'da
görünmesi.

## Ne işe yarar

Hatırlatıcıların ödevlerin, sınavların, toplantıların ve tatillerin yanında, aynı takvimde dursun; bir güne bakınca o gün ne olacağını
tek yerde gör. Kullanıcı 1 Ekim'de istedi: takvimde bir güne tıklanabilsin, seçili gün parlak çerçeveli olsun ve "altında o günü
şeyleri ödev hatırlatıcı toplantı gibi" görünsün. 27 Eylül'de de takvimin altında ajanda ve onay kutulu süzgeç istedi; tanımda
süzgeçlerden biri **"Hatırlatıcılarım"**.

## Nereden açılır

- Sol menüde **"Takvim"** (öğrenci, veli, öğretmen, çalışan, müdür, servisçi). Yöneticinin takvimi yoktur.
- Sayfada üstte ay görünümü, yanında (dar ekranda altında) seçili günün listesi, en altta **"Ajanda"**
  ([Ay görünümü](../takvim/ay-gorunumu.md), [Gün ayrıntısı](../takvim/gun-ayrintisi.md), [Ajanda](../takvim/ajanda.md)).
- Bugünkü sitede takvim hatırlatıcıları göstermez; hatırlatıcılar yalnız Hatırlatıcılar sayfasındadır
  ([Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md)).

## Adım adım

### Ay görünümü (tasarım, bütün takvimi olan roller)

1. **"Takvim"**i aç. Ay görünümünde açık hatırlatıcılarının **o aydaki her tekrarı** kendi gününde gri bir şerit olarak, başlığıyla
   görünür:
   - "Her gün" olan her günde;
   - "Haftanın günleri" olan seçili günlerde;
   - "Ayda bir" olan ayın o gününde (kısa ayda son gününde);
   - "Bir kez" olan tek gününde.
2. Bir gün kutusunda en çok iki kayıt yazar; fazlası **"+2 daha"** gibi gösterilir.
3. Kapalı (durdurulmuş) hatırlatıcı takvimde görünmez.
4. Üstteki **"«"** (Önceki yıl), **"‹"** (Önceki ay), **"›"** (Sonraki ay), **"»"** (Sonraki yıl) ile ileri gidince o ayların
   tekrarları da görünür.

### Seçili günün listesi

1. Bir güne bas: gün parlak çerçeveyle seçilir; listenin başlığında "1 Ekim 2026 Perşembe · bugün" ve sağda "3 kayıt".
2. **Öğrenci, veli ve öğretmende** önce ödevler gelir: **"Bugün yetişecek ödevler"** (başka günde "Bu gün yetişecek ödevler") ve
   **"Ertesi gün yetişecek · 2 Ekim Cuma"**; sonra **"Hatırlatıcı, toplantı ve öbürleri"** başlığı; hatırlatıcılar orada.
   **Müdür ve servisçide** ödev bölümü yok, liste doğrudan gelir.
3. Hatırlatıcı satırı: gri zil simgesi, başlık, altında **"Hatırlatıcı · 20:00 · bir kez"** (ya da "· her gün", "· her Salı",
   "· her ayın 5'i").
4. Satıra bas → **"Hatırlatıcı"** penceresi açılır: düzenle, kapat ("Hatırlatıcı açık"), sil
   ([Kurma, düzenleme ve silme](hatirlatici-kurma.md), [Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md)).
5. O günde hiçbir şey yoksa **"Bu günde bir şey yok."**; yalnız ödev varsa öbür bölümde **"Bu günde başka kayıt yok."**

### Ajanda

1. Takvimin altında **"Ajanda"**; başlığın sağında kaç kayıt olduğu.
2. Süzgeç kutucukları: **"Ödev"** · **"Sınav"** · **"Duyuru"** · **"Özel gün"** · **"Toplantı"** · **"Etkinlik"** ·
   **"Hatırlatıcılarım"** ("Ödev" yalnız ödevi olan rollerde: öğrenci, veli, öğretmen). Hepsi işaretli gelir.
3. Her açık hatırlatıcının **yalnız sıradaki zamanı** bir satırdır (tekrarların hepsi değil): gri zil, başlık,
   **"Hatırlatıcı · 07:30 · her Salı"** ve sağda kalan süre:
   - bugün ve bir saatten az kaldıysa **"20 dakika kaldı"**, daha çoksa **"3 saat kaldı"**;
   - yarınsa **"yarın 09:00"**;
   - daha ilerideyse **"2 gün kaldı"**.
4. Kayıtlar **"Bugün"**, **"Bu hafta"**, **"Sonra"** gruplarına ayrılır (her grubun yanında sayısı; boşsa "Bugün için kayıt yok."
   gibi). "Sonra"da ilk 12 satır görünür, altında **"5 kayıt daha göster"**. En altta katlanır **"Geçmiş · son 30 gün"** (bir
   hatırlatıcının yalnız sıradaki zamanı listelendiği için hatırlatıcılar buraya düşmez).
5. **"Hatırlatıcılarım"**ın işaretini kaldırınca hatırlatıcılar ajandadan gizlenir; seçimin bu tarayıcıda hatırlanır. Takvimin ay
   görünümü bu süzgeçten etkilenmez.
6. Satıra bas → **"Hatırlatıcı"** penceresi.

### Öğrenci

Ödevlerinle aynı takvimde. Önizlemedeki örnekler: 1 Ekim'de "Matematik quizi — Hatırlatıcı · 20:00 · bir kez", 2 Ekim'de
"Kütüphane kitabını iade et — Hatırlatıcı · 09:00 · bir kez"; kapalı olan "Spor kıyafeti" (her Salı) takvimde görünmez.

### Veli

Her çocuk ayrı oturumdur; takvimde ve ajandada o an açık olan çocuğun oturumunda kurduğun hatırlatıcılar görünür (ör. Can'ın
oturumunda "Can'ın yemek ücreti — her ayın 5'i") ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Öğretmen ve çalışan

Ödevler, sınavlar, toplantılar ve etütlerle birlikte; ör. "8-B yazılı kâğıtlarını oku", "Zümre toplantısı". Tanıma göre rolsüz
çalışanın da Takvim'i ve Hatırlatıcılar'ı var ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).

### Müdür

Okulun etkinlikleri, tatiller ve toplantılarla birlikte kendi hatırlatıcıları; ör. "İl millî eğitim raporu".

### Servisçi

Takvimde tatiller ve duyurularla birlikte; ör. "Araç muayenesi".

## Kurallar ve sınırlar

- **Yalnız senin hatırlatıcıların:** okulun takvimine girmez, kimse göremez; takvimin geri kalanını (ödev, sınav, tatil) okul belirler.
- **Yalnız açık olanlar:** durdurulmuş hatırlatıcı takvimde de ajandada da görünmez.
- **Takvimde her tekrar, ajandada yalnız sıradaki.**
- **Silince takvimden ve ajandadan da kalkar:** silme onayında bu yazar ("Hatırlatıcı takvimden ve ajandadan da kalkar.").
- **Süzgeç seçimi bu tarayıcıya özeldir;** başka cihazda yeniden seçersin.
- **Tanımdaki karar (Ajanda):** ajanda tek bir uçtan, sayfalı gelir; telefon uygulaması da aynı ucu kullanacak. Öğrenci
  kendisininkini, veli çocuğununkini, öğretmen derslerininkini ve okulun etkinliklerini, müdür okulunkini görür; okulun kapattığı
  bölümlerin kayıtları görünmez (Hatırlatıcılarım kapatılamaz).
- **Duyurudan gelen hatırlatıcılar** (tanım): ajandaya hatırlatma eklenen duyurunun kendisi bir **"Duyuru"** satırı olarak düşer ve
  "Duyuru" kutucuğuyla süzülür. Duyurudan gelen hatırlatıcı kaydının ajandada ayrıca "Hatırlatıcılarım" altında görünüp görünmeyeceği
  tanımlarda yazılı değil ([Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md) · [Kurma, düzenleme ve silme](hatirlatici-kurma.md) ·
[Sıklık](siklik.md) · [Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md) · [Hatırlatma bildirimi](hatirlatma-bildirimi.md) ·
[Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md) · [Kimler görür ve saklama](kimler-gorur-ve-saklama.md).

**İlgili:** [Ay görünümü](../takvim/ay-gorunumu.md) · [Gün ayrıntısı](../takvim/gun-ayrintisi.md) · [Ajanda](../takvim/ajanda.md) ·
[Tatiller ve özel günler](../takvim/tatiller-ve-ozel-gunler.md) · [Toplantılar listesi](../toplanti/toplantilar.md) ·
[Ödev listesi](../odev/liste.md) · [Mesajdan ajandaya ve hatırlatıcıya ekleme](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md).

## Kod tarafı

- Bugün kodda yok. Bugünkü takvim (ay görünümü: tatil, özel gün, etkinlik, ödev, sınav) hatırlatıcıları okumaz:
  [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md), [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md).
- Kodlanırken kullanılabilecek hesap: [sunucu/yardimci/hatirlatici-zaman.md](../../sunucu/yardimci/hatirlatici-zaman.md) (`gunUyar`:
  bir hatırlatıcı o gün çalar mı; `sonraki`: sıradaki an) ve kayıtlar [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md).
- Tanımdaki ajanda ucu (`/api/ajanda`) yapı belgesinde yazılacak; kodlanınca bu belgenin Durum satırı ve bu bölüm güncellenir.

## Sık sorulanlar

- **Durdurduğum hatırlatıcı takvimde neden yok?** Takvim ve ajanda yalnız açık hatırlatıcıları gösterir.
- **Her gün hatırlatıcım takvimi dolduruyor.** Ay görünümünde her gün iki kayıt sığar, fazlası "+N daha" olur. Ajandada ise yalnız
  sıradaki zamanı tek satırdır; istersen "Hatırlatıcılarım"ı kaldırarak ajandada gizle.
- **Öğretmenim benim hatırlatıcılarımı takvimde görür mü?** Hayır; hatırlatıcıların yalnız senin takviminde görünür.

## Sırada

- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: takvimin altında
  Ajanda ve "Hatırlatıcılarım" süzgeci.
- Arayüz önizlemesi (Tasarım 1): takvimde güne basınca o günün işleri (hatırlatıcı dahil), ay ve yıl okları.
- Android yerel uygulama (bütün roller): uygulamanın takviminde aynı ajanda ucu.
