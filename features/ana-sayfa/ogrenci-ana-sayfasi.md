# Ana sayfa · Öğrencinin ana sayfası

**Durum:** Kodda var; tasarımda ek olarak başlıkta bugünün tarihi ve günün özeti ("7-A · bugün 2 ödevin var · şu an 3. ders: Matematik (10:10–10:50)"), altı kutucuk (Ödevler, Sınavlarım, Mesajlar, Ders programı, İlerleyişim, Devamsızlık; Ayarlar kutucuğu yok), iki sütun ("Yaklaşan ödevler" ve "Bugünkü dersler"), seriyi bozan ödevin adını da yazan seri şeridi ve öğrencinin ikinci kurumunun (dershane) kendi ana sayfası (Tasarım 1 önizlemesi).

Öğrencinin girişten sonra ilk gördüğü sayfa: ödev serisi, renkli kutucuklar ve henüz bitmemiş ödevleri bir arada.

## Ne işe yarar

Okula giren öğrenci "bugün ne var?" sorusunun cevabını tek bakışta görsün diye: kaç aktif ödevin olduğu, sınavları, not
ortalaması ve ödev serisi. Bütün bölümlere buradan, kutucuklara basarak geçersin. Öğrenci hesabını okul açar; ana sayfa hep
okulunun (tasarımda o anki kurumun) ana sayfasıdır.

## Nereden açılır

- **Girişten sonra kendiliğinden.** Öğrenci okulunun adresinden (`/school/<okulun-adı>`) girer; adres çubuğunda başka bir
  sayfa istenmemişse ilk açılan sayfa budur.
- **Sol menünün ilk satırı:** **"Ana Sayfa"** (ev simgesi). Tasarımda menü satırının adı **"Ana sayfa"** ([Sol menü](../menu-ve-arama/sol-menu.md)).
- Tasarımda ayrıca üst şeritteki ev (⌂) düğmesi her zaman bulunduğun oturumun ana sayfasına götürür
  ([Geri, ileri ve ev düğmeleri](../menu-ve-arama/geri-ileri-ve-ev.md)).

## Adım adım

### Öğrenci

**Bugünkü kodda gördüğün sıra (yukarıdan aşağı):**

1. Okulunda birden çok eğitim yılı varsa en üstte **"Eğitim yılı"** seçicisi durur; geçmiş bir yıla bakıyorsan yanında
   **"Geçmiş yıla bakıyorsun — kayıtlar salt okunur."** yazar ve ana sayfa o yılın ödevleriyle çizilir
   ([Geçmiş yıl](../egitim-yili/gecmis-yil.md)).
2. Büyük başlık **"EĞİTİM EVİNE HOŞ GELDİNİZ"**, altında **"Merhaba Elif, bugün ne öğreneceksin?"** (hesabındaki adın
   yalnız ilk kelimesi).
