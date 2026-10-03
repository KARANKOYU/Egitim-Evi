# Ödevler · Ödevlerde arama

**Durum:** Kodda var; tasarımda ek olarak ödev listesinin kutusunun içinde kendi "Ara" kutusu olur ve sınıf adında da arar (Tasarım 1 önizlemesi).

Ödev listesinde yazdığın kelimeyi ödevin adında, dersinde, öğretmeninde ve açıklamasında arayıp listeyi anında daraltmak.

## Ne işe yarar

Kullanıcı 28 Ağustos'ta "arama mükemmel çalışsın" dedi. Arama Türkçe harflere esnektir: şapkasız ya da noktasız yazsan da
bulur (`gunes` yazınca "Güneş sistemi maketi", `ayse` yazınca Ayşe Kaya'nın ödevleri). Süzgeçlerle birlikte çalışır
([Süzgeçler](suzgecler.md)).

## Nereden açılır

Üst şeritteki **"İçerik Ara"** kutusu. Ödev sayfalarında bu kutu ödev listesine bağlanır; öbür sayfalarda o sayfanın
satırlarını süzer ([Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md)).

Tasarımda (Tasarım 1 önizlemesi) ödev listesinin kutusunda süzgeçlerin başında ayrıca **"Ara"** kutusu var, yer tutucu
**"Ödev, ders ya da öğretmen"**.

## Adım adım

### Öğrenci (ve portaldaki veli, müdür)

1. "Ödevler" sayfasındayken üstteki **"İçerik Ara"** kutusuna yaz (ör. `kesir`).
2. Her harfte liste yeniden çizilir: ödevin **adında**, **dersinde**, **öğretmeninin adında** ya da **açıklamasında** geçen
   ödevler kalır. Büyük-küçük harf ve Türkçe harfler (ı/i, ş/s, ğ/g, ü/u, ö/o, ç/c, â/î/û) fark etmez.
3. Süzgeç kartının altındaki özet **"12 ödevden 2 tanesi gösteriliyor"** olur; hiçbiri uymazsa **"Bu filtrelere uyan ödev
   yok. "Temizle" ile filtreleri sıfırlayabilirsin."**
4. Kutuyu silince liste geri gelir; **"Temizle"** de kutuyu boşaltır.

### Öğretmen

- **"Ödevler"** sayfasında aynı: ad, ders ve açıklamada arar (öğretmen adı zaten sensin).
- Bir ödevin **kontrol ekranında** öğrenci satırları adlarıyla aranabilir olarak çizilir: kontrol ekranını **ana
  sayfandaki** "Aktif ödevler"den açtıysan kutu satırları öğrenci adına göre süzer; uyan yoksa **""ayse" için sonuç
  bulunamadı."** (yazdığın sadeleştirilmiş hâliyle). Bilinen açık (kod okumasına göre): kontrol ekranını **"Ödevler"
  sayfasından** açtıysan kutu hiçbir şey süzmez, çünkü ödev listesinin arama kancası kontrol ekranına geçince kaldırılmıyor
  ([Sonuçlandırma](sonuclandirma.md)).

### Veli

Velinin **"Ödevler"** sayfasında kutu satırları **çocuğun adına**, **ödevin adına** ve **dersine** göre gizler/gösterir
(açıklama ve öğretmen adı aranmaz). Uyan yoksa **""fen" için sonuç bulunamadı."**

### Müdür

**"Ödevler"** (ders ders görünüm) sayfasında kutu ders dallarını **sınıf adına**, **ders adına** ve **dersin öğretmenine**
göre süzer ([Müdürün ödev görünümü](mudurun-odev-gorunumu.md)).

### Tasarımda (Tasarım 1 önizlemesi)

- Listenin kendi **"Ara"** kutusu; yazdıkça liste ilk 15'ten yeniden çizilir, başlıktaki sayı ("3 ödev") güncellenir.
- Aranan yerler: ödevin adı, öğretmeni, dersin adı ve sınıfı ("7-A"). Türkçe harfler esnek.
- Arama doluyken **"Süzgeçleri temizle"** görünür ve aramayı da boşaltır.
- Uyan yoksa **"Bu süzgeçlerle ödev yok."**

## Kurallar ve sınırlar

- **Yalnız ekrandaki listede arar.** Bugün ödev listesi sayfa açılırken bir kez gelir, arama tarayıcıda yapılır; sunucuya
  istek gitmez.
- **Sayfa değişince silinir.** Başka sayfaya geçince arama kutusu boşalır.
- **Süzgeçlerle VE bağlanır:** "Durum: Yapmadı" seçiliyken `fen` yazarsan Fen'den yapmadığın ödevler kalır.
- **Aranmayanlar:** ekin adı, quiz soruları, öğretmenin kontrol ekranındaki sonuçlar. Velinin listesinde açıklama ve öğretmen.
- **Bilinen küçük açık:** velinin ve kontrol ekranının "… için sonuç bulunamadı." iletisi yazdığını sadeleştirilmiş (küçük
  harf, şapkasız) hâliyle gösterir.

## Kardeşler ve ilgili

**Kardeşler:** [Süzgeçler](suzgecler.md) · [Ödev listesi](liste.md) · [Sonuçlandırma](sonuclandirma.md) ·
[Müdürün ödev görünümü](mudurun-odev-gorunumu.md).

**İlgili:** [Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md), [Üst şerit](../menu-ve-arama/ust-serit.md),
[Eğitim içeriklerinde arama](../egitim-icerikleri/arama.md).

## Kod tarafı

- Ödev sayfaları: [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) — `S.araHook = odevSonucCiz`;
  `odevFiltrele` arama metnini `nrm` ile sadeleştirip ad + ders + öğretmen + açıklamada arar. Öğretmen sayfası aynı kancayı
  kurar ([11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) `SAYFALAR['ogr-odevler']`).
- Öbür sayfalar ve genel arama: [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md)
  — `araUygula` (sayfa kendi kancasını kurduysa onu çalıştırır; yoksa `[data-ara]` satırlarını gizler, boşsa `#araBos`).
  `data-ara` değerleri: velinin satırı (çocuk adı + ödev + ders, [27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md)),
  kontrol ekranı (öğrenci adı), müdürün ders dalı (sınıf + ders + öğretmen, [11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md)).
- Harf sadeleştirme: [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) (`TR_SADE`, `nrm`). Kutu
  ve olay bağlama: `public/index.html` (`#araKutu`, yer tutucu "İçerik Ara"), [25-tiklama.md](../../public/js/parcalar/25-tiklama.md)
  (`oninput = araUygula`), [07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) (`git` kutuyu boşaltır).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Filtreleme ve arama").

## Sık sorulanlar

- **`ogretmen` yazdım, "Öğretmen" geçen ödevler geldi; doğru mu?** Evet; ğ, ö gibi harfler sadeleştirilerek karşılaştırılır.
- **Ekteki dosya adına göre arayabilir miyim?** Hayır; ad, ders, öğretmen ve açıklamada arar.
- **Kontrol ekranında bir öğrenciyi nasıl bulurum?** Ekranı ana sayfadan açtıysan üstteki kutuya adını yaz; yalnız o satır
  kalır. "Ödevler" sayfasından açtıysan bugün kutu çalışmıyor (yukarıdaki açık); satırlar ad sırasıyla dizili.

## Sırada

- Ödev listesi düzeni: aramanın listenin kendi "Ara" kutusuna taşınması ve sınıf adında da araması.
- Üst şerit sadeleştirme: portaldaki arama düğmesi üst şeritte kalacak ([Üst şerit](../menu-ve-arama/ust-serit.md)).
