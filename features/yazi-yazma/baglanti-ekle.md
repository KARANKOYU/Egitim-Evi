# Yazı düzenleyici · Bağlantı ekle

**Durum:** Tasarlandı — henüz kodda yok (Tasarım 1 önizlemesinde çalışır).

Seçili yazıyı tıklanınca bir internet adresine götüren bağlantıya çeviren (ya da yazı seçili değilse görünecek yazıyı ve adresi
soran) düğme.

## Ne işe yarar

Kullanıcı 25 Eylül'de ödev ve mesaj ekranları için "oradaki linklere tıklanabilirlik" istedi. 1 Ekim'de nasıl çalışacağını kendisi
tarif etti: "bir metin yazacak, onu seçecek, seçili hâlde bağlantıya basınca girdiği bağlantıya atacak metin". Yani yazı aynen
kalır, tıklanabilir olur. Ödev açıklamasında bir konu anlatım videosuna, mesajda okulun bir sayfasına göndermek için.

## Nereden açılır

"Ekle" grubunun son düğmesi: zincir halkası, ipucu **"Bağlantı ekle (Ctrl+K)"** ([Araç çubuğunun düzeni](arac-cubugu.md)).
Basınca ayrı bir pencere değil, **araç çubuğunun hemen altında** küçük bir kutu açılır.

## Adım adım

### Bugün (kodda)

Düzenleyici yok. Yazıya yapıştırılan bir adres düz metin olarak görünür, **tıklanmaz**; okuyan onu kopyalayıp tarayıcıya yapıştırır.

### Yazan herkes (öğrenci dahil, tasarım) — yazı seçiliyken

1. Yazıyı yaz (ör. "Konu tekrarı videosu"), fareyle ya da parmağınla seç.
2. **Bağlantı ekle**'ye bas (ya da Ctrl+K). Araç çubuğunun altında kutu açılır:
   - başlık **"Bağlantı ekle"**,
   - **"Seçili yazı: Konu tekrarı videosu"** satırı,
   - **"Adres"** alanı (yer tutucu "https://"); imleç bu alanda,
   - düğmeler **"Vazgeç"** ve **"Ekle"**.
3. Adresi yaz ya da yapıştır (ör. `https://egitimevi.org/sss`), **"Ekle"**ye bas ya da Enter'a. Seçili yazı bağlantı olur: yazı
   aynen kalır, mavi ve altı çizili görünür.
4. Vazgeçmek için **"Vazgeç"** ya da Esc; kutu kapanır, seçimin geri gelir.

### Yazan herkes — hiçbir yazı seçili değilken

1. İmleç bağlantının gireceği yerdeyken **Bağlantı ekle**'ye bas. Kutu bu kez iki alan gösterir:
   - **"Görünecek yazı"** (yer tutucu "ör. EBA kesirler videosu", en çok 200 karakter); imleç bu alanda,
   - **"Adres"** (yer tutucu "https://").
2. İkisini doldur, **"Ekle"**. Bağlantı imlecin olduğu yere girer, arkasına bir boşluk eklenir (yazmaya bağlantının dışında devam
   edersin).
3. **"Görünecek yazı"yı boş bırakırsan adresin kendisi yazılır.**

### Yazan herkes — var olan bir bağlantıyı değiştirme ya da kaldırma

1. İmleci bağlantının üstüne koy, **Bağlantı ekle**'ye bas. Kutunun başlığı **"Bağlantıyı düzenle"** olur; "Seçili yazı:"
   satırında bağlantının yazısı, "Adres"te bugünkü adresi durur.
2. Adresi değiştirip **"Kaydet"**e bas; ya da **"Bağlantıyı kaldır"**a bas: yazı kalır, bağlantı kalkar. **"Vazgeç"** hiçbir şeyi
   değiştirmez.

### Okuyan herkes

