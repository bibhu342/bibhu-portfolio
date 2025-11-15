# Image Optimization Script for Portfolio (PowerShell)
# This script generates WebP versions and responsive sizes for all image assets
#
# Prerequisites:
# - Install cwebp: Download from https://developers.google.com/speed/webp/download
# - Install ImageMagick: Download from https://imagemagick.org/script/download.php#windows
# - Add both to your PATH environment variable
#

Write-Host "🖼️  Starting portfolio image optimization..." -ForegroundColor Cyan

# Check if required tools are available
$cwebpAvailable = Get-Command "cwebp" -ErrorAction SilentlyContinue
$convertAvailable = Get-Command "magick" -ErrorAction SilentlyContinue

if (-not $cwebpAvailable) {
    Write-Host "❌ cwebp not found. Please install WebP tools from https://developers.google.com/speed/webp/download" -ForegroundColor Red
    exit 1
}

if (-not $convertAvailable) {
    Write-Host "❌ ImageMagick not found. Please install from https://imagemagick.org/script/download.php#windows" -ForegroundColor Red
    exit 1
}

# Create WebP versions of existing assets
Write-Host "Creating WebP versions..." -ForegroundColor Yellow

# Original OG image (1200x630) -> WebP
& cwebp -q 85 -m 6 "assets/og-image.png" -o "assets/og-image.webp"
Write-Host "✅ Created assets/og-image.webp" -ForegroundColor Green

# Favicon (32x32) -> WebP  
& cwebp -q 85 -m 6 "assets/favicon.png" -o "assets/favicon.webp"
Write-Host "✅ Created assets/favicon.webp" -ForegroundColor Green

# Apple touch icon (180x180) -> WebP
& cwebp -q 85 -m 6 "assets/apple-touch-icon.png" -o "assets/apple-touch-icon.webp"
Write-Host "✅ Created assets/apple-touch-icon.webp" -ForegroundColor Green

# Create responsive sizes for OG image
Write-Host "Creating responsive OG image sizes..." -ForegroundColor Yellow

# Medium size: 800x420 (2:1 ratio maintained)
& magick "assets/og-image.png" -resize "800x420^" -gravity center -extent "800x420" "assets/og-image-800.png"
& cwebp -q 85 -m 6 "assets/og-image-800.png" -o "assets/og-image-800.webp"
Write-Host "✅ Created assets/og-image-800.png and assets/og-image-800.webp" -ForegroundColor Green

# Mobile size: 480x252 (2:1 ratio maintained)  
& magick "assets/og-image.png" -resize "480x252^" -gravity center -extent "480x252" "assets/og-image-480.png"
& cwebp -q 85 -m 6 "assets/og-image-480.png" -o "assets/og-image-480.webp"
Write-Host "✅ Created assets/og-image-480.png and assets/og-image-480.webp" -ForegroundColor Green

# Display file sizes
Write-Host ""
Write-Host "📊 File size comparison:" -ForegroundColor Cyan
Write-Host "Original files:" -ForegroundColor White
Get-ChildItem assets -Filter "*.png", "*.svg", "*.ico" | ForEach-Object { 
    $size = [math]::Round($_.Length/1KB, 2)
    Write-Host "$($_.Name): $size KB" -ForegroundColor Gray
}

Write-Host ""
Write-Host "WebP versions:" -ForegroundColor White
Get-ChildItem assets -Filter "*.webp" -ErrorAction SilentlyContinue | ForEach-Object { 
    $size = [math]::Round($_.Length/1KB, 2)
    Write-Host "$($_.Name): $size KB" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎉 Image optimization complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary of created files:" -ForegroundColor Cyan
Write-Host "- assets/og-image.webp (1200×630)" -ForegroundColor White
Write-Host "- assets/og-image-800.webp (800×420)" -ForegroundColor White
Write-Host "- assets/og-image-800.png (800×420)" -ForegroundColor White
Write-Host "- assets/og-image-480.webp (480×252)" -ForegroundColor White
Write-Host "- assets/og-image-480.png (480×252)" -ForegroundColor White
Write-Host "- assets/favicon.webp (32×32)" -ForegroundColor White
Write-Host "- assets/apple-touch-icon.webp (180×180)" -ForegroundColor White
Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Cyan
Write-Host "1. Test the portfolio locally to ensure all images load" -ForegroundColor White
Write-Host "2. Commit and push the new image files" -ForegroundColor White
Write-Host "3. Verify social media previews work correctly" -ForegroundColor White
Write-Host "4. Run Lighthouse audit to confirm performance improvements" -ForegroundColor White