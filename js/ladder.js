// Ladder tiers

/** @type {import('./types').Championship[]} */
export const LADDER = [
  { id:'rookie', name:'Rookie Cup', entryFee:250, prizeTable:[600,450,350,300,250,200,150,120,100,80,60,40], events:3, aiSeedMin:80, aiSeedMax:100 },
  { id:'regional', name:'Regional Series', entryFee:500, prizeTable:[900,700,550,450,350,300,260,220,180,140,100,80], events:3, aiSeedMin:95, aiSeedMax:115 },
  { id:'national', name:'National Tour', entryFee:900, prizeTable:[1400,1100,900,700,600,500,420,360,300,240,180,120], events:4, aiSeedMin:110, aiSeedMax:130 },
  { id:'continental', name:'Continental Trophy', entryFee:1500, prizeTable:[2200,1800,1500,1200,1000,850,720,600,500,420,340,260], events:4, aiSeedMin:125, aiSeedMax:150 },
  { id:'world', name:'World Masters', entryFee:2500, prizeTable:[3600,3000,2500,2000,1600,1300,1100,900,750,600,480,360], events:5, aiSeedMin:145, aiSeedMax:175 },
  { id:'legends', name:'Legends Arena', entryFee:5000, prizeTable:[7000,5800,4800,3800,3200,2700,2300,1900,1600,1300,1050,850], events:24, aiSeedMin:170, aiSeedMax:210 }
];

export function tierByIndex(idx){ return LADDER[idx] || LADDER[0]; }

