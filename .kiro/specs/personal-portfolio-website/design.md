# Design Document

## Overview

The personal portfolio website will be a multi-page static site built with vanilla HTML, CSS, and JavaScript. The core innovation is a JavaScript templating system that dynamically injects common page elements (header, navigation, footer) to eliminate code duplication while maintaining fast load times and simplicity.

## Architecture

### File Structure
```
/
├── index.html (Homepage)
├── about.html
├── experience.html
├── projects.html
├── contact.html
├── css/
│   ├── main.css (Global styles)
│   └── components.css (Component-specific styles)
├── js/
│   ├── template.js (Template system)
│   ├── navigation.js (Navigation logic)
│   └── main.js (Page-specific logic)
└── assets/
    └── images/ (Profile photos, project screenshots)
```

### Template System Architecture
- **Template Loader**: JavaScript module that fetches and injects common HTML structures
- **Component System**: Modular approach where header, nav, and footer are separate components
- **Page Controller**: Manages page-specific content and template assembly
- **State Management**: Simple JavaScript object to track current page and navigation state

## Components and Interfaces

### 1. Template Engine (`template.js`)
```javascript
// Core template system interface
class TemplateEngine {
  loadComponent(componentName, targetElement)
  renderPage(pageConfig)
  setActiveNavigation(currentPage)
}
```

**Responsibilities:**
- Load HTML templates for common components
- Inject components into designated page containers
- Manage component lifecycle and updates
- Handle template variable substitution

### 2. Navigation Component
```html
<!-- Navigation structure -->
<nav class="main-nav">
  <div class="nav-container">
    <div class="nav-brand">[Your Name]</div>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="experience.html">Experience</a></li>
      <li><a href="projects.html">Projects</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
  </div>
</nav>
```

### 3. Page Structure Template
Each HTML page follows this structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Page-specific meta and title -->
</head>
<body>
  <div id="header-container"></div>
  <div id="nav-container"></div>
  <main id="main-content">
    <!-- Page-specific content -->
  </main>
  <div id="footer-container"></div>
  <script src="js/template.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

### 4. Component Loading System
Components are stored as template strings or fetched from separate HTML files:
```javascript
const components = {
  header: `<header class="site-header">...</header>`,
  navigation: `<nav class="main-nav">...</nav>`,
  footer: `<footer class="site-footer">...</footer>`
};
```

## Data Models

### Page Configuration Object
```javascript
const pageConfig = {
  title: "Page Title",
  description: "Page description for meta tags",
  currentPage: "home", // for navigation highlighting
  customCSS: [], // page-specific stylesheets
  customJS: [] // page-specific scripts
};
```

### Navigation State
```javascript
const navigationState = {
  currentPage: "home",
  pages: [
    { name: "Home", url: "index.html", id: "home" },
    { name: "About", url: "about.html", id: "about" },
    { name: "Experience", url: "experience.html", id: "experience" },
    { name: "Projects", url: "projects.html", id: "projects" },
    { name: "Contact", url: "contact.html", id: "contact" }
  ]
};
```

## Error Handling

### Template Loading Errors
- **Fallback Content**: If template loading fails, display basic HTML structure
- **Error Logging**: Console warnings for debugging template issues
- **Graceful Degradation**: Pages remain functional even if templating fails

### Navigation Errors
- **404 Handling**: Redirect to homepage for invalid page requests
- **Broken Links**: Validate navigation links on page load
- **Mobile Navigation**: Ensure navigation works across device sizes

### Performance Considerations
- **Lazy Loading**: Load templates only when needed
- **Caching**: Store loaded templates in memory to avoid repeated requests
- **Minification**: Keep JavaScript and CSS files optimized for production

## Testing Strategy

### Unit Testing Approach
- **Template Engine Tests**: Verify component loading and injection
- **Navigation Tests**: Ensure proper page highlighting and link functionality
- **Cross-browser Tests**: Validate functionality across modern browsers

### Integration Testing
- **Page Load Tests**: Verify complete page assembly with all components
- **Navigation Flow Tests**: Test user journey across all pages
- **Responsive Design Tests**: Ensure layout works on various screen sizes

### Manual Testing Checklist
- [ ] All pages load with consistent header, nav, and footer
- [ ] Navigation highlighting shows current page correctly
- [ ] Content displays properly on desktop and mobile
- [ ] All links work and lead to correct pages
- [ ] Professional appearance suitable for employer review

## Implementation Notes

### JavaScript Template Strategy
The template system will use `innerHTML` injection with sanitized HTML strings. This approach provides:
- Fast rendering without external dependencies
- Simple debugging and maintenance
- Compatibility with all modern browsers
- Easy customization for future enhancements

### CSS Organization
- **Component-based CSS**: Separate styles for header, nav, footer, and content areas
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Professional Styling**: Clean, modern design suitable for professional presentation

### Content Organization
- **Homepage**: Brief introduction and key highlights
- **About**: Personal background and professional summary
- **Experience**: Work history, education, and credentials
- **Projects**: Portfolio of work and accomplishments
- **Contact**: Professional contact information and social links