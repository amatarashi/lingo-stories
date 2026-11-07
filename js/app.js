// App shell: first run, home ("series"), story screen with episodes, shared notebook, profile. Episodes run in play/player.js.
import { STORIES, storyById, epStatus, storyNext, storyDone } from './content/catalog.js';
import { S, save, dueWords, mastery, MASTERY, daysUntil, streakNow, freezeLeft, playedToday, wordStats, weeklyClean, skipDay, resetAll, dayNum } from './engine/vocab.js';
import { registerWords, trackedInfo } from './engine/lex.js';
import { unlock, sfx, speak } from './engine/sound.js';
import { voiceState } from './engine/voice.js';
import { pull, flush, cloudOn } from './engine/cloud.js';
import { LEVEL_NAME } from './engine/text.js';
import * as player from './play/player.js';

const tg = window.Telegram?.WebApp;
if (tg?.initData) { document.body.classList.add('in-tg'); tg.ready(); tg.expand(); tg.disableVerticalSwipes?.(); tg.setHeaderColor?.('#0b1020'); tg.setBackgroundColor?.('#0b1020'); }
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const haptic = (k = 'light') => tg?.HapticFeedback?.impactOccurred(k);
const plural = (n, one, few, many) => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? few : many; };
const SCREENS = ['home', 'story', 'notes', 'profile'];
const STATUS = { done: '✓ пройден', open: '▶ играть', tomorrow: '🌙 завтра', locked: '🔒', soon: 'скоро' };
const STORY_ICON = { a: '🛰', b: '🕵', c: '🏡' };

// all written episodes register their words, so the notebook can show every word the player has met
const wordsReady = Promise.all(STORIES.flatMap(s => s.episodes).filter(e => e.load).map(e => e.load().then(m => registerWords(m.default.words, m.default.id)).catch(() => {})));
const epOfWord = {};
wordsReady.then(() => STORIES.flatMap(s => s.episodes).forEach(e => e.load?.().then(m => { for (const k in m.default.words) epOfWord[k] = e; })));

let current = 'home', storyId = null;
function show(name, arg) {
  if (name === 'story') storyId = arg ?? storyId;
  current = name;
  for (const n of SCREENS) $(n).classList.toggle('hide', n !== name);
  $('nav').classList.toggle('hide', name === 'story');
  for (const b of $('nav').children) b.classList.toggle('on', b.dataset.go === name);
  ({ home: renderHome, story: renderStory, notes: renderNotes, profile: renderProfile })[name]();
  $(name).scrollTop = 0;
  tg?.BackButton?.[name === 'story' ? 'show' : 'hide']?.();
}
$('nav').onclick = e => { const b = e.target.closest('[data-go]'); if (b) { sfx('tap'); haptic(); show(b.dataset.go); } };
// Telegram's own Back: inside an episode it asks to leave (same as the in-game exit), on a story it goes home
tg?.BackButton?.onClick?.(() => { if (document.body.classList.contains('playing')) $('b-home').click(); else if (current === 'story') show('home'); });
document.addEventListener('pointerdown', () => unlock(), { once: true });

