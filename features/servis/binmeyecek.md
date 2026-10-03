# Servis · Binmeyecek işareti

**Durum:** Kodda var; tasarımda ek olarak öğrenci de kendisi işaretler (kullanıcı 1 Ekim), gün takvimden seçilir ve sayfada "Servise binmeyeceği(m) günler" listesi ile "Geri al" durur.

Velinin, çocuğunun bugün ya da önümüzdeki 7 gün içinde bir gün sabah, akşam ya da iki serviste de binmeyeceğini servisçiye
bildirdiği işaret.

## Ne işe yarar

Servisçi boşuna kapıda beklemesin, veli de her sabah servisçiyi aramasın. İşaretli öğrenci servisçinin listesinde soluk görünür ve
"Velisi: bugün binmeyecek" yazar; servisçiye bildirim gider; o dönem için "binmedi" bildirimi veliye gitmez; yaklaşma bildirimi ve "önünde
N öğrenci" sayısı o öğrenciyi atlar.

Kullanıcının sözleri: servisçi ile veli arasında "her gün için yazabilcek şu gün şu yok" (26 Eylül) ve 1 Ekim'de "öğrenci
gelmeyeceğini servis sekmesi gelmeyeeceğim gün seç takvim den seçer ve ona akşam/sabah yada ikisi sorulur".

## Nereden açılır

- **Veli:** menüden **"Servis"** → çocuğunun servis kartında **"Binmeyecek"** (takvim simgeli), yanında "Servise binmeyeceği günü
  servisçiye bildir." Çocuğu olan öğretmende "Velisi olduğum" → **"Servisi"**; çocuğu olan müdürde (ve servis yetkisi olan
  öğretmende) "Servisler" sayfasının üstündeki çocuk kartı.
- **Servisçi:** işaretleri Yoklama sayfasında görür (listede ve "Velilerin "binmeyecek" işaretleri" kartında); kendisi işaret koymaz.

Tasarımda: öğrencinin "Servisim" sayfasında **"Servise binmeyeceğim günler"**, velinin "Servis" sayfasında **"Servise binmeyeceği
günler"** grubu ve başlığın sağında **"+ gün ekle"**.

## Adım adım

### Veli

1. Menüden **"Servis"**. Çocuğunun kartında **"Binmeyecek"**e bas.
2. "Zeynep servise binmeyecek" penceresi (başlıkta çocuğun ilk adı). Üstte: "Servisçinin listesinde görünür ve ona bildirim gider. O
   servisin yoklaması alınınca işaret değiştirilemez."
3. **"Hangi gün?"**: "Bugün · 3 Ekim Cumartesi", "Yarın · 4 Ekim Pazar" ve 7 gün sonrasına kadar her gün; işaretli günün yanında
   "(işaretli: sabah)" ya da "(işaretli: sabah ve akşam)". Pencere açılınca bugün için hâlâ servis saati varsa (şu an servis saatiyse ya
   da sıradaki aralık bugünse) **bugün**, yoksa **yarın** seçili gelir.
4. **"Hangi servise binmeyecek?"**: **"Sabah"**, **"Akşam"**, **"İkisi"** (işaret yoksa "İkisi" seçili gelir).
5. **"Kısa not (isteğe bağlı)"**: örnek yazı "ör. Doktor randevusu var.", en çok 200 karakter.
6. **"Kaydet"** ("Kaydediliyor..."). Pencere kapanır, sayfa yenilenir, üstte yeşil "Kaydedildi; servisçiye haber gitti."
7. Kartın "bugün" bölümünde takvim simgesiyle "Yarın sabah binmeyecek" (kalın) ve altında notun.
8. Değiştirmek için yeniden **"Binmeyecek"** → aynı günü seç: dönem ve not dolu gelir; değiştir, **"Kaydet"**.
9. Kaldırmak için o günü seç → **"İşareti kaldır"** (yalnız seçili günde işaret varsa görünür) → "İşaret kaldırıldı."
10. **"Vazgeç"** pencereyi kapatır.

### Servisçi

- Bildirim gelir: "Zeynep Yılmaz yarın sabah servise binmeyecek. Velinin notu: Doktor randevusu var." (not yoksa yalnız ilk cümle;
  tarih "bugün", "yarın" ya da "5 Ekim"; dönem "sabah", "akşam" ya da "sabah ve akşam"). İşaret kaldırılınca: "Zeynep Yılmaz için yarın
  "binmeyecek" işareti kaldırıldı." Bildirime dokununca Yoklama sayfası açılır. Yalnız işaret ya da not gerçekten değiştiyse ve servise
  bir servisçi hesabı atanmışsa gider.
