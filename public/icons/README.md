# PWA Icons

## Required Icons

For the SmartTreino PWA, you need to generate the following PNG icons:

- `icon-192x192.png` - Standard Android icon
- `icon-512x512.png` - High resolution icon + splash screen

## Generation Methods

### Option 1: Using Online Tool (Recommended)

1. Go to [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload the `icon.svg` file
3. Configure:
   - Android Chrome: 192x192 and 512x512
   - iOS: 180x180
   - Ensure "maskable" safe zone (80% centered)
4. Download and extract to this directory

### Option 2: Using ImageMagick (CLI)

```bash
# Install ImageMagick first
# Then convert SVG to PNG:

convert -background none -resize 192x192 icon.svg icon-192x192.png
convert -background none -resize 512x512 icon.svg icon-512x512.png
```

### Option 3: Using Node.js Script

```bash
npm install -g sharp-cli
sharp -i icon.svg -o icon-192x192.png resize 192 192
sharp -i icon.svg -o icon-512x512.png resize 512 512
```

### Option 4: Manual Design

If you want to create custom icons:
- Use Figma, Adobe Illustrator, or any design tool
- Export at 192x192 and 512x512
- Use theme color: `#1677ff`
- Include maskable safe zone (80% centered content)
- Format: PNG with transparency

## Current Status

⚠️ **ACTION REQUIRED**: The PNG icons have not been generated yet.

The `icon.svg` file is a placeholder. Please use one of the methods above to generate the required PNG files before deploying the PWA.

## Verification

After generating the icons, verify them:

1. Check file sizes:
   - icon-192x192.png should be ~5-15 KB
   - icon-512x512.png should be ~15-50 KB

2. Test in browser:
   - DevTools > Application > Manifest
   - Icons should appear without errors

3. Test installation on mobile device
