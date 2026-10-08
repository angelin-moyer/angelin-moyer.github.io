(function(){
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced)return;
 document.documentElement.classList.add('js-motion');
 const targets=document.querySelectorAll('main .section:not(.hero) .section-index, main .section:not(.hero) .section-intro, .triad article, .principle-list > div, .work-row, .project-gallery a, .tool-grid > div, .time-item, .contact-inner');
 targets.forEach((el,i)=>{el.classList.add('reveal');const parent=el.parentElement;let siblings=Array.from(parent.children).filter(n=>n.matches('article,.work-row,.time-item,.project-gallery a,.tool-grid > div,.principle-list > div'));if(siblings.length>1)el.style.setProperty('--delay',Math.min(siblings.indexOf(el),6)*75+'ms')});
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.12,rootMargin:'0px 0px -35px 0px'});
 targets.forEach(t=>observer.observe(t));
 let ticking=false;
 function progress(){const total=document.documentElement.scrollHeight-innerHeight;const v=total>0?(scrollY/total)*100:0;document.body.style.setProperty('--reading-progress',Math.max(0,Math.min(100,v))+'%');ticking=false}
 addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(progress);ticking=true}},{passive:true});
 addEventListener('resize',progress);progress();
})();
