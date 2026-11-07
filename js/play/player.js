// Episode player: cinematic dialogue in 3 levels, character voices, tap-to-translate, clues, "Objection!", recall, notebook.
// The app calls play(); the 3D scene of the story is loaded on first use and kept (paused) between episodes.
import { WRONG, HINT, RECALL_INTRO, RECALL_OK } from '../content/common.js';
import { pick, parse, plain, trackedIn, LEVELS, LEVEL_NAME } from '../engine/text.js';
import { lookup, registerWords, trackedInfo, trackedKeys } from '../engine/lex.js';
import { S, save, meet, dueWords, mastery, MASTERY, daysUntil, countLine, markDay, finishEpisode } from '../engine/vocab.js';
import { unlock, startRain, startMusic, setMusic, setMood, ambience, duck, sfx, speak } from '../engine/sound.js';
import { playLine, stopLine, voiceState } from '../engine/voice.js';

const tg = window.Telegram?.WebApp;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const haptic = (k = 'light') => tg?.HapticFeedback?.impactOccurred(k);

let ep = null, world = null, hooks = {}, storyId = null;
// ONE 3D stage for all series (phones dislike several WebGL contexts); each series brings its locations
let stageP = null;
const getStage = () => stageP ||= import('../stories/stage.js').then(m => m.createStage($('c')));
const STORY = {
  a: { mood: 'arctic', locs: { radio: async () => (await import('../stories/a/loc-radio.js')).buildRadio } },
  c: { mood: 'coast', locs: {
    platform: async () => (await import('../stories/c/loc-platform.js')).buildPlatform,
    puffin: async () => (await import('../stories/c/loc-puffin.js')).buildPuffin,
    room: async () => (await import('../stories/c/loc-puffin.js')).buildRoom,
  } },
  b: { mood: 'noir', locs: { cafe: async () => (await import('../stories/b/loc-cafe.js')).buildCafe, office: async () => (await import('../stories/b/loc-office.js')).buildOffice } },
};
const sceneKey = sc => sc.loc + (sc.mood ? ':' + sc.mood : '');
// a speaking character who is not in the current location is on the phone
const remote = who => who !== 'narr' && who !== 'you' && !!ep.chars[who]?.voice && !world.present(who);

// ---------------------------------------------------------------- level (with first-run placement)
// First run: lines 1–2 are A1, 3–4 A2, 5–6 B1. The first band where the player needed help sets the level.
const PLACE = ['a1', 'a1', 'a2', 'a2', 'b1', 'b1'];
const level = () => S.placing && R.place < PLACE.length ? PLACE[R.place] : (S.level || 'a2');
const L = v => pick(v, level());
voiceState.on = S.voice;

// ---------------------------------------------------------------- run state
const R = { run: 0, lines: 0, clean: 0, al: 0, ac: 0, found: new Set(), asked: false, line: null, ruShown: false, ruUsed: false, tapped: new Set(), helped: false, typing: null, onRu: null, place: 0, placeHelp: {} };
function resetRun() { Object.assign(R, { lines: 0, clean: 0, al: 0, ac: 0, found: new Set(), asked: false, line: null, place: 0, placeHelp: {} }); }

// ---------------------------------------------------------------- HUD
function paintLevel() { for (const b of $('lvl').children) b.classList.toggle('on', b.dataset.l === level()); }
$('lvl').onclick = e => {
  const l = e.target.dataset?.l; if (!l || l === level()) return;
  S.level = l; S.auto = false; S.placing = false; S.placed = true; save(); paintLevel(); sfx('tap');
  if (R.line) renderLine(R.line, true);
  toast(`Уровень текста: <b>${LEVEL_NAME[l]}</b>`);
};
function paintVoice() { $('b-voice').classList.toggle('off', !voiceState.on); $('b-voice').textContent = voiceState.on ? '🗣️' : '🔇'; }
$('b-voice').onclick = () => { voiceState.on = S.voice = !S.voice; save(); paintVoice(); if (!voiceState.on) stopLine(); toast(voiceState.on ? '🗣️ Озвучка включена' : '🔇 Озвучка выключена'); };

let toastT;
export function toast(html, ms = 1600) { const t = $('toast'); t.innerHTML = html; t.classList.remove('hide'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.add('hide'), ms); }
function hidePop() { $('pop').classList.add('hide'); document.querySelectorAll('.tk.hl').forEach(e => e.classList.remove('hl')); }
document.addEventListener('pointerdown', e => { if (!e.target.closest('#pop') && !e.target.closest('.tk.w')) hidePop(); });

function showPop(el, tok) {
  const r = lookup(tok.s, tok.key);
  const p = $('pop'), w = tok.key && trackedInfo(tok.key);
  const st = r.key && S.words[r.key];
  p.innerHTML = `<b>${esc(r.word)}</b><button data-say>🔊</button>
    <div class="ru2">${r.ru ? esc(r.ru) : '<i>нет в словаре — нажми RU для перевода фразы</i>'}</div>
    ${w ? `<span class="tag">${st ? MASTERY[mastery(st)] : '★ новое слово'} · в блокнот</span>` : ''}`;
  p.querySelector('[data-say]').onclick = e => { e.stopPropagation(); speak(w ? w.form : tok.s); };
  p.classList.remove('hide');
  const b = el.getBoundingClientRect(), pw = p.offsetWidth, ph = p.offsetHeight;
  const box = el.closest('.box, .card');
  const topEdge = box ? box.getBoundingClientRect().top - (box.querySelector('.por:not(.hide)') ? 48 : 0) : b.top;
  p.style.left = Math.max(8, Math.min(innerWidth - pw - 8, b.left + b.width / 2 - pw / 2)) + 'px';
  p.style.top = Math.max(8, topEdge - ph - 8) + 'px';
  document.querySelectorAll('.tk.hl').forEach(e => e.classList.remove('hl')); el.classList.add('hl');
}

