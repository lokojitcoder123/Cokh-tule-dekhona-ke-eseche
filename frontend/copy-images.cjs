const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\LOKOJIT\\.gemini\\antigravity-ide\\brain\\9ac8363b-479f-455c-8f45-bafb814aa789';
const destDir = path.join(__dirname, 'public', 'images');

const imageFiles = {
  'media__1783108395900.jpg': 'girl1.jpg',
  'media__1783108423201.png': 'girl2.png',
  'media__1783108442123.jpg': 'girl3.jpg',
  'media__1783108466758.png': 'girl4.png',
  'media__1783108505210.png': 'girl5.png'
};

try {
  // Ensure destination directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log('Created directory:', destDir);
  }

  // Copy files
  for (const [srcName, destName] of Object.entries(imageFiles)) {
    const srcPath = path.join(srcDir, srcName);
    const destPath = path.join(destDir, destName);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcName} to ${destName}`);
    } else {
      console.warn(`Source file not found: ${srcPath}`);
    }
  }
  console.log('Demo profile pictures initialization complete.');
} catch (err) {
  console.error('Error during copying demo images:', err);
}
