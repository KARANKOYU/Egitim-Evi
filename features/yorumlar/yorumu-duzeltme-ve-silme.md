# Yorumlar · Yorumu değiştirme ve silme

**Durum:** Kodda var; tasarımda ek olarak silme pencerenin içinde ikinci bir dokunuşla onaylanır (Tasarım 1 önizlemesi)

Yazdığın yorumun yıldızını ya da metnini değiştirmek ve yorumu açılış sayfasından tamamen kaldırmak.

## Ne işe yarar

Fikrin değişebilir (ilk ay 3 yıldız verdin, şimdi 5 vermek istiyorsun) ya da yorumunun açılışta durmasını istemeyebilirsin. Her
hesabın tek yorumu olduğu için değiştirmek ayrı bir iş değildir: aynı formu yeniden göndermek eskisinin üstüne yazar. Silmek ise
yorumu hemen ve geri dönüşsüz kaldırır. Aydınlatma metninin sözü de budur: kişi yorumunu istediği zaman siler.

## Nereden açılır

- **Bugünkü site:** **"Ayarlar"** → **"Eğitim Evi hakkında yorumun"** kartı ([Yorum yazma](yorum-yazma.md#nereden-açılır)). Yorumun
  varsa kart önceki yıldızınla ve metninle dolu gelir; düğmeler **"Yorumu güncelle"** ve gri **"Yorumu sil"**.
- **Tasarımda** (Tasarım 1 önizlemesi): "Hesap ayarları" → "Gizlilik ve verilerim" → "Eğitim Evi hakkında yorumun" satırında
  **"Düzenle"**; açılan pencerede **"Yorumu sil"**, **"Vazgeç"**, **"Yorumu güncelle"**.

## Adım adım

### Değiştirmek

Veli, öğretmen ve müdür (yorumu olan herkes) için:

1. Ayarlar'da yorum kartını aç. Yıldızın seçili, metnin kutuda gelir; sayaç metnin uzunluğunu gösterir.
2. Yıldızı ya da metni değiştir.
3. **"Yorumu güncelle"**'ye bas (düğme "Gönderiliyor..." olur).
4. Yeşil ileti: "Yorumun açılış sayfasında görünüyor. Teşekkürler!". Yorum açılıştaki listenin en başına çıkar, altındaki tarih
   bugünün tarihi olur.
5. Bu sırada kısaltılmış adın ve etiketin de yeniden hesaplanır: adını değiştirdiysen ya da yeni bir rol aldıysan yorumun yeni hâliyle
   görünür ([Adın kısaltılması ve rol etiketi](ad-kisaltma-ve-etiket.md)).

Değiştirirken de yazarken geçen bütün kurallar geçerli: 3–500 karakter, internet adresi yok, uygunsuz kelime yok, saatte en çok 10
gönderim ([Yorum yazma](yorum-yazma.md#kurallar-ve-sınırlar)).

### Silmek

Veli, öğretmen ve müdür (yorumu olan herkes) için:

1. Ayarlar'daki yorum kartında gri **"Yorumu sil"**'e bas.
2. Tarayıcının onay kutusu sorar: "Yorumun silinsin mi?". Onayla (vazgeçersen hiçbir şey olmaz).
3. Kart boş forma döner: 5 yıldız seçili, kutu boş, düğme **"Yorumu gönder"**. Yorum açılıştan hemen kalkar; sayı ve ortalama
   yeniden hesaplanır.
4. Silme sırasında bir hata olursa tarayıcının uyarı penceresinde hata metni çıkar.

Bugünkü kodda bilinen eksik: yorumu ilk kez gönderdiğin oturumda kart tazelenmediği için **"Yorumu sil"** görünmez; Ayarlar'a yeniden
gir.

### Yorumu gizlenmiş kişi

1. Sistem yöneticisi yorumunu gizlediyse kartın üstünde turuncu bir uyarı kutusu çıkar: "Yorumun sistem yöneticisi tarafından gizlendi; açılışta
   görünmüyor."
2. Yorumu değiştirebilirsin; ama gizli kalır. Kaydedince ileti: "Yorumun güncellendi. Sistem yöneticisi gizlediği için açılışta
   görünmüyor."
3. Silebilirsin; yorum tamamen gider.
4. Bugünkü kodda: gizlenen yorumu silip yeniden yazarsan yeni yorum gizli BAŞLAMAZ, açılışta görünür; yönetici yeniden gizlemek
   zorunda kalır ([Yorumu gizleme](yorum-gizleme.md)). Bu bilinen bir açıktır.

### Çalışan ve eğitmen

Yorum yazabiliyorsan (bkz. [Yorum yazma](yorum-yazma.md#çalışan)) adımlar veliyle aynı.

### Yazma hakkını kaybeden kişi

Okuldan ayrıldın, rolün kaldırıldı ya da çocuğunla bağın çözüldü ve başka hiçbir rolün, çocuğun kalmadı diyelim:

- Yorumun **silinmez**, açılışta eski etiketiyle görünmeye devam eder.
- Bugünkü sitede Ayarlar'daki kart artık yalnız nedeni yazar ("Yorum yazmak için bir okulda öğretmen ya da müdür olman ya da
  çocuğunu eklemiş olman gerekiyor."); **"Yorumu sil" düğmesi de görünmez**. Yani yorumunu ekrandan kaldıramazsın; ancak hesabını
  silersen gider. Bu bugünkü kodda bilinen bir eksiktir (sunucunun silme ucu bu kişiye de çalışır, ekran düğmeyi göstermiyor).

### Yönetici

Başkasının yorumunu değiştiremez ve silemez; yalnız gizler ya da yeniden gösterir ([Yorumu gizleme](yorum-gizleme.md)).

### Tasarımda (Tasarım 1 önizlemesi)

1. Satırda **"Düzenle"** → pencere yıldızın ve metninle dolu açılır.
2. Değiştir → **"Yorumu güncelle"**. Pencere kapanır, bildirim: "Yorumun güncellendi; açılış sayfasında görünüyor.". Satır hemen
   yeni yıldızları ve metnin ilk 60 karakterini gösterir.
3. Silmek için **"Yorumu sil"**: ilk dokunuşta düğmenin yazısı **"Silinsin mi? Evet, sil"** olur ve kırmızıya döner (tarayıcının onay
   kutusu yok). İkinci dokunuşta yorum silinir, pencere kapanır, bildirim: "Yorumun silindi; açılış sayfasından kalktı.". Satır
   "henüz yazmadın" ve **"Yorum yaz"**'a döner.
4. **"Vazgeç"** pencereyi değişiklik yapmadan kapatır.

Önizlemede gizlenmiş yorum durumu çizilmedi; tasarımda da bugünkü turuncu uyarı ve ileti geçerlidir.

## Kurallar ve sınırlar

- **Tek yorum, tek kayıt:** değiştirmek yeni bir yorum açmaz; aynı kaydın yıldızı, metni, kısa adı, etiketi ve "son değişiklik"
  zamanı yenilenir. İlk yazılış zamanı saklanır ama ekranda görünmez.
- **Sıra:** açılıştaki liste son değişikliğe göre sıralıdır; yorumunu değiştiren listenin başına çıkar.
- **Hız sınırı:** değiştirme, yazma ile aynı sayaçtadır (hesap başına saatte 10 gönderim; geri çevrilenler de sayılır). Silme sınırsızdır.
- **Silme geri alınamaz:** çöp kutusu ya da "geri al" yoktur. Silinen yorum site yedeklerinde, yedeğin alındığı günkü hâliyle kalır
  ([Site yedekleri](../yonetim/yedekler.md)).
- **Yorumu yoksa silmek:** sunucu yine "Yorumun silindi." der (ekranda bu ileti gösterilmez, kart yeniden dolar).
- **Gizli yorum:** değiştirmek gizliliği açmaz; silip yeniden yazmak açar (bugünkü kod).
- **Hesap silinince** yorum da silinir ([Hesabımı sil](../ayarlar/hesabimi-sil.md); aydınlatma metninde "Açılış sayfası yorumu hesapla
  birlikte silinir.").
- **Bildirim yok:** değiştirme ve silme kimseye haber verilmez; işlem kaydına da yazılmaz.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Yorumlar](README.md)):

- [Yorum yazma](yorum-yazma.md) — kartın tamamı, kim yazar, hata iletileri.
- [Adın kısaltılması ve rol etiketi](ad-kisaltma-ve-etiket.md) — değiştirince yeniden hesaplanan kısa ad ve etiket.
- [Uygunsuz kelime ve internet adresi süzgeci](uygunsuz-kelime-suzgeci.md) — değiştirmede de geçerli.
- [Açılış sayfasındaki yorumlar bölümü](yorumlar-bolumu.md) — değişikliğin göründüğü yer.
- [Yorumu gizleme (yönetici)](yorum-gizleme.md) — gizli yorumun sahibi ne görür.

**İlgili:**

- [Hesabımı sil](../ayarlar/hesabimi-sil.md) — hesapla birlikte yorum da silinir.
- [Verilerimi indir](../ayarlar/verilerimi-indir.md) — tasarımda indirilen dosyada yorumun da var.
- [Bu okuldan ayrıl](../portallar/okuldan-ayrilma.md) ve [Çocuklarım](../portallar/cocuklarim.md) — rol ya da çocuk gidince etiket
  ve yazma hakkı.
- [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md) — yorumun ayrı bir saklama süresi yok, hesapla yaşar.

## Kod tarafı

- Sunucu: [sunucu/bolumler/yorum.md](../../sunucu/bolumler/yorum.md) — `POST /api/yorumlar` (varsa eskisinin kimliğiyle `yaz`; cevap
  gizli yorumda farklı ileti), `POST /api/yorumlar/sil` (ana hesabın yorumunu siler, yorum yoksa da başarı).
- Depo: [sunucu/veri/depo/yorumlar.md](../../sunucu/veri/depo/yorumlar.md) — `yaz` (`ON CONFLICT (hesap_id) DO UPDATE`: yıldız,
  metin, kısa ad, etiket, `guncelleme`; `gizli`'ye dokunmaz), `hesabinkiniSil`. Tablo `yorumlar`, `hesap_id` silinince `CASCADE`.
- Ön yüz: [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md) — `yorumKartiniDoldur` (gizli yorum
  uyarısı `.msg.uyari`, "Yorumu güncelle"/"Yorumu sil"), `EYLEMLER['yorum-kaydet']`, `EYLEMLER['yorum-sil']` (`confirm('Yorumun silinsin mi?')`,
  hata `hataGoster` ile uyarı penceresinde — [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md)). "Kart ilk
  gönderimden sonra tazelenmez" eksiği o kod belgesinin "Dikkat!" bölümünde de yazılı.
- Yedek: [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) — yorumlar yedeğe `gizli` işaretiyle girer.
- Testler: [testler/test-yorum-ek.md](../../testler/test-yorum-ek.md) — hesap başına tek yorum, kendi yorumunu silme
  (`sil` → açılışta sayı 0).

## Sık sorulanlar

- **Yorumumu değiştirince ikinci bir yorum mu oluşur?** Hayır; aynı yorum değişir ve listenin başına çıkar.
- **Sildiğim yorumu geri getirebilir miyim?** Hayır; yeniden yazman gerekir.
- **Okuldan ayrıldım, yorumum hâlâ "Öğretmen" diye görünüyor.** Etiket yorum kaydedildiği an saklanır. Hâlâ yazma hakkın varsa
  (ör. velisin) yorumunu yeniden kaydet, etiket düzelir. Hiç hakkın kalmadıysa bugünkü sitede yorumu ekrandan silemezsin (yukarıda).
- **Yorumumu yönetici gizledi, neden haber gelmedi?** Gizlemede bildirim gönderilmez; Ayarlar'daki turuncu uyarı tek işarettir.

## Sırada

- Yorum kartının gönderimden sonra tazelenmesi ve yazma hakkı kalmayan kişiye "Yorumu sil" düğmesinin gösterilmesi: planlı bir işte
  yok (bilinen eksik; Tasarım 1 önizlemesindeki pencere ilk eksiği gideriyor).
- Üst şerit sadeleştirme: Ayarlar profil menüsüne taşınacak; düzenleme "Hesap ayarları" → "Gizlilik ve verilerim" satırından açılacak.
- Kullanıcı arama ve Verilerimi indir: yorum kişinin indirdiği dosyaya girecek.
