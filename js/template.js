/**
 * Template Engine for Personal Portfolio Website
 * Handles component loading, injection, and template variable substitution
 */
class TemplateEngine {
  constructor() {
    this.components = new Map();
    this.variables = new Map();
  }

  /**
   * Load a component and inject it into the target element
   * @param {string} componentName - Name of the component to load
   * @param {string|HTMLElement} targetElement - Target element selector or element
   * @param {Object} variables - Variables to substitute in the template
   * @returns {Promise<void>}
   */
  async loadComponent(componentName, targetElement, variables = {}) {
    try {
      const component = this.components.get(componentName);
      if (!component) {
        throw new Error(`Component '${componentName}' not found`);
      }

      const target = typeof targetElement === 'string' 
        ? document.querySelector(targetElement)
        : targetElement;

      if (!target) {
        throw new Error(`Target element not found: ${targetElement}`);
      }

      // Substitute variables in the template
      const processedTemplate = this.substituteVariables(component, variables);
      
      // Inject the component
      target.innerHTML = processedTemplate;

      console.log(`Component '${componentName}' loaded successfully`);
    } catch (error) {
      console.error(`Error loading component '${componentName}':`, error);
      // Graceful degradation - don't break the page
    }
  }

  /**
   * Register a component template
   * @param {string} name - Component name
   * @param {string} template - HTML template string
   */
  registerComponent(name, template) {
    this.components.set(name, template);
  }

  /**
   * Set global template variables
   * @param {Object} variables - Variables to set
   */
  setVariables(variables) {
    Object.entries(variables).forEach(([key, value]) => {
      this.variables.set(key, value);
    });
  }

  /**
   * Substitute variables in a template string
   * @param {string} template - Template string with {{variable}} placeholders
   * @param {Object} localVariables - Local variables for this template
   * @returns {string} - Processed template
   */
  substituteVariables(template, localVariables = {}) {
    let result = template;

    // Merge global and local variables (local takes precedence)
    const allVariables = { ...Object.fromEntries(this.variables), ...localVariables };

    // Replace {{variable}} patterns
    Object.entries(allVariables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, value);
    });

    return result;
  }

  /**
   * Render a complete page with all components
   * @param {Object} pageConfig - Page configuration object
   */
  async renderPage(pageConfig) {
    try {
      const { title, description, currentPage, customCSS = [], customJS = [] } = pageConfig;

      // Set page-specific variables
      this.setVariables({
        pageTitle: title,
        pageDescription: description,
        currentPage: currentPage
      });

      // Load components in order
      await this.loadComponent('header', '#header-container', { title });
      await this.loadComponent('navigation', '#nav-container', { currentPage });
      await this.loadComponent('footer', '#footer-container');

      // Update document title if provided
      if (title) {
        document.title = title;
      }

      // Update meta description if provided
      if (description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = description;
      }

      console.log(`Page rendered successfully: ${currentPage}`);
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  }

  /**
   * Set active navigation state
   * @param {string} currentPage - Current page identifier
   */
  setActiveNavigation(currentPage) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to current page link
    const activeLink = document.querySelector(`.nav-links a[data-page="${currentPage}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  /**
   * Initialize the template engine with default components
   */
  init() {
    // This will be called after components are registered
    console.log('Template Engine initialized');
  }
}

// Create global instance
window.templateEngine = new TemplateEngine();
/**
 
* Component Templates
 * HTML templates for header, navigation, and footer components
 */
const ComponentTemplates = {
  header: `
    <header class="site-header">
      <div class="header-container">
        <div class="header-content">
          <h1 class="site-title">{{siteName}}</h1>
          <p class="site-tagline">{{tagline}}</p>
        </div>
      </div>
    </header>
  `,

  navigation: `
    <nav class="main-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <a href="index.html">{{siteName}}</a>
        </div>
        <button class="nav-toggle" aria-label="Toggle navigation">
          <span class="nav-toggle-icon"></span>
        </button>
        <ul class="nav-links">
          <li><a href="index.html" data-page="home" class="{{homeActive}}">Home</a></li>
          <li><a href="about.html" data-page="about" class="{{aboutActive}}">About</a></li>
          <li><a href="experience.html" data-page="experience" class="{{experienceActive}}">Experience</a></li>
          <li><a href="projects.html" data-page="projects" class="{{projectsActive}}">Projects</a></li>
          <li><a href="contact.html" data-page="contact" class="{{contactActive}}">Contact</a></li>
        </ul>
      </div>
    </nav>
  `,

  footer: `
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>{{siteName}}</h3>
            <p>{{footerDescription}}</p>
          </div>
          <div class="footer-section">
            <h4>Quick Links</h4>
            <ul class="footer-links">
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="experience.html">Experience</a></li>
              <li><a href="projects.html">Projects</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Connect</h4>
            <div class="social-links">
              <a href="{{linkedinUrl}}" target="_blank" rel="noopener" aria-label="LinkedIn">LinkedIn</a>
              <a href="{{githubUrl}}" target="_blank" rel="noopener" aria-label="GitHub">GitHub</a>
              <a href="mailto:{{email}}" aria-label="Email">Email</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{currentYear}} {{siteName}}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
};

