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
