// Derived stats and tunable validation

// Global constants
export const AIR_DENSITY = 1.225;
export const DRIVETRAIN_LOSS_RANGE = [0.12,0.18];
export const F1_POINTS = [25,18,15,12,10,8,6,4,2,1];
export const FASTEST_LAP_BONUS = 1;
export const PIT_LOSS_RANGE_SEC = [19,24];
export const SAFETY_CAR_PIT_DISCOUNT_SEC = 8;
export const LUCK_RANGE_BY_TIER = {
  Rookie:0.03, Regional:0.025, National:0.022, Continental:0.018, World:0.015, Legends:0.012
};

import { byId as partById } from './parts.js';

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

export function validateTunables(car){
  const tx = car.parts.transmission && partById(car.parts.transmission.id);
  const out = { ok:true, issues:[] };
  if(tx && tx.stats?.gearCount){
    const r = car.tunables.gearRatios || tx.tunables?.gearRatios || [];
    if(r.length !== tx.stats.gearCount){ out.ok=false; out.issues.push('Gear ratios length mismatch'); }
    const ranges = [ [3.0,4.0],[2.0,3.0],[1.4,2.2],[1.1,1.8] ];
    for(let i=0;i<r.length;i++){
      const [lo,hi] = (i<4)?ranges[i]:[0.7,1.5];
      if(r[i]<lo || r[i]>hi){ out.ok=false; out.issues.push(`Gear ${i+1} out of range (${lo}-${hi})`); }
    }
  }
  if(car.tunables.finalDrive && (car.tunables.finalDrive<2.8 || car.tunables.finalDrive>4.2)){
    out.ok=false; out.issues.push('Final drive out of range (2.8-4.2)');
  }
  if(Number.isInteger(car.tunables.wingAngle)===false || car.tunables.wingAngle<0 || car.tunables.wingAngle>15){ out.ok=false; out.issues.push('Wing angle 0-15'); }
  if(car.tunables.tirePressurePsi<24 || car.tunables.tirePressurePsi>38){ out.ok=false; out.issues.push('Tire pressure 24-38 PSI'); }
  if(car.tunables.springRate<20 || car.tunables.springRate>60){ out.ok=false; out.issues.push('Spring rate 20-60'); }
  if(car.tunables.damperSetting<1 || car.tunables.damperSetting>10){ out.ok=false; out.issues.push('Damper 1-10'); }
  return out;
}

