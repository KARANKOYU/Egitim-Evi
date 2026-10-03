# Devamsızlık ve yoklama · Devamsızlık sınırı uyarısı

**Durum:** Tasarlandı — henüz kodda yok.

Öğrencinin özürsüz devamsızlığı okulun sınırına yaklaşınca velisine, öğrencinin kendisine, sınıfın rehber öğretmenine ve müdüre giden
otomatik uyarı; müdürün "Devamsızlık sınırları" ayarı ve "Sınıra yaklaşanlar" listesi.

## Ne işe yarar

Devamsızlık sınırını aşan öğrenci sınıfta kalabilir; veli çoğu zaman bunu iş işten geçince öğrenir. 3 Ekim'de kullanıcıya yedi fikir
önerildi; ikincisi buydu. Kullanıcı "2 3 5 6, eğer önemli tag'ı seçilirse 7 gibi işlesin" diyerek seçti (aynı kararla gelenler:
[Servise binmedi uyarısı](../servis/servise-binmedi-uyarisi.md), toplantıya kimin katıldığı, [Okumayanlara hatırlat](../mesaj/okumayanlara-hatirlat.md)
ve [Önemli etiketi](../mesaj/onemli-etiketi.md)). Sınırlar okul türüne göre değiştiği için sabit değil, **okulun ayarı**dır.
Karar 3 Ekim 17:15'te alındı; kodu Linux yapacak, Tasarım 1 önizlemesine belgeler bitince eklenecek.

## Nereden açılır

Tanıma göre:

- **Müdür:** okulun ayarlarında **"Devamsızlık sınırları"** (ekranın yeri ve düzeni kararlaştırılmadı; müdürün "Devamsızlık" sayfası ya da
  okul ayarları olması beklenir). Ayrıca **"Sınıra yaklaşanlar"** listesi.
- **Veli:** bildirim ve çocuğun **"Devamsızlık"** sayfasının üstünde aynı uyarı şeridi ([Devamsızlığım](devamsizligim.md)).
- **Öğrenci:** bildirim (yaşına uygun dille). Tanım şeridi yalnız velinin sayfası için söyler; "Devamsızlığım"da şerit olup olmayacağı
  kararlaştırılmadı.
- **Sınıfın rehber öğretmeni:** bildirim.

## Adım adım

### Müdür (tasarım)

1. **"Devamsızlık sınırları"**nda gir:
   - **özürsüz** devamsızlık gün sınırı (öneri: varsayılan **10 gün**);
   - **toplam** devamsızlık gün sınırı (öneri: varsayılan **30 gün**);
   - **uyarı eşikleri** (öneri: **5.** ve **8.** özürsüz günde; sınır aşılınca ayrıca).
2. Kaydet; uyarılar bundan sonra bu eşiklerle gider.
3. **"Sınıra yaklaşanlar"** listesinde eşiği geçmiş öğrencileri görürsün (ad, sınıf, özürsüz ve toplam gün, sınır).
4. Uyarı müdüre de bildirim olarak gelir.

### Veli (tasarım)

1. Çocuğunun özürsüz devamsızlığı bir eşiğe varınca bildirim gelir. Tanımdaki örnek metin: **"Elif'in özürsüz devamsızlığı 8 gün oldu;
   sınır 10 gün."**
2. Çocuğun **"Devamsızlık"** sayfasının üstünde aynı uyarı şeridi durur; altında hangi günlerin sayıldığını gün gün görürsün
   ([Tarih aralığı, gün gün / ders ders, süzgeç](tarih-araligi-ve-gorunum.md)).

### Öğrenci (tasarım)

Aynı uyarı öğrenciye de gider, **yaşına uygun dille** (metni kararlaştırılmadı). "Devamsızlığım"ın üstünde şerit olup olmayacağı
tanımda yok.

### Öğretmen ve çalışan (tasarım)

Uyarı **sınıfın rehber öğretmenine** gider. "Sınıfın rehber öğretmeni"nin sistemde kim olduğu (ör. önerilen "Sınıf öğretmeni" rol
şablonu ya da sınıf sayfasındaki "sınıf öğretmeni") kararlaştırılmadı ([Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md),
[Sınıf sayfası](../siniflar-dersler/sinif-sayfasi.md)).

## Kurallar ve sınırlar

