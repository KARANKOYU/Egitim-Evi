/* Quiz: ödevin içindeki sorular (sunucu: sunucu/bolumler/quiz.js).

   Öğretmen  - Yeni ödev ve Ödevi düzenle pencerelerinde açılıp kapanan
               düzenleyici (tek pencere kökü var; ikinci pencere açılmaz):
               soru türü, şıklar ve doğru kutuları, süre türü, "çıkınca o
               soru kapanır", sonuçların ne zaman görüneceği, "Metinden ekle"
               (yapıştırılan metnin sunucudaki önizlemesi) ve "Önizle"
               (öğrenci gibi görür; hiçbir şey kaydedilmez). Öğrencilerden
               biri başladıysa quiz kilitlidir.
             - Kontrol ekranında ekler listesinde quiz satırı, her öğrencinin
               quiz rozeti ve ayrıntısı, "Sonuçları şimdi aç".
   Öğrenci   - Ödev penceresindeki quiz satırından çözme sayfasına (SAYFALAR.quiz)
               gider: kalan süre, soru N/M, her cevap anında kaydedilir, sayfa
               yenilenince kaldığı yerden sürer. Sekme/uygulama değiştirme
               yalnız visibilitychange ile algılanır; 2 sn altı sayılmaz;
               dönünce fetch keepalive ile bildirilir.
   Veli      - Listede durum; puan yalnız sonuç açılınca (soru ve sekme kaydı yok).

   Süre sunucuda işler; buradaki sayaç yalnız gösterir. Doğru şık bilgisi
   öğrenciye sunucudan ancak sonuç açılınca gelir. */

var QUIZ_SINIRI = {
  soru: 100, soruMetni: 1000, secenek: 300, secenekEnAz: 2, secenekEnCok: 10, cevap: 2000,
  soruSureEnAz: 10, soruSureEnCok: 600, quizDkEnAz: 1, quizDkEnCok: 180
};
var QUIZ_TUR_AD = { dy: 'Doğru/Yanlış', coktan: 'Çoktan seçmeli', acik: 'Açık uçlu' };
var QUIZ_HARF = 'ABCDEFGHIJ';
var QUIZ_VARSAYILAN_SURE = 30;   // soru başına sürede yeni sorunun saniyesi

IKONLAR.yukari = '<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>';
IKONLAR.asagi = '<path d="M12 5v14"/><path d="m6 13 6 6 6-6"/>';

/* ================= ortak yazılar ================= */
function quizIki(n) { return (n < 10 ? '0' : '') + n; }

/* 45 -> "45 sn", 90 -> "1 dk 30 sn", 1200 -> "20 dk" */
function quizSureMetni(sn) {
  sn = Math.max(0, Math.round(Number(sn) || 0));
  var dk = Math.floor(sn / 60), s = sn % 60;
  if (!dk) return s + ' sn';
  return dk + ' dk' + (s ? ' ' + s + ' sn' : '');
}

function quizSureOzeti(q) {
  if (q.sureTuru === 'quiz') return quizSureMetni(q.toplamSn);
  if (q.sureTuru === 'soru') return 'soru başına süre' + (q.soruSureToplami ? ' (toplam ' + quizSureMetni(q.soruSureToplami) + ')' : '');
  return 'süresiz';
}

/* "Quiz · 10 soru · 20 dk" */
function quizOzetMetni(q) { return 'Quiz · ' + q.soruSayisi + ' soru · ' + quizSureOzeti(q); }

/* "8/10 (%80) · 2 açık uçlu soru puanlanmaz" */
function quizPuanMetni(s) {
  if (!s) return '';
  var h = s.puanliSayisi ? s.dogruSayisi + '/' + s.puanliSayisi + ' (%' + s.yuzde + ')' : 'Puanlı soru yok';
  if (s.acikUcluSayisi) h += ' · ' + s.acikUcluSayisi + ' açık uçlu soru puanlanmaz';
  return h;
}

/* "14:03:12" */
function quizSaat(iso) {
  var d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return quizIki(d.getHours()) + ':' + quizIki(d.getMinutes()) + ':' + quizIki(d.getSeconds());
}

/* Kalan süre sayacı: "4:05", "1:02:09" */
function quizSayac(ms) {
  var sn = Math.max(0, Math.ceil(ms / 1000));
  var s = Math.floor(sn / 3600), d = Math.floor(sn % 3600 / 60), k = sn % 60;
  return (s ? s + ':' + quizIki(d) : d) + ':' + quizIki(k);
}

/* "sonuclandi": öğretmen quizi kapattı (ödevi sonuçlandırdı ya da sonuçları açtı). */
function quizBitisNedeni(neden, ogretmen) {
  if (ogretmen) {
    return { ogrenci: 'öğrenci bitirdi', sure: 'süre doldu', teslim: 'son teslim geçti',
      sonuclandi: 'ödev sonuçlandırılınca ya da sonuçlar açılınca kapandı', cikis: 'sekmeden çıkınca bütün sorular kapandı' }[neden] || 'bitti';
  }
  return { ogrenci: 'Quizi bitirdin.', sure: 'Süre doldu; quiz bitti.', teslim: 'Son teslim geçtiği için quiz bitti.',
    sonuclandi: 'Öğretmen quizi kapattı (ödevi sonuçlandırdı ya da sonuçları açtı); quiz bitti.',
    cikis: 'Quizden çıktığın için soruların hepsi kapandı; quiz bitti.' }[neden] || 'Quiz bitti.';
}

/* "30 Eylül 2026, Çarşamba · 17:10" (sunucunun verdiği an). */
function quizTarihSaat(iso) {
  var d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return tarihGun(iso) + ' · ' + quizIki(d.getHours()) + ':' + quizIki(d.getMinutes());
}

function quizKapanmaYazi(k) {
  return k === 'cikis' ? 'Çıkınca kapandı' : k === 'sure' ? 'Süre doldu' : '';
}

/* Sayfaya yazılmış (kaydedilmemiş) yazı yoksa geçici tarayıcı belleği:
   yenilenen sekme hangi quizde olduğunu bilsin. */
function quizOturumYaz(ad, deger) { try { sessionStorage.setItem('ee_' + ad, deger); } catch (e) { /* gizli pencere */ } }
function quizOturumOku(ad) { try { return sessionStorage.getItem('ee_' + ad) || ''; } catch (e) { return ''; } }

/* ================= listelerde ve eklerde ================= */
/* Ödev listelerinde başlığın yanındaki küçük rozet. */
function quizListeEtiketi(q) {
  if (!q) return '';
  return ' <span class="etiket qz-etiket" title="' + esc(quizOzetMetni(q)) + '">' + ik('soru') + 'Quiz</span>';
}

/* Öğrenci ve veli listesinde quizin durumu (puan yalnız sonuç açılınca). */
function quizListeDurumu(q, kendisi) {
  if (!q) return '';
  var t;
  if (q.durum === 'bitti') {
    t = (kendisi ? 'Quiz: bitirdin' : 'Quiz: bitirdi') + ' · ' + (q.sonucAcik && q.sonuc ? quizPuanMetni(q.sonuc) : 'sonuç henüz açılmadı');
  } else if (q.durum === 'devam') t = 'Quiz: devam ediyor';
  else t = kendisi ? 'Quiz: çözmedin' : 'Quiz: başlamadı';
  return '<div class="qz-liste-durum ' + esc(q.durum) + '">' + ik('soru') + '<span>' + esc(t) + '</span></div>';
}

/* Öğretmenin ödev listesinde: "Quiz · 5 soru · 20 dk · 12 öğrenciden 3 kişi bitirdi" */
function quizOgretmenListeSatiri(q, ogrenciSayisi) {
  if (!q) return '';
  var t = quizOzetMetni(q) + ' · ' + ogrenciSayisi + ' öğrenciden ' + (q.biten || 0) + ' kişi bitirdi';
  if (q.baslayan > q.biten) t += ', ' + (q.baslayan - q.biten) + ' kişi çözüyor';
  return '<div class="qz-liste-durum">' + ik('soru') + '<span>' + esc(t) + '</span></div>';
}

/* Öğrenci (ve portaldan bakan veli, müdür) ödev penceresi: ekler listesinde
   quiz satırı. d: öğrencinin kendi quiz durumu (GET .../quiz), yoksa null. */
function quizOdevSatiri(a, d) {
  var q = a && a.quiz;
  if (!q) return '';
  var kendisi = S.user.role === 'student' && !S.viewStudentId;
  var durum = d ? d.durum : q.durum;
  var sonucAcik = d ? d.sonucAcik : q.sonucAcik, sonuc = d ? d.sonuc : q.sonuc;
  var yazi, dugme = '';
  function dugmeHtml(metin, ana) {
    return '<button type="button" class="btn kucuk' + (ana ? '' : ' ghost') + '" data-act="quiz-ac" data-id="' + esc(a.id) + '">' + metin + '</button>';
  }
  if (durum === 'bitti') {
    yazi = (kendisi ? 'Bitirdin · ' : 'Bitirdi · ') + (sonucAcik && sonuc ? quizPuanMetni(sonuc) : 'sonuçlar henüz açılmadı');
    if (kendisi) dugme = dugmeHtml(sonucAcik ? 'Sonucu gör' : 'Quizi aç', false);
  } else if (durum === 'devam') {
    yazi = kendisi ? 'Başladın; kaldığın yerden sürdür.' : 'Devam ediyor';
    if (kendisi) dugme = dugmeHtml('Devam et', true);
  } else if (a.status !== 'active') {
    yazi = 'Çözülmedi; ödev sonuçlandırıldı.';
  } else if (!kendisi) {
    yazi = 'Henüz başlamadı';
  } else if (!d) {
    yazi = 'Quiz bilgisi yükleniyor...';
  } else if (d.baslatabilir) {
    /* Süresiz quizde "süre işler" denmez (son teslim sınırı kurallar sayfasında yazar). */
    yazi = ((d.quiz || q).sureTuru === 'yok' ? 'Tek hakkın var; ikinci kez çözülemez.' : 'Tek hakkın var; başlayınca süre işler.');
    dugme = dugmeHtml('Quizi başlat', true);
  } else {
    yazi = d.engel || 'Quiz şu an başlatılamaz.';
  }
  return '<li class="ek-satir qz-ek-satir" id="qzOdevSatir">' + ik('soru') +
    '<span class="ek-ad"><b>' + esc(quizOzetMetni((d && d.quiz) || q)) + '</b><small>' + esc(yazi) + '</small></span>' + dugme + '</li>';
}

/* Öğretmenin kontrol ekranı: ekler listesindeki quiz satırı ve düğmeleri. */
function quizOgretmenSatiri(q, a) {
  if (!q) return '';
  var alt = [q.baslayan ? q.baslayan + ' öğrenci başladı' : 'Henüz kimse başlamadı'];
  if (q.sonucAcik) alt.push('sonuçlar öğrencilere açık');
  else if (q.sonucGorunum === 'hemen') alt.push('öğrenci sonucunu bitirince görür');
  else alt.push(a && a.endAt ? 'sonuçlar son teslimden 10 dakika sonra açılır' : 'sonuçları sen açınca görünür');
  if (q.cikincaKapanir) alt.push('sekmeden çıkınca soru kapanır');
  var dugmeler = '<button type="button" class="btn kucuk ghost" data-act="quiz-onizle-ac">Önizle</button>';
  if (yetkim('odev.ver')) dugmeler += '<button type="button" class="btn kucuk ghost" data-act="quiz-duzenle">Quizi düzenle</button>';
  if (!q.sonucAcik && yetkim('odev.sonuclandir') && a) {
    dugmeler += '<button type="button" class="btn kucuk" data-act="quiz-sonuc-ac" data-id="' + esc(a.id) + '">Sonuçları şimdi aç</button>';
  }
  return '<li class="ek-satir qz-ek-satir">' + ik('soru') +
    '<span class="ek-ad"><b>' + esc(quizOzetMetni(q)) + '</b><small>' + esc(alt.join(' · ')) + '</small></span>' +
    '<span class="qz-ek-dugmeler">' + dugmeler + '</span></li>';
}

/* Kontrol ekranında öğrencinin altındaki rozet:
   "Quiz: başlamadı" / "Quiz: devam ediyor" / "Quiz: 8/10 · 2 kez çıktı (35 sn)" */
function quizOgrenciRozeti(qo, odevId, ogrenciId) {
  if (!qo) return '';
  if (qo.durum === 'baslamadi') return '<div class="qz-rozet baslamadi">' + ik('soru') + '<span>Quiz: başlamadı</span></div>';
  var t;
  if (qo.durum === 'devam') t = 'Quiz: devam ediyor';
  else t = 'Quiz: ' + (qo.sonuc && qo.sonuc.puanliSayisi ? qo.sonuc.dogruSayisi + '/' + qo.sonuc.puanliSayisi : 'bitirdi');
  if (qo.cikisSayisi) t += ' · ' + qo.cikisSayisi + ' kez çıktı (' + quizSureMetni(qo.cikisSn) + ')';
  return '<button type="button" class="baglanti qz-rozet ' + esc(qo.durum) + (qo.cikisSayisi ? ' cikti' : '') + '" data-act="quiz-ayrinti" data-id="' +
    esc(odevId) + '" data-ogrenci="' + esc(ogrenciId) + '" title="Cevapları gör">' + ik('soru') + '<span>' + esc(t) + '</span></button>';
}

/* ================= soru ve sonuç çizimi (çözme, önizleme, sonuç) ================= */
/* Cevap alanı. s: { id, tur, metin, coklu, secenekler: [{ id, metin }] },
   cevap: { secilenler, metin }, ayar: { ad (seçim grubu), kapali }. */
