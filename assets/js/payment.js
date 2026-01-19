// assets/js/payment.js
// Intégration avec PayDunya ou autre service de paiement
class PaymentIntegration {
    constructor() {
        this.paymentMethods = {
            'orange': this.processOrangeMoney,
            'wave': this.processWave,
            'card': this.processCard
        };
    }
    
    async processPayment(method, data) {
        // Cette fonction simule l'appel à l'API de paiement
        console.log(`Processing ${method} payment for ${data.amount} XOF`);
        
        // En production, vous utiliseriez l'API réelle
        // Exemple avec PayDunya:
        // const response = await fetch('https://app.paydunya.com/api/v1/checkout-invoice/create', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'PAYDUNYA-MASTER-KEY': 'votre_master_key',
        //         'PAYDUNYA-PRIVATE-KEY': 'votre_private_key',
        //         'PAYDUNYA-TOKEN': 'votre_token'
        //     },
        //     body: JSON.stringify({
        //         invoice: {
        //             items: [{
        //                 name: "Réveille Ton Potentiel",
        //                 quantity: 1,
        //                 unit_price: "9900",
        //                 total_price: "9900",
        //                 description: "Livre de développement personnel"
        //             }],
        //             total_amount: "9900",
        //             description: "Achat du livre Réveille Ton Potentiel"
        //         },
        //         store: {
        //             name: "RéveilIntérieur",
        //             tagline: "Transformez votre vie",
        //             postal_address: "Dakar, Sénégal",
        //             phone: "+221781234567",
        //             website_url: "https://reveilinterieur.sn",
        //             logo_url: "https://reveilinterieur.sn/logo.png"
        //         },
        //         actions: {
        //             cancel_url: "https://reveilinterieur.sn/cancel",
        //             callback_url: "https://reveilinterieur.sn/callback",
        //             return_url: "https://reveilinterieur.sn/success"
        //         },
        //         custom_data: {
        //             customer_name: data.name,
        //             customer_email: data.email,
        //             customer_phone: data.phone
        //         }
        //     })
        // });
        
        // Pour l'exemple, on simule un succès
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: 'TX' + Date.now(),
                    paymentUrl: 'https://paydunya.com/checkout/simulated-payment'
                });
            }, 1500);
        });
    }
    
    processOrangeMoney(data) {
        // Logique spécifique à Orange Money
        return this.processPayment('orange', data);
    }
    
    processWave(data) {
        // Logique spécifique à Wave
        return this.processPayment('wave', data);
    }
    
    processCard(data) {
        // Logique spécifique aux cartes bancaires
        return this.processPayment('card', data);
    }
    
    async initPayment() {
        const form = document.getElementById('paymentForm');
        if (!form) return;
        
        const paymentIntegration = new PaymentIntegration();
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                amount: 9900,
                method: document.querySelector('input[name="paymentMethod"]:checked').value
            };
            
            try {
                const result = await paymentIntegration.processPayment(data.method, data);
                
                if (result.success) {
                    // Redirection vers la page de paiement
                    window.location.href = result.paymentUrl;
                }
            } catch (error) {
                console.error('Payment error:', error);
                alert('Une erreur est survenue lors du traitement du paiement.');
            }
        });
    }
}

// Initialiser le système de paiement
document.addEventListener('DOMContentLoaded', () => {
    const paymentSystem = new PaymentIntegration();
    paymentSystem.initPayment();
});