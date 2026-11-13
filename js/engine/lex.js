// Tap-to-translate dictionary: base forms + a tiny lemmatizer. Tracked words come from episodes.
const G = {
  // Last Signal, Heat for Two
  against:'о; против', beds:'кровати', beside:'рядом с', bird:'птица', both:'оба', bring:'принести', broke:'прорвался; сломал', brought:'принёс', catches:'схватывает; запускается', clock:'часы', confirmed:'подтверждённый', connect:'подключить', connected:'подключённый', crew:'команда', describe:'описать', description:'описание', during:'во время', earned:'заслужил', eli:'Илай (имя)', 'eli’s':'Илая', engine:'двигатель', faded:'выцветший', feeds:'питает', filling:'наполняя', fingers:'пальцы', footsteps:'шаги', forget:'забыть', generator:'генератор', glow:'свечение', heat:'тепло; обогревать', heating:'обогрев', heats:'обогревает', indicator:'индикатор', locker:'шкафчик', longer:'дольше', main:'основной', maintenance:'техническое обслуживание', matches:'совпадает', may:'может', melt:'таять', melting:'тает', occupants:'обитатели', onto:'на', paper:'бумажный; бумага', photograph:'фотография', piece:'кусочек', pipe:'труба', pipes:'трубы', portable:'переносной', presence:'присутствие', registered:'зарегистрированный', restored:'восстановлен', rumble:'гул', same:'тот же', seat:'место для сидения', section:'отсек', sensor:'датчик', separate:'отдельный', service:'служебный', settles:'становится ровным; оседает', shelter:'укрытие', stable:'стабильный', startup:'запуск', steady:'ровный', step:'шаг', stitched:'вышитый', stuck:'заклинивший', supplies:'подаёт', support:'поддерживать; выдерживать', 'there’ll':'будет (there will)', wake:'проснуться', 'we’ll':'мы будем (we will)', wore:'носил; был одет',
  // ---- Fresh Start, chapter 1 (Scottish words come with a note)
  goodbye: 'до свидания, прощание (no goodbye — не попрощавшись)',
  actually: 'вообще-то, на самом деле', advance: 'продвижение (in advance — заранее)', along: 'вдоль; с кем-то (sing along — подпевать)', apology: 'извинение',
  art: 'искусство', august: 'август', awkward: 'неловкий', backpack: 'рюкзак', bag: 'сумка', band: 'музыкальная группа', battered: 'потрёпанный',
  believe: 'верить', beneath: 'под', biology: 'биология (marine biology — морская биология)', bit: 'кусочек (in a bit — скоро)', blue: 'синий',
  board: 'доска', breakfast: 'завтрак', brilliant: 'блестяще, отлично', cake: 'пирог, торт, выпечка', chapter: 'глава', chocolate: 'шоколад', choice: 'выбор',
  cinnamon: 'корица', cling: 'цепляться', college: 'колледж', concert: 'концерт', cool: 'круто; прохладный', corner: 'угол (round the corner — за углом)',
  cosy: 'уютный', count: 'считать (count me in — я в деле)', creak: 'скрипеть', cream: 'сливки', crowd: 'толпа, публика (tough crowd — строгая публика)',
  cup: 'чашка', daytime: 'дневное время', downstairs: 'внизу (на первом этаже)', drink: 'напиток; пить', earlier: 'раньше, недавно', edge: 'край',
  eh: 'а? да? (в конце фразы)', english: 'английский', fair: 'честный (fair warning — честно предупреждаю)', fan: 'фанат, поклонник', far: 'далеко',
  fiona: 'Фиона (имя)', floorboard: 'половица', fresh: 'свежий', full: 'полный', fun: 'весело, веселье', further: 'дальше', glance: 'взглянуть, покоситься',
  goodness: 'батюшки! (удивление)', guitar: 'гитара', ha: 'ха!', hair: 'волосы', happy: 'счастливый, рад', harbour: 'гавань', haul: 'тащить с трудом',
  heard: 'слышал(а) (hear)', heavy: 'тяжёлый', hence: 'отсюда, поэтому', hiya: 'привет! (разг., Шотландия и север Англии)', impression: 'впечатление',
  insist: 'настаивать', joke: 'шутить', journey: 'поездка, путь', kai: 'Кай (имя)', kazakhstan: 'Казахстан', kind: 'добрый (that\'s kind of you — очень мило)',
  kinloch: 'Кинлох (городок)', landlady: 'хозяйка (сдаёт жильё)', let: 'позволять (let me — дай мне)', live: 'жить', lodge: 'снимать комнату', lodger: 'жилец, квартирант',
  loose: 'шатающийся, незакреплённый', marine: 'морской', million: 'миллион (thanks a million — огромное спасибо)', mind: 'разум (never mind — ничего, неважно)',
  mix: 'смесь', music: 'музыка', nae: 'нет, не (шотл.: nae bother — не беда)', none: 'ничего, никакой', notebook: 'тетрадь, блокнот',
  och: 'ох (шотл.)', oi: 'эй!', old: 'старый, прежний', option: 'вариант', page: 'страница', party: 'вечеринка', perfect: 'отлично, идеально',
  pet: 'дорогая(ой), милая(ый) (ласковое обращение в Шотландии)', play: 'играть', polite: 'вежливый', quiz: 'викторина', reply: 'ответ; отвечать',
  round: 'вокруг (round the corner — за углом)', russia: 'Россия', salt: 'соль', sam: 'Сэм (имя)', scone: 'скон (британская булочка к чаю)',
  shaky: 'дрожащий', shift: 'сдвигаться; смена', silence: 'тишина', sin: 'грех (for my sins — за грехи мои, шутл.)', smell: 'пахнуть',
  sometimes: 'иногда', somewhere: 'где-то', story: 'история', strange: 'странный', strong: 'крепкий, сильный', student: 'студент(ка)',
  study: 'учиться, изучать', suddenly: 'вдруг', taste: 'иметь вкус', teapot: 'заварочный чайник', than: 'чем', tired: 'уставший',
  tongue: 'язык (hold your tongue — промолчать)', tough: 'трудный, строгий', train: 'поезд', trek: 'долгий путь', trip: 'поездка',
  u: 'ты (you, в переписке)', unpack: 'распаковать вещи', upstairs: 'наверху, наверх', warning: 'предупреждение', wee: 'маленький (шотл.: a wee while — чуть-чуть)',
  wild: 'дикий, буйный', windy: 'ветреный', woman: 'женщина', worry: 'беспокойство (no worries — не волнуйся)', wow: 'ого!', write: 'писать',
  // ---- Last Signal, episode 1
  across: 'через, по (across the sky — по небу)', ago: 'назад (three days ago — три дня назад)', air: 'воздух', alive: 'живой', alone: 'один, в одиночестве',
  anybody: 'кто-нибудь', aria: 'ARIA (имя компьютера станции)', asleep: 'спящий (be asleep — спать)', aurora: 'северное сияние; Аврора (название станции)',
  battery: 'батарея, аккумулятор', begin: 'начинать(ся)', breathe: 'дышать', calm: 'спокойный', chen: 'Чен (фамилия)', clear: 'ясный (loud and clear — слышу отлично)',
  click: 'щелчок; щёлк', computer: 'компьютер', control: 'кнопка, рычаг управления', crackle: 'трещать', cut: 'резать (cut out — вырезать)', dance: 'танцевать',
  eight: 'восемь', emergency: 'аварийный, экстренный', enough: 'достаточно', entry: 'запись (в журнале)', episode: 'эпизод, серия', eye: 'глаз', flash: 'мигать',
  fly: 'лететь, летать', follow: 'следовать', forty: 'сорок', fourteen: 'четырнадцать', freezing: 'ледяной, морозный', frozen: 'замёрзший',
  god: 'Бог (thank God — слава богу)', great: 'отличный, большой', green: 'зелёный', grin: 'широко улыбаться', heater: 'обогреватель', howl: 'выть',
  hum: 'гудеть', ice: 'лёд', important: 'важный', include: 'включать в себя', instruction: 'инструкция', intelligence: 'интеллект',
  interesting: 'интересный', knob: 'ручка (круглая)', lever: 'рычаг', life: 'жизнь (come to life — оживать)', light: 'свет, лампа', long: 'длинный, долгий',
  loud: 'громкий', low: 'низкий (power is low — энергии мало)', massive: 'огромный', matter: 'иметь значение', maya: 'Майя (имя)', metal: 'металлический, металл',
  mic: 'микрофон (сокр.)', minus: 'минус', mug: 'кружка', negative: 'отрицательно (нет)', noise: 'шум', nope: 'не-а (нет)', nord: 'Норд (название станции)',
  "o'clock": 'час (eight o\'clock — восемь часов)', onboard: 'бортовой', percent: 'процент', polar: 'полярный', power: 'энергия, питание', pull: 'тянуть (pull down — опустить)',
  pulse: 'пульсировать', recommend: 'рекомендовать', red: 'красный', rest: 'отдых; остальные (the rest — остальные)', ripple: 'колыхаться волнами',
  roll: 'катиться (rolling in — надвигается)', room: 'комната (radio room — радиорубка)', run: 'бежать; управлять (run on — работать на)',
  sharp: 'ровно (eight sharp — ровно в восемь)', shutter: 'ставня, металлическая штора', sky: 'небо', sleep: 'спать; сон', slowly: 'медленно', snow: 'снег',
  sound: 'звучать (you sound calm — голос спокойный)', static: 'помехи (в эфире)', switch: 'переключать (switch on — включать)', tea: 'чай', team: 'команда',
  thaw: 'оттаивать', twelve: 'двенадцать', voice: 'голос', warm: 'тёплый (stay warm — не замёрзнуть)', way: 'путь, способ', welcome: 'добро пожаловать',
  wind: 'ветер', winter: 'зима, зимний', minute: 'минута', nobody: 'никто', press: 'нажимать', small: 'маленький', big: 'большой', first: 'первый; сначала',
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
  // ---- Backstage, episode 1 (British words and slang come with a note)
  absolutely: 'абсолютно, совершенно', admit: 'признавать', amazing: 'потрясающий', angry: 'злой, сердитый', annoyed: 'раздражённый',
  apparently: 'судя по всему, похоже', artist: 'артист(ка), исполнитель', autograph: 'автограф', ava: 'Эйва (имя)', aww: 'ой, как мило!',
  babe: 'детка, дорогая (разг.)', backward: 'назад (without a backward glance — не оглянувшись)', bang: 'бам! (удар)', bassline: 'басовая линия (в музыке)',
  bathroom: 'ванная', beat: 'биться (о сердце); ритм', best: 'лучший (ur the best — ты лучшая)', bestie: 'лучшая подруга (разг.)',
  boring: 'скучный (о человеке или вещи); bored — «мне скучно»', boy: 'парень, мальчик', britain: 'Британия', british: 'британский; британцы',
  budget: 'бюджет; бюджетный, дешёвый', busy: 'занятой', camden: 'Камден (район Лондона)', careful: 'осторожный (careful — осторожно!)',
  cheap: 'дешёвый', choose: 'выбирать', comfortable: 'удобный', compliment: 'делать комплимент, хвалить', corridor: 'коридор',
  curl: 'свернуться (curled up — свернувшись калачиком)', cute: 'милый, симпатичный', disc: 'диск (gold disc — золотой диск за продажи)',
  engineer: 'инженер (sound engineer — звукорежиссёр)', er: 'э-э… (заминка)', exact: 'точный (the exact opposite — ровно наоборот)',
  expensive: 'дорогой', fader: 'фейдер (ползунок громкости на пульте)', fast: 'быстрый, быстро', feel: 'чувствовать', feeling: 'чувство',
  flatmate: 'сосед(ка) по квартире (брит.; в США — roommate)', four: 'четыре', free: 'свободный; бесплатный', front: 'передний (front desk — стойка ресепшена)',
  furious: 'в ярости', gig: 'концерт, выступление (разг.)', girl: 'девушка, девочка', gold: 'золотой; золото', gonna: 'собираюсь (= going to, разг.)',
  harm: 'вред (no harm done — ничего страшного)', head: 'голова (keep your head down — опусти голову)', high: 'высокий (high street — масс-маркет, сетевые магазины)',
  hm: 'хм', iconic: 'культовый (go be iconic — иди и блистай, разг.)', identical: 'одинаковый', ignore: 'игнорировать',
  incident: 'происшествие, инцидент', internet: 'интернет', internship: 'стажировка', into: 'в (внутрь; walk into — врезаться)',
  involve: 'касаться, включать в себя', jacket: 'куртка, пиджак', kettle: 'чайник (put the kettle on — поставь чайник)', kit: 'Кит (имя)',
  later: 'позже', leather: 'кожаный; кожа', leo: 'Лео (имя)', likewise: 'взаимно', literally: 'буквально (в разговоре — для усиления)',
  lol: 'лол, ха-ха (laughing out loud)', london: 'Лондон', luck: 'удача (good luck — удачи)', many: 'много', marvellous: 'чудесно (часто иронично)',
  meat: 'мясо (fresh meat — новенькая, «свежее мясо», грубовато)', mega: 'мега-, очень (разг.)', ngl: 'честно говоря (not gonna lie — не буду врать)',
  often: 'часто', online: 'в сети, онлайн', opposite: 'противоположность', person: 'человек', propose: 'предлагать', pure: 'чистый (pure sarcasm — чистый сарказм)',
  push: 'толкать, нажимать (push up — поднять)', quality: 'качество', quite: 'вполне, совсем (not quite — не совсем)', reach: 'достигать, доходить',
  record: 'записывать; пластинка (gold record — золотая пластинка)', recording: 'запись', ridiculously: 'до смешного, ужасно', roomie: 'соседка по комнате (разг.)',
  rowe: 'Роу (фамилия)', rude: 'грубый', sarcasm: 'сарказм', save: 'спасать (save my day — спасти день)', seriously: 'серьёзно?!',
  share: 'делить, снимать вместе', shattered: 'вымотанный, без сил (брит.)', shiny: 'блестящий', shirt: 'рубашка (T-shirt — футболка)',
  shoebox: 'коробка из-под обуви (о тесной квартире)', shoe: 'туфля, ботинок', sienna: 'Сиенна (имя)', sign: 'подписывать (signed — с контрактом)',
  singer: 'певец, певица', smile: 'улыбка; улыбаться', solo: 'сольный', spill: 'пролить', stage: 'сцена (on stage — на сцене)',
  stalk: 'уходить с гордым видом', street: 'улица', suit: 'подходить (suit yourself — как хочешь)', surprisingly: 'неожиданно',
  swing: 'качнуться (swing open — распахнуться)', text: 'писать сообщение; сообщение', tidewater: 'Tidewater (название лейбла)', tone: 'тон, интонация',
  tonight: 'сегодня вечером', totally: 'полностью, совсем', tray: 'поднос', treat: 'обращаться (how is it treating you? — как тебе?)',
  ur: 'твой / ты (your / you\'re, в переписке)', velvet: 'бархат (Velvet Static — название группы)', wall: 'стена', watch: 'смотреть (watch where you\'re going — смотри, куда идёшь)',
  well: 'ну…; хорошо', white: 'белый', ruin: 'испортить (ruined — испорчен)', selfie: 'селфи', without: 'без', yeah: 'ага, да (разг.)', yourself: 'себя (make yourself at home — будь как дома)',
};

