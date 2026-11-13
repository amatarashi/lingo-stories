import { toon, canvasTex } from '../stage.js';
export function buildGenerator({THREE,L,scene,add,box,cyl}) {
 scene.background=new THREE.Color('#101b25');
 add(box(6,.15,5),toon('#343f49'),0,-.1,0);
 add(box(6,3,.15),toon('#63717b'),0,1.5,-2);
 add(box(.15,3,5),toon('#45535e'),-3,1.5,0);
 add(box(.15,3,5),toon('#45535e'),3,1.5,0);
 for(const x of [-2.5,2.5]) add(cyl(.08,.08,5,10),toon('#a99c6a'),x,2.6,0,undefined,{rot:[Math.PI/2,0,0]});
 add(box(2,1.1,1),toon('#345e59'),0,.65,-1);
 for(let i=0;i<9;i++) add(box(.08,.65,.03),toon('#192b2d'),-.7+i*.17,.65,-.48);
 const lamp=new THREE.PointLight('#ffc98b',12,10);lamp.position.set(0,2.5,1);scene.add(lamp);
 const label=(text,x,y,w=1)=>{
 const tex=canvasTex(512,128,g=>{g.fillStyle='#eee2bd';g.fillRect(0,0,512,128);g.fillStyle='#172633';g.font='bold 42px monospace';g.textAlign='center';g.fillText(text,256,78);});
 return add(new THREE.PlaneGeometry(w,.25),new THREE.MeshBasicMaterial({map:tex}),x,y,-.38);
 };
 label('GENERATOR',0,2,2);
 for(const [key,x,y,color,title] of [['left',-.95,1.4,'#d1a044','RADIO'],['start',0,1.4,'#46be79','START'],['right',.95,1.4,'#579ac1','OLD ROOM'],['both',0,.7,'#ad86d9','BOTH']]){
 const mesh=add(box(.32,.35,.12),toon(color),x,y,-.35);L.clues[key]=mesh;label(title,x,y+.36,.85);
 }
 const paper=add(box(.7,.9,.03),toon('#eee2bd'),-2,1.35,-1.85);L.clues.map=paper;
 const plan=canvasTex(512,512,g=>{g.fillStyle='#eee2bd';g.fillRect(0,0,512,512);g.fillStyle='#253849';g.font='bold 34px monospace';['HEATING PLAN','LEFT: RADIO','RIGHT: OLD ROOM','START: ONE ROOM','GREEN: BOTH'].forEach((s,i)=>g.fillText(s,20,65+i*85));});
 add(new THREE.PlaneGeometry(.68,.88),new THREE.MeshBasicMaterial({map:plan}),-2,1.35,-1.82);
 L.fx={press:key=>{if(L.clues[key]&&key!=='map')L.clues[key].material.color.set('#82ffb2');},reset:()=>{}};
 L.spots={};L.pan=.6;
 const wide=()=>({pos:[0,1.9,3.1],at:[0,1.2,-1],fov:65,portrait:{pos:[0,2.1,4],at:[0,1,-1],fov:75}});
 L.shots={wide,establish:wide,map:()=>({pos:[-2,1.5,.1],at:[-2,1.2,-1.8],fixed:true})};
}
