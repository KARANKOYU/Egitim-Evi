'use strict';
/* Giriş güvenliği.
   Hız sınırı, kaba kuvvet kilidi, bot sorusu, iki adımlı giriş kodları,
   şifre sıfırlama bağlantıları ve oturumdan kullanıcıyı bulma. */

const crypto = require('crypto');
const eposta = require('./yardimci/eposta');
const { ayarlar, epostaKurulu } = require('./ayarlar');
const { depo } = require('./veri');

/* ============ iki adimli giris (2FA) ============
   Kodlar diske YAZILMAZ, sadece bellekte tutulur ve ozetlenerek saklanir. */

const girisKodlari = new Map();     // kimlik -> { userId, ozet, bitis, deneme, eposta }
const KOD_OMRU_MS = 5 * 60 * 1000;
const KOD_EN_FAZLA_DENEME = 5;

function kodOzeti(kod) { return crypto.createHash('sha256').update(String(kod)).digest('hex'); }

function epostaMaskele(adres) {
  const s = String(adres || '');
  const at = s.indexOf('@');
  if (at < 1) return s;
  const ad = s.slice(0, at);
  const alan = s.slice(at);
  if (ad.length <= 2) return ad[0] + '*' + alan;
  return ad[0] + '*'.repeat(Math.max(1, ad.length - 2)) + ad[ad.length - 1] + alan;
}

/* RFC 2606 / 6761 ile ayrılmış uzantılar (.test, .example, .invalid,
   .localhost) hiçbir yere teslim edilmez. Deneme ve test hesapları bu
   adresleri kullanır; onlara e-posta gönderilmeye çalışılmaz (okulun
   e-posta hesabına geri dönen hata postaları dolmasın), kod sunucu
   günlüğüne yazılır. */
const TESLIMSIZ_UZANTI = /\.(test|example|invalid|localhost)$/i;
function epostaGidebilir(adres) {
  return epostaKurulu() && !TESLIMSIZ_UZANTI.test(String(adres || '').split('@')[1] || '');
}

async function girisKoduGonder(kullanici) {
  const kod = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  const kimlik = crypto.randomBytes(18).toString('hex');

  girisKodlari.set(kimlik, {
    userId: kullanici.id,
    ozet: kodOzeti(kod),
    bitis: Date.now() + KOD_OMRU_MS,
    deneme: 0,
    eposta: kullanici.email,
    sonGonderim: Date.now()
  });

  const konu = 'Eğitim Evi giriş kodun: ' + kod;
  const govde = [
    'Merhaba ' + kullanici.fullName + ',',
    '',
    'Eğitim Evi giriş kodun: ' + kod,
    '',
    'Bu kod 5 dakika geçerlidir ve yalnızca bir kez kullanılabilir.',
    'Giriş denemesi sana ait değilse şifreni değiştir.',
    '',
    'Eğitim Evi'
  ].join('\n');

  if (epostaGidebilir(kullanici.email)) {
    try {
      await eposta.gonder(ayarlar.eposta, kullanici.email, konu, govde);
      return { kimlik: kimlik, yontem: 'eposta' };
    } catch (e) {
      console.error('E-posta gönderilemedi (' + kullanici.email + '):', e.message);
      /* Posta gidemezse kullanici disarida kalmasin: kod sunucu penceresine yazilir. */
      kodKonsolaYaz(kullanici, kod, 'e-posta gonderilemedi');
      return { kimlik: kimlik, yontem: 'konsol', hata: e.message };
    }
  }

  kodKonsolaYaz(kullanici, kod, epostaKurulu() ? 'deneme adresi, e-posta gonderilmez' : 'e-posta ayarlanmamis');
  return { kimlik: kimlik, yontem: 'konsol' };
}

