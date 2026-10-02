# public/js/parcalar/25-tiklama.js

Arayüzün tıklama merkezi: belgedeki her `data-nav` / `data-act` tıklamasını tek dinleyiciyle yakalayıp sayfaya ya da
eyleme dağıtan `tiklamaKur` + `islem`, üst şeridin düğmeleri, geri/ileri tuşu ve sekmeyi kapatma sorusu, panoya kopyalama
ve hata kutusu `hataGoster`.

## Bu dosya ne yapar?

Eğitim Evi'nin ekranları HTML metni olarak üretilip `#sayfa`'ya ya da pencereye (`#modalKok`) yazılır; her çizimde eski
düğmeler silinip yenileri gelir. Her düğmeye ayrı ayrı `onclick` bağlamak bu yüzden hem zahmetli hem kırılgan olurdu.
Bunun yerine düğmeler yalnızca bir **işaret** taşır:

- `data-nav="takvim"` — "şu sayfaya git" (sol menü, kutucuklar, "Servisi" gibi bağlantılar);
- `data-act="mesaj-sil" data-id="…"` — "şu işi yap" (kaydet, sil, aç, kopyala…).

Bu dosya açılışta belgeye **tek bir** `click` dinleyicisi kurar (`tiklamaKur`). Tıklanan yerden yukarı doğru yürür, ilk
bulduğu `data-nav` ya da `data-act` taşıyan öğeyi alır ve işi dağıtır: `data-nav` → `git(sayfa)`; `data-act` → `islem(ad,
öğe)`. `islem` önce `EYLEMLER` tablosuna bakar (ekran dosyalarının kendi kaydettiği eylemler — bugün 34 uygulama parçası
ve 4 yönetim parçası 251 eylem kaydediyor); orada yoksa kendi içindeki 65 eylemden birini çalıştırır. Bu 65 eylem
projenin ilk günlerinden kalma "büyük dağıtıcı"dır: takvim, devamsızlık, mesajlar, sınıflar, ders programı, ödev,
veli, eğitim yılı, tema, profil ve şifre düğmeleri hâlâ burada. Yeni ekranlar düğmelerini kendi dosyalarında
`EYLEMLER['ad'] = function (el, id) {…}` diye kaydeder ([01-yardimcilar.md](01-yardimcilar.md)); buraya yeni `act ===`
satırı eklenmez.

Dosya ayrıca:

- üst şeridin sabit düğmelerini bağlar (☰, yenile, zil, ayarlar, profil, "İçerik Ara" kutusu) ve masaüstünde menünün
  daraltılmış hâlini, ders programının gün/hafta görünüm tercihini tarayıcıdan okur;
- tarayıcının geri/ileri tuşunu uygulamanın sayfalarına çevirir (`hashchange`) ve ekranda bir kez gösterilen şifreler
  varken sekmeyi kapatmayı/yenilemeyi tarayıcıya sordurur (`beforeunload`);
- `panoyaKopyala` ile kişi kodu, kullanıcı adı, şifre, okul adresi gibi metinleri panoya alır;
- `hataGoster` ile bir işin hatasını tarayıcının uyarı kutusunda gösterir (28 parça kullanır).

Herkes kullanır: öğrenci, veli, öğretmen, müdür, servisçi, rolsüz yetişkin, sistem yöneticisi (yönetim paketi de aynı
parçaları içerir). Hangi düğmeyi kimin gördüğü düğmeyi üreten ekrana bağlıdır; aşağıda her eylemin yanında yazdım.

## İçinde neler var?

### `tiklamaKur()` — açılışta bir kez

[26-baslat.md](26-baslat.md)'deki açılış kodu çağırır (giriş ekranındayken de; giriş öncesi sayfanın tema düğmesi de
buradan çalışır).

1. **Belge tıklaması** (`document.addEventListener('click', …)`):
   - Tıklanan öğeden `document.body`'ye kadar yukarı çıkılır; ilk bulunan `data-act` ya da `data-nav` alınır, ikisinden
     biri bulununca durulur. Yani **en yakın işaret kazanır**: Çocuklarım'daki çocuk kartı `data-act="cocuk-ac"`
     taşırken içindeki "Kaldır" düğmesi `data-act="cocuk-sil"` taşır; düğmeye basınca kart açılmaz, çocuk kaldırılır.
   - `data-nav` bulunduysa varsayılan davranış durdurulur. Değer `geri-veli` ise (bir öğrencinin portalına bakarken
     menüdeki "Çocuk Listesi" / "Öğrenci Listesi", [06-menu.md](06-menu.md)) `S.viewStudentId` ve `S.viewStudentName`
     silinir; velide `git('cocuklarim')`, ötekilerde `git('okul-ogrenciler')`. Başka her değer `git(değer)`.
   - Hiçbiri yoksa: tıklanan öğenin kendisi pencere perdesiyse (`data-perde`) ve perde `data-zorunlu` taşımıyorsa
     `modalKapat()` — yani pencerenin dışına basmak pencereyi kapatır. Perdeye `data-zorunlu` koyan pencereler kapanmaz:
     KVKK onayı ([26-baslat.md](26-baslat.md)), şifre belirleme ([05b-sifre-zorunlu.md](05b-sifre-zorunlu.md)), giriş
     bilgileri listesi ([10a-giris-bilgisi.md](10a-giris-bilgisi.md)), yeni hesabın ya da değiştirilen şifrenin
     gösterildiği hesap penceresi ([10b-hesaplar.md](10b-hesaplar.md) `hesapSifresiKorunsun`) ve soru yazılan quiz
     penceresi ([14c-quiz.md](14c-quiz.md) `quizPencereAyari`). Ayrıca bildirim paneli açıksa ve tıklama zil düğmesinin ya
     da panelin dışındaysa panel boşaltılır.
   - `data-act` bulunduysa varsayılan davranış durdurulur (`ev.preventDefault()` — `<a href="#">` adres değiştirmez) ve
     `islem(data-act, öğe)` çağrılır.
2. **☰ (`#hamburger`)**: masaüstündeyse (`masaustuMu()`, 860 piksel üstü) menüyü yerinde daraltır/açar
   (`masaustuDaralt`, `body.sidebar-kapali`); dar ekranda kayan paneli açar/kapatır (`sidebarAc` / `sidebarKapat`). İkisi
   de [24-bildirim-arama-mobil.md](24-bildirim-arama-mobil.md)'de.
3. Masaüstündeyse ve kaydedilmiş tercih "daraltılmış"sa (`menuDurumOku()`, `localStorage` `ee_menu`) menü daraltılmış
   başlar. Telefonda bu tercih uygulanmaz (menü zaten kayan panel).
4. Ders programı görünümü: `localStorage` `ee_program_gorunum` `hafta` ya da `gun` ise `S.programGorunum`'a yazılır
   ([21-ders-programi.md](21-ders-programi.md)).
5. Pencere genişleyip masaüstü boyuna geçince açık kalan kayan menü kapatılır (`resize` → `sidebarKapat`).
6. `#sidebarPerde` → `sidebarKapat`; `#btnYenile` → `sayfayiYenile` ([07-yonlendirme.md](07-yonlendirme.md)).
7. **"Kaydedilmemiş" işareti**: `#sayfa` içindeki bir `textarea`'ya, `contenteditable` alana, türsüz ya da `text`/`number`
   türlü `input`'a yazılınca `S._sayfaDegisti = true`. Yenile düğmesi bu durumda "Sayfada yazdıkların kaydedilmedi…"
   diye sorar. Seçim kutusu, onay kutusu, tarih/saat, e-posta, telefon, şifre ve arama kutuları sayılmaz (yorum:
   "Filtre seçmek sayılmaz"). `git()` her sayfa geçişinde bayrağı indirir; quiz sayfası cevaplar kaydedilince
   ([14c-quiz.md](14c-quiz.md)) ve okul sayfası düzenleyicisi "Kaydet"ten sonra ([19g-okul-sayfasi.md](19g-okul-sayfasi.md))
   kendileri indirir.
