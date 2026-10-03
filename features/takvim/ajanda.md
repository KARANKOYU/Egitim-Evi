# Takvim ve ajanda · Ajanda

**Durum:** Tasarlandı — henüz kodda yok

Takvim sayfasının "Ajanda" sekmesi: bugün ve gelecekte olacak her şey tek listede, "Bugün", "Bu hafta", "Sonra" gruplarında, her satırda
kalan süreyle; katlanır "Geçmiş · son 30 gün" ve süzgeç kutucuklarıyla.

## Ne işe yarar

Takvim günü gün gösterir; ajanda "sırada ne var?" sorusunu cevaplar. Kullanıcı 27 Eylül'de, veli toplantısı gibi şeyler için takvimin
yanında "o an aktif ve gelecekte olacak şeylerin" listesini ve onay kutulu bir süzgeci ("ödev, özel gün, duyuru, sınav gibi") istedi;
tanım bunu Takvim sayfasına koydu. Kullanıcı 3 Ekim akşamı önizlemeyi gezdikten sonra ajandanın takvimden **ayrı** olmasını söyledi
("ajanda ayrı, takvim ayrı"): Takvim sayfasında iki sekme, "Takvim" ve "Ajanda". Toplantılar, planlanan sınavlar, etütler ve
duyurudan eklenen kayıtlar da ajandaya kendiliğinden girer.

## Nereden açılır

- **Tasarımda:** sol menü → **"Takvim"** → sayfanın üstündeki **"Ajanda"** sekmesi ([Takvim sayfası](takvim-sayfasi.md)). Seçtiğin
  sekme hatırlanır; ajandada bıraktıysan Takvim'e dönünce ajanda açılır.
- Tanımda ajanda "ay görünümünün altında" yazıyordu ve Tasarım 1 önizlemesi önce öyle çizdi; kullanıcının 3 Ekim akşamı geri
  bildirimiyle iki ayrı sekmeye ayrıldı. İkisi aynı anda üst üste durmaz.
- **Bugünkü sitede ajanda yok.** En yakın şey gün ayrıntısındaki **"Önümüzdeki 7 gün"** ödev listesidir
  ([Gün ayrıntısı](gun-ayrintisi.md)).

## Adım adım

### Bütün takvimi olan roller (tasarımda)

1. **"Ajanda"** sekmesine bas. Başlık satırı: sarı takvim simgesi, **"Ajanda"**, sağda **"<n> kayıt"** (Bugün, Bu hafta ve Sonra'daki
   kayıtların toplamı).
2. Başlığın altında süzgeç kutucukları: **"Ödev"** · **"Sınav"** · **"Duyuru"** · **"Özel gün"** · **"Toplantı"** · **"Etkinlik"** ·
   **"Hatırlatıcılarım"** — hepsi işaretli gelir ("Ödev" yalnız ödevi olan rollerde). Ayrıntı:
   [Ajandanın süzgeç kutucukları](ajanda-suzgeci.md).
3. Kayıtlar zamana göre sıralı (en yakın üstte), üç gruba ayrılır; her grubun yanında sayısı:
   - **"Bugün"** — bugünün kayıtları (saati geçmiş olanlar da);
   - **"Bu hafta"** — yarından bu haftanın Pazar gününe kadar;
   - **"Sonra"** — gelecek Pazartesi ve sonrası.
   Boş grupta: **"Bugün için kayıt yok."**, **"Bu hafta için kayıt yok."**, **"Sonra için kayıt yok."**
4. **"Sonra"** grubunda ilk **12** satır görünür; altında **"<n> kayıt daha göster"** düğmesi her basışta 12 satır daha açar.
5. En altta katlanmış **"Geçmiş · son 30 gün <n>"** (yalnız son 30 günde kayıt varsa çıkar): basınca açılır, en yeni üstte. Ajanda
   yenilenince açık kaldıysa açık kalır.
6. Her satır: türün renginde simge, başlık, altında **"Tür · saat · ayrıntı"** (gün listesindekiyle aynı biçim: ör. **"Ödev · son gün
   23:00 · Matematik"**, **"Sınav · 10:10 · Fen Bilimleri · 3. ders · Ali Yıldız"**, **"Toplantı · 15:30–16:30 · Konferans salonu"**,
   **"Duyuru · 07:20 · Murat Şahin · Müdür"**, **"Resmî tatil · okul kapalı"**, **"Hatırlatıcı · 20:00 · bir kez"**) ve sağda **kalan
   süre** rozeti:
   - saatli kayıtta: bugün ve bir saatten az kaldıysa **"20 dakika kaldı"**, daha çoksa **"3 saat kaldı"**; yarınsa **"yarın 09:00"**;
     daha ileriyse **"2 gün kaldı"**; geçmişte bugün **"bugün geçti"**, önceki günlerde **"3 gün önce"**;
   - bütün gün süren kayıtta (tatil, özel gün, bütün gün etkinlik): **"bugün"**, **"yarın"**, **"5 gün kaldı"**, **"3 gün önce"**;
   - renk: bugün, yarın ve 3 gün ya da daha az kaldıysa turuncu; daha uzaksa mavi; geçmişse gri.
