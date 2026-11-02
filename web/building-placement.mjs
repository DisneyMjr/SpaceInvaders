import * as T from 'three';
export function createBuildingPlacement(scene,{definition,validate,commit,onChange}){
 let active=null;
 function cancel(){if(active){scene.remove(active.ghost);active.ghost.geometry.dispose();active.ghost.material.dispose();active=null}onChange(null)}
 function move(x,z){if(!active)return;const result=validate(active.kind,x,z);active.point={x,z};active.result=result;active.ghost.position.set(x,result.height+1,z);active.ghost.material.color.setHex(result.ok?0x44ffb0:0xff4455);onChange(active)}
 return {get active(){return active},start(kind,x,z){cancel();const d=definition(kind),ghost=new T.Mesh(new T.BoxGeometry(d.footprint,1.5,d.footprint),new T.MeshBasicMaterial({color:0x44ffb0,transparent:true,opacity:.6,depthWrite:false,depthTest:false,fog:false,toneMapped:false}));ghost.material.userData.noFog=true;ghost.renderOrder=999;ghost.raycast=()=>{};scene.add(ghost);active={kind,ghost,definition:d,point:null,result:null};move(x,z)},move,cancel,confirm(){if(!active?.point)return false;const {kind,point}=active,built=commit(kind,point.x,point.z);if(built)cancel();else move(point.x,point.z);return !!built},dispose:cancel};
}
