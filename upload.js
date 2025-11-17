// upload.js - SYSTÈME UPLOAD SUPABASE

class MediaUploader {
    constructor() {
        this.supabaseConfig = {
            url: ' https://xoalzkazphrwoequfnmd.supabase.co',  // Remplace par ton URL
            anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvYWx6a2F6cGhyd29lcXVmbm1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODcyMjgsImV4cCI6MjA3ODk2MzIyOH0.CX6NuDFAdbNrmTczkjm_tBHxIo4g3JUPKjyGlazPVtI'              // Remplace par ta clé
        };
        this.bucketName = 'drone-media';
    }

    // Upload un fichier vers Supabase Storage
    async uploadFile(file) {
        try {
            console.log('📤 Début upload:', file.name);
            
            // Créer un nom unique pour le fichier
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload vers Supabase Storage
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch(
                `${this.supabaseConfig.url}/storage/v1/object/${this.bucketName}/${filePath}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.supabaseConfig.anonKey}`,
                    },
                    body: formData
                }
            );

            if (!uploadResponse.ok) {
                throw new Error('Erreur upload storage');
            }

            // Récupérer l'URL publique du fichier
            const publicURL = `${this.supabaseConfig.url}/storage/v1/object/public/${this.bucketName}/${filePath}`;
            
            console.log('✅ Upload réussi:', publicURL);
            return {
                success: true,
                url: publicURL,
                fileName: fileName,
                originalName: file.name
            };

        } catch (error) {
            console.error('❌ Erreur upload:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Ajouter un média à la base de données
    async addMediaToDatabase(mediaData) {
        try {
            const response = await fetch(`${this.supabaseConfig.url}/rest/v1/media`, {
                method: 'POST',
                headers: {
                    'apikey': this.supabaseConfig.anonKey,
                    'Authorization': `Bearer ${this.supabaseConfig.anonKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify([{
                    type: mediaData.type,
                    src: mediaData.url,
                    title: mediaData.title,
                    description: mediaData.description,
                    category: mediaData.category,
                    location: mediaData.location,
                    equipment: mediaData.equipment
                }])
            });

            if (!response.ok) throw new Error('Erreur base de données');
            
            const result = await response.json();
            console.log('💾 Média sauvegardé en base:', result[0]);
            return result[0];

        } catch (error) {
            console.error('❌ Erreur sauvegarde base:', error);
            return null;
        }
    }

    // Gérer l'upload complet (fichier + base de données)
    async handleMediaUpload(file, mediaInfo = {}) {
        // Afficher la progression
        this.showUploadProgress(file.name, 0);

        try {
            // Étape 1: Upload du fichier
            this.showUploadProgress(file.name, 30);
            const uploadResult = await this.uploadFile(file);
            
            if (!uploadResult.success) {
                throw new Error(uploadResult.error);
            }

            // Étape 2: Déterminer le type (image ou vidéo)
            const fileType = file.type.startsWith('image/') ? 'image' : 'video';
            
            // Étape 3: Préparer les données pour la base
            this.showUploadProgress(file.name, 70);
            const mediaData = {
                type: fileType,
                url: uploadResult.url,
                title: mediaInfo.title || uploadResult.originalName,
                description: mediaInfo.description || 'Nouveau média uploadé',
                category: mediaInfo.category || 'drone',
                location: mediaInfo.location || 'Var',
                equipment: mediaInfo.equipment || 'DJI'
            };

            // Étape 4: Sauvegarder dans la base
            this.showUploadProgress(file.name, 90);
            const dbResult = await this.addMediaToDatabase(mediaData);

            // Succès complet
            this.showUploadProgress(file.name, 100);
            this.showNotification(`✅ "${file.name}" uploadé avec succès!`, 'success');
            
            return {
                success: true,
                file: uploadResult,
                database: dbResult
            };

        } catch (error) {
            this.showUploadProgress(file.name, 0, true);
            this.showNotification(`❌ Erreur: ${error.message}`, 'error');
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Afficher la progression de l'upload
    showUploadProgress(fileName, percent, isError = false) {
        console.log(`📊 ${fileName}: ${percent}% ${isError ? '❌' : '✅'}`);
        
        // Mettre à jour l'interface (à améliorer)
        const progressElement = document.getElementById('uploadProgress') || this.createProgressElement();
        progressElement.innerHTML = `
            <div class="upload-progress ${isError ? 'error' : ''}">
                <div class="progress-bar" style="width: ${percent}%"></div>
                <span class="progress-text">
                    ${isError ? '❌' : '📤'} ${fileName} - ${percent}%
                </span>
            </div>
        `;
    }

    createProgressElement() {
        const progressDiv = document.createElement('div');
        progressDiv.id = 'uploadProgress';
        progressDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: var(--admin-card);
            border: 1px solid var(--admin-border);
            border-radius: 8px;
            padding: 1rem;
            min-width: 300px;
        `;
        document.body.appendChild(progressDiv);
        return progressDiv;
    }

    // Afficher une notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `upload-notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationColor(type) {
        const colors = {
            'success': '#00F0FF',
            'error': '#FF6B6B',
            'info': '#9D00FF'
        };
        return colors[type] || colors.info;
    }
}

// Initialiser l'uploader
const mediaUploader = new MediaUploader();

// Exporter pour utilisation globale
window.mediaUploader = mediaUploader;