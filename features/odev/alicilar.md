# Ödevler · Kime verilecek (sınıf ve öğrenci seçimi)

**Durum:** Kodda var; tasarımda ek olarak bölüm açılır kapanır bir düğme olur ve her sınıf ayrıca açılıp öğrencileri gösterir ("k / L seçili") (Tasarım 1 önizlemesi).

"Yeni ödev" penceresinde ödevin hangi sınıflardaki hangi öğrencilere gideceğini kutucuklarla seçmek.

## Ne işe yarar

Kullanıcı 29 Ağustos'ta tarif etti: "ödev verilecekler'e basınca tüm sınıflar var, tıklayınca öğrenciler ve yanında
checkbox; işaretlerse o ödev o öğrenciye gider; tümünü seç, tümünü kaldır da olsun"; öğretmen birden çok sınıf
seçebilsin. Böylece aynı ödevi bütün sınıfa, birkaç sınıfa ya da yalnız birkaç öğrenciye (ör. telafi ödevi) verirsin.

## Nereden açılır

[Yeni ödev](odev-verme.md) penceresinin ortasındaki **"Ödev verilecekler"** bölümü. "Ödevi düzenle"de bu bölüm yoktur:
verilmiş ödevin öğrencileri değişmez.

## Adım adım

### Bölümde ne var (bugünkü site)

- Başlık **"Ödev verilecekler"**, yanında **"Tümünü seç"**, **"Tümünü kaldır"** ve sayaç **"0 öğrenci seçili"**.
- Altında senin ders verdiğin her sınıf bir kutu: sınıfın onay kutusu, kalın sınıf adı ("6-A") ve yanında **"24 öğrenci"**;
  altında o sınıfın öğrencileri adlarıyla, her birinin kendi onay kutusu.
- Sınıfta hiç öğrenci yoksa sınıf "0 öğrenci" diye görünür.

### Öğretmen

1. Bütün sınıfa vermek için **sınıfın kutusunu** işaretle: o sınıfın bütün öğrencileri seçilir.
2. Birkaç öğrenciyi çıkarmak için onların kutusunu kaldır: sınıfın kutusu **yarım işaretli** (çizgili) olur.
3. Yalnız birkaç öğrenciye vermek için sınıf kutusuna dokunmadan öğrencileri tek tek işaretle.
4. Başka sınıfları da aynı yolla ekle; ödev hepsine tek ödev olarak gider.
5. **"Tümünü seç"** bütün sınıfların bütün öğrencilerini, **"Tümünü kaldır"** hepsini kaldırır.
6. Sayaç her değişiklikte güncellenir: **"52 öğrenci seçili"**.
7. "Ödevi ver"e bastığında hiç öğrenci seçili değilse pencere **"En az bir öğrenci seç."** der.

Tasarımda (Tasarım 1 önizlemesi):

- Bölüm kapalı gelir: tek satırlık **"Ödev verilecekler"** düğmesi, sağında **"N öğrenci seçili"** ve açma oku.
- Açınca üstte **"Tümünü seç"** ve **"Tümünü kaldır"**; altında sınıflar: solda sınıfın kutusu (hepsi seçiliyse dolu, bir
  kısmı seçiliyse yarım), sağda sınıfın düğmesi **"7-A · 12 / 28 seçili"** ve oku. Sınıfın düğmesine basınca öğrencilerin
  adları kutucuklarıyla açılır (kullanıcının "sınıfa tıklayınca öğrenciler" isteği).
- Hiç öğrenci seçmeden "Ödevi ver"e basılırsa **"Ödevin gideceği en az bir öğrenci seç."** çıkar ve bölüm kendiliğinden
  açılır.
- "Ödevi düzenle"de bölümün yerinde salt bir satır: **"Verilecekler: 7-A · 28 öğrenci · verilmiş ödevin öğrencileri
  değişmez"**.

### Çalışan

Ek rolündeki "Ödev verir" yetkisi belli sınıflarla sınırlıysa listede yine ders verdiğin sınıfların hepsi görünür, ama kapsam
dışındaki bir sınıfın öğrencisini seçip "Ödevi ver"e basınca **"6-A için ödev verme yetkin yok"** çıkar
([Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md)). Tasarımda öğretmen olmayan çalışan ödev vermez.

## Kurallar ve sınırlar

