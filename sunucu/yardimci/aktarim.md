# sunucu/yardimci/aktarim.js

Excel ile içe ve dışa aktarımın TABLO kısmı: hangi başlık hangi alana karşılık gelir, hücredeki gün ve saat ne anlama gelir,
biçim hatası var mı; ayrıca boş şablon ve dışa aktarım dosyası üretir. Veritabanına bakmaz.

## Bu dosya ne yapar?

Müdür ders programını Excel'den yüklerken sütunların sırasını değiştirebilir, "Sınıf" yerine "Şube", "Başlangıç" yerine "Saat"
yazabilir, günü "Pzt" ya da "1" diye, saati "9.20" ya da Excel saat hücresi olarak girebilir. Bu dosya bunların hepsini tanır ve
her satırı anahtarlı bir nesneye çevirir; satır numaralı biçim hatalarını toplar.

"Sınıf gerçekten var mı, ders o sınıfta tanımlı mı, öğretmen aynı saatte başka yerde mi" gibi veritabanına bakan denetimler
çağıranın işidir ([../bolumler/okul.md](../bolumler/okul.md)). Dosya başındaki yorum bunun için "server.js tarafında" diyor; bugün o
denetimler `sunucu/bolumler/okul.js`'tedir (yorum eski kalmış).

Ayrıca her dışa aktarım (öğrenci, öğretmen, ders programı listeleri, toplu şifre dağıtımındaki "Giriş bilgileri") ve ders programının
boş şablonu buradan, [xlsx.md](xlsx.md) `yaz` ile üretilir.

## İçinde neler var?

### `SUTUNLAR`

Aktarım türüne göre sütun tanımları: `{ anahtar, baslik, genislik, zorunlu?, esler }`. `esler`, kullanıcının yazabileceği
başlıkların `anahtarla`'nmış hâlleridir.

- **`program`** (bugün kullanılan): `sinif` "Sınıf" (zorunlu; sinif, sube, sinifsube), `gun` "Gün" (zorunlu; gun, gunu, hangigun),
  `baslangic` "Başlangıç" (zorunlu; baslangic, baslangicsaati, baslama, baslar, saat), `bitis` "Bitiş" (zorunlu; bitis,
  bitissaati, biter), `ders` "Ders" (zorunlu; ders, dersadi, dersin, brans), `ogretmen` "Öğretmen" (isteğe bağlı; ogretmen,
  ogretmeni, ogretmenadi, dersogretmeni).
- **`ogrenci`** (ESKİ): Ad Soyad, Kullanıcı adı, E-posta, Şifre, Sınıf, Müdür notu. Öğrenci aktarımı artık
  [../bolumler/kisi-aktarim.md](../bolumler/kisi-aktarim.md)'de kendi biçimiyle (ad, soyad, T.C.) yapılıyor; `okul.js` `tur=ogrenci`
  için şablon vermez ve yüklemeyi "Öğrenci listesini "Kişi listesi" bölümünden yükle." diye reddeder. Bu tanım ve aşağıdaki
  `ANLATIM.ogrenci` metni bugün hiçbir yoldan kullanılmıyor.

### `GUNLER`

`['', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']` — 1 Pazartesi … 7 Pazar. Dışa aktarımda gün
numarasını ada çevirmek ve hata mesajlarında kullanılır.

### `anahtarla(s)`

Başlık ve ad eşlemesi için: Türkçe harfler (`İ I ı Ş ş Ğ ğ Ü ü Ö ö Ç ç`) düz harfe, küçük harf, `a-z0-9` dışı her şey silinir.
`'Başlangıç Saati'` → `'baslangicsaati'`, `'9-A'` → `'9a'`. Kişi aktarımı ve okul bölümü sınıf, ders ve servis adlarını
karşılaştırırken de bunu kullanır.

### `saate(v)` → `'SS:DD'`, `''` ya da çözülemeyen metin

- Excel saat hücresi (gün kesri, `0` ile `1` arası): `'0.3888'` → `'09:20'` (dakikaya yuvarlanır).
- `'9:20'`, `'9.20'`, `'9,20'`, `'9 20'`, `'920'`, `'0920'` → `'09:20'`.
- Saat biçiminde ama geçersiz (`'25:00'`, `'99:99'`) → `''`.
- Boş → `''`. Başka her şey olduğu gibi döner (hatayı çağıran bildirir: `coz` `SS:DD` değilse "Başlangıç saati anlaşılmadı").

