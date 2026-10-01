# public/js/parcalar/19-mesajlar.js

"Mesajlar" sayfasının ön yüzü: gelen kutusu ve gönderilenler, duyuru/kişisel süzgeci, mesajı okuma penceresi (ekler,
okundu listesi, düzeltme, silme), "Yeni mesaj" penceresi (kişi, sınıf, rol ya da bütün okul hedefi, duyuru, ek) ve
"Bana kim yazabilir?" ayarı.

## Bu dosya ne yapar?

Eğitim Evi'nde herkesin bir mesaj kutusu var. Öğretmen bir veliye yazar, müdür bütün okula "Yarın kar tatili"
duyurusu yapar, veli çocuğunun öğretmenine sorar. Bu dosya bunların ekranıdır; kim kime yazabilir, duyuruyu kim
yapabilir, öğrenciye giden mesajın velisine de düşmesi gibi kuralların hepsi sunucudadır
([../../../sunucu/bolumler/mesaj.md](../../../sunucu/bolumler/mesaj.md)).

Sayfada beş iş var:

1. **Kutu.** "Gelen kutusu" (okunmamış sayısı rozetle) ve "Gönderilenler" sekmeleri; altında Hepsi / Duyurular /
   Kişisel süzgeci; her mesaj bir satır: gönderen (ya da gönderilenlerde "Alıcı: 7-A, 7-B"), "Duyuru" rozeti, velide
   "Ayşe için", gönderilenlerde "12 / 28 okudu", tarih ("düzenlendi" notuyla), konu ve ilk satırlar. Okunmamış satır
   vurgulu.
2. **Okuma.** Satıra basınca pencere açılır: gönderen, rolü, tarih, metin, ekler; gönderen (duyuruda okulun müdürü de)
   kimin okuduğunu rol rol, arayarak görür. Gönderen "Düzelt" ve "Mesajı sil", alıcı "Kutumdan kaldır" görür.
3. **Düzeltme.** Gönderen konuyu ve metni düzeltir; alıcıya yeni bildirim gitmez, mesajda "düzenlendi" yazar.
4. **Yeni mesaj.** Kişileri arayıp seçme; toplu gönderme yetkisi varsa sınıflar ve rol grupları; `mesaj.herkese`
   varsa bütün okul; yetkisi varsa "Duyuru"; konu, metin (4000 harf sayaçlı), dosya ekleri.
5. **"Bana kim yazabilir?"** Öğrenci dışındaki herkes kendine kimin yazabileceğini seçer (herkes / yalnız öğretmen ve
   yöneticiler / kimse) ve engellediği kişileri görüp engeli kaldırır. Öğrencide bu kart yok (dosyadaki yorum: okulda
   herkes öğrenciye yazabilmeli; öğrencinin başka öğrenciye yazamaması zaten sunucuda sabit kural).

Kutunun düğmeleri (sekme, aç, yeni, gönder, sil, ayar) `25-tiklama.js`'teki `islem()`'de; düzeltme ve okundu listesinin
düğmeleri bu dosyanın `EYLEMLER`'inde. İkisi de aşağıda.

## İçinde neler var?

### Sabitler ve durum

- `MESAJ_KUTU_AD` — `{ gelen: 'Gelen kutusu', giden: 'Gönderilenler' }`. Hiçbir yerde kullanılmıyor (sekme adları
  `kutuDugme` çağrısında elle yazılı).
- `IZIN_AD` — ayar kartının seçenekleri: `herkes` "Okuldaki herkes yazabilir", `personel` "Yalnızca öğretmen ve
  yöneticiler yazabilir", `kapali` "Kimse yazamasın".
- `OKUMA_ROL_AD` — okundu listesindeki rol düğmeleri: `student` "Öğrenciler", `parent` "Veliler", `teacher`
  "Öğretmenler", `principal` "Yöneticiler".
- `okumaDurum` — açık okundu listesinin hâli: `{ veri, filtre: 'hepsi'|'okuyan'|'okumayan', rol, ara }`.
- `S` üzerinde ([00-durum.md](00-durum.md)): `S.mesajKutu` (`'gelen'`/`'giden'`), `S.mesajTur` (`''`, `'duyuru'`,
  `'mesaj'`), `S.mesajAyarGecici` (sunucudan gelen ayar: `{ kimden, engelli: [{ id, ad, rol }] }`), `S._acikMesaj` (açık
  pencerenin mesajı), `S.mesajHedef` (yeni mesaj penceresinin hedef listesi), `S.mesajSecili` (seçilen kişiler:
  kimlik → `true/false`).

