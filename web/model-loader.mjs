import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

// Large embedded PNG maps can fail to decode as ImageBitmap in the embedded
// browser. Use the ordinary image decoder while preserving glTF sampler rules.
export function createModelLoader({maxTextureSize=1024}={}){
 const loader=new GLTFLoader();
 loader.register(parser=>({
  name:'SPACEINVADERS_IMAGE_DECODER',
  async loadTexture(index){
   const def=parser.json.textures[index];
   if(def.source===undefined)return null;
   const source=parser.json.images[def.source];
   if(source.bufferView===undefined&&!source.uri)return null;
   const embedded=source.bufferView!==undefined;
   const bytes=embedded?await parser.getDependency('bufferView',source.bufferView):null;
   const url=embedded?URL.createObjectURL(new Blob([bytes],{type:source.mimeType||'image/png'})):new URL(source.uri,new URL(parser.options.path||'./',document.baseURI)).href;
   let image;
   try{image=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Falha ao decodificar textura '+index));img.src=url})}
   finally{if(embedded)URL.revokeObjectURL(url)}
   // Keep the source GLB intact; limit GPU memory for an RTS with many units.
   if(Math.max(image.width,image.height)>maxTextureSize){
    const ratio=maxTextureSize/Math.max(image.width,image.height),canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(image.width*ratio));canvas.height=Math.max(1,Math.round(image.height*ratio));
    canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);image=canvas;
   }
   const texture=new THREE.Texture(image);texture.flipY=false;
   const sampler=parser.json.samplers?.[def.sampler]||{};
   const filters={9728:THREE.NearestFilter,9729:THREE.LinearFilter,9984:THREE.NearestMipmapNearestFilter,9985:THREE.LinearMipmapNearestFilter,9986:THREE.NearestMipmapLinearFilter,9987:THREE.LinearMipmapLinearFilter};
   const wraps={33071:THREE.ClampToEdgeWrapping,33648:THREE.MirroredRepeatWrapping,10497:THREE.RepeatWrapping};
   texture.magFilter=filters[sampler.magFilter]||THREE.LinearFilter;
   texture.minFilter=filters[sampler.minFilter]||THREE.LinearMipmapLinearFilter;
   texture.wrapS=wraps[sampler.wrapS]||THREE.RepeatWrapping;texture.wrapT=wraps[sampler.wrapT]||THREE.RepeatWrapping;
   texture.name=def.name||source.name||'';texture.needsUpdate=true;
   return texture;
  }
 }));
 return loader;
}
