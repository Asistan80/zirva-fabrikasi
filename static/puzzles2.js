/* Zırva Bulmaca: kelime oyunları (Kelime Avı, Passaparola, Adam Asmaca, Harf Karıştır, Bağlantı, Doğru mu Zırva mı) */
(function () {
const TRU = s => s.toLocaleUpperCase("tr-TR");
const FOLD = s => TRU(s).replace(/Ç/g, "C").replace(/Ğ/g, "G").replace(/İ/g, "I").replace(/Ö/g, "O").replace(/Ş/g, "S").replace(/Ü/g, "U").replace(/\s+/g, "");
const THEMES = {
  "Hayvanlar": "ASLAN KAPLAN ZEBRA ZÜRAFA TAVŞAN KARTAL DELFİN PENGUEN MAYMUN KOYUN LEOPAR TİMSAH",
  "Meyveler": "ELMA ARMUT ÇİLEK KİRAZ ŞEFTALİ KARPUZ KAVUN ÜZÜM İNCİR VİŞNE KAYISI",
  "Şehirler": "ANKARA İZMİR BURSA ADANA KONYA SİVAS MERSİN SAMSUN TRABZON ANTALYA ERZURUM DENİZLİ",
  "Meslekler": "DOKTOR ÖĞRETMEN AŞÇI PİLOT TERZİ MARANGOZ POLİS AVUKAT BERBER ŞOFÖR ÇİFTÇİ MİMAR",
  "Renkler": "KIRMIZI MAVİ SARI YEŞİL TURUNCU MOR PEMBE SİYAH BEYAZ TURKUAZ LACİVERT",
  "Yiyecekler": "KEBAP LAHMACUN BAKLAVA MANTI PİDE SİMİT ÇORBA DOLMA KÖFTE BÖREK PİLAV GÖZLEME",
  "Uzay": "GÜNEŞ DÜNYA SATÜRN JÜPİTER MARS VENÜS NEPTÜN GALAKSİ ROKET ASTEROİT YILDIZ UYDU",
  "Spor": "FUTBOL VOLEYBOL TENİS YÜZME GÜREŞ BOKS ESKRİM KAYAK ATLETİZM HENTBOL HAKEM",
  "Doğa": "ORMAN DENİZ NEHİR BULUT RÜZGAR YAĞMUR ŞELALE VADİ MAĞARA YANARDAĞ PLAJ",
  "Evde": "MASA SANDALYE KOLTUK DOLAP YATAK PERDE LAMBA AYNA FIRIN SABUN KİTAPLIK",
  "Teknoloji": "KLAVYE FARE EKRAN YAZICI TELEFON TABLET İNTERNET YAZILIM KAMERA ROBOT PİKSEL",
};
Object.keys(THEMES).forEach(k => THEMES[k] = THEMES[k].split(" "));
const ALLW = [].concat(...Object.values(THEMES));
const LETTERS = "AAAEEEİİKKLLRRNNDMMUUYTSSBOOÜŞZGÇHPCV";

/* ===== 1) Kelime Avı ===== */
function gKelimeAvi(root, ctx, A) {
  const { el, shuffle, ri, sfx, showResult, shareHead, shareTail, fmtTime } = A;
  const N = ctx.mode === "practice" ? (ctx.opts.size || 10) : 10;
  const tname = shuffle(Object.keys(THEMES), ctx.rnd)[0];
  const words = shuffle(THEMES[tname].filter(w => [...w].length <= N), ctx.rnd).slice(0, N >= 10 ? 7 : 6);
  const grid = Array.from({ length: N }, () => Array(N).fill(""));
  const DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
  const place = {};
  words.forEach(w => {
    const L = [...w];
    for (let t = 0; t < 400; t++) {
      const [dr, dc] = DIRS[ri(ctx.rnd, 0, DIRS.length - 1)]; const r0 = ri(ctx.rnd, 0, N - 1), c0 = ri(ctx.rnd, 0, N - 1);
      const r1 = r0 + dr * (L.length - 1), c1 = c0 + dc * (L.length - 1); if (r1 < 0 || r1 >= N || c1 < 0 || c1 >= N) continue;
      let ok = true; for (let i = 0; i < L.length; i++) { const v = grid[r0 + dr * i][c0 + dc * i]; if (v && v !== L[i]) { ok = false; break; } }
      if (!ok) continue; L.forEach((ch, i) => grid[r0 + dr * i][c0 + dc * i] = ch); place[w] = { r0, c0, dr, dc, len: L.length }; return;
    }
  });
  const R = [...LETTERS]; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!grid[r][c]) grid[r][c] = R[ri(ctx.rnd, 0, R.length - 1)];
  const found = new Set(), colors = ["#34d399", "#4c8dff", "#f59e0b", "#ec4899", "#a56bff", "#14b8a6", "#ef4444"]; let hints = 0, secs = 0, over = false;
  const info = el("div", "ka-info", `<span>Tema: <b>${tname}</b></span><span id="kaT">⏱ 0:00</span><span id="kaC">0/${words.length}</span>`);
  const board = el("div", "ka-grid"); board.style.setProperty("--n", N);
  const cells = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const d = el("div", "ka-cell", grid[r][c]); d.dataset.r = r; d.dataset.c = c; board.appendChild(d); cells.push(d); }
  const list = el("div", "ka-words"); const chip = {}; words.forEach(w => { chip[w] = el("span", "ka-chip", w); list.appendChild(chip[w]); });
  const hb = el("button", "btn sm ghost", "💡 İpucu (−1⭐)"); const bar = el("div", "row"); bar.appendChild(hb);
  root.append(info, board, list, bar);
  const idx = (r, c) => r * N + c; let startC = null, curPath = [], anchor = null;
  const clearSel = () => cells.forEach(x => x.classList.remove("sel"));
  const pathTo = (a, b) => { const dr = b[0] - a[0], dc = b[1] - a[1]; if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return [a]; const n = Math.max(Math.abs(dr), Math.abs(dc)), sr = Math.sign(dr), sc = Math.sign(dc); return Array.from({ length: n + 1 }, (_, i) => [a[0] + sr * i, a[1] + sc * i]); };
  const show = p => { clearSel(); p.forEach(([r, c]) => cells[idx(r, c)].classList.add("sel")); };
  function finalize(p) {
    clearSel(); const str = p.map(([r, c]) => grid[r][c]).join(""), rev = [...str].reverse().join("");
    const w = words.find(x => !found.has(x) && (x === str || x === rev));
    if (!w) { if (p.length > 1) sfx("bad"); return; }
    found.add(w); const col = colors[found.size % colors.length]; p.forEach(([r, c]) => { const e = cells[idx(r, c)]; e.classList.add("found"); e.style.setProperty("--fc", col); });
    chip[w].classList.add("done"); chip[w].style.background = col; sfx("good"); $("#kaC").textContent = `${found.size}/${words.length}`;
    if (found.size === words.length) end();
  }
  const cellAt = e => { const t = document.elementFromPoint(e.clientX, e.clientY); return t && t.classList && t.classList.contains("ka-cell") ? [+t.dataset.r, +t.dataset.c] : null; };
  board.addEventListener("pointerdown", e => { if (over) return; const c = cellAt(e); if (!c) return; e.preventDefault(); startC = c; curPath = [c]; if (anchor) { const p = pathTo(anchor, c); anchor = null; startC = null; finalize(p); return; } show(curPath); });
  board.addEventListener("pointermove", e => { if (!startC) return; const c = cellAt(e); if (!c) return; curPath = pathTo(startC, c); show(curPath); });
  addEventListener("pointerup", up); function up() { if (!startC) return; const p = curPath; const s = startC; startC = null; if (p.length <= 1) { anchor = s; show([s]); return; } finalize(p); }
  const timer = setInterval(() => { if (!over) { secs++; const t = $("#kaT"); if (t) t.textContent = "⏱ " + fmtTime(secs); } }, 1000);
  ctx.cleanup = () => { clearInterval(timer); removeEventListener("pointerup", up); };
  hb.onclick = () => { const w = words.find(x => !found.has(x)); if (!w) return; hints++; const p = place[w]; const e = cells[idx(p.r0, p.c0)]; e.classList.add("hint"); setTimeout(() => e.classList.remove("hint"), 2200); };
  function end() { over = true; clearInterval(timer); const stars = Math.max(1, (secs < 120 ? 5 : secs < 210 ? 4 : secs < 330 ? 3 : 2) - hints);
    showResult(ctx, { win: true, stars, title: "Hepsini avladın!", text: `${words.length} kelimeyi ${fmtTime(secs)} sürede buldun.${hints ? " İpucu: " + hints : ""}`, extra: { secs }, share: `${shareHead(ctx, fmtTime(secs))}\n🔎 ${found.size}/${words.length} kelime${hints ? " · 💡" + hints : ""}${shareTail(ctx)}` }); }
  ctx.auto = () => { words.forEach(w => { const p = place[w]; finalize(Array.from({ length: p.len }, (_, i) => [p.r0 + p.dr * i, p.c0 + p.dc * i])); }); };
  ctx.practiceOpts = [["size", "Boyut", [[8, "8x8"], [10, "10x10"], [12, "12x12"]]]];
}