### Kutu (`SAYFALAR.mesajlar`)

- Kutu ve tür boşsa `gelen` ve `''`. `GET /api/mesajlar?kutu=<kutu>[&tur=<tür>]` ile `GET /api/mesajlar/ayar` birlikte
  çağrılır.
- Başlık "MESAJLAR", alt yazı "Okul içi mesajlar ve duyurular.". Üst kart: `kutuDugme('gelen', 'Gelen kutusu',
  d.okunmamis)`, `kutuDugme('giden', 'Gönderilenler', 0)`, sağda "Yeni mesaj" (`mesaj-yeni`); altında
  `turDugme2('', 'Hepsi')`, `turDugme2('duyuru', 'Duyurular')`, `turDugme2('mesaj', 'Kişisel')`.
- Liste boşsa gelen kutusunda "Kutun boş. Sana bir mesaj geldiğinde burada görünür.", gönderilenlerde "Henüz mesaj
  göndermedin."; doluysa her mesaj için `mesajSatiri`.
- Öğrenci değilse "Bana kim yazabilir?" kartı: "Duyurular bu ayardan etkilenmez — okul duyuruları her hâlükârda
  ulaşır." ipucu; `name="mesajIzin"` üç seçenek (kayıtlı olan işaretli); engellenen varsa "Engellediklerin" başlığı
  altında ad, rol ve "Engeli kaldır" (`mesaj-engel-kaldir`, `data-id`); `#mesajAyarMesaj` ve "Ayarı kaydet"
  (`mesaj-ayar-kaydet`). Çizimden sonra `S.mesajAyarGecici = ayar` (öğrencide de).
- `kutuDugme(k, ad, rozet)` — `button.sekme[.secili]` (`data-act="mesaj-kutu" data-kutu`), rozet varsa
  `span.sekme-rozet`.
- `turDugme2(t, ad)` — `button.sekme.kucuk[.secili]` (`data-act="mesaj-tur" data-tur`).
- `mesajSatiri(m)` — `div.mesaj-satir[.yeni]` (`data-act="mesaj-ac" data-id`): `yeni` yalnız gelen kutusunda ve
  `m.okundu` değilse. Gelen kutusunda solda gönderenin avatarı (`avatar(gonderen, gonderenId, 'mesaj-avatar')`).
  Üst satır: gönderen ya da "Alıcı: <hedefOzet>", duyuruysa `span.duyuru-rozet` "Duyuru", velide `span.cocuk-not`
  "Ayşe, Can için", gönderilenlerde `kisiSayisi` varsa `span.okuma-rozet[.tam]` "12 / 28 okudu" (hepsi okuduysa yeşil),
  sağda `tarihSaat(m.tarih)` ve düzeltildiyse " · düzenlendi". Altında konu ve önizleme (sunucunun ilk 140 harfi).

### Okuma penceresi

- `mesajAc(id)` — `GET /api/mesajlar/<id>` (alıcı ilk kez açıyorsa sunucu okundu yazar). Pencere başlığı konu;
  gövde: avatar, gönderen adı ve rolü (`ROL_AD`), tarih ve varsa "düzenlendi <zaman>"; velide mavi bilgi "Bu mesaj
  çocuğun **Ayşe** için gönderildi."; metin (`esc` edilir, satır sonları `<br>` olur — HTML olarak yorumlanmaz);
  `ekListesiGoster(m.ekler)` ([04d-ekler.md](04d-ekler.md); "İndir" düğmeli ek listesi). `m.okumaGorur` ise
  `#okumaKap`: "**12 / 28** kişi okudu" ve doluluk çubuğu, altında "Yükleniyor...". Alt düğmeler: gönderense "Mesajı
  sil", değilse "Kutumdan kaldır" (ikisi de `mesaj-sil`); gönderense "Düzelt" (`mesaj-duzelt`); "Kapat". Açılınca
  `S._acikMesaj` yazılır, `bildirimleriYenile()` (zil sayısı düşsün) ve gerekiyorsa `okumaYukle(id)`. Hata tarayıcının
  uyarı kutusuyla.
- `okumaYukle(id)` — `GET /api/mesajlar/okuma?id=` → `okumaDurum`'u sıfırlar (`veri` = alıcılar) ve `okumaCiz()`;
  hata `.okuma-bilgi`'ye soluk yazı.
