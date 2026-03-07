const revealElements = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.stat-number');
const topbar = document.querySelector('.topbar');
const navLinks = document.querySelectorAll('.nav a');
const sections = document.querySelectorAll('main section[id]');
const progressBar = document.querySelector('.scroll-progress-bar');
const spotlightCards = document.querySelectorAll('.spotlight-card');
const gridGlow = document.querySelector('.grid-glow');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

revealElements.forEach((element) => {
  const delay = element.dataset.delay || 0;
  element.style.setProperty('--reveal-delay', `${delay}ms`);
});

if (!reduceMotion) {
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
      threshold: 0.16,
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
        const duration = 1500;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
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
      threshold: 0.55,
    }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add('is-visible');
  });

  counters.forEach((counter) => {
    counter.textContent = String(Number(counter.dataset.count || 0));
  });
}

const syncScrollState = () => {
  if (topbar) {
    topbar.classList.toggle('is-scrolled', window.scrollY > 18);
  }

  if (progressBar) {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }
};

syncScrollState();
window.addEventListener('scroll', syncScrollState, { passive: true });

if (sections.length && navLinks.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const currentId = `#${entry.target.id}`;

        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === currentId);
        });
      });
    },
    {
      threshold: 0.45,
      rootMargin: '-15% 0px -35% 0px',
    }
  );

  sections.forEach((section) => {
    navObserver.observe(section);
  });
}

if (!reduceMotion) {
  window.addEventListener('mousemove', (event) => {
    const xRatio = event.clientX / window.innerWidth - 0.5;
    const yRatio = event.clientY / window.innerHeight - 0.5;

    if (gridGlow) {
      gridGlow.style.setProperty('--spot-x', `${event.clientX}px`);
      gridGlow.style.setProperty('--spot-y', `${event.clientY}px`);
    }

    if (window.innerWidth < 960) {
      return;
    }

    spotlightCards.forEach((card, index) => {
      const depth = index === 0 ? 8 : 4;
      card.style.transform = `perspective(1200px) rotateY(${xRatio * depth}deg) rotateX(${yRatio * -depth}deg) translateZ(0)`;
    });
  });

  window.addEventListener('mouseleave', () => {
    spotlightCards.forEach((card) => {
      card.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    });
  });
}