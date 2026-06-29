/* ========================================
   WEDDING INVITATION - APP LOGIC
   Envitto Style Version
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
  let loveSwiper = null;
  let gallerySwiper = null;

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    initCover();
    initParticles();
    initCountdown();
    initMusic();
    initLoveStory();
    initGallery();
    initWishes();
    initScrollAnimations();
    initScrollToTop();
    initCopyButtons();
    initSaveDate();
  });

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

    // Prevent scroll on cover
    document.body.style.overflow = 'hidden';

    btnOpen.addEventListener('click', () => {
      cover.classList.add('fade-out');
      
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
  }

  // ===== FLOATING PARTICLES =====
  function initParticles() {
    const container = document.getElementById('cover-particles');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (10 + Math.random() * 15) + 's';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.width = (2 + Math.random() * 4) + 'px';
      particle.style.height = particle.style.width;
      container.appendChild(particle);
    }
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

  // ===== SAVE DATE =====
  function initSaveDate() {
    const btn = document.getElementById('btn-save-date');
    if (!btn) return;

    btn.addEventListener('click', () => {
      // Create calendar event
      const title = 'Pernikahan Putri & Andika';
      const start = '20261228T010000Z';
      const end = '20261228T070000Z';
      const details = 'Akad Nikah & Resepsi - Masjid Al-Ikhlas, Jakarta Selatan';
      const location = 'Masjid Al-Ikhlas, Jl. Merdeka No. 123, Jakarta Selatan';

      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
      
      window.open(googleUrl, '_blank');
      showToast('Mengarahkan ke Google Calendar... 📅');
    });
  }

  // ===== MUSIC =====
  function initMusic() {
    const btn = document.getElementById('music-control');
    audio = new Audio();
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'auto';

    function tryLoad(url) {
      audio.src = url;
      audio.load();
    }

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

  // ===== LOVE STORY SWIPER =====
  function initLoveStory() {
    loveSwiper = new Swiper('.love-swiper', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.love-swiper .swiper-pagination',
        clickable: true
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      grabCursor: true
    });
  }

  // ===== GALLERY SWIPER =====
  function initGallery() {
    gallerySwiper = new Swiper('.gallery-swiper', {
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.gallery-swiper .swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.gallery-swiper .swiper-button-next',
        prevEl: '.gallery-swiper .swiper-button-prev'
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
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements
    document.querySelectorAll('.section-header, .profile-card, .event-card, .dresscode-card, .love-card, .gift-card, .wish-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  function triggerScrollAnimations() {
    setTimeout(() => {
      document.querySelectorAll('.section-header, .profile-card, .event-card, .dresscode-card').forEach(el => {
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
