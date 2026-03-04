// ── Emoji pools ──
const THEMES = {
  animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🦆','🦉'],
  food:    ['🍎','🍌','🍕','🍔','🍦','🍪','🎂','🍓','🍊','🍋','🍇','🍑','🍒','🥕','🌽','🥦','🍩','🧁','🍫','🥝'],
  nature:  ['🌸','🌻','🌈','⭐','🌙','☀️','🌊','🔥','❄️','🌿','🍃','🍁','🌺','🌴','🌵','🍄','🌷','🪸','🦋','🐝'],
  space:   ['🚀','🛸','🌍','🌕','⭐','☄️','🪐','🌌','👨‍🚀','🛰️','🌟','💫','🪨','🔭','🌠','🌙','☀️','🌑','🌏','🪝'],
  sports:  ['⚽','🏀','🎾','🏈','⚾','🏐','🏉','🎱','🏓','🏸','🥊','🛹','🎿','⛷️','🏋️','🤸','🧗','🤾','🏊','🚴'],
};

// ── Config ──
let gridSize  = 0;    // total cards (8/12/16/20)
let theme     = 'animals';
let peekMs    = 1500; // show all cards briefly at start

// ── State ──
let cards     = [];   // [{id, emoji, matched, flipped}]
let flipped   = [];   // indices of currently face-up unmatched cards
let moves     = 0;
let pairsFoundCount = 0;
let pairsNeeded = 0;
let locked    = false;
let timerInterval = null;
let elapsedSec = 0;
let gameActive = false;

// ── Persist best ──
function bestKey(){ return `mem_${theme}_${gridSize}`; }
function loadBest(){ try{ return JSON.parse(localStorage.getItem('memBests')||'{}')[bestKey()]||null; }catch{ return null; } }
function saveBest(moves, secs){
  try{
    const b=JSON.parse(localStorage.getItem('memBests')||'{}');
    const k=bestKey();
    if(!b[k]||moves<b[k].moves||(moves===b[k].moves&&secs<b[k].secs)){
      b[k]={moves,secs}; localStorage.setItem('memBests',JSON.stringify(b));
    }
  } catch { /* ignore storage errors */ }
}
function fmtTime(s){ return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }

// ── Sound ──
let audioCtx=null;
function getCtx(){ if(!audioCtx) audioCtx=new(window.AudioContext||window.webkitAudioContext)(); return audioCtx; }
function playFlip(){
  try{
    const ctx=getCtx(), o=ctx.createOscillator(), g=ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type='sine'; o.frequency.setValueAtTime(600,ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(900,ctx.currentTime+.08);
    g.gain.setValueAtTime(.15,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.12);
    o.start(); o.stop(ctx.currentTime+.14);
  } catch { /* ignore audio errors */ }
}
function playMatch(){
  try{
    const ctx=getCtx();
    [[523,0],[784,.1],[1047,.2]].forEach(([f,w])=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);o.type='sine';
      o.frequency.setValueAtTime(f,ctx.currentTime+w);
      g.gain.setValueAtTime(.28,ctx.currentTime+w);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+w+.25);
      o.start(ctx.currentTime+w);o.stop(ctx.currentTime+w+.28);
    });
  } catch { /* ignore audio errors */ }
}
function playNoMatch(){
  try{
    const ctx=getCtx();
    [[300,0],[220,.18]].forEach(([f,w])=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);o.type='sawtooth';
      o.frequency.setValueAtTime(f,ctx.currentTime+w);
      g.gain.setValueAtTime(.18,ctx.currentTime+w);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+w+.22);
      o.start(ctx.currentTime+w);o.stop(ctx.currentTime+w+.25);
    });
  } catch { /* ignore audio errors */ }
}
function spawnConfetti(count=30){
  const cl=['#FF6B6B','#FFD700','#4ECDC4','#A78BFA','#FF8DC7','#5DBB63','#FF9F43'];
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const el=document.createElement('div');el.className='confetti-piece';
      el.style.cssText=`left:${Math.random()*100}%;background:${cl[Math.floor(Math.random()*cl.length)]};animation-duration:${1+Math.random()*2}s;animation-delay:${Math.random()*.5}s;transform:rotate(${Math.random()*360}deg);border-radius:${Math.random()>.5?'50%':'2px'}`;
      document.body.appendChild(el);setTimeout(()=>el.remove(),3500);
    },i*40);
  }
}

