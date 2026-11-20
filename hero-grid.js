(() => {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("hero-ready")));
})();