function quizSoruHtml(s, cevap, ayar) {
  var h = '<div class="qz-soru-metin">' + (s.metin ? esc(s.metin) : '<i class="qz-bos-yazi">Soru metni yazılmadı</i>') + '</div>';
  cevap = cevap || { secilenler: [], metin: '' };
  if (s.tur === 'acik') {
    var m = cevap.metin || '';
    return h + '<textarea class="qz-cevap-metin" rows="5" maxlength="' + QUIZ_SINIRI.cevap + '"' + (ayar.kapali ? ' readonly' : '') +
      ' aria-label="Cevabın" placeholder="' + (ayar.kapali ? '' : 'Cevabını buraya yaz') + '">' + esc(m) + '</textarea>' +
      '<div class="qz-karakter"><span class="qz-karakter-sayi">' + m.length + '</span>/' + QUIZ_SINIRI.cevap +
      ' · Bu soru puanlanmaz; öğretmenin okur.</div>';
  }
  if (s.coklu) h += '<div class="qz-coklu-not">' + ik('onay') + 'Birden çok şık seçebilirsin.</div>';
  h += '<div class="qz-secenekler' + (s.tur === 'dy' ? ' dy' : '') + '" role="' + (s.coklu ? 'group' : 'radiogroup') + '" aria-label="Şıklar">';
  for (var j = 0; j < s.secenekler.length; j++) {
    var c = s.secenekler[j], secili = (cevap.secilenler || []).indexOf(c.id) >= 0;
    h += '<label class="qz-secenek' + (secili ? ' secili' : '') + (ayar.kapali ? ' kapali' : '') + '">' +
      '<input type="' + (s.coklu ? 'checkbox' : 'radio') + '" class="qz-sec" name="' + esc(ayar.ad) + '" value="' + esc(c.id) + '"' +
      (secili ? ' checked' : '') + (ayar.kapali ? ' disabled' : '') + '>' +
      (s.tur === 'dy' ? '' : '<span class="qz-harf">' + QUIZ_HARF.charAt(j) + '</span>') +
      '<span class="qz-sec-metin">' + (c.metin ? esc(c.metin) : '<i class="qz-bos-yazi">boş şık</i>') + '</span></label>';
  }
  return h + '</div>';
}

/* Sonucu açılmış sorular (öğrenci) ya da bir öğrencinin cevapları (öğretmen):
   doğru cevap yeşil, yanlış seçim kırmızı, açık uçlu metin olduğu gibi. */
function quizSonucListesi(sorular, ogretmen, suruyor) {
  var h = '<ol class="qz-sonuc-liste">';
  for (var i = 0; i < sorular.length; i++) {
    var s = sorular[i], c = s.cevap || { secilenler: [], metin: '' };
    var secilen = c.secilenler || [], dogrular = s.dogruSecenekler || [];
    var bos = s.tur === 'acik' ? !(c.metin || '').trim() : !secilen.length;
    /* Öğrenci hâlâ çözerken boş soru yanlış sayılmaz, yalnız "cevaplanmadı". */
    var bekliyor = suruyor && bos && s.tur !== 'acik';
    var sinif = s.tur === 'acik' ? 'acik' : bekliyor ? '' : s.dogruMu === true ? 'dogru' : s.dogruMu === false ? 'yanlis' : '';
    var etiket = s.tur === 'acik' ? '<span class="etiket gri">Puanlanmaz</span>'
      : bekliyor ? '<span class="etiket gri">Cevaplanmadı</span>'
      : s.dogruMu === true ? '<span class="etiket yesil">' + ik('onay') + 'Doğru</span>'
        : s.dogruMu === false ? '<span class="etiket kirmizi">' + ik('hayir') + (bos ? 'Boş' : 'Yanlış') + '</span>' : '';
    var bilgi = [];
    if (s.kapandi === 'sure' || s.kapandi === 'cikis') bilgi.push(quizKapanmaYazi(s.kapandi));
    if (ogretmen && s.gecenSn !== null && s.gecenSn !== undefined) bilgi.push('Geçen süre: ' + quizSureMetni(s.gecenSn) + (s.sureSn ? ' / ' + quizSureMetni(s.sureSn) : ''));
    h += '<li class="qz-sonuc-soru ' + sinif + '">' +
      '<div class="qz-soru-bas"><span class="qz-no">' + (i + 1) + '</span><span class="qz-tur-ad">' + QUIZ_TUR_AD[s.tur] +
      (s.coklu ? ' · birden çok doğru' : '') + '</span>' + etiket + '</div>' +
      (bilgi.length ? '<div class="qz-soru-bilgi">' + ik('saat') + esc(bilgi.join(' · ')) + '</div>' : '') +
      '<div class="qz-soru-metin">' + esc(s.metin) + '</div>';
    if (s.tur === 'acik') {
      h += '<div class="qz-acik-cevap' + (bos ? ' cevapsiz' : '') + '">' + (bos ? 'Cevap yazılmadı.' : esc(c.metin)) + '</div>';
    } else {
      h += '<ul class="qz-sonuc-siklar">';
      for (var j = 0; j < s.secenekler.length; j++) {
        var x = s.secenekler[j], dogru = dogrular.indexOf(x.id) >= 0, sec = secilen.indexOf(x.id) >= 0;
        h += '<li class="' + (dogru ? 'dogru' : '') + (sec && !dogru ? ' yanlis' : '') + (sec ? ' secildi' : '') + '">' +
          (s.tur === 'dy' ? '' : '<span class="qz-harf">' + QUIZ_HARF.charAt(j) + '</span>') +
          '<span class="qz-sec-metin">' + esc(x.metin) + '</span>' +
          (sec ? '<span class="qz-isaret">' + (ogretmen ? 'Öğrencinin seçimi' : 'Senin seçimin') + '</span>' : '') +
          (dogru ? '<span class="qz-isaret dogru">' + ik('onay') + 'Doğru cevap</span>' : '') + '</li>';
      }
      h += '</ul>';
    }
    h += '</li>';
  }
  return h + '</ol>';
}

/* ================= öğretmen: düzenleyici ================= */
/* kimlik ('odev': Yeni ödev, 'duzelt': Ödevi düzenle, 'onizle': kontrol
   ekranındaki önizleme) -> { acik, quiz, kilitli, baslayan, ilk, metin, onizle } */
var QUIZ_DZ = {};

function quizYeniSoru(tur, sureSn) {
  return { tur: tur, metin: '', sureSn: sureSn || null, dogru: null,
    secenekler: tur === 'coktan' ? [{ metin: '', dogru: false }, { metin: '', dogru: false }, { metin: '', dogru: false }, { metin: '', dogru: false }] : [] };
}

function quizBos() {
  return { sureTuru: 'yok', toplamDk: 20, cikincaKapanir: false, sonucGorunum: 'teslim', sorular: [quizYeniSoru('coktan', null)] };
}

/* Sunucudaki quiz (GET /:id) -> düzenleyicinin tuttuğu biçim. */
function quizDuzenleyiciye(q) {
  if (!q) return null;
  return {
    sureTuru: q.sureTuru || 'yok', toplamDk: q.toplamSn ? Math.round(q.toplamSn / 60) : 20,
    cikincaKapanir: !!q.cikincaKapanir, sonucGorunum: q.sonucGorunum || 'teslim',
    sorular: (q.sorular || []).map(function (s) {
      return {
        tur: s.tur, metin: s.metin || '', sureSn: s.sureSn || null,
        dogru: s.tur === 'dy' && typeof s.dogru === 'boolean' ? s.dogru : null,
        secenekler: s.tur === 'coktan' ? (s.secenekler || []).map(function (c) { return { metin: c.metin || '', dogru: !!c.dogru }; }) : []
      };
    })
  };
}

function quizSayi(v) {
  var s = String(v === null || v === undefined ? '' : v).replace(/\s/g, '');
  return /^\d{1,6}$/.test(s) ? parseInt(s, 10) : null;
}

/* Düzenleyicinin durumu -> sunucuya giden quiz (denetimsiz). */
function quizGonderilecek(q) {
  return {
    sureTuru: q.sureTuru, toplamDk: q.sureTuru === 'quiz' ? quizSayi(q.toplamDk) : null,
    cikincaKapanir: !!q.cikincaKapanir, sonucGorunum: q.sonucGorunum,
    sorular: q.sorular.map(function (s) {
      var o = { tur: s.tur, metin: String(s.metin || '').trim() };
      if (q.sureTuru === 'soru') o.sureSn = quizSayi(s.sureSn);
      if (s.tur === 'dy') o.dogru = s.dogru;
      if (s.tur === 'coktan') {
        o.secenekler = s.secenekler.map(function (c) { return { metin: String(c.metin || '').replace(/\s+/g, ' ').trim(), dogru: !!c.dogru }; });
      }
      return o;
    })
  };
}

/* Sunucudaki quizDogrula'nın sınırları (istemci de denetler; sunucu yine denetler). */
function quizDenetle(g) {
  var L = QUIZ_SINIRI;
  if (!g.sorular.length) return { hata: 'Quizde en az bir soru olmalı.' };
  if (g.sorular.length > L.soru) return { hata: 'Quizde en fazla ' + L.soru + ' soru olabilir.' };
  if (g.sureTuru === 'quiz' && (g.toplamDk === null || g.toplamDk < L.quizDkEnAz || g.toplamDk > L.quizDkEnCok)) {
    return { hata: 'Bütün quiz süresi ' + L.quizDkEnAz + ' ile ' + L.quizDkEnCok + ' dakika arasında olmalı.', alan: 'dk' };
  }
  for (var i = 0; i < g.sorular.length; i++) {
    var s = g.sorular[i], n = i + 1;
    if (!s.metin) return { hata: n + '. sorunun metni boş.', soru: n };
    if (s.metin.length > L.soruMetni) return { hata: n + '. sorunun metni en fazla ' + L.soruMetni + ' karakter olabilir.', soru: n };
    if (g.sureTuru === 'soru' && (s.sureSn === null || s.sureSn < L.soruSureEnAz || s.sureSn > L.soruSureEnCok)) {
      return { hata: n + '. sorunun süresi 10 saniye ile 10 dakika (600 sn) arasında olmalı.', soru: n };
    }
    if (s.tur === 'dy' && typeof s.dogru !== 'boolean') return { hata: n + '. soruda doğru cevabı seç: Doğru ya da Yanlış.', soru: n };
    if (s.tur === 'coktan') {
      if (s.secenekler.length < L.secenekEnAz) return { hata: n + '. soruda en az ' + L.secenekEnAz + ' şık olmalı.', soru: n };
      if (s.secenekler.length > L.secenekEnCok) return { hata: n + '. soruda en fazla ' + L.secenekEnCok + ' şık olabilir.', soru: n };
      var dogruVar = false;
      for (var j = 0; j < s.secenekler.length; j++) {
        var c = s.secenekler[j];
        if (!c.metin) return { hata: n + '. sorunun ' + QUIZ_HARF.charAt(j) + ' şıkkı boş. Boş şıkkı sil ya da doldur.', soru: n };
        if (c.metin.length > L.secenek) return { hata: n + '. sorunun ' + QUIZ_HARF.charAt(j) + ' şıkkı en fazla ' + L.secenek + ' karakter olabilir.', soru: n };
        if (c.dogru) dogruVar = true;
      }
      if (!dogruVar) return { hata: n + '. soruda doğru şık işaretli değil.', soru: n };
      /* Bütün şıklar doğruysa "Birden çok şık seçebilirsin" notu cevabı ele verir. */
      if (!s.secenekler.some(function (x) { return !x.dogru; })) {
        return { hata: n + '. soruda bütün şıklar doğru işaretli; en az bir şık yanlış olmalı.', soru: n };
      }
    }
  }
  return null;
}

/* Ödev penceresine eklenen alan. mevcut: sunucudaki quiz (düzenlemede) ya da null. */
function quizAlani(kimlik, mevcut) {
  var q = quizDuzenleyiciye(mevcut);
  QUIZ_DZ[kimlik] = {
    acik: !!q, quiz: q, kilitli: !!(mevcut && mevcut.kilitli), baslayan: (mevcut && mevcut.baslayan) || 0,
    ilk: q ? JSON.stringify(quizGonderilecek(q)) : 'null', metin: null, onizle: null
  };
  return '<div class="qz-alan" id="qzAlan-' + kimlik + '" data-kimlik="' + kimlik + '">' + quizAlaniIc(kimlik) + '</div>';
}

/* Pencere açıkken quiz bölümünü sunucudaki hâliyle yeniden kurar (Ödevi
   düzenle'de kaydederken quiz kilitlendiyse). */
function quizAlaniYenile(kimlik, mevcut) {
  var kok = $('qzAlan-' + kimlik);
  if (!kok) return;
  kok.outerHTML = quizAlani(kimlik, mevcut);
  quizPencereAyari();
}

