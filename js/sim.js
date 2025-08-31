// Simplified race simulation
import { RNG } from './rng.js';
import { F1_POINTS, FASTEST_LAP_BONUS } from './stats.js';
import { applyWeatherModifiers, generateWeatherTimeline, scChanceFor } from './weather.js';
import { generateAICarForTier } from './ai.js';
import { recomputeCarDerived } from './stats.js';

export function computeRacePoints(positions, fastestLapCarId){
  // positions: array of carIds in finish order
  const points = new Map();
  positions.forEach((id, idx)=>{
    const p = F1_POINTS[idx]||0; points.set(id, p);
  });
  if(fastestLapCarId){
    const pos = positions.indexOf(fastestLapCarId);
    if(pos>=0 && pos<10){ points.set(fastestLapCarId, (points.get(fastestLapCarId)||0)+FASTEST_LAP_BONUS); }
  }
  return points;
}

export function updateChampionshipStandings(standings, raceResult){
  const pts = computeRacePoints(raceResult.order, raceResult.fastestLap.carId);
  for(const id of raceResult.order){
    if(!standings[id]) standings[id] = { points:0, finishes:[] };
    standings[id].points += pts.get(id)||0;
    standings[id].finishes.push(raceResult.order.indexOf(id)+1);
  }
  return standings;
}

/**
 * Run a race event
 * @param {{playerCar:any, track:any, tier:any, rngSeed:number, forecast?:any[], noDNFs?:boolean, forceWeatherState?:string|null, aiDifficultyOffset?:number}} opts
 */
export function runRaceEvent(opts){
  const rng = new RNG(opts.rngSeed||123456);
  const forecast = opts.forecast || generateWeatherTimeline(opts.track, rng);
  const grid = [];
  // player car clone with id 'player'
  const pCar = structuredClone(opts.playerCar);
  pCar.id = 'player';
  grid.push(pCar);
  for(let i=0;i<11;i++) grid.push(generateAICarForTier(opts.tier, rng, i));

  // pre-derive
  const derived = new Map(grid.map(c=>[c.id, recomputeCarDerived(c)]));

  // Race accumulation
  const timesMs = new Map(grid.map(c=>[c.id, 0]));
  const fastestLap = { carId:null, lapMs:Infinity };
  let scApplied = false;

  for(const seg of forecast){
    const w = applyWeatherModifiers(null, seg);
    // SC chance
    const scRoll = rng.float();
    const hasSC = !scApplied && (scRoll < scChanceFor(opts.track, seg));
    if(hasSC) scApplied = true;

    for(const car of grid){
      const d = derived.get(car.id);
      // pace model factors
      const fTop = (220 / Math.max(120, d.topSpeedKph));
      const fAccel = (8.0 / Math.max(3.5, d.zeroTo100));
      const fCorner = 1.0 / Math.max(0.6, d.handlingIndex);
      const fBrake = 1.0 / Math.max(0.6, d.brakingIndex);
      const weatherMult = 1.0/(w.gripMult * (seg.state==='windy'?1.02:1));
      const baseLap = opts.track.baseLap;
      let lapMs = baseLap * fTop * (1.1 - 0.15*fAccel) * (0.9 + 0.3*fCorner) * (0.95 + 0.2*fBrake) * weatherMult;
      // luck ± within tier band
      const tierLuck = 0.02; // simplified
      lapMs *= (1 + (rng.float()*2-1)*tierLuck);

      // reliability DNF chance
      const dnf = !opts.noDNFs && (rng.float() > d.reliability);
      if(dnf){
        timesMs.set(car.id, timesMs.get(car.id) + lapMs + 120000); // penalty as if pit+issue
      }else{
        // SC compress gaps
        if(hasSC) lapMs *= 0.92;
        timesMs.set(car.id, timesMs.get(car.id) + lapMs);
        if(lapMs < fastestLap.lapMs){ fastestLap.carId = car.id; fastestLap.lapMs = lapMs; }
      }
    }
  }

  // Order by time
  const order = [...timesMs.entries()].sort((a,b)=>a[1]-b[1]).map(([id])=>id);
  const perCar = Object.fromEntries([...derived.entries()].map(([id,d])=>[id,{
    speed:(220/Math.max(120,d.topSpeedKph)), accel:(8/Math.max(3.5,d.zeroTo100)), corner:1/Math.max(0.6,d.handlingIndex), brake:1/Math.max(0.6,d.brakingIndex)
  }]));
  return { order, times:Object.fromEntries(timesMs), fastestLap:{...fastestLap}, forecast, perCar, points: computeRacePoints(order, fastestLap.carId) };
}

