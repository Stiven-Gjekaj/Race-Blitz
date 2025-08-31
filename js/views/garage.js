import { h, fmt } from '../ui.js';
import { getState, setActiveCar } from '../state.js';

export function renderGarage(){
  const s = getState();
  const car = s.player.garage[0];
  const row = h('div',{class:'row'},
    h('div',{}, h('strong',{}, car.name), ' ', h('span',{class:'muted'}, `(${car.id})`),
      h('div',{class:'kpi'},
        pill('Perf', car.derived?.performanceScore?.toFixed(3)),
        pill('Top', car.derived?.topSpeedKph+' km/h'),
        pill('0–100', car.derived?.zeroTo100+' s'),
        pill('Mass', car.derived?.massKg+' kg'),
      )
    ),
    h('div',{class:'flex'},
      h('button',{class:'btn', onclick:()=>{ setActiveCar(car.id); location.hash='#tuning'; }}, 'Open in Tuning'),
      h('button',{class:'btn-ghost', onclick:()=>{ const name=prompt('Rename car', car.name); if(name){ car.name=name; setActiveCar(car.id); } }}, 'Rename')
    )
  );

  return h('div',{class:'grid'}, h('div',{class:'card'}, h('h2',{},'Your Car'), row));
}

function pill(k,v){ return h('span',{class:'pill'}, `${k}: ${v}`); }