function quizAlaniIc(kimlik) {
  var d = QUIZ_DZ[kimlik];
  if (!d) return '';
  var k = esc(kimlik);
  if (!d.acik) {
    return '<button type="button" class="qz-ekle" data-act="quiz-ekle" data-kimlik="' + k + '">' + ik('soru') +
      '<span><b>Quiz ekle</b>: Doğru/Yanlış, çoktan seçmeli ya da açık uçlu sorular</span>' +
      '<small>Öğrenci ödevi açıp quizi çözer; tek deneme hakkı vardır.</small></button>';
  }
  if (d.onizle) return quizOnizleHtml(kimlik);
  var q = d.quiz;
  var h = '<div class="qz-baslik"><h4>' + ik('soru') + 'Quiz</h4><span class="qz-baslik-sayi">' + q.sorular.length + ' soru</span>' +
    (d.kilitli ? '' : '<button type="button" class="baglanti" data-act="quiz-kaldir" data-kimlik="' + k + '">Quizi kaldır</button>') + '</div>';
  if (d.kilitli) {
    return h + '<div class="msg uyari qz-kilit">' + ik('kilit') + d.baslayan + ' öğrenci başladı; quiz artık değiştirilemez.</div>' +
      '<div class="hint">' + esc(quizOzetMetni({ soruSayisi: q.sorular.length, sureTuru: q.sureTuru, toplamSn: (quizSayi(q.toplamDk) || 0) * 60,
        soruSureToplami: q.sorular.reduce(function (t, s) { return t + (quizSayi(s.sureSn) || 0); }, 0) })) + '</div>' +
      '<div class="qz-alt"><button type="button" class="btn kucuk gri" data-act="quiz-onizle" data-kimlik="' + k + '">Önizle</button></div>';
  }
  if (d.metin) return h + quizMetinPaneli(kimlik);

  /* süre türü, çıkınca kapanır, sonuç görünümü */
  h += '<div class="qz-ayar"><div class="field"><span class="qz-ayar-ad" id="qzSureAd-' + k + '">Süre</span>' +
    '<div class="qz-cipler" role="radiogroup" aria-labelledby="qzSureAd-' + k + '">';
  [['yok', 'Süresiz'], ['soru', 'Soru başına'], ['quiz', 'Bütün quiz']].forEach(function (x) {
    h += '<label class="qz-cip' + (q.sureTuru === x[0] ? ' secili' : '') + '"><input type="radio" class="qz-sure-turu" name="qzSure-' + k +
      '" value="' + x[0] + '"' + (q.sureTuru === x[0] ? ' checked' : '') + '>' + x[1] + '</label>';
  });
  h += '</div>';
  if (q.sureTuru === 'quiz') {
    h += '<div class="qz-dk"><input type="number" class="qz-girdi" id="qzDk-' + k + '" min="1" max="180" inputmode="numeric" value="' +
      esc(q.toplamDk) + '" aria-label="Bütün quiz süresi (dakika)"><span>dakika (1–180)</span></div>' +
      '<div class="hint">Başlayınca süre işler; süre bitince quiz kendiliğinden biter. Sorular arasında serbestçe gezilir.</div>';
  } else if (q.sureTuru === 'soru') {
    h += '<div class="hint">Her sorunun süresini aşağıya yaz (10 sn – 10 dk). Sorular sırayla gelir; geri dönülmez.</div>';
  } else {
    h += '<div class="hint">Süre sınırı yok; sorular arasında serbestçe gezilir. Ödevin son teslimi varsa quiz de o zaman kapanır.</div>';
  }
  h += '</div>' +
    '<label class="onay"><input type="checkbox" class="qz-cikinca" id="qzCikinca-' + k + '"' + (q.cikincaKapanir ? ' checked' : '') + '>' +
    '<span>Uygulamadan/sekmeden çıkınca o soru kapanır</span></label>' +
    '<div class="hint qz-cikinca-not">Çıkışlar (başka sekme, uygulama ya da sitenin başka sayfası) her durumda kaydedilir; bu seçenekle ' +
    'çıkarken açık olan soru bir daha cevaplanamaz. Kayıt öğrencinin tarayıcısından gelir: caydırıcıdır, kesin kanıt değildir.</div>' +
    '<div class="field"><label for="qzSonuc-' + k + '">Sonuçlar öğrenciye</label><select id="qzSonuc-' + k + '" class="qz-sonuc-gorunum" aria-describedby="qzSonucNot-' + k + '">' +
    '<option value="teslim"' + (q.sonucGorunum !== 'hemen' ? ' selected' : '') + '>Son teslimden 10 dakika sonra görünsün</option>' +
    '<option value="hemen"' + (q.sonucGorunum === 'hemen' ? ' selected' : '') + '>Hemen görünsün (bitirince)</option></select>' +
    '<div class="hint" id="qzSonucNot-' + k + '">Son tarihi olmayan ödevde sonuçlar sen açınca ya da ödevi sonuçlandırınca görünür. ' +
    '"Hemen" seçilirse önce bitiren doğru cevapları görür; herkes aynı anda çözmüyorsa cevaplar yayılabilir.</div></div></div>';

  /* sorular */
  if (!q.sorular.length) h += '<div class="hint qz-soru-yok">Henüz soru yok. "Soru ekle" ya da "Metinden ekle" ile başla.</div>';
  h += '<ol class="qz-sorular">';
  for (var i = 0; i < q.sorular.length; i++) h += quizDuzenSorusu(kimlik, q, i);
  h += '</ol>' +
    '<div class="qz-alt">' +
    '<button type="button" class="btn kucuk ghost" data-act="quiz-soru-ekle" data-kimlik="' + k + '">' + ik('ekle') + 'Soru ekle</button>' +
    '<button type="button" class="btn kucuk gri" data-act="quiz-metin-ac" data-kimlik="' + k + '">Metinden ekle</button>' +
    '<button type="button" class="btn kucuk gri" data-act="quiz-onizle" data-kimlik="' + k + '">' + ik('goz') + 'Önizle</button></div>' +
    '<div class="qz-bilgi" id="qzBilgi-' + k + '" role="status"></div>';
  return h;
}

function quizDuzenSorusu(kimlik, q, i) {
  var s = q.sorular[i], n = i + 1, k = esc(kimlik);
  var ortak = ' data-kimlik="' + k + '" data-i="' + i + '"';
  /* s.uyari: "Metinden ekle"nin bu soru için bulduğu sorunlar (soruya yazınca kalkar). */
  var uyari = s.uyari && s.uyari.length;
  var h = '<li class="qz-soru' + (uyari ? ' hatali' : '') + '" data-i="' + i + '"><div class="qz-soru-ust"><span class="qz-no">' + n + '</span>' +
    '<select class="qz-tur qz-girdi" aria-label="' + n + '. sorunun türü">';
  ['coktan', 'dy', 'acik'].forEach(function (t) {
    h += '<option value="' + t + '"' + (s.tur === t ? ' selected' : '') + '>' + QUIZ_TUR_AD[t] + '</option>';
  });
  h += '</select>';
  if (q.sureTuru === 'soru') {
    h += '<label class="qz-sure-kutu"><input type="number" class="qz-sure qz-girdi" min="10" max="600" inputmode="numeric" value="' +
      esc(s.sureSn === null || s.sureSn === undefined ? '' : s.sureSn) + '" aria-label="' + n + '. sorunun süresi (saniye)"><span>sn</span></label>';
  }
  h += '<span class="qz-soru-dugmeler">' +
    '<button type="button" class="qz-ikon-btn" data-act="quiz-soru-yukari"' + ortak + (i ? '' : ' disabled') + ' aria-label="' + n + '. soruyu yukarı taşı" title="Yukarı taşı">' + ik('yukari') + '</button>' +
    '<button type="button" class="qz-ikon-btn" data-act="quiz-soru-asagi"' + ortak + (i < q.sorular.length - 1 ? '' : ' disabled') + ' aria-label="' + n + '. soruyu aşağı taşı" title="Aşağı taşı">' + ik('asagi') + '</button>' +
    '<button type="button" class="qz-ikon-btn sil" data-act="quiz-soru-sil"' + ortak + ' aria-label="' + n + '. soruyu sil" title="Soruyu sil">' + ik('hayir') + '</button></span></div>' +
    '<textarea class="qz-metin qz-girdi" rows="2" maxlength="' + QUIZ_SINIRI.soruMetni + '" placeholder="Soru metni" aria-label="' + n + '. sorunun metni">' + esc(s.metin) + '</textarea>';
  if (s.tur === 'dy') {
    h += '<div class="qz-dy" role="radiogroup" aria-label="' + n + '. sorunun doğru cevabı"><span class="qz-ayar-ad">Doğru cevap:</span>' +
      '<label class="qz-cip' + (s.dogru === true ? ' secili' : '') + '"><input type="radio" name="qzDy-' + k + '-' + i + '" value="1"' + (s.dogru === true ? ' checked' : '') + '>Doğru</label>' +
      '<label class="qz-cip' + (s.dogru === false ? ' secili' : '') + '"><input type="radio" name="qzDy-' + k + '-' + i + '" value="0"' + (s.dogru === false ? ' checked' : '') + '>Yanlış</label></div>';
  } else if (s.tur === 'coktan') {
    h += '<div class="qz-siklar">';
    for (var j = 0; j < s.secenekler.length; j++) {
      var c = s.secenekler[j], harf = QUIZ_HARF.charAt(j) || '?';
      h += '<div class="qz-sik' + (c.dogru ? ' dogru' : '') + '"><span class="qz-harf">' + harf + '</span>' +
        '<input type="text" class="qz-sik-metin qz-girdi" maxlength="' + QUIZ_SINIRI.secenek + '" value="' + esc(c.metin) + '" placeholder="' + harf + ' şıkkı" aria-label="' + n + '. sorunun ' + harf + ' şıkkı">' +
        '<label class="qz-dogru-kutu" title="Doğru şık"><input type="checkbox" class="qz-sik-dogru"' + (c.dogru ? ' checked' : '') + ' aria-label="' + harf + ' şıkkı doğru">Doğru</label>' +
        '<button type="button" class="qz-ikon-btn sil" data-act="quiz-sik-sil"' + ortak + ' data-j="' + j + '" aria-label="' + harf + ' şıkkını sil" title="Şıkkı sil">' + ik('hayir') + '</button></div>';
    }
    h += '</div><div class="qz-sik-alt">' +
      (s.secenekler.length < QUIZ_SINIRI.secenekEnCok ? '<button type="button" class="baglanti" data-act="quiz-sik-ekle"' + ortak + '>Şık ekle</button>' : '') +
      '<span class="hint">Birden çok doğru işaretlersen öğrenci birden çok şık seçebilir; puan için hepsini bulmalı.</span></div>';
  } else {
    h += '<div class="hint">Öğrenci cevabını yazar (en fazla 2000 karakter). Puanlanmaz; kontrol ederken okursun.</div>';
  }
  if (uyari) h += '<div class="alan-hata" role="alert">' + ik('uyari') + '<span>' + esc(s.uyari.join(' ')) + '</span></div>';
  return h + '</li>';
}

/* Ekranda yazılanları duruma aktarır (yeniden çizmeden önce, kaydederken). */
function quizDomdanOku(kimlik) {
  var d = QUIZ_DZ[kimlik], kok = $('qzAlan-' + kimlik);
  if (!d || !d.acik || d.kilitli || d.onizle || d.metin || !kok || !kok.querySelector('.qz-sorular')) return;
  var q = d.quiz;
  var st = kok.querySelector('.qz-sure-turu:checked');
  if (st) q.sureTuru = st.value;
  var dk = $('qzDk-' + kimlik);
  if (dk) q.toplamDk = dk.value;
  var ck = $('qzCikinca-' + kimlik);
  if (ck) q.cikincaKapanir = ck.checked;
  var sg = $('qzSonuc-' + kimlik);
  if (sg) q.sonucGorunum = sg.value;
  var ogeler = kok.querySelectorAll('.qz-soru');
  for (var i = 0; i < ogeler.length; i++) {
    var li = ogeler[i], s = q.sorular[i];
    if (!s) continue;
    s.tur = li.querySelector('.qz-tur').value;
    s.metin = li.querySelector('.qz-metin').value;
    var su = li.querySelector('.qz-sure');
    if (su) s.sureSn = su.value;
    if (li.querySelector('.qz-dy')) {
      var dy = li.querySelector('.qz-dy input:checked');
      s.dogru = dy ? dy.value === '1' : null;
    }
    if (li.querySelector('.qz-siklar')) {
      var siklar = li.querySelectorAll('.qz-sik');
      s.secenekler = [];
      for (var j = 0; j < siklar.length; j++) {
        s.secenekler.push({ metin: siklar[j].querySelector('.qz-sik-metin').value, dogru: siklar[j].querySelector('.qz-sik-dogru').checked });
      }
    }
  }
}

function quizYenidenCiz(kimlik) {
  var kok = $('qzAlan-' + kimlik);
  if (kok) kok.innerHTML = quizAlaniIc(kimlik);
  quizPencereAyari();
}

/* Quiz açıkken pencere genişler ve perdeye tıklayınca kapanmaz (yazılan
   sorular yanlışlıkla gitmesin; "Vazgeç" yine kapatır). */
function quizPencereAyari() {
  var m = document.querySelector('#modalKok .modal'), p = document.querySelector('#modalKok .perde');
  if (!m) return;
  var acik = !!m.querySelector('.qz-alan .qz-baslik, .qz-alan .qz-onizle, .qz-ayrinti');
  m.classList.toggle('qz-genis', acik);
  if (p && m.querySelector('.qz-alan .qz-baslik')) p.setAttribute('data-zorunlu', '1');
}

/* liste: iletinin altında maddeler (isteğe bağlı). */
function quizBilgi(kimlik, tur, metin, liste) {
  var b = $('qzBilgi-' + kimlik);
  if (!b) return;
  var alt = liste && liste.length ? '<ul class="qz-bilgi-liste">' + liste.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '';
  b.innerHTML = metin ? '<div class="msg ' + tur + '">' + esc(metin) + alt + '</div>' : '';
}

/* Hatalı soruyu işaretler ve gösterir. */
function quizHataGoster(kimlik, h) {
  var kok = $('qzAlan-' + kimlik);
  if (!kok) return;
  var eski = kok.querySelectorAll('.qz-soru.hatali, .qz-ayar.hatali');
  for (var i = 0; i < eski.length; i++) {
    eski[i].classList.remove('hatali');
    var y = eski[i].querySelector('.alan-hata');
    if (y) y.parentNode.removeChild(y);
  }
  var hedef = h.soru ? kok.querySelectorAll('.qz-soru')[h.soru - 1] : h.alan === 'dk' ? kok.querySelector('.qz-ayar') : null;
  if (!hedef) return;
  hedef.classList.add('hatali');
  hedef.insertAdjacentHTML('beforeend', '<div class="alan-hata" role="alert">' + ik('uyari') + '<span>' + esc(h.hata) + '</span></div>');
  hedef.scrollIntoView({ block: 'center' });
}

/* Kaydederken: { quiz: undefined } (dokunulmayacak), { quiz: null } (yok ya da
   kaldırıldı), { quiz: {...} } ya da { hata }. */
