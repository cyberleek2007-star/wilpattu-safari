const IMG={
 hero:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Beauty%20of%20Wilpattu%20National%20Park.jpg',
 landscape:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Beauty%20of%20Wilpattu%20National%20Park.jpg',
 leopard:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sri%20Lankan%20leopard%20%28Panthera%20pardus%20kotiya%29%20at%20Wilpattu%20National%20Park.jpg',
 bear:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sri%20Lankan%20sloth%20bear%20photographed%20in%20Wilpattu%20National%20Park.jpg',
 elephant:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Elefant%20in%20Wilpattu%20National%20Park%20Sri%20Lanka.jpg',
 buffalo:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Water%20Buffalo%20at%20Wilpattu%20National%20Park.jpg',
 deer:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Deer%2CWilpattu%20National%20Park%2C%20Sri%20Lanka.jpg'
};

document.addEventListener('DOMContentLoaded',()=>{
 const nav=document.getElementById('nav');
 const onScroll=()=>nav&&nav.classList.toggle('scrolled',scrollY>35);
 window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
 const menu=document.getElementById('menu'),links=document.getElementById('navLinks');
 if(menu&&links)menu.onclick=()=>links.classList.toggle('open');
 const obs='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12}):null;
 document.querySelectorAll('.reveal').forEach(x=>obs?obs.observe(x):x.classList.add('visible'));
 document.querySelectorAll('[data-package]').forEach(a=>a.addEventListener('click',()=>localStorage.setItem('wilpattuSelectedPackage',a.dataset.package||'')));
 document.querySelectorAll('.nav-links a').forEach(a=>{if(a.pathname===location.pathname)a.classList.add('current')});
 addWhatsApp(); addLightbox();
});

function addWhatsApp(){
 if(document.querySelector('.whatsapp-float'))return;
 const a=document.createElement('a');a.className='whatsapp-float';a.href='https://wa.me/94773523762';a.target='_blank';a.rel='noopener';a.setAttribute('aria-label','Chat on WhatsApp');a.textContent='WA';document.body.appendChild(a);
}
function addLightbox(){
 const figures=[...document.querySelectorAll('.gallery figure')];if(!figures.length)return;
 const box=document.createElement('div');box.className='lightbox';box.innerHTML='<button aria-label="Close">×</button><img alt="Wilpattu image"><small>Wilpattu · Elishah Rides</small>';document.body.appendChild(box);
 const img=box.querySelector('img'); const close=()=>box.classList.remove('open'); box.querySelector('button').onclick=close; box.onclick=e=>{if(e.target===box)close()};
 figures.forEach(f=>f.addEventListener('click',()=>{const source=f.querySelector('img');if(!source)return;img.src=source.src;img.alt=source.alt;box.classList.add('open')}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
}
function saveBooking(data){const items=JSON.parse(localStorage.getItem('wilpattuBookings')||'[]');data.id='WS-'+Date.now();data.createdAt=new Date().toISOString();data.status='Pending';items.unshift(data);localStorage.setItem('wilpattuBookings',JSON.stringify(items));return data.id;}
function whatsappBooking(data){const text=`Wilpattu Safari Booking Request\nReference: ${data.id}\nPackage: ${data.package}\nDate: ${data.date}\nGuests: ${data.guests}\nPickup: ${data.pickup}\nName: ${data.name}\nWhatsApp: ${data.whatsapp}\nEmail: ${data.email||'-'}\nNotes: ${data.notes||'-'}`;location.href='https://wa.me/94773523762?text='+encodeURIComponent(text);}