function renderTokens(container, text, { hidden = false, onTap } = {}) {
  container.innerHTML = '';
  const spans = [];
  for (const tok of parse(text)) {
    const s = document.createElement('span');
    s.textContent = tok.s;
    s.className = 'tk' + (tok.t === 'w' ? ' w' : '') + (tok.track ? ' tr' : '') + (hidden ? ' hid' : '');
    if (tok.t === 'w') s.onclick = e => { e.stopPropagation(); if (s.classList.contains('hid')) return finishTyping(); sfx('tap'); showPop(s, tok); onTap?.(tok); };
    container.appendChild(s); spans.push(s);
  }
  return spans;
}

// ---------------------------------------------------------------- dialogue panel
const dlg = $('dlg'), boxEl = dlg.querySelector('.box'), txt = dlg.querySelector('.txt'), ruBox = dlg.querySelector('.ru'), acts = dlg.querySelector('.acts'), por = dlg.querySelector('.por'), more = dlg.querySelector('.more');
const charOf = who => ep.chars[who] || { name: 'You', color: '#8fb3ff' };
let lastWho = null, lastPhone = false;
function setWho(who) {
  const c = charOf(who);
  dlg.style.setProperty('--who', c.color);
  dlg.querySelector('.nm').textContent = who === 'narr' ? '' : c.name;
  dlg.querySelector('.role').textContent = c.role || '';
  const img = world.portraits[who];
  por.classList.toggle('hide', !img); boxEl.classList.toggle('has-por', !!img);
  const onPhone = remote(who), holder = ep.phoneHolder;
  const badge = c.via === 'radio' ? '📻' : c.via === 'screen' ? '' : '📞';
  if (img) { por.style.backgroundImage = `url(${img})`; por.innerHTML = onPhone && badge ? `<span class="call">${badge}</span>` : ''; }
  txt.classList.toggle('narr', who === 'narr');
  // staging: the phone holder keeps the phone at the ear while someone on the line talks
  if (holder && onPhone) world.play(holder, 'phone');
  else if (holder && lastWho && lastPhone && who !== lastWho) world.play(holder, who === holder ? 'talk' : 'fold');
  world.setSpeaker(who === 'narr' || who === 'you' || onPhone ? null : who);
  lastWho = who; lastPhone = onPhone;
}

function lineHelped(tok) { R.helped = true; if (tok?.key) R.tapped.add(tok.key); }
function finishTyping() {
  if (!R.typing) return false;
  clearInterval(R.typing); R.typing = null;
  txt.querySelectorAll('.hid').forEach(s => s.classList.remove('hid'));
  R.onTyped?.();
  return true;
}
function renderLine(line, instant = false, speed = 30) {
  const text = L(line.text);
  const spans = renderTokens(txt, text, { hidden: !instant, onTap: lineHelped });
  ruBox.textContent = L(line.ru) || '';
  ruBox.classList.toggle('hide', !R.ruShown);
  $('b-ru').classList.toggle('on', R.ruShown);
  clearInterval(R.typing); R.typing = null;
  if (!instant) {
    let i = 0;
    R.typing = setInterval(() => {
      if (i >= spans.length) { clearInterval(R.typing); R.typing = null; R.onTyped?.(); return; }
      spans[i++].classList.remove('hid');
    }, speed);
  } else R.onTyped?.();
}
$('b-ru').onclick = e => {
  e.stopPropagation(); if (!R.line) return;
  R.ruShown = !R.ruShown; if (R.ruShown) { R.helped = true; R.ruUsed = true; }
  ruBox.classList.toggle('hide', !R.ruShown); $('b-ru').classList.toggle('on', R.ruShown); sfx('tap');
  R.onRu?.();
};
$('b-say').onclick = e => { e.stopPropagation(); if (R.line) voice(R.line); };

function voice(line) {
  const c = charOf(line.who);
  duck(true);
  por.classList.add('talk'); world.talk(line.who, true);
  return playLine(c.voice, L(line.text), () => { duck(false); por.classList.remove('talk'); world.talk(line.who, false); });
}

function finishLine() {
  const line = R.line; if (!line) return;
  for (const k of trackedIn(L(line.text))) meet(k, R.ruUsed || R.tapped.has(k), ep.id);
  if (!line.noCount) {
    countLine(!R.helped); R.lines++; if (!R.helped) R.clean++;
    if (S.placing) placeStep(); else { R.al++; if (!R.helped) R.ac++; }
  }
  save(); R.line = null; hidePop();
}
function placeStep() {
  const band = PLACE[R.place];
  R.placeHelp[band] ||= R.helped;
  if (++R.place < PLACE.length) { paintLevel(); return; }
  const first = LEVELS.findIndex(l => R.placeHelp[l]);
  S.level = first < 0 ? 'b1' : LEVELS[Math.max(0, first - 1)];
  S.placing = false; S.placed = true; S.auto = true; save(); paintLevel();
  setTimeout(() => toast(`🎯 Подобрали уровень текста: <b>${LEVEL_NAME[S.level]}</b><br><small>Поменять можно кнопками вверху или в профиле</small>`, 3600), 400);
}

