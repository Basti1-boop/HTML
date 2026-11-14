const P=[
{n:'Malt Sauvage',p:'./assets/img/opt/p-malt.webp',l:'./MaltSauvage.html',d:'Gamme de 3 bières craft : identité et étiquettes inspirées du packaging japonais.',t:'packaging',k:'Illustrator · InDesign'},
{n:'In the Dark',p:'./assets/img/opt/p-dark.webp',l:'./InTheDark.html',d:'Dépliant 3 volets pour un restaurant où l’on dîne dans le noir, avec son mockup.',t:'edition',k:'InDesign · Photoshop'},
{n:'Berlin 1919',p:'./assets/img/opt/p-berlin.webp',l:'./Berlin.html',d:'Affiche Bauhaus : géométrie, lignes de construction et palette rouge-ocre.',t:'affiche',k:'Illustrator · Photoshop'},
{n:'London 1970',p:'./assets/img/opt/p-london.webp',l:'./London.html',d:'Affiche punk / DIY : collage, graffiti et photocopie trash.',t:'affiche',k:'Illustrator · Photoshop'},
{n:'Zurich 1950',p:'./assets/img/opt/p-zurich.webp',l:'./Zurich.html',d:'Affiche Swiss Style : grille stricte, Helvetica et carrés rouges.',t:'affiche',k:'Illustrator · Photoshop'},
{n:'Micromania',p:'./assets/img/opt/p-micromania.webp',l:'./Micromania.html',d:'Refonte UX/UI d’un univers gaming, plus contemporaine.',t:'figma',k:'Figma'},
{n:'Culture Jeune',p:'./assets/img/opt/p-culture.webp',l:'./Culture.html',d:'Plateforme culturelle : événements, contenus et navigation intuitive.',t:'figma',k:'Figma'},
{n:'Bloom & Co',p:'./assets/img/opt/p-bloom.webp',l:'./BloomAndCo.html',d:'Page d’accueil de l’e-shop d’une marque fictive de plantes d’intérieur de luxe.',t:'figma',k:'Figma'},
{n:'Centipede',p:'./assets/img/opt/p-centipede.webp',l:'./Centipede.html',d:'Pièce textile customisée à la main, entre couture et illustration.',t:'couture',k:'Couture · Peinture'},
{n:'Ascension',p:'./assets/img/opt/p-ascension.webp',l:'./Ascension.html',d:'Projet libre : une illustration du manga Ascension en bleu et or, déchirée par une étoile.',t:'perso',k:'Photoshop'},
{n:'Vogue × JoJo',p:'./assets/img/opt/p-vogue.webp',l:'./VogueGiorno.html',d:'Projet libre : fausse couverture Vogue Italia avec Giorno Giovanna, en noir et blanc chromé.',t:'perso',k:'Photoshop'}];
const $=s=>document.querySelector(s),list=$('#plist'),view=$('#pview'),img=$('#pimg');
function show(p){$('#pname').textContent=p.n;$('#pdesc').textContent=p.d;view.href=p.l;img.alt='Aperçu du projet '+p.n;img.classList.remove('in');img.src=p.p;void img.offsetWidth;img.classList.add('in');
list.querySelectorAll('li').forEach(li=>li.classList.toggle('on',li.dataset.l===p.l))}
function render(a){list.innerHTML=a.map((p,i)=>`<li data-l="${p.l}" style="--i:${i}"><a href="${p.l}"><span class="num">${String(P.indexOf(p)+1).padStart(2,'0')}</span><b>${p.n}</b><small>${p.k}</small></a></li>`).join('');
list.querySelectorAll('li').forEach((li,i)=>{const go=()=>show(a[i]);li.addEventListener('mouseenter',go);li.querySelector('a').addEventListener('focus',go)});a[0]&&show(a[0])}
render(P);
document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('on'));b.classList.add('on');render(b.dataset.c==='all'?P:P.filter(p=>p.t===b.dataset.c))}));
// lien actif dans la barre
const links=[...document.querySelectorAll('.xmb nav a')];
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.hash==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('main section[id]').forEach(s=>spy.observe(s));
// formulaire
const f=$('#contact-form'),st=$('#form-status');f.addEventListener('submit',async e=>{e.preventDefault();const b=f.querySelector('button');b.disabled=true;b.textContent='Envoi en cours…';
try{const r=await fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}});if(r.ok){st.textContent='Message envoyé, merci !';f.reset()}else st.textContent='Le message n’est pas parti. Réessaie dans un instant.'}catch{st.textContent='Connexion impossible. Vérifie ton réseau et réessaie.'}finally{b.disabled=false;b.textContent='Envoyer le message'}});

// écran de démarrage
const boot=document.getElementById('boot');if(boot){const end=()=>{boot.classList.add('done');setTimeout(()=>boot.remove(),700)};boot.addEventListener('click',end);addEventListener('keydown',end,{once:true});setTimeout(end,2100)}
// précharge les aperçus
P.forEach(p=>{const i=new Image();i.src=p.p});
