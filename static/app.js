const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
/* tema */
(function () {
  const t = LS.get("zf_theme", null);
  if (t) document.documentElement.dataset.theme = t;
})();
function toggleTheme() {
  const cur = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = cur; LS.set("zf_theme", cur);
}
function toast(msg) {
  const t = $("#toast"); if (!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200);
}
/* konfeti */
function confetti(n = 120) {
  const c = $("#confetti"); if (!c || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  c.width = innerWidth; c.height = innerHeight; const x = c.getContext("2d");
  const cols = ["#4c8dff", "#a56bff", "#ff5c7a", "#fbbf24", "#34d399"];
  const ps = Array.from({ length: n }, () => ({ x: innerWidth / 2, y: innerHeight * .35, vx: (Math.random() - .5) * 16, vy: -Math.random() * 14 - 4, r: 4 + Math.random() * 5, c: cols[Math.random() * 5 | 0], a: Math.random() * 6, va: (Math.random() - .5) * .4 }));
  let f = 0;
  (function loop() {
    x.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.a += p.va; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); x.restore(); });
    if (++f < 130) requestAnimationFrame(loop); else x.clearRect(0, 0, c.width, c.height);
  })();
}
/* daktilo */
function typeText(el, text, speed = 18, done) {
  el.textContent = ""; let i = 0;
  (function step() { el.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(step, speed); else done && done(); })();
}
function rotatePhrases(el, list) {
  let i = 0;
  (function next() { typeText(el, list[i++ % list.length], 38, () => setTimeout(next, 1800)); })();
}
/* sayaç animasyonu */
function countUp(el) {
  const end = +el.dataset.n || 0; const t0 = performance.now(), d = 1100;
  (function s(t) { const p = Math.min(1, (t - t0) / d); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString("tr-TR"); if (p < 1) requestAnimationFrame(s); })(t0);
}
/* görünür olunca animasyon */
function initReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); const tg = e.target; setTimeout(() => tg.classList.remove("rv", "in"), 900); $$("[data-n]", e.target).forEach(countUp); if (e.target.dataset.n) countUp(e.target); io.unobserve(e.target); } }), { threshold: .15 });
  $$(".rv").forEach(el => io.observe(el));
}
function initTilt() {
  $$(".tile").forEach(t => t.addEventListener("pointermove", e => { const r = t.getBoundingClientRect(); t.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%"); t.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%"); }));
}
function markSolved() {
  const solved = LS.get("zf_solved", {});
  $$("[data-test]").forEach(a => { if (solved[a.dataset.test]) a.classList.add("solved"); });
}
document.addEventListener("DOMContentLoaded", () => {
  initReveal(); initTilt(); markSolved();
  const b = $("#burger"); if (b) b.onclick = () => $(".links").classList.toggle("open");
  const th = $("#theme"); if (th) th.onclick = toggleTheme;
  const ph = $("#phrases"); if (ph) rotatePhrases(ph, JSON.parse(ph.dataset.list));
});

/* paylaşım kartı */
function wrapText(ctx, text, x, y, maxW, lh) {
  const words = text.split(" "); let line = "";
  for (const w of words) { const t = line + w + " "; if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line.trim(), x, y); line = w + " "; y += lh; } else line = t; }
  ctx.fillText(line.trim(), x, y); return y;
}
function makeCard(head, title, body, emoji, g) {
  g = g || ["#4c8dff", "#ff5c7a"];
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1080; const x = c.getContext("2d");
  const gr = x.createLinearGradient(0, 0, 1080, 1080); gr.addColorStop(0, g[0]); gr.addColorStop(.5, "#a56bff"); gr.addColorStop(1, g[1]);
  x.fillStyle = gr; x.fillRect(0, 0, 1080, 1080);
  x.fillStyle = "rgba(255,255,255,.08)"; for (let i = 0; i < 14; i++) { x.beginPath(); x.arc((i * 197) % 1080, (i * 331) % 1080, 60 + (i * 23) % 90, 0, 7); x.fill(); }
  x.fillStyle = "rgba(0,0,0,.30)"; x.beginPath(); x.roundRect(60, 60, 960, 960, 48); x.fill();
  x.fillStyle = "#fff"; x.textAlign = "center";
  x.font = "700 34px sans-serif"; x.fillText(head, 540, 140);
  if (emoji) { x.font = "150px sans-serif"; x.fillText(emoji, 540, 330); }
  x.font = "800 66px sans-serif"; const y = wrapText(x, title, 540, 450, 860, 78);
  x.font = "400 40px sans-serif"; wrapText(x, body, 540, y + 84, 840, 54);
  x.font = "600 30px sans-serif"; x.fillText("🏭 Zırva Fabrikası · mizah amaçlıdır", 540, 990);
  return c;
}
function saveCard(canvas, name) {
  canvas.toBlob(async b => {
    const f = new File([b], name + ".png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], title: "Zırva Fabrikası" }); return; } catch (e) {} }
    const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name + ".png"; a.click(); toast("Kart indirildi ✓");
  });
}
function waShare(text) { window.open("https://wa.me/?text=" + encodeURIComponent(text + " — " + location.origin), "_blank"); }
async function post(url, body) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.error || "hata"); return d;
}