// irregular and contracted forms
const FORMS = {
  "there'll": 'будет (there will)', "we'll": 'мы будем (we will)',
  "breakfast's": 'завтрак (breakfast is)', "train's": 'поезд (train is)', "sam's": 'Сэма (его)', apologies: 'apology', bags: 'bag', concerts: 'concert',
  clinging: 'cling', creaks: 'creak', floorboards: 'floorboard', glances: 'glance', impressions: 'impression', joking: 'joke', lived: 'live', lives: 'live',
  lodged: 'lodge', parties: 'party', scones: 'scone', shifts: 'shift', smells: 'smell', studying: 'study', tastes: 'taste', unpacked: 'unpack', women: 'woman',
  worries: 'worry', wrote: 'write',
  "they've": 'они (they have)', "you've": 'ты (you have)', slept: 'sleep', warmer: 'warm', lights: 'light', eyes: 'eye', channels: 'channel', controls: 'control',
  begins: 'begin', dancing: 'dance', flashing: 'flash', grinning: 'grin', howling: 'howl', howls: 'howl', hums: 'hum', includes: 'include', instructions: 'instruction',
  matters: 'matter', pulsing: 'pulse', rippling: 'ripple', rolling: 'roll', running: 'run', switches: 'switch', crackles: 'crackle',
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
  "blackwood's": 'Блэквуда', seen: 'see', faster: 'fast', "hasn't": 'не (has not)', "that'll": 'это будет (that will)', "nobody's": 'никто не (nobody is)', sent: 'send',
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
