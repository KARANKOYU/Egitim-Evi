# İşlem kaydı · Saklama ve sınırlar

**Durum:** Kodda var; tasarımda ek olarak saklama okul başına 2 yıla geçer (bugünkü sistem geneli 5000 satır sınırının yerine) ve
sayfadaki 300 satır sınırı ile sayfalama yeniden ele alınır.

İşlem kaydının kaç satır tuttuğu, ekranda kaçını gösterdiği, satırların ne zaman silindiği, yedekte ne olduğu ve kimsenin neden
silemediği.

## Ne işe yarar

İşlem kaydı sonsuza kadar büyüyemez; bir yerde eski satırlar silinir. Bu belge o sınırları ve "dün burada olan satır nereye
gitti?" sorusunun cevaplarını anlatır.

## Nereden açılır

Ayrı bir ekranı yok. Sınırların etkisini [İşlem kaydı sayfası](islem-kaydi-sayfasi.md)'nda tablonun başlığında görürsün:
"Son 300 kayıt (toplam 1250)" — 300 gösterilen, 1250 süzgece uyan bütün satırlar.

## Adım adım

### Müdür

1. "İşlem Kaydı"nı açınca en yeni 300 satır gelir. Toplam bundan fazlaysa başlıkta parantez içinde yazar.
2. Daha eski bir satırı arıyorsan türünü seç ([Türe göre süzme ve arama](suzme-ve-arama.md)): o türün en yeni 300 satırı gelir.
3. Bunun ötesine bugün bakılamaz; sayfalama yok.
4. Bir satır kaybolduysa: bütün sistemde 5000'den fazla satır olunca en eskiler silinir (aşağıda). Satırı kimse elle silmez.

### Öğretmen

"İşlem kaydını görür" yetkin varsa müdürle aynı sınırlar geçerli ([yetki](gorme-yetkisi.md)).

### Çalışan

Bugün kodda öğretmen hesabıyla ek rol taşıyan kişi öğretmenle aynı; tasarımda görev yetkisi olan çalışan da aynı.

### Yönetici

1. Aynı 300 satır sınırı senin tablonda da var, ama senin tablonda bütün okullar ve okulsuz satırlar birlikte olduğu için 300
   satır daha çabuk dolar.
2. 5000 satırlık üst sınır bütün sistem içindir: kalabalık bir okulun satırları sakin bir okulun eski satırlarını da iter.
3. **Yedekten geri yükleme** ([Site yedekleri](../yonetim/yedekler.md)): işlem kaydı da yedeğe girer. Bir yedeği geri yükleyince
   işlem kaydı yedeğin alındığı ana döner; o andan sonraki bütün satırlar canlı tablodan gider. Sunucu geri yüklemeden hemen önce
   şimdiki hâli ayrı bir "geri alma" yedeği olarak saklar; kaybolan satırlar yalnız o yedekte durur. Hemen ardından **"Yedekten
   geri yüklendi"** satırı (ayrıntısında yedek dosyasının adı) yazılır, yedekteki senin hesabının adıyla; hesabın yedekte yoksa
   Kişi sütununda "(bilinmiyor)" yazar.

## Kurallar ve sınırlar

- **Ekranda:** en yeni 300 satır; seçili tür varsa o türün en yeni 300 satırı. "Daha fazla" ya da sayfa düğmesi yok.
- **Veritabanında:** bütün sistemde (bütün okullar ve okulsuz satırlar birlikte) **en çok 5000 satır**. Her yeni satırdan sonra en
  yeni 5000'in dışında kalanlar silinir. Sınır **okul başına değil**; çok okullu kurulumda bir okulun kaydı çok kısa kalabilir
  (saklama tanımının hesabı: 1000 okulda okul başına ortalama 5 satır).
- **Süre:** bugün satırların süresi yok; yalnız 5000 sınırıyla silinirler.
- **Elle silme ve düzeltme yok:** müdür de yönetici de bir satırı silemez, değiştiremez; böyle bir düğme ya da sunucu ucu yok.
- **Kişi silinince** satır kalır: Kişi sütununda adı ve rolü yazıldığı andaki hâliyle görünür (hesapla bağı kopar, ad kalır).
- **Ayrıntı** en çok 300 karakter; uzunu kesilir. **IP** geçerli bir adres değilse boş yazılır.
- **Yazılamazsa:** satır yazılırken bir hata olursa asıl iş (hesap açma, rol verme …) yine tamamlanır; yalnız o satır eksik kalır.
  Bunu yalnız sunucu günlüğü söyler: "İşlem kaydı yazılamadı: …". Ekranda bir uyarı çıkmaz.
- **Eğitim yılı:** işlem kaydı yıla bağlı değil; yeni yıl açmak ya da geçmiş yıla bakmak satırları silmez, değiştirmez.
- **Yedek:** işlem kaydı günlük sistem yedeğine girer ve geri yüklemede yedekteki hâline döner (yukarıda). Yedekteki IP geçersizse
  boş, okulu artık olmayan satır okulsuz yüklenir.
- **Aydınlatma metni:** bugünkü aydınlatma metninde işlem kaydı (kimin, ne zaman, hangi işi yaptığı ve IP adresi; okul yönetiminin
  bunu görmesi) ayrı bir satır olarak yazmıyor; yalnız "Giriş kayıtları (tarih, IP adresi) ve son giriş zamanı" var. Saklama
  bölümünde de işlem kaydının süresi yok ve metin sistem yöneticisi hesabı sildiğinde kişisel verilerin kayıtlardan kaldırıldığını
  söylüyor; işlem kaydında ise silinen kişinin adı (ve başkalarının satırlarının ayrıntısında geçen adı) kalır. Bu farklar KVKK denetimi işinde ele alınacak ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md),
  [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md)).

