# public/js/parcalar/28-grafik.js

Kütüphanesiz SVG grafikler: "güzel" sayılara yuvarlanan eksen, sütun grafik (ödev sonuçları) ve çizgi grafik (sınavlar);
ödev sonuç grafiğinin kutusunun gerçek genişliğinde çizilmesi, öğrencinin sınav grafiği kutusu (şablon, ölçüm, en düşük /
en yüksek bandı, grafik / liste) ve ödev grafiği kartının sekme ve gizle düğmeleri.

## Bu dosya ne yapar?

İlerleyiş ve Sınavlar sayfalarındaki iki grafik buradan çıkar:

- **Ödev sonuçları** — sütun grafik: öğrencinin bütün ödevleri sonuca göre sayılır (Yaptı, Geç yaptı, Eksik, Yapmadı,
  İzinli, Gelmedi, Belirsiz). Sonucu olmayan (süren ya da değerlendirilmemiş) ödev "Belirsiz"dir.
- **Sınav grafiği** — çizgi grafik: aynı **şablonla** (ör. "Yazılı (0-100)", "LGS Denemesi") yapılmış sınavlar tarih
  sırasıyla yan yana konur; alttan hangi ölçümün çizileceği seçilir (LGS Puanı, Türkçe Net…). İstenirse arkada gölgeli bir
  **bant** sınava girenlerin en düşük ve en yüksek değerini, kesik çizgi ortalamasını gösterir. "Liste" görünümü aynı
  veriyi tablo olarak verir.

Kütüphane yok; grafik bir SVG metni olarak üretilip sayfaya yazılır. Renkler CSS'ten gelir
(`public/css/parcalar/25-grafik-sinav.css`; dosyanın baş yorumu `25-grafik.css` diyor, eski ad), bu yüzden açık ve koyu
temada aynı kod çalışır. Eksenler "güzel" sayılara yuvarlanır: en büyük değer 174 ise eksen 0–200, 50'şer (bu belge
yazılırken işlev sunucusuz denendi: `{ alt: 0, ust: 200, adim: 50, isaretler: [0, 50, 100, 150, 200] }`).

Grafik **kutusunun gerçek genişliğinde** çizilir; SVG ölçeklenmediği için yazılar telefonda da masaüstünde de 11–12
piksel kalır. Bu yüzden sayfa önce sabit yükseklikte boş kutularla çizilir (sayfa kaymaz), grafik kutu yerleşip genişliği
belli olunca çizilir; pencere boyu değişince (telefon yan çevrilince) yeniden çizilir.

Kim görür: öğrenci (İlerleyişim, Sınavlarım), veli (İlerleyiş sayfasında her çocuğun grafikleri; çocuğun portal
görünümünde İlerleyişi/Sınavları), öğrencinin portalını açan müdür ve "öğrenci portalına girer" yetkili öğretmen
([10-mudur.md](10-mudur.md) "Portalını aç"). Sınav grafiği verisini kimin görebileceğine sunucu karar verir
([../../../sunucu/bolumler/sinav.md](../../../sunucu/bolumler/sinav.md)).

## İçinde neler var?

### Eksen

- `guzelAdim(ham)` — ham adımı 1, 2, 2,5, 5 ya da 10 × 10^k'ye yukarı yuvarlar (43,5 → 50; 0,3 → 0,5; 2,2 → 2,5); 0 ya da
  sayı değilse 1.
- `guzelEksen(enAz, enCok, hedefAralik = 4)` — `{ alt, ust, adim, isaretler }`. En az ile en çok eşitse aralık açılır
  (ikisi de 0 ise üst 1; değilse ±%10). Adım `(enCok − enAz) / hedefAralik`'ın güzel hâli; alt aşağı, üst yukarı adıma
  yuvarlanır; işaretler alttan üste adım adım. Kayan nokta artığı (0,30000000000000004) etikete düşmesin diye işaretler
  adımın basamak sayısına göre `toFixed` ile kesilir.

