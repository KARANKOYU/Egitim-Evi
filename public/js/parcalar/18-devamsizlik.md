# public/js/parcalar/18-devamsizlik.js

Devamsızlığın üç ekranı: öğretmenin ders yoklaması ("Yoklama"), öğrencinin kendi dökümü ("Devamsızlığım"; portalda
"Devamsızlığı") ve müdürün sınıf → öğrenci → gün ekranı ("Devamsızlık").

## Bu dosya ne yapar?

Öğretmen derse girer, telefonundan ya da bilgisayardan "Yoklama"yı açar, dersi seçer ve her öğrenci için Geldi /
Gelmedi / Geç geldi / İzinli'den birine basıp kaydeder. Öğrenci "Devamsızlığım"da kaç kez gelmediğini, geç kaldığını ve
izinli olduğunu görür. Müdür de "Devamsızlık"ta bir sınıf, bir öğrenci ve bir gün seçip o günün her ders saatindeki
durumu görür, gerekirse tek tek düzeltir; altta öğrencinin birikmiş dökümü durur.

Kuralların hepsi sunucuda ([../../../sunucu/bolumler/devamsizlik.md](../../../sunucu/bolumler/devamsizlik.md)): kim
hangi derse yoklama alabilir, kim kimin dökümünü görür, ileri tarihe yazılamaması, öğrenciye ve veliye giden "gelmedi"
bildirimi. En önemli sunucu kuralı ekrana da yansır: **"Geldi" kaydı tutulmaz**, yalnız devamsızlık saklanır; kaydı
olmayan öğrenci derste sayılır. Bu yüzden yoklama ekranında o gün kaydı olmayan herkes "Geldi" seçili gelir (o derse o
gün daha önce "Gelmedi", "Geç geldi" ya da "İzinli" yazılmış öğrenci o durumla gelir).

Velinin kendi devamsızlık sayfası bu dosyada değil (`27-veli-panel.js`'teki `SAYFALAR['veli-devamsizlik']`, bütün
çocuklar bir arada); veli bir çocuğun portalını açarsa "Devamsızlığı" bu dosyadan gelir. Ders programındaki "Şu an —
yoklama al" düğmesinin telefona uygun kısa penceresi de ayrı (`22-programim.js`, `program-yoklama`); aynı sunucu
uçlarını kullanır.

## İçinde neler var?

### Sabitler

- `DURUM_RENK` — `{ var, yok, gec, izinli }` (her biri kendi adı). Dosyada da başka parçada da kullanılmıyor (ölü
  sabit).
- `DEVAM_ADLARI` — `var` "Geldi", `yok` "Gelmedi", `gec` "Geç geldi", `izinli` "İzinli". Müdür ekranında düzenlenemeyen
  ders saatinin etiketinde kullanılır. Dosyanın SONUNDA tanımlı; yalnız sayfa çizilirken okunduğu için sorun yok.
  (Sunucunun `DEVAM_AD`'ıyla aynı adlar; yoklama ekranındaki düğme adları ise sunucudan `durumlar` olarak gelir.)

### Öğretmen: "Yoklama" (`SAYFALAR.yoklama`, `yoklamaCiz`)

- `SAYFALAR.yoklama()` — `GET /api/devamsizlik/derslerim`. Başlık "YOKLAMA", alt yazı "Ders seç, günü işaretle,
  kaydet.". Ders yoksa boş kutu: "Yoklama alabileceğin ders yok. Müdürün seni bir derse ataması gerekiyor.". Varsa
  "Ders seç" kartında her ders bir kutucuk (`button.tur-sec`, `data-act="yoklama-ders" data-id=<ders>`): "7-A ·
  Matematik" ve "28 öğrenci"; seçili ders `secili`. Altta `#yoklamaAlan`; `S.yoklamaDers` doluysa `yoklamaCiz()`.
- `yoklamaCiz()` — `#yoklamaAlan`'a önce "Yükleniyor...", sonra `GET /api/devamsizlik/yoklama?lessonId=<ders>` (+
  `&tarih=` seçildiyse). Cevaptan `S.yoklamaTarih` (boş gönderildiyse sunucunun bugünü) ve `S.yoklamaDurum`
  (öğrenci kimliği → durum; kaydı olmayan `var`) kurulur. Çizilen:
  - başlık "7-A · Matematik" ve sağda tarih kutusu `input#yoklamaTarih` (`type="date"`); değişince `S.yoklamaTarih`
    yazılır ve ekran o günle yeniden çizilir;
  - "Gelmeyenleri işaretle. İşaretlemediklerin derste sayılır." ipucu ve "Hepsi geldi" (`yoklama-hepsi-var`);
  - her öğrenci için `.yoklama-satir`: ad ve `.durum-secim[data-ogrenci]` içinde sunucunun `durumlar` listesindeki her
    durum için `button.durum-dugme.<durum>` (`data-act="yoklama-durum" data-ogrenci data-durum`), şimdiki durum
    `secili`;
  - `#yoklamaMesaj` ve "Yoklamayı kaydet" (`yoklama-kaydet`).
  - Hata olursa kartta kırmızı ileti.

