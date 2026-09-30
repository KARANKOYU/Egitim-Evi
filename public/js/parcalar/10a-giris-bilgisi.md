# public/js/parcalar/10a-giris-bilgisi.js

Öğrencilere toplu giriş bilgisi dağıtımı: sınıf ya da bütün okul için şifreleri sunucuya yeniletip listeyi BİR KEZ
göstermek, Excel olarak indirmek ve her öğrenciye kesilip verilecek giriş mektuplarını yazdırmak (mektup yazdırma Excel
aktarımında da kullanılır).

## Bu dosya ne yapar?

Okul yılın başında yüzlerce öğrenci hesabı açar; öğrencilerin ilk girişi için her birine kullanıcı adını ve bir şifreyi
kâğıtla vermek gerekir. Müdür (ya da şifre sıfırlama yetkisi olan öğretmen) Öğrenciler sayfasındaki "Giriş bilgisi
dağıt"a basar:

1. **Seçim penceresi:** "Kimler için" (Bütün okul ya da bir sınıf) ve "Yalnızca henüz giriş yapmamış öğrenciler"
   (işaretli gelir). Altında "**N** öğrencinin şifresi yenilenecek." sayacı seçime göre değişir. Turuncu uyarı: "Seçilen
   öğrencilerin şifreleri yenilenir, açık oturumları kapanır. Liste yalnızca bir kez gösterilir: Excel olarak indir ya da
   yazdır, sonra pencereyi kapat."
2. "**Şifreleri yenile ve listeyi hazırla**": işaret kaldırıldıysa (giriş yapmışlar da seçilecekse) önce "kendi
   belirledikleri şifre çalışmaz olur" onayı. Sunucu yeni şifreleri üretir, veritabanına YALNIZ özetlerini yazar ve
   açık şifreleri bu tek cevapta döner.
3. **Sonuç penceresi:** "N öğrenci için yeni giriş bilgisi hazır (7-A)." ve tablo (Öğrenci · Sınıf · Kullanıcı adı ·
   Şifre · Veli kodu). Düğmeler: "Kapat", "Excel indir", "Yazdır / PDF". Perdeye yanlışlıkla tıklamak pencereyi kapatmaz.
4. **Yazdır:** her öğrenci için kesik çizgili bir kâğıt: okulun giriş adresi, kullanıcı adı, şifre, "İlk girişte kendi
   şifreni belirleyeceksin. Şifreni kimseyle paylaşma." ve veliye veli kodu ("+ Ekle > Veli ekranına bu veli kodunu
   yazın"). Tarayıcının "PDF olarak kaydet"i aynı çıktıyı verir.
5. **Kapat:** liste indirilmediyse ya da yazdırılmadıysa "Kapatırsan bu şifreler bir daha gösterilmez" onayı; sonra
   liste bellekten silinir, Öğrenciler sayfası tazelenir.
6. **Yanlışlıkla ayrılma:** liste açık ve indirilmemişken geri tuşu, menüden başka sayfa, "Çıkış yap", başka portala
   geçme ya da sekmeyi kapatma/yenileme önce sorar: "Giriş bilgileri listesini indirmedin ya da yazdırmadın. Ayrılırsan
   bu şifreler bir daha gösterilmez. Ayrılınsın mı?" (sekmede tarayıcının kendi kutusu). "İptal" → liste yerinde kalır.

Aynı mektup yazdırma işlevi (`girisMektuplariYazdir`) Excel ile toplu hesap açıldıktan sonraki "Giriş kâğıtlarını
yazdır" düğmesinde de kullanılır (`15-aktarim.js`).

Kim görür: `ogrenci.sifre` yetkisi olan (müdürde her zaman) ve öğrenci listesini görebilen kişi — düğme Öğrenciler
sayfasında ([10-mudur.md](10-mudur.md)); listeyi göremeyen (yalnız `ogrenci.sifre`'si olan) kişi düğmeyi hiç görmez.

## İçinde neler var?

- `girisListesi` — sunucunun cevabı + `indirildi`: `{ adet, kapsam, okul, satirlar: [{ ad, sinif, kullaniciAdi, sifre,
  veliKodu }], xlsx (base64), indirildi }`; pencere açık değilken `null`. Sunucu satırları sınıfa, sonra ada göre sıralı
  ve veli kodunu zaten 4'erli tireli gönderir (ekran yine `kisiKoduBicim`'den geçirir; sonuç aynı).
