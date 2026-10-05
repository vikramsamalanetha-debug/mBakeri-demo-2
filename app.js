
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
