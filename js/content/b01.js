// Case Files: Harbor City — Case 1 "Coffee & Lies", part 1.
// Text: {a1, a2, b1}. [word] or [surface|key] marks a tracked word or phrase (goes to the notebook).
// anim: what the speaker does (talk · fold · no · yes · hit · phone · think · point); mood: portrait accent.
export default {
  id: 'B-01',
  story: 'Case Files',
  title: 'Coffee & Lies',
  part: 'Case 1 · Part 1',
  teaser: { a1: 'Who is O. Blackwood? Find out in Part 2.', a2: 'Why was Blackwood\'s umbrella in the café? Find out in Part 2.', b1: 'What was Reyes\'s own partner doing at The Gull that night? Part 2 — tomorrow.' },
  teaserRu: 'Что делал зонт Блэквуда в кафе? Узнаем во второй части.',

  words: {
    till: { ru: 'касса (ящик для денег)', form: 'till', cloze: { text: 'The money was in the ___.', ru: 'Деньги были в кассе.' } },
    receipt: { ru: 'чек', form: 'receipt', cloze: { text: 'The ___ says 22:40.', ru: 'На чеке написано 22:40.' } },
    umbrella: { ru: 'зонт', form: 'umbrella', cloze: { text: 'It\'s raining. Take an ___!', ru: 'Идёт дождь. Возьми зонт!' } },
    wet: { ru: 'мокрый', form: 'wet', cloze: { text: 'Tom\'s apron was ___ from the rain.', ru: 'Фартук Тома был мокрым от дождя.' } },
    apron: { ru: 'фартук', form: 'apron', cloze: { text: 'Tom wears an ___ at work.', ru: 'Том носит фартук на работе.' } },
    stay: { ru: 'оставаться (stayed — остался)', form: 'stayed', cloze: { text: 'Tom didn\'t go home. He ___ late.', ru: 'Том не пошёл домой. Он остался допоздна.' } },
    'turn off': { ru: 'выключить (turned off — выключил)', form: 'turned off', cloze: { text: 'Tom ___ the camera.', ru: 'Том выключил камеру.' } },
  },

  // model: 3D character · voice: Kokoro voice for the audio lines
  chars: {
    reyes: { name: 'Inspector Reyes', color: '#e0a868', model: 'women_Suit', voice: 'bf_isabella', tint: { Hair: '#2a1a14' } },
    tom: { name: 'Tom', role: 'barista', color: '#9fd0a8', model: 'men_Casual', voice: 'am_adam' },
    jenna: { name: 'Jenna', role: 'on the phone', color: '#8ecbe8', model: 'women_Casual', voice: 'af_nova', portraitPose: 'phone' },
    narr: { name: '', color: '#888', voice: 'bm_george' },
  },

  scenes: {
    cafe: { loc: 'cafe', mood: 'night', cast: ['reyes', 'tom'] },
  },
  phoneHolder: 'reyes',

  clues: {
    till: {
      icon: '🗃️', title: 'The till',
      text: { a1: 'The [till] is open. It is empty.', a2: 'The [till] is open, and there\'s no money inside.', b1: 'The [till]\'s been left wide open — not a penny inside.' },
      ru: { a1: 'Касса открыта. Она пустая.', a2: 'Касса открыта, а денег внутри нет.', b1: 'Касса распахнута — внутри ни пенни.' },
    },
    receipt: {
      icon: '🧾', title: 'A receipt', doc: 'THE GULL CAFÉ\n1 × Latte ...... £3.50\n22:40\nServed by: TOM',
      text: { a1: 'A [receipt]. Look at the time.', a2: 'A [receipt] from last night. Check the time.', b1: 'A [receipt] from last night. Funny time for a latte, isn\'t it?' },
      ru: { a1: 'Чек. Посмотри на время.', a2: 'Чек со вчерашнего вечера. Проверь время.', b1: 'Чек со вчерашнего вечера. Странное время для латте, не так ли?' },
    },
    umbrella: {
      icon: '☂️', title: 'Umbrella',
      text: { a1: 'A big black [umbrella]. It is [wet].', a2: 'A big black [umbrella] by the door. It\'s still [wet].', b1: 'A big black [umbrella] propped by the door — still dripping [wet].' },
      ru: { a1: 'Большой чёрный зонт. Он мокрый.', a2: 'Большой чёрный зонт у двери. Он ещё мокрый.', b1: 'Большой чёрный зонт у двери — с него ещё капает.' },
    },
    apron: {
      icon: '🥼', title: 'Apron', doc: 'Name tag: TOM',
      text: { a1: 'An [apron]. The name on it is TOM. It is [wet] too.', a2: 'An [apron] with the name TOM on it. It\'s [wet] too.', b1: 'Tom\'s [apron], tossed over a chair. It\'s [wet] — as if someone popped outside in the rain.' },
      ru: { a1: 'Фартук. На нём имя ТОМ. Он тоже мокрый.', a2: 'Фартук с именем ТОМ. Он тоже мокрый.', b1: 'Фартук Тома, брошенный на стул. Мокрый — будто кто-то выскакивал под дождь.' },
    },
    camera: {
      icon: '📹', title: 'Camera log', doc: 'CAM 1 — OFF 22:30 → 23:00\nStaff key used',
      text: { a1: 'The camera was [turned off|turn off] at 22:30. Someone used a staff key.', a2: 'The camera was [turned off|turn off] from 22:30 to 23:00 — with a staff key.', b1: 'Someone [turned off|turn off] the camera between 22:30 and 23:00. Staff key, no less.' },
      ru: { a1: 'Камеру выключили в 22:30. Кто-то использовал ключ сотрудника.', a2: 'Камеру выключили с 22:30 до 23:00 — ключом сотрудника.', b1: 'Кто-то выключил камеру с 22:30 до 23:00. Да ещё и ключом сотрудника.' },
    },
  },

  beats: [
    { type: 'recall', who: 'jenna', max: 2 },

    { type: 'line', who: 'narr', shot: 'establish',
      text: { a1: 'Harbor City. Night. Rain.', a2: 'Harbor City. It\'s late, and it\'s raining again.', b1: 'Harbor City. Past midnight, and the rain hasn\'t stopped in three days.' },
      ru: { a1: 'Харбор-Сити. Ночь. Дождь.', a2: 'Харбор-Сити. Поздно, и снова идёт дождь.', b1: 'Харбор-Сити. За полночь, и дождь не прекращается уже три дня.' } },

    { type: 'line', who: 'narr', shot: 'wide',
      text: { a1: 'You are at The Gull, a small café by the sea.', a2: 'You\'re standing in The Gull, a small café near the harbor.', b1: 'You\'re dripping on the floor of The Gull, a tiny café down by the harbor.' },
      ru: { a1: 'Ты в «Чайке» — маленьком кафе у моря.', a2: 'Ты стоишь в «Чайке», маленьком кафе у гавани.', b1: 'Ты капаешь на пол «Чайки» — крошечного кафе у гавани.' } },

    { type: 'line', who: 'reyes', shot: 'reyes', anim: 'fold', mood: 'cool',
      text: { a1: 'You are late. I am Inspector Reyes.', a2: 'You\'re late. I\'m Inspector Reyes.', b1: 'You\'re late. Inspector Reyes.' },
      ru: { a1: 'Ты опоздал(а). Я инспектор Рейес.', a2: 'Ты опоздал(а). Я инспектор Рейес.', b1: 'Опаздываешь. Инспектор Рейес.' } },

    { type: 'line', who: 'reyes', shot: 'reyes', anim: 'talk',
      text: { a1: 'You are my new intern, right?', a2: 'So you\'re the new intern they sent me?', b1: 'So you\'re the intern they sent me. Don\'t make me regret this.' },
      ru: { a1: 'Ты мой новый стажёр, да?', a2: 'Значит, ты — новый стажёр, которого мне прислали?', b1: 'Значит, это тебя мне прислали в стажёры. Не заставь меня пожалеть.' } },

    { type: 'choice', prompt: { a1: 'What do you say?', a2: 'What do you say?', b1: 'Your move.' }, options: [
      { text: { a1: 'Sorry! The bus was late.', a2: 'Sorry, the bus was late.', b1: 'Sorry — the bus had other plans.' }, ru: 'Извините, автобус опоздал.', goto: 'c1-sorry' },
      { text: { a1: 'Yes. I am ready to work.', a2: 'Yes. I\'m ready to start.', b1: 'Yes. And I\'m ready when you are.' }, ru: 'Да. Я готов(а) работать.', goto: 'c1-ready' },
    ] },
    { label: 'c1-sorry', type: 'line', who: 'reyes', shot: 'reyes', anim: 'no', mood: 'cool',
      text: { a1: 'Criminals do not wait for buses.', a2: 'Criminals don\'t wait for buses, kid.', b1: 'Criminals don\'t care about bus timetables, kid.' },
      ru: { a1: 'Преступники не ждут автобусов.', a2: 'Преступники не ждут автобусов, малыш(ка).', b1: 'Преступникам плевать на расписание автобусов, малыш(ка).' }, goto: 'case' },
    { label: 'c1-ready', type: 'line', who: 'reyes', shot: 'reyes', anim: 'yes', mood: 'smile',
      text: { a1: 'Good. I like that.', a2: 'Good. I like that answer.', b1: 'Good answer. Let\'s see if you mean it.' },
      ru: { a1: 'Хорошо. Мне нравится.', a2: 'Хорошо. Мне нравится такой ответ.', b1: 'Хороший ответ. Посмотрим, всерьёз ли.' } },

    { label: 'case', type: 'line', who: 'reyes', shot: 'counter', anim: 'point',
      text: { a1: 'Look. Money is gone from the [till].', a2: 'Here\'s the case. Last night someone took the money from the [till].', b1: 'Here\'s the deal. Last night somebody helped themselves to the cash in the [till].' },
      ru: { a1: 'Смотри. Из кассы пропали деньги.', a2: 'Вот дело. Вчера вечером кто-то забрал деньги из кассы.', b1: 'Расклад такой. Вчера вечером кто-то угостился наличными из кассы.' } },

    { type: 'line', who: 'reyes', shot: 'reyes', anim: 'phone', sfx: 'ring',
      text: { a1: 'Wait. My phone.', a2: 'Hold on, that\'s my phone.', b1: 'Hang on — that\'ll be Jenna.' },
      ru: { a1: 'Подожди. Мой телефон.', a2: 'Подожди, это мой телефон.', b1: 'Секунду — это, наверное, Дженна.' } },

    { type: 'line', who: 'jenna', shot: 'reyes', mood: 'smile',
      text: { a1: 'Hi! It is Jenna from the office. I have the facts.', a2: 'Hey, it\'s Jenna! I\'ve got the facts for you.', b1: 'Hey hey, Jenna here! Got the facts, hot off the press.' },
      ru: { a1: 'Привет! Это Дженна из офиса. У меня есть факты.', a2: 'Привет, это Дженна! У меня для вас факты.', b1: 'Хэй, это Дженна! Факты, прямо с пылу с жару.' } },

    { type: 'line', who: 'jenna', shot: 'reyes',
      text: { a1: 'The café closed at ten. In the morning, the money was gone. Three hundred pounds!', a2: 'The café closed at ten. In the morning, three hundred pounds were gone.', b1: 'They shut at ten. By morning — poof — three hundred quid, gone. Classic.' },
      ru: { a1: 'Кафе закрылось в десять. Утром денег не было. Триста фунтов!', a2: 'Кафе закрылось в десять. Утром трёхсот фунтов уже не было.', b1: 'Закрылись в десять. К утру — пуф — трёхсот фунтов нет. Классика.' } },

    { type: 'line', who: 'reyes', shot: 'wide', anim: 'talk',
      text: { a1: 'Thanks, Jenna. OK, intern. Look around. Find clues.', a2: 'Thanks, Jenna. Right, intern — look around and find me some clues.', b1: 'Cheers, Jenna. Right, intern — have a look around. Find me something I can use.' },
      ru: { a1: 'Спасибо, Дженна. Так, стажёр. Осмотрись. Найди улики.', a2: 'Спасибо, Дженна. Так, стажёр — осмотрись и найди мне улики.', b1: 'Спасибо, Дженна. Так, стажёр — осмотрись. Найди мне что-нибудь полезное.' } },

    { type: 'explore', clues: ['till', 'receipt', 'umbrella', 'camera', 'apron'], need: ['receipt', 'apron', 'camera'],
      hint: { a1: 'Find three clues. Tap the ? marks.', a2: 'Tap the ? marks to examine things. You need three clues.', b1: 'Tap anything that looks suspicious. Three solid clues should do it.' },
      hintRu: 'Нажимай на «?», чтобы осмотреть предметы. Нужно три улики.' },

    { type: 'line', who: 'reyes', shot: 'reyes', anim: 'yes', mood: 'smile',
      text: { a1: 'Not bad! Now we talk to Tom. He works here.', a2: 'Not bad at all. Now let\'s talk to Tom, the barista.', b1: 'Not bad, intern. Now — time for a little chat with Tom, our barista.' },
      ru: { a1: 'Неплохо! Теперь говорим с Томом. Он здесь работает.', a2: 'Совсем неплохо. Теперь поговорим с Томом, бариста.', b1: 'Неплохо, стажёр. А теперь — небольшой разговор с Томом, нашим бариста.' } },

    { type: 'line', who: 'tom', shot: 'tom', anim: 'no', mood: 'nervous',
      text: { a1: 'Me? Again? I told the police everything!', a2: 'M-me? Again? I already told the police everything!', b1: 'M-me? Again? Look, I\'ve already told the police everything I know!' },
      ru: { a1: 'Я? Опять? Я всё рассказал полиции!', a2: 'Я-я? Опять? Я уже всё рассказал полиции!', b1: 'Я-я? Опять? Слушайте, я уже рассказал полиции всё, что знаю!' } },

    { type: 'choice', prompt: { a1: 'How do you talk to Tom?', a2: 'How do you talk to Tom?', b1: 'Good cop or bad cop?' }, options: [
      { text: { a1: 'Relax, Tom. We just want to talk.', a2: 'Relax, Tom. We just want to talk.', b1: 'Easy, Tom. Nobody\'s accusing you of anything.' }, ru: 'Расслабься, Том. Мы просто поговорим.', goto: 'c2-good' },
      { text: { a1: 'Sit down, Tom. Now.', a2: 'Sit down, Tom. And tell the truth.', b1: 'Sit. Down. And this time, try the truth.' }, ru: 'Сядь, Том. И говори правду.', goto: 'c2-bad' },
    ] },
    { label: 'c2-good', type: 'line', who: 'tom', shot: 'tom', anim: 'yes', mood: 'nervous',
      text: { a1: 'OK... Thank you. Ask me.', a2: 'OK... thanks. What do you want to know?', b1: 'Right... thanks. Fire away, I guess.' },
      ru: { a1: 'Ладно… Спасибо. Спрашивайте.', a2: 'Ладно… спасибо. Что вы хотите знать?', b1: 'Ладно… спасибо. Спрашивайте, что ли.' }, goto: 'brief' },
    { label: 'c2-bad', type: 'line', who: 'tom', shot: 'tom', anim: 'hit', mood: 'nervous',
      text: { a1: 'OK, OK! Do not shout!', a2: 'OK, OK! You don\'t have to shout!', b1: 'Alright, alright! No need to shout!' },
      ru: { a1: 'Ладно, ладно! Не кричите!', a2: 'Ладно, ладно! Не надо кричать!', b1: 'Ладно, ладно! Не надо орать!' } },

    { label: 'brief', type: 'line', who: 'reyes', shot: 'over-tom', anim: 'talk',
      text: { a1: 'Listen to Tom. If he lies, press OBJECTION and show a clue!', a2: 'Listen carefully. If Tom lies, press OBJECTION and show a clue.', b1: 'Listen closely. The second he lies, hit OBJECTION and show him the evidence.' },
      ru: { a1: 'Слушай Тома. Если он врёт — нажми OBJECTION и покажи улику!', a2: 'Слушай внимательно. Если Том врёт — жми OBJECTION и покажи улику.', b1: 'Слушай внимательно. Как только соврёт — жми OBJECTION и предъяви улику.' } },

    { type: 'interrogate', who: 'tom', shot: 'tom', rounds: [
      { statements: [
        { text: { a1: 'I work here every evening.', a2: 'I work here every evening, from six to ten.', b1: 'I\'ve worked evenings here for two years. Six till ten.' },
          ru: { a1: 'Я работаю здесь каждый вечер.', a2: 'Я работаю здесь каждый вечер, с шести до десяти.', b1: 'Я два года работаю здесь по вечерам. С шести до десяти.' } },
        { lie: 'receipt',
          text: { a1: 'I closed the café at ten. Then I went home.', a2: 'I closed the café at ten and went straight home.', b1: 'I locked up at ten on the dot and went straight home.' },
          ru: { a1: 'Я закрыл кафе в десять. Потом пошёл домой.', a2: 'Я закрыл кафе в десять и сразу пошёл домой.', b1: 'Я запер кафе ровно в десять и сразу пошёл домой.' },
          after: [
            { who: 'reyes', anim: 'point', text: { a1: 'The receipt says 22:40. And "Served by: Tom".', a2: 'Then why does this receipt say 22:40, "Served by: Tom"?', b1: 'Funny. This receipt says 22:40 — "Served by: Tom".' },
              ru: { a1: 'На чеке 22:40. И «Обслуживал: Том».', a2: 'Тогда почему на чеке 22:40, «Обслуживал: Том»?', b1: 'Забавно. На этом чеке 22:40 — «Обслуживал: Том».' } },
            { who: 'tom', anim: 'no', mood: 'nervous', text: { a1: 'OK, OK! I [stayed|stay]. A man came in. He wanted a latte.', a2: 'OK, fine! I [stayed|stay] late. A man came in and ordered a latte.', b1: 'Alright, alright! I [stayed|stay] behind. Some guy turned up wanting a latte.' },
              ru: { a1: 'Ладно, ладно! Я остался. Зашёл мужчина. Он хотел латте.', a2: 'Ладно! Я остался допоздна. Зашёл мужчина и заказал латте.', b1: 'Ладно, ладно! Я задержался. Заявился какой-то тип, хотел латте.' } },
          ] },
      ] },
      { statements: [
        { text: { a1: 'The man had a big black umbrella.', a2: 'He had a big black umbrella and a grey coat.', b1: 'Tall guy, grey coat, huge black umbrella.' },
          ru: { a1: 'У мужчины был большой чёрный зонт.', a2: 'У него был большой чёрный зонт и серое пальто.', b1: 'Высокий, серое пальто, огромный чёрный зонт.' } },
        { lie: 'apron',
          text: { a1: 'I did not go out. I was inside all night.', a2: 'I didn\'t go outside. I stayed inside the whole time.', b1: 'I never set foot outside. Not once.' },
          ru: { a1: 'Я не выходил. Я был внутри всю ночь.', a2: 'Я не выходил на улицу. Всё время был внутри.', b1: 'Я ни разу не выходил на улицу. Ни разу.' },
          after: [
            { who: 'reyes', anim: 'fold', text: { a1: 'Your apron is wet, Tom. Why?', a2: 'Then why is your apron wet, Tom?', b1: 'Then how did your apron end up soaking wet, Tom?' },
              ru: { a1: 'Твой фартук мокрый, Том. Почему?', a2: 'Тогда почему твой фартук мокрый, Том?', b1: 'Тогда как твой фартук оказался насквозь мокрым, Том?' } },
            { who: 'tom', anim: 'talk', mood: 'nervous', text: { a1: 'Yes... I went out with him. It was raining.', a2: 'OK... I walked him to his car. It was raining.', b1: 'Fine... I walked him out to his car. It was pouring.' },
              ru: { a1: 'Да… Я вышел с ним. Шёл дождь.', a2: 'Ладно… Я проводил его до машины. Шёл дождь.', b1: 'Ладно… Я проводил его до машины. Лило как из ведра.' } },
          ] },
        { lie: 'camera',
          text: { a1: 'I don\'t know about the camera.', a2: 'I don\'t know anything about the camera.', b1: 'The camera? No idea, honestly.' },
          ru: { a1: 'Я не знаю про камеру.', a2: 'Я ничего не знаю про камеру.', b1: 'Камера? Понятия не имею, честно.' },
          after: [
            { who: 'reyes', anim: 'point', text: { a1: 'Someone used a staff key. You have a staff key.', a2: 'The camera was turned off with a staff key. Your key, Tom.', b1: 'Someone killed the camera with a staff key. Yours, I\'d bet.' },
              ru: { a1: 'Кто-то использовал ключ сотрудника. У тебя есть ключ.', a2: 'Камеру выключили ключом сотрудника. Твоим ключом, Том.', b1: 'Кто-то вырубил камеру ключом сотрудника. Твоим, держу пари.' } },
            { who: 'tom', anim: 'hit', mood: 'nervous', text: { a1: 'He gave me fifty pounds. I [turned off|turn off] the camera. But I did not take the money!', a2: 'He gave me fifty pounds to [turn off] the camera. But I didn\'t take the money, I promise!', b1: 'He slipped me fifty quid to [turn off] the camera. But I swear I never touched the till!' },
              ru: { a1: 'Он дал мне пятьдесят фунтов. Я выключил камеру. Но я не брал деньги!', a2: 'Он дал мне пятьдесят фунтов, чтобы я выключил камеру. Но деньги я не брал, клянусь!', b1: 'Он сунул мне полтинник, чтобы я вырубил камеру. Но кассу я не трогал, клянусь!' } },
          ] },
      ] },
    ] },

    { type: 'recall', who: 'jenna', max: 1 },

    { type: 'line', who: 'reyes', shot: 'reyes', anim: 'think',
      text: { a1: 'So. Who took the money? What do you think?', a2: 'So, intern. Who took the money?', b1: 'So, intern — who\'s got the cash?' },
      ru: { a1: 'Итак. Кто взял деньги? Как думаешь?', a2: 'Итак, стажёр. Кто взял деньги?', b1: 'Итак, стажёр — у кого деньги?' } },

    { type: 'choice', prompt: { a1: 'Who took the money?', a2: 'Who took the money?', b1: 'Make the call.' }, options: [
      { text: { a1: 'Tom.', a2: 'It was Tom.', b1: 'Tom did it.' }, ru: 'Это Том.', goto: 'r-tom' },
      { text: { a1: 'The man with the umbrella.', a2: 'The man with the umbrella.', b1: 'Mr. Umbrella, obviously.' }, ru: 'Мужчина с зонтом.', goto: 'r-man' },
      { text: { a1: 'We don\'t know yet.', a2: 'We don\'t know yet.', b1: 'Too early to tell.' }, ru: 'Мы пока не знаем.', goto: 'r-unknown' },
    ] },

    { label: 'r-tom', type: 'line', who: 'reyes', shot: 'reyes', anim: 'no',
      text: { a1: 'Maybe. But look at him. Tom is scared, not rich.', a2: 'Maybe. But look at him — Tom looks scared, not rich.', b1: 'Could be. But look at him. That\'s a terrified kid, not a rich one.' },
      ru: { a1: 'Может быть. Но посмотри на него. Том напуган, а не богат.', a2: 'Может быть. Но посмотри на него — Том выглядит напуганным, а не богатым.', b1: 'Возможно. Но посмотри на него. Это перепуганный парень, а не разбогатевший.' }, goto: 'cliff' },
    { label: 'r-man', type: 'line', who: 'reyes', shot: 'reyes', anim: 'think',
      text: { a1: 'Maybe. But we do not know his name.', a2: 'Maybe. But we don\'t even know his name.', b1: 'Maybe. But we don\'t even have a name.' },
      ru: { a1: 'Может быть. Но мы не знаем его имя.', a2: 'Может быть. Но мы даже не знаем его имени.', b1: 'Может быть. Но у нас нет даже имени.' }, goto: 'cliff' },
    { label: 'r-unknown', type: 'line', who: 'reyes', shot: 'reyes', anim: 'yes', mood: 'smile',
      text: { a1: 'Good. A detective does not guess.', a2: 'Good answer. A detective doesn\'t guess.', b1: 'Good. Detectives don\'t guess — they prove.' },
      ru: { a1: 'Хорошо. Детектив не гадает.', a2: 'Хороший ответ. Детектив не гадает.', b1: 'Хорошо. Детективы не гадают — они доказывают.' } },

    { label: 'cliff', type: 'line', who: 'jenna', shot: 'umbrella', sfx: 'ring', mood: 'shock',
      text: { a1: 'Boss! The umbrella! There is a name on it!', a2: 'Boss, wait! I looked at your photo of the umbrella. There\'s a name on it!', b1: 'Boss, hold on — I zoomed in on your umbrella photo. There\'s a name engraved on the handle!' },
      ru: { a1: 'Шеф! Зонт! На нём имя!', a2: 'Шеф, подожди! Я посмотрела твоё фото зонта. На нём имя!', b1: 'Шеф, стой — я увеличила фото зонта. На ручке выгравировано имя!' } },
    { type: 'line', who: 'reyes', shot: 'reyes', anim: 'phone',
      text: { a1: 'What name?', a2: 'Whose name?', b1: 'Whose?' },
      ru: { a1: 'Какое имя?', a2: 'Чьё имя?', b1: 'Чьё?' } },
    { type: 'line', who: 'jenna', shot: 'umbrella-close', mood: 'shock',
      text: { a1: 'O. Blackwood.', a2: 'O. Blackwood.', b1: 'O. Blackwood.' }, ru: 'О. Блэквуд.' },
    { type: 'line', who: 'narr', shot: 'reyes-close',
      text: { a1: 'Reyes is quiet. Oscar Blackwood is her partner.', a2: 'Reyes goes quiet. Oscar Blackwood is her business partner.', b1: 'Reyes falls silent. Oscar Blackwood — her own business partner.' },
      ru: { a1: 'Рейес молчит. Оскар Блэквуд — её партнёр.', a2: 'Рейес замолкает. Оскар Блэквуд — её деловой партнёр.', b1: 'Рейес замолкает. Оскар Блэквуд — её собственный деловой партнёр.' } },

    { type: 'end' },
  ],
};