/* ===== 2) Passaparola ===== */
const PP = {
  A: [["Türkiye'nin başkenti", "ANKARA"], ["Kral diye anılan büyük kedi", "ASLAN"]], B: [["Gökyüzünde yağmur taşıyan beyaz kümeler", "BULUT"], ["Pedallı iki tekerlekli taşıt", "BİSİKLET"]],
  C: [["Haftanın beşinci günü (Pazartesi'den sayarsak)", "CUMA"], ["Pencerelerde kullanılan şeffaf madde", "CAM"]], "Ç": [["Kaşıkla içilen sıcak yemek", "ÇORBA"], ["Okula giderken sırtta taşınan eşya", "ÇANTA"]],
  D: [["Karaları çevreleyen büyük tuzlu su kütlesi", "DENİZ"], ["Hasta olunca başvurulan hekim", "DOKTOR"]], E: [["'Günde bir tane yiyen doktordan uzak durur' denen meyve", "ELMA"], ["Ailenin birlikte yaşadığı yer", "EV"]],
  F: [["Ekmek pişirilen yer", "FIRIN"], ["Pembe renkli, tek ayağı üstünde duran uzun bacaklı kuş", "FLAMİNGO"]], G: [["Sistemimizin merkezindeki yıldız", "GÜNEŞ"], ["Denizde yük ve yolcu taşıyan büyük taşıt", "GEMİ"]],
  H: [["Yedi günlük zaman dilimi", "HAFTA"], ["Aslan, kedi, köpek gibi canlıların ortak adı", "HAYVAN"]], I: [["Lambanın verdiği, karanlığı dağıtan şey", "IŞIK"], ["Küçük nehir", "IRMAK"]],
  "İ": [["Dikiş yaparken kullanılan ince metal araç", "İĞNE"], ["Türkiye'nin en kalabalık şehri", "İSTANBUL"]], J: [["Yarışmalarda puan veren kurul", "JÜRİ"], ["Sakal tıraşı için keskin ince bıçak", "JİLET"]],
  K: [["Sayfalardan oluşan, okunan şey", "KİTAP"], ["Miyavlayan evcil hayvan", "KEDİ"]], L: [["Odayı aydınlatan elektrikli eşya", "LAMBA"], ["Sarı, ekşi, çaya konan meyve", "LİMON"]],
  M: [["Yemeklerin yapıldığı oda", "MUTFAK"], ["Sarı, kavisli, maymunların sevdiği meyve", "MUZ"]], N: [["Büyük akarsu", "NEHİR"], ["Kırmızı, ekşi-tatlı taneli meyve", "NAR"]],
  O: [["Evin bölümlerinden her biri", "ODA"], ["Ağaçlarla kaplı geniş alan", "ORMAN"]], "Ö": [["Okulda ders anlatan kişi", "ÖĞRETMEN"], ["Evde yapılması için verilen okul çalışması", "ÖDEV"]],
  P: [["Haftanın ilk günü", "PAZARTESİ"], ["Pencereye asılan, güneşi kesen kumaş", "PERDE"]], R: [["Havanın hareketiyle esen, yelkenliyi iten güç", "RÜZGAR"], ["Mavi, sarı, kırmızı hepsi birer ...", "RENK"]],
  S: [["Sıcağın zıttı", "SOĞUK"], ["Susuzluğu gideren berrak içecek", "SU"]], "Ş": [["Yağmurdan korunmak için açılan eşya", "ŞEMSİYE"], ["Tüylü kabuklu, yaz meyvesi", "ŞEFTALİ"]],
  T: [["Yemeğin konduğu yassı sofra kabı", "TABAK"], ["Raylarda giden uzun taşıt", "TREN"]], U: [["Havada yolcu taşıyan büyük taşıt", "UÇAK"], ["Geceleri gözleri kapayıp dinlenme hali", "UYKU"]],
  "Ü": [["Salkım salkım, şarap yapılan meyve", "ÜZÜM"], ["Liseden sonra gidilen yüksek öğrenim kurumu", "ÜNİVERSİTE"]], V: [["İnsanın başı, gövdesi ve kollarından oluşan bütün", "VÜCUT"], ["İstanbul'da iki yaka arasında giden deniz taşıtı", "VAPUR"]],
  Y: [["Gökten damla damla düşen su", "YAĞMUR"], ["Gece gökyüzünde parlayan küçük ışık noktaları", "YILDIZ"]], Z: [["Çizgili at benzeri Afrika hayvanı", "ZEBRA"], ["Saniye, dakika, saat ile ölçülen şey", "ZAMAN"]],
};
const PPH = {
  A: ["Kurtuluş Savaşı'nda 'Mustafa Kemal' unvanının sonradan eklendiği, 1923'ten beri başkent olan kent", "ANKARA"], B: ["İki tekerlekli, zincirli, kaslarla çalışan ulaşım aracı", "BİSİKLET"], C: ["Perşembe ile Cumartesi arasında kalan hafta günü", "CUMA"],
  "Ç": ["Kitap, defter ve kalem taşımak için omuza ya da sırta takılan eşya", "ÇANTA"], D: ["Su ile toprak arasındaki en geniş su kütlesi; 'Karadeniz' ve 'Akdeniz' gibi adlar alır", "DENİZ"], E: ["Newton'a ilham verdiği söylenen, ağaçtan düşen meyve", "ELMA"],
  F: ["Pembe tüylü, tek ayak üstünde uyuyan uzun boyunlu kuş", "FLAMİNGO"], G: ["Dünya'ya ışık ve ısı veren yıldız", "GÜNEŞ"], H: ["Kediler, köpekler ve kuşlar bu kümenin üyesidir; bitkilerden farklı olarak canlı ve hareketlidir", "HAYVAN"],
  I: ["Elektrik düğmesine basınca odayı dolduran, karanlığın düşmanı", "IŞIK"], "İ": ["Terzinin en bilinen küçük aracı, ucu sivridir ve iplik geçirilir", "İĞNE"], J: ["Yarışma ve sanat etkinliklerinde puan veren değerlendirme kurulu", "JÜRİ"],
  K: ["Bir raftan alınır, sayfaları çevrilir, kapağı vardır", "KİTAP"], L: ["Aladdin'in sihirli olanı; masa üstünde ışık verir, bu harfle başlar", "LAMBA"], M: ["Yemek pişen odanın adı", "MUTFAK"], N: ["Dicle ve Fırat gibi, denize doğru akan büyük su yolu", "NEHİR"],
  O: ["Evin içindeki bölümlerden her biri; yatak, çocuk veya oturma türleri vardır", "ODA"], "Ö": ["Okulda ders anlatan, sınıfın başındaki kişi", "ÖĞRETMEN"], P: ["Pazar gününden bir sonraki, haftanın ilk iş günü", "PAZARTESİ"], R: ["Yelkenliyi iten, uçurtmayı uçuran hava hareketi", "RÜZGAR"],
  S: ["Susayınca içilen, berrak, tatsız ve kokusuz sıvı", "SU"], "Ş": ["Yağmurda açılan, saplı, kumaş gövdeli koruyucu", "ŞEMSİYE"], T: ["Sofrada yemeğin konulduğu yassı kap", "TABAK"], U: ["Havada giden, kanatlı ve motorlu yolcu taşıtı", "UÇAK"],
  "Ü": ["Salkım hâlinde olur, kurutulursa kuru üzüm, sıkılırsa pekmez ya da şarap olur", "ÜZÜM"], V: ["Başı, kolları, bacakları ve gövdesiyle insanın tamamı", "VÜCUT"], Y: ["Bulutlardan damla damla inen, şemsiyeyi açtıran gök olayı", "YAĞMUR"], Z: ["Siyah beyaz çizgili at akrabası, Afrika'da yaşar", "ZEBRA"],
};
window.PP_EXTRA = []; try { fetch('/api/pp-extra').then(r => r.json()).then(j => { if (Array.isArray(j)) window.PP_EXTRA = j; }).catch(() => {}); } catch (e) {}
function chooser(root, A, title, list, cb) { // list=[[key,label,desc]]
  const { el } = A; const box = el("div", "md-box"); box.appendChild(el("div", "md-title", title)); const g = el("div", "md-list");
  list.forEach(([k, l, d]) => { const b = el("button", "md-btn", `<b>${l}</b><small>${d}</small>`); b.onclick = () => { box.remove(); cb(k); }; g.appendChild(b); }); box.appendChild(g); root.appendChild(box); return box;
}
function gPassaparola(root, ctx, A) {
  const modes = [["kolay", "🟢 Kolay", "Kolay sorular · 300 sn · 8 harf ipucu"], ["normal", "🟡 Normal", "Orta sorular · 270 sn · 5 harf ipucu"], ["zor", "🔴 Zor", "Zor sorular · 200 sn · 2 ipucu · yanlış −5 sn"], ["cift", "👥 2 Oyuncu", "Aynı cihazda sırayla · kişi başı 120 sn · bilen devam eder"]];
  const box = chooser(root, A, "Passaparola modunu seç", modes, m => run(m));
  ctx.auto = () => { const run0 = ctx.__run; if (!run0) { box.remove(); run("normal"); } ctx.__auto && ctx.__auto(); };
  function run(mode) {
    const { el, shuffle, sfx, tone, showResult, shareHead, shareTail } = A; const two = mode === "cift";
    const order = "ABCÇDEFGHIİJKLMNOÖPRSŞTUÜVYZ".split("").filter(l => PP[l]);
    const Q = order.map(l => { let src = mode === "kolay" ? PP[l][0] : mode === "zor" ? PPH[l] : PP[l][1]; const ex = (window.PP_EXTRA || []).filter(e => e.l === l && FOLD(e.ans).startsWith(FOLD(l)) && (e.mode === (mode === "cift" ? "normal" : mode))); if (ex.length && ctx.rnd() < .5) { const e = ex[Math.floor(ctx.rnd() * ex.length)]; src = [e.clue, e.ans]; } return { l, clue: src[0], ans: src[1], st: 0, rev: 0 }; });
    const cfg = { kolay: [300, 8, 12, 0], normal: [270, 5, 14, 0], zor: [200, 2, 14, 5], cift: [120, 3, 0, 0] }[mode]; const hintMax = cfg[1], need = cfg[2], pen = cfg[3];
    const left = two ? [120, 120] : [cfg[0]]; let hints = hintMax, cur = 0, who = 0, over = false;
    const ring = el("div", "pp-ring"); Q.forEach((q, i) => { const d = el("span", "pp-l", q.l); q.d = d; const a = i / Q.length * 6.2832 - 1.5708; d.style.left = (50 + 44 * Math.cos(a)) + "%"; d.style.top = (50 + 44 * Math.sin(a)) + "%"; ring.appendChild(d); });
    const mid = el("div", "pp-mid"); const tm = el("div", "pp-time", ""); const letter = el("div", "pp-big", ""); const clue = el("div", "pp-clue", ""); const mask = el("div", "pp-mask", "");
    mid.append(tm, letter, clue, mask); ring.appendChild(mid);
    const form = el("form", "pp-form"); const inp = el("input"); inp.placeholder = "Cevabını yaz..."; inp.autocomplete = "off"; inp.setAttribute("autocapitalize", "characters");
    const go = el("button", "btn", "Cevapla"); go.type = "submit"; const pas = el("button", "btn ghost", "Pas"); pas.type = "button"; const hb = el("button", "btn ghost", ""); hb.type = "button"; form.append(inp, go, pas, hb);
    const score = el("div", "pp-score", ""); root.append(score, ring, form);
    const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    const nextIdx = from => { for (let k = 1; k <= Q.length; k++) { const j = (from + k) % Q.length; if (Q[j].st === 0 || Q[j].st === 3) return j; } return -1; };
    const cnt = p => Q.filter(q => q.st === 1 && (q.by || 0) === p).length;
    function paintTop() { if (two) { tm.innerHTML = `<span class="${who === 0 ? "me" : ""}">🔵 ${fmt(left[0])}</span> <span class="${who === 1 ? "me" : ""}">🌸 ${fmt(left[1])}</span>`; score.innerHTML = `<span class="p0">Oyuncu 1: <b>${cnt(0)}</b></span><span class="p1">Oyuncu 2: <b>${cnt(1)}</b></span><span class="turn">Sıra: ${who === 0 ? "🔵 Oyuncu 1" : "🌸 Oyuncu 2"}</span>`; } else { tm.textContent = "⏱ " + fmt(left[0]); tm.classList.toggle("hot", left[0] <= 10); score.innerHTML = `<span>✅ ${cnt(0)}</span><span>❌ ${Q.filter(q => q.st === 2).length}</span><span>⏭ ${Q.filter(q => q.st === 3).length}</span>`; } hb.textContent = `🔤 Harf ipucu (${hints})`; hb.disabled = hints <= 0; }
    function maskTxt(q) { const L = [...q.ans]; return L.map((c, i) => i < q.rev ? c : "_").join(" "); }
    function show() { Q.forEach((q, i) => q.d.className = "pp-l" + (q.st === 1 ? (two ? " ok" + (q.by || 0) : " ok") : q.st === 2 ? " no" : q.st === 3 ? " pas" : "") + (i === cur ? " cur" : "")); const q = Q[cur]; letter.textContent = q.l; clue.textContent = q.l + " ile başlar: " + q.clue; mask.textContent = maskTxt(q); inp.value = ""; paintTop(); inp.focus(); }
    function swap() { if (!two) return; const o = 1 - who; if (left[o] > 0) who = o; }
    function advance(sw) { if (sw) swap(); const n = nextIdx(cur); if (n < 0) return end(); cur = n; show(); }
    form.onsubmit = e => { e.preventDefault(); if (over) return; const v = FOLD(inp.value); if (!v) return; const q = Q[cur];
      if (v === FOLD(q.ans)) { q.st = 1; q.by = who; sfx("good"); advance(false); } else { q.st = 2; sfx("bad"); if (pen) left[0] = Math.max(0, left[0] - pen); if (!two) advance(false); else { q.st = 3; advance(true); } if (left[0] <= 0 && !two) end(); } };
    pas.onclick = () => { if (over) return; Q[cur].st = 3; tone(300, .06); advance(true); };
    hb.onclick = () => { if (over || hints <= 0) return; const q = Q[cur]; if (q.rev >= [...q.ans].length - 1) return; q.rev++; hints--; tone(660, .08); mask.textContent = maskTxt(q); paintTop(); inp.focus(); };
    const timer = setInterval(() => { if (over) return; left[two ? who : 0]--; if (two) { if (left[who] <= 0) { left[who] = 0; if (left[1 - who] > 0) { who = 1 - who; } else return end(); } } else if (left[0] <= 0) return end(); paintTop(); }, 1000);
    ctx.cleanup = () => clearInterval(timer);
    function end() { if (over) return; over = true; clearInterval(timer); Q.forEach(q => { if (q.st === 3 || q.st === 0) q.d.className = "pp-l pas"; });
      if (two) { const a = cnt(0), b = cnt(1); const t = a === b ? "Berabere!" : a > b ? "🔵 Oyuncu 1 kazandı!" : "🌸 Oyuncu 2 kazandı!"; showResult(ctx, { win: true, stars: Math.max(1, Math.min(5, Math.round(Math.max(a, b) / 4))), title: t, text: `Oyuncu 1: <b>${a}</b> doğru · Oyuncu 2: <b>${b}</b> doğru`, extra: { correct: Math.max(a, b), mode }, share: `${shareHead(ctx, a + "-" + b)}\n👥 Passaparola 2 Oyuncu: ${t}${shareTail(ctx)}` }); return; }
      const ok = cnt(0), win = ok >= need, stars = ok >= 25 ? 5 : ok >= 21 ? 4 : ok >= 17 ? 3 : ok >= 12 ? 2 : 1; const missed = Q.filter(q => q.st !== 1).slice(0, 6).map(q => `${q.l}: ${q.ans}`).join(" · ");
      showResult(ctx, { win, stars, title: win ? "Parola çözüldü!" : "Süre doldu", text: `[${mode.toUpperCase()}] ${Q.length} harften ${ok} tanesini bildin. (kazanmak için ${need})${missed ? "<br><small>Kaçırdıkların: " + missed + "</small>" : ""}`, extra: { correct: mode === "zor" ? ok + 2 : ok, mode }, share: `${shareHead(ctx, ok + "/" + Q.length + " " + mode)}\n${Q.map(q => q.st === 1 ? "🟩" : q.st === 2 ? "🟥" : "⬜").join("")}${shareTail(ctx)}` }); }
    ctx.__run = mode; ctx.__auto = () => { Q.forEach(q => { q.st = 1; q.by = 0; }); end(); }; show();
  }
}

