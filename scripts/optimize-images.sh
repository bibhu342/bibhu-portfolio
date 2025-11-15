#!/bin/bash
# 
# Image Optimization Script for Portfolio
# This script generates WebP versions and responsive sizes for all image assets
#
# Prerequisites:
# - Install cwebp: brew install webp (macOS) or apt-get install webp (Ubuntu)  
# - Install ImageMagick: brew install imagemagick (macOS) or apt-get install imagemagick (Ubuntu)
#

echo "🖼️  Starting portfolio image optimization..."

# Create WebP versions of existing assets
echo "Creating WebP versions..."

# Original OG image (1200x630) -> WebP
cwebp -q 85 -m 6 assets/og-image.png -o assets/og-image.webp
echo "✅ Created assets/og-image.webp"

# Favicon (32x32) -> WebP  
cwebp -q 85 -m 6 assets/favicon.png -o assets/favicon.webp
echo "✅ Created assets/favicon.webp"

# Apple touch icon (180x180) -> WebP
cwebp -q 85 -m 6 assets/apple-touch-icon.png -o assets/apple-touch-icon.webp  
echo "✅ Created assets/apple-touch-icon.webp"

# Create responsive sizes for OG image
echo "Creating responsive OG image sizes..."

# Medium size: 800x420 (2:1 ratio maintained)
convert assets/og-image.png -resize 800x420^ -gravity center -extent 800x420 assets/og-image-800.png
cwebp -q 85 -m 6 assets/og-image-800.png -o assets/og-image-800.webp
echo "✅ Created assets/og-image-800.png and assets/og-image-800.webp"

# Mobile size: 480x252 (2:1 ratio maintained)  
convert assets/og-image.png -resize 480x252^ -gravity center -extent 480x252 assets/og-image-480.png
cwebp -q 85 -m 6 assets/og-image-480.png -o assets/og-image-480.webp
echo "✅ Created assets/og-image-480.png and assets/og-image-480.webp"

# Display file sizes
echo ""
echo "📊 File size comparison:"
echo "Original files:"
ls -lh assets/*.png assets/*.svg assets/*.ico | awk '{print $9 ": " $5}'

echo ""
echo "WebP versions:"
ls -lh assets/*.webp 2>/dev/null | awk '{print $9 ": " $5}' || echo "WebP files will be created after running this script"

echo ""
echo "🎉 Image optimization complete!"
echo ""
echo "📋 Summary of created files:"
echo "- assets/og-image.webp (1200×630)"
echo "- assets/og-image-800.webp (800×420)" 
echo "- assets/og-image-800.png (800×420)"
echo "- assets/og-image-480.webp (480×252)"
echo "- assets/og-image-480.png (480×252)"
echo "- assets/favicon.webp (32×32)"
echo "- assets/apple-touch-icon.webp (180×180)"
echo ""
echo "💡 Next steps:"
echo "1. Test the portfolio locally to ensure all images load"
echo "2. Commit and push the new image files"
echo "3. Verify social media previews work correctly"
echo "4. Run Lighthouse audit to confirm performance improvements"