- `girisBilgisiAc()` — seçim penceresi. Sınıf listesi `S._sinifListe`'den, öğrenciler `S._ogrListe`'den (ikisini de
  Öğrenciler sayfası doldurur). Öğeler: `select#gbSinif`, `input#gbGirmeyen` (işaretli), `#gbSayi`, uyarı, `#gbMesaj`;
  düğmeler "Vazgeç" (`modal-kapat`) ve "Şifreleri yenile ve listeyi hazırla" (`giris-bilgisi-uret`). İç `say()` seçime
  göre sayar (`classId` eşit ve — işaretliyse — `girisYapti` yanlış): "N öğrencinin şifresi yenilenecek." ya da "Bu
  seçimde henüz giriş yapmamış öğrenci yok." / "Bu seçimde öğrenci yok."
- `EYLEMLER['giris-bilgisi-ac']` — `girisBilgisiAc()`.
- `EYLEMLER['giris-bilgisi-uret']` — işaret kaldırıldıysa onay: "Giriş yapmış öğrencilerin de şifresi değişecek;
  kendi belirledikleri şifre çalışmaz olur. Devam edilsin mi?". Düğme "Hazırlanıyor..." → `POST /api/school/giris-bilgisi
  { classId, sadeceGirmeyen, onay: true }` → `girisListesi = d`, `indirildi = false`, `girisSonucGoster()`. Ayrıca
  bellekteki öğrenci listesinde şifresi yenilenenleri "henüz giriş yapmadı" yapar (kullanıcı adıyla eşler; sunucu da öyle
  sayar: yeni şifreyle girene kadar). Hata `#gbMesaj`'a kırmızı, düğme geri gelir.
- `girisSonucGoster()` — sonuç penceresi (`modalAc('Giriş bilgileri', …)`): yeşil ileti (`adet`, `kapsam`), "Bu liste
  bir daha gösterilmez. Öğrenciye kendi satırını ver; veli kodu velinin çocuğunu hesabına eklemesi içindir.", en çok 300
  px yüksekliğinde kayan tablo; şifre ve veli kodu (4'erli tireli, `kisiKoduBicim`) eş aralıklı yazıyla. Düğmeler
  `giris-bilgisi-kapat`, `giris-bilgisi-excel`, `giris-bilgisi-yazdir`. Perdeye `data-zorunlu="1"` konur: perdeye
  tıklamak pencereyi kapatmaz (`25-tiklama.js` bu işarete bakar). Ayrıca `TEK_SEFER.girisListesi` kaydı bırakılır
  ([03-mesaj-modal.md](03-mesaj-modal.md)): `sayfada: true`; `sor()` liste indirilmemişse "Giriş bilgileri listesini
  indirmedin ya da yazdırmadın. Ayrılırsan bu şifreler bir daha gösterilmez. Ayrılınsın mı?" döner, indirildiyse boş;
  `temizle()` `girisListesi = null` ve `modalKapat()`. Geri tuşu, `git()`, çıkış, portal değiştirme ve `beforeunload`
  bu kayda bakar.
- `EYLEMLER['giris-bilgisi-excel']` — `xlsx` base64'ünü bayta çevirir, `Blob` (Excel türü) → geçici adres → görünmez
  bağlantıya tıklama → dosya "giris-bilgileri-<kapsam>.xlsx" (kapsamdaki harf, rakam, Türkçe harf ve tire dışı her
  şey "-" olur) olarak iner; 4 saniye sonra geçici adres bırakılır; `indirildi = true`. Excel'i sunucu üretir
  ([../../../sunucu/yardimci/aktarim.md](../../../sunucu/yardimci/aktarim.md) `disa`: "Giriş bilgileri" sayfası; Ad Soyad,
  Sınıf, Kullanıcı adı, Şifre ve yetki varsa Veli kodu sütunları).
- `girisMektuplariYazdir(okulAdi, satirlar)` — `satirlar: [{ ad, sinif, kullaniciAdi, sifre, tcIle, veliKodu }]`. Giriş
  adresi `location.origin` + okulun adresi (`okulYolu(S.user.schoolSlug)`, [05a-dis-sayfalar.md](05a-dis-sayfalar.md);
  okul adresi yoksa yalnız site). Her satır bir `div.mektup`: üstte "Eğitim Evi" ve okul adı; öğrencinin adı ve sınıfı;
  tablo (Giriş adresi, Kullanıcı adı, Şifre — `tcIle` ise "T.C. kimlik numaran" yazılır, şifre yazılmaz); not; `veliKodu`
  varsa veliye talimat ve kod. Hepsi `#yazdirKap`'a (yoksa `body`'nin sonuna yaratılır) yazılır, `body`'ye `yazdiriliyor`
  sınıfı konur, `window.print()`. Yazdırma bitince (`afterprint`) sınıf ve kabın içi temizlenir.
