// Math game module — UI listeners are attached at boot via attachMathListeners()
// ── Config ──
let op       = null;   // 'add' | 'sub' | 'mix'
let maxNum   = 10;
let allowNeg = false;
let rounds   = 10;     // 0 = endless
let showDots = true;

// ── State ──
let score    = 0;
let best     = 0;
let currentQ = 0;
let answered = false;
let correctAnswer = 0;
let qA = 0, qB = 0, qOp = '+';
// usedQuestions removed — not needed currently
let endless  = false;

// ── Emoji sets per operation ──
const addEmojis = ['🍎','🌟','🐶','🎈','🍕','🦋','⚽','🎁','🍦','🐱','🚀','🌈'];
const subEmojis = ['🍰','🍪','🎂','🧁','🍬','🍭','🍡','🍩','🎃','🌮','🍔','🥨'];
const mixEmojis = ['🧮','🔢','⭐','🎯','🏆','🎲','🎪','🎨','🎭','🌠'];

// ── Highscores ──
function bestKey(){ return `math_${op}_m${maxNum}_${allowNeg?'neg':'pos'}_${rounds||'inf'}`; }
function loadBest(){ try{ return JSON.parse(localStorage.getItem('mathBests')||'{}')[bestKey()]||0; }catch{ return 0; } }
function saveBest(v){ try{ const b=JSON.parse(localStorage.getItem('mathBests')||'{}'); if(!b[bestKey()]||v>b[bestKey()]){b[bestKey()]=v;localStorage.setItem('mathBests',JSON.stringify(b));} }catch{ /* ignore storage errors */ } }

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
      g.gain.setValueAtTime(.35,ctx.currentTime+w);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+w+.3);
      o.start(ctx.currentTime+w);o.stop(ctx.currentTime+w+.35);
    });
  } catch { /* ignore audio errors */ }
}
function playFail(){
  try{
    const ctx=getCtx();
    [[220,0,'sawtooth'],[175,.22,'sawtooth']].forEach(([f,w,t])=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);o.type=t;
      o.frequency.setValueAtTime(f,ctx.currentTime+w);
      o.frequency.exponentialRampToValueAtTime(f*.65,ctx.currentTime+w+.28);
      g.gain.setValueAtTime(.25,ctx.currentTime+w);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+w+.3);
      o.start(ctx.currentTime+w);o.stop(ctx.currentTime+w+.32);
    });
  } catch { /* ignore audio errors */ }
}

// ── Confetti ──
function spawnConfetti(count=15){
  const cl=['#FF6B6B','#FFD700','#4ECDC4','#A78BFA','#FF8DC7','#5DBB63','#FF9F43'];
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const el=document.createElement('div');el.className='confetti-piece';
      el.style.cssText=`left:${Math.random()*100}%;background:${cl[Math.floor(Math.random()*cl.length)]};animation-duration:${1+Math.random()*2}s;animation-delay:${Math.random()*.4}s;transform:rotate(${Math.random()*360}deg);border-radius:${Math.random()>.5?'50%':'2px'}`;
      document.body.appendChild(el);setTimeout(()=>el.remove(),3000);
    },i*50);
  }
}

// ── Picker ──
function selectOp(o){
  op=o;
  document.querySelectorAll('.mode-card').forEach(c=>c.classList.remove('selected'));
  document.getElementById('card'+o.charAt(0).toUpperCase()+o.slice(1)).classList.add('selected');
  document.getElementById('startBtn').disabled=false;
  document.getElementById('startBtn').textContent='Let\'s Go! 🚀';
  // Show negative option only for sub/mix
  document.getElementById('rowNegative').style.display=(o==='sub'||o==='mix')?'flex':'none';
}

function setMax(n){
  maxNum=n;
  setActiveOpt('pickerMax',n);
  setActiveOpt('sMax',n);
}
function setNeg(v){
  allowNeg=v;
  setActiveOpt('pickerNeg',v?'Yes':'No');
  setActiveOpt('sNeg',v?'Allow negatives':'No negatives');
}
function setRounds(n){
  rounds=n;
  endless=(n===0);
  const label=n===0?'♾️':String(n);
  setActiveOpt('pickerRounds',label);
  setActiveOpt('sRounds',label==='♾️'?'♾️ Endless':label);
  document.getElementById('btnEndless').textContent=endless?'♾️ Endless':'🔟 '+rounds+' Rounds';
  document.getElementById('btnEndless').classList.toggle('active',endless);
}
function setActiveOpt(containerId, value){
  const el=document.getElementById(containerId);
  if(!el) return;
  el.querySelectorAll('button').forEach(b=>{
    b.classList.toggle('active', b.textContent.trim()===String(value));
  });
}

