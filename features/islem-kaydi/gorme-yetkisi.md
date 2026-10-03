# İşlem kaydı · "İşlem kaydını görür" yetkisi

**Durum:** Kodda var; tasarımda ek olarak yetkiyi öğretmen olmayan bir çalışan da özel rolüyle taşıyabilir, destek ekibi ise
işlem kaydının tamamını göremez.

Okulun işlem kaydını müdürden başka kimin görebileceğini belirleyen yetki ve kimin hangi satırları gördüğünün kuralları.

## Ne işe yarar

İşlem kaydı okulun bütün önemli işlerini, kimin yaptığını ve IP adreslerini gösterir; bu yüzden herkese açık değil. Müdür her
zaman görür; başka biri (ör. müdür yardımcısı) ancak müdürün verdiği bir rolde **"İşlem kaydını görür"** yetkisi varsa görür.
Sistem yöneticisi bütün okulların kaydını ve hiçbir okula ait olmayan satırları görür.

## Nereden açılır

- **Yetkiyi vermek:** menü → "Okul Düzeni" → **"Roller ve Yetkiler"** → **"Rol oluştur"** ya da var olan rolün **"Düzenle"**
  düğmesi → pencerede **"Yönetim"** grubunda **"İşlem kaydını görür"** kutusu → **"Kaydet"**
  ([Rol ekle / düzenle](../roller-yetkiler/rol-duzenleyici.md)). Sonra aynı sayfanın **"Öğretmenlerin ek rolleri"** kartında
  öğretmenin açılır listesinden bu rolü seç.
- **Hazır şablon:** "Şablondan başla (isteğe bağlı)" listesinde **"Müdür Yardımcısı"** bu yetkiyle gelir; başka hiçbir hazır
  şablonda yok ([Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md)).
- **Yetkiyi kullanmak:** [İşlem kaydı sayfası](islem-kaydi-sayfasi.md).

Tasarımda (Tasarım 1 önizlemesi): rol penceresinde yetki yine **"Yönetim"** grubunda, adı yine **"İşlem kaydını görür"**;
önizlemedeki "Müdür yardımcısı" şablonunda işaretli, öteki şablonlarda (Rehber öğretmen, Etüt sorumlusu, BT sorumlusu, Okul
sekreteri …) yok.

## Adım adım

### Müdür

Yetki sende her zaman var ve kapatılamaz. Başkasına vermek için:

1. Menü → "Okul Düzeni" → **"Roller ve Yetkiler"**.
2. **"Rol oluştur"**e bas. Açılan **"Yeni rol"** penceresinde istersen **"Şablondan başla (isteğe bağlı)"** listesinden
   **"Müdür Yardımcısı"**nı seç (ipucu: "Şablon yalnızca yetkileri işaretler; sonra istediğin gibi değiştirirsin.") ya da
   **"— boş başla —"**.
3. **"Rol adı"**nı yaz (en çok 40 harf; yer tutucu "ör. Etüt Sorumlusu"). Şablon seçtiysen ve ad boşsa ad kendiliğinden şablonun
   adı olur ("Müdür Yardımcısı").
4. **"Yönetim"** grubunda **"İşlem kaydını görür"** kutusunu işaretle (bu yetkinin ders ya da sınıf daraltması yok: yetkiyi alan
   kişi okulun bütün kaydını görür).
5. **"Kaydet"** (vazgeçmek için **"Vazgeç"**; ad boşsa "Rol adı yaz."). Rol "Ek roller" kartında yetki etiketleriyle görünür;
   kayda "Rol oluşturuldu" düşer.
6. **"Öğretmenlerin ek rolleri"** kartında kişinin satırındaki açılır listeden rolü seç. Seçim hemen kaydedilir; kişiye "Sana
   "&lt;rol&gt;" rolü verildi. Menünde yeni bölümler görebilirsin." bildirimi gider; kayda "Kullanıcıya rol atandı" düşer.
7. Geri almak için kişinin listesinden **"— yalnızca Öğretmen —"**yı seç ya da roldeki kutuyu kaldırıp kaydet. Bu ikisinden yalnız
   rol düzenlemesi kayda düşer ("Rol yetkileri değiştirildi"); rolü kişiden almak düşmez.

Yetkiyi okulun hazır **"Öğretmen"** rolüne ("hazır rol" etiketli "Öğretmen" kartındaki **"Düzenle"**, pencere başlığı
"Öğretmen rolü") eklersen okuldaki **bütün öğretmenler** işlem kaydını görür. Önerilen yol bu değil, bir ek rol açmak.

### Öğretmen

1. Ek rolünde yetki varsa menünün ek bölümünde (başlığı rolün adı) **"İşlem Kaydı"** çıkar. Bildirim geldiyse ve satırı
   göremiyorsan sayfayı yeniden aç.
