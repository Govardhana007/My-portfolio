/* ===== Mouse trail (GSAP) =====
   Drops a shape every `gap` pixels of mouse travel and recycles the images. */
(function () {
  const canTrail = window.gsap &&
    matchMedia('(hover:hover)').matches &&
    !matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (!canTrail) return;

  const gap = 60; // pixels between shapes: raise to space them out
  const size = 30;
  const flair = gsap.utils.toArray('.flair');
  const wrap = gsap.utils.wrap(0, flair.length);
  let index = 0;
  let mousePos = { x: 0, y: 0 };
  let lastMousePos = { x: 0, y: 0 };

  gsap.defaults({ duration: 1 });

  function playAnimation(shape) {
    const tl = gsap.timeline();
    tl.from(shape, { opacity: 0, scale: 0, ease: 'elastic.out(1,0.3)' })
      .to(shape, { rotation: 'random([-360, 360])' }, '<')
      .to(shape, { y: '120vh', ease: 'back.in(.4)', duration: 1 }, 0);
  }

  function animateImage() {
    const img = flair[wrap(index)];
    gsap.killTweensOf(img);
    gsap.set(img, { clearProps: 'all' });
    gsap.set(img, {
      width: size,
      opacity: 1,         
      left: mousePos.x,
      top: mousePos.y,
      xPercent: -50,
      yPercent: -50
});

    playAnimation(img);
    index++;
  }

  function imageTrail() {
    const travel = Math.hypot(lastMousePos.x - mousePos.x, lastMousePos.y - mousePos.y);
    if (travel > gap) {
      animateImage();
      lastMousePos = { x: mousePos.x, y: mousePos.y };
    }
  }

  window.addEventListener('mousemove', (e) => {
    mousePos = { x: e.clientX, y: e.clientY };
  });
  gsap.ticker.add(imageTrail);
})();
