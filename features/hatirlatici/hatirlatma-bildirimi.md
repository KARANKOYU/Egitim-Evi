# Hatırlatıcılar · Hatırlatma bildirimi

**Durum:** Kodda var; tasarımda ek olarak her hatırlatıcıda "Telefona bildirim" anahtarı, Android uygulamasında Hatırlatıcılar ekranı
(bildirime dokununca açılır), velide hatırlatmanın kurulduğu çocuk oturumuna gelmesi ve duyurudan gelen hatırlatıcıların da aynı
bildirimle gelmesi.

Hatırlatıcının zamanı gelince sana giden "Hatırlatma: …" bildirimi: ne zaman, nereye ve kime gider.

## Ne işe yarar

Hatırlatıcının asıl işi budur: sen unutsan da zamanı gelince Eğitim Evi sana haber verir. Bildirim zile düşer; telefon bildirimini
açtıysan Eğitim Evi kapalıyken bile telefonuna gelir.

## Nereden açılır

- Bu bildirim kendiliğinden gelir. Üst şeritteki **zil** ([Bildirim paneli](../bildirim/bildirim-paneli.md)), telefon bildirimi
  açıksa telefonun bildirim alanı ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).
- Bildirime basınca **Hatırlatıcılar** sayfası açılır (adres `#/hatirlaticilar`).
- Telefon bildirimini açmak: Ayarlar'daki telefon bildirimi kartı (tasarımda Hesap ayarları → Bildirimler)
  ([Bildirim ayarları](../ayarlar/bildirim-ayarlari.md)).

## Adım adım

### Herkes (bugünkü site)

