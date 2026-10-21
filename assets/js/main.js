const EN=document.documentElement.lang==='en';

document.addEventListener('DOMContentLoaded',()=>{
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const yearEl=document.querySelector('#year'); if(yearEl) yearEl.textContent=new Date().getFullYear();

  // header più scuro quando si scorre
  const header=document.querySelector('.site-header');
  const onScroll=()=>{ header?.classList.toggle('is-scrolled',window.scrollY>8); toTop.classList.toggle('is-visible',window.scrollY>400); };

  // torna su
  const toTop=document.createElement('button');
  toTop.className='to-top'; toTop.type='button'; toTop.setAttribute('aria-label',EN?'Back to top':'Torna su');
  toTop.innerHTML='<span class="px-chev" aria-hidden="true"></span>';
  document.body.appendChild(toTop);
  toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'}));
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // menu mobile
  const toggle=document.querySelector('.nav-toggle'); const nav=document.querySelector('#site-nav');
  if(toggle && nav){
    const setOpen=(open)=>{ toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open?(EN?'Close menu':'Chiudi menu'):(EN?'Open menu':'Apri menu')); nav.classList.toggle('is-open',open); };
    toggle.addEventListener('click',()=>setOpen(toggle.getAttribute('aria-expanded')!=='true'));
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') setOpen(false); });
    document.addEventListener('click',(e)=>{ if(!e.target.closest('.site-header')) setOpen(false); });
  }

  // comparsa allo scroll
  const reveal=document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && !reduceMotion){
    const io=new IntersectionObserver((entries)=>{ entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('is-visible'); io.unobserve(en.target); } }); },{rootMargin:'0px 0px -10% 0px'});
    reveal.forEach(el=>io.observe(el));
  } else reveal.forEach(el=>el.classList.add('is-visible'));

  // ultimo aggiornamento dal changelog
  const badge=document.querySelector('[data-latest-version]');
  if(badge){
    fetch('./versions/manifest.json').then(r=>r.json()).then(data=>{
      const items=(data.versions||[]).slice();
      const key=f=>f.replace('.md','').split('-').map(Number);
      items.sort((a,b)=>{ const pa=key(a.file), pb=key(b.file); for(let i=0;i<3;i++){ if((pb[i]||0)!==(pa[i]||0)) return (pb[i]||0)-(pa[i]||0); } return 0; });
      const latest=items[0]; if(!latest) return;
      badge.querySelector('b').textContent=latest.title||latest.file.replace('.md','').split('-').join('.');
      badge.hidden=false;
    }).catch(()=>{});
  }

  if(!reduceMotion) document.querySelectorAll('[data-eyes]').forEach(spawnEyes);
});

// occhi che si aprono nel buio e spariscono se ti avvicini
function spawnEyes(box){
  const count=Number(box.dataset.eyes)||3;
  const area=box.dataset.eyesArea;
  const colors=['#fff','#fff','#fff','#ffd000','#ff2a2a'];
  const pairs=[];
  const place=(p)=>{
    let x=Math.random()*90+3, y=Math.random()*80+8;
    if(area==='edges'){ x=Math.random()<.5 ? Math.random()*16+2 : Math.random()*16+80; y=Math.random()*50+35; }
    if(area==='right'){ x=Math.random()*24+72; }
    p.style.left=x+'%'; p.style.top=y+'%';
    p.style.setProperty('--s',(Math.random()*1.2+.8).toFixed(2));
    p.style.setProperty('--c',colors[Math.floor(Math.random()*colors.length)]);
    p.style.setProperty('--blink',(Math.random()*4+3).toFixed(1)+'s');
  };
  const cycle=(p)=>{
    place(p); p.classList.remove('is-hiding');
    setTimeout(()=>p.classList.add('is-open'),Math.random()*6000+500);
    setTimeout(()=>{ p.classList.remove('is-open'); setTimeout(()=>cycle(p),1500); },Math.random()*8000+9000);
  };
  for(let i=0;i<count;i++){
    const p=document.createElement('span'); p.className='eye-pair'; p.innerHTML='<i></i><i></i>';
    box.appendChild(p); pairs.push(p); cycle(p);
  }
  box.parentElement.addEventListener('pointermove',(e)=>{
    for(const p of pairs){
      if(!p.classList.contains('is-open')) continue;
      const r=p.getBoundingClientRect();
      if(Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2))<110){ p.classList.add('is-hiding'); p.classList.remove('is-open'); }
    }
  });
}
