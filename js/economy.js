import { getState, setState } from './state.js';

export function buyPart(part){
  const s = getState();
  if(s.player.money < part.price) return { ok:false, reason:'Insufficient funds' };
  s.player.money -= part.price;
  s.player.inventory.push(part);
  setState(s);
  return { ok:true };
}

export function sellPart(partId){
  const s = getState();
  const idx = s.player.inventory.findIndex(p=>p.id===partId);
  if(idx===-1) return { ok:false, reason:'Not owned' };
  const p = s.player.inventory[idx];
  s.player.inventory.splice(idx,1);
  s.player.money += Math.round(p.price*0.6);
  setState(s);
  return { ok:true };
}

export function payEntryFee(fee){
  const s = getState();
  if(s.player.money<fee) return { ok:false, reason:'Insufficient funds' };
  s.player.money -= fee; setState(s); return { ok:true };
}

export function awardPrize(amount){ const s=getState(); s.player.money+=amount; setState(s); }
export function awardPrestige(points){ const s=getState(); s.player.prestige+=points; setState(s); }

