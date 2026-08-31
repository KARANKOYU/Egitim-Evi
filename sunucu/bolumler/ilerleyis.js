'use strict';
/* Öğrencinin ilerleyişi: ödev sonuçları ve sınavlar.
   Öğrenci kendi, veli çocuğunun, öğretmen ve müdür öğrencinin ilerleyişini görür. */

const { bad, ok } = require('../http');
const { GUN_ADLARI, GUN_SAYISI, canSeeStudent } = require('../iliskiler');
const { RESULT_TYPES, clean } = require('../ortak');
const { depo } = require('../veri');
const { yilSuz, bakisKisisi } = require('./egitim-yili');
const { odevBitisAni, odevSaati } = require('./odev');
const { ekGorunumu } = require('./ekler');

