// database.js - CONFIGURATION SUPABASE LIVE

const SUPABASE_CONFIG = {
    url: ' https://xoalzkazphrwoequfnmd.supabase.co',  // À MODIFIER
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvYWx6a2F6cGhyd29lcXVmbm1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODcyMjgsImV4cCI6MjA3ODk2MzIyOH0.CX6NuDFAdbNrmTczkjm_tBHxIo4g3JUPKjyGlazPVtI'                   // À MODIFIER
};

// ==================== FONCTIONS SUPABASE ====================

// Test de connexion
async function testSupabaseConnection() {
    try {
        console.log('🔗 Test connexion Supabase...');
        const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/media?limit=1`, {
            headers: {
                'apikey': SUPABASE_CONFIG.anonKey,
                'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
            }
        });
        
        const isConnected = response.ok;
        console.log('📊 Statut connexion:', isConnected ? '✅ CONNECTÉ' : '❌ ERREUR');
        return isConnected;
    } catch (error) {
        console.error('❌ Erreur connexion Supabase:', error);
        return false;
    }
}

// Récupérer tous les médias
async function getAllMedia() {
    try {
        const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/media?select=*&order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_CONFIG.anonKey,
                'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
            }
        });
        
        if (!response.ok) throw new Error('Erreur réseau');
        const media = await response.json();
        console.log('📸 Médias chargés:', media.length);
        return media;
    } catch (error) {
        console.error('❌ Erreur chargement médias:', error);
        return [];
    }
}

// Sauvegarder un message de contact
async function saveContactMessage(messageData) {
    try {
        const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/contact_messages`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_CONFIG.anonKey,
                'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify([{
                name: messageData.name,
                email: messageData.email,
                subject: messageData.subject,
                message: messageData.message,
                status: 'new'
            }])
        });
        
        if (!response.ok) throw new Error('Erreur sauvegarde');
        const result = await response.json();
        console.log('💾 Message sauvegardé:', result[0]);
        return result[0];
    } catch (error) {
        console.error('❌ Erreur sauvegarde message:', error);
        return null;
    }
}

// Récupérer tous les messages
async function getContactMessages() {
    try {
        const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/contact_messages?select=*&order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_CONFIG.anonKey,
                'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
            }
        });
        
        if (!response.ok) throw new Error('Erreur réseau');
        const messages = await response.json();
        console.log('📧 Messages chargés:', messages.length);
        return messages;
    } catch (error) {
        console.error('❌ Erreur chargement messages:', error);
        return [];
    }
}

// Ajouter un nouveau média
async function addMedia(mediaData) {
    try {
        const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/media`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_CONFIG.anonKey,
                'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify([{
                type: mediaData.type,
                src: mediaData.src,
                title: mediaData.title,
                description: mediaData.description,
                category: mediaData.category,
                location: mediaData.location,
                equipment: mediaData.equipment
            }])
        });
        
        if (!response.ok) throw new Error('Erreur ajout média');
        const result = await response.json();
        console.log('🖼️ Média ajouté:', result[0]);
        return result[0];
    } catch (error) {
        console.error('❌ Erreur ajout média:', error);
        return null;
    }
}

// Exporter les fonctions
export { 
    SUPABASE_CONFIG,
    testSupabaseConnection, 
    getAllMedia, 
    saveContactMessage, 
    getContactMessages,
    addMedia 
};