/* ===== 3) Adam Asmaca ===== */
const HANG = {
  "Ülke": "ARJANTİN BREZİLYA JAPONYA ALMANYA PORTEKİZ NORVEÇ AVUSTRALYA İSVİÇRE MACARİSTAN",
  "Meslek": "HEMŞİRE MÜHENDİS GAZETECİ ELEKTRİKÇİ İTFAİYECİ ASTRONOT ÇİFTÇİ BERBER",
  "Hayvan": "KAPLUMBAĞA ZÜRAFA KANGURU PAPAĞAN KARINCA YARASA AHTAPOT KIRLANGIÇ SİNCAP",
  "Yemek": "MERCİMEK İSKENDER KURABİYE MENEMEN PATLICAN KARNIYARIK ISPANAK",
  "Eşya": "BUZDOLABI TELEVİZYON ŞEMSİYE TERMOS SÜPÜRGE BİLGİSAYAR TELEFON",
  "Doğa": "ŞELALE YANARDAĞ GÖKKUŞAĞI FIRTINA YILDIRIM ÇAĞLAYAN KAYALIK",
};
function gAdam(root, ctx, A) {
  const { el, shuffle, sfx, showResult, shareHead, shareTail } = A;
  const cat = shuffle(Object.keys(HANG), ctx.rnd)[0]; const word = shuffle(HANG[cat].split(" "), ctx.rnd)[0]; const MAX = 6;
  let guessed = new Set(), wrong = 0, over = false;
  const svg = el("div", "ad-fig"); const parts = ['<circle cx="130" cy="62" r="18"/>', '<line x1="130" y1="80" x2="130" y2="130"/>', '<line x1="130" y1="92" x2="104" y2="116"/>', '<line x1="130" y1="92" x2="156" y2="116"/>', '<line x1="130" y1="130" x2="106" y2="168"/>', '<line x1="130" y1="130" x2="154" y2="168"/>'];
  const draw = () => svg.innerHTML = `<svg viewBox="0 0 220 190" width="190"><g stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round"><line x1="20" y1="180" x2="120" y2="180"/><line x1="50" y1="180" x2="50" y2="20"/><line x1="50" y1="20" x2="130" y2="20"/><line x1="130" y1="20" x2="130" y2="44"/></g><g stroke="#ff5c7a" stroke-width="5" fill="none" stroke-linecap="round">${parts.slice(0, wrong).join("")}</g></svg>`;
  const info = el("div", "ad-info"); const wd = el("div", "ad-word"); const kb = el("div", "ad-kb"); root.append(svg, info, wd, kb);
  const KEYS = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split(""); const bt = {};
  KEYS.forEach(k => { const b = el("button", "wd-key", k); b.onclick = () => guess(k); bt[k] = b; kb.appendChild(b); });
  function paint() { wd.innerHTML = [...word].map(ch => `<span class="ad-ch">${guessed.has(ch) || over ? ch : ""}</span>`).join(""); info.innerHTML = `Kategori: <b>${cat}</b> · Kalan hak: <b>${MAX - wrong}</b>`; draw(); }
  function guess(k) { if (over || guessed.has(k)) return; guessed.add(k); const ok = word.includes(k); bt[k].disabled = true; bt[k].dataset.s = ok ? "g" : "x"; if (!ok) { wrong++; sfx("bad"); } else sfx("tap"); paint();
    if ([...word].every(c => guessed.has(c))) end(true); else if (wrong >= MAX) end(false); }
  function end(win) { over = true; paint(); const stars = win ? Math.max(1, MAX - wrong) : 0; showResult(ctx, { win, stars: win ? Math.min(5, stars) : 1, title: win ? "Kurtardın!" : "Adam asıldı", text: win ? `${wrong} yanlışla bildin: <b>${word}</b>` : `Kelime: <b>${word}</b>`, share: `${shareHead(ctx, win ? wrong + " hata" : "kaybetti")}\n${win ? "🟩" : "🟥"} ${[...word].map(() => "▫️").join("")}${shareTail(ctx)}` }); }
  addEventListener("keydown", kd); function kd(e) { const k = TRU(e.key); if (KEYS.includes(k) && !e.ctrlKey && !e.metaKey) guess(k); } ctx.cleanup = () => removeEventListener("keydown", kd);
  ctx.auto = () => { [...word].forEach(c => guess(c)); };
  paint();
}