- `EYLEMLER['giris-bilgisi-yazdir']` — `girisMektuplariYazdir(d.okul, d.satirlar)`, `indirildi = true`.
- `EYLEMLER['giris-bilgisi-kapat']` — indirilmediyse onay: "Listeyi indirmedin ya da yazdırmadın. Kapatırsan bu
  şifreler bir daha gösterilmez. Kapatılsın mı?" → `delete TEK_SEFER.girisListesi`, `girisListesi = null`, pencere
  kapanır, `git('okul-ogrenciler')`.

## Kimle konuşur?

- Çağırdıkları: `S` ([00-durum.md](00-durum.md)); `$`, `esc`, `api`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md));
  `modalAc`, `modalKapat`, `mesajGoster`, `TEK_SEFER` ([03-mesaj-modal.md](03-mesaj-modal.md)); `kisiKoduBicim`, `dugmeBekle`,
  `dugmeBitir` ([05-giris.md](05-giris.md)); `okulYolu` ([05a-dis-sayfalar.md](05a-dis-sayfalar.md)); `git`
  ([07-yonlendirme.md](07-yonlendirme.md)); `S._sinifListe`, `S._ogrListe` ([10-mudur.md](10-mudur.md) doldurur).
- Sunucu ucu: `POST /api/school/giris-bilgisi` — [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md).
  `ogrenci.sifre` yetkisi; `onay !== true` → 400; okul başına saatte 30 dağıtım (429); başka okulun sınıfı 400
  ("Sınıf bulunamadı"); varsayılan yalnız hiç giriş yapmamış öğrenciler; rol kapsamı dışındaki öğrenciler atlanır;
  seçilen yoksa 400, 600'den fazlaysa 400 ("Sınıf sınıf dağıt."). Şifreler okunaklı (karışan harf yok) ve toplu
  özetlenir; tek işlemde yazılır, `sifre_degismeli` açılır, son giriş silinir, o öğrencilerin oturumları ve cihaz
  anahtarları silinir, hesap kilitleri kalkar; her öğrenciye bildirim, işlem kaydı `sifre.toplu-dagitildi`. Cevap
  `Cache-Control: no-store`; veli kodu yalnız `ogrenci.duzenle` yetkisi olana gider (yoksa boş).
- Onu kullananlar:
  - [10-mudur.md](10-mudur.md) — Öğrenciler sayfasındaki "Giriş bilgisi dağıt" düğmesi (`data-act="giris-bilgisi-ac"`).
  - `15-aktarim.js` — Excel ile hesap açtıktan sonra "Giriş kâğıtlarını yazdır" (`aktarim-mektup`):
    `girisMektuplariYazdir(S.user.schoolName, hesaplar)`; orada `tcIle` dolu olabilir (şifresi T.C. no olan hesap) ve
    veli kodu sunucudan tiresiz gelir (burada `kisiKoduBicim` tireler).
- Görünüm: `public/css/parcalar/07-mobil.css` — `#yazdirKap { display: none }`; `@media print`'te `body.yazdiriliyor`
  iken `#yazdirKap` dışındaki her şey gizlenir, `.mektup` (kesik çizgi, sayfa içinde bölünmez), `.m-ust`, `.m-ad`,
  `.m-kod` (eş aralıklı), `.m-not`, `.m-veli`; ayrıca `.kod-hucre`. `05-tablo-grafik.css` (`.tablo-sar`, `table.t`),
  `16-giris-sekme.css` (`.onay` kutucuk satırı), `09-kayit-ekrani.css` (`.okul-bilgi` sayaç), `02-form.css` (`.msg`).
- Rol: müdür ve `ogrenci.sifre` yetkisi olan öğretmen.

## Nasıl çalışır (adım adım)?

```
Öğrenciler sayfası (S._ogrListe, S._sinifListe dolu) ─► "Giriş bilgisi dağıt"
  girisBilgisiAc ─► pencere: sınıf seç, [x] yalnız girmeyenler ─► say(): "28 öğrencinin şifresi yenilenecek."
"Şifreleri yenile…" ─► (işaret yoksa onay) ─► POST /api/school/giris-bilgisi { classId, sadeceGirmeyen, onay: true }
   sunucu: yeni şifreler (yalnız özet saklanır), oturumlar kapanır, bildirim, işlem kaydı
   ◄─ { adet, kapsam, okul, satirlar, xlsx }
  girisListesi = d ─► girisSonucGoster(): tablo + [Kapat] [Excel indir] [Yazdır / PDF]; perde zorunlu;
                      TEK_SEFER.girisListesi kaydı
"Excel indir" ─► base64 → Blob → "giris-bilgileri-7-A.xlsx" ; indirildi = true
"Yazdır / PDF" ─► #yazdirKap'a mektuplar ─► body.yazdiriliyor ─► window.print()
                  (yazıcı yalnız mektupları görür) ─► afterprint: kap boşalır ; indirildi = true
"Kapat" ─► indirilmediyse onay ─► kayıt silinir, girisListesi = null ─► git('okul-ogrenciler')
geri tuşu / menü / Çıkış / Geç / sekmeyi kapatma ─► indirilmediyse "Ayrılınsın mı?"
   İptal ─► liste yerinde ; Tamam ─► girisListesi = null, pencere kapanır, istenen yere gidilir
```

