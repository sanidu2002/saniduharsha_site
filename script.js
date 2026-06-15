"use strict";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("load", () => {
  window.setTimeout(() => $(".loader")?.classList.add("loaded"), reducedMotion ? 0 : 650);
});

$("#currentYear").textContent = new Date().getFullYear();

// Theme and accent preferences
const root = document.documentElement;
const themeToggle = $(".theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");
const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
root.dataset.theme = initialTheme;

themeToggle?.addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  localStorage.setItem("portfolio-theme", next);
});

const paletteToggle = $(".palette-toggle");
const accentPicker = $(".accent-picker");
const savedAccent = localStorage.getItem("portfolio-accent") || "violet";
root.dataset.accent = savedAccent;
$$(".accent-swatch").forEach((swatch) => {
  swatch.classList.toggle("active", swatch.dataset.accent === savedAccent);
  swatch.addEventListener("click", () => {
    root.dataset.accent = swatch.dataset.accent;
    localStorage.setItem("portfolio-accent", swatch.dataset.accent);
    $$(".accent-swatch").forEach((item) => item.classList.toggle("active", item === swatch));
  });
});
paletteToggle?.addEventListener("click", () => accentPicker?.classList.toggle("open"));

// Mobile navigation and header behavior
const menuToggle = $(".menu-toggle");
const navLinks = $("#navLinks");
menuToggle?.addEventListener("click", () => {
  const open = menuToggle.classList.toggle("open");
  navLinks.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});
