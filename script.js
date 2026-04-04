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

    // Make the TorusKnot smaller as requested (radius from 1.5 -> 1.0, tube from 0.4 -> 0.25)
    const geometry = new THREE.TorusKnotGeometry(1.0, 0.25, 100, 16);
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
    
    // Raycaster for hover interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isHovered = false;

    // Listen to scroll to adjust target rotation
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      targetRotationY = scrollY * 0.005;
      targetRotationX = scrollY * 0.002;
    });

    // Track mouse position over canvas
    window.addEventListener('mousemove', (event) => {
      const rect = canvasContainer.getBoundingClientRect();
      
      // Check if mouse is actually over the canvas
      if (event.clientX >= rect.left && event.clientX <= rect.right && 
          event.clientY >= rect.top && event.clientY <= rect.bottom) {
        
        // Calculate relative coordinates to construct normalized device coordinates
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        mouse.x = (x / rect.width) * 2 - 1;
        mouse.y = -(y / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        // Intersect against the mesh
        const intersects = raycaster.intersectObject(mesh);
        isHovered = intersects.length > 0;
      } else {
        isHovered = false;
      }
    });

    // Reset hover when leaving window
    window.addEventListener('mouseleave', () => {
      isHovered = false;
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

      // Scroll-based rotation
      mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.05;
      mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.05;
      
      // Hover interaction scale and opacity interpolation
      const targetScale = isHovered ? 1.2 : 1.0;
      const targetOpacity = isHovered ? 0.6 : 0.15;
      
      mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      mesh.material.opacity += (targetOpacity - mesh.material.opacity) * 0.1;

      // Uninterrupted passive rotation
      mesh.rotation.y += 0.001;
      mesh.rotation.x += 0.001;

      renderer.render(scene, camera);
    }
    animate();
  }
});