// ── Toggles (in-game header) ──
function toggleEndless(){
  setRounds(endless?10:0);
  startGame();
}
function toggleDots(){
  showDots=!showDots;
  document.getElementById('btnDots').classList.toggle('active',showDots);
  document.getElementById('btnDots').textContent=showDots?'🔵 Show Dots':'⬜ Hide Dots';
  renderDots();
}

// ── Show/hide screens ──
function showPicker(){
  document.getElementById('pickerScreen').style.display='';
  document.getElementById('gameArea').style.display='none';
  document.getElementById('scoreArea').style.display='none';
  document.getElementById('togglesArea').style.display='none';
  document.getElementById('headerSub').textContent='Choose your challenge!';
}
function showGame(){
  document.getElementById('pickerScreen').style.display='none';
  document.getElementById('gameArea').style.display='flex';
  document.getElementById('scoreArea').style.display='flex';
  document.getElementById('togglesArea').style.display='flex';
  // Show/hide negative setting in modal
  document.getElementById('sNegSection').style.display=(op==='sub'||op==='mix')?'block':'none';
  // Hide dot toggle for compare mode
  document.getElementById('btnDots').style.display=(op==='cmp')?'none':'';
}

// ── Generate question ──
function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

// cmpCorrect stores '<', '>', or '=' for compare mode
let cmpCorrect = '';
let cmpLeft = 0, cmpRight = 0;

function generateQuestion(){
  if(op==='cmp'){
    // Generate two numbers; bias toward equal ~20% of the time
    const forceEqual = Math.random() < 0.2;
    cmpLeft = randInt(0, maxNum);
    cmpRight = forceEqual ? cmpLeft : randInt(0, maxNum);
    cmpCorrect = cmpLeft < cmpRight ? '<' : cmpLeft > cmpRight ? '>' : '=';
    return;
  }

  // pick operator
  let thisOp;
  if(op==='add') thisOp='+';
  else if(op==='sub') thisOp='-';
  else thisOp=Math.random()>.5?'+':'-';

  let a,b,ans;
  let attempts=0;
  do{
    a=randInt(0,maxNum);
    b=randInt(0,maxNum);
    if(thisOp==='+'){
      ans=a+b;
      // keep answer within 2*maxNum
      if(ans>maxNum*2) { b=randInt(0,maxNum-a); ans=a+b; }
    } else {
      if(!allowNeg && b>a){ [a,b]=[b,a]; } // swap so result ≥ 0
      ans=a-b;
    }
    attempts++;
  } while(attempts<20 && ans<(allowNeg?-maxNum:0));

  qA=a; qB=b; qOp=thisOp; correctAnswer=ans;
}

// ── Generate wrong answers (unique, plausible) ──
function generateOptions(correct){
  const opts=new Set([correct]);
  let tries=0;
  while(opts.size<3 && tries<100){
    tries++;
    const delta=randInt(1,Math.max(3,Math.ceil(maxNum/2)));
    const sign=Math.random()>.5?1:-1;
    const cand=correct+sign*delta;
    if(!allowNeg && cand<0) continue;
    if(cand===correct) continue;
    opts.add(cand);
  }
  // Fallback if still not 3
  let extra=correct-1;
  while(opts.size<3){ if(!opts.has(extra)&&(allowNeg||extra>=0)) opts.add(extra); extra--; }
  return shuffle([...opts]);
}

