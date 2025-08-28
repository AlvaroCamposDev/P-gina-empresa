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




function initializeApp() {
  initScrollAnimations();
  initNavigation();
  initCarousel();
  initHeroCarousel(); // <- ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ AQUÍ
  initContactForm();
  initFloatingButtons();
  initPerformanceOptimizations();
}


// ===================
// HERO CAROUSEL SIMPLE - VERSIÓN QUE FUNCIONA
// ===================

function initHeroCarousel() {
  console.log('Iniciando carrusel hero...'); // Para debug
  
  const slides = document.querySelectorAll('input[name="hero-slider"]');
  if (slides.length === 0) {
    console.error('No se encontraron slides del carrusel');
    return;
  }
  
  let currentIndex = 0;
  let autoplayInterval;
  
  function changeSlide() {
    // Desmarcar todos
    slides.forEach(slide => slide.checked = false);
    
    // Marcar el actual
    slides[currentIndex].checked = true;
    
    // Avanzar índice
    currentIndex = (currentIndex + 1) % slides.length;
    
    console.log('Cambiando a slide:', currentIndex); // Para debug
  }
  
  function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(changeSlide, 2000);
    console.log('Autoplay iniciado'); // Para debug
  }
  
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
      console.log('Autoplay detenido'); // Para debug
    }
  }
  
  // Iniciar inmediatamente
  startAutoplay();
  
  // Controles manuales
  slides.forEach((slide, index) => {
    slide.addEventListener('change', function() {
      if (this.checked) {
        stopAutoplay();
        currentIndex = (index + 1) % slides.length;
        setTimeout(startAutoplay, 5000);
      }
    });
  });
  
  // Pausar en hover (desktop)
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoplay);
    heroSection.addEventListener('mouseleave', startAutoplay);
  }
}

// EJECUTAR INMEDIATAMENTE cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initHeroCarousel, 500); // Esperar medio segundo para asegurar que todo esté cargado
});






/*CARRUSEL DE FUNDADORES*/ 

// ===================================
// TEAM CAROUSEL - JAVASCRIPT
// ===================================

const teamMembers = [
    {
        name: "Rimsky Farías",
        position: "Gerente Comercial"
    },
    {
        name: "Ignacio Galeas", 
        position: "Director de TI"
    },
    {
        name: "Lucas Campos",
        position: "CEO - Director General y operaciones"
    },
    {
        name: "Jaime González",
        position: "Director de Marketing"
    },
    {
        name: "Álvaro Campos",
        position: "Desarrollador Full Stack"
    },
    {
        name: "Carlos Pardo",
        position: "Desarrollador Full Stack"
    }
];

let teamCurrentIndex = 2;

function updateTeamCarousel() {
    const cards = document.querySelectorAll('.team-card');
    const dots = document.querySelectorAll('.team-dot');
    const memberName = document.querySelector('.team-member-name');
    const memberPosition = document.querySelector('.team-member-position');
    
    if (!cards.length || !dots.length || !memberName || !memberPosition) {
        return;
    }
    
    cards.forEach((card, index) => {
        card.classList.remove('center', 'left-1', 'right-1', 'left-2', 'right-2', 'hidden');
        
        const position = index - teamCurrentIndex;
        
        if (position === 0) {
            card.classList.add('center');
        } else if (position === -1 || (position === cards.length - 1 && teamCurrentIndex === 0)) {
            card.classList.add('left-1');
        } else if (position === 1 || (position === -(cards.length - 1) && teamCurrentIndex === cards.length - 1)) {
            card.classList.add('right-1');
        } else if (position === -2 || (position === cards.length - 2 && teamCurrentIndex <= 1)) {
            card.classList.add('left-2');
        } else if (position === 2 || (position === -(cards.length - 2) && teamCurrentIndex >= cards.length - 2)) {
            card.classList.add('right-2');
        } else {
            card.classList.add('hidden');
        }
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === teamCurrentIndex);
    });
    
    memberName.textContent = teamMembers[teamCurrentIndex].name;
    memberPosition.textContent = teamMembers[teamCurrentIndex].position;
}

function nextTeamSlide() {
    teamCurrentIndex = (teamCurrentIndex + 1) % teamMembers.length;
    updateTeamCarousel();
}

function previousTeamSlide() {
    teamCurrentIndex = (teamCurrentIndex - 1 + teamMembers.length) % teamMembers.length;
    updateTeamCarousel();
}

function goToTeamSlide(index) {
    teamCurrentIndex = index;
    updateTeamCarousel();
}

// Inicializar carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar navegación
    document.querySelectorAll('.team-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            goToTeamSlide(index);
        });
    });

    // Configurar botones
    const prevBtn = document.querySelector('.team-prev-arrow');
    const nextBtn = document.querySelector('.team-next-arrow');
    
    if (prevBtn) prevBtn.addEventListener('click', previousTeamSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextTeamSlide);

    // Configurar dots
    document.querySelectorAll('.team-dot').forEach((dot, index) => {
        dot.addEventListener('click', () => goToTeamSlide(index));
    });

    // Auto-play
    let teamAutoPlayInterval = setInterval(nextTeamSlide, 4000);

    // Pausar auto-play al hacer hover
    const carouselWrapper = document.querySelector('.team-carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', () => {
            clearInterval(teamAutoPlayInterval);
        });

        carouselWrapper.addEventListener('mouseleave', () => {
            teamAutoPlayInterval = setInterval(nextTeamSlide, 4000);
        });
    }

    // Inicializar
    setTimeout(updateTeamCarousel, 100);
});





