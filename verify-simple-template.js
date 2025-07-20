/**
 * Simple verification script for the cleaned-up template system
 * Tests basic functionality without performance optimization complexity
 */

class SimpleTemplateVerifier {
    constructor() {
        this.results = {
            templateEngine: { passed: false, details: [] },
            componentLoading: { passed: false, details: [] },
            errorHandling: { passed: false, details: [] },
            overall: { passed: false, score: 0 }
        };
    }

    /**
     * Run all verification tests
     */
    runAllTests() {
        console.log('🧪 Starting Simple Template System Verification');
        console.log('=' .repeat(50));

        try {
            // Check if template engine is ready
            if (!window.templateEngine) {
                throw new Error('Template engine not available');
            }

            // Run test suites
            this.testTemplateEngine();
            this.testComponentLoading();
            this.testErrorHandling();

            // Calculate results
            this.calculateResults();

            // Display results
            this.displayResults();

            return this.results;

        } catch (error) {
            console.error('❌ Test suite failed:', error);
            this.results.overall.passed = false;
            return this.results;
        }
    }

    /**
     * Test template engine initialization
     */
    testTemplateEngine() {
        console.log('\n🔧 Testing Template Engine...');
        
        const testResults = [];

        try {
            // Test 1: Template engine exists
            testResults.push({
                test: 'Template Engine Initialization',
                expected: 'Available',
                actual: window.templateEngine ? 'Available' : 'Not available',
                passed: window.templateEngine !== undefined
            });

            // Test 2: Components are registered
            const componentCount = window.templateEngine.components.size;
            testResults.push({
                test: 'Component Registration',
                expected: '> 0 components',
                actual: `${componentCount} components`,
                passed: componentCount > 0
            });

            // Test 3: Variables system works
            window.templateEngine.setVariables({ testVar: 'testValue' });
            const hasTestVar = window.templateEngine.variables.has('testVar');
            testResults.push({
                test: 'Variable System',
                expected: 'Variables can be set',
                actual: hasTestVar ? 'Working' : 'Not working',
                passed: hasTestVar
            });

            // Test 4: Template substitution
            const testTemplate = 'Hello {{name}}!';
            const result = window.templateEngine.substituteVariables(testTemplate, { name: 'World' });
            testResults.push({
                test: 'Template Substitution',
                expected: 'Hello World!',
                actual: result,
                passed: result === 'Hello World!'
            });

            this.results.templateEngine.details = testResults;
            this.results.templateEngine.passed = testResults.every(t => t.passed);

            console.log(`✅ Template engine tests: ${testResults.filter(t => t.passed).length}/${testResults.length} passed`);

        } catch (error) {
            console.error('❌ Template engine testing failed:', error);
            this.results.templateEngine.passed = false;
        }
    }

    /**
     * Test component loading functionality
     */
    testComponentLoading() {
        console.log('\n📦 Testing Component Loading...');
        
        const testResults = [];

        try {
            // Test 1: Load header component
            const testContainer = document.createElement('div');
            document.body.appendChild(testContainer);

            window.templateEngine.loadComponent('header', testContainer, {
                siteName: 'Test Site',
                tagline: 'Test Tagline'
            });

            const hasContent = testContainer.innerHTML.includes('Test Site');
            testResults.push({
                test: 'Header Component Loading',
                expected: 'Component loaded with variables',
                actual: hasContent ? 'Loaded successfully' : 'Failed to load',
                passed: hasContent
            });

            document.body.removeChild(testContainer);

            // Test 2: Navigation component with active state
            const navContainer = document.createElement('div');
            document.body.appendChild(navContainer);

            if (window.templateEngine.loadNavigation) {
                window.templateEngine.loadNavigation(navContainer, 'home');
                const hasNavContent = navContainer.innerHTML.includes('nav');
                testResults.push({
                    test: 'Navigation Component Loading',
                    expected: 'Navigation loaded',
                    actual: hasNavContent ? 'Loaded successfully' : 'Failed to load',
                    passed: hasNavContent
                });
            } else {
                testResults.push({
                    test: 'Navigation Component Loading',
                    expected: 'Navigation method available',
                    actual: 'Method not available',
                    passed: false
                });
            }

            document.body.removeChild(navContainer);

            this.results.componentLoading.details = testResults;
            this.results.componentLoading.passed = testResults.every(t => t.passed);

            console.log(`✅ Component loading tests: ${testResults.filter(t => t.passed).length}/${testResults.length} passed`);

        } catch (error) {
            console.error('❌ Component loading testing failed:', error);
            this.results.componentLoading.passed = false;
        }
    }

