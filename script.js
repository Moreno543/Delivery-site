const CONTACT_EMAIL = "peke9013@gmail.com";

function buildMailto({ to, subject, body }) {
  const qs = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${encodeURIComponent(to)}?${qs.toString()}`;
}

function formToLines(form) {
  const data = new FormData(form);
  const lines = [];

  for (const [key, raw] of data.entries()) {
    if (raw instanceof File) continue;
    const value = String(raw ?? "").trim();
    if (!value) continue;
    lines.push(`${key.replaceAll("_", " ")}: ${value}`);
  }

  return lines;
}

function initNav() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!header || !toggle || !nav) return;

  function setOpen(isOpen) {
    header.dataset.navOpen = isOpen ? "true" : "false";
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  setOpen(false);

  toggle.addEventListener("click", () => {
    const openNow = header.dataset.navOpen === "true";
    setOpen(!openNow);
  });

  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function initNavDropdown() {
  const dropdown = document.querySelector("[data-nav-dropdown]");
  const trigger = document.querySelector("[data-nav-trigger]");
  const menu = document.querySelector("[data-nav-menu]");
  const label = document.querySelector("[data-nav-label]");
  if (!dropdown || !trigger || !menu) return;

  function setOpen(isOpen) {
    dropdown.classList.toggle("is-open", isOpen);
    trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menu.setAttribute("aria-hidden", isOpen ? "false" : "true");
  }

  setOpen(false);

  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!dropdown.classList.contains("is-open"));
  });

  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-nav-tab]");
    if (a) {
      const tabName = a.getAttribute("data-nav-tab");
      const labels = { about: "About", how: "How it works", careers: "Careers", contact: "Contact" };
      if (label && labels[tabName]) label.textContent = labels[tabName];
      setOpen(false);
    }
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function initTabs() {
  const tabsRoot = document.querySelector("#tabs");
  if (!tabsRoot) return;

  const tabs = Array.from(tabsRoot.querySelectorAll(".tab"));
  const panels = Array.from(tabsRoot.querySelectorAll(".tab-panel"));
  const navLinks = Array.from(document.querySelectorAll("[data-nav-tab]"));

  function activate(name) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === name;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.tabPanel === name;
      panel.toggleAttribute("hidden", !isActive);
      panel.classList.toggle("is-active", isActive);
    });

    navLinks.forEach((link) => {
      const match = link.getAttribute("data-nav-tab") === name;
      link.classList.toggle("nav-active", match);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const name = tab.dataset.tab;
      if (!name) return;
      activate(name);
    });
  });

  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-nav-tab]");
    if (!target) return;
    const name = target.getAttribute("data-nav-tab");
    if (!name) return;
    activate(name);
  });

  // default
  activate("about");
}

function initMailtoForms() {
  const forms = document.querySelectorAll("[data-mailto-form]");
  if (!forms.length) return;

  forms.forEach((form) => {
    const status = form.querySelector("[data-form-status]");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const isQuote = form.hasAttribute("data-quote-form");
      const subject = isQuote
        ? "Quote request — auction item delivery"
        : "Driver application — T & H Delivery";

      const lines = formToLines(form);
      const body = lines.length
        ? lines.join("\n")
        : "Submitted from website form.";

      const href = buildMailto({
        to: CONTACT_EMAIL,
        subject,
        body,
      });

      if (status) {
        status.textContent =
          "Opening your email app with the details. If it doesn't open, email us directly.";
      }

      window.location.href = href;
      form.reset();
    });
  });
}

function initYear() {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}

initNav();
initNavDropdown();
initTabs();
initMailtoForms();
initYear();

