# Zırva Fabrikası v2

Flask sitesi: Mazeret Fabrikası, 8 Saçma Test, Burç Parodisi, Kızartma Odası, Günün Mazereti, yönetim paneli.

## Render ortam değişkenleri
- ANTHROPIC_API_KEY : Claude API anahtarı (yoksa yedek üreticiler çalışır)
- ADMIN_PASSWORD    : /admin paneli şifresi (yoksa panel kapalı)
- SECRET_KEY        : oturum anahtarı (render.yaml otomatik üretir)
- DAILY_LIMIT       : kişi başı günlük yapay zekâ hakkı (panelden de değişir)
- DATA_DIR          : (isteğe bağlı) ayar/istatistik klasörü

Not: Render ücretsiz planda disk uyku/deploy sonrası sıfırlanabilir. Panelden "Yedek indir" ile ayarları ve istatistikleri sakla,
"Yedek yükle" ile geri getir. Panelde yaptığın ayarlar deploy sonrası silinirse yedekten geri yüklenir.
Start: gunicorn app:app --workers 1 --threads 4
