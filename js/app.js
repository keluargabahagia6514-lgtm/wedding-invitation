/* ========================================
   WEDDING INVITATION - APP LOGIC
   Modern Elegant Version
   ======================================== */

(function() {
  'use strict';

  // ===== CONFIGURATION =====
  const CONFIG = {
    weddingDate: new Date('2026-12-28T08:00:00+07:00'),
    musicUrl: 'assets/music/background.mp3',
    musicFallback: 'assets/music/background.wav',
    guestName: 'Tamu Undangan'
  };

  // ===== STATE =====
  let audio = null;
  let isPlaying = false;
  let swiper = null;

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initCover();
    initPetals();
    initCountdown();
    initNavigation();
    initMusic();
    initGallery();
    initWishes();
    initScrollAnimations();
    initScrollToTop();
    initCopyButtons();
  });

  // ===== LOADING SCREEN =====
  function initLoadingScreen() {
    const loader = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 800);
      }, 1500);
    });
  }

  // ===== COVER PAGE =====
  function initCover() {
    const btnOpen = document.getElementById('btn-open');
    const mainContent = document.getElementById('main-content');
    const cover = document.getElementById('cover');

    // Get guest name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
      document.getElementById('guest-name').textContent = guestName;
      CONFIG.guestName = guestName;
    }

    btnOpen.addEventListener('click', () => {
      // Fade out cover
      cover.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      cover.style.opacity = '0';
      cover.style.transform = 'scale(1.05)';

      setTimeout(() => {
        cover.style.display = 'none';
        mainContent.classList.remove('hidden');
        document.body.style.overflow = 'auto';

        // Start music
        setTimeout(() => playMusic(), 500);

        // Trigger scroll animations
        triggerScrollAnimations();
      }, 800);
    });

    // Prevent scroll on cover
    document.body.style.overflow = 'hidden';
  }

  // ===== FLOATING PETALS =====
  function initPetals() {
    const containers = document.querySelectorAll('.floating-petals');
    containers.forEach(container => {
      for (let i = 0; i < 15; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (8 + Math.random() * 12) + 's';
        petal.style.animationDelay = Math.random() * 10 + 's';
        petal.style.opacity = 0.1 + Math.random() * 0.2;
        petal.style.transform = `scale(${0.5 + Math.random() * 0.5})`;
        container.appendChild(petal);
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

      if (diff <= 0) {
        elDays.textContent = '0';
        elHours.textContent = '0';
        elMinutes.textContent = '0';
        elSeconds.textContent = '0';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      animateNumber(elDays, days);
      animateNumber(elHours, hours);
      animateNumber(elMinutes, minutes);
      animateNumber(elSeconds, seconds);
    }

    function animateNumber(el, value) {
      const current = parseInt(el.textContent) || 0;
      if (current !== value) {
        el.style.transform = 'scale(1.1)';
        el.textContent = value;
        setTimeout(() => el.style.transform = 'scale(1)', 200);
      }
    }

    update();
    setInterval(update, 1000);
  }

  // ===== NAVIGATION =====
  function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section[id]');

    // Smooth scroll
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(item.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Active state on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === id);
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  // ===== MUSIC =====
  function initMusic() {
    const btn = document.getElementById('music-control');
    audio = new Audio();
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'auto';

    let musicLoaded = false;

    function tryLoad(url) {
      audio.src = url;
      audio.load();
    }

    audio.addEventListener('canplaythrough', () => {
      musicLoaded = true;
    });

    audio.addEventListener('error', () => {
      if (audio.src.includes('.mp3')) {
        tryLoad(CONFIG.musicFallback);
      }
    });

    tryLoad(CONFIG.musicUrl);

    btn.addEventListener('click', () => {
      if (isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  function playMusic() {
    if (!audio) return;
    audio.play().then(() => {
      isPlaying = true;
      updateMusicUI();
    }).catch(() => {
      isPlaying = false;
      updateMusicUI();
    });
  }

  function pauseMusic() {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    updateMusicUI();
  }

  function updateMusicUI() {
    const btn = document.getElementById('music-control');
    btn.classList.toggle('playing', isPlaying);
  }

  // ===== GALLERY (Swiper) =====
  function initGallery() {
    swiper = new Swiper('.gallery-swiper', {
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false
      },
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 1,
      spaceBetween: 0
    });
  }

  // ===== WISHES / GUESTBOOK =====
  function initWishes() {
    const form = document.getElementById('form-wishes');
    const list = document.getElementById('wishes-list');

    // Load existing wishes
    loadWishes();

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('wish-name').value.trim();
      const attendance = document.getElementById('wish-attendance').value;
      const message = document.getElementById('wish-message').value.trim();

      if (!name || !attendance || !message) return;

      const entry = {
        name,
        attendance,
        message,
        time: new Date().toLocaleString('id-ID')
      };

      // Save to localStorage
      const entries = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
      entries.unshift(entry);
      localStorage.setItem('wedding_wishes', JSON.stringify(entries));

      // Add to DOM
      addWishCard(entry, true);

      // Reset form
      form.reset();

      // Show toast
      showToast('Ucapan berhasil dikirim! 💌');
    });
  }

  function loadWishes() {
    const entries = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
    
    if (entries.length === 0) {
      // Show sample wishes
      const samples = [
        { name: 'Budi Santoso', attendance: 'hadir', message: 'Selamat ya Putri & Andika! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin 🤲' },
        { name: 'Rina Wati', attendance: 'hadir', message: 'Barakallahu lakuma wa baraka alaikuma. Semoga langgeng sampai Jannah! 💕' },
        { name: 'Dewi Lestari', attendance: 'ragu', message: 'Selamat menempuh hidup baru! Semoga selalu bahagia. Aku usahakan hadir ya 🙏' }
      ];
      samples.forEach(s => addWishCard(s, false));
    } else {
      entries.forEach(entry => addWishCard(entry, false));
    }
  }

  function addWishCard(entry, isNew) {
    const list = document.getElementById('wishes-list');
    const badgeLabels = {
      hadir: 'Hadir ✅',
      tidak: 'Tidak Hadir ❌',
      ragu: 'Ragu 🤔'
    };

    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      <div class="wish-header">
        <span class="wish-name">${escapeHtml(entry.name)}</span>
        <span class="wish-badge ${entry.attendance}">${badgeLabels[entry.attendance] || ''}</span>
      </div>
      <p class="wish-message">${escapeHtml(entry.message)}</p>
    `;

    if (isNew) {
      list.insertBefore(card, list.firstChild);
    } else {
      list.appendChild(card);
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== SCROLL ANIMATIONS =====
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe fade-up elements
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Observe section headers
    document.querySelectorAll('.section-header, .profile-card, .event-card, .timeline-item, .gift-card, .wish-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  function triggerScrollAnimations() {
    // Immediately show elements in viewport
    setTimeout(() => {
      document.querySelectorAll('.section-header, .profile-card, .event-card, .timeline-item, .gift-card').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    }, 300);
  }

  // ===== SCROLL TO TOP =====
  function initScrollToTop() {
    const btn = document.getElementById('btn-scroll-top');
    
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== COPY BUTTONS =====
  function initCopyButtons() {
    window.copyText = function(text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Berhasil disalin! 📋');
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Berhasil disalin! 📋');
      });
    };
  }

  // ===== TOAST NOTIFICATION =====
  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

})();
