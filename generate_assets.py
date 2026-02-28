import os
from PIL import Image, ImageDraw, ImageFont
import math

# Directories
base_dir = "e:/nike-scrollytelling"
assets_dir = os.path.join(base_dir, "assets")
frames_dir = os.path.join(assets_dir, "frames")
images_dir = os.path.join(assets_dir, "images")

os.makedirs(frames_dir, exist_ok=True)
os.makedirs(images_dir, exist_ok=True)

# Generate 242 frames simulating a running cheetah (simple animated gradient/shapes)
print("Generating 242 frames...")
for i in range(1, 243):
    img = Image.new('RGB', (1920, 1080), color=(10, 10, 10))
    d = ImageDraw.Draw(img)
    
    # Create some moving elements to simulate motion
    offset = (i * 15) % 1920
    # A glowing orb simulating the cheetah
    d.ellipse([(offset, 400), (offset + 200, 600)], fill=(255, 100, 0))
    # Add a blurred effect or lines
    for j in range(5):
        d.line([(offset - j*50, 500), (offset + 100 - j*50, 500)], fill=(200, 50, 0), width=10)
        
    img.save(os.path.join(frames_dir, f'ezgif-frame-{i:03d}.jpg'), quality=70)

# Generate Mockup Images
print("Generating mockup images...")

def create_placeholder(filename, size, color, text):
    img = Image.new('RGB', size, color=color)
    d = ImageDraw.Draw(img)
    # Approximation of text placement
    d.text((size[0]//2 - 50, size[1]//2 - 10), text, fill=(255, 255, 255))
    img.save(os.path.join(images_dir, filename), quality=90)

# Product image for First Look
create_placeholder("pulse-shoe.jpg", (800, 600), (40, 40, 40), "Air Max Pulse")

# Carousel images
create_placeholder("carousel-1.jpg", (600, 600), (150, 50, 50), "Shoe 1")
create_placeholder("carousel-2.jpg", (600, 600), (50, 150, 50), "Shoe 2")
create_placeholder("carousel-3.jpg", (600, 600), (50, 50, 150), "Shoe 3")

# Cinematic Banner
create_placeholder("cinematic-banner.jpg", (1920, 1080), (20, 40, 20), "Forest Banner")

# Essentials Lifestyle Shots
create_placeholder("essentials-mens.jpg", (800, 1200), (30, 30, 30), "Men's")
create_placeholder("essentials-womens.jpg", (800, 1200), (40, 40, 40), "Women's")
create_placeholder("essentials-kids.jpg", (800, 1200), (50, 50, 50), "Kids'")

print("Asset generation complete!")
