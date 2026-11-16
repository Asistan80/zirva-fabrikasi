/* Zırva Bulmaca v6.3: Sudoku 9x9, Blok Düşür (Tetris), Labirent, Reversi, Blackjack 21, Kara Karo, Zırva Kuşu */
(function () {
const CH = () => window.PZ_DATA.chooser;

/* ===== Sudoku 9x9 ===== */
function gSudoku9(root, ctx, A) {
  const modes = [["kolay", "🟢 Kolay", "42 ipucu · notlar ve 5 ipucu hakkı"], ["normal", "🟡 Normal", "34 ipucu · 3 ipucu hakkı"], ["zor", "🔴 Zor", "27 ipucu · 1 ipucu hakkı"]];
  CH()(root, A, "Sudoku zorluğunu seç", modes, m => run(m)); ctx.auto = () => { if (!ctx.__a) run("normal"); ctx.__a(); };
  function run(mode) {
    const { el, shuffle, sfx, showResult, shareHead, shareTail, fmtTime } = A; const N = 9, giv = { kolay: 42, normal: 34, zor: 27 }[mode]; let hintsLeft = { kolay: 5, normal: 3, zor: 1 }[mode];
    const bandsOrd = () => shuffle([0, 1, 2], ctx.rnd), digs = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], ctx.rnd);
    const rm = [], cm = []; bandsOrd().forEach(b => shuffle([0, 1, 2], ctx.rnd).forEach(x => rm.push(b * 3 + x))); bandsOrd().forEach(b => shuffle([0, 1, 2], ctx.rnd).forEach(x => cm.push(b * 3 + x)));
    const sol = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const rr = rm[r], cc = cm[c]; sol.push(digs[(3 * (rr % 3) + Math.floor(rr / 3) + cc) % 9]); }
    const given = Array(81).fill(false); shuffle([...Array(81).keys()], ctx.rnd).slice(0, giv).forEach(i => given[i] = true);
    const v = sol.map((x, i) => given[i] ? x : 0), notes = Array.from({ length: 81 }, () => new Set()); let sel = -1, secs = 0, over = false, noteMode = false, mistakes = 0;
    const info = el("div", "ka-info"), board = el("div", "sd9-grid"), pad = el("div", "sd-pad"), tools = el("div", "row"); root.append(info, board, pad, tools);
    const bad = i => { if (!v[i]) return false; const r = Math.floor(i / 9), c = i % 9; for (let j = 0; j < 81; j++) { if (j === i || v[j] !== v[i]) continue; const r2 = Math.floor(j / 9), c2 = j % 9; if (r2 === r || c2 === c || (Math.floor(r2 / 3) === Math.floor(r / 3) && Math.floor(c2 / 3) === Math.floor(c / 3))) return true; } return false; };
    function paint() { board.innerHTML = ""; const sv = sel >= 0 ? v[sel] : 0; v.forEach((x, i) => { const r = Math.floor(i / 9), c = i % 9; const same = sv && x === sv; const rel = sel >= 0 && (Math.floor(sel / 9) === r || sel % 9 === c);
        const b = el("button", "sd9-c" + (given[i] ? " g" : "") + (i === sel ? " sel" : same ? " same" : rel ? " rel" : "") + (bad(i) ? " bad" : "") + (c % 3 === 2 && c < 8 ? " bR" : "") + (r % 3 === 2 && r < 8 ? " bB" : ""), x || (notes[i].size ? `<span class="nt">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => notes[i].has(k) ? k : "&nbsp;").join("")}</span>` : "")); b.onclick = () => { if (!over) { sel = i; paint(); } }; board.appendChild(b); });
      info.innerHTML = `<span>⏱ ${fmtTime(secs)}</span><span>Dolu: ${v.filter(Boolean).length}/81</span><span>❌ ${mistakes}</span>`; }
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(k => { const b = el("button", "btn ghost sd9-k", k); b.onclick = () => put(k); pad.appendChild(b); });
    const nb = el("button", "btn sm ghost", "✏️ Not: kapalı"), er = el("button", "btn sm ghost", "⌫ Sil"), hn = el("button", "btn sm ghost", `💡 İpucu (${hintsLeft})`); tools.append(nb, er, hn);
    nb.onclick = () => { noteMode = !noteMode; nb.textContent = "✏️ Not: " + (noteMode ? "açık" : "kapalı"); nb.classList.toggle("ghost", !noteMode); };
    er.onclick = () => put(0);
    hn.onclick = () => { if (over || hintsLeft <= 0) return; let i = sel >= 0 && !given[sel] && v[sel] !== sol[sel] ? sel : v.findIndex((x, k) => !given[k] && x !== sol[k]); if (i < 0) return; v[i] = sol[i]; given[i] = true; notes[i].clear(); hintsLeft--; hn.textContent = `💡 İpucu (${hintsLeft})`; sel = i; sfx("good"); paint(); chk(); };
    function put(k) { if (over || sel < 0 || given[sel]) return; if (noteMode && k) { const n = notes[sel]; if (n.has(k)) n.delete(k); else n.add(k); v[sel] = 0; } else { v[sel] = k; notes[sel].clear(); if (k && k !== sol[sel]) { mistakes++; sfx("bad"); } else sfx("tap"); } paint(); chk(); }
    function chk() { if (v.every(Boolean) && !v.some((_, i) => bad(i))) end(); }
    const onKey = e => { if (/^[1-9]$/.test(e.key)) put(+e.key); else if (e.key === "Backspace" || e.key === "0" || e.key === "Delete") put(0); else if (e.key.toLowerCase() === "n") nb.click(); else if (sel >= 0 && e.key.startsWith("Arrow")) { e.preventDefault(); const d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -9, ArrowDown: 9 }[e.key]; const n = sel + d; if (n >= 0 && n < 81) { sel = n; paint(); } } };
    document.addEventListener("keydown", onKey); const timer = setInterval(() => { if (!over) { secs++; info.firstChild.textContent = "⏱ " + fmtTime(secs); } }, 1000); ctx.cleanup = () => { clearInterval(timer); document.removeEventListener("keydown", onKey); };
    function end() { over = true; clearInterval(timer); const lim = { kolay: [420, 700, 1100], normal: [600, 900, 1400], zor: [800, 1200, 1800] }[mode]; const stars = Math.max(1, (secs < lim[0] ? 5 : secs < lim[1] ? 4 : secs < lim[2] ? 3 : 2) - (mistakes > 6 ? 1 : 0)); showResult(ctx, { win: true, stars, title: "Sudoku çözüldü!", text: `[${mode.toUpperCase()}] ${fmtTime(secs)} sürede, ${mistakes} hatayla bitirdin.`, share: `${shareHead(ctx, fmtTime(secs) + " " + mode)}\n🧮 Sudoku 9x9${shareTail(ctx)}` }); }
    ctx.__a = () => { sol.forEach((x, i) => v[i] = x); paint(); end(); }; paint();
  }
}

