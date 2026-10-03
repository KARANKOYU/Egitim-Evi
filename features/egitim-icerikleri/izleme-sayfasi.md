# Eğitim içerikleri · İzleme sayfası

**Durum:** Tasarlandı — henüz kodda yok

Bir videonun sayfası (`/izle/<kimlik>`): üstte Eğitim Evi'nin kendi oynatıcısı, altında Beğen, Kaydet, Listeye ekle, İndir ve
Bildir düğmeleri, sonra paylaşan, kanal, sınıf ve ders, yükleme tarihi, izlenme, kaynak ve etiketler.

## Ne işe yarar

Kullanıcının 28 Eylül isteği: "bir video, başlık, açıklama ve kişinin ismi olur; YouTube düzeninin aynısı; profile tıklanmaz ama
kimden olduğu görülür" ve "hesap ismi + kanal olur, isim tıklanmaz ama kanal onun kanalına atar". Videoyu izlediğin, beğendiğin,
kaydettiğin, indirdiğin ve bildirdiğin tek yer.

## Nereden açılır

- Eğitim içerikleri listesinde bir video kartına bas ([Video listesi](video-listesi.md)).
- Doğrudan adres: `egitimevi.org/izle/<kimlik>` ya da `/watch/<kimlik>` ([Adresler](adresler.md)).
- İzleme geçmişinde, İndirdiklerim'de (**"Çevrimdışı izle"**), bir listede ya da eğitmen panelinde videonun adına basınca.

Tasarım 1 önizlemesinde izleme sayfası, liste sayfasının üstünde açılan büyük bir pencere olarak çizildi (başlıkta videonun adı ve
sağda kapatma ×); gerçek sitede kendi adresi olan sayfadır.

## Adım adım

### Herkes (ziyaretçi dahil)

1. Sayfanın başında videonun **başlığı**.
2. **Oynatıcı** açılır; listeden tıklayarak geldiysen video hemen oynamaya başlar (Tasarım 1) ([Oynatıcı](oynatici.md)). YouTube
   videosu da aynı oynatıcıda oynar, ama tanıma göre YouTube'a istek ancak kişi oynatmak için tıklayınca gider ("tıklamadan
   YouTube'a istek gitmez"): adresi doğrudan ya da arama motorundan açan önce küçük resmi ve oynat düğmesini görür.
3. Oynatıcının altında düğme satırı (aşağıda rol rol).
4. Altında bilgi listesi, bu sırayla:
   - **"Paylaşan:"** @kullanıcı adı (ör. "@deniz.ak") — düz yazı, tıklanmaz.
   - **"Kanal:"** kanalın adı (ör. "Deniz Ak Matematik") — YouTube kanalına bağlantı, yeni sekmede açılır. Yalnız YouTube'dan
     eklenen videoda; doğrudan yüklenen videoda kanal yoktur.
   - **"Sınıf ve ders:"** "7. sınıf · Matematik · Ortaokul" (kademe soluk yazıyla).
   - **"Yüklendi:"** "2 gün önce · 4,2 B izlenme".
   - **"Kaynak:"** "YouTube" ya da "Yüklenen video · 720p".
   - **"Etiketler:"** "#kesirler", "#LGS" çipleri ([Etiketler](etiketler.md)).
5. En altta küçük not: **"İçeriğin sorumluluğu yükleyen eğitmendedir."**
6. Tanıma göre videonun **açıklaması** (eğitmenin yazı düzenleyiciyle yazdığı) ve yanda **öbür videolar** da bu sayfadadır.

### Ziyaretçi (giriş yapmamış)

Düğme satırında giriş isteyen düğmelerin her biri basınca **"Bunun için giriş yap"** penceresi açar; girince aynı videoya ve aynı
düğmenin işine dönersin ([Girişsiz izleme](girissiz-izleme.md)).

**Tasarımda (Tasarım 1 önizlemesi):** ziyaretçide düğmelerin yerine tek bir **"Kaydetmek için giriş yap"** düğmesi (giriş
ekranına gider) ve sağda **"Bildir"** var.

### Giriş yapmış herkes (öğrenci, veli, öğretmen, çalışan, müdür, servisçi, eğitmen, destek, yönetici)

1. Videoyu daha önce yarıda bıraktıysan oynatıcının altında: **"Kaldığın yerden devam: 7:52 / 12:40"**; bitirdiysen **"Bu
   videoyu izledin; baştan oynuyor."** ([Kaldığın yerden devam](kaldigi-yerden-devam.md)).
2. Düğme satırı, soldan sağa:
   - **"Beğen · 312"** → basınca **"Beğendin · 313"** (dolu düğme) ([Beğen](begeni.md)),
   - **"Kaydet"** → **"Kaydedildi"** ([Kaydet ve Kaydettiklerim](kaydedilenler.md)),
   - **"Listeye ekle"** ([Oynatma listeleri](oynatma-listeleri.md)),
   - yalnız Eğitim Evi'ne yüklenen ve eğitmenin indirmeye izin verdiği videoda **"İndir · 84 MB"** → **"İndirildi · 84 MB"**
     ([İndir ve İndirdiklerim](indirdiklerim.md)),
   - sağa yaslı **"Bildir"** ([Videoyu bildir](bildir.md)).