function shuffle(a){ const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

// ── Render dots visual ──
function renderDots(){
  const row=document.getElementById('dotsRow');
  if(!showDots||qOp==='-'&&qA>10){ row.innerHTML=''; return; }
  row.innerHTML='';
  if(qOp==='+'){
    for(let i=0;i<qA;i++){const d=document.createElement('span');d.className='dot dot-a';d.style.animationDelay=(i*.04)+'s';row.appendChild(d);}
    for(let i=0;i<qB;i++){const d=document.createElement('span');d.className='dot dot-b';d.style.animationDelay=((qA+i)*.04)+'s';row.appendChild(d);}
  } else {
    for(let i=0;i<qA;i++){
      const d=document.createElement('span');
      d.className='dot '+(i>=qA-qB?'dot-sub':'dot-a');
      d.style.animationDelay=(i*.04)+'s';
      if(i>=qA-qB) d.style.opacity='.3';
      row.appendChild(d);
    }
  }
}

const cmpEmojis=['⚖️','🏋️','🎯','🔢','📊','🧩','🎲','🌡️','⚡','🏆'];
// ── Emoji for current question ──
function pickEmoji(){
  const pool=op==='add'?addEmojis:op==='sub'?subEmojis:op==='cmp'?cmpEmojis:mixEmojis;
  return pool[Math.floor(Math.random()*pool.length)];
}

// ── Load question ──
function loadQuestion(){
  answered=false;
  generateQuestion();

  const isEndless=endless;
  const total=rounds||'∞';
  document.getElementById('progressText').textContent=
    isEndless?`Question ${currentQ+1} — Keep going! 🔥`:`Question ${currentQ+1} of ${total}`;
  document.getElementById('progressBar').style.width=
    isEndless?'100%':((currentQ/rounds)*100)+'%';

  document.getElementById('eqEmoji').textContent=pickEmoji();

  // Feedback reset
  document.getElementById('feedback').className='feedback';
  document.getElementById('feedback').textContent='';
  const nb=document.getElementById('nextBtn');
  nb.classList.remove('show'); nb.textContent='Next! ➡️'; nb.dataset.action='next';

  if(op==='cmp'){
    // Show compare layout, hide calc layout
    document.getElementById('calcBox').style.display='none';
    document.getElementById('cmpBox').style.display='flex';
    document.getElementById('cmpA').textContent=cmpLeft;
    document.getElementById('cmpB').textContent=cmpRight;
    document.getElementById('hintText').textContent=`Is ${cmpLeft} less than, greater than, or equal to ${cmpRight}?`;
    document.getElementById('dotsRow').innerHTML='';

    // Show cmp buttons, hide normal answer buttons
    document.getElementById('calcAnswers').style.display='none';
    document.getElementById('cmpAnswers').style.display='flex';

    // Fixed order: index 0=<, 1==, 2=>
    const cmpDefs=[
      {key:'<', icon:'◀️', label:'Less'},
      {key:'=', icon:'🟰', label:'Equal'},
      {key:'>', icon:'▶️', label:'More'}
    ];
    const correctCmpIdx = cmpDefs.findIndex(d=>d.key===cmpCorrect);
    cmpDefs.forEach((def,i)=>{
      const btn=document.getElementById('cbtn'+i);
      btn.className='cmp-btn'; btn.disabled=false;
      btn.innerHTML=`<span class="cmp-icon">${def.icon}</span><span class="cmp-label">${def.label}</span>`;
      if (btn.removeEventListener) btn.removeEventListener('click', btn._mathHandler);
      const handler = () => checkAnswerCmp(i, correctCmpIdx);
      btn._mathHandler = handler;
      btn.addEventListener('click', handler);
    });
    return;
  }

  // Normal calc mode — show calc layout, hide compare
  document.getElementById('calcBox').style.display='flex';
  document.getElementById('cmpBox').style.display='none';
  document.getElementById('calcAnswers').style.display='';
  document.getElementById('cmpAnswers').style.display='none';

  // Equation display
  document.getElementById('eqA').textContent=qA;
  document.getElementById('eqOp').textContent=qOp;
  document.getElementById('eqOp').className='eq-op '+(qOp==='+'?'plus':'minus');
  document.getElementById('eqB').textContent=qB;

  // Hint text
  const ht=document.getElementById('hintText');
  if(qOp==='+') ht.textContent=`What is ${qA} + ${qB}?`;
  else {
    ht.innerHTML=`What is ${qA} − ${qB}?`+(allowNeg&&correctAnswer<0?' <span class="negative-badge">can be negative!</span>':'');
  }

  renderDots();

  // Answer buttons
  const opts=generateOptions(correctAnswer);
  const correctIdx=opts.indexOf(correctAnswer);
  for(let i=0;i<3;i++){
    const btn=document.getElementById('btn'+i);
    btn.className='answer-btn'; btn.disabled=false;
    btn.textContent=opts[i];
    if (btn.removeEventListener) btn.removeEventListener('click', btn._mathHandler);
    const handler = () => checkAnswer(i, correctIdx);
    btn._mathHandler = handler;
    btn.addEventListener('click', handler);
  }
}

const goodMsg=["Super! 🌟","Wunderbar! ✨","Correct! 🎉","Genius! 🚀","Fantastic! 🌈","Yes! 👍","Nailed it! 💪"];
const badMsg=["Not quite! Try next one 😊","Almost! 🤔","Keep going! 💪","You got this! 🌟"];

function checkAnswer(idx,correctIdx){
  if(answered) return;
  answered=true;
  document.querySelectorAll('.answer-btn').forEach(b=>b.disabled=true);
  const fb=document.getElementById('feedback');

  if(idx===correctIdx){
    score++;
    document.getElementById('score').textContent=score;
    if(score>best){best=score;saveBest(best);document.getElementById('best').textContent=best;}
    document.getElementById('btn'+idx).classList.add('correct');
    fb.textContent=goodMsg[Math.floor(Math.random()*goodMsg.length)];
    fb.className='feedback good show';
    if(!endless) document.getElementById('star'+currentQ)?.classList.add('lit');
    playSuccess(); spawnConfetti();
  } else {
    document.getElementById('btn'+idx).classList.add('wrong');
    document.getElementById('btn'+correctIdx).classList.add('correct');
    playFail();
    if(endless){
      if(score>best){best=score;saveBest(best);document.getElementById('best').textContent=best;}
      fb.textContent=`Game over! You got ${score} in a row! 💪`;
      fb.className='feedback bad show';
      const nb=document.getElementById('nextBtn');
      nb.textContent='Try Again! 🔄'; nb.dataset.action='start';
      nb.classList.add('show');
      return;
    }
    fb.textContent=`The answer was ${correctAnswer} ${badMsg[Math.floor(Math.random()*badMsg.length)]}`;
    fb.className='feedback bad show';
  }
  document.getElementById('nextBtn').classList.add('show');
}

function checkAnswerCmp(idx, correctIdx){
  if(answered) return;
  answered=true;
  document.querySelectorAll('.cmp-btn').forEach(b=>b.disabled=true);
  const fb=document.getElementById('feedback');
  // symbol labels not currently used

  if(idx===correctIdx){
    score++;
    document.getElementById('score').textContent=score;
    if(score>best){best=score;saveBest(best);document.getElementById('best').textContent=best;}
    document.getElementById('cbtn'+idx).classList.add('correct');
    fb.textContent=goodMsg[Math.floor(Math.random()*goodMsg.length)];
    fb.className='feedback good show';
    if(!endless) document.getElementById('star'+currentQ)?.classList.add('lit');
    playSuccess(); spawnConfetti();
  } else {
    document.getElementById('cbtn'+idx).classList.add('wrong');
    document.getElementById('cbtn'+correctIdx).classList.add('correct');
    playFail();
    if(endless){
      if(score>best){best=score;saveBest(best);document.getElementById('best').textContent=best;}
      fb.textContent=`Game over! You got ${score} in a row! 💪`;
      fb.className='feedback bad show';
      const nb=document.getElementById('nextBtn');
      nb.textContent='Try Again! 🔄'; nb.dataset.action='start';
      nb.classList.add('show');
      return;
    }
    const symLabel={'<':'◀️ less than','=':'🟰 equal to','>':'▶️ more than'};
    fb.textContent=`${cmpLeft} is ${symLabel[cmpCorrect]} ${cmpRight} — ${badMsg[Math.floor(Math.random()*badMsg.length)]}`;
    fb.className='feedback bad show';
  }
  document.getElementById('nextBtn').classList.add('show');
}

function nextQuestion(){
  currentQ++;
  if(!endless && currentQ>=rounds){ endGame(); return; }
  if(endless && currentQ>=10000) currentQ=0;
  loadQuestion();
}

function endGame(){
  if(score>best){best=score;saveBest(best);}
  document.getElementById('best').textContent=best;
  document.getElementById('progressBar').style.width='100%';
  setTimeout(()=>{
    document.getElementById('questionCard').style.display='none';
    document.getElementById('endScreen').classList.add('show');
    const pct=Math.round(score/rounds*100);
    const msg=pct>=90?"🏆 Perfect! You're a math superstar!":pct>=70?"🌟 Great job! Keep practicing!":pct>=50?"👍 Good work! You're improving!":"💪 Keep going! Practice makes perfect!";
    document.getElementById('endScore').innerHTML=`You got <strong>${score} out of ${rounds}</strong> correct!<br><br>${msg}`;
    if(pct>=70) spawnConfetti(40);
  },600);
}

function setupStars(){
  const bar=document.getElementById('starsBar');
  bar.innerHTML='';
  if(endless){bar.style.display='none';return;}
  bar.style.display='flex';
  for(let i=0;i<rounds;i++){
    const s=document.createElement('span');s.className='star';s.textContent='⭐';s.id='star'+i;
    bar.appendChild(s);
  }
}

function startGame(){
  if(!op) return;
  closeSettings();
  score=0; currentQ=0;
  best=loadBest();
  document.getElementById('score').textContent=0;
  document.getElementById('best').textContent=best;
  document.getElementById('bestPill').childNodes[0].textContent=endless?'🏆 Best streak: ':'🏆 Best: ';
  document.getElementById('endScreen').classList.remove('show');
  document.getElementById('questionCard').style.display='';
  document.getElementById('btnEndless').textContent=endless?'♾️ Endless':`🔟 ${rounds} Rounds`;
  document.getElementById('btnDots').textContent=showDots?'🔵 Show Dots':'⬜ Hide Dots';
  document.getElementById('btnDots').classList.toggle('active',showDots);
  const opLabel=op==='add'?'➕ Addition':op==='sub'?'➖ Subtraction':op==='cmp'?'⚖️ Compare':'🔀 Mixed';
  document.getElementById('headerSub').textContent=opLabel+' — You can do it! 💪';
  showGame();
  setupStars();
  loadQuestion();
}

function openSettings(){ document.getElementById('settingsOverlay').classList.add('show'); }
function closeSettings(){ document.getElementById('settingsOverlay').classList.remove('show'); }

function attachMathListeners(){
  const byId=id=>document.getElementById(id);
  const menu = byId('menuBtn'); if(menu) menu.addEventListener('click', showPicker);
  const openSettingsBtn = byId('openSettingsBtn'); if(openSettingsBtn) openSettingsBtn.addEventListener('click', openSettings);
  const be = byId('btnEndless'); if(be) be.addEventListener('click', toggleEndless);
  const bd = byId('btnDots'); if(bd) bd.addEventListener('click', toggleDots);
  const cards = [['cardAdd','add'],['cardSub','sub'],['cardMix','mix'],['cardCmp','cmp']];
  cards.forEach(([cid, mode])=>{ const el=byId(cid); if(el) el.addEventListener('click', ()=>selectOp(mode)); });
  const pickerMax = byId('pickerMax'); if(pickerMax) pickerMax.addEventListener('click', (ev)=>{ const b=ev.target.closest('button'); if(!b) return; const v=b.dataset.max; if(v!==undefined) setMax(Number(v)); });
  const pickerNeg = byId('pickerNeg'); if(pickerNeg) pickerNeg.addEventListener('click', (ev)=>{ const b=ev.target.closest('button'); if(!b) return; const v=b.dataset.neg; if(v!==undefined) setNeg(v==='true'); });
  const pickerRounds = byId('pickerRounds'); if(pickerRounds) pickerRounds.addEventListener('click', (ev)=>{ const b=ev.target.closest('button'); if(!b) return; const v=b.dataset.rounds; if(v!==undefined) setRounds(Number(v)); });
  const start = byId('startBtn'); if(start) start.addEventListener('click', startGame);
  const next = byId('nextBtn'); if(next) next.addEventListener('click', ()=>{ if(next.dataset.action==='start') startGame(); else nextQuestion(); });
  const play = byId('playAgainBtn'); if(play) play.addEventListener('click', startGame);
  const change = byId('changeModeBtn'); if(change) change.addEventListener('click', showPicker);
  const settingsOverlay = byId('settingsOverlay'); if(settingsOverlay) settingsOverlay.addEventListener('click', closeSettingsIfBg);
  const sMax = byId('sMax'); if(sMax) sMax.addEventListener('click', (ev)=>{ const b=ev.target.closest('button'); if(!b) return; const v=b.dataset.max; if(v!==undefined){ setMax(Number(v)); startGame(); } });
  const sNeg = byId('sNeg'); if(sNeg) sNeg.addEventListener('click', (ev)=>{ const b=ev.target.closest('button'); if(!b) return; const v=b.dataset.neg; if(v!==undefined){ setNeg(v==='true'); startGame(); } });
  const sRounds = byId('sRounds'); if(sRounds) sRounds.addEventListener('click', (ev)=>{ const b=ev.target.closest('button'); if(!b) return; const v=b.dataset.rounds; if(v!==undefined){ setRounds(Number(v)); startGame(); } });
  const settingsClose = byId('settingsClose'); if(settingsClose) settingsClose.addEventListener('click', closeSettings);
}

function closeSettingsIfBg(e){ if(e.target===document.getElementById('settingsOverlay')) closeSettings(); }

// ── Init ──
attachMathListeners();
showPicker();
setMax(10);
setRounds(10);