1. Sunucu her dakika zamanı gelmiş açık hatırlatıcılara bakar. Hatırlatıcının saati geldiğinde (en geç bir dakika içinde) sunucu
   senin bildirimlerine şunu yazar:
   - açıklama varsa: **"Hatırlatma: Beden eğitimi kıyafeti — çantaya koy"**
   - açıklama yoksa: **"Hatırlatma: Beden eğitimi kıyafeti"**

   Açık sayfadaki zil bunu hemen göstermez: site bildirimleri yoklama aralığıyla sorar (varsayılan 5 dakika; sistem yöneticisi Site
   Ayarları'nda 1–30 dakika arası ayarlar). Zili açınca ya da sekmeye geri dönünce beklemeden sorulur; arka plandaki sekme hiç sormaz.
2. Tarayıcıda (ya da ana ekrana eklediğin Eğitim Evi'nde) telefon bildirimi açıksa aynı metin hemen telefonuna da gelir (bu, zilin
   yoklama aralığını beklemez).
3. Android uygulaması kuruluysa uygulama yeni bildirimleri kendisi sorar: 15 dakikada bir (servisle ilgili hesapta servis
   saatlerinde dakikada bir). Bu yüzden uygulamada hatırlatma 15 dakikaya kadar geç düşebilir (Android'in düzenli işi; telefon
   uykudayken Android bu aralığı uzatabilir).
4. Bildirime bas → **Hatırlatıcılar** sayfası.
5. Bir kezlik hatırlatıcı gönderilince kapanır; sayfayı yeniden açınca satırı **"Hatırlatıldı"** yazar. Her gün, her hafta, her ay
   olanlar açık kalır; etiket bir sonraki zamanı gösterir ([Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md)).

### Öğrenci

Hatırlatma **yalnız sana** gelir. Öğrenciye giden bildirimlerin çoğunun bir kopyası velisine de gider; senin kendi kurduğun
hatırlatma gitmez ([Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md)).

### Veli

Kendi kurduğun hatırlatmalar veli portalının (yetişkin hesabının) ziline gelir. Çocuğunun hatırlatmaları sana gelmez. Tasarımda her
çocuk ayrı oturumdur; hatırlatma, hatırlatıcıyı kurduğun çocuğun oturumuna gelir
([Velide her çocuk ayrı oturum](../portallar/velide-cocuk-oturumlari.md)).

### Öğretmen, çalışan ve müdür

Hatırlatma, hatırlatıcıyı kurduğun okul portalının ziline gelir (her okul portalının zili ayrıdır). Telefon bildirimi aboneliği
portala değil kişiye ait olduğu için bütün portallarının hatırlatmaları aynı telefona düşer. Telefondaki bildirime basınca site,
gerekiyorsa önce o portala geçer, sonra Hatırlatıcılar sayfasını açar ([Portala geçiş](../portallar/portala-gecis.md)).

### Servisçi

Zile ve telefona gelir. Android uygulamasında bildirim listesinde görünür; bugün uygulamada Hatırlatıcılar ekranı olmadığı için
satıra dokunmak bir sayfa açmaz (sitede açılır) ([Android uygulaması](../uygulama/android-uygulamasi.md)).

### Yönetici

Yönetim panelinin ziline gelir; basınca yönetimdeki Hatırlatıcılar sayfası açılır.

### Tasarımda (Tasarım 1 önizlemesi ve tanımlar)

- **"Telefona bildirim" anahtarı:** her hatırlatıcının penceresinde, açık gelir; açıksa satırın özetinde "· telefona bildirim"
  yazar. Kapatılınca telefona gitmez; o durumda zile yazılıp yazılmayacağı önizlemede ve tanımlarda yazılı değil.
- **Zilin sekmeleri:** bildirim paneli "Tümü · Ödev · Sınav · Devamsızlık · Mesaj · Duyuru · Servis" sekmelerine ayrılır;
  hatırlatmaların ayrı sekmesi yoktur. Önizlemenin zil listelerinde "Hatırlatma: …" örneği yok; önizlemenin tür ayırma kuralına göre
  başlıkta "ödev", "sınav", "servis", "mesaj" gibi bir sözcük geçmiyorsa hatırlatma "Tümü"nde ve **"Duyuru"** sekmesinde görünür
  (başlık "ödev" içeriyorsa "Ödev"e düşer). Tanımlarda hatırlatmanın hangi sekmeye gireceği yazılı değil
  ([Bildirim sekmeleri](../bildirim/sekmeler.md)).
- **Android uygulamasında Hatırlatıcılar ekranı** (uygulama tanımı: liste, ekle/düzenle); bildirime dokununca o ekran açılır.
- **Duyurudan gelen hatırlatıcılar** da zamanında aynı biçimde bildirim gönderir, telefon bildirimi dahil
  ([Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md)).
- **Bildirimlerin saklanması:** tasarımda bildirimler 90 gün sonra silinir ([Saklama ve silinme](../bildirim/saklama-ve-silinme.md)).
- Kişisel hatırlatıcıdan ayrı, kendiliğinden gelen hatırlatmalar da tasarlandı (ödev, sınav, toplantı); onların kendi metinleri var
  ([Otomatik bildirimler](../bildirim/otomatik-bildirimler.md)).

## Kurallar ve sınırlar

- **Dakikada bir denetim:** hatırlatma, saatinden en geç yaklaşık bir dakika sonra bildirimlerine yazılır. Bir tur sürerken ikincisi
  başlamaz. Açık sayfadaki zil ise sitenin yoklama aralığında (varsayılan 5 dakika) tazelenir; zili açınca hemen tazelenir.
- **Bir an bir kez:** aynı hatırlatma iki kez gitmez. Sunucu önce "gönderildi" işaretini yazar, sonra bildirimi; bildirim yazılırken
  hata olursa o hatırlatma yeniden denenmez (çift bildirim yerine kaybı seçen bir düzen).
- **Sunucu kapalı kaldıysa:** 6 saate kadar geciken hatırlatma sunucu açılınca bir kez gider; daha eskisi hiç gitmez (sabah 08:30
  hatırlatması akşam gelmesin diye). Bu yüzden kaçan bir kezlik hatırlatıcı "Günü geçti" görünür.
- **Kurulmadan önceki anlar sayılmaz:** 10:00'da kurduğun "Her gün · 08:30" o gün geriye dönüp çalmaz; düzenleme ve yeniden başlatma
  da sayımı o andan başlatır.
- **Metin en çok 300 harf:** "Hatırlatma: " + başlık + " — " + açıklama 300 harfi geçerse sonu kesilir; açıklamanın tamamı
  Hatırlatıcılar sayfasında durur.
- **Veliye kopya yok:** kişinin kendi kurduğu hatırlatma yalnız ona gider (öğrenciyse velisine gitmez).
- **Telefona sınır:** kişi başına dakikada en çok 20 telefon bildirimi gider; fazlası telefona düşmez ama zilde durur. Telefon
  kapalıysa bildirim servisi 1 gün bekletir ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).
- **Türkiye saati:** hatırlatma Türkiye saatine göre gelir; sunucu başka saat diliminde çalışsa da.
- **Okulun kapattığı bölümler etkilemez:** hatırlatmalar hiçbir okul ayarına bağlı değildir.
- **Android uygulamasında (bugün)** hatırlatma bildirimine dokunmak bir sayfa açmaz; uygulama bu adresi tanımıyor.

## Kardeşler ve ilgili

**Kardeşler:** [Hatırlatıcılar sayfası](hatirlaticilar-sayfasi.md) · [Kurma, düzenleme ve silme](hatirlatici-kurma.md) ·
[Sıklık](siklik.md) · [Durdurma ve yeniden başlatma](durdurma-ve-baslatma.md) · [Takvimde ve ajandada](takvimde-ve-ajandada.md) ·
[Duyurudan gelen hatırlatıcılar](duyurudan-gelen-hatirlaticilar.md) · [Kimler görür ve saklama](kimler-gorur-ve-saklama.md).

