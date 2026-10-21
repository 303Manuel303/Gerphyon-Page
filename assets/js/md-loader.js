const EN = document.documentElement.lang === 'en';

export async function renderMarkdownInto(selector, mdUrl) {
  const container = document.querySelector(selector); if (!container) return;
  try {
    const res = await fetch(mdUrl); if (!res.ok) throw new Error((EN ? 'Unable to load: ' : 'Impossibile caricare: ') + mdUrl);
    container.innerHTML = markdownToHtml(await res.text());
  } catch(err) {
    container.innerHTML = `<div class="card">${EN ? 'Error loading content' : 'Errore nel caricamento del contenuto'}: ${err.message}</div>`;
  }
}

function inline(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

// Markdown minimale: titoli, liste (raggruppate) e paragrafi
export function markdownToHtml(md) {
  const out = []; let list = null; let para = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join('<br/>'))}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`<ul>${list.join('')}</ul>`); list = null; } };
  for (const raw of md.replace(/\r/g, '').split('\n')) {
    const line = raw.trimEnd();
    const h = line.match(/^(#{1,3})\s+(.+)$/);
    const li = line.match(/^\s*-\s(.+)$/);
    if (h) { flushPara(); flushList(); const n = h[1].length; out.push(`<h${n}>${inline(h[2])}</h${n}>`); }
    else if (li) { flushPara(); (list ||= []).push(`<li>${inline(li[1])}</li>`); }
    else if (!line.trim()) { flushPara(); flushList(); }
    else { flushList(); para.push(line); }
  }
  flushPara(); flushList();
  return out.join('\n');
}
