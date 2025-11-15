// js/utils.js – Helpers (Lesson 7–12 progressively)
export const byId = (id) => document.getElementById(id);

export function formatCurrency(v, currency='VND'){
  try {
    return new Intl.NumberFormat('vi-VN', { style:'currency', currency }).format(v);
  } catch {
    return v.toLocaleString('vi-VN') + ' ₫';
  }
}

export function qs(sel, root=document){
  return root.querySelector(sel);
}

export function loadProducts(list){
  // Decorate with formatted price once to avoid recomputing
  return list.map(p => ({ ...p, priceFmt: formatCurrency(p.price) }));
}

export function getFilteredSorted(items, search='', sort='popular'){
  let out = items;
  const s = (search||'').trim().toLowerCase();
  if(s){
    out = out.filter(p => p.name.toLowerCase().includes(s) || (p.description||'').toLowerCase().includes(s));
  }
  switch(sort){
    case 'price-asc': out = [...out].sort((a,b)=> a.price - b.price); break;
    case 'price-desc': out = [...out].sort((a,b)=> b.price - a.price); break;
    case 'name-asc': out = [...out].sort((a,b)=> a.name.localeCompare(b.name,'vi')); break;
    case 'name-desc': out = [...out].sort((a,b)=> b.name.localeCompare(a.name,'vi')); break;
    default: /* popular – keep original order */ break;
  }
  return out;
}
