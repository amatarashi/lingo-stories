// Current published terms, not a claim about the date the original asset was acquired.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root=new URL('../',import.meta.url),out=new URL('docs/rights/licenses/',root);
await mkdir(out,{recursive:true});
const sources={
 'quaternius-men.html':'https://quaternius.com/packs/ultimatemodularcharacters.html',
 'quaternius-women.html':'https://quaternius.com/packs/ultimatemodularwomen.html',
 'quaternius-interior.html':'https://quaternius.com/packs/ultimatehomeinterior.html',
 'quaternius-streets.html':'https://quaternius.com/packs/modularstreets.html',
 'quaternius-ual1.html':'https://quaternius.com/packs/universalanimationlibrary.html',
 'quaternius-ual2.html':'https://quaternius.com/packs/universalanimationlibrary2.html',
 'quaternius-qal.html':'https://quaternius.com/license.html',
 'three-MIT.txt':'https://raw.githubusercontent.com/mrdoob/three.js/r170/LICENSE',
 'meshoptimizer-MIT.txt':'https://raw.githubusercontent.com/zeux/meshoptimizer/master/LICENSE.md',
 'Inter-OFL.txt':'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt',
 'Caveat-OFL.txt':'https://raw.githubusercontent.com/google/fonts/main/ofl/caveat/OFL.txt',
 'ShareTechMono-OFL.txt':'https://raw.githubusercontent.com/google/fonts/main/ofl/sharetechmono/OFL.txt',
 'SpecialElite-Apache.txt':'https://raw.githubusercontent.com/google/fonts/main/apache/specialelite/LICENSE.txt',
 'Kokoro-model-card.md':'https://huggingface.co/hexgrad/Kokoro-82M/raw/main/README.md',
};
const records=await Promise.all(Object.entries(sources).map(async([file,url])=>{try{
 const response=await fetch(url,{signal:AbortSignal.timeout(25000)});if(!response.ok)throw new Error('HTTP '+response.status);
 const bytes=Buffer.from(await response.arrayBuffer());if(!bytes.length)throw new Error('Empty document');
 await writeFile(new URL(file,out),bytes);return {file,url,retrievedAt:new Date().toISOString(),sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length};
}catch(e){return {file,url,error:String(e)};}}));
await writeFile(new URL('index.json',out),JSON.stringify({note:'Snapshot of current publication only; not proof of original download date or identity of mirrored meshes.',records},null,2)+'\n');
// The generator actually reads the user's HyperFrames cache, not necessarily .runtime/tts.
const {homedir}=await import('node:os');const {pathToFileURL}=await import('node:url');
const voiceSources=['models/kokoro-v1.0.onnx','voices/voices-v1.0.bin'];
const voices=[];for(const file of voiceSources){const location=pathToFileURL(homedir().replaceAll('\\','/')+'/.cache/hyperframes/tts/'+file);try{const b=await readFile(location);voices.push({file,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex')});}catch{voices.push({file,status:'not present at generator path; original generation source still requires confirmation'});}}
await writeFile(new URL('docs/rights/voice-source-hashes.json',root),JSON.stringify({note:'Hashes record files found now, not proof they generated historical MP3.',voices},null,2)+'\n');
console.log(JSON.stringify({saved:records.filter(r=>!r.error).length,failed:records.filter(r=>r.error),voiceFilesHashed:voices.filter(v=>v.sha256).length},null,2));
if(records.some(r=>r.error))process.exitCode=1;
