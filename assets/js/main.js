// assets/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== NAVIGATION SCROLL EFFECT ==========
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // ========== PAYMENT METHOD SELECTION ==========
    function selectPayment(method) {
        // Reset all payment cards
        document.querySelectorAll('.payment-option-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Hide all payment details
        document.querySelectorAll('.payment-details').forEach(details => {
            details.style.display = 'none';
        });
        
        // Uncheck all radio buttons
        document.querySelectorAll('input[name="payment"]').forEach(radio => {
            radio.checked = false;
        });
        
        // Activate selected method
        const card = method === 'wave' 
            ? document.querySelector('.payment-option-card:nth-child(1)')
            : document.querySelector('.payment-option-card:nth-child(2)');
        
        if (card) {
            card.classList.add('active');
            
            // Show corresponding details
            const detailsId = method === 'wave' ? 'waveDetails' : 'orangeDetails';
            const detailsElement = document.getElementById(detailsId);
            if (detailsElement) {
                detailsElement.style.display = 'block';
            }
            
            // Check corresponding radio
            const radio = card.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
            
            // Save preference
            localStorage.setItem('preferredPayment', method);
            
            // Animate selection
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'pulse 0.5s ease';
            }, 10);
        }
    }
    
    // Initialize payment selection
    const savedPayment = localStorage.getItem('preferredPayment') || 'wave';
    selectPayment(savedPayment);
    
    // Add click handlers to payment cards
    document.querySelectorAll('.payment-option-card').forEach((card, index) => {
        card.addEventListener('click', function() {
            const method = index === 0 ? 'wave' : 'orange';
            selectPayment(method);
        });
    });
    
    // ========== SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });
    
    // ========== FORM VALIDATION ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = this.querySelectorAll('input[required], select[required], textarea[required]');
            
            // Reset previous errors
            inputs.forEach(input => {
                input.classList.remove('is-invalid');
                const errorElement = input.nextElementSibling;
                if (errorElement && errorElement.classList.contains('invalid-feedback')) {
                    errorElement.remove();
                }
            });
            
            // Validate each input
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                    
                    // Add error message
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = 'Ce champ est obligatoire';
                    input.parentNode.appendChild(errorDiv);
                }
                
                // Email validation
                if (input.type === 'email' && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        input.classList.add('is-invalid');
                        
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'invalid-feedback';
                        errorDiv.textContent = 'Veuillez entrer un email valide';
                        input.parentNode.appendChild(errorDiv);
                    }
                }
            });
            
            if (isValid) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Envoi en cours...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Success message
                    const successAlert = document.createElement('div');
                    successAlert.className = 'alert alert-success alert-dismissible fade show mt-3';
                    successAlert.innerHTML = `
                        <i class="fas fa-check-circle me-2"></i>
                        Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
                    `;
                    
                    this.prepend(successAlert);
                    
                    // Reset form
                    this.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Auto-hide success message after 5 seconds
                    setTimeout(() => {
                        if (successAlert.parentNode) {
                            successAlert.classList.remove('show');
                            setTimeout(() => successAlert.remove(), 150);
                        }
                    }, 5000);
                    
                    // Scroll to top of form
                    this.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                }, 1500);
            }
        });
    }
    
    // ========== BOOK HOVER EFFECT ==========
    const bookCover = document.querySelector('.real-book-cover');
    if (bookCover) {
        bookCover.addEventListener('mouseenter', function() {
            this.style.transform = 'perspective(1000px) rotateY(0deg) scale(1.05)';
        });
        
        bookCover.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(-15deg) scale(1)';
        });
    }
    
    // ========== COUNTDOWN TIMER ==========
    function updateCountdown() {
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            
            const diff = endOfDay - now;
            
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // ========== ANIMATE ELEMENTS ON SCROLL ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Animate stats counters
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.benefit-item, .testimonial-quote, .stat-number').forEach(el => {
        observer.observe(el);
    });
    
    // Counter animation function
    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/,/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
    
    // ========== WHATSAPP FLOAT BUTTON ==========
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                whatsappFloat.style.transform = 'translateY(100px)';
                whatsappFloat.style.opacity = '0';
            } else {
                // Scrolling up
                whatsappFloat.style.transform = 'translateY(0)';
                whatsappFloat.style.opacity = '1';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // ========== PAYMENT LINK TRACKING ==========
    document.querySelectorAll('a[href*="wave"], a[href*="orange"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const method = this.href.includes('wave') ? 'Wave' : 'Orange Money';
            const timestamp = new Date().toISOString();
            
            // Track the click (could be sent to analytics)
            console.log(`${method} payment link clicked at ${timestamp}`);
            
            // Open in new tab
            e.preventDefault();
            window.open(this.href, '_blank');
            
            // Show notification
            showNotification(`Redirection vers ${method}...`);
        });
    });
    
    // Notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'payment-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-external-link-alt me-2"></i>
                ${message}
            </div>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'var(--accent)',
            color: '#121212',
            padding: '15px 20px',
            borderRadius: '10px',
            zIndex: '9999',
            animation: 'slideIn 0.3s ease',
            fontWeight: '600',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            maxWidth: '300px'
        });
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Add notification styles
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
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .animated {
            animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .is-invalid {
            border-color: #dc3545 !important;
        }
        
        .invalid-feedback {
            display: block;
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
    `;
    document.head.appendChild(style);
    
    // ========== BACK TO TOP BUTTON ==========
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.className = 'back-to-top';
    Object.assign(backToTop.style, {
        position: 'fixed',
        bottom: '100px',
        right: '30px',
        width: '50px',
        height: '50px',
        background: 'var(--accent)',
        color: '#121212',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'none',
        zIndex: '999',
        fontSize: '1.2rem',
        transition: 'all 0.3s ease',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
    });
    
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'flex';
            backToTop.style.alignItems = 'center';
            backToTop.style.justifyContent = 'center';
        } else {
            backToTop.style.display = 'none';
        }
    });
    
    backToTop.addEventListener('mouseenter', () => {
        backToTop.style.transform = 'scale(1.1)';
        backToTop.style.boxShadow = '0 10px 20px rgba(0,0,0,0.4)';
    });
    
    backToTop.addEventListener('mouseleave', () => {
        backToTop.style.transform = 'scale(1)';
        backToTop.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    });
    
    // ========== INITIALIZE TOOLTIPS ==========
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});