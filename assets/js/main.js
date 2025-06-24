// SpidraHub - Enhanced Static Site JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced page loader with staggered animation
    const pageLoader = document.getElementById('page-loader');
    if (pageLoader) {
        // Animate web strands sequentially
        const webStrands = pageLoader.querySelectorAll('.web-strand');
        webStrands.forEach((strand, index) => {
            strand.style.setProperty('--rotation', `${index * 45}deg`);
            strand.style.animationDelay = `${index * 0.2}s`;
        });
        
        let loaderHidden = false;
          // Function to hide the loader
        function hideLoader() {
            if (!loaderHidden) {
                loaderHidden = true;
                pageLoader.classList.add('hidden');
                setTimeout(() => {
                    if (pageLoader.parentNode) {
                        pageLoader.remove();
                    }
                }, 500); // Only CSS transition time
            }
        }
        
        // Check if page is already loaded (in case this script loads after window.load)
        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            // Hide loader immediately when page is fully loaded
            window.addEventListener('load', hideLoader);
        }
    }
    
    // Enhanced Mobile menu toggle with animations
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
      if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = navMenu.classList.toggle('active');
            
            // Update ARIA attributes
            this.setAttribute('aria-expanded', isActive);
            
            // Animate hamburger lines
            const lines = this.querySelectorAll('.hamburger-line');
            if (isActive) {
                lines[0].style.transform = 'rotate(45deg) translate(4px, 4.5px)';
                lines[1].style.transform = 'translate(-100%, 0)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(-45deg) translate(4px, -4.5px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
          // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                
                // Reset hamburger lines
                const lines = menuToggle.querySelectorAll('.hamburger-line');
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            });
        });
          // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                
                // Reset hamburger lines
                const lines = menuToggle.querySelectorAll('.hamburger-line');
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    }
    
    // Enhanced Header scroll effect
    let lastScrollY = window.scrollY;
    let ticking = false;
      function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
            navMenu.style.top = `128%`;
        } else {
            header.classList.remove('scrolled');
            navMenu.style.top = `143%`;
        }
        
        // Update header background based on scroll
        if (currentScrollY > 0) {
            // Calculate dynamic gradient stop based on scroll position
            const maxScrollY = document.body.scrollHeight - window.innerHeight;
            const percent = Math.max(0, Math.min(1, currentScrollY / maxScrollY));
            const stop = (1 - percent) * 50 + 50; // from 100% to 60% as you scroll down
            header.style.background = `linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) ${stop}%, var(--accent-red-darkest) 110%)`;
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 100%)';
            header.style.backdropFilter = 'none';
        }
        
        // Hide/show header on scroll (only on mobile)
        if (window.innerWidth <= 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Enhanced smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                  // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    
                    // Reset hamburger lines
                    const lines = menuToggle.querySelectorAll('.hamburger-line');
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
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
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    const animateElements = document.querySelectorAll('.card, .blog-post, .contact-item, .about-content');
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Enhanced Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success message
                showNotification('Message sent successfully!', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--accent-green, #10b981)' : 'var(--accent-blue)'};
            color: white;
            padding: 12px 24px;
            border-radius: var(--radius-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: var(--shadow-strong);
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
      // Active navigation highlighting with adjacent classes
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let currentSection = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Remove all navigation classes first
        navLinks.forEach(link => {
            link.classList.remove('active', 'active-left', 'active-right');
        });
        
        // Find the active link and add adjacent classes
        navLinks.forEach((link, index) => {
            if (link.getAttribute('href') === `#${currentSection}`) {
                // Add active class to current link
                link.classList.add('active');
                
                // Add active-left class to previous link
                if (index > 0) {
                    navLinks[index - 1].classList.add('active-left');
                }
                
                // Add active-right class to next link
                if (index < navLinks.length - 1) {
                    navLinks[index + 1].classList.add('active-right');
                }
            }
        });
    }
    
    // Set active navigation states based on current page
    function setPageActiveNav() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Clear all active classes first
        navLinks.forEach(link => {
            link.classList.remove('active', 'active-left', 'active-right');
        });
        
        // Map pages to nav links
        const pageMap = {
            'index.html': 0,
            '': 0, // root path
            'about.html': 1,
            'services.html': 2,
            'blog.html': 3,
            'contact.html': 4
        };
        
        const activeIndex = pageMap[currentPage];
        if (activeIndex !== undefined) {
            // Set active class
            if (navLinks[activeIndex]) {
                navLinks[activeIndex].classList.add('active');
            }
            
            // Set active-left class
            if (activeIndex > 0 && navLinks[activeIndex - 1]) {
                navLinks[activeIndex - 1].classList.add('active-left');
            }
            
            // Set active-right class
            if (activeIndex < navLinks.length - 1 && navLinks[activeIndex + 1]) {
                navLinks[activeIndex + 1].classList.add('active-right');
            }
        }
    }
      // Initialize active navigation
    const isIndexPage = window.location.pathname.includes('index.html') || 
                       window.location.pathname === '/' || 
                       window.location.pathname === '';
    
    if (isIndexPage) {
        // For index page: use scroll-based active nav and call updateActiveNav initially
        updateActiveNav();
        window.addEventListener('scroll', debounce(updateActiveNav, 10));
    } else {
        // For other pages: use page-based active nav
        setPageActiveNav();
    }
    
    // Debounce helper function
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
    
    // Add transition to header
    header.style.transition = 'all 0.3s ease-in-out';
    
    // Web animation effect for hero
    const hero = document.querySelector('.hero');
    if (hero) {
        let mouseX = 0;
        let mouseY = 0;
        
        hero.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 100;
            mouseY = (e.clientY / window.innerHeight) * 100;
            
            hero.style.background = `
                radial-gradient(circle at ${mouseX}% ${mouseY}%, 
                    rgba(220, 38, 38, 0.3) 0%, 
                    transparent 50%),
                linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 50%, var(--accent-red) 100%)
            `;
        });
        
        hero.addEventListener('mouseleave', () => {
            hero.style.background = 'linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 50%, var(--accent-red) 100%)';
        });
    }
    
    // Parallax effect for sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Console message for developers
    console.log(`
    🕷️ SpidraHub - Static Website
    
    Built with modern web technologies:
    • Responsive CSS Grid & Flexbox
    • Smooth animations and transitions
    • Accessibility-focused design
    • Mobile-first approach
    
    Spider-Man inspired color palette:
    • Primary Blue: #1a365d
    • Secondary Blue: #2c5aa0
    • Accent Red: #dc2626
    • Accent Gold: #fbbf24
    
    Feel free to explore the source code!
    `);
});

// Service Worker registration for offline capability (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
