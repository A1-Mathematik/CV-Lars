const revealElements = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.stat-number');

revealElements.forEach((element) => {
  const delay = element.dataset.delay || 0;
  element.style.setProperty('--reveal-delay', `${delay}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const counter = entry.target;
      const targetValue = Number(counter.dataset.count || 0);
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = String(Math.round(targetValue * eased));

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      observer.unobserve(counter);
    });
  },
  {
    threshold: 0.6,
  }
);

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

const topbar = document.querySelector('.topbar');

window.addEventListener('scroll', () => {
  if (!topbar) {
    return;
  }

  topbar.classList.toggle('is-scrolled', window.scrollY > 18);
});

const heroPanel = document.querySelector('.hero-panel');

window.addEventListener('mousemove', (event) => {
  if (!heroPanel || window.innerWidth < 960) {
    return;
  }

  const xRatio = event.clientX / window.innerWidth - 0.5;
  const yRatio = event.clientY / window.innerHeight - 0.5;

  heroPanel.style.transform = `perspective(1200px) rotateY(${xRatio * 5}deg) rotateX(${yRatio * -5}deg)`;
});

window.addEventListener('mouseleave', () => {
  if (!heroPanel) {
    return;
  }

  heroPanel.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
});