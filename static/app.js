function wrap(ctx, text, x, y, maxW, lh){
  const words = text.split(" "); let line = "";
  for (const w of words){
    const t = line + w + " ";
    if (ctx.measureText(t).width > maxW && line){ ctx.fillText(line.trim(), x, y); line = w + " "; y += lh; }
    else line = t;
  }
  ctx.fillText(line.trim(), x, y); return y;
}
function makeCard(head, title, body, emoji){
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1080;
  const x = c.getContext("2d");
  const g = x.createLinearGradient(0,0,1080,1080);
  g.addColorStop(0,"#4c8dff"); g.addColorStop(.5,"#a56bff"); g.addColorStop(1,"#ff5c7a");
  x.fillStyle = g; x.fillRect(0,0,1080,1080);
  x.fillStyle = "rgba(0,0,0,.28)"; x.fillRect(60,60,960,960);
  x.fillStyle = "#fff"; x.textAlign = "center";
  x.font = "700 34px sans-serif"; x.fillText(head, 540, 140);
  if (emoji){ x.font = "140px sans-serif"; x.fillText(emoji, 540, 330); }
  x.font = "800 64px sans-serif";
  let y = wrap(x, title, 540, 440, 860, 76);
  x.font = "400 40px sans-serif";
  wrap(x, body, 540, y + 80, 840, 54);
  x.font = "600 30px sans-serif"; x.fillText("🏭 Zırva Fabrikası · mizah amaçlıdır", 540, 990);
  return c;
}
function saveCard(canvas, name){
  canvas.toBlob(async b => {
    const f = new File([b], name + ".png", {type:"image/png"});
    if (navigator.canShare && navigator.canShare({files:[f]})){
      try { await navigator.share({files:[f], title:"Zırva Fabrikası"}); return; } catch(e){}
    }
    const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name + ".png"; a.click();
  });
}
function initMazeret(){
  const $ = id => document.getElementById(id); let last = "";
  $("go").onclick = async () => {
    $("go").disabled = true; $("go").textContent = "Fabrika çalışıyor...";
    try {
      const r = await fetch("/api/mazeret", {method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({kime:$("kime").value, ne:$("ne").value, ton:$("ton").value})});
      const d = await r.json(); last = d.text;
      $("txt").textContent = d.text;
      $("note").textContent = d.note || (d.mode === "ai" ? "Kalan hak: " + d.left : "");
      $("out").hidden = false;
    } catch(e){ $("txt").textContent = "Fabrikada arıza var, tekrar dene."; $("out").hidden = false; }
    $("go").disabled = false; $("go").textContent = "Mazeret üret";
  };
  $("copy").onclick = () => { navigator.clipboard && navigator.clipboard.writeText(last); $("copy").textContent = "Kopyalandı ✓"; };
  $("card").onclick = () => saveCard(makeCard("MAZERET FABRİKASI", "Resmi Mazeretim", last, "🛠️"), "mazeret");
}
function initTest(){
  const $ = id => document.getElementById(id); const ans = []; let i = 0; let res = null;
  function show(){
    $("prog").style.width = (i / QUESTIONS.length * 100) + "%";
    const q = QUESTIONS[i]; const box = $("quiz"); box.innerHTML = "";
    const h = document.createElement("h2"); h.className = "q"; h.textContent = (i+1) + "/" + QUESTIONS.length + "  " + q[0]; box.appendChild(h);
    q[1].forEach((o, k) => {
      const b = document.createElement("button"); b.className = "opt"; b.textContent = o[0];
      b.onclick = () => { ans.push(k); i++; i < QUESTIONS.length ? show() : finish(); };
      box.appendChild(b);
    });
  }
  async function finish(){
    $("prog").style.width = "100%"; $("quiz").innerHTML = "<p>Hesaplanıyor...</p>";
    const r = await fetch("/api/test/" + SLUG, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({answers: ans})});
    res = await r.json();
    $("quiz").hidden = true; $("result").hidden = false;
    $("rEmoji").textContent = res.emoji; $("rTitle").textContent = res.title; $("rText").textContent = res.text;
  }
  $("share").onclick = () => saveCard(makeCard(res.test.toUpperCase(), res.title, res.text, res.emoji), "sonuc");
  show();
}
