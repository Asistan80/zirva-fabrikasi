# Zırva Fabrikası v3

Flask sitesi: Mazeret Fabrikası, 8 Saçma Test, Burç Parodisi, Kızartma Odası, Günün Mazereti, Günlük Bulmaca (6 oyun), yönetim paneli.

Bulmacalar tamamen tarayıcıda çalışır (sunucu/API maliyeti yok). İlerleme (XP, seri, rozet) oyuncunun tarayıcısında saklanır; günlük bulmaca İstanbul saatine göre her gece yenilenir.

## Render ortam değişkenleri
- ANTHROPIC_API_KEY : Claude API anahtarı (yoksa yedek üreticiler çalışır)
- ADMIN_PASSWORD    : /admin paneli şifresi (yoksa panel kapalı)
- SECRET_KEY        : oturum anahtarı (render.yaml otomatik üretir)
- DAILY_LIMIT       : kişi başı günlük yapay zekâ hakkı (panelden de değişir)
- DATA_DIR          : (isteğe bağlı) ayar/istatistik klasörü

Not: Render ücretsiz planda disk uyku/deploy sonrası sıfırlanabilir. Panelden "Yedek indir" ile ayarları ve istatistikleri sakla,
"Yedek yükle" ile geri getir. Panelde yaptığın ayarlar deploy sonrası silinirse yedekten geri yüklenir.
Start: gunicorn app:app --workers 1 --threads 4

## v4: 🏘️ Sisli Pınar Köyü (3D oyun, `/koy`)
- Tarayıcıda Three.js (yerel kopya `static/vendor/`), ek kurulum yok. Kod: `static/koy/` (main, world, chars, data, audio), şablon `templates/koy.html`.
- Yapay zekâ sohbeti: `/api/koy/chat` (ANTHROPIC_API_KEY varsa). Anahtar yoksa, limit dolarsa ya da hata olursa oyun hazır diyaloglara geçer; görevler hiçbir zaman yapay zekâya bağlı değildir.
- Admin panelinde: köyü aç/kapat, köy yapay zekâsı aç/kapat, kişi başı günlük sohbet hakkı (`koy_limit`, varsayılan 40).
- Kayıt tarayıcıda (`localStorage: koy_save_v1`). Duraklat menüsünden kalite ve ses ayarlanır.
- Oyun akışı: Muhtar → 4 görev (Zehra buğday, Hacer sayfa, Cemal çark, Kemal koyun Pamuk) → 4 damla → geceleyin pınar → final. Mırmır (gece, simit) ve Ağaç Dede (gece) yan karakterler.
