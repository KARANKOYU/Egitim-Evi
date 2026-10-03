# İşlem kaydı · Türe göre süzme ve arama

**Durum:** Kodda var

İşlem kaydında yalnız bir türün satırlarını göstermeye yarayan "Hepsi" ve tür düğmeleri ile tabloyu kişiye, işe ya da ayrıntıya
göre süzen "İçerik Ara" kutusu.

## Ne işe yarar

Kayıtta yüzlerce satır olabilir. Tür düğmesi sunucudan yalnız o türün satırlarını ister (ör. yalnız "Kullanıcıya rol atandı");
"İçerik Ara" ise ekrandaki satırları yazdığın sözcüğe göre anında süzer (ör. bir öğrencinin adı ya da "7-A"). İkisi birlikte
kullanılabilir: önce türü seç, sonra ara.

## Nereden açılır

[İşlem kaydı sayfası](islem-kaydi-sayfasi.md)'nın en üstündeki kart: solda **"Hepsi"**, yanında kayıtta geçen her türün adıyla
birer küçük düğme. Arama için üst şeritteki **"İçerik Ara"** kutusu (her sayfada aynı kutu —
[Sayfa içi arama](../menu-ve-arama/sayfa-ici-arama.md)).

## Adım adım

### Tür düğmeleri nasıl dizilir

- İlk düğme her zaman **"Hepsi"**.
- Sonra yalnız kayıtta **gerçekten geçen** türler gelir; hiç olmamış bir türün düğmesi yok. Okulda henüz kimse rol vermediyse
  "Kullanıcıya rol atandı" düğmesi çıkmaz.
- Sıra: türün **en son yazıldığı ana göre**, en yeni önce. Az önce bir rol verildiyse "Kullanıcıya rol atandı" en başa geçer.
- Düğmenin yazısı türün Türkçe adıdır ([Neler kaydedilir](neler-kaydedilir.md)); adı bilinmeyen tür anahtarıyla görünür.
- Düğmeler, seçtiğin türden bağımsız olarak hep **bütün** türleri gösterir; bir tür seçince öbür düğmeler kaybolmaz.
- Seçili düğme vurgulu durur. Kayıtta hiç satır yoksa düğme kartı hiç çıkmaz.
- Çok tür varsa düğmeler alt satırlara sarılır.

### Müdür

1. "İşlem Kaydı"nı aç. İlk açılışta **"Hepsi"** seçilidir.
2. Bir türün düğmesine bas (ör. **"Okul sayfasına fotoğraf yüklendi"**). Sayfa yeniden yüklenir; tabloda yalnız o türün satırları
   kalır ve kartın başlığı o türe göre yazar: "Son 4 kayıt" ya da "Son 300 kayıt (toplam 512)".
3. Hepsine dönmek için **"Hepsi"**.
4. Aramak için üst şeritteki **"İçerik Ara"** kutusuna yaz (ör. "deniz"). Tablo her harfte süzülür; tutmayan satırlar gizlenir.
5. Hiçbir satır tutmazsa sayfanın en altında **"ogretmen" için sonuç bulunamadı.** gibi bir kutu çıkar. Tırnağın içinde yazdığın
   sözcük sadeleştirilmiş hâliyle durur: küçük harf, Türkçe harfler düz ("Öğretmen" yazdıysan "ogretmen").
6. Kutuyu boşaltınca bütün satırlar geri gelir.

Seçtiğin tür, sayfadan çıkıp dönünce de seçili kalır; tarayıcı sekmesini yenileyince ya da kapatınca "Hepsi"ye döner.

### Öğretmen

"İşlem kaydını görür" yetkin varsa ([nasıl verilir](gorme-yetkisi.md)) adımlar müdürünkiyle aynı; düğmeler kendi okulunun
kaydında geçen türlerdir.

### Çalışan

Bugün kodda öğretmen hesabıyla ek rol taşıyan kişi öğretmenle aynı adımları izler. Tasarımda görev yetkisi olan çalışan da aynı.

### Yönetici

Adımlar aynı; düğmelerde bütün okulların ve okulsuz satırların türleri birlikte durur (ör. "Site aralık ayarı değişti",
"Okul yönetici tarafından açıldı"). Bir türü seçince bütün okullardaki o türün satırları gelir.

## Kurallar ve sınırlar

- **Tür süzmesi sunucuda yapılır:** seçilen türün en yeni 300 satırı gelir. Böylece "Hepsi"de 300'ün dışında kalan eski bir
  satır, türü seçilince görünebilir.