Düğmelerin karşılığı `25-tiklama.js` → `islem()`'de:

- `yoklama-ders` — `S.yoklamaDers` = ders, `S.yoklamaTarih` boşaltılır (yeni ders bugünle açılır), `git('yoklama')`.
- `yoklama-durum` — `S.yoklamaDurum[öğrenci]` = durum; aynı satırdaki düğmelerin `secili`'si güncellenir (sayfa yeniden
  çizilmez).
- `yoklama-hepsi-var` — ekrandaki BÜTÜN öğrencileri `var` yapar (önceden "Gelmedi" seçilmiş olanlar da).
- `yoklama-kaydet` — `S.yoklamaDurum`'daki herkes `girisler: [{ ogrenciId, durum }]` olur;
  `POST /api/devamsizlik/yoklama { lessonId, tarih, girisler }`; sonuç `#yoklamaMesaj`'a ("3 devamsızlık kaydedildi." ya
  da "Yoklama kaydedildi — herkes derste."; hata kırmızı). Düğme istek sürerken kapalı.

### Öğrenci: "Devamsızlığım" (`SAYFALAR.devamsizligim`, `devamsizlikGovdesi`)

- `SAYFALAR.devamsizligim()` — öğrenci olmayan biri bir öğrencinin portalındaysa (`S.viewStudentId`)
  `GET /api/devamsizlik/ogrenci?studentId=`, başlık "DEVAMSIZLIK", alt yazı "<ad> adına görüntülüyorsun."; öğrencinin
  kendisiyse `GET /api/devamsizlik/benim`, başlık "DEVAMSIZLIĞIM", alt yazı "Derslere katılım kaydın.".
- `devamsizlikGovdesi(baslik, alt, d, adGoster)` — HTML döner: dört sayı kutusu (`stat`: Gelmedi, Geç geldi, İzinli,
  Toplam kayıt), kayıt yoksa "Hiç devamsızlık kaydın yok. Böyle devam.", varsa her kayıt bir satır: ders adı ve renkli
  durum etiketi (`span.durum-etiket.<durum>`, sunucunun `durumAd`'ı), altında tarih (`2026-09-25` biçiminde, olduğu
  gibi), yoklamayı alanın adı ve varsa not. Dördüncü parametre `adGoster` verilir ama kullanılmaz. Kayıtlar sunucudan
  yeniden eskiye, en çok 200.

### Müdür: "Devamsızlık" (`SAYFALAR.devamsizlik`, `devamsizlikBagla`)

