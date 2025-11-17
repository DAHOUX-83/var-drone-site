// script.js - VAR DRONE ASSOCIATION

// Données de la galerie (pour l'instant en dur, après on fera avec une base de données !)
const mediaData = [
    {
        id: 1,
        type: 'image',
        src: 'assets/images/montagne-1.jpg',
        title: 'Massif des Maures',
        description: 'Vue aérienne du massif des Maures au coucher du soleil',
        category: 'montagne',
        date: '15 Jan 2024',
        location: 'Massif des Maures, Var',
        equipment: 'DJI Mavic 3 Pro'
    },
    {
        id: 2,
        type: 'video',
        src: 'assets/videos/cote-var.mp4',
        title: 'Côte Varoise',
        description: 'Survol des calanques et criques du littoral varois',
        category: 'cote',
        date: '22 Fév 2024',
        location: 'Côte d\'Azur, Var',
        equipment: 'DJI FPV'
    },
    {
        id: 3,
        type: 'image',
        src: 'assets/images/lac-sainte-croix.jpg',
        title: 'Lac de Sainte-Croix',
        description: 'Reflet des montagnes dans les eaux turquoises du lac',
        category: 'lac',
        date: '08 Mar 2024',
        location: 'Lac de Sainte-Croix, Var',
        equipment: 'DJI Air 3'
    },
    {
        id: 4,
        type: 'video',
        src: 'assets/videos/foret-domes.mp4',
        title: 'Forêt des Défends',
        description: 'Navigation entre les pins et chênes lièges',
        category: 'foret',
        date: '30 Mar 2024',
        location: 'Forêt des Défends, Var',
        equipment: 'DJI Mini 4 Pro'
    },
    {
        id: 5,
        type: 'image',
        src: 'assets/images/iles-dor.jpg',
        title: 'Îles d\'Or',
        description: 'Vue spectaculaire des îles d\'Hyères depuis les airs',
        category: 'drone',
        date: '12 Avr 2024',
        location: 'Îles d\'Hyères, Var',
        equipment: 'DJI Mavic 3'
    },
    {
        id: 6,
        type: 'image',
        src: 'assets/images/gorges-verdon.jpg',
        title: 'Gorges du Verdon',
        description: 'Perspective vertigineuse sur le Grand Canyon du Verdon',
        category: 'montagne',
        date: '18 Mai 2024',
        location: 'Gorges du Verdon, Var',
        equipment: 'DJI Air 3'
    }
];

// État de l'application
let currentFilter = 'all';
let currentMedia = null;

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    setupEventListeners();
    setupContactForm();
    setupSmoothScroll();
});

// ==================== FONCTIONS GALERIE ====================
function initializeGallery() {
    displayMedia(mediaData);
}

function displayMedia(mediaArray) {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';

    // Si pas de médias, afficher un message
    if (mediaArray.length === 0) {
        gridContainer.innerHTML = `
            <div class="no-media" style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--text-light);">
                <h3 style="color: var(--space-accent); margin-bottom: 1rem;">Aucun média trouvé</h3>
                <p>Essayez de changer les filtres de recherche</p>
            </div>
        `;
        return;
    }

    mediaArray.forEach(media => {
        const mediaCard = createMediaCard(media);
        gridContainer.appendChild(mediaCard);
    });
}

