// Structured Data (Schema.org JSON-LD)
// This script adds structured data to improve SEO and search engine understanding
(function() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Decision Matrix",
        "applicationCategory": "BusinessApplication",
        "description": "Free online decision matrix tool to compare options and make better choices using weighted criteria evaluation.",
        "url": "https://mrmichel93.github.io/DecisionMatrix/",
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "softwareVersion": "1.0",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "URL-based storage for privacy",
            "Weighted criteria comparison",
            "Automatic calculation and ranking",
            "Easy sharing via link",
            "No sign-up required",
            "Works offline",
            "Responsive design"
        ],
        "creator": {
            "@type": "Organization",
            "name": "Decision Matrix"
        }
    };

    // Create and inject the script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
})();
