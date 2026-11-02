import * as THREE from 'three';
export const terrainNames={verdant:'Bosque de Éter',desert:'Dunas de Ferrugem',frost:'Planalto Boreal',volcano:'Caldeira Obsidiana'};
export const terrainFiles=['terrain.mjs','terrain-math.mjs',...Object.keys(terrainNames).flatMap(name=>['assets/terrain/'+name+'.png','assets/terrain/'+name+'-normal.png']),'assets/terrain/volcano-emissive.png'];
const loader=new THREE.TextureLoader(),names=Object.keys(terrainNames),textures={};
const load=(path,color)=>{const t=loader.load(path);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=color?THREE.SRGBColorSpace:THREE.NoColorSpace;t.anisotropy=4;return t};
for(const name of names)textures[name]={color:load('./assets/terrain/'+name+'.png',true),normal:load('./assets/terrain/'+name+'-normal.png',false)};
const emission=load('./assets/terrain/volcano-emissive.png',true);

export function makeTerrainMaterial(){
 const material=new THREE.MeshStandardMaterial({map:textures.verdant.color,normalMap:textures.verdant.normal,normalScale:new THREE.Vector2(.4,.4),vertexColors:true,roughness:.96,metalness:0,emissiveMap:emission,emissive:0xff8c56,emissiveIntensity:.7,side:THREE.DoubleSide});
 material.userData.sharedTerrain=true;
 material.onBeforeCompile=shader=>{
  names.forEach((name,i)=>{shader.uniforms['siColor'+i]={value:textures[name].color};shader.uniforms['siNormal'+i]={value:textures[name].normal}});
  shader.vertexShader='attribute vec4 siWeights; varying vec4 vSiWeights;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSiWeights = siWeights;');
  const uniforms='varying vec4 vSiWeights;\n'+names.map((_,i)=>'uniform sampler2D siColor'+i+'; uniform sampler2D siNormal'+i+';').join('\n');
  const sample=(name,prefix)=>`vec3 ${name}(vec2 uv){ vec3 c=vec3(0.0);\n`+['x','y','z','w'].map((c,i)=>`if(vSiWeights.${c}>0.0001)c+=texture2D(${prefix}${i},uv).rgb*vSiWeights.${c};`).join('\n')+'return c;}\n';
  shader.fragmentShader=uniforms+'\n'+sample('siColor','siColor')+sample('siNormal','siNormal')+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','diffuseColor.rgb *= siColor(vMapUv);');
  const normalChunk=THREE.ShaderChunk.normal_fragment_maps.replaceAll('texture2D( normalMap, vNormalMapUv ).xyz','siNormal(vNormalMapUv)');
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',normalChunk);
  shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance *= vSiWeights.w;');
 };
 material.customProgramCacheKey=()=> 'spaceinvaders-biome-splat-v1';
 return material;
}