/* ===== Blok Düşür (Tetris) ===== */
function gTetris(root, ctx, A) {
  const { el, ri, sfx, showResult, shareHead, shareTail } = A; const W = 10, H = 18, S = 26, GOAL = 10;
  const SH = [[[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]], [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]], [[0, 1, 1], [1, 1, 0]], [[1, 1, 0], [0, 1, 1]]], COL = ["#22d3ee", "#facc15", "#a855f7", "#3b82f6", "#f97316", "#22c55e", "#ef4444"];
  const info = el("div", "ka-info"), cv = el("canvas", "tt-cv"); cv.width = W * S; cv.height = H * S; const pad = el("div", "tt-pad"); root.append(info, cv, pad); const x = cv.getContext("2d");
  let g = Array.from({ length: H }, () => Array(W).fill(0)), cur, lines = 0, score = 0, over = false, bag = [], drop = 0, speed = 650;
  const nextP = () => { if (!bag.length) bag = A.shuffle([0, 1, 2, 3, 4, 5, 6], ctx.rnd); const t = bag.pop(); return { t, m: SH[t].map(r => r.slice()), x: 3, y: 0 }; };
  const fits = (m, px, py) => m.every((r, j) => r.every((v, i) => !v || (px + i >= 0 && px + i < W && py + j < H && (py + j < 0 || !g[py + j][px + i]))));
  const rot = m => m[0].map((_, i) => m.map(r => r[i]).reverse());
  function spawn() { cur = nextP(); if (!fits(cur.m, cur.x, cur.y)) end(false); }
  function lock() { cur.m.forEach((r, j) => r.forEach((v, i) => { if (v && cur.y + j >= 0) g[cur.y + j][cur.x + i] = cur.t + 1; })); let n = 0; for (let r = H - 1; r >= 0; r--) if (g[r].every(Boolean)) { g.splice(r, 1); g.unshift(Array(W).fill(0)); n++; r++; }
    if (n) { lines += n; score += [0, 100, 300, 500, 800][n]; sfx("good"); speed = Math.max(180, 650 - lines * 35); if (lines >= GOAL) { draw(); return end(true); } } else sfx("tap"); spawn(); }
  const mv = (dx, dy) => { if (over) return false; if (fits(cur.m, cur.x + dx, cur.y + dy)) { cur.x += dx; cur.y += dy; draw(); return true; } if (dy) { lock(); draw(); } return false; };
  const rt = () => { if (over) return; const m = rot(cur.m); for (const k of [0, -1, 1, -2, 2]) if (fits(m, cur.x + k, cur.y)) { cur.m = m; cur.x += k; break; } draw(); };
  const hard = () => { if (over) return; while (fits(cur.m, cur.x, cur.y + 1)) cur.y++; lock(); draw(); };
  function cell(i, j, c, a) { x.fillStyle = COL[c - 1]; x.globalAlpha = a || 1; x.fillRect(i * S + 1, j * S + 1, S - 2, S - 2); x.fillStyle = "#fff3"; x.fillRect(i * S + 1, j * S + 1, S - 2, 5); x.globalAlpha = 1; }
  function draw() { x.fillStyle = "#0b1220"; x.fillRect(0, 0, W * S, H * S); x.strokeStyle = "#ffffff10"; for (let i = 0; i <= W; i++) { x.beginPath(); x.moveTo(i * S, 0); x.lineTo(i * S, H * S); x.stroke(); } for (let j = 0; j <= H; j++) { x.beginPath(); x.moveTo(0, j * S); x.lineTo(W * S, j * S); x.stroke(); }
    g.forEach((r, j) => r.forEach((v, i) => v && cell(i, j, v))); if (cur) { let gy = cur.y; while (fits(cur.m, cur.x, gy + 1)) gy++; cur.m.forEach((r, j) => r.forEach((v, i) => v && cell(cur.x + i, gy + j, cur.t + 1, .22))); cur.m.forEach((r, j) => r.forEach((v, i) => v && cell(cur.x + i, cur.y + j, cur.t + 1))); }
    info.innerHTML = `<span>Satır: <b>${lines}</b>/${GOAL}</span><span>Skor: ${score}</span>`; }
  [["◀", () => mv(-1, 0)], ["⟳", rt], ["▶", () => mv(1, 0)], ["▼", () => mv(0, 1)], ["⏬", hard]].forEach(([t, f]) => { const b = el("button", "btn tt-b", t); b.onclick = f; pad.appendChild(b); });
  const kd = e => { const k = { ArrowLeft: () => mv(-1, 0), ArrowRight: () => mv(1, 0), ArrowDown: () => mv(0, 1), ArrowUp: rt, " ": hard }[e.key]; if (k) { e.preventDefault(); k(); } }; document.addEventListener("keydown", kd);
  let last = performance.now(), raf; const loop = t => { if (over) return; if (t - last > speed) { last = t; mv(0, 1); } raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop);
  ctx.cleanup = () => { cancelAnimationFrame(raf); document.removeEventListener("keydown", kd); };
  function end(win) { if (over) return; over = true; const stars = win ? (score >= 1200 ? 5 : 4) : lines >= 7 ? 3 : lines >= 4 ? 2 : 1; showResult(ctx, { win, stars, title: win ? "Blok ustası!" : "Bloklar tavana değdi", text: `${lines} satır temizledin (hedef ${GOAL}), skor ${score}.`, share: `${shareHead(ctx, lines + " satır")}\n🧱 Blok Düşür · skor ${score}${shareTail(ctx)}` }); }
  ctx.auto = () => { lines = GOAL; end(true); }; spawn(); draw();
}

