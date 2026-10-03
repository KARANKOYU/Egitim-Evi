# public/kosullar/KLASOR.md

Kullanım koşullarının klasörü; içindeki tek dosya `kosullar.html`, sitede `/kosullar/kosullar.html` adresinde açılan, hizmetin
niteliğini, kullanıcının yükümlülüklerini ve yapımcıların sorumluluğunun sınırını anlatan düz HTML sayfadır (bugün sürüm 1.3).

## Bu dosya ne yapar?

Aydınlatma metni ([../kvkk/KLASOR.md](../kvkk/KLASOR.md)) kişisel verilerin nasıl işlendiğini anlatır; bu sayfa ise sistemi
kullanmanın kurallarını: Eğitim Evi ücretsiz, açık kaynaklı bir okul grup projesidir, "olduğu gibi" sunulur, resmî okul
sistemlerinin yerine geçmez; kullanıcı hesabından ve yazdığından sorumludur; bir sorun çıkarsa yapımcılardan tazminat istenemez
(kanunun izin verdiği ölçüde).

Kim görür: herkes, girişsiz. Kim onaylar: kendisi kaydolan herkes, kayıt formundaki tek kutuyla — kutunun metni "Aydınlatma
metnini okudum… Kullanım koşullarını kabul ediyorum." Aynı cümle, aydınlatma metni güncellenince çıkan yeniden onay penceresinde
ve okulun açtığı hesabın (öğrenci, servisçi) ilk girişte gördüğü onay penceresinde de var (`kvkkOnayIste`).

27 Eylül'e kadar `public/kosullar.html` adıyla dururdu; "sayfa klasörleri" işinde (`commit 517`) bugünkü yerine taşındı. Kısa ve
eski adresler (`/kosullar`, `/kosullar/`, `/kosullar.html`, büyük harfli yazılışları) asıl adrese kalıcı olarak (301) yönlenir
([../../sunucu/http.md](../../sunucu/http.md), `YONLENDIRMELER`).

Bu `KLASOR.md` web'den okunamaz: sunucu `.md` uzantılı her adrese bilinmeyen adresle aynı 404'ü verir.

## İçinde neler var?

### `kosullar.html`

Klasördeki tek dosya (198 satır, ~14 KB). Uygulama paketi yüklenmez.

