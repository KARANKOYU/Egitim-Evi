# Etütler · Etüt ayrıntısı

**Durum:** Tasarlandı — henüz kodda yok

Bir etüdün satırına basınca açılan, etüdün gününü, saatini, öğretmenini, yerini, konusunu, öğrenci sayısını ve durumunu yazan pencere.

## Ne işe yarar

Bugünkü sitede etüt satırlarına basılmaz: personel satırdaki düğmeleri kullanır, öğrenci ve veli yalnız listeyi görür. Tasarımda her
etüdün tek bir ayrıntı penceresi olur; herkes aynı bilgiyi kendi gözünden görür, öğretmen ve müdür yoklamaya buradan geçer. Ayrıntı
penceresi Tasarım 1 önizlemesinde 3 Ekim'de "her etüt kendi bilgisiyle" açılacak biçime getirildi (önceki hâlinde her etüt aynı
bilgiyi gösteriyordu ve öğretmenle müdürde "Etüt yoklaması"nın yanında "Etüt planla"yı açan bir "Düzenle" düğmesi vardı; son hâlde
yalnız "Etüt yoklaması" kaldı).

## Nereden açılır

Tasarımda (Tasarım 1 önizlemesi):

- **Öğretmen ve müdür:** [Etütler sayfası](etutler-sayfasi.md) → etüdün satırı.
- **Öğrenci:** [Etütlerim](etutlerim.md) → etüdün satırı.
- **Veli:** oturumun çocuğunun "Etütler" sayfası → etüdün satırı.
- **Takvim:** günün altındaki listede saat simgeli "Etüt" satırı; takvimin altındaki ajandada etüt satırı
  ([Gün ayrıntısı](../takvim/gun-ayrintisi.md), [Ajanda](../takvim/ajanda.md)).
- **Bildirim:** velinin "Can · Yeni etüt" bildirimi ([Etüt bildirimleri](etut-bildirimleri.md)).

Bugünkü sitede karşılığı yok.

## Adım adım

### Pencerede ne var (Tasarım 1 önizlemesi)

Başlık etüdün adı ("Matematik etüdü"). Altında satır satır:

- **"Gün:"** — "Cuma 2 Ekim 2026"
- **"Saat:"** — "15:30–16:10"
- **"Öğretmen:"** — "Ayşe Kaya"
- **"Yer:"** — "204 nolu sınıf"
- **"Konu:"** — "Kesirlerle toplama tekrarı"
- **"Öğrenciler:"** — "14 öğrenci"
- **"Durum:"** — **"Planlı"** ya da **"Bitti"**; yoklaması alınmış etütte "Bitti · 9 / 10 geldi".

Etüt bulunamazsa pencerede yalnız **"Bu etüdün ayrıntısı bulunamadı."** yazar.

### Öğretmen

1. Menüden **"Etütler"** → etüdünün satırına bas.
2. Pencere yukarıdaki bilgilerle açılır; altta **"Etüt yoklaması"** düğmesi.
3. "Etüt yoklaması"na basınca yoklama penceresi açılır: etüt başlamadıysa "Etüt henüz başlamadı" bilgisi ve öğrenci listesi, başladıysa
   Geldi / Gelmedi (izinli) / Gelmedi (izinsiz) seçimi ([Etüt yoklaması](etut-yoklamasi.md)).

### Müdür

Öğretmeninkiyle aynı: Etütler → satır → ayrıntı → **"Etüt yoklaması"**. Müdür bütün etütlerin ayrıntısını görür.

### Çalışan

Tasarımda (çalışan tanımı): etüt yetkisi olan çalışan, yetkisinin gösterdiği etütlerin ayrıntısını öğretmen gibi görür; rolsüz çalışan
etütleri görmez. Önizlemede ayrı bir çalışan hesabı yok.

### Öğrenci

1. Menüden **"Etütlerim"** → etüdün satırına bas.
2. "Öğrenciler:" satırının sonunda **"· sen de varsın"**: "14 öğrenci · sen de varsın".
3. Bitmiş ve yoklaması alınmış etütte "Durum:" satırında kendi durumun: "Bitti · 9 / 10 geldi · geldin".
4. Planlı etütte altta ipucu: **"Gelemeyeceksen öğretmenine mesajla bildir; etüt yoklamasında "izinli" yazılır."**
5. "Etüt yoklaması" düğmesi çıkmaz.

### Veli

1. Oturumun çocuğunun **"Etütler"** sayfası → etüdün satırına bas.
2. "Öğrenciler:" satırında çocuğun kısa adıyla: **"14 öğrenci · Elif de var"** ("Can da var").
3. Bitmiş etütte: "Bitti · 9 / 10 geldi · Elif geldi".
4. Planlı etütte ipucu: **"Elif gelemeyecekse öğretmenine mesajla bildir; etüt yoklamasında "izinli" yazılır."**

### Pencereyi kapatma

Pencere sağ üstteki kapat düğmesiyle ("Kapat"), Esc tuşuyla ya da pencerenin dışına basarak kapanır; altındaki liste yerinde kalır. Android uygulamasında geri tuşu önce açık
ayrıntıyı kapatır ([Android geri tuşu](../uygulama/geri-tusu.md); uygulama tanımı "etüt ayrıntısı"nı adıyla sayar).

