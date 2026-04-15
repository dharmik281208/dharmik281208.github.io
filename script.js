// ==============================
// EmailJS init (your keys)
// ==============================
(function initEmailJS() {
  if (!window.emailjs) {
    console.error("[EmailJS] Library not loaded. Check index.html script tag.");
    return;
  }
  emailjs.init("9RBr4vVjeyOXZPxS9"); // Public key
})();

// ==============================
// Footer year
// ==============================
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// ==============================
// Mobile menu
// ==============================
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
const menuBackdrop = document.getElementById("menuBackdrop");

function isMobile() {
  return window.matchMedia("(max-width: 860px)").matches;
}

function setMenuOpen(open) {
  if (!menuBtn || !mobileNav || !menuBackdrop) return;

  if (open) {
    mobileNav.removeAttribute("hidden");
    menuBackdrop.removeAttribute("hidden");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  } else {
    mobileNav.setAttribute("hidden", "");
    menuBackdrop.setAttribute("hidden", "");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
}

if (menuBtn && mobileNav && menuBackdrop) {
  setMenuOpen(false);

  menuBtn.addEventListener("click", () => {
    const open = mobileNav.hasAttribute("hidden");
    setMenuOpen(open);
  });

  menuBackdrop.addEventListener("click", () => setMenuOpen(false));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });

  mobileNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setMenuOpen(false));
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) setMenuOpen(false);
  });
}

// ==============================
// Active nav link on scroll
// ==============================
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = ["home", "projects", "about", "services", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function setActive(id) {
  navLinks.forEach((a) => {
    const is = a.getAttribute("href") === `#${id}`;
    a.classList.toggle("active", is);
  });
}

function onScroll() {
  const y = window.scrollY + 180;
  let current = "home";
  for (const s of sections) {
    if (s.offsetTop <= y) current = s.id;
  }
  setActive(current);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ==============================
// Projects arrows (buttons only)
// ==============================
const projectsScroll = document.getElementById("projectsScroll");
const projectsPrev = document.getElementById("projectsPrev");
const projectsNext = document.getElementById("projectsNext");

function scrollProjectsBy(delta) {
  if (!projectsScroll) return;
  projectsScroll.scrollBy({ left: delta, behavior: "smooth" });
}

if (projectsScroll) {
  projectsPrev?.addEventListener("click", () => scrollProjectsBy(-560));
  projectsNext?.addEventListener("click", () => scrollProjectsBy(560));
}

// ==============================
// Contact form -> EmailJS
// ==============================
const contactForm = document.getElementById("contactForm");
const formHint = document.getElementById("formHint");
const submitBtn = document.getElementById("submitBtn");
const submitText = document.getElementById("submitText");
const submitLoader = document.getElementById("submitLoader");

const SERVICE_ID = "service_n28xhz5";
const TEMPLATE_ID = "template_f2utfep";

function setSending(sending) {
  if (submitBtn) submitBtn.disabled = sending;
  if (submitText) submitText.style.display = sending ? "none" : "inline";
  if (submitLoader) submitLoader.style.display = sending ? "inline-block" : "none";
}

function showHint(msg, ok) {
  if (!formHint) return;
  formHint.textContent = msg;
  formHint.style.color = ok ? "#7CF7D2" : "#FF6B35";
  formHint.style.background = ok ? "rgba(124,247,210,.10)" : "rgba(255,107,53,.10)";
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function verifyFormFields(form) {
  const required = ["user_name", "user_email", "subject", "message"];
  const missing = required.filter((n) => !form.querySelector(`[name="${n}"]`));
  if (missing.length) {
    console.error("[EmailJS] Missing input names:", missing);
    showHint("Form error: missing fields. Check console.", false);
    return false;
  }
  return true;
}

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!verifyFormFields(contactForm)) return;

    const name = String(contactForm.querySelector('[name="user_name"]').value || "").trim();
    const email = String(contactForm.querySelector('[name="user_email"]').value || "").trim();
    const subject = String(contactForm.querySelector('[name="subject"]').value || "").trim();
    const message = String(contactForm.querySelector('[name="message"]').value || "").trim();

    if (!name) return showHint("Please enter your name.", false);
    if (!email || !validEmail(email)) return showHint("Please enter a valid email.", false);
    if (!subject) return showHint("Please enter a project title.", false);
    if (!message) return showHint("Please enter a message.", false);

    if (!window.emailjs) return showHint("Email service not loaded. Please refresh.", false);

    try {
      setSending(true);

      const res = await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm);

      if (res && res.status === 200) {
        // ✅ Removed success message (as requested)
        // showHint("✅ Message sent! Check Inbox/Spam.", true);
        contactForm.reset();
        if (formHint) formHint.textContent = "";
      } else {
        showHint("❌ Failed to send. Try again.", false);
      }
    } catch (err) {
      console.error("[EmailJS] sendForm error:", err);
      const msg = err?.text || err?.message || "Unknown error";
      showHint(`❌ Error: ${msg}`, false);
    } finally {
      setTimeout(() => setSending(false), 900);
    }
  });
}

// ==============================
// Smooth scroll for anchor links
// ==============================
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
