# public/js/parcalar/18b-etut.js

Etütlerin ön yüzü: personelin "Etütler" listesi, etüt açma/düzenleme/silme, etüdün öğrencilerini seçme, bir etüt
gününün yoklaması (geldi / izinli / izinsiz) ve öğrencinin ("Etütlerim") ya da velinin ("Etütler") etüt dökümü.

## Bu dosya ne yapar?

Etüt, ders saatleri dışında haftanın belli bir gününde yapılan çalışmadır: "Salı 15:40–16:20, 8. sınıf Matematik
etüdü, Kütüphane, 12 öğrenci". Okulda bunu üç tür kişi yönetir (kurallar sunucuda,
[../../../sunucu/bolumler/etut.md](../../../sunucu/bolumler/etut.md)):

- `etut.yonet` yetkilisi (müdür her zaman; "Müdür Yardımcısı" ve "Etüt Sorumlusu" şablonları) etüt açar, gününü,
  saatini, yerini ve öğretmenini yazar, öğrencilerini seçer, siler; her etüdün bugünkü ve geçmiş etüt günlerinin
  yoklamasını alır ya da düzeltir (ileri tarih ve etüdün günü olmayan tarih herkese kapalı);
- `etut.yoklama` yetkilisi ("Nöbetçi Öğretmen" şablonu) bütün etütlerde, geçmiş günler dahil yoklama alır;
- etüdün kendi öğretmeni yalnız KENDİ etüdünde, yalnız etüt GÜNÜ ve başlangıçtan en erken 15 dakika önce yoklama alır.

