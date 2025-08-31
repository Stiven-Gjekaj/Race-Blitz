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
  { id:'eng_i4_22_na', name:'I4 2.2 NA', category:'engine', price:3600, massKg:130,
    stats:{ peakPowerKw:140, peakTorqueNm:210, redlineRpm:7000 } },
  { id:'eng_v6_35_na', name:'V6 3.5 NA', category:'engine', price:6400, massKg:170,
    stats:{ peakPowerKw:225, peakTorqueNm:360, redlineRpm:7200 } },

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
  { id:'tx_6m_close', name:'6M Close-Ratio', category:'transmission', price:2600, massKg:41,
    stats:{ gearCount:6, shiftTimeMs:320, finalDrive:3.9 },
    tunables:{ gearRatios:[3.40,2.20,1.70,1.38,1.15,0.95] } },
  { id:'tx_8_dct_pro', name:'8 DCT Pro', category:'transmission', price:5600, massKg:39,
    stats:{ gearCount:8, shiftTimeMs:100, finalDrive:3.3 },
    tunables:{ gearRatios:[3.10,2.30,1.85,1.55,1.30,1.10,0.95,0.80] } },

  // Differential
  { id:'diff_open', name:'Open Differential', category:'differential', price:200, massKg:18,
    stats:{} },
  { id:'diff_lsd', name:'LSD Differential', category:'differential', price:1200, massKg:20,
    stats:{ gripCoefficientDelta:0.03 } },
  { id:'diff_active', name:'Active Differential', category:'differential', price:2400, massKg:22,
    stats:{ gripCoefficientDelta:0.05, reliabilityDelta:-0.02 } },
  { id:'diff_torsen', name:'Torsen Differential', category:'differential', price:1600, massKg:21,
    stats:{ gripCoefficientDelta:0.04 } },
  { id:'diff_locked', name:'Locked Differential (Track)', category:'differential', price:600, massKg:22,
    stats:{ gripCoefficientDelta:0.02, reliabilityDelta:-0.03 } },

  // Suspension
  { id:'sus_comfort', name:'Comfort Suspension', category:'suspension', price:250, massKg:25,
    stats:{ gripCoefficientDelta:-0.03 } },
  { id:'sus_sport', name:'Sport Suspension', category:'suspension', price:900, massKg:28,
    stats:{ gripCoefficientDelta:0.03 } },
  { id:'sus_race', name:'Race Suspension', category:'suspension', price:2100, massKg:28,
    stats:{ gripCoefficientDelta:0.06, reliabilityDelta:-0.01 } },
  { id:'sus_gt', name:'GT Suspension', category:'suspension', price:1100, massKg:28,
    stats:{ gripCoefficientDelta:0.02, reliabilityDelta:0.01 } },
  { id:'sus_track', name:'Track Suspension', category:'suspension', price:1500, massKg:27,
    stats:{ gripCoefficientDelta:0.05, reliabilityDelta:-0.005 } },

  // Brakes
  { id:'brk_vent', name:'Ventilated Brakes', category:'brakes', price:300, massKg:16,
    stats:{ brakeForceDelta:0.00 } },
  { id:'brk_perf', name:'Performance Brakes', category:'brakes', price:1000, massKg:16,
    stats:{ brakeForceDelta:0.05 } },
  { id:'brk_carbon', name:'Carbon Brakes', category:'brakes', price:2400, massKg:15,
    stats:{ brakeForceDelta:0.10 } },
  { id:'brk_endurance', name:'Endurance Brakes', category:'brakes', price:1500, massKg:16,
    stats:{ brakeForceDelta:0.08, reliabilityDelta:0.01 } },
  { id:'brk_ccm', name:'Ceramic Composite Brakes', category:'brakes', price:3200, massKg:14,
    stats:{ brakeForceDelta:0.13 } },

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
  { id:'aero_gtwing_pro', name:'GT Wing Pro', category:'aero', price:2000, massKg:10,
    stats:{ downforceNAt100Kph:320, dragCoefficientDelta:0.02 }, tunables:{ wingAngle:8 } },
  { id:'aero_diffuser', name:'Rear Diffuser', category:'aero', price:900, massKg:5,
    stats:{ downforceNAt100Kph:180, dragCoefficientDelta:0.008 } },

  // Body
  { id:'body_wr1', name:'Weight Reduction 1', category:'body', price:1200, massKg:-30,
    stats:{} },
  { id:'body_wr2', name:'Weight Reduction 2', category:'body', price:2400, massKg:-45,
    stats:{ reliabilityDelta:-0.01 } },
  { id:'body_wr3', name:'Weight Reduction 3', category:'body', price:3600, massKg:-60,
    stats:{ reliabilityDelta:-0.015 } },
  { id:'body_carbon_hood', name:'Carbon Hood', category:'body', price:700, massKg:-10, stats:{} },
  { id:'body_light_panels', name:'Lightweight Panels', category:'body', price:1200, massKg:-20, stats:{ reliabilityDelta:-0.005 } },

  // Intake/Exhaust/ECU
  { id:'intake_basic', name:'High-Flow Intake', category:'intake', price:250, massKg:2,
    stats:{ peakPowerKw:5, peakTorqueNm:6 } },
  { id:'intake_cai', name:'Cold Air Intake', category:'intake', price:350, massKg:2, stats:{ peakPowerKw:7, peakTorqueNm:8 } },
  { id:'intake_ram', name:'Ram Air Intake', category:'intake', price:600, massKg:2, stats:{ peakPowerKw:10, peakTorqueNm:10 } },
  { id:'intake_manifold', name:'Performance Manifold', category:'intake', price:900, massKg:4, stats:{ peakPowerKw:12, peakTorqueNm:12 } },
  { id:'intake_race', name:'Race Intake', category:'intake', price:1200, massKg:5, stats:{ peakPowerKw:15, peakTorqueNm:14 } },
  { id:'exhaust_sport', name:'Sport Exhaust', category:'exhaust', price:400, massKg:3,
    stats:{ peakPowerKw:7, peakTorqueNm:8 } },
  { id:'exhaust_header', name:'Header Upgrade', category:'exhaust', price:700, massKg:3, stats:{ peakPowerKw:9, peakTorqueNm:10 } },
  { id:'exhaust_catback', name:'Cat-back System', category:'exhaust', price:450, massKg:3, stats:{ peakPowerKw:5, peakTorqueNm:5 } },
  { id:'exhaust_straight', name:'Straight Pipe (Track)', category:'exhaust', price:800, massKg:2, stats:{ peakPowerKw:12, peakTorqueNm:8, reliabilityDelta:-0.01 } },
  { id:'exhaust_race', name:'Race Exhaust', category:'exhaust', price:1200, massKg:2, stats:{ peakPowerKw:15, peakTorqueNm:12, reliabilityDelta:-0.015 } },
  { id:'ecu_basic', name:'ECU v1', category:'ecu', price:300, massKg:1,
    stats:{} },
  { id:'ecu_v2', name:'ECU v2', category:'ecu', price:450, massKg:1, stats:{ peakPowerKw:4, peakTorqueNm:5 } },
  { id:'ecu_v3', name:'ECU v3', category:'ecu', price:700, massKg:1, stats:{ peakPowerKw:7, peakTorqueNm:7 } },
  { id:'ecu_race', name:'ECU Race', category:'ecu', price:1100, massKg:1, stats:{ peakPowerKw:10, peakTorqueNm:10 } },
  { id:'ecu_eco', name:'ECU Eco Map', category:'ecu', price:400, massKg:1, stats:{ fuelEfficiencyDelta:0.03 } },

  // Fuel
  { id:'fuel_std', name:'Standard Fuel', category:'fuel', price:0, massKg:0, stats:{} },
  { id:'fuel_high', name:'High-Flow Fuel', category:'fuel', price:200, massKg:0, stats:{ fuelEfficiencyDelta:-0.02 } },
  { id:'fuel_premium', name:'Premium Fuel', category:'fuel', price:120, massKg:0, stats:{ fuelEfficiencyDelta:-0.01, reliabilityDelta:0.005 } },
  { id:'fuel_e85', name:'E85 Blend', category:'fuel', price:180, massKg:0, stats:{ fuelEfficiencyDelta:-0.03, reliabilityDelta:-0.005 } },
  { id:'fuel_race', name:'Race Fuel', category:'fuel', price:350, massKg:0, stats:{ fuelEfficiencyDelta:-0.04, reliabilityDelta:0.01 } },

  // Cooling
  { id:'cool_std', name:'Standard Cooling', category:'cooling', price:0, massKg:6, stats:{} },
  { id:'cool_high', name:'High-cap Cooling', category:'cooling', price:500, massKg:8, stats:{ coolingCapacityDelta:0.05, reliabilityDelta:0.02 } },
  { id:'cool_oil', name:'Oil Cooler', category:'cooling', price:350, massKg:5, stats:{ coolingCapacityDelta:0.03, reliabilityDelta:0.01 } },
  { id:'cool_radiator_pro', name:'Pro Radiator', category:'cooling', price:900, massKg:10, stats:{ coolingCapacityDelta:0.08, reliabilityDelta:0.02 } },
  { id:'cool_ducts', name:'Cooling Ducts', category:'cooling', price:200, massKg:2, stats:{ coolingCapacityDelta:0.02 } },
];

export function allParts(){ return PARTS.slice(); }
export function byId(id){ return PARTS.find(p=>p.id===id); }
export function partsByCategory(cat){ return PARTS.filter(p=>p.category===cat); }
