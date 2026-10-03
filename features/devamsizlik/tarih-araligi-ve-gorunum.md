# Devamsızlık ve yoklama · Tarih aralığı, gün gün / ders ders, süzgeç

**Durum:** Tasarlandı — henüz kodda yok.

Devamsızlık ekranlarının ortak üst kısmı: başlangıç–bitiş tarihi ve hazır aralıklar, "Gün gün | Ders ders" görünümü, sayılı süzgeç çipleri,
özet satırı ve açılır gün satırlarıyla tablo.

## Ne işe yarar

Kullanıcının 2 Ekim sözü: yoklama için **belli tarih aralarındakine bakma**, **"geldi, geç geldi vb." diye bakma, filtre**; **gün olarak**
(ilk ders ve son derse bakılarak) ve **ders ders** görme; "tarih aralığı ve filtre var"; filtrelerde **yarım gün** de olacak. Aynı akşam
önizlemede öğrencinin sayfasında "gün ders diye seçme" ve "aralık"ı aradı. Böylece öğrenci "bu ay kaç gün gelmedim?", veli "bu hafta
geç kaldı mı?", müdür "7-A'da bu dönem yarım gün kimler?" sorularını tek ekranda cevaplar.

Bugünkü sitede bu ekran yok: öğrenci ve veli tarihsiz bir liste (yılın bütün kayıtları), müdür tek günün derslerini görür
([Devamsızlığım](devamsizligim.md), [Okulun devamsızlığı](okulun-devamsizligi.md)).

## Nereden açılır

Tasarımda (Tasarım 1 önizlemesi) aynı ekran dört yerde:

- **Öğrenci:** **"Devamsızlığım"** — alt yazı **"Tarih aralığı, gün gün ya da ders ders"**.
- **Veli** (her çocuk ayrı oturum): **"Devamsızlık"** — alt yazı **"Elif · 7-A · tarih aralığı, gün gün ya da ders ders"**.
- **Müdür:** **"Devamsızlık"** — alt yazı **"Tarih aralığı, gün gün ya da ders ders"**; ayrıca **"Sınıflar"** → sınıf → **"Devamsızlık"**
  sekmesi.
