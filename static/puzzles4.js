/* Zırva Bulmaca v6.2: Sesli Harf Kaçtı, Atasözü Tamamla, Hangisi Farklı, Başkent Bilmece, Renk Şaşırtmaca (Stroop),
   Hanoi Kulesi, Nonogram, Boya Taşması, Dört Gelsin, Köstebek Avı, Yılan, Su Sıralama */
(function () {
const D = () => window.PZ_DATA;
function quizShell(root, ctx, A, qs, o) { // ortak şıklı soru motoru: qs=[{q,opts,ans,why}]
  const { el, sfx, sleep, showResult, shareHead, shareTail } = A; let i = 0, score = 0, lock = false, res = [];
  const prog = el("div", "em-prog"), card = el("div", "tf-card"), opts = el("div", "em-opts"), why = el("div", "tf-why muted small"); root.append(prog, card, opts, why);
  const bar = () => prog.innerHTML = qs.map((_, k) => `<span class="${k < i ? (res[k] ? "ok" : "no") : k === i ? "now" : ""}"></span>`).join("");
  function show() { const q = qs[i]; bar(); card.innerHTML = q.q; card.classList.remove("pop"); void card.offsetWidth; card.classList.add("pop"); why.textContent = ""; opts.innerHTML = "";
    q.opts.forEach(x => { const b = el("button", "em-opt", x); b.onclick = () => pick(b, x); opts.appendChild(b); }); }
  async function pick(b, x) { if (lock) return; lock = true; const q = qs[i], ok = x === q.ans; res.push(ok);
    if (ok) { score++; b.classList.add("good"); sfx("good"); } else { b.classList.add("bad"); sfx("bad"); [...opts.children].forEach(y => { if (y.textContent === q.ans) y.classList.add("good"); }); }
    why.textContent = (ok ? "Doğru! " : "Olmadı. ") + (q.why || ""); await sleep(1500); i++; lock = false; if (i < qs.length) show(); else end(); }
  function end() { i = qs.length; bar(); const n = qs.length, r = score / n, stars = r >= 1 ? 5 : r >= .85 ? 4 : r >= .7 ? 3 : r >= .5 ? 2 : 1;
    showResult(ctx, { win: r >= (o.need || .7), stars, title: r >= (o.need || .7) ? o.win : o.lose, text: `${n} sorudan ${score} tanesini bildin.`, share: `${shareHead(ctx, score + "/" + n)}\n${res.map(x => x ? "🟩" : "🟥").join("")}${shareTail(ctx)}` }); }
  ctx.auto = async () => { for (let k = 0; k < qs.length; k++) { const q = qs[i]; [...opts.children].find(y => y.textContent === q.ans).click(); await sleep(1600); } };
  show();
}

/* ===== Sesli Harf Kaçtı ===== */
function gSesli(root, ctx, A) {
  const { shuffle } = A; const V = "AEIİOÖUÜ"; const pool = [...new Set(D().ALLW)].filter(w => { const n = [...w].length; return n >= 5 && n <= 9; });
  const ws = shuffle(pool, ctx.rnd).slice(0, 8);
  const qs = ws.map(w => { const L = [...w].length; const alts = shuffle(pool.filter(x => x !== w && [...x].length === L), ctx.rnd).slice(0, 3); while (alts.length < 3) alts.push(shuffle(pool, ctx.rnd).find(x => x !== w && !alts.includes(x)));
    return { q: `Sesli harfler kaçtı!<br><span style="font-size:1.8rem;letter-spacing:.15em">${[...w].map(c => V.includes(c) ? "•" : c).join(" ")}</span>`, opts: shuffle([w, ...alts], ctx.rnd), ans: w, why: w }; });
  quizShell(root, ctx, A, qs, { win: "Sesli harf dedektifi!", lose: "Sesliler kaçtı gitti", need: .62 });
}

/* ===== Atasözü Tamamla ===== */
const ATA = [["Damlaya damlaya", "göl olur"], ["Sakla samanı", "gelir zamanı"], ["Ağaç yaşken", "eğilir"], ["Komşu komşunun", "külüne muhtaçtır"], ["Bir elin nesi var,", "iki elin sesi var"], ["Sabreden derviş", "muradına ermiş"],
  ["Üzüm üzüme baka baka", "kararır"], ["Ne ekersen", "onu biçersin"], ["Aşkın gözü", "kördür"], ["Gülü seven", "dikenine katlanır"], ["Bugünün işini", "yarına bırakma"], ["Her işte", "bir hayır vardır"], ["Rüzgâr eken", "fırtına biçer"],
  ["Ayağını yorganına göre", "uzat"], ["Su akar,", "yolunu bulur"], ["Taşıma su ile", "değirmen dönmez"], ["Yuvayı", "dişi kuş yapar"], ["Sütten ağzı yanan", "yoğurdu üfleyerek yer"], ["Görünen köy", "kılavuz istemez"], ["Zorla güzellik", "olmaz"],
  ["Tatlı dil", "yılanı deliğinden çıkarır"], ["Acele işe", "şeytan karışır"], ["Kaz gelen yerden", "tavuk esirgenmez"], ["Bin bilsen de", "bir bilene danış"], ["Havlayan köpek", "ısırmaz"], ["Mum dibine", "ışık vermez"], ["Güneş girmeyen eve", "doktor girer"],
  ["Lafla peynir", "gemisi yürümez"], ["Ak akçe", "kara gün içindir"], ["Çok yaşayan bilmez,", "çok gezen bilir"], ["Sel gider,", "kum kalır"], ["Armut dibine", "düşer"], ["Denize düşen", "yılana sarılır"], ["Akıllı düşman", "akılsız dosttan evladır"], ["Bir musibet,", "bin nasihatten yeğdir"], ["Gönül ferman", "dinlemez"]];
function gAtasozu(root, ctx, A) {
  const { shuffle } = A; const sel = shuffle(ATA, ctx.rnd).slice(0, 8);
  const qs = sel.map(([a, b]) => ({ q: `<small class="muted">Atasözünü tamamla</small><br>${a} <b>…</b>`, opts: shuffle([b, ...shuffle(ATA.filter(x => x[1] !== b), ctx.rnd).slice(0, 3).map(x => x[1])], ctx.rnd), ans: b, why: `${a} ${b}.` }));
  quizShell(root, ctx, A, qs, { win: "Atasözü ustası!", lose: "Atalar kızdı", need: .62 });
}

/* ===== Hangisi Farklı ===== */
function gFarkli(root, ctx, A) {
  const { shuffle, ri } = A; const G = D().GROUPS, keys = Object.keys(G); const qs = [];
  for (let i = 0; i < 8; i++) { const ks = shuffle(keys, ctx.rnd); const a = ks[0], b = ks[1]; const wa = shuffle(G[a].split(" "), ctx.rnd).slice(0, 3), wb = shuffle(G[b].split(" "), ctx.rnd)[0];
    if (G[a].split(" ").includes(wb)) { i--; continue; } qs.push({ q: "<small class='muted'>Hangisi diğerlerinden farklı?</small>", opts: shuffle([...wa, wb], ctx.rnd), ans: wb, why: `Diğerleri "${a}" grubundan.` }); }
  quizShell(root, ctx, A, qs, { win: "Gözün keskin!", lose: "Hepsi aynı göründü", need: .62 });
}

/* ===== Başkent Bilmece ===== */
const CAP = [["Türkiye", "Ankara"], ["Almanya", "Berlin"], ["Fransa", "Paris"], ["İtalya", "Roma"], ["İspanya", "Madrid"], ["Portekiz", "Lizbon"], ["Yunanistan", "Atina"], ["Mısır", "Kahire"], ["Japonya", "Tokyo"], ["Çin", "Pekin"], ["Hindistan", "Yeni Delhi"], ["Rusya", "Moskova"],
  ["Brezilya", "Brasilia"], ["Arjantin", "Buenos Aires"], ["Kanada", "Ottawa"], ["Avustralya", "Canberra"], ["Meksika", "Meksiko"], ["ABD", "Washington"], ["İngiltere", "Londra"], ["Hollanda", "Amsterdam"], ["Belçika", "Brüksel"], ["Avusturya", "Viyana"], ["İsviçre", "Bern"],
  ["Polonya", "Varşova"], ["İsveç", "Stokholm"], ["Norveç", "Oslo"], ["Finlandiya", "Helsinki"], ["Danimarka", "Kopenhag"], ["Macaristan", "Budapeşte"], ["Romanya", "Bükreş"], ["Bulgaristan", "Sofya"], ["Azerbaycan", "Bakü"], ["Güney Kore", "Seul"], ["Suudi Arabistan", "Riyad"],
  ["İran", "Tahran"], ["Irak", "Bağdat"], ["Ukrayna", "Kiev"], ["Kazakistan", "Astana"], ["Pakistan", "İslamabad"], ["Güney Afrika", "Pretoria"], ["Kenya", "Nairobi"], ["Küba", "Havana"], ["Peru", "Lima"], ["Şili", "Santiago"], ["İrlanda", "Dublin"], ["Çekya", "Prag"]];
function gBaskent(root, ctx, A) {
  const { shuffle } = A; const sel = shuffle(CAP, ctx.rnd).slice(0, 10);
  const qs = sel.map(([c, k]) => ({ q: `<small class="muted">Başkent hangisi?</small><br><b style="font-size:1.6rem">${c}</b>`, opts: shuffle([k, ...shuffle(CAP.filter(x => x[1] !== k), ctx.rnd).slice(0, 3).map(x => x[1])], ctx.rnd), ans: k, why: `${c} → ${k}` }));
  quizShell(root, ctx, A, qs, { win: "Gezgin ruhlu!", lose: "Haritayı yeniden aç", need: .7 });
}

/* ===== Renk Şaşırtmaca (Stroop) ===== */
function gStroop(root, ctx, A) {
  const { el, shuffle, ri, sfx, showResult, shareHead, shareTail } = A; const C = [["KIRMIZI", "#ef4444"], ["MAVİ", "#3b82f6"], ["YEŞİL", "#22c55e"], ["SARI", "#eab308"], ["MOR", "#a855f7"], ["TURUNCU", "#f97316"]];
  let left = 30, score = 0, wrong = 0, over = false, q, lock = false;
  const info = el("div", "ka-info"), card = el("div", "tf-card big"), opts = el("div", "em-opts"), hint = el("div", "muted small", "Yazının RENGİNİ seç, ne yazdığına bakma!"); hint.style.textAlign = "center"; root.append(info, card, opts, hint);
  const paint = () => info.innerHTML = `<span>⏱ <b>${left}</b> sn</span><span>Doğru: <b>${score}</b></span><span>Yanlış: ${wrong}</span>`;
  function next() { const w = C[ri(ctx.rnd, 0, 5)]; let ink = C[ri(ctx.rnd, 0, 5)]; if (ctx.rnd() < .8) while (ink === w) ink = C[ri(ctx.rnd, 0, 5)]; q = { w, ink }; card.textContent = w[0]; card.style.color = ink[1];
    const ch = shuffle([ink, ...shuffle(C.filter(x => x !== ink), ctx.rnd).slice(0, 3)], ctx.rnd); opts.innerHTML = ""; ch.forEach(x => { const b = el("button", "em-opt", x[0]); b.onclick = () => pick(b, x); opts.appendChild(b); }); paint(); }
  function pick(b, x) { if (over || lock) return; if (x === q.ink) { score++; sfx("good"); next(); } else { wrong++; left = Math.max(0, left - 2); sfx("bad"); b.classList.add("bad"); lock = true; setTimeout(() => { lock = false; if (!over) next(); }, 300); paint(); } }
  const timer = setInterval(() => { if (over) return; left--; paint(); if (left <= 0) end(); }, 1000); ctx.cleanup = () => clearInterval(timer);
  function end() { if (over) return; over = true; clearInterval(timer); const stars = score >= 28 ? 5 : score >= 22 ? 4 : score >= 16 ? 3 : score >= 10 ? 2 : 1; showResult(ctx, { win: score >= 15, stars, title: score >= 15 ? "Beynin süper!" : "Renkler seni şaşırttı", text: `${score} doğru, ${wrong} yanlış.`, share: `${shareHead(ctx, score + " doğru")}\n🎨 Renk Şaşırtmaca${shareTail(ctx)}` }); }
  ctx.auto = () => { score = 20; end(); }; next();
}

/* ===== Hanoi Kulesi ===== */
function gHanoi(root, ctx, A) {
  const { el, sfx, showResult, shareHead, shareTail } = A; const N = 4, MIN = 15; let pegs = [[4, 3, 2, 1], [], []], sel = -1, moves = 0, over = false;
  const info = el("div", "ka-info"), board = el("div", "hn-board"), row = el("div", "row"); const rs = el("button", "btn sm ghost", "↩ Baştan"); row.appendChild(rs); root.append(info, board, row);
  const COL = ["", "#ef4444", "#f59e0b", "#34d399", "#4c8dff"];
  function paint() { info.innerHTML = `<span>Hamle: <b>${moves}</b></span><span>En az: ${MIN}</span>`; board.innerHTML = "";
    pegs.forEach((p, i) => { const d = el("button", "hn-peg" + (sel === i ? " sel" : "")); p.forEach(k => { const s = el("div", "hn-disk"); s.style.width = (28 + k * 16) + "%"; s.style.background = COL[k]; d.appendChild(s); }); d.onclick = () => tap(i); board.appendChild(d); }); }
  function tap(i) { if (over) return; if (sel < 0) { if (pegs[i].length) { sel = i; sfx("tap"); } } else { if (sel === i) sel = -1; else { const a = pegs[sel], b = pegs[i]; if (!b.length || b[b.length - 1] > a[a.length - 1]) { b.push(a.pop()); moves++; sel = -1; sfx("tap"); if (pegs[2].length === N) { paint(); return end(); } } else { sfx("bad"); sel = -1; } } } paint(); }
  rs.onclick = () => { if (over) return; pegs = [[4, 3, 2, 1], [], []]; moves = 0; sel = -1; paint(); };
  function end() { over = true; const stars = moves <= MIN ? 5 : moves <= 19 ? 4 : moves <= 25 ? 3 : moves <= 35 ? 2 : 1; showResult(ctx, { win: true, stars, title: "Kule taşındı!", text: `${moves} hamlede (en az ${MIN}) tüm diskleri üçüncü çubuğa taşıdın.`, share: `${shareHead(ctx, moves + " hamle")}\n🗼 Hanoi Kulesi${shareTail(ctx)}` }); }
  ctx.auto = () => { const mv = (n, a, b, c) => { if (!n) return; mv(n - 1, a, c, b); pegs[c].push(pegs[a].pop()); moves++; mv(n - 1, b, a, c); }; mv(N, 0, 1, 2); paint(); end(); };
  paint();
}

/* ===== Nonogram 5x5 ===== */
function gNonogram(root, ctx, A) {
  const { el, ri, sfx, showResult, shareHead, shareTail, fmtTime } = A; const N = 5; let sol;
  do { sol = Array.from({ length: N * N }, () => ctx.rnd() < .55 ? 1 : 0); } while (sol.filter(Boolean).length < 10 || [...Array(N).keys()].some(r => !sol.slice(r * N, r * N + N).some(Boolean)) || [...Array(N).keys()].some(c => !sol.some((v, i) => v && i % N === c)));
  const runs = a => { const o = []; let c = 0; a.forEach(v => { if (v) c++; else if (c) { o.push(c); c = 0; } }); if (c) o.push(c); return o.length ? o : [0]; };
  const rowC = [...Array(N).keys()].map(r => runs(sol.slice(r * N, r * N + N))), colC = [...Array(N).keys()].map(c => runs([...Array(N).keys()].map(r => sol[r * N + c])));
  const st = Array(N * N).fill(0); let secs = 0, over = false;
  const info = el("div", "ka-info"), wrap = el("div", "ng-wrap"); root.append(info, wrap);
  function paint() { wrap.innerHTML = ""; wrap.style.gridTemplateColumns = `auto repeat(${N},1fr)`; wrap.appendChild(el("div")); colC.forEach(c => wrap.appendChild(el("div", "ng-clue", c.join("<br>"))));
    for (let r = 0; r < N; r++) { wrap.appendChild(el("div", "ng-clue r", rowC[r].join(" "))); for (let c = 0; c < N; c++) { const i = r * N + c; const b = el("button", "ng-c" + (st[i] === 1 ? " on" : "") + (st[i] === 2 ? " x" : ""), st[i] === 2 ? "✕" : ""); b.onclick = () => tap(i); b.oncontextmenu = e => { e.preventDefault(); st[i] = st[i] === 2 ? 0 : 2; paint(); }; wrap.appendChild(b); } }
    info.innerHTML = `<span>⏱ ${fmtTime(secs)}</span><span>Dokun: ■ → ✕ → boş</span>`; }
  function ok() { for (let r = 0; r < N; r++) if (runs([...Array(N).keys()].map(c => st[r * N + c] === 1 ? 1 : 0)).join() !== rowC[r].join()) return false; for (let c = 0; c < N; c++) if (runs([...Array(N).keys()].map(r => st[r * N + c] === 1 ? 1 : 0)).join() !== colC[c].join()) return false; return true; }
  function tap(i) { if (over) return; st[i] = (st[i] + 1) % 3; sfx("tap"); paint(); if (ok()) end(); }
  const timer = setInterval(() => { if (!over) { secs++; info.firstChild.textContent = "⏱ " + fmtTime(secs); } }, 1000); ctx.cleanup = () => clearInterval(timer);
  function end() { over = true; clearInterval(timer); const stars = secs < 90 ? 5 : secs < 150 ? 4 : secs < 240 ? 3 : 2; showResult(ctx, { win: true, stars, title: "Resim ortaya çıktı!", text: `${fmtTime(secs)} sürede çözdün.`, share: `${shareHead(ctx, fmtTime(secs))}\n${[...Array(N).keys()].map(r => sol.slice(r * N, r * N + N).map(v => v ? "⬛" : "⬜").join("")).join("\n")}${shareTail(ctx)}` }); }
  ctx.auto = () => { sol.forEach((v, i) => st[i] = v ? 1 : 0); paint(); end(); }; paint();
}

/* ===== Boya Taşması (Flood) ===== */
function gFlood(root, ctx, A) {
  const { el, ri, sfx, showResult, shareHead, shareTail } = A; const N = 9, K = 6, LIM = 20, COL = ["#ef4444", "#f59e0b", "#34d399", "#4c8dff", "#a56bff", "#ec4899"];
  const g = Array.from({ length: N * N }, () => ri(ctx.rnd, 0, K - 1)); let moves = 0, over = false;
  const info = el("div", "ka-info"), board = el("div", "fl-grid"), pal = el("div", "fl-pal"); board.style.setProperty("--n", N); root.append(info, board, pal);
  const cells = g.map((_, i) => { const d = el("div", "fl-c"); board.appendChild(d); return d; }); COL.forEach((c, k) => { const b = el("button", "fl-b"); b.style.background = c; b.onclick = () => play(k); pal.appendChild(b); });
  function paint() { cells.forEach((d, i) => d.style.background = COL[g[i]]); info.innerHTML = `<span>Hamle: <b>${moves}</b>/${LIM}</span><span>Sol üstten boyayarak tüm tahtayı tek renk yap</span>`; }
  function play(k) { if (over) return; const o = g[0]; if (k === o) return; const q = [0], seen = new Set([0]); while (q.length) { const i = q.pop(); g[i] = k; const r = Math.floor(i / N), c = i % N;[[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { const y = r + a, x = c + b, j = y * N + x; if (y >= 0 && y < N && x >= 0 && x < N && !seen.has(j) && g[j] === o) { seen.add(j); q.push(j); } }); }
    moves++; sfx("tap"); paint(); if (g.every(v => v === g[0])) end(true); else if (moves >= LIM) end(false); }
  function end(win) { over = true; const stars = win ? (moves <= LIM - 7 ? 5 : moves <= LIM - 4 ? 4 : moves <= LIM - 2 ? 3 : 2) : 1; showResult(ctx, { win, stars, title: win ? "Tahta boyandı!" : "Hamle bitti", text: win ? `${moves} hamlede tek renk oldu.` : "Tahta tek renk olamadı.", share: `${shareHead(ctx, win ? moves + "/" + LIM : "X/" + LIM)}\n🎨 Boya Taşması${shareTail(ctx)}` }); }
  ctx.auto = () => { let t = 0; while (!g.every(v => v === g[0]) && t++ < 200) { let best = 0, bn = -1; for (let k = 0; k < K; k++) { if (k === g[0]) continue; const save = g.slice(), m0 = moves; const cnt = (() => { const gg = g.slice(); const o = gg[0]; const q = [0], seen = new Set([0]); let n = 0; while (q.length) { const i = q.pop(); gg[i] = k; const r = Math.floor(i / N), c = i % N;[[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { const y = r + a, x = c + b, j = y * N + x; if (y >= 0 && y < N && x >= 0 && x < N && !seen.has(j) && gg[j] === o) { seen.add(j); q.push(j); } }); } const o2 = gg[0]; const s2 = [0], sn = new Set([0]); while (s2.length) { const i = s2.pop(); n++; const r = Math.floor(i / N), c = i % N;[[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { const y = r + a, x = c + b, j = y * N + x; if (y >= 0 && y < N && x >= 0 && x < N && !sn.has(j) && gg[j] === o2) { sn.add(j); s2.push(j); } }); } return n; })(); if (cnt > bn) { bn = cnt; best = k; } } play(best); if (over) break; } };
  paint();
}

/* ===== Dört Gelsin (Connect 4, bilgisayara karşı) ===== */
function gDort(root, ctx, A) {
  window.PZ_DATA.chooser(root, A, "Dört Gelsin modu", [["1", "🤖 Bilgisayara karşı", "Tek kişilik"], ["2", "👥 2 Oyuncu", "Aynı cihazda sırayla"]], m => dortRun(root, ctx, A, m === "2"));
  ctx.auto = () => { if (!ctx.__a) dortRun(root, ctx, A, false); ctx.__a(); };
}
function dortRun(root, ctx, A, two) {
  const { el, sfx, showResult, shareHead, shareTail, sleep } = A; const R = 6, C = 7; let b = Array(R * C).fill(0), turn = 1, over = false, moves = 0, busy = false;
  const info = el("div", "ka-info"), board = el("div", "c4-grid"); root.append(info, board);
  const LINES = []; for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) [[0, 1], [1, 0], [1, 1], [1, -1]].forEach(([dr, dc]) => { const e = []; for (let k = 0; k < 4; k++) { const y = r + dr * k, x = c + dc * k; if (y < 0 || y >= R || x < 0 || x >= C) return; e.push(y * C + x); } LINES.push(e); });
  const win = (bd, p) => LINES.find(l => l.every(i => bd[i] === p)); const drop = (bd, c) => { for (let r = R - 1; r >= 0; r--) if (!bd[r * C + c]) return r * C + c; return -1; };
  const score = bd => { let s = 0; LINES.forEach(l => { const a = l.filter(i => bd[i] === 2).length, h = l.filter(i => bd[i] === 1).length; if (a && h) return; if (a) s += [0, 1, 4, 30, 1000][a]; if (h) s -= [0, 1, 5, 40, 1000][h]; }); for (let r = 0; r < R; r++) if (bd[r * C + 3] === 2) s += 3; return s; };
  function mm(bd, d, al, be, mx) { if (win(bd, 2)) return 100000 + d; if (win(bd, 1)) return -100000 - d; if (!d || bd.every(Boolean)) return score(bd); let best = mx ? -1e9 : 1e9; for (const c of [3, 2, 4, 1, 5, 0, 6]) { const i = drop(bd, c); if (i < 0) continue; bd[i] = mx ? 2 : 1; const v = mm(bd, d - 1, al, be, !mx); bd[i] = 0; if (mx) { best = Math.max(best, v); al = Math.max(al, v); } else { best = Math.min(best, v); be = Math.min(be, v); } if (be <= al) break; } return best; }
  function ai() { let bc = [], bv = -1e9; for (const c of [0, 1, 2, 3, 4, 5, 6]) { const i = drop(b, c); if (i < 0) continue; b[i] = 2; const v = mm(b, 3, -1e9, 1e9, false); b[i] = 0; if (v > bv) { bv = v; bc = [c]; } else if (v === bv) bc.push(c); } if (ctx.rnd() < .12) { const ok = [0, 1, 2, 3, 4, 5, 6].filter(c => drop(b, c) >= 0); return ok[Math.floor(ctx.rnd() * ok.length)]; } return bc[Math.floor(ctx.rnd() * bc.length)]; }
  function paint(wl) { info.innerHTML = two ? `<span>Sıra: ${turn === 1 ? "🔴 Kırmızı" : "🟡 Sarı"}</span><span>Hamle: ${moves}</span>` : `<span>🔴 Sen · 🟡 Bilgisayar</span><span>Hamle: ${moves}</span>`; board.innerHTML = ""; for (let c = 0; c < C; c++) { const col = el("button", "c4-col"); for (let r = 0; r < R; r++) { const v = b[r * C + c]; col.appendChild(el("div", "c4-d" + (v === 1 ? " p" : v === 2 ? " a" : "") + (wl && wl.includes(r * C + c) ? " w" : ""))); } col.onclick = () => play(c); board.appendChild(col); } }
  async function play(c) { if (over || busy || (!two && turn !== 1)) return; const i = drop(b, c); if (i < 0) return; busy = true; const me = turn; b[i] = me; moves++; sfx("tap"); let w = win(b, me); paint(w); if (w) return end(me, w); if (b.every(Boolean)) return end(0); if (two) { turn = 3 - me; busy = false; paint(); return; }
    turn = 2; await sleep(450); const ac = ai(); b[drop(b, ac)] = 2; w = win(b, 2); sfx("tap"); paint(w); if (w) return end(2, w); if (b.every(Boolean)) return end(0); turn = 1; busy = false; }
  function end(r, w) { over = true; if (two) { showResult(ctx, { win: true, stars: 3, title: r === 0 ? "Berabere" : r === 1 ? "🔴 Kırmızı kazandı!" : "🟡 Sarı kazandı!", text: `${moves} hamlede bitti.`, share: `${shareHead(ctx, r === 1 ? "Kırmızı" : r === 2 ? "Sarı" : "berabere")}\n🔴🟡 Dört Gelsin 2 Oyuncu${shareTail(ctx)}` }); return; } const stars = r === 1 ? (moves <= 12 ? 5 : moves <= 16 ? 4 : 3) : r === 0 ? 2 : 1; showResult(ctx, { win: r === 1, stars, title: r === 1 ? "Dördü sen yaptın!" : r === 0 ? "Berabere" : "Bilgisayar kazandı", text: `${moves} hamle oynadın.`, share: `${shareHead(ctx, r === 1 ? "kazandı" : r === 0 ? "berabere" : "kaybetti")}\n🔴🟡 Dört Gelsin${shareTail(ctx)}` }); }
  ctx.__a = () => end(1); paint();
}

/* ===== Köstebek Avı ===== */
function gKostebek(root, ctx, A) {
  const { el, ri, sfx, showResult, shareHead, shareTail } = A; let left = 30, score = 0, over = false; const info = el("div", "ka-info"), board = el("div", "km-grid"); root.append(info, board);
  const holes = [...Array(9)].map((_, i) => { const h = el("button", "km-h"); h.onclick = () => hit(i); board.appendChild(h); return h; }); const up = Array(9).fill(null);
  const paint = () => info.innerHTML = `<span>⏱ <b>${left}</b> sn</span><span>Puan: <b>${score}</b></span><span>🐹 +1 · ⭐ +3 · 💣 −3</span>`;
  function pop() { if (over) return; const i = ri(ctx.rnd, 0, 8); if (up[i]) return; const r = Math.random(); const t = r < .12 ? "b" : r < .22 ? "g" : "m"; up[i] = t; holes[i].textContent = t === "b" ? "💣" : t === "g" ? "⭐" : "🐹"; holes[i].classList.add("up"); setTimeout(() => { if (up[i] === t) { up[i] = null; holes[i].textContent = ""; holes[i].classList.remove("up"); } }, 750 - Math.min(250, (30 - left) * 9)); }
  function hit(i) { if (over || !up[i]) return; const t = up[i]; up[i] = null; holes[i].textContent = t === "b" ? "💥" : "✨"; holes[i].classList.remove("up"); setTimeout(() => { if (!up[i]) holes[i].textContent = ""; }, 250); if (t === "b") { score = Math.max(0, score - 3); sfx("bad"); } else { score += t === "g" ? 3 : 1; sfx("good"); } paint(); }
  const t1 = setInterval(pop, 420), t2 = setInterval(() => { if (over) return; left--; paint(); if (left <= 0) end(); }, 1000); ctx.cleanup = () => { clearInterval(t1); clearInterval(t2); };
  function end() { if (over) return; over = true; clearInterval(t1); clearInterval(t2); const stars = score >= 35 ? 5 : score >= 28 ? 4 : score >= 20 ? 3 : score >= 12 ? 2 : 1; showResult(ctx, { win: score >= 20, stars, title: score >= 20 ? "Köstebek avcısı!" : "Köstebekler kaçtı", text: `${score} puan topladın.`, share: `${shareHead(ctx, score + " puan")}\n🐹 Köstebek Avı${shareTail(ctx)}` }); }
  ctx.auto = () => { score = 25; end(); }; paint();
}

/* ===== Yılan ===== */
function gYilan(root, ctx, A) {
  const { el, ri, sfx, showResult, shareHead, shareTail } = A; const N = 16, S = 22, GOAL = 12; const cv = el("canvas"); cv.width = cv.height = N * S; cv.className = "yl-cv"; const info = el("div", "ka-info"); root.append(info, cv);
  const x = cv.getContext("2d"); let sn = [[8, 8], [7, 8], [6, 8]], dir = [1, 0], nd = [1, 0], food, eaten = 0, over = false, started = false;
  const spawn = () => { let p; do { p = [ri(ctx.rnd, 0, N - 1), ri(ctx.rnd, 0, N - 1)]; } while (sn.some(s => s[0] === p[0] && s[1] === p[1])); food = p; }; spawn();
  function draw() { x.fillStyle = "#0f172a"; x.fillRect(0, 0, N * S, N * S); x.fillStyle = "#ffffff0d"; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if ((i + j) % 2) x.fillRect(i * S, j * S, S, S);
    x.font = (S - 4) + "px serif"; x.textBaseline = "middle"; x.fillText("🍎", food[0] * S + 1, food[1] * S + S / 2 + 1); sn.forEach((s, i) => { x.fillStyle = i ? "#34d399" : "#10b981"; x.beginPath(); x.roundRect(s[0] * S + 1, s[1] * S + 1, S - 2, S - 2, 6); x.fill(); });
    info.innerHTML = `<span>🍎 ${eaten}/${GOAL}</span><span>${started ? "Ok tuşları / kaydırma" : "Başlamak için yön ver"}</span>`; }
  function turn(d) { if (d[0] === -dir[0] && d[1] === -dir[1]) return; nd = d; started = true; }
  function step() { if (over || !started) return; dir = nd; const h = [sn[0][0] + dir[0], sn[0][1] + dir[1]]; if (h[0] < 0 || h[0] >= N || h[1] < 0 || h[1] >= N || sn.some(s => s[0] === h[0] && s[1] === h[1])) return end(false);
    sn.unshift(h); if (h[0] === food[0] && h[1] === food[1]) { eaten++; sfx("good"); if (eaten >= GOAL) { draw(); return end(true); } spawn(); } else sn.pop(); draw(); }
  const K = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }; const kd = e => { if (K[e.key]) { e.preventDefault(); turn(K[e.key]); } }; document.addEventListener("keydown", kd);
  let sx, sy; cv.style.touchAction = "none"; cv.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; }); cv.addEventListener("pointerup", e => { if (sx == null) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null; if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return; turn(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]); });
  const t = setInterval(step, 125); ctx.cleanup = () => { clearInterval(t); document.removeEventListener("keydown", kd); };
  function end(win) { if (over) return; over = true; clearInterval(t); const stars = win ? 5 : eaten >= 9 ? 4 : eaten >= 6 ? 3 : eaten >= 3 ? 2 : 1; showResult(ctx, { win, stars, title: win ? "Yılan doydu!" : "Yılan kendini ısırdı", text: `${eaten} elma yedin (hedef ${GOAL}).`, share: `${shareHead(ctx, eaten + "/" + GOAL)}\n🐍 Yılan${shareTail(ctx)}` }); }
  ctx.auto = () => { eaten = GOAL; end(true); }; draw();
}

