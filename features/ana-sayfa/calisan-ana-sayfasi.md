# Ana sayfa · Rolsüz çalışanın ana sayfası

**Durum:** Tasarlandı — henüz kodda yok

Okula kişi koduyla eklenmiş ama müdürün henüz görev vermediği çalışanın, o okulun oturumunda gördüğü sade ana sayfa:
**"Okul yönetimi sana henüz bir görev vermedi."**

## Ne işe yarar

Kullanıcının 27 Eylül kararı: "+ Ekle'de 'Öğretmen olarak' değil 'Çalışan olarak' ekle. Müdür kodu girer; ona rol (Öğretmen,
özel rol, Kodlayıcı) atamadığı sürece rolsüz görünür." Okula katılmak ile okulda yetki almak ayrılır: kişi önce rolsüz çalışan
olur, ne yapacağına müdür karar verir. Bu sayfa o bekleme anının ekranıdır: kişiye neden hiçbir okul bölümü görmediğini söyler,
okulla iletişimini (duyurular, mesajlar) ve kendi işlerini (takvim, hatırlatıcılar, ayarlar) açık bırakır.

**Bugünkü kodda bu sayfa yok.** Kodla eklenen kişi doğrudan **öğretmen** olur ve [Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md)'nı
görür; müdürün verdiği ek rol (Müdür Yardımcısı, Rehber Öğretmen…) ana sayfayı değiştirmez. Bugünkü "rolsüz" sözü başka bir
şeydir: hiçbir okula ya da çocuğa bağlı olmayan yetişkin hesabının sayfası (menüde "Başlangıç" ve "Hatırlatıcılar", "Henüz bir
portalın yok" kartı; [Henüz portalı olmayan yetişkin](../portallar/portalsiz-hesap.md)).

## Nereden açılır

- Müdür kişi kodunu girince kişinin sol menüsünün üstündeki oturum listesinde (bugün **Portallarım**, tasarımda **Oturumlarım**)
  **"Çalışan · Test Ortaokulu"** belirir; ona geçince bu ana sayfa açılır ([Portala geçiş](../portallar/portala-gecis.md),
  [Portallarım](../portallar/portallarim.md)).
- O okulda tek oturumun buysa girişten sonra kendiliğinden açılır.
- Menünün ilk satırı **"Ana sayfa"** ([Sol menü](../menu-ve-arama/sol-menu.md)).

## Adım adım

### Çalışan (rolsüz)

1. Kendi hesabının **"+ Ekle → Çalışan"** bölümündeki kişi kodunu okulunun müdürüne verirsin ("Kişi kodunu okulunun müdürüne
   ver; seni okula çalışan olarak ekler."; [+ Ekle penceresi](../portallar/ekle-penceresi.md), [Kişi kodu](../portallar/kisi-kodu.md)).
2. Müdür kodu girince bildirim gelir: **"Test Ortaokulu okuluna çalışan olarak eklendin. Görevini okul yönetimi verecek."**
3. **"Çalışan · Test Ortaokulu"** oturumuna geç. Ana sayfada boş ekran: **"Okul yönetimi sana henüz bir görev vermedi."**
   Ödev, sınav, yoklama, ders programı, öğrenci gibi hiçbir okul kutucuğu yoktur.
4. Açık olanlar yalnız şunlardır (menüde): **okulun duyuruları**, **Mesajlar** (okul yönetimine yazabilirsin;
   [Mesaj kutusu](../mesaj/kutu.md)), **Takvim** ([Takvim sayfası](../takvim/takvim-sayfasi.md)), **Hatırlatıcılar**
   ([Hatırlatıcılar sayfası](../hatirlatici/hatirlaticilar-sayfasi.md)) ve **Ayarlar** ([Hesap ayarları](../ayarlar/hesap-ayarlari-sayfasi.md)).
   Tanım okulun duyurularını ayrıca sayar; duyuruların ana sayfanın kendisinde mi, yalnız Mesajlar'da mı duracağı tanımda
   yazmıyor (açık nokta).
5. Müdür sana görev verince bildirim gelir; Öğretmen görevinde **"Sana Öğretmen görevi verildi."** Oturumunun adı **"Öğretmen ·
   Test Ortaokulu"** olur ve ana sayfan [Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md)'na döner.
6. Öğretmen olmadan yalnız özel bir rol verildiyse (ör. yalnız **Kodlayıcı**), oturumun adı rolün adı olur ve rolün açtığı
   bölümler menüne gelir ([Rol atama](../ogretmenler-calisanlar/rol-atama.md), [Özel roller](../roller-yetkiler/ozel-roller.md)).
   Bu durumda ana sayfada ne olacağı tanımda yazmıyor; öneri: boş ekran yerine rolün açtığı bölümlerin kutucukları
   (karar yok, kullanıcıya sorulacak).
7. Görevin sonradan alınırsa yeniden rolsüz çalışan olursun; ana sayfa yeniden "Okul yönetimi sana henüz bir görev vermedi."
   der. Okuldan çıkmazsın.

### Müdür

Müdür rolsüz çalışanın ana sayfasını görmez; onu **"Çalışanlar"** listesinde **"Rolsüz"** etiketiyle görür ve **"+ Rol ata"**
ya da **"Müdür yap"** ile görev verir ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md),
[Rol atama](../ogretmenler-calisanlar/rol-atama.md), [Müdür yapma](../ogretmenler-calisanlar/mudur-yapma.md)).