### `gune(v)` → 1–7 ya da 0

Sırasıyla: `'1'`…`'7'` sayısı; tam gün adı (Türkçe harfli ya da harfsiz, büyük/küçük fark etmez — "Pazar" "Pazartesi"nin baş kısmı
olduğu için önce tam ad aranır); kısaltmalar `pzt`, `pts` (Pazartesi), `sal`, `car`, `crs`, `per`, `prs`, `cum`, `cmt`, `cts`,
`paz`, `pzr` (Pazar); en son en az 3 harfli ve TEK güne uyan baş kısmı (`'pazart'` → 1, `'çarş'` → 3). Tanınmazsa 0. `'01'` gibi
başında sıfır olan sayı tanınmaz.

### `coz(tur, sayfalar)` → `{ kayitlar, hatalar, sutunlar }`

- `sayfalar`: [tablo-oku.md](tablo-oku.md) çıktısı. Bilinmeyen tür → `Error('Bilinmeyen aktarım türü.')`.
- Veri sayfası: İLK SATIRI zorunlu sütunların hepsini içeren ilk sayfa (şablondaki "Nasıl doldurulur" sayfası böylece atlanır).
  Yoksa `Error('Başlık satırı bulunamadı. İlk satırda şu sütunlar olmalı: Sınıf, Gün, Başlangıç, Bitiş, Ders. Boş şablonu indirip
  onun üzerine yazman en kolayı.')`.
- Başlık eşleme: her başlık hücresi `anahtarla`'nır ve `esler` listesinde aranır; her alan İLK eşleşen sütuna bağlanır; fazladan
  sütunlar yok sayılır.
- Her veri satırı için: `{ satir: Excel satır numarası (başlık 1), <anahtar>: kırpılmış metin, … }`. Tamamen boş satır sessizce
  atlanır. Zorunlu alan boşsa hata `"Ders ve Bitiş boş"` biçiminde. `program` türünde ayrıca: gün `gune` ile (`gunNo` eklenir;
  tanınmazsa `'"Pazartesii" bir gün adı değil'`), başlangıç ve bitiş `saate` ile `SS:DD`'ye çevrilir.
- Hatalı satır `kayitlar`'a girmez, `hatalar`'a `{ satir, mesaj }` olarak girer; öteki satırlar işlenir.

### `sablon(tur)` → .xlsx `Buffer`

