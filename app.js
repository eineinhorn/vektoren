const topics={
"Vektoren":{summary:"Punkte, Ortsvektoren und Vektoren sicher unterscheiden und miteinander rechnen.",formula:"AB⃗ = B⃗ − A⃗   |   λ·a⃗ = (λa₁, λa₂, λa₃)"},
"Geraden":{summary:"Geraden im Raum aufstellen, Punkte einsetzen und Parameter bestimmen.",formula:"g: x⃗ = a⃗ + t·u⃗"},
"Ebenen":{summary:"Ebenen in Parameter-, Normalen- und Koordinatenform verstehen und umformen.",formula:"E: x⃗ = a⃗ + r·u⃗ + s·v⃗   |   ax+by+cz=d"},
"Lagebeziehungen":{summary:"Punkt–Gerade, Punkt–Ebene sowie Gerade–Gerade und Gerade–Ebene untersuchen.",formula:"Einsetzen → LGS lösen → Lösungsmenge geometrisch deuten"},
"Skalarprodukt":{summary:"Orthogonalität, Winkel und Projektionen mit dem Skalarprodukt untersuchen.",formula:"a⃗·b⃗ = a₁b₁+a₂b₂+a₃b₃   |   a⃗·b⃗=0 ⇔ a⃗⊥b⃗"},
"Abstände":{summary:"Abstände geometrisch deuten und mit geeigneten Verfahren berechnen.",formula:"Abstand ist die kürzeste Entfernung zwischen den betrachteten Objekten."},
"Winkel":{summary:"Winkel zwischen Vektoren, Geraden und Ebenen berechnen und interpretieren.",formula:"cos α = (a⃗·b⃗)/(|a⃗|·|b⃗|)"},
"Geometrie":{summary:"Algebraische Ergebnisse mit Punkten, Richtungen und räumlichen Figuren verbinden.",formula:"Rechnung + geometrische Interpretation gehören zusammen."}
};

const challenges=[
"Erkläre ohne Formeln: Was bedeutet ein Richtungsvektor geometrisch?",
"Warum ist das Skalarprodukt bei 90° besonders nützlich?",
"Woran erkennst du, ob ein Punkt auf einer Geraden liegt?",
"Was sagt dir eine Lösung eines LGS bei zwei Geraden geometrisch?",
"Erkläre den Unterschied zwischen Ortsvektor und Richtungsvektor.",
"Warum kann eine Gerade im Raum parallel zu einer Ebene sein?"
];

const tasks=[
{topic:"Vektoren",q:"Gegeben sind A(1|2|−1) und B(4|−2|3). Bestimme den Verbindungsvektor AB⃗.",type:"vec",ans:[3,-4,4],hint:"Ziehe die Koordinaten von A von den Koordinaten von B ab."},
{topic:"Skalarprodukt",q:"Sind a⃗=(1|2|−1) und b⃗=(2|0|2) orthogonal?",type:"yes",ans:0,hint:"Berechne a⃗·b⃗. Ist das Ergebnis 0?"},
{topic:"Geraden",q:"Liegt P(5|1|3) auf g: x⃗=(1|−3|0)+t·(2|2|1)?",type:"yes",ans:1,hint:"Aus x-, y- und z-Koordinate müssen sich derselbe Parameterwert ergeben."},
{topic:"Skalarprodukt",q:"Berechne a⃗·b⃗ für a⃗=(2|−1|3), b⃗=(1|4|0).",type:"number",ans: -2,hint:"Multipliziere die passenden Koordinaten und addiere."},
{topic:"Ebenen",q:"Eine Ebene enthält den Punkt A(1|2|0) und die Richtungsvektoren u⃗=(1|0|2), v⃗=(0|1|1). Welche Parameterform passt?",type:"choice",ans:0,choices:["x⃗=(1|2|0)+r(1|0|2)+s(0|1|1)","x⃗=(1|2|0)+r(0|1|1)+s(1|0|−2)","x⃗=(1|2|0)+r(1|1|2)"],hint:"Eine Ebene braucht einen Stützvektor und zwei linear unabhängige Richtungsvektoren."}
];

let state=JSON.parse(localStorage.getItem("vq3")||'{"attempts":0,"correct":0,"topics":{}}');
let current=null;

function save(){localStorage.setItem("vq3",JSON.stringify(state));updateProgress()}
function updateProgress(){
 document.getElementById("correct").textContent=state.correct;
 document.getElementById("attempts").textContent=state.attempts;
 const pct=state.attempts?Math.round(state.correct/state.attempts*100):0;
 document.getElementById("homeScore").textContent=pct+"%";
 document.getElementById("homeBar").style.width=pct+"%";
 document.getElementById("topicProgress").innerHTML=Object.keys(topics).map(t=>{
  const x=state.topics[t]||{a:0,c:0}; const p=x.a?Math.round(x.c/x.a*100):0;
  return `<div class="topicRow"><div class="row"><b>${t}</b><span>${p}%</span></div><div class="bar"><i style="width:${p}%"></i></div><span class="mini">${x.c}/${x.a} richtig</span></div>`
 }).join("");
}
function show(view){
 document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
 document.getElementById(view).classList.add("active");
 document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.view===view));
 window.scrollTo(0,0);
}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>show(b.dataset.view));
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));
document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{show("learn");setTimeout(()=>document.getElementById("topic-"+CSS.escape(b.dataset.topic))?.scrollIntoView({behavior:"smooth"}),50)});

