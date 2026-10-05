
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const CART_KEY='mbakeri_demo_cart';
let cart=JSON.parse(localStorage.getItem(CART_KEY)||'[]');
let selected=null, qty=1;
function save(){localStorage.setItem(CART_KEY,JSON.stringify(cart)); renderCart();}
function renderCart(){
 const count=cart.reduce((a,b)=>a+b.qty,0); $$('.cart-count').forEach(x=>x.textContent=count);
 const box=$('.cart-items'); if(!box)return;
 if(!cart.length){box.innerHTML='<p style="color:#777">Your order is waiting for something beautiful.</p>';}
 else box.innerHTML=cart.map((x,i)=>`<div class="cart-item"><div><strong>${x.name}</strong><br><small>${x.options||'Standard'} · Qty ${x.qty}</small></div><div>$${(x.price*x.qty).toFixed(2)}<br><button style="border:0;background:none;font-size:11px;text-decoration:underline;cursor:pointer" onclick="removeItem(${i})">remove</button></div></div>`).join('');
 const total=cart.reduce((a,b)=>a+b.price*b.qty,0); const t=$('.cart-total strong'); if(t)t.textContent='$'+total.toFixed(2);
}
window.removeItem=i=>{cart.splice(i,1);save()};
function openCart(){ $('.cart-drawer')?.classList.add('open'); document.body.classList.add('lock') }
function closeCart(){ $('.cart-drawer')?.classList.remove('open'); document.body.classList.remove('lock') }
$$('[data-cart]').forEach(b=>b.addEventListener('click',openCart)); $('.cart-close')?.addEventListener('click',closeCart);
function openProduct(el){
 const d=el.dataset; selected={name:d.name,price:+d.price,img:d.img||'',category:d.category||''}; qty=1;
 const m=$('#productModal'); if(!m)return;
 $('#modalName').textContent=selected.name; $('#modalPrice').textContent='$'+selected.price.toFixed(2); $('#modalImg').src=selected.img; $('#qtyNum').textContent=qty; m.classList.add('open'); document.body.classList.add('lock');
}
$$('[data-product]').forEach(b=>b.addEventListener('click',()=>openProduct(b)));
$('#modalClose')?.addEventListener('click',()=>{$('#productModal').classList.remove('open');document.body.classList.remove('lock')});
$('#qplus')?.addEventListener('click',()=>{$('#qtyNum').textContent=++qty}); $('#qminus')?.addEventListener('click',()=>{qty=Math.max(1,qty-1);$('#qtyNum').textContent=qty});
$('#addConfigured')?.addEventListener('click',()=>{if(!selected)return;let opts=[];$$('#productModal input:checked').forEach(x=>opts.push(x.value));cart.push({...selected,qty,options:opts.join(', ')});save();$('#productModal').classList.remove('open');openCart()});
$$('.quick-add').forEach(b=>b.addEventListener('click',()=>{cart.push({name:b.dataset.name,price:+b.dataset.price,qty:1,options:'Standard'});save();openCart()}));
$$('.filter').forEach(b=>b.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');let f=b.dataset.filter;$$('.menu-card').forEach(c=>c.style.display=(f==='all'||c.dataset.cat===f)?'block':'none')}));
$('.hamb')?.addEventListener('click',()=>$('.mobile-menu')?.classList.toggle('open'));
// Musical entrance: a small generative piano-like soundscape; user gesture is required by browsers.
let ctx, musicNodes=[], musicTimer, musicOn=false;
function tone(freq,when,dur=.9,gain=.028){
 if(!ctx)return; const o=ctx.createOscillator(), g=ctx.createGain(); o.type='sine'; o.frequency.value=freq; g.gain.setValueAtTime(0,when); g.gain.linearRampToValueAtTime(gain,when+.04); g.gain.exponentialRampToValueAtTime(.0001,when+dur); o.connect(g);g.connect(ctx.destination);o.start(when);o.stop(when+dur+.05); musicNodes.push(o,g);
}
function phrase(){if(!musicOn||!ctx)return;const now=ctx.currentTime+.03, notes=[261.63,329.63,392,493.88,440,349.23,293.66,392];notes.forEach((n,i)=>tone(n,now+i*.42,.8,i%3===0?.026:.018));musicTimer=setTimeout(phrase,3900)}
function startMusic(){if(musicOn)return;ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();ctx.resume();musicOn=true;phrase();updateSound()}
function stopMusic(){musicOn=false;clearTimeout(musicTimer);if(ctx){musicNodes.forEach(n=>{try{n.disconnect()}catch(e){}});musicNodes=[]}updateSound()}
function updateSound(){$$('.sound').forEach(x=>x.textContent=musicOn?'Ⅱ':'♪')}
$$('.sound').forEach(b=>b.addEventListener('click',()=>musicOn?stopMusic():startMusic()));
$('#enterSound')?.addEventListener('click',()=>{startMusic();$('.entry').classList.add('hide');sessionStorage.setItem('entered','1')});
$('#enterQuiet')?.addEventListener('click',()=>{$('.entry').classList.add('hide');sessionStorage.setItem('entered','1')});
if(sessionStorage.getItem('entered')) $('.entry')?.classList.add('hide');
renderCart();

// ===== MILA CONCIERGE =====
(()=>{
 const PRODUCTS=[
  {id:'pistachio',name:'Pistachio Croissant',price:8.5,cat:'pastry',img:'https://goldenrooster.tw/images/products/GR-CRO-005/1.webp',desc:'A flaky European-style croissant with pistachio richness.',tags:['pistachio','croissant','pastry','european','sweet']},
  {id:'berry',name:'Triple Berry Cream Cheese Tart',price:7.5,cat:'pastry',img:'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2016/8/16/2/FNK_Cream-Cheese-Frosting-Fruit-Tart_s4x3.jpg.rend.hgtvcom.1280.960.85.suffix/1471413929082.webp',desc:'Bright berries, cream cheese and crisp pastry.',tags:['berry','tart','pastry','sweet','fruit']},
  {id:'lorraine',name:'Quiche Lorraine',price:10,cat:'savory',img:'https://www.lefrenchdad.com/uploads/1/3/0/0/130053620/s479930575622745973_p57_i2_w869.png?optimize=medium&width=2400',desc:'The French classic: rich custard, bacon and flaky pastry.',tags:['quiche','lorraine','savory','french','breakfast','lunch']},
  {id:'medquiche',name:'Mediterranean Quiche',price:10,cat:'savory',img:'https://www.lefrenchdad.com/uploads/1/3/0/0/130053620/s479930575622745973_p57_i2_w869.png?optimize=medium&width=2400',desc:'A lighter savory quiche with Mediterranean character.',tags:['quiche','mediterranean','savory','vegetarian','lunch']},
  {id:'brownie',name:'Cardamom & Pecan Fudge Brownie',price:6.5,cat:'sweet',img:'https://i.pinimg.com/736x/6a/9f/4a/6a9f4a4a9e4f3a26e070180624772d08.jpg',desc:'Deep chocolate with cardamom perfume and pecan crunch.',tags:['brownie','chocolate','cardamom','pecan','sweet']},
  {id:'lemon',name:'Meyer Lemon Loaf',price:6.5,cat:'sweet',img:'https://substackcdn.com/image/fetch/%24s_%21RzCY%21%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F375d5a59-ecdf-47bb-ae71-23024a0f3fdc_1004x1017.jpeg',desc:'Bright citrus, tender crumb and a polished tea-cake feel.',tags:['lemon','loaf','cake','sweet','tea']},
  {id:'latte',name:'Latte',price:7,cat:'coffee',img:'https://www.macc-cino.com/assets/bakery/cup_pastry.png',desc:'Espresso and steamed milk, made to order.',tags:['latte','coffee','espresso','drink']},
  {id:'cappuccino',name:'Cappuccino',price:6,cat:'coffee',img:'https://www.macc-cino.com/assets/bakery/cup_pastry.png',desc:'Espresso with a classic cap of textured milk.',tags:['cappuccino','coffee','espresso','drink']},
  {id:'coldbrew',name:'Cold Brew',price:6,cat:'coffee',img:'https://www.macc-cino.com/assets/bakery/cup_pastry.png',desc:'Cold, smooth coffee for a Florida afternoon.',tags:['cold brew','coffee','iced','drink']},
  {id:'earlgrey',name:'Earl Grey Tea Cake',price:48,cat:'cake',img:'https://static.y-mart.de/media/975f1dc9f9c47163346ea16c540aae50/2113375000006-800.webp',desc:'A signature celebration cake with Earl Grey and Parisian-style buttercream.',tags:['earl grey','cake','birthday','celebration','european','buttercream']},
  {id:'wrap',name:'Italian + Mediterranean Wrap',price:13,cat:'savory',img:'https://s6.localdatacdn.com/images/9691170/m_mbakeri_photo.jpg?q=69c1695acc6fa',desc:'A savory lunch option with Mediterranean influence.',tags:['wrap','italian','mediterranean','savory','lunch']},
  {id:'goddess',name:'Tropical Green Goddess',price:9.5,cat:'smoothie',img:'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1200&q=85',desc:'A bright tropical green smoothie.',tags:['smoothie','green','tropical','healthy','drink']}
 ];
 const PAIR={pistachio:'cappuccino',berry:'latte',lorraine:'cappuccino',brownie:'coldbrew',lemon:'latte',wrap:'coldbrew'};
 const byId=Object.fromEntries(PRODUCTS.map(p=>[p.id,p]));
 let greeted=false,lastSuggestion=null;

 function money(n){return '$'+Number(n).toFixed(2).replace('.00','')}
 function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
 function addMilaItem(p,q=1){
   cart.push({name:p.name,price:p.price,qty:q,options:'Selected by Mila'});
   save();
 }
 function productCard(p){
   return '<div class="mila-product"><img src="'+esc(p.img)+'" alt=""><div><b>'+esc(p.name)+'</b><br><span>'+money(p.price)+'</span></div></div>';
 }
 function chips(items){return '<div class="mila-chips">'+items.map(x=>'<button class="mila-chip" data-mila-action="'+esc(x.a)+'">'+esc(x.l)+'</button>').join('')+'</div>'}
 function bot(html,opts=[]){
   const box=document.getElementById('milaMessages'); if(!box)return;
   const typing=document.createElement('div');typing.className='mila-msg bot mila-typing';typing.innerHTML='<i></i><i></i><i></i>';box.appendChild(typing);box.scrollTop=box.scrollHeight;
   setTimeout(()=>{typing.remove();const m=document.createElement('div');m.className='mila-msg bot';m.innerHTML=html;box.appendChild(m);if(opts.length){const wrap=document.createElement('div');wrap.innerHTML=chips(opts);box.appendChild(wrap.firstChild)}box.scrollTop=box.scrollHeight},380);
 }
 function me(t){const box=document.getElementById('milaMessages');const m=document.createElement('div');m.className='mila-msg me';m.textContent=t;box.appendChild(m);box.scrollTop=box.scrollHeight}
 function findProduct(t){
   let best=null,score=0;
   PRODUCTS.forEach(p=>{p.tags.concat([p.name.toLowerCase()]).forEach(k=>{if(t.includes(k)&&k.length>score){best=p;score=k.length}})});
   return best;
 }
 function recommend(list,intro){
   bot(intro+'<br>'+list.map(p=>'• <b>'+esc(p.name)+'</b> — '+money(p.price)).join('<br>'),list.slice(0,3).map(p=>({l:'Add '+p.name,a:'add:'+p.id})));
 }
 function currentHoursText(){
   const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',hour:'numeric',minute:'2-digit',hour12:false}).formatToParts(new Date());
   const day=parts.find(x=>x.type==='weekday')?.value||'';
   const h=+(parts.find(x=>x.type==='hour')?.value||0),m=+(parts.find(x=>x.type==='minute')?.value||0),mins=h*60+m;
   const hours={Wed:[450,900],Thu:[450,900],Fri:[450,900],Sat:[450,900],Sun:[480,840]};
   const r=hours[day];
   if(r&&mins>=r[0]&&mins<r[1]) return 'M Bakeri should be open now. Today’s posted closing time is '+(r[1]===900?'3:00 PM':'2:00 PM')+'.';
   return 'Posted hours are Wednesday–Saturday 7:30 AM–3:00 PM and Sunday 8:00 AM–2:00 PM; closed Monday and Tuesday.';
 }
 function go(page){
   const current=location.pathname.split('/').pop()||'index.html';
   if(current===page){window.scrollTo({top:0,behavior:'smooth'})}else location.href=page;
 }
 function handle(raw){
   const t=raw.toLowerCase().trim(); if(!t)return;
   if(t.startsWith('add:')){const p=byId[t.split(':')[1]];if(p){addMilaItem(p);lastSuggestion=null;const pair=byId[PAIR[p.id]];bot('Done — <b>'+esc(p.name)+'</b> is in your order.'+(pair?' Chris-style pairing: '+esc(pair.name)+'.':''),pair?[{l:'Add '+pair.name,a:'add:'+pair.id},{l:'View order',a:'cart'}]:[{l:'View order',a:'cart'}]);}return}
   if(t==='cart'){closeMila();openCart();return}
   if(t==='order'){location.href='order.html';return}
   if(t==='cakes'){location.href='cakes.html';return}
   if(t==='catering'){location.href='catering.html';return}
   if(t==='story'){location.href='story.html';return}
   if(/^(yes|yeah|yep|sure|okay|ok|please)/.test(t)&&lastSuggestion){handle('add:'+lastSuggestion);return}
   const p=findProduct(t);
   const wants=/(add|order|get|want|take|give me|i'll have|i would like|grab)/.test(t);
   if(p&&wants){addMilaItem(p);bot('Added <b>'+esc(p.name)+'</b> to your order.',[{l:'View order',a:'cart'},{l:'Keep exploring',a:'popular'}]);return}
   if(/(allerg|allergy|celiac|peanut|nut|dairy free|egg free)/.test(t)){bot("For a serious allergy, please speak directly with the bakery before ordering because a shared bakery kitchen can involve cross-contact. Call <a href='tel:+17724928526'>(772) 492-8526</a>.");return}
   if(/(hour|open|close|when)/.test(t)){bot(currentHoursText(),[{l:'Start an order',a:'order'}]);return}
   if(/(where|address|location|direction|park)/.test(t)){bot("M Bakeri is at <b>2060 6th Avenue, Vero Beach, Florida</b>. <a href='https://www.google.com/maps/search/?api=1&query=2060+6th+Avenue+Vero+Beach+FL' target='_blank' rel='noopener'>Open directions</a>.");return}
   if(/(owner|founder|chris|story|who made|who owns)/.test(t)){bot("M Bakeri is Chris Foster’s creative world — travel, art, entertainment and European food culture brought together in a Vero Beach bakery.",[{l:'Meet Chris',a:'story'},{l:'Chris-style favorites',a:'popular'}]);return}
   if(/(music|song|sound|playing)/.test(t)){bot("Music is part of the M Bakeri entrance on purpose. Chris came from live entertainment, so the site treats the arrival like part of the show. Use the ♪ control in the header any time.");return}
   if(/(cater|catering|office|event|party|wedding|group)/.test(t)){bot("I can help start a catering request for breakfast, pastry, lunch or a celebration. The full demo inquiry is ready on the catering page.",[{l:'Plan catering',a:'catering'},{l:'Celebration cake',a:'cakes'}]);return}
   if(/(cake|birthday|anniversary|celebration|custom cake)/.test(t)&&!p){bot("For the most M Bakeri choice, start with the <b>Earl Grey Tea Cake with Parisian-style buttercream</b>. Custom cakes deserve their own conversation, so I can take you to the cake studio.",[{l:'Explore custom cakes',a:'cakes'},{l:'Add Earl Grey cake',a:'add:earlgrey'}]);return}
   if(/(europe|european|french|paris|signature|statement)/.test(t)){recommend([byId.lorraine,byId.pistachio,byId.earlgrey],'For the most European side of Chris’s collection, start here:');return}
   if(/(coffee|latte|cappuccino|espresso|caffeine|drink)/.test(t)&&!p){recommend([byId.cappuccino,byId.latte,byId.coldbrew],'For coffee, these fit the bakery best:');return}
   if(/(sweet|dessert|pastry|treat|chocolate|croissant)/.test(t)&&!p){recommend([byId.pistachio,byId.berry,byId.brownie],'Something sweet? These are a good introduction to the case:');return}
   if(/(savory|savoury|lunch|breakfast|hungry|quiche|meal)/.test(t)&&!p){recommend([byId.lorraine,byId.medquiche,byId.wrap],'For something savory:');return}
   if(/(popular|favorite|favourite|best|recommend|suggest|surprise|what should)/.test(t)){recommend([byId.pistachio,byId.lorraine,byId.earlgrey],'From Chris’s current edit, I’d start here:');return}
   if(/(deliver|delivery|ship|shipping|doordash|uber)/.test(t)){bot("This concept is set up around <b>pickup ordering</b>. Delivery can be integrated later if the bakery chooses a delivery provider.",[{l:'Order for pickup',a:'order'}]);return}
   if(/(pickup|pick up|ready|how long)/.test(t)){bot("The production version can show real preparation times and available pickup slots. In this demo, ordering is presented as pickup-first.",[{l:'Start an order',a:'order'}]);return}
   if(/(hi|hello|hey|bonjour|good morning|good afternoon)/.test(t)){bot("Bonjour. Tell me what mood you’re in — <b>European pastry, savory, coffee, or celebration?</b>",[{l:'European pastry',a:'european'},{l:'Savory',a:'savory'},{l:'Coffee',a:'coffee'}]);return}
   if(/(thank|thanks|merci)/.test(t)){bot("Avec plaisir. I’m here whenever another craving appears.");return}
   if(p){lastSuggestion=p.id;bot(productCard(p)+'<div style="margin-top:8px">'+esc(p.desc)+'</div>',[{l:'Add to order',a:'add:'+p.id},{l:'Something similar',a:p.cat}]);return}
   bot("I can help you discover the European menu, choose coffee and pastry pairings, learn about Chris, plan cakes or catering, check hours, or build an order.",[{l:"Chris's picks",a:'popular'},{l:'European favorites',a:'european'},{l:'Custom cake',a:'cakes'},{l:'Hours',a:'hours'}]);
 }
 function openMila(){
   document.getElementById('milaChat')?.classList.add('open');
   document.getElementById('milaLaunch').style.display='none';
   document.getElementById('milaTeaser')?.classList.remove('show');
   if(!greeted){greeted=true;bot("Bonjour, I’m <b>Mila</b>, your M Bakeri concierge. I know <b>Chris’s Edit</b> and can guide you through the collection the way a stylist would: signature pastry, savory, coffee, cakes, or a pairing.",[{l:"Chris's picks",a:'popular'},{l:'European pastry',a:'european'},{l:'I need coffee',a:'coffee'}]);}
   setTimeout(()=>document.getElementById('milaInput')?.focus(),80);
 }
 function closeMila(){document.getElementById('milaChat')?.classList.remove('open');document.getElementById('milaLaunch').style.display='flex'}
 function init(){
   if(document.getElementById('milaLaunch'))return;
   document.body.insertAdjacentHTML('beforeend',
    '<div class="mila-launch" id="milaLaunch">'+
      '<div class="mila-teaser" id="milaTeaser"><button aria-label="Dismiss">×</button><span>Not sure where to start? I can show you the most European things in the case.</span></div>'+
      '<button class="mila-button" id="milaOpen"><span class="mila-avatar">M</span><span class="label">Ask Mila</span></button>'+
    '</div>'+
    '<section class="mila-chat" id="milaChat" aria-label="Mila bakery concierge">'+
      '<div class="mila-head"><span class="mila-avatar">M</span><div class="mila-head-copy"><strong>Mila</strong><small>M Bakeri · digital concierge</small></div><button class="mila-close" id="milaClose" aria-label="Close">×</button></div>'+
      '<div class="mila-messages" id="milaMessages"></div>'+
      '<form class="mila-form" id="milaForm"><input id="milaInput" autocomplete="off" placeholder="Ask about pastries, coffee, cakes…"><button>Send</button></form>'+
      '<div class="mila-note">Demo concierge · production AI would use a secure server-side connection.</div>'+
    '</section>');
   document.getElementById('milaOpen').onclick=openMila;
   document.getElementById('milaClose').onclick=closeMila;
   document.querySelector('#milaTeaser button').onclick=e=>{e.stopPropagation();document.getElementById('milaTeaser').classList.remove('show')};
   document.getElementById('milaTeaser').onclick=openMila;
   document.getElementById('milaForm').onsubmit=e=>{e.preventDefault();const inp=document.getElementById('milaInput');const v=inp.value.trim();if(!v)return;me(v);inp.value='';handle(v)};
   document.getElementById('milaMessages').addEventListener('click',e=>{const b=e.target.closest('[data-mila-action]');if(!b)return;const a=b.dataset.milaAction;me(b.textContent);handle(a)});
   setTimeout(()=>{if(!greeted)document.getElementById('milaTeaser')?.classList.add('show')},6500);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
 window.openMila=openMila;
})();