2. Gördüğün liste müdürünkiyle aynı: yalnız kendi okulunun satırları.
3. Kendi taşıdığın rolü ve hazır Öğretmen rolünü değiştiremezsin; yetki gerekirse müdürden iste ("Kendi taşıdığın rolü
   değiştiremezsin; müdürden iste.").

"Rol oluşturur ve düzenler" yetkin varsa bu yetkiyi başka bir öğretmene de verebilirsin (kendine veremezsin: "Kendine rol
veremezsin"). Bugün "Roller ve Yetkiler" sayfası öğretmende ayrıca "Öğretmen bilgisi ve branşını düzenler" ve "Sınıf açar ve siler"
yetkileri yoksa açılmıyor (sayfa bu iki listeyi de istiyor); sunucu ise yalnız "Rol oluşturur ve düzenler"e bakıyor.

### Çalışan

Bugün kodda: ek görevli kişi öğretmen hesabıyla bir ek rol taşır; "Müdür Yardımcısı" gibi bir rolde yetki varsa öğretmen gibi görür.

Tasarımda: kişi okula "çalışan" olarak eklenir ve görevini müdür verir ([Çalışana görev verme](../ogretmenler-calisanlar/rol-atama.md));
özel rolünde "İşlem kaydını görür" varsa öğretmen olmasa da görür. **Rolsüz çalışan** görmez (rolsüz çalışana yalnız boş ekran,
duyurular, Mesajlar, Takvim, Hatırlatıcılar ve Ayarlar açıktır).

### Yönetici

Yetki sende her zaman var; rol gerekmez. Yönetim panelindeki "İşlem Kaydı"nda:

- bütün okulların satırlarını,
- okulsuz yazılan bütün satırları (site ayarları, okul açma, okul adresi ve disk sınırı, yönetici dosyası, yedekten dönme, yorum
  gizleme; yetişkinlerin e-posta, kullanıcı adı, telefon değişikliği, "Şifremi unuttum"u ve veli hesabından yazılıp geri çevrilen
  uygunsuz kelimeli yorum)

birlikte görürsün ([Neler kaydedilir](neler-kaydedilir.md#yalnız-yöneticinin-gördüğü-kayıtlar)).

### Destek

Bugün destek rolü yok. Tasarımda destek ekibinin paneli (/panel/destek) okullar, kullanıcılar ve destek taleplerinden oluşur;
tanım destek için "işlem kaydının tamamı"nı yapamayacağı işler arasında sayar. Destekçinin kendi işleri (şifre işlemi, kısıt koyma
…) kayda yazılır ([Destek ekibi](../destek/destek-ekibi.md)).

## Kurallar ve sınırlar

- **Kimler görür:**

  | Kim | Görür mü | Hangi satırlar |
  |---|---|---|
  | Müdür | Her zaman | Kendi okulunun bütün satırları |
  | "İşlem kaydını görür" yetkili öğretmen (tasarımda çalışan) | Yalnız yetkiyle | Kendi okulunun bütün satırları (daraltma yok) |
  | Sistem yöneticisi | Her zaman | Bütün okullar + okulsuz satırlar |
  | Öğrenci, veli, servisçi | Hiçbir zaman (yetki onlara verilemez) | — |
  | Giriş yapmamış biri | Hayır | — |
  | Destek (tasarım) | Tamamını göremez | Tanımda hangi parçasını göreceği yazılmadı |

- **Hata iletileri:** yetkisi olmayan **"İşlem kaydını görme yetkin yok"**; giriş yapmamış **"Giriş yapmalısın"**; onaysız hesap
  **"Hesabın henüz onaylanmadı"**; aydınlatma metninin yeni sürümünü onaylamamış kişi önce onu onaylar ("Aydınlatma metni
  güncellendi. Devam etmek için okuyup onaylaman gerekiyor."); kendisine verilen şifreyle giren kişi önce kendi şifresini koyar
  ("Sana verilen şifreyle girdin. Devam etmeden önce kendi şifreni belirle."); henüz portalı olmayan (rolsüz) hesap **"Hesabın
  henüz bir okula bağlı değil. Okul yönetimi seni ekleyince bu bölüm açılır."** alır.
- **Menü ve sunucu:** menü satırı yetkiye göre çizilir, ama asıl kapı sunucudadır: adresi elle yazan yetkisiz kişi tablo yerine
  kırmızı ileti görür. Yetki geri alınınca sunucu bir sonraki istekte reddeder; menüdeki satır sayfa yenilenene kadar durabilir.
- **Okul sınırı:** okul yetkilisi yalnız kendi okulunu görür; iki okulda görevi olan kişi her okulun kaydını o okulun portalında
  görür. Başka okulun satırı hiçbir yoldan gelmez.
- **Okulsuz satırlar** (yetişkinlerin kişisel hesap işleri ve yöneticinin işleri) hiçbir okul yetkilisine gösterilmez.
- **Gördüklerin:** yetkili kişi okulun bütün satırlarını, ayrıntılarını (öğrenci ve veli adları, sınıflar) ve işi yapanların IP
  adreslerini görür. Bu yüzden yetkiyi yalnız okulu yöneten kişilere ver.
- **Rol dağıtan öğretmen:** "Rol oluşturur ve düzenler" yetkisi olan öğretmen bu yetkiyi, kendisinde olmasa bile, yeni bir role
  koyup başka bir öğretmene verebiliyor. Sunucu bugün bunu engellemiyor; güvenlik işinde düzeltilecek (müdüre özel kalması
  gereken "kendinden fazla yetki verme").

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [İşlem kaydı](README.md)):

- [İşlem kaydı sayfası](islem-kaydi-sayfasi.md) — yetkiyle açılan sayfa.
- [Neler kaydedilir](neler-kaydedilir.md) — okulun kaydına ve okulsuz kayda düşen işler.
- [Türe göre süzme ve arama](suzme-ve-arama.md).
- [Saklama ve sınırlar](saklama-ve-sinirlar.md).

**İlgili:**

- [Roller ve yetkiler ekranı](../roller-yetkiler/roller-ekrani.md), [Rol ekle / düzenle](../roller-yetkiler/rol-duzenleyici.md),
  [Yetki listesi](../roller-yetkiler/yetki-listesi.md), [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md),
  [Özel roller](../roller-yetkiler/ozel-roller.md).
- [Çalışana görev verme](../ogretmenler-calisanlar/rol-atama.md), [Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md).
- [Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md).
- [Paneller](../yonetim/paneller.md), [Destek ekibi](../destek/destek-ekibi.md).

## Kod tarafı

- Yetki: [sunucu/yetki.md](../../sunucu/yetki.md) — `YETKILER` "Yönetim" grubunda `{ k: 'islem-kaydi.gor', ad: 'İşlem kaydını
  görür' }` (açıklama ve kapsam yok); `ROL_SABLONLARI` içinde yalnız "Müdür Yardımcısı"; müdür ve yönetici `TUM_YETKILER`'e sahip;
  öğretmende hazır Öğretmen rolü + ek rol birleşimi.
- Uç: [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md) — `me.role === 'admin'` ise okul süzgeci yok;
  değilse `yetkiVarMi(me, 'islem-kaydi.gor')` yoksa 403 "İşlem kaydını görme yetkin yok", varsa `me.schoolId`.
- Okulsuz yazma: aynı belge (`islemYaz`, `depo.kullanicilar.yetiskinMi`) ve
  [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) (`yetiskinMi`: ana hesap, rolü boş ya da veli).
- Kapı: [sunucu/api.md](../../sunucu/api.md) (`need()`; aydınlatma metni onayı).
- Roller: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) (`role`, `role-update`: "Kendi taşıdığın rolü
  değiştiremezsin; müdürden iste.", `role-assign`: "Kendine rol veremezsin"; rol oluştururken yetki sınırı yok).
- Ön yüz: [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) (rol penceresi, "Öğretmenlerin ek rolleri"),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md) (`yetkim('islem-kaydi.gor')`).
- Testler: [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md) (`GET /api/islem-kaydi`: yalnız müdür ve yönetici geçer;
  yetkisiz öğretmen, öğrenci, veli, servisçi ve giriş yapmamış 401/403), [testler/test-servis-konum.md](../../testler/test-servis-konum.md)
  (servisçi giremez), [testler/test-site-ayarlari.md](../../testler/test-site-ayarlari.md) (müdür okulsuz site ayarı satırlarını
  görmez).

## Sık sorulanlar

- **Müdür yardımcıma işlem kaydını nasıl gösteririm?** "Roller ve Yetkiler" → "Rol oluştur" → şablon "Müdür Yardımcısı" (yetki
  işaretli gelir) → "Kaydet" → "Öğretmenlerin ek rolleri"nde kişiye bu rolü seç.
- **Yetkiyi yalnız bir sınıfın kayıtlarına daraltabilir miyim?** Hayır; bu yetkide ders ya da sınıf daraltması yok.
- **Öğretmenim kendi işlerini görebilir mi?** Yetkisi yoksa hayır; yetkisi varsa yalnız kendininkini değil, bütün okulu görür.
- **Veli çocuğunun okulunun işlem kaydını görebilir mi?** Hayır; veli, öğrenci ve servisçiye bu yetki verilemez.
- **Yetkiyi aldım ama menüde hâlâ duruyor.** Sayfa yenilenince kalkar; tıklarsan "İşlem kaydını görme yetkin yok" çıkar.

## Sırada

- Güvenlik denetimi: rol dağıtan öğretmenin kendinde olmayan yetkiyi (bu yetki dahil) verememesi.
- Çalışan olarak ekleme: yetkiyi öğretmen olmayan çalışan da özel rolle taşıyacak.
- Paneller /panel/admin ve /panel/destek: yöneticinin bölümü panele taşınacak; destek ekibi işlem kaydının tamamını göremeyecek.
- Özel roller (öneri): yeni hazır şablonlar; bu yetki yalnız "Müdür Yardımcısı"nda kalıyor.
