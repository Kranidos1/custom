# Moenia s.r.l. - Sito Web

Sito statico professionale per **Moenia s.r.l.**, società specializzata in progettazione e consulenza integrata in ambito architettonico e ingegneristico.

## 🏗️ Caratteristiche

- **Header trasparente/solido** con transizione fluida
- **Hero carousel** con autoplay e controlli manuali
- **Design responsive** per tutti i dispositivi
- **Accessibilità** completa con supporto ARIA
- **Performance ottimizzate** con lazy loading
- **Configurazione centralizzata** tramite JSON

## 📁 Struttura del Progetto

```
custom/
├── index.html              # Pagina principale
├── css/
│   └── style.css          # Stili principali con CSS Variables
├── js/
│   ├── carousel.js        # Logica del carousel hero
│   └── main.js           # Funzionalità generali del sito
├── data/
│   └── config.json       # Configurazione centralizzata
├── assets/
│   ├── logo_moenia.png   # Logo aziendale
│   ├── carousel/         # Immagini del carousel hero
│   │   ├── 1.png
│   │   ├── 2.jpg
│   │   ├── 3.jpg
│   │   ├── 4.jpg
│   │   ├── 5.jpg
│   │   ├── 6.jpg
│   │   ├── 7.jpg
│   │   └── 8.jpg
│   └── chi-siamo-image.jpg
└── README.md
```

## 🚀 Funzionalità Principali

### Header Intelligente
- **Trasparente** quando sopra al carousel
- **Solido** con blur effect durante lo scroll
- **Sticky** sempre visibile in cima
- **Responsive** con menu hamburger mobile

### Hero Carousel
- **Autoplay** ogni 5 secondi
- **Controlli manuali** (frecce + pallini)
- **Navigazione touch/swipe** su mobile
- **Transizioni fade** fluide
- **Pause on hover** per UX migliore

### Sezione "Chi Siamo"
- **Layout a griglia** responsive
- **Animazioni al scroll** con Intersection Observer
- **Icone SVG** integrate
- **Contenuti configurabili** via JSON

## 🎨 Personalizzazione

### Colori e Stili
Tutti i colori e gli stili sono definiti in variabili CSS nel file `css/style.css`:

```css
:root {
    --primary-color: #2c5aa0;
    --secondary-color: #1e3a5f;
    --accent-color: #f39c12;
    /* ... altri colori */
}
```

### Contenuti
I contenuti sono configurabili tramite il file `data/config.json`:

```json
{
  "carousel": {
    "slides": [
      {
        "image": "assets/slide-1.jpg",
        "title": "Progettazione Architettonica",
        "subtitle": "Soluzioni innovative...",
        "cta": "Scopri i nostri progetti",
        "cta_url": "#progetti"
      }
    ]
  }
}
```

## 📱 Responsive Design

Il sito è completamente responsive con breakpoint ottimizzati:

- **Desktop**: > 768px
- **Tablet**: 768px - 480px  
- **Mobile**: < 480px

### Funzionalità Mobile
- Menu hamburger animato
- Touch/swipe per carousel
- Layout ottimizzato per schermi piccoli
- Performance ottimizzate

## ♿ Accessibilità

- **Attributi ARIA** completi
- **Navigazione da tastiera** supportata
- **Screen reader** friendly
- **High contrast mode** supportato
- **Reduced motion** rispettato

## ⚡ Performance

- **Lazy loading** per immagini
- **CSS Variables** per ottimizzazione
- **JavaScript modulare** e efficiente
- **Debounced scroll handlers**
- **Intersection Observer** per animazioni

## 🛠️ Tecnologie Utilizzate

- **HTML5** semantico
- **CSS3** con Grid/Flexbox
- **JavaScript ES6+** vanilla
- **CSS Variables** per theming
- **Intersection Observer API**
- **Touch Events** per mobile

## 📋 Installazione e Deploy

### Sviluppo Locale
1. Clona il repository
2. Apri `index.html` in un browser
3. Oppure usa un server locale:
   ```bash
   python -m http.server 8000
   # o
   npx serve .
   ```

### Deploy su GitHub Pages
1. Pusha il codice su GitHub
2. Vai su Settings > Pages
3. Seleziona branch `main` e cartella `/`
4. Il sito sarà disponibile su `https://username.github.io/repository`

### Personalizzazione per Produzione
1. Sostituisci le immagini placeholder in `assets/`
2. Modifica i contenuti in `data/config.json`
3. Aggiorna i colori in `css/style.css` se necessario
4. Testa su diversi dispositivi

## 🔧 Configurazione Avanzata

### Aggiungere Nuove Slide
Modifica `data/config.json`:

```json
{
  "carousel": {
    "slides": [
      {
        "image": "assets/nuova-slide.jpg",
        "title": "Nuovo Titolo",
        "subtitle": "Nuova descrizione",
        "cta": "Nuovo CTA",
        "cta_url": "#nuova-sezione"
      }
    ]
  }
}
```

### Modificare i Colori
Aggiorna le variabili CSS in `css/style.css`:

```css
:root {
    --primary-color: #nuovo-colore;
    --accent-color: #nuovo-accent;
}
```

### Aggiungere Nuove Sezioni
1. Aggiungi HTML in `index.html`
2. Definisci stili in `css/style.css`
3. Aggiungi contenuti in `data/config.json`

## 📞 Supporto

Per modifiche o personalizzazioni:
1. Modifica i file di configurazione
2. Aggiorna contenuti e immagini
3. Testa su diversi dispositivi
4. Deploy su GitHub Pages

## 📄 Licenza

Questo progetto è stato creato per Moenia s.r.l. ed è proprietà dell'azienda.

---

**Moenia s.r.l.** - Progettazione e Consulenza Architettonica
*Soluzioni innovative per il futuro dell'edilizia* 