/* --- mazeret --- */
function initMazeret() {
  let last = "", lastScore = 0;
  const hist = () => LS.get("zf_hist", []), favs = () => LS.get("zf_fav", []);
  function renderLists() {
    for (const [id, list, empty] of [["hist", hist(), "Henüz mazeret üretmedin."], ["favs", favs(), "Favori yok. Bir mazereti ⭐ ile kaydet."]]) {
      const box = $("#" + id); box.innerHTML = "";
      if (!list.length) { box.innerHTML = `<p class="muted small">${empty}</p>`; continue; }
      list.forEach((t, i) => {
        const d = document.createElement("div"); d.className = "item";
        d.innerHTML = `<span></span><button title="Kopyala">📋</button>${id === "hist" ? '<button title="Favori">⭐</button>' : ""}<button title="Sil">🗑️</button>`;
        d.firstChild.textContent = t; const bs = $$("button", d);
        bs[0].onclick = () => { navigator.clipboard && navigator.clipboard.writeText(t); toast("Kopyalandı ✓"); };
        if (id === "hist") { bs[1].onclick = () => addFav(t); bs[2].onclick = () => { const h = hist(); h.splice(i, 1); LS.set("zf_hist", h); renderLists(); }; }
        else bs[1].onclick = () => { const f = favs(); f.splice(i, 1); LS.set("zf_fav", f); renderLists(); };
        box.appendChild(d);
      });
    }
  }
  function addFav(t) { const f = favs(); if (!f.includes(t)) { f.unshift(t); LS.set("zf_fav", f.slice(0, 30)); toast("Favorilere eklendi ⭐"); renderLists(); } }
  async function gen(variant) {
    const btns = $$("#go,.var"); btns.forEach(b => b.disabled = true); $("#go").textContent = "⚙️ Fabrika çalışıyor...";
    try {
      const d = await post("/api/mazeret", { kime: $("#kime").value, ne: $("#ne").value, ton: $("input[name=ton]:checked").value, detail: $("#detail").value, variant, prev: last });
      last = d.text; lastScore = d.score;
      $("#out").hidden = false; $("#out").style.animation = "none"; void $("#out").offsetWidth; $("#out").style.animation = "";
      typeText($("#txt"), d.text, 16);
      $("#note").textContent = d.note || (d.mode === "ai" ? `🤖 Yapay zekâ üretti · kalan hak: ${d.left}` : "🛠️ Yedek fabrika üretti");
      $("#sc").textContent = "%" + d.score; setTimeout(() => $("#scbar").style.width = d.score + "%", 50); $("#scbar").style.width = "0";
      const h = hist(); h.unshift(d.text); LS.set("zf_hist", h.slice(0, 20)); renderLists();
      confetti(60);
    } catch (e) { $("#out").hidden = false; $("#txt").textContent = "Fabrikada arıza var, tekrar dene."; }
    btns.forEach(b => b.disabled = false); $("#go").textContent = "✨ Mazeret üret";
  }
  $("#go").onclick = () => gen("");
  $$(".var").forEach(b => b.onclick = () => gen(b.dataset.v));
  $("#rand").onclick = () => {
    const k = $("#kime"), n = $("#ne"); k.selectedIndex = Math.random() * k.options.length | 0; n.selectedIndex = Math.random() * n.options.length | 0;
    const t = $$("input[name=ton]"); t[Math.random() * t.length | 0].checked = true; gen("");
  };
  $("#copy").onclick = () => { navigator.clipboard && navigator.clipboard.writeText(last); toast("Kopyalandı ✓"); };
  $("#fav").onclick = () => addFav(last);
  $("#wa").onclick = () => waShare(last);
  $("#card").onclick = () => saveCard(makeCard("MAZERET FABRİKASI", "Resmi Mazeretim", last, "🛠️"), "mazeret");
  $("#clear").onclick = () => { LS.set("zf_hist", []); renderLists(); };
  renderLists();
}

