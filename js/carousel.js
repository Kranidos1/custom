/**
 * Moenia s.r.l. - Hero Carousel
 * Gestisce il carousel principale con autoplay e controlli manuali
 */

class HeroCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.indicators = [];
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 secondi
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.loadConfig();
        this.createSlides();
        this.createIndicators();
        this.bindEvents();
        this.startAutoplay();
        this.showSlide(0);
    }
    
    async loadConfig() {
        // Usa direttamente i dati delle immagini senza caricare config.json
        this.config = {
            carousel: {
                slides: [
                    {
                        image: "assets/carousel/1.png",
                        title: "Progettazione Architettonica",
                        subtitle: "Soluzioni innovative per il futuro dell'edilizia",
                        cta: "Scopri i nostri progetti",
                        ctaUrl: "#progetti"
                    },
                    {
                        image: "assets/carousel/2.jpg",
                        title: "Consulenza Ingegneristica",
                        subtitle: "Competenza tecnica al servizio dell'innovazione",
                        cta: "I nostri servizi",
                        ctaUrl: "#servizi"
                    },
                    {
                        image: "assets/carousel/3.jpg",
                        title: "Sostenibilità",
                        subtitle: "Progetti eco-compatibili per un futuro migliore",
                        cta: "Contattaci",
                        ctaUrl: "#contatti"
                    },
                    {
                        image: "assets/carousel/4.jpg",
                        title: "Innovazione Tecnologica",
                        subtitle: "Tecnologie all'avanguardia per progetti di eccellenza",
                        cta: "Scopri di più",
                        ctaUrl: "#servizi"
                    },
                    {
                        image: "assets/carousel/5.jpg",
                        title: "Design Sostenibile",
                        subtitle: "Architettura che rispetta l'ambiente e il futuro",
                        cta: "I nostri progetti green",
                        ctaUrl: "#progetti"
                    },
                    {
                        image: "assets/carousel/6.jpg",
                        title: "Eccellenza Progettuale",
                        subtitle: "Qualità e precisione in ogni dettaglio",
                        cta: "Conosci il nostro team",
                        ctaUrl: "#chi-siamo"
                    },
                    {
                        image: "assets/carousel/7.jpg",
                        title: "Soluzioni Personalizzate",
                        subtitle: "Ogni progetto è unico, ogni soluzione è su misura",
                        cta: "Inizia il tuo progetto",
                        ctaUrl: "#contatti"
                    },
                    {
                        image: "assets/carousel/8.jpg",
                        title: "Visione del Futuro",
                        subtitle: "Progettiamo oggi gli spazi di domani",
                        cta: "Collabora con noi",
                        ctaUrl: "#contatti"
                    }
                ]
            }
        };
        console.log('Using hardcoded carousel data:', this.config);
    }
    
    createSlides() {
        const slidesContainer = document.getElementById('carouselSlides');
        if (!slidesContainer) {
            console.error('Carousel slides container not found');
            return;
        }
        
        console.log('Creating slides with config:', this.config.carousel.slides);
        
        this.config.carousel.slides.forEach((slideData, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.style.backgroundImage = `url(${slideData.image})`;
            console.log(`Setting background image for slide ${index + 1}:`, slideData.image);
            slide.setAttribute('aria-hidden', index !== 0);
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Slide ${index + 1} di ${this.config.carousel.slides.length}`);
            
            const content = document.createElement('div');
            content.className = 'carousel-content';
            
            const title = document.createElement('h1');
            title.className = 'carousel-title';
            title.textContent = slideData.title;
            
            const subtitle = document.createElement('p');
            subtitle.className = 'carousel-subtitle';
            subtitle.textContent = slideData.subtitle;
            
            const cta = document.createElement('a');
            cta.className = 'carousel-cta';
            cta.href = slideData.ctaUrl;
            cta.textContent = slideData.cta;
            
            content.appendChild(title);
            content.appendChild(subtitle);
            content.appendChild(cta);
            slide.appendChild(content);
            
            // Verifica che l'immagine esista
            const img = new Image();
            img.onload = () => {
                console.log(`Image loaded successfully: ${slideData.image}`);
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${slideData.image}`);
                // Fallback: usa un colore di sfondo
                slide.style.backgroundImage = 'none';
                slide.style.backgroundColor = '#2c5aa0';
            };
            img.src = slideData.image;
            
            slidesContainer.appendChild(slide);
            this.slides.push(slide);
        });
    }
    
    createIndicators() {
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        if (!indicatorsContainer) return;
        
        this.config.carousel.slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.setAttribute('aria-label', `Vai alla slide ${index + 1}`);
            indicator.setAttribute('role', 'tab');
            indicator.setAttribute('aria-selected', index === 0);
            indicator.setAttribute('aria-controls', `slide-${index}`);
            
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
            
            indicatorsContainer.appendChild(indicator);
            this.indicators.push(indicator);
        });
    }
    
    bindEvents() {
        // Controlli prev/next
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextSlide());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Pause autoplay on hover
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
            carousel.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        // Touch/swipe support
        this.initTouchSupport();
    }
    
    initTouchSupport() {
        const carousel = document.querySelector('.hero-carousel');
        if (!carousel) return;
        
        let startX = 0;
        let endX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    showSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.isTransitioning = true;
        
        // Nascondi slide corrente
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[this.currentSlide].setAttribute('aria-hidden', 'true');
        this.indicators[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].setAttribute('aria-selected', 'false');
        
        // Mostra nuova slide
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');
        this.slides[this.currentSlide].setAttribute('aria-hidden', 'false');
        this.indicators[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].setAttribute('aria-selected', 'true');
        
        // Reset autoplay
        this.resetAutoplay();
        
        // Fine transizione
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
        }
    }
    
    startAutoplay() {
        if (this.autoplayInterval) return;
        
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resetAutoplay() {
        this.pauseAutoplay();
        this.startAutoplay();
    }
    
    // Metodo pubblico per distruggere il carousel
    destroy() {
        this.pauseAutoplay();
        // Rimuovi event listeners se necessario
    }
}

// Inizializza il carousel quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    new HeroCarousel();
}); 