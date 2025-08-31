import { h } from '../ui.js';
import { getState } from '../state.js';
import { TRACKS } from '../tracks.js';
import { recommendStrategy } from '../strategy.js';
import { RNG } from '../rng.js';
import { generateWeatherTimeline } from '../weather.js';

export function renderChampionships(){
  const s = getState();
  const tier = s.catalog.ladder[s.player.ladderTier];
  const track = TRACKS[ s.player.ladderTier % TRACKS.length ];
  const rng = new RNG(1234+s.player.ladderTier);
  const forecast = generateWeatherTimeline(track, rng);
  const strat = recommendStrategy(null, forecast);

  const trackCard = h('div',{class:'card'}, h('h3',{}, track.name),
    h('div',{class:'muted'}, `${tier.name} • Entry: $${tier.entryFee}`),
    h('div',{}, weatherBadge(forecast.slice(0,3))),
    h('div',{}, h('strong',{},'Strategy:'), ' ', `${strat.compound}${strat.stopSegment!=null?`, stop @ seg ${strat.stopSegment}`:''}`)
  );

  const startBtn = h('button',{class:'btn', onclick:()=>startRace(track, tier, forecast)}, 'Start Race');

  return h('div',{class:'grid'},
    h('div',{class:'card'}, h('h3',{},'Ladder'),
      s.catalog.ladder.map((t,idx)=> h('div',{class:'row'}, h('div',{}, t.name, idx===s.player.ladderTier? h('span',{class:'badge ok', style:'margin-left:8px'},'Current'):null), h('div',{}, `${t.events} races`)))
    ),
    trackCard,
    h('div',{class:'card'}, h('h3',{},'Predicted Finish Range'), h('div',{class:'muted'}, 'P5–P9 (rough heuristic)')), 
    h('div',{}, startBtn)
  );
}

function weatherBadge(segs){
  const wrap = h('div',{class:'flex'});
  for(const s of segs){
    const el = document.createElementNS('http://www.w3.org/2000/svg','svg');
    el.setAttribute('class','icon');
    el.innerHTML = `<use href="assets/icons.svg#${iconFor(s.state)}"></use>`;
    wrap.append(el, document.createTextNode(` ${s.tempC}°C `));
  }
  return wrap;
}

function iconFor(state){
  if(state==='dry') return 'sun';
  if(state==='hot') return 'sun';
  if(state==='cold') return 'cloud';
  if(state==='windy') return 'wind';
  if(state==='light_rain') return 'rain';
  if(state==='heavy_rain') return 'storm';
  if(state==='drying') return 'sun';
  if(state==='wetting') return 'rain';
  return 'cloud';
}

function startRace(track, tier, forecast){
  // Signal app to start race via hash
  sessionStorage.setItem('RB_NEXT_RACE_CTX', JSON.stringify({ trackId:track.id, tierIdx:tier?0:0, forecast }));
  location.hash = '#race';
}
