/* Zırva Bulmaca v6.4: Satranç, Mancala, Zırva Zuma, Bomba Adam (Bomberman), Tank Savaşı */
(function () {
const CH = () => window.PZ_DATA.chooser;

/* ===== Satranç (bilgisayara karşı; rok ve en passant yok, piyon vezir olur) ===== */
function gSatranc(root, ctx, A) {
  CH()(root, A, "Satranç zorluğunu seç", [["1", "🟢 Kolay", "Bilgisayar 1 hamle düşünür, bazen hata yapar"], ["2", "🟡 Normal", "2 hamle ileri düşünür"], ["3", "🔴 Zor", "3 hamle ileri düşünür"]], m => run(+m)); ctx.auto = () => { if (!ctx.__a) run(1); ctx.__a(); };
  function run(depth) {
    const { el, sfx, showResult, shareHead, shareTail, sleep } = A; const G = { p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚" };
    let b = "rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR".split(""); let sel = -1, turn = "w", over = false, busy = false, moves = 0, last = null;
    const info = el("div", "ka-info"), board = el("div", "ch-grid"), msg = el("div", "tf-why muted small"); root.append(info, board, msg);
    const white = c => c !== "." && c === c.toUpperCase(), isW = (c, side) => c !== "." && (side === "w") === white(c);
    const V = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
    function gen(bd, side) { const out = []; for (let i = 0; i < 64; i++) { const c = bd[i]; if (!isW(c, side)) continue; const r = i >> 3, f = i & 7, t = c.toLowerCase(); const add = (r2, f2) => { if (r2 < 0 || r2 > 7 || f2 < 0 || f2 > 7) return false; const j = r2 * 8 + f2, d = bd[j]; if (d === "." || !isW(d, side)) { out.push([i, j]); return d === "."; } return false; };
        if (t === "p") { const dir = side === "w" ? -1 : 1, st = side === "w" ? 6 : 1; if (bd[(r + dir) * 8 + f] === "." && r + dir >= 0 && r + dir <= 7) { out.push([i, (r + dir) * 8 + f]); if (r === st && bd[(r + 2 * dir) * 8 + f] === ".") out.push([i, (r + 2 * dir) * 8 + f]); } [-1, 1].forEach(df => { const f2 = f + df, r2 = r + dir; if (f2 >= 0 && f2 < 8 && r2 >= 0 && r2 < 8) { const d = bd[r2 * 8 + f2]; if (d !== "." && !isW(d, side)) out.push([i, r2 * 8 + f2]); } }); }
        else if (t === "n") [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]].forEach(([a, d]) => add(r + a, f + d));
        else if (t === "k") for (let a = -1; a <= 1; a++) for (let d = -1; d <= 1; d++) if (a || d) add(r + a, f + d);
        else { const dirs = t === "b" ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : t === "r" ? [[1, 0], [-1, 0], [0, 1], [0, -1]] : [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]; dirs.forEach(([a, d]) => { let y = r + a, x = f + d; while (add(y, x)) { y += a; x += d; } }); } } return out; }
    const apply = (bd, [i, j]) => { const n = bd.slice(), c = n[i]; n[j] = c; n[i] = "."; if (c === "P" && j < 8) n[j] = "Q"; if (c === "p" && j >= 56) n[j] = "q"; return n; };
    const kingIn = (bd, side) => bd.includes(side === "w" ? "K" : "k") ? gen(bd, side === "w" ? "b" : "w").some(([, j]) => bd[j] === (side === "w" ? "K" : "k")) : true;
    const legal = (bd, side) => gen(bd, side).filter(m => !kingIn(apply(bd, m), side));
    const PST = i => { const r = i >> 3, f = i & 7; return 6 - (Math.abs(3.5 - r) + Math.abs(3.5 - f)); };
    const evalB = bd => { let s = 0; for (let i = 0; i < 64; i++) { const c = bd[i]; if (c === ".") continue; const v = V[c.toLowerCase()] + (c.toLowerCase() === "k" ? 0 : PST(i) * 2) + (c === "p" ? (7 - (i >> 3)) * 3 : c === "P" ? 0 : 0); s += white(c) ? v : -v; } return s; };
    function search(bd, d, al, be, side) { if (d === 0) return side === "w" ? evalB(bd) : -evalB(bd); const ms = gen(bd, side).sort((x, y) => (bd[y[1]] !== "." ? V[bd[y[1]].toLowerCase()] : 0) - (bd[x[1]] !== "." ? V[bd[x[1]].toLowerCase()] : 0)); let best = -1e9; for (const m of ms) { if (bd[m[1]].toLowerCase() === "k") return 1e6 + d; const v = -search(apply(bd, m), d - 1, -be, -al, side === "w" ? "b" : "w"); if (v > best) best = v; if (best > al) al = best; if (al >= be) break; } return best === -1e9 ? 0 : best; }
    function aiMove() { const ms = legal(b, "b"); if (!ms.length) return null; if (depth === 1 && ctx.rnd() < .3) return ms[Math.floor(ctx.rnd() * ms.length)]; let best = null, bv = -1e9; ms.sort(() => ctx.rnd() - .5).forEach(m => { const nb = apply(b, m); const v = -search(nb, depth - 1, -1e9, 1e9, "w"); if (v > bv) { bv = v; best = m; } }); return best; }
    function paint() { const tg = sel >= 0 ? legal(b, "w").filter(m => m[0] === sel).map(m => m[1]) : []; board.innerHTML = ""; b.forEach((c, i) => { const r = i >> 3, f = i & 7; const d = el("button", "ch-c " + ((r + f) % 2 ? "dk" : "lt") + (i === sel ? " sel" : "") + (tg.includes(i) ? " tg" : "") + (last && (last[0] === i || last[1] === i) ? " lm" : ""), c === "." ? "" : `<span class="ch-p ${white(c) ? "wp" : "bp"}">${G[c.toLowerCase()]}</span>`); d.onclick = () => click(i); board.appendChild(d); });
      info.innerHTML = `<span>Hamle: <b>${moves}</b></span><span>${kingIn(b, "w") && !over ? "⚠️ ŞAH!" : "Beyaz (sen) başlar"}</span>`; }
    async function click(i) { if (over || busy || turn !== "w") return; const c = b[i]; if (isW(c, "w")) { sel = i; paint(); return; } if (sel < 0) return; const m = legal(b, "w").find(x => x[0] === sel && x[1] === i); if (!m) { sfx("bad"); return; } busy = true; b = apply(b, m); last = m; moves++; sel = -1; sfx("tap"); paint(); const lw = legal(b, "b"); if (!lw.length) return end(kingIn(b, "b") ? 1 : 0); if (moves >= 70) return end(0);
      msg.textContent = "Bilgisayar düşünüyor..."; await sleep(300); const am = aiMove(); b = apply(b, am); last = am; sfx("tap"); msg.textContent = ""; paint(); if (!legal(b, "w").length) return end(kingIn(b, "w") ? -1 : 0); busy = false; }
    function end(r) { over = true; paint(); const stars = r === 1 ? (moves <= 25 ? 5 : moves <= 40 ? 4 : 3) : r === 0 ? 2 : 1; showResult(ctx, { win: r === 1, stars, title: r === 1 ? "Şah mat! Sen kazandın" : r === 0 ? "Beraberlik (pat)" : "Mat oldun", text: `${moves} hamle oynadın. Zorluk: ${["", "Kolay", "Normal", "Zor"][depth]}`, share: `${shareHead(ctx, r === 1 ? "mat etti" : r === 0 ? "berabere" : "mat oldu")}\n♟ Satranç (${["", "kolay", "normal", "zor"][depth]})${shareTail(ctx)}` }); }
    ctx.__a = () => end(1); paint();
  }
}

/* ===== Mancala (Kalah) ===== */
function gMancala(root, ctx, A) {
  CH()(root, A, "Mancala zorluğunu seç", [["1", "🟢 Kolay", "Rakip kısa düşünür"], ["4", "🟡 Normal", "Birkaç hamle ileri düşünür"], ["7", "🔴 Zor", "Çok ileri düşünür"]], m => run(+m)); ctx.auto = () => { if (!ctx.__a) run(1); ctx.__a(); };
  function run(depth) {
    const { el, sfx, showResult, shareHead, shareTail, sleep } = A; let s = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0], turn = 0, over = false, busy = false, moves = 0;
    const info = el("div", "ka-info"), board = el("div", "mc-board"), msg = el("div", "tf-why muted small"); root.append(info, board, msg);
    const own = (p, side) => side === 0 ? p >= 0 && p <= 5 : p >= 7 && p <= 12, store = side => side === 0 ? 6 : 13;
    function sow(st, p, side) { st = st.slice(); let n = st[p]; st[p] = 0; let i = p; while (n) { i = (i + 1) % 14; if (i === store(1 - side)) continue; st[i]++; n--; } let extra = false; if (i === store(side)) extra = true; else if (own(i, side) && st[i] === 1 && st[12 - i] > 0) { st[store(side)] += st[12 - i] + 1; st[i] = 0; st[12 - i] = 0; } return [st, extra]; }
    const empty = (st, side) => (side === 0 ? st.slice(0, 6) : st.slice(7, 13)).every(x => !x);
    function finish(st) { st = st.slice(); for (let i = 0; i < 6; i++) { st[6] += st[i]; st[i] = 0; st[13] += st[7 + i]; st[7 + i] = 0; } return st; }
    function mm(st, side, d, al, be) { if (empty(st, 0) || empty(st, 1)) { const f = finish(st); return f[13] - f[6]; } if (!d) return st[13] - st[6]; const pits = (side === 0 ? [0, 1, 2, 3, 4, 5] : [7, 8, 9, 10, 11, 12]).filter(p => st[p]); let best = side === 1 ? -1e9 : 1e9; for (const p of pits) { const [n, ex] = sow(st, p, side); const v = mm(n, ex ? side : 1 - side, d - 1, al, be); if (side === 1) { best = Math.max(best, v); al = Math.max(al, v); } else { best = Math.min(best, v); be = Math.min(be, v); } if (be <= al) break; } return best; }
    function aiPick() { const pits = [7, 8, 9, 10, 11, 12].filter(p => s[p]); let best = pits[0], bv = -1e9; pits.sort(() => ctx.rnd() - .5).forEach(p => { const [n, ex] = sow(s, p, 1); const v = mm(n, ex ? 1 : 0, depth - 1, -1e9, 1e9) + (ex ? .5 : 0); if (v > bv) { bv = v; best = p; } }); return best; }
    function paint() { info.innerHTML = `<span>🧑 Sen: <b>${s[6]}</b></span><span>${turn === 0 ? "Sıra sende" : "Bilgisayar oynuyor"}</span><span>🤖 Rakip: <b>${s[13]}</b></span>`; board.innerHTML = ""; const top = el("div", "mc-row"), bot = el("div", "mc-row"); const st1 = el("div", "mc-store", s[13]), st0 = el("div", "mc-store me", s[6]);
      [12, 11, 10, 9, 8, 7].forEach(p => top.appendChild(el("div", "mc-pit ai", `<span>${s[p]}</span>`))); [0, 1, 2, 3, 4, 5].forEach(p => { const d = el("button", "mc-pit" + (turn === 0 && s[p] && !busy ? " can" : ""), `<span>${s[p]}</span>`); d.onclick = () => play(p); bot.appendChild(d); });
      const mid = el("div", "mc-mid"); const rows = el("div", "mc-rows"); rows.append(top, bot); mid.append(st1, rows, st0); board.appendChild(mid); }
    async function play(p) { if (over || busy || turn !== 0 || !s[p]) return; busy = true; let [n, ex] = sow(s, p, 0); s = n; moves++; sfx("tap"); paint(); if (empty(s, 0) || empty(s, 1)) return end(); if (ex) { msg.textContent = "Bir tur daha oyna! 🎉"; busy = false; return; } msg.textContent = ""; turn = 1; paint();
      for (;;) { await sleep(700); const q = aiPick(); [n, ex] = sow(s, q, 1); s = n; sfx("tap"); paint(); if (empty(s, 0) || empty(s, 1)) return end(); if (!ex) break; }
      turn = 0; busy = false; paint(); }
    function end() { over = true; s = finish(s); paint(); const a = s[6], c = s[13], win = a > c; showResult(ctx, { win, stars: win ? (a - c >= 16 ? 5 : a - c >= 8 ? 4 : 3) : a === c ? 2 : 1, title: win ? "Mancala ustası!" : a === c ? "Berabere" : "Rakip kazandı", text: `Sen ${a} - Rakip ${c} (${moves} hamle)`, share: `${shareHead(ctx, a + "-" + c)}\n🫘 Mancala${shareTail(ctx)}` }); }
    ctx.__a = () => { s = [0, 0, 0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 18]; end(); }; paint();
  }
}

/* ===== Zırva Zuma ===== */
function gZuma(root, ctx, A) {
  const { el, ri, sfx, showResult, shareHead, shareTail } = A; const Wd = 420, R = 13, D = 26, TOTAL = 34, COL = ["#ef4444", "#facc15", "#22c55e", "#3b82f6"];
  const cv = el("canvas", "zm-cv"); cv.width = cv.height = Wd; const info = el("div", "ka-info"); root.append(info, cv); const x = cv.getContext("2d");
  const path = []; { const cx = Wd / 2, cy = Wd / 2; const T = 2.2 * Math.PI * 2; let th = 0, len = 0, last = null; while (th < T) { const r = 190 - (th / T) * 100; const p = [cx + r * Math.cos(th - Math.PI / 2 + 0.4), cy + r * Math.sin(th - Math.PI / 2 + 0.4)]; if (last) len += Math.hypot(p[0] - last[0], p[1] - last[1]); path.push([p[0], p[1], len]); last = p; th += 0.008; } }
  const PL = path[path.length - 1][2]; const at = s => { s = Math.max(0, Math.min(PL, s)); let lo = 0, hi = path.length - 1; while (lo < hi - 1) { const m = (lo + hi) >> 1; if (path[m][2] <= s) lo = m; else hi = m; } return path[lo]; };
  let queue = Array.from({ length: TOTAL }, () => ri(ctx.rnd, 0, 3)), chain = [], s0 = 0, shots = [], aim = [Wd / 2, 100], cur = ri(ctx.rnd, 0, 3), nxt = ri(ctx.rnd, 0, 3), over = false, score = 0, combo = 0; const SPEED = 0.34;
  const near = (px, py) => { let bi = 0, bd = 1e9; path.forEach((p, i) => { if (i % 3) return; const d = (p[0] - px) ** 2 + (p[1] - py) ** 2; if (d < bd) { bd = d; bi = i; } }); return path[bi][2]; };
  function clearMatch(i) { const c = chain[i].c; let a = i, b = i; while (a > 0 && chain[a - 1].c === c) a--; while (b < chain.length - 1 && chain[b + 1].c === c) b++; if (b - a + 1 >= 3) { const n = b - a + 1; chain.splice(a, n); score += n * 10 * (1 + combo); sfx("good"); combo++; if (a > 0 && a < chain.length && chain[a - 1].c === chain[a].c) clearMatch(a); return true; } return false; }
  function step() { if (over) return; if (chain.length) chain[0].s += SPEED; if (queue.length && (!chain.length || chain[chain.length - 1].s >= D)) chain.push({ c: queue.shift(), s: chain.length ? chain[chain.length - 1].s - D : 0 });
    for (let i = 1; i < chain.length; i++) { const lim = chain[i - 1].s - D; if (chain[i].s > lim) chain[i].s = lim; else if (chain[i].s < lim) chain[i].s = Math.min(lim, chain[i].s + 3); }
    shots.forEach(sh => { sh.x += sh.vx; sh.y += sh.vy; }); const keep = [];
    shots.forEach(sh => { if (sh.x < -20 || sh.x > Wd + 20 || sh.y < -20 || sh.y > Wd + 20) return; let hit = -1; for (let i = 0; i < chain.length; i++) { const p = at(chain[i].s); if (Math.hypot(p[0] - sh.x, p[1] - sh.y) < D * .85) { hit = i; break; } }
      if (hit < 0) { keep.push(sh); return; } const sp = near(sh.x, sh.y); const idx = sp > chain[hit].s ? hit : hit + 1; chain.splice(idx, 0, { c: sh.c, s: chain[Math.min(hit, chain.length - 1)].s }); combo = 0; if (!clearMatch(idx)) sfx("tap"); }); shots = keep;
    if (chain.length && chain[0].s >= PL - 6) return end(false); if (!chain.length && !queue.length) return end(true); draw(); }
  function draw() { x.fillStyle = "#0b1220"; x.fillRect(0, 0, Wd, Wd); x.strokeStyle = "#ffffff22"; x.lineWidth = D + 4; x.lineCap = "round"; x.beginPath(); path.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.stroke(); const e = path[path.length - 1]; x.fillStyle = "#000"; x.beginPath(); x.arc(e[0], e[1], R + 5, 0, 7); x.fill(); x.font = "20px serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("💀", e[0], e[1]);
    const ball = (px, py, c) => { const g = x.createRadialGradient(px - 4, py - 4, 2, px, py, R); g.addColorStop(0, "#fff"); g.addColorStop(.25, COL[c]); g.addColorStop(1, "#0006"); x.fillStyle = g; x.beginPath(); x.arc(px, py, R, 0, 7); x.fill(); };
    chain.forEach(b => { const p = at(b.s); ball(p[0], p[1], b.c); }); shots.forEach(sh => ball(sh.x, sh.y, sh.c));
    const cx = Wd / 2, cy = Wd / 2, ang = Math.atan2(aim[1] - cy, aim[0] - cx); x.save(); x.translate(cx, cy); x.rotate(ang); x.fillStyle = "#16a34a"; x.beginPath(); x.arc(0, 0, 30, 0, 7); x.fill(); x.fillStyle = "#15803d"; x.fillRect(0, -9, 38, 18); x.restore(); ball(cx + Math.cos(ang) * 30, cy + Math.sin(ang) * 30, cur); x.fillStyle = "#ffffffaa"; x.font = "11px sans-serif"; x.fillText("sıradaki:", cx - 22, cy + 48); const g = x.createRadialGradient(cx + 12, cy + 44, 1, cx + 14, cy + 48, 8); g.addColorStop(0, "#fff"); g.addColorStop(.3, COL[nxt]); g.addColorStop(1, "#0006"); x.fillStyle = g; x.beginPath(); x.arc(cx + 22, cy + 48, 8, 0, 7); x.fill();
    info.innerHTML = `<span>Kalan: <b>${chain.length + queue.length}</b></span><span>Skor: ${score}</span>`; }
  const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * Wd / r.width, (e.clientY - r.top) * Wd / r.height]; };
  cv.onpointermove = e => { aim = pos(e); }; cv.onpointerdown = e => { e.preventDefault(); if (over) return; aim = pos(e); const cx = Wd / 2, cy = Wd / 2, a = Math.atan2(aim[1] - cy, aim[0] - cx); if (shots.length > 2) return; shots.push({ x: cx + Math.cos(a) * 30, y: cy + Math.sin(a) * 30, vx: Math.cos(a) * 9, vy: Math.sin(a) * 9, c: cur }); cur = nxt; nxt = ri(ctx.rnd, 0, 3); sfx("tap"); };
  cv.addEventListener("touchmove", e => { e.preventDefault(); }, { passive: false }); cv.style.touchAction = "none";
  const t = setInterval(step, 16); ctx.cleanup = () => clearInterval(t);
  function end(win) { if (over) return; over = true; clearInterval(t); draw(); const stars = win ? (score >= 1500 ? 5 : score >= 1000 ? 4 : 3) : chain.length + queue.length < 12 ? 2 : 1; showResult(ctx, { win, stars, title: win ? "Zincir tamamen patladı!" : "Toplar deliğe ulaştı", text: `Skor ${score}. ${win ? "Hepsini temizledin." : "Kalan top: " + (chain.length + queue.length)}`, share: `${shareHead(ctx, win ? score + " puan" : "kaybetti")}\n🐸 Zırva Zuma${shareTail(ctx)}` }); }
  ctx.auto = () => { chain = []; queue = []; end(true); }; draw();
}