/* ===== Labirent ===== */
function gLabirent(root, ctx, A) {
  CH()(root, A, "Labirent boyutunu seç", [["11", "🟢 Küçük", "11x11"], ["17", "🟡 Orta", "17x17"], ["23", "🔴 Büyük", "23x23"]], m => run(+m)); ctx.auto = () => { if (!ctx.__a) run(11); ctx.__a(); };
  function run(N) {
    const { el, ri, shuffle, sfx, showResult, shareHead, shareTail, fmtTime } = A; const S = Math.floor(360 / N) * 1 || 16; const cv = el("canvas", "lb-cv"); cv.width = cv.height = N * S; const info = el("div", "ka-info"), pad = el("div", "tt-pad"); root.append(info, cv, pad); const x = cv.getContext("2d");
    const m = Array.from({ length: N }, () => Array(N).fill(1)); const st = [[1, 1]]; m[1][1] = 0; while (st.length) { const [r, c] = st[st.length - 1]; const ds = shuffle([[0, 2], [2, 0], [0, -2], [-2, 0]], ctx.rnd).filter(([a, b]) => r + a > 0 && r + a < N - 1 && c + b > 0 && c + b < N - 1 && m[r + a][c + b]); if (!ds.length) { st.pop(); continue; } const [a, b] = ds[0]; m[r + a / 2][c + b / 2] = 0; m[r + a][c + b] = 0; st.push([r + a, c + b]); }
    const stars = new Set(); while (stars.size < 3) { const r = ri(ctx.rnd, 1, N - 2), c = ri(ctx.rnd, 1, N - 2); if (!m[r][c] && !(r === 1 && c === 1) && !(r === N - 2 && c === N - 2)) stars.add(r * N + c); }
    let p = [1, 1], got = 0, secs = 0, over = false, steps = 0;
    function draw() { x.fillStyle = "#0b1220"; x.fillRect(0, 0, N * S, N * S); for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (m[r][c]) { x.fillStyle = (r + c) % 2 ? "#4c1d95" : "#5b21b6"; x.fillRect(c * S, r * S, S, S); }
      x.font = (S - 3) + "px serif"; x.textBaseline = "middle"; x.textAlign = "center"; stars.forEach(k => x.fillText("⭐", (k % N) * S + S / 2, Math.floor(k / N) * S + S / 2 + 1)); x.fillText("🏁", (N - 2) * S + S / 2, (N - 2) * S + S / 2 + 1); x.fillText("🧑", p[1] * S + S / 2, p[0] * S + S / 2 + 1);
      info.innerHTML = `<span>⏱ ${fmtTime(secs)}</span><span>⭐ ${got}/3</span><span>Adım: ${steps}</span>`; }
    function mv(dr, dc) { if (over) return; const r = p[0] + dr, c = p[1] + dc; if (m[r][c]) return; p = [r, c]; steps++; if (stars.delete(r * N + c)) { got++; sfx("good"); } else sfx("tap"); draw(); if (r === N - 2 && c === N - 2) end(); }
    [["◀", -0, -1], ["▲", -1, 0], ["▼", 1, 0], ["▶", 0, 1]].forEach(([t, a, b]) => { const bt = el("button", "btn tt-b", t); bt.onclick = () => mv(a, b); pad.appendChild(bt); });
    const kd = e => { const k = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[e.key]; if (k) { e.preventDefault(); mv(...k); } }; document.addEventListener("keydown", kd); let sx, sy; cv.style.touchAction = "none"; cv.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; }); cv.addEventListener("pointerup", e => { if (sx == null) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null; if (Math.max(Math.abs(dx), Math.abs(dy)) < 16) return; Math.abs(dx) > Math.abs(dy) ? mv(0, Math.sign(dx)) : mv(Math.sign(dy), 0); });
    const t = setInterval(() => { if (!over) { secs++; draw(); } }, 1000); ctx.cleanup = () => { clearInterval(t); document.removeEventListener("keydown", kd); };
    function end() { over = true; clearInterval(t); const lim = N * 8; const sr = Math.max(1, (secs < lim ? 4 : secs < lim * 1.8 ? 3 : 2) + (got === 3 ? 1 : 0)); showResult(ctx, { win: true, stars: Math.min(5, sr), title: "Çıkışı buldun!", text: `${N}x${N} labirenti ${fmtTime(secs)} sürede, ${got}/3 yıldızla geçtin.`, share: `${shareHead(ctx, fmtTime(secs))}\n🧭 Labirent ${N}x${N} · ⭐${got}/3${shareTail(ctx)}` }); }
    ctx.__a = () => { got = 3; end(); }; draw();
  }
}

