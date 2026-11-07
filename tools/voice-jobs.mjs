// Lists every voiced line of all written episodes as JSON jobs: { key, voice, text }.
// Usage: node tools/voice-jobs.mjs > jobs.json   (then tools/make_voices.py renders them)
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imp = p => import(pathToFileURL(path.join(root, p)).href);
export const EPISODES = ['js/content/a01.js', 'js/content/c01.js', 'js/content/b01.js', 'js/content/b02.js'];
const eps = await Promise.all(EPISODES.map(async f => (await imp(f)).default));
const common = await imp('js/content/common.js');
const { voiceKey, spoken } = await imp('js/engine/voice.js');
// decode beats: the line with the gap, then the full line (same rules as play/player.js)
const mapText = (t, f) => typeof t === 'string' ? f(t) : Object.fromEntries(Object.entries(t).map(([k, v]) => [k, f(v)]));
const decodeGap = t => mapText(t, v => v.replace(/\{([^}]+)\}/g, '___'));
const decodeFull = t => mapText(t, v => v.replace(/\{([^}]+)\}/g, '[$1]'));

const jobs = new Map();
const allWords = Object.assign({}, ...eps.map(e => e.words));   // recall can ask any word met before
for (const ep of eps) {
  const voiceOf = who => ep.chars[who]?.voice;
  const add = (who, text) => {
    const voice = voiceOf(who); if (!voice || !text) return;
    for (const t of typeof text === 'string' ? [text] : Object.values(text)) jobs.set(voiceKey(voice, t), { key: voiceKey(voice, t), voice, text: spoken(t) });
  };
  for (const b of ep.beats) {
    if (b.type === 'line') add(b.who, b.text);
    if (b.type === 'task') for (const st of b.steps) add(b.who, st.text);
    if (b.type === 'decode') { add(b.who, decodeGap(b.text)); add(b.who, decodeFull(b.text)); }
    if (b.type === 'explore') add('narr', b.hint);
    if (b.type === 'recap') for (const f of b.frames) add('narr', f.text);
    if (b.type === 'interrogate') {
      add('reyes', (b.hint || common.HINT).text);
      for (const r of b.rounds) for (const s of r.statements) { add(b.who, s.text); for (const a of s.after || []) add(a.who, a.text); }
    }
    if (b.type === 'accuse') {
      add(b.who, b.ask.text); add(b.who, b.wrongProof.text); add(b.who, b.ok.text);
      for (const w of Object.values(b.wrong)) add(b.who, w.text);
      for (const p of b.proofs) add(b.who, p.text);
    }
    if (b.type === 'recall') {
      for (const l of [common.RECALL_INTRO, common.RECALL_OK]) add(b.who, l.text);
      for (const w of Object.values(allWords)) { if (w.cloze) add(b.who, w.cloze.text); add(b.who, `Not quite. It's "${w.form}". No worries!`); }
    }
  }
  for (const c of Object.values(ep.clues)) add('narr', c.text);
  add('narr', ep.teaser);
  if (ep.chars.reyes) for (const l of common.WRONG) add(l.who, l.text);
}
process.stdout.write(JSON.stringify([...jobs.values()], null, 1));
