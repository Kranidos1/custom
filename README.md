# Moenia s.r.l. - Sito Web Aziendale

Sito web professionale per Moenia s.r.l., specializzata in progettazione e consulenza architettonica e ingegneristica.

## 🚀 Ottimizzazioni per GitHub Pages

### Performance Implementate

#### 1. **Preconnect e DNS Prefetch**
```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
```

#### 2. **Preload delle Immagini Critiche**
- Logo aziendale e immagini essenziali
- Prime 2 immagini del carousel per LCP ottimale
- Formato corretto specificato per ogni immagine

#### 3. **Carousel Ottimizzato**
- Preload limitato alle prime 2-3 immagini critiche
- Caricamento progressivo delle immagini successive
- Versioni responsive per mobile e desktop
- Debounce per aggiornamenti responsive

#### 4. **Immagini Locali Ottimizzate**
- Immagini WebP locali in `assets/carousel/`
- Sfrutta il CDN di GitHub Pages (Fastly)
- Nessuna dipendenza da servizi esterni
- Lazy loading per immagini non critiche

### 🎯 Metriche di Performance Target

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Caricamento iniziale**: < 3s su 3G

### 📁 Struttura del Progetto

```
custom/
├── assets/
│   ├── certificazioni/          # PDF delle certificazioni
│   ├── logo_certificazioni/     # Loghi delle autorità
│   ├── logo_moenia.png         # Logo principale
│   ├── logo_moenia_footer.png  # Logo footer
│   └── profile_pic.jpg         # Foto team
├── css/
│   └── style.css               # Stili ottimizzati
├── js/
│   ├── carousel.js             # Carousel con preload intelligente
│   └── main.js                 # Funzionalità principali
└── index.html                  # Pagina principale ottimizzata
```

### 🔧 Configurazione GitHub Pages

1. **Abilita GitHub Pages**:
   - Vai su Settings > Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

2. **URL del sito**:
   ```
   https://tuo-username.github.io/tuo-repo/
   ```

3. **CDN jsDelivr** (opzionale):
   ```html
   https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/assets/image.jpg
   ```

### 📱 Responsive Design

- **Mobile**: ≤ 768px
- **Tablet**: 769px - 1024px  
- **Desktop**: > 1024px

### 🎨 Caratteristiche

- **Design moderno** con glassmorphism
- **Carousel dinamico** con 8 immagini
- **Sezione certificazioni** con PDF scaricabili
- **Navigazione fluida** senza scroll snapping
- **Footer elegante** con informazioni aziendali

### ⚡ Ottimizzazioni Tecniche

#### Carousel
- Preload intelligente delle immagini critiche
- Transizioni fluide con CSS transforms
- Effetti di parallax e zoom
- Touch/swipe support per mobile

#### Immagini
- Formato WebP per carousel (locali)
- Sfrutta CDN di GitHub Pages (Fastly)
- Immagini ottimizzate per tutti i dispositivi
- Lazy loading per performance

#### CSS
- Variabili CSS per consistenza
- Animazioni hardware-accelerated
- Media queries ottimizzate
- Transizioni fluide

### 🚀 Deployment

1. **Push su GitHub**:
   ```bash
   git add .
   git commit -m "Ottimizzazioni performance per GitHub Pages"
   git push origin main
   ```

2. **Verifica deployment**:
   - GitHub Actions > Pages build and deployment
   - Controlla l'URL del sito

3. **Test performance**:
   - Google PageSpeed Insights
   - GTmetrix
   - WebPageTest

### 📊 Monitoraggio

Monitora le performance con:
- **Google Analytics** (se configurato)
- **Core Web Vitals** in Search Console
- **Lighthouse** per audit periodici

### 🔄 Manutenzione

- Aggiorna regolarmente le immagini del carousel
- Monitora le metriche di performance
- Ottimizza le immagini nuove prima del caricamento
- Mantieni aggiornate le dipendenze

---

**Moenia s.r.l.** - Progettazione e Consulenza Architettonica
*Sostenibilità, Innovazione, Eccellenza* 