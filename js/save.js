// Save/Load helpers
const KEY = 'RB_STATE_V1';

export function serializeState(state){
  const json = JSON.stringify(state);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for(const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export function deserializeState(s){
  try{
    const binary = atob(s);
    const bytes = Uint8Array.from(binary, c=>c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  }catch(e){
    console.warn('Failed to deserialize state', e);
    return null;
  }
}

export function load(){
  const raw = localStorage.getItem(KEY);
  if(!raw) return null;
  return deserializeState(raw);
}

export function save(state){
  try{ localStorage.setItem(KEY, serializeState(state)); }
  catch(e){ console.error('save failed', e); }
}

export function autosave(getter){
  // Save debounced
  let t;
  return function(){
    clearTimeout(t);
    t = setTimeout(()=>{ try{ save(getter()); }catch(e){} }, 100);
  }
}

export function hardReset(){
  localStorage.removeItem(KEY);
  location.reload();
}

export const STORAGE_KEY = KEY;

