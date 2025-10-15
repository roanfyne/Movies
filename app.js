// UI refs const statusEl = document.getElementById('status'); const moviesEl = document.getElementById('movies'); const searchEl = document.getElementById('search'); const refreshBtn = document.getElementById('refresh');

refreshBtn.addEventListener('click', () => load()); searchEl.addEventListener('input', () => filter());

let moviesCache = [];

async function load(){ setStatus('Loading movies...'); try{ const data = await fetchMovies(); const list = normalizeList(data); moviesCache = list; render(list); setStatus(${list.length} movie(s)); }catch(err){ console.error(err); setStatus('Failed to load movies. See console.'); moviesEl.innerHTML = ''; } }

async function fetchMovies(){ const url = USE_PROXY ? PROXY_URL : API_URL; const headers = USE_PROXY ? {} : { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': 'latest-movies.p.rapidapi.com' }; const res = await fetch(url, { headers }); if (!res.ok) throw new Error(HTTP ${res.status} ${res.statusText}); // Try json or text const text = await res.text(); try { return JSON.parse(text); } catch(e){ return text; } }

function normalizeList(raw){ if (!raw) return []; // common shapes: array, { results: [...] }, { movies: [...] }, or object if (Array.isArray(raw)) return raw; if (Array.isArray(raw.results)) return raw.results; if (Array.isArray(raw.movies)) return raw.movies; // fallback: values const vals = Object.values(raw).filter(v => Array.isArray(v)); if (vals.length) return vals[0]; return []; }

function render(list){ moviesEl.innerHTML = ''; if (!list || list.length === 0){ moviesEl.innerHTML = '<div class="status">No movies to show.</div>'; return; }

list.forEach(m => { const card = document.createElement('article'); card.className = 'card';

const img = document.createElement('img');
img.src = m.poster || m.image || m.thumbnail || 'https://via.placeholder.com/400x600?text=No+Image';
img.alt = (m.title || m.name || 'Movie poster');

const title = document.createElement('h3');
title.textContent = m.title || m.name || 'Untitled';

const meta = document.createElement('p');
const metaParts = [m.year, m.genre, m.rating].filter(Boolean);
meta.textContent = metaParts.join(' • ');

const actions = document.createElement('div');
actions.className = 'actions';

const details = document.createElement('a');
details.href = '#';
details.className = 'badge';
details.textContent = m.type || 'info';

// detect possible download links (common names)
const dl = m.download_link || m.downloadUrl || m.url || m.link || m.file || m.torrent || m.magnet;
if (dl) {
  const a = document.createElement('a');
  a.href = dl;
  a.className = 'button';
  a.textContent = 'Download';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  actions.appendChild(a);
} else {
  const a = document.createElement('a');
  a.href = '#';
  a.className = 'button';
  a.textContent = 'Details';
  actions.appendChild(a);
}

actions.appendChild(details);

card.appendChild(img);
card.appendChild(title);
card.appendChild(meta);
card.appendChild(actions);

moviesEl.appendChild(card);
