// ===================
// INICIALIZACIÓN Y CONFIGURACIÓN
// ===================

document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  initScrollAnimations();
  initNavigation();
  initCarousel();
  initContactForm();
  initFloatingButtons();
  initPerformanceOptimizations();
}

// ===================
// SCROLL ANIMATIONS RESPONSIVE
// ===================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Observe all fade-in and methodology step elements
  document.querySelectorAll('.fade-in, .methodology-step').forEach(el => {
    observer.observe(el);
  });
}

// ===================
// NAVEGACIÓN RESPONSIVE
// ===================

function initNavigation() {
  // Navbar scroll effect
  let ticking = false;
  
  function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Close mobile menu when clicking links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });

  // Update active navigation links
  updateActiveNavigation();
}

function updateActiveNavigation() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function setActiveLink() {
    let currentSection = '';
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', throttle(setActiveLink, 100));
}

// ===================
// CARRUSEL RESPONSIVE
// ===================

class ResponsiveCarousel {
  constructor() {
    // DOM Elements
    this.track = document.getElementById('cardsTrack');
    this.cards = Array.from(document.querySelectorAll('.minimal-card'));
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.navDots = document.getElementById('navDots');
    this.autoplayToggle = document.getElementById('autoplayToggle');
    this.progressBar = document.getElementById('progressBar');
    
    // State
    this.currentIndex = 0;
    this.isAutoplay = true;
    this.autoplayInterval = null;
    this.autoplayDuration = 5000;
    this.isTouch = false;
    
    // Check if elements exist
    if (!this.track || !this.cards.length) {
      return;
    }
    
    this.init();
  }

  init() {
    this.createNavDots();
    this.updateCarousel();
    this.bindEvents();
    this.startAutoplay();
    this.detectTouchDevice();
  }

  detectTouchDevice() {
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  createNavDots() {
    if (!this.navDots) return;
    
    this.navDots.innerHTML = '';
    
    this.cards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `nav-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir al slide ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      this.navDots.appendChild(dot);
    });
  }

  updateCarousel() {
    // Update track position
    const translateX = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${translateX}%)`;
    
    // Update active card
    this.cards.forEach((card, index) => {
      card.classList.toggle('active', index === this.currentIndex);
    });
    
    // Update navigation dots
    const dots = this.navDots?.querySelectorAll('.nav-dot');
    dots?.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
    
    // Update navigation buttons
    if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.cards.length - 1;
    
    // Update progress bar
    this.updateProgress();
    
    // Animate counters in active card
    this.animateCounters();
  }

  updateProgress() {
    if (!this.progressBar) return;
    const progress = ((this.currentIndex + 1) / this.cards.length) * 100;
    this.progressBar.style.width = `${progress}%`;
  }

  animateCounters() {
    const activeCard = this.cards[this.currentIndex];
    if (!activeCard) return;
    
    const counters = activeCard.querySelectorAll('.metric-value');
    
    counters.forEach(counter => {
      const target = counter.textContent;
      const numericTarget = parseInt(target.replace(/[^\d]/g, ''));
      
      if (!isNaN(numericTarget)) {
        this.animateValue(counter, 0, numericTarget, 1000, target);
      }
    });
  }

  animateValue(element, start, end, duration, originalFormat) {
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.max((endTime - now) / duration, 0);
      const value = Math.round(end - (remaining * range));
      
      // Preserve original formatting
      if (originalFormat.includes('%')) {
        element.textContent = value + '%';
      } else if (originalFormat.includes('K+')) {
        element.textContent = value + 'K+';
      } else if (originalFormat.includes('+')) {
        element.textContent = value + '+';
      } else {
        element.textContent = value;
      }
      
      if (value === end) {
        clearInterval(timer);
      }
    }, stepTime);
  }

  goToSlide(index) {
    if (index >= 0 && index < this.cards.length) {
      this.currentIndex = index;
      this.updateCarousel();
      this.resetAutoplay();
    }
  }

  nextSlide() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
    } else if (this.isAutoplay) {
      this.currentIndex = 0; // Loop back to first
    }
    this.updateCarousel();
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
      this.resetAutoplay();
    }
  }

  startAutoplay() {
    if (this.isAutoplay && !this.isTouch) {
      this.autoplayInterval = setInterval(() => {
        this.nextSlide();
      }, this.autoplayDuration);
    }
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    if (this.isAutoplay) {
      this.stopAutoplay();
      setTimeout(() => this.startAutoplay(), 1000);
    }
  }

  toggleAutoplay() {
    this.isAutoplay = !this.isAutoplay;
    if (this.autoplayToggle) {
      this.autoplayToggle.classList.toggle('paused', !this.isAutoplay);
    }
    
    if (this.isAutoplay) {
      this.startAutoplay();
    } else {
      this.stopAutoplay();
    }
  }

  bindEvents() {
    // Navigation buttons
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());
    
    // Autoplay toggle
    this.autoplayToggle?.addEventListener('click', () => this.toggleAutoplay());
    
    // Pause on hover (desktop only)
    if (!this.isTouch) {
      this.track?.addEventListener('mouseenter', () => {
        if (this.isAutoplay) this.stopAutoplay();
      });
      
      this.track?.addEventListener('mouseleave', () => {
        if (this.isAutoplay) this.startAutoplay();
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.isCarouselInView()) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            this.prevSlide();
            break;
          case 'ArrowRight':
            e.preventDefault();
            this.nextSlide();
            break;
          case ' ':
            e.preventDefault();
            this.toggleAutoplay();
            break;
        }
      }
    });
    
    // Touch/swipe support
    this.addTouchSupport();
    
    // Intersection Observer for performance
    this.addIntersectionObserver();
    
    // Resize handler
    window.addEventListener('resize', debounce(() => {
      this.updateCarousel();
    }, 250));
  }

  addTouchSupport() {
    if (!this.track) return;
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.stopAutoplay();
    }, { passive: true });
    
    this.track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });
    
    this.track.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      
      const diff = startX - currentX;
      const threshold = 50;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
      
      this.resetAutoplay();
    }, { passive: true });
  }

  addIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (this.isAutoplay && !this.autoplayInterval && !this.isTouch) {
            this.startAutoplay();
          }
        } else {
          this.stopAutoplay();
        }
      });
    }, {
      threshold: 0.3
    });
    
    if (this.track) {
      observer.observe(this.track);
    }
  }

  isCarouselInView() {
    if (!this.track) return false;
    const rect = this.track.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  }
}

