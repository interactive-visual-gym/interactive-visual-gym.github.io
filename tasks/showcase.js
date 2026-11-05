const $=s=>document.querySelector(s);
const video=$('#task-video'),sequence=$('#action-sequence'),panel=$('#showcase-panel');
const labels={cook:'CookSim',vh:'VHSim',screen:'ScreenSim'};
const library={cook:'Cooking tasks',vh:'Household tasks',screen:'Mobile-interface tasks'};
let tasks=[],engine='cook',current=null,active=-1,holdScrollUntil=0;
const time=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
const text=(tag,cls,content)=>{const el=document.createElement(tag);if(cls)el.className=cls;el.textContent=content;return el};
function showTask(id,{focus=false,history=true}={}){
 const task=tasks.find(t=>t.id===id);if(!task)return;
 video.pause();current=task;engine=task.engine;active=-1;
 const fill=$('#completion-fill');fill.style.transition='none';fill.style.width='0%';void fill.offsetWidth;fill.style.removeProperty('transition');
 const subset=tasks.filter(t=>t.engine===engine),i=subset.indexOf(task);
 panel.dataset.engine=engine;panel.setAttribute('aria-labelledby',`tab-${engine}`);
 document.querySelectorAll('[role=tab]').forEach(b=>{const chosen=b.dataset.engine===engine;b.setAttribute('aria-selected',chosen);b.tabIndex=chosen?0:-1});
 $('#task-position').textContent=`${labels[engine]} · Task ${String(i+1).padStart(2,'0')} / 10`;
 $('#task-title').textContent=task.title;$('#task-description').textContent=task.description;
 $('#video-start').hidden=false;video.poster=task.initialPoster||task.poster;video.src=task.video;video.load();
 $('#view-labels').replaceChildren(...(engine==='cook'?['Top-down','Egocentric']:engine==='vh'?[task.view]:[]).map(s=>text('span','',s)));
 $('#sequence-count').textContent=`${task.actions.length} actions`;
 sequence.replaceChildren(...task.actions.map((a,n)=>{
  const li=document.createElement('li'),b=document.createElement('button');b.type='button';
  b.append(text('span','step-num',n+1),text('span','step-text',a.text.charAt(0).toUpperCase()+a.text.slice(1)),text('span','step-time',time(a.start)));
  b.setAttribute('aria-label',`${a.text}, at ${time(a.start)}`);b.addEventListener('click',()=>{video.currentTime=a.start+.02;update();video.play().catch(()=>{})});li.append(b);return li;
 }));sequence.scrollTop=0;
 $('#library-title').textContent=library[engine];
 $('#task-grid').replaceChildren(...subset.map(t=>{
  const b=document.createElement('button');b.type='button';b.className='task-card';b.dataset.engine=engine;b.setAttribute('aria-pressed',t.id===task.id);
  const thumb=document.createElement('div');thumb.className='thumb';const img=new Image();img.src=t.poster;img.alt='';img.loading='lazy';thumb.append(img,text('span','task-duration',time(t.duration)));
  b.append(thumb,text('span','card-title',t.title));b.addEventListener('click',()=>showTask(t.id,{focus:true}));return b;
 }));
 if(history)window.history.replaceState(null,'',`#${task.id}`);
 update();if(focus) $('.task-heading').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
function update(){
 if(!current)return;const now=video.currentTime,steps=current.actions,done=steps.filter(a=>a.end<=now).length;
 let next=-1;for(let i=0;i<steps.length;i++)if(steps[i].start<=now&&steps[i].end>now)next=i;
 const allDone=done===steps.length;
 $('#completion-count').textContent=`${done} / ${steps.length} actions`;
 $('#completion-status').textContent=allDone?'Task completed':'Task progress';
 const percent=steps.length?100*done/steps.length:0;$('#completion-fill').style.width=`${percent}%`;$('.completion-track').setAttribute('aria-valuenow',Math.round(percent));$('.completion-track').setAttribute('aria-valuetext',`${done} of ${steps.length} actions completed`);
 [...sequence.children].forEach((li,i)=>{li.classList.toggle('is-complete',steps[i].end<=now);li.classList.toggle('is-active',i===next);li.querySelector('button').setAttribute('aria-current',i===next?'step':'false');li.querySelector('.step-num').textContent=steps[i].end<=now?'✓':i+1});
 if(next!==active){active=next;const li=sequence.children[next];if(li&&performance.now()>holdScrollUntil){const y=li.offsetTop-sequence.offsetTop;if(y<sequence.scrollTop||y+li.offsetHeight>sequence.scrollTop+sequence.clientHeight)sequence.scrollTo({top:Math.max(0,y-sequence.clientHeight*.3),behavior:'smooth'})}}
}
sequence.addEventListener('wheel',()=>holdScrollUntil=performance.now()+4000,{passive:true});sequence.addEventListener('touchstart',()=>holdScrollUntil=performance.now()+4000,{passive:true});
$('#video-start').addEventListener('click',()=>video.play().catch(()=>{}));
video.addEventListener('play',()=>$('#video-start').hidden=true);
video.addEventListener('ended',()=>$('#video-start').hidden=false);
for(const event of ['timeupdate','seeked','ended','loadedmetadata'])video.addEventListener(event,update);
for(const [selector,delta] of [['#previous-task',-1],['#next-task',1]])$(selector).addEventListener('click',()=>{const list=tasks.filter(t=>t.engine===engine),i=list.indexOf(current);showTask(list[(i+delta+list.length)%list.length].id)});
document.querySelectorAll('[role=tab]').forEach((b,i)=>{
 b.addEventListener('click',()=>showTask(tasks.find(t=>t.engine===b.dataset.engine)?.id));
 b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...document.querySelectorAll('[role=tab]')],n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[n].focus();tabs[n].click()});
});
window.addEventListener('hashchange',()=>showTask(location.hash.slice(1),{history:false}));
try{const r=await fetch('tasks.json');if(!r.ok)throw new Error(r.status);tasks=await r.json();const hash=location.hash.slice(1);showTask(tasks.some(t=>t.id===hash)?hash:tasks[0].id,{history:false});}catch(e){$('#load-error').hidden=false;panel.hidden=true;console.error('Task showcase:',e)}
