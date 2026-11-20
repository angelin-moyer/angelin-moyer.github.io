(function(){
 const stage=document.getElementById('world-stage');if(!stage)return;
 const mascot=document.getElementById('tiny-mascot');
 const buttons=Array.from(stage.querySelectorAll('.world-object'));
 let navigating=false;
 let guideAway=false;
 function returnGuideHome(){
  if(!guideAway)return;
  stage.appendChild(mascot);
  mascot.classList.remove('guide-companion','is-travelling','is-hopping');
  mascot.style.transform='';
  mascot.querySelector('span').textContent="hi! I'm your guide ♡";
  guideAway=false;
 }
 function checkHome(){
  if(guideAway&&!navigating&&window.scrollY<90)returnGuideHome();
 }
 function go(button){
  if(navigating)return;
  const destination=document.getElementById(button.dataset.destination);if(!destination)return;
  navigating=true;guideAway=true;
  if(mascot.parentElement!==stage){stage.appendChild(mascot);}
  mascot.classList.remove('guide-companion','is-travelling');
  mascot.style.transform='';
  buttons.forEach(b=>b.classList.toggle('is-active',b===button));
  const target=button.getBoundingClientRect(),m=mascot.getBoundingClientRect();
  const x=target.left+target.width/2-(m.left+m.width/2);
  const y=target.top+target.height/2-(m.top+m.height/2);
  mascot.style.transform='translate('+x+'px,'+y+'px) scale(1.08)';
  mascot.classList.remove('is-hopping');void mascot.offsetWidth;mascot.classList.add('is-hopping');
  mascot.querySelector('span').textContent='this way!';
  window.setTimeout(function(){
   mascot.classList.remove('is-hopping');
   const current=mascot.getBoundingClientRect();
   document.body.appendChild(mascot);
   mascot.classList.add('is-travelling');
   mascot.style.left='';mascot.style.top='';
   mascot.style.transform='';
   destination.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
   history.replaceState(null,'','#'+destination.id);
   let finished=false;
   const finish=function(){
    if(finished)return;finished=true;
    mascot.classList.remove('is-travelling');mascot.classList.add('guide-companion');
    mascot.style.transform='';
    mascot.querySelector('span').textContent='we made it!';
    navigating=false;checkHome();
   };
   if('onscrollend' in window){window.addEventListener('scrollend',finish,{once:true});window.setTimeout(finish,1800);}
   else window.setTimeout(finish,1500);
  },420);
 }
 buttons.forEach(button=>button.addEventListener('click',function(){go(button);}));
 window.addEventListener('scroll',checkHome,{passive:true});
})();
