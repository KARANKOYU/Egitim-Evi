# Takvim ve ajanda · Takvime ekle

**Durum:** Kodda var; tasarımda ek olarak pencerenin adı "Etkinlik ekle" olur, saat aralığı ya da "Bütün gün", yer, "Kimler görür" (Öğrenciler · Veliler · Öğretmenler) ve yazı düzenleyicili not gelir, eklenen etkinlik seçilenlerin takvimine ve ajandasına girer ve onlara bildirim gider; tür seçimi pencereden kalkar (sınavlar, toplantılar ve yarıyıl tatili kendi bölümlerinden gelir) (Tasarım 1 önizlemesi).

Müdürün ya da takvim yetkilisinin okulun takvimine etkinlik, tatil, sınav ya da toplantı kaydı eklemesi.

## Ne işe yarar

Okulun kendi günleri herkesin takvimine bir kez yazılır: veli toplantısı, bilim şenliği, okula özel tatil günü, ortak sınav günü.
Eklenen kayıt okuldaki herkesin takviminde o güne renkli bir işaret olarak düşer; güne basınca başlığı ve açıklaması okunur.

## Nereden açılır

- **Bugünkü site:** Takvim → kartın üst çubuğunda **"Etkinlik ekle"** (yalnız yetkiliye görünür). Önce bir güne bastıysan pencerenin
  başlangıç tarihi o gün olur.
