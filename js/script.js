(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll animation system ----------
     Classes (see css/style.css): .reveal  .reveal-up  .reveal-lines  .reveal-image  .reveal-hero  .reveal-stagger
     Each element animates once, when it first enters the viewport. */
  const REVEAL = '.reveal, .reveal-up, .reveal-lines, .reveal-image, .reveal-hero, .reveal-stagger';
  function initReveal() {
    const els = $$(REVEAL);
    // give every child of a stagger group its order index
    $$('.reveal-stagger').forEach((group) => [...group.children].forEach((c, i) => c.style.setProperty('--i', i)));
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Very subtle parallax for the cinematic band ---------- */
  function initParallax() {
    if (reduce) return;
    const items = $$('[data-parallax]');
    if (!items.length) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      items.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh;      // -1 … 1
        const max = r.height * 0.08;                          // image has 10% spare top and bottom
        const y = Math.max(-max, Math.min(max, -p * r.height * 0.1));
        el.style.setProperty('--py', y.toFixed(1) + 'px');
      });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- Image fallback ----------
     1. local file in images/  2. data-remote URL(s), if any (official YouTube thumbnails)  3. labelled placeholder */
  function initImages() {
    const fail = (img) => {
      const queue = (img.dataset.remote || '').split(/\s+/).filter(Boolean);
      const tried = Number(img.dataset.tried || 0);
      if (tried < queue.length) { img.dataset.tried = tried + 1; img.src = queue[tried]; return; }
      const box = img.closest('.img-box');
      if (!box) { img.hidden = true; return; }
      box.classList.add('missing');
      const optional = box.closest('[data-optional]');
      if (optional) optional.hidden = true;
    };
    $$('img').forEach((img) => {
      img.addEventListener('error', () => fail(img));
      if (img.complete && img.naturalWidth === 0) fail(img);
    });
  }

  /* ---------- Fast page transitions (short fade, no loader) ---------- */
  function initTransitions() {
    window.addEventListener('pageshow', () => document.body.classList.remove('leaving'));
    if (reduce) return;
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || u.pathname === location.pathname) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(() => { location.href = u.href; }, 150);
    });
  }

  /* ---------- Community form ---------- */
  // BACKEND CONNECTION WILL BE ADDED HERE
  // Later replace the simulated promise below with:
  // return fetch("BACKEND_URL", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(formData)
  // }).then((r) => ({ ok: r.ok }));
async function submitToBackend(formData) {
  const response = await fetch("https://rohityadav.pythonanywhere.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  return await response.json();
}

  function initForm() {
    const form = $('#join-form');
    if (!form) return;
    const success = $('#success'), btn = $('button[type="submit"]', form), label = $('.label', btn);
    const rules = {
      name: (v) => v.trim().length >= 2 || 'Please enter your name.',
      email: (v) => !v.trim() ? 'Please enter your email address.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
      category: (v) => !!v || 'Please choose a category.',
      message: (v) => v.trim().length >= 10 || 'Please write at least 10 characters.'
    };
    const check = (input) => {
      const res = rules[input.name](input.value);
      const field = input.closest('.field'), err = $('.error', field), bad = res !== true;
      field.classList.toggle('invalid', bad);
      input.setAttribute('aria-invalid', bad);
      err.textContent = bad ? res : '';
      return !bad;
    };
    const inputs = $$('input, select, textarea', form);
    inputs.forEach((i) => {
      i.addEventListener('blur', () => check(i));
      i.addEventListener('input', () => i.closest('.field').classList.contains('invalid') && check(i));
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      $('#form-error').textContent = '';
      const valid = inputs.map(check).every(Boolean);
      if (!valid) { inputs.find((i) => i.getAttribute('aria-invalid') === 'true')?.focus(); return; }
      const formData = Object.fromEntries(inputs.map((i) => [i.name, i.value.trim()]));
      btn.classList.add('loading'); btn.disabled = true; label.textContent = 'SENDING…';
      try {
        const res = await submitToBackend(formData);
        if (!res.ok) throw new Error('Request failed');
        form.hidden = true;
        success.hidden = false;
        success.focus();
      } catch (err) {
        btn.classList.remove('loading'); btn.disabled = false; label.textContent = 'JOIN';
        $('#form-error').textContent = 'Something went wrong. Please try again.';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.__revealReady = true;
    initImages(); initReveal(); initParallax(); initTransitions(); initForm();
  });
})();