// show a line; `fill(actsEl, done)` adds buttons; without it a tap on the panel continues
function present(line, fill) {
  const run = R.run;
  return new Promise(async resolve => {
    dlg.classList.remove('hidden'); document.body.classList.add('cine');
    R.line = line; R.helped = false; R.ruShown = false; R.ruUsed = false; R.tapped = new Set(); R.onRu = null; R.onTyped = null;
    if (line.sfx) { sfx(line.sfx); await sleep(line.sfx === 'ring' ? 700 : 200); }
    if (run !== R.run) return;
    setWho(line.who);
    if (line.shot) world.shot(line.shot);
    if (line.anim && world.present(line.who)) world.play(line.who, line.anim);
    acts.innerHTML = ''; more.classList.add('hide');
    const dur = await voice(line);
    if (run !== R.run) return;
    const n = parse(L(line.text)).length;
    renderLine(line, false, dur ? Math.max(18, Math.min(70, dur * 1000 * 0.8 / n)) : 26);
    let finished = false;
    const done = v => { if (finished || run !== R.run) return; finished = true; boxEl.onclick = null; stopLine(); duck(false); por.classList.remove('talk'); world.talk(line.who, false); finishLine(); resolve(v); };
    if (fill) { fill(acts, done); boxEl.onclick = () => finishTyping(); }
    else {
      R.onTyped = () => more.classList.remove('hide');
      boxEl.onclick = e => { if (e.target.closest('button')) return; if (finishTyping()) return; sfx('next'); done(); };
    }
  });
}

// ---------------------------------------------------------------- beats
function choiceBeat(b) {
  const line = { who: 'you', text: b.prompt || { a1: 'What do you say?' }, ru: 'Что ответишь?', noCount: true };
  return present(line, (box, done) => {
    b.options.forEach((o, i) => {
      const btn = document.createElement('button'); btn.className = 'btn choice';
      btn.innerHTML = `<span class="n">${i + 1}</span><span>${esc(plain(L(o.text)))}<small class="opt-ru hide">${esc(L(o.ru))}</small></span>`;
      btn.onclick = e => { e.stopPropagation(); sfx('next'); haptic(); done(i); };
      box.appendChild(btn);
    });
    R.onRu = () => box.querySelectorAll('.opt-ru').forEach(x => x.classList.toggle('hide', !R.ruShown));
  });
}

function openClue(k) {
  return new Promise(resolve => {
    const c = ep.clues[k];
    world.shot(k);
    const card = $('card'), el = card.firstElementChild;
    el.innerHTML = `<div class="icon">${c.icon}</div><h2>${esc(c.title)}</h2>${c.doc ? `<div class="doc">${esc(c.doc)}</div>` : ''}
      <div class="txt"></div><div class="ru hide"></div>
      <div class="row"><button class="btn" id="cl-ru" style="flex:none">RU</button><button class="btn" id="cl-say" style="flex:none">🔊</button><button class="btn pri" id="cl-ok">${R.found.has(k) ? 'Закрыть' : ep.clueOk || 'В досье ✓'}</button></div>`;
    const line = { who: 'narr', text: c.text, ru: c.ru };
    R.line = line; R.helped = false; R.ruUsed = false; R.tapped = new Set();
    renderTokens(el.querySelector('.txt'), L(c.text), { onTap: lineHelped });
    el.querySelector('.ru').textContent = L(c.ru);
    el.querySelector('#cl-ru').onclick = () => { R.helped = true; R.ruUsed = true; el.querySelector('.ru').classList.toggle('hide'); };
    el.querySelector('#cl-say').onclick = () => playLine(ep.chars.narr.voice, L(c.text));
    el.querySelector('#cl-ok').onclick = () => {
      stopLine();
      const isNew = !R.found.has(k);
      if (isNew) { R.found.add(k); finishLine(); sfx('clue'); haptic('medium'); } else { R.line = null; hidePop(); }
      card.classList.add('hide'); resolve(isNew);
    };
    card.classList.remove('hide'); sfx('paper');
    playLine(ep.chars.narr.voice, L(c.text));
  });
}

async function exploreBeat(b) {
  const all = b.clues || Object.keys(ep.clues);
  world.shot('wide'); world.setSpeaker(null);
  let busy = false, finish;
  const doneP = new Promise(r => { finish = r; });
  const paint = () => {
    world.setExplore(all, R.found);
    const n = b.need.filter(k => R.found.has(k)).length;
    const cnt = $('ex-count'); if (cnt) cnt.textContent = `${n}/${b.need.length}`;
    if (n >= b.need.length) finish();
  };
  world.onTap(async k => { if (busy) return; busy = true; world.setExplore([], R.found); await openClue(k); busy = false; world.shot('wide'); paint(); });
  const line = { who: 'narr', text: b.hint, ru: b.hintRu, noCount: true };
  if (innerWidth / innerHeight < 0.8) setTimeout(() => toast('👆 Свайпай сцену влево-вправо', 2400), 900);
  const p = present(line, (box, done) => {
    const c = document.createElement('div'); c.className = 'btn'; c.style.flex = 'none'; c.innerHTML = `🔎 ${b.countLabel || 'Улики'}: <b id="ex-count">0/${b.need.length}</b>`;
    const h = document.createElement('button'); h.className = 'btn'; h.style.flex = 'none'; h.textContent = '💡 Подсказка';
    h.onclick = e => { e.stopPropagation(); const k = b.need.find(x => !R.found.has(x)); if (k) { world.shot(k); toast('Посмотри сюда 👀'); setTimeout(() => world.shot('wide'), 2200); } };
    box.append(c, h);
    doneP.then(() => done());
  });
  paint();
  await p;
  world.setExplore(null); world.onTap(null);
  toast(b.doneToast || '🗂️ Улики собраны — они в досье');
}

