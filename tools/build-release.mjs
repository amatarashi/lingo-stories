// Writes a fresh versioned directory; never deletes or publishes a release.
import './check-rights.mjs';
import { root } from './check-rights.mjs';
import { readFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
const manifest=JSON.parse(readFileSync(path.join(root,'docs/rights/distribution-assets.json')));
const out=path.join(root,'.runtime/release',Date.now().toString());mkdirSync(out,{recursive:true});
const copy=p=>{const target=path.join(out,p);mkdirSync(path.dirname(target),{recursive:true});copyFileSync(path.join(root,p),target);};
for(const {file} of manifest.files)copy(file);
const js=d=>{for(const e of readdirSync(path.join(root,d),{withFileTypes:true})){const p=d+'/'+e.name;if(e.isDirectory())js(p);else if(e.name.endsWith('.js'))copy(p);}};js('js');
for(const file of ['index.html','rights.html','privacy.html','THIRD_PARTY_NOTICES.md','.nojekyll'])copy(file);
for(const file of readdirSync(path.join(root,'docs/rights/licenses')).filter(f=>f.endsWith('.txt')))copy('docs/rights/licenses/'+file);
copy('docs/rights/backstage-cast.json');
console.log('Prepared release: '+out);
