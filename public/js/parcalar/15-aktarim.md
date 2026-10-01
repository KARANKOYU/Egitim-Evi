# public/js/parcalar/15-aktarim.js

"Excel Aktarım" sayfası (kişi listesi ve ders programının iki adımlı içeri aktarımı, dışarı aktarım, alt alta yazılmış
isimlerden Excel) ve — tarihsel nedenle aynı dosyada — okulun "İşlem Kaydı" sayfası.

## Bu dosya ne yapar?

Bir okulun yüzlerce öğrencisini "Öğrenci ekle" ile tek tek açmak olmaz. Müdür (ya da `aktarim.yap` yetkili öğretmen) bu
sayfada elindeki tabloyu yükler; sunucu satırları okur, önce **ne olacağını gösterir** ("Hesap açılacak 120 · Güncellenecek
14 · Hatalı satır 3" ve satır satır nedenler), onaylanınca hepsini tek işlemde uygular. Açılan hesapların kullanıcı adları
ve şifreleri yalnız o anda, bir kez görünür; "Giriş kâğıtlarını yazdır" her kişiye kesilip verilecek bir kâğıt çıkarır.

Sayfanın üç sekmesi var:

1. **İçeri aktar** — iki tür: *Kişi listesi* (öğrenci ve servisçi hesaplarını toplu aç; aynı T.C. no gelirse hesap yeniden
   açılmaz, sınıfı ve bilgileri güncellenir — yıl sonunda sınıf atlatma da böyle yapılır) ve *Ders programı* (ders saatlerini
   programa toplu ekle). Her biri üç adım: boş şablonu indir, doldur, dosyayı yükle → "Kontrol et" → rapor → onay.
2. **Dışarı aktar** — okulun şu anki kayıtları Excel olarak: kişi listesi (içeri aktarımla aynı sütunlar, şifresiz;
   düzenleyip geri yüklenebilir), öğrenci listesi ve veli kodları, öğretmen listesi, ders programı.
3. **Metinden Excel'e** — alt alta yazılmış isimler (ya da bir .txt) doldurulmaya hazır şablona çevrilir: "Ad Soyad" ya da
   "Ad Soyad 12345678901"; eksik T.C. numaraları Excel'de doldurulup "İçeri aktar"dan yüklenir.

Dosya tarayıcıda yalnız okunur (base64'e çevrilir) ve sunucuya gönderilir; bütün denetim ve kayıt sunucuda. Desteklenen
türler: Excel (.xlsx, eski .xls), LibreOffice (.ods), CSV ve kişi listesinde düz metin.

Aynı dosyanın sonundaki **İşlem Kaydı** sayfası ise "kim, ne zaman, ne yaptı" günlüğünü gösterir: hesap açma, rol
değişikliği, toplu aktarım, özellik açma/kapama gibi önemli işler; türe göre süzülür. Müdür ve `islem-kaydi.gor` yetkilisi
kendi okulunu, sistem yöneticisi (yönetim panelindeki "İşlem Kaydı") bütün kayıtları görür.

Ön yüz parçaları ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`, [../../../sunucu/http.md](../../../sunucu/http.md)
`birlesikOku`); buradaki `function`'lar ve `var`'lar bütün parçalara açıktır. Bu dosya yüklenirken yalnız tanım yapar.

## İçinde neler var?

### Sabitler

- `AKTARIM_ADLARI` — içeri aktarım türleri: `kisi` ("Kişi listesi" / "Öğrenci ve servisçi hesaplarını toplu aç"), `program`
  ("Ders programı" / "Ders saatlerini programa toplu ekle"). Sırası "Ne yükleyeceksin?" kutularının sırasıdır.
- `DISA_LISTE` — dışarı aktarım satırları `{ k, ad, alt, dosya }`: `kisi` "Kişi listesi (iki sayfa)", `ogrenci` "Öğrenci
  listesi ve veli kodları" (`ogrenciler.xlsx`), `ogretmen` "Öğretmen listesi" (`ogretmenler.xlsx`), `program` "Ders
  programı" (`ders-programi.xlsx`). `kisi`'nin `dosya`'sı kullanılmaz (adı sunucu verir: `kisiler.xlsx`).
- `KISI_TURLERI` — "Liste kimlerin?" seçenekleri: `''` "Sayfa adlarından anlaşılsın", `ogrenci` "Öğrenciler", `servisci`
  "Servisçiler".
- `DURUM_AD` — rapordaki durum yazısı: `hazir` "Açılacak", `guncel` "Güncellenecek", `hata` "Hata", `uyari` "Dikkat",
  `atlandi` "Atlandı".

### Durum (`S` üzerinde, sonradan kurulur)

- `S.aktarim` — `{ yon: 'ice'|'disa'|'metin', tur: 'kisi'|'program', liste: ''|'ogrenci'|'servisci', dosyaAd, dosya
  (base64), rapor, ozet: { hazir, guncel, hatali, uyarili, yeniSiniflar }, sonuc }`. Sayfa değişse de kalır: kişi başka
  sayfaya gidip dönünce seçtiği dosya, raporu ya da sonucu yerinde durur.
- `S.metinDosya` — "Metinden Excel'e"de seçilen dosya `{ ad, b64 }`.
- `S.islemSuz` — İşlem Kaydı'nın seçili türü (`''` = hepsi).
`26-baslat.js` (`oturumDurumunuSifirla`) çıkışta ve rol değişince `S.aktarim` ve `S.metinDosya`'yı sıfırlar; `S.islemSuz`'a
dokunmaz.

### Yardımcılar

- `b64Indir(b64, ad, tur)` — sunucudan base64 gelen dosyayı `Blob`'a çevirip `<a download>` ile indirir (tür verilmezse
  .xlsx türü; çağıranların hiçbiri vermez), 4 sn sonra adresi bırakır.
- `metinBase64(metin)` — UTF-8 metni base64'e çevirir (`TextEncoder`, 32 KB'lık parçalarla; uzun metinde yığın taşmasın).
- `aktarimDurumu()` — `S.aktarim` yoksa ya da türü bozuksa `{ yon (eskisi ya da 'ice'), tur: 'kisi', … }` kurar; döner.
- `aktarimSonucKorumasi()` — açılan hesapların şifreleri ekrandayken `TEK_SEFER.aktarimSonucu`'nu kurar
  ([03-mesaj-modal.md](03-mesaj-modal.md)): `sayfada: false` (sayfa değişince sonuç kaybolmaz, sormaz), `sor()` liste
  YAZDIRILMADIYSA "Açılan hesapların giriş bilgilerini yazdırmadın. Devam edersen bu şifreler bir daha gösterilmez. Devam
  edilsin mi?" der, `temizle()` sonucu siler. Böylece çıkış, portal değiştirme, yenileme ve sekmeyi kapatma önce sorar.
- `aktarimSonucuBirakilabilir()` — başka tür seçmeden ya da yeni dosya seçmeden önce: kayıt varsa sorar; "İptal" → `false`;
  değilse kaydı siler, `true`.

### İçeri aktar ekranı

- `SAYFALAR.aktarim` (adres `#/aktarim`) — başlık "EXCEL AKTARIM" ("Listeleri dosyayla topluca al ya da ver. Excel,
  LibreOffice (ODS), CSV ve düz metin olur."); sekmeler "İçeri aktar" / "Dışarı aktar" / "Metinden Excel'e"
  (`data-act="aktarim-yon" data-yon=…`). Dışarı ve metin sekmesinde yalnız ilgili kart çizilir. İçeri sekmesinde sırasıyla:
  - sonuç varsa `sonucKarti(A)`;
  - "Ne yükleyeceksin?" — iki `button.tur-sec` (`aktarim-tur`), seçili olan `secili`;
  - "<tür> yükleme" kartı, üç `.adim`:
    1. **Boş şablonu indir** — kişide "İki sayfa gelir: Öğrenciler ve Servisçiler. Üçüncü sayfada nasıl doldurulacağı
       yazar. Kendi dosyan varsa sütun başlıkları benzer olsun yeter (Ad, Soyad, T.C. Kimlik No...). Öğretmenler dosyayla
       eklenmez: kendi hesaplarını açıp kişi kodlarını verirler (Öğretmenler > Kodla ekle)."; programda "Sütun başlıkları
       hazır gelir; ikinci sayfada nasıl doldurulacağı yazar." + "Şablonu indir" (`aktarim-sablon`).
    2. **Doldur** — kişide zorunlular (ad, soyad, T.C.), boş kullanıcı adı/şifrenin T.C. olması, sınıf ve şubenin ayrı
       yazılması ("7" ve "Çiçek" → "7-Çiçek"; yoksa açılır), aynı T.C.'nin güncellenmesi; programda "Sınıf, gün, saat ve ders
       zorunlu. Gün Pazartesi'den Pazar'a olabilir."
    3. **Dosyayı yükle** — gizli `input#aktarimDosya` (kişide `.xlsx,.xls,.ods,.csv,.txt`, programda `.xlsx,.xls,.ods,.csv`);
       kişide "Liste kimlerin?" (`select#aktarimListe`, `KISI_TURLERI`; "Şablonu kullandıysan dokunma…"); "Dosya seç"
       (`aktarim-sec`), seçilen dosyanın adı ya da "Henüz dosya seçilmedi", dosya varsa "Kontrol et" (`aktarim-yukle`);
       "Önce ne olacağını gösteririz, sen onaylayınca uygulanır. Hiçbir şey habersiz değişmez."; ileti yeri `#aktarimMesaj`.
  - rapor varsa `raporKarti(A)`.
  Çizimden sonra `aktarimDosyaBagla()` ve "Liste kimlerin?" kutusunun `onchange`'i (`A.liste` yazılır, `A.rapor = null`;
  sayfa yeniden çizilmez).
- `aktarimDosyaBagla()` — dosya seçilince: önce `aktarimSonucuBirakilabilir()` (vazgeçerse kutu boşaltılır); 950 000
  bayttan büyükse "Dosya çok büyük (en fazla 950 KB). Listeyi ikiye bölüp iki kez yükle."; değilse `FileReader` ile
  `data:` adresi okunur, virgülden sonrası (base64) `S.aktarim.dosya`'ya, adı `dosyaAd`'a; rapor ve sonuç silinir,
  `git('aktarim')`. Okunamazsa "Dosya okunamadı.".
- `aktarimIstegi(uygula)` — kişide `POST /api/school/kisi-aktarim { dosya, dosyaAdi, tur: liste || undefined, uygula }`,
  programda `POST /api/school/aktarim-ice { tur: 'program', dosya, dosyaAdi, uygula }`.
- `raporKarti(A)` — "Kontrol sonucu": sayılar (`stat`) kişide "Hesap açılacak", "Güncellenecek", "Hatalı satır" (+ açılacak
  yeni sınıflar mavi iletide), programda "Ders eklenecek", "Hatalı satır" ve varsa "Uyarılı". Satır yoksa "Dosyada
  işlenecek satır bulunamadı."; varsa `table.rapor-tablo` (kişide "Sayfa" sütunu da): Satır · Kayıt · Durum
  (`span.durum.<durum>`, `DURUM_AD`) · Açıklama. İşlenecek satır varsa "Vazgeç" (`aktarim-vazgec`) ve "3 hesabı aç, 2 hesabı
  güncelle" / "12 ders saatini ekle" (`aktarim-uygula`); yoksa kırmızı "İşlenecek geçerli satır yok. Yukarıdaki hataları
  düzeltip dosyayı yeniden yükle.".
- `sonucKarti(A)` — "İşlem tamamlandı" + sunucunun iletisi (yeşil, kendiliğinden kaybolmaz). Açılan hesap varsa "Açılan
  hesapların giriş bilgileri. Bu liste bir daha gösterilmez; yazdır ya da kişilere ilet. Şifresi T.C. no olanlar ilk
  girişte kendi şifresini belirler." ve tablo: Kişi (+ sınıf) · Rol (`ROL_AD`) · Kullanıcı adı · Şifre (ya da soluk "T.C.
  kimlik no") · Veli kodu (`kisiKoduBicim` ile 4'erli tireli, `code.kisi-kodu.satir-ici`). Altta "Giriş kâğıtlarını
  yazdır" (`aktarim-mektup`, hesap varsa) ve "Tamam" (`aktarim-temizle`).

### Dışarı aktar ve Metinden Excel'e

- `disaKarti()` — "Neyi indirmek istiyorsun?" + "Şu anki kayıtlar Excel dosyası olarak iner. Kişi listesi içeri aktarımla
  aynı biçimdedir: düzenleyip geri yükleyebilirsin (şifreler dosyada olmaz)."; `DISA_LISTE`'nin her satırı ad, kısa
  açıklama ve "İndir" (`aktarim-disa`).
- `metinKarti()` — "Alt alta yazılmış isimlerden Excel": açıklama, "Liste kimlerin?" (`select#mtTur`: Öğrenciler /
  Servisçiler), "İsimler" (`textarea#mtMetin`), gizli `input#mtDosya` (`.txt,.csv`), ".txt dosyası seç" (`metin-dosya-sec`),
  "Excel'e çevir" (`metin-excel`), ileti yeri `#mtMesaj`.
- `metinBagla()` — dosya seçilince: 900 000 bayttan büyükse "Dosya çok büyük (en fazla 900 KB)."; değilse okunur,
  `S.metinDosya = { ad, b64 }`, yazı kutusu boşaltılır, yer tutucusu "<dosya> seçildi. "Excel'e çevir"e bas." olur.

### Eylemler (`EYLEMLER`)

- `aktarim-yon` — sekmeyi değiştirir, raporu siler (seçili dosya ve sonuç kalır), `git('aktarim')`.
- `aktarim-tur` — `aktarimSonucuBirakilabilir()`; sonra `S.aktarim`'ı o türle SIFIRDAN kurar (yalnız "Liste kimlerin?"
  seçimi kalır), `git('aktarim')`.
