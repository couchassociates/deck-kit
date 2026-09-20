(function(){
  'use strict';
  var VERSION='1.1.0';
  var stage=document.getElementById('stage');
  if(!stage){console.warn('[player] No #stage element found; the player did not start.');return;}
  var CHROME='<div id="progress"></div>\n<div id="hud">\n  <button id="btnPrev" type="button" aria-label="Previous slide">←</button>\n  <button id="btnGrid" type="button" aria-label="Slide index">⊞</button>\n  <span class="count" id="count">0 / 0</span>\n  <button id="btnNext" type="button" aria-label="Next slide">→</button>\n  <button id="btnNotes" type="button" aria-label="Toggle presenter notes">N</button>\n</div>\n<button id="pk-present" type="button" aria-label="Open the presenter view in a new window" title="Presenter view: notes, clock and tools in a second window. N shows them in this one."><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8M7 8.5h6M7 11.5h10"/></svg></button>\n<div id="ribbonwrap"><div id="ribCtl"><button type="button" id="ribFirst" aria-label="Scroll the ribbon to the first slide" title="First slide">⇤</button><button type="button" id="ribCenter" aria-label="Centre the ribbon on the current slide">⌖ current</button><button type="button" id="ribLast" aria-label="Scroll the ribbon to the last slide" title="Last slide">⇥</button></div><button type="button" class="rarrow l" id="ribL" aria-label="Scroll slides left">‹</button><nav id="ribbon" aria-label="All slides"></nav><button type="button" class="rarrow r" id="ribR" aria-label="Scroll slides right">›</button></div>\n<nav id="tools" aria-label="Drawing tools">\n  <button type="button" data-tool="pointer" title="Pointer (V), mirrors your cursor and text selection"><b>↖</b><span class="lbl">Point</span><i>V</i></button>\n  <button type="button" data-tool="pen" title="Pen (P)"><b>✎</b><span class="lbl">Pen</span><i>P</i></button>\n  <button type="button" data-tool="hi" title="Highlighter (H)"><b>▬</b><span class="lbl">Mark</span><i>H</i></button>\n  <button type="button" data-tool="laser" title="Laser (L)"><b>●</b><span class="lbl">Laser</span><i>L</i></button>\n  <button type="button" data-tool="circle" title="Oval (O), Shift for a circle"><b>◯</b><span class="lbl">Oval</span><i>O</i></button>\n  <span class="split"><button type="button" data-tool="mag" title="Magnifier (M)"><b>⌕</b><span class="lbl">Zoom</span><i>M</i></button><button type="button" id="magSizeBtn" class="caret" title="Magnifier size" aria-label="Choose the magnifier size">▾</button></span>\n  <div class="pop mag" id="magPop"><button type="button" class="mopt on" data-mag="320" aria-label="Magnifier 320 px"><svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><circle cx="20" cy="20" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/></svg></button><button type="button" class="mopt" data-mag="440" aria-label="Magnifier 440 px"><svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><circle cx="20" cy="20" r="10.5" fill="none" stroke="currentColor" stroke-width="2.5"/></svg></button><button type="button" class="mopt" data-mag="560" aria-label="Magnifier 560 px"><svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="2.5"/></svg></button><button type="button" class="mopt" data-mag="720" aria-label="Magnifier 720 px"><svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" stroke-width="2.5"/></svg></button></div>\n  <div class="sep"></div>\n  <button type="button" id="swatchBtn" class="sw" title="Colour (1 to 9, 0)" aria-label="Choose a colour" style="background:#FFCD0A"></button>\n  <div class="pop colors" id="colorPop"><button type="button" class="sw on" data-color="#FFCD0A" style="background:#FFCD0A" aria-label="Yellow (1)"></button><button type="button" class="sw" data-color="#F28C28" style="background:#F28C28" aria-label="Orange (2)"></button><button type="button" class="sw" data-color="#C8351D" style="background:#C8351D" aria-label="Red (3)"></button><button type="button" class="sw" data-color="#E0479E" style="background:#E0479E" aria-label="Pink (4)"></button><button type="button" class="sw" data-color="#7B3FBF" style="background:#7B3FBF" aria-label="Purple (5)"></button><button type="button" class="sw" data-color="#0E1F66" style="background:#0E1F66" aria-label="Navy (6)"></button><button type="button" class="sw" data-color="#1FA7C9" style="background:#1FA7C9" aria-label="Cyan (7)"></button><button type="button" class="sw" data-color="#2E9E5B" style="background:#2E9E5B" aria-label="Green (8)"></button><button type="button" class="sw" data-color="#17160F" style="background:#17160F" aria-label="Black (9)"></button><button type="button" class="sw" data-color="#FFFFFF" style="background:#FFFFFF" aria-label="White (0)"></button></div>\n  <div class="sep"></div>\n  <button type="button" id="widthBtn" title="Width ([ and ])" aria-label="Choose a width"><svg viewBox="0 0 40 20" width="40" height="20" aria-hidden="true"><line x1="4" y1="10" x2="36" y2="10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></button>\n  <div class="pop widths" id="widthPop"><button type="button" class="wopt" data-size="0" aria-label="Width 1"><svg viewBox="0 0 40 20" width="40" height="20" aria-hidden="true"><line x1="4" y1="10" x2="36" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button><button type="button" class="wopt on" data-size="1" aria-label="Width 2"><svg viewBox="0 0 40 20" width="40" height="20" aria-hidden="true"><line x1="4" y1="10" x2="36" y2="10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></button><button type="button" class="wopt" data-size="2" aria-label="Width 3"><svg viewBox="0 0 40 20" width="40" height="20" aria-hidden="true"><line x1="4" y1="10" x2="36" y2="10" stroke="currentColor" stroke-width="7" stroke-linecap="round"/></svg></button><button type="button" class="wopt" data-size="3" aria-label="Width 4"><svg viewBox="0 0 40 20" width="40" height="20" aria-hidden="true"><line x1="4" y1="10" x2="36" y2="10" stroke="currentColor" stroke-width="11" stroke-linecap="round"/></svg></button></div>\n  <div class="sep"></div>\n  <button type="button" class="clear" data-action="clear" title="Clear this slide (C)"><b>×</b><span class="lbl">Clear</span><i>C</i></button>\n</nav>\n<aside id="notes" aria-label="Presenter notes">\n  <section id="nowcard"><div class="head"><div><div class="lbl">Notes</div><div class="nt" id="notesTitle"></div></div></div><div id="notesBody"></div></section>\n  <div id="bottom">\n  <div id="clock">\n    <div class="row"><span class="big" id="elapsed">00:00</span><span class="of">of 60:00</span><span class="st idle" id="statusPace">not started</span>\n      <span class="btns"><button type="button" id="ckToggle" class="primary" aria-label="Start or pause the clock"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 2l11 6-11 6z" fill="currentColor"/></svg></button><button type="button" id="ckMore" aria-label="Show clock options">⋯</button></span></div>\n    <div class="setrow"><button type="button" id="ckReset" aria-label="Reset the clock" title="Reset (Shift+R)"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 3a5 5 0 1 1-4.6 3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 2v5h5" fill="none" stroke="currentColor" stroke-width="2"/></svg></button><label for="ckSet">Set to</label><input id="ckSet" type="text" inputmode="numeric" placeholder="mm:ss" aria-label="Set the clock to a time"><button type="button" id="ckSetBtn">Set</button><button type="button" id="ckSlide">This slide\'s start</button></div>\n    <div id="pace" class="idle"><b>Clock not started</b>Press T or Start when the session begins.<span class="win" id="paceWin"></span></div>\n  </div>\n  <div id="nextwrap"><div class="k">Next</div><div id="nextframe"></div></div>\n  <div id="sync">Presenter view · <b id="syncState">solo</b></div>\n  <div id="keys"><div class="line"><span class="k">Keys</span><span><kbd>→</kbd> <kbd>←</kbd> slides</span><span><kbd>B</kbd> hold</span><span><kbd>T</kbd> clock</span><button type="button" id="keysToggle">All keys</button></div><div class="full key"><kbd>→</kbd> <kbd>space</kbd> next &nbsp; <kbd>←</kbd> prev &nbsp; <kbd>G</kbd> index &nbsp; <kbd>Esc</kbd> pointer tool, then index &nbsp; <kbd>N</kbd> notes &nbsp; <kbd>F</kbd> fullscreen &nbsp; <kbd>B</kbd> hold screen &nbsp; <kbd>T</kbd> clock start/pause &nbsp; <kbd>shift</kbd>+<kbd>R</kbd> reset clock &nbsp; <kbd>Home</kbd> title &nbsp; <kbd>End</kbd> last<br>Tools toggle on and off; press the active tool\'s key again, or <kbd>Esc</kbd>, to drop it. With no tool selected nothing is mirrored to the shared window. <kbd>V</kbd> pointer &nbsp; <kbd>P</kbd> pen &nbsp; <kbd>H</kbd> highlighter &nbsp; <kbd>L</kbd> laser &nbsp; <kbd>O</kbd> oval (drag, shift for a circle) &nbsp; <kbd>M</kbd> magnifier (click to place, click again to move; the caret beside Zoom sets its size) &nbsp; <kbd>C</kbd> clear slide &nbsp; <kbd>1</kbd>–<kbd>9</kbd> colour, <kbd>0</kbd> white &nbsp; <kbd>[</kbd> <kbd>]</kbd> width (four presets). Ink is kept per slide for the session; a reload clears it.<br>Two windows of this deck on one machine stay in step, ink included. Share the one without notes.</div></div>\n  </div>\n</aside>';
  document.body.insertAdjacentHTML('beforeend',CHROME);
  /* ===== PLAYER · viewer, presenter, sync, clock, ink.
     Contract with the content zone: each slide is a <section class="slide"> inside #stage, with
     data-title, optional data-start / data-end (minutes) and an optional <aside class="notes">.
     Nothing else in the content is read. ===== */
  var W=+stage.getAttribute('data-width')||1920,H=+stage.getAttribute('data-height')||1080;
  document.documentElement.style.setProperty('--pk-w',W+'px');document.documentElement.style.setProperty('--pk-h',H+'px');
  var RIB=176,TOOLH=62,GUT=0,PAD=36,DUR=+stage.getAttribute('data-duration')||60,TOTAL=DUR*60*1000;
  var DECK_TITLE=document.title||'Deck';
  var CHANNEL='deck-player:'+(stage.getAttribute('data-channel')||DECK_TITLE);
  var body=document.body,viewport=document.getElementById('viewport')||stage.parentElement;
  var content=Array.prototype.slice.call(stage.querySelectorAll(':scope > section.slide'));
  var brand=stage.getAttribute('data-brand')||'',version=stage.getAttribute('data-version')||'';

  /* ---- generated pieces: index slide, hold screen, ink layers ---- */
  var grid=document.createElement('section');grid.className='slide grid';grid.setAttribute('data-title','Index');
  grid.innerHTML='<div class="gridhead"><h2>'+DECK_TITLE+' <span class="mute" style="font-weight:400;font-size:34px">· '+content.length+' slides'+(version?' · '+version:'')+'</span></h2><div class="hint">Click a slide · → to start · N notes · F fullscreen</div></div><div class="thumbs" id="thumbs"></div><aside class="notes"><p>This is the index. The deck loops: after the last slide you land back here. Press → to begin on the title slide.</p><p>The drawing tools work on slides, not here. Pick one now and it is ready when you advance.</p></aside>';
  if(!content.length){grid.querySelector('.thumbs').innerHTML='<p style="font-family:var(--pk-mono);font-size:22px;color:var(--pk-mute)">No slides found. Add &lt;section class="slide"&gt; elements inside #stage.</p>';}
  stage.insertBefore(grid,stage.firstChild);
  var ink=document.createElement('canvas');ink.id='ink';ink.width=W;ink.height=H;stage.appendChild(ink);
  var fx=document.createElement('canvas');fx.id='fx';fx.width=W;fx.height=H;stage.appendChild(fx);
  var lens=document.createElement('div');lens.id='lens';lens.setAttribute('aria-hidden','true');stage.appendChild(lens);
  var hold=document.createElement('div');hold.id='hold';hold.setAttribute('aria-hidden','true');hold.innerHTML='<div class="t">'+DECK_TITLE+'</div><div class="wordmark">'+brand+'</div>';stage.appendChild(hold);

  var slides=[grid].concat(content),N=slides.length,last=N-1,cur=-1;
  var notesBody=document.getElementById('notesBody'),notesTitle=document.getElementById('notesTitle'),countEl=document.getElementById('count'),progress=document.getElementById('progress');
  var thumbs=document.getElementById('thumbs'),ribbon=document.getElementById('ribbon'),nextframe=document.getElementById('nextframe');

  function cloneSlide(i){var c=slides[i].cloneNode(true);c.classList.add('is-active');c.removeAttribute('data-title');c.removeAttribute('id');var n=c.querySelector('.notes');if(n)n.remove();c.setAttribute('inert','');c.setAttribute('aria-hidden','true');return c;}
  /* a clone sits inside chrome that centres text and sets its own face, size and colour. Give its frame what a real
     slide inherits from the stage, so a thumbnail never differs from the slide it shows. */
  var INHERITED=['fontFamily','fontSize','fontStyle','fontWeight','lineHeight','letterSpacing','wordSpacing','textAlign','textTransform','textIndent','whiteSpace','color'];
  function likeStage(el){var cs=getComputedStyle(stage);INHERITED.forEach(function(p){el.style[p]=cs[p];});return el;}
  function titleOf(i){return i===0?'Index':(slides[i].getAttribute('data-title')||('Slide '+i));}
  function cap(i){var sl=slides[i];return '<b>'+String(i).padStart(2,'0')+'</b><span>'+titleOf(i)+(sl.hasAttribute('data-start')?' · '+sl.getAttribute('data-start')+'–'+sl.getAttribute('data-end'):'')+'</span>';}

  /* ---- layout ---- */
  function panelW(){return Math.min(660,window.innerWidth*0.5);}
  var tools=document.getElementById('tools'),swatchBtn=document.getElementById('swatchBtn'),colorPop=document.getElementById('colorPop'),widthBtn=document.getElementById('widthBtn'),widthPop=document.getElementById('widthPop'),magSizeBtn=document.getElementById('magSizeBtn'),magPop=document.getElementById('magPop');
  function fitTools(){
    if(!body.classList.contains('notes-open'))return;
    tools.classList.remove('compact');
    if(tools.scrollWidth>tools.clientWidth+1)tools.classList.add('compact');
  }
  function closePops(){colorPop.classList.remove('open');widthPop.classList.remove('open');magPop.classList.remove('open');}
  function togglePop(btn,pop){var was=pop.classList.contains('open');closePops();if(!was){var r=btn.getBoundingClientRect();pop.style.left=Math.max(8,Math.min(r.left-8,window.innerWidth-200))+'px';pop.classList.add('open');}}
  swatchBtn.addEventListener('click',function(e){e.stopPropagation();togglePop(swatchBtn,colorPop);});
  widthBtn.addEventListener('click',function(e){e.stopPropagation();togglePop(widthBtn,widthPop);});
  magSizeBtn.addEventListener('click',function(e){e.stopPropagation();togglePop(magSizeBtn,magPop);});
  document.addEventListener('click',function(e){if(!e.target.closest('#tools'))closePops();});
  function fit(){
    var open=body.classList.contains('notes-open');
    var vw=window.innerWidth,vh=window.innerHeight;
    if(open){vw-=panelW()+GUT+PAD*2;vh-=RIB+TOOLH+PAD*2;}
    stage.style.setProperty('--scale',Math.min(vw/W,vh/H));
    viewport.style.left=open?GUT+'px':'0';
    viewport.style.right=open?panelW()+'px':'0';
    viewport.style.bottom=open?(RIB+TOOLH)+'px':'0';
    fitThumbs();fitTools();
  }

  /* ---- index thumbnails ---- */
  function buildThumbs(){
    thumbs.innerHTML='';
    for(var i=1;i<N;i++){(function(i){
      var b=document.createElement('button');b.className='thumb';b.type='button';b.setAttribute('data-go',i);
      b.setAttribute('aria-label','Go to slide '+i+': '+titleOf(i));
      var f=likeStage(document.createElement('div'));f.className='frame';f.appendChild(cloneSlide(i));
      var c=document.createElement('div');c.className='cap';c.innerHTML=cap(i);
      b.appendChild(f);b.appendChild(c);
      b.addEventListener('click',function(e){e.stopPropagation();go(i);});
      thumbs.appendChild(b);
    })(i);}
  }
  function fitThumbs(){
    var frames=thumbs.querySelectorAll('.frame');if(!frames.length)return;
    var s=(frames[0].clientWidth||1)/W;
    frames.forEach(function(f){var c=f.firstElementChild;if(c)c.style.transform='scale('+s+')';});
  }

  /* ---- presenter ribbon ---- */
  function buildRibbon(){
    ribbon.innerHTML='';
    slides.forEach(function(sl,i){
      var b=document.createElement('button');b.className='rthumb';b.type='button';b.setAttribute('data-go',i);
      b.setAttribute('aria-label','Go to slide '+i+': '+titleOf(i));
      var f=likeStage(document.createElement('div'));f.className='rf';
      f.style.height=Math.round(200*H/W*100)/100+'px';
      if(i===0){f.innerHTML='<div class="idx">Index</div>';}else{var cl=cloneSlide(i);cl.style.transform='scale('+(200/W)+')';f.appendChild(cl);}
      var c=document.createElement('div');c.className='rc';c.textContent=String(i).padStart(2,'0');
      var tip=document.createElement('div');tip.className='tip';tip.textContent=titleOf(i)+(sl.hasAttribute('data-start')?' · '+sl.getAttribute('data-start')+'–'+sl.getAttribute('data-end')+' min':'');
      b.appendChild(tip);b.appendChild(f);b.appendChild(c);
      b.addEventListener('click',function(e){e.stopPropagation();go(i);});
      ribbon.appendChild(b);
    });
  }
  function markRibbon(instant){
    var el=null;ribbon.querySelectorAll('.rthumb').forEach(function(t){var on=+t.getAttribute('data-go')===cur;t.classList.toggle('current',on);if(on)el=t;});
    if(el&&body.classList.contains('notes-open')){var left=Math.max(0,el.offsetLeft-(ribbon.clientWidth-el.offsetWidth)/2);if(instant===true){ribbon.scrollLeft=left;}else{try{ribbon.scrollTo({left:left,behavior:'smooth'});}catch(e){ribbon.scrollLeft=left;}}}
  }

  /* ---- next-slide preview ---- */
  function renderNext(){
    nextframe.innerHTML='';
    var ni=(cur+1)%N;
    if(ni===0){nextframe.innerHTML='<div class="idx">Index · deck loops</div>';return;}
    var c=cloneSlide(ni);nextframe.appendChild(c);c.style.transform='scale('+((nextframe.clientWidth||1)/W)+')';
  }

  /* ---- navigation ---- */
  function go(i,push){
    i=((i%N)+N)%N;
    if(i===cur)return;
    if(cur>=0)slides[cur].classList.remove('is-active');
    cur=i;slides[cur].classList.add('is-active');
    var n=slides[cur].querySelector('.notes');
    notesBody.innerHTML=n?n.innerHTML:'<p class="mute">No notes.</p>';
    notesTitle.textContent=cur===0?'Index':String(cur).padStart(2,'0')+' · '+titleOf(cur);
    countEl.textContent=cur+' / '+last;
    progress.style.width=(cur===0?0:(cur/last)*100)+'%';
    thumbs.querySelectorAll('.thumb').forEach(function(t){t.classList.toggle('current',+t.getAttribute('data-go')===cur);});
    /* a sandboxed preview pane (chat canvas, srcdoc iframe) refuses replaceState; losing the hash must not stop the rest of go() */
    if(push!==false){var h='#/'+cur;if(location.hash!==h){try{history.replaceState(null,'',h);}catch(e){}}}
    if(cur===0)fitThumbs();
    document.title=(cur===0?'Index':String(cur).padStart(2,'0')+' '+titleOf(cur))+' · '+DECK_TITLE;
    renderNext();markRibbon();renderClock();armInk();
    hover=null;laser=null;remoteSel=null;drawInk();renderLens();fxDirty=true;
    try{var s0=window.getSelection();if(s0&&!s0.isCollapsed)s0.removeAllRanges();}catch(e){}
    broadcast();
  }
  function next(){go(cur+1);}
  function prev(){go(cur-1);}
  function fromHash(){var m=/^#\/(\d+)$/.exec(location.hash);go(m?+m[1]:0,false);}

  /* ---- sync between two windows on one machine ---- */
  var holding=false,fromPeer=false,chan=null;
  try{chan=new BroadcastChannel(CHANNEL);}catch(e){}
  function setHold(h){holding=!!h;stage.classList.toggle('holding',holding);}
  function send(msg){if(chan){try{chan.postMessage(msg);}catch(e){}}}
  function broadcast(){
    if(fromPeer)return;
    var msg={i:cur,hold:holding,t:Date.now()};
    send(msg);
    try{localStorage.setItem(CHANNEL+':state',JSON.stringify(msg));}catch(e){}
  }
  function inStep(){document.getElementById('syncState').textContent='in step';}
  function applyPeer(msg){
    if(!msg||typeof msg.i!=='number')return;
    fromPeer=true;go(msg.i);setHold(msg.hold);fromPeer=false;
    inStep();
  }
  if(chan){chan.onmessage=function(e){
    var d=e.data;if(!d)return;
    if(d.hello){if(body.classList.contains('notes-open')){send({inkAll:inkStore});broadcast();ckSave();inStep();}else{send({here:1});}return;}
    if(d.here){inStep();return;}
    if(d.inkAll){inkStore=d.inkAll||{};drawInk();renderLens();return;}
    if(d.clock){ck=d.clock;renderClock();return;}
    if(d.ink){inkStore[d.ink.i]=d.ink.st;if(d.ink.i===cur){drawInk();renderLens();}return;}
    if(d.hover!==undefined){remoteHover=d.hover;if(remoteHover&&remoteHover.i!==cur)remoteHover=null;fxDirty=true;renderLens();return;}
    if(d.sel!==undefined){remoteSel=(d.sel&&d.sel.i===cur)?d.sel.rects:null;fxDirty=true;return;}
    applyPeer(d);
  };}
  window.addEventListener('storage',function(e){
    if(e.key===CHANNEL+':state'){try{applyPeer(JSON.parse(e.newValue));}catch(err){}}
    if(e.key===CHANNEL+':clock'){try{ck=JSON.parse(e.newValue)||ck;renderClock();}catch(err){}}
  });

  /* ---- session clock ---- */
  var ck={running:false,startAt:0,base:0};
  var elapsedEl=document.getElementById('elapsed'),paceEl=document.getElementById('pace'),ckToggle=document.getElementById('ckToggle'),ckSetIn=document.getElementById('ckSet');
  function ckElapsed(){return ck.base+(ck.running?Date.now()-ck.startAt:0);}
  function mmss(ms){ms=Math.max(0,Math.round(ms/1000));var m=Math.floor(ms/60),s=ms%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}
  function ckSave(){try{localStorage.setItem(CHANNEL+':clock',JSON.stringify(ck));}catch(e){}send({clock:ck});}
  function ckLoad(){try{var v=JSON.parse(localStorage.getItem(CHANNEL+':clock'));if(v&&typeof v.base==='number')ck=v;}catch(e){}}
  function ckStartPause(){if(ck.running){ck.base=ckElapsed();ck.running=false;}else{ck.startAt=Date.now();ck.running=true;}ckSave();renderClock();}
  function ckReset(){ck={running:false,startAt:0,base:0};ckSave();renderClock();}
  function ckSetTo(ms){ck.base=Math.max(0,ms);if(ck.running)ck.startAt=Date.now();ckSave();renderClock();}
  function parseClock(v){v=String(v||'').trim();if(!v)return null;var m=/^(\d{1,3})(?::(\d{1,2}))?$/.exec(v);if(!m)return null;return ((+m[1])*60+(+(m[2]||0)))*1000;}
  function ckApplyInput(){var ms=parseClock(ckSetIn.value);if(ms!==null)ckSetTo(ms);ckSetIn.value='';ckSetIn.blur();}
  function renderClock(){
    if(cur<0)return;
    var e=ckElapsed();elapsedEl.textContent=mmss(e);
    ckToggle.innerHTML=ck.running?'<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="2" width="4" height="12" fill="currentColor"/><rect x="9" y="2" width="4" height="12" fill="currentColor"/></svg>':'<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 2l11 6-11 6z" fill="currentColor"/></svg>';ckToggle.classList.toggle('primary',!ck.running);
    var sl=slides[cur],hasWin=sl.hasAttribute('data-start');
    var sp=document.getElementById('statusPace');
    if(!hasWin){paceEl.className='idle';paceEl.innerHTML='<b>No window</b>The index has no scheduled time.<span class="win"></span>';sp.className='st idle';sp.textContent=cur===0?'index':'no window';return;}
    var a=+sl.getAttribute('data-start')*60000,b=+sl.getAttribute('data-end')*60000;
    var win='<span class="win">Slide '+String(cur).padStart(2,'0')+' is scheduled '+mmss(a)+' to '+mmss(b)+'</span>';
    if(!ck.running&&e===0){paceEl.className='idle';paceEl.innerHTML='<b>Clock not started</b>Press T or Start when the session begins.'+win;sp.className='st idle';sp.textContent='not started';return;}
    if(e<a){sp.className='st ahead';sp.textContent='ahead '+mmss(a-e);paceEl.className='ahead';paceEl.innerHTML='<b>Ahead by '+mmss(a-e)+'</b>You reached this slide early. Slow down, take the question.'+win;}
    else if(e>b){sp.className='st behind';sp.textContent='behind '+mmss(e-b);paceEl.className='behind';paceEl.innerHTML='<b>Behind by '+mmss(e-b)+"</b>Past this slide's window. Pick up the pace or use the cut list."+win;}
    else{sp.className='st on';sp.textContent='on time';paceEl.className='on';paceEl.innerHTML='<b>On time</b>'+mmss(b-e)+" left in this slide's window."+win;}
  }
  (function(){var of=document.querySelector('#clock .of');if(of)of.textContent='of '+mmss(TOTAL);})();
  ckToggle.addEventListener('click',ckStartPause);
  document.getElementById('ckReset').addEventListener('click',ckReset);
  document.getElementById('ckSetBtn').addEventListener('click',ckApplyInput);
  ckSetIn.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();ckApplyInput();}if(e.key==='Escape'){ckSetIn.value='';ckSetIn.blur();}e.stopPropagation();});
  document.getElementById('ckSlide').addEventListener('click',function(){var sl=slides[cur];if(sl.hasAttribute('data-start'))ckSetTo(+sl.getAttribute('data-start')*60000);});
  setInterval(renderClock,500);

  /* ---- ink: pen, highlighter, laser, circle, magnifier. Per slide, session only. ---- */
  var ictx=ink.getContext('2d'),fctx=fx.getContext('2d');
  var tool='none',color='#FFCD0A',size=1;
  var inkStore={};            // slide index -> {strokes:[{tool,color,w,pts}], circle:{x,y,r,color}|null, mag:{x,y,color}|null}
  var stroke=null,ell=null,hover=null,remoteHover=null,remoteSel=null,laser=null,fxDirty=false,inkSendQueued=false,lensFor=-1,downPt=null;
  function slot(i){return inkStore[i]||(inkStore[i]={strokes:[],circle:null,mag:null});}
  var PEN_W=[3,6,10,16],HI_W=[22,32,44,60],lensD=320;
  function setMag(d){lensD=+d;closePops();document.querySelectorAll('#magPop [data-mag]').forEach(function(b){b.classList.toggle('on',+b.getAttribute('data-mag')===lensD);});var st=inkStore[cur];if(st&&st.mag){st.mag.d=lensD;sendInk();}if(hover&&hover.tool==='mag')hover.d=lensD;renderLens();sendHover();}
  document.querySelectorAll('#magPop [data-mag]').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();setMag(b.getAttribute('data-mag'));});});
  function widthFor(t){return t==='hi'?HI_W[size]:PEN_W[size];}
  /* ink never draws on the index, so the canvas must not take the pointer there: an armed tool would swallow clicks on the thumbnails */
  function armInk(){var on=cur>0&&tool!=='pointer'&&tool!=='none';stage.classList.toggle('tool-on',on);stage.classList.toggle('tool-laser',on&&tool==='laser');body.classList.toggle('pk-index',cur===0);}
  function setTool(t){
    if(t===tool)t='none';
    tool=t;
    armInk();
    document.querySelectorAll('#tools [data-tool]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-tool')===t);});
    hover=null;laser=null;fxDirty=true;renderLens();send({hover:null});
  }
  function setColor(c){color=c;swatchBtn.style.background=c;closePops();document.querySelectorAll('#tools [data-color]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-color')===c);});if(hover){hover.color=c;fxDirty=true;renderLens();sendHover();}}
  var W_ICON=[2,4,7,11];
  function setSize(s){size=+s;closePops();document.querySelectorAll('#tools [data-size]').forEach(function(b){b.classList.toggle('on',+b.getAttribute('data-size')===size);});var ln=widthBtn.querySelector('line');if(ln)ln.setAttribute('stroke-width',W_ICON[size]);}
  function clearSlide(){inkStore[cur]={strokes:[],circle:null,mag:null};drawInk();renderLens();sendInk();}
  function pt(e){var r=stage.getBoundingClientRect();return [Math.round((e.clientX-r.left)/r.width*W),Math.round((e.clientY-r.top)/r.height*H)];}
  function drawStrokeOn(ctx,s){
    var p=s.pts;if(!p.length)return;
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=s.color;ctx.lineWidth=s.w;ctx.globalAlpha=s.tool==='hi'?0.38:1;
    ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);if(p.length===1)ctx.lineTo(p[0][0]+0.01,p[0][1]);
    for(var k=1;k<p.length;k++)ctx.lineTo(p[k][0],p[k][1]);ctx.stroke();ctx.restore();
  }
  function drawEllipseOn(ctx,e,alpha){if(e.rx<2&&e.ry<2)return;ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=e.color;ctx.lineWidth=e.w||8;ctx.beginPath();ctx.ellipse(e.x,e.y,Math.max(1,e.rx),Math.max(1,e.ry),0,0,Math.PI*2);ctx.stroke();ctx.restore();}
  function ellipseFrom(a,b,circle){var rx=Math.abs(b[0]-a[0])/2,ry=Math.abs(b[1]-a[1])/2;if(circle){rx=ry=Math.max(rx,ry);}return {x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,rx:rx,ry:ry};}
  function drawInk(){
    ictx.clearRect(0,0,W,H);var st=inkStore[cur];if(!st)return;
    st.strokes.forEach(function(s){if(s.tool==='ellipse')drawEllipseOn(ictx,s,1);else drawStrokeOn(ictx,s);});
  }
  function drawFx(){
    fctx.clearRect(0,0,W,H);
    var hv=hover||remoteHover;
    if(hv&&hv.tool==='ellipse')drawEllipseOn(fctx,hv,0.8);
    if(remoteSel&&remoteSel.length){fctx.save();fctx.fillStyle='rgba(255,205,10,.45)';remoteSel.forEach(function(r){fctx.fillRect(r[0],r[1],r[2],r[3]);});fctx.restore();}
    if(remoteHover&&remoteHover.tool==='cursor'){var cx=remoteHover.x,cy=remoteHover.y,k=1.7;fctx.save();fctx.translate(cx,cy);fctx.scale(k,k);fctx.beginPath();fctx.moveTo(0,0);fctx.lineTo(0,21);fctx.lineTo(5.5,16);fctx.lineTo(9.5,25);fctx.lineTo(13,23.5);fctx.lineTo(9,14.5);fctx.lineTo(16,14.5);fctx.closePath();fctx.fillStyle='#fff';fctx.strokeStyle='#17160F';fctx.lineWidth=1.6;fctx.lineJoin='round';fctx.shadowColor='rgba(0,0,0,.35)';fctx.shadowBlur=4;fctx.shadowOffsetY=2;fctx.fill();fctx.shadowColor='transparent';fctx.stroke();fctx.restore();}
    var lz=laser||(remoteHover&&remoteHover.tool==='laser'?remoteHover:null);
    if(lz){var age=Date.now()-lz.t;if(age<900){var a=1-age/900;fctx.save();fctx.globalAlpha=a*0.35;fctx.fillStyle=lz.color;fctx.beginPath();fctx.arc(lz.x,lz.y,26,0,Math.PI*2);fctx.fill();fctx.globalAlpha=a;fctx.beginPath();fctx.arc(lz.x,lz.y,11,0,Math.PI*2);fctx.fill();fctx.restore();fxDirty=true;}}
  }
  (function loop(){if(fxDirty){fxDirty=false;drawFx();}requestAnimationFrame(loop);})();
  function renderLens(){
    var st=inkStore[cur]||{};
    var hv=(hover&&hover.tool==='mag')?hover:(remoteHover&&remoteHover.tool==='mag'?remoteHover:null);
    var m=hv||st.mag;
    if(!m||cur===0){lens.style.display='none';return;}
    if(lensFor!==cur){lens.innerHTML='';lens.appendChild(cloneSlide(cur));lensFor=cur;}
    var d=m.d||lensD,k=1.9,r=d/2,inner=lens.firstElementChild;
    lens.style.width=d+'px';lens.style.height=d+'px';
    lens.style.display='block';lens.style.borderColor=(hv?color:(m.color||color));
    lens.style.left=(m.x-r)+'px';lens.style.top=(m.y-r)+'px';
    if(inner)inner.style.transform='translate('+(r-m.x*k)+'px,'+(r-m.y*k)+'px) scale('+k+')';
  }
  function sendInk(){if(inkSendQueued)return;inkSendQueued=true;setTimeout(function(){inkSendQueued=false;send({ink:{i:cur,st:slot(cur)}});},16);}
  var hoverQueued=false;
  function sendHover(){if(hoverQueued)return;hoverQueued=true;setTimeout(function(){hoverQueued=false;send({hover:hover?Object.assign({i:cur},hover):null});},16);}
  window.__deck=function(){return {version:VERSION,slides:last,cur:cur,tool:tool,strokes:(inkStore[cur]||{strokes:[]}).strokes.length,ellipses:(inkStore[cur]||{strokes:[]}).strokes.filter(function(x){return x.tool==='ellipse';}).length,mag:!!(inkStore[cur]&&inkStore[cur].mag),presenter:body.classList.contains('notes-open'),remoteHover:remoteHover&&remoteHover.tool,remoteSel:remoteSel?remoteSel.length:0};};
  ink.addEventListener('pointerdown',function(e){
    if(tool==='pointer'||tool==='none'||cur===0)return;
    e.preventDefault();e.stopPropagation();var p=pt(e);
    if(tool==='pen'||tool==='hi'){stroke={tool:tool,color:color,w:widthFor(tool),pts:[p]};slot(cur).strokes.push(stroke);try{ink.setPointerCapture(e.pointerId);}catch(err){}drawInk();sendInk();}
    else if(tool==='circle'){ell={start:p,circle:e.shiftKey};hover=null;fxDirty=true;try{ink.setPointerCapture(e.pointerId);}catch(err){}}
    else if(tool==='mag'){slot(cur).mag={x:p[0],y:p[1],color:color,d:lensD};hover=null;renderLens();sendInk();sendHover();}
    else if(tool==='laser'){laser={x:p[0],y:p[1],t:Date.now(),color:color};fxDirty=true;}
  });
  ink.addEventListener('pointermove',function(e){
    if(tool==='pointer'||tool==='none'||cur===0)return;
    var p=pt(e);
    if(stroke){var evs=e.getCoalescedEvents?e.getCoalescedEvents():[e];evs.forEach(function(ce){stroke.pts.push(pt(ce));});drawInk();sendInk();return;}
    if(tool==='laser'){laser={x:p[0],y:p[1],t:Date.now(),color:color};hover={tool:'laser',x:p[0],y:p[1],t:laser.t,color:color};fxDirty=true;sendHover();}
    else if(tool==='circle'){if(ell){var g=ellipseFrom(ell.start,p,e.shiftKey||ell.circle);hover={tool:'ellipse',x:g.x,y:g.y,rx:g.rx,ry:g.ry,color:color,w:widthFor('pen')};fxDirty=true;sendHover();}}
    else if(tool==='mag'){if(slot(cur).mag)return;hover={tool:'mag',x:p[0],y:p[1],color:color,d:lensD};renderLens();sendHover();}
  });
  function endStroke(e){
    if(stroke){stroke=null;sendInk();}
    if(ell){var g=ellipseFrom(ell.start,pt(e),e.shiftKey||ell.circle);ell=null;hover=null;fxDirty=true;if(g.rx>3||g.ry>3){slot(cur).strokes.push({tool:'ellipse',color:color,w:widthFor('pen'),x:g.x,y:g.y,rx:g.rx,ry:g.ry});drawInk();}sendInk();sendHover();}
  }
  ink.addEventListener('pointerup',endStroke);ink.addEventListener('pointercancel',endStroke);
  ink.addEventListener('pointerleave',function(){if(stroke||ell)return;hover=null;fxDirty=true;renderLens();sendHover();});
  ink.addEventListener('click',function(e){if(tool!=='pointer'&&tool!=='none')e.stopPropagation();});
  document.querySelectorAll('#tools [data-tool]').forEach(function(b){b.addEventListener('click',function(){setTool(b.getAttribute('data-tool'));});});
  document.querySelectorAll('#tools [data-color]').forEach(function(b){b.addEventListener('click',function(){setColor(b.getAttribute('data-color'));});});
  document.querySelectorAll('#tools [data-size]').forEach(function(b){b.addEventListener('click',function(){setSize(b.getAttribute('data-size'));});});
  document.querySelector('#tools [data-action="clear"]').addEventListener('click',clearSlide);

  /* ---- pointer mode: cursor and text selection mirrored to the shared window ---- */
  function presenterMode(){return body.classList.contains('notes-open');}
  stage.addEventListener('pointermove',function(e){if(tool!=='pointer'||!presenterMode()||cur===0)return;var p=pt(e);if(p[0]<0||p[1]<0||p[0]>W||p[1]>H){if(hover){hover=null;sendHover();}return;}hover={tool:'cursor',x:p[0],y:p[1]};sendHover();});
  stage.addEventListener('pointerleave',function(){if(tool!=='pointer')return;if(hover){hover=null;sendHover();}});
  nextframe.style.cursor='pointer';nextframe.title='Click to advance';nextframe.addEventListener('click',function(e){e.stopPropagation();next();});
  stage.addEventListener('pointerdown',function(e){downPt=[e.clientX,e.clientY];});
  var selQueued=false;
  function sendSel(){
    if(selQueued)return;selQueued=true;
    setTimeout(function(){
      selQueued=false;if(!presenterMode()||tool!=='pointer')return;
      var rects=[],sel=window.getSelection();
      if(sel&&!sel.isCollapsed&&sel.rangeCount){var st=stage.getBoundingClientRect(),list=sel.getRangeAt(0).getClientRects();
        for(var k=0;k<list.length;k++){var r=list[k];if(r.width<1||r.height<1)continue;var x=(r.left-st.left)/st.width*W,y=(r.top-st.top)/st.height*H,w=r.width/st.width*W,h=r.height/st.height*H;if(x+w<0||y+h<0||x>W||y>H)continue;rects.push([Math.round(x),Math.round(y),Math.round(w),Math.round(h)]);}}
      send({sel:rects.length?{i:cur,rects:rects}:null});
    },40);
  }
  document.addEventListener('selectionchange',sendSel);
  /* ---- keys ---- */
  var COLORS=['#FFCD0A','#F28C28','#C8351D','#E0479E','#7B3FBF','#0E1F66','#1FA7C9','#2E9E5B','#17160F','#FFFFFF'];
  document.addEventListener('keydown',function(e){
    if(e.metaKey||e.ctrlKey||e.altKey)return;
    if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;
    var k=e.key,presenter=body.classList.contains('notes-open');
    if(k==='ArrowRight'||k===' '||k==='PageDown'||k==='Enter'||k==='ArrowDown'){e.preventDefault();next();}
    else if(k==='ArrowLeft'||k==='PageUp'||k==='Backspace'||k==='ArrowUp'){e.preventDefault();prev();}
    else if(k==='Home'){e.preventDefault();go(1);}
    else if(k==='End'){e.preventDefault();go(last);}
    else if(k==='g'||k==='G'){e.preventDefault();go(0);}
    else if(k==='Escape'){e.preventDefault();if(tool!=='none')setTool('none');else go(0);}
    else if(k==='n'||k==='N'){e.preventDefault();toggleNotes();}
    else if(k==='f'||k==='F'){e.preventDefault();toggleFS();}
    else if(k==='b'||k==='B'||k==='.'){e.preventDefault();setHold(!holding);broadcast();}
    else if(k==='t'||k==='T'){e.preventDefault();ckStartPause();}
    else if(k==='R'&&e.shiftKey){e.preventDefault();ckReset();}
    else if(presenter){
      if(k==='v'||k==='V')setTool('pointer');
      else if(k==='p'||k==='P')setTool('pen');
      else if(k==='h'||k==='H')setTool('hi');
      else if(k==='l'||k==='L')setTool('laser');
      else if(k==='o'||k==='O')setTool('circle');
      else if(k==='m'||k==='M')setTool('mag');
      else if(k==='c'||k==='C')clearSlide();
      else if(k>='1'&&k<='9')setColor(COLORS[+k-1]);
      else if(k==='0')setColor(COLORS[9]);
      else if(k==='[')setSize(Math.max(0,size-1));
      else if(k===']')setSize(Math.min(3,size+1));
    }
  });
  function toggleNotes(){body.classList.toggle('notes-open');fit();renderNext();markRibbon();}
  /* the corner button: a second window on the same slide, so this one stays clean for sharing.
     Where a new window is refused (popup blocked, sandboxed preview) the panel opens in this window instead. */
  function openPresenter(){
    var w=null;
    if(/^(https?|file):$/.test(location.protocol)){
      var u=location.href.split('#')[0];if(!/[?&]presenter/.test(u))u+=(u.indexOf('?')<0?'?':'&')+'presenter';
      try{w=window.open(u+'#/'+cur,'deck-presenter','width=1500,height=900');}catch(e){}
    }
    if(!w)toggleNotes();
  }
  function toggleFS(){if(!document.fullscreenElement){(document.documentElement.requestFullscreen||function(){}).call(document.documentElement);}else if(document.exitFullscreen){document.exitFullscreen();}}

  /* ---- mouse, touch, hud ---- */
  stage.addEventListener('click',function(e){
    if(cur===0||(tool!=='pointer'&&tool!=='none'))return;
    if(e.target.closest('button,a'))return;
    if(downPt&&Math.hypot(e.clientX-downPt[0],e.clientY-downPt[1])>6)return;
    var sel=window.getSelection();if(sel&&!sel.isCollapsed)return;
    if(e.clientX/window.innerWidth<0.2)prev();else next();
  });
  document.getElementById('btnPrev').addEventListener('click',prev);
  document.getElementById('btnNext').addEventListener('click',next);
  document.getElementById('btnGrid').addEventListener('click',function(){go(0);});
  document.getElementById('btnNotes').addEventListener('click',toggleNotes);
  document.getElementById('pk-present').addEventListener('click',function(e){e.stopPropagation();this.blur();openPresenter();});
  var hudT;document.addEventListener('mousemove',function(){body.classList.add('show-hud');clearTimeout(hudT);hudT=setTimeout(function(){body.classList.remove('show-hud');},2200);});
  var tx=null;
  document.addEventListener('touchstart',function(e){tx=(tool==='pointer'||tool==='none')?e.touches[0].clientX:null;},{passive:true});
  document.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50){dx<0?next():prev();}tx=null;},{passive:true});
  document.getElementById('ribCenter').addEventListener('click',function(){markRibbon(true);});
  document.getElementById('ribFirst').addEventListener('click',function(){ribbon.scrollLeft=0;});
  document.getElementById('ribLast').addEventListener('click',function(){ribbon.scrollLeft=ribbon.scrollWidth;});
  document.getElementById('ribL').addEventListener('click',function(){ribbon.scrollLeft-=ribbon.clientWidth*0.7;});
  document.getElementById('ribR').addEventListener('click',function(){ribbon.scrollLeft+=ribbon.clientWidth*0.7;});
  document.getElementById('ckMore').addEventListener('click',function(){document.getElementById('clock').classList.toggle('open');});
  document.getElementById('keysToggle').addEventListener('click',function(){var k=document.getElementById('keys');k.classList.toggle('open');this.textContent=k.classList.contains('open')?'Collapse':'All keys';});
  ribbon.addEventListener('wheel',function(e){if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){ribbon.scrollLeft+=e.deltaY;e.preventDefault();}},{passive:false});
  window.addEventListener('resize',function(){fit();renderNext();});
  window.addEventListener('hashchange',fromHash);
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){fitThumbs();renderNext();markRibbon(true);});}

  /* ---- boot ---- */
  likeStage(nextframe);likeStage(lens);
  buildThumbs();buildRibbon();
  if(/[?&]presenter/.test(location.search))body.classList.add('notes-open');
  ckLoad();
  fromHash();fit();renderNext();renderClock();
  markRibbon(true);setTimeout(function(){markRibbon(true);},400);
  send({hello:1});
})();
