const { Jimp } = require('jimp');

async function removeBackground() {
  const imagePath = process.argv[2] || 'input.jpg';
  const outputPath = process.argv[3] || 'output.png';
  
  console.log(`Processing ${imagePath}...`);
  try {
    const image = await Jimp.read(imagePath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // Scan every pixel
    image.scan(0, 0, width, height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const a = this.bitmap.data[idx + 3];
      
      // Calculate luminosity/brightness
      const brightness = (r + g + b) / 3;
      
      // If it's very dark (black background), make it transparent
      // We set a threshold of 45 (approx 17% brightness)
      if (brightness < 45) {
        this.bitmap.data[idx + 3] = 0; // Set alpha to 0
      } else {
        // Optional: Smooth edge by scaling alpha for dark-ish pixels
        if (brightness < 70) {
          this.bitmap.data[idx + 3] = Math.round((brightness - 45) / (70 - 45) * 255);
        }
      }
    });

    console.log(`Saving to ${outputPath}...`);
    await image.write(outputPath);
    console.log('Success!');
  } catch (err) {
    console.error('Error processing image:', err);
    process.exit(1);
  }
}

removeBackground();
