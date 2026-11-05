import {hudIcon,actionAppearance} from './hud-icons.mjs';
import {applyUnitPortrait} from './commander-portraits.mjs';
export function mountBattleHud(bridge){
 const $=id=>document.getElementById(id),root=$('battle-interface'),cards=$('selection-cards'),canvas=$('world-healthbars'),ctx=canvas.getContext('2d');let signature='',lastUiUpdate=0;const previousHp=new Map();let alertUntil=0;
 for(const id of ['battle-alert','production-summary'])if(!$(id)){const p=document.createElement('div');p.id=id;p.hidden=true;p.setAttribute('role','status');root.append(p)}
 for(const [button,panel] of [['hud-options-toggle','battle-options'],['hud-help-toggle','battle-help'],['hud-help-small','battle-help']])$(button).onclick=()=>$(panel).hidden=!$(panel).hidden;
 $('close-battle-options').onclick=()=>$('battle-options').hidden=true;$('close-battle-help').onclick=()=>$('battle-help').hidden=true;
 $('quick-army').onclick=()=>$('army').click();$('hero-control').onclick=()=>bridge.hero();
 for(let i=1;i<=9;i++){const b=document.createElement('button');b.textContent=i;b.onclick=e=>bridge.group(String(i),e.ctrlKey||e.metaKey);$('control-groups').append(b)}
 function update(){const s=bridge.state();root.hidden=!s.active;if(!s.active){previousHp.clear();alertUntil=0;return}const now=performance.now();if(now-lastUiUpdate<100){draw(s);return}lastUiUpdate=now;
 for(const entity of s.entities){const hp=previousHp.get(entity.id);if(entity.team===s.team&&hp!==undefined&&entity.hp<hp){alertUntil=now+4500;$('battle-alert').textContent=bridge.label(entity)+' sob ataque!';}previousHp.set(entity.id,entity.hp)}
 for(const id of previousHp.keys())if(!s.entities.some(e=>e.id===id))previousHp.delete(id);
 $('battle-alert').hidden=now>alertUntil;
 const production=s.entities.filter(e=>e.team===s.team&&e.production?.length);
 $('production-summary').hidden=!production.length;
 $('production-summary').textContent=production.map(e=>bridge.label(e)+' · '+e.production.length+' na fila · '+Math.ceil(e.production[0].remaining)+'s').join(' | ');
 const chosen=s.entities.filter(e=>s.selection.has(e.id)),key=chosen.map(e=>e.id).join(',');
 if(key!==signature){signature=key;cards.replaceChildren();for(const e of chosen.slice(0,36)){const b=document.createElement('button');b.dataset.entity=e.id;b.title=bridge.label(e);b.setAttribute('aria-label',bridge.label(e));b.innerHTML=hudIcon(e.kind?'building':e.type)+'<span class="card-hp"><i></i></span>';b.onclick=ev=>bridge.select(e,ev.shiftKey);b.ondblclick=()=>bridge.focus(e);cards.append(b)}}
 for(const b of cards.children){const e=chosen.find(e=>String(e.id)===b.dataset.entity);if(!e)continue;const ratio=Math.max(0,e.hp/e.maxHp),bar=b.querySelector('i');bar.style.width=ratio*100+'%';bar.style.background=ratio<.3?'#ff5b50':ratio<.6?'#ffcd5b':'#42ed77'}
 $('selection-count').textContent=chosen.length?chosen.length+' SELECIONADAS':'SELEÇÃO';$('selection-overflow').hidden=chosen.length<=36;$('selection-overflow').textContent='+'+(chosen.length-36)+' unidades';
 const e=chosen[0];$('portrait-name').textContent=e?bridge.label(e).split(' · ').at(-1):'COMANDANTE';$('portrait-name').title=e?bridge.label(e):'COMANDANTE';$('portrait-hp').textContent=e?Math.ceil(e.hp)+' / '+e.maxHp:'';$('portrait-health-fill').style.width=e?Math.max(0,e.hp/e.maxHp)*100+'%':'0';
 const faction=e?.faction||s.faction,role=faction+'.'+(e?.type||'hero');
 applyUnitPortrait($('unit-portrait'),role,true);
 $('unit-portrait').setAttribute('aria-label',e?bridge.label(e):'Comandante · '+faction);
 $('unit-portrait').style.setProperty('--portrait-accent',({solar:'#29bcff',veil:'#b89aff',aether:'#ffcf61',silex:'#ff8366',swarm:'#88f271',root:'#e7a95d'})[faction]||'#29bcff');
 for(const b of cards.children){const unit=chosen.find(e=>String(e.id)===b.dataset.entity);if(unit?.type){b.classList.add('model-card');applyUnitPortrait(b,unit.faction+'.'+unit.type,true);}}
 $('worker-count').textContent=s.entities.filter(e=>e.team===s.team&&e.type==='worker').length;$('army-count').textContent=s.entities.filter(e=>e.team===s.team&&e.type&&e.type!=='worker').length;$('hero-control').disabled=!s.entities.some(e=>e.team===s.team&&e.type==='hero');
 [...$('control-groups').children].forEach((b,i)=>{const n=(s.groups.get(String(i+1))||[]).filter(id=>s.entities.some(e=>e.id===id&&e.team===s.team)).length;b.title='Grupo '+(i+1)+' · '+n+' unidades · Ctrl + clique para atribuir';b.style.opacity=n?'1':'.35'});
 $('command-hint').textContent=e?(matchMedia('(pointer:coarse)').matches?'Toque no terreno para ordenar.':e.kind?'Direito: ponto de saída':'Direito: mover · A + clique: atacar'):'Selecione suas tropas.';
 for(const b of $('actions').querySelectorAll('button'))if(!b.dataset.decorated){const text=b.textContent,a=actionAppearance(text);b.dataset.decorated='true';b.title=text;b.setAttribute('aria-label',text);b.replaceChildren();b.insertAdjacentHTML('beforeend',hudIcon(a.icon));const caption=document.createElement('span');caption.className='action-caption';caption.textContent=a.label;caption.setAttribute('aria-hidden','true');b.append(caption);const original=document.createElement('span');original.className='hud-sr';original.textContent=text;b.append(original);if(a.key){const k=document.createElement('kbd');k.textContent=a.key;b.append(k)}}
 draw(s);
 }
 function draw(s){if(canvas.width!==innerWidth||canvas.height!==innerHeight){canvas.width=innerWidth;canvas.height=innerHeight}ctx.clearRect(0,0,canvas.width,canvas.height);for(const e of s.entities){if(!s.selection.has(e.id)&&e.hp>=e.maxHp)continue;if(e.team!==s.team&&!bridge.visible(e))continue;const p=bridge.project(e);if(!p||p.z>1||p.z< -1||p.x<0||p.x>innerWidth||p.y<0||p.y>innerHeight-195)continue;const w=e.kind?46:30,x=Math.round(p.x-w/2),y=Math.round(p.y),r=Math.max(0,Math.min(1,e.hp/e.maxHp));ctx.fillStyle='#020604';ctx.fillRect(x-1,y-1,w+2,6);ctx.fillStyle='#26372c';ctx.fillRect(x,y,w,4);ctx.fillStyle=e.team!==s.team?'#ed5149':r<.3?'#ff6550':r<.6?'#e5c34f':'#48e77b';ctx.fillRect(x,y,w*r,4);ctx.fillStyle='#06120a';for(let i=5;i<w;i+=6)ctx.fillRect(x+i,y,1,4)}}
 return{update};
}
