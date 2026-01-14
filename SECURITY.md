# Security Enhancements

This document outlines the security measures implemented in the Decision Matrix application to protect user data and enhance overall security.

## Security Headers

### 1. X-Content-Type-Options: nosniff

Prevents browsers from MIME-sniffing a response away from the declared content-type. This helps prevent attacks based on MIME-type confusion.

**Implementation:**
- Meta tag in HTML: `<meta http-equiv="X-Content-Type-Options" content="nosniff">`
- HTTP header (via `.htaccess` or `_headers` file)

### 2. Content-Security-Policy (CSP)

Defines which resources can be loaded and executed, helping prevent XSS (Cross-Site Scripting) attacks.

**Policy Details:**
- `default-src 'self'`: Only load resources from the same origin
- `script-src 'self'`: Only execute scripts from the same origin (no inline scripts)
- `style-src 'self'`: Only apply styles from the same origin (no inline styles except through external files)
- `img-src 'self' data:`: Allow images from same origin and data URIs (for base64 encoded images)
- `font-src 'self'`: Only load fonts from the same origin
- `connect-src 'self'`: Only allow connections (XHR, WebSocket, etc.) to the same origin
- `base-uri 'self'`: Restrict URLs that can be used in the document's `<base>` element
- `form-action 'self'`: Restrict URLs which can be used as form action targets

**Implementation:**
- Meta tag in HTML: `<meta http-equiv="Content-Security-Policy" content="...">`
- HTTP header (via `.htaccess` or `_headers` file)

### 3. X-Frame-Options: SAMEORIGIN

Prevents the page from being embedded in an iframe on a different origin, helping prevent clickjacking attacks.

**Implementation:**
- HTTP header (via `.htaccess` or `_headers` file)

### 4. X-XSS-Protection

Enables the browser's built-in XSS filter to help prevent reflected XSS attacks.

**Implementation:**
- HTTP header (via `.htaccess` or `_headers` file)

### 5. Referrer-Policy

Controls how much referrer information is included with requests.

**Implementation:**
- HTTP header (via `.htaccess` or `_headers` file)

### 6. Permissions-Policy

Controls which browser features and APIs can be used in the application.

**Implementation:**
- HTTP header (via `.htaccess` or `_headers` file)

## Code Structure Security

### No Inline Scripts or Styles

All JavaScript and CSS code has been moved to external files:

1. **JavaScript:**
   - `script.js` - Main application logic
   - `structured-data.js` - Schema.org structured data for SEO

2. **CSS:**
   - `critical.css` - Critical above-the-fold styles
   - `styles.css` - Main stylesheet

**Benefits:**
- Makes Content-Security-Policy more effective
- Easier to audit and maintain code
- Better separation of concerns
- Improved caching

## Server Configuration

### Apache (.htaccess)

For Apache web servers, security headers are configured in the `.htaccess` file:

```apache
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set Content-Security-Policy "..."
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Permissions-Policy "..."
</IfModule>
```

### Netlify/GitHub Pages (_headers)

For Netlify or compatible platforms, headers are configured in the `_headers` file:

```
/*
  X-Content-Type-Options: nosniff
  Content-Security-Policy: ...
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: ...
```

### GitHub Pages with Custom Domain

If using GitHub Pages with a custom domain, you may need to:

1. Use Cloudflare or another CDN/proxy service to add custom headers
2. Or configure headers at the DNS/CDN level

## Privacy Features

The Decision Matrix application is designed with privacy as a core principle:

1. **No Backend**: All data is stored in the URL or browser's localStorage
2. **No Tracking**: No analytics, cookies, or tracking scripts
3. **No External Dependencies**: All resources are served from the same origin
4. **Client-Side Only**: All processing happens in the user's browser
5. **URL-Based Storage**: Data can be easily shared without server involvement

## Testing Security Headers

You can verify that security headers are properly set using online tools:

1. **Security Headers**: https://securityheaders.com
2. **Mozilla Observatory**: https://observatory.mozilla.org
3. **Browser DevTools**: Check Network tab → Response Headers

## Best Practices

1. **Keep Dependencies Updated**: Although this application has no external dependencies, ensure any future additions are kept up-to-date
2. **Regular Security Audits**: Periodically review code for security vulnerabilities
3. **HTTPS Only**: Always serve the application over HTTPS in production
4. **Input Validation**: All user inputs are validated and sanitized
5. **No Eval**: The application does not use `eval()` or similar unsafe functions

## Additional Recommendations

### For Production Deployment:

1. **Use HTTPS**: Ensure your hosting platform provides HTTPS
2. **Enable HSTS**: Add `Strict-Transport-Security` header to force HTTPS
3. **Regular Updates**: Keep your web server software updated
4. **Monitor Logs**: Watch for suspicious activity
5. **Backup Data**: Although this app is client-side only, ensure your hosting platform has backups

### For Enhanced Security:

1. **Subresource Integrity (SRI)**: If you ever use CDNs, implement SRI hashes
2. **Certificate Pinning**: For mobile apps wrapping this web app
3. **Security Scanning**: Use tools like OWASP ZAP or Burp Suite for penetration testing

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. Do not open a public issue
2. Email the repository maintainer directly
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## Compliance

This application follows security best practices and guidelines from:

- OWASP (Open Web Application Security Project)
- Mozilla Web Security Guidelines
- W3C Security and Privacy Guidelines
- GitHub Security Best Practices

## Changelog

- **2024**: Initial security enhancements implemented
  - Removed all inline scripts and styles
  - Added Content-Security-Policy
  - Added X-Content-Type-Options
  - Created server configuration files
  - Documented security measures
