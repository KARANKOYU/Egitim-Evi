# Öğretmenler ve çalışanlar · Rolsüz çalışan

**Durum:** Tasarlandı — henüz kodda yok

Okula kişi koduyla eklenmiş ama müdürün henüz görev vermediği kişi: okulda görünür, okulun duyurularını ve mesajlarını alır, ama
hiçbir okul bölümüne giremez.

## Ne işe yarar

Kullanıcının kararı (27 Eylül): "+ Ekle'de 'Öğretmen olarak' değil 'Çalışan olarak' ekle. Müdür kodu girer; ona rol (Öğretmen,
özel rol, Kodlayıcı) atamadığı sürece rolsüz görünür. Böyle daha iyi." (Kullanıcı 25 Eylül'de de kayıt için "ilk rolsüz olcak"
demişti.)

Böylece okula katılmak ile okulda yetki almak ayrılır: kişi kodunu veren herkes önce **rolsüz çalışan** olur; ne yapacağına müdür
karar verir. Okulda öğretmen olmayan çalışanlar (sekreter, rehber, bilişim sorumlusu, okul sayfasını düzenleyen kişi) de böylece
öğretmen kılığına girmeden okula katılır.

**Bugün kodda yok:** kodla eklenen kişi doğrudan **öğretmen** olur ve okulun hazır Öğretmen rolünün bütün yetkileriyle hemen
çalışır ([Kodla ekleme](kodla-ekleme.md)). Bugünkü "rolsüz" sözü başka bir şeydir: henüz hiçbir okula ya da çocuğa bağlı olmayan
yetişkin hesabı (menüsünde yalnız "Başlangıç" ve "Hatırlatıcılar"; [Henüz portalı olmayan yetişkin](../portallar/portalsiz-hesap.md)).

## Nereden açılır

- Kişi okula eklenince menüsündeki **Portallarım** (tasarımda **Oturumlarım**) altında **"Çalışan · Test Ortaokulu"** belirir;
  ona geçince rolsüz çalışanın ekranı açılır ([Portala geçiş](../portallar/portala-gecis.md)).
- Müdür onu **"Çalışanlar"** listesinde **"Rolsüz"** etiketiyle görür ([Öğretmenler ve çalışanlar listesi](liste.md)).

## Adım adım

### Çalışan (rolsüz)

1. Kendi hesabından **"+ Ekle → Çalışan"**daki kişi kodunu okulunun müdürüne verirsin ([Kodla ekleme](kodla-ekleme.md)).
2. Müdür kodu girince bildirim gelir: **"Test Ortaokulu okuluna çalışan olarak eklendin. Görevini okul yönetimi verecek."**
3. Okulun oturumuna geç. Ana sayfanda boş ekran: **"Okul yönetimi sana henüz bir görev vermedi."**
   ([Çalışanın ana sayfası](../ana-sayfa/calisan-ana-sayfasi.md)).
4. Menünde yalnız şunlar vardır:
   - **okulun duyuruları**,
   - **Mesajlar** — okul yönetimine yazabilirsin ([Mesajlar ve duyurular](../mesaj/README.md)),
   - **Takvim** ([Takvim ve ajanda](../takvim/README.md)),
   - **Hatırlatıcılar** ([Hatırlatıcılar](../hatirlatici/README.md)),
   - **Ayarlar** ([Hesap ayarları](../ayarlar/README.md)).
   Başka hiçbir bölüm (ödev, sınav, yoklama, ders programı, öğrenciler, etüt, anket, servis, roller…) görünmez; adresini elle yazsan
   da sunucu kapısı geri çevirir.
5. Müdür sana görev verince bildirim gelir (Öğretmen görevinde **"Sana Öğretmen görevi verildi."**); oturumunun adı **"Öğretmen ·
   Test Ortaokulu"** ya da özel rolünün adı olur ve rolün açtığı bölümler menüne gelir ([Rol atama](rol-atama.md)).
6. Görevin sonradan alınırsa yeniden rolsüz çalışan olursun; okuldan çıkmazsın.

Okuldan kendin ayrılmak istersen öğretmenin yolu sana da açık kalır (öneri; çalışan tanımı bunu ayrıca yazmıyor:
[Bu okuldan ayrıl](../portallar/okuldan-ayrilma.md)).

### Müdür

1. **"Çalışanlar"**da rolsüzler listenin en üstündedir; satırda **"Rolsüz"** etiketi ve ikinci satırda "rol atanmadı"; sayfa başlığının
   altında "· 1 rolsüz" gibi sayı.
2. Satıra bas: pencerede **"Rolsüz"** etiketi ve "Rol atanana kadar okulda görünür ama hiçbir yetkisi yoktur."
3. **"+ Rol ata"** ile görev ver ([Rol atama](rol-atama.md)) ya da gerekiyorsa doğrudan **"Müdür yap"** ([Müdür yapma](mudur-yapma.md)):
   rolsüz çalışan da müdür yapılabilir.
4. Kişi okulda hiç çalışmayacaksa onu okuldan çıkar ([Okuldan çıkarma](okuldan-cikarma.md)).

Tasarım 1 önizlemesinde müdürün tarafı (rolsüz etiketi, sayaç, pencere notu) vardır; rolsüz çalışanın kendi ekranı (boş ana sayfa ve
kısıtlı menü) önizlemede ayrı bir hesap olarak yoktur.

### Öğretmen, öğrenci ve veli

