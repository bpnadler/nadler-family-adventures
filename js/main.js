/* Family Adventures — main.js */
(function () {
  'use strict';

  // ===== Scroll reveal =====
  try {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
  } catch (err) { console.warn('[reveal]', err); }

  // ===== Nav scroll state =====
  try {
    const nav = document.querySelector('.site-nav');
    if (nav) {
      const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  } catch (err) { console.warn('[nav]', err); }

  // ===== Image fade-in (hide broken) =====
  try {
    document.querySelectorAll('img[data-fade]').forEach((img) => {
      if (img.complete && img.naturalHeight !== 0) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'));
        img.addEventListener('error', () => { img.style.display = 'none'; });
      }
    });
  } catch (err) { console.warn('[fade]', err); }

  // ===== Hero on load =====
  try {
    window.addEventListener('load', () => {
      document.querySelectorAll('.hero-animate').forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 200 + i * 120);
      });
    });
  } catch (err) { console.warn('[hero-animate]', err); }

  // ===== Hero parallax =====
  try {
    const heroPhoto = document.querySelector('.hero-photo');
    if (heroPhoto) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroPhoto.style.transform = `scale(1) translateY(${y * 0.3}px)`;
        }
      }, { passive: true });
    }
  } catch (err) { console.warn('[parallax]', err); }

  // ===== Lightbox =====
  try {
    // Don't double-install
    if (document.querySelector('.lightbox')) return;

    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image preview');
    lb.innerHTML = '<button class="lightbox-close" aria-label="Close (Esc)" type="button">×</button><img class="lightbox-img" alt=""><div class="lightbox-caption"></div>';
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('.lightbox-img');
    const lbCap = lb.querySelector('.lightbox-caption');
    const lbClose = lb.querySelector('.lightbox-close');

    function captionFor(img) {
      try {
        if (img.dataset && img.dataset.caption) return { eyebrow: '', text: img.dataset.caption };

        const mosaic = img.closest('.mosaic-cell');
        if (mosaic) {
          const label = mosaic.querySelector('.mosaic-label');
          if (label) {
            const small = label.querySelector('small');
            let text = '';
            label.childNodes.forEach((n) => { if (n.nodeType === 3) text += n.textContent; });
            text = text.trim() || label.textContent.replace(small ? small.textContent : '', '').trim();
            return { eyebrow: small ? small.textContent : '', text: text };
          }
        }

        const wrap = img.closest('.chapter-image-wrap');
        if (wrap) {
          const tag = wrap.querySelector('.chapter-image-tag');
          const chapter = wrap.closest('.chapter');
          const title = chapter ? chapter.querySelector('.chapter-title') : null;
          return {
            eyebrow: title ? title.textContent.trim() : '',
            text: tag ? tag.textContent.trim() : (img.alt || '')
          };
        }

        const strip = img.closest('.strip');
        if (strip) {
          const title = strip.querySelector('.strip-title');
          const eb = strip.querySelector('.strip-eyebrow');
          return {
            eyebrow: eb ? eb.textContent.trim() : '',
            text: title ? title.textContent.trim() : ''
          };
        }

        const journey = img.closest('.journey-card');
        if (journey) {
          const day = journey.querySelector('.journey-day');
          const place = journey.querySelector('.journey-place');
          const mood = journey.querySelector('.journey-mood');
          return {
            eyebrow: day ? day.textContent.trim() : '',
            text: (place ? place.textContent.trim() : '') + (mood ? ' — ' + mood.textContent.trim() : '')
          };
        }

        const hotel = img.closest('.hotel');
        if (hotel) {
          const nameEl = hotel.querySelector('.hotel-name');
          if (nameEl) {
            const text = (nameEl.firstChild && nameEl.firstChild.textContent) ? nameEl.firstChild.textContent.trim() : nameEl.textContent.trim();
            return { eyebrow: 'Hotel', text: text };
          }
        }

        const card = img.closest('.trip-card');
        if (card) {
          const title = card.querySelector('.trip-card-title');
          const region = card.querySelector('.trip-card-region');
          return {
            eyebrow: region ? region.textContent.trim() : '',
            text: title ? title.textContent.trim() : ''
          };
        }
      } catch (e) { /* swallow */ }

      return { eyebrow: '', text: img.alt || '' };
    }

    function openLb(img) {
      const cap = captionFor(img);
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = cap.text;
      lbCap.innerHTML = cap.eyebrow
        ? '<span class="caption-eyebrow">' + cap.eyebrow.replace(/</g, '&lt;') + '</span>' + cap.text.replace(/</g, '&lt;')
        : cap.text.replace(/</g, '&lt;');
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLb() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { if (!lb.classList.contains('open')) lbImg.src = ''; }, 350);
    }

    // Delegated click handler — catches img clicks even if loaded later
    document.addEventListener('click', (e) => {
      const img = e.target.closest && e.target.closest('img[data-fade]');
      if (!img) return;
      if (img.classList.contains('hero-photo')) return;
      if (img.classList.contains('verdict-photo')) return;
      e.preventDefault();
      e.stopPropagation();
      openLb(img);
    }, true); // capture so we beat trip-card onclick

    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lb.classList.contains('open')) closeLb();
    });

    window.__lbReady = true;
  } catch (err) {
    console.error('[lightbox] failed', err);
  }
})();
