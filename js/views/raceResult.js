import { h, fmt } from '../ui.js';
import { getState, setState } from '../state.js';
import { updateChampionshipStandings } from '../sim.js';
import { awardPrize } from '../economy.js';
import { LADDER } from '../ladder.js';

export function renderRaceResult(){
  const s = getState();
  const rr = s.temp?.raceResult;
  if(!rr) return h('div',{class:'card'}, h('h3',{},'No Race Results'), h('div',{class:'muted'},'Start a race from Championships.'));
  const rows = rr.order.map((id,idx)=> h('tr',{}, h('td',{}, 'P'+(idx+1)), h('td',{}, rr.names?.[id]||id), h('td',{}, fmt.time(rr.times[id]||0)), h('td',{}, rr.fastestLap.carId===id?'FL':''), h('td',{}, rr.points.get? (rr.points.get(id)||0) : (rr.points[id]||0))));
  const hdr = h('div',{class:'flex'}, h('div',{}, h('strong',{},'Weather:'), ' ', rr.forecast.map(s=>s.state).slice(0,6).join(' → ')), h('div',{}, h('strong',{},'Fastest Lap: '), rr.fastestLap.carId||'-', ' ', rr.fastestLap.lapMs? fmt.time(rr.fastestLap.lapMs) : ''));
  const updateBtn = h('button',{class:'btn', onclick:()=>applyStandings(rr)}, 'Update Championship Standings');
  const backBtn = h('button',{class:'btn btn-ghost', onclick:()=>{ const s=getState(); delete s.temp.raceResult; setState(s); location.hash='#championships'; }}, 'Back to Championships');
  return h('div',{class:'grid'},
    h('div',{class:'card'}, h('h3',{},'Race Result'), hdr, h('div',{class:'table-wrapper'}, h('table',{class:'table'}, h('thead',{}, h('tr',{}, h('th',{},'#'), h('th',{},'Car'), h('th',{},'Time'), h('th',{},'Badge'), h('th',{},'Pts'))), h('tbody',{}, ...rows)))),
    h('div',{class:'card'}, h('h3',{},'Actions'), h('div',{class:'flex'}, updateBtn, backBtn)),
    h('div',{class:'card'}, h('h3',{},'Why (contributions)'), h('div',{class:'muted'}, 'Speed/Accel/Corner/Brake factors influenced finishing times.')));
}

function applyStandings(rr){
  const s = getState();
  s.championship.standings = updateChampionshipStandings(s.championship.standings||{}, rr);
  // Award prize to player based on finishing position
  const tier = s.catalog.ladder[s.player.ladderTier];
  const pos = rr.order.indexOf('player');
  if(pos>-1){ const prize = tier.prizeTable[pos]||0; if(prize>0) awardPrize(prize); }
  // Season progression
  if(!s.championship.active){ s.championship.active = { tierIdx:s.player.ladderTier, racesCompleted:0, total:tier.events }; }
  s.championship.active.racesCompleted += 1;
  const finished = s.championship.active.racesCompleted >= tier.events;
  if(finished){
    s.championship.history.push({ tierIdx:s.player.ladderTier, standings: s.championship.standings, finishedAt:Date.now() });
    s.championship.standings = {};
    s.championship.active = null;
    if(s.player.ladderTier < s.catalog.ladder.length-1) s.player.ladderTier += 1;
    delete s.temp.raceResult;
    setState(s);
    alert('Season finished! Advancing ladder tier.');
    location.hash = '#championships';
    return;
  }
  setState(s);
  alert('Standings updated. Prize awarded if applicable.');
}

