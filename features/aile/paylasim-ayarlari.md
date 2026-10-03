# Çocuğumun telefonu · Paylaşım ayarları (konum sıklığı ve aç/kapa)

**Durum:** Kodda var; tasarımda ek olarak dokununca hemen kaydedilen "Konum gönderme sıklığı" çipleri ve telefon bölümünde
"Konum: her N dakikada bir gelir" satırı.

Velinin, çocuğunun telefonunun konumu Wi-Fi'de ve mobil veride kaç dakikada bir göndereceğini seçmesi; konum ve ekran
süresi paylaşımını açıp kapatması.

## Ne işe yarar

Kullanıcının 26 Eylül isteği: "veli pinglenme aralığı seçer, 1 dk vb.; Wi-Fi'deyse çok olabilir, mobil veride velinin
seçimine göre azaltılmış". Sık konum daha güncel bir harita verir ama pili ve mobil veriyi daha çok harcar; bu yüzden Wi-Fi
ve mobil veri için ayrı seçim var. Paylaşımı tamamen durdurmak istersen bağlantıyı kaldırmadan konumu ya da ekran süresini
kapatabilirsin.

## Nereden açılır

[Çocuğumun telefonu sayfası](cocugumun-telefonu-sayfasi.md)'nın en altındaki **"Ayarlar"** kartı; kartın sonundaki
**"Kaydet"** buradaki seçimleri ve [süre sınırlarını](sure-siniri.md) birlikte kaydeder.

Tasarımda (Tasarım 1 önizlemesi): sayfanın ilk bölümü "Elif'in telefonu"ndaki **"Konum gönderme sıklığı"** satırı.

## Adım adım

### Veli

1. "Ayarlar" kartını bul. Yukarıdan aşağı:
   - Onay kutusu **"Konumu paylaş"** (ilk hâli açık).
   - Yan yana iki seçim kutusu: **"Wi-Fi'deyken"** ve **"Mobil veride"**. İkisinde de seçenekler: "1 dakikada bir", "5
     dakikada bir", "10 dakikada bir", "15 dakikada bir", "30 dakikada bir", "60 dakikada bir". İlk hâli Wi-Fi'de 5, mobil
     veride 15 dakika.
   - İpucu: "Telefon internete bağlı değilken konumlar telefonda birikir, bağlandığı ilk anda gelir. Sık konum pili daha
     çabuk bitirir; mobil veride seyrek seçmek iyi olur."
   - Onay kutusu **"Ekran süresini paylaş"** (ilk hâli açık).
   - Ardından süre sınırları ([Süre sınırı](sure-siniri.md)).
2. İstediğini değiştir, **"Kaydet"**e bas. Düğme "Kaydediliyor..." olur.
3. Sayfa yeniden açılır, yeşil ileti: **"Kaydedildi. Telefon yeni ayarı en geç yarım saat içinde alır."** Bir hata olursa
   düğme eski hâline döner ve ileti kartın içinde, "Kaydet"in hemen üstünde kırmızı çıkar.
4. Telefon internete bağlıyken yarım saat içinde yeni ayarı alır; çocuğun telefonundaki ekranda da yeni aralıklar yazar
   ([Telefondaki izinler ve durum](izinler-ve-durum.md)).

Tasarımda (Tasarım 1 önizlemesi):

1. Telefon bölümünde "Konum: her 15 dakikada bir gelir" satırı ve altında **"Konum gönderme sıklığı"**: tek seçimli çipler
   **"1 dk"**, **"5 dk"**, **"15 dk"**, **"30 dk"**; altında küçük yazı "Telefon konumunu seçtiğin aralıkla gönderir."
2. Bir çipe dokununca ayrıca "Kaydet" gerekmez: hemen kaydedilir, alttan kısa ileti çıkar: "Konum artık her 5 dakikada bir
   gelecek."