### Ortak yardımcılar

- `grafikGenisligi(o)` — `o.genislik` yuvarlanmış, en az 260; verilmediyse (ya da 0 ise) 640.
- `ikiSatir(x, y, metin, sinif, dar)` — eksen yazısı; dar sütunda ve iki ya da daha çok kelimede ikinci satıra iner
  ("Geç" / "yaptı", `tspan` ile); metin `esc`'li.

### `sutunGrafik(o)` — sütun grafik

Girdi `{ kategoriler: [{ ad, deger, sinif }], baslik, genislik }`. Ölçüler: genişlik G, yükseklik 250; sol 40, sağ 8, üst
24, alt 44 piksel pay. Eksen her zaman 0'dan başlar (`guzelEksen(0, en büyük değer ya da 1)`). Önce her eksen işareti için
yatay bir ızgara çizgisi ve solda değeri (`sayiTR`), sonra her kategori için `g.sutun-grup` içinde:

- `rect.sutun.<sinif>` (köşesi 5 px yuvarlak, içinde `<title>Ad: değer</title>` — fareyle üzerine gelince);
- sütunun üstünde değer (`text.deger-yazi`);
- altında ad (`ikiSatir`): sütun başına düşen yer 78 pikselden darsa iki kelimeli ad iki satıra iner, 54'ten darsa yazı
  küçülür (`eksen-yazi kucuk`).

Sütun genişliği en çok 56 piksel ya da yerin %62'si. SVG `role="img"` ve `aria-label="<başlık>: Yaptı 3, Geç yaptı 1, …"`
(ekran okuyucu bütün değerleri okur).

### `cizgiGrafik(o)` — çizgi grafik

Girdi `{ etiketler: [{ ust: '10.09.2026', alt: 'LGS Deneme 1' }], degerler: [490.161, null, 455.5], bant: [{ alt, ust, ort
}] | null, baslik, genislik }`. Ölçüler: yükseklik 290; sol 48, sağ 10, üst 26, alt 52.

1. Eksen hem öğrencinin değerlerinden hem bandın alt/üst değerlerinden kurulur (hiç değer yoksa 0–1); en büyük değerin
   üstüne %8 pay eklenir (değer yazısı eksenin tepesine yapışmasın), 5 aralık hedeflenir. Negatif değerler (ör. net)
   desteklenir.