- Yoklama listesinde öğrencinin satırı (o dönem için işaret varsa ve henüz işaretlenmediyse) soluk; uyarı simgesiyle "Velisi: bugün
  binmeyecek · Doktor randevusu var" (işaret öbür dönem içinse "Velisi: bugün akşam binmeyecek"). Yoklama açıkken düğmeler durur,
  yine de "Bindi" / "Geldi" işaretleyebilirsin; yoklama kapalıyken (saat dışında ya da yoklama kapandıysa) satırda gri
  "Binmeyecek" rozeti görünür.
- Sayılar satırında "1 binmeyecek".
- **"Velilerin "binmeyecek" işaretleri"** kartı: bugünden 7 gün sonrasına kadar bütün işaretler, öğrencinin adı ve "Yarın sabah ve
  akşam binmeyecek · Doktor randevusu var." Saat dışında da görünür (yarının listesini önceden görürsün).
- Akşam "Başlat"ta işaretsiz kalanlar sayılırken "(velisi: binmeyecek)" diye ayrılır.

### Öğrenci

Kartında işareti görür ("Yarın sabah binmeyecek" ve not); kendisi işaretleyemez: sunucu ""Binmeyecek" işaretini velin koyar." der.

Tasarımda (kullanıcı 1 Ekim): öğrenci de kendisi işaretler (aşağıda).

### Müdür, öğretmen ve çalışan (servis yönetimi)

"Bugünkü yoklama" penceresinde öğrencinin satırında velinin işareti ve notu görünür. Yönetim işaret koymaz. Kendi çocuğu için veli
olarak koyar (yukarıdaki "Veli" adımları).

### Tasarımda (Tasarım 1 önizlemesi)

- Öğrencinin "Servisim" sayfasında **"Servise binmeyeceğim günler"**, velinin sayfasında **"Servise binmeyeceği günler"** grubu;
  başlığın sağında **"+ gün ekle"**. Boşken: "Bildirilmiş gün yok. Servise binmeyeceğin günü buradan bildir; şoför ve okul görür."
  Her işaret bir satır: "2 Ekim Cuma", altında "akşam · Hakan Demir'e bildirildi" ve **"Geri al"** ("Geri alındı.").
- "+ gün ekle" penceresi "Servise binmeyeceğim gün": **"1. Günü seç"** (ay takvimi; Pzt … Paz, bugün işaretli, hafta sonu ve geçmiş
  günler kapalı), **"2. Hangi sefer?"** (**"Sabah"**, **"Akşam"**, **"İkisi de"**), not: "Hafta sonu servis yok. Bildirim şoföre ve
  okula gider; o gün yoklamada "Gelmeyecek" görünür." Düğmeler **"Vazgeç"** / **"Bildir"**. Gün seçilmezse "Önce günü seç.", sefer
  seçilmezse "Sabah mı, akşam mı, ikisi mi? Seç."; başarıda "Bildirildi; şoför ve okul görecek."
- Servisçinin bildirimi önizlemede "Can yarın akşam servise binmeyecek" — "Zeynep Yılmaz bildirdi · 2 Ekim · eve dönüş"; servisçinin
  ana sayfasında **"Gelmeyecekler"** listesi ("Deniz Koç · 7-A" — "bugün · sabah ve akşam · veli bildirdi").
- Önizlemedeki takvim bütün ayı açıyor ve hafta sonunu kapatıyor; bugünkü kural (bugün ile 7 gün sonrası, her gün geçerli) için
  kullanıcı başka bir şey söylemedi, kural kalır: takvimde yalnız bu günler seçilebilir olmalı (öneri). Önizlemede not alanı yok;
  bugünkü "Kısa not (isteğe bağlı)" kalır. Önizlemenin "Gelmeyecek" sözcüğü yerine sitede "Binmeyecek" geçer.

## Kurallar ve sınırlar

- **Kim koyar:** bugün yalnız bağlı veli (çocuğu olan öğretmen ve müdür de veli olarak). Öğrenci: ""Binmeyecek" işaretini velin koyar."
  (403); başka çocuğa: "Bu öğrencinin velisi değilsin" (403). Tasarımda öğrenci de koyar.
- **Servis kaydı** olmalı: "Öğrencinin servis kaydı yok." (404).
- **Tarih:** bugün ile 7 gün sonrası arası: "Tarih bugün ile 7 gün sonrası arasında olmalı."
- **Dönem:** sabah, akşam ya da ikisi; ikisi de boş gönderilirse işaret kalkar (not da silinir).
- **Not** en çok 200 karakter; satır sonları tek boşluğa iner.
- **Kilit:** çocuğun o dönemdeki yoklaması işaretlendiyse o dönemin işareti değişmez: "Bu sabahın servis yoklaması alındı; artık
  değiştirilemez." ya da "Bu akşamın servis yoklaması alındı; artık değiştirilemez." (409). Öbür dönem değiştirilebilir.
