// The three series: what the home and story screens show, and how each playable episode loads.
// Only written episodes are listed; the season plan lives in docs/05-design.md. After the last one the screen says "новые эпизоды скоро".
import { S, dayNum } from '../engine/vocab.js';

export const STORIES = [
  {
    id: 'a', title: 'Last Signal', genre: 'фантастика · выживание', font: "'Share Tech Mono',monospace", accent: '#5dffb0',
    poster: 'assets/posters/a.svg', season: 'Сезон 1 · Aurora-7', unit: 'Эпизод',
    pitch: 'Ты приходишь в себя на полярной станции. Никого нет, метель, работает только старая рация.',
    hook: 'Do it by the instruction', hookRu: 'Чини, веди и расшифровывай по инструкциям на английском',
    cast: [['🧪', 'Maya Chen', 'учёная с соседней станции'], ['✈️', 'Rook', 'пилот, застрял в 20 км'], ['📻', 'Eli', 'голос подростка с помехами'], ['🤖', 'ARIA', 'ИИ станции, иногда странный']],
    episodes: [
      ['A-01', 'Wake Up', 'один на станции, первый сигнал по рации', () => import('./a01.js')],
    ],
  },
  {
    id: 'b', title: 'Case Files', sub: 'Harbor City', genre: 'уютный нуар · детектив', font: "'Special Elite',monospace", accent: '#ff7cbb',
    poster: 'assets/posters/b.svg', season: 'Сезон 1 · The Harbor Mole', unit: 'Эпизод',
    pitch: 'Ты стажёр в детективном агентстве портового города. Дела небольшие — но все ведут к чему-то большему.',
    hook: 'Catch the contradiction', hookRu: 'Лови свидетелей на лжи: «OBJECTION!» и нужная улика',
    cast: [['🕵️‍♀️', 'Inspector Reyes', 'шефиня: строгая и честная'], ['💻', 'Jenna Park', 'архив и хакер, говорит сленгом'], ['🎩', 'Oscar Blackwood', 'партнёр, вечно «в отъезде»'], ['👮', 'Milo Grant', 'полицейский, недоговаривает']],
    episodes: [
      ['B-01', 'Coffee & Lies · 1', 'кража выручки в кафе', () => import('./b01.js')], ['B-02', 'Coffee & Lies · 2', 'развязка: кто взял деньги?', () => import('./b02.js')],
    ],
  },
  {
    id: 'c', title: 'Fresh Start', genre: 'жизнь · дружба · тайна', font: "'Caveat',cursive", accent: '#ffc27a',
    poster: 'assets/posters/c.svg', season: 'Сезон 1 · Autumn in Kinloch', unit: 'Глава',
    pitch: 'Тебе 19, год учёбы в шотландском городке у моря. В твоей комнате — дневник парня, который исчез без слова.',
    hook: 'Life choices', hookRu: 'Твой тон в разговорах меняет отношения — и то, кто поможет с тайной',
    cast: [['☕', 'Fiona', 'хозяйка кафе и комнаты'], ['🎸', 'Kai', 'сосед, музыкант, шутник'], ['📚', 'Priya', 'однокурсница, умная и амбициозная'], ['🗼', 'Mr. Duncan', 'смотритель маяка']],
    episodes: [
      ['C-01', 'Arrival', 'вокзал, Fiona и кафе The Puffin', () => import('./c01.js')],
    ],
  },
  {
    id: 'd', title: 'Backstage', genre: 'романтика · музыка · Лондон', font: "'Caveat',cursive", accent: '#ff8fc8',
    poster: 'assets/posters/d.svg', season: 'Сезон 1 · Tidewater Records', unit: 'Эпизод',
    pitch: 'Тебе 18, стажировка на лондонском музыкальном лейбле. Одна чашка кофе — и ты в фиктивных отношениях с самым колючим солистом Британии.',
    hook: 'Every word counts', hookRu: 'Твои ответы меняют отношения: читай подтекст, лови сарказм и не путай bored с boring',
    cast: [['🎤', 'Kit Rowe', 'солист Velvet Static, колючий'], ['🎧', 'Leo Hart', 'звукорежиссёр, тёплый'], ['💅', 'Ava', 'соседка по квартире'], ['📱', 'Dana', 'менеджер лейбла'], ['✨', 'Sienna', 'певица, соперница']],
    episodes: [
      ['D-01', 'First Day', 'квартира в Камдене, лейбл, кофе на Ките и папарацци', () => import('./d01.js')],
    ],
  },
].map(s => ({ ...s, episodes: s.episodes.map(([id, title, about, load], i) => ({ id, title, about, load, n: i + 1, story: s.id })) }));

export const storyById = id => STORIES.find(s => s.id === id);
export const episodeById = id => STORIES.flatMap(s => s.episodes).find(e => e.id === id);

// done · open · tomorrow (one new episode per day) · locked (finish the previous one) · soon (not written yet)
export function epStatus(ep) {
  if (S.eps[ep.id]?.done) return 'done';
  if (!ep.load) return 'soon';
  const list = storyById(ep.story).episodes, prev = list[ep.n - 2];
  if (!prev) return 'open';
  const p = S.eps[prev.id];
  if (!p?.done) return 'locked';
  return p.day >= dayNum() ? 'tomorrow' : 'open';
}
// the episode a story card points at: the first not finished one
export function storyNext(s) {
  return s.episodes.find(e => epStatus(e) !== 'done') || s.episodes[s.episodes.length - 1];
}
export const storyDone = s => s.episodes.filter(e => S.eps[e.id]?.done).length;
