// Smooth scroll animations
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');
  const floatingAgendar = document.querySelector('.floating-agendar');
  
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
    backToTop.classList.add('show');
  } else {
    navbar.classList.remove('scrolled');
    backToTop.classList.remove('show');
  }

  // Show floating agendar button after scrolling past hero section
  if (window.scrollY > 300) {
    floatingAgendar.classList.add('show');
  } else {
    floatingAgendar.classList.remove('show');
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Efecto de contador animado para las estadísticas
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 100;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    if (target.toString().includes('%')) {
      element.textContent = Math.floor(current) + '%';
    } else if (target.toString().includes('+')) {
      element.textContent = Math.floor(current) + '+';
    } else if (target.toString().includes('x')) {
      element.textContent = Math.floor(current) + 'x';
    } else {
      element.textContent = Math.floor(current);
    }
  }, 20);
}

// Animar contadores cuando el card entre en vista
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      statNumbers.forEach(stat => {
        const target = stat.textContent;
        let numericTarget = parseInt(target.replace(/[^\d.]/g, ''));
        
        if (target.includes('.')) {
          numericTarget = parseFloat(target.replace(/[^\d.]/g, ''));
        }
        
        animateCounter(stat, numericTarget);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.zoom-card').forEach(card => {
  statsObserver.observe(card);
});

