(function(){
 const stage=document.getElementById('world-stage');if(!stage)return;
 const mascot=document.getElementById('tiny-mascot');
 const buttons=Array.from(stage.querySelectorAll('.world-object'));
 let navigating=false;
 function go(button){
  if(navigating)return;
  const destination=document.getElementById(button.dataset.destination);if(!destination)return;
  navigating=true;
  if(mascot.parentElement!==stage){stage.appendChild(mascot);mascot.classList.remove('guide-companion');mascot.style.transform='';}
  buttons.forEach(b=>b.classList.toggle('is-active',b===button));
  const target=button.getBoundingClientRect(),m=mascot.getBoundingClientRect();
  const x=target.left+target.width/2-(m.left+m.width/2);
  const y=target.top+target.height/2-(m.top+m.height/2);
  mascot.style.transform='translate('+x+'px,'+y+'px) scale(1.08)';
  mascot.classList.remove('is-hopping');void mascot.offsetWidth;mascot.classList.add('is-hopping');
  mascot.querySelector('span').textContent='this way!';
  window.setTimeout(function(){
   destination.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
   history.replaceState(null,'','#'+destination.id);
   window.setTimeout(function(){
    destination.appendChild(mascot);mascot.classList.add('guide-companion');
    mascot.classList.remove('is-hopping');mascot.style.transform='';
    mascot.querySelector('span').textContent='we made it!';navigating=false;
   },850);
  },420);
 }
 buttons.forEach(button=>button.addEventListener('click',function(){go(button);}));
})();