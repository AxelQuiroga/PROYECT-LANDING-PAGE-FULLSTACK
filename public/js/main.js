const form = document.getElementById("lead-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const pageLoader = document.getElementById("page-loader");

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const formResponse = document.getElementById("form-response");
const consultaInput = document.getElementById("consulta");
const consultaError = document.getElementById("consulta-error"); // si querés mensaje



// Base URL de API:
// - En localhost usa el backend local.
// - En produccion usa Render.
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://proyect-landing-page-fullstack.onrender.com";

const submitButton = form.querySelector("button");

// Oculta el loader con una salida suave y luego lo retira del flujo.
function hidePageLoader() {
  if (!pageLoader) return;
  pageLoader.classList.add("is-hidden");
  pageLoader.setAttribute("aria-hidden", "true");

  // Espera a que termine la transición para removerlo del DOM.
  setTimeout(() => {
    pageLoader.remove();
  }, 500);
}

// Espera a que cargue TODO (HTML, CSS, imágenes, etc.).
window.addEventListener("load", () => {
  requestAnimationFrame(hidePageLoader);
});

// Fallback: si ya está cargada la página al ejecutar este script, lo oculta igual.
if (document.readyState === "complete") {
  requestAnimationFrame(hidePageLoader);
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let isValid = true;

  // Reset mensajes
  nameError.textContent = "";
  emailError.textContent = "";
  formResponse.textContent = "";
  consultaError.textContent = "";

  // Validación nombre
  if (nameInput.value.trim().length < 2) {
    nameError.textContent = "El nombre debe tener al menos 2 caracteres";
    isValid = false;
  }

  // Validación email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    emailError.textContent = "Email inválido";
    isValid = false;
  }
  //consulta
  if (consultaInput.value.trim().length < 10) {
  consultaError.textContent = "La consulta debe tener al menos 10 caracteres";
  isValid = false;
}

  if (!isValid) return;

  try {
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";

  const response = await fetch(`${API_BASE_URL}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      consulta: consultaInput.value.trim(),
    }),

  });

  const data = await response.json();

  if (response.ok) {
    formResponse.textContent = "Formulario enviado correctamente. Te contactaremos pronto.";
    formResponse.style.color = "green";
    form.reset();
  } else {
    formResponse.textContent = data.message;
    formResponse.style.color = "red";
    }


} catch (error) {
  formResponse.textContent = "Error de conexión con el servidor.";
  formResponse.style.color = "red";
} finally {
  submitButton.disabled = false;
  submitButton.textContent = "Enviar";
}

});

const stickyNav = document.querySelector(".sticky-nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");

function closeMobileNav() {
  if (!stickyNav || !navToggle) return;
  stickyNav.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
}

if (stickyNav && navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const willOpen = !stickyNav.classList.contains("nav-open");
    stickyNav.classList.toggle("nav-open", willOpen);
    navToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });

  navItems.forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("click", (event) => {
    if (!stickyNav.classList.contains("nav-open")) return;
    if (!stickyNav.contains(event.target)) closeMobileNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMobileNav();
  });
}

const navSectionLinks = Array.from(
  document.querySelectorAll('.nav-links a[href^="#"]')
);
const observedSections = navSectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveNavLink(sectionId) {
  navSectionLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function getClosestSectionId() {
  if (!observedSections.length) return "";

  const navOffset = (stickyNav?.getBoundingClientRect().height || 72) + 24;
  let currentId = observedSections[0].id;

  observedSections.forEach((section) => {
    if (section.getBoundingClientRect().top - navOffset <= 0) {
      currentId = section.id;
    }
  });

  return currentId;
}

if (navSectionLinks.length && observedSections.length) {
  const visibleSections = new Map();

  function applyActiveSection() {
    if (!visibleSections.size) {
      const closestId = getClosestSectionId();
      if (closestId) setActiveNavLink(closestId);
      return;
    }

    let bestId = "";
    let bestRatio = -1;
    visibleSections.forEach((ratio, id) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestId = id;
      }
    });

    if (bestId) setActiveNavLink(bestId);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }
        });
        applyActiveSection();
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.2, 0.35, 0.5, 0.65],
      }
    );

    observedSections.forEach((section) => observer.observe(section));
  }

  navSectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href").slice(1);
      setActiveNavLink(targetId);
    });
  });

  const initialId = window.location.hash
    ? window.location.hash.slice(1)
    : getClosestSectionId();
  if (initialId) setActiveNavLink(initialId);
}
