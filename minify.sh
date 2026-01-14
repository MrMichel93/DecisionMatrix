#!/bin/bash
# Script to regenerate minified files for the Decision Matrix application
# Usage: ./minify.sh

echo "Minifying Decision Matrix files..."
echo ""

# Check if files exist
if [ ! -f "styles.css" ] || [ ! -f "script.js" ] || [ ! -f "index.html" ] || [ ! -f "structured-data.js" ]; then
    echo "Error: Source files not found. Please run this script from the project root directory."
    exit 1
fi

# Minify CSS
echo "Minifying CSS..."
cat styles.css | tr -d '\n' | sed 's/  */ /g' | sed 's/ *{ */{/g' | sed 's/ *} */}/g' | sed 's/ *: */:/g' | sed 's/ *; */;/g' | sed 's/ *, */,/g' | sed 's/; *}/}/g' > styles.min.css
echo "✓ styles.min.css created"

# Minify JavaScript
echo "Minifying JavaScript..."
cat script.js | sed '/^\/\//d' | sed '/^[[:space:]]*$/d' > script.min.js

# Validate JavaScript syntax
if command -v node &> /dev/null; then
    node -c script.min.js && echo "✓ script.min.js created and validated" || {
        echo "✗ JavaScript minification failed - syntax error detected"
        rm script.min.js
        exit 1
    }
else
    echo "✓ script.min.js created (node not found, skipping validation)"
fi

# Minify structured-data.js
echo "Minifying structured-data.js..."
cat structured-data.js | sed '/^\/\//d' | sed '/^[[:space:]]*$/d' > structured-data.min.js

# Validate structured-data.js syntax
if command -v node &> /dev/null; then
    node -c structured-data.min.js && echo "✓ structured-data.min.js created and validated" || {
        echo "✗ structured-data.js minification failed - syntax error detected"
        rm structured-data.min.js
        exit 1
    }
else
    echo "✓ structured-data.min.js created (node not found, skipping validation)"
fi

# Minify HTML
echo "Minifying HTML..."
# Replace references to non-minified files with minified versions, then minify HTML
sed 's/structured-data\.js/structured-data.min.js/g; s/script\.js/script.min.js/g; s/styles\.css/styles.min.css/g' index.html | tr -d '\n' | sed 's/  */ /g' | sed 's/> </></g' > index.min.html
echo "✓ index.min.html created"

# Show file sizes
echo ""
echo "=== File Size Comparison ==="
echo ""
echo "Original Files:"
ls -lh index.html styles.css script.js structured-data.js | awk '{print $9 ": " $5}'
echo ""
echo "Minified Files:"
ls -lh index.min.html styles.min.css script.min.js structured-data.min.js | awk '{print $9 ": " $5}'

echo ""
echo "Minification complete!"
