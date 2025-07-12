# Cartella Immagini

Questa cartella contiene tutte le immagini utilizzate nel sito web di Moenia.

## Struttura delle Immagini

### Logo
- `logo.png` - Logo principale dell'azienda (formato PNG con sfondo trasparente)
- `logo-white.png` - Logo bianco per il footer (formato PNG con sfondo trasparente)

### Hero Images (Carousel)
- `hero-1.jpg` - Prima immagine del carousel hero (1920x1080px)
- `hero-2.jpg` - Seconda immagine del carousel hero (1920x1080px)
- `hero-3.jpg` - Terza immagine del carousel hero (1920x1080px)

### Progetti
- `project-1.jpg` - Immagine progetto E-commerce Platform (800x600px)
- `project-2.jpg` - Immagine progetto Fleet Management App (800x600px)
- `project-3.jpg` - Immagine progetto Dashboard Analytics (800x600px)
- `project-4.jpg` - Immagine progetto CRM System (800x600px)
- `project-5.jpg` - Immagine progetto Website Redesign (800x600px)
- `project-6.jpg` - Immagine progetto API Integration (800x600px)
- `project-7.jpg` - Immagine progetto E-Learning Platform (800x600px)
- `project-8.jpg` - Immagine progetto IoT Dashboard (800x600px)
- `project-9.jpg` - Immagine progetto Blockchain Wallet (800x600px)

### Team
- `team-1.jpg` - Foto Marco Rossi (400x400px, formato quadrato)
- `team-2.jpg` - Foto Laura Bianchi (400x400px, formato quadrato)
- `team-3.jpg` - Foto Giuseppe Verdi (400x400px, formato quadrato)
- `team-4.jpg` - Foto Anna Neri (400x400px, formato quadrato)
- `team-5.jpg` - Foto Paolo Gialli (400x400px, formato quadrato)
- `team-6.jpg` - Foto Sofia Rossi (400x400px, formato quadrato)
- `team-7.jpg` - Foto Luca Blu (400x400px, formato quadrato)
- `team-8.jpg` - Foto Elena Rosa (400x400px, formato quadrato)
- `team-9.jpg` - Foto Marco Verde (400x400px, formato quadrato)

### Social Media
- `og-image.jpg` - Immagine per Open Graph (1200x630px)

## Specifiche Tecniche

### Formati Supportati
- **JPG/JPEG**: Per fotografie e immagini complesse
- **PNG**: Per logo e immagini con trasparenza
- **WebP**: Formato moderno per migliore compressione (opzionale)

### Dimensioni Raccomandate
- **Hero Images**: 1920x1080px (16:9)
- **Project Images**: 800x600px (4:3)
- **Team Photos**: 400x400px (1:1)
- **Logo**: 200x80px (proporzione originale)
- **OG Image**: 1200x630px (1.91:1)

### Ottimizzazione
- **Compressione**: Utilizzare compressione ottimizzata per il web
- **Lazy Loading**: Le immagini utilizzano lazy loading nativo
- **Responsive**: Le immagini si adattano automaticamente ai dispositivi

## Come Aggiungere Nuove Immagini

1. **Preparare l'immagine**:
   - Ridimensionare alle dimensioni raccomandate
   - Ottimizzare la compressione
   - Salvare nel formato appropriato

2. **Caricare l'immagine**:
   - Aggiungere il file nella cartella `images/`
   - Utilizzare un nome descrittivo e in minuscolo

3. **Aggiornare i riferimenti**:
   - Modificare i file JSON corrispondenti
   - Aggiornare i percorsi nelle immagini

## Esempi di Utilizzo

### Nel CSS
```css
.hero-slide {
    background-image: url('images/hero-1.jpg');
}
```

### Nel HTML
```html
<img src="images/logo.png" alt="Moenia Logo">
```

### Nei file JSON
```json
{
    "image": "images/project-1.jpg"
}
```

## Note Importanti

- Mantenere le immagini sotto i 500KB per prestazioni ottimali
- Utilizzare nomi file descrittivi e in minuscolo
- Verificare che le immagini siano libere da copyright o utilizzare immagini proprie
- Testare le immagini su dispositivi diversi per verificare la qualità 