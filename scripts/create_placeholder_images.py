#!/usr/bin/env python3
"""
Create placeholder images for portfolio website
Generates professional-looking placeholder images for missing assets
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder_image(width, height, text, filename, bg_color="#f1f5f9", text_color="#334155"):
    """Create a placeholder image with centered text"""
    # Create image
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a nice font, fall back to default if not available
    try:
        # Try different font paths for cross-platform compatibility
        font_paths = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",  # Linux
            "C:\\Windows\\Fonts\\arialbd.ttf",  # Windows
            "/System/Library/Fonts/Helvetica.ttc",  # macOS
        ]
        font = None
        for path in font_paths:
            if os.path.exists(path):
                font = ImageFont.truetype(path, 40)
                break
        if font is None:
            font = ImageFont.load_default()
    except:
        font = ImageFont.load_default()
    
    # Calculate text position for centering
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Draw text
    draw.text((x, y), text, fill=text_color, font=font)
    
    # Draw border
    draw.rectangle([0, 0, width-1, height-1], outline="#cbd5e1", width=2)
    
    # Save image
    img.save(filename, 'PNG', optimize=True)
    print(f"✓ Created: {filename}")

def create_profile_placeholder():
    """Create a professional profile image placeholder"""
    size = 400
    img = Image.new('RGB', (size, size), "#3b82f6")
    draw = ImageDraw.Draw(img)
    
    # Draw circle
    margin = 50
    draw.ellipse([margin, margin, size-margin, size-margin], fill="#60a5fa", outline="#1e40af", width=3)
    
    # Draw initials
    try:
        font_paths = [
            "C:\\Windows\\Fonts\\arialbd.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ]
        font = None
        for path in font_paths:
            if os.path.exists(path):
                font = ImageFont.truetype(path, 120)
                break
        if font is None:
            font = ImageFont.load_default()
    except:
        font = ImageFont.load_default()
    
    text = "BB"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - 10
    
    draw.text((x, y), text, fill="white", font=font)
    
    return img

def main():
    """Generate all placeholder images"""
    print("🎨 Creating placeholder images for portfolio...")
    print()
    
    # Base directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assets_dir = os.path.join(base_dir, 'assets', 'images')
    
    # Create directories if they don't exist
    os.makedirs(os.path.join(assets_dir, 'projects'), exist_ok=True)
    os.makedirs(os.path.join(assets_dir, 'logos'), exist_ok=True)
    
    # 1. Profile image
    print("Creating profile image...")
    profile_img = create_profile_placeholder()
    profile_img.save(os.path.join(assets_dir, 'profile.jpg'), 'JPEG', quality=90, optimize=True)
    print(f"✓ Created: {os.path.join(assets_dir, 'profile.jpg')}")
    print()
    
    # 2. Project images
    print("Creating project images...")
    projects = [
        ("csv-cleaner.png", "CSV Data Cleaner\nPython • Pandas"),
        ("web-scraper.png", "Web Scraping Suite\nPython • Scrapy"),
        ("pdf-parser.png", "PDF Parser Pro\nPython • FastAPI")
    ]
    
    for filename, text in projects:
        create_placeholder_image(
            800, 450, text, 
            os.path.join(assets_dir, 'projects', filename),
            bg_color="#e0f2fe",
            text_color="#075985"
        )
    print()
    
    # 3. Favicon images (copy from root if they exist, otherwise create)
    print("Checking favicons...")
    favicon_files = ['favicon-32x32.png', 'favicon-16x16.png']
    
    for size, filename in [(32, 'favicon-32x32.png'), (16, 'favicon-16x16.png')]:
        target = os.path.join(assets_dir, filename)
        if not os.path.exists(target):
            # Create simple favicon
            img = Image.new('RGB', (size, size), "#007bff")
            draw = ImageDraw.Draw(img)
            
            # Draw "B" or simple shape
            try:
                font = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", size // 2)
            except:
                font = ImageFont.load_default()
            
            text = "B"
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            x = (size - text_width) // 2
            y = (size - text_height) // 2
            
            draw.text((x, y), text, fill="white", font=font)
            img.save(target, 'PNG', optimize=True)
            print(f"✓ Created: {target}")
    
    # Move existing apple-touch-icon if it exists
    source_icon = os.path.join(base_dir, 'assets', 'apple-touch-icon.png')
    target_icon = os.path.join(assets_dir, 'apple-touch-icon.png')
    if os.path.exists(source_icon) and not os.path.exists(target_icon):
        import shutil
        shutil.copy2(source_icon, target_icon)
        print(f"✓ Copied: apple-touch-icon.png")
    
    # Move or create og-image
    source_og = os.path.join(base_dir, 'assets', 'og-image.png')
    target_og = os.path.join(assets_dir, 'og-image.png')
    if os.path.exists(source_og) and not os.path.exists(target_og):
        import shutil
        shutil.copy2(source_og, target_og)
        print(f"✓ Copied: og-image.png")
    elif not os.path.exists(target_og):
        # Create OG image
        create_placeholder_image(
            1200, 630,
            "Bibhudendu Behera\nCX Leader & AI Engineer",
            target_og,
            bg_color="#1e40af",
            text_color="white"
        )
    
    print()
    print("✅ All placeholder images created successfully!")
    print()
    print("📝 Next steps:")
    print("   1. Replace placeholders with actual images when available")
    print("   2. Profile image: assets/images/profile.jpg")
    print("   3. Project images: assets/images/projects/*.png")
    print("   4. Optimize images with: npm run optimize:images")

if __name__ == "__main__":
    main()
