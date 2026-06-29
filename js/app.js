/* ========================================
   WEDDING INVITATION - 3D PREMIUM APP
   Three.js + Vanilla Tilt + Swiper
   ======================================== */

(function() {
  'use strict';

  const CONFIG = {
    weddingDate: new Date('2026-12-28T08:00:00+07:00'),
    musicUrl: 'assets/music/background.mp3',
    musicFallback: 'assets/music/background.wav'
  };

  let audio = null;
  let isPlaying = false;

  document.addEventListener('DOMContentLoaded', () => {
    init3DBackground();
    initCover();
    initParticles();
    initCountdown();
    initMusic();
    initLoveStory();
    initGallery();
    initWishes();
    initTilt();
    initScrollAnimations();
    initScrollToTop();
    initCopyButtons();
    initSaveDate();
  });

  // ===== THREE.JS 3D BACKGROUND =====
  function init3DBackground() {
    const canvas = document.getElementById('canvas-3d');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Create floating rings
    const rings = [];
    const ringGeo = new THREE.TorusGeometry(1, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: 0xD2B473, 
      transparent: true, 
      opacity: 0.15 
    });

    for (let i = 0; i < 5; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat.clone());
      ring.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      );
      ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      ring.userData = {
        rotSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01 },
        floatSpeed: 0.5 + Math.random() * 0.5,
        floatAmp: 0.3 + Math.random() * 0.3
      };
      scene.add(ring);
      rings.push(ring);
    }

    // Create particles
    const particleCount = 100;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      // Gold color
      colors[i * 3] = 0.824; // R
      colors[i * 3 + 1] = 0.706; // G
      colors[i * 3 + 2] = 0.451; // B
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Create floating diamonds
    const diamonds = [];
    const diamondGeo = new THREE.OctahedronGeometry(0.15, 0);
    const diamondMat = new THREE.MeshBasicMaterial({ 
      color: 0xD2B473, 
      transparent: true, 
      opacity: 0.2,
      wireframe: true
    });

    for (let i = 0; i < 8; i++) {
      const diamond = new THREE.Mesh(diamondGeo, diamondMat.clone());
      diamond.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6
      );
      diamond.userData = {
        rotSpeed: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02 },
        floatSpeed: 0.3 + Math.random() * 0.4,
        floatAmp: 0.2 + Math.random() * 0.3
      };
      scene.add(diamond);
      diamonds.push(diamond);
    }

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Rotate rings
      rings.forEach(ring => {
        ring.rotation.x += ring.userData.rotSpeed.x;
        ring.rotation.y += ring.userData.rotSpeed.y;
        ring.position.y += Math.sin(time * ring.userData.floatSpeed) * 0.002;
      });

      // Rotate diamonds
      diamonds.forEach(diamond => {
        diamond.rotation.x += diamond.userData.rotSpeed.x;
        diamond.rotation.y += diamond.userData.rotSpeed.y;
        diamond.position.y += Math.sin(time * diamond.userData.floatSpeed) * 0.003;
      });

      // Rotate particles
      particles.rotation.y += 0.0003;
      particles.rotation.x += 0.0001;

      // Camera follows mouse slightly
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ===== COVER PAGE =====
  function initCover() {
    const btnOpen = document.getElementById('btn-open');
    const mainContent = document.getElementById('main-content');
    const cover = document.getElementById('cover');

    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
      document.getElementById('guest-name').textContent = guestName;
    }

    document.body.style.overflow = 'hidden';

    btnOpen.addEventListener('click', () => {
      cover.classList.add('fade-out');
      setTimeout(() => {
        cover.style.display = 'none';
        mainContent.classList.remove('hidden');
        document.body.style.overflow = 'auto';
        setTimeout(() => playMusic(), 500);
        triggerScrollAnimations();
      }, 1000);
    });
  }

  // ===== PARTICLES =====
  function initParticles() {
    const containers = document.querySelectorAll('.cover-particles, .section-particles');
    containers.forEach(container => {
      const count = container.classList.contains('cover-particles') ? 25 : 10;
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (10 + Math.random() * 15) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        const size = 2 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        container.appendChild(particle);
      }
    });
  }

  // ===== COUNTDOWN =====
  function initCountdown() {
    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMinutes = document.getElementById('cd-minutes');
    const elSeconds = document.getElementById('cd-seconds');

    function update() {
      const now = new Date();
      const diff = CONFIG.weddingDate - now;
      if (diff <= 0) return;

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      animateNum(elDays, d);
      animateNum(elHours, h);
      animateNum(elMinutes, m);
      animateNum(elSeconds, s);

      // Update progress ring
      const progress = document.querySelector('.countdown-progress');
      if (progress) {
        const totalDays = (CONFIG.weddingDate - new Date('2026-01-01')) / 86400000;
        const elapsed = totalDays - d;
        const percent = elapsed / totalDays;
        progress.style.strokeDashoffset = 565 * (1 - percent);
      }
    }

    function animateNum(el, val) {
      if (parseInt(el.textContent) !== val) {
        el.style.transform = 'scale(1.15)';
        el.textContent = val;
        setTimeout(() => el.style.transform = 'scale(1)', 200);
      }
    }

    update();
    setInterval(update, 1000);
  }

  // ===== SAVE DATE =====
  function initSaveDate() {
    const btn = document.getElementById('btn-save-date');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Pernikahan Putri & Andika')}&dates=20261228T010000Z/20261228T070000Z&details=${encodeURIComponent('Akad Nikah & Resepsi')}&location=${encodeURIComponent('Masjid Al-Ikhlas, Jakarta')}`;
      window.open(url, '_blank');
      showToast('Mengarahkan ke Google Calendar... 📅');
    });
  }

  // ===== MUSIC =====
  function initMusic() {
    const btn = document.getElementById('music-control');
    audio = new Audio();
    audio.loop = true;
    audio.volume = 0.5;

    audio.addEventListener('error', () => {
      if (audio.src.includes('.mp3')) audio.src = CONFIG.musicFallback;
    });

    audio.src = CONFIG.musicUrl;
    btn.addEventListener('click', () => isPlaying ? pauseMusic() : playMusic());
  }

  function playMusic() {
    if (!audio) return;
    audio.play().then(() => { isPlaying = true; updateMusicUI(); }).catch(() => {});
  }

  function pauseMusic() {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    updateMusicUI();
  }

  function updateMusicUI() {
    document.getElementById('music-control').classList.toggle('playing', isPlaying);
  }

  // ===== LOVE STORY =====
  function initLoveStory() {
    new Swiper('.love-swiper', {
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.love-swiper .swiper-pagination', clickable: true },
      effect: 'fade',
      fadeEffect: { crossFade: true },
      grabCursor: true
    });
  }

  // ===== GALLERY =====
  function initGallery() {
    new Swiper('.gallery-swiper', {
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      pagination: { el: '.gallery-swiper .swiper-pagination', clickable: true },
      navigation: { nextEl: '.gallery-swiper .swiper-button-next', prevEl: '.gallery-swiper .swiper-button-prev' },
      effect: 'coverflow',
      coverflowEffect: { rotate: 0, stretch: 0, depth: 100, modifier: 1, slideShadows: false },
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 1
    });
  }

  // ===== TILT EFFECT =====
  function initTilt() {
    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
        max: 10,
        speed: 400,
        glare: true,
        'max-glare': 0.2
      });
    }
  }

  // ===== WISHES =====
  function initWishes() {
    const form = document.getElementById('form-wishes');
    loadWishes();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('wish-name').value.trim();
      const attendance = document.getElementById('wish-attendance').value;
      const message = document.getElementById('wish-message').value.trim();
      if (!name || !attendance || !message) return;

      const entry = { name, attendance, message };
      const entries = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
      entries.unshift(entry);
      localStorage.setItem('wedding_wishes', JSON.stringify(entries));
      addWishCard(entry, true);
      form.reset();
      showToast('Ucapan berhasil dikirim! 💌');
    });
  }

  function loadWishes() {
    const entries = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
    if (entries.length === 0) {
      [
        { name: 'Budi Santoso', attendance: 'hadir', message: 'Selamat ya Putri & Andika! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin 🤲' },
        { name: 'Rina Wati', attendance: 'hadir', message: 'Barakallahu lakuma. Semoga langgeng sampai Jannah! 💕' },
        { name: 'Dewi Lestari', attendance: 'ragu', message: 'Selamat menempuh hidup baru! Aku usahakan hadir ya 🙏' }
      ].forEach(s => addWishCard(s, false));
    } else {
      entries.forEach(e => addWishCard(e, false));
    }
  }

  function addWishCard(entry, isNew) {
    const list = document.getElementById('wishes-list');
    const badges = { hadir: 'Hadir ✅', tidak: 'Tidak ❌', ragu: 'Ragu 🤔' };
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      <div class="wish-header">
        <span class="wish-name">${esc(entry.name)}</span>
        <span class="wish-badge ${entry.attendance}">${badges[entry.attendance] || ''}</span>
      </div>
      <p class="wish-message">${esc(entry.message)}</p>
    `;
    isNew ? list.insertBefore(card, list.firstChild) : list.appendChild(card);
  }

  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  // ===== SCROLL ANIMATIONS =====
  function initScrollAnimations() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.section-header, .glass-card, .profile-card, .event-card, .dresscode-card, .love-card, .gift-card, .wish-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      obs.observe(el);
    });
  }

  function triggerScrollAnimations() {
    setTimeout(() => {
      document.querySelectorAll('.section-header, .glass-card').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    }, 300);
  }

  // ===== SCROLL TO TOP =====
  function initScrollToTop() {
    const btn = document.getElementById('btn-scroll-top');
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ===== COPY =====
  function initCopyButtons() {
    window.copyText = function(text) {
      navigator.clipboard.writeText(text).then(() => showToast('Berhasil disalin! 📋')).catch(() => {
        const t = document.createElement('textarea');
        t.value = text;
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
        showToast('Berhasil disalin! 📋');
      });
    };
  }

  // ===== TOAST =====
  function showToast(msg) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
  }

})();