// ── Picker ──
function selectGrid(n){
  gridSize=n;
  document.querySelectorAll('.grid-card').forEach(c=>c.classList.remove('sel'));
  document.getElementById('gc'+n).classList.add('sel');
  document.getElementById('startBtn').disabled=false;
  document.getElementById('startBtn').textContent='Let\'s Go! 🚀';
  refreshBestDisplay();
}
function setTheme(t){
  theme=t;
  document.querySelectorAll('#sTheme .s-opt').forEach(b=>{
    const names={'animals':'Animals','food':'Food','nature':'Nature','space':'Space','sports':'Sports'};
    b.classList.toggle('active', b.textContent.includes(names[t]));
  });
  const icons={'animals':'🐾','food':'🍕','nature':'🌸','space':'🚀','sports':'⚽'};
  document.getElementById('btnTheme').textContent=icons[t]+' '+t.charAt(0).toUpperCase()+t.slice(1);
  refreshBestDisplay();
}
function cycleTheme(){
  const order=['animals','food','nature','space','sports'];
  const idx=(order.indexOf(theme)+1)%order.length;
  setTheme(order[idx]);
}
function setPeek(ms){
  peekMs=ms;
  document.querySelectorAll('#sPeek .s-opt').forEach(b=>{
    b.classList.toggle('active', b.textContent.includes(ms===0?'None':ms===1500?'1.5':'3'));
  });
}
function refreshBestDisplay(){
  const b=loadBest();
  document.getElementById('bestMoves').textContent = b ? b.moves+' moves' : '—';
  document.getElementById('bestTime').textContent  = b ? fmtTime(b.secs) : '—';
}

// ── Timer ──
function startTimer(){
  elapsedSec=0; clearInterval(timerInterval);
  timerInterval=setInterval(()=>{
    elapsedSec++;
    document.getElementById('timer').textContent=fmtTime(elapsedSec);
  },1000);
}
function stopTimer(){ clearInterval(timerInterval); }

