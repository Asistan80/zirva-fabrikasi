/* Zırva Bulmaca: sayı/mantık/refleks oyunları (Mayın, 2048, Sudoku 6x6, Işıklar, Sayı Dizisi, Çarpım Hızı, Renk Dizisi) */
(function () {
/* ===== Mayın Tarlası ===== */
function gMayin(root, ctx, A) {
  const { el, ri, sfx, showResult, shareHead, shareTail, fmtTime } = A; const N = 8, M = 10;
  let mines = null, rev = Array(N * N).fill(false), flg = Array(N * N).fill(false), over = false, flagMode = false, secs = 0, started = false;
  const info = el("div", "ka-info", ""); const board = el("div", "mn-grid"); board.style.setProperty("--n", N); const row = el("div", "row");
  const fm = el("button", "btn sm ghost", "🚩 Bayrak modu: kapalı"); row.appendChild(fm); root.append(info, board, row);
  const nb = i => { const r = Math.floor(i / N), c = i % N, o = []; for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { if (!a && !b) continue; const y = r + a, x = c + b; if (y >= 0 && y < N && x >= 0 && x < N) o.push(y * N + x); } return o; };
  const cnt = i => nb(i).filter(j => mines[j]).length;
  function seed(safe) { mines = Array(N * N).fill(false); const ban = new Set([safe, ...nb(safe)]); let p = 0; while (p < M) { const i = ri(ctx.rnd, 0, N * N - 1); if (!mines[i] && !ban.has(i)) { mines[i] = true; p++; } } }
  function open(i) { if (rev[i] || flg[i]) return; rev[i] = true; if (!mines[i] && cnt(i) === 0) nb(i).forEach(open); }
  const cells = []; for (let i = 0; i < N * N; i++) { const b = el("button", "mn-c", ""); let lp; b.onpointerdown = () => { lp = setTimeout(() => { lp = 0; flag(i); }, 450); }; b.onpointerup = b.onpointerleave = () => clearTimeout(lp);
    b.onclick = () => { if (lp === 0) { lp = null; return; } click(i); }; b.oncontextmenu = e => { e.preventDefault(); flag(i); }; board.appendChild(b); cells.push(b); }
  function flag(i) { if (over || rev[i]) return; flg[i] = !flg[i]; sfx("tap"); paint(); }
  function click(i) { if (over) return; if (flagMode) return flag(i); if (flg[i]) return; if (!mines) { seed(i); started = true; } if (mines[i]) { rev[i] = true; return end(false); } open(i); sfx("tap"); paint();
    if (rev.filter(Boolean).length === N * N - M) end(true); }
  const COL = ["", "#4c8dff", "#34d399", "#ef4444", "#a56bff", "#f59e0b", "#14b8a6", "#ec4899", "#94a3b8"];
  function paint() { cells.forEach((b, i) => { b.className = "mn-c"; b.style.color = ""; b.textContent = ""; if (rev[i]) { b.classList.add("r"); if (mines && mines[i]) { b.textContent = "💣"; b.classList.add("bomb"); } else { const n = cnt(i); if (n) { b.textContent = n; b.style.color = COL[n]; } } } else if (flg[i]) b.textContent = "🚩"; });
    info.innerHTML = `<span>💣 ${M - flg.filter(Boolean).length}</span><span>⏱ ${fmtTime(secs)}</span>`; }
  fm.onclick = () => { flagMode = !flagMode; fm.textContent = "🚩 Bayrak modu: " + (flagMode ? "açık" : "kapalı"); fm.classList.toggle("ghost", !flagMode); };
  const timer = setInterval(() => { if (started && !over) { secs++; paint(); } }, 1000); ctx.cleanup = () => clearInterval(timer);
  function end(win) { over = true; clearInterval(timer); if (!win) mines.forEach((m, i) => { if (m) rev[i] = true; }); paint();
    const stars = win ? (secs < 60 ? 5 : secs < 110 ? 4 : secs < 180 ? 3 : 2) : 1;
    showResult(ctx, { win, stars, title: win ? "Tarla temizlendi!" : "Bum! Mayına bastın", text: win ? `${fmtTime(secs)} sürede güvenli bölgeyi açtın.` : "Bir sonraki sefere daha dikkatli.", share: `${shareHead(ctx, win ? fmtTime(secs) : "patladı")}\n${win ? "🚩" : "💥"} ${N}x${N} · ${M} mayın${shareTail(ctx)}` }); }
  ctx.auto = () => { if (!mines) click(0); for (let i = 0; i < N * N; i++) if (!mines[i]) { open(i); } paint(); if (!over) end(true); };
  paint();
}

/* ===== 2048 ===== */
function gG2048(root, ctx, A) {
  const { el, ri, sfx, showResult, shareHead, shareTail } = A; const N = 4; let g = Array(16).fill(0), score = 0, over = false, best = 0;
  const info = el("div", "ka-info"); const board = el("div", "g48"); const row = el("div", "row"); const fin = el("button", "btn sm ghost", "🏁 Bitir"); row.appendChild(fin); root.append(info, board, row);
  const spawn = () => { const e = g.map((v, i) => v ? -1 : i).filter(i => i >= 0); if (!e.length) return; g[e[ri(ctx.rnd, 0, e.length - 1)]] = ctx.rnd() < .9 ? 2 : 4; };
  spawn(); spawn();
  function line(a) { const t = a.filter(x => x); for (let i = 0; i < t.length - 1; i++) if (t[i] === t[i + 1]) { t[i] *= 2; score += t[i]; t.splice(i + 1, 1); } while (t.length < N) t.push(0); return t; }
  function move(d) { if (over) return false; const before = g.join(); const ng = Array(16).fill(0);
    for (let k = 0; k < N; k++) { const idx = []; for (let j = 0; j < N; j++) idx.push(d === 0 ? k * N + j : d === 1 ? k * N + (N - 1 - j) : d === 2 ? j * N + k : (N - 1 - j) * N + k); const l = line(idx.map(i => g[i])); idx.forEach((i, j) => ng[i] = l[j]); }
    g = ng; if (g.join() === before) return false; spawn(); sfx("tap"); paint(); if (!can()) end(); return true; }
  const can = () => { if (g.includes(0)) return true; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const v = g[r * N + c]; if ((c < N - 1 && v === g[r * N + c + 1]) || (r < N - 1 && v === g[(r + 1) * N + c])) return true; } return false; };
  function paint() { best = Math.max(...g); info.innerHTML = `<span>Skor <b>${score}</b></span><span>En büyük <b>${best}</b></span>`; board.innerHTML = g.map(v => `<div class="t t${Math.min(v, 2048)}">${v || ""}</div>`).join(""); }
  const onKey = e => { const m = { ArrowLeft: 0, ArrowRight: 1, ArrowUp: 2, ArrowDown: 3 }[e.key]; if (m != null) { e.preventDefault(); move(m); } };
  document.addEventListener("keydown", onKey); let sx, sy; board.style.touchAction = "none";
  board.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; });
  board.addEventListener("pointerup", e => { if (sx == null) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null; if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return; move(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 0 : 1) : (dy < 0 ? 2 : 3)); });
  ctx.cleanup = () => document.removeEventListener("keydown", onKey);
  function end() { if (over) return; over = true; const win = best >= 256, stars = best >= 1024 ? 5 : best >= 512 ? 4 : best >= 256 ? 3 : best >= 128 ? 2 : 1;
    showResult(ctx, { win, stars, title: win ? "Karolar birleşti!" : "Hamle kalmadı", text: `En büyük kare <b>${best}</b>, skor ${score}. (256 ve üstü kazandırır)`, share: `${shareHead(ctx, best)}\n🔢 Skor ${score}${shareTail(ctx)}` }); }
  fin.onclick = end;
  ctx.auto = () => { let k = 0; const t = setInterval(() => { if (over || k++ > 4000) return clearInterval(t); for (const d of [0, 2, 1, 3]) if (move(d)) break; if (best >= 256) { clearInterval(t); end(); } }, 5); };
  paint();
}

