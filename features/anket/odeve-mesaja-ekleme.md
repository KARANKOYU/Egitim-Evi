# Anketler · Anketi ödeve ya da mesaja ekleme

**Durum:** Tasarlandı — henüz kodda yok

Hazırladığın anketi ayrı yayınlamak yerine bir ödevin ya da bir mesajın içine eklemek; anketin hedefi ödevin öğrencileri ya da mesajın
alıcıları olur.

## Ne işe yarar

Kullanıcı 28 Eylül'de anketi "bi ek olarak bir ödeve, mesaja koyma iyi olur mu" diye sordu. Tanıma önce şöyle işlendi: "mesajda
alıcılar, ödevde ödevin öğrencileri anketin hedefi olur; öğretmen kendi ödevine toplu mesaj yetkisi olmadan ekleyebilir. Kartta
'Anketi doldur (3/10)'." Kullanıcının kararı (aynı akşam) bunu korudu: taslak "bir mesaja/ödeve eklenir (hedef = alıcılar/ödevin
öğrencileri)". Böylece öğretmen bir ödevle birlikte kısa bir değerlendirme anketi, bir veli mesajıyla birlikte gezi izni gibi bir form
gönderebilir; ayrıca rol grubu ya da sınıf seçmesi gerekmez, kendi ödevine eklerken toplu mesaj yetkisi de gerekmez (mesaja eklemede
yetkinin ne olacağı tanımda yazılmadı). (Tanımdaki ayrı "veli onay formu" önerisi
— Katılır/Katılmaz + not — onay bekliyor; bugünkü düzenle bir mesaja eklenen anket bu işi görür.)

## Nereden açılır

- **Anket oluştur** sayfasının sonundaki "Yayınla" kutusunda **"Ödeve ekle"** ve **"Mesaja ekle"** ([Anket oluştur](anket-olustur.md)).
- **"Yeni ödev"** ve **"Ödevi düzenle"** penceresinde **"Anket:"** satırı → **"Anket ekle"** ([Ödev verme](../odev/odev-verme.md),
  [Ödevi düzenleme ve silme](../odev/odevi-duzenleme-ve-silme.md)).
- **"Yeni mesaj"** penceresinde (öğretmende) **"Anket:"** satırı → **"Anket ekle"** ([Yeni mesaj ve alıcı seçimi](../mesaj/yeni-mesaj.md)).

(Tasarım 1 önizlemesi, öğretmen.)

## Adım adım

### Öğretmen

**Düzenleyiciden eklemek**

1. "Anket oluştur"da anketini kur; "Yayınla" kutusunda **"Ödeve ekle"**ye bas.
2. Anketin adı boşsa **"Taslağı adıyla kaydetmek için anketin adını yaz."** Ad varsa anket sessizce taslak olarak kaydedilir ve
   **"Yeni ödev"** penceresi açılır; **"Anket:"** satırında anketin adı bir çip olarak durur (anket simgesiyle, yanında kaldırmak için
   **"×"**).
3. **"Mesaja ekle"** aynı biçimde çalışır: anket taslak olarak kaydedilir, **"Yeni mesaj"** penceresi (ekleri boş) açılır, "Anket:"
   satırında çip.

**Ödev penceresinden eklemek**

4. "Yeni ödev" (ya da "Ödevi düzenle") penceresinde **"Anket:"** satırındaki **"Anket ekle"**ye bas. Altında anketlerinin listesi açılır:
   her satırda kalın ad (adsızsa **"Adsız anket"**), altında **"taslak · 3 soru"** ya da **"yayında · 2 soru"**. Hiç anketin yoksa
   **"Henüz anketin yok; Anketler sayfasında Anket oluştur."**
