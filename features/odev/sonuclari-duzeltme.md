# Ödevler · Sonuçları düzeltme ve tekrar açma

**Durum:** Kodda var.

Sonuçlanmış ya da süresi geçmiş bir ödevin sonuçlarını sonradan değiştirmek ("Sonuçları düzenle" → "Değişiklikleri kaydet") ve sonuçlanmış ödevi yeniden aktif yapmak ("Tekrar aç").

## Ne işe yarar

Kullanıcı 29 Ağustos'ta istedi: "öğretmenler ödev tarihi dolsa da ödevi bulup sonuçlarını değiştirebilsin"; 26 Eylül'de:
"daha önceden sonuçlanan bir ödev, bir mesaj sonradan editlenebilecek". Öğrenci ödevini geç getirdiyse "Yapmadı"yı "Geç
yaptı"ya çevirirsin; yanlışlıkla erken sonuçlandırdığın ödevi yeniden açarsın.

Ödevin kendisini (adı, açıklaması, tarihleri) düzeltmek ayrı: [Ödevi düzenleme ve silme](odevi-duzenleme-ve-silme.md).

## Nereden açılır

- **Öğretmen:** "Ödevler" → "Geçmiş ödevler"de ödevin gri **"Sonuçları düzenle"** düğmesi → kontrol ekranı. Süresi geçmiş ama
  sonuçlanmamış ödevde düğme yine **"Sonuçlandır"**. Bulmak için süzgeç: "Durum" → "Sonuçlananlar" ya da "Süresi dolmuş,
  sonuçlanmamış" ([Süzgeçler](suzgecler.md)).
- Kontrol ekranının altında **"Değişiklikleri kaydet"** ve **"Tekrar aç"**.
- **Müdür:** öğretmeni ayrılmış (sahipsiz) ödevde aynısı.

## Adım adım

### Öğretmen — sonucu değiştirmek

1. "Sonuçları düzenle"ye bas. Üstte mavi bilgi: **"Bu ödevin süresi doldu ve sonuçlandırıldı. Sonuçları yine de değiştirip
   yeniden kaydedebilirsin."** (ekran salt okunur değildir).
2. Değiştireceğin öğrencinin kutusunu yeni sonuca çevir (ör. "Yapmadı" → "Geç yaptı").
3. Bir öğrencinin sonucunu tamamen kaldırmak için kutusunu **"— Seç —"**e getir.
4. **"Değişiklikleri kaydet"**e bas; "Ödevler" sayfasına dönersin.
5. Sonucu **değişen** öğrenciye (ve velisine) bildirim gider: **"Matematik dersinden "Oran orantı" ödevi sonucu değişti: Geç
   yaptı"**. Hiç sonucu olmayan öğrenciye ilk kez sonuç verdiysen: "… ödevi açıklandı: Yaptı". Kaldırılan sonuç için bildirim
   gitmez; öğrenci o ödevde "Değerlendirilmedi" görür.

### Öğretmen — tekrar açmak

1. Sonuçlanmış ödevin kontrol ekranında **"Tekrar aç"**a bas.
2. Ödevde quiz varsa ve quizin doğru cevapları açıklandıysa, çözmemiş öğrenci varken önce sorulur: **"Quizin doğru cevapları
   açıklandığı için quizi çözmemiş 5 öğrenci quizi başlatamaz; yalnızca ödev yeniden açılır. Ödev tekrar açılsın mı?"**
3. Onaylayınca ödev yeniden **aktif** olur ve "Ödevler" sayfasına dönersin (ayrı bir ileti çıkmaz). Ödev "Aktif ödevler"e geçer.
4. Öğrenciler için: ödev listelerinde yeniden aktif (sonuç etiketi yerine kalan süre ya da "Süresi doldu"); son teslim
   geçmediyse dosya yüklemesi yeniden açılır; doğru cevaplar açıklanmadıysa quizi çözmemiş öğrenci çözebilir. Bildirim gitmez.
5. Daha önce girdiğin sonuçlar silinmez, ödev aktifken öğrenciye görünmez; yeniden sonuçlandırınca kalır, yalnız değiştirdiğin
   öğrenciye bildirim gider.

### Öğrenci ve veli

Sonuç değişince bildirim gelir ve listedeki etiket değişir. Tekrar açılan ödev listede yeniden aktif olur; bunun için bildirim
gelmez. Ödev serisi ve ilerleyiş yeni sonuca göre hesaplanır ([Ödev serisi](seri.md)).

### Tasarımda (Tasarım 1 önizlemesi)