function initCarousel() {
  window.responsiveCarousel = new ResponsiveCarousel();
}

// ===================
// FLOATING BUTTONS RESPONSIVE
// ===================

function initFloatingButtons() {
  let ticking = false;
  
  function updateFloatingButtons() {
    const backToTop = document.querySelector('.back-to-top');
    const floatingAgendar = document.querySelector('.floating-agendar');
    const scrollY = window.scrollY;
    
    // Back to top button
    if (backToTop) {
      if (scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }

    // Floating agendar button
    if (floatingAgendar) {
      if (scrollY > 400) {
        floatingAgendar.classList.add('show');
      } else {
        floatingAgendar.classList.remove('show');
      }
    }
    
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateFloatingButtons);
      ticking = true;
    }
  });
}

// ===================
// FORMULARIO DE CONTACTO RESPONSIVE
// ===================

function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  // Character counters
  initCharacterCounters();
  
  // Form validation and submission
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const nombre = formData.get('nombre')?.trim();
    const email = formData.get('email')?.trim();
    const empresa = formData.get('empresa')?.trim();
    const pais = formData.get('pais');
    const mensaje = formData.get('mensaje')?.trim();
    
    // Validation
    if (!validateForm(nombre, email, empresa, pais, mensaje)) {
      return;
    }
    
    // Submit form
    submitForm(this, { nombre, email, empresa, pais, mensaje });
  });
}

function initCharacterCounters() {
  const nameInput = document.querySelector('input[name="nombre"]');
  const messageTextarea = document.querySelector('.message-textarea');
  const nameCounter = document.querySelector('.character-count');
  const messageCounter = document.querySelector('.character-count-message');
  
  if (nameInput && nameCounter) {
    nameInput.addEventListener('input', function() {
      const length = this.value.length;
      nameCounter.textContent = `${length}/255`;
      nameCounter.style.color = length > 200 ? '#ff3366' : 'rgba(255, 255, 255, 0.6)';
    });
  }
  
  if (messageTextarea && messageCounter) {
    messageTextarea.addEventListener('input', function() {
      const length = this.value.length;
      messageCounter.textContent = `${length}/300`;
      
      if (length < 30) {
        messageCounter.style.color = '#ff3366';
      } else if (length > 250) {
        messageCounter.style.color = '#ffc107';
      } else {
        messageCounter.style.color = 'rgba(255, 255, 255, 0.6)';
      }
    });
  }
}

function validateForm(nombre, email, empresa, pais, mensaje) {
  // Required fields validation
  if (!nombre || !email || !empresa || !pais || !mensaje) {
    showNotification('Por favor, completa todos los campos obligatorios', 'error');
    return false;
  }
  
  // Email validation
  if (!isValidEmail(email)) {
    showNotification('Por favor, ingresa un email válido', 'error');
    return false;
  }
  
  // Message length validation
  if (mensaje.length < 30) {
    showNotification('El mensaje debe tener al menos 30 caracteres', 'error');
    return false;
  }
  
  if (mensaje.length > 300) {
    showNotification('El mensaje no puede exceder 300 caracteres', 'error');
    return false;
  }
  
  return true;
}

