(() => {
  const grid = document.querySelector(".interactive-grid");
  const visual = document.querySelector(".grid-visual");
  if (!grid || !visual) return;
  const ns = "http://www.w3.org/2000/svg";
  const count = 9;
  const spacing = 52;
  const points = [];
  const lines = [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  function makeLine(a, b) {
    const line = document.createElementNS(ns, "line");
    line.setAttribute("class", "grid-links");
    grid.appendChild(line);
    lines.push({ element: line, a, b });
  }
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      const circle = document.createElementNS(ns, "circle");
      circle.setAttribute("class", "grid-point");
      circle.setAttribute("r", (row + col) % 4 === 0 ? "3.2" : "2.2");
      grid.appendChild(circle);
      points.push({ element: circle, x: 16 + col * spacing, y: 16 + row * spacing, xNow: 16 + col * spacing, yNow: 16 + row * spacing });
    }
  }
  points.forEach((point, index) => {
    const row = Math.floor(index / count);
    const col = index % count;
    if (col < count - 1) makeLine(index, index + 1);
    if (row < count - 1) makeLine(index, index + count);
  });
  let pointer = null;
  let frame = 0;
  function render() {
    let unsettled = false;
    frame = 0;
    const rect = visual.getBoundingClientRect();
    const scaleX = 480 / rect.width;
    const scaleY = 480 / rect.height;
    const px = pointer ? (pointer.x - rect.left) * scaleX : -1000;
    const py = pointer ? (pointer.y - rect.top) * scaleY : -1000;
    points.forEach((point) => {
      let dx = 0;
      let dy = 0;
      if (pointer && finePointer && !reducedMotion) {
        const vx = point.x - px;
        const vy = point.y - py;
        const distance = Math.sqrt(vx * vx + vy * vy);
        const radius = 112;
        if (distance < radius && distance > 0) {
          const strength = (1 - distance / radius) * 17;
          dx = (vx / distance) * strength;
          dy = (vy / distance) * strength;
        }
      }
      const targetX = point.x + dx;
      const targetY = point.y + dy;
      point.xNow += (targetX - point.xNow) * 0.22;
      point.yNow += (targetY - point.yNow) * 0.22;
      if (Math.abs(targetX - point.xNow) > 0.25 || Math.abs(targetY - point.yNow) > 0.25) unsettled = true;
      point.element.setAttribute("cx", point.xNow.toFixed(2));
      point.element.setAttribute("cy", point.yNow.toFixed(2));
      point.element.style.opacity = pointer ? "0.95" : "";
    });
    lines.forEach((line) => {
      const a = points[line.a];
      const b = points[line.b];
      line.element.setAttribute("x1", a.xNow.toFixed(2));
      line.element.setAttribute("y1", a.yNow.toFixed(2));
      line.element.setAttribute("x2", b.xNow.toFixed(2));
      line.element.setAttribute("y2", b.yNow.toFixed(2));
    });
    if (!reducedMotion && (pointer || unsettled)) frame = requestAnimationFrame(render);
  }
  function onMove(event) {
    pointer = { x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(render);
  }
  function onLeave() {
    pointer = null;
    if (!frame) frame = requestAnimationFrame(render);
  }
  visual.addEventListener("pointermove", onMove);
  visual.addEventListener("pointerleave", onLeave);
  render();
})();