- **Öğretmen:** **"Sınıflarım"** → sınıf → **"Devamsızlık"** sekmesi (sınıf sayfasının alt yazısı **"Öğrenciler, program, dersler ve
  devamsızlık"**).
- Tanımda ekran ayrıca **rehber** içindir ("öğretmen, müdür, rehber; öğrenci ve veli kendi kaydını").

## Adım adım

### Herkes (ortak üst kısım)

1. **Tarih aralığı:** **"Başlangıç"** ve **"Bitiş"** tarih kutuları (arada **"–"**). Seçilebilen günler dönem başından bugüne kadardır.
   Başlangıcı bitişten sonraya koyarsan ikisi yer değiştirir (uyarı çıkmaz).
2. **Hazır aralıklar** (çip; seçili olan koyu): **"Bugün"**, **"Bu hafta"** (haftanın pazartesisinden bugüne), **"Bu ay"** (ayın 1'inden
   bugüne), **"Bu dönem"** (dönem başından bugüne). İlk açılışta **"Bu dönem"**.
3. **Görünüm:** **"Gün gün"** | **"Ders ders"** (ilk açılışta "Gün gün"). Görünüm değişince süzgeç sıfırlanır.
4. **Süzgeç** çipleri, her birinin yanında o aralıktaki sayısı kalın:
   - Gün gün: **"Geldi"**, **"Geç geldi"**, **"Yarım gün"**, **"Gelmedi"**, **"İzinli"**;
   - Ders ders: **"Geldi"**, **"Geç"**, **"Gelmedi"**, **"İzinli"**.
   Birden çok çip seçilebilir: seçtiklerinden **herhangi birine** uyan satırlar görünür. Bir çip seçiliyken sona **"Süzgeci temizle"**
   gelir.
5. **Özet satırı** (yalnız gün gün): **"Bu aralıkta 1,5 gün özürsüz devamsızlık, 1 gün izinli · yarım gün 0,5 sayılır."**; bütün
   sınıfa bakarken başında öğrenci sayısı: **"Bu aralıkta 28 öğrencide 6,5 gün özürsüz devamsızlık, 3 gün izinli · …"**. İzinli gün
   yoksa o kısım yazılmaz.
6. **Tablo**, gün gün: **[Öğrenci]**, **Tarih** ("15 Eylül Pazartesi"), **Günün durumu** (renkli etiket: Geldi yeşil, Geç geldi ve Yarım
   gün turuncu, Gelmedi kırmızı, İzinli mavi), **Ayrıntı** ("1. derse 10 dakika geç", "bütün gün · özürsüz", "1.–2. derslere gelmedi,
   3. dersten itibaren var", "4. dersten sonra gitti, 5.–6. derslerde yok", "4. derste yok (ilk ve son derste var, gün tam sayılır)",
   "bütün derslerde var") ve sağda açma oku.
7. **Gün satırına bas:** altında o günün ders ders dökümü açılır; her ders bir kutu: **"1. ders"**,
   **"Matematik · 08:30–09:10"** ve durumu (**"Geldi"**, **"Geç · 10 dk"**, **"Gelmedi"**, **"İzinli"**). Yeniden basınca kapanır.
8. **Tablo**, ders ders: **[Öğrenci]**, **Tarih**, **Ders** ("3. ders · Matematik"), **Saat** ("10:10–10:50"), **Durum** ("Geç · 10 dk").
9. **Boş sonuç:** **"Bu süzgeçle kayıt yok."**
10. **Çok satır:** tabloda en çok 200 satır; fazlası için **"340 kayıt daha var; aralığı daralt ya da süzgeç seç."**
11. Tablonun altında kural notu: **"Günün durumu ilk ve son derse bakılarak hesaplanır: ilk derse geç kalmak güne geç kalmaktır; ilk
    derse gelmeyip sonra gelmek ya da son dersten önce gidip dönmemek yarım gündür; ilk ve son derste olup aradaki bir derse gelmemek
    tam gün sayılır (o ders "Ders ders"te görünür)."** ([Günün durumu](gun-durumu.md)).

### Öğrenci ve veli

- Tek kişi gösterildiği için **Öğrenci** sütunu yoktur.
- Süzgeç seçmeden aralığın **bütün günleri** (ya da ders ders görünümde bütün dersleri), "Geldi" olanlar da listelenir.
- Velinin her çocuk oturumu yalnız o çocuğu gösterir (kullanıcı 3 Ekim; [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Müdür ve öğretmen

1. Tarih satırının yanında **"Sınıf"** ve **"Öğrenci"** seçimi: müdürde okulun bütün sınıfları, öğretmende girdiği sınıflar (ör.
   **"7-A"**, **"7-C"**, **"8-B"**); **"Öğrenci"**de **"Bütün sınıf"** ve sınıfın öğrencileri. Sınıf değişince öğrenci "Bütün sınıf"a
   döner.
2. **"Bütün sınıf"**ta tablonun başında **Öğrenci** sütunu vardır ve süzgeç seçilmezse yalnız **"Geldi" OLMAYAN** günler (ders ders
   görünümde "Geldi" olmayan dersler) listelenir; "Geldi" çipine basınca onlar da gelir.
3. Tek öğrenci seçince ekran öğrencinin kendi ekranı gibi olur (bütün günler).
4. Müdürün "Devamsızlık" sayfasında açılan gün satırında her dersin durumu bir açılır listedir; düzeltme anında kaydedilir
   ([Okulun devamsızlığı](okulun-devamsizligi.md)). Sınıf sayfasının sekmesinde ve öğretmende düzeltme yoktur.
5. Aynı aralık ve görünüm Excel'e de indirilir: **"Devamsızlık raporu"** ([Okulun devamsızlığı](okulun-devamsizligi.md), "Excel").

## Kurallar ve sınırlar

- **Günler:** önizleme aralığın hafta içi günlerini listeler. Tanım günün durumunu "o günkü program"dan hesaplar; tatil ve dersi
  olmayan günlerin listeden nasıl ayıklanacağı ayrıca kararlaştırılmadı (beklenen: satır olmamaları).
- **Gün durumu hesaplanır, saklanmaz:** yoklama bugünkü gibi ders + gün anahtarlı tutulur; günün durumu ve gün sayıları kayıtlardan
  ekran açılınca hesaplanır ([Günün durumu](gun-durumu.md)).
- **Sayım:** gün gün görünümde "Gelmedi" 1 gün, "Yarım gün" 0,5 gün **özürsüz**; "İzinli" 1 gün **izinli** (ayrı); "Geç geldi" gün
  sayısına girmez. Ders ders görünümde çip sayıları ders saatidir.
- **Süzgeç VEYA ile çalışır:** "Gelmedi" + "Yarım gün" seçilince ikisinden birine uyan günler gelir.
- **Görünüm değişince süzgeç sıfırlanır;** tarih ve kişi seçimi kalır.
- **Kim neyi görür:** öğrenci kendisini, veli o oturumun çocuğunu, öğretmen girdiği sınıfları, müdür okulun bütün sınıflarını; rehber ve
  öbür çalışanlar "Devamsızlığı görür" yetkisiyle, rollerinin kapsamındaki sınıfları ([Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md)).
- **Bakılan yıl:** aralık aktif eğitim yılının içinde seçilir; geçmiş yıl üstteki yıl seçicisiyle açılır (öğrenci ve veli yalnız bir önceki
  yılı) — [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md).
- **Kararlaştırılmayanlar:** "Bu hafta" ve "Bu ay"ın tam sınırları (önizlemede bugüne kadar), "Bu dönem"in hangi dönem ayarından geldiği
  (eğitim yılının dönemleri), seçimin sayfadan çıkınca hatırlanıp hatırlanmayacağı, telefonda tablonun nasıl görüneceği, tablodaki 200
  satır sınırının sunucuda sayfalı mı olacağı.

## Kardeşler ve ilgili

**Kardeşler** ([Devamsızlık ve yoklama](README.md)): [Günün durumu](gun-durumu.md) · [Devamsızlığım](devamsizligim.md) ·
[Okulun devamsızlığı](okulun-devamsizligi.md) · [Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md) ·
[Devamsızlık sınırı uyarısı](devamsizlik-siniri-uyarisi.md) (aynı gün sayımı).

**İlgili:** [Ödevlerde süzgeçler](../odev/suzgecler.md) (benzer süzgeç düzeni) · [Sınıf sayfası](../siniflar-dersler/sinif-sayfasi.md) ·
[Sınıflarım](../siniflar-dersler/siniflarim.md) · [Dışarı aktarım](../excel-aktarim/disa-aktarim.md) ·
[Okulun ders saatleri](../ders-programi/ders-saatleri.md) · [Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md) ·
[Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md).

## Kod tarafı

- Bugün kodda yok. Bugünkü dökümler: [public/js/parcalar/18-devamsizlik.md](../../public/js/parcalar/18-devamsizlik.md)
  (`devamsizlikGovdesi`, `devamsizlikBagla`), [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md)
  (`veli-devamsizlik`); sunucu [sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md) (`devamsizlikOzeti` yalnız "son N
  gün" alır, tarih aralığı ve gün hesabı yok; `GET /api/devamsizlik/gun` tek günün derslerini programdan çıkarır).
- Kodlanınca gerekenler (tanım): tarih aralıklı döküm ucu (öğrenci, sınıf), günün durumunun kayıtlardan ve o günkü programdan
  hesaplanması, her kural için örnek günlü testler; okulun ders saatleri ayarı ([Okulun ders saatleri](../ders-programi/ders-saatleri.md)).
- Tasarım: Tasarım 1 önizlemesinin ortak devamsızlık ekranı (öğrenci, veli, müdür, sınıf sekmesi aynı ekranı kullanır).

## Sık sorulanlar

- **Bu ay kaç gün gelmedim?** "Bu ay"a bas, "Gün gün"de kal; özet satırı özürsüz ve izinli günleri yazar.
- **Hangi derslere geç kaldım?** "Ders ders"e geç, "Geç" çipine bas.
- **"Yarım gün" ne demek?** İlk derse gelmeyip sonradan gelmek ya da son dersten önce gidip dönmemek; 0,5 gün sayılır
  ([Günün durumu](gun-durumu.md)).
- **Sınıfın listesinde gelen günler neden yok?** Bütün sınıfa bakarken yalnız sorunlu günler listelenir; "Geldi" çipine basarsan gelirler.

## Sırada

- **Devamsızlık: tarih aralığı + "gün gün / ders ders" + süzgeç** (kullanıcı 2 Ekim 19:20; kod Linux'ta; DEVAM.md iş 34).
- **Okulun ders saatleri** (kullanıcı 1 Ekim) — ders numaraları ve saatleri bu ekranda da yazar.
- **Devamsızlık sınırı uyarısı** (kullanıcı 3 Ekim) — aynı gün sayımını kullanır.
- **Android yerel uygulama** — aynı ekranın uygulamadaki karşılığı.
