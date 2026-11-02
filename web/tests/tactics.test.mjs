import test from 'node:test';
import assert from 'node:assert/strict';
import {MAX_POP,MAX_QUEUE,seededRandom,formationPoints,canProduce,productionTime,populationUsed,queueProduction,cancelProduction,advanceProduction} from '../tactics.mjs';

const defs={worker:{cost:50,gas:0},soldier:{cost:90,gas:0},heavy:{cost:170,gas:70},air:{cost:160,gas:100},hero:{cost:250,gas:140},sniper:{cost:125,gas:35},walker:{cost:210,gas:110},medic:{cost:95,gas:45}};
const fixture=(kind='barracks')=>{const building={alive:true,team:0,kind,buildRemaining:0,production:[]};return {building,resources:{crystals:1000,gas:1000},units:[],buildings:[building]};};
const queue=(f,type)=>queueProduction(f.building,type,f.resources,f.units,f.buildings,defs);

test('production charges both currencies and waits for its timer before spawning',()=>{
  const f=fixture();const completed=[];
  assert.equal(queue(f,'heavy').ok,true);
  assert.deepEqual(f.resources,{crystals:830,gas:930});
  assert.deepEqual(f.building.production,[{type:'heavy',remaining:16,total:16}]);
  advanceProduction(f.building,15,type=>completed.push(type));
  assert.deepEqual(completed,[]);
  advanceProduction(f.building,1,type=>completed.push(type));
  assert.deepEqual(completed,['heavy']);
  assert.equal(f.building.production.length,0);
});

test('restrictions and insufficient resources leave economy and queue untouched',()=>{
  const f=fixture('base');
  assert.equal(queue(f,'soldier').ok,false);
  assert.equal(queue(f,'worker').ok,true);
  assert.equal(canProduce('barracks','worker'),false);
  assert.equal(canProduce('barracks','toString'),false);
  assert.equal(canProduce('base','unknown'),false);
  f.resources.crystals=0;
  const before=structuredClone(f);
  assert.equal(queue(f,'worker').ok,false);
  assert.deepEqual(f,before);
  f.resources.crystals=100;
  f.building.buildRemaining=1;
  assert.equal(queue(f,'worker').ok,false);
  f.building.buildRemaining=0;f.building.alive=false;
  assert.equal(queue(f,'worker').ok,false);
});

test('queue limit and population reserve count all allied buildings but not dead or enemy entries',()=>{
  const f=fixture();
  for(let i=0;i<MAX_QUEUE;i++)assert.equal(queue(f,'soldier').ok,true);
  const before=structuredClone(f.resources);
  assert.equal(queue(f,'soldier').ok,false);
  assert.deepEqual(f.resources,before);
  f.building.production=[];
  f.units=Array.from({length:MAX_POP-1},()=>({alive:true,team:0}));
  f.units.push({alive:false,team:0},{alive:true,team:1});
  f.buildings.push({alive:false,team:0,production:[{}]},{alive:true,team:1,production:[{}]});
  assert.equal(populationUsed(f.units,f.buildings,0),79);
  assert.equal(queue(f,'soldier').ok,true);
  assert.equal(populationUsed(f.units,f.buildings,0),80);
  const other={alive:true,team:0,kind:'base',production:[]};f.buildings.push(other);
  assert.equal(queueProduction(other,'worker',f.resources,f.units,f.buildings,defs).ok,false);
});

test('cancel refunds exactly the selected job and invalid indexes cannot remove another',()=>{
  const f=fixture();queue(f,'heavy');queue(f,'soldier');
  assert.equal(cancelProduction(f.building,-1,f.resources,defs),false);
  assert.equal(cancelProduction(f.building,0.5,f.resources,defs),false);
  assert.equal(cancelProduction(f.building,2,f.resources,defs),false);
  assert.equal(cancelProduction(f.building,0,f.resources,defs),true);
  assert.deepEqual(f.resources,{crystals:910,gas:1000});
  assert.deepEqual(f.building.production.map(job=>job.type),['soldier']);
});

test('construction blocks production; a large tick completes at most one job',()=>{
  const f=fixture();queue(f,'soldier');queue(f,'heavy');f.building.buildRemaining=2;
  const completed=[];advanceProduction(f.building,100,type=>completed.push(type));
  assert.equal(f.building.production[0].remaining,8);assert.deepEqual(completed,[]);
  f.building.buildRemaining=0;advanceProduction(f.building,100,type=>completed.push(type));
  assert.deepEqual(completed,['soldier']);assert.equal(f.building.production[0].remaining,16);
  advanceProduction(f.building,NaN,type=>completed.push(type));
  assert.equal(f.building.production[0].remaining,16);
});

test('invalid costs cannot add resources or corrupt an existing queue',()=>{
  for(const bad of [{cost:-1,gas:0},{cost:NaN,gas:0},{cost:1,gas:Infinity}]){
    const f=fixture();assert.equal(queueProduction(f.building,'soldier',f.resources,f.units,f.buildings,{soldier:bad}).ok,false);
    assert.deepEqual(f.resources,{crystals:1000,gas:1000});assert.deepEqual(f.building.production,[]);
  }
});

test('seeded random sequences repeat and stay in [0,1)',()=>{
  const a=seededRandom(12345),b=seededRandom(12345),c=seededRandom(54321);
  const first=Array.from({length:100},a),same=Array.from({length:100},b),different=Array.from({length:100},c);
  assert.deepEqual(first,same);assert.notDeepEqual(first,different);
  assert.ok(first.every(value=>value>=0&&value<1));
});

test('random state survives save and restores the exact continuation',()=>{
  const original=seededRandom(12345);
  Array.from({length:37},original);
  const saved=JSON.parse(JSON.stringify({state:original.state()}));
  assert.ok(Number.isInteger(saved.state)&&saved.state>=0&&saved.state<=0xffffffff);
  const expected=Array.from({length:100},original);
  const restored=seededRandom(999);
  restored.setState(saved.state);
  assert.deepEqual(Array.from({length:100},restored),expected);
  original.setState(saved.state);
  assert.deepEqual(Array.from({length:100},original),expected);
});

test('formations have distinct destinations centered on the requested point',()=>{
  for(const count of [1,2,5,16,23]){
    const points=formationPoints(count,10,-20);
    assert.equal(points.length,count);assert.equal(new Set(points.map(p=>`${p.x},${p.z}`)).size,count);
    assert.ok(Math.abs(points.reduce((s,p)=>s+p.x,0)/count-10)<1e-10);
    assert.ok(Math.abs(points.reduce((s,p)=>s+p.z,0)/count+20)<1e-10);
  }
  assert.deepEqual(formationPoints(0,0,0),[]);
  assert.equal(productionTime('hero'),22);assert.equal(productionTime('unknown'),null);
});

