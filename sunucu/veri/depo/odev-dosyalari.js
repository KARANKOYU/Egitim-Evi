'use strict';
/* Ödev teslim dosyalarının bilgisi (dosyanın kendisi diskte). */

const { sorgu, tek, calistir, islem } = require('../baglanti');

const ALANLAR = 'SELECT d.id, d.odev_id, d.ogrenci_id, d.ad, d.boyut, d.crc32, d.sha256, d.yuklenme ';

/* Teslim dosyasının silinme anı (033). Ödevden hesaplanır, saklanmaz: son
   teslim ileri alınınca ya da ödev yeniden açılınca kendiliğinden değişir.
     - son teslimi olan ödevde: son teslim + 7 gün,
     - son teslimi yoksa: sonuçlandırıldıysa sonuçlanma + 7 gün,
       hiç sonuçlandırılmadıysa yüklemeden 60 gün sonra.
   Hiçbir zaman ödevin dosya_saklama anından (034) önce değil: son teslim
   değiştirilince, kaldırılınca ya da ödev yeniden açılınca "şimdi + 7 gün"
   olur; yanlışlıkla geçmişe yazılan son teslim dosyaları hemen sildirmez.
   (GREATEST boş değeri yok sayar: dosya_saklama boşsa hesaptaki an geçer.)
   Son teslim (bitis + bitis_saati) sunucunun yerel saatiyle yazılır (odev.js
   odevBitisAni): $1 sunucunun UTC'ye göre farkıdır (dakika; sunucu Türkiye
   saatinde çalışmalı, SUNUCUYA-KURULUM TZ=Europe/Istanbul). Bu parça hangi
   sorguda kullanılırsa $1 orada bu farktır. */
const SILINME =
  "GREATEST(CASE WHEN o.bitis IS NOT NULL " +
  "THEN (o.bitis + o.bitis_saati) AT TIME ZONE 'UTC' - make_interval(mins => $1::int) + interval '7 days' " +
  "WHEN o.durum = 'finished' AND o.sonuclanma IS NOT NULL THEN o.sonuclanma + interval '7 days' " +
  "ELSE d.yuklenme + interval '60 days' END, o.dosya_saklama)";

/* Sunucunun yerel saatinin UTC'den farkı (dakika; Türkiye'de 180). */
const yerelFark = () => -new Date().getTimezoneOffset();

const bul = id => tek(ALANLAR + 'FROM odev_dosyalari d WHERE d.id = $1', [id]);

/* Bir ödevin dosyaları, silinme anlarıyla; ogrenciId verilirse yalnızca onunkiler. */
const odevin = (odevId, ogrenciId) => sorgu(
  ALANLAR + ', k.ad_soyad AS ogrenci_adi, ' + SILINME + ' AS silinme ' +
  'FROM odev_dosyalari d JOIN odevler o ON o.id = d.odev_id JOIN kullanicilar k ON k.id = d.ogrenci_id ' +
  "WHERE d.odev_id = $2 AND ($3 = '' OR d.ogrenci_id = $3) ORDER BY k.ad_soyad, d.yuklenme",
  [yerelFark(), odevId, ogrenciId || '']);

/* Okulun diskte tuttuğu toplam (okul kotası için). */
async function okulToplami(okulId) {
  return (await tek('SELECT COALESCE(sum(d.boyut), 0)::bigint AS n FROM odev_dosyalari d ' +
    'JOIN odevler o ON o.id = d.odev_id WHERE o.okul_id = $1', [okulId])).n;
}

/* Dosya kaydı: öğrencinin ödev satırı kilitlenir, dosya sayısı ve toplam
   boyut aynı işlemde denetlenir (aynı anda gelen iki yükleme sınırı aşamaz).
   Dönen: 'tamam' | 'yok' (öğrenci ödevde değil) | 'sayi' | 'boyut' */
async function ekle(d, sinir) {
  return islem(async () => {
    const satir = await tek('SELECT 1 AS var FROM odev_ogrencileri WHERE odev_id = $1 AND ogrenci_id = $2 FOR UPDATE',
      [d.odevId, d.ogrenciId]);
    if (!satir) return 'yok';
    const t = await tek('SELECT count(*)::int AS adet, COALESCE(sum(boyut), 0)::bigint AS toplam FROM odev_dosyalari ' +
      'WHERE odev_id = $1 AND ogrenci_id = $2', [d.odevId, d.ogrenciId]);
    if (t.adet >= sinir.adet) return 'sayi';
    if (Number(t.toplam) + d.boyut > sinir.toplam) return 'boyut';
    await calistir('INSERT INTO odev_dosyalari (id, odev_id, ogrenci_id, ad, boyut, crc32, sha256) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [d.id, d.odevId, d.ogrenciId, d.ad, d.boyut, d.crc32, d.sha256]);
    return 'tamam';
  });
}

const sil = id => calistir('DELETE FROM odev_dosyalari WHERE id = $1', [id]);

/* Diskteki dosyalardan hangileri hâlâ kayıtlı (artık temizliği için). */
async function kayitlilar(idler) {
  if (!idler.length) return new Set();
  return new Set((await sorgu('SELECT id FROM odev_dosyalari WHERE id = ANY($1::text[])', [idler])).map(r => r.id));
}

/* Silinme anı gelen teslim dosyalarının kaydı silinir (SILINME); dönen
   kimliklerin dosyasını çağıran siler. */
async function eskileriSil() {
  return (await sorgu('DELETE FROM odev_dosyalari d USING odevler o WHERE o.id = d.odev_id AND ' + SILINME + ' <= now() ' +
    'RETURNING d.id', [yerelFark()])).map(r => r.id);
}

/* Okulun dosya alanı uyarısı (033): bu seviyedeki (80 ya da 100) uyarı daha
   önce verilmediyse yazar ve true döner; verildiyse false (bildirim bir kez gider).
   Aynı anda gelen iki yükleme ikisi birden bildirim göndermez. */
async function uyariYaz(okulId, seviye) {
  return !!(await tek('INSERT INTO okul_dosya_uyarilari (okul_id, seviye) VALUES ($1, $2) ' +
    'ON CONFLICT (okul_id) DO UPDATE SET seviye = EXCLUDED.seviye, zaman = now() ' +
    'WHERE okul_dosya_uyarilari.seviye < EXCLUDED.seviye RETURNING okul_id', [okulId, seviye]));
}

/* Kullanımı sinirin (bayt) altına inen okulların uyarısı silinir: alan yeniden
   dolarsa uyarı yeniden gider. */
async function uyarilariSifirla(sinir) {
  await calistir('DELETE FROM okul_dosya_uyarilari u WHERE (SELECT COALESCE(sum(d.boyut), 0) FROM odev_dosyalari d ' +
    'JOIN odevler o ON o.id = d.odev_id WHERE o.okul_id = u.okul_id) < $1', [sinir]);
}

module.exports = { bul, odevin, okulToplami, ekle, sil, kayitlilar, eskileriSil, uyariYaz, uyarilariSifirla };
