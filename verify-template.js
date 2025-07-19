/**
 * Verification script for template system functionality
 * Tests the homepage template system implementation
 */

// Test configuration
const testConfig = {
    title: "Home",
    description: "Personal portfolio website showcasing accomplishments, credentials, and professional background",
    currentPage: "home"
};

// Test functions
const tests = {
    /**
     * Test 1: Verify template engine is available
     */
    testTemplateEngineAvailable() {
        console.log('🧪 Testing: Template engine availability');
        
        if (typeof window.templateEngine !== 'undefined' && window.templateEngine) {
            console.log('✅ Template engine is available');
            return true;
        } else {
            console.error('❌ Template engine is not available');
            return false;
        }
    },

    /**
     * Test 2: Verify components are registered
     */
    testComponentsRegistered() {
        console.log('🧪 Testing: Component registration');
        
        const requiredComponents = ['header', 'navigation', 'footer'];
        let allRegistered = true;
        
        requiredComponents.forEach(component => {
            if (window.templateEngine.components && window.templateEngine.components.has(component)) {
                console.log(`✅ Component '${component}' is registered`);
            } else {
                console.error(`❌ Component '${component}' is not registered`);
                allRegistered = false;
            }
        });
        
        return allRegistered;
    },

    /**
     * Test 3: Verify page rendering functionality
     */
    async testPageRendering() {
        console.log('🧪 Testing: Page rendering functionality');
        
        try {
            await window.templateEngine.renderPage(testConfig);
            console.log('✅ Page rendering completed successfully');
            return true;
        } catch (error) {
            console.error('❌ Page rendering failed:', error);
            return false;
        }
    },

    /**
     * Test 4: Verify component injection
     */
    testComponentInjection() {
        console.log('🧪 Testing: Component injection');
        
        const containers = [
            { id: 'header-container', name: 'header' },
            { id: 'nav-container', name: 'navigation' },
            { id: 'footer-container', name: 'footer' }
        ];
        
        let allInjected = true;
        
        containers.forEach(container => {
            const element = document.getElementById(container.id);
            if (element && element.innerHTML.trim() !== '') {
                console.log(`✅ ${container.name} component injected successfully`);
            } else {
                console.error(`❌ ${container.name} component not injected`);
                allInjected = false;
            }
        });
        
        return allInjected;
    },

    /**
     * Test 5: Verify active navigation state
     */
    testActiveNavigationState() {
        console.log('🧪 Testing: Active navigation state');
        
        // Set active navigation
        window.templateEngine.setActiveNavigation('home');
        
        // Check if home link is active
        const activeLink = document.querySelector('.nav-links a[data-page="home"]');
        if (activeLink && activeLink.classList.contains('active')) {
            console.log('✅ Active navigation state set correctly');
            return true;
        } else {
            console.error('❌ Active navigation state not set correctly');
            return false;
        }
    }
};

/**
 * Run all tests
 */
async function runTests() {
    console.log('🚀 Starting template system verification tests...\n');
    
    const results = [];
    
    // Test 1: Template engine availability
    results.push(tests.testTemplateEngineAvailable());
    
    // Test 2: Component registration
    results.push(tests.testComponentsRegistered());
    
    // Test 3: Page rendering
    results.push(await tests.testPageRendering());
    
    // Test 4: Component injection
    results.push(tests.testComponentInjection());
    
    // Test 5: Active navigation state
    results.push(tests.testActiveNavigationState());
    
    // Summary
    const passedTests = results.filter(result => result === true).length;
    const totalTests = results.length;
    
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Template system is working correctly.');
    } else {
        console.log('⚠️ Some tests failed. Please check the implementation.');
    }
    
    return passedTests === totalTests;
}

// Export for use in browser console or other scripts
if (typeof window !== 'undefined') {
    window.verifyTemplateSystem = runTests;
}

// Auto-run if loaded in a page context
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for template system to initialize
        setTimeout(runTests, 1000);
    });
}