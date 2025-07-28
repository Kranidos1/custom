// Statistics Counter Animation
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Funzione per animare il conteggio
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16); // 60fps
        const suffix = element.getAttribute('data-suffix') || '';
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        }
        
        updateCounter();
    }
    
    // Funzione per verificare se un elemento è visibile
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Funzione per gestire l'animazione quando l'elemento diventa visibile
    function handleScroll() {
        statNumbers.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                const target = parseInt(element.getAttribute('data-target'));
                element.classList.add('animated');
                animateCounter(element, target);
            }
        });
    }
    
    // Aggiungi listener per lo scroll
    window.addEventListener('scroll', handleScroll);
    
    // Controlla se gli elementi sono già visibili al caricamento
    handleScroll();
}); 