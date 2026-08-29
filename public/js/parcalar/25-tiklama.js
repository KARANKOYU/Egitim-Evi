/* Tıklama yönetimi: data-act düğmelerinin hepsi burada ele alınır. */

/* ================= tıklama yönetimi ================= */
function tiklamaKur() {
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    /* en yakın data taşıyan elemanı bul */
    var el = t;
    while (el && el !== document.body && !el.getAttribute) el = el.parentNode;
    var nav = null, act = null, node = t;
    while (node && node !== document.body) {
      if (node.getAttribute) {
        if (!act && node.getAttribute('data-act')) { act = node; }
        if (!nav && node.getAttribute('data-nav')) { nav = node; }
        if (act || nav) break;
      }
      node = node.parentNode;
    }

    if (nav) {
      ev.preventDefault();
      var k = nav.getAttribute('data-nav');
      if (k === 'geri-veli') {
        var rol = S.user ? S.user.role : '';
        S.viewStudentId = null; S.viewStudentName = '';
        git(rol === 'parent' ? 'cocuklarim' : 'okul-ogrenciler');
        return;
      }
      git(k);
      return;
    }
    if (!act) {
      /* Zorunlu pencere (KVKK onayı) perdeye tıklayınca kapanmaz. */
      if (t.getAttribute && t.getAttribute('data-perde') && !t.getAttribute('data-zorunlu')) modalKapat();
      if ($('bildirimPanel').innerHTML && !$('btnBildirim').contains(t) && !$('bildirimPanel').contains(t)) {
        $('bildirimPanel').innerHTML = '';
      }
      return;
    }
    ev.preventDefault();
    islem(act.getAttribute('data-act'), act);
  });

  $('hamburger').onclick = function () {
    if (masaustuMu()) {
      masaustuDaralt(!document.body.classList.contains('sidebar-kapali'));
      return;
    }
    if ($('sidebar').classList.contains('acik')) sidebarKapat(); else sidebarAc();
  };
  /* Kaydedilen daraltma tercihi yalnizca masaustunde gecerli;
     mobilde menu zaten kayan panel olarak calisiyor. */
  if (masaustuMu() && menuDurumOku()) masaustuDaralt(true);
  try {
    var kg = localStorage.getItem('ee_program_gorunum');
    if (kg === 'hafta' || kg === 'gun') S.programGorunum = kg;
  } catch (e) { }
  /* Mobilden masaüstüne geçişte açık kalan kayan menüyü kapat. */
  window.addEventListener('resize', function () { if (masaustuMu()) sidebarKapat(); });
  $('sidebarPerde').onclick = sidebarKapat;
  $('btnYenile').onclick = sayfayiYenile;
  /* Sayfadaki bir yazı kutusuna yazılınca "kaydedilmemiş" sayılır; yenile
     düğmesi silmeden önce sorar. Filtre seçmek sayılmaz. */
  $('sayfa').addEventListener('input', function (ev) {
    var t = ev.target;
    if (t.matches && t.matches('textarea, [contenteditable], input:not([type]), input[type="text"], input[type="number"]')) {
      S._sayfaDegisti = true;
    }
  });
  $('btnBildirim').onclick = bildirimPaneliAcKapa;
  $('btnAyarlar').onclick = function () { git('profil'); };
  $('btnProfil').onclick = function () { git('profil'); };
  $('araKutu').oninput = araUygula;

  /* Geri/ileri tuşları: adres değişince o sayfaya git. */
  window.addEventListener('hashchange', function () {
    if (adresGuncelleniyor) return;
    var hedef = adrestenSayfa();
    adrestekiCocuguAl();
    /* Geri tuşu sayfayı değiştirirken açık pencere önceki sayfada kalır. */
    if (hedef && hedef !== S.page && SAYFALAR[hedef]) { modalKapat(); git(hedef); }
  });
}

