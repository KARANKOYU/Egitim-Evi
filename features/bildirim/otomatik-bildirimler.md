# Bildirimler · Otomatik bildirimler

**Durum:** Kodda var; tasarımda ek olarak ödev hatırlatma kuralları ("son günden 1 gün önce 19:00"…), sınav, toplantı ve
duyuru hatırlatmaları, her dersten 10 dakika önce öğretmene bildirim, sessiz saatlerde bekletme, eylülde yeni yıl sorusu ve
"bugün servise binmedi" uyarısı.

Kimse o an bir düğmeye basmadan, zamanı gelince ya da bir ölçüm (konum, süre, disk) bir sınırı geçince sunucunun kendiliğinden
gönderdiği bildirimler.

## Ne işe yarar

Bir şeyi unutmaman ya da kaçırmaman için: öğretmen günün derslerini sabah görür, öğrenci yarın teslim edeceği ödevi akşamdan
öğrenir, veli servis eve yaklaşınca haberdar olur, müdür okulun dosya alanı dolmadan uyarılır. Kullanıcının isteği (29 Ağustos):
"ders başlamadan önce falan öğretmenede bilgi gelsin ve ödev son gününe bir gün kalada öğrencilere"; (25 Eylül) "yarın .. dersinden
odev_adi ödevi var".

## Nereden açılır

Bu bildirimler kendiliğinden gelir; zilde ([Bildirim paneli](bildirim-paneli.md)) ve telefon bildirimini açtıysan telefonunda
görürsün. Kapatma ya da sıklık ayarı bugün yok (kişisel hatırlatıcılar hariç: onları kendin kurarsın,
[Hatırlatıcılar](../hatirlatici/README.md)).

## Adım adım

### Bugün kodda olanlar

| Bildirim | Kime | Ne zaman | Metin (örnek) |
|---|---|---|---|
| Günün dersleri | Dersi olan öğretmene | Sunucunun beş dakikalık işinin sabah 07:00–12:00 arasındaki ilk çalışmasında, günde bir | "Bugün 4 dersin var: 09:20 7-A Matematik, 10:10 7-B Matematik, …" → Ders Programım |
| Yarın son günü olan ödev | Öğrenciye (velisine kopyası) | 08:00'den sonraki ilk çalışmada, günde bir; birden çok ödev tek bildirimde | "Yarın Matematik dersinden "Kesirler" ödevin var (son saat 12:00)." → Ödevler |
| Kişisel hatırlatıcı | Kuran kişiye (öğrencininki veliye gitmez) | Dakikada bir bakılır; zamanı gelince | "Hatırlatma: Beden eğitimi kıyafeti" ([Hatırlatma bildirimi](../hatirlatici/hatirlatma-bildirimi.md)) |
| Quiz sonucu açıldı | Öğrenciye (velisine kopyası) | Sonuç son teslimden sonra kendiliğinden açılınca; dakikada bir bakılır, her öğrenciye bir kez | "Matematik dersinden "Oran orantı" quizinin sonucu açıklandı." ([Quiz sonuçları](../quiz/sonuclar.md)) |
| Servis yaklaşıyor | Öğrenciye ve velisine | Servisçinin konumu eve 500 m ve 100 m kalınca, her seferde eşik başına bir kez | "Servis evine 100 metreden yakın, hazırlan." ([Servis yaklaşıyor](../servis/yaklasma-bildirimi.md)) |
| Dosya alanı %80 / doldu | Okulun müdür(ler)ine ve sistem yöneticisine | Bir yükleme sınırı geçirince, her seviyede bir kez | "Okulun dosya alanının %80'i doldu (…)" ([Dosya alanı uyarıları](../okul-disk/uyarilar.md)) |
| Çocuğun telefonunda süre sınırı | Velilere | Telefon süreleri gönderdiğinde (15 dakikada bir), sınır başına günde bir | "Elif Yılmaz bugün telefonda toplam 2 sa 40 dk geçirdi (sınır 2 sa)." ([Süre sınırı](../aile/sure-siniri.md)) |

