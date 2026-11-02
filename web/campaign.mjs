import {generatedMissions,introductorySources} from './campaign-generated.mjs';
// SpaceInvaders campaign: web-native rules and scenarios, not a Galaxy script interpreter.
const FACTIONS=['solar','aether','swarm'];
const unit=(type,x,z,extra={})=>({type,x,z,team:0,faction:'solar',...extra});
const building=(missionTag,x,z,kind='barracks',extra={})=>({missionTag,x,z,kind,team:1,faction:'swarm',...extra});
const army=(n,type='soldier',x=-24,z=0,extra={})=>Array.from({length:n},(_,i)=>unit(type,x-(i%3)*3,z+Math.floor(i/3)*3,extra));
const workers=()=>army(5,'worker',-35,-7);
const base={x:-31,z:0,kind:'base',team:0,faction:'solar',missionTag:'player-hq'};
const start=(units,resources={crystals:500,gas:220})=>({playerBase:{...base},resources,playerUnits:[...workers(),...units]});

const introductoryMissions=[
 {id:'first-light',label:'01 · Primeiro Sinal',briefing:'Reative a colônia, erga um quartel e forme sua primeira patrulha. A fronteira está silenciosa, mas a presença Vorax já foi detectada.',map:'verdant',faction:'solar',seed:21031,kind:'establish',start:start(army(1)),enemyBuildings:[building('enemy-hq',57,24,'base')],enemyUnits:[],neutralUnits:[],markers:[],waves:[],objectives:[{id:'barracks',label:'Concluir um quartel',target:1},{id:'army',label:'Manter três tropas de infantaria',target:3}]},
 {id:'rust-line',label:'02 · Linha de Ferrugem',briefing:'Dois postos Vorax bloqueiam o corredor de minério. Use a força expedicionária para desativar ambos e abrir a rota.',map:'desert',faction:'solar',seed:22047,kind:'outposts',start:start([...army(7),unit('heavy',-27,-8),unit('medic',-30,9)]),enemyBuildings:[building('outpost-1',8,-20),building('outpost-2',36,18),building('enemy-hq',65,0,'base')],enemyUnits:army(4,'soldier',15,-14,{team:1,faction:'swarm'}),neutralUnits:[],markers:[],waves:[],objectives:[{id:'outposts',label:'Destruir os dois postos avançados',target:2}]},
 {id:'long-watch',label:'03 · A Longa Vigília',briefing:'O sinal de evacuação precisa de três minutos para atravessar a tempestade. Proteja o núcleo até a transmissão ser concluída.',map:'frost',faction:'solar',seed:23063,kind:'survive',duration:180,start:start([...army(8),...army(2,'heavy',-25,-10),unit('medic',-30,12)],{crystals:750,gas:320}),enemyBuildings:[building('enemy-hq',70,15,'base')],enemyUnits:[],neutralUnits:[],markers:[],waves:[{at:20,units:army(3,'soldier',50,-14,{team:1,faction:'swarm'})},{at:65,units:army(5,'soldier',46,20,{team:1,faction:'swarm'})},{at:110,units:[...army(6,'soldier',48,-20,{team:1,faction:'swarm'}),unit('heavy',55,-14,{team:1,faction:'swarm'})]},{at:150,units:[...army(7,'soldier',52,18,{team:1,faction:'swarm'}),...army(2,'heavy',55,9,{team:1,faction:'swarm'})]}],objectives:[{id:'survive',label:'Proteger o núcleo por três minutos',target:180}]},
 {id:'lost-voices',label:'04 · Vozes Perdidas',briefing:'Três equipes ficaram isoladas na floresta. Aproxime suas tropas para resgatá-las e leve o comandante ao ponto de extração.',map:'verdant',faction:'solar',seed:24079,kind:'rescue',start:start([unit('hero',-24,0,{missionTag:'hero'}),...army(6),unit('medic',-29,10)]),enemyBuildings:[building('enemy-hq',60,30,'base')],enemyUnits:[...army(3,'soldier',14,-12,{team:1,faction:'swarm'}),...army(3,'soldier',34,17,{team:1,faction:'swarm'})],neutralUnits:[...army(2,'soldier',-3,-27,{team:2,faction:'aether',missionTag:'rescue-1'}),...army(2,'soldier',24,0,{team:2,faction:'aether',missionTag:'rescue-2'}),...army(2,'soldier',43,-27,{team:2,faction:'aether',missionTag:'rescue-3'})],markers:[{id:'rescue-1',x:-3,z:-27,radius:8,label:'Equipe Alfa'},{id:'rescue-2',x:24,z:0,radius:8,label:'Equipe Beta'},{id:'rescue-3',x:43,z:-27,radius:8,label:'Equipe Gama'},{id:'extraction',x:-30,z:27,radius:8,label:'Extração'}],waves:[],objectives:[{id:'rescued',label:'Resgatar três equipes',target:3},{id:'extract',label:'Levar o comandante à extração',target:1}]},
 {id:'prism-network',label:'05 · Rede Prismática',briefing:'Mantenha uma tropa junto a cada farol por 45 segundos. Divida o exército: inimigos próximos interrompem a conexão.',map:'frost',faction:'aether',seed:25091,kind:'capture',holdDuration:45,start:{...start([...army(9),...army(2,'walker',-27,-9),unit('medic',-29,12)],{crystals:650,gas:300}),playerBase:{...base,faction:'aether'},playerUnits:[...workers(),...army(9),...army(2,'walker',-27,-9),unit('medic',-29,12)].map(u=>({...u,faction:'aether'}))},enemyBuildings:[building('enemy-hq',65,22,'base')],enemyUnits:[...army(3,'soldier',24,-10,{team:1,faction:'swarm'})],neutralUnits:[],markers:[{id:'beacon-1',x:-4,z:-26,radius:8,label:'Farol Norte'},{id:'beacon-2',x:20,z:4,radius:8,label:'Farol Central'},{id:'beacon-3',x:42,z:28,radius:8,label:'Farol Sul'}],waves:[{at:50,units:army(4,'soldier',60,10,{team:1,faction:'swarm'})},{at:110,units:army(5,'soldier',57,-20,{team:1,faction:'swarm'})}],objectives:[{id:'beacon-1',label:'Conectar o Farol Norte',target:45},{id:'beacon-2',label:'Conectar o Farol Central',target:45},{id:'beacon-3',label:'Conectar o Farol Sul',target:45}]},
 {id:'obsidian-heart',label:'06 · Coração de Obsidiana',briefing:'Rompa os três postos de defesa e destrua o núcleo Vorax. A força principal terá de atravessar a caldeira para encerrar a ofensiva.',map:'volcano',faction:'solar',seed:26099,kind:'finale',start:start([...army(10),...army(3,'heavy',-27,-12),...army(2,'air',-28,15),unit('hero',-24,0,{missionTag:'hero'}),...army(2,'medic',-34,10)],{crystals:1100,gas:650}),enemyBuildings:[building('outpost-1',7,-23),building('outpost-2',24,9),building('outpost-3',43,-19),building('enemy-hq',62,18,'base')],enemyUnits:[...army(6,'soldier',23,-8,{team:1,faction:'swarm'}),...army(3,'heavy',50,14,{team:1,faction:'swarm'})],neutralUnits:[],markers:[],waves:[{at:60,units:army(5,'soldier',65,-20,{team:1,faction:'swarm'})},{at:135,units:[...army(5,'soldier',62,28,{team:1,faction:'swarm'}),unit('heavy',65,24,{team:1,faction:'swarm'})]}],objectives:[{id:'outposts',label:'Destruir os três postos de defesa',target:3},{id:'hq',label:'Destruir o núcleo Vorax',target:1}]}
];

