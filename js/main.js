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
        this.setupSectionNavigation();
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
        
        // Su desktop, nascondi il footer solo nella sezione del carousel (primi 80% dell'altezza del carousel)
        if (scrollTop < heroHeight * 0.8) {
            this.footer.classList.add('hidden');
        } else {
            this.footer.classList.remove('hidden');
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
    
    setupSectionNavigation() {
        // Variabili per il controllo dello scroll
        this.currentSectionIndex = 0;
        this.sections = [];
        this.sectionDots = [];
        
        // Ottieni tutte le sezioni
        this.sections = document.querySelectorAll('section[id]');
        console.log('Sezioni trovate:', this.sections.length);
        
        // Verifica che le sezioni siano valide
        if (this.sections.length === 0) {
            console.warn('Nessuna sezione trovata! Verifica che le sezioni abbiano un ID.');
            return;
        }
        
        // Log delle sezioni trovate
        this.sections.forEach((section, index) => {
            console.log(`Sezione ${index}:`, section.id, section.offsetTop);
        });
        
        // Setup indicatori delle sezioni
        this.setupSectionIndicators();
        
        // Aggiungi event listener per lo scroll (solo per aggiornare indicatori)
        window.addEventListener('scroll', () => {
            this.handleSectionScroll();
        });
        
        // Inizializza l'indicatore corrente
        this.updateCurrentSection();
        
        // Inizializza la visibilità degli indicatori
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        this.updateSectionIndicatorVisibility(scrollTop, windowHeight);
    }
    
    setupSectionIndicators() {
        const indicator = document.getElementById('sectionIndicator');
        if (!indicator) {
            console.log('Indicatore sezioni non trovato');
            return;
        }
        
        // Ottieni tutti i dots
        this.sectionDots = indicator.querySelectorAll('.section-dot');
        console.log('Dots trovati:', this.sectionDots.length);
        
        // Debug: verifica che i target corrispondano alle sezioni
        this.sectionDots.forEach((dot, index) => {
            const target = dot.getAttribute('data-target');
            const section = document.querySelector(target);
            console.log(`Dot ${index}:`, target, section ? '✓' : '✗');
        });
        
        // Aggiungi event listener per click sui dots
        this.sectionDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const target = dot.getAttribute('data-target');
                const section = document.querySelector(target);
                if (section) {
                    console.log('Click on indicator:', index, target);
                    this.scrollToSection(section);
                } else {
                    console.warn('Section not found:', target);
                }
            });
        });
    }
    
    updateSectionIndicator(activeIndex) {
        if (!this.sectionDots || this.sectionDots.length === 0) {
            console.warn('Nessun indicatore trovato');
            return;
        }
        
        this.sectionDots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        console.log('Indicatore aggiornato:', activeIndex);
    }
    
    handleSectionScroll() {
        this.updateCurrentSection();
    }
    
    updateCurrentSection() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const currentSection = this.getCurrentSection(scrollTop, windowHeight);
        
        // Gestisci visibilità indicatori
        this.updateSectionIndicatorVisibility(scrollTop, windowHeight);
        
        if (currentSection !== this.currentSectionIndex) {
            this.currentSectionIndex = currentSection;
            this.updateSectionIndicator(currentSection);
            console.log('Sezione corrente:', currentSection, 'Scroll position:', scrollTop);
        }
    }
    
    updateSectionIndicatorVisibility(scrollTop, windowHeight) {
        const sectionIndicator = document.getElementById('sectionIndicator');
        if (!sectionIndicator) return;
        
        // Ottieni la sezione carousel
        const carouselSection = document.querySelector('.hero-carousel');
        if (!carouselSection) return;
        
        const carouselTop = carouselSection.offsetTop;
        const carouselHeight = carouselSection.offsetHeight;
        const carouselBottom = carouselTop + carouselHeight;
        
        // Nascondi gli indicatori quando siamo nella sezione carousel (primi 80% dell'altezza)
        if (scrollTop >= carouselTop && scrollTop < carouselTop + (carouselHeight * 0.8)) {
            sectionIndicator.classList.add('hidden');
            console.log('Indicatori nascosti - nel carousel');
        } else {
            sectionIndicator.classList.remove('hidden');
            console.log('Indicatori visibili - fuori dal carousel');
        }
    }
    
    getCurrentSection(scrollTop, windowHeight) {
        let currentIndex = 0;
        
        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const threshold = windowHeight * 0.4; // 40% della viewport
            
            if (scrollTop >= sectionTop - threshold && 
                scrollTop < sectionBottom - threshold) {
                currentIndex = index;
            }
        });
        
        return currentIndex;
    }
    

    
    scrollToSection(section) {
        if (!section) return;
        
        const headerHeight = this.header?.offsetHeight || 80;
        const targetPosition = Math.max(0, section.offsetTop - headerHeight);
        
        // Aggiorna l'indice della sezione corrente
        const sectionIndex = Array.from(this.sections).indexOf(section);
        if (sectionIndex !== -1) {
            this.currentSectionIndex = sectionIndex;
            this.updateSectionIndicator(sectionIndex);
        }
        
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