- `okumaCiz()` — `#okumaKap` yoksa çıkar. Alıcılar rollere sayılır; sırasıyla öğrenci, veli, öğretmen, müdür için
  (alıcısı olan) `button.okuma-rol[.secili]` "Öğrenciler **12/28**" (`data-act="okuma-rol" data-rol`). Sonra Hepsi /
  Okuyanlar / Okumayanlar sekmeleri (`okumaSekme`), "İsim ara" kutusu (`#okumaAra`) ve `#okumaListe`. Arama kutusu
  `okumaDurum.ara`'yı geri yükler ve her yazışta yalnız listeyi çizer.
- `okumaListeCiz()` — süzgeçler: seçili rol, okuyan/okumayan, arama (`nrm` ile şapkasız: ad + sınıf + çocuk adları).
  Sıra: önce okumayanlar, sonra Türkçe ada göre. Her satır `.alici-satir`: ad, yanında "Ayşe, Can velisi" ya da sınıf ya
  da rol adı; sağda okuma zamanı (`.okudu`) ya da "okumadı" (`.okumadi`). Boşsa "Bu seçimde kimse yok.".
- `okumaSekme(k, ad)` — `button.sekme.kucuk[.secili]` (`data-act="okuma-filtre" data-filtre`).
- `EYLEMLER['okuma-filtre']` — süzgeci değiştirir, `okumaCiz()`.
- `EYLEMLER['okuma-rol']` — aynı role ikinci basış süzgeci kaldırır; `okumaCiz()`.

### Düzeltme

- `EYLEMLER['mesaj-duzelt']` — `S._acikMesaj` yoksa çıkar. "Mesajı düzelt" penceresi: Konu (`#mdKonu`, 120), Mesaj
  (`#mdGovde`, 4000), ipucu "Alıcılara yeniden bildirim gitmez; mesajın altında "düzenlendi" ve saati görünür.",
  `#mdMesaj`; "Vazgeç" (`mesaj-ac` ile mesajı yeniden açar), "Kaydet" (`mesaj-duzelt-kaydet`). Metne odaklanır.
- `EYLEMLER['mesaj-duzelt-kaydet']` — boşlukları kırpar; konu boşsa "Konu yaz.", metin boşsa "Mesaj boş olamaz." (kutunun
  altında). Düğme "Kaydediliyor...", `POST /api/mesajlar/duzenle { id, konu, govde }`; başarıda mesaj yeniden açılır
  (yeni metinle) ve Mesajlar sayfasındaysan liste yenilenir; hata `#mdMesaj`'a.

### Yeni mesaj

- `mesajYeniModal()` — `GET /api/mesajlar/hedefler` → `S.mesajHedef`. Pencere:
  - `d.duyuruIzin` ise "Kişisel mesaj" (seçili) / "Duyuru (cevaplanmaz, herkese ulaşır)" (`name="mTur"`);
  - "Kime" (`#mHedefTur`): "Seçtiğim kişilere"; `d.topluIzin` ise "Sınıflara" ve "Rol grubuna"; `d.okulIzin` ise "Tüm
    okula";
  - kişi paneli (`#mHedefKisi`): "Kişi ara" (`#mKisiAra`) ve seçim kutusu (`#mKisiKutu`);
  - sınıf paneli (`#mHedefSinif`): her sınıf bir onay kutusu (`.mSinif`) "7-A (28 öğrenci)";
  - rol paneli (`#mHedefRol`): Öğrenciler, Veliler, Öğretmenler (`.mRol`);
  - okul paneli (`#mHedefOkul`): "Mesaj okuldaki herkese gidecek.";
  - Konu (`#mKonu`, 120, "Kısa bir başlık"), Mesaj (`#mGovde`, 4000, "Yazmak istediklerin") ve sayaç "0 / 4000";
  - `ekAlani('mesaj', 'mesaj')` ([04d-ekler.md](04d-ekler.md): sürükle-bırak, hemen yükleme, 50 MB) ve `#mMesaj`;
  - "Vazgeç" / "Gönder" (`mesaj-gonder`). Ardından `mesajModalBagla()` ve `ekAlaniKur('mesaj')`. Hata uyarı kutusuyla.