8. `#btnBildirim` → `bildirimPaneliAcKapa`; `#btnAyarlar` ve `#btnProfil` → `git('profil')`; `#araKutu`'nun `oninput`'u →
   `araUygula` ([24-bildirim-arama-mobil.md](24-bildirim-arama-mobil.md)).
9. **Geri/ileri tuşu** (`hashchange`):
   - `adresGuncelleniyor` doğruysa çıkılır (bayrak pratikte hep yanlış; bkz. [07-yonlendirme.md](07-yonlendirme.md)
     "Dikkat!" — asıl koruma aşağıdaki `hedef !== S.page` denetimidir).
   - Adresteki sayfa (`adrestenSayfa`) ve varsa çocuk (`adrestekiCocuguAl` → `S.adresCocuk`, `?c=` parçası) okunur.
   - Hedef boş değilse, açık sayfadan farklıysa ve `SAYFALAR`'da varsa: önce `tekSeferAyrilabilir('sayfa')` sorulur
     ([03-mesaj-modal.md](03-mesaj-modal.md) `TEK_SEFER`: ekranda bir kez gösterilen giriş bilgileri / aktarım şifreleri
     varsa "kaybolacak, emin misin?"). Kişi vazgeçerse adres `history.replaceState` ile açık sayfaya geri yazılır
     (`replaceState` atarsa `location.hash` ile); geri yazılan adres `S.page` olduğu için ardından gelen olay bir şey
     yapmaz. Vazgeçmezse açık pencere kapanır (`modalKapat`) ve `git(hedef)`.
   - `#/yeni-sifre?t=…` ya da `#/eposta-onay?t=…` gibi adresler `adrestenParca`'nın kalıbına uymadığı için yok sayılır.
10. **Sekmeyi kapatma / yenileme** (`beforeunload`): `tekSeferSor('oturum')` doğruysa (bir kez gösterilen şifreler
    ekranda) `preventDefault` + `returnValue = ''`: tarayıcı kendi "Siteden ayrılsın mı?" kutusunu açar.

### Panoya kopyalama

- `eskiYontemKopyala(metin)` — görünmeyen, salt okunur bir `textarea` (ekranın 1000 px yukarısında) oluşturur, metni seçer,
  `document.execCommand('copy')` der, öğeyi siler; başarılıysa `true`. Hata olursa `false`.
- `panoyaKopyala(metin, btn)` — güvenli bağlamda (`https://` ya da `localhost`; `window.isSecureContext`) ve
  `navigator.clipboard` varsa `writeText`; o başarısız olursa ya da güvenli bağlam yoksa (düz `http://` ile açılan site)
  eski yönteme düşer. `btn` verildiyse düğmenin yazısı 1,6 saniyeliğine "Kopyalandı" ya da "Kopyalanamadı" olur, sonra
  eski yazıya döner. Eski yazı ilk basışta `data-eski`'ye saklanır; 1,6 saniye dolmadan yeniden basılsa da "Kopyalandı"
  kalıcı olmaz. (Düğmenin içinde simge olsaydı `textContent` onu silerdi; bugün kopyala düğmelerinin hepsi düz yazı.)

### `islem(act, el)` — eylem dağıtıcısı

`id = el.getAttribute('data-id')`. Önce `EYLEMLER[act]` varsa `EYLEMLER[act](el, id)` çağrılır ve döndürdüğü (çoğu zaman
söz) geri verilir. Yoksa aşağıdaki 65 eylemden biri. Hiçbirine uymayan ad sessizce hiçbir şey yapmaz
(`testler/buton-denetimi.js` böyle bir düğme bırakmaz). Eylemlerin çoğu bir `api()` isteği atar; aşağıdaki "uç"lar
`/api` öneklidir ve sunucudaki belgesi parantez içinde.

#### Genel

- `modal-kapat` — `modalKapat()`. Üreten: `modalAc`'ın varsayılan "Kapat" düğmesi ([03-mesaj-modal.md](03-mesaj-modal.md))
  ve 16 parçanın pencerelerindeki "Vazgeç/Kapat" düğmeleri (+ 3 yönetim parçası).
- `cikis` — `cikisYap()` ([26-baslat.md](26-baslat.md)). Üreten: sol menünün altındaki "Çıkış Yap"
  ([06-menu.md](06-menu.md)), Ayarlar'daki "Çıkış yap" ([23-veli-ayarlar.md](23-veli-ayarlar.md)), zorunlu şifre
  penceresi ([05b-sifre-zorunlu.md](05b-sifre-zorunlu.md)) ve KVKK onay penceresi ([26-baslat.md](26-baslat.md)).
- `kvkk-onayla` — KVKK onay penceresinin "Onaylıyorum"u ([26-baslat.md](26-baslat.md) `kvkkOnayIste`). `#kvkkYeniKutu`
  işaretli değilse `#kvkkYeniMesaj`'a "Önce kutucuğu işaretle." Değilse `POST /kvkk-onay { onay: true }`
  ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md)) → `S.user = d.user`, pencere kapanır,
  `girisSonrasi({ user: d.user, kvkkGuncel: true })` ([05b-sifre-zorunlu.md](05b-sifre-zorunlu.md)): şifre belirlemesi
  gerekiyorsa o pencere, değilse uygulama açılır. Hata pencerenin içinde.
- `kod-kopyala` — `panoyaKopyala(data-kod, düğme)`. Üreten: kişi kodu / veli kodu kutusu ([05-giris.md](05-giris.md)
  `kisiKoduKutusu`), hesap penceresinde kullanıcı adı ve yeni şifre ([10b-hesaplar.md](10b-hesaplar.md)), okulun adresi
  "Bağlantıyı kopyala" ([16b-okul-ayarlari.md](16b-okul-ayarlari.md)), yönetim ekranları (`public/js/yonetim/09-yonetici.js`).
- `kaynakca` — her sayfanın altındaki "Bu sistem hakkında" bağlantısı ([07-yonlendirme.md](07-yonlendirme.md)
  `altBilgi`). "Kaynakça" başlıklı pencere: "Bu sistem Eğitim Evi projesi kapsamında geliştirilmiştir." ve soluk yazıyla
  "Tüm veriler Eğitim Evi'nin sunucusunda saklanır; her okul yalnız kendi verisini görür. Veriler üçüncü taraflarla
  paylaşılmaz ve sistemde reklam bulunmaz."
- `tema-degis` — üst şeritteki ay/güneş düğmesi (`public/index.html`: uygulama şeridindeki `#btnTema` ve giriş öncesi
  sayfanın şeridindeki `.site-tema`). Şu an görünen tema hesaplanır: `<html data-tema>` `koyu` ise ya da etiket yoksa ve
  işletim sistemi koyu tercih ediyorsa "koyu görünüyor". `window.temaAyarla` (`public/js/tema.js`) ile tersine geçilir
  (yani "sistem" seçiliyken basınca açık ya da koyu sabitlenir). Girişliyse `POST /profile { tema }` sessizce hesaba da
  yazılır (hata yutulur, cevap gelince `S.user` tazelenir). Ayarlar sayfasındaysa `git('profil')` ile sayfa yeniden
  çizilir ki "Görünüm" seçimi doğru işaretlensin. Kvkk, koşullar, indirme, 404 ve "okul bulunamadı"
  (`public/okul-bulunamadi.html`) sayfaları bu paketi yüklemez; oradaki aynı düğmeyi `public/js/belge.js` karşılar.
