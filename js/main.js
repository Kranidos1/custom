/**
 * Moenia s.r.l. - Main JavaScript
 * Gestisce header, navigazione e funzionalità generali del sito
 */

class MoeniaSite {
    constructor() {
        this.header = null;
        this.mobileMenuToggle = null;
        this.nav = null;
        this.isMobileMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupHeader();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupFooterVisibility();
        this.setupConfigLoader();
        this.setupIntersectionObserver();
        this.setupStatisticsAnimation();
    }
    
    setupHeader() {
        this.header = document.getElementById('header');
        if (!this.header) return;
        
        // Gestione header trasparente/solido (solo su desktop)
        if (window.innerWidth > 768) {
            window.addEventListener('scroll', () => {
                this.handleHeaderScroll();
            });
        }
        
        // Gestione resize window
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroHeight = document.querySelector('.hero-carousel')?.offsetHeight || 600;
        
        if (scrollTop > heroHeight * 0.3) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        // Gestisci visibilità del footer
        this.updateFooterVisibility(scrollTop, heroHeight);
    }
    
    setupFooterVisibility() {
        this.footer = document.querySelector('.footer');
        if (!this.footer) return;
        
        // Inizializza la visibilità del footer
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroHeight = document.querySelector('.hero-carousel')?.offsetHeight || 600;
        this.updateFooterVisibility(scrollTop, heroHeight);
    }
    
    updateFooterVisibility(scrollTop, heroHeight) {
        if (!this.footer) return;
        
        // Su mobile, il footer rimane sempre visibile
        if (window.innerWidth <= 768) {
            this.footer.classList.remove('hidden');
            return;
        }
        
        // Su desktop, mostra il footer solo quando si raggiunge la fine del sito
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollBottom = scrollTop + windowHeight;
        
        // Mostra il footer quando siamo a 100px dalla fine del documento
        if (scrollBottom >= documentHeight - 100) {
            this.footer.classList.remove('hidden');
        } else {
            this.footer.classList.add('hidden');
        }
    }
    
    setupMobileMenu() {
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.nav = document.querySelector('.nav');
        
        if (!this.mobileMenuToggle || !this.nav) return;
        
        this.mobileMenuToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Chiudi menu mobile quando si clicca su un link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });
        
        // Chiudi menu mobile quando si clicca fuori
        document.addEventListener('click', (e) => {
            if (this.isMobileMenuOpen && 
                !this.nav.contains(e.target) && 
                !this.mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMobileMenuOpen = true;
        this.nav.classList.add('mobile-open');
        this.mobileMenuToggle.classList.add('active');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        
        // Blocca scroll del body
        document.body.style.overflow = 'hidden';
        
        // Debug: verifica che i pulsanti siano visibili
        setTimeout(() => {
            const navItems = this.nav.querySelectorAll('.nav-item');
            const navLinks = this.nav.querySelectorAll('.nav-link');
            console.log('Nav items found:', navItems.length);
            console.log('Nav links found:', navLinks.length);
            
            navItems.forEach((item, index) => {
                const computedStyle = window.getComputedStyle(item);
                console.log(`Nav item ${index + 1}:`, {
                    opacity: computedStyle.opacity,
                    visibility: computedStyle.visibility,
                    display: computedStyle.display,
                    zIndex: computedStyle.zIndex
                });
            });
        }, 100);
        
        console.log('Mobile menu opened with new styling');
    }
    
    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        this.nav.classList.remove('mobile-open');
        this.mobileMenuToggle.classList.remove('active');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
        // Ripristina scroll del body
        document.body.style.overflow = '';
        
        console.log('Mobile menu closed with new styling');
    }
    
    setupSmoothScrolling() {
        // Smooth scroll per link interni
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    this.scrollToSection(target);
                }
            });
        });
    }
    

    

    
    scrollToSection(section) {
        if (!section) return;
        
        const headerHeight = this.header?.offsetHeight || 80;
        const targetPosition = Math.max(0, section.offsetTop - headerHeight);
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    async setupConfigLoader() {
        try {
            const response = await fetch('data/config.json');
            const config = await response.json();
            this.loadConfigData(config);
        } catch (error) {
            console.warn('Config file not found, using default content');
        }
    }
    
    loadConfigData(config) {
        // Carica contenuti dal config
        const configElements = document.querySelectorAll('[data-config]');
        configElements.forEach(element => {
            const configPath = element.getAttribute('data-config');
            const value = this.getNestedValue(config, configPath);
            if (value) {
                if (element.tagName === 'IMG') {
                    element.src = value;
                } else {
                    element.textContent = value;
                }
            }
        });
    }
    
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }
    
    setupIntersectionObserver() {
        // Animazioni al scroll per elementi
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Osserva elementi da animare
        const animateElements = document.querySelectorAll('.feature, .chi-siamo-image');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    handleResize() {
        // Chiudi menu mobile su resize se aperto
        if (this.isMobileMenuOpen && window.innerWidth > 768) {
            this.closeMobileMenu();
        }
        
        // Gestisci il comportamento dell'header su resize
        if (window.innerWidth > 768) {
            // Su desktop, ripristina la logica di scroll
            window.addEventListener('scroll', () => {
                this.handleHeaderScroll();
            });
        } else {
            // Su mobile, rimuovi la classe scrolled
            this.header.classList.remove('scrolled');
        }
    }
    
    // Utility methods
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
    

    
    // Gestione errori immagini
    setupImageErrorHandling() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', () => {
                img.style.display = 'none';
                console.warn(`Image failed to load: ${img.src}`);
            });
        });
        
        // Assicurati che l'immagine del team member non interferisca con il carousel
        const teamMemberImage = document.querySelector('.team-member-card .member-image img');
        if (teamMemberImage) {
            teamMemberImage.style.zIndex = '1';
            teamMemberImage.style.position = 'relative';
        }
    }
    
    setupStatisticsAnimation() {
        // Animazione incremento numeri statistiche
        const statNumbers = document.querySelectorAll('.stat-number-small');
        
        if (statNumbers.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const numberElement = entry.target;
                    this.animateNumber(numberElement);
                    observer.unobserve(numberElement);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });
        
        statNumbers.forEach(numberElement => {
            observer.observe(numberElement);
        });
    }
    
    animateNumber(element) {
        const finalNumber = parseInt(element.textContent.replace('+', ''));
        const duration = 2000; // 2 secondi
        const steps = 60;
        const increment = finalNumber / steps;
        let currentNumber = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            currentNumber = Math.min(increment * step, finalNumber);
            
            if (element.textContent.includes('+')) {
                element.textContent = Math.floor(currentNumber) + '+';
            } else {
                element.textContent = Math.floor(currentNumber);
            }
            
            if (step >= steps) {
                clearInterval(timer);
                // Assicurati che il numero finale sia corretto
                if (element.textContent.includes('+')) {
                    element.textContent = finalNumber + '+';
                } else {
                    element.textContent = finalNumber;
                }
            }
        }, duration / steps);
    }
}