- `mesajModalBagla()` — kişi listesini çizer ve olayları bağlar. Kişiler `toLocaleLowerCase('tr')` ile adın içinde
  aranır, en çok 60'ı gösterilir; her kişi `label.onay[.pasif]` + `input.mKisi` (seçiliyse işaretli, `kapali` ise
  kapalı): ad, rol, öğretmense branş, `kapali` ise "· mesaj almıyor". Eşleşen yoksa "Eşleşen kişi yok.". Seçimler yerel
  bir `secili` haritasında tutulur (`S.mesajSecili` aynı nesne): aramayla gizlenen kişi seçili kalır. "Kime"
  değişince yalnız ilgili panel görünür; metin kutusuna yazdıkça sayaç güncellenir.
- `mesajGonderIslemi(btn)` — hedef: kişide seçili kimlikler, sınıfta `secililer('.mSinif')`, rolde
  `secililer('.mRol')`, okulda yalnız `{ tur: 'okul' }`. Tür seçimi yoksa `mesaj`. Dosya yükleniyorsa (`ekYukleniyor`)
  "Dosyalar yükleniyor; bitince gönder." uyarısı. Düğme kapanır; `POST /api/mesajlar { tur, konu, govde, hedef, ekIdler }`.
  Başarıda pencere kapanır, sayfa yenilenir, üstte sunucunun iletisi ("Mesaj gönderildi — 3 kişiye ulaştı. 1 kişi
  mesaj almayı kapatmış."), zil yenilenir; hatada düğme açılır, ileti `#mMesaj`'a.
- `secililer(secici)` — işaretli kutuların değerleri. `19b-anketler.js` de kullanır.

### Kutunun düğmeleri (`25-tiklama.js` → `islem()`)

- `mesaj-kutu` / `mesaj-tur` — `S.mesajKutu` / `S.mesajTur` yazılır, `git('mesajlar')`.
- `mesaj-ac` — `mesajAc(data-id)`; `mesaj-yeni` — `mesajYeniModal()`; `mesaj-gonder` — `mesajGonderIslemi(düğme)`.
- `mesaj-sil` — onay metni kutuya göre: gönderilenlerde "Mesaj tüm alıcılardan silinsin mi?", gelende "Mesaj kutundan
  kaldırılsın mı?"; `POST /api/mesajlar/sil { id }` → pencere kapanır, sayfa yenilenir, zil yenilenir.
- `mesaj-engel-kaldir` — `S.mesajAyarGecici.engelli`'den o kişi çıkarılır; `POST /api/mesajlar/ayar { kimden: <kayıtlı
  ayar>, engelli: <kalanlar> }` → sayfa yenilenir.
- `mesaj-ayar-kaydet` — seçili radyo (yoksa `herkes`) ve bugünkü engel listesiyle `POST /api/mesajlar/ayar`; "Ayar
  kaydedildi." (`#mesajAyarMesaj`).

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Çağırdıkları:
  - `S` ([00-durum.md](00-durum.md)); `$`, `esc`, `api`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md));
    `avatar`, `tarihSaat`, `nrm`, `ROL_AD` ([02-ikonlar.md](02-ikonlar.md)); `modalAc`, `modalKapat`, `mesajGoster`,
    `sayfaMesaji` ([03-mesaj-modal.md](03-mesaj-modal.md)); `ekAlani`, `ekAlaniKur`, `ekIdleri`, `ekYukleniyor`, `ekListesiGoster`
    ([04d-ekler.md](04d-ekler.md)); `alanHatasi` ([04a-form-alanlari.md](04a-form-alanlari.md)); `dugmeBekle`,
    `dugmeBitir` ([05-giris.md](05-giris.md)); `hero`, `yaz`, `git`, `bosKutu` ([07-yonlendirme.md](07-yonlendirme.md));
    `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md));
  - `bildirimleriYenile` (`24-bildirim-arama-mobil.js`), `hataGoster` (`25-tiklama.js`).
- Sunucu uçları ([../../../sunucu/bolumler/mesaj.md](../../../sunucu/bolumler/mesaj.md)):
  - `GET /api/mesajlar?kutu=&tur=` → `{ kutu, okunmamis, mesajlar }` (en yeni 200; okundu sayıları yalnız
    gönderilenlerde).
  - `GET /api/mesajlar/<id>` → `{ mesaj: { …, govde, ekler, okumaGorur?, kisiSayisi?, okuyanSayisi? } }`; alıcı ya da
    gönderen değilsen 403.
  - `GET /api/mesajlar/okuma?id=` → `{ alicilar: [{ ad, rol, sinif, cocuklar, okuma }] }` — gönderen, duyuruda okulun
    müdürü.
  - `POST /api/mesajlar/duzenle`, `POST /api/mesajlar/sil` (gönderen bütünüyle siler, alıcı kendi kutusundan kaldırır).
  - `GET /api/mesajlar/hedefler` → `{ kisiler: [{ id, ad, rol, brans, kapali }], topluIzin, okulIzin, duyuruIzin,
    siniflar }` — öğrenci ve veli yalnız (çocuğunun) öğretmenlerini ve müdürü görür.
  - `POST /api/mesajlar` — hız sınırı saatte 30; duyuru `mesaj.toplu` ister; sınıf/rol `mesaj.toplu`, bütün okul
    `mesaj.herkese`; ekler `ekleriDogrula`'dan geçer ([../../../sunucu/bolumler/ekler.md](../../../sunucu/bolumler/ekler.md));
    öğrenciye gidenin velisine de kopya gider.
  - `GET` / `POST /api/mesajlar/ayar` — kendi "kimden" ayarı ve engel listesi.
  - Ekler: `POST /api/ek/yukle?tur=mesaj`, `POST /api/ek/sil` (yüklenen taslağı kaldırma), `GET /api/ek/bilet` (indirme)
    — hepsi [04d-ekler.md](04d-ekler.md) üzerinden.
  - Sunucudaki `GET /api/mesajlar/duyurular` (son 5 duyuru) ön yüzde hiçbir yerden çağrılmıyor.
- Onu kullananlar:
  - `25-tiklama.js` — `mesajAc`, `mesajYeniModal`, `mesajGonderIslemi`, `S.mesajKutu`, `S.mesajTur`,
    `S.mesajAyarGecici` (düğmeler yukarıda).
  - `19b-anketler.js` — `secililer` (anket hedefi).
  - `26-baslat.js` — çıkışta ve portal değişiminde (`oturumDurumunuSifirla`) `S._acikMesaj`'ı sıfırlar (`S.mesajKutu`,
    `S.mesajTur`, `S.mesajHedef`, `S.mesajSecili`, `S.mesajAyarGecici`'ye ve `okumaDurum`'a dokunmaz).
  - Menü ([06-menu.md](06-menu.md)): öğrenci, veli, öğretmen, müdür ve servisçi menüsünde "Mesajlar"; velinin ana
    sayfasında "Mesajlar — Öğretmenlerle yazışma" kutucuğu ([08-ana-sayfa.md](08-ana-sayfa.md)). Bildirimler
    `#/mesajlar`'a bağlanır. Mesajlar okulun kapatabileceği bir bölüm değildir.