Rolsüz çalışan ders programında, ödevde, sınavda, yoklamada **öğretmen olarak görünmez** ve oralara atanamaz; öğrencinin ve
velinin ekranlarında da öğretmen olarak yer almaz. Mesaj alıcı seçicilerinde nasıl görüneceği tanımda yazılı değil (açık nokta;
[Bana kim yazabilir](../mesaj/bana-kim-yazabilir.md)).

## Kurallar ve sınırlar

- **Sunucu kapısı:** rolsüz çalışana açık olanlar yalnız duyurular, Mesajlar, Takvim, Hatırlatıcılar ve Ayarlar; başka her okul
  bölümü ve ucu kapalıdır. Yetki denetimi testi bunu rol satırı olarak kanıtlar (tanım).
- **Atanamaz:** öğretmen görevi olmayan çalışan ders programına, ödeve, sınava, yoklamaya atanamaz; "Öğretmenler" listeleri
  (seçiciler) yalnız Öğretmen görevi olanları gösterir, "Çalışanlar" herkesi.
- **Görev verilene kadar sınırsız bekler:** tanımda rolsüzlüğe süre yok; müdür unutmasın diye rolsüzler listenin başındadır.
- **Görev alınınca:** kişi yeniden rolsüz olur, okulda kalır. "Okuldan çıkar" ayrı iştir.
- **Veli de olabilir:** rolsüz çalışanın aynı hesapta çocuğunun veli oturumu ayrıca durur; çalışan oturumu bunu etkilemez.
- **Veri modeli (tanım):** okuldaki rol satırının rolü "öğretmen" yerine yeni bir değer (ör. "çalışan") ya da "öğretmen değil"
  işareti — hangisi daha az kırılgansa. Bugünkü bütün öğretmenler göçle Öğretmen görevini taşır.
- **Bildirim ve kayıt:** eklenince kişiye bildirim; ekleme ve görev verme işlem kaydına yazılır ([Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md)).
- **Yaş:** çalışan olmak için yaş sınırı ya da "18 yaş altı soluk seçenek" yoktur (kullanıcı 29 Eylül: "yaş şeyi olmasın").

## Kardeşler ve ilgili

**Kardeşler:** [Kodla ekleme](kodla-ekleme.md) · [Rol atama](rol-atama.md) · [Müdür yapma](mudur-yapma.md) ·
[Öğretmenler ve çalışanlar listesi](liste.md) · [Hesap penceresi](hesap-penceresi.md) · [Okuldan çıkarma](okuldan-cikarma.md).

**İlgili:**

- [Çalışanın ana sayfası](../ana-sayfa/calisan-ana-sayfasi.md), [Sol menü](../menu-ve-arama/sol-menu.md).
- [Henüz portalı olmayan yetişkin](../portallar/portalsiz-hesap.md) — bugünkü "rolsüz" yetişkin hesabı (başka şey).
- [+ Ekle penceresi](../portallar/ekle-penceresi.md), [Portallarım](../portallar/portallarim.md).
- [Mesajlar ve duyurular](../mesaj/README.md), [Takvim ve ajanda](../takvim/README.md), [Hatırlatıcılar](../hatirlatici/README.md).
- [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Hazır şablonlar](../roller-yetkiler/hazir-sablonlar.md).
- [Bildirim metinleri](../bildirim/bildirim-metinleri.md).

## Kod tarafı

Henüz kodda yok. Bugünkü davranışın yerleri:

- [sunucu/bolumler/hesaplar.md](../../sunucu/bolumler/hesaplar.md) — `ogretmen-ekle` rol satırını doğrudan `teacher` olarak açar.
- [sunucu/yetki.md](../../sunucu/yetki.md) — `kullaniciYetkileri`: öğretmen satırı hazır Öğretmen rolünün yetkilerini alır; rolsüz
  çalışan için yeni rol değeri ya da işaret buraya gelecek.
- [sunucu/api.md](../../sunucu/api.md) — bugünkü rolsüz (portalsız) yetişkin kapısı; çalışan kapısı benzer biçimde kurulacak.
- [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md), [public/js/parcalar/08b-rolsuz.md](../../public/js/parcalar/08b-rolsuz.md)
  — bugünkü rolsüz yetişkinin menüsü ve ekranı.
- Testler: [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md) (her uç × her rol; rolsüz çalışan satırı eklenecek),
  [testler/test-yetiskin.md](../../testler/test-yetiskin.md).

## Sık sorulanlar

- **Okula eklendim ama hiçbir şey göremiyorum.** Tasarımda bu beklenen durumdur: müdür sana görev vermedikçe "Okul yönetimi sana henüz
  bir görev vermedi." yazar. Müdürüne Mesajlar'dan yazabilirsin.
- **Öğretmen değilim, okulun sayfasını düzenleyeceğim. Öğretmen olmam gerekir mi?** Tasarımda hayır: müdür sana yalnız
  "Kodlayıcı / Tasarımcı" görevini verir; ders, ödev, yoklama görmezsin.
- **Bugün neden kodla eklenen herkes öğretmen?** Çalışan olarak ekleme henüz kodlanmadı (iş 2).

## Sırada

- Çalışan olarak ekleme (iş 2, canlıdan önce): rolsüz çalışan satırı, kısıtlı menü ve sunucu kapısı, "Okul yönetimi sana henüz bir
  görev vermedi." ekranı, bildirimler, göç, testler; KILAVUZ ve SSS ("Okul çalışanı okula nasıl katılır?").
- Tek kişi tek hesap ve portallar (iş 19): "portal" yerine "oturum" dili.
