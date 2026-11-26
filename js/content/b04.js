import previous from './b03.js';
import { levels, line, word } from './episode.js';

export default {
  id: 'B-04', story: previous.story, title: 'The Real Slip', part: 'Case 2 · Part 2', icon: '🕵️',
  chars: previous.chars, phoneHolder: 'reyes',
  scenes: { office: { ...previous.scenes.office, mood: 'archive' } },
  endTitle: 'The archive is safe',
  teaser: 'The original records are back in the hands of the people who can check them.',
  teaserRu: 'Оригиналы вернулись к тем, кто может их проверить.',
  words: {
    cargo: previous.words.cargo, signature: previous.words.signature,
    carbon: word('carbon copy', 'копия через копирку', 'Keep the ___ in the drawer.', 'Храни копию в ящике.'),
    locker: word('locker', 'запирающийся шкафчик', 'Open the ___ with this key.', 'Открой шкафчик этим ключом.'),
  },
  clues: {
    original: { icon: '📄', title: 'Original slip', doc: 'TRANSFER 061\nDOCK 9 · LOCKER 4\nAUTHORISED: O. BLACKWOOD',
      text: levels('The original says locker four.', 'The original sends the box to [locker] four on Dock Nine.', 'The original transfer form sends the archive box to [locker] four on Dock Nine. Oscar signed this copy.'),
      ru: 'По оригиналу коробку должны были отвезти в шкафчик № 4 на девятом причале. Эту квитанцию подписал Оскар.' },
    duplicate: { icon: '🧾', title: 'Driver’s slip', doc: 'TRANSFER 061\nCUSTOMS ANNEX · LOCKER 7\nSIGNATURE: O. BLACKWOOD',
      text: levels('The driver’s slip says locker seven.', 'The driver’s slip sends the same box to [locker] seven in the customs annex.', 'The copy from the van bears the same transfer number and [signature], but it names the customs annex and [locker] seven.'),
      ru: 'На квитанции водителя тот же номер отправления и та же подпись. Адрес другой: шкафчик № 7 в таможенном корпусе.' },
  },
  beats: [
    { type: 'scene', to: 'office', shot: 'desk', caption: 'Blackwood & Reyes · Case 2' },
    line('blackwood', 'Look under the bottom drawer.', 'I taped the [carbon copy|carbon] of the signed slip under the bottom drawer.', 'I taped my signed [carbon copy|carbon] underneath the bottom drawer. Lay it beside the slip the driver left.', 'Я приклеил свою копию подписанной квитанции под нижним ящиком. Положите рядом квитанцию водителя.'),
    { type: 'explore', views: ['search-slips'], clues: ['original', 'duplicate'], need: ['original', 'duplicate'],
      hint: 'Check the paper under the drawer and the slip on the desk.', hintRu: 'Осмотри бумагу под ящиком и квитанцию на столе.' },
    line('jenna', 'Same number. Now check the address.', 'Both slips have the same number. The destination is what matters.', 'Transfer 061 on both slips. Ignore the name for a moment and compare where the box was meant to go.', 'На обеих квитанциях номер 061. Отложи вопрос о подписи и сравни адреса.', { shot: 'jenna' }),
    { type: 'interrogate', who: 'blackwood', shot: 'reyes-close', hint: { text: 'Find the slip that shows the new destination.', ru: 'Выбери квитанцию, на которой указан новый адрес.' },
      rounds: [{ statements: [
        { text: 'I signed a transfer for locker four.', ru: 'Я подписал квитанцию на шкафчик № 4.' },
        { text: 'Both slips sent the box to Dock Nine.', ru: 'На обеих квитанциях коробку отправили на девятый причал.', lie: 'duplicate', after: [
          line('reyes', 'This slip says customs annex.', 'The driver used the slip for the customs annex. Locker seven.', 'The driver’s copy sends the box to the customs annex, locker seven. I’ll send someone to check.', 'На квитанции водителя указан таможенный корпус, шкафчик № 7. Я отправлю туда человека.'),
        ] },
      ] }] },
    line('jenna', 'The port office sent the signed copy.', 'The port office found the annex copy in a folder marked “Send”. The folder belongs to the dispatcher.', 'The port office found the second form in the dispatcher’s outgoing folder. He’s agreed to talk to Reyes.', 'В порту нашли вторую квитанцию в исходящих документах диспетчера. Он согласился поговорить с Рейес.', { shot: 'jenna' }),
    line('reyes', 'We found the box. He wanted one page.', 'My colleague found the box in seven. The dispatcher wanted to take out one page before the audit.', 'Locker seven held the box and a page the dispatcher had taken out. It listed the fees he’d been charging twice.', 'В шкафчике № 7 лежали коробка и вынутая диспетчером страница. На ней были сборы, которые он начислял дважды.', { shot: 'reyes' }),
    line('blackwood', 'That’s why someone copied my name.', 'He copied my [signature] to make the new route look official.', 'He needed the change to look like my order. That’s why my [signature] was on a route I never approved.', 'Он скопировал мою подпись, чтобы переадресация выглядела как моё распоряжение.'),
    line('reyes', 'Put both slips in the file.', 'File both slips. The difference is how we found the box.', 'File the two slips together. A seven-minute gap started this, and one changed address brought the archive back.', 'Подшей обе квитанции. Мы начали с разницы в семь минут, а архив нашли по одному изменённому адресу.', { shot: 'desk' }),
    { type: 'end' },
  ],
};
