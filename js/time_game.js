// ── Config ──
let difficulty = 'hour';  // 'hour' | 'half' | 'quarter' | 'five'
let rounds     = 10;
let endless    = false;

// ── State ──
let score = 0, best = 0, currentQ = 0, answered = false;
let correctHour = 0, correctMin = 0;

// ── Persist best ──
function bestKey(){ return `time_${difficulty}_${rounds||'inf'}`; }
function loadBest(){ try{ return JSON.parse(localStorage.getItem('timeBests')||'{}')[bestKey()]||0; }catch{ return 0; } }
function saveBest(v){ try{ const b=JSON.parse(localStorage.getItem('timeBests')||'{}'); if(!b[bestKey()]||v>b[bestKey()]){b[bestKey()]=v;localStorage.setItem('timeBests',JSON.stringify(b));} }catch(e){ void e; } }

// ── Sounds ──
let audioCtx=null;
function getCtx(){ if(!audioCtx) audioCtx=new(window.AudioContext||window.webkitAudioContext)(); return audioCtx; }
function playSuccess(){
  try{
    const ctx=getCtx();
    [[523,0],[659,.12],[784,.24],[1047,.38]].forEach(([f,w])=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);o.type='sine';
      o.frequency.setValueAtTime(f,ctx.currentTime+w);
      g.gain.setValueAtTime(.32,ctx.currentTime+w);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+w+.3);
      o.start(ctx.currentTime+w);o.stop(ctx.currentTime+w+.35);
    });
  }catch(e){ void e; }
}
function playFail(){
  try{
    const ctx=getCtx();
    [[220,0,'sawtooth'],[175,.22,'sawtooth']].forEach(([f,w,t])=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);o.type=t;
      o.frequency.setValueAtTime(f,ctx.currentTime+w);
      o.frequency.exponentialRampToValueAtTime(f*.65,ctx.currentTime+w+.28);
      g.gain.setValueAtTime(.22,ctx.currentTime+w);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+w+.3);
      o.start(ctx.currentTime+w);o.stop(ctx.currentTime+w+.32);
    });
  }catch(e){ void e; }
}
function spawnConfetti(count=15){
  const cl=['#FF6B6B','#FFD700','#2EC4B6','#A78BFA','#FF8DC7','#5DBB63','#FF9F43'];
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const el=document.createElement('div');el.className='confetti-piece';
      el.style.cssText=`left:${Math.random()*100}%;background:${cl[Math.floor(Math.random()*cl.length)]};animation-duration:${1+Math.random()*2}s;animation-delay:${Math.random()*.4}s;transform:rotate(${Math.random()*360}deg);border-radius:${Math.random()>.5?'50%':'2px'}`;
      document.body.appendChild(el);setTimeout(()=>el.remove(),3000);
    },i*50);
  }
}

// ── Draw clock ticks & numbers on init ──
function initClockFace(){
  const ticks = document.getElementById('ticks');
  const nums  = document.getElementById('nums');
  ticks.innerHTML = ''; nums.innerHTML = '';
  for(let i=0;i<60;i++){
    const angle = (i/60)*2*Math.PI - Math.PI/2;
    const isMajor = i%5===0;
    const r1 = isMajor ? 80 : 84;
    const r2 = 90;
    const x1 = 100 + r1*Math.cos(angle);
    const y1 = 100 + r1*Math.sin(angle);
    const x2 = 100 + r2*Math.cos(angle);
    const y2 = 100 + r2*Math.sin(angle);
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',x1); line.setAttribute('y1',y1);
    line.setAttribute('x2',x2); line.setAttribute('y2',y2);
    line.setAttribute('stroke', isMajor ? '#555' : '#ccc');
    line.setAttribute('stroke-width', isMajor ? '2.5' : '1');
    ticks.appendChild(line);
  }
  for(let h=1;h<=12;h++){
    const angle = (h/12)*2*Math.PI - Math.PI/2;
    const r = 68;
    const x = 100 + r*Math.cos(angle);
    const y = 100 + r*Math.sin(angle);
    const t = document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x', x); t.setAttribute('y', y);
    t.setAttribute('text-anchor','middle');
    t.setAttribute('dominant-baseline','central');
    t.setAttribute('font-size','14');
    t.setAttribute('font-weight','700');
    t.setAttribute('font-family','Baloo 2, sans-serif');
    t.setAttribute('fill','#333');
    t.textContent = h;
    nums.appendChild(t);
  }
}

