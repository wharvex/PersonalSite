/**
 * Navigation Logic for Personal Portfolio Website
 * Handles active page highlighting, navigation state tracking, and consistent behavior
 */

/**
 * Navigation Controller
 * Manages navigation state, highlighting, and user interactions
 */
class NavigationController {
  constructor() {
    this.currentPage = this.detectCurrentPage();
    this.navigationItems = [
      { id: 'home', url: 'index.html', title: 'Home' },
      { id: 'about', url: 'about.html', title: 'About' },
      { id: 'experience', url: 'experience.html', title: 'Experience' },
      { id: 'projects', url: 'projects.html', title: 'Projects' },
      { id: 'contact', url: 'contact.html', title: 'Contact' }
    ];
    this.mobileMenuOpen = false;
  }

  /**
   * Detect current page based on URL
   * @returns {string} Current page identifier
   */
  detectCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';

    // Map filenames to page IDs
    const pageMap = {
      'index.html': 'home',
      '': 'home', // Root path
      'about.html': 'about',
      'experience.html': 'experience',
      'projects.html': 'projects',
      'contact.html': 'contact'
    };

    return pageMap[filename] || 'home';
  }

  /**
   * Initialize navigation after DOM is loaded
   */
  init() {
    this.setupEventListeners();
    this.updateActiveNavigation();
    this.setupMobileNavigation();
    this.setupKeyboardNavigation();
  }

  /**
   * Set up event listeners for navigation
   */
  setupEventListeners() {
    // Listen for navigation clicks
    document.addEventListener('click', (event) => {
      const navLink = event.target.closest('.nav-links a');
      if (navLink) {
        this.handleNavigationClick(event, navLink);
      }
    });

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateActiveNavigation();
      }
    });

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', () => {
      this.currentPage = this.detectCurrentPage();
      this.updateActiveNavigation();
    });
  }

  /**
   * Handle navigation link clicks
   * @param {Event} event - Click event
   * @param {HTMLElement} link - Navigation link element
   */
  handleNavigationClick(event, link) {
    const pageId = link.getAttribute('data-page');

    if (pageId) {
      // Update current page state
      this.setCurrentPage(pageId);

      // Close mobile menu if open
      this.closeMobileMenu();

      // Add loading state (optional visual feedback)
      this.addLoadingState(link);
    }
  }

  /**
   * Set current page and update navigation
   * @param {string} pageId - Page identifier
   */
  setCurrentPage(pageId) {
    if (this.navigationItems.find(item => item.id === pageId)) {
      this.currentPage = pageId;
      this.updateActiveNavigation();
    }
  }

  /**
   * Update active navigation highlighting
   */
  updateActiveNavigation() {
    // Remove active class from all navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.classList.remove('active');
      link.setAttribute('aria-current', 'false');
    });

    // Add active class to current page link
    const activeLink = document.querySelector(`.nav-links a[data-page="${this.currentPage}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.setAttribute('aria-current', 'page');
    }

    // Update page title context
    this.updatePageContext();
  }

  /**
   * Update page context information
   */
  updatePageContext() {
    const currentPageInfo = this.navigationItems.find(item => item.id === this.currentPage);
    if (currentPageInfo) {
      // Update document title if not already set
      if (!document.title.includes(currentPageInfo.title)) {
        const siteName = document.querySelector('.site-title')?.textContent || 'Portfolio';
        document.title = `${currentPageInfo.title} - ${siteName}`;
      }
    }
  }

  /**
   * Setup mobile navigation functionality
   */
  setupMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', (event) => {
        event.preventDefault();
        this.toggleMobileMenu();
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (event) => {
        if (this.mobileMenuOpen &&
          !navToggle.contains(event.target) &&
          !navLinks.contains(event.target)) {
          this.closeMobileMenu();
        }
      });

      // Close mobile menu on escape key
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && this.mobileMenuOpen) {
          this.closeMobileMenu();
          navToggle.focus();
        }
      });
    }
  }

  /**
   * Toggle mobile navigation menu
   */
  toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');

    if (navLinks && navToggle) {
      this.mobileMenuOpen = !this.mobileMenuOpen;

      navLinks.classList.toggle('nav-links-active', this.mobileMenuOpen);
      navToggle.classList.toggle('nav-toggle-active', this.mobileMenuOpen);

      // Update ARIA attributes
      navToggle.setAttribute('aria-expanded', this.mobileMenuOpen.toString());

      // Focus management
      if (this.mobileMenuOpen) {
        const firstLink = navLinks.querySelector('a');
        if (firstLink) {
          firstLink.focus();
        }
      }
    }
  }

  /**
   * Close mobile navigation menu
   */
  closeMobileMenu() {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;

      const navLinks = document.querySelector('.nav-links');
      const navToggle = document.querySelector('.nav-toggle');

      if (navLinks && navToggle) {
        navLinks.classList.remove('nav-links-active');
        navToggle.classList.remove('nav-toggle-active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      // Handle arrow key navigation within nav menu
      if (event.target.closest('.nav-links')) {
        this.handleKeyboardNavigation(event);
      }
    });
  }

  /**
   * Handle keyboard navigation within menu
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyboardNavigation(event) {
    const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
    const currentIndex = navLinks.indexOf(event.target);

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % navLinks.length;
        navLinks[nextIndex].focus();
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
        navLinks[prevIndex].focus();
        break;

      case 'Home':
        event.preventDefault();
        navLinks[0].focus();
        break;

      case 'End':
        event.preventDefault();
        navLinks[navLinks.length - 1].focus();
        break;
    }
  }

  /**
   * Add loading state to navigation link
   * @param {HTMLElement} link - Navigation link
   */
  addLoadingState(link) {
    link.classList.add('loading');

    // Remove loading state after a short delay
    setTimeout(() => {
      link.classList.remove('loading');
    }, 300);
  }

  /**
   * Get current page information
   * @returns {Object} Current page data
   */
  getCurrentPageInfo() {
    return this.navigationItems.find(item => item.id === this.currentPage) || this.navigationItems[0];
  }

  /**
   * Navigate to a specific page programmatically
   * @param {string} pageId - Page identifier
   */
  navigateTo(pageId) {
    const pageInfo = this.navigationItems.find(item => item.id === pageId);
    if (pageInfo) {
      window.location.href = pageInfo.url;
    }
  }

  /**
   * Check if a page is the current page
   * @param {string} pageId - Page identifier
   * @returns {boolean} True if current page
   */
  isCurrentPage(pageId) {
    return this.currentPage === pageId;
  }
}

/**
 * Navigation Utilities
 * Helper functions for navigation-related tasks
 */
const NavigationUtils = {
  /**
   * Smooth scroll to top of page
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },

  /**
   * Get breadcrumb for current page
   * @param {string} currentPage - Current page ID
   * @returns {Array} Breadcrumb array
   */
  getBreadcrumb(currentPage) {
    const breadcrumb = [{ title: 'Home', url: 'index.html' }];

    if (currentPage !== 'home') {
      const navController = window.navigationController;
      const pageInfo = navController.getCurrentPageInfo();
      breadcrumb.push({ title: pageInfo.title, url: pageInfo.url });
    }

    return breadcrumb;
  },

  /**
   * Preload next likely pages for better performance
   */
  preloadPages() {
    const commonPages = ['about.html', 'projects.html'];

    commonPages.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    });
  }
};

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.navigationController = new NavigationController();
  window.navigationController.init();

  // Preload common pages
  NavigationUtils.preloadPages();
});

// Export for use in other modules
window.NavigationController = NavigationController;
window.NavigationUtils = NavigationUtils;