/**
 * Generate PWA icons from SVG
 *
 * This script converts the base SVG icon to PNG files in required sizes.
 *
 * Usage:
 *   node scripts/generate-icons.js
 *
 * Requirements:
 *   npm install -D sharp
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [192, 512];
const inputSvg = join(__dirname, '../public/icons/icon.svg');

async function generateIcons() {
  try {
    // Try to import sharp (might not be installed)
    const sharp = await import('sharp').catch(() => null);

    if (!sharp) {
      console.log('❌ Sharp not installed.');
      console.log('\nTo generate icons automatically, install sharp:');
      console.log('  npm install -D sharp\n');
      console.log('Then run this script again:');
      console.log('  node scripts/generate-icons.js\n');
      console.log('Alternatively, use one of the methods in public/icons/README.md');
      process.exit(1);
    }

    const svgBuffer = readFileSync(inputSvg);

    for (const size of sizes) {
      const outputPath = join(__dirname, `../public/icons/icon-${size}x${size}.png`);

      await sharp.default(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated: icon-${size}x${size}.png`);
    }

    console.log('\n✨ All icons generated successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify icons in public/icons/');
    console.log('2. Run: npm run dev');
    console.log('3. Check DevTools > Application > Manifest');

  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    console.log('\nFalling back to manual generation.');
    console.log('Please follow instructions in public/icons/README.md');
    process.exit(1);
  }
}

generateIcons();
