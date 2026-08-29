/* Takvim: ay görünümü, tatiller, ödev teslimleri. */

/* ================= takvim ================= */

var AY_ADLARI = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
var GUN_BASLIK = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
var OLAY_AD = {
  tatil: 'Tatil', ozel: 'Özel gün', odev: 'Ödev',
  etkinlik: 'Etkinlik', sinav: 'Sınav', toplanti: 'Toplantı'
};

/* Takvim hangi öğrencinin gözünden? Öğrenci: kendisi. Portal açıksa o
   öğrenci. Veli portala girmemişse şeritte seçili çocuk, yoksa ilk çocuk. */
function takvimOgrenciParam() {
  var id = null;
  if (S.viewStudentId && S.user.role !== 'student') id = S.viewStudentId;
  else if (S.user.role === 'parent') {
    var c = veliSeciliCocuk() || (S.children && S.children[0]);
    if (c) id = c.id;
  }
  return id ? '&studentId=' + encodeURIComponent(id) : '';
}

SAYFALAR.takvim = function () {
  var bugun = new Date();
  if (!S.takvimYil) S.takvimYil = bugun.getFullYear();
  if (!S.takvimAy) S.takvimAy = bugun.getMonth() + 1;

  var yol = '/takvim?yil=' + S.takvimYil + '&ay=' + S.takvimAy +
    takvimOgrenciParam();

  return api(yol).then(function (d) {
    var h = hero('TAKVIM', d.ogrenci && (S.viewStudentId || S.user.role === 'parent') && S.user.role !== 'student'
      ? d.ogrenci.ad + ' adına görüntülüyorsun.'
      : 'Ödev teslim tarihleri, dersler, tatiller ve okul etkinlikleri.');
    /* Veli portala girmeden de çocuğunun takvimini görür; şeritten çocuk seçer. */
    if (S.user.role === 'parent' && !S.viewStudentId) h += veliCocukSeridi();

    /* --- ay gezinme --- */
    h += '<div class="kart"><div class="takvim-ust">' +
      '<button class="btn kucuk ghost" data-act="takvim-ay" data-yon="-1">‹</button>' +
      '<div class="takvim-baslik">' + AY_ADLARI[d.ay - 1] + ' ' + d.yil + '</div>' +
      '<button class="btn kucuk ghost" data-act="takvim-ay" data-yon="1">›</button>' +
      '<button class="btn kucuk gri" data-act="takvim-bugun">Bugün</button>' +
      '<div class="buyu"></div>' +
      '<select id="takvimYilSec" class="tarih-kutu">';
    for (var y = d.yil - 3; y <= d.yil + 3; y++) {
      h += '<option value="' + y + '"' + (y === d.yil ? ' selected' : '') + '>' + y + '</option>';
    }
    h += '</select>';
    if (d.yonetebilir) {
      h += '<button class="btn kucuk" data-act="takvim-etkinlik-ekle">Etkinlik ekle</button>';
    }
    h += '</div>';

    /* --- ızgara --- */
    h += '<div class="takvim-izgara">';
    for (var g = 0; g < 7; g++) {
      h += '<div class="takvim-gun-basligi' + (g >= 5 ? ' haftasonu' : '') + '">' +
        GUN_BASLIK[g] + '</div>';
    }
    for (var b = 0; b < d.basSutun; b++) h += '<div class="takvim-hucre bos"></div>';

    for (var i = 0; i < d.gunler.length; i++) {
      var gn = d.gunler[i];
      var sinif = 'takvim-hucre';
      if (gn.haftaSonu) sinif += ' haftasonu';
      if (gn.tatil) sinif += ' tatil';
      if (gn.bugun) sinif += ' bugun';
      if (S.takvimSecili === gn.tarih) sinif += ' secili';

      h += '<button class="' + sinif + '" data-act="takvim-gun" data-tarih="' +
        gn.tarih + '">' +
        '<span class="gun-no">' + gn.gun + '</span>';

      if (gn.dersSayisi) {
        h += '<span class="gun-ders">' + gn.dersSayisi + ' ders</span>';
      }
      h += '<span class="gun-isaretler">';
      for (var j = 0; j < gn.olaylar.length && j < 4; j++) {
        var o = gn.olaylar[j];
        h += '<span class="isaret ' + esc(o.tur) + '" title="' + esc(o.baslik) + '"></span>';
      }
      h += '</span>';

      /* Tatil ve özel gün adı hücrede görünsün */
      var adli = null;
      for (var k = 0; k < gn.olaylar.length; k++) {
        if (gn.olaylar[k].tur === 'tatil' || gn.olaylar[k].tur === 'ozel') {
          adli = gn.olaylar[k]; break;
        }
      }
      if (adli) h += '<span class="gun-etiket">' + esc(adli.baslik) + '</span>';

      h += '</button>';
    }
    h += '</div>';

    /* --- açıklama --- */
    h += '<div class="takvim-lejant">' +
      '<span><i class="isaret odev"></i> Ödev teslimi</span>' +
      '<span><i class="isaret tatil"></i> Tatil</span>' +
      '<span><i class="isaret ozel"></i> Özel gün</span>' +
      '<span><i class="isaret etkinlik"></i> Etkinlik</span>' +
      '<span><i class="isaret sinav"></i> Sınav</span>' +
      '</div></div>';

    h += '<div id="takvimGun"></div>';
    yaz(h);

    var sec = $('takvimYilSec');
    if (sec) sec.onchange = function () {
      S.takvimYil = Number(this.value);
      git('takvim');
    };

    if (S.takvimSecili) takvimGunCiz(S.takvimSecili);
  });
};

function takvimEtkinlikModal() {
  var bugunT = S.takvimSecili || new Date().toISOString().slice(0, 10);
  var govde = '<div class="field"><label for="tkBaslik">Başlık</label>' +
    '<input type="text" id="tkBaslik" maxlength="100" placeholder="Veli toplantısı"></div>' +
    '<div class="field"><label for="tkTur">Tür</label><select id="tkTur">' +
    '<option value="etkinlik">Etkinlik</option>' +
    '<option value="tatil">Tatil</option>' +
    '<option value="sinav">Sınav</option>' +
    '<option value="toplanti">Toplantı</option></select></div>' +
    '<div class="grid k2">' +
    '<div class="field"><label for="tkTarih">Başlangıç</label>' +
    '<input type="date" id="tkTarih" value="' + esc(bugunT) + '"></div>' +
    '<div class="field"><label for="tkBitis">Bitiş (isteğe bağlı)</label>' +
    '<input type="date" id="tkBitis"></div></div>' +
    '<div class="field"><label for="tkAciklama">Açıklama</label>' +
    '<textarea id="tkAciklama" rows="3" maxlength="300"></textarea></div>' +
    '<div id="tkMesaj"></div>';

  modalAc('Takvime ekle', govde,
    '<button class="btn gri" data-act="modal-kapat">Vazgeç</button>' +
    '<button class="btn" data-act="takvim-etkinlik-kaydet">Ekle</button>');
}