// ---------------------------------------------------------------- "Do it by the instruction": tap the right thing in the scene
async function taskBeat(b) {
  const done = new Set();
  world.setSpeaker(null);
  for (let si = 0; si < b.steps.length; si++) {
    const st = b.steps[si];
    let wrong = 0;
    world.shot(b.shot);
    world.setExplore(b.targets, done, 'dot');
    const showHint = () => { world.setExplore([st.do], done, 'dot'); toast('Вот это 👀'); setTimeout(() => world.setExplore(b.targets, done, 'dot'), 2200); };
    await present({ who: b.who, shot: b.shot, text: st.text, ru: st.ru }, (box, fin) => {
      const info = document.createElement('div'); info.className = 'stmt';
      info.innerHTML = `Шаг ${si + 1}/${b.steps.length} · <span class="ok">нажми в сцене</span>`;
      const h = document.createElement('button'); h.className = 'btn'; h.style.flex = 'none'; h.textContent = '💡 Подсказка';
      h.onclick = e => { e.stopPropagation(); R.helped = true; showHint(); };
      box.append(info, h);
      world.onTap(k => {
        if (k === st.do) { world.onTap(null); sfx('click'); haptic('medium'); world.fx('press', k); setTimeout(fin, 450); return; }
        sfx('bad'); haptic('rigid'); world.fx('press', k);
        toast(`✋ ${esc(L(b.wrong.text))}<br><small>${esc(L(b.wrong.ru))}</small>`, 2400);
        if (++wrong >= 2) { R.helped = true; showHint(); }
      });
    });
    done.add(st.do);
  }
  world.setExplore(null); world.onTap(null);
  sfx('ok');
}

// ---------------------------------------------------------------- a radio message breaks up: pick the word lost in the static
const mapText = (t, f) => typeof t === 'string' ? f(t) : Object.fromEntries(Object.entries(t).map(([k, v]) => [k, f(v)]));
export const decodeGap = t => mapText(t, v => v.replace(/\{([^}]+)\}/g, '___'));
export const decodeFull = t => mapText(t, v => v.replace(/\{([^}]+)\}/g, '[$1]'));
async function decodeBeat(b) {
  const answer = (L(b.text).match(/\{([^}]+)\}/) || [])[1];
  const opts = shuffle(b.options);
  fxBeat({ fx: 'static' });
  for (;;) {
    const pickd = await present({ who: b.who, shot: b.shot, text: decodeGap(b.text), ru: b.ru, noCount: true }, (box, done) => {
      const info = document.createElement('div'); info.className = 'stmt'; info.textContent = '📡 Помехи! Какое слово пропало?';
      box.appendChild(info);
      opts.forEach((o, n) => { const btn = document.createElement('button'); btn.className = 'btn choice'; btn.innerHTML = `<span class="n">${n + 1}</span><span>${esc(o)}</span>`; btn.onclick = e => { e.stopPropagation(); done(o); }; box.appendChild(btn); });
    });
    if (pickd === answer) { sfx('ok'); haptic('medium'); break; }
    sfx('bad'); haptic('rigid'); R.helped = true; toast('Не то слово — послушай ещё раз 🎧', 2000);
  }
  await present({ who: b.who, shot: b.shot, text: decodeFull(b.text), ru: b.ru });
}

// ---------------------------------------------------------------- relationships (Fresh Start): each choice can warm or cool a character
// kept per episode, so replaying a chapter doesn't count twice
function relOf(id) { let n = 0; for (const e of Object.values(S.stories[storyId]?.relEp || {})) n += e[id] || 0; return n; }
function applyRel(rel) {
  const st = S.stories[storyId] ||= {}; st.relEp ||= {}; const e = st.relEp[ep.id] ||= {};
  for (const [id, v] of Object.entries(rel)) {
    e[id] = (e[id] || 0) + v;
    setTimeout(() => toast(v > 0 ? `❤️ ${esc(ep.chars[id].name)} это запомнит` : `💔 ${esc(ep.chars[id].name)}: не лучший ответ`, 1800), 350);
  }
  save();
}

// ---------------------------------------------------------------- the hero's phone: a chat with short messages (reading, slang, emoji)
async function chatBeat(b) {
  dlg.classList.add('hidden'); hidePop();
  const ph = $('phone'), c = ep.chars[b.with], img = world.portraits[b.with];
  ph.innerHTML = `<div class="ph"><div class="ph-top"><span class="av" style="background-image:url(${img || ''});--c:${c.color}"></span><span><b>${esc(c.name)}</b><small>${esc(L(b.title) || 'online')}</small></span></div><div class="ph-msgs"></div><div class="ph-foot"></div></div>`;
  ph.classList.remove('hide');
  const msgs = ph.querySelector('.ph-msgs'), foot = ph.querySelector('.ph-foot');
  const scroll = () => { msgs.scrollTop = msgs.scrollHeight; };
  for (const m of b.msgs) {
    if (m.from) {
      const typing = document.createElement('div'); typing.className = 'bub in typing'; typing.innerHTML = '<i></i><i></i><i></i>';
      msgs.appendChild(typing); scroll(); await sleep(850); typing.remove();
      R.line = { who: m.from, text: m.text, ru: m.ru }; R.helped = false; R.ruUsed = false; R.tapped = new Set();
      const d = document.createElement('div'); d.className = 'bub in';
      const t = document.createElement('div'); renderTokens(t, L(m.text), { onTap: lineHelped });
      const ru = document.createElement('div'); ru.className = 'bru hide'; ru.textContent = L(m.ru) || '';
      const rb = document.createElement('button'); rb.className = 'rb'; rb.textContent = 'RU';
      rb.onclick = e => { e.stopPropagation(); ru.classList.toggle('hide'); if (R.line && R.line.text === m.text) { R.helped = true; R.ruUsed = true; } };
      d.append(t, ru, rb); msgs.appendChild(d); scroll(); sfx('beep'); haptic();
      await new Promise(res => { foot.innerHTML = '<button class="btn pri">Дальше ▸</button>'; foot.firstChild.onclick = () => { sfx('next'); res(); }; });
      finishLine();
    } else if (m.reply) {
      const pick = await new Promise(res => {
        foot.innerHTML = '';
        m.reply.forEach((o, i) => { const btn = document.createElement('button'); btn.className = 'btn choice'; btn.innerHTML = `<span class="n">${i + 1}</span><span>${esc(plain(L(o.text)))}<small class="opt-ru">${esc(L(o.ru))}</small></span>`; btn.onclick = () => { sfx('next'); haptic(); res(o); }; foot.appendChild(btn); });
      });
      foot.innerHTML = '';
      const d = document.createElement('div'); d.className = 'bub out'; d.textContent = plain(L(pick.text)); msgs.appendChild(d); scroll();
      if (pick.rel) applyRel(pick.rel);
      if (pick.flag) { const st = S.stories[storyId] ||= {}; (st.flags ||= {})[pick.flag] = true; save(); }
      await sleep(500);
    }
  }
  await sleep(500);
  ph.classList.add('hide');
}

