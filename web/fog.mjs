export class FogOfWar{
 constructor(saved=null,{radius=420,cell=4}={}){this.radius=radius;this.cell=cell;this.size=Math.ceil(radius*2/cell);this.visible=new Uint8Array(this.size*this.size);this.explored=new Uint8Array(this.visible.length);this.known=new Map();if(saved?.version===1&&saved.size===this.size&&typeof saved.explored==='string'&&saved.explored.length===this.explored.length&&/^[01]+$/.test(saved.explored)){for(let i=0;i<this.explored.length;i++)this.explored[i]=saved.explored.charCodeAt(i)-48;for(const k of (Array.isArray(saved.known)?saved.known:[]).slice(0,100))if(Number.isInteger(k.id)&&Number.isFinite(k.x)&&Number.isFinite(k.z))this.known.set(k.id,{...k})}}
 index(x,z){const cx=Math.floor((x+this.radius)/this.cell),cz=Math.floor((z+this.radius)/this.cell);return cx<0||cz<0||cx>=this.size||cz>=this.size?-1:cz*this.size+cx}
 canSee(x,z){const i=this.index(x,z);return i>=0&&this.visible[i]===1}
 hasExplored(x,z){const i=this.index(x,z);return i>=0&&this.explored[i]===1}
 update(entities,team){this.visible.fill(0);for(const e of entities){if(!e.alive||e.team!==team)continue;const r=e.sight||(e.kind?(e.kind==='sensortower'?30:e.kind==='base'?23:16):e.type==='air'?22:e.type==='worker'?13:18),cx=Math.floor((e.x+this.radius)/this.cell),cz=Math.floor((e.z+this.radius)/this.cell),n=Math.ceil(r/this.cell);for(let dz=-n;dz<=n;dz++)for(let dx=-n;dx<=n;dx++){const x=cx+dx,z=cz+dz;if(x<0||z<0||x>=this.size||z>=this.size||dx*dx+dz*dz>n*n)continue;const i=z*this.size+x;this.visible[i]=this.explored[i]=1}}
 const enemies=entities.filter(e=>e.alive&&e.kind&&e.team!==team&&e.team!==2);for(const [id,k]of this.known)if(this.canSee(k.x,k.z)&&!enemies.some(e=>e.id===id&&this.canSee(e.x,e.z)))this.known.delete(id);for(const e of enemies)if(this.canSee(e.x,e.z))this.known.set(e.id,{id:e.id,x:e.x,z:e.z,kind:e.kind,faction:e.faction});
 }
 serialize(){return{version:1,size:this.size,explored:Array.from(this.explored).join(''),known:[...this.known.values()]}}
}
