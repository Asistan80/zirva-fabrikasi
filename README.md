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

## v5: Sisli Pınar Köyü genişledi
- Yeni: kendi evin (güneyde mavi çatılı ev: yatak, semaver, koleksiyon rafı, satın alınabilir dekorlar), Bakkal Şükrü (alışveriş, altın), balık tutma, define kazma, mantar toplama, 4 yan görev + gece bilmecesi, yağmur/gök gürültüsü, pınar uyanınca şenlik + havai fişek, fotoğraf modu (F).
- Düzeltmeler: banklar kayalardan arındırıldı, NPC'ler gece evlerine takılmadan dönüyor, kamera binaların içine girmiyor.
- Statik kopya (Nova/Derin Murnova Dünyası) için `window.KOY_API` boş bırakılırsa yapay zekâ kapalı, hazır diyaloglar çalışır. Zırva servis adresini yazarsan (CORS açık) o sürümde de yapay zekâ çalışır.

## v6 — 13 yeni bulmaca + link önizleme

**Yeni oyunlar (toplam 19):** Kelime Avı, Passaparola, Adam Asmaca, Harf Karıştır, Bağlantı, Doğru mu Zırva mı (`static/puzzles2.js`); Mayın Tarlası, 2048, Mini Sudoku, Işıklar Sönsün, Sayı Dizisi, Çarpım Hızı, Renk Dizisi (`static/puzzles3.js`). Oyunlar `window.PZX` kaydına eklenir, meta bilgisi `puzzledata.py` içindedir (`cat` alanı: kelime/sayi/mantik/refleks). Merkez sayfada kategori filtresi vardır. Yeni rozetler: Çok Yönlü, Kelime Avcısı, Parola Ustası.

**Yeni oyun eklemek:** `puzzles*.js` içinde `(root, ctx, A)` fonksiyonu yaz → `window.PZX` içine ekle → `puzzledata.py` içine kayıt ekle → `python3 tools/make_og.py`.

**Link önizleme:** `base.html` Open Graph + Twitter Card etiketleri basar. Görseller `static/og/*.jpg` (1200x630), `python3 tools/make_og.py` ile üretilir (Playwright gerekir). Sayfa şablonları `{% block ogimg %}` ile kendi kartını seçer. Render arkasında doğru https adresi için ProxyFix eklendi.

Test için tarayıcı konsolunda `window.__pzctx.auto()` oyunu otomatik bitirir.

### v6.1
- **Günün oyunu:** hub'da öne çıkan banner, bu oyunda günlük ilk çözüm +%50 XP. Otomatik seçilir (İstanbul tarihine göre), admin panelinden sabitlenebilir (`featured_game`).
- **Meydan okuma linki:** sonucu paylaşınca link `?m=...` ile gider; arkadaşın sayfayı açınca "aynı bulmaca, sen de dene" bandı görür (metin güvenli şekilde gösterilir).
- Admin panelinde oyun açıp kapama zaten tüm 19 oyunu kapsar.

### v6.2
- **Düzeltmeler:** Mayın, Işıklar, 2048 ve Renk Dizisi tahtaları çökmüştü (genişlik 0), düzeltildi. Passaparola artık 28 harfin tamamı ile, 270 sn, 14+ doğru kazandırır (rozet: 22+).
- **12 yeni oyun (toplam 31):** Sesli Harf Kaçtı, Atasözü Tamamla, Hangisi Farklı, Başkent Bilmece, Renk Şaşırtmaca (Stroop), Hanoi Kulesi, Nonogram, Boya Taşması, Dört Gelsin (bilgisayara karşı), Köstebek Avı, Yılan, Su Sıralama (`static/puzzles4.js`).
- Merkez sayfada arama kutusu ve "Bana rastgele oyun" düğmesi.
