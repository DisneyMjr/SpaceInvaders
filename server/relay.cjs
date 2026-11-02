const {WebSocketServer,WebSocket}=require('ws');const crypto=require('node:crypto');
const FACTIONS=new Set(['solar','aether','swarm','veil','silex','root']),MAPS=new Set(['verdant','desert','frost','volcano']);
function createRelay(httpServer,{maxRooms=100,allowedOrigins=[]}={}){
 const rooms=new Map(),wss=new WebSocketServer({noServer:true,maxPayload:512*1024,perMessageDeflate:false});
 const send=(ws,m)=>{if(ws?.readyState===WebSocket.OPEN&&ws.bufferedAmount<2*1024*1024)ws.send(JSON.stringify(m))};
 const fail=(ws,message)=>send(ws,{type:'error',message});
 httpServer.on('upgrade',(req,socket,head)=>{if(new URL(req.url,'http://local').pathname!=='/multiplayer'||(allowedOrigins.length&&!allowedOrigins.includes(req.headers.origin))){socket.end('HTTP/1.1 403 Forbidden\r\n\r\n');return}wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws,req))});
 wss.on('connection',ws=>{ws.isAlive=true;ws.joined=false;ws.rate={time:Date.now(),count:0};ws.on('pong',()=>ws.isAlive=true);const joinDeadline=setTimeout(()=>{if(!ws.joined)ws.close(1008,'Entre em uma sala.');},15000);joinDeadline.unref();
  ws.on('message',raw=>{const now=Date.now();if(now-ws.rate.time>1000)ws.rate={time:now,count:0};if(++ws.rate.count>100){ws.close(1008,'Muitas mensagens.');return}let m;try{m=JSON.parse(raw.toString())}catch{return fail(ws,'Mensagem inválida.')}if(!m||typeof m!=='object')return;
   if(m.type==='join'){
    if(ws.joined)return fail(ws,'Você já está em uma sala.');const id=String(m.room||'').trim().toUpperCase();if(!/^[A-Z0-9_-]{4,32}$/.test(id))return fail(ws,'Use uma sala com 4 a 32 letras ou números.');if(m.protocol!==1)return fail(ws,'Atualize o jogo para a versão multiplayer atual.');const cfg=m.config||{};if(!FACTIONS.has(cfg.faction)||!MAPS.has(cfg.map))return fail(ws,'Facção ou mapa inválido.');let room=rooms.get(id);if(room?.started||room?.players.length===2)return fail(ws,'Sala cheia ou partida já iniciada.');
    if(!room){if(rooms.size>=maxRooms)return fail(ws,'Servidor cheio. Tente novamente.');room={id,players:[],started:false,map:cfg.map,seed:Number.isInteger(cfg.seed)?cfg.seed>>>0:crypto.randomInt(0,0x7fffffff),encounterSeed:crypto.randomInt(0,0x7fffffff)};rooms.set(id,room)}ws.room=room;ws.role=room.players.length===0?'host':'guest';ws.faction=cfg.faction;ws.joined=true;clearTimeout(joinDeadline);room.players.push(ws);send(ws,{type:'welcome',role:ws.role,room:id,protocol:1});
    if(room.players.length===1){send(ws,{type:'waiting',room:id});return}room.started=true;const start={type:'start',room:id,config:{map:room.map,seed:room.seed,encounterSeed:room.encounterSeed,players:room.players.map(p=>p.faction)}};for(const p of room.players)send(p,start);return;
   }
   const room=ws.room;if(!room?.started)return fail(ws,'Aguarde o segundo jogador.');const peer=room.players.find(p=>p!==ws);if(!peer)return;
   if(m.type==='command'&&ws.role==='guest'){
    const c=m.command,allowed=new Set(['move','attack','stop','gather','train','cancel','rally','placeBuilding','research','transport']);if(!c||!allowed.has(c.kind))return fail(ws,'Comando inválido.');if(c.ids&&(!Array.isArray(c.ids)||c.ids.length>200||!c.ids.every(Number.isInteger)))return fail(ws,'Seleção inválida.');if(['move','rally','placeBuilding'].includes(c.kind)&&(!Number.isFinite(c.x)||!Number.isFinite(c.z)||Math.abs(c.x)>420||Math.abs(c.z)>420))return fail(ws,'Destino inválido.');if(c.targets&&(!Array.isArray(c.targets)||c.targets.length>200||!c.targets.every(t=>Number.isInteger(t.id)&&Number.isFinite(t.x)&&Number.isFinite(t.z)&&Math.abs(t.x)<=420&&Math.abs(t.z)<=420)))return fail(ws,'Formação inválida.');send(peer,{type:'command',command:c});return;
   }
   if(m.type==='snapshot'&&ws.role==='host'){const d=m.data;if(!d||!Array.isArray(d.units)||d.units.length>400||!Array.isArray(d.buildings)||d.buildings.length>120||!Array.isArray(d.nodes)||d.nodes.length>100||!Number.isInteger(d.seq))return fail(ws,'Estado de partida inválido.');send(peer,{type:'snapshot',data:d});return}
   if(m.type==='feedback'&&ws.role==='host')send(peer,{type:'feedback',message:String(m.message||'').slice(0,180)});
  });
  ws.on('error',()=>{});ws.on('close',()=>{clearTimeout(joinDeadline);const room=ws.room;if(!room)return;rooms.delete(room.id);for(const peer of room.players)if(peer!==ws){peer.room=null;send(peer,{type:'peer_left',message:'O outro jogador saiu. Crie outra sala para uma nova partida.'});peer.close(1000,'Partida encerrada.')}});
 });
 const heartbeat=setInterval(()=>{for(const ws of wss.clients){if(!ws.isAlive){ws.terminate();continue}ws.isAlive=false;ws.ping()}},20000);heartbeat.unref();
 return {rooms,wss,close(){clearInterval(heartbeat);for(const ws of wss.clients)ws.terminate();wss.close()}};
}
module.exports={createRelay};