- CSS: `public/css/parcalar/19-mesajlar.css` — `.sekme-satir`, `.sekme` (`.secili`, `.kucuk`), `.sekme-rozet`,
  `.mesaj-satir` (`.yeni` vurgulu), `.mesaj-govde-kutu`, `.mesaj-avatar`, `.mesaj-ust`, `.mesaj-kim`, `.mesaj-tarih`,
  `.mesaj-konu`, `.mesaj-onizleme`, `.duyuru-rozet`, `.cocuk-not`, `.okuma-rozet` (`.tam`), `.mesaj-detay-ust`,
  `.mesaj-kimden`, `.mesaj-govde`, `.mesaj-alicilar.okuma-bolum`, `.okuma-ozet`, `.okuma-roller`, `.okuma-rol`
  (`.secili`), `.okuma-arac`, `.okuma-liste`, `.alici-satir` (`.okudu` yeşil, `.okumadi` soluk), `.secim-kutu`,
  `.onay.pasif`; `05-tablo-grafik.css` — `.cubuk`; `16-giris-sekme.css` — `.onay`, `.secenekler`; ek kutusu
  `02-form.css`.
- Rol: kutu ve okuma — herkes (öğrenci, veli, öğretmen, müdür, servisçi); "Bana kim yazabilir?" — öğrenci dışındakiler;
  toplu (sınıf/rol) ve duyuru — `mesaj.toplu` (müdürde her zaman); bütün okul — `mesaj.herkese`; okundu listesi —
  gönderen, duyuruda okulun müdürü.

## Nasıl çalışır (adım adım)?

