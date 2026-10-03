# İlerleyiş

Öğrencinin ödev ve sınav gidişini grafiklerle tek sayfada toplayan bölüm. Öğrenci menüdeki "İlerleyişim"i açar; veli
kendi menüsündeki "İlerleyiş" sayfasında çocuklarının aynı kartlarını görür ya da "Çocuklarım"dan çocuğun portalına girip
"İlerleyişi"ne bakar; müdür ve "Öğrenci portalına girer" yetkili öğretmen okulun herhangi bir öğrencisinin portalını
"Portalını aç" ile açar. Bugün kodda sayfada dört parça var: ödev sonuçlarının sütun grafiği ("Sonuçlara göre", "Grafiği
gizle"), derslere göre ödev başarı oranı ("Derslere göre"), aynı şablonlu sınavların çizgi grafiği (en düşük / en yüksek
bandı, Grafik / Liste) ve grupsuz sınavlarla sınav grubu ortalamaları (100 üzerinden). Sayfa yalnız bakmak içindir;
okul onu Özellikler'den kapatamaz (Ödevler ya da Sınavlar kapalıysa ilgili kartlar boş kalır, sınav grafiği kutusunda
"Sınavlar bu okulda kapalı…" iletisi çıkar); servisçi ve giriş yapmamış
ziyaretçi görmez. Tasarım 1 önizlemesi buna "Derslere göre ortalama" kutusunu, her sınavın bir sütun olduğu "Sınav
sonuçları" grafiğini ve dokununca sınav ayrıntısını açan "Son sınavlar" listesini ekler; velide kullanıcının 3 Ekim
kararıyla her çocuk ayrı oturumdur ("Hepsi" kalkar).

## Alt özellikler

| Belge | Ne anlatır | Durum |
|---|---|---|
| [İlerleyişim sayfası](ilerleyisim.md) | Sayfanın düzeni, kim nereden açar (öğrenci, veli portalı, müdür ve yetkili öğretmen "Portalını aç"), görme yetkisi, yıl, nakil, kapalı bölüm | Kodda var; tasarımda ek olarak yeni düzen (ortalama kutusu, iki sütun grafiği, "Son sınavlar") |
| [Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md) | Velinin menüsündeki "İlerleyiş": çocuk şeridi ("Hepsi"), çocuk çocuk kartlar; öğretmen ya da müdür olan velinin yolu (Portallarım, eski usulde "Velisi olduğum") | Kodda var; tasarımda ek olarak her çocuk ayrı oturum ("Hepsi" kalkar) |
| [Ödev sonuçları grafiği](odev-grafigi.md) | "Sonuçlara göre" sütun grafiği (Yaptı … Belirsiz), "Grafiği gizle", tercihler | Kodda var; tasarımda ek olarak "N sonuçlanan ödev", yeni renkler, altta ödev listesi |
| [Derslere göre başarı oranı](ders-oranlari.md) | "Derslere göre": ders başına yığılmış sütun ve oran formülü | Kodda var |
| [Sınav grafiği](sinav-grafigi.md) | Şablonlu sınavların çizgi grafiği: şablon ve ölçüm seçimi, bant, Grafik / Liste | Kodda var |
| [Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md) | "Sınavlar" (grupsuz) ve "Sınav grubu ortalamaları" kartları, hesap; tasarımda "Son sınavlar" | Kodda var; tasarımda ek olarak "Son sınavlar" listesi ve sınav ayrıntısı |
| [Sınav sonuçları sütun grafiği](sinav-sonuclari-grafigi.md) | Her sınav bir sütun, üstünde sonucu, boyu tam puana oranı | Tasarlandı — henüz kodda yok |
| [Derslere göre ortalama](derslere-gore-ortalama.md) | Sayfanın başında ders ders not ortalaması ("1. dönem") | Tasarlandı — henüz kodda yok |

Okuma sırası: önce [İlerleyişim sayfası](ilerleyisim.md); sonra sayfadaki sırayla [Ödev sonuçları grafiği](odev-grafigi.md),
[Derslere göre başarı oranı](ders-oranlari.md), [Sınav grafiği](sinav-grafigi.md),
[Sınavlar ve grup ortalamaları](sinavlar-ve-grup-ortalamalari.md). Veli ayrıca
[Velinin İlerleyiş sayfası](velinin-ilerleyis-sayfasi.md). Tasarımı okuyacak olan
[Derslere göre ortalama](derslere-gore-ortalama.md) ve [Sınav sonuçları sütun grafiği](sinav-sonuclari-grafigi.md).

## Rol tablosu

Hücre: o rolün bu alt özellikte yaptığı (bağlantı ilgili belgenin o rolün bölümüne gider). "—": bu rol kullanmaz.