- **Gün sayımı "gün gün" kuralıyla:** ilk ve son derse göre; "Gelmedi" 1 gün, "Yarım gün" yarım gün (öneri), "Geç geldi" sayılmaz;
  "İzinli" özürlü sayılır, özürsüz sınıra girmez ([Günün durumu](gun-durumu.md)). "Toplam" sınırın izinli günleri de saydığı
  varsayılır (tanımda ayrıca yazmıyor).
- **Eşik bir kez:** her eşik için uyarı bir kez gitmeli (tanımda ayrıca yazmıyor; aynı eşikte tekrar tekrar uyarı gitmemesi beklenir).
- **Sınır okulun ayarıdır;** okul türüne göre değişir. Varsayılanlar öneridir.
- **Kararlaştırılmayanlar:** ayarın ekranı ve yetkisi (yalnız müdür mü, "Devamsızlığı görür" yetkili de mi); öğrenciye giden metin; "sınıfın
  rehber öğretmeni"nin kim olduğu; yarım günün izinli kısmının nasıl sayılacağı; eğitim yılı mı dönem mi sayılacağı; düzeltmeyle gün
  sayısı eşiğin altına inerse şeridin kalkması; uyarının telefon bildirimi ve "Önemli" önceliğiyle gidip gitmeyeceği.

## Kardeşler ve ilgili

**Kardeşler** ([Devamsızlık ve yoklama](README.md)): [Günün durumu](gun-durumu.md) · [Tarih aralığı, gün gün / ders ders, süzgeç](tarih-araligi-ve-gorunum.md) ·
[Devamsızlığım](devamsizligim.md) · [Okulun devamsızlığı](okulun-devamsizligi.md) · ["Gelmedi" bildirimi](devamsizlik-bildirimi.md) ·
[Kim yoklama alır, kim kimi görür](yetki-ve-kapsam.md).

**İlgili:** [Servise binmedi uyarısı](../servis/servise-binmedi-uyarisi.md) · [Okumayanlara hatırlat](../mesaj/okumayanlara-hatirlat.md) ·
[Önemli etiketi](../mesaj/onemli-etiketi.md) · [Velinin bildirimleri](../bildirim/velinin-bildirimleri.md) ·
[Otomatik bildirimler](../bildirim/otomatik-bildirimler.md) · [Müdürün ana sayfası](../ana-sayfa/mudur-ana-sayfasi.md) ·
[Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md).

## Kod tarafı

- Bugün kodda yok. Bugün okulun ayarlarında devamsızlık sınırı yoktur; sayım ders saati üzerindendir, gün sayısı hesaplanmaz
  ([sunucu/bolumler/devamsizlik.md](../../sunucu/bolumler/devamsizlik.md) `devamsizlikOzeti`).
- Kodlanınca gerekenler: okul ayarı (sınırlar, eşikler), "gün gün" sayım ([Günün durumu](gun-durumu.md)), yoklama kaydedilince ya da
  düzeltilince eşik denetimi, eşik başına bir kez bildirim, velinin sayfasında şerit (öğrencininki kararlaştırılınca), müdürün "Sınıra yaklaşanlar" listesi;
  kişisel veri işlediği için KVKK aydınlatma metninin güncellenmesi ([Aydınlatma metni](../kvkk-ve-gizlilik/aydinlatma-metni.md)).
- Tanım kaydı: yerel tanım belgesi (3 Ekim 17:15 kararı); Tasarım 1 önizlemesinde henüz yok.

## Sık sorulanlar

- **Sınır kaç gün?** Okul belirler; önerilen varsayılan özürsüz 10, toplam 30 gün.
- **Yarım gün sayılır mı?** Öneri: yarım gün olarak (0,5).
- **Uyarı geldi ama raporluydu.** Raporlu günler "İzinli" yazılınca özürsüz sayıma girmez; okul yönetiminden kaydın "İzinli"ye çevrilmesini
  iste ([Okulun devamsızlığı](okulun-devamsizligi.md)).

## Sırada

- **Devamsızlık sınırı uyarısı** (kullanıcı 3 Ekim 17:15; kod Linux'ta; önizlemeye belgeler bitince eklenecek).
- Önce **Devamsızlık: tarih aralığı + "gün gün / ders ders" + süzgeç** (gün sayımı bu işle gelir).
