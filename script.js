// Portfolio Website JavaScript
// All interactive features and animations

(function() {
    'use strict';

    // ============================================
    // Dark Mode Toggle
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.classList.toggle('dark', currentTheme === 'dark');
    
    themeToggle.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        const theme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });
    
    // Close mobile menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // ============================================
    // Smooth Scrolling for Navigation Links
    // ============================================
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Active Section Highlighting in Navigation
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    function updateActiveSection() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection(); // Initial call

    // ============================================
    // Navbar Background on Scroll
    // ============================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate project cards
                if (entry.target.classList.contains('project-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    
    // Observe section titles
    document.querySelectorAll('.section-title').forEach(title => {
        observer.observe(title);
    });
    
    // Skill items stay visible
    
    // Observe project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });

    // ============================================
    // Contact Form Validation and Submission
    // ============================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    
    // Initialize EmailJS
    (function() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("8kvAxvGaf2gHLA1xR");
            console.log('EmailJS initialized successfully');
        } else {
            console.error('EmailJS not loaded - check if script is included in HTML');
        }
    })();
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    function validateField(field, value) {
        const errorSpan = field.parentElement.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';
        
        // Remove previous error styling
        field.classList.remove('border-red-500');
        errorSpan.classList.add('hidden');
        
        // Validate based on field type
        if (field.hasAttribute('required') && !value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (field.tagName === 'TEXTAREA' && value.trim().length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }
        
        if (!isValid) {
            field.classList.add('border-red-500');
            errorSpan.textContent = errorMessage;
            errorSpan.classList.remove('hidden');
        }
        
        return isValid;
    }
    
    // Real-time validation
    const formFields = contactForm.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field, field.value);
        });
        
        field.addEventListener('input', () => {
            if (field.classList.contains('border-red-500')) {
                validateField(field, field.value);
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Hide previous messages
        formSuccess.classList.add('hidden');
        formError.classList.add('hidden');
        
        // Validate all fields
        let isFormValid = true;
        formFields.forEach(field => {
            if (!validateField(field, field.value)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            formError.classList.remove('hidden');
            return;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span>Sending...';
        
        // Send email using EmailJS
        try {
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
                to_email: 'chalaurgeso0@gmail.com'
            };
            
            await emailjs.send('service_wq12q0l', 'template_2s9uc9c', templateParams);
            
            // Success
            formSuccess.classList.remove('hidden');
            contactForm.reset();
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.add('hidden');
            }, 5000);
            
        } catch (error) {
            // Error
            formError.classList.remove('hidden');
            console.error('EmailJS error details:', error);
            console.error('Error status:', error.status);
            console.error('Error text:', error.text);
            
            // Show more specific error message
            const errorText = error.text || 'Unknown error occurred';
            formError.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>Error: ${errorText}. Please try again.`;
        } finally {
            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });

    // ============================================
    // Performance Optimizations
    // ============================================
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });


    // ============================================
    // Keyboard Navigation Accessibility
    // ============================================
    document.addEventListener('keydown', (e) => {
        // Close mobile menu on Escape key
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // ============================================
    // Initialize on DOM Load
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        // Add fade-in animation to elements on load
        const animatedElements = document.querySelectorAll('.fade-in-up');
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Initialize skill progress bars immediately
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.setProperty('--progress-width', `${progress}%`);
            bar.style.width = `${progress}%`;
            const item = bar.closest('.skill-item');
            if (item) {
                item.classList.add('animated');
            }
        });
    });

    // ============================================
    // Console Welcome Message
    // ============================================
    console.log('%c👋 Welcome to my Portfolio!', 'font-size: 20px; font-weight: bold; color: #2563eb;');
    console.log('%cFeel free to explore the code and reach out if you have any questions!', 'font-size: 14px; color: #6b7280;');

})();
