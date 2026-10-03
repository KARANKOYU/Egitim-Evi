# Etütler · Etüt planlama: boş zaman ızgarası

**Durum:** Tasarlandı — henüz kodda yok

Etüt sorumlusunun dersi, öğretmeni ve öğrencileri seçerken haftanın saatlerini canlı olarak boş, kısmen dolu ve dolu diye gördüğü,
saati ızgaradan seçip etüdü kaydettiği "Etüt planla" penceresi.

## Ne işe yarar

Bugün etüt açarken saati elle yazarsın ve hiçbir denetim yoktur: öğretmenin o saatte dersi ya da başka etüdü olabilir, öğrencilerin
bir kısmı derste olabilir; uyarı çıkmaz ([Etüt açma](etut-acma.md)). Kullanıcı 29 Eylül'de bunu istedi: etüt sorumlusu "herkese
istediği dersten istediği hoca ile etüt yazabilir, boş yerler o an yazarken görülür". 1 Ekim'de de önizlemeye eklenecekler arasında
"Etüt planlama ızgarası"nı seçti. Tanım (etüt planlama, öneri) ve Tasarım 1 önizlemesi bunu bir pencerede birleştirir: dersi,
öğretmeni ve öğrencileri seçtikçe ızgara kimin hangi saatte dolu olduğunu gösterir; boş bir saate basıp kaydedersin.

## Nereden açılır

Tasarımda (Tasarım 1 önizlemesi): [Etütler sayfası](etutler-sayfasi.md) → sağ üstte **"Etüt ekle"** → **"Etüt planla"** penceresi.
Düğme etüt planlama yetkisi olana çıkar: müdür ve rolünde etüt yetkisi olan kişi (önizlemede "Etüt sorumlusu" rolündeki öğretmen).

Bugünkü sitede karşılığı yok; yerinde "Etüt aç" penceresi var.

## Adım adım

### Pencerede ne var (Tasarım 1 önizlemesi)

Yukarıdan aşağıya:

1. **"Ders"** açılır listesi — okulun dersleri (okulun "Dersler ve branşlar" listesinden: Matematik, Türkçe, Fen Bilimleri, Sosyal
   Bilgiler, İngilizce, Din Kültürü, Beden Eğitimi, Müzik, Görsel Sanatlar, Bilişim, Rehberlik, okulun kendi dersleri …) ve en sonda
   **"Genel / serbest çalışma"**. O listedeki branşlar (ör. bir özel eğitim branşı) burada çıkmaz; yalnız dersler çıkar. Önizlemede
   **Matematik** seçili gelir.
2. **"Öğretmen"** açılır listesi, iki grupta:
   - **"<Ders> öğretmenleri"** (ör. "Matematik öğretmenleri") — branşı seçilen ders olanlar;
   - **"Öbür öğretmenler"** — geri kalanlar, adının yanında branşıyla ("Ali Yıldız · Fen Bilimleri").
   Dersin branşından kimse yoksa (ör. "Genel / serbest çalışma") tek grup **"Öğretmenler"**.
3. **"Öğrenciler · <sayı>"** bölümü — seçilenler çip olarak, sınıf çipleri, **"Öğrenci ara (en az 2 harf)"**, **"<sınıf> sınıfının hepsini
   ekle"** ([Etüdün öğrencilerini seçme](ogrenci-secme.md)).
4. Açıklama şeridi: **"Boş"** (yeşil), **"Kısmen dolu"** (sarı), **"Dolu"** (kırmızı).
5. **Izgara** — sütunlar **"Pzt"**, **"Sal"**, **"Çar"**, **"Per"**, **"Cum"**; satırlar okulun ders saatleri ve okul sonrası:

   | Satır | Başlangıç |
   |---|---|
   | 1. ders | 08:30 |
   | 2. ders | 09:20 |
   | 3. ders | 10:10 |
   | 4. ders | 11:00 |
   | 5. ders | 11:50 |
   | 6. ders | 12:40 |
   | Okul sonrası | 15:30 |
   | Okul sonrası | 16:20 |

   Her hücre bir düğmedir ve kısa yazıyla durumunu söyler (aşağıda).
6. İpucu: **"Hücrenin üstünde dur: kimin dolu olduğu yazar. Dolu saati seçersen kaydederken çakışma sorulur."**
7. Altta hata satırı (kırmızı) ve düğmeler **"Vazgeç"**, **"Etüdü kaydet"**.

### Hücrelerin durumu

Her hücre için seçilen öğretmenin ve seçilen öğrencilerin o gün ve o saatte dolu olup olmadığına bakılır:

| Durum | Görünüm | Hücrede yazan | Üstünde durunca |
|---|---|---|---|
| Öğretmen dolu | kırmızı | **"Öğretmen dolu"** | "Ayşe Kaya dolu" (öğrencilerden de dolu olan varsa "Ayşe Kaya dolu · 2 öğrenci de dolu") |
| Öğretmen boş, seçilen öğrencilerin hepsi dolu | kırmızı | **"Herkes dolu"** | "Öğrencilerin hepsi dolu" |
| Öğretmen boş, öğrencilerin bir kısmı dolu | sarı | **"2/3 boş"** (boş öğrenci / bütün öğrenci) | dolu olanların adları: "Elif Yılmaz dolu" |
| Herkes boş | yeşil | **"Boş"** | "Herkes boş" |
| Seçtiğin hücre | vurgulu | **"Seçildi"** | — |

Öğrenci seçilmemişse yalnız öğretmene bakılır. Ders, öğretmen ya da öğrenci değiştikçe ızgara **anında** yeniden çizilir; seçtiğin
hücre seçili kalır, rengi yeni duruma göre değişir.

Tanımda "dolu" şunlardır: öğretmen için **ders programı + öbür etütleri + nöbeti**; öğrenci için **sınıfının ders programı + öbür
etütleri**; derslik alanı varsa **derslik/salon doluluğu**. Önizlemedeki dolu saatler örnek veridir.

### Müdür

1. Menüden "Okul düzeni" → **"Etütler"** → sağ üstte **"Etüt ekle"**.
2. **"Ders"**i seç (ya da "Genel / serbest çalışma"). Öğretmen listesi bu derse göre yeniden gruplanır.
3. **"Öğretmen"**i seç; önce dersin öğretmenleri önerilir ama istediğin öğretmeni seçebilirsin. Izgarada öğretmenin dolu saatleri
   kırmızıya döner.
4. Öğrencileri ekle (sınıf çipi → "… sınıfının hepsini ekle", ya da en az iki harfle ara). Her eklemede ızgara güncellenir: bir kısmı
   dolu saat sarı, hepsi dolu saat kırmızı.
5. Yeşil bir hücreye bas: hücrede **"Seçildi"** yazar. Fikrini değiştirirsen başka bir hücreye bas; aynı hücreye yeniden basmak seçimi
   kaldırır.
6. **"Etüdü kaydet"**e bas. Eksik varsa pencerenin altında kırmızı, şu sırayla: **"Dersi seç."**, **"Öğretmeni seç."**, **"En az bir
   öğrenci ekle."**, **"Izgaradan bir saat seç."**
7. Seçtiğin hücre boş değilse önce onay kutusu çıkar: başlık **"Bu saatte çakışma var"**, metin **""Elif Yılmaz dolu". Yine de
   kaydedersen işlem kaydına yazılır."**, düğmeler **"Vazgeç"** ve **"Yine de kaydet"**.
8. Kayıt olunca pencere kapanır, kısa ileti çıkar: **"<etüdün adı> kaydedildi: Cuma 2 Ekim 2026 15:30–16:10; öğretmene ve 3 öğrenciye
   bildirim gitti."** Etüt müdürün Etütler listesinin en üstüne **"Planlı"** rozetiyle girer; okulun işlem kaydına **"<adın> etüt
   planladı"** satırı düşer (ayrıntısı "Fen Bilimleri etüdü · Cuma 2 Ekim 2026 15:30–16:10 · Ali Yıldız"; çakışmaya rağmen
   kaydedildiyse sonuna " · çakışmaya rağmen (Elif Yılmaz dolu)"). Kaydedilen etüt önizlemede Takvim'in ay görünümünde ve altındaki
   ajandada da hemen görünür ([Ajanda](../takvim/ajanda.md)).
9. Pencere bir sonraki etüt için hazır kalır: ders ve öğretmen seçimi durur; öğrenciler, arama, sınıf seçimi ve seçilen saat
   temizlenir.
10. **"Vazgeç"** (ya da pencereyi kapatmak) hiçbir şey kaydetmez.

### Öğretmen (etüt sorumlusu)

Rolünde etüt planlama yetkisi varsa adımlar müdürünkiyle aynı. Pencereyi ilk açtığında **"Öğretmen"** listesinde kendin seçili
gelirsin; istersen başka bir öğretmeni seçersin. Yetkin yoksa "Etüt ekle" çıkmamalı (önizleme yetkiyi denemiyor: örnek öğretmen
zaten "Etüt sorumlusu" rolünde ve sayfasında "Etüt ekle" her zaman var). Önizlemede öğretmenin kaydettiği etüt onun "Etütlerin"
listesine eklenmez; yalnız kısa ileti ve işlem kaydı oluşur.