// Efecto de ripple en botones
document.querySelectorAll('.card-button').forEach(button => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
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
    `;
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Añadir animación CSS para ripple
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Funcionalidad adicional del navbar
document.addEventListener('DOMContentLoaded', function() {
  // Cerrar dropdown al hacer click fuera
  document.addEventListener('click', function(e) {
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target) && !e.target.classList.contains('dropdown-toggle')) {
        dropdown.classList.remove('show');
      }
    });
  });

  // Actualizar enlaces activos en navegación
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
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

  window.addEventListener('scroll', updateActiveLink);
});

// Efecto parallax ligero para hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroSection = document.querySelector('.hero-section');
  const heroContent = document.querySelector('.hero-content');
  
  if (heroSection && heroContent) {
    const rate = scrolled * -0.5;
    heroContent.style.transform = `translateY(${rate}px)`;
  }
});

// Lazy loading para imágenes
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// Validación de formulario de contacto
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const empresa = formData.get('empresa');
    const pais = formData.get('pais');
    const mensaje = formData.get('mensaje');
    
    // Validaciones básicas
    if (!nombre || !email || !empresa || !pais || !mensaje) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    if (!isValidEmail(email)) {
      alert('Por favor, ingresa un email válido');
      return;
    }
    
    if (mensaje.length < 30) {
      alert('El mensaje debe tener al menos 30 caracteres');
      return;
    }
    
    // Simular envío de formulario
    showLoadingState();
    
    setTimeout(() => {
      showSuccessMessage();
      this.reset();
      updateCharacterCounts();
    }, 2000);
  });
}

// Contadores de caracteres
function updateCharacterCounts() {
  const nameInput = document.querySelector('input[name="nombre"]');
  const messageTextarea = document.querySelector('.message-textarea');
  const nameCounter = document.querySelector('.character-count');
  const messageCounter = document.querySelector('.character-count-message');
  
  if (nameInput && nameCounter) {
    nameInput.addEventListener('input', function() {
      nameCounter.textContent = `${this.value.length}/255`;
      if (this.value.length > 200) {
        nameCounter.style.color = '#ff3366';
      } else {
        nameCounter.style.color = 'rgba(255, 255, 255, 0.6)';
      }
    });
  }
  
  if (messageTextarea && messageCounter) {
    messageTextarea.addEventListener('input', function() {
      messageCounter.textContent = `${this.value.length}/300`;
      if (this.value.length < 30) {
        messageCounter.style.color = '#ff3366';
      } else if (this.value.length > 250) {
        messageCounter.style.color = '#ffc107';
      } else {
        messageCounter.style.color = 'rgba(255, 255, 255, 0.6)';
      }
    });
  }
}

// Inicializar contadores cuando se carga la página
document.addEventListener('DOMContentLoaded', updateCharacterCounts);

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showLoadingState() {
  const submitBtn = document.querySelector('.btn-contact');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
  }
}

function showSuccessMessage() {
  const submitBtn = document.querySelector('.btn-contact');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje enviado!';
    submitBtn.style.background = '#28a745';
    
    setTimeout(() => {
      submitBtn.innerHTML = 'Enviar mensaje';
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 3000);
  }
}

// Efecto de typing para el título principal
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Inicializar efectos cuando la página esté cargada
window.addEventListener('load', () => {
  // Remover pantalla de carga si existe
  const loader = document.querySelector('.page-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }
  
  // Inicializar animaciones
  document.body.classList.add('loaded');
});

// Optimización de rendimiento - throttle para scroll
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

// Aplicar throttle a eventos de scroll pesados
const throttledScroll = throttle(() => {
  // Aquí van las funciones de scroll que no necesitan ejecutarse en cada frame
}, 100);

window.addEventListener('scroll', throttledScroll);




// Carrusel Minimalista - JavaScript
class MinimalCarousel {
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
    this.autoplayDuration = 5000; // 5 seconds
    
    // Check if elements exist
    if (!this.track || !this.cards.length) {
      console.warn('Carousel elements not found');
      return;
    }
    
    this.init();
  }

  init() {
    this.createNavDots();
    this.updateCarousel();
    this.bindEvents();
    this.startAutoplay();
    
    // Update progress bar
    this.updateProgress();
  }

  createNavDots() {
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
    const dots = this.navDots.querySelectorAll('.nav-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
    
    // Update navigation buttons
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex === this.cards.length - 1;
    
    // Update progress bar
    this.updateProgress();
    
    // Animate counters in active card
    this.animateCounters();
  }

  updateProgress() {
    const progress = ((this.currentIndex + 1) / this.cards.length) * 100;
    this.progressBar.style.width = `${progress}%`;
  }

  animateCounters() {
    const activeCard = this.cards[this.currentIndex];
    const counters = activeCard.querySelectorAll('.metric-value');
    
    counters.forEach(counter => {
      const target = counter.textContent.replace(/[^\d]/g, '');
      if (target && !isNaN(target)) {
        this.animateValue(counter, 0, parseInt(target), 1000);
      }
    });
  }

  animateValue(element, start, end, duration) {
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
      const originalText = element.textContent;
      if (originalText.includes('%')) {
        element.textContent = value + '%';
      } else if (originalText.includes('K+')) {
        element.textContent = value + 'K+';
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
    if (this.isAutoplay) {
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
      this.startAutoplay();
    }
  }

  toggleAutoplay() {
    this.isAutoplay = !this.isAutoplay;
    this.autoplayToggle.classList.toggle('paused', !this.isAutoplay);
    
    if (this.isAutoplay) {
      this.startAutoplay();
    } else {
      this.stopAutoplay();
    }
  }

  bindEvents() {
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Autoplay toggle
    this.autoplayToggle.addEventListener('click', () => this.toggleAutoplay());
    
    // Pause on hover
    this.track.addEventListener('mouseenter', () => {
      if (this.isAutoplay) this.stopAutoplay();
    });
    
    this.track.addEventListener('mouseleave', () => {
      if (this.isAutoplay) this.startAutoplay();
    });
    
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
    window.addEventListener('resize', this.debounce(() => {
      this.updateCarousel();
    }, 250));
  }

  addTouchSupport() {
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
      const threshold = 50; // Minimum swipe distance
      
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
          if (this.isAutoplay && !this.autoplayInterval) {
            this.startAutoplay();
          }
        } else {
          this.stopAutoplay();
        }
      });
    }, {
      threshold: 0.5
    });
    
    observer.observe(this.track);
  }

  isCarouselInView() {
    const rect = this.track.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  }

  debounce(func, wait) {
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

  // Public methods
  destroy() {
    this.stopAutoplay();
    // Remove event listeners if needed
  }

  goTo(index) {
    this.goToSlide(index);
  }

  play() {
    if (!this.isAutoplay) {
      this.toggleAutoplay();
    }
  }

  pause() {
    if (this.isAutoplay) {
      this.toggleAutoplay();
    }
  }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create carousel instance
  const carousel = new MinimalCarousel();
  
  // Optional: Make it globally accessible for debugging
  window.minimalCarousel = carousel;
});

// Optional: Auto-reinitialize on dynamic content changes
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const carouselSection = document.querySelector('.minimal-carousel-section');
        if (carouselSection && !window.minimalCarousel) {
          window.minimalCarousel = new MinimalCarousel();
        }
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}










