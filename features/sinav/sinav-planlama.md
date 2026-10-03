# Sınavlar · Sınav planlama

**Durum:** Tasarlandı — henüz kodda yok

Sınavı olmadan önce planlamak: tarih, başlangıç saati, süre, ders, sınıflar, salon ve koltuk dağıtımı; "Gelecek sınavlar" /
"Olmuş sınavlar" ayrımı, düzenleme, takvim ve ajanda, hatırlatma ve oturma listesi.

## Ne işe yarar

Bugün sınav yalnız sonuç girme kabıdır: günü vardır ama saati, yeri, süresi yoktur; öğrenci sınavı sonucu girilince görür.
Kullanıcı 27 Eylül'de şunu istedi: **"sınav için tarih ve saat ve oturulacak koltuk vb girilebilir önceden sınavı yazarken;
yeni sınav ekle butonunda gelecek sınav olmuş sınav diye"** (ajanda konuşmasının içinde). Böylece öğrenci ve veli sınavın ne
zaman ve nerede olduğunu, hangi salonda hangi sırada oturacağını önceden görür; öğretmen de sınav bitince değer girişine geçer.

## Nereden açılır

- **Öğretmen:** "Sınavlar" sayfasında **"Sınav aç"** (planlama alanları penceredir) ve kendi açtığın sınavın satırında **"Düzenle"**
  ([Yeni sınav açma](yeni-sinav.md), [Sınavlar listesi](sinavlar-listesi.md)).
- **Müdür:** "Okul düzeni → Sınavlar"da **"Sınav aç"** ([Okulun sınavları](okulun-sinavlari.md)).
- **Öğrenci:** "Sınavlarım" listesinde gelecek sınav ("Sonuç yok"), takvim ve ajanda, hatırlatma bildirimi.
- **Veli:** çocuğun oturumunda ana sayfadaki "Yaklaşanlar", takvim ve ajanda, hatırlatma bildirimi.

## Adım adım

### Öğretmen

**Planlamak ("Sınav aç" penceresi, Tasarım 1 önizlemesi)**

1. **"Sınav aç"** → şablon seç ([Şablonlar](sablonlar.md)).
2. **"2. Bilgiler"**:
   - **"Ders"** ve **"Sınıflar"** (birden çok sınıf seçilebilir; her sınıf ayrı sınav olur);
   - **"Tarih ve saat"** — tarih-saat kutusu ve yanında süre (5–240 dakika, 40 dolu) + "dakika"; altında **"Sınavdan önce
     girdiğin tarih. Sonuç tarihi, değerler yazılınca kendiliğinden kaydedilir."**