for(let i=0;i<introductoryMissions.length;i++)if(introductorySources[i])introductoryMissions[i].source=introductorySources[i];
export const missions=[...introductoryMissions,...generatedMissions];

export const missionById=id=>missions.find(m=>m.id===id)||null;
const alive=e=>e&&e.alive!==false&&(e.hp===undefined||e.hp>0);
const near=(a,b,r)=>Number.isFinite(a?.x)&&Number.isFinite(a?.z)&&Math.hypot(a.x-b.x,a.z-b.z)<=r;
const finite=(v,fallback=0)=>Number.isFinite(v)?v:fallback;
const cap=(v,a,b)=>Math.max(a,Math.min(b,v));
const tag=e=>e.missionTag??e.objectiveId;

export function normalizeProgress(raw){
 const ids=Array.isArray(raw?.completed)?raw.completed:[];
 const completed=[];
 // Only a contiguous sequence can unlock later operations.
 for(const mission of missions){if(!ids.includes(mission.id))break;completed.push(mission.id)}
 return{version:1,completed};
}
export function canPlayMission(progress,id){const index=missions.findIndex(m=>m.id===id);return index>=0&&(index===0||normalizeProgress(progress).completed.includes(missions[index-1].id))}
export function unlockProgress(progress,id){const normalized=normalizeProgress(progress);if(!canPlayMission(normalized,id))return normalized;if(!normalized.completed.includes(id))normalized.completed.push(id);return normalizeProgress(normalized)}

