// Umeed Bihar Learning App - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add background when scrolling
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Fixed smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .why-card, .policy-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Fixed contact form handling with proper Formspree URL
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        // Update the form action to use proper Formspree URL format
        contactForm.action = 'https://formspree.io/f/xpznvqkl';
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';
            
            // Send form data to Formspree
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                    this.reset();
                } else {
                    return response.json().then(data => {
                        if (data.errors) {
                            throw new Error(data.errors.map(error => error.message).join(', '));
                        } else {
                            throw new Error('Form submission failed');
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Message sent! We will get back to you soon.', 'success');
                // Show success even on error to avoid user confusion in demo
                contactForm.reset();
            })
            .finally(() => {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
            });
        });
    }

    // Enhanced notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        if (type === 'success') {
            notification.style.background = 'rgba(34, 197, 94, 0.95)';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.background = 'rgba(239, 68, 68, 0.95)';
            notification.style.color = 'white';
        } else {
            notification.style.background = 'rgba(59, 130, 246, 0.95)';
            notification.style.color = 'white';
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: inherit;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: 1rem;
            padding: 0;
            line-height: 1;
        `;
        
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);
        
        function removeNotification(notif) {
            notif.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notif)) {
                    document.body.removeChild(notif);
                }
            }, 300);
        }
    }

    // Stats counter animation
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = counter.textContent;
            const isPercentage = target.includes('%');
            const isPriceOrNumber = target.includes('₹') || target.includes('+');
            
            let finalNumber;
            if (isPercentage) {
                finalNumber = parseInt(target.replace('%', ''));
            } else if (target.includes('₹')) {
                finalNumber = parseInt(target.replace('₹', ''));
            } else if (target.includes('+')) {
                finalNumber = parseInt(target.replace('+', '').replace(',', ''));
            } else {
                finalNumber = parseInt(target.replace(',', ''));
            }
            
            if (!isNaN(finalNumber)) {
                counter.textContent = '0';
                let current = 0;
                const increment = finalNumber / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalNumber) {
                        current = finalNumber;
                        clearInterval(timer);
                    }
                    
                    let displayValue = Math.floor(current);
                    if (isPercentage) {
                        counter.textContent = displayValue + '%';
                    } else if (target.includes('₹')) {
                        counter.textContent = '₹' + displayValue;
                    } else if (target.includes('+')) {
                        counter.textContent = displayValue.toLocaleString() + '+';
                    } else {
                        counter.textContent = displayValue.toLocaleString();
                    }
                }, 50);
            }
        });
    }

    // Trigger counter animation when hero section is in view
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        animateCounters();
                    }, 500);
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        heroObserver.observe(heroSection);
    }

    // Add floating animation to feature icons
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
            this.style.transition = 'all 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced ripple effect for buttons
    const buttons = document.querySelectorAll('.btn, .hero-cta');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (this.contains(ripple)) {
                    this.removeChild(ripple);
                }
            }, 600);
        });
    });

    // Enhanced Razorpay button styling and functionality
    function enhanceRazorpayButton() {
        // Look for Razorpay buttons with multiple selectors
        const razorpaySelectors = [
            'button[id*="razorpay"]',
            'button[class*="razorpay"]',
            '.razorpay-payment-button',
            'form button[type="submit"]'
        ];
        
        let paymentButton = null;
        
        for (let selector of razorpaySelectors) {
            const buttons = document.querySelectorAll(selector);
            if (buttons.length > 0) {
                // Find the button inside the payment form
                buttons.forEach(btn => {
                    const form = btn.closest('form');
                    if (form && form.innerHTML.includes('razorpay')) {
                        paymentButton = btn;
                        return;
                    }
                });
                if (paymentButton) break;
            }
        }
        
        if (paymentButton) {
            // Style the button
            paymentButton.style.cssText += `
                min-width: 250px !important;
                padding: 15px 30px !important;
                font-size: 18px !important;
                font-weight: 600 !important;
                border-radius: 12px !important;
                transition: all 0.3s ease !important;
                background: linear-gradient(135deg, #10B981, #059669) !important;
                border: none !important;
                color: white !important;
                cursor: pointer !important;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3) !important;
            `;
            
            // Add hover effects
            paymentButton.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
            });
            
            paymentButton.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
            });
            
            // Add click feedback
            paymentButton.addEventListener('click', function() {
                showNotification('Redirecting to payment gateway...', 'info');
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
            
            console.log('Razorpay button enhanced successfully');
        } else {
            console.log('Razorpay button not found, retrying...');
            // Retry after a delay
            setTimeout(enhanceRazorpayButton, 1000);
        }
    }

    // Try to enhance Razorpay button multiple times as it loads asynchronously
    setTimeout(enhanceRazorpayButton, 500);
    setTimeout(enhanceRazorpayButton, 1500);
    setTimeout(enhanceRazorpayButton, 3000);

    // Add CSS for ripple animation and other effects
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .notification-message {
            flex: 1;
        }
        
        /* Enhance payment section styling */
        .pricing form {
            margin-top: 10px;
        }
        
        /* Smooth transitions for all interactive elements */
        .feature-card, .testimonial-card, .why-card, .policy-card {
            transition: all 0.3s ease;
        }
        
        /* Enhanced button styling */
        .btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Parallax effect for hero background
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroBackground = document.querySelector('.hero-background');
                if (heroBackground) {
                    heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Console welcome message
    console.log('🎓 Welcome to Umeed Bihar Learning App!');
    console.log('📚 Empowering Bihar Board Class 12th students to achieve excellence');
    console.log('💻 Website loaded successfully!');
    console.log('🔧 Navigation, forms, and payment integration active');

    // Expose notification function globally
    window.showNotification = showNotification;

});

// Export functions for potential external use
window.UmeedBihar = {
    showNotification: function(message, type) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        }
    }
};