### Tasarımda (Tasarım 1 önizlemesi)

Önizlemede rolsüz çalışan için ayrı bir örnek hesap yoktur; bu sayfa önizlemede çizilmemiştir. Önizlemenin SSS'sinde aynı metin
geçer: "Kişi okula önce rolsüz çalışan olarak katılır; portalında "Okul yönetimi sana henüz bir görev vermedi." yazar."
Tasarımda arayüzde "portal" kelimesi yerine **"oturum"** kullanılır ("Oturumlarım", "Oturum değiştir").

## Kurallar ve sınırlar

- **Sunucu kapısı:** rolsüz çalışana açık olanlar yalnız duyurular, Mesajlar, Takvim, Hatırlatıcılar ve Ayarlar'dır; başka her
  okul bölümü ve ucu kapalıdır, adresi elle yazmak işe yaramaz. Yetki denetimi testi bunu kanıtlayacak (tanım).
- **Atanamaz:** öğretmen görevi olmayan çalışan ders programına, ödeve, sınava, yoklamaya atanamaz.
- **Süre yok:** rolsüzlük kendiliğinden bitmez; müdür görev verene kadar sürer.
- **Aynı hesapta başka oturumlar:** kişinin başka okuldaki öğretmen oturumu ya da çocuğunun veli oturumu bu sayfadan etkilenmez.
- **Bildirim ve kayıt:** eklenince ve görev verilince kişiye bildirim gider; ikisi de işlem kaydına yazılır
  ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Öğretmenin ana sayfası](ogretmen-ana-sayfasi.md) (görev verilince) · [Kutucuklar](kutucuklar.md) ·
[Müdürün ana sayfası](mudur-ana-sayfasi.md) · [Öğrencinin ana sayfası](ogrenci-ana-sayfasi.md) ·
[Velinin ana sayfası](veli-ana-sayfasi.md) · [Servisçinin ana sayfası](servisci-ana-sayfasi.md) ·
[Yöneticinin ana sayfası](yonetici-ana-sayfasi.md). Klasör: [Ana sayfa](README.md).

**İlgili:**

- [Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md), [Kodla ekleme](../ogretmenler-calisanlar/kodla-ekleme.md),
  [Rol atama](../ogretmenler-calisanlar/rol-atama.md).
- [+ Ekle penceresi](../portallar/ekle-penceresi.md), [Henüz portalı olmayan yetişkin](../portallar/portalsiz-hesap.md).
- [Özel roller](../roller-yetkiler/ozel-roller.md).
- Rol kapısı: [Çalışan](../roller/calisan.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı bugünkü parçalar: [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md)
(`SAYFALAR.ana`: rol satırı "çalışan" kolu), [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (kısıtlı menü),
[public/js/parcalar/08c-kisilikler.md](../../public/js/parcalar/08c-kisilikler.md) (oturumun adı "Çalışan · okul"),
[sunucu/bolumler/ogretmen.md](../../sunucu/bolumler/ogretmen.md) (kodla ekleme), [sunucu/yetki.md](../../sunucu/yetki.md)
(sunucu kapısı).

## Sık sorulanlar

- **Okula eklendim ama hiçbir şey göremiyorum.** Müdür sana henüz görev vermemiş; görev verince bölümlerin açılır. Bu arada
  Mesajlar'dan okul yönetimine yazabilirsin.
- **Öğretmenim; neden "Çalışan" diye eklendim?** Tasarımda herkes önce çalışan olarak katılır; öğretmenlik müdürün verdiği bir
  görevdir.

## Sırada

- "Çalışan olarak ekleme" (iş 2): rolsüz çalışan ve bu ana sayfa.
- Yalnız özel rolü olan çalışanın ana sayfası ve duyuruların yeri — kullanıcıya sorulacak.
