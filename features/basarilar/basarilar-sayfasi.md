# Başarılar · Başarılar sayfası (okul tarafı)

**Durum:** Tasarlandı — henüz kodda yok

Müdürün (ve "Başarı ekler" yetkisi olanın) okulun öğrencilerine ait bütün belgeleri sınıf sınıf gördüğü ve yeni belge
eklediği sayfa.

## Ne işe yarar

Öğrenci ve velinin "Başarılarım" / "Başarıları" sayfası tek bir öğrencinin belgelerini gösterir. Okulun ise bütün belgeleri
bir arada görmesi, sınıfa göre süzmesi ve yeni belgeyi buradan eklemesi gerekir. Tasarım 1 önizlemesinde müdürün menüsüne
2 Ekim'de "Başarılar" sayfası ve resim önizlemeli "Başarı ekle" eklendi.

## Nereden açılır

- **Müdür:** sol menüde "Okul düzeni" grubunda, **"Devamsızlık"**ın altında, **"Etütler"**in üstünde yıldız simgeli
  **"Başarılar"** satırı ([Sol menü](../menu-ve-arama/sol-menu.md)).
- Sayfanın başlığı **"Başarılar"**, altındaki satır **"Öğrencilere verilen belgeler; öğrencinin hesabında kalır"**.
- **Yetkili çalışan ya da öğretmen:** tanıma göre "Başarılar" → "Başarı ekle" yolu ona da açılır
  ([yetki](basari-ekleme-yetkisi.md)); önizlemede yalnız müdür hesabında çizildi.

## Adım adım

### Müdür

Sayfanın düzeni yukarıdan aşağı:

1. **Üst şerit:** soldan sınıf düğmeleri (yuvarlak "çip"ler) — **"Bütün sınıflar"** ve okulun her sınıfı (ör. "7-A", "7-C",
   "8-B"); seçili olan koyu zeminli. Şeridin en sağında artı simgeli **"Başarı ekle"**.
2. **"Son eklenenler" kutusu:** başlığın solunda sarı zeminli yıldız simgesi, sağında **"<N> belge"** (süzülmüş listedeki
   belge sayısı).
3. **Satırlar:** solda belgenin küçük resmi (A4 yatay oranında), sağında kalın başlık ve altında soluk yazıyla
   **"<öğrenci> · <sınıf> · <veren kurum> · <verildiği tarih>"** (ör. "Deniz Aydın · 7-A · Test Ortaokulu · 3 Mart 2026").
4. **Kutunun altında not:** "Toplu ekleme: birden çok dosya seç; dosya adı öğrenci numarasıysa (ör. 214.png) kendiliğinden
   eşleşir." (öneri; bkz. [Başarı ekle](basari-ekleme.md))

Yapabileceklerin:

1. Bir sınıf düğmesine bas → liste yalnız o sınıfın öğrencilerinin belgelerine iner; sayı da ona göre değişir. Hiç belge
   yoksa satır yerine **"Bu sınıfta başarı belgesi yok."** yazar. **"Bütün sınıflar"** ile süzgeci kaldır.
2. Bir satıra tıkla (ya da klavyeyle satıra gelip Enter) → [Başarı penceresi](basari-penceresi.md#müdür): büyük resim,
   bilgiler, "İndir"; okulunun eklediği belgede "Sil".
3. **"Başarı ekle"** → [Başarı ekle](basari-ekleme.md) penceresi. Eklediğin belge listenin en başına gelir.

### Çalışan ve yetkili öğretmen

Rolünde "Başarı ekler" yetkisi varsa tanıma göre aynı sayfayı kullanırsın: belgeleri görür, "Başarı ekle" ile eklersin.
Rolün "Sınıflar" kapsamı "Kendi sınıfları" (ya da seçili sınıflar) ise tanıma göre yalnız o sınıflara eklersin; böyle
bir rolde sınıf düğmelerinde hangi sınıfların görüneceği önizlemede çizilmedi.

## Kurallar ve sınırlar

- **Listede neler var:** okulun öğrencilerinin bütün başarıları; öğrencinin önceki okulundan ya da başka bir kurumdan gelen
  belgeler de (kullanıcının 29 Eylül kararı: "kurum görsün"). Önizlemede öğrencinin önceki okulunun eklediği belge de bu
  listede.
- **Sıra:** son eklenen en üstte ("Son eklenenler").
- **Süzgeç yalnız sınıf:** sayfada arama kutusu ya da tarih süzgeci yok (önizlemede).
- **Silme hakkı:** listede görmen silebileceğin anlamına gelmez; yalnız okulunun eklediği belgede "Sil" çıkar
  ([Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md)).
- **Kim girer:** müdür; "Başarı ekler" yetkili rol sahibi. Öğrenci, veli, servisçi bu sayfayı görmez.

Önizleme notu: örnek satırların bir kısmı önizlemede tam başarı penceresi yerine kısa bir ayrıntı penceresi açıyor; tasarımda
her satır aynı [Başarı penceresi](basari-penceresi.md)'ni açar.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Başarılar](README.md)):

- [Başarı ekle](basari-ekleme.md) — sağ üstteki düğmenin açtığı pencere.
- [Başarı penceresi](basari-penceresi.md) — satıra tıklayınca açılan ayrıntı.
- ["Başarı ekler" yetkisi](basari-ekleme-yetkisi.md) — sayfayı müdürden başka kimin kullanacağı.
- [Başarılarım ve Başarıları](basarilarim.md), [Kimler görür](kimler-gorur.md),
  [Kalıcılık, düzeltme ve silme](kalicilik-ve-silme.md).

**İlgili:**

- [Sol menü](../menu-ve-arama/sol-menu.md) — "Okul düzeni" grubu.
- [Öğrenciler listesi](../hesaplar/ogrenci-listesi.md), [Hesap penceresi](../hesaplar/hesap-penceresi.md) — öğrencinin
  penceresinden de "Başarı ekle".
- [Sınıfın sayfası](../siniflar-dersler/sinif-sayfasi.md) — sınıf düğmelerindeki sınıflar.

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı yerler:

- Menü satırı: [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md).
- Müdür ekranları: [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md).
- Yetki denetimi: [sunucu/yetki.md](../../sunucu/yetki.md) (bugünkü katalogda başarı yetkisi yok).

## Sık sorulanlar

- **Bir öğrencinin bütün belgelerini nasıl görürüm?** Sınıfını seç, satırlara bak; ya da öğrencinin portalını açıp
  "Başarılarım"a gir.
- **Listede önceki okulun eklediği bir belge var, silemiyorum.** Belgeyi o kurum ekledi; düzeltme ve silme yalnız onda.
- **Mezun olan öğrencilerin belgeleri burada mı?** Tanımda bu sayfa için ayrıca yazılmadı; belgeler öğrencinin hesabında
  kalır ([Mezunlar](../egitim-yili/mezunlar.md)).

## Sırada

- Başarılarım işi: sayfa bu belgeye ve Tasarım 1 önizlemesine göre kodlanacak.
- Toplu ekleme (öneri) kullanıcıya sorulacak; onaylanırsa bu sayfadan açılır.
- Çok dil: "Başarılar", "Son eklenenler", "Bütün sınıflar", "Bu sınıfta başarı belgesi yok." çeviri kataloğuna girecek.
