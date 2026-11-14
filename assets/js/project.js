/* PAGES PROJET — interactions */
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fine=matchMedia('(pointer: fine)').matches;

/* ---------- plein écran (lightbox) ---------- */
const lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Image en plein écran');
lb.innerHTML='<button class="lb-close" aria-label="Fermer">Fermer ✕</button><button class="lb-prev" aria-label="Image précédente">←</button><img class="lb-img" alt=""><button class="lb-next" aria-label="Image suivante">→</button><div class="lb-bar"><span class="lb-cap"></span><span class="lb-n"></span></div>';
document.body.appendChild(lb);
const lbImg=$('.lb-img',lb);let set=[],cur=0,last=null;
function lbShow(i){cur=(i+set.length)%set.length;const it=set[cur];lb.classList.remove('zoom');lbImg.style.transform='';lbImg.src=it.src;lbImg.alt=it.alt||'';$('.lb-cap',lb).textContent=it.cap||it.alt||'';$('.lb-n',lb).textContent=set.length>1?`${String(cur+1).padStart(2,'0')} / ${String(set.length).padStart(2,'0')} · clic pour zoomer`:'clic pour zoomer';
  $('.lb-prev',lb).hidden=$('.lb-next',lb).hidden=set.length<2}
function openLb(items,i){set=items;last=document.activeElement;lbShow(i);lb.classList.add('open');document.body.style.overflow='hidden';$('.lb-close',lb).focus()}
function closeLb(){lb.classList.remove('open');document.body.style.overflow='';last&&last.focus()}
$('.lb-close',lb).onclick=closeLb;$('.lb-prev',lb).onclick=()=>lbShow(cur-1);$('.lb-next',lb).onclick=()=>lbShow(cur+1);
lb.addEventListener('click',e=>{if(e.target===lb)closeLb()});
lbImg.addEventListener('click',e=>{const z=lb.classList.toggle('zoom');if(z)pan(e);else lbImg.style.transform=''});
function pan(e){const r=lbImg.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;lbImg.style.transform=`scale(2.4) translate(${-x*58}%,${-y*58}%)`}
lbImg.addEventListener('mousemove',e=>{if(lb.classList.contains('zoom'))pan(e)});
window.openLb=openLb;

/* ---------- loupe ---------- */
function lens(img,host){if(!fine)return;const L=document.createElement('span');L.className='lens';L.setAttribute('aria-hidden','true');host.appendChild(L);const Z=2.6;
  img.addEventListener('pointerenter',()=>L.classList.add('on'));img.addEventListener('pointerleave',()=>L.classList.remove('on'));
  img.addEventListener('pointermove',e=>{const r=img.getBoundingClientRect(),h=host.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;
    L.style.left=(e.clientX-h.left-90)+'px';L.style.top=(e.clientY-h.top-90)+'px';
    L.style.backgroundImage=`url("${img.currentSrc||img.src}")`;L.style.backgroundSize=`${r.width*Z}px ${r.height*Z}px`;L.style.backgroundPosition=`${-(x*Z-90)}px ${-(y*Z-90)}px`});}
$$('[data-lens]').forEach(img=>lens(img,img.closest('.in')||img.parentElement));
$$('[data-lb]').forEach(img=>img.addEventListener('click',()=>openLb([{src:img.dataset.full||img.src,alt:img.alt,cap:img.dataset.cap}],0)));

/* ---------- visionneuse / galerie ---------- */
$$('[data-viewer]').forEach(v=>{
  const main=$('.v-main img',v),thumbs=$$('.v-thumbs button',v),cap=$('.v-cap',v),cnt=$('.v-count',v);
  const items=thumbs.map(b=>({src:b.dataset.src,alt:$('img',b).alt,cap:b.dataset.cap}));let i=0;
  function go(n){i=(n+items.length)%items.length;thumbs.forEach((b,k)=>{b.classList.toggle('on',k===i);b.setAttribute('aria-pressed',k===i)});
    main.classList.add('swap');setTimeout(()=>{main.src=items[i].src;main.alt=items[i].alt;main.onload=()=>main.classList.remove('swap');if(main.complete)main.classList.remove('swap')},180);
    cap&&(cap.textContent=items[i].cap||'');cnt&&(cnt.textContent=`${String(i+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`);
    thumbs[i].scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'})}
  thumbs.forEach((b,k)=>b.addEventListener('click',()=>go(k)));
  $('.v-prev',v)?.addEventListener('click',()=>go(i-1));$('.v-next',v)?.addEventListener('click',()=>go(i+1));
  $('.v-full',v)?.addEventListener('click',()=>openLb(items,i));main.addEventListener('click',()=>openLb(items,i));
  lens(main,main.closest('.in'));
  let sx=null;main.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});main.addEventListener('touchend',e=>{if(sx==null)return;const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40)go(d<0?i+1:i-1);sx=null});
  v.tabIndex=0;v.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.stopPropagation();go(i+1)}if(e.key==='ArrowLeft'){e.stopPropagation();go(i-1)}});
  go(0);
});

/* ---------- points clés en accordéon ---------- */
$$('.p-points li').forEach((li,k)=>{const b=$('button',li);b.setAttribute('aria-expanded','false');if(k===0){li.classList.add('open');b.setAttribute('aria-expanded','true')}
  b.addEventListener('click',()=>{const o=li.classList.toggle('open');b.setAttribute('aria-expanded',o)})});

