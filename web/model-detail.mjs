import * as T from './vendor/three/build/three.module.js';
const cache=new WeakMap();

// Vertex clustering retains UV islands and the exact skin-joint palette.
export function compactGeometry(source){
 if(cache.has(source))return cache.get(source);
 const pos=source.attributes.position;
 if(!pos||pos.count<2500||source.morphAttributes.position?.length){cache.set(source,source);return source}
 source.computeBoundingBox();const size=source.boundingBox.getSize(new T.Vector3()),cell=Math.max(size.x,size.y,size.z)/26;
 if(!(cell>0))return source;
 const attrs=Object.entries(source.attributes),groups=new Map(),remap=new Uint32Array(pos.count),vertices=[];
 for(let i=0;i<pos.count;i++){
  const uv=source.attributes.uv,j=source.attributes.skinIndex;
  const key=[Math.round(pos.getX(i)/cell),Math.round(pos.getY(i)/cell),Math.round(pos.getZ(i)/cell),uv?Math.floor(uv.getX(i)*4):0,uv?Math.floor(uv.getY(i)*4):0,j?Array.from({length:j.itemSize},(_,k)=>j.array[i*j.itemSize+k]).join(','):''].join('/');
  let id=groups.get(key);
  if(id===undefined){id=vertices.length;groups.set(key,id);vertices.push({count:0,values:attrs.map(([,a])=>Array(a.itemSize).fill(0))})}
  remap[i]=id;const v=vertices[id];v.count++;
  attrs.forEach(([name,a],n)=>{for(let k=0;k<a.itemSize;k++){const value=a.array[i*a.itemSize+k];if(name==='skinIndex')v.values[n][k]=value;else v.values[n][k]+=value}});
 }
 const indices=[],seen=new Set(),count=source.index?.count||pos.count;
 for(let i=0;i<count;i+=3){const tri=[0,1,2].map(k=>remap[source.index?source.index.getX(i+k):i+k]);if(new Set(tri).size<3)continue;const key=[...tri].sort((a,b)=>a-b).join(',');if(seen.has(key))continue;seen.add(key);indices.push(...tri)}
 if(indices.length>=count*.85||!indices.length){cache.set(source,source);return source}
 const low=new T.BufferGeometry();
 attrs.forEach(([name,a],n)=>{const values=[];for(const v of vertices)for(const x of v.values[n])values.push(name==='skinIndex'?x:x/v.count);const array=name==='skinIndex'?new Uint16Array(values):new Float32Array(values);low.setAttribute(name,new T.BufferAttribute(array,a.itemSize,false))});
 low.setIndex(indices);low.normalizeNormals();low.computeBoundingBox();low.computeBoundingSphere();
 low.userData.fullTriangles=count/3;low.userData.compactTriangles=indices.length/3;cache.set(source,low);return low;
}

export function setModelDetail(entity,compact){
 const visual=entity.mediaVisual;if(!visual||entity.kind||entity.mediaCompact===compact)return;
 visual.traverse(o=>{if(!o.isMesh)return;o.userData.fullGeometry??=o.geometry;o.userData.detailVisible??=o.visible;o.geometry=compact?compactGeometry(o.userData.fullGeometry):o.userData.fullGeometry;if(!o.isSkinnedMesh){o.userData.fullGeometry.computeBoundingSphere();o.visible=o.userData.detailVisible&&(!compact||o.userData.fullGeometry.boundingSphere.radius>=.13);}});
 entity.mediaCompact=compact;
}
