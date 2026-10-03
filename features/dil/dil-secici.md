# Dil ve çeviri · Dil seçici (TR ▾)

**Durum:** Tasarlandı — henüz kodda yok

Üst şeritteki "TR ▾" düğmesi: basınca diller kendi adlarıyla ve ne kadar çevrildikleriyle listelenir, birini seçince Eğitim
Evi'nin menüleri, düğmeleri ve iletileri o dile geçer.

## Ne işe yarar

Eğitim Evi'ni kullananların hepsi Türkçe bilmiyor; kullanıcının 29 Eylül sözüyle "yabancı öğrencilerde var". Aynı mesajda
seçicinin yerini ve biçimini de söyledi: "siteye dil üstte olur o an hangi dil varsa o olsun tr- tire yerine dropdown işareti
aşağı ok" ve "ana menüde ülke kodu ve diller ne kadar çevrildiği yazsın bi yerde". 2 Ekim'de önizleme için ekledi: "tr en şeyi
unutma çevirme sadece değişince eng yazsın ve bikaç kelim belli etsin yeter".

Bugün site yalnız Türkçedir: bütün sayfalar `<html lang="tr">` ile açılır, dil seçici yoktur.

## Nereden açılır

- **Oturumdayken:** üst şeridin sağında, ay/güneş (tema) düğmesinin solunda **"TR ▾"** (ekran okuyucunun okuduğu ad "Dil seç").
  Başka dil seçiliyken düğmede onun kodu yazar: "ENG ▾", "DE ▾", "AR ▾" ([Üst şerit](../menu-ve-arama/ust-serit.md)).
- **Giriş yapmadan:** açılış sayfasının, giriş ve kayıt ekranının ve girişsiz eğitim içeriklerinin üst şeridinde, sağ grubun
  başında yine **"TR ▾"** (ekran okuyucu adı "Dil: Türkçe · başka dil seç")
  ([Üst şerit ve alt bilgi](../acilis-sayfasi/ust-serit-ve-alt-bilgi.md), [Girişsiz izleme](../egitim-icerikleri/girissiz-izleme.md)).
- **Hesap ayarları:** Ayarlar → **"Görünüm ve dil"** → **"Dil"** satırı → **"Değiştir"**. Profil menüsündeki **"Görünüm ve dil"**
  satırı (altında "tema, dil") bu bölümü açar ([Görünüm ve dil](../ayarlar/gorunum-ve-dil.md), [Profil menüsü](../menu-ve-arama/profil-menusu.md)).
- **Telefon uygulamasında:** uygulamanın Ayarlar'ı ([Uygulamada dil](uygulamada-dil.md)).

## Adım adım

Açılan liste her yerde aynıdır (Tasarım 1 önizlemesi):

- Üstte başlık **"Dil"**, sağında kapatma düğmesi ("Kapat").
- Her dil bir satır: solda kod rozeti, ortada dilin **kendi adı**, adın altında **"%82 çevrildi"** gibi oran (sağdan sola dilde
  sonuna **" · sağdan sola"** eklenir), sağda ince yeşil ilerleme çubuğu. Seçili dilin satırı vurgulu.
- Önizlemedeki diller: **Türkçe** (TR, %100), **English** (ENG, %82), **Deutsch** (DE, %12), **العربية** (AR, %41 · sağdan sola).
- Listenin altında not: **"Çevrilmemiş yazılar Türkçe görünür. Aydınlatma metni ve kullanım koşulları yalnız Türkçedir. Çeviriye
  yardım etmek için: egitimevi.org/panel/translate"**.

Tanımdaki örnek biçim biraz farklı: "Türkçe", "English — %92", "العربية — %40", "한국어 — %5"; oranı belli bir eşiğin altındaki
diller **"(yarım)"** rozetiyle görünür. Önizlemede rozet yok, onun yerine ilerleme çubuğu var.

### Ziyaretçi (giriş yapmadan)

1. Açılış sayfasında (ya da giriş, kayıt, eğitim içerikleri sayfasında) üst şeritteki **"TR ▾"**ye bas. Liste açılır, seçili dilin
   satırı vurgulu ve imleç onun üstündedir.