/* ===== Sudoku 6x6 ===== */
function gSudoku(root, ctx, A) {
  const { el, shuffle, sfx, showResult, shareHead, shareTail, fmtTime } = A; const N = 6;
  const digs = shuffle([1, 2, 3, 4, 5, 6], ctx.rnd), bands = shuffle([0, 1, 2], ctx.rnd), rowsIn = [0, 1, 2].map(() => shuffle([0, 1], ctx.rnd)), stacks = shuffle([0, 1], ctx.rnd), colsIn = [0, 1].map(() => shuffle([0, 1, 2], ctx.rnd));
  const rmap = [], cmap = []; bands.forEach((b, bi) => rowsIn[bi].forEach(x => rmap.push(b * 2 + x))); stacks.forEach((s, si) => colsIn[si].forEach(x => cmap.push(s * 3 + x)));
  const sol = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const rr = rmap[r], cc = cmap[c]; sol.push(digs[(3 * (rr % 2) + Math.floor(rr / 2) + cc) % 6]); }
  const given = Array(36).fill(false); shuffle([...Array(36).keys()], ctx.rnd).slice(0, 16).forEach(i => given[i] = true);
  const v = sol.map((x, i) => given[i] ? x : 0); let sel = -1, secs = 0, over = false;
  const info = el("div", "ka-info"); const board = el("div", "sd-grid"); const pad = el("div", "sd-pad"); root.append(info, board, pad);
  const bad = i => { if (!v[i]) return false; const r = Math.floor(i / 6), c = i % 6; for (let j = 0; j < 36; j++) { if (j === i || v[j] !== v[i]) continue; const r2 = Math.floor(j / 6), c2 = j % 6; if (r2 === r || c2 === c || (Math.floor(r2 / 2) === Math.floor(r / 2) && Math.floor(c2 / 3) === Math.floor(c / 3))) return true; } return false; };
  function paint() { board.innerHTML = ""; v.forEach((x, i) => { const r = Math.floor(i / 6), c = i % 6; const b = el("button", "sd-c" + (given[i] ? " g" : "") + (i === sel ? " sel" : "") + (bad(i) ? " bad" : "") + (c === 2 ? " bR" : "") + (r % 2 === 1 && r < 5 ? " bB" : ""), x || ""); b.onclick = () => { if (!given[i] && !over) { sel = i; paint(); } }; board.appendChild(b); });
    info.innerHTML = `<span>⏱ ${fmtTime(secs)}</span><span>Dolu: ${v.filter(Boolean).length}/36</span>`; }
  [1, 2, 3, 4, 5, 6, "⌫"].forEach(k => { const b = el("button", "btn sm ghost", k); b.onclick = () => put(k === "⌫" ? 0 : k); pad.appendChild(b); });
  function put(k) { if (over || sel < 0 || given[sel]) return; v[sel] = k; sfx("tap"); paint(); if (v.every(Boolean) && !v.some((_, i) => bad(i))) end(); }
  const onKey = e => { if (/^[1-6]$/.test(e.key)) put(+e.key); else if (e.key === "Backspace" || e.key === "0") put(0); else if (sel >= 0 && e.key.startsWith("Arrow")) { e.preventDefault(); const d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -6, ArrowDown: 6 }[e.key]; const n = sel + d; if (n >= 0 && n < 36) { sel = n; paint(); } } };
  document.addEventListener("keydown", onKey); const timer = setInterval(() => { if (!over) { secs++; info.firstChild.textContent = "⏱ " + fmtTime(secs); } }, 1000); ctx.cleanup = () => { clearInterval(timer); document.removeEventListener("keydown", onKey); };
  function end() { over = true; clearInterval(timer); const stars = secs < 150 ? 5 : secs < 240 ? 4 : secs < 400 ? 3 : 2; showResult(ctx, { win: true, stars, title: "Sudoku çözüldü!", text: `${fmtTime(secs)} sürede doldurdun.`, share: `${shareHead(ctx, fmtTime(secs))}\n🧩 6x6 Sudoku${shareTail(ctx)}` }); }
  ctx.auto = () => { sol.forEach((x, i) => v[i] = x); paint(); end(); };
  paint();
}