- **Tasarımda:** Takvim sayfasının başlığının sağında **"Etkinlik ekle"** (Tasarım 1 önizlemesinde müdürün takviminde).
- **Kimde var:** müdürde her zaman; öğretmen hesabıyla ek görev taşıyan çalışanda **"Okul takvimine etkinlik ve tatil ekler"**
  yetkisi verilmişse (hazır **"Müdür Yardımcısı"** şablonunda bu yetki var) ([Yetki listesi](../roller-yetkiler/yetki-listesi.md),
  [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md)). Öğrenci, veli, servisçi ve yetkisiz öğretmende düğme yok.
  Tasarımda (Tasarım 1'in Roller sayfası) aynı yetki "Okul hayatı" grubunda **"Takvim ve etkinlikler"** adıyla durur ve hazır
  **"Müdür yardımcısı"** ile **"Okul sekreteri"** şablonlarında işaretlidir.

## Adım adım

### Müdür ve takvim yetkilisi çalışan (bugünkü site)

1. **Takvim**'i aç. İstersen önce kaydın başlayacağı güne bas.
2. **"Etkinlik ekle"**ye bas. **"Takvime ekle"** penceresi açılır:
   - **"Başlık"** — en çok 100 harf; içinde soluk örnek yazı **"Veli toplantısı"**.
   - **"Tür"** — açılır liste: **"Etkinlik"** (seçili gelir) · **"Tatil"** · **"Sınav"** · **"Toplantı"**.
   - **"Başlangıç"** — tarih kutusu; seçili gün, gün seçmediysen bugün.
   - **"Bitiş (isteğe bağlı)"** — tarih kutusu; boş bırakırsan kayıt tek günlüktür.
   - **"Açıklama"** — 3 satırlık kutu, en çok 300 harf.
   - Altta **"Vazgeç"** ve **"Ekle"**.
3. **"Ekle"**ye bas. Düğme kısa bir süre kilitlenir.
   - **Başarılıysa:** pencere kapanır, takvim yenilenir, sayfanın üstünde yeşil ileti **"Veli toplantısı takvime eklendi."** (kendi
     başlığınla).
   - **Hata varsa:** ileti pencerenin içinde kırmızı çıkar, düğme yeniden açılır (iletiler aşağıda).
4. Kaydın takvimdeki görünüşü:
   - her gününe (başlangıçtan bitişe) türün renginde bir nokta: **Etkinlik** yeşil, **Tatil** ana renk, **Sınav** kırmızı, **Toplantı** mor;
   - **"Tatil"** türündeyse gün kutusu tatil renginde olur ve kutuda tatilin adı yazar;
   - güne basınca gün ayrıntısında tür etiketi, başlık ve açıklama; sağında **"Kaldır"** ([Takvimden kaldırma](etkinligi-kaldirma.md)).
5. Kaydı okuldaki herkes görür: öğrenciler, veliler (çocuğun okulu buysa), öğretmenler, müdür, servisçiler. Kimseye bildirim gitmez.
6. Düzeltme yoktur: yanlış eklediysen **"Kaldır"** ile kaldırıp yeniden ekle.
7. Bir öğrencinin portalındayken de "Etkinlik ekle" görünür; eklediğin kayıt yine okulun takvimine girer.

### Müdür (tasarımda)

1. Takvim sayfasının başlığının sağındaki **"Etkinlik ekle"**ye bas. **"Etkinlik ekle"** penceresi:
   - **"Etkinlik"** — ad; örnek yazı **"ör. Bilim şenliği"**, en çok 120 harf.
   - **"Tarih"** — tarih kutusu; **bugünden önceki günler seçilemez**.
   - **"Saat"** — başlangıç **"10:00"** – bitiş **"12:00"**, yanında **"Bütün gün"** onay kutusu (işaretlenince saat aranmaz).
   - **"Yer"** — örnek yazı **"ör. Spor salonu"**, en çok 120 harf (isteğe bağlı).
   - **"Kimler görür"** — çipler **"Öğrenciler"** · **"Veliler"** · **"Öğretmenler"**; üçü de seçili gelir, basınca açılıp kapanır.
   - **"Not"** — ortak yazı düzenleyici (kalın, italik, liste, bağlantı…) ([Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md)).
   - Altta **"Vazgeç"** ve **"Ekle"**.
2. **"Ekle"**: eksik ya da yanlışsa pencerede kırmızı ileti ve ilgili alan işaretlenir:
   - ad boşsa **"Etkinliğin adını yaz."**
   - tarih boşsa **"Tarihi seç."**
   - "Bütün gün" işaretli değilken bitiş başlangıçtan sonra değilse **"Bitiş saati başlangıçtan sonra olmalı."**
   - hiçbir çip seçili değilse **"Etkinliği kimlerin göreceğini seç."**
3. Başarılıysa pencere kapanır, kısa ileti: **"Bilim şenliği" takvime eklendi; seçilenlere bildirim gitti.** (tırnak içinde
   etkinliğin adı). Takvim etkinliğin ayına geçer ve o günü seçer.
4. Seçilen grupların takviminde ve ajandasında mor bir **"Etkinlik"** satırı: **"Etkinlik · 10:00–12:00 · Spor salonu"**; bütün gün
   seçildiyse **"Etkinlik · bütün gün · Spor salonu"**. Satıra basınca etkinliğin penceresi: "Tarih:", "Saat:", "Yer:", "Kimler görür:",
   "Kalan:", not ve **"Kapat"** ([Takvimdeki kayda basınca](kayit-pencereleri.md)).
5. Pencerede tür seçimi yoktur: tasarımda **sınavlar** Sınavlar bölümünden ([Sınav planlama](../sinav/sinav-planlama.md)),
   **toplantılar** Toplantılar'dan ([Toplantı açma](../toplanti/toplanti-acma.md)), **yarıyıl tatili ve dönem günleri** Eğitim yılı
   sayfasından ([Tatiller ve özel günler](tatiller-ve-ozel-gunler.md)) takvime kendiliğinden düşer.

### Öğrenci, veli, öğretmen, servisçi

- Okulun eklediği kayıtları takvimde görürler; ekleyemez ve kaldıramazlar. Tasarımda öğrenci, veli ve öğretmen yalnız kendi gruplarına
  açılan etkinlikleri görür; servisçi "Kimler görür" seçenekleri arasında yoktur.

## Kurallar ve sınırlar

- **Yetki:** sunucu her eklemede yetkiye bakar; yoksa **"Takvime ekleme yetkin yok"**.
- **Tarih:** başlangıç boş ya da bozuksa **"Tarihi GG.AA.YYYY biçiminde seç"**. Bitiş boşsa başlangıçla aynı gündür; başlangıçtan önceyse
  **"Bitiş tarihi başlangıçtan önce olamaz"**. Bugünkü sitede geçmiş bir güne de kayıt eklenebilir. Gün seçmeden açarsan başlangıç
  bugündür; ama Türkiye saatiyle 00:00–02:59 arasında dünün tarihi gelir ("Bugün" düğmesindeki aynı dünya saati açığı;
  [Ay görünümü](ay-gorunumu.md)).
- **Başlık zorunlu:** boşsa **"Başlık yaz"**. Başlık 100, açıklama 300 harfle kesilir.
- **Tür:** yalnız dört tür vardır; başka bir değer gelirse kayıt "Etkinlik" sayılır. "Sınav" ve "Toplantı" türü yalnız takvimde bir
  işarettir: Sınavlar bölümündeki bir sınava ya da Toplantılar'daki bir toplantıya bağlı değildir, saati, davetlisi, "Katıl"ı yoktur.
- **Pencerede ön denetim yok** (bugünkü site): yanlışlar sunucudan Türkçe iletiyle döner.
- **Geçmiş eğitim yılı salt okunur:** üstteki yıl seçiciyle geçmiş yıla bakan öğretmen ya da müdür ekleyemez:
  **"Geçmiş bir eğitim yılına bakıyorsun; kayıtlar salt okunur. Değişiklik için üstteki yıl seçiciden aktif yıla dön."**
  ([Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md)).
- **Yıl damgası:** kayıt eklendiği andaki eğitim yılına damgalanır (yeni yıl sihirbazı ve yedekler için); takvimde gösterirken yıla göre
  süzülmez.
- **Bildirim ve işlem kaydı yok** (bugünkü site): eklemek kimseye haber vermez ve okulun işlem kaydına yazılmaz. Tasarımda seçilenlere
  bildirim gider.
- **Tanım (yazı düzenleyici, onaylı):** takvim etkinliğinin ve ajanda notunun açıklaması ortak yazı düzenleyiciyle yazılır; kısa alanlar
  (ad, yer) düz metindir.
- **Açık soru:** tasarımdaki pencerede okula özgü bir tatil günü (ör. kar tatili, ara tatil) girecek bir seçenek yok; bugün "Tatil"
  türüyle girilir. Öneri: pencerede "Tatil (okul kapalı)" seçeneği kalsın.

## Kardeşler ve ilgili

**Kardeşler:** [Takvim sayfası](takvim-sayfasi.md) · [Ay görünümü](ay-gorunumu.md) · [Gün ayrıntısı](gun-ayrintisi.md) ·
[Takvim kimin gözünden](kimin-takvimi.md) · [Takvimden kaldırma](etkinligi-kaldirma.md) ·
[Tatiller ve özel günler](tatiller-ve-ozel-gunler.md) · [Ajanda](ajanda.md) · [Ajandanın süzgeç kutucukları](ajanda-suzgeci.md) ·
[Takvimdeki kayda basınca](kayit-pencereleri.md).

**İlgili:** [Yetki listesi](../roller-yetkiler/yetki-listesi.md) · [Hazır rol şablonları](../roller-yetkiler/hazir-sablonlar.md) ·
[Özel roller](../roller-yetkiler/ozel-roller.md) · [Toplantılar listesi](../toplanti/toplantilar.md) ·
[Sınav planlama](../sinav/sinav-planlama.md) · [Mesajdan ajandaya ve hatırlatıcıya ekleme](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md) ·
[Düzenleyicinin bulunduğu yerler](../yazi-yazma/nerelerde-var.md) · [Geçmiş yıla bakma](../egitim-yili/gecmis-yil.md) ·
[Bildirim paneli](../bildirim/bildirim-paneli.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/17-takvim.md](../../public/js/parcalar/17-takvim.md) (`takvimEtkinlikModal`: "Takvime ekle" penceresinin
  alanları), [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md) (`takvim-etkinlik-ekle`,
  `takvim-etkinlik-kaydet`: gönderme, yeşil ileti, pencere içi hata),
  [public/js/parcalar/03-mesaj-modal.md](../../public/js/parcalar/03-mesaj-modal.md) (pencere).
- Sunucu: [sunucu/bolumler/takvim.md](../../sunucu/bolumler/takvim.md) (`POST /api/takvim/etkinlik`: yetki `takvim.yonet`, tarih, başlık,
  tür, bitiş, yıl damgası), [sunucu/api.md](../../sunucu/api.md) (geçmiş yılın salt okunur kapısı, 409),
  [sunucu/yetki.md](../../sunucu/yetki.md) (`takvim.yonet`: "Okul takvimine etkinlik ve tatil ekler"; "Müdür Yardımcısı" şablonu),
  [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`takvimEkle`; tablo `takvim_etkinlikleri`),
  [sunucu/veri/json-aktarim.md](../../sunucu/veri/json-aktarim.md) (yedekte takvim kayıtları).
- Testler: [testler/test-takvim.md](../../testler/test-takvim.md) (ekleme, ters tarih aralığı, yetki, geçersiz girdi),
  [testler/yetki-denetimi.md](../../testler/yetki-denetimi.md) (etkinliği yalnız müdür ekler).
- Tasarımdaki "Etkinlik ekle" penceresi Tasarım 1 önizlemesindedir; kodlanınca bu bölüm güncellenir.

## Sık sorulanlar

- **Eklediğim etkinliği kimler görür?** Bugünkü sitede okuldaki herkes (öğrenci, veli, öğretmen, müdür, servisçi). Tasarımda yalnız
  "Kimler görür"de seçtiğin gruplar.
- **Etkinliği eklediğimde velilere bildirim gider mi?** Bugünkü sitede hayır; duyurmak için ayrıca mesaj ya da duyuru gönder. Tasarımda
  seçilenlere bildirim gider.
- **"Toplantı" türüyle eklediğim kayıtta "Katıl" düğmesi neden yok?** Takvimdeki "Toplantı" yalnız bir işarettir. Bağlantılı, davetlili
  toplantı Toplantılar bölümüyle gelecek ([Toplantılar listesi](../toplanti/toplantilar.md)).
- **Etkinliği düzeltebilir miyim?** Bugünkü sitede düzenleme yok; kaldırıp yeniden ekle.
- **Öğretmen etkinlik ekleyebilir mi?** Müdür ona "Okul takvimine etkinlik ve tatil ekler" yetkisini içeren bir rol verirse evet.

## Sırada

- Mesaj ayarları (çark), Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu: planlanan
  sınav takvime kendiliğinden "Sınav" olarak girer; eklenen etkinlik ajandaya düşer.
- Toplantılar + sınıfın uzaktan ders bağlantısı + tahta hesabı: toplantılar kendi bölümünden açılır, takvime kendiliğinden girer.
- Düzenleyiciler: takvim etkinliğinin açıklaması ortak yazı düzenleyiciyle.
- Özel roller (yeni yetkiler ve hazır şablonlar; öneri): "Okul Sekreteri / Memur" şablonunda takvim yetkisi.
- Arayüz önizlemesi (Tasarım 1): "Etkinlik ekle" penceresi (saat, yer, kimler görür, not).
