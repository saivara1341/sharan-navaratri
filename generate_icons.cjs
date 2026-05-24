const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

// Input paths
const sourceImgPath = '/Users/saivaraprasad/.gemini/antigravity-ide/brain/e8ef9e59-e65a-48b3-8d16-114af8fb90e8/media__1779559770414.jpg';
const workspaceDir = '/Users/saivaraprasad/Downloads/siddhidynamics-main';

// Target paths
const publicPath = (file) => path.join(workspaceDir, 'public', file);
const assetsPath = (file) => path.join(workspaceDir, 'src', 'assets', file);

async function generate() {
  console.log('--- STARTING LOGO & FAVICON GENERATION ---');
  try {
    // 1. Load the original high-resolution image
    console.log(`Loading source image: ${sourceImgPath}`);
    const original = await Jimp.read(sourceImgPath);
    const origW = original.bitmap.width;
    const origH = original.bitmap.height;
    console.log(`Original dimensions: ${origW}x${origH}`);

    // Copy original image as siddhi-logo-original.jpg in src/assets
    fs.copyFileSync(sourceImgPath, assetsPath('siddhi-logo-original.jpg'));
    console.log('Saved source copy to siddhi-logo-original.jpg');

    // 2. Create square 1024x1024 transparent canvas and composite to avoid squishing/cropping
    console.log('Compositing original into a 1024x1024 square transparent canvas...');
    const transparentCanvas = new Jimp({
      width: 1024,
      height: 1024,
      color: 0x00000000 // transparent black
    });

    const yOffset = Math.floor((1024 - origH) / 2);
    transparentCanvas.composite(original, 0, yOffset);
    console.log(`Centering completed for transparent canvas (y-offset: ${yOffset}px).`);

    // 2b. Create square 1024x1024 solid black canvas for favicons
    console.log('Compositing original into a 1024x1024 square solid black canvas...');
    const blackCanvas = new Jimp({
      width: 1024,
      height: 1024,
      color: 0x000000ff // pure solid black
    });
    blackCanvas.composite(original, 0, yOffset);
    console.log(`Centering completed for solid black canvas (y-offset: ${yOffset}px).`);

    // 3. Remove black background precisely from transparent canvas for site logos
    console.log('Running anti-aliased background removal on transparent 1024x1024 canvas...');
    let transparentCount = 0;
    transparentCanvas.scan(0, 0, 1024, 1024, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const a = this.bitmap.data[idx + 3];

      // Only process pixels that are part of the original image (not pad space)
      if (a > 0) {
        const brightness = (r + g + b) / 3;

        if (brightness < 45) {
          this.bitmap.data[idx + 3] = 0; // Fully transparent
          transparentCount++;
        } else if (brightness < 70) {
          // Smooth interpolation for nice soft edges
          this.bitmap.data[idx + 3] = Math.round((brightness - 45) / (70 - 45) * 255);
        }
      }
    });
    console.log(`Background removal complete. ${transparentCount} dark pixels made transparent.`);

    // 4. Generate all required solid black PNG favicons
    const faviconTargets = [
      { width: 16, height: 16, dest: publicPath('favicon-16x16.png') },
      { width: 32, height: 32, dest: publicPath('favicon-32x32.png') },
      { width: 48, height: 48, dest: publicPath('favicon-48x48.png') },
      { width: 180, height: 180, dest: publicPath('apple-touch-icon.png') },
      { width: 192, height: 192, dest: publicPath('android-chrome-192x192.png') },
      { width: 512, height: 512, dest: publicPath('android-chrome-512x512.png') },
      { width: 512, height: 512, dest: publicPath('favicon.png') }
    ];

    for (const target of faviconTargets) {
      console.log(`Generating solid black PNG favicon: ${target.width}x${target.height} -> ${path.basename(target.dest)}`);
      const resized = blackCanvas.clone().resize({ w: target.width, h: target.height });
      await resized.write(target.dest);
    }

    // 4b. Generate transparent logos for website UI
    const logoTargets = [
      { width: 512, height: 512, dest: assetsPath('logo.png') },
      { width: 512, height: 512, dest: assetsPath('logo-transparent.png') }
    ];

    for (const target of logoTargets) {
      console.log(`Generating transparent PNG logo: ${target.width}x${target.height} -> ${path.basename(target.dest)}`);
      const resized = transparentCanvas.clone().resize({ w: target.width, h: target.height });
      await resized.write(target.dest);
    }

    // 4c. Copy favicon-32x32.png (which is pure black background) to favicon.ico for older browser compatibility
    fs.copyFileSync(publicPath('favicon-32x32.png'), publicPath('favicon.ico'));
    console.log('Successfully copied black-background favicon-32x32.png to favicon.ico');

    // 5. Generate JPG sizes with solid pure black background (#000000) for Open Graph & sharing cards
    console.log('Generating pure black brand JPGs (#000000 background)...');
    
    // Create 512x512 solid canvas
    const solidCanvas = new Jimp({
      width: 512,
      height: 512,
      color: 0x000000ff // #000000 with full alpha
    });

    const wheel512 = blackCanvas.clone().resize({ w: 512, h: 512 });
    solidCanvas.composite(wheel512, 0, 0);

    const jpgTargets = [
      publicPath('favicon.jpg'),
      assetsPath('siddhi-logo.jpg')
    ];

    for (const dest of jpgTargets) {
      console.log(`Writing JPG: ${path.basename(dest)}`);
      await solidCanvas.write(dest);
    }

    // 6. Generate modern SVG favicon containing the base64-encoded solid black 512x512 PNG
    console.log('Encoding solid black PNG to base64 and creating favicon.svg...');
    const png512Buffer = fs.readFileSync(publicPath('favicon.png'));
    const pngBase64 = png512Buffer.toString('base64');
    
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,${pngBase64}" width="512" height="512" />
</svg>
`;

    fs.writeFileSync(publicPath('favicon.svg'), svgContent, 'utf8');
    console.log('Successfully wrote public/favicon.svg');

    console.log('--- ALL ICON AND LOGO ASSETS SUCCESSFULLY GENERATED ---');
  } catch (err) {
    console.error('Error during generation:', err);
    process.exit(1);
  }
}

generate();
