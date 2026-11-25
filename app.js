const paths={sun:'M12 3v1.5M12 19.5V21M4.2 4.2l1.1 1.1m13.4 13.4 1.1 1.1M3 12h1.5M19.5 12H21M4.2 19.8l1.1-1.1M18.7 5.3l1.1-1.1M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9',moon:'M20.6 14.4A9 9 0 1 1 9.6 3.4a7 7 0 0 0 11 11Z',cup:'M3 9h13v5a6.5 6.5 0 0 1-13 0Zm13 1h2a3 3 0 0 1 0 6h-2M2 22h18M6 6c-2-2 2-2 0-4m5 4c-2-2 2-2 0-4',fish:'M3 12c3-5 6-7 10-6 2 1 4 2 5 4l4-3v10l-4-3c-4 6-11 5-15-2Zm4-1h.1',bowl:'M3 11h18c-1 6-4.5 9-9 9s-8-3-9-9Zm3 10h12M8 8c-2-2 2-3 0-5m5 5c-2-2 2-3 0-6m5 6c-1-2 2-3 1-5',book:'M3 4c3-1 6-1 9 1 3-2 6-2 9-1v15c-3-1-6-1-9 1-3-2-6-2-9-1ZM12 5v15',basket:'m3 10 2 10h14l2-10ZM2 10h20M7 10l4-7m6 7-4-7M9 13v4m6-4v4',heart:'M20.8 4.8c-2.7-2.7-6.1-1.9-8.8 1-2.7-2.9-6.2-3.7-8.8-1-4.2 4.3.3 9.8 8.8 15.6 8.5-5.8 13-11.3 8.8-15.6Z',calendar:'M4 5h16v16H4ZM4 10h16M8 3v4m8-4v4',fork:'M4 2v6c0 4 6 4 6 0V2M7 2v20m12 0V2c-4 3-5 9-1 10h1',leaf:'M20 3c-7 0-15 1-15 9 0 8 11 8 14 0 1-3 1-6 1-9ZM3 21l12-13',target:'M20 10a8 8 0 1 1-6-6m2 7a4 4 0 1 1-4-3m0 4 8-8m-1-2v4h4',flame:'M12 2c2 7 7 6 7 13a7 7 0 1 1-14 0c0-3 1-5 4-8 0 3 1 5 2 5 2-2 2-7 1-10Z',egg:'M19 15c0 4-3 7-7 7s-7-3-7-7S8 2 12 2s7 9 7 13Z',drop:'M12 2c-2 4-7 9-7 13a7 7 0 0 0 14 0c0-4-5-9-7-13ZM9 15c0 2 1 3 3 3',wheat:'M3 21 19 5m-9 9c-4 0-6-3-5-7 4 1 6 3 5 7Zm5-5c-3-2-4-5-2-8 2 2 3 5 2 8Zm-4 5c4 1 7 0 9-3-4-2-7-1-9 3Zm-5 5c4 1 7 0 9-3-4-2-7-1-9 3ZM17 7c-1-3 1-5 5-6 0 4-2 6-5 6Z',refresh:'M20 7a8 8 0 0 0-14-1L3 9m0-6v6h6m-5 8a8 8 0 0 0 14 1l3-3m0 6v-6h-6',check:'m5 12 4 4L19 6',circle:'M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9Zm-13 0 3 3 5-6',clock:'M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9Zm-9-5v6l4 2',bird:'M11 15c-2-3-1-6 2-9 2-2 6-2 8 1s0 7-3 8c-2 1-4 1-6 0l-5 4c0 3-4 3-4 0-3-1-2-4 1-4l5-4',arrow:'M5 12h14m-5-5 5 5-5 5',up:'M6 18 18 6M6 6h12v12',both:'M8 7h13m-4-4 4 4-4 4M16 17H3m4 4-4-4 4-4',close:'m6 6 12 12M18 6 6 18'};
function icon(k){return `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="${paths[k]}"></path></svg>`}document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
const $=s=>document.querySelector(s),main=$('#content'),dlg=$('#detail');let filter='Все рецепты',tab='recipes',activeId=null,afFilter='Все блюда';
const metrics=[['Калории','1 677','ккал','flame'],['Белки','76','г','egg'],['Жиры','47','г','drop'],['Углеводы','237','г','wheat'],['Клетчатка','23','г','leaf']];$('#macros').innerHTML=metrics.map(([l,n,u,k])=>`<div class="metric"><i>${icon(k)}</i><div><label>${l}</label><strong>${n} <small>${u}</small></strong></div></div>`).join('');
const byId=Object.fromEntries(recipes.map(r=>[r.id,r]));function load(key){try{return JSON.parse(localStorage.getItem(key))}catch{return null}}
let state=plan.restore(load('warmKitchen2'),load('warmKitchen1'));
function save(){try{localStorage.setItem('warmKitchen2',JSON.stringify(state))}catch{}}
save();
let timer;function toast(msg){$('#toast').textContent=msg;$('#toast').classList.add('show');clearTimeout(timer);timer=setTimeout(()=>$('#toast').classList.remove('show'),2100)}
const picked=()=>state.ids.map(id=>byId[id]),portion=id=>state.portion[id]??0;
function shoppingButton(r){
  const selected=portion(r.id)>0;
  return `<button class="btn cart-button ${selected?'selected':''}" data-cart="${r.id}" aria-label="${selected?'Открыть список покупок':'Добавить в покупки'}: ${r.name}">${icon(selected?'check':'basket')} ${selected?'В списке покупок':'Добавить в покупки'}</button>`;
}
function setPortion(id, amount){
  const old=portion(id);
  const n=Math.max(0,Math.min(plan.size,amount));
  if(n) state.portion[id]=n; else delete state.portion[id];
  const needed=new Set(Object.keys(state.portion).flatMap(key=>Object.keys(byId[key].items)));
  state.checked=state.checked.filter(k=>needed.has(k) && !(n>old && Object.hasOwn(byId[id].items,k)));
  save();render();
}
function bothBadge(r){return r.both?`<span class="badge both" title="Можно приготовить и в аэрогриле, и обычным способом (духовка/сковорода)">${icon('both')} И там, и там</span>`:''}
function cat(r){let k=r.cat==='Без мяса'?'leaf':r.cat==='С рыбой'?'fish':'bird';return `<span class="badge ${k}">${icon(k)} ${r.cat}</span>`}function cookLabel(r){return state.done.includes(r.id)?'Снять отметку о приготовлении':'Отметить как приготовленное'}
function card(r){let done=state.done.includes(r.id);return `<article class="card"><div class="picwrap"><button class="photo" data-open="${r.id}" aria-label="Открыть рецепт: ${r.name}"><img loading="lazy" src="${r.photo}" alt="${r.name}"></button><button class="cook ${done?'done':''}" data-cook="${r.id}" aria-pressed="${done}" aria-label="${cookLabel(r)}: ${r.name}" title="${cookLabel(r)}">${icon('check')}</button></div><div class="cardbody"><div class="cardmeta">${cat(r)}${bothBadge(r)}<span class="time">${icon('clock')} ${r.time} мин</span></div><button class="name" data-open="${r.id}">${r.name}</button><div class="footrow"><span class="energy">${icon('flame')} ${r.kcal} ккал</span><span>Б ${r.b}</span><span>Ж ${r.f}</span><span>У ${r.c}</span><button class="arrow" data-open="${r.id}" aria-label="Подробнее: ${r.name}">${icon('arrow')}</button></div>${shoppingButton(r)}</div></article>`}
const allBreakfasts = [...breakfastIds];
let breakfastGroup = 'Все завтраки';
function renderBreakfasts(){
  const ids = breakfastGroups[breakfastGroup] ?? allBreakfasts;
  main.innerHTML = `<div class="sectionhead"><div><div class="kicker section-kicker">ДОБРОЕ УТРО, ЛЕРА</div>
    <div class="titleline"><h2>Завтраки</h2><span class="count">${ids.length}</span></div>
    <p class="subtitle">Все 30 завтраков — только здесь. Выбирай по настроению: сладкое или несладкое.</p></div></div>
    <div class="filters" role="group" aria-label="Виды завтраков">${['Все завтраки', ...Object.keys(breakfastGroups)].map(group =>
      `<button data-breakfast="${group}" aria-pressed="${group===breakfastGroup}" class="${group===breakfastGroup?'on':''}">${group}</button>`).join('')}</div>
    <div class="grid">${ids.map(id=>card(byId[id])).join('')}</div>`;
}
const afFilters=['Все блюда','И там, и там','С птицей','С рыбой','Без мяса'];
function renderAirfryers(){
  const list=afFilter==='Все блюда'?airfryerRecipes:afFilter==='И там, и там'?airfryerRecipes.filter(r=>r.both):airfryerRecipes.filter(r=>r.cat===afFilter);
  main.innerHTML=`<div class="sectionhead"><div><div class="kicker section-kicker">ГОРЯЧИЙ ВОЗДУХ</div><div class="titleline"><h2 tabindex="-1">Аэрогриль</h2><span class="count">${list.length}</span></div><p class="subtitle">Все ${airfryerRecipes.length} рецептов для аэрогриля: от куриных крыльев до запеканки. Блюда со значком «И там, и там» готовятся и в аэрогриле, и обычным способом.</p></div></div><div class="filters" role="group" aria-label="Фильтр рецептов для аэрогриля">${afFilters.map(f=>`<button data-af="${f}" aria-pressed="${f===afFilter}" class="${f===afFilter?'on':''}">${f==='И там, и там'?icon('both'):''}${f}</button>`).join('')}</div><div class="grid">${list.map(card).join('')}</div>${list.length?'':'<div class="empty">В этой группе пока пусто.</div>'}<p class="note">Значок «И там, и там» показывает, что блюдо можно приготовить и в аэрогриле, и по обычному рецепту — в духовке или на сковороде. Часть из них — это те же блюда, что и в основной коллекции: отметки готовности и список покупок у них общие. Температуру и время при необходимости уменьши на 10–15%. КБЖУ указаны приблизительно для одной порции с продуктами к подаче.</p>`;
}
function render(){
  for(const [id,section] of [['navRecipes','recipes'],['navBreakfast','breakfast'],['navAirfryer','airfryer'],['navShop','shop']]){
    const button=document.getElementById(id);
    button.classList.toggle('active',tab===section);
    if(tab===section) button.setAttribute('aria-current','page'); else button.removeAttribute('aria-current');
  }
  if(tab==='breakfast'){renderBreakfasts();return}
  if(tab==='airfryer'){renderAirfryers();return}
  if(tab==='shop'){shop();return}let isDone=filter==='Приготовленные',list=isDone?generalRecipes.filter(r=>state.done.includes(r.id)):picked().filter(r=>filter==='Все рецепты'||r.cat===filter||(filter==='Без яиц'&&!r.items.egg));main.innerHTML=`<div class="sectionhead"><div><div class="kicker section-kicker">КУЛИНАРНАЯ ПОДБОРКА</div><div class="titleline"><h2 tabindex="-1">Коллекция рецептов</h2><span class="count">${list.length}</span></div><p class="subtitle">В общей коллекции ${generalRecipes.length} рецептов без завтраков. В подборке на неделю — ${plan.size} блюдо без повторов.</p></div></div><div class="filters">${['Все рецепты','С птицей','Без мяса','С рыбой','Без яиц','Приготовленные'].map(f=>`<button data-filter="${f}" aria-pressed="${f===filter}" class="${f===filter?'on':''}">${f==='Приготовленные'?icon('circle'):''}${f}</button>`).join('')}</div><div class="grid">${list.map(card).join('')}</div>${list.length?'':`<div class="empty">${isDone?'Здесь пока нет блюд. Нажми на галочку на фотографии готового блюда.':'В этой подборке нет таких блюд. Выбери другой фильтр или обнови рецепты.'}</div>`}<p class="note">Сначала показываем блюда, которых ещё не было. Новый круг начинается после всех ${generalRecipes.length} рецептов. Нажми «Добавить в покупки» у нужного блюда. В список попадут продукты на одну порцию; количество можно изменить во вкладке покупок. КБЖУ указаны приблизительно для одной порции с продуктами к подаче.</p><div class="refresh-actions"><button class="btn dark" data-refresh>${icon('refresh')} Обновить рецепты</button></div>`}
