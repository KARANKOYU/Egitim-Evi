# Quiz · Önizle (öğrenci gözüyle)

**Durum:** Kodda var; tasarımda ek olarak önizleme bütün soruları alt alta gösterir, başında quizin özeti ve kuralları yazar, soruların fotoğrafı ve matematik yazımı da görünür.

Öğretmenin hazırladığı quizi öğrencinin göreceği biçimde, hiçbir şey kaydetmeden gezdiği görünüm.

## Ne işe yarar

Öğretmen ödevi vermeden önce soruların öğrencide nasıl göründüğünü (tek mi çok mu seçimli, şık sırası, açık uçlu kutusu, soru
başına sürede sıra) görür. Önizleme yalnız öğretmenin tarayıcısında çalışır: seçilen şıklar ve yazılan cevaplar hiçbir yere
gitmez, doğru cevap gösterilmez. Kilitli quizde de çalışır; ödevi verdikten sonra kontrol ekranından da açılır.

## Nereden açılır

- **Öğretmen, düzenleyicide:** "Yeni ödev" ya da "Ödevi düzenle" penceresinde quiz bölümünün altındaki **"Önizle"** (göz simgeli).
  Quiz kilitliyse bölümde yalnız bu düğme vardır ([Ödeve quiz ekleme](quiz-ekleme.md)).
- **Öğretmen ve müdür, kontrol ekranında:** "Ekler"in ilk satırı olan quiz satırında **"Önizle"** ([Öğretmenin gördüğü
  cevaplar](ogrencinin-cevaplari.md)). Müdür bunu öğretmeni ayrılmış ödevin kontrol ekranında kullanır.

## Adım adım

### Öğretmen

**Düzenleyicide**

1. **"Önizle"**ye bas. Ekranda yazdıkların saklanır, quiz bölümü önizlemeye döner ve başa kaydırılır.
2. En üstte mavi kutu: **"Önizleme: öğrenci quizi böyle görür. Cevaplar kaydedilmez."**
3. Altında öğrencideki gibi bir üst şerit: **"Soru 2/5"** ve saat simgesiyle süre yazısı:
   - soru başına sürede o sorunun süresi ve altında **"bu soru için"** (süre yazılmamışsa "—");
   - bütün quizde toplam süre ve altında **"bütün quiz"**;
   - süresizde **"Süresiz"**. Sayaç işlemez.
4. Soru kartı: numara, tür adı, soru metni ve öğrencinin göreceği cevap alanı ([Soru türleri](soru-turleri.md)). Boş bırakılmış metin
   **"Soru metni yazılmadı"**, boş şık **"boş şık"** diye görünür. Doğru şık işaretli görünmez.
5. Şık seçebilir, açık uçlu kutuya yazabilirsin; seçimin yalnız bu önizlemede, başka soruya gidip dönünce de durur.
6. Gezinme:
   - **soru başına sürede:** **"Öğrenci bir sonraki soruya geçince bu soruya dönemez."** notu ve **"Sonraki soru"**; son soruda
     **"Başa dön"**;
   - **süresiz ve bütün quizde:** **"Önceki"** ve **"Sonraki"** (uçlarda kapalı).
7. **"Önizlemeden çık"** düzenleyiciye döner. Soru yoksa önizlemede: **"Önizlenecek soru yok."**
8. Önizleme açıkken ödevi kaydetmeye çalışırsan ve quizde hata varsa önizleme kapanır, hatalı soru gösterilir.

**Kontrol ekranında**

