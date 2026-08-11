/**
 * JCMP Service — interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollReveal();
  initActiveNav();
  initContactForm();
});

function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileNav() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.service, .step, .reviews__inner, .engagements__lead, .engagement, .contact__info, .contact__form'
  );

  elements.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -24px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 110;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.className = 'form__note';
    note.textContent = '';

    const data = new FormData(form);
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const phone = data.get('phone')?.toString().trim();
    const service = data.get('service')?.toString();
    const message = data.get('message')?.toString().trim();

    if (!name || !email || !phone || !service || !message) {
      note.className = 'form__note error';
      note.textContent = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.className = 'form__note error';
      note.textContent = 'Veuillez entrer une adresse email valide.';
      return;
    }

    const subject = encodeURIComponent(`[JCMP Service] Demande — ${service}`);
    const body = encodeURIComponent(
      `Nom : ${name}\nEmail : ${email}\nTéléphone : ${phone}\nService : ${service}\n\nMessage :\n${message}`
    );

    // Ouvre le client mail du visiteur (fonctionne sans serveur)
    window.location.href = `mailto:marchandjulien60@gmail.com?subject=${subject}&body=${body}`;

    note.className = 'form__note success';
    note.textContent = 'Votre client mail va s’ouvrir pour envoyer la demande.';
    form.reset();
  });
}
