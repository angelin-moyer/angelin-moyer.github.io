(() => {
  const hero = document.querySelector(".hero");
  const visual = document.querySelector(".network-visual");
  const svg = document.querySelector(".interface-network");
  if (!hero || !visual || !svg) return;

  // Start the headline reveal after the page has had a frame to paint.
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("hero-ready")));

  const ns = "http://www.w3.org/2000/svg";
  const points = [
    {x:92,y:112,r:5},{x:190,y:55,r:3},{x:320,y:75,r:6},
    {x:405,y:165,r:4},{x:390,y:315,r:6},{x:290,y:410,r:3},
    {x:115,y:370,r:5},{x:48,y:245,r:3},{x:235,y:240,r:5,core:true},
    {x:150,y:190,r:3},{x:330,y:220,r:4},{x:210,y:350,r:3}
  ];
  const links = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[0,9],[9,8],[8,10],[10,3],[8,11],[11,6],[1,9],[2,10],[4,10],[5,11]];
  const lineEls = [];
  const nodeEls = [];

  links.forEach(([a,b], index) => {
    const path = document.createElementNS(ns,"path");
    path.setAttribute("class","network-link");
    path.style.animationDelay = (index * -0.7) + "s";
    svg.appendChild(path);
    lineEls.push({element:path,a,b});
  });
  points.forEach((point) => {
    const circle = document.createElementNS(ns,"circle");
    circle.setAttribute("r",point.r);
    circle.setAttribute("class","network-node" + (point.core ? " core" : point.r >= 5 ? " large" : ""));
    svg.appendChild(circle);
    nodeEls.push({element:circle,...point,xNow:point.x,yNow:point.y});
  });

  let pointer = null;
  let frame = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  function draw() {
    frame = 0;
    let moving = false;
    const rect = visual.getBoundingClientRect();
    const sx = 480 / rect.width;
    const sy = 480 / rect.height;
    const px = pointer ? (pointer.x - rect.left) * sx : -1000;
    const py = pointer ? (pointer.y - rect.top) * sy : -1000;

    nodeEls.forEach((node) => {
      let tx = node.x;
      let ty = node.y;
      if (pointer && finePointer && !reducedMotion) {
        const dx = node.x - px;
        const dy = node.y - py;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 125 && d > 0) {
          const force = (1 - d/125) * 13;
          tx += dx/d * force;
          ty += dy/d * force;
        }
      }
      node.xNow += (tx-node.xNow)*.16;
      node.yNow += (ty-node.yNow)*.16;
      if (Math.abs(tx-node.xNow)>.2 || Math.abs(ty-node.yNow)>.2) moving = true;
      node.element.setAttribute("cx",node.xNow);
      node.element.setAttribute("cy",node.yNow);
    });
    lineEls.forEach((line) => {
      const a=nodeEls[line.a], b=nodeEls[line.b];
      const mx=(a.xNow+b.xNow)/2, my=(a.yNow+b.yNow)/2;
      const bend=(line.a+line.b)%2===0 ? -13 : 13;
      line.element.setAttribute("d", "M "+a.xNow+" "+a.yNow+" Q "+(mx+bend)+" "+(my-bend)+" "+b.xNow+" "+b.yNow);
    });
    if (!reducedMotion && (pointer || moving)) frame=requestAnimationFrame(draw);
  }
  function move(event) {
    pointer={x:event.clientX,y:event.clientY};
    if (!frame) frame=requestAnimationFrame(draw);
  }
  function leave() {
    pointer=null;
    if (!frame) frame=requestAnimationFrame(draw);
  }
  visual.addEventListener("pointermove",move);
  visual.addEventListener("pointerleave",leave);
  draw();
})();