function quizGovdesi(kimlik) {
  var d = QUIZ_DZ[kimlik];
  if (!d || d.kilitli) return { quiz: undefined };
  quizDomdanOku(kimlik);
  if (d.metin && String(d.metin.deger || '').trim()) {
    return { hata: 'Yapıştırdığın soruları önce "Ekle" ile quize aktar ya da "Vazgeç" de.' };
  }
  if (!d.acik) return { quiz: null };
  var g = quizGonderilecek(d.quiz);
  var h = quizDenetle(g);
  if (h) {
    if (d.onizle || d.metin) { d.onizle = null; d.metin = null; quizYenidenCiz(kimlik); }
    quizHataGoster(kimlik, h);
    return { hata: h.hata };
  }
  return { quiz: g };
}

/* Düzeltmede quiz değişti mi (değişmediyse sunucuya gitmez). */
function quizDegistiMi(kimlik, govde) {
  var d = QUIZ_DZ[kimlik];
  return !!d && govde !== undefined && JSON.stringify(govde) !== d.ilk;
}

function quizDz(el) {
  var kimlik = el.getAttribute('data-kimlik');
  return { kimlik: kimlik, d: QUIZ_DZ[kimlik], i: parseInt(el.getAttribute('data-i'), 10), j: parseInt(el.getAttribute('data-j'), 10) };
}

function quizOdakla(kimlik, secici) {
  var kok = $('qzAlan-' + kimlik);
  var el = kok && kok.querySelector(secici);
  if (!el) return;
  try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
  el.scrollIntoView({ block: 'center' });
}

EYLEMLER['quiz-ekle'] = function (el) {
  var x = quizDz(el);
  if (!x.d) return;
  x.d.acik = true;
  x.d.quiz = x.d.quiz || quizBos();
  quizYenidenCiz(x.kimlik);
  quizOdakla(x.kimlik, '.qz-metin');
};

EYLEMLER['quiz-kaldir'] = function (el) {
  var x = quizDz(el);
  if (!x.d) return;
  quizDomdanOku(x.kimlik);
  var yazili = x.d.quiz && x.d.quiz.sorular.some(function (s) { return String(s.metin || '').trim(); });
  if ((yazili || x.d.ilk !== 'null') && !confirm(x.d.ilk !== 'null'
    ? 'Quiz ödevden kaldırılsın mı? Kaydedince sorular silinir.' : 'Quiz kaldırılsın mı? Yazdığın sorular silinir.')) return;
  x.d.acik = false; x.d.quiz = null; x.d.metin = null; x.d.onizle = null;
  quizYenidenCiz(x.kimlik);
};

EYLEMLER['quiz-soru-ekle'] = function (el) {
  var x = quizDz(el);
  if (!x.d) return;
  quizDomdanOku(x.kimlik);
  var q = x.d.quiz;
  if (q.sorular.length >= QUIZ_SINIRI.soru) { quizBilgi(x.kimlik, 'uyari', 'Quizde en fazla ' + QUIZ_SINIRI.soru + ' soru olabilir.'); return; }
  var son = q.sorular[q.sorular.length - 1];
  q.sorular.push(quizYeniSoru(son ? son.tur : 'coktan', q.sureTuru === 'soru' ? (son && quizSayi(son.sureSn)) || QUIZ_VARSAYILAN_SURE : null));
  quizYenidenCiz(x.kimlik);
  quizOdakla(x.kimlik, '.qz-soru:last-child .qz-metin');
};

EYLEMLER['quiz-soru-sil'] = function (el) {
  var x = quizDz(el);
  if (!x.d) return;
  quizDomdanOku(x.kimlik);
  var s = x.d.quiz.sorular[x.i];
  if (!s) return;
  if (String(s.metin || '').trim() && !confirm((x.i + 1) + '. soru silinsin mi?')) return;
  x.d.quiz.sorular.splice(x.i, 1);
  quizYenidenCiz(x.kimlik);
};

function quizSoruTasi(el, yon) {
  var x = quizDz(el);
  if (!x.d) return;
  quizDomdanOku(x.kimlik);
  var l = x.d.quiz.sorular, h = x.i + yon;
  if (h < 0 || h >= l.length) return;
  var t = l[x.i]; l[x.i] = l[h]; l[h] = t;
  quizYenidenCiz(x.kimlik);
  /* Taşınan sorunun aynı düğmesine odaklanılır (en uca geldiyse metnine). */
  var dugme = yon < 0 ? '.qz-soru-dugmeler .qz-ikon-btn:nth-of-type(1)' : '.qz-soru-dugmeler .qz-ikon-btn:nth-of-type(2)';
  quizOdakla(x.kimlik, '.qz-soru[data-i="' + h + '"] ' + dugme + ':not([disabled]), .qz-soru[data-i="' + h + '"] .qz-metin');
}
EYLEMLER['quiz-soru-yukari'] = function (el) { quizSoruTasi(el, -1); };
EYLEMLER['quiz-soru-asagi'] = function (el) { quizSoruTasi(el, 1); };

EYLEMLER['quiz-sik-ekle'] = function (el) {
  var x = quizDz(el);
  if (!x.d) return;
  quizDomdanOku(x.kimlik);
  var s = x.d.quiz.sorular[x.i];
  if (!s || s.secenekler.length >= QUIZ_SINIRI.secenekEnCok) return;
  s.secenekler.push({ metin: '', dogru: false });
  quizYenidenCiz(x.kimlik);
  quizOdakla(x.kimlik, '.qz-soru[data-i="' + x.i + '"] .qz-sik:last-child .qz-sik-metin');
};

EYLEMLER['quiz-sik-sil'] = function (el) {
  var x = quizDz(el);
  if (!x.d) return;
  quizDomdanOku(x.kimlik);
  var s = x.d.quiz.sorular[x.i];
  if (!s) return;
  if (s.secenekler.length <= QUIZ_SINIRI.secenekEnAz) {
    quizBilgi(x.kimlik, 'uyari', 'Çoktan seçmeli soruda en az ' + QUIZ_SINIRI.secenekEnAz + ' şık olmalı.');
    return;
  }
  s.secenekler.splice(x.j, 1);
  quizYenidenCiz(x.kimlik);
};

/* Düzenleyicide tür ve süre türü değişince bölüm yeniden çizilir; seçili
   kutucukların görünümü de güncellenir. */
document.addEventListener('change', function (ev) {
  var t = ev.target;
  if (!t.closest) return;
  var alan = t.closest('.qz-alan');
  if (!alan || t.closest('.qz-onizle')) return;
  var kimlik = alan.getAttribute('data-kimlik'), d = QUIZ_DZ[kimlik];
  if (!d) return;
  if (t.classList.contains('qz-tur') || t.classList.contains('qz-sure-turu')) {
    quizDomdanOku(kimlik);
    var q = d.quiz;
    q.sorular.forEach(function (s) {
      if (s.tur === 'coktan' && s.secenekler.length < QUIZ_SINIRI.secenekEnAz) {
        while (s.secenekler.length < 4) s.secenekler.push({ metin: '', dogru: false });
      }
      if (q.sureTuru === 'soru' && !quizSayi(s.sureSn)) s.sureSn = QUIZ_VARSAYILAN_SURE;
    });
    if (q.sureTuru === 'quiz' && !quizSayi(q.toplamDk)) q.toplamDk = 20;
    quizYenidenCiz(kimlik);
    return;
  }
  if (t.type === 'radio' && t.closest('.qz-dy')) {
    var cipler = t.closest('.qz-dy').querySelectorAll('.qz-cip');
    for (var i = 0; i < cipler.length; i++) cipler[i].classList.toggle('secili', cipler[i].querySelector('input').checked);
  }
  if (t.classList.contains('qz-sik-dogru')) t.closest('.qz-sik').classList.toggle('dogru', t.checked);
});

/* Hatalı soruya yazmaya başlayınca kırmızı kalkar (yapıştırmanın uyarısı da). */
document.addEventListener('input', function (ev) {
  var t = ev.target;
  var li = t.closest && t.closest('.qz-soru.hatali, .qz-ayar.hatali');
  if (!li) return;
  li.classList.remove('hatali');
  var y = li.querySelector('.alan-hata');
  if (y) y.parentNode.removeChild(y);
  var alan = li.closest('.qz-alan'), d = alan && QUIZ_DZ[alan.getAttribute('data-kimlik')];
  var s = d && d.quiz && d.quiz.sorular[parseInt(li.getAttribute('data-i'), 10)];
  if (s) s.uyari = null;
});

/* ---- Metinden ekle: yapıştır, sunucudaki önizlemeye bak, Ekle ---- */
var QUIZ_ORNEK_METIN = '1) 3/4 + 1/4 kaçtır?\n*A) 1\nB) 1/2\nC) 4/8\n2) Güneş bir yıldızdır.\nCevap: Doğru\n3) Kesirleri nerede kullanırsın?';

function quizMetinPaneli(kimlik) {
  var d = QUIZ_DZ[kimlik], k = esc(kimlik);
  return '<div class="qz-metin-panel"><div class="field"><label for="qzYapistir-' + k + '">Soruları buraya yapıştır</label>' +
    '<textarea id="qzYapistir-' + k + '" class="qz-yapistir qz-girdi" rows="8" data-kimlik="' + k + '" spellcheck="false" placeholder="' +
    esc(QUIZ_ORNEK_METIN) + '">' + esc(d.metin.deger || '') + '</textarea></div>' +
    '<details class="qz-bicim"><summary>Yazım biçimi</summary><ul>' +
    '<li>Her soru bir numarayla başlar: <code>1)</code> <code>1.</code> ya da <code>1-</code>. Soru metni sonraki satırlara taşabilir.</li>' +
    '<li>Şıklar <code>A)</code> <code>a)</code> ya da <code>A.</code> ile başlar. Doğru şıkkın başına ya da harfin arkasına yıldız koy: ' +
    '<code>*A) ...</code> ya da <code>A) *...</code>. Birden çok doğru olabilir.</li>' +
    '<li>Doğru/Yanlış sorusunun altına <code>Cevap: Doğru</code> ya da <code>Cevap: Yanlış</code> yaz (D ve Y de olur).</li>' +
    '<li>Şıksız soru açık uçlu olur. Word\'den gelen görünmez karakterler temizlenir.</li></ul></details>' +
    '<div class="qz-metin-sonuc" id="qzMetinSonuc-' + k + '" aria-live="polite">' + quizMetinSonucHtml(d.metin) + '</div>' +
    '<div class="qz-alt"><button type="button" class="btn kucuk" data-act="quiz-metin-ekle" data-kimlik="' + k + '"' +
    (d.metin.sonuc && d.metin.sonuc.sorular.length ? '' : ' disabled') + '>Ekle</button>' +
    '<button type="button" class="btn kucuk gri" data-act="quiz-metin-kapat" data-kimlik="' + k + '">Vazgeç</button></div></div>';
}

/* Önizleme sorununun başındaki "7. satır:" (ileti zaten satırla başlıyorsa yok). */
function quizHataSatirOnEki(x) {
  var m = String(x.mesaj || '');
  if (!x.satir || m.indexOf(x.satir + '. satır') === 0 || m.indexOf('İlk sorudan') === 0) return '';
  return x.satir + '. satır:';
}

function quizMetinSonucHtml(m) {
  if (m.hata) return '<div class="msg hata">' + esc(m.hata) + '</div>';
  if (m.bekliyor && !m.sonuc) return '<div class="hint">Denetleniyor...</div>';
  if (!m.sonuc) return '<div class="hint">Yapıştırınca sorular burada listelenir; hatalı satırlar gösterilir.</div>';
  var r = m.sonuc, h = '<div class="qz-metin-ozet"><b>' + r.sorular.length + ' soru bulundu</b>' +
    (r.hatalar.length ? ' · <span class="qz-hata-sayi">' + r.hatalar.length + ' sorun</span>' : ' · sorun yok') +
    (m.bekliyor ? ' · <span class="hint">denetleniyor...</span>' : '') + '</div>';
  if (r.hatalar.length) {
    h += '<ul class="qz-metin-hatalar">' + r.hatalar.map(function (x) {
      return '<li>' + ik('uyari') + '<span>' + (quizHataSatirOnEki(x) ? '<b>' + quizHataSatirOnEki(x) + '</b> ' : '') + esc(x.mesaj) + '</span></li>';
    }).join('') + '</ul>';
  }
  if (r.sorular.length) {
    h += '<ol class="qz-metin-liste">' + r.sorular.map(function (s) {
      var alt = '';
      if (s.tur === 'coktan') {
        alt = '<ul>' + s.secenekler.map(function (c, j) {
          return '<li class="' + (c.dogru ? 'dogru' : '') + '"><span class="qz-harf">' + (QUIZ_HARF.charAt(j) || '?') + '</span>' +
            (c.metin ? esc(c.metin) : '<i class="qz-bos-yazi">boş şık</i>') + (c.dogru ? ik('onay') : '') + '</li>';
        }).join('') + '</ul>';
      } else if (s.tur === 'dy') {
        alt = '<div class="qz-metin-cevap">Cevap: ' + (s.dogru === true ? 'Doğru' : s.dogru === false ? 'Yanlış' : 'anlaşılamadı') + '</div>';
      }
      return '<li><div><span class="etiket gri">' + QUIZ_TUR_AD[s.tur] + '</span> ' + (s.metin ? esc(s.metin) : '<i class="qz-bos-yazi">soru metni yok</i>') + '</div>' + alt + '</li>';
    }).join('') + '</ol>';
  }
  return h;
}

EYLEMLER['quiz-metin-ac'] = function (el) {
  var x = quizDz(el);
  if (!x.d) return;
  quizDomdanOku(x.kimlik);
  x.d.metin = { deger: '', sonuc: null, bekliyor: false, hata: '', sira: 0 };
  quizYenidenCiz(x.kimlik);
  quizOdakla(x.kimlik, '.qz-yapistir');
};

