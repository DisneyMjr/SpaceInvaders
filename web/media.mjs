import {loadFactionStructure} from './realistic-structures.mjs';
import {baseRace,factions} from './factions.mjs';

import {buildingDefinition} from './buildings.mjs';
import * as THREE from 'three';
import {createModelLoader} from './model-loader.mjs?v=2';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {modelAssets,soundAssets} from './assets/registry.mjs';
import {resolveUnitModel} from './unit-models.mjs';

const modelCache=new Map(),audioCache=new Map();
const sizes={worker:3,soldier:3.6,sniper:3.6,medic:3.6,heavy:5,walker:5,hero:6,air:5,base:10,barracks:7};
export const mediaSummary={models:new Set(Object.values(modelAssets).map(value=>typeof value==='string'?value:value.path)).size,sounds:new Set(Object.values(soundAssets).flat()).size};

async function loadModel(path){
 if(!modelCache.has(path))modelCache.set(path,createModelLoader().loadAsync(path).catch(error=>{console.warn('Não foi possível carregar o modelo:',path,error);return null}));
 return modelCache.get(path);
}

export async function attachGameModel(entity,isCurrent){
 const type=entity.type||entity.kind,nativeId=entity.kind&&buildingDefinition(entity.kind,entity.faction)?.nativeId,definition=entity.kind?buildingDefinition(entity.kind,entity.faction):resolveUnitModel(entity.faction,type);
 if(!definition)return false;
 const structureKey='structure:'+entity.faction+':'+nativeId;if(entity.kind&&!modelCache.has(structureKey))modelCache.set(structureKey,loadFactionStructure(definition));
 const data=entity.kind?await modelCache.get(structureKey):await loadModel(typeof definition==='string'?definition:definition.path);
 if(!data||!entity.alive||!isCurrent(entity))return false;
 const visual=clone(data.scene),holder=new THREE.Group();
 visual.updateMatrixWorld(true);
 const bounds=new THREE.Box3().setFromObject(visual),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
 const maximum=Math.max(size.x,size.y,size.z);
 if(!Number.isFinite(maximum)||maximum<=0)return false;
 const scale=(definition.size||sizes[type]||4)/maximum;
 holder.scale.setScalar(scale);visual.position.x-=center.x;visual.position.y-=bounds.min.y;visual.position.z-=center.z;
 // M3 conversion produces glTF Y-up; orientation is per asset when a correction is needed.
 holder.rotation.y=definition.rotation||0;holder.add(visual);
 visual.traverse(object=>{if(object.isMesh){object.castShadow=true;object.receiveShadow=true;object.frustumCulled=false}});
 if(entity.kind){
  const accent=new THREE.Color(factions[entity.faction]?.color||0x51d6ff);
  visual.traverse(o=>{if(!o.isMesh)return;const materials=Array.isArray(o.material)?o.material:[o.material];const own=materials.map(m=>{const copy=m.clone();copy.color?.lerp(accent,.14);if(copy.emissive?.getHex()){copy.emissive.copy(accent);copy.emissiveIntensity=Math.min(copy.emissiveIntensity||1,.7)}return copy});o.material=Array.isArray(o.material)?own:own[0]});
 }
 for(const child of entity.mesh.children)child.visible=false;
 entity.mesh.scale.setScalar(1);entity.mesh.add(holder);entity.mediaVisual=holder;entity.limb=[];
 const beacon=new THREE.Mesh(new THREE.RingGeometry(entity.kind?3:1,entity.kind?3.18:1.14,24),new THREE.MeshBasicMaterial({color:entity.team===0?(factions[entity.faction]?.color||0x51d6ff):entity.team===2?0xffd18c:0xff566c,side:THREE.DoubleSide,transparent:true,opacity:.75,depthWrite:false}));
 beacon.rotation.x=-Math.PI/2;beacon.position.y=.09;entity.mesh.add(beacon);entity.mediaBeacon=beacon;
 if(data.animations.length){
  const mixer=new THREE.AnimationMixer(visual),clips=data.animations;
  const choose=(regex,fallback)=>clips.find(c=>regex.test(c.name))||fallback;
  const idle=(definition.stateAnimation&&clips.find(c=>c.name===definition.stateAnimation))||choose(/(^|[^a-z])(stand|idle)([^a-z]|$)/i,clips.find(c=>!/death|birth|morph/i.test(c.name))||clips[0]);
  const walk=choose(/walk|run|move/i,idle),attack=clips.filter(c=>/attack/i.test(c.name)&&c.duration>0).sort((a,b)=>a.duration-b.duration)[0]||idle;
  entity.mediaAnimation={mixer,clips,actions:{idle:mixer.clipAction(idle),walk:mixer.clipAction(walk),attack:mixer.clipAction(attack)},current:null};
  updateGameAnimation(entity,0);
 }
 return true;
}

