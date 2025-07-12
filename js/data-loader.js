// ===== DATA LOADER - Caricamento dinamico dei contenuti =====

class DataLoader {
    constructor() {
        this.data = {};
        this.loaded = false;
    }

    // Carica tutti i dati necessari
    async loadAllData() {
        try {
            const promises = [
                this.loadCompanyData(),
                this.loadServicesData(),
                this.loadProjectsData(),
                this.loadTeamData(),
                this.loadContactData()
            ];

            await Promise.all(promises);
            this.loaded = true;
            this.renderAllContent();
        } catch (error) {
            console.error('Errore nel caricamento dei dati:', error);
            this.showError('Errore nel caricamento dei contenuti');
        }
    }

    // Carica i dati dell'azienda
    async loadCompanyData() {
        try {
            const response = await fetch('data/company.json');
            if (!response.ok) throw new Error('Errore nel caricamento dati azienda');
            this.data.company = await response.json();
        } catch (error) {
            console.error('Errore caricamento dati azienda:', error);
            this.data.company = this.getDefaultCompanyData();
        }
    }

    // Carica i dati dei servizi
    async loadServicesData() {
        try {
            const response = await fetch('data/services.json');
            if (!response.ok) throw new Error('Errore nel caricamento servizi');
            this.data.services = await response.json();
        } catch (error) {
            console.error('Errore caricamento servizi:', error);
            this.data.services = this.getDefaultServicesData();
        }
    }

