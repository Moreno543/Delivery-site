const CONTACT_EMAIL = "peke9013@gmail.com";

// FormSubmit.co sends driver applications directly to your email (no mailto popup).
// First-time setup: FormSubmit will send an activation email to peke9013@gmail.com — click the link once to activate.
const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;

const FIELD_LABELS = {
  name: "Full Name",
  phone: "Phone",
  email: "Email",
  city: "City",
  vehicle: "Vehicle Type",
  availability: "Available Days",
  lift: "Can lift 50+ lbs",
  resume_summary: "Experience Summary",
};

function buildMailto({ to, subject, body }) {
  const encodedBody = encodeURIComponent(body);
  const encodedSubject = encodeURIComponent(subject);
  return `mailto:${encodeURIComponent(to)}?subject=${encodedSubject}&body=${encodedBody}`;
}

function formToBody(form) {
  const data = new FormData(form);
  const lines = [];

  for (const [key, raw] of data.entries()) {
    if (raw instanceof File) continue;
    const value = String(raw ?? "").trim();
    if (!value) continue;
    const label = FIELD_LABELS[key] || key.replaceAll("_", " ");
    lines.push(`${label}: ${value}`);
  }

  return lines.join("\n\n");
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
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const isDriverForm = form.hasAttribute("data-driver-form");

      if (isDriverForm) {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Submitting…";
        }
        if (status) {
          status.textContent = "";
          status.classList.remove("form-success", "form-error");
        }

        const formData = new FormData(form);
        formData.set("_subject", "Driver Application — T & H Delivery");
        formData.set("_template", "table");

        try {
          const res = await fetch(FORMSUBMIT_ENDPOINT, {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" },
          });

          const data = await res.json().catch(() => ({}));

          if (res.ok) {
            if (status) {
              status.textContent = "Thank you for your application. We have received it and will be reviewing your resume. We will be in touch soon.";
              status.classList.add("form-success");
            }
            form.reset();
          } else {
            throw new Error(data.message || "Submission failed");
          }
        } catch (err) {
          if (status) {
            status.textContent = "Something went wrong. Please email us directly at " + CONTACT_EMAIL + " with your resume attached.";
            status.classList.add("form-error");
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit application";
          }
        }
        return;
      }

      const isQuote = form.hasAttribute("data-quote-form");
      const subject = isQuote
        ? "Quote request — auction item delivery"
        : "Driver Application — T & H Delivery";

      const body = formToBody(form) || "Submitted from website form.";

      const href = buildMailto({
        to: CONTACT_EMAIL,
        subject,
        body,
      });

      if (status) {
        status.textContent = "Your email client is opening. Please attach your resume before sending.";
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