/* ===== 4) Harf Karıştır ===== */
function gAnagram(root, ctx, A) {
  const { el, shuffle, sfx, tone, showResult, shareHead, shareTail } = A;
  const pool = [...new Set(ALLW)].filter(w => { const n = [...w].length; return n >= 5 && n <= 8; });
  const ws = shuffle(pool, ctx.rnd).slice(0, 5); let i = 0, ok = 0, res = [], built = [], tiles = [], left = 40, lock = false;
  const info = el("div", "ag-info"); const slots = el("div", "ag-slots"); const bank = el("div", "ag-bank"); const row = el("div", "row");
  const bk = el("button", "btn sm ghost", "⌫ Sil"), hint = el("button", "btn sm ghost", "💡 İpucu"), skip = el("button", "btn sm ghost", "⏭ Geç"); row.append(bk, hint, skip); root.append(info, slots, bank, row);
  let timer;
  function scramble(w) { const L = [...w]; let s; let t = 0; do { s = shuffle(L, ctx.rnd); t++; } while (s.join("") === w && t < 20); return s; }
  function load() { const w = ws[i]; built = []; left = 40; lock = false; tiles = scramble(w).map((ch, k) => ({ ch, k, used: false })); render(); clearInterval(timer); timer = setInterval(tick, 1000); }
  function tick() { left--; if (left <= 0) { finishWord(false); } else renderInfo(); }
  function renderInfo() { info.innerHTML = `Kelime ${i + 1}/5 · ⏱ <b>${left}</b> sn · Doğru: ${ok}`; }
  function render() { renderInfo(); const w = ws[i], n = [...w].length; slots.innerHTML = ""; for (let k = 0; k < n; k++) slots.appendChild(el("div", "ag-slot" + (built[k] ? " f" : ""), built[k] ? built[k].ch : ""));
    bank.innerHTML = ""; tiles.forEach(t => { const b = el("button", "ag-tile" + (t.used ? " used" : ""), t.ch); b.disabled = t.used; b.onclick = () => add(t); bank.appendChild(b); }); }
  function add(t) { if (lock || t.used) return; t.used = true; built.push(t); sfx("tap"); render(); if (built.length === [...ws[i]].length) check(); }
  function check() { const g = built.map(t => t.ch).join(""); if (g === ws[i]) finishWord(true); else { sfx("bad"); slots.classList.add("shake"); setTimeout(() => { slots.classList.remove("shake"); }, 400); setTimeout(() => { built.forEach(t => t.used = false); built = []; render(); }, 450); } }
  bk.onclick = () => { if (lock || !built.length) return; built.pop().used = false; render(); };
  hint.onclick = () => { if (lock) return; const w = [...ws[i]]; const k = built.length; if (k >= w.length) return; const need = w[k]; const t = tiles.find(x => !x.used && x.ch === need); if (t) { left = Math.max(1, left - 8); add(t); } };
  skip.onclick = () => { if (!lock) finishWord(false); };
  function finishWord(win) { if (lock) return; lock = true; clearInterval(timer); res.push(win); if (win) { ok++; sfx("good"); } else { slots.innerHTML = [...ws[i]].map(c => `<div class="ag-slot f miss">${c}</div>`).join(""); } renderInfo();
    setTimeout(() => { i++; if (i < 5) load(); else end(); }, win ? 600 : 1300); }
  function end() { const stars = ok; showResult(ctx, { win: ok >= 3, stars: Math.max(1, stars), title: ok >= 3 ? "Harf ustası!" : "Harfler seni yendi", text: `5 kelimenin ${ok} tanesini çözdün.`, share: `${shareHead(ctx, ok + "/5")}\n${res.map(x => x ? "🟩" : "🟥").join("")}${shareTail(ctx)}` }); }
  ctx.cleanup = () => clearInterval(timer);
  ctx.auto = () => { const solveOne = () => { const w = [...ws[i]]; w.forEach(ch => { const t = tiles.find(x => !x.used && x.ch === ch); if (t) add(t); }); }; const seq = () => { if (i >= 5) return; solveOne(); setTimeout(seq, 900); }; seq(); };
  load();
}

