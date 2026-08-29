#!/bin/bash
# Tum test paketlerini calistirir:  bash testler/tumtest.sh
# Her paketten once sunucuyu yeniden baslatiriz: hiz siniri ve kaba kuvvet
# kilidi bellekte tutuluyor, arka arkaya calisan paketler birbirini kilitliyordu.

SP="$(cd "$(dirname "$0")" && pwd)"          # bu klasör (testler/)
PROJE="$(cd "$SP/.." && pwd)"                 # proje kökü
PORT=3200

sunucu_durdur() {
  local pid
  pid=$(netstat -ano | grep ":$PORT" | grep LISTENING | head -1 | awk '{print $NF}')
  if [ -n "$pid" ]; then taskkill //F //PID "$pid" >/dev/null 2>&1; fi
  sleep 1
}

# Her paket boş bir test veritabanıyla başlar (EE_DB_SIFIRLA=1). Sıfırlama
# yalnızca adı _test ile biten veritabanında çalışır; gerçek veri korunur.
sunucu_baslat() {
  cd "$PROJE" || exit 1
  (EE_DATA="$SP/testdata" EE_DB_SIFIRLA=1 EE_ADMIN_SIFRE=admin123 EE_PUSH_GONDERME=0 PORT=$PORT node server.js > "$SP/test-sunucu.log" 2>&1 &)
  # Şema kurulana kadar bekle (en fazla 20 sn).
  for i in $(seq 1 40); do
    if curl -s -o /dev/null "http://localhost:$PORT/api/meta"; then return 0; fi
    sleep 0.5
  done
  echo "  SUNUCU ACILMADI:"; tail -5 "$SP/test-sunucu.log"
}

TOPLAM_GECTI=0
TOPLAM_KALDI=0

echo ""
echo "==================== TESTLER ===================="

# Sunucu gerektirmeyen paketler: xlsx motoru, telefon bildirimi şifrelemesi, yorum atıcı
for paket in test-xlsx test-push test-kucult test-hatirlatici-zaman; do
  echo ""
  echo "--- $paket (sunucusuz) ---"
  cikti=$(node "$SP/$paket.js" 2>&1)
  echo "$cikti" | grep -E "KALDI |HATASI" | head -5
  ozet=$(echo "$cikti" | grep -E "GECTI: [0-9]+" | tail -1)
  if [ -z "$ozet" ]; then
    echo "  PAKET CALISMADI:"
    echo "$cikti" | tail -6 | sed 's/^/    /'
    TOPLAM_KALDI=$((TOPLAM_KALDI + 1))
    continue
  fi
  echo "  $ozet"
  g=$(echo "$ozet" | awk '{for(i=1;i<=NF;i++) if($i=="GECTI:") print $(i+1)}')
  k=$(echo "$ozet" | awk '{for(i=1;i<=NF;i++) if($i=="KALDI:") print $(i+1)}')
  TOPLAM_GECTI=$((TOPLAM_GECTI + ${g:-0}))
  TOPLAM_KALDI=$((TOPLAM_KALDI + ${k:-0}))
done