// ---------------------------------------------------------------- home
function streakChip() {
  const d = streakNow();
  return `<span class="chip ${playedToday() ? 'fire' : 'cold'}" title="Серия дней">🔥 ${d}</span>`;
}
function storyCard(s) {
  const next = storyNext(s), st = epStatus(next), done = storyDone(s), total = s.episodes.length;
  const badge = st === 'open' ? (done ? '<span class="badge">Новый эпизод</span>' : '<span class="badge">Начать</span>')
    : st === 'tomorrow' ? '<span class="badge wait">🌙 Новый — завтра</span>'
    : st === 'soon' ? `<span class="badge soon">${done ? 'Продолжение скоро' : 'Скоро'}</span>`
    : st === 'done' && done === total ? '<span class="badge soon">Продолжение скоро</span>' : '';
  return `<button class="pc" data-story="${s.id}" style="--acc:${s.accent}">
    <img src="${s.poster}" alt="" loading="lazy"><div class="sh"></div>${badge}
    <div class="in"><div class="gen">${esc(s.genre)}</div>
      <div class="nm2" style="font-family:${s.font}">${esc(s.title)}${s.sub ? `<small>${esc(s.sub.toUpperCase())}</small>` : ''}</div>
      <div class="pt">${esc(s.pitch)}</div>
      <div class="pr"><span>${s.unit} ${Math.min(done + 1, total)} из ${total}</span><span class="bar2"><i style="width:${done / total * 100}%"></i></span></div>
    </div></button>`;
}
function renderHome() {
  const due = dueWords().length, today = playedToday();
  $('home').innerHTML = `<div class="wrap">
    <div class="hdr"><div class="logo2">Lingo <span>Stories</span></div>${streakChip()}<span class="chip">${LEVEL_NAME[S.level] || 'A?'}</span></div>
    <div class="today">
      <div class="t ${today ? 'ok' : ''}"><i>${today ? '✅' : '🎬'}</i><span>${today ? '<b>Эпизод на сегодня пройден</b><br>серия не сгорит' : '<b>Сегодня: 0 из 1 эпизода</b><br>10–15 минут, и серия растёт'}</span></div>
      <div class="t"><i>🔁</i><span><b>${due ? `${due} ${plural(due, 'слово ждёт', 'слова ждут', 'слов ждут')}` : 'Повторять пока нечего'}</b><br>${due ? 'вернутся прямо в сюжете' : 'слова вернутся сами, когда придёт время'}</span></div>
    </div>
    <h3 class="sec">Твои сериалы</h3>
    <div class="rail">${STORIES.map(storyCard).join('')}</div>
    <p class="hint2">Новые эпизоды выходят регулярно — следи за ботом</p>
  </div>`;
  $('home').querySelectorAll('[data-story]').forEach(b => b.onclick = () => { sfx('tap'); haptic(); show('story', b.dataset.story); });
  // phones: the rail scrolls sideways, so start at a series that has something to play
  const rail = $('home').querySelector('.rail'), first = STORIES.findIndex(s => epStatus(storyNext(s)) === 'open');
  if (first > 0 && rail.scrollWidth > rail.clientWidth) { const c = rail.children[first]; rail.scrollLeft = c.offsetLeft - (rail.clientWidth - c.offsetWidth) / 2; }
}

// ---------------------------------------------------------------- story screen
function renderStory() {
  const s = storyById(storyId), next = storyNext(s), st = epStatus(next);
  const rows = s.episodes.map(e => {
    const es = epStatus(e), r = S.eps[e.id];
    return `<button class="er ${es}" data-ep="${e.id}"><span class="no">${es === 'done' ? '✓' : e.n}</span>
      <span class="tx"><b>${esc(e.title)}</b><small>${esc(e.about)}${r?.pct != null ? ` · без перевода ${r.pct}%` : ''}</small></span><span class="st">${STATUS[es]}</span></button>`;
  }).join('') + '<div class="er soon"><span class="no">…</span><span class="tx"><b>Новые эпизоды скоро</b><small>сериал продолжается</small></span></div>';
  const label = st === 'open' ? `▶ Играть: ${s.unit.toLowerCase()} ${next.n}` : st === 'tomorrow' ? '🌙 Новый эпизод откроется завтра' : st === 'done' ? '↻ Пройти последний ещё раз' : 'Новые эпизоды скоро';
  $('story').innerHTML = `<div class="hero" style="--acc:${s.accent}"><img src="${s.poster}" alt=""><div class="sh"></div>
      <button class="ib back" id="st-back">←</button>
      <div class="in wrap"><div class="gen">${esc(s.genre)}</div><div class="nm2" style="font-family:${s.font}">${esc(s.title)}${s.sub ? `<small>${esc(s.sub.toUpperCase())}</small>` : ''}</div></div></div>
    <div class="wrap" style="--acc:${s.accent}">
      <p class="pitch">${esc(s.pitch)}</p>
      <div class="hook"><i>${STORY_ICON[s.id]}</i><span><b>${esc(s.hook)}</b><small>${esc(s.hookRu)}</small></span></div>
      <h3 class="sec">Персонажи</h3>
      <div class="cast">${s.cast.map(([i, n, d]) => `<div><i>${i}</i><b>${esc(n)}</b><small>${esc(d)}</small></div>`).join('')}</div>
      <h3 class="sec">${esc(s.season)}</h3>
      <div class="eps">${rows}</div>
    </div>
    <div class="cta" style="--acc:${s.accent}"><button class="btn" id="st-play" ${st === 'open' || st === 'done' ? '' : 'disabled'}>${label}</button></div>`;
  $('st-back').onclick = () => { sfx('tap'); show('home'); };
  $('story').querySelectorAll('[data-ep]').forEach(b => b.onclick = () => {
    const e = s.episodes.find(x => x.id === b.dataset.ep), es = epStatus(e);
    if (es === 'open' || (es === 'done' && e.load)) start(e);
    else player.toast(es === 'tomorrow' ? '🌙 Один новый эпизод в день — этот откроется завтра' : es === 'locked' ? '🔒 Сначала пройди предыдущий' : '✍️ Этот эпизод ещё пишется', 2200);
  });
  $('st-play').onclick = () => start(st === 'done' ? s.episodes.filter(e => e.load).pop() : next);
}

