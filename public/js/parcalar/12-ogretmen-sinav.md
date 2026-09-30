# public/js/parcalar/12-ogretmen-sinav.js

Öğretmenin (ve müdürün kendi dersleri için) "Sınavlar" sayfası: üç sekme (Sınavlarım, Gruplar, Şablonlar), yeni sınav
ve grup pencereleri, şablon ve değer alanı düzenleyicisi, bir sınavın öğrenci × değer tablosunda not girişi.

## Bu dosya ne yapar?

Eğitim Evi'nde bir sınav tek bir not değildir: her sınavın bir ya da birden çok **değer alanı** (ölçümü) vardır. Yazılıda
tek "Puan" (0–100), testte "Doğru / Yanlış / Net", LGS denemesinde her dersin neti ve "LGS Puanı" (100–500). Bu dosya
öğretmenin bu sınavlarla bütün işini yaptığı ekrandır:

1. **Sınavlarım** — öğretmenin bütün sınavları (grupta olsun olmasın), en yeni tarih üstte (sıra sunucudan gelir): ad,
   tarih, ders, şablon adı (şablonsuzsa "N değer alanı"), "N öğrencinin değeri girildi", grup etiketi ya da "Grupsuz",
   "Değer gir" ve "Sil".
   Üstte "Yeni sınav".
2. **Gruplar** — isteğe bağlı sınav grupları ("Dönem 1 - Yarıyıl 1"): kartta ders, sınav sayısı ve "Toplam etki %100"
   (tam 100 değilse turuncu). Gruba basınca grubun sınavları (her birinin etki oranı) ve öğrencilerin **grup
   ortalamaları** (100 üzerinden, ağırlıklı; çubuk ve 50 ve üstü yeşil / altı kırmızı etiket).
3. **Şablonlar** — okulun hazır değer listeleri. Okulda henüz olmayan hazır şablonlar ("Yazılı (0-100)", "Test (Doğru /
   Yanlış / Net)", "LGS Denemesi") "Okula ekle" ile eklenir; öğretmen kendi şablonunu da açar. Şablonu okuldaki bütün
   öğretmenler kullanır, yalnız açan kişi ve müdür değiştirir.
4. **Yeni sınav** — ad, tarih (bugün), şablon (okulun şablonları ve "(hazır)" olanlar), grup (ya da "Grupsuz") ve gruba
   eklenirse etki oranı (%50 gelir). "Aç ve değer gir" sınavı açar ve hemen değer tablosunu gösterir.
5. **Değer girişi** — satırlar öğrenciler (öğretmenin ulaşabildiği bütün öğrenciler), sütunlar değer alanları (ana
   değerin başlığı renkli; altında aralık "0 – 100"). Birden çok sınıf varsa üstte sınıf süzgeci ("Tüm sınıflar", "6-A",
   "7-B"). Değerler ondalıklı ve virgüllü yazılır (`490,161`); aralık dışı ya da sayı olmayan kutu kırmızı, değişen mavi
   kenar alır. Enter aynı sütunda alttaki öğrenciye, Shift+Enter üsttekine geçer. "Kaydet" yalnız değişen kutuları
   gönderir; boş bırakılan kutu değeri siler. "+ Yeni değer ekle / alanları düzenle" sınavın kendi alanlarını değiştirir
   (şablondan kopyalandıkları için şablonu etkilemez).

Kim görür: öğretmen — menüde "Sınavlar" `sinav.olustur` ya da `sinav.not-gir` yetkisiyle ([06-menu.md](06-menu.md)),
ana sayfada "Sınavlar" kutucuğu ([08-ana-sayfa.md](08-ana-sayfa.md); kutucuk yetkiye bakmaz, yalnız bölüm açık mı diye
bakar — iki yetkisi de olmayan öğretmen de sayfayı açar ve kendi eski sınavlarını görür); müdür — menünün "Kendi
Derslerim" bölümünde. Okulda
"Sınavlar" bölümü kapalıysa sayfa açılmaz (`SAYFA_OZELLIK`: `ogr-sinavlar` → `sinav`). Öğrenci ve veli sonuçları
"Sınavlarım" (`14-odev-filtre.js`), ilerleyiş (`13-ogrenci-veli.js`) ve grafik (`28-grafik.js`) ekranlarında görür.

