/* ========================================
   APP.JS - Wedding Invitation Logic
   Countdown, RSVP, Guestbook, Music,
   Gallery Carousel, Animations
   ======================================== */

(function () {
  'use strict';

  // ===== CONFIGURATION =====
  const WEDDING_DATE = new Date('2026-12-20T08:00:00+07:00');
  const MUSIC_URL = 'assets/music/background.mp3';
  let audio = null;
  let isPlaying = false;

  // ===== INITIALIZATION =====
  document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initIntro();
    initCountdown();
    initCarousel();
    initGuestbook();
    initMusicPlayer();
    initScrollAnimations();
    initScrollToTop();
    initParallaxEffects();
  });

  // ===== LOADING SCREEN =====
  function initLoadingScreen() {
    const loader = document.getElementById('loading-screen');
    // Simulate loading (wait for assets)
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
          loader.style.display = 'none';
        }, 800);
      }, 1500);
    });
  }

  // ===== INTRO SCREEN =====
  function initIntro() {
    const btnOpen = document.getElementById('btn-open');
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');

    if (!btnOpen) return;

    btnOpen.addEventListener('click', () => {
      // Trigger 3D door opening animation
      if (typeof window.startDoorAnimation === 'function') {
        window.startDoorAnimation();
      }

      // Wait for door animation, then transition
      setTimeout(() => {
        introScreen.classList.add('fade-out');
        mainContent.classList.remove('hidden');

        // Activate 3D background scene
        if (typeof window.activateScene3D === 'function') {
          window.activateScene3D();
        }

        // Auto-play music
        setTimeout(() => {
          playMusic();
        }, 500);

        // Remove intro from DOM after transition
        setTimeout(() => {
          introScreen.style.display = 'none';
        }, 1200);
      }, 2500);
    });
  }

  // ===== COUNTDOWN =====
  function initCountdown() {
    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMinutes = document.getElementById('cd-minutes');
    const elSeconds = document.getElementById('cd-seconds');

    if (!elDays) return;

    function updateCountdown() {
      const now = new Date();
      const diff = WEDDING_DATE - now;

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

      // Animate number change
      animateNumber(elDays, days);
      animateNumber(elHours, hours);
      animateNumber(elMinutes, minutes);
      animateNumber(elSeconds, seconds);
    }

    function animateNumber(el, newValue) {
      const current = parseInt(el.textContent) || 0;
      if (current !== newValue) {
        el.style.transform = 'scale(1.1)';
        el.textContent = newValue;
        setTimeout(() => {
          el.style.transform = 'scale(1)';
        }, 200);
      }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ===== GALLERY CAROUSEL =====
  function initCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    let autoPlayTimer;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
      currentIndex = index;
      if (currentIndex < 0) currentIndex = slides.length - 1;
      if (currentIndex >= slides.length) currentIndex = 0;

      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots
      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      resetAutoPlay();
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
    });

    // Auto-play
    function startAutoPlay() {
      autoPlayTimer = setInterval(() => goToSlide(currentIndex + 1), 4000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    startAutoPlay();
  }

  // ===== GUESTBOOK =====
  function initGuestbook() {
    const form = document.getElementById('form-ucapan');
    const list = document.getElementById('guestbook-list');

    if (!form) return;

    // Load existing messages from localStorage
    loadGuestMessages();

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('gb-name').value.trim();
      const attendance = document.getElementById('gb-attendance').value;
      const message = document.getElementById('gb-message').value.trim();

      if (!name || !attendance || !message) return;

      const entry = {
        name,
        attendance,
        message,
        time: new Date().toLocaleString('id-ID'),
      };

      // Save to localStorage
      const entries = JSON.parse(localStorage.getItem('wedding_guestbook') || '[]');
      entries.unshift(entry);
      localStorage.setItem('wedding_guestbook', JSON.stringify(entries));

      // Add to DOM
      addGuestCard(entry, true);

      // Reset form
      form.reset();

      // Show confirmation
      showToast('Ucapan berhasil dikirim! 💌');
    });
  }

  function loadGuestMessages() {
    const entries = JSON.parse(localStorage.getItem('wedding_guestbook') || '[]');
    entries.forEach(entry => addGuestCard(entry, false));

    // If no entries, show sample
    if (entries.length === 0) {
      const samples = [
        { name: 'Budi Santoso', attendance: 'hadir', message: 'Selamat ya Ahmad & Siti! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin 🤲', time: '19/12/2026' },
        { name: 'Rina Wati', attendance: 'hadir', message: 'Barakallahu lakuma wa baraka alaikuma. Semoga langgeng sampai Jannah! 💕', time: '18/12/2026' },
        { name: 'Dewi Lestari', attendance: 'ragu', message: 'Selamat menempuh hidup baru! Semoga selalu bahagia. Aku usahakan hadir ya 🙏', time: '17/12/2026' },
      ];
      samples.forEach(s => addGuestCard(s, false));
    }
  }

  function addGuestCard(entry, isNew) {
    const list = document.getElementById('guestbook-list');
    const statusLabels = {
      hadir: '✅ Akan Hadir',
      tidak: '❌ Tidak Hadir',
      ragu: '🤔 Masih Ragu',
    };

    const card = document.createElement('div');
    card.classList.add('guest-card');
    if (isNew) card.style.animationDelay = '0s';
    card.innerHTML = `
      <p class="guest-name">${escapeHtml(entry.name)}</p>
      <p class="guest-status">${statusLabels[entry.attendance] || entry.attendance}</p>
      <p class="guest-message">${escapeHtml(entry.message)}</p>
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

  // ===== RSVP =====
  window.submitRSVP = function (status) {
    const thanks = document.getElementById('rsvp-thanks');
    if (thanks) {
      thanks.classList.remove('hidden');
      thanks.style.animation = 'fadeInUp 0.5s ease both';
    }

    // Store RSVP
    localStorage.setItem('wedding_rsvp', status);

    if (status === 'hadir') {
      showToast('Terima kasih! Kami tunggu kehadiran Anda 🎉');
    } else {
      showToast('Terima kasih atas konfirmasinya 🙏');
    }
  };

  // ===== MUSIC PLAYER =====
  function initMusicPlayer() {
    const btnMusic = document.getElementById('btn-music');

    if (!btnMusic) return;

    // Create audio element
    audio = new Audio();
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'auto';

    // Try MP3 first, fallback to WAV
    let musicLoaded = false;

    function tryLoadMusic(url) {
      audio.src = url;
      audio.load();
    }

    audio.addEventListener('canplaythrough', () => {
      musicLoaded = true;
      btnMusic.style.opacity = '1';
      btnMusic.title = 'Play/Pause Musik';
    });

    audio.addEventListener('error', () => {
      // Try WAV fallback if MP3 fails
      if (audio.src.includes('.mp3')) {
        tryLoadMusic('assets/music/background.wav');
      } else {
        btnMusic.style.opacity = '0.5';
        btnMusic.title = 'Musik tidak tersedia';
      }
    });

    tryLoadMusic(MUSIC_URL);

    btnMusic.addEventListener('click', () => {
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
      // Autoplay blocked - user needs to click
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
    const btn = document.getElementById('btn-music');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');

    if (isPlaying) {
      btn.classList.add('playing');
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
    } else {
      btn.classList.remove('playing');
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    }
  }

  // ===== SCROLL ANIMATIONS (Intersection Observer) =====
  function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Animate child elements
          const children = entry.target.querySelectorAll('.glass-card, .timeline-item, .countdown-item');
          children.forEach((child, i) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, i * 150);
          });
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    });

    sections.forEach(section => {
      section.classList.add('reveal');
      observer.observe(section);
    });

    // Make glass cards initially hidden for animation
    document.querySelectorAll('.glass-card, .timeline-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
  }

  // ===== SCROLL TO TOP =====
  function initScrollToTop() {
    const btn = document.getElementById('btn-scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.remove('hidden');
        btn.style.opacity = '1';
      } else {
        btn.style.opacity = '0';
        setTimeout(() => {
          if (window.scrollY <= 500) btn.classList.add('hidden');
        }, 300);
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== PARALLAX EFFECTS =====
  function initParallaxEffects() {
    const sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;

      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distance = (sectionCenter - viewportCenter) / window.innerHeight;

        // Subtle parallax on section backgrounds
        section.style.backgroundPositionY = `${distance * 30}px`;
      });
    });
  }

  // ===== TOAST NOTIFICATION =====
  function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(42, 32, 21, 0.9);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(201, 168, 76, 0.3);
      color: #e8d5a3;
      padding: 14px 28px;
      border-radius: 30px;
      font-size: 0.9rem;
      font-family: 'Montserrat', sans-serif;
      z-index: 9999;
      opacity: 0;
      transition: all 0.4s ease;
      box-shadow: 0 8px 32px rgba(201, 168, 76, 0.2);
    `;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Animate out
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

})();
