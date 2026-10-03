# Yorumlar · Açılış sayfasındaki yorumlar bölümü

**Durum:** Kodda var; tasarımda ek olarak giriş yapmış kişi "Ana siteye dön" ile oturumunu kapatmadan açılışa gelip bölümü görür ve
SSS'ye yorumlarla ilgili bir soru eklenir

Açılış sayfasının en altındaki "Kullananlar ne diyor?" bölümü: ortalama yıldız, yorum sayısı ve en son yazılan ya da değiştirilen 12
yorum.

## Ne işe yarar

Eğitim Evi'ni ilk kez açan biri (okulunu taşımayı düşünen bir müdür, çocuğunun okulu yeni başlayan bir veli) aracı kullananların ne
dediğini görür. Bölüm giriş yapmadan okunur; yalnız gerçek kullanıcıların (veli, öğretmen, müdür) yazdığı, süzgeçten geçmiş ve
yöneticinin gizlemediği yorumlar burada durur.

## Nereden açılır

- **Adres:** sitenin kökü `/` (ör. egitimevi.org). Bölüm açılış sayfasının EN ALTINDA, "Öğrenci / Veli / Öğretmen / Okul yönetimi"
  kartlarının altında, alt bilginin hemen üstündedir. Hakkında (`/hakkinda`) ve SSS (`/sss/sss.html`) sayfalarında yoktur.
- **Bugünkü site:** yalnız giriş yapmamışken görünür. Giriş yapmışken `/` adresi açılışı değil portalını açar.
- **Tasarımda** (kullanıcının 30 Eylül kararı): portalda profil menüsündeki **"Ana siteye dön"** oturumu kapatmadan açılış sayfasına
  götürür; bölüm orada görünür, sağ üstteki **"Hesaba gir →"** seni portalına geri götürür ([Ana siteye dön](../menu-ve-arama/ana-siteye-don.md)).
- Açılış sayfasının bütün düzeni: [Açılış sayfası](../acilis-sayfasi/acilis.md).

## Adım adım

### Ziyaretçi

1. Sitenin kökünü aç, en alta kaydır.
2. Başlık **"Kullananlar ne diyor?"**. Başlığın sağında (telefonda altında) özet: büyük yazıyla ortalama ("4,7"), beş yıldız
   (ortalamanın yuvarlanmış hâli kadarı dolu) ve "12 yorum" gibi toplam sayı.
3. Altında yorum kartları: geniş ekranda üç sütun, 860 pikselden dar ekranda (telefon) tek sütun. Her kartta yukarıdan aşağı:
   - o yorumun yıldızları (beşten kaçı dolu),
   - yorumun metni,
   - en altta baş harfli renkli yuvarlak, kalın kısaltılmış ad ("De. Ka.") ve altında küçük yazıyla etiket ve tarih: "Veli · 24
     Eylül 2026, Perşembe" ([Adın kısaltılması ve rol etiketi](ad-kisaltma-ve-etiket.md)).
4. En son yazılan ya da değiştirilen yorum en baştadır. En çok 12 kart görünür; sayfalama ya da "daha fazla" yoktur.
5. Bölümün altındaki not: "Veli, öğretmen ya da müdür hesabınla **giriş yap**, **Ayarlar** sayfasından sen de yorumunu yaz."
   "giriş yap" bağlantısı giriş sayfasına (`/login`) gider ([Giriş](../giris-hesap/giris.md)).

Ekranın öbür hâlleri:

- Sayfa açılırken: "Yorumlar yükleniyor..."
- Hiç (görünür) yorum yoksa: özet boş kalır, kartların yerinde "Henüz yorum yok. İlk yorumu sen yaz." Bütün yorumlar gizlenmişse de
  böyle görünür.
- Yorumlar alınamazsa (bağlantı ya da sunucu sorunu): "Yorumlar şu an yüklenemedi." Açılış sayfasını yeniden açınca yeniden denenir.

Ekran okuyucu her yıldız dizisini "5 üzerinden 4 yıldız" diye okur.

### Veli, öğretmen ve müdür

- Okuma: ziyaretçiyle aynı.
- Kendi yorumunu görmek: bugünkü sitede giriş yapmışken açılış görünmez; çıkış yapıp ya da girişsiz bir tarayıcı penceresinde sitenin
  kökünü aç. Tasarımda "Ana siteye dön" ile bak.