- `aktarim-sablon` — kişide `GET /api/school/kisi-sablon` → `b64Indir` (`kisi-listesi-sablon.xlsx`); programda
  `dosyaIndir('/api/school/aktarim-sablon?tur=program', 'ders-programi-sablon.xlsx')`. Düğme beklerken kilitli; hata →
  `hataGoster`.
- `aktarim-sec` — gizli dosya kutusunu tıklar.
- `aktarim-yukle` — "Kontrol ediliyor..." → `aktarimIstegi(false)` → `A.rapor`, `A.ozet` → `git('aktarim')`. Hata →
  `#aktarimMesaj`.
- `aktarim-uygula` — onay sorusu: kişide "3 hesap açılacak, 2 hesap güncellenecek, 1 yeni sınıf açılacak. Onaylıyor
  musun?", programda "12 ders saati programa eklenecek. Var olan program silinmez, üzerine eklenir. Onaylıyor musun?".
  "Uygulanıyor..." → `aktarimIstegi(true)` → `S.aktarim = { yon: 'ice', tur, liste, …, sonuc: cevap }` (seçili dosya ve rapor
  silinir); açılan hesap varsa `aktarimSonucKorumasi()`; `git('aktarim')`. Hata → `#aktarimMesaj`.
- `aktarim-vazgec` — raporu ve seçili dosyayı siler.
- `aktarim-temizle` ("Tamam") — açılan hesap varsa "Giriş bilgileri listesi kapanacak ve bir daha gösterilmeyecek.
  Kapatılsın mı?"; sonra korumayı ve sonucu siler.
