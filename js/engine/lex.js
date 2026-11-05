// Tap-to-translate dictionary: base forms + a tiny lemmatizer. Tracked words come from episodes.
const G = {
  // ---- case 1, part 2
  according: 'согласно (according to — судя по)', afford: 'позволить себе (по деньгам)', always: 'всегда', another: 'другой, ещё один', anymore: 'больше (не)',
  available: 'доступен, свободен', back: 'назад, обратно', bake: 'печь (хлеб)', baker: 'пекарь', belong: 'принадлежать', better: 'лучше', bingo: 'в точку! (бинго)',
  blame: 'винить, свалить вину', boarding: 'посадка (boarding pass — посадочный талон)', bone: 'кость (bone dry — совсем сухой)', book: 'книга (by the book — по правилам)',
  bother: 'утруждать себя, беспокоиться', bread: 'хлеб', broken: 'сломанный', calendar: 'календарь', caller: 'звонящий (caller ID — номер звонящего)', cam: 'камера (сокр.)',
  card: 'карта, карточка', carry: 'нести (carry on — продолжать)', chance: 'шанс', cigar: 'сигара (close, but no cigar — почти, но мимо)', code: 'код', coffee: 'кофе',
  course: 'курс (of course — конечно)', crime: 'преступление', d: 'D (буква кода)', daisy: 'Дейзи (имя)', dana: 'Дана (имя)', date: 'дата; датировать',
  dead: 'мёртвый (the line goes dead — связь обрывается)', desk: 'письменный стол', die: 'умирать; сломаться (о технике, разг.)', dock: 'причал, док',
  drill: 'тренировка (you know the drill — ты знаешь, что делать)', drop: 'капля', drive: 'ехать на машине, водить', dry: 'сухой', due: 'к сроку (due Friday — срок в пятницу)',
  earth: 'земля (where on earth — где же, куда)', everybody: 'все', everyone: 'все', everywhere: 'везде', face: 'лицо', famous: 'знаменитый', few: 'несколько (a few — несколько)',
  final: 'последний, окончательный', first: 'первый; сначала', five: 'пять', fix: 'чинить', flat: 'квартира', flight: 'рейс, полёт', flour: 'мука', footage: 'видеозапись',
  friday: 'пятница', friend: 'друг', get: 'получать; становиться (get wet — промокнуть)', grab: 'схватить, взять', hand: 'рука, кисть (get my hands on — раздобыть)',
  handwriting: 'почерк', happen: 'случаться', hear: 'слышать', heart: 'сердце (soft heart — мягкое сердце)', hello: 'привет, здравствуйте', hmm: 'хм',
  hood: 'капюшон', hook: 'крючок (off the hook — вне подозрений)', house: 'дом (on the house — за счёт заведения)', hurt: 'навредить, сделать больно',
  id: 'ID, номер (caller ID — номер звонящего)', itself: 'сам(о) себя', job: 'работа', keep: 'сохранять, оставлять себе', letter: 'письмо; буква',
  line: 'линия; связь (по телефону)', lisbon: 'Лиссабон', log: 'журнал записей', lose: 'терять', lot: 'много (a lot — много)', love: 'любить', loyalty: 'верность (loyalty card — карта постоянного гостя)',
  memory: 'память', message: 'сообщение', missing: 'пропавший (go missing — пропасть)', mole: 'крот; шпион, «крот»', monday: 'понедельник', month: 'месяц',
  more: 'больше, ещё', much: 'много (so much for — вот тебе и)', next: 'следующий', nine: 'девять', notice: 'уведомление; замечать (final notice — последнее предупреждение)',
  number: 'номер, число', odd: 'странный', official: 'официальный', oh: 'о!, ах', otherwise: 'иначе, другое', ouch: 'ой!', pay: 'платить', pass: 'пропуск, талон',
  pick: 'выбирать (pick up — взять трубку)', place: 'место', plane: 'самолёт', please: 'пожалуйста', problem: 'проблема', proof: 'доказательство', question: 'вопрос',
  read: 'читать', really: 'правда, действительно', regular: 'постоянный (гость); обычный', rent: 'плата за жильё, аренда', report: 'отчёт', return: 'возвращать',
  rule: 'правило', safe: 'безопасный', scrawl: 'каракули', search: 'обыскивать, искать', side: 'сторона (her side — её версия)', since: 'с (какого-то времени)',
  single: 'единственный (every single — каждый)', sleeve: 'рукав', soft: 'мягкий', soon: 'скоро', spot: 'пятно (spot on — в точку)', stamp: 'штамп, отметка',
  steal: 'красть', stranger: 'незнакомец', t: 'Т. (инициал)', table: 'стол', terrible: 'ужасный', thief: 'вор', through: 'через (go through — перебрать, осмотреть)',
  thursday: 'четверг', ticket: 'билет', town: 'город, городок', trouble: 'неприятности (in trouble — в беде)', true: 'правда, верно', trust: 'доверять',
  typical: 'типично', understand: 'понимать', vanish: 'исчезать', video: 'видео', voicemail: 'автоответчик, голосовая почта', while: 'пока, в то время как',
  write: 'писать', wrong: 'неправильный (something wrong — что-то не так)', yellow: 'жёлтый', know: 'знать', swear: 'клясться',
  a: 'неопределённый артикль', an: 'неопределённый артикль', the: 'определённый артикль',
  reyes: 'Рейес (имя)', jenna: 'Дженна (имя)', tom: 'Том (имя)', oscar: 'Оскар (имя)', blackwood: 'Блэквуд (фамилия)', o: 'О. (инициал)',
  some: 'какой-то; немного', bad: 'плохой', stay: 'оставаться', off: 'выключено; прочь', could: 'мог бы', hold: 'держать (hold on — подожди)',
  between: 'между', wear: 'носить (одежду)', s: '(часть сокращения)',
  past: 'после (past midnight — за полночь); прошлый', midnight: 'полночь', stop: 'останавливаться', day: 'день', stand: 'стоять', floor: 'пол',
  tiny: 'крошечный', send: 'посылать', move: 'ход; двигаться', sorry: 'извини(те)', bus: 'автобус', other: 'другой', plan: 'план',
  criminal: 'преступник', kid: 'ребёнок; малыш (обращение)', care: 'заботиться (don’t care — всё равно)', timetable: 'расписание', like: 'нравиться; как',
  see: 'видеть', deal: 'сделка; расклад (here’s the deal — расклад такой)', phone: 'телефон', hang: 'висеть (hang on — подожди)', hot: 'горячий',
  hundred: 'сто', poof: 'пуф! (исчезло)', thanks: 'спасибо', thank: 'благодарить (thank you — спасибо)', cheers: 'спасибо (разг.); будем!', mark: 'знак, метка',
  need: 'нуждаться, нужно', solid: 'надёжный, твёрдый', police: 'полиция', m: '(заикание)', already: 'уже', cop: 'полицейский (good cop — добрый коп)',
  relax: 'расслабиться', easy: 'лёгкий; спокойно!', nobody: 'никто', accuse: 'обвинять', sit: 'сидеть (sit down — сядь)', truth: 'правда',
  ask: 'спрашивать', fire: 'огонь; стрелять (fire away — спрашивай)', away: 'прочь', shout: 'кричать', second: 'секунда; второй', call: 'звонок; решение (make the call — реши)',
  one: 'один',
  i: 'я', you: 'ты, вы', he: 'он', she: 'она', it: 'оно, это', we: 'мы', they: 'они', me: 'меня, мне', him: 'его, ему', her: 'её, ей',
  us: 'нас', them: 'их', my: 'мой', your: 'твой, ваш', his: 'его', its: 'его (о предмете)', our: 'наш', their: 'их',
  yours: 'твой, ваш (без сущ.)', themselves: 'себя (они сами)', someone: 'кто-то', somebody: 'кто-то', something: 'что-то', anything: 'что-нибудь, ничего (в отриц.)',
  anyone: 'кто-нибудь', nothing: 'ничего', everything: 'всё', this: 'этот, это', that: 'тот, что', these: 'эти', those: 'те',
  who: 'кто', what: 'что', why: 'почему', how: 'как', where: 'где', when: 'когда', whose: 'чей', which: 'который',
  be: 'быть', am: 'есть (я)', is: 'есть (он/она/оно)', are: 'есть (мы/вы/они)', was: 'был, была', were: 'были', been: 'был (Present Perfect)',
  have: 'иметь', has: 'имеет', had: 'имел; (вспом. глагол)', do: 'делать', does: 'делает', did: 'сделал; (вспом. в прошлом)', done: 'сделано',
  can: 'мочь', will: 'буду (будущее)', would: 'бы', should: 'следует', must: 'должен', might: 'может быть',
  not: 'не', no: 'нет, никакой', yes: 'да', ok: 'ладно, ок', okay: 'ладно', fine: 'ладно; хорошо', alright: 'ладно, хорошо',
  and: 'и', but: 'но', or: 'или', so: 'итак; так', then: 'потом; тогда', if: 'если', because: 'потому что', as: 'как; когда',
  in: 'в', on: 'на', at: 'в, у (время/место)', to: 'к; в; чтобы', from: 'из, от', with: 'с', by: 'у, возле; кем (by Tom — Томом)', for: 'для; в течение',
  of: 'из (родительный падеж)', about: 'о, про', near: 'рядом, около', inside: 'внутри', outside: 'снаружи, на улицу', out: 'наружу', up: 'вверх', down: 'вниз',
  over: 'над; на (бросить на)', till: 'до (six till ten); касса', under: 'под', behind: 'позади; (stay behind — задержаться)', before: 'до, перед', after: 'после',
  here: 'здесь', there: 'там', now: 'сейчас', still: 'всё ещё', too: 'тоже; слишком', also: 'тоже', very: 'очень', just: 'просто; только что',
  even: 'даже', only: 'только', again: 'снова', yet: 'ещё (в отриц.)', never: 'никогда', once: 'однажды; один раз', every: 'каждый', all: 'все, весь',
  straight: 'прямо, сразу', obviously: 'очевидно', honestly: 'честно', maybe: 'может быть', quick: 'быстрый', less: 'меньше',
  hi: 'привет', hey: 'эй, привет', boss: 'шеф, начальник', wait: 'ждать; подожди', listen: 'слушать', look: 'смотреть; выглядеть',
  inspector: 'инспектор', intern: 'стажёр', new: 'новый', right: 'верно; так (в начале фразы)', make: 'заставлять; делать', regret: 'сожалеть',
  nice: 'приятный, хороший', meet: 'встречать, знакомиться', pleasure: 'удовольствие', ready: 'готовый', work: 'работа; работать', start: 'начинать',
  café: 'кафе', cafe: 'кафе', night: 'ночь', rain: 'дождь', raining: 'идёт дождь', rainy: 'дождливый', small: 'маленький', little: 'маленький', sea: 'море',
  harbor: 'гавань', hammer: 'барабанить, колотить', window: 'окно', gull: 'чайка', money: 'деньги', cash: 'наличные', gone: 'пропал, ушёл',
  last: 'прошлый; последний', take: 'брать', help: 'помогать (help yourself — угощаться)', office: 'офис', close: 'закрывать', shut: 'закрывать(ся)',
  morning: 'утро', ten: 'десять', six: 'шесть', two: 'два', three: 'три', fifty: 'пятьдесят', fact: 'факт', classic: 'классика',
  around: 'вокруг', find: 'находить', clue: 'улика, подсказка', use: 'использовать', good: 'хороший', talk: 'говорить', chat: 'беседа, болтовня',
  time: 'время', barista: 'бариста', carefully: 'внимательно', closely: 'внимательно', lie: 'ложь; лгать', press: 'нажимать', show: 'показывать',
  objection: 'возражение', moment: 'момент', hit: 'бить; жать', evidence: 'улики, доказательства', thing: 'вещь', tap: 'нажать, коснуться',
  object: 'предмет', examine: 'осматривать', suspicious: 'подозрительный',
  open: 'открытый; открывать', empty: 'пустой', wide: 'широко', penny: 'пенни', leave: 'оставлять; уходить',
  check: 'проверять', funny: 'забавный, странный', latte: 'латте', big: 'большой', black: 'чёрный', door: 'дверь', prop: 'прислонить',
  drip: 'капать', dripping: 'капающий (dripping wet — мокрый насквозь)', name: 'имя', toss: 'бросить', chair: 'стул', as: 'как', pop: 'выскочить',
  camera: 'камера', staff: 'персонал, сотрудники', key: 'ключ', kill: 'убить; вырубить', bet: 'держать пари',
  evening: 'вечер', year: 'год', go: 'идти, ехать', home: 'дом; домой', lock: 'запирать (lock up — запереть всё)', dot: 'точка (on the dot — ровно)',
  say: 'говорить', serve: 'обслуживать', served: 'обслужен', man: 'мужчина', guy: 'парень, тип', come: 'приходить', want: 'хотеть', order: 'заказывать',
  late: 'поздно', turn: 'поворачивать (turn up — появиться)', grey: 'серый', coat: 'пальто', tall: 'высокий', huge: 'огромный',
  set: 'ставить (set foot — ступить)', foot: 'нога, ступня', whole: 'целый, весь', walk: 'идти пешком; проводить', car: 'машина', pour: 'лить(ся)',
  end: 'заканчиваться (end up — оказаться)', soak: 'промокнуть (soaking wet — насквозь мокрый)', soaking: 'промокший насквозь',
  know: 'знать', idea: 'идея (no idea — понятия не имею)', give: 'давать', pound: 'фунт (деньги)', quid: 'фунт (разг.)', slip: 'сунуть незаметно',
  promise: 'обещать', swear: 'клясться', touch: 'трогать', scared: 'напуганный', terrified: 'в ужасе', rich: 'богатый', detective: 'детектив',
  guess: 'гадать, угадывать', prove: 'доказывать', answer: 'ответ', early: 'рано', tell: 'говорить, сказать', 
  photo: 'фото', zoom: 'приближать (zoom in)', handle: 'ручка', engrave: 'гравировать', quiet: 'тихий', silent: 'молчаливый (fall silent — замолчать)',
  fall: 'падать', partner: 'партнёр', business: 'бизнес, дело', own: 'собственный', mr: 'мистер', remember: 'помнить', word: 'слово', exactly: 'именно',
  people: 'люди', yesterday: 'вчера', today: 'сегодня', tomorrow: 'завтра', part: 'часть', case: 'дело', file: 'папка, дело',
  city: 'город', mean: 'значить', almost: 'почти', sure: 'уверен; конечно', try: 'пробовать', think: 'думать',
};