3. Okulunda "Ödevler" bölümü açıksa başlığın hemen altında **ödev serisi şeridi**: alev simgesi, büyük sayı ve altında
   **"ödev serin"**; yanında **"Arka arkaya 4 ödevi yaptın. Böyle devam!"** ya da uyarı ("Dikkat! Son ödevin "Yaptı" olmadı. Bir
   sonrakini de yapmazsan serin bozulur.") ya da bozulma ("Serin bozuldu: …") metni; en uzun serin daha büyükse
   **"En uzun serin: 7"**. Hiç sonuçlanmış ödevin yoksa şerit çıkmaz. Ayrıntısı [Ödev serisi](../odev/seri.md).
4. Dört renkli kutucuk ([Kutucuklar](kutucuklar.md)):

   | Kutucuk | Renk | Alt yazı | Sağ üstteki sayı | Bastığında |
   |---|---|---|---|---|
   | **Ödevler** | turuncu | "3 aktif ödev" ya da "Aktif ödev yok" | aktif ödev sayısı (yoksa yok) | [Ödevler](../odev/liste.md) |
   | **Sınavlarım** | mavi | "2 sınav grubu" | — | [Sınavlarım](../sinav/sinavlarim.md) |
   | **İlerleyişim** | camgöbeği | "Ortalama 85.5" ya da "Not girilmedi" | — | [İlerleyişim](../ilerleyis/ilerleyisim.md) |
   | **Ayarlar** | gri | "Hesabın ve veli kodun" | — | [Ayarlar](../ayarlar/hesap-ayarlari-sayfasi.md) |

5. Altında **"Yaklaşan ödevler"** başlığı ve durumu "aktif" olan bütün ödevlerin listesi (sayı sınırı yok; sunucunun verdiği
   sırayla, yani en son verilen en üstte). Hiç aktif ödevin yoksa onay simgesiyle **"Aktif ödevin yok. Harika!"**. Her satırda:
   - solda **yıldız** düğmesi ("Yıldızla" / "Yıldızı kaldır"; [Yıldızlama](../odev/yildizlama.md));
   - ödevin adı, quizli ödevde yanında **"Quiz"** etiketi;
   - "Matematik · Ayşe Kaya · son teslim …" (ders, öğretmen, son teslim günü ve saati);
   - açıklama (140 harften uzunsa ilk 139 harfi ve sonunda "…");
   - quizli ödevde durum: **"Quiz: çözmedin"**, **"Quiz: devam ediyor"** ya da **"Quiz: bitirdin · sonuç henüz açılmadı"**
     (sonuç açılınca puanı);
   - sağda kalan süre etiketi: **"Süresi doldu"** (kırmızı; teslim saati geçmiş ama öğretmen henüz sonuçlandırmamış),
     **"Bugün 12:00'e kadar"** (turuncu), **"1 gün kaldı"** (turuncu), **"3 gün kaldı"** (mavi), son teslimi olmayan ödevde
     **"Aktif"** (mavi).
   Henüz açmadığın ödevin satırı turuncuya çalar ve üstüne gelince **"Henüz açılmadı"** der ([Açıldı / açılmadı](../odev/acilma-bilgisi.md)).
6. Satıra basınca ödevin penceresi açılır (ama aşağıdaki "Bilinen açık"a bak): veriliş, son teslim, sonuç, açıklama, ekler,
   quiz ve teslim dosyaların ([Ödevin penceresi](../odev/odev-penceresi.md)).
7. Sayfanın en altında alt bilgi: **"Eğitim Evi — okul yönetim sistemi"**, **"Aydınlatma metni · Bu sistem hakkında"** ve
   (ayarlanmışsa) sitenin iletişim bilgileri.

**Tasarımda (Tasarım 1 önizlemesi):**

1. Büyük başlık bugünün tarihi: **"Perşembe, 1 Ekim"**. Altında günün özeti tek satırda: **"7-A · bugün 2 ödevin var · şu an
   3. ders: Matematik (10:10–10:50)"**. "bugün N ödevin var" son günü bugün olan ve henüz sonuçlanmamış ödevlerin sayısıdır.
2. Seri şeridi: **"4 ödev yapma serisi"**, altında **"En uzun serin: 6 ödev"**. Uyarıda ve bozulunca seriyi bozan ödevin dersi,
   adı ve sonucu da yazar ([Ödev serisi](../odev/seri.md)).
3. Altı kutucuk, hepsi aynı boyda ([Kutucuklar](kutucuklar.md)):

   | Kutucuk | Renk | Alt yazı (örnek) | Sayı | Bastığında |
   |---|---|---|---|---|
   | **Ödevler** | kırmızı | "2 tanesi bugün" | bugün son günü olan ödev sayısı | [Ödevler](../odev/liste.md) |
   | **Sınavlarım** | mavi | "yeni sonuç var" | — | [Sınavlarım](../sinav/sinavlarim.md) |
   | **Mesajlar** | yeşil | "2 okunmamış" | okunmamış mesaj sayısı | [Mesajlar](../mesaj/kutu.md) |
   | **Ders programı** | turuncu | "şimdi: Matematik" | — | [Ders programım](../ders-programi/programim.md) |
   | **İlerleyişim** | camgöbeği | "ortalama 84,4" (virgüllü) | — | [İlerleyişim](../ilerleyis/ilerleyisim.md) |
   | **Devamsızlık** | mor | "bu dönem 1 gün" | — | [Devamsızlığım](../devamsizlik/devamsizligim.md) |

   **Ayarlar kutucuğu yoktur:** Hesap ayarları sağ üstteki profil menüsündedir ([Profil menüsü](../menu-ve-arama/profil-menusu.md)).
4. Kutucukların altında iki sütun (telefonda alt alta):
   - **Solda "Yaklaşan ödevler"**, başlığın sağında **"hepsi →"** (Ödevler sayfasına). Her satırda solda dersin kısaltması
     (MAT, TÜR, SOS…) renkli yuvarlakta, ödevin adı, altında "Matematik · Ayşe Kaya · son 1 Ekim 23:00", sağda kalan süre:
     **"Bugün 23:00'e kadar"**, **"2 gün kaldı"**, **"7 gün kaldı"**. Satıra basınca ödevin penceresi açılır.
   - **Sağda "Bugünkü dersler"**, sağında **"hepsi →"** (Ders programına). Her ders bir satır: solda **"1. ders"**, ortada dersin
     adı, altında "08:30–09:10 · öğretmenin adı"; şu anki ders vurgulu ve adının yanında **"· şu an"**. O gün programda olmayan
     ders saati listeye girmez.
5. Uygulamayı kurmamışsan başlığın altında bir kez **"Eğitim Evi'ni telefonuna kur"** kartı ("Uygulamayı indir" ve
   "Bir daha gösterme"; [Telefonuna kur kartı](../uygulama/telefonuna-kur-karti.md)); tarayıcı bildirim izni sormadıysa sayfanın
   en üstünde **"Bildirimlere izin ver"** şeridi ("İzin ver" / "Şimdi değil"; [Telefon bildirimi](../bildirim/telefon-bildirimi.md));
   başlığın önünde **"Yenile"** düğmesi ([Yenile düğmesi](../menu-ve-arama/yenile-dugmesi.md)).
6. **İkinci kurumun ana sayfası.** Öğrenci aynı hesapla hem okulda hem bir dershanede olabilir (tasarım;
   [Öğrencide birden çok kurum](../portallar/ogrencide-portallar.md)). Dershane oturumuna geçince ana sayfa başkadır:
   - başlık kurumun adı **"Örnek Dershanesi"**, altında **"7. sınıf B grubu · hafta sonu dersleri · Cumartesi ve Pazar
     09:00–12:10"**; kutucuk yok;
   - solda **"Bu Cumartesi · 3 Ekim"** (o günün dersleri: "1. ders · Matematik · 09:00–09:40 · öğretmen · 201 nolu sınıf";
     "hepsi →" Ders programına);
   - sağda **"Ödevler"** (teslimi bekleyen ödevler: ders, öğretmen, son gün ve **"Teslim bekleniyor"**; sonuçlananlar —
     "Yaptı", "Eksik" — yalnız dershanenin Ödevler sayfasında; "hepsi →" Ödevlere) ve **"Deneme sınavları"**
     (yaklaşanda yer ve "Kayıt açık" / "Kayıtlısın", olmuşta puan ve "grupta 4 / 26"; "hepsi →" Deneme sınavlarına;
     [Dershane denemeleri](../sinav/dershane-denemeleri.md)).
7. **Tanımda olup önizlemede çizilmeyenler** (Tasarlandı):
   - **Eğitim içerikleri öneri şeridi:** ana sayfada kendi sınıf düzeyinin son ve önerilen videoları ve "Tümünü gör"
     ([Ana sayfadaki öneri şeridi](../egitim-icerikleri/ana-sayfa-seridi.md)).
   - **Mezun olunca:** ana sayfa "Mezun oldun" boş ekranıdır; hiçbir kurumda aktif kaydın kalmazsa mezun kartı(ları) ve
     "Şu an kayıtlı olduğun bir kurum yok" (yıl geçişi tanımı; [Mezunlar](../egitim-yili/mezunlar.md)).

## Kurallar ve sınırlar

- **Tek istek.** Sayfanın içeriği (ödevler, sınav grupları, ödev serisi) tek istekten, `GET /api/progress`'ten gelir. Bir okulun
  300 öğrencisinin aynı ağdan bu sayfanın isteklerini (eğitim yılı, site bilgisi, ilerleyiş, bildirimler) yapması denenmiştir;
  sunucu "çok istek" (429/503) vermez.
- **"Aktif"** = öğretmenin henüz sonuçlandırmadığı ödev. Son teslim saati geçmiş ama sonuçlanmamış ödev listede kalır,
  "Süresi doldu" etiketiyle.
- **Bölüm kapalıysa** ([Kapalı bölüm](../ozellikler/kapali-bolum.md)): okul "Ödevler"i kapattıysa seri şeridi ve Ödevler
  kutucuğu çıkmaz; "Sınavlar"ı kapattıysa Sınavlarım kutucuğu düşer, İlerleyişim "Not girilmedi" der.
- **Ortalama** sınav gruplarının ortalamalarının düz ortalamasıdır (ağırlıklı değil), bir ondalığa yuvarlanır; notu olmayan
  grup sayılmaz. Hiç not yoksa "Not girilmedi".
- **Seri yalnız sana görünür**; velin ve öğretmenin görmez ([Ödev serisi](../odev/seri.md)).
- **Bilinen açıklar (kod okumasına göre, kod değiştirilmedi):**
  - **Satıra ve yıldıza basmak çoğu zaman bir şey yapmaz.** Ana sayfa listeyi çizer ama ödevleri, pencerenin ve yıldızın baktığı
    yere yazmaz. Girişten sonra "Ödevler" sayfasını hiç açmadıysan satıra basınca pencere açılmaz, yıldız değişmez; açtıysan o
    anki (eski olabilen) veriyle çalışır. Çare: "Ödevler" kutucuğuna basıp ödevi orada aç.
  - **"Yaklaşan ödevler" başlığı ödev kapalıyken de çıkar** ve altında "Aktif ödevin yok. Harika!" yazar.
  - **Ortalama noktalı yazılır:** "Ortalama 85.5" (Türkçede "85,5" olmalı; tasarımda virgüllü).
  - **Sıra son teslime göre değil:** başlık "Yaklaşan" dese de liste en son verilenden en eskiye dizilir.
  - **İlk sonucu "Yaptı" olmayan öğrencide şerit yanlış konuşur:** sonuçlanmış tek ödevin "Yapmadı" (ya da "Geç yaptı", "Eksik"…)
    ise seri 0 iken uyarı verilmez (uyarı yalnız seri 0'dan büyükken çıkar); şerit **"0 ödev serin"** ve **"Arka arkaya 0 ödevi
    yaptın. Böyle devam!"** der (sunucu `odevSerisi`, ön yüz `seriSeridi`).

## Kardeşler ve ilgili

**Kardeşler:** [Kutucuklar](kutucuklar.md) · [Velinin ana sayfası](veli-ana-sayfasi.md) (aynı ödevlerin velideki hâli) ·
[Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md) · [Müdürün ana sayfası](mudur-ana-sayfasi.md) ·
[Servisçinin ana sayfası](servisci-ana-sayfasi.md) · [Rolsüz çalışanın ana sayfası](calisan-ana-sayfasi.md) ·
[Yöneticinin ana sayfası](yonetici-ana-sayfasi.md). Klasörün özeti: [Ana sayfa](README.md).

**İlgili:**

- [Ödev listesi](../odev/liste.md), [Ödevin penceresi](../odev/odev-penceresi.md), [Ödev serisi](../odev/seri.md),
  [Yıldızlama](../odev/yildizlama.md), [Açıldı / açılmadı](../odev/acilma-bilgisi.md).
- [Quiz çözme](../quiz/quiz-cozme.md) — listedeki "Quiz" durumu.
- [Sınavlarım](../sinav/sinavlarim.md), [İlerleyişim](../ilerleyis/ilerleyisim.md), [Devamsızlığım](../devamsizlik/devamsizligim.md),
  [Ders programım](../ders-programi/programim.md).
- [Öğrencide birden çok kurum](../portallar/ogrencide-portallar.md), [Dershane denemeleri](../sinav/dershane-denemeleri.md).
- [Eğitim yılı: geçmiş yıl](../egitim-yili/gecmis-yil.md), [Mezunlar](../egitim-yili/mezunlar.md).
- [Ana sayfadaki öneri şeridi](../egitim-icerikleri/ana-sayfa-seridi.md).
- [Kapalı bölüm](../ozellikler/kapali-bolum.md).
- Rol kapısı: [Öğrenci](../roller/ogrenci.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md) — `SAYFALAR.ana`'nın öğrenci kolu,
  `genelOrtalama`; [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) — `seriSeridi`,
  `odevListesiOgrenci`, `odev-oku` ve `odev-yildiz` eylemleri (bilinen açık orada da yazılı);
  [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) — `hero`, `kutucuklar`, `bosKutu`, `yaz`
  (yıl şeridi ve alt bilgi); [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) — `kalanEtiketi`;
  [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) — "Quiz" etiketi ve durumu;
  [public/js/parcalar/16-egitim-yili.md](../../public/js/parcalar/16-egitim-yili.md) — yıl şeridi.
- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) — `GET /api/progress` (ödevler yeniden eskiye,
  sınav grupları ve ortalamaları, `seri` yalnız öğrencinin kendisine; kapalı bölümler boş gelir).
- Görünüm: `public/css/parcalar/10-ana-sayfa-kutucuklari.css`, `03-iskelet.css` (`.hero`, `h3.sb`) —
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Testler: [testler/test-okul-agi.md](../../testler/test-okul-agi.md) (300 öğrencinin ana sayfa istekleri),
  [testler/test-siniflarim.md](../../testler/test-siniflarim.md) (ödev serisi), [testler/test-ozellikler.md](../../testler/test-ozellikler.md)
  (kapalı bölümde boş liste), [testler/buton-denetimi.md](../../testler/buton-denetimi.md) (her kutucuğun bir sayfası var).

## Sık sorulanlar

- **Ana sayfamdaki ödeve basıyorum, açılmıyor.** Bilinen bir açık: önce "Ödevler" kutucuğuna bas, ödevi oradan aç; ondan sonra
  ana sayfadaki satırlar da açılır.
- **Ortalamam neden karnemdekinden farklı?** Ana sayfadaki ortalama sınav gruplarının düz ortalamasıdır; ağırlıklar ve ders ders
  ortalamalar İlerleyişim'dedir.
- **Seri şeridim yok.** Okulunda "Ödevler" bölümü kapalı olabilir ya da henüz hiçbir ödevin sonuçlanmamıştır.
- **Dershanemin ödevleri neden burada yok?** Tasarımda her kurumun ayrı oturumu ve ayrı ana sayfası olur; dershaneninkini o
  oturuma geçince görürsün.

## Sırada

- Tasarım 1'deki ana sayfa (tarihli başlık, günün özeti, altı kutucuk, "Yaklaşan ödevler" ve "Bugünkü dersler" sütunları) —
  Linux kodlaması.
- "Tek kişi tek hesap + portallar öğrencide de" (iş 19): dershane oturumunun ana sayfası.
- "Eğitim içerikleri" (iş 17): ana sayfadaki öneri şeridi.
- "Yıl geçişi" (iş 9): mezunun ana sayfası.
- Tam debug: satır/yıldız açığı, ödev kapalıyken başlık, noktalı ortalama, "Arka arkaya 0 ödevi yaptın" şeridi.
- Android uygulaması: öğrencinin ana sayfası (bugünün dersleri, yaklaşan ödevler, ödev serisi şeridi, servis durumu).
