// Checks that every English word in the episodes has a tap-translation, and every [tracked] key is a known word.
// Usage: node tools/check-lex.mjs
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imp = p => import(pathToFileURL(path.join(root, p)).href);
const files = ['js/content/a01.js', 'js/content/b01.js', 'js/content/b02.js', 'js/content/common.js'];
const { lookup, registerWords } = await imp('js/engine/lex.js');
const { parse } = await imp('js/engine/text.js');
const mods = await Promise.all(files.map(imp));
const words = {};
for (const m of mods) if (m.default?.words) { registerWords(m.default.words, m.default.id); Object.assign(words, m.default.words); }
const texts = [];
const walk = o => {
  if (!o) return; if (Array.isArray(o)) return o.forEach(walk);
  if (typeof o !== 'object') return;
  for (const k of ['text', 'hint', 'teaser', 'prompt']) if (o[k]) { const v = o[k]; if (typeof v === 'string') texts.push(v); else if (typeof v === 'object') Object.values(v).forEach(x => typeof x === 'string' && texts.push(x)); }
  for (const [k, v] of Object.entries(o)) if (typeof v === 'object' && k !== 'ru') walk(v);
};
for (const m of mods) walk(m.default || m);
const miss = new Set(), bad = new Set();
for (const t of texts) for (const tok of parse(t)) if (tok.t === 'w') { const r = lookup(tok.s, tok.key); if (!r.ru) miss.add(tok.s.toLowerCase()); if (tok.track && !words[tok.key]) bad.add(tok.key); }
console.log('texts', texts.length);
console.log('missing:', [...miss].sort().join(', '));
console.log('bad tracked keys:', [...bad].join(', '));
