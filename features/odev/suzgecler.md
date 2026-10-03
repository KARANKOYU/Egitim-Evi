# Ödevler · Süzgeçler

**Durum:** Kodda var; tasarımda ek olarak süzgeçler listenin kutusunun içinde açılır listeler olur: öğrencide ve velide Durum (Sonuçlandı / Sonuçlanmadı), Açılma, Yıldız, Sonuç; öğretmende Durum, Sınıf, Yıldız, Teslim; ikisinde de Ders ve son teslim tarih aralığı (kullanıcı 2 Ekim; Tasarım 1 önizlemesi).

Ödev listesini derse, duruma, sonuca, yıldıza ve son teslim tarihine göre daraltan açılır listeler.

## Ne işe yarar

Kullanıcının ilk isteklerinden biri (28 Ağustos): "ödevler için filtreleme: tarih, ders, yaptı yapmadı ödevler falan diye;
arama mükemmel çalışsın". 25 Eylül'de ders süzgecini, 26 Eylül'de öğrencinin kendisi için yıldızlı/yıldızsız süzgecini,
2 Ekim'de liste düzeniyle birlikte dört açılır süzgeci istedi: "1. durumu sonuçlandı/sonuçlanmadı 2. açıldı açılmadı 3.
yıldızlı yıldızsız 4. sonucu (eksik, yapmadı…)". Süzgeçler birlikte çalışır (hepsine uyan ödev görünür) ve
[aramayla](arama.md) birleşir.

## Nereden açılır

- Öğrenci: "Ödevler" sayfasının üstündeki süzgeç kartı (ödev serisi şeridinin altında).
- Öğretmen: "Ödevler" sayfasında "Yeni ödev ver"in altındaki süzgeç kartı.
- Çocuğunun portalına giren veli ve öğrenci portalını açan müdür: portaldaki "Ödevleri" sayfası (öğrencinin kartı, yıldızsız).
- Velinin kendi "Ödevler" sayfasında bugün süzgeç kartı **yok**; yalnız çocuk şeridi ve üstteki arama var.

Tasarımda süzgeçler listenin "Ödevler" kutusunun içinde, satırların hemen üstünde bir sıra açılır liste; velinin listesinde
de aynısı.

## Adım adım

### Öğrenci (bugünkü site)

Kartta soldan sağa:

| Alan | Seçenekler | Ne zaman görünür |
|---|---|---|
| **"Ders"** | "Tüm dersler" + listedeki dersler (alfabe sırasıyla) | listede birden çok ders varsa |
| **"Yıldız"** | "Hepsi", "Yıldızlı", "Yıldızsız" | yalnız öğrencinin kendi listesinde |
| **"Durum"** | "Tüm durumlar", "Aktif olanlar", "Geçmiş olanlar", "Açılmamış", "Yaptı", "Geç yaptı", "Yapmadı", "Eksik", "Gelmedi (izinli)", "Gelmedi (izinsiz)", "Değerlendirilmedi" | her zaman |
| **"Son teslim başlangıç"** | tarih kutusu | her zaman |
| **"Son teslim bitiş"** | tarih kutusu | her zaman |
| **"Temizle"** | düğme | her zaman |

1. Bir alanı değiştirdiğin anda liste yeniden çizilir (sunucuya gidilmez); kartın altındaki özet **"12 ödevden 4 tanesi
   gösteriliyor"** olur.
2. Ne anlama gelirler:
   - **"Aktif olanlar"** — sonuçlanmamış ödevler (süresi dolmuş ama sonuçlanmamışlar dahil).
   - **"Geçmiş olanlar"** — sonuçlanmış ödevler.
   - **"Açılmamış"** — henüz açmadığın aktif ödevler ([Açıldı / açılmadı](acilma-bilgisi.md)).
   - **"Yaptı" … "Gelmedi (izinsiz)"** — o sonucu aldığın ödevler.
   - **"Değerlendirilmedi"** — sonucu olmayan ödevler (aşağıda bilinen açık).
   - **Tarih aralığı** — son teslimi bu iki gün arasında (ikisi de dahil, bütün gün) olan ödevler; yalnız birini doldurursan
     tek yönlü süzer. Son tarihi olmayan (süresiz) ödev tarih süzgeci varken görünmez.
