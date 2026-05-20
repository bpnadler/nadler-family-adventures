/* Scroll reveal */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* Nav scroll state */
const nav = document.querySelector('.site-nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Image fade-in (and hide broken ones) */
document.querySelectorAll('img[data-fade]').forEach((img) => {
  if (img.complete && img.naturalHeight !== 0) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'));
    img.addEventListener('error', () => { img.style.display = 'none'; });
  }
});

/* Hero animation on load */
window.addEventListener('load', () => {
  document.querySelectorAll('.hero-animate').forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 120);
  });
});

/* Subtle parallax on hero photo */
const heroPhoto = document.querySelector('.hero-photo');
if (heroPhoto) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroPhoto.style.transform = `scale(1) translateY(${y * 0.3}px)`;
    }
  }, { passive: true });
}
