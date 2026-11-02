const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
export function terrainHeight(x,z,seed=12345,map='verdant'){
 const phase=(Number(seed)>>>0)*.00013;
 const broad=Math.sin(x*.023+phase)*Math.cos(z*.027-phase)*2.2;
 const detail=Math.sin(x*.081+z*.059+phase)*.3+Math.cos(x*.15-z*.12)*.12;
 const outside=smooth(50,120,Math.hypot(x,z));
 const ridges=Math.pow(Math.abs(Math.sin(x*.017+phase)*Math.cos(z*.022)),3)*6;
 const craters=Math.sin(Math.hypot(x-145,z+70)*.065)*1.1;
 const profile=map==='desert'?Math.sin(x*.055+Math.sin(z*.021))*1.7:map==='frost'?ridges*.55:map==='volcano'?craters+ridges*.65:ridges*.3;
 const spawn=Math.min(Math.hypot(x-31,z),Math.hypot(x+31,z));
 const flatten=.18+.82*smooth(9,25,spawn);
 return(broad+detail+outside*profile)*flatten;
}
export function biomeWeights(x,z,seed=12345,map='verdant'){
 const phase=(Number(seed)>>>0)*.00013,indices={verdant:0,desert:1,frost:2,volcano:3};
 const a=Math.sin(x*.011+phase)+Math.cos(z*.014-phase),b=Math.sin(x*.018-z*.008+phase);
 let weights=[Math.max(0,1-Math.abs(a)*.7),Math.max(0,b-.05),Math.max(0,a-.35),Math.max(0,-a-.35)];
 const sum=weights.reduce((a,b)=>a+b,0)||1;weights=weights.map(v=>v/sum);
 const central=1-smooth(58,110,Math.hypot(x,z));
 return weights.map((v,i)=>v*(1-central)+(i===(indices[map]??0)?central:0));
}
export function terrainNormal(x,z,seed,map){const e=.15,dx=(terrainHeight(x+e,z,seed,map)-terrainHeight(x-e,z,seed,map))/(2*e),dz=(terrainHeight(x,z+e,seed,map)-terrainHeight(x,z-e,seed,map))/(2*e),l=Math.hypot(dx,1,dz);return[-dx/l,1/l,-dz/l]}
