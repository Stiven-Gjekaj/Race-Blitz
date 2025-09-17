import { currentRoute } from '../router.js';
import { h, fmt } from '../ui.js';
import * as save from '../save.js';
import { getState } from '../state.js';

export function renderTopnav(){
  const r = currentRoute();
  const s = getState();
  const tabs = [
    ['#garage','home','Garage'],
    ['#shop','cart','Shop'],
    ['#championships','trophy','Championships'],
    ['#leaderboard','trophy','Leaderboard'],
    ['#saveload','save','Save/Load']
  ];
  if(s.integrity.debugEverEnabled) tabs.push(['#debug','debug','Debug']);

  const links = tabs.map(([href,icon,label])=>{
    const active = r===href;
    const classes = ['btn','tab-link'];
    if(!active) classes.push('btn-ghost');
    else classes.push('active');
    return h('a',{href, class: classes.join(' ')}, svg(icon), label);
  });

  const right = [
    h('span',{class:'credits'}, 'Made by Stiven Gjekaj'),
    h('span',{class:'badge ok'}, `Money ${fmt.money(s.player.money)}`),
    h('button',{class:'btn btn-danger', onclick:()=>save.hardReset()}, 'Hard Reset')
  ];
  if(s.integrity.debugEverEnabled) right.unshift(h('span',{class:'badge warn'}, 'DEBUG'));

  const brand = h('div',{class:'top-brand'}, h('h1',{class:'logo nes-text is-primary'}, 'Race Blitz'));

  return h('nav',{class:'topnav card'}, brand, h('div',{class:'tabs'}, ...links), h('div',{class:'top-actions'}, ...right));
}

function svg(name){
  const el = document.createElementNS('http://www.w3.org/2000/svg','svg');
  el.setAttribute('class','icon');
  el.innerHTML = `<use href="assets/icons.svg#${name}"></use>`;
  return el;
}

