import previous from './d03.js';
import { line, choice, option, word } from './episode.js';

export default {
  id: 'D-04', story: previous.story, title: 'One More Take', part: 'Episode 4', icon: '🎧',
  chars: previous.chars, rel: previous.rel,
  scenes: { studio: previous.scenes.studio },
  endTitle: 'Window Light · Studio version',
  teaser: 'This time, the song leaves the room when you’re ready.',
  teaserRu: 'На этот раз песня выйдет из студии, когда вы будете готовы.',
  words: {
    take: previous.words.take, credited: previous.words.credited, leak: previous.words.leak,
    access: word('access', 'доступ', 'Remove ___ to the old folder.', 'Закрой доступ к старой папке.'),
  },
  clues: {},
  beats: [
    { type: 'scene', to: 'studio', shot: 'establish', reset: true, caption: 'Studio 2 · Right after the second clip' },
    line('kit', 'That pause is ours.', 'We only put that pause into the second [take]. How did it get out?', 'We only put that pause into the new [take] a minute ago. Let’s hear both versions before we call anyone.', 'Мы добавили эту паузу минуту назад. Давай сравним оба дубля, прежде чем кому-нибудь звонить.', { shot: 'kit-studio' }),
    { type: 'task', who: 'leo', shot: 'desk', targets: ['fader'], steps: [
      { do: 'fader', text: 'Push up the gold fader to compare the two takes.', ru: 'Подними золотой фейдер, чтобы сравнить два дубля.' },
    ] },
    { type: 'fx', fx: 'demo' },
    line('leo', 'Take one keeps moving.', 'The notes in the first [take] come one after another.', 'On the first take there’s almost no gap after the second note. Now listen to the one from today.', 'В первом дубле после второй ноты почти нет паузы. А теперь послушай сегодняшний.', { shot: 'desk' }),
    { type: 'fx', fx: 'second-take' },
    { type: 'decode', mode: 'word', who: 'leo', shot: 'desk', text: 'The new take has a longer {pause}.', ru: 'В новом дубле пауза длиннее.', options: ['pause', 'verse', 'title'] },
    line('leo', 'Look. The review folder is still open to guests.', 'The tablet saved both takes in the review folder. The press link still has [access].', 'There it is. The tablet sends each new take to the old review folder. The link we gave the press still has [access].', 'Вот и причина. Планшет отправляет каждый новый дубль в старую папку для прослушивания. Ссылка для прессы всё ещё работает.', { shot: 'leo' }),
    { type: 'chat', with: 'dana', title: 'Studio 2 · Review link', msgs: [
      { from: 'dana', text: 'I checked with the reporter. They opened the same old link both times.', ru: 'Я уточнила у журналиста. Оба раза он открыл одну и ту же старую ссылку.' },
      { from: 'dana', text: 'I’ve closed the link. The next version stays in the studio until you say it’s ready.', ru: 'Я закрыла ссылку. Следующая версия останется в студии, пока вы не скажете, что готовы.' },
    ] },
    line('kit', 'Shall we play it from the top?', 'Let’s play it from the top. The whole song, just for us.', 'How about one from the top, all the way through? Just for the people in this room.', 'Давай сыграем с начала до конца. Только для тех, кто сейчас здесь.', { shot: 'kit-studio' }),
    { type: 'branch', flag: 'camdenLyricQuiet', goto: 'quiet' },
    line('kit', 'Leave the light on. We can find our way back.', 'Leave the light on. We can find our way back.', 'Leave the light on. We can find our way back.', 'Оставь свет включённым. Мы сможем найти дорогу обратно.', { shot: 'kit-studio', goto: 'play' }),
    line('kit', 'Leave the light on. I’ll meet you in the quiet.', 'Leave the light on. I’ll meet you in the quiet.', 'Leave the light on. I’ll meet you in the quiet.', 'Оставь свет включённым. Я встречу тебя в тишине.', { shot: 'kit-studio', label: 'quiet' }),
    { type: 'fx', fx: 'window-light', label: 'play' },
    choice('What do you tell Kit after the song?', option('Keep my line and put my name in the credits.', 'Оставь мою строчку и укажи меня в авторах.', { goto: 'credits', rel: { kit: 1 } }),
      option('Let me hear the finished version before we decide.', 'Дай сначала услышать готовую версию.', { goto: 'wait' })),
    line('kit', 'Deal. We’ll both be [credited].', 'Deal. We’ll both be [credited] on the studio version.', 'Deal. Both names on the studio version. I’ll bring you the artwork before it goes out.', 'Договорились. На студийной версии будут оба имени. Покажу тебе обложку до выпуска.', { shot: 'kit-studio', label: 'credits', goto: 'lights' }),
    line('kit', 'All right. We’ll listen together.', 'All right. You get to hear the finished version first.', 'All right. We can listen to the finished mix together and decide when you’re ready.', 'Хорошо. Послушаем готовую версию вместе и решим, когда ты будешь готова.', { shot: 'kit-studio', label: 'wait' }),
    line('narr', 'Leo saves the song. You leave the light on.', 'Leo saves the track. On the way out, you leave the studio light on.', 'Leo saves the track under its own name. As you go, you leave the little light above the desk on.', 'Лео сохраняет песню под её собственным названием. Уходя, ты оставляешь маленькую лампу над пультом включённой.', { label: 'lights', shot: 'wide' }),
    { type: 'end' },
  ],
};