EYLEMLER['quiz-metin-kapat'] = function (el) {
  var x = quizDz(el);
  if (!x.d) return;
  x.d.metin = null;
  quizYenidenCiz(x.kimlik);
};

function quizMetinDenetle(kimlik) {
  var d = QUIZ_DZ[kimlik];
  if (!d || !d.metin) return;
  var m = d.metin, metin = m.deger || '', sira = ++m.sira;
  var ciz = function () {
    var kap = $('qzMetinSonuc-' + kimlik);
    if (kap) kap.innerHTML = quizMetinSonucHtml(m);
    var b = document.querySelector('#qzAlan-' + kimlik + ' [data-act="quiz-metin-ekle"]');
    if (b) b.disabled = !(m.sonuc && m.sonuc.sorular.length) || !!m.bekliyor;
  };
  if (!metin.trim()) { m.sonuc = null; m.hata = ''; m.bekliyor = false; ciz(); return; }
  m.bekliyor = true; m.hata = '';
  ciz();
  api('/assignments/quiz-metin', 'POST', { metin: metin }).then(function (r) {
    if (d.metin !== m || m.sira !== sira) return;
    m.sonuc = r; m.bekliyor = false;
    ciz();
  })['catch'](function (e) {
    if (d.metin !== m || m.sira !== sira) return;
    m.bekliyor = false; m.sonuc = null; m.hata = e.message;
    ciz();
  });
}

document.addEventListener('input', function (ev) {
  var t = ev.target;
  if (!t.classList || !t.classList.contains('qz-yapistir')) return;
  var kimlik = t.getAttribute('data-kimlik'), d = QUIZ_DZ[kimlik];
  if (!d || !d.metin) return;
  d.metin.deger = t.value;
  clearTimeout(d.metin.zaman);
  d.metin.zaman = setTimeout(function () { quizMetinDenetle(kimlik); }, 700);
});

EYLEMLER['quiz-metin-ekle'] = function (el) {
  var x = quizDz(el);
  if (!x.d || !x.d.metin || !x.d.metin.sonuc) return;
  var q = x.d.quiz, r = x.d.metin.sonuc;
  var gelen = r.sorular.map(function (s) {
    return {
      tur: s.tur, metin: s.metin || '', sureSn: q.sureTuru === 'soru' ? QUIZ_VARSAYILAN_SURE : null,
      dogru: s.tur === 'dy' && typeof s.dogru === 'boolean' ? s.dogru : null,
      secenekler: s.tur === 'coktan' ? s.secenekler.map(function (c) { return { metin: c.metin || '', dogru: !!c.dogru }; }) : []
    };
  });
  /* Hiç dokunulmamış boş ilk soru yapıştırılanlarla değişir. */
  if (q.sorular.length === 1 && !String(q.sorular[0].metin).trim() &&
    !q.sorular[0].secenekler.some(function (c) { return String(c.metin).trim(); })) q.sorular = [];
  var bas = q.sorular.length;
  var yer = QUIZ_SINIRI.soru - bas;
  var alinan = gelen.slice(0, Math.max(0, yer));
  /* Önizlemenin sorunları eklenen sorulara işlenir (kırmızı çerçeve ve ileti);
     "4. soruda" yapıştırılan metindeki sıradır, düzenleyicideki sıraya çevrilir.
     Bir soruya bağlanamayanlar (sorudan önceki satırlar gibi) bilgi kutusunda kalır. */
  var isaretli = 0, kalan = [];
  r.hatalar.forEach(function (h) {
    var s = h.soru >= 1 && h.soru <= alinan.length ? alinan[h.soru - 1] : null;
    /* Alınmayan (100'ü aşan) soruların sorunları gösterilmez. */
    if (!s) { if (!h.soru || h.soru > gelen.length) kalan.push((quizHataSatirOnEki(h) ? quizHataSatirOnEki(h) + ' ' : '') + h.mesaj); return; }
    var m = String(h.mesaj || '');
    if (m.indexOf(h.soru + '. soru') === 0) m = (bas + h.soru) + m.slice(String(h.soru).length);
    if (!s.uyari) { s.uyari = []; isaretli++; }
    s.uyari.push(m);
  });
  q.sorular = q.sorular.concat(alinan);
  x.d.metin = null;
  quizYenidenCiz(x.kimlik);
  var mesaj = alinan.length + ' soru eklendi.';
  if (alinan.length < gelen.length) mesaj += ' Quizde en fazla ' + QUIZ_SINIRI.soru + ' soru olabildiği için ' + (gelen.length - alinan.length) + ' soru alınmadı.';
  if (isaretli) mesaj += ' Sorunlu ' + isaretli + ' soru kırmızıyla işaretlendi; düzelt.';
  quizBilgi(x.kimlik, isaretli || kalan.length || alinan.length < gelen.length ? 'uyari' : 'iyi', mesaj, kalan);
  var ilk = $('qzAlan-' + x.kimlik);
  ilk = ilk && ilk.querySelector('.qz-soru.hatali');
  if (ilk) ilk.scrollIntoView({ block: 'center' });
};

/* ---- Önizle: öğretmen quizi öğrenci gibi görür; hiçbir şey kaydedilmez ---- */
function quizOnizleSorulari(q) {
  return q.sorular.map(function (s, i) {
    var id = 'onz' + i;
    var secenekler = s.tur === 'dy' ? [{ id: id + 'd', metin: 'Doğru' }, { id: id + 'y', metin: 'Yanlış' }]
      : s.tur === 'coktan' ? s.secenekler.map(function (c, j) { return { id: id + '-' + j, metin: String(c.metin || '').trim() }; }) : [];
    return {
      id: id, sira: i + 1, tur: s.tur, metin: String(s.metin || '').trim(), sureSn: quizSayi(s.sureSn),
      coklu: s.tur === 'coktan' && s.secenekler.filter(function (c) { return c.dogru; }).length > 1, secenekler: secenekler
    };
  });
}

function quizOnizleHtml(kimlik) {
  var d = QUIZ_DZ[kimlik], q = d.quiz, o = d.onizle, k = esc(kimlik);
  var sorular = quizOnizleSorulari(q);
  var h = '<div class="qz-onizle" data-kimlik="' + k + '">' +
    '<div class="msg bilgi">' + ik('goz') + 'Önizleme: öğrenci quizi böyle görür. Cevaplar kaydedilmez.</div>';
  if (!sorular.length) {
    h += '<div class="hint">Önizlenecek soru yok.</div>';
  } else {
    if (o.sira >= sorular.length) o.sira = sorular.length - 1;
    var s = sorular[o.sira], soruModu = q.sureTuru === 'soru';
    var sure = soruModu ? (s.sureSn ? quizSureMetni(s.sureSn) : '—') : q.sureTuru === 'quiz' ? quizSureMetni((quizSayi(q.toplamDk) || 0) * 60) : 'Süresiz';
    h += '<div class="qz-ust onizleme"><div class="qz-ust-bilgi"><div class="qz-ust-sira">Soru ' + (o.sira + 1) + '/' + sorular.length + '</div></div>' +
      '<div class="qz-kalan">' + ik('saat') + '<span><b>' + esc(sure) + '</b><small>' + (soruModu ? 'bu soru için' : q.sureTuru === 'quiz' ? 'bütün quiz' : '') + '</small></span></div></div>' +
      '<div class="kart qz-soru-kart" data-soru="' + s.id + '"><div class="qz-soru-bas"><span class="qz-no">' + (o.sira + 1) + '</span>' +
      '<span class="qz-tur-ad">' + QUIZ_TUR_AD[s.tur] + '</span></div>' +
      quizSoruHtml(s, o.secim[s.id], { ad: 'qzOnz-' + k + '-' + o.sira }) + '</div>' +
      '<div class="qz-alt-dugmeler">';
    if (soruModu) {
      h += '<span class="hint">Öğrenci bir sonraki soruya geçince bu soruya dönemez.</span>' +
        (o.sira < sorular.length - 1 ? '<button type="button" class="btn kucuk" data-act="quiz-onizle-git" data-kimlik="' + k + '" data-i="' + (o.sira + 1) + '">Sonraki soru</button>'
          : '<button type="button" class="btn kucuk gri" data-act="quiz-onizle-git" data-kimlik="' + k + '" data-i="0">Başa dön</button>');
    } else {
      h += '<button type="button" class="btn kucuk gri" data-act="quiz-onizle-git" data-kimlik="' + k + '" data-i="' + (o.sira - 1) + '"' + (o.sira ? '' : ' disabled') + '>Önceki</button>' +
        '<button type="button" class="btn kucuk gri" data-act="quiz-onizle-git" data-kimlik="' + k + '" data-i="' + (o.sira + 1) + '"' + (o.sira < sorular.length - 1 ? '' : ' disabled') + '>Sonraki</button>';
    }
    h += '</div>';
  }
  if (!d.yalnizOnizle) h += '<div class="qz-alt"><button type="button" class="btn kucuk gri" data-act="quiz-onizle-kapat" data-kimlik="' + k + '">Önizlemeden çık</button></div>';
  return h + '</div>';
}

EYLEMLER['quiz-onizle'] = function (el) {
  var x = quizDz(el);
  if (!x.d || !x.d.quiz) return;
  quizDomdanOku(x.kimlik);
  x.d.onizle = { sira: 0, secim: {} };
  quizYenidenCiz(x.kimlik);
  var kok = $('qzAlan-' + x.kimlik);
  if (kok) kok.scrollIntoView({ block: 'start' });
};

EYLEMLER['quiz-onizle-kapat'] = function (el) {
  var x = quizDz(el);
  if (!x.d) return;
  x.d.onizle = null;
  quizYenidenCiz(x.kimlik);
};

EYLEMLER['quiz-onizle-git'] = function (el) {
  var x = quizDz(el);
  if (!x.d || !x.d.onizle || isNaN(x.i) || x.i < 0 || x.i >= x.d.quiz.sorular.length) return;
  x.d.onizle.sira = x.i;
  quizYenidenCiz(x.kimlik);
};

/* Kontrol ekranından önizleme (pencere bu sırada kapalı; ayrı pencerede açılır). */
EYLEMLER['quiz-onizle-ac'] = function () {
  var q = S._acikOdevQuiz;
  if (!q) return;
  QUIZ_DZ.onizle = { acik: true, quiz: quizDuzenleyiciye(q), kilitli: false, metin: null, onizle: { sira: 0, secim: {} }, yalnizOnizle: true };
  modalAc('Önizleme: ' + (S._acikOdev ? S._acikOdev.title : 'Quiz'),
    '<div class="qz-alan" id="qzAlan-onizle" data-kimlik="onizle">' + quizAlaniIc('onizle') + '</div>');
  quizPencereAyari();
};

/* Kontrol ekranından "Quizi düzenle": Ödevi düzenle penceresi quiz bölümüyle açılır. */
EYLEMLER['quiz-duzenle'] = function () {
  EYLEMLER['odev-duzelt']();
  var kok = $('qzAlan-duzelt');
  if (kok) kok.scrollIntoView({ block: 'start' });
};

/* ================= öğretmen: sonuçlar ================= */
EYLEMLER['quiz-sonuc-ac'] = function (el, id) {
  var q = S._acikOdevQuiz || {};
  var cozen = Math.max(0, (q.baslayan || 0) - (q.biten || 0));
  if (!confirm('Quiz sonuçları öğrencilere şimdi açılsın mı?\n\nBitiren öğrenciler puanlarını ve doğru cevapları görür; ' +
    'kendilerine ve velilerine bildirim gider. Henüz başlamamış öğrenciler artık quizi başlatamaz.' +
    (cozen ? ' Çözmekte olan ' + cozen + ' öğrencinin quizi şimdi biter.' : ''))) return;
  dugmeBekle(el, 'Açılıyor...');
  return api('/assignments/' + encodeURIComponent(id) + '/quiz/sonuc-ac', 'POST', {}).then(function (r) {
    return odevAc(id).then(function () {
      sayfaMesaji('iyi', 'Quiz sonuçları öğrencilere açıldı' + (r.biten ? '; çözmekte olan ' + r.biten + ' öğrencinin quizi bitti' : '') +
        (r.bildirilen ? '; ' + r.bildirilen + ' öğrenciye bildirim gitti.' : '.'));
    });
  })['catch'](function (e) { dugmeBitir(el); hataGoster(e); });
};

/* Sonuçlandırılmış quizli ödevi "Tekrar aç" demeden önce öğretmene sorulacak
   uyarı (yoksa ''). Bitiren varken sonuçlandırma doğru cevapları açar ve bu
   açılış kalıcıdır: quizi çözmemiş öğrenci cevapları arkadaşından öğrenmiş
   olabileceği için quiz bir daha başlatılamaz, yalnızca ödev yeniden açılır. */
function quizTekrarAcUyarisi(id) {
  var a = S._acikOdev, q = S._acikOdevQuiz;
  if (!a || a.id !== id || !q || !q.sonucAcildi) return '';
  var cozmeyen = (a.studentIds || []).length - (q.baslayan || 0);
  if (cozmeyen <= 0) return '';
  return 'Quizin doğru cevapları açıklandığı için quizi çözmemiş ' + cozmeyen + ' öğrenci quizi başlatamaz; yalnızca ödev yeniden açılır.';
}

EYLEMLER['quiz-ayrinti'] = function (el, odevId) {
  var ogrenci = el.getAttribute('data-ogrenci');
  el.disabled = true;
  return api('/assignments/' + encodeURIComponent(odevId) + '/quiz/ayrinti?ogrenci=' + encodeURIComponent(ogrenci)).then(function (d) {
    el.disabled = false;
    modalAc(d.ogrenci.fullName + ' — quiz', quizAyrintiHtml(d));
    quizPencereAyari();
  })['catch'](function (e) { el.disabled = false; hataGoster(e); });
};