### Tasarımda

Kullanıcının onayladığı saklama tanımına göre (itiraz edilmeyen öneri):

- İşlem kaydı **okul başına 2 yıl** saklanır. Bugünkü sistem geneli 5000 satır sınırı **kalkar**; yerine süre ve okul başına makul
  bir üst sınır gelir (ör. 50 000).
- Temizlik günde bir ya da saatte bir, küçük parçalar hâlinde yapılır (tek büyük silme tabloyu kilitlemesin).
- "Başarısız giriş denemesi" satırları (bugün yazılmıyor) 90 gün sonra silinir.
- Kayıt büyüyünce sayfadaki 300 satır sınırı ve sayfalama yeniden düşünülür.
- Okul yedeği geri yüklenince "ayrıntılı" bir satır yazılır ([Okul yedeği](../egitim-yili/okul-yedegi.md)).
- [Verilerimi indir](../ayarlar/verilerimi-indir.md): kişinin indirdiği dosyada işlem kaydında **kendi yaptığı** işler de olur;
  indirmenin kendisi kayda "veri indirildi" diye düşer (içerik değil).
- Eklenti tanımı (eklentiler kodlanmayacak, yalnız belgeleniyor): işlem kaydının süresi (2 yıl) okulun ya da eklentinin
  değiştirebileceği ayarlardan değil ("kısalırsa tahrifat izi silinir"); eklenti işlem kaydını okuyamaz, silemez, değiştiremez
  ([Sınırlar](../eklentiler/sinirlar.md)).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [İşlem kaydı](README.md)):

- [İşlem kaydı sayfası](islem-kaydi-sayfasi.md) — "Son 300 kayıt (toplam …)" başlığı.
- [Türe göre süzme ve arama](suzme-ve-arama.md) — 300'ün dışındaki eski satırlara tür seçerek ulaşmak.
- [Neler kaydedilir](neler-kaydedilir.md) — hangi işler satır olarak düşer.
- ["İşlem kaydını görür" yetkisi](gorme-yetkisi.md).

**İlgili:**

- [Saklama süreleri](../kvkk-ve-gizlilik/saklama-sureleri.md), [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md),
  [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).
- [Site yedekleri](../yonetim/yedekler.md), [Okul yedeği](../egitim-yili/okul-yedegi.md).
- [Verilerimi indir](../ayarlar/verilerimi-indir.md), [Hesabımı sil](../ayarlar/hesabimi-sil.md).
- [Sınırlar (kum havuzu)](../eklentiler/sinirlar.md).

## Kod tarafı

- Sınır ve silme: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) — `ISLEM_SINIR = 5000`; `islemYaz` her yazıştan sonra
  `DELETE … ORDER BY tarih DESC OFFSET 5000`; `islemKayitlari(okulId, tur, 300)` en yeni 300 + `toplam` + `turler`.
- Uç: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) ("Dikkat!" bölümü: sınırın sistem geneli olması,
  yutulan yazma hatası, yalnız okunur kayıt).
- Tablo: [sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md) — `islem_kaydi` (şema 001): `kullanici_id` kişi silinince
  boşalır (`ON DELETE SET NULL`), `kullanici_ad` ve `kullanici_rol` kalır; dizin `islem_kaydi_okul_tarih`.
- Yedek: [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) (`islem_kaydi` yedeğe girer; geri yüklemede IP ve okul
  denetlenir), [sunucu/bolumler/yonetici.md](../../sunucu/bolumler/yonetici.md) (`backup-restore` sonrası `yedek.geri-yuklendi`).
- Ön yüz: [public/js/parcalar/15-aktarim.md](../../public/js/parcalar/15-aktarim.md) ("Son N kayıt (toplam M)" başlığı, sayfalama
  yok).
- Aydınlatma metni: `public/kvkk/kvkk.html` (kişisel veri tablosu ve "Ne kadar süre saklanıyor?" bölümü).

## Sık sorulanlar

- **Geçen ayki bir satır kaybolmuş.** Bütün sistemde 5000 satır dolunca en eskiler silinir; okul kalabalıksa ya da sistemde çok
  okul varsa bu çabuk olur. Elle silinmiş olamaz.
- **Kayıtları kalıcı saklamak için dışarı alabilir miyim?** Bugün işlem kaydını indirme düğmesi yok.
- **Bir öğretmen okuldan çıktı, eski satırlarında adı duruyor mu?** Evet; satır yazıldığı andaki adıyla kalır.
- **Yedekten geri yükledik, son günlerin satırları yok.** Geri yükleme işlem kaydını da yedeğin anına döndürür; en üstte "Yedekten
  geri yüklendi" satırı durur.

## Sırada

- Optimizasyon + saklama süreleri: okul başına 2 yıl, sistem geneli 5000 sınırının kalkması, "Başarısız giriş denemesi" 90 gün,
  sayfalama.
- KVKK ve onay metinleri TAM denetimi: işlem kaydının (IP dahil) aydınlatma metnine ve saklama bölümüne yazılması.
- Kullanıcı arama, destek talepleri, Verilerimi indir: kişinin kendi işlem satırları indirdiği dosyaya girecek.
- Yıl geçişi: okul yedeği geri yüklemede ayrıntılı kayıt.