- `aktarim-mektup` — sonucu "yazdırıldı" işaretler ve `girisMektuplariYazdir(S.user.schoolName, hesaplar)`
  ([10a-giris-bilgisi.md](10a-giris-bilgisi.md)): tarayıcının yazdırma penceresi açılır (PDF olarak da kaydedilebilir).
- `aktarim-disa` — `DISA_LISTE`'de olmayan tür yok sayılır. Kişide `GET /api/school/kisi-disa` → `b64Indir`; öbürlerinde
  `dosyaIndir('/api/school/aktarim-disa?tur=<tür>', <dosya adı>)`. Düğme beklerken kilitli; hata → `hataGoster`.
- `metin-dosya-sec` — gizli `#mtDosya`'yı tıklar.
- `metin-excel` — yazı kutusu doluysa metin (`metinBase64`, dosya adı `liste.txt`; seçilmiş dosya unutulur), boşsa seçilmiş
  dosya, ikisi de yoksa "İsimleri yaz ya da bir .txt dosyası seç." "Çevriliyor..." → `POST /api/school/txt-excel { tur,
  dosya, dosyaAdi }` → `b64Indir(d.dosya, d.ad)` ve "N kişi Excel'e yazıldı: <ad>" (6 sn sonra kaybolur). Hata → `#mtMesaj`.

