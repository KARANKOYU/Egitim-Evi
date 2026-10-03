# Yemek listesi · Hafta gezgini

**Durum:** Kodda var

Yemek listesinin üstündeki "Önceki hafta" / "Sonraki hafta" şeridi: bir dokunuşla bir hafta geri ya da ileri gidersin.

## Ne işe yarar

Menü haftalık gösterilir; geçen haftanın ya da gelecek haftanın menüsüne bakmak için bu şerit var. Öğrenci ve veli "gelecek hafta
ne çıkacak" diye bakar; müdür (ya da yetkili kişi) gelecek haftanın menüsünü önceden girmek için önce o haftaya geçer, sonra
[Bu haftayı düzenle](menuyu-duzenleme.md)'ye basar.

## Nereden açılır

[Yemek listesi](yemek-listesi.md) sayfasının en üstünde, başlığın hemen altındaki kart:

- solda **"Önceki hafta"** (geri ok simgeli),
- ortada kalın yazıyla gösterilen haftanın aralığı: "28 Eylül – 4 Ekim" (pazartesi – pazar),
- sağda **"Sonraki hafta"**.

Telefonda (520 pikselden dar ekranda) düğmeler **"Önceki"** ve **"Sonraki"** diye kısalır.

## Adım adım

### Öğrenci, veli, öğretmen ve çalışan

Bu dört rol şeridi aynı kullanır (çalışan: bugün kodda ek rollü öğretmen; tasarımda görev verilmiş çalışan — rolsüz çalışan
yemek listesini hiç görmez).

1. **"Sonraki hafta"**ya dokun. Ortadaki aralık bir hafta ileri kayar (ör. "5 Ekim – 11 Ekim"), kartlar o haftanınkiyle
   yeniden çizilir.
2. **"Önceki hafta"** bir hafta geri götürür. Kaç hafta geri ya da ileri gidebileceğinin sınırı yok; menü girilmemiş haftada
   hafta içi kartlarında "Menü girilmedi" yazar.
3. Bu haftaya dönmek için ayrı bir düğme yok: tarayıcının kendi yenileme tuşuyla sayfayı baştan yükle (aşağıda "Kurallar").
4. Velide çocukları iki ayrı okuldaysa şerit iki okulun kartlarını birlikte kaydırır.

### Müdür

1. Gelecek haftayı girmek için **"Sonraki hafta"**ya bas; aralığın doğru hafta olduğuna bak.
2. **"Bu haftayı düzenle"**: pencerenin başlığı o haftanın aralığını taşır ("5 Ekim – 11 Ekim menüsü") ve şeritte hangi hafta
   açıksa onu düzenlersin ([Bu haftayı düzenle](menuyu-duzenleme.md)).
3. Kaydedince sayfa aynı haftada kalır.

"Yemek listesini düzenler" yetkisi olan öğretmen ve çalışan da aynı adımları izler.

Tasarımda (Tasarım 1 önizlemesi): yemek sayfasında hafta gezgini yok; yalnız "Bu hafta" grubu gösteriliyor. Kullanıcı bu ekran
için bir şey söylemedi; 2 Ekim'de onayladığı karara göre üzerine yorum yapmadığı ekranlar bugünkü siteye benzer, bu yüzden
bugünkü gezgin kalır.

## Kurallar ve sınırlar

- **Hafta pazartesi başlar:** sunucu istenen günü o haftanın pazartesisine yuvarlar, şerit pazartesi – pazar aralığını yazar.
  Bozuk bir tarih istenirse bu hafta açılır.
- **Seçtiğin hafta akılda kalır:** başka bir sayfaya gidip "Yemek Listesi"ne dönünce aynı hafta açılır. Üst şeritteki "Yenile"
  düğmesi ("Sayfayı yenile") de aynı haftayı yeniden yükler. Bu haftaya ancak tarayıcının sayfayı baştan yüklemesiyle dönülür.
- **Bilinen açık (kod bugün böyle):** seçilen hafta çıkışta bile sıfırlanmıyor. Aynı sekmede çıkış yapıp başka biri girerse o da
  yemek listesini öncekinin bıraktığı haftada görür (menüyü değil, yalnız haftayı; menü yine kendi okulunun menüsüdür).
- **Hafta adreste yazmaz:** adres hep `#/yemek` kalır; adresi birine gönderirsen o kişi kendi bu haftasını görür.
- **Düzenlemenin tarih sınırı:** bakmanın sınırı yok ama düzenleme yalnız bugünden 60 gün öncesi ile 400 gün sonrası arasındaki
  haftalarda kaydedilir ([Bu haftayı düzenle](menuyu-duzenleme.md)).
- **Gece yarısı:** sunucunun "bu hafta"sı UTC gününe göredir; Türkiye saatiyle 00:00–03:00 arasında (pazartesiye geçen gece)
  ilk açılış bir önceki haftayı gösterebilir. "Sonraki hafta" ile geçersin.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Yemek listesi](README.md)):

- [Haftanın yemek listesi](yemek-listesi.md) — şeridin durduğu sayfa.
- [Bu haftayı düzenle](menuyu-duzenleme.md) — şeritte açık haftayı düzenler.
- [Kalori](kalori.md), [Çocukların okullarının menüsü](cocuklarin-okullari.md),
  ["Yemek listesini düzenler" yetkisi](duzenleme-yetkisi.md).

**İlgili:**

- [Üst şerit](../menu-ve-arama/ust-serit.md) — "Yenile" düğmesi.
- [Çıkış yap](../giris-hesap/cikis-yap.md) — çıkışta sıfırlanmayan ekran durumu.
- [Ay görünümü](../takvim/ay-gorunumu.md) — takvimdeki ay ay gezinmeyle karşılaştır.

## Kod tarafı

- Ön yüz: [public/js/parcalar/19c-okul-hayati.md](../../public/js/parcalar/19c-okul-hayati.md) — `EYLEMLER['yemek-hafta']`
  (düğmenin `data-bas`'ını `S.yemekBas`'a yazar, sayfayı yeniden çizer), `gunEkleYerel` (± 7 gün), `gunKisa` ("28 Eylül").
  `S.yemekBas` çıkışta sıfırlanmaz ([public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md)
  `oturumDurumunuSifirla`).
- Sunucu: [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) — `GET /api/yemek?bas=`, `haftaBasi` (pazartesiye
  yuvarlar; boş ya da bozuksa bu hafta, UTC günüyle), `bit` = `bas` + 6 gün.
- Görünüm: `public/css/parcalar/26-anket-okul-hayati.css` — `.hafta-gezgin` (üç sütun), dar ekranda `.genis` gizlenir.
- Test: [testler/test-okul-hayati.md](../../testler/test-okul-hayati.md) — salı istenince `bas` yine pazartesi.

## Sık sorulanlar

- **Bu haftaya nasıl dönerim?** Tarayıcının yenileme tuşuyla sayfayı baştan yükle; üst şeritteki "Yenile" düğmesi aynı haftada
  kalır.
- **Gelecek ayın menüsü görünür mü?** Müdür girdiyse evet; "Sonraki hafta" ile o haftaya git.
- **Geçen yılın menüsüne bakabilir miyim?** Silinmediyse evet, "Önceki hafta" ile geri gidersin; menü eğitim yılına bağlı değil.

## Sırada

- Çok dil: "Önceki hafta", "Sonraki hafta" ve ay adları çeviri kataloğuna girecek.
- Planlı başka değişiklik yok; sıfırlanmayan hafta bilinen açık olarak kod belgesinde kayıtlı.
