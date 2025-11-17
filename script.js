/**
 * Portfolio JavaScript
 * Bibhudendu Behera - AI Engineer Portfolio
 * 
 * Main functionality for interactive features including:
 * - Mobile navigation menu
 * - Smooth scrolling
 * - Form validation
 * - Theme toggle (dark mode)
 * - Analytics tracking
 * - Scroll animations
 * 
 * @version 1.0.0
 */

(function() {
  'use strict';

  // ============================================
  // 0. SCROLL TO TOP ON PAGE REFRESH
  // ============================================
  /**
   * Scrolls to top of page on refresh/reload
   * Prevents browser from maintaining scroll position
   */
  // Scroll to top immediately on page load
  window.addEventListener('DOMContentLoaded', function() {
    // Scroll to top immediately
    window.scrollTo(0, 0);
    // Also use requestAnimationFrame to ensure it happens after layout
    requestAnimationFrame(function() {
      window.scrollTo(0, 0);
    });
  });

  // Handle pageshow event for refresh detection
  window.addEventListener('pageshow', function(event) {
    // On page refresh (not back/forward), scroll to top
    // event.persisted is false on refresh, true on back/forward
    if (!event.persisted) {
      // This is a fresh load or refresh
      window.scrollTo(0, 0);
      requestAnimationFrame(function() {
        window.scrollTo(0, 0);
      });
    }
  });

  // Also scroll to top on window load as backup
  window.addEventListener('load', function() {
    // Only scroll if we're not at the top already (prevents jump on initial load)
    if (window.pageYOffset > 0) {
      window.scrollTo(0, 0);
    }
  });

  // ============================================
  // 1. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  /**
   * Implements smooth scrolling behavior for all anchor links
   * Accounts for fixed header offset to prevent content from being hidden
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80; // Account for fixed header height
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // SCROLL INDICATOR SPECIFIC HANDLER
  // ============================================
  /**
   * Ensures the scroll indicator arrow works reliably
   * Handles both click and touch events for better mobile support
   */
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    const handleScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = document.querySelector('#projects');
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    scrollIndicator.addEventListener('click', handleScroll);
    scrollIndicator.addEventListener('touchstart', handleScroll);
  }

  // ============================================
  // 2. MOBILE MENU TOGGLE
  // ============================================
  /**
   * Initializes and manages the mobile navigation menu
   * Handles both touch and click events for cross-device compatibility
   */
  function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-links') || document.querySelector('#primary-nav');

    // Exit if required elements are not found
    if (!mobileMenuToggle || !navMenu) {
      return;
    }

    let isMenuOpen = false;

    // Only hide menu on mobile screens (<= 768px)
    // On desktop, let CSS handle the display
    if (window.innerWidth <= 768) {
      navMenu.style.display = 'none';
      navMenu.style.opacity = '0';
      navMenu.style.visibility = 'hidden';
    }

    /**
     * Toggles the mobile menu open/closed state
     * Uses inline styles to ensure visibility regardless of CSS conflicts
     */
    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      isMenuOpen = !isMenuOpen;
      
      if (isMenuOpen) {
        // Show menu with inline styles (bypasses CSS conflicts)
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '56px';
        navMenu.style.left = '12px';
        navMenu.style.right = '12px';
        navMenu.style.background = 'rgba(255,255,255,0.98)';
        navMenu.style.zIndex = '1001';
        navMenu.style.opacity = '1';
        navMenu.style.visibility = 'visible';
        navMenu.style.transform = 'translateY(0)';
        navMenu.style.pointerEvents = 'auto';
        navMenu.style.padding = '10px';
        navMenu.style.borderRadius = '10px';
        navMenu.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
        
        navMenu.classList.add('open');
        mobileMenuToggle.classList.add('active');
        document.body.classList.add('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
      } else {
        // Hide menu
        navMenu.style.display = 'none';
        navMenu.style.opacity = '0';
        navMenu.style.visibility = 'hidden';
        navMenu.style.pointerEvents = 'none';
        
        navMenu.classList.remove('open');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    }

    // Touch event handling for mobile devices
    let touchStartTime = 0;
    let touchStartPos = null;

    mobileMenuToggle.addEventListener('touchstart', function(e) {
      touchStartTime = Date.now();
      if (e.touches[0]) {
        touchStartPos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    }, { passive: true });

    mobileMenuToggle.addEventListener('touchend', function(e) {
      // Only handle on mobile
      if (window.innerWidth > 768) return;
      
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;
      
      // Check if it was a tap (not a swipe)
      let isTap = true;
      if (touchStartPos && e.changedTouches[0]) {
        const touchEndPos = {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY
        };
        const distance = Math.sqrt(
          Math.pow(touchEndPos.x - touchStartPos.x, 2) + 
          Math.pow(touchEndPos.y - touchStartPos.y, 2)
        );
        // If moved more than 10px, it's a swipe, not a tap
        if (distance > 10) {
          isTap = false;
        }
      }
      
      // If it's a quick tap (< 300ms), toggle menu
      if (isTap && touchDuration < 300) {
        toggleMenu(e);
      }
      
      e.preventDefault();
      e.stopPropagation();
    }, { passive: false });

    // Click event handling for mouse devices (mobile only)
    mobileMenuToggle.addEventListener('click', function(e) {
      // Only toggle on mobile
      if (window.innerWidth <= 768) {
        toggleMenu(e);
      }
    });

    // Close menu when clicking a navigation link (mobile only)
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Only close menu on mobile
        if (window.innerWidth <= 768) {
          navMenu.style.display = 'none';
          navMenu.style.opacity = '0';
          navMenu.style.visibility = 'hidden';
          navMenu.style.pointerEvents = 'none';
          navMenu.classList.remove('open');
          mobileMenuToggle.classList.remove('active');
          document.body.classList.remove('menu-open');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
          isMenuOpen = false;
        }
      });
    });
    
    // Close menu when clicking outside (mobile only)
    document.addEventListener('click', (e) => {
      // Only handle on mobile
      if (window.innerWidth > 768) return;
      if (!isMenuOpen) return;
      if (mobileMenuToggle.contains(e.target)) return;
      if (navMenu.contains(e.target)) return;
      
      navMenu.style.display = 'none';
      navMenu.style.opacity = '0';
      navMenu.style.visibility = 'hidden';
      navMenu.style.pointerEvents = 'none';
      navMenu.classList.remove('open');
      mobileMenuToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      isMenuOpen = false;
    }, true);

    // Close menu on Escape key (mobile only)
    document.addEventListener('keydown', (e) => {
      // Only handle on mobile
      if (window.innerWidth > 768) return;
      if (e.key === 'Escape' && isMenuOpen) {
        navMenu.style.display = 'none';
        navMenu.style.opacity = '0';
        navMenu.style.visibility = 'hidden';
        navMenu.style.pointerEvents = 'none';
        navMenu.classList.remove('open');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        isMenuOpen = false;
      }
    });

    // Handle window resize - ensure menu is visible on desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        // Desktop: remove inline styles and let CSS handle display
        navMenu.style.display = '';
        navMenu.style.opacity = '';
        navMenu.style.visibility = '';
        navMenu.style.pointerEvents = '';
        navMenu.style.position = '';
        navMenu.style.top = '';
        navMenu.style.left = '';
        navMenu.style.right = '';
        navMenu.style.background = '';
        navMenu.style.zIndex = '';
        navMenu.style.transform = '';
        navMenu.style.padding = '';
        navMenu.style.borderRadius = '';
        navMenu.style.boxShadow = '';
        navMenu.style.flexDirection = '';
        navMenu.classList.remove('open');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        isMenuOpen = false;
      } else {
        // Mobile: hide menu if it was open
        if (isMenuOpen) {
          navMenu.style.display = 'none';
          navMenu.style.opacity = '0';
          navMenu.style.visibility = 'hidden';
          navMenu.style.pointerEvents = 'none';
          isMenuOpen = false;
        }
      }
    });
  }

  // Initialize mobile menu when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    // DOM already ready, initialize after a short delay
    setTimeout(initMobileMenu, 100);
  }

  // Backup initialization on window load
  window.addEventListener('load', function() {
    const btn = document.querySelector('.nav-toggle');
    if (btn && !btn.hasAttribute('data-initialized')) {
      btn.setAttribute('data-initialized', 'true');
      initMobileMenu();
    }
  });

  // ============================================
  // 3. SCROLL ANIMATIONS WITH INTERSECTION OBSERVER
  // ============================================
  /**
   * Animates elements as they come into view using Intersection Observer API
   * More performant than scroll event listeners
   */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-up, .slide-in-left, .slide-in-right, .animate-on-scroll').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // ============================================
  // 4. ACTIVE NAVIGATION HIGHLIGHT
  // ============================================
  /**
   * Highlights the active navigation link based on scroll position
   * Updates as user scrolls through different sections
   */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"], .nav-links a[href^="#"]');

  function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    // Check if we're at the top (home section)
    if (scrollY < 200) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#home' || link.getAttribute('href') === '#') {
          link.classList.add('active');
        }
      });
      return;
    }
    
    // Check all sections/headers
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Initial highlight
  highlightNavigation();
  
  // Also highlight on page load based on hash
  if (window.location.hash) {
    const hash = window.location.hash;
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
      }
    });
  }

  // ============================================
  // 5. CONTACT FORM VALIDATION AND SUBMISSION
  // ============================================
  /**
   * Handles contact form submission with validation
   * Integrates with Formspree for form processing
   */
  const contactForm = document.getElementById('contactForm') || document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      // Show loading state
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      submitButton.classList.add('loading');
      
      try {
        const formData = new FormData(contactForm);
        
        // Check if form has Formspree action
        const formAction = contactForm.getAttribute('action');
        if (formAction && formAction.includes('formspree.io')) {
          const response = await fetch(formAction, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
          });
          
          const result = await response.json();
          
          if (response.ok) {
            showNotification('Message sent successfully! I will get back to you soon.', 'success');
            contactForm.reset();
          } else {
            // Handle Formspree validation errors
            if (result.errors) {
              const errorMessage = result.errors.map(err => err.message).join(', ');
              throw new Error(errorMessage);
            } else {
              throw new Error('Form submission failed');
            }
          }
        } else {
          // Fallback: show success message and email link
          showNotification('Thank you for your message! Please email me directly at bibhu342@gmail.com', 'success');
          contactForm.reset();
        }
      } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Failed to send message. Please try emailing directly: bibhu342@gmail.com', 'error');
      } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
      }
    });
    
    // Real-time email validation
    const emailInput = contactForm.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
          this.classList.add('error');
          showFieldError(this, 'Please enter a valid email address');
        } else {
          this.classList.remove('error');
          hideFieldError(this);
        }
      });

      // Remove error on input
      emailInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          this.classList.remove('error');
          hideFieldError(this);
        }
      });
    }

    // Validate required fields
    const requiredFields = contactForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      field.addEventListener('blur', function() {
        if (!this.value.trim()) {
          this.classList.add('error');
          showFieldError(this, 'This field is required');
        } else {
          this.classList.remove('error');
          hideFieldError(this);
        }
      });

      field.addEventListener('input', function() {
        if (this.value.trim() && this.classList.contains('error')) {
          this.classList.remove('error');
          hideFieldError(this);
        }
      });
    });
  }

  /**
   * Shows a notification message to the user
   * @param {string} message - The message to display
   * @param {string} type - The type of notification ('success' or 'error')
   */
  function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close" aria-label="Close notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  /**
   * Shows an error message for a form field
   * @param {HTMLElement} field - The form field element
   * @param {string} message - The error message to display
   */
  function showFieldError(field, message) {
    const fieldId = field.id;
    const errorId = fieldId ? `${fieldId}-error` : null;
    let errorDiv = errorId ? document.getElementById(errorId) : null;
    
    if (!errorDiv) {
      // Check if there's a sibling error element
      errorDiv = field.nextElementSibling;
      if (!errorDiv || (!errorDiv.classList.contains('form-error') && !errorDiv.classList.contains('field-error'))) {
        errorDiv = document.createElement('span');
        errorDiv.className = 'form-error';
        errorDiv.setAttribute('role', 'alert');
        if (errorId) errorDiv.id = errorId;
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
      }
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
  }

  /**
   * Hides the error message for a form field
   * @param {HTMLElement} field - The form field element
   */
  function hideFieldError(field) {
    const fieldId = field.id;
    const errorId = fieldId ? `${fieldId}-error` : null;
    const errorDiv = errorId ? document.getElementById(errorId) : field.nextElementSibling;
    
    if (errorDiv && (errorDiv.classList.contains('form-error') || errorDiv.classList.contains('field-error'))) {
      errorDiv.textContent = '';
      errorDiv.style.display = 'none';
    }
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
  }

  // ============================================
  // 6. PROJECT FILTER FUNCTIONALITY
  // ============================================
  /**
   * Filters project cards based on selected category
   * Provides smooth animations when filtering
   */
  const filterButtons = document.querySelectorAll('.filter-btn, [data-filter]');
  const projectCards = document.querySelectorAll('.project-card, [data-category]');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter || button.getAttribute('data-filter');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter projects with animation
        projectCards.forEach(card => {
          const category = card.dataset.category || card.getAttribute('data-category');
          
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });

        // Announce filter change to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Showing ${filter === 'all' ? 'all' : filter} projects`;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
      });
    });
  }

  // ============================================
  // 7. COUNTER ANIMATION FOR STATS
  // ============================================
  /**
   * Animates numeric counters from 0 to target value
   * Uses easing function for smooth animation
   */
  function animateCounter(element) {
    const target = parseInt(element.dataset.target || element.getAttribute('data-target'), 10);
    
    // Skip if invalid target
    if (isNaN(target) || target <= 0) {
      return;
    }
    
    // Ensure element starts at 0
    element.textContent = '0';
    
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation (ease-out quart)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
      
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Ensure final value is exact
        element.textContent = target;
      }
    };
    
    // Start animation
    requestAnimationFrame(updateCounter);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Only animate if not already animated
        if (!entry.target.classList.contains('counter-animated')) {
          entry.target.classList.add('counter-animated');
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

  // Initialize achievement counter animation
  document.querySelectorAll('.achievement-metric[data-target]').forEach(counter => {
    const target = counter.dataset.target || counter.getAttribute('data-target');
    if (target && !isNaN(parseInt(target, 10))) {
      counter.textContent = '0';
      counterObserver.observe(counter);
    }
  });

  // ============================================
  // 8. BACK TO TOP BUTTON
  // ============================================
  /**
   * Creates and manages a back-to-top button
   * Appears when user scrolls down 300px
   */
  let backToTopButton = document.querySelector('.back-to-top');
  
  if (!backToTopButton) {
    backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.setAttribute('type', 'button');
    document.body.appendChild(backToTopButton);
  }

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ============================================
  // 9. SCROLL PROGRESS INDICATOR
  // ============================================
  /**
   * Displays a progress bar showing scroll position
   * Provides visual feedback of reading progress
   */
  let progressBar = document.querySelector('.scroll-progress');
  
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Page scroll progress');
    document.body.appendChild(progressBar);
  }

  // ============================================
  // 10. HEADER SHADOW ON SCROLL
  // ============================================
  /**
   * Adds shadow to header when user scrolls down
   * Provides visual separation from content
   */
  const header = document.querySelector('.site-header, header, .header, nav[role="navigation"]');

  // ============================================
  // 11. LAZY LOADING IMAGES
  // ============================================
  /**
   * Implements lazy loading for images
   * Uses native lazy loading if supported, otherwise Intersection Observer
   */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // 12. KEYBOARD NAVIGATION IMPROVEMENTS
  // ============================================
  /**
   * Enhances keyboard navigation with visual focus indicators
   * Only shows focus styles when using keyboard, not mouse
   */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  // ============================================
  // 13. FORM VALIDATION ENHANCEMENTS
  // ============================================
  /**
   * Prevents empty form submissions
   * Validates required fields before allowing submission
   */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          showFieldError(field, 'This field is required');
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });
  });

  // ============================================
  // 14. EXTERNAL LINK SECURITY
  // ============================================
  /**
   * Adds security attributes to external links
   * Prevents tabnabbing attacks
   */
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    if (!link.hasAttribute('rel')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // ============================================
  // 15. PERFORMANCE: DEBOUNCE UTILITY
  // ============================================
  /**
   * Debounce utility function to limit function execution frequency
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
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

  // Apply debounce to resize events
  window.addEventListener('resize', debounce(() => {
    highlightNavigation();
  }, 250));

  // ============================================
  // 16. THEME TOGGLE (DARK MODE)
  // ============================================
  /**
   * Manages theme switching between light and dark modes
   * Respects user's system preference and saves choice to localStorage
   */
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkQuery = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  /**
   * Sets the theme on the document
   * @param {string} theme - 'light' or 'dark'
   */
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Update aria-pressed and aria-label for the toggle button
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  /**
   * Initializes theme based on saved preference or system preference
   */
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = prefersDarkQuery ? prefersDarkQuery.matches : false;
    const theme = (savedTheme === 'dark' || savedTheme === 'light')
      ? savedTheme
      : (systemPrefersDark ? 'dark' : 'light');

    setTheme(theme);
  }

  /**
   * Toggles between light and dark themes
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Apply theme immediately
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Smooth transition helper
    document.body.classList.add('theme-transitioning');
    window.setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 350);

    // Analytics tracking (if gtag active)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'theme_toggle', {
        'event_category': 'Engagement',
        'event_label': newTheme
      });
    }
  }

  // Attach listener
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Respond to system preference changes only if user hasn't saved a preference
  if (prefersDarkQuery && typeof prefersDarkQuery.addEventListener === 'function') {
    prefersDarkQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  } else if (prefersDarkQuery && typeof prefersDarkQuery.addListener === 'function') {
    // Fallback for older browsers
    prefersDarkQuery.addListener((e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Initialize theme on page load
  initializeTheme();

  // ============================================
  // 17. ANALYTICS EVENT TRACKING
  // ============================================
  /**
   * Tracks user interactions for analytics
   * Only tracks if Google Analytics (gtag) is available
   */
  function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag === 'function') {
      try {
        gtag('event', eventName, eventParams);
      } catch (err) {
        // Silently fail if analytics is not available
      }
    }
  }

  // Resume downloads
  document.querySelectorAll('a[href*="resume.pdf"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('resume_download', {
        'event_category': 'Downloads',
        'event_label': 'Resume PDF'
      });
    });
  });

  // External link clicks (outbound)
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    try {
      if (!link.href.includes(window.location.hostname)) {
        link.addEventListener('click', () => {
          trackEvent('external_link_click', {
            'event_category': 'Outbound Links',
            'event_label': link.href,
            'link_text': (link.textContent || '').trim()
          });
        });
      }
    } catch (err) {
      // Ignore malformed hrefs
    }
  });

  // Social clicks
  document.querySelectorAll('a[href*="linkedin.com"], a[href*="github.com"]').forEach(link => {
    link.addEventListener('click', () => {
      const platform = link.href.includes('linkedin') ? 'LinkedIn' : 'GitHub';
      trackEvent('social_click', {
        'event_category': 'Social Media',
        'event_label': platform
      });
    });
  });

  // Email and phone clicks
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('email_click', { 'event_category': 'Contact', 'event_label': 'Email Link' });
    });
  });
  
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('phone_click', { 'event_category': 'Contact', 'event_label': 'Phone Link' });
    });
  });

  // Contact form analytics tracking
  const contactFormForTracking = document.getElementById('contactForm') || document.getElementById('contact-form');
  if (contactFormForTracking) {
    // Track first interaction
    contactFormForTracking.addEventListener('focusin', function onFirstFocus() {
      trackEvent('form_start', { 'event_category': 'Contact Form', 'event_label': 'Form Started' });
    }, { once: true });

    contactFormForTracking.addEventListener('submit', () => {
      trackEvent('form_submit', { 'event_category': 'Contact Form', 'event_label': 'Form Submitted' });
    });
  }

  // Project card clicks
  document.querySelectorAll('.project-card a').forEach(link => {
    link.addEventListener('click', () => {
      const card = link.closest('.project-card');
      const projectNameNode = card ? card.querySelector('h3') : null;
      const projectName = projectNameNode ? projectNameNode.textContent.trim() : 'unknown';
      const linkText = (link.textContent || '').trim();
      const linkType = /demo/i.test(linkText) ? 'Live Demo' : 'View Code';
      trackEvent('project_click', {
        'event_category': 'Projects',
        'event_label': `${projectName} - ${linkType}`
      });
    });
  });

  // Scroll depth tracking (25/50/75/100)
  let scrollDepthTracked = { '25': false, '50': false, '75': false, '100': false };
  
  // ============================================
  // OPTIMIZED SCROLL HANDLER (COMBINED)
  // ============================================
  /**
   * Combined scroll event handler using requestAnimationFrame
   * Handles: navigation highlighting, back-to-top button, scroll progress, header shadow, scroll depth tracking
   * Uses requestAnimationFrame for optimal performance
   */
  let scrollRafId = null;
  let lastScrollY = window.pageYOffset;
  
  function handleScroll() {
    const scrollY = window.pageYOffset;
    
    // Navigation highlighting (throttled via requestAnimationFrame)
    highlightNavigation();
    
    // Back to top button visibility
    if (scrollY > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
    
    // Scroll progress indicator
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = windowHeight > 0 ? (scrollY / windowHeight) * 100 : 0;
    progressBar.style.width = scrolled + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(scrolled));
    
    // Header shadow
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    // Scroll depth tracking (only check if scroll changed significantly)
    if (Math.abs(scrollY - lastScrollY) > 10) {
      const scrollPercent = windowHeight > 0 ? (scrollY / windowHeight) * 100 : 0;
      Object.keys(scrollDepthTracked).forEach(depth => {
        const d = Number(depth);
        if (scrollPercent >= d && !scrollDepthTracked[depth]) {
          scrollDepthTracked[depth] = true;
          trackEvent('scroll_depth', {
            'event_category': 'Engagement',
            'event_label': `${depth}% Scrolled`
          });
        }
      });
      lastScrollY = scrollY;
    }
    
    scrollRafId = null;
  }
  
  window.addEventListener('scroll', () => {
    if (!scrollRafId) {
      scrollRafId = requestAnimationFrame(handleScroll);
    }
  }, { passive: true });

  // Time on page (send on beforeunload)
  let startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', {
      'event_category': 'Engagement',
      'event_label': 'Time Spent',
      'value': timeSpent
    });
  });

  // Section visibility tracking (IntersectionObserver)
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.id || entry.target.className || 'unnamed-section';
          trackEvent('section_view', {
            'event_category': 'Navigation',
            'event_label': sectionName
          });
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(section => sectionObserver.observe(section));
  }

  // ============================================
  // 18. COOKIE CONSENT MANAGEMENT
  // ============================================
  /**
   * Manages cookie consent banner
   * Respects user's choice and updates analytics consent accordingly
   */
  function showCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const banner = document.getElementById('cookie-consent');
      if (banner) {
        banner.style.display = 'block';
        // Small delay to trigger CSS transition
        setTimeout(() => banner.classList.add('show'), 100);
      }
    }
  }

  const acceptCookiesBtn = document.getElementById('accept-cookies');
  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      const banner = document.getElementById('cookie-consent');
      if (banner) {
        banner.classList.remove('show');
        setTimeout(() => { banner.style.display = 'none'; }, 300);
      }
      // Update GA consent
      if (typeof gtag === 'function') {
        gtag('consent', 'update', { 'analytics_storage': 'granted' });
        trackEvent('cookie_consent', { 'event_category': 'Consent', 'event_label': 'accepted' });
      }
    });
  }

  const declineCookiesBtn = document.getElementById('decline-cookies');
  if (declineCookiesBtn) {
    declineCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      const banner = document.getElementById('cookie-consent');
      if (banner) {
        banner.classList.remove('show');
        setTimeout(() => { banner.style.display = 'none'; }, 300);
      }
      if (typeof gtag === 'function') {
        gtag('consent', 'update', { 'analytics_storage': 'denied' });
        trackEvent('cookie_consent', { 'event_category': 'Consent', 'event_label': 'declined' });
      }
    });
  }

  // Auto-show cookie banner if needed
  showCookieConsent();

  // ============================================
  // 19. SKILL CATEGORY DROPDOWN TOGGLES
  // ============================================
  /**
   * Manages expandable/collapsible skill categories
   * Provides smooth animations when toggling
   */
  document.querySelectorAll('.cat-header').forEach(header => {
    header.addEventListener('click', function() {
      const skillCat = this.closest('.skill-cat');
      const contentWrapper = skillCat.querySelector('.cat-content-wrapper');
      const toggle = this.querySelector('.cat-toggle');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Toggle expanded state
      const newExpanded = !isExpanded;
      this.setAttribute('aria-expanded', newExpanded);
      
      if (newExpanded) {
        // Open: calculate actual height and set it
        contentWrapper.style.maxHeight = contentWrapper.scrollHeight + 'px';
        contentWrapper.style.opacity = '1';
        if (toggle) toggle.textContent = '▼';
      } else {
        // Close: set to 0
        contentWrapper.style.maxHeight = '0';
        contentWrapper.style.opacity = '0';
        if (toggle) toggle.textContent = '▶';
      }
    });
    
    // Initialize: set collapsed state for all categories
    const skillCat = header.closest('.skill-cat');
    const contentWrapper = skillCat.querySelector('.cat-content-wrapper');
    const toggle = header.querySelector('.cat-toggle');
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      // If expanded, open it
      contentWrapper.style.maxHeight = contentWrapper.scrollHeight + 'px';
      contentWrapper.style.opacity = '1';
      if (toggle) toggle.textContent = '▼';
    } else {
      // If collapsed, ensure it's closed
      contentWrapper.style.maxHeight = '0';
      contentWrapper.style.opacity = '0';
      if (toggle) toggle.textContent = '▶';
    }
  });

  // ============================================
  // 20. ACHIEVEMENT CARDS ANIMATION
  // ============================================
  /**
   * Animates achievement cards as they come into view
   * Uses staggered delays for visual appeal
   */
  const achievementObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('in');
        }, entry.target.dataset.delay || index * 100);
        achievementObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.achievement-card').forEach(card => {
    achievementObserver.observe(card);
  });

  // ============================================
  // 21. SKILLS TAB SWITCHING
  // ============================================
  /**
   * NOTE: Skills section now uses a two-column layout (60/40 split)
   * No tab switching needed - both columns are always visible
   * Old tab switching code removed as it's no longer applicable
   */

  // ============================================
  // INITIALIZATION COMPLETE
  // ============================================
  /**
   * Dispatches a custom event when all initialization is complete
   * Other scripts can listen for this event to know when the portfolio is ready
   */
  window.dispatchEvent(new CustomEvent('portfolioReady'));

})();