function units(k,g){if(k==='egg')return `${+(g/50).toFixed(2)} шт.`;if(['milk','kefir','cream10','soy','vinegar'].includes(k))return g>=1000?`${+(g/1000).toFixed(2)} л`:`${g} мл`;return g>=1000?`${+(g/1000).toFixed(2)} кг`:`${g} г`}
function details(id){activeId=id;let r=byId[id];$('#dialogInner').innerHTML=`<div class="modalpic"><img src="${r.photo}" alt="${r.name}"><button class="close" data-close aria-label="Закрыть">${icon('close')}</button></div><div class="modalbody">${cat(r)}${bothBadge(r)}<h2>${r.name}</h2><p>${icon('clock')} ${r.time} мин · 1 порция с подачей</p><p><b>≈ ${r.kcal} ккал</b> · Б ${r.b} г · Ж ${r.f} г · У ${r.c} г · Клетчатка ${r.fib} г</p><h4>Для приготовления</h4><p>${Object.entries(r.base).map(([k,g])=>foods[k][0]+' — '+units(k,g)).join('; ')}. Соль и специи по вкусу.</p><h4>К подаче</h4><p>любой гарнир который тебе нравится, моя врединка</p><p>Пропорции адаптированы под рацион; шаги — в оригинальном рецепте.</p><div class="ctl"><a class="btn dark" target="_blank" rel="noopener" href="${r.url}">Рецепт на 1000.menu ${icon('up')}</a><button class="btn outline" data-cook="${id}" aria-pressed="${state.done.includes(id)}">${icon('check')}${state.done.includes(id)?'Приготовлено':'Отметить готовым'}</button>${shoppingButton(r)}</div></div>`;if(!dlg.open)dlg.showModal()}
function shop(){let list=Object.keys(state.portion).map(id=>byId[id]),totals={},n=0;list.forEach(r=>{let p=portion(r.id);n+=p;if(p)for(let [k,v] of Object.entries(r.items))totals[k]=(totals[k]||0)+p*v});let avg=k=>Math.round(list.reduce((a,r)=>a+r[k]*portion(r.id),0)/7);main.innerHTML=`<div class="sectionhead"><div><div class="kicker section-kicker">МОЙ СПИСОК</div><div class="titleline"><h2>Список покупок</h2><span class="count">${n} / 21</span></div><p class="subtitle">Здесь только продукты для выбранных тобой блюд. Отмечай то, что уже есть дома.</p></div><button class="btn outline" data-return>${icon('book')} К рецептам</button></div><div class="shoplayout"><div class="shopbox"><h3>Что купить</h3>${n?'':'<p>Когда выберешь блюда, здесь появятся продукты и их количество.</p>'}${['Мясо, рыба, яйца и молочные продукты','Бакалея и хлеб','Овощи, фрукты и зелень'].map((g,i)=>{const keys=Object.keys(totals).filter(k=>foods[k][1]===i);return keys.length?`<h4>${g}</h4>`+keys.map(k=>`<div class="row"><label><input type="checkbox" data-item="${k}" ${state.checked.includes(k)?'checked':''}> ${foods[k][0]}</label><span>${units(k,totals[k])}</span></div>`).join(''):''}).join('')}${n?'<p>Также проверь соль, перец и любимые специи.</p>':''}</div><div class="shopbox"><h3>Порции на неделю</h3>${n?'<p>Меняй количество кнопками + и −. Убери последнюю порцию, чтобы удалить блюдо.</p>':'<p>Пока ни одного блюда. На странице рецептов нажми «Добавить в покупки» у того, что хочется приготовить.</p><button class="btn dark" data-return>Выбрать рецепты</button>'}${list.map(r=>`<div class="row"><span>${r.name}</span><div class="step"><button data-step="-1" data-id="${r.id}" aria-label="Уменьшить порции: ${r.name}" ${!portion(r.id)?'disabled':''}>−</button><b>${portion(r.id)}</b><button data-step="1" data-id="${r.id}" aria-label="Добавить порцию: ${r.name}" ${portion(r.id)>=21?'disabled':''}>+</button></div></div>`).join('')}${n?`<h4>В среднем за день</h4><p>≈ ${avg('kcal')} ккал · Б ${avg('b')} г · Ж ${avg('f')} г · У ${avg('c')} г · Клетчатка ${avg('fib')} г</p>`:''}</div></div>`}
function page(t,scroll=false){tab=t;render();if(scroll)main.scrollIntoView({behavior:'smooth',block:'start'})}$('#navRecipes').onclick=()=>page('recipes',true);$('#navBreakfast').onclick=()=>page('breakfast',true);$('#navAirfryer').onclick=()=>page('airfryer',true);$('#navShop').onclick=()=>page('shop',true);$('#home').onclick=e=>{e.preventDefault();filter='Все рецепты';page('recipes');window.scrollTo({top:0,behavior:'smooth'})};dlg.onclick=e=>{if(e.target===dlg)dlg.close()};dlg.addEventListener('close',()=>activeId=null);
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;let d=b.dataset;if(d.open)details(d.open);else if(d.close!==undefined)dlg.close();else if(d.cart){
  if(portion(d.cart)){if(dlg.open)dlg.close();page('shop',true)}
  else{setPortion(d.cart,1);if(dlg.open)details(d.cart);(dlg.open?dlg:main).querySelector(`[data-cart="${d.cart}"]`)?.focus({preventScroll:true});toast('Добавлена одна порция в список покупок')}
}else if(d.cook){let id=d.cook;state.done=state.done.includes(id)?state.done.filter(x=>x!==id):[...state.done,id];save();render();if(dlg.open)details(id);else toast(state.done.includes(id)?'Отмечено как приготовленное':'Отметка снята')}else if(d.breakfast){breakfastGroup=d.breakfast;render();main.querySelector('[data-breakfast].on').focus({preventScroll:true})}else if(d.af){afFilter=d.af;render();main.querySelector('[data-af].on').focus({preventScroll:true})}else if(d.filter){filter=d.filter;render()}else if(d.refresh!==undefined){Object.assign(state,plan.nextWeek(state.ids,state.seen));filter='Все рецепты';save();render();main.querySelector('h2').focus({preventScroll:true});main.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});toast('Новая подборка готова. Твой список покупок сохранён.')}else if(d.return!==undefined)page('recipes',true);else if(d.step){setPortion(d.id,portion(d.id)+Number(d.step))}});main.addEventListener('change',e=>{let k=e.target.dataset.item;if(k){state.checked=e.target.checked?[...state.checked,k]:state.checked.filter(x=>x!==k);save()}});render();

