// assets/js/confirmation.js
// Gestion de la page de confirmation de commande

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== INITIALISATION ==========
    initConfirmationPage();
    
    // ========== FONCTIONS PRINCIPALES ==========
    
    function initConfirmationPage() {
        // Récupérer les données de commande
        const orderData = getOrderData();
        
        // Afficher les informations de commande
        displayOrderInfo(orderData);
        
        // Initialiser le compte à rebours
        initCountdown();
        
        // Initialiser les liens de paiement
        initPaymentLinks();
        
        // Initialiser le suivi WhatsApp
        initWhatsAppTracking();
        
        // Sauvegarder l'événement de conversion
        trackConversion(orderData);
    }
    
    function getOrderData() {
        // Récupérer depuis localStorage
        const savedOrder = localStorage.getItem('currentOrder');
        
        if (savedOrder) {
            return JSON.parse(savedOrder);
        }
        
        // Données par défaut
        return {
            method: 'wave',
            amount: 9900,
            currency: 'XOF',
            date: new Date().toISOString(),
            status: 'pending'
        };
    }
    
    function displayOrderInfo(orderData) {
        // Mettre à jour le compte à rebours avec la méthode de paiement
        const methodElement = document.getElementById('paymentMethod');
        if (methodElement) {
            const methodName = orderData.method === 'wave' ? 'Wave' : 'Orange Money';
            methodElement.textContent = methodName;
        }
        
        // Mettre à jour le montant
        const amountElement = document.getElementById('orderAmount');
        if (amountElement) {
            amountElement.textContent = `${orderData.amount.toLocaleString()} XOF`;
        }
        
        // Mettre à jour la date
        const dateElement = document.getElementById('orderDate');
        if (dateElement) {
            const date = new Date(orderData.date);
            dateElement.textContent = date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        // Surligner la méthode de paiement sélectionnée
        highlightSelectedPayment(orderData.method);
    }
    
    function highlightSelectedPayment(method) {
        const waveCard = document.querySelector('.payment-link-card:nth-child(1)');
        const orangeCard = document.querySelector('.payment-link-card:nth-child(2)');
        
        if (method === 'wave' && waveCard) {
            waveCard.style.borderColor = '#1e90ff';
            waveCard.style.boxShadow = '0 0 20px rgba(30, 144, 255, 0.3)';
        } else if (method === 'orange' && orangeCard) {
            orangeCard.style.borderColor = '#ff6600';
            orangeCard.style.boxShadow = '0 0 20px rgba(255, 102, 0, 0.3)';
        }
    }
    
    function initCountdown() {
        let timeLeft = 30 * 60; // 30 minutes en secondes
        const countdownElement = document.getElementById('countdownTimer');
        
        if (!countdownElement) return;
        
        function updateTimer() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            countdownElement.innerHTML = `
                <span class="minutes">${minutes.toString().padStart(2, '0')}</span>:
                <span class="seconds">${seconds.toString().padStart(2, '0')}</span>
            `;
            
            // Ajouter une classe d'avertissement quand il reste moins de 5 minutes
            if (timeLeft <= 5 * 60) {
                countdownElement.classList.add('text-danger');
                countdownElement.style.animation = 'pulse 1s infinite';
            }
            
            if (timeLeft > 0) {
                timeLeft--;
                setTimeout(updateTimer, 1000);
            } else {
                // Temps écoulé
                countdownElement.innerHTML = '<span class="text-danger">TEMPS ÉCOULÉ</span>';
                showTimeUpNotification();
            }
        }
        
        updateTimer();
    }
    
    function showTimeUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'alert alert-warning alert-dismissible fade show mt-3';
        notification.innerHTML = `
            <i class="fas fa-clock me-2"></i>
            Le temps pour finaliser votre commande est écoulé. Veuillez recommencer.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.prepend(notification);
        }
        
        // Rediriger après 10 secondes
        setTimeout(() => {
            window.location.href = 'index.html#acheter-maintenant';
        }, 10000);
    }
    
    function initPaymentLinks() {
        // Ajouter des événements aux liens de paiement
        document.querySelectorAll('.payment-link-card a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const method = this.href.includes('wave') ? 'wave' : 'orange';
                const url = this.href;
                
                // Enregistrer le clic
                trackPaymentClick(method);
                
                // Ouvrir dans un nouvel onglet
                window.open(url, '_blank');
                
                // Afficher une notification
                showClickNotification(method);
            });
        });
    }
    
    function trackPaymentClick(method) {
        const analyticsData = {
            event: 'payment_link_clicked_confirmation',
            method: method,
            timestamp: new Date().toISOString(),
            page: 'confirmation'
        };
        
        // Sauvegarder localement
        saveAnalyticsEvent(analyticsData);
        
        // Envoyer à Google Analytics (si configuré)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'payment_click', {
                'event_category': 'engagement',
                'event_label': method,
                'value': 1
            });
        }
    }
    
    function showClickNotification(method) {
        const methodName = method === 'wave' ? 'Wave' : 'Orange Money';
        const notification = document.createElement('div');
        notification.className = 'payment-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-external-link-alt me-2"></i>
                Redirection vers ${methodName}...
            </div>
        `;
        
        // Style de la notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: method === 'wave' ? '#1e90ff' : '#ff6600',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '10px',
            zIndex: '9999',
            animation: 'slideIn 0.3s ease',
            fontWeight: '600',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            maxWidth: '300px'
        });
        
        document.body.appendChild(notification);
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    function initWhatsAppTracking() {
        const whatsappLinks = document.querySelectorAll('a[href*="whatsapp"]');
        
        whatsappLinks.forEach(link => {
            link.addEventListener('click', function() {
                const orderData = getOrderData();
                
                // Enregistrer le clic WhatsApp
                trackWhatsAppClick(orderData.method);
                
                // Ajouter des informations à la conversation
                const defaultText = 'Bonjour ! Je viens de commander le livre "Réveille Ton Potentiel"';
                const currentText = decodeURIComponent(this.href.split('text=')[1] || defaultText);
                const enhancedText = `${currentText}. Méthode de paiement : ${orderData.method === 'wave' ? 'Wave' : 'Orange Money'}`;
                
                this.href = `https://wa.me/221781234567?text=${encodeURIComponent(enhancedText)}`;
            });
        });
    }
    
    function trackWhatsAppClick(method) {
        const analyticsData = {
            event: 'whatsapp_contact_confirmation',
            method: method,
            timestamp: new Date().toISOString()
        };
        
        saveAnalyticsEvent(analyticsData);
    }
    
    function trackConversion(orderData) {
        // Enregistrer la conversion
        const conversionData = {
            event: 'order_confirmation_viewed',
            order_id: Date.now(),
            method: orderData.method,
            amount: orderData.amount,
            currency: orderData.currency,
            timestamp: new Date().toISOString()
        };
        
        saveAnalyticsEvent(conversionData);
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                'transaction_id': conversionData.order_id.toString(),
                'value': orderData.amount / 1000, // Convertir pour GA
                'currency': orderData.currency,
                'items': [{
                    'item_id': 'livre_reveille_ton_potentiel',
                    'item_name': 'Réveille Ton Potentiel',
                    'price': orderData.amount,
                    'quantity': 1
                }]
            });
        }
        
        // Facebook Pixel (si configuré)
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
                value: orderData.amount,
                currency: orderData.currency
            });
        }
    }
    
    function saveAnalyticsEvent(eventData) {
        // Sauvegarder localement
        const analyticsLog = JSON.parse(localStorage.getItem('confirmationAnalytics') || '[]');
        analyticsLog.push(eventData);
        localStorage.setItem('confirmationAnalytics', JSON.stringify(analyticsLog));
        
        console.log('[Confirmation Analytics]', eventData);
    }
    
    // ========== FONCTIONS UTILITAIRES ==========
    
    // Bouton de téléchargement de reçu
    function setupReceiptDownload() {
        const downloadBtn = document.getElementById('downloadReceipt');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                generateReceiptPDF();
            });
        }
    }
    
    function generateReceiptPDF() {
        const orderData = getOrderData();
        const receiptContent = `
            FACTURE
            ======================
            RéveilIntérieur
            Dakar, Sénégal
            contact@reveilinterieur.sn
            
            ======================
            N° Commande: ${Date.now()}
            Date: ${new Date().toLocaleDateString('fr-FR')}
            
            ======================
            PRODUIT
            Réveille Ton Potentiel
            Quantité: 1
            Prix unitaire: 9,900 XOF
            Total: 9,900 XOF
            
            ======================
            MÉTHODE DE PAIEMENT
            ${orderData.method === 'wave' ? 'Wave' : 'Orange Money'}
            
            ======================
            MERCI POUR VOTRE ACHAT !
            Pour toute question: +221 78 123 45 67
        `;
        
        // Créer un fichier texte téléchargeable
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-reveille-ton-potentiel-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Track le téléchargement
        saveAnalyticsEvent({
            event: 'receipt_downloaded',
            timestamp: new Date().toISOString()
        });
    }
    
    // Notification de rappel
    function setupReminderNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            // Programmer une notification pour dans 1 heure
            setTimeout(() => {
                new Notification('Réveille Ton Potentiel', {
                    body: 'N\'oubliez pas de finaliser votre commande !',
                    icon: '/assets/images/favicon.ico'
                });
            }, 3600000); // 1 heure
        }
    }
    
    // Demander la permission pour les notifications
    if ('Notification' in window && Notification.permission === 'default') {
        setTimeout(() => {
            Notification.requestPermission();
        }, 5000);
    }
    
    // Initialiser les fonctions supplémentaires
    setupReceiptDownload();
    setupReminderNotification();
    
    // Ajouter les styles d'animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .payment-link-card {
            transition: all 0.3s ease;
        }
        
        .payment-link-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }
        
        #countdownTimer {
            font-family: monospace;
            font-size: 1.5rem;
            font-weight: 700;
        }
        
        #countdownTimer.text-danger {
            animation: pulse 1s infinite;
        }
        
        .confirmation-step {
            animation: fadeInUp 0.6s ease-out;
            animation-fill-mode: both;
        }
        
        .confirmation-step:nth-child(1) { animation-delay: 0.1s; }
        .confirmation-step:nth-child(2) { animation-delay: 0.3s; }
        .confirmation-step:nth-child(3) { animation-delay: 0.5s; }
        .confirmation-step:nth-child(4) { animation-delay: 0.7s; }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // ========== REDIRECTION AUTOMATIQUE ==========
    
    // Rediriger vers l'accueil après 30 minutes d'inactivité
    let inactivityTimer;
    
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            window.location.href = 'index.html';
        }, 30 * 60 * 1000); // 30 minutes
    }
    
    // Réinitialiser le timer sur les interactions utilisateur
    ['click', 'mousemove', 'keypress', 'scroll'].forEach(event => {
        document.addEventListener(event, resetInactivityTimer);
    });
    
    // Démarrer le timer
    resetInactivityTimer();
    
    // ========== IMPRESSION ==========
    
    // Bouton d'impression
    const printBtn = document.createElement('button');
    printBtn.className = 'btn btn-outline-light position-fixed';
    printBtn.style.cssText = `
        bottom: 20px;
        left: 20px;
        z-index: 1000;
    `;
    printBtn.innerHTML = '<i class="fas fa-print me-2"></i> Imprimer';
    printBtn.addEventListener('click', () => window.print());
    document.body.appendChild(printBtn);
    
    // Styles d'impression
    const printStyle = document.createElement('style');
    printStyle.media = 'print';
    printStyle.textContent = `
        .whatsapp-float, 
        .back-to-top,
        .payment-notification,
        button.btn {
            display: none !important;
        }
        
        body {
            color: #000 !important;
            background: #fff !important;
        }
        
        .confirmation-step {
            border: 1px solid #000 !important;
            break-inside: avoid;
        }
    `;
    document.head.appendChild(printStyle);
});