// ---------------------------------------------------------------- loading + playing
const TIPS = ['🎧 Лучше в наушниках', '👆 Тапни по слову — увидишь перевод', '🔁 Слова вернутся в сюжете, когда придёт время их повторить', 'RU — перевод всей фразы, но попробуй сначала без него 😉', '🔥 Один эпизод в день держит серию'];
async function start(entry) {
  sfx('tap'); haptic('medium');
  const s = storyById(entry.story);
  const ld = $('loading');
  ld.style.setProperty('--acc', s.accent);
  ld.innerHTML = `<img src="${s.poster}" alt=""><div class="sh"></div><div class="in">
    <div class="nm2" style="font-family:${s.font}">${esc(s.title)}</div><div class="ep3">${s.unit} ${entry.n} · ${esc(entry.title)}</div>
    <div class="pb"><i id="ld-bar"></i></div><div class="tip">${TIPS[Math.random() * TIPS.length | 0]}</div>
    <button class="btn pri hide" id="ld-go">▶ Начать</button></div>`;
  ld.classList.remove('hide');
  let mod;
  try { mod = await player.prepare(entry, p => { $('ld-bar').style.width = Math.round(p * 100) + '%'; }); }
  catch (e) { console.error(e); ld.querySelector('.tip').textContent = 'Не получилось загрузить 😕 Проверь интернет и попробуй ещё раз.'; setTimeout(() => ld.classList.add('hide'), 2500); return; }
  $('ld-bar').style.width = '100%';
  // a tap is needed anyway to start sound on phones
  const go = $('ld-go'); go.classList.remove('hide');
  go.onclick = () => {
    unlock(); ld.classList.add('hide');
    if (!S.placed && !S.level) S.placing = true;
    player.play(mod, entry.story, { onExit: () => show(current === 'story' ? 'story' : 'home') });
  };
}

// ---------------------------------------------------------------- notebook (all stories)
let nbFilter = 'all';
function renderNotes() {
  const all = Object.entries(S.words).filter(([k]) => trackedInfo(k));
  const by = { all: () => true, due: ([, w]) => daysUntil(w) === 0, hard: ([, w]) => w.help >= 2 || (w.help > 0 && mastery(w) === 0) };
  for (const s of STORIES) by[s.id] = ([k, w]) => (epOfWord[k]?.story || w.src?.[0]?.toLowerCase()) === s.id;
  const list = all.filter(by[nbFilter] || by.all).sort((a, b) => b[1].last - a[1].last);
  const counts = {}; for (const f in by) counts[f] = all.filter(by[f]).length;
  const flt = [['all', 'Все'], ['due', '🔁 Повторить'], ['hard', '😬 Сложные'], ...STORIES.map(s => [s.id, `${STORY_ICON[s.id]} ${s.title}`])];
  $('notes').innerHTML = `<div class="wrap">
    <div class="ttl">📓 Блокнот</div><p class="sub2">Слова и фразы из всех историй. Повторять их отдельно не нужно — они сами вернутся в сюжете.</p>
    <div class="flt">${flt.map(([k, n]) => `<button data-f="${k}" class="${nbFilter === k ? 'on' : ''}">${n} · ${counts[k] ?? 0}</button>`).join('')}</div>
    <div class="wl">${list.length ? list.map(([k, w]) => {
      const info = trackedInfo(k), d = daysUntil(w), e = epOfWord[k], s = e && storyById(e.story);
      return `<div class="wd"><div><b>${esc(info.form)}</b> <button data-say="${esc(info.form)}">🔊</button><div>${esc(info.ru)}</div>
        ${info.cloze ? `<div class="ex">«${esc(info.cloze.text.replace('___', info.form))}»</div>` : ''}${s ? `<span class="src">${STORY_ICON[s.id]} ${esc(s.title)}, ${s.unit.toLowerCase()} ${e.n}</span>` : ''}</div>
        <div class="m">${MASTERY[mastery(w)]}<small>${d ? `повтор через ${d} дн.` : 'пора повторить'}</small></div></div>`;
    }).join('') : `<div class="empty">${all.length ? 'Здесь пусто — попробуй другой фильтр' : 'Пока пусто. Подчёркнутые <span style="border-bottom:2px dotted var(--amber)">вот так</span> слова из историй попадут сюда сами.'}</div>`}</div>
  </div>`;
  $('notes').querySelectorAll('[data-f]').forEach(b => b.onclick = () => { nbFilter = b.dataset.f; sfx('tap'); renderNotes(); });
  $('notes').querySelectorAll('[data-say]').forEach(b => b.onclick = () => speak(b.dataset.say));
}

