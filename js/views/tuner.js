import { h } from '../ui.js';
import { getState, getActiveCar, updateCar } from '../state.js';
import { partsByCategory, byId as partById } from '../parts.js';
import { recomputeCarDerived, validateTunables } from '../stats.js';

export function renderTuner(){
  const car = structuredClone(getActiveCar());
  let baseline = recomputeCarDerived(getActiveCar());
  const left = renderPartSelectors(car, baseline, () => { baseline = recomputeCarDerived(getActiveCar()); });
  const mid = renderTunables(car, baseline);
  const right = renderDerived(car, baseline);
  return h('div',{class:'grid grid-3'}, left, mid, right);
}

function renderPartSelectors(car, baseline, onApplied){
  const cats = ['engine','transmission','differential','suspension','brakes','tires','aero','body','intake','exhaust','ecu','fuel','cooling'];
  const groups = cats.map(cat=> h('div',{},
    h('label',{}, h('span',{}, cat),
      h('select',{ value: selectValueFor(cat, car.parts[cat]), onchange:(e)=>{ 
          const val = e.target.value;
          if(!val){ const stockId = stockIdFor(cat); if(stockId){ car.parts[cat] = partById(stockId); } }
          else { car.parts[cat] = partById(val); }
          // When transmission or aero changes, tuner fields (gear count/wing) may change
          if(cat==='transmission' || cat==='aero'){
            refreshTunables(car, baseline);
          }
          refreshRight(car, baseline); 
        } },
        ...(stockIdFor(cat)? [h('option',{value:''},'Stock/None')] : []),
        ...ownedOptionsFor(cat, car)
      )
    )
  ));
  const applyBtn = h('button',{class:'btn', onclick:()=>{ car.derived = recomputeCarDerived(car); updateCar(car); onApplied?.(); }}, 'Apply & Save');
  return h('div',{class:'card'}, h('h3',{},'Parts (Owned)'), ...groups, applyBtn);
}

function renderTunables(car, baseline){
  const tx = car.parts.transmission;
  const gearCount = tx?.stats?.gearCount || (car.tunables.gearRatios?.length||5);
  if(!car.tunables.gearRatios || car.tunables.gearRatios.length!==gearCount){
    car.tunables.gearRatios = tx?.tunables?.gearRatios?.slice()||new Array(gearCount).fill(1);
  }
  const gearInputs = car.tunables.gearRatios.map((v,i)=> h('label',{}, `Gear ${i+1}`, h('input',{type:'number', step:'0.01', value:v, oninput:(e)=>{ car.tunables.gearRatios[i]=parseFloat(e.target.value); refreshRight(car, baseline);} })));
  const fields = h('div',{},
    h('label',{}, 'Final Drive', h('input',{type:'number', step:'0.01', value:car.tunables.finalDrive, oninput:(e)=>{ car.tunables.finalDrive=parseFloat(e.target.value); refreshRight(car, baseline);} })),
    ...gearInputs,
    h('label',{}, 'Wing Angle', h('input',{type:'number', step:'1', value:car.tunables.wingAngle, oninput:(e)=>{ car.tunables.wingAngle=parseInt(e.target.value||'0'); refreshRight(car, baseline);} })),
    h('label',{}, 'Tire Pressure PSI', h('input',{type:'number', value:car.tunables.tirePressurePsi, oninput:(e)=>{ car.tunables.tirePressurePsi=parseFloat(e.target.value); refreshRight(car, baseline);} })),
    h('label',{}, 'Spring Rate', h('input',{type:'number', value:car.tunables.springRate, oninput:(e)=>{ car.tunables.springRate=parseFloat(e.target.value); refreshRight(car, baseline);} })),
    h('label',{}, 'Damper Setting', h('input',{type:'number', value:car.tunables.damperSetting, oninput:(e)=>{ car.tunables.damperSetting=parseFloat(e.target.value); refreshRight(car, baseline);} }))
  );
  const resetBtn = h('button',{class:'btn-ghost', onclick:()=>{
    // Reset tunables to sensible defaults based on installed parts
    car.tunables = defaultTunablesForCar(car);
    // Persist immediately so the change takes effect outside this panel
    car.derived = recomputeCarDerived(car);
    updateCar(car);
    refreshTunables(car, baseline);
    refreshRight(car, baseline);
  }}, 'Reset Tunables');
  return h('div',{class:'card', id:'tunerPanel'}, h('h3',{},'Tunables'), fields, resetBtn);
}