for paket in test-yonetim test-program test-rol test-kapsam test-yedek test-aktarim test-sifre test-mesaj test-devamsizlik test-takvim test-odev-saat test-egitim-yili test-sinav test-bildirim test-giris-kayit test-veli-coklu test-giris-bilgisi test-anket test-okul-hayati test-servis-konum test-yetiskin test-etut test-okul-sayfasi test-yorum-ek test-nakil test-ozellikler test-hatirlatici test-siniflarim test-aile test-odev-dosya guvenlik-test; do
  sunucu_durdur
  rm -rf "$SP/testdata"
  mkdir -p "$SP/testdata"
  # Okul listesi EE_DATA altinda aranir; testlerde de bulunsun.
  cp "$PROJE/data/okullar.json" "$SP/testdata/" 2>/dev/null
  # Veritabanı bağlantısı: gerçek ayardan, test veritabanı adıyla.
  node "$SP/test-ayarlari.js" "$SP/testdata" || exit 1
  sunucu_baslat

  EE_BASE="http://localhost:$PORT" EE_LOG="$SP/test-sunucu.log" node "$SP/seed.js" >/dev/null 2>&1
  if [ $? -ne 0 ]; then
    echo ""
    echo "--- $paket ---"
    echo "  SEED BASARISIZ"
    TOPLAM_KALDI=$((TOPLAM_KALDI + 1))
    continue
  fi

  echo ""
  echo "--- $paket ---"
  cikti=$(EE_BASE="http://localhost:$PORT" EE_LOG="$SP/test-sunucu.log" node "$SP/$paket.js" 2>&1)
  echo "$cikti" | grep -E "KALDI|HATASI" | head -8
  ozet=$(echo "$cikti" | grep -E "GECTI: [0-9]+" | tail -1)
  if [ -z "$ozet" ]; then
    # Paket hiç bitmedi (sözdizimi hatası, çökme): sessizce 0 sayılmasın.
    echo "  PAKET CALISMADI:"
    echo "$cikti" | tail -6 | sed 's/^/    /'
    TOPLAM_KALDI=$((TOPLAM_KALDI + 1))
    continue
  fi
  echo "  $ozet"

  g=$(echo "$ozet" | sed -n 's/.*GECTI: \([0-9]*\).*/\1/p')
  k=$(echo "$ozet" | sed -n 's/.*KALDI: \([0-9]*\).*/\1/p')
  TOPLAM_GECTI=$((TOPLAM_GECTI + ${g:-0}))
  TOPLAM_KALDI=$((TOPLAM_KALDI + ${k:-0}))
done

# ---------------- denetimler ----------------
# Yetki: her uç her rolle denenir, yetkisiz geçen var mı.
# Girdi: bozuk ve kötü niyetli veriyle 500 ya da sızıntı var mı.
DENETIM_SORUN=0
for denetim in yetki-denetimi girdi-denetimi; do
  sunucu_durdur
  rm -rf "$SP/testdata"; mkdir -p "$SP/testdata"
  cp "$PROJE/data/okullar.json" "$SP/testdata/" 2>/dev/null
  node "$SP/test-ayarlari.js" "$SP/testdata" || exit 1
  sunucu_baslat
  EE_BASE="http://localhost:$PORT" EE_LOG="$SP/test-sunucu.log" node "$SP/seed.js" >/dev/null 2>&1
  echo ""
  echo "--- $denetim ---"
  cikti=$(EE_BASE="http://localhost:$PORT" EE_LOG="$SP/test-sunucu.log" node "$SP/$denetim.js" 2>&1)
  echo "$cikti" | grep -E "GUVENLIK ACIGI|acik bulundu|KALDI|GECTI:" | head -6
  if echo "$cikti" | grep -qE "GUVENLIK ACIGI \(|KALDI  "; then DENETIM_SORUN=$((DENETIM_SORUN + 1)); fi
  # Denetim sırasında sunucu 500 vermemeli.
  if grep -q "API hatası\|Veritabanı hatası" "$SP/test-sunucu.log"; then
    echo "  SUNUCU HATASI:"; grep "API hatası\|Veritabanı hatası" "$SP/test-sunucu.log" | head -3
    DENETIM_SORUN=$((DENETIM_SORUN + 1))
  fi
done

sunucu_durdur

# Sunucusuz denetimler: arayüz düğmeleri, yazım, SQL.
for denetim in buton-denetimi yazim-denetimi sql-denetimi; do
  echo ""
  echo "--- $denetim ---"
  cikti=$(node "$SP/$denetim.js" 2>&1)
  kod=$?
  echo "$cikti" | tail -2
  if [ $kod -ne 0 ] || echo "$cikti" | grep -qE "SORUN BULUNDU|[1-9][0-9]* yazim hatasi"; then
    DENETIM_SORUN=$((DENETIM_SORUN + 1))
  fi
done

echo ""
echo "================================================="
echo "  TOPLAM  GECTI: $TOPLAM_GECTI   KALDI: $TOPLAM_KALDI"
echo "  DENETIM SORUNU: $DENETIM_SORUN"
echo "================================================="
echo ""