Ön yüz parçaları ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`, [../../../sunucu/http.md](../../../sunucu/http.md)
`birlesikOku`); buradaki işlevler ve iki belge dinleyicisi bütün sayfada geçerlidir.

## İçinde neler var?

### Sayfa ve sekmeler

- `SAYFALAR['ogr-sinavlar']` — sekme `S.sinavSekme` (varsayılan `'sinavlar'`). Sekmeye göre TEK istek: `gruplar` →
  `GET /api/examgroups`, `sablonlar` → `GET /api/exams/sablonlar` (cevaptaki liste `S.sablonlar`'a da konur), öbürü →
  `GET /api/exams`. Başlık "SINAVLAR — Sınav aç, değerleri gir. Şablon seçersen alanları her sınavda yeniden yazmazsın.",
  `.sekme-satir` içinde üç sekme düğmesi, sonra sekmenin listesi (`grupListesi`, `sablonListesi`, `sinavListesi`).
- `sinavSekmeDugmesi(k, ad, secili)` — `button.sekme[data-act="sinav-sekme"][data-val=k]` (seçiliyse `.secili`).
- `EYLEMLER['sinav-sekme']` — `S.sinavSekme = data-val` ve sayfa işlevini DOĞRUDAN çağırır (`git` değil: adres ve
  `S.page` değişmez). Değer tablosundaki "Sınavlara dön" ve grup ekranındaki "Geri" de bu eylemdir.

### Sınavlarım

- `sinavListesi(sinavlar)` — `yetkim('sinav.olustur')` ise "Yeni sınav" (`sinav-yeni`); "Sınavlar (N)"; yoksa 'Henüz sınav
  yok. "Yeni sınav" ile başla.'. Her sınav `div.satir[data-ara]` (ad, şablon, grup — üst arama süzer): ad; "25.09.2026 ·
  Matematik · Yazılı (0-100) · 18 öğrencinin değeri girildi" (sayılan: ana değeri girilmiş öğrenci); grup etiketi (mavi)
  ya da gri "Grupsuz"; "Değer gir" (`sinav-ac`), "Sil" (`sinav-sil`).

### Gruplar

- `grupListesi(gruplar)` — yetki varsa "Yeni sınav grubu" (`grup-yeni`); ipucu "Grup isteğe bağlı: dönem ortalaması gibi
  etki oranlı hesap için kullan."; "Sınav grupları (N)"; `div.grid.k2` içinde her grup `div.kart.tikla[data-act="grup-ac"]`
  (kartın tamamı tıklanır): ad, ders, "N sınav", "Toplam etki %X" (tam 100 ise yeşil, değilse turuncu).
- `grupAc(id)` — `GET /api/examgroups/<id>` → sayfayı değiştirir: başlık grup adı (büyük harf) + "ders · sınav grubu";
  yetki varsa "Sınav ekle" (`sinav-yeni`, `data-id` = grup: yeni sınav penceresinde bu grup seçili gelir), "Geri"
  (`sinav-sekme` → `gruplar`), sağda "Grubu sil" (`grup-sil`); "Sınavlar": her biri tarih, şablon, girilen öğrenci sayısı,
  "Etki %X", "Değer gir", "Sil" (`data-gid` ile: silinince grup ekranına döner); "Grup ortalamaları (100 üzerinden,
  ağırlıklı)": her öğrenci ad + `.cubuk` çubuğu (genişlik ortalama, 0–100'e kırpılır) + etiket (değer yoksa gri "Değer
  yok", ≥ 50 yeşil, < 50 kırmızı; iki ondalık). Öğrenci yoksa "Ders verdiğin sınıflarda öğrenci yok.".
- `EYLEMLER['grup-ac']` — `grupAc`; hata `hataGoster`.
- `EYLEMLER['grup-yeni']` — "Yeni sınav grubu" penceresi: müdürse ders seçici `select#mDers` (`S.meta.subjects`, bütün
  dersler), herkese `#mAd` (yer tutucu "Dönem 1 - Yarıyıl 1"), `#mHata`; "Vazgeç", "Oluştur" (`grup-kaydet`). Öğretmende
  ders sorulmaz: grubun dersi öğretmenin branşıdır.
- `EYLEMLER['grup-kaydet']` — `POST /api/examgroups { name, subject? }` → pencere kapanır, "Gruplar" sekmesi açılır
  (`git('ogr-sinavlar')`). Hata `#mHata`'ya.
- `EYLEMLER['grup-sil']` — onay "Sınav grubu ve içindeki tüm sınavlar silinsin mi?" → `POST /api/examgroups/<id>/delete`
  → "Gruplar" sekmesi.

### Şablonlar ve değer alanı düzenleyicisi

- `olcumCipleri(olcumler)` — `div.olcum-cipleri` içinde her alan `span.olcum-cip` ("**Doğru** 0 – 100"); ana alan `.ana`
  ve ipucu "Ana değer: ortalamaya ve grafiğe girer". Şablon kartlarında ve açık sınavın üstünde.
