FAVICON PLACEHOLDER
===================
The actual favicon.ico will be generated via FLUX image generation.
For now, a placeholder 32x32 SVG-converted-to-ICO will do.
Run the following to generate a quick SVG favicon:

echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8B5CF6"/><stop offset="100%" style="stop-color:#06B6D4"/></linearGradient></defs><rect width="32" height="32" rx="6" fill="url(#g)"/><text x="16" y="24" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="bold" fill="white">T</text></svg>' > public/favicon.svg
