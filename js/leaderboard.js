import { getState } from './state.js';
import { canSubmitScores } from './integrity.js';

const KEY = 'RB_HISCORES_V1';

function load(){
  try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch{ return []; }
}
function save(x){ localStorage.setItem(KEY, JSON.stringify(x)); }

export function getScores(){ return load(); }

export function submitScore(profile){
  if(!canSubmitScores()) return { ok:false, reason:'scores_disabled' };
  const arr = load();
  arr.push({ ...profile, ts:Date.now() });
  arr.sort((a,b)=>b.points-a.points);
  if(arr.length>50) arr.length=50;
  save(arr);
  return { ok:true };
}

export function bannerIfDisabled(){
  if(!canSubmitScores()){
    return 'Scores disabled for this save (Debug used).';
  }
  return '';
}

