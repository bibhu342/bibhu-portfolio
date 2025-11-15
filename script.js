/**
 * Portfolio JavaScript
 * Bibhudendu Behera - Customer Experience Leader & AI Engineer
 * Main functionality for interactive features
 */

(function() {
  'use strict';

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
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle, .nav-toggle, .menu-toggle');
  const navMenu = document.querySelector('.nav-menu, .nav-links, .primary-nav');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      // Update ARIA attributes
      const isExpanded = navMenu.classList.contains('active');
      mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a, .nav-links a, .primary-nav a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

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
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"], .nav-links a[href^="#"]');

  function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
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
        
        // Check if form has Netlify attribute
        if (contactForm.hasAttribute('data-netlify')) {
          const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
          });
          
          if (response.ok) {
            showNotification('Message sent successfully! I will get back to you soon.', 'success');
            contactForm.reset();
          } else {
            throw new Error('Form submission failed');
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
    const target = parseInt(element.dataset.target || element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };
    
    updateCounter();
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // Fix achievement counter animation - target achievement-metric elements
  document.querySelectorAll('.achievement-metric[data-target], .counter[data-target], [data-target]').forEach(counter => {
    const target = counter.dataset.target || counter.getAttribute('data-target');
    if (target && !isNaN(parseInt(target))) {
      // Initialize counter to 0 if it's not already set
      if (!counter.textContent.trim() || counter.textContent.trim() === '0') {
        counter.textContent = '0';
      }
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
  // INITIALIZATION COMPLETE
  // ============================================
  console.log('Portfolio JavaScript initialized successfully');

  // Dispatch custom event for other scripts
  window.dispatchEvent(new CustomEvent('portfolioReady'));

})();
