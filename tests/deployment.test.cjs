const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawnSync}=require('node:child_process');
test('publication validator rejects missing menu modules and changed files',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'spaceinvaders-release-'));
 const required=['index.html','boot.mjs','game.js','tv.mjs','tv.css','command-shell.css','command-shell.mjs','menu-data.mjs','battle-hud.css','battle-hud.mjs','hud-icons.mjs','edge-scroll.mjs','assets/menu/commanders.png','assets/menu/orbital-background.png','vendor/three/build/three.module.js'];
 const run=(...args)=>spawnSync(process.execPath,[path.resolve(__dirname,'../scripts/validate-web.cjs'),'--directory='+root,...args],{encoding:'utf8'});
 try{for(const f of required){const p=path.join(root,f);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,'')}
 fs.writeFileSync(path.join(root,'game.js'),'// first\r\n// second\r\n');fs.writeFileSync(path.join(root,'assets/menu/commanders.png'),Buffer.from([137,80,13,10,26,10]));
 const license=path.join(root,'vendor/three/LICENSE');fs.writeFileSync(license,'MIT License\r\nCopyright contributors\r\n');
 assert.equal(run('--write').status,0);
 fs.writeFileSync(license,'MIT License\nCopyright contributors\n');assert.equal(run().status,0,'Extensionless license must validate after Linux checkout');
 fs.writeFileSync(license,'MIT License\r\nCopyright contributors\r\n');assert.equal(run().status,0,'Extensionless license must validate after Windows checkout');
 fs.writeFileSync(license,'MIT License\nchanged license\n');const changedLicense=run();assert.equal(changedLicense.status,1);assert.match(changedLicense.stderr,/Arquivo divergente.*LICENSE/);fs.writeFileSync(license,'MIT License\nCopyright contributors\n');
 fs.writeFileSync(path.join(root,'game.js'),'// first\n// second\n');assert.equal(run().status,0,'CRLF and LF must validate equally');
 fs.writeFileSync(path.join(root,'game.js'),'// first\r\n// second\r\n');assert.equal(run().status,0,'Windows checkout must validate');
 fs.writeFileSync(path.join(root,'assets/menu/commanders.png'),Buffer.from([137,80,10,26,10]));const binary=run();assert.equal(binary.status,1);assert.match(binary.stderr,/Arquivo divergente.*commanders\.png/);fs.writeFileSync(path.join(root,'assets/menu/commanders.png'),Buffer.from([137,80,13,10,26,10]));
 fs.unlinkSync(path.join(root,'command-shell.mjs'));const missing=run();assert.equal(missing.status,1);assert.match(missing.stderr,/command-shell\.mjs/);
 fs.writeFileSync(path.join(root,'command-shell.mjs'),'');fs.writeFileSync(path.join(root,'game.js'),'// truncated release');const changed=run();assert.equal(changed.status,1);assert.match(changed.stderr,/Arquivo divergente.*game\.js/);
 }finally{const resolved=path.resolve(root);assert(resolved.startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(resolved).startsWith('spaceinvaders-release-'));fs.rmSync(resolved,{recursive:true,force:true})}
});
