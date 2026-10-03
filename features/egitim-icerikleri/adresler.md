# Eğitim içerikleri · Adresler

**Durum:** Tasarlandı — henüz kodda yok

Eğitim içeriklerinin dört adresi: video listesi `/egitim-icerikleri`, tek videonun izleme sayfası `/izle/<kimlik>`, paylaşılmış
liste ve eğitmen serisi `/watchlist/<kimlik>`, eğitmenin paneli `/panel/egitmen`; her birinin Türkçe ya da İngilizce eşi de
çalışır.

## Ne işe yarar

Videoyu ya da listeyi birine göndermek için kısa, sabit bir adres gerekir. Kullanıcının 29 Eylül sözleri: "oynatma listesi …
sadece link tutar: ip/watch/id=hawcnhmajkmo", "listeyi paylaş butonu … ip/watchlist/id" ve "eğitim içerikleri oturuma girmeden
önce ana sitede header'da bi satır". Bu yüzden her videonun ve her paylaşılan listenin kendi adresi var; liste sayfası ve
izleme sayfası giriş yapmadan da açılır (29 Eylül kararı, "evet bu": [Girişsiz izleme](girissiz-izleme.md)).

## Nereden açılır

- **Liste:** `egitimevi.org/egitim-icerikleri` — İngilizce eşi `/videos` (aynı sayfa). Açılış sayfasının üst şeridindeki
  **"Eğitim içerikleri"** bağlantısı ([Açılışın üst şeridi ve alt bilgisi](../acilis-sayfasi/ust-serit-ve-alt-bilgi.md)) ve
  giriş yapmış kişinin sol menüsündeki **"Eğitim içerikleri"** buraya getirir.
- **Tek video:** `egitimevi.org/izle/<kimlik>` — İngilizce eşi `/watch/<kimlik>`. Bir video kartına basınca, paylaşılan bir
  bağlantıyı açınca ya da arama motorundan gelince açılır ([İzleme sayfası](izleme-sayfasi.md)).
- **Liste ve seri:** `egitimevi.org/watchlist/<kimlik>` — Türkçe eşi `/izleme-listesi/<kimlik>`. "Listeyi paylaş" ile
  verilen bağlantı ve eğitmenin herkese açık serisi bu biçimdedir ([Listeyi paylaş](listeyi-paylas.md),
  [Eğitmen serileri](egitmen-serileri.md)).
- **Eğitmen paneli:** `egitimevi.org/panel/egitmen` — yalnız eğitmene açılır ([Eğitmen paneli](egitmen-paneli.md)).

Tasarım 1 önizlemesinde liste sayfası ana sitede `#/egitim` adresindedir; video ayrı bir sayfa yerine liste sayfasının
üstünde açılan büyük pencerede oynar (önizlemenin kısaltması; gerçek sitede her videonun kendi `/izle/<kimlik>` adresi olur).

## Adım adım

### Ziyaretçi (giriş yapmamış)

1. Açılış sayfasının üst şeridinde **"Eğitim içerikleri"**ne bas ya da adres çubuğuna `egitimevi.org/egitim-icerikleri` yaz.
2. Liste, arama ve süzgeçler açılır; videoya basınca `/izle/<kimlik>` açılır ve video oynar.
3. Sana gönderilen `/watchlist/<kimlik>` bağlantısı listeyi salt okunur açar; oynatabilirsin, değiştiremezsin.
4. Beğen, Kaydet, Listeye ekle, İndir, Bildir gibi düğmelerde giriş istenir; girince aynı adrese, aynı videoya dönersin.

### Giriş yapmış herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, eğitmen, destek, yönetici)

1. Sol menüde **"Eğitim içerikleri"**ne bas (Tasarım 1'de öğrenci, veli, öğretmen ve müdür menüsünün sonunda; eğitmende bir
   çizginin altında). Ana sitedeyken üst şeritteki bağlantı da aynı sayfayı açar; giriş yapmış olduğun için Kaydettiklerim,
   İndirdiklerim, İzleme geçmişim ve listelerin de görünür.
2. Videonun adresini kopyalayıp gönderebilirsin; alan kişi giriş yapmadan da izler.
3. Kendi listeni paylaşınca `/watchlist/<kimlik>` bağlantısı alırsın ([Listeyi paylaş](listeyi-paylas.md)).

### Eğitmen

1. `egitimevi.org/panel/egitmen` adresi ya da eğitmen oturumunun sol menüsü panelin sayfalarını açar: Ana sayfa, Videolarım,
   Video yükle, Oynatma listelerim, Bildirilenler, İstatistikler.
2. Eğitmen olmayan biri bu adresi açarsa "sayfa bulunamadı" (404) görür; panelin var olduğu bile belli olmaz.

## Kurallar ve sınırlar

