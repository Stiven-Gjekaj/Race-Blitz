// Parts catalog

/**
 * @typedef {"engine"|"intake"|"exhaust"|"ecu"|"transmission"|"differential"|"suspension"|"brakes"|"tires"|"aero"|"body"|"fuel"|"cooling"} PartCategory
 */

/** @type {Array<import('./types').Part>} */
const PARTS = [
  // Engines
  { id:'eng_i4_14_na', name:'I4 1.4 NA', category:'engine', price:1200, massKg:95,
    stats:{ peakPowerKw:62, peakTorqueNm:120, redlineRpm:6500 } },
  { id:'eng_i4_18_t', name:'I4 1.8 Turbo', category:'engine', price:2800, massKg:115,
    stats:{ peakPowerKw:125, peakTorqueNm:240, redlineRpm:6800 } },
  { id:'eng_v6_30_tt', name:'V6 3.0 TT', category:'engine', price:5200, massKg:165,
    stats:{ peakPowerKw:250, peakTorqueNm:420, redlineRpm:7000 } },
  { id:'eng_v8_50_na', name:'V8 5.0 NA', category:'engine', price:7800, massKg:185,
    stats:{ peakPowerKw:310, peakTorqueNm:500, redlineRpm:6900 } },

  // Transmissions
  { id:'tx_5m_basic', name:'5M Basic', category:'transmission', price:900, massKg:45,
    stats:{ gearCount:5, shiftTimeMs:450, finalDrive:3.9 },
    tunables:{ gearRatios:[3.50,2.10,1.45,1.15,0.90] } },
  { id:'tx_6m_sport', name:'6M Sport', category:'transmission', price:2200, massKg:42,
    stats:{ gearCount:6, shiftTimeMs:350, finalDrive:3.7 },
    tunables:{ gearRatios:[3.20,2.05,1.60,1.28,1.05,0.88] } },
  { id:'tx_7_dct', name:'7 DCT', category:'transmission', price:4200, massKg:40,
    stats:{ gearCount:7, shiftTimeMs:120, finalDrive:3.4 },
    tunables:{ gearRatios:[3.00,2.10,1.70,1.40,1.18,1.00,0.82] } },

  // Differential
  { id:'diff_open', name:'Open Differential', category:'differential', price:200, massKg:18,
    stats:{} },
  { id:'diff_lsd', name:'LSD Differential', category:'differential', price:1200, massKg:20,
    stats:{ gripCoefficientDelta:0.03 } },
  { id:'diff_active', name:'Active Differential', category:'differential', price:2400, massKg:22,
    stats:{ gripCoefficientDelta:0.05, reliabilityDelta:-0.02 } },

  // Suspension
  { id:'sus_comfort', name:'Comfort Suspension', category:'suspension', price:250, massKg:25,
    stats:{ gripCoefficientDelta:-0.03 } },
  { id:'sus_sport', name:'Sport Suspension', category:'suspension', price:900, massKg:28,
    stats:{ gripCoefficientDelta:0.03 } },
  { id:'sus_race', name:'Race Suspension', category:'suspension', price:2100, massKg:28,
    stats:{ gripCoefficientDelta:0.06, reliabilityDelta:-0.01 } },

  // Brakes
  { id:'brk_vent', name:'Ventilated Brakes', category:'brakes', price:300, massKg:16,
    stats:{ brakeForceDelta:0.00 } },
  { id:'brk_perf', name:'Performance Brakes', category:'brakes', price:1000, massKg:16,
    stats:{ brakeForceDelta:0.05 } },
  { id:'brk_carbon', name:'Carbon Brakes', category:'brakes', price:2400, massKg:15,
    stats:{ brakeForceDelta:0.10 } },

  // Tires
  { id:'ti_eco', name:'Eco Tires', category:'tires', price:200, massKg:0,
    stats:{ gripCoefficientDelta:-0.06, fuelEfficiencyDelta:0.04 }, weatherAffinity:['dry'] },
  { id:'ti_sport', name:'Sport Tires', category:'tires', price:700, massKg:0,
    stats:{ gripCoefficientDelta:0.05 }, weatherAffinity:['dry','hot','windy'] },
  { id:'ti_slick', name:'Slick Tires', category:'tires', price:1200, massKg:0,
    stats:{ gripCoefficientDelta:0.10, reliabilityDelta:-0.02 }, weatherAffinity:['dry','hot','windy'] },
  { id:'ti_inter', name:'Intermediate Tires', category:'tires', price:900, massKg:0,
    stats:{ gripCoefficientDelta:-0.02 }, weatherAffinity:['light_rain','drying'] },
  { id:'ti_wet', name:'Wet Tires', category:'tires', price:1000, massKg:0,
    stats:{ gripCoefficientDelta:-0.08, reliabilityDelta:0.02 }, weatherAffinity:['heavy_rain','wetting'] },

  // Aero
  { id:'aero_splitter', name:'Front Splitter', category:'aero', price:600, massKg:6,
    stats:{ downforceNAt100Kph:150, dragCoefficientDelta:0.01 } },
  { id:'aero_wing', name:'Adjustable Wing', category:'aero', price:1400, massKg:9,
    stats:{ downforceNAt100Kph:250, dragCoefficientDelta:0.015 }, tunables:{ wingAngle:6 } },
  { id:'aero_stream', name:'Streamline Kit', category:'aero', price:1600, massKg:4,
    stats:{ dragCoefficientDelta:-0.02 } },

  // Body
  { id:'body_wr1', name:'Weight Reduction 1', category:'body', price:1200, massKg:-30,
    stats:{} },
  { id:'body_wr2', name:'Weight Reduction 2', category:'body', price:2400, massKg:-45,
    stats:{ reliabilityDelta:-0.01 } },

  // Intake/Exhaust/ECU
  { id:'intake_basic', name:'High-Flow Intake', category:'intake', price:250, massKg:2,
    stats:{ peakPowerKw:5, peakTorqueNm:6 } },
  { id:'exhaust_sport', name:'Sport Exhaust', category:'exhaust', price:400, massKg:3,
    stats:{ peakPowerKw:7, peakTorqueNm:8 } },
  { id:'ecu_basic', name:'ECU v1', category:'ecu', price:300, massKg:1,
    stats:{} },

  // Fuel
  { id:'fuel_std', name:'Standard Fuel', category:'fuel', price:0, massKg:0, stats:{} },
  { id:'fuel_high', name:'High-Flow Fuel', category:'fuel', price:200, massKg:0, stats:{ fuelEfficiencyDelta:-0.02 } },

  // Cooling
  { id:'cool_std', name:'Standard Cooling', category:'cooling', price:0, massKg:6, stats:{} },
  { id:'cool_high', name:'High-cap Cooling', category:'cooling', price:500, massKg:8, stats:{ coolingCapacityDelta:0.05, reliabilityDelta:0.02 } },
];

export function allParts(){ return PARTS.slice(); }
export function byId(id){ return PARTS.find(p=>p.id===id); }
export function partsByCategory(cat){ return PARTS.filter(p=>p.category===cat); }

