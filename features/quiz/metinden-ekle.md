# Quiz · Metinden ekle

**Durum:** Kodda var; tasarımda ek olarak "Metinden ekle" düzenleyicinin üstündeki araç satırından açılan, × ile kapanan bir panel olur ve aktarma düğmesi bulunan soru sayısını gösterir ("Ekle (3)").

Word'den, PDF'ten ya da düz metinden kopyalanan soruları yapıştırıp quize toplu ekleme yolu: metin sunucuda ayrıştırılır,
önizlemede hatalı satırlar gösterilir, "Ekle" ile sorular düzenleyiciye geçer.

## Ne işe yarar

Kullanıcının 26 Eylül isteği: "hoca quizi kendi yazar, Ctrl C V falan olabilir". Öğretmen sorularını çoğu zaman Word'de hazırlar;
tek tek kutulara yazmak yerine hepsini bir kerede yapıştırır. Numaralı sorular, harfli şıklar, yıldızla işaretlenmiş doğru şık ve
"Cevap: Doğru" satırı tanınır; tanınmayan satırlar satır numarasıyla gösterilir. Aktarılan sorular düzenleyicide yine
düzeltilebilir.

## Nereden açılır

- **Öğretmen (ve sahipsiz ödevde müdür):** "Yeni ödev" ya da "Ödevi düzenle" penceresinde quiz bölümünün altındaki **"Metinden
  ekle"** düğmesi ([Ödeve quiz ekleme](quiz-ekleme.md)). Quiz kilitliyken düğme yoktur.

## Adım adım

### Öğretmen

1. Quiz bölümünde **"Metinden ekle"**ye bas. Ayarlar ve sorular gizlenir, yerine panel gelir (ekranda yazdıkların kaybolmaz).
2. **"Soruları buraya yapıştır"** kutusuna metni yapıştır. Kutu boşken içinde örnek görünür:

   ```
   1) 3/4 + 1/4 kaçtır?
   *A) 1
   B) 1/2
   C) 4/8
   2) Güneş bir yıldızdır.
   Cevap: Doğru
   3) Kesirleri nerede kullanırsın?
   ```

3. İstersen kutunun altındaki açılır **"Yazım biçimi"** kuralları gösterir:
   - "Her soru bir numarayla başlar: `1)` `1.` ya da `1-`. Soru metni sonraki satırlara taşabilir."
   - "Şıklar `A)` `a)` ya da `A.` ile başlar. Doğru şıkkın başına ya da harfin arkasına yıldız koy: `*A) ...` ya da `A) *...`.
     Birden çok doğru olabilir."
   - "Doğru/Yanlış sorusunun altına `Cevap: Doğru` ya da `Cevap: Yanlış` yaz (D ve Y de olur)."
   - "Şıksız soru açık uçlu olur. Word'den gelen görünmez karakterler temizlenir."
4. Yazmayı (yapıştırmayı) bıraktıktan 0,7 saniye sonra metin sunucuya gider ve sonuç alanı dolar. Beklerken **"Denetleniyor..."**,
   **"Ekle"** kapalı. Kutu boşken alan: "Yapıştırınca sorular burada listelenir; hatalı satırlar gösterilir."
5. Sonuç alanında:
   - özet: **"4 soru bulundu · sorun yok"** ya da **"4 soru bulundu · 2 sorun"** (yeniden denetlenirken sonuna "· denetleniyor...");
   - sorun listesi: her sorun başında kalın satır numarasıyla, ör. **"11. satır: 4. soruda doğru şık işaretli değil."** (ileti zaten
     satırla ya da "İlk sorudan" diye başlıyorsa önek yoktur);
   - bulunan sorular, sırayla: tür etiketi (**"Çoktan seçmeli"**, **"Doğru/Yanlış"**, **"Açık uçlu"**) ve soru metni; çoktan seçmelide
     harfli şıklar (doğru şık işaretli), Doğru/Yanlış'ta **"Cevap: Doğru"**, **"Cevap: Yanlış"** ya da **"Cevap: anlaşılamadı"**. Boş
     şık "boş şık", metinsiz soru "soru metni yok" diye görünür.