export function updateGameAnimation(entity,dt){
 const animation=entity.mediaAnimation;if(!animation)return;
 if(entity.mediaCompact){entity.mediaAnimationDebt=(entity.mediaAnimationDebt||0)+dt;if(entity.mediaAnimationDebt<1/15)return;dt=entity.mediaAnimationDebt;entity.mediaAnimationDebt=0;}
 if(Math.hypot(entity.x-(entity.mediaLastX??entity.x),entity.z-(entity.mediaLastZ??entity.z))>.0001)entity.mediaMovingTime=.12;
 const moved=Math.hypot(entity.x-(entity.mediaLastX??entity.x),entity.z-(entity.mediaLastZ??entity.z));
 entity.mediaLastX=entity.x;entity.mediaLastZ=entity.z;entity.mediaMovingTime=Math.max(0,(entity.mediaMovingTime||0)-dt);
 const state=entity.attackVisual>0?'attack':entity.mediaMovingTime>0?'walk':'idle';
 const action=animation.actions[state];
 if(animation.current!==action){animation.current?.fadeOut(.15);action.reset().fadeIn(.15).play();animation.current=action}
 if(state==='walk'&&dt>0)action.setEffectiveTimeScale(THREE.MathUtils.clamp(moved/dt/5,.65,1.6));else action.setEffectiveTimeScale(1);
 const holder=entity.mediaVisual;if(holder){const hp=entity.hp??entity.maxHp;if(entity.mediaLastHp!==undefined&&hp<entity.mediaLastHp)entity.mediaHitTime=.18;entity.mediaLastHp=hp;entity.mediaHitTime=Math.max(0,(entity.mediaHitTime||0)-dt);holder.rotation.z=Math.sin(entity.mediaHitTime*60)*entity.mediaHitTime*.16;}
 entity.attackVisual=Math.max(0,(entity.attackVisual||0)-dt);animation.mixer.update(dt);
}

export function playGameAudio(kind,enabled=true){
 kind=kind.replace(/_(veil|silex|root)$/,(_,id)=>'_'+baseRace(id));const entries=soundAssets[kind];if(!enabled||!entries)return false;
 const paths=Array.isArray(entries)?entries:[entries],path=paths[Math.floor(Math.random()*paths.length)];
 if(!path)return false;
 let pool=audioCache.get(path);if(!pool){pool=Array.from({length:kind==='shot'?4:2},()=>{const audio=new Audio(path);audio.preload='auto';audio.volume=kind==='shot'?.15:.28;return audio});audioCache.set(path,pool)}
 const audio=pool.find(item=>item.paused||item.ended);if(!audio)return true;
 audio.currentTime=0;audio.play().catch(()=>{});return true;
}

export function stopGameAudio(){for(const pool of audioCache.values())for(const audio of pool){audio.pause();audio.currentTime=0}}

export const assetFiles=[...new Set([...Object.values(modelAssets).map(value=>typeof value==='string'?value:value.path),...Object.values(soundAssets).flat()])];
