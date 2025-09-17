import { h, fmt } from '../ui.js';
import { getState, setActiveCar } from '../state.js';
import { renderTuner } from './tuner.js';

export function renderGarage(){
  const s = getState();
  const car = s.player.garage[0];
  const row = h('div',{class:'row'},
    h('div',{}, h('div',{class:'car-title'}, h('strong',{}, car.name)),
      h('div',{class:'kpi'},
        pill('Perf', car.derived?.performanceScore?.toFixed(3)),
        pill('Top', car.derived?.topSpeedKph+' km/h'),
        pill('0–100', car.derived?.zeroTo100+' s'),
        pill('Mass', car.derived?.massKg+' kg'),
      )
    ),
    h('div',{class:'flex'},
      h('button',{class:'btn btn-ghost', onclick:()=>{ const name=prompt('Rename car', car.name); if(name){ car.name=name; setActiveCar(car.id); } }}, 'Rename')
    )
  );

  // Fuse Tuning into Garage: show tuner panel below
  return h('div',{class:'grid'},
    h('div',{class:'card'}, h('h2',{},'Your Car'), row),
    renderTuner()
  );
}

function pill(k,v){ return h('span',{class:'pill'}, `${k}: ${v}`); }

