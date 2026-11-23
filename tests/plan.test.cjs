const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname,'..');
const {plan,recipes,foods,breakfastGroups,generalRecipes,airfryerRecipes} = vm.runInNewContext(['data.js','plan.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n')+';({plan,recipes,foods,breakfastGroups,generalRecipes,airfryerRecipes})');

test('каталог: 169 уникальных первоисточников, состав, порции и изображения',()=>{
  assert.equal(recipes.length,169);
  for(const key of ['id','url','name']) assert.equal(new Set(recipes.map(r=>r[key])).size,recipes.length);
  for(const r of recipes){
    assert.match(r.url,/^https:\/\/1000\.menu\/cooking\/\d+-/);
    assert.doesNotMatch(r.name,/омлет|глазунья|скр[эе]мбл|шакшука|яичниц|тыкв|суп|борщ|^щи\s|рассольник/i);
    for(const [k,g] of Object.entries(r.items)){
      assert.ok(foods[k] && g>0);
      assert.notEqual(k,"pumpkin");
      assert.equal(g,(r.base[k]||0)+(r.side[k]||0));
    }
    assert.ok(r.b>=25 && r.b<=35 && r.kcal>=515 && r.kcal<=600 && r.time>0,r.name);
    assert.notEqual(r.cat,'Супы');
    assert.equal(r.photo,`assets/${r.id}.webp`);
    const img=fs.readFileSync(path.join(root,r.photo));
    assert.equal(img.toString('ascii',8,12),'WEBP');
  }
});
test('недели не пересекаются до исчерпания каталога, история переживает восстановление',()=>{
  let state=plan.restore();
  const visited=new Set();
  for(let i=0;i<80;i++){
    assert.equal(new Set(state.ids).size,21);
    for(const id of state.ids){
      assert.ok(!visited.has(id),'повтор до исчерпания каталога: '+id);
      visited.add(id);
      assert.ok(generalRecipes.some(r=>r.id===id));
      if(visited.size===generalRecipes.length) visited.clear();
    }
    const next=plan.nextWeek(state.ids,state.seen);
    assert.ok(next.ids.every(id=>!state.ids.includes(id)));
    state=plan.restore(JSON.parse(JSON.stringify({...state,...next})));
  }
});
test('миграция: удалённые блюда не возвращаются, остальные отметки сохранены',()=>{
  const saved=plan.restore(null,{ids:['omelette','bulgur'],done:['omelette','vegom','bulgur']});
  assert.deepEqual([...saved.done],['bulgur']);assert.equal(saved.ids.length,21);
  const resumed=plan.restore({...saved,portion:{bulgur:2,omelette:3},checked:['bulgur','foo']});
  assert.equal(resumed.portion.bulgur,2);assert.ok(!('omelette' in resumed.portion));
  assert.deepEqual([...resumed.checked],['bulgur']);
});
test('тыква исчезает из сохранённой недели и покупок, овсяноблины остаются',()=>{
  const week=plan.restore().ids.map(id=>id==='m69215'?'m66907':id==='m29488'?'m32624':id);
  const s=plan.restore({ids:week,seen:week,done:['m66907','bulgur'],portion:{bulgur:2,m66907:2},checked:['pumpkin','milk']});
  assert.equal(s.ids.length,21);assert.ok(!s.ids.includes('oat') && s.ids.includes('m29488'));
  assert.deepEqual([...s.checked],[]);assert.deepEqual([...s.done],['bulgur']);assert.equal(s.portion.bulgur,2);
  assert.ok(recipes.filter(r=>/овсяноблин/i.test(r.name)).length>=2);
});

test('старое меню с супами заменяется без потери настроек других блюд',()=>{
  const week=plan.restore().ids.map(id=>id==='m42911'?'soup':id==='m29488'?'m28992':id);
  const state=plan.restore({ids:week,seen:week,done:['soup','bulgur'],portion:{soup:2,bulgur:3},checked:['milk']});
  assert.equal(state.ids.length,21);assert.ok(state.ids.includes('m42911'));
  assert.deepEqual([...state.done],['bulgur']);assert.equal(state.portion.bulgur,3);
  assert.ok(!state.seen.includes('soup'));assert.ok(!('soup' in state.portion));
});

test('покупки пусты до выбора, выбранные порции независимы от подборки',()=>{
  const s=plan.restore();assert.equal(Object.keys(s.portion).length,0);
  const r=recipes.find(r=>!s.ids.includes(r.id));
  const selected=plan.restore({...s,portion:{[r.id]:2,bulgur:0,unknown:1}});
  assert.deepEqual({...selected.portion},{[r.id]:2});
  const next=plan.restore({...selected,...plan.nextWeek(s.ids,s.seen)});
  assert.deepEqual({...next.portion},{[r.id]:2});
});

test('аэрогриль: 90 рецептов, «и там, и там» отмечены отдельным значком',()=>{
  assert.equal(airfryerRecipes.length,90);
  assert.equal(new Set(airfryerRecipes.map(r=>r.id)).size,90);
  const dual=airfryerRecipes.filter(r=>r.both);
  const exclusive=airfryerRecipes.filter(r=>!r.both);
  assert.equal(dual.length,70);
  assert.equal(exclusive.length,20);
  // «И там, и там»: 29 адаптированных из духовки интернет-рецептов и 41 блюдо основной коллекции
  const mirrored=airfryerRecipes.filter(r=>!/^a/.test(r.id));
  assert.equal(mirrored.length,41);
  assert.ok(mirrored.every(r=>r.both && generalRecipes.includes(r)));
  const breakfastIds=new Set(Object.values(breakfastGroups).flat());
  assert.ok(airfryerRecipes.every(r=>!breakfastIds.has(r.id)));
  // неделя в общей коллекции не меняется, новые рецепты в ротацию не попадают
  assert.equal(generalRecipes.length,90);
  assert.ok(airfryerRecipes.filter(r=>/^a/.test(r.id)).every(r=>!generalRecipes.includes(r)));
});

test('завтраки ссылаются на существующие рецепты без дубликатов, в том числе на оба овсяноблина',()=>{
  const ids=Object.values(breakfastGroups).flat();
  assert.equal(ids.length,30);assert.equal(new Set(ids).size,ids.length);
  assert.ok(ids.every(id=>recipes.some(r=>r.id===id)));
  assert.ok(ids.includes('oat') && ids.includes('m34584'));
});

test('старая неделя очищается от завтраков без потери покупок и отметок',()=>{
  const ids=recipes.slice(0,21).map(r=>r.id), breakfast=new Set(Object.values(breakfastGroups).flat());
  const saved=plan.restore({ids,seen:ids,done:['oat'],portion:{oat:3}});
  assert.equal(generalRecipes.length,90);assert.equal(new Set(saved.ids).size,21);
  assert.ok([...saved.ids,...saved.seen].every(id=>!breakfast.has(id)));
  assert.ok(ids.every(id=>breakfast.has(id)||saved.ids.includes(id)));
  assert.equal(saved.portion.oat,3);assert.ok(saved.done.includes('oat'));
});