5. Bir ankete basınca liste kapanır, anket çip olur. Çipteki **"×"** anketi ödevden kaldırır; yeniden "Anket ekle" görünür.
6. Ödevi ver (ya da kaydet). Anketin hedefi ödevin öğrencileridir (tanım).
7. Ödevin kontrol ekranında eklerin başında anket satırı durur: **"Anket · <anketin adı>"** ve sağında **"taslak · 3 soru"** ya da
   **"11 yanıt"**. Basınca anketin penceresi açılır: taslaksa **"Taslak · 3 soru · kaydedildi: 3 Ekim 19:40"**, **"Bu anket henüz
   yayınlanmadı; Anket oluştur sayfasında düzenleyip yayınlarsın."**, **"Düzenle"** ve **"Kapat"**; yayındaysa sonuç penceresi
   ([Sonuçlar](sonuclar.md#öğretmen)).

**Mesaj penceresinden eklemek**

8. "Yeni mesaj" penceresinde (alıcı, başlık ve metnin altında) **"Anket:"** → **"Anket ekle"** → aynı liste → çip.
9. **"Gönder"**: mesaj gidince kısa iletinin sonuna **" · anket: <anketin adı>"** eklenir (ajandaya ve hatırlatıcıya ekleme seçildiyse
   onlar da aynı iletide sayılır; [Ajandaya ve hatırlatıcıya ekle](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md)). Anketin hedefi mesajın
   alıcılarıdır (tanım).

### Öğrenci

Ödevine anket eklendiyse ödevin içinden, mesajına eklendiyse mesajın içinden doldurur ([Çok sorulu anketi doldurma](anket-doldurma.md)).
Tanımdaki örnek kart metni **"Anketi doldur (3/10)"**. Tasarım 1 önizlemesinde öğrencinin ödev penceresinde ve mesajında anket satırı
çizilmedi; ekranın düzeni kodlamadan önce belirlenecek.

### Veli

Velilere giden bir mesaja eklenen anketi (ör. gezi izni) mesajın içinden doldurur. Ödeve eklenen anketin hedefi ödevin öğrencileridir;
bugünkü anket kuralında öğrencilere giden anket velilerine de gider, ama ödeve eklenen ankette velinin de yanıtlayıp yanıtlamayacağı
tanımda yazılmadı.

### Müdür

Önizlemede "Anket:" satırı yalnız öğretmenin "Yeni mesaj" penceresinde var; müdürün mesaj penceresinde yok. Müdür ödev vermez
(kullanıcının kararı: ödev öğretmenin işi). Tanım "taslak bir mesaja/ödeve eklenir" diyor ve rol ayırmıyor; müdürün mesajına anket
ekleyip ekleyemeyeceği kodlamadan önce netleşmeli.

### Çalışan

Rolünde "Ödev verir" olan çalışan kendi ödevine öğretmen gibi anket ekler (tanımın "toplu mesaj yetkisi olmadan" kuralı ödev için).
Mesaja anket eklemenin çalışanda nasıl olacağı önizlemede çizilmedi (orada yalnız öğretmen rolünde var). Rolsüz çalışan ekleyemez.

## Kurallar ve sınırlar

- **Hedef:** ödevde ödevin öğrencileri; mesajda mesajın alıcıları. Ayrıca "Kimler:" seçilmez.
- **Yetki:** öğretmen kendi ödevine anketi toplu mesaj yetkisi olmadan ekleyebilir (tanım).
- **Tek anket:** önizlemede bir ödeve ya da mesaja bir anket eklenir (tek çip).
- **Ad zorunlu:** düzenleyiciden "Ödeve ekle" / "Mesaja ekle" anketi taslak olarak kaydeder; taslak için ad gerekir.
- **Tanımda açık kalanlar (kodlamadan önce belirlenmeli):**
  - ödeve ya da mesaja eklenen taslak anketin ne zaman yayına gireceği (ödev verilince / mesaj gidince mi) ve "son gün"ünün ödevin son
    teslimi mi olacağı — önizlemede ekli anket kontrol ekranında "taslak" olarak kalıyor;
  - zaten yayında olan bir anket ödeve eklenince hedeflerin nasıl birleşeceği (önizlemedeki listede "yayında" anketler de seçilebiliyor);
  - ödev ya da mesaj silinince eklenen anketin ne olacağı;
  - ileri tarihli gönderilen mesaja eklenen anketin ne zaman açılacağı;
  - "Anketi doldur (3/10)" sayısının anlamı (yanıtlanan soru / toplam soru olduğu varsayılıyor).

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Anketler](README.md)):

- [Anket oluştur](anket-olustur.md) — "Ödeve ekle", "Mesaja ekle" düğmeleri.
- [Çok sorulu anketi doldurma](anket-doldurma.md) — öğrencinin ve velinin doldurması.
- [Anketin kimlere gittiği](kimlere-gider.md) — hedefin bağımsız ankette nasıl seçildiği.
- [Sonuçlar, kim oy verdi, bitirme ve silme](sonuclar.md).

**İlgili:**

- [Ödev verme](../odev/odev-verme.md), [Ödevi düzenleme ve silme](../odev/odevi-duzenleme-ve-silme.md),
  [Sonuçlandırma](../odev/sonuclandirma.md) (kontrol ekranındaki anket satırı).
- [Yeni mesaj ve alıcı seçimi](../mesaj/yeni-mesaj.md), [Ajandaya ve hatırlatıcıya ekle](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md),
  [Alıcıların dosya yüklemesi](../mesaj/alicilarin-dosya-yuklemesi.md) (imza yerine onay formu olarak anket).
- [Soru bankası](../quiz/soru-bankasi.md) — benzer "sakla, sonra kullan" düzeni.

## Kod tarafı

Bugün kodda yok. Kodlanınca dokunacağı bugünkü parçalar:

- Ön yüz: [public/js/parcalar/11-ogretmen-odev.md](../../public/js/parcalar/11-ogretmen-odev.md) ("Yeni ödev" / "Ödevi düzenle" penceresi ve
  kontrol ekranı), [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) ("Yeni mesaj"),
  [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) (öğrencinin ödev penceresi),
  [public/js/parcalar/19b-anketler.md](../../public/js/parcalar/19b-anketler.md).
- Sunucu: [sunucu/bolumler/anket.md](../../sunucu/bolumler/anket.md) (bugün hedef yalnız okul/rol/sınıf; ödev ve mesaj hedefi yeni),
  [sunucu/bolumler/odev.md](../../sunucu/bolumler/odev.md), [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md).
- Önizlemedeki karşılığı: Tasarım 1 önizlemesinde öğretmenin "Yeni ödev", ödev kontrol ekranı ve "Yeni mesaj" pencereleri.

## Sık sorulanlar

- **Ödeve anket eklemek için toplu mesaj yetkim olmalı mı?** Hayır (tanım); ödevin öğrencileri anketin hedefidir.
- **Anketi hem ayrı yayınlayıp hem ödeve ekleyebilir miyim?** Önizlemede yayındaki anket de listede çıkıyor; hedeflerin nasıl birleşeceği
  henüz kararlaştırılmadı.
- **Gezi izni için velilerden onay almak istiyorum.** Bir anket kur (ör. "Katılacak mı?" zorunlu tek seçim + "Alerjisi varsa yaz"),
  "Mesaja ekle" ile velilere giden mesaja koy.
- **Ödevi sildim; anket ne olur?** Kararlaştırılmadı.

## Sırada

- Anket düzenleyici (iş 13): ödeve ve mesaja ek olarak anket; hedef ödevin öğrencileri ya da mesajın alıcıları.
- "Veli onay formu" önerisi (Katılır/Katılmaz + not, liste yazdır/Excel) onay bekliyor.
- Android yerel uygulama: ödevdeki ve mesajdaki anket.