/* Подпись под лого по дням недели */
const dayNames=['ВОСКРЕСЕНЬЕ, МОЯ ЛЮБОВЬ','ПОНЕДЕЛЬНИК, МОЯ ЗАЙКА','ВТОРНИК, МОЁ СОЛНЫШКО','СРЕДА, МОЯ НЕЖНОСТЬ','ЧЕТВЕРГ, МОЯ РАДОСТЬ','ПЯТНИЦА, МОЯ КОРОЛЕВА','СУББОТА, МОЁ СЧАСТЬЕ'];
const brandDay=document.getElementById('brandDay');if(brandDay)brandDay.textContent=dayNames[new Date().getDay()];

/* «Закат на ГЭСе»: уютная тёмная тема в закатных цветах */
const rootEl=document.documentElement,sunsetBtn=document.getElementById('sunsetToggle'),sunsetIcon=document.getElementById('sunsetIcon'),themeMeta=document.querySelector('meta[name=theme-color]');
function applySunset(on){rootEl.classList.toggle('sunset',on);if(sunsetBtn)sunsetBtn.setAttribute('aria-pressed',String(on));if(sunsetIcon)sunsetIcon.innerHTML=icon(on?'sun':'moon');if(themeMeta)themeMeta.content=on?'#241a22':'#353e27';try{localStorage.setItem('leraSunset',on?'1':'0')}catch(e){}}
if(sunsetBtn){let on=false;try{on=localStorage.getItem('leraSunset')==='1'}catch(e){}applySunset(on);sunsetBtn.addEventListener('click',()=>applySunset(!rootEl.classList.contains('sunset')))}

