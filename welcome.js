(() => {
  const phrases = [
    'Сегодня ты, как всегда, самая самая красивая и лучшая',
    'Котёнок, ты просто прекрасна',
    'Приятного аппетита, солнце, целую всю))',
    'Кто душнит тот лох, я лох получается',
    'Сейчас бы снова с тобой обниматься встречая закат на ГЭСе, а не вот это всё',
    'Если у тебя плохое настроение, то вспомни мои глаза которые смотрят на тебя в коридоре))',
    'Ты моя королева <3',
    'Улыбнись, котёнок, ты самая лучшая девушка на планете.',
    'Сегодня твой день. И завтра, и вообще всегда)',
    'Люблю тебя, подружка))',
    'Блин, ты такая красивая, у меня даже глаз на лице задёргался, а могла бы ты',
    'Какой рассвет крутой, выгляни в окошко, котёнок. Это солнце светит так ярко или твоя красота?',
    'Доброе утро! Вам выдан посадочный билет на 1 лицо.',
    'Сегодня снова в душ и без меня?)',
    'Ты просто невероятная. Самая лучшая, самая умная, самая красивая и прекрасная <3',
    'У тебя самые красивые глазки <3',
    'Лер, ты когда улыбаешься, я следом тоже. А мне вообще-то надо было серьёзное лицо сделать))',
    'На ГЭСе, конечно, красивый закат. Надо будет в следующий раз хоть раз на него посмотреть, а не на тебя',
    'Ты постоянно спрашиваешь чего я так смотрю. Ну а как ещё на тебя смотреть, если ты вот такая прекрасная <3',
    'Обнять бы тебя на минуточку. Но насчёт минуточки я, конечно, вру)) И на счёт обнять тоже))',
    'Твои кружки с утра это самое лучшее начало дня'
  ];
  const key = 'leraWelcomeNotes';
  const windowSize = 20;
  const known = list => Array.isArray(list) ? list.filter(p => phrases.includes(p)) : [];

  function showNote() {
    let stored;
    try { stored = JSON.parse(localStorage.getItem(key)); } catch {}
    // Earlier versions stored just the current cycle in chronological order.
    const legacy = Array.isArray(stored);
    const recent = known(legacy ? stored : stored?.recent).slice(1 - windowSize);
    let cycle = [...new Set(known(legacy ? stored : stored?.cycle))];
    if (cycle.length === phrases.length) cycle = [];

    // Keep the rolling window even when the full-catalog cycle restarts.
    const eligible = phrases.filter(p => !recent.includes(p));
    let choices = eligible.filter(p => !cycle.includes(p));
    if (!choices.length) { // Recover from inconsistent saved cycle data.
      cycle = [];
      choices = eligible;
    }
    const note = choices[Math.floor(Math.random() * choices.length)];
    document.querySelector('#compliment').textContent = note;
    dialog.showModal();
    try {
      localStorage.setItem(key, JSON.stringify({
        recent: [...recent, note].slice(1 - windowSize), cycle: [...cycle, note]
      }));
    } catch { /* A note can still be shown without persistent storage. */ }
  }

  const dialog = document.querySelector('#welcome');
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  // Serialize visits from simultaneous tabs where Web Locks are supported.
  if (navigator.locks) navigator.locks.request(key, showNote);
  else showNote();
})();