- Yorum yazmak ve değiştirmek bu bölümden değil Ayarlar'dan yapılır: [Yorum yazma](yorum-yazma.md),
  [Yorumu değiştirme ve silme](yorumu-duzeltme-ve-silme.md).
- Yorumunu gönderince açılışta hemen görünür; açık duran bir açılış sayfası ise kendiliğinden tazelenmez, sayfayı yenile.

Çalışan ve eğitmen için de aynısı (yazabiliyorlarsa: [Yorum yazma](yorum-yazma.md#çalışan)).

### Öğrenci ve servisçi

Ziyaretçi gibi yalnız okur. Yorum yazamazlar.

### Yönetici

Ziyaretçiyle aynı listeyi görür. Gizlenenler dahil bütün yorumlar ve gizleme işi yönetim panelindeki **"Yorumlar"** ekranındadır
([Yorumu gizleme](yorum-gizleme.md)). Bir yorumu gizlediğinde açılıştan hemen kalkar, sayıdan ve ortalamadan düşer.

### Tasarımda (Tasarım 1 önizlemesi)

Bölüm bugünkü siteyle aynı yerde, aynı başlık, aynı kart düzeni ve aynı alt notla durur. Önizlemedeki küçük farklar (kullanıcı bu
bölüm için ayrıca karar vermedi; örnektir):

- Ortalama her zaman tek ondalıkla yazılır ("5,0"); bugünkü site tam sayıyı ondalıksız gösterir ("5").
- Hiç yorum yoksa yalnız "Henüz yorum yok." yazar.
- Yorumunu yazan ya da silen kişi açılışa döndüğünde liste hemen yeni hâliyle görünür.
- Sık sorulan sorulara ("Sorun ve iletişim" kümesine) bir soru eklenir: **"Açılış sayfasındaki yorumları kim yazar?"** Cevabı
  kuralları özetler: yalnız veli, öğretmen ve müdür hesapları yazar, öğrenci ve servisçi yazamaz; yorum "Ayarlar → Gizlilik ve
  verilerim → Eğitim Evi hakkında yorumun"dan yazılır (0–5 yıldız, en çok 500 karakter); ad kısaltılır; küfür, hakaret ve internet
  adresi kabul edilmez; yorum istendiği zaman değiştirilir ya da silinir. Bugünkü SSS sayfasında böyle bir soru yok
  ([Sık sorulan sorular](../acilis-sayfasi/sss.md)).

## Kurallar ve sınırlar

- **Hangi yorumlar:** gizlenmemiş olanlar. Sıra, yorumun SON değişikliğine göre yeniden eskiye; açılışta en yeni 12'si.
- **Sayı ve ortalama:** gizlenmemiş BÜTÜN yorumlardan hesaplanır (yalnız görünen 12'den değil). Ortalama bir ondalığa yuvarlanır,
  virgülle yazılır ("4,7"); tam sayıysa ondalıksız ("5"). Özetteki dolu yıldız sayısı ortalamanın en yakın tam sayıya yuvarlanmışıdır
  (4,5 → 5 yıldız). 0 yıldızlı yorumlar da ortalamaya girer.
- **Tarih:** yorumun son değişikliğinin günü, "24 Eylül 2026, Perşembe" biçiminde; saat yazılmaz.
- **Kimlik yok:** açılışa giden veride yalnız kısa ad, etiket, yıldız, metin ve tarih vardır; kişinin hesap numarası, kullanıcı adı,
  okulu ve yorumun kimliği gönderilmez.
- **Metin:** düz yazı olarak basılır (HTML işlenmez); çok uzun kelimeler kartın içinde kırılır.
- **Tazelik:** sunucu bu listeyi 1 dakika bellekte tutar; yorum yazılınca, silinince ya da gizlenince bellek hemen boşaltılır. Açılış
  sayfası yorumları her açılışta bir kez yükler; aynı sayfada beklerken yeni yorum gelmez.
- **Giriş gerekmez:** liste herkese açıktır; aydınlatma onayı ya da hesap gerektirmez.
- **Uygulama:** Android uygulaması bugün yorumları göstermez.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Yorumlar](README.md)):

- [Yorum yazma](yorum-yazma.md) — bölümdeki yorumların nereden ve kimlerce yazıldığı.
- [Adın kısaltılması ve rol etiketi](ad-kisaltma-ve-etiket.md) — kart altındaki ad, yuvarlak ve etiket.
- [Yorumu değiştirme ve silme](yorumu-duzeltme-ve-silme.md) — sıranın ve tarihin değişmesi.
- [Uygunsuz kelime ve internet adresi süzgeci](uygunsuz-kelime-suzgeci.md) — buraya ulaşamayanlar.
- [Yorumu gizleme (yönetici)](yorum-gizleme.md) — buradan kaldırılanlar.

**İlgili:**

- [Açılış sayfası](../acilis-sayfasi/acilis.md) ve [Açılışın üst şeridi ve alt bilgisi](../acilis-sayfasi/ust-serit-ve-alt-bilgi.md).
- [Sık sorulan sorular](../acilis-sayfasi/sss.md) — tasarımda "Açılış sayfasındaki yorumları kim yazar?" sorusu.
- [Ana siteye dön](../menu-ve-arama/ana-siteye-don.md) — tasarımda giriş yapmışken açılışa gitmek.
- [Android uygulaması](../uygulama/android-uygulamasi.md) — uygulamada yorumlar bugün yok.
- [Neler çevrilir, neler çevrilmez](../dil/ceviri-kapsami.md) — başlık ve iletiler çevrilir, yorum metni çevrilmez.
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) — yorumun herkese açık kısmı.