/* ===== Reversi (bilgisayara karşı) ===== */
function gReversi(root, ctx, A) {
  CH()(root, A, "Reversi modu", [["1", "🤖 Bilgisayara karşı", "Tek kişilik"], ["2", "👥 2 Oyuncu", "Aynı cihazda sırayla"]], m => reversiRun(root, ctx, A, m === "2"));
  ctx.auto = () => { if (!ctx.__a) reversiRun(root, ctx, A, false); ctx.__a(); };
}
function reversiRun(root, ctx, A, two) {
  const { el, sfx, showResult, shareHead, shareTail, sleep } = A; const N = 8; let b = Array(64).fill(0); b[27] = b[36] = 2; b[28] = b[35] = 1; let turn = 1, over = false, busy = false;
  const info = el("div", "ka-info"), board = el("div", "rv-grid"); root.append(info, board); const D = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  const flips = (bd, i, p) => { const r = Math.floor(i / N), c = i % N, o = []; if (bd[i]) return o; D.forEach(([a, d]) => { const t = []; let y = r + a, x = c + d; while (y >= 0 && y < N && x >= 0 && x < N && bd[y * N + x] === 3 - p) { t.push(y * N + x); y += a; x += d; } if (t.length && y >= 0 && y < N && x >= 0 && x < N && bd[y * N + x] === p) o.push(...t); }); return o; };
  const moves = (bd, p) => { const o = []; for (let i = 0; i < 64; i++) { const f = flips(bd, i, p); if (f.length) o.push([i, f]); } return o; };
  const W = i => { const r = Math.floor(i / N), c = i % N; const e = k => k === 0 || k === 7, n = k => k === 1 || k === 6; if (e(r) && e(c)) return 25; if ((n(r) && e(c)) || (e(r) && n(c))) return -8; if (n(r) && n(c)) return -12; if (e(r) || e(c)) return 4; return 1; };
  const cnt = p => b.filter(v => v === p).length;
  function paint() { const mv = (two || turn === 1) && !busy ? moves(b, turn).map(x => x[0]) : []; info.innerHTML = two ? `<span>⚫ Siyah: <b>${cnt(1)}</b></span><span>Sıra: ${turn === 1 ? "⚫" : "⚪"}</span><span>⚪ Beyaz: <b>${cnt(2)}</b></span>` : `<span>⚫ Sen: <b>${cnt(1)}</b></span><span>⚪ Bilgisayar: <b>${cnt(2)}</b></span>`; board.innerHTML = ""; b.forEach((v, i) => { const c = el("button", "rv-c"); if (v) c.appendChild(el("div", "rv-d " + (v === 1 ? "bk" : "wh"))); else if (mv.includes(i)) c.appendChild(el("div", "rv-h")); c.onclick = () => play(i); board.appendChild(c); }); }
  const put = (i, f, p) => { b[i] = p; f.forEach(k => b[k] = p); };
  async function play(i) { if (two) { if (over) return; const f2 = flips(b, i, turn); if (!f2.length) return; put(i, f2, turn); sfx("tap"); const nx = 3 - turn; if (moves(b, nx).length) turn = nx; else if (!moves(b, turn).length) { paint(); return end(); } paint(); return; } if (over || busy || turn !== 1) return; const f = flips(b, i, 1); if (!f.length) return; busy = true; put(i, f, 1); sfx("tap"); paint(); await sleep(350); await aiTurns(); busy = false; paint(); }
  async function aiTurns() { for (;;) { if (!moves(b, 1).length && !moves(b, 2).length) return end(); const ms = moves(b, 2); if (!ms.length) { return; } let best = null, bv = -1e9; ms.forEach(([i, f]) => { const v = W(i) * 3 + f.length + ctx.rnd() * 3; if (v > bv) { bv = v; best = [i, f]; } }); await sleep(450); put(best[0], best[1], 2); sfx("tap"); paint(); if (moves(b, 1).length) return; if (!moves(b, 2).length) return end(); await sleep(350); } }
  function end() { if (over) return; over = true; const a = cnt(1), c = cnt(2), win = a > c; if (two) { showResult(ctx, { win: true, stars: 3, title: a === c ? "Berabere" : a > c ? "⚫ Siyah kazandı!" : "⚪ Beyaz kazandı!", text: `⚫ ${a} - ⚪ ${c}`, share: `${shareHead(ctx, a + "-" + c)}\n⚫⚪ Reversi 2 Oyuncu${shareTail(ctx)}` }); return; } showResult(ctx, { win, stars: win ? (a - c >= 24 ? 5 : a - c >= 12 ? 4 : 3) : a === c ? 2 : 1, title: win ? "Tahtayı fethettin!" : a === c ? "Berabere" : "Bilgisayar kazandı", text: `⚫ ${a} - ⚪ ${c}`, share: `${shareHead(ctx, a + "-" + c)}\n⚫⚪ Reversi${shareTail(ctx)}` }); }
  ctx.__a = () => { for (let i = 0; i < 64; i++) b[i] = i < 40 ? 1 : 2; end(); }; paint();
}

