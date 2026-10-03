# Yazı düzenleyici · HTML görünümü (</>) — öğrencide yok

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Yazının arkasındaki HTML kodunu gösteren, elle düzenletip dönüşte izin listesiyle temizleyen düğme; öğrenci dışında herkeste var.

## Ne işe yarar

Kullanıcının seçtiği örnek düzenleyicide vardı; "kaynak koda geçiş" olarak kesin listeye girdi (1 Ekim). Biçimi kod olarak
görmek, bozulmuş bir yapıyı (fazla boş paragraf, yanlış iç içe liste) elle düzeltmek ya da HTML bilen biri için biçimi doğrudan
yazmak için. Kod ne olursa olsun yalnız araç çubuğunun üretebildiği biçimler çalışır; ötesi düz metin olur.

**Kimde var — kullanıcının düzeltmesi (1 Ekim):** kullanıcının ilk sözü ("… html şeyi yazımı müdür öğretmen öğrenci dışında
herkes …") önce "</> müdür, öğretmen ve öğrencide olmayacak, diğer rollerde olacak" diye okundu; kullanıcı bu okunuşu görünce
düzeltti: **"hayır, sadece öğrencide olmayıp diğer herkeste olacak"**. Kesin: </> **yalnız öğrencide yok**; müdür, öğretmen,
çalışan ve özel roller, veli, servisçi, yönetici, destek, eğitmen ve (planlı) çevirmen — hepsinde var.

## Nereden açılır

"Ekle" grubunun ilk düğmesi: **</>**, ipucu **"HTML görünümü"** ([Araç çubuğunun düzeni](arac-cubugu.md)). Kısayolu yok.
Öğrencide bu düğme hiç görünmez.

## Adım adım

### Bugün (kodda)

Yok. Bugün bir yazı alanına HTML yazarsan okuyan onu harf harf görür; hiçbir etiket çalışmaz.

### Veli, öğretmen, çalışan, müdür, servisçi, eğitmen, destek, yönetici (tasarım)

1. Yazını düzenleyicide yaz ya da biçimle.
2. **</>**'ye bas. Yazı alanının yerine eş genişlikli yazı tipiyle bir **kod kutusu** ("HTML kodu") açılır. İçinde yazının
   temizlenmiş HTML'i durur; her paragraf, başlık, liste ve madde ayrı satırda.
3. </> düğmesi dolu (ana renkte) görünür; araç çubuğundaki **öbür bütün düğmeler soluklaşır ve basılamaz**.
4. Kodu düzenle. Kod kutusu aşağı doğru büyütülebilir; yazım denetimi kapalıdır.
5. **</>**'ye yeniden bas: düzenleyici görünümüne dönersin. Kod **izin listesinden geçirilerek** yazıya döner: izinli biçimler
   çalışır, izinsiz her etiket **olduğu gibi düz metin** olarak yazının içinde görünür (ne yaptığını görürsün)
   ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
6. Kod kutusu açıkken **"Gönder"**/**"Kaydet"**e basarsan da aynı temizlenmiş yazı gider (önizleme her tuşta arkadaki yazıyı
   temizleyip günceller).

Örnek (önizlemedeki gibi): kod kutusuna

```
<p>Yarın <b>9.00</b>'da bahçede toplanıyoruz.</p>
<p onclick="alert(1)">Tıkla</p>
```

yazıp </>'ye dönersen ilk satır biçimli (9.00 kalın), ikincisi ekranda harf harf `<p onclick="alert(1)">Tıkla</p>` olarak görünür.

### Öğrenci (tasarım)

</> düğmesi yok. Öğrenci yine bütün öbür düğmeleri kullanır. Başka bir yerden yapıştırdığı biçimli yazı da aynı izin listesinden
geçer ([Yapıştırma](yapistirma.md)); HTML kodunu düz yazı olarak yapıştırırsa kod harf harf görünür. Önizlemede düğme açık olan
oturumun rolüne bakar: aynı kişinin öğrenci oturumunda yok, başka bir oturumunda (ör. veli) vardır.

## Kurallar ve sınırlar

- Sunucunun izin listesi **herkes için aynıdır**; </> fazladan yetki vermez. </> ile yazılan izinsiz etiket ve nitelik silinmez,
  çalışmaz, düz metin olur. Kural öğrenci dahil herkes için aynı (tanımın KURAL 5'i).
- Dönüşte ve kayıtta temizlenir; gösterimde ikinci kez temizlenir (eski kayıtlar için).
- </> ile yazılırken bilinmesi gerekenler (ayrıntısı [İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)'da):
  - başlıklar `<h3>`, `<h4>`, `<h5>`; `<h1>`, `<h2>` düz metin olur;
  - `<div>` yok, paragraf `<p>`;
  - bağlantı yalnız `https://` adresle; kod kutusunda her bağlantının yanında görünen `target="_blank"` ve
    `rel="noopener nofollow"`'u sunucu kendisi yazar, bunlara dokunma (başka değer verirsen etiket düz metin olur); resim yalnız
    sitenin ek adresiyle ve yalnız `src`;
  - `style` yalnız paletteki yazı rengi, sarı vurgu, hizalama ve 40'ın 1–5 katı girinti;
  - `id`, `class`, `title`, `alt`, `width`, `on…` gibi bütün öbür nitelikler o etiketi düz metne çevirir;
  - HTML yorumu (`<!-- -->`) düz metin olur.
- Kod kutusunda düzenleyicinin kısayolları çalışmaz; kutunun kendi Ctrl+Z'si çalışır ([Klavye kısayolları](kisayollar.md)).
- Kod kutusunda renklendirme ya da satır numarası yok (okul sayfasının CSS kutusundan farklı:
  [Görünüm ve CSS](../okul-sayfasi/gorunum-ve-css.md)).

## Kardeşler ve ilgili

**Kardeşler:** [İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md) · [Yapıştırma](yapistirma.md) ·
[Araç çubuğunun düzeni](arac-cubugu.md) · [Geri al · Yinele](geri-al-yinele.md).

**İlgili:** [Okul sayfası · Görünüm ve CSS](../okul-sayfasi/gorunum-ve-css.md) (okulun CSS'i de izin listesiyle temizlenir),
[Eklentiler · Sınırlar](../eklentiler/sinirlar.md) (eklentinin şablonu da "izin dışı her şey düz metin" ilkesine bağlı),
[Dil ve çeviri · Çevirmen rolü](../dil/cevirmen-rolu.md).

## Kod tarafı

Bugün kodda yok. Bugün okulun CSS'i için benzer bir izin listesi temizleyicisi var:
[sunucu/yardimci/css-temizle.md](../../sunucu/yardimci/css-temizle.md). Kodlanınca düzenleyicinin ön yüz parçasında (kod kutusu,
rol denetimi) ve sunucudaki HTML temizleyicisinde; Durum satırı güncellenir.

## Sık sorulanlar

- **Öğrenciler neden </> göremiyor?** Kullanıcının kararı (1 Ekim): yalnız öğrencide yok. Güvenlik açısından fark yok; sunucu herkesin
  yazısını aynı kuralla temizler.
- **Yazdığım kod neden ekranda harf harf çıktı?** İzin listesinde olmayan bir etiket ya da nitelik kullandın; düz metne çevrildi.
  Araç çubuğundaki düğmelerle yap ya da izinli etiketleri kullan.

## Sırada

- Düzenleyiciler (iş 15, onaylı) ve güvenlik denetimi (iş 3): </> ile yazılan her yasak kategorinin düz metin olarak döndüğünün
  testi.
