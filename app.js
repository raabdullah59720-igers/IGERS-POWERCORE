(function(){
'use strict';
const products=[
{id:1,name:'Italian Olive Oil',category:'Grocery',price:620,emoji:'🫒',desc:'Smooth extra-virgin olive oil for everyday cooking.',tag:'Pantry pick'},
{id:2,name:'Garden Pasta',category:'Grocery',price:180,emoji:'🍝',desc:'Comfort-food pasta for simple weeknight meals.',tag:'Bestseller'},
{id:3,name:'Citrus Biscotti',category:'Snacks',price:240,emoji:'🍪',desc:'Crisp citrus biscuits made for tea-time.',tag:'Treat'},
{id:4,name:'Honey Granola',category:'Snacks',price:310,emoji:'🥣',desc:'Toasty oats, honey and a light crunch.',tag:'New'},
{id:5,name:'Linen Dish Cloth',category:'Home',price:150,emoji:'🧺',desc:'Soft reusable cloth for everyday kitchen care.',tag:'Useful'},
{id:6,name:'Herbal Hand Wash',category:'Care',price:280,emoji:'🧴',desc:'Gentle everyday hand wash with a clean finish.',tag:'Gentle'},
{id:7,name:'Tomato Passata',category:'Grocery',price:220,emoji:'🍅',desc:'Rich tomato base for pasta, soups and sauces.',tag:'Classic'},
{id:8,name:'Lavender Soap',category:'Care',price:170,emoji:'🧼',desc:'Mild soap bar with a soft botanical feel.',tag:'Simple'}
];
let activeFilter='All';
let cart=[];
try{cart=JSON.parse(localStorage.getItem('pantry-cart')||'[]'); if(!Array.isArray(cart)) cart=[];}catch(_e){cart=[];}
const $=id=>document.getElementById(id);
function money(n){return '৳'+Number(n).toLocaleString('en-BD')}
function save(){try{localStorage.setItem('pantry-cart',JSON.stringify(cart));}catch(_e){} updateCartUI()}
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove('show'),2200)}
function renderProducts(){
 const q=($('searchInput').value||'').toLowerCase(); const sort=$('sortSelect').value;
 let list=products.filter(p=>(activeFilter==='All'||p.category===activeFilter) && (p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q)));
 if(sort==='low') list.sort((a,b)=>a.price-b.price); if(sort==='high') list.sort((a,b)=>b.price-a.price);
 $('productGrid').innerHTML=list.length?list.map(p=>`<article class="product-card"><div class="product-visual"><span class="pill">${p.tag}</span><span>${p.emoji}</span></div><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}">Add to cart</button></div></article>`).join(''):`<div class="cart-empty" style="grid-column:1/-1">No products match that search.</div>`;
 document.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',()=>add(Number(btn.dataset.add))));
}
function add(id){const item=cart.find(x=>x.id===id); if(item)item.qty++; else cart.push({id,qty:1}); save(); toast('Added to your Pantry cart');}
function change(id,delta){const item=cart.find(x=>x.id===id); if(!item)return; item.qty+=delta; if(item.qty<=0)cart=cart.filter(x=>x.id!==id); save()}
function updateCartUI(){
 const count=cart.reduce((s,x)=>s+x.qty,0); $('cartCount').textContent=count;
 if(!cart.length){$('cartItems').innerHTML='<div class="cart-empty">Your cart is waiting for a little grocery magic. ✦</div>'; $('cartTotal').textContent=money(0);return}
 $('cartItems').innerHTML=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-line"><div class="cart-thumb">${p.emoji}</div><div><strong>${p.name}</strong><small>${money(p.price)}</small><div class="qty"><button data-minus="${p.id}">−</button><span>${x.qty}</span><button data-plus="${p.id}">+</button></div></div><strong>${money(p.price*x.qty)}</strong></div>`}).join('');
 cart.forEach(x=>{});
 const total=cart.reduce((s,x)=>{const p=products.find(y=>y.id===x.id);return s+p.price*x.qty},0); $('cartTotal').textContent=money(total);
 document.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>change(Number(b.dataset.plus),1)); document.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>change(Number(b.dataset.minus),-1));
}
function openDrawer(id){$(id).classList.add('open');$('overlay').classList.add('active')}
function closeAll(){document.querySelectorAll('.drawer.open').forEach(d=>d.classList.remove('open'));$('overlay').classList.remove('active')}
function closeDrawer(id){$(id).classList.remove('open');if(!document.querySelector('.drawer.open'))$('overlay').classList.remove('active')}
function $$(sel){return document.querySelectorAll(sel)}
function init(){
 renderProducts();updateCartUI();
 document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProducts()}));
 document.querySelectorAll('.category-card').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter===activeFilter));renderProducts();$('shop').scrollIntoView({behavior:'smooth'})}));
 $('searchInput').addEventListener('input',renderProducts); $('sortSelect').addEventListener('change',renderProducts);
 $('cartBtn').onclick=()=>openDrawer('cartDrawer');$('reportBtn').onclick=()=>openDrawer('rescueDrawer');$('mapDemoBtn').onclick=()=>openDrawer('mapDrawer'); $('overlay').onclick=closeAll; document.addEventListener('keydown',e=>{if(e.key==='Escape') closeAll();});
 document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeDrawer(b.dataset.close));
 $('checkoutBtn').onclick=()=>{if(!cart.length){toast('Your cart is empty');return}toast('Checkout demo opened. Connect payment + delivery backend for production.');};
 $('rescueForm').addEventListener('submit',e=>{e.preventDefault();const report={type:$('animalType').value,location:$('animalLocation').value,notes:$('animalNotes').value,time:new Date().toISOString()};try{localStorage.setItem('pantry-last-rescue',JSON.stringify(report));}catch(_e){}e.target.reset();toast('Rescue report saved on this device');closeDrawer('rescueDrawer')});
 $('subscribeForm').addEventListener('submit',e=>{e.preventDefault();if($('emailInput').checkValidity())toast('Thanks. You are on the Pantry list.');e.target.reset()});
 $('searchBtn').onclick=()=>{$('searchInput').focus();$('shop').scrollIntoView({behavior:'smooth'})};
 $('menuBtn').onclick=()=>{const isOpen=$('desktop-nav').classList.toggle('mobile-open');$('menuBtn').setAttribute('aria-expanded',String(isOpen));};
 document.querySelectorAll('.desktop-nav a').forEach(a=>a.addEventListener('click',()=>{$('desktop-nav').classList.remove('mobile-open');$('menuBtn').setAttribute('aria-expanded','false')}));
}
init();
})();