**Baş kısmı:** `/js/tema.js` (eş zamanlı), `/js/belge.js` (`defer`), arama motoru açıklaması ("hizmetin niteliği, kullanıcının
yükümlülükleri, sorumluluğun sınırları"), başlık "Kullanım Koşulları · Eğitim Evi", `/css/style.css`, sekme simgesi
`/simge-192.png?v=2` ve gömülü `<style>` (`.belge` düzeni; [../kvkk/KLASOR.md](../kvkk/KLASOR.md)'deki sayfanınkiyle aynı blok).

**Üst şerit ve alt bilgi:** bütün düz sayfalardaki ortak iskelet (logo, Giriş, Kayıt ol, İndir, ay/güneş, Hakkında, SSS,
Yapımcılar; altta Kaynak kodu ve dört bağlantı, boş `#sIletisim`). Tema düğmesini ve Yapımcılar listesini
[../js/belge.md](../js/belge.md) çalıştırır.

**Sürüm satırı:** başlık altında "Sürüm 1.3 · Yürürlük tarihi: 27.09.2026", sondaki `footer`'da "Kullanım Koşulları Sürüm 1.3".

**Giriş paragrafı:** koşullar herkes (öğrenci, veli, öğretmen, servisçi, müdür, personel) için geçerli; hesap açarken ve
koşullar güncellenince onay istenir; kişisel veriler için aydınlatma metnine bağlantı.

**Yedi bölüm:**

| # | Başlık | İçerik |
|---|---|---|
| 1 | Hizmetin niteliği | Ücretsiz, reklamsız, açık kaynak; "olduğu gibi" ve "erişilebildiği ölçüde"; özellikler haber verilmeden değişebilir, bakım için kapanabilir; e-Okul ve MEBBİS'in yerine geçmez; isteğe bağlı Eğitim Evi Aile uygulamasının konumuna acil durumda güvenilmemeli; servis konumu, sıra ve yoklama bildirimleri servisçiye ve bağlantıya bağlıdır, gecikebilir. |
| 2 | Kullanıcının yükümlülükleri | Doğru bilgi, şifreyi paylaşmama; kişi kodunu yalnız müdüre ya da site yöneticisine verme, yanlış kişiye verince "Yeni kod üret"; öğrencinin veli kodu yalnız velilerle; içerikten (mesaj, yorum, dosya) kişi sorumlu, hakaret/tehdit/telif ihlali yasak; izinsiz erişim ve aşırı yük yasak, açık bulunursa GitHub'dan bildir; kurala uymayan hesap kapatılabilir. |
| 3 | Okulun rolü | Öğrenci ve servisçi hesabını okul açar, öğretmeni kişi koduyla ekler, yetkileri verir; okulu ve müdürünü site yöneticisi müdürün kişi koduyla açar; okul veri sorumlusudur; okulla ilgili talepler okul yönetimine. |
| 4 | Sorumluluğun sınırlandırılması | Kutu içinde: kesinti, veri kaybı, geç gelen bildirim, yanlış girilen not/devamsızlık, kaçırılan teslim, başkasının içeriği yüzünden yapımcılar sorumlu tutulamaz, tazminat istenmez; kast ve ağır kusur (6098 sayılı TBK m. 115) ve tüketicinin yasal hakları saklı. |
| 5 | Sorun yaşarsanız | Önce okul yönetimi; teknik hata GitHub'da (gönüllülükle düzeltilir, süre taahhüdü yok); önemli belgeyi kendi cihazında sakla: ekler 7 gün, teslim dosyaları son teslimden 7 gün sonra silinir. |
| 6 | Fikrî haklar ve açık kaynak | Kod açık; okulların ve kişilerin girdiği içerik yazanlara aittir, yalnız hizmet için işlenir. |
| 7 | Değişiklikler ve uygulanacak hukuk | Güncellenince sürüm değişir ve onay yeniden istenir; Türkiye Cumhuriyeti hukuku. |

**Son kısım:** "← Giriş sayfasına dön" (`/login`) ve `footer`: "Bu metin genel bir şablondur ve hukuki danışmanlık yerine geçmez…".

Kendine ait betiği yoktur.

### Sürüm geçmişi (`git log`'dan)

| Sürüm | Commit | Ne değişti |
|---|---|---|
| 1.0 | `2d73c87 commit 453` (26.09) | ilk sürüm satırı (dosya bir commit önce, `2917a72 commit 452` ile eklendi) |
| 1.1 | `0acca75 commit 516` (27.09) | 2. bölüme kişi kodu maddesi; 3. bölüm "öğretmeni kişi koduyla ekler, okulu ve müdürünü site yöneticisi açar" |
| 1.2 | `24050a2 commit 518` (27.09) | 1. bölüme servis konumu/sıra/yoklama bildirimlerine güvenilmemesi maddesi |
| 1.3 | `566b917 commit 524` (27.09) | 5. bölümde silinme süreleri ayrıldı (ekler 7 gün, teslim dosyaları son teslimden 7 gün sonra) |

## Kimle konuşur?

- **Sunan:** [../../sunucu/http.md](../../sunucu/http.md) — `serveStatic`, `htmlSurumle` (`/css/style.css` ve `/js/tema.js`'e
  `?v=<ETag>`), `statikGonder`; kısa adresler `YONLENDIRMELER` ile 301.
- **Bu sayfaya bağlananlar:** `public/index.html` ([../KLASOR.md](../KLASOR.md)) — kayıt formunun onay kutusu (yeni sekme), SSS'te
  gizlilik cevabı, alt bilgi; [../js/parcalar/26-baslat.md](../js/parcalar/26-baslat.md) — `kvkkOnayIste` penceresindeki onay
  cümlesi; `kvkk/kvkk.html`'in 10. bölümü; bütün düz sayfaların alt bilgisi (`404.html`, `okul-bulunamadi.html`,
  `indir/indir.html`, `kvkk/kvkk.html`). Uygulamanın kendi alt bilgisinde (`07-yonlendirme.js` `altBilgi`) bu sayfanın bağlantısı
  yok; yalnız aydınlatma metni var.
- **Çağırdığı:** yalnız `belge.js` üzerinden `GET /api/site` (Yapımcılar listesi; [../../sunucu/site.md](../../sunucu/site.md)).
- **Görünüm:** [../css/parcalar/CSS.md](../css/parcalar/CSS.md) (`29-dis-sayfalar.css` üst şerit, alt bilgi) ve sayfanın kendi
  `<style>`'ı.
- **Sunucuda karşılığı olan bir sürüm sabiti yok** (aşağıda "Dikkat!").

## Nasıl çalışır (adım adım)?

```
/kosullar, /kosullar/, /kosullar.html, /Kosullar/KOSULLAR.html ─► 301 /kosullar/kosullar.html
/kosullar/kosullar.html ─► serveStatic ─► dosya var ─► htmlSurumle ─► 200 text/html (Cache-Control: no-cache, ETag)
tarayıcı: tema.js (tema hemen) ─► style.css?v=… ─► belge.js (defer): ay/güneş, Yapımcılar, GET /api/site

Kayıt formu: tek kutu = aydınlatma metni + kullanım koşulları ─► POST /api/register { kvkkOnay: true }
Koşullar değişirse: kosullar.html'de iki sürüm satırı ─► (yeniden onay istenecekse) KVKK_SURUM da artırılır
```

## Dikkat!

- **Kendi sürüm sabiti yok.** Sayfa "koşullar güncellendiğinde onayınız istenir" der; ama sunucuda koşullar için ayrı bir sürüm
  tutulmaz. Yeniden onay penceresi yalnız aydınlatma metninin sürümü (`KVKK_SURUM`,
  [../../sunucu/bolumler/kayit.md](../../sunucu/bolumler/kayit.md)) değişince çıkar. Bugüne kadar koşulların her yeni sürümünde
  aydınlatma metninin sürümü de aynı commit'te artırıldı (1.1 ile KVKK 1.10 `commit 516`; 1.2 ile KVKK 1.11 `commit 518`; 1.3 ile
  KVKK 1.13 `commit 524`). Bu alışkanlığı sürdür; yoksa sayfadaki cümle doğru olmaz. (Sürümü değiştirmeyen commit'ler —
  `505`, `510`, `511`, `517`, `523` — yalnız üst şeridi, adresleri ve simgeyi değiştirdi, metne dokunmadı.)
