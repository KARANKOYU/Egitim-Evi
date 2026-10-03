# Sınavlar · Sınavlar listesi

**Durum:** Kodda var; tasarımda ek olarak "Gelecek sınavlar" ve "Olmuş sınavlar" bölümleri, satırda sınıf, saat, süre, salon ve koltuk, "Düzenle" / "Sil", değer sayacı ve müdürün açtığı sınavda "açan:" bilgisi.

Öğretmenin (ve müdürün kendi dersleri için) açtığı bütün sınavları gördüğü, değer girişine geçtiği ve sınav sildiği liste.

## Ne işe yarar

Bir öğretmen yıl boyunca birçok sınav açar: yazılılar, testler, denemeler. Bu liste hepsini tek yerde tutar; hangisine kaç
öğrencinin değerinin girildiğini gösterir ve tek dokunuşla değer tablosunu açar. Kullanıcı 25 Eylül'de "sınavları biraz
genişleticez, sınavlarda sınav grubu olmadan da tak diye olabilecek" dedi: bu yüzden listede gruba konmuş ve konmamış
("Grupsuz") sınavlar birlikte durur. 27 Eylül'de de sınavın "yeni sınav ekle butonunda gelecek sınav olmuş sınav diye"
ayrılmasını istedi; bu ayrım tasarımda var, bugünkü sitede yok.

## Nereden açılır

- **Öğretmen:** sol menüde **"Sınavlar"** (menüde yalnız "Sınav oluşturur" ya da "Sınav notu girer" yetkin varsa çıkar),
  ana sayfada mavi **"Sınavlar"** kutucuğu (alt yazısı "Sınav grupları ve notlar"). Adres `#/ogr-sinavlar`.
- Sayfanın başlığı **"SINAVLAR"**, altında "Sınav aç, değerleri gir. Şablon seçersen alanları her sınavda yeniden
  yazmazsın." Altında üç sekme: **"Sınavlarım"** (varsayılan), **"Gruplar"**, **"Şablonlar"**. Bu belge "Sınavlarım"
  sekmesini anlatır; öbür ikisi [Sınav grupları](sinav-gruplari.md) ve [Şablonlar](sablonlar.md).
- **Müdür:** sol menüde **"Kendi Derslerim"** başlığının altındaki **"Sınavlar"**. Ekran öğretmeninkiyle aynıdır.

Tasarımda (Tasarım 1 önizlemesi):