2. Noktalar kenardan içeride başlar (iç pay en çok 44 px ya da çizim genişliğinin %9'u); tek sınav varsa ortada.
3. Dar ekran: noktalar arası 84 pikselden azsa tarih "17.06" diye kısalır; sınav adı aralığa göre kısaltılır ("…"); 40
   pikselden azsa etiketlerin biri atlanır (sonuncusu her zaman yazılır).
4. Bant: değeri olan sınavların üst kenarı ve alt kenarı bir çokgen (`polygon.bant`), ortalaması kesik çizgi
   (`polyline.bant-ort`). Bandı olan tek sınav varsa kalın dikey bir çizgi (`line.bant-tek`).
5. Öğrencinin çizgisi (`polyline.cizgi`): değeri olmayan sınavda kesilir; yalnız yan yana en az iki değer varsa çizgi olur.
6. Her değerli sınavda nokta (`circle.nokta`, içinde "LGS Deneme 1 (10.09.2026): 490,161 · en düşük 300, en yüksek 490,161"
   `title`'ı) ve değer yazısı: noktanın üstünde, tepeye çok yakınsa altında; aralık 60 pikselden darsa bir ondalık, değilse
   iki.

SVG `role="img"`, `aria-label` yalnız başlık ("LGS Puanı grafiği").

### Ödev sonuç grafiği

- `ODEV_GRAFIK_SIRA` — `['yapti', 'gec', 'eksik', 'yapmadi', 'izinli', 'gelmedi', 'belirsiz']` (sütunların sırası, aynı
  zamanda CSS sınıfı).
- `ODEV_GRAFIK_AD` — sütun adları: Yaptı, Geç yaptı, Eksik, Yapmadı, İzinli, Gelmedi, Belirsiz.
- `odevSonucGrafigi(odevler)` — her ödevin `result`'ını sayar (tanınmayan ya da boş → `belirsiz`) ve yalnız boş bir kutu
  döner: `<div class="odev-sutun" data-sayim='{"yapti":3,…}'>` (CSS'te en az 250 px yükseklik). Grafik burada çizilmez.
- `odevGrafikleriniCiz()` — sayfadaki her `.odev-sutun[data-sayim]` kutusunu genişliğinde `sutunGrafik` ile çizer
  (başlık "Ödev sonuçları"). Gizli kutu (genişliği 0 — öbür sekme ya da "Grafiği gizle") atlanır, görününce çizilir.
  Genişlik `data-cizilen`'e yazılır; aynı genişlikteki kutu yeniden çizilmez.
- Pencere boyu değişince (`resize`, 180 ms bekleyerek, `grafikBoyutZamani`) `odevGrafikleriniCiz()` ve sayfada kutusu
  olan her öğrencinin sınav grafiği yeniden çizilir (`sinavGrafigiCiz`). Bu dinleyici paket yüklenirken kurulur.

### Sınav grafiği kutusu

- `S.sg` — öğrenci kimliği → `{ bant, gorunum, sablon, olcum, veri }`. İlk kez kurulurken `bant` tarayıcıdaki tercihten
  (`tercihOku('sg_bant', '1')` → `localStorage` `ee_sg_bant`, varsayılan açık), `gorunum` `'grafik'`. Paket yüklenirken
  `S.sg = S.sg || {}`.
- `sinavGrafigiKutusu(ogrenciId)` — `div.kart.sinav-grafik#sg-<öğrenci>` içinde "Sınav grafiği" başlığı ve parlayan yer
  tutucu (`.sg-govde.yer-tutucu`, en az 300 px).
- `sinavGrafigiYukle(ogrenciId)` — `GET /api/exams/grafik?ogrenci=<id>[&sablon=<seçili şablon>]`; cevabı `durum.veri`'ye,
  sunucunun seçtiği şablonu `durum.sablon`'a yazar; seçili ölçüm yoksa ya da bu şablonda yoksa ana ölçüm (`ana`), o da
  yoksa ilki seçilir; `sinavGrafigiCiz`. Hata olursa kutunun içine kırmızı ileti (ör. sınavlar o okulda kapalıysa
  "Sınavlar bu okulda kapalı…"), sayfa bozulmaz.
- `sinavGrafigiCiz(ogrenciId)` — kutu ya da veri yoksa çıkar. Yer tutucu sınıfı kalkar.
  - Hiç şablon yoksa: "Grafik, aynı şablonla yapılmış sınavları yan yana koyar. Henüz şablonlu bir sınav sonucu yok."
  - Üst araçlar: birden çok şablon varsa sekmeler (`data-act="sg-sablon"`), tek şablonsa adı; sağda "Grafik / Liste"
    sekmeleri (`sg-gorunum`).
  - **Liste**: tablo — Tarih, Sınav ve her ölçüm bir sütun (sayı sağa yaslı, ana ölçüm kalın ve ana renkte); değer
    yoksa "-".
  - **Grafik**: `cizgiGrafik` (başlık "<ölçüm adı> grafiği", genişlik kutunun genişliği, etiketler tarih + sınav adı,
    değerler seçili ölçüm, bant açıksa her sınavın o ölçümdeki bandı); altında ölçüm sekmeleri (`sg-olcum`) ve "En düşük
    / en yüksek bandı" düğmesi (`sg-bant`); bant açıksa gösterge: çizgi "Senin değerin" (öğrenci kendi bakıyorsa) ya da
    "Öğrencinin değeri", gölge "Sınavı girenlerin en düşük - en yüksek aralığı", kesik çizgi "Ortalama".
  - Düğmelerin hepsi `data-id="<öğrenci>"` taşır: aynı sayfada birden çok çocuğun kutusu olabilir (veli İlerleyiş'i).

### Eylemler (`EYLEMLER`; [25-tiklama.md](25-tiklama.md) önce buraya bakar)

- `sg-sablon` — şablon değişir, ölçüm seçimi silinir, `sinavGrafigiYukle` (yeni istek).
- `sg-olcum` — ölçüm değişir, `sinavGrafigiCiz` (istek yok).
- `sg-bant` — yalnız o öğrencinin kutusunda bant açılır/kapanır, tercih `ee_sg_bant`'a yazılır, yeniden çizim. Tercihi
  yalnız `S.sg`'de henüz kaydı olmayan öğrenci okur (kayıt sayfa yeniden yüklenene kadar durur): veli İlerleyiş'inde bir
  çocuğun bandını kapatınca öbür çocuğun kutusu — sayfalar arasında gidip gelse bile — eski hâlinde kalır.
- `sg-gorunum` — Grafik / Liste, yeniden çizim.
- `odev-grafik-sekme` — ödev grafiği kartında "Sonuçlara göre" / "Derslere göre" ([13-ogrenci-veli.md](13-ogrenci-veli.md)
  kartı üretir): kartın `data-gorunum`'u değişir (CSS öbür görünümü gizler), sekmelerin `secili`'si güncellenir, tercih
  `ee_odev_grafik_gorunum`'a yazılır, `odevGrafikleriniCiz()` (gizliyken çizilmemiş olabilir). İstek yok; iki görünüm de
  sayfada hazır.
- `odev-grafik-gizle` — `body.odev-grafik-kapali` çevrilir (sayfadaki bütün ödev grafikleri gizlenir/görünür), tercih
  `ee_odev_grafik_kapali`'ye; görünür olunca çizilir.

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; [../../../sunucu/http.md](../../../sunucu/http.md)
  `birlesikOku`). Bu dosya paketin son parçasıdır; `S.sg = …`, `resize` dinleyicisi ve `EYLEMLER` kayıtları
  [26-baslat.md](26-baslat.md)'in açılış kodundan sonra çalışır (ilk sayfa eşzamansız açıldığı için sorun yok).
- Çağırdıkları: `S` ([00-durum.md](00-durum.md); `S.viewStudentId`, `S.user.role` gösterge yazısı için), `$`, `esc`, `api`,
  `sayiTR`, `tercihOku`, `tercihYaz`, `EYLEMLER` ([01-yardimcilar.md](01-yardimcilar.md)), `tarih`
  ([02-ikonlar.md](02-ikonlar.md)).
- Sunucu ucu: `GET /api/exams/grafik?ogrenci=&sablon=` ([../../../sunucu/bolumler/sinav.md](../../../sunucu/bolumler/sinav.md))
  → `{ sablonlar: [{ id, name }], sablonId, olcumler: [{ kod, ad, alt, ust, ana, sira }], sinavlar: [{ id, name, tarih,
  degerler: { <kod>: değer|null }, bant: { <kod>: { alt, ust, ort, sayi } } }] }`. Yetki `canSeeStudent`; okul personeli
  yalnız kendi okulundaki sınavları, öğrenci ve velisi bütün okullardakileri görür. Sınavlar bölümü kapalı okulda 403.
- Onu kullananlar:
  - [13-ogrenci-veli.md](13-ogrenci-veli.md) — `ilerleyisKartlari`: `odevSonucGrafigi(d.assignments)`, `sinavGrafigiKutusu`,
    ödev kartının `odev-grafik-sekme` / `odev-grafik-gizle` düğmeleri ve tercihleri; `ilerleyisGrafikleriniYukle`:
    `odevGrafikleriniCiz()` + her öğrenci için `sinavGrafigiYukle`.
  - [14-odev-filtre.md](14-odev-filtre.md) — Sınavlarım sayfası: `sinavGrafigiKutusu` (sonra `ilerleyisGrafikleriniYukle`).
  - [27-veli-panel.md](27-veli-panel.md) — veli İlerleyiş'i her çocuk için `ilerleyisKartlari` ve
    `ilerleyisGrafikleriniYukle`.
  - `sutunGrafik`, `cizgiGrafik`, `guzelEksen` başka parçada doğrudan çağrılmıyor (yalnız bu dosyanın içinde).
- CSS: `25-grafik-sinav.css` — `.svg-grafik` (blok, %100 genişlik), `.izgara`, `.eksen-yazi` (`.soluk`, `.kucuk`),
  `.deger-yazi`, `.sutun` ve sonuç renkleri (`yapti` yeşil, `gec` mavi, `eksik` turuncu, `yapmadi` kırmızı, `izinli`
  soluk, `gelmedi` bordo, `belirsiz` gri), `.cizgi`, `.nokta`, `.bant`, `.bant-ort`, `.bant-tek`, hareket azaltılmamışsa
  sütunların büyüyüp çizginin çizilerek gelmesi, gösterge (`.g-cizgi`, `.g-bant`, `.g-ort`), `.odev-grafik[data-gorunum]`
  ile görünüm, `body.odev-grafik-kapali`, `.sinav-grafik .yer-tutucu` (parlayan yer tutucu), `.sg-araclar`, `.sg-alt`,
  `.sg-sablon-ad`, `.sg-cizim`, `.sg-bos`, `table.t td.sayi(.ana)`, `.odev-sutun` (250 px); tablo sarmalayıcı
  `05-tablo-grafik.css`; sekme düğmeleri `19-mesajlar.css` (`.sekme-satir`).

## Nasıl çalışır (adım adım)?

```
SAYFALAR.ilerleyisim ─► GET /api/progress ─► ilerleyisKartlari(d)
      .odev-sutun[data-sayim]  (boş, 250 px)         #sg-<öğrenci> (yer tutucu, 300 px)
   yaz(h) ─► ilerleyisGrafikleriniYukle([öğrenci])
      odevGrafikleriniCiz(): kutu 640 px ─► sutunGrafik({ genislik: 640, kategoriler: 7 }) ─► data-cizilen="640"
      sinavGrafigiYukle(öğrenci) ─► GET /api/exams/grafik?ogrenci=… ─► S.sg[öğrenci].veri ─► sinavGrafigiCiz
            şablon sekmeleri · Grafik|Liste · cizgiGrafik(seçili ölçüm, bant) · ölçüm sekmeleri · bant düğmesi
telefon yan çevrildi ─► resize (180 ms) ─► odevGrafikleriniCiz() (yeni genişlik) + sinavGrafigiCiz(her kutu)
"Türkçe Net" sekmesi ─► sg-olcum ─► yalnız yeniden çizim
"Deneme Sınavı" şablonu ─► sg-sablon ─► yeni istek (&sablon=…)
```

## Dikkat!

- **Bant küçük sınavlarda başkasının değerini ele verebilir** (kod okumasına göre). Bant, o sınava girenlerin en düşük,
  en yüksek ve ortalama değeridir ve sunucu bunu girenlerin sayısından bağımsız gönderir (`sayi` alanı da gelir ama bu
  dosya kullanmaz). Sınava yalnız iki öğrenci girdiyse en düşük ve en yüksekten biri öğrencinin kendisi, öteki de sınıf
  arkadaşının tam değeridir; üç kişide ortalamayla birlikte de çoğu zaman hesaplanabilir. Öğrenci ve veli bunu "En düşük
  / en yüksek bandı"nda (ve noktanın `title`'ında) görür. Kod değiştirilmedi. Öneri: sunucu bandı (ya da en az/en çoğu)
  az kişilik sınavlarda göndermesin (ör. `sayi < 5`), ön yüz de `sayi`'ya bakıp göstergeyi gizlesin; bu bir mahremiyet
  konusu olduğu için "Güvenlik denetimi" ve "KVKK tam denetimi" işlerine girmeli.
- **Eski veriyle bir an çizim.** `S.sg` çıkışta sıfırlanmaz ([26-baslat.md](26-baslat.md) "Dikkat!"). Kutu çizildikten
  sonra veri gelmeden pencere boyu değişirse `resize` aynı öğrenci için daha önce alınmış veriyi (aynı sekmedeki önceki
  bakıştan, başka bir kişinin oturumundan bile) çizer; veri gelince tazesiyle değişir. Seçili şablon/ölçüm de kişiler
  arasında taşınır (sunucu yetkiyi her istekte denetler).
- **Tek başına kalan değerler çizgi oluşturmaz.** Değerler arasında değeri olmayan sınav varsa çizgi orada kesilir; iki
  yanında birer değer kalırsa yalnız noktalar görünür (sunucusuz denendi: `[490.161, null, 455.5]` → 0 çizgi, 2 nokta).
  Bant ise boş sınavları atlayıp kenarları birleştirir.
- **Çizgi grafiğin değerleri ekran okuyucuya gitmez.** `aria-label` yalnız başlık; değerler `title`'larda ve "Liste"
  görünümündeki tabloda. Sütun grafiğinin etiketi bütün değerleri sayar.
- **Sütun adları kısa, renkler aynı.** Grafikte "İzinli" ve "Gelmedi"; listelerde ve ders grafiğinin göstergesinde
  "Gelmedi (izinli)" ve "Gelmedi (izinsiz)". Bir sütunun adını değiştirirsen `ODEV_GRAFIK_AD` ile `SONUC`'u
  ([02-ikonlar.md](02-ikonlar.md)) birlikte düşün.
- **Varsayım: şablonun en az bir ölçümü vardır.** `sinavGrafigiCiz` şablon varken `d.olcumler[0]`'a güvenir (`secili.ad`);
  sunucuda sınavların 1–30 ölçümü olduğu için bugün boş gelmez.
- **Düğmeler `S.sg[id]`'nin varlığına güvenir.** Kutu çizilmeden düğme olmadığı için sorun yok; başka bir yerden
  `sg-*` düğmesi üretirsen önce `sinavGrafigiYukle` çağır.
- **Tercihler tarayıcıya bağlı, hesaba değil.** `ee_sg_bant`, `ee_odev_grafik_gorunum`, `ee_odev_grafik_kapali`
  `localStorage`'da; aynı bilgisayardaki bütün hesaplar paylaşır.
- **Genişlik bilinmiyorsa 640.** Gizli bir kutuda sınav grafiği çizilirse (`clientWidth` 0) 640 piksel varsayılır;
  görünür olunca `resize` olmadan düzelmez. Bugün sınav kutusunu gizleyen bir düğme yok.
- Baş yorumdaki CSS dosyası adı eski (`25-grafik.css` → bugün `25-grafik-sinav.css`).

## Testleri

- `testler/test-sinav.js` — "GRAFİK" bölümü: öğrenci kendi grafiğini görür, sınavlar tarih sırasıyla, bant bilgisi
  (`bant.LGS.ust`), başka öğrencinin grafiği 403.
- `testler/buton-denetimi.js` (sunucusuz) — `sg-sablon`, `sg-olcum`, `sg-bant`, `sg-gorunum`, `odev-grafik-sekme`,
  `odev-grafik-gizle` eylemlerinin karşılığı ve ürettiği düğmeler; `/exams` yolunun sunucuda olması.
- `testler/test-ozellikler.js` — okulun kapattığı bölümün kapısı (ödev, etüt kapalıyken 403 `ozellikKapali`); sınavlar
  için yalnız "öteki bölümler kapalıyken sınavlar açık kalır" denetleniyor. Sınavlar kapalıyken grafik ucunun 403'ünü
  (kutudaki kırmızı ileti) deneyen test yok.
- Çizimi deneyen otomatik test yok. Bu belge yazılırken `guzelAdim`, `guzelEksen`, `sutunGrafik` ve `cizgiGrafik` sunucusuz
  (Node `vm`, yardımcılar taklit edilerek) çalıştırıldı: 174 → 0–200/50; 0–3 → 1'er; 5–5 → 4,5–5,5/0,25; 320 piksellik
  sütun grafikte iki kelimeli adlar iki satır ve küçük yazı; tek bantlı sınavda `bant-tek`.
- Elle: öğrenciyle İlerleyişim'i aç → ödev grafiği; "Derslere göre" → istek gitmeden görünüm değişir; "Grafiği gizle" →
  sayfayı yenile, gizli kalmalı. Sınav grafiğinde "Liste"ye geç, ölçüm sekmesine bas, bandı kapat-aç; tarayıcı
  penceresini daralt → yazılar küçülmeden grafik yeniden çizilir.

## Son durum

- `git log`: 8 commit, dosyanın depoya parça parça girişi: `f974d00 commit 231` (2026-09-25; `guzelAdim`, `guzelEksen`),
  `6ccc508 commit 232` (`grafikGenisligi`, `ikiSatir`, `sutunGrafik`), `45fa8d5 commit 233` (ödev sonuç grafiği),
  `62e242b commit 234` (`resize`, `S.sg`, kutu ve yükleme), `752fd41 commit 235` (`sinavGrafigiCiz`), `d5e2a0e commit 236`
  (`sg-*` eylemleri), `e0176a4 commit 237` (2026-09-25; ödev grafiği kartının `odev-grafik-sekme` / `odev-grafik-gizle`
  eylemleri).
- Son değişiklik `bb20f57 commit 325` (2026-09-26): `cizgiGrafik` eklendi (aynı commit `19e-servis-konum.js`,
  `21-ders-programi.js` ve `testler/seed.js`'e ekleme yaptı). Not: 235'teki `sinavGrafigiCiz` bu işlevi zaten çağırıyordu;
  commit'ler dosyanın depoya parça parça girişini gösterir, 235–325 arasında dosya tek başına eksikti. O günden beri
  değişmedi.
- Bilinen açıklar (kod değiştirilmedi): küçük sınavlarda bandın başkasının değerini göstermesi, çıkışta silinmeyen
  `S.sg`, çizgi grafiğin ekran okuyucuya değer vermemesi, eski CSS adı yorumu.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Sınav: formüllü ölçüm + Excel" (iş 14, öneri): hesaplanan ölçümler (ör. `D - Y/4`) ve "yüzde/katkı puanı"
    `olcumler` listesine gireceği için grafikte yeni sekmeler olarak görünecek; negatif netler eksende zaten destekli.
  - "Güvenlik denetimi" (iş 3) ve "KVKK ve onay metinleri tam denetimi" (iş 18): yukarıdaki bant/mahremiyet konusu.
  - "Android yerel uygulama" (iş 10): uygulamadaki İlerleyiş ekranı aynı ucu kullanacak; eksen ve bant kuralları
    buradakiyle aynı tutulmalı.
  - "Optimizasyon + saklama süreleri" (iş 7): öğrenci/veli yalnız son 1 geçmiş yılı görecek; grafiğin sınav dizisi
    kısalabilir.
  - "Çok dil" (iş 22): sayı biçimi (`sayiTR`) ve gösterge metinleri dile göre; "Arayüz önizlemesi" (iş 31): renkler CSS'te
    olduğu için tasarım dili değişikliği bu dosyaya dokunmadan yapılabilir.