### İşlem Kaydı

- `SAYFALAR['islem-kaydi']` (adres `#/islem-kaydi`) — `GET /api/islem-kaydi[?islem=<tür>]`; başlık "İŞLEM KAYDI". Kayıtta
  geçen türler varsa sekmeler: "Hepsi" ve her tür (`data-act="islem-suz" data-islem=<anahtar>`, seçili olan `secili`; eylem
  `25-tiklama.js`'te: `S.islemSuz`'u yazar, `git('islem-kaydi')`). Kayıt yoksa "Henüz kayıt yok. Önemli işlemler yapıldıkça
  burada birikir."; varsa "Son 300 kayıt (toplam 1250)" başlıklı tablo: Tarih (`tarihSaat`) · Kişi (+ altında rolü,
  `ROL_AD`) · İşlem (Türkçe adı) · Ayrıntı · IP. Her satırda `data-ara` (kişi, işlem, ayrıntı): üst arama kutusu satırları
  süzer.

## Kimle konuşur?

- Çağırdıkları (hepsi aynı IIFE'de):
  - `S` ([00-durum.md](00-durum.md)); `$`, `esc`, `api`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md));
    `ROL_AD`, `tarihSaat` ([02-ikonlar.md](02-ikonlar.md));
  - `mesajGoster`, `dosyaIndir`, `TEK_SEFER` ([03-mesaj-modal.md](03-mesaj-modal.md));
  - `kisiKoduBicim`, `dugmeBekle`, `dugmeBitir` ([05-giris.md](05-giris.md)); `git`, `yaz`, `hero`, `bosKutu`
    ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR`, `stat` ([08-ana-sayfa.md](08-ana-sayfa.md));
    `girisMektuplariYazdir` ([10a-giris-bilgisi.md](10a-giris-bilgisi.md)); `hataGoster` (`25-tiklama.js`).
- Sunucu uçları:
  - [../../../sunucu/bolumler/kisi-aktarim.md](../../../sunucu/bolumler/kisi-aktarim.md) — hepsi `aktarim.yap` ister (yoksa
    403 "Bu işlem için yetkin yok"):
    - `GET /api/school/kisi-sablon` → `{ dosya (base64), ad: 'kisi-listesi-sablon.xlsx' }` (Öğrenciler, Servisçiler, Nasıl
      doldurulur);
    - `GET /api/school/kisi-disa` → `{ dosya, ad: 'kisiler.xlsx' }` (şablonla aynı sütunlar: ad, soyad, T.C., kullanıcı adı,
      e-posta, doğum tarihi, sınıf/şube, okul no, adres…; şifre boş);
    - `POST /api/school/kisi-aktarim` — önizleme `{ onizleme, hazir, guncel, hatali, yeniSiniflar, sinir: 600, rapor:
      [{ sayfa, tur, satir, ad, durum: 'hazir'|'guncel'|'hata', mesaj }] }`; uygulama `{ uygulandi, acilan, guncellenen,
      hesaplar: [{ ad, rol, sinif, kullaniciAdi, sifre, tcIle, veliKodu }], message }`. Satır başına hesap açma/düzenleme
      yetkisi ayrıca denetlenir; 600'den çok satır ya da okul başına saatte 20'den sık uygulama reddedilir; arada biri
      aynı T.C./e-postayı aldıysa 409 ve hiçbir hesap açılmaz; işlem kaydı `hesap.toplu-acildi`;
    - `POST /api/school/txt-excel { tur, dosya, dosyaAdi }` → `{ adet, dosya, ad: '<tur>-listesi.xlsx' }`; tür yoksa 400,
      isim yoksa 400 "Dosyada isim bulunamadı. Her satıra bir kişinin adını yaz.".
  - [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md) — `aktarim.yap`:
    - `GET /api/school/aktarim-sablon?tur=program` → `ders-programi-sablon.xlsx` (ikili);
    - `GET /api/school/aktarim-disa?tur=ogrenci|ogretmen|program` → `ogrenciler.xlsx` (ad soyad, kullanıcı adı, e-posta,
      sınıf, veli kodu, müdür notu, kayıt tarihi), `ogretmenler.xlsx` (onaylı öğretmenler: ad, kullanıcı adı, e-posta,
      branş, verdiği dersler, sınıflar, kayıt tarihi), `ders-programi.xlsx`;
    - `POST /api/school/aktarim-ice { tur: 'program', … }` — her satır için sınıf, `program.duzenle` kapsamı, ders, saat
      (bitiş sonra, en çok 8 saat), programda ya da dosyada zaten var mı (`atlandi`), çakışma (`uyari`, engellemez).
      Önizleme `{ onizleme, tur, hazir (uyarılılar dahil), hatali, uyarili, sinir: 300, rapor }`; uygulama tek işlemde,
      eğitim yılı damgasıyla `{ uygulandi, eklenen, cakismalar, message }`; işlem kaydı `program.toplu-eklendi`.
  - [../../../sunucu/bolumler/islem-kaydi.md](../../../sunucu/bolumler/islem-kaydi.md) — `GET /api/islem-kaydi?islem=` →
    `{ toplam, turler: [{ k, ad }], kayitlar: [{ id, tarih, kisi, rol, islem, islemAd, detay, ip }] }` (en yeni 300; yönetici
    hepsini, öteki `islem-kaydi.gor` ile kendi okulunu; yoksa 403).
  - Kapılar ([../../../sunucu/api.md](../../../sunucu/api.md)): geçmiş eğitim yılına bakan öğretmen/müdürün program
    aktarımı (`aktarim-ice`, `tur: 'program'`) 409 "Geçmiş bir eğitim yılına bakıyorsun; kayıtlar salt okunur…" alır.
    Dosya okuyucuları (.xlsx/.xls/.ods/.csv/.txt, sıkıştırma bombası sınırı) `sunucu/yardimci/tablo-oku.js` ve
    `sunucu/yardimci/xlsx.js`'te ([../../../sunucu/yardimci/tablo-oku.md](../../../sunucu/yardimci/tablo-oku.md),
    [../../../sunucu/yardimci/xlsx.md](../../../sunucu/yardimci/xlsx.md)).
- Onu kullananlar:
  - [06-menu.md](06-menu.md) — müdürün menüsünde "Excel Aktarım" ve "İşlem Kaydı" her zaman; öğretmende "Ek Yetkiler"
    altında `aktarim.yap` / `islem-kaydi.gor` varsa. Sayfalar `SAYFA_OZELLIK`'te yok (okulun kapattığı bölümlerden
    etkilenmez).
  - [08-ana-sayfa.md](08-ana-sayfa.md) — müdürün ana sayfasında mor "Excel Aktarım" kutucuğu (`yetkim('aktarim.yap')`).
  - [10-mudur.md](10-mudur.md) — "Öğrenciler" sayfasında "Excel ile toplu" (`data-nav="aktarim"`; `ogrenci.hesap-ac` ve
    `aktarim.yap` ile).
  - `public/js/yonetim/09a-yonetim-paneli.js` — sistem yöneticisinin menüsündeki "İşlem Kaydı" bu dosyadaki sayfayı açar.
  - `25-tiklama.js` — `islem-suz` eylemi. `26-baslat.js` — `S.aktarim`, `S.metinDosya` sıfırlama; `TEK_SEFER = {}`.
  - [03-mesaj-modal.md](03-mesaj-modal.md) — `TEK_SEFER`'e bakan çıkış (`26-baslat.js`), portal değiştirme
    (`08c-kisilikler.js`) ve sekmeyi kapatma/yenileme (`beforeunload`, `25-tiklama.js`) `aktarimSonucu` kaydını da sorar;
    sayfa geçişi (`git`, geri tuşu) kayıt `sayfada: false` olduğu için sormaz.
  - Ekran turu `araclar/gezinti.js` (ÇALIŞTIRMA): "Excel aktarım", "İçeri aktarma — öğrenci listesi (.csv) seçildi",
    "… — kontrol", "… — uygulandı", "Dışarı aktarma", "İşlem kaydı".
- Görünüm (`public/css/parcalar/`): `18-aktarim-kvkk.css` (`.tur-sec` ve `.secili`, `.rapor-kaydir`, `.rapor-tablo`,
  `.rapor-no`, `.durum` ve `.hazir/.hata/.uyari/.atlandi`); `22-cesitli.css` (`.adim`, `.adim-no`); `19-mesajlar.css`
  (`.sekme-satir`, `.sekme`, `.sekme.kucuk`, `.secili`); `04-kartlar.css` (`.kart`, `.grid.k2`, `.grid.k4`, `.stat`,
  `.satir`); `28-yetiskin-hesap.css` (`.kisi-kodu.satir-ici`); `27-harita-ortak.css` (`.dugme-satir`, `.soluk`); `02-form.css`
  (`.field`, `.hint`, `.msg` renkleri, `.btn`).
- Rol: müdür (her zaman); `aktarim.yap` yetkili öğretmen (Excel Aktarım); `islem-kaydi.gor` yetkili öğretmen (İşlem
  Kaydı; hazır "Müdür Yardımcısı" şablonunda var); sistem yöneticisi (İşlem Kaydı, bütün okullar). Öğrenci, veli ve
  servisçi görmez. Android uygulamasında bu sayfalar yok.

## Nasıl çalışır (adım adım)?

### Kişi listesi: iki adım

```
"Excel Aktarım" ─► SAYFALAR.aktarim (İçeri aktar, Kişi listesi)
"Şablonu indir" ─► GET /api/school/kisi-sablon ─► b64Indir(kisi-listesi-sablon.xlsx)
"Dosya seç" ─► aktarimDosyaBagla: ≤ 950 KB ─► FileReader ─► S.aktarim.dosya = base64 ─► git ("Kontrol et" çıkar)
"Kontrol et" ─► POST /api/school/kisi-aktarim { dosya, dosyaAdi, tur?, uygula: false }
     ─► A.rapor, A.ozet ─► raporKarti: "120 hesap açılacak · 14 güncellenecek · 3 hatalı" + satır satır