/* ===== 5) Bağlantı ===== */
const GROUPS = {
  "Meyve": "ELMA ARMUT KİRAZ ERİK İNCİR", "Renk": "MAVİ YEŞİL SARI PEMBE MOR", "Gezegen": "MARS SATÜRN VENÜS NEPTÜN JÜPİTER", "Şehir": "ADANA BURSA KONYA SİVAS RİZE",
  "Hayvan": "ASLAN KAPLAN ZEBRA KEDİ KOYUN", "Mutfak eşyası": "TENCERE KAŞIK ÇATAL BIÇAK TABAK", "Okul": "TAHTA KALEM DEFTER SİLGİ SIRA", "Müzik aleti": "SAZ KEMAN DAVUL FLÜT PİYANO GİTAR",
  "Spor": "FUTBOL TENİS YÜZME BOKS GÜREŞ", "Meslek": "DOKTOR PİLOT AŞÇI TERZİ MİMAR", "Mevsim": "KIŞ YAZ BAHAR SONBAHAR", "Vücut": "KOL BACAK BURUN KULAK PARMAK",
  "Ulaşım": "TREN OTOBÜS VAPUR UÇAK METRO", "Giysi": "GÖMLEK PANTOLON CEKET ETEK ÇORAP", "İçecek": "ÇAY KAHVE AYRAN SÜT LİMONATA", "Hava durumu": "YAĞMUR KAR RÜZGAR SİS DOLU",
};
function gBaglanti(root, ctx, A) {
  const { el, shuffle, sfx, showResult, shareHead, shareTail } = A; const cols = ["#f59e0b", "#34d399", "#4c8dff", "#ec4899"];
  const picked = shuffle(Object.keys(GROUPS), ctx.rnd).slice(0, 4).map((k, gi) => ({ name: k, words: shuffle(GROUPS[k].split(" "), ctx.rnd).slice(0, 4), col: cols[gi] }));
  let all = shuffle([].concat(...picked.map(g => g.words.map(w => ({ w, g })))), ctx.rnd), sel = [], solved = [], miss = 0, over = false, log = [];
  const info = el("div", "bg-info"); const done = el("div", "bg-done"); const board = el("div", "bg-board"); const row = el("div", "row");
  const sub = el("button", "btn sm", "Gönder"), shf = el("button", "btn sm ghost", "🔀 Karıştır"), clr = el("button", "btn sm ghost", "Temizle"); row.append(sub, shf, clr); root.append(info, done, board, row);
  function render() { info.innerHTML = `4 kelimelik grupları bul · Kalan hak: <b>${"❤️".repeat(4 - miss)}${"🖤".repeat(miss)}</b>`; done.innerHTML = solved.map(g => `<div class="bg-grp" style="background:${g.col}"><b>${g.name}</b><span>${g.words.join(", ")}</span></div>`).join("");
    board.innerHTML = ""; all.filter(x => !solved.includes(x.g)).forEach(x => { const b = el("button", "bg-card" + (sel.includes(x) ? " on" : ""), x.w); b.onclick = () => { if (over) return; if (sel.includes(x)) sel = sel.filter(y => y !== x); else if (sel.length < 4) sel.push(x); sfx("tap"); render(); }; board.appendChild(b); }); sub.disabled = sel.length !== 4; }
  sub.onclick = () => { if (sel.length !== 4 || over) return; const g = sel[0].g; log.push(sel.map(x => picked.indexOf(x.g))); if (sel.every(x => x.g === g)) { solved.push(g); sel = []; sfx("good"); if (solved.length === 4) return end(true); }
    else { const cnt = {}; sel.forEach(x => cnt[x.g.name] = (cnt[x.g.name] || 0) + 1); const close = Object.values(cnt).some(v => v === 3); miss++; sfx("bad"); board.classList.add("shake"); setTimeout(() => board.classList.remove("shake"), 400); if (close) A.tone(520, .1); if (close) info.dataset.close = 1; if (miss >= 4) { sel = []; return end(false); } sel = []; } render(); };
  shf.onclick = () => { all = shuffle(all, Math.random); render(); }; clr.onclick = () => { sel = []; render(); };
  function end(win) { over = true; if (!win) solved = picked.slice(); render(); const stars = win ? 5 - miss : 1;
    showResult(ctx, { win, stars: Math.max(1, stars), title: win ? "Bağlantıları kurdun!" : "Bağlantılar kopuk", text: win ? `${miss} hatayla tamamladın.` : "Grupları gösterdim, yarın daha iyi olacak.", share: `${shareHead(ctx, win ? miss + " hata" : "kaybetti")}\n${log.map(r => r.map(i => ["🟧", "🟩", "🟦", "🟪"][i]).join("")).join("\n")}${shareTail(ctx)}` }); }
  ctx.auto = () => { picked.forEach(g => { sel = all.filter(x => x.g === g); sub.disabled = false; sub.onclick(); }); };
  render();
}