Bağlantı mavi ve altı çizili görünür. Tıklayınca adres **yeni sekmede** açılır; Eğitim Evi sayfan açık kalır. Yazı alanının
içindeyken (yazarken) bağlantıya tıklamak onu açmaz, yalnız imleci koyar.

## Kurallar ve sınırlar

- **Yalnız https.** Adres `https://` ile başlamalı, içinde boşluk olmamalı ve bir alan adı (noktalı) taşımalı. Uymazsa kutunun
  içinde kırmızı satır: **"Adres https:// ile başlamalı."** (ör. `http://…`, `www.…`, boşluklu bir adres ya da noktasız
  `https://localhost` bu iletiyi verir); bağlantı eklenmez, imleç "Adres"e döner.
- Bağlantılar her zaman yeni sekmede ve `rel="noopener nofollow"` ile açılır; sunucu her kayıtta bunu kendisi yazar.
- Tanımın izin listesinde bağlantının tek niteliği `href`'tir (yalnız https); `target` ve `rel`'i sunucu kendisi yazar. Önizleme
  bu ikisini de yalnız kendi değerleriyle (`_blank`; `noopener` ya da `noopener nofollow`) kabul ediyor, çünkü </> kutusunda
  görünüyorlar. `javascript:`, `data:`, `http:` adresli ya da başka nitelik taşıyan bir bağlantı (ör. `onclick`) çalışmaz: o etiket
  **düz metin** olarak görünür ([İzinli ve izinsiz kod](izinli-ve-izinsiz-kod.md)).
- Yapıştırılan yazıdaki https bağlantıları kalır; https olmayan bağlantının yalnız yazısı kalır ([Yapıştırma](yapistirma.md)).
- Ctrl+K önizlemenin kısayoludur; tanımın kısayol listesinde yok ([Klavye kısayolları](kisayollar.md)).
- **Site duyurusu farkı:** panelin önizlemesindeki eski küçük düzenleyicide hata iletisi "Bağlantı https:// ile başlamalı (ör.
  https://egitimevi.org/sss)." ve `rel` "noopener noreferrer"; ortak düzenleyiciye geçince yukarıdaki kural geçerli olur
  ([Düzenleyicinin bulunduğu yerler](nerelerde-var.md)).
- Toplantı bağlantısı düzenleyicide değil, toplantının kendi alanında yazılır ([Görüşme bağlantıları](../toplanti/gorusme-baglantilari.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Fotoğraf ekle](fotograf-ekle.md) · [HTML görünümü](html-gorunumu.md) · [Altı çizili](alti-cizili.md) ·
[Okurken görünüm](okurken-gorunum.md) · [Klavye kısayolları](kisayollar.md).

**İlgili:** [Ödevin penceresi](../odev/odev-penceresi.md), [Mesaj okuma](../mesaj/mesaj-okuma.md),
[Eğitim içerikleri · Video bilgileri](../egitim-icerikleri/video-bilgileri.md).

## Kod tarafı

Bugün kodda yok; bugün yazıdaki adresler tıklanır hâle getirilmez (yazılar [public/js/parcalar/01-yardimcilar.md](../../public/js/parcalar/01-yardimcilar.md)'deki
`esc` ile düz metin olarak basılır). Kodlanınca düzenleyicinin ön yüz parçasında (kutu ve adres denetimi) ve sunucudaki izin
listesinde (`a[href=https://…]`); Durum satırı güncellenir.

## Sık sorulanlar

- **"Adres https:// ile başlamalı." diyor ama adresim doğru.** Adresin başında `https://` olmalı; tarayıcının adres çubuğundan
  kopyalarsan genellikle öyledir. `http://` ile başlayan adresler kabul edilmez.
- **Bağlantıyı nasıl kaldırırım?** İmleci bağlantıya koy, "Bağlantı ekle"ye bas, "Bağlantıyı kaldır".
- **Okuyan tıklayınca Eğitim Evi kapanır mı?** Hayır; bağlantı yeni sekmede açılır.

## Sırada

- Düzenleyiciler (iş 15, onaylı).