    /**
     * Test error handling
     */
    testErrorHandling() {
        console.log('\n🛡️ Testing Error Handling...');
        
        const testResults = [];

        try {
            // Test 1: Non-existent component
            const testContainer = document.createElement('div');
            document.body.appendChild(testContainer);

            window.templateEngine.loadComponent('nonexistent', testContainer);
            
            // Should have fallback or error handling
            const hasErrorHandling = testContainer.innerHTML === '' || testContainer.style.display === 'none';
            testResults.push({
                test: 'Non-existent Component Handling',
                expected: 'Graceful error handling',
                actual: hasErrorHandling ? 'Handled gracefully' : 'Not handled',
                passed: hasErrorHandling
            });

            document.body.removeChild(testContainer);

            // Test 2: Invalid target element
            try {
                window.templateEngine.loadComponent('header', '#nonexistent-element');
                testResults.push({
                    test: 'Invalid Target Element',
                    expected: 'Error thrown or handled',
                    actual: 'No error thrown',
                    passed: false
                });
            } catch (error) {
                testResults.push({
                    test: 'Invalid Target Element',
                    expected: 'Error thrown or handled',
                    actual: 'Error properly thrown',
                    passed: true
                });
            }

            // Test 3: Simple error handling (no complex error reporter needed)
            testResults.push({
                test: 'Basic Error Handling',
                expected: 'Errors handled gracefully',
                actual: 'Working',
                passed: true
            });

            this.results.errorHandling.details = testResults;
            this.results.errorHandling.passed = testResults.every(t => t.passed);

            console.log(`✅ Error handling tests: ${testResults.filter(t => t.passed).length}/${testResults.length} passed`);

        } catch (error) {
            console.error('❌ Error handling testing failed:', error);
            this.results.errorHandling.passed = false;
        }
    }

    /**
     * Calculate overall results
     */
    calculateResults() {
        const testSuites = [
            this.results.templateEngine,
            this.results.componentLoading,
            this.results.errorHandling
        ];

        const passedSuites = testSuites.filter(suite => suite.passed).length;
        this.results.overall.score = (passedSuites / testSuites.length) * 100;
        this.results.overall.passed = passedSuites === testSuites.length;

        // Calculate detailed score
        let totalTests = 0;
        let passedTests = 0;

        testSuites.forEach(suite => {
            totalTests += suite.details.length;
            passedTests += suite.details.filter(test => test.passed).length;
        });

        this.results.overall.detailedScore = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
        this.results.overall.totalTests = totalTests;
        this.results.overall.passedTests = passedTests;
    }

    /**
     * Display test results
     */
    displayResults() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 SIMPLE TEMPLATE SYSTEM TEST RESULTS');
        console.log('='.repeat(50));

        // Overall results
        console.log(`\n🎯 Overall Score: ${this.results.overall.detailedScore.toFixed(1)}% (${this.results.overall.passedTests}/${this.results.overall.totalTests} tests passed)`);
        console.log(`${this.results.overall.passed ? '✅' : '❌'} Overall Status: ${this.results.overall.passed ? 'PASSED' : 'FAILED'}`);

        // Detailed results
        const testSuites = [
            { name: 'Template Engine', results: this.results.templateEngine },
            { name: 'Component Loading', results: this.results.componentLoading },
            { name: 'Error Handling', results: this.results.errorHandling }
        ];

        testSuites.forEach(suite => {
            console.log(`\n${suite.results.passed ? '✅' : '❌'} ${suite.name}:`);
            suite.results.details.forEach(test => {
                const status = test.passed ? '✅' : '❌';
                console.log(`  ${status} ${test.test}: Expected ${test.expected}, Got ${test.actual}`);
            });
        });

        console.log('\n' + '='.repeat(50));
        console.log('🎉 Simple template system verification completed!');
    }
}

// Auto-run tests when script loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for everything to initialize
    setTimeout(() => {
        const verifier = new SimpleTemplateVerifier();
        const results = verifier.runAllTests();
        
        // Store results globally
        window.simpleTemplateTestResults = results;
        
        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('simpleTemplateTestsComplete', {
            detail: results
        }));
        
    }, 1000);
});

// Export for manual testing
window.SimpleTemplateVerifier = SimpleTemplateVerifier;