$$(".nav-links a").forEach((link) => link.addEventListener("click", () => {
  menuToggle?.classList.remove("open");
  navLinks?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

let previousScroll = window.scrollY;
const header = $("#siteHeader");
const backToTop = $(".back-to-top");
const sections = $$("main section[id]");
const navigationLinks = $$(".nav-links a");

const updateScrollUI = () => {
  const currentScroll = window.scrollY;
  header?.classList.toggle("scrolled", currentScroll > 25);
  header?.classList.toggle("hidden", currentScroll > previousScroll && currentScroll > 450 && !navLinks?.classList.contains("open"));
  backToTop?.classList.toggle("visible", currentScroll > 650);
  previousScroll = currentScroll;

  let activeId = "home";
  sections.forEach((section) => {
    if (currentScroll >= section.offsetTop - 180) activeId = section.id;
  });
  navigationLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`));
};
window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

// Reveal animations and number counters
const animateCounter = (element) => {
  if (element.dataset.counted) return;
  element.dataset.counted = "true";
  const target = Number(element.dataset.count);
  if (reducedMotion) {
    element.textContent = `${target}+`;
    return;
  }
  const start = performance.now();
  const duration = 1000;
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    element.textContent = `${Math.floor(target * (1 - Math.pow(1 - progress, 3)))}+`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    $$("[data-count]", entry.target).forEach(animateCounter);
    if (entry.target.matches(".stats-grid")) $$("[data-count]", entry.target).forEach(animateCounter);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });
$$(".reveal").forEach((element) => revealObserver.observe(element));

// Typing headline
const typingText = $("#typingText");
const phrases = [
  "full-stack web applications.",
  "mobile applications.",
  "backend systems and APIs.",
  "modern user experiences.",
  "projects that make a difference."
];
let phraseIndex = 0;
let characterIndex = phrases[0].length;
let deleting = true;

const typeLoop = () => {
  if (!typingText || reducedMotion) return;
  const phrase = phrases[phraseIndex];
  typingText.textContent = phrase.slice(0, characterIndex);
  if (deleting) {
    characterIndex -= 1;
    if (characterIndex <= 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  } else {
    characterIndex += 1;
    if (characterIndex > phrases[phraseIndex].length) {
      deleting = true;
      window.setTimeout(typeLoop, 1200);
      return;
    }
  }
  window.setTimeout(typeLoop, deleting ? 45 : 70);
};
window.setTimeout(typeLoop, 1500);

// Cursor, glow, magnetic buttons, and spotlight cards
const cursorDot = $(".cursor-dot");
const cursorRing = $(".cursor-ring");
const pointerGlow = $(".pointer-glow");
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

window.addEventListener("pointermove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  if (cursorDot) {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }
  if (pointerGlow) {
    pointerGlow.style.left = `${mouseX}px`;
    pointerGlow.style.top = `${mouseY}px`;
  }
});

const animateCursor = () => {
  ringX += (mouseX - ringX) * 0.16;
  ringY += (mouseY - ringY) * 0.16;
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  requestAnimationFrame(animateCursor);
};
if (!reducedMotion) animateCursor();

$$("a, button, input, textarea").forEach((element) => {
  element.addEventListener("mouseenter", () => cursorRing?.classList.add("hovering"));
  element.addEventListener("mouseleave", () => cursorRing?.classList.remove("hovering"));
});

$$(".magnetic").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    if (reducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
    element.style.transform = `translate(${x}px, ${y}px)`;
  });
  element.addEventListener("pointerleave", () => { element.style.transform = ""; });
});

$$(".spotlight").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  });
});

// Skill tabs
const skillTabs = $$(".skill-tab");
const skillPanels = $$(".skill-panel");
const activateSkillPanel = (name) => {
  skillTabs.forEach((tab) => {
    const active = tab.dataset.skillTab === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  skillPanels.forEach((panel) => {
    const active = panel.dataset.skillPanel === name;
    panel.classList.toggle("active", active);
    panel.classList.remove("animate-bars");
    if (active) requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add("animate-bars")));
  });
};
skillTabs.forEach((tab) => tab.addEventListener("click", () => activateSkillPanel(tab.dataset.skillTab)));
activateSkillPanel("frontend");

// Project filters and search
const filterButtons = $$(".filter-button");
const projectSearch = $("#projectSearch");
const projectCards = $$(".project-card[data-project]");
const emptyProjects = $("#emptyProjects");
let activeFilter = "all";

const filterProjects = () => {
  const query = projectSearch?.value.trim().toLowerCase() || "";
  let visibleCount = 0;
  projectCards.forEach((card) => {
    const categoryMatch = activeFilter === "all" || card.dataset.category.split(" ").includes(activeFilter);
    const searchMatch = !query || card.textContent.toLowerCase().includes(query) || card.dataset.title.toLowerCase().includes(query);
    const visible = categoryMatch && searchMatch;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  emptyProjects?.classList.toggle("visible", visibleCount === 0);
};
filterButtons.forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach((item) => item.classList.toggle("active", item === button));
  filterProjects();
}));
projectSearch?.addEventListener("input", filterProjects);

// Certificate modal
const certificateModal = $("#certificateModal");
const modalImage = $(".certificate-modal img");
const modalTitle = $("#certificateModalTitle");
let modalReturnFocus = null;

const closeCertificateModal = () => {
  if (!certificateModal) return;
  certificateModal.hidden = true;
  document.body.classList.remove("modal-open");
  modalReturnFocus?.focus();
};
$$(".certificate-preview").forEach((button) => button.addEventListener("click", () => {
  const card = button.closest("[data-cert-image]");
  modalReturnFocus = button;
  modalImage.src = card.dataset.certImage;
  modalImage.alt = card.dataset.certTitle;
  modalTitle.textContent = card.dataset.certTitle;
  certificateModal.hidden = false;
  document.body.classList.add("modal-open");
  $(".certificate-modal .modal-close")?.focus();
}));
$(".certificate-modal .modal-close")?.addEventListener("click", closeCertificateModal);
certificateModal?.addEventListener("click", (event) => {
  if (event.target === certificateModal) closeCertificateModal();
});

// Command palette
const commandModal = $("#commandModal");
const commandInput = $("#commandInput");
const commandItems = $$(".command-list button, .command-list a");
let selectedCommand = 0;

const visibleCommands = () => commandItems.filter((item) => !item.hidden);
const updateCommandSelection = () => {
  visibleCommands().forEach((item, index) => item.classList.toggle("selected", index === selectedCommand));
};
const openCommandPalette = () => {
  commandModal.hidden = false;
  document.body.classList.add("modal-open");
  commandInput.value = "";
  commandItems.forEach((item) => { item.hidden = false; });
  selectedCommand = 0;
  updateCommandSelection();
  window.setTimeout(() => commandInput.focus(), 20);
};
const closeCommandPalette = () => {
  commandModal.hidden = true;
  document.body.classList.remove("modal-open");
};
$(".command-trigger")?.addEventListener("click", openCommandPalette);
commandModal?.addEventListener("click", (event) => {
  if (event.target === commandModal) closeCommandPalette();
});
commandItems.forEach((item) => item.addEventListener("click", () => {
  const target = item.dataset.commandTarget;
  closeCommandPalette();
  if (target) $(target)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
}));
commandInput?.addEventListener("input", () => {
  const query = commandInput.value.toLowerCase();
  commandItems.forEach((item) => { item.hidden = !item.textContent.toLowerCase().includes(query); });
  selectedCommand = 0;
  updateCommandSelection();
});
commandInput?.addEventListener("keydown", (event) => {
  const items = visibleCommands();
  if (!items.length) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    selectedCommand = (selectedCommand + 1) % items.length;
    updateCommandSelection();
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    selectedCommand = (selectedCommand - 1 + items.length) % items.length;
    updateCommandSelection();
  }
  if (event.key === "Enter") items[selectedCommand]?.click();
});
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    commandModal.hidden ? openCommandPalette() : closeCommandPalette();
  }
  if (event.key === "Escape") {
    if (!certificateModal.hidden) closeCertificateModal();
    if (!commandModal.hidden) closeCommandPalette();
    accentPicker?.classList.remove("open");
  }
});

// Decorative contribution visualization, intentionally not presented as live GitHub data
const contributionGrid = $("#contributionGrid");
if (contributionGrid) {
  const levels = [0, 0, 1, 0, 2, 0, 1, 0, 3, 2, 0, 1, 4, 0, 2, 1, 0, 3, 0, 1, 2, 4, 1, 0, 2, 0, 3, 1, 0, 2, 4, 3, 0, 1, 2, 0, 1];
  for (let column = 0; column < 47; column += 1) {
    for (let row = 0; row < 7; row += 1) {
      const cell = document.createElement("i");
      const level = levels[(column * 3 + row * 5) % levels.length];
      cell.style.setProperty("--level", level);
      contributionGrid.appendChild(cell);
    }
  }
}

// Lightweight particles
const canvas = $("#particleCanvas");
const context = canvas?.getContext("2d");
let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;

const resizeCanvas = () => {
  if (!canvas || !context) return;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth * scale;
  canvas.height = canvasHeight * scale;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  context.setTransform(scale, 0, 0, scale, 0, 0);
  const count = Math.min(70, Math.floor(canvasWidth / 22));
  particles = Array.from({ length: count }, (_, index) => ({
    x: (index * 83) % canvasWidth,
    y: (index * 137) % canvasHeight,
    r: index % 5 === 0 ? 1.2 : 0.65,
    vx: ((index % 7) - 3) * 0.025,
    vy: ((index % 5) + 1) * -0.018,
    alpha: 0.14 + (index % 4) * 0.06
  }));
};

const drawParticles = () => {
  if (!context) return;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    if (particle.x < 0) particle.x = canvasWidth;
    if (particle.x > canvasWidth) particle.x = 0;
    if (particle.y < 0) particle.y = canvasHeight;
    context.beginPath();
    context.fillStyle = `rgba(180, 150, 255, ${particle.alpha})`;
    context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    context.fill();
  });
  if (!reducedMotion) requestAnimationFrame(drawParticles);
};
resizeCanvas();
drawParticles();
window.addEventListener("resize", resizeCanvas);

// Contact form opens the visitor's mail client
const contactForm = $("#contactForm");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();
  if (!name || !email || !message) return;

  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`Hi Sanidu,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`);
  const note = $("#formNote");
  note.textContent = "Your email app is opening. Thanks for reaching out.";
  note.classList.add("success");
  window.location.href = `mailto:saniduharsha2002@gmail.com?subject=${subject}&body=${body}`;
  window.setTimeout(() => {
    note.textContent = "This opens your preferred email app. No data is stored.";
    note.classList.remove("success");
  }, 5000);
});

// Optional synthesized ambient sound, created only after user interaction
const musicToggle = document.querySelector(".music-toggle");

const audio = new Audio("assets/music.mp3");
audio.loop = true;
audio.volume = 0.3;

let isPlaying = false;

musicToggle?.addEventListener("click", () => {

    if (isPlaying) {
        audio.pause();
        musicToggle.classList.remove("active");
    } else {
        audio.play();
        musicToggle.classList.add("active");
    }

    isPlaying = !isPlaying;
});

const startAmbient = async () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioContext = audioContext || new AudioContext();
  await audioContext.resume();
  const master = audioContext.createGain();
  master.gain.value = 0.025;
  master.connect(audioContext.destination);
  [110, 164.81, 220].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = index === 1 ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.value = index === 1 ? 0.35 : 0.2;
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start();
    ambientNodes.push(oscillator, gain);
  });
  ambientNodes.push(master);
  ambientPlaying = true;
  musicToggle?.classList.add("active");
  musicToggle?.setAttribute("aria-label", "Turn off ambient sound");
};

musicToggle?.addEventListener("click", () => {
  if (ambientPlaying) stopAmbient();
  else startAmbient();
});
