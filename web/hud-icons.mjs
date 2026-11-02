const shapes={
 worker:'M8 8h16v16H8z M12 3v5m8-5v5M12 24v5m8-5v5M3 12h5m16 0h5M3 20h5m16 0h5 M12 12h8v8h-8z',
 soldier:'M8 14V9l4-5h8l4 5v5l-3 5H11z M9 11h14M12 12v3m8-3v3M8 27v-4l5-3m11 7v-4l-5-3M13 20l3 4 3-4',
 heavy:'M4 19h24v7H4z M8 14h14v5H8z M14 10h8v4h-8z M22 11h8M7 22h18M7 26v3m6-3v3m7-3v3m6-3v3',
 air:'M16 3l4 10 10 8-10-2-4 10-4-10-10 2 10-8z M16 7v15',
 hero:'M16 3l4 8 9 1-7 7 2 10-8-5-8 5 2-10-7-7 9-1z',
 sniper:'M16 3v7m0 12v7M3 16h7m12 0h7 M6 16a10 10 0 1 0 20 0a10 10 0 1 0-20 0 M13 16h6m-3-3v6',
 walker:'M10 4h12v10H10z M14 8h4M9 16h14v5H9z M10 21l-4 8m16-8 4 8M9 16l-5-4m19 4 5-4',
 medic:'M12 4h8v8h8v8h-8v8h-8v-8H4v-8h8z',
 building:'M4 13l12-9 12 9v15H4z M4 13h24M10 28V17h12v11M13 8h6',
 move:'M16 2v28M2 16h28M16 2l-4 5m4-5 4 5M30 16l-5-4m5 4-5 4M16 30l-4-5m4 5 4-5M2 16l5-4m-5 4 5 4',
 attack:'M4 4l24 24M4 28L28 4M5 11V5h6m10 0h6v6M5 21v6h6m10 0h6v-6',
 stop:'M7 7h18v18H7z',
 crystal:'M16 2l9 10-9 18-9-18z M7 12h18M16 2v28',
 gas:'M16 3l11 7v12l-11 7-11-7V10z M12 11h8v10h-8z',
 tech:'M16 3v8m0 10v8M3 16h8m10 0h8 M9 9l14 14m0-14L9 23M10 16a6 6 0 1 0 12 0a6 6 0 1 0-12 0',
 cancel:'M7 7l18 18M25 7L7 25',
 transport:'M4 12h9V4l15 12-15 12v-8H4z'};
export function hudIcon(type){return `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="${shapes[type]||shapes.soldier}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="square" stroke-linejoin="miter"/></svg>`}
export function actionAppearance(text){if(text.includes('Avançar'))return{icon:'attack',label:'Atacar',key:'A'};if(text==='Parar')return{icon:'stop',label:'Parar',key:'S'};if(text.includes('Construir'))return{icon:'building',label:'Construir',key:'B'};if(text.includes('cristais'))return{icon:'crystal',label:'Cristais'};if(text.includes('gás'))return{icon:'gas',label:'Gás'};if(text.includes('Cancelar'))return{icon:'cancel',label:'Cancelar'};if(text.includes('Transferir'))return{icon:'transport',label:'Nydus'};if(text.includes('Pesquisa')||text.includes('Pesquisar'))return{icon:'tech',label:'Pesquisa'};const first=text.split(' ')[0];return{icon:({Coletor:'worker',Infantaria:'soldier',Tanque:'heavy',Caça:'air',Comandante:'hero',Atirador:'sniper',Andarilho:'walker',Suporte:'medic'})[first]||'building',label:first}}
