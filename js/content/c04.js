import previous from './c03.js';
import { line, choice, option, word } from './episode.js';

export default {
  id: 'C-04', story: previous.story, title: 'The Friday Signature', part: 'Chapter 4', icon: '📖',
  chars: { ...previous.chars, sam: { name: 'Sam', model: 'men_Casual2', voice: 'bm_fable', color: '#c8d5a9' } },
  rel: previous.rel,
  scenes: {
    puffin: previous.scenes.puffin,
    lighthouse: { loc: 'lighthouse', mood: 'reunion', cast: ['sam', 'kai', 'duncan'] },
    privateMeeting: { loc: 'lighthouse', mood: 'private-reunion', cast: ['sam', 'duncan'] },
  },
  endTitle: 'Room for one more',
  teaser: 'Back at the café, Fiona puts out another cup.',
  teaserRu: 'В кафе Фиона ставит на стол ещё одну чашку.',
  words: {
    envelope: previous.words.envelope, keeper: previous.words.keeper,
    repair: word('repair', 'чинить; ремонт', 'They can ___ the boat.', 'Они могут починить лодку.'),
    stayovernight: word('stay', 'остаться', 'You can ___ another night.', 'Можешь остаться ещё на ночь.'),
  },
  clues: {},
  beats: [
    { type: 'scene', to: 'puffin', shot: 'establish', caption: 'The Puffin · Saturday afternoon' },
    { type: 'branch', flag: 'sharedFerryNote', goto: 'shared' },
    line('fiona', 'Show me the note.', 'Can I see the note? I know why that date was crossed out.', 'Let me see the note. I think I owe you an explanation about that date.', 'Покажи записку. Я знаю, почему зачеркнули дату.', { shot: 'fiona', goto: 'date' }),
    line('kai', 'Fiona, we read Sam’s note together.', 'Fiona, we opened Sam’s [envelope] together. Can you tell us about the date?', 'Fiona, we read the note together. Sam wanted someone to ask who changed the ferry date.', 'Фиона, мы вместе прочитали записку. Сэм хотел, чтобы кто-то спросил, кто изменил дату.', { label: 'shared', shot: 'kai' }),
    line('fiona', 'I changed it. I got the day wrong.', 'I crossed it out. I wrote down the wrong day for the ferry.', 'It was me. I’d put the wrong date in the book. Sam told Duncan he was staying anyway, so I crossed the entry out.', 'Это я. Записала в книгу неверную дату парома. Сэм сказал Дункану, что всё равно остаётся, и я зачеркнула запись.', { label: 'date', shot: 'fiona' }),
    line('fiona', 'Duncan says Sam is at the tower.', 'Duncan says Sam came back last night. He’s at the tower until six.', 'Duncan called this morning. Sam signed the book himself last night, and he’ll be at the tower until six.', 'Дункан позвонил утром. Сэм сам расписался вчера вечером и будет у маяка до шести.', { shot: 'fiona' }),
    choice('Do you ask Kai to come?', option('Come with me, Kai.', 'Пойдём со мной, Кай.', { goto: 'together', rel: { kai: 1 } }),
      option('I’ll go first. Wait for me here.', 'Я сначала схожу сам. Подожди меня здесь.', { goto: 'alone', rel: { fiona: 1 } })),
    line('kai', 'All right. I’ll let you ask first.', 'I’ll come. You can ask the first question.', 'I’ll come with you. I’ve got questions too, but you can ask yours first.', 'Я пойду с тобой. У меня тоже есть вопросы, но сначала спросишь ты.', { label: 'together', shot: 'kai' }),
    { type: 'scene', to: 'lighthouse', shot: 'tower', caption: 'Kinloch lighthouse · Before six', goto: 'meeting' },
    line('kai', 'I’ll wait here.', 'All right. I’ll wait at the café.', 'All right. Come and tell me about it when you’re ready.', 'Хорошо. Я подожду в кафе. Расскажешь, когда будешь готов.', { label: 'alone', shot: 'kai' }),
    { type: 'scene', to: 'privateMeeting', shot: 'tower', caption: 'Kinloch lighthouse · Before six' },
    line('sam', 'Yes. I signed the book last night.', 'Yes. That’s my name on the last page. Duncan left a light on for me.', 'It’s my handwriting. Duncan left his little lamp in the window so I could find the steps in the dark.', 'Это мой почерк. Дункан оставил лампу в окне, чтобы я нашёл ступеньки в темноте.', { label: 'meeting', shot: 'sam' }),
    line('sam', 'I stayed to help Duncan.', 'I missed the ferry to help Duncan [repair] his boat. His hands were shaking.', 'I let the ferry go. Duncan couldn’t hold a spanner that week, so I stayed to [repair] his boat and took the next sailing.', 'Я специально пропустил паром. У Дункана тогда дрожали руки, и я остался, чтобы починить его лодку. Уехал следующим рейсом.', { shot: 'sam' }),
    line('sam', 'I could have written a better note.', 'I asked about the date because I thought Fiona had booked another ticket for me. That note made it sound worse, didn’t it?', 'I thought Fiona had changed the booking for me, and I wanted to thank her. I should have left a less mysterious note.', 'Я думал, Фиона поменяла мне билет, и хотел её поблагодарить. Пожалуй, записку стоило написать яснее.', { shot: 'sam' }),
    line('duncan', 'Tea at the café?', 'Fiona said there’s tea at the café, if you can [stay|stayovernight].', 'Fiona said to come down for tea. The last ferry can wait until tomorrow, if you want to [stay|stayovernight].', 'Фиона зовёт на чай. Если хочешь остаться, уедешь завтра.', { shot: 'duncan' }),
    { type: 'scene', to: 'puffin', shot: 'fiona', caption: 'The Puffin · Evening' },
    line('fiona', 'I made enough for everyone.', 'Sit down. I made enough tea for everyone.', 'Pull up a chair. I put an extra cup out before I knew whether he’d come.', 'Пододвинь стул. Я поставила лишнюю чашку ещё до того, как узнала, придёт ли он.', { shot: 'fiona' }),
    { type: 'end' },
  ],
};
