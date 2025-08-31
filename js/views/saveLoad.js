import { h } from '../ui.js';
import { getState, setState } from '../state.js';
import { serializeState, deserializeState, hardReset } from '../save.js';

export function renderSaveLoad(){
  const s = getState();
  const exp = h('textarea',{id:'exportTxt', rows:'6', class:'grow'}, serializeState(s));
  const imp = h('textarea',{id:'importTxt', rows:'6', class:'grow', placeholder:'Paste save string here'});
  return h('div',{class:'grid grid-2'},
    h('div',{class:'card'}, h('h3',{},'Export'), exp, h('div',{class:'flex'}, h('button',{class:'btn', onclick:()=>{ navigator.clipboard?.writeText(exp.value); }}, 'Copy'))),
    h('div',{class:'card'}, h('h3',{},'Import'), imp, h('div',{class:'flex'}, h('button',{class:'btn', onclick:()=>{ if(confirm('Replace current save?')){ const obj = deserializeState(imp.value.trim()); if(obj){ setState(obj); } } }}, 'Load'))),
    h('div',{class:'card'}, h('h3',{},'Hard Reset'), h('div',{class:'muted'},'Deletes save and reloads the app.'), h('button',{class:'btn btn-danger', onclick:()=>{ if(confirm('Really hard reset?')) hardReset(); }}, 'Hard Reset'))
  );
}

