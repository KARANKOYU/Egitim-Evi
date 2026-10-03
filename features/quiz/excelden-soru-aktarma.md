# Quiz · Soruları Excel'den aktarma

**Durum:** Tasarlandı — henüz kodda yok

Öğretmenin quiz sorularını bir Excel dosyasından (A sütunu soru, sonraki sütunlar şıklar, doğru şık işaretli) quize toplu
aktarması.

## Ne işe yarar

Kullanıcı 28 Eylül akşamı anket için "Excel ile değil, editörle" dedi ve hemen ardından ekledi: "sınavları Excel'le olur". Bu söz
quiz sorularının Excel'den aktarılması olarak kayda geçti (anket tanımındaki karar: "EXCEL SINAV TARAFINDA … quiz sorularını
Excel'den aktarma"). Öğretmen soru havuzunu zaten bir tabloda tutuyorsa her soruyu yeniden yazmaz; dosyayı seçer, önizlemede
sorunları görür, soruları quize ekler. "Metinden ekle"nin Excel'li kardeşidir.

Kullanıcıya sunulan biçim önerisi (28 Eylül): A sütunu soru, B'den sonraki sütunlar şıklar, doğru şık işaretli. Sözün sınav
NOTLARINI Excel'den yüklemeyi de kapsayıp kapsamadığı ayrıca soruldu, cevap bekleniyor; notların Excel'i sınav klasöründe
anlatılıyor ([Notları Excel'den yükleme](../sinav/excelden-not.md)).

## Nereden açılır

- **Öğretmen:** quiz düzenleyicide, **"Metinden ekle"**nin yanında bir Excel düğmesi (yer bugünkü kod belgesinin planında yazılı:
  "quiz sorularını Excel'den aktarma ("Metinden ekle"nin yanına)"). Düğmenin adı belirlenmedi; sitenin öbür Excel ekranlarındaki
  gibi "Excel'den aktar" olması önerilir. Tasarım 1 önizlemesinde quiz için Excel düğmesi çizilmedi (önizlemede Excel'den aktarma
  yalnız sınav notlarında var).

## Adım adım

### Öğretmen

Akış tanımda ve öneride şöyledir; kesinleşmemiş ayrıntılar "öneri" diye işaretli.

1. Quiz düzenleyicide Excel düğmesine bas; dosya seçiciden `.xlsx`, `.xls`, `.ods` ya da `.csv` dosyanı seç (sitenin tablo okuyucusu
   bu türleri bugün de okuyor).
2. Dosyada her satır bir soru:
   - **A sütunu:** soru metni;
   - **B, C, D … sütunları:** şıklar (sırayla A, B, C … şıkları olur);
   - **doğru şık:** "işaretli" (önerinin sözü). Nasıl işaretleneceği kararlaştırılmadı. Öneri: "Metinden ekle"deki gibi doğru
     şıkkın başına yıldız (`*12`); birden çok doğru olabilir.
   - Şık sütunları boş satır açık uçlu soru olur (öneri; anket önerisindeki "seçenek yoksa açık uçlu" kuralının aynısı).
   - Doğru/Yanlış sorusu için öneri: şık sütunlarına yalnız "Doğru" ve "Yanlış" yazılır, doğru olan yıldızlanır.
   - İlk satır "Soru" başlığıysa atlanır (anket önerisindeki kural).
3. Dosya okununca "Metinden ekle"deki gibi bir önizleme çıkar (öneri): bulunan sorular tür etiketleriyle, sorunlu satırlar satır
   numarasıyla.
4. **"Ekle"** ile sorular düzenleyiciye geçer; sorunlu sorular kırmızı işaretlenir, düzenleyicide düzeltilir. Asıl kayıt yine
   "Ödevi ver" ya da "Kaydet" ile ([Ödeve quiz ekleme](quiz-ekleme.md)).
5. Öneri: boş bir örnek dosya indirme bağlantısı ("Örnek Excel indir" — anket önerisinde vardı).

## Kurallar ve sınırlar

- Quizin bugünkü bütün sınırları aynen geçerli olur: en çok 100 soru; soru metni 1000, şık 300 karakter; çoktan seçmelide 2–10
  şık, en az bir doğru ve en az bir yanlış şık ([Soru türleri](soru-turleri.md)). Fazla satırlar alınmaz ve söylenir.
- Dosya sunucuya saklanmak için gitmez; yalnız okunur, sorular düzenleyiciye aktarılır (öneri; bugünkü "Metinden ekle" de hiçbir
  şey kaydetmez).
- Quiz kilitliyse (bir öğrenci başladıysa) aktarma yapılamaz.
- Yetki: quizi yazmakla aynı ("Ödev verir").

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Quiz](README.md)):

- [Metinden ekle](metinden-ekle.md) — aynı işin yapıştırarak yapılan, bugün çalışan yolu.
- [Ödeve quiz ekleme ve quiz düzenleyici](quiz-ekleme.md), [Soru türleri](soru-turleri.md), [Soru bankası](soru-bankasi.md).

**İlgili:**

- [Notları Excel'den yükleme ve Excel'e indirme](../sinav/excelden-not.md) — sınav notlarının Excel'i (aynı "Excel'le olur" sözüne dayanır).
- [İçeri aktarım](../excel-aktarim/ice-aktarim.md), [Önizleme ve hatalı satırlar](../excel-aktarim/onizleme-ve-hatalar.md) — sitenin
  bugünkü Excel aktarımı (öğrenci ve servisçi listeleri).
- [Anket oluştur](../anket/anket-olustur.md) — anket Excel'le değil düzenleyiciyle kurulur (kullanıcının kararı).

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Tablo okuma: [sunucu/yardimci/tablo-oku.md](../../sunucu/yardimci/tablo-oku.md) (xlsx/xls/ODS/CSV/metin).
- Doğrulama ve önizleme: [sunucu/yardimci/quiz.md](../../sunucu/yardimci/quiz.md) (`quizDogrula`, `quizMetniAyristir`'in kural ve
  ileti düzeni), [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (`metinUcu` gibi bir önizleme ucu).
- Düzenleyici: [public/js/parcalar/14c-quiz.md](../../public/js/parcalar/14c-quiz.md) (Son durum bölümü bu işi "quiz sorularını
  Excel'den aktarma ("Metinden ekle"nin yanına)" diye anıyor; `quiz-metin-ekle`'nin aktarma ve kırmızı işaretleme düzeni).
- Örnek dosya indirme: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (bugünkü Excel şablonu gönderimi).

## Sık sorulanlar

- **Bugün Excel'den soru aktarabilir miyim?** Hayır. Excel'deki soruları kopyalayıp "Metinden ekle" biçimine getirerek
  yapıştırabilirsin ([Metinden ekle](metinden-ekle.md)).
- **Doğru şıkkı Excel'de nasıl işaretleyeceğim?** Henüz kararlaştırılmadı; öneri yıldızdır (`*`), "Metinden ekle"deki gibi.

## Sırada

- Anket düzenleyici işi ("… + quiz sorularını Excel'den aktarma") ya da Sınav: formüllü ölçüm işi ("quiz sorularını Excel'den
  aktarma aynı işte yapılabilir"). Kapsamı (sınav notları da mı) ve doğru şıkkın işaretlenme biçimi kullanıcıya sorulacak;
  tasarımı Tasarım 1 önizlemesine de eklenecek.
