const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        results.push(file);
      }
    }
  });
  return results;
};

const compressImages = async () => {
  const files = walk(__dirname);
  console.log(`Found ${files.length} images to compress.`);
  for (const file of files) {
    try {
      const buffer = fs.readFileSync(file);
      await sharp(buffer)
        .resize({ width: 1200, withoutEnlargement: true }) // Resize to max 1200px width
        .jpeg({ quality: 60, progressive: true }) // Compress quality
        .toFile(file);
      console.log(`Compressed: ${file}`);
    } catch (e) {
      console.error(`Error compressing ${file}:`, e.message);
    }
  }
};

compressImages();
