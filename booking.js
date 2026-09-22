document.addEventListener('DOMContentLoaded',()=>{
  const f=document.getElementById('bookingForm');
  if(!f)return;

  const packages={
    'Half-Safari (Morning)':{time:'6:00 AM – 10:00 AM',duration:'4 hours',price:'PRICE PENDING',note:'Breakfast included · Hotel pickup & drop-off around Anuradhapura'},
    'Half-Safari (Evening)':{time:'2:00 PM – 6:00 PM',duration:'4 hours',price:'PRICE PENDING',note:'Hotel pickup & drop-off around Anuradhapura'},
    'Full Safari':{time:'Morning – Evening',duration:'Full safari',price:'PRICE PENDING',note:'Park entry ticket is purchased separately by the guest'}
  };

  const select=document.getElementById('package');
  const summary=document.getElementById('selectedPackageSummary');
  const packageName=document.getElementById('selectedPackageName');
  const packageTime=document.getElementById('selectedPackageTime');
  const packageDuration=document.getElementById('selectedPackageDuration');
  const packagePrice=document.getElementById('selectedPackagePrice');
  const packageNote=document.getElementById('selectedPackageNote');

  function showPackage(name){
    const p=packages[name];
    if(!p)return;
    select.value=name;
    packageName.textContent=name;
    packageTime.textContent=p.time;
    packageDuration.textContent=p.duration;
    packagePrice.textContent=p.price;
    packageNote.textContent=p.note;
    summary.hidden=false;
  }

  const requested=new URLSearchParams(location.search).get('package');
  if(requested && packages[requested]) showPackage(requested);
  else if(localStorage.getItem('wilpattuSelectedPackage') && packages[localStorage.getItem('wilpattuSelectedPackage')]) showPackage(localStorage.getItem('wilpattuSelectedPackage'));

  select.addEventListener('change',()=>{
    if(select.value){localStorage.setItem('wilpattuSelectedPackage',select.value);showPackage(select.value)}
    else summary.hidden=true;
  });

  f.addEventListener('submit',e=>{
    e.preventDefault();
    if(!select.value){select.focus();return;}
    const data={
      package:select.value,
      date:document.getElementById('date').value,
      guests:document.getElementById('guests').value,
      pickup:document.getElementById('pickup').value,
      name:document.getElementById('name').value,
      whatsapp:document.getElementById('whatsapp').value,
      email:document.getElementById('email').value,
      notes:document.getElementById('notes').value
    };
    const ref=saveBooking(data);data.id=ref;
    const s=document.getElementById('success');
    s.style.display='block';
    s.innerHTML='<strong>Booking request created: '+ref+'</strong><br>Your request is ready. Opening WhatsApp next…';
    setTimeout(()=>whatsappBooking(data),650);
  });
});