// ---------------------------------------------------------------- screen and room effects
async function fxBeat(b) {
  const veil = $('veil');
  if (b.fx === 'black') { veil.className = 'black'; return; }
  if (b.fx === 'clear') { veil.className = ''; return; }
  if (b.fx === 'eyes') { dlg.classList.add('hidden'); veil.className = 'eyes'; await sleep(2600); veil.className = ''; return; }
  if (b.fx === 'static') { sfx('static'); veil.className = ''; void veil.offsetWidth; veil.className = 'static'; setTimeout(() => { if (veil.className === 'static') veil.className = ''; }, 900); return; }
  if (b.fx === 'shake') { world.shake(0.4); haptic('heavy'); return; }
  if (b.fx === 'alarm' && b.v) sfx('alarm');
  if (b.fx === 'lights' && b.v === 'off') sfx('hum');
  if (b.fx === 'channel') sfx('click');
  world.fx(b.fx, b.v);
}

function pickEvidence(sub = 'Какая улика опровергает эти слова?') {
  return new Promise(resolve => {
    const ov = $('sheet'), el = ov.firstElementChild;
    el.innerHTML = `<div class="hd"><h2>Show evidence</h2><button class="ib" id="ev-x">✕</button></div>
      <div class="tabs"><span style="color:var(--muted);font-size:14px">${sub}</span></div>
      <div class="bd">${[...R.found].map(k => `<button class="ev pick" data-k="${k}"><span class="i">${ep.clues[k].icon}</span><span><b>${esc(ep.clues[k].title)}</b><br><small style="color:var(--muted)">${esc(plain(L(ep.clues[k].text)))}</small></span></button>`).join('')}</div>`;
    ov.classList.remove('hide');
    el.querySelector('#ev-x').onclick = () => { ov.classList.add('hide'); resolve(null); };
    el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { ov.classList.add('hide'); resolve(b.dataset.k); });
  });
}

async function objectionFx(who) {
  sfx('objection'); haptic('heavy'); world.shake(0.6);
  $('flash').classList.remove('hide');
  setTimeout(() => world.play(who, 'hit'), 250);
  await sleep(950);
  $('flash').classList.add('hide');
}

async function interrogateBeat(b) {
  let wrong = 0, wi = 0;
  for (const round of b.rounds) {
    const sts = round.statements, solved = new Set();
    const lies = sts.map((s, i) => s.lie ? i : -1).filter(i => i >= 0);
    let i = 0;
    while (lies.some(j => !solved.has(j))) {
      const st = sts[i];
      const res = await present({ who: b.who, shot: b.shot, text: st.text, ru: st.ru, anim: i % 2 ? 'talk' : undefined }, (box, done) => {
        const info = document.createElement('div'); info.className = 'stmt';
        info.innerHTML = `Statement ${i + 1}/${sts.length}<span class="dots">${sts.map((_, j) => `<i class="${solved.has(j) ? 'done' : j === i ? 'on' : ''}"></i>`).join('')}</span>${solved.has(i) ? ' · <span class="ok">✓ разоблачено</span>' : ''}`;
        const prev = document.createElement('button'); prev.className = 'btn nav'; prev.textContent = '◀';
        const next = document.createElement('button'); next.className = 'btn nav'; next.textContent = '▶';
        const obj = document.createElement('button'); obj.className = 'btn obj'; obj.textContent = 'OBJECTION!';
        prev.onclick = e => { e.stopPropagation(); sfx('next'); done(-1); };
        next.onclick = e => { e.stopPropagation(); sfx('next'); done(1); };
        obj.onclick = e => { e.stopPropagation(); done('obj'); };
        if (solved.has(i)) obj.disabled = true;
        box.append(info, prev, obj, next);
      });
      if (res === -1) { i = (i - 1 + sts.length) % sts.length; continue; }
      if (res === 1) { i = (i + 1) % sts.length; continue; }
      const clue = await pickEvidence();
      if (!clue) continue;
      if (st.lie && st.lie === clue && !solved.has(i)) {
        await objectionFx(b.who);
        for (const a of st.after) await present({ ...a, shot: a.shot || (world.present(a.who) && a.who !== 'reyes' ? a.who : 'reyes') });
        solved.add(i); wrong = 0; i = (i + 1) % sts.length;
        world.shot(b.shot);
      } else {
        sfx('bad'); haptic('rigid'); wrong++;
        await present({ ...WRONG[wi++ % WRONG.length], shot: 'reyes', noCount: true });
        if (wrong >= 2) { await present({ who: 'reyes', anim: 'think', ...(b.hint || HINT), shot: 'reyes', noCount: true }); wrong = 0; }
        world.shot(b.shot);
      }
    }
  }
}

