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

  // ----------------------------------------
  // Three.js 3D Object implementation
  // ----------------------------------------
  const canvasContainer = document.getElementById('three-canvas-container');
  if (canvasContainer && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.appendChild(renderer.domElement);

    // Create a wireframe TorusKnot for a minimalist premium look
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x000000, 
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let targetRotationY = 0;
    let targetRotationX = 0;

    // Listen to scroll to adjust target rotation
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      // The scroll delta controls the rotation, smoothly reversing when scrolling up
      targetRotationY = scrollY * 0.005;
      targetRotationX = scrollY * 0.002;
    });

    // Handle resizing
    window.addEventListener('resize', () => {
      if (!canvasContainer) return;
      camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    });

    function animate() {
      requestAnimationFrame(animate);

      // Smoothly interpolate current rotation to target rotation
      mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.05;
      mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.05;
      
      // Keep it slowly spinning on its own for extra visual life
      mesh.rotation.y += 0.001;
      mesh.rotation.x += 0.001;

      renderer.render(scene, camera);
    }
    animate();
  }
});
