// admin-dashboard.js - Gestion du Dashboard Admin

class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Navigation entre sections
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('href').substring(1);
                this.showSection(target);
            });
        });

        // Boutons d'action
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadDashboardData();
            this.showNotification('Données actualisées', 'success');
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        document.getElementById('addMediaBtn').addEventListener('click', () => {
            this.showMediaUpload();
        });

        // Drag and drop pour l'upload
        this.setupDragAndDrop();
    }

    setupNavigation() {
        // Navigation par hash dans l'URL
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1) || 'dashboard';
            this.showSection(hash);
        });

        // Initialisation basée sur l'URL actuelle
        const initialHash = window.location.hash.substring(1) || 'dashboard';
        this.showSection(initialHash);
    }

    showSection(sectionId) {
        // Masquer toutes les sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });

        // Désactiver tous les items de menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });

        // Afficher la section demandée
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Activer l'item de menu correspondant
            const menuItem = document.querySelector(`[href="#${sectionId}"]`);
            if (menuItem) {
                menuItem.classList.add('active');
            }

            this.currentSection = sectionId;

            // Charger les données spécifiques à la section
            this.loadSectionData(sectionId);
        }
    }

    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'media':
                this.loadMediaData();
                break;
            case 'messages':
                this.loadMessagesData();
                break;
            case 'members':
                // À implémenter
                break;
            case 'settings':
                // À implémenter
                break;
        }
    }

    async loadDashboardData() {
        try {
            // Simulation de données - à remplacer par Supabase plus tard
            const mockData = {
                totalMedia: 24,
                totalMessages: 8,
                totalViews: 1542,
                onlineStatus: '🟢'
            };

            // Mettre à jour l'interface
            document.getElementById('totalMedia').textContent = mockData.totalMedia;
            document.getElementById('totalMessages').textContent = mockData.totalMessages;
            document.getElementById('totalViews').textContent = mockData.totalViews;
            document.getElementById('onlineStatus').textContent = mockData.onlineStatus;

        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
            this.showNotification('Erreur de chargement des données', 'error');
        }
    }

    async loadMediaData() {
        try {
            // Simulation de données médias
            const mockMedia = [
                {
                    id: 1,
                    title: "Massif des Maures",
                    description: "Vue aérienne du massif des Maures au coucher du soleil",
                    type: "image",
                    category: "montagne",
                    date: "15 Jan 2024",
                    src: "assets/images/montagne-1.jpg"
                },
                {
                    id: 2,
                    title: "Lac de Sainte-Croix",
                    description: "Reflet des montagnes dans les eaux turquoises",
                    type: "image", 
                    category: "lac",
                    date: "08 Mar 2024",
                    src: "assets/images/lac-sainte-croix.jpg"
                }
            ];

            this.displayMediaList(mockMedia);

        } catch (error) {
            console.error('Erreur chargement médias:', error);
            this.showNotification('Erreur de chargement des médias', 'error');
        }
    }

    displayMediaList(mediaArray) {
        const mediaList = document.getElementById('mediaList');
        
        if (mediaArray.length === 0) {
            mediaList.innerHTML = `
                <div class="coming-soon">
                    <p>Aucun média trouvé</p>
                    <small>Utilisez le bouton "Ajouter un média" pour commencer</small>
                </div>
            `;
            return;
        }

        mediaList.innerHTML = mediaArray.map(media => `
            <div class="media-item" data-media-id="${media.id}">
                <div class="media-preview">
                    <img src="${media.src}" alt="${media.title}" onerror="this.style.display='none'">
                </div>
                <div class="media-info">
                    <h4>${media.title}</h4>
                    <p>${media.description}</p>
                    <div class="media-meta">
                        <span>${media.type === 'image' ? '📸' : '🎥'} ${media.type}</span>
                        <span>${this.getCategoryIcon(media.category)} ${media.category}</span>
                        <span>${media.date}</span>
                    </div>
                </div>
                <div class="media-actions">
                    <button class="btn-action edit" onclick="admin.editMedia(${media.id})">✏️</button>
                    <button class="btn-action delete" onclick="admin.deleteMedia(${media.id})">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    getCategoryIcon(category) {
        const icons = {
            'montagne': '🏔️',
            'foret': '🌲', 
            'lac': '🏞️',
            'cote': '🌊',
            'drone': '🚁'
        };
        return icons[category] || '📁';
    }

    async loadMessagesData() {
        try {
            // Simulation de données messages
            const mockMessages = [
                {
                    id: 1,
                    name: "Jean Dupont",
                    email: "jean.dupont@email.com",
                    subject: "Prestation drone",
                    message: "Bonjour, je suis intéressé par vos prestations drone pour un projet immobilier...",
                    date: "Aujourd'hui, 14:30",
                    read: false
                },
                {
                    id: 2, 
                    name: "Marie Martin",
                    email: "marie.martin@email.com",
                    subject: "Question réglementation",
                    message: "Bonjour, j'aimerais connaître les règles pour voler en zone urbaine...",
                    date: "Hier, 09:15", 
                    read: true
                }
            ];

            this.displayMessagesList(mockMessages);

        } catch (error) {
            console.error('Erreur chargement messages:', error);
            this.showNotification('Erreur de chargement des messages', 'error');
        }
    }

    displayMessagesList(messagesArray) {
        const messagesList = document.getElementById('messagesList');
        
        if (messagesArray.length === 0) {
            messagesList.innerHTML = `
                <div class="coming-soon">
                    <p>Aucun message reçu</p>
                    <small>Les messages de contact apparaîtront ici</small>
                </div>
            `;
            return;
        }

        messagesList.innerHTML = messagesArray.map(msg => `
            <div class="message-item ${msg.read ? '' : 'unread'}" data-message-id="${msg.id}">
                <div class="message-header">
                    <h4>${msg.name}</h4>
                    <span class="message-date">${msg.date}</span>
                </div>
                <p class="message-preview">${msg.message.substring(0, 100)}...</p>
                <div class="message-actions">
                    <button class="btn-action" onclick="admin.viewMessage(${msg.id})">👁️</button>
                    <button class="btn-action" onclick="admin.replyToMessage(${msg.id})">📧</button>
                    <button class="btn-action" onclick="admin.deleteMessage(${msg.id})">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            uploadArea.style.borderColor = 'var(--admin-accent)';
            uploadArea.style.background = 'rgba(0, 240, 255, 0.1)';
        }

        function unhighlight() {
            uploadArea.style.borderColor = 'var(--admin-border)';
            uploadArea.style.background = 'transparent';
        }

        uploadArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            admin.handleFiles(files);
        }
    }

    handleFiles(files) {
        if (files.length > 0) {
            this.showNotification(`${files.length} fichier(s) prêt(s) pour l'upload`, 'success');
            // Ici on intégrera l'upload vers Supabase
            console.log('Fichiers à uploader:', files);
        }
    }

    showMediaUpload() {
        // Créer un input file caché
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,video/*';
        fileInput.multiple = true;
        
        fileInput.onchange = (e) => {
            this.handleFiles(e.target.files);
        };
        
        fileInput.click();
    }

    // Méthodes pour les actions (à implémenter)
    editMedia(mediaId) {
        this.showNotification(`Édition du média ${mediaId}`, 'info');
    }

    deleteMedia(mediaId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) {
            this.showNotification(`Média ${mediaId} supprimé`, 'success');
        }
    }

    viewMessage(messageId) {
        this.showNotification(`Affichage du message ${messageId}`, 'info');
    }

    replyToMessage(messageId) {
        this.showNotification(`Réponse au message ${messageId}`, 'info');
    }

    deleteMessage(messageId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
            this.showNotification(`Message ${messageId} supprimé`, 'success');
        }
    }

    logout() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            // Redirection vers la page d'accueil
            window.location.href = 'index.html';
        }
    }

    showNotification(message, type = 'info') {
        // Créer une notification
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <span class="notification-close">&times;</span>
        `;

        // Styles de la notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: var(--admin-dark);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            animation: notificationSlide 0.3s ease-out;
            font-weight: 600;
        `;

        document.body.appendChild(notification);

        // Fermeture automatique
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Fermeture manuelle
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.remove();
            }
        });

        // Ajouter les styles d'animation si pas déjà présents
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                @keyframes notificationSlide {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification-close {
                    cursor: pointer;
                    font-size: 1.2rem;
                    font-weight: bold;
                }
                .notification-close:hover {
                    opacity: 0.7;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    getNotificationColor(type) {
        const colors = {
            'success': 'linear-gradient(45deg, #00F0FF, #0080FF)',
            'error': 'linear-gradient(45deg, #FF6B6B, #FF4757)',
            'info': 'linear-gradient(45deg, #9D00FF, #FF00CC)',
            'warning': 'linear-gradient(45deg, #FFA500, #FF8C00)'
        };
        return colors[type] || colors.info;
    }
}

// Initialisation du dashboard quand la page est chargée
let admin;
document.addEventListener('DOMContentLoaded', () => {
    admin = new AdminDashboard();
});