function quizAyrintiHtml(d) {
  var dn = d.deneme, h = '<div class="qz-ayrinti">';
  if (d.durum === 'baslamadi') return h + '<div class="msg bilgi">Öğrenci quizi henüz başlatmadı.</div></div>';
  if (d.sonuc) {
    h += '<div class="qz-puan"><b>' + esc(d.sonuc.puanliSayisi ? d.sonuc.dogruSayisi + '/' + d.sonuc.puanliSayisi + ' (%' + d.sonuc.yuzde + ')' : 'Puanlı soru yok') + '</b>' +
      (d.sonuc.acikUcluSayisi ? '<span>' + d.sonuc.acikUcluSayisi + ' açık uçlu soru puanlanmaz</span>' : '') + '</div>';
  } else {
    h += '<div class="msg uyari">Öğrenci quizi çözüyor; cevaplar değişebilir.</div>';
  }
  h += '<dl class="qz-bilgiler">' +
    '<dt>Başladı</dt><dd>' + tarihSaat(dn.baslama) + '</dd>' +
    (dn.bitis ? '<dt>Bitti</dt><dd>' + tarihSaat(dn.bitis) + ' · ' + esc(quizBitisNedeni(dn.bitisNedeni, true)) + '</dd>' : '') +
    '<dt>Sekme / uygulama</dt><dd class="' + (dn.cikisSayisi ? 'qz-cikti' : '') + '">' +
    (dn.cikisSayisi ? dn.cikisSayisi + ' kez çıktı, toplam ' + quizSureMetni(dn.cikisSn) : 'Hiç çıkmadı') + '</dd></dl>' +
    '<div class="hint">Puan yalnız öneridir; ödevin sonucunu sen seçersin. Sekme kaydı öğrencinin tarayıcısından gelir: ' +
    'caydırıcıdır, kesin kanıt değildir (ikinci pencere ya da başka cihaz görünmez).</div>';
  return h + quizSonucListesi(d.sorular, true, d.durum === 'devam') + '</div>';
}

/* ================= öğrenci: ödev penceresi ================= */
/* 14b'deki sarmalayıcıdan sonra: öğrencinin kendisiyse quiz satırı güncel
   durumla yenilenir (başlatılabilir mi, neden başlatılamaz). */
var quizOdevOkuOnceki = EYLEMLER['odev-oku'];
EYLEMLER['odev-oku'] = function (el, id) {
  quizOdevOkuOnceki(el, id);
  var a = (S.odevHam || []).filter(function (x) { return x.id === id; })[0];
  if (!a || !a.quiz || S.user.role !== 'student' || S.viewStudentId) return;
  api('/assignments/' + encodeURIComponent(id) + '/quiz').then(function (d) {
    a.quiz.durum = d.durum; a.quiz.sonucAcik = d.sonucAcik; a.quiz.sonuc = d.sonuc;
    var satir = $('qzOdevSatir');
    if (satir) satir.outerHTML = quizOdevSatiri(a, d);
  })['catch'](function (e) {
    var satir = $('qzOdevSatir');
    var y = satir && satir.querySelector('small');
    if (y) y.textContent = e.message;
  });
};

EYLEMLER['quiz-ac'] = function (el, id) {
  var a = (S.odevHam || []).filter(function (x) { return x.id === id; })[0];
  quizOdevHatirla(id, a);
  modalKapat();
  return git('quiz');
};

function quizOdevHatirla(id, a) {
  S.quizOdevId = id;
  quizOturumYaz('quiz_odev', id);
  if (a) {
    var b = { id: id, title: a.title, subject: a.subject, teacherName: a.teacherName, endAt: a.endAt || null, endTime: a.endTime || null };
    S.quizOdev = b;
    quizOturumYaz('quiz_odev_bilgi', JSON.stringify(b));
  }
}

function quizOdevBilgisi(id) {
  var a = (S.odevHam || []).filter(function (x) { return x.id === id; })[0];
  if (a) return a;
  if (S.quizOdev && S.quizOdev.id === id) return S.quizOdev;
  try {
    var o = JSON.parse(quizOturumOku('quiz_odev_bilgi') || 'null');
    if (o && o.id === id) return o;
  } catch (e) { /* bozuk kayıt */ }
  return { id: id, title: 'Quiz', subject: '' };
}

/* Veli ödev listesinde satıra tıklayınca açılan pencerede quiz durumu. */
var quizVeliTeslimOnceki = EYLEMLER['veli-teslim'];
EYLEMLER['veli-teslim'] = function (el, odevId) {
  var r = quizVeliTeslimOnceki(el, odevId);
  var ogrenci = el.getAttribute('data-ogrenci');
  var a = (S.veliOdevHam || []).filter(function (x) { return x.id === odevId && x.cocuk && x.cocuk.id === ogrenci; })[0];
  var govde = $('modalGovde');
  if (a && a.quiz && govde) {
    govde.insertAdjacentHTML('afterbegin', '<div class="ekler-kutu qz-veli-kutu"><ul class="ek-liste">' + quizOdevSatiri(a, null) + '</ul></div>');
  }
  return r;
};

/* ================= öğrenci: çözme sayfası ================= */
/* cikis: sekmeden/uygulamadan ya da quiz sayfasından çıkış anı; cikisIc: çıkış
   uygulama içinde (menüyle başka sayfaya) oldu, quiz sayfasına dönünce
   bildirilir; ekranda: öğrenci çözme ekranındaydı. */
var QZ = {
  odevId: '', veri: null, sira: 0, fark: 0, zamanlayici: null, kuyruk: Promise.resolve(),
  bekleyen: {}, kayit: {}, yaziZamani: null, cikis: 0, cikisSoru: '', mesaj: null,
  cikisIc: false, cikisOdev: '', cikisKisi: '', ekranda: false,
  sonrakiIstenen: '', sonrakiBekle: 0, tazeleZamani: null, ilkAcilis: true
};

function quizGeriDugmesi() {
  return '<div class="qz-geri"><button type="button" class="btn gri" data-nav="odevler">' + ik('geri') + 'Ödevlere dön</button></div>';
}

SAYFALAR.quiz = function () {
  if (S.user.role !== 'student' || S.viewStudentId) {
    yaz(hero('QUIZ', '') + bosKutu('soru', 'Quizi yalnız öğrencinin kendisi çözer.') + quizGeriDugmesi());
    return Promise.resolve();
  }
  var id = S.quizOdevId || quizOturumOku('quiz_odev');
  if (!id) {
    /* Sekme kapanıp adres yeniden açıldıysa: süren quiz varsa ona dönülür. */
    return api('/progress').then(function (p) {
      var a = (p.assignments || []).filter(function (x) { return x.quiz && x.quiz.durum === 'devam'; })[0];
      if (!a) {
        yaz(hero('QUIZ', '') + bosKutu('soru', 'Açık bir quiz yok. Ödevler sayfasında quizli ödevi açıp "Quizi başlat"a bas.') + quizGeriDugmesi());
        return;
      }
      quizOdevHatirla(a.id, a);
      return SAYFALAR.quiz();
    });
  }
  if (QZ.odevId !== id) { QZ.sira = 0; QZ.mesaj = null; QZ.bekleyen = {}; QZ.kayit = {}; QZ.ilkAcilis = true; }
  S.quizOdevId = id;
  /* Ödevin adı bu sekmede bilinmiyorsa (adres doğrudan açıldı) ödev listesinden alınır. */
  var bilgi = quizOdevBilgisi(id).subject ? Promise.resolve() : api('/progress').then(function (p) {
    var a = (p.assignments || []).filter(function (x) { return x.id === id; })[0];
    if (a) quizOdevHatirla(id, a);
  })['catch'](function () { /* ad gelmezse "Quiz" yazar */ });
  return Promise.all([api('/assignments/' + encodeURIComponent(id) + '/quiz'), bilgi]).then(function (r) {
    quizVeriAl(id, r[0]);
    quizSayfaCiz();
    quizSayfayaDondu();
  })['catch'](function (e) {
    if (e.durum === 404 || e.durum === 403) {
      yaz(hero('QUIZ', '') + bosKutu('soru', e.message) + quizGeriDugmesi());
      return;
    }
    throw e;
  });
};

function quizVeriAl(id, d) {
  QZ.odevId = id;
  QZ.veri = d;
  var s = Date.parse(d.simdi);
  QZ.fark = isNaN(s) ? 0 : s - Date.now();
  if (d.quiz.sureTuru === 'soru') QZ.sira = 0;
  else if (QZ.ilkAcilis && d.durum === 'devam') {
    /* Sayfa yenilenince kalınan sorudan sürer (sekmenin belleğinde); ilk
       açılışta ya da bellek yoksa ilk boş sorudan. */
    var kalinan = parseInt(quizOturumOku('quiz_sira_' + id), 10);
    if (!isNaN(kalinan) && kalinan >= 0 && kalinan < d.sorular.length) QZ.sira = kalinan;
    else {
      QZ.sira = 0;
      for (var i = 0; i < d.sorular.length; i++) {
        if (!quizCevapliMi(d.sorular[i]) && !d.sorular[i].kapandi) { QZ.sira = i; break; }
      }
    }
  }
  if (d.durum === 'devam') QZ.ilkAcilis = false;
  if (QZ.sira >= d.sorular.length) QZ.sira = Math.max(0, d.sorular.length - 1);
  /* Kaydedilmeyi bekleyen yazı sunucudan gelenin üstüne yazılır. */
  for (var j = 0; j < d.sorular.length; j++) {
    var soru = d.sorular[j];
    if (QZ.bekleyen[soru.id] !== undefined) {
      if (soru.kapandi || d.durum !== 'devam') delete QZ.bekleyen[soru.id];
      else soru._yerel = QZ.bekleyen[soru.id];
    }
  }
  if (d.durum !== 'devam') { QZ.bekleyen = {}; S._sayfaDegisti = false; }
}

function quizSoruBul(id) {
  var l = (QZ.veri && QZ.veri.sorular) || [];
  for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
  return null;
}

function quizSimdikiCevap(s) {
  return {
    secilenler: s.cevap ? s.cevap.secilenler || [] : [],
    metin: s._yerel !== undefined ? s._yerel : (s.cevap ? s.cevap.metin || '' : '')
  };
}

function quizCevapliMi(s) {
  if (s.tur === 'acik') return !!String(quizSimdikiCevap(s).metin || '').trim();
  return !!(s.cevap && s.cevap.secilenler && s.cevap.secilenler.length);
}

function quizCozuluyor() {
  return S.page === 'quiz' && !!QZ.veri && QZ.veri.durum === 'devam' && !!$('quizKok');
}

function quizSimdikiSoru() {
  var d = QZ.veri;
  if (!d || !d.sorular.length) return null;
  return d.quiz.sureTuru === 'soru' ? d.sorular[0] : d.sorular[QZ.sira];
}

function quizSayfaCiz() {
  yaz('<div id="quizKok" class="qz-sayfa">' + quizKokIc() + '</div>');
  if (!QZ.zamanlayici) QZ.zamanlayici = setInterval(quizTik, 500);
  quizTik();
}

function quizKokYenile() {
  var k = $('quizKok');
  if (!k) { if (S.page === 'quiz') quizSayfaCiz(); return; }
  k.innerHTML = quizKokIc();
  quizTik();
}

function quizKokIc() {
  var d = QZ.veri, a = quizOdevBilgisi(QZ.odevId);
  if (d.durum === 'baslamadi') return quizGirisHtml(d, a);
  if (d.durum === 'devam') return quizCozmeHtml(d, a);
  return quizBittiHtml(d, a);
}

function quizBaslikHtml(a) {
  return '<div class="qz-sayfa-bas"><span class="etiket qz-etiket">' + ik('soru') + 'Quiz</span>' +
    '<h1 class="qz-sayfa-ad">' + esc(a.title) + '</h1>' +
    (a.subject ? '<div class="qz-sayfa-alt">' + esc(a.subject) + (a.teacherName ? ' · ' + esc(a.teacherName) : '') + '</div>' : '') + '</div>';
}

/* Başlamadan önce kurallar ve "Şimdi başla". */
function quizGirisHtml(d, a) {
  var q = d.quiz, k = [];
  k.push(['soru', q.soruSayisi + ' soru' + (q.acikUcluSayisi ? '; ' + q.acikUcluSayisi + ' tanesi açık uçlu (açık uçlu sorular puanlanmaz, öğretmenin okur).' : '.')]);
  if (q.sureTuru === 'quiz') k.push(['saat', 'Bütün quiz için ' + quizSureMetni(q.toplamSn) + ' süren var. Başlayınca süre işler, durdurulamaz; süre bitince quiz kendiliğinden biter.']);
  else if (q.sureTuru === 'soru') k.push(['saat', 'Her sorunun kendi süresi var (toplam ' + quizSureMetni(q.soruSureToplami) + '). Sorular sırayla gelir; sonraki soruya geçince öncekine dönülmez. Bağlantın kopsa da süre işler.']);
  else k.push(['saat', 'Süre sınırı yok; sorular arasında serbestçe gezebilirsin.' +
    (d.sonTeslim ? ' Başladıysan quiz en geç son teslimden 10 dakika sonra kendiliğinden biter.' : '')]);
  k.push(['kilit', 'Tek hakkın var: quiz ikinci kez çözülemez.']);
  k.push(['goz', 'Quiz sırasında başka sekmeye, uygulamaya ya da sitenin başka bir sayfasına geçersen kaydedilir ve öğretmenin görür.' +
    (q.cikincaKapanir ? ' Çıkarken açık olan soru kapanır; bir daha cevaplanamaz.' : '')]);
  k.push(['onay', 'Her cevap anında kaydedilir. Sayfa kapanırsa yeniden açıp kaldığın yerden sürdürürsün.']);
  k.push(['grafik', q.sonucGorunum === 'hemen' ? 'Puanını ve doğru cevapları bitirince görürsün.'
    : d.sonucAcilis ? 'Puanın ve doğru cevaplar son teslimden 10 dakika sonra açılır (' + quizTarihSaat(d.sonucAcilis) + ').'
      : 'Puanın ve doğru cevaplar öğretmenin sonuçları açınca görünür.']);
  var h = '<div class="kart qz-giris">' + quizBaslikHtml(a) + '<ul class="qz-kurallar">';
  for (var i = 0; i < k.length; i++) h += '<li>' + ik(k[i][0]) + '<span>' + esc(k[i][1]) + '</span></li>';
  h += '</ul>' + (QZ.mesaj ? '<div class="msg ' + QZ.mesaj.tur + '">' + esc(QZ.mesaj.metin) + '</div>' : '') + '<div class="qz-alt-dugmeler">';
  if (d.baslatabilir) h += '<button type="button" class="btn" data-act="quiz-basla">Şimdi başla</button>';
  else h += '<div class="msg uyari qz-engel">' + esc(d.engel || 'Quiz şu an başlatılamaz.') + '</div>';
  return h + '<button type="button" class="btn gri" data-nav="odevler">Ödevlere dön</button></div></div>';
}

