# Yazı düzenleyici · Word ya da Docs'tan yapıştırma

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Başka bir programdan (Word, Google Docs, bir web sayfası) kopyalanan yazının biçimini düzenleyicinin izinli biçimlerine çeviren,
gerisini atan temizlik.

## Ne işe yarar

Öğretmenler ödev açıklamasını, müdür duyuruyu çoğu zaman Word'de ya da Docs'ta hazırlayıp yapıştırır. O programların biçimi
(yazı tipleri, boyutlar, kendi renkleri, gizli biçim kodları) olduğu gibi gelirse yazı bozuk görünür ya da izin listesine takılıp kod
olarak çıkar. Tanım: "yapıştırılan Word/Google Docs biçimi temizlenir"; kalın, italik, liste gibi düzenleyicinin de yapabildiği
biçimler korunur.

## Nereden açılır

Düğmesi yok: yazı alanına yapıştırınca (Ctrl+V, Mac'te Cmd+V ya da sağ tık → Yapıştır; telefonda basılı tut → Yapıştır)
kendiliğinden çalışır.

## Adım adım

### Bugün (kodda)

Bugünkü düz yazı kutularına yapıştırılan her şey düz yazıya döner (biçim gelmez). Quiz sorularını Word'den toplu yapıştırmanın ayrı
bir yolu var ([Quiz · Metinden ekle](../quiz/metinden-ekle.md)).

### Yazan herkes (öğrenci dahil, tasarım)

1. Word'de, Docs'ta ya da bir sayfada yazıyı kopyala.
2. İmleci düzenleyicide istediğin yere koy, yapıştır.
3. Yazı gelir; **korunanlar**:
   - kalın (kalın etiketi ya da 600–900 / "bold" ağırlık), italik, altı çizili, üstü çizili;
   - başlıklar: 1. düzey → büyük başlık, 2. düzey → orta başlık, öbür bütün düzeyler → küçük başlık;
   - madde ve numaralı listeler, iç içe olanlar dahil (numara 1'den yeniden başlar);
   - ortalı, sağa ve iki yana hizalama;
   - girinti, en yakın 40 pikselin katına yuvarlanarak (en çok 200 piksel); alıntı bloğu bir düzey girinti olur;
   - `https://` bağlantılar (yeni sekmede açılır);
   - yazı rengi **yalnız** paletteki kırmızı, yeşil ya da maviyle **aynıysa**; sarı vurgu yalnız aynı sarıysa ([Renkler](renkler.md)).
4. **Atılanlar** (yazı kalır, biçim gider): yazı tipi ve boyutu, paletin dışındaki renkler ve zemin renkleri, `https` olmayan
   bağlantılar (yazısı kalır), satır aralığı, sınıf ve biçim kodları, yatay çizgi.
5. **Tamamen atılanlar** (içleriyle birlikte): betik, stil bloğu, meta bilgisi, gömülü çerçeve, nesne, `svg`, matematik, video, ses,
   tuval, form alanları ve düğmeler.
6. **Tablolar** tablo olarak gelmez: her hücrenin yazısı ayrı bir paragraf olur. Boş paragraflar silinir.
7. Panoda biçim yoksa (yalnız düz yazı) yazı olduğu gibi girer; içindeki görünmez karakterler silinir.
8. Sonuç izin listesinden geçirilir; kayıtta sunucu aynı kuralı yeniden uygular ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).

## Kurallar ve sınırlar

- Kural öğrenci dahil herkes için aynıdır (tanımın KURAL 5'i: "öğrencide </> düğmesi yok ama yapıştırılan içerik de bu kuraldan geçer").
- Görünmez Unicode karakterler (sıfır genişlikli boşluk, yön işaretleri…) yapıştırırken de silinir; Word'den gelen yazıda sık
  bulunurlar.
- Word bazı listeleri gerçek liste olarak değil, başında madde işareti karakteri olan paragraflar olarak verebilir; o zaman liste
  değil paragraf olarak kalır.
- **Resimler:** önizlemede yapıştırılan içindeki yalnız gömülü (veri olarak taşınan) PNG/JPEG/WebP resim kalır. Tanımda sunucu yalnız
  sitenin kendi ek adresindeki resmi kabul ettiği için yapıştırılan resmin ek olarak yüklenip yüklenmeyeceği yazmıyor; panodan
  doğrudan ekran görüntüsü yapıştırmanın ne olacağı da yazmıyor ([Fotoğraf ekle](fotograf-ekle.md)). Kodlanmadan önce karar gerekir.
- Sürükleyip bırakılan yazı için önizlemede ayrı bir temizlik yok; kaydederken yine temizlenir.
- Önizleme düzenleyicinin kendi ürettiği biçimi de kayıttan önce aynı yoldan yalınlaştırır (ör. tarayıcının `div`'ini `p`'ye,
  alıntı bloğunu girintiye çevirir); bu yüzden araç çubuğuyla yazılanla yapıştırılan aynı HTML'e varır.

## Kardeşler ve ilgili

**Kardeşler:** [İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md) · [HTML görünümü](html-gorunumu.md) · [Başlıklar](basliklar.md) ·
[Madde listesi](madde-listesi.md) · [Renkler](renkler.md) · [Fotoğraf ekle](fotograf-ekle.md).

**İlgili:** [Quiz · Metinden ekle](../quiz/metinden-ekle.md) (Word'den soru yapıştırma, ayrı ayrıştırıcı),
[Ödev verme](../odev/odev-verme.md), [Mesajlar · Duyuru](../mesaj/duyuru.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca düzenleyicinin ön yüz parçasında (yapıştırma olayı, biçimi yalınlaştırma) ve sunucudaki izin listesi
temizleyicisinde; Durum satırı güncellenir.

## Sık sorulanlar

- **Word'deki yazı tipim neden gitti?** Düzenleyicide yazı tipi seçimi yok; yazı sitenin yazı tipiyle görünür.
- **Tablom neden paragraflara dönüştü?** Düzenleyicide tablo yok; tabloyu dosya olarak ekleyebilirsin ([Mesajlar · Ekler](../mesaj/ekler.md)).
- **Renklerim neden gitti?** Yalnız paletteki üç renk ve sarı vurgu kalır.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
- Yapı belgesi: yapıştırılan resimlerin ne olacağı.
