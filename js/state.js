// Global game state and seeding
import { load as loadSave, save as saveSave, autosave } from './save.js';
import { allParts, byId as partById } from './parts.js';
import { TRACKS } from './tracks.js';
import { LADDER } from './ladder.js';
import { recomputeCarDerived } from './stats.js';

let STATE = null;
const doAutosave = autosave(()=>STATE);

export function getState(){ return STATE; }
export function setState(s){ STATE = s; doAutosave(); renderIfMounted(); }

let rerenderHook = null;
export function mountRerender(fn){ rerenderHook = fn; }
function renderIfMounted(){ if(typeof rerenderHook==='function') rerenderHook(); }

export function seedInitial(){
  const starter = makeStarterCar();
  const s = {
    version:1,
    integrity:{ debugEverEnabled:false, scoresDisabled:false },
    settings:{ reducedMotion:false, highContrast:false },
    meta:{ starterNamed:false },
    player:{ money:2500, prestige:0, ladderTier:0, garage:[starter], inventory:[] },
    catalog:{ parts: allParts(), tracks: TRACKS, ladder: LADDER },
    temp:{},
    selectedCarId: starter.id,
    championship:{ active:null, standings:{}, history:[] }
  };
  return s;
}

function makeStarterCar(){
  const car = {
    id:'starter_s', name:'Starter S',
    base:{ chassisMassKg:1200, baseCd:0.32, frontalAreaM2:2.1, wheelbaseMm:2600 },
    parts:{
      engine: partById('eng_i4_14_na'), transmission: partById('tx_5m_basic'),
      differential: partById('diff_open'), suspension: partById('sus_comfort'),
      brakes: partById('brk_vent'), tires: partById('ti_eco'),
      aero: null, body: null, intake: null, exhaust: null, ecu: partById('ecu_basic'),
      fuel: partById('fuel_std'), cooling: partById('cool_std')
    },
    tunables:{ gearRatios:[3.50,2.10,1.45,1.15,0.90], finalDrive:3.9, wingAngle:0, tirePressurePsi:30, springRate:35, damperSetting:5 },
    derived:null
  };
  car.derived = recomputeCarDerived(car);
  return car;
}

export function loadOrSeed(){
  const loaded = loadSave();
  if(loaded){ STATE = loaded; }
  else { STATE = seedInitial(); saveSave(STATE); }
  // Recompute derived for all cars
  for(const car of STATE.player.garage){ car.derived = recomputeCarDerived(car); }
  return STATE;
}

export function getActiveCar(){
  const s = getState();
  return s.player.garage.find(c=>c.id===s.selectedCarId) || s.player.garage[0];
}

export function setActiveCar(id){ const s=getState(); s.selectedCarId=id; setState(s); }

export function updateCar(car){
  const s = getState();
  const idx = s.player.garage.findIndex(c=>c.id===car.id);
  if(idx!==-1) s.player.garage[idx] = car;
  setState(s);
}

export function addCarFromTemplate(name){
  const t = makeStarterCar(); t.id = `car_${Math.random().toString(36).slice(2,7)}`; t.name = name||'Custom';
  const s = getState(); s.player.garage.push(t); setState(s); return t;
}

export function removeCar(id){
  const s = getState(); const idx = s.player.garage.findIndex(c=>c.id===id);
  if(idx> -1){ s.player.garage.splice(idx,1); if(s.selectedCarId===id) s.selectedCarId = s.player.garage[0]?.id||null; setState(s);} }