- `SAYFALAR.devamsizlik()` — `GET /api/school/classes` ile sınıfları alır. `S.dvSinif` boşsa ilk sınıf, `S.dvTarih`
  boşsa bugün (`toISOString`, UTC). Başlık "DEVAMSIZLIK"; süzgeç kartında Sınıf (`#dvSinif`), Öğrenci (`#dvOgrenci`,
  önce "Yükleniyor..."), Gün (`input#dvTarih`, `type="date"`) ve "Bugün" (`data-act="dv-bugun"`); altında gün adını
  yazan `#dvGunAdi`. Sonra `#dvAlan` (seçili günün dersleri) ve "Dönem özeti" kartı (`#dvOzet`, başta "Öğrenci seçince
  burada birikimi görürsün."). `yaz()`'dan sonra `devamsizlikBagla(siniflar)`.
- `devamsizlikBagla(siniflar)` — üç kutudan biri yoksa çıkar. İçindeki yerel işlevler:
  - `ogrencileriYukle()` — `S.dvSinif` = seçili sınıf; `GET /api/school/students` (okulun BÜTÜN öğrencileri), tarayıcıda
    bu sınıfa süzülür ve Türkçe ada göre sıralanır. Sınıfta öğrenci yoksa kutuda "Bu sınıfta öğrenci yok" ve alanda "Bu
    sınıfa öğrenci yerleştirilmemiş.". `S.dvOgrenci` listede yoksa ilk öğrenci seçilir; sonra `gunuCiz()` ve
    `ozetiCiz()`.
  - `gunuCiz()` — `GET /api/devamsizlik/gun?studentId=&tarih=`. `#dvGunAdi`'na "25 Eylül 2026, Cuma". O gün sınıfın
    programında ders yoksa "Cuma günü bu sınıfın programında ders yok.". Varsa başlık "<öğrenci> · <tarih>" ve her ders
    saati bir `.ders-satir`: "Ders 1", ders adı, "08:30 – 09:10 · <öğretmen>"; `duzenlenebilir` ise sağda bir açılır kutu
    (`select.durum-kutu[data-ders]`, seçenekler sunucunun `durumlar`'ı), değilse renkli etiket (`DEVAM_ADLARI`). Kutu
    değişince kutu kapanır, `POST /api/devamsizlik/isaretle { studentId, lessonId, tarih, durum }`; başarıda "Kaydedildi."
    (`#dvMesaj`) ve özet yenilenir; hatada ileti ve gün yeniden çizilir (kutu gerçek duruma döner).
  - `ozetiCiz()` — `GET /api/devamsizlik/ogrenci?studentId=` (gün sınırı yok: bakılan eğitim yılının kayıtları). Dört
    sayı kutusu (Gelmedi, Geç geldi, İzinli, Toplam) ve Tarih / Ders / Durum / Not tablosu (tarih `tarihGun` ile "25
    Eylül 2026, Cuma"); kayıt yoksa "Hiç devamsızlık kaydı yok.". Hata olursa özet sessizce boşalır.
  - Olaylar: sınıf değişince `ogrencileriYukle`, öğrenci değişince gün + özet, tarih değişince yalnız gün.
  - `S.dvBugunGit` — `dv-bugun` düğmesi için: tarihi bugüne (UTC) çekip günü yeniden çizer. `25-tiklama.js`
    (`dv-bugun`) bunu varsa çağırır.

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Çağırdıkları: `S` ([00-durum.md](00-durum.md)); `$`, `esc`, `api` ([01-yardimcilar.md](01-yardimcilar.md));
  `tarihGun` ([02-ikonlar.md](02-ikonlar.md)); `mesajGoster` ([03-mesaj-modal.md](03-mesaj-modal.md)); `hero`, `yaz`,
  `bosKutu` ([07-yonlendirme.md](07-yonlendirme.md)); `stat`, `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md)).
- Sunucu uçları:
  - [../../../sunucu/bolumler/devamsizlik.md](../../../sunucu/bolumler/devamsizlik.md):
    - `GET /api/devamsizlik/derslerim` — `devamsizlik.al` yoksa 403 "Yoklama yetkin yok"; öğretmene yalnız kendi dersleri
      ve müdürün açıkça kapsam verdikleri, müdüre okulun bütün dersleri.
    - `GET /api/devamsizlik/yoklama?lessonId=&tarih=` — sınıf listesi ve o günün durumları (tarih boşsa bugün; ileri
      tarih de açılır ama kaydedilemez).
    - `POST /api/devamsizlik/yoklama { lessonId, tarih, girisler }` — o dersin o günkü bütün kayıtlarını yeniden yazar;
      ileri tarih 400; durumu değişen öğrenciye ve velisine bildirim.
    - `GET /api/devamsizlik/benim` (yalnız öğrenci), `GET /api/devamsizlik/ogrenci?studentId=` (veli, `devamsizlik.gor`,
      öğrencinin öğretmeni…).
    - `GET /api/devamsizlik/gun?studentId=&tarih=` ve `POST /api/devamsizlik/isaretle` — tek öğrencinin tek ders saati.
    - `GET /api/devamsizlik/ozet` (okul geneli özet) bu dosyadan çağrılmıyor (bkz. "Dikkat!").
    - Yoklama ve işaretleme, geçmiş eğitim yılına bakan personelde 409 alır
      ([../../../sunucu/api.md](../../../sunucu/api.md) arşiv kapısı); okul "Devamsızlık"ı kapattıysa uçlar
      `ozellikKapali` ile 403 ([../../../sunucu/bolumler/ozellikler.md](../../../sunucu/bolumler/ozellikler.md)).
  - [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md): `GET /api/school/classes` (`sinif.yonet`
    ister) ve `GET /api/school/students` (`ogrenci.duzenle` ya da `ogrenci.portal` ister) — yalnız müdür ekranı.
- Onu kullananlar:
  - `25-tiklama.js` — `yoklama-ders`, `yoklama-durum`, `yoklama-hepsi-var`, `yoklama-kaydet`, `dv-bugun`
    (`S.dvBugunGit`); `S.yoklamaDers`, `S.yoklamaTarih`, `S.yoklamaDurum`.
  - `26-baslat.js` — çıkışta ve portal değişiminde (`oturumDurumunuSifirla`; portal geçişinde `08c-kisilikler.js`
    çağırır) `S.yoklamaDers`, `S.yoklamaTarih`, `S.yoklamaDurum`'u sıfırlar (`S.dvSinif`, `S.dvOgrenci`, `S.dvTarih`'e
    dokunmaz).
  - Menü ([06-menu.md](06-menu.md)): "Yoklama" — `devamsizlik.al` yetkili öğretmen ve müdür ("Kendi Derslerim");
    "Devamsızlığım" — öğrenci; "Devamsızlığı" — bir öğrencinin portalı; "Devamsızlık" — müdür ve `devamsizlik.gor`
    yetkili öğretmen. Dördü de okulun kapatabileceği "Devamsızlık" bölümüne bağlı (`SAYFA_OZELLIK`).
  - Ana sayfa kutucukları ([08-ana-sayfa.md](08-ana-sayfa.md)): öğretmende "Yoklama — Derse katılım al", müdürde
    "Devamsızlık — Okul geneli yoklama özeti".
- CSS: `public/css/parcalar/20-devamsizlik.css` — `.yoklama-satir`, `.durum-secim`, `.durum-dugme` (seçiliyken `var`
  yeşil, `yok` kırmızı, `gec` turuncu, `izinli` mavi), `.durum-etiket` (aynı renklerin açık zemini), `.tarih-kutu`;
  `22-cesitli.css` — `.ders-satir`, `.ders-sira`, `.durum-kutu`; `18-aktarim-kvkk.css` — ders kutucuğu `.tur-sec`, özet
  tablosu `.rapor-kaydir` / `.rapor-tablo`; `04-kartlar.css` — `.stat`; `08-menu-filtre.css` — `.filtre-satir`.
- Rol: yoklama — `devamsizlik.al` (öğretmende kendi dersi ya da açık kapsam), müdür; kendi dökümü — öğrenci; portalda
  döküm — veli, müdür, öğrenciyi görebilen öğretmen; müdür ekranı — müdür (ve aşağıdaki sorunla `devamsizlik.gor`'lu
  öğretmen).

## Nasıl çalışır (adım adım)?

```
Öğretmen "Yoklama":
  GET derslerim ─► ders kutucukları ── basar ─► yoklama-ders ─► S.yoklamaDers, tarih boş ─► git('yoklama')
  yoklamaCiz ─► GET yoklama?lessonId ─► S.yoklamaTarih (bugün), S.yoklamaDurum {öğrenci: 'var'|'yok'|…}
     Ali  [Geldi] Gelmedi  Geç geldi  İzinli         ◄─ yoklama-durum: S.yoklamaDurum[ali]='yok'
     tarih kutusu değişirse ─► yoklamaCiz (o günün kayıtlarıyla)
  "Yoklamayı kaydet" ─► POST yoklama {lessonId, tarih, girisler: herkes}
                         sunucu: o ders + o gün sil, devamsızları yaz, değişene bildirim
                       ─► "1 devamsızlık kaydedildi."

Müdür "Devamsızlık":
  GET school/classes ─► Sınıf ▾  Öğrenci ▾  Gün [..]  [Bugün]
  ogrencileriYukle ─► GET school/students ─► sınıfa süz ─► ilk öğrenci
     gunuCiz  ─► GET devamsizlik/gun ─► Ders 1 Matematik 08:30–09:10  [Geldi ▾]
                    kutu değişir ─► POST isaretle ─► "Kaydedildi." ─► ozetiCiz
     ozetiCiz ─► GET devamsizlik/ogrenci ─► Gelmedi 3 · Geç 1 · İzinli 0 · Toplam 4 + tablo

Öğrenci "Devamsızlığım":  GET devamsizlik/benim ─► sayılar + kayıt listesi
Portal "Devamsızlığı":    GET devamsizlik/ogrenci?studentId ─► aynı görünüm
```

## Dikkat!

- **`devamsizlik.gor` yetkili öğretmende "Devamsızlık" sayfası açılmaz.** Menü "Devamsızlık"ı `devamsizlik.gor` olan
  öğretmene gösterir ("Rehber Öğretmen" ve "Nöbetçi Öğretmen" şablonlarında var), ama sayfa önce
  `GET /api/school/classes`'ı çağırır; bu uç `sinif.yonet` ister. Bu iki şablonda `sinif.yonet` yok: sayfa yerine "Bu
  işlem için yetkin yok" yazar. (Öğrenci listesi için de `/api/school/students` `ogrenci.duzenle` ya da `ogrenci.portal`
  ister.) Müdür ve "Müdür Yardımcısı" şablonu etkilenmez. Kod okumasına göre; denenmedi. Düzeltme önerisi: devamsızlık
  bölümüne `devamsizlik.gor` ile çalışan bir sınıf/öğrenci listesi ucu.
- **Okul geneli özet ekranda yok.** Müdürün ana sayfa kutucuğu "Okul geneli yoklama özeti" der; sayfa ise tek öğrencinin
  gününü ve dökümünü gösterir. Sunucudaki `GET /api/devamsizlik/ozet` (en çok gelmeyenden aza, öğrenci başına sayılar)
  hiçbir ön yüz dosyasından çağrılmıyor (grep).
- **"Hepsi geldi" önceki işaretleri de siler.** Yoklama ekranı o günün kayıtlarıyla açılır; "Hepsi geldi"ye basıp
  kaydeden öğretmen, daha önce "Gelmedi" yazılmış öğrencilerin o dersteki kaydını da kaldırmış olur (sunucu o dersin o
  günkü kayıtlarını baştan yazar). Etüt yoklamasındaki "Hepsi geldi" ise yalnız boşları doldurur
  ([18b-etut.md](18b-etut.md)).
- **Bildirimde ders saati yok.** Bu ekran `POST yoklama`'ya `saat` göndermez; öğrenciye "Bugün Matematik dersi:
  Gelmedi", veliye "Çocuğunuz … bugün Matematik dersine gelmedi (izinsiz)." gider. Ders programındaki kısa yoklama
  penceresi (`22-programim.js`) `saat` gönderir ("bugün saat 09:20 Matematik dersine …"). Müdürün `isaretle`'si de saat
  göndermez.
- **"Bugün" UTC'ye göre.** Müdür ekranının varsayılan günü ve "Bugün" düğmesi `new Date().toISOString().slice(0, 10)`
  kullanır: Türkiye saatiyle 00:00–02:59 arasında dünü seçer. Ayrıca `S.dvTarih` yalnız boşken yazılır ve çıkışta
  silinmez; sekme açık kaldıkça sayfa en son seçilen günle açılır (ertesi gün de). Öğretmenin yoklama ekranında sorun
  yok: tarih boş gönderilir, "bugün"ü sunucu söyler.
- **Okulun bütün öğrenci listesi her sınıf değişiminde yeniden iner.** `ogrencileriYukle` `GET /api/school/students`'ı
  her seferinde çağırıp tarayıcıda süzer; büyük okulda (yüzlerce öğrenci) her sınıf seçimi ağır bir istek.
- **Açılır kutu tıklama dağıtıcısına bağlı değil.** Kod yorumu: `data-act` konsaydı `25-tiklama.js` tıklamada
  `preventDefault` çağırır ve açılır kutu açılmazdı; bu yüzden kutular kendi `onchange`'ine bağlanır. Aynı ekrana yeni
  bir `select` eklersen aynı yolu izle.
- **İleri tarih açılır, kaydedilmez.** Tarih kutusunda ileri bir gün seçilince liste gelir (GET ileri tarihi kabul eder);
  "Yoklamayı kaydet" ise 400 "İleri tarihe yoklama alınamaz" alır.
- **Öğrencisi olmayan sınıfta kaydet hata verir.** Sınıfta öğrenci yoksa `S.yoklamaDurum` boş kalır, `girisler` boş
  gider ve sunucu 400 "Yoklama boş" döner; ekranda öğrenci satırı da olmadığı için kişi neden kaydedemediğini ancak bu
  iletiden anlar.
- **Sınıfı olmayan okulda sınıfsız öğrenciler listelenir.** Müdür ekranında okulun hiç sınıfı yoksa Sınıf kutusu boş
  kalır, `S.dvSinif` `''` olur ve süzgeç `classId === ''` olan (sınıfa yerleştirilmemiş) öğrencileri getirir; günleri
  her zaman "… günü bu sınıfın programında ders yok." der. Sınıflar varken ise sınıfsız öğrenciye bu ekrandan
  ulaşılamaz. Kod okumasına göre; denenmedi.
- **Ana sayfadaki "Yoklama" kutucuğu yetkiye bakmaz.** Öğretmenin ana sayfasında kutucuk her zaman görünür; okul
  Öğretmen rolünden `devamsizlik.al`'ı kapattıysa menüde "Yoklama" yoktur ama kutucuğa basan öğretmen bu sayfada
  "Yoklama yetkin yok" görür ([08-ana-sayfa.md](08-ana-sayfa.md) "Dikkat!").
- **Tarih biçimi iki türlü.** Öğrencinin dökümünde tarih ham (`2026-09-25`), müdürün özet tablosunda `tarihGun` ile
  ("25 Eylül 2026, Cuma") yazılır.
- **"Dönem özeti" aslında yılın özeti.** `ozetiCiz` gün sınırı vermez; sunucu bakılan eğitim yılının bütün kayıtlarını
  sayar, listede en çok 200 satır gösterir.
- Müdürün yoklama ekranında okulun bütün dersleri listelenir (müdürde `devamsizlik.al` her derse geçerlidir); büyük
  okulda uzun bir kutucuk ızgarası çıkar.
- Portalda "Devamsızlığı" açan kişinin o öğrencinin dökümünü görme yetkisi yoksa (ör. yalnız `ogrenci.portal` verilmiş,
  o öğrencinin dersine girmeyen öğretmen) sayfa sunucunun 403 iletisini gösterir.
- Ölü kod: `DURUM_RENK` hiçbir yerde kullanılmıyor; `devamsizlikGovdesi`'nin `adGoster` parametresi okunmuyor.

## Testleri

- Bu dosyanın tarayıcıda çalışan bir testi yok. Sunucu tarafı:
  - `testler/test-devamsizlik.js` — öğretmenin dersleri, yoklama ekranı, kayıt, öğrencinin kendi dökümü, velinin görmesi,
    öğrencinin başkasınınkini görememesi, üzerine yazma, ileri tarih, okul özeti, yetkisiz yoklama.
  - `testler/test-bildirim.js` (devamsızlık bildirimi, tekrar kayıtta yeniden gitmemesi), `test-egitim-yili.js` (eski
    yılda `isaretle` ile girilen devamsızlık yeni yılın okul özetinde görünmez; arşiv kapısının 409'unu sınav grubuyla
    dener, yoklamayla değil), `test-nakil.js`, `test-ozellikler.js` (bölüm kapalı), `test-veli-coklu.js`,
    `test-siniflarim.js` (`saat`'li yoklama).
  - `testler/yetki-denetimi.js` (okul özeti yalnız müdüre, `derslerim` müdür ve öğretmene, öğrencinin dökümü kime
    açık) ve `testler/girdi-denetimi.js` (başka okulun öğrencisinin dökümü sızmıyor).
- `testler/buton-denetimi.js` — `yoklama-ders`, `yoklama-durum`, `yoklama-hepsi-var`, `yoklama-kaydet`, `dv-bugun`
  eylemlerinin `25-tiklama.js`'te karşılığı ve `/api/devamsizlik`, `/api/school` yollarının sunucuda olması.
- `testler/yazim-denetimi.js`, `testler/test-kucult.js` — ekran metinleri ve birleşik paketin derlenmesi.
- `araclar/gezinti.js` ekran turu (test değil) "Yoklama — ders seçimi", "Yoklama ekranı", "Devamsızlık özeti" ve
  "Devamsızlığım" görüntülerini alır.
- Elle: `testler/seed.js`'teki öğretmenle gir → Yoklama → bir ders → bir öğrenciyi "Gelmedi" → kaydet: "1 devamsızlık
  kaydedildi."; o öğrencinin hesabında bildirim ve "Devamsızlığım"da "Gelmedi" sayısı 1. Müdürle önce "Ders Programı"ndan
  bugüne o dersin bir saatini ekle (`seed.js` program kurmaz; programsız günde ekran "… günü bu sınıfın programında ders
  yok." der), sonra Devamsızlık → aynı sınıf, öğrenci ve gün → o ders saatinde kutu "Gelmedi"yi göstermeli; "İzinli"
  yap → "Kaydedildi." ve özet tablosu güncellenir.

## Son durum

- `git log`: 3 commit. Son değişiklik `ed80e90 commit 51` (2026-08-29): müdür ekranının sayfa işlevi
  `SAYFALAR.devamsizlik` eklendi (33 satır: sınıfları alma, süzgeç kartı, "Dönem özeti" kartı); `devamsizlikBagla`
  ondan önce de dosyadaydı ama onu açan sayfa yoktu.
- `31cb5f2 commit 39` (2026-08-28): dosyanın sonuna `DEVAM_ADLARI` eklendi (`gunuCiz` onu zaten kullanıyordu, tanımı
  yoktu); aynı commit `20-devamsizlik.css`'i, `testler/test-devamsizlik.js`'i ve veli devamsızlık ekranının bir
  görüntüsünü getirdi. Dosyanın ilk hâli `de781cf commit 38` (2026-08-28; 287 satır): yoklama ekranı, öğrencinin
  dökümü, `devamsizlikBagla`; aynı commit `sunucu/bolumler/devamsizlik.js`'e yalnız `module.exports` bloğunu ekledi.
  O günden beri dokunulmadı.
- Bilinen açıklar (kod değiştirilmedi): `devamsizlik.gor`'lu öğretmende sayfanın açılmaması, okul geneli özetin ekranda
  olmaması, "Hepsi geldi"nin eski işaretleri silmesi, bildirimde saatin olmaması, UTC "bugün", her sınıf seçiminde bütün
  öğrenci listesinin inmesi, öğrencisiz sınıfta "Yoklama boş", sınıfsız okulda sınıfsız öğrencilerin listelenmesi, ölü
  `DURUM_RENK`.
- Planlı işlerden bu dosyayı etkileyecekler:
  - "Özel roller" (öneri): yeni "Sınıf Öğretmeni" şablonu `devamsizlik.gor`'u kendi sınıfı kapsamında verecek; yukarıdaki
    `/api/school/classes` sorunu çözülmeden bu şablonla da sayfa açılmaz.
  - "Çalışan olarak ekleme": öğretmen olmayan çalışan yoklamaya atanamayacak (`derslerim` ve menü buna göre).
  - "Optimizasyon + saklama süreleri" (öğrenci ve veli yalnız son bir geçmiş yılı görür) ve "Yıl geçişi" dökümlerin hangi
    yılları kapsadığını değiştirecek.
