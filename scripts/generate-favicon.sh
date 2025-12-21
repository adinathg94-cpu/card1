#!/bin/bash

LOGO_PATH="public/images/cardlogo.png"
OUTPUT_DIR="public"

# Check if logo exists
if [ ! -f "$LOGO_PATH" ]; then
    echo "Error: Logo not found at $LOGO_PATH"
    exit 1
fi

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    CONVERT_CMD="convert"
elif command -v magick &> /dev/null; then
    CONVERT_CMD="magick"
else
    echo "Error: ImageMagick (convert or magick) not found"
    echo "Please install ImageMagick: sudo apt-get install imagemagick"
    exit 1
fi

echo "Generating favicons from logo..."

# Generate favicon sizes
$CONVERT_CMD "$LOGO_PATH" -resize 16x16 -background transparent -gravity center -extent 16x16 "$OUTPUT_DIR/favicon-16x16.png"
echo "✓ Generated favicon-16x16.png"

$CONVERT_CMD "$LOGO_PATH" -resize 32x32 -background transparent -gravity center -extent 32x32 "$OUTPUT_DIR/favicon-32x32.png"
echo "✓ Generated favicon-32x32.png"

$CONVERT_CMD "$LOGO_PATH" -resize 96x96 -background transparent -gravity center -extent 96x96 "$OUTPUT_DIR/favicon-96x96.png"
echo "✓ Generated favicon-96x96.png"

$CONVERT_CMD "$LOGO_PATH" -resize 192x192 -background transparent -gravity center -extent 192x192 "$OUTPUT_DIR/android-chrome-192x192.png"
echo "✓ Generated android-chrome-192x192.png"

$CONVERT_CMD "$LOGO_PATH" -resize 512x512 -background transparent -gravity center -extent 512x512 "$OUTPUT_DIR/android-chrome-512x512.png"
echo "✓ Generated android-chrome-512x512.png"

$CONVERT_CMD "$LOGO_PATH" -resize 180x180 -background transparent -gravity center -extent 180x180 "$OUTPUT_DIR/apple-touch-icon.png"
echo "✓ Generated apple-touch-icon.png"

# Generate ICO file (using 32x32)
$CONVERT_CMD "$LOGO_PATH" -resize 32x32 -background transparent -gravity center -extent 32x32 "$OUTPUT_DIR/favicon.ico"
echo "✓ Generated favicon.ico"

# Create site.webmanifest
cat > "$OUTPUT_DIR/site.webmanifest" << EOF
{
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
EOF
echo "✓ Generated site.webmanifest"

echo ""
echo "✅ All favicons generated successfully!"
