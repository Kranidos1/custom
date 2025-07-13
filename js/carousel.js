/**
 * Moenia s.r.l. - Hero Carousel
 * Gestisce il carousel principale con autoplay e controlli manuali
 * Ottimizzato per caricamento veloce delle immagini con preload intelligente
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
        this.imageCache = new Map(); // Cache per le immagini pre-caricate
        this.resizeTimeout = null; // Timeout per il debounce del resize
        this.preloadQueue = []; // Coda per il preload progressivo
        this.isPreloading = false; // Flag per evitare preload multipli
        
        // Inizializza in modo asincrono
        this.init().catch(error => {
            console.error('Error initializing carousel:', error);
        });
    }
    
    async init() {
        this.loadConfig();
        await this.preloadCriticalImages();
        this.createSlides();
        this.createIndicators();
        this.bindEvents();
        this.startAutoplay();
        this.showSlide(0);
        // Avvia il preload progressivo delle immagini adiacenti
        this.startProgressivePreload();
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
                            title: "Progettazione Architettonica",
                            subtitle: "Soluzioni innovative per il futuro dell'edilizia",
                            cta: "Scopri i nostri progetti",
                            ctaUrl: "#progetti",
                            size: 62,
                            priority: "high"
                        },
                        {
                            image: "assets/carousel/2.webp",
                            title: "Consulenza Ingegneristica",
                            subtitle: "Competenza tecnica al servizio dell'innovazione",
                            cta: "I nostri servizi",
                            ctaUrl: "#servizi",
                            size: 88,
                            priority: "high"
                        },
                        {
                            image: "assets/carousel/3.webp",
                            title: "Sostenibilità",
                            subtitle: "Progetti eco-compatibili per un futuro migliore",
                            cta: "Contattaci",
                            ctaUrl: "#contatti",
                            size: 275,
                            priority: "medium"
                        },
                        {
                            image: "assets/carousel/4.webp",
                            title: "Innovazione Tecnologica",
                            subtitle: "Tecnologie all'avanguardia per progetti di eccellenza",
                            cta: "Scopri di più",
                            ctaUrl: "#servizi",
                            size: 99,
                            priority: "high"
                        },
                        {
                            image: "assets/carousel/5.webp",
                            title: "Design Sostenibile",
                            subtitle: "Architettura che rispetta l'ambiente e il futuro",
                            cta: "I nostri progetti green",
                            ctaUrl: "#progetti",
                            size: 142,
                            priority: "medium"
                        },
                        {
                            image: "assets/carousel/6.webp",
                            title: "Eccellenza Progettuale",
                            subtitle: "Qualità e precisione in ogni dettaglio",
                            cta: "Conosci il nostro team",
                            ctaUrl: "#chi-siamo",
                            size: 763,
                            priority: "low"
                        },
                        {
                            image: "assets/carousel/7.webp",
                            title: "Soluzioni Personalizzate",
                            subtitle: "Ogni progetto è unico, ogni soluzione è su misura",
                            cta: "Inizia il tuo progetto",
                            ctaUrl: "#contatti",
                            size: 37,
                            priority: "high"
                        },
                        {
                            image: "assets/carousel/8.webp",
                            title: "Visione del Futuro",
                            subtitle: "Progettiamo oggi gli spazi di domani",
                            cta: "Collabora con noi",
                            ctaUrl: "#contatti",
                            size: 74,
                            priority: "high"
                        }
                    ],
                    settings: {
                        autoplayDelay: 5000,
                        preloadStrategy: "progressive",
                        maxConcurrentPreloads: 3,
                        connectionAware: true
                    }
                };
            }
        }
    }
    
    // Preload intelligente delle immagini critiche
    async preloadCriticalImages() {
        const allSlides = this.config.carousel.slides;
        
        // Carica la prima immagine per il display iniziale
        if (allSlides[0]) {
            await this.preloadImage(allSlides[0].image, 0);
            console.log('First image loaded successfully');
        }
        
        // Precarica anche la seconda immagine per una transizione fluida
        if (allSlides[1]) {
            this.preloadImage(allSlides[1].image, 1).then(() => {
                console.log('Second image preloaded for smooth transition');
            }).catch(error => {
                console.warn('Failed to preload second image:', error);
            });
        }
    }
    
    // Preload progressivo delle immagini adiacenti
    startProgressivePreload() {
        // Precarica le immagini adiacenti alla slide corrente
        this.preloadAdjacentImages();
        
        // Precarica anche le immagini più piccole per priorità
        this.preloadSmallImages();
    }
    
    // Precarica le immagini adiacenti alla slide corrente
    async preloadAdjacentImages() {
        const totalSlides = this.config.carousel.slides.length;
        const prevIndex = this.currentSlide === 0 ? totalSlides - 1 : this.currentSlide - 1;
        const nextIndex = (this.currentSlide + 1) % totalSlides;
        
        // Precarica slide precedente e successiva
        const indicesToPreload = [prevIndex, nextIndex];
        
        for (const index of indicesToPreload) {
            if (!this.loadedImages.has(this.config.carousel.slides[index].image)) {
                this.preloadImage(this.config.carousel.slides[index].image, index).catch(error => {
                    console.warn(`Failed to preload adjacent image ${index}:`, error);
                });
            }
        }
    }
    
    // Precarica le immagini per priorità
    async preloadSmallImages() {
        // Controlla la qualità della connessione
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        
        // Ordina le immagini per priorità e dimensione
        const slides = this.config.carousel.slides;
        const highPriorityImages = slides
            .map((slide, index) => ({ ...slide, index }))
            .filter(slide => slide.priority === 'high')
            .sort((a, b) => a.size - b.size); // Ordina per dimensione crescente
        
        const mediumPriorityImages = slides
            .map((slide, index) => ({ ...slide, index }))
            .filter(slide => slide.priority === 'medium')
            .sort((a, b) => a.size - b.size);
        
        // Se la connessione è lenta, precarica solo le immagini ad alta priorità più piccole
        const imagesToPreload = isSlowConnection 
            ? highPriorityImages.slice(0, 2) 
            : [...highPriorityImages, ...mediumPriorityImages.slice(0, 2)];
        
        for (const slide of imagesToPreload) {
            if (!this.loadedImages.has(slide.image)) {
                this.preloadImage(slide.image, slide.index).catch(error => {
                    console.warn(`Failed to preload image ${slide.index}:`, error);
                });
            }
        }
    }
    
    // Preload di una singola immagine con timeout
    preloadImage(imageUrl, index) {
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
                this.imageCache.set(index, img);
                console.log(`Image preloaded successfully: ${imageUrl}`);
                resolve();
            };
            
            img.onerror = () => {
                clearTimeout(timeout);
                console.error(`Failed to preload image: ${imageUrl}`);
                reject(new Error(`Failed to load image: ${imageUrl}`));
            };
            
            img.src = imageUrl;
        });
    }
    
    // Lazy load di un'immagine quando necessario
    async lazyLoadImage(index) {
        const slideData = this.config.carousel.slides[index];
        if (!slideData) return;
        
        const imageUrl = slideData.image;
        
        // Se l'immagine è già caricata, non fare nulla
        if (this.loadedImages.has(imageUrl)) {
            return;
        }
        
        // Carica l'immagine con priorità alta
        try {
            await this.preloadImage(imageUrl, index);
            
            // Aggiorna la slide con l'immagine caricata
            const slide = this.slides[index];
            if (slide) {
                slide.style.backgroundImage = `url(${imageUrl})`;
                slide.classList.remove('loading-progress');
                console.log(`Lazy loaded image for slide ${index + 1}: ${imageUrl}`);
            }
            
            // Dopo aver caricato questa immagine, precarica le adiacenti
            this.preloadAdjacentImages();
        } catch (error) {
            console.error(`Failed to lazy load image for slide ${index + 1}: ${imageUrl}`);
        }
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
            slide.setAttribute('aria-hidden', index !== 0);
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Slide ${index + 1} di ${this.config.carousel.slides.length}`);
            
            // Usa l'immagine locale
            const imageUrl = slideData.image;
            
            // Imposta l'immagine di sfondo solo per la prima slide (già precaricata)
            if (index === 0 && this.loadedImages.has(imageUrl)) {
                slide.style.backgroundImage = `url(${imageUrl})`;
                console.log(`Slide ${index + 1}: First image already loaded, displaying immediately`);
            } else {
                // Per le altre slide, mostra un loading progressivo
                slide.style.backgroundColor = '#2c5aa0';
                slide.classList.add('loading-progress');
                console.log(`Slide ${index + 1}: Will be loaded with progressive loading`);
            }
            
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
        
        // Resize listener per aggiornare le immagini responsive
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    handleResize() {
        // Debounce per evitare troppi aggiornamenti
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updateResponsiveImages();
        }, 250);
    }
    
    updateResponsiveImages() {
        // Non più necessario con immagini locali
        // Le immagini WebP sono già ottimizzate per tutti i dispositivi
        console.log('Responsive images update not needed with local assets');
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
        
        // Aggiorna attributi ARIA e indicatori
        this.slides[this.currentSlide].setAttribute('aria-hidden', 'false');
        this.indicators[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].setAttribute('aria-selected', 'true');
        
        // Precarica le immagini adiacenti per le prossime transizioni
        this.preloadAdjacentImages();
        
        // Reset autoplay
        this.resetAutoplay();
        
        // Fine transizione
        setTimeout(() => {
            this.isTransitioning = false;
        }, 100);
    }
    

    
    async nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        await this.showSlide(nextIndex);
    }
    
    async prevSlide() {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        await this.showSlide(prevIndex);
    }
    
    async goToSlide(index) {
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