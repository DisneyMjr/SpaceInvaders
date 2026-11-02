import * as T from 'three';
import {SCENERY_ASSETS} from './assets/scenery/registry.mjs';
import {loadStaticTemplate} from './static-models.mjs';
import {sceneryPlan,isResource} from './scenery-plan.mjs';
export function createScenery(scene,options){
 const root=new T.Group();root.name='Native scenery';scene.add(root);let ready=null,disposed=false,chunks=[],key='';const assets=SCENERY_ASSETS.filter(a=>!isResource(a));
 const loaded=Promise.all(assets.map(async a=>[a.id,await loadStaticTemplate(a.path,a.stateAnimation)])).then(entries=>{if(disposed)return;ready=new Map(entries);rebuild()}).catch(console.error);
 function clear(){for(const m of [...root.children]){root.remove(m);m.dispose()}}
 function rebuild(){if(!ready||disposed)return;clear();const plan=sceneryPlan({...options,chunks,assets,nativeObjects:options.nativeObjects(),zones:options.clearZones()}),groups=new Map();for(const a of plan){if(!groups.has(a.id))groups.set(a.id,[]);groups.get(a.id).push(a)}const dummy=new T.Object3D();
 for(const[id,list]of groups){const source=ready.get(id);for(const part of source.parts){const mesh=new T.InstancedMesh(part.geom,part.material,list.length);mesh.castShadow=true;mesh.receiveShadow=true;mesh.raycast=()=>{};for(let i=0;i<list.length;i++){const a=list[i];dummy.position.set(a.x,options.heightAt(a.x,a.z),a.z);dummy.rotation.set(0,a.rotation,0);dummy.scale.setScalar(a.size/source.extent);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)}mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();root.add(mesh)}}root.userData={count:plan.length,nativeCount:plan.filter(p=>p.native).length,species:groups.size,placements:plan};
 }
 return {root,loaded,setChunks(next,force=false){const k=next.map(c=>c.cx+','+c.cz).join('|');chunks=next;if(k!==key||force){key=k;rebuild()}},dispose(){disposed=true;clear();scene.remove(root)}};
}
export async function attachNativeResource(node,isCurrent){
 const candidates=SCENERY_ASSETS.filter(a=>node.gas?/geyser|vespene|gas/i.test(a.category):/mineral/i.test(a.category));if(!candidates.length)return false;
 const index=Math.abs(Math.floor(node.x*13+node.z*7))%candidates.length,asset=candidates[index],source=await loadStaticTemplate(asset.path,asset.stateAnimation||(!node.gas?'Stand C_full':null));if(!isCurrent(node))return false;const group=new T.Group();group.name='Native resource '+asset.id;group.scale.setScalar(asset.size/source.extent);for(const part of source.parts){const mesh=new T.Mesh(part.geom,part.material);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh)}for(const child of node.mesh.children)child.visible=false;node.mesh.add(group);node.nativeVisual=group;node.nativeAsset=asset.id;return true;
}
