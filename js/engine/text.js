// Text helpers: level picking and tokenizing lines with [tracked] words.
export const LEVELS = ['a1', 'a2', 'b1'];
export const LEVEL_NAME = { a1: 'A1', a2: 'A2', b1: 'B1' };

// pick the text for the player's level (falls back to the nearest simpler one)
export function pick(v, level) {
  if (v == null || typeof v === 'string') return v || '';
  for (let i = LEVELS.indexOf(level); i >= 0; i--) if (v[LEVELS[i]]) return v[LEVELS[i]];
  return v.a1 || v.a2 || v.b1 || '';
}

// "[surface|key]" / "[word]" → tracked token; words → word tokens; the rest → plain text
export function parse(text) {
  const out = [];
  const re = /\[([^\]|]+)(?:\|([^\]]+))?\]|([A-Za-zÀ-ɏ]+(?:['’][A-Za-z]+)?)|([^[A-Za-zÀ-ɏ]+)/g;
  let m;
  while ((m = re.exec(text))) {
    if (m[1]) out.push({ t: 'w', s: m[1], key: (m[2] || m[1]).toLowerCase(), track: true });
    else if (m[3]) out.push({ t: 'w', s: m[3] });
    else out.push({ t: 'p', s: m[4] });
  }
  return out;
}

export const plain = text => text.replace(/\[([^\]|]+)(?:\|[^\]]+)?\]/g, '$1');
export const trackedIn = text => parse(text).filter(t => t.track).map(t => t.key);
