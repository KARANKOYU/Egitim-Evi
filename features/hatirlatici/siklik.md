# Hatırlatıcılar · Sıklık (bir kez, her gün, her hafta, her ay)

**Durum:** Kodda var; tasarımda ek olarak sıklık seçenekleri çip olarak "Bir kez · Her gün · Haftanın günleri · Ayda bir", günler
"Pzt … Paz" çipleri, pencerede canlı "Sıradaki hatırlatma" satırı ve özetlerde uzun gün adları ("her Pazartesi, Çarşamba 07:30").

Hatırlatıcının ne zaman çalacağını belirleyen dört seçenek ve her birinin nasıl hesaplandığı.

## Ne işe yarar

Bazı şeyler bir kez hatırlatılır (kütüphane kitabının iadesi), bazıları her gün (kitap okuma), bazıları haftanın belli günlerinde
(beden eğitimi dersi), bazıları ayda bir (servis ücreti). Kullanıcı 26 Eylül'de böyle istedi: "her gün şu saatte", takvimden gün ve
saat, her hafta yalnız seçilen günler (onun örneği: pazartesi ve çarşamba), "ayda 1 gibi".

## Nereden açılır

- Hatırlatıcı penceresinde (**"Yeni hatırlatıcı"** ya da **"Hatırlatıcıyı düzenle"**) **"Ne sıklıkla?"** satırı
  ([Kurma, düzenleme ve silme](hatirlatici-kurma.md)).
- **Tasarımda:** **"Hatırlatıcı ekle"** ya da **"Hatırlatıcı"** penceresinde **"Sıklık:"** satırı.

## Adım adım

### Dört sıklık (herkes, bugünkü site)

1. Pencerede **"Ne sıklıkla?"** altındaki dört düğmeden birini seç (seçili olan ana renkle dolar). Yeni pencerede **"Her hafta"**
   seçili gelir.
2. Seçimine göre altında tek bir alan görünür; **"Saat"** her sıklıkta vardır:

| Seçenek | Görünen alan | Ne zaman çalar | Satırdaki özet | Örnek |
|---|---|---|---|---|
| **"Bir kez"** | **"Gün"** (takvim kutusu; bugünden öncesi seçilemez) | O gün o saatte bir kez; gönderilince kapanır ve satır "Hatırlatıldı" olur | "30 Eylül 2026, Çarşamba · 15:00" | "Kütüphane kitabını iade et" |
| **"Her gün"** | yok | Her gün o saatte (hafta sonu ve tatil dahil) | "Her gün · 21:00" | "Kitap oku" |
| **"Her hafta"** | **"Hangi günler?"** — "Pzt" "Sal" "Çar" "Per" "Cum" "Cmt" "Paz" kutucukları | Seçtiğin her gün o saatte | "Her hafta Pzt, Çar · 07:30" | "Beden eğitimi kıyafeti" |
| **"Her ay"** | **"Ayın kaçı?"** — 1–31 listesi, altında "Ay o kadar çekmiyorsa ayın son günü hatırlatılır." | Her ayın o gününde o saatte; ay o kadar çekmiyorsa ayın son gününde | "Her ayın 31. günü · 10:00" | "Servis ücreti" |

3. **"Saat"**i seç (yeni pencerede 08:00). Saat her zaman Türkiye saatidir.
4. **"Kaydet"**. İleti ilk hatırlatmanın zamanını söyler: "Hatırlatıcı kuruldu. İlk hatırlatma: 05.10.2026 07:30."

### Hesap nasıl yapılır

- **Türkiye saati:** "08:30" her zaman Türkiye'de 08:30'dur (UTC+3, yaz saati yok); sunucu başka bir saat diliminde çalışsa da kayma
  olmaz.
- **İlk hatırlatma:** bugünden başlayarak ileriye bakılır; sıklığa uyan ilk gündeki saat, şu andan sonraysa ilk hatırlatmadır.
  Kurduğun an bugünün saati geçmişse ilk hatırlatma bir sonraki uygun gündedir (ör. 10:00'da "Her gün · 08:30" kurarsan ilki yarın
  08:30). Hatırlatıcı kurulmadan önceki bir an için hiç bildirim gelmez.
- **Her hafta:** günler 1 Pazartesi … 7 Pazar diye tutulur; aynı gün iki kez sayılmaz, özette gün sırasıyla yazılır ("Pzt, Çar").
- **Her ay, kısa aylar:** ayın 31'i seçiliyse 30 çeken ayda 30'unda, şubatta 28'inde (artık yılda 29'unda) çalar; 29 ve 30 da şubatta
  ayın son gününe düşer. Ay atlanmaz.
