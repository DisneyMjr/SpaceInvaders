const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(process.argv.find(a=>a.startsWith('--directory='))?.slice(12)||path.join(__dirname,'../web')),manifest=path.join(root,'deploy-manifest.json');
const required=['index.html','boot.mjs','game.js','tv.mjs','tv.css','command-shell.css','command-shell.mjs','menu-data.mjs','battle-hud.css','battle-hud.mjs','hud-icons.mjs','edge-scroll.mjs','assets/menu/commanders.png','assets/menu/orbital-background.png','vendor/three/build/three.module.js'];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]).filter(p=>p!==manifest&&!path.basename(p).startsWith('preview-'))}
if(process.argv.includes('--write')){const entries=Object.fromEntries(files(root).sort().map(p=>[path.relative(root,p).split(path.sep).join('/'),hash(p)]));fs.writeFileSync(manifest,JSON.stringify({version:'0.17.0',files:entries},null,2)+'\n')}
const errors=[];for(const name of required)if(!fs.existsSync(path.join(root,name)))errors.push('Arquivo obrigatório ausente: '+name);
if(!fs.existsSync(manifest))errors.push('Manifesto da distribuição ausente');else{const data=JSON.parse(fs.readFileSync(manifest,'utf8'));for(const [name,digest] of Object.entries(data.files)){const p=path.resolve(root,name);if(!p.startsWith(root+path.sep)){errors.push('Caminho inválido: '+name);continue}if(!fs.existsSync(p))errors.push('Arquivo do pacote ausente: '+name);else if(hash(p)!==digest)errors.push('Arquivo divergente do pacote: '+name)}}
for(const file of files(root)){
 if(!/\.(html|css|mjs|js)$/.test(file))continue;
 const text=fs.readFileSync(file,'utf8'),refs=[];
 if(/\.(mjs|js)$/.test(file))for(const m of text.matchAll(/(?:import|export)\s+(?:[^;\n]*?\s+from\s*)?['"](\.[^'"]+)['"]/g))refs.push(m[1]);
 if(file.endsWith('.html'))for(const m of text.matchAll(/(?:src|href)\s*=\s*['"]([^'"<>]+)['"]/g))refs.push(m[1]);
 if(file.endsWith('.css'))for(const m of text.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g))refs.push(m[1]);
 for(const ref of refs){if(/^(?:[a-z]+:|\/\/|#)/i.test(ref)||ref.includes('$')||ref.includes('+'))continue;const relative=ref.split(/[?#]/)[0];if(relative&&!fs.existsSync(path.resolve(path.dirname(file),relative)))errors.push(path.relative(root,file)+' referencia arquivo ausente: '+ref)}
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log('Distribuição web completa: '+files(root).length+' arquivos; imports, estilos, imagens e integridade verificados.');
