const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const script = new vm.Script(fs.readFileSync(require.resolve('../welcome.js'), 'utf8'));

function browser(initial) {
  let storage = initial;
  return () => {
    const message = {};
    const dialog = {addEventListener(){}, showModal(){}};
    script.runInNewContext({navigator:{}, document:{querySelector: s => s === '#welcome' ? dialog : message},
      localStorage:{getItem:()=>storage,setItem:(_,value)=>{storage=value;}}});
    return message.textContent;
  };
}
test('every cycle shows all 21 notes and every rolling window of 20 is unique', () => {
  const visit=browser(null), notes=Array.from({length:210},visit);
  for(let i=0;i<notes.length;i++) {
    assert.equal(new Set(notes.slice(Math.max(0,i-19),i+1)).size,Math.min(i+1,20));
    if(i%21===0) assert.equal(new Set(notes.slice(i,i+21)).size,21);
  }
});
test('legacy completed cycles keep their recent history on upgrade',()=>{
  const legacy=Array.from({length:21},browser(null));
  const visit=browser(JSON.stringify(legacy));
  const notes=legacy.concat(Array.from({length:21},visit));
  for(let i=21;i<notes.length;i++) assert.ok(!notes.slice(i-19,i).includes(notes[i]));
});
