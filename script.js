// Decision Matrix Application
class DecisionMatrix {
    constructor() {
        this.options = [];
        this.criteria = [];
        this.ratings = {}; // { optionId: { criterionId: rating } }
        this.weights = {}; // { criterionId: weight }
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromURL();
        
        // If no data loaded from URL, add default items
        if (this.options.length === 0 && this.criteria.length === 0) {
            this.addOption('Option 1');
            this.addOption('Option 2');
            this.addCriterion('Criterion 1', 5);
            this.addCriterion('Criterion 2', 5);
        }
        
        this.render();
    }

    setupEventListeners() {
        document.getElementById('add-option').addEventListener('click', () => {
            this.addOption();
            this.render();
            this.saveToURL();
        });

        document.getElementById('add-criterion').addEventListener('click', () => {
            this.addCriterion();
            this.render();
            this.saveToURL();
        });

        document.getElementById('calculate-btn').addEventListener('click', () => {
            this.calculateResults();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset everything?')) {
                this.reset();
            }
        });

        document.getElementById('share-btn').addEventListener('click', () => {
            this.copyShareLink();
        });
    }

    generateId() {
        return 'id_' + Math.random().toString(36).substring(2, 11);
    }

    addOption(name = '') {
        const id = this.generateId();
        this.options.push({ id, name });
        this.ratings[id] = {};
    }

    removeOption(id) {
        this.options = this.options.filter(opt => opt.id !== id);
        delete this.ratings[id];
        this.render();
        this.saveToURL();
    }

    addCriterion(name = '', weight = 5) {
        const id = this.generateId();
        this.criteria.push({ id, name });
        this.weights[id] = weight;
        
        // Initialize ratings for this criterion
        this.options.forEach(option => {
            if (!this.ratings[option.id]) {
                this.ratings[option.id] = {};
            }
            this.ratings[option.id][id] = 5;
        });
    }

    removeCriterion(id) {
        this.criteria = this.criteria.filter(crit => crit.id !== id);
        delete this.weights[id];
        
        // Remove ratings for this criterion
        Object.keys(this.ratings).forEach(optionId => {
            delete this.ratings[optionId][id];
        });
        
        this.render();
        this.saveToURL();
    }

    updateOptionName(id, name) {
        const option = this.options.find(opt => opt.id === id);
        if (option) {
            option.name = name;
            this.saveToURL();
        }
    }

    updateCriterionName(id, name) {
        const criterion = this.criteria.find(crit => crit.id === id);
        if (criterion) {
            criterion.name = name;
            this.saveToURL();
        }
    }

    updateWeight(criterionId, weight) {
        this.weights[criterionId] = parseFloat(weight) || 0;
        this.saveToURL();
    }

    updateRating(optionId, criterionId, rating) {
        if (!this.ratings[optionId]) {
            this.ratings[optionId] = {};
        }
        this.ratings[optionId][criterionId] = parseFloat(rating) || 0;
        this.saveToURL();
    }

    render() {
        this.renderOptions();
        this.renderCriteria();
        this.renderMatrix();
    }

    renderOptions() {
        const container = document.getElementById('options-container');
        container.innerHTML = '';

        this.options.forEach((option, index) => {
            const div = document.createElement('div');
            div.className = 'option-item';
            div.innerHTML = `
                <input type="text" 
                       value="${option.name || ''}" 
                       placeholder="Option ${index + 1}"
                       data-option-id="${option.id}">
                <button class="btn-remove" data-remove-option="${option.id}">×</button>
            `;
            container.appendChild(div);

            // Add event listeners
            const input = div.querySelector('input');
            input.addEventListener('input', (e) => {
                this.updateOptionName(option.id, e.target.value);
            });

            const removeBtn = div.querySelector('button');
            removeBtn.addEventListener('click', () => {
                if (this.options.length > 1) {
                    this.removeOption(option.id);
                } else {
                    this.showToast('You need at least one option');
                }
            });
        });
    }

    renderCriteria() {
        const container = document.getElementById('criteria-container');
        container.innerHTML = '';

        this.criteria.forEach((criterion, index) => {
            const div = document.createElement('div');
            div.className = 'criterion-item';
            div.innerHTML = `
                <input type="text" 
                       value="${criterion.name || ''}" 
                       placeholder="Criterion ${index + 1}"
                       data-criterion-id="${criterion.id}">
                <span class="weight-label">Weight:</span>
                <input type="number" 
                       min="1" 
                       max="10" 
                       value="${this.weights[criterion.id] || 5}"
                       data-weight-id="${criterion.id}">
                <button class="btn-remove" data-remove-criterion="${criterion.id}">×</button>
            `;
            container.appendChild(div);

            // Add event listeners
            const nameInput = div.querySelector('input[type="text"]');
            nameInput.addEventListener('input', (e) => {
                this.updateCriterionName(criterion.id, e.target.value);
            });

            const weightInput = div.querySelector('input[type="number"]');
            weightInput.addEventListener('input', (e) => {
                this.updateWeight(criterion.id, e.target.value);
            });

            const removeBtn = div.querySelector('button');
            removeBtn.addEventListener('click', () => {
                if (this.criteria.length > 1) {
                    this.removeCriterion(criterion.id);
                } else {
                    this.showToast('You need at least one criterion');
                }
            });
        });
    }

    renderMatrix() {
        const table = document.getElementById('decision-matrix');
        const matrixSection = document.getElementById('matrix-section');

        if (this.options.length === 0 || this.criteria.length === 0) {
            matrixSection.classList.add('hidden');
            return;
        }

        matrixSection.classList.remove('hidden');
        
        let html = '<thead><tr><th>Options / Criteria</th>';
        
        // Header row with criteria
        this.criteria.forEach(criterion => {
            html += `<th>${criterion.name || 'Unnamed'}<br><small class="weight-label">(Weight: ${this.weights[criterion.id]})</small></th>`;
        });
        html += '</tr></thead><tbody>';

        // Data rows
        this.options.forEach(option => {
            html += `<tr><td><strong>${option.name || 'Unnamed'}</strong></td>`;
            
            this.criteria.forEach(criterion => {
                const rating = this.ratings[option.id]?.[criterion.id] || 5;
                html += `<td>
                    <input type="number" 
                           min="1" 
                           max="10" 
                           value="${rating}"
                           data-option-id="${option.id}"
                           data-criterion-id="${criterion.id}">
                </td>`;
            });
            
            html += '</tr>';
        });

        html += '</tbody>';
        table.innerHTML = html;

        // Add event listeners to rating inputs
        table.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', (e) => {
                const optionId = e.target.dataset.optionId;
                const criterionId = e.target.dataset.criterionId;
                this.updateRating(optionId, criterionId, e.target.value);
            });
        });
    }

    calculateResults() {
        if (this.options.length === 0 || this.criteria.length === 0) {
            this.showToast('Please add options and criteria first');
            return;
        }

        const results = [];

        this.options.forEach(option => {
            let totalScore = 0;
            let maxPossibleScore = 0;
            const breakdown = [];

            this.criteria.forEach(criterion => {
                const rating = this.ratings[option.id]?.[criterion.id] || 0;
                const weight = this.weights[criterion.id] || 0;
                const score = rating * weight;
                
                totalScore += score;
                maxPossibleScore += 10 * weight;
                
                breakdown.push({
                    criterion: criterion.name,
                    rating,
                    weight,
                    score
                });
            });

            results.push({
                name: option.name || 'Unnamed',
                totalScore,
                maxPossibleScore,
                percentage: maxPossibleScore > 0 ? (totalScore / maxPossibleScore * 100).toFixed(1) : 0,
                breakdown
            });
        });

        // Sort by total score descending
        results.sort((a, b) => b.totalScore - a.totalScore);

        this.renderResults(results);
        
        // Scroll to results
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    }

    renderResults(results) {
        const container = document.getElementById('results-container');
        const resultsSection = document.getElementById('results-section');
        
        if (results.length === 0) {
            resultsSection.classList.add('hidden');
            return;
        }

        resultsSection.classList.remove('hidden');
        
        let html = '';
        results.forEach((result, index) => {
            html += `
                <div class="result-item">
                    <div>
                        <div class="result-name">${result.name}</div>
                        <div class="result-details">${result.percentage}% of maximum possible score</div>
                    </div>
                    <div class="result-score">${result.totalScore.toFixed(1)}</div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    saveToURL() {
        const data = {
            options: this.options,
            criteria: this.criteria,
            ratings: this.ratings,
            weights: this.weights
        };

        const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
        const url = new URL(window.location.href);
        url.hash = encoded;
        window.history.replaceState(null, '', url.toString());
    }

    loadFromURL() {
        const hash = window.location.hash.slice(1);
        
        if (!hash) {
            return;
        }

        try {
            const decoded = JSON.parse(decodeURIComponent(atob(hash)));
            
            if (decoded.options && Array.isArray(decoded.options)) {
                this.options = decoded.options;
            }
            
            if (decoded.criteria && Array.isArray(decoded.criteria)) {
                this.criteria = decoded.criteria;
            }
            
            if (decoded.ratings && typeof decoded.ratings === 'object') {
                this.ratings = decoded.ratings;
            }
            
            if (decoded.weights && typeof decoded.weights === 'object') {
                this.weights = decoded.weights;
            }
        } catch (error) {
            console.error('Failed to load data from URL:', error);
            this.showToast('Failed to load data from URL');
        }
    }

    reset() {
        this.options = [];
        this.criteria = [];
        this.ratings = {};
        this.weights = {};
        
        // Add default items
        this.addOption('Option 1');
        this.addOption('Option 2');
        this.addCriterion('Criterion 1', 5);
        this.addCriterion('Criterion 2', 5);
        
        this.render();
        this.saveToURL();
        
        // Hide results
        document.getElementById('results-section').classList.add('hidden');
        
        this.showToast('Matrix reset successfully');
    }

    copyShareLink() {
        const url = window.location.href;
        
        // Check if clipboard API is available
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(url).then(() => {
                this.showToast('Share link copied to clipboard!');
            }).catch(() => {
                this.fallbackCopyToClipboard(url);
            });
        } else {
            this.fallbackCopyToClipboard(url);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showToast('Share link copied to clipboard!');
            } else {
                this.showToast('Failed to copy link. Please copy manually from the address bar.');
            }
        } catch (error) {
            this.showToast('Failed to copy link. Please copy manually from the address bar.');
        }
        
        document.body.removeChild(textArea);
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Lazy-loading utility for images and iframes
// This will automatically lazy-load any img or iframe elements with data-src attribute
function initLazyLoading() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const lazyElements = document.querySelectorAll('img[data-src], iframe[data-src]');
        
        if (lazyElements.length === 0) {
            return; // No lazy-loading elements found
        }
        
        const lazyObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Set the actual src from data-src
                    if (element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }
                    
                    // Set srcset if it exists
                    if (element.dataset.srcset) {
                        element.srcset = element.dataset.srcset;
                        element.removeAttribute('data-srcset');
                    }
                    
                    // Remove lazy class and add loaded class
                    element.classList.remove('lazy');
                    element.classList.add('loaded');
                    
                    // Stop observing this element
                    observer.unobserve(element);
                }
            });
        }, {
            // Load elements slightly before they enter viewport
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observe all lazy elements
        lazyElements.forEach(element => {
            lazyObserver.observe(element);
        });
    } else {
        // Fallback for browsers without Intersection Observer support
        // Load all images immediately
        const lazyElements = document.querySelectorAll('img[data-src], iframe[data-src]');
        lazyElements.forEach(element => {
            if (element.dataset.src) {
                element.src = element.dataset.src;
                element.removeAttribute('data-src');
            }
            if (element.dataset.srcset) {
                element.srcset = element.dataset.srcset;
                element.removeAttribute('data-srcset');
            }
            element.classList.remove('lazy');
            element.classList.add('loaded');
        });
    }
}

// Mobile navigation menu toggle
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) {
        return; // Navigation elements not found
    }

    // Toggle menu when hamburger is clicked
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DecisionMatrix();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize lazy-loading for any images or iframes
    // (currently none in the app, but ready for future use)
    initLazyLoading();
});
