# Quiz · Süre ve tek deneme

**Durum:** Kodda var

Quizin süresinin (süresiz, soru başına, bütün quiz) sunucuda nasıl işlediği, quizin ne zaman başlatılabileceği ve her öğrencinin
tek denemesi.

## Ne işe yarar

Kullanıcının 26 Eylül sözleri: "soru başına süre yapabilir"; "uygulamayı arkaya alıp bakmaya karşı sürede yazabilir ama süresizde
olabilir"; "bir kerelik, iki kere yapılamaz". Süre öğrencinin tarayıcısında değil sunucuda işler: sayfa kapansa, bağlantı kopsa da
durmaz. Her öğrencinin tek denemesi vardır; aynı anda iki kez "Başlat"a basmak bile ikinci deneme açmaz. Öğretmen ikinci hak veremez.

## Nereden açılır

- **Öğretmen:** süre türü quiz düzenleyicide seçilir: **"Süre"** → **"Süresiz"**, **"Soru başına"**, **"Bütün quiz"**
  ([Ödeve quiz ekleme](quiz-ekleme.md)).
- **Öğrenci:** kurallar ekranında süre ve tek hak yazar; çözme ekranının üst şeridinde kalan süre görünür ([Quiz çözme](quiz-cozme.md)).

## Adım adım

### Öğrenci

**Başlatma şartları**

1. Quizi ancak şu şartlarla başlatırsın (sunucu denetler; değilse ödev penceresinde ve kurallar ekranında nedeni yazar):
   - ödev sonuçlandırılmamış — değilse **"Ödev sonuçlandırıldı; quiz kapandı."**;
   - ödevin başlama tarihi ve saati gelmiş — değilse **"Quiz 05.10.2026 08:00 tarihinde açılacak."**;
   - son teslim geçmemiş — değilse **"Son teslim geçti; quiz başlatılamaz."**;
   - sonuçlar kalıcı açılmamış — değilse **"Quizin sonuçları açıklandı; artık başlatılamaz."**
2. Başlattığın an deneme açılır, süre işlemeye başlar ve ödev "açıldı" sayılır.

**Süresiz quiz**

3. Sorular arasında serbestçe gezersin (**"Önceki"**, **"Sonraki"**, soru numaraları), **"Bitir"** ile bitirirsin.
4. Ödevin son teslimi varsa quiz en geç **son teslim + 10 dakikada** kendiliğinden biter. O ana bir saatten az kalınca şeritte
   sayaç ve altında **"kapanmasına"** görünür; daha çok varsa ya da son teslim yoksa **"Süresiz"** yazar.

**Bütün quiz için süre**

5. Kurallarda "Bütün quiz için 20 dk süren var…". Serbestçe gezersin; şeritte **"kalan süre"** sayar.
6. Süre bitince sunucu denemeyi kapatır (bitiş nedeni **"Süre doldu; quiz bitti."**). Bitiş, başlama + quiz süresi ile son teslim + 10
   dakikadan hangisi önce geliyorsa odur.

**Soru başına süre**

7. Sorular sırayla gelir; sana yalnız o anki soru gönderilir, önceki soruya dönülmez.
8. Şeritte **"bu soru için"** kalan süre ve altta süre çubuğu. **"Sonraki soru"** ile erken geçebilirsin (cevapsızsa onay sorar).
9. Sorunun süresi dolunca soru kapanır, sıradaki soru **tam o anda** başlamış sayılır — sen ekranda olmasan da. Dönünce süresi geçmiş
   sorular kapanmış olur, kaldığın sorudan sürersin. Ekrandaysan kendiliğinden geçilir: "Önceki sorunun süresi doldu; bu soruya
   geçildi."
10. Son sorunun süresi dolunca ya da son soruda "Bitir" deyince deneme biter. Son teslim + 10 dakika sınırı burada da geçerlidir.

**Tek deneme**

11. Quiz ikinci kez çözülemez. Sayfa kapandıysa ödevden **"Devam et"** aynı denemeyi açar; deneme bittiyse **"Sonucu gör"** ya da
    **"Quizi aç"** yalnız sonuç sayfasını açar.

