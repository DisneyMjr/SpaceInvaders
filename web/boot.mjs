import {mountTv} from './tv.mjs';
const loading=document.getElementById('boot-status');
mountTv();
try{
 const files=['command-shell.css','command-shell.mjs','menu-data.mjs','battle-hud.css','battle-hud.mjs','hud-icons.mjs','edge-scroll.mjs'];
 const results=await Promise.all(files.map(async file=>{try{const r=await fetch(new URL(file,import.meta.url),{cache:'no-cache'});if(!r.ok||r.headers.get('content-type')?.includes('text/html'))return file}catch{return file}}));
 const missing=results.filter(Boolean);if(missing.length)throw Error('Arquivos ausentes na publicação: '+missing.join(', '));
 await import('./game.js');loading.remove();
}catch(error){
 console.error('Falha ao carregar SpaceInvaders:',error);
 document.getElementById('boot-title').textContent='Não foi possível carregar o jogo';
 document.getElementById('boot-message').textContent=error.message||'Confira se todos os arquivos da versão web foram enviados.';
 document.getElementById('boot-recovery').hidden=false;
}
document.getElementById('boot-retry')?.addEventListener('click',()=>location.reload());
document.getElementById('boot-refresh')?.addEventListener('click',async()=>{
 const button=document.getElementById('boot-refresh');button.disabled=true;
 try{const registration=await navigator.serviceWorker?.getRegistration(new URL('./',import.meta.url));if(registration?.scope===new URL('./',import.meta.url).href)await registration.unregister();if('caches'in window){const names=await caches.keys();await Promise.all(names.filter(n=>n.startsWith('spaceinvaders-')).map(n=>caches.delete(n)))}location.reload()}catch{document.getElementById('boot-message').textContent='Não foi possível limpar a versão antiga. Tente recarregar com Ctrl + Shift + R.';button.disabled=false}
});
