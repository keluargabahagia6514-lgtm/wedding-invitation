/* ========================================
   MAIN 3D SCENE - Background effects
   Partikel bunga, bintang, cincin 3D berputar
   Camera smooth movement on scroll
   ======================================== */

(function () {
  'use strict';

  let scene, camera, renderer;
  let rings = [];
  let floatingStars = [];
  let flowerPetals = [];
  let scrollY = 0;
  let targetScrollY = 0;
  let mouseX = 0, mouseY = 0;
  let isActive = false;

  const GOLD = 0xc9a84c;
  const GOLD_LIGHT = 0xe8d5a3;

  function init() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    createLighting();
    createWeddingRings();
    createStarField();
    createFloatingPetals();
    createCrystalDecorations();

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('mousemove', onMouseMove);

    animate();
  }

  function createLighting() {
    const ambient = new THREE.AmbientLight(0xfaf3e6, 0.4);
    scene.add(ambient);

    const point1 = new THREE.PointLight(GOLD, 0.6, 20);
    point1.position.set(3, 3, 3);
    scene.add(point1);

    const point2 = new THREE.PointLight(GOLD, 0.4, 20);
    point2.position.set(-3, -2, 2);
    scene.add(point2);
  }

  function createWeddingRings() {
    // Main wedding ring
    const ringGeo = new THREE.TorusGeometry(0.8, 0.08, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: GOLD,
      metalness: 0.9,
      roughness: 0.1,
      emissive: GOLD,
      emissiveIntensity: 0.1,
    });

    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.position.set(0, 0, 0);
    scene.add(ring1);
    rings.push({ mesh: ring1, rotSpeed: { x: 0.005, y: 0.008, z: 0.003 }, floatSpeed: 1.2, floatAmp: 0.15 });

    // Second ring (interlocked)
    const ring2Geo = new THREE.TorusGeometry(0.8, 0.06, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: GOLD_LIGHT,
      metalness: 0.85,
      roughness: 0.15,
      emissive: GOLD_LIGHT,
      emissiveIntensity: 0.05,
    });

    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.position.set(0, 0, 0);
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);
    rings.push({ mesh: ring2, rotSpeed: { x: 0.007, y: 0.006, z: 0.004 }, floatSpeed: 1.5, floatAmp: 0.12 });

    // Diamond on ring
    const diamondGeo = new THREE.OctahedronGeometry(0.12, 0);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.0,
      transparent: true,
      opacity: 0.95,
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.position.set(0, 0.85, 0);
    ring1.add(diamond);
  }

  function createStarField() {
    const starCount = 200;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;

      // Gold/white colors
      const isGold = Math.random() > 0.5;
      colors[i * 3] = isGold ? 0.788 : 1;
      colors[i * 3 + 1] = isGold ? 0.659 : 1;
      colors[i * 3 + 2] = isGold ? 0.298 : 1;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);
    floatingStars.push(starField);
  }

  function createFloatingPetals() {
    const petalGeo = new THREE.PlaneGeometry(0.12, 0.18);
    const petalColors = [0xf5c6d0, 0xfce4ec, 0xfff0f5, 0xfde8e0];

    for (let i = 0; i < 25; i++) {
      const color = petalColors[Math.floor(Math.random() * petalColors.length)];
      const petalMat = new THREE.MeshStandardMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });

      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(
        (Math.random() - 0.5) * 15,
        Math.random() * 20 - 5,
        (Math.random() - 0.5) * 10 - 3
      );
      petal.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      petal.userData = {
        speed: 0.003 + Math.random() * 0.008,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        sway: Math.random() * Math.PI * 2,
        swayAmp: 0.003 + Math.random() * 0.005,
      };

      scene.add(petal);
      flowerPetals.push(petal);
    }
  }

  function createCrystalDecorations() {
    const crystalGeo = new THREE.OctahedronGeometry(0.15, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.0,
      transparent: true,
      opacity: 0.4,
    });

    const positions = [
      [-3, 2, -2], [4, -1, -3], [-4, -2, -4], [2, 3, -2],
      [-2, -3, -3], [3, 1, -4], [-1, 4, -2], [0, -4, -3],
    ];

    positions.forEach(pos => {
      const crystal = new THREE.Mesh(crystalGeo, crystalMat.clone());
      crystal.position.set(...pos);
      crystal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      crystal.userData.rotSpeed = (Math.random() - 0.5) * 0.01;
      crystal.userData.floatSpeed = 0.5 + Math.random() * 1;
      crystal.userData.floatAmp = 0.1 + Math.random() * 0.2;
      scene.add(crystal);
    });
  }

  function animate() {
    if (!isActive) {
      requestAnimationFrame(animate);
      return;
    }

    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Smooth scroll tracking
    scrollY += (targetScrollY - scrollY) * 0.05;

    // Camera parallax movement based on scroll
    const scrollFactor = scrollY * 0.0003;
    camera.position.y = -scrollFactor * 3;
    camera.position.x = mouseX * 0.3;
    camera.lookAt(0, camera.position.y - 1, 0);

    // Animate wedding rings
    rings.forEach((r, i) => {
      r.mesh.rotation.x += r.rotSpeed.x;
      r.mesh.rotation.y += r.rotSpeed.y;
      r.mesh.rotation.z += r.rotSpeed.z;

      // Floating effect
      r.mesh.position.y = Math.sin(time * r.floatSpeed + i) * r.floatAmp;
      r.mesh.position.x = Math.cos(time * r.floatSpeed * 0.7 + i) * r.floatAmp * 0.5;
    });

    // Animate star field
    floatingStars.forEach(s => {
      s.rotation.y += 0.0002;
      s.rotation.x += 0.0001;
    });

    // Animate petals
    flowerPetals.forEach(p => {
      p.position.y -= p.userData.speed;
      p.position.x += Math.sin(time + p.userData.sway) * p.userData.swayAmp;
      p.rotation.x += p.userData.rotSpeed;
      p.rotation.z += p.userData.rotSpeed * 0.5;

      if (p.position.y < -8) {
        p.position.y = 12;
        p.position.x = (Math.random() - 0.5) * 15;
      }
    });

    // Animate crystals
    scene.children.forEach(child => {
      if (child.userData && child.userData.rotSpeed) {
        child.rotation.y += child.userData.rotSpeed;
        child.position.y += Math.sin(time * child.userData.floatSpeed) * 0.002;
      }
    });

    renderer.render(scene, camera);
  }

  function onScroll() {
    targetScrollY = window.scrollY;
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Public API
  window.activateScene3D = function () {
    isActive = true;
    if (!renderer) init();
  };

  window.deactivateScene3D = function () {
    isActive = false;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
