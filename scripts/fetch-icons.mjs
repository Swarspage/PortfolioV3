import fs from 'fs';
import https from 'https';
import path from 'path';

const iconsToFetch = [
  { name: 'tailwind.svg', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/tailwindcss.svg' },
  { name: 'gsap.svg', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/greensock.svg' },
  { name: 'framer-motion.svg', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/framer.svg' },
  { name: 'threejs.svg', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/threedotjs.svg' }, // Threedotjs is the slug
  { name: 'vite.svg', url: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vite.svg' },
];

const destDir = path.resolve('./src/assets');

iconsToFetch.forEach(({ name, url }) => {
  const filePath = path.join(destDir, name);
  const file = fs.createWriteStream(filePath);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${name}`);
    });
  }).on('error', (err) => {
    fs.unlink(filePath, () => {});
    console.error(`Error downloading ${name}: ${err.message}`);
  });
});
