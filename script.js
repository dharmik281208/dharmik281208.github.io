// Year in footer
const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
const menuBackdrop = document.getElementById('menuBackdrop');

if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    const isHidden = mobileNav.hasAttribute('hidden');
    
    if (isHidden) {
      mobileNav.removeAttribute('hidden');
      menuBackdrop?.removeAttribute('hidden');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileNav.setAttribute('hidden', '');
      menuBackdrop?.setAttribute('hidden', '');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking a link
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.setAttribute('hidden', '');
      menuBackdrop?.setAttribute('hidden', '');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// Close menu when clicking backdrop
if (menuBackdrop && mobileNav && menuBtn) {
  menuBackdrop.addEventListener('click', () => {
    mobileNav.setAttribute('hidden', '');
    menuBackdrop.setAttribute('hidden', '');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
}

// Active nav link on scroll
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    const subject = String(formData.get('subject') || 'Project Inquiry');
    const message = String(formData.get('message') || '');

    const mailSubject = encodeURIComponent(`${subject} - from ${name}`);
    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const mailTo = 'dhrmiksuhagiya@gmail.com';

    window.location.href = `mailto:${mailTo}?subject=${mailSubject}&body=${mailBody}`;
    
    // Show success message
    const hint = document.getElementById('formHint');
    if (hint) {
      hint.textContent = 'Opening your email client...';
      setTimeout(() => {
        hint.textContent = '';
        contactForm.reset();
      }, 2000);
    }
  });
}

// Smooth scroll behavior for links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});
