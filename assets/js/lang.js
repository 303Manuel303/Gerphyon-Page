// lingua: italiano nella root, inglese in /en/
// va nell'<head> (non defer) così il redirect avviene prima che la pagina si veda
(function(){
  const cur=document.documentElement.lang==='en'?'en':'it';
  let saved=null; try{ saved=localStorage.getItem('lang'); }catch{}
  const first=((navigator.languages&&navigator.languages[0])||navigator.language||'').toLowerCase();
  const want=saved||(first.startsWith('it')?'it':'en');
  const isBot=/bot|crawl|spider|slurp|lighthouse/i.test(navigator.userAgent);

  // stessa pagina nell'altra lingua (link relativi: funziona anche fuori dalla root)
  if(want!==cur && !isBot){
    const page=location.pathname.split('/').pop();
    location.replace((cur==='it'?'en/':'../')+page+location.search+location.hash);
  }

  // scelta manuale dal menu: la ricordiamo e manteniamo ?post=...
  document.addEventListener('click',(e)=>{
    const a=e.target.closest('[data-lang]'); if(!a) return;
    try{ localStorage.setItem('lang',a.dataset.lang); }catch{}
    if(location.search) a.search=location.search;
  });
})();
