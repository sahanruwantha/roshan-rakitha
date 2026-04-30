/* Roshan Rakitha — site interactions */

(function () {
  'use strict';

  const NAV_OFFSET = 64;

  // Smooth-scroll + nav active-state
  const navLinks = document.querySelectorAll('.nav-link');
  document.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const id = el.getAttribute('data-nav');
      const targetId = id === 'home' ? 'top' : id;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: y, behavior: 'smooth' });
      navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('data-nav') === id));
    });
  });

  // Active nav on scroll
  const sections = ['top', 'portfolio', 'services', 'about', 'contact']
    .map((id) => ({ id, el: document.getElementById(id) }))
    .filter((s) => s.el);
  const setActiveById = (id) => {
    const navId = id === 'top' ? 'home' : id;
    navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('data-nav') === navId));
  };
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const probe = window.scrollY + NAV_OFFSET + 40;
      let current = 'top';
      for (const s of sections) {
        if (s.el.offsetTop <= probe) current = s.id;
      }
      setActiveById(current);
      scrollTicking = false;
    });
  }, { passive: true });

  // Portfolio filters
  const filterBtns = document.querySelectorAll('.pf-filter');
  const cards = document.querySelectorAll('.pf-card');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-filter');
      filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      cards.forEach((c) => {
        const cat = c.getAttribute('data-cat');
        c.style.display = (f === 'All' || cat === f) ? '' : 'none';
      });
    });
  });

  // Portfolio overlay
  const overlay = document.getElementById('pf-overlay');
  const overlayImg = document.getElementById('pf-overlay-img');
  const overlayCat = document.getElementById('pf-overlay-cat');
  const overlayTitle = document.getElementById('pf-overlay-title');
  const overlayCta = document.getElementById('pf-overlay-cta');
  const overlayClose = document.getElementById('pf-close');

  const openOverlay = (card) => {
    overlayImg.src = card.getAttribute('data-img');
    overlayImg.alt = card.getAttribute('data-title');
    overlayCat.textContent = card.getAttribute('data-cat');
    overlayTitle.textContent = card.getAttribute('data-title');
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const closeOverlay = () => {
    overlay.hidden = true;
    document.body.style.overflow = '';
  };

  cards.forEach((c) => c.addEventListener('click', () => openOverlay(c)));
  overlayClose.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) closeOverlay(); });
  overlayCta.addEventListener('click', () => closeOverlay());

  // Contact form thank-you state
  const form = document.getElementById('contact-form');
  const grid = document.getElementById('contact-grid');
  const thanks = document.getElementById('contact-thanks');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      grid.hidden = true;
      thanks.hidden = false;
    });
  }
})();
