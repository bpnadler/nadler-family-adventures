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

/* =================================================================
   Lightbox: click any non-background image → fullscreen view + caption
   ================================================================= */
(function () {
  // Build lightbox DOM once
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image preview');
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="Close (Esc)">×</button>
    <img class="lightbox-img" alt="">
    <div class="lightbox-caption"></div>
  `;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector('.lightbox-img');
  const lbCap = lb.querySelector('.lightbox-caption');
  const lbClose = lb.querySelector('.lightbox-close');

  // Captions: pull the most relevant label from surrounding DOM
  function getCaption(img) {
    if (img.dataset.caption) return { eyebrow: '', text: img.dataset.caption };

    // Mosaic tile: <small>Eyebrow</small>Name
    const mosaic = img.closest('.mosaic-cell');
    if (mosaic) {
      const label = mosaic.querySelector('.mosaic-label');
      if (label) {
        const small = label.querySelector('small');
        const text = [...label.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim()
          || label.textContent.replace(small ? small.textContent : '', '').trim();
        return { eyebrow: small ? small.textContent : '', text };
      }
    }

    // Chapter image tag
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

    // Strip image
    const strip = img.closest('.strip');
    if (strip) {
      const title = strip.querySelector('.strip-title');
      const eb = strip.querySelector('.strip-eyebrow');
      return {
        eyebrow: eb ? eb.textContent.trim() : '',
        text: title ? title.textContent.trim() : ''
      };
    }

    // Journey card
    const journey = img.closest('.journey-card');
    if (journey) {
      const day = journey.querySelector('.journey-day');
      const place = journey.querySelector('.journey-place');
      const mood = journey.querySelector('.journey-mood');
      return {
        eyebrow: day ? day.textContent.trim() : '',
        text: place ? place.textContent.trim() + (mood ? ' — ' + mood.textContent.trim() : '') : ''
      };
    }

    // Hotel thumbnail
    const hotel = img.closest('.hotel');
    if (hotel) {
      const nameEl = hotel.querySelector('.hotel-name');
      if (nameEl) {
        // pull only the first text node (skip tag/ext spans)
        const text = (nameEl.firstChild && nameEl.firstChild.textContent || nameEl.textContent).trim();
        return { eyebrow: 'Hotel', text };
      }
    }

    // Trip card on landing
    const card = img.closest('.trip-card');
    if (card) {
      const title = card.querySelector('.trip-card-title');
      const region = card.querySelector('.trip-card-region');
      return {
        eyebrow: region ? region.textContent.trim() : '',
        text: title ? title.textContent.trim() : ''
      };
    }

    return { eyebrow: '', text: img.alt || '' };
  }

  function open(img) {
    const cap = getCaption(img);
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = cap.text;
    lbCap.innerHTML = cap.eyebrow
      ? `<span class="caption-eyebrow">${cap.eyebrow}</span>${cap.text}`
      : cap.text;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    // Wait for transition before clearing image
    setTimeout(() => { if (!lb.classList.contains('open')) lbImg.src = ''; }, 350);
  }

  // Bind clicks on all eligible images
  document.querySelectorAll('img[data-fade]').forEach((img) => {
    // Skip background/decorative images
    if (img.classList.contains('hero-photo')) return;
    if (img.classList.contains('verdict-photo')) return;

    img.addEventListener('click', (e) => {
      // If the image is inside a link (hotel-body), let the link work — but we intercept image clicks
      e.preventDefault();
      e.stopPropagation();
      open(img);
    });
  });

  // Trip cards: image is inside a card with onclick to navigate. We want lightbox on image click.
  // The onclick is on the article element; clicking the image bubbles up — our handler above stops propagation, so navigation won't happen.

  lbClose.addEventListener('click', close);
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('open')) close();
  });
})();