    // Carica i dati dei progetti
    async loadProjectsData() {
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) throw new Error('Errore nel caricamento progetti');
            this.data.projects = await response.json();
        } catch (error) {
            console.error('Errore caricamento progetti:', error);
            this.data.projects = this.getDefaultProjectsData();
        }
    }

    // Carica i dati del team
    async loadTeamData() {
        try {
            const response = await fetch('data/team.json');
            if (!response.ok) throw new Error('Errore nel caricamento team');
            this.data.team = await response.json();
        } catch (error) {
            console.error('Errore caricamento team:', error);
            this.data.team = this.getDefaultTeamData();
        }
    }

    // Carica i dati di contatto
    async loadContactData() {
        try {
            const response = await fetch('data/contact.json');
            if (!response.ok) throw new Error('Errore nel caricamento contatti');
            this.data.contact = await response.json();
        } catch (error) {
            console.error('Errore caricamento contatti:', error);
            this.data.contact = this.getDefaultContactData();
        }
    }

    // Renderizza tutti i contenuti
    renderAllContent() {
        this.renderCompanyInfo();
        this.renderServices();
        this.renderProjects();
        this.renderTeam();
        this.renderContactInfo();
        this.renderFooterServices();
        this.updatePageTitle();
        this.updateMetaTags();
    }

    // Renderizza le informazioni dell'azienda
    renderCompanyInfo() {
        if (!this.data.company) return;

        const company = this.data.company;
        
        // Aggiorna il titolo della pagina
        document.title = `${company.name} - ${company.tagline}`;
        
        // Aggiorna il logo se specificato
        if (company.logo) {
            const logoElements = document.querySelectorAll('.navbar-brand img, .footer-brand img');
            logoElements.forEach(img => {
                img.src = company.logo;
                img.alt = `${company.name} Logo`;
            });
        }

        // Aggiorna le statistiche
        if (company.stats) {
            const statElements = document.querySelectorAll('.stat-number');
            statElements.forEach((element, index) => {
                const stat = company.stats[index];
                if (stat) {
                    element.setAttribute('data-target', stat.value);
                    element.nextElementSibling.textContent = stat.label;
                }
            });
        }

        // Aggiorna la timeline
        if (company.timeline) {
            this.renderTimeline(company.timeline);
        }
    }

    // Renderizza i servizi
    renderServices() {
        if (!this.data.services || !this.data.services.length) return;

        const container = document.getElementById('servizi-container');
        if (!container) return;

        const servicesHTML = this.data.services.map(service => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="service-card fade-in">
                    <div class="service-icon">
                        <i class="${service.icon}"></i>
                    </div>
                    <h3 class="service-title">${service.title}</h3>
                    <p class="service-description">${service.description}</p>
                    ${service.features ? `
                        <ul class="service-features">
                            ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            </div>
        `).join('');

        container.innerHTML = servicesHTML;
    }

    // Renderizza i progetti
    renderProjects() {
        if (!this.data.projects || !this.data.projects.length) return;

        const container = document.getElementById('progetti-container');
        if (!container) return;

        const projectsHTML = this.data.projects.map(project => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="project-card fade-in">
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.title}" loading="lazy">
                        <div class="project-overlay">
                            <div class="project-overlay-content">
                                <h4>${project.title}</h4>
                                <p>${project.shortDescription}</p>
                            </div>
                        </div>
                    </div>
                    <div class="project-content">
                        <div class="project-category">${project.category}</div>
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        ${project.technologies ? `
                            <div class="project-technologies">
                                ${project.technologies.map(tech => `<span class="badge badge-primary">${tech}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = projectsHTML;
    }

    // Renderizza il team
    renderTeam() {
        if (!this.data.team || !this.data.team.length) return;

        const container = document.getElementById('team-container');
        if (!container) return;

        const teamHTML = this.data.team.map(member => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="team-card fade-in">
                    <div class="team-photo">
                        <img src="${member.photo}" alt="${member.name}" loading="lazy">
                    </div>
                    <div class="team-info">
                        <h3 class="team-name">${member.name}</h3>
                        <div class="team-role">${member.role}</div>
                        <p class="team-description">${member.description}</p>
                    </div>
                    ${member.social ? `
                        <div class="team-social">
                            ${Object.entries(member.social).map(([platform, url]) => `
                                <a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${platform}">
                                    <i class="fab fa-${platform}"></i>
                                </a>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        container.innerHTML = teamHTML;
    }

    // Renderizza le informazioni di contatto
    renderContactInfo() {
        if (!this.data.contact) return;

        const contact = this.data.contact;
        
        // Aggiorna i dettagli di contatto
        if (contact.address) {
            document.getElementById('contact-address').textContent = contact.address;
        }
        if (contact.phone) {
            document.getElementById('contact-phone').textContent = contact.phone;
        }
        if (contact.email) {
            document.getElementById('contact-email').textContent = contact.email;
        }
        if (contact.hours) {
            document.getElementById('contact-hours').textContent = contact.hours;
        }

        // Aggiorna i link social nel footer
        if (contact.social) {
            this.updateSocialLinks(contact.social);
        }
    }

    // Renderizza i servizi nel footer
    renderFooterServices() {
        if (!this.data.services || !this.data.services.length) return;

        const container = document.getElementById('footer-servizi');
        if (!container) return;

        const servicesHTML = this.data.services.slice(0, 5).map(service => `
            <li><a href="#servizi">${service.title}</a></li>
        `).join('');

        container.innerHTML = servicesHTML;
    }

    // Renderizza la timeline
    renderTimeline(timeline) {
        const timelineContainer = document.querySelector('.timeline');
        if (!timelineContainer) return;

        const timelineHTML = timeline.map(item => `
            <div class="timeline-item">
                <div class="timeline-icon">
                    <i class="${item.icon}"></i>
                </div>
                <div class="timeline-content">
                    <h4>${item.year} - ${item.title}</h4>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');

        timelineContainer.innerHTML = timelineHTML;
    }

    // Aggiorna i link social
    updateSocialLinks(social) {
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            const platform = link.querySelector('i').className.split('fa-')[1];
            if (social[platform]) {
                link.href = social[platform];
            }
        });
    }

    // Aggiorna il titolo della pagina
    updatePageTitle() {
        if (this.data.company && this.data.company.name) {
            document.title = `${this.data.company.name} - Chi Siamo`;
        }
    }

    // Aggiorna i meta tag
    updateMetaTags() {
        if (!this.data.company) return;

        const company = this.data.company;
        
        // Aggiorna Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', `${company.name} - Chi Siamo`);

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.setAttribute('content', company.description || company.tagline);

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage && company.logo) ogImage.setAttribute('content', company.logo);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', company.website || window.location.href);
    }

    // Mostra errore
    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'alert alert-danger';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }

    // ===== DATI DI DEFAULT =====

    getDefaultCompanyData() {
        return {
            name: "Moenia",
            tagline: "Innovazione e qualità al servizio del vostro successo",
            description: "Azienda leader nel settore, specializzata nella fornitura di servizi professionali di alta qualità.",
            logo: "images/logo.png",
            website: "https://www.moenia.eu",
            stats: [
                { value: 20, label: "Anni di Esperienza" },
                { value: 500, label: "Progetti Completati" },
                { value: 50, label: "Clienti Soddisfatti" }
            ],
            timeline: [
                {
                    year: "2003",
                    title: "Fondazione",
                    description: "Nasce Moenia con l'obiettivo di rivoluzionare il settore",
                    icon: "fas fa-rocket"
                },
                {
                    year: "2010",
                    title: "Espansione",
                    description: "Ampliamento dei servizi e apertura di nuove sedi",
                    icon: "fas fa-chart-line"
                },
                {
                    year: "2018",
                    title: "Riconoscimenti",
                    description: "Premi e certificazioni per la qualità dei servizi",
                    icon: "fas fa-award"
                },
                {
                    year: "2023",
                    title: "Innovazione",
                    description: "Focus su tecnologie emergenti e sostenibilità",
                    icon: "fas fa-globe"
                }
            ]
        };
    }

    getDefaultServicesData() {
        return [
            {
                title: "Consulenza Strategica",
                description: "Supporto nella definizione di strategie aziendali e piani di sviluppo.",
                icon: "fas fa-lightbulb",
                features: ["Analisi di mercato", "Pianificazione strategica", "Business plan"]
            },
            {
                title: "Sviluppo Software",
                description: "Creazione di soluzioni software personalizzate per le vostre esigenze.",
                icon: "fas fa-code",
                features: ["Web applications", "Mobile apps", "Sistemi enterprise"]
            },
            {
                title: "Design & UX",
                description: "Progettazione di interfacce utente intuitive e accattivanti.",
                icon: "fas fa-palette",
                features: ["UI/UX Design", "Brand identity", "Prototipazione"]
            },
            {
                title: "Digital Marketing",
                description: "Strategie di marketing digitale per aumentare la visibilità online.",
                icon: "fas fa-bullhorn",
                features: ["SEO/SEM", "Social media", "Content marketing"]
            },
            {
                title: "Formazione",
                description: "Corsi di formazione specializzati per il vostro team.",
                icon: "fas fa-graduation-cap",
                features: ["Corsi personalizzati", "Certificazioni", "Workshop"]
            },
            {
                title: "Supporto Tecnico",
                description: "Assistenza tecnica continua e manutenzione dei sistemi.",
                icon: "fas fa-headset",
                features: ["Help desk", "Manutenzione", "Monitoraggio"]
            }
        ];
    }

    getDefaultProjectsData() {
        return [
            {
                title: "E-commerce Platform",
                description: "Piattaforma e-commerce completa con gestione ordini e pagamenti.",
                shortDescription: "Piattaforma e-commerce moderna e scalabile",
                category: "E-commerce",
                image: "images/project-1.jpg",
                technologies: ["React", "Node.js", "MongoDB"]
            },
            {
                title: "Mobile App",
                description: "Applicazione mobile per la gestione di flotte aziendali.",
                shortDescription: "App mobile per gestione flotte",
                category: "Mobile",
                image: "images/project-2.jpg",
                technologies: ["React Native", "Firebase", "Redux"]
            },
            {
                title: "Dashboard Analytics",
                description: "Dashboard per l'analisi dei dati aziendali in tempo reale.",
                shortDescription: "Dashboard analytics avanzata",
                category: "Analytics",
                image: "images/project-3.jpg",
                technologies: ["Vue.js", "D3.js", "Python"]
            },
            {
                title: "CRM System",
                description: "Sistema di gestione delle relazioni con i clienti.",
                shortDescription: "Sistema CRM completo",
                category: "CRM",
                image: "images/project-4.jpg",
                technologies: ["Angular", "Laravel", "MySQL"]
            },
            {
                title: "Website Redesign",
                description: "Ridisegno completo del sito web aziendale con focus su UX.",
                shortDescription: "Redesign sito web moderno",
                category: "Web Design",
                image: "images/project-5.jpg",
                technologies: ["HTML5", "CSS3", "JavaScript"]
            },
            {
                title: "API Integration",
                description: "Integrazione di servizi esterni tramite API personalizzate.",
                shortDescription: "Integrazione API avanzata",
                category: "Backend",
                image: "images/project-6.jpg",
                technologies: ["Node.js", "Express", "PostgreSQL"]
            }
        ];
    }

    getDefaultTeamData() {
        return [
            {
                name: "Marco Rossi",
                role: "CEO & Founder",
                description: "Esperto di strategia aziendale con oltre 15 anni di esperienza nel settore.",
                photo: "images/team-1.jpg",
                social: {
                    linkedin: "https://linkedin.com/in/marcorossi",
                    twitter: "https://twitter.com/marcorossi"
                }
            },
            {
                name: "Laura Bianchi",
                role: "CTO",
                description: "Specialista in architetture software e tecnologie emergenti.",
                photo: "images/team-2.jpg",
                social: {
                    linkedin: "https://linkedin.com/in/laurabianchi",
                    github: "https://github.com/laurabianchi"
                }
            },
            {
                name: "Giuseppe Verdi",
                role: "Lead Designer",
                description: "Designer creativo con passione per l'UX e l'accessibilità.",
                photo: "images/team-3.jpg",
                social: {
                    linkedin: "https://linkedin.com/in/giuseppeverdi",
                    behance: "https://behance.net/giuseppeverdi"
                }
            },
            {
                name: "Anna Neri",
                role: "Marketing Manager",
                description: "Esperta di marketing digitale e strategie di crescita.",
                photo: "images/team-4.jpg",
                social: {
                    linkedin: "https://linkedin.com/in/annaneri",
                    instagram: "https://instagram.com/annaneri"
                }
            },
            {
                name: "Paolo Gialli",
                role: "Senior Developer",
                description: "Sviluppatore full-stack con expertise in tecnologie moderne.",
                photo: "images/team-5.jpg",
                social: {
                    linkedin: "https://linkedin.com/in/paologialli",
                    github: "https://github.com/paologialli"
                }
            },
            {
                name: "Sofia Rossi",
                role: "UX Researcher",
                description: "Ricercatrice UX con focus su user testing e analisi comportamentale.",
                photo: "images/team-6.jpg",
                social: {
                    linkedin: "https://linkedin.com/in/sofiarossi",
                    twitter: "https://twitter.com/sofiarossi"
                }
            }
        ];
    }

    getDefaultContactData() {
        return {
            address: "Via Roma 123, 00100 Roma, Italia",
            phone: "+39 06 1234567",
            email: "info@moenia.eu",
            hours: "Lun-Ven: 9:00-18:00",
            social: {
                facebook: "https://facebook.com/moenia",
                twitter: "https://twitter.com/moenia",
                linkedin: "https://linkedin.com/company/moenia",
                instagram: "https://instagram.com/moenia"
            }
        };
    }
}

// ===== INIZIALIZZAZIONE =====

// Crea istanza del data loader
const dataLoader = new DataLoader();

// Carica i dati quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
    dataLoader.loadAllData();
});

// Esporta per uso esterno
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
} 