Ayrıca bir kişinin bir işi yaptığı anda giden bildirimler (yeni ödev, sonuç, yoklama, mesaj…) bu sayfanın değil
[Bildirim türleri ve metinleri](bildirim-metinleri.md)'nin konusudur.

### Öğretmen

1. O gün ders programında dersin varsa sabah zilinde günün özeti durur: saat, sınıf ve ders, saat sırasıyla; 4'ten fazla dersin
   varsa ilk 4'ü ve "… ve 2 ders daha".
2. Bildirime bas: **Ders Programım** açılır.
3. Özet günde bir kez gelir. Sunucu sabah 07:00'de kapalıysa 12:00'den önce açıldığında yine gelir; 12:00'den sonra o gün gelmez.

### Öğrenci

1. Yarın son günü olan, henüz sonuçlanmamış ödevin varsa sabah 08:00'den sonra bildirim gelir: tek ödevde dersi, adı ve son saati;
   birden çok ödevde sayısı ve listesi.
2. Bildirime bas: **Ödevler** açılır.
3. Ödevin sonuçlandıysa hatırlatma gelmez. Okul ödev bölümünü kapattıysa hiç gelmez.

### Veli

Öğrencinin "yarın ödevin var" ve "quizin sonucu açıklandı" bildirimleri başında çocuğun adıyla sana da gelir
([Öğrencinin bildirimi veliye de](velinin-bildirimleri.md)); servis yaklaşma ve Aile sınırı bildirimleri sana kendi metniyle gelir.

### Müdür ve sistem yöneticisi

Dosya alanı %80'e varınca ve dolunca birer kez bildirim gelir; bağlantısızdır ([Dosya alanı uyarıları](../okul-disk/uyarilar.md)).

### Tasarımda (tanımlar ve Tasarım 1 önizlemesi)

- **Her dersten 10 dakika önce** öğretmene "3. ders 10 dakika sonra başlıyor" / "7-A · Matematik · 10:10–10:50"
  ([Ders başlamadan öğretmene bildirim](ders-oncesi-bildirim.md)).
- **Ödev hatırlatma kuralları** (mesaj-ajanda tanımı §6): Ayarlar'da "Ödev hatırlatmaları" — bütün ödevler için varsayılan kural:
  "son günden 1 gün önce 19:00", "son güne kadar her gün 19:00", "son gün 08:00" ya da kapalı (birden çok seçilebilir); ödevin
  penceresindeki "Hatırlat" ile ödev başına değiştirme. Ödev sonuçlanınca, öğrenci teslim edince (dosya yükleyince ya da quizi
  bitirince) ya da son gün geçince hatırlatmalar durur. Veli kendi için aynı kuralı kurar (bildirim çocuğun adıyla). Bugünkü "yarın
  ödevin var" bildirimi varsayılan kurala katılır, iki kez gitmez ([Ödev hatırlatmaları](../odev/hatirlatmalar.md)).
- **Sınav hatırlatması**: planlanan sınavdan 1 gün önce 19:00'da öğrenciye ve veliye (okul saati değiştirebilir); sınavın tarihi
  değişince bildirim ([Sınav planlama](../sinav/sinav-planlama.md)).
- **Toplantı hatırlatması**: 1 gün önce ve 15 dakika önce; toplantı açılınca "Toplantı başladı · `<ad>`"
  ([Hatırlatma ve silinme](../toplanti/hatirlatma-ve-silinme.md)).
- **Duyurudan hatırlatıcı**: duyuruyu yazan "Hatırlatıcı kur" derse alıcıların hatırlatıcısına kayıt düşer; zamanı gelince
  bildirim ([Ajandaya ve hatırlatıcıya ekle](../mesaj/ajandaya-ve-hatirlaticiya-ekle.md)).
- Otomatik değil ama yakın: duyuruyu gönderenin tek tıkla okumayanlara yeniden bildirim göndermesi (3 Ekim kararı)
  ([Okumayanlara hatırlat](../mesaj/okumayanlara-hatirlat.md)).