/* --- kızartma --- */
function initRoast() {
  let last = "", src = "";
  $("#go").onclick = async () => {
    const text = $("#text").value.trim(); if (text.length < 3) return toast("Önce kızartılacak bir şey yaz 🔥");
    $("#go").disabled = true; $("#go").textContent = "🔥 Kızartılıyor...";
    try {
      const d = await post("/api/kizartma", { text, level: $("input[name=lv]:checked").value });
      last = d.text; src = text; $("#out").hidden = false; typeText($("#txt"), d.text, 16);
      $("#note").textContent = d.note || (d.mode === "ai" ? `🤖 Yapay zekâ kızarttı · kalan hak: ${d.left}` : "🛠️ Yedek kızartıcı çalıştı"); confetti(40);
    } catch (e) { toast(e.message); }
    $("#go").disabled = false; $("#go").textContent = "🔥 Kızart";
  };
  $("#copy").onclick = () => { navigator.clipboard && navigator.clipboard.writeText(last); toast("Kopyalandı ✓"); };
  $("#wa").onclick = () => waShare(last);
  $("#card").onclick = () => saveCard(makeCard("KIZARTMA ODASI", "Kızartıldım 🔥", last, "🔥", ["#ff5c7a", "#f59e0b"]), "kizartma");
}