// ── Build board ──
function shuffle(a){ const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

function buildBoard(){
  const pool = shuffle([...THEMES[theme]]).slice(0, gridSize/2);
  const pairs = shuffle([...pool, ...pool]);
  cards = pairs.map((emoji,i)=>({id:i, emoji, matched:false, flipped:false}));
  pairsNeeded = gridSize/2;
  pairsFoundCount = 0;
  moves = 0;
  flipped = [];
  locked = false;

  document.getElementById('moveCount').textContent = 0;
  document.getElementById('timer').textContent = '0:00';
  document.getElementById('pairsFound').textContent = 0;
  document.getElementById('pairsTotal').textContent = pairsNeeded;

  // Grid columns
  const board = document.getElementById('board');
  board.className = 'board ' + (gridSize<=16 ? 'grid-4' : 'grid-5');
  board.innerHTML = '';

  cards.forEach((card,i)=>{
    const el = document.createElement('div');
    el.className = 'card';
    el.id = 'card'+i;
    el.innerHTML = `<div class="card-back"></div><div class="card-front">${card.emoji}</div>`;
    // handler attached at build time
    el.addEventListener('click', ()=>flipCard(i));
    board.appendChild(el);
  });
}

// ── Peek (briefly show all cards) ──
function doPeek(){
  if(peekMs===0){ startTimer(); gameActive=true; return; }
  locked=true;
  // Show all
  cards.forEach((_,i)=>document.getElementById('card'+i).classList.add('flipped'));

  // Countdown overlay
  let remaining = Math.ceil(peekMs/1000);
  const overlay = document.createElement('div');
  overlay.className='countdown';
  overlay.innerHTML=`<div class="countdown-num" id="cdNum">${remaining}</div>`;
  document.body.appendChild(overlay);

  const tick = setInterval(()=>{
    remaining--;
    const numEl=document.getElementById('cdNum');
    if(numEl) { numEl.style.animation='none'; numEl.textContent=remaining>0?remaining:'Go!'; setTimeout(()=>numEl.style.animation='',10); }
    if(remaining<=0){
      clearInterval(tick);
      setTimeout(()=>{
        overlay.remove();
        cards.forEach((_,i)=>document.getElementById('card'+i).classList.remove('flipped'));
        locked=false; gameActive=true; startTimer();
      },500);
    }
  },1000);
}

// ── Flip logic ──
function flipCard(i){
  if(locked || !gameActive) return;
  if(cards[i].matched || cards[i].flipped) return;
  if(flipped.length>=2) return;

  playFlip();
  cards[i].flipped=true;
  document.getElementById('card'+i).classList.add('flipped');
  flipped.push(i);

  if(flipped.length===2){ checkMatch(); }
}

function checkMatch(){
  locked=true;
  moves++;
  document.getElementById('moveCount').textContent=moves;

  const [a,b]=flipped;
  if(cards[a].emoji===cards[b].emoji){
    // Match: mark immediately so cards stay visible without a brief flicker
    cards[a].matched = cards[b].matched = true;
    document.getElementById('card'+a).classList.add('matched');
    document.getElementById('card'+b).classList.add('matched');
    pairsFoundCount++;
    document.getElementById('pairsFound').textContent = pairsFoundCount;
    flipped = [];
    locked = false;
    playMatch();
    spawnConfetti(8);
    if(pairsFoundCount===pairsNeeded) endGame();
  } else {
    // No match
    setTimeout(()=>{
      const ca=document.getElementById('card'+a), cb=document.getElementById('card'+b);
      ca.classList.add('wrong-flash'); cb.classList.add('wrong-flash');
      playNoMatch();
      setTimeout(()=>{
        ca.classList.remove('flipped','wrong-flash');
        cb.classList.remove('flipped','wrong-flash');
        cards[a].flipped=cards[b].flipped=false;
        flipped=[];
        locked=false;
      },500);
    },400);
  }
}

// ── End ──
function endGame(){
  stopTimer(); gameActive=false;
  saveBest(moves, elapsedSec);
  refreshBestDisplay();
  spawnConfetti(50);

  setTimeout(()=>{
    document.getElementById('gameArea').style.display='none';
    const end=document.getElementById('endScreen');
    end.style.display='flex';

    const perfect = moves === pairsNeeded;
    document.getElementById('endEmoji').textContent = perfect?'🏆':moves<=pairsNeeded*1.5?'🌟':'🎉';
    const rating = perfect?'Perfect! No wasted moves! 🏆':moves<=pairsNeeded*1.5?'Excellent memory! 🌟':moves<=pairsNeeded*2?'Great job! 🎉':'Well done! 💪';
    document.getElementById('endStats').innerHTML=
      `Pairs: <strong>${pairsNeeded}</strong> &nbsp;|&nbsp; Moves: <strong>${moves}</strong> &nbsp;|&nbsp; Time: <strong>${fmtTime(elapsedSec)}</strong><br><br>${rating}`;
  },600);
}

// ── Screen control ──
function showPicker(){
  document.getElementById('pickerScreen').style.display='flex';
  document.getElementById('gameArea').style.display='none';
  document.getElementById('endScreen').style.display='none';
  stopTimer(); gameActive=false;
  refreshBestDisplay();
}

function startGame(){
  if(!gridSize) return;
  closeSettings();
  document.getElementById('pickerScreen').style.display='none';
  document.getElementById('endScreen').style.display='none';
  document.getElementById('gameArea').style.display='flex';
  stopTimer();
  buildBoard();
  doPeek();
}

function goHome(){ window.location.href='/'; }
function openSettings(){ document.getElementById('settingsOverlay').classList.add('show'); }
function closeSettings(){ document.getElementById('settingsOverlay').classList.remove('show'); }

function closeSettingsIfBg(e){ if(e.target===document.getElementById('settingsOverlay')) closeSettings(); }

function attachMemoryListeners(){
  const byId=id=>document.getElementById(id);
  const menu = byId('menuBtn'); if(menu) menu.addEventListener('click', goHome);
  const openSettingsBtn = byId('openSettingsBtn'); if(openSettingsBtn) openSettingsBtn.addEventListener('click', openSettings);
  const btnTheme = byId('btnTheme'); if(btnTheme) btnTheme.addEventListener('click', cycleTheme);
  ['8','12','16','20'].forEach(sz=>{ const el=byId('gc'+sz); if(el) el.addEventListener('click', ()=>selectGrid(Number(el.dataset.grid||sz))); });
  const start = byId('startBtn'); if(start) start.addEventListener('click', startGame);
  const play = byId('playAgainBtn'); if(play) play.addEventListener('click', startGame);
  const change = byId('changeBtn'); if(change) change.addEventListener('click', showPicker);
  const settingsOverlay = byId('settingsOverlay'); if(settingsOverlay) settingsOverlay.addEventListener('click', closeSettingsIfBg);
  const sTheme = byId('sTheme'); if(sTheme) sTheme.addEventListener('click', (ev)=>{ const b=ev.target.closest('button'); if(!b) return; const t=b.dataset.theme; if(t) setTheme(t); });
  const sPeek = byId('sPeek'); if(sPeek) sPeek.addEventListener('click', (ev)=>{ const b=ev.target.closest('button'); if(!b) return; const p=b.dataset.peek; if(p!==undefined) setPeek(Number(p)); });
  const settingsClose = byId('settingsClose'); if(settingsClose) settingsClose.addEventListener('click', closeSettings);
}

// ── Boot ──
attachMemoryListeners();
showPicker();