- `sablonListesi(d)` — "Yeni şablon" (`sablon-yeni`) — herkese; ipucu "Şablon, bir sınavın değer alanlarıdır (Puan, Doğru,
  Yanlış, Net...). Okuldaki bütün öğretmenler kullanabilir; yalnızca açan kişi ve müdür değiştirir."; okulda olmayan hazır
  şablonlar ("Hazır şablonlar", `.sablon-kart.hazir-sablon` + "Okula ekle" `sablon-hazir`, `data-val` = anahtar);
  "Okulun şablonları (N)" — `s.duzenleyebilir` ise "Düzenle" (`sablon-duzenle`) ve "Sil" (`sablon-sil`), değilse "Açan
  öğretmen ya da müdür değiştirebilir.". Hiç yoksa "Henüz şablon yok. Hazırlardan birini ekle ya da yenisini aç.".
- `olcumSatiri(o)` — bir alan satırı `div.olcum-satir[data-id][data-kod]`: `input.o-ad` (60, yer tutucu "Doğru"),
  `input.o-alt` ve `input.o-ust` (`inputmode="decimal"`, `sayiGirdi` ile virgüllü), `label.o-ana` içinde `radio
  name="oAna"` (bütün satırlarda aynı ad: tek ana seçilir), "Sil" (`olcum-sil`). Boş satır: ad '', 0–100, ana değil.
  Kod (`D`, `NET`) ekranda yazılmaz; var olan satırda `data-kod`'da taşınır, yenisine sunucu üretir.
- `olcumDuzenleyici(olcumler)` — başlık satırı (Değer adı · Alt · Üst), `div#olcumListe`, "+ Yeni değer ekle"
  (`olcum-ekle`), ipucu "Ana değer ortalamaya ve grafiğe girer. Sınırlar -10000 ile 10000 arası; ondalık için virgül
  kullanabilirsin (ör. 490,161).". Hem şablon penceresinde hem açık sınavın "Değer alanları" penceresinde.
- `olcumleriTopla()` — `#olcumListe`'den `[{ id, kod, ad, alt, ust, ana }]` (alt/üst metin olarak; sunucu virgülü okur).
- `EYLEMLER['olcum-ekle']` — sona boş satır ekler, adına odaklanır. `EYLEMLER['olcum-sil']` — tek satır kaldıysa "En az bir
  değer alanı kalmalı." (`#mHata`), değilse satırı kaldırır (onay sormaz; asıl silme "Kaydet"te).
