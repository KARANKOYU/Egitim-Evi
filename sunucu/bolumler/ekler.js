'use strict';
/* Ekler (/api/ek): mesaja ve öğretmenin verdiği ödeve eklenen dosyalar.

     POST /api/ek/yukle?tur=mesaj|odev   gövde: dosyanın kendisi (başlık: X-Dosya-Adi)
                                         -> taslak ek; yalnızca yükleyen görür
     POST /api/ek/sil       { id }       taslağı (ya da gönderenin kendi ekini) siler
     GET  /api/ek/bilet?id               indirme bileti (yetki burada denetlenir)
     GET  /api/ek/indir?bilet            dosyanın kendisi, "ek" olarak iner

   Bağlama: mesaj gönderilirken (POST /api/mesajlar { ekIdler }) ve ödev
   verilirken ya da düzeltilirken (POST /api/assignments { ekIdler },
   .../update { ekIdler, ekSilIdler }) — ekleriDogrula / ekleriBagla.

   Kurallar: bir mesajın ya da ödevin ekleri toplam 150 MB; dosya 7 gün sonra
   diskten silinir (mesaj ve ödev kalır, "süresi doldu" yazar). Güvenlik
   ödev teslim dosyalarıyla aynı (odev-dosya.js): izinli uzantılar, rastgele
   dosya adı, akışla diske yazma, "ek" olarak indirme (tarayıcı açmaz),
   boş yer ve aynı anda yükleme sınırı. */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { hizSinir } = require('../guvenlik');
const { bad, ok } = require('../http');
const { clean } = require('../ortak');
const { depo } = require('../veri');
const { DATA } = require('../yollar');
const { yetkiVarMi } = require('../yetki');
const { akisiYaz, reddet, ekBasliklari, dosyaAdi, uzanti, UZANTILAR, biletVer, biletKullan } = require('./odev-dosya');

const KLASOR = path.join(DATA, 'ekler');
const MB = 1024 * 1024;
const EK_SINIR = 150 * MB;                 // bir mesajın ya da ödevin eklerinin toplamı
const EN_FAZLA_EK = 20;                    // bir mesaja/ödeve en fazla dosya
const BOS_YER_PAYI = 2 * 1024 * MB;
const AYNI_ANDA_KISI = 3, AYNI_ANDA_TOPLAM = 60;

