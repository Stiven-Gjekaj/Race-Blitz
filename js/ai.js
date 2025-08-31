// AI car generator
import { allParts, partsByCategory } from './parts.js';
import { recomputeCarDerived } from './stats.js';

export function generateAICarForTier(tier, rng, index=0){
  const budgetBase = 2000 + (tier.aiSeedMin||90)*8;
  const budget = budgetBase + rng.int(0, 1200);
  const philosophy = rng.int(0,2); // 0 power, 1 grip, 2 aero
  const car = baseChassis(`ai_${index}`);
  car.name = makeDriverName(rng);
  let money = budget;
  function pick(cat, pref){
    const opts = partsByCategory(cat).slice().sort((a,b)=>a.price-b.price);
    const choice = pref==='power'? opts[opts.length-1] : pref==='grip'? opts[Math.max(0,opts.length-2)] : opts[Math.min(opts.length-1,2)];
    if(choice && choice.price <= money){ money -= choice.price; car.parts[cat] = choice; }
  }
  pick('engine','power'); pick('transmission','power'); pick('differential','grip');
  pick('suspension','grip'); pick('brakes','grip'); pick('tires','grip');
  pick('aero','aero'); pick('body','aero'); pick('intake','power'); pick('exhaust','power');
  pick('ecu','power'); pick('fuel','power'); pick('cooling','aero');
  // basic tunables
  const tx = car.parts.transmission;
  car.tunables.gearRatios = tx?.tunables?.gearRatios?.slice()||[3.2,2.1,1.6,1.28,1.05];
  car.tunables.finalDrive = tx?.stats?.finalDrive||3.7;
  car.tunables.wingAngle = car.parts.aero?.tunables?.wingAngle ?? 4;
  car.tunables.tirePressurePsi = 28 + rng.int(-2,4);
  car.tunables.springRate = 36 + rng.int(-4,6);
  car.tunables.damperSetting = 5 + rng.int(-2,2);
  car.derived = recomputeCarDerived(car);
  return car;
}

function baseChassis(id){
  return {
    id, name:'AI Spec',
    base:{ chassisMassKg:1180, baseCd:0.32, frontalAreaM2:2.05, wheelbaseMm:2650 },
    parts:{},
    tunables:{ gearRatios:[], finalDrive:3.7, wingAngle:4, tirePressurePsi:30, springRate:35, damperSetting:5 }
  };
}

const FIRST = ['Alex','Liam','Noah','Mason','Ethan','Ava','Mia','Leo','Oscar','Felix','Sofia','Nina','Luca','Max','Oliver','Aiden','Mateo','Kai','Noel','Theo'];
const LAST = ['Reyes','Kovac','Ishikawa','Silva','Vargas','Petrov','Khan','Nguyen','Rossi','Schmidt','Dubois','Tanaka','Murphy','Nowak','Santos','Yamada','Kumar','Anders','Ibrahim','Lopez'];

function makeDriverName(rng){
  const f = FIRST[rng.int(0, FIRST.length-1)];
  const l = LAST[rng.int(0, LAST.length-1)];
  return `${f} ${l}`;
}