/* ===== Işıklar ===== */
function gIsiklar(root, ctx, A) {
  const { el, ri, sfx, showResult, shareHead, shareTail } = A; const N = 5; let g = Array(25).fill(0), moves = 0, over = false; const presses = [];
  const tg = i => { const r = Math.floor(i / N), c = i % N;[[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { const y = r + a, x = c + b; if (y >= 0 && y < N && x >= 0 && x < N) g[y * N + x] ^= 1; }); };
  const used = new Set(); while (used.size < 7) used.add(ri(ctx.rnd, 0, 24)); used.forEach(i => { tg(i); presses.push(i); }); if (!g.some(Boolean)) { tg(12); presses.push(12); }
  const par = presses.length; const info = el("div", "ka-info"); const board = el("div", "lo-grid"); root.append(info, board);
  function paint() { board.innerHTML = ""; g.forEach((x, i) => { const b = el("button", "lo-c" + (x ? " on" : "")); b.onclick = () => press(i); board.appendChild(b); }); info.innerHTML = `<span>Hamle: <b>${moves}</b></span><span>Hedef: tüm ışıkları söndür (en iyi ≈ ${par})</span>`; }
  function press(i) { if (over) return; tg(i); moves++; sfx("tap"); paint(); if (!g.some(Boolean)) end(); }
  function end() { over = true; const d = moves - par, stars = d <= 0 ? 5 : d <= 4 ? 4 : d <= 10 ? 3 : d <= 20 ? 2 : 1; showResult(ctx, { win: true, stars, title: "Hepsi söndü!", text: `${moves} hamlede çözdün (en iyi ${par}).`, share: `${shareHead(ctx, moves + " hamle")}\n💡 5x5 Işıklar${shareTail(ctx)}` }); }
  ctx.auto = () => { presses.forEach(i => press(i)); };
  paint();
}

/* ===== Sayı Dizisi ===== */
function gDizi(root, ctx, A) {
  const { el, shuffle, ri, sfx, showResult, shareHead, shareTail, sleep } = A;
  function make() { const t = ri(ctx.rnd, 0, 6); let s = [], ans, hint; const a = ri(ctx.rnd, 1, 9);
    if (t === 0) { const d = ri(ctx.rnd, 2, 9); s = Array.from({ length: 6 }, (_, i) => a + d * i); hint = `Her adımda +${d}`; }
    else if (t === 1) { const r = ri(ctx.rnd, 2, 3); s = Array.from({ length: 6 }, (_, i) => a * r ** i); hint = `Her adımda ×${r}`; }
    else if (t === 2) { const o = ri(ctx.rnd, 0, 4); s = Array.from({ length: 6 }, (_, i) => (i + 1 + o) ** 2); hint = "Ardışık sayıların kareleri"; }
    else if (t === 3) { const x = ri(ctx.rnd, 1, 4), y = ri(ctx.rnd, 1, 5); s = [x, y]; for (let i = 2; i < 6; i++) s.push(s[i - 1] + s[i - 2]); hint = "Her sayı öncekilerin toplamı"; }
    else if (t === 4) { const d1 = ri(ctx.rnd, 2, 6), d2 = ri(ctx.rnd, 1, 5); s = [a]; for (let i = 1; i < 6; i++) s.push(s[i - 1] + (i % 2 ? d1 : -d2)); hint = `Sırayla +${d1} ve −${d2}`; }
    else if (t === 5) { s = Array.from({ length: 6 }, (_, i) => a + (i * (i + 1)) / 2 * 2); hint = "Artış her adımda 2 büyüyor"; }
    else { const d = ri(ctx.rnd, 3, 8); s = Array.from({ length: 6 }, (_, i) => 60 - d * i); hint = `Her adımda −${d}`; }
    ans = s.pop(); const o = new Set([ans]); while (o.size < 4) { const x = ans + ri(ctx.rnd, -9, 9); if (x !== ans && x > 0) o.add(x); } return { s, ans, hint, opts: shuffle([...o], ctx.rnd) }; }
  const qs = Array.from({ length: 6 }, make); let i = 0, score = 0, lock = false, res = [];
  const prog = el("div", "em-prog"), card = el("div", "tf-card"), opts = el("div", "em-opts"), why = el("div", "tf-why muted small"); root.append(prog, card, opts, why);
  function show() { const q = qs[i]; prog.innerHTML = qs.map((_, k) => `<span class="${k < i ? (res[k] ? "ok" : "no") : k === i ? "now" : ""}"></span>`).join(""); card.innerHTML = q.s.join(" , ") + " , <b>?</b>"; why.textContent = ""; opts.innerHTML = ""; q.opts.forEach(x => { const b = el("button", "em-opt", x); b.onclick = () => pick(b, x); opts.appendChild(b); }); }
  async function pick(b, x) { if (lock) return; lock = true; const q = qs[i], ok = x === q.ans; res.push(ok); if (ok) { score++; b.classList.add("good"); sfx("good"); } else { b.classList.add("bad"); sfx("bad"); [...opts.children].forEach(y => { if (+y.textContent === q.ans) y.classList.add("good"); }); } why.textContent = `Cevap ${q.ans}: ${q.hint}`; await sleep(1500); i++; lock = false; if (i < qs.length) show(); else end(); }
  function end() { prog.innerHTML = qs.map((_, k) => `<span class="${res[k] ? "ok" : "no"}"></span>`).join(""); const stars = score >= 6 ? 5 : score === 5 ? 4 : score === 4 ? 3 : score === 3 ? 2 : 1; showResult(ctx, { win: score >= 4, stars, title: score >= 4 ? "Örüntü avcısı!" : "Sayılar karıştı", text: `6 dizinin ${score} tanesini çözdün.`, share: `${shareHead(ctx, score + "/6")}\n${res.map(x => x ? "🟩" : "🟥").join("")}${shareTail(ctx)}` }); }
  ctx.auto = async () => { for (let k = 0; k < 6; k++) { const q = qs[i]; const b = [...opts.children].find(y => +y.textContent === q.ans); b.click(); await sleep(1600); } };
  show();
}

/* ===== Çarpım Hızı ===== */
function gCarpim(root, ctx, A) {
  const { el, shuffle, ri, sfx, showResult, shareHead, shareTail } = A; let left = 60, score = 0, wrong = 0, q, over = false, lock = false;
  const info = el("div", "ka-info"); const card = el("div", "tf-card big"); const opts = el("div", "em-opts"); root.append(info, card, opts);
  function next() { const a = ri(ctx.rnd, 3, 12), b = ri(ctx.rnd, 3, 12); const ans = a * b; const o = new Set([ans]); while (o.size < 4) { const x = ans + ri(ctx.rnd, -12, 12); if (x > 0 && x !== ans) o.add(x); } q = { a, b, ans }; card.textContent = `${a} × ${b} = ?`; opts.innerHTML = ""; shuffle([...o], ctx.rnd).forEach(x => { const bt = el("button", "em-opt", x); bt.onclick = () => pick(bt, x); opts.appendChild(bt); }); paint(); }
  function paint() { info.innerHTML = `<span>⏱ <b>${left}</b> sn</span><span>Doğru: <b>${score}</b></span><span>Yanlış: ${wrong}</span>`; }
  function pick(b, x) { if (over || lock) return; if (x === q.ans) { score++; sfx("good"); next(); } else { wrong++; left = Math.max(0, left - 3); sfx("bad"); b.classList.add("bad"); lock = true; setTimeout(() => { lock = false; if (!over) next(); }, 350); paint(); } }
  const timer = setInterval(() => { if (over) return; left--; paint(); if (left <= 0) end(); }, 1000); ctx.cleanup = () => clearInterval(timer);
  function end() { if (over) return; over = true; clearInterval(timer); const stars = score >= 30 ? 5 : score >= 24 ? 4 : score >= 18 ? 3 : score >= 12 ? 2 : 1; showResult(ctx, { win: score >= 12, stars, title: score >= 12 ? "Hesap makinesi!" : "Süre bitti", text: `60 saniyede ${score} doğru, ${wrong} yanlış. (Yanlış −3 sn)`, extra: { score }, share: `${shareHead(ctx, score + " doğru")}\n⚡ Çarpım Hızı${shareTail(ctx)}` }); }
  ctx.auto = () => { score = 20; end(); };
  next();
}

/* ===== Renk Dizisi (Simon) ===== */
function gSimon(root, ctx, A) {
  const { el, ri, sfx, tone, sleep, showResult, shareHead, shareTail } = A; const GOAL = 8, F = [262, 330, 392, 523], C = ["#ef4444", "#34d399", "#4c8dff", "#f59e0b"];
  const seq = Array.from({ length: GOAL }, () => ri(ctx.rnd, 0, 3)); let level = 1, pos = 0, busy = true, over = false, lives = 2;
  const info = el("div", "ka-info"); const pads = el("div", "sm-grid"); const btn = el("button", "btn", "▶ Başla"); const row = el("div", "row"); row.appendChild(btn); root.append(info, pads, row);
  const P = C.map((c, i) => { const b = el("button", "sm-pad"); b.style.setProperty("--c", c); b.onclick = () => tap(i); pads.appendChild(b); return b; });
  const flash = async (i, d = 380) => { P[i].classList.add("lit"); tone(F[i], d / 1000, "triangle", .15); await sleep(d); P[i].classList.remove("lit"); await sleep(120); };
  const paint = () => info.innerHTML = `<span>Seviye <b>${level}</b>/${GOAL}</span><span>Can: ${"❤️".repeat(lives)}</span>`;
  async function play() { busy = true; pos = 0; paint(); await sleep(500); for (let k = 0; k < level; k++) { if (over) return; await flash(seq[k], ctx.fast ? 60 : 380); } busy = false; }
  async function tap(i) { if (busy || over) return; await flash(i, 150); if (i === seq[pos]) { pos++; if (pos === level) { level++; if (level > GOAL) return end(true); sfx("good"); play(); } } else { sfx("bad"); lives--; if (lives <= 0) return end(false); paint(); play(); } }
  btn.onclick = () => { btn.hidden = true; play(); };
  function end(win) { over = true; const reached = Math.min(level - 1, GOAL), stars = win ? 5 : reached >= 6 ? 4 : reached >= 4 ? 3 : reached >= 2 ? 2 : 1; showResult(ctx, { win: win || reached >= 5, stars, title: win ? "Kusursuz hafıza!" : "Dizi bozuldu", text: `${reached} seviye tamamladın (hedef ${GOAL}).`, share: `${shareHead(ctx, reached + "/" + GOAL)}\n${C.map((_, i) => ["🟥", "🟩", "🟦", "🟧"][i]).join("")} Renk Dizisi${shareTail(ctx)}` }); }
  ctx.auto = () => { over = true; level = GOAL + 1; end(true); };
  paint();
}
window.PZX = Object.assign(window.PZX || {}, { mayin: gMayin, g2048: gG2048, sudoku: gSudoku, isiklar: gIsiklar, dizi: gDizi, carpim: gCarpim, simon: gSimon });
})();
