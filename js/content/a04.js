import previous from './a03.js';
import { levels, line, choice, option, word } from './episode.js';

const route = 'Follow the blue poles along the ridge. Turn at the white bird. Use the north door.';
const routeRu = 'Идите вдоль гребня по синим вешкам. Поверните у белой птицы. Войдите через северную дверь.';

export default {
  id: 'A-04', story: previous.story, title: 'Three Knocks', part: 'Episode 4', icon: '📻',
  chars: { ...previous.chars, crew: { name: 'Field crew', role: 'North shelter', voice: 'bm_fable+radio', via: 'radio', color: '#b9daff' } },
  scenes: previous.scenes, initialSceneState: { warmedRoom: true },
  endTitle: 'The crew is coming home',
  teaser: 'For the first time since you woke up, someone knocks on the right door.',
  teaserRu: 'Впервые с тех пор, как ты очнулся, кто-то стучит в нужную дверь.',
  words: {
    ridge: previous.words.ridge, shelter: previous.words.shelter,
    echo: word('echo', 'эхо', 'The ___ repeats your voice.', 'Эхо повторяет твой голос.'),
    poles: word('poles', 'вешки, столбы', 'Follow the blue ___.', 'Идите по синим вешкам.'),
  },
  clues: {},
  beats: [
    { type: 'scene', to: 'radio', shot: 'room2', caption: 'Aurora-7 · 08:26' },
    line('narr', 'The south gate plays your voice again.', 'The south gate repeats your last call, word for word.', 'The same words come back from the south gate. Even the pause before the last word is yours.', 'Южные ворота снова повторяют твой вызов. Даже пауза перед последним словом точно такая же.'),
    line('aria', 'Test the gate speaker. Say one new word.', 'The gate speaker has a test mode. Give it a word you haven’t said before.', 'The emergency speaker has an audio test. Say something new and listen for the return.', 'У аварийного переговорного устройства есть режим проверки. Скажи новое слово и послушай ответ.', { shot: 'screen' }),
    choice('What do you say into the radio?', option('Snow.', 'Снег.', { goto: 'snow' }), option('Bird.', 'Птица.', { goto: 'bird' })),
    line('narr', '“Snow,” says the gate.', 'A second later the gate says “snow” in your voice.', 'A second later “snow” comes back in your voice, as clearly as you said it.', 'Через секунду ворота повторяют «снег» твоим голосом.', { label: 'snow', goto: 'echo', shot: 'radio-close' }),
    line('narr', '“Bird,” says the gate.', 'A second later the gate says “bird” in your voice.', 'A second later “bird” comes back in your voice, as clearly as you said it.', 'Через секунду ворота повторяют «птица» твоим голосом.', { label: 'bird', shot: 'radio-close' }),
    line('eli', 'That’s an [echo]. The three knocks were different.', 'The gate copies us. It’s an [echo]. Those three knocks from the north were different.', 'The gate repeats whatever we say. Those three knocks from the north came before you said anything.', 'Ворота повторяют за нами. А три удара с севера прозвучали ещё до того, как ты что-либо сказал.', { label: 'echo' }),
    { type: 'task', who: 'maya', shot: 'console', targets: ['green', 'red'], wrong: { text: 'Use the green button to open the radio.', ru: 'Чтобы выйти на связь, нажми зелёную кнопку.' },
      steps: [{ do: 'green', text: 'Press the green button. Ask the crew for two knocks.', ru: 'Нажми зелёную кнопку. Попроси команду постучать дважды.' }] },
    { type: 'fx', fx: 'knocks' },
    line('crew', 'Two knocks. We hear you.', 'Two knocks, as asked. The field crew is at the north [shelter].', 'Two knocks, as requested. We’re all at the north [shelter], but we can barely see the trail.', 'Два удара, как просили. Вся команда в северном укрытии, но тропу почти не видно.', { shot: 'radio-close' }),
    line('maya', 'Use the blue [poles]. The white bird marks the turn.', 'The blue [poles] mark the safe trail. Turn at the white bird and use the north door.', 'Guide them along the blue [poles] on the [ridge]. The white bird marks the turn for the north door.', routeRu, { shot: 'radio' }),
    { type: 'decode', mode: 'word', who: 'maya', shot: 'radio', text: 'Follow the {blue} poles.', ru: 'Идите по синим вешкам.', options: ['blue', 'red', 'green'] },
    line('narr', route, route, route, routeRu, { shot: 'radio-close' }),
    line('crew', 'We see the bird. We’re at the north door.', 'We see the white bird. All six of us are at the north door.', 'We’ve passed the white bird. All six are here at the north door. Whoever’s on the radio, thank you.', 'Вижу белую птицу. Мы все шестеро у северной двери. Спасибо, что вышли на связь.'),
    line('eli', 'I’ll open it. Put the kettle on.', 'I’ll get the door. Can you put the kettle on?', 'I’ll let them in. Six more mugs, if you can find them.', 'Я открою. Найди ещё шесть кружек, если они у нас есть.', { shot: 'room2' }),
    { type: 'end' },
  ],
};
