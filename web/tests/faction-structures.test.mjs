import test from 'node:test';import assert from 'node:assert/strict';
import * as T from '../vendor/three/build/three.module.js';
import {createFactionStructure} from '../faction-structures.mjs';
import {factionBuildings} from '../buildings.mjs';import{factions}from'../factions.mjs';
test('original structures cover every faction catalog with grounded finite geometry and bounded detail',()=>{
 for(const faction of Object.keys(factions))for(const def of factionBuildings(faction)){
  const {scene,animations}=createFactionStructure(def);assert.equal(scene.userData.originalArchitecture,true);assert.equal(scene.userData.faction,faction);assert.deepEqual(animations,[]);
  scene.updateMatrixWorld(true);const box=new T.Box3().setFromObject(scene),size=box.getSize(new T.Vector3());assert.ok(size.x>0&&size.y>0&&size.z>0);assert.ok([box.min.x,box.min.y,box.min.z,box.max.x,box.max.y,box.max.z].every(Number.isFinite));assert.ok(box.min.y>-.4&&size.y<5);
  let triangles=0;scene.traverse(o=>{if(!o.isMesh)return;const g=o.geometry;triangles+=(g.index?.count||g.attributes.position.count)/3;for(const n of g.attributes.position.array)assert.ok(Number.isFinite(n));assert.ok(o.material.isMaterial)});assert.ok(triangles>1000&&triangles<30000,def.nativeId+': '+triangles);
 }
});