- Öğretmenin menüsünde yine **"Sınavlar"**; sayfanın başlığı "Sınavlar", alt yazısı **"Gelecek ve olmuş sınavların; olmuş
  sınava değer girersin"**. Üstte iki çip: **"Sınavlar"** (seçili) ve **"Sınav grupları"**; sağda **"Sınav aç"** düğmesi
  ([Yeni sınav açma](yeni-sinav.md)). Ana sayfa kutucuğu "Sınavlar"ın alt yazısı duruma göre değişir (örnek: "1 değer
  girilecek").
- Müdürün menüsünden "Kendi derslerim" bölümü (Sınavlar ve Yoklama) kalkar; okulun bütün sınavları **"Okul düzeni →
  Sınavlar"** sayfasına taşınır ([Okulun sınavları](okulun-sinavlari.md)).

## Adım adım

### Öğretmen

**Listeye bakmak (bugünkü site)**

1. Menüden **"Sınavlar"**ı aç; "Sınavlarım" sekmesi açık gelir.
2. Yetkin varsa üstte **"Yeni sınav"** düğmesi, altında **"Sınavlar (N)"** başlığı.
3. Her sınav bir satır:
   - üstte sınavın adı (ör. "1. Yazılı");
   - altında "25.09.2026 · Matematik · Yazılı (0-100) · 18 öğrencinin değeri girildi" — tarih, ders, şablonun adı (şablonsuz
     sınavda şablon yerine "3 değer alanı" gibi alan sayısı) ve ana değeri girilmiş öğrenci sayısı;
   - sağda grup etiketi: grubun adı mavi (ör. "Dönem 1 - Yarıyıl 1") ya da gri **"Grupsuz"**;
   - **"Değer gir"** ve kırmızı **"Sil"** düğmeleri.
4. Hiç sınavın yoksa: **'Henüz sınav yok. "Yeni sınav" ile başla.'**
5. Üst şeritteki **"İçerik Ara"** kutusuna yazdıkça satırlar sınavın adına, şablonun adına ve grubun adına göre süzülür
   ([Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md)).

**Değer girmeye geçmek**

6. Satırdaki **"Değer gir"**e bas: sınavın öğrenci × değer tablosu açılır ([Not (değer) girişi](not-girisi.md)).

**Sınavı silmek**

7. Satırdaki **"Sil"**e bas. Tarayıcının onay kutusu: **"Bu sınav ve girilmiş bütün değerleri silinsin mi?"**
8. "Tamam" dersen sınav, alanları ve bütün değerleriyle silinir; liste yeniden çizilir (grup ekranından sildiysen grup ekranına
   dönersin). Geri alınmaz ([Silme, eğitim yılı ve saklama](silme-ve-saklama.md)).
9. "Sınav oluşturur" yetkin yoksa (ya da sınavın dersi yetkinin dışındaysa) tarayıcı uyarısıyla **"Sınav silme yetkin yok"**
   çıkar; düğme yine de görünür.

**Tasarımda (Tasarım 1 önizlemesi): gelecek ve olmuş sınavlar**

1. Sayfada iki bölüm: **"Gelecek sınavlar"** (turuncu simge) ve **"Olmuş sınavlar"** (mavi simge); başlıkların sağında
   "3 sınav" gibi sayı.
2. Gelecek sınavlar en yakını üstte, olmuş sınavlar en yenisi üstte sıralanır. Bir sınav, başlangıç saati ile süresi geçince
   kendiliğinden "Olmuş sınavlar"a geçer ([Sınav planlama](sinav-planlama.md)).
3. Her satır bir sınıfın sınavıdır:
   - solda gün ve ayın kısası ("15 Eki");
   - başlık "sınıf · sınavın adı" ("7-C · 1. yazılı");
   - altında "şablon · gün saat · süre · salon · koltuk": "Yazılı (0–100) · Perşembe 11:50 · 40 dk · Derslik 210 · koltuk: okul no
     sırasıyla" (koltuk "ada göre", "karışık" ya da "elle" de olabilir); sınavı başkası (ör. müdür) açtıysa sonuna
     " · açan: Murat Şahin".
4. Sağdaki düğmeler:
   - olmuş sınavda **"Değer gir · 12 / 14"** (14 öğrenciden 12'sinin elle girilen bütün değerleri tam); hepsi girilmişse gri,
     onay işaretli **"14 / 14 girildi"** (basınca yine tabloya gider);
   - sınavı sen açtıysan **"Düzenle"** (kalem simgesi; "Sınavı düzenle" penceresi, [Yeni sınav açma](yeni-sinav.md)) ve
     **"Sil"** (çöp simgesi). Müdürün açıp notunu sana bıraktığı sınavda bu ikisi yoktur ([Okulun sınavları](okulun-sinavlari.md)).
5. Bölüm boşsa: **"Gelecek sınav yok."** / **"Olmuş sınav yok."**
6. "Sil"de onay penceresi: başlık **“7-C · 1. yazılı” silinsin mi?** (sınıf ve sınav adı ekrandaki gibi kıvrık tırnakla), altında değer girilmiş olmuş sınavda **"12 öğrencinin
   girilmiş değerleri de silinir."**, öbür durumda **"Sınav öğrencilerin takviminden de kalkar."**; düğme **"Sil"**. Silinince
   kısa ileti: **"Sınav silindi: 7-C · 1. yazılı."**
7. Üstteki **"Sınav grupları"** çipi grup sayfasına götürür ([Sınav grupları](sinav-gruplari.md)); **"Sınav aç"** yeni sınav
   penceresini açar.

### Müdür

- Bugünkü sitede menüdeki **"Kendi Derslerim → Sınavlar"** öğretmenin ekranının aynısıdır: yalnız **senin açtığın** sınavlar
  listelenir. Müdür olsan da öğretmenlerin açtığı sınavları bu listede görmez, açamaz, silemezsin (sunucu başkasının sınavında
  "Yetkin yok" der). Öğretmenin girdiği sonuçları öğrencinin portalından görürsün ([Sınavlarım](sinavlarim.md#müdür)).
- Grupsuz sınavın dersi senin branşındır; branşın yoksa sınav **"Müdür"** dersiyle kaydolur.
- Tasarımda: bu ekran müdürde yoktur; okulun bütün sınavlarını süzgeçli bir listede görür, açar ve notu girecek öğretmeni
  seçersin ([Okulun sınavları](okulun-sinavlari.md)).

### Çalışan

- Bugünkü sitede okulda görevli herkes öğretmen hesabıyla çalışır ve okulun hazır **Öğretmen** rolünü taşır; müdür ona bir de
  ek rol (Müdür Yardımcısı, Zümre Başkanı …) verebilir. Menüde "Sınavlar" çıkması için "Sınav oluşturur" ya da "Sınav notu
  girer" yetkilerinden biri Öğretmen rolünde ya da ek rolünde açık olmalı.
- Müdür ikisini de kapatırsa menüden "Sınavlar" kalkar ama ana sayfadaki "Sınavlar" kutucuğu kalır (kutucuk yetkiye bakmaz,
  yalnız bölümün açık olmasına bakar); sayfa açılır ve eski sınavların görünür, "Yeni sınav" düğmesi çıkmaz.
- Yalnız "Sınav notu girer" yetkisi olan biri yalnız kendi açtığı sınavlara not girebildiği için listesi çoğu zaman boştur
  ([Yetkiler, kapalı bölüm ve geçmiş yıl](yetki-ve-kapsam.md)).
- Tasarımda: kişi okula "çalışan" olarak eklenir; müdür ona Öğretmen rolünü verince bu sayfayı öğretmen gibi kullanır. Rolsüz
  çalışan sınav ekranı görmez.

## Kurallar ve sınırlar

- **Kimin sınavı:** liste yalnız senin açtığın sınavları gösterir; sınav açanınındır. Müdür de başka öğretmenin sınavını bu
  ekrandan açamaz.
- **Sıra:** sınav tarihi yeniden eskiye; aynı gündekiler son açılan üstte.
- **"N öğrencinin değeri girildi":** sınavın **ana** değeri girilmiş öğrenci sayısıdır; yalnız öbür alanları girilmiş
  öğrenci sayılmaz.
- **Eğitim yılı:** liste üstteki yıl seçicide seçili yılın sınavlarını gösterir. Geçmiş bir yıla bakarken sınav açmak,
  silmek ya da değer girmek reddedilir: **"Geçmiş bir eğitim yılına bakıyorsun; kayıtlar salt okunur. Değişiklik için
  üstteki yıl seçiciden aktif yıla dön."**
- **Kapalı bölüm:** müdür okulda "Sınavlar"ı kapatırsa menü ve kutucuk kalkar; adresle açılırsa sayfada **"Bu bölüm okulunda
  kapalı. Okul müdürü Özellikler sayfasından açabilir."**, sunucu da **"Sınavlar bu okulda kapalı. Okul müdürü Özellikler
  sayfasından açabilir."** der. Kayıtlar silinmez.
- **Silme:** sınav, alanları ve değerleriyle birlikte gider; geri alınmaz, öğrenciye bildirim gitmez. Gruptaki bir sınav
  silinince grubun "Toplam etki"si o kadar düşer.
- **Tasarımda:** her satır tek sınıfın sınavıdır (birden çok sınıfa açılan sınav sınıf başına ayrı satır olur); "olmuş"
  sınavın ölçütü başlangıç + süredir, tarihi olmayan eski sınavlar "olmuş" sayılır; yalnız sınavı açan "Düzenle" ve "Sil"
  görür.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Sınavlar](README.md)):

- [Yeni sınav açma](yeni-sinav.md) — "Yeni sınav" ve tasarımdaki "Sınav aç" / "Sınavı düzenle" penceresi.
- [Not (değer) girişi](not-girisi.md) — "Değer gir"in açtığı tablo.
- [Sınav grupları](sinav-gruplari.md), [Şablonlar](sablonlar.md) — öbür iki sekme.
- [Sınav planlama](sinav-planlama.md) — gelecek / olmuş ayrımı, salon ve koltuk.
- [Okulun sınavları](okulun-sinavlari.md) — tasarımda müdürün listesi.
- [Yetkiler, kapalı bölüm ve geçmiş yıl](yetki-ve-kapsam.md), [Silme, eğitim yılı ve saklama](silme-ve-saklama.md).

**İlgili:**

- [Sol menü](../menu-ve-arama/sol-menu.md), [Kutucuklar](../ana-sayfa/kutucuklar.md),
  [Öğretmenin ana sayfası](../ana-sayfa/ogretmen-ana-sayfasi.md).
- [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md), [Bölüm aç / kapat](../ozellikler/bolum-ac-kapat.md).
- [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/12-ogretmen-sinav.md](../../public/js/parcalar/12-ogretmen-sinav.md) — `SAYFALAR['ogr-sinavlar']`,
  `sinavSekmeDugmesi`, `sinavListesi`, `EYLEMLER['sinav-sil']`; menü ve kutucuk
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (`navTanim`, `SAYFA_OZELLIK`),
  [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md); kapalı bölüm sayfası
  [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md).
- Sunucu: [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) — `GET /api/exams` (öğretmenin sınavları, yıla süzülü),
  `POST /api/exams/<id>/delete`; depo [sunucu/veri/depo/sinavlar.md](../../sunucu/veri/depo/sinavlar.md) (`ogretmenin`,
  `sil`); arşiv kapısı [sunucu/api.md](../../sunucu/api.md); kapalı bölüm
  [sunucu/bolumler/ozellikler.md](../../sunucu/bolumler/ozellikler.md).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md), [testler/test-egitim-yili.md](../../testler/test-egitim-yili.md),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) "Sınav sistemi".