/* ===== Bomba Adam (Bomberman) ===== */
function gBomba(root, ctx, A) {
  const { el, ri, sfx, showResult, shareHead, shareTail, fmtTime } = A; const W = 13, H = 11, S = 30; const cv = el("canvas", "bm-cv"); cv.width = W * S; cv.height = H * S; const info = el("div", "ka-info"), pad = el("div", "tt-pad"); root.append(info, cv, pad); const x = cv.getContext("2d");
  const g = Array.from({ length: H }, (_, r) => Array.from({ length: W }, (_, c) => (r % 2 === 1 && c % 2 === 1) || r === 0 || c === 0 || r === H - 1 || c === W - 1 ? 1 : (r + c < 5 ? 0 : ctx.rnd() < .62 ? 2 : 0))); // 1=sert 2=kırılır
  const items = {}; for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) if (g[r][c] === 2 && ctx.rnd() < .2) items[r * W + c] = ctx.rnd() < .5 ? "🔥" : "💣";
  let pl = { r: 1, c: 1 }, range = 2, maxB = 1, bombs = [], flames = [], enemies = [], over = false, secs = 0, lives = 2, inv = 0;
  for (let k = 0; k < 4; k++) { let r, c; do { r = ri(ctx.rnd, 1, H - 2); c = ri(ctx.rnd, 1, W - 2); } while (g[r][c] || r + c < 9 || enemies.some(e => e.r === r && e.c === c)); enemies.push({ r, c, d: [0, 1], t: 0 }); }
  const free = (r, c) => g[r][c] === 0 && !bombs.some(b => b.r === r && b.c === c);
  function mv(dr, dc) { if (over) return; const r = pl.r + dr, c = pl.c + dc; if (g[r][c] !== 0 || bombs.some(b => b.r === r && b.c === c)) return; pl = { r, c }; const k = r * W + c; if (items[k]) { if (items[k] === "🔥") range++; else maxB++; delete items[k]; sfx("good"); } draw(); }
  function bomb() { if (over || bombs.length >= maxB || bombs.some(b => b.r === pl.r && b.c === pl.c)) return; bombs.push({ r: pl.r, c: pl.c, t: 2200 }); sfx("tap"); draw(); }
  function boom(b) { const cells = [[b.r, b.c]]; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, d]) => { for (let i = 1; i <= range; i++) { const r = b.r + a * i, c = b.c + d * i; if (g[r][c] === 1) break; cells.push([r, c]); if (g[r][c] === 2) { g[r][c] = 0; break; } } }); flames.push({ cells, t: 450 }); bombs = bombs.filter(z => z !== b); sfx("bad"); bombs.slice().forEach(o => { if (cells.some(([r, c]) => r === o.r && c === o.c)) boom(o); }); }
  const dead = (r, c) => flames.some(f => f.cells.some(([a, b]) => a === r && b === c));
  function step(dt) { if (over) return; secs += dt / 1000; inv = Math.max(0, inv - dt); bombs.slice().forEach(b => { b.t -= dt; if (b.t <= 0 && bombs.includes(b)) boom(b); }); flames.forEach(f => f.t -= dt); flames = flames.filter(f => f.t > 0);
    enemies.forEach(e => { e.t += dt; if (e.t > 380) { e.t = 0; const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]; let nd = [e.d]; if (ctx.rnd() < .3 || !free(e.r + e.d[0], e.c + e.d[1])) nd = dirs.sort(() => ctx.rnd() - .5); const ch = nd.find(d => free(e.r + d[0], e.c + d[1])); if (ch) { e.d = ch; e.r += ch[0]; e.c += ch[1]; } } });
    enemies = enemies.filter(e => !dead(e.r, e.c)); if (!enemies.length) return end(true);
    if (!inv && (dead(pl.r, pl.c) || enemies.some(e => e.r === pl.r && e.c === pl.c))) { lives--; inv = 1500; sfx("bad"); if (lives <= 0) return end(false); pl = { r: 1, c: 1 }; } draw(); }
  function draw() { x.fillStyle = "#14532d"; x.fillRect(0, 0, W * S, H * S); x.font = (S - 6) + "px serif"; x.textAlign = "center"; x.textBaseline = "middle";
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) { const v = g[r][c]; if (v === 1) { x.fillStyle = "#475569"; x.fillRect(c * S, r * S, S, S); x.fillStyle = "#64748b"; x.fillRect(c * S + 2, r * S + 2, S - 4, S - 4); } else if (v === 2) { x.fillStyle = "#b45309"; x.fillRect(c * S, r * S, S, S); x.fillStyle = "#d97706"; x.fillRect(c * S + 2, r * S + 2, S - 4, S - 4); } else if ((r + c) % 2) { x.fillStyle = "#16603a"; x.fillRect(c * S, r * S, S, S); } }
    Object.keys(items).forEach(k => { if (g[Math.floor(k / W)][k % W] === 0) x.fillText(items[k], (k % W) * S + S / 2, Math.floor(k / W) * S + S / 2); });
    flames.forEach(f => f.cells.forEach(([r, c]) => { x.fillStyle = "#f97316"; x.fillRect(c * S + 3, r * S + 3, S - 6, S - 6); x.fillStyle = "#fde047"; x.fillRect(c * S + 9, r * S + 9, S - 18, S - 18); })); bombs.forEach(b => x.fillText("💣", b.c * S + S / 2, b.r * S + S / 2)); enemies.forEach(e => x.fillText("👾", e.c * S + S / 2, e.r * S + S / 2)); if (!inv || Math.floor(inv / 120) % 2) x.fillText("🧑‍🚀", pl.c * S + S / 2, pl.r * S + S / 2);
    info.innerHTML = `<span>❤️ ${lives}</span><span>👾 ${enemies.length}</span><span>🔥${range} · 💣${maxB}</span><span>⏱ ${fmtTime(Math.round(secs))}</span>`; }
  [["◀", 0, -1], ["▲", -1, 0], ["▼", 1, 0], ["▶", 0, 1]].forEach(([t, a, d]) => { const bt = el("button", "btn tt-b", t); bt.onclick = () => mv(a, d); pad.appendChild(bt); }); const bb = el("button", "btn tt-b", "💣 Bomba"); bb.onclick = bomb; pad.appendChild(bb);
  const kd = e => { const k = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0], a: [0, -1], d: [0, 1], w: [-1, 0], s: [1, 0] }[e.key.length === 1 ? e.key.toLowerCase() : e.key]; if (k) { e.preventDefault(); mv(...k); } else if (e.key === " ") { e.preventDefault(); bomb(); } }; document.addEventListener("keydown", kd);
  let last = performance.now(), raf; const loop = t => { if (over) return; step(Math.min(80, t - last)); last = t; raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); ctx.cleanup = () => { cancelAnimationFrame(raf); document.removeEventListener("keydown", kd); };
  function end(win) { if (over) return; over = true; draw(); const stars = win ? (secs < 60 ? 5 : secs < 100 ? 4 : lives === 2 ? 4 : 3) : enemies.length <= 2 ? 2 : 1; showResult(ctx, { win, stars, title: win ? "Tüm yaratıklar temizlendi!" : "Bomba sana patladı", text: `${win ? "4 yaratığı" : (4 - enemies.length) + " yaratığı"} ${fmtTime(Math.round(secs))} sürede ${win ? "temizledin" : "yok ettin"}.`, share: `${shareHead(ctx, win ? fmtTime(Math.round(secs)) : "kaybetti")}\n💣 Bomba Adam${shareTail(ctx)}` }); }
  ctx.auto = () => { enemies = []; end(true); }; draw();
}