// ── Draw hands ──
function drawHands(h, m){
  const minAngle  = (m / 60) * 360;
  const hourAngle = ((h % 12) / 12) * 360 + (m / 60) * 30;

  function handCoords(angleDeg, length){
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: 100 + length * Math.cos(rad), y: 100 + length * Math.sin(rad) };
  }
  const hPos = handCoords(hourAngle, 44);
  const mPos = handCoords(minAngle,  58);

  const hHand = document.getElementById('hourHand');
  const mHand = document.getElementById('minHand');
  hHand.setAttribute('x2', hPos.x); hHand.setAttribute('y2', hPos.y);
  mHand.setAttribute('x2', mPos.x); mHand.setAttribute('y2', mPos.y);
}

// ── Generate a time based on difficulty ──
function generateTime(){
  const h = Math.floor(Math.random()*12)+1; // 1–12
  let m;
  if(difficulty==='hour')    m = 0;
  else if(difficulty==='half')    m = Math.random()<.5 ? 0 : 30;
  else if(difficulty==='quarter') m = [0,15,30,45][Math.floor(Math.random()*4)];
  else { // five-minute steps
    m = Math.floor(Math.random()*12)*5;
  }
  return {h, m};
}

function timeLabel(h, m){
  if(m === 0)  return `${h} o'clock`;
  if(m === 15) return `quarter past ${h}`;
  if(m === 30) return `half past ${h}`;
  if(m === 45) return `quarter to ${h===12?1:h+1}`;
  const mStr = m < 10 ? '0'+m : m;
  return `${h}:${mStr}`;
}

// ── Generate 2 wrong options close to the right answer ──
function generateOptions(h, m){
  const correct = {h, m};
  const opts = [correct];

  // Generate candidate wrong times
  const candidates = [];
  for(let dh=-2; dh<=2; dh++){
    for(const dm of [-30,-15,0,15,30]){
      if(dh===0 && dm===0) continue;
      let nh = ((h-1+dh+12)%12)+1;
      let nm = m + dm;
      if(nm < 0){ nm += 60; nh = ((nh-2+12)%12)+1; }
      if(nm >= 60){ nm -= 60; nh = (nh%12)+1; }
      // Only use valid minutes for this difficulty
      const validMins = difficulty==='hour'?[0]:difficulty==='half'?[0,30]:difficulty==='quarter'?[0,15,30,45]:Array.from({length:12},(_,i)=>i*5);
      if(!validMins.includes(nm)) continue;
      if(nh===h && nm===m) continue;
      candidates.push({h:nh, m:nm});
    }
  }

  // Shuffle and pick 2 unique
  const shuffled = shuffle(candidates);
  const seen = new Set([`${h}:${m}`]);
  for(const c of shuffled){
    if(opts.length>=3) break;
    const key = `${c.h}:${c.m}`;
    if(!seen.has(key)){ seen.add(key); opts.push(c); }
  }
  // Fallback: bump hour
  while(opts.length < 3){
    const nh = (opts[opts.length-1].h % 12)+1;
    const key = `${nh}:${m}`;
    if(!seen.has(key)){ seen.add(key); opts.push({h:nh, m}); }
    else break;
  }
  return shuffle(opts);
}

