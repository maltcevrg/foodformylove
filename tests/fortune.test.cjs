const {test}=require('node:test');
const assert=require('node:assert/strict');
const fortune=require('../fortune.js');
test('веса и границы: колесо 60%, Telegram 30%, магазины по 5%',()=>{
  for(const value of [0,.25,.599999]) assert.equal(fortune.chooseAction(()=>value),null);
  for(const value of [.6,.75,.899999]) assert.equal(fortune.chooseAction(()=>value),'https://t.me/m/Hh21qoxKODA6');
  for(const value of [.9,.949999]) assert.match(fortune.chooseAction(()=>value),/^https:\/\/5ka.ru\//);
  for(const value of [.95,.999999]) assert.match(fortune.chooseAction(()=>value),/^https:\/\/magnit.ru\//);
  const counts=new Map();
  for(let i=0;i<100;i++){
    const action=fortune.chooseAction(()=>(i+.5)/100);
    counts.set(action,(counts.get(action)||0)+1);
  }
  assert.equal(counts.get(null),60);
  assert.equal(counts.get('https://t.me/m/Hh21qoxKODA6'),30);
  assert.deepEqual([...counts.values()],[60,30,5,5]);
});
test('9 уникальных рецептов без изменения каталога; стрелка совпадает с победителем',()=>{
  const catalog=Array.from({length:169},(_,id)=>({id}));
  const original=[...catalog];
  for(const random of [()=>0,()=>.99999,Math.random]){
    const {entries,winner,rotation}=fortune.spin(catalog,random);
    assert.equal(entries.length,9);
    assert.equal(new Set(entries.map(r=>r.id)).size,9);
    assert.ok(winner>=0&&winner<9);
    assert.equal((rotation+(winner+.5)*40)%360,0);
    assert.deepEqual(catalog,original);
  }
});
test('колесо использует каталог без завтраков и не показывает список названий',()=>{
  const fs=require('node:fs');
  const path=require('node:path');
  const vm=require('node:vm');
  const root=path.join(__dirname,'..');
  const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const {generalRecipes,breakfastIds}=vm.runInNewContext(
    fs.readFileSync(path.join(root,'data.js'),'utf8')+';({generalRecipes,breakfastIds})');
  assert.match(app,/fortune\.spin\(generalRecipes\)/);
  assert.doesNotMatch(app+html,/fortuneEntries/);
  for(let i=0;i<30;i++){
    const {entries}=fortune.spin(generalRecipes);
    assert.equal(entries.length,9);
    assert.ok(entries.every(r=>!breakfastIds.has(r.id)));
  }
});