function renderDerived(car, baseline){
  const d = recomputeCarDerived(car);
  const v = validateTunables(car);
  const warns = [];
  if(d.warnings.overheatingRisk) warns.push(chip('Overheating Risk','warn'));
  if(d.warnings.gearingMismatch) warns.push(chip('Gearing Mismatch','warn'));
  if(d.warnings.dragHeavy) warns.push(chip('Drag-Heavy','warn'));
  const b = baseline||d;
  const list = h('div',{},
    metricDelta('Mass', d.massKg+' kg', d.massKg - b.massKg, 'kg', false),
    metricDelta('Power', d.powerKw+' kW', d.powerKw - b.powerKw, 'kW', true),
    metricDelta('Top Speed', d.topSpeedKph+' km/h', d.topSpeedKph - b.topSpeedKph, 'km/h', true),
    metricDelta('0–100', d.zeroTo100+' s', d.zeroTo100 - b.zeroTo100, 's', false),
    metricDelta('Handling', d.handlingIndex, d.handlingIndex - b.handlingIndex, '', true, 3),
    metricDelta('Braking', d.brakingIndex, d.brakingIndex - b.brakingIndex, '', true, 3),
    metricDelta('Reliability', d.reliability, d.reliability - b.reliability, '', true, 3),
    metricDelta('Efficiency', d.efficiency, d.efficiency - b.efficiency, '', true, 3),
    metricDelta('Perf Score', d.performanceScore, d.performanceScore - (b.performanceScore||0), '', true, 3)
  );
  const issues = v.issues?.length? h('div',{}, ...v.issues.map(i=>h('div',{class:'badge warn'}, i))):null;
  return h('div',{class:'card', id:'derivedPanel'}, h('h3',{},'Derived'), h('div',{class:'kpi'}, ...warns), list, issues);
}

function chip(text,cls){ return h('span',{class:'badge '+cls}, text); }
function metric(k,v){ return h('div',{class:'row'}, h('span',{},k), h('strong',{},v)); }
function metricDelta(k, v, delta, unit='', betterWhenHigher=true, decimals=0){
  const d = +delta.toFixed(decimals||0);
  const sign = d>0?'+':'';
  const isImprove = (betterWhenHigher? d>0 : d<0);
  const cls = isImprove? 'ok':'warn';
  const badge = d===0? null : h('span',{class:'badge '+cls, style:'margin-left:6px'}, `${sign}${d}${unit}`);
  return h('div',{class:'row'}, h('span',{},k), h('strong',{}, v, ' ', badge));
}

function refreshRight(car, baseline){
  const panel = document.getElementById('derivedPanel');
  if(!panel) return;
  const fresh = renderDerived(car, baseline);
  panel.replaceWith(fresh);
}

function refreshTunables(car, baseline){
  const panel = document.getElementById('tunerPanel');
  if(!panel) return;
  const fresh = renderTunables(car, baseline);
  panel.replaceWith(fresh);
}

function defaultTunablesForCar(car){
  const tx = car.parts.transmission;
  const aero = car.parts.aero;
  const fallbackRatios = [3.50,2.10,1.45,1.15,0.90];
  const gearRatios = (tx?.tunables?.gearRatios?.slice?.()||fallbackRatios).slice();
  const finalDrive = tx?.stats?.finalDrive ?? 3.7;
  const wingAngle = aero?.tunables?.wingAngle ?? 0;
  return {
    gearRatios,
    finalDrive,
    wingAngle,
    tirePressurePsi:30,
    springRate:35,
    damperSetting:5
  };
}

function hideAsStock(cat, p){
  // Hide any zero-price part as Stock/None
  return p.price === 0;
}
function stockIdFor(cat){
  const stock = partsByCategory(cat).find(p=>p.price===0);
  return stock?.id || null;
}
function selectValueFor(cat, part){
  if(!part) return '';
  if(part.price===0) return '';
  return part.id;
}

function ownedOptionsFor(cat, car){
  const s = getState();
  const inv = s.player.inventory.filter(p=>p.category===cat);
  const seen = new Set(inv.map(p=>p.id));
  const opts = [];
  const cur = car.parts[cat];
  if(cur && cur.price>0 && !seen.has(cur.id)){
    opts.push(h('option',{value:cur.id}, `Installed: ${cur.name}`));
  }
  for(const p of inv){
    if(hideAsStock(cat,p)) continue;
    opts.push(h('option',{value:p.id}, `${p.name} ($${p.price})`));
  }
  if(opts.length===0){
    opts.push(h('option',{value:'', disabled:true}, 'No owned parts'));
  }
  return opts;
}
