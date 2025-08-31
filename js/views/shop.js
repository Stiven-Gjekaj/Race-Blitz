import { h, fmt } from '../ui.js';
import { allParts } from '../parts.js';
import { getState } from '../state.js';
import { buyPart, sellPart } from '../economy.js';

export function renderShop(){
  const s = getState();
  const cat = new URLSearchParams(location.hash.split('?')[1]||'').get('cat')||'engine';
  const list = allParts().filter(p=>p.category===cat);
  const cats = ['engine','intake','exhaust','ecu','transmission','differential','suspension','brakes','tires','aero','body','fuel','cooling'];
  const catButtons = cats.map(c=> h('a',{href:`#shop?cat=${c}`, class:`btn-ghost ${cat===c?'active':''}`}, c));

  const table = h('table',{class:'table'},
    h('thead',{}, h('tr',{}, h('th',{},'Part'), h('th',{},'Deltas'), h('th',{},'Price'), h('th',{},''))),
    h('tbody',{}, ...list.map(p=>{
      const owned = s.player.inventory.some(x=>x.id===p.id);
      return h('tr',{},
        h('td',{}, h('strong',{},p.name), h('div',{class:'muted'}, p.category)),
        h('td',{}, describeDelta(p)),
        h('td',{}, fmt.money(p.price)),
        h('td',{},
          owned ? h('button',{class:'btn-ghost', onclick:()=>sellPart(p.id)}, 'Sell (60%)')
                : h('button',{class:'btn', onclick:()=>buyPart(p)}, 'Buy')
        )
      );
    }))
  );

  return h('div',{class:'grid'},
    h('div',{class:'card'}, h('h3',{},'Categories'), h('div',{class:'flex', style:'flex-wrap:wrap;gap:8px'}, ...catButtons)),
    h('div',{class:'card'}, h('h3',{},`Parts: ${cat}`), table)
  );
}

function describeDelta(p){
  const s = p.stats||{};
  const arr = [];
  if(s.peakPowerKw) arr.push(`+${s.peakPowerKw}kW`);
  if(s.peakTorqueNm) arr.push(`+${s.peakTorqueNm}Nm`);
  if(s.dragCoefficientDelta) arr.push(`${s.dragCoefficientDelta>0?'+':''}${s.dragCoefficientDelta} Cd`);
  if(s.downforceNAt100Kph) arr.push(`+${s.downforceNAt100Kph}N DF`);
  if(s.gripCoefficientDelta) arr.push(`${s.gripCoefficientDelta>0?'+':''}${Math.round(s.gripCoefficientDelta*100)}% grip`);
  if(s.brakeForceDelta) arr.push(`${s.brakeForceDelta>0?'+':''}${Math.round(s.brakeForceDelta*100)}% brake`);
  if(s.reliabilityDelta) arr.push(`${s.reliabilityDelta>0?'+':''}${Math.round(s.reliabilityDelta*100)}% rel`);
  if(!arr.length) arr.push('—');
  return arr.join(', ');
}