2. İlk kez geldiysen seçili dil tarayıcının dilidir (Eğitim Evi o dili destekliyorsa); desteklenmiyorsa Türkçe.
3. Bir dile bas. Liste kapanır, kısa ileti çıkar: **"English seçildi · %82 çevrildi"** (sağdan sola dilde
   **"العربية seçildi · %41 çevrildi · sayfa sağdan sola"**). Sayfa o dille yeniden çizilir, düğmede yeni kod yazar.
4. Seçim bu tarayıcıda saklanır; bir dahaki gelişinde aynı dille açılır.
5. Sitenin düz sayfaları (sayfa bulunamadı, okul bulunamadı, indir) da tarayıcıda seçili dile göre açılır
   ([Bulunamadı sayfaları](../acilis-sayfasi/bulunamadi-sayfalari.md), [İndir sayfası](../uygulama/indir-sayfasi.md)).
   Aydınlatma metni ve kullanım koşulları her dilde Türkçe kalır ([Neler çevrilir](ceviri-kapsami.md)).

**Tasarımda (Tasarım 1 önizlemesi):** tam çeviri yok; yalnız İngilizce seçilince birkaç yazı değişir (menü adları, sayfa başlığı,
açılış sayfasının şeridi, bölüm başlıkları ("What's inside?" gibi) ve alt bilgisi, kahraman başlığı "Homework, grades, attendance
and bus in one place.", giriş ekranının şeridi ve "Log in" / "Sign up" sekmeleri, arama kutusunun "Search" yazısı). Almanca ve Arapça seçilince yazılar değişmez; Arapçada yalnız
sayfa yönü döner. Bu, kullanıcının 2 Ekim'deki "birkaç kelime belli etsin yeter" sözüne göre yapılmış bir gösterimdir; asıl
tasarımda bütün arayüz çevrilir ([Hazır diller ve İngilizce ön çeviri](hazir-diller-ve-on-ceviri.md)).

### Oturumdaki herkes

Öğrenci, veli, öğretmen, çalışan, müdür, servisçi ve eğitmen için aynı:

1. Üst şeritte **"TR ▾"**ye bas; yukarıdaki liste açılır.
2. Dili seç. İleti çıkar, sayfa yeniden çizilir; bulunduğun sayfada ve kaydırdığın yerde kalırsın.
3. Seçim **hesabına** yazılır ve tarayıcıda da saklanır: başka bir cihazdan girince aynı dil gelir.
4. Aynı ayarı Ayarlar'dan da değiştirebilirsin: **"Görünüm ve dil"** → **"Dil"** satırında şu anki dil (ör. "Türkçe") ve
   **"Değiştir"**. Açılan pencerenin adı **"Dil"**; seçenekler **"Türkçe"** ve **"English"**; altta not **"Menüler, düğmeler ve
   bildirimler bu dilde olur. Öğretmenlerin yazdığı ödev ve mesajlar çevrilmez."**; düğme **"Kaydet"**. Kaydedince ileti
   **"Dil: English."**
5. E-postaların ve bildirimlerin de bu dilde gelir ([Neler çevrilir](ceviri-kapsami.md)).

**Tasarımda (Tasarım 1 önizlemesi):** Ayarlar'daki "Dil" penceresinde yalnız iki dil var, üst şeritteki listede dört; önizlemede
ikisi birbirine bağlı değil (Ayarlar'da seçilen dil şeridi değiştirmez). Tanıma göre ikisi aynı ayardır, hesapta tek bir dil
tercihi saklanır.

### Veli

Velide her çocuk ayrı oturumdur ([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)). Dil tercihi
oturuma değil **hesaba** (kişiye) bağlıdır: tanım "seçim hesapta saklanır" diyor, 3 Ekim kararı da "hesap = kişi, oturum = rol".
Bu yüzden bir çocuğun oturumundan öbürüne geçince dil değişmez. Öğrencinin bildiriminin sana gelen kopyası da senin dilindedir
([Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md)).

### Yönetici ve destek

1. Sitede ve oturumlarda herkes gibi seçersin.
2. Panel ekranları da seçtiğin dille açılır: düz metin kararının dayandığı mantık denetimi (madde 24) yöneticinin de dil seçtiğini
   ve yönetim panelinin o dille açıldığını varsayar. Ama Tasarım 1'de panellerin şeridinde ("Yönetim", "Destek paneli", "Çeviri")
   dil seçici yok; şeritte yalnız işaret, etiket, tema düğmesi, adın ve "Siteye dön" var. Dili değiştirmek için siteye dönersin;
   panel şeridine de seçici konup konmayacağı açık ([Paneller](../yonetim/paneller.md)).
3. Yönetici, listedeki oranların geldiği yeri yönetir: [Çeviri paneli](ceviri-paneli.md).

### Çevirmen

Herkes gibi seçersin. Çeviri panelinde bir hücre doldurdukça o dilin oranı artar; listedeki "%… çevrildi" ve ilerleme çubuğu bu
oranı gösterir ([Çeviri paneli](ceviri-paneli.md), [Çevirmen rolü](cevirmen-rolu.md)).

## Kurallar ve sınırlar

- **Biçim:** dil kodu + aşağı ok ("TR ▾"); "tr-" gibi tire yok, bayrak yok. Bayrak konmamasının nedeni: dil ülke değildir, Arapça
  tek bir ülkenin dili değil. Kullanıcı "ülke kodu" dedi; düğmede dil kodu kullanılır (TR, AR, KO gibi; İngilizce için bir alttaki
  madde) ve bu kullanıcıya açıklandı.
- **İngilizcenin kodu:** tanımda "EN"; Tasarım 1'de kullanıcının 2 Ekim sözüne ("değişince eng yazsın") göre **"ENG"**. Öbür diller
  iki harf (TR, DE, AR). Kullanıcının son sözü "ENG" olduğu için tasarım "ENG"dir.
- **Dil adları:** listede her dil kendi adıyla yazılır (English, Deutsch, العربية, 한국어), Türkçe adıyla değil.
- **Oran:** o dile çevrilmiş arayüz metinlerinin yüzdesi; [Çeviri paneli](ceviri-paneli.md)'ndeki dolu hücrelerden hesaplanır.
  Tanımdaki "(yarım)" rozetinin eşiği (%X) belirlenmedi.
- **Eksik çeviri:** çevrilmemiş her yazı Türkçe görünür; oranı düşük bir dilde sayfa karışık görünebilir.
- **İlk açılış:** tarayıcının dili, Eğitim Evi o dili destekliyorsa; yoksa Türkçe.
- **Saklama:** girişliyken hesapta (kişisel ayar), her zaman tarayıcıda. Tarayıcıdaki seçimle hesaptaki farklıysa hangisinin
  geçerli olacağı tanımda yazmıyor; bugünkü tema seçiminde girişte hesaptaki uygulanıyor
  ([Görünüm ve dil](../ayarlar/gorunum-ve-dil.md#kurallar-ve-sınırlar)).
- **Girişsiz sayfalar:** açılış, giriş, kayıt ve eğitim içeriklerinde de çalışır; düz sayfalar (404, indir, okul bulunamadı)
  tarayıcıda seçili dile göre.
- **Hukuki metinler:** hangi dil seçilirse seçilsin Türkçe gösterilir ([Neler çevrilir](ceviri-kapsami.md)).
- **Sayfanın dili ve yönü:** seçilen dil sayfanın `lang` özelliğine yazılır; sağdan sola dilde sayfa `dir="rtl"` olur
  ([Sağdan sola diller](sagdan-sola.md)).
- **KVKK:** dil tercihi hesapta saklanan kişisel bir ayardır; kodlanırken aydınlatma metnine girmeli
  ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)) ve "Verilerimi indir" dosyasında yer almalı
  ([Verilerimi indir](../ayarlar/verilerimi-indir.md)).
- **Çelişki (Tasarım 1):** listenin altındaki "Çeviriye yardım etmek için: egitimevi.org/panel/translate" notu panel adresini
  herkese gösteriyor. Panel tanımında ise panel adresleri yetkisi olmayana bilinmeyen adresle aynı "bulunamadı" sayfasını verir ve
  herkese giden kodda "/panel" bağlantısı yazmaz; bağlantılar yalnız yetkiliye sunucudan gelir ([Gizli yönetim girişi](../yonetim/gizli-yonetim-girisi.md)).
  Kodlanırken notun kalıp kalmayacağı kullanıcıya sorulmalı.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Dil ve çeviri](README.md)):