```
Mesajlar ─► GET /api/mesajlar?kutu=gelen  +  GET /api/mesajlar/ayar
   [Gelen kutusu 3] [Gönderilenler]                 [Yeni mesaj]
   [Hepsi] [Duyurular] [Kişisel]
   ● Ayşe Öğretmen · Duyuru · 12.10.2026 09:14   Gezi izni / "Velilerimiz…"
   (öğrenci değilse) Bana kim yazabilir? ( ) herkes ( ) personel ( ) kimse + engeller

satıra bas ─► mesaj-ac ─► mesajAc ─► GET /api/mesajlar/<id> (okundu yazılır) ─► pencere
   gönderense: okumaYukle ─► GET okuma?id ─► [Öğrenciler 12/28][Veliler 20/30]  Hepsi|Okuyanlar|Okumayanlar  [ara]
   Düzelt ─► mesaj-duzelt ─► Kaydet ─► POST duzenle ─► mesajAc (yeni metin) ─► liste yenilenir
   Mesajı sil / Kutumdan kaldır ─► onay ─► POST sil ─► pencere kapanır, liste ve zil yenilenir

Yeni mesaj ─► GET hedefler ─► pencere (Kime: kişi | sınıf | rol | okul; Duyuru?; ekler)
   Gönder ─► ek yükleniyor mu? ─► POST /api/mesajlar {tur, konu, govde, hedef, ekIdler}
          ─► "Mesaj gönderildi — 3 kişiye ulaştı." ─► liste + zil
```

## Dikkat!

- **Engel listesine ekleme yolu yok.** Kart "Engellediklerin" listesini gösterir ve "Engeli kaldır" düğmesi verir, ama
  ön yüzün hiçbir yerinde birini engelleme düğmesi yok (grep: `engel` geçen tek ekran burası). Liste ancak doğrudan API'yle
  (`POST /api/mesajlar/ayar { engelli: [...] }`) dolar; kullanıcı için bugün yalnız küçülebilir.
- **"Engeli kaldır" kaydedilmemiş seçimi siler.** Bu düğme `kimden` olarak sayfa açıldığındaki kayıtlı değeri gönderir
  ve sayfayı yeniden çizer; kişi radyo düğmesini değiştirip "Ayarı kaydet"e basmadan engel kaldırırsa yeni seçimi
  kaybolur.
- **Açılan mesaj listede "yeni" kalır.** Sunucu okundu yazar ve zil sayısı yenilenir, ama pencere kapanınca liste
  yeniden çizilmez: satır vurgulu, "Gelen kutusu" rozeti eski sayıda kalır; sekme değiştirince ya da yenileyince
  düzelir.
- **Üstteki arama kutusu mesajları süzmez.** Satırlarda `data-ara` yok, sayfa kendi arama kancasını (`S.araHook`) da
  kurmuyor.
- **Kişi araması şapkaya duyarlı.** Yeni mesaj penceresindeki arama `toLocaleLowerCase('tr')` ile düz alt dize arar:
  "ayse" ya da "ozturk" yazan "Ayşe"yi, "Öztürk"ü bulmaz. (Okundu listesindeki arama `nrm` ile, etüt penceresi
  `aramaSadeTR` ile şapkasız yazanı da bulur.) Yalnız ad aranır, branş aranmaz. En çok 60 kişi gösterilir; fazlası için
  ipucu yok, aramayı daraltmak gerekir. Aramayla gizlenen seçili kişiler gönderilir ama kaç kişinin seçili olduğu
  ekranda yazmaz.
- **Servisçiye "Yeni mesaj" görünür ama yazacağı kimse yoktur.** Sunucu servisçiye kişi listesi ve toplu izin vermez
  (`testler/test-servis-konum.js`); pencerede "Eşleşen kişi yok." çıkar, "Gönder" (konu ve metin yazılmışsa) "En az bir
  kişi seç." hatasını alır.
- **İstemci denetimi yok.** Boş konu/metin, seçimsiz sınıf/rol sunucudan Türkçe hatayla döner. Sunucunun saatte 30
  mesaj sınırı hatalı denemeleri de sayar.
- **Rol grubunda "Yöneticiler" seçeneği yok.** Sunucu rol hedefinde müdürleri (`principal`) de kabul eder; pencere
  yalnız öğrenci, veli, öğretmen gösterir.
- **Öğrencide ayar boşuna çekilir.** Öğrenciye "Bana kim yazabilir?" kartı gösterilmediği hâlde sayfa her açılışta
  `GET /api/mesajlar/ayar`'ı da çağırır.
- **Kutu seçimi çıkışta unutulmaz.** `S.mesajKutu` ve `S.mesajTur` çıkışta ve portal değişiminde sıfırlanmaz; aynı
  sekmede giren sonraki kişi sayfayı "Gönderilenler" ya da "Duyurular" süzgeciyle açabilir (veriler kendi hesabınındır;
  yalnız görünüm). Öbür durum değişkenleri (`S.mesajHedef`, `S.mesajAyarGecici`, `okumaDurum`) da bellekte kalır ama her
  pencere ve sayfa açılışında yeniden yazıldıkları için ekrana eski veri gelmez.
