import { initRouter, currentRoute } from './router.js';
import { mount } from './ui.js';
import { loadOrSeed, mountRerender, getState, setState } from './state.js';
import { renderTopnav } from './views/topnav.js';
import { renderGarage } from './views/garage.js';
import { renderShop } from './views/shop.js';
import { renderTuner } from './views/tuner.js';
import { renderChampionships } from './views/championships.js';
import { renderRaceResult } from './views/raceResult.js';
import { renderLeaderboard } from './views/leaderboard.js';
import { renderSaveLoad } from './views/saveLoad.js';
import { renderDebug } from './views/debugView.js';
import { runRaceEvent } from './sim.js';
import { RNG } from './rng.js';
import { trackById } from './tracks.js';
import { getActiveCar } from './state.js';
import { payEntryFee } from './economy.js';

function render(){
  const top = document.getElementById('top');
  const app = document.getElementById('app');
  mount(top, renderTopnav());

  const hash = currentRoute();
  if(hash==='#garage') mount(app, renderGarage());
  else if(hash==='#shop') mount(app, renderShop());
  else if(hash==='#tuning') mount(app, renderTuner());
  else if(hash==='#championships'){
    // If there is a pending race request in sessionStorage, run it then render result
    const ctxRaw = sessionStorage.getItem('RB_NEXT_RACE_CTX');
    if(ctxRaw){
      sessionStorage.removeItem('RB_NEXT_RACE_CTX');
      try{
        const ctx = JSON.parse(ctxRaw);
        const s = getState();
        const tier = s.catalog.ladder[s.player.ladderTier];
        const track = trackById(ctx.trackId) || s.catalog.tracks[0];
        const rngSeed = (s.temp?.debug?.seed)||Date.now()%1e9;
        const fee = tier.entryFee||0; const ok = payEntryFee(fee); if(!ok.ok){ alert('Not enough money for entry fee.'); mount(app, renderChampionships()); return; }
        const rr = runRaceEvent({ playerCar:getActiveCar(), track, tier, rngSeed, forecast:ctx.forecast, noDNFs:s.temp?.debug?.noDNFs, forceWeatherState:null, aiDifficultyOffset:s.temp?.debug?.aiDifficulty||0 });
        s.temp.raceResult = rr; setState(s);
        mount(app, renderRaceResult());
        return;
      }catch{}
    }
    mount(app, renderChampionships());
  }
  else if(hash==='#leaderboard') mount(app, renderLeaderboard());
  else if(hash==='#saveload') mount(app, renderSaveLoad());
  else if(hash==='#debug') mount(app, renderDebug());
}

function boot(){
  const s = loadOrSeed();
  document.body.dataset.reducedMotion = s.settings.reducedMotion;
  document.body.dataset.contrast = s.settings.highContrast? 'high':'normal';
  mountRerender(render);
  // Keyboard Ctrl+`
  window.addEventListener('keydown', (e)=>{
    if(e.ctrlKey && e.key==='`'){
      const st = getState();
      if(!st.integrity.debugEverEnabled){
        st.integrity.debugEverEnabled = true; st.integrity.scoresDisabled = true; setState(st);
      }else{
        alert('Debug already enabled for this save. Scores disabled.');
      }
    }
  });
  initRouter(render);
}

boot();