## Sık sorulanlar

- **Müdürüm, öğretmenlerin sınavlarını neden göremiyorum?** Bugünkü sitede sınav açanınındır; müdür yalnız kendi açtığı
  sınavları listeler. Sonuçları öğrencinin portalından görürsün. Tasarımda "Okul düzeni → Sınavlar" okulun bütün sınavlarını
  gösterir.
- **"18 öğrencinin değeri girildi" diyor ama 20 öğrenciye bir şeyler yazdım.** Sayılan yalnız ana değeri (ör. LGS Puanı)
  girilmiş öğrencilerdir.
- **Sınavı yanlışlıkla sildim, geri gelir mi?** Hayır; silme kalıcıdır.
- **Menüde "Sınavlar" yok.** Müdür Öğretmen rolünden iki sınav yetkisini de kapatmış ya da okulda "Sınavlar" bölümü kapalı.

## Sırada

- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama (iş 8): listenin "Gelecek sınavlar" / "Olmuş sınavlar" diye
  ayrılması, satırda salon ve koltuk, "Düzenle" ve "Sil".
- Arayüz önizlemesi (Tasarım 1) koda geçerken: sekmeler yerine "Sınavlar" / "Sınav grupları" çipleri ve "Sınav aç".
- Müdürün "Okul düzeni → Sınavlar" sayfası ve "Kendi derslerim"in kalkması.
- Çalışan olarak ekleme (iş 2): rolsüz çalışanın sınav görmemesi.
