// Enhanced Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        // Toggle mobile menu with improved UX
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const isOpen = navMenu.classList.contains('mobile');

            if (isOpen) {
                // Close menu
                navMenu.classList.remove('mobile');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                // Open menu
                navMenu.classList.add('mobile');
                navToggle.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scroll
            }

            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('mobile');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';

                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('mobile')) {
                navMenu.classList.remove('mobile');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';

                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
});

// Modern navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
        navbar.style.backdropFilter = 'blur(14px) saturate(160%)';
        navbar.style.background = 'rgba(255, 255, 255, 0.92)';
        navbar.style.boxShadow = '0 16px 38px rgba(26, 41, 64, 0.12)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.backdropFilter = 'blur(14px) saturate(160%)';
        navbar.style.background = 'rgba(255, 255, 255, 0.82)';
        navbar.style.boxShadow = '0 12px 28px rgba(26, 41, 64, 0.08)';
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.chef-image-placeholder');

    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * -0.2}px)`;
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href*=${sectionId}]`).classList.add('active');
        } else {
            document.querySelector(`.nav-link[href*=${sectionId}]`).classList.remove('active');
        }
    });
});

// Intersection Observer for modern animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered animation delay
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 150);
        }
    });
}, observerOptions);

// Observe sections for animation with modern effects
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px) scale(0.95)';
    section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(section);
});

// Gentle card hover effects
document.querySelectorAll('.portfolio-item, .service-card, .testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
        this.style.boxShadow = '0 16px 32px rgba(44, 24, 16, 0.08)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '';
    });
});

// Subtle button hover effect
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-1px)';
    });

    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Basic form validation
    if (!formObject.name || !formObject.email || !formObject.service || !formObject.message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObject.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Simulate form submission (replace with actual submission logic)
    showFormMessage('Thank you for your message! I\'ll get back to you within 24 hours.', 'success');

    // Reset form
    this.reset();
});

// Form message display
function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Style the message
    messageDiv.style.cssText = `
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        font-weight: 500;
        text-align: center;
    `;

    if (type === 'success') {
        messageDiv.style.cssText += `
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        `;
    } else {
        messageDiv.style.cssText += `
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        `;
    }

    // Insert message after form
    const form = document.getElementById('contactForm');
    form.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Image lazy loading placeholder enhancement
document.querySelectorAll('.dish-image-placeholder, .gallery-image-placeholder, .chef-image-placeholder, .kitchen-image-placeholder, .author-avatar-placeholder').forEach(placeholder => {
    placeholder.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });

    placeholder.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Subtle gallery hover effects
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
    });

    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Gentle service card animations
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.service-icon');
        icon.style.transform = 'scale(1.05)';
        icon.style.transition = 'transform 0.3s ease';
    });

    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.service-icon');
        icon.style.transform = 'scale(1)';
    });
});

// Gentle portfolio hover effects
document.querySelectorAll('.portfolio-item').forEach(item => {
    const image = item.querySelector('.dish-image-placeholder');

    item.addEventListener('mouseenter', function() {
        image.style.transform = 'scale(1.03)';
        image.style.transition = 'transform 0.4s ease';
    });

    item.addEventListener('mouseleave', function() {
        image.style.transform = 'scale(1)';
    });
});

// Typing effect for hero subtitle (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing effect on hero subtitle (uncomment to enable)
// const heroSubtitle = document.querySelector('.hero-subtitle');
// if (heroSubtitle) {
//     const originalText = heroSubtitle.textContent;
//     heroSubtitle.textContent = '';
//     setTimeout(() => {
//         typeWriter(heroSubtitle, originalText, 30);
//     }, 1000);
// }

// Preload critical images (if any were added)
// function preloadImages() {
//     const imageUrls = [
//         // Add actual image URLs here when images are added
//     ];

//     imageUrls.forEach(url => {
//         const img = new Image();
//         img.src = url;
//     });
// }

// Call preload function when needed
// preloadImages();

// Performance optimization: Debounce scroll events
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

// Use debounced scroll for performance
const debouncedScroll = debounce(function() {
    // Additional scroll-based functionality can be added here
}, 16);

window.addEventListener('scroll', debouncedScroll);

// Mobile-optimized initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sugar Coated Dreams - Enhanced mobile-ready website loaded successfully!');

    // Detect if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Add smooth reveal animations with mobile performance considerations
    const reveals = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card');

    // Use Intersection Observer for better performance on mobile
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        reveals.forEach(reveal => {
            reveal.style.opacity = '0';
            reveal.style.transform = 'translateY(30px)';
            reveal.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            revealObserver.observe(reveal);
        });
    } else {
        // Fallback for older browsers
        reveals.forEach((reveal, index) => {
            reveal.style.opacity = '0';
            reveal.style.transform = 'translateY(30px)';
            reveal.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;

            setTimeout(() => {
                reveal.style.opacity = '1';
                reveal.style.transform = 'translateY(0)';
            }, 500);
        });
    }

    // Mobile-specific enhancements
    if (isTouchDevice) {
        // Add touch feedback for buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });

            btn.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });

        // Improve form inputs for mobile
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('focus', function() {
                // Smooth scroll to input on mobile when focused
                setTimeout(() => {
                    this.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300);
            });
        });
    }

    // Viewport height fix for mobile browsers
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
    });
});
