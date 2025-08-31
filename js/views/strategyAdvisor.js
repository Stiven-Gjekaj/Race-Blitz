import { h } from '../ui.js';
import { recommendStrategy } from '../strategy.js';

export function StrategyAdvisor({car, forecast}){
  const r = recommendStrategy(car, forecast);
  return h('div',{class:'card'}, h('h3',{},'Strategy Advisor'),
    h('div',{}, `Start: ${r.compound}`),
    h('div',{}, r.stopSegment!=null?`Planned stop at segment ${r.stopSegment}`:'No planned stop'),
    h('div',{class:'muted'}, r.rationale)
  );
}

