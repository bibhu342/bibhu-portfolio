/**
 * Portfolio JavaScript
 * Bibhudendu Behera - Customer Experience Leader & AI Engineer
 * Main functionality for interactive features
 */

// Immediate test - run before IIFE
console.log('🔴 SCRIPT.JS FILE LOADED!');
console.log('🔴 Current time:', new Date().toISOString());

(function() {
  'use strict';
  
  console.log('🔴 IIFE STARTED - Script is executing');

  // ============================================
  // 1. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
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
  // 2. MOBILE MENU TOGGLE
  // ============================================
  function initMobileMenu() {
    console.log('=== MOBILE MENU INITIALIZATION START ===');
    console.log('Viewport width:', window.innerWidth);
    console.log('Is mobile?', window.innerWidth <= 768);
    
    const mobileMenuToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-links') || document.querySelector('#primary-nav');

    console.log('Elements found:', { 
      mobileMenuToggle: mobileMenuToggle ? 'YES' : 'NO',
      navMenu: navMenu ? 'YES' : 'NO',
      toggleElement: mobileMenuToggle,
      menuElement: navMenu
    });

    if (!mobileMenuToggle) {
      console.error('❌ nav-toggle button NOT FOUND!');
      console.log('Searching for alternatives...');
      const allButtons = document.querySelectorAll('button');
      console.log('All buttons found:', allButtons.length);
      allButtons.forEach((btn, i) => {
        console.log(`Button ${i}:`, {
          classes: btn.className,
          id: btn.id,
          text: btn.textContent.trim().substring(0, 20)
        });
      });
      return;
    }

    if (!navMenu) {
      console.error('❌ nav-links menu NOT FOUND!');
      console.log('Searching for alternatives...');
      const allNavs = document.querySelectorAll('nav, ul, .nav-links, #primary-nav');
      console.log('Navigation elements found:', allNavs.length);
      allNavs.forEach((nav, i) => {
        console.log(`Nav ${i}:`, {
          tag: nav.tagName,
          classes: nav.className,
          id: nav.id
        });
      });
      return;
    }

    console.log('✅ Both elements found successfully!');
    console.log('Toggle button styles:', window.getComputedStyle(mobileMenuToggle));
    console.log('Menu styles:', window.getComputedStyle(navMenu));

    // Ensure button is visible and clickable
    if (window.innerWidth <= 768) {
      console.log('Applying mobile button styles...');
      mobileMenuToggle.style.display = 'block';
      mobileMenuToggle.style.position = 'relative';
      mobileMenuToggle.style.zIndex = '1002';
      mobileMenuToggle.style.pointerEvents = 'auto';
      mobileMenuToggle.style.cursor = 'pointer';
      mobileMenuToggle.style.minWidth = '44px';
      mobileMenuToggle.style.minHeight = '44px';
      mobileMenuToggle.style.padding = '8px';
      // Add visible border for debugging
      mobileMenuToggle.style.border = '2px solid red';
      mobileMenuToggle.style.backgroundColor = 'rgba(255,0,0,0.1)';
      console.log('✅ Button styles applied');
      console.log('Button computed display:', window.getComputedStyle(mobileMenuToggle).display);
      console.log('Button computed pointer-events:', window.getComputedStyle(mobileMenuToggle).pointerEvents);
      console.log('Button computed z-index:', window.getComputedStyle(mobileMenuToggle).zIndex);
      
      // Check if anything is overlaying the button
      const buttonRect = mobileMenuToggle.getBoundingClientRect();
      const centerX = buttonRect.left + buttonRect.width / 2;
      const centerY = buttonRect.top + buttonRect.height / 2;
      const elementAtPoint = document.elementFromPoint(centerX, centerY);
      console.log('Element at button center:', elementAtPoint);
      console.log('Is button itself?', elementAtPoint === mobileMenuToggle || mobileMenuToggle.contains(elementAtPoint));
    } else {
      console.warn('⚠️ Not in mobile viewport! Width is', window.innerWidth, '(needs to be <= 768)');
    }

    let isMenuOpen = false;

    // Ensure menu is hidden initially
    navMenu.style.display = 'none';
    navMenu.style.opacity = '0';
    navMenu.style.visibility = 'hidden';

    // Function to toggle menu (shared by touch and click)
    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      console.log('Menu toggle triggered, current state:', isMenuOpen);
      console.log('Viewport width:', window.innerWidth);
      
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
        console.log('Menu opened - inline styles applied');
        console.log('Menu computed styles:', window.getComputedStyle(navMenu).display);
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
        console.log('Menu closed');
      }
    }

    // Handle both touch and click events
    let touchStartTime = 0;
    let touchStartPos = null;

    // Add event listeners with detailed logging
    console.log('Attaching event listeners...');
    console.log('Button element:', mobileMenuToggle);
    console.log('Button tagName:', mobileMenuToggle.tagName);
    console.log('Button className:', mobileMenuToggle.className);
    console.log('Button parent:', mobileMenuToggle.parentElement);
    
    // CRITICAL: Add onclick attribute as absolute fallback
    mobileMenuToggle.setAttribute('onclick', 'console.log("ONCLICK ATTRIBUTE FIRED!"); return false;');
    console.log('✅ Added onclick attribute as fallback');
    
    mobileMenuToggle.addEventListener('touchstart', function(e) {
      console.log('🔵 TOUCHSTART EVENT FIRED!');
      console.log('  - Target:', e.target);
      console.log('  - Current target:', e.currentTarget);
      console.log('  - Touch count:', e.touches.length);
      touchStartTime = Date.now();
      if (e.touches[0]) {
        touchStartPos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        console.log('  - Touch position:', touchStartPos);
      }
      // Don't prevent default immediately - let touchend handle it
    }, { passive: true });

    mobileMenuToggle.addEventListener('touchend', function(e) {
      console.log('🟢 TOUCHEND EVENT FIRED!');
      console.log('  - Target:', e.target);
      console.log('  - Changed touches:', e.changedTouches.length);
      
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;
      console.log('  - Touch duration:', touchDuration, 'ms');
      
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
        console.log('  - Touch distance:', distance.toFixed(2), 'px');
        // If moved more than 10px, it's a swipe, not a tap
        if (distance > 10) {
          isTap = false;
          console.log('  - ❌ Not a tap (swipe detected)');
        } else {
          console.log('  - ✅ Valid tap detected');
        }
      }
      
      // If it's a quick tap (< 300ms), toggle menu
      if (isTap && touchDuration < 300) {
        console.log('✅ TOUCH TAP DETECTED - TOGGLING MENU');
        toggleMenu(e);
      } else {
        console.log('❌ Tap conditions not met:', { isTap, touchDuration });
      }
      
      e.preventDefault();
      e.stopPropagation();
    }, { passive: false });

    // Also handle click for mouse devices
    mobileMenuToggle.addEventListener('click', function(e) {
      console.log('🟡 CLICK EVENT FIRED!');
      console.log('  - Target:', e.target);
      console.log('  - Button:', e.button);
      toggleMenu(e);
    });

    // Add mousedown for debugging
    mobileMenuToggle.addEventListener('mousedown', function(e) {
      console.log('🟣 MOUSEDOWN EVENT FIRED!');
    });

    console.log('✅ All event listeners attached');
    
    // Test if button is actually clickable
    console.log('Testing button clickability...');
    const rect = mobileMenuToggle.getBoundingClientRect();
    console.log('Button position:', {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      visible: rect.width > 0 && rect.height > 0
    });
    
    // Try programmatic click test
    console.log('Attempting programmatic click test in 2 seconds...');
    setTimeout(function() {
      console.log('Testing programmatic click...');
      try {
        mobileMenuToggle.click();
        console.log('Programmatic click executed');
      } catch (err) {
        console.error('Programmatic click failed:', err);
      }
    }, 2000);
    
    // Add a visible test - change button background on hover
    mobileMenuToggle.addEventListener('mouseenter', function() {
      console.log('🟠 MOUSE ENTER on button!');
      this.style.backgroundColor = 'rgba(0,123,255,0.1)';
    });
    
    mobileMenuToggle.addEventListener('mouseleave', function() {
      console.log('🟠 MOUSE LEAVE from button!');
      this.style.backgroundColor = 'transparent';
    });
    
    console.log('=== MOBILE MENU INITIALIZATION COMPLETE ===');
    
    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.style.display = 'none';
        navMenu.style.opacity = '0';
        navMenu.style.visibility = 'hidden';
        navMenu.style.pointerEvents = 'none';
        navMenu.classList.remove('open');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        isMenuOpen = false;
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
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

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
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

    console.log('Mobile menu initialized successfully');
  }

  // Initialize when DOM is ready
  console.log('Script loading, document readyState:', document.readyState);
  
  if (document.readyState === 'loading') {
    console.log('Waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', function() {
      console.log('DOMContentLoaded fired, initializing menu...');
      initMobileMenu();
    });
  } else {
    console.log('DOM already ready, initializing menu in 100ms...');
    setTimeout(function() {
      console.log('Timeout fired, initializing menu...');
      initMobileMenu();
    }, 100);
  }

  // Also try after a longer delay as backup
  window.addEventListener('load', function() {
    console.log('Window load event fired');
    const btn = document.querySelector('.nav-toggle');
    if (btn) {
      console.log('Button found on window load, re-initializing...');
      initMobileMenu();
    } else {
      console.error('❌ Button still not found on window load!');
    }
  });

  // ULTIMATE FALLBACK - Try every second until button is found
  let retryCount = 0;
  const maxRetries = 10;
  const retryInterval = setInterval(function() {
    retryCount++;
    console.log(`Retry attempt ${retryCount}/${maxRetries}...`);
    const btn = document.querySelector('.nav-toggle');
    if (btn) {
      console.log('✅ Button found on retry! Initializing...');
      clearInterval(retryInterval);
      initMobileMenu();
    } else if (retryCount >= maxRetries) {
      console.error('❌ Button never found after', maxRetries, 'retries');
      clearInterval(retryInterval);
    }
  }, 1000);

  // ============================================
  // 3. SCROLL ANIMATIONS WITH INTERSECTION OBSERVER
  // ============================================
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
  // Include both sections and header elements with IDs (for home section)
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"], .nav-links a[href^="#"]');

  function highlightNavigation() {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
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

  // Throttle scroll event for better performance
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        highlightNavigation();
        scrollTimeout = null;
      }, 100);
    }
  });

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
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  function showFieldError(field, message) {
    // Use the existing error span if it exists (from HTML)
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
  function animateCounter(element) {
    // Get target value
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
      
      // Easing function for smooth animation
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

  // Initialize achievement counter animation - target achievement-metric elements
  document.querySelectorAll('.achievement-metric[data-target]').forEach(counter => {
    const target = counter.dataset.target || counter.getAttribute('data-target');
    if (target && !isNaN(parseInt(target, 10))) {
      // Initialize counter to 0
      counter.textContent = '0';
      counterObserver.observe(counter);
    }
  });

  // ============================================
  // 8. BACK TO TOP BUTTON
  // ============================================
  let backToTopButton = document.querySelector('.back-to-top');
  
  if (!backToTopButton) {
    backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.setAttribute('type', 'button');
    document.body.appendChild(backToTopButton);
  }

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ============================================
  // 9. SCROLL PROGRESS INDICATOR
  // ============================================
  let progressBar = document.querySelector('.scroll-progress');
  
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Page scroll progress');
    document.body.appendChild(progressBar);
  }

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(scrolled));
  });

  // ============================================
  // 10. HEADER SHADOW ON SCROLL
  // ============================================
  const header = document.querySelector('.site-header, header, .header, nav[role="navigation"]');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ============================================
  // ADDITIONAL: LAZY LOADING IMAGES
  // ============================================
  if ('loading' in HTMLImageElement.prototype) {
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
  // ADDITIONAL: KEYBOARD NAVIGATION IMPROVEMENTS
  // ============================================
  document.addEventListener('keydown', (e) => {
    // Add visual focus indicator class
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  // ============================================
  // ADDITIONAL: PREVENT EMPTY FORM SUBMISSION
  // ============================================
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
  // ADDITIONAL: EXTERNAL LINK SECURITY
  // ============================================
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    if (!link.hasAttribute('rel')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // ============================================
  // PERFORMANCE: DEBOUNCE UTILITY
  // ============================================
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
    // Recalculate any layout-dependent features
    highlightNavigation();
  }, 250));

  // ============================================
  // THEME TOGGLE (DARK MODE) - ENHANCED
  // ============================================
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkQuery = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Update aria-pressed and aria-label for the toggle button
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = prefersDarkQuery ? prefersDarkQuery.matches : false;
    const theme = (savedTheme === 'dark' || savedTheme === 'light')
      ? savedTheme
      : (systemPrefersDark ? 'dark' : 'light');

    setTheme(theme);
  }

  // Toggle theme handler
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
  // ANALYTICS EVENT TRACKING
  // ============================================
  
  function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag === 'function') {
      try {
        gtag('event', eventName, eventParams);
      } catch (err) {
        console.warn('gtag error', err);
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

  // Email and phone
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

  // Contact form analytics tracking (using existing contactForm variable from earlier)
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
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
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
  });

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

  // Section visibility (IntersectionObserver)
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
  // COOKIE CONSENT MANAGEMENT
  // ============================================
  
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
  // SKILL CATEGORY DROPDOWN TOGGLES
  // ============================================
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
  // ACHIEVEMENT CARDS ANIMATION
  // ============================================
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
  // SKILLS TAB SWITCHING
  // ============================================
  const skillsTabButtons = document.querySelectorAll('.skills-tab-btn');
  const skillsCols = document.querySelectorAll('.skills-col');
  
  skillsTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      
      // Update button states
      skillsTabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      
      // Show/hide skill columns
      skillsCols.forEach(col => {
        if (col.id === `skills-${targetTab}`) {
          col.style.display = 'block';
        } else {
          col.style.display = 'none';
        }
      });
    });
  });

  // ============================================
  // INITIALIZATION COMPLETE
  // ============================================
  console.log('Portfolio JavaScript initialized successfully');

  // Dispatch custom event for other scripts
  window.dispatchEvent(new CustomEvent('portfolioReady'));

})();
