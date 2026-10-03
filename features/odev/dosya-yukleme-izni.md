# Ödevler · "Öğrenciler bu ödeve dosya yükleyebilsin"

**Durum:** Kodda var.

Öğretmenin her ödevde ayrı ayrı açıp kapattığı, öğrencinin o ödeve teslim dosyası yükleyip yükleyemeyeceğini belirleyen onay kutusu; yeni ödevde kapalı gelir.

## Ne işe yarar

Kullanıcı 27 Eylül'de istedi: "hoca ödevi girerken öğrenciler bu ödeve dosya koyabilsin checkbox'u olsun, default kapalı".
Her ödev dosya istemez (defter ödevi, quiz ödevi); kutu kapalıyken öğrenci o ödeve hiç dosya yükleyemez, okulun diski de
boşuna dolmaz. Kutu açılınca öğrenci ödevin penceresinden dosya teslim eder ([Teslim](teslim.md)). Quiz bu kutudan
bağımsızdır: dosya izni kapalı bir ödevde de quiz çözülür.

## Nereden açılır

- **"Yeni ödev"** penceresinde, ekler alanının altında **"Öğrenciler bu ödeve dosya yükleyebilsin"** (kapalı gelir).
- **"Ödevi düzenle"** penceresinde aynı kutu, ödevin o anki durumuyla gelir.
- Öğretmenin kontrol ekranında ödevin bilgi satırının sonunda durumu yazar: **"öğrenciler dosya yükleyebilir"** ya da
  **"dosya yükleme kapalı"**.

## Adım adım

### Öğretmen

1. Ödevi verirken teslim dosyası istiyorsan **"Öğrenciler bu ödeve dosya yükleyebilsin"** kutusunu işaretle. Kutunun altındaki
   ipucu: **"Her öğrenci en fazla 10 dosya, toplam 50 MB yükler. Dosyalar son teslimden 7 gün sonra silinir."**
2. Sonradan açmak ya da kapatmak için kontrol ekranında **"Ödevi düzenle"** → kutuyu değiştir → **"Kaydet"**. Düzenleme
   penceresinde ipucuna şu da eklenir: **"Kapatırsan yüklenmiş dosyalar silinmez; yalnız yeni yükleme durur. Son teslimi
   değiştirirsen yüklenmiş dosyalar en az 7 gün daha kalır."**
3. Süren (sonuçlanmamış, süresi geçmemiş) bir ödevde izni sonradan açarsan öğrencilere **"Ödev güncellendi: Oran orantı.
   Artık ödeve dosya yükleyebilirsin."** bildirimi gider (velilerine de).
4. İzni kapattığında teslim **donar**: öğrenci ne yeni dosya yükler ne yüklediğini siler; sen dosyaları görmeye, indirmeye ve
   uygunsuz olanı silmeye devam edersin (değerlendirirken dosya kaybolmasın diye).

Tasarımda (Tasarım 1 önizlemesi) kutu aynı adla, ipucu "her öğrenci en çok 10 dosya, toplam 50 MB · son teslimden 7 gün
sonra silinir"; kontrol ekranının bilgi satırında yine "öğrenciler dosya yükleyebilir" / "dosya yükleme kapalı" yazar.

### Öğrenci

- İzin kapalıysa ödevin penceresinin altındaki "Teslim dosyaları" bölümünde yalnız **"Bu ödev için dosya yüklenmiyor."**
  yazar; yükleme alanı hiç çıkmaz. Daha önce (izin açıkken) yüklediğin dosyalar varsa listede durur, "Sil" düğmesi olmaz.
- İzin açıksa yükleme alanı çıkar ([Teslim](teslim.md)).
- Tasarımda kapalı izin kilit simgeli bir satırla gösterilir: "Bu ödev için dosya yüklenmiyor."

### Veli

Velinin baktığı teslim bölümünde de izin kapalıysa **"Bu ödev için dosya yüklenmiyor."** yazar; veli hiçbir durumda dosya
yüklemez.

## Kurallar ve sınırlar

