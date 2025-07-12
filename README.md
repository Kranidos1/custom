# 🚀 Sito Web Aziendale Moenia

Un sito web moderno, responsive e personalizzabile per aziende, creato seguendo le migliori pratiche di design e sviluppo web.

## ✨ Caratteristiche

- **Design Moderno**: Interfaccia pulita e professionale con animazioni fluide
- **Completamente Responsive**: Ottimizzato per tutti i dispositivi
- **Personalizzabile**: Sistema di colori e temi facilmente modificabili
- **Contenuti Dinamici**: Gestione contenuti tramite file JSON
- **Performance Ottimizzate**: Lazy loading, compressione immagini, caching
- **SEO Friendly**: Meta tag, schema markup, Open Graph
- **Accessibile**: WCAG 2.1 compliant
- **Cross-browser**: Compatibile con tutti i browser moderni

## 🎨 Sezioni del Sito

1. **Hero Section**: Carousel con immagini e call-to-action
2. **Chi Siamo**: Storia aziendale con timeline e statistiche
3. **Servizi**: Catalogo servizi con icone e descrizioni
4. **Progetti**: Portfolio progetti con filtri e dettagli
5. **Team**: Profili team con foto e social media
6. **Contatti**: Form di contatto e informazioni aziendali
7. **Footer**: Link utili, social media e newsletter

## 🛠️ Tecnologie Utilizzate

- **HTML5**: Struttura semantica
- **CSS3**: Stili moderni con variabili CSS
- **JavaScript (ES6+)**: Interattività e animazioni
- **Bootstrap 5**: Framework CSS per layout responsive
- **Font Awesome**: Icone vettoriali
- **Google Fonts**: Tipografia web

## 📁 Struttura del Progetto

```
custom/
├── index.html              # Pagina principale
├── css/
│   ├── style.css           # Stili principali
│   └── colors.css          # Sistema colori personalizzabile
├── js/
│   ├── main.js             # Logica principale
│   └── data-loader.js      # Caricamento contenuti JSON
├── data/
│   ├── company.json        # Dati azienda
│   ├── services.json       # Servizi offerti
│   ├── projects.json       # Portfolio progetti
│   ├── team.json           # Dati team
│   └── contact.json        # Informazioni contatto
├── images/                 # Immagini del sito
│   └── README.md           # Guida immagini
└── README.md               # Questo file
```

## 🚀 Installazione e Utilizzo

### 1. Clona o Scarica il Progetto
```bash
git clone [repository-url]
cd custom
```

### 2. Personalizza i Contenuti
Modifica i file JSON nella cartella `data/` per personalizzare:

- **company.json**: Nome azienda, descrizione, statistiche
- **services.json**: Servizi offerti con icone e descrizioni
- **projects.json**: Portfolio progetti con immagini
- **team.json**: Membri del team con foto
- **contact.json**: Informazioni di contatto

### 3. Aggiungi le Immagini
- Aggiungi le immagini nella cartella `images/`
- Segui le specifiche nel file `images/README.md`
- Aggiorna i percorsi nei file JSON

### 4. Personalizza i Colori
Modifica il file `css/colors.css` per cambiare la palette colori:

```css
:root {
    --primary-color: #005aa7;    /* Colore primario */
    --accent-color: #f25c05;     /* Colore accent */
    /* ... altri colori */
}
```

### 5. Avvia il Sito
Apri `index.html` in un browser web o utilizza un server locale:

```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx serve .

# Con PHP
php -S localhost:8000
```

## 🎨 Personalizzazione

### Cambio Tema Colori
Il sito include 6 temi predefiniti:
- **Default**: Blu e arancione (Moenia)
- **Green**: Verde e giallo (eco-friendly)
- **Purple**: Viola e rosso (creativo)
- **Red**: Rosso e arancione (energetico)
- **Gray**: Grigio e bianco (professionale)
- **Gold**: Oro e blu (lusso)

Per cambiare tema, modifica l'attributo `data-theme` nel tag `<html>`:
```html
<html data-theme="green">
```

### Aggiungere Nuovi Servizi
Modifica `data/services.json`:
```json
{
  "id": "nuovo-servizio",
  "title": "Nuovo Servizio",
  "description": "Descrizione del servizio",
  "icon": "fas fa-icon",
  "category": "Categoria"
}
```

### Aggiungere Nuovi Progetti
Modifica `data/projects.json`:
```json
{
  "id": "nuovo-progetto",
  "title": "Nuovo Progetto",
  "description": "Descrizione del progetto",
  "image": "images/nuovo-progetto.jpg",
  "technologies": ["React", "Node.js"]
}
```

### Aggiungere Membri del Team
Modifica `data/team.json`:
```json
{
  "id": "nuovo-membro",
  "name": "Nome Cognome",
  "role": "Ruolo",
  "description": "Descrizione",
  "photo": "images/team-nuovo.jpg"
}
```

## 📱 Responsive Design

Il sito è ottimizzato per:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## ⚡ Performance

- **Lazy Loading**: Immagini caricate on-demand
- **Minificazione**: CSS e JS ottimizzati
- **Caching**: Headers per caching browser
- **Compressione**: Immagini ottimizzate
- **CDN**: Font e librerie da CDN

## 🔧 Funzionalità JavaScript

- **Scroll Animations**: Animazioni al scroll
- **Counter Animations**: Contatori animati
- **Form Validation**: Validazione form contatti
- **Theme Switcher**: Cambio tema dinamico
- **Lazy Loading**: Caricamento immagini
- **Smooth Scrolling**: Navigazione fluida

## 🌐 SEO e Accessibilità

### SEO
- Meta tag ottimizzati
- Schema markup JSON-LD
- Open Graph tags
- Sitemap XML
- Robots.txt

### Accessibilità
- WCAG 2.1 compliant
- Navigazione da tastiera
- Screen reader friendly
- Contrasto colori ottimizzato
- Alt text per immagini

## 📧 Form di Contatto

Il form di contatto include:
- Validazione lato client
- Notifiche di successo/errore
- Campi obbligatori
- Protezione spam

**Nota**: Per funzionare in produzione, configura un backend per l'invio email.

## 📊 Analytics

Il sito è pronto per l'integrazione con:
- Google Analytics 4
- Google Tag Manager
- Facebook Pixel
- LinkedIn Insight Tag

## 🔒 Sicurezza

- Validazione input
- Sanitizzazione dati
- HTTPS ready
- CSP headers
- XSS protection

## 🚀 Deployment

### Opzioni di Hosting
- **Netlify**: Drag & drop deployment
- **Vercel**: Ottimizzato per performance
- **GitHub Pages**: Hosting gratuito
- **AWS S3**: Hosting statico
- **VPS**: Hosting tradizionale

### Ottimizzazioni Production
1. Minifica CSS e JS
2. Comprimi immagini
3. Abilita gzip compression
4. Configura caching
5. Abilita HTTPS
6. Configura analytics

## 🤝 Contributi

Per contribuire al progetto:
1. Fork del repository
2. Crea un branch per la feature
3. Commit delle modifiche
4. Push al branch
5. Crea una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

## 📞 Supporto

Per supporto o domande:
- Email: info@moenia.eu
- Documentazione: [Link alla documentazione]
- Issues: [Link al repository]

## 🔄 Changelog

### v1.0.0 (2024-01-XX)
- 🎉 Prima release
- ✨ Design moderno e responsive
- 🎨 Sistema temi personalizzabile
- 📱 Ottimizzazione mobile
- ⚡ Performance ottimizzate
- 🔧 Contenuti dinamici JSON
- 🌐 SEO e accessibilità

---

**Creato con ❤️ per Moenia** 