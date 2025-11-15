from PIL import Image, ImageDraw, ImageFont
import os

# Create assets directory if it doesn't exist
os.makedirs("assets", exist_ok=True)

# Create a 32x32 favicon with dark navy background
img = Image.new("RGBA", (32, 32), (15, 23, 42, 255))  # dark navy bg
draw = ImageDraw.Draw(img)

# Try to use a system font, fallback to default
try:
    font = ImageFont.truetype("arial.ttf", 18)
except:
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 18)
    except:
        font = ImageFont.load_default()

# Draw "BB" initials in white
draw.text((6, 5), "BB", font=font, fill=(255, 255, 255, 255))

# Save as PNG
img.save("assets/favicon.png")
print("✅ Favicon created -> assets/favicon.png")

# Also create an ICO version for better browser compatibility
img.save("assets/favicon.ico")
print("✅ Favicon created -> assets/favicon.ico")