3. **"Salon ve koltuk"** bölümü:
   - **"Salon"** — okulun salonları çip çip, kapasiteleriyle: "Derslik 208 · 30 kişi", "Derslik 210 · 30 kişi", "Derslik 213 ·
     30 kişi", "Konferans salonu · 120 kişi", "Laboratuvar · 24 kişi", "Kütüphane · 40 kişi" (önizlemenin örnekleri). Seçtiğin
     sınıfların kendi derslikleri seçili gelir; birden çok salon seçilebilir. Salon değişince elle verilmiş koltuklar sıfırlanır.
   - Altında: **"28 öğrenci · seçili salonlar 30 kişilik"**; sığmıyorsa kırmızı **"52 öğrenci · seçili salonlar 30 kişilik ·
     yer yetmiyor, salon ekle"**.
   - **"Koltuk"** — **"Otomatik"** ya da **"Elle"**.
     - **Otomatik:** sıralama seçimi **"Okul no sırasıyla"**, **"Ada göre"**, **"Karışık"**. Öğrenciler salonlara seçilen sırayla,
       her salon kapasitesi dolunca bir sonrakine yerleşir; altında ilk dört öğrencinin yeri ("Derslik 208 · 1. sıra · Deniz
       Aydın (7-A)" …), yer kalmayana **"yer yok"**, fazlası **"… 24 öğrenci daha"**.
     - **Elle:** tablo **"Öğrenci · Salon · Sıra"**: her öğrenci (sınıfıyla) için salon seçimi ("Seç" ve seçili salonlar) ve sıra
       numarası (1–200). İlk açılışta otomatik dağılımla dolu gelir. Salonu ya da sırası eksik, ya da aynı salonda aynı sıra iki
       kez verilmiş satırlar kırmızı; altında **"Kırmızı satırlarda salon ya da sıra eksik veya aynı sıra iki kez verilmiş."**
4. **"Sınavı aç"**. Planlamayla ilgili hatalar: **"Sınavın tarihini ve saatini seç."**, **"En az bir salon seç."**, **"Seçili
   salonlara 52 öğrenci sığmıyor; salon ekle."**, **"Elle koltukta eksik ya da aynı sıra var; kırmızı satırları düzelt."**
5. Başarılıysa **"Sınav açıldı: 1. yazılı · 7-A, 7-C · 15 Ekim 10:00 · Derslik 208, Derslik 210."**; sınav "Gelecek sınavlar"a
   girer, satırında "Yazılı (0–100) · Perşembe 10:00 · 40 dk · Derslik 208 · koltuk: okul no sırasıyla".

**Gelecek ve olmuş sınav**

6. Sınavın başlangıç saati ile süresi geçince sınav kendiliğinden **"Olmuş sınavlar"**a geçer ve **değer girişi açılır**
   ([Not (değer) girişi](not-girisi.md)). O ana kadar değer sayfasında **"Sınav 15 Ekim 2026 Perşembe, saat 11:50. Değer girişi
   sınav bitince açılır."** yazar. Tarihi olmayan eski sınavlar "olmuş" sayılır.

**Düzenlemek ve silmek**

7. Kendi açtığın sınavın satırında (gelecek ya da olmuş) **"Düzenle"** → **"Sınavı düzenle"** (sınıf değiştirilemez: **"Düzenlerken sınıf değişmez"**) →
   **"Kaydet"**. Tarih ya da saat değiştiyse ileti **"Sınav güncellendi: 7-A · 1. yazılı · tarih değişti; öğrencilere ve
   velilere bildirim gitti"**; değişmediyse yalnız **"Sınav güncellendi: 7-A · 1. yazılı"**.
8. **"Sil"** → **“7-A · 1. yazılı” silinsin mi?** ve **"Sınav öğrencilerin takviminden de kalkar."** (değer girilmiş olmuş
   sınavda **"12 öğrencinin girilmiş değerleri de silinir."**) → **"Sil"**.

**Takvim, ajanda ve oturma listesi**

9. Açılan sınav kendiliğinden takvime ("Sınav" türüyle) ve ajandaya girer; öğretmenin ajandasında "7-A · Matematik 1. yazılı" ve
   altında "Derslik 208 · 40 dakika" ([Ajanda](../takvim/ajanda.md), [Ay görünümü](../takvim/ay-gorunumu.md)). Ödev verirken
   açılan takvimde sınav günleri "Sınav: 7-A · 1. yazılı" diye işaretli görünür.
10. Tanıma göre **oturma listesi** yazdırılabilir: salon salon, sıra no, öğrenci adı (önizlemede çizilmedi).

### Müdür

- "Okul düzeni → Sınavlar"daki "Sınav aç" aynı tarih, saat, süre, ders ve sınıf alanlarını taşır; ek olarak "Notları girecek
  öğretmen(ler)". Önizlemede müdürün penceresinde salon ve koltuk bölümü yok; tanım ayrım yapmaz (açık nokta). Müdürün listesinde
  her sınavın durumu: **"Planlı"**, **"Sonuç bekliyor"**, **"Sonuç girildi"** ([Okulun sınavları](okulun-sinavlari.md)).
- Tanıma göre hatırlatma saatini (varsayılan sınavdan 1 gün önce 19:00) **okul ayarlayabilir**; bu ayarın yeri tasarımda yok.

### Öğrenci

1. Gelecek sınav **"Sınavlarım"**da görünür: sağında **"Sonuç yok"**; dokununca "Sınav ayrıntısı" penceresinde bilgiler ve tablo
   yerine **"Sınav 15 Ekim 2026 Perşembe 10:10 (3. ders) tarihinde yapılacak."** ([Sınav ayrıntısı](sinav-ayrintisi.md)).
2. Takvimde ("Sınav" türüyle) ve ajandada ("Fen 1. yazılı" ve altında "Fen Bilimleri · 3. ders · Ali Yıldız") görünür. Önizlemede öğrencinin ana sayfasında sınav satırı yoktur (orada
   "Yaklaşan ödevler" ve "Bugünkü dersler" durur).
3. Tanıma göre salon ve sıranı görürsün: **"Salon 3, sıra 14"** (önizleme öğrencide salonu ve sırayı çizmedi).
4. Sınavdan bir gün önce saat 19:00'da hatırlatma bildirimi gelir; tarih değişirse bildirim gelir.

### Veli

- Çocuğunun gelecek sınavlarını o çocuğun oturumunda ana sayfadaki "Yaklaşanlar"da ("15 Eki · Fen 1. yazılı · 1. dönem"),
  takvimde ve ajandada görür; tanıma göre salonu ve sırasını da ("Salon 3, sıra 14").
- Hatırlatma ve tarih değişikliği bildirimleri veliye de gelir.

## Kurallar ve sınırlar

- **Tanım (spec-mesaj-ajanda §4, kullanıcının 27 Eylül isteği):**
  - sınav açarken (bugünkü şablon ve değer alanlarına ek): tarih, başlangıç saati, süre (dakika), ders, sınıflar, yer (salon ya
    da sınıf adları ve kapasiteleri) ve koltuk dağıtımı;
  - koltuk dağıtımı **isteğe bağlı**: otomatik (okul no / ada göre / karışık; salon kapasitelerine göre sıra numarası) ya da elle;
  - "Gelecek sınavlar" ve "Olmuş sınavlar"; başlangıç + süre geçince kendiliğinden "olmuş" ve not girişi açılır; tarihi olmayan
    eski sınavlar "olmuş";
  - düzenlenebilir ve silinebilir; not girilmiş sınavı silmek onay ister; tarih değişirse öğrencilere ve velilere bildirim;
  - ajandaya kendiliğinden girer; öğrenciye ve veliye otomatik hatırlatma (1 gün önce 19:00; okul ayarlayabilir); takvimin ay
    görünümünde "Sınav" türüyle;
  - oturma listesi yazdırılabilir (salon salon, sıra no, öğrenci adı).
- **Önizlemenin farkları:** önizlemede salon seçmek zorunlu ve koltuk hep "Otomatik" ya da "Elle" (koltuksuz seçenek yok); tanım
  koltuğu isteğe bağlı sayar. Salon listesinin nereden geldiği (okulun salonlarını kim, nerede tanımlar) tanımlanmadı.
- **Süre:** 5–240 dakika (önizleme).
- **Sıra numarası:** elle dağıtımda 1–200; aynı salonda aynı sıra iki kez verilemez.
- **Saat:** Türkiye saati; sınavın ders saatine denk geldiği yerlerde ders numarası da yazılır ("10:10 (3. ders)").
- **Bugünkü sitede:** sınavın yalnız günü var; takvimdeki "Sınav" türü yalnız takvim yetkilisinin elle eklediği bir etkinliktir,
  sınav kaydına bağlı değildir ([Takvime ekle](../takvim/etkinlik-ekleme.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Yeni sınav açma](yeni-sinav.md) — planlama alanlarının olduğu pencere.
- [Sınavlar listesi](sinavlar-listesi.md) — "Gelecek sınavlar" / "Olmuş sınavlar", "Düzenle", "Sil".
- [Not (değer) girişi](not-girisi.md) — sınav bitince açılan giriş.
- [Sınav ayrıntısı](sinav-ayrintisi.md) — "Sınav tarihi" ve yapılacak sınavın penceresi.
- [Sonuç bildirimi ve sonuçların görünmesi](sonuc-bildirimi.md) — tarih değişikliği ve hatırlatma bildirimleri.
- [Okulun sınavları](okulun-sinavlari.md) — müdürün planlı sınavları.

**İlgili:**

- [Ajanda](../takvim/ajanda.md), [Ay görünümü](../takvim/ay-gorunumu.md), [Takvime ekle](../takvim/etkinlik-ekleme.md).
- [Otomatik bildirimler](../bildirim/otomatik-bildirimler.md), [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md).
- [Ders saatleri ve ders programı](../ders-programi/program-kurma.md) — saatin ders numarasıyla yazılması.

## Kod tarafı

- Bugün bu özelliğin kodu yok. Bugünkü sınav kaydı: `sinavlar.tarih` yalnız gün (`date`); saat, süre, salon ve koltuk alanı yok
  ([sunucu/veri/depo/sinavlar.md](../../sunucu/veri/depo/sinavlar.md), [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).
  Sınav ucu [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) (`POST /api/exams`, `tarihDogrula`); takvim
  [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md) ve [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md)
  (elle "Sınav" türü); zamanlı bildirimler için var olan hatırlatma işi ([sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md)
  `hatirlatmaIsaretle`).
- Kodlanınca bu belgenin "Durum" satırı ve bu bölüm güncellenir.

## Sık sorulanlar

- **Sınavın saatini nereye yazıyorum?** Bugün yazılmıyor; tasarımda "Sınav aç"taki "Tarih ve saat" ve süre kutusuna.
- **Değer gir düğmesi neden yok?** Tasarımda sınav bitmeden (başlangıç + süre) değer girişi açılmaz; sınav "Olmuş sınavlar"a geçince
  gelir.
- **Bir sınıf salona sığmıyor.** Bir salon daha seç; altındaki satır kaç kişilik yer olduğunu söyler.
- **Sınavın tarihini değiştirdim, öğrenciler haber alır mı?** Tasarımda evet: tarih ya da saat değişince öğrencilere ve velilere
  bildirim gider.

## Sırada

- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda + hatırlatıcı, ödev hatırlatma otomasyonu (iş 8):
  bu belgedeki her şey.
- Arayüz önizlemesi (Tasarım 1) koda geçerken: "Salon ve koltuk" bölümü, "Gelecek sınavlar" / "Olmuş sınavlar".
- Açık noktalar: salon listesinin yeri, koltuksuz seçenek, müdürün penceresinde salon, hatırlatma saatinin okul ayarı.