- **Varsayılan kapalı.** Yeni ödevde izin yalnız kutu işaretliyse açılır. Bu ayar gelmeden önce verilmiş ödevlerde izin
  açık bırakıldı (canlıdaki ödevler eskisi gibi çalışsın diye).
- **Kim değiştirir:** ödevi veren öğretmen "Ödevi düzenle" ile ("Ödev verir" yetkisi o ders için gerekir: **"Bu ödevi
  düzeltme yetkin yok"**); öğretmeni okuldan ayrılmış ödevde okulun müdürü.
- **İzin kapalıyken yükleme denenirse** sunucu **"Bu ödev için dosya yüklenmiyor."** der. Yükleme sürerken öğretmen izni
  kapatırsa dosya kaydedilmez: **"Öğretmen bu ödevde dosya yüklemeyi kapattı; dosya kaydedilmedi."** Öğrenci izin kapalıyken
  dosyasını silmeye çalışırsa: **"Öğretmen bu ödevde dosya yüklemeyi kapattı; dosyan artık silinemez."**
- **İzin dosya kurallarını değiştirmez.** Açık izinde de yükleme yalnız başlama gününden son teslime kadar, ödev sonuçlanmamışken
  olur ([Teslim](teslim.md)); izin, sınırlar ve silinme ([Saklama ve silinme](saklama-ve-silinme.md)) ayrı ayrı uygulanır.
- **Bildirim** yalnız süren ödevde izin kapalıdan açığa geçince gider; kapatınca bildirim gitmez.

## Kardeşler ve ilgili

**Kardeşler:** [Teslim](teslim.md) · [Teslimleri inceleme ve indirme](teslimleri-inceleme.md) ·
[Ödev verme](odev-verme.md) · [Ödevi düzenleme ve silme](odevi-duzenleme-ve-silme.md) ·
[Saklama ve silinme](saklama-ve-silinme.md).

**İlgili:** [Okul disk sınırı](../okul-disk/disk-siniri.md), [Quiz ekleme](../quiz/quiz-ekleme.md) (quiz izinden bağımsız),
[Otomatik bildirimler](../bildirim/otomatik-bildirimler.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) — `dosyaYuklemeKutusu(id,
  acik, duzenleme)` (kutu ve ipuçları), `odevAc` (bilgi satırı), `odev-duzelt-kaydet` (`dosyaYukleme`);
  [25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`odev-kaydet`: `dosyaYukleme`);
  [14b-odev-teslim.md](../../public/js/parcalar/14b-odev-teslim.md) (`teslimCiz`: "Bu ödev için dosya yüklenmiyor.").
- Sunucu: [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md) — yeni ödevde `dosyaYukleme: body.dosyaYukleme === true`,
  düzeltmede boolean gelmezse değişmez, "Artık ödeve dosya yükleyebilirsin." bildirimi;
  [sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md) — `DOSYA_KAPALI`, 403 `{ dosyaKapali: true }`, bitişte
  iznin yeniden okunması, silmede donma.
- Depo ve şema: [sunucu/veri/depo/odevler.md](../../sunucu/veri/depo/odevler.md) (`dosya_yukleme` sütunu),
  [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) (şema 033: sütun ve eski ödevlerde açık bırakan göç).
- Testler: [testler/test-odev-dosya.md](../../testler/test-odev-dosya.md) (iznin varsayılan kapalı olması, açma/kapama,
  bildirim).

## Sık sorulanlar

- **Öğrencim "Bu ödev için dosya yüklenmiyor." görüyor.** Ödevi verirken kutuyu işaretlemedin; "Ödevi düzenle"den aç.
- **İzni kapattım, öğrencinin dosyaları ne oldu?** Silinmez; sen görmeye devam edersin, öğrenci artık değiştiremez.
- **Quizli ödevde de izni açmam gerekir mi?** Hayır; quiz izinden bağımsız çalışır.

## Sırada

- Ödev teslim metni: öğrencinin dosya yerine (ya da yanında) yazı da teslim edebileceği alan tasarlandı ([Teslim metni](teslim-metni.md)).