6. **"Ekle"**ye bas (en az bir soru bulunduysa açılır). Sorular düzenleyiciye geçer:
   - quizde yalnız hiç dokunulmamış boş ilk soru varsa onun yerine, yoksa mevcut soruların sonuna eklenir;
   - soru başına sürede her yeni soru 30 saniyeyle gelir;
   - quiz 100 soruyu aşacaksa fazlası alınmaz;
   - sorunlu sorular düzenleyicide kırmızı çerçeveyle ve sorunun iletisiyle işaretlenir; iletideki soru numarası düzenleyicideki
     sıraya çevrilir; soruya yazmaya başlayınca kırmızı kalkar;
   - bir soruya bağlanamayan sorunlar (ilk sorudan önceki satırlar, "Ve 12 sorun daha.") bilgi kutusunda madde madde kalır;
   - bilgi kutusunda özet: **"6 soru eklendi."**, gerekirse devamı **" Quizde en fazla 100 soru olabildiği için 3 soru alınmadı."**
     ve **" Sorunlu 2 soru kırmızıyla işaretlendi; düzelt."**; ekran ilk kırmızı soruya kayar.
7. Vazgeçmek için **"Vazgeç"**: yapıştırdığın metin atılır, düzenleyici geri gelir. Metin yapıştırıp "Ekle"ye basmadan ödevi
   kaydetmeye çalışırsan: "Yapıştırdığın soruları önce "Ekle" ile quize aktar ya da "Vazgeç" de."

**Ayrıştırıcının kuralları** (sunucu)

- **Soru satırı:** satır başında 1–3 haneli numara ve ardından `)`, `.` ya da `-` (Word'ün tireyi çevirdiği `–` `—` de olur). Nokta
  ya da tireden sonra rakam gelirse ("3.5 kg", "1-2 arası") soru sayılmaz.
- **Şık satırı:** `A)`, `a)`, `A.` biçimi; yıldız harften önce (`*A)`) ya da sonra (`A) *`) olabilir; Word'ün ve PDF'in yıldız
  benzerleri (`∗` `＊` `✱`) de yıldız sayılır. Sorunun ilk şıkkı A olmalı (soru metnindeki "I." "II." öncülleri şık sanılmasın).
  J'den sonraki harf ancak sıradaki şıksa şık sayılır (11. şık `K)` ise "en fazla 10 şık" hatası çıkar).
- **Cevap satırı:** `Cevap: Doğru`, `Cevap: Yanlış`, `Cevap: D`, `Cevap: Y` (büyük-küçük harf, Türkçe karaktersiz yazım da olur;
  `:` yerine tire de). Şıksız ama cevap satırlı soru Doğru/Yanlış olur; şıksız ve cevapsız soru açık uçlu olur.
- Şıktan sonraki satırlar o şıkka, şıktan önceki satırlar soru metnine eklenir.
- Word'den gelen görünmez karakterler (sıfır genişlikli boşluk, yumuşak tire, yön işaretleri, BOM), özel boşluklar ve denetim
  karakterleri silinir.

**Önizlemedeki iletiler** (satır ve soru numaraları örnek):

- "7. satır şıkka benziyor ama tanınmadı; önceki şıkka eklendi. Şıklar A) ya da A. biçiminde yazılır."
- "7. satır şıkka benziyor ama tanınmadı; soru metnine eklendi. Şıklar A) ya da A. biçiminde yazılır ve A ile başlar."
  ("A- şık", "A: şık" ya da ilk şıkkı B olan soru)
- "9. satır anlaşılamadı." (cevap satırından sonra gelen satır)
- "3. satır bir sorunun parçası değil; alınmadı." · "İlk sorudan önceki 4 satır (1–4. satırlar) bir sorunun parçası değil; alınmadı."
- "En fazla 100 soru eklenebilir; sonrası alınmadı."
- "4. sorunun 2. şıkkı boş." · "4. sorunun 2. şıkkı 300 karakterden uzun."
- "4. soruda "Cevap:" satırı yalnız Doğru/Yanlış sorusunda kullanılır; doğru şıkkı yıldızla (*) işaretle."
- "4. soruda en az 2 şık olmalı." · "4. soruda en fazla 10 şık olabilir."
- "4. soruda doğru şık işaretli değil." · "4. soruda bütün şıklar doğru işaretli; en az bir şık yanlış olmalı."
- "4. sorunun cevabı anlaşılamadı; "Cevap: Doğru" ya da "Cevap: Yanlış" yaz."
- "4. sorunun metni boş." · "4. sorunun metni 1000 karakterden uzun."
- "Metinde soru bulunamadı. Her soru "1)" ya da "1." gibi bir numarayla başlamalı."
- En çok 50 sorun listelenir; fazlası: "Ve 12 sorun daha. Önce yukarıdakileri düzelt."