- **Kimler listelenir.** Öğretmende: ders verdiğin sınıflar ve o sınıfların öğrencileri (müdürün seni derse atadığı
  sınıflar). Hiç sınıfın yoksa pencere form yerine **"Ödev verebileceğin öğrenci yok. Müdürünün seni bir sınıfın dersine
  ataması gerekiyor."** der. Sunucu müdür için okulun bütün öğrencilerini ve sınıfı olmayanları **"Sınıfsız öğrenciler"**
  başlığıyla listeler; müdürün ekranında ödev verme düğmesi olmadığı için bu bugün görünmez.
- **Yalnız ulaşabildiğin öğrenci.** Sunucu gelen öğrenci listesini senin ulaşabildiğin öğrencilerle kesiştirir; başka sınıfın
  ya da başka okulun öğrencisi atılır. Hiçbiri kalmazsa **"Seçtiğin öğrencilere ödev veremezsin"**; liste hiç boşsa
  **"En az bir öğrenci seç"**.
- **Ders ve sınıf uyumu.** Seçtiğin öğrencilerin sınıflarından en az birinde ödevin dersi okutulmalı: **"Seçtiğin
  öğrencilerin sınıfında Matematik dersi yok"**.
- **Sınıf kaydı.** Ödev, seçilen öğrencilerin sınıflarıyla birlikte saklanır; müdürün ders ders görünümü ödevi bu sınıflar
  üzerinden derse bağlar ([Müdürün ödev görünümü](mudurun-odev-gorunumu.md)). İki sınıfa verilen ödev müdürün ekranında her iki
  sınıfın dalında görünür, her dalda yalnız o sınıfın öğrencileri sayılır.
- **Sonradan değişmez.** Ödev verildikten sonra öğrenci eklenemez, çıkarılamaz. Ödevden sonra sınıfına gelen öğrenciye ödev
  gitmez; sınıfından ayrılan öğrencinin kaydı ödevde kalır ve kontrol ekranında adıyla görünür (hesabı silindiyse
  "(silinmiş öğrenci)").
- **Okulun özellikleri ve yıl.** Ödevler kapalı okulda ya da geçmiş yıla bakarken pencere hiç kaydetmez
  ([Ödev verme](odev-verme.md) kuralları).

## Kardeşler ve ilgili

**Kardeşler:** [Ödev verme](odev-verme.md) · [Sonuçlandırma](sonuclandirma.md) (seçtiğin öğrenciler kontrol ekranında
alt alta) · [Açıldı / açılmadı](acilma-bilgisi.md) · [Müdürün ödev görünümü](mudurun-odev-gorunumu.md).

**İlgili:** [Ders atama](../siniflar-dersler/ders-atama.md) (öğretmeni sınıfın dersine atamak),
[Sınıf sayfası](../siniflar-dersler/sinif-sayfasi.md), [Öğrenci nakli](../hesaplar/ogrenci-nakli.md),
[Ders ve sınıf daraltması](../roller-yetkiler/ders-ve-sinif-daraltmasi.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) — `odevYeniModal`
  (`.hedef-liste`, `input.sinif-kutu`, `input.ogrenci-kutu`, sınıfsız grup için `yok<sıra>` anahtarı), `odevSecimBagla`
  (sayaç, yarım işaret). "Tümünü seç / kaldır" ve "Ödevi ver" denetimi
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`odev-tumu`, `odev-hicbiri`, `odev-kaydet`).
- Sunucu: [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) — `GET /api/assignments/hedefler` (`classes` + öğrenciler,
  "Sınıfsız öğrenciler"), `POST /api/assignments` (öğrenci kesişimi, sınıfların çıkarılması, ders var mı, `odev.ver` her sınıf
  için); [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`ogretmeninOgrencileri`, `ogretmeninSiniflari`).
- Depo: [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) — `odev_ogrencileri`, `odev_siniflari`.
- Görünüm: `public/css/parcalar/17-odev-secim.css` (`.secim-ust`, `.hedef-liste`, `.hedef-sinif`; [CSS.md](../../public/css/parcalar/CSS.md)).
- Testler: [testler/test-kapsam.md](../../testler/test-kapsam.md) ("ODEV KAPSAMI": `hedefler`, izinli/izinsiz sınıf).

## Sık sorulanlar

- **Bir öğrenciyi sonradan ödeve ekleyebilir miyim?** Hayır; aynı ödevi o öğrenciye ayrıca ver.
- **Listede bir sınıfım görünmüyor.** O sınıfın dersine atanmamışsın; müdürüne söyle.
- **Sınıf kutusu neden yarım işaretli?** O sınıftan bazı öğrenciler seçili, bazıları değil.

## Sırada

- Çalışan olarak ekleme: öğretmen olmayan çalışan bu listeye hiç ulaşmayacak.
- Tasarımdaki açılır kapanır sınıf listesi.
