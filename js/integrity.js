// Integrity flags. Persisted via state/save.
import { getState, setState } from './state.js';

export function getIntegrity(){
  return getState().integrity;
}

export function markDebugEverEnabled(){
  const s = getState();
  s.integrity.debugEverEnabled = true;
  s.integrity.scoresDisabled = true;
  setState(s);
}

export function canSubmitScores(){
  return !getIntegrity().scoresDisabled;
}