export class CampaignRuntime{
 constructor(def,savedState=null){
  this.def=typeof def==='string'?missionById(def):def;
  if(!this.def||!missionById(this.def.id))throw new Error('Missão desconhecida.');
  const saved=savedState?.missionId===this.def.id?savedState:{};
  this.elapsed=cap(finite(saved.elapsed),0,86400);
  this.waveIndex=cap(Math.floor(finite(saved.waveIndex)),0,this.def.waves.length);
  const rescueIds=this.def.markers.filter(m=>m.id.startsWith('rescue-')).map(m=>m.id);
  this.rescued=new Set(Array.isArray(saved.rescued)?saved.rescued.filter(id=>rescueIds.includes(id)):[]);
  this.capture=Object.fromEntries(this.def.markers.filter(m=>m.id.startsWith('beacon-')).map(m=>[m.id,cap(finite(saved.capture?.[m.id]),0,this.def.holdDuration||45)]));
  this.result=['victory','defeat'].includes(saved.result)?saved.result:null;
  this.lastObjectives=[];
 }
 serialize(){return{version:1,missionId:this.def.id,elapsed:this.elapsed,waveIndex:this.waveIndex,rescued:[...this.rescued],capture:{...this.capture},result:this.result}}
 update(dt,world){
  const events=[],d=this.def,units=(world?.units||[]).filter(alive),buildings=(world?.buildings||[]).filter(alive),friendly=units.filter(u=>u.team===0),combat=friendly.filter(u=>u.type!=='worker'),enemies=units.filter(u=>u.team===1);
  const hq=buildings.find(b=>b.team===0&&tag(b)==='player-hq')||buildings.find(b=>b.team===0&&b.kind==='base');
  const hero=friendly.find(u=>tag(u)==='hero')||friendly.find(u=>u.type==='hero'),convoy=friendly.find(u=>tag(u)==='convoy');
  if(this.result)return{events,result:this.result,objectives:this.lastObjectives.length?this.lastObjectives:this.objectives(world)};
  // A missing required ally always wins precedence over a simultaneous completed objective.
  if(!hq||(d.kind==='rescue'&&!hero)||(d.kind==='escort'&&!convoy)){this.result='defeat';return{events,result:this.result,objectives:this.objectives(world)}}
  const step=cap(finite(dt),0,60);this.elapsed+=step;
  let room=Math.max(0,56-enemies.length);
  while(this.waveIndex<d.waves.length&&this.elapsed>=d.waves[this.waveIndex].at){
   const wave=d.waves[this.waveIndex++],spawn=wave.units.slice(0,room).map((u,i)=>({...u,missionTag:'wave-'+this.waveIndex+'-'+i}));room-=spawn.length;
   if(spawn.length)events.push({kind:'spawnWave',units:spawn});
  }
  if(d.kind==='rescue')for(const marker of d.markers.filter(m=>m.id.startsWith('rescue-'))){
   if(this.rescued.has(marker.id))continue;
   const group=units.filter(u=>u.team===2&&tag(u)===marker.id);
   if(group.length&&combat.some(u=>near(u,marker,marker.radius))){this.rescued.add(marker.id);events.push({kind:'rescue',ids:group.map(u=>u.id),team:0,missionTag:marker.id})}
  }
  if(d.kind==='capture')for(const marker of d.markers){const contested=enemies.some(u=>near(u,marker,marker.radius)),occupied=combat.some(u=>near(u,marker,marker.radius));if(contested)this.capture[marker.id]=0;else if(occupied)this.capture[marker.id]=Math.min(d.holdDuration,this.capture[marker.id]+step);else if(this.capture[marker.id]<d.holdDuration)this.capture[marker.id]=0}
  const objectives=this.objectives(world);
  if(objectives.every(o=>o.done))this.result='victory';
  return{events,result:this.result,objectives};
 }
 objectives(world){
  const d=this.def,units=(world?.units||[]).filter(alive),buildings=(world?.buildings||[]).filter(alive);
  const destroyed=prefix=>d.enemyBuildings.filter(b=>b.missionTag.startsWith(prefix)).filter(expected=>!buildings.some(b=>b.team===1&&tag(b)===expected.missionTag)).length;
  const values={};
  if(d.kind==='establish'){values.barracks=buildings.filter(b=>b.team===0&&b.kind==='barracks'&&!(b.buildRemaining>0)).length;values.army=units.filter(u=>u.team===0&&u.type==='soldier').length}
  if(d.kind==='outposts'||d.kind==='finale')values.outposts=destroyed('outpost-');
  if(d.kind==='finale')values.hq=destroyed('enemy-hq');
  if(d.kind==='survive')values.survive=this.elapsed;
  if(d.kind==='collect'){values.crystals=finite(world?.resources?.[0]?.crystals);values.gas=finite(world?.resources?.[0]?.gas)}
  if(d.kind==='eliminate'){const targets=d.targetTags||[];values.eliminate=targets.filter(id=>!units.some(u=>u.team===1&&tag(u)===id)).length}
  if(d.kind==='escort'){const convoy=units.find(u=>u.team===0&&tag(u)==='convoy'),destination=d.markers.find(m=>m.id==='destination');values.escort=convoy&&destination&&near(convoy,destination,destination.radius)?1:0}
  if(d.kind==='rescue'){values.rescued=this.rescued.size;const hero=units.find(u=>u.team===0&&tag(u)==='hero')||units.find(u=>u.team===0&&u.type==='hero'),extraction=d.markers.find(m=>m.id==='extraction');values.extract=this.rescued.size===d.markers.filter(m=>m.id.startsWith('rescue-')).length&&hero&&near(hero,extraction,extraction.radius)?1:0}
  if(d.kind==='capture')Object.assign(values,this.capture);
  this.lastObjectives=d.objectives.map(objective=>{const current=cap(finite(values[objective.id]),0,objective.target);return{...objective,current,done:current>=objective.target}});
  return this.lastObjectives;
 }
}