3. Önizlemede Wi-Fi ve mobil veri ayrımı, "Konumu paylaş" ve "Ekran süresini paylaş" kutuları görünmez. Kullanıcının 26 Eylül
   sözü Wi-Fi ile mobil veriyi ayırdığı için kodlanırken çipler "Wi-Fi'deyken" ve "Mobil veride" diye iki sıra olmalı;
   aç/kapa kutularının kaldırılması da istenmedi, kalırlar. Seçenek listesine kullanıcı karar vermedi ("1 dk vb."): önizleme
   1, 5, 15, 30 dk gösterir, bugünkü kod 1, 5, 10, 15, 30, 60 dk.

### Öğrenci

Velinin seçtiği aralıkları telefonundaki bağlı ekranda görürsün: "Velin gönderme sıklığını seçer: Wi-Fi'deyken 5 dakikada
bir, mobil veride 15 dakikada bir." Aralığı sen değiştiremezsin. Velin konumu ya da ekran süresini kapatırsa telefonun
yarım saat içinde göndermeyi bırakır; bildirim çubuğundaki "Eğitim Evi Aile" bildirimi bağlantı sürdükçe yerinde kalır.

## Kurallar ve sınırlar

- **Aralıklar yalnız 1, 5, 10, 15, 30, 60 dakika.** Başka değer gelirse sunucu "Aralık 1, 5, 10, 15, 30 ya da 60 dakika
  olabilir" der.
- **Hangi aralık ne zaman:** telefon Wi-Fi'deyken (kablolu bağlantı da) Wi-Fi aralığını, mobil veride ve internet yokken
  mobil aralığını kullanır. Aralığın beşte dördü dolmadan gelen konum atılır (iki konum kaynağı aynı anda konum verse de
  çift olmaz).
- **Yeni ayar ne zaman geçer:** telefon ayarı internet varken 30 dakikada bir sorar; kaydettikten sonra en geç yarım saat
  (telefon internetsizse internete bağlandıktan sonra) eski ayarla çalışır.
- **"Konumu paylaş" kapatılınca:** sunucu o andan sonra gelen konumları almaz; telefon yeni ayarı alınca konum istemeyi
  bırakır. Daha önce gelen konumlar silinmez, 7 gün durur. Bağlantı ve ekran süresi sürer.
- **"Ekran süresini paylaş" kapatılınca:** sunucu süreleri almaz, telefon göndermeyi bırakır; süre sınırları da işlemez.
  Eski süreler 7 gün durur.
- **İkisini kapatmak bağlantıyı kaldırmaz:** telefon bağlı kalır, ayarı sormaya devam eder ("Son görülme" tazelenir),
  bildirim çubuğundaki "Eğitim Evi Aile" bildirimi de yerinde kalır. Tamamen bitirmek için
  [Bağlantıyı kaldırma](baglantiyi-kaldirma.md).
- **İki veli aynı ayarı paylaşır:** ayar çocuğa bağlıdır; birinin kaydettiği öbürünün ekranını değiştirir, son kaydeden
  kazanır.
- **Kaydet hepsini birlikte gönderir:** paylaşım, aralıklar, toplam sınır ve uygulama sınırları tek istekte yazılır.
- **Bilinen sorun (önemli):** "Konumu paylaş"ı kapatıp kaydettiğinde, eski konumlar silinene kadar (son konumun üzerinden 7
  gün) sayfa açılmaz: kaydedince sayfa yeniden açılırken kartların yerine kırmızı "Cannot read properties of null (reading
  'classList')" çıkar. Bu sürede ayarlara, konumu yeniden açmaya ve "Bağlantıyı kaldır"a da ulaşamazsın. Sebebi: sayfa
  konum kapalıyken harita kutusunu çizmiyor ama yine de haritayı kurmaya çalışıyor. Kod henüz düzeltilmedi; o zamana kadar
  konumu kapatmak yerine aralığı "60 dakikada bir" yapmak ya da bağlantıyı kaldırmak sorunsuz yoldur.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Çocuğumun telefonu](README.md)):

- [Konum](konum.md) — aralığın etkisini gördüğün kart.
- [Ekran süresi](ekran-suresi.md) — "Ekran süresini paylaş"ın açtığı kart.
- [Süre sınırı ve aşım bildirimi](sure-siniri.md) — aynı "Kaydet".
- [Telefondaki izinler ve durum](izinler-ve-durum.md) — telefonun aralığı nasıl uyguladığı.
- [Bağlantıyı kaldırma](baglantiyi-kaldirma.md), [Kim görür, ne kadar saklanır](mahremiyet.md).