function kodKonsolaYaz(kullanici, kod, neden) {
  console.log('');
  console.log('  ============================================');
  console.log('   GIRIS KODU (' + neden + ')');
  console.log('   Kullanici : ' + kullanici.fullName + ' <' + kullanici.email + '> [' + kullanici.username + ']');
  console.log('   KOD       : ' + kod);
  console.log('   Sure      : 5 dakika');
  console.log('  ============================================');
  console.log('');
}

/* ============ şifre sıfırlama ============
   Kullanıcı e-postasını yazar, tek kullanımlık bir bağlantı gönderilir.
   Anahtarlar bellekte tutuluyor: sunucu yeniden başlarsa bekleyen tüm
   bağlantılar geçersiz olur, bu istenen davranış. */

const sifirlamaKayit = new Map();
const SIFIRLAMA_OMRU_MS = 60 * 60 * 1000;   // 1 saat

/* Süresi geçmişleri ara sıra temizle; sınırsız büyümesin. */
function sifirlamaTemizle() {
  const t = Date.now();
  for (const [k, v] of sifirlamaKayit) if (t > v.bitis) sifirlamaKayit.delete(k);
}

function sifirlamaBaglantisi(anahtar) {
  const kok = (ayarlar.site && ayarlar.site.adres)
    ? String(ayarlar.site.adres).replace(/\/+$/, '')
    : '';
  return kok ? kok + '/#/yeni-sifre?t=' + anahtar : '';
}

async function sifirlamaGonder(kullanici) {
  sifirlamaTemizle();

  /* Aynı kullanıcı için bekleyen eski bağlantıları düşür: tek bağlantı geçerli olsun. */
  for (const [k, v] of sifirlamaKayit) if (v.userId === kullanici.id) sifirlamaKayit.delete(k);

  const anahtar = crypto.randomBytes(32).toString('hex');
  sifirlamaKayit.set(anahtar, {
    userId: kullanici.id,
    eposta: kullanici.email,
    bitis: Date.now() + SIFIRLAMA_OMRU_MS
  });

  const baglanti = sifirlamaBaglantisi(anahtar);
  const konu = 'Eğitim Evi şifre sıfırlama';
  const govde = [
    'Merhaba ' + kullanici.fullName + ',',
    '',
    'Eğitim Evi hesabının şifresini sıfırlamak için aşağıdaki bağlantıya tıkla:',
    '',
    baglanti || ('(Site adresi ayarlanmamış. Anahtar: ' + anahtar + ')'),
    '',
    'Bu bağlantı 1 saat geçerlidir ve yalnızca bir kez kullanılabilir.',
    'Şifre sıfırlama isteğini sen yapmadıysan bu postayı yok sayabilirsin;',
    'şifren değişmeden kalır.',
    '',
    'Eğitim Evi'
  ].join('\n');

  if (epostaGidebilir(kullanici.email)) {
    try {
      await eposta.gonder(ayarlar.eposta, kullanici.email, konu, govde);
      return { yontem: 'eposta' };
    } catch (e) {
      console.error('Sıfırlama postası gönderilemedi (' + kullanici.email + '):', e.message);
      sifirlamaKonsolaYaz(kullanici, baglanti, anahtar, 'e-posta gonderilemedi');
      return { yontem: 'konsol', hata: e.message };
    }
  }
  sifirlamaKonsolaYaz(kullanici, baglanti, anahtar, 'e-posta ayarlanmamis');
  return { yontem: 'konsol' };
}

function sifirlamaKonsolaYaz(kullanici, baglanti, anahtar, neden) {
  console.log('');
  console.log('  ============================================');
  console.log('   SIFRE SIFIRLAMA (' + neden + ')');
  console.log('   Kullanici : ' + kullanici.fullName + ' <' + kullanici.email + '>');
  console.log('   Baglanti  : ' + (baglanti || '(site adresi yok)'));
  console.log('   Anahtar   : ' + anahtar);
  console.log('   Sure      : 1 saat');
  console.log('  ============================================');
  console.log('');
}

