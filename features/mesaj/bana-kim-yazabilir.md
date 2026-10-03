# Mesajlar · Bana kim yazabilir ve engelleme

**Durum:** Kodda var; tasarımda ek olarak kişinin ayarı okulun mesaj ayarlarını daraltır, genişletemez (tanım: okulun mesaj ayarları).

Kendine kimin mesaj yazabileceğini seçmek (herkes / yalnız öğretmen ve yöneticiler / kimse) ve engellediğin kişileri görmek.

## Ne işe yarar

Veli ya da öğretmen gereksiz mesajlardan korunmak için mesaj almayı daraltabilir ya da kapatabilir. Okul duyuruları bu ayara
takılmaz: önemli haberler her durumda ulaşır.

## Nereden açılır

"Mesajlar" sayfasının altında **"Bana kim yazabilir?"** kartı (öğrencide yok).

## Adım adım

### Veli, öğretmen, müdür, servisçi — bugünkü site

1. "Mesajlar"ı aç; listenin altında **"Bana kim yazabilir?"** kartı. Üstte ipucu: **"Duyurular bu ayardan etkilenmez — okul
   duyuruları her hâlükârda ulaşır."**
2. Üç seçenekten birini işaretle:
   - **"Okuldaki herkes yazabilir"** (varsayılan),
   - **"Yalnızca öğretmen ve yöneticiler yazabilir"** (öğrenci, veli ve servisçi sana yazamaz),
   - **"Kimse yazamasın"**.
3. **"Ayarı kaydet"** → kartın altında **"Ayar kaydedildi."**
4. Engellediğin biri varsa kartta **"Engellediklerin"** başlığı altında adı, rolü ve **"Engeli kaldır"** düğmesi. Basınca engel
   kalkar ve sayfa yenilenir.

### Sana yazmak isteyen kişi

- "Yeni mesaj" penceresinde adın soluk görünür, seçilemez: **"· mesaj almıyor"**.
- Toplu mesajda (sınıf, rol, okul) sen elenirsin; gönderenin iletisinin sonunda **"1 kişi mesaj almayı kapatmış."** yazar.
- Yalnız sen seçildiysen: **"Alıcı kalmadı. Seçtiğin kişiler mesaj almayı kapatmış olabilir."**

### Öğrenci

Bu kart öğrencide yok: okulda herkes öğrenciye yazabilmeli; öğrencinin başka öğrenciye yazamaması zaten sunucuda sabit kuraldır.

### Tasarımda

- Kişinin kendi ayarı okulun ayarını **daraltır, genişletemez** (ör. okul "veliler yalnız çocuğunun öğretmenlerine yazabilir"
  dediyse kişisel ayar bunu açamaz) ([Okulun mesaj ayarları](okulun-mesaj-ayarlari.md)).
- Tasarım 1 önizlemesinin Mesajlar sayfasında bu kart çizilmemiş; kaldırılması için bir karar yok.

## Kurallar ve sınırlar

- **Ne etkilenir:** yalnız kişisel mesajlar. Duyurular ve anketler bu ayara ve engel listesine bakmaz. Çocuğuna giden mesajların
  velideki kopyası da bakmaz ([Velinin kopyası](velinin-kopyasi.md)).
- **"Yalnızca öğretmen ve yöneticiler":** gönderen öğretmen ya da müdür değilse (öğrenci, veli, servisçi) mesaj gitmez.
  Öğretmen hesabıyla çalışan özel roller (Müdür Yardımcısı, Rehber Öğretmen…) öğretmen sayılır.
- **Engel listesi:** engellediğin kişi, ayarın ne olursa olsun sana kişisel mesaj yazamaz. Liste en çok 200 kişi tutar ve yalnız
  okulundaki kişileri; okuldan ayrılan kişi bir sonraki kayıtta listeden düşer.
- **Geçersiz seçim:** sunucu üç seçenek dışındakini **"Geçersiz seçim"** diye reddeder.
- **Bilinen açıklar** (kod okumasına göre):
  - **Engellemenin ekranda yolu yok:** kart "Engellediklerin"i gösterir ve "Engeli kaldır" verir, ama birini engelleme düğmesi
    hiçbir yerde yok; liste bugün ancak doğrudan sunucuya istekle dolar. (Sitenin Sık Sorulan Sorular metni "istemediğin kişiyi
    engelleyebilirsin" der; ekranda bu bugün yapılamıyor — rapor edildi.)
  - **"Engeli kaldır" kaydedilmemiş seçimi siler:** seçeneği değiştirip "Ayarı kaydet"e basmadan engel kaldırırsan sayfa yeniden
    çizilir ve yeni seçimin kaybolur (kayıtlı ayar korunur).
  - Öğrencide kart yokken sayfa her açılışta ayarı yine de sunucudan çeker.

## Kardeşler ve ilgili

**Kardeşler:** [Okulun mesaj ayarları](okulun-mesaj-ayarlari.md) · [Yeni mesaj ve alıcı seçimi](yeni-mesaj.md) ·
[Duyuru](duyuru.md) · [Velinin kopyası](velinin-kopyasi.md) · [Bu mesajı bildir](bu-mesaji-bildir.md) (rahatsız edici mesajı
yönetime bildirmek).

**İlgili:** [Bildirim ayarları](../ayarlar/bildirim-ayarlari.md) (bildirimleri kapatmak ayrı bir şeydir) ·
[Kim neyi görür](../kvkk-ve-gizlilik/kim-neyi-gorur.md) · [Sık sorulanlar (açılış sayfası)](../acilis-sayfasi/sss.md).

## Kod tarafı

- Ön yüz: [public/js/parcalar/19-mesajlar.md](../../public/js/parcalar/19-mesajlar.md) — `SAYFALAR.mesajlar` (kart, `IZIN_AD`,
  `name="mesajIzin"`, "Engellediklerin"), `S.mesajAyarGecici`; [public/js/parcalar/25-tiklama.md](../../public/js/parcalar/25-tiklama.md)
  — `mesaj-ayar-kaydet`, `mesaj-engel-kaldir`.
- Sunucu: [sunucu/bolumler/mesaj.md](../../sunucu/bolumler/mesaj.md) — `GET` / `POST /api/mesajlar/ayar`, `KIMDEN`,
  `mesajKimden`, `mesajGidebilirMi`, `GET /api/mesajlar/hedefler` (`kapali`).
- Depo: [sunucu/veri/depo/kullanicilar.md](../../sunucu/veri/depo/kullanicilar.md) — `mesaj_kimden` sütunu, `mesaj_engelleri`
  tablosu (`engelliler`, `engelleriYaz`, `engelHaritasi`).
- Testler: [testler/test-mesaj.md](../../testler/test-mesaj.md) (izin ayarı `personel`: veli yazamaz, öğretmen yazabilir; engel
  listesi; duyurunun ayarları aşması).

## Sık sorulanlar

- **Mesaj almayı kapattım ama duyuru geldi.** Duyurular bu ayardan etkilenmez.
- **Birini nasıl engellerim?** Bugün ekranda engelleme düğmesi yok; rahatsız edici mesajı okul yönetimine bildirmek tasarımda
  "Bildir" ile olacak. Şimdilik ayarı "Yalnızca öğretmen ve yöneticiler yazabilir" yapabilirsin.
- **Öğrenci neden bu ayarı göremiyor?** Okulda herkes öğrenciye yazabilmeli; öğrenciler zaten birbirine yazamaz.

## Sırada

- Mesaj ayarları (çark): okulun ayarı; kişinin ayarı okulunkini yalnız daraltır.
- Mesaj ayarları, Bu mesajı bildir işi: alınan mesajda "Bildir".