function quizCozmeHtml(d, a) {
  var q = d.quiz, soruModu = q.sureTuru === 'soru';
  var s = quizSimdikiSoru();
  var no = soruModu ? d.deneme.soruSira : QZ.sira + 1;
  var h = '<div class="qz-ust"><div class="qz-ust-bilgi"><div class="qz-ust-ad">' + esc(a.title) + '</div>' +
    '<div class="qz-ust-sira">Soru ' + no + '/' + q.soruSayisi + '</div></div>' +
    '<div class="qz-kalan" id="qzKalanKutu">' + ik('saat') + '<span><b id="qzKalan" role="timer">--:--</b><small id="qzKalanAlt"></small></span></div>' +
    (soruModu ? '<div class="qz-cubuk" aria-hidden="true"><i id="qzCubuk"></i></div>' : '') + '</div>' +
    '<div id="qzUyari">' + (QZ.mesaj ? '<div class="msg ' + QZ.mesaj.tur + '" role="status">' + esc(QZ.mesaj.metin) + '</div>' : '') + '</div>';
  if (!s) return h + '<div class="kart">Soru yükleniyor...</div>';
  var kapali = !!s.kapandi;
  h += '<div class="kart qz-soru-kart' + (kapali ? ' kapali' : '') + '" data-soru="' + esc(s.id) + '">' +
    '<div class="qz-soru-bas"><span class="qz-no">' + no + '</span><span class="qz-tur-ad">' + QUIZ_TUR_AD[s.tur] + '</span>' +
    (kapali ? '<span class="etiket kirmizi">' + ik('kilit') + (s.kapandi === 'cikis' ? 'Quizden çıktığın için kapandı' : 'Süresi doldu') + '</span>' : '') + '</div>' +
    quizSoruHtml(s, quizSimdikiCevap(s), { ad: 'qzCevap-' + s.id, kapali: kapali }) +
    '<div class="qz-kayit" id="qzKayit" aria-live="polite">' + quizKayitHtml(s) + '</div></div>';
  if (!soruModu) h += '<nav class="qz-noktalar" id="qzNoktalar" aria-label="Sorular">' + quizNoktalarIc() + '</nav>';
  h += '<div class="qz-alt-dugmeler">';
  if (soruModu) {
    var son = d.deneme.soruSira >= q.soruSayisi;
    h += '<span class="hint">' + (son ? 'Son soru.' : 'Sonraki soruya geçince bu soruya dönülmez.') + '</span>' +
      '<button type="button" class="btn" data-act="quiz-sonraki" data-id="' + esc(s.id) + '">' + (son ? 'Bitir' : 'Sonraki soru') + '</button>';
  } else {
    h += '<button type="button" class="btn gri" data-act="quiz-git" data-sira="' + (QZ.sira - 1) + '"' + (QZ.sira ? '' : ' disabled') + '>Önceki</button>' +
      '<button type="button" class="btn gri" data-act="quiz-git" data-sira="' + (QZ.sira + 1) + '"' + (QZ.sira < d.sorular.length - 1 ? '' : ' disabled') + '>Sonraki</button>' +
      '<span class="qz-bosluk"></span><button type="button" class="btn" data-act="quiz-bitir">Bitir</button>';
  }
  return h + '</div>';
}

function quizNoktalarIc() {
  var d = QZ.veri, h = '';
  for (var i = 0; i < d.sorular.length; i++) {
    var s = d.sorular[i], c = [], cevapli = quizCevapliMi(s);
    if (i === QZ.sira) c.push('simdiki');
    if (cevapli) c.push('cevapli');
    if (s.kapandi) c.push('kapali');
    h += '<button type="button" class="qz-nokta ' + c.join(' ') + '" data-act="quiz-git" data-sira="' + i + '" aria-label="' + (i + 1) + '. soru' +
      (s.kapandi ? ', kapandı' : cevapli ? ', cevaplandı' : ', boş') + '"' + (i === QZ.sira ? ' aria-current="step"' : '') + '>' + (i + 1) + '</button>';
  }
  return h;
}

function quizNoktalariYenile() {
  var n = $('qzNoktalar');
  if (n && QZ.veri) n.innerHTML = quizNoktalarIc();
}

function quizKayitHtml(s) {
  var k = QZ.kayit[s.id];
  if (k && k.tur === 'kaydediliyor') return '<span class="qz-kayit-bekle">Kaydediliyor...</span>';
  if (k && k.tur === 'bekliyor') return '<span class="qz-kayit-bekle">Yazdıkların birazdan kaydedilecek</span>';
  if (k && k.tur === 'hata') {
    return '<span class="qz-kayit-hata">' + ik('uyari') + 'Kaydedilemedi: ' + esc(k.metin) + '</span> ' +
      '<button type="button" class="baglanti" data-act="quiz-kaydet-tekrar" data-id="' + esc(s.id) + '">Tekrar dene</button>';
  }
  var kayit = (k && k.tur === 'tamam' && k.metin) || (s.cevap && s.cevap.kayit);
  return kayit ? '<span class="qz-kayit-tamam">' + ik('onay') + 'Kaydedildi · ' + quizSaat(kayit) + '</span>' : '';
}

function quizKayitGoster(soruId, tur, metin) {
  QZ.kayit[soruId] = { tur: tur, metin: metin || '' };
  var kart = document.querySelector('#quizKok .qz-soru-kart');
  var s = quizSoruBul(soruId);
  if (kart && s && kart.getAttribute('data-soru') === soruId && $('qzKayit')) $('qzKayit').innerHTML = quizKayitHtml(s);
}

function quizUyari(tur, metin) {
  QZ.mesaj = metin ? { tur: tur, metin: metin } : null;
  var u = $('qzUyari');
  if (u) u.innerHTML = metin ? '<div class="msg ' + tur + '" role="status">' + esc(metin) + '</div>' : '';
}

function quizYol(ek) { return '/assignments/' + encodeURIComponent(QZ.odevId) + '/quiz' + (ek || ''); }

/* Bir sorunun cevabını sıraya koyup gönderir (sıra: cevaplar, sonraki, bitir). */
function quizCevapGonder(s) {
  var govde = { soruId: s.id };
  if (s.tur === 'acik') govde.metin = quizSimdikiCevap(s).metin;
  else govde.secilenler = (s.cevap && s.cevap.secilenler ? s.cevap.secilenler : []).slice();
  var odevId = QZ.odevId, yol = quizYol('/cevap');
  quizKayitGoster(s.id, 'kaydediliyor');
  QZ.kuyruk = QZ.kuyruk.then(function () {
    return api(yol, 'POST', govde).then(function (r) {
      if (QZ.odevId !== odevId) return;
      var t = quizSoruBul(s.id);
      if (t) {
        t.cevap = { secilenler: govde.secilenler || (t.cevap && t.cevap.secilenler) || [], metin: govde.metin !== undefined ? govde.metin : '', kayit: r.kaydedildi };
        if (t.tur === 'acik' && QZ.bekleyen[s.id] === govde.metin) { delete QZ.bekleyen[s.id]; delete t._yerel; }
      }
      if (QZ.bekleyen[s.id] === undefined) quizKayitGoster(s.id, 'tamam', r.kaydedildi);
      if (!Object.keys(QZ.bekleyen).length) S._sayfaDegisti = false;
      quizNoktalariYenile();
    }, function (e) {
      if (QZ.odevId !== odevId) return;
      if (e.durum === 409 && e.veri && e.veri.durum) {
        delete QZ.bekleyen[s.id];
        quizVeriAl(odevId, e.veri.durum);
        QZ.mesaj = { tur: 'uyari', metin: e.message };
        quizKokYenile();
        return;
      }
      quizKayitGoster(s.id, 'hata', e.message);
    });
  });
  return QZ.kuyruk;
}

/* Yazılıp henüz gönderilmemiş açık uçlu cevapları hemen gönderir. */
function quizBekleyenleriGonder() {
  clearTimeout(QZ.yaziZamani);
  QZ.yaziZamani = null;
  Object.keys(QZ.bekleyen).forEach(function (id) {
    var s = quizSoruBul(id);
    if (!s || s.kapandi) { delete QZ.bekleyen[id]; return; }
    if (QZ.kayit[id] && QZ.kayit[id].tur === 'kaydediliyor' && QZ.kayit[id].metin === QZ.bekleyen[id]) return;
    quizCevapGonder(s);
    QZ.kayit[id].metin = QZ.bekleyen[id];
  });
  return QZ.kuyruk;
}

EYLEMLER['quiz-kaydet-tekrar'] = function (el, id) {
  var s = quizSoruBul(id);
  if (s && !s.kapandi) quizCevapGonder(s);
};

/* Şık seçimi: anında kaydedilir. Önizlemede yalnız ekranda kalır. */
document.addEventListener('change', function (ev) {
  var t = ev.target;
  if (!t.classList || !t.classList.contains('qz-sec')) return;
  var kart = t.closest('[data-soru]');
  if (!kart) return;
  var kutular = kart.querySelectorAll('.qz-sec'), secilenler = [];
  for (var i = 0; i < kutular.length; i++) {
    if (kutular[i].checked) secilenler.push(kutular[i].value);
    var lb = kutular[i].closest('.qz-secenek');
    if (lb) lb.classList.toggle('secili', kutular[i].checked);
  }
  var onz = t.closest('.qz-onizle');
  if (onz) {
    var d = QUIZ_DZ[onz.getAttribute('data-kimlik')];
    if (d && d.onizle) d.onizle.secim[kart.getAttribute('data-soru')] = { secilenler: secilenler, metin: '' };
    return;
  }
  if (!t.closest('#quizKok') || !quizCozuluyor()) return;
  var s = quizSoruBul(kart.getAttribute('data-soru'));
  if (!s || s.kapandi) return;
  s.cevap = s.cevap || { secilenler: [], metin: '', kayit: null };
  s.cevap.secilenler = secilenler;
  quizCevapGonder(s);
  quizNoktalariYenile();
});

/* Açık uçlu cevap: yazmayı bırakınca (1,2 sn) ya da kutudan çıkınca kaydedilir. */
document.addEventListener('input', function (ev) {
  var t = ev.target;
  if (!t.classList || !t.classList.contains('qz-cevap-metin')) return;
  var kart = t.closest('[data-soru]');
  var sayi = kart && kart.querySelector('.qz-karakter-sayi');
  if (sayi) sayi.textContent = t.value.length;
  var onz = t.closest('.qz-onizle');
  if (onz) {
    var d = QUIZ_DZ[onz.getAttribute('data-kimlik')];
    if (d && d.onizle) d.onizle.secim[kart.getAttribute('data-soru')] = { secilenler: [], metin: t.value };
    return;
  }
  if (!t.closest('#quizKok') || !quizCozuluyor()) return;
  var s = quizSoruBul(kart.getAttribute('data-soru'));
  if (!s || s.kapandi) return;
  s._yerel = t.value;
  QZ.bekleyen[s.id] = t.value;
  quizKayitGoster(s.id, 'bekliyor');
  clearTimeout(QZ.yaziZamani);
  QZ.yaziZamani = setTimeout(quizBekleyenleriGonder, 1200);
});

document.addEventListener('focusout', function (ev) {
  var t = ev.target;
  if (t.classList && t.classList.contains('qz-cevap-metin') && t.closest('#quizKok') && Object.keys(QZ.bekleyen).length) quizBekleyenleriGonder();
});

/* Sayfadan menüyle ya da geri tuşuyla çıkılırsa yazılan cevap da gider; quiz
   sürüyorsa bu da bir çıkıştır (sayfa değişimi bu olaydan sonra da olabilir). */
window.addEventListener('hashchange', function () {
  if (Object.keys(QZ.bekleyen).length) quizBekleyenleriGonder();
  setTimeout(function () { if (S.page !== 'quiz') quizSayfadanCikti(); }, 0);
});

/* Kaydedilmemiş yazı varken sekme kapanmasın. */
window.addEventListener('beforeunload', function (e) {
  if (S.page === 'quiz' && Object.keys(QZ.bekleyen).length) { quizBekleyenleriGonder(); e.preventDefault(); e.returnValue = ''; }
});

EYLEMLER['quiz-basla'] = function (el) {
  if (!QZ.odevId) return;
  dugmeBekle(el, 'Başlatılıyor...');
  var odevId = QZ.odevId;
  return api(quizYol('/basla'), 'POST', {}).then(function (d) {
    QZ.sira = 0; QZ.mesaj = null; QZ.ilkAcilis = true;
    quizOturumYaz('quiz_sira_' + odevId, '');
    quizVeriAl(odevId, d);
    quizSayfaCiz();
    window.scrollTo(0, 0);
  })['catch'](function (e) {
    dugmeBitir(el);
    QZ.mesaj = { tur: 'hata', metin: e.message };
    if (e.veri && e.veri.baslatilamaz) return api(quizYol()).then(function (d) { quizVeriAl(odevId, d); quizKokYenile(); });
    quizKokYenile();
  })['catch'](hataGoster);
};

