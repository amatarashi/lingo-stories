// Lines shared by every Case Files episode (wrong objection, hint, in-story recall).
export const WRONG = [
  { who: 'reyes', anim: 'no',
    text: { a1: 'No. That is not a lie. Try again.', a2: 'Hmm, that doesn\'t prove anything. Try again.', b1: 'That doesn\'t prove a thing. Read it again.' },
    ru: { a1: 'Нет. Это не ложь. Попробуй ещё.', a2: 'Хм, это ничего не доказывает. Попробуй ещё.', b1: 'Это ничего не доказывает. Перечитай.' } },
  { who: 'reyes', anim: 'fold',
    text: { a1: 'Not this one. Listen again.', a2: 'Nice try, but no. Listen again.', b1: 'Close, but no cigar. Listen again.' },
    ru: { a1: 'Не это. Послушай ещё раз.', a2: 'Хорошая попытка, но нет. Послушай ещё раз.', b1: 'Близко, но мимо. Послушай ещё раз.' } },
];
export const HINT = { who: 'reyes', anim: 'think',
  text: { a1: 'Look at the time, the rain and the camera.', a2: 'Think about the time, the rain and the camera.', b1: 'Think: the time on the receipt, the rain, the camera log.' },
  ru: { a1: 'Посмотри на время, дождь и камеру.', a2: 'Подумай о времени, дожде и камере.', b1: 'Подумай: время на чеке, дождь, журнал камеры.' } };
export const RECALL_INTRO = { who: 'jenna',
  text: { a1: 'Hey! One quick question.', a2: 'Hey, quick question before we go on!', b1: 'Hang on — quick memory check before we carry on.' },
  ru: 'Эй, быстрый вопрос, прежде чем продолжим!' };
export const RECALL_OK = { who: 'jenna',
  text: { a1: 'Yes! Good memory!', a2: 'Exactly! Good memory.', b1: 'Spot on. Nice memory.' }, ru: 'Точно! Хорошая память.' };
