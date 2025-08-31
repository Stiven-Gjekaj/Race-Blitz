// Weather generation and modifiers
import { RNG } from './rng.js';

const STATES = ["dry","light_rain","heavy_rain","drying","wetting","hot","cold","windy"];

export function generateWeatherTimeline(track, rng){
  const segs = rng.int(6,10);
  // choose start
  const start = weightedPick(track.weatherBias.start, rng);
  const arr = [];
  let state = start;
  for(let i=0;i<segs;i++){
    const tempC = baseTempFor(state, rng);
    const windKph = baseWindFor(state, rng);
    arr.push({ state, tempC, windKph });
    const choices = track.weatherBias.trans[state] || [['dry',8]];
    state = weightedPick(choices, rng);
  }
  return arr;
}

function weightedPick(pairs, rng){
  const total = pairs.reduce((a,[,w])=>a+w,0);
  let r = rng.int(1,total);
  for(const [x,w] of pairs){ r -= w; if(r<=0) return x; }
  return pairs[0][0];
}

function baseTempFor(state, rng){
  let t=22;
  if(state==='hot') t=rng.int(30,38);
  else if(state==='cold') t=rng.int(8,15);
  else if(state.includes('rain')) t=rng.int(12,20);
  else t=rng.int(16,28);
  return t;
}
function baseWindFor(state, rng){
  if(state==='windy') return rng.int(18,34);
  if(state.includes('rain')) return rng.int(10,26);
  return rng.int(6,18);
}

export function applyWeatherModifiers(derived, segment){
  let grip=1, drag=1, reliab=0;
  switch(segment.state){
    case 'dry': grip*=1.0; break;
    case 'hot': grip*=0.99; reliab+=-0.015; break;
    case 'cold': grip*=0.97; break;
    case 'light_rain': grip*=0.92; drag*=1.00; reliab+=0.01; break;
    case 'heavy_rain': grip*=0.82; drag*=1.015; reliab+=0.01; break;
    case 'drying': grip*=0.95; break;
    case 'wetting': grip*=0.9; break;
    case 'windy': drag*=0.98; break;
  }
  return { gripMult:grip, dragMult:drag, reliabilityDeltaAbs:reliab };
}

export function scChanceFor(track, segment){
  let base = track.scBaseline;
  if(segment.state==='heavy_rain') base += 0.07;
  else if(segment.state==='light_rain'||segment.state==='wetting') base += 0.03;
  return base;
}

