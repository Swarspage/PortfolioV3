/**
 * compress-images.mjs
 * Run: node scripts/compress-images.mjs
 *
 * Writes optimised WebP copies to src/assets-opt/ (mirrors the src/assets/ tree).
 * Because Windows holds file locks on source assets via VS Code / Vite watchers,
 * we never overwrite in-place — we write to a separate output directory.
 *
 * After running:
 *   1. Close VS Code (or at least close any tabs showing the images)
 *   2. Manually replace src/assets/ files with the ones from src/assets-opt/
 *   OR keep assets-opt as the authoritative source and update import paths.
 *   The easiest approach: just copy the output files over in Explorer.
 */
import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync } from 'fs';
import { join, extname, basename, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const SRC_DIR = join(__dirname, '../src/assets');
const OUT_DIR = join(__dirname, '../src/assets-opt');

// ── Target max widths (2× largest CSS display size) ──────────────────────────
const FILE_CFG = {
  'image.webp':                           { maxW: 900,  q: 80 },
  'RecipeAi.webp':                        { maxW: 1400, q: 80 },
  'sims.webp':                            { maxW: 1400, q: 80 },
  'Singularity.webp':                     { maxW: 1400, q: 80 },
  'Skilltube.webp':                       { maxW: 1400, q: 82 },
  'Vayu.webp':                            { maxW: 1400, q: 82 },
  'internshipGroupPhoto.webp':            { maxW: 1200, q: 78 },
  'InternCertificate.webp':              { maxW: 1200, q: 78 },
  'soloInternHODPic.webp':               { maxW: 1200, q: 78 },
  'codeAThon2.0withTeam.webp':           { maxW: 1200, q: 78 },
  'Tabletennisdoubles2ndprize.webp':     { maxW: 1200, q: 78 },
  'LetterofAppreciationInternship.webp': { maxW: 1200, q: 78 },
  'LOA.webp':                            { maxW: 1200, q: 78 },
  'CodeAThonehackthon.webp':             { maxW: 1200, q: 78 },
  'utubebanner.webp':                    { maxW: 1200, q: 75 },
};

const SKIP_BELOW_BYTES = 30 * 1024;
const EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png']);

async function processFile(srcPath) {
  const name       = basename(srcPath);
  const rel        = relative(SRC_DIR, srcPath);
  const outPath    = join(OUT_DIR, rel);
  const outFolder  = dirname(outPath);
  const sizeBefore = statSync(srcPath).size;

  // Ensure output directory exists
  mkdirSync(outFolder, { recursive: true });

  if (sizeBefore < SKIP_BELOW_BYTES) {
    // Copy small file as-is (sharp re-encode would waste time, file is already tiny)
    const { copyFileSync } = await import('fs');
    copyFileSync(srcPath, outPath);
    console.log(`⏭  ${name} (${Math.round(sizeBefore / 1024)}KB) — copied as-is (icon)`);
    return;
  }

  const cfg = FILE_CFG[name] ?? { maxW: 1200, q: 80 };

  try {
    const img        = sharp(srcPath);
    const { width }  = await img.metadata();

    await img
      .resize(width > cfg.maxW ? { width: cfg.maxW, withoutEnlargement: true } : undefined)
      .webp({ quality: cfg.q })
      .toFile(outPath);

    const sizeAfter = statSync(outPath).size;
    const pct       = Math.round((1 - sizeAfter / sizeBefore) * 100);
    console.log(`✅ ${name}: ${Math.round(sizeBefore / 1024)}KB → ${Math.round(sizeAfter / 1024)}KB (−${pct}%)`);
  } catch (err) {
    console.error(`❌ ${name}: ${err.message}`);
  }
}

async function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (EXTS.has(extname(entry.name).toLowerCase())) await processFile(full);
  }
}

console.log(`🗜  Compressing images…`);
console.log(`   Input : ${SRC_DIR}`);
console.log(`   Output: ${OUT_DIR}\n`);

await walk(SRC_DIR);

console.log(`
✨ Done!

Next steps:
  1. Open src/assets-opt/ in Explorer
  2. Copy the compressed files back into src/assets/ (replacing originals)
     — or just close VS Code first and re-run with in-place mode.
  3. Run \`npm run build\` to verify bundle sizes.
`);
