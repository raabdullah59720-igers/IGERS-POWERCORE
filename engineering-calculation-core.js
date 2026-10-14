/* IGERS-BD-01 Engineering Calculation Core v1.0
 * One formula source for roadway, hydraulic, river-current, PV, battery, and FEAS models.
 * Reference basis: IGERS Master Energy Output & Revenue Analysis (2026), §§2-7, 13, 15-17,
 * plus IGERS-BD-01 Full Thesis Presentation (2026), formula-sheet appendix.
 * Calculations are assumption-based engineering estimates, not field telemetry or certification.
 */
(function (root) {
  'use strict';
  const G = 9.80665;
  const RHO_WATER = 1000;
  const BETZ_LIMIT = 16 / 27;
  const num = (value, name, lo, hi, integer = false) => {
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
      throw new RangeError(`${name} is required; blank inputs are not treated as zero.`);
    }
    const n = Number(value);
    if (!Number.isFinite(n) || n < lo || n > hi || (integer && !Number.isInteger(n))) {
      throw new RangeError(`${name} must be ${integer ? 'an integer ' : ''}between ${lo} and ${hi}.`);
    }
    return n;
  };
  const pct = (value, name) => num(value, name, 0, 100) / 100;
  const finite = (x) => Number.isFinite(x);

  function road(input) {
    const massKg = num(input.massKg, 'Vehicle mass (kg)', 0, 100000);
    const entryKph = num(input.entryKph, 'Entry speed (km/h)', 0, 300);
    const exitKph = num(input.exitKph, 'Exit speed (km/h)', 0, 300);
    const captureKJ = num(input.captureKJ, 'Mechanical capture per event (kJ)', 0, 100);
    const efficiency = pct(input.electricalEfficiencyPct, 'Electrical-chain efficiency (%)');
    const aadt = num(input.aadt, 'AADT / passages per day', 0, 5000000, true);
    const lengthKm = num(input.lengthKm, 'Corridor length (km)', 0, 100000);
    const pointsPerKm = num(input.pointsPerKm, 'Harvesting points per km', 0, 1000);
    const operatingDays = num(input.operatingDays, 'Operating days/year', 0, 366, true);
    const availability = pct(input.availabilityPct, 'System availability (%)');
    const auxiliaryWhPerEvent = num(input.auxiliaryWhPerEvent, 'Auxiliary electrical loss (Wh/event)', 0, 1000);
    const addedTractionKJ = num(input.addedTractionKJPerEvent ?? 0, 'Additional traction demand (kJ/event)', 0, 100);
    const drivetrainEfficiency = num(input.drivetrainEfficiencyPct ?? 25, 'Drivetrain efficiency (%)', 1, 100) / 100;
    if (exitKph > entryKph) throw new RangeError('Exit speed cannot exceed entry speed in this braking/kinetic-reduction case.');
    const v1 = entryKph / 3.6, v2 = exitKph / 3.6;
    const kineticReductionJ = 0.5 * massKg * Math.max(0, v1*v1 - v2*v2);
    const kineticReductionKJ = kineticReductionJ / 1000;
    if (captureKJ > kineticReductionKJ + 1e-9) {
      throw new RangeError(`Mechanical capture (${captureKJ.toFixed(3)} kJ/event) exceeds the calculated kinetic-reduction ceiling (${kineticReductionKJ.toFixed(3)} kJ/event). Check speed, vehicle class, or capture assumption.`);
    }
    if (captureKJ > 0 && kineticReductionKJ <= 0) throw new RangeError('A positive road capture assumption requires a positive entry-to-exit kinetic-energy reduction.');
    const grossElectricalWhPerEvent = captureKJ * efficiency / 3.6;
    const netElectricalWhPerEvent = grossElectricalWhPerEvent - auxiliaryWhPerEvent;
    const annualEventsInput = input.annualEvents === undefined || input.annualEvents === null ? null : num(input.annualEvents, 'Annual device-event count', 0, 1e13, true);
    const dailyPassageEvents = aadt * lengthKm * pointsPerKm;
    const effectiveAnnualEvents = (annualEventsInput === null ? dailyPassageEvents * operatingDays : annualEventsInput) * availability;
    const annualNetKWh = netElectricalWhPerEvent * effectiveAnnualEvents / 1000;
    const annualNetGWh = annualNetKWh / 1e6;
    const averageCalendarKW = annualNetKWh / 8760;
    const upstreamPropulsionKWh = addedTractionKJ / drivetrainEfficiency / 3600 * effectiveAnnualEvents;
    return {
      inputs: {massKg, entryKph, exitKph, captureKJ, electricalEfficiencyPct: efficiency*100, aadt, lengthKm, pointsPerKm, operatingDays, annualEvents:annualEventsInput, availabilityPct: availability*100, auxiliaryWhPerEvent, addedTractionKJPerEvent: addedTractionKJ, drivetrainEfficiencyPct: drivetrainEfficiency*100},
      kineticReductionJ, kineticReductionKJ,
      captureCeilingFraction: kineticReductionKJ > 0 ? captureKJ / kineticReductionKJ : 0,
      grossElectricalWhPerEvent, netElectricalWhPerEvent,
      dailyPassageEvents, effectiveAnnualEvents,
      annualNetKWh, annualNetGWh, averageCalendarKW,
      upstreamPropulsionKWh, upstreamPropulsionGWh: upstreamPropulsionKWh / 1e6,
      classification: 'SCENARIO_ESTIMATE_NOT_MEASURED'
    };
  }

  function hydraulic(input) {
    const densityKgM3 = num(input.densityKgM3 ?? RHO_WATER, 'Fluid density (kg/m³)', 900, 1300);
    const flowM3s = num(input.flowM3s, 'Hydraulic flow Q (m³/s)', 0, 100000);
    const netHeadM = num(input.netHeadM, 'Net hydraulic head H (m)', 0, 10000);
    const efficiency = pct(input.efficiencyPct, 'Hydraulic efficiency (%)');
    const operatingHours = num(input.operatingHours, 'Operating hours/year', 0, 8760);
    const powerW = densityKgM3 * G * flowM3s * netHeadM * efficiency;
    const powerKW = powerW / 1000;
    const annualKWh = powerKW * operatingHours;
    return {densityKgM3, flowM3s, netHeadM, efficiencyPct:efficiency*100, powerW, powerKW, operatingHours, annualKWh, annualMWh:annualKWh/1000, classification:'SCENARIO_ESTIMATE_NOT_MEASURED'};
  }

  function riverCurrent(input) {
    const rho = num(input.densityKgM3 ?? RHO_WATER, 'Water density (kg/m³)', 900, 1300);
    const areaM2 = num(input.sweptAreaM2, 'Swept area (m²)', 0, 1000000);
    const velocityMS = num(input.velocityMS, 'Current speed (m/s)', 0, 20);
    const cp = num(input.powerCoefficient, 'Power coefficient Cp', 0, BETZ_LIMIT);
    const efficiency = pct(input.generatorEfficiencyPct, 'Generator/electrical efficiency (%)');
    const capacityFactor = pct(input.capacityFactorPct, 'Capacity factor (%)');
    const powerW = 0.5 * rho * areaM2 * velocityMS**3 * cp * efficiency;
    const annualKWh = powerW * 8760 * capacityFactor / 1000;
    return {densityKgM3:rho, sweptAreaM2:areaM2, velocityMS, powerCoefficient:cp, generatorEfficiencyPct:efficiency*100, capacityFactorPct:capacityFactor*100, powerW, powerKW:powerW/1000, annualKWh, annualMWh:annualKWh/1000, annualGWh:annualKWh/1e6, classification:'SCENARIO_ESTIMATE_NOT_MEASURED'};
  }

  function wind(input) {
    const density = num(input.densityKgM3 ?? 1.225, 'Air density (kg/m³)', 0.5, 2.0);
    const areaM2 = num(input.sweptAreaM2, 'Wind swept area (m²)', 0, 1e7);
    const velocityMS = num(input.velocityMS, 'Wind speed (m/s)', 0, 120);
    const cp = num(input.powerCoefficient, 'Wind power coefficient Cp', 0, BETZ_LIMIT);
    const efficiency = pct(input.electricalEfficiencyPct, 'Wind electrical efficiency (%)');
    const operatingHours = num(input.operatingHours, 'Wind operating hours/year', 0, 8760);
    const powerW = 0.5 * density * areaM2 * velocityMS ** 3 * cp * efficiency;
    const powerKW = powerW / 1000;
    const annualKWh = powerKW * operatingHours;
    return {densityKgM3:density, sweptAreaM2:areaM2, velocityMS, powerCoefficient:cp, electricalEfficiencyPct:efficiency*100, operatingHours, powerW, powerKW, annualKWh, annualMWh:annualKWh/1000, classification:'SCENARIO_ESTIMATE_NOT_MEASURED'};
  }

  function solarFromIrradiance(input) {
    const irradianceWm2 = num(input.irradianceWm2, 'Instantaneous plane-of-array irradiance (W/m²)', 0, 1600);
    const panelAreaM2 = num(input.panelAreaM2, 'PV panel area (m²)', 0, 1e8);
    const moduleEfficiency = pct(input.moduleEfficiencyPct, 'PV module efficiency (%)');
    const systemDerate = pct(input.systemDeratePct, 'PV system derate (%)');
    const peakSunHoursPerDay = num(input.peakSunHoursPerDay, 'Peak-sun-hours/day', 0, 24);
    const daysPerYear = num(input.daysPerYear, 'Solar operating days/year', 0, 366, true);
    const instantaneousPowerKW = irradianceWm2 * panelAreaM2 * moduleEfficiency * systemDerate / 1000;
    // Annual PSH method uses the 1,000 W/m² reference. Do NOT multiply annual PSH yield by instantaneous irradiance again.
    const annualKWh = panelAreaM2 * moduleEfficiency * systemDerate * peakSunHoursPerDay * daysPerYear;
    return {irradianceWm2, panelAreaM2, moduleEfficiencyPct:moduleEfficiency*100, systemDeratePct:systemDerate*100, peakSunHoursPerDay, daysPerYear, instantaneousPowerKW, annualKWh, annualMWh:annualKWh/1000, annualGWh:annualKWh/1e6, method:'instantaneous power uses entered irradiance; annual PSH yield uses 1kW/m² reference', classification:'SCENARIO_ESTIMATE_NOT_MEASURED'};
  }

  function railway(input) {
    const grossWhPerPass = num(input.grossWhPerPass, 'Assumed mechanical captured energy per train-module passage (Wh)', 0, 1e6);
    const efficiency = pct(input.electricalEfficiencyPct, 'Railway electrical conversion efficiency (%)');
    const availability = pct(input.availabilityPct, 'Railway system availability (%)');
    const passesPerDayPerModule = num(input.passesPerDayPerModule, 'Train movements/day/module', 0, 10000, true);
    const operatingDays = num(input.operatingDays, 'Railway operating days/year', 0, 366, true);
    const modules = num(input.modules, 'Active modules', 1, 1000, true);
    const loadW = num(input.loadW, 'Local electrical load (W)', 0.1, 1e8);
    const batteryCapacityKWh = num(input.batteryCapacityKWh, 'Battery capacity (kWh)', 0, 1e8);
    const batteryDoD = pct(input.batteryDoDPercent, 'Battery depth of discharge (%)');
    const batteryEfficiency = pct(input.batteryEfficiencyPct, 'Battery discharge efficiency (%)');
    const netWhPerPass = grossWhPerPass * efficiency;
    const dailyWh = netWhPerPass * passesPerDayPerModule * modules * availability;
    const annualKWh = dailyWh * operatingDays / 1000;
    const averageCalendarW = annualKWh * 1000 / 8760;
    const deviceHoursPerDay = dailyWh / loadW;
    const usableBatteryKWh = batteryCapacityKWh * batteryDoD * batteryEfficiency;
    const batteryAutonomyHours = loadW > 0 ? usableBatteryKWh * 1000 / loadW : null;
    return {grossWhPerPass, electricalEfficiencyPct:efficiency*100, availabilityPct:availability*100, passesPerDayPerModule, operatingDays, modules, loadW, batteryCapacityKWh, batteryDoDPercent:batteryDoD*100, batteryEfficiencyPct:batteryEfficiency*100, netWhPerPass, dailyWh, annualKWh, averageCalendarW, deviceHoursPerDay, usableBatteryKWh, batteryAutonomyHours, classification:'SCENARIO_ESTIMATE_NOT_MEASURED'};
  }

  function solarPV(input) {
    const capacityKWp = num(input.capacityKWp, 'PV capacity (kWp)', 0, 1e9);
    const specificYield = num(input.specificYieldKWhPerKWpYear, 'Net specific yield (kWh/kWp-year)', 0, 5000);
    // Specific yield is already an annual site/system yield; do not multiply by irradiance/PSH again.
    const annualKWh = capacityKWp * specificYield;
    return {capacityKWp, specificYieldKWhPerKWpYear:specificYield, annualKWh, annualMWh:annualKWh/1000, annualGWh:annualKWh/1e6, classification:'SCENARIO_ESTIMATE_NOT_MEASURED'};
  }

  function battery(input) {
    const capacityKWh = num(input.capacityKWh, 'Battery nominal capacity (kWh)', 0, 1e9);
    const dod = pct(input.depthOfDischargePct, 'Usable depth of discharge (%)');
    const efficiency = pct(input.dischargeEfficiencyPct, 'Discharge-path efficiency (%)');
    const loadKW = num(input.loadKW, 'Average load (kW)', 0, 1e8);
    const usableKWh = capacityKWh * dod * efficiency;
    const autonomyHours = loadKW > 0 ? usableKWh / loadKW : null;
    return {capacityKWh, usableKWh, depthOfDischargePct:dod*100, dischargeEfficiencyPct:efficiency*100, loadKW, autonomyHours, classification:'SCENARIO_ESTIMATE_NOT_MEASURED'};
  }

  function feas(input) {
    const forceN = num(input.forceN, 'Effective force (N)', 0, 1e6);
    const travelMm = num(input.travelMm, 'Effective travel (mm)', 0, 1000);
    const efficiency = pct(input.efficiencyPct, 'Net conversion efficiency (%)');
    const dailyFootfalls = num(input.dailyFootfalls, 'Daily footfall events', 0, 1e9, true);
    const activeHours = num(input.activeHours, 'Active hours/day', 0.01, 24);
    const storageCapacityWh = num(input.storageCapacityWh, 'Storage capacity (Wh)', 0.01, 1e12);
    const loadW = num(input.loadW, 'Local load (W)', 0, 1e9);
    const operatingDays = num(input.operatingDays ?? 365, 'Operating days/year', 0, 366, true);
    const mechanicalJPerEvent = forceN * travelMm / 1000; // mean force × stroke; actual work requires F-x integration.
    const electricalJPerEvent = mechanicalJPerEvent * efficiency;
    const electricalWhPerEvent = electricalJPerEvent / 3600;
    const dailyWh = electricalWhPerEvent * dailyFootfalls;
    const annualKWh = dailyWh * operatingDays / 1000;
    const activeAverageW = dailyWh / activeHours;
    const dailyLoadWh = loadW * activeHours;
    return {forceN, travelMm, efficiencyPct:efficiency*100, dailyFootfalls, activeHours, storageCapacityWh, loadW, operatingDays, mechanicalJPerEvent, electricalJPerEvent, electricalWhPerEvent, electricalMWhPerEvent:electricalJPerEvent/3.6, dailyWh, dailyKWh:dailyWh/1000, annualKWh, annualMWh:annualKWh/1000, activeAverageW, storageEquivalentPct:dailyWh/storageCapacityWh*100, dailyLoadWh, loadCoveragePct:dailyLoadWh>0?dailyWh/dailyLoadWh*100:null, classification:'SCENARIO_ESTIMATE_NOT_MEASURED'};
  }

  root.IGERSCalcCore = Object.freeze({G, RHO_WATER, BETZ_LIMIT, road, hydraulic, riverCurrent, wind, solarPV, solarFromIrradiance, battery, railway, feas, reference:'IGERS Master Energy Output & Revenue Analysis (2026), §§2-7, 13, 15-17; IGERS-BD-01 Full Thesis Presentation (2026), formula-sheet appendix.'});
})(typeof window !== 'undefined' ? window : globalThis);