- `tema-sec` — Ayarlar'daki "Sistem / Açık / Koyu" ([23-veli-ayarlar.md](23-veli-ayarlar.md), `data-deger`):
  `temaAyarla(değer)`, `POST /profile { tema }` (hata yutulur), `git('profil')`.
- `profil-kaydet` — Ayarlar'daki "Bilgileri güncelle" kartı. Doğum tarihi seçicisinde gün/ay/yıldan biri eksikse
  (`tarihSeciciDurum('pDogum') === 'eksik'`, [04a-form-alanlari.md](04a-form-alanlari.md)) "Doğum tarihinde gün, ay ve yılın
  üçünü de seç." Değilse `POST /profile { fullName: #pAd, city: #pIl, district: #pIlce, address: #pAdres, tc: #pTc
  (kutu varsa, kırpılmış; okulun açtığı hesapta kutu yok, alan gönderilmez), dogum: #pDogum ya da '' }`. Başarıda
  `S.user` yenilenir, üst şeritteki ad (`#profilEtiket`, ilk kelime) ve renkli harf (`#profilAvatar`, `avatar(ad,
  anaHesapId || id)`) güncellenir, "Bilgilerin kaydedildi.". Hata: sunucu `alan: 'tc'` dediyse ileti T.C. kutusunun
  altına (`alanHatasi`, [04a-form-alanlari.md](04a-form-alanlari.md)) ve kutuya odak; değilse `#pMesaj`.
- `sifre-kaydet` — Ayarlar'daki "Şifreyi değiştir". Tarayıcıda sırayla: mevcut şifre boşsa "Mevcut şifreni gir.", iki
  yeni şifre farklıysa "Yeni şifreler birbirini tutmuyor.", yenisi eskisiyle aynıysa "Yeni şifre eskisiyle aynı
  olamaz.", sonra `sifreSorunuTR(yeni, gucluSifreli(S.user))` ([05-giris.md](05-giris.md); yetişkin hesabında büyük harf,
  küçük harf, rakam, özel karakter). Düğme kilitlenir → `POST /password { old, new }`. Başarıda önce `yonetimeGec(d)`
  ([05b-sifre-zorunlu.md](05b-sifre-zorunlu.md)): sistem yöneticisi başka bir adresteyse yönetim adresine tam sayfa geçer.
  Değilse "Şifren değiştirildi." ve üç kutu boşalır. Hata `#sMesaj`'a.

#### Eğitim yılı ([16-egitim-yili.md](16-egitim-yili.md); uçlar [../../../sunucu/bolumler/egitim-yili.md](../../../sunucu/bolumler/egitim-yili.md))

- `yil-bak` — "Bu yıla bak": `POST /egitim-yili/bak { id, ogrenci: yilOgrencisi() }` (velide seçili ya da tek çocuk) →
  `yilBilgisiYukle()` → `git(S.page)`. Hata `hataGoster`.
- `yil-aktif` — onay "Bu yıl aktif yapılsın mı?\n\nBundan sonra açılan ödev, program ve yoklama kayıtları bu yıla
  yazılır." → `POST /egitim-yili/aktif-yap { id }` → `yilBilgisiYukle()` → `git('egitim-yili')`. Yalnız `yil.yonet`
  yetkisi olan (müdür) görür.
- `yil-ekle` — "Aç ve aktif yap": düğme kilitlenir → `POST /egitim-yili/ekle { ad: #yilAd }` (gövdede `aktifYap` yok;
  sunucu bu durumda yeni yılı aktif yapar) → `yilBilgisiYukle()` → `git('egitim-yili')` → yeşil sayfa iletisi
  (`r.message`). Hata `#yilMesaj`'a, düğme açılır. `yil-aktif`'in aksine onay sorulmaz.

#### İşlem kaydı ([15-aktarim.md](15-aktarim.md))

- `islem-suz` — İşlem kaydı sayfasındaki tür sekmeleri: `S.islemSuz = data-islem`, `git('islem-kaydi')`.

#### Ödevler ([11-ogretmen-odev.md](11-ogretmen-odev.md), [14-odev-filtre.md](14-odev-filtre.md); uçlar [../../../sunucu/bolumler/odev.md](../../../sunucu/bolumler/odev.md))

- `ders-dal` — müdürün "Ders ödevleri" ağacında bir ders: `dersDaliAcKapa(id)`.
- `ders-hepsini-ac` / `ders-hepsini-kapat` — `S.acikDersler` boşalır. Açarken sayfadaki her `[data-act="ders-dal"]`'ın
  kimliği açık işaretlenir, `S.dersHepsiAcik = true`, `git('ders-odevleri')` (sınıf seçiliyse sayfa `&detay=1` ile bütün
  derslerin ödevlerini tek istekte alır). Kapatırken `S.dersHepsiAcik = false`, `dersListesiniYenidenCiz()` (istek yok).
- `odev-yeni` — "Yeni ödev ver": `odevYeniModal()`; hata `hataGoster`.
- `odev-tumu` / `odev-hicbiri` — penceredeki bütün `.ogrenci-kutu` onay kutularını işaretler/boşaltır, sonra
  `odevSecimBagla()` (sınıf kutularının durumu).
- `odev-kaydet` — "Ödevi ver". Sırayla: hiç öğrenci seçili değilse `#mHata` "En az bir öğrenci seç."; ek yükleniyorsa
  (`ekYukleniyor('odev')`, [04d-ekler.md](04d-ekler.md)) turuncu "Dosyalar yükleniyor; bitince kaydet."; quiz bozuksa
  (`quizGovdesi('odev').hata`, [14c-quiz.md](14c-quiz.md)) o hata. Sonra düğme kilitlenir → `POST /assignments
  { subject: #mDers, title: #mBaslik, description: #mAciklama, startAt: #mBas, startTime: #mBasSaat, endAt: #mBit,
  endTime: #mBitSaat (yoksa '12:00'), studentIds, ekIdler: ekIdleri('odev'), dosyaYukleme: #mDosyaYukleme işaretli mi,
  quiz }`. Başarıda pencere kapanır, `git('ogr-odevler')`; hata `#mHata`'ya, düğme açılır. Başlık, tarih ve ders
  kuralları sunucuda denetlenir.
- `odev-ac` — öğretmen listesindeki "Sonuçlandır / Sonuçları düzenle": `odevAc(id)` (kontrol ekranı).
- `odev-bitir` — kontrol ekranındaki "Sonuçlandır ve kaydet": `POST /assignments/<id>/finish { results: S._sonuclar || {} }`
  → müdürse `git('ders-odevleri')` (öğretmeni ayrılmış ödevi müdür sonuçlandırır), değilse `git('ogr-odevler')`. Düğme
  beklemeye alınmaz.
- `odev-tekrar` — "Tekrar aç": quizli ödevde `quizTekrarAcUyarisi(id)` bir uyarı dönerse "<uyarı>\n\nÖdev tekrar açılsın
  mı?" onayı; quizsiz ödevde onay sorulmaz. `POST /assignments/<id>/reopen` → aynı dönüş.
