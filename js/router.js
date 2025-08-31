// Hash router for Race-Blitz
// Supports: #garage, #shop, #tuning, #championships, #leaderboard, #saveload, #debug

/**
 * Initialize router.
 * @param {() => void} renderFn - called on hashchange and once immediately.
 */
export function initRouter(renderFn){
  function onChange(){
    // Normalize unknown hashes to #garage; allow query suffix like #shop?cat=engine
    const valid = new Set(["#garage","#shop","#tuning","#championships","#leaderboard","#saveload","#debug","#race"]);
    const hash = window.location.hash || '#garage';
    const base = hash.split('?')[0];
    if(!valid.has(base)) { window.location.hash = '#garage'; return; }
    renderFn();
  }
  window.addEventListener('hashchange', onChange);
  if(!window.location.hash) window.location.hash = '#garage';
  onChange();
}

export function currentRoute(){
  return (window.location.hash || '#garage').split('?')[0];
}
