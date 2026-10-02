# public/js/parcalar/27b-aile.js

Velinin "Çocuğumun telefonu" sayfası: çocuğun telefonundaki Eğitim Evi uygulamasının (Aile ekranı) gönderdiği son konumu
haritada, bugünkü ve son 8 günün ekran süresini çubuklarla gösterir; konum/süre paylaşımını, gönderme sıklığını, günlük ve
uygulama başına süre sınırlarını kaydeder; bağlı telefonun bağlantısını kaldırır.

## Bu dosya ne yapar?

Eğitim Evi'nin Android uygulaması çocuğun telefonunda "Aile" ekranıyla bağlanınca (çocuk kendi öğrenci hesabıyla girer ve
paylaşımı kendisi onaylar) telefonun konumunu ve uygulama uygulama ekran süresini belli aralıklarla sunucuya gönderir
([../../../sunucu/bolumler/aile.md](../../../sunucu/bolumler/aile.md)). Bu dosya o verinin velideki yüzüdür:

- **Bağlı telefon** kartı (ad, son görülme, bağlanma günü, "Bağlantıyı kaldır") ya da telefon bağlı değilse **kurulum**
  kartı (uygulamayı kur, öğrenci hesabıyla gir, izinleri ver; "uygulama hiçbir uygulamayı kapatmaz ya da kilitlemez",
  "iPhone'da çalışmaz").
- **Konum** kartı: son konum haritada (OpenStreetMap döşemeleri, [19d-harita.md](19d-harita.md)), önceki en çok 11 nokta,
  "Son konum: 3 dakika önce", Wi-Fi / mobil veri, yaklaşık doğruluk, pil; Google Haritalar bağlantısı ve çocuğun
  "Servisi".
- **Ekran süresi** kartı: bugünün toplamı (ve varsa sınırı), son 8 günün günlük toplam çubukları, bugün en çok
  kullanılan 12 uygulama (varsa her birinin sınırıyla).
- **Ayarlar** kartı: konumu paylaş, Wi-Fi'deyken ve mobil veride kaç dakikada bir (1, 5, 10, 15, 30, 60), ekran süresini
  paylaş, günlük toplam sınır (ortak), uygulama başına sınır (bu haftanın uygulamalarından seçilir), "Kaydet".

Sınır geçilince veliye günde bir kez bildirim gider; uygulama kapatılmaz. Mahremiyet kuralları sunucuda: okul (müdür,
öğretmen) bu veriyi görmez, yalnız çocuğa veli bağıyla bağlı hesap görür; konum ve kullanım 7 gün sonra silinir. Sayfanın
başlığı da bunu söyler: "<çocuğun adı> · konum ve ekran süresi. Yalnızca sen ve öteki velisi görür; okul görmez. Veriler 7
gün sonra silinir." (gün sayısı sunucudan, `saklamaGun`).