/* ===== Su Sıralama ===== */
function gSu(root, ctx, A) {
  const { el, shuffle, sfx, showResult, shareHead, shareTail } = A; const COL = ["#ef4444", "#f59e0b", "#34d399", "#4c8dff", "#a56bff", "#ec4899"], K = 5, CAP = 4;
  let segs = []; for (let k = 0; k < K; k++) for (let j = 0; j < CAP; j++) segs.push(k); segs = shuffle(segs, ctx.rnd);
  let tubes = Array.from({ length: K + 2 }, (_, i) => i < K ? segs.slice(i * CAP, i * CAP + CAP) : []); let sel = -1, moves = 0, over = false, hist = [];
  const info = el("div", "ka-info"), board = el("div", "ws-board"), row = el("div", "row"); const un = el("button", "btn sm ghost", "↩ Geri al"); row.appendChild(un); root.append(info, board, row);
  function paint() { info.innerHTML = `<span>Hamle: <b>${moves}</b></span><span>Aynı renkleri aynı tüpte topla</span>`; board.innerHTML = ""; tubes.forEach((t, i) => { const d = el("button", "ws-t" + (sel === i ? " sel" : "")); t.forEach(c => { const s = el("div", "ws-s"); s.style.background = COL[c]; d.appendChild(s); }); d.onclick = () => tap(i); board.appendChild(d); }); }
  const solved = () => tubes.every(t => !t.length || (t.length === CAP && t.every(c => c === t[0])));
  function tap(i) { if (over) return; if (sel < 0) { if (tubes[i].length) sel = i; } else if (sel === i) sel = -1; else { const a = tubes[sel], b = tubes[i], c = a[a.length - 1]; if (a.length && b.length < CAP && (!b.length || b[b.length - 1] === c)) { hist.push(JSON.stringify(tubes)); while (a.length && a[a.length - 1] === c && b.length < CAP) b.push(a.pop()); moves++; sel = -1; sfx("tap"); paint(); if (solved()) end(); return; } sfx("bad"); sel = -1; } paint(); }
  un.onclick = () => { if (over || !hist.length) return; tubes = JSON.parse(hist.pop()); moves = Math.max(0, moves - 1); sel = -1; paint(); };
  function end() { over = true; const stars = moves <= 18 ? 5 : moves <= 26 ? 4 : moves <= 36 ? 3 : 2; showResult(ctx, { win: true, stars, title: "Renkler ayrıldı!", text: `${moves} hamlede sıraladın.`, share: `${shareHead(ctx, moves + " hamle")}\n🧪 Su Sıralama${shareTail(ctx)}` }); }
  ctx.auto = () => { tubes = Array.from({ length: K + 2 }, (_, i) => i < K ? Array(CAP).fill(i) : []); paint(); end(); }; paint();
}
window.PZX = Object.assign(window.PZX || {}, { sesli: gSesli, atasozu: gAtasozu, farkli: gFarkli, baskent: gBaskent, stroop: gStroop, hanoi: gHanoi, nonogram: gNonogram, flood: gFlood, dortgelsin: gDort, kostebek: gKostebek, yilan: gYilan, susirala: gSu });
})();