export function recomputeCarDerived(car){
  // base from chassis
  let mass = car.base.chassisMassKg;
  let Cd = car.base.baseCd;
  let A = car.base.frontalAreaM2;
  let down100 = 0;
  let powerKw = 0, torqueNm = 0, redline = 6500;
  let gripDelta = 0, brakeDelta = 0, effDelta = 0, relDelta=0, coolDelta=0, dragDelta=0;
  // accumulate parts
  for(const [cat, part] of Object.entries(car.parts)){
    if(!part) continue; // safety
    mass += part.massKg || 0;
    const st = part.stats || {};
    if(cat==='engine'){
      powerKw += st.peakPowerKw||0; torqueNm += st.peakTorqueNm||0; redline = st.redlineRpm||redline;
    }
    if(cat==='intake'||cat==='exhaust'||cat==='ecu'){
      powerKw += st.peakPowerKw||0; torqueNm += st.peakTorqueNm||0;
    }
    if(cat==='aero'){
      dragDelta += st.dragCoefficientDelta||0; A += st.frontalAreaDeltaM2||0; down100 += st.downforceNAt100Kph||0;
    }
    if(cat==='tires') gripDelta += st.gripCoefficientDelta||0;
    if(cat==='brakes') brakeDelta += st.brakeForceDelta||0;
    relDelta += st.reliabilityDelta||0;
    coolDelta += st.coolingCapacityDelta||0;
    effDelta += st.fuelEfficiencyDelta||0;
  }
  Cd = Math.max(0.2, Cd + dragDelta + (car.tunables.wingAngle||0) * 0.001);
  const drivelineLoss = 0.15; // deterministic within 12-18%
  const wheelPowerKw = Math.max(0, powerKw * (1 - drivelineLoss));

  // top speed solve where P = 0.5*rho*Cd*A*v^3
  // Convert kW to W, v in m/s
  const Pw = wheelPowerKw * 1000;
  const k = 0.5 * AIR_DENSITY * Cd * A;
  let v = 10; // m/s
  for(let i=0;i<40;i++){
    const f = k*v*v*v - Pw; // want 0
    const df = 3*k*v*v;
    v = Math.max(1, v - f/Math.max(1e-6,df));
  }
  const topSpeedKph = v * 3.6;

  // 0-100 estimation: traction then power limited
  const g = 9.81;
  const baseGrip = 1.0 + gripDelta + (down100/ (mass*g)) * 0.2; // simplistic
  const tractionAccel = baseGrip * g * 0.6; // drive distribution
  const tractionTime = Math.sqrt((2*27.78)/Math.max(0.1, tractionAccel)); // s to 100 km/h if traction-only
  const powerAccelTime = ( (mass* (27.78**2)) / (2*Pw) ); // s assuming constant power
  const zeroTo100 = Math.max(3.0, 0.55*tractionTime + 0.55*powerAccelTime);

  // handling & braking
  const handlingIndex = clamp( (1.0 + gripDelta + (down100/1000) - (mass-1100)/1200), 0.2, 2.0 );
  const brakingIndex = clamp( (1.0 + brakeDelta + gripDelta) / (mass/1200), 0.2, 2.0 );

  // reliability and efficiency
  let reliability = clamp(0.92 + relDelta + coolDelta - Math.max(0, (redline-7000)/5000)*0.03, 0.6, 0.99);
  let efficiency = clamp(0.5 + effDelta - (Cd*A-0.6)*0.2, 0, 1);

  // performance composite
  const normTop = clamp((topSpeedKph-140)/120, 0, 1);
  const normAccel = clamp((10/zeroTo100), 0, 1);
  const perf = 0.35*normTop + 0.30*normAccel + 0.2*handlingIndex + 0.15*brakingIndex;

  const derived = {
    massKg:Math.round(mass), powerKw:Math.round(powerKw), torqueNm:Math.round(torqueNm), redlineRpm:redline,
    topSpeedKph:Math.round(topSpeedKph), zeroTo100:+zeroTo100.toFixed(2),
    handlingIndex:+handlingIndex.toFixed(3), brakingIndex:+brakingIndex.toFixed(3),
    aero:{ Cd:+Cd.toFixed(3), A:+A.toFixed(3), downforceAt100:Math.round(down100) },
    reliability:+reliability.toFixed(3), efficiency:+efficiency.toFixed(3), performanceScore:+perf.toFixed(3)
  };

  derived.warnings = computeWarnings(car, derived);
  return derived;
}

export function explainDerived(car){
  const d = recomputeCarDerived(car);
  return {
    Cd:d.aero.Cd, A:d.aero.A, down100:d.aero.downforceAt100,
    mass:d.massKg, power:d.powerKw, top:d.topSpeedKph, accel0_100:d.zeroTo100,
    handling:d.handlingIndex, braking:d.brakingIndex, reliability:d.reliability, efficiency:d.efficiency
  };
}

function computeWarnings(car, derived){
  const warn = { overheatingRisk:false, gearingMismatch:false, slicksInRain:false, dragHeavy:false };
  // Overheating: low cooling, high redline
  const cooling = (car.parts.cooling?.stats?.coolingCapacityDelta||0);
  warn.overheatingRisk = cooling < 0.02 && derived.redlineRpm >= 6800;
  // Gearing mismatch: rough check using top gear theoretical speed
  const tx = car.parts.transmission;
  if(tx){
    const ratios = car.tunables.gearRatios || tx.tunables?.gearRatios || [];
    const top = ratios[ratios.length-1]||1.0;
    const fd = car.tunables.finalDrive || tx.stats?.finalDrive || 3.7;
    const tireCirc = 2.0; // m (very rough)
    const redlineRps = derived.redlineRpm/60;
    const theoTop = (tireCirc * redlineRps) / (top*fd) * 3.6; // km/h
    const diff = Math.abs(theoTop - derived.topSpeedKph) / derived.topSpeedKph;
    warn.gearingMismatch = diff > 0.18; // 18%
  }
  warn.slicksInRain = (car.parts.tires?.id==='ti_slick'); // forecast considered in view logic
  warn.dragHeavy = (derived.aero.Cd*derived.aero.A) > 0.8;
  return warn;
}