## Kod tarafı

- Sayfa iskeleti: `public/index.html` içinde `#vYorumlar` bölümü (başlık "Kullananlar ne diyor?", `#vYorumOzet`, `#vYorumListe`
  ilk metni "Yorumlar yükleniyor...", alt not `.v-yorum-not`).
- Ön yüz: [public/js/parcalar/05a-dis-sayfalar.md](../../public/js/parcalar/05a-dis-sayfalar.md) — `yorumlariYukle()` (sayfa
  `ana` iken bir kez; boş, hata iletileri), `yildizCiz(n)`; [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md)
  (`avatar`, `tarihGun`). Biçim: [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`29-dis-sayfalar.css`: `.v-yorumlar`,
  üç sütunlu `.v-yorum-liste`, 860 px altında tek sütun, `.yildiz`).
- Sunucu: [sunucu/bolumler/yorum.md](../../sunucu/bolumler/yorum.md) — `GET /api/yorumlar` (girişsiz; 1 dakikalık önbellek;
  `{ sayi, ortalama, yorumlar: [{ adKisa, rol, yildiz, metin, tarih }] }`, ortalama bir ondalık).
- Depo: [sunucu/veri/depo/yorumlar.md](../../sunucu/veri/depo/yorumlar.md) — `gorunenler(12)` (gizli olmayanlar, `guncelleme`
  sırasıyla; sayı ve ortalama aynı süzgeçle), indeks `yorumlar_gorunen`.
- Testler: [testler/test-yorum-ek.md](../../testler/test-yorum-ek.md) — girişsiz açık liste, listede `id` ve `hesapId` olmaması,
  gizlenen yorumun düşmesi, silmeden sonra sayının 0 olması.

## Sık sorulanlar

- **Yorumum açılışta görünmüyor.** Yönetici gizlemiş olabilir (Ayarlar'daki kartta turuncu uyarı kutusu çıkar) ya da yorumun en yeni 12'nin
  dışında kalmıştır. Ayrıca açık duran sayfayı yenile.
- **Yorum sayısı 30 ama 12 kart var.** Açılışta en yeni 12 yorum gösterilir; sayı ve ortalama hepsinden hesaplanır.
- **Giriş yaptım, açılış sayfasını göremiyorum.** Bugünkü sitede giriş yapmışken kök adres portalını açar. Tasarımda profil
  menüsündeki "Ana siteye dön" ile görülür.
- **Yorumların yazarlarını nasıl bilebilirim?** Bilemezsin; ad kısaltılmış, kimlik gönderilmez.

## Sırada

- Üst şerit sadeleştirme: "Ana siteye dön" ile giriş yapmış kişi de açılışı (ve yorumları) görecek.
- Paneller: yönetim ekranı `/panel/admin` içine taşınacak; açılış bölümü değişmez.
- Android yerel uygulama: uygulamada girişsiz açılan bir sol menü ve onun içinde salt okunur "Yorumlar" önerildi; kullanıcının
  isteğinin böyle mi anlaşılacağı karar bekliyor.
- Çok dil: "Kullananlar ne diyor?", "… yorum", "Henüz yorum yok…" çeviri kataloğuna girecek; yorum metinleri çevrilmez.