Bu dosya bu kişilerin ekranlarını çizer ve "ne yapabilirsin" sorusunu sunucunun cevabına bırakır: liste ucu her etüt
için `yoklamaAlabilir`, sayfa için `yonetebilir` söyler; yoklama ucu da o tarihte kaydetmeyi neyin engelleyeceğini
(`engel`) söyler, ekran düğmeleri buna göre açar ya da kilitler (dosya başı yorumu: "burada yalnızca izin verilen
düğmeler gösterilir").

Öğrenci "Etütlerim"de hangi etütlere kayıtlı olduğunu ve gelmediği günleri görür; veli "Etütler"de her çocuğu için aynı
kartı görür.

## İçinde neler var?

### Durum ve sabitler

- `ETUT` — `{ liste, yonetebilir, bugun, adaylar, secili }`: son çekilen etüt listesi, sayfanın `yonetebilir`'i,
  sunucunun bugünü (`YYYY-AA-GG`), etüt penceresi için aday listesi önbelleği ve açık yoklama
  (`{ id, tarih, durumlar: { öğrenciId: durum } }`). Çıkışta ve portal değişiminde `26-baslat.js`'in
  `oturumDurumunuSifirla`'sı (portal değişiminde `08c-kisilikler.js` `oturumuDegistir` çağırır) bunu baştan kurar.
- `GUN_ADLARI_TAM` — `['', 'Pazartesi', …, 'Pazar']` (1 = Pazartesi … 7 = Pazar; sunucunun gün numarasıyla aynı).
- `ETUT_DURUMLAR` — yoklama düğmeleri: `var` "Geldi", `izinli` "İzinli", `yok` "İzinsiz".
- `ETUT_DURUM_AD` — dökümdeki etiketler: `var` "Geldi", `izinli` "Gelmedi (izinli)", `yok` "Gelmedi (izinsiz)".

### Küçük yardımcılar

- `tarihYazisi(t)` — `'2026-09-29'` → `'29.09.2026'`; boşsa `''`.
- `etutSonTarihi(gun, bugun)` — bugünden geriye, etüdün haftanın gününe denk gelen ilk tarih (bugün de olabilir). Yerel
  tarih parçalarıyla hesaplar, saat dilimi kaymaz.
- `tarihEkle(t, gun)` — tarihe gün ekler/çıkarır (`'2026-09-29'`, `-7` → `'2026-09-22'`). (Sunucudaki
  `sunucu/bolumler/takvim.js`'te aynı adlı ama başka iş yapan bir işlev var; ikisi ayrı dünyalarda, karışmaz.)
- `etutSaati(e)` — "Salı 15:40–16:20 · Kütüphane" (yer yoksa son parça yok).
- `etutBul(id)` — `ETUT.liste`'den etüt.
- `etutAdaylari()` — `GET /api/etut/adaylar` (`{ ogretmenler, siniflar, ogrenciler }`); ilk çağrıda çekip
  `ETUT.adaylar`'a koyar, sonra hep oradan döner.

### Personel: "Etütler" (`SAYFALAR.etutler`)

- `GET /api/etut` → `ETUT.liste`, `ETUT.yonetebilir`, `ETUT.bugun`. Başlık "ETÜTLER"; alt yazı yetkiliye "Etüt aç,
  öğretmenini ve öğrencilerini seç; yoklamaları buradan alınır.", öbürlerine "Sana verilen etütler. Yoklamayı etüt
  günü alırsın.".
- Yetkiliye üstte "Yeni etüt — Gün, saat ve yer; sonra öğretmenini ve öğrencilerini seç." kartı ve "Etüt aç"
  (`etut-yeni`).
- Etüt yoksa boş kutu: "Henüz etüt yok." (yetkili) / "Sana verilmiş bir etüt yok.".
- Her etüt bir satır (`data-ara` = ad + öğretmen + gün: üstteki arama kutusu bu satırları süzer): ad, `etutSaati`,
  öğretmen adı (yoksa "Öğretmen seçilmedi") ve "12 öğrenci". Sağda `yoklamaAlabilir` ise "Yoklama"
  (`etut-yoklama-ac`); yetkiliyse "Öğrenciler" (`etut-ogrenciler`), "Düzenle" (`etut-duzenle`), "Sil" (`etut-sil`,
  `data-ad`).

### Etüt aç / düzenle

- `etutModal(e)` — önce `etutAdaylari()`; sonra "Yeni etüt" ya da "Etüdü düzenle" penceresi: Adı (`#etAd`, 80 harf,
  "ör. 8. sınıf Matematik etüdü"), Gün (`#etGun`, Pazartesi…Pazar), Yer (`#etYer`, isteğe bağlı, 60 harf), Başlangıç ve
  Bitiş (`#etBas`, `#etBit`; yeni etütte 15:40 ve 16:20), Öğretmeni (`#etOgretmen`; ilk seçenek "— sonra seçerim —",
  sonra okulun onaylı öğretmen ve müdürleri) ve "Etüdün öğretmeni kendi etüdünde, etüt günü yoklama alır." ipucu. Kaydet
  düğmesi `etut-kaydet`, `data-id` düzenlenen etüdün kimliği (yeni etütte boş). Açılınca ad kutusuna odaklanır.
- `EYLEMLER['etut-yeni']` / `EYLEMLER['etut-duzenle']` — `etutModal(null)` / `etutModal(etutBul(id))`; hata
  tarayıcının uyarı kutusuyla.
- `EYLEMLER['etut-kaydet']` — önce form hataları silinir; istemci denetimi: ad boş → "Etüdün adını yaz.", başlangıç
  yok → "Başlangıç saatini seç.", bitiş yok → "Bitiş saatini seç.", bitiş başlangıçtan önce ya da eşit → "Bitiş
  başlangıçtan sonra olmalı." (kutunun altında kırmızı; ilk hatalı kutuya kaydırır). Sonra düğme "Kaydediliyor..." ve
  `POST /api/etut/kaydet { id?, ad, gun, baslangic, bitis, yer, ogretmenId }`. Başarıda pencere kapanır, liste yeniden
  açılır, üstte "Etüt kaydedildi."; hatada düğme geri gelir, ileti pencerede (`#etMesaj`; ör. "Bir etüt 6 saatten uzun
  olamaz.").
- `EYLEMLER['etut-sil']` — onay: "<ad> silinsin mi? Yoklamaları da silinir."; `POST /api/etut/sil { id, onay: true }`;
  liste yeniden açılır, üstte sunucunun iletisi ("…" etüdü silindi; yoklamaları da silindi.).

### Öğrenci seçimi

- `EYLEMLER['etut-ogrenciler']` — `etutAdaylari()` ile `GET /api/etut/detay?id=` birlikte; pencere başlığı "<etüt> —
  öğrenciler". İçinde Sınıf süzgeci (`#etoSinif`, "Bütün sınıflar" + okulun sınıfları), ad araması (`#etoAra`),
  "Görünenleri seç" / "Görünenleri kaldır" (`etut-gorunenleri-sec`, `data-deger` 1/0), seçili sayısı (`#etoSayi`, "12
  öğrenci seçili") ve okulun bütün onaylı öğrencileri: her biri bir onay kutusu (`.etut-ogr-kutu`), adının yanında
  soluk sınıf adı; etüde kayıtlı olanlar işaretli. Okulda öğrenci yoksa "Okulda öğrenci yok.". Süzme tarayıcıda:
  sınıf eşleşmeli ve `aramaSadeTR` ile sadeleştirilmiş ad aranan metni içermeli (şapkasız/noktasız yazan da bulur);
  uymayan satır `hidden` olur.
- `etutSeciliSay()` — işaretli kutu sayısını `#etoSayi`'ya yazar (her değişiklikte).
- `EYLEMLER['etut-gorunenleri-sec']` — yalnız GÖRÜNEN satırları işaretler ya da işaretini kaldırır.
- `EYLEMLER['etut-ogrenci-kaydet']` — işaretli bütün kutular (gizli kalanlar dahil) `ogrenciIdler` olur;
  `POST /api/etut/ogrenciler { id, ogrenciIdler }` (sunucu listeyi bütünüyle yeniden yazar). Başarıda pencere kapanır,
  liste açılır, "12 öğrenci kaydedildi."; hata pencerede (`#etoMesaj`).

### Yoklama (`SAYFALAR['etut-yoklama']`)

- `EYLEMLER['etut-yoklama-ac']` — `ETUT.secili = { id, tarih: etutSonTarihi(etüdün günü, ETUT.bugun) }`,
  `git('etut-yoklama')`. Yani "Yoklama" etüt günüyse bugünü, değilse en yakın geçmiş etüt gününü (1–6 gün önce; ör.
  Pazartesi etüdünde Çarşamba basılınca iki gün önceki Pazartesi) açar.
- `SAYFALAR['etut-yoklama']()` — `ETUT.secili` yoksa (ör. sayfa tarayıcıdan yenilendi) "Etütler"e döner.
  `GET /api/etut/yoklama?id=&tarih=` → `ETUT.secili.tarih` sunucunun tarihi, `ETUT.secili.durumlar` her öğrencinin
  durumu (henüz alınmadıysa `''`). Başlık etüdün adı Türkçe büyük harfle ("8. SINIF MATEMATİK ETÜDÜ"), alt yazı
  `etutSaati`. Tarih kartı: önceki hafta (`etut-hafta`, `data-yon="-7"`), "29.09.2026 / Salı", sonraki hafta
  (`data-yon="7"`, ok aynalanmış), "Etütlere dön" (`etutler-don`); `engel` varsa altında mavi bilgi kutusu (ör. "Yoklama
  etüt başlamadan en erken 15 dakika önce açılır (15:40)."). Öğrenci yoksa "Bu etüde henüz öğrenci eklenmedi.".
  Varsa: kilitli değilse "Hepsi geldi" (`etut-hepsi-geldi`); her öğrenci için ad, sınıf (yoksa "sınıfsız") ve üç düğme
  (`button.durum-dugme.<durum>`, `data-act="etut-durum" data-id=<öğrenci> data-durum`); kilitliyse düğmeler `disabled`.
  En altta kilitli değilse "Yoklamayı kaydet" (`etut-yoklama-kaydet`) ve ileti yeri `#etyMesaj`.
- `EYLEMLER['etutler-don']` — `git('etutler')`.
- `EYLEMLER['etut-hafta']` — tarihi ±7 gün kaydırır; yeni tarih `ETUT.bugun`'dan sonraysa üstte "İleri bir tarihe
  yoklama alınmaz." der ve kaydırmaz; değilse sayfa işlevini doğrudan yeniden çağırır (adres değişmez).
- `etutDurumYaz(ogrenciId, durum)` — `ETUT.secili.durumlar`'a yazar, o öğrencinin düğmelerinden doğru olanı `secili`
  yapar.
- `EYLEMLER['etut-durum']` — `etutDurumYaz`.
- `EYLEMLER['etut-hepsi-geldi']` — yalnız henüz işaretlenmemiş (`''`) öğrencileri "Geldi" yapar; "İzinli" ya da
  "İzinsiz" seçilmiş olanlara dokunmaz.
- `EYLEMLER['etut-yoklama-kaydet']` — işaretliler `kayitlar: [{ ogrenciId, durum }]` olur; hiç işaretli yoksa "Kimse
  işaretlenmedi. "Hepsi geldi" ile başlayabilirsin."; boş kalan varsa onay: "3 öğrenci işaretlenmedi. Yalnızca
  işaretlenenler kaydedilsin mi?". `POST /api/etut/yoklama { id, tarih, kayitlar }`; sonuç `#etyMesaj`'a ("Yoklama
  kaydedildi." ya da "Değişiklik yok."; hata kırmızı). Sayfa yeniden çizilmez.

### Öğrenci ve veli (`SAYFALAR.etutlerim`)

- `etutOgrenciKarti(veri, baslik)` — bir kart: (velide) çocuğun adı başlık; her etüt bir satır (ad, `etutSaati`,
  öğretmen); hiç etüt yoksa "Kayıtlı etüt yok.". Yoklamalardan "Geldi" olmayanlar "Gelmediği günler" başlığı altında
  "29.09.2026 · Matematik etüdü" ve renkli etiket (izinsiz kırmızı, izinli mavi); hepsi "Geldi" ise "Son yoklamaların
  hepsinde gelmiş.".
- `SAYFALAR.etutlerim()` — öğrenci: `GET /api/etut/ogrenci`, başlık "ETÜTLERİM", "Katıldığın etütler ve yoklamaları.".
  Başkası (veli): çocuğu yoksa `veliCocukYok('ETÜTLER')`; varsa `cocuklarIcin('/etut/ogrenci')` (şeritte seçili çocuk ya
  da hepsi için ayrı istek), başlık "ETÜTLER", "Çocuklarının etütleri ve etüt yoklamaları.", çocuk şeridi ve her çocuk
  için bir kart.

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Çağırdıkları:
  - `S` ([00-durum.md](00-durum.md)); `$`, `esc`, `api`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md)); `ik`
    ([02-ikonlar.md](02-ikonlar.md)); `modalAc`, `modalKapat`, `mesajGoster`, `sayfaMesaji`
    ([03-mesaj-modal.md](03-mesaj-modal.md)); `formHatalariniSil`, `alanHatasi`, `ilkHatayaGit`
    ([04a-form-alanlari.md](04a-form-alanlari.md)); `dugmeBekle`, `dugmeBitir`, `aramaSadeTR` ([05-giris.md](05-giris.md));
    `hero`, `yaz`, `git`, `bosKutu` ([07-yonlendirme.md](07-yonlendirme.md)); `SAYFALAR` ([08-ana-sayfa.md](08-ana-sayfa.md));
  - `hataGoster` (`25-tiklama.js`); `veliCocuklar`, `veliCocukYok`, `cocuklarIcin`, `veliCocukSeridi`
    (`27-veli-panel.js`). Sonra birleşen dosyalardaki işlevler tıklamada ya da sayfa açılırken çağrıldığı için sorun yok.
- Sunucu uçları ([../../../sunucu/bolumler/etut.md](../../../sunucu/bolumler/etut.md)):
  - `GET /api/etut` — personel (öğretmen, müdür; başkası 403 "Bu bölüm okul personeli içindir"): `herYoklama` olana
    bütün etütler, öğretmene yalnız kendi etütleri; `{ etutler, yonetebilir, herYoklama, bugun }`.
  - `GET /api/etut/adaylar` (`etut.yonet`), `GET /api/etut/detay?id=`.
  - `POST /api/etut/kaydet`, `POST /api/etut/sil { id, onay: true }`, `POST /api/etut/ogrenciler` — `etut.yonet`.
  - `GET /api/etut/yoklama?id=&tarih=` → `{ etut, tarih, engel, ogrenciler: [{ id, ad, sinif, durum }] }`;
    `POST /api/etut/yoklama { id, tarih, kayitlar }` — yalnız durumu değişenleri yazar, gelmeyene ve velisine bildirim.
  - `GET /api/etut/ogrenci?studentId=` — öğrencide `studentId` yok sayılır, hep kendisi döner; veli çocuğunu, okul
    personeli `canSeeStudent` kuralıyla öğrenciyi görür (başkası 403). `{ etutler, yoklamalar }`: yoklamalar yalnız
    öğrencinin şimdiki okulunun etütlerinden, yeniden eskiye, en çok 60.
  - Okul "Etüt"ü kapattıysa uçlar 403 `ozellikKapali`
    ([../../../sunucu/bolumler/ozellikler.md](../../../sunucu/bolumler/ozellikler.md)).
- Onu kullananlar:
  - `26-baslat.js` — çıkışta ve portal değişiminde (`oturumDurumunuSifirla`) `ETUT`'u baştan kurar.
  - Menü ([06-menu.md](06-menu.md)): "Etütler" (`etutler`) öğretmen ve müdür menüsünde; "Etütlerim" öğrencide, "Etütler"
    (`etutlerim`) velide. Bir öğrencinin portalında etüt bağlantısı yok. Üçü de okulun kapatabileceği "Etüt" bölümüne
    bağlı (`SAYFA_OZELLIK`: `etutler`, `etutlerim`, `etut-yoklama`).
  - Düğmelerin hepsi bu dosyanın `EYLEMLER`'inde; `25-tiklama.js` önce `EYLEMLER`'e bakar.
- CSS: `public/css/parcalar/20-devamsizlik.css` — etüt bölümü: `.etut-tarih`, `.etut-tarih-yazi`, `.ters` (aynalanmış
  ok), `.durum-grup`, `.etut-ogrenci-liste` (kaydırılır kutu), 560 px altında `.etut-yoklama-satir` alt alta; yoklama
  düğmeleri devamsızlıkla ortak `.durum-dugme` (seçiliyken `var` yeşil, `izinli` mavi, `yok` kırmızı).
  `27-harita-ortak.css` — `.dugme-satir`, `.soluk`; `02-form.css` — `.row2`; `16-giris-sekme.css` — `.onay`;
  `21-takvim.css` — `.alt-baslik`; `04-kartlar.css` — `.satir`, `.etiket`.
- Rol: liste — öğretmen ve müdür; açma/düzenleme/silme/öğrenci seçimi — `etut.yonet`; yoklama — `etut.yonet`,
  `etut.yoklama`, etüdün öğretmeni (pencere kuralıyla); döküm — öğrenci ve veli.

## Nasıl çalışır (adım adım)?

```
Yetkili: Etütler ─► GET /api/etut ─► "Etüt aç" ─► etutModal ─► (GET adaylar, bir kez)
           Kaydet ─► istemci denetimi ─► POST kaydet ─► liste + "Etüt kaydedildi."
         "Öğrenciler" ─► GET adaylar (önbellek) + GET detay ─► sınıf süzgeci / ara / görünenleri seç
           Kaydet ─► POST ogrenciler {bütün işaretliler} ─► "12 öğrenci kaydedildi."

Yoklama: "Yoklama" ─► ETUT.secili.tarih = etutSonTarihi(gün, sunucunun bugünü) ─► git('etut-yoklama')
           GET yoklama?id&tarih ─► engel? ── evet ─► mavi bilgi, düğmeler kilitli, kaydet yok
                                    └ hayır ─► [Hepsi geldi]  Ali [Geldi][İzinli][İzinsiz] …
           ‹ / › ─► tarih ±7 (bugünden ileri değil) ─► aynı sayfa yeniden
           "Yoklamayı kaydet" ─► yalnız işaretliler ─► POST yoklama ─► "Yoklama kaydedildi." / "Değişiklik yok."

Öğrenci: Etütlerim ─► GET etut/ogrenci ─► etütler + "Gelmediği günler"
Veli:    Etütler   ─► her çocuk için GET etut/ogrenci?studentId ─► çocuk başına kart
```

## Dikkat!

- **Aday listesi oturum boyunca önbellekte.** `etutAdaylari` öğretmen, sınıf ve öğrenci listesini bir kez çeker ve
  çıkışa ya da portal değişimine kadar tutar (`git('etutler')` ve üstteki "Yenile" düğmesi bunu silmez). Bu arada okula eklenen öğretmen ya da
  öğrenci, değişen sınıf etüt penceresinde görünmez; tarayıcıyı yenilemek ya da yeniden girmek gerekir. Sunucu yine
  doğruyu denetler ("Seçilen öğretmen bu okulda değil.", "Listede bu okulda olmayan öğrenci var.").
- **"Yoklama" düğmesi her zaman bugünü açmaz.** Etüt günü değilse en yakın geçmiş etüt günü açılır; etüdün öğretmeni
  için o tarih kilitlidir ("…geçmiş günü düzeltmek için etüt sorumlusuna söyle."). 15 dakika kuralına takılan öğretmen
  (ör. 15:40'lık etüt için 15:20'de açtıysa) sayfa kendiliğinden açılmaz; vakti gelince "Yoklama"ya yeniden basmalı.
- **"Hepsi geldi" iki ekranda farklı.** Burada yalnız boşları doldurur; devamsızlık yoklamasında ise herkesi "Geldi"
  yapar ([18-devamsizlik.md](18-devamsizlik.md)).
- **İşaretlenmeyen öğrenci kaydedilmez, silinmez de.** Etüt yoklamasında "Geldi" de bir kayıttır (sunucu `var`
  satırını tutar); işaretsiz bırakılan öğrencinin önceki kaydı (varsa) olduğu gibi kalır, yoksa "henüz alınmadı" kalır.
- **Öğrenci seçiminde süzgeç yalnız görünümü daraltır.** Gizlenen ama işaretli öğrenciler de kaydedilir; listeden
  çıkarmak için işaretini kaldırmak gerekir. Kaydet bütün listeyi yeniden yazar.
- **Sayfa yenilenince yoklama ekranı kaybolur.** `ETUT.secili` yalnız bellekte; tarayıcı `#/etut-yoklama`'yı yeniden
  açarsa sayfa "Etütler"e döner.
- **İleri tarih sınırı sunucunun bugünüyle.** `ETUT.bugun` liste açılırken sunucudan gelir; tarih hesapları yerel tarih
  parçalarıyla yapılır, UTC kayması yok.
- **"Son yoklamaların hepsinde gelmiş."** Öğrencinin kendi sayfasında da bu cümle çıkar: iyelik "senin", fiil üçüncü
  kişi. Yalnız yazım.
- Etüdün öğretmeni olarak seçilebilenler okulun onaylı öğretmenleri ve müdürleridir (sunucunun `ogretmenAdaylari`).
- `etut-durum` düğmesinin seçicisi öğrenci kimliğini doğrudan `[data-id="…"]` içine koyar; kimlikler sunucu üretimi
  (önek, alt çizgi ve onaltılık rakamlar; [../../../sunucu/ortak.md](../../../sunucu/ortak.md) `uid`) olduğu için
  güvenli.

## Testleri

- Bu dosyanın tarayıcıda çalışan bir testi yok. Sunucu tarafı:
  - `testler/test-etut.js` — hazır Öğretmen rolü ve "Etüt Sorumlusu" şablonu; etüt açma (yetkisiz öğretmen açamaz,
    geçersiz gün/ters saat reddi, öğretmen atama bildirimi, öğrenci ekleme, okul dışı öğrenci reddi, öğretmen yalnız
    kendi etüdünü görür); yoklama (etüdün öğretmeni olmayan açamaz, başka gün ve ileri tarih reddi, geçersiz durum ve
    listede olmayan kişi reddi, aynı yoklama "değişiklik yok", gelmeyene bildirim gider gelene gitmez); öğrencinin ve
    velinin dökümü; `etut.yoklama` verilen öğretmenin düzeltmesi; yetkisiz/onaysız silme.
  - `testler/test-ozellikler.js` — bölüm kapalıyken `GET /api/etut` 403 `ozellikKapali: 'etut'`.
- `testler/buton-denetimi.js` — bu dosyanın `EYLEMLER`'i ile ürettiği `data-act`'ların eşleşmesi (`etut-yeni`,
  `etut-duzenle`, `etut-kaydet`, `etut-sil`, `etut-ogrenciler`, `etut-gorunenleri-sec`, `etut-ogrenci-kaydet`,
  `etut-yoklama-ac`, `etut-hafta`, `etutler-don`, `etut-durum`, `etut-hepsi-geldi`, `etut-yoklama-kaydet`) ve
  `/api/etut` yolunun sunucuda olması.
- `testler/yazim-denetimi.js`, `testler/test-kucult.js` — ekran metinleri ve birleşik paketin derlenmesi.
- `araclar/gezinti.js` ekran turu (test değil) "Etütler", "Etüt düzenleme penceresi", "Yeni etüt penceresi", "Etüdün
  öğrencileri", "Etüt yoklaması" ve öğrenci/veli "Etütler" görüntülerini alır.
- Elle: `testler/seed.js`'teki müdürle Etütler → "Etüt aç" → bugünün gününü seç, başlangıcı 10 dakika sonraya koy,
  öğretmeni seç → Kaydet → "Öğrenciler"den iki öğrenci seç. O öğretmenle gir → Etütler → "Yoklama": bir öğrenciyi
  "İzinsiz", öbürünü "Geldi" yap → kaydet; izinsiz öğrencinin "Etütlerim"inde "Gelmediği günler" altında görünmeli.

## Son durum

- `git log`: 2 commit. Son değişiklik `d49d136 commit 350` (2026-09-26; 51 satır): `etut-yoklama-kaydet` eylemi (ondan
  önce yoklama ekranında "Yoklamayı kaydet" düğmesi vardı ama karşılığı yoktu), `etutOgrenciKarti` ve
  `SAYFALAR.etutlerim` (öğrencinin ve velinin dökümü). Aynı commit `19-mesajlar.js`'e okundu listesini ve
  `19f-roller.js`'i getirdi.
- Dosyanın ilk hâli `0bd6ff3 commit 349` (2026-09-26; 283 satır): personel listesi, etüt penceresi, öğrenci seçimi,
  yoklama ekranı. Aynı commit `10b-hesaplar.js`'e ekleme yaptı. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): aday önbelleğinin yenilenmemesi, "Yoklama"nın etüt günü değilse en yakın
  geçmiş etüt gününü açması (bilinçli ama öğretmen için kafa karıştırıcı), "Son yoklamaların hepsinde gelmiş." yazımı.
- Planlı işlerden bu dosyaya dokunacak olanlar:
  - "Etüt planlama" (öneri): etüt yetkilisi istediği dersten, istediği öğretmenle, istediği öğrencilere etüt açacak;
    "Etüt ekle" ekranında seçilen gün için CANLI BOŞ ZAMAN IZGARASI (öğretmenin ve seçilen öğrencilerin dolu saatleri,
    boş/kısmen dolu/dolu renkleri, aralığa basınca saatin dolması), kaydetmeden önce çakışma uyarısı, haftalık ya da
    tek seferlik etüt. Bu pencere (`etutModal`) ve öğrenci seçimi büyük ölçüde değişecek; sunucuya bir "boş zaman" ucu
    eklenecek.
  - "Mesaj ayarları … Ajanda …": etütler planlanan ajandaya girecek (Etüt planlama tanımı).
  - "Optimizasyon + saklama süreleri": öğrenci ve veli eski yılın etüt kayıtlarını isteyemeyecek; okul yönetimi bütün
    geçmişi görmeye devam edecek.
