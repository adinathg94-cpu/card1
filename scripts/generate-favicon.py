#!/usr/bin/env python3
import sys
import json
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: PIL (Pillow) not installed. Install with: pip install Pillow")
    sys.exit(1)

LOGO_PATH = Path("public/images/cardlogo.png")
OUTPUT_DIR = Path("public")

# Check if logo exists
if not LOGO_PATH.exists():
    print(f"Error: Logo not found at {LOGO_PATH}")
    sys.exit(1)

print("Generating favicons from logo...")

# Open the logo
logo = Image.open(LOGO_PATH)

# Standard favicon sizes
sizes = [
    (16, "favicon-16x16.png"),
    (32, "favicon-32x32.png"),
    (96, "favicon-96x96.png"),
    (192, "android-chrome-192x192.png"),
    (512, "android-chrome-512x512.png"),
    (180, "apple-touch-icon.png"),
]

# Generate each size
for size, filename in sizes:
    # Resize maintaining aspect ratio, then create square with transparent background
    resized = logo.resize((size, size), Image.Resampling.LANCZOS)
    output_path = OUTPUT_DIR / filename
    resized.save(output_path, "PNG")
    print(f"✓ Generated {filename} ({size}x{size})")

# Generate ICO file (using 32x32)
ico = logo.resize((32, 32), Image.Resampling.LANCZOS)
ico.save(OUTPUT_DIR / "favicon.ico", "ICO")
print("✓ Generated favicon.ico")

# Create site.webmanifest
manifest = {
    "name": "CARD",
    "short_name": "CARD",
    "icons": [
        {
            "src": "/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone"
}

manifest_path = OUTPUT_DIR / "site.webmanifest"
with open(manifest_path, "w") as f:
    json.dump(manifest, f, indent=2)
print("✓ Generated site.webmanifest")

print("\n✅ All favicons generated successfully!")