async function recallBeat(b) {
  const due = shuffle(dueWords().filter(k => trackedInfo(k)?.cloze)).slice(0, b.max || 1);
  if (!due.length) return;
  const shot = b.shot || 'reyes';
  await present({ ...RECALL_INTRO, who: b.who, shot, noCount: true });
  for (const k of due) {
    const info = trackedInfo(k);
    const others = shuffle(trackedKeys().filter(x => x !== k && trackedInfo(x).form !== info.form)).slice(0, 2).map(x => trackedInfo(x).form);
    const opts = shuffle([info.form, ...others]);
    const ans = await present({ who: b.who, shot, text: info.cloze.text, ru: info.cloze.ru, noCount: true }, (box, done) => {
      opts.forEach((o, n) => { const btn = document.createElement('button'); btn.className = 'btn choice'; btn.innerHTML = `<span class="n">${n + 1}</span><span>${esc(o)}</span>`; btn.onclick = e => { e.stopPropagation(); done(o); }; box.appendChild(btn); });
    });
    const ok = ans === info.form;
    meet(k, !ok, ep.id); save();
    if (ok) { sfx('ok'); await present({ ...RECALL_OK, who: b.who, noCount: true }); }
    else { sfx('bad'); await present({ who: b.who, text: `Not quite. It's "${info.form}". No worries!`, ru: `Не совсем. Правильно — «${info.form}» (${info.ru}). Ничего страшного!`, noCount: true }); }
  }
}

export function ask(html, yes, no) {
  return new Promise(res => {
    const ov = $('ask'), el = ov.firstElementChild;
    el.innerHTML = `${html}<div class="row"><button class="btn" id="ak-n">${no}</button><button class="btn pri" id="ak-y">${yes}</button></div>`;
    ov.classList.remove('hide');
    el.querySelector('#ak-y').onclick = () => { ov.classList.add('hide'); res(true); };
    el.querySelector('#ak-n').onclick = () => { ov.classList.add('hide'); res(false); };
  });
}
async function maybeAdjust() {
  if (R.asked || S.placing || R.al < 6) return;
  const ratio = R.ac / R.al, i = LEVELS.indexOf(level());
  if (ratio >= 0.85 && i < 2) {
    R.asked = true;
    if (S.auto || await ask(`<h2>Тебе легко 💪</h2><p>Ты понял(а) ${Math.round(ratio * 100)}% реплик без перевода. Сделать текст сложнее (${LEVEL_NAME[LEVELS[i + 1]]})?</p>`, 'Да, сложнее', 'Оставить')) { S.level = LEVELS[i + 1]; save(); paintLevel(); toast(`Уровень текста: <b>${LEVEL_NAME[level()]}</b>`); }
  } else if (ratio < 0.4 && i > 0) {
    R.asked = true;
    if (S.auto || await ask(`<h2>Сделать попроще?</h2><p>Ты часто открываешь перевод — это нормально! Можно упростить текст (${LEVEL_NAME[LEVELS[i - 1]]}), история не изменится.</p>`, 'Да, проще', 'Оставить')) { S.level = LEVELS[i - 1]; save(); paintLevel(); toast(`Уровень текста: <b>${LEVEL_NAME[level()]}</b>`); }
  }
}


// ---------------------------------------------------------------- "Previously on…": polaroids over a sepia, blurred scene
async function recapBeat(b) {
  document.body.classList.add('flashback');
  const rc = $('recap');
  rc.innerHTML = `<div class="rt">Previously on<b>${esc(ep.story)}</b></div><div class="pol hide"></div>`;
  rc.classList.remove('hide'); sfx('paper');
  await sleep(1500);
  const pol = rc.querySelector('.pol');
  rc.querySelector('.rt').classList.add('small');
  for (const f of b.frames) {
    pol.innerHTML = `<div class="ic">${f.icon}</div>${f.doc ? `<div class="dc">${esc(f.doc)}</div>` : ''}`;
    pol.style.setProperty('--r', (Math.random() * 8 - 4).toFixed(1) + 'deg');
    pol.classList.remove('hide', 'in'); void pol.offsetWidth; pol.classList.add('in');
    sfx('paper');
    await present({ who: 'narr', text: f.text, ru: f.ru, noCount: true });
  }
  rc.classList.add('hide'); document.body.classList.remove('flashback');
}

// ---------------------------------------------------------------- change location: fade through black + a typewritten caption
function caption(text) {
  const c = $('caption');
  c.innerHTML = `<span>${esc(text)}</span>`; c.classList.remove('hide', 'go'); void c.offsetWidth; c.classList.add('go');
  clearTimeout(caption.t); caption.t = setTimeout(() => c.classList.add('hide'), 3600);
}
async function sceneBeat(b) {
  dlg.classList.add('hidden'); hidePop();
  const key = sceneKey(ep.scenes[b.to]);
  if (world.location !== key) { sfx('whoosh'); await world.enter(key, b.shot || 'establish'); lastWho = null; lastPhone = false; }
  else world.shot(b.shot || 'establish');
  if (b.caption) { caption(b.caption); await sleep(1700); }
}

