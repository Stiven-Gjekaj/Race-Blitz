// Strategy helpers
import { PIT_LOSS_RANGE_SEC, SAFETY_CAR_PIT_DISCOUNT_SEC } from './stats.js';
import { RNG } from './rng.js';

export function recommendStrategy(car, forecast){
  // Very simple heuristic
  const states = forecast.map(s=>s.state);
  const hasHeavy = states.includes('heavy_rain');
  const hasLight = states.includes('light_rain')||states.includes('wetting');
  let compound = 'sport';
  if(hasHeavy) compound='wet';
  else if(hasLight) compound='intermediate';
  else if(states.includes('hot')) compound = 'slick';
  // planned stop if long race or temp extremes
  const stopSegment = (states.length>7 && compound==='slick')? Math.floor(states.length/2) : null;
  return { compound, stopSegment, rationale:`Forecast: ${[...new Set(states)].join(', ')}` };
}

export function simulateStint(car, compound, temp, durationSegments, rng){
  // Return time delta for pit and wear percentage
  let wear = 0;
  let paceDelta = 0; // seconds cumulative
  for(let i=0;i<durationSegments;i++){
    const tempBias = temp>30? 0.3 : temp<12? -0.1 : 0;
    const wearRate = compound==='slick'? (0.06+tempBias*0.05)
                    : compound==='intermediate'? 0.05
                    : compound==='wet'? 0.045
                    : compound==='sport'? 0.045
                    : 0.04;
    wear += wearRate*100;
    paceDelta += wearRate * 1.4; // seconds per segment from wear
  }
  return { pitLoss: rng.int(PIT_LOSS_RANGE_SEC[0], PIT_LOSS_RANGE_SEC[1]), wear: Math.min(100,wear), timeDeltaSec: paceDelta };
}

export function pitLossWithSC(baseLossSec, hasSC){
  return baseLossSec - (hasSC? SAFETY_CAR_PIT_DISCOUNT_SEC : 0);
}

