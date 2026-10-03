# Devamsızlık ve yoklama · Okulun devamsızlığı (müdürün ekranı ve tek ders düzeltme)

**Durum:** Kodda var; tasarımda ek olarak tarih aralığı ve "Gün gün / Ders ders" görünümüyle bütün sınıfa ya da tek öğrenciye bakma, gün satırı açılınca her ders saatinin sağında açılır listeyle (Geldi · Geç · Gelmedi · İzinli; geçte dakika) anında düzeltme ve düzeltmenin işlem kaydına yazılması; ana sayfada bugünün özeti; sınıf sayfasında "Devamsızlık" sekmesi; Excel "Devamsızlık raporu"; geçmiş yılın sınıf sınıf özeti.

Müdürün bir sınıf, bir öğrenci ve bir gün seçip o günün her ders saatindeki durumu gördüğü, gerektiğinde tek tek düzelttiği ve öğrencinin
birikmiş dökümüne baktığı ekran.

## Ne işe yarar

Okul yönetimi "şu öğrenci, şu gün hangi derslere girmedi?" sorusunu yoklama listelerini tek tek gezmeden cevaplar. Veli izin belgesi
getirince "Gelmedi"yi "İzinli"ye çevirmek, yanlış alınmış bir yoklamayı düzeltmek de buradan yapılır. Kullanıcının 2 Ekim kararı
(tarih aralığı, gün gün / ders ders, süzgeç) bu ekranı da kapsar ("öğretmen, müdür, rehber"); müdürün tasarım paketi için kullanıcının
sözü: devamsızlıkta dersin sonucu **sağdaki açılır listeden** düzeltilsin.

## Nereden açılır

- **Müdür:** sol menü **"Okul Düzeni"** başlığı altında **"Devamsızlık"** (`#/devamsizlik`); ana sayfada **"Devamsızlık — Okul geneli
  yoklama özeti"** kutucuğu.
- **Çalışan:** "Okulun tüm devamsızlığını görür" yetkili öğretmen; menüde ek rolün adının (ya da **"Ek Yetkiler"**in) altında
  **"Devamsızlık"**. Sayfa ayrıca "Sınıf açar ve siler" ve öğrenci listesi yetkisi ister; "Rehber Öğretmen" ve "Nöbetçi Öğretmen"
  şablonlarında bu yok, sayfa açılmaz (aşağıda "Kurallar").
- Okulda "Devamsızlık" bölümü kapalıysa menüden ve ana sayfadan kalkar.

Tasarımda: müdürün menüsünde **"Devamsızlık"** (alt yazı **"Tarih aralığı, gün gün ya da ders ders"**); ana sayfada
**"Devamsızlık — bugün 14 öğrenci"** kutucuğu (rozet 14; 3 Ekim akşamından beri bütün kutucuklar aynı boyda) ve **"Bugün dikkat"** kutusu; **"Sınıflar"** → bir sınıf → **"Devamsızlık"**
sekmesi; **"Excel aktarım"** → **"Dışarı aktar"** → **"Devamsızlık raporu"**; **"Eğitim yılı"** → geçmiş yıl → **"Devamsızlık"** sekmesi.

## Adım adım

### Müdür (bugünkü site)

1. **"Devamsızlık"**ı aç. Başlık **"DEVAMSIZLIK"**. Üstteki kartta:
   - **"Sınıf"** — okulun sınıfları (ilk açılışta ilk sınıf seçili);
   - **"Öğrenci"** — önce **"Yükleniyor..."**, sonra sınıfın öğrencileri ada göre (ilk öğrenci seçili);
   - **"Gün"** — tarih kutusu (ilk açılışta bugün);
   - **"Bugün"** düğmesi — günü bugüne çeker;
   - altında seçili günün adı: **"25 Eylül 2026, Cuma"**.
2. Seçili günün kartı: başlık **"Elif Yılmaz · 25 Eylül 2026, Cuma"**, ipucu **"O gün programdaki dersler. Sağdaki kutudan durumu
   değiştirebilirsin."** Her ders saati bir satır: solda **"Ders 1"**, ortada ders adı ve **"08:30 – 09:10 · Ayşe Kaya"** (saat ve dersin
   öğretmeni), sağda açılır kutu (**"Geldi"**, **"Gelmedi"**, **"Geç geldi"**, **"İzinli"**). O gün kaydı olmayan ders **"Geldi"**
   seçili gelir.