// ---------------------------------------------------------------- final accusation: who did it, then prove when and how we know
async function accuseBeat(b) {
  const run = R.run;
  for (;;) {
    const pick = await present({ who: b.who, shot: b.shot, ...b.ask, noCount: true }, (box, done) => {
      const grid = document.createElement('div'); grid.className = 'suspects';
      for (const id of b.suspects) {
        const c = ep.chars[id], img = world.portraits[id];
        const btn = document.createElement('button'); btn.className = 'sus';
        btn.style.setProperty('--c', c.color);
        btn.innerHTML = `<span class="ph" style="background-image:url(${img || ''})"></span><b>${esc(c.name)}</b><small>${esc(c.role || '')}</small>`;
        btn.onclick = e => { e.stopPropagation(); sfx('next'); haptic(); done(id); };
        grid.appendChild(btn);
      }
      box.appendChild(grid);
    });
    if (run !== R.run) return;
    if (pick === b.culprit) break;
    sfx('bad'); haptic('rigid');
    await present({ who: b.who, shot: b.shot, anim: 'no', ...b.wrong[pick], noCount: true });
  }
  sfx('ok'); world.play(b.culprit, 'no');
  for (const pr of b.proofs) {
    for (;;) {
      await present({ who: b.who, shot: b.shot, anim: 'fold', text: pr.text, ru: pr.ru, noCount: true }, (box, done) => {
        const btn = document.createElement('button'); btn.className = 'btn obj'; btn.textContent = '🗂️ SHOW EVIDENCE';
        btn.onclick = e => { e.stopPropagation(); done(); };
        box.appendChild(btn);
      });
      if (run !== R.run) return;
      const k = await pickEvidence('Покажи улику, которая это доказывает');
      if (!k) continue;
      if (k === pr.answer) { sfx('clue'); haptic('medium'); world.shake(0.25); break; }
      sfx('bad'); haptic('rigid');
      await present({ who: b.who, shot: b.shot, anim: 'no', ...b.wrongProof, noCount: true });
    }
  }
  $('flash').querySelector('span').textContent = 'GOTCHA!';
  await objectionFx(b.culprit);
  $('flash').querySelector('span').textContent = 'OBJECTION!';
  await present({ who: b.who, shot: b.shot, anim: 'point', ...b.ok });
}

// ---------------------------------------------------------------- CASE CLOSED rubber stamp
async function stampBeat(b) {
  dlg.classList.add('hidden'); hidePop();
  const st = $('stamp');
  st.innerHTML = `<span>${esc(b.text)}</span>`; st.classList.remove('hide', 'go'); void st.offsetWidth; st.classList.add('go');
  await sleep(380); sfx('stamp'); haptic('heavy'); world.shake(0.35);
  await sleep(2100);
  st.classList.add('hide');
}

