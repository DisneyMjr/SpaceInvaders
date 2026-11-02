import * as T from 'three';
const size=210,data=new Uint8Array(size*size),texture=new T.DataTexture(data,size,size,T.RedFormat,T.UnsignedByteType);texture.minFilter=texture.magFilter=T.LinearFilter;texture.generateMipmaps=false;const uniform={value:texture};
export function paintFog(fog){for(let i=0;i<data.length;i++)data[i]=fog.visible[i]?255:fog.explored[i]?65:0;texture.needsUpdate=true}
export function patchFogMaterials(scene){scene.traverse(o=>{if(!o.isMesh)return;for(const m of Array.isArray(o.material)?o.material:[o.material]){if(!m||m.userData.siFog||m.userData.noFog)continue;m.userData.siFog=true;const before=m.onBeforeCompile,key=m.customProgramCacheKey?.bind(m);m.onBeforeCompile=function(shader,renderer){before?.call(this,shader,renderer);shader.uniforms.siFog=uniform;shader.vertexShader='varying vec2 vSiFogUv;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`#include <project_vertex>
vec4 siWorld=vec4(transformed,1.0);
#ifdef USE_INSTANCING
siWorld=instanceMatrix*siWorld;
#endif
siWorld=modelMatrix*siWorld;vSiFogUv=(siWorld.xz+vec2(420.0))/840.0;`);shader.fragmentShader='uniform sampler2D siFog;varying vec2 vSiFogUv;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <dithering_fragment>','#include <dithering_fragment>\nfloat siVisibility=texture2D(siFog,vSiFogUv).r;gl_FragColor.rgb=mix(vec3(0.002,0.004,0.008),gl_FragColor.rgb,siVisibility);')};const oldKey=key?key():'';m.customProgramCacheKey=()=>oldKey+'-fog-v1';m.needsUpdate=true}})}