- `EYLEMLER['sablon-hazir']` — `POST /api/exams/sablonlar { hazir: anahtar }` → sekme yeniden çizilir.
- `sablonModal(s)` — "Yeni şablon" / "Şablonu düzenle": `#mAd` (60, "Yazılı (0-100)"), düzenleyici (yenide tek satır "Puan
  0–100, ana"), düzenlemede ipucu "Değişiklik yalnızca bundan sonra açılan sınavlara uygulanır; eski sınavlar olduğu gibi
  kalır.", `#mHata`; "Vazgeç", "Kaydet" (`sablon-kaydet`, düzenlemede `data-id`).
- `EYLEMLER['sablon-yeni']`, `EYLEMLER['sablon-duzenle']` (şablonu `S.sablonlar`'da bulur) → `sablonModal`.
- `EYLEMLER['sablon-kaydet']` — `POST /api/exams/sablonlar` (yeni) ya da `…/sablonlar/<id>` `{ name, olcumler }` → pencere
  kapanır, sekme yeniden çizilir; hata `#mHata`.
- `EYLEMLER['sablon-sil']` — onay "Şablon silinsin mi? Bu şablonla açılmış sınavlar değerleriyle birlikte kalır." →
  `POST /api/exams/sablonlar/<id>/delete`; hata `hataGoster`.

### Yeni sınav

- `EYLEMLER['sinav-yeni']` — `GET /api/exams/sablonlar` ve `GET /api/examgroups` birlikte. "Yeni sınav" penceresi: `#mAd`
  (100, "1. Yazılı"), `input#mTarih[type=date]` (bugün, tarayıcının yerel günü), `select#mSablon` (okulun şablonları, sonra
  okulda olmayan hazırlar "… (hazır)" — değeri `hazir:<anahtar>`; ilk seçenek seçili gelir), ipucu "Değer alanlarını
  şablon belirler. Sonradan sınava yeni alan da ekleyebilirsin.", `select#mGrup` ("Grupsuz" + gruplar; düğmenin `data-id`'si
  bir grupsa o seçili), `#mAgirlik` "Etki oranı (%)" 50 ("Yalnızca bir gruba eklersen kullanılır…"), `#mHata`; "Vazgeç",
  "Aç ve değer gir" (`sinav-kaydet`).
- `EYLEMLER['sinav-kaydet']` — gövde `{ name, tarih, templateId | hazir, groupId?, weight? }` (grup seçilmediyse etki
  oranı gönderilmez) → `POST /api/exams` → pencere kapanır, `sinavAc(d.exam.id)`. Hata `#mHata`.
- `EYLEMLER['sinav-sil']` — onay "Bu sınav ve girilmiş bütün değerleri silinsin mi?" → `POST /api/exams/<id>/delete` →
  `data-gid` varsa grup ekranı, yoksa sekme yeniden çizilir.

### Değer girişi

- `sinavAc(id)` — `GET /api/exams/<id>` → `S.acikSinav = d`. Sayfayı değiştirir (`yaz`; adres ve `S.page` aynı kalır):
  - başlık sınav adı (büyük harf) ve "25.09.2026 · Matematik · Yazılı (0-100) · Dönem 1 · etki %50" (şablonsuzsa
    "Şablonsuz", grupsuzsa "Grupsuz");
  - `.sinav-ust`: `olcumCipleri` + "+ Yeni değer ekle / alanları düzenle" (`sinav-olcum-duzenle`);
  - öğrenci yoksa yalnız "Ders verdiğin sınıflarda öğrenci yok." (tablo ve alt düğmeler çizilmez);
  - öğrencilerin sınıf adları (yoksa "Sınıfsız") Türkçe sıralanır; `S.sinavSinif` bu sınavda yoksa sıfırlanır; birden
    çok sınıf varsa `.sekme-satir` süzgeci (`sinav-sinif`, `data-val` sınıf ADI; "Tüm sınıflar" boş);
  - `table.t.deger-tablo` (`.tablo-sar` içinde): başlıkta "Öğrenci", (çok sınıfta) "Sınıf", her alan `th.sayi(.ana)` ad +
    `small` aralık; her öğrenci `tr[data-sinif][data-ara]` (süzgeç dışındaysa `.gizli`), her alan için
    `input.deger[inputmode=decimal][data-ogr][data-kod][data-alt][data-ust][data-ilk][aria-label]` — değeri
    `sayiGirdi` ile virgüllü, boşsa yer tutucu "-";
  - `.sinav-alt`: "Kaydet" (`sinav-deger-kaydet`), grup sınavında "Gruba dön" (`grup-ac`), değilse "Sınavlara dön"
    (`sinav-sekme` → `sinavlar`), ipucu "Enter ile alttaki öğrenciye geçersin. Boş bırakılan kutu değeri siler.",
    `#sinavMesaj`.
- `EYLEMLER['sinav-ac']` — `sinavAc`; hata `hataGoster`.
- `EYLEMLER['sinav-sinif']` — `S.sinavSinif` (sınıf adı ya da boş); satırlara `.gizli` koyar/kaldırır, düğmelerin
  `.secili`'sini günceller. İstek atmaz.
- `degerKutusuDenetle(kutu)` — `sayiOku` (boş → `null`, "490,161" ve "490.161" → 490.161, başka → `NaN`); sayı değilse ya
  da `data-alt`–`data-ust` dışındaysa `.hatali` (kırmızı) ve ipucu "0 ile 100 arasında bir sayı yaz"; geçerli ve
  `data-ilk`'ten farklıysa `.degisti` (mavi). Geçerliyse `true`.
- Belge düzeyinde iki dinleyici (dosya yüklenince bir kez): `input` → `.deger` kutusunu her tuşta denetler; `keydown`
  Enter → aynı `data-kod` sütununda, gizli olmayan satırlardaki bir sonraki (Shift ile bir önceki) kutuya odaklanıp içeriği
  seçer.
- `EYLEMLER['sinav-deger-kaydet']` — bütün kutuları denetler; hatalı varsa "N kutuda aralık dışı ya da sayı olmayan değer
  var (kırmızı). Önce onları düzelt." ve durur. Değişmeyenleri atlar; değişenleri `degerler[öğrenci][kod] = metin` (boşsa
  `null`) toplar. Hiçbiri yoksa "Değişiklik yok.". Düğme kilitlenir → `POST /api/exams/<id>/grades { degerler }`. Başarıda
  BÜTÜN kutuların `data-ilk`'i şimdiki değer olur, mavi kenarlar kalkar; sunucu `atlanan > 0` derse kırmızı "N değer
  yazılmadı: Net: 25 (-100 ile 100 arası olmalı); …" (ilk 5), değilse yeşil "N değer kaydedildi. Öğrencilere bildirim
  gitti.". Hata `#sinavMesaj`.
- `EYLEMLER['sinav-olcum-duzenle']` — `S.acikSinav.exam` yoksa hiçbir şey. "Değer alanları" penceresi: düzenleyici (sınavın
  alanlarıyla) + "Bir alanı silersen o alana girilmiş değerler de silinir." + `#mHata`; "Vazgeç", "Kaydet"
  (`sinav-olcum-kaydet`).
- `EYLEMLER['sinav-olcum-kaydet']` — `POST /api/exams/<id>/olcumler { olcumler }` → pencere kapanır, `sinavAc(id)` tabloyu
  yeni alanlarla çizer. Hata (ör. "… N değer yeni aralığın dışında kalıyor") `#mHata`'ya.

