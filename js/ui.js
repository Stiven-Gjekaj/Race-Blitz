// UI helpers

/** Create element with props and children */
export function h(tag, props={}, ...children){
  const el = document.createElement(tag);
  let deferValue, deferChecked;
  for(const [k,v] of Object.entries(props||{})){
    if(k === 'class') el.className = v;
    else if(k === 'dataset'){ Object.assign(el.dataset, v); }
    else if(k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if(k === 'value'){ deferValue = v; }
    else if(k === 'checked'){ deferChecked = v; }
    else if(v !== undefined && v !== null) el.setAttribute(k, v);
  }
  for(const c of children.flat()){
    if(c == null) continue;
    if(c instanceof Node) el.appendChild(c);
    else el.appendChild(document.createTextNode(String(c)));
  }
  if(deferValue !== undefined) el.value = deferValue;
  if(deferChecked !== undefined) el.checked = !!deferChecked;
  return el;
}

/** Mount into container (replace) */
export function mount(container, content){
  container.innerHTML = '';
  if(Array.isArray(content)) content.forEach(n=>container.appendChild(n));
  else if(content) container.appendChild(content);
}

/** Format helpers */
export const fmt = {
  money(n){ return `$${n.toLocaleString()}`;},
  perc(n){ return `${(n*100).toFixed(1)}%`;},
  time(ms){
    const s = ms/1000;
    const m = Math.floor(s/60);
    const r = s - m*60;
    return `${m}:${r.toFixed(3).padStart(6,'0')}`;
  }
}

export function svgIcon(name){
  const use = document.createElementNS('http://www.w3.org/2000/svg','svg');
  use.setAttribute('class','icon');
  use.innerHTML = `<use href="assets/icons.svg#${name}"></use>`;
  return use;
}