- `odev-sil` — "Sil": onay "Bu ödev silinsin mi? Geri alınamaz." → `POST /assignments/<id>/delete` → `git('ogr-odevler')`
  (öğretmenin ana sayfasındaki listeden silinse de Ödevler sayfasına geçer).
- `odev-filtre-temizle` — ödev süzgeç çubuğundaki "Temizle" ([14-odev-filtre.md](14-odev-filtre.md)): `S.odevF` boşaltılır
  (kip korunarak), arama kutusu boşalır, `git(S.page)`.

#### Takvim ([17-takvim.md](17-takvim.md); uçlar [../../../sunucu/bolumler/takvim.md](../../../sunucu/bolumler/takvim.md))

- `takvim-ay` — `S.takvimAy += data-yon` (−1 / +1); 0 olursa önceki yılın Aralık'ı, 13 olursa sonraki yılın Ocak'ı;
  seçili gün silinir, `git('takvim')`.
- `takvim-bugun` — yıl ve ay yerel saatle bugüne; seçili gün `new Date().toISOString().slice(0, 10)` (UTC'ye göre
  bugün — "Dikkat!"); `git('takvim')`.
- `takvim-gun` — `S.takvimSecili = data-tarih`; ızgara yeniden çizilmez, eski hücrenin `secili` sınıfı basılana geçer;
  `takvimGunCiz(tarih)`.
- `takvim-etkinlik-ekle` — `takvimEtkinlikModal()`.
- `takvim-etkinlik-kaydet` — düğme kilitlenir → `POST /takvim/etkinlik { baslik: #tkBaslik, tur: #tkTur, tarih: #tkTarih,
  bitis: #tkBitis, aciklama: #tkAciklama }` → pencere kapanır, `git('takvim')` → yeşil "<başlık> takvime eklendi.". Hata
  `#tkMesaj`'a. Yalnız `takvim.yonet` sahibi (müdür her zaman) bu düğmeleri görür.
- `takvim-etkinlik-sil` — onay "Bu kayıt takvimden kaldırılsın mı?" → `POST /takvim/etkinlik-sil { id }` → `git('takvim')`.

#### Devamsızlık ([18-devamsizlik.md](18-devamsizlik.md); uçlar [../../../sunucu/bolumler/devamsizlik.md](../../../sunucu/bolumler/devamsizlik.md))

- `dv-bugun` — yönetimin Devamsızlık sayfasındaki "Bugün": sayfa açıkken kurduğu `S.dvBugunGit()` varsa çağrılır.
- `yoklama-ders` — Yoklama sayfasında ders seçimi: `S.yoklamaDers = id`, `S.yoklamaTarih = ''`, `git('yoklama')`.
- `yoklama-durum` — bir öğrencinin Var / Yok / Geç / İzinli düğmesi: `S.yoklamaDurum[data-ogrenci] = data-durum`; aynı
  satırdaki `.durum-dugme`'lerin `secili`'si güncellenir (sayfa yeniden çizilmez, istek yok).
- `yoklama-hepsi-var` — ekrandaki bütün `.durum-secim` satırları `var`.
- `yoklama-kaydet` — `S.yoklamaDurum`'daki herkes `girisler: [{ ogrenciId, durum }]` olur; düğme kilitlenir →
  `POST /devamsizlik/yoklama { lessonId: S.yoklamaDers, tarih: S.yoklamaTarih, girisler }` → `#yoklamaMesaj`'a sunucunun
  iletisi (yeşil) ya da hata (kırmızı); düğme açılır.

#### Mesajlar ([19-mesajlar.md](19-mesajlar.md); uçlar [../../../sunucu/bolumler/mesaj.md](../../../sunucu/bolumler/mesaj.md))

- `mesaj-kutu` — "Gelen kutusu" (`gelen`) / "Gönderilenler" (`giden`) sekmesi: `S.mesajKutu = data-kutu`, `git('mesajlar')`.
- `mesaj-tur` — "Hepsi" (`''`) / "Duyurular" (`duyuru`) / "Kişisel" (`mesaj`) süzgeci: `S.mesajTur = data-tur`,
  `git('mesajlar')`.
- `mesaj-ac` → `mesajAc(id)`; `mesaj-yeni` → `mesajYeniModal()`; `mesaj-gonder` → `mesajGonderIslemi(düğme)`.
- `mesaj-sil` — onay Gönderilenler kutusundaysa "Mesaj tüm alıcılardan silinsin mi?", değilse "Mesaj kutundan
  kaldırılsın mı?" → `POST /mesajlar/sil { id }` → pencere kapanır, `git('mesajlar')`, `bildirimleriYenile()`.
- `mesaj-engel-kaldir` — engel listesindeki "Kaldır": `S.mesajAyarGecici.engelli`'den o kişi çıkarılır →
  `POST /mesajlar/ayar { kimden: S.mesajAyarGecici.kimden, engelli: [kalan kimlikler] }` → `git('mesajlar')`.
- `mesaj-ayar-kaydet` — "Kimler mesaj atabilir" seçimi (`input[name=mesajIzin]:checked`, seçili yoksa `herkes`) ve
  bugünkü engel listesiyle `POST /mesajlar/ayar` → `#mesajAyarMesaj` "Ayar kaydedildi." ya da hata.

#### Müdür ([10-mudur.md](10-mudur.md); uç [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md))

- `ogretmen-onay` — Öğretmenler sayfasındaki bekleyen başvurunun "Onayla" (`data-ok="1"`) / "Reddet" (`data-ok="0"`):
  `POST /school/teacher-decide { userId: id, approve }` → `git('ogretmenler')`. Onay sorulmaz.
- `ogrenci-portal` — öğrenci listesindeki "Portalını aç": `ogrenciPortalAc(id, data-ad || 'Öğrenci')`.

#### Sınıflar ([20-siniflar.md](20-siniflar.md); uçlar [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md))

- `sinif-ekle` — `#yeniSinif` kırpılır; boşsa `#sinifMesaj` "Sınıf adı yaz (ör. 7-A)". Düğme kilitlenir →
  `POST /school/class { name }` → `git('siniflar')`; hata `#sinifMesaj`'a.
- `sinif-sil` — onay "<sınıf> silinsin mi? Öğrenciler sınıfsız kalır, sınıfın dersleri ve ders programı silinir.
  Öğrenci hesapları silinmez." → `POST /school/class-delete { classId: id }` → `git('siniflar')`.
- `sinif-program` — `S.programSinif = id`, `S.programGun = 0`, `git('program')`.
- `sinif-dersler` → `sinifDersleriModal(id, data-ad)`; `sinif-ogrenciler` → `sinifOgrencileriModal(id, data-ad)`;
  `sinif-yerlestir` → `sinifOgrencileriModal('', '')` (sınıfsız öğrencileri yerleştirme).
- `ders-ekle` — "Dersler" penceresinde: `#yeniDers`, `#yeniDersSaat` → düğme kilitlenir → `POST /school/lesson
  { classId: id, subject, weeklyHours }` → pencere aynı sınıfla yeniden açılır (`S.dersBilgi.class.name`). Hata
  pencereye değil `hataGoster`'e (tarayıcı kutusu) gider, düğme açılır.
- `ders-sil` — onay "Ders silinsin mi? Bu dersin ders programındaki saatleri de silinir." → `POST /school/lesson-delete
  { lessonId: id }` → pencere `data-cid` sınıfıyla yeniden açılır.

#### Ders programı ([21-ders-programi.md](21-ders-programi.md); uçlar [../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md))

