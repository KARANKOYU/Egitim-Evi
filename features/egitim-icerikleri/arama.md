# Eğitim içerikleri · Arama

**Durum:** Tasarlandı — henüz kodda yok

Sayfanın üstündeki "Video, konu ya da eğitmen ara" kutusu: yazdıkça videoları başlıkta, derste, eğitmenin @kullanıcı adında,
etiketlerde ve "N. sınıf" yazısında arar; Türkçe harfler ve büyük/küçük harf fark etmez.

## Ne işe yarar

Tanımdaki "ders/sınıf süzgeci, arama" maddesi (28 Eylül) ve 29 Eylül'deki "arama: metin + filtreler". Konunun adını bilen öğrenci
("kesir", "üslü", "mitoz") ya da sevdiği eğitmeni arayan kişi süzgeçlere uğramadan bulur.

## Nereden açılır

Eğitim içerikleri sayfasının üst satırının solu: büyüteç simgeli kutu, yer tutucu **"Video, konu ya da eğitmen ara"** (sesli adı
"Eğitim içeriklerinde ara"). Ziyaretçide de var ([Video listesi](video-listesi.md)).

## Adım adım

### Herkes (ziyaretçi dahil)

1. Kutuya yaz (ör. **"lgs"**). Her harfte sonuçlar yenilenir; "Ara" düğmesi yoktur.
2. Özet satırına tırnak içinde aranan söz çip olarak gelir: **"“lgs”"**; çipin × işareti aramayı siler (kutu da boşalır).
3. Arama, sınıf ve ders süzgeçleriyle ve seçili bölümle (ör. "Kaydettiklerim") birlikte çalışır: hepsine uyan videolar kalır.
4. Kutuyu boşaltınca arama kalkar.

### Eğitmen (liste doldururken)

Eğitmen kendi oynatma listesine video eklerken ayrı bir arama kutusu kullanır: **"Eğitim içeriklerinde ara"**, yer tutucu
**"Video, ders, sınıf ya da etiket"** ([Eğitmen serileri](egitmen-serileri.md)).

## Kurallar ve sınırlar

- **Nerede arar:** videonun başlığı + dersi + eğitmenin @kullanıcı adı + bütün etiketleri + "N. sınıf" yazısı (bu yüzden
  "7. sınıf" yazmak da çalışır). Açıklamanın içinde aramaz (Tasarım 1'de).
- **Nasıl eşler:** yazdığın, bu birleşik metnin İÇİNDE geçmeli (kelimenin başı olması gerekmez: "üs" "Üslü ifadeler"i bulur).
- **Harf kuralı:** büyük/küçük harf fark etmez; "ı, İ" → "i", "ş" → "s", "ğ" → "g", "ü" → "u", "ö" → "o", "ç" → "c" eşlenir;
  baştaki ve sondaki boşluk atılır. "inkilap" yazsan "İnkılap" bulunur.
- **Birden çok kelime** tek bir dizgi olarak aranır (Tasarım 1'de kelimeler ayrı ayrı aranmaz; "toplama kesir" yazınca bu iki kelime
  yan yana geçmiyorsa sonuç çıkmaz).
- Arama süzgeçlerle "ve" ile birleşir ([Süzgeç mantığı](suzgec-mantigi.md)); "Hepsini temizle" aramayı da siler.
- **Eğitmenin tam adı aranmaz:** kullanıcı 28 Eylül'de "ismi değil hesap kullanıcı adı olsun" dedi; ekranda yalnız @kullanıcı adı
  yazar ([Video listesi](video-listesi.md)). Tam adla arama, gizlenen adı @kullanıcı adına bağlamış olurdu.

**Tasarımda (Tasarım 1 önizlemesi):** arama eğitmenin TAM ADINDA da eşleşiyor ("Deniz Ak" yazınca @deniz.ak'ın videoları geliyor);
tanıma göre yalnız @kullanıcı adı. HTML işinde düzeltilecek.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Süzgeç mantığı](suzgec-mantigi.md) — aramanın süzgeçlerle birleşmesi.
- [Etiketler](etiketler.md) — etiketle bulmanın yolu arama.
- [Etkin süzgeç çipleri](etkin-suzgecler.md) — aramanın çipi.
- [Sıralama](siralama.md) — sonuçların sırası.

**İlgili:**

- [Ödevlerde arama](../odev/arama.md) — ödev listesinin kendi araması.
- [Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md) — üst şeritteki "İçerik Ara".

## Kod tarafı

Bugün kodda yok. Örnek alacağı bugünkü parça:

- Türkçe harfe ve yazım hatasına dayanıklı okul arama motoru: [sunucu/yardimci/bulanik-arama.md](../../sunucu/yardimci/bulanik-arama.md).

## Sık sorulanlar

- **"inkilap" yazdım, buldu mu?** Evet; Türkçe harfler eşlenir.
- **Eğitmeni nasıl ararım?** @kullanıcı adıyla (ör. "deniz.ak"); tam adı ekranda gösterilmediği için aramada da yoktur.
- **Açıklamada geçen bir kelimeyi bulmuyor.** Arama başlık, ders, eğitmen, etiket ve sınıfta yapılır; açıklamada değil.

## Sırada

- Eğitim içerikleri (iş 17): arama (sunucuda, sayfalı).
- Kodlanırken birden çok kelimenin ayrı ayrı aranması (okul aramasındaki gibi) ve açıklamada arama önerilir; kullanıcı kararı yok.
- Önizlemedeki tam adla arama HTML işinde kaldırılacak (yalnız @kullanıcı adı).