### Çalışan

Tasarımda (çalışan tanımı): özel rolünde etüt yetkisi olan çalışan (ör. "Etüt sorumlusu") öğretmen olmasa da planlar; rolsüz çalışan
planlayamaz.

### Öğrenci ve veli

Planlamaz. Kaydedilen etüt [Etütlerim](etutlerim.md)'de tarihli satır olarak görünür; yeni etüt bildirimi gelir
([Etüt bildirimleri](etut-bildirimleri.md)).

### Kaydedilen etüdün bilgileri (önizlemede)

- **Ad** kendiliğinden konur: "<Ders> etüdü" ("Matematik etüdü"); "Genel / serbest çalışma"da "Serbest çalışma etüdü". Aynı ad varsa
  "Matematik 2. etüdü", "Matematik 3. etüdü".
- **Tarih:** seçilen gün bu hafta henüz geçmediyse bu haftanın, geçtiyse (bugünse ve saati geçtiyse de) gelecek haftanın o günü.
- **Saat:** hücrenin başlangıcı ve **40 dakika** (bir ders saati): "15:30–16:10".
- **Yer:** "Okul" (pencerede yer kutusu yok).
- **Konu:** "<Ders> konuları" (serbest çalışmada "Serbest çalışma").
- **Durum:** "Planlı".

## Kurallar ve sınırlar

- **Kim planlar:** müdür ve etüt planlama yetkisi olan (önizlemede "Etüt planlar"; bugünkü karşılığı "Etüt açar; gününü, saatini,
  öğretmenini ve öğrencilerini düzenler") — [Etüt yetkileri](etut-yetkileri.md).
- **Ders, öğretmen, en az bir öğrenci ve bir saat zorunlu**; eksikte yukarıdaki dört ileti.
- **Çakışma engel değil, uyarıdır:** dolu ya da kısmen dolu saat seçilebilir; kaydetmeden önce sorulur, kaydedilirse işlem kaydına
  çakışma bilgisiyle yazılır. Tanım: "zorla kaydetmek yetkiliye açık, işlem kaydına".
- **Öğretmen seçimi serbest:** önce dersin branşındakiler önerilir ama herhangi bir öğretmen seçilebilir (kullanıcının "istediği hoca
  ile").
- **Ders listesi okulun derslerinden** gelir; okulun kendi açtığı dersler de girer ([Okulun kendi branşı ve
  dersi](../siniflar-dersler/ozel-brans-ve-ders.md)).
- **Izgaranın saatleri okulun ders saatlerinden** gelir ([Okulun ders saatleri](../ders-programi/ders-saatleri.md)); önizlemede sabit
  (6 ders, 2 okul sonrası saat) ve yalnız hafta içi.
- **Gizlilik (tanım):** sunucunun boş zaman ucu kapsam denetimli olur ve öğrenci adları değil yalnız sayılar döner. Önizlemede hücrenin
  ipucu dolu öğrencilerin adlarını yazıyor; hangisinin kalacağı kodlanırken netleşecek.

Tanımda olup önizlemede gösterilmeyenler (öneri, onay bekliyor):

- Izgaranın **seçilen gün için saat çizelgesi** olması (önizleme haftalık beş günlük tablo gösterir; hücreye basınca o gün ve saat
  seçilir, yani "aralığa basınca saat dolar" kısmı önizlemede var).
- Kısmen dolu hücrede sayıyla yazı: "3 öğrencinin dersi var" (önizleme "2/3 boş" yazar).
- **Haftalık tekrar (her Salı)** ya da **tek seferlik** etüt seçimi. Önizlemede etüt tek tarihlidir; bugünkü kodda etüt her hafta
  tekrarlanır.
- Öğretmenin **nöbeti** ve **derslik/salon doluluğu** (önizlemenin dolu saatleri yalnız kişilere göre örnek veridir).
- Öğrenciye ve veliye giden yeni etüt bildiriminin tam metni (önizleme yalnız "öğretmene ve 3 öğrenciye bildirim gitti" der; velinin
  örnek bildirimi [Etüt bildirimleri](etut-bildirimleri.md)'nde).

Bugünkü "Adı" ve "Yer (isteğe bağlı)" alanlarının ve bitiş saatini elle yazmanın kalıp kalmayacağı kodlanırken kararlaşacak.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Etütler](README.md)):

- [Etüt açma](etut-acma.md) — bugünkü "Yeni etüt" penceresi; tasarımdaki "Etüt planla" onun yerini alır.
- [Etüdün öğrencilerini seçme](ogrenci-secme.md) — pencerenin öğrenci bölümü.
- [Etütler sayfası](etutler-sayfasi.md) — "Etüt ekle" düğmesi ve "Planlı" satırı.
- [Etüt yetkileri ve hazır roller](etut-yetkileri.md) — kim planlar.
- [Etüt bildirimleri](etut-bildirimleri.md) — "öğretmene ve 3 öğrenciye bildirim gitti".
- [Etüt ayrıntısı](etut-ayrintisi.md) — kaydedilen etüdün penceresi.
- [Etüt yoklaması](etut-yoklamasi.md), [Etütlerim](etutlerim.md), [Etüdü düzenleme ve silme](etudu-duzenleme-ve-silme.md).

**İlgili:**

- [Okulun ders saatleri](../ders-programi/ders-saatleri.md), [Ders programı kurma](../ders-programi/program-kurma.md),
  [Çakışma uyarısı](../ders-programi/cakisma-uyarisi.md) — ızgaranın dayandığı saatler, program ve programdaki çakışma uyarısı.
- [Okulun kendi branşı ve dersi](../siniflar-dersler/ozel-brans-ve-ders.md) — "Ders" listesi ve öğretmenlerin branşı.
- [Öğretmenler ve çalışanlar listesi](../ogretmenler-calisanlar/liste.md) — "Öğretmen" listesi.
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) — "etüt planladı", çakışmaya rağmen kaydetme.
- [Ajanda](../takvim/ajanda.md).
- [Özel roller](../roller-yetkiler/ozel-roller.md) — "Etüt sorumlusu".

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı yerler (etüt planlama tanımı ve kod belgeleri):