document.getElementById("topicCards").innerHTML=Object.entries(topics).map(([name,t])=>`
<article class="card topic" id="topic-${name}" onclick="this.classList.toggle('flash')">
 <div class="row"><h3>${name}</h3><span>›</span></div><p class="summary">${t.summary}</p><div class="formula">${t.formula}</div>
</article>`).join("");

function makeTask(){
 const d=+document.getElementById("difficulty").value;
 const pool=d===1?tasks.slice(0,4):d===2?tasks:tasks;
 current=pool[Math.floor(Math.random()*pool.length)];
 document.getElementById("taskTopic").textContent=current.topic;
 document.getElementById("taskLevel").textContent="Level "+d;
 document.getElementById("question").textContent=current.q;
 const area=document.getElementById("answerArea"); document.getElementById("feedback").innerHTML="";
 if(current.type==="vec") area.innerHTML='<div class="answerGrid"><input id="a1" inputmode="decimal" placeholder="x"><input id="a2" inputmode="decimal" placeholder="y"><input id="a3" inputmode="decimal" placeholder="z"></div>';
 if(current.type==="yes") area.innerHTML='<div class="grid two"><button class="secondary choice" data-v="1">Ja</button><button class="secondary choice" data-v="0">Nein</button></div>';
 if(current.type==="number") area.innerHTML='<input id="num" inputmode="decimal" placeholder="Ergebnis">';
 if(current.type==="choice") area.innerHTML=current.choices.map((x,i)=>`<button class="secondary choice" data-v="${i}" style="width:100%;margin:4px 0;text-align:left">${x}</button>`).join("");
 document.querySelectorAll(".choice").forEach(x=>x.onclick=()=>{document.querySelectorAll(".choice").forEach(y=>y.classList.remove("selected"));x.classList.add("selected");x.style.outline="2px solid var(--accent)"});
}
function getAnswer(){
 if(current.type==="vec") return [+document.getElementById("a1").value,+document.getElementById("a2").value,+document.getElementById("a3").value];
 if(current.type==="number") return Number(document.getElementById("num").value);
 const x=document.querySelector(".choice.selected"); return x?Number(x.dataset.v):null;
}
function same(a,b){return Array.isArray(a)?a.length===b.length&&a.every((x,i)=>Number(x)===Number(b[i])):Number(a)===Number(b)}
document.getElementById("checkBtn").onclick=()=>{
 if(!current)return;
 const ans=getAnswer();
 if(ans===null || (Array.isArray(ans)&&ans.some(Number.isNaN))){document.getElementById("feedback").innerHTML='<div class="feedback hint">Wähle zuerst eine Antwort aus.</div>';return}
 const ok=same(ans,current.ans); state.attempts++; state.correct+=ok?1:0;
 state.topics[current.topic]??={a:0,c:0}; state.topics[current.topic].a++; state.topics[current.topic].c+=ok?1:0; save();
 document.getElementById("feedback").innerHTML=`<div class="feedback ${ok?"good":"bad"}">${ok?"✓ Richtig!":"Noch nicht. Schau dir den Rechenweg noch einmal an."}${!ok?`<br><small>${current.hint}</small>`:""}</div>`;
};
document.getElementById("hintBtn").onclick=()=>document.getElementById("feedback").innerHTML='<div class="feedback hint">💡 '+current.hint+"</div>";
document.getElementById("newTask").onclick=makeTask;
document.getElementById("difficulty").onchange=makeTask;

document.getElementById("analyzeBtn").onclick=()=>{
 const s=document.getElementById("exText").value.trim(), topic=document.getElementById("exTopic").value;
 if(!s){document.getElementById("analysis").innerHTML='<div class="feedback hint">Schreibe zuerst deine Erklärung.</div>';return}
 const checks=[];
 if(s.length>100) checks.push("✓ Deine Erklärung ist ausführlich genug.");
 else checks.push("→ Ergänze noch ein Beispiel oder eine Begründung.");
 if(/punkt|vektor|richtung/i.test(s)) checks.push("✓ Du verwendest zentrale geometrische Begriffe.");
 else checks.push("→ Versuche, die geometrische Bedeutung zu benennen.");
 if(/weil|da|deshalb|also|somit/i.test(s)) checks.push("✓ Du begründest Zusammenhänge.");
 else checks.push("→ Füge mindestens eine Begründung mit „weil“ oder „deshalb“ hinzu.");
 if(/formel|gleichung|produkt|parameter|senkrecht|parallel|abstand|winkel/i.test(s)) checks.push("✓ Fachsprache/Formelbezug erkannt.");
 else checks.push("→ Verknüpfe die Idee mit einem mathematischen Begriff oder einer Formel.");
 document.getElementById("analysis").innerHTML=`<div class="feedback ${checks.filter(x=>x.startsWith("✓")).length>=2?"good":"hint"}"><b>${topic}</b><br>${checks.join("<br>")}</div>`;
};
document.getElementById("newChallenge").onclick=()=>document.getElementById("challenge").textContent=challenges[Math.floor(Math.random()*challenges.length)];
document.getElementById("themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("vq3dark",document.body.classList.contains("dark"))};
if(localStorage.getItem("vq3dark")==="true")document.body.classList.add("dark");
document.getElementById("reset").onclick=()=>{if(confirm("Fortschritt wirklich löschen?")){state={attempts:0,correct:0,topics:{}};save()}};
updateProgress();makeTask();

if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