- **Metin düz yazıdır.** `esc` + satır sonu → `<br>`; HTML ya da bağlantı yorumlanmaz. "Düzenleyiciler" işi bunu
  değiştirecek (aşağıda).
- **Gönderdikten sonra kutu değişmez.** Yeni mesaj gönderilince sayfa aynı kutuyla yeniden açılır; gelen kutusundaysan
  gönderdiğin mesaj ancak "Gönderilenler"de görünür.
- **Silme onayı açık kutuya bakar, gönderene değil.** `mesaj-sil`'in onay metni `S.mesajKutu`'ya göre seçilir; pencerenin
  düğmesi ise gönderene göre ("Mesajı sil" / "Kutumdan kaldır"). Çoğu zaman ikisi örtüşür, ama örtüşmeyen bir durum var:
  çocuğu bağlı olan öğretmen ya da müdür, alıcıları arasında kendi çocuğu olan bir mesaj gönderince (çocuğu tek başına
  seçerek, sınıfına, "Öğrenciler" rol grubuna ya da bütün okula) sunucu öğrenciye giden kopyayı velisine de koyar ve
  gönderenin kendisini bu veli kopyasından ayıklamaz
  ([../../../sunucu/bolumler/mesaj.md](../../../sunucu/bolumler/mesaj.md) `mesajAlicilariCoz`). Mesaj böylece gönderenin
  kendi "Gelen kutusu"na da düşer ("<çocuk> için" notuyla; zile kendi bildirimi de gelir). Oradan açıp "Mesajı sil"e
  basan gönderen "Mesaj kutundan kaldırılsın mı?" onayını görür, ama sunucu mesajı BÜTÜN alıcılardan siler. Kod
  okumasına göre; denenmedi. (Anketler aynı çözücüyü kullanır ama açanı hedeften ayıklar.)
- Ölü sabit: `MESAJ_KUTU_AD` kullanılmıyor.

## Testleri

- Bu dosyanın tarayıcıda çalışan bir testi yok. Sunucu tarafı:
  - `testler/test-mesaj.js` — hedefler (öğrencinin görebildikleri), kişiye mesaj, veli kopyası, okundu işareti, yetkisiz
    hedef, izin ayarı (`personel`), engel listesi, duyurunun ayarları aşması, sınıfa duyuru, uzun metin, silme
    (gönderen/alıcı).
  - `testler/test-etut.js` bölüm 5 — mesaj düzeltme (alıcı düzeltemez, gönderen düzeltir, alıcı yeni metni görür, boş
    konu 400).
  - `testler/test-anket.js` — `?kutu=giden` ve `okuma?id=` (duyurunun okundu bilgisi).
  - `testler/test-yorum-ek.js` — ekli mesaj (başkasının ekiyle gönderilemez, alıcı eki görür, toplam sınırı).
  - `testler/test-servis-konum.js` — servisçinin hedef listesi boş, toplu izni yok.
  - `testler/yetki-denetimi.js` (hedef listesini beş rol de alır; bütün okula duyuruyu yalnız müdür yapar) ve
    `testler/girdi-denetimi.js` (mesaj konusuna bozuk/kötü niyetli girdi).
- `testler/buton-denetimi.js` — `mesaj-kutu`, `mesaj-tur`, `mesaj-ac`, `mesaj-yeni`, `mesaj-gonder`, `mesaj-sil`,
  `mesaj-engel-kaldir`, `mesaj-ayar-kaydet` (`25-tiklama.js`) ile `mesaj-duzelt`, `mesaj-duzelt-kaydet`, `okuma-filtre`,
  `okuma-rol` (`EYLEMLER`) karşılıkları ve `/api/mesajlar` yolu.
- `testler/yazim-denetimi.js`, `testler/test-kucult.js` — ekran metinleri ve birleşik paketin derlenmesi.
- `araclar/gezinti.js` ekran turu (test değil) kutu, gönderilenlerdeki okundu sayıları, duyuru okundu bilgisi, yeni
  mesaj/duyuru penceresi, düzeltme penceresi, "düzenlendi" yazan mesaj, ekli mesaj ve ek kutusuna dosya bırakma
  görüntülerini alır.
