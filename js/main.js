/**
 * Sugar Coated Dreams - Enhanced Interactive Experience
 * Smooth animations, modern interactions, and delightful micro-moments
 */

// ==========================================================================
// Configuration & State
// ==========================================================================
const CONFIG = {
    scrollThreshold: 100,
    animationThreshold: 0.15,
    counterDuration: 2000,
    debounceDelay: 16,
};

const STATE = {
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    isMobileNavOpen: false,
    hasScrolled: false,
};

// ==========================================================================
// Utility Functions
// ==========================================================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Animate number from 0 to target
 */
function animateCounter(element, target, duration = CONFIG.counterDuration) {
    if (STATE.prefersReducedMotion) {
        element.textContent = target;
        return;
    }
    
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ==========================================================================
// Mobile Navigation
// ==========================================================================

function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    function openMenu() {
        STATE.isMobileNavOpen = true;
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('mobile');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        STATE.isMobileNavOpen = false;
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('mobile');
        document.body.style.overflow = '';
    }
    
    function toggleMenu() {
        if (STATE.isMobileNavOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // Toggle button click
    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (STATE.isMobileNavOpen) {
                closeMenu();
            }
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (STATE.isMobileNavOpen && 
            !navToggle.contains(e.target) && 
            !navMenu.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && STATE.isMobileNavOpen) {
            closeMenu();
            navToggle.focus();
        }
    });
    
    // Close on resize if desktop
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 900 && STATE.isMobileNavOpen) {
            closeMenu();
        }
    }, 150));
}

// ==========================================================================
// Scroll Effects
// ==========================================================================

function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.querySelector('.scroll-progress');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section[id]');
    
    function updateScrollEffects() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Navbar state
        if (navbar) {
            if (scrollTop > CONFIG.scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Scroll progress bar
        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }
        
        // Back to top button
        if (backToTop) {
            if (scrollTop > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        // Active nav link
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Use throttle for scroll performance
    window.addEventListener('scroll', throttle(updateScrollEffects, 16), { passive: true });
    
    // Initial call
    updateScrollEffects();
    
    // Back to top click handler
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: STATE.prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }
}

// ==========================================================================
// Smooth Scroll for Anchor Links
// ==========================================================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: STATE.prefersReducedMotion ? 'auto' : 'smooth'
            });
            
            // Update URL without triggering scroll
            history.pushState(null, '', href);
        });
    });
}

// ==========================================================================
// Reveal Animations
// ==========================================================================

function initRevealAnimations() {
    if (STATE.prefersReducedMotion) {
        // Show all elements immediately
        document.querySelectorAll('[data-animate]').forEach(el => {
            el.classList.add('is-visible');
        });
        return;
    }
    
    const observerOptions = {
        threshold: CONFIG.animationThreshold,
        rootMargin: '0px 0px -10% 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-animate]').forEach(el => {
        revealObserver.observe(el);
    });
}

// ==========================================================================
// Counter Animation
// ==========================================================================

function initCounters() {
    const counters = document.querySelectorAll('.counter[data-target]');
    
    if (counters.length === 0) return;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target, 10);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// ==========================================================================