Kim görür: rolü **veli** olan hesabın menüsünde "Çocuğumun telefonu" ([06-menu.md](06-menu.md)). Okulun eski düzende
açtığı öğretmen/müdür hesabının "Velisi olduğum" bölümünde bu sayfa yok; böyle biri sayfayı yalnız bildirimdeki
bağlantıdan (`#/aile?c=<çocuk>`) açar, sunucu veli bağına baktığı için veri gelir. Öğrenci bu sayfayı açarsa (adresi
yazarak) çocuğu olmadığı için "Henüz çocuk eklenmedi…" görür; sunucu da öğrenciye 403 verir. Okul bu bölümü kapatamaz
(`SAYFA_OZELLIK`'te yok).

## İçinde neler var?

### Durum ve sabitler

- `AILE = { harita, veri }` — açık haritanın nesnesi (`haritaKur`'un döndürdüğü) ve son `/api/aile/ozet` cevabı.
  Eylemler öğrenci kimliğini `AILE.veri.ogrenci.id`'den alır.
- `AILE_ARALIK` — `[1, 5, 10, 15, 30, 60]`: gönderme sıklığı seçenekleri (dakika). Sunucudaki `ARALIKLAR`'ın aynısı; başka
  değer 400 alır.
- `AILE_SINIR` — `[0, 30, 60, 90, 120, 180, 240, 300]`: günlük toplam sınır seçenekleri; 0 "Sınır yok" (kaydederken
  `null`).
- `AILE_APK` — `/indir/indir.html`: kurulum kartındaki "indirme sayfası" bağlantısı (yeni sekmede).

### Küçük yardımcılar

- `aileSure(dk)` — "2 sa 40 dk", "2 sa", "45 dk", sayı değilse "0 dk".
- `aileOnce(iso)` — boşsa "hiç"; bir dakikadan yeniyse (ya da saat ilerideyse) "az önce"; bir saatten yeniyse "N dakika
  önce"; bugünse "bugün 21:40"; değilse "1 Ekim 2026, Perşembe 21:40" (`tarihGun` + saat). Tarayıcının yerel saatiyle.
- `aileHaritaKapat()` — açık harita varsa `yokEt()` (çizim ve boyut izleyici durur) ve `AILE.harita = null`. Her sayfa
  geçişinde [07-yonlendirme.md](07-yonlendirme.md)'deki `git()` çağırır; sayfa açılırken bu dosya da çağırır.
- `aileCocugu()` — şeritte seçili çocuk (`veliSeciliCocuk()`, [27-veli-panel.md](27-veli-panel.md)), yoksa ilk çocuk, o da
  yoksa `null`. Bu sayfada "Hepsi" yoktur: her zaman tek çocuk.

### `SAYFALAR.aile` — sayfa

1. Açık harita kapatılır; çocuk yoksa `veliCocukYok('ÇOCUĞUMUN TELEFONU')`.
2. `GET /api/aile/ozet?studentId=<çocuk>` → `AILE.veri`.
3. Başlık ("ÇOCUĞUMUN TELEFONU" ve yukarıdaki alt yazı), birden çok çocuk varsa çocuk şeridi (her çocuk tam adıyla,
   `data-act="aile-cocuk"`; bu sayfanın kendi şeridi, `veliCocukSeridi` değil), cihaz varsa `aileCihazKarti`, yoksa
   `aileKurulumKarti`, `div.aile-izgara` içinde `aileKonumKarti` + `aileSureKarti`, en altta `aileAyarKarti`; `yaz(h)`.
4. Son konum varsa harita kurulur: `haritaKur($('aileHarita'), { merkez: sonKonum, zoom: 15, etiket: 'Çocuğun son konumu' })`;
   işaretler: `konumlar`'ın 2.–12. noktaları eskiden yeniye `secim` işareti (etiketi "N dakika önce" gibi) ve son konum
   `ben` işareti ("Son konum · 3 dakika önce"). Sunucu son 30 konumu yeniden eskiye gönderir; ilk 12'si kullanılır.

### Kartlar (HTML üreten işlevler)

- `aileKurulumKarti(d)` — "<ad>'in telefonu henüz bağlı değil" ve üç adım: (1) "Eğitim Evi Aile uygulamasını <ad>'in
  Android telefonuna kur (indirme sayfası)", (2) "Uygulamada <ad>'in öğrenci hesabıyla giriş yap; paylaşımı <ad> kendisi
  onaylar.", (3) "İzinleri ver: Konum — Her zaman izin ver, Kullanım erişimi, Bildirimler ve arka planda çalışma
  (uygulamanın pil ayarında Kısıtlamasız)". Altında ipucu: uygulama hiçbir uygulamayı kapatmaz/kilitlemez, iPhone'da
  çalışmaz (Apple izin vermiyor). `<ad>` çocuğun ilk adı (`esc`'li).
- `aileCihazKarti(d)` — "Bağlı telefon" ve her cihaz için satır: telefon simgesi, ad (yoksa "Telefon"), "Son görülme: …
  · bağlandı <gün>", "Bağlantıyı kaldır" (`data-act="aile-cihaz-kaldir" data-id="<cihaz>"`). Sunucu öğrenci başına en çok
  3 cihaz tutar.
- `aileKonumKarti(d)` — "Konum" başlığı. Paylaşım kapalıysa "Konum paylaşımı kapalı (aşağıdaki ayarlardan açılır).";
  henüz konum yoksa "Henüz konum gelmedi. Telefon internete bağlanınca gelir."; yoksa harita kutusu (`div.harita-kap
  #aileHarita`), "Son konum: …", ağ ("Wi-Fi" / "Mobil veri" / "Bağlantısız alındı"), varsa "yaklaşık N m" ve "pil %N";
  düğmeler: `googleHaritaBaglantisi(k)` ("Google Haritalar'da aç", yeni sekme) ve "Servisi" (`data-nav="servis"`).
- `aileSureKarti(d)` — "Ekran süresi" başlığı. Paylaşım kapalıysa "Ekran süresi paylaşımı kapalı.". Değilse:
  - bugünün toplamı büyük yazıyla ("2 sa 40 dk"), yanında "bugün · sınır 2 sa"; toplam sınırı geçtiyse turuncu "Bugünkü
    toplam sınır geçildi.";
  - son 8 günün çubukları (`div.aile-gunler`, `role="img"`): yükseklik en büyük güne ya da sınıra göre yüzde; sınırı geçen
    gün `asti` (ana renk); altında günün adının ilk üç harfi, üzerine gelince "4 Ekim 2026, Pazar: 2 sa 40 dk";
  - bugün hiç süre yoksa "Bugün için süre gelmedi."; varsa ilk 12 uygulama: ad, süre, sınırı varsa "/ 1 sa"; çubuk en çok
    kullanılan uygulamaya göre (en az %2), sınırı geçen `asti`.
- `aileAyarKarti(d)` — onay kutuları `#aileKonum`, `#aileKullanim`; seçim kutuları `#aileWifi`, `#aileMobil` ("N dakikada
  bir"), `#aileToplam` ("Sınır yok", "30 dk" … "5 sa"); `#aileSinirlar` içinde var olan uygulama sınırları
  (`aileSinirSatiri`); bu haftanın (son 8 gün) sınırı olmayan uygulamalarından `#aileYeniUyg` seçimi ("YouTube (bu hafta
  4 sa 10 dk)") ve "Sınır ekle" (`data-act="aile-sinir-ekle"`), uygulama yoksa "Telefondan süre geldikçe uygulamalar
  burada seçilebilir."; ipuçları (bağlantısızken konumların telefonda birikmesi, sık konumun pili bitirmesi; sınır
  geçilince günde bir kez bildirim); `#aileMesaj` ve "Kaydet" (`data-act="aile-kaydet"`).
- `aileSinirSatiri(s)` — `div.aile-sinir[data-paket][data-ad]`: uygulama adı, 15/30/45/60/90/120/180/240 dakikalık seçim
  (kayıtlı değer listede yoksa eklenip sıralanır), "Kaldır" (`data-act="aile-sinir-sil"`).

### Eylemler (`EYLEMLER`; [25-tiklama.md](25-tiklama.md) önce buraya bakar)

- `aile-cocuk` — `S.veliCocuk = id`, `git('aile')`.
- `aile-sinir-ekle` — seçili uygulama için 60 dakikalık bir sınır satırı `#aileSinirlar`'ın sonuna eklenir, uygulama seçim
  listesinden çıkar. Sunucuya bir şey gitmez; "Kaydet" gerekir.
- `aile-sinir-sil` — satır DOM'dan silinir (yine "Kaydet" gerekir).
- `aile-kaydet` — sınırlar DOM'daki satırlardan toplanır (`{ paket, ad, dakika }`); düğme "Kaydediliyor..." → `POST
  /api/aile/ayar { studentId, wifiDk, mobilDk, konumAcik, kullanimAcik, toplamSinir (0 ise null), sinirlar }` → sayfa
  yeniden açılır ve yeşil "Kaydedildi. Telefon yeni ayarı en geç yarım saat içinde alır." Hata: düğme eski hâline, ileti
  `#aileMesaj`'a. (Yarım saat: Android uygulaması ayarı internet varken 30 dakikada bir sorar — `Egitim-Evi-App` deposu,
  `IzlemeServisi.java`.)
- `aile-cihaz-kaldir` — onay "Bu telefonun bağlantısı kaldırılsın mı? Uygulama konum ve süre göndermeyi bırakır." → `POST
  /api/aile/cihaz-kaldir { studentId, cihazId }` → `git('aile')`; hata `hataGoster`. Sunucu cihaz kaydını siler, telefonun
  anahtarı artık 401 alır.

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Bu dosya [26-baslat.md](26-baslat.md)'ten SONRA gelir; `var AILE` açılış kodu çalışırken henüz
  atanmamıştır (ilk `git()` eşzamansız olduğu için sorun yok — orada anlatıldı).
- Çağırdıkları:
  - [00-durum.md](00-durum.md) — `S.veliCocuk`; [01-yardimcilar.md](01-yardimcilar.md) — `$`, `esc`, `api`, `EYLEMLER`.
  - [02-ikonlar.md](02-ikonlar.md) — `ik('telefon'|'servis')`, `tarihGun`, `gunAdi`; [04e-tarih-secici.md](04e-tarih-secici.md)
    — `tsIki`, `tsIso`.
  - [03-mesaj-modal.md](03-mesaj-modal.md) — `mesajGoster`, `sayfaMesaji`; [05-giris.md](05-giris.md) — `dugmeBekle`,
    `dugmeBitir`.
  - [07-yonlendirme.md](07-yonlendirme.md) — `git`, `yaz`, `hero`; [19d-harita.md](19d-harita.md) — `haritaKur`,
    `googleHaritaBaglantisi`; [25-tiklama.md](25-tiklama.md) — `hataGoster`.
  - [27-veli-panel.md](27-veli-panel.md) — `veliCocuklar`, `veliSeciliCocuk`, `veliCocukYok`.
- Sunucu uçları ([../../../sunucu/bolumler/aile.md](../../../sunucu/bolumler/aile.md)) — hepsi oturumla, yalnız çocuğa
  bağlı veli (değilse 403 "Bu öğrencinin velisi değilsin"):
  - `GET /api/aile/ozet?studentId=` → `{ ogrenci: { id, ad }, cihazlar, ayar: { wifiDk, mobilDk, konumAcik, kullanimAcik,
    toplamSinir }, sinirlar, saklamaGun, sonKonum, konumlar (son 30), kullanim: { bugun, gunler (8 gün), hafta } }`;
  - `POST /api/aile/ayar` (aralıklar, 5–1440 dakikalık sınırlar, en çok 50 uygulama — sunucu denetler);
  - `POST /api/aile/cihaz-kaldir`.
  - Telefonun kendi uçları (`/api/aile/cihaz/...`, `X-Aile-Cihaz` başlığı) bu dosyada çağrılmaz.
- Dışarı giden: harita döşemeleri `tile.openstreetmap.org`'dan iner (bakılan bölgeyi ve IP adresini OpenStreetMap'e
  söyler; aydınlatma metninde yazılı); "Google Haritalar'da aç" yalnız basılırsa koordinatı Google'a götürür.
- Onu kullananlar:
  - [06-menu.md](06-menu.md) — veli menüsünde `{ k: 'aile', ad: 'Çocuğumun telefonu' }`.
  - [07-yonlendirme.md](07-yonlendirme.md) — `git()` her geçişte `aileHaritaKapat()`.
  - Sunucu bildirimleri — telefon bağlanınca, telefon bağlantısını kendisi kaldırınca ve sınır geçilince velilere
    `#/aile?c=<çocuk>` bağlantılı bildirim gider (velinin buradan kaldırmasında bildirim yok); zile basınca [24-bildirim-arama-mobil.md](24-bildirim-arama-mobil.md) o çocuğu
    `S.adresCocuk`'a yazar, `veliSeciliCocuk` seçer.
  - Android uygulaması (ayrı depo) bu sayfanın verisini üretir; uygulamanın kendi veli ekranları planlı (aşağıda).
- CSS: `33-aile.css` (`.aile-izgara` — 900 piksel altında tek sütun, `.aile-kurulum`, `.aile-cihazlar`, `.aile-simge`,
  `.aile-konum-bilgi`, `.aile-dugmeler`, `.aile-toplam`, `.aile-gunler`/`.aile-gun`/`.aile-cubuk` (`.asti`),
  `.aile-uygulamalar`/`.aile-uyg-ust`/`.aile-bar`, `.aile-ayar`, `.aile-sinir`, `.aile-sinir-ekle`); harita
  `27-harita-ortak.css` (`.harita-kap`, `.harita`); çocuk şeridi `24-veli.css` (`.cocuk-seridi`); onay kutuları
  `16-giris-sekme.css` (`.onay`), iki sütun `02-form.css` (`.row2`).

## Nasıl çalışır (adım adım)?

```
veli menüden "Çocuğumun telefonu" ─► git('aile') ─► aileHaritaKapat()
   aileCocugu(): şeritteki ya da ilk çocuk
   GET /api/aile/ozet?studentId=Z ─► AILE.veri
   yaz: başlık · çocuk şeridi · (Bağlı telefon | kurulum) · [Konum | Ekran süresi] · Ayarlar
   sonKonum varsa ─► haritaKur(#aileHarita) + 12 işaret
veli "YouTube"a 60 dk sınır ekler, toplam sınırı 2 sa yapar ─► "Kaydet"
   POST /api/aile/ayar { …, toplamSinir: 120, sinirlar: [{ paket, ad, dakika: 60 }] }
   ─► git('aile') ─► "Kaydedildi. Telefon yeni ayarı en geç yarım saat içinde alır."
telefon (≤30 dk) GET /api/aile/cihaz/ayar ─► yeni sıklık; kullanım gelince sunucu sınırı denetler ─► veliye bildirim (günde bir)
```

## Dikkat!

- **Konum paylaşımı kapalıyken sayfa açılmıyor** (kod okumasıyla ve sunucusuz küçük bir benzetimle görüldü; gerçek
  tarayıcıda denenmedi). Veli "Konumu paylaş"ı kapatıp kaydedince sunucu eski konumları silmez (7 gün durur) ve özet
  cevabında `sonKonum` gelmeye devam eder. `aileKonumKarti` paylaşım kapalıyken harita kutusunu (`#aileHarita`) çizmez,
  ama sayfa işlevi yalnız `d.sonKonum`'a bakıp `haritaKur($('aileHarita'), …)` der; `$` `null` döner, `haritaKur`
  `kap.classList`'te hata atar ve `git()` bütün sayfanın yerine "Cannot read properties of null (reading 'classList')"
  yazar. Sonuç: konumu kapatan veli, son konumun üzerinden 7 gün geçene kadar bu sayfayı (ve dolayısıyla ayarları,
  konumu yeniden açmayı, cihaz bağlantısını kaldırmayı) kullanamaz. Kod değiştirilmedi. Düzeltme: harita koşulunu
  `d.sonKonum && d.ayar.konumAcik` yapmak (ya da `$('aileHarita')` varsa kurmak).
- **Başlıktaki çocuk adı iki kez kaçırılıyor.** `hero` alt yazıyı zaten `esc`'ten geçirir; buraya `esc(d.ogrenci.ad)`
  verildiği için adında `&` ya da `'` olan bir çocukta başlıkta "&amp;" / "&#39;" görünür. Türkçe adlarda nadir.
- **Türkçe ek uyumu yok.** Kurulum kartı her adın sonuna "'in" ekler: "Zeynep'in" doğru, ama "Ali'in" (Ali'nin), "Burak'in"
  (Burak'ın), "Umut'in" (Umut'un) yanlış çıkar.
- **Gün kısaltmaları karışıyor.** Çubukların altındaki `gunAdi(gün).slice(0, 3)` Pazar ve Pazartesi'nin ikisine de
  "Paz", Cuma ve Cumartesi'nin ikisine de "Cum" yazar; 8 günlük şeritte bunlar yan yana gelir. Tam tarih yalnız üzerine
  gelince (`title`) görünür; dokunmatik ekranda o da yok.
- **`aileOnce`'nin yorumu "dün 21:40" diyor**, kod "dün" demiyor: bugünden eski her an tam tarihle yazılır.
- **Bağlanma günü UTC'ye göre.** `tarihGun(String(c.olusturma).slice(0, 10))` zaman damgasının UTC gününü alır; Türkiye
  saatiyle 00:00–02:59 arasında bağlanan telefonda bir gün önce görünür.
- **Listede olmayan toplam sınır kaydedince silinir.** `#aileToplam` yalnız `AILE_SINIR` değerlerini sunar; sunucu ise
  5–1440 arasındaki her tam sayıyı kabul eder. Başka bir yoldan (doğrudan API ile) 45 dakika konmuşsa seçim kutusunda
  hiçbir seçenek seçili gelmez, tarayıcı ilk seçeneği ("Sınır yok") gösterir ve "Kaydet" sınırı kaldırır. Uygulama
  başına sınırda bu sorun yok (`aileSinirSatiri` eksik değeri listeye ekler). Bugün site dışında bu ayarı yazan bir
  istemci yok.
- **Çocuk değiştirmek bütün veli sayfalarını etkiler.** `aile-cocuk` `S.veliCocuk`'u değiştirir; Ödevler, Devamsızlık,
  Takvim de o çocuğa daralır. `veli-cocuk`'tan ([25-tiklama.md](25-tiklama.md)) farklı olarak yıl bilgisini
  (`yilBilgisiYukle`) yeniden almaz: çocuklar farklı okullardaysa, buradan çocuk değiştirip Ödevler'e geçen velinin yıl
  şeridi bir süre öteki çocuğun okuluna göre kalabilir (kod okumasına göre).
- **"Servisi" düğmesi bu çocuğa özel değil.** Servis sayfası ([19c-okul-hayati.md](19c-okul-hayati.md)) her zaman bütün
  çocukların kartlarını gösterir; haritası şeritte seçili çocuğa, seçim yoksa son bakılan ya da ilk servisli çocuğa
  açılır. Bu sayfada şeritten seçim yapılmadan (ilk çocuğa bakarken) "Servisi"ne basılırsa harita başka bir çocukla
  açılabilir. Servis bölümü velinin bütün çocuklarının
  okulunda kapalıysa düğme "Bu bölüm okulunda kapalı" sayfasına götürür.
- **Sınır ekle/kaldır yereldir.** "Sınır ekle" ve "Kaldır" yalnız sayfadaki listeyi değiştirir; "Kaydet"e basmadan başka
  sayfaya geçilirse kaybolur ve "kaydedilmedi" uyarısı çıkmaz (seçim kutuları sayılmaz). Kaldırılan uygulama, sayfa
  yeniden açılana kadar "Uygulama seç..." listesine geri dönmez.
- **İki veli aynı ayarı paylaşır.** Ayar çocuğa bağlıdır; ötekinin kaydettiği sonradan gelenin ekranını değiştirir, son
  kaydeden kazanır (sunucu kimin kaydettiğini `guncelleyen` olarak tutar, sayfada gösterilmez).
- **Telefon ayarı hemen almaz.** İleti doğru söylüyor: uygulama ayarı internet varken en geç 30 dakikada bir sorar; konum
  kapatıldıktan sonra o süre içinde telefonun gönderdiği konumu sunucu kaydetmez (`{ alinan: 0, kapali: true }`).
- **Uygulama adları telefondan gelir.** Ad ve paket adı çocuğun telefonundan gelen veridir; bu dosya onları her yerde
  `esc` ile basar (`test-aile.js` sunucunun adı düz metin sakladığını denetler). Yeni bir yerde gösterirsen kaçırmayı
  unutma.
- **Erişilebilirlik:** son 8 günün çubukları ekran okuyucuya yalnız "Son 8 günün ekran süresi" der, değerleri okumaz.
- **Kurulum kartının dili Android uygulamasıyla tam örtüşmüyor.** Kart "Eğitim Evi Aile uygulamasını kur" diyor; indirme
  sayfası (`public/indir/indir.html`) tek bir "Eğitim Evi" uygulamasından söz ediyor ve Android deposundaki
  `AileEkrani.java`'nın baş yorumuna göre bu ekran öğrencinin uygulamadaki Ayarlar'ından ("Bu telefonu velimle paylaş")
  açılıyor. Veli indirme sayfasında "Aile" adını bulamayabilir; metin bir sonraki uygulama işinde birleştirilmeli.
- **Çıkışta silinmez.** `AILE.veri` (çocuğun konumları dahil) `oturumDurumunuSifirla`'da yok ([26-baslat.md](26-baslat.md));
  aynı sekmede giren sonraki kişinin ekranına gelmez (sayfa her açılışta yeniden ister), yalnız bellekte durur.
- **Kişisel veri.** Konum ve uygulama kullanımı çocuğun kişisel verisidir; bu sayfaya yeni bir alan eklersen KVKK kuralı
  geçerli (aynı commit'te `public/kvkk/kvkk.html` ve `KVKK_SURUM`).

## Testleri

- `testler/test-aile.js` (39 denetim; sunucu) — telefonu yalnız öğrencinin kendi açık onayıyla bağlaması, anahtarın
  yalnız cihaz uçlarına yaraması, konum ve kullanımın doğrulanması (aralık, zaman, paket adı, sayı sınırları), velinin
  `ozet`'i (en yeni konum, büyükten küçüğe süreler, 8 günlük toplam; uygulama adının düz metin saklanması — "ön yüz
  kaçışla basar", bu dosya her adı `esc`'ten geçirir) ve `ayar`'ı (geçersiz aralık, 5 dakikadan kısa sınır, bozuk paket
  adı reddediliyor), bağlı olmayan velinin, müdürün, öğretmenin ve öğrencinin özete 403 alması, sınır aşılınca günde bir
  bildirim ve bildirimin Aile sayfasına götürmesi, konum kapatılınca telefonun gönderdiğinin alınmaması, başka velinin
  cihaz kaldıramaması, kaldırılınca anahtarın çalışmaması.
- `testler/buton-denetimi.js` (sunucusuz) — `aile-cocuk`, `aile-sinir-ekle`, `aile-sinir-sil`, `aile-kaydet`,
  `aile-cihaz-kaldir` eylemlerinin karşılığı, `aile` sayfasının menüde olması, `/aile` yolunun sunucuda olması.
- Bu dosyanın çizimini deneyen tarayıcı testi yok (yukarıdaki konum-kapalı hatasını bu yüzden hiçbir test yakalamadı).
- Elle (deneme kurulumunda): veli hesabıyla sayfayı aç → kurulum kartı; `test-aile.js`'teki gibi bir cihaz bağlayıp konum
  gönder → harita ve "Son konum"; Ayarlar'da sınır ekle, kaydet → yeşil ileti, sayfa sınırı göstermeli; "Konumu paylaş"ı
  kapatıp kaydet → (bugünkü hatayla) sayfa yerine hata iletisi.

## Son durum

- `git log`: 6 commit. `c1d27a2 commit 462` (2026-09-26): dosyanın ilk hâli (sabitler, yardımcılar, sayfa ve kartlar);
  `c7acd2d commit 463` (2026-09-26): `aileSinirSatiri` ve beş eylem (aynı commit `33-aile.css` ve `testler/test-aile.js`'i
  getirdi).
- `f9a3978 commit 505` (2026-09-26): kurulum bağlantısı GitHub sürüm sayfası yerine doğrudan son APK; `89199ce commit 507`
  (2026-09-26): kurulum kartında pil ayarı "uygulamanın pil ayarında Kısıtlamasız" oldu; `fa9a072 commit 510`
  (2026-09-26): bağlantı sitenin indirme sayfasına (`/indir`), yazı "indirme sayfası".
- Son değişiklik `b6bfc03 commit 517` (2026-09-27, sayfa klasörleri): `AILE_APK` `/indir/indir.html`. O günden beri
  değişmedi.
- Bilinen açıklar (kod değiştirilmedi): konum kapalıyken sayfanın hata vermesi (en önemlisi), başlıkta çift kaçırma,
  "'in" eki, gün kısaltmaları, eski `aileOnce` yorumu, UTC bağlanma günü, listede olmayan toplam sınır, yıl bilgisinin
  tazelenmemesi, kurulum metni.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Android yerel uygulama" (iş 10): uygulamanın veli ekranlarında "Çocuğumun telefonu (aile özet…)" olacak; aynı uçları
    kullanır, bu sayfanın metinleri ve uygulama adı onunla birleştirilmeli. Uygulama kendini güncelleyince eski 1.0.x
    Aile kurulumlarıyla uyum korunacak.
  - "KVKK ve onay metinleri tam denetimi" (iş 18): sayfadaki "okul görmez", "7 gün sonra silinir" sözleri ve harita/Google
    aktarımları aydınlatma metniyle karşılaştırılacak.
  - "Optimizasyon + saklama süreleri" (iş 7): saklama süreleri tablosu; konum/kullanım 7 günü bu dosyaya `saklamaGun` ile
    gelir.
  - "Güvenlik denetimi" (iş 3): denetim notlarında "aile 3 cihaz sınırı sessiz" (4. telefon en eskisini uyarısız
    düşürür) var; sayfada bir uyarı gerekebilir.
  - "Çok dil" (iş 22) ve "Arayüz önizlemesi" (iş 31): ekran metinleri (ek uyumu dahil) ve görünüm.
