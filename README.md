# Decision Matrix

A simple, lightweight decision matrix tool to help you make better decisions by comparing multiple options against weighted criteria. All data is stored in the URL, making it easy to share and completely privacy-focused with no backend or tracking.

## 🎯 Purpose

Decision Matrix helps you make informed decisions for:
- Business choices and project prioritization
- Product comparisons and vendor selection
- Career decisions and opportunity evaluation
- Personal life choices
- Team decision-making and collaboration

## ✨ Features

- **Simple & Intuitive Interface**: Clean, minimalist design focused on usability
- **URL-Based Storage**: All data is encoded in the URL - no databases, no sign-ups, complete privacy
- **Easy Sharing**: Share your decision matrix with others via a simple link
- **Weighted Criteria**: Assign importance weights (1-10) to different criteria
- **Automatic Calculation**: Instantly calculate and rank options based on weighted scores
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **No Dependencies**: Built with vanilla HTML, CSS, and JavaScript - fast and lightweight
- **SEO Optimized**: Comprehensive meta tags, structured data, and social media integration for better discoverability

## 🚀 Live Demo

Visit the live website: [https://mrmichel93.github.io/DecisionMatrix/](https://mrmichel93.github.io/DecisionMatrix/)

## 📖 How to Use

1. **Add Your Options**: Enter the choices you're comparing (e.g., "Job Offer A", "Job Offer B")
2. **Define Criteria**: Add the factors important to your decision (e.g., "Salary", "Work-Life Balance", "Growth Opportunities")
3. **Set Weights**: Assign importance weights (1-10) to each criterion - higher numbers mean more important
4. **Rate Options**: Score each option (1-10) for each criterion
5. **Calculate Results**: Click "Calculate Results" to see which option scores highest
6. **Share**: Use the "Copy Share Link" button to share your decision matrix with others

## 🛠️ Deployment to GitHub Pages

For detailed deployment instructions including security header configuration for different hosting platforms, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Start - GitHub Pages

### Method 1: Using GitHub Web Interface

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select the branch you want to deploy (usually `main` or `master`)
4. Select the root folder `/` as the source
5. Click "Save"
6. Your site will be published at `https://[username].github.io/DecisionMatrix/`

### Method 2: Using Command Line

1. Make sure your code is pushed to the main branch:
   ```bash
   git add .
   git commit -m "Deploy Decision Matrix"
   git push origin main
   ```

2. Enable GitHub Pages from repository settings as described in Method 1

### Local Development

To test locally, simply open `index.html` in your web browser. No build process or local server required!

Alternatively, you can use a simple HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 🏗️ Technical Details

- **Pure Vanilla JavaScript**: No frameworks or libraries
- **URL Encoding**: Uses Base64 encoding to store state in URL hash
- **Responsive CSS**: Mobile-first design with CSS Grid and Flexbox
- **Modern Browser Support**: Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- **Security Hardened**: 
  - No inline scripts or styles (all code in external files)
  - Content-Security-Policy headers to prevent XSS attacks
  - X-Content-Type-Options to prevent MIME-sniffing
  - Additional security headers (X-Frame-Options, Referrer-Policy, etc.)
  - See [SECURITY.md](SECURITY.md) for complete security documentation
- **SEO Optimized**: Comprehensive meta tags, Open Graph, Twitter Cards, and Schema.org structured data
- **Performance Optimizations**: 
  - Minified HTML, CSS, and JavaScript files for reduced load times
  - Critical CSS in separate file for above-the-fold content
  - Lazy-loading support for images and iframes (ready for future use)
  - No external dependencies for maximum performance

## 📦 Performance Optimizations

This project implements several performance optimizations to ensure fast load times:

### 1. **Minified Files**
All production files are minified to reduce file sizes:
- `styles.min.css` - Minified CSS (23% smaller)
- `script.min.js` - Minified JavaScript (4% smaller, comments and blank lines removed)
- `index.min.html` - Minified HTML (20% smaller)

### 2. **Critical CSS**
Above-the-fold styles are inlined in the HTML `<head>` to enable instant rendering of visible content without waiting for external CSS files. Non-critical CSS is loaded asynchronously.

### 3. **Lazy-Loading**
The application includes built-in lazy-loading functionality for images and iframes:
- Uses the Intersection Observer API for efficient lazy-loading
- Loads assets only when they're about to enter the viewport
- Includes a fallback for browsers without Intersection Observer support
- Prevents layout shift with placeholder styles

**How to use lazy-loading:**
To add lazy-loaded images or iframes to your page:
```html
<!-- For images -->
<img class="lazy" data-src="path/to/image.jpg" alt="Description">

<!-- For iframes -->
<iframe class="lazy" data-src="path/to/content.html"></iframe>
```

The lazy-loading script will automatically detect and handle these elements.

### 4. **Privacy-Focused**
All optimizations maintain the privacy-first approach - no external scripts, no tracking, no CDNs.

## 📁 Project Structure

```
DecisionMatrix/
├── index.html          # Main HTML structure (optimized with security headers and SEO)
├── index.min.html      # Fully minified HTML
├── privacy.html        # Comprehensive privacy policy page with technical examples
├── styles.css          # All styling and responsive design
├── styles.min.css      # Minified CSS
├── critical.css        # Critical above-the-fold CSS (external file)
├── script.js           # Application logic with privacy-focused comments
├── script.min.js       # Minified JavaScript
├── structured-data.js  # Schema.org structured data (external file for security)
├── .htaccess           # Apache server security headers configuration
├── _headers            # Netlify/GitHub Pages security headers configuration
├── minify.sh           # Script to regenerate minified files
├── PERFORMANCE.md      # Detailed performance optimization guide
├── SEO.md              # SEO optimization guide and best practices
├── SECURITY.md         # Security enhancements and best practices documentation
└── README.md           # This file
```

## 🔧 Maintenance

When you make changes to the source files, regenerate the minified versions:

```bash
./minify.sh
```

This script will automatically update all minified files and show you the file size comparisons.

For detailed information about the performance optimizations, see [PERFORMANCE.md](PERFORMANCE.md).

For SEO best practices and optimization details, see [SEO.md](SEO.md).

## 🔒 Privacy

**Decision Matrix is 100% privacy-friendly.** All data remains in your browser - nothing is sent to any server. Your decision-making process is completely private.

### Privacy Features:
- ❌ No data collection or tracking
- ❌ No analytics, cookies, or third-party services  
- ❌ No user accounts or sign-ups required
- ✅ All data stored locally in your browser only
- ✅ URL-based encoding for easy sharing (your choice)
- ✅ Optional browser localStorage (stays on your device)

**Read our comprehensive [Privacy Policy](privacy.html)** with detailed technical implementation examples showing exactly how we protect your privacy.

## 🔐 Security

This application implements multiple security measures to protect users:
- Content-Security-Policy headers to prevent XSS attacks
- No inline scripts or styles
- X-Content-Type-Options to prevent MIME-sniffing
- Additional security headers for enhanced protection

For complete security documentation, see [SECURITY.md](SECURITY.md).

## 📄 License

This project is open source and available for anyone to use, modify, and distribute.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

## 💡 Tips

- Use clear, descriptive names for options and criteria
- Be honest with your ratings - the matrix is only as good as your input
- Higher weights (8-10) should be reserved for truly critical criteria
- Share links with team members for collaborative decision-making
- Bookmark your important decisions for future reference
