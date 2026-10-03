# Yazı düzenleyici · Girintiyi artır / azalt

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Paragrafı ya da liste maddesini her basışta 40 piksel sağa kaydıran (en çok 5 kez) ve geri getiren iki düğme.

## Ne işe yarar

Bir paragrafı öncekinin altına bağlı göstermek, alıntıyı içeri almak ya da listede alt madde yapmak için. Kesin araç çubuğunda
hizalama düğmelerinin yanında yer alır (1 Ekim). İlk önizlemede yoktu; önizlemenin kullanıcının isteklerine karşı denetimi
"girinti artır/azalt yok" diye eksik yazdı ve eklendi.

## Nereden açılır

"Hizalama ve girinti" grubunun son iki düğmesi ([Araç çubuğunun düzeni](arac-cubugu.md)):
sağa ok ve satırlar **"Girintiyi artır (Ctrl+])"**, sola ok ve satırlar **"Girintiyi azalt (Ctrl+[)"**.

## Adım adım

### Bugün (kodda)

Yok; satır başına boşluk koyarsan düz metin olarak görünür.

### Yazan herkes (öğrenci dahil, tasarım)

1. İmleci paragrafa koy ya da birkaç paragrafı seç.
2. **Girintiyi artır**'a bas: paragraf 40 piksel sağa kayar. Her basış 40 piksel daha; tanıma göre **en çok 5 kat (200 piksel)**.
   Tasarım 1 önizlemesinde düğme 5. kattan sonra da yazı alanında içeri almayı sürdürür; ama gönderilen ya da kaydedilen yazıda
   girinti 200 piksele indirilir.
3. **Girintiyi azalt**: 40 piksel geri. Girintisiz paragrafta bir şey yapmaz.
4. **Liste maddesinde** "Girintiyi artır" maddeyi bir alt düzeye indirir (iç içe liste), "Girintiyi azalt" geri çıkarır
   ([Madde listesi](madde-listesi.md), [Numaralı liste](numarali-liste.md)).
5. Bu iki düğmenin "basılı" hâli yoktur.
6. Tab tuşu girinti yapmaz; odağı sayfadaki bir sonraki öğeye geçirir.

### Okuyan herkes

Paragraf soldan girintili görünür.

## Kurallar ve sınırlar

- HTML'de `style="margin-left: 40px"` … `200px` (40'ın 1–5 katı). Tanım bunu **paragraf ve liste maddesi** (`p`, `li`) için
  sayıyor; önizleme başlıklara (h3–h5) da izin veriyor — kodlanırken biri seçilmeli.
- Tarayıcının kendi girintisi alıntı bloğu (`blockquote`) üretir; kayıtta her düzey 40 piksellik `margin-left`'e çevrilir,
  `blockquote` sunucuya hiç gitmez.
- </> ile yazarken 40'ın katı olmayan ya da 200'ü aşan bir değer (ör. `margin-left: 30px`, `240px`) izinli değildir: o etiket
  bütünüyle **düz metin** olur ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)). Araç çubuğuyla bu olmaz: düğmeyle verilen
  girinti hep 40'ın katıdır ve kayıtta en çok 200 piksele indirilir. Kodlanırken düğmenin 5. katta durması (basılamaz olması) daha
  açık olur; önizlemede durmuyor.
- Yapıştırılan yazının girintisi en yakın 40'ın katına yuvarlanır, en çok 200 piksel ([Yapıştırma](yapistirma.md)).
- </> görünümünden gelen girinti önizlemede tarayıcının değil düzenleyicinin kendi koduyla azaltılır; bu adım geri alma geçmişine
  girmez ([Geri al · Yinele](geri-al-yinele.md)).
- Kısayollar (Ctrl+] ve Ctrl+[) önizlemenindir; tanımın kısayol listesinde yok ([Klavye kısayolları](kisayollar.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Hizalama](hizalama.md) · [Madde listesi](madde-listesi.md) · [Numaralı liste](numarali-liste.md) ·
[Klavye kısayolları](kisayollar.md).

**İlgili:** [Ödev verme](../odev/odev-verme.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca düzenleyicinin ön yüz parçasında ve sunucudaki izin listesinde (`margin-left`); Durum satırı güncellenir.

## Sık sorulanlar

- **Neden daha fazla içeri alamıyorum?** Tanımın sınırı en çok 5 kat (200 piksel); daha fazlası kayıtta 200 piksele indirilir.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
- Yapı belgesi: girintinin başlıklarda da olup olmayacağı; "Girintiyi artır"ın 5. katta durması.
