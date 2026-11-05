// Telegram CloudStorage sync: the state is split into ≤4000-char chunks (the limit per key is 4096).
// Keys: ls_n = number of chunks, ls_0 … ls_k = the JSON. Outside Telegram this does nothing.
import { S, onSave, replaceState } from './vocab.js';

const cs = window.Telegram?.WebApp?.initData ? window.Telegram.WebApp.CloudStorage : null;
const CHUNK = 4000;
const call = (fn, ...a) => new Promise(res => { try { cs[fn](...a, (err, v) => res(err ? null : v)); } catch { res(null); } });

export const cloudOn = !!cs;
let timer = null, writing = Promise.resolve(), sent = []; // chunks already in the cloud: only changed ones are rewritten

async function write() {
  const json = JSON.stringify(S), parts = [];
  for (let i = 0; i < json.length; i += CHUNK) parts.push(json.slice(i, i + CHUNK));
  const old = sent.length || Number(await call('getItem', 'ls_n')) || 0;
  for (let i = 0; i < parts.length; i++) if (parts[i] !== sent[i]) await call('setItem', 'ls_' + i, parts[i]);
  if (parts.length !== old) await call('setItem', 'ls_n', String(parts.length));
  if (old > parts.length) await call('removeItems', Array.from({ length: old - parts.length }, (_, i) => 'ls_' + (parts.length + i)));
  sent = parts;
}
export function flush() {
  if (!cs) return Promise.resolve();
  clearTimeout(timer); timer = null;
  writing = writing.then(write, write);
  return writing;
}
if (cs) onSave(() => { clearTimeout(timer); timer = setTimeout(flush, 1500); });

// on start: if the cloud copy is newer than this device's, take it. Resolves true if the state changed.
export async function pull() {
  if (!cs) return false;
  const n = Number(await call('getItem', 'ls_n')) || 0;
  if (!n) { if (S.t) flush(); return false; }
  const keys = Array.from({ length: n }, (_, i) => 'ls_' + i);
  const got = await call('getItems', keys);
  if (!got) return false;
  try {
    const raw = keys.map(k => got[k] || '');
    sent = raw;
    const remote = JSON.parse(raw.join(''));
    if (remote?.v === 1 && (remote.t || 0) > (S.t || 0)) { replaceState(remote); return true; }
    if ((S.t || 0) > (remote.t || 0)) flush();
  } catch {}
  return false;
}
