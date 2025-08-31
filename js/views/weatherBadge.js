import { h } from '../ui.js';

export function WeatherBadge({forecast}){
  const segs = forecast.slice(0,5);
  return h('div',{class:'flex'}, ...segs.map(s=> iconWithTemp(s.state, s.tempC)));
}

function iconWithTemp(state, temp){
  const wrap = h('span',{class:'badge'}, svg(iconFor(state)), ` ${temp}°C`);
  return wrap;
}

function svg(name){ const el = document.createElementNS('http://www.w3.org/2000/svg','svg'); el.setAttribute('class','icon'); el.innerHTML = `<use href="/assets/icons.svg#${name}"></use>`; return el; }
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