function submitForm(form, data) {
  const submitBtn = form.querySelector('.btn-contact');
  if (!submitBtn) return;
  
  // Show loading state
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
  submitBtn.disabled = true;
  
  // Simulate form submission
  setTimeout(() => {
    showNotification('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
    form.reset();
    updateCharacterCounters();
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 2000);
}

function updateCharacterCounters() {
  const nameCounter = document.querySelector('.character-count');
  const messageCounter = document.querySelector('.character-count-message');
  
  if (nameCounter) {
    nameCounter.textContent = '0/255';
    nameCounter.style.color = 'rgba(255, 255, 255, 0.6)';
  }
  
  if (messageCounter) {
    messageCounter.textContent = '0/300';
    messageCounter.style.color = 'rgba(255, 255, 255, 0.6)';
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 10000;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 350px;
    word-wrap: break-word;
  `;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto hide
  setTimeout(() => {
    hideNotification(notification);
  }, 5000);
  
  // Close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn?.addEventListener('click', () => hideNotification(notification));
}

function hideNotification(notification) {
  notification.style.transform = 'translateX(100%)';
  setTimeout(() => {
    notification.remove();
  }, 300);
}

// ===================
// PERFORMANCE OPTIMIZATIONS
// ===================

function initPerformanceOptimizations() {
  // Lazy loading for images
  initLazyLoading();
  
  // Intersection observer for animations
  initAnimationObserver();
  
  // Parallax effect (desktop only)
  if (!isMobileDevice()) {
    initParallaxEffect();
  }
}

function initLazyLoading() {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

function initAnimationObserver() {
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        // For methodology steps, add staggered animation
        if (entry.target.classList.contains('methodology-step')) {
          const steps = document.querySelectorAll('.methodology-step');
          const index = Array.from(steps).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('animate');
          }, index * 200);
        }
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.fade-in, .methodology-step').forEach(el => {
    animationObserver.observe(el);
  });
}

function initParallaxEffect() {
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
      const rate = scrolled * -0.3;
      heroContent.style.transform = `translateY(${rate}px)`;
    }
    
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

// ===================
// UTILITY FUNCTIONS
// ===================

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
}

function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ===================
// RESPONSIVE BEHAVIOR ADJUSTMENTS
// ===================

// Adjust behavior based on screen size
function adjustForScreenSize() {
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth <= 968 && window.innerWidth > 768;
  
  // Disable autoplay on mobile for better UX
  if (isMobile && window.responsiveCarousel) {
    window.responsiveCarousel.isAutoplay = false;
    window.responsiveCarousel.stopAutoplay();
  }
  
  // Adjust animation durations for mobile
  if (isMobile || isReducedMotion()) {
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
  }
}

// Listen for screen size changes
window.addEventListener('resize', debounce(adjustForScreenSize, 250));

// ===================
// INTERACTION ENHANCEMENTS
// ===================

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
  if (e.target.matches('.card-action, .btn-contact, .hero-cta')) {
    createRippleEffect(e);
  }
});

function createRippleEffect(e) {
  const button = e.target;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
    z-index: 1;
  `;
  
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// ===================
// ACCESSIBILITY IMPROVEMENTS
// ===================

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
  // Focus management
  if (e.key === 'Tab') {
    const focusableElements = document.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
    );
    
    // Skip hidden elements
    const visibleElements = Array.from(focusableElements).filter(el => {
      return el.offsetParent !== null && !el.hasAttribute('hidden');
    });
    
    // Ensure proper focus order
    if (e.shiftKey && document.activeElement === visibleElements[0]) {
      e.preventDefault();
      visibleElements[visibleElements.length - 1].focus();
    } else if (!e.shiftKey && document.activeElement === visibleElements[visibleElements.length - 1]) {
      e.preventDefault();
      visibleElements[0].focus();
    }
  }
});

// ===================
// ERROR HANDLING AND FALLBACKS
// ===================

// Global error handler
window.addEventListener('error', function(e) {
  console.warn('Script error:', e.error);
  // Graceful degradation - ensure basic functionality still works
});

// Intersection Observer fallback
if (!window.IntersectionObserver) {
  // Fallback for older browsers
  document.querySelectorAll('.fade-in, .methodology-step').forEach(el => {
    el.classList.add('animate');
  });
}

// ===================
// INITIALIZATION CHECK
// ===================

// Ensure everything is loaded before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Final initialization check
window.addEventListener('load', () => {
  // Remove any loading states
  document.body.classList.add('loaded');
  
  // Final screen size adjustment
  adjustForScreenSize();
  
  console.log('IRL Tech Solutions - Website loaded successfully');
});

// external js: flickity.pkgd.js