EYLEMLER['quiz-git'] = function (el) {
  var n = parseInt(el.getAttribute('data-sira'), 10);
  if (!QZ.veri || isNaN(n) || n < 0 || n >= QZ.veri.sorular.length || QZ.veri.quiz.sureTuru === 'soru') return;
  quizBekleyenleriGonder();
  QZ.sira = n;
  quizOturumYaz('quiz_sira_' + QZ.odevId, String(n));
  QZ.mesaj = null;
  quizKokYenile();
  var k = $('quizKok');
  if (k && k.getBoundingClientRect().top < 0) k.scrollIntoView({ block: 'start' });
};

/* Soru başına süre: sonraki soru (son soruda Bitir). Süre dolunca da çağrılır. */
function quizSonrakiIste(soruId, mesaj) {
  if (QZ.sonrakiIstenen === soruId) return QZ.kuyruk;
  QZ.sonrakiIstenen = soruId;
  quizBekleyenleriGonder();
  var odevId = QZ.odevId, yol = quizYol('/sonraki');
  QZ.kuyruk = QZ.kuyruk.then(function () {
    return api(yol, 'POST', { soruId: soruId }).then(function (d) {
      QZ.sonrakiIstenen = '';
      if (QZ.odevId !== odevId) return;
      quizVeriAl(odevId, d);
      QZ.mesaj = mesaj && d.durum === 'devam' ? { tur: 'uyari', metin: mesaj } : null;
      if (S.page !== 'quiz') return;
      quizKokYenile();
      window.scrollTo(0, 0);
    }, function (e) {
      QZ.sonrakiIstenen = '';
      QZ.sonrakiBekle = Date.now() + 5000;   // bağlantı yoksa her yarım saniyede bir denenmesin
      if (QZ.odevId !== odevId) return;
      quizKokYenile();
      quizUyari('hata', e.message);
    });
  });
  return QZ.kuyruk;
}

EYLEMLER['quiz-sonraki'] = function (el, soruId) {
  var d = QZ.veri, s = quizSoruBul(soruId);
  if (!d || !s || d.durum !== 'devam') return;
  var son = d.deneme.soruSira >= d.quiz.soruSayisi;
  if (son) {
    if (!confirm('Quiz bitirilsin mi? Bitirince cevapların değiştirilemez.')) return;
  } else if (!s.kapandi && !quizCevapliMi(s) && !confirm('Bu soruyu boş geçiyorsun; geri dönemezsin. Sonraki soruya geçilsin mi?')) {
    return;
  }
  dugmeBekle(el, son ? 'Bitiriliyor...' : 'Geçiliyor...');
  return quizSonrakiIste(soruId, '');
};

EYLEMLER['quiz-bitir'] = function (el) {
  var d = QZ.veri;
  if (!d || d.durum !== 'devam') return;
  var bos = d.sorular.filter(function (s) { return !s.kapandi && !quizCevapliMi(s); }).length;
  if (!confirm((bos ? 'Cevaplamadığın ' + bos + ' soru var. ' : '') + 'Quiz bitirilsin mi? Bitirince cevapların değiştirilemez.')) return;
  dugmeBekle(el, 'Bitiriliyor...');
  quizBekleyenleriGonder();
  var odevId = QZ.odevId, yol = quizYol('/bitir');
  QZ.kuyruk = QZ.kuyruk.then(function () {
    return api(yol, 'POST', {}).then(function (r) {
      if (QZ.odevId !== odevId) return;
      QZ.mesaj = null;
      quizVeriAl(odevId, r);
      if (S.page === 'quiz') { quizKokYenile(); window.scrollTo(0, 0); }
    }, function (e) { dugmeBitir(el); quizUyari('hata', e.message); });
  });
  return QZ.kuyruk;
};

/* Sayaç: sunucunun saatine göre (QZ.fark). Süre bitince soru başına sürede
   sonraki soru istenir; bütün quizde durum yeniden okunur (sunucu kapatır). */
function quizTik() {
  if (!quizCozuluyor()) {
    if (S.page !== 'quiz') {
      quizSayfadanCikti();
      if (QZ.zamanlayici) { clearInterval(QZ.zamanlayici); QZ.zamanlayici = null; }
    }
    return;
  }
  QZ.ekranda = true;
  var d = QZ.veri, q = d.quiz, dn = d.deneme || {};
  var el = $('qzKalan'), alt = $('qzKalanAlt'), kutu = $('qzKalanKutu');
  if (!el) return;
  var hedef = q.sureTuru === 'soru' ? Date.parse(dn.soruBitis) : dn.sonAn ? Date.parse(dn.sonAn) : NaN;
  var kalan = hedef - (Date.now() + QZ.fark);
  if (isNaN(hedef) || (q.sureTuru === 'yok' && kalan > 3600000)) {
    el.textContent = 'Süresiz';
    if (alt) alt.textContent = '';
    return;
  }
  el.textContent = quizSayac(kalan);
  if (alt) alt.textContent = q.sureTuru === 'soru' ? 'bu soru için' : q.sureTuru === 'quiz' ? 'kalan süre' : 'kapanmasına';
  /* Renk: son dakika turuncu, son 10 sn kırmızı (kısa soruda sürenin üçte biri ve yedide biri). */
  var tam = q.sureTuru === 'soru' && d.sorular[0] ? (d.sorular[0].sureSn || 1) * 1000 : 0;
  kutu.classList.toggle('az', kalan <= (tam ? Math.min(60000, tam / 3) : 60000));
  kutu.classList.toggle('cok-az', kalan <= (tam ? Math.min(10000, tam / 7) : 10000));
  var c = $('qzCubuk');
  if (c && tam) c.style.width = Math.max(0, Math.min(100, kalan / tam * 100)) + '%';
  if (kalan <= 0) quizSureDoldu();
}

function quizSureDoldu() {
  var d = QZ.veri;
  if (d.quiz.sureTuru === 'soru') {
    var s = d.sorular[0];
    if (!s || QZ.sonrakiIstenen === s.id || Date.now() < QZ.sonrakiBekle) return;
    var son = d.deneme.soruSira >= d.quiz.soruSayisi;
    quizSonrakiIste(s.id, son ? '' : 'Önceki sorunun süresi doldu; bu soruya geçildi.');
    return;
  }
  if (QZ.tazeleZamani) return;
  quizBekleyenleriGonder();
  /* Sunucu 3 sn gecikme payı tanır; ondan sonra okunur. */
  QZ.tazeleZamani = setTimeout(quizTazele, 3500);
}

function quizTazele() {
  var odevId = QZ.odevId, yol = quizYol();
  QZ.kuyruk = QZ.kuyruk.then(function () {
    return api(yol).then(function (d) {
      QZ.tazeleZamani = null;
      if (QZ.odevId !== odevId || S.page !== 'quiz') return;
      QZ.mesaj = null;
      quizVeriAl(odevId, d);
      quizKokYenile();
    }, function () { setTimeout(function () { QZ.tazeleZamani = null; }, 5000); });
  });
}

/* ---- sekme / uygulama değiştirme ----
   Yalnız visibilitychange (blur bildirim perdesinde de tetiklenir). Quiz
   sürerken sitenin başka bir sayfasına geçmek de çıkıştır: quiz sayfasına
   dönünce bildirilir. Dönünce dışarıda geçen süre gönderilir; 2 sn altı
   sayılmaz. Oturum başlıkla taşındığı için sendBeacon değil fetch keepalive.
   Algılama tarayıcıda: kayıt caydırıcıdır, kesin değildir. */
function quizOdakGonder(sure, soruId, cevapBekle, hedefOdev) {
  var odevId = hedefOdev || QZ.odevId, istek;
  try {
    istek = fetch('/api/assignments/' + encodeURIComponent(odevId) + '/quiz/odak', {
      method: 'POST', keepalive: true,
      headers: { 'Authorization': 'Bearer ' + S.token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sure: Math.round(sure), soruId: soruId || '' })
    });
  } catch (e) { return Promise.resolve(); }
  if (!cevapBekle) return Promise.resolve();
  return istek.then(function (r) {
    return r.text().then(function (t) {
      var j = {};
      try { j = t ? JSON.parse(t) : {}; } catch (e) { j = {}; }
      if (!r.ok || QZ.odevId !== odevId || !j.durum) return;
      quizVeriAl(odevId, j);
      if (j.cikisSayildi) {
        QZ.mesaj = { tur: 'uyari', metin: 'Quizden çıktığın kaydedildi.' + (j.kapananSoru ? ' Çıkarken açık olan soru kapandı.' : '') };
      }
      if (S.page === 'quiz') quizKokYenile();
    });
  })['catch'](function () { /* bir dahaki dönüşte yeniden sayılır */ });
}

/* Quiz sürerken quiz sayfasından uygulama içinde ayrıldı (menü, geri tuşu). */
function quizSayfadanCikti() {
  if (!QZ.ekranda) return;
  QZ.ekranda = false;
  if (QZ.cikis || !QZ.veri || QZ.veri.durum !== 'devam' || !S.user) return;
  var s = quizSimdikiSoru();
  QZ.cikis = Date.now(); QZ.cikisSoru = s ? s.id : '';
  QZ.cikisIc = true; QZ.cikisOdev = QZ.odevId; QZ.cikisKisi = S.user.id;
}

/* Quiz sayfasına dönüldü: uygulama içindeki çıkış bildirilir (başka quize
   dönüldüyse eskisininki yine gider; başka kişi girdiyse gitmez). */
function quizSayfayaDondu() {
  if (!QZ.cikisIc) return;
  var sure = (Date.now() - QZ.cikis) / 1000, soruId = QZ.cikisSoru, odevId = QZ.cikisOdev;
  var ayni = S.user && S.user.id === QZ.cikisKisi;
  QZ.cikis = 0; QZ.cikisIc = false;
  if (sure < 2 || !ayni) return;
  if (odevId !== QZ.odevId) { quizOdakGonder(sure, soruId, false, odevId); return; }
  /* Cevaplar sunucuya önce varsın: çıkış sırasındaki soru kapanmadan kaydedilsin. */
  QZ.kuyruk = QZ.kuyruk.then(function () { return quizOdakGonder(sure, soruId, true); });
}

document.addEventListener('visibilitychange', function () {
  /* Quiz sayfasından ayrılmışken sekme değişirse aynı çıkış sürer. */
  if (QZ.cikisIc) return;
  if (!quizCozuluyor()) { QZ.cikis = 0; return; }
  if (document.hidden) {
    var s = quizSimdikiSoru();
    QZ.cikis = Date.now();
    QZ.cikisSoru = s ? s.id : '';
    quizBekleyenleriGonder();
    return;
  }
  if (!QZ.cikis) return;
  var sure = (Date.now() - QZ.cikis) / 1000, soruId = QZ.cikisSoru;
  QZ.cikis = 0;
  if (sure < 2) return;
  /* Cevaplar sunucuya önce varsın: çıkış sırasındaki soru kapanmadan kaydedilsin. */
  QZ.kuyruk = QZ.kuyruk.then(function () { return quizOdakGonder(sure, soruId, true); });
});

/* Sekme dışarıdayken kapatılırsa o ana kadarki süre yine gider. */
window.addEventListener('pagehide', function () {
  if (!QZ.cikis || !QZ.veri || QZ.veri.durum !== 'devam') return;
  var sure = (Date.now() - QZ.cikis) / 1000, ic = QZ.cikisIc;
  QZ.cikis = 0; QZ.cikisIc = false;
  if (ic && (!S.user || S.user.id !== QZ.cikisKisi)) return;
  if (sure >= 2) quizOdakGonder(sure, QZ.cikisSoru, false, ic ? QZ.cikisOdev : '');
});

/* Bitti: sonuç açıksa puan, cevaplar ve doğrular; değilse ne zaman açılacağı. */
function quizBittiHtml(d, a) {
  var q = d.quiz, dn = d.deneme || {};
  var h = '<div class="kart qz-bitti">' + quizBaslikHtml(a) +
    '<p class="qz-bitti-neden">' + ik('onay') + '<span>' + esc(quizBitisNedeni(dn.bitisNedeni)) +
    (dn.bitis ? ' <small>' + tarihSaat(dn.bitis) + '</small>' : '') + '</span></p>';
  if (dn.cikisSayisi) {
    h += '<p class="qz-cikis-not">' + ik('goz') + '<span>Quizden ' + dn.cikisSayisi + ' kez çıktın (' + quizSureMetni(dn.cikisSn) + '); öğretmenin görür.</span></p>';
  }
  if (d.sonucAcik && d.sonuc) {
    h += '<div class="qz-puan"><b>' + esc(d.sonuc.puanliSayisi ? d.sonuc.dogruSayisi + '/' + d.sonuc.puanliSayisi + ' (%' + d.sonuc.yuzde + ')' : 'Puanlı soru yok') + '</b>' +
      (d.sonuc.acikUcluSayisi ? '<span>' + d.sonuc.acikUcluSayisi + ' açık uçlu soru puanlanmaz</span>' : '') + '</div>';
  } else if (q.sonucGorunum === 'teslim' && d.sonucAcilis) {
    h += '<div class="msg bilgi">Puanın ve doğru cevaplar son teslimden 10 dakika sonra (' + esc(quizTarihSaat(d.sonucAcilis)) +
      ') açılır; öğretmenin daha önce de açabilir. Açılınca bildirim gelir.</div>';
  } else {
    h += '<div class="msg bilgi">Puanın ve doğru cevaplar öğretmenin sonuçları açınca görünür; açılınca bildirim gelir.</div>';
  }
  h += '<div class="qz-alt-dugmeler"><button type="button" class="btn gri" data-nav="odevler">' + ik('geri') + 'Ödevlere dön</button></div></div>';
  if (d.sonucAcik && d.sorular.length) h += '<h3 class="sb">Cevapların</h3>' + quizSonucListesi(d.sorular, false);
  return h;
}