// ---------------------------------------------------------------- profile
const LV = [['a1', 'Easy · A1', 'короткие простые фразы'], ['a2', 'Medium · A2', 'обычная речь'], ['b1', 'Hard · B1', 'сленг, идиомы, оттенки'], ['auto', 'Авто', 'игра подстраивает сама']];
function renderProfile() {
  const ws = wordStats(), total = S.stats.lines ? Math.round(S.stats.clean / S.stats.lines * 100) : null;
  const wk = weeklyClean(), labels = ['−6', '−5', '−4', '−3', '−2', 'прош.', 'эта'];
  const lvOn = S.auto ? 'auto' : S.level;
  const user = tg?.initDataUnsafe?.user;
  $('profile').innerHTML = `<div class="wrap">
    <div class="ttl">👤 ${esc(user?.first_name || 'Профиль')}</div><p class="sub2">${cloudOn ? '☁️ Прогресс сохраняется в Telegram и не потеряется' : 'Прогресс сохраняется на этом устройстве'}</p>
    <div class="panel"><h4>Серия</h4><div class="kpis">
      <div><b>🔥 ${streakNow()}</b><small>${plural(streakNow(), 'день', 'дня', 'дней')} подряд</small></div>
      <div><b>${S.streak.best || 0}</b><small>рекорд</small></div>
      <div><b>${freezeLeft() ? '🧊 1' : '—'}</b><small>${freezeLeft() ? 'заморозка на неделю' : 'заморозка потрачена'}</small></div></div>
      <p style="color:var(--muted);font-size:12.5px;margin:10px 0 0">Пропустил(а) один день? Заморозка спасёт серию сама — раз в неделю.</p></div>
    <div class="panel"><h4>Слова</h4><div class="kpis">
      <div><b>${ws.total}</b><small>встречено</small></div><div><b>${ws.known}</b><small>знакомых</small></div><div><b>${ws.mastered}</b><small>освоено</small></div></div></div>
    <div class="panel"><h4>Понято без перевода · по неделям</h4>
      <div class="chart">${wk.map((v, i) => `<div><em>${v == null ? '' : v + '%'}</em><i class="${v == null ? 'no' : ''}" style="height:${v == null ? 3 : Math.max(4, v)}%"></i><small>${labels[i]}</small></div>`).join('')}</div>
      <p style="color:var(--muted);font-size:12.5px;margin:8px 0 0">За всё время: <b style="color:var(--amber)">${total == null ? '—' : total + '%'}</b> реплик без перевода</p></div>
    <div class="panel"><h4>Уровень текста</h4><div class="lvls">${LV.map(([k, n, d]) => `<button data-lv="${k}" class="${lvOn === k ? 'on' : ''}"><b>${n}</b><small>${d}</small></button>`).join('')}</div>
      <p style="color:var(--muted);font-size:12.5px;margin:10px 0 0">Сюжет одинаковый, меняется только язык. Сейчас: <b style="color:#fff">${LEVEL_NAME[S.level] || 'подберём по первым репликам'}</b></p></div>
    <div class="panel"><h4>Сериалы</h4>${STORIES.map(s => { const d = storyDone(s); return `<div class="sp"><i>${STORY_ICON[s.id]}</i><span>${esc(s.title)}</span><span class="bar2"><i style="width:${d / s.episodes.length * 100}%;background:${s.accent}"></i></span><small>${d}/${s.episodes.length}</small></div>`; }).join('')}</div>
    <div class="panel"><h4>Настройки</h4>
      <button class="tg" data-set="voice"><span>🗣️ Голоса персонажей<small>озвучка реплик</small></span><i class="sw ${S.voice ? 'on' : ''}"></i></button>
      <button class="tg" data-set="music"><span>🎵 Музыка<small>фоновая музыка в эпизодах</small></span><i class="sw ${S.music ? 'on' : ''}"></i></button>
      <button class="tg" data-set="remind"><span>🔔 Напоминания от бота<small>раз в день вечером, не чаще</small></span><i class="sw ${S.remind ? 'on' : ''}"></i></button></div>
    <button class="ghost" id="pf-day">⏩ Тест: перемотать на следующий день</button>
    <button class="ghost danger" id="pf-reset">Сбросить весь прогресс</button>
  </div>`;
  const P = $('profile');
  P.querySelectorAll('[data-lv]').forEach(b => b.onclick = () => {
    const l = b.dataset.lv; sfx('tap');
    if (l === 'auto') { S.auto = true; if (!S.level) S.placing = true; } else { S.auto = false; S.level = l; S.placed = true; S.placing = false; }
    save(); renderProfile();
  });
  P.querySelectorAll('[data-set]').forEach(b => b.onclick = () => {
    const k = b.dataset.set; S[k] = !S[k]; save(); sfx('tap'); haptic();
    if (k === 'voice') voiceState.on = S.voice;
    renderProfile();
  });
  $('pf-day').onclick = () => { skipDay(); player.toast(`⏩ Прошёл день. Пора повторить: <b>${dueWords().length}</b>`, 2000); renderProfile(); };
  $('pf-reset').onclick = async () => {
    if (!await player.ask('<h2>Сбросить всё?</h2><p>Слова, эпизоды, статистика и серия удалятся. Отменить нельзя.</p>', 'Сбросить', 'Отмена')) return;
    resetAll(); await flush(); location.reload();
  };
}

