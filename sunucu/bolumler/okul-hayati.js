'use strict';
/* Okul hayatı: yemek listesi (/api/yemek), servisler (/api/servis),
   kulüpler (/api/kulupler).

   Görme kuralları:
     yemek   — okuldaki herkes; veli (ve çocuğu olan öğretmen) çocuğunun okulunu
     servis  — yönetim bütün servisleri; öğrenci kendi servisini; veli
               yalnızca çocuğunun servisini (şoför telefonu dahil) görür
     kulüp   — okuldaki herkes kulüp listesini; üye listesini yalnızca yönetim
               ve kulübün danışman öğretmeni; veli çocuğunun kulüplerini
   Düzenleme müdüre ve ilgili yetkisi verilmiş öğretmene açık. */

const { hizSinir } = require('../guvenlik');
const { bad, ok } = require('../http');
const { saatDuzelt } = require('../iliskiler');
const { clean, normTelefon, telefonSorunu, uid } = require('../ortak');
const { depo, cokluBildirim } = require('../veri');
const { yetkiVarMi } = require('../yetki');
const { islemYaz } = require('./islem-kaydi');

