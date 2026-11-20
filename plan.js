// A week is a set of choices, never a breakfast/lunch/dinner schedule.
const plan = (() => {
  const size = 21;
  const ids = recipes.map(r => r.id);
  const known = new Set(ids);
  const byId = new Map(recipes.map(r => [r.id, r]));
  const valid = values => [...new Set(Array.isArray(values) ? values.filter(id => known.has(id)) : [])];
  function shuffled(items) {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function family(id) {
    const r = byId.get(id);
    if (r.cat !== 'Без мяса') return r.cat;
    if (/каша/i.test(r.name)) return 'Каши';
    if (/вареники|ньокки|пенне|паста|макароны/i.test(r.name)) return 'Паста и тесто';
    if (/фасол|горох|чечевиц/i.test(r.name)) return 'Бобовые';
    return 'Овощные блюда';
  }
  // Sample different families in proportion to their remaining counts.
  function draw(pool, count) {
    const groups = new Map();
    for (const id of shuffled(pool)) {
      const key = family(id);
      if (!groups.has(key)) groups.set(key, { bag: [], used: 0 });
      groups.get(key).bag.push(id);
    }
    const out = [];
    while (out.length < Math.min(count, pool.length)) {
      const ratio = g => (g.used + 0.5) / g.bag.length;
      const g = [...groups.values()].filter(g => g.used < g.bag.length).sort((a,b)=>ratio(a)-ratio(b))[0];
      out.push(g.bag[g.used++]);
    }
    return shuffled(out);
  }
  function nextWeek(current, seen) {
    const history = valid(seen);
    const next = draw(ids.filter(id => !history.includes(id) && !current.includes(id)), size);
    if (next.length === size) return { ids: next, seen: [...history, ...next] };
    // Only restart after exhausting the deck. Avoid the previous week even
    // at a cycle boundary, and don't duplicate a partial week's last cards.
    const rest = draw(ids.filter(id => !current.includes(id) && !next.includes(id)), size - next.length);
    return { ids: [...next, ...rest], seen: rest };
  }
  function restore(saved, legacy) {
    // Replace retired dishes in place without resetting the rest of a saved week.
    const replacements = {"m66907": "oat", "m32624": "m29488", "m30075": "m37963", "m27093": "m34584", "m20521": "m29354", "m36077": "m28853", "soup": "m42911", "m28992": "m29488", "m14506": "m39174", "grainSoup": "m7273", "m45359": "m12417", "m68629": "m27901", "m27840": "m39503", "m38765": "m9326", "m13529": "m16966", "m54107": "m26807", "m43822": "m68516", "m39960": "m42689", "m15490": "m11970", "m13922": "m24997", "m58781": "m13803", "m42642": "m672", "m27067": "m39318"};
    const current = valid(Array.isArray(saved?.ids) ? saved.ids.map(id => replacements[id] ?? id) : []);
    const resume = current.length === size;
    const week = resume ? current : ids.slice(0, size);
    // The shopping list is opt-in and independent of the rotating suggestions.
    // Earlier saves only stored quantities that the user explicitly changed.
    const portion = Object.fromEntries(Object.entries(saved?.portion ?? {}).filter(
      ([id,n]) => known.has(id) && Number.isInteger(n) && n > 0 && n <= size
    ));
    const ingredients = new Set(Object.keys(portion).flatMap(id => Object.keys(byId.get(id).items)));

    return {
      ids: week,
      // A week can straddle two 120-dish cycles. In that case only its tail
      // belongs to the current history; do not re-add the previous cycle.
      seen: resume && Array.isArray(saved.seen)
        ? valid([...saved.seen, ...saved.ids.filter(id => replacements[id]).map(id => replacements[id])])
        : [...week],
      done: valid(saved?.done ?? legacy?.done),
      portion,
      checked: Array.isArray(saved?.checked) ? saved.checked.filter(k => ingredients.has(k)) : []
    };
  }
  return { size, nextWeek, restore };
})();
