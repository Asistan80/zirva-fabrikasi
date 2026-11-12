import os, time, random, threading
from collections import defaultdict
import requests
from flask import Flask, render_template, request, jsonify, abort
from testdata import TESTS

app = Flask(__name__)

API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
MODEL = os.environ.get("ZIRVA_MODEL", "claude-haiku-5-5")
DAILY_LIMIT = int(os.environ.get("DAILY_LIMIT", "8"))
SITE_NAME = "Zırva Fabrikası"

_hits = defaultdict(list)
_lock = threading.Lock()

def client_ip():
    xff = request.headers.get("X-Forwarded-For", "")
    return (xff.split(",")[0].strip() if xff else request.remote_addr) or "?"

def check_limit(ip):
    now = time.time()
    with _lock:
        _hits[ip] = [t for t in _hits[ip] if now - t < 86400]
        if len(_hits[ip]) >= DAILY_LIMIT:
            return False, 0
        _hits[ip].append(now)
        return True, DAILY_LIMIT - len(_hits[ip])

KIME = ["patronuma", "eşime/sevgilime", "öğretmenime", "arkadaşıma", "ev sahibime", "anneme", "komşuma"]
NE = ["geç kaldım", "toplantıya gelemedim", "ödevi yapamadım", "sözümü tutamadım", "mesaja cevap veremedim", "davete gelemedim"]
TONLAR = {"inandirici": "inandırıcı ve gündelik", "absurt": "tamamen absürt ve abartılı", "dramatik": "aşırı dramatik, film sahnesi gibi", "bilimsel": "uydurma bilimsel terimlerle ciddi görünen"}

# Anahtar yokken veya limit/API hatasında çalışan yedek üretici
OFFLINE = {
 "inandirici": ["Yolda kaza vardı, trafik tamamen durdu, telefonum da şarjsızdı.", "Alarm çalmamış, uyandığımda da sabah olmuştu.", "Anahtarı içeride unutup kapı dışarıda kaldım, çilingir bekledim."],
 "absurt": ["Kapıdan çıkarken kedim bana 'bugün gitme' diye baktı, ben de çıkamadım.", "Asansörde bir kuş ailesiyle mahsur kaldım, hepsini yuvaya götürmem gerekti.", "Pantolonumun cebinde bir portal açıldı, yarım saat çıkış aradım."],
 "dramatik": ["O sabah güneş doğmadan önce hayatın anlamını sorguladım ve zaman benden kayıp gitti.", "Sokağın ucunda bir martı bana baktı ve her şey değişti.", "Hayat bazen bir otobüs durağında seni durdurur, ben de durdum."],
 "bilimsel": ["Sirkadiyen ritmim bu sabah galaktik bir kaymaya uğradı, bu bilimsel olarak kanıtlanmıştır.", "Kuantum belirsizliği yüzünden ben iki yerde birden olamadım, bu yüzden hiçbirinde olamadım.", "Hava basıncındaki ani dalgalanma nedeniyle motivasyon enzimlerim geç aktifleşti."],
}

def offline_excuse(kime, ne, ton):
    base = random.choice(OFFLINE.get(ton, OFFLINE["inandirici"]))
    return f"{base} Bu yüzden {ne}, lütfen anlayışla karşıla."

def ai_excuse(kime, ne, ton):
    tone_desc = TONLAR.get(ton, TONLAR["inandirici"])
    prompt = (f"Mizahi bir site için bir mazeret yaz. Kime: {kime}. Ne oldu: {ne}. Ton: {tone_desc}. "
              "Türkçe, 2-3 cümle, sadece mazeret metni, tırnak ve açıklama ekleme. Zararsız, kimseyi aşağılamayan, komik olsun.")
    r = requests.post("https://api.anthropic.com/v1/messages",
        headers={"x-api-key": API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json"},
        json={"model": MODEL, "max_tokens": 250, "messages": [{"role": "user", "content": prompt}]}, timeout=20)
    r.raise_for_status()
    return r.json()["content"][0]["text"].strip()

@app.route("/")
def index():
    return render_template("index.html", tests=TESTS, name=SITE_NAME)

@app.route("/mazeret")
def mazeret():
    return render_template("mazeret.html", kime=KIME, ne=NE, tonlar=TONLAR, limit=DAILY_LIMIT, name=SITE_NAME, ai=bool(API_KEY))

@app.route("/api/mazeret", methods=["POST"])
def api_mazeret():
    d = request.get_json(silent=True) or {}
    kime = str(d.get("kime", ""))[:60] or KIME[0]
    ne = str(d.get("ne", ""))[:80] or NE[0]
    ton = d.get("ton", "inandirici")
    if ton not in TONLAR: ton = "inandirici"
    ok, left = check_limit(client_ip())
    if not ok:
        return jsonify(text=offline_excuse(kime, ne, ton), mode="offline", left=0,
                       note="Günlük yapay zekâ hakkın doldu, yedek fabrika devrede. Yarın tekrar gel!")
    if API_KEY:
        try:
            return jsonify(text=ai_excuse(kime, ne, ton), mode="ai", left=left)
        except Exception:
            pass
    return jsonify(text=offline_excuse(kime, ne, ton), mode="offline", left=left)

@app.route("/test/<slug>")
def test_page(slug):
    t = TESTS.get(slug) or abort(404)
    return render_template("test.html", t=t, slug=slug, name=SITE_NAME)

@app.route("/api/test/<slug>", methods=["POST"])
def test_result(slug):
    t = TESTS.get(slug) or abort(404)
    answers = (request.get_json(silent=True) or {}).get("answers", [])
    score = defaultdict(int)
    for qi, ai in enumerate(answers[:len(t["questions"])]):
        try:
            score[t["questions"][qi][1][int(ai)][1]] += 1
        except (IndexError, ValueError, TypeError):
            pass
    if not score:
        abort(400)
    key = max(score, key=lambda k: (score[k], random.random()))
    title, text = t["results"][key]
    return jsonify(key=key, title=title, text=text, test=t["title"], emoji=t["emoji"])

@app.errorhandler(404)
def nf(e):
    return render_template("404.html", name=SITE_NAME), 404

@app.route("/healthz")
def healthz():
    return "ok"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5070)), debug=True)