3. **"Temizle"** bütün süzgeçleri ve üstteki arama kutusunu boşaltır, listeyi sunucudan yeniden ister.
4. Süzgeçler sayfadan çıkınca sıfırlanır (başka sayfaya gidip dönünce boş gelir).

### Öğretmen (bugünkü site)

Aynı kart; "Yıldız" yok, **"Durum"**un seçenekleri: **"Tüm durumlar"**, **"Aktif olanlar"** (sonuçlanmamış),
**"Sonuçlananlar"**, **"Süresi dolmuş, sonuçlanmamış"** (kontrol etmen gerekenler). "Ders", tarih aralığı ve "Temizle"
öğrencininkiyle aynı.

### Veli

Bugün velinin "Ödevler" sayfasında süzgeç yok; birden çok çocukta üstteki şeritten tek çocuğa daraltırsın ("Hepsi · Elif
Yılmaz · Can Yılmaz") ve arama kutusunu kullanırsın. Çocuğunun portalındaki "Ödevleri"nde öğrencinin kartı (yıldızsız) var.

### Tasarımda (Tasarım 1 önizlemesi ve kullanıcının 2 Ekim kararı)

Öğrenci ve veli (velide her çocuk ayrı oturum, liste yalnız o çocuğun):

| Süzgeç | Seçenekler |
|---|---|
| **"Ara"** | yazı kutusu, yer tutucu "Ödev, ders ya da öğretmen" ([Ödevlerde arama](arama.md)) |
| **"Ders"** | "Hepsi" + dersler (listede birden çok ders varsa) |
| **"Durum"** | "Hepsi", "Sonuçlanmadı", "Sonuçlandı" |
| **"Açılma"** | "Hepsi", "Açıldı", "Açılmadı" |
| **"Yıldız"** | "Hepsi", "Yıldızlı", "Yıldızsız" |
| **"Sonuç"** | "Hepsi", "Yaptı", "Geç yaptı", "Eksik", "Yapmadı", "Gelmedi (izinli)", "Gelmedi (izinsiz)" |
| **"Son tarih · şu günden"** | tarih kutusu |
| **"şu güne kadar"** | tarih kutusu (o günün sonuna kadar dahil) |
| **"Süzgeçleri temizle"** | düğme; yalnız en az bir süzgeç ya da arama doluyken görünür |

Öğretmen:

| Süzgeç | Seçenekler |
|---|---|
| **"Ara"**, **"Ders"**, **"Durum"** | yukarıdakiyle aynı |
| **"Sınıf"** | "Hepsi" + öğretmenin sınıfları ("7-A", "7-C", "8-B") |
| **"Yıldız"** | "Hepsi", "Yıldızlı", "Yıldızsız" |
| **"Teslim"** | "Hepsi", "Herkes teslim etti", "Teslim etmeyen var" |
| tarih aralığı, **"Süzgeçleri temizle"** | yukarıdakiyle aynı |

- Bir süzgeç değişince liste baştan, ilk 15 ödevle çizilir ([Ödev listesi](liste.md)); kutunun başlığındaki sayı ("9 ödev")
  süzgece uyanları sayar.
- Uyan ödev yoksa: **"Bu süzgeçlerle ödev yok."**
- 2 Ekim'deki tanımda velide en başta bir "Çocuk" süzgeci vardı; kullanıcının 3 Ekim kararıyla (her çocuk ayrı oturum)
  kalktı.
- "Teslim" süzgecinin neyi "teslim" saydığı tanımda ayrıca yazmıyor; ödev hatırlatma tanımında "teslim" öğrencinin dosya
  yüklemesi ya da quizi bitirmesidir ([Ödev hatırlatmaları](hatirlatmalar.md)).

## Kurallar ve sınırlar

- **Süzgeçler birlikte çalışır** (VE): "Matematik" + "Yapmadı" + Eylül aralığı = Eylül'de son teslimi olan, Matematik'ten
  "Yapmadı" aldığın ödevler. Arama da bunlara eklenir.
- **"Değerlendirilmedi" bilinen açığı:** bugün bu seçenek sonucu boş olan her ödevi gösterir; aktif ödevlerin sonucu da boş
  olduğu için listeye bütün aktif ödevler de girer. Kastedilen yalnız sonuçlanmış ama sonuç girilmemiş ödevlerdir.
- **Tarih süzgeci saate bakmaz;** son teslim gününe bakar. Başlangıcı bitişten sonra seçersen uyarı çıkmaz, liste boş kalır.
- **Yıldız süzgeci** yalnız öğrencinin kendi listesinde; yıldız öğrencinin kendi işaretidir ([Yıldızlama](yildizlama.md)).
- **Süzgeçler hatırlanmaz:** sayfadan çıkınca, başka role/portala geçince ya da "Temizle" deyince sıfırlanır.
- **Ders seçeneği** yalnız listedeki derslerden oluşur; tek ders varsa alan hiç çıkmaz.

## Kardeşler ve ilgili

**Kardeşler:** [Ödev listesi](liste.md) · [Ödevlerde arama](arama.md) · [Açıldı / açılmadı](acilma-bilgisi.md) ·
[Yıldızlama](yildizlama.md) · [Sonuçlandırma](sonuclandirma.md) (sonuç seçenekleri) · [Başlama ve son teslim](tarih-ve-saat.md).

**İlgili:** [Eğitim içeriklerinin süzgeç mantığı](../egitim-icerikleri/suzgec-mantigi.md) (aynı açılır süzgeç düzeni),
[Velide çocuk oturumları](../portallar/velide-cocuk-oturumlari.md), [Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md),
[Takvim: ajanda](../takvim/ajanda.md) (ödevleri tarih ve türe göre süzen öbür ekran).

## Kod tarafı

- Ön yüz: [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) — `ODEV_DURUMLAR` (öğrenci ve
  öğretmen seçenekleri), `odevFiltreCubugu` (alanlar, "Ders" yalnız birden çok derste, "Yıldız" yalnız `odevYildizliMi()`),
  `odevFiltrele` (kurallar; tarih kutuları yerel gün sınırına genişletilir), `odevSonucCiz` (özet), `odevFiltreBagla`.
  "Temizle": [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`odev-filtre-temizle`: süzgeçleri
  ve arama kutusunu boşaltır, `git(S.page)`). Süzgeç durumu `S.odevF` her sayfa değişiminde sıfırlanır
  ([07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) `git`, [26-baslat.md](../../public/js/parcalar/26-baslat.md)).
- Veri: süzgeçler tarayıcıda, sunucudan bir kez gelen listeye uygulanır (`/api/progress`, `/api/assignments`;
  [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md), [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md)).
- Görünüm: `.kart.filtre`, `.filtre-satir`, `.filtre-ozet` ([CSS.md](../../public/css/parcalar/CSS.md)).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Filtreleme ve arama").

## Sık sorulanlar

- **Sadece yapmadığım ödevleri nasıl görürüm?** "Durum" → "Yapmadı" (tasarımda "Sonuç" → "Yapmadı").
- **Kontrol etmem gereken ödevler (öğretmen)?** "Durum" → "Süresi dolmuş, sonuçlanmamış" (tasarımda "Durum" → "Sonuçlanmadı"
  ve satırdaki "Kontrol et" etiketi).
- **"Ders" süzgeci neden yok?** Listende tek bir dersin ödevleri var.
- **Süzgeçlerim neden sıfırlandı?** Sayfadan çıkınca sıfırlanırlar.

## Sırada

- Ödev listesi düzeni (kullanıcı 2 Ekim): bugünkü süzgeç kartı tasarımdaki açılır süzgeçlere çevrilecek; velinin listesine
  de süzgeçler gelecek; "Değerlendirilmedi" açığı bu işte kapanmalı.
- Android uygulaması: aynı süzgeçler uygulamanın ödev ekranına gelecek.
