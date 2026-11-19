// Uses the optional local Playwright installation; never talks to a real Telegram account.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('../.runtime/browser/node_modules/playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.runtime/rights-verify');fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.svg':'image/svg+xml','.glb':'model/gltf-binary','.mp3':'audio/mpeg','.md':'text/plain'};
const server=http.createServer((q,s)=>{const url=new URL(q.url,'http://localhost');const f=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!f.startsWith(root+path.sep)){s.writeHead(403);return s.end();}fs.readFile(f,(e,d)=>{s.writeHead(e?404:200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});s.end(e?'missing':d);});});
(async()=>{let browser;try{
await new Promise(r=>server.listen(5192,'127.0.0.1',r));browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});const p=await browser.newPage({viewport:{width:1440,height:900}});const errors=[],requested=[];p.on('pageerror',e=>errors.push(String(e)));p.on('request',r=>requested.push(r.url()));
await p.route('**/js/play/player.js*',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(root,'js/play/player.js'),'utf8').replace('const w = await getStage(), scenes','const w = window.auditStage = await getStage(), scenes')}));
await p.goto('http://127.0.0.1:5192/');await p.waitForFunction(()=>window.game);
await p.locator('[data-progress="session"]').click();
await p.evaluate(async()=>{const {episodeById}=await import('/js/content/catalog.js');const e=episodeById('D-01');window.castEpisode=await game.player.prepare(e);document.getElementById('intro').classList.add('hide');document.body.classList.add('playing');
const ids=['ava','dana','sienna','kit','leo','me'];const chars=Object.fromEntries(ids.map(id=>[id,castEpisode.chars[id]]));
await auditStage.load('backstage-lineup',({THREE,L,scene,add,box})=>{scene.background=new THREE.Color('#d6dadd');scene.add(new THREE.HemisphereLight('#fff1dc','#536578',2.5));const light=new THREE.DirectionalLight('#fff5e8',2.5);light.position.set(3,5,5);scene.add(light);add(box(12,.1,8),new THREE.MeshToonMaterial({color:'#a7b3bc'}),0,-.05,0);ids.forEach((id,i)=>L.spots[id]={pos:[(i-2.5)*.85,0,0],ry:0});L.shots.wide=()=>({pos:[0,1.8,7],at:[0,1,0]});},{chars,cast:ids});
await auditStage.enter('backstage-lineup','wide',true);auditStage.pause(false);});
await p.waitForTimeout(1600);await p.screenshot({path:path.join(out,'cast.png')});
const state=await p.evaluate(()=>Object.fromEntries(Object.entries(auditStage.loc.chars).map(([id,c])=>[id,{rig:!!c.o.userData.vrm,clips:Object.keys(c.acts),head:!!c.head,face:!!c.face}])));
assert.equal(Object.keys(state).length,6);for(const [id,c]of Object.entries(state)){assert.ok(c.rig&&c.head&&c.face,id);assert.ok(c.clips.length>=10,id);}
for(const name of ['idle','talk','fold','no','yes','hit','phone','think','point','walk','sit']){await p.evaluate(name=>{for(const id of Object.keys(auditStage.loc.chars))auditStage.play(id,name,0);},name);await p.waitForTimeout(120);}
for(const scene of ['flat','label','studio','street','flat:night']){await p.evaluate(async key=>{await auditStage.enter(key,'wide',true);},scene);await p.waitForTimeout(400);await p.screenshot({path:path.join(out,scene.replace(':','-')+'.png')});}
assert.deepEqual(errors,[]);for(const name of ['kit','leo','ava','dana','sienna','heroine'])assert.ok(requested.some(u=>new URL(u).pathname.endsWith('/m_'+name+'.glb')),name);assert.equal(requested.some(u=>u.includes('/m_original_')),false);
fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({state,errors,backstageModelsRequested:requested.filter(u=>/\/m_(kit|leo|ava|dana|sienna|heroine)\.glb/.test(u))},null,2));console.log(JSON.stringify({characters:Object.keys(state),errors},null,2));
}finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});