/* ===== 6) Doğru mu Zırva mı ===== */
const TF = [
  ["Bal, uygun saklanırsa neredeyse hiç bozulmayan nadir yiyeceklerden biridir.", 1, "Düşük nem ve asitliği bakterileri engeller."], ["Ahtapotun üç kalbi vardır.", 1, "İkisi solungaçlara, biri vücuda kan pompalar."],
  ["Güneş bir gezegendir.", 0, "Güneş bir yıldızdır."], ["Işık, sesten çok daha hızlı yayılır.", 1, "O yüzden şimşeği gök gürültüsünden önce görürüz."], ["İstanbul Türkiye'nin başkentidir.", 0, "Başkent Ankara'dır."],
  ["Kediler tatlı tadını alamaz.", 1, "Kedilerde tatlı tat reseptörü çalışmaz."], ["Zürafaların boynunda 100 omur vardır.", 0, "İnsanlar gibi 7 omurları var, ama çok uzunlar."], ["Mısır piramitleri Güney Amerika'dadır.", 0, "Mısır piramitleri Afrika'dadır."],
  ["İnsan vücudundaki en büyük organ deridir.", 1, "Cilt, vücudun en geniş organıdır."], ["Yarasalar kördür.", 0, "Yarasalar görür, üstelik yankıyla yön de bulur."], ["Venüs, Güneş'e en yakın gezegendir.", 0, "En yakın gezegen Merkür'dür."],
  ["Develer hörgüçlerinde su depolar.", 0, "Hörgüçlerde depolanan şey yağdır."], ["Penguenler Kuzey Kutbu'nda yaşar.", 0, "Penguenler Güney Yarımküre'de yaşar."], ["Okyanuslar Dünya yüzeyinin yaklaşık %70'ini kaplar.", 1, "Dünya bu yüzden 'mavi gezegen' diye anılır."],
  ["Altının kimyasal simgesi 'Au'dur.", 1, "Latince 'aurum' kelimesinden gelir."], ["Ay'ın kendi ışığı vardır.", 0, "Ay, Güneş'in ışığını yansıtır."], ["İnsan kalbi dört odacıklıdır.", 1, "İki kulakçık, iki karıncık."],
  ["Fil, karada yaşayan en büyük hayvandır.", 1, "Afrika filleri 6 tona kadar çıkar."], ["Mavi balina bir balık türüdür.", 0, "Mavi balina bir memelidir."], ["Kutup ayıları Antarktika'da yaşar.", 0, "Kutup ayıları Kuzey Kutbu çevresinde yaşar."],
  ["Ankara, 1923'te başkent ilan edildi.", 1, "13 Ekim 1923'te."], ["Mona Lisa'yı Picasso yapmıştır.", 0, "Leonardo da Vinci yapmıştır."], ["Çin Seddi uzaydan çıplak gözle kolayca görülür.", 0, "Bu yaygın bir yanlış inanıştır."],
  ["Salatalık botanik olarak bir meyvedir.", 1, "Çiçekten gelişir ve tohum taşır."], ["Karıncalar kendi ağırlıklarının onlarca katını taşıyabilir.", 1, "Boylarına göre çok güçlüdürler."], ["Örümcekler böcektir.", 0, "Örümcekler 8 bacaklı araknitlerdir."],
  ["Mars'a 'Kızıl Gezegen' denir.", 1, "Yüzeyindeki demir oksit yüzünden."], ["Elmas, doğadaki en sert maddelerden biridir.", 1, "Mohs ölçeğinde 10 numaradır."], ["Japonya'nın başkenti Seul'dür.", 0, "Japonya'nın başkenti Tokyo'dur, Seul Güney Kore'nindir."],
  ["Ses, uzay boşluğunda yayılabilir.", 0, "Ses yayılmak için bir ortama ihtiyaç duyar."], ["Kahve çekirdeği aslında bir meyvenin çekirdeğidir.", 1, "Kahve kirazının tohumudur."], ["Satranç tahtasında 64 kare vardır.", 1, "8 x 8."],
  ["Futbol maçına her takım sahada 11 oyuncuyla başlar.", 1, "Kaleci dahil."], ["Dünya'nın iki doğal uydusu vardır.", 0, "Tek doğal uydusu Ay'dır."], ["Türkiye'nin yüzölçümü en büyük ili Konya'dır.", 1, "Konya, ülkenin en geniş ilidir."],
  ["Truva Atı Mısır efsanesidir.", 0, "Antik Yunan hikâyesidir."], ["Eyfel Kulesi Londra'dadır.", 0, "Eyfel Kulesi Paris'tedir."], ["Zebraların çizgi düzeni her birinde farklıdır.", 1, "Parmak izi gibidir."],
  ["Bir yılda 12 ay vardır.", 1, "Kolay bir soru, değil mi?"], ["Sahra, dünyanın en büyük sıcak çölüdür.", 1, "Afrika'nın kuzeyinde yer alır."], ["Gökkuşağında geleneksel olarak 7 renk sayılır.", 1, "Kırmızıdan mora."],
  ["Bukalemunlar renklerini yalnızca saklanmak için değiştirir.", 0, "İletişim ve vücut sıcaklığı da etkilidir."], ["Türkiye'nin en uzun nehri Kızılırmak'tır.", 1, "Yaklaşık 1355 km."], ["Su, deniz seviyesinde 100 °C'de kaynar.", 1, "Yükseklikte kaynama noktası düşer."],
  ["Dünya Güneş'in etrafında döner.", 1, "Bir tur yaklaşık 365 gün sürer."], ["Everest, deniz seviyesinden ölçüldüğünde dünyanın en yüksek dağıdır.", 1, "Yaklaşık 8849 metre."], ["Bazı kaplumbağalar 150 yıldan fazla yaşayabilir.", 1, "Dev kaplumbağalar en uzun yaşayanlardandır."],
];
function gDogru(root, ctx, A) {
  const { el, shuffle, sfx, showResult, shareHead, shareTail, sleep } = A;
  const qs = shuffle(TF, ctx.rnd).slice(0, 10); let i = 0, score = 0, lock = false, res = [];
  const prog = el("div", "em-prog"), card = el("div", "tf-card"), btns = el("div", "tf-btns"), why = el("div", "tf-why muted small");
  const yes = el("button", "tf-btn yes", "✅ Doğru"), no = el("button", "tf-btn no", "❌ Zırva"); btns.append(yes, no); root.append(prog, card, btns, why);
  function show() { prog.innerHTML = qs.map((_, k) => `<span class="${k < i ? (res[k] ? "ok" : "no") : k === i ? "now" : ""}"></span>`).join(""); card.textContent = qs[i][0]; card.classList.remove("pop"); void card.offsetWidth; card.classList.add("pop"); why.textContent = ""; yes.className = "tf-btn yes"; no.className = "tf-btn no"; }
  async function pick(v) { if (lock) return; lock = true; const q = qs[i], ok = (v === 1) === (q[1] === 1); res.push(ok); if (ok) { score++; sfx("good"); } else sfx("bad"); (q[1] ? yes : no).classList.add("right"); if (!ok) (v ? yes : no).classList.add("wrongc"); why.textContent = (ok ? "Doğru! " : "Olmadı. ") + q[2]; await sleep(1500); i++; lock = false; if (i < qs.length) show(); else end(); }
  yes.onclick = () => pick(1); no.onclick = () => pick(0);
  function end() { prog.innerHTML = qs.map((_, k) => `<span class="${res[k] ? "ok" : "no"}"></span>`).join(""); const stars = score >= 10 ? 5 : score >= 9 ? 4 : score >= 8 ? 3 : score >= 7 ? 2 : 1;
    showResult(ctx, { win: score >= 7, stars, title: score >= 7 ? "Bilgi küpü!" : "Zırvaya kandın", text: `10 sorudan ${score} tanesini bildin.`, share: `${shareHead(ctx, score + "/10")}\n${res.map(x => x ? "🟩" : "🟥").join("")}${shareTail(ctx)}` }); }
  ctx.auto = async () => { for (let k = 0; k < 10; k++) { pick(qs[i][1] === 1 ? 1 : 0); await sleep(1700); } };
  show();
}
window.PZ_DATA = { GROUPS, ALLW, THEMES, TRU, FOLD, chooser };
window.PZX = Object.assign(window.PZX || {}, { kelimeavi: gKelimeAvi, passaparola: gPassaparola, adamasmaca: gAdam, anagram: gAnagram, baglanti: gBaglanti, dogruyanlis: gDogru });
})();