- **Başlıktaki toplam** süzgece uyan bütün satırların sayısıdır; gösterilenden fazlaysa parantezle yazar.
- **Arama yalnız ekrandaki satırlarda** çalışır (en çok 300); sunucuya gitmez, daha eski satırları getirmez.
- **Aranan alanlar:** Kişi (ad), İşlem (Türkçe adı) ve Ayrıntı. Tarih, rol ("Müdür" gibi alt yazı) ve IP aranmaz.
- **Harf farkı yok:** büyük/küçük harf ve Türkçe harf farkı gözetilmez ("ogretmen", "OGRETMEN", "öğretmen" aynı sonucu verir; â, î,
  û de düzleşir).
- **Tür düğmesine basınca arama kutusu boşalır** (sayfa yeniden yüklenir). Önce türü seç, sonra ara.
- **Yenile düğmesi** ("Sayfayı yenile") seçili türü ve kutudaki aramayı korur; yeni satırlar da aramaya göre süzülerek gelir.
- **Tek tür seçilir:** iki türü birlikte süzmek, tarih aralığı ya da kişiye göre süzme düğmesi yok.
- **Çıkışta ve portal değişince seçim temizlenmez:** aynı tarayıcı sekmesinde çıkış yapıp başka biri girerse ya da başka bir
  okulun portalına geçersen son seçilen tür orada da seçili açılır. O tür o kayıtta yoksa hiçbir düğme vurgulu görünmez ve tablo
  "Henüz kayıt yok. Önemli işlemler yapıldıkça burada birikir." der; **"Hepsi"**ye basınca düzelir.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [İşlem kaydı](README.md)):

- [İşlem kaydı sayfası](islem-kaydi-sayfasi.md) — düğmelerin ve tablonun durduğu sayfa.
- [Neler kaydedilir](neler-kaydedilir.md) — düğmelerdeki her türün anlamı ve ayrıntısı.
- ["İşlem kaydını görür" yetkisi](gorme-yetkisi.md) — kimin hangi türleri gördüğü.
- [Saklama ve sınırlar](saklama-ve-sinirlar.md) — 300 ve 5000 satır sınırları.

**İlgili:**

- [Sayfa içi arama (İçerik Ara)](../menu-ve-arama/sayfa-ici-arama.md) — aynı kutunun öbür sayfalardaki davranışı.
- [Üst şerit](../menu-ve-arama/ust-serit.md) — arama kutusu ve yenile düğmesinin yeri.
- [Ödevlerde süzgeçler](../odev/suzgecler.md) — açılır listeli süzgeç düzeni (işlem kaydında yok).

## Kod tarafı

- Düğmeler ve tablo: [public/js/parcalar/15-aktarim.md](../../public/js/parcalar/15-aktarim.md) — `S.islemSuz` (`''` = hepsi),
  `data-act="islem-suz" data-islem="<anahtar>"`, seçili düğmede `secili`; satırda `data-ara` = kişi + işlem adı + ayrıntı.
- Tıklama: [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) — `islem-suz`: `S.islemSuz` yazılır,
  `git('islem-kaydi')`.
- Arama: [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md) — `araUygula`
  (`#sayfa [data-ara]`, boşsa "… için sonuç bulunamadı."), [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md)
  (`nrm`, `TR_SADE`), [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md) (`git` arama kutusunu
  boşaltır, `yaz` aramayı yeniden uygular).
- Çıkış: [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md) — `oturumDurumunuSifirla` `S.islemSuz`'a dokunmaz.
- Sunucu: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) (`?islem=` en çok 40 harf; `turler` süzgeçsiz
  hesaplanır), [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`islemKayitlari`: `GROUP BY islem ORDER BY max(tarih)
  DESC`).
- Testler: [testler/test-rol.md](../../testler/test-rol.md) (`?islem=okul.konum`), [testler/test-okul-disk.md](../../testler/test-okul-disk.md)
  (`?islem=okul.disk-siniri`), [testler/test-site-ayarlari.md](../../testler/test-site-ayarlari.md) (`?islem=site.aralik`,
  `?islem=okul.adres-yonetici`).

## Sık sorulanlar

- **Aradığım öğrenci çıkmıyor ama kayıtta olmalı.** Arama yalnız ekrandaki en yeni 300 satırda çalışır. İlgili türü seç (ör.
  "Hesap açıldı"), sonra yeniden ara.
- **Tarihe göre arayabilir miyim?** Hayır; tarih sütunu aranmaz ve tarih aralığı süzgeci yok.
- **Tür düğmesine basınca yazdığım arama silindi.** Normal: tür değişince sayfa yeniden yüklenir. Önce türü seç, sonra yaz.
- **Liste boş ve hiçbir düğme seçili değil.** Aynı sekmede önceki kişinin seçtiği tür kalmış olabilir; "Hepsi"ye bas.

## Sırada

- Optimizasyon + saklama süreleri: kayıt büyüyünce 300 sınırı ve sayfalama yeniden düşünülecek.
- Çok dil: düğme adları (işlem türleri) çeviri kataloğuna girecek.
