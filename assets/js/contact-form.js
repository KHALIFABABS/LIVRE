// assets/js/contact-form.js
// Gestion du formulaire de contact

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        this.errorMessage = document.getElementById('errorMessage');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        // Événement de soumission du formulaire
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Validation en temps réel
        this.setupRealTimeValidation();
    }
    
    handleSubmit() {
        // Désactiver le bouton et afficher l'animation
        this.setLoadingState(true);
        
        // Récupérer les données du formulaire
        const formData = this.getFormData();
        
        // Valider les données
        if (!this.validateFormData(formData)) {
            this.setLoadingState(false);
            return;
        }
        
        // Envoyer les données (simulation)
        this.sendFormData(formData)
            .then(response => {
                this.handleSuccess(response);
            })
            .catch(error => {
                this.handleError(error);
            });
    }
    
    getFormData() {
        // Récupérer toutes les données du formulaire
        const formData = new FormData(this.form);
        
        // Convertir en objet JavaScript
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Ajouter des métadonnées
        data.timestamp = new Date().toISOString();
        data.pageUrl = window.location.href;
        data.userAgent = navigator.userAgent;
        data.ip = ''; // Serait récupéré côté serveur
        
        return data;
    }
    
    validateFormData(data) {
        let isValid = true;
        
        // Réinitialiser les erreurs
        this.clearErrors();
        
        // Validation du prénom
        if (!data.firstName || data.firstName.trim().length < 2) {
            this.showError('firstName', 'Le prénom doit contenir au moins 2 caractères');
            isValid = false;
        }
        
        // Validation du nom
        if (!data.lastName || data.lastName.trim().length < 2) {
            this.showError('lastName', 'Le nom doit contenir au moins 2 caractères');
            isValid = false;
        }
        
        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            this.showError('email', 'Veuillez entrer une adresse email valide');
            isValid = false;
        }
        
        // Validation du téléphone (optionnel mais format)
        if (data.phone && data.phone.trim() !== '') {
            const phoneRegex = /^[+\d\s\-()]{8,20}$/;
            if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
                this.showError('phone', 'Format de téléphone invalide');
                isValid = false;
            }
        }
        
        // Validation du sujet
        if (!data.subject) {
            this.showError('subject', 'Veuillez sélectionner un sujet');
            isValid = false;
        }
        
        // Validation du message
        if (!data.message || data.message.trim().length < 10) {
            this.showError('message', 'Le message doit contenir au moins 10 caractères');
            isValid = false;
        }
        
        return isValid;
    }
    
    async sendFormData(data) {
        // SIMULATION - À REMPLACER PAR VOTRE LOGIQUE RÉELLE
        
        // Option 1: Envoi par Email (recommandé)
        // return this.sendViaEmail(data);
        
        // Option 2: Enregistrement local (pour test)
        // return this.saveLocally(data);
        
        // Option 3: Envoi à un webhook/API
        // return this.sendToAPI(data);
        
        // Pour l'instant, simulation avec délai
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simuler un succès 90% du temps
                if (Math.random() > 0.1) {
                    resolve({
                        success: true,
                        messageId: 'MSG_' + Date.now(),
                        timestamp: new Date().toISOString()
                    });
                } else {
                    reject(new Error('Erreur de réseau simulée'));
                }
            }, 1500);
        });
    }
    
    // Méthode 1: Envoi par Email (utilisant mailto)
    sendViaEmail(data) {
        const subject = `[Contact] ${data.subject} - ${data.firstName} ${data.lastName}`;
        const body = `
Nom: ${data.firstName} ${data.lastName}
Email: ${data.email}
Téléphone: ${data.phone || 'Non fourni'}
Sujet: ${data.subject}

Message:
${data.message}

---
Envoyé depuis: ${data.pageUrl}
Date: ${new Date(data.timestamp).toLocaleString('fr-FR')}
        `;
        
        // Créer un lien mailto
        const mailtoLink = `mailto:contact@reveilinterieur.sn?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Ouvrir le client mail
        window.location.href = mailtoLink;
        
        return Promise.resolve({
            success: true,
            method: 'email'
        });
    }
    
    // Méthode 2: Sauvegarde locale (pour développement)
    saveLocally(data) {
        // Récupérer les messages existants
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        
        // Ajouter le nouveau message
        messages.push({
            ...data,
            id: Date.now(),
            status: 'unread',
            read: false
        });
        
        // Sauvegarder
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        // Limiter à 100 messages maximum
        if (messages.length > 100) {
            localStorage.setItem('contactMessages', JSON.stringify(messages.slice(-100)));
        }
        
        // Afficher dans la console pour débogage
        console.log('Message sauvegardé localement:', data);
        
        return Promise.resolve({
            success: true,
            stored: true,
            count: messages.length
        });
    }
    
    // Méthode 3: Envoi à une API (ex: Formspree, Netlify Forms, etc.)
    async sendToAPI(data) {
        // Exemple avec Formspree (service gratuit)
        const formspreeEndpoint = 'https://formspree.io/f/xpzvqvzp'; // À REMPLACER
        
        try {
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Erreur API');
            }
        } catch (error) {
            throw error;
        }
    }
    
    // Méthode 4: Envoi à Google Sheets (via Google Apps Script)
    async sendToGoogleSheets(data) {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbw.../exec'; // À REMPLACER
        
        try {
            const response = await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors', // Important pour Google Apps Script
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data)
            });
            
            return { success: true };
        } catch (error) {
            throw error;
        }
    }
    
    handleSuccess(response) {
        // Réinitialiser le formulaire
        this.form.reset();
        
        // Afficher le message de succès
        this.showSuccess();
        
        // Réactiver le bouton
        this.setLoadingState(false);
        
        // Sauvegarder dans l'historique
        this.saveToHistory('success', response);
        
        // Track l'événement
        this.trackEvent('contact_form_submitted', response);
        
        // Rediriger optionnelle
        // setTimeout(() => {
        //     window.location.href = 'merci.html';
        // }, 3000);
    }
    
    handleError(error) {
        console.error('Erreur d\'envoi:', error);
        
        // Afficher le message d'erreur
        this.showError();
        
        // Réactiver le bouton
        this.setLoadingState(false);
        
        // Sauvegarder dans l'historique
        this.saveToHistory('error', error);
        
        // Offrir une alternative
        this.showAlternativeContact();
    }
    
    setLoadingState(isLoading) {
        if (isLoading) {
            // Sauvegarder le texte original
            this.originalButtonText = this.submitBtn.innerHTML;
            
            // Afficher l'animation de chargement
            this.submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Envoi en cours...
            `;
            this.submitBtn.disabled = true;
        } else {
            // Restaurer le texte original
            if (this.originalButtonText) {
                this.submitBtn.innerHTML = this.originalButtonText;
            }
            this.submitBtn.disabled = false;
        }
    }
    
    showError(fieldId = null, message = null) {
        if (fieldId && message) {
            // Erreur de champ spécifique
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.add('is-invalid');
                
                // Trouver ou créer le message d'erreur
                let errorElement = field.nextElementSibling;
                if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
                    errorElement = document.createElement('div');
                    errorElement.className = 'invalid-feedback';
                    field.parentNode.appendChild(errorElement);
                }
                errorElement.textContent = message;
            }
        } else {
            // Erreur générale du formulaire
            this.errorMessage.classList.remove('d-none');
            this.errorMessage.classList.add('d-block');
            
            // Auto-masquage après 5 secondes
            setTimeout(() => {
                this.errorMessage.classList.add('d-none');
                this.errorMessage.classList.remove('d-block');
            }, 5000);
        }
    }
    
    showSuccess() {
        this.successMessage.classList.remove('d-none');
        this.successMessage.classList.add('d-block');
        
        // Auto-masquage après 5 secondes
        setTimeout(() => {
            this.successMessage.classList.add('d-none');
            this.successMessage.classList.remove('d-block');
        }, 5000);
        
        // Animation de succès
        this.successMessage.style.animation = 'fadeIn 0.5s ease';
    }
    
    clearErrors() {
        // Réinitialiser tous les états d'erreur
        this.form.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        
        // Masquer les messages d'erreur généraux
        this.errorMessage.classList.add('d-none');
        this.errorMessage.classList.remove('d-block');
        
        // Supprimer les messages d'erreur spécifiques
        this.form.querySelectorAll('.invalid-feedback').forEach(el => {
            el.remove();
        });
    }
    
    setupRealTimeValidation() {
        // Validation en temps réel pour chaque champ
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            // Réinitialiser l'erreur quand l'utilisateur commence à taper
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    input.classList.remove('is-invalid');
                    const errorElement = input.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('invalid-feedback')) {
                        errorElement.remove();
                    }
                }
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        
        // Réinitialiser l'erreur
        field.classList.remove('is-invalid');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('invalid-feedback')) {
            errorElement.remove();
        }
        
        // Validation selon le type de champ
        switch (fieldId) {
            case 'firstName':
            case 'lastName':
                if (value.length < 2) {
                    this.showError(fieldId, 'Ce champ doit contenir au moins 2 caractères');
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    this.showError(fieldId, 'Email invalide');
                }
                break;
                
            case 'phone':
                if (value) {
                    const phoneRegex = /^[+\d\s\-()]{8,20}$/;
                    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                        this.showError(fieldId, 'Format de téléphone invalide');
                    }
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    this.showError(fieldId, 'Le message doit contenir au moins 10 caractères');
                }
                break;
                
            case 'subject':
                if (!value) {
                    this.showError(fieldId, 'Veuillez sélectionner un sujet');
                }
                break;
        }
    }
    
    showAlternativeContact() {
        // Créer une alerte avec alternative
        const alternativeAlert = document.createElement('div');
        alternativeAlert.className = 'alert alert-info mt-3';
        alternativeAlert.innerHTML = `
            <h6><i class="fas fa-info-circle me-2"></i>Alternative de contact</h6>
            <p class="mb-2">Vous pouvez également nous contacter directement :</p>
            <div class="d-flex gap-2">
                <a href="https://wa.me/221781234567" target="_blank" class="btn btn-success btn-sm">
                    <i class="fab fa-whatsapp me-1"></i> WhatsApp
                </a>
                <a href="mailto:contact@reveilinterieur.sn" class="btn btn-warning btn-sm">
                    <i class="fas fa-envelope me-1"></i> Email
                </a>
            </div>
        `;
        
        // Insérer après le formulaire
        this.form.parentNode.insertBefore(alternativeAlert, this.form.nextSibling);
        
        // Auto-suppression après 10 secondes
        setTimeout(() => {
            alternativeAlert.remove();
        }, 10000);
    }
    
    saveToHistory(status, data) {
        const history = JSON.parse(localStorage.getItem('contactFormHistory') || '[]');
        
        history.push({
            status: status,
            data: data,
            timestamp: new Date().toISOString(),
            page: 'contact'
        });
        
        localStorage.setItem('contactFormHistory', JSON.stringify(history));
        
        // Limiter l'historique
        if (history.length > 50) {
            localStorage.setItem('contactFormHistory', JSON.stringify(history.slice(-50)));
        }
    }
    
    trackEvent(eventName, data) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': 'contact',
                'event_label': data.subject || 'contact_form',
                'value': 1
            });
        }
        
        // Console pour débogage
        console.log(`[Contact Form] ${eventName}:`, {
            ...data,
            timestamp: new Date().toISOString()
        });
    }
    
    // Méthode pour exporter les messages (pour l'administrateur)
    static exportMessages() {
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        
        if (messages.length === 0) {
            alert('Aucun message à exporter');
            return;
        }
        
        // Convertir en CSV
        const headers = ['ID', 'Date', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Sujet', 'Message', 'Newsletter'];
        const csvRows = [headers.join(',')];
        
        messages.forEach(msg => {
            const row = [
                msg.id,
                msg.timestamp,
                `"${msg.firstName}"`,
                `"${msg.lastName}"`,
                `"${msg.email}"`,
                `"${msg.phone || ''}"`,
                `"${msg.subject}"`,
                `"${msg.message.replace(/"/g, '""')}"`,
                msg.newsletter === 'yes' ? 'Oui' : 'Non'
            ];
            csvRows.push(row.join(','));
        });
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    // Méthode pour afficher l'historique (pour débogage)
    static showHistory() {
        const history = JSON.parse(localStorage.getItem('contactFormHistory') || '[]');
        console.log('Historique du formulaire:', history);
        
        // Créer un modal pour afficher l'historique
        const modalHTML = `
            <div class="modal fade" id="historyModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content bg-dark text-light">
                        <div class="modal-header">
                            <h5 class="modal-title">Historique des soumissions</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <pre>${JSON.stringify(history, null, 2)}</pre>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                            <button type="button" class="btn btn-warning" onclick="ContactFormHandler.exportMessages()">Exporter CSV</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        if (!document.getElementById('historyModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const modal = new bootstrap.Modal(document.getElementById('historyModal'));
            modal.show();
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = new ContactFormHandler();
    
    // Exposer la classe globalement pour débogage
    window.ContactFormHandler = ContactFormHandler;
});