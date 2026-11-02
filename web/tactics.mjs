import {buildingDefinition} from './buildings.mjs';
export const MAX_POP = 80;
export const MAX_QUEUE = 5;

const times = Object.freeze({worker:6,soldier:8,heavy:16,air:14,hero:22,sniper:11,walker:18,medic:10});
const known = type => Object.hasOwn(times, type);

export function seededRandom(seed) {
  let state = Number(seed) >>> 0;
  function random() {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  }
  random.state = () => state;
  random.setState = value => { state = Number(value) >>> 0; };
  return random;
}

export function formationPoints(count, x, z, spacing = 3) {
  if (!Number.isInteger(count) || count <= 0) return [];
  const columns = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / columns);
  const points = [];
  for (let row = 0; row < rows; row++) {
    const width = Math.min(columns, count - row * columns);
    for (let column = 0; column < width; column++) {
      points.push({x:x+(column-(width-1)/2)*spacing,z:z+row*spacing});
    }
  }
  const averageZ = points.reduce((sum, point) => sum + point.z, 0) / count;
  for (const point of points) point.z += z - averageZ;
  return points;
}

export function canProduce(kind, type) {
  return known(type) && (kind === 'base' ? type === 'worker' : kind === 'barracks' && type !== 'worker' || ['solar','aether','swarm'].some(f=>buildingDefinition(kind,f)?.train.includes(type)));
}

export function productionTime(type) {
  return known(type) ? times[type] : null;
}

export function populationLimit(buildings,team){return Math.min(200,MAX_POP+buildings.reduce((n,b)=>n+(b.alive&&b.team===team&&!b.buildRemaining?(buildingDefinition(b.kind,b.faction)?.supply||0):0),0))}

export function populationUsed(units, buildings, team) {
  return units.filter(unit => unit.alive && unit.team === team).length +
    buildings.reduce((sum, building) => sum + (building.alive && building.team === team && Array.isArray(building.production) ? building.production.length : 0), 0);
}

function validCosts(definition) {
  return definition && Number.isFinite(definition.cost) && definition.cost >= 0 && Number.isFinite(definition.gas) && definition.gas >= 0;
}

export function queueProduction(building, type, resources, units, buildings, defs) {
  if (!building?.alive) return {ok:false,reason:'Construção indisponível.'};
  if (building.buildRemaining > 0) return {ok:false,reason:'Construção em andamento.'};
  if (!canProduce(building.kind, type)) return {ok:false,reason:'Unidade indisponível nesta construção.'};
  if (building.production != null && !Array.isArray(building.production)) return {ok:false,reason:'Fila inválida.'};
  const production = building.production ?? [];
  if (production.length >= MAX_QUEUE) return {ok:false,reason:'Fila cheia (máximo de 5).'};
  if (populationUsed(units, buildings, building.team) >= populationLimit(buildings,building.team)) return {ok:false,reason:'Limite de população atingido.'};
  const definition = defs?.[type];
  if (!validCosts(definition)) return {ok:false,reason:'Custo da unidade inválido.'};
  if (!resources || !Number.isFinite(resources.crystals) || !Number.isFinite(resources.gas) || resources.crystals < definition.cost || resources.gas < definition.gas) return {ok:false,reason:'Recursos insuficientes.'};
  resources.crystals -= definition.cost;
  resources.gas -= definition.gas;
  const total = productionTime(type);
  production.push({type,remaining:total,total});
  building.production = production;
  return {ok:true,reason:''};
}

export function cancelProduction(building, index, resources, defs) {
  const production = building?.production;
  if (!Array.isArray(production) || !Number.isInteger(index) || index < 0 || index >= production.length) return false;
  const definition = defs?.[production[index].type];
  if (!validCosts(definition) || !resources || !Number.isFinite(resources.crystals) || !Number.isFinite(resources.gas)) return false;
  production.splice(index, 1);
  resources.crystals += definition.cost;
  resources.gas += definition.gas;
  return true;
}

export function advanceProduction(building, dt, onComplete) {
  if (!building?.alive || building.buildRemaining > 0 || !Number.isFinite(dt) || dt <= 0 || typeof onComplete !== 'function') return;
  const job = building.production?.[0];
  if (!job || !Number.isFinite(job.remaining)) return;
  job.remaining -= dt;
  if (job.remaining <= 0) {
    building.production.shift();
    onComplete(job.type);
  }
}