"120 hesabı aç, 14 hesabı güncelle" ─► confirm ─► POST … { uygula: true }   (sunucu her şeyi BAŞTAN denetler)
     ─► S.aktarim.sonuc = { message, hesaplar: [şifreler] } ─► TEK_SEFER.aktarimSonucu ─► sonucKarti
"Giriş kâğıtlarını yazdır" ─► yazdirildi = true ─► girisMektuplariYazdir ─► window.print()
"Tamam" ─► (yazdırılmamış olsa da) "Kapatılsın mı?" ─► sonuç silinir
```

### Ders programı

Aynı akış, uç `POST /api/school/aktarim-ice { tur: 'program' }`. Raporda `atlandi` (zaten var) ve `uyari` (çakışma; yine
eklenir) satırları da olur; onay "Var olan program silinmez, üzerine eklenir." der. Sonuçta hesap listesi olmadığı için
koruma kurulmaz.

### İşlem Kaydı

```
menü "İşlem Kaydı" ─► GET /api/islem-kaydi ─► sekmeler (türler) + "Son N kayıt" tablosu
sekme ─► islem-suz ─► S.islemSuz = tür ─► git ─► GET /api/islem-kaydi?islem=tür
```

## Dikkat!

- **"Liste kimlerin?" değişince eski rapor ekranda kalır.** Kutunun `onchange`'i yalnız `A.liste`'yi yazıp `A.rapor`'u
  siler, sayfayı yeniden çizmez: önceki kontrolün raporu ve "N hesabı aç" düğmesi görünmeye devam eder. Basılırsa onay
  sorusu eski sayıları söyler ve uygulama YENİ türle (önizlemesi görülmeden) gider. Şablonun sayfa adları türü belirlediği
  için çoğu zaman fark etmez; tek sayfalık genel adlı bir dosyada "Öğrenciler"den "Servisçiler"e geçilirse satırlar
  servisçi olarak işlenir. Kod okumasına göre; kod değiştirilmedi. Öneri: `onchange` sonunda `git('aktarim')`.
- **Şifreler bir kez görünür; "yazdır"a basmak yazdırılmış sayılır.** `aktarim-mektup` yazdırma penceresi açılmadan önce
  `yazdirildi = true` der; kişi yazdırmaktan vazgeçse de sonradan çıkış/yenileme "yazdırmadın" diye sormaz ("Tamam" yine
  sorar). Sonuç tablosunda şifreler ekranda düz yazıdır (omuz üstünden bakana dikkat). Yeni dosya seçerken soru
  onaylandıktan sonra dosya çok büyük çıkarsa (ya da okunamazsa) liste ekranda kalır ama koruması kalkmıştır.
- **Aynı türe yeniden basmak sıfırlar.** `aktarim-tur` seçili türe basılsa da `S.aktarim`'ı baştan kurar: seçili dosya ve
  rapor gider.
- **Dışarı aktarım yalnız `aktarim.yap` ister — içindeki veri geniş.** "Öğrenci listesi ve veli kodları" dosyası bütün
  öğrencilerin veli kodlarını, e-postalarını ve müdür notlarını taşır. "Kişi listesi" T.C. no, doğum tarihi, e-posta ve
  adresi, servisçilerde ayrıca telefonu taşır.
  Okulun başka yerlerinde veli kodu yalnız `ogrenci.duzenle` yetkilisine gider (giriş bilgisi dağıtımı, öğrenci listesi;
  [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md)). Ekrandaki kısa açıklama ("Ad, kullanıcı adı, sınıf,
  veli kodu") e-postayı, müdür notunu ve kayıt tarihini söylemiyor. Yetki sunucu tarafında; planlı rol şablonları (aşağıda)
  bu yetkiyi daha çok kişiye verecek. Kod değiştirilmedi.
- **Sayfalar yetkiye bakmaz.** Menü öğeleri yetkiyle çıkar ama `#/aktarim` ya da `#/islem-kaydi` adresini yazan yetkisiz
  kişi sayfayı görür; düğmeler 403 alır (aktarım sayfası çizilir, işlem kaydı sayfası kırmızı ileti gösterir).
