/* ========================================
   INTRO 3D SCENE - Wedding Gate Opening
   Three.js animation: gerbang pernikahan terbuka
   ======================================== */

(function () {
  'use strict';

  let scene, camera, renderer;
  let leftDoor, rightDoor, gateFrame, archDecor;
  let particles = [];
  let petals = [];
  let isAnimating = false;
  let doorOpenProgress = 0;
  let cameraZ = 8;

  const GOLD = 0xc9a84c;
  const GOLD_LIGHT = 0xe8d5a3;
  const CREAM = 0xfaf3e6;
  const DARK = 0x1a1410;

  function init() {
    const canvas = document.getElementById('intro-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(DARK, 0.035);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 2, cameraZ);
    camera.lookAt(0, 1.5, 0);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    createLighting();
    createGate();
    createParticles();
    createPetals();
    createFloor();

    window.addEventListener('resize', onResize);
    animate();
  }

  function createLighting() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0xfaf3e6, 0.3);
    scene.add(ambient);

    // Main spotlight from above
    const spot = new THREE.SpotLight(GOLD_LIGHT, 1.5, 30, Math.PI / 4, 0.5, 1);
    spot.position.set(0, 10, 5);
    spot.castShadow = true;
    scene.add(spot);

    // Point lights for golden glow
    const glow1 = new THREE.PointLight(GOLD, 0.8, 10);
    glow1.position.set(-2, 3, 2);
    scene.add(glow1);

    const glow2 = new THREE.PointLight(GOLD, 0.8, 10);
    glow2.position.set(2, 3, 2);
    scene.add(glow2);

    // Warm back light
    const backLight = new THREE.PointLight(0xffd700, 0.5, 15);
    backLight.position.set(0, 2, -3);
    scene.add(backLight);
  }

  function createGate() {
    const matGold = new THREE.MeshStandardMaterial({
      color: GOLD,
      metalness: 0.8,
      roughness: 0.2,
    });

    const matGoldDark = new THREE.MeshStandardMaterial({
      color: GOLD,
      metalness: 0.9,
      roughness: 0.15,
    });

    // Gate frame - two pillars
    const pillarGeo = new THREE.BoxGeometry(0.3, 4, 0.3);

    const leftPillar = new THREE.Mesh(pillarGeo, matGold);
    leftPillar.position.set(-2.2, 2, 0);
    leftPillar.castShadow = true;
    scene.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, matGold);
    rightPillar.position.set(2.2, 2, 0);
    rightPillar.castShadow = true;
    scene.add(rightPillar);

    // Top arch (curved)
    const archPoints = [];
    for (let i = 0; i <= 20; i++) {
      const t = (i / 20) * Math.PI;
      archPoints.push(new THREE.Vector3(
        Math.cos(t) * 2.2,
        Math.sin(t) * 0.8 + 4,
        0
      ));
    }
    const archCurve = new THREE.CatmullRomCurve3(archPoints);
    const archGeo = new THREE.TubeGeometry(archCurve, 30, 0.12, 8, false);
    const arch = new THREE.Mesh(archGeo, matGold);
    arch.castShadow = true;
    scene.add(arch);

    // Pillar caps (spheres)
    const capGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const leftCap = new THREE.Mesh(capGeo, matGoldDark);
    leftCap.position.set(-2.2, 4.1, 0);
    scene.add(leftCap);

    const rightCap = new THREE.Mesh(capGeo, matGoldDark);
    rightCap.position.set(2.2, 4.1, 0);
    scene.add(rightCap);

    // Arch decoration (center ornament)
    const ornamentGeo = new THREE.TorusGeometry(0.25, 0.06, 12, 24);
    archDecor = new THREE.Mesh(ornamentGeo, matGoldDark);
    archDecor.position.set(0, 4.8, 0);
    scene.add(archDecor);

    // Center diamond shape
    const diamondGeo = new THREE.OctahedronGeometry(0.15, 0);
    const diamond = new THREE.Mesh(diamondGeo, new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.0,
      transparent: true,
      opacity: 0.9,
    }));
    diamond.position.set(0, 4.8, 0.3);
    scene.add(diamond);

    // Doors
    const doorGeo = new THREE.BoxGeometry(1.8, 3.5, 0.1);
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x8B6914,
      metalness: 0.6,
      roughness: 0.4,
    });

    // Left door
    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(-0.1, 0, 0);
    leftDoor = new THREE.Mesh(doorGeo, doorMat);
    leftDoor.position.set(-0.9, 1.75, 0);
    leftDoor.castShadow = true;
    leftDoorPivot.add(leftDoor);

    // Door panels (decorative)
    const panelGeo = new THREE.BoxGeometry(1.3, 1.2, 0.02);
    const panelMat = new THREE.MeshStandardMaterial({
      color: GOLD,
      metalness: 0.7,
      roughness: 0.3,
    });
    const lPanel1 = new THREE.Mesh(panelGeo, panelMat);
    lPanel1.position.set(-0.9, 2.7, 0.07);
    leftDoorPivot.add(lPanel1);

    const lPanel2 = new THREE.Mesh(panelGeo, panelMat);
    lPanel2.position.set(-0.9, 1.2, 0.07);
    leftDoorPivot.add(lPanel2);

    scene.add(leftDoorPivot);
    leftDoor.userData.pivot = leftDoorPivot;

    // Right door
    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(0.1, 0, 0);
    rightDoor = new THREE.Mesh(doorGeo, doorMat);
    rightDoor.position.set(0.9, 1.75, 0);
    rightDoor.castShadow = true;
    rightDoorPivot.add(rightDoor);

    const rPanel1 = new THREE.Mesh(panelGeo, panelMat);
    rPanel1.position.set(0.9, 2.7, 0.07);
    rightDoorPivot.add(rPanel1);

    const rPanel2 = new THREE.Mesh(panelGeo, panelMat);
    rPanel2.position.set(0.9, 1.2, 0.07);
    rightDoorPivot.add(rPanel2);

    scene.add(rightDoorPivot);
    rightDoor.userData.pivot = rightDoorPivot;

    // Door handles
    const handleGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const handleMat = new THREE.MeshStandardMaterial({ color: GOLD_LIGHT, metalness: 0.9, roughness: 0.1 });

    const lHandle = new THREE.Mesh(handleGeo, handleMat);
    lHandle.position.set(-0.2, 1.75, 0.1);
    leftDoorPivot.add(lHandle);

    const rHandle = new THREE.Mesh(handleGeo, handleMat);
    rHandle.position.set(0.2, 1.75, 0.1);
    rightDoorPivot.add(rHandle);

    gateFrame = { leftDoorPivot, rightDoorPivot };

    // Floral decorations on pillars
    createFloralDecor(-2.2, 3.2, 0.2);
    createFloralDecor(2.2, 3.2, 0.2);
    createFloralDecor(0, 5, 0.1);
  }

  function createFloralDecor(x, y, z) {
    const flowerMat = new THREE.MeshStandardMaterial({
      color: 0xf5e6d3,
      metalness: 0.1,
      roughness: 0.8,
    });

    // Small spheres as flower buds
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const r = 0.2;
      const bud = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        flowerMat
      );
      bud.position.set(
        x + Math.cos(angle) * r,
        y + Math.sin(angle) * r,
        z
      );
      scene.add(bud);
    }

    // Center bud
    const center = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.5, roughness: 0.3 })
    );
    center.position.set(x, y, z + 0.05);
    scene.add(center);
  }

  function createParticles() {
    const geo = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sizes[i] = Math.random() * 3 + 1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: GOLD_LIGHT,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);
    particles.push({ mesh: points, positions });
  }

  function createPetals() {
    const petalGeo = new THREE.PlaneGeometry(0.08, 0.12);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xf5c6d0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });

    for (let i = 0; i < 40; i++) {
      const petal = new THREE.Mesh(petalGeo, petalMat.clone());
      petal.position.set(
        (Math.random() - 0.5) * 12,
        Math.random() * 10 + 2,
        (Math.random() - 0.5) * 8
      );
      petal.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      petal.userData.speed = 0.005 + Math.random() * 0.01;
      petal.userData.rotSpeed = (Math.random() - 0.5) * 0.02;
      petal.userData.sway = Math.random() * Math.PI * 2;
      scene.add(petal);
      petals.push(petal);
    }
  }

  function createFloor() {
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1a1410,
      metalness: 0.3,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
  }

  function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Animate particles (twinkle)
    particles.forEach(p => {
      const positions = p.mesh.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.005;
        if (positions[i] < 0) positions[i] = 10;
      }
      p.mesh.geometry.attributes.position.needsUpdate = true;
      p.mesh.rotation.y += 0.0003;
    });

    // Animate petals falling
    petals.forEach(p => {
      p.position.y -= p.userData.speed;
      p.position.x += Math.sin(time + p.userData.sway) * 0.003;
      p.rotation.x += p.userData.rotSpeed;
      p.rotation.z += p.userData.rotSpeed * 0.5;

      if (p.position.y < -1) {
        p.position.y = 12;
        p.position.x = (Math.random() - 0.5) * 12;
      }
    });

    // Arch ornament rotation
    if (archDecor) {
      archDecor.rotation.z += 0.005;
    }

    // Door opening animation
    if (isAnimating && doorOpenProgress < 1) {
      doorOpenProgress += 0.008;
      const eased = easeInOutCubic(Math.min(doorOpenProgress, 1));

      if (gateFrame) {
        gateFrame.leftDoorPivot.rotation.y = eased * (Math.PI / 2.5);
        gateFrame.rightDoorPivot.rotation.y = -eased * (Math.PI / 2.5);
      }

      // Camera moves forward slightly
      camera.position.z = cameraZ - eased * 2;
      camera.lookAt(0, 1.5, -eased * 2);

      // Increase light as doors open
      scene.children.forEach(child => {
        if (child instanceof THREE.PointLight) {
          child.intensity = 0.8 + eased * 1.0;
        }
      });

      if (doorOpenProgress >= 1) {
        isAnimating = false;
      }
    }

    // Idle camera sway
    if (!isAnimating) {
      camera.position.x = Math.sin(time * 0.3) * 0.1;
      camera.position.y = 2 + Math.sin(time * 0.5) * 0.05;
    }

    renderer.render(scene, camera);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Expose start function
  window.startDoorAnimation = function () {
    isAnimating = true;
    doorOpenProgress = 0;
  };

  // Init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