## Kurallar ve sınırlar

- **Kim hangi etüdü açar:** listesinde gördüğü etüdü. Öğretmen öğretmeni olduğu etütleri (yetkisi varsa bütün etütleri), müdür bütün
  etütleri, öğrenci kendi etütlerini, veli oturumun çocuğunun etütlerini.
- **"Etüt yoklaması" düğmesi** yalnız öğretmende ve müdürde çıkar; öğrenci ve velide çıkmaz.
- **Öğrenci adları** pencerede yazmaz, yalnız sayı yazar; öğrenci ve veli öbür öğrencilerin adlarını görmez. Öğretmen adları yoklama
  penceresinde görür.
- **Durum değerleri:** "Planlı" (henüz yapılmadı), "Bitti" (tarihi geçti). Öğretmenin listesinde yoklaması kaydedilmiş planlı etüt ayrıca
  "Yoklama alındı" rozetiyle görünür.
- **Konu:** önizlemedeki etütlerin bir "Konu"su var ("Kesirlerle toplama tekrarı"). Bugünkü kodda etütte konu alanı yok; önizlemedeki
  "Etüt planla" penceresinde de konu kutusu yok, planlanan etüdün konusu kendiliğinden "<Ders> konuları" (serbest çalışmada "Serbest
  çalışma") yazılır. Konunun nereden girileceği kodlanırken kararlaşacak.
- **Tarihli gösterim:** ayrıntı etüdü tarihiyle ("Cuma 2 Ekim 2026") gösterir; bugünkü kodda etüt her hafta tekrarlanır ve tarihi yoktur.
  Haftalık ve tek seferlik etüt ayrımı etüt planlama tanımında öneri olarak durur ([Boş zaman ızgarası](bos-zaman-izgarasi.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Etütler](README.md)):

- [Etütler sayfası](etutler-sayfasi.md) — personelin listesi; satıra basınca bu pencere.
- [Etütlerim](etutlerim.md) — öğrencinin ve velinin listesi.
- [Etüt yoklaması](etut-yoklamasi.md) — "Etüt yoklaması" düğmesinin açtığı pencere.
- [Boş zaman ızgarası](bos-zaman-izgarasi.md) — yeni planlanan etüdün bilgileri.
- [Etüt bildirimleri](etut-bildirimleri.md) — ayrıntıyı açan "Yeni etüt" bildirimi.
- [Etüt açma](etut-acma.md), [Etüdü düzenleme ve silme](etudu-duzenleme-ve-silme.md), [Etüt yetkileri ve hazır roller](etut-yetkileri.md),
  [Etüdün öğrencilerini seçme](ogrenci-secme.md).

**İlgili:**

- [Gün ayrıntısı](../takvim/gun-ayrintisi.md), [Ajanda](../takvim/ajanda.md) — etüdün takvimdeki satırı.
- [Yeni mesaj ve alıcı seçimi](../mesaj/yeni-mesaj.md) — "öğretmenine mesajla bildir".
- [Android geri tuşu](../uygulama/geri-tusu.md) — ayrıntıyı kapatma.
- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca dayanacağı yerler:

- Sunucu: [sunucu/bolumler/etut.md](../../sunucu/bolumler/etut.md) — personel için `GET /api/etut/detay?id=` (etüt ve öğrencileri;
  etüt düzenleme yetkisi ya da yoklama alabilme gerekir, değilse "Bu etüdü görme yetkin yok"); öğrenci ve veli için `GET
  /api/etut/ogrenci` (etütler ve yoklamalar). Konu ve tarih alanları için tabloya ve uca ekleme gerekir.
- Ön yüz: [public/js/parcalar/18b-etut.md](../../public/js/parcalar/18b-etut.md) — bugün satırlar tıklanmaz; ayrıntı penceresi buraya
  eklenir.
- Tasarım: Tasarım 1 önizlemesindeki etüt penceresi (öğretmen/müdür görünümü ve öğrenci/velide "sen de varsın", "Elif de var" dil
  düzeltmesiyle).

## Sık sorulanlar

- **Ayrıntıda öbür öğrencilerin adları neden yok?** Öğrenci ve veli yalnız sayıyı görür; adlar etüdün öğretmeninde ve yetkilide
  (yoklama penceresinde).
- **Etüde gelemeyeceğim, ne yapayım?** Ayrıntıdaki ipucu gibi: öğretmenine mesajla bildir; öğretmen yoklamada "izinli" yazar.
- **Bugünkü sitede ayrıntı neden açılmıyor?** Henüz kodda yok; bugün öğrenci ve veli bilgileri listede, personel düğmeleri satırda görür.

## Sırada

- Etüt planlama (öneri, 29 Eylül; Tasarım 1 önizlemesi): satıra basınca açılan etüt ayrıntısı, ayrıntıdan "Etüt yoklaması", takvim ve
  ajandadan açılma; etüde konu ve tarih alanı.
- Android uygulaması: geri tuşunun açık ayrıntıyı kapatması.
- Çok dil: pencere metinleri çeviri kataloğuna girecek.