/* ---------- écran qui défile (projets UI) ---------- */
$$('.browser').forEach(br=>{const sc=$('.b-screen',br),pr=$('.b-prog',br),btn=$('.b-auto',br);let auto=false,raf;
  const upd=()=>pr.style.setProperty('--p',sc.scrollTop/Math.max(1,sc.scrollHeight-sc.clientHeight));sc.addEventListener('scroll',upd,{passive:true});
  function loop(){if(!auto)return;sc.scrollTop+=1.6;if(sc.scrollTop>=sc.scrollHeight-sc.clientHeight-1)sc.scrollTop=0;raf=requestAnimationFrame(loop)}
  btn?.addEventListener('click',()=>{auto=!auto;btn.classList.toggle('on',auto);btn.textContent=auto?'❚❚ Pause':'▶ Défilement auto';if(auto)loop();else cancelAnimationFrame(raf)});
  let dy=null,st=0;sc.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;dy=e.clientY;st=sc.scrollTop;sc.classList.add('drag')});
  addEventListener('pointermove',e=>{if(dy!=null)sc.scrollTop=st-(e.clientY-dy)*1.5});addEventListener('pointerup',()=>{dy=null;sc.classList.remove('drag')});
  sc.addEventListener('wheel',()=>{if(auto)btn.click()},{passive:true});
});

/* ---------- Malt Sauvage : choix de la bière ---------- */
$$('[data-beer]').forEach(bx=>{const btns=$$('.beer-pick button',bx),bot=$('.beer-bottle',bx),lab=$('.beer-label',bx),txt=$('.beer-txt',bx);
  btns.forEach(b=>{const i=new Image();i.src=b.dataset.bottle;const j=new Image();j.src=b.dataset.label});
  function pick(b){if(b.classList.contains('on'))return;btns.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});bx.classList.add('swap');
    document.body.style.setProperty('--acc',b.dataset.c);
    setTimeout(()=>{bot.src=b.dataset.bottle;bot.alt=b.dataset.alt;lab.src=b.dataset.label;lab.alt='Étiquette '+b.dataset.name;txt.textContent=b.dataset.txt;bx.classList.remove('swap')},420)}
  btns.forEach(b=>b.addEventListener('click',()=>pick(b)));
  lab.addEventListener('click',()=>openLb(btns.map(b=>({src:b.dataset.label,alt:'Étiquette '+b.dataset.name,cap:'Étiquette '+b.dataset.name})),btns.findIndex(b=>b.classList.contains('on'))));
  const first=btns[0];first.classList.add('on');document.body.style.setProperty('--acc',first.dataset.c);txt.textContent=first.dataset.txt;
});

/* ---------- In the Dark : lampe torche ---------- */
$$('[data-torch]').forEach(blk=>{const t=$('.torch',blk),inn=$('.in',t),btn=$('.torch-ui button',t);
  const mv=e=>{const r=inn.getBoundingClientRect(),p=e.touches?e.touches[0]:e;inn.style.setProperty('--x',(p.clientX-r.left)+'px');inn.style.setProperty('--y',(p.clientY-r.top)+'px')};
  inn.addEventListener('pointermove',mv);inn.addEventListener('touchmove',mv,{passive:true});
  inn.addEventListener('pointerleave',()=>{inn.style.setProperty('--x','50%');inn.style.setProperty('--y','50%')});
  btn.addEventListener('click',()=>{const d=t.classList.toggle('dark');btn.textContent=d?'💡 Rallumer la lumière':'🔦 Éteindre la lumière';btn.setAttribute('aria-pressed',d)});
  $('img',inn).addEventListener('click',()=>{if(!t.classList.contains('dark'))openLb([{src:$('img',inn).src,alt:$('img',inn).alt,cap:'Mockup du dépliant In the Dark'}],0)});
});

/* ---------- recto / verso ---------- */
$$('[data-flip]').forEach(f=>{const card=$('.flip',f),btns=$$('.seg button',f),imgs=$$('.card img',f);
  btns.forEach((b,k)=>b.addEventListener('click',()=>{card.classList.toggle('turned',k===1);btns.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)})}));
  imgs.forEach((im,k)=>im.addEventListener('click',()=>openLb(imgs.map(x=>({src:x.src,alt:x.alt,cap:x.alt})),k)));
});

/* ---------- palette : copier la couleur ---------- */
const toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');document.body.appendChild(toast);let tt;
function say(m){toast.textContent=m;toast.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('on'),1600)}
$$('.palette button').forEach(b=>b.addEventListener('click',async()=>{const c=b.dataset.hex;try{await navigator.clipboard.writeText(c);say(c+' copié')}catch{say(c)}}));

/* ---------- navigation clavier entre projets ---------- */
addEventListener('keydown',e=>{
  if(lb.classList.contains('open')){if(e.key==='Escape')closeLb();if(e.key==='ArrowRight')lbShow(cur+1);if(e.key==='ArrowLeft')lbShow(cur-1);return}
  if(/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
  if(e.key==='ArrowRight'){const a=$('.p-next .nx');a&&a.click()}if(e.key==='ArrowLeft'){const a=$('.p-next .pv');a&&a.click()}
});
})();
