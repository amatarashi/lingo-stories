// Cache-busting for GitHub Pages (files are cached for 10 minutes; Telegram's webview can mix old and new modules).
// Writes an import map into index.html that points every js/ module to "?v=<content hash>",
// so a new index.html always loads exactly the matching set of modules. Run before each deploy:
//   node tools/stamp.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (p.endsWith('.js')) files.push(p); } })(join(root, 'js'));

const imports = { three: './vendor/three.module.js', 'three/addons/': './vendor/addons/' };
let appV = '';
for (const p of files.sort()) {
  const rel = './' + relative(root, p).split(sep).join('/');
  const v = createHash('sha1').update(readFileSync(p)).digest('hex').slice(0, 8);
  imports[rel] = `${rel}?v=${v}`;
  if (rel === './js/app.js') appV = v;
}

const html = join(root, 'index.html');
let s = readFileSync(html, 'utf8');
s = s.replace(/<script type="importmap">[\s\S]*?<\/script>/, `<script type="importmap">${JSON.stringify({ imports })}</script>`);
s = s.replace(/<script type="module" src="js\/app\.js[^"]*"><\/script>/, `<script type="module" src="js/app.js?v=${appV}"></script>`);
writeFileSync(html, s);
console.log(`stamped ${files.length} modules, app.js?v=${appV}`);