// Contact Form
// ==========================================================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Form validation patterns
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-\+\(\)]{7,}$/
    };
    
    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.required;
        
        // Check required
        if (required && !value) {
            return { valid: false, message: 'This field is required' };
        }
        
        // Check email
        if (type === 'email' && value && !patterns.email.test(value)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }
        
        // Check phone
        if (type === 'tel' && value && !patterns.phone.test(value)) {
            return { valid: false, message: 'Please enter a valid phone number' };
        }
        
        return { valid: true };
    }
    
    function showMessage(message, type) {
        // Remove existing message
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.setAttribute('role', 'alert');
        messageEl.innerHTML = `
            <span>${type === 'success' ? '✓' : '!'}</span>
            <p>${message}</p>
        `;
        
        // Style the message
        Object.assign(messageEl.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderRadius: '12px',
            marginTop: '16px',
            fontWeight: '500',
            animation: 'fadeIn 0.3s ease'
        });
        
        if (type === 'success') {
            Object.assign(messageEl.style, {
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                color: '#059669',
                border: '1px solid rgba(16, 185, 129, 0.2)'
            });
        } else {
            Object.assign(messageEl.style, {
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
                color: '#dc2626',
                border: '1px solid rgba(239, 68, 68, 0.2)'
            });
        }
        
        form.appendChild(messageEl);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateY(-10px)';
            messageEl.style.transition = 'all 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }, 5000);
    }
    
    // Real-time validation on blur
    form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', () => {
            const result = validateField(field);
            if (!result.valid) {
                field.style.borderColor = '#ef4444';
            } else {
                field.style.borderColor = '';
            }
        });
        
        field.addEventListener('focus', () => {
            field.style.borderColor = '';
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        const formData = {};
        
        form.querySelectorAll('input, textarea, select').forEach(field => {
            const result = validateField(field);
            if (!result.valid) {
                isValid = false;
                field.style.borderColor = '#ef4444';
            } else {
                formData[field.name] = field.value.trim();
            }
        });
        
        if (!isValid) {
            showMessage('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showMessage(
                "Thank you for reaching out! I'll get back to you within 24 hours to discuss your sweet celebration.",
                'success'
            );
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ==========================================================================
// Interactive Hover Effects
// ==========================================================================

function initHoverEffects() {
    // Skip hover effects on touch devices
    if (STATE.isTouchDevice) return;
    
    // Subtle card hover effects
    const cards = document.querySelectorAll('.portfolio-item, .service-card, .testimonial-card, .meta-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1), box-shadow 0.3s ease';
        });
    });
    
    // Button magnetic effect (subtle)
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// ==========================================================================
// Viewport Height Fix for Mobile
// ==========================================================================

function initViewportFix() {
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    
    window.addEventListener('resize', debounce(setVH, 100));
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
    });
}

// ==========================================================================
// Parallax Effect (Desktop Only)
// ==========================================================================

function initParallax() {
    if (STATE.prefersReducedMotion || STATE.isTouchDevice) return;
    
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.chef-profile-photo');
    
    if (!hero || !heroImage) return;
    
    let ticking = false;
    
    function updateParallax() {
        ticking = false;
        
        const rect = hero.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        
        const scrolled = window.pageYOffset;
        const offset = Math.max(Math.min(scrolled * -0.08, 30), -30);
        
        heroImage.style.transform = `translateY(${offset}px)`;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateParallax);
        }
    }, { passive: true });
}

// ==========================================================================
// Keyboard Navigation Enhancement
// ==========================================================================

function initKeyboardNavigation() {
    // Add focus-visible class for keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// ==========================================================================
// Preload Critical Assets
// ==========================================================================

function preloadAssets() {
    // Preload the profile image
    const profileImg = document.querySelector('.chef-profile-photo');
    if (profileImg && profileImg.complete) {
        profileImg.classList.add('loaded');
    } else if (profileImg) {
        profileImg.addEventListener('load', () => {
            profileImg.classList.add('loaded');
        });
    }
}

// ==========================================================================
// Initialize Everything
// ==========================================================================

function init() {
    // Core functionality
    initMobileNavigation();
    initScrollEffects();
    initSmoothScroll();
    initRevealAnimations();
    initCounters();
    initContactForm();
    initViewportFix();
    initKeyboardNavigation();
    preloadAssets();
    
    // Desktop-only features
    if (!STATE.isTouchDevice) {
        initHoverEffects();
        initParallax();
    }
    
    // Log initialization
    console.log(
        '%c🧁 Sugar Coated Dreams %c Loaded Successfully',
        'background: linear-gradient(135deg, #c45e3e, #d4a853); color: white; padding: 8px 12px; border-radius: 4px 0 0 4px; font-weight: bold;',
        'background: #2d1f17; color: #fdf8f3; padding: 8px 12px; border-radius: 0 4px 4px 0;'
    );
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle reduced motion preference changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    STATE.prefersReducedMotion = e.matches;
});
