# Takvim ve ajanda · Takvimden kaldırma

**Durum:** Kodda var

Okulun takvime eklediği bir kaydı (etkinlik, tatil, sınav, toplantı) gün ayrıntısındaki "Kaldır" düğmesiyle silmek. Tasarım 1
önizlemesinde eklenen etkinliğin penceresinde yalnız "Kapat" var; kaldırma ve düzenleme orada henüz çizilmedi (aşağıda "Tasarımda").

## Ne işe yarar

Yanlış eklenen ya da iptal edilen bir okul kaydını (ör. ertelenen veli toplantısı) takvimden kaldırırsın. Bugünkü sitede kaydı
düzenleme yolu yoktur; tarihi ya da başlığı değişen bir kaydı kaldırıp yeniden eklersin ([Takvime ekle](etkinlik-ekleme.md)).

## Nereden açılır

- Takvim → kaydın bulunduğu güne bas → gün ayrıntısında kaydın satırının sağında **"Kaldır"** ([Gün ayrıntısı](gun-ayrintisi.md)).
- Düğme yalnız **okulun eklediği** kayıtlarda ve yalnız **takvim yetkilisine** (müdür; "Okul takvimine etkinlik ve tatil ekler"
  yetkisi olan çalışan) görünür. Resmî tatillerde, özel günlerde ve ödevlerde yoktur.

## Adım adım

### Müdür ve takvim yetkilisi çalışan (bugünkü site)

1. Takvim'de kaydın günlerinden birine bas (çok günlük kayıtta herhangi biri olur).
2. Gün ayrıntısında kaydın satırında **"Kaldır"**a bas.
3. Tarayıcı sorar: **"Bu kayıt takvimden kaldırılsın mı?"** — **"Tamam"** ya da **"İptal"**.
4. "Tamam" → kayıt silinir, takvim yeniden çizilir; seçili gün korunduğu için gün ayrıntısı da yenilenir ve satır kalkar. Ayrıca bir
   başarı iletisi çıkmaz.
5. Hata olursa tarayıcının uyarı kutusunda ileti çıkar (ör. **"Kayıt bulunamadı"**); takvim olduğu gibi kalır.
6. Çok günlük bir kaydın hangi gününden kaldırırsan kaldır kaydın **bütün günleri** birden gider (tek kayıttır).

### Öğrenci, veli, öğretmen, servisçi

- "Kaldır" düğmesini görmezler. Kaldırılan kayıt takvimlerinden bir sonraki açılışta kalkar; kimseye bildirim gitmez.

### Tasarımda

- Tasarım 1 önizlemesinde müdürün eklediği etkinliğe basınca açılan pencerede "Tarih:", "Saat:", "Yer:", "Kimler görür:", "Kalan:" ve
  **"Kapat"** var; **silme ve düzenleme düğmesi çizilmemiş** ([Takvimdeki kayda basınca](kayit-pencereleri.md)).
- Kullanıcının genel kuralı (2 Ekim): silme her yerde **onaylı** olmalı ("silmek istiyor musun" diye sorulmalı). Bugünkü "Kaldır" bu
  kurala uyuyor (tarayıcı onayı).
- Tasarımın öbür bölümlerindeki karşılıklar: toplantının iptali Toplantılar'da ([Toplantının penceresi](../toplanti/toplanti-penceresi.md)),
  sınavın silinmesi Sınavlar'da (**"Sınav öğrencilerin takviminden de kalkar."** — [Sınav planlama](../sinav/sinav-planlama.md)),
  hatırlatıcının silinmesi Hatırlatıcı penceresinde (**"Hatırlatıcı takvimden ve ajandadan da kalkar."** —
  [Takvimde ve ajandada hatırlatıcılar](../hatirlatici/takvimde-ve-ajandada.md)). Hepsi takvimden ve ajandadan da kalkar.
- Öneri: tasarımdaki etkinlik penceresine yetkili için "Düzenle" ve onaylı "Sil" eklenmeli; silinince seçilen gruplara "etkinlik iptal
  edildi" bildirimi gidip gitmeyeceği kullanıcıya sorulmalı.