/* Panoya kopyala. http:// üzerinden (güvensiz origin) navigator.clipboard
   tanımsızdır, o yüzden eski execCommand yöntemine düşen bir yedek var. */
function eskiYontemKopyala(metin) {
  try {
    var ta = document.createElement('textarea');
    ta.value = metin;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, metin.length);
    var oldu = document.execCommand('copy');
    document.body.removeChild(ta);
    return oldu;
  } catch (e) { return false; }
}

function panoyaKopyala(metin, btn) {
  function geriBildir(oldu) {
    if (!btn) return;
    if (!btn.getAttribute('data-eski')) btn.setAttribute('data-eski', btn.textContent);
    var eski = btn.getAttribute('data-eski');
    btn.textContent = oldu ? 'Kopyalandı' : 'Kopyalanamadı';
    setTimeout(function () { btn.textContent = eski; }, 1600);
  }
  if (window.navigator && navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(metin).then(
      function () { geriBildir(true); },
      function () { geriBildir(eskiYontemKopyala(metin)); }
    );
    return;
  }
  geriBildir(eskiYontemKopyala(metin));
}

function islem(act, el) {
  var id = el.getAttribute('data-id');
  /* Ekran dosyalarının kendi kaydettiği eylemler (EYLEMLER, 01-yardimcilar.js) */
  if (EYLEMLER[act]) return EYLEMLER[act](el, id);

  if (act === 'modal-kapat') return modalKapat();
  if (act === 'cikis') return cikisYap();
  if (act === 'kvkk-onayla') {
    var kutu = $('kvkkYeniKutu');
    if (!kutu || !kutu.checked) return mesajGoster('kvkkYeniMesaj', 'hata', 'Önce kutucuğu işaretle.');
    return api('/kvkk-onay', 'POST', { onay: true }).then(function (d) {
      S.user = d.user;
      modalKapat();
      girisSonrasi({ user: d.user, kvkkGuncel: true });
    })['catch'](function (e) { mesajGoster('kvkkYeniMesaj', 'hata', e.message); });
  }
  if (act === 'kod-kopyala') return panoyaKopyala(el.getAttribute('data-kod') || '', el);

  if (act === 'islem-suz') {
    S.islemSuz = el.getAttribute('data-islem');
    git('islem-kaydi');
    return;
  }

  if (act === 'ders-dal') return dersDaliAcKapa(el.getAttribute('data-id'));
  if (act === 'ders-hepsini-ac' || act === 'ders-hepsini-kapat') {
    var ac = act === 'ders-hepsini-ac';
    S.acikDersler = {};
    if (ac) {
      var dallar = document.querySelectorAll('[data-act="ders-dal"]');
      for (var dd = 0; dd < dallar.length; dd++) {
        S.acikDersler[dallar[dd].getAttribute('data-id')] = true;
      }
    }
    S.dersHepsiAcik = ac;
    if (!ac) return dersListesiniYenidenCiz();
    git('ders-odevleri');
    return;
  }

  if (act === 'dv-bugun') {
    if (S.dvBugunGit) S.dvBugunGit();
    return;
  }

  if (act === 'yil-bak') {
    return api('/egitim-yili/bak', 'POST', { id: el.getAttribute('data-id'), ogrenci: yilOgrencisi() })
      .then(function () { return yilBilgisiYukle(); })
      .then(function () { git(S.page); })['catch'](hataGoster);
  }
  if (act === 'yil-aktif') {
    if (!confirm('Bu yıl aktif yapılsın mı?\n\nBundan sonra açılan ödev, ' +
      'program ve yoklama kayıtları bu yıla yazılır.')) return;
    return api('/egitim-yili/aktif-yap', 'POST', { id: el.getAttribute('data-id') })
      .then(function () { return yilBilgisiYukle(); })
      .then(function () { git('egitim-yili'); })['catch'](hataGoster);
  }
  if (act === 'yil-ekle') {
    el.disabled = true;
    return api('/egitim-yili/ekle', 'POST', { ad: $('yilAd').value })
      .then(function (r) {
        el.disabled = false;
        return yilBilgisiYukle().then(function () {
          return git('egitim-yili').then(function () { sayfaMesaji('iyi', r.message); });
        });
      })['catch'](function (e) {
        el.disabled = false;
        mesajGoster('yilMesaj', 'hata', e.message);
      });
  }

  /* ---- takvim ---- */
  if (act === 'takvim-ay') {
    var yon = Number(el.getAttribute('data-yon'));
    S.takvimAy += yon;
    if (S.takvimAy < 1) { S.takvimAy = 12; S.takvimYil--; }
    if (S.takvimAy > 12) { S.takvimAy = 1; S.takvimYil++; }
    S.takvimSecili = '';
    git('takvim');
    return;
  }
  if (act === 'takvim-bugun') {
    var bd = new Date();
    S.takvimYil = bd.getFullYear();
    S.takvimAy = bd.getMonth() + 1;
    S.takvimSecili = bd.toISOString().slice(0, 10);
    git('takvim');
    return;
  }
  if (act === 'takvim-gun') {
    S.takvimSecili = el.getAttribute('data-tarih');
    var eskiSecili = document.querySelector('.takvim-hucre.secili');
    if (eskiSecili) eskiSecili.classList.remove('secili');
    el.classList.add('secili');
    return takvimGunCiz(S.takvimSecili);
  }
  if (act === 'takvim-etkinlik-ekle') return takvimEtkinlikModal();
  if (act === 'takvim-etkinlik-kaydet') {
    el.disabled = true;
    return api('/takvim/etkinlik', 'POST', {
      baslik: $('tkBaslik').value,
      tur: $('tkTur').value,
      tarih: $('tkTarih').value,
      bitis: $('tkBitis').value,
      aciklama: $('tkAciklama').value
    }).then(function (r) {
      modalKapat();
      git('takvim').then(function () { sayfaMesaji('iyi', r.message); });
    })['catch'](function (e) {
      el.disabled = false;
      mesajGoster('tkMesaj', 'hata', e.message);
    });
  }
  if (act === 'takvim-etkinlik-sil') {
    if (!confirm('Bu kayıt takvimden kaldırılsın mı?')) return;
    return api('/takvim/etkinlik-sil', 'POST', { id: el.getAttribute('data-id') })
      .then(function () { git('takvim'); })['catch'](hataGoster);
  }

  /* ---- devamsızlık ---- */
  if (act === 'yoklama-ders') {
    S.yoklamaDers = el.getAttribute('data-id');
    S.yoklamaTarih = '';
    git('yoklama');
    return;
  }
  if (act === 'yoklama-durum') {
    var yoid = el.getAttribute('data-ogrenci');
    var ydurum = el.getAttribute('data-durum');
    S.yoklamaDurum[yoid] = ydurum;
    var kap = el.parentNode;
    var dugmeler = kap.querySelectorAll('.durum-dugme');
    for (var i = 0; i < dugmeler.length; i++) {
      dugmeler[i].classList.toggle('secili',
        dugmeler[i].getAttribute('data-durum') === ydurum);
    }
    return;
  }
  if (act === 'yoklama-hepsi-var') {
    var kutular = document.querySelectorAll('.durum-secim');
    for (var q2 = 0; q2 < kutular.length; q2++) {
      var oid2 = kutular[q2].getAttribute('data-ogrenci');
      S.yoklamaDurum[oid2] = 'var';
      var dg = kutular[q2].querySelectorAll('.durum-dugme');
      for (var w = 0; w < dg.length; w++) {
        dg[w].classList.toggle('secili', dg[w].getAttribute('data-durum') === 'var');
      }
    }
    return;
  }
  if (act === 'yoklama-kaydet') {
    var girisler = [];
    for (var oid3 in S.yoklamaDurum) {
      if (Object.prototype.hasOwnProperty.call(S.yoklamaDurum, oid3)) {
        girisler.push({ ogrenciId: oid3, durum: S.yoklamaDurum[oid3] });
      }
    }
    el.disabled = true;
    return api('/devamsizlik/yoklama', 'POST', {
      lessonId: S.yoklamaDers,
      tarih: S.yoklamaTarih,
      girisler: girisler
    }).then(function (r) {
      el.disabled = false;
      mesajGoster('yoklamaMesaj', 'iyi', r.message);
    })['catch'](function (e) {
      el.disabled = false;
      mesajGoster('yoklamaMesaj', 'hata', e.message);
    });
  }

  /* ---- mesajlar ---- */
  if (act === 'mesaj-kutu') {
    S.mesajKutu = el.getAttribute('data-kutu');
    git('mesajlar');
    return;
  }
  if (act === 'mesaj-tur') {
    S.mesajTur = el.getAttribute('data-tur');
    git('mesajlar');
    return;
  }
  if (act === 'mesaj-ac') return mesajAc(el.getAttribute('data-id'));
  if (act === 'mesaj-yeni') return mesajYeniModal();
  if (act === 'mesaj-gonder') return mesajGonderIslemi(el);
  if (act === 'mesaj-sil') {
    var msid = el.getAttribute('data-id');
    if (!confirm(S.mesajKutu === 'giden'
      ? 'Mesaj tüm alıcılardan silinsin mi?'
      : 'Mesaj kutundan kaldırılsın mı?')) return;
    return api('/mesajlar/sil', 'POST', { id: msid })
      .then(function () { modalKapat(); git('mesajlar'); bildirimleriYenile(); })
      ['catch'](hataGoster);
  }
  if (act === 'mesaj-engel-kaldir') {
    var eid = el.getAttribute('data-id');
    var kalan = (S.mesajAyarGecici.engelli || [])
      .filter(function (x) { return x.id !== eid; })
      .map(function (x) { return x.id; });
    return api('/mesajlar/ayar', 'POST',
      { kimden: S.mesajAyarGecici.kimden, engelli: kalan })
      .then(function () { git('mesajlar'); })['catch'](hataGoster);
  }
  if (act === 'mesaj-ayar-kaydet') {
    var secim = document.querySelector('input[name=mesajIzin]:checked');
    el.disabled = true;
    return api('/mesajlar/ayar', 'POST', {
      kimden: secim ? secim.value : 'herkes',
      engelli: (S.mesajAyarGecici.engelli || []).map(function (x) { return x.id; })
    }).then(function () {
      el.disabled = false;
      mesajGoster('mesajAyarMesaj', 'iyi', 'Ayar kaydedildi.');
    })['catch'](function (e) {
      el.disabled = false;
      mesajGoster('mesajAyarMesaj', 'hata', e.message);
    });
  }

  /* Excel aktarım düğmeleri 15-aktarim.js içinde (EYLEMLER). */

  /* ---- yedekleme ---- */
  if (act === 'yedek-al') {
    el.disabled = true;
    return api('/admin/backup-now', 'POST')
      .then(function (r) {
        mesajGoster('yedekMesaj', 'iyi', r.yedek.ad + ' alındı (' + boyutYaz(r.yedek.boyut) + ')');
        setTimeout(function () { git('yedekler'); }, 900);
      })['catch'](function (e) {
        el.disabled = false;
        mesajGoster('yedekMesaj', 'hata', e.message);
      });
  }
  if (act === 'yedek-indir') {
    var iad = el.getAttribute('data-ad');
    el.disabled = true;
    return dosyaIndir('/api/admin/backup-download?ad=' + encodeURIComponent(iad), iad)
      .then(function () { el.disabled = false; })
      ['catch'](function (e) { el.disabled = false; hataGoster(e); });
  }
  if (act === 'yedek-geri') {
    var yad = el.getAttribute('data-ad');
    if (!confirm(yad + ' geri yüklensin mi?\n\nBu yedekten sonraki bütün değişiklikler ' +
      'kaybolur. Şimdiki hâl geri-alma kopyası olarak saklanacak.')) return;
    el.disabled = true;
    return api('/admin/backup-restore', 'POST', { ad: yad })
      .then(function (r) {
        alert(r.message + '\n\nSayfa yenilenecek.');
        location.reload();
      })['catch'](function (e) { el.disabled = false; hataGoster(e); });
  }
  if (act === 'yedek-sil') {
    var sad = el.getAttribute('data-ad');
    if (!confirm(sad + ' silinsin mi?')) return;
    return api('/admin/backup-delete', 'POST', { ad: sad })
      .then(function () { git('yedekler'); })['catch'](hataGoster);
  }

  /* ---- admin: müdür hesapları ---- */
  if (act === 'mudur-sil') {
    var mad = el.getAttribute('data-ad') || 'Bu müdür';
    var mokul = el.getAttribute('data-okul') || '';
    if (!confirm(mad + ' hesabı silinsin mi? (' + mokul + ')\n\n' +
      'Okul "beklemede" durumuna döner, yeni kayıt alamaz. Öğretmen ve öğrenci ' +
      'hesapları silinmez; okula yeni bir müdür başvurabilir.')) return;
    return api('/admin/principal-delete', 'POST', { userId: id })
      .then(function () { git('mudurler'); })['catch'](hataGoster);
  }

  /* ---- müdür: öğrenci hesapları (hesap penceresi 10b-hesaplar.js) ---- */
  if (act === 'ogrenci-portal') {
    return ogrenciPortalAc(id, el.getAttribute('data-ad') || 'Öğrenci');
  }

  /* ---- sınıflar ---- */
  if (act === 'sinif-ekle') {
    var ad = ($('yeniSinif').value || '').trim();
    if (!ad) { mesajGoster('sinifMesaj', 'hata', 'Sınıf adı yaz (ör. 7-A)'); return; }
    el.disabled = true;
    return api('/school/class', 'POST', { name: ad })
      .then(function () { git('siniflar'); })
      ['catch'](function (e) { el.disabled = false; mesajGoster('sinifMesaj', 'hata', e.message); });
  }
  if (act === 'sinif-sil') {
    var sad = el.getAttribute('data-ad') || 'Bu sınıf';
    if (!confirm(sad + ' silinsin mi? Öğrenciler sınıfsız kalır, ' +
      'sınıfın dersleri ve ders programı silinir. Öğrenci hesapları silinmez.')) return;
    return api('/school/class-delete', 'POST', { classId: id })
      .then(function () { git('siniflar'); })['catch'](hataGoster);
  }
  if (act === 'sinif-program') {
    S.programSinif = id;
    S.programGun = 0;
    return git('program');
  }
  if (act === 'sinif-dersler') {
    return sinifDersleriModal(id, el.getAttribute('data-ad') || '')['catch'](hataGoster);
  }
  if (act === 'sinif-ogrenciler') {
    return sinifOgrencileriModal(id, el.getAttribute('data-ad') || '')['catch'](hataGoster);
  }
  if (act === 'sinif-yerlestir') {
    return sinifOgrencileriModal('', '')['catch'](hataGoster);
  }
  if (act === 'ders-ekle') {
    var ders = $('yeniDers') ? $('yeniDers').value : '';
    var saat = $('yeniDersSaat') ? $('yeniDersSaat').value : 0;
    el.disabled = true;
    return api('/school/lesson', 'POST', { classId: id, subject: ders, weeklyHours: saat })
      .then(function () {
        return sinifDersleriModal(id, (S.dersBilgi['class'] || {}).name || '');
      })['catch'](function (e) { el.disabled = false; hataGoster(e); });
  }
  if (act === 'ders-sil') {
    var cid = el.getAttribute('data-cid');
    if (!confirm('Ders silinsin mi? Bu dersin ders programındaki saatleri de silinir.')) return;
    return api('/school/lesson-delete', 'POST', { lessonId: id })
      .then(function () { return sinifDersleriModal(cid, (S.dersBilgi['class'] || {}).name || ''); })
      ['catch'](hataGoster);
  }

  /* ---- ders programı ---- */
  if (act === 'cakisma-ac') {
    S.cakismaAcik = !S.cakismaAcik;
    return programYenidenCiz();
  }
  if (act === 'program-gun') {
    S.programGun = parseInt(el.getAttribute('data-gun'), 10) || 1;
    return programYenidenCiz();
  }
  if (act === 'program-gorunum') {
    S.programGorunum = el.getAttribute('data-tur') === 'hafta' ? 'hafta' : 'gun';
    try { localStorage.setItem('ee_program_gorunum', S.programGorunum); } catch (e) { }
    return programYenidenCiz();
  }
  if (act === 'saat-ekle') {
    return saatModal(parseInt(el.getAttribute('data-gun'), 10), '');
  }
  if (act === 'saat-duzenle') {
    return saatModal(0, id);
  }
  if (act === 'saat-sil') {
    if (!confirm('Bu ders saati programdan silinsin mi?')) return;
    return api('/school/schedule-delete', 'POST', { scheduleId: id })
      .then(function () { return programCiz(); })['catch'](hataGoster);
  }
  if (act === 'saat-kaydet') {
    var duzenlenen = el.getAttribute('data-id') || '';
    var govde = {
      day: $('mGun').value,
      lessonId: $('mDers').value,
      start: $('mBas').value,
      end: $('mBit').value
    };
    if (!govde.start || !govde.end) {
      mesajGoster('saatMesaj', 'hata', 'Başlangıç ve bitiş saatini gir.');
      return;
    }
    el.disabled = true;
    var istek = duzenlenen
      ? api('/school/schedule-update', 'POST',
          { scheduleId: duzenlenen, day: govde.day, lessonId: govde.lessonId,
            start: govde.start, end: govde.end })
      : api('/school/schedule-add', 'POST',
          { classId: S.programSinif, day: govde.day, lessonId: govde.lessonId,
            start: govde.start, end: govde.end });

    return istek.then(function (r) {
      modalKapat();
      /* Uyarıyı sayfanın kendi çizimine bırak; #sayfa'ya doğrudan yazmak
         tüm içeriği siliyordu. */
      S.programUyari = r.uyari
        ? (r.uyari.tur === 'ogretmen'
            ? 'Bu öğretmen aynı saatte ' + r.uyari.className + ' sınıfında ' +
              r.uyari.subject + ' dersinde de görünüyor (' + r.uyari.start + '-' + r.uyari.end + ').'
            : 'Bu sınıfın aynı saatte başka dersi var: ' + r.uyari.subject +
              ' (' + r.uyari.start + '-' + r.uyari.end + ').')
        : '';
      return programCiz();
    })['catch'](function (e) {
      el.disabled = false;
      mesajGoster('saatMesaj', 'hata', e.message);
    });
  }

  if (act === 'odev-filtre-temizle') {
    var mod = S.odevF.mod;
    S.odevF = { ders: '', yildiz: '', durum: '', bas: '', bit: '', mod: mod };
    if ($('araKutu')) $('araKutu').value = '';
    return git(S.page);
  }
  if (act === 'kaynakca') {
    return modalAc('Kaynakça', '<p>Bu sistem Eğitim Evi projesi kapsamında geliştirilmiştir.</p>' +
      '<p style="color:var(--soluk);font-size:13.5px">Tüm veriler okulunun kendi sunucusunda saklanır, ' +
      'üçüncü taraflarla paylaşılmaz ve sistemde reklam bulunmaz.</p>');
  }

  /* admin */
  if (act === 'admin-onay') {
    return api('/admin/decide', 'POST', { userId: id, approve: el.getAttribute('data-ok') === '1' })
      .then(function () { git('onaylar'); bildirimleriYenile(); })['catch'](hataGoster);
  }

  /* müdür */
  if (act === 'ogretmen-onay') {
    return api('/school/teacher-decide', 'POST', { userId: id, approve: el.getAttribute('data-ok') === '1' })
      .then(function () { git('ogretmenler'); })['catch'](hataGoster);
  }

  /* ödev */
  if (act === 'odev-yeni') return odevYeniModal()['catch'](hataGoster);
  if (act === 'odev-tumu' || act === 'odev-hicbiri') {
    var isaret = act === 'odev-tumu';
    var hepsi = document.querySelectorAll('.ogrenci-kutu');
    for (var t = 0; t < hepsi.length; t++) hepsi[t].checked = isaret;
    odevSecimBagla();
    return;
  }
  if (act === 'odev-kaydet') {
    var secili = document.querySelectorAll('.ogrenci-kutu:checked');
    if (!secili.length) {
      mesajGoster('mHata', 'hata', 'En az bir öğrenci seç.');
      return;
    }
    var idler = [];
    for (var si = 0; si < secili.length; si++) idler.push(secili[si].value);
    if (ekYukleniyor('odev')) { mesajGoster('mHata', 'uyari', 'Dosyalar yükleniyor; bitince kaydet.'); return; }

    el.disabled = true;
    return api('/assignments', 'POST', {
      subject: $('mDers') ? $('mDers').value : '',
      title: $('mBaslik').value,
      description: $('mAciklama').value,
      startAt: $('mBas').value, startTime: $('mBasSaat').value,
      endAt: $('mBit').value,
      endTime: $('mBitSaat') ? $('mBitSaat').value : '12:00',
      studentIds: idler,
      ekIdler: ekIdleri('odev')
    }).then(function () {
      modalKapat(); git('ogr-odevler');
    })['catch'](function (e) {
      el.disabled = false;
      mesajGoster('mHata', 'hata', e.message);
    });
  }
  if (act === 'odev-ac') return odevAc(id)['catch'](hataGoster);
  if (act === 'odev-bitir') {
    /* Müdür (öğretmeni ayrılmış ödevi sonuçlandırınca) ders ödevlerine döner. */
    return api('/assignments/' + id + '/finish', 'POST', { results: S._sonuclar || {} })
      .then(function () { git(S.user.role === 'principal' ? 'ders-odevleri' : 'ogr-odevler'); })['catch'](hataGoster);
  }
  if (act === 'odev-tekrar') {
    return api('/assignments/' + id + '/reopen', 'POST')
      .then(function () { git(S.user.role === 'principal' ? 'ders-odevleri' : 'ogr-odevler'); })['catch'](hataGoster);
  }
  if (act === 'odev-sil') {
    if (!confirm('Bu ödev silinsin mi? Geri alınamaz.')) return;
    return api('/assignments/' + id + '/delete', 'POST').then(function () { git('ogr-odevler'); })['catch'](hataGoster);
  }

  /* sınav: düğmeleri 12-ogretmen-sinav.js içinde (EYLEMLER) */

  /* veli */
  if (act === 'cocuk-ekle') {
    return api('/parent/link', 'POST', { code: $('veliKod').value })
      .then(function (d) { S.children = d.children || []; navCiz(); git('cocuklarim'); })
      ['catch'](function (e) { mesajGoster('veliMesaj', 'hata', e.message); });
  }
  if (act === 'cocuk-ac') {
    S.viewStudentId = id; S.viewStudentName = el.getAttribute('data-ad');
    return git('ilerleyisim');
  }
  if (act === 'cocuk-sil') {
    if (!confirm('Bu çocuk hesabından kaldırılsın mı?')) return;
    return api('/parent/unlink', 'POST', { studentId: id })
      .then(function (d) { S.children = d.children || []; navCiz(); git(S.children.length || S.user.role === 'parent' ? 'cocuklarim' : 'ana'); })
      ['catch'](hataGoster);
  }

  /* ayarlar */
  if (act === 'veli-cocuk') {
    S.veliCocuk = id || null;
    /* Yıl seçici seçilen çocuğun okuluna (ve önceki okullarına) göre. */
    return yilBilgisiYukle().then(function () { return git(S.page); });
  }
  /* Üstteki ay/güneş: açık ile koyu arasında geçer ("sistem" seçiliyse şu an
     görünenin tersine). Girişliyse hesaba da yazılır. */
  if (act === 'tema-degis') {
    var kok = document.documentElement.getAttribute('data-tema');
    var koyuGorunuyor = kok === 'koyu' || (!kok && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var yeniTema = window.temaAyarla ? window.temaAyarla(koyuGorunuyor ? 'acik' : 'koyu') : 'sistem';
    if (S.token && S.user) {
      api('/profile', 'POST', { tema: yeniTema }).then(function (d) { S.user = d.user; })['catch'](function () { });
    }
    if (S.page === 'profil' && S.user) return git('profil');
    return;
  }
  if (act === 'tema-sec') {
    var tema = window.temaAyarla ? window.temaAyarla(el.getAttribute('data-deger')) : 'sistem';
    /* Hesaba da yaz; hata olursa tarayıcıdaki seçim yine geçerli kalır. */
    api('/profile', 'POST', { tema: tema }).then(function (d) { S.user = d.user; })['catch'](function () { });
    return git('profil');
  }
  if (act === 'profil-kaydet') {
    if (tarihSeciciDurum('pDogum') === 'eksik') {
      mesajGoster('pMesaj', 'hata', 'Doğum tarihinde gün, ay ve yılın üçünü de seç.');
      return;
    }
    return api('/profile', 'POST', {
      fullName: $('pAd').value, city: $('pIl').value,
      district: $('pIlce').value, address: $('pAdres').value,
      tc: $('pTc') ? $('pTc').value.trim() : undefined,
      dogum: $('pDogum') ? $('pDogum').value : ''
    }).then(function (d) {
      S.user = d.user;
      $('profilEtiket').textContent = d.user.fullName.split(' ')[0];
      $('profilAvatar').innerHTML = avatar(d.user.fullName, d.user.anaHesapId || d.user.id);
      mesajGoster('pMesaj', 'iyi', 'Bilgilerin kaydedildi.');
    })['catch'](function (e) { mesajGoster('pMesaj', 'hata', e.message); });
  }
  if (act === 'sifre-kaydet') {
    var yeni1 = $('sYeni').value;
    var yeni2 = $('sYeni2').value;
    if (!$('sEski').value) { mesajGoster('sMesaj', 'hata', 'Mevcut şifreni gir.'); return; }
    if (yeni1 !== yeni2) { mesajGoster('sMesaj', 'hata', 'Yeni şifreler birbirini tutmuyor.'); return; }
    if (yeni1 === $('sEski').value) {
      mesajGoster('sMesaj', 'hata', 'Yeni şifre eskisiyle aynı olamaz.');
      return;
    }
    var yeniSorun = sifreSorunuTR(yeni1, gucluSifreli(S.user));
    if (yeniSorun) { mesajGoster('sMesaj', 'hata', yeniSorun); return; }
    el.disabled = true;
    return api('/password', 'POST', { old: $('sEski').value, 'new': yeni1 })
      .then(function () {
        el.disabled = false;
        mesajGoster('sMesaj', 'iyi', 'Şifren değiştirildi.');
        $('sEski').value = ''; $('sYeni').value = ''; $('sYeni2').value = '';
      })['catch'](function (e) {
        el.disabled = false;
        mesajGoster('sMesaj', 'hata', e.message);
      });
  }
}

function hataGoster(e) { alert(e.message); }

/* Şifre sıfırlama bağlantısındaki tek kullanımlık anahtar. */
var yeniSifreAnahtar = '';
var yeniSifreEkraniAcDisaridan = function () { };