- **Sıklık:** saatte en çok 60 değişiklik: "Çok sık değiştirdin. Biraz sonra dene." (429).
- **Etkileri:** o dönem için "Binmedi" / "Gelmedi" bildirimi veliye gitmez (önce "Bindi" bildirildiyse yalnız düzeltme gider); sabah
  yaklaşma bildirimi gitmez; "önünde N öğrenci"de sayılmaz; servisçinin sayılarında "binmeyecek" olarak ayrılır.
- **Kim görür:** öğrencinin kendisi, velisi, servisçi ve okul yönetimi (aydınlatma metni: "Servisçinin notları ve velinin "binmeyecek"
  işareti").
- **Saklama:** işaretler 30 gün sonra silinir.
- Servis saatine bağlı değil; her saatte konur.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Servis](README.md)):

- [Velilere not](gunluk-not.md) — servisçiden veliye karşı yön.
- [Servisim ve servis kartı](servisim.md) — "Binmeyecek" düğmesinin yeri.
- [Yoklama sayfası](yoklama-sayfasi.md), [Sabah seferi](sabah-seferi.md), [Akşam seferi](aksam-seferi.md) — servisçinin listesindeki etkisi.
- [Servis bildirimleri](servis-bildirimleri.md), [Servise binmedi uyarısı](servise-binmedi-uyarisi.md) (tasarım: binmeyecek
  bildirilmişse uyarı gitmez).
- [Servis yaklaşıyor bildirimi](yaklasma-bildirimi.md), [Sırayı düzenle](sira-duzenleme.md) ("önünde N").

**İlgili:**

- [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md) — tasarımda işaret o oturumdaki çocuk için.
- [Servisçinin ana sayfası](../ana-sayfa/servisci-ana-sayfasi.md) — "Gelmeyecekler" (tasarım).
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md), [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md).

## Kod tarafı

- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `POST /api/servis/binmeyecek { ogrenciId, tarih,
  sabah, aksam, not }` (kilit, servisçiye bildirim `#/ana`), `binmeyecekKumesi`, `ogrenciBugunu` (`binmeyecek`, `binmeyecekBugun`).
- Depo: [sunucu/veri/depo/servis-yoklama.md](../../sunucu/veri/depo/servis-yoklama.md) — `binmeyecekYaz`, `binmeyecekBul`,
  `binmeyecekler`; tablo `servis_binmeyecek`.
- Ön yüz: [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) — `servis-binmeyecek`, `svBinmezDoldur`,
  `svBinmezGonder`, `servis-binmeyecek-kaydet`, `servis-binmeyecek-kaldir`; servisçide
  [public/js/parcalar/19i-servis-yoklama.md](../../public/js/parcalar/19i-servis-yoklama.md) (`sySatirHtml`, `syNotlarHtml`).
- Testler: [testler/test-servis-yoklama.md](../../testler/test-servis-yoklama.md) (bugün/yarın, kaldırma, 7 gün sınırı, yoklama alınınca
  kilit, servisçiye haber).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Servis yoklaması" → "Binmeyecek").

## Sık sorulanlar

- **Bu sabah çocuğum servise binmedi ama işaret koyamıyorum.** Servisçi o sabahın yoklamasını işaretlediyse sabah işareti artık
  değişmez; akşam için yine koyabilirsin.
- **İşaret koydum, servisçi gördü mü?** İşaret ya da not değiştiyse servisçiye bildirim gider ve listesinde soluk görünür.
- **Bir hafta sonrası için işaret koyabilir miyim?** Bugün ile 7 gün sonrası arasındaki günler seçilebilir.
- **Öğrenci kendisi işaretleyebilir mi?** Bugün hayır, veli koyar. Tasarımda öğrenci de "Servisim" sayfasından koyacak.

## Sırada

- Linux kodlaması (Tasarım 1): öğrencinin kendisinin işaretlemesi, takvimden gün seçimi, "Servise binmeyeceği(m) günler" listesi ve
  "Geri al"; servisçinin ana sayfasında "Gelmeyecekler".
- Velide her çocuk ayrı oturum (3 Ekim kararı): pencere ve liste yalnız o oturumdaki çocuk için.
- Android yerel uygulama: velinin "Servis" sekmesinde "Binmeyecek" işaretleme.
