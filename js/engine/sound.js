// Small WebAudio kit: rain ambience, UI sounds, and speech only on demand.
let ctx = null, master = null, rainGain = null;

export function unlock() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
  master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
  document.addEventListener('visibilitychange', () => document.hidden ? ctx.suspend() : ctx.resume());
}

export function startRain() {
  if (!ctx || rainGain) return;
  const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 0.4;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3500;
  rainGain = ctx.createGain(); rainGain.gain.value = 0;
  src.connect(bp).connect(lp).connect(rainGain).connect(master); src.start();
  rainGain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 3);
}

function tone(freq, dur, { type = 'sine', vol = 0.15, at = 0, slide = 0 } = {}) {
  if (!ctx) return;
  const t = ctx.currentTime + at, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
}

// ---------------------------------------------------------------- quiet noir lounge music (generated, never repeats exactly)
let musicGain = null, musicOn = false, musicVol = 0.5, amb = true;
const CHORDS = [ // Dm9 · G13 · Cmaj9 · A7b9 — slow, smoky
  [50, 57, 60, 64, 65], [43, 53, 59, 64, 65], [48, 55, 59, 62, 64], [45, 55, 58, 61, 64],
];
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function epiano(freq, t, dur, vol) {
  const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
  o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = freq; o2.frequency.value = freq * 2.001;
  f.type = 'lowpass'; f.frequency.value = 1800;
  const g2 = ctx.createGain(); g2.gain.value = 0.18;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(vol * 0.35, t + 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); o2.connect(g2).connect(g); g.connect(f).connect(musicGain);
  o.start(t); o2.start(t); o.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
}
export function startMusic() {
  if (!ctx || musicOn) return; musicOn = true;
  musicGain = ctx.createGain(); musicGain.gain.value = 0;
  const rev = ctx.createConvolver(); const len = ctx.sampleRate * 2.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
  rev.buffer = ir; const wet = ctx.createGain(); wet.gain.value = 0.35;
  musicGain.connect(master); musicGain.connect(rev).connect(wet).connect(master);
  musicGain.gain.linearRampToValueAtTime(musicVol, ctx.currentTime + 4);
  const beat = 60 / 64; let bar = 0, next = ctx.currentTime + 0.5;
  const schedule = () => {
    while (next < ctx.currentTime + 2) {
      const ch = CHORDS[bar % 4];
      ch.forEach((m, i) => epiano(mtof(m + 12), next + i * 0.03, beat * 3.6, 0.035));
      epiano(mtof(ch[0] - 12), next, beat * 3.8, 0.05); // bass
      // a few lazy melody notes from the chord, sometimes
      for (let k = 0; k < 3; k++) if (Math.random() < 0.45) epiano(mtof(ch[1 + (Math.random() * 4 | 0)] + 24), next + beat * (1 + k + (Math.random() < 0.5 ? 0.5 : 0)), beat * 1.5, 0.02);
      next += beat * 4; bar++;
    }
  };
  schedule(); setInterval(schedule, 500);
}
// music on/off (profile setting)
export function setMusic(on) {
  musicVol = on ? 0.5 : 0;
  if (ctx && musicGain && amb) musicGain.gain.setTargetAtTime(musicVol, ctx.currentTime, 0.3);
}
// rain + music fade (off on the home screen, back on in an episode)
export function ambience(on) {
  amb = on;
  if (!ctx) return;
  const t = ctx.currentTime;
  rainGain?.gain.setTargetAtTime(on ? 0.09 : 0, t, 0.5);
  musicGain?.gain.setTargetAtTime(on ? musicVol : 0, t, 0.5);
}
// voice ducking: music and rain step back while someone speaks
export function duck(on) {
  if (!ctx || !amb) return;
  const t = ctx.currentTime;
  musicGain?.gain.setTargetAtTime(on ? musicVol * 0.36 : musicVol, t, on ? 0.08 : 0.6);
  rainGain?.gain.setTargetAtTime(on ? 0.04 : 0.09, t, on ? 0.08 : 0.6);
}

export function sfx(name) {
  if (!ctx) return;
  switch (name) {
    case 'ring': for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) tone(i % 2 ? 1320 : 1100, 0.05, { type: 'square', vol: 0.025, at: r * 0.45 + i * 0.05 }); break;
    case 'paper': { const len = ctx.sampleRate * 0.25, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) * 0.5; const s = ctx.createBufferSource(); s.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2500; const g = ctx.createGain(); g.gain.value = 0.15; s.connect(f).connect(g).connect(master); s.start(); break; }
    case 'whoosh': { const len = ctx.sampleRate * 0.6, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / len); const s = ctx.createBufferSource(); s.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.8; f.frequency.setValueAtTime(300, ctx.currentTime); f.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.6); const g = ctx.createGain(); g.gain.value = 0.12; s.connect(f).connect(g).connect(master); s.start(); break; }
    case 'stamp': tone(70, 0.35, { type: 'square', vol: 0.12, slide: 0.6 }); tone(140, 0.12, { type: 'triangle', vol: 0.1 }); { const len = ctx.sampleRate * 0.12, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len); const s = ctx.createBufferSource(); s.buffer = b; const g = ctx.createGain(); g.gain.value = 0.3; s.connect(g).connect(master); s.start(); } break;
    case 'tap': tone(880, 0.06, { type: 'triangle', vol: 0.05 }); break;
    case 'next': tone(520, 0.05, { type: 'triangle', vol: 0.04 }); break;
    case 'clue': [660, 880, 1320].forEach((f, i) => tone(f, 0.35, { type: 'sine', vol: 0.08, at: i * 0.07 })); break;
    case 'ok': [523, 659, 784].forEach((f, i) => tone(f, 0.3, { type: 'triangle', vol: 0.08, at: i * 0.06 })); break;
    case 'bad': tone(300, 0.25, { type: 'triangle', vol: 0.07, slide: 0.8 }); break;
    case 'objection':
      [196, 247, 294, 392].forEach(f => tone(f, 0.7, { type: 'sawtooth', vol: 0.05 }));
      tone(98, 0.5, { type: 'square', vol: 0.06 }); break;
    case 'end': [392, 466, 587, 698].forEach((f, i) => tone(f, 0.9, { type: 'sine', vol: 0.07, at: i * 0.18 })); break;
  }
}

let voice = null;
function pickVoice() {
  const vs = speechSynthesis.getVoices();
  voice = vs.find(v => /en-GB/i.test(v.lang) && /female|Sonia|Libby|Google UK English Female/i.test(v.name)) || vs.find(v => /en-GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

export function speak(text, rate = 0.92) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'en-GB'; u.rate = rate; if (voice) u.voice = voice;
  if (rainGain && ctx) { rainGain.gain.setTargetAtTime(0.03, ctx.currentTime, 0.1); u.onend = () => rainGain.gain.setTargetAtTime(0.09, ctx.currentTime, 0.4); }
  speechSynthesis.speak(u);
}