3. Bir dersin durumunu değiştirmek için açılır kutudan yenisini seç; ayrıca kaydet düğmesi yok. Kutu kayıt bitene kadar kilitlenir, sonra
   kartın altında yeşil **"Kaydedildi."** yazar (6 saniye sonra kaybolur) ve aşağıdaki özet yenilenir. Hata olursa gün hemen yeniden
   yüklenir ve kutu gerçek duruma döner; kırmızı ileti bu yeniden çizimle silindiği için hata nedeni ekranda kalmaz (bilinen açık).
4. Durum değiştiyse ve yeni durum "Geldi" değilse öğrenciye ve velisine bildirim gider (saatsiz: "… bugün Matematik dersine gelmedi
   (izinli)."; ["Gelmedi" bildirimi](devamsizlik-bildirimi.md)).
5. Sayfanın altında **"Dönem özeti"** kartı: öğrenci seçilmeden önce **"Öğrenci seçince burada birikimi görürsün."**; seçince dört sayı
   kutusu **"Gelmedi"**, **"Geç geldi"**, **"İzinli"**, **"Toplam"** ve **Tarih / Ders / Durum / Not** tablosu (tarih "25 Eylül 2026,
   Cuma" biçiminde). Kayıt yoksa **"Hiç devamsızlık kaydı yok."**
6. Sınıf değiştirince öğrenci listesi yeniden gelir; öğrenci değiştirince gün ve özet; gün değiştirince yalnız gün.
7. Boş durumlar: o gün sınıfın programında ders yoksa **"Cuma günü bu sınıfın programında ders yok."**; sınıfta öğrenci yoksa öğrenci
   kutusunda **"Bu sınıfta öğrenci yok"**, altta **"Bu sınıfa öğrenci yerleştirilmemiş."**

### Çalışan (bugünkü site)

"Okulun tüm devamsızlığını görür" yetkisi ve sayfanın istediği öbür yetkiler varsa (ör. "Müdür Yardımcısı" şablonu: "Sınıf açar ve siler",
"Öğrenci bilgilerini düzenler") ekran müdürünkiyle aynı açılır. Farkı: açılır kutu yalnız **kendi dersinde** (ya da müdürün ona "Yoklama
alır" yetkisini açıkça verdiği ders/sınıfta) çıkar; öbür derslerde durum yalnız renkli etiket olarak görünür.

### Öğretmen (bugünkü site)

Bu ekran öğretmende yok. Öğretmen, girdiği dersin öğrencisinin dökümünü öğrencinin portalından ("Devamsızlığı") görebilir
([Devamsızlığım](devamsizligim.md)); kendi dersinin yoklamasını [Ders yoklaması](ders-yoklamasi.md)ndan düzeltir.

### Tasarımda (Tasarım 1 önizlemesi)

**Müdür — "Devamsızlık" sayfası**

1. Üstte **"Başlangıç – Bitiş"** ve hazır çipler (**"Bugün"**, **"Bu hafta"**, **"Bu ay"**, **"Bu dönem"**), **"Sınıf"** (okulun bütün
   sınıfları) ve **"Öğrenci"** (**"Bütün sınıf"** + sınıfın öğrencileri), **"Gün gün | Ders ders"**; altında sayılı **"Süzgeç"**
   çipleri ve özet satırı (**"Bu aralıkta 28 öğrencide 6,5 gün özürsüz devamsızlık, 3 gün izinli · yarım gün 0,5 sayılır."**)
   — ayrıntısı [Tarih aralığı, gün gün / ders ders, süzgeç](tarih-araligi-ve-gorunum.md).
2. **"Bütün sınıf"** seçiliyken tabloda **Öğrenci** sütunu da vardır ve süzgeç seçilmezse yalnız "Geldi" OLMAYAN günler listelenir.
3. Gün satırına bas: o günün ders ders dökümü açılır. Her dersin yanında durum yerine **açılır liste**: **"Geldi"**, **"Geç"**,
   **"Gelmedi"**, **"İzinli"**. **"Geç"** seçiliyse yanında dakika kutusu (**"dk"**, 1–40, varsayılan 5).
4. Seçtiğin anda kaydedilir; satırın altında: **"Kaydedildi · işlem kaydına yazıldı · 4. ders (Türkçe): Gelmedi → İzinli"**
   (yalnız dakika değiştiyse **"… · 1. ders (Matematik): Geç: 5 dk → 12 dk"**). Gün açık kalır; bütün sınıfa bakarken düzelttiğin
   öğrenci seçili olur.
5. İşlem kaydına bir satır düşer: **"<müdürün adı> devamsızlığı düzeltti"** — **"Elif Yılmaz · 25 Eylül · 4. ders (Türkçe):
   Gelmedi → İzinli"** ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
6. Günün ayrıntısı düzeltmeden sonra da doğru yazılır; karışık günlerde ör. **"1., 6. derslerde yok · 2.–5. derslerde var"**, **"1. derse
   10 dakika geç · 4. derste yok"** ([Günün durumu](gun-durumu.md)).

**Müdür — ana sayfa**

- Kutucuk **"Devamsızlık — bugün 14 öğrenci"** (kırmızı, rozet 14).
- **"Bugün dikkat"** kutusunda **"14 öğrenci gelmedi · 9 izinli · 5 izinsiz · Liste"** ve **"3 sınıfta yoklama alınmadı · 2. ders · 6-B,
  7-C, 8-A · Bak"**; ikisi de "Devamsızlık" sayfasını açar ([Yoklama alınmadı uyarısı](yoklama-alinmadi-uyarisi.md)).
- Sağdaki kutu müdürün kendi dersleri yerine okulun o günkü derslerini gösterir (müdürün "Kendi derslerim"i yok).

**Müdür ve öğretmen — sınıf sayfası**

- **"Sınıflar"** (öğretmende **"Sınıflarım"**) → bir sınıf → sekmeler **"Öğrenciler · Ders programı · Dersler ve öğretmenler ·
  Devamsızlık"**. **"Devamsızlık"** sekmesi aynı ekranı o sınıf seçili açar; öğretmende sınıf seçimi yalnız girdiği sınıflardır
  ([Sınıf sayfası](../siniflar-dersler/sinif-sayfasi.md)). Sınıf sekmesinde açılır liste yok (salt okunur); düzeltme müdürün
  "Devamsızlık" sayfasındadır.

**Müdür — Excel "Devamsızlık raporu"**

- **"Excel aktarım"** → **"Dışarı aktar"** → **"Devamsızlık raporu"** (**"tarih aralığı, gün gün ya da ders ders"**) → **"Excel"**.
- Pencere **"Devamsızlık raporu · Excel"**: **"Tarih aralığı"** (iki tarih), **"Sınıf"** (**"Bütün okul"** + sınıflar), **"Görünüm"**
  (**"Gün gün"** / **"Ders ders"**); not: **"Sütunlar: Gün gün: tarih, günün durumu, ayrıntı. Ders ders: tarih, ders, durum, geç (dk).
  Gelinen günler ve dersler yazılmaz. Dosya .xlsx olarak iner; Excel, LibreOffice ve Google E-Tablolar açar."**; **"Vazgeç"**,
  **"İndir (.xlsx)"**.
- Sütunlar: gün gün **Sınıf, Öğrenci, Tarih, Günün durumu, Ayrıntı**; ders ders **Sınıf, Öğrenci, Tarih, Ders, Ders adı, Durum, Geç
  (dk)**. Dosya adı `devamsizlik-7-A-2026-09-14-2026-10-01.xlsx` (bütün okulda `devamsizlik-okul-…`).
- Hatalar: **"Bitiş tarihi başlangıçtan önce olamaz."**, **"Bu seçimle indirilecek satır yok."**
  ([Dışarı aktarım](../excel-aktarim/disa-aktarim.md)).

**Müdür — geçmiş yılın özeti**

- **"Eğitim yılı"** → geçmiş (arşiv) yıl → **"Devamsızlık"** sekmesi: **"Sınıflara göre devamsızlık"** tablosu, sütunlar **Sınıf,
  Öğrenci, Özürsüz (gün), İzinli (gün), Öğrenci başına**, en altta **"Toplam"** ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).

**Rehber ve öbür çalışanlar:** tanımda ekran "öğretmen, müdür, rehber" içindir; önizlemede rehber öğretmen hesabı yok. "Devamsızlığı
görür" yetkisi tasarımda ders ve sınıf kapsamlıdır ([Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md)).

## Kurallar ve sınırlar

- **Düzeltme hakkı:** açılır kutu, o derse yoklama alabilen kişide çıkar (müdür her ders); kaydetmede de aynı denetim: **"Bu ders için
  yetkin yok"**.
- **Tek ders, tek gün:** düzeltme yalnız seçilen öğrencinin o dersteki o günkü kaydını değiştirir (sınıfın öbür kayıtlarına dokunmaz).
  "Geldi" seçilince kayıt silinir.
- **Sınıf değiştirmiş öğrenci:** öğrenci artık o dersin sınıfında değilse ve o derste eski kaydı yoksa: **"Öğrenci bu dersin sınıfında
  değil"**; eski kaydı varsa düzeltilebilir.
- **Hata iletileri (aynen):** **"Öğrenci bulunamadı"**, **"Ders bulunamadı"**, **"Bu ders için yetkin yok"**, **"Tarih gerekli"**,
  **"İleri tarihe yoklama alınamaz"**, **"Geçersiz durum"**, **"Öğrenci bu dersin sınıfında değil"**; gün ekranını görme hakkı yoksa
  **"Bu öğrencinin kaydını görme yetkin yok"**; geçmiş yılda 409 **"Geçmiş bir eğitim yılına bakıyorsun; kayıtlar salt okunur. Değişiklik
  için üstteki yıl seçiciden aktif yıla dön."**
- **Gün programdan gelir:** ekran o günün dersi olarak öğrencinin sınıfının o gün programdaki ders saatlerini gösterir; programda olmayan
  günde ders listelenmez. Blok derste iki saat aynı kaydı gösterir (kayıt ders + gün anahtarlı).
- **"Dönem özeti" aslında yılın özetidir:** gün sınırı yok, bakılan eğitim yılının bütün kayıtları sayılır; tabloda en çok 200 satır.
  Özet yüklenemezse (ör. yetki yok) kart sessizce boş kalır. Ders okuldan silinmişse kayıt kalır ama tablonun **Ders** hücresi boş
  görünür (öğrencinin ve velinin listesinde yerine "Ders" yazar).
- **"Bugün" UTC'ye göre:** varsayılan gün ve "Bugün" düğmesi Türkiye saatiyle 00:00–02:59 arasında dünü seçer; seçilen sınıf, öğrenci
  ve gün sekme açık kaldıkça hatırlanır (ertesi gün de; çıkış yapıp başka hesapla girince de sıfırlanmaz, sınıf ve öğrenci yeni okulda
  yoksa ilk sınıf ve ilk öğrenci seçilir).
- **Okulun bütün öğrenci listesi** her sınıf değişiminde yeniden iner; büyük okulda yavaşlayabilir.
- **Sınıfsız öğrenciye** bu ekrandan ulaşılamaz (okulda hiç sınıf yoksa tersine yalnız sınıfsızlar listelenir).
- **"Okul geneli özet" ekranda yok:** kutucuk "Okul geneli yoklama özeti" der, sayfa tek öğrenciyi gösterir. Sunucuda son 30 günün
  öğrenci başına sayılarını (en çok gelmeyenden aza, en çok 300 satır) veren uç hazır ama hiçbir ekran çağırmıyor. Yetkisi yoksa:
  **"Okul geneli devamsızlığı görme yetkin yok"**.
- **Rehber ve Nöbetçi şablonunda sayfa açılmaz:** menü "Devamsızlık"ı gösterir, ama sayfa sınıf listesini "Sınıf açar ve siler" yetkisiyle
  ister; sayfada **"Bu işlem için yetkin yok"** yazar (bilinen açık).
- **İşlem kaydı:** bugün düzeltme işlem kaydına yazılmaz; tasarımda yazılır.
- **Bildirim:** bugün düzeltme bildirim üretir (değiştiyse ve "Geldi" değilse); tasarımın önizlemesi müdürün düzeltmesinde bildirim
  göstermez — ayrı karar yok.

## Kardeşler ve ilgili

**Kardeşler** ([Devamsızlık ve yoklama](README.md)): [Tarih aralığı, gün gün / ders ders, süzgeç](tarih-araligi-ve-gorunum.md) ·
[Günün durumu](gun-durumu.md) · [Ders yoklaması](ders-yoklamasi.md) · [Devamsızlığım](devamsizligim.md) ·
[Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md) · ["Gelmedi" bildirimi](devamsizlik-bildirimi.md) ·
[Yoklama alınmadı uyarısı](yoklama-alinmadi-uyarisi.md) · [Devamsızlık sınırı uyarısı](devamsizlik-siniri-uyarisi.md).

**İlgili:** [Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md) · [Sınıf sayfası](../siniflar-dersler/sinif-sayfasi.md) ·
[Dışarı aktarım](../excel-aktarim/disa-aktarim.md) · [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md) ·
[Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) · [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md) ·
[Ders programı kurma](../ders-programi/program-kurma.md) (günün dersleri programdan) · [Okulun özellikleri](../ozellikler/bolum-ac-kapat.md) ·
[Servis: yönetimin yoklama görünümü](../servis/yonetimin-yoklama-gorunumu.md) (servis yoklamasının salt okunur görünümü, ayrı).

## Kod tarafı

- Ön yüz: [public/js/parcalar/18-devamsizlik.md](../../public/js/parcalar/18-devamsizlik.md) — `SAYFALAR.devamsizlik` (süzgeç kartı,
  "Dönem özeti"), `devamsizlikBagla` (`ogrencileriYukle`, `gunuCiz`, `ozetiCiz`, `S.dvBugunGit`), `DEVAM_ADLARI`. "Bugün" düğmesi
  [25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`dv-bugun`). Menü [06-menu.md](../../public/js/parcalar/06-menu.md),
  kutucuk [08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md).
- Sunucu: [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md) — `GET /api/devamsizlik/gun`,
  `POST /api/devamsizlik/isaretle`, `GET /api/devamsizlik/ogrenci`, `GET /api/devamsizlik/ozet` (ekranda kullanılmıyor). Sınıf ve öğrenci
  listesi [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (`GET /api/school/classes` — "Sınıf açar ve siler";
  `GET /api/school/students`).
- Veri: [sunucu/veri/depo/devamsizlik.md](../../sunucu/veri/depo/devamsizlik.md) (`ogrenciGunu`, `ogrenciDersGunuYaz`,
  `okulunSonKayitlari`), [sunucu/veri/depo/siniflar.md](../../sunucu/veri/depo/siniflar.md) (`sinifinProgrami`).
- Görünüm: `.ders-satir`, `.ders-sira`, `.durum-kutu` (`22-cesitli.css`), `.durum-etiket` (`20-devamsizlik.css`), `.rapor-tablo`
  ([CSS.md](../../public/css/parcalar/CSS.md)).
- Testler: [testler/test-devamsizlik.md](../../testler/test-devamsizlik.md) (okul özeti), [testler/test-egitim-yili.md](../../testler/test-egitim-yili.md)
  (eski yılın düzeltmesi yeni yılın özetinde yok), [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md).
- Tasarım: Tasarım 1 önizlemesinin müdür modülü (açılır listeyle düzeltme, işlem kaydı satırı, Excel raporu, arşiv yılın sekmesi).

## Sık sorulanlar

- **Veli rapor getirdi, "Gelmedi"yi "İzinli" yapmak istiyorum.** "Devamsızlık" → sınıf, öğrenci, gün → o dersin kutusundan "İzinli".
  Bütün gün izinliyse her ders saatini ayrı ayrı değiştir.
- **Kutu yerine yalnız etiket görüyorum.** O derse yoklama alma hakkın yok (müdür değilsin ve ders senin değil).
- **"… günü bu sınıfın programında ders yok" diyor ama ders yapıldı.** Ekran günün derslerini ders programından alır; o gün programda
  yoksa kaydı buradan düzeltemezsin. Önce programı kontrol et.
- **Okulun bugünkü toplamını nerede görürüm?** Bugün ekranda yok (kutucuğun yazısına rağmen). Tasarımda ana sayfadaki "Bugün dikkat"
  kutusunda.
- **Rehber öğretmenimde sayfa "Bu işlem için yetkin yok" diyor.** Bilinen açık: sayfa sınıf listesi için "Sınıf açar ve siler" ister.
  Geçici çözüm öğrencinin portalından "Devamsızlığı"na bakmak.

## Sırada

- **Devamsızlık: tarih aralığı + "gün gün / ders ders" + süzgeç** (kullanıcı 2 Ekim; kod Linux'ta) — bu ekranın yeni düzeni ve açılır
  listeyle düzeltme.
- **Devamsızlık sınırı uyarısı** (kullanıcı 3 Ekim) — müdürün "Sınıra yaklaşanlar" listesi ve "Devamsızlık sınırları" ayarı.
- **Özel roller** (öneri) — "Sınıf öğretmeni" şablonu "Devamsızlığı görür"ü kendi sınıfıyla; yukarıdaki "Sınıf açar ve siler" açığı
  kapanmadan bu şablonla da sayfa açılmaz.
- **Yıl geçişi** ve **saklama süreleri** — dökümlerin hangi yılları kapsadığı.
- **Android yerel uygulama** — müdürün ana sayfasında bugünkü devamsızlık.