/* ===== Blackjack 21 ===== */
function gBlackjack(root, ctx, A) {
  const { el, shuffle, sfx, showResult, shareHead, shareTail, sleep } = A; const R = 5; let deck = shuffle([...Array(52).keys()], ctx.rnd), round = 0, wins = 0, losses = 0, push = 0, log = [], over = false, ph, dh, done = true;
  const rank = k => k % 13, suit = k => "♠♥♦♣"[Math.floor(k / 13)], lab = k => ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"][rank(k)];
  const val = h => { let t = 0, a = 0; h.forEach(k => { const r = rank(k); if (r === 0) { a++; t += 11; } else t += Math.min(10, r + 1); }); while (t > 21 && a--) t -= 10; return t; };
  const info = el("div", "ka-info"), tbl = el("div", "bj-table"), row = el("div", "row"), msg = el("div", "tf-why muted small"); const hit = el("button", "btn", "🃏 Çek"), stand = el("button", "btn ghost", "✋ Dur"), nx = el("button", "btn", "▶ Sonraki el"); row.append(hit, stand, nx); root.append(info, tbl, row, msg);
  const card = (k, hide) => hide ? `<div class="bj-c back">?</div>` : `<div class="bj-c ${suit(k) === "♥" || suit(k) === "♦" ? "red" : ""}">${lab(k)}<small>${suit(k)}</small></div>`;
  function paint(reveal) { info.innerHTML = `<span>El: <b>${Math.min(round, R)}</b>/${R}</span><span>✅ ${wins} · ❌ ${losses} · ➖ ${push}</span>`; tbl.innerHTML = `<div class="bj-row"><b>Kasa ${reveal ? "(" + val(dh) + ")" : ""}</b><div>${dh.map((k, i) => card(k, !reveal && i === 1)).join("")}</div></div><div class="bj-row"><b>Sen (${val(ph)})</b><div>${ph.map(k => card(k)).join("")}</div></div>`; hit.disabled = stand.disabled = done; nx.disabled = !done || over; }
  function deal() { if (deck.length < 15) deck = shuffle([...Array(52).keys()], ctx.rnd); round++; ph = [deck.pop(), deck.pop()]; dh = [deck.pop(), deck.pop()]; done = false; msg.textContent = ""; paint(false); if (val(ph) === 21) fin(); }
  function fin() { done = true; while (val(dh) < 17 && val(ph) <= 21) dh.push(deck.pop()); const p = val(ph), d = val(dh); let r, t; if (p > 21) { r = -1; t = "Battın!"; } else if (d > 21 || p > d) { r = 1; t = p === 21 && ph.length === 2 ? "Blackjack! 🎉" : "Kazandın!"; } else if (p === d) { r = 0; t = "Berabere"; } else { r = -1; t = "Kasa kazandı"; } if (r > 0) { wins++; sfx("good"); } else if (r < 0) { losses++; sfx("bad"); } else push++; log.push(r); msg.textContent = t + ` (Sen ${p} · Kasa ${d})`; paint(true); if (round >= R) setTimeout(end, 1100); }
  hit.onclick = () => { if (done) return; ph.push(deck.pop()); sfx("tap"); if (val(ph) >= 21) fin(); else paint(false); }; stand.onclick = () => { if (!done) fin(); }; nx.onclick = () => { if (done && !over && round < R) deal(); };
  function end() { over = true; const win = wins > losses, stars = wins >= 5 ? 5 : wins === 4 ? 4 : wins === 3 ? 3 : wins === 2 ? 2 : 1; showResult(ctx, { win, stars, title: win ? "Kasayı yendin!" : wins === losses ? "Berabere kaldınız" : "Kasa kazandı", text: `${R} elde ${wins} galibiyet, ${losses} mağlubiyet.`, share: `${shareHead(ctx, wins + "-" + losses)}\n${log.map(r => r > 0 ? "🟩" : r < 0 ? "🟥" : "⬜").join("")} Blackjack${shareTail(ctx)}` }); }
  ctx.auto = () => { wins = 4; losses = 1; end(); }; deal();
}

