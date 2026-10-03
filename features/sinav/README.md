# Sınavlar

Öğretmenin sınav açıp öğrencilerin değerlerini girdiği, öğrencinin ve velinin sonuçları gördüğü bölüm. Bir sınav tek bir not
değildir: her sınavın bir ya da birden çok ölçümü olur (yazılıda "Puan"; testte "Doğru", "Yanlış", "Net"; denemede ders netleri ve
"LGS Puanı"), her ölçümün kendi aralığı vardır (0–100, 100–500, −10–20; değerler virgülle ondalıklı) ve biri **ana** ölçümdür.
Ölçümler okulun şablonlarından gelir ("Yazılı (0-100)", "Test (Doğru / Yanlış / Net)", "LGS Denemesi" ya da okulun kendi
şablonu); sınavlar isteğe bağlı olarak etki oranlı gruplarda birleşir. Bugünkü sitede öğretmen (müdür de "Kendi Derslerim"de)
"Sınavlar" sayfasının "Sınavlarım", "Gruplar" ve "Şablonlar" sekmelerinde çalışır, değerleri tabloya yazar (Enter ile alt satır,
hatalı kutu kırmızı); değeri ilk kez girilen öğrenciye ve velisine "… sınavının sonucu açıklandı." bildirimi gider; öğrenci
"Sınavlarım"da ve İlerleyişim'de sonuçlarını, grafiğini ve 100 üzerinden grup ortalamalarını görür. Sınav yalnız açanınındır:
müdür bile başkasının sınavını açamaz. Tasarımda (kullanıcının 28 Ağustos–2 Ekim istekleri, tanımlar ve Tasarım 1 önizlemesi)
ölçümler sıra numaralı ve kodlu olur ("01.D Doğru Sayısı"), Net gibi değerler formülle hesaplanır (`D - Y/4`), notlar Excel'den
yüklenir ve indirilir, sınav tarih, saat, süre, salon ve koltukla planlanır ("Gelecek sınavlar" / "Olmuş sınavlar"), grubun üst
değeri (ör. 125) ve birbirine bağlı kaydırıcılar gelir, sınava dokununca "Sınav ayrıntısı" ve "Raporla" açılır, müdür okulun
bütün sınavlarını görür ve notları girecek öğretmenleri seçer.

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [Sınavlar listesi](sinavlar-listesi.md) | "Sınavlarım" sekmesi: satırlar, "Değer gir", "Sil"; tasarımda "Gelecek sınavlar" / "Olmuş sınavlar", "Düzenle", "açan:" | Kodda var; tasarımda ek olarak gelecek / olmuş bölümleri, salon, koltuk, "Düzenle" |
| [Yeni sınav açma](yeni-sinav.md) | "Yeni sınav" penceresi (ad, tarih, şablon, grup, etki oranı); tasarımda üç adımlı "Sınav aç" ve "Sınavı düzenle", bütün hata iletileri | Kodda var; tasarımda ek olarak üç adımlı "Sınav aç" |
| [Şablonlar](sablonlar.md) | Hazır ve okulun şablonları, "Okula ekle", yeni / düzenle / sil; tasarımda şablon kartları ve "okulun şablonu olarak da kaydet" | Kodda var; tasarımda ek olarak formüllü, sıra numaralı hazır şablonlar |
| [Ölçümler ve formül](olcumler-ve-formul.md) | Değer alanları (ad, aralık, ana, kod), sınırlar ve iletiler; tasarımda sıra · kod · ad · tür · formül, "Örnek", "Formül dene" | Kodda var; tasarımda ek olarak hesaplanan ölçüm ve formül |
| [Not (değer) girişi](not-girisi.md) | Öğrenci × ölçüm tablosu, sınıf süzgeci, Enter, kırmızı / mavi kutu, "Kaydet" iletileri | Kodda var; tasarımda ek olarak hesaplanan sütunlar, sayaç, sınav bitmeden kapalı giriş |
| [Excel'den not yükleme ve indirme](excelden-not.md) | "Excel'den aktar" (boş şablon, yükle ya da yapıştır, önizleme, hatalı satırlar), "Excel olarak indir", müdürün "Not çizelgesi" | Tasarlandı — henüz kodda yok |
| [Sınav grupları](sinav-gruplari.md) | Gruplar sekmesi, grup ekranı, ağırlıklı ortalama (100 üzerinden), silme; tasarımda üst değer, kaydırıcılar, kilit, öğrencide grup sonucu ve ayrıntı | Kodda var; tasarımda ek olarak üst değer ve bağlı kaydırıcılar |
| [Sınav ayrıntısı](sinav-ayrintisi.md) | Sınava dokununca: Sınav, Ders, Form, Sınav tarihi, Sonuç tarihi, sıra numaralı ölçümler, "Raporla" | Tasarlandı — henüz kodda yok |
| [Sınav planlama](sinav-planlama.md) | Tarih, saat, süre, sınıflar, salon ve koltuk (otomatik / elle), gelecek / olmuş, düzenleme, takvim, ajanda, hatırlatma | Tasarlandı — henüz kodda yok |
| [Okulun sınavları](okulun-sinavlari.md) | Müdürün "Okul düzeni → Sınavlar"ı: süzgeçli liste, durumlar, "Notları girecek öğretmen(ler)" | Tasarlandı — henüz kodda yok |
| [Sınavlarım](sinavlarim.md) | Öğrencinin (ve çocuğunun portalında velinin) sınav sayfası; tasarımda sınav satırları, "Sınav grupları" satırı | Kodda var; tasarımda ek olarak satırlar ve grup sonucu |
| [Sonuç bildirimi ve sonuçların görünmesi](sonuc-bildirimi.md) | İlk girişte bildirim, veliye kopya, "bir kez" kuralı; tasarımda puanlı metin ve "Değer girilince öğrenci ve veli hemen görsün" | Kodda var; tasarımda ek olarak puanlı metin, "Sınav" sekmesi |
| [Yetkiler, kapalı bölüm ve geçmiş yıl](yetki-ve-kapsam.md) | "Sınav oluşturur", "Sınav notu girer", ders ve sınıf daraltması, sahiplik, "Sınavlar"ı kapatma, geçmiş yıl | Kodda var; tasarımda ek olarak notu girecek öğretmen, rolsüz çalışan |
| [Silme, eğitim yılı ve saklama](silme-ve-saklama.md) | Değer, ölçüm, sınav, grup, şablon silme; yıl damgası; nakil; saklama, mezunlar, yedek | Kodda var; tasarımda ek olarak "aktif + bir önceki yıl", mezunlar |
| [Dershane portalında deneme sınavları](dershane-denemeleri.md) | İkinci kurumun "Deneme sınavları" sayfası: kayıt ol, sonuç, gruptaki sıra (yalnız önizlemede) | Tasarlandı — henüz kodda yok |

Plana eklenen alt özellikler: [Sonuç bildirimi ve sonuçların görünmesi](sonuc-bildirimi.md),
[Yetkiler, kapalı bölüm ve geçmiş yıl](yetki-ve-kapsam.md), [Silme, eğitim yılı ve saklama](silme-ve-saklama.md) ve
[Dershane portalında deneme sınavları](dershane-denemeleri.md).

Okuma sırası: öğretmen için önce [Şablonlar](sablonlar.md) ve [Ölçümler ve formül](olcumler-ve-formul.md), sonra
[Yeni sınav açma](yeni-sinav.md), [Not (değer) girişi](not-girisi.md) ve [Sınavlar listesi](sinavlar-listesi.md); dönem notu için
[Sınav grupları](sinav-gruplari.md); öğrenci ve veli için [Sınavlarım](sinavlarim.md) ve
[Sonuç bildirimi](sonuc-bildirimi.md); müdür için [Yetkiler, kapalı bölüm ve geçmiş yıl](yetki-ve-kapsam.md) ve
[Okulun sınavları](okulun-sinavlari.md); kurallar için [Silme, eğitim yılı ve saklama](silme-ve-saklama.md); tasarlananlar için
[Sınav ayrıntısı](sinav-ayrintisi.md), [Sınav planlama](sinav-planlama.md), [Excel'den not](excelden-not.md) ve
[Dershane portalında deneme sınavları](dershane-denemeleri.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| Sınavlar listesi | — | — | [sınavlarını görür, "Değer gir", "Sil"; tasarımda gelecek / olmuş, "Düzenle"](sinavlar-listesi.md#öğretmen) | [yetkisine göre öğretmen gibi](sinavlar-listesi.md#çalışan) | [yalnız kendi sınavları; tasarımda "Okul düzeni → Sınavlar"](sinavlar-listesi.md#müdür) | — | — | — |
| Yeni sınav açma | — | — | [ad, tarih, şablon, grup; tasarımda "Sınav aç"](yeni-sinav.md#öğretmen) | ["Sınav oluşturur" ve ders kapsamıyla](yeni-sinav.md#çalışan) | [ders branşı ya da "Müdür"; tasarımda notu girecek öğretmen](yeni-sinav.md#müdür) | — | — | — |
| Şablonlar | — | — | [kullanır, açar, kendi şablonunu değiştirir](sablonlar.md#öğretmen) | [öğretmen gibi; yetki istemez](sablonlar.md#çalışan) | [okulun bütün şablonlarını değiştirir, siler](sablonlar.md#müdür) | — | — | — |
| Ölçümler ve formül | [sonuçlarında görür; tasarımda formül ipucu](olcumler-ve-formul.md#öğrenci) | [çocuğununkini görür](olcumler-ve-formul.md#veli) | [alan ekler, aralık ve ana seçer; tasarımda formül](olcumler-ve-formul.md#öğretmen) | ["Sınav oluşturur"la değiştirir](olcumler-ve-formul.md#çalışan) | [öğretmen gibi](olcumler-ve-formul.md#müdür) | — | — | — |
| Not (değer) girişi | — | — | [tabloya yazar, kaydeder](not-girisi.md#öğretmen) | ["Sınav notu girer"; sınıf daraltması sessiz](not-girisi.md#çalışan) | [kendi sınavlarına; tasarımda öğretmen seçer](not-girisi.md#müdür) | — | — | — |
| Excel'den not | — | — | [boş şablon, yükle, önizle, indir (tasarım)](excelden-not.md#öğretmen) | [öğretmen gibi (tasarım)](excelden-not.md#çalışan) | ["Not çizelgesi" (tasarım)](excelden-not.md#müdür) | — | — | — |
| Sınav grupları | [grup tablosu ve ortalama; tasarımda sonuç ve ayrıntı](sinav-gruplari.md#öğrenci) | [çocuğunun grupları](sinav-gruplari.md#veli) | [açar, sınav koyar, siler; tasarımda kaydırıcılar](sinav-gruplari.md#öğretmen) | ["Sınav oluşturur"la açar; "Grubu sil" açığı](sinav-gruplari.md#çalışan) | [ders seçerek açar; tasarımda "Sınav grubu aç"](sinav-gruplari.md#müdür) | — | — | — |
| Sınav ayrıntısı | [pencere, "Raporla" (tasarım)](sinav-ayrintisi.md#öğrenci) | [çocuğununki (tasarım)](sinav-ayrintisi.md#veli) | [tanımda var, yeri açık (tasarım)](sinav-ayrintisi.md#öğretmen) | — | [okulun sınavlarından (tasarım)](sinav-ayrintisi.md#müdür) | — | — | — |
| Sınav planlama | [gelecek sınav, ajanda, salon ve sıra (tasarım)](sinav-planlama.md#öğrenci) | [yaklaşanlar, hatırlatma (tasarım)](sinav-planlama.md#veli) | [tarih, saat, süre, salon, koltuk (tasarım)](sinav-planlama.md#öğretmen) | — | [planlı sınavlar, durumlar (tasarım)](sinav-planlama.md#müdür) | — | — | — |
| Okulun sınavları | — | — | [müdürün sınavına not girer (tasarım)](okulun-sinavlari.md#öğretmen) | [notu girmeye seçilebilir (tasarım)](okulun-sinavlari.md#çalışan) | [süzgeçli liste, notu girecek öğretmen (tasarım)](okulun-sinavlari.md#müdür) | — | — | — |
| Sınavlarım | [sonuçlar, grafik, gruplar](sinavlarim.md#öğrenci) | [çocuğun portalında "Sınavları"](sinavlarim.md#veli) | [öğrencinin portalından (yetkiyle)](sinavlarim.md#öğretmen) | — | [öğrencinin portalından "Sınavları"](sinavlarim.md#müdür) | — | — | — |
| Sonuç bildirimi | [ilk girişte bildirim](sonuc-bildirimi.md#öğrenci) | [çocuğun adıyla kopya](sonuc-bildirimi.md#veli) | ["Kaydet" gönderir](sonuc-bildirimi.md#öğretmen) | — | [kendi sınavında öğretmen gibi](sonuc-bildirimi.md#müdür) | — | — | — |
| Yetkiler, kapalı bölüm, geçmiş yıl | [bölüm kapalıysa görmez](yetki-ve-kapsam.md#öğrenci) | [çocuğun okulunun kuralı](yetki-ve-kapsam.md#veli) | [iki yetki, düğmeler](yetki-ve-kapsam.md#öğretmen) | [ders ve sınıf daraltması](yetki-ve-kapsam.md#çalışan) | [rolleri ve bölümü ayarlar](yetki-ve-kapsam.md#müdür) | — | — | — |
| Silme, eğitim yılı, saklama | [bütün okulları; tasarımda aktif + önceki yıl](silme-ve-saklama.md#öğrenci) | [öğrenciyle aynı](silme-ve-saklama.md#veli) | [siler; geçmiş yıl salt okunur](silme-ve-saklama.md#öğretmen) | — | [kendi sınavları, şablonlar; yıl sonu arşivi (tasarım)](silme-ve-saklama.md#müdür) | — | — | — |
| Dershane denemeleri | [kayıt, sonuç, sıra (yalnız önizleme)](dershane-denemeleri.md#öğrenci) | [açık nokta](dershane-denemeleri.md#veli) | — | — | — | — | — | — |

Çalışan sütunu: bugünkü sitede okulda görevli herkes öğretmen hesabıyla çalışır ve okulun hazır Öğretmen rolünü taşır; müdür bu
rolden "Sınav oluşturur" ya da "Sınav notu girer"i kaldırırsa ya da bir ek rolde dersle ve sınıfla daraltırsa sınav ekranları ona göre
değişir. Tasarımda kişi okula çalışan olarak eklenir; Öğretmen rolü verilince öğretmen gibi çalışır, rolsüz çalışan sınav görmez.
Servisçi sınav ekranı görmez. Site yöneticisinin sınav ekranı yok (sunucu ona öğrencinin sınav grafiğini ve ilerleyişini görme izni
verir, yedeklerde sınavlar da vardır). Ziyaretçi sınavları yalnız açılış sayfasındaki tanıtım kartından ("Sınavlar — Yazılı, test ya
da LGS şablonuyla sınav; doğru, yanlış, net ve gelişim grafiği.") ve SSS'den ("Geçmiş eğitim yıllarına bakılabilir mi?", "Okulumuz
bazı bölümleri kullanmıyor, kapatılabilir mi?") okur. Tasarımdaki eğitmen ve tahta hesaplarında sınav yoktur.

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili klasörler

- [İlerleyiş](../ilerleyis/README.md) — sınav grafiği, "Sınavlar" ve "Sınav grubu ortalamaları" kartları, tasarımda "Son sınavlar".
- [Bildirimler](../bildirim/README.md) — sonuç bildirimi, veliye kopya, "Sınav" sekmesi.
- [Takvim ve ajanda](../takvim/README.md) — tasarımda planlanan sınavın takvime ve ajandaya girmesi; bugün elle eklenen "Sınav" türü.
- [Roller ve yetkiler](../roller-yetkiler/README.md), [Okulun özellikleri](../ozellikler/README.md),
  [Eğitim yılı ve yıl geçişi](../egitim-yili/README.md).
- [Excel aktarım](../excel-aktarim/README.md) — "Not çizelgesi"; [Quiz](../quiz/README.md) — soruların Excel'i ve quiz sonuçları
  (sınavdan ayrı).
- [Sınıflar ve dersler](../siniflar-dersler/README.md) — Sınıflarım'da öğrencinin sınav sonuçları, okulun kendi dersleri.
- [Öğrenci hesapları](../hesaplar/README.md) — öğrencinin portalını açma, nakil.
- [Portallar ve + Ekle](../portallar/README.md) — velide her çocuk ayrı oturum, öğrencide okul + dershane.
- [Yazı düzenleyici](../yazi-yazma/README.md) — tasarımda "Konular" alanı.
- [Eklentiler](../eklentiler/README.md) — tasarımda dış sınav uygulamasından sonuç aktaran eklenti.

## Açık noktalar

Kodlamadan önce kullanıcıya sorulacak ya da tasarımda netleşecekler:

- **Notların Excel'i:** kullanıcının "sınavları Excel'le olur" sözünün sınav notlarını da kapsayıp kapsamadığı soruldu, cevap yok
  ([Excel'den not](excelden-not.md)). Formüllü ölçüm, Excel ve grup üst değeri önerisi (iş 14) DEVAM'da "onay bekliyor" diye duruyor;
  kullanıcı 1 Ekim'de önizlemede görmek istediği işler arasında "Sınav formülü ve grup kaydırıcıları"nı saydı ("önceden görüp
  yapmam harika olur"), bu yüzden Tasarım 1'de çizildi. Bu klasör onları tasarım olarak anlatır; kesin onay kodlamadan önce alınmalı.
- **LGS şablonu:** tanım LGS Denemesi'nde ders ders netlerin (TR, MAT, FEN …) kalmasını ve net yüzdesinin kodunu "N%" ister; önizlemenin
  "Sınav aç" kartı ders netlerini koymuyor ve kodu "NY" yazıyor (sınav ayrıntısında "N%").
- **Şablon yönetimi:** önizlemede ayrı "Şablonlar" sekmesi yok; okulun şablonunun nerede düzenlenip silineceği ve ölçümlerin
  sürükleyerek sıralanması çizilmedi.
- **Sonuçların görünmesi:** "Değer girilince öğrenci ve veli hemen görsün" işaretlenmezse sonucun ne zaman açılacağı tanımlanmadı.
- **Planlama:** salon listesinin nereden geldiği; tanımda isteğe bağlı olan koltuğun önizlemede zorunlu olması; müdürün "Sınav aç"ında
  salon bölümü; sınav öncesi hatırlatma saatinin okul ayarının yeri; oturma listesinin yazdırılması (önizlemede yok).
- **Veli:** önizlemede velinin menüsünde "Sınavları" ve grup sonucu yok; velinin grup sonucunu nerede göreceği.
- **Sınav ayrıntısı:** öğretmenin pencereye nereden ulaşacağı; müdür okulun listesinden açınca hangi öğrencinin değerlerinin
  gösterileceği.
- **Grup ekranı:** tanımdaki "öğrencinin solunda grup sonucu" listesi öğretmenin grup sayfasında çizilmedi.
- **Okulun sınavları:** bir özel rolün (ör. Müdür Yardımcısı) okulun sınavlarını görüp açabilmesi için yetki; "Sınav notu girer"i
  kapalı bir öğretmenin notu girmeye seçilip seçilemeyeceği.
- **Dershane denemeleri:** denemeye kayıt ve gruptaki sıra yalnız önizlemede; kullanıcıya sorulmalı.
- **KILAVUZ düzeltmeleri** (belgeleme sırasında bulundu, KILAVUZ ayrıca düzeltilir): "Sınav: hazır şablonlar (Yazılı 0–100, LGS 0–500,
  doğru/yanlış/boş/net)" satırında LGS Puanı'nın aralığı 100–500'dür ve Test şablonunda "Boş" yoktur; "Okula ekle ile okulun olur ve
  düzenlenebilir" cümlesi hazır şablonu yalnız müdürün düzenleyebildiğini söylemiyor; "Müdür, öğretmenin yapabildiği her şeyi
  yapabilir (… sınav açma, not girme)" ve "matematik zümre başkanı … Sınav notu girer" örneği, bugün bir sınava yalnız onu açanın not
  girebildiğini atlıyor.