- **Program önizlemesinde hazır satır "Açılacak" yazar.** `DURUM_AD.hazir` hesaplar için yazılmış; ders saatinde de aynı
  etiket çıkar. `.durum.guncel`'in CSS kuralı yok: "Güncellenecek" etiketi renksiz bir hap olarak görünür.
- **Sunucunun sınırları istemcide gösterilmez.** Önizleme `sinir` (kişide 600, programda 300) döner ama ekran kullanmaz;
  fazlası uygulamada 400 alır. Program uygulamasının döndürdüğü `cakismalar` listesi de gösterilmez (çakışmalar Ders
  Programı sayfasında görülür).
- **Geçmiş yılda program aktarımı önizlemede bile 409.** Arşiv kapısı isteğin `uygula` olup olmadığına bakmaz; "Kontrol et"
  de "Geçmiş bir eğitim yılına bakıyorsun…" iletisini alır. Kişi aktarımı yıldan bağımsızdır, etkilenmez.
- **İletiler bazen görünmez yerde.** Hatalar `#aktarimMesaj`'a, yani 3. adımın altına yazılır; rapor kartı onun altındadır.
  Uygulama hatası ("… Hiçbir hesap açılmadı; listeyi yeniden yükle.") rapordaki düğmeye basan kişinin ekranının üstünde
  kalabilir. "Kontrol et" sonrası `git` sayfayı başa kaydırır; rapor aşağıdadır.