function createMediaCard(media) {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.setAttribute('data-category', media.category);
    
    let mediaElement;
    if (media.type === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = media.src;
        mediaElement.alt = media.title;
        // Image de remplacement si le fichier n'existe pas encore
        mediaElement.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDMwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjMEExQTFBIi8+CjxwYXRoIGQ9Ik0xNTAgODVWMTQwTTEyNSAxMTAuNUgxNzUiIHN0cm9rZT0iIzAwRDRGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDBENEZGIj5WYXIgRHJvbmUgQXNzb2M8L3RleHQ+Cjwvc3ZnPg==';
        };
    } else {
        mediaElement = document.createElement('video');
        mediaElement.src = media.src;
        mediaElement.controls = true;
        mediaElement.muted = true;
        // Vidéo de remplacement
        mediaElement.onerror = function() {
            this.parentElement.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #1A1A3A; color: #00D4FF; border: 2px dashed #00D4FF;">
                    <div style="text-align: center;">
                        <div style="font-size: 3rem;">🎥</div>
                        <p>Vidéo en préparation</p>
                        <small>Var Drone Association</small>
                    </div>
                </div>
            `;
        };
    }

    card.innerHTML = `
        ${mediaElement.outerHTML}
        <div class="media-type">${media.type === 'image' ? '📸 Photo' : '🎥 Vidéo'}</div>
        <div class="media-info">
            <h4>${media.title}</h4>
            <p>${media.description}</p>
        </div>
    `;

    card.addEventListener('click', () => openModal(media));
    return card;
}

// ==================== GESTION DES ÉVÉNEMENTS ====================
function setupEventListeners() {
    // Filtres
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            filterMedia();
        });
    });

    // Modal
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    const modal = document.getElementById('mediaModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }

    // Navigation clavier
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    // Bouton CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const gallerySection = document.querySelector('.gallery');
            if (gallerySection) {
                gallerySection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    }

    // Badge Admin (future fonctionnalité)
    const adminBadge = document.querySelector('.admin-badge');
    if (adminBadge) {
        adminBadge.addEventListener('click', function() {
            showNotification('Espace Admin - Bientôt disponible !', 'success');
        });
    }
}

function filterMedia() {
    let filteredMedia;
    if (currentFilter === 'all') {
        filteredMedia = mediaData;
    } else if (currentFilter === 'video') {
        filteredMedia = mediaData.filter(media => media.type === 'video');
    } else {
        filteredMedia = mediaData.filter(media => media.category === currentFilter);
    }
    
    displayMedia(filteredMedia);
}

// ==================== MODAL ====================
function openModal(media) {
    currentMedia = media;
    const modal = document.getElementById('mediaModal');
    const modalMedia = document.querySelector('.modal-media');
    const mediaTitle = document.getElementById('mediaTitle');
    const mediaDescription = document.getElementById('mediaDescription');
    const mediaDate = document.getElementById('mediaDate');
    const mediaLocation = document.getElementById('mediaLocation');
    const mediaEquipment = document.getElementById('mediaEquipment');

    if (!modal || !modalMedia) return;

    // Vider le contenu média précédent
    modalMedia.innerHTML = '';

    // Créer le nouvel élément média
    let mediaElement;
    if (media.type === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = media.src;
        mediaElement.alt = media.title;
        mediaElement.onerror = function() {
            modalMedia.innerHTML = `
                <div style="color: #00D4FF; text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem;">📸</div>
                    <h3>Image en cours de production</h3>
                    <p>${media.title}</p>
                    <small>Var Drone Association</small>
                </div>
            `;
        };
    } else {
        mediaElement = document.createElement('video');
        mediaElement.src = media.src;
        mediaElement.controls = true;
        mediaElement.autoplay = true;
        mediaElement.onerror = function() {
            modalMedia.innerHTML = `
                <div style="color: #00D4FF; text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem;">🎥</div>
                    <h3>Vidéo en cours de montage</h3>
                    <p>${media.title}</p>
                    <small>Var Drone Association</small>
                </div>
            `;
        };
    }

    modalMedia.appendChild(mediaElement);

    // Mettre à jour les informations
    if (mediaTitle) mediaTitle.textContent = media.title;
    if (mediaDescription) mediaDescription.textContent = media.description;
    if (mediaDate) mediaDate.textContent = media.date;
    if (mediaLocation) mediaLocation.textContent = media.location;
    if (mediaEquipment) mediaEquipment.textContent = media.equipment;

    // Afficher le modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('mediaModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Arrêter les vidéos
        const videos = modal.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    }
}

// ==================== FORMULAIRE DE CONTACT ====================
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Validation
            if (validateForm(formData)) {
                simulateFormSubmission(formData);
            }
        });
    }
}

function validateForm(formData) {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return false;
    }
    
    if (!isValidEmail(formData.email)) {
        showNotification('Veuillez entrer un email valide', 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function simulateFormSubmission(formData) {
    const submitBtn = document.querySelector('.submit-btn');
    if (!submitBtn) return;
    
    const originalText = submitBtn.textContent;
    
    // Animation de chargement
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    
    // Simulation d'attente
    setTimeout(() => {
        showNotification('Message envoyé avec succès ! Nous vous recontacterons rapidement.', 'success');
        
        // Réinitialisation du formulaire
        const contactForm = document.getElementById('contactForm');
        if (contactForm) contactForm.reset();
        
        // Restauration du bouton
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Log des données (pour debug)
        console.log('📧 Message reçu:', {
            from: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message.substring(0, 50) + '...'
        });
        
    }, 2000);
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, type) {
    // Création de la notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <span class="notification-close">&times;</span>
    `;
    
    // Styles de la notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(45deg, #00D4FF, #0066FF)' : 'linear-gradient(45deg, #FF6B6B, #FF4757)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
        font-family: 'Orbitron', sans-serif;
        border: 1px solid ${type === 'success' ? '#00D4FF' : '#FF6B6B'};
    `;
    
    document.body.appendChild(notification);
    
    // Fermeture automatique après 5 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Fermeture manuelle
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (notification.parentNode) {
                notification.remove();
            }
        });
    }
}

// Ajout des styles pour l'animation de notification
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification-close {
        cursor: pointer;
        font-size: 1.2rem;
        font-weight: bold;
        padding: 0.2rem;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
`;
document.head.appendChild(notificationStyles);

// ==================== NAVIGATION FLUIDE ====================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Calculer la position en prenant en compte la navbar fixe
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== FONCTIONS UTILITAIRES ====================
function addMedia(newMedia) {
    mediaData.push(newMedia);
    filterMedia();
}

// Exemple d'utilisation future :
/*
const nouveauMedia = {
    id: mediaData.length + 1,
    type: 'image',
    src: 'assets/images/ma-nouvelle-photo.jpg',
    title: 'Nouvelle prise de vue',
    description: 'Description de la nouvelle photo',
    category: 'drone',
    date: new Date().toLocaleDateString('fr-FR'),
    location: 'Var',
    equipment: 'DJI Mini 3'
};
addMedia(nouveauMedia);
*/

// ==================== GESTION DU RESPONSIVE ====================
function handleResize() {
    // Ajustements spécifiques pour le responsive
    const gridContainer = document.querySelector('.grid-container');
    if (gridContainer && window.innerWidth < 768) {
        gridContainer.style.gap = '1rem';
    }
}

window.addEventListener('resize', handleResize);

// Initialisation au chargement
handleResize();

console.log('🚁 Var Drone Association - Site chargé avec succès !');