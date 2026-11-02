import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const templates=new Map();
export async function loadStaticTemplate(path,stateAnimation=null){
 const key=path+'#'+(stateAnimation||'auto');
 if(!templates.has(key))templates.set(key,new GLTFLoader().loadAsync(path).then(g=>{
  const mixer=new T.AnimationMixer(g.scene),clip=g.animations.find(a=>a.name===stateAnimation)||g.animations.find(a=>/^Stand_full$/i.test(a.name))||g.animations.find(a=>/^Stand A_full$/i.test(a.name))||g.animations.find(a=>/stand/i.test(a.name));
  if(clip){mixer.clipAction(clip).play();mixer.setTime(.1)}g.scene.updateMatrixWorld(true);const parts=[],bounds=new T.Box3();
  g.scene.traverse(m=>{
   if(!m.isMesh)return;m.skeleton?.update();let geom=m.geometry.clone();const p=geom.attributes.position,n=geom.attributes.normal,v=new T.Vector3(),normal=new T.Vector3(),worldNormal=new T.Matrix3().getNormalMatrix(m.matrixWorld),weighted=new T.Matrix4(),skin=new T.Matrix4(),skinNormal=new T.Matrix3();
   for(let i=0;i<p.count;i++){
    v.fromBufferAttribute(p,i);if(m.isSkinnedMesh)m.applyBoneTransform(i,v);v.applyMatrix4(m.matrixWorld);p.setXYZ(i,v.x,v.y,v.z);
    if(n){normal.fromBufferAttribute(n,i);if(m.isSkinnedMesh){weighted.elements.fill(0);const indices=new T.Vector4().fromBufferAttribute(m.geometry.attributes.skinIndex,i),weights=new T.Vector4().fromBufferAttribute(m.geometry.attributes.skinWeight,i);for(let k=0;k<4;k++){const w=weights.getComponent(k);if(w===0)continue;const offset=indices.getComponent(k)*16;for(let j=0;j<16;j++)weighted.elements[j]+=m.skeleton.boneMatrices[offset+j]*w}skin.multiplyMatrices(m.bindMatrixInverse,weighted).multiply(m.bindMatrix);skinNormal.getNormalMatrix(skin);normal.applyNormalMatrix(skinNormal)}normal.applyNormalMatrix(worldNormal);n.setXYZ(i,normal.x,normal.y,normal.z)}
   }
   geom.deleteAttribute('skinIndex');geom.deleteAttribute('skinWeight');if(geom.index){const old=geom;geom=geom.toNonIndexed();old.dispose()}geom.computeBoundingBox();const size=geom.boundingBox.getSize(new T.Vector3());
   // Separate legacy planar shadow layers have no usable opacity texture.
   if(m.material.transparent&&!m.material.map&&size.y<Math.max(size.x,size.z)*.12){geom.dispose();return}
   if(m.matrixWorld.determinant()<0)for(const attr of Object.values(geom.attributes)){const ar=attr.array,k=attr.itemSize;for(let i=0;i<attr.count;i+=3)for(let j=0;j<k;j++){const a=(i+1)*k+j,b=(i+2)*k+j;[ar[a],ar[b]]=[ar[b],ar[a]]}}
   if(!n)geom.computeVertexNormals();bounds.union(geom.boundingBox);parts.push({geom,material:m.material});
  });
  const center=bounds.getCenter(new T.Vector3()),height=bounds.max.y-bounds.min.y,extent=Math.max(height,bounds.max.x-bounds.min.x,bounds.max.z-bounds.min.z);if(!parts.length||!Number.isFinite(extent)||extent<=0)throw Error('Modelo sem geometria estática utilizável: '+path);for(const p of parts)p.geom.translate(-center.x,-bounds.min.y,-center.z);return {parts,height,extent};
 }));return templates.get(key);
}
