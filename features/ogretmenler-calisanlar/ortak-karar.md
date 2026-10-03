# Öğretmenler ve çalışanlar · Ortak karar (müdürü müdürlükten çıkarma)

**Durum:** Tasarlandı — henüz kodda yok

Okulun bir müdürünü müdürlükten çıkarmanın okul içindeki tek yolu: bir müdür ister, çıkarılacak kişi dışında bir başka müdür
onaylar; onay gelince uygulanır.

## Ne işe yarar

Okulda birden çok müdür eşit ve tam yetkili olduğu için hiçbiri öbürünü tek başına çıkaramamalı. Kullanıcının kararı (29 Eylül,
mantık denetimi 4): "müdür çıkarmak için bir destek/yönetici olsun ya da 'müdür çıkar'da iki müdür de onay verirse, yani ortak
kararlar." Böylece:

- Bir müdürü **yönetici ya da destek** panelden doğrudan çıkarır, **ya da**
- müdürler **ortak karar** verir: isteyen müdür + çıkarılan hariç **en az bir başka müdürün** onayı.

Müdür atama ise onaysız kalır ([Müdür yapma](mudur-yapma.md)). Ortak karar düzeneği genel yazılır: ileride başka kritik işlerde de
kullanılabilir.

## Nereden açılır

Tasarımda: **"Çalışanlar"** sayfasının üstündeki **"Müdürler"** bölümünde öbür müdürün satırındaki **"Müdürlükten çıkar"**;
bekleyen istekler hemen altındaki **"Bekleyen ortak kararlar"** bölümünde ([Birden çok müdür](birden-cok-mudur.md)). Öbür müdürlere
bildirim de gider.

## Adım adım

### Müdür — isteği başlatan

Tasarımda (Tasarım 1 önizlemesi):

1. **"Müdürler"** bölümünde çıkarılacak müdürün satırında **"Müdürlükten çıkar"**a bas (kendi satırında bu düğme yoktur).
2. Pencere **"Müdürlükten çıkar"**: "**Kerem Uçar** müdürlükten çıkarılsın mı? Bu bir ortak karardır: istek, öbür müdürlerden biri
   onaylayınca uygulanır. Kerem Uçar okulda çalışan olarak kalır."
3. İstersen **"Neden"** yaz (isteğe bağlı, en çok 200 karakter; yer tutucu "isteğe bağlı").
4. **"İstek gönder"** (kırmızı) ya da **"Vazgeç"**. Gönderince: "İstek gönderildi; öbür müdürün onayı bekleniyor." İşlem kaydına
   "ortak karar istedi — Kerem Uçar müdürlükten çıkarılsın" düşer.
5. **"Bekleyen ortak kararlar"**da satır: "Kerem Uçar müdürlükten çıkarılsın", altında "İsteyen: <sen> · 1 Ekim 2026 · <neden>".
   Senin isteğinde sağda **"Öbür müdürün onayı bekleniyor"** etiketi ve **"İsteği geri al"**.
6. **"İsteği geri al"**: onay kutusu "İstek geri alınsın mı?" — "Kerem Uçar müdür olarak kalır." — **"Vazgeç"** / **"Geri al"**.
   Sonra "İstek geri alındı."
7. Hedef müdürün satırında, karar beklerken **"Ortak karar bekliyor"** etiketi durur (çıkarma düğmesi yerine).

### Müdür — onaylayan ya da reddeden

1. Bildirim gelir; **"Çalışanlar"** → **"Bekleyen ortak kararlar"**.
2. Başka bir müdürün isteğinde **"Reddet"** ve **"Onayla"** vardır.
3. **"Onayla"**: onay kutusu "Kerem Uçar müdürlükten çıkarılsın mı?" — "İki müdür onayladı sayılır; Kerem Uçar okulda kalır ama müdür
   yetkileri kalkar. Kendisine bildirim gider." — **"Vazgeç"** / **"Onayla"**. Onaylayınca: "Kerem Uçar müdürlükten çıkarıldı."
   Kişinin müdür oturumu kalkar, Müdürler listesinden düşer, Çalışanlar listesinde kalır. İşlem kaydına "ortak kararı onayladı —
   Kerem Uçar müdürlükten çıkarıldı · isteyen <isteyen müdür>". Bu arada okulda tek müdür kalmışsa: "Son müdür çıkarılamaz."
4. **"Reddet"**: onay kutusu "Karar reddedilsin mi?" — "Kerem Uçar müdür olarak kalır; isteyen müdüre (<isteyen müdür>) bildirim
   gider." — **"Vazgeç"** / **"Reddet"**. Sonra "Reddedildi; Kerem Uçar müdür olarak kalır." (işlem kaydına da yazılır).
5. Bekleyen karar yoksa bölümde "Bekleyen karar yok."

Tanımdaki kurallar (önizlemenin gösterdiğinden fazlası):

