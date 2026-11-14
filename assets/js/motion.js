/* MOTION — animations partagées (index + pages projet) */
(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(pointer: fine)').matches;
const doc=document.documentElement;

/* transition entre pages */
const wipe=document.createElement('div');wipe.className='wipe';wipe.setAttribute('aria-hidden','true');document.body.appendChild(wipe);
requestAnimationFrame(()=>requestAnimationFrame(()=>wipe.classList.add('out')));
addEventListener('pageshow',e=>{if(e.persisted){wipe.classList.remove('go');wipe.classList.add('out')}});
document.addEventListener('click',e=>{
  const a=e.target.closest('a');if(!a||reduce||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank'||a.hasAttribute('download'))return;
  const u=new URL(a.href,location.href);
  if(u.origin!==location.origin||!/\.html$/.test(u.pathname)||(u.pathname===location.pathname))return;
  e.preventDefault();wipe.classList.remove('out');wipe.classList.add('go');setTimeout(()=>location.href=a.href,380);
});

/* barre de progression */
const bar=document.createElement('div');bar.className='scrollbar';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
const secs=[...document.querySelectorAll('.sec')];
let tick=false;
function onScroll(){tick=false;const h=doc.scrollHeight-innerHeight;bar.style.setProperty('--p',h>0?scrollY/h:0);
  if(!reduce)secs.forEach(s=>{const r=s.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)s.style.setProperty('--py',(r.top*-.18).toFixed(1)+'px')})}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

/* apparitions au scroll */
const sel='[data-rv], .sec .head, .about-fig, .about>div>*, .filters, .work, .tiles article, .contact>div>*, .contact form, .p-info>*, .p-block, .p-next a';
const els=[...document.querySelectorAll(sel)];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
els.forEach(el=>{
  if(el.classList.contains('meters')){io.observe(el);return}
  const sib=el.parentElement?[...el.parentElement.children].filter(c=>els.includes(c)):[];
  el.style.setProperty('--d',(Math.min(sib.indexOf(el),6)*0.08)+'s');el.classList.add('rv');io.observe(el)});
document.querySelectorAll('.meters').forEach(m=>io.observe(m));

/* inclinaison 3D + reflet */
if(fine&&!reduce)document.querySelectorAll('.tiles article, [data-tilt]').forEach(el=>{
  el.classList.add('tilt');if(!el.querySelector('.glare')){const g=document.createElement('span');g.className='glare';el.appendChild(g)}
  const max=+(el.dataset.tilt||8);
  el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    el.classList.add('hot');el.style.setProperty('--ry',((x-.5)*max).toFixed(2)+'deg');el.style.setProperty('--rx',((.5-y)*max).toFixed(2)+'deg');
    el.style.setProperty('--gx',x*100+'%');el.style.setProperty('--gy',y*100+'%')});
  el.addEventListener('pointerleave',()=>{el.classList.remove('hot');el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
});

/* texte "console" qui s'écrit */
document.querySelectorAll('[data-type]').forEach(el=>{
  const txt=el.textContent;if(reduce)return;el.textContent='';const c=document.createElement('span');c.className='caret';
  const t=document.createTextNode('');el.append(t,c);let i=0;
  setTimeout(function step(){t.data=txt.slice(0,++i);if(i<txt.length)setTimeout(step,28+Math.random()*40)},+(el.dataset.type||300));
});
})();