| Alt özellik | Öğrenci | Veli | Öğretmen | Çalışan | Müdür | Servisçi | Yönetici | Ziyaretçi |
|---|---|---|---|---|---|---|---|---|
| İlerleyişim sayfası | [kendi ilerleyişini açar](ilerleyisim.md#öğrenci) | [çocuğun portalında "İlerleyişi"](ilerleyisim.md#veli) | ["Öğrenci portalına girer" yetkisiyle "Portalını aç"](ilerleyisim.md#öğretmen) | [rolünde portal yetkisi varsa açar](ilerleyisim.md#çalışan) | [okulun her öğrencisinde "Portalını aç"](ilerleyisim.md#müdür) | — (sunucu izin vermez) | — (sunucu izin verir, ekranda yolu yok) | — |
| Velinin İlerleyiş sayfası | — | [çocuklarının kartlarını görür](velinin-ilerleyis-sayfasi.md#veli) | [velisiyse Portallarım'dan veli portalına geçer (eski usul hesapta "Velisi olduğum")](velinin-ilerleyis-sayfasi.md#öğretmen-ve-müdür) | — | [velisiyse Portallarım'dan veli portalına geçer (eski usul hesapta "Velisi olduğum")](velinin-ilerleyis-sayfasi.md#öğretmen-ve-müdür) | — | — | — |
| Ödev sonuçları grafiği | [görür, görünüm değiştirir, gizler](odev-grafigi.md#öğrenci) | [her çocuğunkini görür](odev-grafigi.md#veli) | [portalda görür](odev-grafigi.md#müdür-öğretmen-ve-çalışan) | [portalda görür](odev-grafigi.md#müdür-öğretmen-ve-çalışan) | [portalda görür](odev-grafigi.md#müdür-öğretmen-ve-çalışan) | — | — | — |
| Derslere göre başarı oranı | [ders ders oranını görür](ders-oranlari.md#öğrenci) | [her çocuğunkini görür](ders-oranlari.md#veli) | [portalda görür](ders-oranlari.md#müdür-öğretmen-ve-çalışan) | [portalda görür](ders-oranlari.md#müdür-öğretmen-ve-çalışan) | [portalda görür](ders-oranlari.md#müdür-öğretmen-ve-çalışan) | — | — | — |
| Sınav grafiği | [şablon, ölçüm, bant, liste seçer](sinav-grafigi.md#öğrenci) | [her çocuğunkini görür; eski okullar dahil](sinav-grafigi.md#veli) | [portalda yalnız kendi okulunun sınavları](sinav-grafigi.md#müdür-öğretmen-ve-çalışan) | [portalda yalnız kendi okulunun sınavları](sinav-grafigi.md#müdür-öğretmen-ve-çalışan) | [portalda yalnız kendi okulunun sınavları](sinav-grafigi.md#müdür-öğretmen-ve-çalışan) | — | — | — |
| Sınavlar ve grup ortalamaları | [sonuçlarını ve grup ortalamalarını görür](sinavlar-ve-grup-ortalamalari.md#öğrenci) | [çocuğununkileri görür](sinavlar-ve-grup-ortalamalari.md#veli) | [portalda görür](sinavlar-ve-grup-ortalamalari.md#müdür-öğretmen-ve-çalışan) | [portalda görür](sinavlar-ve-grup-ortalamalari.md#müdür-öğretmen-ve-çalışan) | [portalda görür](sinavlar-ve-grup-ortalamalari.md#müdür-öğretmen-ve-çalışan) | — | — | — |
| Sınav sonuçları sütun grafiği (tasarım) | [son sınavlarını sütunlarda görür](sinav-sonuclari-grafigi.md#öğrenci) | [o oturumdaki çocuğunkini görür](sinav-sonuclari-grafigi.md#veli) | [portalda görür](sinav-sonuclari-grafigi.md#müdür-öğretmen-ve-çalışan) | [portalda görür](sinav-sonuclari-grafigi.md#müdür-öğretmen-ve-çalışan) | [portalda görür](sinav-sonuclari-grafigi.md#müdür-öğretmen-ve-çalışan) | — | — | — |
| Derslere göre ortalama (tasarım) | [ders ders not ortalamasını görür](derslere-gore-ortalama.md#öğrenci) | [o oturumdaki çocuğunkini görür](derslere-gore-ortalama.md#veli) | [portalda görür](derslere-gore-ortalama.md#müdür-öğretmen-ve-çalışan) | [portalda görür](derslere-gore-ortalama.md#müdür-öğretmen-ve-çalışan) | [portalda görür](derslere-gore-ortalama.md#müdür-öğretmen-ve-çalışan) | — | — | — |

Öğretmen sütunu: portala giden yol "Öğrenci portalına girer" yetkisi ister (hazır "Rehber Öğretmen" rolünde açık;
tasarımda yetkinin adı "Portalına bakar"). Yetkisi olmayan öğretmen kendi öğrencilerinin sonuçlarına
[Sınıflarım](../siniflar-dersler/siniflarim.md)dan bakar. Çalışan sütunu: bugün kodda ek görevli kişi öğretmen hesabı ve bir
ek rolle çalışır; tasarımda (çalışan tanımı) rolsüz çalışan ilerleyiş görmez, rolünde portal yetkisi olan görür. Destek,
eğitmen ve tahta hesapları (tasarımdaki roller) bu bölümü kullanmaz.

Rol kapıları: [Öğrenci](../roller/ogrenci.md) · [Veli](../roller/veli.md) · [Öğretmen](../roller/ogretmen.md) ·
[Çalışan](../roller/calisan.md) · [Müdür](../roller/mudur.md) · [Servisçi](../roller/servisci.md) ·
[Yönetici](../roller/yonetici.md) · [Ziyaretçi](../roller/ziyaretci.md). Bütün özellikler: [features/](../README.md).

## İlgili öbür klasörler

- [Ödevler](../odev/README.md) — sonuçlandırma (grafiğin kaynağı), ödev serisi, ödev listesi ve penceresi.
- [Sınavlar](../sinav/README.md) — şablonlar, ölçümler, not girişi, sınav grupları, Sınavlarım, sınav ayrıntısı.
- [Quiz](../quiz/README.md) — quiz puanı grafiklere girmez.
- [Ana sayfa](../ana-sayfa/README.md) — "İlerleyişim" / "İlerleyiş" kutucukları ve ortalama.
- [Portallar](../portallar/README.md) — Çocuklarım, Portallarım, velide her çocuk ayrı oturum.
- [Hesaplar](../hesaplar/README.md) — öğrenci listesi, "Portalını aç", öğrenci nakli, veli bağlama.
- [Roller ve yetkiler](../roller-yetkiler/README.md) — "Öğrenci portalına girer" yetkisi, hazır şablonlar.
- [Eğitim yılı](../egitim-yili/README.md) — yıl şeridi, geçmiş yıla bakma.
- [Okulun özellikleri](../ozellikler/README.md) — Ödevler / Sınavlar kapalıyken kartlar.
- [Sınıflar ve dersler](../siniflar-dersler/README.md) — öğretmenin Sınıflarım sayfası, ders adları.
- [Menü, üst şerit ve arama](../menu-ve-arama/README.md) — menü satırları, sayfa içi arama.
- [Başarılar](../basarilar/README.md) — tasarımda öğrencinin ayrı "Başarılarım" sayfası.
- [KVKK ve gizlilik](../kvkk-ve-gizlilik/README.md) — kim neyi görür, sınav bandı.
- [Uygulama](../uygulama/README.md) — Android'de İlerleyiş ekranı (planlı).

## Kod belgeleri

- Sunucu: [sunucu/bolumler/ilerleyis.md](../../sunucu/bolumler/ilerleyis.md) (`GET /api/progress`),
  [sunucu/bolumler/sinav.md](../../sunucu/bolumler/sinav.md) (`GET /api/exams/grafik`),
  [sunucu/iliskiler.md](../../sunucu/iliskiler.md) (`canSeeStudent`),
  [sunucu/bolumler/egitim-yili.md](../../sunucu/bolumler/egitim-yili.md) (`yilSuz`, `bakisKisisi`),
  [sunucu/veri/depo/sinavlar.md](../../sunucu/veri/depo/sinavlar.md), [sunucu/yetki.md](../../sunucu/yetki.md) (`ogrenci.portal`).
- Ön yüz: [public/js/parcalar/13-ogrenci-veli.md](../../public/js/parcalar/13-ogrenci-veli.md) (sayfa ve kartlar),
  [public/js/parcalar/28-grafik.md](../../public/js/parcalar/28-grafik.md) (grafikler),
  [public/js/parcalar/27-veli-panel.md](../../public/js/parcalar/27-veli-panel.md) (velinin İlerleyiş'i),
  [public/js/parcalar/06-menu.md](../../public/js/parcalar/06-menu.md), [public/js/parcalar/10-mudur.md](../../public/js/parcalar/10-mudur.md),
  [public/js/parcalar/08-ana-sayfa.md](../../public/js/parcalar/08-ana-sayfa.md),
  [public/js/parcalar/14-odev-filtre.md](../../public/js/parcalar/14-odev-filtre.md) (Sınavlarım).
  Görünüm: [public/css/parcalar/CSS.md](../../public/css/parcalar/CSS.md) (`05-tablo-grafik.css`, `25-grafik-sinav.css`).
- Testler: [testler/test-sinav.md](../../testler/test-sinav.md), [testler/test-veli-coklu.md](../../testler/test-veli-coklu.md),
  [testler/test-ozellikler.md](../../testler/test-ozellikler.md), [testler/test-nakil.md](../../testler/test-nakil.md),
  [testler/buton-denetimi.md](../../testler/buton-denetimi.md).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("İlerleyişim", "Veli tarafı").
