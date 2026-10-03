# Ödevler · Teslim dosyalarının saklanması ve silinmesi

**Durum:** Kodda var; tasarımda ek olarak ödevin quizi son teslimden 1 yıl sonra silinecek, öğrenci ve velisi yalnız aktif ve bir önceki eğitim yılının ödevlerini görecek (saklama süreleri kararı).

Ödevle ilgili neyin ne kadar saklandığı: öğrencinin teslim dosyaları son teslimden 7 gün sonra, öğretmenin ekleri yüklemeden 7 gün sonra kendiliğinden silinir; ödevin kendisi ve sonuçları kalır.

## Ne işe yarar

Okulun diski dolmasın, öğrenci dosyaları gereğinden uzun tutulmasın (KVKK) diye. Kullanıcı 27 Eylül'de teslim dosyalarının
"ödev süresi geçtiğinde net en geç 1 hafta" sonra silinmesini istedi (önce yüklemeden 7 gün sonra siliniyordu; son teslimi 3
hafta sonra olan ödevde öğretmen bakmadan dosyalar gidiyordu). Öğretmen ve öğrenci her dosyanın ne zaman silineceğini önceden
görür.

## Nereden açılır

Ayrı bir ekranı yok; silinme bilgisi dosyaların yanında yazar:

- öğrencinin ve velinin "Teslim dosyaları" bölümünde her dosyanın satırında ([Teslim](teslim.md));
- öğretmenin "N ek" penceresinde her kutucukta ([Teslimleri inceleme](teslimleri-inceleme.md));
- ödevin "Ekler" listesinde ([Ödeve dosya ekleme](dosya-ekleme.md));
- "Yeni ödev" ve "Ödevi düzenle"deki dosya izni ipucunda ([Dosya yükleme izni](dosya-yukleme-izni.md)).

## Adım adım

### Öğrenci ve veli

1. Teslim dosyalarında her satırda **"9 gün sonra silinir"**, **"yarın silinir"**, **"bugün silinir"**; üzerine gelince silinme
   günü ve saati.
