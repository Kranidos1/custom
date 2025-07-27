/**
 * Moenia s.r.l. - Hero Carousel
 * Gestisce il carousel principale con autoplay e controlli manuali
 * Caricamento lazy delle immagini per performance ottimizzate
 */

class HeroCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.indicators = [];
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 secondi
        this.isTransitioning = false;
        this.loadedImages = new Set(); // Traccia le immagini caricate
        
        // Inizializza in modo asincrono
        this.init().catch(error => {
            console.error('Error initializing carousel:', error);
        });
    }
    
    async init() {
        await this.loadConfig();
        this.createSlides();
        this.createIndicators();
        this.bindEvents();
        // Attiva manualmente la prima slide
        if (this.slides.length > 0) {
            this.slides[0].classList.add('active');
            this.slides[0].setAttribute('aria-hidden', 'false');
            if (this.indicators.length > 0) {
                this.indicators[0].classList.add('active');
                this.indicators[0].setAttribute('aria-selected', 'true');
            }
        }
        
        this.startAutoplay();
    }
    
    async loadConfig() {
        try {
            // Prova a caricare il file di configurazione
            const response = await fetch('data/carousel-config.json');
            if (response.ok) {
                this.config = await response.json();
                console.log('Loaded carousel config from file:', this.config);
            } else {
                throw new Error('Config file not found, using fallback');
            }
        } catch (error) {
            console.warn('Using fallback carousel config:', error.message);
            // Fallback con dati hardcoded
            this.config = {
                carousel: {
                    slides: [
                        {
                            image: "assets/carousel/1.webp",
                            title: "Consulenza Ingegneristica",
                            subtitle: "Competenza tecnica al servizio dell'innovazione",
                            size: 88,
                            priority: "high"
                        },
                        {
                            image: "assets/carousel/2.webp",
                            title: "Sostenibilità",
                            subtitle: "Progetti eco-compatibili per un futuro migliore",
                            size: 275,
                            priority: "medium"
                        },
                        {
                            image: "assets/carousel/3.webp",
                            title: "Innovazione Tecnologica",
                            subtitle: "Tecnologie all'avanguardia per progetti di eccellenza",
                            size: 99,
                            priority: "high"
                        },
                        {
                            image: "assets/carousel/4.webp",
                            title: "Design Sostenibile",
                            subtitle: "Architettura che rispetta l'ambiente e il futuro",
                            size: 142,
                            priority: "medium"
                        },
                        {
                            image: "assets/carousel/5.webp",
                            title: "Eccellenza Progettuale",
                            subtitle: "Qualità e precisione in ogni dettaglio",
                            size: 763,
                            priority: "low"
                        }
                    ],
                    settings: {
                        autoplayDelay: 5000,
                        preloadStrategy: "progressive",
                        maxConcurrentPreloads: 3,
                        connectionAware: true
                    }
                }
            }
        }
    }
    
    // Caricamento lazy di un'immagine
    loadImage(imageUrl) {
        if (this.loadedImages.has(imageUrl)) {
            return Promise.resolve();
        }
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            const timeout = setTimeout(() => {
                img.src = '';
                reject(new Error(`Timeout loading image: ${imageUrl}`));
            }, 10000); // 10 secondi di timeout
            
            img.onload = () => {
                clearTimeout(timeout);
                this.loadedImages.add(imageUrl);
                console.log(`Image loaded successfully: ${imageUrl}`);
                resolve();
            };
            
            img.onerror = () => {
                clearTimeout(timeout);
                console.error(`Failed to load image: ${imageUrl}`);
                reject(new Error(`Failed to load image: ${imageUrl}`));
            };
            
            img.src = imageUrl;
        });
    }
    
    // Lazy load di un'immagine quando necessario
    async lazyLoadImage(index) {
        // Verifica che la configurazione sia caricata
        if (!this.config || !this.config.carousel || !this.config.carousel.slides) {
            console.error('Configuration not loaded properly');
            return;
        }
        
        const slideData = this.config.carousel.slides[index];
        if (!slideData) return;
        
        const imageUrl = slideData.image;
        
        // Se l'immagine è già caricata, non fare nulla
        if (this.loadedImages.has(imageUrl)) {
            return;
        }
        
        // Carica l'immagine
        try {
            await this.loadImage(imageUrl);
            
            // Aggiorna la slide con l'immagine caricata
            const slide = this.slides[index];
            if (slide) {
                slide.style.backgroundImage = `url(${imageUrl})`;
                slide.classList.remove('loading-progress');
                console.log(`Lazy loaded image for slide ${index + 1}: ${imageUrl}`);
            }
        } catch (error) {
            console.error(`Failed to lazy load image for slide ${index + 1}: ${imageUrl}`);
        }
    }
    
    createSlides() {
        // Verifica che la configurazione sia caricata
        if (!this.config || !this.config.carousel || !this.config.carousel.slides) {
            console.error('Configuration not loaded properly');
            return;
        }
        
        const slidesContainer = document.getElementById('carouselSlides');
        if (!slidesContainer) {
            console.error('Carousel slides container not found');
            return;
        }
        
        console.log('Creating slides with config:', this.config.carousel.slides);
        
        this.config.carousel.slides.forEach((slideData, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.setAttribute('aria-hidden', index !== 0);
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Slide ${index + 1} di ${this.config.carousel.slides.length}`);
            
            // Imposta l'immagine di sfondo solo per la prima slide
            if (index === 0) {
                slide.style.backgroundImage = `url(${slideData.image})`;
                this.loadedImages.add(slideData.image);
            } else {
                // Per le altre slide, carica l'immagine quando necessario
                slide.style.backgroundColor = '#2c5aa0';
            }
            
            const content = document.createElement('div');
            content.className = 'carousel-content';
            
            const title = document.createElement('h1');
            title.className = 'carousel-title';
            title.textContent = slideData.title;
            
            const subtitle = document.createElement('p');
            subtitle.className = 'carousel-subtitle';
            subtitle.textContent = slideData.subtitle;
            
            content.appendChild(title);
            content.appendChild(subtitle);
            slide.appendChild(content);
            
            slidesContainer.appendChild(slide);
            this.slides.push(slide);
        });
    }
    
    createIndicators() {
        // Verifica che la configurazione sia caricata
        if (!this.config || !this.config.carousel || !this.config.carousel.slides) {
            console.error('Configuration not loaded properly');
            return;
        }
        
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
            prevButton.addEventListener('click', () => {
                this.prevSlide();
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.nextSlide();
            });
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
        
        // Resize listener per aggiornare le immagini responsive
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    handleResize() {
        // Metodo vuoto per compatibilità
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
    
    async showSlide(index) {
        // Verifica che la configurazione sia caricata
        if (!this.config || !this.config.carousel || !this.config.carousel.slides) {
            console.error('Configuration not loaded properly');
            return;
        }
        
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.isTransitioning = true;
        
        // Nascondi slide corrente
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[this.currentSlide].setAttribute('aria-hidden', 'true');
        this.indicators[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].setAttribute('aria-selected', 'false');
        
        // Aggiorna l'indice corrente
        this.currentSlide = index;
        
        // Lazy load dell'immagine se non è ancora caricata
        await this.lazyLoadImage(index);
        
        // Attiva la nuova slide
        this.slides[this.currentSlide].classList.add('active');
        this.slides[this.currentSlide].setAttribute('aria-hidden', 'false');
        this.indicators[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].setAttribute('aria-selected', 'true');
        
        // Reset autoplay
        this.resetAutoplay();
        
        // Fine transizione
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }
    

    
    async nextSlide() {
        // Verifica che la configurazione sia caricata
        if (!this.config || !this.config.carousel || !this.config.carousel.slides) {
            console.error('Configuration not loaded properly');
            return;
        }
        
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        await this.showSlide(nextIndex);
    }
    
    async prevSlide() {
        // Verifica che la configurazione sia caricata
        if (!this.config || !this.config.carousel || !this.config.carousel.slides) {
            console.error('Configuration not loaded properly');
            return;
        }
        
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        await this.showSlide(prevIndex);
    }
    
    async goToSlide(index) {
        // Verifica che la configurazione sia caricata
        if (!this.config || !this.config.carousel || !this.config.carousel.slides) {
            console.error('Configuration not loaded properly');
            return;
        }
        
        if (index >= 0 && index < this.slides.length) {
            await this.showSlide(index);
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