- Elle: `testler/seed.js`'teki öğretmenle gir → Mesajlar → "Yeni mesaj" → bir öğrenciyi ara ve seç → konu, metin →
  Gönder: "Mesaj gönderildi — 1 kişiye ulaştı." (öğrencinin bağlı velisi varsa o da sayılır; `seed.js` veli kurmaz).
  Öğretmen "Gönderilenler"de "0 / 1 okudu" görür. Öğrenciyle gir: gelen kutusunda satır vurgulu; açınca zil sayısı
  düşer. Öğretmen sayfayı yenileyince "1 / 1 okudu"; mesajı açıp "Okuyanlar"da öğrenciyi ve okuma saatini görür;
  "Düzelt"le metni değiştirir, öğrencinin penceresinde "düzenlendi <zaman>" yazar.

## Son durum

- `git log`: 4 commit. Son değişiklik `dea6f4b commit 372` (2026-09-26): `okumaSekme` eklendi (okundu listesindeki
  Hepsi / Okuyanlar / Okumayanlar sekmeleri); ondan önceki hâlde `okumaCiz` bu işlevi çağırıyordu ama tanımlı değildi.
  Aynı commit `19b-anketler.js`, `14-odev-filtre.js` ve `23-veli-ayarlar.js`'e de eksik parçalar ekledi.
- `d49d136 commit 350` (2026-09-26; 63 satır): `okumaCiz`, `okumaListeCiz`, `okuma-filtre`, `okuma-rol` — okundu
  listesinin kendisi (rol düğmeleri, süzgeç, arama); ondan önce `okumaYukle` `okumaCiz`'i çağırıyordu ama yoktu.
- `f546949 commit 106` (2026-08-29; 169 satır): düzeltmeyi kaydetme, okundu durumu ve `okumaYukle`, yeni mesaj
  penceresi, gönderme, `secililer`; aynı commit `19-mesajlar.css`'i getirdi. Dosyanın ilk hâli `a6665fb commit 105`
  (2026-08-29; 169 satır): kutu, satır, okuma penceresi, düzeltme penceresi; aynı commit `03-mesaj-modal.js`'e
  `sayfaMesaji`'yı, `sunucu/bolumler/mesaj.js`'e de `module.exports` bloğunu ekledi.
- Commit geçmişi özelliklerin gerçek sırasını göstermiyor: 105 ve 106 ek alanı çağrılarını (`ekAlani`,
  `ekListesiGoster`…) da içeriyor, oysa bunları tanımlayan `04d-ekler.js` ilk kez `c08ff52 commit 416`'da geldi.
- Bilinen açıklar (kod değiştirilmedi): engel ekleme yolunun olmaması, "Engeli kaldır"ın kaydedilmemiş seçimi silmesi,
  açılan mesajın listede "yeni" kalması, şapkaya duyarlı kişi araması, servisçide boş "Yeni mesaj", çocuğu alıcılar
  arasında olan gönderenin kendi gelen kutusuna düşen kopyada silme onayının yanıltması, ölü `MESAJ_KUTU_AD`.
- Planlı işlerden bu dosyaya dokunacak olanlar:
  - "Mesaj ayarları (çark), Bu mesajı bildir, Ajanda…": Mesajlar sayfasının sağ üstüne yalnız müdür ve "Herkese mesaj"
    yetkilisine ÇARK (öğrenciler ve veliler kime yazabilir, günlük mesaj sınırı, mesaja dosya ekleyebilenler — öğrenci
    varsayılan kapalı, veli açık; ek kutusu role göre gizlenecek —, sessiz saatler); alınan her mesajda "Bildir";
    duyuru ve toplu mesaj yazarken "Alıcıların ajandasına ekle" ve "Hatırlatıcı kur".
  - "Mesaj etiketleri" (Şikâyet, Önemli, Durum): yazarken etiket seçimi, listede renkli rozet, gelen kutusunda etikete
    göre süzgeç; "Şikâyet" etiketli mesaj okul yönetimine gider, Gönderildi → Bakıldı → Çözüldü durumu ve silinme
    kuralları.
  - "Düzenleyiciler" (onaylı): mesaj ve duyuru metni için ortak yazı düzenleyici, hazır mesaj şablonları (`{öğrenci}`,
    `{sınıf}`) ve ileri tarihli gönderim.
  - "Anket düzenleyici": anketin mesaja ek olarak konması. "Optimizasyon + saklama süreleri": mesajlar ve duyurular
    1 yıl sonra silinecek. "Çalışan olarak ekleme": rolsüz çalışan Mesajlar'dan yönetime yazabilecek.