- `cakisma-ac` — çakışma listesini aç/kapa (`S.cakismaAcik`), `programYenidenCiz()`.
- `program-gun` — gün şeridi: `S.programGun = data-gun` (sayı değilse 1), `programYenidenCiz()`.
- `program-gorunum` — Gün / Hafta: `S.programGorunum`, `localStorage` `ee_program_gorunum`'a yazılır, `programYenidenCiz()`.
- `saat-ekle` → `saatModal(data-gun, '')`; `saat-duzenle` → `saatModal(0, id)`.
- `saat-sil` — onay "Bu ders saati programdan silinsin mi?" → `POST /school/schedule-delete { scheduleId: id }` →
  `programCiz()`.
- `saat-kaydet` — gövde `{ day: #mGun, lessonId: #mDers, start: #mBas, end: #mBit }`; başlangıç ya da bitiş boşsa
  `#saatMesaj` "Başlangıç ve bitiş saatini gir.". Düğme kilitlenir. Düğmede `data-id` varsa `POST /school/schedule-update
  { scheduleId, day, lessonId, start, end }`, yoksa `POST /school/schedule-add { classId: S.programSinif, … }`. Başarıda
  pencere kapanır; sunucu bir çakışma `uyari`'sı döndüyse (`{ tur, className, subject, start, end }`,
  `sunucu/iliskiler.js`) `S.programUyari`'ye cümle yazılır — öğretmen çakışmasında "Bu öğretmen aynı saatte 7-B
  sınıfında Matematik dersinde de görünüyor (09:00-09:40).", sınıf çakışmasında "Bu sınıfın aynı saatte başka dersi
  var: …" — ve `programCiz()` onu sayfanın üstünde bir kez gösterir. Çakışma kaydı engellemez.

#### Veli ([23-veli-ayarlar.md](23-veli-ayarlar.md), [27-veli-panel.md](27-veli-panel.md); uçlar [../../../sunucu/bolumler/veli.md](../../../sunucu/bolumler/veli.md))

- `cocuk-ekle` — Çocuklarım'daki ve (eski düzen öğretmen/müdür hesabında) Ayarlar'daki veli kodu kutusu (`#veliKod`).
  `kisiKoduDenetle(…, 'Veli kodu')` sorun bulursa `#veliMesaj`'a. Değilse `POST /parent/link { code:
  kisiKoduSade(#veliKod) }` (tireler/boşluklar atılmış 16 karakter, [05-giris.md](05-giris.md)) → `S.children = d.children`
  → `portallariTazele()` ([08c-kisilikler.md](08c-kisilikler.md): `/me` yeniden, menü yeniden) → Ayarlar'daysa
  `git('profil')`, değilse `git('cocuklarim')`. Hata `#veliMesaj`'a.
- `cocuk-ac` — çocuk kartı: `S.viewStudentId = id`, `S.viewStudentName = data-ad`, `git('ilerleyisim')` (çocuğun portal
  görünümü, [13-ogrenci-veli.md](13-ogrenci-veli.md)).
- `cocuk-sil` — karttaki "Kaldır": onay "Bu çocuk hesabından kaldırılsın mı?" → `POST /parent/unlink { studentId: id }` →
  `S.children` yenilenir; şeritte seçili çocuk oysa `S.veliCocuk = null`; `portallariTazele()` (son çocuk da gidince hesap
  rolsüz yetişkine döner, `S.user` buradan güncellenir) → çocuk kaldıysa ya da hâlâ veliyse `git('cocuklarim')`, değilse
  `git('ana')`.
- `veli-cocuk` — veli sayfalarının üstündeki "Hepsi · Zeynep · Burak" şeridi ([27-veli-panel.md](27-veli-panel.md)):
  `S.veliCocuk = id || null` ("Hepsi"nin `data-id`'si boş) → `yilBilgisiYukle()` (yıl seçici seçilen çocuğun okuluna
  göre) → `git(S.page)`.

### `hataGoster(e)`

`alert(e.message)` — tarayıcının uyarı kutusu. Bir işin sonucu sayfada gösterilecek bir yer yoksa (sil, aç, tekrar aç…)
sözün hata işleyicisi olarak doğrudan verilir (projenin kodunda `.catch` hep `['catch']` biçiminde yazılır).
Kullananlar: bu dosya, 27 uygulama parçası (04d, 07, 08c, 10, 10b, 11, 11b, 12, 14, 14b, 14c, 15, 16b, 18b, 19, 19b, 19c,
19e, 19f, 19g, 19h, 19i, 20, 21, 22, 23, 27b) ve `public/js/yonetim/09-yonetici.js`.

### Köprü değişkenler

- `yeniSifreAnahtar` (`''`) ve `yeniSifreEkraniAcDisaridan` (boş işlev) — şifre sıfırlama bağlantısının anahtarı ve "yeni
  şifre ekranını aç" köprüsü. Burada `var` ile tanımlanır; `authKur` ([05-giris.md](05-giris.md)) ikisini doldurur,
  [26-baslat.md](26-baslat.md) sıfırlama bağlantısıyla gelindiğinde köprüyü çağırır. Yerlerinin neden önemli olduğu
  "Dikkat!"te.

## Kimle konuşur?

- Parçalar ad sırasıyla tek bir IIFE'de birleşir (`/js/app.js`; yönetim adresinde `/admin/yonetim.js`,
  [../../../sunucu/http.md](../../../sunucu/http.md) `birlesikOku`). Bu dosya `26-baslat.js`'ten hemen önce gelir; içindeki
  adlar bütün parçaların ortak alanındadır.
- Çağırdıkları (tanımlandığı yer):
  - [00-durum.md](00-durum.md) — `S` (`page`, `user`, `token`, `viewStudentId`, `programGorunum`, `odevF`, `veliCocuk`,
    `children` ve ekranların alanları).
  - [01-yardimcilar.md](01-yardimcilar.md) — `$`, `api`, `EYLEMLER`.
  - [02-ikonlar.md](02-ikonlar.md) — `avatar`.
  - [03-mesaj-modal.md](03-mesaj-modal.md) — `modalAc`, `modalKapat`, `mesajGoster`, `sayfaMesaji`, `tekSeferAyrilabilir`,
    `tekSeferSor`.
  - [04a-form-alanlari.md](04a-form-alanlari.md) — `alanHatasi`, `tarihSeciciDurum` (gün/ay/yıl seçicisi; ajanda
    biçimli tarih kutusu `04e-tarih-secici.js` değil); [04d-ekler.md](04d-ekler.md) — `ekYukleniyor`, `ekIdleri`.
  - [05-giris.md](05-giris.md) — `kisiKoduDenetle`, `kisiKoduSade`, `sifreSorunuTR`, `gucluSifreli`;
    [05b-sifre-zorunlu.md](05b-sifre-zorunlu.md) — `girisSonrasi`, `yonetimeGec`.
  - [07-yonlendirme.md](07-yonlendirme.md) — `git`, `adrestenSayfa`, `adrestekiCocuguAl`, `adresGuncelleniyor`,
    `sayfayiYenile`.
  - [08c-kisilikler.md](08c-kisilikler.md) — `portallariTazele`; [10-mudur.md](10-mudur.md) — `ogrenciPortalAc`.
  - [11-ogretmen-odev.md](11-ogretmen-odev.md) — `dersDaliAcKapa`, `dersListesiniYenidenCiz`, `odevYeniModal`,
    `odevSecimBagla`, `odevAc`; [14c-quiz.md](14c-quiz.md) — `quizGovdesi`, `quizTekrarAcUyarisi`.
  - [16-egitim-yili.md](16-egitim-yili.md) — `yilOgrencisi`, `yilBilgisiYukle`; [17-takvim.md](17-takvim.md) — `takvimGunCiz`,
    `takvimEtkinlikModal`; [18-devamsizlik.md](18-devamsizlik.md) — `S.dvBugunGit`.
  - [19-mesajlar.md](19-mesajlar.md) — `mesajAc`, `mesajYeniModal`, `mesajGonderIslemi`, `S.mesajAyarGecici`;
    [20-siniflar.md](20-siniflar.md) — `sinifDersleriModal`, `sinifOgrencileriModal`, `S.dersBilgi`;
    [21-ders-programi.md](21-ders-programi.md) — `programCiz`, `programYenidenCiz`, `saatModal`.
  - [24-bildirim-arama-mobil.md](24-bildirim-arama-mobil.md) — `masaustuMu`, `masaustuDaralt`, `menuDurumOku`,
    `sidebarAc`, `sidebarKapat`, `bildirimPaneliAcKapa`, `araUygula`, `bildirimleriYenile`.
  - [26-baslat.md](26-baslat.md) — `cikisYap`.
  - `window.temaAyarla` — `public/js/tema.js` (sayfanın başında ayrı yüklenen küçük betik).
  - Tarayıcı: `navigator.clipboard`, `document.execCommand('copy')`, `localStorage`, `history.replaceState`, `alert`,
    `confirm`.
