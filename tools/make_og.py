"""Link önizleme (Open Graph) kartlarını üretir: python3 tools/make_og.py  -> static/og/*.jpg (1200x630)
Yeni oyun/test eklenince yeniden çalıştır. Playwright + Chromium gerekir."""
import os, sys, html
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from puzzledata import GAMES
from testdata import TESTS
from playwright.sync_api import sync_playwright
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "og")
os.makedirs(OUT, exist_ok=True)
cards = {
 "default": ("🏭", "Zırva Fabrikası", "Mazeret üret, saçma testler çöz, burç parodini oku, günlük bulmaca oyna.", ("#a56bff", "#ff5c7a"), "zirva fabrikası"),
 "mazeret": ("🎭", "Mazeret Fabrikası", "Her duruma uygun, inandırıcılığı ölçülmüş mazeretler üret.", ("#ff7a59", "#ff5c7a"), "mazeret"),
 "testler": ("🧪", "Saçma Testler", "Bilimsel hiçbir dayanağı olmayan ama çok eğlenceli testler.", ("#f6a623", "#ff5c7a"), "testler"),
 "burc": ("🔮", "Burç Parodisi", "Bugün yıldızlar ne diyor? Hiçbir şey, ama komik.", ("#6d5dfc", "#c13584"), "burç"),
 "kizartma": ("🔥", "Kızartma Odası", "Yapay zekâ seni nazikçe kızartsın.", ("#ef4444", "#f59e0b"), "kızartma"),
 "bulmaca": ("🎮", "Günlük Bulmaca", f"{len(GAMES)} farklı oyun: kelime avı, passaparola, sudoku, 2048 ve daha fazlası.", ("#34d399", "#4c8dff"), "bulmaca"),
 "koy": ("🏡", "Sisli Pınar Köyü", "Tarayıcıda oynanan 3D köy macerası: balık tut, kazı yap, görevleri çöz.", ("#10b981", "#0ea5e9"), "oyun"),
}
for k, g in GAMES.items(): cards["g-" + k] = (g["emoji"], g["title"], g["desc"], g["grad"], "günlük bulmaca")
for k, t in TESTS.items(): cards["t-" + k] = (t["emoji"], t["title"], t["desc"], t["grad"], "saçma test")
TPL = """<html><body style="margin:0;width:1200px;height:630px;font-family:'DejaVu Sans','Noto Sans',sans-serif;color:#fff;background:linear-gradient(135deg,{a},{b});position:relative;overflow:hidden">
<div style="position:absolute;right:-40px;bottom:-110px;font-size:520px;opacity:.2;transform:rotate(-12deg)">{e}</div>
<div style="position:absolute;inset:0;background:radial-gradient(circle at 20% 15%,#ffffff33,transparent 45%)"></div>
<div style="position:absolute;left:70px;top:60px;font-size:30px;font-weight:700;background:#00000040;padding:10px 22px;border-radius:99px">🏭 Zırva Fabrikası · {tag}</div>
<div style="position:absolute;left:70px;top:190px;width:900px"><div style="font-size:120px;line-height:1">{e}</div>
<div style="font-size:78px;font-weight:800;line-height:1.1;margin-top:18px;text-shadow:0 4px 20px #0005">{t}</div>
<div style="font-size:36px;margin-top:20px;opacity:.95;line-height:1.3">{d}</div></div></body></html>"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1200, "height": 630})
    for k, (e, t, d, g, tag) in cards.items():
        pg.set_content(TPL.format(a=g[0], b=g[1], e=e, t=html.escape(t), d=html.escape(d), tag=html.escape(tag))); pg.screenshot(path=f"{OUT}/{k}.jpg", type="jpeg", quality=82)
    b.close()
print(len(cards), "kart üretildi ->", OUT)
