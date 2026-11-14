/* Zırva Bulmaca motoru: günlük tohumlu bulmacalar, XP/seri/rozet, 6 oyun. app.js'nin $, $$, LS, toast, confetti, saveCard fonksiyonlarını kullanır. */
(function () {
const TZ = "Europe/Istanbul";
const todayKey = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
const hash = s => { let h = 1779033703 ^ s.length; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return (h ^ h >>> 16) >>> 0; };
const rng = seed => { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const shuffle = (arr, r) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const trDate = k => { const [y, m, d] = k.split("-"); return `${d}.${m}.${y}`; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

/* ---------- ses ---------- */
let AC = null;
const soundOn = () => LS.get("zf_sound", true);
function sfx(kind) {
  if (!soundOn()) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const seq = { tap: [[520, .05]], good: [[660, .08], [880, .12]], bad: [[200, .18]], win: [[523, .1], [659, .1], [784, .1], [1047, .25]], flip: [[330, .04]], pop: [[740, .06]] }[kind] || [];
    let t = AC.currentTime;
    seq.forEach(([f, d]) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = kind === "bad" ? "sawtooth" : "sine"; o.frequency.value = f; g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d); t += d * .9; });
  } catch (e) {}
}

/* ---------- ilerleme: günler, XP, seri, rozet ---------- */
const GAME_IDS_OLD = ["kelime", "kodkir", "hedef24", "kaydir", "hafiza", "emoji"];
const gameIds = () => window.PZ_META ? Object.keys(window.PZ_META) : GAME_IDS_OLD;
const todayDone = p => gameIds().filter(g => p.days[todayKey()] && p.days[todayKey()][g] && p.days[todayKey()][g].done).length;
const PZK = "zf_pz2";
const getP = () => { const p = LS.get(PZK, null) || {}; p.days = p.days || {}; p.xp = p.xp || 0; p.badges = p.badges || []; p.practice = p.practice || 0; return p; };
const saveP = p => LS.set(PZK, p);
const LEVELS = [[0, "Çaylak"], [100, "Acemi"], [250, "Zırvacı"], [500, "Usta"], [900, "Efsane"], [1500, "Zırva Tanrısı"]];
function levelInfo(xp) {
  let i = 0; for (let k = 0; k < LEVELS.length; k++) if (xp >= LEVELS[k][0]) i = k;
  const cur = LEVELS[i][0], next = LEVELS[i + 1] ? LEVELS[i + 1][0] : null;
  return { i, name: LEVELS[i][1], cur, next, pct: next ? Math.round((xp - cur) * 100 / (next - cur)) : 100 };
}
function streakOf(p) {
  let d = new Date(todayKey() + "T12:00:00Z"), n = 0;
  const key = x => x.toISOString().slice(0, 10);
  const has = k => p.days[k] && Object.values(p.days[k]).some(v => v && v.done);
  if (!has(key(d))) d.setUTCDate(d.getUTCDate() - 1);
  while (has(key(d))) { n++; d.setUTCDate(d.getUTCDate() - 1); }
  return n;
}
const BADGES = [
  ["ilk", "🌱", "İlk Adım", "İlk günlük bulmacanı çöz", p => anyDaily(p)],
  ["seri3", "🔥", "Isınma Turu", "3 gün üst üste oyna", p => streakOf(p) >= 3],
  ["seri7", "🚀", "Haftalık Ateş", "7 gün üst üste oyna", p => streakOf(p) >= 7],
  ["seri30", "👑", "Aylık Efsane", "30 gün üst üste oyna", p => streakOf(p) >= 30],
  ["cok", "🎨", "Çok Yönlü", "Bir günde 5 farklı bulmaca bitir", p => todayDone(p) >= 5],
  ["tam", "🏆", "Tam Set", "Bir günde 10 bulmaca bitir", p => todayDone(p) >= 10],
  ["hepsi", "🌟", "Zırva Şampiyonu", "Bir günde tüm bulmacaları bitir", p => todayDone(p) >= gameIds().length],
  ["avci", "🔎", "Kelime Avcısı", "Kelime Avı'nı 2 dakikada bitir", p => Object.values(p.days).some(d => d.kelimeavi && d.kelimeavi.win && d.kelimeavi.secs <= 120)],
  ["parola", "🎤", "Parola Ustası", "Passaparola'da 16+ doğru yap", p => Object.values(p.days).some(d => d.passaparola && d.passaparola.correct >= 16)],
  ["yildiz", "⭐", "Mükemmeliyetçi", "Bir bulmacadan 5 yıldız al", p => Object.values(p.days).some(d => Object.values(d).some(v => v && v.stars === 5))],
  ["kelime3", "🔤", "Kelime Avcısı", "Zırva Kelime'yi 3 denemede bil", p => Object.values(p.days).some(d => d.kelime && d.kelime.win && d.kelime.tries <= 3)],
  ["xp500", "💎", "Usta Zırva", "500 XP topla", p => p.xp >= 500],
  ["pratik", "🎒", "Antrenman Gözü", "10 pratik oyun oyna", p => p.practice >= 10],
];
function anyDaily(p) { return Object.values(p.days).some(d => Object.values(d).some(v => v && v.done)); }
function checkBadges(p) {
  const nu = [];
  BADGES.forEach(b => { if (!p.badges.includes(b[0]) && b[4](p)) { p.badges.push(b[0]); nu.push(b); } });
  return nu;
}
function record(slug, mode, win, stars, extra) {
  const p = getP(), key = todayKey(); let gain = 0;
  if (mode === "daily") {
    const d = p.days[key] = p.days[key] || {};
    if (!(d[slug] && d[slug].done)) { gain = win ? 20 + stars * 6 : 5; d[slug] = Object.assign({ done: true, win, stars }, extra || {}); }
  } else { p.practice++; gain = win ? 4 : 1; }
  const before = levelInfo(p.xp).i; p.xp += gain;
  const nu = checkBadges(p); saveP(p);
  const lv = levelInfo(p.xp);
  fetch("/api/bulmaca/" + slug + "/done", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ win, stars, mode }) }).catch(() => {});
  return { gain, newBadges: nu, streak: streakOf(p), level: lv, leveledUp: lv.i > before, xp: p.xp };
}
function untilMidnight() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(new Date());
  const g = t => +parts.find(x => x.type === t).value;
  const left = 86400 - (g("hour") % 24 * 3600 + g("minute") * 60 + g("second"));
  return `${String(Math.floor(left / 3600)).padStart(2, "0")}:${String(Math.floor(left % 3600 / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
}

/* ---------- sonuç paneli ---------- */
function showResult(ctx, o) {
  // o: {win, stars, title, text, shareLines, extra}
  const r = record(ctx.slug, ctx.mode, o.win, o.stars, Object.assign({ share: o.share }, o.extra));
  const box = $("#result"); box.hidden = false; box.innerHTML = "";
  box.className = "out pz-result";
  const next = gameIds().find(g => g !== ctx.slug && !(getP().days[todayKey()] || {})[g]);
  const nextName = next && window.PZ_META ? window.PZ_META[next].title : null;
  box.innerHTML = `
    <div class="pz-emoji">${o.win ? "🎉" : "😅"}</div>
    <h2 style="margin:4px 0">${o.title}</h2>
    <p class="txt" style="min-height:0">${o.text}</p>
    <div class="stars-row">${[1, 2, 3, 4, 5].map(i => `<span class="st ${i <= o.stars ? "on" : ""}" style="animation-delay:${i * .18}s">★</span>`).join("")}</div>
    <div class="gain">${r.gain ? `+${r.gain} XP` : (ctx.mode === "daily" ? "Bu bulmaca bugün zaten sayıldı" : "")}</div>
    <div class="row" style="margin-top:8px"><span class="pct">🔥 Seri: ${r.streak} gün</span><span class="pct">Seviye: ${r.level.name}</span></div>
    <div class="row" id="rbtn"></div>`;
  const rb = $("#rbtn", box);
  const mk = (t, cls, fn) => { const b = el("button", "btn sm " + cls, t); b.onclick = fn; rb.appendChild(b); return b; };
  mk("📤 Sonucu paylaş", "", () => { navigator.clipboard && navigator.clipboard.writeText(o.share); toast("Sonuç kopyalandı ✓"); if (navigator.share) navigator.share({ text: o.share }).catch(() => {}); });
  if (ctx.mode === "daily") mk("🎲 Pratik yap", "ghost", () => switchMode("practice"));
  else mk("🔁 Yeni oyun", "ghost", () => switchMode("practice", true));
  if (nextName) rb.appendChild(Object.assign(el("a", "btn sm ghost", "➡️ " + nextName), { href: "/bulmaca/" + next }));
  rb.appendChild(Object.assign(el("a", "btn sm ghost", "🏠 Bulmaca merkezi"), { href: "/bulmaca" }));
  if (o.win) { confetti(160); sfx("win"); } else sfx("bad");
  if (r.leveledUp) setTimeout(() => toast(`🎖️ Seviye atladın: ${r.level.name}!`), 600);
  r.newBadges.forEach((b, i) => setTimeout(() => toast(`${b[1]} Yeni rozet: ${b[2]}`), 1400 + i * 2400));
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}
function shareHead(ctx, extra) { const m = PZ_META[ctx.slug]; return `🏭 Zırva Fabrikası · ${m.title} ${ctx.mode === "daily" ? trDate(ctx.key).slice(0, 5) : "(pratik)"}${extra ? " " + extra : ""}`; }
const shareTail = ctx => `\n${location.origin}/bulmaca/${ctx.slug}`;

/* ---------- 1) Zırva Kelime ---------- */
function gKelime(root, ctx) {
  const W = (window.WORDS || []).map(w => w.toLocaleUpperCase("tr-TR")).filter(w => [...w].length === 5);
  const answer = W[Math.floor(ctx.rnd() * W.length)];
  const ROWS = 6, saveKey = "zf_wd_" + ctx.key;
  let guesses = [], cur = "", over = false;
  if (ctx.mode === "daily") { const s = LS.get(saveKey, null); if (s && s.ans === answer) guesses = s.g; }
  const grid = el("div", "wd-grid"); const tiles = [];
  for (let r = 0; r < ROWS; r++) { const row = el("div", "wd-row"); tiles.push([]); for (let c = 0; c < 5; c++) { const t = el("div", "wd-tile"); row.appendChild(t); tiles[r].push(t); } grid.appendChild(row); }
  const kb = el("div", "wd-kb"); const keys = {};
  ["ERTYUIOPĞÜ", "ASDFGHJKLŞİ", "ZCVBNMÖÇ"].forEach((line, li) => {
    const row = el("div", "wd-krow");
    if (li === 2) { const e = el("button", "wd-key wide", "⏎"); e.onclick = () => press("ENTER"); row.appendChild(e); }
    [...line].forEach(ch => { const b = el("button", "wd-key", ch); b.onclick = () => press(ch); keys[ch] = b; row.appendChild(b); });
    if (li === 2) { const e = el("button", "wd-key wide", "⌫"); e.onclick = () => press("BACK"); row.appendChild(e); }
    kb.appendChild(row);
  });
  root.append(grid, kb);
  const ev = (g, a) => { const res = Array(5).fill("x"), A = [...a], G = [...g], cnt = {}; A.forEach((c, i) => { if (G[i] === c) res[i] = "g"; else cnt[c] = (cnt[c] || 0) + 1; }); G.forEach((c, i) => { if (res[i] === "x" && cnt[c] > 0) { res[i] = "y"; cnt[c]--; } }); return res; };
  const rank = { x: 1, y: 2, g: 3 };
  function paint(r, res, animate) {
    [...guesses[r]].forEach((ch, i) => {
      const t = tiles[r][i]; t.textContent = ch; t.classList.add("filled");
      const apply = () => { t.dataset.s = res[i]; const k = keys[ch]; if (k && (!k.dataset.s || rank[res[i]] > rank[k.dataset.s])) k.dataset.s = res[i]; };
      if (animate) { t.style.animationDelay = i * .22 + "s"; t.classList.add("flip"); setTimeout(() => { apply(); sfx("flip"); }, i * 220 + 300); } else apply();
    });
  }
  function drawCur() { for (let c = 0; c < 5; c++) { const t = tiles[guesses.length][c]; t.textContent = [...cur][c] || ""; t.classList.toggle("filled", !![...cur][c]); if ([...cur][c]) { t.classList.remove("pop"); void t.offsetWidth; t.classList.add("pop"); } } }
  guesses.forEach((g, r) => paint(r, ev(g, answer), false));
  const lastWon = () => guesses.length && guesses[guesses.length - 1] === answer;
  if (lastWon() || guesses.length >= ROWS) { over = true; setTimeout(finish, 100); }
  async function submit() {
    if ([...cur].length < 5) { const row = tiles[guesses.length][0].parentNode; row.classList.remove("shake"); void row.offsetWidth; row.classList.add("shake"); sfx("bad"); return toast("5 harf yazmalısın"); }
    const g = cur, r = guesses.length; guesses.push(g); cur = ""; const res = ev(g, answer);
    if (ctx.mode === "daily") LS.set(saveKey, { ans: answer, g: guesses });
    paint(r, res, true); over = g === answer || guesses.length >= ROWS;
    if (over) { await sleep(1700); finish(); }
  }
  function press(k) {
    if (over) return; sfx("tap");
    if (k === "ENTER") return submit();
    if (k === "BACK") { cur = [...cur].slice(0, -1).join(""); return drawCur(); }
    if ([...cur].length < 5) { cur += k; drawCur(); }
  }
  const onKey = e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Enter") return press("ENTER"); if (e.key === "Backspace") return press("BACK");
    if (e.key.length === 1 && /[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(e.key)) press(e.key.toLocaleUpperCase("tr-TR"));
  };
  document.addEventListener("keydown", onKey); ctx.cleanup = () => document.removeEventListener("keydown", onKey);
  function finish() {
    over = true; const win = lastWon(), tries = guesses.length;
    const lines = guesses.map(g => ev(g, answer).map(x => ({ g: "🟩", y: "🟨", x: "⬛" }[x])).join("")).join("\n");
    const stars = win ? Math.max(1, Math.min(5, 7 - tries)) : 0;
    const share = `${shareHead(ctx, (win ? tries : "X") + "/6")}\n${lines}${shareTail(ctx)}`;
    showResult(ctx, { win, stars, title: win ? (tries <= 2 ? "Efsane tahmin!" : "Kelimeyi buldun!") : "Bu sefer olmadı", text: win ? `${tries}. denemede bildin: <b>${answer}</b>` : `Doğru kelime: <b>${answer}</b>`, share, extra: { tries } });
  }
}

/* ---------- 2) Kod Kır ---------- */
function gKodkir(root, ctx) {
  const COL = ["#ef4444", "#f59e0b", "#facc15", "#22c55e", "#3b82f6", "#a855f7"], EM = ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣"];
  const code = Array.from({ length: 4 }, () => ri(ctx.rnd, 0, 5)); const ROWS = 8; let rows = [], cur = [], over = false;
  const board = el("div", "mm-board"), pal = el("div", "mm-pal"), actions = el("div", "row");
  root.append(board, pal, actions);
  const mkPeg = c => `<i style="background:${COL[c]}"></i>`;
  function draw() {
    board.innerHTML = "";
    for (let r = 0; r < ROWS; r++) {
      const row = el("div", "mm-row" + (r === rows.length && !over ? " active" : ""));
      const slots = el("div", "mm-slots");
      for (let c = 0; c < 4; c++) {
        const v = r < rows.length ? rows[r].g[c] : (r === rows.length ? cur[c] : undefined);
        const s = el("div", "mm-slot" + (v != null ? " on" : ""), v != null ? mkPeg(v) : "");
        if (r === rows.length && v != null && !over) s.onclick = () => { cur.splice(c, 1); sfx("tap"); draw(); };
        slots.appendChild(s);
      }
      const fb = el("div", "mm-fb");
      for (let k = 0; k < 4; k++) { const f = el("b"); if (r < rows.length) { const rr = rows[r]; f.className = k < rr.b ? "b" : k < rr.b + rr.w ? "w" : ""; f.style.animationDelay = k * .12 + "s"; } fb.appendChild(f); }
      row.append(slots, fb); board.appendChild(row);
    }
    go.disabled = over || cur.length < 4;
  }
  COL.forEach((c, i) => { const b = el("button", "mm-color", ""); b.style.background = c; b.setAttribute("aria-label", "Renk " + (i + 1)); b.onclick = () => { if (over || cur.length >= 4) return; cur.push(i); sfx("pop"); draw(); }; pal.appendChild(b); });
  const go = el("button", "btn", "🔍 Dene"), back = el("button", "btn ghost", "⌫ Sil");
  back.onclick = () => { cur.pop(); draw(); }; go.onclick = submit; actions.append(go, back);
  function submit() {
    if (over || cur.length < 4) return;
    const g = cur.slice(); let b = 0; const cc = {}, gc = {};
    g.forEach((v, i) => { if (v === code[i]) b++; else { cc[code[i]] = (cc[code[i]] || 0) + 1; gc[v] = (gc[v] || 0) + 1; } });
    let w = 0; Object.keys(gc).forEach(k => w += Math.min(gc[k], cc[k] || 0));
    rows.push({ g, b, w }); cur = []; sfx(b === 4 ? "good" : "tap");
    over = b === 4 || rows.length >= ROWS; draw();
    if (over) setTimeout(finish, 700);
  }
  function finish() {
    const win = rows[rows.length - 1].b === 4, n = rows.length;
    const stars = win ? (n <= 3 ? 5 : n <= 4 ? 4 : n <= 6 ? 3 : n <= 7 ? 2 : 1) : 0;
    const lines = rows.map(r => r.g.map(c => EM[c]).join("") + " " + "⚫".repeat(r.b) + "⚪".repeat(r.w)).join("\n");
    showResult(ctx, { win, stars, title: win ? "Kodu kırdın!" : "Kod kırılamadı", text: win ? `${n}. denemede çözdün.` : `Gizli kod: ${code.map(c => EM[c]).join(" ")}`, share: `${shareHead(ctx, (win ? n : "X") + "/8")}\n${lines}${shareTail(ctx)}` });
  }
  draw();
}

/* ---------- 3) Hedef 24 ---------- */
function solve24(nums) {
  const f = (a, b, o) => o === "+" ? a + b : o === "-" ? a - b : o === "*" ? a * b : a / b;
  function rec(items, depth) {
    if (items.length === 1) return Math.abs(items[0].v - 24) < 1e-6 ? { e: items[0].e } : null;
    for (let i = 0; i < items.length; i++) for (let j = 0; j < items.length; j++) {
      if (i === j) continue; const a = items[i], b = items[j];
      for (const o of ["+", "-", "*", "/"]) {
        if ((o === "+" || o === "*") && i > j) continue; if (o === "/" && Math.abs(b.v) < 1e-9) continue;
        const rest = items.filter((_, k) => k !== i && k !== j), c = { v: f(a.v, b.v, o), e: `(${a.e} ${o === "*" ? "×" : o === "/" ? "÷" : o} ${b.e})` };
        const r = rec(rest.concat(c), depth + 1); if (r) { if (depth === 0) r.first = `${a.e} ${o === "*" ? "×" : o === "/" ? "÷" : o} ${b.e}`; return r; }
      }
    }
    return null;
  }
  return rec(nums.map(n => ({ v: n, e: String(n) })), 0);
}
function fracStr(v) { if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v)); for (let q = 2; q <= 24; q++) { const p = v * q; if (Math.abs(p - Math.round(p)) < 1e-9) return `${Math.round(p)}/${q}`; } return v.toFixed(2); }
function gHedef24(root, ctx) {
  let nums, sol; do { nums = Array.from({ length: 4 }, () => ri(ctx.rnd, 1, 9)); sol = solve24(nums); } while (!sol);
  let items = nums.map((n, i) => ({ v: n, id: i })), stack = [], sel = null, op = null, over = false, hint = false, t0 = null, tick = null, nid = 10;
  const info = el("div", "row"), tl = el("span", "pct", "⏱️ 0:00"), tg = el("span", "pct", "🎯 Hedef: <b>24</b>"); info.append(tg, tl);
  const area = el("div", "h24-area"), ops = el("div", "h24-ops"), msg = el("p", "muted small", "Bir sayı, bir işlem, bir sayı seç."), act = el("div", "row");
  root.append(info, area, ops, msg, act);
  ["+", "-", "×", "÷"].forEach(o => { const b = el("button", "h24-op", o); b.onclick = () => { if (over || sel == null) return; op = op === o ? null : o; sfx("tap"); draw(); }; b.dataset.o = o; ops.appendChild(b); });
  const undo = el("button", "btn sm ghost", "↩️ Geri al"), reset = el("button", "btn sm ghost", "🔄 Sıfırla"), hb = el("button", "btn sm ghost", "💡 İpucu"), giveup = el("button", "btn sm ghost", "🏳️ Pes et");
  undo.onclick = () => { if (!stack.length || over) return; items = stack.pop(); sel = op = null; draw(); }; reset.onclick = () => { if (over) return; stack = []; items = nums.map((n, i) => ({ v: n, id: i })); sel = op = null; draw(); };
  hb.onclick = () => { if (over) return; hint = true; msg.innerHTML = `💡 Şununla başlayabilirsin: <b>${sol.first}</b> <span class="muted">(en fazla 3 yıldız)</span>`; };
  giveup.onclick = () => { if (over) return; clearInterval(tick); finish(false, true); };
  act.append(undo, reset, hb, giveup);
  function startT() { if (t0) return; t0 = Date.now(); tick = setInterval(() => tl.textContent = "⏱️ " + fmtTime(Math.floor((Date.now() - t0) / 1000)), 500); }
  function draw() {
    area.innerHTML = "";
    items.forEach(it => { const b = el("button", "h24-tile" + (sel === it.id ? " sel" : ""), fracStr(it.v)); b.style.setProperty("--h", (it.id * 47) % 360); b.onclick = () => click(it); area.appendChild(b); });
    $$(".h24-op", ops).forEach(b => b.classList.toggle("on", b.dataset.o === op));
  }
  function click(it) {
    if (over) return; startT(); sfx("tap");
    if (sel == null || it.id === sel) { sel = sel === it.id ? null : it.id; op = null; return draw(); }
    if (!op) { sel = it.id; return draw(); }
    const a = items.find(x => x.id === sel), b = it, o = op;
    if (o === "÷" && Math.abs(b.v) < 1e-9) { msg.textContent = "0'a bölemezsin!"; sfx("bad"); return; }
    stack.push(items.slice());
    const v = o === "+" ? a.v + b.v : o === "-" ? a.v - b.v : o === "×" ? a.v * b.v : a.v / b.v;
    items = items.filter(x => x.id !== a.id && x.id !== b.id).concat({ v, id: nid++ }); sel = op = null; sfx("pop"); draw();
    if (items.length === 1) {
      if (Math.abs(items[0].v - 24) < 1e-6) { clearInterval(tick); finish(true); }
      else { msg.textContent = `Sonuç ${fracStr(items[0].v)} oldu, 24 değil. Geri al ve tekrar dene.`; sfx("bad"); const t = area.firstChild; if (t) t.classList.add("shake"); }
    }
  }
  function finish(win, gave) {
    over = true; const sec = t0 ? Math.floor((Date.now() - t0) / 1000) : 0;
    let stars = win ? (sec <= 60 ? 5 : sec <= 120 ? 4 : sec <= 240 ? 3 : 2) : 0; if (win && hint) stars = Math.min(stars, 3);
    if (win) { const t = area.firstChild; if (t) t.classList.add("win"); }
    showResult(ctx, { win, stars, title: win ? "24'ü yakaladın!" : "Pes ettin", text: win ? `${fmtTime(sec)} sürede çözdün.` : `Bir çözüm: <b>${sol.e} = 24</b>`, share: `${shareHead(ctx, win ? fmtTime(sec) : "pes")}\n🧮 ${nums.join(" · ")} → 24 ${win ? "✅" : "❌"}${shareTail(ctx)}` });
  }
  ctx.cleanup = () => clearInterval(tick); draw();
}

/* ---------- 4) Kaydırmalı ---------- */
function gKaydir(root, ctx) {
  const n = ctx.opts.size || 3; let b = Array.from({ length: n * n }, (_, i) => (i + 1) % (n * n)); let blank = n * n - 1, prev = -1;
  for (let k = 0; k < (n === 3 ? 70 : 160); k++) {
    const nb = []; const r = Math.floor(blank / n), c = blank % n;
    if (r > 0) nb.push(blank - n); if (r < n - 1) nb.push(blank + n); if (c > 0) nb.push(blank - 1); if (c < n - 1) nb.push(blank + 1);
    const opts = nb.filter(x => x !== prev), pick = opts[Math.floor(ctx.rnd() * opts.length)];
    [b[blank], b[pick]] = [b[pick], b[blank]]; prev = blank; blank = pick;
  }
  const solved = () => b.every((v, i) => v === (i + 1) % (n * n));
  if (solved()) { [b[0], b[1]] = [b[1], b[0]]; if (b[0] === 0 || b[1] === 0) blank = b.indexOf(0); }
  let moves = 0, t0 = null, tick = null, over = false;
  const info = el("div", "row"), tm = el("span", "pct", "⏱️ 0:00"), mv = el("span", "pct", "👣 0 hamle"); info.append(tm, mv);
  const board = el("div", "sl-board"); board.style.setProperty("--n", n); root.append(info, board, el("p", "muted small", "İpucu: ok tuşlarıyla da oynayabilirsin."));
  const tileEls = {};
  for (let v = 1; v < n * n; v++) { const t = el("button", "sl-tile", String(v)); t.style.setProperty("--h", Math.round(v * 360 / (n * n))); t.onclick = () => move(b.indexOf(v)); tileEls[v] = t; board.appendChild(t); }
  function place() { b.forEach((v, i) => { if (!v) return; const t = tileEls[v]; t.style.left = (i % n) * 100 / n + "%"; t.style.top = Math.floor(i / n) * 100 / n + "%"; t.classList.toggle("ok", v === i + 1); }); }
  function move(i) {
    if (over || i < 0) return; const bl = b.indexOf(0), r = Math.floor(i / n), c = i % n, br = Math.floor(bl / n), bc = bl % n;
    if (Math.abs(r - br) + Math.abs(c - bc) !== 1) { sfx("bad"); return; }
    if (!t0) { t0 = Date.now(); tick = setInterval(() => tm.textContent = "⏱️ " + fmtTime(Math.floor((Date.now() - t0) / 1000)), 500); }
    [b[i], b[bl]] = [b[bl], b[i]]; moves++; mv.textContent = `👣 ${moves} hamle`; sfx("tap"); place();
    if (solved()) { over = true; clearInterval(tick); setTimeout(finish, 450); }
  }
  const onKey = e => {
    const bl = b.indexOf(0), r = Math.floor(bl / n), c = bl % n; let i = -1;
    if (e.key === "ArrowLeft" && c < n - 1) i = bl + 1; if (e.key === "ArrowRight" && c > 0) i = bl - 1; if (e.key === "ArrowUp" && r < n - 1) i = bl + n; if (e.key === "ArrowDown" && r > 0) i = bl - n;
    if (i >= 0) { e.preventDefault(); move(i); }
  };
  document.addEventListener("keydown", onKey); ctx.cleanup = () => { clearInterval(tick); document.removeEventListener("keydown", onKey); };
  function finish() {
    const sec = Math.floor((Date.now() - t0) / 1000), k = n === 3 ? 1 : 2.2;
    const stars = sec <= 45 * k ? 5 : sec <= 90 * k ? 4 : sec <= 180 * k ? 3 : sec <= 300 * k ? 2 : 1;
    board.classList.add("won");
    showResult(ctx, { win: true, stars, title: "Bulmacayı tamamladın!", text: `${fmtTime(sec)} sürede, ${moves} hamlede.`, share: `${shareHead(ctx, `${n}x${n}`)}\n🧩 ${fmtTime(sec)} · ${moves} hamle ${"⭐".repeat(stars)}${shareTail(ctx)}` });
  }
  place();
}

/* ---------- 5) Hafıza ---------- */
function gHafiza(root, ctx) {
  const POOL = ["🍎", "🚀", "🎸", "🐙", "🌵", "🍩", "🎲", "🦄", "⚽", "🔮", "🍄", "🐳", "🎈", "🍕", "🦊", "🌻", "🎧", "🍉", "🐝", "🔥", "💎", "🌙", "🦋", "🧩"];
  const pairs = ctx.opts.pairs || 8, cols = pairs === 12 ? 6 : 4;
  const set = shuffle(POOL, ctx.rnd).slice(0, pairs), deck = shuffle(set.concat(set), ctx.rnd);
  let first = null, lock = false, moves = 0, found = 0, t0 = null, tick = null;
  const info = el("div", "row"), tm = el("span", "pct", "⏱️ 0:00"), mv = el("span", "pct", "👣 0 hamle"), pr = el("span", "pct", `✨ 0/${pairs}`); info.append(tm, mv, pr);
  const grid = el("div", "mem-grid"); grid.style.setProperty("--c", cols); root.append(info, grid);
  deck.forEach((e, i) => {
    const c = el("button", "mem-card", `<span class="f b"></span><span class="f a">${e}</span>`); c.dataset.e = e; c.setAttribute("aria-label", "Kart " + (i + 1));
    c.onclick = async () => {
      if (lock || c.classList.contains("up")) return;
      if (!t0) { t0 = Date.now(); tick = setInterval(() => tm.textContent = "⏱️ " + fmtTime(Math.floor((Date.now() - t0) / 1000)), 500); }
      c.classList.add("up"); sfx("flip");
      if (!first) { first = c; return; }
      moves++; mv.textContent = `👣 ${moves} hamle`; const a = first; first = null;
      if (a.dataset.e === c.dataset.e) { found++; pr.textContent = `✨ ${found}/${pairs}`; [a, c].forEach(x => x.classList.add("match")); sfx("good"); if (found === pairs) { clearInterval(tick); setTimeout(finish, 700); } }
      else { lock = true; await sleep(750); [a, c].forEach(x => x.classList.remove("up")); lock = false; sfx("bad"); }
    };
    grid.appendChild(c);
  });
  ctx.cleanup = () => clearInterval(tick);
  function finish() {
    const sec = Math.floor((Date.now() - t0) / 1000), par = pairs * 1.6;
    const stars = moves <= par ? 5 : moves <= par * 1.3 ? 4 : moves <= par * 1.7 ? 3 : moves <= par * 2.2 ? 2 : 1;
    showResult(ctx, { win: true, stars, title: "Hepsini eşleştirdin!", text: `${moves} hamlede, ${fmtTime(sec)} sürede.`, share: `${shareHead(ctx, pairs + " çift")}\n🃏 ${moves} hamle · ${fmtTime(sec)} ${"⭐".repeat(stars)}${shareTail(ctx)}` });
  }
}

/* ---------- 6) Emoji Bilmece ---------- */
const EMOJI_ITEMS = [
  ["Şehir", "🌉🕌", "İstanbul"], ["Şehir", "🍇🌊", "İzmir"], ["Şehir", "🍵⛰️", "Rize"], ["Şehir", "🏖️🍊", "Antalya"], ["Şehir", "🎈🏜️", "Kapadokya"], ["Şehir", "🐴🏰", "Çanakkale"], ["Şehir", "🍖🌲", "Bursa"], ["Şehir", "🏛️🇹🇷", "Ankara"],
  ["Yemek", "🥜🍯", "Baklava"], ["Yemek", "🥟🥛", "Mantı"], ["Yemek", "🍳🍅🌶️", "Menemen"], ["Yemek", "🫓🥩🍋", "Lahmacun"], ["Yemek", "🍢🔥", "Kebap"], ["Yemek", "🥔🧀", "Kumpir"], ["Yemek", "🥯🍵", "Simit çay"], ["Yemek", "🍦⛓️", "Maraş dondurması"],
  ["Film", "🦁👑", "Aslan Kral"], ["Film", "🚢🧊", "Titanik"], ["Film", "💍🧙", "Yüzüklerin Efendisi"], ["Film", "🕷️🧍", "Örümcek Adam"], ["Film", "🏴‍☠️🌴", "Karayip Korsanları"], ["Film", "❄️👸", "Karlar Ülkesi"], ["Film", "⭐⚔️", "Yıldız Savaşları"], ["Film", "🦖🌴", "Jurassic Park"],
  ["Atasözü", "💧🏞️", "Damlaya damlaya göl olur"], ["Atasözü", "🐕🗣️🚫🦷", "Havlayan köpek ısırmaz"], ["Atasözü", "🍬👅🐍", "Tatlı dil yılanı deliğinden çıkarır"], ["Atasözü", "🌹🌵", "Gülü seven dikenine katlanır"], ["Atasözü", "🍇👀⚫", "Üzüm üzüme baka baka kararır"], ["Atasözü", "🌾⏰", "Sakla samanı gelir zamanı"], ["Atasözü", "🐦🏠👩", "Yuvayı dişi kuş yapar"], ["Atasözü", "💧➡️🛤️", "Su akar yolunu bulur"],
  ["Kelime", "🌙🌸", "Ayçiçeği"], ["Kelime", "☁️🏢", "Gökdelen"], ["Kelime", "🦷🪥", "Diş fırçası"], ["Kelime", "🌧️🧥", "Yağmurluk"], ["Kelime", "☀️👓", "Güneş gözlüğü"], ["Kelime", "🧊🗄️", "Buzdolabı"], ["Kelime", "❄️⚽", "Kartopu"], ["Kelime", "🌈", "Gökkuşağı"],
];
function gEmoji(root, ctx) {
  const qs = shuffle(EMOJI_ITEMS, ctx.rnd).slice(0, 5); let i = 0, score = 0, lock = false, res = [];
  const prog = el("div", "em-prog"), card = el("div", "em-card"), opts = el("div", "em-opts"); root.append(prog, card, opts);
  function show() {
    prog.innerHTML = qs.map((_, k) => `<span class="${k < i ? (res[k] ? "ok" : "no") : k === i ? "now" : ""}"></span>`).join("");
    const [cat, em, ans] = qs[i]; card.innerHTML = `<div class="em-cat">${cat}</div><div class="em-big">${em}</div>`; card.classList.remove("pop"); void card.offsetWidth; card.classList.add("pop");
    const pool = EMOJI_ITEMS.filter(x => x[0] === cat && x[2] !== ans).map(x => x[2]); const o = shuffle(shuffle(pool, ctx.rnd).slice(0, 3).concat(ans), ctx.rnd);
    opts.innerHTML = ""; o.forEach(t => { const b = el("button", "em-opt", t); b.onclick = () => pick(b, t === ans, ans); opts.appendChild(b); });
  }
  async function pick(b, ok, ans) {
    if (lock) return; lock = true; res.push(ok); if (ok) { score++; b.classList.add("good"); sfx("good"); } else { b.classList.add("bad"); sfx("bad"); $$(".em-opt", opts).forEach(x => { if (x.textContent === ans) x.classList.add("good"); }); }
    await sleep(1000); i++; lock = false; if (i < qs.length) show(); else finish();
  }
  function finish() {
    prog.innerHTML = qs.map((_, k) => `<span class="${res[k] ? "ok" : "no"}"></span>`).join(""); const win = score >= 3;
    showResult(ctx, { win, stars: score, title: win ? "Emoji dehası!" : "Biraz daha pratik", text: `5 sorudan ${score} tanesini bildin.`, share: `${shareHead(ctx, score + "/5")}\n${res.map(x => x ? "🟩" : "🟥").join("")}${shareTail(ctx)}` });
  }
  show();
}

/* ---------- oyun kabuğu: günlük/pratik, tamamlanmış özet ---------- */
const GAMES = { kelime: gKelime, kodkir: gKodkir, hedef24: gHedef24, kaydir: gKaydir, hafiza: gHafiza, emoji: gEmoji };
let CUR = { slug: null, mode: "daily", ctx: null, opts: {} };
function switchMode(mode, fresh) { CUR.mode = mode; start(); }
function start() {
  const slug = CUR.slug, root = $("#game"), box = $("#result");
  if (CUR.ctx && CUR.ctx.cleanup) CUR.ctx.cleanup();
  root.innerHTML = ""; box.hidden = true; box.innerHTML = ""; clearInterval(window.__cd);
  $$("[data-mode]").forEach(b => b.classList.toggle("on", b.dataset.mode === CUR.mode));
  const opts = $("#opts"); opts.innerHTML = "";
  const key = todayKey(), done = (getP().days[key] || {})[slug];
  if (CUR.mode === "daily" && done && done.done) {
    root.innerHTML = `<div class="out pz-result"><div class="pz-emoji">✅</div><h2>Bugünkü bulmacayı tamamladın!</h2>
      <div class="stars-row">${[1, 2, 3, 4, 5].map(i => `<span class="st ${i <= done.stars ? "on" : ""}" style="animation-delay:${i * .15}s">★</span>`).join("")}</div>
      <p class="muted">Yeni günlük bulmaca için: <b id="cd">${untilMidnight()}</b></p>
      <div class="row"><button class="btn sm" id="again">📤 Sonucu paylaş</button><button class="btn sm ghost" id="prac">🎲 Pratik yap</button><a class="btn sm ghost" href="/bulmaca">🏠 Bulmaca merkezi</a></div></div>`;
    $("#again").onclick = () => { navigator.clipboard && navigator.clipboard.writeText(done.share || ""); toast("Sonuç kopyalandı ✓"); };
    $("#prac").onclick = () => switchMode("practice"); window.__cd = setInterval(() => { const c = $("#cd"); if (c) c.textContent = untilMidnight(); }, 1000); CUR.ctx = null; return;
  }
  const o = {};
  if (CUR.mode === "practice") {
    if (slug === "kaydir") { o.size = CUR.opts.size || 3; opts.innerHTML = `<span class="muted small">Boyut:</span> ` + [3, 4].map(s => `<button class="btn sm ${o.size === s ? "" : "ghost"}" data-size="${s}">${s}x${s}</button>`).join(" "); $$("[data-size]", opts).forEach(b => b.onclick = () => { CUR.opts.size = +b.dataset.size; start(); }); }
    if (slug === "hafiza") { o.pairs = CUR.opts.pairs || 8; opts.innerHTML = `<span class="muted small">Zorluk:</span> ` + [[6, "Kolay"], [8, "Normal"], [12, "Zor"]].map(([p, n]) => `<button class="btn sm ${o.pairs === p ? "" : "ghost"}" data-p="${p}">${n}</button>`).join(" "); $$("[data-p]", opts).forEach(b => b.onclick = () => { CUR.opts.pairs = +b.dataset.p; start(); }); }
    const nb = el("button", "btn sm ghost", "🔄 Yeni bulmaca"); nb.onclick = start; opts.appendChild(nb);
  }
  const seed = CUR.mode === "daily" ? hash(slug + ":" + key) : hash(slug + ":" + Math.random() + Date.now());
  const ctx = { slug, mode: CUR.mode, key, rnd: rng(seed), opts: o }; CUR.ctx = ctx; window.__pzctx = ctx;
  root.className = "pz-stage g-" + slug; (GAMES[slug] || (window.PZX || {})[slug])(root, ctx, window.PZ_API);
}
function initPuzzle(slug) {
  CUR.slug = slug; CUR.mode = "daily";
  $$("[data-mode]").forEach(b => b.onclick = () => switchMode(b.dataset.mode));
  const snd = $("#snd"); if (snd) { const set = () => snd.textContent = soundOn() ? "🔊" : "🔇"; set(); snd.onclick = () => { LS.set("zf_sound", !soundOn()); set(); sfx("good"); }; }
  start();
}

/* ---------- merkez sayfası ---------- */
function initHub() {
  const p = getP(), key = todayKey(), day = p.days[key] || {}, lv = levelInfo(p.xp);
  const doneN = gameIds().filter(g => day[g] && day[g].done).length;
  $("#hStreak").textContent = streakOf(p); $("#hXp").textContent = p.xp; $("#hLevel").textContent = lv.name;
  $("#hBar").style.width = lv.pct + "%"; $("#hNext").textContent = lv.next ? `${lv.next - p.xp} XP sonra: ${LEVELS[lv.i + 1][1]}` : "En yüksek seviyedesin! 👑";
  $("#hToday").textContent = `${doneN}/${gameIds().length}`; $("#hTodayBar").style.width = (doneN * 100 / gameIds().length) + "%";
  $$("[data-game]").forEach(t => { const d = day[t.dataset.game]; if (d && d.done) { t.classList.add("solved"); const s = $(".gs", t); if (s) s.textContent = "★".repeat(d.stars) + "☆".repeat(5 - d.stars); } });
  const bx = $("#badges"); bx.innerHTML = BADGES.map(b => `<div class="badge ${p.badges.includes(b[0]) ? "on" : ""}" title="${b[3]}"><span>${b[1]}</span><b>${b[2]}</b><small>${b[3]}</small></div>`).join("");
  const cd = $("#hCd"); const upd = () => cd.textContent = untilMidnight(); upd(); setInterval(upd, 1000);
  // son 14 gün
  const cal = $("#cal"); let d = new Date(key + "T12:00:00Z"); const cells = [];
  for (let i = 13; i >= 0; i--) { const x = new Date(d); x.setUTCDate(x.getUTCDate() - i); const k = x.toISOString().slice(0, 10); const n = Object.values(p.days[k] || {}).filter(v => v && v.done).length; cells.push(`<div class="cal-c l${Math.min(n, 4)}" title="${trDate(k)}: ${n} bulmaca">${x.getUTCDate()}</div>`); }
  cal.innerHTML = cells.join("");
}
const tone = (f, d = .1, type = "sine", v = .12) => { if (!soundOn()) return; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.value = f; const t = AC.currentTime; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d + .02); } catch (e) {} };
window.PZ_API = { el, shuffle, ri, rng, hash, sleep, sfx, tone, showResult, shareHead, shareTail, fmtTime, trDate, todayKey, record, getP, soundOn };
window.PZ = { todayKey, hash, rng, initPuzzle, initHub, solve24 };
})();