**İlgili:** [Bildirim paneli](../bildirim/bildirim-paneli.md) · [Bildirim türleri ve metinleri](../bildirim/bildirim-metinleri.md) ·
[Otomatik bildirimler](../bildirim/otomatik-bildirimler.md) · [Telefon bildirimi](../bildirim/telefon-bildirimi.md) ·
[Öğrencinin bildirimi veliye de](../bildirim/velinin-bildirimleri.md) · [Bildirim sekmeleri](../bildirim/sekmeler.md) ·
[Android uygulaması](../uygulama/android-uygulamasi.md) · [Toplantı hatırlatması](../toplanti/hatirlatma-ve-silinme.md) ·
[Ödev hatırlatmaları](../odev/hatirlatmalar.md).

## Kod tarafı

- Gönderici: [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md) — `hatirlaticilariGonder` (`calisiyor` bayrağı,
  önce `gonderildi`, sonra `bildir(…, '#/hatirlaticilar', { veliye: false })`); dakikalık sayaç
  [sunucu/index.md](../../sunucu/index.md).
- Zaman: [sunucu/yardimci/hatirlatici-zaman.md](../../sunucu/yardimci/hatirlatici-zaman.md) — `zamaniGeldi` (bugün ve dün, 6 saat,
  son gönderimden ve kuruluştan sonra).
- Bildirim yazma ve 300 harf: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`bildir`, `veliye: false`); telefon
  bildirimi [sunucu/push.md](../../sunucu/push.md), [sunucu/bolumler/push.md](../../sunucu/bolumler/push.md),
  [public/sw.md](../../public/sw.md); Android uygulamasının yoklaması [sunucu/bolumler/cihaz.md](../../sunucu/bolumler/cihaz.md).
- Zil ve bildirime basınca açılan sayfa: [public/js/parcalar/24-bildirim-arama-mobil.md](../../public/js/parcalar/24-bildirim-arama-mobil.md);
  telefondan gelişte portala geçiş [public/js/parcalar/26-baslat.md](../../public/js/parcalar/26-baslat.md).
- Veri: [sunucu/veri/depo/hatirlaticilar.md](../../sunucu/veri/depo/hatirlaticilar.md) (`aktifler`, `gonderildi`: bir kezliği
  kapatır). Birden çok sunucu süreci çalıştırılırsa aynı hatırlatmanın iki kez gitme olasılığı orada not edilmiş.
- Testler: [testler/test-hatirlatici-zaman.md](../../testler/test-hatirlatici-zaman.md) (tam saatinde gelir, bir dakika önce gelmez,
  gönderilmiş an yinelenmez, 5 saat gecikme gider, 6 saatten eskisi gitmez, gece yarısını geçen 23:50).
- Okulun otomatik hatırlatmaları (sabah ders özeti, "yarın ödevin var") ayrı bir iştir: [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md).

## Sık sorulanlar

- **Hatırlatma birkaç dakika geç geldi.** Sunucu dakikada bir bakar; açık sayfadaki zil yoklama aralığında (varsayılan 5 dakika)
  tazelenir; Android uygulaması ise 15 dakikada bir sorar. Anında gelmesi için tarayıcıda telefon bildirimini aç.
- **Sunucu bakımdaydı, hatırlatmam hiç gelmedi.** 6 saatten uzun kapalı kaldıysa o hatırlatma gönderilmez; bir kezlikse satırı "Günü
  geçti" der, düzenleyip yeni gün seç.
- **Velim benim hatırlatmalarımı görür mü?** Hayır; kendi kurduğun hatırlatma yalnız sana gelir.
- **Telefonuma gelmiyor, yalnız zilde görüyorum.** Telefon bildirimini açmadın ya da izin engellendi
  ([Telefon bildirimi](../bildirim/telefon-bildirimi.md)).
- **Uygulamada bildirime dokununca bir şey açılmıyor.** Bugün uygulamada Hatırlatıcılar ekranı yok; sitede aç.
- **Açıklamamın sonu bildirimde kesik.** Bildirim en çok 300 harftir; tamamı Hatırlatıcılar sayfasında.

## Sırada

- Android yerel uygulama (bütün roller): uygulamada Hatırlatıcılar ekranı; bildirime dokununca açılması.
- Arayüz önizlemesi (Tasarım 1): her hatırlatıcıda "Telefona bildirim" anahtarı.
- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: bildirimlere tür
  (panel sekmeleri), duyurudan gelen hatırlatıcıların bildirimi.
- Optimizasyon + saklama süreleri: bildirimlerin 90 gün sonra silinmesi.