- Ön yüz: [public/js/parcalar/18b-etut.md](../../public/js/parcalar/18b-etut.md) — `etutModal` ve öğrenci seçimi büyük ölçüde
  değişecek; ızgara buraya eklenir.
- Sunucu: [sunucu/bolumler/etut.md](../../sunucu/bolumler/etut.md) — yeni uç `GET /api/etut/bos-zaman?gun&ogretmen&ogrenciler[]`
  (kapsam denetimli; öğrenci adları değil yalnız sayılar), kaydetmede çakışma bilgisi ve işlem kaydı, öğrenciye ve veliye bildirim.
- Veri: ders programı ([sunucu/veri/depo/siniflar.md](../../sunucu/veri/depo/siniflar.md)), etütler
  ([sunucu/veri/depo/etutler.md](../../sunucu/veri/depo/etutler.md)); ders saatleri ve tarihli/tek seferlik etüt için şemaya ekleme.
- Tasarım: Tasarım 1 önizlemesindeki "Etüt planla" penceresi (ders ve öğretmen seçimi, öğrenci seçici, canlı ızgara, çakışma onayı).

## Sık sorulanlar

- **Kırmızı bir saate etüt koyabilir miyim?** Evet; kaydederken "Bu saatte çakışma var" diye sorulur, "Yine de kaydet" dersen kaydedilir
  ve işlem kaydına çakışmayla yazılır.
- **Sarı hücrede "2/3 boş" ne demek?** Seçtiğin 3 öğrenciden 2'si o saatte boş, 1'i dolu. Üstünde durunca dolu olanın adı yazar.
- **Öğretmen listesinde neden önce Matematik öğretmenleri var?** Ders olarak Matematik seçili; önce dersin öğretmenleri önerilir.
  "Öbür öğretmenler"den de seçebilirsin.
- **Hafta sonu etüt planlayabilir miyim?** Önizlemedeki ızgara yalnız hafta içini gösterir. Bugünkü sitede Cumartesi ve Pazar da
  seçilebilir; tasarımda hafta sonunun nasıl görüneceği kararlaşmadı.
- **Etüdün adını ve yerini nereden yazacağım?** Önizlemede ad kendiliğinden konur, yer "Okul" olur. Bugünkü sitedeki ad ve yer
  alanlarının kalıp kalmayacağı kodlanırken kararlaşacak.

## Sırada

- Etüt planlama (öneri, 29 Eylül; Tasarım 1 önizlemesi): bu pencerenin kodlanması; sunucuya boş zaman ucu; haftalık ya da tek seferlik
  etüt; çakışmada uyarı ve işlem kaydı; öğretmene, öğrenciye ve veliye bildirim; ajanda.
- Okulun ders saatleri (tasarım): ızgaranın satırları okulun ayarından gelecek.
- Özel branş ve ders: okulun kendi dersleri "Ders" listesine girecek.
- Çalışan olarak ekleme: etüt sorumlusu çalışan öğretmen olmadan da planlayabilecek.
