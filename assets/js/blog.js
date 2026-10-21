const EN=document.documentElement.lang==='en';
function fmtDate(d){try{return new Date(d).toLocaleDateString(EN?'en-GB':'it-IT')}catch{return d}}
async function loadBlogs(){ const grid=document.querySelector('#blog-grid'); const search=document.querySelector('#blog-search'); if(!grid) return; let posts=[]; try{ const res=await fetch('./blogs/manifest.json'); const data=await res.json(); posts=data.blogs||[]; render(posts); search?.addEventListener('input',(e)=>{ const q=e.target.value.toLowerCase(); const f=posts.filter(p=> (p.title||'').toLowerCase().includes(q) || (p.tags||[]).join(' ').toLowerCase().includes(q)); render(f); }); }catch(err){ grid.innerHTML = `<div class="card">${EN?'Error loading posts':'Errore nel caricare i blog'}: ${err.message}</div>`; }
  function render(items){ grid.innerHTML=''; if(!items.length){ grid.innerHTML=`<div class="card">${EN?'No posts found.':'Nessun post trovato.'}</div>`; return; } for(const p of items){ const url=`./blog-post.html?post=${encodeURIComponent(p.file)}`; const el=document.createElement('article'); el.className='blog-card'; el.innerHTML=`
      <div class="thumb" style="background-image:url('${p.image || './assets/img/slide1.png'}')"></div>
      <div class="meta">
        <strong>${p.title||p.file}</strong>
        <div class="date">${fmtDate(p.date||'')}</div>
        <div class="tags">${(p.tags||[]).map(t=>`<span class='badge'>#${t}</span>`).join(' ')}</div>
        <a class="read" href="${url}">${EN?'Read':'Leggi'}</a>
      </div>`; grid.appendChild(el); } }
}
document.addEventListener('DOMContentLoaded', loadBlogs);