Kontrol ekranı aynı mantıkta: bilgi kutusu "Bu ödevin süresi doldu ve sonuçlandırıldı. Sonuçları yine de değiştirip yeniden
kaydedebilirsin; adını, açıklamasını ve tarihlerini Ödevi düzenle ile değiştirirsin.", düğme **"Değişiklikleri kaydet"**, alt
çubukta **"Kaydedildi: 10:34"**. Önizlemede "Tekrar aç" düğmesi yok; kullanıcı bunun için bir şey söylemedi, bugünkü site
gibi kalır.

## Kurallar ve sınırlar

- **Yetki:** sonuç değiştirmek ve tekrar açmak "Ödev sonuçlandırır" yetkisi ister: **"Bu ödevi sonuçlandırma yetkin yok"**,
  **"Bu ödevi yeniden açma yetkin yok"**. "Tekrar aç" düğmesi yalnız bu yetkiyle ve yalnız sonuçlanmış ödevde çıkar.
- **Süre sınırı yok:** sonuçlar ödevin son tesliminden aylar sonra da değiştirilebilir (aktif eğitim yılındayken).
- **Geçmiş eğitim yılı:** yıl seçicide geçmiş yıla bakarken değiştirilemez: **"Geçmiş bir eğitim yılına bakıyorsun; kayıtlar salt
  okunur. Değişiklik için üstteki yıl seçiciden aktif yıla dön."**
- **Teslim dosyaları:** tekrar açılan ödevin teslim dosyaları açılıştan en az 7 gün daha kalır (son tarihsiz ödevde silinme
  sonuçlandırmaya bağlı olduğu için) ([Saklama ve silinme](saklama-ve-silinme.md)).
- **Quiz:** doğru cevapları gören olduysa quizin sonuçları kalıcı açıktır; tekrar açmak quizi yeniden başlatmaz. Kimse
  bitirmeden sonuçlandırılmış ödevde açılış kalıcı olmaz; tekrar açınca başlamamış öğrenci quizi çözebilir
  ([Quiz sonuçları](../quiz/sonuclar.md)).
- **Bildirim:** yalnız sonucu yeni verilen ya da değişen öğrenciye; tekrar açma ve sonuç kaldırma bildirim göndermez.
- **İşlem kaydı:** sonuç değiştirme işlem kaydına yazılmaz.
- **Bilinen açıklar:** kaydedilmemiş seçimler sayfadan çıkınca uyarısız kaybolur; müdürün "Geri dön"ü onu yanlış sayfaya
  götürür ([Sonuçlandırma](sonuclandirma.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Sonuçlandırma](sonuclandirma.md) · [Ödevi düzenleme ve silme](odevi-duzenleme-ve-silme.md) ·
[Süzgeçler](suzgecler.md) · [Ödev serisi](seri.md) · [Saklama ve silinme](saklama-ve-silinme.md).

**İlgili:** [Quiz sonuçları](../quiz/sonuclar.md), [Bildirim metinleri](../bildirim/bildirim-metinleri.md),
[Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md), [Mesajı düzeltme ve silme](../mesaj/duzeltme-ve-silme.md) (kullanıcının
aynı istekteki öbür parçası).

## Kod tarafı

- Ön yüz: [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) — `odevAc` (sonuçlanmış ya
  da süresi geçmiş ödevde bilgi kutusu, "Değişiklikleri kaydet", "Tekrar aç"); [25-tiklama.md](../../public/js/parcalar/25-tiklama.md)
  — `odev-bitir`, `odev-tekrar` (önce `quizTekrarAcUyarisi`, [14c-quiz.md](../../public/js/parcalar/14c-quiz.md)).
- Sunucu: [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) — `POST …/finish` (yalnız değişene bildirim, "sonucu
  değişti"), `POST …/reopen` (`odev.sonuclandir`; cevap iletisi ekranda gösterilmez).
- Depo: [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) — `sonuclandir`, `yenidenAc` (durum `active`,
  `dosya_saklama` en az şimdi + 7 gün).
- Testler: [testler/test-odev-saat.md](../../testler/test-odev-saat.md) (süresi geçmiş ödevin sonucunu değiştirme, yeniden
  açma), [testler/test-odev-dosya.md](../../testler/test-odev-dosya.md) (`reopen` ve dosyaların kalması),
  [testler/test-bildirim.md](../../testler/test-bildirim.md), [testler/test-quiz.md](../../testler/test-quiz.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Sonradan düzeltme").

## Sık sorulanlar

- **Geçen ayın ödevinde bir sonucu düzeltebilir miyim?** Evet; "Geçmiş ödevler"de "Sonuçları düzenle".
- **Tekrar açınca öğrencilerin sonuçları silinir mi?** Hayır; ödev aktifken görünmezler, yeniden sonuçlandırınca geri gelirler.
- **Tekrar açtım, öğrenciler haber aldı mı?** Hayır; gerekiyorsa mesajla haber ver.

## Sırada

- Tasarımdaki kontrol ekranı düzeni ([Sonuçlandırma](sonuclandirma.md)).
