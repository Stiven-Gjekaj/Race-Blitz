import { h, fmt } from '../ui.js';
import { allParts } from '../parts.js';
import { getState } from '../state.js';
import { buyPart, sellPart } from '../economy.js';

export function renderShop(){
  const s = getState();
  const cat = new URLSearchParams(location.hash.split('?')[1]||'').get('cat')||'engine';
  const partsInCat = allParts().filter(p=>p.category===cat);
  const hasStock = partsInCat.some(p=>p.price===0);
  const list = partsInCat.filter(p=>p.price>0);
  const cats = ['engine','intake','exhaust','ecu','transmission','differential','suspension','brakes','tires','aero','body','fuel','cooling'];
  const catButtons = cats.map(c=>{
    const active = cat===c;
    const base = active ? 'btn' : 'btn btn-ghost';
    const cls = `${base} ${active ? 'active' : ''}`.trim();
    return h('a',{href:`#shop?cat=${c}`, class:cls}, c);
  });

  const table = h('div',{class:'table-wrapper'},
    h('table',{class:'table'},
      h('thead',{}, h('tr',{}, h('th',{},'Part'), h('th',{},'Tier'), h('th',{},'Deltas'), h('th',{},'Price'), h('th',{},''))),
      h('tbody',{}, ...list.map(p=>{
        const owned = s.player.inventory.some(x=>x.id===p.id);
        return h('tr',{},
          h('td',{}, h('strong',{},p.name), h('div',{class:'muted'}, p.category)),
          h('td',{}, tierBadge(p.price)),
          h('td',{}, describeDelta(p)),
          h('td',{}, fmt.money(p.price)),
          h('td',{},
            owned ? h('button',{class:'btn btn-ghost', onclick:()=>sellPart(p.id)}, 'Sell (60%)')
                  : h('button',{class:'btn', onclick:()=>buyPart(p)}, 'Buy')
          )
        );
      }))
    )
  );

  return h('div',{class:'grid'},
    h('div',{class:'card'}, h('h3',{},'Categories'), h('div',{class:'flex', style:'flex-wrap:wrap;gap:8px'}, ...catButtons)),
    h('div',{class:'card'}, h('h3',{},`Parts: ${cat} `, hasStock? h('span',{class:'badge'},'Stock'): null), table)
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

function tierBadge(price){
  const {label,color} = priceToTier(price);
  return h('span',{class:'badge', style:`border-color:${color};color:${color}`}, label);
}

function priceToTier(price){
  // Simple heuristic tiering by price bands
  if(price<=300) return {label:'T1 Entry', color:'#7dd3a7'};
  if(price<=900) return {label:'T2 Club', color:'#a1c9f1'};
  if(price<=1800) return {label:'T3 Sport', color:'#ffd166'};
  if(price<=3600) return {label:'T4 Pro', color:'#f4a261'};
  return {label:'T5 Elite', color:'#e10600'};
}