/* ===== Kara Karo ===== */
function gKaraKaro(root, ctx, A) {
  const { el, ri, sfx, showResult, shareHead, shareTail } = A; const GOAL = 40; let rows = Array.from({ length: 5 }, () => ri(ctx.rnd, 0, 3)), hit = 0, over = false, t0 = 0, ms = 0;
  const info = el("div", "ka-info"), board = el("div", "kk-board"); root.append(info, board);
  function paint() { board.innerHTML = ""; rows.slice().reverse().forEach((c, ri_) => { const r = el("div", "kk-row"); for (let k = 0; k < 4; k++) { const d = el("button", "kk-c" + (k === c ? " on" + (ri_ === 4 ? " first" : "") : "")); d.onclick = () => tap(k, 4 - ri_); r.appendChild(d); } board.appendChild(r); }); info.innerHTML = `<span>Karo: <b>${hit}</b>/${GOAL}</span><span>⏱ ${(ms / 1000).toFixed(1)} sn</span>`; }
  function tap(k, rowIdx) { if (over || rowIdx !== 0) return; if (!t0) t0 = performance.now(); if (k !== rows[0]) { sfx("bad"); return end(false); } hit++; sfx("tap"); rows.shift(); rows.push(ri(ctx.rnd, 0, 3)); ms = performance.now() - t0; paint(); if (hit >= GOAL) end(true); }
  const t = setInterval(() => { if (t0 && !over) { ms = performance.now() - t0; info.lastChild.innerHTML = `⏱ ${(ms / 1000).toFixed(1)} sn`; } }, 100); ctx.cleanup = () => clearInterval(t);
  const kd = e => { const k = { d: 0, f: 1, j: 2, k: 3, a: 0, s: 1, l: 3 }[e.key.toLowerCase()]; if (k != null) tap(k, 0); }; document.addEventListener("keydown", kd); const c0 = ctx.cleanup; ctx.cleanup = () => { c0(); document.removeEventListener("keydown", kd); };
  function end(win) { over = true; const s = ms / 1000, stars = win ? (s < 14 ? 5 : s < 18 ? 4 : s < 24 ? 3 : 2) : hit >= 25 ? 2 : 1; showResult(ctx, { win, stars, title: win ? "Parmakların ışık hızında!" : "Yanlış karo!", text: win ? `${GOAL} karoyu ${s.toFixed(1)} saniyede tamamladın.` : `${hit} karo doğru gittin.`, share: `${shareHead(ctx, win ? s.toFixed(1) + " sn" : hit + "/" + GOAL)}\n⬛ Kara Karo${shareTail(ctx)}` }); }
  ctx.auto = () => { hit = GOAL; ms = 15000; end(true); }; paint();
}

