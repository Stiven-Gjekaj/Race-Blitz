// Tracks catalog with weather biases

/** @type {import('./types').Track[]} */
export const TRACKS = [
  { id:'azure_street', name:'Azure Street', baseLap:93000,
    cornerMix:{slow:0.5,medium:0.35,fast:0.15}, surfaceGrip:0.94, bumps:0.7, camber:0.1, street:true,
    weatherBias:{ start:[['light_rain',3],['dry',2],['wetting',1]], trans:{
      dry:[['dry',6],['hot',2],['windy',2],['light_rain',1]],
      light_rain:[['light_rain',4],['heavy_rain',1],['drying',2],['wetting',2]],
      heavy_rain:[['heavy_rain',3],['light_rain',4],['wetting',2]],
      drying:[['drying',3],['dry',5]], wetting:[['wetting',3],['light_rain',5]],
      hot:[['dry',5],['hot',3]], cold:[['cold',4],['dry',5]], windy:[['windy',3],['dry',6]]
    }}, scBaseline:0.18 },
  { id:'solstice_desert', name:'Solstice Desert', baseLap:88000,
    cornerMix:{slow:0.2,medium:0.5,fast:0.3}, surfaceGrip:0.98, bumps:0.3, camber:0.2, street:false,
    weatherBias:{ start:[['hot',4],['dry',6]], trans:{
      dry:[['dry',7],['hot',3],['windy',1]], hot:[['hot',4],['dry',6]],
      light_rain:[['dry',6],['drying',3]], heavy_rain:[['light_rain',6]], drying:[['dry',8]],
      wetting:[['light_rain',6]], cold:[['dry',6]], windy:[['dry',6],['windy',3]]
    }}, scBaseline:0.06 },
  { id:'gale_coast', name:'Gale Coast', baseLap:91000,
    cornerMix:{slow:0.25,medium:0.45,fast:0.30}, surfaceGrip:0.96, bumps:0.4, camber:0.2, street:false,
    weatherBias:{ start:[['windy',4],['dry',6]], trans:{
      dry:[['dry',6],['windy',4]], windy:[['windy',4],['dry',5],['light_rain',1]],
      light_rain:[['dry',4],['drying',3],['light_rain',3]]
    }}, scBaseline:0.10 },
  { id:'atlas_gp', name:'Atlas GP', baseLap:90000,
    cornerMix:{slow:0.3,medium:0.4,fast:0.3}, surfaceGrip:1.0, bumps:0.2, camber:0.3, street:false,
    weatherBias:{ start:[['dry',8],['windy',1],['cold',1]], trans:{
      dry:[['dry',8],['windy',1],['light_rain',1]], cold:[['dry',6],['cold',4]], windy:[['dry',7],['windy',3]]
    }}, scBaseline:0.08 },
  { id:'nightfall_ring', name:'Nightfall Ring', baseLap:112000,
    cornerMix:{slow:0.2,medium:0.35,fast:0.45}, surfaceGrip:0.99, bumps:0.3, camber:0.2, street:false,
    weatherBias:{ start:[['cold',4],['dry',6]], trans:{
      dry:[['dry',7],['cold',3]], cold:[['cold',4],['dry',6]]
    }}, scBaseline:0.09 },
  { id:'sequoia_park', name:'Sequoia Park', baseLap:104000,
    cornerMix:{slow:0.35,medium:0.45,fast:0.20}, surfaceGrip:0.95, bumps:0.5, camber:0.1, street:true,
    weatherBias:{ start:[['dry',7],['light_rain',2],['windy',1]], trans:{
      dry:[['dry',7],['light_rain',1],['windy',2]], light_rain:[['light_rain',4],['drying',3],['dry',3]]
    }}, scBaseline:0.12 }
];

export function trackById(id){ return TRACKS.find(t=>t.id===id); }

