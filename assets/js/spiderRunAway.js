// Enhanced Spider Animation System
const spiders = document.querySelectorAll('.fa-spider');

spiders.forEach(spider => {
    let isAnimating = false;
    let currentPosition = { x: 0, y: 0, rotation: 0 };
    let speechBubble = null;
    let speechTimeout = null;
    let autoResetTimeout = null;
    let isUserInteracting = false;
    
    // Start auto-reset timer
    function startAutoResetTimer() {
        clearTimeout(autoResetTimeout);
        autoResetTimeout = setTimeout(() => {
            if (!isUserInteracting && (currentPosition.x !== 0 || currentPosition.y !== 0 || currentPosition.rotation !== 0)) {
                resetSpiderPosition();
            }
        }, 5000); // 5 seconds
    }
    
    // Clear auto-reset timer
    function clearAutoResetTimer() {
        if (autoResetTimeout) {
            clearTimeout(autoResetTimeout);
            autoResetTimeout = null;
        }
    }
    
    // Track user interaction state
    function setUserInteracting(state) {
        isUserInteracting = state;
        if (state) {
            clearAutoResetTimer();
        } else {
            startAutoResetTimer();
        }
    }
    
    // Create speech bubble element
    function createSpeechBubble() {
        if (speechBubble) return speechBubble;
        
        const container = spider.closest('.about-image, .blog-image, .contact-icon, .card-icon');
        if (!container) return null;
        
        speechBubble = document.createElement('div');
        speechBubble.className = 'spider-speech';
        speechBubble.innerHTML = `
            <div class="spider-avatar">
                <i class="fas fa-spider"></i>
            </div>
            <span class="speech-text">Catch me if you can!</span>
        `;
        
        container.appendChild(speechBubble);
        return speechBubble;
    }
      // Show speech bubble
    function showSpeechBubble() {
        const bubble = createSpeechBubble();
        if (!bubble) return;
        
        // Clear any existing timeout
        if (speechTimeout) {
            clearTimeout(speechTimeout);
        }
        
        // Show bubble with bounce animation
        bubble.classList.remove('show');
        bubble.classList.add('bounce');
        
        // Keep bubble visible (no auto-hide when spider is stationary)
        speechTimeout = setTimeout(() => {
            if (bubble) {
                bubble.classList.remove('bounce');
                bubble.classList.add('show');
            }
        }, 600); // After bounce animation completes
    }
    
    // Hide speech bubble
    function hideSpeechBubble() {
        const bubble = createSpeechBubble();
        if (!bubble) return;
        
        if (speechTimeout) {
            clearTimeout(speechTimeout);
        }
        
        bubble.classList.remove('bounce');
        bubble.classList.remove('show');
    }
      // Show initial hint speech bubble
    function showInitialHint() {
        // Show hint after a short delay when page loads
        setTimeout(() => {
            if (currentPosition.x === 0 && currentPosition.y === 0 && !isAnimating) {
                showSpeechBubble();
                
                // Auto-hide hint after 4 seconds if no interaction
                setTimeout(() => {
                    if (currentPosition.x === 0 && currentPosition.y === 0 && !isAnimating) {
                        hideSpeechBubble();
                    }
                }, 4000);
            }
        }, 2000); // Show hint 2 seconds after page load
    }
      // Check if spider container is in viewport
    function isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        // More generous detection - trigger when element is partially visible
        return (
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= windowHeight &&
            rect.left <= windowWidth
        );
    }
    
    // Show hint when scrolling into view
    function showHintOnScroll() {
        const container = spider.closest('.about-image, .blog-image, .contact-icon, .card-icon');
        if (!container) return;
        
        // Only show hint if spider is in center position and not currently showing speech
        if (isInViewport(container) && 
            currentPosition.x === 0 && 
            currentPosition.y === 0 && 
            !isAnimating && 
            (!speechBubble || (!speechBubble.classList.contains('show') && !speechBubble.classList.contains('bounce')))) {
            
            showSpeechBubble();
            
            // Auto-hide after 3 seconds if no interaction
            setTimeout(() => {
                if (currentPosition.x === 0 && currentPosition.y === 0 && !isAnimating) {
                    hideSpeechBubble();
                }
            }, 3000);
        }
    }
    
    // Clean up speech bubble
    function removeSpeechBubble() {
        if (speechBubble && speechBubble.parentNode) {
            speechBubble.parentNode.removeChild(speechBubble);
            speechBubble = null;
        }
        if (speechTimeout) {
            clearTimeout(speechTimeout);
            speechTimeout = null;
        }
    }
      // Function to generate random position within container bounds
    function getRandomPosition(container) {
        const containerRect = container.getBoundingClientRect();
        const spiderSize = 48; // Approximate spider icon size
        
        // Calculate safe movement area (within container minus spider size)
        const maxX = Math.min(250, containerRect.width - spiderSize);
        const maxY = Math.min(150, containerRect.height - spiderSize);
        
        let x, y;
        
        // Ensure minimum distance from center to avoid clustering
        do {
            x = Math.random() * maxX - (maxX / 2);
            y = Math.random() * maxY - (maxY / 2);
        } while (Math.abs(x) < 30 && Math.abs(y) < 30); // Minimum 30px from center
        
        const rotation = Math.random() * 720 - 360; // Random rotation between -360 and 360
        
        return { x, y, rotation };
    }    // Function to animate spider to new position
    function runSpiderToNewPosition() {
        if (isAnimating) return;
        
        isAnimating = true;
        const container = spider.closest('.about-image, .blog-image, .contact-icon, .card-icon');
        
        if (container) {
            const newPosition = getRandomPosition(container);
            
            // Hide speech bubble during movement
            hideSpeechBubble();
            
            // Set CSS custom properties for the animation
            spider.style.setProperty('--spider-from-x', `${currentPosition.x}px`);
            spider.style.setProperty('--spider-from-y', `${currentPosition.y}px`);
            spider.style.setProperty('--spider-from-rotation', `${currentPosition.rotation}deg`);
            spider.style.setProperty('--spider-x', `${newPosition.x}px`);
            spider.style.setProperty('--spider-y', `${newPosition.y}px`);
            spider.style.setProperty('--spider-rotation', `${newPosition.rotation}deg`);
            
            // Add running class to trigger animation
            spider.classList.add('running');
            
            // Update current position
            currentPosition = newPosition;
            
            // Remove animation class after animation completes and apply final transform
            setTimeout(() => {
                spider.classList.remove('running');
                // Apply the final transform directly to ensure the element is actually positioned there
                spider.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px) rotate(${newPosition.rotation}deg)`;
                isAnimating = false;
                
                // Show speech bubble again after settling
                setTimeout(() => {
                    showSpeechBubble();
                }, 300); // Small delay after settling
                
                // Start auto-reset timer after animation completes
                startAutoResetTimer();
            }, 600); // Match animation duration
        }
    }    // Function to reset spider position
    function resetSpiderPosition() {
        if (isAnimating) return;
        
        isAnimating = true;
        
        // Hide speech bubble during reset movement
        hideSpeechBubble();
        
        // Set animation from current position to center
        spider.style.setProperty('--spider-from-x', `${currentPosition.x}px`);
        spider.style.setProperty('--spider-from-y', `${currentPosition.y}px`);
        spider.style.setProperty('--spider-from-rotation', `${currentPosition.rotation}deg`);
        spider.style.setProperty('--spider-x', '0px');
        spider.style.setProperty('--spider-y', '0px');
        spider.style.setProperty('--spider-rotation', '0deg');
        
        // Trigger animation
        spider.classList.add('running');
        
        // Update position and clear transforms
        currentPosition = { x: 0, y: 0, rotation: 0 };
        
        setTimeout(() => {
            spider.classList.remove('running');
            spider.style.transform = ''; // Clear the direct transform
            isAnimating = false;
            
            // Show speech bubble again after returning to center
            setTimeout(() => {
                showSpeechBubble();
            }, 300); // Small delay after settling
        }, 600);
        
        // Clear timers
        clearAutoResetTimer();
        if (speechTimeout) {
            clearTimeout(speechTimeout);
            speechTimeout = null;
        }
    }
      // Click event - spider runs to new position
    spider.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        clearAutoResetTimer();
        runSpiderToNewPosition();
    });
    
    // Touch event for mobile devices
    spider.addEventListener('touchstart', function(e) {
        e.preventDefault();
        clearAutoResetTimer();
        runSpiderToNewPosition();
    });
      // Hover events - instant response
    spider.addEventListener('mouseenter', function() {
        setUserInteracting(true);
        // Hide hint bubble when user starts hovering
        hideSpeechBubble();
        // Always run away instantly when hovered
        if (!isAnimating) {
            runSpiderToNewPosition();
        }
    });
    
    spider.addEventListener('mouseleave', function() {
        setUserInteracting(false);
    });
    
    // Focus events
    spider.addEventListener('focus', function() {
        setUserInteracting(true);
    });
    
    spider.addEventListener('blur', function() {
        setUserInteracting(false);
    });
    
    // Double-click to reset position
    spider.addEventListener('dblclick', function(e) {
        e.preventDefault();
        e.stopPropagation();
        resetSpiderPosition();
    });
    
    // Keyboard support for accessibility
    spider.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            runSpiderToNewPosition();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            resetSpiderPosition();
        }
    });
    
    // Make spider focusable for keyboard navigation
    if (!spider.hasAttribute('tabindex')) {
        spider.setAttribute('tabindex', '0');
    }    // Add ARIA attributes for accessibility
    spider.setAttribute('role', 'button');
    spider.setAttribute('aria-label', 'Interactive spider - click to make it run to a new position');
    spider.setAttribute('title', 'Catch me if you can!');    // Store spider data for global access
    spider._spiderData = {
        currentPosition: currentPosition,
        resetSpiderPosition: resetSpiderPosition,
        isAnimating: () => isAnimating,
        clearAutoResetTimer: clearAutoResetTimer,
        showHintOnScroll: showHintOnScroll
    };
    
    // Show initial hint to let users know there's a game
    showInitialHint();
});

// Global interaction detection - reset spiders when user interacts elsewhere
document.addEventListener('mouseenter', function(e) {
    // Check if the target is not within any spider container
    const isSpiderContainer = e.target.closest('.about-image, .blog-image, .contact-icon, .card-icon');
    
    if (!isSpiderContainer) {
        // User is interacting outside spider containers, reset all spiders
        spiders.forEach(spider => {
            const spiderData = spider._spiderData;
            if (spiderData && (spiderData.currentPosition.x !== 0 || spiderData.currentPosition.y !== 0) && !spiderData.isAnimating()) {
                spiderData.clearAutoResetTimer();
                spiderData.resetSpiderPosition();
            }
        });
    }
}, true);

// Throttle function for scroll performance
function throttle(func, wait) {
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

// Scroll event listener to show hints when scrolling back to spider areas
const throttledScrollHandler = throttle(() => {
    spiders.forEach(spider => {
        const spiderData = spider._spiderData;
        if (spiderData && spiderData.showHintOnScroll) {
            spiderData.showHintOnScroll();
        }
    });
}, 200); // Throttle to every 200ms

window.addEventListener('scroll', throttledScrollHandler);

// Also trigger on resize in case viewport changes
window.addEventListener('resize', throttle(() => {
    spiders.forEach(spider => {
        const spiderData = spider._spiderData;
        if (spiderData && spiderData.showHintOnScroll) {
            spiderData.showHintOnScroll();
        }
    });
}, 300));