- **Sürüm iki yerde elle yazılır** (üstte ve `footer`'da); denetleyen test yok.
- **Şablon metin.** Sayfanın kendi notu: hukuki danışmanlık yerine geçmez; gerçek bir okulda yayına almadan önce hukukçuya
  gösterilmeli.
- **Mutlak yollar.** Sayfa `/kosullar/` altında durduğu için bütün `src`/`href` `/` ile başlar; göreli yol yanlış klasörü gösterir
  (`testler/test-adresler.js` denetler).
- **Satır içi betik çalışmaz** (`script-src 'self'`); gömülü `<style>` serbest.
- **İletişim satırı boş:** alt bilgideki `#sIletisim`'i bu sayfada dolduran yok ([../js/belge.md](../js/belge.md)).
- **5. bölümdeki süreler başka yerlerle aynı olmalı:** ek ve teslim dosyası süreleri aydınlatma metninin 7. bölümünde ve
  `index.html`'deki SSS'te de yazılı; biri değişince üçü birlikte değişir.

## Testleri

- `testler/test-adresler.js` (sunucu ister) — `/kosullar/kosullar.html` 200, `text/html`, içinde "Kullanım koşulları"
  (bağlantı metni); `/kosullar`, `/kosullar/`, `/kosullar.html`, `/kosullar/KOSULLAR.html` 301 ile asıl adrese;
  `/kosullar/indir.html` 404; öteki sayfaların alt bilgisinin `href="/kosullar/kosullar.html"` göstermesi; eski adrese bağlantı
  kalmaması.
- `testler/test-admin-gizli.js` — `.md` adreslerinin (bu klasördeki belge dahil) bilinmeyen adresle aynı 404 olması (genel kural).
- Bu dosya yazım denetimine (`testler/yazim-denetimi.js`) girmez; aydınlatma metni girer.
- Hepsi `bash testler/tumtest.sh` içinde (3200 portu, `egitimevi_test`). Elle: `/kosullar` yaz → `/kosullar/kosullar.html`
  açılmalı; sürüm satırı üstte ve altta aynı olmalı.

## Son durum

- `git log` (eski adıyla birlikte): 11 commit; ilk hâli `2917a72 commit 452` (2026-09-26, `public/kosullar.html`).
- `566b917 commit 524` (2026-09-27): sürüm 1.2 → 1.3 (üstte ve altta); 5. bölümdeki "yüklenen dosyalar 7 gün sonra silinir"
  cümlesi "mesaj ve ödev ekleri 7 gün sonra, ödev teslim dosyaları ödevin son tesliminden 7 gün sonra silinir" oldu.
- `0d27eba commit 523` (2026-09-27): yalnız iskelet — sekme simgesi `?v=2` ile, şeritteki logo yeni çizgi ev.
- `24050a2 commit 518` (2026-09-27): sürüm 1.1 → 1.2; 1. bölüme servis konumu, sıra ve yoklama bildirimlerine tek başına
  güvenilmemesi maddesi.
- Bilinen açık: koşulların ayrı sürüm sabiti yok (yukarıda); kod değiştirilmedi.
- Planlı işlerden etkileyecekler: "Eğitim içerikleri" (tanımında içerik sorumluluğu/KVKK metni var; yüklenen videolar için
  koşullara madde gerekebilir); "Çok dil" (hukuki metin çevrilmez, "Bu metin yalnız Türkçedir" notu); "Site duyurusu" (Sistem
  işi; şerit bu sayfanın da üstünde); "Arama motorunda görünme" (canlıda başlık ve açıklama); "Kulüpler kaldırılacak" bu sayfada
  kulüp geçmediği için dokunmaz.