- [Neler çevrilir, neler çevrilmez](ceviri-kapsami.md) — seçince nelerin değiştiği.
- [Sağdan sola diller](sagdan-sola.md) — Arapça seçilince sayfanın aynalanması.
- [Hazır diller ve İngilizce ön çeviri](hazir-diller-ve-on-ceviri.md) — listede hangi dillerin olduğu.
- [Çeviri paneli](ceviri-paneli.md) — oranların geldiği yer; [Dil ekleme ve .po](dil-ekleme-ve-po.md) — listeye dil ekleme.
- [Uygulamada dil](uygulamada-dil.md) — Android'deki seçici.

**İlgili:**

- [Görünüm ve dil](../ayarlar/gorunum-ve-dil.md), [Hesap ayarları sayfası](../ayarlar/hesap-ayarlari-sayfasi.md).
- [Üst şerit](../menu-ve-arama/ust-serit.md), [Profil menüsü](../menu-ve-arama/profil-menusu.md),
  [Üst şerit ve alt bilgi](../acilis-sayfasi/ust-serit-ve-alt-bilgi.md), [Açılış sayfası](../acilis-sayfasi/acilis.md).
- [Girişsiz izleme](../egitim-icerikleri/girissiz-izleme.md) — eğitim içeriklerinde de seçici.
- [Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md), [Kullanım koşulları](../kvkk-ve-gizlilik/kullanim-kosullari.md).

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı yerler:

