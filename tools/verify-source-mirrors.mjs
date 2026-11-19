// Compares local inputs to Git blobs at the revisions cited in the asset register.
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const showcase = { repo: 'trebeljahr/quaternius-showcase', revision: '335270d8d0e2744f39f6f417d4bfda29433cb348' };
const moorfall = { repo: 'Dallolz/moorfall-assets', revision: '43824dae24b04fea6254b96e9edb12157cfcde11' };

async function loadTree(source) {
  const response = await fetch(`https://api.github.com/repos/${source.repo}/git/trees/${source.revision}?recursive=1`, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${source.repo}: HTTP ${response.status}`);
  const tree = await response.json();
  if (tree.truncated || tree.sha !== source.revision) throw new Error('Incomplete or unexpected tree');
  return { ...source, tree: tree.tree.filter(entry => entry.type === 'blob') };
}

const [models, animations] = await Promise.all([loadTree(showcase), loadTree(moorfall)]);
const records = [];
for (const [folder, source] of [['chars', models], ['props', models], ['ual', animations]]) {
  const directory = new URL(`assets/src/${folder}/`, root);
  for (const name of (await readdir(directory)).filter(file => file.endsWith('.glb')).sort()) {
    const bytes = await readFile(new URL(name, directory));
    const blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    const matches = source.tree.filter(entry => entry.sha === blob).map(entry => entry.path);
    records.push({
      file: `assets/src/${folder}/${name}`, repo: source.repo, revision: source.revision,
      gitBlob: blob, sha256: createHash('sha256').update(bytes).digest('hex'), paths: matches,
    });
  }
}
await writeFile(new URL('docs/rights/source-mirror-check.json', root), JSON.stringify({
  scope: 'Local inputs compared with cited mirrors. This does not verify original downloads from the author or reproduce the runtime conversion.',
  records,
}, null, 2) + '\n');
const unmatched = records.filter(record => record.paths.length === 0);
console.log(`${records.length - unmatched.length}/${records.length} inputs match cited mirrors`);
for (const record of unmatched) console.log('Unmatched:', record.file);
