// Player state: words with hidden spaced repetition, streak with a weekly freeze, daily history, settings.
// A word's next review: new → 1 day → 3 → 7 → 14 → 30 → 60. Understood without help when due → interval grows;
// asked for translation → back to 1 day. Meeting the word again before it's due changes nothing (cramming doesn't count).
// Saved to localStorage at once and to Telegram CloudStorage shortly after (see cloud.js), so progress follows the player.
const KEY = 'lingo-stories-v1';
const DAY = 864e5;
const INT = [1, 3, 7, 14, 30, 60];

const fresh = () => ({
  v: 1, t: 0, level: null, auto: true, placed: false, dayOffset: 0,
  words: {}, stats: { lines: 0, clean: 0 }, hist: {}, eps: {},
  streak: { days: 0, last: null, best: 0, freezeWeek: null, froze: null },
  stories: {}, voice: true, music: true, remind: true, seenIntro: false,
});
function upgrade(s) {
  const f = fresh();
  for (const k of Object.keys(f)) if (s[k] === undefined) s[k] = f[k];
  s.streak = Object.assign(f.streak, s.streak);
  return s;
}
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return upgrade(s); } catch {}
  return fresh();
}
export const S = load();

const listeners = new Set();
export const onSave = f => listeners.add(f);
export function save() {
  S.t = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {}
  for (const f of listeners) f(S);
}
// replace the whole state (cloud copy was newer)
export function replaceState(next) {
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, upgrade(next));
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {}
}

export const now = () => Date.now() + S.dayOffset * DAY;
export const dayNum = (t = now()) => Math.floor((t - new Date().getTimezoneOffset() * 6e4) / DAY);
const weekNum = d => Math.floor((d + 3) / 7); // weeks start on Monday

export function meet(key, helped, src) {
  const t = now();
  let w = S.words[key];
  if (!w) {
    w = S.words[key] = { stage: 0, due: t + DAY, seen: 1, help: helped ? 1 : 0, src, first: t, last: t };
    return w;
  }
  w.seen++; w.last = t;
  if (helped) { w.help++; w.stage = 0; w.due = t + DAY; }
  else if (t >= w.due) { w.stage = Math.min(w.stage + 1, INT.length - 1); w.due = t + INT[w.stage] * DAY; }
  return w;
}

export const dueWords = () => Object.entries(S.words).filter(([, w]) => w.due <= now()).sort((a, b) => a[1].due - b[1].due).map(([k]) => k);
// 0 new · 1 familiar · 2 recognised · 3 mastered
export const mastery = w => !w ? 0 : w.stage >= 4 ? 3 : w.stage >= 2 ? 2 : w.stage >= 1 ? 1 : 0;
export const MASTERY = ['○ новое', '◔ знакомое', '◑ узнаю', '● освоено'];
export const daysUntil = w => Math.max(0, Math.ceil((w.due - now()) / DAY));

// lines read today, with and without help: feeds the weekly chart
export function countLine(clean) {
  S.stats.lines++; if (clean) S.stats.clean++;
  const d = dayNum(), h = S.hist[d] ||= [0, 0];
  h[0]++; if (clean) h[1]++;
  const keys = Object.keys(S.hist);
  if (keys.length > 70) for (const k of keys.sort((a, b) => a - b).slice(0, keys.length - 70)) delete S.hist[k];
}

// streak: one missed day a week is forgiven automatically (the "freeze")
export function streakNow() {
  const s = S.streak, d = dayNum();
  if (s.last == null) return 0;
  if (s.last >= d - 1) return s.days;
  if (s.last === d - 2 && s.freezeWeek !== weekNum(d)) return s.days; // still saveable today
  return 0;
}
export const freezeLeft = () => S.streak.freezeWeek === weekNum(dayNum()) ? 0 : 1;
export function markDay() {
  const d = dayNum(), s = S.streak;
  if (s.last === d) return s.days;
  if (s.last === d - 1) s.days++;
  else if (s.last === d - 2 && s.freezeWeek !== weekNum(d)) { s.days++; s.freezeWeek = weekNum(d); s.froze = d - 1; }
  else s.days = 1;
  s.last = d; s.best = Math.max(s.best || 0, s.days); save();
  return s.days;
}
export const playedToday = () => S.streak.last === dayNum();

export function finishEpisode(id, pct) {
  const prev = S.eps[id];
  S.eps[id] = { done: true, at: now(), day: dayNum(), pct, plays: (prev?.plays || 0) + 1 };
  save();
}

// totals for the profile
export function wordStats() {
  const ws = Object.values(S.words);
  return { total: ws.length, mastered: ws.filter(w => mastery(w) === 3).length, known: ws.filter(w => mastery(w) >= 1).length, due: dueWords().length };
}
// last 7 weeks: share of lines read without translation
export function weeklyClean() {
  const d = dayNum(), out = [];
  for (let w = 6; w >= 0; w--) {
    let l = 0, c = 0;
    for (let i = 0; i < 7; i++) { const h = S.hist[d - w * 7 - i]; if (h) { l += h[0]; c += h[1]; } }
    out.push(l ? Math.round(c / l * 100) : null);
  }
  return out;
}

export function skipDay() { S.dayOffset++; save(); }
// wipes progress; the caller reloads the page after the cloud copy is overwritten too
export function resetAll() { replaceState(fresh()); save(); }