1. Quiz satırında **"Önizle"**ye bas. **"Önizleme: <ödevin adı>"** başlıklı ayrı bir pencere açılır (ör. "Önizleme: Kesirlerle
   toplama"); içi düzenleyicideki önizlemenin aynısı, ama "Önizlemeden çık" yerine pencerenin **"Kapat"**ı vardır.
2. Bu önizleme quizin kayıtlı hâlini gösterir; değişiklik yapmaz.

Tasarımda (Tasarım 1 önizlemesi):

- **"Önizle"**, düzenleyicinin üstündeki araç satırının üçüncü düğmesidir; basınca düzenleyicinin yerine önizleme gelir, yeniden
  basınca ya da **"Düzenlemeye dön"**e basınca düzenleyiciye dönülür.
- Önizlemenin başında **"Önizleme"** ve altında küçük yazıyla quizin özeti ve kuralları: **"öğrenci böyle görür · 10 soru (1 açık uçlu,
  puansız) · 20 dakika · tek deneme"**, çıkınca kapanır seçiliyse sonuna **"· sekmeden çıkarsa o soru kapanır"**.
- Sorular tek tek değil alt alta görünür: her birinde **"Soru 1 / 10"** (soru başına sürede **"· 60 sn"**), soru metni (matematik
  yazımı biçimli), varsa fotoğrafı, cevap alanı. Doğru/Yanlış iki seçenek; çok doğrulu soruda "Birden çok şık seçebilirsin." ve
  kutucuklar; açık uçluda "Cevabın" yer tutuculu kutu. Metni yazılmamış soru "(soru metni yok)" diye görünür.

## Kurallar ve sınırlar

- Önizleme hiçbir şey kaydetmez, sunucuya istek göndermez; deneme açmaz, quizi kilitlemez.
- Doğru şık bilgisi önizlemede gösterilmez (öğrenci de çözerken görmez).
- Sayaç işlemez; soru başına sürede sıradan geçiş elle yapılır ("Sonraki soru"), süre dolunca kendiliğinden geçmez.
- Kontrol ekranındaki "Önizle" ekranı gören herkese (ödevin sahibi, sahipsiz ödevde müdür) görünür; ek yetki istemez.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Ödeve quiz ekleme ve quiz düzenleyici](quiz-ekleme.md) — "Önizle" düğmesinin bulunduğu düzenleyici.
- [Quiz çözme](quiz-cozme.md) — önizlemenin taklit ettiği gerçek ekran.
- [Soru türleri](soru-turleri.md), [Süre ve tek deneme](sure-ve-tek-deneme.md).
- [Öğretmenin gördüğü cevaplar](ogrencinin-cevaplari.md) — kontrol ekranındaki quiz satırı.
- [Soruya fotoğraf ve matematik yazımı](soru-resmi-ve-matematik.md) — tasarımda önizlemede de görünür.

**İlgili:**

- [Anket oluştur](../anket/anket-olustur.md) — anketin "Katılımcı gözüyle önizle"si (benzer düşünce, ayrı ekran).

## Kod tarafı

- Ön yüz: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) ("Önizle": `quizOnizleSorulari`, `quizOnizleHtml`,
  `quiz-onizle`, `quiz-onizle-kapat`, `quiz-onizle-git`, `quiz-onizle-ac`; `QUIZ_DZ.onizle`), [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md)
  (kontrol ekranı).
- Sunucu: önizleme sunucuya gitmez; kontrol ekranındaki önizleme quizi `GET /api/assignments/<id>`'den gelen kayıtlı hâlden alır
  ([sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md), [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) `ogretmenQuizi`).

## Sık sorulanlar

- **Önizlemede seçtiğim şıklar kaydedilir mi?** Hayır; önizleme hiçbir şey kaydetmez.
- **Önizleme quizi kilitler mi?** Hayır; quizi yalnız bir öğrencinin başlatması kilitler.
- **Öğrenci başladıktan sonra quize bakabilir miyim?** Evet; düzenleyicide ve kontrol ekranında "Önizle" kilitliyken de çalışır.
- **Önizlemede doğru cevaplar görünmüyor.** Bilerek; öğrenci de görmez. Doğruları düzenleyicide ya da bir öğrencinin cevap
  ayrıntısında görürsün.

## Sırada

- Düzenleyiciler işi: önizlemede fotoğraf ve matematik yazımı; Tasarım 1'deki "bütün sorular alt alta" önizleme düzeni bu işle ya da
  arayüz çalışmasıyla gelir.
