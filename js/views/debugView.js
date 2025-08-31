import { h } from '../ui.js';
import { getState, setState } from '../state.js';
import { markDebugEverEnabled } from '../integrity.js';

export function renderDebug(){
  const s = getState();
  const dbg = s.temp.debug||{ seed:123456, noDNFs:false, forceWeather:null, aiDifficulty:0 };
  s.temp.debug = dbg; setState(s);
  const toggle = h('label',{}, h('input',{type:'checkbox', checked:s.integrity.debugEverEnabled, onchange:(e)=>{ if(e.target.checked) markDebugEverEnabled(); }}), ' Enable Debug (disables scores)');
  const seed = h('label',{}, 'Fixed Seed', h('input',{type:'number', value:dbg.seed, oninput:(e)=>{ dbg.seed=parseInt(e.target.value||'0'); setState(s); }}));
  const dnfs = h('label',{}, 'No DNFs', h('input',{type:'checkbox', checked:dbg.noDNFs, onchange:(e)=>{ dbg.noDNFs=e.target.checked; setState(s); }}));
  const ai = h('label',{}, 'AI Difficulty Offset', h('input',{type:'number', value:dbg.aiDifficulty, oninput:(e)=>{ dbg.aiDifficulty=parseInt(e.target.value||'0'); setState(s);} }));
  const grant = h('button',{class:'btn', onclick:()=>{ s.player.money+=5000; setState(s);} }, 'Grant $5,000');
  const unlock = h('button',{class:'btn-ghost', onclick:()=>{ s.player.ladderTier=Math.min(s.player.ladderTier+1, s.catalog.ladder.length-1); setState(s);} }, 'Unlock Next Tier');
  const recompute = h('button',{class:'btn-ghost', onclick:()=>{ for(const c of s.player.garage){ c.derived = null; } setState(s);} }, 'Recompute All Derived');
  return h('div',{class:'grid'}, h('div',{class:'card'}, h('h3',{},'Debug Tools'), toggle, seed, dnfs, ai, h('div',{class:'flex'}, grant, unlock, recompute)));
}

