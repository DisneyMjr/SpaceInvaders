import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {modelAssets} from '../assets/registry.mjs';
import {resolveUnitModel} from '../unit-models.mjs';

test('every faction uses its own original model for every unit role',()=>{
 const paths=new Set();
 for(const faction of ['solar','veil','aether','silex','swarm','root']){
  for(const role of ['worker','soldier','sniper','medic','heavy','walker','air','hero']){
   const def=resolveUnitModel(faction,role);
   assert.equal(def,modelAssets[faction+'.'+role]);assert.equal(def.original,true);
   assert(!paths.has(def.path));paths.add(def.path);
  }
 }
 assert.equal(paths.size,48);assert.equal(resolveUnitModel('unknown','soldier'),null);
});

test('all unit GLBs have valid geometry, local textures and three usable animations',()=>{
 for(const def of Object.values(modelAssets)){
  const bytes=fs.readFileSync(new URL('../'+def.path,import.meta.url));
  assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.readUInt32LE(4),2);assert.equal(bytes.readUInt32LE(8),bytes.length);
  const jsonLength=bytes.readUInt32LE(12);const doc=JSON.parse(bytes.subarray(20,20+jsonLength).toString());
  assert(doc.extras.originalGeometry===true||doc.extras.geometryReusedFromOriginal===false);assert.equal(doc.buffers.length,1);assert(!doc.buffers[0].uri);
  for(const image of doc.images||[]){if(image.bufferView!==undefined){assert(doc.bufferViews[image.bufferView]);assert.match(image.mimeType,/^image\//)}else{assert.match(image.uri,/^[a-z0-9-]+\.png$/i);assert(fs.existsSync(new URL(image.uri,new URL('../'+def.path,import.meta.url))))}}
  assert.equal(doc.buffers[0].byteLength<=bytes.length-28-jsonLength,true);
  assert.deepEqual(doc.animations.map(a=>a.name),['Idle','Walk','Attack']);
  for(const mesh of doc.meshes)for(const primitive of mesh.primitives){
   const pos=doc.accessors[primitive.attributes.POSITION];
   assert.equal(pos.type,'VEC3');assert(pos.count>0);assert.equal((primitive.indices===undefined?pos.count:doc.accessors[primitive.indices].count)%3,0);
   assert([...pos.min,...pos.max].every(Number.isFinite));
  }
  for(const animation of doc.animations){
   assert(animation.channels.length>0);
   for(const c of animation.channels){
    assert(doc.nodes[c.target.node]);const sampler=animation.samplers[c.sampler];
    const input=doc.accessors[sampler.input],output=doc.accessors[sampler.output];
    assert(input.max[0]>0);assert.equal(output.count,input.count);
   }
  }
  for(const v of doc.bufferViews)assert(v.byteOffset+v.byteLength<=doc.buffers[0].byteLength);
 }
});