2. Yükleme alanının altında kural: **"Dosyalar son teslimden 7 gün sonra silinir."** (son tarihsiz ödevde: **"Dosyalar ödev
   sonuçlandırıldıktan 7 gün sonra silinir; sonuçlandırılmazsa yüklendikten 60 gün sonra."**).
3. Öğretmenin eklerinde **"1,2 MB · 5 gün sonra silinir"**; süresi dolunca satır soluk: **"süresi doldu, silindi"**.
4. Dosyalar silindikten sonra ödev, sonucu ve geçmişi yerinde kalır.

### Öğretmen

1. "N ek" penceresinde her teslimin altında silinme günü; altta ödevin silinme kuralı.
2. Son teslimi değiştirirsen (ya da kaldırırsan) ya da ödevi yeniden açarsan, teslim dosyaları **en az 7 gün daha** kalır;
   "Ödevi düzenle" ipucu bunu söyler: **"Son teslimi değiştirirsen yüklenmiş dosyalar en az 7 gün daha kalır."**
3. Eklediğin dosyalar (çalışma kâğıdı vb.) yüklemeden **7 gün** sonra silinir; ödev uzun sürüyorsa yeniden eklersin.
4. Önemli bir teslimi saklamak istiyorsan silinmeden önce indir (tek tek ya da "Teslimleri indir" zip'i).

### Müdür

Okulun dosya alanında teslim dosyaları ve ekler de sayılır; silinme yer açar ([Doluluk](../okul-disk/doluluk.md)). Silinme
kurallarını değiştiren bir ayar yok.

### Tasarımda (Tasarım 1 önizlemesi)

- Teslim dosyası satırında "9 gün sonra silinir" / "bugün silinir".
- Silinme günü geçince öğrencinin kutusunda **"2 dosya son teslimden 7 gün sonra silindi (8 Ekim)."**; öğretmenin kontrol
  ekranında "3 ek" yerine soluk **"3 ek · son teslimden 7 gün sonra silindi"**.

## Kurallar ve sınırlar

**Teslim dosyaları (öğrencinin yükledikleri):**

| Ödev | Silinme anı |
|---|---|
| Son teslimi var | son teslim anı + 7 gün |
| Son teslimi yok, sonuçlandırıldı | sonuçlandırma anı + 7 gün |
| Son teslimi yok, hiç sonuçlandırılmadı | dosyanın yüklendiği an + 60 gün |

- Silinme anı saklanmaz, her seferinde ödevden hesaplanır: son teslim ileri alınınca kendiliğinden ileri gider.
- **Koruma:** son teslim (gün ya da saat) değiştirilince, kaldırılınca ya da ödev yeniden açılınca dosyalar değişiklikten en az 7 gün
  daha kalır. Öğretmen son teslimi yanlışlıkla geçmişe yazsa (ör. yılı yanlış) dosyalar hemen silinmez, düzeltmeye zaman kalır.
- Zaten silinmiş dosya geri gelmez.
- Temizlik **saatte bir** çalışır (sunucu açıldıktan 1 dakika sonra ilk kez): silinme anı gelen dosyaların kaydını ve dosyasını
  siler; yarıda kalmış yüklemeleri 2 saat, kaydı silinmiş dosyaları 1 saat sonra diskten kaldırır.
- Hesap sunucunun yerel saatiyle yapılır; sunucu Türkiye saatinde çalışmalı.

**Öğretmenin ekleri:** yüklemeden 7 gün sonra dosya silinir (ödev sürse de); ödevde "süresi doldu, silindi" izi kalır.
Gönderilmemiş (ödeve bağlanmamış) taslak ekler 6 saat sonra silinir.

**Ödevin kendisi ve sonuçları:** kendiliğinden silinmez. Yalnız öğretmen "Sil" derse (sahipsiz ödevde müdür) gider; o zaman
öğrencilere verilişi, sonuçları, açılma ve yıldız kayıtları, quizi, ekleri ve teslim dosyalarının kayıtları birlikte silinir
([Ödevi düzenleme ve silme](odevi-duzenleme-ve-silme.md)). Okul yönetimi ödev geçmişini yıllar sonra da görür.

**Yedek:** ödevler, sonuçlar ve teslim dosyalarının kayıtları sistem yedeğine girer; dosyaların kendisi JSON yedeğe girmez,
sunucudaki dosya klasörü ayrıca yedeklenmelidir ([Yedekler](../yonetim/yedekler.md)).

**Tasarımda (saklama süreleri kararı, kullanıcı 27 Eylül):**

- Ödevin **quizi** (soruları, şıkları, denemeleri, cevapları) ödevin son tesliminden (son tarihsiz ödevde verilişinden) **1 yıl**
  sonra silinir; ödevin kendisi ve öğretmenin girdiği sonuç kalır, ödevde "Quiz 1 yıl sonra silindi" gibi kısa bir iz görünür.
- Öğrenci ve velisi yıl seçicide yalnız **aktif yılı ve bir önceki yılı** görür; daha eskisini isteyince açık bir hata: "Eski
  yıllar yalnız okul yönetimine açık". Öğretmen ve müdür bütün yılları görür. Öğrencinin ödev kayıtları otomatik silinmez.
- Bildirimler (ödev bildirimleri dahil) 90 gün sonra silinir.
- Yıl geçişindeki okul yedeği yalnız veri taşır (ödevler ve sonuçları, quizler); dosyalar girmez ([Okul yedeği](../egitim-yili/okul-yedegi.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Teslim](teslim.md) · [Teslimleri inceleme ve indirme](teslimleri-inceleme.md) · [Ödeve dosya ekleme](dosya-ekleme.md) ·
[Dosya yükleme izni](dosya-yukleme-izni.md) · [Ödevi düzenleme ve silme](odevi-duzenleme-ve-silme.md) ·
[Sonuçları düzeltme ve tekrar açma](sonuclari-duzeltme.md) · [Başlama ve son teslim](tarih-ve-saat.md).

**İlgili:** [Saklama süreleri (KVKK)](../kvkk-ve-gizlilik/saklama-sureleri.md), [Okul disk sınırı](../okul-disk/disk-siniri.md),
[Doluluk](../okul-disk/doluluk.md), [Yedekler](../yonetim/yedekler.md), [Okul yedeği](../egitim-yili/okul-yedegi.md),
[Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md), [Quiz sonuçları](../quiz/sonuclar.md).

## Kod tarafı

- Silinme anı: [sunucu/veri/depo/odev-dosyalari.md](../../sunucu/veri/depo/odev-dosyalari.md) — `SILINME` (üç kural +
  `dosya_saklama`), `eskileriSil`; [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) — `duzelt` ve `yenidenAc`
  (`dosya_saklama` = en az şimdi + 7 gün, şema 034), `sil` (zincirleme silme).
- Temizlik ve metin: [sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md) — `dosyaSupur` (saatlik),
  `saklamaYazisi`; zamanlayıcı [sunucu/index.md](../../sunucu/index.md).
- Ekler: [sunucu/bolumler/ekler.md](../../sunucu/bolumler/ekler.md) (7 gün, taslak 6 saat), [sunucu/veri/depo/ekler.md](../../sunucu/veri/depo/ekler.md).
- Ön yüz: [public/js/parcalar/04d-ekler.md](../../public/js/parcalar/04d-ekler.md) (`silinmeYazisi`: "bugün / yarın / N gün
  sonra silinir"), [14b-odev-teslim.md](../../public/js/parcalar/14b-odev-teslim.md), [11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md)
  (`dosyaYuklemeKutusu` ipucu).
- Şema: [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (033 dosya izni ve silinme kuralı, 034 `dosya_saklama`).
- Testler: [testler/test-odev-dosya.md](../../testler/test-odev-dosya.md) (silinme anı: son teslim ileri alınınca, son teslimsiz
  ödev, geçmişe yazılan tarih), [testler/test-yedek.md](../../testler/test-yedek.md) (teslim dosyasının yalnız kaydı).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Ödev teslim dosyaları" tablosu, "Ekler").

## Sık sorulanlar

- **Öğrencimin dosyası silindi, geri getirebilir miyim?** Hayır; silinme zamanı geldiyse dosya kalıcı olarak gider. Öğrenciden
  yeniden isteyebilirsin (teslim açıksa) ya da ödevi düzenleyip son teslimi ileri alarak teslimi yeniden açarsın.
- **Ödevin son teslimini uzattım, dosyalar ne olur?** Silinme anları da uzar; ayrıca en az 7 gün daha kalırlar.
- **Ödev sonuçları ne zaman silinir?** Kendiliğinden hiç; ödev silinirse silinir.

## Sırada

- Optimizasyon + saklama süreleri (iş 7): quiz 1 yıl, bildirim 90 gün, öğrenci/veli yalnız son 1 geçmiş yıl.
- Sunucuda küçültme ve aynı dosyanın tek kopya tutulması (iş 1): saklanan dosyalar küçülecek.
- Yıl geçişi (iş 9): okul yedeği (yalnız veri).