- **Gece yarısı:** 23:50 hatırlatması, sunucu dakikalık denetimini 00:05'te yapsa da gider (dünün anına da bakılır).
- **Tatil ayrımı yok:** "Her gün" ve "Her hafta" resmî tatilde ve okul tatilinde de çalar; takvime bakılmaz.

### Öğrenci

"Her hafta Pzt, Çar · 07:30 — Beden eğitimi kıyafeti", "Her gün · 21:00 — Kitap oku". Ödevlerin son günü için ayrı bir otomatik
hatırlatma vardır ([Ödev hatırlatmaları](../odev/hatirlatmalar.md)).

### Veli

"Her ayın 1. günü · 10:00 — Servis ücreti", "Her ayın 5. günü · 09:00 — yemek ücreti" gibi aylık işler.

### Öğretmen, çalışan ve müdür

"Her hafta Cum · 16:00 — sınav kâğıtları", "bir kez — veli toplantısı". Ders saatleri için hatırlatıcı kurmana gerek yok: öğretmene
sabah günün dersleri kendiliğinden gelir ([Otomatik bildirimler](../bildirim/otomatik-bildirimler.md)).

### Servisçi ve yönetici

Aynı dört sıklık. Örnek: "bir kez — Araç muayenesi".

### Tasarımda (Tasarım 1 önizlemesi)

1. **"Sıklık:"** çipleri: **"Bir kez"** · **"Her gün"** · **"Haftanın günleri"** · **"Ayda bir"**. Yeni hatırlatıcıda "Bir kez"
   seçili, tarih bugün, saat 19:00 gelir. Çipe basınca alanlar hemen değişir:
   - "Bir kez" → **"Tarih"** (bugünden öncesi seçilemez) ve **"Saat"**;
   - "Her gün" → yalnız **"Saat"**;
   - "Haftanın günleri" → **"Pzt" "Sal" "Çar" "Per" "Cum" "Cmt" "Paz"** çipleri (basınca seçilir, yeniden basınca kalkar; yeni
     pencerede hiçbiri seçili değil) ve **"Saat"**;
   - "Ayda bir" → **"Ayın kaçı"** (1–31; yeni pencerede bugünün günü) ve **"Saat"**; kısa ayda ayın son günü.
2. Pencerede canlı satır her değişiklikte yenilenir: **"Sıradaki hatırlatma: 6 Ekim 2026 Salı 07:30"**; gün ya da tarih seçilmemişse
   **"Bu ayarla gelecek bir hatırlatma yok."**; hatırlatıcı kapalıysa **"Hatırlatıcı kapalı; bildirim gelmez."**
3. Özetler: "Bir kez · 1 Ekim Perşembe 20:00", "her gün 19:00", "her Pazartesi, Çarşamba 07:30", "her ayın 5'i · 09:00"; takvimde ve
   ajandada kısa adı: "bir kez", "her gün", "her Pazartesi", "her ayın 5'i" ([Takvimde ve ajandada](takvimde-ve-ajandada.md)).
4. Önizlemenin ilk taslak formunda bir de "Hafta içi her gün" seçeneği vardı; son tasarımda yok. Hafta içi için "Haftanın günleri"nde
   Pzt, Sal, Çar, Per ve Cum seçilir.
5. Uygulama tanımına göre Android uygulamasındaki Hatırlatıcılar ekranı da aynı dört sıklığı sunar (bir kez / her gün / haftanın
   günleri / ayda bir).

## Kurallar ve sınırlar

- **Seçenekler yalnız dört:** "Bir kez", "Her gün", "Her hafta", "Her ay". Başka bir değer "Ne sıklıkla hatırlatılacağını seç." alır.
- **Bir kez:** gün zorunlu ("Günü seç."), gün ve saat gelecekte olmalı ("Bu gün ve saat geçti; ileri bir zaman seç."). Gönderilince
  hatırlatıcı kapanır.
- **Her hafta:** en az bir gün ("Haftanın en az bir gününü seç."); 1–7 dışındaki değerler atılır, hepsi atılırsa aynı ileti.
- **Her ay:** gün 1–31 ("Ayın kaçında hatırlatılacağını seç (1-31).").
- **Saat:** "SS:DD"; bozuksa "Saati seç (ör. 08:30)."
- **Yalnız seçili sıklığın alanı kullanılır;** gizli alanlardaki değerler yok sayılır.
- **400 gün sınırı (kod okumasına göre):** "Sonraki" zamanı bugünden en çok 400 gün ileriye bakılarak bulunur. 400 günden daha ileri
  bir tarihe kurulan bir kezlik hatırlatıcı kurulur ama ileti "İlk hatırlatma" zamanını yazmaz ve satırı o güne 400 günden az kalana
  dek "Günü geçti" görünür; zamanı gelince yine gönderilir (bilinen açık).
