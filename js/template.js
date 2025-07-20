/**
 * Simple Template Engine for Personal Portfolio Website
 * Handles component loading and template variable substitution
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
   */
  loadComponent(componentName, targetElement, variables = {}) {
    try {
      const component = this.components.get(componentName);
      if (!component) {
        console.warn(`Component '${componentName}' not found`);
        return;
      }

      const target = typeof targetElement === 'string'
        ? document.querySelector(targetElement)
        : targetElement;

      if (!target) {
        console.warn(`Target element not found: ${targetElement}`);
        return;
      }

      // Substitute variables in the template
      const processedTemplate = this.substituteVariables(component, variables);

      // Inject the component
      target.innerHTML = processedTemplate;

    } catch (error) {
      console.error(`Error loading component '${componentName}':`, error);
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
  renderPage(pageConfig) {
    const { title, description, currentPage } = pageConfig;

    // Set page-specific variables
    this.setVariables({
      pageTitle: title,
      pageDescription: description,
      currentPage: currentPage
    });

    // Load components
    this.loadComponent('header', '#header-container');
    this.loadComponent('navigation', '#nav-container', { currentPage });
    this.loadComponent('footer', '#footer-container');

    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }
  }
}

/**
 * Component Templates
 */
const ComponentTemplates = {
  header: `
    <header class="site-header">
      <div class="header-container">
        <div class="header-content">
          <h1 class="site-title">{{siteName}}</h1>
          <p class="site-tagline">{{tagline}}</p>
        </div>
        <div class="header-social">
          <div class="sine-wave">
            <svg width="80" height="50" viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,25 Q5,23 10,25 Q15,27 20,25 Q25,22 30,25 Q35,28 40,25 Q45,20 50,25 Q55,30 60,25 Q65,18 70,25 Q75,32 80,25" 
                    stroke="#3498db" stroke-width="1.5" fill="none" opacity="0.7"/>
            </svg>
          </div>
          <div class="social-column">
            <a href="{{githubUrl}}" target="_blank" rel="noopener" aria-label="GitHub" class="social-link">
              <span class="social-icon">GitHub</span>
            </a>
          </div>
          <div class="social-column">
            <a href="{{linkedinUrl}}" target="_blank" rel="noopener" aria-label="LinkedIn" class="social-link">
              <span class="social-icon">LinkedIn</span>
            </a>
            <a href="{{indeedUrl}}" target="_blank" rel="noopener" aria-label="Indeed" class="social-link">
              <span class="social-icon">Indeed</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  `,

  navigation: `
    <nav class="main-nav">
      <div class="nav-container">
        <button class="nav-toggle" aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
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
 * Simple Component Manager
 */
class ComponentManager extends TemplateEngine {
  constructor() {
    super();
    this.currentPage = 'home';
    this.initializeComponents();
    this.setDefaultVariables();
  }

  /**
   * Initialize all components
   */
  initializeComponents() {
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
      indeedUrl: '#',
      email: 'your.email@example.com'
    });
  }

  /**
   * Load navigation with active page highlighting
   * @param {string} targetElement - Target element selector
   * @param {string} currentPage - Current page identifier
   */
  loadNavigation(targetElement, currentPage) {
    this.currentPage = currentPage;

    // Set active navigation variables
    const pages = ['home', 'about', 'experience', 'projects', 'contact'];
    const navVariables = {};

    pages.forEach(page => {
      navVariables[`${page}Active`] = currentPage === page ? 'active' : '';
    });

    this.loadComponent('navigation', targetElement, navVariables);

    // Initialize mobile navigation
    setTimeout(() => this.initializeMobileNavigation(), 100);
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
   * Render page with navigation state
   * @param {Object} pageConfig - Page configuration
   */
  renderPage(pageConfig) {
    const { currentPage, title, description } = pageConfig;

    // Set page variables
    this.setVariables({
      pageTitle: title,
      pageDescription: description,
      currentPage: currentPage
    });

    // Load components
    this.loadComponent('header', '#header-container');
    this.loadNavigation('#nav-container', currentPage);
    this.loadComponent('footer', '#footer-container');

    // Update page metadata
    if (title) {
      const siteName = this.variables.get('siteName') || 'Portfolio Website';
      document.title = `${title} - ${siteName}`;
    }

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }
  }
}

// Create global instance
window.templateEngine = new ComponentManager();