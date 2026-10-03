# Roller ve yetkiler · Rol silme

**Durum:** Kodda var; tasarımda ek olarak silme listeden değil rolün penceresindeki "Rolü sil" düğmesiyle yapılır, onay
penceresi rolü taşıyan kişi sayısını söyler ("Bu roldeki N kişinin ek yetkileri kalkar; kişiler okulda kalır.") ve silince
kısa bir ileti çıkar.

Artık gerekmeyen bir ek rolü okuldan kaldırmak; rolü taşıyanlar okulda kalır, yalnız o rolün yetkileri kalkar.

## Ne işe yarar

Okulda bir görev kalkabilir (ör. bu yıl etüt yapılmıyor) ya da bir rol yanlış açılmış olabilir. Rolü silince onu taşıyan herkesin
ek yetkileri bir anda kalkar; kimse okuldan çıkmaz, kimsenin ödevi, sınavı, etüdü silinmez.

## Nereden açılır

- **Müdür:** **"Roller ve Yetkiler"** → "Ek roller" kartında rolün satırındaki kırmızı **"Sil"**.
- Tasarımda: **"Roller ve yetkiler"** → rolün satırına bas → pencerenin sol altındaki **"Rolü sil"**.
- Hazır Öğretmen rolünde iki yerde de silme düğmesi yoktur ([Hazır Öğretmen rolü](hazir-ogretmen-rolu.md)).

## Adım adım

### Müdür

Bugün (kodda):

1. Rolün satırındaki **"Sil"**e bas.
2. Tarayıcının onay kutusu: **"Etüt Sorumlusu silinsin mi? Bu roldeki öğretmenler yalnızca Öğretmen rolüyle kalır."** (başta rolün
   adı).
3. **Tamam**: rol silinir, sayfa baştan çizilir; rol "Ek roller" kartından ve öğretmenlerin seçicilerinden kalkar. Rolü taşıyan
   öğretmenlerin seçicisi "— yalnızca Öğretmen —" görünür. İşlem kaydına **"Rol silindi"** ve rolün adı yazılır.
4. **İptal**: hiçbir şey olmaz.

Tasarımda:

1. Rolün satırına bas; pencerenin sol altında **"Rolü sil"**.
2. Onay penceresi: başlık **"Etüt sorumlusu rolü silinsin mi?"**, altında **"Bu roldeki 1 kişinin ek yetkileri kalkar; kişiler
   okulda kalır."**, düğmeler **"Vazgeç"** ve **"Sil"**.
3. "Sil": pencere kapanır, rol listeden kalkar, altta kısa ileti: **"Etüt sorumlusu rolü silindi."**

### Öğretmen

Bugün: taşıdığın ek rol silinirse yalnız hazır Öğretmen rolünün yetkileriyle kalırsın. Sunucu bir sonraki istekte artık o işleri
yapmana izin vermez; menündeki rol bölümü sayfayı yenileyince kalkar. Sana **bildirim gitmez**.

### Çalışan

Tasarımda: rolün silinmesi, o rolü taşıyan kişiden rolün alınması gibidir; başka rolü yoksa kişi **rolsüz çalışan** olur ve okulda
görünmeye devam eder ([Rolsüz çalışan](../ogretmenler-calisanlar/rolsuz-calisan.md)).

Bugün "Rol oluşturur ve düzenler" yetkili öğretmen de rol silebilir; sunucu kendi taşıdığı rolü silmesini de engellemez (bilinen
durum: ["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md)).

## Kurallar ve sınırlar

- **Hazır rol silinmez:** "Hazır Öğretmen rolü silinemez; istemediğin yetkileri kapatabilirsin." (ekranda düğmesi yok; ileti
  sunucunun).
- **Olmayan ya da başka okulun rolü:** **"Rol bulunamadı"**.
- **Taşıyanlar:** rolü taşıyanların ek rolü veritabanı kuralıyla boşalır; okuldan çıkmazlar, verdikleri ödevler, açtıkları sınavlar,
  etütleri yerinde kalır.
- **Geri alma yok:** silinen rol geri gelmez; aynı adla yeniden açıp yetkilerini yeniden seçersin ve kişilere yeniden verirsin.
- **Bildirim yok:** rol silinince taşıyanlara bildirim gitmez (yalnız rol verilince gider).
- **Hatanın yeri:** silme hatası tarayıcının uyarı kutusunda çıkar.
- **Yetki:** "Rol oluşturur ve düzenler" (müdür her zaman).

## Kardeşler ve ilgili

**Kardeşler:** [Roller ve yetkiler ekranı](roller-ekrani.md) · [Rol ekle / düzenle](rol-duzenleyici.md) ·
[Hazır Öğretmen rolü](hazir-ogretmen-rolu.md) · [Yetkiler nasıl birleşir](yetkilerin-birlesmesi.md) ·
["Rol oluşturur ve düzenler" yetkisi](rol-yonetme-yetkisi.md).

**İlgili:**

- [Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md) — rolü tek bir kişiden almak (silmeden).
- [Okuldan çıkarma](../ogretmenler-calisanlar/okuldan-cikarma.md) — kişiyi okuldan çıkarmak ayrı iştir.
- [Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md) — "Rol silindi".

## Kod tarafı

- Ön yüz: [public/js/parcalar/19f-roller.md](../../public/js/parcalar/19f-roller.md) — `rol-sil` eylemi (onay kutusu,
  `POST /api/school/role-delete`, sayfayı yeniden çizme).
- Sunucu: [sunucu/bolumler/okul.md](../../sunucu/bolumler/okul.md) — `role-delete` (`rol.yonet`, hazır rol reddi, işlem kaydı
  `rol.silindi`); [sunucu/veri/depo/roller.md](../../sunucu/veri/depo/roller.md) — `sil`; taşıyanların `ozel_rol_id`'si yabancı
  anahtar kuralıyla boşalır ([sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md)).
- Testler: [testler/test-rol.md](../../testler/test-rol.md) (silince yetkilerin düşmesi, kişi sayısı),
  [testler/test-etut.md](../../testler/test-etut.md) (hazır rolün silinememesi).

## Sık sorulanlar

- **Rolü silersem öğretmen okuldan çıkar mı?** Hayır; yalnız o rolün yetkileri kalkar.
- **Rolü tek bir kişiden almak istiyorum.** Silme; bugün o öğretmenin seçicisini "— yalnızca Öğretmen —" yap, tasarımda kişinin
  rol çipindeki × ile al ([Çalışana görev (rol) verme](../ogretmenler-calisanlar/rol-atama.md)).

## Sırada

- Özel roller (iş 24) / çalışan olarak ekleme (iş 2): silmenin rol penceresine taşınması ve onay metni; rolü kaybeden kişiye
  bildirim gidip gitmeyeceği tanımda yazılı değil (açık nokta).
