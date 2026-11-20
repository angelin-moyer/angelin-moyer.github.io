(function(){
 const stage=document.getElementById('world-stage');if(!stage)return;
 const mascot=document.getElementById('tiny-mascot');
 const buttons=Array.from(stage.querySelectorAll('.world-object'));
 const note=document.getElementById('world-reveal');
 let navigating=false;
 function go(button){
  if(navigating)return;
  const destination=document.getElementById(button.dataset.destination);if(!destination)return;
  navigating=true;
  buttons.forEach(b=>b.classList.toggle('is-active',b===button));
  const target=button.getBoundingClientRect(),m=mascot.getBoundingClientRect();
  const x=target.left+target.width/2-(m.left+m.width/2);
  const y=target.top+target.height/2-(m.top+m.height/2);
  mascot.style.transform='translate('+x+'px,'+y+'px) scale(1.08)';
  mascot.classList.remove('is-hopping');void mascot.offsetWidth;mascot.classList.add('is-hopping');
  if(note){note.innerHTML='<span class="reveal-kicker">FOLLOW ME ↗</span><strong>On our way!</strong><p>Taking you to '+button.querySelector('.object-name').textContent.toLowerCase()+'.</p>';note.classList.add('is-open');}
  window.setTimeout(function(){
   destination.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
   history.replaceState(null,'','#'+destination.id);
   window.setTimeout(function(){mascot.style.transform='translate(0,0) scale(1)';mascot.classList.remove('is-hopping');if(note)note.classList.remove('is-open');navigating=false;},850);
  },560);
 }
 buttons.forEach(button=>button.addEventListener('click',function(){go(button);}));
})();