// ---------------------------------------------------------------- first run
function intro() {
  const el = $('intro');
  let pickLevel = false;
  const draw = () => {
    el.innerHTML = `<div class="bg">${STORIES.map(s => `<img src="${s.poster}" alt="">`).join('')}</div><div class="sh"></div>
      <div class="in"><h1>Choose your <span>story</span></h1>
        <p>Три сериала на английском. Эпизоды по 10–15 минут, новые выходят регулярно.</p>
        <ul><li><i>👆</i>Не понял слово? Тапни — будет перевод</li><li><i>🎯</i>Уровень подберём сами по первым репликам</li><li><i>🔁</i>Новые слова вернутся в сюжете — зубрить не нужно</li></ul>
        ${pickLevel ? `<div class="lvls">${LV.map(([k, n, d]) => `<button data-lv="${k}"><b>${n}</b><small>${d}</small></button>`).join('')}</div>` : `<button class="btn pri" id="in-go">Выбрать историю</button><button class="lnk" id="in-lv">Я знаю свой уровень английского</button>`}
      </div>`;
    el.querySelector('#in-go')?.addEventListener('click', done);
    el.querySelector('#in-lv')?.addEventListener('click', () => { pickLevel = true; sfx('tap'); draw(); });
    el.querySelectorAll('[data-lv]').forEach(b => b.onclick = () => {
      const l = b.dataset.lv;
      if (l === 'auto') S.auto = true; else { S.level = l; S.auto = false; S.placed = true; }
      done();
    });
  };
  const done = () => { unlock(); sfx('tap'); haptic(); S.seenIntro = true; save(); el.classList.add('hide'); show('home'); };
  draw(); el.classList.remove('hide');
}

// ---------------------------------------------------------------- boot
function boot() { if (!S.seenIntro) intro(); else show('home'); }
boot();
pull().then(changed => { if (changed && !document.body.classList.contains('playing')) { voiceState.on = S.voice; if (S.seenIntro) { $('intro').classList.add('hide'); show(current === 'story' ? 'story' : current); } } });
wordsReady.then(() => { if (current === 'notes') renderNotes(); });

window.game = { S, player, show, skipDay, dayNum };
