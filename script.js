// ==============================
// EmailJS config (REQUIRED)
// ==============================
// 1) Create EmailJS account
// 2) Add Email Service (Gmail)
// 3) Create Template
// 4) Replace keys below

(function initEmailJS(){
  if (!window.emailjs) return;

  // Replace with your EmailJS Public Key
  emailjs.init("9RBr4vVjeyOXZPxS9");
})();

// ==============================
// Footer year
// ==============================
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// ==============================
// Mobile menu (overlay + backdrop)
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
// Contact form -> send email via EmailJS
// ==============================
const contactForm = document.getElementById("contactForm");
const formHint = document.getElementById("formHint");
const submitBtn = document.getElementById("submitBtn");
const submitText = document.getElementById("submitText");
const submitLoader = document.getElementById("submitLoader");

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

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = String(contactForm.querySelector('input[name="user_name"]')?.value || "").trim();
    const email = String(contactForm.querySelector('input[name="user_email"]')?.value || "").trim();
    const subject = String(contactForm.querySelector('input[name="subject"]')?.value || "").trim();
    const message = String(contactForm.querySelector('textarea[name="message"]')?.value || "").trim();

    if (!name) return showHint("Please enter your name.", false);
    if (!email || !validEmail(email)) return showHint("Please enter a valid email.", false);
    if (!subject) return showHint("Please enter a project title.", false);
    if (!message) return showHint("Please enter a message.", false);

    if (!window.emailjs) {
      showHint("Email service not loaded. Please refresh and try again.", false);
      return;
    }

    try {
      setSending(true);
      showHint("Sending your message…", true);

      // Replace with your IDs
      const SERVICE_ID = "service_n28xhz5";
      const TEMPLATE_ID = "template_f2utfep";

      const res = await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm);

      if (res?.status === 200) {
        showHint("✅ Message sent! I'll reply soon.", true);
        contactForm.reset();
      } else {
        showHint("❌ Could not send. Please try again.", false);
      }
    } catch (err) {
      console.error(err);
      showHint("❌ Error sending. You can email me directly.", false);
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
