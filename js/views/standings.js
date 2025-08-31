import { h } from '../ui.js';
import { getState } from '../state.js';

export function renderStandings(){
  const s = getState();
  const st = s.championship.standings || {};
  const rows = Object.entries(st).map(([id,rec])=> h('tr',{}, h('td',{}, id), h('td',{}, rec.points)));
  return h('div',{class:'card'}, h('h3',{},'Season Standings'), h('table',{class:'table'}, h('thead',{}, h('tr',{}, h('th',{},'Driver'), h('th',{},'Pts'))), h('tbody',{}, ...rows)));
}