- **Kabul edilen türler metinle uyuşmuyor.** Programın dosya kutusu .txt almaz ama altındaki yazı "ya da düz metin olabilir"
  der (CSV'yi ise saymaz, kabul eder). "Metinden Excel'e"nin ".txt dosyası seç" düğmesi .csv de kabul eder.
- **Boyut sınırları elle eşit.** İstemci 950 KB (içeri aktarım) ve 900 KB (metin dosyası) der; sunucu base64 olarak 1,3
  milyon karakter (~975 KB) kabul eder. Yazı kutusuna yapıştırılan metnin istemcide sınırı yok; çok uzunsa sunucu "Dosya
  çok büyük" der.
- **Dosya kutuları boşaltılmıyor.** `aktarimDosyaBagla` "Dosya çok büyük" deyince `#aktarimDosya`'nın değerini silmez
  (başarıda sayfa yeniden çizildiği için sorun yok). `metinBagla` ise hiçbir durumda `#mtDosya`'yı boşaltmaz, sayfayı da
  yeniden çizmez. Tarayıcı aynı dosya yeniden seçilince `change` olayını çoğu zaman vermez. Bu yüzden .txt dosyasını
  düzeltip aynı yerden yeniden seçen kişinin seçimi okunmaz. "Excel'e çevir" de `S.metinDosya`'daki ESKİ içeriği çevirir.
  Kod okumasına göre; tarayıcıda denenmedi. Öneri: iki `onchange`'in sonunda `value = ''`.
- **`S.metinDosya` görünmeden kalır.** Sekme değiştirip "Metinden Excel'e"ye dönünce yazı kutusu ve yer tutucu sıfırlanır
  ama seçilmiş dosya bellekte durur; boş kutuyla "Excel'e çevir" o eski dosyayı çevirir. Tür kutusu da her çizimde
  "Öğrenciler"e döner.
- **İşlem Kaydı'nın sınırları.** En yeni 300 kayıt gelir, sayfalama yok ("toplam" yalnız yazılır). Sistem yöneticisi bütün
  okulların kayıtlarını aynı tabloda görür ama tabloda **okul sütunu yok** (cevap da okul taşımıyor); hangi kaydın hangi
  okula ait olduğu anlaşılmaz. Süzgeçte kayıt yoksa ileti "Henüz kayıt yok" der. `S.islemSuz` çıkışta sıfırlanmaz: aynı
  sekmede giren sonraki kişi önceki seçimle açar (o tür kendi listesinde yoksa hiçbir sekme seçili görünmez). IP adresi
  okul yönetimine gösterilir (yetişkinlerin kişisel işlemleri okulsuz yazıldığı için onlarda görünmez).
- **İşlem Kaydı neden bu dosyada?** Tarihsel: aynı gün (commit 93) aktarımla birlikte yazıldı. Ararken dosya adına
  aldanma.
- **Önizlemeye güvenilmez, sunucu baştan denetler.** Uygulama aynı dosyayı yeniden gönderir; arada veri değiştiyse sunucu
  farklı karar verebilir. Yazma tek işlemdir: kişi listesinde bir satır bile tekillik kısıtına takılırsa hiçbir hesap
  açılmaz (409), ekranda iletisi `#aktarimMesaj`'a düşer.
- **HTML güvenliği:** rapor satırları, kişi adları, kullanıcı adları, şifreler, veli kodları, işlem kaydı alanları `esc`'ten
  geçer. `AKTARIM_ADLARI`, `DISA_LISTE`, `KISI_TURLERI`, `DURUM_AD` ve `ROL_AD` yazıları sabit olduğu için kaçırılmadan yazılır.

## Testleri

- Bu dosyayı tarayıcıda çalıştıran bir test yok.
- `testler/buton-denetimi.js` (sunucusuz) — `aktarim-yon`, `aktarim-tur`, `aktarim-sablon`, `aktarim-sec`, `aktarim-yukle`,
  `aktarim-uygula`, `aktarim-vazgec`, `aktarim-temizle`, `aktarim-mektup`, `aktarim-disa`, `metin-dosya-sec`, `metin-excel`,
  `islem-suz` eylemlerinin karşılığı; `aktarim` ve `islem-kaydi` sayfalarına menüden gidilmesi. `testler/yazim-denetimi.js`
  ve `testler/test-kucult.js` bütün parçalar gibi.
- Beslediği uçlar (sunucu tarafı, `testler/tumtest.sh` 3200'de açar):
  - `testler/test-aktarim.js` — 1) boş şablonlar, 2) üç sayfalı liste önizlemesi (hazır, hatalı satırlar, öğretmen sayfası,
    yeni sınıf), 3) uygulama (şifresi T.C. olanın listede şifresiz yazılması, T.C. ile giriş), 4) aynı T.C. yeniden:
    güncelleme (sınıf atlatma), 5) ODS, Windows-1254 CSV, TXT ve metinden Excel'e, 6) program içe aktarımı, 7) dışa aktarım,
    8) bozuk dosya ve sıkıştırma bombası, 9) yetki.
  - `testler/test-cakisma.js` (aynı liste aynı anda iki kez: çift hesap yok), `testler/test-yetiskin.js` (öğretmen sayfası
    "kodla eklenir"), `testler/yetki-denetimi.js` (rol × uç).
  - İşlem kaydı ucu: `testler/test-rol.js` (`?islem=okul.konum`), `testler/test-site-ayarlari.js` (site ayarları okulsuz,
    müdür görmez), `testler/test-yonetici-dosyasi.js`, `testler/test-giris-bilgisi.js`, `testler/test-ozellikler.js`,
    `testler/test-okul-disk.js`, `testler/test-okul-sayfasi.js`, `testler/test-servis-yoklama.js`,
    `testler/test-servis-konum.js` (servisçi giremez).