- Sunucu uçları (hepsi POST): `kvkk-onay`, `profile`, `password` ([../../../sunucu/bolumler/kayit.md](../../../sunucu/bolumler/kayit.md));
  `egitim-yili/bak|aktif-yap|ekle` ([../../../sunucu/bolumler/egitim-yili.md](../../../sunucu/bolumler/egitim-yili.md));
  `takvim/etkinlik`, `takvim/etkinlik-sil` ([../../../sunucu/bolumler/takvim.md](../../../sunucu/bolumler/takvim.md));
  `devamsizlik/yoklama` ([../../../sunucu/bolumler/devamsizlik.md](../../../sunucu/bolumler/devamsizlik.md));
  `mesajlar/sil`, `mesajlar/ayar` ([../../../sunucu/bolumler/mesaj.md](../../../sunucu/bolumler/mesaj.md));
  `school/class`, `class-delete`, `lesson`, `lesson-delete`, `schedule-add`, `schedule-update`, `schedule-delete`,
  `teacher-decide` ([../../../sunucu/bolumler/okul.md](../../../sunucu/bolumler/okul.md));
  `assignments`, `assignments/<id>/finish|reopen|delete` ([../../../sunucu/bolumler/odev.md](../../../sunucu/bolumler/odev.md));
  `parent/link`, `parent/unlink` ([../../../sunucu/bolumler/veli.md](../../../sunucu/bolumler/veli.md)). Hangi uca kimin
  girebildiği o belgelerde; yetkiyi her zaman sunucu denetler, buradaki onay kutuları yalnız kazara basmaya karşı.
- Onu kullananlar:
  - [26-baslat.md](26-baslat.md) — açılışta `tiklamaKur()`.
  - `islem`'i yalnız bu dosyanın dinleyicisi çağırır; ama `data-act` üreten her parça dolaylı kullanıcıdır (yukarıdaki
    eylem listesi ve `EYLEMLER` kaydeden 38 parça).
  - `panoyaKopyala` yalnız `kod-kopyala` üzerinden kullanılır; `hataGoster` yukarıda.
  - [05-giris.md](05-giris.md) — `yeniSifreAnahtar`, `yeniSifreEkraniAcDisaridan`'ı yazar ve okur; [26-baslat.md](26-baslat.md)
    `yeniSifreEkraniAcDisaridan`'ı çağırır.
  - `public/index.html` — `data-act`'lı sabit düğmeler (`tema-degis`, `kisilik-ekle`, `yapimcilar`) ve bağlanan kimlikler
    (`#hamburger`, `#sidebarPerde`, `#btnYenile`, `#btnBildirim`, `#btnAyarlar`, `#btnProfil`, `#araKutu`, `#sayfa`,
    `#bildirimPanel`, `#profilEtiket`, `#profilAvatar`).
- CSS: bu dosya sınıf üretmez, yalnız değiştirir: `body.sidebar-kapali` (`08-menu-filtre.css`), `.takvim-hucre.secili`
  (`21-takvim.css`), `.durum-dugme.secili` (`20-devamsizlik.css`); perde `06-modal.css`.

## Nasıl çalışır (adım adım)?

### Bir düğmeye basmak

```
<button class="btn" data-act="mesaj-sil" data-id="m42">Sil</button>  ── click ──►  document dinleyicisi
   yukarı yürü: <svg> → <button data-act> bulundu (data-nav yok)
   ev.preventDefault() ─► islem('mesaj-sil', düğme)
        EYLEMLER['mesaj-sil'] var mı?  hayır
        act === 'mesaj-sil' → confirm(…) → api('/mesajlar/sil', 'POST', { id: 'm42' })
                                            → modalKapat(); git('mesajlar'); bildirimleriYenile()
                                            ✗ hata → hataGoster(e) → alert(…)
```

`EYLEMLER`'de kayıtlı bir ad olsaydı (`ek-indir`, `sg-bant`, `aile-kaydet` …) `islem` onu çağırıp hemen dönerdi.

### Menüden sayfaya

```
<button class="navlink" data-nav="takvim"> ── click ──► git('takvim')
   git: TEK_SEFER sorusu → adres #/takvim → S.page = 'takvim' → menü, "Yükleniyor..." → SAYFALAR.takvim()
   (bir an sonra tarayıcı hashchange verir: hedef === S.page olduğu için ikinci kez açılmaz)
```

### Geri tuşu

```
tarayıcı ← ─► adres #/mesajlar ─► hashchange
   hedef 'mesajlar' ≠ S.page 'takvim' ve SAYFALAR'da var
   tekSeferAyrilabilir('sayfa')?  ── hayır ─► history.replaceState('#/takvim')  (adres geri, sayfa yerinde)
                                  └ evet ──► modalKapat(); git('mesajlar')
```

## Dikkat!

- **En yakın işaret kazanır, `data-act` ile `data-nav` aynı öğede olmamalı.** Dinleyici bir öğede ikisini birden
  bulursa `data-nav`'ı kullanır. İç içe tıklanabilir öğelerde içteki düğme kendi `data-act`'ını taşımalı (çocuk kartı +
  "Kaldır" gibi), yoksa dıştakinin işi çalışır.
