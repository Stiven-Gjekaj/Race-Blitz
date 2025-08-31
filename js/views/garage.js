import { h, fmt } from '../ui.js';
import { getState, setActiveCar, addCarFromTemplate, removeCar } from '../state.js';

export function renderGarage(){
  const s = getState();
  const rows = s.player.garage.map(car=>
    h('div',{class:'row'},
      h('div',{}, h('strong',{}, car.name), ' ', h('span',{class:'muted'}, `(${car.id})`),
        h('div',{class:'kpi'},
          pill('Perf', car.derived?.performanceScore?.toFixed(3)),
          pill('Top', car.derived?.topSpeedKph+' km/h'),
          pill('0–100', car.derived?.zeroTo100+' s'),
          pill('Mass', car.derived?.massKg+' kg'),
        )
      ),
      h('div',{class:'flex'},
        h('button',{class:'btn-ghost', onclick:()=>{ setActiveCar(car.id); location.hash='#tuning'; }}, 'Open in Tuning'),
        h('button',{class:'btn-ghost', onclick:()=>{ const name=prompt('Rename car', car.name); if(name){ car.name=name; setActiveCar(car.id); } }}, 'Rename'),
        h('button',{class:'btn-ghost', onclick:()=>{ if(confirm('Sell this car?')) removeCar(car.id); }}, 'Sell')
      )
    )
  );

  const createBox = h('div',{class:'card'},
    h('h3',{},'Create New Car'),
    h('div',{class:'flex'},
      h('input',{id:'newCarName', placeholder:'Name your car...', class:'grow'}),
      h('button',{class:'btn', onclick:()=>{ const name=document.getElementById('newCarName').value||'Custom'; addCarFromTemplate(name); }}, 'Create')
    ),
    h('div',{class:'footer-note muted'}, 'Two more chassis templates unlock later — upcoming feature.')
  );

  return h('div',{class:'grid'}, h('div',{class:'card'}, h('h2',{},'Your Garage'), ...rows), createBox);
}

function pill(k,v){ return h('span',{class:'pill'}, `${k}: ${v}`); }