/* ===== Zırva Kuşu ===== */
function gKus(root, ctx, A) {
  const { el, ri, sfx, showResult, shareHead, shareTail } = A; const Wd = 300, Ht = 440, GOAL = 15; const info = el("div", "ka-info"), cv = el("canvas", "fb-cv"); cv.width = Wd; cv.height = Ht; root.append(info, cv); const x = cv.getContext("2d");
  let y = 200, vy = 0, pipes = [], score = 0, over = false, started = false, nxt = 0, frame = 0; const gaps = Array.from({ length: GOAL + 2 }, () => ri(ctx.rnd, 90, Ht - 200)); let pi = 0;
  const flap = () => { if (over) return; started = true; vy = -6.2; sfx("tap"); }; cv.onpointerdown = e => { e.preventDefault(); flap(); }; const kd = e => { if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); flap(); } }; document.addEventListener("keydown", kd); cv.style.touchAction = "none";
  function step() { if (over) return; frame++; if (started) { vy += .34; y += vy; if (frame % 85 === 0 && pi < gaps.length) pipes.push({ x: Wd, g: gaps[pi++], p: false }); pipes.forEach(p => p.x -= 2.2); pipes = pipes.filter(p => p.x > -60);
      pipes.forEach(p => { if (!p.p && p.x + 48 < 70) { p.p = true; score++; sfx("good"); if (score >= GOAL) return end(true); } if (70 + 14 > p.x && 70 - 14 < p.x + 48 && (y - 14 < p.g || y + 14 > p.g + 130)) end(false); }); if (y > Ht - 20 || y < -20) end(false); } draw(); }
  function draw() { const gr = x.createLinearGradient(0, 0, 0, Ht); gr.addColorStop(0, "#38bdf8"); gr.addColorStop(1, "#a5f3fc"); x.fillStyle = gr; x.fillRect(0, 0, Wd, Ht); pipes.forEach(p => { x.fillStyle = "#16a34a"; x.fillRect(p.x, 0, 48, p.g); x.fillRect(p.x, p.g + 130, 48, Ht); x.fillStyle = "#22c55e"; x.fillRect(p.x - 3, p.g - 18, 54, 18); x.fillRect(p.x - 3, p.g + 130, 54, 18); });
    x.font = "30px serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.save(); x.translate(70, y); x.rotate(Math.max(-.5, Math.min(.9, vy / 10))); x.fillText("🐦", 0, 0); x.restore(); if (!started) { x.fillStyle = "#0008"; x.font = "bold 18px sans-serif"; x.fillText("Başlamak için dokun / boşluk", Wd / 2, Ht / 2 + 60); }
    info.innerHTML = `<span>Boru: <b>${score}</b>/${GOAL}</span><span>Dokun veya boşluk tuşu</span>`; }
  const t = setInterval(step, 16); ctx.cleanup = () => { clearInterval(t); document.removeEventListener("keydown", kd); };
  function end(win) { if (over) return; over = true; draw(); const stars = win ? 5 : score >= 11 ? 4 : score >= 7 ? 3 : score >= 3 ? 2 : 1; showResult(ctx, { win, stars, title: win ? "Kuş özgür uçtu!" : "Kuş çakıldı", text: `${score} boru geçtin (hedef ${GOAL}).`, share: `${shareHead(ctx, score + "/" + GOAL)}\n🐦 Zırva Kuşu${shareTail(ctx)}` }); }
  ctx.auto = () => { score = GOAL; end(true); }; draw();
}
window.PZX = Object.assign(window.PZX || {}, { sudoku: gSudoku9, tetris: gTetris, labirent: gLabirent, reversi: gReversi, blackjack: gBlackjack, karakaro: gKaraKaro, kus: gKus });
})();