- **`preventDefault` her `data-act`'ta çalışır.** Onay kutusuna, seçim kutusuna ya da etikete `data-act` koyarsan
  tarayıcının kendi davranışı (işaretlemek, açmak) durur. Bu yüzden ekranlar açılır kutuları ve onay kutularını
  `change`/`input` olaylarıyla kendileri bağlar ([18-devamsizlik.md](18-devamsizlik.md) "Açılır kutu tıklama
  dağıtıcısına bağlı değil").
- **Yalnız `click` dinlenir.** `<button>` ve `<a>`'da Enter/Boşluk tarayıcıda zaten `click` üretir; ama `div` üzerindeki
  eylemler (Çocuklarım'daki çocuk kartı `cocuk-ac`, velinin ödev satırı `veli-teslim`, bildirim satırı) klavyeyle
  açılamaz — odak almıyorlar ya da Enter dinlenmiyor ([24-bildirim-arama-mobil.md](24-bildirim-arama-mobil.md)).
- **`EYLEMLER` önce gelir.** Burada `act ===` ile karşılanan bir adı bir parça `EYLEMLER`'e kaydederse buradaki satır
  bir daha hiç çalışmaz. Bugün çakışma yok (65 ad, 251 `EYLEMLER` adı; `testler/buton-denetimi.js` ikisini birlikte
  sayar: 316 üretilen, 316 karşılanan).
- **Eylemlerin döndürdüğü söz yakalanmaz.** `islem` sözü kimseye vermez; bir `EYLEMLER` işi kendi `catch`'ini koymadıysa
  hata yalnız konsola düşer ([19i-servis-yoklama.md](19i-servis-yoklama.md) `sy-servis` örneği). Bu dosyadaki `api()`
  çağrılarının hepsi kendi `catch`'ini koyuyor (`tema-degis`/`tema-sec`'teki profil yazımı bilerek sessiz); başka parçaya
  devredilen eylemlerde (`mesajAc`, `mesajYeniModal`, `mesajGonderIslemi`, `saatModal`, `ogrenciPortalAc`,
  `takvimEtkinlikModal`, `dersDaliAcKapa`) hatayı o parçanın işlemesi gerekir.
- **Onaysız ya da kilitsiz düğmeler.** `ogretmen-onay` "Reddet" onay sormadan başvuruyu reddeder (sunucu kişiyi rolsüz
  yetişkin hesabına döndürür; bu ekranda geri alma yok). `odev-bitir`, `profil-kaydet` ve `odev-tekrar` istek
  sürerken düğmeyi kilitlemez; iki kez basılırsa iki istek gider (sunucu yalnız değişen sonuca bildirim yolladığı için
  çoğunlukla zararsız, [11-ogretmen-odev.md](11-ogretmen-odev.md)).
- **`takvim-bugun` UTC'ye göre "bugün" seçer.** Türkiye saatiyle 00:00–02:59 arasında seçili gün dün olur
  ([17-takvim.md](17-takvim.md) "Dikkat!"). `dv-bugun`'un işlevi de UTC ile çalışır ([18-devamsizlik.md](18-devamsizlik.md)).
- **Oturum yokken de geri/ileri tuşu `git()`'i çağırır** (kod okumasına göre; denenmedi). Çıkıştan sonra `S.page` son
  açık sayfada kalır; geri ya da ileri tuşu başka bir uygulama adresine gidince bu dinleyici `git(hedef)` der: sayfa
  işlevi anahtarsız istek atar (401) ya da `S.user` boş olduğu için hata verir. `#app` gizli olduğu ve
  [05a-dis-sayfalar.md](05a-dis-sayfalar.md)'deki `popstate` dinleyicisi giriş ekranını yeniden gösterdiği için kişi bir
  şey görmez; ama adres eski sayfada kalır ve aynı sekmede giren sonraki kişi o sayfayla açılır. Kullanıcı bunu
  "çıkıştan sonra ileri tuşu hesaba atmasın" diye istedi; tanımı "Üst şerit sadeleştirme" işinde (oturum kimliği
  `history.state`'e, `pageshow` denetimi). Kod değiştirilmedi.
- **İki `hashchange` dinleyicisi var.** [14c-quiz.md](14c-quiz.md)'nin dinleyicisi paket yüklenirken, bu dosyanınki
  açılışta kurulur; önce quizinki çalışır. Bu dosya sayfa değişimini `TEK_SEFER` yüzünden geri çevirirse quiz çıkışı
  saymaz (orada anlatıldı).
- **"Kaydedilmemiş" işareti dar.** Yalnız yazı kutuları, sayı kutuları, `textarea` ve `contenteditable` sayılır;
  e-posta, telefon, şifre ve tarih kutularına yazılan şey Yenile düğmesine "kaydedilmedi" dedirtmez.
- **`odev-filtre-temizle`'nin kipi koruması etkisiz.** `git()` `S.odevF`'yi kipiyle birlikte zaten sıfırlıyor, öğretmen
  sayfası kipi yeniden kuruyor; sonuç doğru, satır gereksiz ([14-odev-filtre.md](14-odev-filtre.md)).
- **`sifre-kaydet` sunucunun alan bilgisini kullanmaz.** Sunucu `alan: 'eski'|'yeni'` döndürür ("Mevcut şifre yanlış",
  "T.C. no'nu ya da kullanıcı adını içeriyor"); bu düğme iletiyi kutunun altına değil `#sMesaj`'a yazar. Zorunlu şifre
  penceresi ([05b-sifre-zorunlu.md](05b-sifre-zorunlu.md)) aynı ucun alanını kutuya bağlıyor. Tarayıcıda T.C./kullanıcı
  adı denetimi de yok; sunucu yakalıyor.
- **`odev-tekrar` yorumu eski.** Üstteki yorum "tekrar açınca quizi çözmemiş öğrenci başlatabilir" diyor; bugünkü kural
  tersi (sonuçlar kalıcı açıldıysa başlatamaz; `quizTekrarAcUyarisi` uyarısı da bunu söylüyor). Kod doğru, yorum
  yanıltıcı ([14c-quiz.md](14c-quiz.md)).
- **"Bu sistem hakkında" metni aydınlatma metniyle tam örtüşmüyor.** Buradaki "Veriler üçüncü taraflarla paylaşılmaz"
  kısa bir söz; aydınlatma metninin (`public/kvkk/kvkk.html`) 6. bölümü iki dış hizmeti ayrıca anlatıyor (harita
  döşemeleri OpenStreetMap'ten, telefon bildirimleri Google/Apple/Mozilla/Microsoft bildirim servislerinden; içerik
  şifreli). Daha önemlisi: commit 543 buradaki "okulun kendi sunucusu" yanlışını "Eğitim Evi'nin sunucusu" diye düzeltti,
  ama `kvkk.html`'in aynı 6. bölümü bugün hâlâ "Veriler okulun kullandığı sunucuda tutulur … okul bu durumu ayrıca
  bildirmekle yükümlüdür" diyor (bu belge yazılırken görüldü; o dosya bu grubun işi değil, kod/metin değiştirilmedi).
  İkisi "KVKK ve onay metinleri tam denetimi" işinde birlikte düzeltilmeli.
- **Köprü değişkenlerin sırası.** `yeniSifreEkraniAcDisaridan`'ın boş işlevle ilk değeri bu dosya yüklenirken yazılır;
  `authKur` onu ancak `26-baslat.js`'teki açılış kodu çalışınca doldurur. Bu dosya 26'dan SONRA birleşseydi boş işlev
  doldurulmuş köprüyü ezerdi ve sıfırlama bağlantısı ekranı açmazdı. Dosya adlarını değiştirirken bu sırayı koru
  ([05-giris.md](05-giris.md) "Dikkat!").
- **Tıklama dinleyicisinde ölü satır.** `var el = t; while (el && el !== document.body && !el.getAttribute) …` hesaplanıyor
  ama `el` hiç kullanılmıyor. Zararsız; temizlik işinde silinebilir.
- **`hataGoster` tarayıcının `alert`'i.** Sayfayı kapatılana kadar kilitler ve sitenin görünümüyle değil tarayıcının
  kendi kutusuyla açılır. Yeni ekranlarda iletiyi sayfaya yazmak (`sayfaMesaji`, `mesajGoster`) daha iyi.

## Testleri

- `testler/buton-denetimi.js` (sunucusuz; `tumtest.sh` sonunda) — parçaları sunucunun yaptığı gibi ad sırasıyla
  birleştirip `public/index.html` ile tarar: her `data-act`'ın `islem()`'de (`act === '…'`) ya da `EYLEMLER`'de karşılığı
  var mı, karşılanan her eylemi üreten bir düğme var mı, her `data-nav`'ın `SAYFALAR`'da sayfası var mı (`geri-veli`
  özel), menüdeki her anahtarın sayfası var mı, `api('/…')` yollarının sunucuda bölümü var mı. Bu belge yazılırken
  çalıştırıldı: 316 üretilen / 316 karşılanan eylem, sorun yok.
- `testler/yazim-denetimi.js` (sunucusuz) — bu dosyadaki onay ve ileti metinlerinin Türkçe yazımı.
- `testler/test-kucult.js` (sunucusuz) — bütün paketin yorumsuz hâliyle derlenmesi (bu dosya dahil).
- `testler/test-admin-gizli.js` — herkese giden `app.js`'te yönetim ucu yok: commit 521'de yedek ve müdür silme düğmeleri
  bu dosyadan yönetim paketine taşındı.
- Eylemlerin uçlarını koruyan sunucu testleri: `test-yonetim.js` (`kvkk-onay`, `password`), `test-giris-kayit.js`
  (`profile`, `password`, `parent/link`, `teacher-decide`), `test-yetiskin.js` (`profile`, `password`), `test-kisi-kodu.js`
  (`teacher-decide`), `test-egitim-yili.js` (`bak`, `aktif-yap`, `ekle`), `test-takvim.js`, `test-devamsizlik.js`,
  `test-mesaj.js` (`mesajlar/ayar`, `mesajlar/sil`), `test-program.js` (`class-delete`, `schedule-add|update|delete`),
  `test-quiz.js`, `test-odev-saat.js`, `test-odev-dosya.js` (`assignments`, `finish`, `reopen`, `delete`),
  `test-veli-coklu.js` (`parent/unlink`). `lesson-delete` ucunu deneyen test yok.
- Elle: (1) müdürle Sınıflar → "7-Z" ekle → sil (onay metnini oku); (2) Ders Programı'nda aynı öğretmene aynı saatte iki
  ders koy → sayfanın üstünde çakışma cümlesi; (3) Ayarlar'da tema "Koyu" → üstteki ay/güneşe bas → açık; sayfayı
  yenile, hesaptaki tercih korunmalı; (4) giriş bilgileri listesi açıkken geri tuşuna bas → soru gelmeli, "İptal"de adres
  ve sayfa yerinde kalmalı; (5) `http://` ile açılan sitede bir kişi kodunun "Kopyala"sına bas → "Kopyalandı".

## Son durum

- `git log`: 8 commit. Dosya depoya parça parça girdi: `85a732a commit 23` (2026-08-28; `tiklamaKur` ve
  `eskiYontemKopyala`), `ef8d393 commit 24` (2026-08-28; `panoyaKopyala`, `hataGoster`, köprü değişkenler),
  `8d01607 commit 120` (2026-08-29; `islem` — 543 satır, `17-takvim.js` ile aynı commit).
- `0acca75 commit 516` (2026-09-27, portallar): sistem yöneticisinin `admin-onay` eylemi kalktı; müdür silme onayı "Okul
  kapanır, kimse giremez … Okullar > Okul aç ile okula yeni müdür atayabilirsin." oldu; `cocuk-ekle` veli kodunu
  `kisiKoduDenetle` ile denetleyip `kisiKoduSade` ile gönderiyor, `cocuk-ekle`/`cocuk-sil` sonrası `navCiz` yerine
  `portallariTazele`, `cocuk-sil` şeritteki seçili çocuğu sıfırlıyor.
- `3b8fd36 commit 519` (2026-09-27, quiz): `odev-kaydet`'e `quizGovdesi('odev')` ve gövdeye `quiz`; `odev-tekrar`'a
  `quizTekrarAcUyarisi` onayı.
- `276c0a0 commit 521` (2026-09-27, gizli /admin): `yedek-al`, `yedek-indir`, `yedek-geri`, `yedek-sil`, `mudur-sil`
  eylemleri buradan çıkarıldı (yönetim paketine taşındı); `profil-kaydet` T.C. çakışmasını kutunun altında gösteriyor;
  `sifre-kaydet` yöneticiyi `yonetimeGec` ile yönetim adresine geçiriyor.
- `566b917 commit 524` (2026-09-27, canlı hazırlık): `odev-kaydet` gövdesine `dosyaYukleme`.
- Son değişiklik `7fda2ee commit 543` (2026-09-30, "hiç hata olmayacak" düzeltmesi): `hashchange` önce
  `tekSeferAyrilabilir('sayfa')` soruyor, vazgeçilirse adresi geri yazıyor; yeni `beforeunload` dinleyicisi; "Bu sistem
  hakkında" metnindeki "okulunun kendi sunucusunda" yanlışı "Eğitim Evi'nin sunucusunda; her okul yalnız kendi verisini
  görür" oldu. O günden beri değişmedi.
- Bilinen açıklar (kod değiştirilmedi): oturum yokken geri/ileri tuşunun `git()` çağırması, "Reddet"in onaysız olması,
  kilitlenmeyen düğmeler, UTC'ye göre "bugün", `sifre-kaydet`'in alan bilgisini kullanmaması, eski `odev-tekrar`
  yorumu, kullanılmayan `el` satırı, klavyeyle açılmayan `div` eylemleri; "Bu sistem hakkında" ile `kvkk.html` 6.
  bölümünün ("okulun kullandığı sunucu") çelişmesi.
- Planlı işlerden bu dosyaya dokunması beklenenler (DEVAM.md 4. bölüm):
  - "Üst şerit sadeleştirme" (iş 29): `hashchange` oturum yokken hiçbir sayfa açmayacak, geçmiş kayıtlarına oturum kimliği
    yazılacak, `pageshow` denetlenecek; ayarlar/yenile/uygulama düğmeleri profil menüsüne taşınınca `tiklamaKur`'daki
    bağlamalar değişecek; telefonda menü sınırı 860'tan 1100 piksele çıkabilir.
  - "Çok dil" (iş 22): buradaki onay, ileti ve "Kopyalandı" metinleri dil kataloğuna (`c()`) geçecek.
  - "Mesaj ayarları (çark) …" (iş 8) ve "Mesaj etiketleri" (iş 28): `mesaj-ayar-kaydet`, `mesaj-engel-kaldir`, `mesaj-sil`
    çark penceresine ve etiketli kutuya göre değişecek.
  - "Düzenleyiciler" (iş 15): `odev-kaydet`'in açıklaması ve takvim kaydının açıklaması ortak yazı düzenleyicisinden
    gelecek; ileri tarihli gönderim.
  - "Yıl geçişi" (iş 9): `yil-ekle` / `yil-aktif` yerine Eğitim Yılı sayfasında yeni yıl sihirbazı ve yeni yıl açarken
    çift doğrulama.
  - "Sistem" (iş 4): tarayıcı hata günlüğü (`window.onerror`, `unhandledrejection`) yakalanmayan eylem sözlerini de
    toplayacak.
  - "KVKK ve onay metinleri tam denetimi" (iş 18): "Bu sistem hakkında" metni.
  - "Arayüz önizlemesi" (iş 31): seçilecek tasarım dili ekranları yeniden çizerse düğmelerin `data-act` adları korunmalı.
  - Eylemleri ekran dosyalarına (`EYLEMLER`) taşımak planlı bir iş değil; yapılırsa `buton-denetimi.js` iki yolu da
    sayıyor.
