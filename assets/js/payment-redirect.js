// assets/js/payment-redirect.js
// Gestion de la redirection après paiement

class PaymentRedirect {
    constructor() {
        this.form = document.getElementById('paymentForm');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.setupForm();
            this.setupPaymentButtons();
        }
    }
    
    setupForm() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Valider le formulaire
            if (!this.validateForm()) {
                return;
            }
            
            // Récupérer les données du formulaire
            const formData = this.getFormData();
            
            try {
                // Simuler le traitement du paiement
                await this.processPayment(formData);
                
                // Rediriger vers la page de succès
                this.redirectToSuccess(formData);
                
            } catch (error) {
                console.error('Erreur de paiement:', error);
                this.showError('Une erreur est survenue. Veuillez réessayer.');
            }
        });
    }
    
    setupPaymentButtons() {
        // Boutons de paiement directs
        document.querySelectorAll('.btn-payment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Récupérer les données du formulaire
                const formData = this.getFormData();
                
                if (!this.validateFormData(formData)) {
                    this.showError('Veuillez remplir tous les champs obligatoires.');
                    return;
                }
                
                // Ouvrir le lien de paiement dans un nouvel onglet
                const paymentUrl = btn.getAttribute('href');
                window.open(paymentUrl, '_blank');
                
                // Rediriger vers la page de succès après un délai
                setTimeout(() => {
                    this.redirectToSuccess(formData);
                }, 2000);
            });
        });
    }
    
    validateForm() {
        let isValid = true;
        
        // Validation des champs obligatoires
        const requiredFields = ['customerName', 'customerEmail', 'customerPhone'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                this.markFieldError(fieldId, 'Ce champ est obligatoire.');
                isValid = false;
            } else {
                this.clearFieldError(fieldId);
            }
        });
        
        // Validation de l'email
        const emailField = document.getElementById('customerEmail');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                this.markFieldError('customerEmail', 'Adresse email invalide.');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    validateFormData(formData) {
        return formData.customerName && formData.customerEmail && formData.customerPhone;
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Récupérer la méthode de paiement sélectionnée
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'wave';
        data.paymentMethod = paymentMethod;
        
        // Ajouter des métadonnées
        data.orderId = this.generateOrderId();
        data.timestamp = new Date().toISOString();
        data.bookTitle = 'Réveille Ton Potentiel';
        data.bookPrice = '9900';
        data.currency = 'XOF';
        
        return data;
    }
    
    async processPayment(formData) {
        // Simulation de traitement de paiement
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Paiement traité:', formData);
                resolve(true);
            }, 1500);
        });
    }
    
    redirectToSuccess(formData) {
        // Sauvegarder les données dans localStorage
        localStorage.setItem('lastOrder', JSON.stringify(formData));
        
        // Sauvegarder dans l'historique des commandes
        this.saveOrderToHistory(formData);
        
        // Rediriger vers la page de succès avec les paramètres
        const params = new URLSearchParams({
            order: formData.orderId,
            name: encodeURIComponent(formData.customerName),
            email: formData.customerEmail,
            method: formData.paymentMethod,
            amount: formData.bookPrice
        });
        
        window.location.href = `payment-success.html?${params.toString()}`;
    }
    
    generateOrderId() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `CMD-${timestamp}${random}`;
    }
    
    saveOrderToHistory(formData) {
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        
        const order = {
            ...formData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString()
        };
        
        orderHistory.push(order);
        
        // Garder seulement les 50 dernières commandes
        if (orderHistory.length > 50) {
            localStorage.setItem('orderHistory', JSON.stringify(orderHistory.slice(-50)));
        } else {
            localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        }
    }
    
    markFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`);
        
        if (field) {
            field.classList.add('is-invalid');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('d-none');
        }
    }
    
    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`);
        
        if (field) {
            field.classList.remove('is-invalid');
        }
        
        if (errorElement) {
            errorElement.classList.add('d-none');
        }
    }
    
    showError(message) {
        // Créer ou utiliser une alerte existante
        let errorAlert = document.getElementById('paymentError');
        
        if (!errorAlert) {
            errorAlert = document.createElement('div');
            errorAlert.id = 'paymentError';
            errorAlert.className = 'alert alert-danger alert-dismissible fade show mt-3';
            
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'btn-close';
            closeBtn.setAttribute('data-bs-dismiss', 'alert');
            
            errorAlert.appendChild(closeBtn);
            this.form.parentNode.insertBefore(errorAlert, this.form.nextSibling);
        }
        
        const alertContent = document.createElement('div');
        alertContent.className = 'd-flex align-items-center';
        alertContent.innerHTML = `
            <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
            <div>
                <h5 class="mb-1">Erreur de paiement</h5>
                <p class="mb-0">${message}</p>
            </div>
        `;
        
        errorAlert.innerHTML = '';
        errorAlert.appendChild(closeBtn);
        errorAlert.appendChild(alertContent);
        errorAlert.classList.remove('d-none');
        
        // Auto-dismiss après 5 secondes
        setTimeout(() => {
            if (errorAlert.parentNode) {
                errorAlert.classList.remove('show');
                setTimeout(() => errorAlert.remove(), 150);
            }
        }, 5000);
    }
}

// Initialiser le système
document.addEventListener('DOMContentLoaded', () => {
    window.paymentSystem = new PaymentRedirect();
});