Sunucunun reddettiği durumlar sonuç alanında kırmızı ileti olur: boş metin "Yapıştırılacak metin boş.", 300.000 karakterden uzun
metin "Metin çok uzun; soruları parça parça ekle.", çok sık istek "Çok fazla istek; biraz bekleyip tekrar dene.".

Tasarımda (Tasarım 1 önizlemesi):

- **"Metinden ekle"**, düzenleyicinin en üstündeki araç satırının ilk düğmesidir (yanında "Soru bankası" ve "Önizle"). Basınca
  ayarların üstünde **"Metinden ekle"** başlıklı bir panel açılır; sağ üstteki × paneli kapatır (aynı düğmeye yeniden basmak da).
- Panelde yapıştırma kutusu (yer tutucusu kısa örnek: "1) Soru metni / *A) doğru şık / B) yanlış şık / 2) Güneş bir yıldızdır. /
  Cevap: Doğru / 3) Açık uçlu soru"); yazarken anında özet **"3 soru eklenecek · 1 hata"**, hata listesi, bulunan soruların tür
  etiketli listesi (çoktan seçmelide "· 4 şık, 1 doğru") ve **"Ekle (3)"** düğmesi.
- "Ekle"den sonra panel kapanır, kısa ileti: **"3 soru metinden eklendi; düzenleyicide düzeltebilirsin."**
- Önizlemedeki hata cümleleri bugünkü sitedekilerden kısadır; kodlanırken sitedeki ayrıştırıcı ve iletileri kalır (önizleme
  ayrıştırıcıyı yalnız taklit eder).

## Kurallar ve sınırlar

- **Kim:** öğretmen ve müdür; öğrenci ve veli bu uca ulaşamaz. Önizleme ucu "Ödev verir" yetkisine ayrıca bakmaz (hiçbir şey
  kaydetmediği için); düğme zaten yalnız quiz düzenleyicide, yani ödev verebilen ya da ödevi düzenleyebilen kişide görünür.
- **Sınırlar:** yapıştırılan metin en çok 300.000 karakter; önizleme isteği kişi başına 10 dakikada 300 (yazmayı bıraktıktan 0,7 sn
  sonra istenir; her isteğe sıra numarası verilir, geç gelen eski cevap atılır); önizlemede en çok 50 sorun; quize en çok 100 soru.
- Önizleme hiçbir şey kaydetmez; sorular yalnız düzenleyiciye geçer, asıl kayıt "Ödevi ver" ya da "Kaydet" ile olur
  ([Ödeve quiz ekleme](quiz-ekleme.md)).
