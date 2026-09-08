/*
  Küçük SMTP istemcisi.

  Projede dış paket kullanılmadığı için Node'un kendi net/tls modülleriyle
  yazıldı. İki bağlantı biçimini destekler:
    - port 465 -> baştan TLS      ({ guvenli: true })
    - port 587 -> STARTTLS ile yükseltme ({ guvenli: false })

  Hem server.js (giriş kodu göndermek için) hem de
  araclar/eposta-ayarla.js (deneme e-postası için) bunu kullanır.
*/

const net = require('net');
const tls = require('tls');

const ZAMAN_ASIMI_MS = 15000;

/* Sunucuya komut yollar ve yanıt kodunu bekler.
   Çok satırlı yanıtlarda son satır "250 " gibi boşlukla gelir; bitişi ondan anlarız. */
function komut(sok, metin, beklenen) {
  return new Promise((resolve, reject) => {
    let tampon = '';
    const sayac = setTimeout(() => {
      temizle();
      reject(new Error('SMTP zaman aşımı: ' + (metin === null ? 'bağlantı' : String(metin).slice(0, 40))));
    }, ZAMAN_ASIMI_MS);

    function temizle() {
      clearTimeout(sayac);
      sok.removeListener('data', veriGeldi);
      sok.removeListener('error', hataOldu);
    }
    function hataOldu(e) { temizle(); reject(e); }
    function veriGeldi(parca) {
      tampon += parca.toString('utf8');
      const satirlar = tampon.split(/\r?\n/).filter(Boolean);
      const son = satirlar[satirlar.length - 1] || '';
      if (!/^\d{3} /.test(son)) return;
      temizle();
      const kod = parseInt(son.slice(0, 3), 10);
      if (beklenen && beklenen.indexOf(kod) < 0) {
        reject(new Error('SMTP beklenmeyen yanıt (' + kod + '): ' + son.slice(0, 160)));
        return;
      }
      resolve({ kod: kod, metin: tampon });
    }

    sok.on('data', veriGeldi);
    sok.on('error', hataOldu);
    if (metin !== null) sok.write(metin + '\r\n');
  });
}

function baglantiBekle(sok, olay) {
  return new Promise((resolve, reject) => {
    const sayac = setTimeout(() => reject(new Error('SMTP bağlantı zaman aşımı')), ZAMAN_ASIMI_MS);
    sok.once(olay, () => { clearTimeout(sayac); resolve(); });
    sok.once('error', e => { clearTimeout(sayac); reject(e); });
  });
}

/* Türkçe karakterli başlıkları MIME ile kodlar (yoksa bozuk görünür). */
function basligiKodla(metin) {
  return '=?UTF-8?B?' + Buffer.from(String(metin), 'utf8').toString('base64') + '?=';
}

/* ayar: { sunucu, port, guvenli, kullanici, sifre, gonderen, gorunenAd } */
async function gonder(ayar, alici, konu, govde) {
  if (!ayar || !ayar.sunucu || !ayar.kullanici || !ayar.sifre) {
    throw new Error('E-posta ayarları eksik (sunucu / kullanıcı / şifre)');
  }
  const gonderen = ayar.gonderen || ayar.kullanici;
  let sok;

  if (ayar.guvenli) {
    sok = tls.connect({ host: ayar.sunucu, port: ayar.port, servername: ayar.sunucu });
    await baglantiBekle(sok, 'secureConnect');
  } else {
    sok = net.connect({ host: ayar.sunucu, port: ayar.port });
    await baglantiBekle(sok, 'connect');
  }

  try {
    await komut(sok, null, [220]);
    await komut(sok, 'EHLO egitimevi', [250]);

    if (!ayar.guvenli) {
      await komut(sok, 'STARTTLS', [220]);
      const guvenliSok = tls.connect({ socket: sok, servername: ayar.sunucu });
      await baglantiBekle(guvenliSok, 'secureConnect');
      sok = guvenliSok;
      await komut(sok, 'EHLO egitimevi', [250]);
    }

    await komut(sok, 'AUTH LOGIN', [334]);
    await komut(sok, Buffer.from(ayar.kullanici, 'utf8').toString('base64'), [334]);
    await komut(sok, Buffer.from(ayar.sifre, 'utf8').toString('base64'), [235]);

    await komut(sok, 'MAIL FROM:<' + gonderen + '>', [250]);
    await komut(sok, 'RCPT TO:<' + alici + '>', [250, 251]);
    await komut(sok, 'DATA', [354]);

    const govdeB64 = Buffer.from(govde, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n');
    const mesaj = [
      'From: ' + basligiKodla(ayar.gorunenAd || 'Eğitim Evi') + ' <' + gonderen + '>',
      'To: <' + alici + '>',
      'Subject: ' + basligiKodla(konu),
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: base64',
      'Date: ' + new Date().toUTCString(),
      '',
      govdeB64,
      '.'
    ].join('\r\n');

    await komut(sok, mesaj, [250]);
    try { await komut(sok, 'QUIT', [221]); } catch (e) { /* kapanış önemli değil */ }
  } finally {
    try { sok.end(); } catch (e) { /* yoksay */ }
  }
}

/* Sık kullanılan sağlayıcıların hazır ayarları. */
const SAGLAYICILAR = {
  gmx:     { ad: 'GMX',     sunucu: 'mail.gmx.com',          port: 587, guvenli: false, not: 'Ayarlar > POP3/IMAP erişimini açman gerekir.' },
  gmail:   { ad: 'Gmail',   sunucu: 'smtp.gmail.com',        port: 465, guvenli: true,  not: '2 Adımlı Doğrulama açık olmalı, sonra Uygulama Şifresi üret.' },
  yandex:  { ad: 'Yandex',  sunucu: 'smtp.yandex.com',       port: 465, guvenli: true,  not: 'Uygulama şifresi gerekir.' },
  zoho:    { ad: 'Zoho',    sunucu: 'smtp.zoho.com',         port: 465, guvenli: true,  not: 'Uygulama şifresi gerekir.' },
  brevo:   { ad: 'Brevo',   sunucu: 'smtp-relay.brevo.com',  port: 587, guvenli: false, not: 'Kullanıcı adı Brevo SMTP kullanıcısı, şifre SMTP anahtarıdır.' },
  mailjet: { ad: 'Mailjet', sunucu: 'in-v3.mailjet.com',     port: 587, guvenli: false, not: 'Kullanıcı = API Key, şifre = Secret Key.' },
  smtp2go: { ad: 'SMTP2GO', sunucu: 'mail.smtp2go.com',      port: 587, guvenli: false, not: 'Panelden SMTP kullanıcısı oluştur.' }
};

module.exports = { gonder, basligiKodla, SAGLAYICILAR };