3. İndirdiklerim'den **"Çevrimdışı izle"** ile açtıysan başlığın yanında yeşil çip: **"İndirilen kopya · internetsiz"**.

## Kurallar ve sınırlar

- **Görünen ad @kullanıcı adıdır,** tam ad değil (kullanıcı 28 Eylül: "ismi değil hesap kullanıcı adı olsun"); tıklanmaz.
  Yalnız rakamdan oluşan kullanıcı adı hiç gösterilmez ("Ali K." gibi yazılır).
- **Kanal** yalnız YouTube videosunda ve tıklanır (yeni sekme). Başkasının YouTube videosu bağlandıysa videonun ASIL kanalı
  görünür.
- **İzlenme sayısı:** giriş yapmışın izlemesi sayılır; girişsiz izleme yalnız sayı olarak (aynı yerden aynı videoya saatte bir).
- **Yorum yok** (kullanıcıya önerildi; istenirse sonra).
- **Kaldırılan video** sayfası açılmaz (404); listelerde "Bu video kaldırıldı" satırı kalır.
- **Pencere kapanınca video durur** (Tasarım 1); sayfadan ayrılınca da.
- Arama motorları izleme sayfasını dizinleyebilir (başlık, açıklama, küçük resim) ([Adresler](adresler.md)).

**Tasarımda (Tasarım 1 önizlemesi) tanımdan farklı olanlar:** "Kanal:" satırı yüklenen videolarda da görünüyor (tanımda yalnız
YouTube'da) ve kanal, videonun kendi YouTube bilgisinden değil eğitmenin hesabındaki "Kanal bağlantısı" ayarından geliyor
([YouTube bağlantısı](youtube-baglantisi.md)); "İndir" düğmesi eğitmenin "İndirmeye izin ver" anahtarına bakmadan her yüklenen videoda
çıkıyor; açıklama ve yanda öbür videolar yok.

## Kardeşler ve ilgili

**Kardeşler** (aynı klasör, [Eğitim içerikleri](README.md)):

- [Oynatıcı](oynatici.md), [Tam ekran](tam-ekran.md), [Klavye kısayolları](klavye-kisayollari.md), [Oynatma hızı](hiz.md),
  [Kalite](kalite.md), [Ses ve sessiz](ses.md), [Altyazı](altyazi.md) — oynatıcının parçaları.
- [Beğen](begeni.md), [Kaydet ve Kaydettiklerim](kaydedilenler.md), [Oynatma listeleri](oynatma-listeleri.md),
  [İndir ve İndirdiklerim](indirdiklerim.md), [Videoyu bildir](bildir.md) — düğme satırı.
- [Kaldığın yerden devam](kaldigi-yerden-devam.md), [Girişsiz izleme](girissiz-izleme.md), [Adresler](adresler.md).
- [İçerik sorumluluğu ve yükleme koşulları](sorumluluk-ve-kosullar.md) — alttaki not.

**İlgili:**

- [Dışarı giden veriler](../kvkk-ve-gizlilik/disari-giden-veriler.md) — YouTube'a ne zaman istek gider.
- [Kullanıcı adı](../giris-hesap/kullanici-adi.md) — rakamdan oluşan adın gösterilmemesi.

## Kod tarafı

Bugün kodda yok. Kodlanınca kullanacağı bugünkü parçalar:

- Parça parça (HTTP Range, 206) video sunan `medyaGonder`: [sunucu/bolumler/odev-dosya.md](../../sunucu/bolumler/odev-dosya.md).
- Güvenlik başlıkları (CSP'ye `frame-src` için `youtube-nocookie.com` eklenecek): [sunucu/http.md](../../sunucu/http.md).
- Yönlendirici: [public/js/parcalar/07-yonlendirme.md](../../public/js/parcalar/07-yonlendirme.md).

## Sık sorulanlar

- **Eğitmenin adına basınca bir şey olmuyor.** Doğru; paylaşan tıklanmaz. YouTube videosunda "Kanal" bağlantısı kanala götürür.
- **"İndir" düğmesi yok.** YouTube videoları indirilemez; Eğitim Evi'ne yüklenen videoda da eğitmen izin vermemiş olabilir.
- **Yorum yazabilir miyim?** Hayır; yorum yok. Bir sorun görürsen "Bildir".

## Sırada

- Eğitim içerikleri (iş 17): izleme sayfası, açıklama ve "öbür videolar" sütunu.
- Önizlemedeki üç fark (kanal satırı, indirme izni, açıklama) HTML işinde tanıma göre düzeltilecek.