**İlgili:**

- [Canlı konum ve servis haritası](../servis/canli-konum-ve-harita.md) — servis aracının konumu ayrı bir ayardır (okulun
  servis saatleri).

## Kod tarafı

- Ön yüz: [public/js/parcalar/27b-aile.md](../../public/js/parcalar/27b-aile.md) — `AILE_ARALIK` (`[1, 5, 10, 15, 30, 60]`),
  `aileAyarKarti(d)` (`#aileKonum`, `#aileWifi`, `#aileMobil`, `#aileKullanim`, `#aileMesaj`), eylem `aile-kaydet`
  ("Kaydediliyor...", `POST /api/aile/ayar`, yeşil ileti); sayfa işlevindeki harita koşulu (`d.sonKonum`; bilinen sorunun
  yeri).
- Sunucu: [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md) — `ARALIKLAR`, `POST /api/aile/ayar` (`konumAcik` ve
  `kullanimAcik` yalnız `false` gelirse kapanır), `GET /api/aile/cihaz/ayar` (telefonun aldığı ayar), konum ve kullanım
  uçlarında `kapali: true`; [sunucu/veri/depo/aile.md](../../sunucu/veri/depo/aile.md) — `ayar` (ilk değerler Wi-Fi 5,
  mobil 15, ikisi açık), `ayarYaz` (`guncelleyen`).
- Tablo: `aile_ayarlari` (`wifi_dk`, `mobil_dk` yalnız 1, 5, 10, 15, 30, 60; `konum_acik`, `kullanim_acik`; şema 026,
  [SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Android: `IzlemeServisi.java` (`ayarlariTazele` 30 dakika, `konumIsteginiAyarla` Wi-Fi / mobil), `Ayarlar.java`
  (`wifiAraligi`, `mobilAraligi`, `konumAcik`, `kullanimAcik`), `AileEkrani.java` (aralıkların telefonda yazılması).
- CSS: `16-giris-sekme.css` (`.onay`), `02-form.css` (`.row2`), `33-aile.css` (`.aile-ayar`) —
  [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md).
- Test: [testler/test-aile.md](../../testler/test-aile.md) — geçersiz aralığın reddi, telefonun yeni aralığı alması, konum
  kapalıyken telefonun gönderdiğinin alınmaması. Sayfanın konum kapalıyken çizimini deneyen test yok (bilinen sorunu bu
  yüzden hiçbir test yakalamadı).
- Tasarım: Tasarım 1 önizlemesi, öğrenci-veli paketi (sıklık çipleri ve kısa ileti).

## Sık sorulanlar

- **1 dakika seçsem olur mu?** Olur; ama telefon her dakika konum alır, pil ve mobil veri daha çabuk biter. Wi-Fi'de kısa,
  mobil veride uzun aralık önerilir.
- **Kaydettim ama telefonda eski aralık yazıyor.** Telefon yeni ayarı en geç yarım saatte alır (internete bağlıysa).
- **Konumu kapattım, sayfa açılmıyor.** Yukarıdaki bilinen sorun; düzeltilene kadar en kısa yol son konumun silinmesini
  (7 gün) beklemek. Bundan kaçınmak için konumu kapatmak yerine aralığı uzat ya da bağlantıyı kaldır.
- **Ekran süresini kapatırsam sınırlar ne olur?** Kayıtlı kalırlar ama süre gelmediği için işlemezler.

## Sırada

- Tam debug (iş 27): konum paylaşımı kapalıyken sayfanın açılmaması (harita koşulu `d.sonKonum && d.ayar.konumAcik` olmalı).
- Velide her çocuk ayrı oturum (kullanıcının 3 Ekim kararı) ve Tasarım 1 düzeni: dokununca kaydedilen sıklık çipleri (Wi-Fi
  ve mobil veri için ayrı).
- Android yerel uygulama (iş 10): uygulamanın veli ekranından aynı ayarlar.
