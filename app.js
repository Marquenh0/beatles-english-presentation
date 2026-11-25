(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const currentLabel = document.getElementById('current-slide');
  const progress = document.getElementById('progress-fill');
  const progressTrack = document.querySelector('.progress-track');
  const ticks = [...document.querySelectorAll('.chapter-ticks button')];
  const previousButton = document.getElementById('previous');
  const nextButton = document.getElementById('next');
  const fullscreenButton = document.getElementById('fullscreen');
  const stage = document.getElementById('stage');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let moving = false;
  let pointerStart = null;

  const pad = value => String(value).padStart(2, '0');

  function updateControls() {
    currentLabel.textContent = pad(activeIndex + 1);
    progress.style.transform = `scaleX(${(activeIndex + 1) / slides.length})`;
    progressTrack.setAttribute('aria-valuenow', String(activeIndex + 1));
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === slides.length - 1;
    ticks.forEach((tick, index) => {
      if (index === activeIndex) tick.setAttribute('aria-current', 'true');
      else tick.removeAttribute('aria-current');
    });
    document.title = `${pad(activeIndex + 1)} · ${slides[activeIndex].dataset.title} — The Beatles`;
  }

  function revealOpeningSlide() {
    const targets = [...slides[0].querySelectorAll('.anim, .stagger > *')];
    if (reducedMotion.matches || !targets.length) return;
    if (window.gsap) {
      window.gsap.fromTo(targets, { autoAlpha: 0, y: 22, filter: 'blur(5px)' }, {
        autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.09,
        ease: 'power3.out', clearProps: 'filter,transform'
      });
      return;
    }
    targets.forEach((target, index) => {
      const animation = target.animate([
        { opacity: 0, transform: 'translateY(22px)', filter: 'blur(5px)' },
        { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }
      ], { duration: 800, delay: index * 90, easing: 'cubic-bezier(.22,.8,.25,1)', fill: 'both' });
      animation.onfinish = () => animation.cancel();
    });
  }

  function finishTransition(from, to) {
    from.classList.remove('is-active');
    from.setAttribute('aria-hidden', 'true');
    from.setAttribute('inert', '');
    to.classList.add('is-active');
    to.setAttribute('aria-hidden', 'false');
    to.removeAttribute('inert');
    if (window.gsap) {
      window.gsap.set(from, { clearProps: 'all' });
      window.gsap.set(to, { clearProps: 'opacity,visibility,transform' });
    }
    moving = false;
  }

  function goTo(index) {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
    if (moving || nextIndex === activeIndex) return;

    const from = slides[activeIndex];
    const to = slides[nextIndex];
    const direction = nextIndex > activeIndex ? 1 : -1;
    activeIndex = nextIndex;
    moving = true;
    updateControls();
    to.classList.add('is-active');
    to.removeAttribute('inert');
    to.setAttribute('aria-hidden', 'false');

    if (reducedMotion.matches) {
      finishTransition(from, to);
      return;
    }

    const entrance = [...to.querySelectorAll('.anim, .stagger > *')];
    if (window.gsap) {
      const gsap = window.gsap;
      gsap.killTweensOf([from, to, ...entrance]);
      gsap.set(to, { zIndex: 2 });
      gsap.set(from, { zIndex: 1 });
      gsap.set(entrance, { autoAlpha: 0, y: 19, filter: 'blur(4px)' });
      const timeline = gsap.timeline({ onComplete: () => finishTransition(from, to) });
      timeline.to(from, { autoAlpha: 0, y: direction * -9, duration: 0.3, ease: 'power2.in' }, 0)
        .fromTo(to, { autoAlpha: 0, x: direction * 18 }, { autoAlpha: 1, x: 0, duration: 0.56, ease: 'power3.out' }, 0.06)
        .to(entrance, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.57, stagger: 0.055, ease: 'power3.out', clearProps: 'filter,transform' }, 0.13);
    } else {
      to.animate([
        { opacity: 0, transform: `translateX(${direction * 18}px)` },
        { opacity: 1, transform: 'translateX(0)' }
      ], { duration: 560, easing: 'cubic-bezier(.22,.8,.25,1)' });
      from.animate([
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: `translateY(${direction * -9}px)` }
      ], { duration: 300, easing: 'ease-in' }).onfinish = () => finishTransition(from, to);
    }
  }

  previousButton.addEventListener('click', () => goTo(activeIndex - 1));
  nextButton.addEventListener('click', () => goTo(activeIndex + 1));
  ticks.forEach(button => button.addEventListener('click', () => goTo(Number(button.dataset.go))));

  document.addEventListener('keydown', event => {
    const target = event.target;
    const isButton = target instanceof HTMLElement && target.closest('button');
    if (event.key === 'ArrowRight' || (event.key === ' ' && !isButton)) {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(slides.length - 1);
    } else if (event.key.toLowerCase() === 'f' && !isButton) {
      event.preventDefault();
      toggleFullscreen();
    }
  });

  stage.addEventListener('pointerdown', event => {
    if (event.target.closest('button')) return;
    pointerStart = event.clientX;
  });
  stage.addEventListener('pointerup', event => {
    if (pointerStart === null) return;
    const distance = event.clientX - pointerStart;
    pointerStart = null;
    if (Math.abs(distance) > 75) goTo(activeIndex + (distance < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', () => { pointerStart = null; });

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.getElementById('presentation').requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {
      document.getElementById('presentation').classList.toggle('fullscreen-mode');
    }
  }
  fullscreenButton.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    fullscreenButton.setAttribute('aria-label', document.fullscreenElement ? 'Exit full screen' : 'Enter full screen');
  });

  updateControls();
  revealOpeningSlide();
})();