### Öğretmen

1. Süre türünü ve süreleri düzenleyicide seçersin: bütün quiz 1–180 dakika; soru başına her soruya 10–600 saniye. Seçimi bir öğrenci
   başlayana kadar değiştirebilirsin; sonra quiz kilitlenir.
2. **Son teslim + 10 dakika payı:** son teslimden hemen önce başlayan öğrenci de bitirebilsin diye deneme son teslimden sonra en çok 10
   dakika sürer (teslim dosyalarındaki pay gibi).
3. **Ödevi sonuçlandırınca** quiz kapanır: yeni başlatma olmaz, süren denemeler o an biter (nedeni "Öğretmen quizi kapattı (ödevi
   sonuçlandırdı ya da sonuçları açtı); quiz bitti."; süresi ya da son teslim payı zaten dolmuş deneme o andaki saatle ve o nedenle:
   "Süre doldu; quiz bitti." ya da "Son teslim geçtiği için quiz bitti.").
   **"Sonuçları şimdi aç"** da aynı biçimde süren denemeleri bitirir ([Sonuçlar ve puan](sonuclar.md)).
4. **"Tekrar aç"**: sonuçlandırma sırasında quizi çözmüş (ya da o an denemesi biten) bir öğrenci varsa doğru cevaplar açılmıştır ve bu
   açılış kalıcıdır; tekrar açmak yalnız ödevi açar, quizi çözmemiş öğrenci quizi başlatamaz. Kontrol ekranında "Tekrar aç"
   önce sorar: **"Quizin doğru cevapları açıklandığı için quizi çözmemiş 5 öğrenci quizi başlatamaz; yalnızca ödev yeniden
   açılır."** ve altında **"Ödev tekrar açılsın mı?"** ([Sonuçları düzeltme ve tekrar açma](../odev/sonuclari-duzeltme.md)). Hiç kimse
   quizi başlatmadan sonuçlandırılmış ödevde açılış kalıcı olmaz; tekrar açınca öğrenciler çözebilir (son teslim geçmediyse ya da
   ileri alındıysa ve sonuçlar başka yoldan kalıcı açılmadıysa).
5. **Son teslimi ileri almak:** "Son teslimden 10 dakika sonra görünsün" seçili quizde son teslim + 10 dakika geçtiğinde quizi bitirmiş
   biri varsa açılış kalıcıdır (doğru cevaplar görülebilir olmuştur): tarihi uzatsan da quiz yeniden başlatılamaz. "Ödevi düzenle"de
   tarihi değiştirip kaydedince ileti: **"Ödev güncellendi. Quizin sonuçları açıklandığı için quiz yeniden başlatılamaz."** Bitiren
   yoksa tarih uzatılınca quiz yeniden başlatılabilir.
6. İkinci hak verme yoktur (kullanıcı: "iki kere yapılamaz").

## Kurallar ve sınırlar

- **Süre sunucuda işler:** öğrencinin saatine güvenilmez; sayaç sunucunun saatine göre yalnız gösterir. Denemenin hâli her okumada ve
  dakikada bir çalışan temizlikte yeniden hesaplanır; bağlantısı kopan öğrencinin süresi dolan denemesi de böyle kapanır.
- **Gecikme payı 3 saniye:** süre bittikten sonraki 3 saniye içinde sunucuya ulaşan cevap kabul edilir.
- **Sınırlar:** soru başına 10–600 saniye; bütün quiz 1–180 dakika; deneme en geç son teslim + 10 dakika.
- **Tek deneme:** her öğrenci için tek deneme satırı; aynı anda gelen ikinci "Başlat" yeni deneme açmaz, var olanı döndürür. Başlatma
  isteği öğrenci başına 10 dakikada 30 ("Çok fazla deneme; biraz bekleyip tekrar dene.").