/**
 * Navigation State Management
 * Manages navigation state and active page highlighting
 */
class NavigationState {
  constructor() {
    this.currentPage = 'home';
    this.pages = [
      { name: 'Home', url: 'index.html', id: 'home' },
      { name: 'About', url: 'about.html', id: 'about' },
      { name: 'Experience', url: 'experience.html', id: 'experience' },
      { name: 'Projects', url: 'projects.html', id: 'projects' },
      { name: 'Contact', url: 'contact.html', id: 'contact' }
    ];
  }

  /**
   * Set the current page
   * @param {string} pageId - Page identifier
   */
  setCurrentPage(pageId) {
    if (this.pages.find(page => page.id === pageId)) {
      this.currentPage = pageId;
    }
  }

  /**
   * Get navigation variables for template substitution
   * @returns {Object} Navigation variables
   */
  getNavigationVariables() {
    const variables = {};
    
    // Set active class for current page, empty string for others
    this.pages.forEach(page => {
      variables[`${page.id}Active`] = this.currentPage === page.id ? 'active' : '';
    });

    return variables;
  }

  /**
   * Get current page information
   * @returns {Object} Current page object
   */
  getCurrentPage() {
    return this.pages.find(page => page.id === this.currentPage) || this.pages[0];
  }
}

/**
 * Component Storage and Retrieval System
 * Enhanced template engine with component management
 */
class ComponentManager extends TemplateEngine {
  constructor() {
    super();
    this.navigationState = new NavigationState();
    this.initializeComponents();
    this.setDefaultVariables();
  }

  /**
   * Initialize all components
   */
  initializeComponents() {
    // Register all component templates
    Object.entries(ComponentTemplates).forEach(([name, template]) => {
      this.registerComponent(name, template);
    });
  }

  /**
   * Set default template variables
   */
  setDefaultVariables() {
    this.setVariables({
      siteName: 'Your Name',
      tagline: 'Professional Portfolio',
      footerDescription: 'Showcasing my professional journey and accomplishments.',
      currentYear: new Date().getFullYear(),
      linkedinUrl: '#',
      githubUrl: '#',
      email: 'your.email@example.com'
    });
  }

  /**
   * Load navigation component with active state
   * @param {string} targetElement - Target element selector
   * @param {string} currentPage - Current page identifier
   */
  async loadNavigation(targetElement, currentPage) {
    this.navigationState.setCurrentPage(currentPage);
    const navVariables = this.navigationState.getNavigationVariables();
    
    await this.loadComponent('navigation', targetElement, navVariables);
    
    // Add mobile navigation toggle functionality
    this.initializeMobileNavigation();
  }

  /**
   * Initialize mobile navigation toggle
   */
  initializeMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-links-active');
        navToggle.classList.toggle('nav-toggle-active');
      });
    }
  }

  /**
   * Enhanced page rendering with navigation state
   * @param {Object} pageConfig - Page configuration
   */
  async renderPage(pageConfig) {
    const { currentPage } = pageConfig;
    
    // Set navigation state
    this.navigationState.setCurrentPage(currentPage);
    
    // Load header
    await this.loadComponent('header', '#header-container');
    
    // Load navigation with active state
    await this.loadNavigation('#nav-container', currentPage);
    
    // Load footer
    await this.loadComponent('footer', '#footer-container');

    // Update document title and meta
    if (pageConfig.title) {
      document.title = `${pageConfig.title} - ${this.variables.get('siteName')}`;
    }

    console.log(`Page rendered with navigation state: ${currentPage}`);
  }
}

// Replace the global instance with the enhanced component manager
window.templateEngine = new ComponentManager();
window.ComponentManager = ComponentManager;