// irregular and contracted forms
const FORMS = {
  "coffee's": 'кофе (coffee is)', "daisy's": 'Дейзи (её)', "he'd": 'он бы / он (he would / had)', "they'd": 'они бы (they would)', "you'll": 'ты (будешь) (you will)',
  "shouldn't": 'не следует (should not)', thoughts: 'мысли (my thoughts exactly — я как раз об этом)', drove: 'drive', known: 'know', lost: 'lose', paid: 'pay',
  swore: 'swear', taken: 'take', writing: 'почерк; письмо', died: 'die',
  went: 'go', came: 'come', took: 'take', gave: 'give', had: 'have', made: 'make', got: 'get', left: 'leave', saw: 'see', said: 'say', told: 'tell',
  found: 'find', thought: 'think', fell: 'fall', put: 'put', kept: 'keep', ended: 'end', men: 'man', children: 'child', quickly: 'quick',
  "i'm": 'я (I am)', "you're": 'ты / вы (you are)', "he's": 'он (he is / has)', "she's": 'она (she is / has)', "it's": 'это (it is)', "that's": 'это (that is)',
  "there's": 'есть, имеется (there is)', "we're": 'мы (we are)', "they're": 'они (they are)', "i've": 'я (I have)', "i'd": 'я бы / я (I would / had)',
  "i'll": 'я (буду)', "let's": 'давай(те)', "don't": 'не (do not)', "doesn't": 'не (does not)', "didn't": 'не (в прошлом, did not)',
  "isn't": 'не является (is not)', "aren't": 'не (are not)', "wasn't": 'не был', "can't": 'не могу (cannot)', "won't": 'не буду',
  "who's": 'кто (who is / has)', "what's": 'что (what is)', "till's": 'касса (the till has)', "reyes's": 'Рейес (её)', "tom's": 'Тома (его)',
  "blackwood's": 'Блэквуда', "hasn't": 'не (has not)', "that'll": 'это будет (that will)', "nobody's": 'никто не (nobody is)', sent: 'send',
};

