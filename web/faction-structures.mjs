import * as T from './vendor/three/build/three.module.js';
import {baseRace,factions} from './factions.mjs';
let plating;
function platingMap(){
 if(plating||typeof document==='undefined')return plating;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#a2a9ae';ctx.fillRect(0,0,256,256);
 for(let y=0;y<256;y+=32)for(let x=0;x<256;x+=64){ctx.strokeStyle='#4d5a62';ctx.strokeRect(x+2,y+2,60,28);ctx.fillStyle='#d3d7d9';for(const dx of [6,58]){ctx.beginPath();ctx.arc(x+dx,y+6,1.5,0,Math.PI*2);ctx.fill()}}
 for(let i=0;i<900;i++){const x=(i*73)%256,y=(i*131)%256;ctx.fillStyle=i%2?'#d2d7da33':'#38485222';ctx.fillRect(x,y,i%5+1,1)}
 plating=new T.CanvasTexture(canvas);plating.colorSpace=T.SRGBColorSpace;plating.wrapS=plating.wrapT=T.RepeatWrapping;return plating;
}

// Original architecture, built in metres around the local ground plane.
export function createFactionStructure(def){
 const root=new T.Group(),race=baseRace(def.faction),color=factions[def.faction]?.color||0x29bcff;
 const metal=new T.MeshStandardMaterial({color:race==='solar'?0x9aa9b5:0xc3af8b,map:platingMap()||null,metalness:.35,roughness:.58});
 const dark=new T.MeshStandardMaterial({color:0x182329,metalness:.6,roughness:.7});
 const trim=new T.MeshStandardMaterial({color,metalness:.65,roughness:.35});
 const glow=new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:1.4,roughness:.35});
 const flesh=new T.MeshStandardMaterial({color:def.faction==='root'?0x514134:0x384c34,roughness:.6,metalness:.05});
 const shell=new T.MeshStandardMaterial({color:def.faction==='root'?0x3c293b:0x293c39,roughness:.4,metalness:.2});
 const mesh=(g,m,p=[0,0,0],scale=[1,1,1])=>{const o=new T.Mesh(g,m);o.position.set(...p);o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;root.add(o);return o};
 const drum=(r,h,p,m=metal)=>mesh(new T.CylinderGeometry(r,r,h,24,1),m,p);
 const orb=(r,p,m,scale=[1,1,1])=>mesh(new T.SphereGeometry(r,24,16),m,p,scale);
 const hoop=(r,p,m=trim)=>{const o=mesh(new T.TorusGeometry(r,.035,6,32),m,p);o.rotation.x=Math.PI/2;return o};
 const tube=(points,r,m=dark)=>mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),16,r,7,false),m);
 const hq=def.isHQ,production=def.role==='production',defense=def.role==='defense',gas=def.role==='gas';
 const count=hq?8:production?6:4;
 if(race==='swarm'){
  orb(1.1,[0,.85,0],flesh,[1.5,.9,1.3]);
  orb(.86,[0,1.6,0],shell,[1.05,hq?1.8:1,1]);
  for(let i=0;i<count;i++){const a=i*Math.PI*2/count,x=Math.cos(a),z=Math.sin(a);
   tube([[x*.7,1.4,z*.7],[x*1.2,.7,z*1.2],[x*1.7,.22,z*1.7],[x*2.1,.05,z*2.1]],.13,shell);
   orb(.24,[x*.98,1.1,z*.98],glow,[1,1.4,1]);
   const spine=mesh(new T.ConeGeometry(.17,hq?1.2:.7,10),shell,[x*.7,2,z*.7]);spine.rotation.z=-x*.4;spine.rotation.x=z*.4;
  }
  if(production||gas)for(let i=0;i<3;i++)orb(.5,[Math.cos(i*2.1)*1.2,.7,Math.sin(i*2.1)*1.2],glow,[1,1.4,1]);
 }else if(race==='solar'){
  drum(1.65,.28,[0,.14,0],dark);
  const profile=[[0,0],[1.6,0],[1.6,.25],[1.42,.8],[1.08,1.05],[0,1.05]].map(([x,y])=>new T.Vector2(x,y));
  mesh(new T.LatheGeometry(profile,32),metal,[0,.25,0]);
  drum(1.05,.15,[0,1.35,0]);hoop(1,[0,1.45,0]);
  for(let i=0;i<count;i++){const a=i*Math.PI*2/count,x=Math.cos(a),z=Math.sin(a);
   const panel=mesh(new T.CylinderGeometry(.17,.22,.75,8),dark,[x*1.35,.7,z*1.35]);panel.rotation.z=-z*.2;panel.rotation.x=x*.2;
   orb(.075,[x*1.52,.75,z*1.52],glow);
   for(let j=0;j<3;j++)tube([[x*.65,1.48+j*.035,z*.65],[x*.95,1.48+j*.035,z*.95]],.018,dark);
  }
  if(hq){drum(.6,.7,[0,1.8,0]);const dish=orb(.65,[0,2.35,0],metal,[1,.2,1]);dish.rotation.z=.3;drum(.03,1.5,[.95,2,0],trim);orb(.07,[.95,2.8,0],glow);for(const x of [-1,1]){drum(.27,.5,[x,.9,.6],dark);for(let k=0;k<5;k++)hoop(.28,[x,.72+k*.08,.6],metal);tube([[x*.6,1.4,-.5],[x,1.6,-.7],[x*1.35,.5,-.7]],.055,trim)}}
  if(production){for(const x of [-.8,.8]){drum(.35,.8,[x,1.65,-.4]);hoop(.35,[x,1.9,-.4]);}orb(.5,[0,.65,1.1],dark,[1,.9,.3]);}
 }else{
  drum(1.5,.3,[0,.15,0],dark);drum(.9,1.7,[0,1,0]);
  drum(.55,1.8,[0,1.5,0],dark);drum(.4,1.7,[0,1.5,0],glow);
  for(let i=0;i<count;i++){const a=i*Math.PI*2/count,x=Math.cos(a),z=Math.sin(a);
   drum(.21,1.6,[x*1.13,1,z*1.13]);hoop(.22,[x*1.13,1.65,z*1.13]);
   tube([[x*.6,2,z*.6],[x*1.2,2.25,z*1.2],[x*1.45,1,z*1.45],[x*1.6,.3,z*1.6]],.075,trim);
  }
  for(const y of [.35,1,1.75,2.4]){drum(1.02,.1,[0,y,0],dark);hoop(.98,[0,y+.06,0]);}
  if(hq||gas)for(const x of [-.7,.7]){drum(.18,1.6,[x,2.3,-.5],dark);drum(.23,.15,[x,3.1,-.5]);}
 }
 if(defense){const turret=new T.Group();root.add(turret);const barrel=mesh(new T.CylinderGeometry(.14,.2,1.7,16),race==='swarm'?shell:metal,[0,2.1,.5]);barrel.rotation.x=Math.PI/2;turret.attach(barrel);root.userData.turret=turret;}
 if(!hq&&!production&&!defense&&!gas){orb(.45,[0,2,0],glow);hoop(.65,[0,1.95,0]);}
 // Small catalog-specific differences keep research/support/transport recognizable.
 const seed=[...def.nativeId].reduce((a,c)=>a+c.charCodeAt(0),0);
 root.rotation.y=(seed%8)*Math.PI/4;root.scale.y=1+(seed%4)*.045;
 root.updateMatrixWorld(true);
 const inverse=root.matrixWorld.clone().invert(),batches=new Map();
 root.traverse(o=>{if(!o.isMesh)return;const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(inverse.clone().multiply(o.matrixWorld));let bucket=batches.get(o.material);if(!bucket){bucket={position:[],normal:[],uv:[]};batches.set(o.material,bucket)}for(const name of ['position','normal','uv']){const a=g.attributes[name];if(a)for(const value of a.array)bucket[name].push(value)}g.dispose();o.geometry.dispose()});
 root.clear();delete root.userData.turret;
 for(const [material,attrs]of batches){const g=new T.BufferGeometry();for(const [name,values]of Object.entries(attrs))if(values.length)g.setAttribute(name,new T.Float32BufferAttribute(values,name==='uv'?2:3));const o=new T.Mesh(g,material);o.castShadow=o.receiveShadow=true;root.add(o)}
 root.userData.originalArchitecture=true;root.userData.faction=def.faction;root.userData.role=def.role;
 return {scene:root,animations:[],size:def.size};
}