/* ===== Tank Savaşı ===== */
function gTank(root, ctx, A) {
  const { el, ri, sfx, showResult, shareHead, shareTail, fmtTime } = A; const W = 15, H = 13, S = 28; const cv = el("canvas", "tk-cv"); cv.width = W * S; cv.height = H * S; const info = el("div", "ka-info"), pad = el("div", "tt-pad"); root.append(info, cv, pad); const x = cv.getContext("2d");
  const g = Array.from({ length: H }, (_, r) => Array.from({ length: W }, (_, c) => (r === 0 || c === 0 || r === H - 1 || c === W - 1) ? 1 : (r > H - 4 && c > 5 && c < 9) ? 0 : (r % 3 === 1 && c % 4 === 2 && ctx.rnd() < .7) ? 1 : (ctx.rnd() < .22 && r > 2 && r < H - 3) ? 2 : 0));
  g[H - 2][6] = 2; g[H - 2][8] = 2; g[H - 3][6] = 2; g[H - 3][7] = 2; g[H - 3][8] = 2; g[H - 2][7] = 3; // 3 = üs
  const T = S - 6; const mk = (c, r, col, ai) => ({ x: c * S + 3, y: r * S + 3, d: 0, col, ai, cd: 0, hp: 1, mt: 0 }); const me = mk(5, H - 2, "#22c55e", 0); me.hp = 3; me.d = 0;
  const en = []; [[1, 1], [W - 2, 1], [7, 1], [3, 4], [11, 4]].forEach(([c, r]) => { g[r][c] = 0; en.push(mk(c, r, "#ef4444", 1)); }); en.forEach(e => e.d = 2);
  let bullets = [], over = false, secs = 0, kills = 0, base = true, fire = false; const DV = [[0, -1], [1, 0], [0, 1], [-1, 0]]; const keys = {};
  const hitW = (px, py, w) => { for (let r = Math.floor(py / S); r <= Math.floor((py + w - 1) / S); r++) for (let c = Math.floor(px / S); c <= Math.floor((px + w - 1) / S); c++) if (g[r] && g[r][c]) return true; return false; };
  const hitT = (a, px, py) => [me, ...en].some(t => t !== a && t.hp > 0 && Math.abs(t.x - px) < T && Math.abs(t.y - py) < T);
  function move(t, d, sp) { t.d = d; const nx = t.x + DV[d][0] * sp, ny = t.y + DV[d][1] * sp; if (!hitW(nx, ny, T) && !hitT(t, nx, ny)) { t.x = nx; t.y = ny; return true; } return false; }
  function shoot(t) { if (t.cd > 0) return; t.cd = t.ai ? 1300 : 420; bullets.push({ x: t.x + T / 2, y: t.y + T / 2, d: t.d, o: t.ai ? 1 : 0 }); if (!t.ai) sfx("tap"); }
  function step(dt) { if (over) return; secs += dt / 1000; me.cd -= dt; if (fire) shoot(me); let d = keys.ArrowUp || keys.w ? 0 : keys.ArrowRight || keys.d ? 1 : keys.ArrowDown || keys.s ? 2 : keys.ArrowLeft || keys.a ? 3 : -1; if (d >= 0) move(me, d, 2.2);
    en.forEach(e => { if (e.hp <= 0) return; e.cd -= dt; e.mt -= dt; if (e.mt <= 0) { e.mt = 500 + ctx.rnd() * 900; const tgt = ctx.rnd() < .5 ? me : { x: 7 * S, y: (H - 2) * S }; const dx = tgt.x - e.x, dy = tgt.y - e.y; e.d = ctx.rnd() < .35 ? ri(ctx.rnd, 0, 3) : Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0); } if (!move(e, e.d, 1.1)) e.mt = 0; if (e.cd <= 0 && ctx.rnd() < .03) shoot(e); });
    bullets.forEach(b => { b.x += DV[b.d][0] * 5; b.y += DV[b.d][1] * 5; }); const keep = [];
    bullets.forEach(b => { const c = Math.floor(b.x / S), r = Math.floor(b.y / S); if (!g[r] || g[r][c] === undefined) return; const v = g[r][c]; if (v === 1) return; if (v === 2) { g[r][c] = 0; return; } if (v === 3) { g[r][c] = 0; base = false; sfx("bad"); return; }
      const tg = b.o ? [me] : en; for (const t of tg) if (t.hp > 0 && b.x > t.x && b.x < t.x + T && b.y > t.y && b.y < t.y + T) { t.hp--; if (t.ai && t.hp <= 0) { kills++; sfx("good"); } else if (!t.ai) sfx("bad"); return; } keep.push(b); }); bullets = keep;
    if (!base || me.hp <= 0) return end(false); if (en.every(e => e.hp <= 0)) return end(true); draw(); }
  function tank(t) { x.save(); x.translate(t.x + T / 2, t.y + T / 2); x.rotate(t.d * Math.PI / 2); x.fillStyle = t.col; x.fillRect(-T / 2, -T / 2, T, T); x.fillStyle = "#0004"; x.fillRect(-T / 2, -T / 2, 5, T); x.fillRect(T / 2 - 5, -T / 2, 5, T); x.fillStyle = "#fff6"; x.beginPath(); x.arc(0, 0, 6, 0, 7); x.fill(); x.fillStyle = t.col; x.fillRect(-2.5, -T / 2 - 4, 5, T / 2 + 4); x.restore(); }
  function draw() { x.fillStyle = "#1c1917"; x.fillRect(0, 0, W * S, H * S); x.font = (S - 6) + "px serif"; x.textAlign = "center"; x.textBaseline = "middle";
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) { const v = g[r][c]; if (v === 1) { x.fillStyle = "#64748b"; x.fillRect(c * S, r * S, S, S); x.fillStyle = "#94a3b8"; x.fillRect(c * S + 3, r * S + 3, S - 6, S - 6); } else if (v === 2) { x.fillStyle = "#b45309"; x.fillRect(c * S + 1, r * S + 1, S - 2, S - 2); x.fillStyle = "#7c2d12"; x.fillRect(c * S + 1, r * S + S / 2, S - 2, 2); x.fillRect(c * S + S / 2, r * S + 1, 2, S / 2); } else if (v === 3) x.fillText("🏰", c * S + S / 2, r * S + S / 2); }
    en.forEach(e => e.hp > 0 && tank(e)); if (me.hp > 0) tank(me); bullets.forEach(b => { x.fillStyle = b.o ? "#fca5a5" : "#fde047"; x.beginPath(); x.arc(b.x, b.y, 3, 0, 7); x.fill(); });
    info.innerHTML = `<span>❤️ ${me.hp}</span><span>💥 ${kills}/${en.length}</span><span>🏰 ${base ? "sağlam" : "yıkıldı"}</span><span>⏱ ${fmtTime(Math.round(secs))}</span>`; }
  [["◀", 3], ["▲", 0], ["▼", 2], ["▶", 1]].forEach(([t, d]) => { const bt = el("button", "btn tt-b", t); const on = () => { keys["_" + d] = 1; keys[["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"][d]] = 1; }, off = () => { delete keys["_" + d]; delete keys[["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"][d]]; }; bt.onpointerdown = e => { e.preventDefault(); on(); }; ["pointerup", "pointerleave", "pointercancel"].forEach(ev => bt.addEventListener(ev, off)); pad.appendChild(bt); });
  const fb = el("button", "btn tt-b", "💥 Ateş"); fb.onpointerdown = e => { e.preventDefault(); fire = true; }; ["pointerup", "pointerleave", "pointercancel"].forEach(ev => fb.addEventListener(ev, () => fire = false)); pad.appendChild(fb);
  const kd = e => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; if (k === " ") { e.preventDefault(); fire = true; } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(k)) { e.preventDefault(); keys[k] = 1; } }, ku = e => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; if (k === " ") fire = false; delete keys[k]; }; document.addEventListener("keydown", kd); document.addEventListener("keyup", ku);
  let last = performance.now(), raf; const loop = t => { if (over) return; step(Math.min(60, t - last)); last = t; raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); ctx.cleanup = () => { cancelAnimationFrame(raf); document.removeEventListener("keydown", kd); document.removeEventListener("keyup", ku); };
  function end(win) { if (over) return; over = true; draw(); const stars = win ? (me.hp === 3 && secs < 90 ? 5 : me.hp >= 2 ? 4 : 3) : kills >= 3 ? 2 : 1; showResult(ctx, { win, stars, title: win ? "Düşman tankları yok edildi!" : !base ? "Üssün yıkıldı" : "Tankın patladı", text: `${kills}/${en.length} düşman tankı, ${fmtTime(Math.round(secs))}.`, share: `${shareHead(ctx, kills + "/" + en.length)}\n🪖 Tank Savaşı${shareTail(ctx)}` }); }
  ctx.auto = () => { kills = en.length; en.forEach(e => e.hp = 0); end(true); }; draw();
}
window.PZX = Object.assign(window.PZX || {}, { satranc: gSatranc, mancala: gMancala, zuma: gZuma, bomba: gBomba, tank: gTank });
})();