- **"Gün" kutusunun en erken günü** cihazının tarihine göredir; asıl denetim sunucudadır.
- **Saat dilimi:** hesap Türkiye saatiyle; satırdaki "Sonraki: …" cihazının saat dilimiyle yazılır
  ([Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md)).

## Kardeşler ve ilgili

**Kardeşler:** [Kurma, düzenleme ve silme](hatirlatici-kurma.md) · [Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md) ·
[Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md) · [Hatırlatma bildirimi](hatirlatma-bildirimi.md) ·
[Takvimde ve ajandada](takvimde-ve-ajandada.md) · [Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md) ·
[Kimler görür ve saklama](kimler-gorur-ve-saklama.md).

**İlgili:** [Ödev hatırlatmaları](../odev/hatirlatmalar.md) (aynı dakikalık altyapı, kendi kuralları) ·
[Otomatik bildirimler](../bildirim/otomatik-bildirimler.md) · [Tatiller ve özel günler](../takvim/tatiller-ve-ozel-gunler.md) ·
[Android uygulaması](../uygulama/android-uygulamasi.md).

## Kod tarafı

- Zaman hesabı: [sunucu/yardimci/hatirlatici-zaman.md](../../sunucu/yardimci/hatirlatici-zaman.md) — `an` (Türkiye'de o gün o
  saat), `haftaGunu` (1 Pazartesi … 7 Pazar), `ayinSonGunu`, `gunUyar` (sıklığa göre o gün çalar mı), `sonraki` (400 gün), 
  `zamaniGeldi` (bugün ve dün).
- Doğrulama: [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md) (`SIKLIKLAR`, `dogrula`).
- Ön yüz: [public/js/parcalar/19h-hatirlaticilar.md](../../public/js/parcalar/19h-hatirlaticilar.md) — `HATIRLATICI_SIKLIK`,
  `HAFTA_KISA`, `hatirlaticiOzeti`, pencerede alanların gösterilip gizlenmesi; tarih biçimleri
  [public/js/parcalar/02-ikonlar.md](../../public/js/parcalar/02-ikonlar.md) (`tarihGun`, `tarihSaat`).
- Testler: [testler/test-hatirlatici-zaman.md](../../testler/test-hatirlatici-zaman.md) (Türkiye saati, hafta günü, ayın 31'i,
  şubat, gece yarısı), [testler/test-hatirlatici.md](../../testler/test-hatirlatici.md) (dört sıklığın kurulması ve sonraki an).
- Kayıt: `hatirlaticilar.siklik`, `tarih`, `saat`, `ay_gunu` ve `hatirlatici_gunleri`
  ([sunucu/veri/depo/hatirlaticilar.md](../../sunucu/veri/depo/hatirlaticilar.md)).

## Sık sorulanlar

- **Hafta içi her gün nasıl kurarım?** "Her hafta"yı seç, "Pzt", "Sal", "Çar", "Per", "Cum"u işaretle.
- **Ayın 31'ini seçtim; eylülde ne olur?** Eylül 30 çektiği için 30 Eylül'de çalar; şubatta 28'inde (artık yılda 29'unda).
- **Bayram tatilinde de çalar mı?** Evet; hatırlatıcılar tatile bakmaz. İstemiyorsan o süre için "Durdur"a bas
  ([Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md)).
- **Günde iki kez (sabah ve akşam) hatırlatma istiyorum.** Her hatırlatıcının tek saati var; iki ayrı hatırlatıcı kur.
- **Yurt dışındayım; hatırlatma hangi saatte gelir?** Türkiye saatiyle seçtiğin saatte. Satırdaki "Sonraki" ise telefonunun saatine
  çevrilmiş yazabilir.

## Sırada

- Arayüz önizlemesi (Tasarım 1): sıklık çipleri, gün çipleri, canlı "Sıradaki hatırlatma" satırı.
- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: ödev
  hatırlatmaları ve duyurudan gelen hatırlatıcılar aynı Türkiye saatli dakikalık hesabı kullanır.
- Android yerel uygulama (bütün roller): uygulamada aynı dört sıklık.
- Çok dil: sıklık adları ve gün kısaltmaları çeviri kataloğuna.
