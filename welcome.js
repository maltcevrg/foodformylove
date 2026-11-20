(() => {
  const phrases = [
    'Сегодня ты, как всегда, самая самая красивая и лучшая',
    'Котёнок, ты просто прекрасна',
    'Приятного аппетита, солнце, целую всю))',
    'Кто душнит тот лох, я лох получается',
    'Сейчас бы снова с тобой обниматься встречая закат на ГЭСе, а не вот это всё',
    'Если у тебя плохое настроение, то вспомни мои глаза которые смотрят на тебя в коридоре))',
    'Ты моя королева <3'
  ];
  const key = 'leraWelcomeNotes';
  let seen = [];
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(stored)) seen = [...new Set(stored.filter(p => phrases.includes(p)))];
  } catch { /* The note also works when browser storage is disabled. */ }
  const last = seen.at(-1);
  if (seen.length === phrases.length) seen = [];
  const choices = phrases.filter(p => !seen.includes(p) && p !== last);
  const note = choices[Math.floor(Math.random() * choices.length)];
  try { localStorage.setItem(key, JSON.stringify([...seen, note])); } catch {}

  const dialog = document.querySelector('#welcome');
  document.querySelector('#compliment').textContent = note;
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.showModal();
})();