7. Satıra bas (ya da klavyeyle odaklanıp Enter) → kaydın penceresi açılır ([Takvimdeki kayda basınca](kayit-pencereleri.md)).
8. Ajandaya düşenler ve özel kuralları:
   - **Ödevler** ödev listesindekinin aynısıdır. Öğrenci ve velinin ajandasında **sonuçlanmış** (Yaptı, Geç yaptı, Eksik, Yapmadı,
     Gelmedi) ve son günü henüz gelmemiş ödev görünmez (iş bitmiştir); öğretmende kalır.
   - **Hatırlatıcılar:** her açık hatırlatıcının **yalnız sıradaki zamanı** bir satırdır (takvimde her tekrarı görünür)
     ([Takvimde ve ajandada hatırlatıcılar](../hatirlatici/takvimde-ve-ajandada.md)).
   - **Çok günlük tatil** (yarıyıl tatili) ajandada **tek satırdır** (sıradaki ilk günü); geçmişte kalan günleri "Geçmiş"te görünür.
   - **Toplantılar** bitişten 1 hafta sonra silinir; ajandadan da kalkar ([Hatırlatma ve 1 hafta sonra silinme](../toplanti/hatirlatma-ve-silinme.md)).
   - **Duyurular** yalnız gönderen "Alıcıların ajandasına ekle"yi açtıysa düşer ([Mesajdan ajandaya ve hatırlatıcıya ekleme](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md)).

### Öğrenci

- Ödevlerin, sınavların, davetli olduğun toplantılar, etütlerin, okul etkinlikleri, ajandana eklenen duyurular, tatiller ve
  hatırlatıcıların. Sonuçlanmış ödevler ajandadan düşer.

### Veli

- Açık olduğun çocuk oturumunun ajandası: o çocuğun ödevleri, sınavları, etütleri, o çocuk için davetli olduğun toplantılar, o oturuma
  gelen duyurular ve o oturumda kurduğun hatırlatıcılar. Öbür çocuğun ajandası için "Oturum değiştir"
  ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).
- Tanıma göre öğrenciye giden duyuruda velinin ajandasına da satır düşer.

### Öğretmen ve ek görevli çalışan

- Verdiğin ödevler (sınıf adıyla ve teslim sayısıyla; sonuçlanmışlar da kalır), açtığın sınavlar (derslik ve süreyle), toplantılar,
  kendi etütlerin, sana açılan etkinlikler, duyurular, hatırlatıcıların. Tanım: "öğretmen derslerininkini ve okulun etkinliklerini"
  görür.

### Müdür

- Ödev yok ("Ödev" kutucuğu da yok); okulun sınavları, toplantıları, bütün etütler, okulun etkinlikleri (eklediklerin dahil), gönderdiğin
  duyurular, tatiller, hatırlatıcıların. Tanım: "müdür okulunkini görür".

### Servisçi

- Tasarım 1 önizlemesinde servisçinin Takvim sayfasında da Ajanda var: tatiller, okul etkinlikleri, sana gelen duyurular (ör.
  "Pazartesi sabah seferi 10 dakika erken"), hatırlatıcıların; "Ödev" kutucuğu yok. Tanımın Ajanda bölümünde servisçi ayrıca
  anılmıyor.

### Rolsüz çalışan

- Tanıma göre portalında Takvim var; ajandada ne göreceği tanımda yazılı değil (açık soru).

## Kurallar ve sınırlar

- **Tanımın kuralları (mesaj-ajanda tanımı, Ajanda bölümü):**
  - ajanda **tek bir uçtan, sayfalı** gelir; telefon uygulaması da sonra aynı ucu kullanır;
  - öğrenci kendisininkini, veli çocuğununkini, öğretmen derslerininkini ve okulun etkinliklerini, müdür okulunkini görür;
  - okulun kapattığı bölümlerin kayıtları görünmez (Hatırlatıcılarım kapatılamaz);
  - sınav satırında **yer ve sıra** ("Salon 3, sıra 14") ve **hatırlatma bilgisi** yazar; satıra basınca kaynağı (ödev, sınav, duyuru)
    açılır. Önizlemede sınav satırında yer ve sıra henüz yok.