İki sayfa: veri sayfası (`Ders programı` / `Öğrenciler`; yalnız başlık satırı, sütun genişlikleri) ve `Nasıl doldurulur` (düz,
açıklama metni `ANLATIM[tur]`: sütunların anlamı, örnek, "saat hücresini Excel'de saat olarak biçimlendirirsen de çalışır",
"sütunların sırasını değiştirebilirsin", "yükleme iki adımlı", "aynı öğretmeni ya da sınıfı aynı saate koyan satırlar için uyarı
alırsın", "var olan programın üzerine ekler"). Bilinmeyen tür → `Error('Bilinmeyen şablon türü.')`.

### `disa(sayfaAdi, basliklar, satirlar, genislikler?)` → .xlsx `Buffer`

Tek sayfalık dışa aktarım (başlık dondurulmuş, süzme oklu). Genişlik verilmezse her sütun 20.

## Kimle konuşur?

- Çağırdığı: [xlsx.md](xlsx.md) (`yaz`).
- Onu çağıranlar:
  - [../bolumler/okul.md](../bolumler/okul.md) — `aktarim-sablon` (`GET`, yalnız `tur=program`, `aktarim.yap` yetkisi →
    `ders-programi-sablon.xlsx`), `aktarim-disa` (`GET`, `tur` = `ogrenci` | `ogretmen` | `program` → `disa` + `GUNLER`),
    `aktarim-ice` (`POST`, yalnız `program`: `tabloOku` → `coz` → sınıf/ders/öğretmen/çakışma denetimleri `anahtarla` ile),
    toplu şifre dağıtımındaki "Giriş bilgileri" dosyası (`disa`).
  - [../bolumler/kisi-aktarim.md](../bolumler/kisi-aktarim.md) — yalnız `anahtarla` (başlık, sınıf ve servis adı eşleme).
- Veritabanı kullanmaz; tablolar (sınıflar, dersler, ders programı) çağıranda.

## Nasıl çalışır (adım adım)?

```
müdür dosya yükler → okul.js aktarim-ice
  tabloOku(ham, dosyaAdi)                         sayfalar
  coz('program', sayfalar)
    başlıkları zorunlu sütunları içeren ilk sayfayı bul
    başlık → alan haritası (anahtarla + esler)
    her satır: boş mu → zorunlular → gün (gune) → saatler (saate)  → kayitlar | hatalar
  okul.js: sınıf var mı, ders var mı, öğretmen/sınıf aynı saatte mi → önizleme raporu → onaydan sonra kayıt
```

## Dikkat!

- `SUTUNLAR.ogrenci` ve `ANLATIM.ogrenci` ölü koddur: eski öğrenci aktarım biçimini (kullanıcı adı ve şifre zorunlu, e-posta
  isteğe bağlı, "giriş kodu otomatik üretilir") anlatır; bugünkü kişi aktarımıyla çelişir. Bir gün yeniden `sablon('ogrenci')`
  çağrılırsa kullanıcıya yanlış talimat gider. (Kod değiştirilmedi; temizlik önerisi.)
- `basliklariEsle` içindeki `bulunan` nesnesi doldurulur ama hiç kullanılmaz (zararsız artık).
- Aynı alana uyan iki başlık varsa (ör. hem "Saat" hem "Başlangıç") SOLDAKİ kazanır.
- `saate` çözemediği metni olduğu gibi döndürür; `coz` bunu `SS:DD` denetimiyle yakalar. `saate`'yi başka yerde kullanacaksan
  dönüşü doğrula.
- `saate`'de noktalı ve `0` ile `1` arasındaki her metin Excel gün kesri sayılır: `'0.20'` "00:20" değil `'04:48'` olur
  (`0,2 × 24 saat`). `'9.20'` gibi 1'den büyük değer kesir sayılmaz, saat:dakika olarak okunur. Okul saatlerinde gece yarısı
  pek olmadığı için pratikte sorun çıkarmaz.
- `'1'` gün sayısı olarak kabul edilir ama `'1.0'` (bazı programların sayı hücresi yazımı) kabul edilmez; `.xlsx`'te gün sütunu
  sayı olarak girilmişse değer `'1'` gelir, sorun yok.

## Testleri

- `testler/test-aktarim.js` (sunucu ister) — ders programı aktarımı (şablon, başlık eşleme, gün ve saat biçimleri, hatalı satırlar),
  dışa aktarım, bozuk dosya, sıkıştırma bombası, yetki. (Aynı paket kişi aktarımını da dener.)
- Sunucusuz birim testi `saate`/`gune`/`coz` için yok.
- Elle: `node -e "const a=require('./sunucu/yardimci/aktarim');console.log(a.saate('0.3888'),a.saate('9.20'),a.gune('Pzt'),a.gune('çarş'))"`
  → `09:20 09:20 1 3`.

## Son durum

- Dosya parça parça eklendi: `180132f commit 87` ve `51179f4 commit 88` (2026-08-29; sütun tanımları, metin yardımcıları, şablon,
  dışa aktarım), `aced02f commit 312` (başlık eşleme) ve `8207ee3 commit 323` (2026-09-26; `coz`). Hepsi ekleme; sonradan
  davranış değişikliği yok. Öğrenci aktarımının kişi aktarımına taşınması `okul.js` tarafında yapıldı, bu dosyadaki eski tanımlar
  kaldı.
- Açık: ölü `ogrenci` tanımı ve anlatımı; sunucusuz birim testi yok.
- Sıradaki işlerden "Sınav: formüllü ölçüm … notları Excel'den yükleme/indirme" ve "quiz sorularını Excel'den aktarma" yeni
  aktarım türleri isteyecek; `SUTUNLAR`'a yeni tür eklemek (ve `coz`'a türüne özel çözüm) doğal yer burası.