## Kimle konuşur?

- Çağırdıkları (hepsi aynı IIFE'de):
  - `S`, `$`, `esc`, `api`, `EYLEMLER`, `SAYFALAR`, `sayiTR`, `sayiGirdi`, `sayiOku` ([00-durum.md](00-durum.md),
    [01-yardimcilar.md](01-yardimcilar.md)); `tarih` ([02-ikonlar.md](02-ikonlar.md));
  - `modalAc`, `modalKapat`, `mesajGoster` ([03-mesaj-modal.md](03-mesaj-modal.md)); `git`, `yaz`, `hero`, `bosKutu`
    ([07-yonlendirme.md](07-yonlendirme.md)); `yetkim` (`21-ders-programi.js`); `hataGoster` (`25-tiklama.js`);
  - `S.meta.subjects` (girişte `GET /api/meta`, [05-giris.md](05-giris.md)).
- Sunucu uçları ([../../../sunucu/bolumler/sinav.md](../../../sunucu/bolumler/sinav.md); hepsi öğretmen ya da müdür):
  - `GET /api/examgroups` (`{ groups: [{ id, name, subject, examCount, weightTotal }] }`, seçili yıla süzülü),
    `POST /api/examgroups { name, subject? }` (`sinav.olustur`; ders öğretmende branşı), `GET /api/examgroups/<id>` (yalnız
    sahibi; `{ group, exams, averages }`), `POST /api/examgroups/<id>/delete` (yalnız sahibi; içindeki sınavlar da gider).
  - `GET /api/exams/sablonlar` (`{ sablonlar: [{ …, duzenleyebilir }], hazir }`), `POST /api/exams/sablonlar` (`{ hazir }`
    ya da `{ name, olcumler }`), `POST /api/exams/sablonlar/<id>` (açan ya da müdür), `POST …/sablonlar/<id>/delete`
    (kullanılmış şablon silinmez, 400).
  - `GET /api/exams` (`{ exams: [{ id, name, tarih, subject, groupId, groupName, templateName, olcumSayisi, graded }] }`),
    `POST /api/exams` (`sinav.olustur`), `GET /api/exams/<id>` (yalnız sahibi; `{ exam, students: [{ id, fullName,
    className, degerler: { <kod>: değer } }] }`), `POST /api/exams/<id>/grades` (`sinav.not-gir`; `{ atlanan, hatalar }`),
    `POST /api/exams/<id>/olcumler` (`sinav.olustur`), `POST /api/exams/<id>/delete` (`sinav.olustur`).
  - Değer ilk kez girilen öğrenciye (velisine kopya) sunucu "Matematik dersinden "1. Yazılı" sınavının sonucu açıklandı."
    bildirimi gönderir.
- Onu kullananlar: menü ve ana sayfa kutucuğu (`ogr-sinavlar`, [06-menu.md](06-menu.md), [08-ana-sayfa.md](08-ana-sayfa.md));
  düğmeler `25-tiklama.js`'in `EYLEMLER` yolundan çağrılır. Bu dosyadaki işlevleri başka parça çağırmıyor; `S.sinavSekme`,
  `S.sablonlar`, `S.acikSinav`, `S.sinavSinif` yalnız burada kullanılır. Değer kutuları `07-yonlendirme.js`'in "Yenile"
  korumasına girer (`25-tiklama.js` sayfadaki yazı kutusuna yazılınca `S._sayfaDegisti` der).
- Görünüm (`public/css/parcalar/`): `25-grafik-sinav.css` (`.olcum-cipleri`, `.olcum-cip.ana`, `.sablon-kart`,
  `.hazir-sablon`, `.olcum-baslik`, `.olcum-liste`, `.olcum-satir`, `.o-ana`, `.o-sil`, `.sinav-ust`, `.deger-tablo`
  (`th.ana`, `th small`, `tr.gizli`, `td.sinif-hucre`), `table.t input.deger` ve `.degisti` / `.hatali`, `.sinav-alt`),
  `19-mesajlar.css` (`.sekme-satir`, `.sekme`, `.secili`), `05-tablo-grafik.css` (`.tablo-sar`, `table.t`, `.cubuk`),
  `04-kartlar.css` (`.grid.k2`, `.kart`, `.tikla`, `.satir`, `.etiket` renkleri), `02-form.css` (`.field`, `.btn`, `.hint`,
  `.msg`), `03-iskelet.css` (`h3.sb`). `.o-ad`, `.o-alt`, `.o-ust` sınıflarının ayrı kuralı yok (satırın ızgarası
  `.olcum-satir`'da).
- Rol: öğretmen (`sinav.olustur` / `sinav.not-gir`), müdür (kendi sınavları). Sınav YALNIZ açanındır: müdür bile başka
  öğretmenin sınavını bu ekrandan açamaz.

## Nasıl çalışır (adım adım)?

### Sınav açıp değer girme

```
menü "Sınavlar" ─► ogr-sinavlar (S.sinavSekme) ─► GET /exams ─► Sınavlarım listesi
"Yeni sınav" ─► GET /exams/sablonlar + GET /examgroups ─► pencere (ad · tarih · şablon · grup · etki)
"Aç ve değer gir" ─► POST /exams { name, tarih, templateId|hazir, groupId?, weight? } ─► sinavAc(yeni id)
sinavAc ─► GET /exams/<id> ─► S.acikSinav ─► tablo: öğrenci × alan (sınıf süzgeci)
   yaz ─► input ─► degerKutusuDenetle: kırmızı (hatalı) / mavi (değişti)
   Enter ─► aynı sütunda alttaki görünür kutu
"Kaydet" ─► hatalı var mı? ─► değişenler { öğrenci: { kod: "17,5" | null } }
   ─► POST /exams/<id>/grades ─► data-ilk = şimdiki ─► "N değer kaydedildi…" ya da "N değer yazılmadı: …"
```

### Alanlar ve şablonlar

```
"+ Yeni değer ekle / alanları düzenle" ─► pencere (satır ekle / sil / ad-aralık / ana)
   ─► POST /exams/<id>/olcumler ─► sinavAc(id)           (şablon değişmez; sınavın kendi kopyası)
Şablonlar ─► "Okula ekle" (hazır) ─► POST /exams/sablonlar { hazir }
          ─► "Yeni şablon" / "Düzenle" ─► POST /exams/sablonlar[/<id>] { name, olcumler }
```

### Grup ortalaması (sunucuda)

```
ortalama(öğrenci) = Σ ( (ana değer − alt) / (üst − alt) × 100 × etki ) / Σ etki      (değeri olmayan sınav sayılmaz)
```

## Dikkat!

- **Yetki kapsamı dışındaki öğrencinin değeri sessizce kaybolur.** Tablo öğretmenin ulaşabildiği BÜTÜN öğrencileri
  gösterir; sunucu ise yalnız `sinav.not-gir` kapsamındaki sınıfların öğrencilerini yazar, öbürlerini `atlanan`'a bile
  saymadan atlar. Rolü bazı sınıflarla sınırlı bir öğretmen öbür sınıftaki öğrenciye değer yazarsa ekranda "N değer
  kaydedildi" görür, kutular "kaydedildi" sayılır (`data-ilk` güncellenir); sayfa yeniden açılınca değer yoktur. Kod
  okumasına göre; tarayıcıda denenmedi, kod değiştirilmedi.
- **"Öğrencilere bildirim gitti." her zaman yazılır.** Sunucu yalnız değeri İLK KEZ girilen öğrenciye bildirim gönderir;
  düzeltmede ya da değer silmede de ekran aynı cümleyi söyler.
- **Kısmi hatada kutular "kaydedildi" görünür.** `atlanan > 0` olduğunda da bütün kutuların `data-ilk`'i güncellenir;
  yazılmayan değer mavi kenarını kaybeder ve bir sonraki "Kaydet" "Değişiklik yok." der. (İstemci aralığı zaten
  denetlediği için bu yol seyrek: çoğunlukla sayfa açıkken başka yerden daraltılan alanda olur.)
- **Kaydedilmemiş değerler uyarısız gider.** "Sınavlara dön", "Gruba dön", sekme düğmeleri ve menü yazılan ama
  kaydedilmeyen değerleri sormadan atar; "Değer alanları"nı kaydetmek de tabloyu sunucudan yeniden çizer. Yalnız üst
  şeritteki "Yenile" sorar (`S._sayfaDegisti`); o da açık sınavı değil sekme listesini yeniden açar (sayfa adresi
  `#/ogr-sinavlar`). Tersine, "Kaydet" başarılı olunca `S._sayfaDegisti` sıfırlanmaz (yalnız `git` sıfırlar): kaydettikten
  sonra da "Yenile" "Sayfada yazdıkların kaydedilmedi…" diye sorar.
- **Şablon silme onayı yanıltıcı.** Onay "Bu şablonla açılmış sınavlar değerleriyle birlikte kalır." der; oysa sunucu
  kullanılmış şablonu hiç silmez (400 "… öğrenci grafikleri bozulmasın diye silinemez…") ve bu ileti tarayıcı uyarı
  kutusunda çıkar.
- **Sınavın dersi seçilemez.** "Yeni sınav" penceresinde ders yok: sınavın dersi grubunki, grupsuzsa öğretmenin branşıdır.
  Başka dersin sınavını yapan (ya da branşı boş) öğretmenin sınavı yanlış/boş dersle kaydolur; müdürün grupsuz sınavı
  branşı yoksa "Müdür" dersiyle açılır (`branchOf`) ve bildirim "Müdür dersinden …" diye gider. Öğretmenin grubunun dersi
  de branşıdır; yalnız müdür grup açarken ders seçer. Kod okumasına göre.
- **Düğmeler yetkiye tam bakmaz.** "Sil" (sınav) ve "Değer gir" her satırda çizilir. `sinav.olustur` yoksa "Sil" 403
  alır ve ileti uyarı kutusunda çıkar; `sinav.not-gir` yoksa tablo açılır ama "Kaydet" 403 "Not girme yetkin yok" der
  (`#sinavMesaj`). "Değer alanları" düğmesi de her zaman çizilir (kaydı `sinav.olustur` ister). "Grubu sil" yetkiye hiç
  bakmaz ve sunucu da yalnız sahipliğe bakar: `sinav.olustur`'u elinden alınmış öğretmen tek bir sınavı silemez ama kendi
  grubunu, içindeki bütün sınavlar ve değerlerle birlikte silebilir. Okula yeni şablon açmak ve hazır şablonu okula
  eklemek de hiçbir sınav yetkisi istemez (sunucu yalnız öğretmen ya da müdür mü diye bakar; düzenleme ve silme açana ya
  da müdüre aittir). Sınav açanına ait olduğu için yalnız
  `sinav.not-gir` yetkisi olan öğretmen başkasının sınavına not giremez; listesinde yalnız daha önce kendi açtığı
  sınavlar olur (çoğu zaman boş liste).
- **Alan silmek değerleri siler.** "Değer alanları" penceresinde bir satırı "Sil"mek onay sormaz; "Kaydet"e basılınca o
  alanın bütün değerleri gider (pencere ipucu söyler). Aralık daraltma girilmiş değeri dışarıda bırakacaksa sunucu
  reddeder.
- **Öğrenci yoksa yol kalmaz.** Öğretmenin hiç öğrencisi yoksa açık sınavda yalnız "Ders verdiğin sınıflarda öğrenci
  yok." çizilir; "Sınavlara dön" düğmesi de yoktur, menüden dönülür.
- **Tarih kutusu tarayıcınınki.** Sınav tarihi `input[type=date]`: tarayıcıya ve dile göre "gg.aa.yyyy" ya da
  "mm/dd/yyyy" görünebilir; ödevdeki kendi takvim alanı ([04e-tarih-secici.md](04e-tarih-secici.md)) burada kullanılmıyor.
- **Sınıf süzgeci ad ile.** `S.sinavSinif` sınıfın ADINI tutar ve sınavdan sınava taşınır; o sınavda o ad yoksa sıfırlanır.
  Gizli satırlardaki kutular da kaydetmeye girer (yalnız değiştiyse gönderilir). Aynı sebeple gizli bir satırda kırmızı
  (hatalı) kutu kaldıysa "Kaydet" "N kutuda aralık dışı … (kırmızı)" deyip durur ama o kutu ekranda görünmez; "Tüm
  sınıflar"a dönmek gerekir.
- **Sayılar:** kutuya binlik ayırıcısız yazılır; "1.234,5" gibi hem nokta hem virgül içeren değer geçersiz (kırmızı).
  Nokta da ondalık sayılır: "1.234" bin iki yüz otuz dört değil 1,234 olarak okunur ve aralıktaysa kabul edilir (LGS
  puanı gibi büyük değerler için binlik ayırıcı alışkanlığı risklidir: 0–100'lük bir alana `1.234` yazan biri hata
  görmez, 1,234 kaydedilir). Sunucu değeri 3 ondalığa yuvarlar; ekran yazılan metni gösterir, yeniden açınca yuvarlanmış
  hâli gelir.
- **HTML güvenliği:** sınav, grup, şablon, alan ve öğrenci adları `esc`'ten geçer; `data-alt`/`data-ust` sunucudan gelen
  sayılardır.

## Testleri

- `testler/test-sinav.js` (sunucu) — şablonlar (üç hazır şablon önerisi, hazır LGS'nin okula bir kez eklenmesi, elle
  şablon ve kod üretimi, alt > üst ve ±10000 reddi, aynı ad reddi, başka öğretmenin değiştirememesi, şablonun okulun
  tamamına görünmesi); grupsuz sınav, öğrencilerin sınıf adıyla gelmesi, virgüllü değer (`490,161` → 490.161), aralık dışı
  ve sayı olmayanın atlanması (`atlanan: 2`) ve eskisini bozmaması, başka öğretmenin not girememesi; "+ yeni değer ekle"
  (eski değerler korunur) ve dışarıda bırakan daraltmanın reddi; grafik; grup ortalaması (0–100 ile 0–500 birlikte → 80),
  grupta etki oranının şart olması.
- `testler/test-bildirim.js` (sınav sonucu bildirimi yalnız ilk girişte), `testler/test-egitim-yili.js` (arşiv yılında grup
  açma 409), `testler/test-ozellikler.js` (Sınavlar kapalı okulda 403), `testler/test-siniflarim.js` (sonucun öğretmenin
  öğrenci ekranında görünmesi).
- `testler/buton-denetimi.js` — `sinav-sekme`, `sinav-yeni`, `sinav-kaydet`, `sinav-ac`, `sinav-sil`, `sinav-sinif`,
  `sinav-deger-kaydet`, `sinav-olcum-duzenle`, `sinav-olcum-kaydet`, `grup-*`, `sablon-*`, `olcum-ekle`, `olcum-sil`
  eylemlerinin karşılığı; `testler/yazim-denetimi.js` metinleri tarar. Bu dosyayı tarayıcıda çalıştıran test yok.
- Ekran turu (`araclar/gezinti.js`; ÇALIŞTIRMA): "Sınavlar", "Şablondan sınav: LGS / Test / Yazılı", "Değer tablosu —
  hatalı değer kırmızı, değişen mavi", "Değer alanları — + Yeni değer ekle", "Yeni sınav penceresi", "Sınav grupları",
  "Grup ortalamaları", "Şablonlar", "Yeni şablon penceresi", "Şablonu düzenleme penceresi" (ve koyu/telefon kopyaları).
- Elle (3200): `testler/seed.js`'teki Matematik öğretmeniyle "Sınavlar" → "Şablonlar" → (okulda yoksa) "LGS Denemesi"ni
  okula ekle → "Sınavlarım" → "Yeni sınav" (şablon LGS) → "Aç ve değer gir" → bir öğrenciye LGS Puanı `490,161`, bir
  başkasına `600` yaz (kırmızı olmalı) → "Kaydet" hatayı söylemeli; `600`'ü sil → "Kaydet" → yeşil ileti. Enter ile
  alttaki kutuya geç.

## Son durum

- `git log`: 12 commit, hepsi 2026-09-25. Dosya parça parça kuruldu: `79ed25d commit 205` (sayfa, sekmeler, Sınavlarım),
  `365cacd commit 206` (gruplar, `grupAc`), `2b59349 commit 207` (grup eylemleri, `olcumCipleri`, `sablonListesi`),
  `4273e4d commit 208` (değer alanı düzenleyicisi), `6a62102 commit 209` (şablon eylemleri, `sinav-yeni`), `0f66902 commit
  210` (`sinav-kaydet`, `sinav-sil`, `sinavAc`), `300d6b5 commit 211` (`sinav-ac`, `sinav-sinif`, `degerKutusuDenetle`),
  `1e4d3b2 commit 212` (her tuşta denetleyen `input` dinleyicisi), `884ca5b commit 213` (Enter / Shift+Enter ile gezinme).
- Son üç: `6725147 commit 214` — `sinav-deger-kaydet` (yalnız değişen kutular, hatalı kutu varsa durma, `atlanan`
  iletisi); `31f7434 commit 215` — `sinav-olcum-duzenle` ("Değer alanları" penceresi); `167c817 commit 216` —
  `sinav-olcum-kaydet` (alanları yazıp tabloyu yeniden çizme). O günden beri dosya değişmedi.
- Bilinen açıklar (kod değiştirilmedi): kapsam dışı öğrencinin değerinin sessizce yazılmaması, her kayıtta "bildirim
  gitti" iletisi, kaydedilmemiş değerlerin uyarısız kaybı, yanıltıcı şablon silme onayı, seçilemeyen sınav dersi,
  yetkiye bakmayan düğmeler ve yetkisiz grup silme, gizli satırdaki hatalı kutunun kaydı durdurması (Dikkat).
- Planlı işlerden bu dosyaya dokunacaklar: "Sınav: formüllü ölçüm + notları Excel'den yükleme/indirme + sınav grubu üst
  değeri" (iş 14, öneri onay bekliyor: alan "elle girilir" ya da "hesaplanır" olacak — `N = D - Y/4` gibi formül, kendi
  hesaplayıcımızla, `eval` yok; değer tablosuna "Excel şablonu indir / yükle"; grupta üst değer (ör. 125), yüzde/katkı
  puanı, bağlı kaydırıcılar ve kilit; grup kartındaki "Toplam etki %100" ve ortalama ekranı değişecek); "Mesaj ayarları …
  sınav planlama (salon/koltuk)" (iş 8); "Düzenleyiciler" (iş 15: sınav açıklaması ortak yazı düzenleyicisiyle); "Çalışan
  olarak ekleme" (iş 2: öğretmen rolü olmayan çalışan sınav açamaz); "Yıl geçişi" (iş 9: arşiv yılları); "Çok dil" (iş 22).