- **Sessiz saatler** (okulun mesaj ayarı, öneri): 22:00–07:00 arası öğrenci ve veli mesajı gönderilir ama bildirimi sabah gider;
  duyurular muaf değil ama gece duyurusunda uyarı çıkar ([Okulun mesaj ayarları](../mesaj/okulun-mesaj-ayarlari.md)).
- **"Bugün servise binmedi"** (3 Ekim kararı): sabah seferi "Okula vardık" ile bitince, "Bindi" işaretlenmemiş ve "binmeyecek"
  denmemiş her öğrencinin velisine "Elif bugün sabah servise binmedi (Servis 3, 07:52)"; akşam "Can akşam servisine binmedi" ve
  okul idaresine bilgi; "Önemli" önceliğinde ([Servis](../servis/README.md)).
- **Şikâyet etiketi**: bir hafta içinde bakılmayan şikâyet silinir ve gönderene "Şikâyetine bir hafta içinde bakılmadı ve silindi"
  gider ([Şikâyet etiketi](../mesaj/sikayet-etiketi.md)).
- **Yıl geçişi**: 1–15 Eylül arası müdüre bir kez "Yeni eğitim yılını açmak ister misin?"
  ([Yeni yıl sihirbazı](../egitim-yili/yeni-yil-sihirbazi.md)).
- **Eğitim içerikleri**: YouTube'dan kalkan video iki denetimde üst üste görülürse silinir, yükleyene bildirim
  ([YouTube denetimi](../egitim-icerikleri/youtube-denetimi.md)).
- **Tasarım 1 önizlemesinde** ayrıca öğretmene "Yoklama alınmadı" / "7-A · 3. ders (10:10–10:50)" ve müdüre
  "3 sınıfta yoklama alınmadı" / "2. ders · 6-B, 7-C, 8-A" örnekleri var; ne zaman gideceği tanımlarda yazılı değil.

## Kurallar ve sınırlar

- **Aynı bildirim iki kez gitmez:** her otomatik bildirim için "gönderildi" işareti tutulur (ders özeti öğretmen+gün, ödev
  hatırlatması öğrenci+yarın, quiz öğrenci+ödev, servis eşiği sefer+öğrenci+metre, disk okul+seviye, Aile öğrenci+gün+sınır).
  Ders özeti ve ödev hatırlatmasının işaretleri 30 gün sonra silinir.
- **Çalışma aralıkları:** ders özeti ve ödev hatırlatması beş dakikada bir (sunucu açıldıktan 10 saniye sonra da bir kez);
  hatırlatıcılar ve quiz sonuçları dakikada bir; servis yaklaşması konum geldikçe; disk her yüklemede; Aile telefon süre
  gönderdikçe.
- **Saat:** zamanlar sunucunun yerel saatine göredir; sunucu Türkiye saatinde (`TZ=Europe/Istanbul`) çalışmalıdır, yoksa özetler
  yanlış saatte gider.
- **Tatil ayrımı yok:** ders özeti o gün ders programında satır varsa takvimdeki tatile bakmadan gider (kod okumasına göre).
- **Kapalı bölüm:** okul ödev bölümünü kapattıysa ödev hatırlatması gitmez. Ders özeti için böyle bir denetim yok.
- **Ödev hatırlatmasının ölçütü:** yalnız sonucun girilip girilmediğine bakılır; öğrencinin dosya yüklemiş olması bugün hatırlatmayı
  durdurmaz (tasarımda durdurur).
- **Telefona:** otomatik bildirimler de yazıldığı anda telefon bildirimine gider ([Telefon bildirimi](telefon-bildirimi.md)).
- **KILAVUZ yanlış:** KILAVUZ'un "Otomatik bildirimler" tablosu öğretmene "Ders başlıyor — Dersten 15 dakika önce" der; kodda bu
  bildirim kaldırıldı, yerine sabah özeti gidiyor. Aynı tablodaki "Ders programa eklendi" ve "Sınıfa yerleştirildin" beş dakikalık
  denetimle değil, müdür işi yaptığı anda gider.

## Kardeşler ve ilgili