- **Gruplar takvim gününe göre:** "Bu hafta" Pazar akşamı biter; Pazartesi başlayan kayıtlar "Sonra"dadır.
- **"Geçmiş" yalnız son 30 gündür;** daha eski kayıtlar ajandada görünmez (takvimde ayına gidilerek görülür).
- **Süzgeç seçimi bu tarayıcıya özeldir** ve takvimin ay görünümünü, gün listesini etkilemez.
- **Duyurudan gelen kopya:** alıcı kendi kopyasını ajandasından gizleyebilir; gönderen tarihi değiştirirse herkesin satırı güncellenir;
  duyuru silinirse satır da silinir (tanım; [Duyurudan gelen hatırlatıcılar](../hatirlatici/duyurudan-gelen-hatirlaticilar.md)).
- **Görünürlük kişinin hakkıyla sınırlı:** ajanda yalnız takvimde de görebildiğin kayıtları listeler ([Takvim kimin gözünden](kimin-takvimi.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Takvim sayfası](takvim-sayfasi.md) · [Ay görünümü](ay-gorunumu.md) · [Gün ayrıntısı](gun-ayrintisi.md) ·
[Takvim kimin gözünden](kimin-takvimi.md) · [Takvime ekle](etkinlik-ekleme.md) · [Takvimden kaldırma](etkinligi-kaldirma.md) ·
[Tatiller ve özel günler](tatiller-ve-ozel-gunler.md) · [Ajandanın süzgeç kutucukları](ajanda-suzgeci.md) ·
[Takvimdeki kayda basınca](kayit-pencereleri.md).

**İlgili:** [Takvimde ve ajandada hatırlatıcılar](../hatirlatici/takvimde-ve-ajandada.md) ·
[Mesajdan ajandaya ve hatırlatıcıya ekleme](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md) · [Duyuru](../mesaj/duyuru.md) ·
[Sınav planlama](../sinav/sinav-planlama.md) · [Toplantılar listesi](../toplanti/toplantilar.md) ·
[Hatırlatma ve 1 hafta sonra silinme](../toplanti/hatirlatma-ve-silinme.md) · [Etüt açma](../etut/etut-acma.md) ·
[Etütlerim](../etut/etutlerim.md) · [Ödev listesi](../odev/liste.md) · [Ödev hatırlatmaları](../odev/hatirlatmalar.md) ·
[Android uygulaması](../uygulama/android-uygulamasi.md).

## Kod tarafı

- **Bugün kodda yok.** Tanımdaki tek ajanda ucu (`/api/ajanda`, sayfalı) yazılmadı; yapı belgesinde yazılacak.
- Bugünkü en yakın parça: [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md) (`GET /api/takvim/gun`: `yaklasan`, en çok 10
  ödev) ve [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) ("Önümüzdeki 7 gün"; "Son durum" bölümünde planlı
  ajanda notu).
- Kodlanırken kullanılabilecekler: [sunucu/yardimci/hatirlatici-zaman.md](../../sunucu/yardimci/hatirlatici-zaman.md) (hatırlatıcının
  sıradaki zamanı), [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (ödevin son anı).
- Tasarım: Tasarım 1 önizlemesi (Takvim sayfasının "Ajanda" sekmesi); kodlanınca bu belgenin Durum satırı ve bu bölüm güncellenir.

## Sık sorulanlar

- **Ajanda ile takvim arasındaki fark ne?** Takvim günü gün, ay ay gösterir; ajanda bugünden ileriye doğru tek liste, her satırda kalan
  süre. İkisi aynı kayıtları kullanır.
- **Sonuçlanan ödevim ajandadan kayboldu.** Öğrenci ve velide son günü henüz gelmemiş bir ödev sonuçlanınca ajandadan düşer (iş
  bitmiştir); Ödevler sayfasında durur. Son günü geçmiş ödevler, sonuçlanmış olsalar da "Geçmiş · son 30 gün"de görünür.
- **Ödev verirken açılan tarih seçicisinin altındaki gün özeti ajanda mı?** Hayır. O, ödevin tarih seçicisidir ([Ödevin tarih ve
  saati](../odev/tarih-ve-saat.md)); kodda "ajanda" adıyla geçer ama bu sekmeyle ilgisi yoktur.
- **Her gün çalan hatırlatıcım ajandayı dolduracak mı?** Hayır; ajandada yalnız sıradaki zamanı tek satırdır.
- **Geçen ayın bir kaydını arıyorum.** Ajandanın "Geçmiş"i son 30 gündür; daha eskisi için Takvim sekmesinde o aya git.

## Sırada

- Mesaj ayarları (çark), Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: ajandanın
  kendisi, tek uç, rol rol görünürlük, sınavda yer ve sıra.
- Arayüz önizlemesi (Tasarım 1): "Takvim | Ajanda" sekmeleri; kullanıcının tasarım seçimi bekleniyor.
- Toplantılar + sınıfın uzaktan ders bağlantısı + tahta hesabı: toplantılar ajandaya girer, 1 hafta sonra ajandadan da kalkar.
- Etüt planlama: etütler ajandaya girer.
- Android yerel uygulama (bütün roller): uygulama aynı ajanda ucunu kullanır.