function shuffle(a){ const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

// ── Setup & start ──
function setDiff(d){
  difficulty=d;
  document.querySelectorAll('#sDiff .s-opt').forEach(b=>b.classList.toggle('active',b.textContent.includes(
    d==='hour'?'Hours':d==='half'?'Half':d==='quarter'?'Quarter':'5'
  )));
  const labels={'hour':'Hours only 🕐','half':'Half hours 🕧','quarter':'Quarters 🕜','five':'5 min steps ⏱'};
  document.getElementById('headerSub').textContent=labels[d]+' — You can do it! 💪';
}
function setRounds(n){
  rounds=n; endless=(n===0);
  document.querySelectorAll('#sRounds .s-opt').forEach(b=>{
    const t=b.textContent.trim();
    b.classList.toggle('active', n===0?t.includes('♾️'):t===String(n));
  });
  document.getElementById('btnEndless').textContent=endless?'♾️ Endless':`🔟 ${rounds} Rounds`;
  document.getElementById('btnEndless').classList.toggle('active',endless);
}
function toggleEndless(){ setRounds(endless?10:0); startGame(); }
function openSettings(){ document.getElementById('settingsOverlay').classList.add('show'); }
function closeSettings(){ document.getElementById('settingsOverlay').classList.remove('show'); }
function goHome(){ window.location.href='/'; }

function setupStars(){
  const bar=document.getElementById('starsBar');
  bar.innerHTML='';
  if(endless){bar.style.display='none';return;}
  bar.style.display='flex';
  for(let i=0;i<rounds;i++){
    const s=document.createElement('span');s.className='star';s.textContent='⭐';s.id='star'+i;bar.appendChild(s);
  }
}

function startGame(){
  closeSettings();
  score=0; currentQ=0;
  best=loadBest();
  document.getElementById('score').textContent=0;
  document.getElementById('best').textContent=best;
  document.getElementById('bestPill').childNodes[0].textContent=endless?'🏆 Best streak: ':'🏆 Best: ';
  document.getElementById('endScreen').classList.remove('show');
  document.getElementById('questionCard').style.display='';
  document.getElementById('btnEndless').textContent=endless?'♾️ Endless':`🔟 ${rounds} Rounds`;
  setupStars();
  loadQuestion();
}

const goodMsg=["Super! 🌟","Wunderbar! ✨","Correct! 🎉","Genius! 🚀","Fantastic! 🌈","Yes! 👍","Nailed it! 💪"];
const badMsg=["Almost! Try the next one 😊","Keep going! 💪","You got this! 🌟","So close! 🤔"];

function loadQuestion(){
  answered=false;
  const time = generateTime();
  correctHour=time.h; correctMin=time.m;

  // Animate the clock
  const svg=document.getElementById('clockSvg');
  svg.style.animation='none';
  setTimeout(()=>svg.style.animation='',10);

  drawHands(correctHour, correctMin);

  const isEndless=endless;
  document.getElementById('progressText').textContent=
    isEndless?`Question ${currentQ+1} — Keep going! 🔥`:`Question ${currentQ+1} of ${rounds}`;
  document.getElementById('progressBar').style.width=
    isEndless?'100%':((currentQ/rounds)*100)+'%';

  document.getElementById('clockHint').textContent='What time does the clock show?';

  const opts=generateOptions(correctHour, correctMin);
  const correctIdx=opts.findIndex(o=>o.h===correctHour&&o.m===correctMin);

  for(let i=0;i<3;i++){
    const btn=document.getElementById('btn'+i);
    btn.className='answer-btn'; btn.disabled=false;
    btn.textContent=timeLabel(opts[i].h, opts[i].m);
    btn.onclick=(()=>{ const idx=i,ci=correctIdx; return()=>checkAnswer(idx,ci); })();
  }

  document.getElementById('feedback').className='feedback';
  document.getElementById('feedback').textContent='';
  const nb=document.getElementById('nextBtn');
  if(nb){ nb.classList.remove('show'); nb.textContent='Next! ➡️'; }
}

function checkAnswer(idx, correctIdx){
  if(answered) return;
  answered=true;
  document.querySelectorAll('.answer-btn').forEach(b=>b.disabled=true);
  const fb=document.getElementById('feedback');

  if(idx===correctIdx){
    score++;
    document.getElementById('score').textContent=score;
    if(score>best){ best=score; saveBest(best); document.getElementById('best').textContent=best; }
    document.getElementById('btn'+idx).classList.add('correct');
    fb.textContent=goodMsg[Math.floor(Math.random()*goodMsg.length)];
    fb.className='feedback good show';
    if(!endless) document.getElementById('star'+currentQ)?.classList.add('lit');
    playSuccess(); spawnConfetti();
  } else {
    document.getElementById('btn'+idx).classList.add('wrong');
    document.getElementById('btn'+correctIdx).classList.add('correct');
    playFail();
    const correct=`${timeLabel(correctHour,correctMin)}`;
    if(endless){
      if(score>best){ best=score; saveBest(best); document.getElementById('best').textContent=best; }
      fb.textContent=`It was ${correct}! You got ${score} in a row 💪`;
      fb.className='feedback bad show';
      const nb=document.getElementById('nextBtn');
      nb.textContent='Try Again! 🔄'; nb.onclick=startGame;
      nb.classList.add('show'); return;
    }
    fb.textContent=`It was ${correct}! ${badMsg[Math.floor(Math.random()*badMsg.length)]}`;
    fb.className='feedback bad show';
  }
  document.getElementById('nextBtn').classList.add('show');
}

function nextQuestion(){
  currentQ++;
  if(!endless && currentQ>=rounds){ endGame(); return; }
  loadQuestion();
}

function endGame(){
  if(score>best){ best=score; saveBest(best); }
  document.getElementById('best').textContent=best;
  document.getElementById('progressBar').style.width='100%';
  setTimeout(()=>{
    document.getElementById('questionCard').style.display='none';
    document.getElementById('endScreen').classList.add('show');
    const pct=Math.round(score/rounds*100);
    const msg=pct>=90?"🏆 Perfect! You're a time master!":pct>=70?"🌟 Great job! Keep practicing!":pct>=50?"👍 Good work! You're improving!":"💪 Keep going! Practice makes perfect!";
    document.getElementById('endScore').innerHTML=`You got <strong>${score} out of ${rounds}</strong> correct!<br><br>${msg}`;
    if(pct>=70) spawnConfetti(40);
  },600);
}

// ── Boot ──
initClockFace();
setDiff('hour');
setRounds(10);
// Attach DOM event listeners for controls (replaces inline onclick handlers)
function attachTimeListeners(){
  const btnHome = document.getElementById('btnHome'); if(btnHome) btnHome.addEventListener('click', goHome);
  const btnOpenSettings = document.getElementById('btnOpenSettings'); if(btnOpenSettings) btnOpenSettings.addEventListener('click', openSettings);
  const btnEndless = document.getElementById('btnEndless'); if(btnEndless) btnEndless.addEventListener('click', toggleEndless);
  const nextBtn = document.getElementById('nextBtn'); if(nextBtn) nextBtn.addEventListener('click', nextQuestion);
  const playAgain = document.getElementById('playAgainBtn'); if(playAgain) playAgain.addEventListener('click', startGame);

  const settingsOverlay = document.getElementById('settingsOverlay');
  if(settingsOverlay) settingsOverlay.addEventListener('click', e=>{ if(e.target===settingsOverlay) closeSettings(); });

  document.querySelectorAll('#sDiff .s-opt').forEach(b=>{
    b.addEventListener('click', ()=>{ const d=b.dataset.diff; if(d) setDiff(d); });
  });
  document.querySelectorAll('#sRounds .s-opt').forEach(b=>{
    b.addEventListener('click', ()=>{ const r=Number(b.dataset.rounds); setRounds(isNaN(r)?10:r); });
  });

  const settingsDone = document.getElementById('settingsDoneBtn'); if(settingsDone) settingsDone.addEventListener('click', ()=>{ closeSettings(); startGame(); });
}

attachTimeListeners();
startGame();