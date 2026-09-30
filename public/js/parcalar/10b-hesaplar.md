# public/js/parcalar/10b-hesaplar.js

Okulun açtığı hesapların pencereleri: yeni öğrenci ve servisçi hesabı (şifreyi bir kez gösteren sonuç ekranıyla), bir
hesabın "Hesap" penceresi (bilgiler, şifre, veli kodu, silme), kendi hesabıyla gelen öğretmenin dar penceresi ve öğretmeni
kişi koduyla okula ekleme.

## Bu dosya ne yapar?

Eğitim Evi'nde öğrenci ve servisçi siteye kendisi kaydolmaz; hesabını okul açar. Öğretmen ise kendi yetişkin hesabını
açar, "+ Ekle > Öğretmen" ekranındaki kişi kodunu müdüre verir; müdür kodu girip onu okula ekler. Bu dosya bu işlerin
ekranda görünen yüzüdür, üç pencere taşır:

1. **Yeni hesap** (Öğrenciler sayfasında "Öğrenci ekle", Servisler sayfasında "Servisçi ekle"). Ad, soyad ve T.C. kimlik
   no yeter; kullanıcı adı ve şifre boş bırakılırsa ikisi de T.C. no olur ve kişi ilk girişte kendi şifresini
   belirlemeden devam edemez. "Hesabı aç"tan sonra "Hesap açıldı" penceresi kullanıcı adını, şifreyi (yazıldıysa, **yalnız
   bu kez**), okulun giriş adresini ve öğrencide veli kodunu gösterir; kullanıcı adının, yazılmış şifrenin ve veli kodunun
   yanında Kopyala düğmesi vardır. Şifre ekrandayken pencerenin dışına tıklamak onu kapatmaz; geri tuşu, menü, çıkış ve
   sekmeyi kapatma önce sorar ("Tamam" ve "Bir tane daha aç" sormaz). Yazılan T.C. başka okulda
   kayıtlı bir öğrencinin çıkarsa yeni hesap açılmaz: doğum tarihi de tutuyorsa var olan hesap bu okula taşınır ("Öğrenci
   okuluna taşındı" penceresi).
2. **Hesap penceresi** (listelerdeki "Hesap" düğmesi). Aynı alanlar dolu gelir, "Bilgileri kaydet" yalnız değişenleri
   gönderir. Altında şifre bölümü (yeni şifre yaz ya da "Rastgele üret", "İlk girişte kendi şifresini belirlesin",
   "Şifreyi T.C. no yap"), öğrencide veli kodu ("Yeni kod üret") ve velileri (bağlama işi [10-mudur.md](10-mudur.md)'de),
   öğretmende/servisçide "Hesabı sil". Öğretmen kendi yetişkin hesabından eşlenmişse (`bagli`) pencere daralır: adını,
   e-postasını, şifresini kendisi yönetir; okul yalnız branşını seçer ya da onu okuldan çıkarır.
3. **Öğretmen ekle** (Öğretmenler sayfasında "Kodla ekle"). Müdür 16 haneli kişi kodunu yazar, "Bul" sunucudan adın
   maskeli hâlini getirir ("Ay** Ka**"), branş seçilip "Okula ekle"ye basılır. Kod bir kez kullanılır.

Bütün kurallar sunucudadır ([../../../sunucu/bolumler/hesaplar.md](../../../sunucu/bolumler/hesaplar.md)); bu dosya
yalnız yazarken yol gösterir (boş ad, geçersiz T.C., kullanıcı adı ve şifre kuralı, e-posta biçimi, yarım doğum tarihi
gibi hataları sunucuya gitmeden kutunun altına yazar) ve sunucunun hatasını doğru kutunun altına taşır.

Kim görür: müdür her şeyi; öğretmen müdürün verdiği yetkiye göre (`ogrenci.hesap-ac`, `ogrenci.duzenle`,
`ogrenci.sifre`, `ogretmen.onayla`, `ogretmen.duzenle`, `ogretmen.cikar`, `servis.yonet`). Düğmelerin nerede ve hangi
yetkiyle çıktığı onları çizen sayfalardadır ([10-mudur.md](10-mudur.md), `19c-okul-hayati.js`).

Ön yüz parçaları ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`, [../../../sunucu/http.md](../../../sunucu/http.md)
`birlesikOku`): bu dosyadaki `var` ve `function`'lar bütün parçalara açıktır, düğmeler `EYLEMLER` üzerinden
`25-tiklama.js`'in tıklama yöneticisinden çağrılır (`EYLEMLER[ad](düğme, düğmenin data-id'si)`).

## İçinde neler var?

### Sabitler

- `HESAP_ROL` — rol → `{ ad, yeni (pencere başlığı), sayfa (hesabın listelendiği sayfa) }`: `student` → "Yeni öğrenci
  hesabı", `okul-ogrenciler`; `servisci` → "Yeni servisçi hesabı", `servis`; `teacher` → "Yeni öğretmen hesabı",
  `ogretmenler` (öğretmen için yeni hesap penceresi açılmaz; bu satır yalnız düzenlemeden sonra hangi listenin
  yenileneceğini söylemek için kullanılır). `ad` alanını ("öğrenci", "servisçi") bugün hiçbir yer okumuyor.
- `HESAP_HATA_ALANI` — sunucunun hata cevabındaki `alan` → penceredeki kutu: `ad` → `hfAd`, `tc` → `hfTc`,
  `kullaniciAdi` → `hfKadi`, `eposta` → `hfEposta`, `dogum` → `hfDogumGun` (tarih seçicinin Gün listesi), `telefon` →
  `hfTelefon`, `okulNo` → `hfOkulNo`, `sinifId` → `hfSinif`, `brans` → `hfBrans`, `sifre` → `hfSifre`. Listede olmayan
  alan (ör. `rolId`) ya da pencerede olmayan/kilitli kutu → ileti pencerenin altına yazılır.

### Form yardımcıları

- `adBol(tam)` — "Ayşe Nur Yılmaz" → `{ ad: 'Ayşe Nur', soyad: 'Yılmaz' }`: son kelime soyad, öncesi ad; tek kelimede
  soyad boş.
- `hesapAlanlari(rol, h)` — pencerenin form HTML'i. `h` düzenlenen hesap (`GET /api/school/hesap` cevabı), yoksa yeni
  hesap. Alanlar ve kimlikleri:
  - `hfAd` (60) ve `hfSoyad` (40) yan yana (`.row2`);
  - `hfTc` — `inputmode="numeric"`, 11 hane; ipucu "Yalnızca okul yönetimi görür; öğretmenler ve öğrenciler görmez.";
  - `hfKadi` (30) — yeni hesapta yer tutucu "Boş bırakırsan T.C. no olur"; ipucu "Harfle başlar; harf, rakam, nokta ve
    alt çizgi. Okulun içinde tek olmalı.";
  - `hfSifre` — YALNIZ yeni hesapta, düz metin kutusu; boşsa şifre T.C. no olur (ipucu bunu söyler);
  - `hfEposta` (isteğe bağlı) — hesabı kişi kendisi açtıysa (`h.olusturan === 'kendisi'`) kutu kilitli ve ipucu
    "e-postasını yalnızca kendisi değiştirebilir"; değilse "Yazılırsa giriş kodu ve şifre sıfırlama bağlantısı oraya
    gider.";
  - doğum tarihi — `tarihSecici('hfDogum', …)` üç açılır liste (gün/ay/yıl) + gizli `hfDogum` (`YYYY-AA-GG`); yıl listesi
    öğrencide bu yıldan 3 yıl öncesinden, öbürlerinde 17 yıl öncesinden başlar (`enKucukYas`). Yeni öğrencide ipucu:
    başka okuldan gelen öğrencide gerekli (T.C. + doğum tarihi eşleşirse hesabı taşınır);
  - öğrencide: `hfSinif` (`S._sinifListe`'den; ilk seçenek "— sınıfsız —") ve `hfOkulNo` (20);
  - öğrenci dışında: `hfTelefon` (`type="tel"`, 20; servisçide ipucu "Servisteki öğrencilerin velileri bu numarayı
    görür."). Telefon kutusuna ülke seçici `04c-telefon.js`'in gözcüsüyle kendiliğinden eklenir;
  - öğretmende: `hfBrans` (`S.meta.subjects`'ten; "— belirtme —");
  - `hfAdres` (200);
  - öğrencide: `hfNot` "Yönetim notu" (300; "Yalnızca okul yönetimi görür.").
- `hesapGovdesi(rol)` — kutulardan istek gövdesi: `ad`, `soyad`, `tc` (boşluksuz), `kullaniciAdi` (kırpılmış, küçük
  harf), `eposta` (kutu kilitliyse hiç konmaz), `dogum`, `adres`, varsa `sifre`; öğrencide `classId`, `okulNo`, `not`;
  öbürlerinde `telefon` (`telefonOku`: ülke koduyla); öğretmende `brans`.
- `hesapHatasi(e, mesajYeri)` — sunucu hatasının `veri.alan`'ı `HESAP_HATA_ALANI`'nda varsa ve kutu açıksa iletiyi o kutunun
  altına yazar (`alanHatasi`) ve oraya kaydırır (`ilkHatayaGit`); değilse `mesajGoster(mesajYeri, 'hata', …)`.
- `hesapDenetle(g, yeni, mevcut)` — sunucuya gitmeden önce: önce eski hata işaretlerini siler, sonra
  - ad ve soyad boş olamaz ("Adı yaz.", "Soyadı yaz.");
  - T.C. yeni hesapta zorunlu ("T.C. kimlik no gerekli."), yazıldıysa `tcSorunuTR` (11 hane, 0'la başlamaz, iki kontrol
    hanesi);
  - kullanıcı adı yazıldıysa ve yalnız rakam değilse `kullaniciAdiSorunuTR` (3–30, Türkçe harf yok, harfle başlar, harf/
    rakam/nokta/alt çizgi);
  - yalnız rakamdan oluşan kullanıcı adı ancak kişinin T.C.'si olabilir ("Rakamlardan oluşan kullanıcı adı yalnızca
    kişinin T.C. no'su olabilir."); düzenlemede kişinin şimdiki kullanıcı adı eski T.C.'si olarak kaldıysa engellenmez;
  - şifre yazıldıysa `sifreSorunuTR(s, gucluSifreli({ role: g.rol }))` (öğrenci ve servisçide 8 karakter + harf + rakam);
  - e-posta `EPOSTA_DESENI`, telefon `telefonSorunuTR`;
  - doğum tarihi yarım seçildiyse "Gün, ay ve yılın üçünü de seç ya da hepsini boş bırak.".
  Hata varsa ilkine kaydırır ve `false` döner.
- `hesapTcBagla()` — T.C. kutusu yalnız rakam alır (11'de keser); kullanıcı adı kutusu yazarken küçük harfe döner (`İ` →
  `i`), boşluk nokta olur.
- `bransSecici(secili)` — `select#hfBrans` (`S.meta.subjects`, "— belirtme —"); eşlenmiş öğretmen penceresinde ve kodla
  eklemede.

### Yeni hesap

- `hesapYeniModal(rol)` — rol `HESAP_ROL`'de yoksa ya da `teacher` ise hiçbir şey yapmaz. Öğrencide sınıf listesi henüz
  yoksa önce `GET /api/school/classes` (düşerse boş liste). Sonra `modalAc(r.yeni, …)`: form + `#hesapMesaj`, düğmeler
  "Vazgeç" (`modal-kapat`) ve "Hesabı aç" (`data-act="hesap-ac-kaydet" data-rol`). Odak ad kutusuna.
- `EYLEMLER['hesap-yeni']` — düğmenin `data-rol`'üyle `hesapYeniModal`; hata `hataGoster` (tarayıcı uyarı kutusu).
- `EYLEMLER['hesap-ac-kaydet']` — `hesapGovdesi` + `rol` → `hesapDenetle` → "Açılıyor..." → `POST /api/school/hesap-ac`.
  - Cevapta `hesap.nakil` varsa `nakilSonucu`.
  - Değilse "Hesap açıldı" penceresi: sunucunun iletisi (yeşil); "Kullanıcı adı" + Kopyala; şifre satırı — varsayılan
    şifrede "T.C. kimlik numarası · İlk girişte kendi şifresini belirleyecek.", yazılmış şifrede şifrenin kendisi
    (`.kod-goster`) + Kopyala; `S.user.schoolSlug` varsa "Giriş adresi" (`location.host + okulYolu(…)`, ör.
    `egitimevi.org/school/ornek-okul`); öğrencide "Veli kodu (veli çocuğunu bununla ekler)" (`kisiKoduKutusu`, 4'erli
    tireli, Kopyala); yazılmış şifrede "Bu şifre bir daha gösterilemez; şimdi kişiye ilet.". Düğmeler "Bir tane daha aç"
    (`hesap-yeni`, aynı rol) ve "Tamam" (`hesap-bitti`). Yazılmış şifrede şifre öğesinin kimliği `tekSeferSifre`'dir ve
    `hesapSifresiKorunsun()` çağrılır.
  - Hata: sunucu `nakil: 'dogum'` derse (T.C. başka okulun öğrencisinin, doğum tarihi yok ya da tutmadı) Gün listesinin
    altına "Doğum tarihini seç." ve sunucunun tam iletisi pencerenin altına; başka her hata `hesapHatasi` ile.
- `nakilSonucu(d, rol)` — "Öğrenci okuluna taşındı": sunucunun iletisi, kullanıcı adı + Kopyala, "Önceki okulundaki ödev,
  not ve devamsızlık kayıtları o okulda kalır; sen görmezsin. Öğrenci ve velisi eğitim yılı seçicisinden bakabilir.".
  Şifre gösterilmez (öğrenci kendi şifresiyle girer). Düğmeler "Bir tane daha ekle", "Tamam".
- `hesapSifresiKorunsun()` — yeni şifre ekrandayken çağrılır (hesap açıldı ya da şifre değiştirildi). Pencerenin perdesine
  `data-zorunlu="1"` koyar (dışarı tıklamak kapatmaz) ve `TEK_SEFER.hesapSifre` kaydını bırakır
  ([03-mesaj-modal.md](03-mesaj-modal.md)): `sayfada: true`; `sor()` `#tekSeferSifre` ekrandaysa "Yeni şifre ekranda ve
  bir daha gösterilmeyecek. Kişiye ilettiysen ayrılabilirsin. Ayrılınsın mı?" döner, değilse boş (pencere "Tamam",
  "Kapat" ya da yeni bir pencereyle kapanınca soru kendiliğinden susar); `temizle()` `modalKapat()`.
- `EYLEMLER['hesap-bitti']` — pencereyi kapatır, açık sayfayı yeniden çizer (`git(S.page)`): yeni kişi listede görünür.

### Hesap penceresi (düzenleme)

- `EYLEMLER['hesap-duzenle']` — `hesapDuzenleModal(data-id)`; hata (403 "Bu işlem için yetkin yok", 404 "Hesap
  bulunamadı") `hataGoster`.
- `hesapDuzenleModal(id)` — sınıf listesi (`S._sinifListe`) yoksa önce onu ister — hesabın rolüne bakmadan, yani
  servisçi ya da öğretmen penceresi için de; düşerse boş liste —, sonra `GET /api/school/hesap?id=`. Hesabı
  `S._duzenlenen`'e koyar. `h.bagli` ise `bagliOgretmenModal`. Değilse pencere başlığı "Ad Soyad — Öğrenci" (`ROL_AD`)
  ve sırayla:
  - form (`hesapAlanlari(h.rol, h)`), "Bilgileri kaydet" (`hesap-bilgi-kaydet`), `#hesapMesaj`;
  - **Şifre**: "Şifreler geri döndürülemez biçimde saklanır, görüntülenemez." + (kendi şifresini belirlemediyse) "Bu
    kişi henüz kendi şifresini belirlemedi." + (hiç girmediyse) "Hesaba hiç giriş yapılmadı." + "Unuttuysa yenisini
    belirle."; `input#hfYeniSifre` (düz metin), "Rastgele üret", "Şifreyi değiştir" (kırmızı), işaretli gelen
    `#hfDegistirsin` "İlk girişte kendi şifresini belirlesin", T.C.'si varsa "Şifreyi T.C. no yap", `#hesapSifreMesaj`;
  - öğrencide **Veli kodu**: `kisiKoduKutusu(h.code, 'hVeliKodu', …)` + Kopyala + "Yeni kod üret" (`kod-yenile`) ve
    ipucu ("Veli bu kodu + Ekle > Veli ekranına yazar. Anne ve baba aynı kodu kullanabilir; kod yanlış kişiye
    verildiyse yenile."); **Veliler**: `#hVeliler` ("Yükleniyor..."), "Veli bağla" kutusu `#hVeliAra` + "Bul"
    (`veli-bul`), `#hVeliSonuc` — bu parçayı [10-mudur.md](10-mudur.md)'deki `velileriYukle` ve veli eylemleri doldurur;
  - silme yetkisi varsa (öğretmende `ogretmen.cikar`, servisçide `servis.yonet`) **Hesabı sil** bölümü ve açıklaması
    ("Öğretmenin dersleri öğretmensiz kalır; verdiği ödev ve sınavlar silinmez." / "Servisçinin servis ataması kalkar;
    açık seferi varsa kapanır."). Öğrencide bu bölüm yoktur (öğrenci hesabı okulca silinmez).
  Pencere açılınca `hesapTcBagla()`; öğrencide `velileriYukle(h.id)`.
- `EYLEMLER['hesap-bilgi-kaydet']` — `S._duzenlenen` bu kişi değilse hiçbir şey yapmaz. `hesapDenetle(g, false, h)`;
  sonra her alanı eski değerle (`adBol(h.fullName)`, `h.tc`, `h.username`, `h.email`…) metin olarak karşılaştırır, yalnız
  değişenleri gövdeye koyar; ad ya da soyaddan biri değiştiyse ikisi birlikte gider (sunucu ikisini birleştirir). Hiçbir
  şey değişmediyse "Değişiklik yok.". `POST /api/school/hesap-guncelle { id, …değişenler }` → `S._duzenlenen` yenilenir,
  "Bilgiler kaydedildi."; açık sayfa bu rolün listesiyse arkada yeniden çizilir (pencere açık kalır). Hata `hesapHatasi`.
- `bagliOgretmenModal(h)` — "Ad Soyad — Öğretmen": "Bu öğretmen kendi Eğitim Evi hesabıyla bağlı. Adını, e-postasını ve
  şifresini kendisi yönetir; T.C. kimlik numarası okulla paylaşılmaz."; okuldaki kullanıcı adı; branş seçici ve "Branşı
  kaydet" (`bagli-brans-kaydet`); `ogretmen.cikar` varsa "Okuldan çıkar" (`hesap-sil`, `data-bagli="1"`; "Öğretmenin bu
  okuldaki rolü kalkar; hesabı kendisinde kalır.").
- `EYLEMLER['bagli-brans-kaydet']` — branş değişmediyse "Değişiklik yok."; değilse `POST /api/school/hesap-guncelle
  { id, brans }` → "Branş kaydedildi.", Öğretmenler sayfasındaysan liste yenilenir.

### Şifre

- `EYLEMLER['hesap-sifre-uret']` — `crypto.getRandomValues` ile 10 karakter: 8 harf (karışan `I`, `O`, `l` yok) + 2 rakam
  (`0`, `1` yok); `#hfYeniSifre`'ye yazar. Sunucuya bir şey göndermez.
- `EYLEMLER['hesap-sifre-kaydet']` — kutu boşsa "Yeni şifreyi yaz ya da üret."; `sifreSorunuTR` (düzenlenen hesabın rolüne
  göre güçlü ya da basit kural); onay "Şifre değiştirilsin mi? Kişinin açık oturumları kapanacak." → `hesapSifreGonder`.
- `EYLEMLER['hesap-sifre-tc']` — onay "Şifre T.C. kimlik numarası olsun mu? …" → `hesapSifreGonder(el, id, '')`.
- `hesapSifreGonder(el, id, sifre)` — `POST /api/school/hesap-sifre { id, password, degistirsin }` (`degistirsin`
  kutudan; kutu yoksa `true`). Başarıda kutu boşalır. T.C.'ye dönüşte sunucunun iletisi yeşil (6 saniyede kalkar). Şifre
  yazıldıysa ileti + " Yeni şifre: <şifre>" `bilgi` türüyle (kendiliğinden silinmez); iletinin kimliği `tekSeferSifre`
  olur ve `hesapSifresiKorunsun()` çağrılır. Sunucu kişinin bütün oturumlarını kapatır, hesap kilidini kaldırır ve kişiye "Şifren okul yönetimi tarafından
  değiştirildi." bildirimi gönderir.

### Silme ve veli kodu

- `EYLEMLER['hesap-sil']` — onay: eşlenmiş öğretmende "X okuldan çıkarılsın mı?", öbürlerinde "X hesabı silinsin mi?
  Bu işlem geri alınamaz." → `POST /api/school/hesap-sil { id, onay: true }` → pencere kapanır, sayfa yeniden çizilir,
  üstte sunucunun iletisi (`sayfaMesaji`). Hata `hataGoster`.
- `EYLEMLER['kod-yenile']` — onay "Yeni veli kodu üretilsin mi? Eski kod çalışmaz olur; bağlı veliler bağlı kalır." →
  "Üretiliyor..." → `POST /api/school/student-code-reset { studentId }` → kutudaki kod ve Kopyala'nın taşıdığı kod yerinde
  değişir (`kisiKoduYenile('hVeliKodu', …)`), `S._duzenlenen.code` güncellenir.

### Öğretmeni kişi koduyla ekle

- `EYLEMLER['ogretmen-kodla']` — "Öğretmen ekle" penceresi: kişi kodu çizimi (`cizim('kisi-kodu', …)`), açıklama
  ("Öğretmenden kişi kodunu iste. Kodu Eğitim Evi'nde + Ekle > Öğretmen ekranında görür. Kod bir kez kullanılır."),
  `kisiKoduGirdisi('okKod')` (tireler yazarken kendiliğinden gelir, en çok 19 karakter), "Bul", ipucu "Büyük/küçük harfe
  dikkat et; tireler kendiliğinden gelir.", `#okSonuc`. Kutuda Enter "Bul" gibi çalışır.
- `EYLEMLER['ogretmen-kod-bul']` — `kisiKoduDenetle` ("Kişi kodunu yaz." / "Kişi kodu 16 karakterdir.") → kod tiresiz,
  boşluksuz (`kisiKoduSade`) → "Aranıyor..." → `POST /api/school/ogretmen-bul { kod }`. Kişi zaten okuldaysa "<maskeli ad>
  okulunda zaten var."; değilse "Bu kodun sahibi <maskeli ad> · Adın bir kısmı gizli. Öğretmenin adıyla uyuşuyorsa ekle.",
  branş seçici, "Okula ekle" (`data-act="ogretmen-kod-ekle" data-kod="<kod>"`) ve `#okMesaj`. Hata (404 "Bu kodla bir
  hesap bulunamadı…", 429) kod kutusunun altına.
- `EYLEMLER['ogretmen-kod-ekle']` — `POST /api/school/ogretmen-ekle { kod, brans }` → pencere kapanır, Öğretmenler
  sayfası açılır ve üstte "<ad> okula öğretmen olarak eklendi.". Sunucu `alan: 'kod'` ile dönerse (kişi bu arada okula
  eklendi, kullanıcı adı çakıştı) ileti kod kutusunun altına; öbür hatalar (ör. 404 "Bu kod az önce kullanıldı…")
  `#okMesaj`'a.

### Başka dosyalarda ele alınan düğmeler

`kod-kopyala` (panoya kopyalama) ve `modal-kapat` → `25-tiklama.js`; `veli-bul` (ve onun ürettiği `veli-bagla`,
`veli-coz`) → [10-mudur.md](10-mudur.md).

## Kimle konuşur?

- Çağırdıkları (hepsi aynı IIFE'de):
  - `S`, `$`, `esc`, `api`, `EYLEMLER` ([00-durum.md](00-durum.md), [01-yardimcilar.md](01-yardimcilar.md)); `ROL_AD`
    ([02-ikonlar.md](02-ikonlar.md)); `cizim` ([02b-cizimler.md](02b-cizimler.md));
  - `modalAc`, `modalKapat`, `mesajGoster`, `sayfaMesaji`, `TEK_SEFER` ([03-mesaj-modal.md](03-mesaj-modal.md));
  - `alanHatasi`, `alanTemizle`, `formHatalariniSil`, `ilkHatayaGit`, `tarihSecici`, `tarihSeciciDurum`
    ([04a-form-alanlari.md](04a-form-alanlari.md));
  - `telefonOku`, `telefonSorunuTR` ([04c-telefon.md](04c-telefon.md));
  - `tcSorunuTR`, `kullaniciAdiSorunuTR`, `sifreSorunuTR`, `gucluSifreli`, `EPOSTA_DESENI`, `dugmeBekle`, `dugmeBitir`,
    `kisiKoduKutusu`, `kisiKoduYenile`, `kisiKoduGirdisi`, `kisiKoduDenetle`, `kisiKoduSade` ([05-giris.md](05-giris.md));
  - `okulYolu` ([05a-dis-sayfalar.md](05a-dis-sayfalar.md)); `git` ([07-yonlendirme.md](07-yonlendirme.md));
  - `velileriYukle` ([10-mudur.md](10-mudur.md)); `yetkim` (`21-ders-programi.js`); `hataGoster` (`25-tiklama.js`);
  - `S.meta.subjects` — girişte `GET /api/meta` ile gelir ([05-giris.md](05-giris.md); sunucuda
    [../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md)).
- Sunucu uçları:
  - [../../../sunucu/bolumler/hesaplar.md](../../../sunucu/bolumler/hesaplar.md): `POST /api/school/hesap-ac`
    (öğrencide `ogrenci.hesap-ac`, servisçide `servis.yonet`; kişi başına saatte 120), `GET /api/school/hesap?id=`
    (rolün `duzenle` yetkisi; T.C. dahil görünüm), `POST /api/school/hesap-guncelle` (aynı yetki; eşlenmiş öğretmende
    yalnız `brans`/`rolId`), `POST /api/school/hesap-sifre` (öğrencide `ogrenci.sifre`, öğretmende `ogretmen.duzenle`,
    servisçide `servis.yonet`), `POST /api/school/hesap-sil` (öğretmende `ogretmen.cikar`, servisçide `servis.yonet`),
    `POST /api/school/ogretmen-bul` ve `ogretmen-ekle` (`ogretmen.onayla`; kişi başına dakikada 30, IP başına saatte 30
    yanlış kod). Doğrulama hatası `400 { error: <bütün sorunlar '; ' ile>, alan: <ilk sorunun alanı> }`.
  - Nakil yolu `hesap-ac`'ın içinde [../../../sunucu/bolumler/nakil.md](../../../sunucu/bolumler/nakil.md)'ye gider:
    doğum tarihi yoksa ya da tutmazsa `409 { nakil: 'dogum', error }`, çok yanlış denemede 429, T.C. ya da okul no bu
    okulda başkasındaysa `400 { alan }` (form bunu `hesapHatasi` ile kutunun altına yazar), tutarsa
    `{ hesap: { …, nakil: true }, message }`.
  - [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md): `GET /api/school/classes` (`sinif.yonet`),
    `POST /api/school/student-code-reset { studentId }` (`ogrenci.duzenle`; işlem kaydı yazmaz).
- Onu kullananlar:
  - [10-mudur.md](10-mudur.md) — Öğrenciler sayfasında "Öğrenci ekle" (`hesap-yeni`, `data-rol="student"`) ve "Hesap"
    (`hesap-duzenle`); Öğretmenler sayfasında "Kodla ekle" (`ogretmen-kodla`) ve "Hesap". O sayfa `S._sinifListe`'yi
    doldurur, bu dosya kullanır; `velileriYukle` ve veli eylemleri öğrencinin penceresinde çalışır.
  - `19c-okul-hayati.js` — Servisler sayfasında "Servisçi ekle" (`hesap-yeni`, `data-rol="servisci"`) ve her servisçinin
    "Hesap" düğmesi.
  - `25-tiklama.js` — `EYLEMLER` ile bütün düğmeleri çağırır; `hataGoster`.
  - `26-baslat.js` — `oturumDurumunuSifirla` çıkışta ve rol değişince `S._sinifListe` ve `S._duzenlenen`'i sıfırlar
    (başka okuldaki rolün sınıf listesi karışmasın).
  - [10a-giris-bilgisi.md](10a-giris-bilgisi.md) de `S._sinifListe`'yi okur (aynı önbellek).
  - Bu dosyadaki işlevleri başka parça doğrudan çağırmıyor; dışarıdan girişin tamamı düğmelerdir.
- Görünüm (CSS parçaları, `public/css/parcalar/`): `02-form.css` (`.field`, `.row2`, `.hint`, `.btn` ve `gri`/`ghost`/
  `kucuk`/`tehlike`, `.msg`, `.tarih-secici`, `.hatali`), `07-mobil.css` (telefonda `.row2` tek sütun, `.kod-goster`),
  `04-kartlar.css` (`.satir`, `.buyu`, `.ad`, `.alt`), `13-tipografi.css` (`.kod-goster`), `27-harita-ortak.css`
  (`.ayrac-cizgi`, `.modal .alt-baslik`, `.sifre-satir`, `.onay-satiri`), `09-kayit-ekrani.css` (`.rolsuz-satir`,
  `.okul-bilgi`), `28-yetiskin-hesap.css` (`.ekle-panel`, `.ekle-panel-cizim`, `.cizim`, `.kisi-kodu-satir`,
  `.kisi-kodu-girdi`), `06-modal.css` (pencere).
- Rol: müdür; ilgili yetkisi olan öğretmen. Öğrenci, veli, servisçi ve rolsüz yetişkin bu pencereleri görmez.

## Nasıl çalışır (adım adım)?

### Öğrenci ekleme

```
"Öğrenci ekle" ─► hesap-yeni ─► hesapYeniModal('student')
     S._sinifListe yok mu? ─► GET /school/classes (düşerse [])
     modalAc("Yeni öğrenci hesabı", form) ─► hesapTcBagla
"Hesabı aç" ─► hesap-ac-kaydet ─► hesapGovdesi + rol ─► hesapDenetle (hata ─► kutunun altı, dur)
     POST /school/hesap-ac
       ├ { hesap } ──────────────► "Hesap açıldı": kullanıcı adı · şifre (bir kez) · giriş adresi · veli kodu
       │                            (şifre yazıldıysa hesapSifresiKorunsun: perde zorunlu + TEK_SEFER.hesapSifre)
       ├ { hesap: { nakil } } ───► nakilSonucu: "Öğrenci okuluna taşındı"
       ├ 409 { nakil: 'dogum' } ─► Gün kutusu: "Doğum tarihini seç." + tam ileti altta
       └ 400 { error, alan } ────► hesapHatasi: alanın kutusu ya da pencerenin altı
"Tamam" ─► hesap-bitti ─► modalKapat + git(S.page)   (şifre öğesi gidince soru susar)
geri tuşu / menü / Çıkış ─► "Yeni şifre ekranda … Ayrılınsın mı?" ─► İptal: pencere yerinde
```

### Hesap penceresi

```
"Hesap" ─► hesap-duzenle ─► (sınıf listesi) ─► GET /school/hesap?id= ─► S._duzenlenen
     bagli? ─► bagliOgretmenModal (yalnız branş + okuldan çıkar)
     değilse ─► form + Şifre + (öğrenci: Veli kodu, Veliler) + (yetki: Hesabı sil)
"Bilgileri kaydet" ─► hesapDenetle ─► değişenleri ayıkla ─► POST /school/hesap-guncelle
                                    ─► "Bilgiler kaydedildi." + arkadaki liste git(S.page) ile tazelenir
"Rastgele üret" ─► kutuya 10 karakter │ "Şifreyi değiştir" ─► onay ─► POST /school/hesap-sifre
"Yeni kod üret" ─► onay ─► POST /school/student-code-reset ─► kod yerinde değişir
"Hesabı sil"    ─► onay ─► POST /school/hesap-sil { onay: true } ─► pencere kapanır, liste tazelenir
```

### Öğretmeni kodla ekleme

```
öğretmen: + Ekle > Öğretmen ─► kişi kodunu müdüre verir (ör. Ab3#-kQx9-+mPt-7?zR)
müdür: "Kodla ekle" ─► kodu yaz ─► "Bul" ─► POST /school/ogretmen-bul { kod }  (kod gövdede, adreste değil)
       ─► "Ay** Ka**" + branş ─► "Okula ekle" ─► POST /school/ogretmen-ekle { kod, brans }
       ─► Öğretmenler sayfası + "… okula öğretmen olarak eklendi."   (kod harcanır, öğretmene bildirim)
```

## Dikkat!

- **Sınıf listesini göremeyen biri öğrenci kaydederken sınıfı bozabilir.** Sınıf seçicinin listesi
  `GET /api/school/classes`'tan gelir ve bu uç `sinif.yonet` ister; göremeyen kişide (ör. yalnız `ogrenci.duzenle`
  verilmiş bir rol) liste boş kalır (`S._sinifListe = []`). O kişi sınıfı olan bir öğrencinin penceresini açınca seçicide
  öğrencinin sınıfı yoktur, "— sınıfsız —" seçili görünür. "Bilgileri kaydet" başka bir alan için basılsa bile değişen
  alan karşılaştırmasında `classId` boş ≠ eski sınıf çıkar ve `classId: ''` gönderilir: kişinin `ogrenci.yerlestir`
  yetkisi varsa öğrenci **sessizce sınıfından çıkarılır**, yoksa her kayıt "Öğrenciyi bu sınıfa yerleştirme yetkin yok"
  hatasıyla reddedilir. Aynı sebeple yeni öğrenci eklerken de sınıf seçilemez. Kod okumasına göre; tarayıcıda
  denenmedi, kod değiştirilmedi. Düzeltme önerisi: sınıf listesi gelmediyse `classId`'yi gövdeye hiç koymamak ya da
  hesabın kendi sınıfını (`h.classId`, `h.className`) seçenek olarak eklemek.
- **"Rastgele üret" eski usul öğretmen hesabında işe yaramaz.** Üretilen şifrede özel karakter yok; öğretmen hesabı güçlü
  şifre kuralına tabi (`gucluSifreli`), "Şifreyi değiştir" her seferinde "Şifrede bir özel karakter (! ? . * gibi)
  olmalı." der. Öğrenci ve servisçide sorun yok. Kendi hesabıyla eşlenmiş öğretmende şifre bölümü zaten yok; sorun
  yalnız eski düzende okulun açtığı öğretmen hesaplarında (kod okumasına göre).
- **Nakilde "Doğum tarihini seç." yanıltabilir.** Tarih seçilmiş ama tutmamışsa da Gün kutusunun altına aynı yazı çıkar;
  asıl neden ("T.C. kimlik no ile doğum tarihi eşleşmedi…") pencerenin altındaki iletidedir. Nakilde formdaki ad,
  kullanıcı adı, şifre, e-posta, telefon, adres ve yönetim notu KULLANILMAZ: var olan hesap kendi bilgileriyle gelir,
  formdan yalnız okul no alınır, yönetim notu sıfırlanır
  ([../../../sunucu/bolumler/nakil.md](../../../sunucu/bolumler/nakil.md)). Yanlış doğum tarihi denemeleri sunucuda
  kişi başına saatte 10 ile sınırlıdır.
- **Nakilde seçilen sınıf yok sayılıyor (sunucudaki bir ad uyuşmazlığı).** Form sınıfı `classId` diye gönderir;
  `sunucu/bolumler/hesaplar.js`'in `govdedenAlanlar`'ı onu `sinifId` adıyla alır ve `hesap-ac` nakle bu nesneyi verir,
  ama `nakil.js`'in `nakilEt`'i `g.classId`'yi okur (hep boş). Sonuç: başka okuldan taşınan öğrenci, pencerede hangi
  sınıf seçilmiş olursa olsun okula **sınıfsız** gelir; sınıfı sonradan Hesap penceresinden ya da Sınıflar sayfasından
  verilmelidir. `nakil.js`'teki "Sınıf bulunamadı" denetimi de bu yüzden hiç çalışmaz. `testler/test-nakil.js` nakilde
  sınıf göndermediği için yakalamıyor; [../../../sunucu/bolumler/nakil.md](../../../sunucu/bolumler/nakil.md) de
  sınıfın alındığını yazıyor. Kod okumasına göre; kod değiştirilmedi. Düzeltme önerisi: `nakilEt` `g.sinifId`'yi okusun
  ve teste sınıflı bir nakil eklensin.
- **Birden çok sunucu sorunu tek kutuda.** Sunucu bütün sorunları "; " ile birleştirip yalnız ilkinin alanını söyler;
  `hesapHatasi` bütün metni o ilk kutunun altına yazar.
- **Şifre bir kez görünür.** "Hesap açıldı" penceresindeki şifre sunucudan değil, formdaki kutudan gelir; sunucu yalnız
  özetini saklar. Pencere kapanınca bir daha gösterilemez; unutulursa Hesap penceresinden yenisi verilir. "Şifreyi
  değiştir"in iletisi de yeni şifreyi ekranda bırakır (bilerek: müdür kişiye iletecek). `commit 543`'ten beri ikisinde de
  pencere dışına tıklamak kapatmaz, geri tuşu/menü/çıkış/sekmeyi kapatma önce sorar; "Şifreyi değiştir" iletisi artık
  `bilgi` türünde (önceden yeşildi ve 6 saniyede şifreyle birlikte siliniyordu).
- **Yalnız değişen alanlar gider.** Düzenlemede gövdeye yalnız eskisinden farklı olan alanlar konur; sunucu gövdede
  olmayan alana dokunmaz. Ad ile soyad birlikte gider çünkü sunucu ikisini birleştirir. `adBol` son kelimeyi soyad sayar:
  iki kelimelik soyadı olan birinde pencere soyadın ilk kelimesini ad kutusunda gösterir; değiştirilmeden kaydedilirse
  ad aynen kalır.
- **T.C. yalnız hesabı yönetende.** `GET /api/school/hesap` T.C.'yi döner (formu doldurmak için); bu uç hesabı düzenleme
  yetkisi ister, yani müdür ve o yetkiyi almış öğretmen (ör. müdür yardımcısı) görür, sıradan öğretmen ve öğrenciler
  görmez (formdaki "Yalnızca okul yönetimi görür" ipucu bunu kasteder). Eşlenmiş öğretmenin T.C.'si okulla hiç
  paylaşılmaz.
- **Kendi açtığı hesabın e-postası kilitli.** Kişi hesabını kendisi açtıysa e-posta onun şifre kurtarma yoludur; okul
  değiştirebilseydi hesabı ele geçirebilirdi. Kutu `disabled` gelir ve gövdeye hiç konmaz.
- **Kişi kodu adrese yazılmaz.** Kod POST gövdesinde gider: adres satırına, tarayıcı geçmişine ve erişim günlüklerine
  düşmesin, içindeki `# + ? =` bozulmasın. Kod büyük/küçük harf duyarlıdır; boşluk ve tireler silinir. Sunucu tam adı
  değil maskeli adı gösterir (kodla ad öğrenme aracına dönmesin); müdür adı öğretmenle yüz yüze doğrular.
- **"Okula ekle" "Bul"daki kodu kullanır.** Kod `data-kod`'a "Bul" anında yazılır; sonra kutudaki kod değiştirilse de
  "Okula ekle" eski kodu gönderir. Zararsız ama yeni kod için yeniden "Bul"a basmak gerekir.
- **Pencere açıkken liste yenilenir.** "Bilgileri kaydet" ve "Branşı kaydet" başarıda `git(S.page)` çağırır; `git`
  pencereyi kapatmaz ama sayfanın başına kaydırır ve arama kutusunu boşaltır.
- **`S._duzenlenen` koruması.** "Bilgileri kaydet" ve "Branşı kaydet" düğmenin kimliği `S._duzenlenen` ile uyuşmazsa
  sessizce hiçbir şey yapmaz (başka bir pencere araya girdiyse).
- **Yaş aralığı.** Doğum yılı listesi yetişkinde (öğretmen, servisçi) 17, öğrencide 3 yıl öncesinden başlar. Bu bir kural
  değil, seçicinin aralığı; kullanıcı "yaş şeyi olmasın" dedi, bu satırın kalıp kalmayacağı kendisine soruldu.
- **Onaylar tarayıcı kutusuyla.** Şifre değiştirme, T.C.'ye döndürme, silme ve veli kodu yenileme `confirm` ile sorulur;
  bazı hatalar `hataGoster` ile `alert` olarak çıkar.
- **HTML güvenliği:** bütün adlar, kullanıcı adları, kodlar ve sunucu iletileri `esc`'ten geçer.

## Testleri

- `testler/buton-denetimi.js` (sunucusuz) — bu dosyanın ürettiği ve kaydettiği eylemlerin (`hesap-ac-kaydet`,
  `hesap-bitti`, `hesap-bilgi-kaydet`, `hesap-sifre-uret`, `hesap-sifre-kaydet`, `hesap-sifre-tc`, `hesap-sil`,
  `kod-yenile`, `bagli-brans-kaydet`, `ogretmen-kod-bul`, `ogretmen-kod-ekle`, …) karşılığının olduğunu denetler;
  `testler/yazim-denetimi.js` Türkçe metinleri tarar.
- Ön yüzün kendisini tarayıcıda çalıştıran bir test yok; sunucu tarafı şu paketlerde:
  - `testler/test-yonetim.js` — zorunlu alanlar, boş kullanıcı adı/şifrenin T.C. olması ve ilk girişte şifre zorunluluğu,
    `hesap?id=` görünümü, `hesap-sifre` ile T.C.'ye dönüş, `student-code-reset`, okulun öğretmen hesabı açamaması,
    kodla eklenen öğretmende yalnız branş, servisçi hesabı, `hesap-sil` (onaysız ve öğrenci reddi), başka okulun hesabı.
  - `testler/test-yetiskin.js`, `testler/test-kisi-kodu.js` — `ogretmen-bul`/`ogretmen-ekle` (maskeli ad, tek kullanımlık
    kod, tireli/boşluklu yazım, eski GET yolunun kapalı olması), eşlenmiş öğretmenin adının/şifresinin okulca
    değiştirilememesi, okuldan çıkarma.
  - `testler/test-nakil.js` — başka okulun öğrencisinin T.C.'siyle `hesap-ac` (doğum tarihi yok / yanlış / doğru).
  - `testler/test-cakisma.js` — aynı T.C./kullanıcı adının yarışla bile çift olmaması, aynı kodla eş zamanlı iki
    `ogretmen-ekle`.
  - `testler/test-giris-kayit.js` (müdürün `rol: 'teacher'` ve `rol: 'principal'` diye hesap açmak istemesinin reddi,
    T.C.'yi yönetimin görmesi),
    `testler/test-etut.js` (`hesap-guncelle` ile rol verme yetkisi), `testler/yetki-denetimi.js` (rol × uç).
- Ekran turu (`araclar/gezinti.js`; ÇALIŞTIRMA, yalnız bilgi): "Öğretmeni kodla ekleme penceresi", "Yeni öğrenci hesabı
  penceresi", "Öğrenci ekle — başka okulda kayıtlı T.C.: doğum tarihi isteniyor (nakil)", "Öğrenci hesabını düzenleme
  penceresi" adımları bu pencerelerin resmini çeker.
- Elle (3200, `testler/seed.js`'teki müdür): Öğrenciler → "Öğrenci ekle" → yalnız ad, soyad ve geçerli bir T.C. yaz →
  "Hesap açıldı"da şifre satırı "T.C. kimlik numarası" olmalı. Aynı öğrencinin "Hesap"ında okul numarasını değiştir →
  "Bilgiler kaydedildi."; "Rastgele üret" → "Şifreyi değiştir" → iletide yeni şifre, 6 saniyeden sonra da durmalı; geri
  tuşu ya da Çıkış → "Yeni şifre ekranda …" sorusu (2026-09-30'da denendi; yazılmış şifreyle "Hesap açıldı"da da).
  Öğretmenler → "Kodla ekle" → bir öğretmenin + Ekle > Öğretmen ekranındaki kodu yaz → maskeli ad → "Okula ekle".

## Son durum

- `git log`: 11 commit. Dosya `9f4b104 commit 67` (2026-08-29) ile doğdu.
- Son değişiklik `commit 543` (2026-09-30): `hesapSifresiKorunsun` eklendi; "Hesap açıldı"daki yazılmış şifre ve "Şifreyi
  değiştir"den sonraki yeni şifre ekrandayken perde zorunlu, geri tuşu/menü/çıkış/sekmeyi kapatma önce sorar
  (`TEK_SEFER.hesapSifre`); yeni şifre iletisi yeşilden `bilgi`'ye geçti (6 saniyede siliniyordu).
- Ondan önce `153d63d commit 522` (2026-09-27, kişi kodu 16 hane): yalnız metin — kod bölümünün yorumu ("içindeki
  `# + ? =` bozulmasın. Girişte boşluklar ve tireler silinir.") ve kod kutusunun ipucu "boşluklar önemli değil" yerine
  "tireler kendiliğinden gelir".
- Ondan önce `276c0a0 commit 521` (2026-09-27, çakışmalar): `HESAP_HATA_ALANI` ve `hesapHatasi` eklendi — sunucunun
  döndürdüğü `alan` artık ilgili kutunun altına yazılıyor (önceden hep pencerenin altına); `hesap-ac-kaydet`'in nakil
  dalı ayrıldı; `ogretmen-kod-ekle` `alan: 'kod'` hatasını kod kutusunun altına yazıyor; `hesap-bilgi-kaydet` de
  `hesapHatasi` kullanıyor.
- `0acca75 commit 516` (2026-09-27, kayıt/kişi kodu/portallar): veli kodu `kisiKoduKutusu` ile (Kopyala + "Yeni kod
  üret" yan yana, veli kodu ipucu), giriş adresi `okulYolu` ile (`/school/<kısa ad>`), "Yeni kod üret" kodu pencerede
  yerinde değiştiriyor; öğretmen ekleme 10 karakterlik "kişisel kod"dan (`XXXXX-XXXXX`, büyük harfe çevrilerek) 16
  karakterlik, harf duyarlı kişi koduna geçti (`kisiKoduGirdisi`, `kisiKoduDenetle`, `kisiKoduSade`) ve kod adresten
  (GET) gövdeye (POST) taşındı.
- Daha eskiler: `0bd6ff3 commit 349` ve `56869a9 commit 348` (2026-09-26) ortak form (`hesapAlanlari`, `hesapGovdesi`),
  yeni hesap ve düzenleme pencereleri; `4494d29 commit 175` (2026-09-08) `hesapDenetle`; `0b56603 commit 70`
  (2026-08-29) `kod-yenile`.
- Bilinen açıklar (kod değiştirilmedi): sınıf listesini göremeyenin kaydıyla öğrencinin sınıfının boşalması, "Rastgele
  üret"in eski usul öğretmen hesabında reddedilmesi, nakildeki yanıltıcı "Doğum tarihini seç.", nakilde seçilen sınıfın
  sunucuda yok sayılması (Dikkat).
- Planlı işlerden bu dosyaya dokunacaklar: "Çalışan olarak ekleme" (iş 2: "Öğretmenler → Kodla ekle" "Çalışanlar → Kodla
  ekle" olur, kişi rolsüz çalışan eklenir, rolü sonra müdür verir; bu dosyadaki kodla ekleme penceresi ve eşlenmiş
  öğretmen penceresi değişecek); "Güvenlik denetimi" (iş 3: okulun verdiği HER şifre ilk girişte değişecek — "İlk girişte
  kendi şifresini belirlesin" kutusu anlamını yitirir); "Tek kişi tek hesap + portallar öğrencide de" (iş 19: T.C. +
  doğum tarihi eşleşince yeni rol satırı açılacak, bugünkü nakil sonucu ve "Öğrenciler → Kodla ekle" önerisi);
  "Başarılarım" (iş 16: öğrenciye belge ekleme yetkili/müdür tarafında); "Kullanıcı arama + hesap penceresi" (iş 6,
  yönetici/destek tarafı); "Özel roller" (iş 24: yeni hazır şablonlar, ör. Okul Sekreteri — yukarıdaki sınıf listesi
  sorunu bu tür rollerde belirginleşir); "Çok dil" (iş 22: bütün metinler katalogdan).
