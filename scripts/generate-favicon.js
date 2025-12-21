import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, '../public/images/cardlogo.png');
const outputDir = path.join(__dirname, '../public');

// Standard favicon sizes
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' }, // Apple touch icon
];

async function generateFavicons() {
  try {
    console.log('Generating favicons from logo...');

    // Check if logo exists
    if (!fs.existsSync(logoPath)) {
      console.error(`Logo not found at ${logoPath}`);
      process.exit(1);
    }

    // Generate each size
    for (const { size, name } of sizes) {
      const outputPath = path.join(outputDir, name);

      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${name} (${size}x${size})`);
    }

    // Generate ICO file (16x16 and 32x32 combined)
    const ico16 = await sharp(logoPath)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toBuffer();

    const ico32 = await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toBuffer();

    // For ICO, we'll just copy the 32x32 as favicon.ico (simplified approach)
    // Most modern browsers accept PNG as favicon.ico
    fs.writeFileSync(
      path.join(outputDir, 'favicon.ico'),
      ico32
    );
    console.log('✓ Generated favicon.ico');

    // Create site.webmanifest for Android
    const manifest = {
      name: 'CARD',
      short_name: 'CARD',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone'
    };

    fs.writeFileSync(
      path.join(outputDir, 'site.webmanifest'),
      JSON.stringify(manifest, null, 2)
    );
    console.log('✓ Generated site.webmanifest');

    console.log('\n✅ All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