- Ön yüz: üst şerit `public/index.html`'de ([public/KLASOR.md](../../public/KLASOR.md)); şeridin işleri
  [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md); Ayarlar kartları
  [public/js/parcalar/23-veli-ayarlar.md](../../public/js/parcalar/23-veli-ayarlar.md); girişte hesaptaki tercihin uygulanması
  [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md); düğme eylemleri
  [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md). Tarayıcıda saklama için örnek, bugünkü tema seçimi:
  [public/js/tema.md](../../public/js/tema.md) (`ee_tema`). Düz sayfaların şeridi: [public/js/belge.md](../../public/js/belge.md).
- Sunucu: hesaptaki tercih bugünkü tema gibi `POST /api/profile` ile yazılır ([sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md));
  yeni sütun şemaya ([sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Tasarım 1 önizlemesinde liste `DILLER` dizisinden (`[kod, ad, görünen kod, oran, yön]`) çizilir; girişsiz sayfalardaki düğme aynı
  listeyi açar ve seçim oturumdaki şeritteki seçiciyle ortaktır.
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) (bugün dil bölümü yok; kodlanınca eklenecek).

## Sık sorulanlar

- **Site İngilizce olabilir mi?** Bugün hayır, yalnız Türkçe. Tasarımda üstteki "TR ▾" ile dil seçersin.
- **Neden bayrak yok?** Dil ülke değil; Arapça gibi diller birçok ülkede konuşulur. Düğmede dilin kodu, listede kendi adı yazar.
- **Seçtiğim dil telefonumda da geçerli mi?** Giriş yaptıysan evet: seçim hesabına yazılır.
- **Bazı yazılar hâlâ Türkçe, neden?** O dile henüz çevrilmemişler; çevrilmemiş yazı Türkçe görünür. Listede dilin yanındaki
  oran ne kadarının çevrildiğini gösterir.
- **Öğretmenimin yazdığı ödev de çevrilir mi?** Hayır; insanların yazdıkları çevrilmez ([Neler çevrilir](ceviri-kapsami.md)).

## Sırada

- Çok dil işi (sıradaki işler listesinde 22. iş): c() altyapısı, çeviri kataloğu, dil seçici, sağdan sola. Kullanıcı 29 Eylül'de
  "evet altyapı önce olsun" dedi; yapılış sırası önerisinde çeviri altyapısı birinci iş.
- Üst şerit sadeleştirme: oturumdaki şeridin sağında dil ve tema kalır (kullanıcı 30 Eylül: "header da sadece dil koyu açık yetmezmi").
- Kodlanmadan önce netleşecekler: "(yarım)" rozetinin eşiği; tarayıcıdaki ve hesaptaki seçimden hangisinin öncelikli olduğu;
  panel şeridine de seçici konup konmayacağı; listedeki "/panel/translate" notu; Ayarlar'daki "Dil" penceresinin şeritteki
  listeyle aynı dilleri göstermesi.