- Sorunlu soru da aktarılır (kırmızı işaretli). Gerçek bir hata taşıyan soru (boş şık, doğru şık yok, bütün şıklar doğru, metin boş…)
  düzeltilmeden ödev kaydedilemez: kaydederken düzenleyicinin denetimi durdurur. Yalnız uyarı olan soru (ör. "şıkka benziyor ama
  tanınmadı; önceki şıkka eklendi") geçerliyse olduğu gibi kaydedilebilir; kırmızı işaret yalnız ekrandadır.
- Metindeki resimler ve formül biçimleri aktarılmaz; yalnız yazı gelir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Ödeve quiz ekleme ve quiz düzenleyici](quiz-ekleme.md) — sorular buraya aktarılır.
- [Soru türleri](soru-turleri.md) — yıldızlı şık, cevap satırı ve şıksız sorunun hangi türe dönüştüğü.
- [Soruları Excel'den aktarma](excelden-soru-aktarma.md) — aynı işin Excel'le yapılacak yolu (tasarım).
- [Soru bankası](soru-bankasi.md) — kayıtlı sorulardan seçerek ekleme (tasarım).

**İlgili:**

- [Word ya da Docs'tan yapıştırma](../yazi-yazma/yapistirma.md) — ortak yazı düzenleyicide yapıştırılan biçimin temizlenmesi
  (tasarım; quiz yapıştırmasından ayrı).
- [Excel aktarımında önizleme ve hatalı satırlar](../excel-aktarim/onizleme-ve-hatalar.md) — benzer "önce önizle, sonra al" düzeni.

## Kod tarafı

- Ön yüz: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) ("Metinden ekle": `QUIZ_ORNEK_METIN`,
  `quizMetinPaneli`, `quizMetinDenetle`, `quizMetinSonucHtml`, `quizHataSatirOnEki`, `quiz-metin-ac`, `quiz-metin-ekle`,
  `quiz-metin-kapat`).
- Sunucu: [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (`metinUcu`: `POST /api/assignments/quiz-metin`, hız sınırı),
  [sunucu/yardimci/quiz.md](../../sunucu/yardimci/quiz.md) (`quizMetniAyristir`, `quizMetinTemizle`, `quizDyDegeri`,
  `QUIZ_HATA_EN_COK`), [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (ucun yönlendirilmesi).
- Testler: [testler/test-quiz-metin.md](../../testler/test-quiz-metin.md) (ayrıştırıcı: numara ve şık biçimleri, yıldızlar,
  Word karakterleri, uyarılar), [testler/test-quiz.md](../../testler/test-quiz.md) (uç).

## Sık sorulanlar

- **Word'deki sorularımı nasıl aktarırım?** Her soruyu `1)` gibi numarayla, şıkları `A)` ile başlat; doğru şıkkın başına yıldız koy
  (`*A)`), Doğru/Yanlış sorusunun altına `Cevap: Doğru` yaz, kopyala ve "Metinden ekle" kutusuna yapıştır.
- **Önizlemede "şıkka benziyor ama tanınmadı" yazıyor.** O satır `A-` ya da `A:` ile başlıyor ya da ilk şık B. Şıkları `A)` ya da
  `A.` ile yaz ve A'dan başlat.
- **Soru metnimde "I. … II. …" öncülleri var, şık sanılır mı?** Hayır; sorunun ilk şıkkı A olmalı, öncüller soru metninde kalır.
- **"3.5 kg" gibi satırlar soru sanılır mı?** Hayır; nokta ya da tireden hemen sonra rakam gelen satır soru sayılmaz.
- **Hatalı soruları da ekler mi?** Evet; kırmızı işaretlenir, düzenleyicide düzeltirsin.

## Sırada

- Düzenleyiciler işi: Tasarım 1 önizlemesindeki araç satırı ve panel görünümü; soru metni ortak yazı düzenleyiciye geçince
  yapıştırılan metnin nasıl biçimleneceği o işte belirlenecek.
- Soruları Excel'den aktarma (anket düzenleyici / sınav formülü işleri) bu panelin yanına gelecek.