/* --- burç --- */
function initBurc() {
  const stars = n => "★".repeat(n) + "☆".repeat(5 - n);
  $$(".sign").forEach(b => b.onclick = async () => {
    $$(".sign").forEach(x => x.classList.remove("on")); b.classList.add("on");
    const d = await (await fetch("/api/burc/" + b.dataset.s)).json(); const r = $("#reading"); r.hidden = false;
    r.innerHTML = `<h2 style="margin:0 0 8px">${d.sign.icon} ${d.sign.name}</h2>
      <div class="line">🌌 <b>Genel:</b> ${d.genel}</div><div class="line">💘 <b>Aşk:</b> ${d.ask}</div><div class="line">💼 <b>İş:</b> ${d.is}</div>
      <div class="line">💡 <b>Tavsiye:</b> ${d.tavsiye}</div>
      <div class="line">⚠️ <b>Bugünün şanssızlığı:</b> ${d.sanssiz}</div>
      <div class="line">🎨 <b>Renk:</b> ${d.renk} &nbsp; 🔢 <b>Sayı:</b> ${d.sayi}</div>
      <div class="line">Aşk <span class="stars">${stars(d.puan.ask)}</span> &nbsp; İş <span class="stars">${stars(d.puan.is)}</span> &nbsp; Enerji <span class="stars">${stars(d.puan.enerji)}</span></div>
      <div class="row" style="justify-content:flex-start"><button class="btn sm" id="bshare">Kartı paylaş</button></div>`;
    $("#bshare").onclick = () => saveCard(makeCard("BURÇ PARODİSİ · " + new Date().toLocaleDateString("tr-TR"), d.sign.name, d.genel + " Tavsiye: " + d.tavsiye, d.sign.icon, ["#a56bff", "#4c8dff"]), "burc");
    r.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

/* --- test --- */
function initTest() {
  const ans = []; let i = 0, res = null; const friend = (new URLSearchParams(location.search).get("c") || "").slice(0, 60);
  if (friend) { const b = document.createElement("div"); b.className = "glass chal"; b.style.cssText = "padding:10px 14px;margin-bottom:12px;text-align:center;border-radius:14px"; const bb = document.createElement("b"); bb.textContent = "🤝 Meydan okuma! "; b.append(bb, document.createTextNode(`Arkadaşın "${friend}" çıktı. Sen ne çıkacaksın?`)); $("#quiz").parentNode.insertBefore(b, $("#quiz")); }
  const q = QUESTIONS;
  function show() {
    $("#prog").style.width = (i / q.length * 100) + "%";
    const box = $("#quiz"); box.innerHTML = ""; const w = document.createElement("div"); w.className = "qbox";
    const h = document.createElement("h2"); h.className = "q"; h.textContent = `${i + 1}/${q.length} · ${q[i][0]}`; w.appendChild(h);
    q[i][1].forEach((o, k) => {
      const b = document.createElement("button"); b.className = "opt"; b.innerHTML = `<kbd>${k + 1}</kbd><span></span>`; $("span", b).textContent = o[0];
      b.onclick = () => pick(k); w.appendChild(b);
    });
    box.appendChild(w);
  }
  function pick(k) { ans.push(k); i++; i < q.length ? show() : finish(); }
  document.addEventListener("keydown", e => { if (!res && /^[1-4]$/.test(e.key) && $("#quiz").children.length && i < q.length) { if (+e.key <= q[i][1].length) pick(+e.key - 1); } });
  async function finish() {
    $("#prog").style.width = "100%"; $("#quiz").innerHTML = '<p class="muted">🔮 Sonuç hesaplanıyor...</p>';
    await new Promise(r => setTimeout(r, 700));
    res = await post("/api/test/" + SLUG, { answers: ans });
    const solved = LS.get("zf_solved", {}); solved[SLUG] = res.title; LS.set("zf_solved", solved);
    $("#quiz").hidden = true; $("#result").hidden = false;
    $("#rEmoji").textContent = res.emoji; $("#rTitle").textContent = res.title; $("#rText").textContent = res.text;
    $("#rPct").textContent = res.total > 3 ? `Bu testi çözenlerin %${res.pct}'i seninle aynı sonucu aldı` : "Bu testin ilk çözenlerinden birisin!";
    if (friend) { const box = $("#cmp"), same = friend === res.title; const pair = [friend, res.title].sort().join("|"); let h = 7; for (const ch of pair) h = (h * 31 + ch.charCodeAt(0)) % 997; const pc = same ? 100 : 30 + h % 61;
      box.hidden = false; box.innerHTML = ""; const t1 = document.createElement("div"); t1.style.cssText = "font-weight:800;font-size:1.1rem"; t1.textContent = same ? "🎉 Aynı çıktınız! Ruh ikizisiniz." : `Sen: ${res.title} · Arkadaşın: ${friend}`; const m = document.createElement("div"); m.className = "meter"; const bar = document.createElement("i"); bar.style.width = pc + "%"; m.appendChild(bar); const t2 = document.createElement("div"); t2.className = "muted small"; t2.textContent = `Uyum: %${pc}` + (same ? "" : pc > 70 ? " · birbirinizi tamamlıyorsunuz" : pc > 50 ? " · fena değil" : " · zıt kutuplar çekimi"); box.append(t1, m, t2); }
    confetti(150);
  }
  $("#chal").onclick = () => { const url = `${location.origin}${location.pathname}?c=${encodeURIComponent(res.title)}`; const text = `${res.test}: Ben ${res.title} çıktım ${res.emoji} Sen ne çıkacaksın? ${url}`; if (navigator.share) navigator.share({ text }).catch(() => {}); else window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank"); navigator.clipboard && navigator.clipboard.writeText(url); toast("Meydan okuma linki kopyalandı ✓"); };
  $("#share").onclick = () => saveCard(makeCard(res.test.toUpperCase(), res.title, res.text, res.emoji, res.grad), "sonuc");
  $("#wa").onclick = () => waShare(`${res.test}: Ben ${res.title} çıktım! ${res.emoji}`);
  $("#copy").onclick = () => { navigator.clipboard && navigator.clipboard.writeText(`${res.test}: ${res.title} ${res.emoji} — ${location.href}`); toast("Kopyalandı ✓"); };
  show();
}
function copyDaily() { const t = $("#dailytxt").textContent; navigator.clipboard && navigator.clipboard.writeText(t); toast("Kopyalandı ✓"); }
