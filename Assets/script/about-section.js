/**
 * About Section Professional - JavaScript separado
 * Funcionalidades: animaciones, contadores, efectos interactivos
 */

// Configuración global
const ABOUT_CONFIG = {
    animationDelay: 100,
    countAnimationDuration: 2000,
    observerThreshold: 0.1,
    observerRootMargin: '0px 0px -100px 0px'
};

// Estado de la aplicación
let hasAnimated = false;
let statCounters = [];

// Función para animar números (contador)
function animateCounter(element, start, end, duration) {
    if (start === end) return;
    
    const range = end - start;
    const minTimer = 50;
    const stepTime = Math.abs(Math.floor(duration / range));
    const timer = Math.max(stepTime, minTimer);
    
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    
    function run() {
        const now = new Date().getTime();
        const remaining = Math.max((endTime - now) / duration, 0);
        const value = Math.round(end - (remaining * range));
        
        // Mantener el símbolo original (+, %)
        const originalText = element.getAttribute('data-original') || element.textContent;
        const symbol = originalText.includes('+') ? '+' : originalText.includes('%') ? '%' : '';
        element.textContent = value === end ? end + symbol : value;
        
        if (value === end) {
            clearInterval(timer);
        }
    }
    
    const intervalId = setInterval(run, timer);
    run();
    
    return intervalId;
}

// Función para animar las estadísticas
function animateStats() {
    if (hasAnimated) return;
    
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach((stat, index) => {
        const text = stat.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        
        // Guardar texto original
        stat.setAttribute('data-original', text);
        stat.textContent = '0';
        
        // Animar después de un delay
        setTimeout(() => {
            const counterId = animateCounter(stat, 0, number, ABOUT_CONFIG.countAnimationDuration);
            statCounters.push(counterId);
        }, index * ABOUT_CONFIG.animationDelay);
    });
    
    hasAnimated = true;
}

// Intersection Observer para activar animaciones
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar elemento
                entry.target.classList.add('fade-in');
                
                // Si es la sección de estadísticas, animar números
                if (entry.target.classList.contains('about-stats')) {
                    animateStats();
                }
            }
        });
    }, {
        threshold: ABOUT_CONFIG.observerThreshold,
        rootMargin: ABOUT_CONFIG.observerRootMargin
    });

    // Observar elementos animables
    const elementsToAnimate = document.querySelectorAll('.about-content > *, .about-visual, .visual-card');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Efectos de hover mejorados para las cards visuales
function initCardEffects() {
    const visualCards = document.querySelectorAll('.visual-card');
    
    visualCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Pausar animación de floating al hacer hover
            this.style.animationPlayState = 'paused';
        });
        
        card.addEventListener('mouseleave', function() {
            // Reanudar animación de floating
            this.style.animationPlayState = 'running';
        });
        
        // Efecto de click
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Efectos de interacción para estadísticas
function initStatsEffects() {
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Efecto visual al hacer click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Opcional: Mostrar información adicional
            showStatDetail(index);
        });
        
        // Efecto de teclado para accesibilidad
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Mostrar detalles de estadística
function showStatDetail(index) {
    const details = [
        'Más de 50 proyectos exitosos completados en diversos sectores',
        '98% de satisfacción del cliente verificada por encuestas',
        '5 años de experiencia sólida en el mercado tecnológico'
    ];
    
    // Crear tooltip temporal
    const tooltip = document.createElement('div');
    tooltip.textContent = details[index];
    tooltip.className = 'stat-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 300px;
        background: rgba(102, 126, 234, 0.95);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        z-index: 1000;
        font-size: 0.9rem;
        line-height: 1.4;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(tooltip);
    
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.remove();
        }
    }, 4000);
}

// Parallax sutil para el fondo
function initParallaxEffect() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const aboutSection = document.querySelector('.about-section');
        
        if (aboutSection) {
            const rate = scrolled * -0.3;
            aboutSection.style.backgroundPosition = `center ${rate}px`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // Solo activar en desktop para mejor rendimiento
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', requestTick);
        return requestTick;
    }
    
    return null;
}

// Funcionalidad del botón CTA
function initCTATracking() {
    const ctaButton = document.querySelector('.cta-button');
    const secondaryCTA = document.querySelector('.cta-secondary');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            // Analytics tracking si está disponible
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    event_category: 'engagement',
                    event_label: 'agendar_reunion_about'
                });
            }
            
            // Efecto visual
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
            
            console.log('CTA clicked: Agendar reunión');
        });
    }
    
    if (secondaryCTA) {
        secondaryCTA.addEventListener('click', function(e) {
            // Smooth scroll si es un enlace interno
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            
            // Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'secondary_cta_click', {
                    event_category: 'engagement',
                    event_label: 'ver_casos_exito'
                });
            }
            
            console.log('Secondary CTA clicked: Ver casos de éxito');
        });
    }
}

// Detección de preferencias de movimiento reducido
function respectMotionPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Desactivar animaciones complejas
        const style = document.createElement('style');
        style.textContent = `
            .visual-card {
                animation: none !important;
            }
            .stat-item:hover {
                transform: none !important;
            }
            .cta-button:hover {
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
        console.log('Reduced motion preferences detected');
    }
}

// Función de inicialización principal
function initAboutSection() {
    try {
        // Verificar que la sección existe
        const aboutSection = document.querySelector('.about-section');
        if (!aboutSection) {
            console.warn('About section not found');
            return;
        }
        
        // Inicializar todas las funcionalidades
        initScrollAnimations();
        initCardEffects();
        initStatsEffects();
        initCTATracking();
        respectMotionPreferences();
        
        // Parallax solo en desktop
        const parallaxCleanup = initParallaxEffect();
        
        // Guardar función de limpieza
        if (parallaxCleanup && window.innerWidth > 768) {
            window.aboutParallaxCleanup = parallaxCleanup;
        }
        
        console.log('About section initialized successfully');
        
    } catch (error) {
        console.error('Error initializing about section:', error);
    }
}

// Función para limpiar eventos al salir de la página
function cleanupAboutSection() {
    // Limpiar contadores activos
    statCounters.forEach(counter => clearInterval(counter));
    statCounters = [];
    
    // Remover tooltips activos
    const tooltips = document.querySelectorAll('.stat-tooltip');
    tooltips.forEach(tooltip => tooltip.remove());
    
    console.log('About section cleanup completed');
}

// Manejo de resize de ventana
function handleWindowResize() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const aboutSection = document.querySelector('.about-section');
            if (!aboutSection) return;
            
            // Reactivar parallax si cambia a desktop
            if (window.innerWidth > 768 && !window.aboutParallaxActive) {
                initParallaxEffect();
                window.aboutParallaxActive = true;
            } else if (window.innerWidth <= 768) {
                window.aboutParallaxActive = false;
            }
            
            console.log('Window resized, about section adjusted');
        }, 250);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initAboutSection();
    handleWindowResize();
});

window.addEventListener('beforeunload', cleanupAboutSection);

// Agregar estilos dinámicos para animaciones
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .stat-tooltip {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(dynamicStyles);

// Exportar funciones para uso global si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAboutSection,
        animateStats,
        cleanupAboutSection
    };
}