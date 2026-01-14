# Deployment Guide for Security Headers

This guide explains how to deploy the Decision Matrix application with proper security headers on different hosting platforms.

## Overview

The application now includes security enhancements that require proper HTTP headers. These headers are configured in different files depending on your hosting platform.

## Deployment Options

### 1. GitHub Pages (Current Deployment)

GitHub Pages has limited support for custom HTTP headers. The application uses meta tags in the HTML for some security headers:

**What's automatically included:**
- `X-Content-Type-Options: nosniff` (via meta tag)
- `Content-Security-Policy` (via meta tag)

**Limitations:**
- GitHub Pages doesn't support custom HTTP headers from `_headers` file
- Some headers like `X-Frame-Options` and `Referrer-Policy` cannot be set via meta tags

**Recommended Enhancement:**
Use Cloudflare (free plan) in front of GitHub Pages to add additional security headers:

1. Set up Cloudflare for your domain
2. Add these Transform Rules in Cloudflare:
   ```
   X-Frame-Options: SAMEORIGIN
   X-XSS-Protection: 1; mode=block
   Referrer-Policy: strict-origin-when-cross-origin
   Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   ```

### 2. Netlify

Netlify supports the `_headers` file for custom HTTP headers.

**Deployment Steps:**

1. Deploy your repository to Netlify
2. The `_headers` file in the repository root will be automatically recognized
3. Netlify will apply all security headers defined in `_headers`

**File:** `_headers` (already included in the repository)

**Verification:**
```bash
curl -I https://your-site.netlify.app
```

### 3. Vercel

Vercel uses `vercel.json` for configuration. Create this file:

**Create `vercel.json`:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self';"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=(), payment=()"
        }
      ]
    }
  ]
}
```

### 4. Apache Server (Self-Hosted)

If you're hosting on an Apache server, the `.htaccess` file is already configured.

**File:** `.htaccess` (already included in the repository)

**Requirements:**
- `mod_headers` must be enabled
- `.htaccess` files must be allowed (AllowOverride)

**Enable mod_headers:**
```bash
sudo a2enmod headers
sudo systemctl restart apache2
```

**Verification:**
```bash
curl -I https://your-domain.com
```

### 5. Nginx Server (Self-Hosted)

For Nginx, add this to your server configuration:

**Create/Edit:** `/etc/nginx/sites-available/your-site`

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/decision-matrix;
    index index.html;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self';" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=()" always;

    # HTTPS redirect (if using SSL)
    # return 301 https://$server_name$request_uri;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Apply changes:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Cloudflare Pages

Cloudflare Pages supports `_headers` file similar to Netlify.

**Deployment Steps:**
1. Connect your repository to Cloudflare Pages
2. The `_headers` file will be automatically recognized
3. All security headers will be applied

### 7. Firebase Hosting

For Firebase Hosting, add headers to `firebase.json`:

**Create/Edit `firebase.json`:**
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "Content-Security-Policy",
            "value": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self';"
          },
          {
            "key": "X-Frame-Options",
            "value": "SAMEORIGIN"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          },
          {
            "key": "Permissions-Policy",
            "value": "geolocation=(), microphone=(), camera=(), payment=()"
          }
        ]
      }
    ]
  }
}
```

**Deploy:**
```bash
firebase deploy
```

## Testing Security Headers

### Using curl
```bash
curl -I https://your-domain.com
```

Look for headers like:
```
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'; ...
X-Frame-Options: SAMEORIGIN
```

### Using Browser DevTools

1. Open your site in Chrome/Firefox
2. Open DevTools (F12)
3. Go to Network tab
4. Refresh the page
5. Click on the first request (your HTML file)
6. Check the "Headers" section → "Response Headers"

### Online Security Scanners

Test your deployment with these free tools:

1. **Security Headers**: https://securityheaders.com
   - Enter your URL
   - Get a grade (aim for A or A+)

2. **Mozilla Observatory**: https://observatory.mozilla.org
   - Comprehensive security scan
   - Provides recommendations

3. **SSL Labs**: https://www.ssllabs.com/ssltest/
   - Test HTTPS configuration
   - Check certificate validity

## Common Issues and Solutions

### Issue: CSP Blocking Resources

**Symptom:** Console shows CSP violation errors

**Solution:** 
- Check if you're loading resources from external domains
- This application should work with strict CSP as all resources are self-hosted
- If you added external resources, update the CSP policy accordingly

### Issue: Headers Not Applied

**Symptom:** curl/browser doesn't show security headers

**Solutions:**
1. **GitHub Pages**: Use Cloudflare or switch to Netlify
2. **Apache**: Ensure mod_headers is enabled and .htaccess is allowed
3. **Nginx**: Ensure configuration is reloaded
4. **Netlify/Vercel**: Check build logs for errors

### Issue: MIME Type Errors

**Symptom:** CSS/JS not loading, console shows MIME type errors

**Solution:**
- Ensure X-Content-Type-Options is set correctly
- Check that files are served with correct Content-Type
- Verify file extensions are correct (.js, .css, .html)

## HTTPS Configuration

For production deployments, always use HTTPS. Most modern hosting platforms provide free SSL certificates:

- **GitHub Pages**: Automatic HTTPS with custom domains
- **Netlify/Vercel**: Automatic HTTPS with Let's Encrypt
- **Cloudflare Pages**: Automatic HTTPS
- **Self-hosted**: Use Let's Encrypt with Certbot

### Let's Encrypt Setup (Self-Hosted)

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-apache  # For Apache
# or
sudo apt-get install certbot python3-certbot-nginx   # For Nginx

# Get certificate
sudo certbot --apache  # For Apache
# or
sudo certbot --nginx   # For Nginx

# Auto-renewal is configured automatically
```

## Best Practices

1. **Always use HTTPS** in production
2. **Test thoroughly** after deployment
3. **Monitor security headers** using automated tools
4. **Keep configurations up-to-date** with security best practices
5. **Review CSP violations** in browser console during development
6. **Use strict CSP** - avoid 'unsafe-inline' and 'unsafe-eval'

## Additional Resources

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [Security Headers Guide](https://securityheaders.com/)

## Support

For issues specific to this application's security configuration, please open an issue on GitHub.