- **Kimlik:** `<kimlik>` 12 karakterlik RASTGELE bir dizgidir (küçük harf a–z ve rakam 0–9; ör. `hawcnhmajkmo`), sıralı sayı
  değildir: adresler tahmin edilip taranamaz. `crypto.randomBytes` ile üretilir. 36^12 ≈ 4,7 × 10^18 olasılık vardır;
  iki kimlik çakışırsa veritabanının tekil kısıtı reddeder ve yeni kimlik üretilir.
- **YouTube'dan eklenen video da kendi kimliğimizi alır:** YouTube'un kimliği içeride saklanır, adreste görünmez; bütün
  videoların adresi aynı biçimdedir.
- **Liste kimliği de 12 karakter rastgele:** "Paylaşmayı durdur" denince kimlik yenilenir, eski bağlantı 404 verir.
- **Girişsiz açık olanlar:** `/egitim-icerikleri` (`/videos`), arama ve süzgeçler, `/izle/<kimlik>` (`/watch/<kimlik>`),
  herkese açık eğitmen serileri ve paylaşılmış kişisel listeler (`/watchlist/<kimlik>`, `/izleme-listesi/<kimlik>`).
- **Giriş gerekenler:** Beğen, Kaydet, liste oluşturma ve listeye ekleme, Listeyi paylaş, İndir, Bildir, kaldığın yer ve izleme
  geçmişi.
- **Arama motorları:** liste sayfası, izleme sayfaları ve herkese açık seriler dizinlenebilir (başlık, açıklama, küçük resim;
  her sayfanın kendi açıklama etiketi). Paylaşılmamış listeler ve kişisel sayfalar (Kaydettiklerim, İndirdiklerim, İzleme
  geçmişim) `noindex`'tir, dizine girmez.
- **Panel adresi:** `/panel/egitmen` yalnız eğitmen rolündeki hesaba açılır; öbürlerine 404. Bütün panellerde (`/panel/admin`,
  `/panel/destek`, `/panel/egitmen`, `/panel/translate`) aynı kapı ve aynı 404 eşitliği uygulanır.
- **Alan adı:** adreslerde IP değil alan adı kullanılır (canlıda `egitimevi.org`).
- Eski bir tanım taslağındaki `/icerikler` ve `/liste/<kimlik>` adresleri KALDIRILDI; tek biçim yukarıdakilerdir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Video listesi](video-listesi.md) — `/egitim-icerikleri` sayfasının düzeni.
- [İzleme sayfası](izleme-sayfasi.md) — `/izle/<kimlik>`.
- [Listeyi paylaş](listeyi-paylas.md), [Eğitmen serileri](egitmen-serileri.md) — `/watchlist/<kimlik>`.
- [Eğitmen paneli](egitmen-paneli.md) — `/panel/egitmen`.
- [Girişsiz izleme](girissiz-izleme.md) — hangi adres girişsiz açılır.

**İlgili:**

- [Kısa adresler](../acilis-sayfasi/adresler.md) — sitenin bütün adresleri ve eş adları.
- [Açılışın üst şeridi ve alt bilgisi](../acilis-sayfasi/ust-serit-ve-alt-bilgi.md) — "Eğitim içerikleri" bağlantısı.
- [Dil ve çeviri](../dil/README.md) — dil seçici girişsiz sayfalarda, eğitim içeriklerinde de çalışır.

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı bugünkü parçalar:

- Adres tablosu, eş adlar, 404 ve `X-Robots-Tag: noindex`: [sunucu/http.md](../../sunucu/http.md).
- Panel kapısı ve 404 eşitliği: [sunucu/yonetim-cerezi.md](../../sunucu/yonetim-cerezi.md), [sunucu/api.md](../../sunucu/api.md).
- Ön yüzün yönlendiricisi: [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md); girişsiz sayfalar:
  [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md).

## Sık sorulanlar

- **Bir videoyu arkadaşıma nasıl gönderirim?** İzleme sayfasının adresini (`/izle/…`) kopyala, gönder; arkadaşın giriş yapmadan
  da izler.
- **Paylaştığım listenin bağlantısını geri alabilir miyim?** Evet: "Paylaşmayı durdur". Bağlantı ölür, yeniden paylaşırsan yeni
  bir bağlantı çıkar.
- **`/videos` ile `/egitim-icerikleri` farklı mı?** Hayır, aynı sayfa; biri İngilizce eşi.
- **Adresteki harf dizisi ne?** Videonun ya da listenin rastgele kimliği; tahmin edilemesin diye sıralı sayı değil.

## Sırada

- Eğitim içerikleri (iş 17): adresler, eş adlar, panel kapısı, `noindex` kuralları kodlanacak.
- Arama motorunda görünme (iş 23): sayfa başına açıklama etiketleri, site haritasına izleme sayfaları.
