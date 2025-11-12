// js/cart.js – localStorage-based cart with demo seeding (Lesson 11 + Lesson 13 tweaks)
const KEY = 'fe_cart_v1';
const SEEDED = 'fe_cart_seeded';

function read(){
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function write(cart){ localStorage.setItem(KEY, JSON.stringify(cart)); }

export function getCart(){ return read(); }

export function addToCart(id, qty=1){
  const cart = read();
  const i = cart.findIndex(x => String(x.id)===String(id));
  if(i>=0) cart[i].qty += qty;
  else cart.push({ id, qty });
  write(cart);
}

export function updateQty(id, qty){
  const cart = read();
  const i = cart.findIndex(x => String(x.id)===String(id));
  if(i>=0){
    cart[i].qty = qty;
    if(cart[i].qty <= 0){ cart.splice(i,1); }
    write(cart);
  }
}

export function removeItem(id){
  const cart = read().filter(x => String(x.id)!==String(id));
  write(cart);
}

export function clearCart(){ write([]); }

export function cartTotal(products){
  const cart = read();
  return cart.reduce((sum, item) => {
    const p = products.find(x => String(x.id)===String(item.id));
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

export function initCartCount(){
  const count = read().reduce((s,i)=> s + i.qty, 0);
  const targets = document.querySelectorAll('#cart-count');
  targets.forEach(t => t.textContent = count);
}

// Seed demo cart once so first-time students see data on cart page
export function seedDemoCart(products){
  if(localStorage.getItem(SEEDED)) return;
  const current = read();
  if(current.length === 0 && Array.isArray(products) && products.length){
    const demo = products.slice(0,2).map(p => ({ id: p.id, qty: 1 }));
    write(demo);
  }
  localStorage.setItem(SEEDED, '1');
}
