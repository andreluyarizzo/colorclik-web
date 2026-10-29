const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const originalAssets = {
  gaze: ['original.webp', 'center.webp', 'hero-scrub.mp4'],
  marketing: ['hero.webp', 'hero.png', 'pointing.webp', 'hero-motion.mp4', 'hero-motion-mobile.mp4', 'hero-motion-poster.webp'],
  web: ['hero.webp', 'hero.png', 'pointing.webp', 'contact.webp', 'hero-motion.mp4', 'hero-motion-mobile.mp4', 'hero-motion-poster.webp'],
  branding: ['hero.webp', 'hero.png', 'pointing.webp', 'contact.webp', 'feature.webp', 'hero-motion.mp4', 'hero-motion-mobile.mp4', 'hero-motion-poster.webp'],
  social: ['hero.webp', 'hero.png', 'pointing.webp', 'contact.webp', 'feature.webp', 'hero-motion.mp4', 'hero-motion-mobile.mp4', 'hero-motion-poster.webp'],
  custom: ['hero.webp', 'hero.png', 'pointing.webp', 'contact.webp', 'feature.webp', 'hero-motion.mp4', 'hero-motion-mobile.mp4', 'hero-motion-poster.webp'],
};

test('Original ColorClik character assets remain available for fallback', () => {
  for (const [service, filenames] of Object.entries(originalAssets)) {
    for (const filename of filenames) {
      const filepath = path.join(root, 'docs', 'assets', service, filename);
      assert.ok(fs.existsSync(filepath), `Missing original asset: ${service}/${filename}`);
      assert.ok(fs.statSync(filepath).size > 0, `Empty original asset: ${service}/${filename}`);
    }
  }
});

test('The original gaze motion model remains available', () => {
  assert.ok(fs.existsSync(path.join(root, 'src', 'gaze-motion.mjs')));
  assert.ok(fs.existsSync(path.join(root, 'src', 'gaze.jsx')));
});
