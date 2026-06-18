const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

// Reads mobile/assets/branding/logo.svg and generates PNG icons per app-icon-sizes.json
async function run() {
  const root = path.resolve(__dirname, '..');
  const brandingDir = path.join(root, 'mobile', 'assets', 'branding');
  const svgPath = path.join(brandingDir, 'logo.svg');
  const sizesFile = path.join(brandingDir, 'app-icon-sizes.json');

  if (!fs.existsSync(svgPath)) {
    console.error('logo.svg not found at', svgPath);
    process.exit(1);
  }

  if (!fs.existsSync(sizesFile)) {
    console.error('app-icon-sizes.json not found at', sizesFile);
    process.exit(1);
  }

  const sizes = JSON.parse(await fs.readFile(sizesFile, 'utf8'));
  const outDir = path.join(brandingDir, 'generated-icons');
  await fs.ensureDir(outDir);

  // Flatten sizes (android ios favicons + store sizes)
  const allSizes = new Set();
  if (sizes.android) sizes.android.forEach((s) => allSizes.add(s));
  if (sizes.ios) sizes.ios.forEach((s) => allSizes.add(s));
  if (sizes.favicons) sizes.favicons.forEach((s) => allSizes.add(s));
  if (sizes.playStore) allSizes.add(sizes.playStore);
  if (sizes.appStore) allSizes.add(sizes.appStore);

  console.log('Generating icons for sizes:', [...allSizes].sort((a,b)=>a-b));

  for (const size of [...allSizes]) {
    const out = path.join(outDir, `icon-${size}x${size}.png`);
    console.log('Writing', out);
    await sharp(svgPath)
      .resize(size, size, { fit: 'contain' })
      .png({ quality: 100 })
      .toFile(out);
  }

  console.log('Icons generated in', outDir);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
