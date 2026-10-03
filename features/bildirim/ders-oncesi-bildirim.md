# Bildirimler · Ders başlamadan öğretmene bildirim

**Durum:** Kodda var; tasarımda ek olarak her dersten 10 dakika önce ayrı bildirim ("3. ders 10 dakika sonra başlıyor").

Öğretmenin, dersleri başlamadan haberdar olması: bugün sabah günün bütün derslerini sayan tek bir özet, tasarımda ayrıca her dersten
10 dakika önce kısa bir bildirim.

## Ne işe yarar

Öğretmen hangi saatte hangi sınıfa gireceğini programı açmadan görür. Kullanıcının isteği (29 Ağustos): "ders başlamadan önce falan
öğretmenede bilgi gelsin". Kullanıcı ayrıca fazladan bildirim istemiyor (25 Eylül: "fazladan bildirim gitme"); bugünkü sabah özeti
bu yüzden günde tek bildirimdir.

## Nereden açılır

Kendiliğinden gelir: öğretmenin zili ([Bildirim paneli](bildirim-paneli.md)) ve telefon bildirimini açtıysa telefonu
([Telefon bildirimi](telefon-bildirimi.md)). Bildirime basınca **Ders Programım** açılır ([Ders programım](../ders-programi/programim.md)).
Bugün kapatma ya da süre seçme ayarı yok.

## Adım adım

### Öğretmen (ve derse girdiği için ders programında adı olan herkes) — bugünkü site

1. O gün ders programında dersin varsa sabah zilinde tek bir bildirim belirir:
   **"Bugün 4 dersin var: 09:20 7-A Matematik, 10:10 7-B Matematik, 11:00 8-A Matematik, 11:50 8-B Matematik."**
   Dersler başlangıç saatine göre sıralıdır; her biri "saat sınıf ders" diye yazılır. 4'ten fazla dersin varsa ilk 4'ü ve
   "… ve 2 ders daha." yazar.
2. Bildirim sunucunun beş dakikada bir çalışan işiyle, sabah **07:00 ile 12:00 arasındaki ilk çalışmada** gider; günde bir kez.
3. Bildirime bas: Ders Programım açılır; o günün derslerini ve süren dersin yanında **"Şu an — yoklama al"** düğmesini orada
   görürsün
   ([Ders programından yoklama](../devamsizlik/programdan-yoklama.md)).
4. Dersin yoksa bildirim gelmez.

Eskiden (kodun önceki hâli) her dersten 15 dakika önce ayrı bildirim gidiyordu; günde 5–6 bildirim fazla bulunup sabah özetine
çevrildi. KILAVUZ'un "Otomatik bildirimler" tablosu hâlâ eski kuralı ("Ders başlıyor · Öğretmene · Dersten 15 dakika önce") yazıyor
(yanlış; rapor edildi).

### Tasarımda (Tasarım 1 önizlemesi)

1. O günkü her dersten **10 dakika önce** ayrı bir bildirim:
   - başlık: **"3. ders 10 dakika sonra başlıyor"** (dersin sırası);
   - ayrıntı: **"7-A · Matematik · 10:10–10:50"** (sınıf ya da sınıflar, ders, saat aralığı);
   - tür ve tarih satırı.
2. Bildirime bas: **Ders programım** açılır.
3. Bildirim panelinin sekmelerinde ders için ayrı bir tür yok; önizlemede bu bildirim **Duyuru** sekmesinde durur
   ([Bildirim sekmeleri](sekmeler.md)).
4. Önizlemede sabah özetinin örneği yok; iki bildirimin birlikte mi kalacağına dair yazılı bir karar yok.
5. Tasarım paketindeki öneri (önizlemeye girmedi, karar yok): Hesap ayarları → Bildirimler'e "Derslerimden önce hatırlat
   (5/10/15 dk)" seçeneği.

## Kurallar ve sınırlar

- **Kime:** ders programında dersi olan kişiye (dersin öğretmeni). Okul rolündeyse bildirim o öğretmen portalına yazılır; telefonuna
  bütün portallarından gelir.
- **Bir kez:** sabah özeti öğretmen başına günde bir kez gider ("gönderildi" işareti tutulur, 30 gün sonra silinir).
- **Saat:** sunucunun yerel saatine göre; sunucu Türkiye saatinde çalışmalıdır. Sunucu 07:00'de kapalıysa ve 12:00'den önce açılırsa
  özet açıldığında gider; 12:00'den sonra o gün gitmez.
- **Tatil ve kapalı gün:** bugün takvimdeki tatile bakılmaz; o gün ders programında satır varsa özet gider (kod okumasına göre).
- **Telefona:** özet de yazıldığı anda telefon bildirimine gider; Android uygulaması kendi soruş aralığıyla getirir.
- **Tasarımdaki 10 dakika:** dersin başlangıç saatinden 10 dakika önce; o güne ait dersler için.

## Kardeşler ve ilgili

**Kardeşler:** [Otomatik bildirimler](otomatik-bildirimler.md) · [Bildirim türleri ve metinleri](bildirim-metinleri.md) ·
[Bildirim sekmeleri](sekmeler.md) · [Telefon bildirimi](telefon-bildirimi.md) · [Bildirim paneli](bildirim-paneli.md).

**İlgili:** [Ders programım](../ders-programi/programim.md) · [Ders programı kurma](../ders-programi/program-kurma.md) (müdür ders
saati ekleyince "Ders programına yeni ders saatlerin eklendi." bildirimi) · [Ders programından yoklama](../devamsizlik/programdan-yoklama.md) ·
[Bildirim ayarları](../ayarlar/bildirim-ayarlari.md) · [Toplantı hatırlatması](../toplanti/hatirlatma-ve-silinme.md).

## Kod tarafı

- [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md) — `dersOzetleri` (07:00–12:00 penceresi, `gunluk-ders:<öğretmen>:<gün>`
  işareti, `listeYaz` ile en çok 4 ders, bağlantı `#/programim`); dosya başındaki yorum eski 15 dakikalık bildirimin neden
  kaldırıldığını söyler.
- [sunucu/index.md](../../sunucu/index.md) — beş dakikalık sayaç ve açılıştan 10 saniye sonraki ilk çalışma.
- Depo: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`ilkKezOlanlar`, `cokluBildir`); günün dersleri
  `depo.siniflar.baslamakUzereOlanlar` ([sunucu/veri/sema/SEMA.md](../../sunucu/veri/sema/SEMA.md), ders programı tablosu).
- Testler: [testler/test-bildirim.md](../../testler/test-bildirim.md) (program bildiriminin günde bir gitmesi).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Otomatik bildirimler" — ders satırı güncel değil).
- Tasarım: Tasarım 1 önizlemesi, öğretmen paketi ("Ders başlamadan önce öğretmene ders bildirimi").

## Sık sorulanlar

- **Her dersten önce bildirim gelmiyor.** Bugün yalnız sabah tek bir özet gelir; her dersten 10 dakika önce bildirim tasarımda.
- **Özet gelmedi.** O gün ders programında dersin yoktur ya da sunucu 12:00'den sonra açılmıştır.
- **Tatilde de özet geldi.** Bugün takvimdeki tatile bakılmıyor.

## Sırada

- Her dersten 10 dakika önce bildirim (Tasarım 1 önizlemesi): kodlanınca bu belgenin Durum satırı ve "Kod tarafı" güncellenir.
- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu (iş 8):
  bildirim türleri (sekmeler).
- KILAVUZ "Otomatik bildirimler" tablosunun koda göre düzeltilmesi (belgeleme).