/* Антидепресс-режим: десять причин, почему тебя любят */
const sos=document.getElementById('sosModal'),sosOpen=document.getElementById('sosOpen');
if(sos&&sosOpen){sosOpen.addEventListener('click',()=>sos.showModal());sos.addEventListener('click',e=>{if(e.target===sos)sos.close()})}

// Last resort if a local asset is damaged.
document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement && (e.target.closest('.photo')||e.target.closest('.modalpic')) && !e.target.dataset.fallback){e.target.dataset.fallback='true';e.target.src='assets/ink.webp';e.target.alt='Кулинарная иллюстрация'}},true);

/* «Я не знаю что приготовить»: колесо 60%, Telegram 30%, магазины по 5%. */
const fortuneModal=$('#fortuneModal'),fortuneWheel=$('#fortuneWheel'),fortuneResult=$('#fortuneResult');
let fortuneTimer;
$('#surpriseOpen').addEventListener('click',()=>{
  const url=fortune.chooseAction();
  if(url){window.location.assign(url);return}
  const {entries,winner,rotation}=fortune.spin(generalRecipes);
  clearTimeout(fortuneTimer);
  fortuneWheel.style.transition='none';
  fortuneWheel.style.transform='rotate(0deg)';
  fortuneWheel.replaceChildren(...entries.map((r,i)=>{
    const label=document.createElement('span');
    label.textContent=String(i+1);
    label.style.transform=`translate(-50%,-50%) rotate(${(i+.5)*40}deg) translateY(calc(var(--wheel-size) * -.37)) rotate(-${(i+.5)*40}deg)`;
    return label;
  }));
  fortuneResult.textContent='Колесо вращается…';
  fortuneModal.showModal();
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Фиксируем начальное состояние перед запуском CSS-перехода.
  void fortuneWheel.offsetWidth;
  fortuneWheel.style.transition=reduced?'none':'transform 4.8s cubic-bezier(.12,.7,.12,1)';
  fortuneWheel.style.transform=`rotate(${rotation}deg)`;
  fortuneTimer=setTimeout(()=>{
    if(!fortuneModal.open)return;
    const recipe=entries[winner],button=document.createElement('button');
    button.className='btn dark';
    button.textContent=`${winner+1}. ${recipe.name} — открыть рецепт`;
    button.onclick=()=>{fortuneModal.close();details(recipe.id)};
    fortuneResult.replaceChildren(button);
  },reduced?0:4900);
});
$('#fortuneClose').onclick=()=>fortuneModal.close();
fortuneModal.addEventListener('click',e=>{if(e.target===fortuneModal)fortuneModal.close()});
fortuneModal.addEventListener('close',()=>clearTimeout(fortuneTimer));
