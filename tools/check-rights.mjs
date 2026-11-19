import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
export const root=fileURLToPath(new URL('../',import.meta.url));
const hash=p=>createHash('sha256').update(readFileSync(path.join(root,p))).digest('hex');
const cast=JSON.parse(readFileSync(path.join(root,'docs/rights/backstage-cast.json')));
assert.equal(cast.models.length,6,'Expected six reviewed Backstage characters');
for (const model of cast.models) {
 assert.equal(hash(model.file),model.sha256,'Reviewed Backstage model changed: '+model.file);
 assert.equal(hash(model.mobile.file),model.mobile.sha256,'Reviewed mobile model changed: '+model.mobile.file);
}
const thirdParty=['anim_ual1.glb','anim_ual2.glb','props_interior.glb','m_men_Casual.glb','m_men_Casual2.glb','m_men_Suit.glb','m_men_Worker.glb','m_women_Casual.glb','m_women_Formal.glb','m_women_Suit.glb'];
assert.deepEqual(readdirSync(path.join(root,'assets/models')).sort(),[...thirdParty,...cast.models.map(m=>path.basename(m.file)),'mobile'].sort(),'Unreviewed models in game directory');
assert.deepEqual(readdirSync(path.join(root,'assets/models/mobile')).sort(),cast.models.map(m=>path.basename(m.mobile.file)).sort(),'Unreviewed mobile models in game directory');
const historical=readFileSync(path.join(root,'docs/asset-sha256-2026-11-17.txt'),'utf8').split(/\r?\n/).filter(l=>l&&!l.startsWith('#')).map(l=>l.split('  '));
for(const file of thirdParty){const p='assets/models/'+file;assert.equal(hash(p),historical.find(([,f])=>f===p)?.[0],'Previously reviewed Quaternius file changed: '+p);}
const files=[];
for(const dir of ['assets/models','assets/voice','assets/posters','vendor']){
 const walk=d=>{for(const e of readdirSync(path.join(root,d),{withFileTypes:true})){const p=d+'/'+e.name;if(e.isDirectory())walk(p);else files.push(p);}};walk(dir);
}
files.push('tools/bot-avatar.png');files.sort();
const current={schema:1,notice:'Reviewed asset set; hashes establish identity, not exclusive legal title.',files:files.map(file=>({file,sha256:hash(file)}))};
const manifest=path.join(root,'docs/rights/distribution-assets.json');
if(process.argv.includes('--record'))writeFileSync(manifest,JSON.stringify(current,null,2)+'\n');
assert.ok(existsSync(manifest),'Missing reviewed asset manifest');
assert.deepEqual(current,JSON.parse(readFileSync(manifest)),'Asset set changed: review rights before updating manifest');
console.log(`Rights composition verified: ${cast.models.length} reviewed Backstage characters, ${thirdParty.length} unchanged licensed GLBs, ${files.length} distribution assets.`);
