import * as THREE from 'three';
import {createModelLoader} from './model-loader.mjs?v=2';
import {modelAssets} from './assets/registry.mjs';
import {factions} from './factions.mjs';

const roles=['solar.hero','swarm.hero','aether.hero','veil.hero'];
const portraits=new Map();
let queue=Promise.resolve();

async function renderPortrait(role,closeup=false){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});
 renderer.setSize(closeup?240:480,closeup?280:900);renderer.setClearColor(0,0);
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 const scene=new THREE.Scene();
 scene.add(new THREE.HemisphereLight(0xdcefff,0x273343,2.4));
 const key=new THREE.DirectionalLight(0xfff2da,3);key.position.set(4,8,7);scene.add(key);
 const rim=new THREE.DirectionalLight(factions[role.split('.')[0]]?.color||0x82bfff,3);rim.position.set(-5,3,-3);scene.add(rim);
 let model;
 try{
  const gltf=await createModelLoader().loadAsync(modelAssets[role].path);model=gltf.scene;
  const clip=gltf.animations.find(c=>c.name==='Attack');
  if(clip){const mixer=new THREE.AnimationMixer(model);mixer.clipAction(clip).play();mixer.setTime(Math.min(.18,clip.duration*.25));}
  model.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
  const scale=2/size.y;model.scale.setScalar(scale);model.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);scene.add(model);
  const aspect=closeup?240/280:480/900;
  const width=Math.max(1.12,size.x*scale*1.12),height=closeup?(/heavy|walker|air/.test(role)?2.25:1.25):Math.max(2.15,width/aspect);
  const camera=new THREE.OrthographicCamera(-height*aspect/2,height*aspect/2,height/2,-height/2,.01,30);
  const target=closeup?(/heavy|walker|air/.test(role)?1:1.48):1;
  camera.position.set(1.5,target+.3,7);camera.lookAt(0,target,0);
  renderer.render(scene,camera);return renderer.domElement.toDataURL('image/png');
 }finally{
  model?.traverse(o=>{o.geometry?.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])if(m){for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();}});
  renderer.dispose();renderer.forceContextLoss();
 }
}

export function applyCommanderPortrait(el,index){
 applyUnitPortrait(el,roles[index]||roles[0]);
}

export function applyUnitPortrait(el,role,closeup=false){
 role=modelAssets[role]?role:'solar.hero';
 const cacheKey=role+(closeup?':closeup':':full');
 if(el.dataset.commander===cacheKey)return;
 el.dataset.commander=cacheKey;el.style.removeProperty('--commander-art');
 el.style.setProperty('--sprite-ratio','0.5333');
 if(!portraits.has(cacheKey)){
  const task=queue.then(()=>renderPortrait(role,closeup));portraits.set(cacheKey,task);queue=task.catch(()=>{});
 }
 portraits.get(cacheKey).then(url=>{if(el.dataset.commander===cacheKey)el.style.setProperty('--commander-art',`url("${url}")`);}).catch(error=>{delete el.dataset.commander;portraits.delete(cacheKey);console.error('Retrato da unidade:',error);});
}
