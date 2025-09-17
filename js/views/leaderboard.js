import { h } from '../ui.js';
import { getScores, bannerIfDisabled } from '../leaderboard.js';

export function renderLeaderboard(){
  const scores = getScores();
  const banner = bannerIfDisabled();
  const rows = scores.map((s,idx)=> h('tr',{}, h('td',{}, idx+1), h('td',{}, s.name||'Anon'), h('td',{}, s.points), h('td',{}, new Date(s.ts).toLocaleString())));
  return h('div',{class:'grid'},
    banner? h('div',{class:'badge warn'}, banner): null,
    h('div',{class:'card'}, h('h3',{},'Leaderboard (Local)'), h('div',{class:'table-wrapper'}, h('table',{class:'table'}, h('thead',{}, h('tr',{}, h('th',{},'#'), h('th',{},'Player'), h('th',{},'Points'), h('th',{},'When'))), h('tbody',{}, ...rows))))
  );
}

