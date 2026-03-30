const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const btn = document.getElementById("menuBtn") || document.querySelector(".menu-btn");
const mobile = document.getElementById("mobileNav");
const backdrop = document.getElementById("menuBackdrop");

function isMobile() {
  return window.matchMedia("(max-width: 980px)").matches;
}

function setMenuOpen(open) {
  if (!mobile || !btn || !backdrop) return;

  if (open) {
    mobile.removeAttribute("hidden");
    backdrop.removeAttribute("hidden");
    btn.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  } else {
    mobile.setAttribute("hidden", "");
    backdrop.setAttribute("hidden", "");
    btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
}

function toggleMenu() {
  if (!isMobile()) return;
  const isHidden = mobile?.hasAttribute("hidden");
  setMenuOpen(Boolean(isHidden));
}

if (btn && mobile && backdrop) {
  setMenuOpen(false);

  btn.addEventListener("click", toggleMenu);

  backdrop.addEventListener("click", () => setMenuOpen(false));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });

  mobile.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => setMenuOpen(false));
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) setMenuOpen(false);
  });
}

/* active nav link on scroll */
const sections = ["home","about","skills","projects","lab","certificates","blog","contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navLinks = Array.from(document.querySelectorAll(".nav-link"));

function setActive(id) {
  navLinks.forEach(a => {
    const is = a.getAttribute("href") === `#${id}`;
    a.classList.toggle("active", is);
  });
}

function onScroll() {
  const y = window.scrollY + 140;
  let current = "home";
  for (const s of sections) {
    if (s.offsetTop <= y) current = s.id;
  }
  setActive(current);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* scroll reveal */
const revealEls = Array.from(document.querySelectorAll(".reveal, .stagger"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* hero frame parallax */
const frame = document.querySelector(".frame");
if (frame && !prefersReducedMotion) {
  frame.addEventListener("mousemove", (ev) => {
    const r = frame.getBoundingClientRect();
    const x = (ev.clientX - r.left) / r.width - 0.5;
    const y = (ev.clientY - r.top) / r.height - 0.5;
    frame.style.transform = `rotate(-10deg) translate(${x * 10}px, ${y * 10}px)`;
  });

  frame.addEventListener("mouseleave", () => {
    frame.style.transform = "rotate(-10deg)";
  });
}

/* background cursor spotlight */
const spotlight = document.getElementById("spotlight");
if (spotlight && !prefersReducedMotion) {
  let raf = 0;
  window.addEventListener("mousemove", (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      spotlight.style.background =
        `radial-gradient(300px 300px at ${x}% ${y}%, rgba(255,255,255,.14), transparent 62%)`;
    });
  }, { passive: true });
}

/* contact form -> open mail client with prefilled subject/body */
const contactForm = document.getElementById("contactForm");
const formHint = document.getElementById("formHint");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const message = String(fd.get("message") || "");

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`);
    const to = "dhrmiksuhagiya@gmail.com";

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

    if (formHint) formHint.textContent = "Opening your email app…";
  });
}
