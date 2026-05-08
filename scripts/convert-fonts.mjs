/**
 * convert-fonts.mjs
 * Run: node scripts/convert-fonts.mjs
 * Converts Outfit TTF and Gasdrifo OTF to WOFF2 using wawoff2 (pure WASM, no native binaries).
 * Install first: npm i -D wawoff2
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(__dirname, '../public/fonts');

async function convert(inFile, outFile) {
  const { compress } = await import('wawoff2');
  const input = readFileSync(inFile);
  const output = await compress(input);
  writeFileSync(outFile, Buffer.from(output));
  const inKB  = Math.round(input.length  / 1024);
  const outKB = Math.round(output.length / 1024);
  console.log(`✅ ${inFile.split(/[\\/]/).pop()} → ${outFile.split(/[\\/]/).pop()}: ${inKB}KB → ${outKB}KB`);
}

console.log('🔤 Converting fonts to WOFF2…\n');
await convert(join(fontsDir, 'Outfit-VariableFont_wght.ttf'), join(fontsDir, 'Outfit-VariableFont_wght.woff2'));
await convert(join(fontsDir, 'NCLGasdrifo-Demo.otf'),         join(fontsDir, 'NCLGasdrifo-Demo.woff2'));
console.log('\n✨ Done! Update index.css and index.html to reference the new .woff2 files.');
