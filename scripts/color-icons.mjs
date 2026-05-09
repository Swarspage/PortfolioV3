import fs from 'fs';
import path from 'path';

const dir = './src/assets';
const files = ['tailwind.svg', 'gsap.svg', 'framer-motion.svg', 'threejs.svg', 'vite.svg'];

files.forEach(f => {
  const p = path.join(dir, f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    if (!content.includes('fill=')) {
      content = content.replace('<svg', '<svg fill="#ffffff"');
      fs.writeFileSync(p, content);
      console.log('Added fill to ' + f);
    }
  }
});