- **Kalıcı açılış:** doğru cevaplar bir kez görülebilir olduysa (öğretmen "Sonuçları şimdi aç" dedi; ödev, quizi bitiren ya da o an
  denemesi biten biri varken sonuçlandırıldı; ya da son teslimle açıldı ve bitiren biri var)
  quiz yeniden başlatılamaz — son teslim ileri alınsa ya da ödev "Tekrar aç"ılsa bile. Amaç kopyayı önlemek: çözmemiş öğrenci doğru
  cevapları arkadaşından öğrenmiş olabilir.
- **Saat dilimi:** başlama ve son teslim sunucunun yerel saatiyle hesaplanır (sunucu Türkiye saatinde çalışmalı).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Quiz çözme](quiz-cozme.md) — sayacın ve gezinmenin göründüğü ekran.
- [Ödeve quiz ekleme ve quiz düzenleyici](quiz-ekleme.md) — süre türünün seçildiği yer.
- [Çıkış kaydı](cikis-kaydi.md) — "çıkınca o soru kapanır" soru başına sürede sıradaki soruya geçirir.
- [Sonuçlar ve puan](sonuclar.md) — sonuçların açılması ve kalıcılığı.

**İlgili:**

- [Sonuçlandırma](../odev/sonuclandirma.md), [Sonuçları düzeltme ve tekrar açma](../odev/sonuclari-duzeltme.md) — quizi kapatan işler.
- [Ödevi düzenleme ve silme](../odev/odevi-duzenleme-ve-silme.md) — son teslimi değiştirmek.
- [Tarih ve saat](../odev/tarih-ve-saat.md) — ödevin başlama ve son teslim saati.

## Kod tarafı

- Sunucu: [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (`baslatmaEngeli`, `ilerlet`, `denemeIsle`, `acikDenemeleriKapat`,
  `quizTemizle`, `odevSonuclandi`, `teslimSonuclariniSabitle`, `TESLIM_PAYI_MS`), [sunucu/yardimci/quiz.md](../../sunucu/yardimci/quiz.md)
  (`denemeIlerlet`, `QUIZ_PAY_MS`), [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) (`odevBaslamaAni`, `odevBitisAni`,
  "Tekrar aç" ve düzenleme iletileri), [sunucu/index.md](../../sunucu/index.md) (dakikalık temizlik).
- Ön yüz: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) (`quizTik`, `quizSayac`, `quizSureDoldu`,
  `quizSonrakiIste`, `quizTekrarAcUyarisi`), [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) ("Tekrar aç" onayı).
- Veri: [sunucu/veri/depo/quiz.md](../../sunucu/veri/depo/quiz.md) (`denemeBaslat` — tek deneme, `sonucAc`).
- Testler: [testler/test-quiz.md](../../testler/test-quiz.md) (soru başına süre, bütün quiz süresi, dakikalık temizlik, başlama anı ve
  son teslim + 10 dakika, aynı anda iki "Başlat").

## Sık sorulanlar

- **Bağlantım koptu, süre durdu mu?** Hayır; süre sunucuda işler. Dönünce süresi geçen sorular kapanmış olur, kaldığın yerden sürersin.
- **Son teslimden 5 dakika önce başladım, yetişir mi?** Quiz en çok son teslimden 10 dakika sonrasına kadar sürer (bütün quiz süresi
  daha önce biterse o zaman biter).
- **Öğretmen bana ikinci hak verebilir mi?** Hayır; quiz tek denemelidir.
- **Ödev tekrar açıldı ama quiz başlamıyor.** Doğru cevaplar açıklandıysa quiz bir daha başlatılamaz; yalnız ödev yeniden açılır.
- **Süresiz quizde neden sayaç çıktı?** Ödevin son teslimi + 10 dakikaya bir saatten az kaldı; quiz o anda kendiliğinden biter.

## Sırada

- Android yerel uygulama: aynı süre kuralları uygulamadaki quiz ekranında (sayaç yalnız gösterir, süre sunucuda).
- Optimizasyon + saklama süreleri işi: biten denemeler ve cevaplar 1 yıl sonra silinecek ([Saklama ve silinme](saklama-ve-silinme.md)).
