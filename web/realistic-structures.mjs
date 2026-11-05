import * as T from 'three';
import {baseRace,factions} from './factions.mjs';
import {createFactionStructure} from './faction-structures.mjs';
import {createModelLoader} from './model-loader.mjs?v=2';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {detailedBuildingAssets,detailedBuildingRoles} from './assets/realistic-buildings/registry.mjs';
const cache=new Map();
export function structureAsset(def,heads=detailedBuildingAssets,roles=detailedBuildingRoles){
 const race=baseRace(def.faction);
 const category=def.role==='defense'?'defense':def.role==='tech'?'technology':(!def.isHQ&&def.role!=='production')?'utility':null;
 return (category&&roles[race+'.'+category])||((def.isHQ||def.role==='production')?heads[race]:undefined);
}
export async function loadFactionStructure(def){
 const race=baseRace(def.faction),file=structureAsset(def);
 if(!file)return createFactionStructure(def);
 if(!cache.has(file))cache.set(file,createModelLoader().loadAsync(file).catch(e=>{cache.delete(file);throw e}));
 const data=await cache.get(file),scene=clone(data.scene);
 if(def.faction!==race)scene.traverse(o=>{if(!o.isMesh)return;const list=Array.isArray(o.material)?o.material:[o.material];const materials=list.map(m=>{const own=m.clone();own.color.lerp(new T.Color(factions[def.faction].color),.18);return own});o.material=Array.isArray(o.material)?materials:materials[0]});
 scene.userData.realisticBuilding=true;scene.userData.sharedResources=true;
 return{scene,animations:[],size:def.size};
}