**Kardeşler:** [Ders başlamadan öğretmene bildirim](ders-oncesi-bildirim.md) · [Bildirim türleri ve metinleri](bildirim-metinleri.md) ·
[Bildirim paneli](bildirim-paneli.md) · [Telefon bildirimi](telefon-bildirimi.md) · [Öğrencinin bildirimi veliye de](velinin-bildirimleri.md).

**İlgili:** [Ödev hatırlatmaları](../odev/hatirlatmalar.md) · [Hatırlatma bildirimi](../hatirlatici/hatirlatma-bildirimi.md) ·
[Quiz sonuçları](../quiz/sonuclar.md) · [Servis yaklaşıyor](../servis/yaklasma-bildirimi.md) ·
[Dosya alanı uyarıları](../okul-disk/uyarilar.md) · [Süre sınırı](../aile/sure-siniri.md) ·
[Sınav planlama](../sinav/sinav-planlama.md) · [Toplantı hatırlatması](../toplanti/hatirlatma-ve-silinme.md) ·
[Ajanda](../takvim/ajanda.md) · [Ders programım](../ders-programi/programim.md).

## Kod tarafı

- [sunucu/hatirlatma.md](../../sunucu/hatirlatma.md) — `dersOzetleri` (07:00–12:00, `listeYaz` en çok 4), `odevHatirlatmalari`
  (08:00 sonrası, `bitisiOlanlar`, kapalı ödev bölümü), `hatirlatmalariCalistir` (30 günlük işaret temizliği);
  [sunucu/index.md](../../sunucu/index.md) (beş dakikalık sayaç ve açılıştan 10 saniye sonraki çalışma, dakikalık hatırlatıcı ve
  quiz işleri).
- [sunucu/bolumler/hatirlatici.md](../../sunucu/bolumler/hatirlatici.md) (`hatirlaticilariGonder`),
  [sunucu/bolumler/quiz.md](../../sunucu/bolumler/quiz.md) (`quizTemizle` → `sonuclariBildir`),
  [sunucu/bolumler/okul-hayati.md](../../sunucu/bolumler/okul-hayati.md) (`yaklasmaBildir`),
  [sunucu/bolumler/okul-disk.md](../../sunucu/bolumler/okul-disk.md) (`uyar`), [sunucu/bolumler/aile.md](../../sunucu/bolumler/aile.md)
  (`sinirlariDenetle`).
- Tekrar önleme: [sunucu/veri/depo/genel.md](../../sunucu/veri/depo/genel.md) (`ilkKezOlanlar`, `hatirlatmaTemizle`).
- Testler: [testler/test-bildirim.md](../../testler/test-bildirim.md), [testler/test-hatirlatici.md](../../testler/test-hatirlatici.md),
  [testler/test-servis-konum.md](../../testler/test-servis-konum.md) (500 m ve 100 m).
- Kullanıcıya dönük anlatım: [belge/KILAVUZ.md](../../belge/KILAVUZ.md) ("Otomatik bildirimler" — ders tablosu güncel değil).

## Sık sorulanlar

- **Ders özeti öğleden sonra geldi.** Gelmez: özet yalnız 07:00–12:00 arasında gider. Sunucu sabah kapalıysa açıldığı saat 12:00'den
  önceyse o an gelir.
- **Tatil günü ders özeti geldi.** Bugün takvimdeki tatile bakılmıyor.
- **Dosyayı yükledim, yine "yarın ödevin var" geldi.** Bugün hatırlatma yalnız sonucun girilip girilmediğine bakar.

## Sırada

- Mesaj ayarları, Bu mesajı bildir, Ajanda, sınav planlama, duyurudan ajanda+hatırlatıcı, ödev hatırlatma otomasyonu (iş 8):
  ödev ve sınav hatırlatma kuralları, sessiz saatler, duyurudan hatırlatıcı.
- Toplantılar (iş 21): toplantı hatırlatmaları.
- Yıl geçişi (iş 9): eylül bildirimi.
- Mesaj etiketleri (iş 28) ve 3 Ekim kararı: okumayanlara hatırlatma, şikâyet süreleri, "bugün servise binmedi".
- KILAVUZ "Otomatik bildirimler" tablosunun koda göre düzeltilmesi (belgeleme).
