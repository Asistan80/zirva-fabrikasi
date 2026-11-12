"""Ayarlar ve istatistikler: basit, kilitli, atomik JSON dosyası.
Not: Render ücretsiz planında disk deploy/uyku sonrası silinebilir; admin panelinden yedek indirilebilir."""
import json, os, threading, tempfile, datetime

DATA_DIR = os.environ.get("DATA_DIR", os.path.join(os.path.dirname(os.path.abspath(__file__)), "data"))
_lock = threading.RLock()

DEFAULT_SETTINGS = {
    "site_title": "Zırva Fabrikası",
    "tagline": "Mazeretini üretiriz, kişiliğini saçma şekilde analiz ederiz.",
    "announcement": "",
    "announcement_on": False,
    "ai_enabled": True,
    "daily_limit": int(os.environ.get("DAILY_LIMIT", "8")),
    "mazeret_on": True,
    "roast_on": True,
    "burc_on": True,
    "hidden_tests": [],
    "extra_excuses": {"inandirici": [], "absurt": [], "dramatik": [], "bilimsel": []},
    "extra_roasts": [],
}

def _path(name):
    return os.path.join(DATA_DIR, name + ".json")

def _read(name, default):
    try:
        with open(_path(name), encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default

def _write(name, obj):
    os.makedirs(DATA_DIR, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=DATA_DIR, suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=1)
        os.replace(tmp, _path(name))
    except Exception:
        try: os.unlink(tmp)
        except Exception: pass

def get_settings():
    with _lock:
        s = dict(DEFAULT_SETTINGS)
        s["extra_excuses"] = {k: [] for k in DEFAULT_SETTINGS["extra_excuses"]}
        saved = _read("settings", {})
        for k, v in saved.items():
            if k in s:
                s[k] = v
        return s

def save_settings(new):
    with _lock:
        cur = get_settings()
        cur.update(new)
        _write("settings", cur)
        return cur

def get_stats():
    with _lock:
        st = _read("stats", {})
        st.setdefault("mazeret", {"total": 0, "ai": 0, "offline": 0})
        st.setdefault("roast", {"total": 0, "ai": 0, "offline": 0})
        st.setdefault("burc", {"total": 0})
        st.setdefault("tests", {})
        st.setdefault("daily", {})
        st.setdefault("since", datetime.date.today().isoformat())
        return st

def bump(*path, by=1):
    """bump('mazeret','total') gibi; bugünkü günlük sayaç da artar."""
    with _lock:
        st = get_stats()
        d = st
        for p in path[:-1]:
            d = d.setdefault(p, {})
        d[path[-1]] = d.get(path[-1], 0) + by
        day = datetime.date.today().isoformat()
        dd = st["daily"].setdefault(day, {"mazeret": 0, "roast": 0, "burc": 0, "test": 0})
        key = path[0] if path[0] in ("mazeret", "roast", "burc") else ("test" if path[0] == "tests" and path[-1] == "done" else None)
        if key and path[-1] in ("total", "done"):
            dd[key] = dd.get(key, 0) + by
        if len(st["daily"]) > 60:
            for old in sorted(st["daily"])[:-60]:
                st["daily"].pop(old, None)
        _write("stats", st)

def reset_stats():
    with _lock:
        _write("stats", {})

def backup_blob():
    with _lock:
        return {"settings": get_settings(), "stats": get_stats()}

def restore_blob(blob):
    with _lock:
        if isinstance(blob.get("settings"), dict):
            _write("settings", {k: v for k, v in blob["settings"].items() if k in DEFAULT_SETTINGS})
        if isinstance(blob.get("stats"), dict):
            _write("stats", blob["stats"])
