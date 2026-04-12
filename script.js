// Custom Cursor — only on non-touch devices
if (window.matchMedia('(pointer: fine)').matches) {
const dot = document.createElement('div');
dot.className = 'cursor-dot';
const ring = document.createElement('div');
ring.className = 'cursor-ring';
document.body.appendChild(dot);
document.body.appendChild(ring);

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

let cursorVisible = false;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
  if (!cursorVisible) {
    cursorVisible = true;
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  }
});

document.addEventListener('mouseleave', () => {
  dot.style.opacity = '0';
  ring.style.opacity = '0';
  cursorVisible = false;
});

document.addEventListener('mouseenter', () => {
  dot.style.opacity = '1';
  ring.style.opacity = '1';
  cursorVisible = true;
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { dot.classList.add('hovered'); ring.classList.add('hovered'); });
  el.addEventListener('mouseleave', () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); });
});
} // end pointer: fine

// Navbar scroll transparency
const headerGlass = document.querySelector('.header-glass');
const mainHeader  = document.querySelector('.main-header');
const sections    = document.querySelectorAll('[data-theme]');

function updateHeader() {
  headerGlass.classList.toggle('scrolled', window.scrollY > 10);

  // Use the vertical midpoint of the header to detect which section is behind it
  const headerRect = mainHeader.getBoundingClientRect();
  const headerMid  = (headerRect.top + headerRect.bottom) / 2;

  let theme = 'dark';
  sections.forEach(section => {
    const r = section.getBoundingClientRect();
    if (r.top <= headerMid && r.bottom >= headerMid) {
      theme = section.dataset.theme;
    }
  });

  mainHeader.classList.toggle('nav-light', theme === 'light');
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav-item');

  function toggleMenu() {
    const isOpen = mainNav.classList.contains('open');
    if (isOpen) {
      // Close menu
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    } else {
      // Open menu
      mainNav.classList.add('open');
      menuToggle.classList.add('active');
      body.classList.add('menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
  }

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking a nav link (important for single-page scrolling or anchor links)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) {
        toggleMenu();
      }
    });
  });


});