- Elle (3200): `testler/seed.js`'teki müdürle "Excel Aktarım" → "Şablonu indir" → iki öğrenci satırı doldur (birinin
  T.C.'sini bozuk yaz) → yükle → "Kontrol et": 1 açılacak, 1 hatalı → uygula → şifre tablosu; sayfayı yenilemeyi dene
  (tarayıcı sormalı); "Giriş kâğıtlarını yazdır". "Dışarı aktar"dan dört dosyayı indir. "Metinden Excel'e"ye iki isim yaz →
  `ogrenci-listesi.xlsx`. "İşlem Kaydı"nda "Excel ile toplu hesap açıldı" sekmesine bas.

## Son durum

- `git log`: 5 commit. Dosya 29 Ağustos'ta üç commit'le kuruldu:
  - `4bacc99 commit 91`: sabitler, `b64Indir`, `metinBase64`, `aktarimDurumu`, `SAYFALAR.aktarim`. Aynı commit'te
    `sunucu/bolumler/kisi-aktarim.js` (74 satır) ve `10a-giris-bilgisi.js`'e 17 satır eklendi.
  - `d891cc8 commit 92`: `raporKarti`, `sonucKarti`, `disaKarti`, `metinKarti`, `metinBagla` ve `metin-dosya-sec` /
    `metin-excel` eylemleri.
  - `0b3ea4b commit 93`: `aktarim-*` eylemleri, `aktarimIstegi`, `aktarimDosyaBagla`, `SAYFALAR['islem-kaydi']`. Aynı
    commit'te `18-aktarim-kvkk.css`'e aktarım kuralları eklendi.
- `0acca75 commit 516` (2026-09-27, kişi kodu): adım 1 metni "kodlarını" → "kişi kodlarını"; sonuç tablosunda veli kodu
  `kisiKoduBicim` ile 4'erli tireli ve `code.kisi-kodu.satir-ici` (eski `kodBicimle` yerine).
- Son değişiklik `7fda2ee commit 543` (2026-09-30, "bir kez gösterilen şifreler kayboluyordu" düzeltmesi): `aktarimSonucKorumasi`
  ve `aktarimSonucuBirakilabilir` eklendi; açılan hesap varsa `TEK_SEFER.aktarimSonucu` kurulur; başka tür seçmek ve yeni
  dosya seçmek önce sorar; "Tamam" korumayı siler; "Giriş kâğıtlarını yazdır" sonucu yazdırıldı işaretler.
- Bilinen açıklar (kod değiştirilmedi): "Liste kimlerin?" değişince eski raporun uygulanabilir kalması, yazdırma penceresi
  iptal edilse de "yazdırıldı" sayılması, dışarı aktarımın geniş verisi, İşlem Kaydı'nda okul sütununun olmaması ve
  sayfalamanın yokluğu, `.durum.guncel` renksizliği, boşaltılmayan dosya kutuları (aynı .txt'nin yeniden seçilememesi)
  (Dikkat).
- Planlı işlerden bu dosyaya dokunması beklenenler (`.claude/gelistirme/DEVAM.md` 4. bölüm):
  - "Tek kişi tek hesap + portallar öğrencide de" — Excel'de "Eşleyelim mi?": önizlemenin altında başka kurumda hesabı olan
    öğrenciler (T.C. + doğum tarihiyle eşleşme, kurum adı gösterilmeden), akıllı sütun tahmini ("Ad sütununda e-posta var
    → E-posta sütununa taşı?"), satır numaralı eşleşmeyenler; eşlenen öğrenci sonuç tablosunda ve giriş kâğıdında "mevcut
    hesabıyla girer" (şifresiz). `raporKarti` ve `sonucKarti` genişleyecek; servisçi de portal olacak.
  - "Çalışan olarak ekleme" — "Öğretmenler > Kodla ekle" "Çalışanlar → Kodla ekle" olacak (adım 1 metni).
  - "Yıl geçişi" — sınıf atlatma yeni yıl sihirbazına geçecek (önizleme + onay + çift doğrulama); "yıl sonunda sınıf
    atlatma" metni ve kişi listesini yeniden yükleme yolu gözden geçirilmeli.
  - "Optimizasyon + saklama süreleri" — işlem kaydı okul başına 2 yıl (sistem geneli 5000 sınırı kalkacak), "Başarısız giriş
    denemesi" satırları 90 gün: İşlem Kaydı sayfasında 300 sınırı ve sayfalama yeniden düşünülmeli.
  - "Özel roller" (öneri) — "Bilişim Teknolojileri Sorumlusu" ve "Okul Sekreteri / Memur" şablonları `aktarim.yap` alacak;
    dışarı aktarımın veli kodu ve kişisel veri içeriği o işte (ya da "KVKK ve onay metinleri TAM denetimi"nde) ele alınmalı.
  - "Sınav: … notları Excel'den yükleme/indirme + quiz sorularını Excel'den aktarma" (öneri) — tanım bunu sınavın kendi
    sayfasına koyuyor; "Excel Aktarım"a yeni tür eklenirse `AKTARIM_ADLARI` / `DISA_LISTE` buradan genişler.
  - "Sistem" (yeni işlem türleri: yeni cihaz, doğrulama uygulaması…) — İşlem Kaydı sekmelerinde kendiliğinden görünür (adları
    sunucudan gelir).
  - "Android yerel uygulama": aktarım uygulamaya gelmeyecek, yerine "Bu işlem sitede: Siteyi aç" satırı çıkacak. Müdürün
    "Diğer" menüsünde ise "İşlem kaydı (salt okunur)" olacak. Uygulama aynı `GET /api/islem-kaydi` cevabını okuyacağı için
    ucun alanları değişirse ikisi birlikte güncellenmeli.
  - "Çok dil" (bütün metinler), "Ekran turu + albüm" (aktarım görüntüleri baştan çekilecek).
