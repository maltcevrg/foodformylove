/* Чистая логика случайного выбора, без зависимостей. */
const fortune = (() => {
  const links = [
    null,
    'https://5ka.ru/catalog/vsya-gotovaya-eda--251C16710/?ysclid=mwvti7g4x6627808770&utm_referrer=https%3A%2F%2Fyandex.ru%2F',
    'https://magnit.ru/catalog/65055-testmmgotovaya_eda?ysclid=mwvtiv7bg7165072681',
    'https://t.me/m/Hh21qoxKODA6'
  ];
  function chooseAction(random = Math.random) {
    const roll = random();
    if (roll < 0.6) return links[0]; // Колесо: 60%.
    if (roll < 0.9) return links[3]; // Telegram: 30%.
    if (roll < 0.95) return links[1]; // Пятёрочка: 5%.
    return links[2]; // Магнит: 5%.
  }
  function spin(catalog, random = Math.random) {
    const pool = [...catalog];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const entries = pool.slice(0, 9);
    const winner = Math.floor(random() * entries.length);
    // Середина выигравшего сектора должна оказаться под верхней стрелкой.
    const rotation = 360 * 6 + 360 - (winner + 0.5) * (360 / entries.length);
    return {entries, winner, rotation};
  }
  return {chooseAction, spin};
})();
if (typeof module !== 'undefined') module.exports = fortune;