// ---------------------------------------------------------------- in-episode notebook & dossier
function notebook(tab = 'words') {
  const ov = $('sheet'), el = ov.firstElementChild;
  const words = Object.keys(ep.words).filter(k => S.words[k]);
  const wordsHtml = words.length ? words.map(k => {
    const info = trackedInfo(k), w = S.words[k], d = daysUntil(w);
    return `<div class="wd"><div><b>${esc(info.form)}</b> <button data-say="${esc(info.form)}">🔊</button><div>${esc(info.ru)}</div><div class="ex">«${esc(info.cloze.text.replace('___', info.form))}»</div></div>
      <div class="m">${MASTERY[mastery(w)]}<small>${d ? `повтор через ${d} дн.` : 'пора повторить'}</small></div></div>`;
  }).join('') : '<div class="empty">Подчёркнутые <span style="border-bottom:2px dotted var(--amber)">вот так</span> слова попадут сюда сами.</div>';
  const ev = R.found.size ? [...R.found].map(k => `<div class="ev"><span class="i">${ep.clues[k].icon}</span><span><b>${esc(ep.clues[k].title)}</b><br><small style="color:var(--muted)">${esc(plain(L(ep.clues[k].text)))}</small></span></div>`).join('') : '<div class="empty">Улик пока нет</div>';
  el.innerHTML = `<div class="hd"><h2>${tab === 'words' ? '📓 Case notes' : '🗂️ Dossier'}</h2><button class="ib" id="nb-x">✕</button></div>
    <div class="tabs"><button data-t="words" class="${tab === 'words' ? 'on' : ''}">Слова эпизода · ${words.length}</button><button data-t="ev" class="${tab === 'ev' ? 'on' : ''}">Улики · ${R.found.size}</button></div>
    <div class="bd">${tab === 'words' ? wordsHtml : ev}</div>`;
  ov.classList.remove('hide');
  el.querySelector('#nb-x').onclick = () => ov.classList.add('hide');
  el.querySelectorAll('[data-t]').forEach(b => b.onclick = () => notebook(b.dataset.t));
  el.querySelectorAll('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say));
}
$('b-note').onclick = () => { sfx('tap'); notebook('words'); };
$('b-ev').onclick = () => { sfx('tap'); notebook('ev'); };
$('b-home').onclick = async () => {
  sfx('tap');
  if (await ask('<h2>Выйти из эпизода?</h2><p>Слова, которые ты уже встретил(а), сохранятся. Эпизод начнётся заново.</p>', 'Выйти', 'Остаться')) exit();
};

// ---------------------------------------------------------------- summary
function finish() {
  dlg.classList.add('hidden'); document.body.classList.remove('cine');
  world.shot('wide'); world.setSpeaker(null); sfx('end');
  const days = markDay();
  const pct = R.lines ? Math.round(R.clean / R.lines * 100) : 0;
  finishEpisode(ep.id, pct);
  const ov = $('sum'), el = ov.firstElementChild;
  el.innerHTML = `<h2>${esc(ep.part)} closed</h2>
    <div class="big"><div><b>${pct}%</b><small>понял(а) без перевода</small></div><div><b>${Object.keys(ep.words).length}</b><small>новых слов и фраз</small></div><div><b>🔥 ${days}</b><small>${days === 1 ? 'день' : 'дней'} подряд</small></div></div>
    ${Object.keys(ep.words).map(k => { const w = S.words[k], info = ep.words[k]; return `<div class="wd"><div><b>${esc(info.form)}</b><div class="ex">${esc(info.ru)}</div></div><div class="m">${MASTERY[mastery(w)]}<small>${w ? (daysUntil(w) ? `повтор через ${daysUntil(w)} дн.` : 'пора повторить') : 'не встретилось'}</small></div></div>`; }).join('')}
    ${ep.rel ? `<div class="rel">${ep.rel.map(id => { const n = relOf(id); return `<span style="--c:${ep.chars[id].color}"><b>${esc(ep.chars[id].name)}</b>${'❤️'.repeat(Math.max(0, Math.min(3, n)))}${n <= 0 ? '🤍' : ''}<small>${n > 1 ? 'тепло' : n === 1 ? 'симпатия' : n === 0 ? 'нейтрально' : 'прохладно'}</small></span>`; }).join('')}</div>` : ''}
    <div class="teaser">${ep.icon || '🕵'} ${esc(L(ep.teaser))}<div style="font-family:Inter,sans-serif;font-size:13px;color:#d9a7c0;margin-top:4px">${esc(ep.teaserRu)}</div></div>
    <div class="row"><button class="btn" id="sm-nb" style="text-align:center;flex:none">📓</button><button class="btn pri" id="sm-home">Готово</button></div>
    <p style="color:var(--muted);font-size:12px;text-align:center;margin:10px 0 0">Слова вернутся в следующих эпизодах — когда придёт время повторить.</p>`;
  ov.classList.remove('hide');
  playLine(ep.chars.narr.voice, L(ep.teaser));
  el.querySelector('#sm-nb').onclick = () => notebook('words');
  el.querySelector('#sm-home').onclick = () => { ov.classList.add('hide'); exit(true); };
}

function exit(completed = false) {
  R.run++; stopLine(); duck(false); ambience(false); hidePop(); clearInterval(R.typing);
  for (const id of ['card', 'sheet', 'sum', 'ask', 'flash', 'recap', 'caption', 'stamp', 'phone']) $(id).classList.add('hide');
  $('veil').className = '';
  document.body.classList.remove('flashback');
  dlg.classList.add('hidden'); document.body.classList.remove('cine', 'playing');
  $('top').classList.add('hide');
  world?.setExplore(null); world?.onTap(null); world?.pause(true);
  hooks.onExit?.(completed);
}

// ---------------------------------------------------------------- loading + runner
// loads the episode data and the story's 3D scene; onProgress(0..1)
export async function prepare(entry, onProgress) {
  const mod = (await entry.load()).default;
  registerWords(mod.words, mod.id);
  const st = STORY[entry.story];
  const w = await getStage(), scenes = Object.values(mod.scenes);
  // progress: each location is an equal share; portraits are the last bit
  for (let i = 0; i < scenes.length; i++) {
    const sc = scenes[i];
    await w.load(sceneKey(sc), await st.locs[sc.loc](), { chars: mod.chars, cast: sc.cast, mood: sc.mood }, p => onProgress?.((i + p) / (scenes.length + 0.2)));
  }
  await w.makePortraits(mod.chars);
  onProgress?.(1);
  return mod;
}

export async function play(mod, story, h = {}) {
  ep = mod; hooks = h; world = await getStage(); storyId = story;
  if (ep.rel) { const st = S.stories[story]; if (st?.relEp) delete st.relEp[ep.id]; }
  document.body.dataset.story = story; setMood(STORY[story].mood); $('veil').className = '';
  // start in the first location (the one the first scene beat names, or the only one)
  const firstScene = mod.beats.find(b => b.type === 'scene');
  await world.enter(sceneKey(mod.scenes[firstScene ? firstScene.to : Object.keys(mod.scenes)[0]]), firstScene?.shot || 'establish', true);
  world.pause(false); world.fx('reset');
  unlock(); startRain(); startMusic(); setMusic(S.music); ambience(true);
  voiceState.on = S.voice; paintVoice();
  resetRun(); hidePop(); R.run++;
  const run = R.run;
  document.body.classList.add('playing');
  $('top').classList.remove('hide'); $('ep-title').textContent = ep.story; $('ep-part').textContent = `${ep.part} · ${ep.title}`;
  paintLevel();
  const beats = ep.beats;
  let i = 0;
  while (i < beats.length && run === R.run) {
    const b = beats[i];
    let go = b.goto;
    if (b.type === 'line') await present(b);
    else if (b.type === 'choice') { const k = await choiceBeat(b); const o = b.options[k]; go = o.goto; if (o.flag) { const st = S.stories[story] ||= {}; (st.flags ||= {})[o.flag] = true; save(); } if (o.rel) applyRel(o.rel); }
    else if (b.type === 'chat') await chatBeat(b);
    else if (b.type === 'recap') await recapBeat(b);
    else if (b.type === 'scene') await sceneBeat(b);
    else if (b.type === 'clue') await openClue(b.id);
    else if (b.type === 'accuse') await accuseBeat(b);
    else if (b.type === 'stamp') await stampBeat(b);
    else if (b.type === 'explore') await exploreBeat(b);
    else if (b.type === 'interrogate') await interrogateBeat(b);
    else if (b.type === 'recall') await recallBeat(b);
    else if (b.type === 'task') await taskBeat(b);
    else if (b.type === 'decode') await decodeBeat(b);
    else if (b.type === 'fx') await fxBeat(b);
    else if (b.type === 'end') return finish();
    await maybeAdjust();
    i = go ? beats.findIndex(x => x.label === go) : i + 1;
  }
}

export const debug = { R, get world() { return world; } };