## Kurallar ve sınırlar

- **Yetki:** sunucu her silmede yetkiye bakar; yoksa **"Yetkin yok"**.
- **Başka okulun ya da olmayan kayıt:** **"Kayıt bulunamadı"**. Yalnız kendi okulunun kayıtlarını silebilirsin.
- **Geri alınmaz:** kayıt veritabanından silinir; çöp kutusu yoktur.
- **Geçmiş eğitim yılı salt okunur:** geçmiş yıla bakan öğretmen ya da müdür silemez: **"Geçmiş bir eğitim yılına bakıyorsun; kayıtlar
  salt okunur. Değişiklik için üstteki yıl seçiciden aktif yıla dön."** Sunucu kaydın hangi yıla damgalandığına ayrıca bakmaz.
- **İşlem kaydı yok:** kaldırma okulun işlem kaydına yazılmaz (ekleme de yazılmaz).
- **Resmî tatiller kaldırılamaz:** kodda sabit listedir ([Tatiller ve özel günler](tatiller-ve-ozel-gunler.md)).
- **Silme de POST isteğidir** (kodun geri kalanı gibi): ayrıntı kod belgesinde.

## Kardeşler ve ilgili

**Kardeşler:** [Takvim sayfası](takvim-sayfasi.md) · [Ay görünümü](ay-gorunumu.md) · [Gün ayrıntısı](gun-ayrintisi.md) ·
[Takvim kimin gözünden](kimin-takvimi.md) · [Takvime ekle](etkinlik-ekleme.md) · [Tatiller ve özel günler](tatiller-ve-ozel-gunler.md) ·
[Ajanda](ajanda.md) · [Ajandanın süzgeç kutucukları](ajanda-suzgeci.md) · [Takvimdeki kayda basınca](kayit-pencereleri.md).

**İlgili:** [Toplantının penceresi](../toplanti/toplanti-penceresi.md) · [Sınav planlama](../sinav/sinav-planlama.md) ·
[Takvimde ve ajandada hatırlatıcılar](../hatirlatici/takvimde-ve-ajandada.md) · [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md) ·
[Neler kaydedilir](../islem-kaydi/neler-kaydedilir.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) (`takvimGunCiz`: yalnız `silinebilir` kayıtta ve
  `yonetebilir` iken "Kaldır"), [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`takvim-etkinlik-sil`:
  tarayıcı onayı, istek, `git('takvim')`, `hataGoster`).
- Sunucu: [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md) (`POST /api/takvim/etkinlik-sil { id }`: yetki, okul denetimi,
  "Silindi."), [sunucu/api.md](../../sunucu/api.md) (geçmiş yılın salt okunur kapısı),
  [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`takvimBul`, `takvimSil`).
- Testler: [testler/test-takvim.md](../../testler/test-takvim.md) (silme ve yetki).

## Sık sorulanlar

- **"Kaldır" düğmesini göremiyorum.** Ya kaydı okul eklemedi (resmî tatil, özel gün, ödev) ya da takvim yetkin yok. Yetkiyi müdür verir.
- **3 günlük geziyi yalnız bir günden kaldırmak istiyorum.** Olmaz; kayıt tek parçadır. Kaldırıp istediğin günlerle yeniden ekle.
- **Yanlışlıkla sildim, geri alabilir miyim?** Hayır; yeniden eklemen gerekir.
- **Geçmiş yıla bakarken neden silemiyorum?** Geçmiş yıl salt okunurdur; üstteki yıl seçiciden aktif yıla dön.

## Sırada

- Arayüz önizlemesi (Tasarım 1): etkinlik penceresinde yetkiliye düzenleme ve onaylı silme (öneri; kullanıcıya sorulacak).
- Toplantılar + sınıfın uzaktan ders bağlantısı + tahta hesabı: toplantının iptali takvimden ve ajandadan da kaldırır.
- Mesaj ayarları (çark), Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: silinen
  sınav ve duyuru takvimden ve ajandadan da kalkar.