- Onaylayan müdür **o an doğrulama kodu** girer (önizlemede "Onayla"dan sonra kod sorulmuyor; tanım geçerli —
  [Önemli işlerde çift doğrulama](../egitim-yili/cift-dogrulama.md)).
- Karar **7 gün** içinde onaylanmazsa **düşer**.
- Müdürlüğü **7 günden yeni** olan kişi ortak karar başlatamaz ve onaylayamaz.

### Müdür — çıkarılmak istenen

Tasarımda: hakkında karar başlatılınca **bildirim** alır. İtiraz etmek isterse **destek talebi** açar ([Destek sayfası](../destek/destek-sayfasi.md)).
Karar onaylanınca müdür yetkileri kalkar, okulda **çalışan olarak kalır** (Tasarım 1'in penceresindeki metin). Karar beklerken öbür
müdürler ayrılır da okulda yalnız o kalırsa (son müdür) karar düşer ([Birden çok müdür](birden-cok-mudur.md)).

### Yönetici ve destek

Ortak kararı beklemeden müdürü **panelden doğrudan** çıkarır (son müdür hariç) ([Okul ekle / düzenle](../yonetim/okul-ekle-duzenle.md)).
Okulda çıkarılacak kişiden başka **yalnız isteyen müdür** varsa (iki müdürlü okul) ortak karar kurulamaz: o zaman müdürü yalnız
yönetici ya da destek çıkarabilir ve bu **ekranda söylenir**.

## Kurallar ve sınırlar

- **Kimin onayı:** isteyen müdür + çıkarılan hariç en az bir başka müdür. Çıkarılan kişinin onayı sorulmaz.
- **İki müdürlü okul:** çıkarılandan başka yalnız isteyen varsa okul içinden çıkarılamaz; yönetici/destek gerekir. (Tasarım 1
  önizlemesi iki müdür varken de "Müdürlükten çıkar"ı gösteriyor; tanıma göre bu durumda düğme yerine bu açıklama çıkmalı.)
- **Son müdür** hiçbir yolla çıkarılamaz; bekleyen karar varken hedef son müdür kalırsa karar düşer.
- **Süre:** onaylanmayan karar 7 günde düşer.
- **Yeni müdür:** müdürlüğü 7 günden yeni olan başlatamaz, onaylayamaz.
- **Doğrulama:** onaylayan o an doğrulama kodu girer.
- **Bildirimler:** öbür müdürlere (karar başlatılınca), çıkarılacak müdüre (karar başlatılınca ve uygulanınca), isteyen müdüre
  (reddedilince). Metinler tanımda yazılı değil; önizlemedeki pencere metinleri yukarıda.
- **Role verilemez:** ortak kararı başlatmak ya da onaylamak bir özel role verilemez; yalnız müdürler yapar.
- **Çıkarılan kişi:** müdürlüğü gider; okuldaki çalışan satırı, yetişkin hesabı ve öbür okulları durur.

## Kardeşler ve ilgili

**Kardeşler:** [Birden çok müdür](birden-cok-mudur.md) · [Müdür yapma](mudur-yapma.md) · [Öğretmenler ve çalışanlar listesi](liste.md) ·
[Okuldan çıkarma](okuldan-cikarma.md).

**İlgili:** [Önemli işlerde çift doğrulama](../egitim-yili/cift-dogrulama.md), [Okul ekle / düzenle](../yonetim/okul-ekle-duzenle.md),
[Müdürler](../yonetim/mudurler.md), [Destek sayfası](../destek/destek-sayfasi.md), [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md),
[Bildirim metinleri](../bildirim/bildirim-metinleri.md).

## Kod tarafı

Henüz kodda yok. Bugün okulun tek müdürü olduğu için müdürü yalnız yönetici kaldırır:
[sunucu/bolumler/yonetici.md](../../sunucu/bolumler/yonetici.md) (`principal-delete`),
[public/js/yonetim/09-yonetici.md](../../public/js/yonetim/09-yonetici.md) ("Müdürler" → "Hesabı sil"). Ortak karar için yeni tablo ve
uçlar (karar, onay, süre, düşme) kodlamada eklenecek; işlem kaydı [sunucu/bolumler/islem-kaydi.md](../../sunucu/bolumler/islem-kaydi.md).

## Sık sorulanlar

- **Bir müdür öbürünü tek başına çıkarabilir mi?** Hayır; ya bir başka müdür onaylar ya da yönetici/destek çıkarır.
- **Hakkımda çıkarma isteği açıldı, haksız buluyorum.** Bildirimden haberin olur; destek talebiyle itiraz edersin. Karar 7 gün içinde
  onaylanmazsa kendiliğinden düşer.
- **Çıkarılınca hesabım silinir mi?** Hayır. Yalnız müdür yetkilerin kalkar; okulda çalışan olarak kalırsın.

## Sırada

- Paneller (iş 5): ortak karar düzeneği (istek, onay, ret, geri alma, 7 gün, doğrulama kodu, bildirimler), iki müdürlü okulda
  "yalnız yönetici/destek" açıklaması.