// Inizializza il sito quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    const site = new MoeniaSite();
    
    // Setup error handling per immagini
    site.setupImageErrorHandling();
});

// === WORKFLOW SECTION INTERACTION ===
document.addEventListener('DOMContentLoaded', function () {
    const workflowCards = document.querySelectorAll('.workflow-step-card');
    if (workflowCards.length > 0) {
        workflowCards.forEach(card => {
            const header = card.querySelector('.workflow-step-header');
            header.addEventListener('click', function (e) {
                // Su mobile/tablet: toggle
                if (window.innerWidth <= 991) {
                    if (card.classList.contains('active')) {
                        card.classList.remove('active');
                    } else {
                        workflowCards.forEach(c => c.classList.remove('active'));
                        card.classList.add('active');
                    }
                } else {
                    // Desktop: attiva solo questa
                    workflowCards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                }
            });
        });
        // Attiva il primo step di default su desktop
        if (window.innerWidth > 991) {
            workflowCards[0].classList.add('active');
        }
    }
});

// CSS per menu mobile (aggiunto dinamicamente se necessario)
const mobileMenuCSS = `
@media (max-width: 768px) {
    .nav {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: rgba(0, 43, 73, 0.98);
        backdrop-filter: blur(10px);
        transform: translateY(-100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
    
    .nav.mobile-open {
        transform: translateY(0);
    }
    
    .nav-list {
        flex-direction: column;
        padding: 2rem;
        gap: 1rem;
    }
    
    .nav-link {
        color: var(--text-light) !important;
        font-size: 1.1rem;
        padding: 1rem;
        border-radius: 8px;
        transition: all 0.2s ease;
    }
    
    .nav-link:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--accent-color) !important;
    }
}

.animate-in {
    animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Aggiungi CSS per menu mobile se non presente
if (!document.querySelector('#mobile-menu-styles')) {
    const style = document.createElement('style');
    style.id = 'mobile-menu-styles';
    style.textContent = mobileMenuCSS;
    document.head.appendChild(style);
}

// === GOOGLE MAPS FUNCTION ===
function openGoogleMaps() {
    // Coordinate di Scisciano, Via Palazzuolo 78
    const latitude = 40.9167;
    const longitude = 14.4833;
    const address = "Via Palazzuolo, 78, 80054 Scisciano NA, Italia";
    
    // URL per aprire Google Maps
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    
    // Apri in una nuova finestra/tab
    window.open(mapsUrl, '_blank');
} 