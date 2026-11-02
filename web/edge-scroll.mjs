// Convert window-edge mouse movement to camera-relative ground movement.
export function createEdgeScroller(win,doc){
 let mouse=null;
 const reset=()=>{mouse=null};
 win.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&e.clientX>=0&&e.clientY>=0&&e.clientX<win.innerWidth&&e.clientY<win.innerHeight)mouse={x:e.clientX,y:e.clientY};else reset()});
 win.addEventListener('pointerout',e=>{if(!e.relatedTarget)reset()});
 win.addEventListener('blur',reset);
 doc.addEventListener('visibilitychange',reset);
 return {reset,delta(dt,angle,enabled=true){
  if(!enabled||!mouse||doc.hidden)return {x:0,z:0};
  const margin=14;
  let x=mouse.x<margin?-1:mouse.x>=win.innerWidth-margin?1:0;
  let y=mouse.y<margin?-1:mouse.y>=win.innerHeight-margin?1:0;
  const length=Math.hypot(x,y)||1,speed=28*Math.min(Math.max(dt,0),.05)/length;
  return {x:(Math.cos(angle)*x+Math.sin(angle)*y)*speed,z:(-Math.sin(angle)*x+Math.cos(angle)*y)*speed};
 }};
}