const tracked = {}; // key -> { ru, form, cloze, src }
export function registerWords(words, src) { for (const k in words) tracked[k] = { ...words[k], src }; }
export const trackedInfo = k => tracked[k];
export const trackedKeys = () => Object.keys(tracked);

function base(w) {
  if (G[w] != null && G[w] !== '') return w;
  const cands = [];
  if (w.endsWith('ies')) cands.push(w.slice(0, -3) + 'y');
  if (w.endsWith('es')) cands.push(w.slice(0, -2));
  if (w.endsWith('s')) cands.push(w.slice(0, -1));
  if (w.endsWith('ied')) cands.push(w.slice(0, -3) + 'y');
  if (w.endsWith('ed')) { const s = w.slice(0, -2); cands.push(s, s + 'e'); if (s.length > 2 && s.at(-1) === s.at(-2)) cands.push(s.slice(0, -1)); }
  if (w.endsWith('ing')) { const s = w.slice(0, -3); cands.push(s, s + 'e'); if (s.length > 2 && s.at(-1) === s.at(-2)) cands.push(s.slice(0, -1)); }
  if (w.endsWith('ly')) cands.push(w.slice(0, -2));
  for (const c of cands) if (G[c]) return c;
  return null;
}

// returns { word, ru, key? } — key is set for tracked words
export function lookup(surface, key) {
  if (key && tracked[key]) return { word: tracked[key].form || key, ru: tracked[key].ru, key };
  const w = surface.toLowerCase().replace(/’/g, "'");
  if (FORMS[w]) { const f = FORMS[w]; return G[f] ? { word: `${w} (${f})`, ru: G[f] } : { word: w, ru: f }; }
  const b = base(w);
  if (b) {
    return { word: b === w ? w : `${w} (${b})`, ru: G[b] };
  }
  if (tracked[w]) return { word: w, ru: tracked[w].ru, key: w };
  if (w.endsWith("'s")) { const r = lookup(w.slice(0, -2)); if (r.ru) return { word: w, ru: r.ru + ' (\'s — принадлежность или is)' }; }
  return { word: w, ru: null };
}