## Dikkat!

- **Liste bir kez gösterilir; kayıp geri gelmez.** Sunucu yalnız şifre özetini saklar. Liste kaybolursa aynı öğrenciler
  için yeniden dağıtılır (yeni şifreler, eskiler geçersiz, oturumlar kapanır). Yeni şifreyle hiç girmemiş öğrenci
  "henüz giriş yapmamış" sayılmaya devam eder, bu yüzden varsayılan seçim onları yeniden yakalar.
- **Ayrılma yolları sorar (`commit 543`'ten beri).** Geri tuşu, menü, çıkış, portal değiştirme, yenileme ve sekmeyi
  kapatma liste indirilmemişse önce sorar (`TEK_SEFER`); "Tamam" denince liste bellekten de silinir. Oturum süresi dolup
  sessiz çıkış olursa (`cikisYap(true)`) soru çıkmaz; `oturumDurumunuSifirla` listeyi yine siler. Bazı telefon
  tarayıcıları sekmeyi kapatırken soru kutusunu hiç göstermez.
- **Yeni sayfa açan bir düğme eklersen** `git()` üzerinden geçsin; `$('sayfa').innerHTML`'i doğrudan değiştiren bir yol
  `TEK_SEFER`'i atlar ve pencereyi açık bırakır.
- **"Yazdır"a basmak "indirildi" sayar.** Yazdırma penceresinde vazgeçilse de `indirildi = true` olur ve "Kapat" onay
  sormadan kapatır.
- **`afterprint` gelmezse mektuplar gizli kapta kalır.** Kap ekranda hiç görünmez (`display: none`), ama şifreli
  mektuplar DOM'da `afterprint` olayına kadar durur; bu olayı vermeyen bir tarayıcıda sayfa yenilenene kadar kalır.
- **Mektuptaki "İlk girişte kendi şifreni belirleyeceksin." her zaman doğru değil.** Bu dağıtımda doğru (sunucu
  `sifre_degismeli`'yi açar). Excel aktarımıyla açılan ve şifresi dosyada VERİLEN hesapta (T.C. no değil) sunucu
  `sifreDegismeli`'yi açmaz (`hesapNesnesi`: yalnız `varsayilanSifre`, yani T.C. ile giriş); mektup yine "belirleyeceksin"
  der. "Okulun verdiği her şifrede ilk girişte değiştirme" planlı güvenlik işiyle metin doğru hâle gelecek.
- **Sayaç tahmindir.** `say()` bellekteki listeye bakar; sunucu ayrıca rol kapsamı dışındaki öğrencileri atlar. Sonuç
  sayısı (`adet`) sayaçtan az olabilir. Kişi listeyi yalnız `ogrenci.portal` yetkisiyle görüyorsa (dar liste) sunucu
  `girisYapti`'yı ve kullanıcı adını hiç göndermez: sayaç giriş yapmış öğrencileri de "girmemiş" sayar ve dağıtımdan
  sonraki "henüz giriş yapmadı" işaretlemesi (kullanıcı adıyla eşleme) hiçbir satırı tutmaz. Kod okumasına göre.
- **Sınıf listesi `sinif.yonet` ister.** Sınıfları göremeyen kişide yalnız "Bütün okul" seçilebilir; okul 600 öğrenciyi
  geçiyorsa sunucu "Sınıf sınıf dağıt." der ve bu kişi dağıtım yapamaz.
- **Cevap önbelleğe alınmaz** (`no-store`); şifreler adrese, günlüğe ya da `localStorage`'a yazılmaz.
- **Veli kodu yetkiye bağlı.** `ogrenci.duzenle` yetkisi olmayan kişide tablo ve mektupta veli kodu boş kalır; mektupta
  "Veli için" bölümü hiç çıkmaz.
- **HTML güvenliği:** tablo ve mektup metinleri `esc`'li; dosya adı kapsamdan güvenli karakterlere indirgenir.

## Testleri

- `testler/test-giris-bilgisi.js` — yetkisiz öğretmenin dağıtamaması (403), onaysız çalışmaması (400), başka okulun
  sınıfının reddi; dağıtımda cevabın `no-store` olması, giriş yapmış öğrencinin varsayılan seçimde olmaması, şifrelerin
  okunaklı ve hepsinin farklı olması, veli kodunun 4'erli dört grup olması, sınıf adının satırda olması, Excel dosyasının
  (zip) gelmesi, cevapta şifre özeti ya da kimlik olmaması; eski şifrenin çalışmaması, yeni şifreyle girince kendi
  şifresini koymasının istenmesi, öğrenciye bildirim, bütün sınıfın yenilenmesi ve açık oturumun kapanması, yeni şifreyle
  girmeyenlerin yeniden seçilebilmesi, işlem kaydı.
- `testler/test-aktarim.js` — Excel aktarımında şifresi T.C. olan hesapta şifrenin listede yazılmaması (`tcIle`;
  mektupta "T.C. kimlik numaran").
- `testler/buton-denetimi.js` — `giris-bilgisi-*` eylemlerinin karşılığı.
- Bu dosyanın tarayıcı davranışını (indirme, yazdırma, onaylar) deneyen otomatik bir test yok. Ayrılma sorusu
  2026-09-30'da 3200'de elle denendi (geri tuşu, menü, Çıkış; İptal ve Tamam; "Kapat"tan sonra soru çıkmaması).
- Elle (3200): müdürle Öğrenciler → "Giriş bilgisi dağıt" → bir sınıf seç, sayacı izle → "Şifreleri yenile…" → tablo;
  "Yazdır / PDF" → baskı önizlemesinde yalnız mektuplar; "Kapat" → onay; tablodaki bir öğrenciyle yeni şifreyle gir →
  kendi şifresini belirleme penceresi.

## Son durum

- `git log`: 6 commit. Dosya `a780f62 commit 4` (2026-08-28) ile doğdu (sonuç penceresi, mektup yazdırma, Kapat);
  `85a732a commit 23` (2026-08-28) açma ve üretme eylemlerini, `54f9d84 commit 50` (2026-08-29) seçim penceresini
  (`girisBilgisiAc`, sayaç) ekledi.
- Son değişiklik `commit 543` (2026-09-30): sonuç penceresi `TEK_SEFER.girisListesi` kaydı bırakır; geri tuşu, menü,
  çıkış, portal değiştirme, yenileme ve sekmeyi kapatma liste indirilmemişse önce sorar ve ayrılınca listeyi bellekten
  siler (önceden geri tuşu listeyi uyarısız kaybettiriyordu; çıkışta liste sekmenin belleğinde kalıyordu). "Kapat" kaydı
  siler.
- Ondan önce `0acca75 commit 516` (2026-09-27, kayıt/kişi kodu/portallar): veli kodu tabloda ve mektupta
  `kisiKoduBicim` ile 4'erli tireli; mektuptaki okul adresi `okulYolu()` ile (`/school/<kısa ad>`); velinin talimatı
  "Veli girişi ile hesabınızı açın, veli kodu alanına yazın" yerine "Kayıt ol … sağ üstteki + Ekle > Veli ekranına bu
  veli kodunu yazın (büyük/küçük harf fark eder)" oldu.
- Ondan önce `4bacc99 commit 91` (2026-08-29): "Excel indir" (`giris-bilgisi-excel`) eklendi.
- Bilinen açıklar (kod değiştirilmedi): "Yazdır"ın indirildi sayılması, aktarım hesaplarında mektubun yanlış
  "belirleyeceksin" demesi, dar listede sayacın giriş yapmışları da sayması (Dikkat).
- Planlı işlerden bu dosyaya dokunacaklar: "Güvenlik denetimi" (iş 3: okulun verdiği her şifrede ilk girişte değiştirme
  zorunluluğu — mektup metni o zaman her durumda doğru olur); "Tek kişi tek hesap + portallar öğrencide de" (iş 19:
  öğrencinin başka kurum portalı, mektuptaki okul adresi); "Okul cihazı" ve "Toplantılar" (iş 26, 21: ortak bilgisayar
  ve tahta hesabı giriş bilgileri); "Üst şerit" (iş 29: sol üstte "←" açık pencereyi önce kapatacak — yeni ← → ve ⌂
  düğmeleri de `git()` ya da `TEK_SEFER` üzerinden geçmeli); "Çok dil" (iş 22: mektup ve pencere metinleri).
